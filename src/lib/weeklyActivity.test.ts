import { it, expect } from "vitest";
import { weeklyActivity } from "./weeklyActivity";

it("counts recurring completions once, excludes undone and future entries", () => {
  const now = new Date(2026, 9, 10, 12);
  const tasks = [
    { completed: true, date: "2026-10-09", completedAt: null },
    { completed: false, date: "2026-10-10", completedAt: null },
  ];
  const todos: Parameters<typeof weeklyActivity>[1] = [
    {
      repeat: { kind: "daily" },
      date: "2026-10-05",
      completedAt: null,
      doneDays: ["2026-10-08", "2026-10-08", "2026-10-11"],
      done: false,
    },
    { done: true, doneDays: [], date: "2026-10-10", completedAt: null },
    { done: false, doneDays: [], date: "2026-10-10", completedAt: null },
  ];
  expect(weeklyActivity(tasks, todos, now).map((d) => d.count)).toEqual([
    0, 0, 0, 1, 1, 1, 0,
  ]);
});
