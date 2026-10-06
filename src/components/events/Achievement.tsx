"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { loadPref, savePref } from "@/lib/events/storage";
import type { StudyEvent } from "@/lib/events/types";

/**
 * Ачивка за пройденный ивент: все шаги маршрута пройдены, итоговый квиз —
 * не ниже 80%. Показывается на карте ивента, пока условие выполняется
 * (лучший результат не падает, так что навсегда). Дата получения
 * запоминается на устройстве при первом показе; в первый раз карточка
 * появляется с анимацией, потом — спокойно.
 */
export default function Achievement({ event, userId }: { event: StudyEvent; userId: string }) {
  const key = `achievement:${userId}:${event.id}`;
  const [earned, setEarned] = useState<string | null>(null);
  const [fresh, setFresh] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    const saved = loadPref(key, "");
    if (saved) { setEarned(saved); return; }
    const now = new Date().toISOString();
    savePref(key, now);
    setEarned(now);
    setFresh(true);
  }, [key]);

  async function share() {
    const text = `Прошёл(а) «${event.title}» по курсу ${event.course} в YeahGrind — все квизы закрыты, итоговый на 80%+. 🏆`;
    try {
      if (navigator.share) await navigator.share({ text, url: `${location.origin}/events/${event.id}` });
      else { await navigator.clipboard.writeText(`${text} ${location.origin}/events/${event.id}`); setNote("Текст скопирован."); }
    } catch { /* закрыли окно — не ошибка */ }
  }

  if (!earned) return null;
  const date = new Date(earned).toLocaleDateString("ru-RU", { day: "numeric", month: "long" });

  return (
    <motion.section
      initial={fresh ? { scale: 0.8, opacity: 0, rotate: -3 } : false}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className="mt-4 overflow-hidden rounded-2xl border border-amber-400/50 bg-gradient-to-br from-amber-500/25 via-[var(--color-bg)] to-rose-500/15 p-4"
      role="status"
    >
      <div className="flex items-center gap-4">
        <motion.span aria-hidden className="text-5xl" animate={fresh ? { rotate: [0, -12, 12, -8, 8, 0], scale: [1, 1.2, 1] } : {}} transition={{ duration: 1.2, delay: 0.3 }}>🏆</motion.span>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-300">{fresh ? "Новая ачивка" : "Ачивка"}</p>
          <p className="text-lg font-bold leading-tight">Ивент пройден</p>
          <p className="text-sm text-[var(--color-fg-dim)]">Все шаги закрыты, итоговый квиз — 80% и выше. Получена {date}.</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button size="sm" onClick={() => void share()}>Поделиться</Button>
        {note && <span className="text-xs text-[var(--color-fg-dim)]">{note}</span>}
      </div>
    </motion.section>
  );
}
