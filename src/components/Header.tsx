"use client";

import Sidebar from "@/components/Sidebar";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full h-14 bg-[#1C1C1E] text-white flex items-center px-4 border-b border-gray-700 z-40">
      {/* 左：ハンバーガー */}
      <Sidebar />

      {/* 中央：アプリ名 */}
      <h1 className="ml-12 text-lg font-bold">AI Fitness</h1>
    </header>
  );
}
