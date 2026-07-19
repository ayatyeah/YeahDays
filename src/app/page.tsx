"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Buddy from "@/components/Buddy";
import XpBar from "@/components/XpBar";
import TaskItem from "@/components/TaskItem";
import LevelUpOverlay from "@/components/LevelUpOverlay";
import Button from "@/components/ui/Button";
import {
  useUserStore,
  useHydrated,
  selectTotalXp,
  selectStats,
} from "@/store/useUserStore";
import { useUiStore } from "@/store/useUiStore";
import { CATEGORY_LIST } from "@/lib/categories";
import {
  getLevelProgress,
  tierForLevel,
  nextMilestone,
  TIER_MILESTONES,
} from "@/lib/leveling";

export default function HomePage() {
  const tasks = useUserStore((s) => s.tasks);
  const name = useUserStore((s) => s.name);
  const hydrated = useHydrated();
  const seenLevel = useUserStore((s) => s.seenLevel);
  const markSeenLevel = useUserStore((s) => s.markSeenLevel);
  const openCreate = useUiStore((s) => s.openCreate);
  const openWardrobe = useUiStore((s) => s.openWardrobe);

  const totalXp = useMemo(() => selectTotalXp(tasks), [tasks]);
  const stats = useMemo(() => selectStats(tasks), [tasks]);
  const progress = useMemo(() => getLevelProgress(totalXp), [totalXp]);
  const level = progress.level;
  const upcoming = nextMilestone(level);
  const tierLabel =
    TIER_MILESTONES.find((m) => m.tier === tierForLevel(level))?.label ?? "";

  const active = useMemo(() => tasks.filter((t) => !t.completed), [tasks]);
  const doneCount = tasks.length - active.length;

  const [overlay, setOverlay] = useState<{
    open: boolean;
    level: number;
    milestoneLabel: string | null;
  }>({ open: false, level: 1, milestoneLabel: null });

  useEffect(() => {
    if (!hydrated) return;
    if (level > seenLevel) {
      const crossedTier = tierForLevel(level) > tierForLevel(seenLevel);
      const milestoneLabel = crossedTier
        ? (TIER_MILESTONES.find((m) => m.tier === tierForLevel(level))?.label ??
          null)
        : null;
      setOverlay({ open: true, level, milestoneLabel });
    }
  }, [hydrated, level, seenLevel]);

  const closeOverlay = () => {
    markSeenLevel(overlay.level);
    setOverlay((o) => ({ ...o, open: false }));
  };

  return (
    <div className="flex flex-1 flex-col">
      {/* Приветствие + гардероб */}
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-[var(--color-fg-dim)]">
          Привет,{" "}
          <span className="font-semibold text-[var(--color-fg)]">
            {hydrated ? name : "…"}
          </span>{" "}
          👋
        </p>
        <button
          onClick={openWardrobe}
          className="flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs font-medium text-[var(--color-fg-dim)] transition hover:text-[var(--color-fg)]"
        >
          <span>🧥</span> Гардероб
        </button>
      </div>

      {/* Статус-бар: уровень + XP */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/70 p-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-surface-2)] text-lg font-bold tabular-nums">
              {level}
            </div>
            <div className="leading-tight">
              <p className="text-[11px] uppercase tracking-wider text-[var(--color-muted)]">
                Уровень
              </p>
              <p className="text-sm font-semibold">{tierLabel}</p>
            </div>
          </div>
          <div className="text-right leading-tight">
            <p className="text-[11px] text-[var(--color-muted)]">Опыт</p>
            <p className="text-base font-bold tabular-nums text-[var(--color-xp)]">
              {totalXp}
              <span className="ml-0.5 text-[11px] font-medium">XP</span>
            </p>
          </div>
        </div>
        <div className="mt-3">
          <XpBar ratio={progress.ratio} />
          <div className="mt-1.5 flex justify-between text-[11px] text-[var(--color-muted)]">
            <span>
              {progress.currentInLevel} / {progress.neededForNext} до ур.{" "}
              {level + 1}
            </span>
            {upcoming && <span>«{upcoming.label}» — ур. {upcoming.level}</span>}
          </div>
        </div>
      </div>

      {/* Персонаж */}
      <section className="relative flex flex-1 items-center justify-center py-4">
        <Buddy level={level} size={320} />
      </section>

      {/* Характеристики */}
      <div className="grid grid-cols-3 gap-2">
        {CATEGORY_LIST.map((c) => (
          <div
            key={c.key}
            className="flex flex-col items-center gap-0.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/60 py-2"
          >
            <span className="text-base leading-none">{c.emoji}</span>
            <span
              className="text-sm font-bold tabular-nums"
              style={{ color: c.color }}
            >
              {stats[c.key]}
            </span>
            <span className="text-[10px] text-[var(--color-muted)]">
              {c.label}
            </span>
          </div>
        ))}
      </div>

      {/* Задачи */}
      <section className="mt-4">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[var(--color-fg-dim)]">
            Активные задачи
          </h2>
          {doneCount > 0 && (
            <span className="text-xs text-[var(--color-muted)]">
              выполнено: {doneCount}
            </span>
          )}
        </div>

        {active.length === 0 ? (
          <button
            onClick={() => openCreate()}
            className="w-full rounded-2xl border border-dashed border-[var(--color-border)] px-4 py-6 text-center transition hover:border-[var(--color-fg-dim)] hover:bg-[var(--color-surface)]/50"
          >
            <p className="text-sm text-[var(--color-fg-dim)]">
              Пусто. Нажми, чтобы создать первую задачу —
              <br />и персонаж начнёт расти.
            </p>
          </button>
        ) : (
          <div className="flex max-h-[32vh] flex-col gap-2 overflow-y-auto pb-1">
            <AnimatePresence initial={false}>
              {active.map((t) => (
                <TaskItem key={t.id} task={t} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      <LevelUpOverlay
        open={overlay.open}
        level={overlay.level}
        milestoneLabel={overlay.milestoneLabel}
        onClose={closeOverlay}
      />
    </div>
  );
}
