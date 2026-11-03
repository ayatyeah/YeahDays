import { availableQuestions } from "./model";

export type SprintRecord = Record<string, { attempts: number; correct: number; lastAnswer: number }>;
export type Sprint = { ids: string[]; answers: Record<string, number>; index: number; finished: boolean };
export type SprintState = { record: SprintRecord; sprint: Sprint | null };
export const emptySprintState = (): SprintState => ({ record: {}, sprint: null });
export const sprintKey = (userId: string) => `yg-pm-sprints:v1:${userId}`;
const byId = new Map(availableQuestions.map(q => [q.id, q]));
const validAnswer = (a: unknown): a is number => Number.isInteger(a) && Number(a) >= 0 && Number(a) < 5;

export function parseSprintState(raw: string | null): SprintState {
  try {
    const data = JSON.parse(raw ?? "null");
    if (!data || typeof data !== "object") return emptySprintState();
    const record: SprintRecord = {};
    for (const [id, value] of Object.entries(data.record ?? {})) {
      const v = value as SprintRecord[string];
      if (byId.has(id) && v && Number.isInteger(v.attempts) && v.attempts > 0 && Number.isInteger(v.correct) && v.correct >= 0 && v.correct <= v.attempts && validAnswer(v.lastAnswer)) record[id] = v;
    }
    const s = data.sprint;
    if (!s || !Array.isArray(s.ids) || !s.ids.length || s.ids.length > byId.size || s.ids.some((id: unknown) => typeof id !== "string" || !byId.has(id)) || new Set(s.ids).size !== s.ids.length) return { record, sprint: null };
    const answers: Record<string, number> = {};
    for (const id of s.ids) if (validAnswer(s.answers?.[id])) answers[id] = s.answers[id];
    const index = Number.isInteger(s.index) ? Math.max(0, Math.min(s.ids.length - 1, s.index)) : 0;
    return { record, sprint: { ids: s.ids, answers, index, finished: s.finished === true && s.ids.every((id: string) => answers[id] !== undefined) } };
  } catch { return emptySprintState(); }
}

export function createSprint(record: SprintRecord, count: number, random = Math.random): Sprint {
  const shuffled = [...availableQuestions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const priority = (id: string) => !record[id] ? 0 : record[id].lastAnswer !== byId.get(id)!.answer ? 1 : 2;
  shuffled.sort((a, b) => priority(a.id) - priority(b.id) || (record[a.id]?.attempts ?? 0) - (record[b.id]?.attempts ?? 0));
  const size = Number.isFinite(count) ? Math.max(1, Math.min(byId.size, Math.floor(count))) : 10;
  return { ids: shuffled.slice(0, size).map(q => q.id), answers: {}, index: 0, finished: false };
}

/** First selection is final, including repeated clicks and attempts after reload. */
export function lockSprintAnswer(state: SprintState, id: string, answer: number): SprintState {
  const s = state.sprint;
  if (!s || s.finished || s.ids[s.index] !== id || s.answers[id] !== undefined || !validAnswer(answer)) return state;
  const previous = state.record[id];
  return {
    sprint: { ...s, answers: { ...s.answers, [id]: answer } },
    record: { ...state.record, [id]: { attempts: (previous?.attempts ?? 0) + 1, correct: (previous?.correct ?? 0) + Number(byId.get(id)!.answer === answer), lastAnswer: answer } },
  };
}

export function advanceSprint(state: SprintState): SprintState {
  const s = state.sprint;
  if (!s || s.finished || s.answers[s.ids[s.index]] === undefined) return state;
  if (s.index < s.ids.length - 1) return { ...state, sprint: { ...s, index: s.index + 1 } };
  if (s.ids.some(id => s.answers[id] === undefined)) return state;
  return { ...state, sprint: { ...s, finished: true } };
}
