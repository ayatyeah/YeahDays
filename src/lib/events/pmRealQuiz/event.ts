import type { StudyEvent } from "../types";
import notes from "./notes.json";
import { availableQuestions, REAL_PM_ID, REAL_PM_TITLE, variants } from "./model";
const titles = ["Контроль затрат и группы", "Организационные структуры", "Agile и Lean", "Scrum", "Personas и user stories"];
export const event: StudyEvent = {
  id: REAL_PM_ID,
  title: REAL_PM_TITLE,
  course: "Project Management · UPr 2301",
  description: "151 вопрос из присланных материалов: вариант 1, вариант 4, предположительно 5 и страницы без номера. Исходные варианты A–E, русские разборы, краткий и развёрнутый конспекты по лекциям 4–8. Отдельно от тренировочного Квиза 2.",
  counts: { part: 10, lecture: 20, final: 50 },
  lectures: [4,5,6,7,8].map((lecture, i) => ({
    id: `pm-real-l${lecture}`,
    title: { ru: `Лекция ${lecture} · ${titles[i]}`, en: `Lecture ${lecture}` },
    parts: [{
      id: `pm-real-l${lecture}-p1`,
      title: { ru: titles[i], en: titles[i] },
      notes: { ru: notes.filter(n => n.lecture === lecture).map(n => `## ${n.title}\n${n.full}`).join("\n\n"), en: notes.filter(n => n.lecture === lecture).map(n => `## ${n.title}\n${n.full}`).join("\n\n") },
      questions: availableQuestions.filter(q => q.lecture === lecture).map(q => ({
        id: q.id,
        q: `${variants.find(v => v.id === q.variant)!.label} · №${q.number}\n${q.text}`,
        options: q.options,
        answer: q.answer!,
        fixed: true,
        why: { ru: q.explanation, en: q.explanation },
      })),
    }],
  })),
};
