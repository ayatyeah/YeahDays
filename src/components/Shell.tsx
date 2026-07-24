"use client";

import { usePathname } from "next/navigation";
import BottomNav from "./BottomNav";
import InstallPrompt from "./InstallPrompt";

/** Маркетинговые страницы — витрина, а не приложение. */
const MARKETING = ["/", "/terms", "/privacy"];

/**
 * Каркас страницы.
 *
 * У продукта два разных типа экранов, и им нужны разные оболочки:
 *
 * — приложение: узкая колонка под телефон, нижняя навигация, отступ
 *   под неё. Всё правильно для инструмента, которым пользуются с руки.
 * — витрина: полная ширина, без навигации и без баннера установки.
 *   Лендинг, зажатый в 448px на десктопе, выглядит как сайт из 2010-го —
 *   именно ширина, а не цвета, выдаёт «непрофессионально» в первую секунду.
 */
export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMarketing = MARKETING.includes(pathname);

  if (isMarketing) {
    return <div className="min-h-dvh">{children}</div>;
  }

  return (
    <>
      <div className="mx-auto flex min-h-dvh max-w-md flex-col px-4 pb-24 pt-6">
        {children}
      </div>
      <BottomNav />
      <InstallPrompt />
    </>
  );
}
