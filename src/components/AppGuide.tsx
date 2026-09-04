"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { spring } from "@/lib/motion";
import { useUserStore } from "@/store/useUserStore";
import { TABS, TAB_LABEL } from "@/lib/nav";

const TAB_ICON: Record<(typeof TABS)[number], string> = {
  home: "🃏",
  today: "☀️",
  calendar: "🗓️",
  progress: "📈",
  account: "👤",
};

const TAB_TEXT: Record<(typeof TABS)[number], string> = {
  home: "Колода твоих собственных действий — свайпай вправо «беру», влево «мимо».",
  today: "Всё, что запланировано на сегодня: задачи и то, что взял из колоды.",
  calendar: "Почасовой план дня и то, как идёт месяц целиком.",
  progress: "Уровень, статы и стрик — куда движется прогресс.",
  account: "Аккаунт, синхронизация между устройствами, управление действиями.",
};

/**
 * Разовый гайд «как это устроено» — показываем сразу после онбординга, тем,
 * кто ещё не видел разделы приложения. Визуальный язык взят из WhatsNew.tsx
 * (та же шторка снизу), но это отдельный, более простой показ: не список
 * фич, а карта самих пяти разделов.
 *
 * Существующим аккаунтам с реальным прогрессом флаг seenGuide бэкфилится
 * в true при миграции/гидратации (см. useUserStore.ts) — их этим не грузим.
 */
export default function AppGuide() {
  const onboarded = useUserStore((s) => s.onboarded);
  const seenGuide = useUserStore((s) => s.seenGuide);
  const completeGuide = useUserStore((s) => s.completeGuide);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!onboarded || seenGuide) return;
    const t = setTimeout(() => setOpen(true), 600);
    return () => clearTimeout(t);
  }, [onboarded, seenGuide]);

  const close = () => {
    completeGuide();
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={spring}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={(_, i) => {
              if (i.offset.y > 110 || i.velocity.y > 600) close();
            }}
            className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-md"
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Как это устроено"
              className="marble safe-b max-h-[85dvh] overflow-y-auto rounded-t-[28px] px-5 pb-6 pt-3"
            >
              <div
                className="mx-auto mb-5 h-1 w-10 rounded-full bg-[var(--color-border-strong)]"
                aria-hidden
              />

              <p className="text-[12px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                Коротко
              </p>
              <h2 className="mt-1.5 text-[23px] font-bold leading-tight">
                Как это устроено
              </h2>

              <ul className="mt-5 flex flex-col gap-3">
                {TABS.map((tab, i) => (
                  <motion.li
                    key={tab}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...spring, delay: 0.05 + i * 0.05 }}
                    className="surface flex gap-3.5 rounded-2xl p-3.5"
                  >
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-surface-2)] text-[16px]"
                      aria-hidden
                    >
                      {TAB_ICON[tab]}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[14.5px] font-semibold">{TAB_LABEL[tab]}</p>
                      <p className="mt-1 text-[13.5px] leading-snug text-[var(--color-fg-dim)]">
                        {TAB_TEXT[tab]}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </ul>

              <button
                onClick={close}
                className="press mt-5 h-12 w-full rounded-2xl bg-[var(--color-fg)] text-[14px] font-bold text-[var(--color-bg)] shadow-[var(--shadow-2)]"
              >
                Понятно
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
