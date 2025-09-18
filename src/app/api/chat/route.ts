import OpenAI from "openai";
import { NextRequest } from "next/server";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const stream = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      stream: true,
    });

    return new Response(stream.toReadableStream(), {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("API Error:", err);
    return new Response(JSON.stringify({ error: "OpenAI API error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
