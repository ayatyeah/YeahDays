"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Avatar3D from "@/components/Avatar3D";
import PlanItem from "@/components/PlanItem";
import LevelUpOverlay from "@/components/LevelUpOverlay";
import {
  useUserStore,
  useHydrated,
  selectToday,
  selectStats,
  selectTotalXp,
  selectStreak,
  DAILY_GOAL,
} from "@/store/useUserStore";
import { getLevelProgress } from "@/lib/leveling";
import { currentSlot } from "@/lib/domain";

const GREETING: Record<string, string> = {
  morning: "Доброе утро",
  afternoon: "Добрый день",
  evening: "Добрый вечер",
};

export default function TodayPage() {
  const hydrated = useHydrated();
  const plan = useUserStore((s) => s.plan);
  const name = useUserStore((s) => s.name);
  const toggleTask = useUserStore((s) => s.toggleTask);
  const removeTask = useUserStore((s) => s.removeTask);

  const today = useMemo(() => selectToday(plan), [plan]);
  const stats = useMemo(() => selectStats(plan), [plan]);
  const totalXp = useMemo(() => selectTotalXp(plan), [plan]);
  const streak = useMemo(() => selectStreak(plan), [plan]);
  const progress = useMemo(() => getLevelProgress(totalXp), [totalXp]);

  const done = today.filter((t) => t.completed);
  const active = today.filter((t) => !t.completed);
  const ratio = today.length === 0 ? 0 : done.length / today.length;
  const allDone = today.length > 0 && done.length === today.length;

  const [celebrate, setCelebrate] = useState(0);

  function handleToggle(id: string) {
    const task = today.find((t) => t.id === id);
    toggleTask(id);
    if (task && !task.completed) {
      setCelebrate((c) => c + 1);
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate?.([10, 30, 20]);
      }
    }
  }

  if (!hydrated) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-fg)]" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="mb-1">
        <p className="text-[13px] font-medium text-[var(--color-muted)]">
          {GREETING[currentSlot()]}, {name}
        </p>
        <h1 className="mt-0.5 text-[26px] font-bold leading-tight tracking-tight">
          План на сегодня
        </h1>
      </header>

      {/* Персонаж реагирует на выполнение */}
      <div className="relative -mt-2 h-[210px]">
        <Avatar3D
          stats={stats}
          level={progress.level}
          celebrate={celebrate}
          className="h-full w-full"
        />
        {allDone && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="pointer-events-none absolute inset-x-0 bottom-0 text-center"
          >
            <span className="rounded-full bg-[var(--color-stability)]/15 px-3 py-1.5 text-[12px] font-semibold text-[var(--color-stability)]">
              День закрыт 🔥 стрик {streak}
            </span>
          </motion.div>
        )}
      </div>

      {/* Прогресс дня */}
      <section className="mb-5 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <div className="mb-2.5 flex items-end justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-[var(--color-muted)]">
              Выполнено
            </p>
            <p className="mt-0.5 text-2xl font-bold leading-none tabular-nums">
              {done.length}
              <span className="text-[var(--color-muted)]">/{today.length || DAILY_GOAL}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-[11px] uppercase tracking-wider text-[var(--color-muted)]">
              Уровень {progress.level}
            </p>
            <p className="mt-0.5 text-[13px] font-semibold tabular-nums">
              {totalXp} XP
            </p>
          </div>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--color-surface-2)]">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[var(--color-stability)] to-[var(--color-intelligence)]"
            initial={{ width: 0 }}
            animate={{ width: `${ratio * 100}%` }}
            transition={{ type: "spring", stiffness: 140, damping: 22 }}
          />
        </div>
      </section>

      {/* Список */}
      {today.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--color-surface)] text-2xl">
            ✦
          </div>
          <h2 className="text-lg font-bold tracking-tight">План пока пуст</h2>
          <p className="mt-2 max-w-[270px] text-[14px] leading-snug text-[var(--color-fg-dim)]">
            Открой главный экран и свайпни вправо действия, которые
            берёшь на сегодня.
          </p>
          <Link
            href="/"
            className="mt-5 flex h-11 items-center rounded-2xl bg-[var(--color-fg)] px-5 text-[14px] font-semibold text-[var(--color-bg)]"
          >
            Подобрать действия
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          <AnimatePresence initial={false}>
            {active.map((t) => (
              <PlanItem
                key={t.id}
                task={t}
                onToggle={handleToggle}
                onRemove={removeTask}
              />
            ))}
          </AnimatePresence>

          {done.length > 0 && (
            <>
              <p className="mt-3 text-[12px] font-semibold text-[var(--color-muted)]">
                Выполнено
              </p>
              <AnimatePresence initial={false}>
                {done.map((t) => (
                  <PlanItem
                    key={t.id}
                    task={t}
                    onToggle={handleToggle}
                    onRemove={removeTask}
                  />
                ))}
              </AnimatePresence>
            </>
          )}
        </div>
      )}

      <LevelUpOverlay />
    </div>
  );
}
