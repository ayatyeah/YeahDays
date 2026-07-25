"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import SwipeDeck from "@/components/SwipeDeck";
import CheckIn from "@/components/CheckIn";
import Onboarding from "@/components/Onboarding";
import ActiveTask from "@/components/ActiveTask";
import Logo, { LogoLoader } from "@/components/Logo";
import {
  useUserStore,
  useHydrated,
  selectMood,
  selectToday,
  selectTodayActionIds,
  selectTotalXp,
  useStreak,
  effectiveGoals,
  isChallengeActive,
} from "@/store/useUserStore";
import { useUiStore } from "@/store/useUiStore";
import { fetchRecommendations, trackEvent } from "@/lib/api";
import { track } from "@/lib/analytics";
import { currentSlot, dateKey, xpForAction, type Action } from "@/lib/domain";
import { useTimeSlot, SLOT_LABEL } from "@/lib/useTimeSlot";
import { nextGoal, type GoalKind } from "@/lib/milestone";
import type { ScoredAction } from "@/lib/recommendation";

/** Значок ближайшей цели по её типу. */
const GOAL_ICON: Record<GoalKind, string> = {
  green: "🟢",
  day: "🎯",
  evolution: "✨",
  level: "⭐",
  streak: "🔥",
};

export default function HomePage() {
  const hydrated = useHydrated();

  const name = useUserStore((s) => s.name);
  const onboarded = useUserStore((s) => s.onboarded);
  const plan = useUserStore((s) => s.plan);
  const goals = useUserStore((s) => s.goals);
  const quests = useUserStore((s) => s.quests);
  const dailyGoal = useUserStore((s) => s.dailyGoal);
  const challenges = useUserStore((s) => s.challenges);
  const excludedCategories = useUserStore((s) => s.excludedCategories);
  const disabledActions = useUserStore((s) => s.disabledActions);
  const energyProfile = useUserStore((s) => s.energyProfile);
  const toggleTask = useUserStore((s) => s.toggleTask);
  const moods = useUserStore((s) => s.moods);
  const history = useUserStore((s) => s.history);
  const customActions = useUserStore((s) => s.customActions);
  const lastCheckIn = useUserStore((s) => s.lastCheckIn);

  const setMood = useUserStore((s) => s.setMood);
  const setSlotEnergy = useUserStore((s) => s.setSlotEnergy);
  const completeCheckIn = useUserStore((s) => s.completeCheckIn);
  const acceptAction = useUserStore((s) => s.acceptAction);
  const rejectAction = useUserStore((s) => s.rejectAction);
  const markSeen = useUserStore((s) => s.markSeen);
  const openCreate = useUiStore((s) => s.openCreate);

  const slot = useTimeSlot();
  const dailyMood = useMemo(() => selectMood(moods), [moods]);
  // Энергия у людей не постоянна за день. Берём её из профиля текущего
  // слота, а бюджет минут — из чек-ина. Утром колода мягче, вечером злее.
  const mood = useMemo(
    () => ({ ...dailyMood, energy: energyProfile[slot] }),
    [dailyMood, energyProfile, slot],
  );
  const today = useMemo(() => selectToday(plan), [plan]);
  const streak = useStreak();
  const takenToday = today.length;

  /** Незакрытое действие на сегодня — пока оно есть, новые свайпы закрыты. */
  const activeTask = useMemo(() => today.find((t) => !t.completed), [today]);

  /**
   * Ближайшая цель — «до чего осталось чуть-чуть». Самый сильный крючок
   * возврата: конкретный следующий шаг вместо абстрактного прогресса.
   * Пока день не собран — тянет закрыть день; после — к эволюции и уровню.
   */
  const goal = useMemo(() => {
    const day = dateKey();
    // ближайший к зелёному из активных сегодня челленджей
    let toGreenDay: number | null = null;
    for (const c of challenges) {
      if (!isChallengeActive(c, day)) continue;
      const count = c.log[day] ?? 0;
      if (count < c.green) {
        const left = c.green - count;
        toGreenDay = toGreenDay == null ? left : Math.min(toGreenDay, left);
      }
    }
    return nextGoal({
      totalXp: selectTotalXp(plan),
      takenToday,
      dailyGoal,
      streak,
      toGreenDay,
    });
  }, [plan, challenges, takenToday, dailyGoal, streak]);

  const [deck, setDeck] = useState<ScoredAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  /**
   * Колода грузится один раз на чек-ине, и плана нет в зависимостях эффекта
   * (иначе карточки прыгали бы на каждый свайп). Из-за этого только что
   * выполненное действие возвращалось наверх колоды: гейт «взял — сделай»
   * снимался, SwipeDeck монтировался заново и снова показывал ту же карточку.
   * Отфильтровываем взятое сегодня на месте — дёшево и не трогает загрузку.
   * В рамках одной сессии свайпа план меняется только на «беру», а это сразу
   * включает гейт и разбирает SwipeDeck, так что карточки не пропадают под рукой.
   */
  const visibleDeck = useMemo(() => {
    const taken = new Set(selectTodayActionIds(plan));
    return deck.filter((d) => !taken.has(d.action.id));
  }, [deck, plan]);

  const needsCheckIn = hydrated && lastCheckIn !== dateKey();

  /* ── Загрузка колоды ── */
  useEffect(() => {
    if (!hydrated || needsCheckIn) return;
    let cancelled = false;
    setLoading(true);

    fetchRecommendations({
      // активные цели поднимают вес своего стата тем сильнее,
      // чем ближе дедлайн и чем больше отставание
      goals: effectiveGoals(goals, quests, plan),
      mood,
      history,
      excludeIds: selectTodayActionIds(plan),
      customActions,
      excludeCategories: excludedCategories,
      disabledActions,
      limit: 12,
    }).then((res) => {
      if (cancelled) return;
      setDeck(res.deck);
      setLoading(false);
      markSeen(res.deck.slice(0, 3).map((d) => d.action.id));
    });

    return () => {
      cancelled = true;
    };
    // history намеренно не в зависимостях: иначе колода пересобиралась бы
    // на каждый свайп и карточки прыгали бы под пальцем
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    hydrated,
    needsCheckIn,
    goals,
    quests,
    excludedCategories,
    disabledActions,
    mood.energy,
    mood.minutes,
    slot,
    reloadKey,
  ]);

  const handleAccept = useCallback(
    (a: Action) => {
      acceptAction(a);
      track("action_accepted", { category: a.category, difficulty: a.difficulty });
      trackEvent({
        type: "accept",
        actionId: a.id,
        at: Date.now(),
        category: a.category,
        xp: xpForAction(a),
      });
    },
    [acceptAction],
  );

  const handleReject = useCallback(
    (a: Action) => {
      rejectAction(a.id);
      track("action_rejected", { category: a.category });
      trackEvent({
        type: "reject",
        actionId: a.id,
        at: Date.now(),
        category: a.category,
      });
    },
    [rejectAction],
  );

  /* ── Состояния экрана ── */

  if (!hydrated) {
    return <LogoLoader />;
  }

  if (!onboarded) {
    return <Onboarding />;
  }

  if (needsCheckIn) {
    return (
      <CheckIn
        name={name}
        mood={mood}
        /*
          Энергия и бюджет живут в разных местах, и это намеренно.
          Минуты — про сегодня, поэтому идут в moods[дата]. А «сколько сил»
          — про ТЕКУЩЕЕ время суток: значение уходит в профиль слота,
          откуда движок его и читает. Раньше кнопки писали в moods, а на
          экране показывалось значение из профиля — источник и приёмник
          были разными, поэтому выбор не двигался вообще.
        */
        onChange={(patch) => {
          if (patch.energy) setSlotEnergy(currentSlot(), patch.energy);
          if (patch.minutes !== undefined) setMood({ minutes: patch.minutes });
        }}
        onDone={completeCheckIn}
      />
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Бренд-лого + название + стрик */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Logo variant="white" className="h-7 w-auto" />
          <span className="text-[19px] font-extrabold tracking-tight">
            YeahDays
          </span>
        </div>
        {streak > 0 && (
          <div className="flex items-center gap-1.5 rounded-full bg-[var(--color-surface)] px-3 py-1.5">
            <span className="text-sm">🔥</span>
            <span className="text-sm font-bold tabular-nums">{streak}</span>
          </div>
        )}
      </div>

      {/* Шапка: прогресс дня */}
      <header className="mb-4">
        <p className="text-[13px] font-medium text-[var(--color-muted)]">
          {/* Показываем слот: подборка привязана ко времени суток, и без
              подписи это невидимая механика — человек не понимает,
              почему вечером карточки другие, чем утром. */}
          Сегодня · {SLOT_LABEL[slot]}
        </p>
        <h1 className="mt-0.5 text-[26px] font-bold leading-tight tracking-tight">
          {takenToday >= dailyGoal ? "План собран" : "Что сделаешь сегодня?"}
        </h1>
      </header>

      {/* Индикатор набора плана */}
      <div className="mb-5 flex items-center gap-2">
        {Array.from({ length: dailyGoal }).map((_, i) => (
          <motion.div
            key={i}
            className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--color-surface-2)]"
          >
            <motion.div
              className="h-full rounded-full bg-[var(--color-fg)]"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: i < takenToday ? 1 : 0 }}
              style={{ originX: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
            />
          </motion.div>
        ))}
        <span className="ml-1 text-[11px] font-medium tabular-nums text-[var(--color-muted)]">
          {Math.min(takenToday, dailyGoal)}/{dailyGoal}
        </span>
      </div>

      {/* Ближайшая цель — «осталось чуть-чуть». Ключ по тексту, чтобы строка
          мягко переанимировалась в момент, когда веха меняется. */}
      <AnimatePresence mode="wait">
        {goal && (
          <motion.div
            key={goal.text}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.22 }}
            className="mb-5 -mt-2 flex items-center gap-2"
          >
            <span className="text-[13px]" aria-hidden>
              {GOAL_ICON[goal.kind]}
            </span>
            <span className="text-[12.5px] font-medium text-[var(--color-fg-dim)]">
              {goal.text}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Колода — но только если нет незакрытого действия.
          Смысл гейта: взял — сделай. Иначе набирается список из десяти
          «когда-нибудь», и продукт превращается в обычный тудушник. */}
      {loading ? (
        <LogoLoader />
      ) : activeTask ? (
        <ActiveTask
          task={activeTask}
          onDone={() => {
            toggleTask(activeTask.id);
            track("action_completed", {
              category: activeTask.snapshot.category,
              xp: activeTask.xp,
            });
            trackEvent({
              type: "complete",
              actionId: activeTask.actionId,
              at: Date.now(),
              category: activeTask.snapshot.category,
              xp: activeTask.xp,
            });
            if (typeof navigator !== "undefined" && "vibrate" in navigator) {
              navigator.vibrate?.([10, 30, 20]);
            }
          }}
        />
      ) : (
        <SwipeDeck
          deck={visibleDeck}
          onAccept={handleAccept}
          onReject={handleReject}
          emptyState={<DeckEmpty onRefresh={() => setReloadKey((k) => k + 1)} />}
        />
      )}

      {/* Мини-сводка принятого */}
      <AnimatePresence>
        {takenToday > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="mt-4"
          >
            <Link
              href="/today"
              className="flex items-center justify-between rounded-2xl surface px-4 py-3.5 transition hover:bg-[var(--color-surface-2)]"
            >
              <div className="min-w-0">
                <p className="text-[13px] font-semibold">
                  В плане на сегодня: {takenToday}
                </p>
                <p className="mt-0.5 truncate text-[11.5px] text-[var(--color-muted)]">
                  {today
                    .slice(0, 2)
                    .map((t) => t.snapshot.title)
                    .join(" · ")}
                  {today.length > 2 && ` +${today.length - 2}`}
                </p>
              </div>
              <span className="ml-3 shrink-0 text-[var(--color-muted)]">→</span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Своё действие */}
      <button
        onClick={() => openCreate()}
        className="mt-2.5 text-center text-[12.5px] font-medium text-[var(--color-muted)] transition hover:text-[var(--color-fg-dim)]"
      >
        + Добавить своё действие
      </button>
    </div>
  );
}

function DeckEmpty({ onRefresh }: { onRefresh: () => void }) {
  return (
    <div className="flex flex-col items-center px-6 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--color-surface)] text-2xl">
        ✓
      </div>
      <h2 className="text-lg font-bold tracking-tight">Карточки закончились</h2>
      <p className="mt-2 max-w-[280px] text-[14px] leading-snug text-[var(--color-fg-dim)]">
        Ты просмотрел всю подборку. Собери новую — движок учтёт
        сегодняшние свайпы.
      </p>
      <button
        onClick={onRefresh}
        className="mt-5 h-11 rounded-2xl bg-[var(--color-fg)] px-5 text-[14px] font-semibold text-[var(--color-bg)]"
      >
        Новая подборка
      </button>
    </div>
  );
}
