"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Logo from "./Logo";
import { indicatorTween } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * Секции лендинга. Это одностраничник, поэтому пункты — якоря, а не
 * отдельные адреса. Исключение — политика: у правового документа должен
 * быть постоянный URL, на него ссылаются сторы и Google.
 */
const SECTIONS = [
  { id: "top", label: "Главная" },
  { id: "product", label: "О продукте" },
  { id: "about", label: "Обо мне" },
] as const;

export default function SiteNav() {
  const pathname = usePathname();
  const onLanding = pathname === "/";
  const [active, setActive] = useState<string>("top");

  /**
   * Подсветка активного пункта по видимой секции.
   *
   * IntersectionObserver вместо слушателя скролла: браузер сам считает
   * пересечения вне основного потока, поэтому подсветка не дёргает
   * страницу на каждый пиксель прокрутки.
   */
  useEffect(() => {
    if (!onLanding) return;
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (e): e is HTMLElement => Boolean(e),
    );
    if (els.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [onLanding]);

  return (
    <header className="sticky top-0 z-40">
      <div className="marble-bar border-b border-[var(--color-border)]">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-5 py-3 sm:px-8">
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <Logo variant="white" className="h-7 w-auto" />
            <span className="text-[17px] font-extrabold tracking-tight">
              YeahGrind
            </span>
          </Link>

          <nav className="ml-auto flex items-center gap-0.5 overflow-x-auto">
            {SECTIONS.map((s) => {
              const isActive = onLanding && active === s.id;
              return (
                <a
                  key={s.id}
                  href={onLanding ? `#${s.id}` : `/#${s.id}`}
                  className={cn(
                    "press relative shrink-0 rounded-xl px-3 py-2 text-[14.5px] font-medium",
                    isActive
                      ? "text-[var(--color-fg)]"
                      : "text-[var(--color-muted)] hover:text-[var(--color-fg-dim)]",
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="site-nav-active"
                      className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-[var(--color-fg)]"
                      transition={indicatorTween}
                    />
                  )}
                  {s.label}
                </a>
              );
            })}
            <Link
              href="/privacy"
              className={cn(
                "press shrink-0 rounded-xl px-3 py-2 text-[14.5px] font-medium",
                pathname === "/privacy"
                  ? "text-[var(--color-fg)]"
                  : "text-[var(--color-muted)] hover:text-[var(--color-fg-dim)]",
              )}
            >
              Политика
            </Link>
          </nav>

          <Link
            href="/app"
            className="press ml-1 hidden h-10 shrink-0 items-center rounded-xl bg-[var(--color-fg)] px-4 text-[14.5px] font-bold text-[var(--color-bg)] sm:inline-flex"
          >
            Попробовать
          </Link>
        </div>
      </div>
    </header>
  );
}
