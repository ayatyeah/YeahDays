"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Avatar3D from "@/components/AvatarLazy";
import {
  useUserStore,
  useHydrated,
  selectStats,
  selectTotalXp,
  selectCompleted,
  selectCategoryXp,
  selectActiveDays,
  useStreak,
  useBestStreak,
} from "@/store/useUserStore";
import { STAT_LIST, CATEGORIES, type CategoryKey } from "@/lib/domain";
import { getLevelProgress, TIER_MILESTONES, tierForLevel } from "@/lib/leveling";
import { cn } from "@/lib/cn";

export default function ProgressSection() {
  const hydrated = useHydrated();
  const plan = useUserStore((s) => s.plan);
  const todos = useUserStore((s) => s.todos);

  const stats = useMemo(() => selectStats(plan, todos), [plan, todos]);
  const totalXp = useMemo(() => selectTotalXp(plan, todos), [plan, todos]);
  const completed = useMemo(() => selectCompleted(plan), [plan]);
  const streak = useStreak();
  const best = useBestStreak();
  const catXp = useMemo(() => selectCategoryXp(plan), [plan]);
  const activeDays = useMemo(() => selectActiveDays(plan, todos), [plan, todos]);

  const progress = getLevelProgress(totalXp);
  const level = progress.level;
  const tier = tierForLevel(level);
  const maxStat = Math.max(...Object.values(stats), 1);

  const topCats = (Object.entries(catXp) as [CategoryKey, number][])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const maxCat = Math.max(...topCats.map(([, v]) => v), 1);

  if (!hydrated) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-fg)]" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <h1 className="text-[26px] font-bold tracking-tight">Прогресс</h1>

      {/*
        lg:+: два столбца, как на Today — широкий слева (персонаж, уровень,
        метрики — то, что видно первым делом), узкий справа (разбивка по
        характеристикам, категориям, эволюция — детали для тех, кто
        углубляется). Порядок внутри каждого столбца — ровно тот же, что
        раньше был одним потоком, разбит цельным куском (не вперемешку),
        поэтому на мобильном (без lg:) всё складывается в исходном порядке.
      */}
      <div className="lg:flex lg:items-start lg:gap-6">
        <div className="flex flex-col lg:min-w-0 lg:flex-1 lg:gap-5">
          {/* Персонаж крупно */}
          <div className="canvas-slot mt-1 h-[320px] lg:mt-0">
            <Avatar3D stats={stats} level={level} className="h-full w-full" />
          </div>
          <p className="mb-4 mt-1 text-center text-[12px] text-[var(--color-muted)] lg:mb-0 lg:mt-0">
            Тело меняется с уровнем — от новичка до легенды
          </p>

          {/* Уровень */}
          <section className="mb-5 rounded-3xl surface p-4 lg:mb-0">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[12px] uppercase tracking-wider text-[var(--color-muted)]">
                  Уровень
                </p>
                <p className="text-4xl font-black leading-none tabular-nums">{level}</p>
              </div>
              <p className="text-[14px] font-semibold tabular-nums text-[var(--color-fg-dim)]">
                {totalXp} XP
              </p>
            </div>
            <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-[var(--color-surface-2)]">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[var(--color-intelligence)] to-[var(--color-wealth)]"
                initial={{ width: 0 }}
                animate={{ width: `${progress.ratio * 100}%` }}
                transition={{ type: "spring", stiffness: 130, damping: 22 }}
              />
            </div>
            <p className="mt-1.5 text-[12px] text-[var(--color-muted)]">
              {progress.currentInLevel} / {progress.neededForNext} до уровня {level + 1}
            </p>
          </section>

          {/* Ключевые метрики */}
          <section className="mb-6 grid grid-cols-3 gap-2.5 lg:mb-0">
            <Metric value={completed.length} label="Выполнено" />
            <Metric value={streak} label="Стрик" accent="🔥" />
            <Metric value={activeDays.size} label="Активных дней" />
          </section>
        </div>

        <div className="flex flex-col lg:w-[320px] lg:shrink-0 lg:gap-5">
          {/* Характеристики */}
          <section className="mb-6 lg:mb-0">
            <h2 className="mb-3 text-[14px] font-semibold text-[var(--color-fg-dim)]">
              Характеристики
            </h2>
            <div className="space-y-3.5">
              {STAT_LIST.map((s) => (
                <div key={s.key}>
                  <div className="mb-1.5 flex items-center justify-between text-[13.5px]">
                    <span className="flex items-center gap-2 font-medium">
                      <span style={{ color: s.hex }}>{s.icon}</span>
                      {s.label}
                    </span>
                    <span className="tabular-nums text-[var(--color-muted)]">
                      {stats[s.key]}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-surface-2)]">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: s.hex, boxShadow: `0 0 12px ${s.hex}66` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(stats[s.key] / maxStat) * 100}%` }}
                      transition={{ type: "spring", stiffness: 120, damping: 20 }}
                    />
                  </div>
                  <p className="mt-1 text-[12px] text-[var(--color-muted)]">{s.hint}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Категории */}
          {topCats.length > 0 && (
            <section className="mb-6 lg:mb-0">
              <h2 className="mb-3 text-[14px] font-semibold text-[var(--color-fg-dim)]">
                Где ты растёшь
              </h2>
              <div className="space-y-2">
                {topCats.map(([key, value]) => {
                  const c = CATEGORIES[key];
                  return (
                    <div
                      key={key}
                      className="flex items-center gap-3 rounded-2xl bg-[var(--color-surface)] px-3.5 py-2.5"
                    >
                      <span className="text-base">{c.icon}</span>
                      <span className="flex-1 text-[14px] font-medium">{c.label}</span>
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[var(--color-surface-2)]">
                        <div
                          className="h-full rounded-full bg-[var(--color-fg-dim)]"
                          style={{ width: `${(value / maxCat) * 100}%` }}
                        />
                      </div>
                      <span className="w-10 text-right text-[12.5px] tabular-nums text-[var(--color-muted)]">
                        {value}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Эволюция */}
          <section className="mb-2 lg:mb-0">
            <h2 className="mb-3 text-[14px] font-semibold text-[var(--color-fg-dim)]">
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
                        "flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-bold",
                        reached
                          ? "bg-[var(--color-fg)] text-[var(--color-bg)]"
                          : "bg-[var(--color-surface-2)] text-[var(--color-muted)]",
                      )}
                    >
                      {reached ? "✓" : m.level}
                    </div>
                    <div className="flex-1">
                      <p className="text-[14.5px] font-semibold">{m.label}</p>
                      <p className="text-[12px] text-[var(--color-muted)]">
                        с {m.level} уровня
                      </p>
                    </div>
                    {current && (
                      <span className="text-[11.5px] font-semibold uppercase tracking-wide text-[var(--color-stability)]">
                        сейчас
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-center text-[12px] text-[var(--color-muted)]">
              Лучшая серия: {best} {best === 1 ? "день" : "дн."}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

function Metric({
  value,
  label,
  accent,
}: {
  value: number;
  label: string;
  accent?: string;
}) {
  return (
    <div className="press rounded-3xl surface px-3 py-4 text-center">
      <p className="text-2xl font-bold tabular-nums">
        {accent && <span className="mr-0.5 text-lg">{accent}</span>}
        {value}
      </p>
      <p className="mt-0.5 text-[12px] text-[var(--color-muted)]">{label}</p>
    </div>
  );
}
