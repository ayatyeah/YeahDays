import { describe, expect, it } from "vitest";
import { applyGrade, buySkin, emptyLearning, equipSkin, publicLearning, type LearningState } from "./learning";
export function learningFixture(): LearningState {
  return { ...emptyLearning(), skills: [{ id: "alice-skill", goal: "Python", title: "Python", minutes: 20, createdAt: "2026-09-27", quests: Array.from({ length: 6 }, (_, i) => ({ id: `q${i}`, title: `Квест ${i}`, lesson: "Урок", exercise: "2+2?", rubric: "private-answer: 4", boss: i === 5, completed: false, completedAt: null, attempts: 0, feedback: "" })) }] };
}
describe("learning rewards and shop", () => {
  it("awards only once, never for a wrong answer", () => {
    const state = learningFixture();
    expect(applyGrade(state, "alice-skill", "q0", 20, "Попробуй ещё", "now").awarded).toBe(false);
    expect(state.coins).toBe(0);
    expect(applyGrade(state, "alice-skill", "q0", 90, "Верно", "now").awarded).toBe(true);
    expect(state.coins).toBe(20); expect(state.xp).toBe(50);
    applyGrade(state, "alice-skill", "q0", 100, "Верно", "now");
    expect(state.coins).toBe(20); expect(state.skills[0].quests[0].attempts).toBe(2);
  });
  it("rejects jumping to the boss or someone else's skill", () => {
    const state = learningFixture();
    expect(() => applyGrade(state, "alice-skill", "q5", 100, "yes", "now")).toThrow();
    expect(() => applyGrade(state, "bob-skill", "q0", 100, "yes", "now")).toThrow();
    expect(state.coins).toBe(0);
  });
  it("grants the boss bonus and preserves XP when buying", () => {
    const state = learningFixture();
    for (let i = 0; i < 6; i++) applyGrade(state, "alice-skill", `q${i}`, 100, "yes", "now");
    expect(state.coins).toBe(160); expect(state.xp).toBe(400);
    buySkin(state, "scholar"); expect(state.coins).toBe(100); expect(state.xp).toBe(400);
    buySkin(state, "scholar"); expect(state.coins).toBe(100);
    equipSkin(state, "scholar"); expect(state.equipped).toBe("scholar");
    equipSkin(state, "default"); expect(state.equipped).toBe("default");
  });
  it("never allows negative balances or equipping an unowned skin", () => {
    const state = learningFixture();
    expect(() => buySkin(state, "astronaut")).toThrow();
    expect(() => buySkin(state, "made-up")).toThrow();
    expect(() => equipSkin(state, "scholar")).toThrow(); expect(state.coins).toBe(0);
  });
  it("hides grading answers and locked exercise content", () => {
    const view = publicLearning(learningFixture(), 2, true);
    expect(JSON.stringify(view)).not.toContain("private-answer");
    expect(view.skills[0].quests[0].lesson).toBe("Урок");
    expect(view.skills[0].quests[1].lesson).toBe("");
  });
});
