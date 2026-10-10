"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  useUserStore,
  selectToday,
  isTodoDone,
  isTodoOnDay,
} from "@/store/useUserStore";
import { useLearningStore } from "@/store/useLearningStore";
import { currentSlot } from "@/lib/domain";
import {
  dayContext,
  chooseStudy,
  lessonVisitKey,
  readVisitTimes,
  taskLearningHref,
  type StudyChoice,
} from "@/lib/dayFlow";
import { learningVisitKey } from "@/lib/learningEvents";
import { useNavStore } from "@/store/useNavStore";
import "./dayflow.css";
export default function NextStep({
  onTask,
  onCreate,
}: {
  onTask: (id: string) => void;
  onCreate: () => void;
}) {
  const owner = useSession().data?.user?.id;
  const todos = useUserStore((s) => s.todos),
    energy = useUserStore((s) => s.energyProfile[currentSlot()]);
  const planned = useUserStore((s) => s.plan);
  const learning = useLearningStore((s) => (s.owner === owner ? s.data : null));
  const learningLoading = useLearningStore(
    (s) => s.owner === owner && s.loading,
  );
  const active = useNavStore((s) => s.tab === "today");
  const [minutes, setMinutes] = useState(25),
    [now, setNow] = useState(() => new Date());
  const [catalog, setCatalog] = useState<{
    owner: string;
    events: { id: string; title: string; course: string }[];
  } | null>(null);
  const [visits, setVisits] = useState<Record<string, number>>({});
  const [studyVisits, setStudyVisits] = useState<Record<string, number>>({});
  useEffect(() => {
    if (!active) return;
    const update = () => setNow(new Date());
    update();
    const timer = setInterval(update, 30000);
    window.addEventListener("focus", update);
    return () => {
      clearInterval(timer);
      window.removeEventListener("focus", update);
    };
  }, [active]);
  useEffect(() => {
    setVisits({});
    setStudyVisits({});
    if (!owner || !active) return;
    try {
      setVisits(readVisitTimes(localStorage.getItem(learningVisitKey(owner))));
      setStudyVisits(
        readVisitTimes(localStorage.getItem(lessonVisitKey(owner))),
      );
    } catch {}
  }, [owner, active]);
  useEffect(() => {
    setCatalog(null);
    if (!owner) return;
    const controller = new AbortController();
    fetch("/api/day-context", { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : []))
      .then((events) => setCatalog({ owner, events }))
      .catch(() => {});
    return () => controller.abort();
  }, [owner]);
  const ctx = dayContext(todos, now, minutes, energy);
  const studies: StudyChoice[] = (learning?.skills ?? []).flatMap((s) => {
    const q = s.quests.find((q) => !q.completed);
    return q
      ? [
          {
            id: s.id,
            title: q.title,
            detail: s.title,
            href: `/learn?view=lesson&skill=${encodeURIComponent(s.id)}&quest=${encodeURIComponent(q.id)}`,
            minutes: s.minutes,
            visited: studyVisits[s.id] ?? 0,
          },
        ]
      : [];
  });
  // Event links resume through their own route map; don't pretend to restore an unfinished quiz.
  for (const e of catalog && catalog.owner === owner ? catalog.events : [])
    if (visits[e.id])
      studies.push({
        id: e.id,
        title: e.course,
        detail: e.title,
        href: `/events/${encodeURIComponent(e.id)}`,
        minutes: 10,
        visited: visits[e.id],
      });
  const study = chooseStudy(studies, ctx.budget, ctx.deadline?.title);
  const urgent =
    ctx.task && (ctx.task.priority === "high" || ctx.task.date < ctx.day);
  const todayPlan = selectToday(planned);
  const deck = todayPlan.find((t) => !t.completed);
  const task = urgent || !study ? ctx.task : undefined;
  const deckTask = !task && !study ? deck : undefined;
  const allDone =
    !ctx.task &&
    !deck &&
    (todayPlan.length > 0 || todos.some((t) => isTodoOnDay(t, ctx.day))) &&
    todos
      .filter((t) => isTodoOnDay(t, ctx.day))
      .every((t) => isTodoDone(t, ctx.day));
  const lessonHref = taskLearningHref(ctx.current?.note ?? task?.note);
  const occupied = !!ctx.current || ctx.budget < 5;
  const waiting = learningLoading && !task && !deckTask && !study && !occupied;
  return (
    <section className="flow-next" aria-label="Следующий шаг">
      <div className="flow-topline">
        <span>СЕЙЧАС ДЛЯ ТЕБЯ</span>
        <Link href="/calendar">Расписание</Link>
      </div>
      <fieldset className="flow-time">
        <legend>Сколько времени есть?</legend>
        {[5, 15, 25].map((n) => (
          <button
            key={n}
            type="button"
            aria-pressed={minutes === n}
            onClick={() => setMinutes(n)}
          >
            {n} <span>мин</span>
          </button>
        ))}
      </fieldset>
      <div className="flow-suggestion" aria-live="polite">
        <small>
          {occupied
            ? "В расписании сейчас занятие"
            : energy === "low"
              ? "Спокойный темп — короткий шаг"
              : ctx.next
                ? "До следующего дела есть окно"
                : "Один понятный шаг"}
        </small>
        <h2>
          {waiting
            ? "Загружаем учебный прогресс…"
            : occupied
              ? (ctx.current?.title ?? ctx.next?.title)
              : task
                ? task.title
                : study
                  ? study.title
                  : deckTask
                    ? deckTask.snapshot.title
                    : allDone
                      ? "На сегодня достаточно"
                      : "Начнём с одного дела"}
        </h2>
        <p>
          {occupied
            ? "Не добавляем новую нагрузку. Вернись после занятия."
            : task
              ? task.duration && task.duration > ctx.budget
                ? "Слишком большое дело? Запиши только первый маленький шаг."
                : urgent
                  ? "Это дело требует внимания. Начни с первого небольшого шага."
                  : "Выбрано из твоего плана с учётом доступного времени."
              : study
                ? study.detail
                : deckTask
                  ? "Начни с одного небольшого дела"
                  : allDone
                    ? "На сегодня достаточно. Можно отдохнуть."
                    : "Добавь то, что действительно хочешь сделать сегодня. Одного дела достаточно."}
        </p>
        {ctx.next && !occupied && (
          <p className="flow-context">
            Далее: {ctx.next.title} · {String(ctx.next.hour).padStart(2, "0")}:
            {String(ctx.next.minute ?? 0).padStart(2, "0")}
          </p>
        )}
        {waiting ? (
          <button className="flow-primary" disabled aria-busy="true">
            Загружаем учебный прогресс…
          </button>
        ) : lessonHref ? (
          <Link className="flow-primary" href={lessonHref}>
            Продолжить учёбу
          </Link>
        ) : occupied ? (
          <Link className="flow-primary" href="/calendar">
            Открыть расписание
          </Link>
        ) : task ? (
          <button className="flow-primary" onClick={() => onTask(task.id)}>
            Начать с этого
          </button>
        ) : study ? (
          <Link className="flow-primary" href={study.href}>
            Продолжить учёбу
          </Link>
        ) : deckTask ? (
          <button className="flow-primary" onClick={() => onTask(deckTask.id)}>
            Начать с этого
          </button>
        ) : allDone ? (
          <Link className="flow-primary" href="/progress">
            Посмотреть прогресс
          </Link>
        ) : (
          <button className="flow-primary" onClick={onCreate}>
            Добавить первое дело
          </button>
        )}
        {study && !task && !occupied && (
          <small>
            {study.href.startsWith("/events/")
              ? "Откроем твой учебный маршрут"
              : "Продолжим с незавершённого квеста"}
          </small>
        )}
      </div>
      {ctx.deadline && (
        <Link className="flow-deadline" href="/calendar">
          <span>Ближайший срок</span>
          <b>{ctx.deadline.title}</b>
          <time>{ctx.deadline.date}</time>
        </Link>
      )}
    </section>
  );
}
