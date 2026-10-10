import type { StudyEvent } from "./types";

/**
 * Отметки «прочитано» фаст-мода — на этом устройстве. Отдельно от экрана
 * фаст-мода, чтобы карточка на маршруте ивента не тянула весь экран.
 */
export const fastKey = (userId: string, eventId: string) => `yg-fast:${userId}:${eventId}`;

export function loadFastRead(key: string): string[] {
  try {
    const raw = JSON.parse(localStorage.getItem(key) ?? "[]");
    return Array.isArray(raw) ? raw.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

/** Сколько блоков фаст-мода уже прочитано — для карточки на карте ивента. */
export function fastProgress(userId: string, event: StudyEvent) {
  const ids = new Set(event.fast?.sections.map((s) => s.id) ?? []);
  return loadFastRead(fastKey(userId, event.id)).filter((id) => ids.has(id)).length;
}
