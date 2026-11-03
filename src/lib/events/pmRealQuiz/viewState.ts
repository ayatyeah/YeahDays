import { availableQuestions, parseAnswers, type Answers } from "./model";

export type QuizTab = "questions" | "brief" | "full" | "sources";
export type QuizView = {
  tab: QuizTab; variant: string; lecture: string; filter: string; search: string;
  active: string; draft: Answers; revealed: Record<string, boolean>; scroll: number;
};
export function parseQuizView(value: unknown): QuizView | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Record<string, unknown>;
  if (!["questions", "brief", "full", "sources"].includes(String(v.tab)) || !availableQuestions.some(q => q.id === v.active)) return null;
  return {
    tab: v.tab as QuizTab,
    variant: ["all", "1", "4", "5", "unknown"].includes(String(v.variant)) ? String(v.variant) : "all",
    lecture: ["all", "4", "5", "6", "7", "8"].includes(String(v.lecture)) ? String(v.lecture) : "all",
    filter: ["all", "errors", "unanswered"].includes(String(v.filter)) ? String(v.filter) : "all",
    search: typeof v.search === "string" ? v.search : "",
    active: String(v.active), draft: parseAnswers(JSON.stringify(v.draft ?? {})),
    revealed: Object.fromEntries(availableQuestions.filter(q => (v.revealed as Record<string, unknown> | undefined)?.[q.id] === true).map(q => [q.id, true])),
    scroll: typeof v.scroll === "number" && Number.isFinite(v.scroll) ? Math.max(0, v.scroll) : 0,
  };
}
