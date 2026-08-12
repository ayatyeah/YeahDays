"use client";

import { motion } from "framer-motion";
import { haptic, spring, springSnappy } from "@/lib/motion";
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
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--color-border-strong)] to-transparent" />
        {/* Стекло, а не сплошная плашка: контент, уезжающий под навбар,
            должен просвечивать — иначе панель выглядит наклейкой.
            Блюр здесь дешёвый: панель низкая и в своём слое (gpu-layer),
            поэтому пересчитывается только её полоса, а не весь экран. */}
        <div className="liquid-bar gpu-layer safe-b flex items-stretch px-1.5 pb-0.5 pt-2">
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
                  "press relative flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl py-1.5 text-[9.5px] font-medium",
                  active ? "text-[var(--color-fg)]" : "text-[var(--color-muted)]",
                )}
              >
                {/* Подсветка «переезжает» между вкладками одним объектом,
                    а не гаснет и загорается — глаз читает это как движение. */}
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 -z-10 rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.08)] shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]"
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
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
