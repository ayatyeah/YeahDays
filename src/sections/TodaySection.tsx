"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import DaySupport from "@/components/mono/DaySupport";
import CompanionHeader from "@/components/companion/CompanionHeader";
import TodoList from "@/components/TodoList";
import PlanItem from "@/components/PlanItem";
import TimelineSchedule from "@/components/TimelineSchedule";
import ClassesSetup from "@/components/ClassesSetup";
import ReminderNudge from "@/components/ReminderNudge";
import Challenges from "@/components/Challenges";
import EveningRetro from "@/components/EveningRetro";
import LevelUpOverlay from "@/components/LevelUpOverlay";
import DayCompleteOverlay from "@/components/DayCompleteOverlay";
import { LogoLoader } from "@/components/Logo";
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
  const hydrated = useHydrated();
  const store = useUserStore();
  const go = useNavStore((s) => s.go);
  const planning = useRef<HTMLDetailsElement>(null);
  function openPlanning() {
    if (!planning.current) return;
    planning.current.open = true;
    planning.current
      .querySelector<HTMLInputElement>(
        'input[data-quick-todo]',
      )
      ?.focus();
    planning.current.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }
  const [showDone, setShowDone] = useState(false);
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
  if (!hydrated) return <LogoLoader />;
  return (
    <div className="companion-today">
      <CompanionHeader completed={completed} count={count} />
      <div className="companion-day-layout">
        <div>
          <header className="companion-today-heading">
            <h2>Мой план</h2>
            <button
              className="mono-add"
              onClick={openPlanning}
              aria-label="Добавить задачу"
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
                    aria-label={`${isTodoDone(t, day) ? "Вернуть" : "Выполнить"}: ${t.title}`}
                    aria-pressed={isTodoDone(t, day)}
                    onClick={() => store.toggleTodo(t.id, day)}
                  >
                    {isTodoDone(t, day) && <YgIcon name="check" />}
                  </button>
                  <span
                    className={isTodoDone(t, day) ? "companion-task-done" : ""}
                  >
                    <b>{t.title}</b>
                    <small>
                      {isTodoOverdue(t, day) ? "Просрочено · " : ""}
                      {t.duration ? `${t.duration} мин · ` : ""}
                      {t.subtasks.length
                        ? `${t.subtasks.filter((s) => s.done).length}/${t.subtasks.length} шагов`
                        : "Твой маленький шаг"}
                    </small>
                  </span>
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
                    aria-label={`${t.completed ? "Вернуть" : "Выполнить"}: ${t.snapshot.title}`}
                    aria-pressed={t.completed}
                    onClick={() => togglePlan(t.id)}
                  >
                    {t.completed && <YgIcon name="check" />}
                  </button>
                  <span className={t.completed ? "companion-task-done" : ""}>
                    <b>{t.snapshot.title}</b>
                    <small>{t.xp} XP · из колоды</small>
                  </span>
                </div>
              ))}
            {count === 0 && (
              <button className="companion-empty" onClick={() => go("home")}>
                <YgIcon name="cards" />
                <b>С чего начнём?</b>
                <span>Подбери первое действие под свою энергию</span>
              </button>
            )}
            {count > 0 && completed === count && !showDone && (
              <p className="companion-success">
                Всё на сегодня сделано. Можно выдохнуть.
              </p>
            )}
          </div>
          <section className="companion-day-meter">
            <div>
              <b>Твой день</b>
              <span>
                {completed} из {count}
              </span>
            </div>
            <progress
              aria-label="Выполнение плана дня"
              value={completed}
              max={count || 1}
            />
            {completed > 0 && (
              <button onClick={() => setShowDone((v) => !v)}>
                {showDone ? "Скрыть выполненное" : "Показать выполненное"}
              </button>
            )}
          </section>
          <DaySupport />
          <details ref={planning} className="companion-planning">
            <summary>Добавить или изменить задачи</summary>
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
          <details className="companion-planning">
            <summary>Расписание и инструменты</summary>
            <ClassesSetup />
            <ReminderNudge />
            <div className="companion-quick-links">
              <Link href="/calendar">Календарь</Link>
              <Link href="/chat">ИИ-помощник</Link>
              <Link href="/app">Колода действий</Link>
            </div>
            <TimelineSchedule compact />
          </details>
          <Challenges />
          <EveningRetro />
        </aside>
      </div>
      <LevelUpOverlay />
      <DayCompleteOverlay />
    </div>
  );
}
