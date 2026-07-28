"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  useUserStore,
  useHydrated,
  selectToday,
  isTodoOnDay,
  isTodoDone,
} from "@/store/useUserStore";
import { dateKey } from "@/lib/domain";
import {
  buildSchedule,
  type NotifyItem,
  type TodoInput,
} from "@/lib/notifyPlan";
import { permissionState, syncSchedule } from "@/lib/notify";
import { track } from "@/lib/analytics";

/**
 * Планировщик уведомлений.
 *
 * Живёт рядом с приложением и держит расписание в актуальном виде: взял
 * задачу — появились напоминания о её ходе, закрыл — исчезли, завёл дело на
 * 15:00 — прилетит в 14:55. Всё пересобирается из состояния, а не копится
 * событиями: расписание — это ФУНКЦИЯ от плана, поэтому оно не может
 * разъехаться с тем, что человек видит на экране.
 *
 * Здесь же обрабатываются нажатия на кнопки в самом уведомлении: «Сделал»
 * закрывает задачу, не открывая приложение по-настоящему, «+10 минут»
 * отодвигает напоминание.
 */

const SNOOZE_KEY = "yd-notify-snooze";
const SNOOZE_MIN = 10;

type SnoozeMap = Record<string, number>;

function readSnooze(): SnoozeMap {
  try {
    const raw = localStorage.getItem(SNOOZE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeSnooze(map: SnoozeMap) {
  try {
    localStorage.setItem(SNOOZE_KEY, JSON.stringify(map));
  } catch {
    /* переполнение квоты не должно ломать приложение */
  }
}

export default function NotificationCenter() {
  const hydrated = useHydrated();
  const plan = useUserStore((s) => s.plan);
  const todos = useUserStore((s) => s.todos);
  const notify = useUserStore((s) => s.notify);
  const toggleTask = useUserStore((s) => s.toggleTask);

  /** Ререндер после отложки: снуз живёт в localStorage, а не в сторе. */
  const bump = useRef(0);
  const forceRef = useRef<() => void>(() => {});

  const today = useMemo(() => selectToday(plan), [plan]);

  /** Активная задача — та, что взята и ещё не закрыта. */
  const active = useMemo(() => {
    const t = today.find((task) => !task.completed);
    if (!t) return null;
    return {
      id: t.id,
      title: t.snapshot.title,
      duration: t.snapshot.duration,
      acceptedAt: t.acceptedAt,
    };
  }, [today]);

  /** Дела на сегодня, привязанные к часу и ещё не отмеченные. */
  const timedTodos = useMemo<TodoInput[]>(() => {
    const day = dateKey();
    return todos
      .filter(
        (t) =>
          typeof t.hour === "number" &&
          isTodoOnDay(t, day) &&
          !isTodoDone(t, day),
      )
      .map((t) => ({
        id: t.id,
        title: t.title,
        day,
        hour: t.hour as number,
        duration: t.duration,
      }));
  }, [todos]);

  /* ── Пересборка расписания ── */
  const rebuild = useCallback(() => {
    if (!hydrated) return;
    if (permissionState() !== "granted") return;

    const now = Date.now();
    const items: NotifyItem[] = buildSchedule({
      active,
      todos: timedTodos,
      prefs: notify,
      now,
    });

    // Отложенные вручную напоминания добавляем поверх: без этого следующая
    // же пересборка сняла бы их как «лишние».
    const snooze = readSnooze();
    let changed = false;
    for (const [key, at] of Object.entries(snooze)) {
      const taskId = key.split(":")[1];
      const stillActive = active?.id === taskId;
      if (at <= now || !stillActive) {
        delete snooze[key];
        changed = true;
        continue;
      }
      items.push({
        key,
        at,
        title: "Возвращаемся к задаче",
        body: active ? `«${active.title}» ждёт.` : "Задача ждёт.",
        url: "/app",
        kind: "task",
        taskId: active?.id,
      });
    }
    if (changed) writeSnooze(snooze);

    void syncSchedule(items);
  }, [hydrated, active, timedTodos, notify]);

  forceRef.current = rebuild;

  /* Дебаунс: план меняется пачками (принял действие → пересчитались селекторы). */
  useEffect(() => {
    const id = window.setTimeout(rebuild, 400);
    return () => window.clearTimeout(id);
  }, [rebuild]);

  /* Возврат в приложение и смена дня — тоже повод пересобрать. */
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") forceRef.current();
    };
    document.addEventListener("visibilitychange", onVisible);
    const id = window.setInterval(() => forceRef.current(), 15 * 60_000);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.clearInterval(id);
    };
  }, []);

  /* ── Кнопки в уведомлении ── */
  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    const onMessage = (event: MessageEvent) => {
      const data = event.data as
        | { type?: string; action?: string; taskId?: string; key?: string }
        | undefined;
      if (data?.type !== "YD_NOTIFY_ACTION") return;

      if (data.action === "complete" && data.taskId) {
        const task = useUserStore
          .getState()
          .plan.find((t) => t.id === data.taskId);
        if (task && !task.completed) {
          toggleTask(task.id);
          track("notification_completed");
        }
      }

      if (data.action === "snooze" && data.key) {
        const snooze = readSnooze();
        snooze[`${data.key}:snooze`] = Date.now() + SNOOZE_MIN * 60_000;
        writeSnooze(snooze);
        bump.current += 1;
        track("notification_snoozed");
      }

      forceRef.current();
    };

    navigator.serviceWorker.addEventListener("message", onMessage);
    return () =>
      navigator.serviceWorker.removeEventListener("message", onMessage);
  }, [toggleTask]);

  /* ── Deep-link из уведомления, когда приложение было закрыто ── */
  useEffect(() => {
    if (!hydrated) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("do") !== "complete") return;

    const taskId = params.get("task");
    if (taskId) {
      const task = useUserStore.getState().plan.find((t) => t.id === taskId);
      if (task && !task.completed) {
        toggleTask(task.id);
        track("notification_completed");
      }
    }
    // адрес чистим, чтобы обновление страницы не закрыло задачу второй раз
    params.delete("do");
    params.delete("task");
    const qs = params.toString();
    window.history.replaceState(
      null,
      "",
      window.location.pathname + (qs ? `?${qs}` : ""),
    );
  }, [hydrated, toggleTask]);

  return null;
}
