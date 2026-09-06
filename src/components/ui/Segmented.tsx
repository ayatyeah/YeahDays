"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { haptic } from "@/lib/motion";
import { YgIcon, type YgIconName } from "@/components/yg-icons";

export interface SegmentOption<K extends string | number> {
  key: K;
  label: string;
  icon?: YgIconName;
  /** мелкая подпись под label — например «мин» */
  sub?: string;
}

interface SegmentedProps<K extends string | number> {
  options: SegmentOption<K>[];
  value: K;
  onChange: (key: K) => void;
  /** md — строка 36pt как у системного контрола; lg — с иконкой над подписью */
  size?: "md" | "lg";
  /** общий id для layoutId: два контрола на экране не должны делить ползунок */
  id: string;
  className?: string;
}

/**
 * Сегмент-контрол в духе iOS: серая дорожка, белый ползунок с тенью
 * переезжает на выбранный сегмент (layoutId — одно движение, а не
 * «погас — загорелся»). Подписи полужирные, невыбранные — приглушены.
 */
export default function Segmented<K extends string | number>({
  options,
  value,
  onChange,
  size = "md",
  id,
  className,
}: SegmentedProps<K>) {
  return (
    <div
      role="tablist"
      className={cn(
        "flex w-full rounded-xl bg-[var(--color-surface-2)] p-[3px]",
        className,
      )}
    >
      {options.map((o) => {
        const active = o.key === value;
        return (
          <button
            key={String(o.key)}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => {
              if (active) return;
              haptic("select");
              onChange(o.key);
            }}
            className={cn(
              "relative flex flex-1 flex-col items-center justify-center rounded-[9px] transition-colors",
              size === "md" ? "h-[34px] text-[15px]" : "h-[62px] gap-1 text-[13px]",
              active ? "text-[var(--color-fg)]" : "text-[var(--color-muted)]",
            )}
          >
            {active && (
              <motion.span
                layoutId={`seg-${id}`}
                className="absolute inset-0 rounded-[9px] bg-[var(--color-surface)] shadow-[var(--shadow-1)]"
                transition={{ type: "spring", stiffness: 520, damping: 42 }}
              />
            )}
            {o.icon && <YgIcon name={o.icon} className="relative h-[22px] w-[22px]" />}
            <span className="relative font-semibold leading-none">{o.label}</span>
            {o.sub && (
              <span className="relative text-[11px] font-medium text-[var(--color-muted)]">{o.sub}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
