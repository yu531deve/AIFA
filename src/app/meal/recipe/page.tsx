"use client";

import Link from "next/link";

export default function RecipePage() {
  return (
    <main className="min-h-screen bg-[#1C1C1E] text-white">
      {/* ヘッダー */}
      <header className="sticky top-0 flex items-center justify-between p-4 bg-[#1C1C1E] border-b border-gray-700 z-10">
        <Link href="/meal" className="text-white hover:text-gray-300">
          ← 戻る
        </Link>
        <button className="text-white hover:text-red-400">♡</button>
      </header>

      {/* レシピ画像 */}
      <div
        className="w-full h-64 bg-cover bg-center rounded-b-2xl"
        style={{
          backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDCFvV-aCshdiDMmxN8tx6LAtgjN2H2vViGTRjCKsdwUfLkgoe9HLS9fCPgGQ8dWQCb0LQ00j3fb8J3K4Uvzk5XogM_-XKFZlKh_6CZF34Xv6Muj6rPIzga3oVQ2z18Wkx5Fzm-WtEdWf6Vda4Xe4q9fVsRlfZFREQThqoXs1iZLtuHNFn45AxcIhfMbg-KnjZ37mb9RrMJJDZvhmDhqNMnMhaJ23z1nzihSCgwdZ9xSzNnzaPwcTsGPC5-tSt8WHqNx2WlqhPDyMbs")`,
        }}
      />

      {/* タイトル */}
      <div className="p-6">
        <h1 className="text-3xl font-bold">キヌアサラダとグリルチキン</h1>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div className="rounded-xl bg-[#2C2C2E] p-3">
            <p className="text-sm text-gray-400">準備時間</p>
            <p className="text-lg font-bold">15分</p>
          </div>
          <div className="rounded-xl bg-[#2C2C2E] p-3">
            <p className="text-sm text-gray-400">調理時間</p>
            <p className="text-lg font-bold">25分</p>
          </div>
          <div className="rounded-xl bg-[#2C2C2E] p-3">
            <p className="text-sm text-gray-400">カロリー</p>
            <p className="text-lg font-bold">450 kcal</p>
          </div>
        </div>
      </div>

      {/* 材料 */}
      <div className="px-6 pb-6">
        <h2 className="text-2xl font-bold">材料</h2>
        <ul className="mt-4 space-y-2 text-gray-300">
          <li>✓ キヌア（調理済み） 1カップ</li>
          <li>✓ グリルチキン 1枚</li>
          <li>✓ ミニトマト 1/2カップ</li>
          <li>✓ きゅうり 1/4カップ</li>
          <li>✓ 赤玉ねぎ 1/4カップ</li>
          <li>✓ オリーブオイル 大さじ2</li>
          <li>✓ レモン汁 大さじ1</li>
          <li>✓ 塩・こしょう 適量</li>
        </ul>
      </div>

      {/* 作り方 */}
      <div className="px-6 pb-24">
        <h2 className="text-2xl font-bold">作り方</h2>
        <div className="mt-4 space-y-4">
          <div>
            <p className="font-bold">ステップ 1</p>
            <p className="text-gray-400">
              ボウルにキヌア、チキン、トマト、きゅうり、赤玉ねぎを入れて混ぜます。
            </p>
          </div>
          <div>
            <p className="font-bold">ステップ 2</p>
            <p className="text-gray-400">
              小さなボウルでオリーブオイル、レモン汁、塩、こしょうを混ぜてドレッシングを作ります。
            </p>
          </div>
          <div>
            <p className="font-bold">ステップ 3</p>
            <p className="text-gray-400">
              ドレッシングをサラダにかけ、やさしく和えて完成です。
            </p>
          </div>
        </div>
      </div>

      {/* フッター */}
      <footer className="fixed bottom-0 w-full grid grid-cols-2 gap-4 p-4 bg-[#1C1C1E] border-t border-gray-700">
        <button className="bg-green-500 text-white py-2 rounded hover:bg-green-600">
          今日のログに追加
        </button>
        <button className="bg-[#2C2C2E] text-green-400 py-2 rounded hover:bg-[#333]">
          お気に入りに追加
        </button>
      </footer>
    </main>
  );
}
