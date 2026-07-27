"use client";

import { motion } from "framer-motion";

/**
 * Атмосферный фон лендинга — лёгкий.
 *
 * ВАЖНО про производительность: раньше здесь были два `filter: blur(40px)`
 * дива с непрерывной анимацией — каждый кадр браузер перерисовывал размытую
 * область, и длинный лендинг лагал. Теперь мягкость даёт САМ радиальный
 * градиент (прозрачный к краю), без filter, а движется только `transform` —
 * оно композитится на GPU без перерисовок. Дёшево и всё ещё живое.
 *
 * fixed + -z-10 + pointer-events-none: под контентом, не мешает кликам.
 */
export default function LandingBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      {/* тонкая сетка — статична, ничего не стоит */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage:
            "radial-gradient(120% 80% at 50% 0%, black 0%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(120% 80% at 50% 0%, black 0%, transparent 70%)",
        }}
      />

      {/* мягкое фиолетовое пятно — мягкость от градиента, а не от blur */}
      <motion.div
        className="absolute -top-[15%] left-[2%] h-[46vw] w-[46vw] will-change-transform"
        style={{
          background:
            "radial-gradient(circle, rgba(139,124,246,0.16) 0%, transparent 60%)",
        }}
        animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ duration: 34, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* тёплое пятно в противофазе */}
      <motion.div
        className="absolute right-[-5%] top-[38%] h-[50vw] w-[50vw] will-change-transform"
        style={{
          background:
            "radial-gradient(circle, rgba(249,115,98,0.11) 0%, transparent 60%)",
        }}
        animate={{ x: [0, -50, 0], y: [0, -34, 0] }}
        transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
