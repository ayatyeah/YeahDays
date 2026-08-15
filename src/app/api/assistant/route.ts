/**
 * /api/assistant — узкий канал для голосового помощника ДиДи.
 *
 * ДиДи — отдельный процесс (папка assistant/ в этом репозитории), не
 * браузер и не next-auth сессия. Поэтому авторизация — общий секрет
 * (ASSISTANT_SECRET) в заголовке, а userId передаётся явно телом/query —
 * тот же анонимный id, что лежит в localStorage браузера под ключом
 * "yd-uid" (см. src/lib/userId.ts).
 *
 * Специально НЕ трогаем весь UserState.data целиком и не дублируем стор:
 * читаем строку, точечно правим только поля todos/moods, бампаем
 * updatedAt (это и есть "touch" из useUserStore) и сохраняем — тот же
 * контракт last-write-wins, что и у /api/state.
 *
 * "today" всегда приходит от клиента (ДиДи знает локальную дату
 * ноутбука) — сервер (Railway, UTC) не должен угадывать локальный день
 * пользователя.
 *
 * GET  ?userId=&date=YYYY-MM-DD           → сводка на день для ДиДи
 * POST { action: "add_todo", userId, title, date, hour?, duration?, priority? }
 * POST { action: "complete_todo", userId, id, day, done }
 * POST { action: "set_mood", userId, date, energy, minutes }
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { upsertUserStateIfNewer } from "@/lib/userState";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Todo {
  id: string;
  title: string;
  note?: string;
  date: string;
  hour?: number;
  duration?: number;
  priority: "low" | "normal" | "high";
  subtasks: { id: string; title: string; done: boolean }[];
  repeat?: { kind: string; weekday?: number };
  done: boolean;
  doneDays: string[];
  createdAt: number;
  completedAt: number | null;
}

interface PlannedTask {
  id: string;
  actionId: string;
  snapshot: { title?: string; category?: string };
  xp: number;
  date: string;
  completed: boolean;
  acceptedAt: number;
  completedAt: number | null;
}

interface DailyMood {
  energy: "low" | "medium" | "high";
  minutes: number;
}

interface StateShape {
  todos?: Todo[];
  plan?: PlannedTask[];
  moods?: Record<string, DailyMood>;
  updatedAt?: number;
  [key: string]: unknown;
}

function authorized(req: Request): boolean {
  const secret = process.env.ASSISTANT_SECRET;
  if (!secret) return false;
  const header = req.headers.get("authorization") ?? "";
  return header === `Bearer ${secret}`;
}

function makeId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function isTodoOnDay(t: Todo, day: string): boolean {
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

function isTodoDone(t: Todo, day: string): boolean {
  return t.repeat ? t.doneDays.includes(day) : t.done;
}

/** Читаем строку состояния (или пустую заготовку, если пользователь ещё не синхронизировался). */
async function loadState(userId: string): Promise<StateShape> {
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
async function saveState(userId: string, data: StateShape) {
  const updatedAt = Date.now();
  const next = { ...data, updatedAt };
  await upsertUserStateIfNewer(userId, next, updatedAt);
  return next;
}

export async function GET(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId") ?? "";
  const date = url.searchParams.get("date") ?? "";
  if (!userId || !date) {
    return NextResponse.json({ error: "userId and date required" }, { status: 400 });
  }

  const state = await loadState(userId);
  const todosToday = (state.todos ?? [])
    .filter((t) => isTodoOnDay(t, date))
    .map((t) => ({
      id: t.id,
      title: t.title,
      hour: t.hour ?? null,
      priority: t.priority,
      done: isTodoDone(t, date),
    }));
  const planToday = (state.plan ?? [])
    .filter((p) => p.date === date)
    .map((p) => ({
      id: p.id,
      title: p.snapshot?.title ?? p.actionId,
      completed: p.completed,
    }));
  const mood = state.moods?.[date] ?? null;

  return NextResponse.json({ date, mood, todos: todosToday, plan: planToday });
}

export async function POST(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const userId = typeof body.userId === "string" ? body.userId : "";
  const action = typeof body.action === "string" ? body.action : "";
  if (!userId || !action) {
    return NextResponse.json({ error: "userId and action required" }, { status: 400 });
  }

  const state = await loadState(userId);

  if (action === "add_todo") {
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const date = typeof body.date === "string" ? body.date : "";
    if (!title || !date) {
      return NextResponse.json({ error: "title and date required" }, { status: 400 });
    }
    const todo: Todo = {
      id: makeId(),
      title,
      date,
      hour: typeof body.hour === "number" ? body.hour : undefined,
      duration: typeof body.duration === "number" ? body.duration : undefined,
      priority:
        body.priority === "high" || body.priority === "low" ? body.priority : "normal",
      subtasks: [],
      done: false,
      doneDays: [],
      createdAt: Date.now(),
      completedAt: null,
    };
    state.todos = [todo, ...(state.todos ?? [])];
    await saveState(userId, state);
    return NextResponse.json({ ok: true, todo });
  }

  if (action === "complete_todo") {
    const id = typeof body.id === "string" ? body.id : "";
    const day = typeof body.day === "string" ? body.day : "";
    const done = body.done !== false; // по умолчанию отмечаем выполненной
    if (!id || !day) {
      return NextResponse.json({ error: "id and day required" }, { status: 400 });
    }
    let found = false;
    state.todos = (state.todos ?? []).map((t) => {
      if (t.id !== id) return t;
      found = true;
      if (t.repeat) {
        const has = t.doneDays.includes(day);
        if (done === has) return t;
        return {
          ...t,
          doneDays: done ? [...t.doneDays, day] : t.doneDays.filter((d) => d !== day),
        };
      }
      return { ...t, done, completedAt: done ? Date.now() : null };
    });
    if (!found) {
      return NextResponse.json({ error: "todo not found" }, { status: 404 });
    }
    await saveState(userId, state);
    return NextResponse.json({ ok: true });
  }

  if (action === "set_mood") {
    const date = typeof body.date === "string" ? body.date : "";
    const energy = body.energy;
    const minutes = typeof body.minutes === "number" ? body.minutes : 30;
    if (!date || (energy !== "low" && energy !== "medium" && energy !== "high")) {
      return NextResponse.json({ error: "date and valid energy required" }, { status: 400 });
    }
    state.moods = { ...(state.moods ?? {}), [date]: { energy, minutes } };
    await saveState(userId, state);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
