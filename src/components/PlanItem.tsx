"use client";

import { AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { CATEGORIES, STATS } from "@/lib/domain";
import type { PlannedTask } from "@/store/useUserStore";
import { cn } from "@/lib/cn";

interface PlanItemProps {
  task: PlannedTask;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

export default function PlanItem({ task, onToggle, onRemove }: PlanItemProps) {
  const cat = CATEGORIES[task.snapshot.category];
  const stat = STATS[cat.stat];
  const [floats, setFloats] = useState<number[]>([]);
  const idRef = useRef(0);

  const x = useMotionValue(0);
  const bgOpacity = useTransform(x, [0, 90], [0, 1]);

  function handleToggle() {
    const willComplete = !task.completed;
    onToggle(task.id);
    if (willComplete) {
      const id = ++idRef.current;
      setFloats((f) => [...f, id]);
      window.setTimeout(() => setFloats((f) => f.filter((v) => v !== id)), 900);
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -24, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 320, damping: 30 }}
      className="relative overflow-hidden rounded-3xl"
    >
      {/* фон-подсказка при свайпе */}
      <motion.div
        className="absolute inset-0 flex items-center px-5"
        style={{ background: `${stat.hex}22`, opacity: bgOpacity }}
      >
        <span
          className="text-[13px] font-bold"
          style={{ color: stat.hex }}
        >
          Выполнено ✓
        </span>
      </motion.div>

      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={{ left: 0.02, right: 0.5 }}
        style={{ x }}
        onDragEnd={(_, info) => {
          if (info.offset.x > 84 && !task.completed) handleToggle();
        }}
        className={cn(
          "relative flex items-center gap-3.5 border bg-[var(--color-surface)] px-4 py-3.5",
          "rounded-3xl",
          task.completed
            ? "border-transparent opacity-55"
            : "border-[var(--color-border)]",
        )}
      >
        {/* чекбокс */}
        <div className="relative shrink-0">
          <motion.button
            onClick={handleToggle}
            whileTap={{ scale: 0.85 }}
            aria-label={task.completed ? "Отменить" : "Выполнить"}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full border-2 transition",
              task.completed
                ? "border-transparent"
                : "border-[var(--color-border)] hover:border-[var(--color-fg-dim)]",
            )}
            style={task.completed ? { backgroundColor: stat.hex } : undefined}
          >
            {task.completed && (
              <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 text-[var(--color-bg)]">
                <path
                  d="M5 12.5 10 17l9-10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </motion.button>

          <AnimatePresence>
            {floats.map((id) => (
              <motion.span
                key={`r-${id}`}
                className="pointer-events-none absolute inset-0 rounded-full border-2"
                style={{ borderColor: stat.hex }}
                initial={{ opacity: 0.75, scale: 1 }}
                animate={{ opacity: 0, scale: 2.3 }}
                transition={{ duration: 0.65, ease: "easeOut" }}
              />
            ))}
            {floats.map((id) => (
              <motion.span
                key={`x-${id}`}
                className="pointer-events-none absolute -top-1 left-1/2 -translate-x-1/2 whitespace-nowrap text-[13px] font-bold"
                style={{ color: stat.hex }}
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: -26 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.85, ease: "easeOut" }}
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
              "truncate text-[15px] font-semibold",
              task.completed && "text-[var(--color-muted)] line-through",
            )}
          >
            {task.snapshot.title}
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-[var(--color-muted)]">
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
            <span>·</span>
            <span>{task.snapshot.duration} мин</span>
            <span>·</span>
            <span style={{ color: stat.hex }}>+{task.xp} XP</span>
          </p>
        </div>

        <button
          onClick={() => onRemove(task.id)}
          aria-label="Убрать из плана"
          className="shrink-0 rounded-lg p-1.5 text-[var(--color-muted)] transition hover:text-[var(--color-strength)]"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </motion.div>
    </motion.div>
  );
}
