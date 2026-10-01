/**
 * Сводные показатели для вкладки «Аналитика» в /admin.
 *
 * Только счётчики: ни имён, ни содержимого планов, ни личной истории
 * активности. Добровольный учёт активности (PersonalizationProfile) и
 * история действий (Event) сюда не попадают намеренно — политика обещает,
 * что они нужны только самому человеку. Всё считается из того, что сервис
 * и так хранит для работы: когда создан аккаунт, когда он последний раз
 * синхронизировался, какими разделами пользуется.
 */

import { LEVELS, dayIndex, localDay, plusDays, stats, type Level, type Plan30 } from "./challenge30";

/** Владелец в Алматы — день считаем по его часам, а не по UTC сервера. */
export const OWNER_ZONE = "Asia/Almaty";

/** Сколько событий пришлось на каждый из последних `days` дней (старые слева). */
export function dailyCounts(dates: Date[], days: number, now = new Date()) {
  const today = localDay(OWNER_ZONE, now);
  const buckets = Array.from({ length: days }, (_, i) => ({ day: plusDays(today, i - days + 1), count: 0 }));
  for (const date of dates) {
    const index = days - 1 + dayIndex(today, localDay(OWNER_ZONE, date));
    if (index >= 0 && index < days) buckets[index].count++;
  }
  return buckets;
}

type ChallengeRow = { data: unknown; aiDay: string; aiCount: number };

/**
 * Как пользуются «Челленджем 30» и во что он обходится.
 *
 * Токены и число генераций здесь главные: функция платная, и по этим двум
 * числам видно, не пора ли менять лимит или модель.
 */
export function challengeSummary(rows: ChallengeRow[], now = new Date()) {
  const levels: Record<Level, number> = { easy: 0, medium: 0, hard: 0 };
  const summary = { drafts: 0, running: 0, finished: 0, levels, successDays: 0, hours: 0, tokens: 0, generationsToday: 0 };
  const utcDay = now.toISOString().slice(0, 10);
  for (const row of rows) {
    if (row.aiDay === utcDay) summary.generationsToday += row.aiCount;
    const plan = row.data as Plan30 | null;
    if (!plan) continue;
    try {
      // Строка могла быть записана старой версией формата — одна такая не
      // должна ронять всю сводку.
      const st = stats(plan);
      if (!Object.hasOwn(LEVELS, plan.brief.level)) continue;
      levels[plan.brief.level]++;
      summary.tokens += plan.tokens ?? 0;
      summary.successDays += st.successes;
      summary.hours += st.total / 60;
      if (!plan.startDate) summary.drafts++;
      else if (dayIndex(plan.startDate, localDay(plan.brief.timezone, now)) >= 30) summary.finished++;
      else summary.running++;
    } catch {
      continue;
    }
  }
  summary.hours = Math.round(summary.hours * 10) / 10;
  return summary;
}
