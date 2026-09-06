"use client";

import { motion } from "framer-motion";
import { haptic, springSnappy } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { useUserStore, useHydrated, selectToday } from "@/store/useUserStore";
import { useNavStore } from "@/store/useNavStore";
import type { TabKey } from "@/lib/nav";
import { useMemo } from "react";
import {
  HomeIcon,
  TodayIcon,
  CalendarIcon,
  ProgressIcon,
  AccountIcon,
  type IconProps,
} from "@/components/nav-icons";

const NAV = [
  { tab: "home", label: "Главная", Icon: HomeIcon },
  { tab: "today", label: "Сегодня", Icon: TodayIcon },
  { tab: "calendar", label: "Календарь", Icon: CalendarIcon },
  { tab: "progress", label: "Прогресс", Icon: ProgressIcon },
  { tab: "account", label: "Профиль", Icon: AccountIcon },
] as const satisfies readonly { tab: TabKey; label: string; Icon: React.FC<IconProps> }[];

export default function BottomNav() {
  const tab = useNavStore((s) => s.tab);
  const go = useNavStore((s) => s.go);
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
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-40 lg:hidden">
      <div className="pointer-events-auto mx-auto max-w-md">
        {/* Таб-бар по канону iOS: полупрозрачная панель (см. .liquid-bar),
            иконка 25pt над подписью 10pt, активная вкладка отличается
            только цветом — без черты и плашки. Высота 49pt + safe-area. */}
        <div className="liquid-bar gpu-layer safe-b flex h-[calc(49px+env(safe-area-inset-bottom))] items-stretch px-1">
          {NAV.map(({ tab: key, label, Icon }) => {
            const active = tab === key;
            const badge = key === "today" && pending > 0 ? pending : 0;
            return (
              <button
                key={key}
                type="button"
                // Переключение раздела, а не переход по ссылке: никакой
                // навигации, никакого запроса — только смена видимой секции.
                onClick={() => {
                  if (!active) haptic("select");
                  go(key);
                }}
                aria-current={active ? "page" : undefined}
                aria-label={label}
                className={cn(
                  "relative flex flex-1 flex-col items-center justify-center gap-[3px] pt-1.5 pb-0.5 text-[10px] font-medium transition-colors",
                  active ? "text-[var(--color-fg)]" : "text-[var(--color-muted)]",
                )}
              >
                <span className="relative">
                  <Icon className="h-[25px] w-[25px]" />
                  {badge > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={springSnappy}
                      className="absolute -right-1.5 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-strength)] px-1 text-[11px] font-bold text-white shadow-[var(--shadow-1)]"
                    >
                      {badge}
                    </motion.span>
                  )}
                </span>
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
