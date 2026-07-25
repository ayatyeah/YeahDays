"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useUserStore, useHydrated } from "@/store/useUserStore";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "yd-install-dismissed";

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

/**
 * Ненавязчивое предложение установить PWA. Показывается один раз после
 * онбординга, помнит отказ, прячется в установленном приложении.
 * Для iOS (нет beforeinstallprompt) — короткая подсказка «Поделиться → на экран».
 */
export default function InstallPrompt() {
  const hydrated = useHydrated();
  const onboarded = useUserStore((s) => s.onboarded);

  const [evt, setEvt] = useState<BeforeInstallPromptEvent | null>(null);
  const [ios, setIos] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;
    try {
      if (localStorage.getItem(DISMISS_KEY)) return;
    } catch {
      return;
    }

    const onBip = (e: Event) => {
      e.preventDefault();
      setEvt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onBip);

    // iOS Safari не шлёт beforeinstallprompt — определяем вручную.
    const ua = window.navigator.userAgent;
    const isIOS = /iphone|ipad|ipod/i.test(ua) && /safari/i.test(ua);
    if (isIOS) setIos(true);

    return () => window.removeEventListener("beforeinstallprompt", onBip);
  }, []);

  // Показываем с задержкой и только после онбординга — не в первую секунду.
  useEffect(() => {
    if (!hydrated || !onboarded || (!evt && !ios)) return;
    const t = window.setTimeout(() => setShow(true), 2500);
    return () => window.clearTimeout(t);
  }, [hydrated, onboarded, evt, ios]);

  // Пока баннер висит, резервируем под него место внизу: он fixed и иначе
  // накрывает нижние кнопки экрана (на колоде — сам свайп «беру/не сейчас»).
  // Через CSS-переменную, чтобы отступ добавлял общий каркас, а не каждый
  // экран по отдельности. Компонент один, поэтому конфликтов за переменную нет.
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--install-offset", show ? "76px" : "0px");
    return () => root.style.setProperty("--install-offset", "0px");
  }, [show]);

  function dismiss() {
    setShow(false);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
  }

  async function install() {
    if (!evt) return;
    await evt.prompt();
    await evt.userChoice;
    dismiss();
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed inset-x-0 bottom-[86px] z-40 px-4"
        >
          <div className="marble mx-auto flex max-w-md items-center gap-3 rounded-2xl p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-surface-2)] text-xl">
              📲
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold">Установи YeahDays</p>
              <p className="truncate text-[11.5px] text-[var(--color-muted)]">
                {ios && !evt
                  ? "Поделиться → «На экран «Домой»"
                  : "Запускай как приложение, работает офлайн"}
              </p>
            </div>
            {evt ? (
              <button
                onClick={install}
                className="press h-9 shrink-0 rounded-xl bg-[var(--color-fg)] px-3.5 text-[13px] font-semibold text-[var(--color-bg)]"
              >
                Установить
              </button>
            ) : null}
            <button
              onClick={dismiss}
              aria-label="Закрыть"
              className="press flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--color-muted)] hover:text-[var(--color-fg)]"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
