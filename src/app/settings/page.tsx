"use client";

import { useState } from "react";
import Link from "next/link";
import PushOptIn from "@/components/PushOptIn";
import DeviceList from "@/components/DeviceList";
import PairingCodeCard from "@/components/PairingCodeCard";
import DataControls from "@/components/DataControls";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Switch from "@/components/ui/Switch";
import { LogoLoader } from "@/components/Logo";
import { YgIcon } from "@/components/yg-icons";
import { useUserStore, useHydrated } from "@/store/useUserStore";
import { useThemeStore } from "@/store/useThemeStore";

/**
 * Настройки — всё, что НАСТРАИВАЕТ приложение, в отличие от профиля, где
 * «кто я и как расту». Раньше это лежало в профиле одним потоком: уведомления
 * вперемешку с целями, сброс прогресса под приоритетами, — и раздел
 * читался как свалка. Сюда ведёт шестерёнка в шапке профиля.
 *
 * Собрано как экран Настроек iOS: кнопка «‹ Профиль» наверху, большой
 * заголовок, вставные группы с подписями капителью, строки по 44pt с
 * переключателем или шевроном справа.
 *
 * Маршрут ничего не регистрирует: он не в MARKETING (Shell даёт навигацию)
 * и не в PUBLIC_PATHS (proxy требует вход) — тот же принцип, что у /manage.
 */
export default function SettingsPage() {
  const hydrated = useHydrated();
  const resetAll = useUserStore((s) => s.resetAll);
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const [confirmReset, setConfirmReset] = useState(false);

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

      <div className="desk">
        <div className="desk-main">
          <Group title="Уведомления">
            <PushOptIn />
            <div className="mt-3">
              <DeviceList />
            </div>
          </Group>

          <Group title="Внешний вид">
            <div className="inset-group">
              <div className="inset-row py-2">
                <span className="min-w-0 flex-1">
                  <span className="block text-[17px]">Тёмная тема</span>
                </span>
                <Switch
                  checked={theme !== "light"}
                  onChange={() => toggleTheme()}
                  label="Тёмная тема"
                />
              </div>
            </div>
          </Group>

          <Group title="Данные">
            <DataControls />
            <div className="mt-3">
              <Button
                variant="danger"
                className="w-full"
                onClick={() => setConfirmReset(true)}
              >
                Сбросить прогресс
              </Button>
            </div>
          </Group>
        </div>

        <div className="desk-aside">
          <Group title="Управление">
            <div className="inset-group">
              <Link href="/manage" className="inset-row inset-row-press py-2">
                <span className="min-w-0 flex-1">
                  <span className="block text-[17px]">Действия и расписание</span>
                </span>
                <YgIcon name="chevron" className="h-4 w-4 text-[var(--color-muted)]" strokeWidth={2} />
              </Link>
            </div>
          </Group>

          <Group title="Интеграции">
            <PairingCodeCard />
          </Group>

        </div>
      </div>

      <Modal
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        title="Сбросить прогресс?"
      >
        <p className="text-[16px] leading-snug text-[var(--color-fg-dim)]">
          Все выполненные действия, уровень и история свайпов будут удалены.
          Это нельзя отменить.
        </p>
        <div className="mt-5 flex gap-2.5">
          <Button className="flex-1" onClick={() => setConfirmReset(false)}>
            Отмена
          </Button>
          <Button
            variant="danger"
            className="flex-1"
            onClick={() => {
              resetAll();
              setConfirmReset(false);
            }}
          >
            Сбросить
          </Button>
        </div>
      </Modal>
    </div>
  );
}

/** Группа настроек: подпись капителью с отступом под ячейку, содержимое как есть. */
function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-7 first:mt-2">
      <h2 className="inset-title">{title}</h2>
      {children}
    </section>
  );
}
