"use client";

import { useMemo, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { dateKey } from "@/lib/domain";
import { cn } from "@/lib/cn";

/** Часы, которые показываем по умолчанию (сон не расписываем). */
const DEFAULT_FROM = 6;
const DEFAULT_TO = 23;

/**
 * Почасовой план дня.
 *
 * Колода отвечает на «что сделать», а это — на «когда именно». Без
 * привязки ко времени намерение остаётся намерением: в расписании видно,
 * что 19:00 уже занято, и обещание «позанимаюсь вечером» перестаёт быть
 * абстрактным.
 *
 * Пишется свободным текстом: жёсткая привязка к действиям только мешала
 * бы — в дне есть работа, дорога и ужин, а не только карточки из колоды.
 */
export default function DaySchedule({
  day = dateKey(),
  compact = false,
}: {
  day?: string;
  compact?: boolean;
}) {
  const schedule = useUserStore((s) => s.schedule);
  const setScheduleSlot = useUserStore((s) => s.setScheduleSlot);
  const clearScheduleDay = useUserStore((s) => s.clearScheduleDay);

  const [expanded, setExpanded] = useState(!compact);
  const [showNight, setShowNight] = useState(false);

  const dayPlan = useMemo(() => schedule[day] ?? {}, [schedule, day]);
  const filled = Object.keys(dayPlan).length;

  const hours = useMemo(() => {
    if (showNight) return Array.from({ length: 24 }, (_, i) => i);
    return Array.from(
      { length: DEFAULT_TO - DEFAULT_FROM + 1 },
      (_, i) => i + DEFAULT_FROM,
    );
  }, [showNight]);

  const nowHour = new Date().getHours();
  const isToday = day === dateKey();

  return (
    <section className="mt-5">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-[13px] font-semibold text-[var(--color-fg-dim)]">
          Расписание дня
        </h2>
        <div className="flex items-center gap-3">
          {filled > 0 && (
            <button
              onClick={() => clearScheduleDay(day)}
              className="text-[11.5px] text-[var(--color-muted)] transition hover:text-[var(--color-strength)]"
            >
              очистить
            </button>
          )}
          {compact && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="text-[12px] font-medium text-[var(--color-muted)] transition hover:text-[var(--color-fg)]"
            >
              {expanded ? "свернуть" : `${filled || "—"} записей`}
            </button>
          )}
        </div>
      </div>

      {expanded && (
        <div className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          {hours.map((h) => {
            const isNow = isToday && h === nowHour;
            const value = dayPlan[String(h)] ?? "";
            return (
              <div
                key={h}
                className={cn(
                  "flex items-stretch border-b border-[var(--color-border)] last:border-b-0",
                  isNow && "bg-[var(--color-surface-2)]",
                )}
              >
                <div
                  className={cn(
                    "flex w-14 shrink-0 items-center justify-center text-[12px] tabular-nums",
                    isNow
                      ? "font-bold text-[var(--color-fg)]"
                      : "text-[var(--color-muted)]",
                  )}
                >
                  {String(h).padStart(2, "0")}:00
                </div>
                <input
                  value={value}
                  onChange={(e) => setScheduleSlot(day, h, e.target.value)}
                  placeholder={isNow ? "сейчас…" : ""}
                  maxLength={80}
                  className="min-w-0 flex-1 bg-transparent py-3 pr-3 text-[13px] outline-none placeholder:text-[var(--color-muted)]"
                  aria-label={`План на ${h}:00`}
                />
              </div>
            );
          })}
        </div>
      )}

      {expanded && (
        <button
          onClick={() => setShowNight((v) => !v)}
          className="mt-2 w-full text-center text-[11.5px] text-[var(--color-muted)] transition hover:text-[var(--color-fg-dim)]"
        >
          {showNight ? "скрыть ночные часы" : "показать все 24 часа"}
        </button>
      )}
    </section>
  );
}
