/**
 * Значки YeahGrind — свой набор вместо эмодзи.
 *
 * Эмодзи рисует система: на iPhone, Android и в Chrome они выглядят
 * по-разному, не красятся в цвет стата и спорят с матовым минимализмом
 * интерфейса. Здесь один язык: сетка 24, штрих 1.7, скруглённые концы,
 * `currentColor` — значок наследует цвет текста, поэтому «Сила» красная,
 * «Стабильность» зелёная ровно теми же токенами, что и подписи.
 *
 * Те же правила, что у иконок навигации (nav-icons.tsx) — они одна семья.
 *
 * Имя значка хранится в данных (STATS, CATEGORIES, categorizeTodo…) как
 * строка из YgIconName и рендерится через <YgIcon name=…/>.
 */

import type { ReactNode } from "react";

export type YgIconName =
  // статы
  | "bolt"
  | "heart"
  | "bulb"
  | "coin"
  | "shield"
  // категории действий
  | "run"
  | "leaf"
  | "book"
  | "palette"
  | "rocket"
  | "target"
  | "lotus"
  | "chat"
  // категории задач плана
  | "moon"
  | "wind"
  | "meal"
  | "stretch"
  | "drop"
  | "alarm"
  | "pause"
  | "mic"
  | "code"
  | "dumbbell"
  | "wrench"
  | "note"
  | "coffee"
  | "clock"
  | "dot"
  // университет: пары, LMS
  | "lecture"
  | "practice"
  | "online"
  | "exam"
  | "attendance"
  | "assignment"
  | "campus"
  // состояние и настроение
  | "cloud"
  | "face-sad"
  | "face-meh"
  | "face-neutral"
  | "face-smile"
  // цели, прогресс, стрик
  | "flame"
  | "sparkle"
  | "star"
  | "cards"
  | "ladder"
  | "chart"
  | "snowflake"
  | "check"
  // служебные
  | "close"
  | "bell"
  | "phone"
  | "install"
  | "refresh"
  | "person"
  | "sun"
  | "sunrise"
  | "calendar"
  | "pencil"
  | "wifi-off"
  | "haze"
  | "chevron";

/** Контуры. Штрих и скругления задаёт корневой <svg>, здесь только геометрия. */
const PATHS: Record<YgIconName, ReactNode> = {
  /* ── статы ── */
  bolt: <path d="M13 3 5.5 13.5H11L10 21l7.5-10.5H12L13 3Z" />,
  heart: (
    <path d="M12 20s-7-4.4-7-9.6A3.9 3.9 0 0 1 12 8.2a3.9 3.9 0 0 1 7 2.2C19 15.6 12 20 12 20Z" />
  ),
  bulb: (
    <>
      <path d="M8.5 14.5a5.5 5.5 0 1 1 7 0c-.7.6-1.2 1.4-1.2 2.5H9.7c0-1.1-.5-1.9-1.2-2.5Z" />
      <path d="M9.5 20h5" />
    </>
  ),
  coin: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M14.5 9.6c-.4-1-1.3-1.6-2.5-1.6-1.5 0-2.5.8-2.5 2 0 2.6 5 1.4 5 4.1 0 1.2-1 2-2.5 2s-2.4-.7-2.7-1.7M12 6.5V8m0 8v1.5" />
    </>
  ),
  shield: <path d="M12 3.5 5 6.2v5.3c0 4.3 3 7.6 7 9 4-1.4 7-4.7 7-9V6.2L12 3.5Z" />,

  /* ── категории действий ── */
  run: (
    <>
      <circle cx="14.5" cy="5" r="1.7" />
      <path d="M13 8.5 9.5 10 8 13.5M13 8.5l3 2.5 3-1.5M13 8.5l-1.5 5 3 2.5 1 4.5M11.5 13.5 9 16l-4 1.5" />
    </>
  ),
  leaf: (
    <>
      <path d="M5.5 18.5C5.5 10.5 10.5 5.5 19 5.5c0 8.5-5 13.5-13 13" />
      <path d="M5.5 18.5c2.5-4.2 6-7.7 10-10" />
    </>
  ),
  book: (
    <>
      <path d="M12 7c-1.5-1.5-4-2-7.5-2v13c3.5 0 6 .5 7.5 2 1.5-1.5 4-2 7.5-2V5c-3.5 0-6 .5-7.5 2Z" />
      <path d="M12 7v13" />
    </>
  ),
  palette: (
    <>
      <path d="M12 3.5a8.5 8.5 0 1 0 0 17c1.4 0 2-.9 2-1.8 0-1.2-1-1.5-1-2.7 0-1 .8-1.7 1.8-1.7H16a4.5 4.5 0 0 0 4.5-4.5C20.5 6.4 16.7 3.5 12 3.5Z" />
      <circle cx="8" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="9.5" cy="8" r="1" fill="currentColor" stroke="none" />
      <circle cx="14" cy="7.2" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  rocket: (
    <>
      <path d="M12 3.5c3 2 4.5 5.5 4.5 9.5l-2.5 2.5h-4L7.5 13c0-4 1.5-7.5 4.5-9.5Z" />
      <path d="M7.5 13 5 15.5v3l3-1.5M16.5 13 19 15.5v3l-3-1.5M10 15.5v4l2-1 2 1v-4" />
      <circle cx="12" cy="10" r="1.5" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  lotus: (
    <>
      <path d="M12 20c-2-1.5-3.5-4-3.5-7 0-3 1.5-5.5 3.5-7 2 1.5 3.5 4 3.5 7 0 3-1.5 5.5-3.5 7Z" />
      <path d="M12 20c-4 0-7.5-2.5-8.5-6.5 3 0 5.5 1 7 3M12 20c4 0 7.5-2.5 8.5-6.5-3 0-5.5 1-7 3" />
    </>
  ),
  chat: (
    <path d="M12 4c-4.7 0-8.5 3.1-8.5 7 0 2 1 3.8 2.6 5.1L5 20l4.2-1.5c.9.3 1.8.4 2.8.4 4.7 0 8.5-3.1 8.5-7S16.7 4 12 4Z" />
  ),

  /* ── категории задач плана ── */
  moon: <path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10Z" />,
  wind: <path d="M3.5 8.5h9a2.5 2.5 0 1 0-2.5-2.5M3.5 12.5h13.5a2.5 2.5 0 1 1-2.5 2.5M3.5 16.5h7a2 2 0 1 1-2 2" />,
  meal: <path d="M6 3.5v17M4 3.5v5a2 2 0 0 0 4 0v-5M17.5 3.5c-1.7 0-3 2.3-3 5s1.3 4 3 4v8" />,
  stretch: (
    <>
      <circle cx="12" cy="4.5" r="1.8" />
      <path d="M12 8v6M12 8 7 5M12 8l5-3M12 14l-3.5 6.5M12 14l3.5 6.5" />
    </>
  ),
  drop: <path d="M12 3.5c3.5 4.5 6 7.6 6 10.8a6 6 0 0 1-12 0c0-3.2 2.5-6.3 6-10.8Z" />,
  alarm: (
    <>
      <circle cx="12" cy="13" r="7" />
      <path d="M12 9.5V13l2.5 1.5M4 6.5 6.5 4M20 6.5 17.5 4" />
    </>
  ),
  pause: <path d="M8.5 5.5v13M15.5 5.5v13" />,
  mic: (
    <>
      <rect x="9" y="3.5" width="6" height="11" rx="3" />
      <path d="M6 11.5a6 6 0 0 0 12 0M12 17.5v3M9 20.5h6" />
    </>
  ),
  code: <path d="m8 8-4.5 4L8 16M16 8l4.5 4L16 16M13.5 5l-3 14" />,
  dumbbell: <path d="M3.5 12h2M18.5 12h2M6 9v6M18 9v6M8.5 7.5v9M15.5 7.5v9M8.5 12h7" />,
  wrench: (
    <path d="M14.5 4a5 5 0 0 0-4.3 7.2L4 17.4 6.6 20l6.2-6.2A5 5 0 0 0 20 9.5l-3 1-2-2 1-3-1.5-1.5Z" />
  ),
  note: (
    <>
      <path d="M6.5 3.5h8l4 4v13h-12v-17Z" />
      <path d="M14.5 3.5v4h4M9 12h6M9 15.5h6" />
    </>
  ),
  coffee: (
    <>
      <path d="M5 8.5h11v6a4.5 4.5 0 0 1-4.5 4.5h-2A4.5 4.5 0 0 1 5 14.5v-6Z" />
      <path d="M16 10.5h1.5a2 2 0 0 1 0 4H16M8 3.5v2.5M11 3.5v2.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  dot: <circle cx="12" cy="12" r="4.5" fill="currentColor" stroke="none" />,

  /* ── университет ── */
  // доска на стойке — лекция: слушаешь и записываешь
  lecture: (
    <>
      <rect x="3.5" y="4.5" width="17" height="11" rx="2" />
      <path d="M7.5 8.5h9M7.5 11.5h5M12 15.5v5M8.5 20.5l3.5-5 3.5 5" />
    </>
  ),
  // тетрадь и ручка — практика: делаешь руками
  practice: (
    <>
      <path d="M5 5.5A1.5 1.5 0 0 1 6.5 4H14a1.5 1.5 0 0 1 1.5 1.5v14.5H6.5A1.5 1.5 0 0 1 5 18.5v-13Z" />
      <path d="M8.5 8.5h4M8.5 11.5h4M18.5 8v8l1.5 2.5L21.5 16V8h-3Z" />
    </>
  ),
  // монитор с плеем — пара онлайн
  online: (
    <>
      <rect x="3.5" y="5" width="17" height="11.5" rx="2" />
      <path d="M8.5 20h7M12 16.5V20M10.5 8.5v4.5l3.8-2.25-3.8-2.25Z" />
    </>
  ),
  // академическая шапочка — экзамен, мидтерм
  exam: (
    <>
      <path d="M3.5 9.5 12 5.5l8.5 4-8.5 4-8.5-4Z" />
      <path d="M7 11.5v4.2c0 1.1 2.2 2.3 5 2.3s5-1.2 5-2.3v-4.2M20.5 9.5v5" />
    </>
  ),
  // планшет с галочкой — посещаемость в LMS
  attendance: (
    <>
      <rect x="5.5" y="5" width="13" height="15.5" rx="2" />
      <path d="M9.5 5V3.5h5V5M9 13l2.2 2.2L15.5 11" />
    </>
  ),
  // документ с часами — дедлайн: сдать к сроку
  assignment: (
    <>
      <path d="M12.5 20.5h-6A1.5 1.5 0 0 1 5 19V5a1.5 1.5 0 0 1 1.5-1.5h7l4 4v3" />
      <path d="M13.5 3.5v4h4" />
      <circle cx="17" cy="17" r="3.5" />
      <path d="M17 15.3V17l1.2.8" />
    </>
  ),
  // здание с колоннами — университет вообще
  campus: (
    <path d="M3.5 20.5h17M4.5 9.5h15M12 4.5l-7.5 5h15L12 4.5ZM6.5 9.5v11M10.5 9.5v11M13.5 9.5v11M17.5 9.5v11" />
  ),

  /* ── состояние и настроение ── */
  cloud: <path d="M7 18.5h10.5a3.75 3.75 0 0 0 .5-7.5 6 6 0 0 0-11.6 1.5A3 3 0 0 0 7 18.5Z" />,
  "face-sad": (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="9" cy="9.8" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="9.8" r="1" fill="currentColor" stroke="none" />
      <path d="M8.8 16.2c1.8-1.8 4.6-1.8 6.4 0" />
    </>
  ),
  "face-meh": (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="9" cy="9.8" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="9.8" r="1" fill="currentColor" stroke="none" />
      <path d="M8.6 15.6c1.2-.8 2.3-1 3.4-.5s2.2.3 3.4-.5" />
    </>
  ),
  "face-neutral": (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="9" cy="9.8" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="9.8" r="1" fill="currentColor" stroke="none" />
      <path d="M8.8 15.5h6.4" />
    </>
  ),
  "face-smile": (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="9" cy="9.8" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="9.8" r="1" fill="currentColor" stroke="none" />
      <path d="M8.8 14.5c1.8 1.8 4.6 1.8 6.4 0" />
    </>
  ),

  /* ── цели, прогресс, стрик ── */
  flame: (
    <path d="M12 21c-3.9 0-6.5-2.6-6.5-6.1 0-2.6 1.6-4.4 3-6 .2 1.4.9 2.3 2 2.6-.4-2.9.7-6 3.5-8 .2 3 1.6 4.4 3 6 1 1.3 1.5 2.7 1.5 4.4C18.5 18.4 15.9 21 12 21Z" />
  ),
  sparkle: (
    <path d="M12 3.5c.6 4.5 3.5 7.4 8.5 8.5-5 .9-8 3.7-8.5 8.5C11.4 16 8.5 13 3.5 12c5-1 8-4 8.5-8.5Z" />
  ),
  star: <path d="m12 3.8 2.5 5.3 5.7.7-4.2 4 1.1 5.7L12 16.7l-5.1 2.8 1.1-5.7-4.2-4 5.7-.7L12 3.8Z" />,
  cards: (
    <>
      <rect x="8" y="4" width="11" height="15" rx="2.5" />
      <path d="M5 8v9.5A2.5 2.5 0 0 0 7.5 20H15" />
    </>
  ),
  ladder: <path d="M8 3.5v17M16 3.5v17M8 7.5h8M8 12h8M8 16.5h8" />,
  chart: <path d="M4 19.5h16M5 15l4.5-4.5 3.5 3 6-6M15.5 7.5H19V11" />,
  snowflake: <path d="M12 12L12 3.5M12 6.4L13.9 4.4M12 6.4L10.1 4.4M12 12L19.4 7.8M16.8 9.2L19.5 9.8M16.8 9.2L17.6 6.6M12 12L19.4 16.2M16.8 14.8L17.6 17.4M16.8 14.8L19.5 14.2M12 12L12 20.5M12 17.6L10.1 19.6M12 17.6L13.9 19.6M12 12L4.6 16.2M7.2 14.8L4.5 14.2M7.2 14.8L6.4 17.4M12 12L4.6 7.7M7.2 9.2L6.4 6.6M7.2 9.2L4.5 9.8" />,
  check: <path d="M5 12.5 9.5 17 19 7" />,

  /* ── служебные ── */
  close: <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />,
  bell: (
    <>
      <path d="M6.5 16.5v-5a5.5 5.5 0 0 1 11 0v5l1.5 1.5h-14l1.5-1.5Z" />
      <path d="M10 20.5a2 2 0 0 0 4 0" />
    </>
  ),
  phone: (
    <>
      <rect x="7" y="3" width="10" height="18" rx="2.5" />
      <path d="M11 17.5h2" />
    </>
  ),
  install: (
    <>
      <rect x="7" y="3" width="10" height="18" rx="2.5" />
      <path d="M12 7.5v6M9.5 11l2.5 2.5 2.5-2.5" />
    </>
  ),
  refresh: <path d="M20 12a8 8 0 0 1-13.7 5.6M4 12a8 8 0 0 1 13.7-5.6M17.5 3v3.5H14M6.5 21v-3.5H10" />,
  person: (
    <>
      <circle cx="12" cy="8.2" r="3.5" />
      <path d="M5 20c0-3.4 3.1-5.4 7-5.4s7 2 7 5.4" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4" />
    </>
  ),
  sunrise: <path d="M3.5 18.5h17M6 15a6 6 0 0 1 12 0M12 3.5V7M5.5 8.5 7 10M18.5 8.5 17 10" />,
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="3.5" />
      <path d="M3.5 9.5h17M8 3.5V6m8-2.5V6" />
    </>
  ),
  pencil: <path d="M4 20l1-4.5L16.5 4a2.1 2.1 0 0 1 3 3L8 18.5 4 20ZM14.5 6l3.5 3.5" />,
  "wifi-off": (
    <>
      <path d="M4 9.5a12 12 0 0 1 16 0M7 12.5a8 8 0 0 1 10 0M10 15.5a4 4 0 0 1 4 0M4 4l16 16" />
      <circle cx="12" cy="18.5" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  haze: <path d="M4 9.5h11M6 13.5h13M9 17.5h9" />,
  // стрелка перехода в строках списков; влево — через rotate-180
  chevron: <path d="m9.5 6 6 6-6 6" />,
};

export interface YgIconProps {
  name: YgIconName;
  className?: string;
  /** толщина штриха; 1.7 — как у навигации, галочки и крестики чуть жирнее */
  strokeWidth?: number;
  /** подпись для скринридера; без неё значок декоративный */
  title?: string;
}

export function YgIcon({ name, className = "h-5 w-5", strokeWidth = 1.7, title }: YgIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
    >
      {title ? <title>{title}</title> : null}
      {PATHS[name]}
    </svg>
  );
}

/** Все имена — для витрины и тестов на полноту набора. */
export const YG_ICON_NAMES = Object.keys(PATHS) as YgIconName[];
