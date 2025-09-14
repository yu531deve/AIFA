"use client";
import Link from "next/link";

export default function MealPage() {
  const meals = [
    {
      title: "朝食",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCp_of8b-9sCdVQGUlNa3IDmZOlGsCfvJEs4wyjXGfWQI4cBLEDjLJeixdAk1BTzveuaHmS-ibNzFQi5yB25GcxuHQrKLlInLmLIehDOeZM3XiB3FtdaV7UxMFfnfc2mxabqPalqYiPJpOQR0VoHhD5j_PggjQH7RapkGI_VLT4VSTiUKhR3NAJ9cR3uSTPy2Ma3f2LE-erPfDht8WLSuVhI8YujpqJnDMWo2zVjWEuUGSNN285GtqGW-2YDyuklW9OXW6iyF3qLOGu",
      advice: "タンパク質が豊富ですね！良い一日をスタートできそうです。",
    },
    {
      title: "昼食",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB3gpMqpJkQC0-PYZMxYc8ijAE_5ZNcO86DU36D2uXWCT_mKvHIbRFgKDz4aM49AoWe0DEYkiHbNGGRNsJsTFblm871WwokCf5qPBtXdX_Wwc2Nb85rEBGTKvdN7F7bLfSRf392lbsvsq-emBZLj6vlqWP_LC4uHaZ4RELm0QIj_b6vFaso8aZoS0b-I2Q9Vu3AJCXAOXZxWRXrC9HNkf8DdM5uEvIgKbw1auWvHvKtWR_c0zun449OSHGzeMETBfoV1LEvz1i_iKDg",
      advice: "野菜をもう少し加えるとバランスが良くなります。午後の活力に繋がりますよ。",
    },
    {
      title: "夕食",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBU8HphcOc9SdRF0Y1OcDU85ONlSH6QAKxHCLVUowJzY6Qa63ICF5WJC2QGds--ZCJ_CfKSN1tBZkIEis_eqEqfGTpoL6NpOwINL2EKqqOWfPbmuDpWMbSEiIEQFpLIGml8HrKFFNq1TUQl_x4-C6TYce04TH0F_iLWsSNKBY3IVs6UgrtMrqwWx1KKHdlQkTOAbWUDxLJ1iYctl8v2NK9gxltQLbtkPUorTP--pV2JsfE4s4yUcwDEI6i0VDY0KMMNWhQ1vsrEy6-F",
      advice: "バランスの取れた素晴らしい夕食ですね！ゆっくり休んでください。",
    },
  ];

  return (
    <main className="min-h-screen bg-[#1C1C1E] text-white px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">今日の食事</h1>

      {/* 食事リスト */}
      <section className="space-y-4 mb-8">
        {meals.map((meal) => (
          <div key={meal.title} className="bg-[#2C2C2E] rounded-xl shadow p-3 flex gap-4">
            <div
              className="w-32 h-32 rounded-lg bg-cover bg-center flex-shrink-0"
              style={{ backgroundImage: `url("${meal.img}")` }}
            />
            <div className="flex flex-col justify-center flex-1">
              <p className="font-bold text-lg">{meal.title}</p>
              <div className="mt-2 bg-[#1C1C1E] p-3 rounded-lg">
                <p className="text-sm text-green-400">
                  <span className="font-bold">AIからのアドバイス：</span> {meal.advice}
                </p>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* AIおすすめ */}
      <section>
        <h2 className="text-xl font-bold mb-3">AIからのおすすめメニュー</h2>
        <div className="flex gap-4 overflow-x-auto">
          <div className="bg-[#2C2C2E] rounded-xl w-64 flex-shrink-0 shadow">
            <div
 className="w-full h-40 rounded-t-xl bg-cover bg-bottom"
  style={{
    backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuALe2YcKfJ4v6P2YfPxyBBkqb0TtYSycInbPpzwdfZhC27mbK0_AQQPgkfwH_r5KA-1ExRMXaHaoX-9jTjnZbzbkW79BMDJm2jQgekFTH7bwhhmvrum5XdDdFzwGQ0CH1tl-lwx2VHn_aJgm2tqo1V3Rx7ugQHxlkxryoAt-QDlSgTO2S668W2KWmbyjsSH3I2_qWjOyaL97gmCbbco4J3ptLkF67lc-cAawySth2yPcnDViJ3tAhusYdoL56ues38zAI8MTzppT-BC")`,
  }}
/>
            <div className="p-4">
              <p className="font-bold">サラダとグリルチキン</p>
              <p className="text-green-400 text-sm">高タンパクでエネルギーをチャージ</p>
              <Link href="/meal/recipe">
  <button className="mt-3 w-full bg-green-500 text-white rounded py-2 hover:bg-green-600">
    レシピを見る
  </button>
</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
