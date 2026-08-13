"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

/**
 * Модальное окно.
 *
 * Рендерится ПОРТАЛОМ в body, а не на месте вызова. Это принципиально:
 * контент страницы завёрнут в .gpu-layer (translateZ(0)) ради плавных
 * переходов, а `transform`-предок превращает `position: fixed` внутри себя
 * в относительный. Без портала модалка на длинной странице (например,
 * «Профиль») уезжала вниз за пределы экрана вместо центра. Портал выносит
 * её из-под трансформа — и fixed снова считается от вьюпорта.
 *
 * На мобильном — лист снизу (items-end, под большой палец), на десктопе —
 * по центру.
 */
export default function Modal({ open, onClose, title, children }: ModalProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    // пока лист открыт, свайп между разделами выключен: иначе жест внутри
    // модалки уводил бы экран из-под неё
    document.body.dataset.modalOpen = "1";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      delete document.body.dataset.modalOpen;
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="relative z-10 max-h-[85dvh] w-full max-w-md overflow-y-auto rounded-t-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 pb-8 shadow-2xl sm:rounded-3xl safe-b"
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[var(--color-border)] sm:hidden" />
            {title && (
              <h2 className="mb-4 text-lg font-semibold tracking-tight">
                {title}
              </h2>
            )}
            {children}
            {/* Хром игнорирует padding-bottom на конце скролл-контейнера —
                известная особенность. pb-8 выше ничего не даёт на длинном
                контенте, реальный отступ снизу даёт только этот спейсер. */}
            <div aria-hidden className="h-6" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
