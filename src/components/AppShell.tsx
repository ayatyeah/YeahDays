"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { LogoLoader } from "@/components/Logo";
import Onboarding from "@/components/Onboarding";
import { useNavStore } from "@/store/useNavStore";
import { useUserStore, useHydrated } from "@/store/useUserStore";
import { haptic } from "@/lib/motion";
import { cn } from "@/lib/cn";
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
  const hydrated = useHydrated();
  const onboarded = useUserStore((s) => s.onboarded);
  const tab = useNavStore((s) => s.tab);
  const dir = useNavStore((s) => s.dir);
  const mounted = useNavStore((s) => s.mounted);
  const go = useNavStore((s) => s.go);
  const warm = useNavStore((s) => s.warm);
  const syncFromPath = useNavStore((s) => s.syncFromPath);
  const setScroll = useNavStore((s) => s.setScroll);

  const stageRef = useRef<HTMLDivElement>(null);
  const prevTab = useRef<TabKey>(initialTab);
  const exitFromRef = useRef<TabKey>(initialTab);
  /** Раздел, доигрывающий fade-out после переключения — см. эффект ниже и .section-pane-exiting в globals.css. */
  const [exitingTab, setExitingTab] = useState<TabKey | null>(null);

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

  /**
   * ── Уход раздела: старый доигрывает fade-out, а не пропадает мгновенно.
   *
   * Раньше [hidden] у старого и нового раздела переключались в ОДНОМ
   * React-рендере — высота .app-stage скачком менялась на высоту нового
   * раздела ДО того, как анимация въезда успевала это сгладить, и это
   * читалось как рывок/наложение разных по размеру страниц. Теперь старый
   * раздел ещё кадр-другой остаётся в DOM (не [hidden]), но CSS уводит его
   * в position: absolute (.section-pane-exiting) — высоту .app-stage сразу
   * и только определяет новый раздел, а старый просто гаснет поверх, не
   * растягивая контейнер.
   */
  useEffect(() => {
    const from = exitFromRef.current;
    exitFromRef.current = tab;
    if (from === tab) return;
    setExitingTab(from);
    const timer = window.setTimeout(() => setExitingTab(null), 200);
    return () => window.clearTimeout(timer);
  }, [tab]);

  useEffect(() => {
    if (!exitingTab || prefersReducedMotion()) return;
    const stage = stageRef.current;
    const el = stage?.querySelector<HTMLElement>(`[data-section="${exitingTab}"]`);
    if (!el) return;
    try {
      el.animate(
        [
          { opacity: 1, transform: "translate3d(0, 0, 0)" },
          { opacity: 0, transform: `translate3d(${dir * -20}px, 0, 0)` },
        ],
        { duration: 190, easing: "cubic-bezier(0.4, 0, 1, 1)" },
      );
    } catch {
      // Web Animations нет — раздел просто исчезнет без анимации
    }
  }, [exitingTab, dir]);

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
      // relative — точка отсчёта для .section-pane-exiting (position:absolute,
      // inset:0): уходящий раздел оверлеит ровно ту же область, что и .app-stage.
      // min-h-0 — без него flex-ребёнок не сжимается внутри app-shell-frame
      // и просто её распирает (та же ловушка, что и у .section-pane).
      className="app-stage relative min-h-0 flex flex-1 flex-col"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
    >
      {TABS.filter((t) => mounted.includes(t)).map((t) => {
        const Section = SECTIONS[t];
        const active = t === tab;
        const exiting = t === exitingTab;
        return (
          <div
            key={t}
            data-section={t}
            {...(active ? { "data-section-active": "" } : {})}
            // скрытый раздел остаётся в дереве, но полностью выключен:
            // ни отрисовки, ни фокуса, ни озвучки скринридером. Уходящий
            // (exiting) — ещё видим и доигрывает fade-out, см. эффект ниже.
            hidden={!active && !exiting}
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
              exiting && "section-pane-exiting",
              t !== "today" && "lg:w-full lg:max-w-[1600px]",
            )}
          >
            <Section />
          </div>
        );
      })}
    </div>
  );
}
