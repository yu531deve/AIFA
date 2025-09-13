"use client";

import { useState, useEffect } from "react";
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
} from "./motions";

export default function Home() {
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; text: string }[]
  >([]);
  const [input, setInput] = useState("");

  // 初期メッセージを表示
  useEffect(() => {
    setMessages([
      { role: "ai", text: "こんにちは！アバターとお話しできますよ。" },
      { role: "user", text: "はい、よろしくお願いします！" },
    ]);
  }, []);

  const triggerMotion = (type: "positive" | "negative" | "neutral") => {
    if (typeof window === "undefined" || !window.setAvatarMotion) return;

    switch (type) {
      case "positive":
        window.setAvatarMotion([handWave]);
        break;
      case "negative":
        window.setAvatarMotion([nodding, shrug]);
        break;
      default:
        window.setAvatarMotion([idleBreath, blinking, lookAround]);
        break;
    }

    setTimeout(() => {
      window.setAvatarMotion([idleBreath, blinking, lookAround]);
    }, 3000);
  };

  const sendMessage = async () => {
    if (!input) return;
    setMessages((m) => [...m, { role: "user", text: input }]);

    // デモ用の応答
    const fakeReply = "はい、わかりました！";
    setMessages((m) => [...m, { role: "ai", text: fakeReply }]);

    setInput("");
  };

  return (
    <main className="relative w-screen h-screen">
      {/* 背景: アバター全画面 */}
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

      {/* チャットUI: 下1/3をオーバーレイ */}
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-white/20 flex flex-col border-t">
        {/* メッセージリスト */}
        <div className="flex-1 overflow-y-auto p-2">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`mb-1 ${m.role === "user" ? "text-right" : "text-left"}`}
            >
              <span
                className={`inline-block px-3 py-2 rounded ${
                  m.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                {m.text}
              </span>
            </div>
          ))}
        </div>

        {/* 入力欄 */}
        <div className="p-2 border-t flex">
          <input
            className="flex-1 border rounded px-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="メッセージを入力..."
          />
          <button
            className="ml-2 px-4 py-2 bg-blue-600 text-white rounded"
            onClick={sendMessage}
          >
            送信
          </button>
        </div>
      </div>
    </main>
  );
}
