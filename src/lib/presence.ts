/**
 * «В сети» в консоли владельца.
 *
 * Своих отметок не заводим: берём lastTick из учёта активности (см.
 * recordActivity в lib/personalization.ts). Приложение шлёт heartbeat раз в
 * 15 секунд, пока вкладка видна и человек ею пользуется (ввод не старше
 * минуты), — значит, свежий lastTick и есть «сейчас здесь». У кого учёт
 * активности выключен, о том мы ничего не знаем и не придумываем.
 */

/** Сколько после последнего heartbeat человек ещё считается в сети. */
export const ONLINE_MS = 2 * 60_000;

export type PresenceState = "online" | "away" | "unknown";

export interface Presence {
  state: PresenceState;
  /** Последняя отметка активности — только если учёт включён. */
  lastActiveAt: string | null;
}

export function presenceOf(enabled: boolean | null | undefined, lastTick: number | null | undefined, now = Date.now()): Presence {
  if (!enabled || !lastTick || !Number.isFinite(lastTick) || lastTick <= 0) return { state: "unknown", lastActiveAt: null };
  return { state: now - lastTick <= ONLINE_MS ? "online" : "away", lastActiveAt: new Date(lastTick).toISOString() };
}

/**
 * «5 мин назад», «3 ч назад», «вчера», «12.09». Без «был/была»: пол
 * человека по аккаунту не знаем и не угадываем.
 */
export function agoLabel(iso: string, now = Date.now()): string {
  const at = new Date(iso).getTime();
  const minutes = Math.max(1, Math.floor((now - at) / 60_000));
  if (minutes < 60) return `${minutes} мин назад`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ч назад`;
  const day = (t: number) => new Date(t).toLocaleDateString("ru-RU", { timeZone: "Asia/Almaty" });
  if (day(at) === day(now - 24 * 60 * 60_000)) return "вчера";
  return new Date(at).toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", timeZone: "Asia/Almaty" });
}
