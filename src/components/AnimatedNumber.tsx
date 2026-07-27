"use client";

import { useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

/**
 * Число, которое доезжает до нового значения пружиной, а не прыгает.
 *
 * Прыжок «40 → 82 XP» глаз не замечает; счётчик, который добегает за
 * полсекунды, превращает начисление в маленькую награду. На первом рендере
 * анимации нет (пружина стартует уже на месте) — считаем только РОСТ, а не
 * открытие экрана, иначе каждый заход раздражал бы бегущими цифрами.
 */
export default function AnimatedNumber({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const spring = useSpring(value, { stiffness: 90, damping: 18, mass: 0.9 });
  const text = useTransform(spring, (v) => Math.round(v).toLocaleString("ru-RU"));

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span className={className}>{text}</motion.span>;
}
