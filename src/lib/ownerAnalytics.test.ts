import { describe, expect, it } from "vitest";
import { blocksFor, defaultWindows, type Plan30 } from "./challenge30";
import { challengeSummary, dailyCounts } from "./ownerAnalytics";

const steps = ["Шаг 1", "Шаг 2", "Шаг 3", "Шаг 4"];
function plan(extra: Partial<Plan30> = {}): Plan30 {
  return {
    id: "p",
    brief: { level: "easy", goals: "Python", baseline: "С нуля", preferences: "", timezone: "Asia/Almaty", windows: defaultWindows("easy") },
    recipe: { title: "Месяц", summary: "Кратко", activities: [{ title: "Python", kind: "study", weight: 2, steps }, { title: "Чтение", kind: "personal", weight: 1, steps }] },
    createdAt: "2026-10-01T00:00:00Z", consentAt: "2026-10-01T00:00:00Z", startDate: null, logs: {}, tokens: 900,
    ...extra,
  };
}
const now = new Date("2026-10-10T06:00:00Z"); // 10 октября, 11:00 в Алматы

describe("dailyCounts", () => {
  it("раскладывает даты по дням владельца, а не по UTC", () => {
    // 20:30 UTC 9 октября — в Алматы уже 10-е.
    const counts = dailyCounts([new Date("2026-10-09T20:30:00Z"), new Date("2026-10-08T06:00:00Z"), new Date("2026-08-01T00:00:00Z")], 3, now);
    expect(counts).toEqual([{ day: "2026-10-08", count: 1 }, { day: "2026-10-09", count: 0 }, { day: "2026-10-10", count: 1 }]);
  });
});

describe("challengeSummary", () => {
  it("делит планы на черновики, идущие и завершённые и суммирует расход ИИ", () => {
    const running = plan({ startDate: "2026-10-09" });
    for (const b of blocksFor(running, 0)) running.logs[b.id] = b.minutes;
    const summary = challengeSummary([
      { data: plan(), aiDay: "2026-10-10", aiCount: 2 },
      { data: running, aiDay: "2026-10-09", aiCount: 1 },
      { data: plan({ startDate: "2026-09-01", brief: { ...plan().brief, level: "medium", windows: defaultWindows("medium") } }), aiDay: "", aiCount: 0 },
      { data: null, aiDay: "2026-10-10", aiCount: 1 },
    ], now);
    expect(summary).toEqual({ drafts: 1, running: 1, finished: 1, levels: { easy: 2, medium: 1, hard: 0 }, successDays: 1, hours: 3, tokens: 2700, generationsToday: 3 });
  });
  it("не падает на строке в незнакомом формате", () => {
    expect(challengeSummary([{ data: { brief: null }, aiDay: "", aiCount: 0 }, { data: plan(), aiDay: "", aiCount: 0 }], now).drafts).toBe(1);
  });
});
