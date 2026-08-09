import { config } from "./config.js";

/** Локальная дата ноутбука в формате YYYY-MM-DD — сервер (Railway, UTC) её не знает. */
export function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

async function call(path: string, init?: RequestInit) {
  const res = await fetch(`${config.yeahgrindBaseUrl}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${config.assistantSecret}`,
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`YeahGrind API ${path} → ${res.status}: ${text}`);
  }
  return res.json();
}

export interface DayStatus {
  date: string;
  mood: { energy: "low" | "medium" | "high"; minutes: number } | null;
  todos: { id: string; title: string; hour: number | null; priority: string; done: boolean }[];
  plan: { id: string; title: string; completed: boolean }[];
}

export function getTodayStatus(): Promise<DayStatus> {
  const params = new URLSearchParams({
    userId: config.yeahgrindUserId,
    date: todayKey(),
  });
  return call(`/api/assistant?${params}`) as Promise<DayStatus>;
}

export function addTodo(params: {
  title: string;
  hour?: number;
  duration?: number;
  priority?: "low" | "normal" | "high";
  date?: string;
}) {
  return call("/api/assistant", {
    method: "POST",
    body: JSON.stringify({
      action: "add_todo",
      userId: config.yeahgrindUserId,
      date: params.date ?? todayKey(),
      ...params,
    }),
  });
}

export function completeTodo(id: string, done = true, day?: string) {
  return call("/api/assistant", {
    method: "POST",
    body: JSON.stringify({
      action: "complete_todo",
      userId: config.yeahgrindUserId,
      id,
      day: day ?? todayKey(),
      done,
    }),
  });
}

export function setMood(energy: "low" | "medium" | "high", minutes = 30) {
  return call("/api/assistant", {
    method: "POST",
    body: JSON.stringify({
      action: "set_mood",
      userId: config.yeahgrindUserId,
      date: todayKey(),
      energy,
      minutes,
    }),
  });
}
