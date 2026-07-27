/**
 * Продуктовая аналитика и репорт ошибок.
 *
 * Обёртка намеренно тонкая и без внешних зависимостей: пока не задан
 * ключ — всё молчит, приложение работает как раньше.
 *
 * Почему не posthog-js: сторонний SDK в PWA — это лишние килобайты в
 * бандле, ещё один источник падений и автоматический сбор всего подряд
 * (autocapture, replay, отпечаток браузера). Нам нужны пятнадцать
 * событий из словаря ниже и ничего сверх них, а HTTP-эндпоинт PostHog
 * принимает их обычным POST.
 *
 * ВАЖНО: включение аналитики меняет обещание из политики
 * конфиденциальности — данные начинают уходить внешнему обработчику.
 * Раздел 4 и список обработчиков в разделе 5 описывают ровно это
 * поведение; правя одно, правь и другое.
 */

type Props = Record<string, string | number | boolean | null | undefined>;

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "";
const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com";
const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN ?? "";

export const analyticsEnabled = Boolean(POSTHOG_KEY);
export const errorReportingEnabled = Boolean(SENTRY_DSN);

/** Куда PostHog принимает одиночные события. */
const CAPTURE_URL = `${POSTHOG_HOST.replace(/\/$/, "")}/i/v0/e/`;

const AID_KEY = "yeahdays-aid";

/**
 * Обезличенный идентификатор устройства.
 *
 * PostHog отвергает события без distinct_id, а связывать их с почтой или
 * именем мы не хотим: для воронки нужно лишь отличить одного человека от
 * другого. Поэтому — случайный id, живущий в localStorage. Очистка данных
 * браузера обнуляет его, и это правильно: человек перестал быть узнаваемым.
 */
function distinctId(): string {
  try {
    let id = localStorage.getItem(AID_KEY);
    if (!id) {
      id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `a-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
      localStorage.setItem(AID_KEY, id);
    }
    return id;
  } catch {
    // приватный режим может запрещать localStorage — событие всё равно уйдёт
    return "anonymous";
  }
}

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
      api_key: POSTHOG_KEY,
      event,
      distinct_id: distinctId(),
      // $pathname, а не $current_url: полный адрес может содержать query,
      // а нам для воронки достаточно раздела
      properties: { ...props, $pathname: window.location.pathname },
      timestamp: new Date().toISOString(),
    });
    // sendBeacon переживает закрытие вкладки, fetch — запасной путь
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        CAPTURE_URL,
        new Blob([body], { type: "application/json" }),
      );
      return;
    }
    void fetch(CAPTURE_URL, {
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
    console.error("[yeahgrind]", error, context);
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
