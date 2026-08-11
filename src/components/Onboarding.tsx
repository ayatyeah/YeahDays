"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { signIn, useSession } from "next-auth/react";
import { STAT_LIST, dateKey, type StatKey } from "@/lib/domain";
import { useUserStore } from "@/store/useUserStore";
import { useNavStore } from "@/store/useNavStore";
import { cn } from "@/lib/cn";
import Logo from "@/components/Logo";

/**
 * Первый запуск. Задаёт тон продукта и собирает минимум, который реально
 * влияет на подборку: имя (обращение) и фокус-статы (веса целей в движке).
 * Плюс шаг, где человек сам вписывает свои первые задачи — раньше сразу
 * после онбординга шли чек-ин и колода готовых карточек, и человек не
 * успевал ничего написать сам, прежде чем увидеть чужой контент.
 */

const STEPS = 4;

const VALUE_PROPS = [
  { icon: "🎴", title: "Колода, а не список", text: "Свайпай действия под своё состояние — берёшь или пропускаешь." },
  { icon: "🧠", title: "Подстраивается под тебя", text: "Чем больше свайпов, тем точнее ежедневная подборка." },
  { icon: "🧍", title: "Персонаж растёт с тобой", text: "Каждое выполненное действие делает его сильнее." },
];

export default function Onboarding() {
  const storedName = useUserStore((s) => s.name);
  const setName = useUserStore((s) => s.setName);
  const setGoal = useUserStore((s) => s.setGoal);
  const addTodo = useUserStore((s) => s.addTodo);
  const completeOnboarding = useUserStore((s) => s.completeOnboarding);
  const go = useNavStore((s) => s.go);

  const { status } = useSession();
  const [step, setStep] = useState(0);
  const [name, setNameDraft] = useState(
    storedName === "Странник" ? "" : storedName,
  );
  const [focus, setFocus] = useState<Set<StatKey>>(new Set());
  const [tasks, setTasks] = useState<string[]>([]);
  const [taskDraft, setTaskDraft] = useState("");

  const canNext = step !== 1 || name.trim().length > 0;

  function toggleFocus(k: StatKey) {
    setFocus((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  }

  function addTask() {
    const title = taskDraft.trim();
    if (!title) return;
    setTasks((prev) => [...prev, title]);
    setTaskDraft("");
  }

  function removeTask(i: number) {
    setTasks((prev) => prev.filter((_, idx) => idx !== i));
  }

  function finish() {
    setName(name);
    for (const s of STAT_LIST) {
      setGoal(s.key, focus.has(s.key) ? 0.95 : focus.size === 0 ? 0.6 : 0.4);
    }
    // Недопечатанный черновик в поле — тоже задача, а не потерянный текст.
    const draft = taskDraft.trim();
    const allTasks = draft ? [...tasks, draft] : tasks;
    const today = dateKey();
    for (const title of allTasks) {
      addTodo({ title, date: today });
    }
    completeOnboarding();
    // На "Сегодня", к своим только что вписанным задачам — не в колоду
    // готовых карточек. Раньше отсюда сразу шли чек-ин и SwipeDeck.
    go("today");
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
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Logo glow className="h-28 w-auto" />
                </motion.div>
                <h1 className="mt-5 text-[34px] font-black leading-none tracking-tight">
                  YeahGrind
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

          {step === 3 && (
            <Step key="tasks">
              <div className="flex flex-1 flex-col">
                <h1 className="text-[30px] font-bold leading-tight tracking-tight">
                  Что нужно сделать?
                </h1>
                <p className="mt-2 text-[15px] leading-snug text-[var(--color-fg-dim)]">
                  Впиши свои задачи сам — хоть одну, хоть все на сегодня.
                  Можно и пропустить, добавишь позже.
                </p>
                <div className="mt-6 flex gap-2.5">
                  <input
                    autoFocus
                    value={taskDraft}
                    onChange={(e) => setTaskDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key !== "Enter") return;
                      e.preventDefault();
                      addTask();
                    }}
                    placeholder="Например: позвонить в банк"
                    maxLength={120}
                    className="h-14 min-w-0 flex-1 rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-surface-2)] px-5 text-[15px] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-fg-dim)]"
                  />
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={addTask}
                    disabled={!taskDraft.trim()}
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-fg)] text-[22px] font-bold text-[var(--color-bg)] transition disabled:opacity-40"
                    aria-label="Добавить задачу"
                  >
                    +
                  </motion.button>
                </div>
                {tasks.length > 0 && (
                  <ul className="mt-4 space-y-2 overflow-y-auto">
                    {tasks.map((t, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 rounded-2xl bg-[var(--color-surface)] px-4 py-3"
                      >
                        <span className="min-w-0 flex-1 truncate text-[14px]">
                          {t}
                        </span>
                        <button
                          onClick={() => removeTask(i)}
                          className="shrink-0 text-[13px] text-[var(--color-muted)] transition hover:text-[var(--color-strength)]"
                          aria-label="Убрать"
                        >
                          ✕
                        </button>
                      </motion.li>
                    ))}
                  </ul>
                )}
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

      {/*
        Вход на первом же экране, а не только в «Профиле».

        Без него человек со вторым устройством обязан пройти регистрацию
        заново — придумать имя, выбрать приоритеты — и лишь потом искать,
        где войти. Он создаёт локальный аккаунт, которого не хотел.

        Подхват прогресса делать не нужно: у пустого стора updatedAt = 0,
        поэтому снимок с сервера всегда выигрывает, а StateSync смонтирован
        в AuthProvider и работает уже здесь. После входа onboarded приедет
        с сервера, и этот экран исчезнет сам.
      */}
      {step === 0 && status !== "authenticated" && (
        <button
          onClick={() => signIn("google")}
          disabled={status === "loading"}
          className="press mt-3 flex h-12 w-full items-center justify-center gap-2.5 rounded-2xl border border-[var(--color-border-strong)] text-[14px] font-medium text-[var(--color-fg-dim)] transition hover:text-[var(--color-fg)] disabled:opacity-40"
        >
          <GoogleMark />
          Уже пользуешься? Войти через Google
        </button>
      )}
    </div>
  );
}

/** Логотип Google в официальных цветах — узнаётся быстрее любой подписи. */
function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-[17px] w-[17px]" aria-hidden>
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1A12 12 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.4 14.4a7.2 7.2 0 0 1 0-4.6V6.7H1.4a12 12 0 0 0 0 10.8l4-3.1z"
      />
      <path
        fill="#EA4335"
        d="M12 4.8c1.8 0 3.4.6 4.6 1.8l3.5-3.5C17.9 1.2 15.2 0 12 0A12 12 0 0 0 1.4 6.7l4 3.1C6.3 6.9 8.9 4.8 12 4.8z"
      />
    </svg>
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
