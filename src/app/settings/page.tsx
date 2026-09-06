"use client";

import Link from "next/link";
import SettingsContent from "@/components/SettingsContent";
import { LogoLoader } from "@/components/Logo";
import { YgIcon } from "@/components/yg-icons";
import { useHydrated } from "@/store/useUserStore";

/**
 * Страница настроек — для прямых ссылок и десктопа. В приложении те же
 * настройки открываются панелью поверх профиля по шестерёнке; содержимое
 * общее (SettingsContent).
 *
 * Маршрут ничего не регистрирует: он не в MARKETING (Shell даёт навигацию)
 * и не в PUBLIC_PATHS (proxy требует вход) — тот же принцип, что у /manage.
 */
export default function SettingsPage() {
  const hydrated = useHydrated();
  if (!hydrated) return <LogoLoader />;

  return (
    <div className="flex flex-1 flex-col">
      <header className="mb-5">
        <Link
          href="/account"
          className="press -ml-1.5 inline-flex h-9 items-center gap-0.5 pr-2 text-[17px] text-[var(--color-fg-dim)]"
        >
          <YgIcon name="chevron" className="h-5 w-5 rotate-180" strokeWidth={2} />
          Профиль
        </Link>
        <h1 className="ios-title mt-1">Настройки</h1>
      </header>
      <SettingsContent />
    </div>
  );
}
