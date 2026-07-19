"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { tierForLevel, type Tier } from "@/lib/leveling";
import { bodyForLevel, skinSrc } from "@/lib/characters";
import { useUserStore } from "@/store/useUserStore";

interface BuddyProps {
  level: number;
  /** высота фигуры в px */
  size?: number;
  /** явный src (для превью в гардеробе); иначе берётся из выбранного скина */
  src?: string;
  className?: string;
}

const AURA: Record<Tier, string> = {
  1: "rgba(120,120,135,0)",
  2: "rgba(160,165,185,0)",
  3: "rgba(125,211,252,0.32)",
  4: "rgba(210,235,255,0.55)",
};

const PEDESTAL: Record<Tier, string> = {
  1: "#6b7078",
  2: "#9aa0ac",
  3: "#7dd3fc",
  4: "#dbeafe",
};

const FILTER: Record<Tier, string> = {
  1: "none",
  2: "none",
  3: "brightness(1.03) saturate(1.05)",
  4: "brightness(1.15) saturate(1.1) drop-shadow(0 0 16px rgba(200,230,255,0.7))",
};

export default function Buddy({ level, size = 300, src, className }: BuddyProps) {
  const skins = useUserStore((s) => s.skins);

  const { tier, growth, image } = useMemo(() => {
    const t = tierForLevel(level);
    const g = Math.min(Math.max((level - 1) / 99, 0), 1);
    const body = bodyForLevel(level);
    const img = src ?? skinSrc(body, skins?.[body] ?? "base");
    return { tier: t, growth: 0.94 + g * 0.12, image: img };
  }, [level, src, skins]);

  return (
    <div
      className={className}
      style={{ position: "relative", height: size, width: size * 0.56 }}
      role="img"
      aria-label={`Персонаж, уровень ${level}`}
    >
      {/* аура (веха 50+/100+) */}
      <motion.div
        className="absolute left-1/2 top-[24%] -translate-x-1/2 rounded-full"
        style={{
          width: size * 0.6,
          height: size * 0.6,
          background: AURA[tier],
          filter: "blur(30px)",
        }}
        initial={{ opacity: 0, scale: 1 }}
        animate={{
          opacity: tier >= 3 ? [0.7, 1, 0.7] : 0,
          scale: tier >= 3 ? [1, 1.08, 1] : 1,
        }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* лучи света (веха 100) */}
      {tier >= 4 && (
        <motion.div
          className="absolute left-1/2 top-[26%] -translate-x-1/2"
          style={{ width: size * 0.85, height: size * 0.85 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 46, repeat: Infinity, ease: "linear" }}
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
                  "linear-gradient(to top, rgba(220,240,255,0.45), transparent)",
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
          width: size * 0.46,
          height: size * 0.055,
          background: PEDESTAL[tier],
          filter: "blur(12px)",
        }}
        initial={{ opacity: 0.22, scale: 1 }}
        animate={{ opacity: [0.22, 0.34, 0.22], scale: [1, 1.05, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* рост от ступней */}
      <motion.div
        className="absolute bottom-0 left-1/2 flex items-end justify-center"
        style={{
          height: size,
          width: size * 0.56,
          marginLeft: -(size * 0.56) / 2,
          transformOrigin: "bottom center",
        }}
        initial={false}
        animate={{ scale: growth }}
        transition={{ type: "spring", stiffness: 90, damping: 16 }}
      >
        {/* покачивание */}
        <motion.div
          className="flex h-full w-full items-end justify-center"
          style={{ transformOrigin: "bottom center" }}
          animate={{ rotate: [-1, 1, -1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* дыхание */}
          <motion.img
            key={image}
            src={image}
            alt=""
            draggable={false}
            className="w-auto select-none object-contain"
            style={{ height: size, transformOrigin: "bottom center", filter: FILTER[tier] }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, scaleY: [1, 1.02, 1], scaleX: [1, 1.006, 1] }}
            transition={{
              opacity: { duration: 0.35 },
              scaleY: { duration: 4.2, repeat: Infinity, ease: "easeInOut" },
              scaleX: { duration: 4.2, repeat: Infinity, ease: "easeInOut" },
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
