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
    return <div className="flex flex-1 flex-col">{children}</div>;
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
