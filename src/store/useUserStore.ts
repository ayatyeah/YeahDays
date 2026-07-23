"use client";

import { useEffect, useMemo, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  CATEGORIES,
  DEFAULT_GOALS,
  DEFAULT_MOOD,
  dateKey,
  xpForAction,
  type Action,
  type CategoryKey,
  type DailyMood,
  type GoalWeights,
  type StatKey,
} from "@/lib/domain";
import { emptyHistory, type HistorySignals } from "@/lib/recommendation";
import { levelForXp } from "@/lib/leveling";

/* ────────────────────────  Типы  ──────────────────────── */

/** Действие, принятое пользователем в план дня. */
export interface PlannedTask {
  /** уникальный id принятия (одно действие можно брать в разные дни) */
  id: string;
  actionId: string;
  /** снимок действия — план не ломается, если пул изменится */
  snapshot: Action;
  xp: number;
  date: string; // YYYY-MM-DD
  completed: boolean;
  acceptedAt: number;
  completedAt: number | null;
}

export type Stats = Record<StatKey, number>;

/** Сколько задач в день считается «днём выполненным». */
export const DAILY_GOAL = 3;

/* ────────────────────────  Заморозка стрика  ──────────────────────── */

/**
 * Один пропущенный день не должен обнулять месяц работы — иначе человек
 * решает «всё равно уже сломал» и уходит навсегда. Заморозка закрывает
 * пропуск автоматически, если стрик реально был.
 */
export const FREEZES_PER_MONTH = 2;

export interface FreezeState {
  /** сколько заморозок осталось в этом месяце */
  left: number;
  /** дни (YYYY-MM-DD), закрытые заморозкой */
  days: string[];
  /** месяц последнего пополнения, YYYY-MM */
  refilled: string;
}

export function monthKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/* ────────────────────────  Цели с горизонтом  ──────────────────────── */

/**
 * Цель — это не «приоритет стата», а конкретное обещание себе с датой:
 * «20 действий на силу до 1 сентября». Приоритеты говорят движку, что
 * тебе интересно; цель говорит, к чему ты идёшь и сколько осталось.
 */
export interface Quest {
  id: string;
  title: string;
  stat: StatKey;
  /** сколько действий нужно закрыть */
  target: number;
  /** дедлайн, YYYY-MM-DD */
  deadline: string;
  /** с какого момента считаем прогресс */
  createdAt: number;
}

/** Итог дня — короткая рефлексия, которая заодно кормит движок. */
export interface DayRetro {
  /** 1..5 — как прошёл день */
  score: number;
  note?: string;
}

/**
 * Прогресс цели считается ИЗ плана, а не хранится отдельным счётчиком:
 * так он не разъедется с реальностью при отмене выполнения или синхронизации.
 */
export function questProgress(q: Quest, plan: PlannedTask[]): number {
  return plan.filter(
    (t) =>
      t.completed &&
      CATEGORIES[t.snapshot.category].stat === q.stat &&
      (t.completedAt ?? t.acceptedAt) >= q.createdAt,
  ).length;
}

/** Сколько дней осталось до дедлайна (0 — сегодня последний). */
export function daysLeft(deadline: string, today = dateKey()): number {
  const a = new Date(`${today}T00:00:00`);
  const b = new Date(`${deadline}T00:00:00`);
  return Math.round((b.getTime() - a.getTime()) / 864e5);
}

export function isQuestDone(q: Quest, plan: PlannedTask[]): boolean {
  return questProgress(q, plan) >= q.target;
}

/**
 * Приоритеты с учётом активных целей.
 *
 * Цель без влияния на колоду — просто счётчик. Здесь она поднимает вес
 * своего стата, причём тем сильнее, чем ближе дедлайн и чем больше
 * отставание: за три дня до срока с половиной невыполненного движок
 * начнёт настойчиво подкидывать нужное.
 */
export function effectiveGoals(
  goals: GoalWeights,
  quests: Quest[],
  plan: PlannedTask[],
  today = dateKey(),
): GoalWeights {
  const out = { ...goals };
  for (const q of quests) {
    const left = daysLeft(q.deadline, today);
    if (left < 0) continue; // просрочена — не давим
    const remaining = q.target - questProgress(q, plan);
    if (remaining <= 0) continue; // уже выполнена

    // сколько действий в день нужно, чтобы успеть
    const pace = remaining / Math.max(left + 1, 1);
    const pressure = Math.min(1, pace);

    // Интерполируем в ОСТАВШИЙСЯ запас, а не прибавляем фиксированную
    // величину: иначе при высоком базовом приоритете любая цель упирается
    // в потолок и срочная перестаёт отличаться от несрочной.
    const base = out[q.stat] ?? 0.5;
    out[q.stat] = base + (1 - base) * (0.3 + 0.7 * pressure);
  }
  return out;
}

interface UserState {
  name: string;
  createdAt: number;
  plan: PlannedTask[];
  customActions: Action[];
  goals: GoalWeights;
  moods: Record<string, DailyMood>;
  history: HistorySignals;
  seenLevel: number;
  lastCheckIn: string | null;
  /** прошёл ли первый запуск (онбординг) */
  onboarded: boolean;
  /** последний день, за закрытие которого показали празднование */
  lastCelebratedDay: string | null;
  /** время последнего изменения (мс) — для кросс-девайс синхронизации (LWW) */
  updatedAt: number;
  /** заморозки стрика */
  freezes: FreezeState;
  /** цели с дедлайном */
  quests: Quest[];
  /** итоги дней: ключ — YYYY-MM-DD */
  retros: Record<string, DayRetro>;

  setName: (name: string) => void;
  setGoal: (stat: StatKey, value: number) => void;
  setMood: (mood: Partial<DailyMood>) => void;
  completeCheckIn: () => void;
  completeOnboarding: () => void;
  markDayCelebrated: (day: string) => void;
  acceptAction: (action: Action, date?: string) => void;
  rejectAction: (actionId: string) => void;
  markSeen: (actionIds: string[]) => void;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;
  addCustomAction: (action: Action) => void;
  markSeenLevel: (level: number) => void;
  resetAll: () => void;
  /** пополнить заморозки, если начался новый месяц */
  refillFreezes: () => void;
  /** потратить заморозку на конкретный день */
  spendFreeze: (day: string) => void;
  addQuest: (q: Omit<Quest, "id" | "createdAt">) => void;
  removeQuest: (id: string) => void;
  setRetro: (day: string, retro: DayRetro) => void;
  /** заменить локальное состояние снимком с сервера (без bump updatedAt) */
  hydrateFromRemote: (data: SyncData) => void;
}

/** Persist-слой, который синхронизируется с сервером (== partialize). */
export interface SyncData {
  name: string;
  createdAt: number;
  plan: PlannedTask[];
  customActions: Action[];
  goals: GoalWeights;
  moods: Record<string, DailyMood>;
  history: HistorySignals;
  seenLevel: number;
  lastCheckIn: string | null;
  onboarded: boolean;
  lastCelebratedDay: string | null;
  updatedAt: number;
  freezes: FreezeState;
  quests: Quest[];
  retros: Record<string, DayRetro>;
}

/** Вытащить синхронизируемый снимок из состояния (источник правды для partialize). */
export function pickSync(s: SyncData): SyncData {
  return {
    freezes: s.freezes,
    quests: s.quests,
    retros: s.retros,
    name: s.name,
    createdAt: s.createdAt,
    plan: s.plan,
    customActions: s.customActions,
    goals: s.goals,
    moods: s.moods,
    history: s.history,
    seenLevel: s.seenLevel,
    lastCheckIn: s.lastCheckIn,
    onboarded: s.onboarded,
    lastCelebratedDay: s.lastCelebratedDay,
    updatedAt: s.updatedAt,
  };
}

function makeId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

const initial = {
  name: "Странник",
  createdAt: Date.now(),
  plan: [] as PlannedTask[],
  customActions: [] as Action[],
  goals: { ...DEFAULT_GOALS },
  moods: {} as Record<string, DailyMood>,
  history: emptyHistory(),
  seenLevel: 1,
  lastCheckIn: null as string | null,
  onboarded: false,
  lastCelebratedDay: null as string | null,
  // 0 намеренно: нетронутый/пустой стор всегда проигрывает LWW серверу,
  // чтобы пустое устройство не затёрло реальный прогресс аккаунта.
  // Первое же действие поднимет метку до Date.now() (см. touch).
  updatedAt: 0,
  freezes: {
    left: FREEZES_PER_MONTH,
    days: [] as string[],
    refilled: monthKey(),
  } as FreezeState,
  quests: [] as Quest[],
  retros: {} as Record<string, DayRetro>,
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => {
      /**
       * Любая мутация состояния поднимает updatedAt — это метка «последнего
       * изменения», по которой сервер разрешает конфликты между устройствами.
       * Гидратация из localStorage/сервера идёт мимо touch и метку не сбивает.
       */
      const touch = (
        m:
          | Partial<UserState>
          | ((s: UserState) => Partial<UserState>),
      ) =>
        set((s) => {
          const patch = typeof m === "function" ? m(s) : m;
          // пустой патч — это но-оп; метку не двигаем, иначе каждое
          // открытие приложения гнало бы лишнюю синхронизацию
          if (Object.keys(patch).length === 0) return {};
          return { ...patch, updatedAt: Date.now() };
        });

      return {
      ...initial,

      setName: (name) => touch({ name: name.trim() || "Странник" }),

      setGoal: (stat, value) =>
        touch((s) => ({
          goals: { ...s.goals, [stat]: Math.min(1, Math.max(0, value)) },
        })),

      setMood: (mood) =>
        touch((s) => {
          const k = dateKey();
          const prev = s.moods[k] ?? DEFAULT_MOOD;
          return { moods: { ...s.moods, [k]: { ...prev, ...mood } } };
        }),

      completeCheckIn: () => touch({ lastCheckIn: dateKey() }),

      completeOnboarding: () => touch({ onboarded: true }),

      markDayCelebrated: (day) => touch({ lastCelebratedDay: day }),

      /** Свайп вправо: действие уходит в план дня. */
      acceptAction: (action, date) =>
        touch((s) => {
          const d = date ?? dateKey();
          const cat = action.category;
          const cc = s.history.categoryCompletion[cat] ?? { taken: 0, done: 0 };
          return {
            plan: [
              {
                id: makeId(),
                actionId: action.id,
                snapshot: action,
                xp: xpForAction(action),
                date: d,
                completed: false,
                acceptedAt: Date.now(),
                completedAt: null,
              },
              ...s.plan,
            ],
            history: {
              ...s.history,
              accepted: {
                ...s.history.accepted,
                [action.id]: (s.history.accepted[action.id] ?? 0) + 1,
              },
              lastSeen: { ...s.history.lastSeen, [action.id]: Date.now() },
              categoryCompletion: {
                ...s.history.categoryCompletion,
                [cat]: { taken: cc.taken + 1, done: cc.done },
              },
            },
          };
        }),

      /** Свайп влево: «не сейчас» — движок понижает вес. */
      rejectAction: (actionId) =>
        touch((s) => ({
          history: {
            ...s.history,
            rejected: {
              ...s.history.rejected,
              [actionId]: (s.history.rejected[actionId] ?? 0) + 1,
            },
            lastSeen: { ...s.history.lastSeen, [actionId]: Date.now() },
          },
        })),

      markSeen: (actionIds) =>
        touch((s) => {
          const now = Date.now();
          const lastSeen = { ...s.history.lastSeen };
          for (const id of actionIds) lastSeen[id] = now;
          return { history: { ...s.history, lastSeen } };
        }),

      toggleTask: (id) =>
        touch((s) => {
          const task = s.plan.find((t) => t.id === id);
          if (!task) return {};
          const willComplete = !task.completed;
          const cat = task.snapshot.category;
          const stat = CATEGORIES[cat].stat;
          const cc = s.history.categoryCompletion[cat] ?? { taken: 1, done: 0 };
          const delta = willComplete ? 1 : -1;

          return {
            plan: s.plan.map((t) =>
              t.id === id
                ? {
                    ...t,
                    completed: willComplete,
                    completedAt: willComplete ? Date.now() : null,
                  }
                : t,
            ),
            history: {
              ...s.history,
              completed: {
                ...s.history.completed,
                [task.actionId]: Math.max(
                  0,
                  (s.history.completed[task.actionId] ?? 0) + delta,
                ),
              },
              statXp: {
                ...s.history.statXp,
                [stat]: Math.max(0, s.history.statXp[stat] + delta * task.xp),
              },
              categoryCompletion: {
                ...s.history.categoryCompletion,
                [cat]: {
                  taken: Math.max(cc.taken, 1),
                  done: Math.max(0, cc.done + delta),
                },
              },
            },
          };
        }),

      removeTask: (id) =>
        touch((s) => ({ plan: s.plan.filter((t) => t.id !== id) })),

      addCustomAction: (action) =>
        touch((s) => ({ customActions: [action, ...s.customActions] })),

      markSeenLevel: (level) => touch({ seenLevel: level }),

      // Сброс — «начать заново», но онбординг проходить второй раз не заставляем.
      resetAll: () =>
        touch({ ...initial, createdAt: Date.now(), onboarded: true }),

      // Пополняем раз в календарный месяц. Историю использованных дней
      // не чистим — по ней считается стрик за прошлое.
      refillFreezes: () =>
        touch((s) => {
          const m = monthKey();
          if (s.freezes.refilled === m) return {};
          return {
            freezes: { ...s.freezes, left: FREEZES_PER_MONTH, refilled: m },
          };
        }),

      spendFreeze: (day) =>
        touch((s) => {
          if (s.freezes.left <= 0 || s.freezes.days.includes(day)) return {};
          return {
            freezes: {
              ...s.freezes,
              left: s.freezes.left - 1,
              days: [...s.freezes.days, day],
            },
          };
        }),

      addQuest: (q) =>
        touch((s) => ({
          quests: [
            ...s.quests,
            { ...q, id: makeId(), createdAt: Date.now() } as Quest,
          ],
        })),

      removeQuest: (id) =>
        touch((s) => ({ quests: s.quests.filter((q) => q.id !== id) })),

      setRetro: (day, retro) =>
        touch((s) => ({ retros: { ...s.retros, [day]: retro } })),

      // Приходит с сервера — ставим как есть, updatedAt берём серверный,
      // чтобы не выглядеть «свежее» и не затереть источник на следующем пуше.
      hydrateFromRemote: (data) => set(() => ({ ...pickSync(data) })),
      };
    },
    {
      name: "yeahdays-store",
      version: 7,
      /** Миграция со старых схем — данные не теряем. */
      migrate: (state, version) => {
        const old = (state ?? {}) as Record<string, unknown>;
        // updatedAt появился в v5, freezes — в v6, quests/retros — в v7.
        const withTs = (st: Record<string, unknown>): UserState => {
          const f = st.freezes as Partial<FreezeState> | undefined;
          return {
            ...st,
            quests: Array.isArray(st.quests) ? st.quests : [],
            retros:
              st.retros && typeof st.retros === "object" ? st.retros : {},
            updatedAt:
              typeof st.updatedAt === "number"
                ? st.updatedAt
                : typeof st.createdAt === "number"
                  ? st.createdAt
                  : Date.now(),
            freezes: {
              left: typeof f?.left === "number" ? f.left : FREEZES_PER_MONTH,
              days: Array.isArray(f?.days) ? f.days : [],
              refilled: typeof f?.refilled === "string" ? f.refilled : monthKey(),
            },
          } as unknown as UserState;
        };

        if (version >= 7) return withTs(old);
        // v3/v4 (текущая схема plan[]) — добавляем недостающие поля.
        // Пользователь v3 уже в продукте → онбординг не показываем.
        if (version >= 3) {
          return withTs({
            ...old,
            onboarded: version >= 4 ? old.onboarded : true,
            lastCelebratedDay:
              typeof old.lastCelebratedDay === "string"
                ? old.lastCelebratedDay
                : null,
          });
        }
        // version < 3: старая схема tasks[] + 3 стата.
        const migrated: Record<string, unknown> = {
          ...initial,
          onboarded: true,
          name: typeof old.name === "string" ? old.name : initial.name,
          createdAt:
            typeof old.createdAt === "number" ? old.createdAt : Date.now(),
        };
        const oldTasks = Array.isArray(old.tasks) ? old.tasks : [];
        const CAT_MAP: Record<string, CategoryKey> = {
          body: "fitness",
          mind: "learning",
          discipline: "discipline",
        };
        migrated.plan = oldTasks.slice(0, 200).map((t) => {
          const o = t as Record<string, unknown>;
          const cat = CAT_MAP[String(o.category)] ?? "discipline";
          const snapshot: Action = {
            id: `legacy-${String(o.id)}`,
            title: String(o.title ?? "Задача"),
            why: "Перенесено из прошлой версии",
            category: cat,
            difficulty: 2,
            duration: 20,
            energy: "medium",
            timePreference: "any",
            impact: 3,
            custom: true,
          };
          return {
            id: String(o.id ?? makeId()),
            actionId: snapshot.id,
            snapshot,
            xp: typeof o.xp === "number" ? o.xp : 25,
            date: typeof o.dueDate === "string" ? o.dueDate : dateKey(),
            completed: Boolean(o.completed),
            acceptedAt:
              typeof o.createdAt === "number" ? o.createdAt : Date.now(),
            completedAt:
              typeof o.completedAt === "number" ? o.completedAt : null,
          };
        });
        return withTs(migrated);
      },
      partialize: (s) => pickSync(s),
    },
  ),
);

/**
 * Стрик с учётом заморозок — единая точка для всех экранов, чтобы
 * ни один не показывал «сырое» число без спасённых дней.
 */
export function useStreak(): number {
  const plan = useUserStore((s) => s.plan);
  const frozen = useUserStore((s) => s.freezes.days);
  return useMemo(() => selectStreak(plan, frozen), [plan, frozen]);
}

/** Лучший стрик за всё время, тоже с учётом заморозок. */
export function useBestStreak(): number {
  const plan = useUserStore((s) => s.plan);
  const frozen = useUserStore((s) => s.freezes.days);
  return useMemo(() => selectBestStreak(plan, frozen), [plan, frozen]);
}

/** Надёжное определение конца гидратации из localStorage. */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    if (useUserStore.persist.hasHydrated()) setHydrated(true);
    const unsub = useUserStore.persist.onFinishHydration(() =>
      setHydrated(true),
    );
    return unsub;
  }, []);
  return hydrated;
}

/* ────────────────────────  Селекторы  ──────────────────────── */

export function selectToday(plan: PlannedTask[], date = dateKey()) {
  return plan.filter((t) => t.date === date);
}

export function selectCompleted(plan: PlannedTask[]) {
  return plan.filter((t) => t.completed);
}

export function selectTotalXp(plan: PlannedTask[]) {
  return selectCompleted(plan).reduce((sum, t) => sum + t.xp, 0);
}

export function selectStats(plan: PlannedTask[]): Stats {
  const stats: Stats = {
    strength: 0,
    intelligence: 0,
    wealth: 0,
    stability: 0,
  };
  for (const t of plan) {
    if (!t.completed) continue;
    stats[CATEGORIES[t.snapshot.category].stat] += t.xp;
  }
  return stats;
}

export function selectLevel(plan: PlannedTask[]) {
  return levelForXp(selectTotalXp(plan));
}

export function selectActiveDays(plan: PlannedTask[]): Set<string> {
  const days = new Set<string>();
  for (const t of plan) if (t.completed) days.add(t.date);
  return days;
}

/** Дни, засчитанные в стрик: реально закрытые + спасённые заморозкой. */
function streakDays(plan: PlannedTask[], frozen: string[] = []): Set<string> {
  const days = selectActiveDays(plan);
  for (const d of frozen) days.add(d);
  return days;
}

/**
 * Текущий стрик. Сегодняшний незакрытый день стрик не обнуляет —
 * иначе приложение наказывало бы за то, что ты открыл его утром.
 * Пропущенные дни, закрытые заморозкой, считаются активными.
 */
export function selectStreak(
  plan: PlannedTask[],
  frozen: string[] = [],
): number {
  const days = streakDays(plan, frozen);
  if (days.size === 0) return 0;
  const cursor = new Date();
  if (!days.has(dateKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (days.has(dateKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function selectBestStreak(
  plan: PlannedTask[],
  frozen: string[] = [],
): number {
  const days = [...streakDays(plan, frozen)].sort();
  let best = 0;
  let run = 0;
  let prev: Date | null = null;
  for (const d of days) {
    const cur = new Date(`${d}T00:00:00`);
    if (prev && Math.round((cur.getTime() - prev.getTime()) / 864e5) === 1) run++;
    else run = 1;
    best = Math.max(best, run);
    prev = cur;
  }
  return best;
}

export function selectCategoryXp(
  plan: PlannedTask[],
): Record<CategoryKey, number> {
  const out = {} as Record<CategoryKey, number>;
  for (const t of plan) {
    if (!t.completed) continue;
    const c = t.snapshot.category;
    out[c] = (out[c] ?? 0) + t.xp;
  }
  return out;
}

export function selectMood(
  moods: Record<string, DailyMood>,
  date = dateKey(),
): DailyMood {
  return moods[date] ?? DEFAULT_MOOD;
}

export function selectTodayActionIds(plan: PlannedTask[]): string[] {
  const d = dateKey();
  return plan.filter((t) => t.date === d).map((t) => t.actionId);
}
