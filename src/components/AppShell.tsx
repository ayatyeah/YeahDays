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
import { TABS, TAB_LABEL, neighbourTab, type TabKey } from "@/lib/nav";

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
const SWIPE_DISTANCE = 72;
/** Горизонталь должна явно преобладать — иначе это скролл, а не свайп.
    2.2, а не 1.6: диагональные движения при вертикальном листании
    цепляли раздел и чуть сдвигали экран — «всё ёрзает». */
const SWIPE_RATIO = 2.2;
/** Край экрана оставляем системе (свайп «назад» в браузере). */
const EDGE_GUARD = 20;


export default function AppShell({ initialTab }: { initialTab: TabKey }) {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const onboarded = useUserStore((s) => s.onboarded);
  const tab = useNavStore((s) => s.tab);
  const mounted = useNavStore((s) => s.mounted);
  const go = useNavStore((s) => s.go);
  const warm = useNavStore((s) => s.warm);
  const syncFromPath = useNavStore((s) => s.syncFromPath);
  const setScroll = useNavStore((s) => s.setScroll);

  const stageRef = useRef<HTMLDivElement>(null);
  const prevTab = useRef<TabKey>(initialTab);

  /**
   * Компактная шапка, как navigation bar в iOS: пока раздел в самом верху,
   * работает большой заголовок в контенте; прокрутил — сверху проявляется
   * полупрозрачная полоса с названием раздела. Слушаем скролл активного
   * раздела (каждый .section-pane скроллится сам), пассивно.
   */
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const el = stageRef.current?.querySelector<HTMLElement>("[data-section-active]");
    if (!el) return;
    const read = () => setScrolled(el.scrollTop > 44);
    read();
    el.addEventListener("scroll", read, { passive: true });
    return () => el.removeEventListener("scroll", read);
  }, [tab]);

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

  /*
   * Переключение раздела — мгновенное, без анимации.
   *
   * Здесь были кроссфейд и подъём нового раздела: старый ещё кадр держался
   * в дереве и гас, новый приезжал снизу за 260 мс. Задумано это было как
   * «переход ощущается переходом», а на практике мешало: между нажатием и
   * готовым экраном стояла заметная пауза. Резкая смена честнее — палец
   * нажал, экран уже другой.
   */

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
        // 20px, а не 12: до этого порога жест ещё может оказаться скроллом
        if (Math.abs(dx) < 20) return;
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
    <>
    <div
      aria-hidden
      className={cn(
        "ios-bar pointer-events-none fixed inset-x-0 top-0 z-30 lg:hidden",
        !scrolled && "ios-bar-off",
      )}
    >
      <div className="mx-auto flex h-11 max-w-md items-center justify-center pt-[env(safe-area-inset-top)] box-content">
        <span className="text-[17px] font-semibold tracking-[-0.01em]">{TAB_LABEL[tab]}</span>
      </div>
    </div>
    <div
      ref={stageRef}
      // min-h-0 — без него flex-ребёнок не сжимается внутри app-shell-frame
      // и просто её распирает (та же ловушка, что и у .section-pane).
      className="app-stage min-h-0 flex flex-1 flex-col"
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
            <Section />
          </div>
        );
      })}
    </div>
    </>
  );
}
