"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

interface Props {
  open: boolean;
  level: number;
  milestoneLabel: string | null;
  onClose: () => void;
}

const PARTICLES = Array.from({ length: 22 }).map((_, i) => {
  const angle = (i / 22) * Math.PI * 2;
  return {
    x: Math.cos(angle) * (120 + (i % 5) * 26),
    y: Math.sin(angle) * (120 + (i % 5) * 26),
    delay: (i % 6) * 0.02,
  };
});

export default function LevelUpOverlay({
  open,
  level,
  milestoneLabel,
  onClose,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(onClose, 4200);
    return () => clearTimeout(t);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black/75 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <div className="relative flex flex-col items-center">
            {/* частицы */}
            {PARTICLES.map((p, i) => (
              <motion.span
                key={i}
                className="absolute h-1.5 w-1.5 rounded-full"
                style={{
                  backgroundColor:
                    milestoneLabel != null
                      ? "var(--color-body)"
                      : "var(--color-xp)",
                }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.3 }}
                transition={{ duration: 1.1, delay: p.delay, ease: "easeOut" }}
              />
            ))}

            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="flex flex-col items-center"
            >
              {milestoneLabel && (
                <span className="mb-2 rounded-full border border-[var(--color-body)]/40 bg-[var(--color-body)]/10 px-3 py-1 text-xs font-medium tracking-wide text-[var(--color-body)]">
                  Новая форма · {milestoneLabel}
                </span>
              )}
              <span className="text-sm uppercase tracking-[0.3em] text-[var(--color-fg-dim)]">
                Уровень
              </span>
              <span className="text-7xl font-bold tabular-nums text-[var(--color-fg)]">
                {level}
              </span>
            </motion.div>
          </div>
          <p className="mt-10 text-xs text-[var(--color-muted)]">
            нажми, чтобы продолжить
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
