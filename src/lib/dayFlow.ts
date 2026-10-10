import {
  isTodoOnDay,
  isTodoDone,
  isTodoOverdue,
  type Todo,
} from "@/store/useUserStore";
import { isLmsDeadline } from "@/lib/lmsEventKind";
import { todoStartMin, todoEndMin } from "@/lib/todoSpan";
import { dateKey, type EnergyLevel } from "@/lib/domain";
export type StudyChoice = {
  id: string;
  title: string;
  detail: string;
  href: string;
  minutes: number;
  visited: number;
};
export function dayContext(
  todos: Todo[],
  now: Date,
  requested: number,
  energy: EnergyLevel,
) {
  const day = dateKey(now),
    minute = now.getHours() * 60 + now.getMinutes();
  const pending = todos.filter(
    (t) =>
      (isTodoOnDay(t, day) || isTodoOverdue(t, day)) && !isTodoDone(t, day),
  );
  const scheduled = pending
    .filter(
      (t) => isTodoOnDay(t, day) && !isLmsDeadline(t) && t.hour !== undefined,
    )
    .sort((a, b) => todoStartMin(a)! - todoStartMin(b)!);
  const current = scheduled.find(
    (t) => todoStartMin(t)! <= minute && todoEndMin(t)! > minute,
  );
  const next = scheduled.find((t) => todoStartMin(t)! > minute);
  const gap = current
    ? 0
    : next
      ? Math.max(0, todoStartMin(next)! - minute - 5)
      : requested;
  const budget = Math.min(requested, energy === "low" ? 10 : requested, gap);
  const candidates = pending
    .filter(
      (t) =>
        t.hour === undefined ||
        isLmsDeadline(t) ||
        t.date < day ||
        (todoEndMin(t) ?? Infinity) <= minute,
    )
    .sort(
      (a, b) =>
        Number(isTodoOverdue(b, day)) - Number(isTodoOverdue(a, day)) ||
        Number(b.priority === "high") - Number(a.priority === "high") ||
        (a.duration ?? 999) - (b.duration ?? 999) ||
        a.createdAt - b.createdAt,
    );
  const deadline = todos
    .filter((t) => isLmsDeadline(t) && !isTodoDone(t, day) && t.date >= day)
    .sort(
      (a, b) => a.date.localeCompare(b.date) || (a.hour ?? 23) - (b.hour ?? 23),
    )[0];
  return {
    day,
    current,
    next,
    budget,
    task:
      candidates.find((t) => !t.duration || t.duration <= budget) ??
      candidates[0],
    deadline,
  };
}
export function chooseStudy(
  studies: StudyChoice[],
  budget: number,
  deadline?: string,
) {
  return studies
    .filter((s) => s.minutes <= budget)
    .sort((a, b) => {
      const match = (s: StudyChoice) => {
        const words = s.detail.toLowerCase().match(/[a-zа-яё]{4,}/g) ?? [];
        return words.filter((w) => deadline?.toLowerCase().includes(w))
          .length >= 2
          ? 1
          : 0;
      };
      return match(b) - match(a) || b.visited - a.visited;
    })[0];
}
export const lessonDraftKey = (owner: string, skill: string, quest: string) =>
  `yg-lesson-draft:${owner}:${skill}:${quest}`;
export const lessonVisitKey = (owner: string) => `yg-lesson-visits:${owner}`;

export function readVisitTimes(raw: string | null): Record<string, number> {
  try {
    const parsed: unknown = JSON.parse(raw ?? "{}");
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
      return {};
    return Object.fromEntries(
      Object.entries(parsed).filter(
        ([, value]) =>
          typeof value === "number" && Number.isFinite(value) && value > 0,
      ),
    );
  } catch {
    return {};
  }
}

/** Only app-owned study links; legacy event plans already carry a stable marker. */
export function taskLearningHref(note?: string): string | undefined {
  if (!note) return;
  const event = /\[event:([a-z0-9-]+):/.exec(note);
  if (event) return `/events/${event[1]}`;
  if (!note.startsWith("/learn?")) return;
  try {
    const url = new URL(note, "https://local.invalid");
    if (
      url.pathname === "/learn" &&
      url.searchParams.get("view") === "lesson" &&
      url.searchParams.get("skill") &&
      url.searchParams.get("quest")
    )
      return url.pathname + url.search;
  } catch {}
}
