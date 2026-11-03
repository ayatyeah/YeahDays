import { describe, expect, it } from "vitest";
import { availableQuestions } from "./model";
import { advanceSprint, createSprint, emptySprintState, lockSprintAnswer, parseSprintState, sprintKey, sprintGroups, sprintQuestions } from "./sprints";

describe("PM exam sprints", () => {
  it("partitions all questions without duplication and preserves source order", () => {
    expect(sprintGroups.map(g => g.ids.length)).toEqual([50,37,46,50,9,14,40]);
    const ids = sprintGroups.flatMap(g => g.ids);
    expect(new Set(ids).size).toBe(sprintQuestions.length);
    expect(ids.sort()).toEqual(sprintQuestions.map(q => q.id).sort());
    expect(createSprint("1", 3, "ordered").ids).toEqual(["pm-real-1-1", "pm-real-1-2", "pm-real-1-3"]);
    expect(createSprint("5", 2, "ordered").ids).toEqual(["pm-real-5-5", "pm-real-5-6"]);
    for (const group of sprintGroups) {
      const s = createSprint(group.id, 999, "random", () => 0);
      expect(new Set(s.ids).size).toBe(group.ids.length);
      expect([...s.ids].sort()).toEqual([...group.ids].sort());
      expect(s.ids).not.toEqual(group.ids);
      expect(createSprint(group.id, 4, "random", () => 0).ids).toEqual(s.ids.slice(0,4));
    }
  });
  it("keeps supplementary sources separate from photo questions and persists their answers", () => {
    expect(availableQuestions).toHaveLength(192);
    const supplements = sprintQuestions.filter(q => q.variant === "supplement");
    expect(supplements).toHaveLength(54);
    for (const q of supplements) {
      expect(q.options).toHaveLength(5);
      expect(new Set(q.options).size).toBe(5);
      expect(q.answer).toBeGreaterThanOrEqual(0);
      expect(q.answer).toBeLessThan(5);
      expect(q.explanation.length).toBeGreaterThan(60);
      expect(q.transcriptionNote).toContain("Дополнение");
    }
    const sprint = createSprint("supplement-docx", 40, "ordered");
    const q = sprintQuestions.find(q => q.id === sprint.ids[0])!;
    const state = lockSprintAnswer({ ...emptySprintState(), sprint }, q.id, q.answer!);
    expect(parseSprintState(JSON.stringify(state))).toEqual(state);
    expect(state.record[q.id].correct).toBe(1);
  });
  it("locks first choice across repeated events, navigation and reload", () => {
    let state = { ...emptySprintState(), sprint: createSprint("1", 2, "ordered") };
    const id = state.sprint.ids[0];
    expect(advanceSprint(state)).toBe(state);
    state = lockSprintAnswer(state, id, 2) as typeof state;
    expect(lockSprintAnswer(state, id, 3)).toBe(state);
    state = parseSprintState(JSON.stringify(state)) as typeof state;
    expect(lockSprintAnswer(state, id, 1)).toBe(state);
    expect(state.record[id].attempts).toBe(1);
    state = advanceSprint(state) as typeof state;
    expect(lockSprintAnswer(state, id, 4)).toBe(state);
    state = lockSprintAnswer(state, state.sprint.ids[1], 0) as typeof state;
    state = advanceSprint(state) as typeof state;
    expect(state.sprint.finished).toBe(true);
    expect(lockSprintAnswer(state, id, 4)).toBe(state);
  });
  it("isolates users, validates stored data and restricts counts", () => {
    expect(sprintKey("a")).not.toBe(sprintKey("b"));
    const legacy = { ids: availableQuestions.map(q => q.id), answers: {}, index: 7, finished: false };
    expect(parseSprintState(JSON.stringify({ record: {}, sprint: legacy })).sprint?.ids).toHaveLength(192);
    expect(parseSprintState("broken")).toEqual(emptySprintState());
    expect(createSprint("1", 999, "random").ids).toHaveLength(50);
    expect(createSprint("1", 0, "ordered").ids).toHaveLength(1);
    const s = createSprint("1", 2, "ordered");
    expect(parseSprintState(JSON.stringify({ record: {}, sprint: { ...s, ids: [s.ids[0], s.ids[0]] } })).sprint).toBeNull();
    const restored = parseSprintState(JSON.stringify({ record: { unknown: { attempts: 1, correct: 1, lastAnswer: 0 } }, sprint: { ...s, finished: true, index: 999, answers: { [s.ids[0]]: 9 } } }));
    expect(restored.record).toEqual({});
    expect(restored.sprint).toMatchObject({ finished: false, index: 1, answers: {} });
  });
});
