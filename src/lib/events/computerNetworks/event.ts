import type { StudyEvent } from "../types";
import { lecture1 } from "./lecture1";
import { lecture2 } from "./lecture2";
import { lecture3 } from "./lecture3";
import { lecture4 } from "./lecture4";
import { lecture5 } from "./lecture5";
import { lecture7 } from "./lecture7";
import { drill } from "./drill";
import { cheatSheet as cnCheatSheet, glossary as cnGlossary } from "./extras";
import { cnVideos } from "./videos";

/** Ивент целиком: грузится отдельным чанком (см. lib/events/client.ts). */
export const event: StudyEvent = {
  id: "computer-networks-midterm",
  title: "Подготовка к мидтерму",
  course: "Computer Networks",
  description:
    "Лекции 1–5 и 7 по частям — от устройства сетей до сетевого уровня, ARP, настройки маршрутизатора, адресации IPv6 и ICMP — и отдельный блок с темами из образцов мидтерма, которых нет в слайдах. Вопросы — в формате настоящего варианта: 25 вопросов с выбором из четырёх. Внутри есть игра: двоичный спринт и «Ты — коммутатор».",
  // Лекции 6 в курсе приложения нет — её не давали; 7-я (IPv6, ICMP) идёт сразу за 5-й, перед блоком образцов.
  lectures: [lecture1, lecture2, lecture3, lecture4, lecture5, lecture7, drill],
  counts: { part: 8, lecture: 18, final: 45 },
  glossary: cnGlossary,
  cheatSheet: cnCheatSheet,
  game: "networks",
  videos: cnVideos,
};
