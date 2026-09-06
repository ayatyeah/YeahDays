"use client";

import { useCallback, useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { cn } from "@/lib/cn";
import { track } from "@/lib/analytics";
import { haptic } from "@/lib/motion";
import {
  clearSchedule,
  currentSubscription,
  permissionState,
  pushSupported,
  requestPermission,
  showNow,
  subscribeToPush,
  triggersSupported,
  unsubscribeFromPush,
} from "@/lib/notify";
import { TODO_LEAD_MIN } from "@/lib/notifyPlan";
import { YgIcon } from "@/components/yg-icons";

type State =
  | "unsupported" // браузер не умеет (или ключей нет)
  | "denied" // пользователь запретил в браузере
  | "off" // можно включить
  | "on" // подписан
  | "busy";

/**
 * Настройки напоминаний.
 *
 * Осознанно НЕ спрашиваем разрешение при первом запуске: браузерный запрос
 * без контекста почти всегда получает «Заблокировать», и второго шанса не
 * будет. Показываем понятную карточку и просим только по нажатию.
 *
 * Управление разделено по СМЫСЛУ, а не по технологии: человеку важно
 * «дёргать ли меня по ходу задачи», а не «push это или локальный триггер».
 * Каждый тумблер можно выключить отдельно — иначе первое же неуместное
 * уведомление выключает всё разом и навсегда.
 */
export default function PushOptIn() {
  const [state, setState] = useState<State>("busy");
  const [tested, setTested] = useState(false);

  const reminderHour = useUserStore((s) => s.reminderHour);
  const setReminderHour = useUserStore((s) => s.setReminderHour);
  const notify = useUserStore((s) => s.notify);
  const setNotify = useUserStore((s) => s.setNotify);

  const supported = pushSupported();

  useEffect(() => {
    if (!supported) {
      setState("unsupported");
      return;
    }
    if (permissionState() === "denied") {
      setState("denied");
      return;
    }
    void currentSubscription().then((sub) => setState(sub ? "on" : "off"));
  }, [supported]);

  const enable = useCallback(async () => {
    setState("busy");
    const permission = await requestPermission();
    if (permission !== "granted") {
      setState(permission === "denied" ? "denied" : "off");
      return;
    }
    const ok = await subscribeToPush(reminderHour);
    setState(ok ? "on" : "off");
    if (ok) {
      haptic("success");
      track("push_enabled");
    }
  }, [reminderHour]);

  const disable = useCallback(async () => {
    setState("busy");
    try {
      // снимаем и подписку, и всё, что уже запланировано: иначе выключение
      // «работало бы», но телефон продолжал звенеть по старым триггерам
      await clearSchedule();
      await unsubscribeFromPush();
      setState("off");
      track("push_disabled");
    } catch {
      setState("on");
    }
  }, []);

  const test = useCallback(async () => {
    const ok = await showNow({
      title: "Так это выглядит",
      body: "Настоящие напоминания приходят по ходу задачи и по плану дня.",
      tag: "yd-test",
    });
    if (ok) {
      setTested(true);
      track("notification_test_sent");
      window.setTimeout(() => setTested(false), 2500);
    }
  }, []);

  if (state === "unsupported") return null;

  const on = state === "on";

  return (
    <section className="rounded-3xl surface p-5">
      <div className="flex items-start gap-3">
        <span className="text-[22px]" aria-hidden>
          <YgIcon name="bell" className="h-6 w-6" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold">
            {on ? "Напоминания включены" : "Напоминания"}
          </p>
          <p className="mt-1 text-[13px] leading-snug text-[var(--color-muted)]">
            {state === "denied" ? (
              <>
                Заблокированы в браузере
              </>
            ) : on ? (
              <>
                По плану дня и за {TODO_LEAD_MIN} минут до дел
              </>
            ) : (
              <>
                Напоминание в момент, когда оно нужно: время задачи вышло, до
                дела осталось {TODO_LEAD_MIN} минут, день ещё не закрыт. Без
                спама и не когда попало.
              </>
            )}
          </p>
        </div>
      </div>

      {state !== "denied" && (
        <>
          {/* Час утреннего напоминания. Вечерний подбирается автоматически
              по тому, когда человек реально закрывает действия. */}
          <div className="mt-4">
            <p className="mb-2 text-[13px] text-[var(--color-muted)]">
              Утром в{" "}
              <span className="font-semibold text-[var(--color-fg)]">
                {String(reminderHour).padStart(2, "0")}:00
              </span>
            </p>
            <div className="grid grid-cols-6 gap-1.5">
              {[6, 7, 8, 9, 10, 11].map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => {
                    setReminderHour(h);
                    haptic("select");
                    if (on) void subscribeToPush(h);
                  }}
                  className={cn(
                    "rounded-xl border py-2 text-[13px] tabular-nums transition",
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

          {/* Что именно присылать */}
          <div className="mt-4 flex flex-col gap-1">
            <Toggle
              label="Ритм дня"
              hint="Утром — колода, вечером — если день не закрыт"
              value={notify.daily}
              onChange={(v) => setNotify({ daily: v })}
            />
            <Toggle
              label="Ход задачи"
              hint="Половина времени, время вышло, задача застряла"
              value={notify.tasks}
              onChange={(v) => setNotify({ tasks: v })}
            />
            <Toggle
              label="Дела со временем"
              hint={`За ${TODO_LEAD_MIN} минут до начала`}
              value={notify.todos}
              onChange={(v) => setNotify({ todos: v })}
            />
          </div>

          {/* Тихие часы */}
          <div className="mt-4 rounded-2xl bg-[var(--color-surface-2)] p-3">
            <p className="text-[13px] font-semibold">Не беспокоить</p>
            <p className="mt-0.5 text-[12px] leading-snug text-[var(--color-muted)]">
              Ночные напоминания о задачах отменяются, дела со временем
              переносятся на утро.
            </p>
            <div className="mt-2.5 flex items-center gap-2">
              <HourSelect
                label="с"
                value={notify.quietFrom}
                onChange={(v) => setNotify({ quietFrom: v })}
              />
              <HourSelect
                label="до"
                value={notify.quietTo}
                onChange={(v) => setNotify({ quietTo: v })}
              />
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={on ? disable : enable}
              disabled={state === "busy"}
              className={cn(
                "h-11 flex-1 rounded-2xl text-[15px] font-semibold transition active:scale-[0.99] disabled:opacity-60",
                on
                  ? "border border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-muted)]"
                  : "bg-[var(--color-fg)] text-[var(--color-bg)]",
              )}
            >
              {state === "busy" ? "…" : on ? "Выключить" : "Включить напоминания"}
            </button>

            {on && (
              // Проверка — не игрушка: на iOS уведомления приходят только
              // установленному приложению, и без кнопки человек узнавал бы
              // об этом через неделю тишины.
              <button
                type="button"
                onClick={test}
                className="h-11 shrink-0 rounded-2xl border border-[var(--color-border)] px-4 text-[15px] font-medium text-[var(--color-fg-dim)] transition active:scale-[0.99]"
              >
                {tested ? "Отправлено" : "Проверить"}
              </button>
            )}
          </div>

          {on && !triggersSupported() && (
            <p className="mt-2.5 text-[12px] leading-snug text-[var(--color-muted)]">
              На этом устройстве напоминания приходят через сервер: если
              приложение установлено на домашний экран, они работают и когда
              оно закрыто.
            </p>
          )}
        </>
      )}
    </section>
  );
}

/** Переключатель настройки: подпись, пояснение и сам тумблер. */
function Toggle({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={() => {
        haptic("select");
        onChange(!value);
      }}
      className="flex items-center gap-3 rounded-2xl px-1 py-2 text-left transition active:scale-[0.99]"
    >
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-medium">{label}</span>
        <span className="mt-0.5 block text-[12px] leading-snug text-[var(--color-muted)]">
          {hint}
        </span>
      </span>
      <span
        className={cn(
          "relative h-6 w-10 shrink-0 rounded-full transition-colors",
          value
            ? "bg-[var(--color-stability)]"
            : "bg-[var(--color-surface-2)] border border-[var(--color-border)]",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
            value ? "translate-x-[18px]" : "translate-x-0.5",
          )}
        />
      </span>
    </button>
  );
}

function HourSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="flex flex-1 items-center gap-2 text-[13px] text-[var(--color-muted)]">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-9 flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-2 text-[15px] tabular-nums text-[var(--color-fg)]"
      >
        {Array.from({ length: 24 }, (_, h) => (
          <option key={h} value={h}>
            {String(h).padStart(2, "0")}:00
          </option>
        ))}
      </select>
    </label>
  );
}
