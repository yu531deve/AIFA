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

  // メッセージ送信処理
  const sendMessage = async () => {
    if (!input || loading) return;
    setMessages((m) => [...m, { role: "user", text: input }]);
    setInput("");
    setLoading(true);

    setMessages((m) => [...m, { role: "ai", text: "..." }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "あなたは親切なAIアシスタントです。" },
            ...messages.map((m) => ({
              role: m.role === "user" ? "user" : "assistant",
              content: m.text,
            })),
            { role: "user", content: input },
          ],
        }),
      });

      const data = await res.json();
      const reply = data.reply ?? "エラーが発生しました。";

      setMessages((m) => [...m.slice(0, -1), { role: "ai", text: reply }]);
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
      </Canvas> {/* ← ここでCanvasを閉じる */}

      {/* 上部ボタンバー（Canvasの外） */}
      <div className="absolute top-0 left-0 w-full flex gap-2 p-2 bg-white/20">
        <button
          onClick={() => triggerMotion("running")}
          className="px-4 py-2 bg-blue-500 text-white rounded shadow"
        >
          走る
        </button>
        <button
          onClick={() => triggerMotion("neutral")}
          className="px-4 py-2 bg-green-500 text-white rounded shadow"
        >
          Idle
        </button>
      </div>

      {/* チャットUI（Canvasの外） */}
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-white/20 flex flex-col border-t">
        <div className="flex-1 overflow-y-auto p-2">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              メッセージを入力してください
            </div>
          ) : (
            messages.map((m, i) => (
              <div
                key={i}
                className={`mb-1 ${
                  m.role === "user" ? "text-right" : "text-left"
                }`}
              >
                <span
                  className={`inline-block px-3 py-2 rounded ${
                    m.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
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
            className="ml-2 px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
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
