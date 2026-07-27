"use client";

import { motion } from "framer-motion";

/**
 * Атмосферный фон лендинга.
 *
 * Пустой тёмный фон читается как «недоделано»; живая глубина за контентом —
 * как «дорого». Здесь три слоя: тонкая сетка (задаёт масштаб и порядок), два
 * больших цветных свечения, которые медленно дышат и дрейфуют, и зерно,
 * чтобы градиенты не полосили на тёмном.
 *
 * fixed + -z-10 + pointer-events-none: живёт под всем контентом, не мешает
 * кликам и не скроллится. Движение очень медленное (десятки секунд) — фон не
 * должен перетягивать внимание с текста.
 */
export default function LandingBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      {/* сетка */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(120% 90% at 50% 0%, black 0%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(120% 90% at 50% 0%, black 0%, transparent 75%)",
        }}
      />

      {/* верхнее фиолетовое свечение — дышит и чуть дрейфует */}
      <motion.div
        className="absolute -top-[10%] left-[8%] h-[42vw] w-[42vw] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(139,124,246,0.22) 0%, transparent 68%)",
          filter: "blur(40px)",
        }}
        animate={{ x: [0, 40, 0], y: [0, 26, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* нижнее тёплое свечение — в противофазе */}
      <motion.div
        className="absolute right-[4%] top-[42%] h-[46vw] w-[46vw] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(249,115,98,0.16) 0%, transparent 66%)",
          filter: "blur(48px)",
        }}
        animate={{ x: [0, -44, 0], y: [0, -30, 0], scale: [1.06, 1, 1.06] }}
        transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* зерно поверх — убирает полошение градиентов */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
