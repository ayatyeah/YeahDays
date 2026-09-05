"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { haptic, spring } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { useUserStore, useHydrated } from "@/store/useUserStore";
import { useNavStore } from "@/store/useNavStore";
import Logo from "@/components/Logo";
import {
  HomeIcon,
  TodayIcon,
  CalendarIcon,
  ProgressIcon,
  AccountIcon,
  type IconProps,
} from "@/components/nav-icons";
import type { TabKey } from "@/lib/nav";

const NAV = [
  { tab: "home", label: "Главная", Icon: HomeIcon },
  { tab: "today", label: "Сегодня", Icon: TodayIcon },
  { tab: "calendar", label: "Календарь", Icon: CalendarIcon },
  { tab: "progress", label: "Прогресс", Icon: ProgressIcon },
  { tab: "account", label: "Профиль", Icon: AccountIcon },
] as const satisfies readonly { tab: TabKey; label: string; Icon: React.FC<IconProps> }[];

/**
 * Боковая навигация — версия BottomNav для широких экранов (lg: и выше).
 * Тот же useNavStore/TABS, та же логика активной вкладки — отличается
 * только расположением и тем, что подписи всегда видны, не только иконки.
 * Смонтирована одновременно с BottomNav — переключение видимости чисто
 * через CSS (`hidden lg:flex` / `lg:hidden` в Shell.tsx), а не условным
 * рендером, чтобы не было расхождения между сервером и клиентом на ресайзе.
 */
export default function Sidebar() {
  const tab = useNavStore((s) => s.tab);
  const go = useNavStore((s) => s.go);
  const hydrated = useHydrated();
  const onboarded = useUserStore((s) => s.onboarded);

  if (hydrated && !onboarded) return null;

  return (
    <nav className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-6 lg:flex">
      <Link href="/today" className="flex items-center gap-2.5 px-2">
        <Logo variant="white" className="h-7 w-auto" />
        <span className="text-[15px] font-bold tracking-tight">YeahGrind</span>
      </Link>

      <div className="mt-8 flex flex-col gap-1">
        {NAV.map(({ tab: key, label, Icon }) => {
          const active = tab === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => {
                if (!active) haptic("select");
                go(key);
              }}
              aria-current={active ? "page" : undefined}
              className={cn(
                "press relative flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-left text-[14px] font-medium transition",
                active ? "text-[var(--color-fg)]" : "text-[var(--color-muted)] hover:text-[var(--color-fg)]",
              )}
            >
              {/* Активный пункт помечен чертой у левого края, а не залитой
                  плашкой с рамкой и бликом. Плашка была самым «материальным»
                  элементом интерфейса и спорила со строгой схемой; черта
                  делает ту же работу — показывает, где ты, — но не строит
                  вокруг пункта отдельную поверхность. layoutId оставлен:
                  индикатор по-прежнему ПЕРЕЕЗЖАЕТ между пунктами, и глаз
                  читает это как движение, а не как погасло/загорелось. */}
              {active && (
                <motion.span
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 h-[18px] w-[3px] -translate-y-1/2 rounded-full bg-[var(--color-fg)]"
                  transition={spring}
                />
              )}
              <Icon className="h-[19px] w-[19px] shrink-0" />
              {label}
            </button>
          );
        })}
      </div>

      <div className="mt-auto px-2 text-[12px] text-[var(--color-muted)]">
        Одно действие в день
      </div>
    </nav>
  );
}
