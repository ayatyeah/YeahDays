/**
 * Прогресс по ивенту хранится на устройстве, отдельно для каждого аккаунта.
 *
 * Не в базе намеренно: содержимое ивента общее и лежит в коде, а личные
 * результаты квизов — мелкие и некритичные. Таблица под них означала бы
 * миграцию прода ради первого же ивента. Цена — прогресс не переезжает
 * между телефоном и ноутбуком; если это станет мешать, сюда добавится
 * синхронизация, и экраны менять не придётся.
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
