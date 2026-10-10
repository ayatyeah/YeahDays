"use client";

import { usePathname, useRouter } from "next/navigation";
import { haptic } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { useUserStore, useHydrated, selectToday } from "@/store/useUserStore";
import { useNavStore } from "@/store/useNavStore";
import { TAB_PATH, tabFromPath } from "@/lib/nav";
import { useEffect, useMemo } from "react";
import { useKeyboardInset } from "@/lib/useKeyboardInset";
import {
  LearnIcon,
  CommunityIcon,
  HomeIcon,
  ProgressIcon,
  AccountIcon,
} from "@/components/nav-icons";

const NAV = [
  { tab: "today", label: "Сегодня", Icon: HomeIcon },
  { tab: "learn", label: "Учёба", Icon: LearnIcon },
  { tab: "community", label: "Вместе", Icon: CommunityIcon },
  { tab: "progress", label: "Прогресс", Icon: ProgressIcon },
  { tab: "account", label: "Профиль", Icon: AccountIcon },
] as const;

/** Подразделы «Учёбы»: вкладка остаётся подсвеченной и внутри них. */
const LEARN_PATHS = ["/learn", "/events", "/challenge30"];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const section = tabFromPath(pathname);
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
    void (pending > 0 ? n.setAppBadge(pending) : n.clearAppBadge?.()).catch(
      () => {},
    );
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
      className="yg-bottom-nav yg-capsule pointer-events-none fixed inset-x-0 z-40 lg:hidden"
      aria-label="Основная навигация"
      style={{ bottom: 0 }}
    >
      <div className="pointer-events-auto yg-capsule-bar">
        <div className="yg-bottom-nav-items yg-capsule-items">
          {NAV.map(({ tab: key, label, Icon }) => {
            const active =
              key === "learn"
                ? LEARN_PATHS.some(
                    (p) => pathname === p || pathname.startsWith(`${p}/`),
                  )
                : key === "community"
                  ? pathname === "/community"
                  : section !== null && tab === key;
            const badge = key === "today" && pending > 0 ? pending : 0;
            return (
              <button
                key={key}
                type="button"
                // Внутри оболочки переключаем секцию; с отдельных
                // страниц возвращаемся через роутер Next.
                onClick={() => {
                  if (!active) haptic("select");
                  if (key === "learn" || key === "community")
                    router.push(`/${key}`);
                  else if (section === null) router.push(TAB_PATH[key]);
                  else go(key);
                }}
                aria-current={active ? "page" : undefined}
                aria-label={
                  badge ? `${label}, незавершённых дел: ${badge}` : label
                }
                title={label}
                className={cn("yg-capsule-tab", active && "is-active")}
              >
                <span className="yg-capsule-icon" aria-hidden="true">
                  <Icon />
                  {badge > 0 && (
                    <span className="yg-capsule-badge">
                      {badge > 99 ? "99+" : badge}
                    </span>
                  )}
                </span>
                <span className="yg-capsule-label" aria-hidden="true">
                  <span>{label}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
