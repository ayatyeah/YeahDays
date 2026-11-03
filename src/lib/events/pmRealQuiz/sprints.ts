import { availableQuestions } from "./model";

export type SprintRecord = Record<string, { attempts: number; correct: number; lastAnswer: number }>;
export type SprintOrder = "ordered" | "random";
const extra = availableQuestions.filter(q => !["1", "4", "5"].includes(q.variant)).sort((a, b) => a.variant.localeCompare(b.variant) || a.number - b.number);
export const sprintGroups = [
  ...["1", "4", "5"].map(id => ({ id, label: `Вариант ${id}`, ids: availableQuestions.filter(q => q.variant === id).sort((a, b) => a.number - b.number).map(q => q.id) })),
  ...Array.from({ length: Math.ceil(extra.length / 50) }, (_, i) => ({ id: `extra-${i + 1}`, label: `Дополнительный ${i + 1}`, ids: extra.slice(i * 50, (i + 1) * 50).map(q => q.id) })),
];
export type Sprint = { group?: string; order?: SprintOrder; ids: string[]; answers: Record<string, number>; index: number; finished: boolean };
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
    return { record, sprint: { group: sprintGroups.some(g => g.id === s.group) ? s.group : undefined, order: s.order === "ordered" ? "ordered" : "random", ids: s.ids, answers, index, finished: s.finished === true && s.ids.every((id: string) => answers[id] !== undefined) } };
  } catch { return emptySprintState(); }
}

export function createSprint(groupId: string, count: number, order: SprintOrder, random = Math.random): Sprint {
  const group = sprintGroups.find(g => g.id === groupId) ?? sprintGroups[0];
  const ids = [...group.ids];
  if (order === "random") for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  const size = Number.isFinite(count) ? Math.max(1, Math.min(50, ids.length, Math.floor(count))) : Math.min(10, ids.length);
  return { group: group.id, order, ids: ids.slice(0, size), answers: {}, index: 0, finished: false };
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
