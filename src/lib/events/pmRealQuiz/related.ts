import notes from "./notes.json";
import { type RealQuestion } from "./model";
import { sprintQuestions } from "./sprints";

export function questionNote(question: RealQuestion) {
  const sourceNumber = question.variant === "supplement" ? Number(question.id.split("-").at(-1)) : question.number;
  const topicByNumber: Record<number, string> = { 1: "control", 2: "control", 3: "groups", 4: "authority", 5: "structures", 6: "structures", 7: "agile", 8: "methods", 9: "methods", 10: "scrum-foundation", 11: "scrum-events", 12: "scrum-artifacts", 13: "personas", 14: "stories", 15: "stories", 16: "control", 17: "control", 18: "evm", 19: "evm", 20: "evm", 21: "groups", 22: "groups", 23: "authority", 24: "authority", 25: "structures", 26: "structures", 27: "structures", 28: "structures", 29: "structures", 30: "agile", 31: "agile", 32: "agile", 33: "methods", 34: "lean", 35: "lean", 36: "leader", 37: "scrum-foundation", 38: "scrum-foundation", 39: "scrum-roles", 40: "scrum-roles", 41: "scrum-events", 42: "scrum-events", 43: "scrum-events", 44: "personas", 45: "personas", 46: "personas", 47: "stories", 48: "stories", 49: "stories", 50: "stories" };
  const topic = question.id === "pm-supp-html-11" ? "scrum-roles" : topicByNumber[sourceNumber];
  return notes.find(n => n.examples.includes(`${question.variant}:${question.number}`)) ?? notes.find(n => n.id === topic) ?? notes.find(n => n.lecture === question.lecture)!;

}

const sourceNumber = (q: RealQuestion) => q.variant === "supplement" ? Number(q.id.split("-").at(-1)) : q.number;
// Match the concept first, then the broader note. A lecture alone is too broad.
const concept = (q: RealQuestion) => {
  const n = sourceNumber(q);
  if ([5, 6, 29].includes(n)) return "matrix";
  if ([18, 19, 20].includes(n)) return "evm";
  if ([25, 26].includes(n)) return "functional";
  if ([44, 45, 46, 13].includes(n)) return "personas";
  if ([14, 15, 47, 48, 49, 50].includes(n)) return "stories";
  return `question-${n}`;
};
export function questionLabel(q: RealQuestion) {
  if (q.variant === "supplement") return `Дополнение ${q.id.includes("-html-") ? "HTML" : "DOCX"} · исходный №${sourceNumber(q)}`;
  return `${q.variant === "unknown" ? "Без номера варианта" : `${["3", "5"].includes(q.variant) ? "Предположительно " : "Вариант "}${q.variant}`} · №${q.number}`;
}
export function relatedQuestions(question: RealQuestion) {
  const note = questionNote(question).id;
  const same = concept(question);
  return sprintQuestions.filter(q => q.id !== question.id && (concept(q) === same || questionNote(q).id === note))
    .map(q => ({ question: q, sameConcept: concept(q) === same }))
    .sort((a, b) => Number(b.sameConcept) - Number(a.sameConcept)
      || Number(a.question.variant === "supplement") - Number(b.question.variant === "supplement")
      || a.question.id.localeCompare(b.question.id, undefined, { numeric: true }));
}
