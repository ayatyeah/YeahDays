"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { YgIcon } from "@/components/yg-icons";
import { decideUpdate } from "@/lib/swUpdate";

/** Id сборки: подставляется в next.config, меняется на каждый билд. */
const BUILD_ID = process.env.NEXT_PUBLIC_BUILD_ID || "dev";

/**
 * Регистрирует service worker и мягко управляет обновлениями.
 *
 * Как обновляется установленное приложение (решает lib/swUpdate.ts):
 *  - новый воркер ставится в ожидание (sw.js без skipWaiting);
 *  - та же сборка — ничего не показываем;
 *  - новая сборка ждала к запуску, а человек ещё ничего не нажал — тихо
 *    применяем: перезагрузка на старте незаметна;
 *  - новая сборка пришла посреди работы — тост «Обновить»; по нажатию
 *    воркер активируется и страница перезагружается на новую версию.
 */
export default function ServiceWorkerRegister() {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname.startsWith("/login/") || pathname === "/register";
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      isAuthPage ||
      !("serviceWorker" in navigator) ||
      process.env.NODE_ENV !== "production"
    ) {
      return;
    }

    let refreshing = false;
    let hadController = !!navigator.serviceWorker.controller;
    const onControllerChange = () => {
      // First installation only takes control; reloading can abort an in-flight login.
      if (!hadController) { hadController = true; return; }
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
    let disposed = false;

    // «Свежий запуск»: первые секунды после загрузки, пока человек ничего не
    // нажал и не начал печатать, — перезагрузка в этот момент ничего не сбивает.
    const loadedAt = Date.now();
    let touched = false;
    const touch = () => { touched = true; };
    window.addEventListener("pointerdown", touch, { capture: true, once: true });
    window.addEventListener("keydown", touch, { capture: true, once: true });
    const consider = (r: ServiceWorkerRegistration, next: ServiceWorker) => {
      const action = decideUpdate({ active: r.active?.scriptURL, waiting: next.scriptURL, fresh: !touched && Date.now() - loadedAt < 4000 });
      // controllerchange ниже перезагрузит страницу уже на новой версии
      if (action === "apply") next.postMessage({ type: "SKIP_WAITING" });
      else if (action === "announce") {
        setWaiting(next);
        setDismissed(false);
      }
    };
    const checkWhenVisible = () => {
      if (document.visibilityState === "visible") reg?.update().catch(() => {});
    };

    const register = () => {
      navigator.serviceWorker
        // ?v= меняется с каждой сборкой: браузер видит новый воркер, а тот
        // заводит новый кэш вместо того, чтобы отдавать старый бандл
        .register(`/sw.js?v=${BUILD_ID}`)
        .then((r) => {
          if (disposed) return;
          reg = r;
          // обновление уже дождалось нас
          if (r.waiting && navigator.serviceWorker.controller) consider(r, r.waiting);
          // новое обновление прилетело во время сессии
          r.addEventListener("updatefound", () => {
            const nw = r.installing;
            if (!nw) return;
            nw.addEventListener("statechange", () => {
              if (nw.state === "installed" && navigator.serviceWorker.controller) consider(r, nw);
            });
          });
          // приложение может висеть открытым весь день — проверяем раз в час
          interval = window.setInterval(
            () => r.update().catch(() => {}),
            60 * 60 * 1000,
          );
          // и при каждом возврате в приложение: PWA на телефоне живёт в
          // фоне сутками, и «раз в час» без этого почти никогда не наступал
          document.addEventListener("visibilitychange", checkWhenVisible);
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
      disposed = true;
      document.removeEventListener("visibilitychange", checkWhenVisible);
      window.removeEventListener("pointerdown", touch, true);
      window.removeEventListener("keydown", touch, true);
      window.removeEventListener("load", register);
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        onControllerChange,
      );
      if (interval) window.clearInterval(interval);
    };
  }, [isAuthPage]);

  // Раздел приложения открыт — значит человек вошёл: просим воркер доложить
  // в кэш оболочку разделов, которую он не мог взять до входа (см. sw.js).
  const inApp = !isAuthPage && !["/", "/terms", "/privacy", "/forgot-password", "/offline"].includes(pathname) && !pathname.startsWith("/invite/");
  useEffect(() => {
    if (!inApp || !("serviceWorker" in navigator) || process.env.NODE_ENV !== "production") return;
    navigator.serviceWorker.ready.then((r) => r.active?.postMessage({ type: "PRECACHE" })).catch(() => {});
  }, [inApp]);

  function apply() {
    waiting?.postMessage({ type: "SKIP_WAITING" });
    // controllerchange перезагрузит страницу
  }

  const show = !isAuthPage && !!waiting && !dismissed;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -70, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -70, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed inset-x-0 top-[max(0.75rem,env(safe-area-inset-top))] z-[70] px-4"
        >
          <div className="marble mx-auto flex max-w-md items-center gap-3 rounded-2xl p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-surface-2)] text-[20px]">
              <YgIcon name="sparkle" className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold">Новая версия готова</p>
              <p className="truncate text-[13px] text-[var(--color-muted)]">
                Обнови, чтобы применить
              </p>
            </div>
            <button
              onClick={apply}
              className="press h-9 shrink-0 rounded-xl bg-[var(--color-fg)] px-3.5 text-[15px] font-semibold text-[var(--color-bg)]"
            >
              Обновить
            </button>
            <button
              onClick={() => setDismissed(true)}
              aria-label="Позже"
              className="tap press flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--color-muted)] hover:text-[var(--color-fg)]"
            >
              <YgIcon name="close" className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
