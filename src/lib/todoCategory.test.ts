import { describe, it, expect } from "vitest";
import { categorizeTodo, recentTodoStatXp, TODO_PRIORITY_XP } from "./todoCategory";
import type { Todo } from "@/store/useUserStore";

const base: Todo = {
  id: "t1",
  title: "Бег",
  date: "2026-07-20",
  priority: "normal",
  subtasks: [],
  done: false,
  doneDays: [],
  createdAt: 0,
  completedAt: null,
};

const NOW = new Date("2026-07-20T12:00:00").getTime();
const WINDOW = 21 * 24 * 3600_000;
const SINCE = NOW - WINDOW;

describe("categorizeTodo", () => {
  it("узнаёт спорт по ключевому слову", () => {
    expect(categorizeTodo("Бег").stat).toBe("strength");
  });

  it("нераспознанное падает в stability", () => {
    expect(categorizeTodo("Случайное дело").stat).toBe("stability");
  });
});

describe("recentTodoStatXp", () => {
  it("считает разовую задачу, выполненную в окне", () => {
    const t: Todo = { ...base, done: true, completedAt: SINCE + 1000 };
    const out = recentTodoStatXp([t], SINCE);
    expect(out.strength).toBe(TODO_PRIORITY_XP.normal);
  });

  it("не считает разовую задачу, выполненную до окна", () => {
    const t: Todo = { ...base, done: true, completedAt: SINCE - 1000 };
    const out = recentTodoStatXp([t], SINCE);
    expect(out.strength ?? 0).toBe(0);
  });

  it("не считает невыполненную задачу", () => {
    const t: Todo = { ...base, done: false, completedAt: null };
    const out = recentTodoStatXp([t], SINCE);
    expect(out.strength ?? 0).toBe(0);
  });

  it("для повторяющейся — каждый день из doneDays внутри окна", () => {
    const insideDay = new Date(SINCE + 2 * 24 * 3600_000)
      .toISOString()
      .slice(0, 10);
    const outsideDay = new Date(SINCE - 2 * 24 * 3600_000)
      .toISOString()
      .slice(0, 10);
    const t: Todo = {
      ...base,
      repeat: { kind: "daily" },
      doneDays: [insideDay, outsideDay],
    };
    const out = recentTodoStatXp([t], SINCE);
    expect(out.strength).toBe(TODO_PRIORITY_XP.normal);
  });

  it("суммирует по нескольким задачам того же стата", () => {
    const t1: Todo = { ...base, id: "a", done: true, completedAt: SINCE + 1000 };
    const t2: Todo = { ...base, id: "b", done: true, completedAt: SINCE + 2000 };
    const out = recentTodoStatXp([t1, t2], SINCE);
    expect(out.strength).toBe(TODO_PRIORITY_XP.normal * 2);
  });

  it("приоритет влияет на вес XP", () => {
    const t: Todo = { ...base, priority: "high", done: true, completedAt: SINCE + 1000 };
    const out = recentTodoStatXp([t], SINCE);
    expect(out.strength).toBe(TODO_PRIORITY_XP.high);
  });
});
