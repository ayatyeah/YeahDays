/**
 * Карта разделов приложения.
 *
 * До этого пять экранов приложения были пятью маршрутами Next, и каждое
 * переключение вкладки означало настоящую навигацию: размонтирование дерева,
 * запрос RSC-пейлоада, повторную гидратацию и потерю состояния экрана.
 * На телефоне это читается как «сайт», а не как приложение.
 *
 * Теперь это ОДИН экран с разделами: маршруты остались (deep-link из пуша,
 * ярлыки манифеста, шеринг ссылки), но внутри приложения переключение
 * вкладки — смена секции без навигации. Адрес обновляется через History API,
 * чтобы «назад» и ссылки продолжали работать.
 */

export const TABS = ["today", "home", "calendar", "progress", "account"] as const;

export type TabKey = (typeof TABS)[number];

/** Канонический адрес раздела — он же deep-link. */
export const TAB_PATH: Record<TabKey, string> = {
  home: "/app",
  today: "/today",
  calendar: "/calendar",
  progress: "/progress",
  account: "/account",
};

export const TAB_LABEL: Record<TabKey, string> = {
  home: "Колода",
  today: "Сегодня",
  calendar: "Календарь",
  progress: "Прогресс",
  account: "Профиль",
};

const PATH_TAB: Record<string, TabKey> = Object.entries(TAB_PATH).reduce(
  (acc, [tab, path]) => {
    acc[path] = tab as TabKey;
    return acc;
  },
  {} as Record<string, TabKey>,
);

/** Раздел по адресу. null — адрес не относится к оболочке приложения. */
export function tabFromPath(pathname: string): TabKey | null {
  const clean = pathname.replace(/\/+$/, "") || "/";
  return PATH_TAB[clean] ?? null;
}

/** Порядковый номер — им задаётся направление перехода (влево/вправо). */
export function tabIndex(tab: TabKey): number {
  const i = TABS.indexOf(tab);
  return i < 0 ? 0 : i;
}

/** Соседний раздел в направлении свайпа (null — край). */
export function neighbourTab(tab: TabKey, dir: 1 | -1): TabKey | null {
  const next = tabIndex(tab) + dir;
  return TABS[next] ?? null;
}
