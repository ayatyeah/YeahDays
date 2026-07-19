"use client";

import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import TaskItem from "@/components/TaskItem";
import Button from "@/components/ui/Button";
import { useUserStore } from "@/store/useUserStore";
import { useUiStore } from "@/store/useUiStore";
import { cn } from "@/lib/cn";

const MONTHS = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];
const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function keyOf(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export default function CalendarPage() {
  const tasks = useUserStore((s) => s.tasks);
  const openCreate = useUiStore((s) => s.openCreate);

  const today = new Date();
  const todayKey = keyOf(today.getFullYear(), today.getMonth(), today.getDate());

  const [view, setView] = useState({
    y: today.getFullYear(),
    m: today.getMonth(),
  });
  const [selected, setSelected] = useState<string>(todayKey);

  const byDate = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of tasks) {
      if (t.dueDate) map.set(t.dueDate, (map.get(t.dueDate) ?? 0) + 1);
    }
    return map;
  }, [tasks]);

  const selectedTasks = useMemo(
    () => tasks.filter((t) => t.dueDate === selected),
    [tasks, selected],
  );

  // сетка дней (неделя с понедельника)
  const cells = useMemo(() => {
    const first = new Date(view.y, view.m, 1);
    const startDow = (first.getDay() + 6) % 7; // 0 = Пн
    const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
    const arr: (number | null)[] = [];
    for (let i = 0; i < startDow; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(d);
    return arr;
  }, [view]);

  function shift(delta: number) {
    setView((v) => {
      const m = v.m + delta;
      return {
        y: v.y + Math.floor(m / 12),
        m: ((m % 12) + 12) % 12,
      };
    });
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">
          {MONTHS[view.m]}{" "}
          <span className="text-[var(--color-muted)]">{view.y}</span>
        </h1>
        <div className="flex gap-1">
          <Button variant="surface" size="sm" onClick={() => shift(-1)}>
            ‹
          </Button>
          <Button variant="surface" size="sm" onClick={() => shift(1)}>
            ›
          </Button>
        </div>
      </header>

      {/* дни недели */}
      <div className="mb-1 grid grid-cols-7 gap-1 text-center text-[11px] text-[var(--color-muted)]">
        {WEEKDAYS.map((w) => (
          <div key={w}>{w}</div>
        ))}
      </div>

      {/* сетка */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (d === null) return <div key={i} />;
          const k = keyOf(view.y, view.m, d);
          const has = byDate.has(k);
          const isToday = k === todayKey;
          const isSel = k === selected;
          return (
            <button
              key={i}
              onClick={() => setSelected(k)}
              className={cn(
                "relative flex aspect-square flex-col items-center justify-center rounded-xl border text-sm transition",
                isSel
                  ? "border-[var(--color-fg)] bg-[var(--color-surface-2)]"
                  : "border-transparent hover:bg-[var(--color-surface)]",
                isToday && !isSel && "text-[var(--color-xp)]",
              )}
            >
              <span className={cn(isSel && "font-semibold")}>{d}</span>
              {has && (
                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-[var(--color-xp)]" />
              )}
            </button>
          );
        })}
      </div>

      {/* задачи выбранного дня */}
      <section className="mt-5 flex-1">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[var(--color-fg-dim)]">
            {selected === todayKey ? "Сегодня" : selected}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openCreate(selected)}
          >
            + добавить
          </Button>
        </div>

        {selectedTasks.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-[var(--color-border)] px-4 py-6 text-center text-sm text-[var(--color-muted)]">
            На этот день задач нет.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            <AnimatePresence initial={false}>
              {selectedTasks.map((t) => (
                <TaskItem key={t.id} task={t} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>
    </div>
  );
}
