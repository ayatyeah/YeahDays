"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  useUserStore,
  useHydrated,
  selectToday,
  selectStreak,
  selectTotalXp,
} from "@/store/useUserStore";
import { getLevelProgress } from "@/lib/leveling";
import { dateKey } from "@/lib/domain";

const CONFETTI_COLORS = ["#f97362", "#8b7cf6", "#f0b23f", "#3fbf9a", "#ededf0"];

/** Стабильные (не Math.random в рендере) частицы конфетти. */
const PIECES = Array.from({ length: 34 }).map((_, i) => ({
  id: i,
  left: (i * 37) % 100,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  delay: (i % 10) * 0.05,
  drift: ((i % 7) - 3) * 14,
  rotate: (i % 2 ? 1 : -1) * (180 + (i % 5) * 90),
  duration: 1.7 + (i % 5) * 0.25,
  size: 6 + (i % 3) * 3,
}));

/**
 * Празднование закрытого дня. Показывается один раз в день, когда все
 * взятые действия выполнены. Не модальное окно (не мешает level-up) —
 * конфетти + плашка со стриком, авто-исчезает.
 */
export default function DayCompleteOverlay() {
  const hydrated = useHydrated();
  const plan = useUserStore((s) => s.plan);
  const seenLevel = useUserStore((s) => s.seenLevel);
  const lastCelebratedDay = useUserStore((s) => s.lastCelebratedDay);
  const markDayCelebrated = useUserStore((s) => s.markDayCelebrated);

  const today = useMemo(() => selectToday(plan), [plan]);
  const streak = useMemo(() => selectStreak(plan), [plan]);
  const level = useMemo(
    () => getLevelProgress(selectTotalXp(plan)).level,
    [plan],
  );
  const allDone = today.length > 0 && today.every((t) => t.completed);

  // Плашку не показываем, если одновременно случился level-up: его модалка
  // перекрыла бы текст. Конфетти при этом сыплется поверх — z выше модалки.
  const [state, setState] = useState({ open: false, pill: true });
  const todayKey = dateKey();

  useEffect(() => {
    if (!hydrated) return;
    if (allDone && lastCelebratedDay !== todayKey) {
      setState({ open: true, pill: level <= seenLevel });
      markDayCelebrated(todayKey);
      const t = window.setTimeout(
        () => setState((s) => ({ ...s, open: false })),
        3800,
      );
      return () => window.clearTimeout(t);
    }
  }, [hydrated, allDone, lastCelebratedDay, todayKey, level, seenLevel, markDayCelebrated]);

  return (
    <AnimatePresence>
      {state.open && (
        <div
          className="pointer-events-none fixed inset-0 z-[65] overflow-hidden"
          aria-hidden
        >
          {/* конфетти */}
          {PIECES.map((p) => (
            <motion.span
              key={p.id}
              className="absolute top-[-6%] rounded-[2px]"
              style={{
                left: `${p.left}%`,
                width: p.size,
                height: p.size * 1.4,
                background: p.color,
              }}
              initial={{ y: "-10vh", opacity: 0, rotate: 0 }}
              animate={{
                y: "110vh",
                x: p.drift,
                opacity: [0, 1, 1, 0.9],
                rotate: p.rotate,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }}
            />
          ))}

          {/* плашка (скрыта, если поверх идёт level-up) */}
          {state.pill && (
          <motion.div
            className="absolute inset-x-0 top-[16%] flex justify-center px-6"
            initial={{ opacity: 0, y: -16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <div className="flex flex-col items-center rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]/95 px-7 py-5 text-center shadow-2xl shadow-black/50">
              <span className="text-4xl">🔥</span>
              <p className="mt-2 text-[19px] font-black tracking-tight">
                День закрыт!
              </p>
              <p className="mt-1 text-[13.5px] text-[var(--color-fg-dim)]">
                {streak > 1
                  ? `${streak} дней подряд — так и растут`
                  : "Отличное начало серии"}
              </p>
            </div>
          </motion.div>
          )}
        </div>
      )}
    </AnimatePresence>
  );
}
