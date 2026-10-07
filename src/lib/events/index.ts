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
import { block1 as pd1 } from "./projectDefense/block1";
import { block2 as pd2 } from "./projectDefense/block2";
import { block3 as pd3 } from "./projectDefense/block3";
import { block4 as pd4 } from "./projectDefense/block4";
import { block5 as pd5 } from "./projectDefense/block5";
import { block6 as pd6 } from "./projectDefense/block6";
import { block7 as pd7 } from "./projectDefense/block7";
import { cheatSheet as pdCheatSheet, glossary as pdGlossary } from "./projectDefense/extras";
import { lecture1 as cv1 } from "./computerVision/lecture1";
import { lecture2 as cv2 } from "./computerVision/lecture2";
import { lecture3 as cv3 } from "./computerVision/lecture3";
import { lecture4 as cv4 } from "./computerVision/lecture4";
import { lecture5 as cv5 } from "./computerVision/lecture5";
import { drill as cvDrill } from "./computerVision/drill";
import { mocks as cvMocks } from "./computerVision/mocks";
import { cheatSheet as cvCheatSheet, glossary as cvGlossary } from "./computerVision/extras";

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
  {
    id: "computer-vision-midterm",
    title: "Подготовка к мидтерму",
    course: "Computer Vision",
    description:
      "Пять лекций по частям — от обработки изображений и kNN до линейных классификаторов, backprop и CNN — и практика в формате мидтерма; после каждой части — квиз на 20 вопросов с разбором. Плюс 8 пробных вариантов с открытыми вопросами (ИИ ставит баллы и собирает отчёт о слабых темах), тренажёр расчётов, игра «Найди баг» и песочница OpenCV.",
    lectures: [cv1, cv2, cv3, cv4, cv5, cvDrill],
    counts: { part: 20, lecture: 20, final: 45 },
    glossary: cvGlossary,
    cheatSheet: cvCheatSheet,
    mocks: cvMocks,
    practice: "vision",
  },
  {
    // Ивент одной команды: защита своего проекта по их же отчёту. Только по
    // ссылке — в общем списке его нет (см. StudyEvent.unlisted).
    id: "yeahtrack-defense",
    title: "Подготовка к защите проекта",
    course: "Project Management · YeahTrack",
    description:
      "Не теория ради теории, а ваш проект: что написано в отчёте, какая идея из лекций за этим стоит, как сказать это на защите по-английски и что может спросить комиссия — со слабыми местами и честными ответами. Семь блоков по разделам отчёта, после каждой части — квиз на 15 вопросов, карточки «вопрос комиссии → ответ» и шпаргалка с цифрами проекта.",
    lectures: [pd1, pd2, pd3, pd4, pd5, pd6, pd7],
    counts: { part: 15, lecture: 20, final: 40 },
    glossary: pdGlossary,
    cheatSheet: pdCheatSheet,
    cards: "questions",
    unlisted: true,
  },
];

export function findEvent(id: string): StudyEvent | undefined {
  return EVENTS.find((e) => e.id === id);
}
