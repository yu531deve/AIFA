import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { text } = await req.json();

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "テキストを positive / neutral / negative に分類してください。" },
      { role: "user", content: text },
    ],
  });

  const sentiment = completion.choices[0].message.content?.trim().toLowerCase();
  return NextResponse.json({ sentiment });
}
