/**
 * Продуктовая аналитика и репорт ошибок.
 *
 * Обёртка намеренно тонкая и без внешних зависимостей: пока не заданы
 * ключи — всё молчит, приложение работает как раньше. Это позволяет
 * писать вызовы в коде уже сейчас, а подключить сервис потом, не трогая
 * бизнес-логику.
 *
 * Почему не «просто поставить SDK»: сторонний скрипт в PWA — это лишние
 * килобайты, ещё один источник падений и вопрос приватности. Сначала
 * контракт, потом провайдер.
 */

type Props = Record<string, string | number | boolean | null | undefined>;

const ENDPOINT = process.env.NEXT_PUBLIC_ANALYTICS_URL ?? "";
const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN ?? "";

export const analyticsEnabled = Boolean(ENDPOINT);
export const errorReportingEnabled = Boolean(SENTRY_DSN);

/** Ключевые события продукта — единый словарь, чтобы не плодить строки. */
export type AnalyticsEvent =
  | "onboarding_started"
  | "onboarding_completed"
  | "checkin_completed"
  | "action_accepted"
  | "action_rejected"
  | "action_completed"
  | "day_completed"
  | "quest_created"
  | "quest_completed"
  | "retro_submitted"
  | "push_enabled"
  | "push_disabled"
  | "share_created"
  | "signed_in"
  | "streak_saved_by_freeze";

/**
 * Отправить событие. Никогда не бросает и не блокирует UI: аналитика,
 * которая роняет приложение, хуже отсутствующей аналитики.
 */
export function track(event: AnalyticsEvent, props: Props = {}): void {
  if (!analyticsEnabled || typeof window === "undefined") return;
  try {
    const body = JSON.stringify({
      event,
      props,
      at: Date.now(),
      path: window.location.pathname,
    });
    // sendBeacon переживает закрытие вкладки, fetch — запасной путь
    if (navigator.sendBeacon) {
      navigator.sendBeacon(ENDPOINT, new Blob([body], { type: "application/json" }));
      return;
    }
    void fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // молча: сбор метрик не должен влиять на пользователя
  }
}

/** Сообщить об ошибке. Тоже безопасно вызывать всегда. */
export function reportError(error: unknown, context: Props = {}): void {
  if (typeof console !== "undefined") {
    console.error("[yeahdays]", error, context);
  }
  if (!errorReportingEnabled || typeof window === "undefined") return;
  try {
    const message =
      error instanceof Error ? error.message : String(error ?? "unknown");
    const stack = error instanceof Error ? error.stack : undefined;
    void fetch("/api/telemetry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        stack,
        context,
        path: window.location.pathname,
        at: Date.now(),
      }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // см. выше
  }
}
