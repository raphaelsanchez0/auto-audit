import { NextRequest, NextResponse } from "next/server";
import { Spec } from "@/src/generated/prisma";
import { prisma } from "@/src/utils/prisma";
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config({ path: "../../../../.env" });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const body: { spec: Spec; proof: string; context: string; auditId: number } =
    await req.json();

  if (!body.spec || !body.proof || !body.context) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const prompt = `
You are a compliance auditor. Rate how well the proof and context meet the specification.

Specification Info:
Spec Name: ${body.spec.name}
Spec Description: ${body.spec.description}
Spec Maximum rating: ${body.spec.maxRating}
User Proof: "${body.proof}"
User Context: "${body.context}"

Rate the compliance on a scale from 0 to ${body.spec.maxRating}, where 0 = does not meet the spec at all, and ${body.spec.maxRating} = fully meets the spec. 

Respond ONLY with a JSON object like:
{"score": <number between 0 and ${body.spec.maxRating}>, "feedback": "short explanation for this score."}
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
        auditId: body.auditId,
        specId: body.spec.id,
        evaluatedRating: data.score,
        context: body.context,
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
