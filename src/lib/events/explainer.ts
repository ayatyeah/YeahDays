/**
 * Время в ролике-объяснении: какая реплика звучит и какая картинка на
 * экране в момент t. Чистые функции — их же использует рендер в MP4, где
 * время идёт по кадрам, а не по звуку.
 */

import type { ExplainerVideo, VideoVisual } from "./types";

/** Без озвучки реплика длится по длине текста: ~14,5 символа речи в секунду. */
export const CHARS_PER_SECOND = 14.5;

/** Начало каждой реплики и длительность ролика: из озвучки или оценкой по тексту. */
export function timeline(video: ExplainerVideo): { starts: number[]; duration: number } {
  if (video.audio && video.audio.starts.length === video.lines.length) return { starts: video.audio.starts, duration: video.audio.duration };
  const starts: number[] = [];
  let t = 0.3;
  for (const line of video.lines) {
    starts.push(Math.round(t * 100) / 100);
    t += Math.max(1.8, line.text.length / CHARS_PER_SECOND) + 0.35;
  }
  return { starts, duration: Math.round(t * 100) / 100 };
}

/** Индекс реплики в момент t (до первой — 0). */
export function lineAt(starts: number[], t: number): number {
  let i = 0;
  for (let k = 0; k < starts.length; k++) if (starts[k] <= t + 0.02) i = k;
  return i;
}

/** Картинка на экране для реплики i: её собственная или последняя до неё. */
export function visualAt(video: ExplainerVideo, i: number): { visual: VideoVisual | null; from: number } {
  for (let k = i; k >= 0; k--) if (video.lines[k].show) return { visual: video.lines[k].show!, from: k };
  return { visual: null, from: -1 };
}

/** Последняя поза каждого из двоих к реплике i (кто молчит — стоит как стоял). */
export function posesAt(video: ExplainerVideo, i: number): { A: string; B: string } {
  const first = (who: "A" | "B") => video.lines.find((l) => l.who === who)?.pose ?? "";
  const out = { A: first("A"), B: first("B") };
  for (let k = 0; k <= i; k++) out[video.lines[k].who] = video.lines[k].pose;
  return out;
}

/** Куски реплики: латиница (термины, формулы) отдельно — её подсвечиваем. */
export function termChunks(text: string): { text: string; term: boolean }[] {
  const out: { text: string; term: boolean }[] = [];
  const re = /[A-Za-z][A-Za-z0-9]*(?:[ \-/'’.&+][A-Za-z0-9]+)*/g;
  let last = 0;
  for (const m of text.matchAll(re)) {
    if (m.index! > last) out.push({ text: text.slice(last, m.index), term: false });
    out.push({ text: m[0], term: true });
    last = m.index! + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last), term: false });
  return out;
}
