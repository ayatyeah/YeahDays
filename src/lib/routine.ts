/**
 * Недельный маршрут — личное расписание, привязанное к дню недели и часам.
 *
 * Личный маршрут отключён (ROUTINE пуст) — пользователю больше не нужен
 * фиксированный почасовой план, расписание он ведёт сам через задачи.
 * Модуль и его API оставлены: TimelineSchedule/useRoutineBlock/HomeSection
 * зовут эти функции и уже корректно обрабатывают «блока нет» (null/[]),
 * так что при пустом ROUTINE всё гарантированно ведёт себя как «маршрута
 * нет вообще» без дополнительных правок в местах вызова.
 *
 * getDay(): 0 — воскресенье … 6 — суббота.
 */

import type { Action } from "./domain";

export interface RoutineBlock {
  id: string;
  /** дни недели (getDay): 0 — вс … 6 — сб */
  days: number[];
  /** час начала, включительно */
  start: number;
  /** час конца, НЕ включительно */
  end: number;
  /** точные минуты от полуночи, если блок собран из задачи плана (06:30, а не 06) */
  startMin?: number;
  endMin?: number;
  /** текст для клетки расписания — дословно из таблицы пользователя */
  label: string;
  /** якорь дня (еда, сон, отдых): показываем в расписании, но не свайпаем */
  anchor?: boolean;
  /** главная задача блока — то, что по плану */
  main?: Action;
  /** более лёгкие варианты — «если лень» */
  analogs?: Action[];
}

export const ROUTINE: RoutineBlock[] = [];

/* ────────────────────────  Поиск по маршруту  ──────────────────────── */

/** Все блоки этого дня недели, по возрастанию времени (для расписания). */
export function routineForDay(weekday: number): RoutineBlock[] {
  return ROUTINE.filter((b) => b.days.includes(weekday)).sort((a, b) => a.start - b.start);
}

/** Подпись расписания для конкретного часа, либо null. */
export function routineLabelAt(weekday: number, hour: number): string | null {
  const b = ROUTINE.find((x) => x.days.includes(weekday) && hour >= x.start && hour < x.end);
  return b ? b.label : null;
}

/**
 * Текущий рабочий блок — то, что по плану прямо сейчас. Якоря и пустые
 * промежутки дают null (колоде нечего предлагать «по плану» — покажет пул).
 */
export function currentRoutineBlock(date = new Date()): RoutineBlock | null {
  const weekday = date.getDay();
  const hour = date.getHours();
  const b = ROUTINE.find(
    (x) => !x.anchor && x.main && x.days.includes(weekday) && hour >= x.start && hour < x.end,
  );
  return b ?? null;
}

export interface RoutineNow {
  /** рабочий блок прямо сейчас (главная задача + аналоги), либо null */
  work: RoutineBlock | null;
  /** якорь прямо сейчас (Обед, Сон, Отдых…), либо null */
  anchor: RoutineBlock | null;
  /** ближайший рабочий блок сегодня ПОСЛЕ текущего часа, либо null */
  next: RoutineBlock | null;
}

/**
 * Полный контекст маршрута «сейчас»: что идёт, что дальше.
 *
 * Нужно, чтобы колода никогда не выглядела пустой без объяснения. В час
 * обеда работы по плану нет — но человеку важно видеть «сейчас обед, дальше
 * в 13:00 — Разбор недели», а не гадать, почему задач нет.
 */
export function routineNow(date = new Date()): RoutineNow {
  const weekday = date.getDay();
  const hour = date.getHours();
  const current =
    ROUTINE.find((x) => x.days.includes(weekday) && hour >= x.start && hour < x.end) ?? null;
  const next =
    ROUTINE.filter((x) => !x.anchor && x.main && x.days.includes(weekday) && x.start > hour).sort(
      (a, b) => a.start - b.start,
    )[0] ?? null;

  return {
    work: current && !current.anchor && current.main ? current : null,
    anchor: current?.anchor ? current : null,
    next,
  };
}

/** Русское название дня недели (getDay). */
export const DAY_NAME: Record<number, string> = {
  0: "воскресенье",
  1: "понедельник",
  2: "вторник",
  3: "среда",
  4: "четверг",
  5: "пятница",
  6: "суббота",
};
