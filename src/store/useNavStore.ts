"use client";

import { create } from "zustand";
import {
  TAB_PATH,
  tabFromPath,
  tabIndex,
  type TabKey,
} from "@/lib/nav";

/**
 * Состояние оболочки приложения: какой раздел открыт, откуда пришли
 * (для направления анимации) и какие разделы уже смонтированы.
 *
 * Смонтированные разделы НЕ размонтируются при уходе: это и есть разница
 * между «переключил вкладку» и «загрузил страницу». Возврат на вкладку
 * мгновенный, состояние экрана (позиция скролла, открытый месяц календаря,
 * набранный текст) на месте.
 */

interface NavState {
  tab: TabKey;
  /** +1 — новый раздел правее прежнего, -1 — левее. Для направления анимации. */
  dir: 1 | -1;
  /** какие разделы уже были открыты хотя бы раз (их держим в дереве) */
  mounted: TabKey[];
  /** позиция скролла по разделам, чтобы возврат был точно туда, где ушёл */
  scroll: Partial<Record<TabKey, number>>;
  /** переключить раздел (обновляет адрес через History API) */
  go: (tab: TabKey) => void;
  /** синхронизация из адреса: назад/вперёд, deep-link, обычная навигация */
  syncFromPath: (pathname: string) => void;
  /** заранее смонтировать раздел, чтобы первое открытие было без задержки */
  warm: (tab: TabKey) => void;
  setScroll: (tab: TabKey, y: number) => void;
}

/**
 * Обновить адрес без навигации Next.
 *
 * Именно здесь живёт «бесшовность»: pushState не дёргает роутер, не идёт в
 * сеть за RSC-пейлоадом и не размонтирует дерево — меняется только строка
 * адреса и запись в истории. Next 15+ синхронизирует usePathname с этим
 * вызовом, поэтому остальное приложение видит корректный адрес.
 */
function pushPath(path: string) {
  if (typeof window === "undefined") return;
  const current = window.location.pathname + window.location.search;
  if (current === path) return;
  try {
    window.history.pushState(null, "", path);
  } catch {
    // приватные режимы иногда режут History API — раздел всё равно переключится
  }
}

export const useNavStore = create<NavState>((set, get) => ({
  // Всегда "today" на старте: должно совпадать на сервере и при гидратации
  // на клиенте, иначе React увидит расхождение (SSR/CSR mismatch). Верный
  // раздел для deep-link выставляет AppShell в useLayoutEffect до отрисовки
  // — там уже безопасно читать адрес. Значение само по себе произвольное
  // (важно только совпадение сервер/клиент) — "today", потому что это и
  // есть раздел по умолчанию (см. start_url в manifest.webmanifest).
  tab: "today",
  dir: 1,
  mounted: ["today"],
  scroll: {},

  go: (tab) => {
    const state = get();
    if (state.tab === tab) {
      // повторный тап по активной вкладке — «наверх», как в нативных приложениях
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }
    pushPath(TAB_PATH[tab]);
    set({
      tab,
      dir: tabIndex(tab) > tabIndex(state.tab) ? 1 : -1,
      mounted: state.mounted.includes(tab)
        ? state.mounted
        : [...state.mounted, tab],
    });
  },

  syncFromPath: (pathname) => {
    const tab = tabFromPath(pathname);
    if (!tab) return;
    const state = get();
    if (state.tab === tab) return;
    set({
      tab,
      dir: tabIndex(tab) > tabIndex(state.tab) ? 1 : -1,
      mounted: state.mounted.includes(tab)
        ? state.mounted
        : [...state.mounted, tab],
    });
  },

  warm: (tab) => {
    const state = get();
    if (state.mounted.includes(tab)) return;
    set({ mounted: [...state.mounted, tab] });
  },

  setScroll: (tab, y) =>
    set((s) => ({ scroll: { ...s.scroll, [tab]: y } })),
}));

/** Текущий раздел — для компонентов вне оболочки (нижняя навигация). */
export const useTab = () => useNavStore((s) => s.tab);
