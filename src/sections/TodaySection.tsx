"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Avatar3D from "@/components/AvatarLazy";
import AnimatedNumber from "@/components/AnimatedNumber";
import PlanItem from "@/components/PlanItem";
import LevelUpOverlay from "@/components/LevelUpOverlay";
import DayCompleteOverlay from "@/components/DayCompleteOverlay";
import EveningRetro from "@/components/EveningRetro";
import Challenges from "@/components/Challenges";
import TimelineSchedule from "@/components/TimelineSchedule";
import TodoList from "@/components/TodoList";
import { LogoLoader } from "@/components/Logo";
import {
  useUserStore,
  useHydrated,
  selectToday,
  selectStats,
  selectTotalXp,
  DAILY_GOAL,
  useStreak,
} from "@/store/useUserStore";
import { getLevelProgress } from "@/lib/leveling";
import { currentSlot } from "@/lib/domain";
import { trackEvent } from "@/lib/api";
import { track } from "@/lib/analytics";
import { useNavStore } from "@/store/useNavStore";

const GREETING: Record<string, string> = {
  morning: "Доброе утро",
  afternoon: "Добрый день",
  evening: "Добрый вечер",
};

export default function TodaySection() {
  const hydrated = useHydrated();
  const plan = useUserStore((s) => s.plan);
  const todos = useUserStore((s) => s.todos);
  const name = useUserStore((s) => s.name);
  const toggleTask = useUserStore((s) => s.toggleTask);
  const removeTask = useUserStore((s) => s.removeTask);
  const go = useNavStore((s) => s.go);

  const today = useMemo(() => selectToday(plan), [plan]);
  const stats = useMemo(() => selectStats(plan, todos), [plan, todos]);
  const totalXp = useMemo(() => selectTotalXp(plan, todos), [plan, todos]);
  const streak = useStreak();
  const progress = useMemo(() => getLevelProgress(totalXp), [totalXp]);

  const done = today.filter((t) => t.completed);
  const active = today.filter((t) => !t.completed);
  const ratio = today.length === 0 ? 0 : done.length / today.length;
  const allDone = today.length > 0 && done.length === today.length;

  const [celebrate, setCelebrate] = useState(0);
  const [showDone, setShowDone] = useState(false);

  function handleToggle(id: string) {
    const task = today.find((t) => t.id === id);
    toggleTask(id);
    if (task && !task.completed) {
      setCelebrate((c) => c + 1);
      track("action_completed", { category: task.snapshot.category, xp: task.xp });
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate?.([10, 30, 20]);
      }
      trackEvent({
        type: "complete",
        actionId: task.actionId,
        at: Date.now(),
        category: task.snapshot.category,
        xp: task.xp,
      });
    }
  }

  if (!hydrated) {
    return <LogoLoader />;
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="mb-1">
        <p className="text-[14px] font-medium text-[var(--color-muted)]">
          {GREETING[currentSlot()]}, {name}
        </p>
        <h1 className="mt-0.5 text-[26px] font-bold leading-tight tracking-tight">
          План на сегодня
        </h1>
      </header>

      {/*
        На lg: и шире это дашборд в две колонки: широкая слева (прогресс,
        задачи — то, чем реально пользуются) и узкая справа (персонаж,
        челленджи, расписание, итог дня). Каждая колонка — свой независимый
        вертикальный поток (flex-col), а не общая grid-сетка строк: контент
        слева и справа разной высоты (пустой план короче полного, у кого-то
        нет челленджей), и общая сетка строк сводила бы заголовки в
        разных колонках на одну визуальную линию — некрасиво и непредсказуемо.
        Порядок внутри каждой колонки — тот же, что раньше был во всей
        мобильной раскладке одним потоком; на мобильном (без lg:) обе
        колонки просто складываются друг под друга — сначала задачи, потом
        персонаж и всё остальное.
      */}
      <div className="lg:flex lg:items-start lg:gap-6">
        <div className="flex flex-col lg:min-w-0 lg:flex-1 lg:gap-5">
          {/* Прогресс дня */}
          <section className="mb-5 rounded-3xl surface p-4 lg:mb-0">
            <div className="mb-2.5 flex items-end justify-between">
              <div>
                <p className="text-[12px] uppercase tracking-wider text-[var(--color-muted)]">
                  Выполнено
                </p>
                <p className="mt-0.5 text-2xl font-bold leading-none tabular-nums">
                  {done.length}
                  <span className="text-[var(--color-muted)]">/{today.length || DAILY_GOAL}</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-[12px] uppercase tracking-wider text-[var(--color-muted)]">
                  Уровень {progress.level}
                </p>
                <p className="mt-0.5 text-[14px] font-semibold tabular-nums">
                  <AnimatedNumber value={totalXp} /> XP
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

          {/* Расписание дня — сразу после прогресса, а не в конце страницы:
              это самое конкретное "что и когда сегодня", раньше требовало
              долистать мимо персонажа и челленджей, чтобы увидеть. */}
          <div className="mb-5 lg:mb-0">
            <TimelineSchedule compact />
          </div>

          {/* Список */}
          {today.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--color-surface)] text-2xl">
                ✦
              </div>
              <h2 className="text-lg font-bold tracking-tight">План пока пуст</h2>
              <p className="mt-2 max-w-[270px] text-[14px] leading-snug text-[var(--color-fg-dim)]">
                Впиши свои задачи ниже, или открой «Главную» и свайпни вправо
                действия, которые берёшь на сегодня.
              </p>
              <button
                type="button"
                onClick={() => go("home")}
                className="press mt-5 flex h-11 items-center rounded-2xl bg-[var(--color-fg)] px-5 text-[14px] font-semibold text-[var(--color-bg)]"
              >
                Открыть Главную
              </button>
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

              {/* Выполненное сворачиваем: закрытое дело не должно занимать
                  экран наравне с тем, что ещё предстоит сделать. */}
              {done.length > 0 && (
                <div className="mt-3">
                  <button
                    onClick={() => setShowDone((v) => !v)}
                    className="flex w-full items-center justify-between rounded-2xl surface px-4 py-3 text-left transition hover:bg-[var(--color-surface-2)]"
                  >
                    <span className="text-[13.5px] font-semibold text-[var(--color-muted)]">
                      Выполнено: {done.length}
                    </span>
                    <span className="text-[13px] text-[var(--color-muted)]">
                      {showDone ? "скрыть" : "показать"}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {showDone && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex flex-col gap-2.5 overflow-hidden pt-2.5"
                      >
                        {done.map((t) => (
                          <PlanItem
                            key={t.id}
                            task={t}
                            onToggle={handleToggle}
                            onRemove={removeTask}
                          />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          )}

          <TodoList />
        </div>

        <div className="mt-5 flex flex-col gap-5 lg:mt-0 lg:w-[320px] lg:shrink-0">
          {/* Персонаж реагирует на выполнение */}
          <div className="canvas-slot relative h-[240px]">
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
                <span className="rounded-full bg-[var(--color-stability)]/15 px-3 py-1.5 text-[13px] font-semibold text-[var(--color-stability)]">
                  День закрыт 🔥 стрик {streak}
                </span>
              </motion.div>
            )}
          </div>

          <Challenges />
          <EveningRetro />
        </div>
      </div>

      <LevelUpOverlay />
      <DayCompleteOverlay />
    </div>
  );
}
