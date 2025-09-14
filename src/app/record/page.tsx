"use client";

import { useState } from "react";

export default function RecordPage() {
  const [exercises, setExercises] = useState([
    { name: "バックランジ", sets: 3, unit: "セット", note: "1セット15回" },
    { name: "ウォーキング", sets: 30, unit: "分", note: "" },
    { name: "腹筋", sets: 2, unit: "セット", note: "1セット20回" }, // ← 追加
  ]);

  return (
    <main className="min-h-screen bg-[#1C1C1E] text-white px-4 py-6">
      {/* 日付ヘッダー */}
      <header className="mb-6">
        <h1 className="text-xl font-bold">2024年5月24日</h1>
      </header>

      {/* 今日やった運動 */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">今日やった運動</h2>
          <button className="text-sm text-blue-400 hover:underline flex items-center gap-1">
            ✏ 編集
          </button>
        </div>
        <div className="space-y-3">
          {exercises.map((ex, i) => (
            <div key={i} className="rounded-lg bg-[#2C2C2E] p-3 shadow">
              <div className="flex items-center justify-between">
                <span className="text-base">{ex.name}</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={ex.sets}
                    onChange={(e) => {
                      const newExercises = [...exercises];
                      newExercises[i].sets = Number(e.target.value);
                      setExercises(newExercises);
                    }}
                    className="w-20 rounded-md bg-[#1C1C1E] border border-gray-600 text-center"
                  />
                  <span className="text-sm text-gray-400">{ex.unit}</span>
                </div>
              </div>
              {ex.note && <p className="mt-1 text-sm text-gray-500">{ex.note}</p>}
            </div>
          ))}
          <button className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-600 py-3 text-sm text-gray-400 hover:border-gray-400 hover:bg-[#2C2C2E]">
            ＋ 運動を追加する
          </button>
        </div>
      </section>

      {/* 予想消費カロリー */}
      <section className="mb-8">
        <div className="rounded-lg bg-[#2C2C2E] p-4 shadow">
          <h2 className="mb-2 text-lg font-bold">予想消費カロリー</h2>
          <p className="mb-4 text-center text-4xl font-bold text-blue-400">
            350 <span className="text-xl font-medium">kcal</span>
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <p className="font-medium">基礎代謝</p>
              <p className="text-gray-400">1500 kcal</p>
            </div>
            <div className="h-3 w-full rounded-full bg-gray-700">
              <div className="h-3 rounded-full bg-blue-400" style={{ width: "23%" }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* AIコーチからの評価 */}
      <section>
        <div className="rounded-lg bg-[#2C2C2E] p-4 shadow">
          <h2 className="mb-2 text-lg font-bold">AIコーチからの評価</h2>
          <p className="text-base text-gray-400">
            素晴らしい！今日の運動で目標達成です！この調子で明日も頑張りましょう！
          </p>
        </div>
      </section>
    </main>
  );
}
