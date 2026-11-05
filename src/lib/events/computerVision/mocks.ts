import type { MockExam } from "../types";
import { lecture1 } from "./lecture1";
import { lecture2 } from "./lecture2";
import { lecture3 } from "./lecture3";
import { lecture4 } from "./lecture4";
import { lecture5 } from "./lecture5";

/** Every task comes directly from a lecture question and its explanation. */
export const mocks: MockExam[] = Array.from({ length: 4 }, (_, version) => ({
  id: `cv-lecture-practice-${version + 1}`,
  title: { en: `Lecture Practice ${version + 1}`, ru: `Практика по лекциям ${version + 1}` },
  minutes: 90,
  source: { en: "Lectures 1–5: choose an answer and explain your reasoning", ru: "Лекции 1–5: выбери ответ и объясни ход рассуждений" },
  questions: [lecture1, lecture2, lecture3, lecture4, lecture5].map((lecture, i) => {
    const pool = lecture.parts.flatMap(part => part.questions.map(question => ({ part, question })));
    return {
      id: `cv-lecture-practice-${version + 1}-l${i + 1}`,
      title: lecture.title.en,
      kind: "question" as const,
      points: 20,
      context: `Source: ${lecture.title.en}. For each task, choose the correct answer and explain it using the lecture.`,
      tasks: pool.slice(version * 4, version * 4 + 4).map(({ part, question }, j) => ({
        id: `cv-lecture-practice-${version + 1}-${question.id}`,
        label: `${j + 1}. ${part.title.en}`,
        points: 5,
        prompt: `${question.q}\n${question.options.map((option, k) => `${String.fromCharCode(65 + k)}. ${option}`).join("\n")}\nExplain your choice.`,
        rubric: ["2 pts — selects the correct answer", "3 pts — explains the relevant lecture concept accurately"],
        answer: { en: `${question.options[question.answer]}. ${question.why.en}`, ru: `${question.options[question.answer]}. ${question.why.ru}` },
      })),
    };
  }),
}));
