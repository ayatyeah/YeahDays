"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { STAT_LIST, dateKey, type StatKey } from "@/lib/domain";
import { useUserStore } from "@/store/useUserStore";
import { useNavStore } from "@/store/useNavStore";
import { cn } from "@/lib/cn";
import Logo from "@/components/Logo";
import { YgIcon, type YgIconName } from "@/components/yg-icons";

/**
 * Первый запуск. Задаёт тон продукта и собирает минимум, который реально
 * влияет на подборку: имя (обращение) и фокус-статы (веса целей в движке).
 * Плюс шаг, где человек сам вписывает свои первые задачи — раньше сразу
 * после онбординга шли чек-ин и колода готовых карточек, и человек не
 * успевал ничего написать сам, прежде чем увидеть чужой контент.
 */

const STEPS = 4;

const VALUE_PROPS: { icon: YgIconName; title: string; text: string }[] = [
  { icon: "cards", title: "Колода, а не список", text: "Свайпай действия под своё состояние — берёшь или пропускаешь." },
  { icon: "bulb", title: "Подстраивается под тебя", text: "Чем больше свайпов, тем точнее ежедневная подборка." },
  { icon: "person", title: "Персонаж растёт с тобой", text: "Каждое выполненное действие делает его сильнее." },
];

export default function Onboarding() {
  const storedName = useUserStore((s) => s.name);
  const setName = useUserStore((s) => s.setName);
  const setGoal = useUserStore((s) => s.setGoal);
  const addTodo = useUserStore((s) => s.addTodo);
  const completeOnboarding = useUserStore((s) => s.completeOnboarding);
  const go = useNavStore((s) => s.go);

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
    // На "Главная" — колода теперь собирается только из своих действий
    // (useOwnActionsOnly), так что это уже не чужой контент, а ровно те
    // же задачи, что человек только что вписал сам.
    go("home");
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
                <p className="mt-3 max-w-[300px] text-[17px] leading-snug text-[var(--color-fg-dim)]">
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
                    <YgIcon name={v.icon} className="h-7 w-7" />
                    <div className="min-w-0">
                      <p className="text-[16px] font-semibold">{v.title}</p>
                      <p className="text-[13px] leading-snug text-[var(--color-muted)]">
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
                <h1 className="text-[34px] font-bold leading-tight tracking-tight">
                  Как тебя называть?
                </h1>
                <p className="mt-2 text-[16px] leading-snug text-[var(--color-fg-dim)]">
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
                <h1 className="text-[34px] font-bold leading-tight tracking-tight">
                  Что качаем в первую очередь?
                </h1>
                <p className="mt-2 text-[16px] leading-snug text-[var(--color-fg-dim)]">
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
                          className="flex h-9 w-9 items-center justify-center rounded-xl text-[20px]"
                          style={{ background: `${s.hex}1f`, color: s.hex }}
                        >
                          <YgIcon name={s.icon} className="h-5 w-5" />
                        </span>
                        <span className="mt-1 text-[15px] font-semibold">
                          {s.label}
                        </span>
                        <span className="text-[12px] leading-tight text-[var(--color-muted)]">
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
                <h1 className="text-[34px] font-bold leading-tight tracking-tight">
                  Что нужно сделать?
                </h1>
                <p className="mt-2 text-[16px] leading-snug text-[var(--color-fg-dim)]">
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
                    className="h-14 min-w-0 flex-1 rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-surface-2)] px-5 text-[16px] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-fg-dim)]"
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
                        <span className="min-w-0 flex-1 truncate text-[15px]">
                          {t}
                        </span>
                        <button
                          onClick={() => removeTask(i)}
                          className="shrink-0 text-[15px] text-[var(--color-muted)] transition hover:text-[var(--color-strength)]"
                          aria-label="Убрать"
                        >
                          <YgIcon name="close" className="h-4 w-4" />
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
          className="h-14 flex-1 rounded-2xl bg-[var(--color-fg)] text-[16px] font-semibold text-[var(--color-bg)] transition hover:opacity-90 disabled:opacity-40"
        >
          {step === 0 ? "Начать" : step === STEPS - 1 ? "Погнали" : "Далее"}
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
