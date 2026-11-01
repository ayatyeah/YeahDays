/** Local cache of event progress, isolated by account. EventScreen syncs this
 * with /api/study-events/[id]; offline changes remain on this device until sync.
 */

import type { Progress } from "./engine";

const key = (userId: string, eventId: string) => `yg-event:${userId}:${eventId}`;

export function loadProgress(userId: string, eventId: string): Progress {
  try {
    const raw = localStorage.getItem(key(userId, eventId));
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? (parsed as Progress) : {};
  } catch {
    // Приватный режим или повреждённая запись — начинаем с чистого листа.
    return {};
  }
}

export function saveProgress(userId: string, eventId: string, progress: Progress) {
  try {
    localStorage.setItem(key(userId, eventId), JSON.stringify(progress));
  } catch {
    /* хранилище недоступно — прогресс живёт до закрытия вкладки */
  }
}

export function clearProgress(userId: string, eventId: string) {
  try {
    localStorage.removeItem(key(userId, eventId));
  } catch {
    /* нечего удалять */
  }
}

/** Мелкие настройки экрана: язык конспекта и музыка. */
export function loadPref(name: string, fallback: string): string {
  try {
    return localStorage.getItem(`yg-event-${name}`) ?? fallback;
  } catch {
    return fallback;
  }
}

export function savePref(name: string, value: string) {
  try {
    localStorage.setItem(`yg-event-${name}`, value);
  } catch {
    /* настройка просто не запомнится */
  }
}
