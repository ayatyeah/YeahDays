"use client";

import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import Link from "next/link";
import { spring, springSnappy } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * Интерактивное демо на лендинге.
 *
 * Скриншот показывает, как выглядит; демо показывает, как ощущается —
 * а «ощущается» и есть весь продукт. Свайп работает по-настоящему:
 * карточку можно тащить пальцем или нажать кнопку.
 *
 * Осознанно изолировано: собственное состояние, никакого стора, БД и
 * событий. Человек трогает продукт, ничего себе не портя и не создавая
 * аккаунт. Поэтому же демо не переиспользует SwipeDeck — тот завязан
 * на движок и историю пользователя.
 */

interface DemoAction {
  id: string;
  title: string;
  why: string;
  cat: string;
  icon: string;
  color: string;
  min: number;
  xp: number;
  reason: string;
}

const DECK: DemoAction[] = [
  {
    id: "d1",
    title: "Пробежка 3 км",
    why: "Кардио, которое реально меняет выносливость",
    cat: "Спорт",
    icon: "🏃",
    color: "var(--color-strength)",
    min: 25,
    xp: 42,
    reason: "Двигает «Силу» — твой приоритет",
  },
  {
    id: "d2",
    title: "Прочитать 10 страниц",
    why: "Десять страниц в день — это 12 книг в год",
    cat: "Учёба",
    icon: "📚",
    color: "var(--color-intelligence)",
    min: 15,
    xp: 28,
    reason: "Влезает в 30 минут",
  },
  {
    id: "d3",
    title: "Записать расходы за день",
    why: "Видишь цифры — контролируешь их",
    cat: "Финансы",
    icon: "💰",
    color: "var(--color-wealth)",
    min: 5,
    xp: 24,
    reason: "Лёгкий шаг — сил хватит",
  },
  {
    id: "d4",
    title: "10 минут медитации",
    why: "Пауза, которая возвращает контроль",
    cat: "Осознанность",
    icon: "🧘",
    color: "var(--color-stability)",
    min: 10,
    xp: 30,
    reason: "Давно не пробовал",
  },
];

export default function LandingDemo() {
  const [index, setIndex] = useState(0);
  const [taken, setTaken] = useState<DemoAction[]>([]);
  const [dir, setDir] = useState<1 | -1>(1);

  const current = DECK[index];
  const done = index >= DECK.length;

  const swipe = useCallback(
    (accept: boolean) => {
      const a = DECK[index];
      if (!a) return;
      setDir(accept ? 1 : -1);
      if (accept) setTaken((t) => [...t, a]);
      setIndex((i) => i + 1);
      if (accept && typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate?.(12);
      }
    },
    [index],
  );

  const reset = useCallback(() => {
    setIndex(0);
    setTaken([]);
  }, []);

  return (
    <div className="mx-auto w-full max-w-[380px]">
      {/* Рамка «телефона» */}
      <div className="liquid rounded-[38px] p-2.5">
        <div className="relative overflow-hidden rounded-[30px] bg-[var(--color-bg)] px-4 pb-4 pt-5">
          {/* Шапка «приложения» */}
          <div className="mb-4 flex items-center justify-between">
            <span className="text-[15px] font-extrabold tracking-tight">
              YeahGrind
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-[rgba(255,255,255,0.06)] px-2.5 py-1">
              <span className="text-[11px]">🔥</span>
              <span className="num text-[12px] font-bold">9</span>
            </span>
          </div>

          {/* Индикатор плана */}
          <div className="mb-4 flex items-center gap-2">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="h-1.5 flex-1 overflow-hidden rounded-full bg-[rgba(255,255,255,0.07)]"
              >
                <motion.div
                  className="h-full rounded-full bg-[var(--color-fg)]"
                  initial={false}
                  animate={{ scaleX: i < taken.length ? 1 : 0 }}
                  style={{ originX: 0 }}
                  transition={spring}
                />
              </div>
            ))}
            <span className="num ml-1 text-[11px] font-medium text-[var(--color-muted)]">
              {Math.min(taken.length, 2)}/2
            </span>
          </div>

          {/* Колода */}
          <div className="relative h-[268px]">
            <AnimatePresence mode="popLayout" custom={dir}>
              {!done && current ? (
                <DemoCard
                  key={current.id}
                  action={current}
                  next={DECK[index + 1]}
                  dir={dir}
                  onSwipe={swipe}
                />
              ) : (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={spring}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center"
                >
                  <div className="liquid mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl">
                    ✦
                  </div>
                  <p className="text-[17px] font-bold">
                    {taken.length > 0 ? "План собран" : "Колода закончилась"}
                  </p>
                  <p className="mt-1.5 max-w-[240px] text-[12.5px] leading-snug text-[var(--color-fg-dim)]">
                    {taken.length > 0
                      ? `Взято действий: ${taken.length}. В приложении дальше — таймер и «Сделал».`
                      : "В приложении колода обновляется каждый день."}
                  </p>
                  <button
                    onClick={reset}
                    className="press mt-4 rounded-xl border border-[var(--color-border-strong)] px-4 py-2 text-[12.5px] font-semibold"
                  >
                    Ещё раз
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Кнопки */}
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={() => swipe(false)}
              disabled={done}
              className="press liquid h-12 flex-1 rounded-2xl text-[13.5px] font-semibold text-[var(--color-fg-dim)] disabled:opacity-30"
            >
              Не сейчас
            </button>
            <button
              onClick={() => swipe(true)}
              disabled={done}
              className="press h-12 flex-1 rounded-2xl bg-[var(--color-fg)] text-[13.5px] font-bold text-[var(--color-bg)] shadow-[var(--shadow-2)] disabled:opacity-30"
            >
              Беру
            </button>
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-[12.5px] text-[var(--color-muted)]">
        Живое демо — тащи карточку пальцем или жми кнопки.{" "}
        <Link href="/app" className="text-[var(--color-fg)] underline underline-offset-4">
          Открыть приложение
        </Link>
      </p>
    </div>
  );
}

function DemoCard({
  action,
  next,
  dir,
  onSwipe,
}: {
  action: DemoAction;
  next?: DemoAction;
  dir: 1 | -1;
  onSwipe: (accept: boolean) => void;
}) {
  const x = useMotionValue(0);
  // наклон и подсказки завязаны на смещение — жест читается сразу
  const rotate = useTransform(x, [-200, 200], [-11, 11]);
  const takeOpacity = useTransform(x, [40, 130], [0, 1]);
  const skipOpacity = useTransform(x, [-130, -40], [1, 0]);
  const nextScale = useTransform(x, [-160, 0, 160], [1, 0.94, 1]);

  const badge = useMemo(
    () => ({ borderColor: action.color, color: action.color }),
    [action.color],
  );

  return (
    <>
      {/* Следующая карточка снизу — колода выглядит стопкой, а не одиночкой */}
      {next && (
        <motion.div
          style={{ scale: nextScale }}
          className="surface absolute inset-x-3 top-[14px] h-[252px] rounded-[26px] opacity-70"
          aria-hidden
        />
      )}

      <motion.article
        className="gpu-layer absolute inset-x-0 top-0 h-[252px] cursor-grab active:cursor-grabbing"
        style={{ x, rotate }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.5}
        onDragEnd={(_, info) => {
          if (info.offset.x > 90 || info.velocity.x > 550) onSwipe(true);
          else if (info.offset.x < -90 || info.velocity.x < -550) onSwipe(false);
        }}
        initial={{ opacity: 0, scale: 0.94, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{
          x: dir * 420,
          opacity: 0,
          rotate: dir * 16,
          transition: { duration: 0.26 },
        }}
        transition={spring}
      >
        <div className="surface-raised relative flex h-full flex-col rounded-[26px] bg-[var(--color-surface)] p-5">
          {/* Подсказки решения */}
          <motion.span
            style={{ opacity: takeOpacity }}
            className="absolute right-4 top-4 rounded-lg border-2 border-[var(--color-stability)] px-2.5 py-1 text-[12px] font-extrabold text-[var(--color-stability)]"
          >
            БЕРУ
          </motion.span>
          <motion.span
            style={{ opacity: skipOpacity }}
            className="absolute left-4 top-4 rounded-lg border-2 border-[var(--color-muted)] px-2.5 py-1 text-[12px] font-extrabold text-[var(--color-muted)]"
          >
            НЕ СЕЙЧАС
          </motion.span>

          <div className="mt-9 flex items-center gap-2">
            <span
              className="rounded-lg border px-2 py-0.5 text-[10.5px] font-semibold"
              style={badge}
            >
              {action.icon} {action.cat}
            </span>
            <span className="text-[10.5px] text-[var(--color-muted)]">
              {action.min} мин · +{action.xp} XP
            </span>
          </div>

          <h3 className="mt-3 text-[21px] font-bold leading-tight">
            {action.title}
          </h3>
          <p className="mt-2 text-[13px] leading-snug text-[var(--color-fg-dim)]">
            {action.why}
          </p>

          <div className="mt-auto flex items-center gap-2 pt-4">
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                "bg-[var(--color-stability)]",
              )}
              aria-hidden
            />
            <span className="text-[11.5px] text-[var(--color-muted)]">
              {action.reason}
            </span>
          </div>
        </div>
      </motion.article>
    </>
  );
}
