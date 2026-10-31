"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { STAT_LIST, dateKey, type StatKey } from "@/lib/domain";
import { useUserStore } from "@/store/useUserStore";
import { useNavStore } from "@/store/useNavStore";
import { usePersonalizationStore } from "@/store/usePersonalizationStore";
import { POLICY_VERSION } from "@/lib/personalization";
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

/** Шагов без согласия; шаг согласия добавляется, только если его ещё нет. */
const BASE_STEPS = 4;
const CONSENT_STEP = BASE_STEPS;

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

  /*
   * Согласие — последним шагом онбординга. Раньше новичок после регистрации
   * видел на каждом экране плашку «Обновлена политика», а пока не находил
   * её, сообщество было только для чтения и ИИ спрашивал разрешение в
   * каждом разделе. Шаг нужен и тем, кто вошёл через Google или Microsoft:
   * формы регистрации они не видели. Кто уже принял текущую версию — шага
   * не видит.
   */
  const { data: session } = useSession();
  const owner = session?.user?.id;
  const consent = usePersonalizationStore((s) => (owner && s.owner === owner ? s.data : null));
  const requestConsent = usePersonalizationStore((s) => s.request);
  const askConsent = Boolean(owner) && consent?.version !== POLICY_VERSION;
  const STEPS = askConsent ? BASE_STEPS + 1 : BASE_STEPS;
  const [consentBusy, setConsentBusy] = useState(false);

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

  /**
   * Одно нажатие — ровно один шаг.
   *
   * Раньше несколько быстрых касаний «Далее» приходили до перерисовки и
   * все видели один и тот же step: проверка «последний ли шаг» не
   * срабатывала, а каждое касание прибавляло единицу. Шаг уходил за
   * последний, ни один экран не рендерился — оставалась пустая страница с
   * кнопкой. Теперь после нажатия кнопки заперты до тех пор, пока новый шаг
   * не отрисован (эффект ниже), лишние касания просто отбрасываются.
   */
  const busyRef = useRef(false);
  useEffect(() => {
    busyRef.current = false;
  }, [step]);
  // Согласие могли принять с другого устройства, пока человек на последнем
  // шаге: шаг исчезает, и экран не должен остаться пустым.
  useEffect(() => {
    if (step > STEPS - 1) setStep(STEPS - 1);
  }, [step, STEPS]);

  function next() {
    if (busyRef.current) return;
    busyRef.current = true;
    // finish уводит на главную: замок оставляем закрытым, чтобы повторное
    // касание не записало задачи онбординга второй раз
    if (step === CONSENT_STEP && askConsent) void acceptAndFinish();
    else if (step >= STEPS - 1) finish();
    else setStep(step + 1);
  }

  /** Принять всё одним нажатием. Сеть подвела — всё равно пускаем дальше:
      плашка в приложении напомнит, а задачи онбординга терять нельзя. */
  async function acceptAndFinish() {
    if (owner) {
      setConsentBusy(true);
      await requestConsent(owner, {
        action: "consent",
        version: POLICY_VERSION,
        enabled: true,
        ai: true,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
    }
    finish();
  }

  function later() {
    if (busyRef.current) return;
    busyRef.current = true;
    finish();
  }

  function back() {
    if (busyRef.current || step === 0) return;
    busyRef.current = true;
    setStep(step - 1);
  }

  return (
    // Онбординг живёт внутри рамки .app-shell-frame с overflow: hidden. На
    // низких экранах (встроенный браузер Telegram, iPhone SE) контент выше
    // окна и кнопка «Начать» просто обрезалась — экран без выхода. Поэтому
    // онбординг прокручивается сам, а ряд кнопок прилипает к низу.
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
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
              // мгновенно: пружина при частых нажатиях догоняла шаг с запаздыванием
              transition={{ duration: 0 }}
            />
          </div>
        ))}
      </div>

      <div className="relative flex flex-1 flex-col">
        {/* Шаги сменяются мгновенно. Здесь был режим «дождаться ухода
            старого»: новый экран ждал 280 мс выхода предыдущего, и частые
            нажатия выстраивали очередь анимаций — экран отставал от пальца. */}
        <>
          {step === 0 && (
            <Step key="welcome">
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <Logo glow className="h-28 w-auto" />
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

          {step === CONSENT_STEP && askConsent && (
            <Step key="consent">
              <div className="flex flex-1 flex-col overflow-y-auto">
                <h1 className="text-[34px] font-bold leading-tight tracking-tight">
                  Последнее — про данные
                </h1>
                <p className="mt-2 text-[16px] leading-snug text-[var(--color-fg-dim)]">
                  Одно согласие вместо вопросов в каждом разделе. Нажимая
                  «Принять и начать», ты:
                </p>
                <ul className="mt-5 space-y-2.5 text-[15px] leading-snug">
                  <li className="rounded-2xl bg-[var(--color-surface)] px-4 py-3">
                    принимаешь{" "}
                    <Link href="/privacy" target="_blank" rel="noopener" className="underline">
                      политику конфиденциальности
                    </Link>
                  </li>
                  <li className="rounded-2xl bg-[var(--color-surface)] px-4 py-3">
                    появляешься в сообществе с именем, персонажем и уровнем —
                    скрыться можно одним переключателем
                  </li>
                  <li className="rounded-2xl bg-[var(--color-surface)] px-4 py-3">
                    разрешаешь ИИ-функциям отправлять в OpenAI то, что нужно для
                    ответа: запрос, план, учебный прогресс и цели
                  </li>
                  <li className="rounded-2xl bg-[var(--color-surface)] px-4 py-3">
                    разрешаешь учёт активности для твоей статистики и достижений
                  </li>
                </ul>
                <p className="mt-4 text-[13px] leading-snug text-[var(--color-muted)]">
                  Любую часть можно выключить в профиле, в разделе «Мой ритм и
                  достижения».
                </p>
                <button
                  type="button"
                  onClick={later}
                  disabled={consentBusy}
                  className="mt-3 self-start pb-2 text-[14px] text-[var(--color-muted)] underline underline-offset-4"
                >
                  Решу позже
                </button>
              </div>
            </Step>
          )}
        </>
      </div>

      {/* Навигация — прилипает к низу поверх контента, с фоном и safe-area */}
      <div className="sticky bottom-0 -mx-4 mt-auto flex items-center gap-3 bg-[var(--color-bg)] px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
        {step > 0 && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={back}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-surface)] text-[var(--color-fg-dim)] transition hover:text-[var(--color-fg)]"
            aria-label="Назад"
          >
            ‹
          </motion.button>
        )}
        <motion.button
          whileTap={{ scale: 0.97 }}
          disabled={!canNext || consentBusy}
          onClick={next}
          className="h-14 flex-1 rounded-2xl bg-[var(--color-fg)] text-[16px] font-semibold text-[var(--color-bg)] transition hover:opacity-90 disabled:opacity-40"
        >
          {step === 0
            ? "Начать"
            : step === CONSENT_STEP && askConsent
              ? consentBusy
                ? "Сохраняем…"
                : "Принять и начать"
              : step === STEPS - 1
                ? "Погнали"
                : "Далее"}
        </motion.button>
      </div>

    </div>
  );
}

function Step({ children }: { children: React.ReactNode }) {
  return <div className="absolute inset-0 flex flex-col">{children}</div>;
}
