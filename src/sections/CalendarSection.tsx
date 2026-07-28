"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import PlanItem from "@/components/PlanItem";
import { AnimatePresence } from "framer-motion";
import {
  useUserStore,
  useHydrated,
  useStreak,
  useBestStreak,
  dayLevel,
} from "@/store/useUserStore";
import { dateKey } from "@/lib/domain";
import { cn } from "@/lib/cn";

const MONTHS = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];
const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function keyOf(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export default function CalendarSection() {
  const hydrated = useHydrated();
  const plan = useUserStore((s) => s.plan);
  const challenges = useUserStore((s) => s.challenges);
  const toggleTask = useUserStore((s) => s.toggleTask);
  const removeTask = useUserStore((s) => s.removeTask);

  const today = new Date();
  const todayKey = dateKey(today);

  const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [selected, setSelected] = useState(todayKey);

  const streak = useStreak();
  const best = useBestStreak();

  /** date → {taken, done} */
  const byDate = useMemo(() => {
    const map = new Map<string, { taken: number; done: number }>();
    for (const t of plan) {
      const e = map.get(t.date) ?? { taken: 0, done: 0 };
      e.taken++;
      if (t.completed) e.done++;
      map.set(t.date, e);
    }
    return map;
  }, [plan]);

  const selectedTasks = useMemo(
    () => plan.filter((t) => t.date === selected),
    [plan, selected],
  );

  const cells = useMemo(() => {
    const first = new Date(view.y, view.m, 1);
    const startDow = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
    const arr: (number | null)[] = [];
    for (let i = 0; i < startDow; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(d);
    return arr;
  }, [view]);

  function shift(delta: number) {
    setView((v) => {
      const m = v.m + delta;
      return { y: v.y + Math.floor(m / 12), m: ((m % 12) + 12) % 12 };
    });
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
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-[26px] font-bold tracking-tight">
            {MONTHS[view.m]}{" "}
            <span className="text-[var(--color-muted)]">{view.y}</span>
          </h1>
          <p className="mt-0.5 text-[12px] text-[var(--color-muted)]">
            🔥 {streak} подряд · рекорд {best}
          </p>
        </div>
        <div className="flex gap-1.5">
          <NavBtn onClick={() => shift(-1)}>‹</NavBtn>
          <NavBtn onClick={() => shift(1)}>›</NavBtn>
        </div>
      </header>

      <div className="mb-1.5 grid grid-cols-7 gap-1 text-center text-[10.5px] text-[var(--color-muted)]">
        {WEEKDAYS.map((w) => (
          <div key={w}>{w}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (d === null) return <div key={i} />;
          const k = keyOf(view.y, view.m, d);
          const e = byDate.get(k);
          const isToday = k === todayKey;
          const isSel = k === selected;
          const full = e && e.done > 0 && e.done === e.taken;
          const partial = e && e.done > 0 && e.done < e.taken;
          // уровень дня по челленджам: зелёный — все нормы взяты,
          // жёлтый — взята хотя бы минимальная планка
          const level = dayLevel(challenges, k);

          return (
            <button
              key={i}
              onClick={() => setSelected(k)}
              className={cn(
                // active:scale вместо framer-motion: 42 ячейки × подписка
                // на motion-значения заметно тормозили открытие календаря
                "relative flex aspect-square flex-col items-center justify-center rounded-2xl border text-[13px] transition-transform duration-100 active:scale-[0.92]",
                isSel
                  ? "border-[var(--color-fg)] bg-[var(--color-surface-2)]"
                  : "border-transparent hover:bg-[var(--color-surface)]",
                isToday && !isSel && "text-[var(--color-stability)]",
              )}
              style={
                !isSel && (level !== "none" || full)
                  ? {
                      background: `color-mix(in srgb, ${
                        level === "green"
                          ? "var(--color-stability)"
                          : level === "yellow"
                            ? "var(--color-wealth)"
                            : "var(--color-stability)"
                      } ${level === "none" ? 14 : 24}%, transparent)`,
                    }
                  : undefined
              }
            >
              <span className={cn(isSel && "font-bold")}>{d}</span>
              {e && (
                <span className="absolute bottom-1.5 flex gap-0.5">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{
                      background: full
                        ? "var(--color-stability)"
                        : partial
                          ? "var(--color-wealth)"
                          : "var(--color-border)",
                    }}
                  />
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-center gap-4 text-[10.5px] text-[var(--color-muted)]">
        <Legend color="var(--color-stability)" label="день закрыт" />
        <Legend color="var(--color-wealth)" label="частично" />
        <Legend color="var(--color-border)" label="не начат" />
      </div>

      <section className="mt-5 flex-1">
        <h2 className="mb-2.5 text-[13px] font-semibold text-[var(--color-fg-dim)]">
          {selected === todayKey ? "Сегодня" : selected}
        </h2>

        {selectedTasks.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-[var(--color-border)] px-4 py-7 text-center text-[13px] text-[var(--color-muted)]">
            В этот день действий не было.
          </p>
        ) : (
          <div className="flex flex-col gap-2.5">
            <AnimatePresence initial={false}>
              {selectedTasks.map((t) => (
                <PlanItem
                  key={t.id}
                  task={t}
                  onToggle={toggleTask}
                  onRemove={removeTask}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>
    </div>
  );
}

function NavBtn({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-xl surface text-lg text-[var(--color-fg-dim)]"
    >
      {children}
    </motion.button>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}
