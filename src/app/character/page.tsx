"use client";

import { useState } from "react";

const tabs = ["基本内容", "状況例", "情報"];

export default function CharacterSettings() {
  const [activeTab, setActiveTab] = useState(0);
  const [text, setText] = useState("");

  return (
    <div className="bg-[#1C1C1E] min-h-screen text-white px-4 py-4">
      {/* Character counter */}
      <div className="flex justify-end mb-2">
        <span className="text-gray-400 text-sm">{text.length}/1,500字</span>
      </div>

      {/* Tabs */}
      <div className="flex space-x-6 border-b border-gray-700 mb-4">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            onClick={() => setActiveTab(index)}
            className={`pb-2 relative ${
              activeTab === index ? "text-white" : "text-gray-400"
            }`}
          >
            {tab}
            {activeTab === index && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></div>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === 0 && (
          <textarea
            className="w-full h-60 bg-[#2C2C2E] p-3 rounded-md outline-none text-sm"
            placeholder="キャラクターの基本的な設定を入力してください"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        )}
        {activeTab === 1 && (
          <textarea
            className="w-full h-60 bg-[#2C2C2E] p-3 rounded-md outline-none text-sm"
            placeholder="状況例を入力してください"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        )}
        {activeTab === 2 && (
          <textarea
            className="w-full h-60 bg-[#2C2C2E] p-3 rounded-md outline-none text-sm"
            placeholder="補足情報を入力してください"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        )}
      </div>
    </div>
  );
}
