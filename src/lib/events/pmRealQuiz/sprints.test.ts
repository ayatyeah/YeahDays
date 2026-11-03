import { describe, expect, it } from "vitest";
import { availableQuestions } from "./model";
import { advanceSprint, createSprint, emptySprintState, lockSprintAnswer, parseSprintState, sprintKey } from "./sprints";

describe("PM exam sprints", () => {
  it("covers all questions before repeats and prioritizes errors after coverage", () => {
    let state = emptySprintState();
    const seen = new Set<string>();
    for (let batch = 0; batch < 4; batch++) {
      const count = batch === 3 ? 42 : 50;
      state = { ...state, sprint: createSprint(state.record, count) };
      for (const id of state.sprint!.ids) {
        expect(seen.has(id)).toBe(false); seen.add(id);
        state = lockSprintAnswer(state, id, 0); state = advanceSprint(state);
      }
      expect(state.sprint!.finished).toBe(true);
    }
    expect(seen.size).toBe(availableQuestions.length);
    const errors = availableQuestions.filter(q => q.answer !== 0).map(q => q.id);
    expect(createSprint(state.record, errors.length).ids.every(id => errors.includes(id))).toBe(true);
  });
  it("locks first choice across repeated events, navigation and reload", () => {
    let state = { ...emptySprintState(), sprint: createSprint({}, 2) };
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
    expect(parseSprintState("broken")).toEqual(emptySprintState());
    expect(createSprint({}, 999).ids).toHaveLength(availableQuestions.length);
    expect(createSprint({}, 0).ids).toHaveLength(1);
    const s = createSprint({}, 2);
    expect(parseSprintState(JSON.stringify({ record: {}, sprint: { ...s, ids: [s.ids[0], s.ids[0]] } })).sprint).toBeNull();
    const restored = parseSprintState(JSON.stringify({ record: { unknown: { attempts: 1, correct: 1, lastAnswer: 0 } }, sprint: { ...s, finished: true, index: 999, answers: { [s.ids[0]]: 9 } } }));
    expect(restored.record).toEqual({});
    expect(restored.sprint).toMatchObject({ finished: false, index: 1, answers: {} });
  });
});
