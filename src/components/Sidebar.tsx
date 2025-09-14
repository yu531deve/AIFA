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
        className="absolute top-4 left-4 z-50 p-2 bg-white/80 rounded shadow"
      >
        ☰
      </button>

      {/* サイドメニュー */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setOpen(false)}>
          <div
            className="absolute top-0 left-0 w-64 h-full bg-white shadow-lg p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ← ここでちょっとだけ下げる */}
            <nav className="mt-16 flex flex-col gap-2">
              <Link
                href="/"
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => setOpen(false)}
              >
                メインメニュー
              </Link>
              <Link
                href="/Workout"
                className="px-4 py-2 bg-green-500 text-white rounded"
                onClick={() => setOpen(false)}
              >
                エクササイズメニュー
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
