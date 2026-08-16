"use client";

import { useThemeStore } from "@/store/useThemeStore";
import { cn } from "@/lib/cn";

/** Переключатель светлой/тёмной темы — солнце/луна, как на кнопках навигации. */
export default function ThemeToggle({ className }: { className?: string }) {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isLight ? "Включить тёмную тему" : "Включить светлую тему"}
      className={cn(
        "press flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-surface)] text-[var(--color-fg-dim)] transition hover:text-[var(--color-fg)]",
        className,
      )}
    >
      {isLight ? (
        <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]">
          <circle cx="12" cy="12" r="4.3" stroke="currentColor" strokeWidth="1.7" />
          <path
            d="M12 3.3V1.8M12 22.2v-1.5M4.34 4.34l1.06 1.06M18.6 18.6l1.06 1.06M1.8 12h1.5M20.7 12h1.5M4.34 19.66l1.06-1.06M18.6 5.4l1.06-1.06"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]">
          <path
            d="M20.2 14.4A8.5 8.5 0 1 1 9.6 3.8a6.7 6.7 0 0 0 10.6 10.6Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
