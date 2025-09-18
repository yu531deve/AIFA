import OpenAI from "openai";
import { NextRequest } from "next/server";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: NextRequest) {
  const { text } = await req.json();

  const speech = await client.audio.speech.create({
  model: "gpt-4o-mini-tts",
  voice: "coral",   // ← ここを変更！
  input: text,
});


  const buffer = Buffer.from(await speech.arrayBuffer());

  return new Response(buffer, {
    headers: { "Content-Type": "audio/mpeg" },
  });
}
