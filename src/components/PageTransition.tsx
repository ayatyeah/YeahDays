"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { springSoft } from "@/lib/motion";

/**
 * Переход между разделами приложения.
 *
 * Раньше был простой fade — экран моргал, направление движения не читалось.
 * Теперь переход НАПРАВЛЕННЫЙ: идёшь по нижней навигации вправо (Главная →
 * Профиль) — новый экран въезжает справа; идёшь влево — слева. Мозг читает
 * это как перемещение в пространстве, а не подмену контента, и приложение
 * начинает ощущаться цельным.
 *
 * mode="popLayout" вынимает уходящий экран из потока сразу, поэтому новый не
 * ждёт конца его анимации. min-height держит каркас, пока новый монтируется,
 * — без него футер и навбар подпрыгивают на кадр.
 *
 * Порядок совпадает с BottomNav — это и есть «карта» приложения слева направо.
 */
const ORDER: Record<string, number> = {
  "/app": 0,
  "/today": 1,
  "/calendar": 2,
  "/progress": 3,
  "/account": 4,
};

function indexOf(path: string): number {
  return ORDER[path] ?? 0;
}

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const prevRef = useRef(pathname);

  // направление: +1 — вперёд (вправо по навбару), -1 — назад.
  // ref читаем в рендере, но ОБНОВЛЯЕМ в эффекте (не в теле рендера): иначе
  // двойной проход StrictMode/сброшенный concurrent-рендер посчитал бы
  // направление неверно.
  const dir = indexOf(pathname) >= indexOf(prevRef.current) ? 1 : -1;
  useEffect(() => {
    prevRef.current = pathname;
  }, [pathname]);

  return (
    <AnimatePresence mode="popLayout" initial={false} custom={dir}>
      <motion.div
        key={pathname}
        custom={dir}
        // въезд со стороны движения, выезд — в противоположную; лёгкий
        // масштаб добавляет глубины, будто экраны лежат стопкой
        initial={{ opacity: 0, x: dir * 40, scale: 0.98 }}
        animate={{ opacity: 1, x: 0, scale: 1, transition: springSoft }}
        exit={{
          opacity: 0,
          x: dir * -32,
          scale: 0.98,
          transition: { duration: 0.16, ease: [0.4, 0, 1, 1] },
        }}
        // свой слой: переход идёт на GPU и не перерисовывает страницу под ним
        className="gpu-layer flex min-h-[60vh] flex-1 flex-col"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
