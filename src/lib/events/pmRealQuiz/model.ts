import bank from "./questions.json";
import type { Progress } from "../engine";
export const REAL_PM_ID = "project-management-quiz-2-real";
export const REAL_PM_TITLE = "Квиз 2 · Вопросы из реального теста";
export const variants = [
  { id: "1", label: "Вариант 1", note: "Номер виден на обложке. Восстановлены все 50 вопросов; повторные фото объединены." },
  { id: "4", label: "Вариант 4", note: "Номер виден на обложке. Есть 37 вопросов; №28–32, 38–42 и 48–50 на подтверждённых страницах отсутствуют." },
  { id: "5", label: "Предположительно 5", note: "Так обозначен в папке и Word; обложки с номером нет. Есть №5–50. Совпадающие страницы из папки «1ый варик» отнесены сюда по тексту." },
  { id: "unknown", label: "Номер не установлен", note: "Отдельные страницы без обложки: №13–17, 28–42 и 48–50. Не присваиваем им номер по соседству файлов. Дубликаты варианта 1 из этой папки учтены в варианте 1." },
];
export type RealQuestion = typeof bank[number];
export const availableQuestions = bank.filter(q => q.available);
export type Answers = Record<string, number>;
export const realQuizKey = (userId: string) => `yg-pm-real:v1:${userId}`;
export function parseAnswers(raw: string | null): Answers {
  try {
    const value: unknown = JSON.parse(raw ?? "null");
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    const valid = new Set(availableQuestions.map(q => q.id));
    return Object.fromEntries(Object.entries(value).filter(([id, answer]) => valid.has(id) && Number.isInteger(answer) && answer >= 0 && answer < 5));
  } catch { return {}; }
}
export function answerStats(answers: Answers, questions = availableQuestions) {
  return { total: questions.length, answered: questions.filter(q => answers[q.id] !== undefined).length, correct: questions.filter(q => answers[q.id] === q.answer).length };
}
/** Shared learning cards show actual checked questions, including partial coverage. */
export function realProgress(answers: Answers): Progress {
  const result: Progress = {};
  for (const lecture of [4,5,6,7,8]) {
    const subset = availableQuestions.filter(q => q.lecture === lecture);
    const stats = answerStats(answers, subset);
    if (stats.answered === stats.total) {
      const value = { best: stats.correct / stats.total, last: stats.correct / stats.total, attempts: 1 };
      result[`pm-real-l${lecture}-p1`] = value;
      result[`pm-real-l${lecture}-quiz`] = value;
    }
  }
  const all = answerStats(answers);
  if (all.answered === all.total) result[`${REAL_PM_ID}-final`] = { best: all.correct / all.total, last: all.correct / all.total, attempts: 1 };
  return result;
}
