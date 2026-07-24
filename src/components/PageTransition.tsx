"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Переход между разделами приложения.
 *
 * Раньше содержимое просто подменялось: экран моргал, а из-за разной
 * высоты разделов страница ещё и прыгала — казалось, что «раздел меняется
 * по размерам».
 *
 * Что здесь важно:
 *
 * — `mode="popLayout"` вместо ожидания: уходящий экран вынимается из
 *   потока сразу, поэтому новый не ждёт конца его анимации и переход
 *   не ощущается медленным;
 * — уходящий экран анимируется ТОЛЬКО прозрачностью, без сдвига высоты,
 *   иначе схлопывание контента дёргает скролл;
 * — короткая длительность: переход должен подсказать смену контекста,
 *   а не показывать себя. Всё, что дольше ~0.2с, читается как тормоза;
 * — min-height держит каркас, пока новый экран монтируется, — без него
 *   футер и навбар подпрыгивают на кадр.
 */
export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.18,
          ease: [0.22, 1, 0.36, 1],
        }}
        // свой слой: переход идёт на GPU и не перерисовывает страницу под ним
        className="gpu-layer flex min-h-[60vh] flex-1 flex-col"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
