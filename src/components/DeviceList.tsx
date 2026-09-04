"use client";

import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { haptic } from "@/lib/motion";

interface Device {
  id: string;
  label: string;
  enabled: boolean;
  createdAt: number;
  updatedAt: number;
}

/** "2 часа назад" / "вчера" / "3 дня назад" — из updatedAt подписки. */
function timeAgo(ms: number): string {
  const diffMin = Math.round((Date.now() - ms) / 60_000);
  if (diffMin < 1) return "только что";
  if (diffMin < 60) return `${diffMin} мин назад`;
  const diffH = Math.round(diffMin / 60);
  if (diffH < 24) return `${diffH} ч назад`;
  const diffD = Math.round(diffH / 24);
  if (diffD === 1) return "вчера";
  if (diffD < 30) return `${diffD} дн назад`;
  return new Date(ms).toLocaleDateString("ru-RU");
}

/**
 * Список устройств, подписанных на push-уведомления (телефон, ноутбук и
 * т.д.) — в отличие от PushOptIn, который знает только про ТЕКУЩИЙ браузер.
 * Обновляется по updatedAt подписки — это не "онлайн сейчас", а "когда в
 * последний раз подтверждалась/обновлялась подписка этого устройства"
 * (при включении напоминаний или смене часа).
 */
export default function DeviceList() {
  const [devices, setDevices] = useState<Device[] | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/push/devices");
      if (!res.ok) return;
      const data = (await res.json()) as { devices: Device[] };
      setDevices(data.devices);
    } catch {
      // тихо — список устройств необязателен для работы страницы
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const remove = useCallback(
    async (id: string) => {
      setDevices((prev) => prev?.filter((d) => d.id !== id) ?? null);
      setConfirmId(null);
      haptic("success");
      try {
        await fetch("/api/push/devices", {
          method: "DELETE",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ id }),
        });
      } catch {
        void load(); // не удалилось — вернуть как было
      }
    },
    [load],
  );

  if (!devices || devices.length === 0) return null;

  return (
    <section className="rounded-3xl surface p-4">
      <p className="text-[14px] font-semibold">
        Ваши устройства ({devices.length})
      </p>
      <p className="mt-1 text-[12.5px] leading-snug text-[var(--color-muted)]">
        Уведомления приходят на все включённые ниже.
      </p>
      <div className="mt-3 flex flex-col gap-1.5">
        {devices.map((d) => (
          <div
            key={d.id}
            className="flex items-center gap-3 rounded-2xl bg-[var(--color-surface-2)] px-3 py-2.5"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13.5px] font-medium">{d.label}</p>
              <p className="mt-0.5 text-[12px] text-[var(--color-muted)]">
                {d.enabled ? "включено" : "выключено"} · {timeAgo(d.updatedAt)}
              </p>
            </div>
            {confirmId === d.id ? (
              <div className="flex shrink-0 items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => void remove(d.id)}
                  className="rounded-xl bg-[var(--color-strength)] px-2.5 py-1.5 text-[12px] font-semibold text-white"
                >
                  Удалить
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmId(null)}
                  className="rounded-xl px-2.5 py-1.5 text-[12px] text-[var(--color-muted)]"
                >
                  Отмена
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmId(d.id)}
                aria-label={`Удалить устройство ${d.label}`}
                className={cn(
                  "shrink-0 rounded-xl px-2 py-1.5 text-[16px] text-[var(--color-muted)] transition active:scale-90",
                )}
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
