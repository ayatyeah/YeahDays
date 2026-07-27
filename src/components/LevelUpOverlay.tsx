"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  useUserStore,
  useHydrated,
  selectTotalXp,
  selectStats,
} from "@/store/useUserStore";
import { getLevelProgress, tierForLevel, TIER_MILESTONES } from "@/lib/leveling";
import Avatar3D from "./AvatarLazy";

/**
 * Оверлей повышения уровня.
 *
 * Сам следит за уровнем: любая страница может просто отрендерить <LevelUpOverlay />.
 * Это момент эмоциональной награды — здесь показываем 3D-персонажа крупно.
 */
export default function LevelUpOverlay() {
  const hydrated = useHydrated();
  const plan = useUserStore((s) => s.plan);
  const seenLevel = useUserStore((s) => s.seenLevel);
  const markSeenLevel = useUserStore((s) => s.markSeenLevel);

  const totalXp = useMemo(() => selectTotalXp(plan), [plan]);
  const stats = useMemo(() => selectStats(plan), [plan]);
  const level = getLevelProgress(totalXp).level;

  // портал в body: страница завёрнута в .gpu-layer (transform), а fixed внутри
  // transform-предка позиционируется от него, а не от экрана — полноэкранный
  // оверлей уезжал бы по длине страницы. См. ui/Modal.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [state, setState] = useState<{
    open: boolean;
    level: number;
    milestone: string | null;
  }>({ open: false, level: 1, milestone: null });

  useEffect(() => {
    if (!hydrated || level <= seenLevel) return;
    const crossed = tierForLevel(level) > tierForLevel(seenLevel);
    const milestone = crossed
      ? (TIER_MILESTONES.find((m) => m.tier === tierForLevel(level))?.label ?? null)
      : null;
    setState({ open: true, level, milestone });
  }, [hydrated, level, seenLevel]);

  function close() {
    markSeenLevel(state.level);
    setState((s) => ({ ...s, open: false }));
  }

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {state.open && (
        <motion.div
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-[var(--color-bg)]/96"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          {/* лучи */}
          <motion.div
            className="pointer-events-none absolute h-[440px] w-[440px]"
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            {Array.from({ length: 14 }).map((_, i) => (
              <span
                key={i}
                className="absolute left-1/2 top-0 origin-bottom"
                style={{
                  width: 2,
                  height: "50%",
                  marginLeft: -1,
                  background:
                    "linear-gradient(to top, rgba(180,200,255,0.35), transparent)",
                  transform: `rotate(${i * (360 / 14)}deg)`,
                }}
              />
            ))}
          </motion.div>

          <motion.div
            initial={{ scale: 0.85, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
            className="relative flex flex-col items-center px-8 text-center"
          >
            <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
              Новый уровень
            </p>
            <p className="mt-1 text-[68px] font-black leading-none tabular-nums">
              {state.level}
            </p>

            <div className="my-2 h-[230px] w-[230px]">
              <Avatar3D
                stats={stats}
                level={state.level}
                interactive={false}
                celebrate={1}
                className="h-full w-full"
              />
            </div>

            {state.milestone && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="rounded-full bg-[var(--color-surface)] px-4 py-2 text-[14px] font-bold"
              >
                Форма: {state.milestone}
              </motion.p>
            )}

            <p className="mt-3 max-w-[260px] text-[14px] leading-snug text-[var(--color-fg-dim)]">
              Твой персонаж стал сильнее. Так выглядит накопленный
              результат маленьких действий.
            </p>

            <button
              onClick={close}
              className="press mt-6 h-12 rounded-2xl bg-[var(--color-fg)] px-7 text-[15px] font-semibold text-[var(--color-bg)] shadow-[var(--shadow-2)]"
            >
              Продолжить
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
