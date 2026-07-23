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
  useStreak,
  effectiveGoals,
} from "@/store/useUserStore";
import { useUiStore } from "@/store/useUiStore";
import { fetchRecommendations, trackEvent } from "@/lib/api";
import { track } from "@/lib/analytics";
import { currentSlot, dateKey, xpForAction, type Action } from "@/lib/domain";
import type { ScoredAction } from "@/lib/recommendation";

export default function HomePage() {
  const hydrated = useHydrated();

  const name = useUserStore((s) => s.name);
  const onboarded = useUserStore((s) => s.onboarded);
  const plan = useUserStore((s) => s.plan);
  const goals = useUserStore((s) => s.goals);
  const quests = useUserStore((s) => s.quests);
  const dailyGoal = useUserStore((s) => s.dailyGoal);
  const excludedCategories = useUserStore((s) => s.excludedCategories);
  const disabledActions = useUserStore((s) => s.disabledActions);
  const energyProfile = useUserStore((s) => s.energyProfile);
  const toggleTask = useUserStore((s) => s.toggleTask);
  const moods = useUserStore((s) => s.moods);
  const history = useUserStore((s) => s.history);
  const customActions = useUserStore((s) => s.customActions);
  const lastCheckIn = useUserStore((s) => s.lastCheckIn);

  const setMood = useUserStore((s) => s.setMood);
  const completeCheckIn = useUserStore((s) => s.completeCheckIn);
  const acceptAction = useUserStore((s) => s.acceptAction);
  const rejectAction = useUserStore((s) => s.rejectAction);
  const markSeen = useUserStore((s) => s.markSeen);
  const openCreate = useUiStore((s) => s.openCreate);

  const dailyMood = useMemo(() => selectMood(moods), [moods]);
  // Энергия у людей не постоянна за день. Берём её из профиля текущего
  // слота, а бюджет минут — из чек-ина. Утром колода мягче, вечером злее.
  const mood = useMemo(
    () => ({ ...dailyMood, energy: energyProfile[currentSlot()] }),
    [dailyMood, energyProfile],
  );
  const today = useMemo(() => selectToday(plan), [plan]);
  const streak = useStreak();
  const takenToday = today.length;

  /** Незакрытое действие на сегодня — пока оно есть, новые свайпы закрыты. */
  const activeTask = useMemo(() => today.find((t) => !t.completed), [today]);

  const [deck, setDeck] = useState<ScoredAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

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
        onChange={setMood}
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
          Сегодня
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
          deck={deck}
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
              className="flex items-center justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3.5 transition hover:bg-[var(--color-surface-2)]"
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
