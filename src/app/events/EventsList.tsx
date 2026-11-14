"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { EventCourse } from "@/lib/events/courses";
import styles from "./courses.module.css";
import { useSession } from "next-auth/react";
import { completedFrom, readinessFrom, type StepMeta } from "@/lib/events/engine";
import { preloadEvent } from "@/lib/events/client";
import { loadProgress } from "@/lib/events/storage";

/** Всё, что нужно карточке ивента, — без конспектов и вопросов (их ~6 МБ на все курсы). */
export interface EventSummary {
  id: string;
  title: string;
  course: string;
  description: string;
  lectures: number;
  parts: number;
  questions: number;
  mocks: number;
  practice: boolean;
  steps: StepMeta[];
  independentProgress?: boolean;
  workedSolutions?: number;
}

/**
 * Список ивентов раздела «Учёба». Ивенты общие для всех; у каждого человека
 * свой прогресс — он подставляется уже в браузере, поэтому до загрузки
 * показываем карточки без процентов, а не нули.
 */
export default function EventsList({ events, course }: { events: EventSummary[]; course: EventCourse }) {
  const { data } = useSession();
  const userId = data?.user?.id;
  const [percent, setPercent] = useState<Record<string, { percent: number; done: number; total: number; earned: boolean }>>({});

  useEffect(() => {
    if (!userId) return;
    setPercent(Object.fromEntries(events.filter(e => !e.independentProgress).map((e) => { const p = loadProgress(userId, e.id); return [e.id, { ...readinessFrom(e.steps, p), earned: completedFrom(e.steps, p) }]; })));
  }, [userId, events]);

  return (
    <div lang="en" data-no-i18n className="yg-stagger mx-auto w-full max-w-3xl space-y-5 pb-6">
      <header>
        <Link href="/events" className="text-sm underline">← All courses</Link>
        <div className={styles.courseHeading}><Image src={course.logo} width={72} height={72} alt="" /><div><h1 lang="en">{course.title}</h1><p>Choose a revision event or a practice session.</p></div></div>
      </header>

      {/* ивенты «только по ссылке» в списке не показываем (см. StudyEvent.unlisted); свежие — сверху */}
      {events.map((event) => {
        const { questions, parts } = event;
        const mine = percent[event.id];
        return (
          <Link
            key={event.id}
            // чанк ивента начинает грузиться ещё до перехода — при наведении или касании
            onPointerEnter={() => preloadEvent(event.id)}
            onTouchStart={() => preloadEvent(event.id)}
            href={`/events/${event.id}`}
            data-event-card
            className="f-event-card"
          >
            <p className="text-xs text-[var(--color-muted)]">{event.course}</p>
            <h2 className="mt-3 text-2xl font-bold">{event.title}</h2>
            <p className="mt-2 text-sm leading-relaxed">{event.description}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              {event.mocks > 0 && <span className="rounded-xl bg-sky-500/15 px-3 py-2 font-semibold">{event.mocks} practice variants</span>}
              {event.practice && <span className="rounded-xl bg-amber-500/15 px-3 py-2 font-semibold">Practice: drills, debugging and sandbox</span>}
              {event.lectures > 0 && <span className="rounded-xl bg-[var(--color-bg)] px-3 py-2">{event.lectures} lectures</span>}
              {event.workedSolutions && <span className="rounded-xl bg-[var(--color-bg)] px-3 py-2">{event.workedSolutions} worked examples</span>}
              <span className="rounded-xl bg-[var(--color-bg)] px-3 py-2">{parts} parts</span>
              <span className="rounded-xl bg-[var(--color-bg)] px-3 py-2">{questions} {event.workedSolutions ? "worked subparts" : "questions"}</span>
              {!event.independentProgress && <span className="rounded-xl bg-[var(--color-bg)] px-3 py-2">{event.steps.length} steps</span>}
            </div>
            {mine && (
              <div className="mt-4">
                <div className="flex justify-between text-sm">
                  <span>{mine.done ? `${mine.done} of ${mine.total} steps completed` : "Not started yet"}</span>
                  <strong>{mine.earned ? "Completed · " : ""}Readiness {mine.percent}%</strong>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--color-surface-2)]">
                  <div className="h-full rounded-full bg-violet-400" style={{ width: `${mine.percent}%` }} />
                </div>
              </div>
            )}
            <p className="mt-4 font-semibold">{mine?.done ? "Continue →" : "Start →"}</p>
          </Link>
        );
      })}
    </div>
  );
}
