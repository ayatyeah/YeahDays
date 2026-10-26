/**
 * Лента коротких видео по курсу — как TikTok: листаешь вверх, тема за
 * темой, каждая проигрывается сценами с голосом (см. scenes.ts и
 * LectureVideo). Клип — один раздел конспекта: от «## заголовка» до
 * следующего; длинный раздел режется на клипы по CLIP_SCENES сцен, чтобы
 * клип длился около минуты, а не пяти. Между клипами — быстрые вопросы из
 * банка той же части: смотреть — хорошо, а вспомнить сразу после — лучше.
 *
 * После каждого ролика с персонажами — карточка «Проверь себя» на
 * VIDEO_QUESTIONS вопроса именно по его теме: из банка части берутся те, в
 * которых больше всего тех же терминов, что звучали в ролике.
 */

import { present, shuffle, type QuizQuestion } from "./engine";
import { scenes, type Scene } from "./scenes";
import type { ExplainerVideo, StudyEvent, Text } from "./types";

/** Сколько сцен в клипе, не больше. */
export const CLIP_SCENES = 9;
/** Быстрый вопрос — после каждых стольких клипов конспекта. */
export const QUIZ_EVERY = 3;
/** Сколько вопросов в карточке после ролика с персонажами. */
export const VIDEO_QUESTIONS = 2;

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
  /** Один вопрос после клипов, несколько — после ролика. */
  questions: QuizQuestion[];
  /** К какому ролику вопросы («Проверь себя: …»). */
  about?: Text;
}

/** Ролик с персонажами и озвучкой (StudyEvent.videos) — если он есть у части, он вместо клипов конспекта. */
export interface VideoItem {
  kind: "video";
  id: string;
  lecture: number;
  part: number;
  partId: string;
  video: ExplainerVideo;
}

export type FeedItem = Clip | QuizCard | VideoItem;

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

/** Латинские слова (термины) текста — по ним вопрос ищет «свой» ролик. */
const terms = (text: string) => new Set((text.toLowerCase().match(/[a-z][a-z0-9]{1,}/g) ?? []).filter((w) => w.length > 2 || /^(cv|sv|po|sm|ev|pv|ac)$/.test(w)));

/** Всё, что звучит и показывается в ролике, — одним текстом. */
function videoText(video: ExplainerVideo): string {
  return video.lines.map((l) => [l.text, l.show ? JSON.stringify(l.show) : ""].join(" ")).join(" ");
}

/** Сколько терминов ролика встречается в вопросе (формулировка и верный ответ). */
export function relevance(video: ExplainerVideo, question: { q: string; options: string[]; answer: number }): number {
  const mine = terms(videoText(video));
  let score = 0;
  for (const w of terms(`${question.q} ${question.options[question.answer]}`)) if (mine.has(w)) score++;
  return score;
}

/**
 * Лента по порядку маршрута. У части с роликами после каждого ролика —
 * карточка из VIDEO_QUESTIONS самых близких к нему вопросов; у части без
 * роликов — клипы конспекта и после каждых QUIZ_EVERY клипов один вопрос.
 * Вопросы не повторяются; `avoid` — освоенные, их берём в последнюю очередь.
 */
export function buildFeed(event: StudyEvent, rng: () => number = Math.random, avoid: Set<string> = new Set()): FeedItem[] {
  const out: FeedItem[] = [];
  const used = new Set<string>();
  let sinceQuiz = 0;
  event.lectures.forEach((lecture, li) => {
    lecture.parts.forEach((p, pi) => {
      const pool = shuffle(p.questions, rng).sort((a, b) => Number(avoid.has(a.id)) - Number(avoid.has(b.id)));
      const videos = (event.videos ?? []).filter((v) => v.partId === p.id);
      const items: (Clip | VideoItem)[] = videos.length
        ? videos.map((video) => ({ kind: "video" as const, id: video.id, lecture: li, part: pi, partId: p.id, video }))
        : partClips(event, li, pi);
      for (const clip of items) {
        out.push(clip);
        if (clip.kind === "video") {
          const ranked = pool
            .filter((x) => !used.has(x.id))
            .map((x, order) => ({ x, order, score: relevance(clip.video, x) - (avoid.has(x.id) ? 100 : 0) }))
            .sort((a, b) => b.score - a.score || a.order - b.order)
            .slice(0, VIDEO_QUESTIONS)
            .map((r) => r.x);
          if (!ranked.length) continue;
          ranked.forEach((x) => used.add(x.id));
          out.push({ kind: "quiz", id: `check:${clip.id}`, lecture: li, part: pi, partId: p.id, about: clip.video.title, questions: ranked.map((x) => present(x, li, rng)) });
          continue;
        }
        if (++sinceQuiz < QUIZ_EVERY) continue;
        const q = pool.find((x) => !used.has(x.id));
        if (!q) continue;
        used.add(q.id);
        sinceQuiz = 0;
        out.push({ kind: "quiz", id: `quiz:${q.id}`, lecture: li, part: pi, partId: p.id, questions: [present(q, li, rng)] });
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
