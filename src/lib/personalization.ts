export const POLICY_VERSION = "2026-10-04";
export const SECTIONS = ["today", "calendar", "account", "progress", "learn", "shop", "settings", "community", "chat", "personalization", "other"] as const;
export type ActivityDay = { seconds: number; visits: number; tasks: number; actions: number; quests: number; sections: Record<string, number> };
export type Personalization = {
  revision: number; version: string; acceptedAt: string | null; enabled: boolean; since: string | null;
  /** One consent for every AI feature: the person allows sending what a feature needs to OpenAI. Absent in older rows — treated as false. */
  ai?: boolean;
  receipts: { version: string; at: string; enabled: boolean; ai?: boolean }[];
  timezone: string; days: Record<string, ActivityDay>; seen: string[]; lastTick: number;
};
export const emptyPersonalization = (): Personalization => ({ revision: 0, version: "", acceptedAt: null, enabled: false, since: null, ai: false, receipts: [], timezone: "Asia/Almaty", days: {}, seen: [], lastTick: 0 });
export function dayInZone(now: number, timezone: string) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}
export function validTimezone(value: unknown): string {
  if (typeof value !== "string" || value.length > 80) throw new Error("timezone");
  new Intl.DateTimeFormat("en", { timeZone: value }).format(); return value;
}
export type Completion = { key: string; kind: "tasks" | "actions" | "quests" };
/** Only completion flags/identifiers are inspected, never task text or notes. */
export function completions(state: any, learning: any): Completion[] {
  const result: Completion[] = [];
  for (const t of Array.isArray(state?.todos) ? state.todos : []) {
    if (typeof t.id !== "string") continue;
    if (t.repeat) {
      for (const day of Array.isArray(t.doneDays) ? t.doneDays : []) if (typeof day === "string") result.push({ key: `todo:${t.id}:${day}`, kind: "tasks" });
    } else if (t.done) result.push({ key: `todo:${t.id}`, kind: "tasks" });
  }
  for (const t of Array.isArray(state?.plan) ? state.plan : []) if (t.completed && typeof t.id === "string" && !String(t.actionId).startsWith("todo:")) result.push({ key: `action:${t.id}`, kind: "actions" });
  for (const s of Array.isArray(learning?.skills) ? learning.skills : []) for (const q of Array.isArray(s.quests) ? s.quests : []) if (q.completed && typeof q.id === "string") result.push({ key: `quest:${s.id}:${q.id}`, kind: "quests" });
  return result;
}
export function recordActivity(profile: Personalization, now: number, section: string, finished: Completion[], heartbeat: boolean) {
  if (!profile.enabled || profile.version !== POLICY_VERSION) return;
  const day = dayInZone(now, profile.timezone);
  const item = profile.days[day] ??= { seconds: 0, visits: 0, tasks: 0, actions: 0, quests: 0, sections: {} };
  // One 15-second slot per account, even with multiple tabs or retries.
  if (heartbeat && Math.floor(now / 15000) > Math.floor(profile.lastTick / 15000)) {
    if (!profile.lastTick || now - profile.lastTick > 30 * 60_000) item.visits++;
    item.seconds += 15;
    const key = (SECTIONS as readonly string[]).includes(section) ? section : "other";
    item.sections[key] = (item.sections[key] ?? 0) + 15;
    profile.lastTick = now;
  }
  const seen = new Set(profile.seen);
  for (const entry of finished) if (!seen.has(entry.key)) { seen.add(entry.key); item[entry.kind]++; }
  profile.seen = [...seen];
}
export function publicPersonalization(profile: Personalization) {
  const days = Object.entries(profile.days).sort(([a], [b]) => b.localeCompare(a));
  const totals = days.reduce((a, [, d]) => ({ seconds: a.seconds + d.seconds, tasks: a.tasks + d.tasks, actions: a.actions + d.actions, quests: a.quests + d.quests, visits: a.visits + d.visits }), { seconds: 0, tasks: 0, actions: 0, quests: 0, visits: 0 });
  const completed = totals.tasks + totals.actions + totals.quests;
  const today = profile.days[dayInZone(Date.now(), profile.timezone)];
  const recent = days.slice(0, 7);
  const average = recent.length ? recent.reduce((sum, [, d]) => sum + d.tasks + d.actions + d.quests, 0) / recent.length : 0;
  const dailyTarget = average >= 5 ? 5 : 3;
  return { revision: profile.revision, requiredVersion: POLICY_VERSION, version: profile.version, acceptedAt: profile.acceptedAt, enabled: profile.enabled, ai: profile.version === POLICY_VERSION && profile.ai === true, since: profile.since, timezone: profile.timezone,
    totals, activeDays: days.filter(([, d]) => d.seconds > 0).length, days: days.slice(0, 30).map(([day, data]) => ({ day, ...data })),
    dailyTarget, todayCompleted: today ? today.tasks + today.actions + today.quests : 0,
    badges: [{ name: "Первый шаг", target: 1 }, { name: "Набираю темп", target: 10 }, { name: "Держу ритм", target: 50 }, { name: "Сотня дел", target: 100 }].map(b => ({ ...b, value: Math.min(completed, b.target), unlocked: completed >= b.target })) };
}
