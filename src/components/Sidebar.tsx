"use client";

import { useState } from "react";
import Link from "next/link";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ハンバーガー */}
      <button
        onClick={() => setOpen(!open)}
        className="absolute top-4 left-4 z-50 p-0.5 bg-[#2C2C2E] text-white rounded-md text-lg"
      >
        ☰
      </button>

      {/* サイドメニュー */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setOpen(false)}
        >
          <div
            className="absolute top-0 left-0 w-64 h-full bg-[#1C1C1E] shadow-lg p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="mt-12 flex flex-col gap-4">
              {/* メイン */}
              <Link
                href="/"
                className="px-4 py-2 rounded bg-[#2C2C2E] hover:bg-gray-700 text-white"
                onClick={() => setOpen(false)}
              >
                メインメニュー
              </Link>

              {/* エクササイズグループ */}
              <div>
                <p className="px-4 py-1 text-sm text-gray-400">エクササイズ</p>
                <div className="flex flex-col gap-1 ml-2">
                  <Link
                    href="/Workout"
                    className="px-4 py-2 rounded bg-[#2C2C2E] hover:bg-gray-700 text-white"
                    onClick={() => setOpen(false)}
                  >
                    つづきから運動
                  </Link>
                  <Link
                    href="/exercise"
                    className="px-4 py-2 rounded bg-[#2C2C2E] hover:bg-gray-700 text-white"
                    onClick={() => setOpen(false)}
                  >
                    運動選択
                  </Link>
                  <Link
  href="/record"
  className="px-4 py-2 rounded bg-[#2C2C2E] hover:bg-gray-700 text-white"
  onClick={() => setOpen(false)}
>
  運動記録
</Link>

                </div>
              </div>

              {/* 食事グループ */}
              <div>
                <p className="px-4 py-1 text-sm text-gray-400">食事</p>
                <div className="flex flex-col gap-1 ml-2">
                  <Link
                    href="/meal"
                    className="px-4 py-2 rounded bg-[#2C2C2E] hover:bg-gray-700 text-white"
                    onClick={() => setOpen(false)}
                  >
                    食事記録
                  </Link>
                  
                </div>
              </div>

              {/* その他 */}
              <Link
                href="/profile"
                className="px-4 py-2 rounded bg-[#2C2C2E] hover:bg-gray-700 text-white"
                onClick={() => setOpen(false)}
              >
                プロフィール
              </Link>
              <Link
                href="/character"
                className="px-4 py-2 rounded bg-[#2C2C2E] hover:bg-gray-700 text-white"
                onClick={() => setOpen(false)}
              >
                キャラクター設定
              </Link>
              <button
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-left"
                onClick={() => {
                  setOpen(false);
                  // ログアウト処理を追加予定
                }}
              >
                ログアウト
              </button>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
