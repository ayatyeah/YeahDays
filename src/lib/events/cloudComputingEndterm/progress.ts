import questions from "./questions.json";
import knowledgeCheckOptionCounts from "./knowledgeCheckOptionCounts.json";
import lessons from "./lessons.json";

export type CloudProgress = { read: string[]; answers: Record<string, number[]>; current: string };
export const emptyProgress = (): CloudProgress => ({ read: [], answers: {}, current: lessons[0].id });
export { matchesAnswer as correctAnswer } from "../quizAnswers";
export function parseProgress(raw: string | null): CloudProgress {
  try {
    const data = JSON.parse(raw ?? "null");
    if (!data || typeof data !== "object") return emptyProgress();
    const answers: Record<string, number[]> = {};
    const optionCounts = { ...Object.fromEntries(questions.map(q => [q.id, q.options.length])), ...knowledgeCheckOptionCounts };
    for (const [id, count] of Object.entries(optionCounts)) {
      const a = data.answers?.[id];
      if (Array.isArray(a) && a.length && new Set(a).size === a.length && a.every(n => Number.isInteger(n) && n >= 0 && n < count)) answers[id] = a;
    }
    return {
      read: Array.isArray(data.read) ? [...new Set<string>(data.read.filter((id: unknown) => typeof id === "string" && lessons.some(l => l.id === id)))] : [],
      current: lessons.some(l => l.id === data.current) ? data.current : lessons[0].id,
      answers,
    };
  } catch { return emptyProgress(); }
}
