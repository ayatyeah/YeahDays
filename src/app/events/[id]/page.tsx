"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Button from "@/components/ui/Button";
import EventNotes from "@/components/EventNotes";
import { cn } from "@/lib/cn";
import { findEvent } from "@/lib/events";
import { draw, mergeProgress, nextStep, readiness, record, steps, type Progress, type QuizQuestion, type Step } from "@/lib/events/engine";
import EventMusic from "@/components/EventMusic";
import EventLeaderboard, { type LeaderRow } from "@/components/events/EventLeaderboard";
import EventPlan from "@/components/events/EventPlan";
import Flashcards from "@/components/events/Flashcards";
import NetworkGame from "@/components/events/NetworkGame";
import ReportQuestion from "@/components/events/ReportQuestion";
import ShareResult from "@/components/events/ShareResult";
import SpeakButton from "@/components/events/SpeakButton";
import { clearProgress, loadPref, loadProgress, savePref, saveProgress } from "@/lib/events/storage";
import type { Lang, StudyEvent } from "@/lib/events/types";
import { useContentLang } from "@/i18n/locale";

const panel = "rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5";
const percent = (value: number) => `${Math.round(value * 100)}%`;

type View =
  | { mode: "map" }
  | { mode: "sheet" }
  | { mode: "cards" }
  | { mode: "game" }
  | { mode: "read"; step: Step }
  | { mode: "quiz"; step: Step; quiz: QuizQuestion[]; run: number }
  | { mode: "result"; step: Step; quiz: QuizQuestion[]; answers: number[] };

/** Кто открывал ивент на этом устройстве в последний раз — для работы без сети. */
const LAST_USER = "yg-event-last-user";

export default function EventPage() {
  const { id } = useParams<{ id: string }>();
  const { data, status } = useSession();
  const event = findEvent(id);
  const [offlineUser, setOfflineUser] = useState<string | null>(null);

  useEffect(() => {
    const userId = data?.user?.id;
    try {
      if (userId) localStorage.setItem(LAST_USER, userId);
      // Без сети сессию не проверить. Ивент — статичный конспект и личные
      // результаты на этом же устройстве, поэтому пускаем того, кто был
      // здесь последним: ничего чужого он так не увидит.
      else if (status !== "loading" && !navigator.onLine) setOfflineUser(localStorage.getItem(LAST_USER));
    } catch {
      /* хранилище недоступно — офлайн-режима просто не будет */
    }
  }, [data?.user?.id, status]);

  // Прогреваем кэш воркера: переход внутри приложения не загружает страницу
  // как документ, и без этого в метро открылась бы заглушка «нет сети».
  useEffect(() => {
    if (!event || !data?.user?.id || !navigator.onLine) return;
    for (const url of ["/events", `/events/${event.id}`]) void fetch(url, { credentials: "same-origin" }).catch(() => {});
  }, [event, data?.user?.id]);

  if (!event) {
    return (
      <div className="mx-auto max-w-3xl space-y-3">
        <p>Такого ивента нет.</p>
        <Link href="/events" className="underline">← Все ивенты</Link>
      </div>
    );
  }
  if (status === "loading") return <p>Открываем ивент…</p>;
  const userId = data?.user?.id ?? offlineUser;
  if (!userId) return <Link href="/login" className="underline">Войти в аккаунт</Link>;
  return <Runner key={`${userId}:${event.id}`} event={event} userId={userId} />;
}

function Runner({ event, userId }: { event: StudyEvent; userId: string }) {
  const list = useMemo(() => steps(event), [event]);
  const tl = useContentLang();
  const [progress, setProgress] = useState<Progress>({});
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState<View>({ mode: "map" });
  const [lang, setLang] = useState<Lang>("en");
  const [music, setMusic] = useState(true);
  const top = useRef<HTMLDivElement>(null);
  // Номер попытки: по нему экран квиза сбрасывает ответы при повторе.
  const runs = useRef(0);
  const [online, setOnline] = useState(true);
  const [social, setSocial] = useState<{ share: boolean; leaderboard: LeaderRow[]; friends: number }>({ share: false, leaderboard: [], friends: 0 });
  // Самый свежий прогресс для фоновой синхронизации: ответ сервера может
  // прийти, когда человек уже прошёл следующий квиз.
  const latest = useRef<Progress>({});

  // Прогресс и настройки живут в браузере — читаем после монтирования, чтобы
  // серверная и клиентская разметка совпали.
  useEffect(() => {
    const local = loadProgress(userId, event.id);
    latest.current = local;
    setProgress(local);
    setLang(loadPref("lang", "en") === "ru" ? "ru" : "en");
    setMusic(loadPref("music", "on") !== "off");
    setLoaded(true);
    void sync();
    const onNetwork = () => {
      setOnline(navigator.onLine);
      // Сеть вернулась — отправляем то, что накопилось офлайн.
      if (navigator.onLine) void sync();
    };
    onNetwork();
    window.addEventListener("online", onNetwork);
    window.addEventListener("offline", onNetwork);
    return () => {
      window.removeEventListener("online", onNetwork);
      window.removeEventListener("offline", onNetwork);
    };
    // sync читает только refs и аргументы — пересоздавать подписку не нужно.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, event.id]);

  /** Принять ответ сервера: слить с тем, что есть здесь, и сохранить. */
  function adopt(body: { progress: Progress; share: boolean; leaderboard: LeaderRow[]; friends: number }) {
    const merged = mergeProgress(latest.current, body.progress);
    latest.current = merged;
    setProgress(merged);
    saveProgress(userId, event.id, merged);
    setSocial({ share: body.share, leaderboard: body.leaderboard, friends: body.friends });
    return merged;
  }

  /**
   * Синхронизация с сервером. Локальная копия остаётся главной для экрана:
   * без сети всё работает как раньше, а сервер нужен, чтобы прогресс был
   * на втором устройстве и в рейтинге друзей.
   */
  async function sync(share?: boolean) {
    try {
      const url = `/api/study-events/${event.id}`;
      let body;
      if (share === undefined) {
        const response = await fetch(url, { cache: "no-store" });
        if (!response.ok) return;
        body = await response.json();
        const merged = adopt(body);
        // На сервере меньше, чем здесь (занимались офлайн) — досылаем.
        if (JSON.stringify(merged) === JSON.stringify(body.progress)) return;
      }
      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progress: latest.current, ...(share === undefined ? {} : { share }) }),
      });
      if (response.ok) adopt(await response.json());
    } catch {
      /* нет сети — попробуем при следующем открытии или когда она вернётся */
    }
  }

  const stepKey = "step" in view ? `${view.mode}:${view.step.id}` : view.mode;
  useEffect(() => {
    top.current?.scrollIntoView({ block: "start" });
  }, [stepKey]);

  function switchLang() {
    const next: Lang = lang === "en" ? "ru" : "en";
    setLang(next);
    savePref("lang", next);
  }

  function toggleMusic() {
    const next = !music;
    setMusic(next);
    savePref("music", next ? "on" : "off");
  }

  // Плеер монтируется вместе с экраном квиза (см. EventMusic): это
  // происходит по нажатию кнопки, а значит браузер разрешит звук.
  function startQuiz(step: Step) {
    setView({ mode: "quiz", step, quiz: draw(event, step), run: ++runs.current });
  }

  function open(step: Step) {
    if (step.kind === "part") setView({ mode: "read", step });
    else startQuiz(step);
  }

  function finish(step: Step, quiz: QuizQuestion[], answers: number[]) {
    const next = record(progress, step, quiz, answers);
    latest.current = next;
    setProgress(next);
    saveProgress(userId, event.id, next);
    setView({ mode: "result", step, quiz, answers });
    void sync(social.share);
  }

  function toMap() {
    setView({ mode: "map" });
  }

  const ready = readiness(event, progress);
  const following = "step" in view ? list[list.findIndex((s) => s.id === view.step.id) + 1] : undefined;

  return (
    <div className="mx-auto w-full max-w-3xl space-y-5 pb-6">
      <div ref={top} />
      {view.mode === "map" && (
        <>
          <header>
            <Link href="/events" className="text-sm underline">← Ивенты</Link>
            <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">{event.course}</p>
            <h1 className="ios-title mt-2">{event.title}</h1>
            <p className="mt-2 text-sm text-[var(--color-muted)]">{event.description}</p>
          </header>
          {!online && (
            <p role="status" className="rounded-2xl border border-amber-400/40 bg-amber-500/10 p-3 text-sm">
              Нет сети. Конспекты и квизы работают, результаты сохраняются на устройстве и отправятся, когда появится интернет.
            </p>
          )}

          <section className="rounded-3xl border border-violet-400/30 bg-gradient-to-br from-violet-500/15 to-sky-500/10 p-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-widest">Готовность к квизу</p>
                <p className="mt-2 text-5xl font-bold tabular-nums">{loaded ? ready.percent : "…"}%</p>
              </div>
              <p className="text-sm">Шагов пройдено: {ready.done} из {ready.total}</p>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--color-surface-2)]">
              <div className="h-full rounded-full bg-violet-400" style={{ width: `${ready.percent}%` }} />
            </div>
            <dl className="mt-4 grid grid-cols-3 gap-2 text-sm">
              {[["Квизы по частям", ready.parts], ["Квизы по лекциям", ready.lectures], ["Итоговый квиз", ready.final]].map(([name, value]) => (
                <div key={name} className="rounded-2xl bg-[var(--color-bg)] p-3">
                  <dt className="text-xs text-[var(--color-muted)]">{name}</dt>
                  <dd className="mt-1 text-lg font-bold tabular-nums">{value}%</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-xs text-[var(--color-muted)]">
              Готовность = итоговый квиз (50%) + квизы по лекциям (30%) + квизы по частям (20%). Считается лучший результат; непройденный шаг — ноль.
            </p>
            <Verdict event={event} progress={progress} percent={ready.percent} />
            {loaded && (
              <Button variant="primary" className="mt-4 w-full" onClick={() => open(nextStep(event, progress) ?? list[list.length - 1])}>
                {ready.done === 0 ? "Начать с первой части" : ready.done === ready.total ? "Пройти итоговый квиз ещё раз" : "Продолжить"}
              </Button>
            )}
          </section>

          {event.lectures.map((lecture, li) => (
            <section key={lecture.id} className={panel}>
              <h2 className="text-lg font-bold">{lecture.title[tl]}</h2>
              {tl === "ru" && <p className="text-sm text-[var(--color-muted)]">{lecture.title.en}</p>}
              <ol className="mt-4 space-y-2">
                {list.filter((s) => s.lecture === li).map((step) => (
                  <StepRow key={step.id} step={step} result={progress[step.id]} onOpen={() => open(step)} />
                ))}
              </ol>
            </section>
          ))}

          <section className={panel}>
            <h2 className="text-lg font-bold">Финал</h2>
            <p className="text-sm text-[var(--color-muted)]">Вопросы вперемешку со всех лекций — как на настоящем квизе.</p>
            <ol className="mt-4 space-y-2">
              <StepRow step={list[list.length - 1]} result={progress[list[list.length - 1].id]} onOpen={() => open(list[list.length - 1])} />
            </ol>
          </section>

          {(event.cheatSheet || event.glossary) && (
            <section className={panel}>
              <h2 className="text-lg font-bold">Перед самым квизом</h2>
              <p className="text-sm text-[var(--color-muted)]">Короткое повторение, когда на лекции времени уже нет.</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {event.cheatSheet && <Button className="h-auto min-h-11 whitespace-normal" onClick={() => setView({ mode: "sheet" })}>Шпаргалка на одну страницу</Button>}
                {event.glossary && <Button className="h-auto min-h-11 whitespace-normal" onClick={() => setView({ mode: "cards" })}>Карточки терминов · {event.glossary.length}</Button>}
              </div>
            </section>
          )}

          {event.game && (
            <section className={cn(panel, "bg-gradient-to-br from-emerald-500/10 via-[var(--color-surface)] to-violet-500/10")}>
              <h2 className="text-lg font-bold">Игра</h2>
              <p className="text-sm text-[var(--color-muted)]">Перерыв от конспектов, но по теме: двоичный спринт на время и «Ты — коммутатор».</p>
              <Button variant="primary" className="mt-4 h-auto min-h-11 w-full whitespace-normal" onClick={() => setView({ mode: "game" })}>Открыть игры</Button>
            </section>
          )}

          {loaded && <EventPlan event={event} progress={progress} />}

          {loaded && (
            <EventLeaderboard
              board={social.leaderboard.some((r) => r.me) || ready.done === 0 ? social.leaderboard : [...social.leaderboard, { name: "Ты", percent: ready.percent, me: true }].sort((a, b) => b.percent - a.percent)}
              share={social.share}
              friends={social.friends}
              online={online}
              onShare={(share) => {
                setSocial((v) => ({ ...v, share }));
                void sync(share);
              }}
            />
          )}

          {ready.done > 0 && <ShareResult event={event} percent={ready.percent} done={ready.done} total={ready.total} />}

          {ready.done > 0 && (
            <Button
              variant="danger"
              className="h-auto min-h-11 whitespace-normal"
              disabled={!online}
              onClick={() => {
                if (!confirm("Сбросить все результаты этого ивента? Они удалятся и с других твоих устройств, и из рейтинга друзей.")) return;
                void fetch(`/api/study-events/${event.id}`, { method: "DELETE" })
                  .then((response) => {
                    if (!response.ok) throw new Error("reset");
                    clearProgress(userId, event.id);
                    latest.current = {};
                    setProgress({});
                    setSocial((v) => ({ ...v, share: false, leaderboard: v.leaderboard.filter((r) => !r.me) }));
                  })
                  .catch(() => alert("Не удалось сбросить прогресс. Проверь сеть и попробуй ещё раз."));
              }}
            >
              Сбросить прогресс
            </Button>
          )}
        </>
      )}

      {view.mode === "read" && (() => {
        const part = event.lectures[view.step.lecture!].parts[view.step.part!];
        return (
          <>
            <header>
              <button className="text-sm underline" onClick={toMap}>← К маршруту</button>
              <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">
                {event.lectures[view.step.lecture!].title[lang]} · часть {view.step.part! + 1} из {event.lectures[view.step.lecture!].parts.length}
              </p>
              <h1 className="mt-2 text-2xl font-bold">{part.title[lang]}</h1>
            </header>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" className="h-auto min-h-9 whitespace-normal" onClick={switchLang}>
                {lang === "en" ? "Перевести на русский" : "Показать оригинал (English)"}
              </Button>
              <SpeakButton text={part.notes[lang]} lang={lang} />
            </div>
            <article className={panel}>
              <EventNotes text={part.notes[lang]} lang={lang} />
            </article>
            <Button variant="primary" className="h-auto min-h-11 w-full whitespace-normal" onClick={() => startQuiz(view.step)}>
              Начать квиз по этой части · {view.step.count} вопросов
            </Button>
          </>
        );
      })()}

      {view.mode === "sheet" && event.cheatSheet && (
        <>
          <header>
            <button className="text-sm underline" onClick={toMap}>← К маршруту</button>
            <h1 className="mt-3 text-2xl font-bold">Шпаргалка</h1>
            <p className="mt-1 text-sm text-[var(--color-muted)]">Всё главное на одной странице — перечитать за пять минут до квиза.</p>
          </header>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" className="h-auto min-h-9 whitespace-normal" onClick={switchLang}>
              {lang === "en" ? "Перевести на русский" : "Показать оригинал (English)"}
            </Button>
            <SpeakButton text={event.cheatSheet[lang]} lang={lang} />
          </div>
          <article className={panel}>
            <EventNotes text={event.cheatSheet[lang]} lang={lang} />
          </article>
        </>
      )}

      {view.mode === "cards" && event.glossary && (
        <>
          <header>
            <button className="text-sm underline" onClick={toMap}>← К маршруту</button>
            <h1 className="mt-3 text-2xl font-bold">Карточки терминов</h1>
          </header>
          <Flashcards glossary={event.glossary} lang={lang} onLang={switchLang} />
        </>
      )}

      {view.mode === "game" && event.game && (
        <>
          <header>
            <button className="text-sm underline" onClick={toMap}>← К маршруту</button>
            <h1 className="mt-3 text-2xl font-bold">Игры</h1>
            <p className="mt-1 text-sm text-[var(--color-muted)]">Результаты игр не влияют на готовность — это тренировка.</p>
          </header>
          <NetworkGame userId={userId} />
        </>
      )}

      {view.mode === "quiz" && (
        <Quiz
          key={view.run}
          eventId={event.id}
          step={view.step}
          quiz={view.quiz}
          lang={lang}
          music={music}
          onLang={switchLang}
          onMusic={toggleMusic}
          onExit={() => {
            if (confirm("Выйти из квиза? Эта попытка не сохранится.")) toMap();
          }}
          onFinish={(answers) => finish(view.step, view.quiz, answers)}
        />
      )}

      {view.mode === "result" && (
        <Result
          event={event}
          step={view.step}
          quiz={view.quiz}
          answers={view.answers}
          lang={lang}
          best={progress[view.step.id]?.best ?? 0}
          readiness={ready.percent}
          following={following}
          onLang={switchLang}
          onRetry={() => startQuiz(view.step)}
          onReread={view.step.kind === "part" ? () => open(view.step) : undefined}
          onNext={following ? () => open(following) : undefined}
          onMap={toMap}
        />
      )}
    </div>
  );
}

/** Совет по итогам: что именно подтянуть, а не просто цифра. */
function Verdict({ event, progress, percent: value }: { event: StudyEvent; progress: Progress; percent: number }) {
  const tl = useContentLang();
  const final = progress[`${event.id}-final`];
  if (!final) return null;
  const weak = Object.entries(final.byLecture ?? {})
    .map(([li, [right, total]]) => ({ title: event.lectures[Number(li)].title[tl], share: total ? right / total : 1 }))
    .sort((a, b) => a.share - b.share)[0];
  const text = value >= 85 ? "Ты готов к квизу." : value >= 65 ? "Почти готов — повтори слабые места." : "Пока рано: пройди оставшиеся шаги и повтори квизы.";
  return (
    <p role="status" className="mt-3 rounded-2xl bg-[var(--color-bg)] p-3 text-sm">
      <strong>{text}</strong>
      {weak && weak.share < 1 && <> Слабее всего в последнем итоговом квизе: «{weak.title}» — {percent(weak.share)} верных.</>}
    </p>
  );
}

function StepRow({ step, result, onOpen }: { step: Step; result?: Progress[string]; onOpen: () => void }) {
  const tl = useContentLang();
  const label = step.kind === "part" ? `Часть ${step.part! + 1}. ${step.title[tl]}` : step.title[tl];
  return (
    <li>
      <button
        onClick={onOpen}
        className="flex w-full items-center justify-between gap-3 rounded-2xl border border-[var(--color-border)] p-3 text-left transition hover:bg-[var(--color-surface-2)]"
      >
        <span className="min-w-0">
          <span className={cn("block break-words text-sm", step.kind !== "part" && "font-semibold")}>{label}</span>
          <span className="block text-xs text-[var(--color-muted)]">
            {step.kind === "part" ? `конспект + квиз · ${step.count} вопросов` : `${step.count} вопросов`}
          </span>
        </span>
        <span
          className={cn(
            "shrink-0 rounded-full px-3 py-1 text-xs font-semibold tabular-nums",
            !result ? "bg-[var(--color-surface-2)] text-[var(--color-muted)]" : result.best >= 0.8 ? "bg-emerald-500/20" : "bg-amber-500/20",
          )}
        >
          {result ? percent(result.best) : "не пройдено"}
        </span>
      </button>
    </li>
  );
}

function Quiz({
  eventId, step, quiz, lang, music, onLang, onMusic, onExit, onFinish,
}: {
  eventId: string;
  step: Step;
  quiz: QuizQuestion[];
  lang: Lang;
  music: boolean;
  onLang: () => void;
  onMusic: () => void;
  onExit: () => void;
  onFinish: (answers: number[]) => void;
}) {
  const tl = useContentLang();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const item = quiz[index];
  const picked: number | undefined = answers[index];
  const answered = picked !== undefined;
  const feedback = useRef<HTMLDivElement>(null);

  // На телефоне объяснение и кнопка «Дальше» оказываются под длинными
  // вариантами, за краем экрана — подводим их в поле зрения сами.
  useEffect(() => {
    if (answered) feedback.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [answered, index]);

  return (
    <>
      <header className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <button className="text-sm underline" onClick={onExit}>← Выйти</button>
          <button
            className="rounded-full border border-[var(--color-border)] px-3 py-1.5 text-sm"
            aria-pressed={music}
            onClick={onMusic}
          >
            {music ? "♪ Музыка: вкл" : "♪ Музыка: выкл"}
          </button>
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">{step.title[tl]}</p>
        {music && <EventMusic />}
        <div className="flex items-center gap-3">
          <div
            className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--color-surface-2)]"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={quiz.length}
            aria-valuenow={index + (answered ? 1 : 0)}
          >
            <div className="h-full rounded-full bg-violet-400 transition-[width]" style={{ width: `${((index + (answered ? 1 : 0)) / quiz.length) * 100}%` }} />
          </div>
          <span className="shrink-0 text-sm tabular-nums">Вопрос {index + 1} из {quiz.length}</span>
        </div>
      </header>

      <section className={panel}>
        <h2 lang="en" className="text-lg font-semibold leading-snug">{item.q}</h2>
        <div className="mt-4 space-y-2">
          {item.options.map((option, i) => {
            const right = answered && i === item.correct;
            const wrong = answered && i === picked && i !== item.correct;
            return (
              <button
                key={i}
                lang="en"
                disabled={answered}
                aria-pressed={picked === i}
                onClick={() => setAnswers([...answers, i])}
                className={cn(
                  "block w-full rounded-2xl border p-3 text-left text-[15px] transition",
                  right ? "border-emerald-400 bg-emerald-500/15" : wrong ? "border-red-400 bg-red-500/15" : "border-[var(--color-border)]",
                  !answered && "hover:bg-[var(--color-surface-2)]",
                  answered && !right && !wrong && "opacity-60",
                )}
              >
                {right && "✓ "}{wrong && "✗ "}{option}
              </button>
            );
          })}
        </div>

        {answered && (
          <div ref={feedback} className="mt-4 scroll-mb-28 space-y-3">
            <div role="status" className="rounded-2xl bg-[var(--color-surface-2)] p-4 text-sm">
              <p className="font-semibold">{picked === item.correct ? "Верно" : "Неверно"}</p>
              <p className="mt-1" lang={lang}>{item.why[lang]}</p>
              <button className="mt-2 text-xs underline" onClick={onLang}>
                {lang === "en" ? "Объяснение на русском" : "Explanation in English"}
              </button>
              <ReportQuestion key={item.id} eventId={eventId} questionId={item.id} />
            </div>
            <Button
              variant="primary"
              className="w-full"
              onClick={() => (index + 1 === quiz.length ? onFinish(answers) : setIndex(index + 1))}
            >
              {index + 1 === quiz.length ? "Завершить квиз" : "Дальше"}
            </Button>
          </div>
        )}
      </section>
    </>
  );
}

function Result({
  event, step, quiz, answers, lang, best, readiness: ready, following, onLang, onRetry, onReread, onNext, onMap,
}: {
  event: StudyEvent;
  step: Step;
  quiz: QuizQuestion[];
  answers: number[];
  lang: Lang;
  best: number;
  readiness: number;
  following?: Step;
  onLang: () => void;
  onRetry: () => void;
  onReread?: () => void;
  onNext?: () => void;
  onMap: () => void;
}) {
  const tl = useContentLang();
  const mistakes = quiz.map((item, i) => ({ item, picked: answers[i] })).filter(({ item, picked }) => picked !== item.correct);
  const right = quiz.length - mistakes.length;
  const share = quiz.length ? right / quiz.length : 0;
  const perLecture = event.lectures.map((lecture, li) => {
    const mine = quiz.map((item, i) => ({ item, ok: answers[i] === item.correct })).filter(({ item }) => item.lecture === li);
    return { title: lecture.title[tl], right: mine.filter((x) => x.ok).length, total: mine.length };
  }).filter((x) => x.total > 0);

  return (
    <>
      <section className="rounded-3xl border border-violet-400/30 bg-gradient-to-br from-violet-500/15 to-sky-500/10 p-5">
        <p className="text-xs uppercase tracking-widest">{step.title[tl]}</p>
        <p className="mt-3 text-5xl font-bold tabular-nums">{percent(share)}</p>
        <p className="mt-2 text-sm">
          Верных ответов: {right} из {quiz.length} · лучший результат: {percent(best)}
        </p>
        <p className="mt-2 text-sm">
          {share >= 0.8 ? "Отлично — можно идти дальше." : share >= 0.6 ? "Неплохо. Разбери ошибки ниже и двигайся дальше или повтори." : "Стоит перечитать материал и пройти квиз ещё раз."}
        </p>
        {step.kind === "final" && (
          <div className="mt-4 rounded-2xl bg-[var(--color-bg)] p-4">
            <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">Готовность к квизу</p>
            <p className="mt-1 text-4xl font-bold tabular-nums">{ready}%</p>
            <ul className="mt-3 space-y-2 text-sm">
              {perLecture.map((x) => (
                <li key={x.title} className="flex justify-between gap-3">
                  <span className="min-w-0 break-words">{x.title}</span>
                  <span className="shrink-0 tabular-nums">{x.right} из {x.total}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <div className="grid gap-2 sm:grid-cols-2">
        {onNext && following && (
          <Button variant="primary" className="h-auto min-h-11 whitespace-normal sm:col-span-2" onClick={onNext}>
            Дальше: {following.kind === "part" ? `часть ${following.part! + 1} — ${following.title[tl]}` : following.title[tl]}
          </Button>
        )}
        <Button className="h-auto min-h-11 whitespace-normal" onClick={onRetry}>Пройти ещё раз (новые вопросы)</Button>
        {onReread && <Button className="h-auto min-h-11 whitespace-normal" onClick={onReread}>Перечитать конспект</Button>}
        <Button variant="ghost" className="h-auto min-h-11 whitespace-normal" onClick={onMap}>К маршруту</Button>
      </div>

      {mistakes.length > 0 && (
        <section className={panel}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-bold">Разбор ошибок · {mistakes.length}</h2>
            <button className="text-xs underline" onClick={onLang}>
              {lang === "en" ? "Объяснения на русском" : "Explanations in English"}
            </button>
          </div>
          <ol className="mt-4 space-y-4">
            {mistakes.map(({ item, picked }) => (
              <li key={item.id} className="rounded-2xl border border-[var(--color-border)] p-4 text-sm">
                <p lang="en" className="font-semibold">{item.q}</p>
                {picked !== undefined && picked >= 0 && <p lang="en" className="mt-2 text-[var(--color-strength)]">✗ {item.options[picked]}</p>}
                <p lang="en" className="mt-1 text-[var(--color-stability)]">✓ {item.options[item.correct]}</p>
                <p lang={lang} className="mt-2 text-[var(--color-muted)]">{item.why[lang]}</p>
                <ReportQuestion eventId={event.id} questionId={item.id} />
              </li>
            ))}
          </ol>
        </section>
      )}
    </>
  );
}
