/**
 * Правила прохождения ивента: порядок шагов, набор вопросов на попытку,
 * подсчёт готовности. Чистые функции — случайность передаётся снаружи,
 * чтобы тесты могли её зафиксировать.
 */

import type { Question, StudyEvent, Text } from "./types";

/** «deep» — разбор части до косточек: отдельный необязательный банк, в маршрут и готовность не входит. */
export type StepKind = "part" | "lecture" | "final" | "deep";

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
  /** Почему не подходит каждый вариант (после перемешивания); у верного — null. Есть у вопросов «до косточек». */
  wrong?: (Text | null)[];
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
/**
 * Шаг «разбора до косточек» для части — вне маршрута: steps() его не
 * возвращает, readiness() не учитывает. Берутся все вопросы банка.
 */
export function deepStep(event: StudyEvent, lecture: number, part: number): Step | null {
  const p = event.lectures[lecture]?.parts[part];
  if (!p?.deep?.length) return null;
  return { id: `${p.id}-deep`, kind: "deep", lecture, part, title: { en: `Deep dive: ${p.title.en}`, ru: `До косточек: ${p.title.ru}` }, count: p.deep.length };
}

/** Все шаги «до косточек» ивента — для хранения результатов и подсчёта. */
export function deepSteps(event: StudyEvent): Step[] {
  return event.lectures.flatMap((l, li) => l.parts.map((_, pi) => deepStep(event, li, pi))).filter((s): s is Step => !!s);
}

export function draw(event: StudyEvent, step: Step, rng: Rng = Math.random): QuizQuestion[] {
  type Tagged = { question: Question; lecture: number };
  const lecturePile = (li: number): Tagged[] =>
    roundRobin(
      shuffle(event.lectures[li].parts.map((p) => shuffle(p.questions, rng)), rng),
      Infinity,
    ).map((question) => ({ question, lecture: li }));

  let picked: Tagged[];
  if (step.kind === "deep") {
    const pool = event.lectures[step.lecture!].parts[step.part!].deep ?? [];
    picked = shuffle(pool, rng).map((question) => ({ question, lecture: step.lecture! }));
  } else if (step.kind === "part") {
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
      ...(question.wrong
        ? { wrong: order.map((i) => (i === question.answer ? null : question.wrong![i < question.answer ? i : i - 1] ?? null)) }
        : {}),
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

/**
 * Объединить прогресс с двух устройств (или локальный с серверным).
 *
 * Обычное «побеждает последняя запись» стирало бы результаты: человек
 * прошёл две части на телефоне, одну на ноутбуке — и после синхронизации
 * остался бы только ноутбук. Поэтому по каждому шагу берём лучшее: лучший
 * результат и большее число попыток. «Последний» результат — от стороны,
 * где попыток больше, то есть более свежей.
 */
export function mergeProgress(a: Progress, b: Progress): Progress {
  const out: Progress = { ...a };
  for (const [id, theirs] of Object.entries(b)) {
    const mine = out[id];
    if (!mine) {
      out[id] = theirs;
      continue;
    }
    const newer = theirs.attempts > mine.attempts ? theirs : mine;
    out[id] = { ...newer, best: Math.max(mine.best, theirs.best), attempts: Math.max(mine.attempts, theirs.attempts) };
  }
  return out;
}

/**
 * Привести присланный клиентом прогресс к допустимому виду.
 *
 * Сервер не верит браузеру: чужие ключи отбрасываются, доли зажимаются в
 * 0…1. Это не защита от накрутки (квиз проходится на клиенте, и честность
 * результата — дело самого человека), а защита базы и рейтинга от мусора.
 */
export function sanitizeProgress(event: StudyEvent, raw: unknown): Progress {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const share = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 0);
  const out: Progress = {};
  for (const step of [...steps(event), ...deepSteps(event)]) {
    const item = (raw as Record<string, unknown>)[step.id];
    if (!item || typeof item !== "object") continue;
    const r = item as Record<string, unknown>;
    const attempts = typeof r.attempts === "number" && Number.isInteger(r.attempts) ? Math.min(9999, Math.max(1, r.attempts)) : 1;
    const result: StepResult = { best: share(r.best), last: share(r.last), attempts };
    if (step.kind === "final" && r.byLecture && typeof r.byLecture === "object") {
      const byLecture: Record<number, [number, number]> = {};
      event.lectures.forEach((_, li) => {
        const cell = (r.byLecture as Record<string, unknown>)[li];
        if (Array.isArray(cell) && cell.length === 2 && cell.every((n) => Number.isInteger(n) && n >= 0 && n <= 999)) {
          byLecture[li] = [Math.min(cell[0], cell[1]), cell[1]];
        }
      });
      result.byLecture = byLecture;
    }
    out[step.id] = result;
  }
  return out;
}

/**
 * Ивент пройден — ачивка. Условие: каждый шаг маршрута хотя бы раз
 * пройден, а итоговый квиз — не ниже 80% (лучшая попытка). Разбор «до
 * косточек» сюда не входит: он необязателен.
 */
export function completed(event: StudyEvent, progress: Progress): boolean {
  const all = steps(event);
  if (!all.every((s) => progress[s.id])) return false;
  const final = all.find((s) => s.kind === "final");
  return !!final && (progress[final.id]?.best ?? 0) >= 0.8;
}

/** Сколько минут примерно занимает шаг — для плана по дням. */
export function stepMinutes(step: Step): number {
  return step.kind === "part" ? 20 : step.kind === "lecture" ? 20 : 40;
}

export interface PlanDay {
  /** YYYY-MM-DD */
  date: string;
  steps: Step[];
  minutes: number;
}

const addDays = (day: string, n: number) => new Date(Date.parse(`${day}T12:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);

/**
 * Разложить ещё не пройденные шаги по дням от сегодня до дня перед квизом.
 *
 * Порядок шагов сохраняется, нагрузка выравнивается по минутам, а не по
 * числу шагов: итоговый квиз вдвое длиннее части. Последний день перед
 * квизом достаётся итоговому квизу — чтобы «репетиция» была накануне, а не
 * за неделю. Если квиз сегодня или уже прошёл, всё остаётся на сегодня.
 */
export function planDays(event: StudyEvent, progress: Progress, today: string, examDate: string): PlanDay[] {
  const left = steps(event).filter((s) => !progress[s.id]);
  if (!left.length) return [];
  const span = Math.round((Date.parse(`${examDate}T12:00:00Z`) - Date.parse(`${today}T12:00:00Z`)) / 86_400_000);
  const days = Math.max(1, Math.min(span, left.length));
  const total = left.reduce((n, s) => n + stepMinutes(s), 0);
  const out: PlanDay[] = Array.from({ length: days }, (_, i) => ({ date: addDays(today, i), steps: [], minutes: 0 }));
  let day = 0;
  let spent = 0;
  left.forEach((step, i) => {
    // Переходим к следующему дню, когда набрали его долю минут — но так,
    // чтобы шагов хватило на все оставшиеся дни.
    while (day < days - 1 && (spent >= (total / days) * (day + 1) || left.length - i <= days - 1 - day) && out[day].steps.length > 0) day++;
    out[day].steps.push(step);
    out[day].minutes += stepMinutes(step);
    spent += stepMinutes(step);
  });
  return out.filter((d) => d.steps.length > 0);
}
