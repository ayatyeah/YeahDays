import type { StudyEvent } from "./types";
import { week1 } from "./researchMethods/week1";
import { week2 } from "./researchMethods/week2";
import { week3 } from "./researchMethods/week3";
import { week4 } from "./researchMethods/week4";

/**
 * Все ивенты раздела «Учёба». Новый ивент — новый объект в этом списке и
 * папка с содержимым рядом; экраны и правила прохождения общие.
 */
export const EVENTS: StudyEvent[] = [
  {
    id: "research-methods-quiz-1",
    title: "Подготовка к квизу №1",
    course: "Research Methods and Tools · Mill 3222",
    description:
      "Четыре лекции по частям: читаешь конспект, проходишь короткий квиз, в конце лекции — квиз по всей лекции, а в финале — большой квиз по всему курсу и оценка готовности.",
    lectures: [week1, week2, week3, week4],
    counts: { part: 8, lecture: 18, final: 45 },
  },
];

export function findEvent(id: string): StudyEvent | undefined {
  return EVENTS.find((e) => e.id === id);
}
