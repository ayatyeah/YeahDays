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

/** "Я жива" + заодно узнаём, не поставили ли ДиДи на паузу из панели в браузере. */
export function heartbeat(): Promise<{ enabled: boolean }> {
  return call("/api/assistant/heartbeat", {
    method: "POST",
    body: JSON.stringify({ userId: config.yeahgrindUserId }),
  }) as Promise<{ enabled: boolean }>;
}

export type EventKind = "heard" | "reply" | "tool" | "error";

/** Для ленты в панели профиля. Best-effort — сеть подвела, разговор всё равно продолжается. */
export async function logEvent(kind: EventKind, text: string): Promise<void> {
  try {
    await call("/api/assistant/event", {
      method: "POST",
      body: JSON.stringify({ userId: config.yeahgrindUserId, kind, text: text.slice(0, 2000) }),
    });
  } catch (e) {
    console.warn("[yeahgrind] logEvent не прошёл:", e instanceof Error ? e.message : e);
  }
}

/**
 * Голосовые обмены — тоже в ленту чата на /didi (role="user" для того, что
 * услышала, role="assistant" для ответа), не только в технический лог
 * событий. Без этого голос и текст на странице выглядели бы как два
 * разных места, хотя по смыслу это одна переписка. Best-effort, как и
 * logEvent — сеть подвела, разговор всё равно продолжается.
 */
export async function logChatMessage(role: "user" | "assistant", content: string): Promise<void> {
  try {
    await call("/api/assistant/chat/reply", {
      method: "POST",
      body: JSON.stringify({ userId: config.yeahgrindUserId, role, content: content.slice(0, 4000) }),
    });
  } catch (e) {
    console.warn("[yeahgrind] logChatMessage не прошёл:", e instanceof Error ? e.message : e);
  }
}

/** "Джарвис, запомни ..." — пишется напрямую, без GPT (quickCommands.ts). */
export async function rememberFact(content: string): Promise<void> {
  await call("/api/assistant/memory", {
    method: "POST",
    body: JSON.stringify({ userId: config.yeahgrindUserId, content: content.slice(0, 2000) }),
  });
}

/** Всё, что ДиДи попросили запомнить, старое первым — для подмешивания в начало разговора. */
export async function getFacts(): Promise<string[]> {
  const params = new URLSearchParams({ userId: config.yeahgrindUserId });
  const res = (await call(`/api/assistant/memory?${params}`)) as { facts: { content: string }[] };
  return res.facts.map((f) => f.content);
}
