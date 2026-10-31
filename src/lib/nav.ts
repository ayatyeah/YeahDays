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

export const TABS = ["home", "today", "calendar", "progress", "account"] as const;

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
  home: "Главная",
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


/**
 * Пункты нижнего меню по порядку. «Учёба» и «Вместе» — отдельные страницы,
 * остальные — разделы оболочки.
 */
export const NAV_ORDER = ["today", "learn", "community", "progress", "account"] as const;

export type NavKey = (typeof NAV_ORDER)[number];

/**
 * Какой пункт меню горит, когда открыт раздел оболочки.
 *
 * «Колода» (/app — туда ведут регистрация, вход и ярлык приложения) и
 * календарь в меню своих пунктов не имеют: их открывают из «Сегодня».
 * Раньше на них не горело ничего, и человек сразу после регистрации
 * оказывался на экране «ниоткуда», а «Сегодня» выглядел вторым, другим
 * главным экраном.
 */
export function navKeyForTab(tab: TabKey): NavKey {
  return tab === "home" || tab === "calendar" ? "today" : tab;
}

export type SwipeTarget = { tab: TabKey } | { href: string };

/**
 * Куда ведёт горизонтальный свайп по разделу — строго в порядке меню.
 *
 * Раньше свайп ходил по внутреннему списку разделов (колода → сегодня →
 * календарь → прогресс → профиль): из «Сегодня» влево открывался
 * календарь, хотя в меню следующей стоит «Учёба». Теперь соседи те же, что
 * в меню; «Учёба» и «Вместе» открываются переходом на страницу. С колоды
 * и календаря свайпа нет — это подэкраны «Сегодня», а не пункты меню.
 */
export function swipeTarget(tab: TabKey, dir: 1 | -1): SwipeTarget | null {
  const i = (NAV_ORDER as readonly string[]).indexOf(tab);
  if (i < 0) return null;
  const next = NAV_ORDER[i + dir];
  if (!next) return null;
  return next === "learn" || next === "community" ? { href: `/${next}` } : { tab: next };
}
