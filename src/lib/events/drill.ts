/**
 * «Учить вопросами» — подготовка без конспекта.
 *
 * Тест с выбором ответа проверяет то же, что и банки вопросов ивента, а у
 * каждого вопроса есть объяснение верного варианта и каждой ловушки. Значит,
 * материал можно учить, отвечая: вопрос → ответ → почему так. Здесь — правила,
 * по которым вопросы возвращаются, пока не запомнятся.
 *
 * - Верно с первого раза — освоено («знал»).
 * - Ошибка — вопрос «в работе»: в том же раунде он вернётся через несколько
 *   вопросов, а в следующих раундах — первым делом. Освоен, когда на него
 *   ответили верно STREAK_TO_MASTER раз подряд.
 * - Новые вопросы идут по порядку лекций и частей (учить тему целиком проще,
 *   чем вразнобой), внутри части — случайно.
 * - Освоенное через сутки иногда возвращается на проверку; ошибка — снова в работу.
 *
 * Состояние — на устройстве, отдельно для каждого аккаунта: это тренировка, в
 * готовность ивента не идёт (как фаст-мод и игры). Чистые функции — время и
 * случайность передаются снаружи, чтобы тесты могли их зафиксировать.
 */

import { present, shuffle, type QuizQuestion } from "./engine";
import type { Question, StudyEvent } from "./types";

/** level 1 — в работе (была ошибка), 2 — освоено. Невиданных вопросов в состоянии нет. */
export interface Card {
  level: 1 | 2;
  /** Верных ответов подряд. */
  streak: number;
  /** Когда отвечали в последний раз, мс. */
  at: number;
  /** Сколько раз ошибались — для «трудных» вопросов. */
  misses: number;
}
export type DrillState = Record<string, Card>;

/** Все лекции или одна (индекс в event.lectures). */
export type Scope = "all" | number;

export const ROUND = 10;
/** Через сколько вопросов в том же раунде возвращается ошибка. */
export const RETRY_GAP = 3;
/** Сколько ошибок раунд может вернуть сверх своих вопросов — иначе он не кончится. */
export const RETRY_LIMIT = 5;
/** Сколько верных ответов подряд после ошибки — и вопрос освоен. */
export const STREAK_TO_MASTER = 2;
/** Освоенное возвращается на проверку не раньше, чем через сутки. */
const REVIEW_AFTER = 24 * 3600_000;
/** Только что отвеченное «в работе» в следующий раунд сразу не берём — пусть отлежится. */
const REST = 2 * 60_000;

interface Entry {
  question: Question;
  lecture: number;
  part: number;
}

/** Вопросы области в порядке маршрута: лекция за лекцией, часть за частью. */
export function pool(event: StudyEvent, scope: Scope): Entry[] {
  return event.lectures.flatMap((lecture, li) =>
    scope !== "all" && scope !== li ? [] : lecture.parts.flatMap((p, pi) => p.questions.map((question) => ({ question, lecture: li, part: pi }))),
  );
}

/** Записать ответ. Невиданный вопрос, отвеченный верно, сразу освоен. */
export function answer(state: DrillState, id: string, correct: boolean, now: number): DrillState {
  const card = state[id];
  let next: Card;
  if (!card) next = correct ? { level: 2, streak: 1, at: now, misses: 0 } : { level: 1, streak: 0, at: now, misses: 1 };
  else if (!correct) next = { level: 1, streak: 0, at: now, misses: card.misses + 1 };
  else {
    const streak = card.streak + 1;
    next = { level: card.level === 2 || streak >= STREAK_TO_MASTER ? 2 : 1, streak, at: now, misses: card.misses };
  }
  return { ...state, [id]: next };
}

export interface DrillStats {
  total: number;
  mastered: number;
  learning: number;
  fresh: number;
}

export function stats(event: StudyEvent, state: DrillState, scope: Scope = "all"): DrillStats {
  const out: DrillStats = { total: 0, mastered: 0, learning: 0, fresh: 0 };
  for (const { question } of pool(event, scope)) {
    out.total++;
    const level = state[question.id]?.level;
    if (level === 2) out.mastered++;
    else if (level === 1) out.learning++;
    else out.fresh++;
  }
  return out;
}

/**
 * Вопросы на раунд. Сначала ошибки, которые успели отлежаться (не больше
 * 40% раунда), затем новые по порядку маршрута, затем — что осталось: ещё
 * ошибки, освоенное для проверки (старое вперёд). Пустой список — в области
 * нет вопросов вовсе.
 */
export function nextRound(event: StudyEvent, state: DrillState, scope: Scope, now: number, rng: () => number = Math.random, size = ROUND): QuizQuestion[] {
  const entries = pool(event, scope);
  const card = (e: Entry) => state[e.question.id];
  const byAge = (a: Entry, b: Entry) => card(a)!.at - card(b)!.at;
  const learning = entries.filter((e) => card(e)?.level === 1).sort(byAge);
  const rested = learning.filter((e) => now - card(e)!.at >= REST);
  const mastered = entries.filter((e) => card(e)?.level === 2).sort(byAge);
  const due = mastered.filter((e) => now - card(e)!.at >= REVIEW_AFTER);

  // Новые: части по порядку, внутри части — случайно.
  const parts = new Map<string, Entry[]>();
  for (const e of entries) if (!card(e)) parts.set(`${e.lecture}:${e.part}`, [...(parts.get(`${e.lecture}:${e.part}`) ?? []), e]);
  const fresh = [...parts.values()].flatMap((list) => shuffle(list, rng));

  const out: Entry[] = [];
  const taken = new Set<string>();
  const take = (list: Entry[], limit: number) => {
    for (const e of list) {
      if (out.length >= limit) return;
      if (taken.has(e.question.id)) continue;
      taken.add(e.question.id);
      out.push(e);
    }
  };
  take(rested, Math.ceil(size * 0.4));
  take(fresh, size);
  take(rested, size);
  take(due, size);
  take(learning, size);
  take(mastered, size);
  return shuffle(out, rng).map((e) => present(e.question, e.lecture, rng));
}

/**
 * Куда вернуть ошибку внутри раунда: через RETRY_GAP вопросов после текущего,
 * но не дальше конца. null — раунд и так уже вырос на RETRY_LIMIT.
 */
export function retryAt(index: number, length: number, extra: number): number | null {
  if (extra >= RETRY_LIMIT) return null;
  return Math.min(index + 1 + RETRY_GAP, length);
}

/* ─────────────  Хранение на устройстве  ───────────── */

const key = (userId: string, eventId: string) => `yg-event-drill:${userId}:${eventId}`;

/** Компактная запись: id → [уровень, серия, время в секундах, ошибки]. */
export function encode(state: DrillState): string {
  return JSON.stringify(Object.fromEntries(Object.entries(state).map(([id, c]) => [id, [c.level, c.streak, Math.round(c.at / 1000), c.misses]])));
}

export function decode(raw: string | null): DrillState {
  if (!raw) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const out: DrillState = {};
    for (const [id, v] of Object.entries(parsed as Record<string, unknown>)) {
      if (!Array.isArray(v) || v.length !== 4 || !v.every((n) => Number.isInteger(n) && n >= 0)) continue;
      const [level, streak, at, misses] = v as number[];
      if (level !== 1 && level !== 2) continue;
      out[id] = { level, streak, at: at * 1000, misses };
    }
    return out;
  } catch {
    return {};
  }
}

export function loadDrill(userId: string, eventId: string): DrillState {
  try {
    return decode(localStorage.getItem(key(userId, eventId)));
  } catch {
    return {};
  }
}

export function saveDrill(userId: string, eventId: string, state: DrillState) {
  try {
    localStorage.setItem(key(userId, eventId), encode(state));
  } catch {
    /* хранилище недоступно — прогресс проживёт до закрытия страницы */
  }
}

/** Ответы любого квиза ивента тоже учат: ошибки вернутся в «Учить вопросами», верное — освоено. */
export function learnFromQuiz(userId: string, eventId: string, quiz: QuizQuestion[], answers: number[], now = Date.now()) {
  let state = loadDrill(userId, eventId);
  quiz.forEach((item, i) => {
    state = answer(state, item.id, answers[i] === item.correct, now);
  });
  saveDrill(userId, eventId, state);
}
