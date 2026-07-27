"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

interface LogoProps {
  /** color — фирменный градиент; white — чистый белый знак */
  variant?: "color" | "white";
  /** мягкое неоновое свечение через CSS (для крупных мест) */
  glow?: boolean;
  className?: string;
}

const GLOW =
  "[filter:drop-shadow(0_0_18px_rgba(160,120,255,0.45))_drop-shadow(0_0_34px_rgba(249,90,110,0.25))]";

/** Логотип YeahGrind. Чёткая «YG»; свечение — опциональный CSS-эффект. */
export default function Logo({ variant = "color", glow, className }: LogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={variant === "white" ? "/logo-white.png" : "/logo.png"}
      alt="YeahGrind"
      draggable={false}
      className={cn("select-none object-contain", glow && GLOW, className)}
    />
  );
}

/** Экран загрузки с пульсирующим логотипом (вместо безликого спиннера). */
export function LogoLoader() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <motion.img
        src="/logo.png"
        alt="YeahGrind"
        draggable={false}
        className={cn("h-14 w-auto select-none object-contain", GLOW)}
        animate={{ opacity: [0.6, 1, 0.6], scale: [0.96, 1, 0.96] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
