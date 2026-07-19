"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

interface XpBarProps {
  ratio: number; // 0..1
  className?: string;
  color?: string;
}

export default function XpBar({
  ratio,
  className,
  color = "var(--color-xp)",
}: XpBarProps) {
  return (
    <div
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-[var(--color-surface-2)]",
        className,
      )}
    >
      <motion.div
        className="h-full rounded-full"
        style={{
          backgroundColor: color,
          boxShadow: `0 0 10px ${color}`,
        }}
        initial={false}
        animate={{ width: `${Math.min(Math.max(ratio, 0), 1) * 100}%` }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      />
    </div>
  );
}
