import type { StudyEvent } from "../types";
import { lecture1 } from "./lecture1";
import { lecture2 } from "./lecture2";
import { lecture3 } from "./lecture3";
import { lecture4 } from "./lecture4";
import { drill } from "./drill";
import { cheatSheet as cnCheatSheet, glossary as cnGlossary } from "./extras";

/** Ивент целиком: грузится отдельным чанком (см. lib/events/client.ts). */
export const event: StudyEvent = {
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
};
