import { describe, expect, it } from "vitest";
import { event } from "./event";
import { draw, readiness, steps } from "../engine";

// MCQ Test 2 — «based on the materials of lectures 4-8»: всё, что готовит к
// тесту, берёт только эти пять лекций; 9–10 лежат отдельно, только чтение.
describe("PM: подготовка к MCQ Test 2 — лекции 4–8", () => {
  it("в маршруте лекции 4–8, а 9–10 — в блоке вне теста", () => {
    expect(event.lectures.map((l) => l.id)).toEqual(["pm-l4", "pm-l5", "pm-l6", "pm-l7", "pm-l8"]);
    expect(event.extra?.lectures.map((l) => l.id)).toEqual(["pm-l9", "pm-l10"]);
    expect(steps(event).some((s) => /pm-l(9|10)/.test(s.id))).toBe(false);
  });

  it("итоговый квиз и пробный тест — 50 вопросов, ровно по 10 на лекцию", () => {
    const final = steps(event).at(-1)!;
    const quiz = draw(event, { ...final, count: event.exam!.questions });
    expect(quiz).toHaveLength(50);
    const perLecture = [0, 1, 2, 3, 4].map((li) => quiz.filter((q) => q.lecture === li).length);
    expect(perLecture).toEqual([10, 10, 10, 10, 10]);
    const outside = new Set(event.extra!.lectures.flatMap((l) => l.parts.flatMap((p) => p.questions.map((q) => q.id))));
    expect(quiz.some((q) => outside.has(q.id))).toBe(false);
  });

  it("лента, фаст-мод, шпаргалка и термины — без лекций 9–10", () => {
    expect(event.videos!.every((v) => /^pm-l[4-8]-/.test(v.partId))).toBe(true);
    expect(event.fast!.sections.some((s) => /Lecture (9|10)/.test(s.title.en))).toBe(false);
    expect(event.cheatSheet!.en).not.toMatch(/## L(9|10)/);
    expect(event.cheatSheet!.en).toContain("Lectures 4–8 — about 10 questions per lecture");
    expect(event.glossary!.some((t) => /ROI|Stakeholder stewardship/.test(t.term))).toBe(false);
  });

  it("готовность считается по шагам пяти лекций", () => {
    expect(readiness(event, {}).total).toBe(steps(event).length);
  });
});
