"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { spring, springSnappy } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { useUserStore, useHydrated, selectToday } from "@/store/useUserStore";
import { useMemo } from "react";

type IconProps = { className?: string };

function HomeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M4.5 8.5 12 3.5l7.5 5v11a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1v-11Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M9.5 20v-6h5v6" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

function TodayIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M5 12.5 9.5 17 19 7"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CalendarIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="3.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3.5 9.5h17M8 3.5V6m8-2.5V6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function ProgressIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M4 19V11.5M9.3 19V5.5M14.7 19v-9M20 19V8"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

function AccountIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="8.2" r="3.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M5 20c0-3.4 3.1-5.4 7-5.4s7 2 7 5.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

const NAV = [
  { href: "/", label: "Главная", Icon: HomeIcon },
  { href: "/today", label: "Сегодня", Icon: TodayIcon },
  { href: "/calendar", label: "Календарь", Icon: CalendarIcon },
  { href: "/progress", label: "Прогресс", Icon: ProgressIcon },
  { href: "/account", label: "Профиль", Icon: AccountIcon },
] as const;

export default function BottomNav() {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const onboarded = useUserStore((s) => s.onboarded);
  const plan = useUserStore((s) => s.plan);
  const pending = useMemo(
    () => selectToday(plan).filter((t) => !t.completed).length,
    [plan],
  );

  // Во время онбординга навигация скрыта — экран полноэкранный.
  // Прячем только когда точно знаем, что онбординг не пройден.
  if (hydrated && !onboarded) return null;

  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-40">
      <div className="pointer-events-auto mx-auto max-w-md">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--color-border-strong)] to-transparent" />
        {/* Стекло, а не сплошная плашка: контент, уезжающий под навбар,
            должен просвечивать — иначе панель выглядит наклейкой.
            Блюр здесь дешёвый: панель низкая и в своём слое (gpu-layer),
            поэтому пересчитывается только её полоса, а не весь экран. */}
        <div className="glass gpu-layer safe-b flex items-stretch px-1.5 pb-0.5 pt-2">
          {NAV.map(({ href, label, Icon }) => {
            const active = pathname === href;
            const badge = href === "/today" && pending > 0 ? pending : 0;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "press relative flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl py-1.5 text-[9.5px] font-medium",
                  active ? "text-[var(--color-fg)]" : "text-[var(--color-muted)]",
                )}
              >
                {/* Подсветка «переезжает» между вкладками одним объектом,
                    а не гаснет и загорается — глаз читает это как движение. */}
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 -z-10 rounded-2xl bg-[rgba(255,255,255,0.07)]"
                    transition={spring}
                  />
                )}
                <motion.span
                  className="relative"
                  animate={{ scale: active ? 1.06 : 1, y: active ? -1 : 0 }}
                  transition={springSnappy}
                >
                  <Icon className="h-[22px] w-[22px]" />
                  {badge > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={springSnappy}
                      className="absolute -right-1.5 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-strength)] px-1 text-[9px] font-bold text-white shadow-[0_2px_8px_rgba(255,122,104,0.5)]"
                    >
                      {badge}
                    </motion.span>
                  )}
                </motion.span>
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
