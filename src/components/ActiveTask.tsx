"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { PlannedTask } from "@/store/useUserStore";
import { CATEGORIES, DIFFICULTY_LABEL, STATS } from "@/lib/domain";
import { springBouncy } from "@/lib/motion";

/** мс → «7 мин 12 с» */
export function formatDuration(ms: number): string {
  const total = Math.max(0, Math.round(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return `${h} ч ${m} мин`;
  if (m > 0) return `${m} мин ${String(s).padStart(2, "0")} с`;
  return `${s} с`;
}

/**
 * Текущее действие — вместо колоды.
 *
 * Правило продукта: взял — сделай. Пока это действие не закрыто, новые
 * свайпы недоступны. Так план не превращается в список из десяти
 * «когда-нибудь», а внимание держится на одном деле.
 *
 * Таймер идёт с момента, когда действие взято: он и мотивирует не тянуть,
 * и даёт честные данные о том, сколько на самом деле занимают дела.
 */
export default function ActiveTask({
  task,
  onDone,
}: {
  task: PlannedTask;
  onDone: () => void;
}) {
  const [elapsed, setElapsed] = useState(() => Date.now() - task.acceptedAt);

  useEffect(() => {
    setElapsed(Date.now() - task.acceptedAt);
    const id = setInterval(() => setElapsed(Date.now() - task.acceptedAt), 1000);
    return () => clearInterval(id);
  }, [task.acceptedAt]);

  const cat = CATEGORIES[task.snapshot.category];
  const accent = STATS[cat.stat].hex;
  // насколько уложился в заявленную длительность
  const planned = task.snapshot.duration * 60_000;
  const over = planned > 0 && elapsed > planned;

  return (
    <motion.section
      // «вырастает» на месте колоды: взгляд следует снизу вверх, будто
      // карточка перетекла в задачу. Перелёт пружины читается как «схватил».
      initial={{ opacity: 0, y: 28, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1, transition: springBouncy }}
      exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.16 } }}
      className="flex flex-1 flex-col justify-center"
    >
      <div className="press relative overflow-hidden rounded-3xl surface p-5">
        {/* Акцент категории — тот же цвет, что был на карточке: связывает
            задачу с действием, из которого она выросла. */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-24 opacity-[0.14]"
          style={{
            background: `radial-gradient(120% 100% at 50% 0%, ${accent} 0%, transparent 70%)`,
          }}
        />
        <div className="flex items-center gap-2">
          <span className="text-[15px]" aria-hidden>
            {cat.icon}
          </span>
          <span className="text-[11.5px] font-medium text-[var(--color-muted)]">
            {cat.label} · {DIFFICULTY_LABEL[task.snapshot.difficulty]} ·{" "}
            {task.snapshot.duration} мин
          </span>
        </div>

        <h2 className="mt-3 text-[22px] font-bold leading-tight tracking-tight">
          {task.snapshot.title}
        </h2>
        <p className="mt-2 text-[13px] leading-snug text-[var(--color-fg-dim)]">
          {task.snapshot.why}
        </p>

        {/* Таймер */}
        <div className="mt-5 flex items-baseline gap-2">
          <span
            className="text-[34px] font-bold tabular-nums leading-none"
            style={{ color: over ? "var(--color-strength)" : undefined }}
          >
            {formatDuration(elapsed)}
          </span>
          <span className="text-[11.5px] text-[var(--color-muted)]">
            {over ? "дольше плана" : "идёт"}
          </span>
        </div>

        <button
          onClick={onDone}
          className="mt-5 h-12 w-full rounded-2xl bg-[var(--color-fg)] text-[15px] font-semibold text-[var(--color-bg)] transition active:scale-[0.99]"
        >
          Сделал · +{task.xp} XP
        </button>
      </div>

      <p className="mt-4 text-center text-[11.5px] leading-snug text-[var(--color-muted)]">
        Пока это действие не закрыто, новых карточек не будет.
        <br />
        Взял — сделай.
      </p>
    </motion.section>
  );
}
