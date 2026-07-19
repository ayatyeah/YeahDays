"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { CATEGORIES } from "@/lib/categories";
import { useUserStore, type Task } from "@/store/useUserStore";
import { cn } from "@/lib/cn";

export default function TaskItem({ task }: { task: Task }) {
  const toggleTask = useUserStore((s) => s.toggleTask);
  const deleteTask = useUserStore((s) => s.deleteTask);
  const cat = CATEGORIES[task.category];
  const [floats, setFloats] = useState<number[]>([]);
  const idRef = useRef(0);

  function handleToggle() {
    const willComplete = !task.completed;
    toggleTask(task.id);
    if (willComplete) {
      const id = ++idRef.current;
      setFloats((f) => [...f, id]);
      window.setTimeout(
        () => setFloats((f) => f.filter((x) => x !== id)),
        850,
      );
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className="group flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-3"
    >
      {/* чекбокс выполнения */}
      <div className="relative shrink-0">
        <motion.button
          onClick={handleToggle}
          whileTap={{ scale: 0.85 }}
          aria-label={task.completed ? "Отменить" : "Выполнить"}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-full border-2 transition",
            task.completed
              ? "border-transparent"
              : "border-[var(--color-border)] hover:border-[var(--color-fg-dim)]",
          )}
          style={task.completed ? { backgroundColor: cat.color } : undefined}
        >
          {task.completed && (
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-[var(--color-bg)]">
              <path
                d="M5 12.5 10 17l9-10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </motion.button>

        {/* награда за выполнение: кольцо + всплывающий +XP */}
        <AnimatePresence>
          {floats.map((id) => (
            <motion.span
              key={`ring-${id}`}
              className="pointer-events-none absolute inset-0 rounded-full border-2"
              style={{ borderColor: cat.color }}
              initial={{ opacity: 0.7, scale: 1 }}
              animate={{ opacity: 0, scale: 2.1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          ))}
          {floats.map((id) => (
            <motion.span
              key={`xp-${id}`}
              className="pointer-events-none absolute -top-1 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold text-[var(--color-xp)]"
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: -22 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              +{task.xp}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      {/* текст */}
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate text-sm font-medium",
            task.completed && "text-[var(--color-muted)] line-through",
          )}
        >
          {task.title}
        </p>
        <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-[var(--color-muted)]">
          <span>{cat.emoji}</span>
          <span>{cat.label}</span>
          <span>·</span>
          <span className="text-[var(--color-xp)]">+{task.xp} XP</span>
        </p>
      </div>

      {/* удалить */}
      <button
        onClick={() => deleteTask(task.id)}
        aria-label="Удалить"
        className="shrink-0 rounded-lg p-1.5 text-[var(--color-muted)] opacity-0 transition hover:text-[var(--color-discipline)] group-hover:opacity-100"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
          <path
            d="M6 6l12 12M18 6L6 18"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </motion.div>
  );
}
