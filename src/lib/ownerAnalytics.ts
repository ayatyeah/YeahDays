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

type UsageRow = { day: string; feature: string; calls: number; inputTokens: number; outputTokens: number };

const FEATURE_NAMES: Record<string, string> = {
  chat: "ИИ-помощник",
  planner: "Планировщик",
  learning: "ИИ-подготовка",
  challenge30: "Челлендж 30",
  grade: "Проверка ответов в ивентах",
};

/**
 * Расход ИИ по функциям за сегодня, 7 и 30 дней.
 *
 * Дни здесь — по UTC, как их пишет счётчик: сдвиг на пять часов для суммы
 * за неделю не важен, зато «сегодня» совпадает с лимитами OpenAI.
 */
export function aiSummary(rows: UsageRow[], now = new Date()) {
  const day = (back: number) => new Date(now.getTime() - back * 86_400_000).toISOString().slice(0, 10);
  const today = day(0);
  const week = day(6);
  const features = [...new Set([...Object.keys(FEATURE_NAMES), ...rows.map((r) => r.feature)])];
  const sum = (list: UsageRow[]) => ({ calls: list.reduce((n, r) => n + r.calls, 0), tokens: list.reduce((n, r) => n + r.inputTokens + r.outputTokens, 0) });
  return features.map((feature) => {
    const mine = rows.filter((r) => r.feature === feature);
    return {
      name: FEATURE_NAMES[feature] ?? feature,
      today: sum(mine.filter((r) => r.day === today)),
      week: sum(mine.filter((r) => r.day >= week)),
      month: sum(mine),
    };
  });
}

type ActivityProfile = { enabled?: boolean; days?: Record<string, { seconds?: number; visits?: number; tasks?: number; actions?: number; quests?: number; sections?: Record<string, number> }> };

const ACTIVITY_SECTIONS: Record<string, string> = {
  today: "Сегодня", calendar: "Календарь", account: "Профиль", progress: "Прогресс", learn: "Учёба", shop: "Магазин",
  settings: "Настройки", community: "Сообщество", chat: "ИИ-помощник", personalization: "Мой ритм", other: "Прочее",
};

const shiftDay = (day: string, n: number) => new Date(Date.parse(`${day}T12:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);

/**
 * Активность и удержание — по тем, кто разрешил учёт активности.
 *
 * Считается только по аккаунтам с включённым учётом, поэтому это выборка, а
 * не все пользователи: рядом всегда показывается, сколько аккаунтов в неё
 * входит. Наружу идут суммы и доли, ни одна строка не относится к человеку.
 *
 * Удержание отсчитывается от первого активного дня аккаунта в этих данных,
 * а не от регистрации: у давних пользователей учёт включился позже, и от
 * даты регистрации они выглядели бы «потерянными».
 */
export function activitySummary(profiles: ActivityProfile[], days: number, now = new Date()) {
  const tracked = profiles.filter((p) => p?.enabled && p.days && typeof p.days === "object");
  const today = localDay(OWNER_ZONE, now);
  const range = Array.from({ length: days }, (_, i) => shiftDay(today, i - days + 1));
  const first = range[0];

  const daily = range.map((day) => {
    let active = 0;
    let seconds = 0;
    for (const p of tracked) {
      const d = p.days![day];
      if (d && (d.seconds ?? 0) > 0) { active++; seconds += d.seconds ?? 0; }
    }
    return { day, active, minutes: Math.round(seconds / 60) };
  });

  const sections = new Map<string, number>();
  const done = { tasks: 0, actions: 0, quests: 0 };
  let sessions = 0;
  for (const p of tracked) {
    for (const [day, d] of Object.entries(p.days!)) {
      if (day < first || day > today) continue;
      for (const [key, seconds] of Object.entries(d.sections ?? {})) sections.set(key, (sections.get(key) ?? 0) + (Number(seconds) || 0));
      done.tasks += d.tasks ?? 0; done.actions += d.actions ?? 0; done.quests += d.quests ?? 0;
      sessions += d.visits ?? 0;
    }
  }
  const totalSeconds = [...sections.values()].reduce((a, b) => a + b, 0);
  const userDays = daily.reduce((n, d) => n + d.active, 0);

  const retention = [
    { name: "На следующий день", from: 1, to: 1 },
    { name: "В первую неделю", from: 1, to: 7 },
    { name: "Со 2-й по 4-ю неделю", from: 8, to: 30 },
  ].map(({ name, from, to }) => {
    let eligible = 0;
    let returned = 0;
    for (const p of tracked) {
      const active = Object.entries(p.days!).filter(([, d]) => (d.seconds ?? 0) > 0).map(([day]) => day).sort();
      if (!active.length) continue;
      const start = active[0];
      // Окно должно целиком закончиться — иначе «не вернулся» значило бы «ещё не успел».
      if (shiftDay(start, to) > today) continue;
      eligible++;
      if (active.some((day) => day >= shiftDay(start, from) && day <= shiftDay(start, to))) returned++;
    }
    return { name, eligible, returned, percent: eligible ? Math.round((returned / eligible) * 100) : 0 };
  });

  return {
    tracked: tracked.length,
    daily,
    activeWeek: tracked.filter((p) => range.slice(-7).some((day) => (p.days![day]?.seconds ?? 0) > 0)).length,
    activeMonth: tracked.filter((p) => range.some((day) => (p.days![day]?.seconds ?? 0) > 0)).length,
    minutesPerActiveDay: userDays ? Math.round(daily.reduce((n, d) => n + d.minutes, 0) / userDays) : 0,
    sessions,
    done,
    sections: [...sections.entries()].sort((a, b) => b[1] - a[1]).map(([key, seconds]) => ({ name: ACTIVITY_SECTIONS[key] ?? key, minutes: Math.round(seconds / 60), percent: totalSeconds ? Math.round((seconds / totalSeconds) * 100) : 0 })),
    retention,
  };
}

/** Воронка: сколько аккаунтов дошло до каждого шага. Доля — от числа зарегистрированных. */
export function funnel(steps: { name: string; count: number }[]) {
  const total = steps[0]?.count ?? 0;
  return steps.map((s, i) => ({ ...s, percent: total ? Math.round((s.count / total) * 100) : 0, // null — сравнивать не с чем: шаг первый или на предыдущем никого не было.
    fromPrevious: i > 0 && steps[i - 1].count > 0 ? Math.round((s.count / steps[i - 1].count) * 100) : null }));
}
