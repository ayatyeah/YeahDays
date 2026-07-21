"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import SwipeDeck from "@/components/SwipeDeck";
import CheckIn from "@/components/CheckIn";
import {
  useUserStore,
  useHydrated,
  selectMood,
  selectToday,
  selectTodayActionIds,
  selectStreak,
  DAILY_GOAL,
} from "@/store/useUserStore";
import { useUiStore } from "@/store/useUiStore";
import { fetchRecommendations, trackEvent } from "@/lib/api";
import { dateKey, type Action } from "@/lib/domain";
import type { ScoredAction } from "@/lib/recommendation";

export default function HomePage() {
  const hydrated = useHydrated();

  const name = useUserStore((s) => s.name);
  const plan = useUserStore((s) => s.plan);
  const goals = useUserStore((s) => s.goals);
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

  const mood = useMemo(() => selectMood(moods), [moods]);
  const today = useMemo(() => selectToday(plan), [plan]);
  const streak = useMemo(() => selectStreak(plan), [plan]);
  const takenToday = today.length;

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
      goals,
      mood,
      history,
      excludeIds: selectTodayActionIds(plan),
      customActions,
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
  }, [hydrated, needsCheckIn, goals, mood.energy, mood.minutes, reloadKey]);

  const handleAccept = useCallback(
    (a: Action) => {
      acceptAction(a);
      trackEvent({ type: "accept", actionId: a.id, at: Date.now() });
    },
    [acceptAction],
  );

  const handleReject = useCallback(
    (a: Action) => {
      rejectAction(a.id);
      trackEvent({ type: "reject", actionId: a.id, at: Date.now() });
    },
    [rejectAction],
  );

  /* ── Состояния экрана ── */

  if (!hydrated) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-fg)]" />
      </div>
    );
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
      {/* Шапка: прогресс дня */}
      <header className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-[13px] font-medium text-[var(--color-muted)]">
            Сегодня
          </p>
          <h1 className="mt-0.5 text-[26px] font-bold leading-tight tracking-tight">
            {takenToday >= DAILY_GOAL
              ? "План собран"
              : "Что сделаешь сегодня?"}
          </h1>
        </div>

        {streak > 0 && (
          <div className="flex items-center gap-1.5 rounded-full bg-[var(--color-surface)] px-3 py-1.5">
            <span className="text-sm">🔥</span>
            <span className="text-sm font-bold tabular-nums">{streak}</span>
          </div>
        )}
      </header>

      {/* Индикатор набора плана */}
      <div className="mb-5 flex items-center gap-2">
        {Array.from({ length: DAILY_GOAL }).map((_, i) => (
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
          {Math.min(takenToday, DAILY_GOAL)}/{DAILY_GOAL}
        </span>
      </div>

      {/* Колода */}
      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-fg)]" />
        </div>
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
