const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config({ path: "../../../../.env" }); // loads OPENAI_API_KEY

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

async function testScore() {
  const spec = "All admin accounts must use multi-factor authentication (MFA).";
  const proof = "Admin accounts require a password and a TOTP code.";
  const context = "MFA is enforced for all admin accounts, and tested for a sample of 10 users.";
  const maxScore = 5;

  const prompt = `
You are a compliance auditor. Rate how well the proof and context meet the specification.

Specification: "${spec}"
User Proof: "${proof}"
User Context: "${context}"

Rate the compliance on a scale from 0 to ${maxScore}, where 0 = does not meet the spec at all, and ${maxScore} = fully meets the spec.

Respond ONLY with a JSON object like:
{"score": <number between 0 and ${maxScore}>, "feedback": "short explanation for this score."}
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const rawResponse = completion.choices[0].message?.content;

    let data = { score: 0, feedback: "Could not parse response" };

    if (rawResponse) {
      try {
        data = JSON.parse(rawResponse);
      } catch (err) {
        console.error("Failed to parse GPT response:", rawResponse);
      }
    } else {
      console.error("GPT returned null or undefined response");
    }

    console.log("Compliance Score Test Result:");
    console.log("Score:", data.score);
    console.log("Feedback:", data.feedback);
  } catch (err) {
    console.error("OpenAI API error:", err);
  }
}

testScore();
