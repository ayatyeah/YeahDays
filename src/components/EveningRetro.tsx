"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserStore, useHydrated, selectToday } from "@/store/useUserStore";
import { dateKey } from "@/lib/domain";
import { cn } from "@/lib/cn";

const SCORES = [
  { v: 1, icon: "😞", label: "Тяжко" },
  { v: 2, icon: "😕", label: "Так себе" },
  { v: 3, icon: "😐", label: "Норм" },
  { v: 4, icon: "🙂", label: "Хорошо" },
  { v: 5, icon: "🔥", label: "Отлично" },
];

/** С какого часа предлагаем подвести итоги. */
const RETRO_HOUR = 20;

/**
 * Итог дня.
 *
 * Показываем вечером и только тем, у кого сегодня что-то происходило —
 * спрашивать «как день?» у человека, который не заходил, бессмысленно.
 * Ответ сохраняется в стор: это и личная история, и сигнал о том, какие
 * дни ощущаются хорошими.
 */
export default function EveningRetro() {
  const hydrated = useHydrated();
  const plan = useUserStore((s) => s.plan);
  const retros = useUserStore((s) => s.retros);
  const setRetro = useUserStore((s) => s.setRetro);

  const [dismissed, setDismissed] = useState(false);
  const [saved, setSaved] = useState(false);

  const today = dateKey();
  const todays = useMemo(() => selectToday(plan, today), [plan, today]);
  const doneToday = todays.filter((t) => t.completed).length;

  const isEvening = new Date().getHours() >= RETRO_HOUR;
  const alreadyAnswered = Boolean(retros[today]);
  const hadActivity = todays.length > 0;

  const show =
    hydrated && isEvening && hadActivity && !alreadyAnswered && !dismissed;

  return (
    <AnimatePresence>
      {show && (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
        >
          {saved ? (
            <p className="py-2 text-center text-[13px] font-medium">
              Записал. До завтра 👋
            </p>
          ) : (
            <>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold">Как прошёл день?</p>
                  <p className="mt-1 text-[11.5px] leading-snug text-[var(--color-muted)]">
                    {doneToday > 0
                      ? `Закрыто сегодня: ${doneToday}. Одно касание — и день записан.`
                      : "Даже если ничего не вышло — отметить честно полезнее, чем пропустить."}
                  </p>
                </div>
                <button
                  onClick={() => setDismissed(true)}
                  aria-label="Закрыть"
                  className="shrink-0 rounded-lg px-2 py-1 text-[12px] text-[var(--color-muted)]"
                >
                  ✕
                </button>
              </div>

              <div className="mt-3 grid grid-cols-5 gap-2">
                {SCORES.map((s) => (
                  <button
                    key={s.v}
                    onClick={() => {
                      setRetro(today, { score: s.v });
                      setSaved(true);
                    }}
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-2xl border border-[var(--color-border)]",
                      "bg-[var(--color-surface-2)] py-2.5 transition active:scale-95",
                      "hover:border-[var(--color-fg-dim)]",
                    )}
                  >
                    <span className="text-lg" aria-hidden>
                      {s.icon}
                    </span>
                    <span className="text-[10px] text-[var(--color-muted)]">
                      {s.label}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </motion.section>
      )}
    </AnimatePresence>
  );
}
