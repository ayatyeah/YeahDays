"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "surface" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

/**
 * Единый вид кнопки на всё приложение.
 *
 * Раньше компонент отставал от «премиальных» инлайн-кнопок на колоде:
 * мельче (h-11), меньше скруглён (rounded-xl), без сжатия при нажатии — из-за
 * чего кнопки в модалках выглядели дешевле, чем «Беру»/«Сделал». Теперь тот же
 * язык: rounded-2xl, `.press` (тап-сжатие), тень у главной кнопки, высоты как
 * у CTA. Меняешь тут — меняется во всех модалках сразу.
 */
const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--color-fg)] text-[var(--color-bg)] shadow-[var(--shadow-2)] hover:opacity-95",
  surface:
    "bg-[var(--color-surface-2)] text-[var(--color-fg)] border border-[var(--color-border-strong)] hover:bg-[var(--color-surface)]",
  ghost:
    "bg-transparent text-[var(--color-fg-dim)] hover:text-[var(--color-fg)] hover:bg-[var(--color-surface)]",
  danger:
    "bg-transparent text-[var(--color-strength)] border border-[var(--color-border-strong)] hover:bg-[var(--color-strength)]/10",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-[14px] rounded-xl",
  md: "h-12 px-5 text-[14px] rounded-2xl",
  lg: "h-14 px-6 text-[15px] rounded-2xl",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "surface", size = "md", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        // press — общий тап-эффект (scale), он же несёт transition цвета/границы
        "press inline-flex select-none items-center justify-center gap-2 font-semibold disabled:cursor-not-allowed disabled:opacity-40",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
});

export default Button;
