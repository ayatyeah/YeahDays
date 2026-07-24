/**
 * Персональные длительности действий.
 *
 * В пуле длительность проставлена на глазок: «Прочитать 10 страниц — 15 минут».
 * У кого-то это 8 минут, у кого-то 25. Пока движок верит числу из пула, бюджет
 * («у меня 30 минут») меряется чужими минутами.
 *
 * Мы уже записываем `durationMs` каждой закрытой задачи. Здесь это превращается
 * в поправку к оценке пула.
 *
 * ГЛАВНАЯ ОГОВОРКА. Замер идёт от «беру» до «сделал», а не от начала работы.
 * Человек взял задачу в 9 утра, сделал в 20:00 — замер 11 часов, хотя чтение
 * заняло 15 минут. Отличить «долго делал» от «начал поздно» мы не можем, и
 * никакая статистика этого не исправит. Поэтому:
 *
 *   1. отбрасываем замеры вне правдоподобного коридора вокруг оценки пула —
 *      они почти наверняка означают «отложил», а не «столько занимает»;
 *   2. берём медиану, а не среднее: один пропущенный замер не должен
 *      перекашивать оценку;
 *   3. усаживаем результат к пулу тем сильнее, чем меньше замеров.
 *
 * Итог: оценка сдвигается к правде постепенно и никогда не улетает в абсурд.
 */

/** Сколько последних замеров храним на действие. */
export const SAMPLE_CAP = 12;

/**
 * Сила усадки к оценке пула. Вес замеров = n / (n + K).
 * При K = 3: один замер весит 25%, три — 50%, девять — 75%.
 * Выбрано так, чтобы одна случайная задержка не переписала оценку,
 * но человек, стабильно делающий быстрее, увидел эффект за неделю.
 */
export const SHRINK_K = 3;

/** Замеры за пределами этого коридора вокруг оценки пула считаем мусором. */
const MIN_RATIO = 0.15;
const MAX_RATIO = 6;

/** Абсолютные границы: меньше — промах по кнопке, больше — забыл нажать. */
const MIN_MINUTES = 0.5;
const MAX_MINUTES = 240;

/**
 * Правдоподобен ли замер как оценка длительности.
 *
 * Экспортируется, потому что это и есть содержательное решение модуля —
 * его нужно проверять тестами напрямую, а не только через результат.
 */
export function isPlausible(minutes: number, poolMinutes: number): boolean {
  if (!Number.isFinite(minutes)) return false;
  if (minutes < MIN_MINUTES || minutes > MAX_MINUTES) return false;
  const ratio = minutes / Math.max(poolMinutes, 1);
  return ratio >= MIN_RATIO && ratio <= MAX_RATIO;
}

/** Добавить замер, сохранив только последние SAMPLE_CAP. */
export function addSample(samples: number[] | undefined, ms: number): number[] {
  const minutes = ms / 60_000;
  const next = [...(samples ?? []), minutes];
  return next.slice(-SAMPLE_CAP);
}

function median(xs: number[]): number {
  const s = [...xs].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

/**
 * Личная оценка длительности действия в минутах.
 *
 * Без правдоподобных замеров возвращает оценку пула — движок работает
 * ровно как раньше, поэтому фича безопасна для новых пользователей.
 */
export function personalDuration(
  poolMinutes: number,
  samples: number[] | undefined,
): number {
  const good = (samples ?? []).filter((m) => isPlausible(m, poolMinutes));
  if (good.length === 0) return poolMinutes;

  const weight = good.length / (good.length + SHRINK_K);
  const blended = poolMinutes * (1 - weight) + median(good) * weight;

  // округляем до минуты: дробные значения в интерфейсе выглядят как шум
  return Math.max(1, Math.round(blended));
}

/**
 * Насколько личная оценка разошлась с пулом — для интерфейса.
 * Возвращает null, пока расхождение не стало заметным (< 20%),
 * чтобы не показывать человеку «15 → 16 минут».
 */
export function durationInsight(
  poolMinutes: number,
  samples: number[] | undefined,
): { personal: number; faster: boolean } | null {
  const personal = personalDuration(poolMinutes, samples);
  const diff = Math.abs(personal - poolMinutes) / Math.max(poolMinutes, 1);
  if (diff < 0.2) return null;
  return { personal, faster: personal < poolMinutes };
}
