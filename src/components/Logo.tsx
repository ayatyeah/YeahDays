"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { useThemeStore } from "@/store/useThemeStore";

/** Сколько раз подряд нужно попасть по знаку, чтобы открылась консоль. */
const TAPS_TO_CONSOLE = 10;
/** Пауза между нажатиями, после которой счёт начинается заново. */
const TAP_WINDOW_MS = 800;

interface LogoProps {
  /** color — фирменный градиент; white — чистый белый знак */
  variant?: "color" | "white";
  /** мягкое неоновое свечение через CSS (для крупных мест) */
  glow?: boolean;
  className?: string;
}

const GLOW =
  "[filter:drop-shadow(0_0_18px_rgba(160,120,255,0.45))_drop-shadow(0_0_34px_rgba(249,90,110,0.25))]";

/**
 * Логотип YeahGrind. Чёткая «YG»; свечение — опциональный CSS-эффект.
 *
 * variant="white" просят места, рассчитанные на тёмный фон (шапки,
 * сайдбар) — на светлой теме белый знак на белом просто исчезнет,
 * поэтому здесь он принудительно подменяется на цветной, независимо
 * от того, что попросил вызывающий компонент.
 */
export default function Logo({ variant = "color", glow, className }: LogoProps) {
  const theme = useThemeStore((s) => s.theme);
  const effective = variant === "white" && theme === "light" ? "color" : variant;
  const router = useRouter();
  const taps = useRef(0);
  const lastTap = useRef(0);

  /**
   * Десять быстрых нажатий по знаку открывают консоль — приём из системных
   * настроек телефонов. Ссылки в интерфейсе нет намеренно: дверь не
   * прячется от злоумышленника (её стерегут пароль и лимит попыток), просто
   * обычному человеку она ни к чему и только мешала бы.
   *
   * Счёт сбрасывается, если между нажатиями прошло больше паузы: случайный
   * двойной тап по логотипу за неделю не должен накопиться в десять.
   */
  function onTap() {
    const now = Date.now();
    taps.current = now - lastTap.current > TAP_WINDOW_MS ? 1 : taps.current + 1;
    lastTap.current = now;
    if (taps.current >= TAPS_TO_CONSOLE) {
      taps.current = 0;
      router.push("/admin/login");
    }
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={effective === "white" ? "/logo-white.webp" : "/logo.webp"}
      alt="YeahGrind"
      draggable={false}
      onClick={onTap}
      className={cn("select-none object-contain", glow && GLOW, className)}
    />
  );
}

/** Экран загрузки с пульсирующим логотипом (вместо безликого спиннера). */
export function LogoLoader() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <motion.img
        src="/logo.webp"
        alt="YeahGrind"
        draggable={false}
        className={cn("h-14 w-auto select-none object-contain", GLOW)}
        animate={{ opacity: [0.6, 1, 0.6], scale: [0.96, 1, 0.96] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
