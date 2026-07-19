"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { useUserStore, selectLevel } from "@/store/useUserStore";
import { tierForLevel } from "@/lib/leveling";

const TINT: Record<number, string> = {
  1: "rgba(90,95,110,0.16)",
  2: "rgba(140,150,170,0.16)",
  3: "rgba(125,211,252,0.16)",
  4: "rgba(190,220,255,0.22)",
};

/**
 * Тихий анимированный фон: пара размытых световых пятен, медленно
 * дрейфующих за сценой. Цвет подхватывает тир персонажа.
 */
export default function Ambient() {
  const tasks = useUserStore((s) => s.tasks);
  const tier = useMemo(() => tierForLevel(selectLevel(tasks)), [tasks]);
  const tint = TINT[tier];

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <motion.div
        className="absolute -left-24 -top-24 h-80 w-80 rounded-full"
        style={{ background: tint, filter: "blur(60px)" }}
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-20 top-1/3 h-72 w-72 rounded-full"
        style={{ background: tint, filter: "blur(70px)" }}
        animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-10 left-1/4 h-64 w-64 rounded-full"
        style={{ background: tint, filter: "blur(80px)" }}
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* лёгкая виньетка сверху для глубины */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,transparent_50%,rgba(0,0,0,0.5)_100%)]" />
    </div>
  );
}
