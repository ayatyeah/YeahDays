import type { Todo } from "@/store/useUserStore";

export type AiMode = "schedule" | "tasks" | "advice";
export type AiItem = { title: string; date: string | null; weekday: number | null; start: string | null; end: string | null; note: string };
export type AiResult = { message: string; warnings: string[]; items: AiItem[] };
export const aiSchema = {
  type: "object", additionalProperties: false, required: ["message", "warnings", "items"],
  properties: {
    message: { type: "string" }, warnings: { type: "array", items: { type: "string" } },
    items: { type: "array", items: {
      type: "object", additionalProperties: false,
      required: ["title", "date", "weekday", "start", "end", "note"],
      properties: { title: { type: "string" }, date: { type: ["string", "null"] }, weekday: { type: ["integer", "null"] }, start: { type: ["string", "null"] }, end: { type: ["string", "null"] }, note: { type: "string" } },
    } },
  },
};
export function validDate(value: unknown): value is string {
  return typeof value === "string" && /^20\d{2}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
}
const validTime = (v: unknown): v is string => typeof v === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(v);
export function parseAiResult(value: unknown): AiResult {
  if (!value || typeof value !== "object") throw new Error("Некорректный ответ ИИ");
  const v = value as AiResult;
  if (typeof v.message !== "string" || v.message.length > 6000 || !Array.isArray(v.warnings) || v.warnings.length > 30 || v.warnings.some(w => typeof w !== "string" || w.length > 1000) || !Array.isArray(v.items) || v.items.length > 100) throw new Error("Некорректный ответ ИИ");
  for (const i of v.items) {
    if (!i || typeof i.title !== "string" || !i.title.trim() || i.title.length > 200 || typeof i.note !== "string" || i.note.length > 1500 || (i.date !== null && !validDate(i.date)) || (i.weekday !== null && (!Number.isInteger(i.weekday) || i.weekday < 0 || i.weekday > 6)) || (i.start !== null && !validTime(i.start)) || (i.end !== null && !validTime(i.end))) throw new Error("ИИ вернул некорректную дату или время. Уточни запрос.");
  }
  return v;
}
const minutes = (time: string) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3));
export type AiTodo = Partial<Todo> & { title: string; date: string };
export function prepareAiTodos(result: AiResult, mode: AiMode, anchor: string, weekly: boolean): { todos: AiTodo[]; warnings: string[] } {
  if (!validDate(anchor)) throw new Error("Выбери корректную дату");
  const todos: AiTodo[] = [];
  const warnings = [...result.warnings];
  if (mode === "advice") return { todos, warnings };
  for (const item of result.items) {
    let date = item.date;
    if (!date && item.weekday !== null) {
      const d = new Date(anchor + "T12:00:00Z");
      d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7) + ((item.weekday + 6) % 7));
      date = d.toISOString().slice(0, 10);
    }
    if (!date || (mode === "schedule" && (!item.start || !item.end)) || (item.end && !item.start) || (item.start && item.end && minutes(item.end) <= minutes(item.start))) {
      warnings.push(`«${item.title}»: не хватает даты или точного времени — не добавлено.`); continue;
    }
    todos.push({ title: item.title.trim(), note: item.note,
      date, hour: item.start ? Math.floor(minutes(item.start) / 60) : undefined,
      minute: item.start ? minutes(item.start) % 60 : undefined,
      duration: item.start && item.end ? minutes(item.end) - minutes(item.start) : undefined,
      repeat: mode === "schedule" && weekly && !item.date && item.weekday !== null ? { kind: "weekly", weekday: item.weekday } : undefined,
      priority: "normal",
    });
  }
  return { todos, warnings };
}
export function sameAiTodo(a: AiTodo, b: AiTodo) {
  const repeat = a.repeat?.kind === "weekly" && b.repeat?.kind === "weekly";
  return a.title.trim().toLowerCase() === b.title.trim().toLowerCase() && a.hour === b.hour && (a.minute ?? 0) === (b.minute ?? 0) && (a.duration ?? 60) === (b.duration ?? 60) && (repeat ? a.repeat?.weekday === b.repeat?.weekday : a.date === b.date && a.repeat?.kind === b.repeat?.kind);
}
