/**
 * «Твой маршрут» — ивент как цепочка остановок: лекции по порядку и в
 * конце итоговый квиз. Остановка пройдена, когда пройден квиз по лекции
 * (или итоговый) — это и есть «проверил себя по всей лекции»; текущая —
 * первая непройденная. Нужна и экрану ивента, и хабу «Учёба», куда
 * содержимое ивентов не попадает — поэтому остановки считаются отдельно
 * от состояний и уходят в браузер лёгким списком.
 */

import type { Progress } from "./engine";
import type { Lecture, StudyEvent, Text } from "./types";

export interface RouteStop {
  /** Шаг маршрута, по которому остановка считается пройденной. */
  step: string;
  label: Text;
  final: boolean;
}

export type StopState = "done" | "current" | "todo";

/** Короткая подпись лекции: своя (short) или то, что после «—» в названии. */
export function shortTitle(lecture: Lecture): Text {
  if (lecture.short) return lecture.short;
  const tail = (t: string) => t.split(" — ").slice(1).join(" — ").trim() || t;
  return { en: tail(lecture.title.en), ru: tail(lecture.title.ru) };
}

export function routeStops(event: StudyEvent): RouteStop[] {
  return [
    ...event.lectures.map((l) => ({ step: `${l.id}-quiz`, label: shortTitle(l), final: false })),
    { step: `${event.id}-final`, label: { en: "Final quiz", ru: "Итоговый квиз" }, final: true },
  ];
}

export function routeStates(stops: RouteStop[], progress: Progress): StopState[] {
  const current = stops.findIndex((s) => !progress[s.step]);
  return stops.map((s, i) => (progress[s.step] ? "done" : i === current ? "current" : "todo"));
}
