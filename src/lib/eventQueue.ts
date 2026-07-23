/**
 * Офлайн-очередь событий.
 *
 * Раньше при потере сети сигнал движку (свайп/выполнение) просто исчезал:
 * fetch падал, ошибка глоталась. Для PWA, которая обещает работу офлайн,
 * это тихая потеря обучающих данных.
 *
 * Теперь событие сначала кладётся в очередь в localStorage, а потом
 * выгружается пачкой: сразу, при возврате сети, при возврате на вкладку
 * и перед закрытием страницы. Пока не подтверждено сервером — не удаляется.
 */

import type { TrackedEvent } from "./api";

const KEY = "yd-event-queue";
/** Больше не храним: очередь — буфер на офлайн, а не вечный журнал. */
const MAX_QUEUE = 500;

export interface QueuedEvent extends TrackedEvent {
  /** локальный id, чтобы удалить ровно отправленное */
  qid: string;
}

function readQueue(): QueuedEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeQueue(q: QueuedEvent[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(q.slice(-MAX_QUEUE)));
  } catch {
    // квота переполнена — очередь не критичнее самого прогресса
  }
}

export function queueSize(): number {
  return readQueue().length;
}

/** Положить событие в очередь. */
export function enqueue(event: TrackedEvent): QueuedEvent {
  const qid = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const item: QueuedEvent = { ...event, qid };
  writeQueue([...readQueue(), item]);
  return item;
}

let flushing = false;

/**
 * Выгрузить очередь на сервер одной пачкой.
 * Удаляем только то, что сервер реально принял.
 */
export async function flushQueue(
  send: (events: TrackedEvent[]) => Promise<boolean>,
): Promise<number> {
  if (flushing) return 0;
  const batch = readQueue();
  if (batch.length === 0) return 0;

  flushing = true;
  try {
    const ok = await send(batch.map(({ qid: _qid, ...e }) => e));
    if (!ok) return 0;
    // за время отправки могли добавиться новые — вычитаем только отправленные
    const sent = new Set(batch.map((e) => e.qid));
    writeQueue(readQueue().filter((e) => !sent.has(e.qid)));
    return batch.length;
  } catch {
    return 0; // остаёмся в очереди до следующей попытки
  } finally {
    flushing = false;
  }
}
