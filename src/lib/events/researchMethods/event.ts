import type { StudyEvent } from "../types";
import { lecture1 as rm1 } from "./l1";
import { lecture2 as rm2 } from "./l2";
import { lecture3 as rm3 } from "./l3";
import { lecture4 as rm4 } from "./l4";
import { lecture5 as rm5 } from "./l5";
import { practice as rmPractice } from "./practice";
import { rmMocks } from "./mocks";
import { rmFast } from "./fast";
import { cheatSheet, glossary } from "./extras";

/** Ивент целиком: грузится отдельным чанком (см. lib/events/client.ts). */
export const event: StudyEvent = {
  id: "research-methods-quiz-1",
  title: "Подготовка к квизам и мидтерму",
  course: "Research Methods and Tools · Mill 3222",
  description:
    "Пять лекций по частям — от того, что такое исследование, до количественных и качественных методов — и практика в формате квиза-кейса, как SafeDrive от преподавателя. После каждой части — квиз на 20 вопросов с разбором каждого варианта. Плюс 8 пробных квизов-кейсов: часть A — тест, часть B — открытые задания, ИИ ставит баллы по критериям. Мало времени — фаст-мод.",
  lectures: [rm1, rm2, rm3, rm4, rm5, rmPractice],
  counts: { part: 20, lecture: 20, final: 45 },
  glossary,
  cheatSheet,
  mocks: rmMocks,
  mocksKind: "case",
  fast: rmFast,
};
