import type { StudyEvent } from "../types";
import { lecture4 as pm4 } from "./l4";
import { lecture5 as pm5 } from "./l5";
import { lecture6 as pm6 } from "./l6";
import { lecture7 as pm7 } from "./l7";
import { lecture8 as pm8 } from "./l8";
import { lecture9 as pm9 } from "./l9";
import { lecture10 as pm10 } from "./l10";
import { pmFast } from "./fast";
import { cheatSheet as pmCheatSheet, glossary as pmGlossary } from "./extras";

// MCQ Test 2 по силлабусу — неделя 9, лекции 4–8, 50 вопросов на 18 баллов.
// В материалах к тесту лежат лекции 4–10, поэтому здесь все семь. Итоговый
// квиз — 50 вопросов по всем лекциям, как настоящий тест.
/** Ивент целиком: грузится отдельным чанком (см. lib/events/client.ts). */
export const event: StudyEvent = {
  id: "project-management-test-2",
  title: "Подготовка к MCQ Test 2",
  course: "Project Management · UPr 2301",
  description:
    "Семь лекций по частям — от контроля затрат, earned value и групповой динамики до оргструктур, Agile, Scrum, user stories, value-driven delivery и работы со стейкхолдерами. После каждой части — квиз на 20 вопросов с разбором каждого варианта, в конце — итоговый на 50 вопросов, как настоящий тест. Мало времени — фаст-мод.",
  lectures: [
    { ...pm4, short: { en: "Cost & groups", ru: "Затраты и группы" } },
    { ...pm5, short: { en: "Org structures", ru: "Оргструктуры" } },
    { ...pm6, short: { en: "Agile mindset", ru: "Agile" } },
    { ...pm7, short: { en: "Scrum", ru: "Scrum" } },
    { ...pm8, short: { en: "Personas & stories", ru: "Персоны и истории" } },
    { ...pm9, short: { en: "Value delivery", ru: "Ценность" } },
    { ...pm10, short: { en: "Stakeholders", ru: "Стейкхолдеры" } },
  ],
  counts: { part: 20, lecture: 20, final: 50 },
  glossary: pmGlossary,
  cheatSheet: pmCheatSheet,
  fast: pmFast,
  // Время теста в силлабусе не указано: минута на вопрос — обычный темп MCQ.
  exam: { name: "MCQ Test 2", questions: 50, minutes: 50, points: 18 },
};
