"use client";

import { usePathname } from "next/navigation";
import BottomNav from "./BottomNav";
import Sidebar from "./Sidebar";
import InstallPrompt from "./InstallPrompt";
import PageTransition from "./PageTransition";
import WhatsNew from "./WhatsNew";
import NotificationCenter from "./NotificationCenter";
import { tabFromPath } from "@/lib/nav";

/** Маркетинговые страницы — витрина, а не приложение. */
const MARKETING = ["/", "/terms", "/privacy", "/login", "/register", "/download"];

/**
 * Каркас страницы.
 *
 * У продукта два разных типа экранов, и им нужны разные оболочки:
 *
 * — приложение (моб./узкий экран): узкая колонка под телефон, нижняя
 *   навигация, отступ под неё. Всё правильно для инструмента, которым
 *   пользуются с руки.
 * — приложение (lg: и шире): боковая навигация вместо нижней, широкая
 *   колонка контента вместо узкой полоски посреди пустого экрана — тот же
 *   стор и те же разделы, просто раскладка под мышь и большой монитор.
 * — витрина: полная ширина, без навигации и без баннера установки.
 *   Лендинг, зажатый в 448px на десктопе, выглядит как сайт из 2010-го —
 *   именно ширина, а не цвета, выдаёт «непрофессионально» в первую секунду.
 *
 * Sidebar и BottomNav смонтированы ОБА всегда — какой виден, решает чистый
 * CSS (`lg:hidden` / `hidden lg:flex`), а не условный рендер по JS-ширине:
 * так на сервере и при первой гидратации нет расхождения от того, что
 * ширина окна ещё не известна.
 *
 * Внутри приложения есть третий случай — разделы оболочки (AppShell).
 * Они переключаются без навигации и анимируют себя сами, поэтому обёртка
 * PageTransition для них не нужна: два перехода на один жест — это
 * заметная задержка и двойное движение.
 */
export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMarketing = MARKETING.includes(pathname);
  const isSection = tabFromPath(pathname) !== null;

  if (isMarketing) {
    return <div className="min-h-dvh">{children}</div>;
  }

  return (
    <>
      <Sidebar />
      {/* pb (моб.): место под нижнюю навигацию + под баннер установки, когда
          он виден (--install-offset ставит InstallPrompt) — без второго
          слагаемого баннер накрывал бы нижние кнопки экрана. На lg: нижней
          навигации нет вообще, отступ обычный, а слева — место под сайдбар. */}
      <div className="mx-auto flex min-h-dvh max-w-md flex-col px-4 pt-6 pb-[calc(6rem+var(--install-offset,0px))] lg:max-w-6xl lg:pl-68 lg:pb-10 lg:pt-10">
        {isSection ? children : <PageTransition>{children}</PageTransition>}
      </div>
      <BottomNav />
      <InstallPrompt />
      <WhatsNew />
      <NotificationCenter />
    </>
  );
}
