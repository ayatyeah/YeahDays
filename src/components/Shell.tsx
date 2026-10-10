"use client";

import { MotionConfig } from "framer-motion";
import { usePathname } from "next/navigation";
import LearningVisitTracker from "./mono/LearningVisitTracker";
import MascotGuide from "./MascotGuide";
import "./app-experience.css";
import "./companion/companion.css";
import "./mono/mono.css";
import "./dayflow/dayflow.css";
import "./capsule-nav.css";
import BottomNav from "./BottomNav";
import Sidebar from "./Sidebar";
import InstallPrompt from "./InstallPrompt";
import PageTransition from "./PageTransition";
import WhatsNew from "./WhatsNew";
import AppGuide from "./AppGuide";
import NotificationCenter from "./NotificationCenter";
import { tabFromPath } from "@/lib/nav";
import { cn } from "@/lib/cn";
import LanguageSwitcher from "@/i18n/LanguageSwitcher";

/** Маркетинговые страницы — витрина, а не приложение. */
const MARKETING = [
  "/",
  "/terms",
  "/privacy",
  "/login",
  "/login/lms",
  "/register",
  "/forgot-password",
  // экран согласия OAuth — тот же голый layout, что и /login, без нижней
  // навигации и сайдбара приложения
  "/oauth/authorize",
];

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
const AUTH_PAGES = ["/login", "/login/lms", "/register", "/forgot-password"];

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMarketing =
    MARKETING.includes(pathname) || pathname.startsWith("/invite/");
  const isSection = tabFromPath(pathname) !== null;

  // На экранах входа ещё нет настроек, а язык нужен уже здесь.
  const authSwitcher = AUTH_PAGES.includes(pathname) && (
    <LanguageSwitcher className="fixed right-3 top-[max(0.75rem,env(safe-area-inset-top))] z-50 bg-[var(--color-bg)]" />
  );

  // Консоль владельца — отдельный инструмент, а не раздел приложения: без
  // навигации, баннера установки и гайдов, во всю ширину экрана.
  const isConsole = pathname === "/admin" || pathname.startsWith("/admin/");

  if (isMarketing || isConsole) {
    return (
      <div className="min-h-dvh">
        {authSwitcher}
        {children}
      </div>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <div
        className="yg-app"
        data-study={pathname.startsWith("/events") ? "true" : undefined}
      >
        <Sidebar />
        {/* Снизу отступа у рамки нет: он живёт ВНУТРИ прокручиваемого раздела
          (.section-pane в globals.css). Иначе прокрутка заканчивалась выше
          панели, под полупрозрачной панелью оказывался просто фон, и весь
          смысл размытия пропадал — контент должен проезжать под ней.
          На lg: нижней навигации нет вообще, отступ обычный, а слева —
          место под сайдбар.
          pt: max(...) с вырезом/чёлкой — статичный pt-6 (24px) был меньше
          реального выреза на iPhone (~50-59px из-за viewportFit:"cover" +
          statusBarStyle:"black-translucent" в layout.tsx — контент рисуется
          ПОД статус-баром, а не под ним само по себе), заголовок страницы
          налезал на часы/иконки. На устройствах без выреза (или без
          установленного PWA, где env(...) часто отдаёт 0) заголовок стоял
          впритык к системной строке состояния — подняли пол с 1.5rem до
          2.75rem специально под этот случай; max() всё равно берёт вырез,
          если он больше. */}
        {/* app-shell-frame (только у разделов-вкладок) — ровно высота экрана,
          никогда не выше: .section-pane внутри скроллится сам, поэтому
          переключение вкладок не может менять размер этой рамки (см.
          globals.css). Остальным страницам (маркетинг/PageTransition)
          скролл окна ничем не мешает — им оставляем обычный min-h-dvh. */}
        <div
          className={cn(
            "yg-content-frame mx-auto flex max-w-md flex-col px-[18px] pt-[calc(max(2.75rem,env(safe-area-inset-top))+1rem)] pb-0 lg:mx-0 lg:max-w-none lg:pl-72 lg:pr-8 lg:pb-10 lg:pt-[max(2.5rem,env(safe-area-inset-top))]",
            // У разделов отступ снизу живёт внутри прокрутки (.section-pane),
            // у обычных страниц прокрутки нет — им отступ нужен здесь, иначе
            // низ страницы уедет под плавающую панель.
            isSection
              ? "app-shell-frame"
              : "min-h-dvh pb-[calc(6rem+var(--install-offset,0px))] lg:pb-10",
          )}
        >
          {isSection ? (
            children
          ) : (
            <PageTransition>
              <MascotGuide />
              {children}
            </PageTransition>
          )}
        </div>
        <LearningVisitTracker />
        {authSwitcher}
        <BottomNav />
        <InstallPrompt />
        <AppGuide />
        <WhatsNew />
        <NotificationCenter />
      </div>
    </MotionConfig>
  );
}
