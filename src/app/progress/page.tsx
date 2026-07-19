"use client";

import { useMemo } from "react";
import Buddy from "@/components/Buddy";
import PageHeader from "@/components/PageHeader";
import XpBar from "@/components/XpBar";
import {
  useUserStore,
  selectStats,
  selectTotalXp,
} from "@/store/useUserStore";
import { CATEGORIES } from "@/lib/categories";
import {
  getLevelProgress,
  tierForLevel,
  TIER_MILESTONES,
} from "@/lib/leveling";
import { cn } from "@/lib/cn";

export default function ProgressPage() {
  const tasks = useUserStore((s) => s.tasks);

  const stats = useMemo(() => selectStats(tasks), [tasks]);
  const totalXp = useMemo(() => selectTotalXp(tasks), [tasks]);
  const progress = getLevelProgress(totalXp);
  const level = progress.level;
  const tier = tierForLevel(level);

  const completed = tasks.filter((t) => t.completed).length;
  const maxStat = Math.max(stats.body, stats.mind, stats.discipline, 1);

  const statRows = [
    { ...CATEGORIES.body, value: stats.body },
    { ...CATEGORIES.mind, value: stats.mind },
    { ...CATEGORIES.discipline, value: stats.discipline },
  ];

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="Прогресс" />

      {/* мини-превью персонажа + уровень */}
      <div className="mb-5 flex items-center gap-4 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <div className="flex shrink-0 justify-center" style={{ width: 92 }}>
          <Buddy level={level} size={96} />
        </div>
        <div className="flex-1">
          <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">
            Уровень
          </p>
          <p className="text-3xl font-bold leading-none">{level}</p>
          <div className="mt-2">
            <XpBar ratio={progress.ratio} />
          </div>
          <p className="mt-1.5 text-[11px] text-[var(--color-muted)]">
            {totalXp} XP всего
          </p>
        </div>
      </div>

      {/* статы по сферам */}
      <section className="mb-6">
        <h2 className="mb-3 text-sm font-semibold text-[var(--color-fg-dim)]">
          Характеристики
        </h2>
        <div className="space-y-3">
          {statRows.map((s) => (
            <div key={s.key}>
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-[var(--color-fg-dim)]">
                  {s.emoji} {s.label}
                </span>
                <span className="tabular-nums text-[var(--color-muted)]">
                  {s.value} XP
                </span>
              </div>
              <XpBar ratio={s.value / maxStat} color={s.color} />
            </div>
          ))}
        </div>
      </section>

      {/* вехи-трансформации */}
      <section className="mb-6">
        <h2 className="mb-3 text-sm font-semibold text-[var(--color-fg-dim)]">
          Эволюция
        </h2>
        <div className="space-y-2">
          {TIER_MILESTONES.map((m) => {
            const reached = level >= m.level;
            const current = tier === m.tier;
            return (
              <div
                key={m.tier}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border px-4 py-3",
                  current
                    ? "border-[var(--color-fg-dim)] bg-[var(--color-surface-2)]"
                    : "border-[var(--color-border)] bg-[var(--color-surface)]",
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold",
                    reached
                      ? "bg-[var(--color-fg)] text-[var(--color-bg)]"
                      : "bg-[var(--color-surface-2)] text-[var(--color-muted)]",
                  )}
                >
                  {reached ? "✓" : m.level}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{m.label}</p>
                  <p className="text-[11px] text-[var(--color-muted)]">
                    с {m.level} уровня
                  </p>
                </div>
                {current && (
                  <span className="text-[10px] uppercase tracking-wide text-[var(--color-xp)]">
                    сейчас
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* итоги */}
      <section className="grid grid-cols-3 gap-2">
        {[
          { label: "Создано", value: tasks.length },
          { label: "Выполнено", value: completed },
          { label: "Уровень", value: level },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-4 text-center"
          >
            <p className="text-2xl font-bold tabular-nums">{s.value}</p>
            <p className="text-[11px] text-[var(--color-muted)]">{s.label}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
