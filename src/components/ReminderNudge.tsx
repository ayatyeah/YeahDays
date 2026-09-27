"use client";

import { isLmsDeadline } from "@/lib/lmsEventKind";
import { useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import { YgIcon } from "@/components/yg-icons";
import { useUserStore, isTodoOnDay, isTodoDone } from "@/store/useUserStore";
import {
  currentSubscription,
  permissionState,
  pushSupported,
  requestPermission,
  subscribeToPush,
} from "@/lib/notify";
import { TODO_LEAD_MIN } from "@/lib/notifyPlan";
import { dateKey } from "@/lib/domain";
import { track } from "@/lib/analytics";
import { haptic } from "@/lib/motion";

const DISMISS_KEY = "yg-reminder-nudge-dismissed";

/**
 * «Напомнить перед парой?» — просьба включить уведомления в момент, когда
 * они очевидно нужны.
 *
 * Переключатель жил только в настройках, и на проде за всё время не
 * набралось ни одной подписки: туда никто не заходит. Системный запрос
 * без контекста почти всегда получает «Запретить», и второго шанса браузер
 * не даёт, поэтому спрашиваем не при запуске, а когда в плане на сегодня
 * есть ещё не начавшаяся задача со временем — тогда ясно, о чём речь.
 *
 * Молчит, если браузер не умеет push (на iPhone — вне приложения с экрана
 * «Домой»), если разрешение уже дано или запрещено, и после крестика.
 */
export default function ReminderNudge() {
  const todos = useUserStore((s) => s.todos);
  const reminderHour = useUserStore((s) => s.reminderHour);
  const [eligible, setEligible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<"on" | "fail" | null>(null);

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = localStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      /* без хранилища — просто спрашиваем */
    }
    if (dismissed || !pushSupported() || permissionState() === "denied") return;
    // разрешение могли дать раньше, а подписку потерять (переустановка) —
    // тогда карточка тоже уместна
    void currentSubscription().then((sub) => setEligible(!sub));
  }, []);

  /** Ближайшая сегодняшняя задача со временем, которая ещё не началась. */
  const next = useMemo(() => {
    const day = dateKey();
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    return todos
      .filter(
        (t) =>
          t.hour !== undefined &&
          !isLmsDeadline(t) &&
          isTodoOnDay(t, day) &&
          !isTodoDone(t, day) &&
          t.hour * 60 + (t.minute ?? 0) > nowMin,
      )
      .sort((a, b) => a.hour! * 60 + (a.minute ?? 0) - (b.hour! * 60 + (b.minute ?? 0)))[0];
  }, [todos]);

  if (result === "on") {
    return (
      <section className="mb-5 flex items-center gap-3 rounded-3xl surface p-4 lg:mb-0">
        <YgIcon name="check" className="h-5 w-5 shrink-0 text-[var(--color-stability)]" />
        <p className="text-[14px]">Напомню за {TODO_LEAD_MIN} минут до начала.</p>
      </section>
    );
  }
  if (!eligible || !next) return null;

  function dismiss() {
    setEligible(false);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* не страшно */
    }
  }

  async function enable() {
    setBusy(true);
    const permission = await requestPermission();
    if (permission !== "granted") {
      setBusy(false);
      // «Запретить» — больше не спрашиваем: браузер всё равно не покажет запрос
      if (permission === "denied") setEligible(false);
      return;
    }
    const ok = await subscribeToPush(reminderHour);
    setBusy(false);
    setResult(ok ? "on" : "fail");
    if (ok) {
      haptic("success");
      track("push_enabled");
    }
  }

  const at = `${String(next.hour).padStart(2, "0")}:${String(next.minute ?? 0).padStart(2, "0")}`;

  return (
    <section className="relative mb-5 rounded-3xl surface p-5 lg:mb-0">
      <button
        type="button"
        onClick={dismiss}
        aria-label="Не напоминать"
        className="press absolute right-3 top-3 p-2 text-[var(--color-muted)]"
      >
        <YgIcon name="close" className="h-4 w-4" />
      </button>
      <div className="flex items-start gap-3 pr-6">
        <YgIcon name="bell" className="mt-0.5 h-6 w-6 shrink-0" />
        <div className="min-w-0">
          <p className="text-[16px] font-semibold">Напомнить перед началом?</p>
          <p className="mt-1 text-[14px] leading-snug text-[var(--color-muted)]">
            «{next.title}» в {at}. Пришлю уведомление за {TODO_LEAD_MIN} минут — и так
            с каждой задачей со временем.
          </p>
        </div>
      </div>
      {result === "fail" && (
        <p className="mt-3 text-[13px] text-[var(--color-strength)]">
          Не получилось включить. Попробуй ещё раз или в настройках.
        </p>
      )}
      <Button variant="primary" className="mt-4 w-full" disabled={busy} onClick={() => void enable()}>
        {busy ? "Включаю…" : "Включить напоминания"}
      </Button>
    </section>
  );
}
