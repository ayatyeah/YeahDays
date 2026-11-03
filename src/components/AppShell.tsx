"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import TodaySkeleton from "@/components/dayflow/TodaySkeleton";
import { LogoLoader } from "@/components/Logo";
import MascotGuide from "@/components/MascotGuide";
import Onboarding from "@/components/Onboarding";
import { useNavStore } from "@/store/useNavStore";
import { useUserStore, useHydrated } from "@/store/useUserStore";
import { cn } from "@/lib/cn";
import { TABS, type TabKey } from "@/lib/nav";

/**
 * Оболочка приложения: пять разделов в одном экране.
 *
 * Почему не пять маршрутов. Переход между маршрутами Next — это всегда
 * размонтирование дерева, запрос пейлоада и повторная гидратация: на
 * телефоне видно моргание, скролл сбрасывается, состояние экрана теряется.
 * Здесь разделы монтируются один раз и остаются в дереве: переключение —
 * это смена видимости, то есть кадр, а не загрузка. Адрес обновляется
 * через History API, поэтому deep-link из пуша, ярлыки и «назад» работают
 * как раньше.
 *
 * Разделы грузятся отдельными чанками при первом открытии. Уже открытые
 * вкладки остаются в памяти, но первый экран не монтирует остальные.
 */

const SECTIONS: Record<TabKey, React.ComponentType> = {
  home: dynamic(() => import("@/sections/HomeSection"), {
    ssr: false,
    loading: () => <LogoLoader />,
  }),
  today: dynamic(() => import("@/sections/TodaySection"), {
    ssr: false,
    loading: () => <TodaySkeleton />,
  }),
  calendar: dynamic(() => import("@/sections/CalendarSection"), {
    ssr: false,
    loading: () => <LogoLoader />,
  }),
  progress: dynamic(() => import("@/sections/ProgressSection"), {
    ssr: false,
    loading: () => <LogoLoader />,
  }),
  account: dynamic(() => import("@/sections/AccountSection"), {
    ssr: false,
    loading: () => <LogoLoader />,
  }),
};

export default function AppShell({ initialTab }: { initialTab: TabKey }) {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const onboarded = useUserStore((s) => s.onboarded);
  const tab = useNavStore((s) => s.tab);
  const mounted = useNavStore((s) => s.mounted);
  const syncFromPath = useNavStore((s) => s.syncFromPath);
  const setScroll = useNavStore((s) => s.setScroll);

  const stageRef = useRef<HTMLDivElement>(null);
  const prevTab = useRef<TabKey>(initialTab);

  /* Назад/вперёд в браузере и обычные навигации — источник правды адрес. */
  useEffect(() => {
    syncFromPath(pathname);
  }, [pathname, syncFromPath]);

  /**
   * ── Скролл: у каждого раздела свой ──
   *
   * Раньше скроллилось окно (window.scrollY/scrollTo) — теперь каждый
   * .section-pane скроллится сам (см. globals.css), окно вообще не
   * двигается, поэтому читаем/пишем scrollTop конкретного элемента раздела.
   */
  useLayoutEffect(() => {
    const from = prevTab.current;
    if (from === tab) return;

    const fromEl = stageRef.current?.querySelector<HTMLElement>(`[data-section="${from}"]`);
    if (fromEl) setScroll(from, fromEl.scrollTop);
    prevTab.current = tab;

    const saved = useNavStore.getState().scroll[tab] ?? 0;
    const toEl = () => stageRef.current?.querySelector<HTMLElement>(`[data-section="${tab}"]`);
    toEl()?.scrollTo({ top: saved, behavior: "auto" });
    // контент раздела может домонтироваться кадром позже — повторяем
    const raf = requestAnimationFrame(() => {
      toEl()?.scrollTo({ top: saved, behavior: "auto" });
    });
    return () => cancelAnimationFrame(raf);
  }, [tab, setScroll]);

  /* Повторный тап по активной вкладке в навигации — раздел наверх (см. scrollTopTick в useNavStore). */
  const scrollTopTick = useNavStore((s) => s.scrollTopTick);
  useEffect(() => {
    if (scrollTopTick === 0) return; // 0 — стартовое значение, не реальный тап
    const active = stageRef.current?.querySelector<HTMLElement>("[data-section-active]");
    active?.scrollTo({ top: 0, behavior: "smooth" });
  }, [scrollTopTick]);

  // Вкладки остаются смонтированы; короткое CSS-проявление активной
  // панели не меняет её геометрию и учитывает reduced-motion.

  /*
   * Онбординг гейтится здесь, а не внутри отдельного раздела: раньше это
   * жило только в HomeSection, что молча предполагало "home" единственным
   * возможным первым разделом. Раздел по умолчанию сменился на "today" —
   * без этой проверки на уровне оболочки новый пользователь, попавший
   * сразу на "today" (обычный случай теперь), вообще не видел онбординг и
   * застревал без нижней навигации (та тоже скрыта, пока !onboarded).
   */
  if (hydrated && !onboarded) {
    return <Onboarding />;
  }

  return (
    <div
      ref={stageRef}
      // min-h-0 — без него flex-ребёнок не сжимается внутри app-shell-frame
      // и просто её распирает (та же ловушка, что и у .section-pane).
      className="app-stage min-h-0 flex flex-1 flex-col"
    >
      {TABS.filter((t) => mounted.includes(t)).map((t) => {
        const Section = SECTIONS[t];
        const active = t === tab;
        return (
          <div
            key={t}
            data-section={t}
            {...(active ? { "data-section-active": "" } : {})}
            // скрытый раздел остаётся в дереве, но полностью выключен:
            // ни отрисовки, ни фокуса, ни озвучки скринридером.
            hidden={!active}
            aria-hidden={!active}
            inert={!active}
            // Раздел занимает область справа от сайдбара целиком, без
            // центрирования. mx-auto здесь был ошибкой: рядом с сайдбаром
            // колонка по центру оставляет две пустые полосы (при 1920 —
            // почти по 300px), и экран читается как незаполненный. У
            // интерфейса с боковой навигацией контент начинается сразу за
            // ней — это и есть ожидаемое поведение.
            //
            // Потолок только чтобы на ультравайде строка часа не растянулась
            // до полутора метров; на обычных мониторах он не срабатывает.
            className={cn(
              "section-pane",
              // Потолка ширины нет: раздел заполняет всё справа от
              // сайдбара. Потолок в 1360 оставлял на 1920 пустую полосу
              // справа. Читаемость при этом держит не потолок, а сетка
              // .desk — лишнюю ширину забирает боковая колонка, а не
              // карточки основной (см. globals.css).
              "lg:w-full",
            )}
          >
            <MascotGuide section={t} />
            <Section />
          </div>
        );
      })}
    </div>
  );
}
