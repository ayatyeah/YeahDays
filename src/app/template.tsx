"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { tabFromPath } from "@/lib/nav";

/**
 * Плавное появление контента при переходе между страницами.
 *
 * Разделы приложения из этого исключены: они живут в одной оболочке и
 * анимируют переход сами. Если обернуть и их, на каждое переключение
 * вкладки накладывались бы два движения подряд — это читается как лаг.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (tabFromPath(pathname)) {
    // min-h-0 обязателен: без него у этой обёртки min-height остаётся
    // "auto" (дефолт flex-элемента) и она растягивается под полную высоту
    // контента раздела вместо того, чтобы сжаться внутри .app-shell-frame
    // (globals.css) — тогда .section-pane внутри никогда не переполняется
    // и не скроллится сам, а всё, что не влезло, просто обрезается рамкой
    // (overflow: hidden) и становится недостижимым свайпом вниз.
    return <div className="flex min-h-0 flex-1 flex-col">{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-1 flex-col"
    >
      {children}
    </motion.div>
  );
}
