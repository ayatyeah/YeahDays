/**
 * Командный трекер задач диплома (/team): чистые функции без базы —
 * ключи YG-n, проверка полей, CSV в формате импорта YouTrack, история
 * изменений. Роуты /api/team/* и интерфейс используют одно и то же.
 */

export const PROJECT_KEY = "YG";
export const STATES = ["Open", "In Progress", "In Review", "Blocked", "Done"] as const;
export const PRIORITIES = ["Critical", "High", "Medium", "Normal", "Low"] as const;
export const TYPES = ["Task", "Feature", "Bug", "Documentation", "Design", "Research", "Review"] as const;

/** Поля, которые можно менять через API, и предел длины каждого. */
export const EDITABLE: Record<string, number> = {
  summary: 200,
  description: 8000,
  epic: 60,
  type: 40,
  priority: 20,
  state: 20,
  assignee: 80,
  reviewer: 80,
  estimate: 20,
  sprint: 20,
  dueDate: 10,
  requirements: 400,
  acceptance: 4000,
  dependsOn: 200,
  links: 2000,
};

export type TaskFields = Partial<Record<keyof typeof EDITABLE, string>>;

export function taskKey(n: number) {
  return `${PROJECT_KEY}-${n}`;
}

/** "YG-29" или "yg-29" → 29; всё остальное — null. */
export function parseKey(key: string): number | null {
  const m = /^yg-(\d{1,6})$/i.exec(key.trim());
  return m ? Number(m[1]) : null;
}

/**
 * Проверяет и нормализует входные поля задачи. Неизвестные поля и не-строки
 * отбрасываются, длина режется по EDITABLE, перечисления сверяются со
 * списками. Возвращает ошибку текстом, если поле есть, но недопустимо.
 */
export function cleanFields(input: unknown): { fields: TaskFields; error?: string } {
  const fields: TaskFields = {};
  if (!input || typeof input !== "object") return { fields, error: "Invalid body" };
  for (const [name, max] of Object.entries(EDITABLE)) {
    const value = (input as Record<string, unknown>)[name];
    if (value === undefined) continue;
    if (typeof value !== "string") return { fields, error: `${name} must be text` };
    fields[name] = value.replace(/\r\n/g, "\n").trim().slice(0, max);
  }
  if (fields.summary !== undefined && !fields.summary) return { fields, error: "Summary is required" };
  if (fields.state !== undefined && !(STATES as readonly string[]).includes(fields.state)) return { fields, error: "Unknown state" };
  if (fields.priority !== undefined && !(PRIORITIES as readonly string[]).includes(fields.priority)) return { fields, error: "Unknown priority" };
  if (fields.dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(fields.dueDate)) return { fields, error: "Due date must be YYYY-MM-DD" };
  return { fields };
}

/** Какие поля реально изменились — для журнала активности. */
export function diffFields(before: Record<string, unknown>, after: TaskFields) {
  return Object.entries(after)
    .filter(([name, value]) => String(before[name] ?? "") !== value)
    .map(([name, value]) => ({ field: name, fromValue: String(before[name] ?? ""), toValue: value ?? "" }));
}

// ---------- CSV (RFC 4180, формат импорта YouTrack) ----------

export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  const src = text.replace(/^﻿/, "");
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (quoted) {
      if (ch === '"' && src[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") { row.push(cell); cell = ""; }
    else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && src[i + 1] === "\n") i++;
      row.push(cell); cell = "";
      if (row.some((c) => c !== "")) rows.push(row);
      row = [];
    } else cell += ch;
  }
  row.push(cell);
  if (row.some((c) => c !== "")) rows.push(row);
  return rows;
}

function csvCell(value: string) {
  return /[",\n\r]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

/** Столбцы экспорта: те же, что в project-management/youtrack-backlog.csv. */
export const CSV_COLUMNS: [string, string][] = [
  ["Issue Id", "key"], ["Summary", "summary"], ["Epic", "epic"], ["Type", "type"], ["Priority", "priority"],
  ["Assignee", "assignee"], ["Reviewer", "reviewer"], ["Estimation", "estimate"], ["Sprint", "sprint"],
  ["Due Date", "dueDate"], ["Requirements", "requirements"], ["Acceptance criteria", "acceptance"],
  ["Depends on", "dependsOn"], ["State", "state"], ["Description", "description"], ["Links", "links"],
];

export function toCsv(tasks: Array<Record<string, unknown> & { number: number }>) {
  const lines = [CSV_COLUMNS.map(([h]) => h).join(",")];
  for (const t of tasks) {
    lines.push(CSV_COLUMNS.map(([, f]) => csvCell(f === "key" ? taskKey(t.number) : String(t[f] ?? ""))).join(","));
  }
  return lines.join("\n") + "\n";
}

/**
 * Строки CSV → задачи для импорта. Номер берётся из «Issue Id» (YG-n);
 * строки без него или без Summary пропускаются с причиной.
 */
export function rowsFromCsv(text: string) {
  const [header, ...rows] = parseCsv(text);
  if (!header) return { tasks: [], skipped: ["Empty file"] };
  const index = new Map(header.map((h, i) => [h.trim().toLowerCase(), i]));
  const tasks: Array<{ number: number; fields: TaskFields }> = [];
  const skipped: string[] = [];
  rows.forEach((row, i) => {
    const get = (name: string) => {
      const at = index.get(name.toLowerCase());
      return at === undefined ? undefined : row[at] ?? "";
    };
    const number = parseKey(get("Issue Id") ?? "");
    if (!number) { skipped.push(`Row ${i + 2}: no YG-n Issue Id`); return; }
    const raw: Record<string, string | undefined> = {};
    for (const [h, f] of CSV_COLUMNS) if (f !== "key") raw[f] = get(h);
    const { fields, error } = cleanFields(Object.fromEntries(Object.entries(raw).filter(([, v]) => v !== undefined)));
    if (error || !fields.summary) { skipped.push(`Row ${i + 2}: ${error ?? "no summary"}`); return; }
    tasks.push({ number, fields });
  });
  return { tasks, skipped };
}
