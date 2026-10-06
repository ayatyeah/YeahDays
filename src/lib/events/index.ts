import type { StudyEvent } from "./types";
import { week1 } from "./researchMethods/week1";
import { week2 } from "./researchMethods/week2";
import { week3 } from "./researchMethods/week3";
import { week4 } from "./researchMethods/week4";
import { cheatSheet, glossary } from "./researchMethods/extras";
import { lecture1 } from "./computerNetworks/lecture1";
import { lecture2 } from "./computerNetworks/lecture2";
import { lecture3 } from "./computerNetworks/lecture3";
import { lecture4 } from "./computerNetworks/lecture4";
import { drill } from "./computerNetworks/drill";
import { cheatSheet as cnCheatSheet, glossary as cnGlossary } from "./computerNetworks/extras";
import { lecture1 as cc1 } from "./cloudComputing/lecture1";
import { lecture2 as cc2 } from "./cloudComputing/lecture2";
import { lecture3 as cc3 } from "./cloudComputing/lecture3";
import { lecture4 as cc4 } from "./cloudComputing/lecture4";
import { lecture5 as cc5 } from "./cloudComputing/lecture5";
import { cheatSheet as ccCheatSheet, glossary as ccGlossary } from "./cloudComputing/extras";

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
    glossary,
    cheatSheet,
  },
  {
    id: "computer-networks-midterm",
    title: "Подготовка к мидтерму",
    course: "Computer Networks",
    description:
      "Четыре лекции по частям и отдельный блок с темами из образцов мидтерма, которых нет в слайдах. Вопросы — в формате настоящего варианта: 25 вопросов с выбором из четырёх. Внутри есть игра: двоичный спринт и «Ты — коммутатор».",
    lectures: [lecture1, lecture2, lecture3, lecture4, drill],
    counts: { part: 8, lecture: 18, final: 45 },
    glossary: cnGlossary,
    cheatSheet: cnCheatSheet,
    game: "networks",
  },
  {
    id: "cloud-computing-midterm",
    title: "Подготовка к мидтерму",
    course: "Cloud Computing",
    description:
      "Пять лекций по частям: конспект с таблицами и схемами, и после каждой части — квиз на 20 вопросов по всей части, с разбором, почему неверные варианты не подходят. Дальше — квиз по лекции и итоговый по всему курсу.",
    lectures: [cc1, cc2, cc3, cc4, cc5],
    counts: { part: 20, lecture: 20, final: 45 },
    glossary: ccGlossary,
    cheatSheet: ccCheatSheet,
  },
];

export function findEvent(id: string): StudyEvent | undefined {
  return EVENTS.find((e) => e.id === id);
}
