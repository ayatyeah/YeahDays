/**
 * Почасовой план → контекст «что по плану сейчас» для колоды.
 *
 * Человек ведёт расписание задачами с часом (пары, зарядка, душ). Открыл
 * приложение в 06:00 — на первой карточке должна стоять «Турник, брусья,
 * бег» из плана, а не случайное действие из пула. Раньше это давал
 * встроенный маршрут (routine.ts), но он пуст: план теперь живёт в todos.
 * Модуль собирает тот же RoutineNow, поэтому колода, подсказка «дальше в…»
 * и гейт «взял — сделай» работают без изменений.
 *
 * Карточка появляется за LEAD_MIN до начала: в 06:05 уже видно зарядку на
 * 06:30 — успеть собраться, а не увидеть её, когда уже пора бежать.
 */

import type { Action, CategoryKey, StatKey } from "./domain";
import { categorizeTodo } from "./todoCategory";
import { fmtMin, todoEndMin, todoStartMin } from "./todoSpan";
import { isTodoDone, isTodoOnDay, type Todo } from "@/store/useUserStore";
import type { RoutineBlock, RoutineNow } from "./routine";

/** За сколько минут до старта задача поднимается в колоду. */
export const LEAD_MIN = 30;

/** Префикс id действия, собранного из задачи плана. */
export const TODO_ACTION_PREFIX = "todo:";

export function todoIdFromAction(actionId: string): string | null {
  return actionId.startsWith(TODO_ACTION_PREFIX)
    ? actionId.slice(TODO_ACTION_PREFIX.length)
    : null;
}

/**
 * Стат задачи → категория карточки. У стата несколько категорий (wealth —
 * финансы и карьера); берём первую, что ближе к «по плану»: карьера и учёба,
 * а не деньги и творчество.
 */
const STAT_CATEGORY: Record<StatKey, CategoryKey> = {
  strength: "fitness",
  health: "health",
  intelligence: "learning",
  wealth: "career",
  stability: "discipline",
};

/** Сложность по длительности: до получаса легко, до полутора — норма, дальше тяжело. */
function difficultyFor(minutes: number): Action["difficulty"] {
  if (minutes <= 30) return 1;
  if (minutes <= 90) return 2;
  return 3;
}

/** Действие колоды из задачи плана — снимок для PlannedTask и карточки. */
export function todoToAction(t: Todo): Action {
  const start = todoStartMin(t);
  const end = todoEndMin(t);
  const range = start !== null && end !== null ? `${fmtMin(start)}–${fmtMin(end)}` : "";
  const minutes = t.duration ?? 60;
  const kind = categorizeTodo(t.title);
  return {
    id: TODO_ACTION_PREFIX + t.id,
    title: t.title,
    why: range
      ? `Из твоего плана на ${range}. Сделаешь — в календаре встанет галочка.`
      : "Из твоего плана на сегодня. Сделаешь — в календаре встанет галочка.",
    category: STAT_CATEGORY[kind.stat],
    icon: kind.icon,
    difficulty: difficultyFor(minutes),
    duration: minutes,
    energy: "medium",
    timePreference: "any",
    impact: 3,
    custom: true,
  };
}

interface Timed {
  todo: Todo;
  start: number;
  end: number;
}

function blockOf({ todo, start, end }: Timed, weekday: number): RoutineBlock {
  return {
    id: TODO_ACTION_PREFIX + todo.id,
    days: [weekday],
    start: Math.floor(start / 60),
    end: Math.ceil(end / 60),
    startMin: start,
    endMin: end,
    label: todo.title,
    main: todoToAction(todo),
  };
}

/**
 * Что по плану сейчас и что дальше — из задач с часом на этот день.
 * Сделанные не показываем: галочка в календаре уже стоит, карточке нечего
 * предлагать. Несколько задач разом (наложились) — раньше начавшаяся первой.
 */
export function planNow(todos: Todo[], date = new Date(), day = localDay(date)): RoutineNow {
  const nowMin = date.getHours() * 60 + date.getMinutes();
  const weekday = date.getDay();

  const timed: Timed[] = [];
  for (const todo of todos) {
    if (todo.hour === undefined) continue;
    if (!isTodoOnDay(todo, day) || isTodoDone(todo, day)) continue;
    const start = todoStartMin(todo);
    const end = todoEndMin(todo);
    if (start === null || end === null) continue;
    timed.push({ todo, start, end });
  }
  timed.sort((a, b) => a.start - b.start);

  const current = timed.find((x) => x.start - LEAD_MIN <= nowMin && nowMin < x.end) ?? null;
  // «Дальше» — просто следующая по времени. Без текущей та, что уже в окне
  // упреждения, сама стала бы текущей, так что отдельно её отсекать не надо.
  const next = timed.find((x) => x !== current && x.start > nowMin) ?? null;

  return {
    work: current ? blockOf(current, weekday) : null,
    anchor: null,
    next: next ? blockOf(next, weekday) : null,
  };
}

/** YYYY-MM-DD по локальному времени — тот же формат, что у Todo.date. */
function localDay(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
