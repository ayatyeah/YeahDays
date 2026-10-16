import { describe, it, expect } from "vitest";
import { computeProgress, prevDay, streakFrom, todoXp } from "./integrationProgress";
import type { PlannedTask, Todo } from "./externalState";

const todo = (over: Partial<Todo>): Todo => ({
  id: "t",
  title: "Задача",
  date: "2026-10-16",
  priority: "normal",
  subtasks: [],
  done: false,
  doneDays: [],
  createdAt: 0,
  completedAt: null,
  ...over,
});

const task = (over: Partial<PlannedTask>): PlannedTask => ({
  id: "p",
  actionId: "a",
  snapshot: { title: "Отжимания", category: "fitness" },
  xp: 40,
  date: "2026-10-16",
  completed: true,
  acceptedAt: 0,
  completedAt: 0,
  ...over,
});

describe("prevDay", () => {
  it("переходит через границу месяца и года", () => {
    expect(prevDay("2026-11-01")).toBe("2026-10-31");
    expect(prevDay("2027-01-01")).toBe("2026-12-31");
  });
});

describe("streakFrom", () => {
  it("считает подряд идущие дни, включая сегодня", () => {
    expect(streakFrom(new Set(["2026-10-14", "2026-10-15", "2026-10-16"]), "2026-10-16")).toBe(3);
  });
  it("если сегодня ещё ничего нет — считает от вчера", () => {
    expect(streakFrom(new Set(["2026-10-14", "2026-10-15"]), "2026-10-16")).toBe(2);
  });
  it("разрыв обнуляет стрик", () => {
    expect(streakFrom(new Set(["2026-10-13"]), "2026-10-16")).toBe(0);
    expect(streakFrom(new Set(), "2026-10-16")).toBe(0);
  });
});

describe("computeProgress", () => {
  it("складывает XP плана и задач и раскладывает по статам", () => {
    const progress = computeProgress(
      {
        plan: [task({}), task({ id: "p2", completed: false, xp: 99 })],
        todos: [todo({ done: true, priority: "high" })],
      },
      "2026-10-16",
    );
    expect(progress.totalXp).toBe(40 + 22);
    expect(progress.stats.strength).toBe(40);
    expect(progress.streak).toBe(1);
    expect(progress.level).toBeGreaterThanOrEqual(1);
  });

  it("повторяющаяся задача даёт XP за каждый отмеченный день", () => {
    const daily = todo({ repeat: { kind: "daily" }, doneDays: ["2026-10-15", "2026-10-16"], priority: "low" });
    expect(todoXp([daily])).toBe(2 * 8);
    expect(computeProgress({ todos: [daily] }, "2026-10-16").streak).toBe(2);
  });
});
