import { NextRequest, NextResponse } from "next/server";
import { Spec } from "@/src/generated/prisma";
import { prisma } from "@/src/utils/prisma";
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config({ path: "../../../../.env" });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const spec = JSON.parse(formData.get("spec") as string) as Spec;
  const proofType = formData.get("proofType") as string;
  const context = formData.get("context") as string | null;
  const proof = formData.get("proof");
  const auditId = formData.get("auditId") as unknown as number;

  let proofContent = "";
  let fileUrl: string | null = null;

  if (proofType === "text") {
    proofContent = formData.get("proof") as string;
  } else {
    const file = formData.get("proof") as File;
    if (file) {
      // TODO: database suff
      fileUrl = `https://fake-storage/${file.name}`;
      proofContent = `User uploaded a ${proofType} file: ${fileUrl}`;
    }
  }

  if (!spec || !proofType || (!proofContent && !fileUrl)) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const prompt = `
You are a compliance auditor. Rate how well the proof and context meet the specification.

Spec Name: ${spec.name}
Spec Description: ${spec.description}
Spec Maximum rating: ${spec.maxRating}
User Proof: "${proofContent}"
User Context: "${context}"

Rate the compliance on a scale from 0 to ${spec.maxRating}, where 0 = does not meet the spec at all, and ${spec.maxRating} = fully meets the spec.
If the Proof and/or the Context has nothing to do with the description, Give a score of 0 
The proof should have some level of authority that shows that it meets the requirments. Chance of user lying so be careful

Respond ONLY with a JSON object like:
{"score": <number between 0 and ${spec.maxRating}>, "feedback": "short explanation for this score."}
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-5-nano",
      messages: [{ role: "user", content: prompt }],
    });

    const rawResponse = completion.choices[0].message?.content;

    let data = { score: -1, feedback: "Could not parse response" };
    try {
      if (rawResponse) {
        data = JSON.parse(rawResponse);
      }
    } catch (err) {
      console.error("GPT JSON parse error:", rawResponse);
    }

    // ✅ Save to DB and await
    const newAuditSpecEntity = await prisma.auditSpec.create({
      data: {
        auditId: auditId,
        specId: spec.id,
        evaluatedRating: data.score,
        context: context,
        feedback: data.feedback,
      },
    });

    // ✅ Return the DB entity (contains id, auditId, specId, etc.)
    return NextResponse.json(newAuditSpecEntity);
  } catch (err) {
    console.error("OpenAI API error:", err);
    return NextResponse.json({ error: "OpenAI API error" }, { status: 500 });
  }
}
