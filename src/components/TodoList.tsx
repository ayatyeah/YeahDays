"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  useUserStore,
  isTodoOnDay,
  isTodoDone,
  isTodoOverdue,
  PRIORITY_LABEL,
  PRIORITY_COLOR,
  REPEAT_LABEL,
  type Todo,
  type TodoPriority,
  type RepeatKind,
} from "@/store/useUserStore";
import { dateKey } from "@/lib/domain";
import { cn } from "@/lib/cn";
import { listVariants, itemVariants, spring, springSnappy } from "@/lib/motion";

type Filter = "active" | "all" | "done";

/** Дата через N дней. */
function shiftDay(day: string, n: number): string {
  const d = new Date(`${day}T00:00:00`);
  d.setDate(d.getDate() + n);
  return dateKey(d);
}

/**
 * Список собственных задач.
 *
 * Колода отвечает за «что бы полезного сделать», а это — за конкретные
 * дела, которые человек записал сам. Поэтому здесь привычный набор
 * тудушника: приоритет, час, длительность, подзадачи, заметка, повтор,
 * перенос и отмена удаления.
 */
export default function TodoList({ day = dateKey() }: { day?: string }) {
  const todos = useUserStore((s) => s.todos);
  const addTodo = useUserStore((s) => s.addTodo);
  const toggleTodo = useUserStore((s) => s.toggleTodo);
  const removeTodo = useUserStore((s) => s.removeTodo);
  const restoreTodo = useUserStore((s) => s.restoreTodo);
  const moveTodo = useUserStore((s) => s.moveTodo);

  const [draft, setDraft] = useState("");
  const [filter, setFilter] = useState<Filter>("active");
  const [openId, setOpenId] = useState<string | null>(null);
  const [undo, setUndo] = useState<Todo | null>(null);
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isToday = day === dateKey();

  /** Задачи этого дня + просроченные (их нельзя терять). */
  const list = useMemo(() => {
    const onDay = todos.filter((t) => isTodoOnDay(t, day));
    const overdue = isToday
      ? todos.filter((t) => isTodoOverdue(t, day) && !isTodoOnDay(t, day))
      : [];
    const all = [...overdue, ...onDay];

    const filtered = all.filter((t) => {
      const done = isTodoDone(t, day);
      if (filter === "active") return !done;
      if (filter === "done") return done;
      return true;
    });

    // порядок: сначала со временем (по часу), потом по приоритету
    const rank: Record<TodoPriority, number> = { high: 0, normal: 1, low: 2 };
    return filtered.sort((a, b) => {
      const ah = a.hour ?? 99;
      const bh = b.hour ?? 99;
      if (ah !== bh) return ah - bh;
      return rank[a.priority] - rank[b.priority];
    });
  }, [todos, day, filter, isToday]);

  const activeCount = todos.filter(
    (t) => isTodoOnDay(t, day) && !isTodoDone(t, day),
  ).length;

  function handleRemove(t: Todo) {
    removeTodo(t.id);
    setUndo(t);
    if (undoTimer.current) clearTimeout(undoTimer.current);
    undoTimer.current = setTimeout(() => setUndo(null), 6000);
  }

  return (
    <section className="mt-5">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-[13px] font-semibold text-[var(--color-fg-dim)]">
          Мои задачи{activeCount > 0 ? ` · ${activeCount}` : ""}
        </h2>
        <div className="flex gap-2">
          {(
            [
              ["active", "активные"],
              ["all", "все"],
              ["done", "готовы"],
            ] as [Filter, string][]
          ).map(([k, label]) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={cn(
                "text-[11.5px] transition",
                filter === k
                  ? "font-semibold text-[var(--color-fg)]"
                  : "text-[var(--color-muted)]",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Быстрый ввод */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const title = draft.trim();
          if (!title) return;
          addTodo({ title, date: day });
          setDraft("");
        }}
        className="mb-2.5 flex gap-2"
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Что нужно сделать?"
          maxLength={120}
          className="h-11 min-w-0 flex-1 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 text-[13.5px] outline-none focus:border-[var(--color-fg-dim)]"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          className="h-11 shrink-0 rounded-2xl bg-[var(--color-fg)] px-4 text-[13.5px] font-semibold text-[var(--color-bg)] transition active:scale-[0.98] disabled:opacity-40"
        >
          +
        </button>
      </form>

      {list.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-[var(--color-border)] px-4 py-4 text-center text-[12px] text-[var(--color-muted)]">
          {filter === "done" ? "Пока ничего не закрыто" : "Задач нет"}
        </p>
      ) : (
        <motion.div
          variants={listVariants}
          initial="initial"
          animate="animate"
          className="list-virtual space-y-1.5"
        >
          <AnimatePresence initial={false}>
            {list.map((t) => (
              <TodoRow
                key={t.id}
                todo={t}
                day={day}
                open={openId === t.id}
                onOpen={() => setOpenId(openId === t.id ? null : t.id)}
                onToggle={() => toggleTodo(t.id, day)}
                onRemove={() => handleRemove(t)}
                onTomorrow={() => moveTodo(t.id, shiftDay(day, 1))}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Отмена удаления */}
      <AnimatePresence>
        {undo && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="mt-2 flex items-center justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-2.5"
          >
            <span className="min-w-0 truncate text-[12px] text-[var(--color-muted)]">
              Удалено: {undo.title}
            </span>
            <button
              onClick={() => {
                restoreTodo(undo);
                setUndo(null);
              }}
              className="shrink-0 text-[12px] font-semibold"
            >
              Вернуть
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function TodoRow({
  todo: t,
  day,
  open,
  onOpen,
  onToggle,
  onRemove,
  onTomorrow,
}: {
  todo: Todo;
  day: string;
  open: boolean;
  onOpen: () => void;
  onToggle: () => void;
  onRemove: () => void;
  onTomorrow: () => void;
}) {
  const updateTodo = useUserStore((s) => s.updateTodo);
  const addSubtask = useUserStore((s) => s.addSubtask);
  const toggleSubtask = useUserStore((s) => s.toggleSubtask);
  const removeSubtask = useUserStore((s) => s.removeSubtask);

  const [sub, setSub] = useState("");
  const done = isTodoDone(t, day);
  const overdue = isTodoOverdue(t, day);
  const subDone = t.subtasks.filter((x) => x.done).length;

  return (
    <motion.div
      layout
      variants={itemVariants}
      initial="initial"
      animate="animate"
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={spring}
      className="overflow-hidden rounded-2xl surface"
    >
      <div className="flex items-center gap-2.5 px-3 py-2.5">
        <button
          onClick={onToggle}
          aria-label={done ? "снять отметку" : "выполнить"}
          className={cn(
            "h-6 w-6 shrink-0 rounded-lg border text-[12px] transition",
            done
              ? "border-transparent bg-[var(--color-stability)] text-[var(--color-bg)]"
              : "border-[var(--color-border)]",
          )}
          style={
            !done ? { borderColor: PRIORITY_COLOR[t.priority] } : undefined
          }
        >
          {done ? "✓" : ""}
        </button>

        <button onClick={onOpen} className="min-w-0 flex-1 text-left">
          <span
            className={cn(
              "block truncate text-[13.5px]",
              done && "text-[var(--color-muted)] line-through",
            )}
          >
            {t.title}
          </span>
          <span className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[11px] text-[var(--color-muted)]">
            {overdue && (
              <span className="text-[var(--color-strength)]">просрочено</span>
            )}
            {t.hour !== undefined && (
              <span>{String(t.hour).padStart(2, "0")}:00</span>
            )}
            {t.duration ? <span>{t.duration} мин</span> : null}
            {t.priority !== "normal" && <span>{PRIORITY_LABEL[t.priority]}</span>}
            {t.repeat && <span>↻ {REPEAT_LABEL[t.repeat.kind]}</span>}
            {t.subtasks.length > 0 && (
              <span>
                {subDone}/{t.subtasks.length}
              </span>
            )}
            {t.note && <span>📝</span>}
          </span>
        </button>

        <button
          onClick={onOpen}
          aria-label="подробнее"
          className="press shrink-0 px-1 text-[12px] text-[var(--color-muted)]"
        >
          {open ? "▴" : "▾"}
        </button>
      </div>

      {open && (
        <div className="border-t border-[var(--color-border)] px-3 py-3">
          {/* Приоритет */}
          <div className="mb-2 grid grid-cols-3 gap-1.5">
            {(["high", "normal", "low"] as TodoPriority[]).map((p) => (
              <button
                key={p}
                onClick={() => updateTodo(t.id, { priority: p })}
                className={cn(
                  "rounded-xl border py-1.5 text-[11.5px] transition",
                  t.priority === p
                    ? "border-[var(--color-fg)] bg-[var(--color-surface-2)]"
                    : "border-[var(--color-border)] text-[var(--color-muted)]",
                )}
              >
                {PRIORITY_LABEL[p]}
              </button>
            ))}
          </div>

          {/* Время и длительность */}
          <div className="mb-2 flex gap-1.5">
            <select
              value={t.hour ?? ""}
              onChange={(e) =>
                updateTodo(t.id, {
                  hour: e.target.value === "" ? undefined : Number(e.target.value),
                })
              }
              className="h-9 flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-2 text-[12px] outline-none"
              aria-label="Час"
            >
              <option value="">без времени</option>
              {Array.from({ length: 24 }, (_, h) => (
                <option key={h} value={h}>
                  {String(h).padStart(2, "0")}:00
                </option>
              ))}
            </select>
            <select
              value={t.duration ?? ""}
              onChange={(e) =>
                updateTodo(t.id, {
                  duration:
                    e.target.value === "" ? undefined : Number(e.target.value),
                })
              }
              className="h-9 flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-2 text-[12px] outline-none"
              aria-label="Длительность"
            >
              <option value="">без длительности</option>
              {[5, 10, 15, 30, 45, 60, 90, 120].map((m) => (
                <option key={m} value={m}>
                  {m} мин
                </option>
              ))}
            </select>
          </div>

          {/* Повтор */}
          <div className="mb-2 flex flex-wrap gap-1.5">
            <button
              onClick={() => updateTodo(t.id, { repeat: undefined })}
              className={cn(
                "rounded-xl border px-2.5 py-1.5 text-[11px] transition",
                !t.repeat
                  ? "border-[var(--color-fg)] bg-[var(--color-surface-2)]"
                  : "border-[var(--color-border)] text-[var(--color-muted)]",
              )}
            >
              разово
            </button>
            {(
              ["daily", "weekdays", "weekends", "weekly", "everyOther"] as RepeatKind[]
            ).map((k) => (
              <button
                key={k}
                onClick={() => updateTodo(t.id, { repeat: { kind: k } })}
                className={cn(
                  "rounded-xl border px-2.5 py-1.5 text-[11px] transition",
                  t.repeat?.kind === k
                    ? "border-[var(--color-fg)] bg-[var(--color-surface-2)]"
                    : "border-[var(--color-border)] text-[var(--color-muted)]",
                )}
              >
                {REPEAT_LABEL[k]}
              </button>
            ))}
          </div>

          {/* Заметка */}
          <textarea
            value={t.note ?? ""}
            onChange={(e) => updateTodo(t.id, { note: e.target.value })}
            placeholder="Заметка…"
            rows={2}
            className="mb-2 w-full resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-[12.5px] outline-none"
          />

          {/* Подзадачи */}
          {t.subtasks.length > 0 && (
            <div className="mb-2 space-y-1">
              {t.subtasks.map((x) => (
                <div key={x.id} className="flex items-center gap-2">
                  <button
                    onClick={() => toggleSubtask(t.id, x.id)}
                    className={cn(
                      "h-5 w-5 shrink-0 rounded border text-[10px]",
                      x.done
                        ? "border-transparent bg-[var(--color-stability)] text-[var(--color-bg)]"
                        : "border-[var(--color-border)]",
                    )}
                    aria-label="подзадача"
                  >
                    {x.done ? "✓" : ""}
                  </button>
                  <span
                    className={cn(
                      "min-w-0 flex-1 truncate text-[12.5px]",
                      x.done && "text-[var(--color-muted)] line-through",
                    )}
                  >
                    {x.title}
                  </span>
                  <button
                    onClick={() => removeSubtask(t.id, x.id)}
                    className="press shrink-0 px-1 text-[11px] text-[var(--color-muted)]"
                    aria-label="удалить подзадачу"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!sub.trim()) return;
              addSubtask(t.id, sub);
              setSub("");
            }}
            className="mb-2 flex gap-1.5"
          >
            <input
              value={sub}
              onChange={(e) => setSub(e.target.value)}
              placeholder="+ подзадача"
              className="h-9 min-w-0 flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 text-[12.5px] outline-none"
            />
          </form>

          <div className="flex gap-1.5">
            <button
              onClick={onTomorrow}
              disabled={Boolean(t.repeat)}
              className="press flex-1 rounded-xl border border-[var(--color-border)] py-2 text-[11.5px] text-[var(--color-muted)] disabled:opacity-40"
            >
              на завтра →
            </button>
            <button
              onClick={onRemove}
              className="press rounded-xl border border-[var(--color-border)] px-3 py-2 text-[11.5px] text-[var(--color-strength)]"
            >
              удалить
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
