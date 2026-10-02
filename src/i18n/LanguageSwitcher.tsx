"use client";

import { LOCALES, useLocaleStore } from "./locale";
import { cn } from "@/lib/cn";

/**
 * Переключатель языка. Названия языков написаны на них самих и не
 * переводятся (`data-no-i18n`): человек ищет в списке свой язык, а не
 * слово «казахский» на чужом.
 */
export default function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);
  return (
    <div data-no-i18n role="group" aria-label="Language / Тіл / Язык" className={cn("inline-flex gap-1 rounded-xl border border-[var(--color-border)] p-1", className)}>
      {LOCALES.map((item) => (
        <button
          key={item.id}
          type="button"
          aria-pressed={locale === item.id}
          onClick={() => setLocale(item.id)}
          className={cn(
            "rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition",
            locale === item.id ? "bg-[var(--color-fg)] text-[var(--color-bg)]" : "text-[var(--color-muted)] hover:text-[var(--color-fg)]",
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
