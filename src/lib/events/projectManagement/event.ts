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
import { pmVideos } from "./videos";

// MCQ Test 2: «50 questions paper-based MCQ test based on the materials of
// lectures 4-8». В материалах к тесту лежат и лекции 9–10 — они здесь
// отдельным блоком «вне теста»: конспекты можно открыть, но в маршрут,
// готовность, квизы, пробный тест, ленту и фаст-мод они не входят. Итоговый
// квиз — 50 вопросов поровну по пяти лекциям, по 10 на лекцию.
const inTest = new Set(["pm-l4", "pm-l5", "pm-l6", "pm-l7", "pm-l8"]);

/** Ивент целиком: грузится отдельным чанком (см. lib/events/client.ts). */
export const event: StudyEvent = {
  id: "project-management-test-2",
  title: "Подготовка к MCQ Test 2",
  course: "Project Management · UPr 2301",
  description:
    "Тест на бумаге: 50 вопросов с выбором ответа по лекциям 4–8, примерно по 10 на лекцию. Пять лекций по частям — контроль затрат и earned value, групповая динамика, оргструктуры, Agile, Scrum, персоны и user stories. После каждой части — квиз на 20 вопросов с разбором, в конце — итоговый на 50 и пробный тест на время. Мало времени — фаст-мод.",
  lectures: [
    { ...pm4, short: { en: "Cost & groups", ru: "Затраты и группы" } },
    { ...pm5, short: { en: "Org structures", ru: "Оргструктуры" } },
    { ...pm6, short: { en: "Agile mindset", ru: "Agile" } },
    { ...pm7, short: { en: "Scrum", ru: "Scrum" } },
    { ...pm8, short: { en: "Personas & stories", ru: "Персоны и истории" } },
  ],
  counts: { part: 20, lecture: 20, final: 50 },
  glossary: pmGlossary,
  cheatSheet: pmCheatSheet,
  fast: pmFast,
  // Время теста в силлабусе не указано: минута на вопрос — обычный темп MCQ.
  exam: { name: "MCQ Test 2", questions: 50, minutes: 50, points: 18 },
  videos: pmVideos.filter((v) => inTest.has(v.partId.replace(/-p\d+$/, ""))),
  extra: {
    title: { en: "Lectures 9–10 · not in Test 2", ru: "Лекции 9–10 · в Test 2 не входят" },
    note: {
      en: "They are in the course materials, but the test covers lectures 4–8. Read them later — for the final exam.",
      ru: "Лежат в материалах курса, но тест — по лекциям 4–8. Пригодятся позже, к финальному экзамену.",
    },
    lectures: [
      { ...pm9, short: { en: "Value delivery", ru: "Ценность" } },
      { ...pm10, short: { en: "Stakeholders", ru: "Стейкхолдеры" } },
    ],
  },
};
