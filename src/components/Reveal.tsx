"use client";

import { motion } from "framer-motion";
import { springSoft } from "@/lib/motion";

/**
 * Появление блока при попадании в экран.
 *
 * На длинном лендинге это не украшательство, а навигация: движение
 * подсказывает, что начался новый смысловой блок, и глаз сам находит,
 * куда смотреть. Всё разом появившееся читается как стена текста.
 *
 * `once` обязателен — иначе блоки мигают при каждом проходе мимо, и
 * страница начинает раздражать вместо того, чтобы вести.
 */
export default function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ ...springSoft, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Каскад для сеток: дети появляются друг за другом. */
export function RevealGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.08 } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: springSoft },
      }}
    >
      {children}
    </motion.div>
  );
}
