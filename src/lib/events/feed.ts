/**
 * Лента коротких видео по курсу — как TikTok: листаешь вверх, тема за
 * темой, каждая проигрывается сценами с голосом (см. scenes.ts и
 * LectureVideo). Клип — один раздел конспекта: от «## заголовка» до
 * следующего; длинный раздел режется на клипы по CLIP_SCENES сцен, чтобы
 * клип длился около минуты, а не пяти. Между клипами — быстрые вопросы из
 * банка той же части: смотреть — хорошо, а вспомнить сразу после — лучше.
 */

import { present, shuffle, type QuizQuestion } from "./engine";
import { scenes, type Scene } from "./scenes";
import type { StudyEvent, Text } from "./types";

/** Сколько сцен в клипе, не больше. */
export const CLIP_SCENES = 9;
/** Быстрый вопрос — после каждых стольких клипов. */
export const QUIZ_EVERY = 3;

export interface Clip {
  kind: "clip";
  /** «pm-l4-p2#3» — часть и номер клипа в ней; стабилен, пока конспект тот же. */
  id: string;
  lecture: number;
  part: number;
  partId: string;
  heading: Text;
  /** «1/2», если длинный раздел разрезан. */
  piece?: string;
  scenes: Scene[];
}

export interface QuizCard {
  kind: "quiz";
  id: string;
  lecture: number;
  part: number;
  partId: string;
  question: QuizQuestion;
}

export type FeedItem = Clip | QuizCard;

/** Клипы части: разделы конспекта; вводный кусок до первого «##» — под названием части. */
export function partClips(event: StudyEvent, lecture: number, part: number): Clip[] {
  const p = event.lectures[lecture].parts[part];
  const all = scenes(p.notes, p.title).slice(1); // первая сцена — название части, оно в подписи клипа
  const sections: { heading: Text; scenes: Scene[] }[] = [];
  for (const scene of all) {
    if (scene.kind === "title") sections.push({ heading: { en: scene.en, ru: scene.ru }, scenes: [] });
    else {
      if (!sections.length) sections.push({ heading: p.title, scenes: [] });
      sections[sections.length - 1].scenes.push(scene);
    }
  }
  const out: Clip[] = [];
  for (const s of sections) {
    if (!s.scenes.length) continue;
    const pieces = Math.ceil(s.scenes.length / CLIP_SCENES);
    // Режем поровну, чтобы не остался хвост из одной сцены.
    const size = Math.ceil(s.scenes.length / pieces);
    for (let k = 0; k < pieces; k++) {
      out.push({
        kind: "clip",
        id: `${p.id}#${out.length + 1}`,
        lecture,
        part,
        partId: p.id,
        heading: s.heading,
        ...(pieces > 1 ? { piece: `${k + 1}/${pieces}` } : {}),
        scenes: s.scenes.slice(k * size, (k + 1) * size),
      });
    }
  }
  return out;
}

/**
 * Лента: клипы по порядку маршрута, после каждых QUIZ_EVERY клипов — вопрос
 * из банка той части, к которой относится последний клип. Вопросы не
 * повторяются; `avoid` — id вопросов, которые лучше не брать (уже освоенные).
 */
export function buildFeed(event: StudyEvent, rng: () => number = Math.random, avoid: Set<string> = new Set()): FeedItem[] {
  const out: FeedItem[] = [];
  const used = new Set<string>();
  let sinceQuiz = 0;
  event.lectures.forEach((lecture, li) => {
    lecture.parts.forEach((p, pi) => {
      const pool = shuffle(p.questions, rng).sort((a, b) => Number(avoid.has(a.id)) - Number(avoid.has(b.id)));
      for (const clip of partClips(event, li, pi)) {
        out.push(clip);
        if (++sinceQuiz < QUIZ_EVERY) continue;
        const q = pool.find((x) => !used.has(x.id));
        if (!q) continue;
        used.add(q.id);
        sinceQuiz = 0;
        out.push({ kind: "quiz", id: `quiz:${q.id}`, lecture: li, part: pi, partId: p.id, question: present(q, li, rng) });
      }
    });
  });
  return out;
}

/* ─────────────  Где остановился и что сохранил — на устройстве  ───────────── */

const key = (userId: string, eventId: string) => `yg-event-feed:${userId}:${eventId}`;

export interface FeedMemory {
  /** id последнего клипа на экране. */
  at?: string;
  /** Сохранённые клипы (♥). */
  saved: string[];
}

export function loadFeed(userId: string, eventId: string): FeedMemory {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(key(userId, eventId)) ?? "null");
    if (!parsed || typeof parsed !== "object") return { saved: [] };
    const r = parsed as Record<string, unknown>;
    return {
      at: typeof r.at === "string" ? r.at : undefined,
      saved: Array.isArray(r.saved) ? r.saved.filter((x): x is string => typeof x === "string").slice(0, 500) : [],
    };
  } catch {
    return { saved: [] };
  }
}

export function saveFeed(userId: string, eventId: string, memory: FeedMemory) {
  try {
    localStorage.setItem(key(userId, eventId), JSON.stringify(memory));
  } catch {
    /* без хранилища лента начнётся с начала */
  }
}
