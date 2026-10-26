/**
 * Пробный тест: те же вопросы, что в итоговом квизе, но как на настоящем
 * тесте — на время, без объяснений по ходу, итог в баллах курса.
 *
 * Попытка засчитывается и как итоговый квиз (готовность), а лучший и
 * последний результат в баллах хранятся здесь, на устройстве.
 */

import type { ExamFormat } from "./types";

/** Баллы курса за долю верных, с точностью до десятых: 41 из 50 на 18 баллов → 14,8. */
export function examPoints(right: number, total: number, format: ExamFormat): number {
  if (!total) return 0;
  return Math.round((right / total) * format.points * 10) / 10;
}

/** «07:05» — оставшееся время; отрицательное считается нулём. */
export function clock(ms: number): string {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

/** Доли верных: лучшая и последняя попытка. */
export interface SimRecord {
  best: number;
  last: number;
  attempts: number;
}

const key = (userId: string, eventId: string) => `yg-event-exam:${userId}:${eventId}`;

export function loadSim(userId: string, eventId: string): SimRecord | null {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(key(userId, eventId)) ?? "null");
    if (!parsed || typeof parsed !== "object") return null;
    const r = parsed as Record<string, unknown>;
    const share = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 0);
    return { best: share(r.best), last: share(r.last), attempts: typeof r.attempts === "number" ? r.attempts : 1 };
  } catch {
    return null;
  }
}

export function saveSim(userId: string, eventId: string, share: number): SimRecord {
  const previous = loadSim(userId, eventId);
  const next = { best: Math.max(previous?.best ?? 0, share), last: share, attempts: (previous?.attempts ?? 0) + 1 };
  try {
    localStorage.setItem(key(userId, eventId), JSON.stringify(next));
  } catch {
    /* без хранилища результат покажется, но не запомнится */
  }
  return next;
}
