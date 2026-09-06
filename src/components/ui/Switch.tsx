"use client";

import { cn } from "@/lib/cn";
import { haptic } from "@/lib/motion";

interface SwitchProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  /** подпись для скринридера — сам переключатель без текста */
  label: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Переключатель в пропорциях iOS: дорожка 51×31, ползунок 27 с тенью,
 * включённое состояние — зелёный стабильности (свой цвет, не системный).
 * Ползунок едет на transform: анимация на GPU, без перерисовки строки.
 */
export default function Switch({ checked, onChange, label, disabled, className }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => {
        haptic("select");
        onChange(!checked);
      }}
      className={cn(
        "relative h-[31px] w-[51px] shrink-0 rounded-full transition-colors duration-200 disabled:opacity-40",
        checked ? "bg-[var(--color-stability)]" : "bg-[var(--color-border-strong)]",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute left-[2px] top-[2px] h-[27px] w-[27px] rounded-full bg-white shadow-[0_3px_8px_rgba(0,0,0,0.15),0_1px_1px_rgba(0,0,0,0.16)] transition-transform duration-200",
          checked ? "translate-x-[20px]" : "translate-x-0",
        )}
        style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
      />
    </button>
  );
}
