"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { spring } from "@/lib/motion";
import { unseenFeatures, type Feature } from "@/lib/features";
import { useUserStore } from "@/store/useUserStore";

/**
 * «Что нового» для тех, кто завёл аккаунт раньше.
 *
 * Показываем один раз и только человеку, который уже прошёл онбординг:
 * новичок эти разделы видел минуту назад, ему это шум.
 *
 * Шторка снизу, а не модалка по центру: до низа экрана дотягивается
 * большой палец, и жест закрытия совпадает с системным.
 *
 * Отмечаем показанным при закрытии, а не при открытии — если человек
 * закроет приложение на середине списка, в следующий раз он увидит
 * его снова, а не потеряет насовсем.
 */
export default function WhatsNew() {
  const onboarded = useUserStore((s) => s.onboarded);
  const seenGuide = useUserStore((s) => s.seenGuide);
  const seen = useUserStore((s) => s.seenFeatures);
  const markSeen = useUserStore((s) => s.markFeaturesSeen);

  const [items, setItems] = useState<Feature[] | null>(null);

  useEffect(() => {
    // ждём гидратации persist: на первом рендере seen ещё пустой,
    // и без задержки шторка мигнула бы даже новичку
    // seenGuide тоже ждём — AppGuide.tsx показывается первым, две шторки
    // снизу разом выглядели бы сломанно
    if (!onboarded || !seenGuide) return;
    const unseen = unseenFeatures(seen);
    if (unseen.length === 0) return;
    const t = setTimeout(() => setItems(unseen), 600);
    return () => clearTimeout(t);
  }, [onboarded, seen]);

  const close = () => {
    if (items) markSeen(items.map((f) => f.id));
    setItems(null);
  };

  return (
    <AnimatePresence>
      {items && items.length > 0 && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
          {/*
            Два элемента вместо одного намеренно. `.marble` объявлен вне
            слоёв Tailwind и задаёт position: relative (на нём держится
            псевдоэлемент с прожилками). Незалоенный CSS сильнее утилит из
            @layer utilities, поэтому «marble fixed» молча даёт relative —
            шторка уезжает под экран. Позиционируем снаружи, оформляем внутри.
          */}
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
              aria-label="Что нового"
              className="marble safe-b max-h-[85dvh] overflow-y-auto rounded-t-[28px] px-5 pb-6 pt-3"
            >
              <div
                className="mx-auto mb-5 h-1 w-10 rounded-full bg-[var(--color-border-strong)]"
                aria-hidden
              />

              <p className="text-[12px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                Пока тебя не было
              </p>
              <h2 className="mt-1.5 text-[23px] font-bold leading-tight">
                В приложении появилось новое
              </h2>

              <ul className="mt-5 flex flex-col gap-3">
                {items.map((f, i) => (
                  <motion.li
                    key={f.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...spring, delay: 0.05 + i * 0.05 }}
                    className="surface flex gap-3.5 rounded-2xl p-3.5"
                  >
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-surface-2)] text-[16px]"
                      aria-hidden
                    >
                      {f.icon}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[14.5px] font-semibold">{f.title}</p>
                      <p className="mt-1 text-[13.5px] leading-snug text-[var(--color-fg-dim)]">
                        {f.text}
                      </p>
                      {f.href && (
                        <Link
                          href={f.href}
                          onClick={close}
                          className="mt-2 inline-block text-[13px] font-semibold text-[var(--color-stability)] underline underline-offset-4"
                        >
                          Открыть
                        </Link>
                      )}
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
