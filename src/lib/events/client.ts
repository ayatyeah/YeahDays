"use client";

import { useEffect, useState } from "react";
import type { StudyEvent } from "./types";

/**
 * Ивенты для браузера — каждый отдельно и только когда открыт.
 *
 * Раньше экран ивента импортировал весь список (lib/events) — и телефон на
 * каждом ивенте скачивал и разбирал ~6 МБ JS со всеми пятью курсами. Теперь
 * содержимое одного ивента приходит статическим JSON (app/events-data/[id]),
 * собранным при сборке: JSON.parse в разы быстрее разбора того же объёма
 * как JS, а service worker держит файл в кэше — второй заход без сети.
 * В адресе — id сборки: новая сборка не возьмёт старый файл из кэша.
 *
 * Новый ивент — строка здесь и в index.ts (тест сверяет оба списка).
 */
export const EVENT_IDS = ["research-methods-quiz-1", "computer-networks-midterm", "cloud-computing-midterm", "computer-vision-midterm", "yeahtrack-defense"];

const url = (id: string) => `/events-data/${id}?v=${process.env.NEXT_PUBLIC_BUILD_ID ?? "dev"}`;
const LOADERS: Record<string, () => Promise<StudyEvent>> = Object.fromEntries(
  EVENT_IDS.map((id) => [
    id,
    async () => {
      const res = await fetch(url(id));
      // переадресация (например, на вход) — не данные ивента
      if (!res.ok || res.redirected) throw new Error(`event ${id}: ${res.status}`);
      return (await res.json()) as StudyEvent;
    },
  ]),
);

const loaded = new Map<string, StudyEvent>();
const pending = new Map<string, Promise<StudyEvent | undefined>>();

/** Загрузить ивент (повторный вызов не грузит заново). Неизвестный id — undefined. */
export function loadEvent(id: string): Promise<StudyEvent | undefined> {
  const ready = loaded.get(id);
  if (ready) return Promise.resolve(ready);
  const load = LOADERS[id];
  if (!load) return Promise.resolve(undefined);
  let job = pending.get(id);
  if (!job) {
    job = load()
      .then((event) => {
        loaded.set(id, event);
        return event;
      })
      .finally(() => pending.delete(id));
    pending.set(id, job);
  }
  return job;
}

/** Начать загрузку заранее — при наведении или касании ссылки на ивент. */
export function preloadEvent(id: string) {
  void loadEvent(id).catch(() => {});
}

export type EventState = { status: "loading" } | { status: "ready"; event: StudyEvent } | { status: "missing" } | { status: "error" };

/** Ивент для экрана: сразу, если уже загружен, иначе — после чанка. */
export function useEvent(id: string): EventState {
  const [state, setState] = useState<EventState>(() => {
    const ready = loaded.get(id);
    if (ready) return { status: "ready", event: ready };
    return LOADERS[id] ? { status: "loading" } : { status: "missing" };
  });
  useEffect(() => {
    let alive = true;
    const ready = loaded.get(id);
    if (ready) {
      setState({ status: "ready", event: ready });
      return;
    }
    if (!LOADERS[id]) {
      setState({ status: "missing" });
      return;
    }
    setState({ status: "loading" });
    loadEvent(id)
      .then((event) => alive && setState(event ? { status: "ready", event } : { status: "missing" }))
      .catch(() => alive && setState({ status: "error" }));
    return () => {
      alive = false;
    };
  }, [id]);
  return state;
}
