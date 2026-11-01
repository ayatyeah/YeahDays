"use client";
import { useCopy } from "@/i18n/useCopy";

import { useT } from "@/i18n/useT";
import { useRef, useState } from "react";
import Link from "next/link";
import { taskLearningHref } from "@/lib/dayFlow";
import dynamic from "next/dynamic";
const HomeSection = dynamic(() => import("./HomeSection"), { ssr: false });
import NextStep from "@/components/dayflow/NextStep";
import { haptic } from "@/lib/motion";
import DaySupport from "@/components/mono/DaySupport";
import { TodayPrimeHeader, TodayPrimeLevel, TodayPrimeLearning } from "@/components/dayflow/TodayPrime";
import TodoList from "@/components/TodoList";
import PlanItem from "@/components/PlanItem";
const TimelineSchedule = dynamic(() => import("@/components/TimelineSchedule"), { ssr: false });
const ClassesSetup = dynamic(() => import("@/components/ClassesSetup"), { ssr: false });
import ReminderNudge from "@/components/ReminderNudge";
import Challenges from "@/components/Challenges";
import EveningRetro from "@/components/EveningRetro";
import LevelUpOverlay from "@/components/LevelUpOverlay";
import DayCompleteOverlay from "@/components/DayCompleteOverlay";
import TodaySkeleton from "@/components/dayflow/TodaySkeleton";
import { YgIcon } from "@/components/yg-icons";
import {
  useUserStore,
  useHydrated,
  selectToday,
  isTodoOnDay,
  isTodoDone,
  isTodoOverdue,
} from "@/store/useUserStore";
import { dateKey } from "@/lib/domain";
import { trackEvent } from "@/lib/api";
import { track } from "@/lib/analytics";
import { useNavStore } from "@/store/useNavStore";

export default function TodaySection() {
  const tx = useCopy();
  const msg = useT();
  const hydrated = useHydrated();
  const store = useUserStore();
  const go = useNavStore((s) => s.go);
  const planning = useRef<HTMLDetailsElement>(null);
  const [toolsReady, setToolsReady] = useState(false);
  const [discoveryReady, setDiscoveryReady] = useState(false);
  function openPlanning() {
    if (!planning.current) return;
    planning.current.open = true;
    planning.current
      .querySelector<HTMLInputElement>("input[data-quick-todo]")
      ?.focus();
    planning.current.scrollIntoView({ block: "nearest", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [smallStep, setSmallStep] = useState("");
  const [receipt, setReceipt] = useState<{
    id: string;
    title: string;
    kind: "todo" | "plan";
  } | null>(null);
  const [showDone, setShowDone] = useState(true);
  const day = dateKey();
  const planned = selectToday(store.plan);
  const personal = store.todos.filter(
    (t) => isTodoOnDay(t, day) || isTodoOverdue(t, day),
  );
  const completed =
    planned.filter((t) => t.completed).length +
    personal.filter((t) => isTodoDone(t, day)).length;
  const count = planned.length + personal.length;
  function togglePlan(id: string) {
    const task = planned.find((t) => t.id === id);
    store.toggleTask(id);
    if (task && !task.completed) {
      setReceipt({ id, title: task.snapshot.title, kind: "plan" });
      haptic("success");
      track("action_completed", {
        category: task.snapshot.category,
        xp: task.xp,
      });
      trackEvent({
        type: "complete",
        actionId: task.actionId,
        at: Date.now(),
        category: task.snapshot.category,
        xp: task.xp,
      });
    }
  }
  function togglePersonal(id: string) {
    const task = personal.find((t) => t.id === id);
    if (!task) return;
    const done = isTodoDone(task, day);
    store.toggleTodo(id, day);
    setReceipt(done ? null : { id, title: task.title, kind: "todo" });
    if (!done) {
      setSelectedTask(null);
      haptic("success");
    }
  }
  function openTask(id: string) {
    setSelectedTask(id);
    setSmallStep("");
    requestAnimationFrame(() => document.getElementById("flow-task")?.scrollIntoView({
      block: "nearest", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    }));
  }
  const focused = personal.find(
    (t) => t.id === selectedTask && !isTodoDone(t, day),
  );
  const focusedPlan = planned.find(
    (t) => t.id === selectedTask && !t.completed,
  );
  if (!hydrated) return <TodaySkeleton />;
  return (
    <div className="companion-today prime-today">
      <TodayPrimeHeader completed={completed} count={count} />
      <NextStep onTask={openTask} onCreate={openPlanning} />
      <TodayPrimeLevel />
      <section className="prime-plan" aria-label={msg("prime.plan")}>
      {focusedPlan && (
        <section id="flow-task" className="flow-task-detail">
          <h2>{focusedPlan.snapshot.title}</h2>
          <p>{focusedPlan.snapshot.why}</p>
          <div className="flow-actions">
            <button
              className="flow-primary"
              onClick={() => {
                togglePlan(focusedPlan.id);
                setSelectedTask(null);
              }}
            >{tx("Дело выполнено")}</button>
            <button onClick={() => setSelectedTask(null)}>{tx("Вернуться к плану")}</button>
          </div>
        </section>
      )}
      {focused && (
        <section
          id="flow-task"
          className="flow-task-detail"
          aria-label={tx("Один шаг за раз")}
        >
          <h2>{focused.title}</h2>
          {taskLearningHref(focused.note) && (
            <Link
              className="flow-primary"
              href={taskLearningHref(focused.note)!}
            >{tx("Продолжить учёбу")}</Link>
          )}
          <p>{tx("Слишком большое дело? Запиши только первый маленький шаг.")}</p>
          {focused.subtasks.map((sub) => (
            <label key={sub.id}>
              <input
                type="checkbox"
                checked={sub.done}
                onChange={() =>
                  store.updateTodo(focused.id, {
                    subtasks: focused.subtasks.map((s) =>
                      s.id === sub.id ? { ...s, done: !s.done } : s,
                    ),
                  })
                }
              />
              {sub.title}
            </label>
          ))}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!smallStep.trim()) return;
              store.updateTodo(focused.id, {
                subtasks: [
                  ...focused.subtasks,
                  {
                    id: crypto.randomUUID(),
                    title: smallStep.trim(),
                    done: false,
                  },
                ],
              });
              setSmallStep("");
            }}
          >
            <input
              type="text"
              aria-label={tx("Первый маленький шаг")}
              placeholder={tx("Что можно сделать за пару минут?")}
              maxLength={200}
              value={smallStep}
              onChange={(e) => setSmallStep(e.target.value)}
            />
            <button type="submit">{tx("Добавить шаг")}</button>
          </form>
          <div className="flow-actions">
            <button
              className="flow-primary"
              onClick={() => togglePersonal(focused.id)}
            >{tx("Дело выполнено")}</button>
            <button onClick={() => setSelectedTask(null)}>{tx("Вернуться к плану")}</button>
          </div>
        </section>
      )}
      <div className="companion-day-layout">
        <div>
          <header className="companion-today-heading">
            <h2 data-no-i18n>{msg("prime.plan")}</h2>
            <button
              className="mono-add"
              onClick={openPlanning}
              aria-label={tx("Добавить задачу")}
            >
              +
            </button>
          </header>
          <div className="companion-task-list">
            {personal
              .filter((t) => showDone || !isTodoDone(t, day))
              .map((t, i) => (
                <div className={`companion-task tone-${i % 3}`} key={t.id}>
                  <button
                    className="companion-check"
                    aria-label={tx("{0}: {1}", {"0": isTodoDone(t, day) ? tx("Вернуть") : tx("Выполнить"), "1": t.title})}
                    aria-pressed={isTodoDone(t, day)}
                    onClick={() => togglePersonal(t.id)}
                  >
                    {isTodoDone(t, day) && <YgIcon name="check" />}
                  </button>
                  <span
                    className={isTodoDone(t, day) ? "companion-task-done" : ""}
                  >
                    <b>{t.title}</b>
                    <small>
                      {isTodoOverdue(t, day) ? tx("Просрочено · ") : ""}
                      {t.duration ? tx("{0} мин · ", {"0": t.duration}) : ""}
                      {t.subtasks.length
                        ? tx("{0}/{1} шагов", {"0": t.subtasks.filter((s) => s.done).length, "1": t.subtasks.length})
                        : tx("Твой маленький шаг")}
                    </small>
                  </span>
                  {!isTodoDone(t, day) && <button className="prime-task-open" aria-label={msg("prime.openTask", { title: t.title })} onClick={() => openTask(t.id)}><YgIcon name="chevron" /></button>}
                </div>
              ))}
            {planned
              .filter((t) => showDone || !t.completed)
              .map((t, i) => (
                <div
                  className={`companion-task tone-${(i + 1) % 3}`}
                  key={t.id}
                >
                  <button
                    className="companion-check"
                    aria-label={tx("{0}: {1}", {"0": t.completed ? tx("Вернуть") : tx("Выполнить"), "1": t.snapshot.title})}
                    aria-pressed={t.completed}
                    onClick={() => togglePlan(t.id)}
                  >
                    {t.completed && <YgIcon name="check" />}
                  </button>
                  <span className={t.completed ? "companion-task-done" : ""}>
                    <b>{t.snapshot.title}</b>
                    <small>{t.xp}{tx(" XP · из колоды")}</small>
                  </span>
                  {!t.completed && <button className="prime-task-open" aria-label={msg("prime.openTask", { title: t.snapshot.title })} onClick={() => openTask(t.id)}><YgIcon name="chevron" /></button>}
                </div>
              ))}
            {count === 0 && (
              <button className="companion-empty" onClick={() => go("home")}>
                <YgIcon name="cards" />
                <b>{tx("С чего начнём?")}</b>
                <span>{tx("Подбери первое действие под свою энергию")}</span>
              </button>
            )}
            {count > 0 && completed === count && !showDone && (
              <p className="companion-success">{tx("Всё на сегодня сделано. Можно выдохнуть.")}</p>
            )}
          </div>
          <section className="companion-day-meter">
            <div>
              <b>{tx("Твой день")}</b>
              <span>
                {completed}{tx(" из ")}{count}
              </span>
            </div>
            <progress
              aria-label={tx("Выполнение плана дня")}
              value={completed}
              max={count || 1}
            />
            {completed > 0 && (
              <button onClick={() => setShowDone((v) => !v)}>
                {showDone ? tx("Скрыть выполненное") : tx("Показать выполненное")}
              </button>
            )}
          </section>
      {receipt && (
        <section className="flow-result" aria-label={tx("Результат действия")}>
          <div role="status">
            <h2>{tx("Ещё один шаг готов")}</h2>
            <p>{receipt.title}</p>
            <p>
              {completed === count
                ? tx("На сегодня достаточно. Можно отдохнуть.")
                : tx("Можно продолжить или сделать паузу — результат уже в плане.")}
            </p>
          </div>
          <div className="flow-actions">
            <button
              onClick={() => {
                if (receipt.kind === "todo") {
                  const task = store.todos.find((t) => t.id === receipt.id);
                  if (task && isTodoDone(task, day))
                    store.toggleTodo(receipt.id, day);
                } else if (
                  planned.some((t) => t.id === receipt.id && t.completed)
                )
                  store.toggleTask(receipt.id);
                setReceipt(null);
              }}
            >{tx("Отменить выполнение")}</button>
            <button onClick={() => setReceipt(null)}>{tx("Продолжить день")}</button>
          </div>
        </section>
      )}
          <TodayPrimeLearning />
          <Link prefetch={false} className="prime-community" href="/community" data-no-i18n><YgIcon name="chat" />{msg("nav.community")}<YgIcon name="chevron" /></Link>
          {/* Просьба включить напоминания — сразу под списком, а не в
              свёрнутых «Расписании и инструментах»: она появляется, только
              когда впереди есть дело со временем, и там её никто не видел. */}
          <ReminderNudge />
          <DaySupport />
          <details ref={planning} className="companion-planning">
            <summary>{tx("Добавить или изменить задачи")}</summary>
            <TodoList />
            {planned.length > 0 && (
              <div className="space-y-2">
                {planned.map((t) => (
                  <PlanItem
                    key={t.id}
                    task={t}
                    onToggle={togglePlan}
                    onRemove={store.removeTask}
                  />
                ))}
              </div>
            )}
          </details>
        </div>
        <aside className="companion-day-aside">
          <details className="companion-planning" onToggle={e => { if (e.currentTarget.open) setToolsReady(true); }}>
            <summary>{tx("Расписание и инструменты")}</summary>
            {toolsReady && <ClassesSetup />}
            <div className="companion-quick-links">
              <Link prefetch={false} href="/calendar">{tx("Календарь")}</Link>
              <Link prefetch={false} href="/chat">{tx("ИИ-помощник")}</Link>
              <Link prefetch={false} href="/app">{tx("Колода действий")}</Link>
            </div>
            {toolsReady && <TimelineSchedule compact />}
          </details>
          <Challenges />
          <EveningRetro />
        </aside>
      </div>
      </section>
      <details className="one-action-discovery" onToggle={e => { if (e.currentTarget.open) setDiscoveryReady(true); }}>
        <summary data-no-i18n>{msg("flow.discover")}</summary>
        {discoveryReady && <HomeSection embedded />}
      </details>
      <LevelUpOverlay />
      <DayCompleteOverlay />
    </div>
  );
}
