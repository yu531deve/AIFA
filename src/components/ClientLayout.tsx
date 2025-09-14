"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideHeaderPaths = ["/", "/Workout"];
  const isHeaderHidden = hideHeaderPaths.includes(pathname);

  return (
    <>
      {isHeaderHidden ? (
        // ヘッダー非表示のページ → ハンバーガーだけ左上に置く
        <Sidebar />
      ) : (
        // それ以外のページ → ヘッダーあり（ヘッダー内にSidebarも表示される）
        <Header />
      )}
      <main className={isHeaderHidden ? "" : "pt-14"}>{children}</main>
    </>
  );
}
