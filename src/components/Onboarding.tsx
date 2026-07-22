"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { STAT_LIST, type StatKey } from "@/lib/domain";
import { useUserStore } from "@/store/useUserStore";
import { cn } from "@/lib/cn";

/**
 * Первый запуск. Задаёт тон продукта и собирает минимум, который реально
 * влияет на подборку: имя (обращение) и фокус-статы (веса целей в движке).
 * Три шага, каждый — за несколько секунд.
 */

const STEPS = 3;

const VALUE_PROPS = [
  { icon: "🎴", title: "Колода, а не список", text: "Свайпай действия под своё состояние — берёшь или пропускаешь." },
  { icon: "🧠", title: "Подстраивается под тебя", text: "Чем больше свайпов, тем точнее ежедневная подборка." },
  { icon: "🧍", title: "Персонаж растёт с тобой", text: "Каждое выполненное действие делает его сильнее." },
];

export default function Onboarding() {
  const storedName = useUserStore((s) => s.name);
  const setName = useUserStore((s) => s.setName);
  const setGoal = useUserStore((s) => s.setGoal);
  const completeOnboarding = useUserStore((s) => s.completeOnboarding);

  const [step, setStep] = useState(0);
  const [name, setNameDraft] = useState(
    storedName === "Странник" ? "" : storedName,
  );
  const [focus, setFocus] = useState<Set<StatKey>>(new Set());

  const canNext = step !== 1 || name.trim().length > 0;

  function toggleFocus(k: StatKey) {
    setFocus((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  }

  function finish() {
    setName(name);
    for (const s of STAT_LIST) {
      setGoal(s.key, focus.has(s.key) ? 0.95 : focus.size === 0 ? 0.6 : 0.4);
    }
    completeOnboarding();
  }

  function next() {
    if (step < STEPS - 1) setStep((s) => s + 1);
    else finish();
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Прогресс */}
      <div className="mb-8 mt-2 flex items-center gap-2">
        {Array.from({ length: STEPS }).map((_, i) => (
          <div
            key={i}
            className="h-1 flex-1 overflow-hidden rounded-full bg-[var(--color-surface-2)]"
          >
            <motion.div
              className="h-full rounded-full bg-[var(--color-fg)]"
              initial={false}
              animate={{ scaleX: i <= step ? 1 : 0 }}
              style={{ originX: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
            />
          </div>
        ))}
      </div>

      <div className="relative flex flex-1 flex-col">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <Step key="welcome">
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <Orb />
                <h1 className="mt-8 text-[34px] font-black leading-none tracking-tight">
                  YeahDays
                </h1>
                <p className="mt-3 max-w-[300px] text-[16px] leading-snug text-[var(--color-fg-dim)]">
                  Одно небольшое действие в день делает тебя лучшей версией
                  себя.
                </p>
              </div>
              <div className="space-y-2.5 pb-2">
                {VALUE_PROPS.map((v) => (
                  <div
                    key={v.title}
                    className="flex items-center gap-3.5 rounded-2xl bg-[var(--color-surface)] px-4 py-3"
                  >
                    <span className="text-2xl">{v.icon}</span>
                    <div className="min-w-0">
                      <p className="text-[13.5px] font-semibold">{v.title}</p>
                      <p className="text-[12px] leading-snug text-[var(--color-muted)]">
                        {v.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Step>
          )}

          {step === 1 && (
            <Step key="name">
              <div className="flex flex-1 flex-col justify-center">
                <h1 className="text-[30px] font-bold leading-tight tracking-tight">
                  Как тебя называть?
                </h1>
                <p className="mt-2 text-[15px] leading-snug text-[var(--color-fg-dim)]">
                  Чтобы обращаться по-человечески, а не «пользователь».
                </p>
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => setNameDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && canNext && next()}
                  placeholder="Твоё имя"
                  maxLength={24}
                  className="mt-7 h-14 w-full rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-surface-2)] px-5 text-[17px] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-fg-dim)]"
                />
              </div>
            </Step>
          )}

          {step === 2 && (
            <Step key="focus">
              <div className="flex flex-1 flex-col justify-center">
                <h1 className="text-[30px] font-bold leading-tight tracking-tight">
                  Что качаем в первую очередь?
                </h1>
                <p className="mt-2 text-[15px] leading-snug text-[var(--color-fg-dim)]">
                  Можно выбрать несколько — подстрою колоду. Всегда можно
                  поменять в профиле.
                </p>
                <div className="mt-7 grid grid-cols-2 gap-2.5">
                  {STAT_LIST.map((s) => {
                    const active = focus.has(s.key);
                    return (
                      <motion.button
                        key={s.key}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => toggleFocus(s.key)}
                        className={cn(
                          "flex flex-col items-start gap-1 rounded-2xl border-2 p-4 text-left transition",
                          active
                            ? "bg-[var(--color-surface-2)]"
                            : "border-[var(--color-border)] bg-[var(--color-surface)]",
                        )}
                        style={active ? { borderColor: s.hex } : undefined}
                      >
                        <span
                          className="flex h-9 w-9 items-center justify-center rounded-xl text-lg"
                          style={{ background: `${s.hex}1f`, color: s.hex }}
                        >
                          {s.icon}
                        </span>
                        <span className="mt-1 text-[14px] font-semibold">
                          {s.label}
                        </span>
                        <span className="text-[11px] leading-tight text-[var(--color-muted)]">
                          {s.hint}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </Step>
          )}
        </AnimatePresence>
      </div>

      {/* Навигация */}
      <div className="flex items-center gap-3 pt-4">
        {step > 0 && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setStep((s) => s - 1)}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-surface)] text-[var(--color-fg-dim)] transition hover:text-[var(--color-fg)]"
            aria-label="Назад"
          >
            ‹
          </motion.button>
        )}
        <motion.button
          whileTap={{ scale: 0.97 }}
          disabled={!canNext}
          onClick={next}
          className="h-14 flex-1 rounded-2xl bg-[var(--color-fg)] text-[15px] font-semibold text-[var(--color-bg)] transition hover:opacity-90 disabled:opacity-40"
        >
          {step === 0 ? "Начать" : step === STEPS - 1 ? "Погнали 🚀" : "Далее"}
        </motion.button>
      </div>
    </div>
  );
}

function Step({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 flex flex-col"
    >
      {children}
    </motion.div>
  );
}

/** Живой градиентный шар — знак бренда на приветственном экране. */
function Orb() {
  return (
    <div className="relative h-28 w-28">
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, #f97362, #f0b23f, #3fbf9a, #8b7cf6, #f97362)",
          filter: "blur(2px)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />
      <div className="absolute inset-[10px] rounded-full bg-[var(--color-bg)]" />
      <motion.div
        className="absolute inset-[26px] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 40% 35%, #fff, #8b7cf6 70%, transparent)",
        }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
