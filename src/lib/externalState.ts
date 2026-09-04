/**
 * Read-modify-write поверх UserState.data для серверных путей, которые
 * действуют от имени пользователя без браузерного стора — внешние
 * интеграции (/api/integrations/*).
 *
 * Специально не импортирует типы/функции из src/store/useUserStore.ts —
 * тот файл клиентский ("use client"), а create(persist(...)) в нём при
 * импорте как значения попытался бы тронуть localStorage, которого в
 * Node-рантайме нет. Отсюда локальные копии форм.
 */

import { prisma } from "@/lib/db";
import { upsertUserStateIfNewer } from "@/lib/userState";

export interface Todo {
  id: string;
  title: string;
  note?: string;
  date: string;
  hour?: number;
  /** минута начала внутри часа — в клиентском типе есть, здесь её не хватало */
  minute?: number;
  duration?: number;
  priority: "low" | "normal" | "high";
  subtasks: { id: string; title: string; done: boolean }[];
  repeat?: { kind: string; weekday?: number };
  done: boolean;
  doneDays: string[];
  createdAt: number;
  completedAt: number | null;
}

export interface PlannedTask {
  id: string;
  actionId: string;
  snapshot: {
    title?: string;
    category?: string;
    difficulty?: number;
    impact?: number;
    duration?: number;
  };
  xp: number;
  date: string;
  completed: boolean;
  acceptedAt: number;
  completedAt: number | null;
}

export interface DailyMood {
  energy: "low" | "medium" | "high";
  minutes: number;
}

export interface StateShape {
  todos?: Todo[];
  plan?: PlannedTask[];
  moods?: Record<string, DailyMood>;
  updatedAt?: number;
  [key: string]: unknown;
}

export function makeId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function isTodoOnDay(t: Todo, day: string): boolean {
  if (!t.repeat) return t.date === day;
  if (day < t.date) return false;
  const wd = new Date(`${day}T00:00:00`).getDay();
  switch (t.repeat.kind) {
    case "daily":
      return true;
    case "weekdays":
      return wd >= 1 && wd <= 5;
    case "weekends":
      return wd === 0 || wd === 6;
    case "weekly":
      return wd === (t.repeat.weekday ?? new Date(`${t.date}T00:00:00`).getDay());
    default:
      return false;
  }
}

export function isTodoDone(t: Todo, day: string): boolean {
  return t.repeat ? t.doneDays.includes(day) : t.done;
}

/** Читаем строку состояния (или пустую заготовку, если пользователь ещё не синхронизировался). */
export async function loadState(userId: string): Promise<StateShape> {
  const row = await prisma.userState.findUnique({ where: { userId } });
  const data = (row?.data as StateShape) ?? {};
  return {
    ...data,
    todos: Array.isArray(data.todos) ? data.todos : [],
    plan: Array.isArray(data.plan) ? data.plan : [],
    moods: data.moods && typeof data.moods === "object" ? data.moods : {},
  };
}

/** Пишем обратно с бампом updatedAt — эквивалент touch() в сторе. */
export async function saveState(userId: string, data: StateShape) {
  const updatedAt = Date.now();
  const next = { ...data, updatedAt };
  await upsertUserStateIfNewer(userId, next, updatedAt);
  return next;
}
