"use client";

import { useCallback, useEffect, useState } from "react";
import { getUserId } from "@/lib/userId";
import { useUserStore } from "@/store/useUserStore";
import { cn } from "@/lib/cn";
import { track } from "@/lib/analytics";

const VAPID_PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";

/** base64url → Uint8Array, как требует PushManager. */
function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const normalized = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(normalized);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

type State =
  | "unsupported" // браузер не умеет (или ключей нет)
  | "denied" // пользователь запретил в браузере
  | "off" // можно включить
  | "on" // подписан
  | "busy";

/**
 * Включение напоминаний.
 *
 * Осознанно НЕ спрашиваем разрешение при первом запуске: браузерный
 * запрос без контекста почти всегда получает «Заблокировать», и второго
 * шанса не будет. Показываем понятную карточку и просим только по нажатию.
 */
export default function PushOptIn() {
  const [state, setState] = useState<State>("busy");
  const reminderHour = useUserStore((s) => s.reminderHour);
  const setReminderHour = useUserStore((s) => s.setReminderHour);

  /** Переподписать с новым часом — подписка уже есть, меняем настройку. */
  const resubscribe = useCallback(async (hour: number) => {
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (!sub) return;
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: getUserId(),
          subscription: sub.toJSON(),
          tzOffset: new Date().getTimezoneOffset(),
          morningHour: hour,
        }),
      });
    } catch {
      // не критично: час сохранён локально и уедет при следующей подписке
    }
  }, []);

  const supported =
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window &&
    Boolean(VAPID_PUBLIC);

  useEffect(() => {
    if (!supported) {
      setState("unsupported");
      return;
    }
    if (Notification.permission === "denied") {
      setState("denied");
      return;
    }
    navigator.serviceWorker.ready
      .then((reg) => reg.pushManager.getSubscription())
      .then((sub) => setState(sub ? "on" : "off"))
      .catch(() => setState("off"));
  }, [supported]);

  const enable = useCallback(async () => {
    setState("busy");
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setState(permission === "denied" ? "denied" : "off");
        return;
      }
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC) as BufferSource,
      });
      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: getUserId(),
          subscription: sub.toJSON(),
          tzOffset: new Date().getTimezoneOffset(),
          morningHour: reminderHour,
        }),
      });
      setState(res.ok ? "on" : "off");
      if (res.ok) track("push_enabled");
    } catch {
      setState("off");
    }
  }, []);

  const disable = useCallback(async () => {
    setState("busy");
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await fetch("/api/push/subscribe", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        }).catch(() => {});
        await sub.unsubscribe();
      }
      setState("off");
      track("push_disabled");
    } catch {
      setState("on");
    }
  }, []);

  if (state === "unsupported") return null;

  return (
    <section className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="flex items-start gap-3">
        <span className="text-xl" aria-hidden>
          🔔
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold">
            {state === "on" ? "Напоминания включены" : "Напоминания"}
          </p>
          <p className="mt-1 text-[11.5px] leading-snug text-[var(--color-muted)]">
            {state === "denied" ? (
              <>
                Уведомления заблокированы в браузере. Включить можно в его
                настройках для этого сайта.
              </>
            ) : state === "on" ? (
              <>
                Утром — что сделать сегодня, вечером — напоминание закрыть день.
                Вечернее время подстраивается под то, когда ты обычно
                занимаешься.
              </>
            ) : (
              <>
                Два коротких напоминания в день: утром — колода, вечером — если
                день ещё не закрыт. Без спама и не когда попало.
              </>
            )}
          </p>
        </div>
      </div>

      {/* Час утреннего напоминания. Вечерний подбирается автоматически
          по тому, когда человек реально закрывает действия. */}
      {state !== "denied" && (
        <div className="mt-3">
          <p className="mb-2 text-[11.5px] text-[var(--color-muted)]">
            Утром в{" "}
            <span className="font-semibold text-[var(--color-fg)]">
              {String(reminderHour).padStart(2, "0")}:00
            </span>
          </p>
          <div className="grid grid-cols-6 gap-1.5">
            {[6, 7, 8, 9, 10, 11].map((h) => (
              <button
                key={h}
                onClick={() => {
                  setReminderHour(h);
                  if (state === "on") void resubscribe(h);
                }}
                className={cn(
                  "rounded-xl border py-2 text-[12px] tabular-nums transition",
                  reminderHour === h
                    ? "border-[var(--color-fg)] bg-[var(--color-surface-2)]"
                    : "border-[var(--color-border)] text-[var(--color-muted)]",
                )}
              >
                {h}
              </button>
            ))}
          </div>
        </div>
      )}

      {state !== "denied" && (
        <button
          onClick={state === "on" ? disable : enable}
          disabled={state === "busy"}
          className={cn(
            "mt-3 h-11 w-full rounded-2xl text-[14px] font-semibold transition active:scale-[0.99] disabled:opacity-60",
            state === "on"
              ? "border border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-muted)]"
              : "bg-[var(--color-fg)] text-[var(--color-bg)]",
          )}
        >
          {state === "busy"
            ? "…"
            : state === "on"
              ? "Выключить напоминания"
              : "Включить напоминания"}
        </button>
      )}
    </section>
  );
}
