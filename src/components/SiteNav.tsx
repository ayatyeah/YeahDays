"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Logo from "./Logo";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "/", label: "Главная" },
  { href: "/app", label: "Приложение" },
  { href: "/about", label: "Обо мне" },
  { href: "/privacy", label: "Политика" },
] as const;

/**
 * Навигация витрины.
 *
 * Отдельно от BottomNav: у сайта и у приложения разные задачи. Здесь
 * человек выбирает, что почитать, поэтому навигация сверху и текстом.
 *
 * Подсветка активного пункта — один «переезжающий» объект (layoutId),
 * а не включение/выключение фона у разных ссылок: глаз читает движение
 * как связь между состояниями.
 */
export default function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40">
      <div className="marble-bar border-b border-[var(--color-border)]">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3 sm:px-8">
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <Logo variant="white" className="h-7 w-auto" />
            <span className="text-[17px] font-extrabold tracking-tight">
              YeahDays
            </span>
          </Link>

          <nav className="ml-auto flex items-center gap-0.5 overflow-x-auto">
            {LINKS.map((l) => {
              const active =
                l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "press relative shrink-0 rounded-xl px-3 py-2 text-[13.5px] font-medium",
                    active
                      ? "text-[var(--color-fg)]"
                      : "text-[var(--color-muted)] hover:text-[var(--color-fg-dim)]",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="site-nav-active"
                      className="absolute inset-0 -z-10 rounded-xl border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.07)] shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]"
                      transition={spring}
                    />
                  )}
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <Link
            href="/app"
            className="press ml-1 hidden h-10 shrink-0 items-center rounded-xl bg-[var(--color-fg)] px-4 text-[13.5px] font-bold text-[var(--color-bg)] sm:inline-flex"
          >
            Попробовать
          </Link>
        </div>
      </div>
    </header>
  );
}
