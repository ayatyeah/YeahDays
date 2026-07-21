"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { useUserStore, selectStats } from "@/store/useUserStore";
import { dominantStat, STAT_HEX } from "@/lib/avatar3d";

/**
 * Тихий анимированный фон. Цвет подхватывает доминирующий стат:
 * приложение визуально «окрашивается» в то, что ты качаешь.
 */
export default function Ambient() {
  const plan = useUserStore((s) => s.plan);
  const tint = useMemo(() => {
    const stats = selectStats(plan);
    const total = Object.values(stats).reduce((a, b) => a + b, 0);
    if (total === 0) return "rgba(110,115,135,0.13)";
    const hex = STAT_HEX[dominantStat(stats)];
    return `${hex}1f`;
  }, [plan]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute -left-24 -top-24 h-80 w-80 rounded-full"
        style={{ background: tint, filter: "blur(70px)" }}
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-20 top-1/3 h-72 w-72 rounded-full"
        style={{ background: tint, filter: "blur(80px)" }}
        animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-10 left-1/4 h-64 w-64 rounded-full"
        style={{ background: tint, filter: "blur(90px)" }}
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,transparent_50%,rgba(0,0,0,0.55)_100%)]" />
    </div>
  );
}
