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
import { YgIcon } from "@/components/yg-icons";
import { useUserStore } from "@/store/useUserStore";
import { useThemeStore } from "@/store/useThemeStore";

/**
 * Содержимое настроек — одно на два места: панель поверх профиля
 * (шестерёнка) и страница /settings для прямых ссылок. Всё, что
 * НАСТРАИВАЕТ приложение, в отличие от профиля, где «кто я и как расту».
 *
 * Собрано как экран Настроек iOS: вставные группы с подписями капителью,
 * строки по 44pt с переключателем или шевроном справа.
 *
 * compact — внутри панели: без десктопной двухколоночной сетки, всё одним
 * потоком, как и должно быть в листе.
 */
export default function SettingsContent({ compact = false }: { compact?: boolean }) {
  const resetAll = useUserStore((s) => s.resetAll);
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <>
      <div className={compact ? "" : "desk"}>
        <div className={compact ? "" : "desk-main"}>
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
                  <span className="block text-[16px]">Тёмная тема</span>
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

        <div className={compact ? "" : "desk-aside"}>
          <Group title="Управление">
            <div className="inset-group">
              <Link href="/manage" className="inset-row inset-row-press py-2">
                <span className="min-w-0 flex-1">
                  <span className="block text-[16px]">Действия и расписание</span>
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
        <p className="text-[15px] leading-snug text-[var(--color-fg-dim)]">
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
    </>
  );
}

/** Группа настроек: подпись капителью с отступом под ячейку, содержимое как есть. */
function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-7 first:mt-1">
      <h2 className="inset-title">{title}</h2>
      {children}
    </section>
  );
}
