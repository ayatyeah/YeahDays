import type { StudyEvent } from "../types";
import { lecture1 as cv1 } from "./lecture1";
import { lecture2 as cv2 } from "./lecture2";
import { lecture3 as cv3 } from "./lecture3";
import { lecture4 as cv4 } from "./lecture4";
import { lecture5 as cv5 } from "./lecture5";
import { drill as cvDrill } from "./drill";
import { mocks as cvMocks } from "./mocks";
import { cheatSheet as cvCheatSheet, glossary as cvGlossary } from "./extras";

/** Ивент целиком: грузится отдельным чанком (см. lib/events/client.ts). */
export const event: StudyEvent = {
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
};
