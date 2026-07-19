"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "surface" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--color-fg)] text-[var(--color-bg)] hover:opacity-90 active:opacity-80",
  surface:
    "bg-[var(--color-surface-2)] text-[var(--color-fg)] border border-[var(--color-border)] hover:bg-[var(--color-surface)]",
  ghost:
    "bg-transparent text-[var(--color-fg-dim)] hover:text-[var(--color-fg)] hover:bg-[var(--color-surface)]",
  danger:
    "bg-transparent text-[var(--color-discipline)] border border-[var(--color-border)] hover:bg-[var(--color-surface)]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm rounded-lg",
  md: "h-11 px-4 text-sm rounded-xl",
  lg: "h-13 px-5 text-base rounded-2xl",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "surface", size = "md", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex select-none items-center justify-center gap-2 font-medium transition disabled:cursor-not-allowed disabled:opacity-40",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
});

export default Button;
