"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Avatar from "./Avatar";
import {
  idleBreath,
  blinking,
  lookAround,
  nodding,
  handWave,
  shrug,
  running,
} from "./motions";

type MotionType = "positive" | "negative" | "neutral" | "running";

export default function Home() {
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; text: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [withVoice, setWithVoice] = useState(false); // ← 音声ON/OFF

  // アバター動作切り替え
  const triggerMotion = (type: MotionType) => {
    if (typeof window === "undefined" || !window.setAvatarMotion) return;
    switch (type) {
      case "positive":
        window.setAvatarMotion([handWave]);
        break;
      case "negative":
        window.setAvatarMotion([nodding, shrug]);
        break;
      case "running":
        window.setAvatarMotion([running]);
        break;
      case "neutral":
        window.setAvatarMotion([idleBreath, blinking, lookAround]);
        break;
    }
  };

  const sendMessage = async () => {
    if (!input || loading) return;
    setMessages((m) => [...m, { role: "user", text: input }]);
    const currentInput = input;
    setInput("");
    setLoading(true);

    const newIndex = messages.length + 1;
    setMessages((m) => [...m, { role: "ai", text: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "あなたはお姉さんっぽいおとなしめの我が家のメイドさんです。ご主人の健康を気遣い、会話では優しく運動を促すようにしてください。柔らかい口調で丁寧に話し、時々かわいい絵文字（☺️✨💕など）を添えて、安心感を与える返答をしてください。特に指示の無い限り、100文字以内で答えてください。",
            },
            ...messages.map((m) => ({
              role: m.role === "user" ? "user" : "assistant",
              content: m.text,
            })),
            { role: "user", content: currentInput },
          ],
        }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });

        try {
          const jsonStrings = chunk
            .split("\n")
            .filter((line) => line.trim().length > 0);

          for (const jsonStr of jsonStrings) {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content || "";
            if (content) {
              buffer += content;
              setMessages((m) => {
                const updated = [...m];
                updated[newIndex] = { role: "ai", text: buffer };
                return updated;
              });
            }
          }
        } catch (e) {
          console.error("JSON parse error", e, chunk);
        }
      }

      // 🔊 音声ONのときだけ追加でTTS再生
      if (withVoice && buffer) {
        const speech = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: buffer }),
        });
        const blob = await speech.blob();
        const audio = new Audio(URL.createObjectURL(blob));
        audio.play();
      }
    } catch {
      setMessages((m) => [
        ...m.slice(0, -1),
        { role: "ai", text: "サーバーに接続できませんでした。" },
      ]);
    }

    setLoading(false);
  };

  return (
    <main className="relative w-screen h-screen">
      {/* Three.js Canvas */}
      <Canvas camera={{ position: [0, 0.2, 1.4] }}>
        <ambientLight intensity={1} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <directionalLight position={[-5, 5, 5]} intensity={0.8} />
        <Avatar />
        <OrbitControls
          target={[0, 0.21, 0]}
          minDistance={1.0}
          maxDistance={1.2}
          enablePan={false}
        />
      </Canvas>

      {/* チャットUI */}
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-white/20 flex flex-col border-t">
        {/* 音声ON/OFFスイッチ */}
        <div className="flex justify-end p-2 gap-2">
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={withVoice}
              onChange={(e) => setWithVoice(e.target.checked)}
            />
            音声あり
          </label>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              メッセージを入力してください
            </div>
          ) : (
            messages.map((m, i) => (
              <div
                key={i}
                className={`mb-2 flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <span
                  className={`max-w-xs px-3 py-2 rounded-2xl ${
                    m.role === "user"
                      ? "bg-black text-white rounded-br-none"
                      : "bg-[#2C2C2E] text-white rounded-bl-none"
                  }`}
                >
                  {m.text}
                </span>
              </div>
            ))
          )}
        </div>

        {/* 入力欄 */}
        <div className="p-2 border-t flex">
          <input
            className="flex-1 border rounded px-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="メッセージを入力..."
            disabled={loading}
          />
          <button
            className="ml-2 px-4 py-2 bg-black hover:bg-gray-800 text-white rounded disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            onClick={sendMessage}
            disabled={loading}
          >
            {loading ? "思考中..." : "送信"}
          </button>
        </div>
      </div>
    </main>
  );
}
