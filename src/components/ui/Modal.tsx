"use client";

import { AnimatePresence, animate, motion, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  /** Кнопка/элемент справа от заголовка — напр. "Изменить" на экране просмотра. */
  headerAction?: React.ReactNode;
  children: React.ReactNode;
}

/** Сколько тянуть вниз, чтобы лист закрылся (px) — либо быстрый рывок. */
const DISMISS_DISTANCE = 96;
const DISMISS_VELOCITY = 0.9; // px/ms
/** Мышь дрожит при клике — до этого сдвига жест не начинаем. */
const MOUSE_SLOP = 4;

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
 *
 * Лист закрывается жестом вниз — пальцем и мышью одинаково. Жест живёт на
 * touch/mouse-событиях, а не на drag framer-motion: внутри листа
 * прокручиваемый контент, и drag отбирал бы у него палец. Направление
 * решаем на первом же движении: вниз при прокрутке в самом верху — тянем
 * лист (и глушим нативный скролл preventDefault: iOS отдаёт жест
 * прокрутке, если первый touchmove не отменён), всё остальное — отдаём
 * прокрутке. За ручку и шапку лист тянется всегда, даже если контент
 * прокручен. Для мыши на время жеста выключаем выделение текста — иначе
 * протяжка выделяла слова вместо того, чтобы тянуть лист.
 */
export default function Modal({ open, onClose, title, headerAction, children }: ModalProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const panelRef = useRef<HTMLDivElement>(null);
  const grabRef = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

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

  /* ── жест вниз: палец и мышь ── */
  useEffect(() => {
    const el = panelRef.current;
    if (!open || !el) return;
    y.set(0);

    let startX = 0;
    let startY = 0;
    let lastY = 0;
    let lastT = 0;
    let velocity = 0;
    let fromGrab = false;
    let mode: "idle" | "undecided" | "drag" | "scroll" = "idle";

    const begin = (x: number, yy: number, target: EventTarget | null, t: number) => {
      startX = x;
      startY = yy;
      lastY = yy;
      lastT = t;
      velocity = 0;
      mode = "undecided";
      fromGrab = !!grabRef.current && grabRef.current.contains(target as Node);
    };

    /** true — жест наш, событие нужно отменить. */
    const move = (x: number, yy: number, t: number, slop: number): boolean => {
      if (mode === "idle") return false;
      const dy = yy - startY;
      const dx = x - startX;
      if (mode === "undecided") {
        if (Math.abs(dy) < slop && Math.abs(dx) < slop) return false;
        const downward = dy > 0 && Math.abs(dy) >= Math.abs(dx);
        mode = downward && (fromGrab || el.scrollTop <= 0) ? "drag" : "scroll";
      }
      if (mode !== "drag") return false;
      const dt = Math.max(1, t - lastT);
      velocity = (yy - lastY) / dt;
      lastY = yy;
      lastT = t;
      // вверх — не пускаем: лист и так на месте, тянуть выше некуда
      y.set(Math.max(0, dy));
      return true;
    };

    const end = () => {
      const wasDrag = mode === "drag";
      mode = "idle";
      if (!wasDrag) return;
      // порог — либо треть высоты листа, либо быстрый рывок
      const limit = Math.min(DISMISS_DISTANCE, el.offsetHeight / 3);
      if (y.get() > limit || velocity > DISMISS_VELOCITY) {
        onCloseRef.current();
      } else {
        animate(y, 0, { type: "spring", stiffness: 520, damping: 40 });
      }
    };

    /* палец */
    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      begin(t.clientX, t.clientY, e.target, e.timeStamp);
    };
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      // решаем на первом же движении — см. комментарий к компоненту
      if (move(t.clientX, t.clientY, e.timeStamp, 0)) e.preventDefault();
    };
    const onTouchEnd = () => end();

    /* мышь */
    let mouseDown = false;
    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      mouseDown = true;
      begin(e.clientX, e.clientY, e.target, e.timeStamp);
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!mouseDown) return;
      if (move(e.clientX, e.clientY, e.timeStamp, MOUSE_SLOP)) {
        e.preventDefault();
        el.style.userSelect = "none";
        el.style.cursor = "grabbing";
      }
    };
    const onMouseUp = () => {
      if (!mouseDown) return;
      mouseDown = false;
      el.style.userSelect = "";
      el.style.cursor = "";
      end();
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    el.addEventListener("touchcancel", onTouchEnd);
    el.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
      el.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [open, y]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <motion.div
            className="absolute inset-0 bg-black/78"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            className="relative z-10 max-h-[85dvh] w-full max-w-md overflow-y-auto overscroll-contain rounded-t-[14px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 pb-8 shadow-2xl sm:rounded-3xl safe-b"
            style={{ y }}
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
          >
            {/* Зона захвата: ручка + шапка. Отрицательные поля возвращают
                отступ листа, чтобы тянуть можно было и за пустое место
                рядом с ручкой, а не только за саму полоску в 40px. */}
            <div ref={grabRef} className="-mx-5 -mt-5 cursor-grab px-5 pt-5">
              <div className="mx-auto mb-3 h-[5px] w-9 rounded-full bg-[var(--color-border-strong)]" />
              {(title || headerAction) && (
                <div className="mb-4 flex items-center gap-3">
                  {title && (
                    <h2 className="text-[20px] font-semibold tracking-tight">{title}</h2>
                  )}
                  {/* ml-auto, а не justify-between на родителе — иначе при
                      отсутствующем title единственный ребёнок (headerAction)
                      уезжал к левому краю: justify-between нечего распределять
                      между одним элементом. */}
                  {headerAction && <div className="ml-auto">{headerAction}</div>}
                </div>
              )}
            </div>
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
