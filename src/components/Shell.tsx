"use client";

import { usePathname } from "next/navigation";
import BottomNav from "./BottomNav";
import InstallPrompt from "./InstallPrompt";
import PageTransition from "./PageTransition";
import WhatsNew from "./WhatsNew";

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
      {/* pb: место под нижнюю навигацию + под баннер установки, когда он
          виден (--install-offset ставит InstallPrompt). Без второго слагаемого
          баннер накрывал бы нижние кнопки экрана. */}
      <div
        className="mx-auto flex min-h-dvh max-w-md flex-col px-4 pt-6"
        style={{
          paddingBottom: "calc(6rem + var(--install-offset, 0px))",
        }}
      >
        <PageTransition>{children}</PageTransition>
      </div>
      <BottomNav />
      <InstallPrompt />
      <WhatsNew />
    </>
  );
}
