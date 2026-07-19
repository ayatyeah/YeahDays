"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { tierForLevel, type Tier } from "@/lib/leveling";

interface HumanProps {
  level: number;
  /** пиксельный размер по ширине контейнера */
  size?: number;
  className?: string;
}

const TIER_COLOR: Record<Tier, string> = {
  1: "#7c7c86", // серый
  2: "#adadb8", // светлее, шире
  3: "#93bce0", // холодный оттенок — новая форма
  4: "#eef5ff", // светящийся, почти белый
};

const AURA_COLOR: Record<Tier, string> = {
  1: "rgba(120,120,130,0)",
  2: "rgba(160,160,175,0)",
  3: "rgba(125,211,252,0.32)",
  4: "rgba(210,235,255,0.55)",
};

function useFigure(level: number) {
  return useMemo(() => {
    const tier = tierForLevel(level);
    const g = Math.min(Math.max((level - 1) / 99, 0), 1); // 0..1

    const growth = 0.82 + g * 0.36; // общий рост от ног
    const shoulderW = 56 + g * 48 + (tier >= 3 ? 4 : 0);
    const torsoW = 40 + g * 12;
    const headR = 21 + g * 4;
    const armW = 12 + g * 3;
    const legW = 15 + g * 3;

    return {
      tier,
      growth,
      shoulderW,
      torsoW,
      headR,
      armW,
      legW,
      color: TIER_COLOR[tier],
      aura: AURA_COLOR[tier],
    };
  }, [level]);
}

export default function Human({ level, size = 300, className }: HumanProps) {
  const f = useFigure(level);

  const cx = 110;
  const armCx = f.shoulderW / 2 - 3;
  const legCx = Math.max(f.torsoW / 2 - 1, 9);

  return (
    <svg
      viewBox="0 0 220 300"
      width={size}
      height={(size * 300) / 220}
      className={className}
      role="img"
      aria-label={`Персонаж, уровень ${level}`}
    >
      {/* светящийся подиум под фигурой */}
      <motion.ellipse
        cx={cx}
        cy={271}
        rx={52 * f.growth}
        ry={11}
        fill={f.color}
        style={{ filter: "blur(14px)", transformOrigin: "110px 271px" }}
        initial={{ opacity: 0.18, scale: 1 }}
        animate={{ opacity: [0.18, 0.3, 0.18], scale: [1, 1.04, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* тень под фигурой — заземляет силуэт */}
      <ellipse
        cx={cx}
        cy={273}
        rx={40 * f.growth}
        ry={7}
        fill="#000"
        opacity={0.45}
        style={{ filter: "blur(6px)" }}
      />

      {/* аура (веха 50+ / 100+) */}
      <motion.circle
        cx={cx}
        cy={130}
        r={92}
        fill={f.aura}
        style={{ filter: "blur(26px)", transformOrigin: "110px 130px" }}
        initial={{ opacity: 0, scale: 1 }}
        animate={{
          scale: f.tier >= 3 ? [1, 1.08, 1] : 1,
          opacity: f.tier >= 3 ? [0.8, 1, 0.8] : 0,
        }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* лучи света (веха 100) */}
      {f.tier >= 4 && (
        <motion.g
          style={{ transformOrigin: "110px 128px" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <rect
              key={i}
              x={cx - 0.9}
              y={20}
              width={1.8}
              height={40}
              rx={1}
              fill="rgba(220,240,255,0.5)"
              transform={`rotate(${i * 30} ${cx} 128)`}
            />
          ))}
        </motion.g>
      )}

      {/* РОСТ (от ступней) + плавная смена цвета */}
      <motion.g
        style={{ transformBox: "fill-box", transformOrigin: "bottom center" }}
        initial={false}
        animate={{ scale: f.growth, color: f.color }}
        transition={{ type: "spring", stiffness: 90, damping: 16 }}
      >
        {/* ПОКАЧИВАНИЕ (idle) */}
        <motion.g
          style={{ transformBox: "fill-box", transformOrigin: "bottom center" }}
          animate={{ rotate: [-1.3, 1.3, -1.3] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* ДЫХАНИЕ */}
          <motion.g
            style={{ transformBox: "fill-box", transformOrigin: "bottom center" }}
            animate={{ scaleY: [1, 1.022, 1], scaleX: [1, 1.006, 1] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <g fill="currentColor">
              {/* ноги */}
              <rect
                x={cx - legCx - f.legW / 2}
                y={186}
                width={f.legW}
                height={80}
                rx={f.legW / 2}
              />
              <rect
                x={cx + legCx - f.legW / 2}
                y={186}
                width={f.legW}
                height={80}
                rx={f.legW / 2}
              />

              {/* руки */}
              <rect
                x={cx - armCx - f.armW / 2}
                y={112}
                width={f.armW}
                height={72}
                rx={f.armW / 2}
              />
              <rect
                x={cx + armCx - f.armW / 2}
                y={112}
                width={f.armW}
                height={72}
                rx={f.armW / 2}
              />

              {/* плечи (капсула — расширяются с уровнем) */}
              <rect
                x={cx - f.shoulderW / 2}
                y={104}
                width={f.shoulderW}
                height={20}
                rx={10}
              />

              {/* торс */}
              <rect
                x={cx - f.torsoW / 2}
                y={108}
                width={f.torsoW}
                height={84}
                rx={f.torsoW / 2}
              />

              {/* шея */}
              <rect x={cx - 5} y={88} width={10} height={16} rx={5} />

              {/* голова */}
              <circle cx={cx} cy={68} r={f.headR} />
            </g>
          </motion.g>
        </motion.g>
      </motion.g>
    </svg>
  );
}
