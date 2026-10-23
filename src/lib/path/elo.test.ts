import { describe, expect, it } from "vitest";
import { classified, eloUpdate, k, masteryOf, median, priorUpdate, probability, selectItem, shouldStop, TARGET_P } from "./elo";

describe("Elo model", () => {
  it("predicts 50 % when ability equals difficulty and rises with ability", () => {
    expect(probability(0, 0)).toBeCloseTo(0.5);
    expect(probability(1, 0)).toBeGreaterThan(probability(0, 0));
    expect(probability(0, 1)).toBeLessThan(0.5);
  });

  it("uses K(n) = 0.8 / (1 + 0.05n)", () => {
    expect(k(0)).toBeCloseTo(0.8);
    expect(k(20)).toBeCloseTo(0.4);
    expect(k(5)).toBeGreaterThan(k(6));
  });

  it("moves ability up and difficulty down after a correct answer, and the reverse after a wrong one", () => {
    const right = eloUpdate({ theta: 0, thetaAnswers: 0, difficulty: 0, itemAnswers: 0, score: 1 });
    expect(right.p).toBeCloseTo(0.5);
    expect(right.theta).toBeCloseTo(0.4);
    expect(right.difficulty).toBeCloseTo(-0.4);
    const wrong = eloUpdate({ theta: 0, thetaAnswers: 0, difficulty: 0, itemAnswers: 0, score: 0 });
    expect(wrong.theta).toBeLessThan(0);
    expect(wrong.difficulty).toBeGreaterThan(0);
  });

  it("treats an open-answer score as a graded outcome and clamps it", () => {
    const half = eloUpdate({ theta: 0, thetaAnswers: 3, difficulty: 0, itemAnswers: 3, score: 0.5 });
    expect(half.theta).toBeCloseTo(0);
    const clamped = eloUpdate({ theta: 0, thetaAnswers: 0, difficulty: 0, itemAnswers: 0, score: 7 });
    expect(clamped.theta).toBeCloseTo(0.4);
  });

  it("moves the global prior in the same direction with a smaller step", () => {
    const local = eloUpdate({ theta: 0, thetaAnswers: 0, difficulty: 0, itemAnswers: 0, score: 1 }).theta;
    const prior = priorUpdate(0, 0, 1, 0.5);
    expect(prior).toBeGreaterThan(0);
    expect(prior).toBeLessThan(local);
  });

  it("estimates mastery against the median difficulty of the skill", () => {
    expect(median([3, 1, 2])).toBe(2);
    expect(median([1, 2, 3, 4])).toBe(2.5);
    expect(median([])).toBe(0);
    expect(masteryOf(2, [-1, 2, 5])).toBeCloseTo(0.5);
  });
});

describe("adaptive selection", () => {
  const items = [
    { id: "easy", skillId: "s", difficulty: -2 },
    { id: "mid", skillId: "s", difficulty: -0.85 },
    { id: "hard", skillId: "s", difficulty: 2 },
    { id: "other", skillId: "x", difficulty: 0 },
  ];

  it("picks the item whose predicted success is closest to 0.7 among the targeted skills", () => {
    const item = selectItem(items, { s: 0 }, [], () => 0);
    expect(item?.id).toBe("mid");
    expect(Math.abs(probability(0, item!.difficulty) - TARGET_P)).toBeLessThan(0.01);
  });

  it("never repeats an item within a quiz and returns null when the bank is exhausted", () => {
    expect(selectItem(items, { s: 0 }, ["mid"], () => 0)?.id).not.toBe("mid");
    expect(selectItem(items, { s: 0 }, ["easy", "mid", "hard"])).toBeNull();
  });

  it("breaks near-ties randomly instead of always serving the same item", () => {
    const twins = [
      { id: "a", skillId: "s", difficulty: -0.85 },
      { id: "b", skillId: "s", difficulty: -0.84 },
    ];
    expect(selectItem(twins, { s: 0 }, [], () => 0)?.id).toBe("a");
    expect(selectItem(twins, { s: 0 }, [], () => 0.99)?.id).toBe("b");
  });
});

describe("stopping rule", () => {
  it("stops after 10 items or when the bank is empty", () => {
    expect(shouldStop([{ mastery: 0.5, answers: 10 }], 10, 5)).toBe(true);
    expect(shouldStop([{ mastery: 0.5, answers: 2 }], 2, 0)).toBe(true);
  });

  it("asks at least three questions even if the skill is already classified", () => {
    expect(shouldStop([{ mastery: 0.95, answers: 20 }], 1, 5)).toBe(false);
    expect(shouldStop([{ mastery: 0.95, answers: 20 }], 3, 5)).toBe(true);
  });

  it("continues while any targeted skill is still uncertain", () => {
    expect(classified({ mastery: 0.9, answers: 3 })).toBe(true);
    expect(classified({ mastery: 0.2, answers: 3 })).toBe(true);
    expect(classified({ mastery: 0.6, answers: 9 })).toBe(false);
    expect(classified({ mastery: 0.9, answers: 2 })).toBe(false);
    expect(shouldStop([{ mastery: 0.9, answers: 4 }, { mastery: 0.6, answers: 4 }], 4, 5)).toBe(false);
  });
});
