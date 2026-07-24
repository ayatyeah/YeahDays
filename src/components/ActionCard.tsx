"use client";

import {
  motion,
  useMotionValue,
  useTransform,
  useMotionTemplate,
  type PanInfo,
} from "framer-motion";
import { useEffect } from "react";
import {
  CATEGORIES,
  DIFFICULTY_LABEL,
  ENERGY_LABEL,
  STATS,
  TIME_LABEL,
  xpForAction,
  type Action,
} from "@/lib/domain";
import type { ScoredAction } from "@/lib/recommendation";
import { durationInsight } from "@/lib/durations";
import { useUserStore } from "@/store/useUserStore";

export type SwipeDir = "left" | "right";

interface ActionCardProps {
  scored: ScoredAction;
  /** 0 — верхняя карта, 1 — следующая, ... */
  index: number;
  onSwipe: (dir: SwipeDir, action: Action) => void;
  /** программный свайп по кнопке */
  forced?: SwipeDir | null;
}

const SWIPE_DISTANCE = 110;
const SWIPE_VELOCITY = 480;

export default function ActionCard({
  scored,
  index,
  onSwipe,
  forced,
}: ActionCardProps) {
  const { action, reason } = scored;
  const cat = CATEGORIES[action.category];
  const stat = STATS[cat.stat];
  const xp = xpForAction(action);

  // Личная оценка длительности: показываем её вместо цифры из пула, как
  // только замеры разошлись с ней заметно. Подписываемся точечно на замеры
  // одного действия — карточек на экране несколько, и перерисовывать их
  // на каждое изменение стора незачем.
  const samples = useUserStore((s) => s.history.durations?.[action.id]);
  const personal = durationInsight(action.duration, samples)?.personal;

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // поворот зависит от смещения — карта «живая» в руке
  const rotate = useTransform(x, [-260, 0, 260], [-16, 0, 16]);
  // лёгкий подъём при перетаскивании
  const lift = useTransform(x, [-260, 0, 260], [1.02, 1, 1.02]);

  // индикаторы решения
  const yesOpacity = useTransform(x, [30, 130], [0, 1]);
  const noOpacity = useTransform(x, [-130, -30], [1, 0]);
  const yesScale = useTransform(x, [30, 150], [0.8, 1.05]);
  const noScale = useTransform(x, [-150, -30], [1.05, 0.8]);

  /**
   * Свечение решения.
   *
   * ПРОИЗВОДИТЕЛЬНОСТЬ: раньше здесь анимировался boxShadow с размытием
   * 60px. Тень не композитится на GPU, поэтому каждый кадр драга вызывал
   * полную перерисовку — свайп ощущался вязким, особенно на телефоне.
   * Теперь тень статичная, а цвет решения показывают два наложенных
   * слоя, у которых меняется только opacity (композитится на GPU).
   */
  const acceptGlow = useTransform(x, [40, 190], [0, 1]);
  const rejectGlow = useTransform(x, [-190, -40], [1, 0]);

  const isTop = index === 0;

  // стек: карты позади уменьшены и сдвинуты вниз
  const stackScale = 1 - index * 0.05;
  const stackY = index * 14;

  /* программный свайп (кнопки под колодой) */
  useEffect(() => {
    if (!forced || !isTop) return;
    const dir = forced === "right" ? 1 : -1;
    const start = x.get();
    const target = dir * 640;
    const t0 = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / 320);
      const eased = 1 - Math.pow(1 - k, 3);
      x.set(start + (target - start) * eased);
      if (k < 1) raf = requestAnimationFrame(step);
      else onSwipe(forced, action);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forced, isTop]);

  function handleDragEnd(_: unknown, info: PanInfo) {
    const dx = info.offset.x;
    const vx = info.velocity.x;
    const passed =
      Math.abs(dx) > SWIPE_DISTANCE || Math.abs(vx) > SWIPE_VELOCITY;

    if (!passed) return; // spring вернёт карту на место

    const dir: SwipeDir = dx > 0 || vx > 0 ? "right" : "left";
    onSwipe(dir, action);
  }

  return (
    <motion.div
      className="absolute inset-0"
      style={{ zIndex: 10 - index }}
      initial={{ scale: stackScale - 0.04, y: stackY + 10, opacity: 0 }}
      animate={{ scale: stackScale, y: stackY, opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 0.9,
        transition: { duration: 0.2 },
      }}
      transition={{ type: "spring", stiffness: 300, damping: 32 }}
    >
      <motion.article
        className="gpu-layer relative h-full w-full cursor-grab overflow-hidden rounded-[28px] bg-[var(--color-surface)] active:cursor-grabbing"
        style={{
          x: isTop ? x : 0,
          y: isTop ? y : 0,
          rotate: isTop ? rotate : 0,
          scale: isTop ? lift : 1,
          boxShadow: isTop
            ? "0 0 0 1px rgba(255,255,255,0.07), 0 20px 50px -14px rgba(0,0,0,0.7)"
            : "0 0 0 1px rgba(255,255,255,0.05), 0 12px 30px -12px rgba(0,0,0,0.6)",
          pointerEvents: isTop ? "auto" : "none",
        }}
        drag={isTop ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.62}
        onDragEnd={handleDragEnd}
        whileTap={isTop ? { cursor: "grabbing" } : undefined}
      >
        {/* фоновый градиент под категорию */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.16]"
          style={{
            background: `radial-gradient(120% 80% at 50% 0%, ${stat.hex} 0%, transparent 62%)`,
          }}
        />
        {/* тонкая сетка для «продуктового» ощущения */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* ── Свечение решения: только opacity, композитится на GPU ── */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-10 rounded-[28px]"
          style={{
            opacity: isTop ? acceptGlow : 0,
            boxShadow:
              "inset 0 0 0 2px rgba(63,191,154,0.9), inset 0 0 60px rgba(63,191,154,0.25)",
          }}
        />
        <motion.div
          className="pointer-events-none absolute inset-0 z-10 rounded-[28px]"
          style={{
            opacity: isTop ? rejectGlow : 0,
            boxShadow:
              "inset 0 0 0 2px rgba(249,115,98,0.9), inset 0 0 60px rgba(249,115,98,0.25)",
          }}
        />

        {/* ── Штампы решения ── */}
        <motion.div
          className="pointer-events-none absolute right-5 top-6 z-20 rotate-[14deg] rounded-xl border-[3px] px-4 py-1.5"
          style={{
            opacity: isTop ? yesOpacity : 0,
            scale: isTop ? yesScale : 0.8,
            borderColor: "#3fbf9a",
            color: "#3fbf9a",
          }}
        >
          <span className="text-xl font-black tracking-tight">БЕРУ</span>
        </motion.div>
        <motion.div
          className="pointer-events-none absolute left-5 top-6 z-20 -rotate-[14deg] rounded-xl border-[3px] px-4 py-1.5"
          style={{
            opacity: isTop ? noOpacity : 0,
            scale: isTop ? noScale : 0.8,
            borderColor: "#f97362",
            color: "#f97362",
          }}
        >
          <span className="text-xl font-black tracking-tight">НЕ СЕЙЧАС</span>
        </motion.div>

        {/* ── Контент ── */}
        <div className="relative flex h-full flex-col p-6">
          {/* категория */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-2xl text-lg"
                style={{ background: `${stat.hex}1f` }}
              >
                {cat.icon}
              </div>
              <div className="leading-tight">
                <p className="text-[13px] font-semibold">{cat.label}</p>
                <p
                  className="text-[11px] font-medium"
                  style={{ color: stat.hex }}
                >
                  {stat.icon} {stat.label}
                </p>
              </div>
            </div>
            <div className="text-right leading-none">
              <p
                className="text-2xl font-black tabular-nums"
                style={{ color: stat.hex }}
              >
                +{xp}
              </p>
              <p className="mt-0.5 text-[10px] font-medium tracking-wider text-[var(--color-muted)]">
                XP
              </p>
            </div>
          </div>

          {/* заголовок */}
          <div className="flex flex-1 flex-col justify-center py-6">
            <h2 className="text-[27px] font-bold leading-[1.15] tracking-tight">
              {action.title}
            </h2>
            <p className="mt-3 text-[15px] leading-snug text-[var(--color-fg-dim)]">
              {action.why}
            </p>
          </div>

          {/* почему предложено */}
          <div
            className="mb-4 flex items-center gap-2 rounded-2xl px-3.5 py-2.5"
            style={{ background: `${stat.hex}14` }}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none">
              <path
                d="M12 3v2M12 19v2M5 12H3m18 0h-2M6.3 6.3 4.9 4.9m14.2 1.4 1.4-1.4M6.3 17.7l-1.4 1.4m14.2-1.4 1.4 1.4M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                stroke={stat.hex}
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
            <p className="text-[12.5px] font-medium" style={{ color: stat.hex }}>
              {reason}
            </p>
          </div>

          {/* параметры */}
          <div className="grid grid-cols-3 gap-2">
            <Meta
              label="Время"
              value={`${personal ?? action.duration} мин`}
              hint={personal ? "твоё" : undefined}
            />
            <Meta label="Сложность" value={DIFFICULTY_LABEL[action.difficulty]} />
            <Meta label="Энергия" value={ENERGY_LABEL[action.energy]} />
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px] text-[var(--color-muted)]">
            <span>{TIME_LABEL[action.timePreference]}</span>
            <span className="flex items-center gap-1">
              Влияние
              <span className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className="h-1 w-2.5 rounded-full"
                    style={{
                      background:
                        i < action.impact ? stat.hex : "var(--color-surface-2)",
                    }}
                  />
                ))}
              </span>
            </span>
          </div>
        </div>
      </motion.article>
    </motion.div>
  );
}

function Meta({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl bg-[var(--color-surface-2)]/70 px-2.5 py-2 text-center">
      <p className="text-[10px] uppercase tracking-wider text-[var(--color-muted)]">
        {hint ? (
          // помечаем цифру, которую посчитали по замерам самого человека,
          // иначе изменившееся время выглядит как ошибка в контенте
          <span className="text-[var(--color-stability)]">{hint}</span>
        ) : (
          label
        )}
      </p>
      <p className="mt-0.5 truncate text-[12px] font-semibold">{value}</p>
    </div>
  );
}
