import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  const { text } = await req.json();

  // APIキーがない場合は固定レスポンスを返す
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ sentiment: "neutral (dummy)" });
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "テキストを positive / neutral / negative に分類してください。",
      },
      { role: "user", content: text },
    ],
  });

  const sentiment = completion.choices[0].message.content?.trim().toLowerCase();
  return NextResponse.json({ sentiment });
}
