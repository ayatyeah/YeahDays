/**
 * Вход по паролю — быстрее и без «пришлось перезагрузить страницу».
 *
 * Что было не так.
 *
 * 1. После входа страница делала router.push(). Роутер Next держит в памяти
 *    ответы на недавние переходы и предзагрузки ссылок — в том числе
 *    сделанные ДО входа, когда сервер на любой раздел отвечал «иди на
 *    /login». Переход после входа брал этот ответ из памяти и возвращал
 *    человека на страницу входа, хотя кука уже стояла. Помогала только
 *    перезагрузка. Поэтому после входа — полноценная загрузка страницы:
 *    она идёт на сервер с новой кукой и ничего не знает о старом кэше.
 *
 * 2. signIn() из next-auth делает четыре запроса подряд: список способов
 *    входа, токен защиты от подделки запроса, сам вход и чтение сессии.
 *    До сервера ~0,25 с в одну сторону-обратно, так что три служебных
 *    запроса — это ~0,75 с ожидания на ровном месте. Токен запрашиваем
 *    заранее, пока человек печатает пароль; список способов входа нам не
 *    нужен (форма и так знает, что это вход по паролю); сессию прочитает
 *    уже новая страница. Остаётся один запрос.
 *
 * Запрос ниже — тот же, что отправляет сама библиотека (см. signIn в
 * next-auth/react). Если её ответ когда-нибудь изменится и мы его не
 * поймём, вход уходит в штатный signIn(): медленнее, но надёжно.
 */

import { signIn } from "next-auth/react";

let csrf: Promise<string | null> | null = null;

/** Запросить токен заранее. Вызывается при открытии формы; повторный вызов ничего не стоит. */
export function warmSignIn() {
  csrf ??= fetch("/api/auth/csrf", { cache: "no-store" })
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => (typeof data?.csrfToken === "string" ? data.csrfToken : null))
    .catch(() => null);
  return csrf;
}

/** true — вошли; false — неверный логин или пароль (или вход временно ограничен). */
export async function credentialsSignIn(identifier: string, password: string): Promise<boolean> {
  const token = await warmSignIn();
  if (token) {
    try {
      const res = await fetch("/api/auth/callback/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded", "X-Auth-Return-Redirect": "1" },
        body: new URLSearchParams({ identifier, password, csrfToken: token, callbackUrl: window.location.href }),
      });
      const data = (await res.json()) as { url?: unknown };
      if (res.ok && typeof data.url === "string") {
        return !new URL(data.url, window.location.origin).searchParams.get("error");
      }
    } catch {
      /* ответ не разобрали — пробуем штатным способом ниже */
    }
    // Токен мог устареть (кука истекла, пока форма была открыта) — следующий вызов возьмёт свежий.
    csrf = null;
  }
  const res = await signIn("credentials", { identifier, password, redirect: false });
  return !!res && !res.error;
}

/** Адрес после входа — только путь внутри сайта: чужой адрес в ссылке увёл бы человека на посторонний сайт. */
export function safeCallbackUrl(value: string | null | undefined, fallback = "/app") {
  return value && value.startsWith("/") && !value.startsWith("//") && !value.includes("\\") ? value : fallback;
}

/** Открыть приложение после входа — полной загрузкой, см. пункт 1 выше. */
export function enterApp(url: string) {
  window.location.assign(safeCallbackUrl(url));
}
