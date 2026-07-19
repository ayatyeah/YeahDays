"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Human from "@/components/Human";
import XpBar from "@/components/XpBar";
import TaskItem from "@/components/TaskItem";
import LevelUpOverlay from "@/components/LevelUpOverlay";
import Button from "@/components/ui/Button";
import {
  useUserStore,
  useHydrated,
  selectTotalXp,
} from "@/store/useUserStore";
import { useUiStore } from "@/store/useUiStore";
import {
  getLevelProgress,
  tierForLevel,
  nextMilestone,
  TIER_MILESTONES,
} from "@/lib/leveling";

export default function HomePage() {
  const tasks = useUserStore((s) => s.tasks);
  const hydrated = useHydrated();
  const seenLevel = useUserStore((s) => s.seenLevel);
  const markSeenLevel = useUserStore((s) => s.markSeenLevel);
  const openCreate = useUiStore((s) => s.openCreate);

  const totalXp = useMemo(() => selectTotalXp(tasks), [tasks]);
  const progress = useMemo(() => getLevelProgress(totalXp), [totalXp]);
  const level = progress.level;
  const upcoming = nextMilestone(level);
  const tierLabel =
    TIER_MILESTONES.find((m) => m.tier === tierForLevel(level))?.label ?? "";

  const active = useMemo(
    () => tasks.filter((t) => !t.completed),
    [tasks],
  );
  const doneCount = tasks.length - active.length;

  const [overlay, setOverlay] = useState<{
    open: boolean;
    level: number;
    milestoneLabel: string | null;
  }>({ open: false, level: 1, milestoneLabel: null });

  // детекция повышения уровня.
  // markSeenLevel вызываем НЕ здесь, а при закрытии оверлея — иначе
  // «выброшенный» первый проход эффектов в StrictMode (dev) пометил бы
  // уровень увиденным и съел бы празднование до реального показа.
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
      {/* Шапка: уровень + XP */}
      <header className="mb-2">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-muted)]">
              Уровень
            </p>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-bold leading-none tabular-nums">
                {level}
              </p>
              <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-fg-dim)]">
                {tierLabel}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-[var(--color-muted)]">Всего опыта</p>
            <p className="text-lg font-semibold tabular-nums text-[var(--color-xp)]">
              {totalXp} XP
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
            {upcoming && (
              <span>
                «{upcoming.label}» — ур. {upcoming.level}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Персонаж */}
      <section className="relative flex flex-1 items-center justify-center py-2">
        <Human level={level} size={260} />
      </section>

      {/* Задачи */}
      <section>
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
          <div className="rounded-2xl border border-dashed border-[var(--color-border)] px-4 py-8 text-center">
            <p className="text-sm text-[var(--color-fg-dim)]">
              Пока пусто. Создай первую задачу —
              <br />и персонаж начнёт расти.
            </p>
            <Button
              variant="primary"
              size="sm"
              className="mt-4"
              onClick={() => openCreate()}
            >
              + Задача
            </Button>
          </div>
        ) : (
          <div className="flex max-h-[34vh] flex-col gap-2 overflow-y-auto pb-1">
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
