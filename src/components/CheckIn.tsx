"use client";

import { motion } from "framer-motion";
import { ENERGY_LABEL, type DailyMood, type EnergyLevel } from "@/lib/domain";
import { cn } from "@/lib/cn";

/**
 * Ежедневный чек-ин.
 *
 * Это не «настройки» — это вход в продукт. Два вопроса за 3 секунды,
 * которые превращают generic-список в подборку под текущее состояние.
 * Без них персонализация была бы фикцией.
 */

const ENERGY_OPTIONS: { key: EnergyLevel; icon: string; hint: string }[] = [
  { key: "low", icon: "🌙", hint: "Выжат" },
  { key: "medium", icon: "☁️", hint: "Норма" },
  { key: "high", icon: "⚡", hint: "Заряжен" },
];

const MINUTES = [10, 20, 30, 60];

interface CheckInProps {
  mood: DailyMood;
  onChange: (m: Partial<DailyMood>) => void;
  onDone: () => void;
  name: string;
}

export default function CheckIn({ mood, onChange, onDone, name }: CheckInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-1 flex-col justify-center"
    >
      <div className="mb-8">
        <p className="text-sm font-medium text-[var(--color-muted)]">
          Привет, {name}
        </p>
        <h1 className="mt-1.5 text-[30px] font-bold leading-tight tracking-tight">
          Как ты сегодня?
        </h1>
        <p className="mt-2 text-[15px] leading-snug text-[var(--color-fg-dim)]">
          Два ответа — и я подберу действия под твоё состояние,
          а не абстрактный список.
        </p>
      </div>

      {/* Энергия */}
      <section className="mb-7">
        <p className="mb-3 text-[13px] font-semibold text-[var(--color-fg-dim)]">
          Сколько сил?
        </p>
        <div className="grid grid-cols-3 gap-2.5">
          {ENERGY_OPTIONS.map((o) => {
            const active = mood.energy === o.key;
            return (
              <motion.button
                key={o.key}
                whileTap={{ scale: 0.95 }}
                onClick={() => onChange({ energy: o.key })}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-3xl border-2 py-5 transition",
                  active
                    ? "border-[var(--color-fg)] bg-[var(--color-surface-2)]"
                    : "border-transparent bg-[var(--color-surface)] hover:bg-[var(--color-surface-2)]",
                )}
              >
                <span className="text-2xl">{o.icon}</span>
                <span
                  className={cn(
                    "text-[12px] font-semibold",
                    active
                      ? "text-[var(--color-fg)]"
                      : "text-[var(--color-muted)]",
                  )}
                >
                  {ENERGY_LABEL[o.key]}
                </span>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* Время */}
      <section className="mb-9">
        <p className="mb-3 text-[13px] font-semibold text-[var(--color-fg-dim)]">
          Сколько минут готов вложить?
        </p>
        <div className="grid grid-cols-4 gap-2.5">
          {MINUTES.map((m) => {
            const active = mood.minutes === m;
            return (
              <motion.button
                key={m}
                whileTap={{ scale: 0.95 }}
                onClick={() => onChange({ minutes: m })}
                className={cn(
                  "rounded-2xl border-2 py-3.5 text-center transition",
                  active
                    ? "border-[var(--color-fg)] bg-[var(--color-surface-2)]"
                    : "border-transparent bg-[var(--color-surface)] hover:bg-[var(--color-surface-2)]",
                )}
              >
                <span className="block text-lg font-bold tabular-nums">{m}</span>
                <span className="text-[10px] text-[var(--color-muted)]">мин</span>
              </motion.button>
            );
          })}
        </div>
      </section>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onDone}
        className="h-14 rounded-2xl bg-[var(--color-fg)] text-[15px] font-semibold text-[var(--color-bg)] transition hover:opacity-90"
      >
        Показать действия на сегодня
      </motion.button>
    </motion.div>
  );
}
