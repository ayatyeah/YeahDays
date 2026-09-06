"use client";

import {
  animate,
  motion,
  useMotionValue,
  useTransform,
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
import { YgIcon } from "@/components/yg-icons";

export type SwipeDir = "left" | "right";

/** Короткие подписи дней, индекс как у Date.getDay (0 — воскресенье). */
const WEEKDAY_SHORT = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

interface ActionCardProps {
  scored: ScoredAction;
  /** 0 — верхняя карта, 1 — следующая, ... */
  index: number;
  onSwipe: (dir: SwipeDir, action: Action) => void;
  /** программный свайп по кнопке */
  forced?: SwipeDir | null;
}

/*
 * Пороги свайпа. Были 110px/480 — при ограниченном drag это ощущалось
 * неподъёмно: карточка упиралась в dragConstraints и шла заметно медленнее
 * пальца, так что «110 пикселей» на деле требовали куда большего жеста.
 * Теперь карточка следует за пальцем один в один, и порога в 80px хватает.
 */
const SWIPE_DISTANCE = 80;
const SWIPE_VELOCITY = 380;
/** Куда улетает карточка после засчитанного свайпа. */
const FLY_OUT = 640;

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

  // Стопка: карты позади уменьшены и чуть сдвинуты вниз. 8px, а не 14:
  // при 14 из-под верхней карты выглядывала строка метрик следующей —
  // обрезанные «20 мин | Очень л…» читались как глюк, а не как глубина.
  // Содержимое карт позади скрыто (см. ниже) — наружу торчит только кромка.
  const stackScale = 1 - index * 0.05;
  const stackY = index * 8;

  /**
   * Улёт карточки после засчитанного свайпа. Раньше карточка просто
   * исчезала в точке отпускания — жест выглядел так, будто его не
   * приняли. Теперь она доезжает до края, и только потом снимается.
   */
  function flyOut(dir: SwipeDir) {
    animate(x, dir === "right" ? FLY_OUT : -FLY_OUT, {
      duration: 0.22,
      ease: [0.32, 0, 0.67, 0],
      onComplete: () => onSwipe(dir, action),
    });
  }

  /* Программный свайп кнопками под колодой — тот же полёт, что и пальцем. */
  useEffect(() => {
    if (!forced || !isTop) return;
    flyOut(forced);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forced, isTop]);

  function handleDragEnd(_: unknown, info: PanInfo) {
    const dx = info.offset.x;
    const vx = info.velocity.x;
    const passed =
      Math.abs(dx) > SWIPE_DISTANCE || Math.abs(vx) > SWIPE_VELOCITY;

    if (!passed) return; // dragSnapToOrigin вернёт карту на место

    flyOut(dx > 0 || vx > 0 ? "right" : "left");
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
        className="gpu-layer relative h-full w-full cursor-grab overflow-hidden rounded-[19px] bg-[var(--color-surface)] active:cursor-grabbing"
        style={{
          x: isTop ? x : 0,
          y: isTop ? y : 0,
          rotate: isTop ? rotate : 0,
          scale: isTop ? lift : 1,
          // Тень только у верхней карты и из токена темы. Раньше каждая
          // карта стопки несла чёрную тень 0.6–0.7: три тени складывались
          // в тёмную полосу под колодой, особенно в светлой теме.
          boxShadow: isTop ? "var(--shadow-2)" : "none",
          pointerEvents: isTop ? "auto" : "none",
        }}
        drag={isTop ? "x" : false}
        /* Без dragConstraints: с ограничением в ноль и эластичностью 0.62
           карточка шла медленнее пальца и пружинила — жест ощущался
           вязким и «неотзывчивым». Теперь она следует один в один, а
           возврат при недостаточном свайпе делает dragSnapToOrigin. */
        dragSnapToOrigin
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        whileTap={isTop ? { cursor: "grabbing" } : undefined}
      >
        {/* Декоративные слои (радиальный градиент под категорию и сетка
            28px) убраны: в строгой схеме карточка — ровная матовая
            поверхность, а различает категории бейдж и цвет подписи, а не
            подсветка фона. */}

        {/* ── Свечение решения: только opacity, композитится на GPU ── */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-10 rounded-[19px]"
          style={{
            opacity: isTop ? acceptGlow : 0,
            boxShadow:
              "inset 0 0 0 2px rgba(63,191,154,0.9), inset 0 0 60px rgba(63,191,154,0.25)",
          }}
        />
        <motion.div
          className="pointer-events-none absolute inset-0 z-10 rounded-[19px]"
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
            borderColor: "#6fb39c",
            color: "#6fb39c",
          }}
        >
          <span className="text-[22px] font-black tracking-tight">БЕРУ</span>
        </motion.div>
        <motion.div
          className="pointer-events-none absolute left-5 top-6 z-20 -rotate-[14deg] rounded-xl border-[3px] px-4 py-1.5"
          style={{
            opacity: isTop ? noOpacity : 0,
            scale: isTop ? noScale : 0.8,
            borderColor: "#cf8578",
            color: "#cf8578",
          }}
        >
          <span className="text-[22px] font-black tracking-tight">НЕ СЕЙЧАС</span>
        </motion.div>

        {/* ── Контент ── */}
        {/* У карт позади содержимое невидимо: из-под верхней карты должна
            выглядывать чистая кромка, а не обрезанный текст. Разметка
            остаётся — карта сохраняет высоту, и стопка не «дышит» при
            смене верхней. */}
        <div className={`relative flex h-full flex-col p-6 ${isTop ? "" : "opacity-0"}`}>
          {/* категория */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-2xl text-[20px]"
                style={{ background: `${stat.hex}1f`, color: stat.hex }}
              >
                <YgIcon name={action.icon ?? cat.icon} className="h-5 w-5" />
              </div>
              <div className="leading-tight">
                <p className="text-[15px] font-semibold">{cat.label}</p>
                {/* «Здоровье / Здоровье» — у категории и стата одно имя,
                    вторая строка тогда только повторяет первую. */}
                {stat.label !== cat.label && (
                  <p
                    className="flex items-center gap-1 text-[12px] font-medium"
                    style={{ color: stat.hex }}
                  >
                    <YgIcon name={stat.icon} className="h-3.5 w-3.5" />
                    {stat.label}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right leading-none">
              <p
                className="text-[28px] font-black tabular-nums"
                style={{ color: stat.hex }}
              >
                +{xp}
              </p>
              <p className="mt-0.5 text-[12px] font-medium tracking-wider text-[var(--color-muted)]">
                XP
              </p>
            </div>
          </div>

          {/* заголовок */}
          <div className="flex flex-1 flex-col justify-center py-6">
            <h2 className="text-[34px] font-bold leading-[1.15] tracking-tight">
              {action.title}
            </h2>
            <p className="mt-3 text-[16px] leading-snug text-[var(--color-fg-dim)]">
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
            <p className="text-[15px] font-medium" style={{ color: stat.hex }}>
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

          <div className="mt-2 flex items-center justify-between text-[12px] text-[var(--color-muted)]">
            <span>
              {TIME_LABEL[action.timePreference]}
              {/* Дни, к которым привязано действие — иначе непонятно,
                  почему «конспект к практике» появился именно сегодня. */}
              {action.weekdays && action.weekdays.length > 0 && (
                <span className="ml-1.5 text-[var(--color-fg-dim)]">
                  · {action.weekdays.map((d) => WEEKDAY_SHORT[d]).join(" ")}
                </span>
              )}
            </span>
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
      <p className="text-[12px] uppercase tracking-wider text-[var(--color-muted)]">
        {hint ? (
          // помечаем цифру, которую посчитали по замерам самого человека,
          // иначе изменившееся время выглядит как ошибка в контенте
          <span className="text-[var(--color-stability)]">{hint}</span>
        ) : (
          label
        )}
      </p>
      <p className="mt-0.5 truncate text-[13px] font-semibold">{value}</p>
    </div>
  );
}
