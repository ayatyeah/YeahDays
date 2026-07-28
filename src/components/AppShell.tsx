"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { LogoLoader } from "@/components/Logo";
import { useNavStore } from "@/store/useNavStore";
import { haptic } from "@/lib/motion";
import { TABS, neighbourTab, type TabKey } from "@/lib/nav";

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
 * Разделы грузятся отдельными чанками и прогреваются в простое: первый
 * экран не тащит на себе код остальных четырёх, но к моменту, когда
 * человек до них дойдёт, они уже в памяти.
 */

const SECTIONS: Record<TabKey, React.ComponentType> = {
  home: dynamic(() => import("@/sections/HomeSection"), {
    ssr: false,
    loading: () => <LogoLoader />,
  }),
  today: dynamic(() => import("@/sections/TodaySection"), {
    ssr: false,
    loading: () => <LogoLoader />,
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

/** Насколько далеко нужно увести палец, чтобы это считалось сменой раздела. */
const SWIPE_DISTANCE = 64;
/** Горизонталь должна явно преобладать — иначе это скролл, а не свайп. */
const SWIPE_RATIO = 1.6;
/** Край экрана оставляем системе (свайп «назад» в браузере). */
const EDGE_GUARD = 20;

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

export default function AppShell({ initialTab }: { initialTab: TabKey }) {
  const pathname = usePathname();
  const tab = useNavStore((s) => s.tab);
  const dir = useNavStore((s) => s.dir);
  const mounted = useNavStore((s) => s.mounted);
  const go = useNavStore((s) => s.go);
  const warm = useNavStore((s) => s.warm);
  const syncFromPath = useNavStore((s) => s.syncFromPath);
  const setScroll = useNavStore((s) => s.setScroll);

  const stageRef = useRef<HTMLDivElement>(null);
  const prevTab = useRef<TabKey>(initialTab);

  /*
   * Раздел, с которого открылось приложение. Ставится ДО первой отрисовки:
   * если человек пришёл по /today из уведомления, он не должен увидеть
   * кадр главной. useLayoutEffect с проверкой адреса — вход по ссылке
   * всегда сильнее, чем то, что осталось в памяти store.
   */
  useLayoutEffect(() => {
    const state = useNavStore.getState();
    if (state.tab !== initialTab) {
      useNavStore.setState({
        tab: initialTab,
        dir: 1,
        mounted: state.mounted.includes(initialTab)
          ? state.mounted
          : [...state.mounted, initialTab],
      });
    }
    // только на монтировании: дальше разделами управляет store
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Назад/вперёд в браузере и обычные навигации — источник правды адрес. */
  useEffect(() => {
    syncFromPath(pathname);
  }, [pathname, syncFromPath]);

  /* ── Скролл: у каждого раздела свой ── */
  useLayoutEffect(() => {
    const from = prevTab.current;
    if (from === tab) return;

    setScroll(from, window.scrollY);
    prevTab.current = tab;

    const saved = useNavStore.getState().scroll[tab] ?? 0;
    window.scrollTo({ top: saved, behavior: "auto" });
    // контент раздела может домонтироваться кадром позже — повторяем
    const raf = requestAnimationFrame(() =>
      window.scrollTo({ top: saved, behavior: "auto" }),
    );
    return () => cancelAnimationFrame(raf);
  }, [tab, setScroll]);

  /* ── Появление раздела: направленное, на GPU, без перерисовки страницы ── */
  useEffect(() => {
    const stage = stageRef.current;
    const active = stage?.querySelector<HTMLElement>("[data-section-active]");
    if (!active || prefersReducedMotion()) return;
    try {
      active.animate(
        [
          { opacity: 0, transform: `translate3d(${dir * 26}px, 0, 0)` },
          { opacity: 1, transform: "translate3d(0, 0, 0)" },
        ],
        { duration: 190, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
      );
    } catch {
      // Web Animations нет — раздел просто появится без анимации
    }
  }, [tab, dir]);

  /* ── Прогрев остальных разделов в простое ── */
  useEffect(() => {
    const conn = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    if (conn?.saveData) return;

    const w = window as Window & {
      requestIdleCallback?: (cb: () => void) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const warmAll = () => {
      for (const t of TABS) warm(t);
    };

    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(warmAll);
      return () => w.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(warmAll, 1500);
    return () => window.clearTimeout(id);
  }, [warm]);

  /* ── Свайп между разделами ── */
  const drag = useRef<{
    x: number;
    y: number;
    active: boolean;
    locked: boolean;
  } | null>(null);

  const activeEl = useCallback(
    () => stageRef.current?.querySelector<HTMLElement>("[data-section-active]"),
    [],
  );

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    const t = e.touches[0];
    // край экрана — системный жест; модалка сверху — не наш случай
    if (t.clientX < EDGE_GUARD || t.clientX > window.innerWidth - EDGE_GUARD) {
      return;
    }
    if (document.body.dataset.modalOpen === "1") return;
    // колода карточек и другие горизонтальные зоны забирают жест себе
    if ((e.target as HTMLElement).closest?.("[data-no-swipe]")) return;

    drag.current = { x: t.clientX, y: t.clientY, active: true, locked: false };
  }, []);

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const d = drag.current;
      if (!d?.active) return;
      const t = e.touches[0];
      const dx = t.clientX - d.x;
      const dy = t.clientY - d.y;

      if (!d.locked) {
        if (Math.abs(dx) < 12) return;
        // вертикаль победила — это скролл, жест больше не наш
        if (Math.abs(dx) < Math.abs(dy) * SWIPE_RATIO) {
          d.active = false;
          return;
        }
        d.locked = true;
      }

      const el = activeEl();
      if (!el) return;
      // у края списка разделов тянется вязко — граница ощущается, а не молчит
      const edge = !neighbourTab(useNavStore.getState().tab, dx < 0 ? 1 : -1);
      const shift = dx * (edge ? 0.18 : 0.42);
      el.style.transform = `translate3d(${shift}px, 0, 0)`;
      el.style.willChange = "transform";
    },
    [activeEl],
  );

  const endDrag = useCallback(
    (dx: number) => {
      const el = activeEl();
      if (el) {
        el.style.transition = "transform 180ms cubic-bezier(0.22, 1, 0.36, 1)";
        el.style.transform = "translate3d(0, 0, 0)";
        window.setTimeout(() => {
          el.style.transition = "";
          el.style.willChange = "";
        }, 200);
      }

      if (Math.abs(dx) < SWIPE_DISTANCE) return;
      const next = neighbourTab(useNavStore.getState().tab, dx < 0 ? 1 : -1);
      if (!next) return;
      haptic("select");
      go(next);
    },
    [activeEl, go],
  );

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const d = drag.current;
      drag.current = null;
      if (!d?.active || !d.locked) return;
      const t = e.changedTouches[0];
      endDrag(t.clientX - d.x);
    },
    [endDrag],
  );

  return (
    <div
      ref={stageRef}
      className="app-stage flex flex-1 flex-col"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
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
            // ни отрисовки, ни фокуса, ни озвучки скринридером
            hidden={!active}
            aria-hidden={!active}
            inert={!active}
            className="section-pane"
          >
            <Section />
          </div>
        );
      })}
    </div>
  );
}
