import { describe, expect, it } from "vitest";
import { routeStates, routeStops, shortTitle } from "./route";
import type { StudyEvent } from "./types";

const event: StudyEvent = {
  id: "e", title: "T", course: "C", description: "d",
  lectures: [
    { id: "l1", title: { en: "Lecture 1 — Organizational Structures", ru: "Лекция 1 — Организационные структуры" }, parts: [] },
    { id: "l2", title: { en: "Lecture 2 — Scrum", ru: "Лекция 2 — Scrum" }, short: { en: "Scrum", ru: "Скрам" }, parts: [] },
    { id: "l3", title: { en: "Practice", ru: "Практика" }, parts: [] },
  ],
  counts: { part: 5, lecture: 5, final: 5 },
};

describe("твой маршрут", () => {
  it("остановки — лекции по порядку и итоговый квиз; подпись — своя или хвост названия", () => {
    const stops = routeStops(event);
    expect(stops.map((s) => s.step)).toEqual(["l1-quiz", "l2-quiz", "l3-quiz", "e-final"]);
    expect(stops.map((s) => s.final)).toEqual([false, false, false, true]);
    expect(stops[0].label).toEqual({ en: "Organizational Structures", ru: "Организационные структуры" });
    expect(stops[1].label.ru).toBe("Скрам");
    expect(shortTitle(event.lectures[2])).toEqual({ en: "Practice", ru: "Практика" });
  });

  it("пройдено — где есть попытка квиза; текущая — первая непройденная, даже если дальше что-то пройдено", () => {
    const stops = routeStops(event);
    const done = { best: 1, last: 1, attempts: 1 };
    expect(routeStates(stops, {})).toEqual(["current", "todo", "todo", "todo"]);
    expect(routeStates(stops, { "l1-quiz": done, "l3-quiz": done })).toEqual(["done", "current", "done", "todo"]);
    expect(routeStates(stops, Object.fromEntries(stops.map((s) => [s.step, done])))).toEqual(["done", "done", "done", "done"]);
  });
});
