import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function analyzeResume(buffer: Buffer, jobId?: string) {
  const text = buffer.toString("utf8");
  if (!process.env.OPENAI_API_KEY) return null;

  const prompt = jobId
    ? `Read this resume text and generate a fit score from 0 to 100 for role ${jobId}. Also summarize top skills in one sentence. Resume:\n\n${text}`
    : `Extract the candidate profile and skills from this resume text. Resume:\n\n${text}`;

  const completion = await client.responses.create({
    model: "gpt-4.1-mini",
    input: prompt,
    max_output_tokens: 400,
  });

  return completion.output_text;
}
