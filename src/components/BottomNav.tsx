"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { useUiStore } from "@/store/useUiStore";

type IconProps = { className?: string };

function HomeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M3 10.5 12 3l9 7.5M5 9.5V20h5v-6h4v6h5V9.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CalendarIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect
        x="3.5"
        y="4.5"
        width="17"
        height="16"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M3.5 9h17M8 3v3M16 3v3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ProgressIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M4 20V10M10 20V4M16 20v-7M22 20H2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AccountIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="8" r="3.6" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M5 20c0-3.5 3.1-5.5 7-5.5s7 2 7 5.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

const NAV = [
  { href: "/", label: "Главная", Icon: HomeIcon },
  { href: "/calendar", label: "Календарь", Icon: CalendarIcon },
] as const;

const NAV_RIGHT = [
  { href: "/progress", label: "Прогресс", Icon: ProgressIcon },
  { href: "/account", label: "Аккаунт", Icon: AccountIcon },
] as const;

function NavItem({
  href,
  label,
  Icon,
  active,
}: {
  href: string;
  label: string;
  Icon: (p: IconProps) => React.ReactElement;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative flex flex-1 flex-col items-center justify-center gap-1 py-1.5 text-[10px] font-medium transition-colors",
        active ? "text-[var(--color-fg)]" : "text-[var(--color-muted)]",
      )}
    >
      {active && (
        <motion.span
          layoutId="nav-active"
          className="absolute inset-x-2 -top-[7px] h-[2px] rounded-full bg-[var(--color-fg)]"
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
        />
      )}
      <Icon className="h-6 w-6" />
      <span>{label}</span>
    </Link>
  );
}

export default function BottomNav() {
  const pathname = usePathname();
  const openCreate = useUiStore((s) => s.openCreate);

  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-40">
      <div className="pointer-events-auto mx-auto max-w-md">
        {/* тонкая световая линия сверху панели */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent" />
        <div className="safe-b relative flex items-stretch bg-[var(--color-bg-soft)]/80 px-2 pt-1.5 backdrop-blur-xl">
          {NAV.map((item) => (
            <NavItem
              key={item.href}
              {...item}
              active={pathname === item.href}
            />
          ))}

          {/* центральная кнопка «+» */}
          <div className="flex w-16 shrink-0 items-start justify-center">
            <motion.button
              onClick={() => openCreate()}
              aria-label="Создать задачу"
              whileTap={{ scale: 0.9 }}
              className="-mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-b from-white to-[#d6d6dc] text-[var(--color-bg)] shadow-[0_8px_24px_-4px_rgba(0,0,0,0.6)] ring-4 ring-[var(--color-bg)] transition"
            >
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none">
                <path
                  d="M12 5v14M5 12h14"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
              </svg>
            </motion.button>
          </div>

          {NAV_RIGHT.map((item) => (
            <NavItem
              key={item.href}
              {...item}
              active={pathname === item.href}
            />
          ))}
        </div>
      </div>
    </nav>
  );
}
