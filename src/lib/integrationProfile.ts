/**
 * Сводка аккаунта для внешнего ассистента (/api/integrations/profile):
 * чистые функции поверх UserState.data и JSON-полей Challenge30 /
 * LearningProfile, чтобы их можно было тестировать без БД.
 *
 * Отдаём выжимку, а не сырые данные: ассистенту нужен смысл (что впереди,
 * как идёт челлендж, какие цели), а не внутренние поля стора.
 */

import { CATEGORIES, type CategoryKey, type StatKey } from "@/lib/domain";
import { isTodoDone, isTodoOnDay, type StateShape, type Todo } from "@/lib/externalState";
import { prevDay } from "@/lib/integrationProgress";
import { dayIndex, LEVELS, stats as plan30Stats, type Plan30 } from "@/lib/challenge30";
import type { LearningState } from "@/lib/learning";

/** Ключ дня через n суток (UTC-арифметика по ключу, без часовых поясов). */
export function plusDay(day: string, n: number): string {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/** Последние n дней, начиная с today (включительно), от новых к старым. */
function lastDays(today: string, n: number): string[] {
  const days = [today];
  while (days.length < n) days.push(prevDay(days.at(-1)!));
  return days;
}

/** Невыполненные задачи на ближайшие days дней (с завтрашнего): разовые, из LMS и повторы. */
export function upcomingTodos(todos: Todo[], today: string, days = 7, limit = 40) {
  const out: { id: string; title: string; date: string; hour: number | null; minute: number | null; priority: Todo["priority"]; repeat: string | null; source: string | null }[] = [];
  for (let i = 1; i <= days; i++) {
    const day = plusDay(today, i);
    for (const t of todos) {
      if (!isTodoOnDay(t, day) || isTodoDone(t, day)) continue;
      out.push({ id: t.id, title: t.title, date: day, hour: t.hour ?? null, minute: t.minute ?? null, priority: t.priority, repeat: t.repeat?.kind ?? null, source: t.source ?? null });
    }
  }
  return out.slice(0, limit);
}

/** Почасовой план (state.schedule: день → час → что делаю) на указанные дни. */
export function hourlySchedule(state: StateShape, days: string[]) {
  const schedule = (state.schedule ?? {}) as Record<string, Record<string, string>>;
  return days
    .map((date) => ({
      date,
      hours: Object.entries(schedule[date] ?? {})
        .filter(([, what]) => typeof what === "string" && what.trim())
        .map(([hour, what]) => ({ hour: Number(hour), what }))
        .sort((a, b) => a.hour - b.hour),
    }))
    .filter((d) => d.hours.length);
}

/** Чек-ины (энергия, свободные минуты) и итоги дня (оценка 1–5, заметка) за последние n дней. */
export function recentDays(state: StateShape, today: string, n = 14) {
  const moods = (state.moods ?? {}) as Record<string, { energy: string; minutes: number }>;
  const retros = (state.retros ?? {}) as Record<string, { score: number; note?: string }>;
  return lastDays(today, n)
    .map((date) => ({
      date,
      energy: moods[date]?.energy ?? null,
      freeMinutes: moods[date]?.minutes ?? null,
      dayScore: retros[date]?.score ?? null,
      note: retros[date]?.note ?? null,
    }))
    .filter((d) => d.energy || d.dayScore);
}

type Quest = { id: string; title: string; stat: StatKey; target: number; deadline: string; createdAt: number };

/** Активные цели («закрыть N действий в стате до даты»); прогресс — из закрытых действий плана, как в сторе. */
export function activeQuests(state: StateShape, today: string) {
  const quests = (Array.isArray(state.quests) ? state.quests : []) as Quest[];
  const plan = state.plan ?? [];
  return quests
    .filter((q) => q.deadline >= today)
    .map((q) => ({
      title: q.title,
      stat: q.stat,
      target: q.target,
      deadline: q.deadline,
      done: plan.filter(
        (t) =>
          t.completed &&
          (t.completedAt ?? 0) >= q.createdAt &&
          CATEGORIES[t.snapshot.category as CategoryKey]?.stat === q.stat,
      ).length,
    }));
}

type Habit = { title: string; unit: string; stat: StatKey; yellow: number; green: number; days: number; startDate: string; log: Record<string, number> };

/** Привычки-челленджи («50 отжиманий в день 30 дней»): день, сегодня, последние 7 дней. */
export function habitChallenges(state: StateShape, today: string) {
  const list = (Array.isArray(state.challenges) ? state.challenges : []) as Habit[];
  return list
    .map((c) => {
      const day = dayIndex(c.startDate, today) + 1;
      const week = lastDays(today, 7).map((d) => c.log?.[d] ?? 0);
      return {
        title: c.title,
        unit: c.unit,
        stat: c.stat,
        day,
        days: c.days,
        finished: day > c.days,
        today: c.log?.[today] ?? 0,
        green: c.green,
        yellow: c.yellow,
        last7: week,
        greenDays: Object.values(c.log ?? {}).filter((n) => n >= c.green).length,
      };
    })
    .filter((c) => c.day >= 1);
}

/** Челлендж 30 дней: день, сколько дней выполнено, активности и последнее ревью коуча. */
export function challenge30Summary(plan: Plan30 | null, today: string) {
  if (!plan?.startDate) return null;
  const day = dayIndex(plan.startDate, today);
  const s = plan30Stats(plan);
  return {
    title: plan.recipe.title,
    level: plan.brief.level,
    targetMinutesPerDay: LEVELS[plan.brief.level].minutes,
    day: day + 1,
    finished: day > 29,
    todayMinutes: day >= 0 && day < 30 ? s.days[day] : null,
    successDays: s.successes,
    bestRun: s.streak,
    totalMinutes: s.total,
    activities: s.activities.map((a) => ({ title: a.title, kind: a.kind, plannedMinutes: a.planned, doneMinutes: a.done })),
    coachNote: plan.review?.summary ?? null,
  };
}

/** Навыки из раздела обучения: цель и сколько квестов пройдено, плюс следующий. */
export function learningSummary(state: LearningState | null) {
  if (!state || !Array.isArray(state.skills)) return null;
  return {
    xp: state.xp ?? 0,
    skills: state.skills.map((s) => {
      const quests = Array.isArray(s.quests) ? s.quests : [];
      return {
        title: s.title,
        goal: s.goal,
        subject: s.subject?.name ?? null,
        questsDone: quests.filter((q) => q.completed).length,
        questsTotal: quests.length,
        next: quests.find((q) => !q.completed)?.title ?? null,
      };
    }),
  };
}
