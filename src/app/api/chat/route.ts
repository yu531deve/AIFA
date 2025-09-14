import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const completion = await client.chat.completions.create({
    model: "gpt-5-mini", // 軽量で高速な会話用
    messages,            // ユーザーとAIのやりとりを渡す
  });

  return NextResponse.json({
    reply: completion.choices[0].message.content,
  });
}
