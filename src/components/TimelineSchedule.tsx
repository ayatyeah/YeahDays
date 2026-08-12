"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  useUserStore,
  isTodoOnDay,
  isTodoDone,
  PRIORITY_COLOR,
  type Todo,
  type TodoPriority,
} from "@/store/useUserStore";
import { dateKey } from "@/lib/domain";
import { routineLabelAt } from "@/lib/routine";
import { cn } from "@/lib/cn";

/** Часы, которые показываем по умолчанию (сон не расписываем). */
const DEFAULT_FROM = 6;
const DEFAULT_TO = 23;
/** px на час — задаёт и высоту строки, и масштаб длительности задачи. */
const ROW_HEIGHT = 56;
const MIN_BLOCK_HEIGHT = 30;
const PRIORITY_ORDER: TodoPriority[] = ["low", "normal", "high"];

/**
 * Почасовой план дня — настоящие задачи как перетаскиваемые плашки, а не
 * свободный текст (это заменило прежний DaySchedule с текстовым полем на
 * каждый час — старые данные в schedule[] остались в сторе нетронутыми на
 * случай отката, просто здесь больше не рендерятся).
 *
 * Клик по пустому часу — создаёт задачу прямо на этом часе (title, hour,
 * duration=60, priority="normal" через тот же addTodo, что и в TodoList —
 * это ровно те же задачи, просто другой способ их завести и увидеть).
 * Перетаскивание плашки по вертикали — меняет час (updateTodo). Цвет —
 * по приоритету (тот же PRIORITY_COLOR, что и в списке задач).
 */
export default function TimelineSchedule({
  day = dateKey(),
  compact = false,
}: {
  day?: string;
  compact?: boolean;
}) {
  const todos = useUserStore((s) => s.todos);
  const addTodo = useUserStore((s) => s.addTodo);
  const updateTodo = useUserStore((s) => s.updateTodo);
  const removeTodo = useUserStore((s) => s.removeTodo);
  const toggleTodo = useUserStore((s) => s.toggleTodo);

  const [expanded, setExpanded] = useState(!compact);
  const [showNight, setShowNight] = useState(false);
  const [addingHour, setAddingHour] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const hours = useMemo(() => {
    if (showNight) return Array.from({ length: 24 }, (_, i) => i);
    return Array.from(
      { length: DEFAULT_TO - DEFAULT_FROM + 1 },
      (_, i) => i + DEFAULT_FROM,
    );
  }, [showNight]);
  const startHour = hours[0] ?? 0;
  const endHour = hours[hours.length - 1] ?? 23;

  const scheduled = useMemo(
    () =>
      todos.filter(
        (t) =>
          isTodoOnDay(t, day) &&
          t.hour != null &&
          t.hour >= startHour &&
          t.hour <= endHour,
      ),
    [todos, day, startHour, endHour],
  );

  /** Группировка по часу — задачи в одно время встают бок о бок, не наложением. */
  const byHour = useMemo(() => {
    const map = new Map<number, Todo[]>();
    for (const t of scheduled) {
      const h = t.hour!;
      const list = map.get(h) ?? [];
      list.push(t);
      map.set(h, list);
    }
    return map;
  }, [scheduled]);

  const nowHour = new Date().getHours();
  const isToday = day === dateKey();
  const weekday = useMemo(() => new Date(`${day}T00:00:00`).getDay(), [day]);
  const filled = scheduled.length;

  function commitAdd(hour: number) {
    const title = draft.trim();
    setAddingHour(null);
    setDraft("");
    if (!title) return;
    addTodo({ title, date: day, hour, duration: 60, priority: "normal" });
  }

  function cyclePriority(t: Todo) {
    const next =
      PRIORITY_ORDER[(PRIORITY_ORDER.indexOf(t.priority) + 1) % PRIORITY_ORDER.length]!;
    updateTodo(t.id, { priority: next });
  }

  function handleDragEnd(t: Todo, offsetY: number) {
    const deltaHours = Math.round(offsetY / ROW_HEIGHT);
    if (!deltaHours) return;
    const next = Math.min(endHour, Math.max(startHour, t.hour! + deltaHours));
    if (next !== t.hour) updateTodo(t.id, { hour: next });
  }

  return (
    <section className="mt-5">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-[13px] font-semibold text-[var(--color-fg-dim)]">
          Расписание дня
        </h2>
        {compact && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-[12px] font-medium text-[var(--color-muted)] transition hover:text-[var(--color-fg)]"
          >
            {expanded ? "свернуть" : `${filled || "—"} записей`}
          </button>
        )}
      </div>

      {expanded && (
        <div className="flex overflow-hidden rounded-3xl surface">
          {/* Подписи часов — своя колонка, чтобы не мешать расчёту позиции плашек. */}
          <div className="w-14 shrink-0">
            {hours.map((h) => {
              const isNow = isToday && h === nowHour;
              return (
                <div
                  key={h}
                  style={{ height: ROW_HEIGHT }}
                  className={cn(
                    "flex items-center justify-center border-b border-[var(--color-border)] text-[12px] tabular-nums last:border-b-0",
                    isNow ? "font-bold text-[var(--color-fg)]" : "text-[var(--color-muted)]",
                  )}
                >
                  {String(h).padStart(2, "0")}:00
                </div>
              );
            })}
          </div>

          {/* Сетка часов + плашки задач поверх (absolute, координаты — только относительно этого контейнера). */}
          <div ref={containerRef} className="relative min-w-0 flex-1">
            {hours.map((h) => {
              const isNow = isToday && h === nowHour;
              const routine = routineLabelAt(weekday, h);
              const hasBlocks = (byHour.get(h)?.length ?? 0) > 0;
              return (
                <div
                  key={h}
                  style={{ height: ROW_HEIGHT }}
                  className={cn(
                    "border-b border-[var(--color-border)] px-2 last:border-b-0",
                    isNow && "bg-[var(--color-surface-2)]",
                  )}
                >
                  {!hasBlocks &&
                    (addingHour === h ? (
                      <input
                        autoFocus
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onBlur={() => commitAdd(h)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") commitAdd(h);
                          if (e.key === "Escape") {
                            setAddingHour(null);
                            setDraft("");
                          }
                        }}
                        placeholder="Что запланировано?"
                        maxLength={80}
                        className="h-full w-full bg-transparent text-[13px] outline-none placeholder:text-[var(--color-muted)]"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setAddingHour(h);
                          setDraft("");
                        }}
                        className="flex h-full w-full items-center text-left text-[13px] text-[var(--color-muted)] transition hover:text-[var(--color-fg-dim)]"
                      >
                        {routine ?? (isNow ? "сейчас…" : "+ добавить")}
                      </button>
                    ))}
                </div>
              );
            })}

            {Array.from(byHour.entries()).flatMap(([h, list]) =>
              list.map((t, i) => {
                const top = (h - startHour) * ROW_HEIGHT + 2;
                const height = Math.max(
                  MIN_BLOCK_HEIGHT,
                  ((t.duration ?? 60) / 60) * ROW_HEIGHT - 4,
                );
                const widthPct = 100 / list.length;
                const done = isTodoDone(t, day);
                return (
                  <motion.div
                    key={t.id}
                    drag="y"
                    dragConstraints={containerRef}
                    dragElastic={0.08}
                    dragMomentum={false}
                    dragSnapToOrigin
                    onDragEnd={(_, info) => handleDragEnd(t, info.offset.y)}
                    layout
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                    className="group absolute cursor-grab overflow-hidden rounded-xl border px-2 py-1 active:cursor-grabbing"
                    style={{
                      top,
                      height,
                      left: `calc(${i * widthPct}% + ${i > 0 ? 3 : 0}px)`,
                      width: `calc(${widthPct}% - 3px)`,
                      background: `color-mix(in srgb, ${PRIORITY_COLOR[t.priority]} 16%, var(--color-surface))`,
                      borderColor: `color-mix(in srgb, ${PRIORITY_COLOR[t.priority]} 45%, transparent)`,
                    }}
                  >
                    <div className="flex h-full items-start gap-1.5">
                      <button
                        type="button"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={() => cyclePriority(t)}
                        className="mt-0.5 h-2 w-2 shrink-0 rounded-full"
                        style={{ background: PRIORITY_COLOR[t.priority] }}
                        aria-label="Сменить приоритет"
                      />
                      <button
                        type="button"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={() => toggleTodo(t.id, day)}
                        className={cn(
                          "min-w-0 flex-1 truncate text-left text-[12px] font-medium leading-tight",
                          done && "text-[var(--color-muted)] line-through",
                        )}
                      >
                        {t.title}
                      </button>
                      <button
                        type="button"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={() => removeTodo(t.id)}
                        className="shrink-0 text-[11px] text-[var(--color-muted)] opacity-0 transition hover:text-[var(--color-strength)] group-hover:opacity-100"
                        aria-label="Удалить задачу"
                      >
                        ✕
                      </button>
                    </div>
                  </motion.div>
                );
              }),
            )}
          </div>
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
