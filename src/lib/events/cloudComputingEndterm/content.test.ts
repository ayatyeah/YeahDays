import { describe, expect, it } from "vitest";
import questions from "./questions.json";
import lessons from "./lessons.json";
import { correctAnswer, parseProgress } from "./progress";
import { cloudEndtermSummary } from "./meta";

describe("Cloud endterm source bank", () => {
  it("deduplicates the photographed sheets without dropping the two different number 14 questions", () => {
    expect(questions).toHaveLength(47);
    expect(new Set(questions.map(q => q.prompt.toLowerCase())).size).toBe(47);
    expect(questions.filter(q => q.number.startsWith("14"))).toHaveLength(2);
    expect(questions.some(q => q.number === "46")).toBe(false);
    expect(questions.find(q => q.number === "44")?.options[3]).toBe("It inherits your credentials from the AWS Management Console.");
  });
  it("preserves multiple-choice answers and excludes ambiguous items from grading", () => {
    expect(questions.filter(q => q.answers.length === 0).map(q => q.number)).toEqual(["18", "22", "47"]);
    expect(questions.find(q => q.number === "2")?.answers).toEqual([0, 2]);
    expect(questions.find(q => q.number === "25")?.answers).toEqual([1, 2, 3]);
    expect(questions.find(q => q.number === "33")?.answers).toEqual([2, 3]);
    for (const q of questions) {
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.explanation.length).toBeGreaterThan(90);
      for (const a of q.answers) expect(q.options[a]).toBeTruthy();
      if (!q.answers.length) expect(q.caution).toBeTruthy();
    }
  });
  it("requires the whole answer set, never marks ungradable questions correct", () => {
    expect(correctAnswer([2, 0], [0, 2])).toBe(true);
    expect(correctAnswer([0], [0, 2])).toBe(false);
    expect(correctAnswer([0, 1, 2], [0, 2])).toBe(false);
    expect(correctAnswer([], [])).toBe(false);
  });
  it("recovers valid progress and rejects corrupted/outdated persisted entries", () => {
    expect(parseProgress("broken").read).toEqual([]);
    const result = parseProgress(JSON.stringify({ read: ["iam", "missing", "iam"], current: "missing", answers: { "cce-2": [0, 2], "cce-3": [99], "cce-4": [0, 0], "cce-5": "x" } }));
    expect(result.read).toEqual(["iam"]);
    expect(result.answers).toEqual({ "cce-2": [0, 2] });
    expect(result.current).toBe(lessons[0].id);
  });
  it("covers every supplied lecture and separates supplementary Developing topics", () => {
    expect(lessons).toHaveLength(cloudEndtermSummary.parts);
    expect(new Set(lessons.map(l => l.group))).toEqual(new Set(["Лекция 5", "Лекция 6", "Лекция 8", "Лекция 10", "AWS Developing"]));
    expect(new Set(lessons.map(l => l.id)).size).toBe(lessons.length);
    for (const l of lessons) {
      expect(l.body.join(" ").length).toBeGreaterThan(350);
      expect(l.source).toBeTruthy();
      expect(l.check).toBeTruthy();
      expect(l.answer).toBeTruthy();
    }
  });
});
