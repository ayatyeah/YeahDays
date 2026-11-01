"use client";
import { useT } from "@/i18n/useT";
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
import { currentSlot, type EnergyLevel } from "@/lib/domain";
import {
  dayContext,
  chooseStudy,
  lessonVisitKey,
  readVisitTimes,
  taskLearningHref,
  type StudyChoice,
} from "@/lib/dayFlow";
import { TODO_PRIORITY_XP } from "@/lib/todoCategory";
import { YgIcon } from "@/components/yg-icons";
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
  const t = useT();
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
  const duration = task ? task.duration : study ? study.minutes : deckTask?.snapshot.duration;
  const waiting = learningLoading && !task && !deckTask && !study && !occupied;
  return (
    <section data-no-i18n className="flow-next" aria-label={t("flow.next")} >
      <div className="flow-suggestion prime-hero" aria-live="polite">
        <div className="prime-hero-copy">
        <span className="prime-eyebrow">{t("prime.next")}</span>
        <h2>
          {waiting
            ? t("flow.loading")
            : occupied
              ? (ctx.current?.title ?? ctx.next?.title)
              : task
                ? task.title
                : study
                  ? study.title
                  : deckTask
                    ? deckTask.snapshot.title
                    : allDone
                      ? t("flow.done")
                      : t("flow.begin")}
        </h2>
        {(occupied || !task || urgent || (task.duration ?? 0) > ctx.budget) && <p>
          {occupied
            ? t("flow.rest")
            : task
              ? task.duration && task.duration > ctx.budget
                ? t("flow.large")
                : urgent
                  ? t("flow.urgent")
                  : t("prime.fromPlan")
              : study
                ? study.detail
                : deckTask
                  ? t("flow.small")
                  : allDone
                    ? t("flow.enough")
                    : t("flow.addHint")}
        </p>}
        {ctx.next && !occupied && (
          <p className="flow-context">
            {ctx.next.title} · {String(ctx.next.hour).padStart(2, "0")}:
            {String(ctx.next.minute ?? 0).padStart(2, "0")}
          </p>
        )}
        {!occupied && !!duration && <span className="prime-task-meta">
          {t("flow.minutes", { count: duration! })}
        </span>}
        {!occupied && (task || deckTask) && <span className="prime-reward"><YgIcon name="star" />+{task ? TODO_PRIORITY_XP[task.priority] : deckTask!.xp} XP</span>}
        </div>
        <div className="prime-hero-art" aria-hidden="true">
          {/* Existing 47 KB WebP, no image transformation or extra API request. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/characters/skins/scholar.webp" alt="" width={1024} height={1536} fetchPriority="high" />
        </div>
        {waiting ? (
          <button className="flow-primary" disabled aria-busy="true">
            {t("flow.loading")}
          </button>
        ) : lessonHref ? (
          <Link className="flow-primary" href={lessonHref}>
            {t("flow.continue")}
          </Link>
        ) : occupied ? (
          <Link className="flow-primary" href="/calendar">
            {t("flow.openSchedule")}
          </Link>
        ) : task ? (
          <button className="flow-primary" onClick={() => onTask(task.id)}>
            {t("flow.start")}
          </button>
        ) : study ? (
          <Link className="flow-primary" href={study.href}>
            {t("flow.continue")}
          </Link>
        ) : deckTask ? (
          <button className="flow-primary" onClick={() => onTask(deckTask.id)}>
            {t("flow.start")}
          </button>
        ) : allDone ? (
          <Link className="flow-primary" href="/progress">
            {t("flow.seeProgress")}
          </Link>
        ) : (
          <button className="flow-primary" onClick={onCreate}>
            {t("flow.add")}
          </button>
        )}
        {study && !task && !occupied && (
          <small>
            {study.href.startsWith("/events/")
              ? t("flow.route")
              : t("flow.resume")}
          </small>
        )}
      </div>
      <details className="prime-step-settings">
        <summary>{t("prime.settings")}</summary>
      <div className="polish-settings">
        <select aria-label={t("flow.energy")}  value={energy}
          onChange={(e) => useUserStore.getState().setSlotEnergy(currentSlot(), e.target.value as EnergyLevel)}>
          <option value="low">{t("flow.low")}</option>
          <option value="medium">{t("flow.medium")}</option>
          <option value="high">{t("flow.high")}</option>
        </select>
        <select aria-label={t("flow.time")}  value={minutes}
          onChange={(e) => setMinutes(Number(e.target.value))}>
          {[5, 15, 25].map((n) => <option key={n} value={n}>{t("flow.minutes", { count: n })}</option>)}
        </select>
      </div>
      </details>
      {ctx.deadline && (
        <Link className="flow-deadline" href="/calendar">
          <span>{t("flow.deadline")}</span>
          <b>{ctx.deadline.title}</b>
          <time>{ctx.deadline.date}</time>
        </Link>
      )}
    </section>
  );
}
