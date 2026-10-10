import type { StudyEvent } from "../types";
import { lecture1 as cc1 } from "./lecture1";
import { lecture2 as cc2 } from "./lecture2";
import { lecture3 as cc3 } from "./lecture3";
import { lecture4 as cc4 } from "./lecture4";
import { lecture5 as cc5 } from "./lecture5";
import { lecture6 as cc6 } from "./l6";
import { lecture7 as cc7 } from "./l7";
import { lecture8 as cc8 } from "./l8";
import { lecture9 as cc9 } from "./l9";
import { lecture10 as cc10 } from "./l10";
import { realMidterm as ccReal } from "./real";
import { ccFast } from "./fast";
import { cheatSheet as ccCheatSheet, glossary as ccGlossary } from "./extras";

/** Ивент целиком: грузится отдельным чанком (см. lib/events/client.ts). */
export const event: StudyEvent = {
  id: "cloud-computing-midterm",
  title: "Подготовка к мидтерму",
  course: "Cloud Computing",
  description:
    "Пять лекций преподавателя и модули AWS Cloud Foundations 1–10, по которым идёт мидтерм: экономика и поддержка, безопасность и IAM, EC2, хранилища и базы, архитектура и масштабирование с лабами. Плюс банк реальных вопросов мидтерма с разбором и итоговый квиз на 40 вопросов, как в Moodle. Мало времени — фаст-мод.",
  lectures: [cc1, cc2, cc3, cc4, cc5, cc6, cc7, cc8, cc9, cc10, ccReal],
  counts: { part: 20, lecture: 20, final: 40 },
  fast: ccFast,
  glossary: ccGlossary,
  cheatSheet: ccCheatSheet,
};
