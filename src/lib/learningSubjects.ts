import { courseName } from "./lmsCalendar";
import type { IcalEvent } from "./ical";
import { LearningError } from "./learning";

export type LearningSubject = { name: string; materials: string };

/** Calendar categories contain course names, never a complete enrolment list. */
export function subjectsFromEvents(events: IcalEvent[]): string[] {
  const names = new Map<string, string>();
  for (const event of events) {
    const name = courseName(event.categories).replace(/\s+/g, " ").trim();
    if (name.length < 2 || name.length > 180) continue;
    const key = name.toLocaleLowerCase();
    if (!names.has(key)) names.set(key, name);
  }
  return [...names.values()].sort((a, b) => a.localeCompare(b)).slice(0, 100);
}

export function parseLearningSubject(value: unknown): LearningSubject | undefined {
  if (value === undefined) return undefined;
  if (!value || typeof value !== "object") throw new LearningError("Укажи предмет");
  const { name, materials } = value as Record<string, unknown>;
  if (typeof name !== "string" || name.trim().length < 2 || name.length > 180 || typeof materials !== "string" || materials.length > 4000) {
    throw new LearningError("Название предмета: 2–180 символов, материалы: до 4000 символов");
  }
  return { name: name.trim(), materials: materials.trim() };
}
