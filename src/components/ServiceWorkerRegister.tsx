"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/** Id сборки: подставляется в next.config, меняется на каждый билд. */
const BUILD_ID = process.env.NEXT_PUBLIC_BUILD_ID || "dev";

/**
 * Регистрирует service worker и мягко управляет обновлениями.
 *
 * Как обновляется установленное приложение:
 *  - новый воркер ставится в ожидание (sw.js без skipWaiting);
 *  - если приложение открыто — показываем тост «Обновить»; по нажатию
 *    воркер активируется и страница перезагружается на новую версию;
 *  - если пользователь просто закрыл и переоткрыл приложение — ожидающий
 *    воркер активируется сам, новая версия применяется без действий.
 */
export default function ServiceWorkerRegister() {
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("serviceWorker" in navigator) ||
      process.env.NODE_ENV !== "production"
    ) {
      return;
    }

    let refreshing = false;
    const onControllerChange = () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener(
      "controllerchange",
      onControllerChange,
    );

    let reg: ServiceWorkerRegistration | null = null;
    let interval = 0;

    const register = () => {
      navigator.serviceWorker
        // ?v= меняется с каждой сборкой: браузер видит новый воркер, а тот
        // заводит новый кэш вместо того, чтобы отдавать старый бандл
        .register(`/sw.js?v=${BUILD_ID}`)
        .then((r) => {
          reg = r;
          // обновление уже дождалось нас
          if (r.waiting && navigator.serviceWorker.controller) {
            setWaiting(r.waiting);
          }
          // новое обновление прилетело во время сессии
          r.addEventListener("updatefound", () => {
            const nw = r.installing;
            if (!nw) return;
            nw.addEventListener("statechange", () => {
              if (
                nw.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                setWaiting(nw);
                setDismissed(false);
              }
            });
          });
          // приложение может висеть открытым весь день — проверяем раз в час
          interval = window.setInterval(
            () => r.update().catch(() => {}),
            60 * 60 * 1000,
          );
        })
        .catch(() => {
          /* офлайн-режим необязателен */
        });
    };

    // ВАЖНО: событие `load` часто уже прошло к моменту гидратации React,
    // поэтому нельзя просто вешать слушатель — иначе регистрация не случится
    // на быстрой загрузке. Если документ готов — регистрируем сразу.
    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });

    return () => {
      window.removeEventListener("load", register);
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        onControllerChange,
      );
      if (interval) window.clearInterval(interval);
    };
  }, []);

  function apply() {
    waiting?.postMessage({ type: "SKIP_WAITING" });
    // controllerchange перезагрузит страницу
  }

  const show = !!waiting && !dismissed;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -70, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -70, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed inset-x-0 top-3 z-[70] px-4"
        >
          <div className="safe-b mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 shadow-xl shadow-black/40">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-surface-2)] text-lg">
              ✨
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold">Новая версия готова</p>
              <p className="truncate text-[11.5px] text-[var(--color-muted)]">
                Обнови, чтобы применить
              </p>
            </div>
            <button
              onClick={apply}
              className="h-9 shrink-0 rounded-xl bg-[var(--color-fg)] px-3.5 text-[13px] font-semibold text-[var(--color-bg)]"
            >
              Обновить
            </button>
            <button
              onClick={() => setDismissed(true)}
              aria-label="Позже"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--color-muted)] transition hover:text-[var(--color-fg)]"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
