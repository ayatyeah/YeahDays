/**
 * Квесты: что приложение предлагает сделать сегодня и на этой неделе.
 *
 * Считает их само приложение по данным, которые и так есть: расписание,
 * закрытые дела, взятые карточки, серия, перекос по статам. Никакой
 * внешней модели — квест должен появляться мгновенно, работать офлайн и
 * быть проверяемым: если написано «две пары до обеда», то и засчитаются
 * ровно две пары до обеда, а не «примерно похожее».
 *
 * Два правила, которые держат эту механику честной:
 *
 *  1. Квест не вводит НОВОГО учёта. Всё меряется по тем же записям, что
 *     человек и так делает в приложении. Иначе появляется соблазн
 *     «отметить квест выполненным» отдельной кнопкой — и вся система
 *     превращается в самообман.
 *
 *  2. Набор квестов на период детерминирован. Одни и те же данные и тот же
 *     день дают тот же набор — на любом устройстве и после переустановки.
 *     Поэтому выбор идёт не через Math.random, а через хеш от ключа периода.
 */

import type { StatKey } from "@/lib/domain";
import { CATEGORIES, STATS } from "@/lib/domain";
import type { PlannedTask, Todo } from "@/store/useUserStore";
import { isTodoDone, isTodoOnDay } from "@/store/useUserStore";
import { categorizeTodo } from "@/lib/todoCategory";
import type { YgIconName } from "@/components/yg-icons";

export type QuestScope = "day" | "week";

export interface GameQuest {
  /** Стабильный на период: один и тот же квест в один и тот же день. */
  id: string;
  scope: QuestScope;
  title: string;
  /** Одной строкой: зачем это и как засчитается. */
  hint: string;
  icon: YgIconName;
  target: number;
  reward: { xp: number; coins: number };
}

export interface QuestProgress extends GameQuest {
  done: number;
  complete: boolean;
}

/** Всё, что нужно квестам, — то же, что уже лежит в сторе. */
export interface QuestInput {
  day: string;
  now: number;
  plan: PlannedTask[];
  todos: Todo[];
  streak: number;
  stats: Record<StatKey, number>;
}

/* ────────────────────────  Мелкие помощники  ──────────────────────── */

export function dayKeyOf(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;
}

/** Ключ недели вида 2026-W38 — им же помечается набор недельных квестов. */
export function weekKeyOf(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  // ISO-неделя: четверг той же недели определяет год и номер
  const dayNum = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - dayNum + 3);
  const firstThursday = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  const week =
    1 + Math.round((d.getTime() - firstThursday.getTime()) / (7 * 86_400_000));
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

/** Дни текущей недели до сегодняшнего включительно. */
function daysOfWeekUpTo(day: string): string[] {
  const today = new Date(`${day}T00:00:00`);
  const back = (today.getDay() + 6) % 7; // понедельник — начало
  const out: string[] = [];
  for (let i = back; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    out.push(dayKeyOf(d));
  }
  return out;
}

/** Дела со временем на этот день, ещё не отменённые. */
function timedTodosOn(todos: Todo[], day: string): Todo[] {
  return todos.filter(
    (t) => t.hour !== undefined && t.source !== "lms" && isTodoOnDay(t, day),
  );
}

function doneOn(todos: Todo[], day: string): Todo[] {
  return timedTodosOn(todos, day).filter((t) => isTodoDone(t, day));
}

/** Минута начала дела — по ней считаем «до обеда» и «первым делом». */
function startMinute(t: Todo): number {
  return (t.hour ?? 0) * 60 + (t.minute ?? 0);
}

function planCompletedOn(plan: PlannedTask[], day: string): PlannedTask[] {
  return plan.filter((p) => p.date === day && p.completed);
}

/** Самый отстающий стат — по нему приложение и предлагает подтянуться. */
export function weakestStat(stats: Record<StatKey, number>): StatKey {
  const keys = Object.keys(STATS) as StatKey[];
  return keys.reduce((low, k) => ((stats[k] ?? 0) < (stats[low] ?? 0) ? k : low), keys[0]);
}

/* ────────────────────────  Каталог  ──────────────────────── */

interface QuestKind {
  key: string;
  scope: QuestScope;
  icon: YgIconName;
  /** Есть ли смысл предлагать это сейчас. */
  fits: (input: QuestInput) => boolean;
  build: (input: QuestInput) => { title: string; hint: string; target: number; reward: { xp: number; coins: number } };
  /** Сколько уже сделано — теми же данными, что и весь остальной экран. */
  measure: (input: QuestInput) => number;
}

const KINDS: QuestKind[] = [
  {
    key: "morning",
    scope: "day",
    icon: "alarm",
    // только если утренние дела ещё впереди или уже были: вечером в 23:00
    // такой квест — издёвка
    fits: (i) => timedTodosOn(i.todos, i.day).some((t) => startMinute(t) < 12 * 60),
    build: (i) => {
      const target = Math.min(
        2,
        timedTodosOn(i.todos, i.day).filter((t) => startMinute(t) < 12 * 60).length,
      );
      return {
        title: target > 1 ? `Закрыть ${target} дела до обеда` : "Закрыть дело до обеда",
        hint: "Считаются дела со временем начала раньше 12:00.",
        target,
        reward: { xp: 10, coins: 15 },
      };
    },
    measure: (i) => doneOn(i.todos, i.day).filter((t) => startMinute(t) < 12 * 60).length,
  },
  {
    key: "classes",
    scope: "day",
    icon: "lecture",
    fits: (i) =>
      timedTodosOn(i.todos, i.day).some((t) => categorizeTodo(t.title).icon === "lecture"),
    build: (i) => {
      const target = timedTodosOn(i.todos, i.day).filter(
        (t) => categorizeTodo(t.title).icon === "lecture",
      ).length;
      return {
        title: target > 1 ? `Отсидеть все ${target} пары` : "Не пропустить пару",
        hint: "Отмечай пару выполненной, когда она прошла.",
        target,
        reward: { xp: 15, coins: 20 },
      };
    },
    measure: (i) =>
      doneOn(i.todos, i.day).filter((t) => categorizeTodo(t.title).icon === "lecture").length,
  },
  {
    key: "deck",
    scope: "day",
    icon: "target",
    fits: () => true,
    build: () => ({
      title: "Закрыть два действия из колоды",
      hint: "Свайпни вправо и доведи до галочки.",
      target: 2,
      reward: { xp: 10, coins: 15 },
    }),
    measure: (i) => planCompletedOn(i.plan, i.day).length,
  },
  {
    key: "clean_day",
    scope: "day",
    icon: "check",
    fits: (i) => timedTodosOn(i.todos, i.day).length >= 2,
    build: () => ({
      title: "День без просрочек",
      hint: "К концу дня ни одного дела со временем не должно остаться незакрытым.",
      target: 1,
      reward: { xp: 20, coins: 25 },
    }),
    measure: (i) => {
      const nowMin = new Date(i.now).getHours() * 60 + new Date(i.now).getMinutes();
      const overdue = timedTodosOn(i.todos, i.day).filter(
        (t) => startMinute(t) + (t.duration ?? 60) <= nowMin && !isTodoDone(t, i.day),
      );
      // квест держится, пока просроченного нет; закрывается он в конце дня
      return overdue.length === 0 ? 1 : 0;
    },
  },
  {
    key: "tomorrow",
    scope: "day",
    icon: "calendar",
    fits: () => true,
    build: () => ({
      title: "Разложить завтрашний день",
      hint: "Поставь два дела на завтра — хоть в расписание, хоть в список.",
      target: 2,
      reward: { xp: 10, coins: 10 },
    }),
    measure: (i) => {
      const t = new Date(`${i.day}T00:00:00`);
      t.setDate(t.getDate() + 1);
      const tomorrow = dayKeyOf(t);
      return i.todos.filter((x) => x.source !== "lms" && isTodoOnDay(x, tomorrow)).length;
    },
  },
  {
    key: "week_streak",
    scope: "week",
    icon: "flame",
    fits: () => true,
    build: (i) => {
      // цель всегда чуть выше текущего: держать серию, а не любоваться ею
      const target = Math.max(3, Math.min(7, i.streak + 2));
      return {
        title: `Серия ${target} дней подряд`,
        hint: "День засчитан, если закрыл хотя бы одно дело.",
        target,
        reward: { xp: 40, coins: 60 },
      };
    },
    measure: (i) => i.streak,
  },
  {
    key: "week_weak_stat",
    scope: "week",
    icon: "bolt",
    fits: () => true,
    build: (i) => {
      const stat = weakestStat(i.stats);
      return {
        title: `Три действия в «${STATS[stat].label}»`,
        hint: "Самый отстающий стат за эту неделю.",
        target: 3,
        reward: { xp: 30, coins: 45 },
      };
    },
    measure: (i) => {
      const stat = weakestStat(i.stats);
      const days = new Set(daysOfWeekUpTo(i.day));
      // у действия хранится категория, а стат берётся из неё — той же
      // таблицей, что и весь подсчёт статов в сторе
      return i.plan.filter(
        (p) =>
          p.completed &&
          days.has(p.date) &&
          CATEGORIES[p.snapshot.category]?.stat === stat,
      ).length;
    },
  },
  {
    key: "week_timed",
    scope: "week",
    icon: "clock",
    fits: (i) => i.todos.some((t) => t.hour !== undefined),
    build: () => ({
      title: "Десять дел по расписанию",
      hint: "Любые дела со временем, закрытые на этой неделе.",
      target: 10,
      reward: { xp: 35, coins: 50 },
    }),
    measure: (i) =>
      daysOfWeekUpTo(i.day).reduce((sum, d) => sum + doneOn(i.todos, d).length, 0),
  },
];

/* ────────────────────────  Выбор набора  ──────────────────────── */

/** Небольшой стабильный хеш: одинаковый ключ — одинаковый набор квестов. */
function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function pick(kinds: QuestKind[], seed: string, count: number): QuestKind[] {
  const pool = [...kinds];
  const out: QuestKind[] = [];
  let n = hash(seed);
  while (pool.length > 0 && out.length < count) {
    n = hash(`${seed}:${out.length}:${n}`);
    out.push(pool.splice(n % pool.length, 1)[0]);
  }
  return out;
}

export const DAILY_COUNT = 2;
export const WEEKLY_COUNT = 1;

/**
 * Набор квестов на сейчас: два дневных и один недельный.
 *
 * Мало намеренно. Длинный список заданий превращается в ещё один список
 * дел — ровно то, от чего приложение и уводит; два выполнимых квеста
 * закрываются за день и не давят.
 */
export function questsFor(input: QuestInput, salt = ""): QuestProgress[] {
  const week = weekKeyOf(new Date(`${input.day}T00:00:00`));
  const daily = pick(
    KINDS.filter((k) => k.scope === "day" && k.fits(input)),
    `${input.day}:${salt}`,
    DAILY_COUNT,
  );
  const weekly = pick(
    KINDS.filter((k) => k.scope === "week" && k.fits(input)),
    `${week}:${salt}`,
    WEEKLY_COUNT,
  );

  return [...daily, ...weekly].map((kind) => {
    const built = kind.build(input);
    const period = kind.scope === "day" ? input.day : week;
    const done = Math.max(0, kind.measure(input));
    return {
      id: `${kind.key}:${period}`,
      scope: kind.scope,
      icon: kind.icon,
      title: built.title,
      hint: built.hint,
      target: built.target,
      reward: built.reward,
      done: Math.min(done, built.target),
      complete: done >= built.target,
    };
  });
}
