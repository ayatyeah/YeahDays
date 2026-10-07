"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { EVENTS } from "@/lib/events";
import { completed, readiness, steps } from "@/lib/events/engine";
import { loadProgress } from "@/lib/events/storage";

const plural = (n: number, one: string, few: string, many: string) => {
  const d = n % 10;
  const dd = n % 100;
  return d === 1 && dd !== 11 ? one : d >= 2 && d <= 4 && (dd < 12 || dd > 14) ? few : many;
};

/**
 * Список ивентов раздела «Учёба». Ивенты общие для всех; у каждого человека
 * свой прогресс — он подставляется уже в браузере, поэтому до загрузки
 * показываем карточки без процентов, а не нули.
 */
export default function EventsPage() {
  const { data } = useSession();
  const userId = data?.user?.id;
  const [percent, setPercent] = useState<Record<string, { percent: number; done: number; total: number; earned: boolean }>>({});

  useEffect(() => {
    if (!userId) return;
    setPercent(Object.fromEntries(EVENTS.map((e) => { const p = loadProgress(userId, e.id); return [e.id, { ...readiness(e, p), earned: completed(e, p) }]; })));
  }, [userId]);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-5 pb-6">
      <header>
        <Link href="/learn" className="text-sm underline">← Учёба</Link>
        <h1 className="ios-title mt-3">Ивенты</h1>
        <p className="mt-2 text-[var(--color-muted)]">Общие учебные программы: конспекты, квизы и оценка готовности. В каждом ивенте есть ИИ-помощник ✦ — он видит, что у тебя открыто, и помогает по просьбе.</p>
      </header>

      {/* ивенты «только по ссылке» в списке не показываем (см. StudyEvent.unlisted); свежие — сверху */}
      {EVENTS.filter((event) => !event.unlisted).reverse().map((event) => {
        const questions = event.lectures.reduce((n, l) => n + l.parts.reduce((m, p) => m + p.questions.length, 0), 0);
        const parts = event.lectures.reduce((n, l) => n + l.parts.length, 0);
        const mine = percent[event.id];
        return (
          <Link
            key={event.id}
            href={`/events/${event.id}`}
            className="block rounded-3xl border border-violet-400/30 bg-gradient-to-br from-violet-500/15 via-[var(--color-surface)] to-sky-500/10 p-5"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">{event.course}</p>
            <h2 className="mt-3 text-2xl font-bold">{event.title}</h2>
            <p className="mt-2 text-sm leading-relaxed">{event.description}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              {!!event.mocks?.length && <span className="rounded-xl bg-sky-500/15 px-3 py-2 font-semibold">{event.mocks.length} {plural(event.mocks.length, "пробный вариант", "пробных варианта", "пробных вариантов")}</span>}
              {event.practice === "vision" && <span className="rounded-xl bg-amber-500/15 px-3 py-2 font-semibold">Практикум: тренажёр, «Найди баг», песочница</span>}
              <span className="rounded-xl bg-[var(--color-bg)] px-3 py-2">{event.lectures.length} {plural(event.lectures.length, "лекция", "лекции", "лекций")}</span>
              <span className="rounded-xl bg-[var(--color-bg)] px-3 py-2">{parts} частей</span>
              <span className="rounded-xl bg-[var(--color-bg)] px-3 py-2">{questions} вопросов в банке</span>
              <span className="rounded-xl bg-[var(--color-bg)] px-3 py-2">{steps(event).length} шагов</span>
            </div>
            {mine && (
              <div className="mt-4">
                <div className="flex justify-between text-sm">
                  <span>{mine.done ? `Пройдено шагов: ${mine.done} из ${mine.total}` : "Ещё не начато"}</span>
                  <strong>{mine.earned ? "🏆 Пройден · " : ""}Готовность {mine.percent}%</strong>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--color-surface-2)]">
                  <div className="h-full rounded-full bg-violet-400" style={{ width: `${mine.percent}%` }} />
                </div>
              </div>
            )}
            <p className="mt-4 font-semibold">{mine?.done ? "Продолжить →" : "Начать →"}</p>
          </Link>
        );
      })}
    </div>
  );
}
