"use client";

import { motion } from "framer-motion";
import { ENERGY_LABEL, type DailyMood, type EnergyLevel } from "@/lib/domain";
import Segmented from "@/components/ui/Segmented";
import type { YgIconName } from "@/components/yg-icons";

/**
 * Ежедневный чек-ин.
 *
 * Это не «настройки» — это вход в продукт. Два вопроса за 3 секунды,
 * которые превращают generic-список в подборку под текущее состояние.
 * Без них персонализация была бы фикцией.
 *
 * Оба вопроса — сегмент-контролы, как в системных экранах iOS: один
 * выбор из ряда, ползунок переезжает на ответ. Раньше это были три и
 * четыре отдельные плитки с рамками — занимали пол-экрана и читались как
 * карточки, а не как переключатель.
 */

const ENERGY_OPTIONS: { key: EnergyLevel; icon: YgIconName; label: string }[] = [
  { key: "low", icon: "moon", label: ENERGY_LABEL.low },
  { key: "medium", icon: "cloud", label: ENERGY_LABEL.medium },
  { key: "high", icon: "bolt", label: ENERGY_LABEL.high },
];

const MINUTES = [10, 20, 30, 60].map((m) => ({ key: m, label: String(m), sub: "мин" }));

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
      // Не justify-center: когда содержимое выше экрана (iPhone SE),
      // центрирование раздаёт переполнение поровну вверх и вниз, и кнопка
      // «Показать действия» уезжала под нижнюю навигацию. my-auto на
      // обёртке центрирует, пока место есть, а при нехватке прижимает к
      // верху и даёт обычную прокрутку.
      className="flex flex-1 flex-col"
    >
      <div className="my-auto">
      <div className="mb-8">
        <p className="text-[16px] font-medium text-[var(--color-muted)]">
          Привет, {name}
        </p>
        <h1 className="ios-title mt-1">Как ты сегодня?</h1>
        <p className="mt-2 text-[16px] leading-snug text-[var(--color-fg-dim)]">
          Два ответа — и я подберу действия под твоё состояние,
          а не абстрактный список.
        </p>
      </div>

      {/* Энергия */}
      <section className="mb-6">
        <p className="inset-title">Сколько сил?</p>
        <Segmented
          id="energy"
          size="lg"
          options={ENERGY_OPTIONS}
          value={mood.energy}
          onChange={(energy) => onChange({ energy })}
        />
      </section>

      {/* Время */}
      <section>
        <p className="inset-title">Сколько минут готов вложить?</p>
        <Segmented
          id="minutes"
          size="lg"
          options={MINUTES}
          value={mood.minutes}
          onChange={(minutes) => onChange({ minutes })}
        />
      </section>

      </div>

      {/* Прилипает к низу видимой части раздела — над нижней навигацией и
          баннером установки. Раньше кнопка стояла в потоке, и на iPhone SE
          в начальном положении оказывалась ровно под навигацией: касание по
          видимой кнопке уходило в панель, и казалось, что кнопка «не
          нажимается». sticky bottom-0 отсчитывается от края прокрутки за
          вычетом нижнего отступа раздела, то есть ровно над панелями. */}
      <div className="sticky bottom-0 -mx-[18px] mt-6 bg-[var(--color-bg)] px-[18px] pb-3 pt-3">
        <motion.button
          whileTap={{ scale: 0.98, opacity: 0.85 }}
          onClick={onDone}
          className="h-[50px] w-full rounded-2xl bg-[var(--color-fg)] text-[17px] font-semibold text-[var(--color-bg)] transition hover:opacity-90"
        >
          Показать действия на сегодня
        </motion.button>
      </div>
    </motion.div>
  );
}
