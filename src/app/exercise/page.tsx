"use client";

import Link from "next/link";
import { FaStar } from "react-icons/fa";

export default function ExerciseSelectPage() {
  const exercises = [
    {
      name: "スクワット",
      desc: "大腿とお臀を引き締める",
      level: "普通",
      stars: 2,
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCkYb3wvlfF54jMA48cKRnMyf4YHN9AiaBFaRaahsKNTvqnkD33Vd2WC3PWdyfIDEPHcqjYuCvM4pxfC3VNdvszabGx4P7KNm7rm4ySdhfXKmjPPZ6DeNGey2gmx_9K9SKOr-NTdnYgycGUC1b606uH7yTF98plw0x6CFdAxYPFCz5iYEDGPnIQ8mC6Fhxfcz2TKjoVQUgrScHa4AEU2Ys9vcOCB7A0nB-E6ijY8nG95e_bJv9Ak609rzyYLFOuBvTWrMlzWt6viPY3",
    },
    {
      name: "プランク",
      desc: "体幹を強化する",
      level: "簡単",
      stars: 1,
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCZb67D2c-0t7r10zybdO63aJQliziKc593jRvo6fnxUbxLoJfzeWZ6-vdYYfv3BnmgmWKNMzF_PtefMxJLkB5fGXJnuNasDi7_gVSql5pxb7klFyv1fntteRP4oeL_40neHDbJo6CDCn0u-qlt5vV5FF6lwNW1ojLP-MLyXOGGaoGW0CkTS3SzS2DAEDXqCsPCG1M0BIe3HnYMqGdJcJ_LFaTfp1GMIH3MWgcDhZVkD5cqH93mQqHhTAqAuvtVANAHjj3hNLCZw8ac",
    },
    {
      name: "ランジ",
      desc: "足とお臀のラインを整える",
      level: "普通",
      stars: 2,
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDlnqCmhns6dsRMDzoKdMS37dyEQOdGC2O6KrhoXQ3eDGppMOodnUqxYNICRXSbURrLCU-M01J_Ncs0Uj29BPDGDTz7m9RD-GL08yWhzHA-1pH9G1bSo7ZT4tN7ArEpd6p-VqtJNQZ9G419jx5vStU9uMy1xmlwB1nCTYIqftOXeZQZykBTn3Y_u-COJSiNrPzoHmXnWJz6qywWtvTYG-KLyRR40RTwdHnHumYIekeNk64r7L-07MEsJJty9F5o0TgqsBijKHiFdx7-",
    },
    {
      name: "腕立て",
      desc: "胸と腕を強化",
      level: "普通",
      stars: 2,
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDk7x6ZJdUUAGk_25fP_SrmKro7IF-yCgIyYFp82l7X0P-2U820uvE2j8Ec2olDBz0c9ybzkFWAlWJFCd3BgSVFXUM3_8i8Sx9ZI1q0WDpa7JEskom0sjRhLrimV3-XZEOC7_VdMLma014XAQ68QCBysE2k-e4OpfXGT3DwRWhBmdLeTgaejy4S-DVPKiqu0G0D6DFDszn4z4TNhhJILC8RGZjXKDtcOKWz5_QcTgnix0SbYUuL1_AkQEk96rjwNVc_guhvkZa-4utw",
    },
    
    {
      name: "腹筋",
      desc: "お腹周りを引き締める",
      level: "普通",
      stars: 2,
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCZb67D2c-0t7r10zybdO63aJQliziKc593jRvo6fnxUbxLoJfzeWZ6-vdYYfv3BnmgmWKNMzF_PtefMxJLkB5fGXJnuNasDi7_gVSql5pxb7klFyv1fntteRP4oeL_40neHDbJo6CDCn0u-qlt5vV5FF6lwNW1ojLP-MLyXOGGaoGW0CkTS3SzS2DAEDXqCsPCG1M0BIe3HnYMqGdJcJ_LFaTfp1GMIH3MWgcDhZVkD5cqH93mQqHhTAqAuvtVANAHjj3hNLCZw8ac",
    },
  ];

  return (
    <main className="min-h-screen bg-[#1C1C1E] text-white p-4">
      <h2 className="text-xl font-bold mb-6">今日の運動メニュー</h2>
      <div className="grid grid-cols-1 gap-4">
        {exercises.map((ex, i) => (
          <Link
            key={i}
            href="/Workout"
            className="flex cursor-pointer items-center gap-4 rounded-xl bg-[#2C2C2E] p-4 shadow hover:bg-[#333]"
          >
            <div
              className="h-24 w-24 flex-shrink-0 rounded-lg bg-cover bg-center"
              style={{ backgroundImage: `url(${ex.img})` }}
            ></div>
            <div className="flex flex-col">
              <p className="text-lg font-bold">{ex.name}</p>
              <p className="text-sm text-gray-400">{ex.desc}</p>
              <div className="mt-2 flex items-center gap-1">
                {[1, 2, 3].map((s) => (
                  <FaStar
                    key={s}
                    className={s <= ex.stars ? "text-yellow-400" : "text-gray-600"}
                  />
                ))}
                <p className="ml-2 text-xs text-gray-400">難易度: {ex.level}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
