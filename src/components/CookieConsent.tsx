"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

const KEY = "yd-cookie-consent";

/**
 * Плашка согласия на cookie.
 *
 * Показывается один раз, помнит выбор в localStorage. Мы используем только
 * технически необходимые cookie (сессия входа) и обезличенную аналитику —
 * поэтому здесь не «настройки трекеров», а честная короткая плашка: вот что
 * есть, вот политика, принять.
 *
 * Появляется с задержкой и снизу — не мешает первому впечатлению и достаётся
 * большим пальцем на телефоне. Тени/блюра нет намеренно: лёгкая и не грузит.
 */
export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let accepted = false;
    try {
      accepted = localStorage.getItem(KEY) === "1";
    } catch {
      accepted = false;
    }
    if (accepted) return;
    const t = window.setTimeout(() => setShow(true), 1200);
    return () => window.clearTimeout(t);
  }, []);

  function accept() {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* приватный режим — просто закроем */
    }
    setShow(false);
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="dialog"
          aria-label="Согласие на использование cookie"
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4"
        >
          <div className="mx-auto flex max-w-2xl flex-col gap-3 rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-4 py-3.5 sm:flex-row sm:items-center sm:gap-4">
            <p className="flex-1 text-[13.5px] leading-snug text-[var(--color-fg-dim)]">
              Мы используем только технически необходимые cookie и обезличенную
              аналитику, чтобы приложение работало и становилось лучше. Реклама
              и слежка — нет.{" "}
              <Link
                href="/privacy"
                className="whitespace-nowrap font-semibold text-[var(--color-fg)] underline underline-offset-4"
              >
                Подробнее
              </Link>
            </p>
            <button
              onClick={accept}
              className="press h-10 shrink-0 rounded-xl bg-[var(--color-fg)] px-5 text-[14.5px] font-bold text-[var(--color-bg)]"
            >
              Принять
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
