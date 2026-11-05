export const PM_QUIZ2_TITLE = "ПРАКТИКА ПО ЛЕКЦИЯМ 4–8";
export const PM_QUIZ2_VERSION = 1;
export const PM_QUIZ2_DURATION = 60 * 60 * 1000;
export const PM_QUIZ2_COUNT = 50;
export interface Quiz2Attempt {
  version: number;
  startedAt: number;
  deadline: number;
  answers: (number | null)[];
  submittedAt: number | null;
}
export const quiz2Key = (userId: string) => `yg-pm-quiz2:v1:${userId}`;
export function newQuiz2Attempt(now: number): Quiz2Attempt {
  return { version: PM_QUIZ2_VERSION, startedAt: now, deadline: now + PM_QUIZ2_DURATION, answers: Array(PM_QUIZ2_COUNT).fill(null), submittedAt: null };
}
export function parseQuiz2Attempt(raw: string | null): Quiz2Attempt | null {
  try {
    const a = JSON.parse(raw ?? 'null');
    if (!a || a.version !== PM_QUIZ2_VERSION || !Number.isFinite(a.startedAt) || a.startedAt <= 0 || a.deadline !== a.startedAt + PM_QUIZ2_DURATION || !Array.isArray(a.answers) || a.answers.length !== PM_QUIZ2_COUNT || !a.answers.every((v: unknown) => v === null || (typeof v === 'number' && Number.isInteger(v) && v >= 0 && v < 5)) || !(a.submittedAt === null || (Number.isFinite(a.submittedAt) && a.submittedAt >= a.startedAt))) return null;
    return a;
  } catch { return null; }
}
export function finishQuiz2(a: Quiz2Attempt, now: number): Quiz2Attempt {
  return a.submittedAt !== null ? a : { ...a, submittedAt: Math.min(now, a.deadline) };
}
export function answerQuiz2(a: Quiz2Attempt, index: number, option: number, now: number): Quiz2Attempt {
  if (a.submittedAt !== null) return a;
  if (now >= a.deadline) return finishQuiz2(a, now);
  if (!Number.isInteger(index) || index < 0 || index >= PM_QUIZ2_COUNT || !Number.isInteger(option) || option < 0 || option > 4) return a;
  return { ...a, answers: a.answers.map((value, i) => i === index ? option : value) };
}
