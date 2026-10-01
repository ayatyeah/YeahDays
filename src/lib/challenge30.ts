/** Pure scheduling and progress rules; no model calls when viewing or logging. */
export const LEVELS = { easy: { label: "Лёгкий", minutes: 180 }, medium: { label: "Средний", minutes: 360 }, hard: { label: "Тяжёлый", minutes: 720 } } as const;
export type Level = keyof typeof LEVELS;
export type Window = { start: number; end: number };
export type Brief = { level: Level; goals: string; baseline: string; preferences: string; timezone: string; windows: Window[][] };
/** One session and the pause after it. Every level divides into whole sessions: 4, 8 or 16 a day. */
export const SESSION = 45, BREAK = 10;
/** weight 1–3 is the share of time the person's own priorities give this activity. */
export type Activity = { title: string; kind: "study" | "sport" | "project" | "personal"; weight: number; steps: string[] };
export type Recipe = { title: string; summary: string; activities: Activity[] };
export type Block = { id: string; start: number; minutes: number; title: string; detail: string; kind: Activity["kind"]; activity: number };
export type Plan30 = { id: string; brief: Brief; recipe: Recipe; createdAt: string; startDate: string | null; logs: Record<string, number>; consentAt: string; tokens?: number };
export class ChallengeError extends Error {}
export const clockText = (n: number) => `${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}`;
export function localDay(zone: string, now = new Date()) { return new Intl.DateTimeFormat("en-CA", { timeZone: zone, year: "numeric", month: "2-digit", day: "2-digit" }).format(now); }
export function plusDays(day: string, n: number) { return new Date(Date.parse(day + "T12:00:00Z") + n * 86400000).toISOString().slice(0, 10); }
export function dayIndex(start: string, day: string) { return Math.round((Date.parse(day + "T12:00:00Z") - Date.parse(start + "T12:00:00Z")) / 86400000); }
const clean = (v: unknown, min: number, max: number) => { if (typeof v !== "string" || v.trim().length < min || v.length > max) throw new ChallengeError(`Заполни анкету: от ${min} до ${max} символов`); return v.trim(); };
/** Up to three separate free windows per weekday, Monday first. Sleep stays outside. */
export function parseBrief(v: unknown): Brief {
  if (!v || typeof v !== "object") throw new ChallengeError("Заполни анкету");
  const b = v as Brief;
  if (!Object.hasOwn(LEVELS, b.level)) throw new ChallengeError("Выбери уровень");
  if (typeof b.timezone !== "string" || b.timezone.length > 80) throw new ChallengeError("Укажи часовой пояс");
  try { localDay(b.timezone); } catch { throw new ChallengeError("Неизвестный часовой пояс"); }
  if (!Array.isArray(b.windows) || b.windows.length !== 7) throw new ChallengeError("Укажи свободное время на каждый день недели");
  const windows = b.windows.map((list, day) => {
    if (!Array.isArray(list) || !list.length || list.length > 3) throw new ChallengeError("Нужно 1–3 свободных окна на каждый день");
    const sorted = list.map(w => {
      if (!w || !Number.isInteger(w.start) || !Number.isInteger(w.end) || w.start < 0 || w.end > 1440 || w.end - w.start < 30) throw new ChallengeError("Свободное окно должно быть не короче 30 минут и находиться внутри дня");
      return { start: w.start, end: w.end };
    }).sort((a, c) => a.start - c.start);
    if (sorted.some((w, i) => i > 0 && w.start < sorted[i - 1].end)) throw new ChallengeError("Свободные окна пересекаются");
    if (sorted.at(-1)!.end - sorted[0].start > 16 * 60) throw new ChallengeError("Оставь вне расписания хотя бы 8 часов подряд для сна");
    try { timeSlots(sorted, LEVELS[b.level].minutes); } catch { throw new ChallengeError(`День недели ${day + 1}: не хватает свободного времени с учётом перерывов. Расширь окна или выбери другой уровень.`); }
    return sorted;
  });
  return { level: b.level, timezone: b.timezone, goals: clean(b.goals, 10, 600), baseline: clean(b.baseline, 3, 300), preferences: clean(b.preferences, 0, 300), windows };
}
/** 45 min sessions with 10 min breaks; exact target, no overflow. */
export function timeSlots(windows: Window[], target: number) {
  const result: { start: number; minutes: number }[] = []; let remaining = target, free = 0;
  for (const w of windows) {
    // A separate window cannot bypass the break after a preceding session: it starts later instead.
    for (let pos = Math.max(w.start, free); pos < w.end && remaining > 0;) {
      const minutes = Math.min(SESSION, remaining, w.end - pos);
      if (minutes < Math.min(20, remaining)) break;
      result.push({ start: pos, minutes }); remaining -= minutes; pos += minutes + BREAK; free = pos;
    }
  }
  if (remaining) throw new ChallengeError("Недостаточно времени");
  return result;
}
/** Windows that fit the level with breaks; the form starts from them so a level change never leaves an impossible day. */
export function defaultWindows(level: Level): Window[][] {
  const [start, end] = { easy: [18, 22], medium: [14, 22], hard: [7, 22] }[level];
  return Array.from({ length: 7 }, () => [{ start: start * 60, end: end * 60 }]);
}
export function parseRecipe(v: unknown): Recipe {
  const r = v as Recipe;
  if (!r || !Array.isArray(r.activities) || r.activities.length < 2 || r.activities.length > 5) throw new ChallengeError("ИИ вернул неполный план. Попробуй уточнить цели.");
  const activities = r.activities.map(a => {
    if (!a || !["study", "sport", "project", "personal"].includes(a.kind) || !Array.isArray(a.steps) || a.steps.length !== 4) throw new ChallengeError("Некорректные занятия в плане");
    return { title: clean(a.title, 2, 100), kind: a.kind, weight: [1, 2, 3].includes(a.weight) ? a.weight : 1, steps: a.steps.map(s => clean(s, 3, 240)) };
  });
  if (!activities.some(a => a.kind !== "sport")) throw new ChallengeError("Добавь цель помимо спорта: план не должен состоять из многочасовой тренировки");
  return { title: clean(r.title, 3, 100), summary: clean(r.summary, 3, 500), activities };
}
/** Smooth weighted rotation: a heavier activity recurs more often without filling the day in one lump. */
function rotation(list: Activity[]) {
  const total = list.reduce((n, a) => n + a.weight, 0); const score = list.map(() => 0);
  return Array.from({ length: total }, () => {
    list.forEach((a, i) => { score[i] += a.weight; });
    const best = score.indexOf(Math.max(...score)); score[best] -= total; return list[best];
  });
}
export function blocksFor(plan: Plan30, day: number, previewStart?: string): Block[] {
  if (!Number.isInteger(day) || day < 0 || day >= 30) throw new ChallengeError("День вне челленджа");
  const date = plusDays(plan.startDate ?? previewStart ?? localDay(plan.brief.timezone), day);
  const weekday = (new Date(date + "T12:00:00Z").getUTCDay() + 6) % 7;
  const phase = Math.min(3, Math.floor(day / 7));
  const order = rotation(plan.recipe.activities); const calm = rotation(plan.recipe.activities.filter(a => a.kind !== "sport"));
  const cap = plan.brief.level === "easy" ? 1 : 2; let sport = 0, moving = false;
  // The day shifts the rotation, so a short day still reaches every activity over the week.
  return timeSlots(plan.brief.windows[weekday], LEVELS[plan.brief.level].minutes).map((slot, i) => {
    let a = order[(i + day) % order.length];
    // Moderate movement only: one or two sport sessions a day, never back to back, even if sport is the top priority.
    if (a.kind === "sport" && (sport >= cap || moving)) a = calm[(i + day) % calm.length];
    moving = a.kind === "sport"; if (moving) sport++;
    return { ...slot, id: `${day}:${i}`, title: a.title, detail: a.steps[phase], kind: a.kind, activity: plan.recipe.activities.indexOf(a) };
  });
}
export function loggedMinutes(p: Plan30, day: number) { return blocksFor(p, day).reduce((n, b) => n + (p.logs[b.id] ?? 0), 0); }
export function successes(p: Plan30) { return Array.from({ length: 30 }, (_, i) => loggedMinutes(p, i)).filter(n => n >= LEVELS[p.brief.level].minutes).length; }
export function logBlock(p: Plan30, day: number, blockId: string, minutes: number, now = new Date()) {
  if (!p.startDate) throw new ChallengeError("Сначала начни челлендж");
  const elapsed = dayIndex(p.startDate, localDay(p.brief.timezone, now));
  if (day > elapsed || day < elapsed - 1 || elapsed >= 31) throw new ChallengeError("Отметить время можно только за сегодня или вчера");
  const b = blocksFor(p, day).find(b => b.id === blockId);
  if (!b || !Number.isInteger(minutes) || minutes < 0 || minutes > b.minutes) throw new ChallengeError("Укажи фактические минуты в пределах занятия");
  p.logs[b.id] = minutes; // assignment, not increment: retries never double-count
}
/** Personal analytics from the plan and self-reported minutes; viewing it never calls the model. */
export function stats(p: Plan30, previewStart?: string) {
  const target = LEVELS[p.brief.level].minutes; const activities = p.recipe.activities.map(a => ({ title: a.title, kind: a.kind, planned: 0, done: 0 }));
  const days = Array.from({ length: 30 }, (_, day) => blocksFor(p, day, previewStart).reduce((sum, b) => {
    const a = activities[b.activity]; const done = p.logs[b.id] ?? 0;
    a.planned += b.minutes; a.done += done; return sum + done;
  }, 0));
  let streak = 0, run = 0;
  for (const minutes of days) { run = minutes >= target ? run + 1 : 0; streak = Math.max(streak, run); }
  return { target, days, activities, streak, total: days.reduce((a, b) => a + b, 0), successes: days.filter(n => n >= target).length };
}
