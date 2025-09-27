import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: NextRequest) {
  const { spec, proof, context, maxScore } = await req.json()

  if (!spec || !proof || !context || !maxScore) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const prompt = `
You are a compliance auditor. Rate how well the proof and context meet the specification.

Specification: "${spec}"
User Proof: "${proof}"
User Context: "${context}"

Rate the compliance on a scale from 0 to ${maxScore}, where 0 = does not meet the spec at all, and ${maxScore} = fully meets the spec. 

Respond ONLY with a JSON object like:
{"score": <number between 0 and ${maxScore}>, "feedback": "short explanation for this score."}
`

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-5-nano",
      messages: [{ role: "user", content: prompt }],
    })

    const rawResponse = completion.choices[0].message?.content

    let data = { score: -1, feedback: "Could not parse response" }
    try {
      data = JSON.parse(rawResponse!)
    } catch (err) {
      console.error("GPT JSON parse error:", rawResponse)
    }

    return NextResponse.json(data)
  } catch (err) {
    console.error("OpenAI API error:", err)
    return NextResponse.json({ error: "OpenAI API error" }, { status: 500 })
  }
}
