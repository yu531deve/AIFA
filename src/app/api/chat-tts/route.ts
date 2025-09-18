import OpenAI from "openai";
import { NextRequest } from "next/server";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  // Chatの返答生成
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
  });

  const replyText = completion.choices[0].message.content ?? "";

  // JSONで返す（フロントでTTSに渡す）
  return new Response(JSON.stringify({ reply: replyText }), {
    headers: { "Content-Type": "application/json" },
  });
}
