import { config } from "./config.js";

/**
 * Эндпоинты YeahGrind, рассчитанные на БРАУЗЕР (сессия/device-id), а не на
 * ДиДи (ASSISTANT_SECRET) — /api/assistant/panel и /api/assistant/chat.
 * Electron-окно вызывает их напрямую из main-процесса (не из renderer —
 * иначе CORS), тем же способом, каким раньше их дёргала страница /didi в
 * браузере: без сессии эти роуты просто берут userId из тела/квери как
 * device-id. Не путать с yeahgrind.ts — там ASSISTANT_SECRET-эндпоинты.
 */

async function call(path: string, init?: RequestInit) {
  const res = await fetch(`${config.yeahgrindBaseUrl}${path}`, {
    ...init,
    headers: { "content-type": "application/json", ...(init?.headers ?? {}) },
  });
  if (!res.ok) throw new Error(`YeahGrind API ${path} → ${res.status}`);
  return res.json();
}

export interface PanelEvent {
  id: string;
  kind: string;
  text: string;
  at: number;
}

export interface PanelStatus {
  enabled: boolean;
  online: boolean;
  lastSeenAt: number | null;
  events: PanelEvent[];
}

export function getPanel(): Promise<PanelStatus> {
  const params = new URLSearchParams({ userId: config.yeahgrindUserId });
  return call(`/api/assistant/panel?${params}`) as Promise<PanelStatus>;
}

export async function setEnabled(enabled: boolean): Promise<void> {
  await call("/api/assistant/panel", {
    method: "POST",
    body: JSON.stringify({ userId: config.yeahgrindUserId, enabled }),
  });
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  at: number;
}

export async function getChatHistory(): Promise<ChatMessage[]> {
  const params = new URLSearchParams({ userId: config.yeahgrindUserId });
  const res = (await call(`/api/assistant/chat?${params}`)) as { messages: ChatMessage[] };
  return res.messages;
}

export async function sendChatMessage(content: string): Promise<void> {
  await call("/api/assistant/chat", {
    method: "POST",
    body: JSON.stringify({ userId: config.yeahgrindUserId, content }),
  });
}
