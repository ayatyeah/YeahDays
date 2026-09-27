import { describe, expect, it } from "vitest";
import { parseAiResult, prepareAiTodos, sameAiTodo, validDate, type AiResult } from "./aiPlanner";
const result: AiResult = { message: "Пара", warnings: [], items: [{ title: "Networks", date: null, weekday: 1, start: "09:15", end: "10:05", note: "C1.204" }] };
describe("AI schedule import", () => {
  it("anchors weekdays in the chosen week and preserves exact times and rooms", () => {
    expect(prepareAiTodos(result, "schedule", "2026-09-30", true).todos[0]).toMatchObject({ date: "2026-09-28", hour: 9, minute: 15, duration: 50, note: "C1.204", repeat: { kind: "weekly", weekday: 1 } });
  });
  it("never repeats explicitly dated lessons", () => {
    const dated = { ...result, items: [{ ...result.items[0], date: "2026-10-01" }] };
    expect(prepareAiTodos(dated, "schedule", "2026-09-30", true).todos[0].repeat).toBeUndefined();
  });
  it("does not invent dates, class times or overnight duration", () => {
    for (const patch of [{ weekday: null }, { start: null }, { end: "08:00" }]) {
      const prepared = prepareAiTodos({ ...result, items: [{ ...result.items[0], ...patch }] }, "schedule", "2026-09-30", true);
      expect(prepared.todos).toEqual([]); expect(prepared.warnings).toHaveLength(1);
    }
  });
  it("allows untimed tasks and never applies advice as tasks", () => {
    const tasks = { ...result, items: [{ ...result.items[0], date: "2026-10-01", start: null, end: null }] };
    expect(prepareAiTodos(tasks, "tasks", "2026-09-30", false).todos[0].hour).toBeUndefined();
    expect(prepareAiTodos(result, "advice", "2026-09-30", true).todos).toEqual([]);
  });
  it("deduplicates weekly imports across different anchor weeks", () => {
    const a = prepareAiTodos(result, "schedule", "2026-09-30", true).todos[0];
    const b = prepareAiTodos(result, "schedule", "2026-10-07", true).todos[0];
    expect(sameAiTodo(a, b)).toBe(true);
    expect(sameAiTodo(a, { ...b, hour: 11 })).toBe(false);
  });
  it("rejects invalid model output and impossible dates", () => {
    expect(validDate("2026-02-30")).toBe(false);
    expect(() => parseAiResult({ ...result, items: [{ ...result.items[0], start: "25:99" }] })).toThrow();
    expect(() => parseAiResult({ ...result, items: [{ ...result.items[0], weekday: 7 }] })).toThrow();
    expect(() => parseAiResult({ ...result, items: Array(101).fill(result.items[0]) })).toThrow();
  });
});
