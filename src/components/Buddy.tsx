"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { tierForLevel, type Tier } from "@/lib/leveling";

interface BuddyProps {
  level: number;
  /** высота фигуры в px */
  size?: number;
  className?: string;
}

const RATIO = 217 / 763; // ширина / высота исходника

// Фильтр по тиру: серый -> возвращается цвет -> яркость + свечение
const FILTER: Record<Tier, string> = {
  1: "grayscale(1) brightness(0.82) contrast(1.05)",
  2: "grayscale(0.5) brightness(0.98)",
  3: "grayscale(0) brightness(1.06) saturate(1.15) hue-rotate(-6deg)",
  4: "grayscale(0) brightness(1.22) saturate(1.25) drop-shadow(0 0 16px rgba(200,230,255,0.75))",
};

const AURA: Record<Tier, string> = {
  1: "rgba(120,120,135,0)",
  2: "rgba(160,165,185,0)",
  3: "rgba(125,211,252,0.35)",
  4: "rgba(210,235,255,0.6)",
};

const PEDESTAL: Record<Tier, string> = {
  1: "#6b7078",
  2: "#9aa0ac",
  3: "#7dd3fc",
  4: "#dbeafe",
};

export default function Buddy({ level, size = 300, className }: BuddyProps) {
  const { tier, growth } = useMemo(() => {
    const t = tierForLevel(level);
    const g = Math.min(Math.max((level - 1) / 99, 0), 1);
    return { tier: t, growth: 0.9 + g * 0.24 };
  }, [level]);

  const width = size * RATIO;

  return (
    <div
      className={className}
      style={{ position: "relative", height: size, width: width * 1.9 }}
      role="img"
      aria-label={`Персонаж, уровень ${level}`}
    >
      {/* аура (веха 50+/100+) */}
      <motion.div
        className="absolute left-1/2 top-[26%] -translate-x-1/2 rounded-full"
        style={{
          width: size * 0.62,
          height: size * 0.62,
          background: AURA[tier],
          filter: "blur(30px)",
        }}
        initial={{ opacity: 0, scale: 1 }}
        animate={{
          opacity: tier >= 3 ? [0.75, 1, 0.75] : 0,
          scale: tier >= 3 ? [1, 1.08, 1] : 1,
        }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* лучи света (веха 100) */}
      {tier >= 4 && (
        <motion.div
          className="absolute left-1/2 top-[28%] -translate-x-1/2"
          style={{ width: size * 0.9, height: size * 0.9 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 44, repeat: Infinity, ease: "linear" }}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <span
              key={i}
              className="absolute left-1/2 top-0 origin-bottom"
              style={{
                width: 2,
                height: "50%",
                marginLeft: -1,
                background:
                  "linear-gradient(to top, rgba(220,240,255,0.5), transparent)",
                transform: `rotate(${i * 30}deg)`,
              }}
            />
          ))}
        </motion.div>
      )}

      {/* подиум */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-[50%]"
        style={{
          width: size * 0.5,
          height: size * 0.06,
          background: PEDESTAL[tier],
          filter: "blur(12px)",
        }}
        initial={{ opacity: 0.22, scale: 1 }}
        animate={{ opacity: [0.22, 0.34, 0.22], scale: [1, 1.05, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* рост от ступней */}
      <motion.div
        className="absolute bottom-0 left-1/2"
        style={{ height: size, width, marginLeft: -width / 2, transformOrigin: "bottom center" }}
        initial={false}
        animate={{ scale: growth }}
        transition={{ type: "spring", stiffness: 90, damping: 16 }}
      >
        {/* покачивание */}
        <motion.div
          className="h-full w-full"
          style={{ transformOrigin: "bottom center" }}
          animate={{ rotate: [-1.1, 1.1, -1.1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* дыхание + смена фильтра */}
          <motion.img
            src="/buddy.png"
            alt=""
            draggable={false}
            className="h-full w-full select-none object-contain"
            style={{ transformOrigin: "bottom center" }}
            initial={false}
            animate={{
              scaleY: [1, 1.02, 1],
              scaleX: [1, 1.005, 1],
              filter: FILTER[tier],
            }}
            transition={{
              scaleY: { duration: 4.2, repeat: Infinity, ease: "easeInOut" },
              scaleX: { duration: 4.2, repeat: Infinity, ease: "easeInOut" },
              filter: { duration: 0.6 },
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
