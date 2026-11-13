import { describe, expect, it } from "vitest";
import { matchesAnswer } from "./quizAnswers";

describe("shared quiz grading", () => {
  it("preserves single-answer grading", () => {
    expect(matchesAnswer([2], [2])).toBe(true);
    expect(matchesAnswer([1], [2])).toBe(false);
  });
  it("requires all correct selections regardless of order", () => {
    expect(matchesAnswer([2, 0], [0, 2])).toBe(true);
    expect(matchesAnswer([0], [0, 2])).toBe(false);
    expect(matchesAnswer([0, 1, 2], [0, 2])).toBe(false);
    expect(matchesAnswer([0, 0], [0, 2])).toBe(false);
  });
  it("does not grade unresolved or unanswered questions as correct", () => {
    expect(matchesAnswer([0], [])).toBe(false);
    expect(matchesAnswer([], [])).toBe(false);
    expect(matchesAnswer(undefined, [0])).toBe(false);
  });
});
