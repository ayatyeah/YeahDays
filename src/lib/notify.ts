"use client";

/**
 * Доставка уведомлений — клиентская часть.
 *
 * Проблема, которую решает этот файл: у веба нет ОДНОГО способа показать
 * уведомление в будущем. Поэтому здесь два слоя, и выбирается тот, который
 * реально работает на устройстве:
 *
 *  1. Notification Triggers (Chrome/Android) — уведомление ставится прямо в
 *     систему и срабатывает, даже если приложение закрыто, а телефон офлайн.
 *     Идеальный вариант: без сервера, без задержек, без батарейки.
 *  2. Серверный web-push (везде остальное, включая iOS 16.4+) — момент
 *     показа мы отдаём бэкенду, он присылает push в нужную минуту.
 *
 * Второй слой включается только там, где нет первого: иначе на одно событие
 * приходило бы два уведомления.
 *
 * Ключ (`key`) — идемпотентность. Расписание пересобирается при каждом
 * изменении плана, и без ключей мы бы плодили дубли на каждый рендер.
 */

import { getUserId } from "./userId";
import type { NotifyItem } from "./notifyPlan";

const STORE_KEY = "yd-notify-scheduled";
const VAPID_PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";

/* ────────────────────────  Поддержка  ──────────────────────── */

export function notifySupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "Notification" in window
  );
}

export function pushSupported(): boolean {
  return notifySupported() && "PushManager" in window && Boolean(VAPID_PUBLIC);
}

/** Умеет ли браузер ставить уведомления «на будущее» сам. */
export function triggersSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "Notification" in window &&
    "showTrigger" in Notification.prototype
  );
}

export function permissionState(): NotificationPermission | "unsupported" {
  if (!notifySupported()) return "unsupported";
  return Notification.permission;
}

/** Спросить разрешение. Вызывать только по явному действию пользователя. */
export async function requestPermission(): Promise<NotificationPermission> {
  if (!notifySupported()) return "denied";
  try {
    return await Notification.requestPermission();
  } catch {
    return "denied";
  }
}

/* ────────────────────────  Подписка на push  ──────────────────────── */

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const normalized = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(normalized);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

export async function currentSubscription(): Promise<PushSubscription | null> {
  if (!pushSupported()) return null;
  try {
    const reg = await navigator.serviceWorker.ready;
    return await reg.pushManager.getSubscription();
  } catch {
    return null;
  }
}

/**
 * Подписать устройство и сообщить серверу час утреннего напоминания.
 * Возвращает false, если что-то не сложилось — вызывающий покажет это в UI.
 */
export async function subscribeToPush(morningHour: number): Promise<boolean> {
  if (!pushSupported()) return false;
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub =
      (await reg.pushManager.getSubscription()) ??
      (await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          VAPID_PUBLIC,
        ) as BufferSource,
      }));

    const res = await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: getUserId(),
        subscription: sub.toJSON(),
        tzOffset: new Date().getTimezoneOffset(),
        morningHour,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function unsubscribeFromPush(): Promise<void> {
  const sub = await currentSubscription();
  if (!sub) return;
  await fetch("/api/push/subscribe", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ endpoint: sub.endpoint }),
  }).catch(() => {});
  await sub.unsubscribe().catch(() => {});
}

/* ────────────────────────  Показать сейчас  ──────────────────────── */

/**
 * Показать уведомление немедленно.
 *
 * Через registration, а не через `new Notification()`: последний не работает
 * на Android вообще и не даёт кнопок действий.
 */
export async function showNow(item: {
  title: string;
  body: string;
  url?: string;
  tag?: string;
}): Promise<boolean> {
  if (permissionState() !== "granted") return false;
  try {
    const reg = await navigator.serviceWorker.ready;
    await reg.showNotification(item.title, {
      body: item.body,
      icon: "/icon-192.png",
      badge: "/favicon.png",
      tag: item.tag ?? "yd-now",
      data: { url: item.url ?? "/app" },
    });
    return true;
  } catch {
    return false;
  }
}

/* ────────────────────────  Расписание  ──────────────────────── */

type ScheduledMap = Record<string, number>;

function readScheduled(): ScheduledMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeScheduled(map: ScheduledMap) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(map));
  } catch {
    // квота — не повод ронять приложение
  }
}

/** Тип триггера отсутствует в стандартных d.ts — описываем минимально. */
interface TriggerOptions extends NotificationOptions {
  showTrigger?: unknown;
}
type TimestampTriggerCtor = new (timestamp: number) => unknown;

async function scheduleLocally(item: NotifyItem): Promise<boolean> {
  if (!triggersSupported()) return false;
  try {
    const reg = await navigator.serviceWorker.ready;
    const Ctor = (window as unknown as { TimestampTrigger?: TimestampTriggerCtor })
      .TimestampTrigger;
    if (!Ctor) return false;

    const options: TriggerOptions = {
      body: item.body,
      icon: "/icon-192.png",
      badge: "/favicon.png",
      tag: item.key,
      data: { url: item.url, key: item.key, taskId: item.taskId, kind: item.kind },
      showTrigger: new Ctor(item.at),
    };
    await reg.showNotification(item.title, options);
    return true;
  } catch {
    return false;
  }
}

async function cancelLocally(key: string): Promise<void> {
  if (!notifySupported()) return;
  try {
    const reg = await navigator.serviceWorker.ready;
    const list = await reg.getNotifications({
      tag: key,
      // уже запланированные, но ещё не показанные — их и надо снимать
      includeTriggered: true,
    } as GetNotificationOptions);
    for (const n of list) n.close();
  } catch {
    // нечего снимать
  }
}

/**
 * Привести расписание к нужному виду.
 *
 * Диффом, а не «снести всё и поставить заново»: перепланирование происходит
 * на каждое изменение плана, и полная пересборка означала бы постоянные
 * запросы к серверу и мигание уже поставленных уведомлений.
 */
export async function syncSchedule(items: NotifyItem[]): Promise<void> {
  if (permissionState() !== "granted") return;

  const known = readScheduled();
  const desired: ScheduledMap = {};
  const upsert: NotifyItem[] = [];

  for (const item of items) {
    desired[item.key] = item.at;
    if (known[item.key] !== item.at) upsert.push(item);
  }

  const cancel = Object.keys(known).filter((key) => !(key in desired));

  if (upsert.length === 0 && cancel.length === 0) return;

  const local = triggersSupported();

  for (const key of cancel) await cancelLocally(key);
  if (local) {
    for (const item of upsert) {
      // перед перестановкой снимаем старое с тем же ключом
      await cancelLocally(item.key);
      await scheduleLocally(item);
    }
  }

  // Сервер: там, где триггеров нет — это единственный способ достучаться до
  // закрытого приложения. Где есть — отправляем только отмены, чтобы
  // случайно не задвоить уведомление.
  const userId = getUserId();
  if (userId && pushSupported()) {
    await fetch("/api/push/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        tzOffset: new Date().getTimezoneOffset(),
        upsert: local ? [] : upsert,
        cancel: local ? [...cancel, ...upsert.map((i) => i.key)] : cancel,
      }),
      keepalive: true,
    }).catch(() => {});
  }

  writeScheduled(desired);
}

/** Полностью очистить расписание (выключение уведомлений, сброс данных). */
export async function clearSchedule(): Promise<void> {
  const known = readScheduled();
  for (const key of Object.keys(known)) await cancelLocally(key);
  const userId = getUserId();
  if (userId) {
    await fetch("/api/push/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, upsert: [], cancel: Object.keys(known) }),
    }).catch(() => {});
  }
  writeScheduled({});
}
