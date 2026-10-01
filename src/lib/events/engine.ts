/**
 * Правила прохождения ивента: порядок шагов, набор вопросов на попытку,
 * подсчёт готовности. Чистые функции — случайность передаётся снаружи,
 * чтобы тесты могли её зафиксировать.
 */

import type { Question, StudyEvent, Text } from "./types";

export type StepKind = "part" | "lecture" | "final";

export interface Step {
  id: string;
  kind: StepKind;
  /** Индексы лекции и части; у итогового квиза их нет. */
  lecture?: number;
  part?: number;
  title: Text;
  /** Сколько вопросов будет в квизе этого шага. */
  count: number;
}

export interface QuizQuestion {
  id: string;
  lecture: number;
  q: string;
  options: string[];
  /** Индекс верного варианта уже ПОСЛЕ перемешивания. */
  correct: number;
  why: Text;
}

/** Лучший и последний результат по шагу; доля верных от 0 до 1. */
export interface StepResult {
  best: number;
  last: number;
  attempts: number;
  /** Последняя попытка итогового квиза в разрезе лекций: [верно, всего]. */
  byLecture?: Record<number, [number, number]>;
}

export type Progress = Record<string, StepResult>;

type Rng = () => number;

export function shuffle<T>(list: readonly T[], rng: Rng = Math.random): T[] {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Маршрут ивента: часть → квиз по ней, после всех частей — квиз по лекции,
 * в самом конце — итоговый по всем лекциям.
 */
export function steps(event: StudyEvent): Step[] {
  const out: Step[] = [];
  event.lectures.forEach((lecture, li) => {
    lecture.parts.forEach((p, pi) => {
      out.push({ id: p.id, kind: "part", lecture: li, part: pi, title: p.title, count: Math.min(event.counts.part, p.questions.length) });
    });
    const pool = lecture.parts.reduce((n, p) => n + p.questions.length, 0);
    out.push({
      id: `${lecture.id}-quiz`,
      kind: "lecture",
      lecture: li,
      title: { en: `Lecture quiz: ${lecture.title.en}`, ru: `Квиз по лекции: ${lecture.title.ru}` },
      count: Math.min(event.counts.lecture, pool),
    });
  });
  const all = event.lectures.reduce((n, l) => n + l.parts.reduce((m, p) => m + p.questions.length, 0), 0);
  out.push({
    id: `${event.id}-final`,
    kind: "final",
    title: { en: "Final quiz: all lectures", ru: "Итоговый квиз по всем лекциям" },
    count: Math.min(event.counts.final, all),
  });
  return out;
}

/**
 * Взять `count` вопросов по кругу из нескольких перемешанных стопок.
 *
 * Простой случайный выбор из общего банка мог бы почти целиком прийтись на
 * одну часть, и квиз «по всей лекции» проверял бы её четверть. По кругу
 * каждая часть (а в итоговом — каждая лекция) представлена поровну.
 */
function roundRobin<T>(piles: T[][], count: number): T[] {
  const out: T[] = [];
  for (let round = 0; out.length < count; round++) {
    let took = false;
    for (const pile of piles) {
      if (round < pile.length && out.length < count) {
        out.push(pile[round]);
        took = true;
      }
    }
    if (!took) break;
  }
  return out;
}

/**
 * Вопросы на одну попытку. Каждый раз заново: другой набор, другой порядок
 * вопросов и другой порядок вариантов — выучить «третий ответ» не выйдет.
 */
export function draw(event: StudyEvent, step: Step, rng: Rng = Math.random): QuizQuestion[] {
  type Tagged = { question: Question; lecture: number };
  const lecturePile = (li: number): Tagged[] =>
    roundRobin(
      shuffle(event.lectures[li].parts.map((p) => shuffle(p.questions, rng)), rng),
      Infinity,
    ).map((question) => ({ question, lecture: li }));

  let picked: Tagged[];
  if (step.kind === "part") {
    const pool = event.lectures[step.lecture!].parts[step.part!].questions;
    picked = shuffle(pool, rng).slice(0, step.count).map((question) => ({ question, lecture: step.lecture! }));
  } else if (step.kind === "lecture") {
    picked = lecturePile(step.lecture!).slice(0, step.count);
  } else {
    picked = roundRobin(event.lectures.map((_, li) => lecturePile(li)), step.count);
  }

  return shuffle(picked, rng).map(({ question, lecture }) => {
    const order = question.fixed ? question.options.map((_, i) => i) : shuffle(question.options.map((_, i) => i), rng);
    return {
      id: question.id,
      lecture,
      q: question.q,
      options: order.map((i) => question.options[i]),
      correct: order.indexOf(question.answer),
      why: question.why,
    };
  });
}

/** Записать попытку: лучший результат не падает от неудачного повтора. */
export function record(progress: Progress, step: Step, quiz: QuizQuestion[], answers: number[]): Progress {
  const right = quiz.filter((item, i) => answers[i] === item.correct).length;
  const score = quiz.length ? right / quiz.length : 0;
  const previous = progress[step.id];
  const result: StepResult = {
    best: Math.max(previous?.best ?? 0, score),
    last: score,
    attempts: (previous?.attempts ?? 0) + 1,
  };
  if (step.kind === "final") {
    const byLecture: Record<number, [number, number]> = {};
    quiz.forEach((item, i) => {
      const cell = (byLecture[item.lecture] ??= [0, 0]);
      cell[1]++;
      if (answers[i] === item.correct) cell[0]++;
    });
    result.byLecture = byLecture;
  }
  return { ...progress, [step.id]: result };
}

/** Первый шаг, по которому ещё нет ни одной попытки (или null — всё пройдено). */
export function nextStep(event: StudyEvent, progress: Progress): Step | null {
  return steps(event).find((s) => !progress[s.id]) ?? null;
}

/**
 * Готовность к настоящему квизу, 0–100.
 *
 * Половину веса даёт итоговый квиз: он ближе всего к экзамену — вопросы
 * вперемешку со всех лекций. Квизы по лекциям — 30%, по частям — 20%.
 * Непройденный шаг считается нулём: готовность не может быть высокой у
 * того, кто пропустил лекцию. Берётся лучший результат, а не последний,
 * чтобы повторение ради закрепления не наказывалось.
 */
export function readiness(event: StudyEvent, progress: Progress) {
  const all = steps(event);
  const average = (kind: StepKind) => {
    const list = all.filter((s) => s.kind === kind);
    return list.length ? list.reduce((n, s) => n + (progress[s.id]?.best ?? 0), 0) / list.length : 0;
  };
  const parts = average("part");
  const lectures = average("lecture");
  const final = average("final");
  return {
    percent: Math.round((parts * 0.2 + lectures * 0.3 + final * 0.5) * 100),
    parts: Math.round(parts * 100),
    lectures: Math.round(lectures * 100),
    final: Math.round(final * 100),
    done: all.filter((s) => progress[s.id]).length,
    total: all.length,
  };
}
