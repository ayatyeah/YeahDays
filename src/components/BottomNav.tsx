"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { haptic, indicatorTween, springSnappy } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { useUserStore, useHydrated, selectToday } from "@/store/useUserStore";
import { useNavStore } from "@/store/useNavStore";
import { TAB_PATH, tabFromPath, type TabKey } from "@/lib/nav";
import { useEffect, useMemo } from "react";
import { useKeyboardInset } from "@/lib/useKeyboardInset";
import {
  LearnIcon,
  CommunityIcon,
  TodayIcon,
  CalendarIcon,
  ProgressIcon,
  AccountIcon,
  type IconProps,
} from "@/components/nav-icons";

const NAV = [
  { tab: "today", label: "Сегодня", Icon: TodayIcon },
  { tab: "learn", label: "Учёба", Icon: LearnIcon },
  { tab: "community", label: "Сообщество", Icon: CommunityIcon },
  { tab: "progress", label: "Прогресс", Icon: ProgressIcon },
  { tab: "account", label: "Профиль", Icon: AccountIcon },
] as const;

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const section = tabFromPath(pathname);
  const reducedMotion = useReducedMotion();
  const tab = useNavStore((s) => s.tab);
  const go = useNavStore((s) => s.go);
  const hydrated = useHydrated();
  const onboarded = useUserStore((s) => s.onboarded);
  const plan = useUserStore((s) => s.plan);
  const pending = useMemo(
    () => selectToday(plan).filter((t) => !t.completed).length,
    [plan],
  );

  /*
   * Бейдж на иконке приложения: сколько взятых дел ещё не закрыто. На
   * Android, десктопе и iOS 16.4+ установленное PWA умеет показывать число
   * на иконке — тот же крючок возврата, что и у нативных приложений. В
   * браузере API нет — тихо пропускаем.
   */
  useEffect(() => {
    const n = navigator as Navigator & {
      setAppBadge?: (n?: number) => Promise<void>;
      clearAppBadge?: () => Promise<void>;
    };
    if (!n.setAppBadge) return;
    void (pending > 0 ? n.setAppBadge(pending) : n.clearAppBadge?.()).catch(() => {});
  }, [pending]);

  /*
   * Пока открыта клавиатура, навигации нет. На Android layout ужимается, и
   * панель встаёт ровно над клавиатурой, накрывая поле, в которое человек
   * печатает; на iOS она просто прячется под клавиатурой и всё равно
   * бесполезна. В обоих случаях правильнее её убрать.
   */
  const keyboard = useKeyboardInset();

  // Во время онбординга навигация скрыта — экран полноэкранный.
  // Прячем только когда точно знаем, что онбординг не пройден.
  if (hydrated && !onboarded && section !== null) return null;
  if (keyboard > 0) return null;

  return (
    <nav
      className="pointer-events-none fixed inset-x-0 z-40 lg:hidden"
      aria-label="Основная навигация"
      style={{ bottom: "var(--nav-offset, 0px)" }}
    >
      <div className="pointer-events-auto liquid-bar border-t border-[var(--color-border-strong)] shadow-[var(--shadow-up)]">
        <div
          className="mx-auto flex max-w-lg items-stretch gap-1 px-2"
          style={{
            height: "calc(64px + env(safe-area-inset-bottom))",
            paddingBottom: "env(safe-area-inset-bottom)",
          }}
        >
          {NAV.map(({ tab: key, label, Icon }) => {
            const active = key === "learn" || key === "community" ? pathname === `/${key}` : section !== null && tab === key;
            const badge = key === "today" && pending > 0 ? pending : 0;
            return (
              <button
                key={key}
                type="button"
                // Внутри оболочки переключаем секцию; с отдельных
                // страниц возвращаемся через роутер Next.
                onClick={() => {
                  if (!active) haptic("select");
                  if (key === "learn" || key === "community") router.push(`/${key}`);
                  else if (section === null) router.push(TAB_PATH[key]);
                  else go(key);
                }}
                aria-current={active ? "page" : undefined}
                aria-label={badge ? `${label}, незавершённых дел: ${badge}` : label}
                className={cn(
                  "relative my-1 flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl text-[10px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-intelligence)] motion-reduce:transition-none",
                  active ? "text-[var(--color-fg)]" : "text-[var(--color-fg-dim)] hover:text-[var(--color-fg)]",
                )}
              >
                <span className="relative flex h-8 w-12 items-center justify-center">
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-[var(--color-intelligence)]/20"
                      transition={reducedMotion ? { duration: 0 } : indicatorTween}
                    />
                  )}
                  <Icon className={cn("relative h-[22px] w-[22px]", active && "text-[var(--color-intelligence)]")} />
                  {badge > 0 && (
                    <motion.span
                      initial={reducedMotion ? false : { scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={springSnappy}
                      className="absolute -right-0.5 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-strength)] px-1 text-[9px] font-bold text-[var(--color-bg)] shadow-[var(--shadow-1)]"
                    >
                      {badge > 99 ? "99+" : badge}
                    </motion.span>
                  )}
                </span>
                <span className={cn("relative", active && "font-semibold")}>{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
