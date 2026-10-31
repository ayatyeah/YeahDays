"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { fallbackLine, frameSrc, sceneAudioSrc, storySeconds } from "@/lib/stories";
import type { SceneTiming, Story, StoryScene } from "@/lib/stories/types";
import "./stories.css";

/**
 * Плеер «Истории»: сцена за сценой, кадр за кадром.
 *
 * Сцена — один звуковой файл (голоса и музыка), время каждой реплики известно
 * (scripts/story-tts.mjs), поэтому кадр, субтитр и карточка термина меняются
 * ровно вместе с голосом. По кадру медленно едет камера, кадры сменяются
 * наплывом. Сцена без озвучки идёт по таймеру — длина реплики по тексту.
 *
 * Карточка термина: сам термин по-английски, как на слайдах и в тесте,
 * пояснение — по-русски. Если терминов в реплике несколько — по очереди.
 *
 * Выводится порталом в body: внутри оболочки приложения нижнее меню,
 * сайдбар и баннер установки рисовались поверх плеера.
 */

type Timeline = { duration: number; voiced: boolean; lines: { start: number; end: number }[] };

function timeline(scene: StoryScene, timing?: SceneTiming): Timeline {
  if (timing && timing.lines.length === scene.lines.length) return { duration: timing.duration, voiced: true, lines: timing.lines };
  let t = 0.5;
  const lines = scene.lines.map((line) => {
    const start = t;
    const end = t + fallbackLine(line.text);
    t = end + 0.6 + (line.terms?.length ? 1.2 : 0);
    return { start, end };
  });
  return { duration: t + 0.8, voiced: false, lines };
}

const NAME_COLORS = ["text-amber-300", "text-sky-300", "text-rose-300", "text-violet-300", "text-emerald-300", "text-orange-300"];

const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export default function StoryPlayer({ story, timings }: { story: Story; timings: Record<string, SceneTiming> }) {
  const router = useRouter();
  const lines = useMemo(() => story.scenes.map((s) => timeline(s, timings[s.id])), [story, timings]);
  const [phase, setPhase] = useState<"intro" | "play" | "end">("intro");
  const [scene, setScene] = useState(0);
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [chapters, setChapters] = useState(false);
  const [saved, setSaved] = useState(0);
  const [host, setHost] = useState<HTMLElement | null>(null);
  const audio = useRef<HTMLAudioElement>(null);
  // Часы для сцены без озвучки: с какого времени и когда пошли.
  const timer = useRef({ base: 0, at: 0 });
  const KEY = `yg-story:${story.id}`;

  const colors = useMemo(() => Object.fromEntries(Object.keys(story.cast).map((k, i) => [k, NAME_COLORS[i % NAME_COLORS.length]])), [story]);
  const total = useMemo(() => storySeconds(story), [story]);
  const before = lines.slice(0, scene).reduce((s, l) => s + l.duration, 0);

  useEffect(() => {
    try {
      setSaved(Number(localStorage.getItem(KEY) ?? 0) || 0);
    } catch {
      /* без хранилища — с начала */
    }
  }, [KEY]);
  useEffect(() => {
    if (phase !== "play") return;
    try {
      localStorage.setItem(KEY, String(scene));
    } catch {
      /* место не запомнится */
    }
  }, [KEY, phase, scene]);

  // Плеер — поверх всего приложения: страница под ним не листается.
  useEffect(() => {
    setHost(document.body);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Следующие кадры — заранее, чтобы наплыв не ждал сети.
  useEffect(() => {
    for (const s of story.scenes.slice(scene, scene + 2)) for (const l of s.lines) new Image().src = frameSrc(story, l.frame);
  }, [story, scene]);

  /** Начать сцену. Из нажатия кнопки звук разрешён; дальше тот же <audio> играет сам. */
  const startScene = useCallback(
    (i: number) => {
      const a = audio.current;
      setScene(i);
      setT(0);
      setPhase("play");
      setChapters(false);
      if (!a) return;
      if (lines[i].voiced) {
        a.src = sceneAudioSrc(story, story.scenes[i].id);
        a.currentTime = 0;
        void a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
      } else {
        a.pause();
        a.removeAttribute("src");
        timer.current = { base: 0, at: performance.now() };
        setPlaying(true);
      }
    },
    [lines, story],
  );

  const sceneEnded = useCallback(() => {
    if (scene + 1 < story.scenes.length) startScene(scene + 1);
    else {
      setPlaying(false);
      setPhase("end");
      try {
        localStorage.removeItem(KEY);
      } catch {
        /* ничего страшного */
      }
    }
  }, [KEY, scene, startScene, story.scenes.length]);

  // Ход времени: у озвученной сцены — по звуку, у остальной — по часам.
  useEffect(() => {
    if (phase !== "play" || !playing) return;
    let raf = 0;
    const tick = () => {
      let now: number;
      if (lines[scene].voiced) now = audio.current?.currentTime ?? 0;
      else {
        now = timer.current.base + (performance.now() - timer.current.at) / 1000;
        if (now >= lines[scene].duration) {
          sceneEnded();
          return;
        }
      }
      setT((prev) => (Math.abs(prev - now) > 0.08 ? now : prev));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, playing, scene, lines, sceneEnded]);

  function toggle() {
    const a = audio.current;
    if (playing) {
      if (lines[scene].voiced) a?.pause();
      else timer.current = { base: t, at: performance.now() };
      setPlaying(false);
    } else {
      if (lines[scene].voiced) void a?.play().then(() => setPlaying(true)).catch(() => {});
      else {
        timer.current = { base: t, at: performance.now() };
        setPlaying(true);
      }
    }
  }

  function exit() {
    audio.current?.pause();
    if (window.history.length > 1) router.back();
    else router.push("/learn#learning-stories");
  }

  const current = story.scenes[scene];
  const tl = lines[scene];
  let lineIdx = 0;
  tl.lines.forEach((l, i) => {
    if (l.start <= t + 0.05) lineIdx = i;
  });
  const line = current.lines[lineIdx];
  const lineEnd = tl.lines[lineIdx + 1]?.start ?? tl.duration;
  const span = Math.max(1.5, lineEnd - tl.lines[lineIdx].start);
  const terms = line.terms ?? [];
  const termIdx = terms.length ? Math.min(terms.length - 1, Math.floor(Math.max(0, t - tl.lines[lineIdx].start) / (span / terms.length))) : -1;
  const term = termIdx >= 0 ? terms[termIdx] : null;
  const who = story.cast[line.who];

  if (!host) return null;
  return createPortal(
    <div className="fixed inset-0 z-[200] flex flex-col bg-[#0b0b0c] text-white" role="dialog" aria-modal="true" aria-label={`История: ${story.title}`}>
      <audio ref={audio} preload="auto" onEnded={sceneEnded} />

      {phase === "intro" && (
        <div className="flex flex-1 flex-col overflow-y-auto">
          <div className="relative aspect-video w-full shrink-0 overflow-hidden sm:mx-auto sm:mt-6 sm:max-w-3xl sm:rounded-3xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={frameSrc(story, story.cover)} alt="" className="story-frame" data-kb="0" style={{ animationDuration: "18s" }} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0c] via-transparent to-transparent" />
            <button onClick={exit} className="absolute left-3 top-[max(0.75rem,env(safe-area-inset-top))] grid h-10 w-10 place-items-center rounded-full bg-black/50 text-lg backdrop-blur" aria-label="Закрыть историю">✕</button>
          </div>
          <div className="mx-auto w-full max-w-3xl px-5 pb-10">
            <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-white/60">{story.lecture.label}</p>
            <h1 className="mt-2 text-3xl font-bold leading-tight" lang="ru">{story.title}</h1>
            <p className="mt-2 text-white/70" lang="ru">{story.subtitle}</p>
            <p className="mt-2 text-sm text-white/50">{`≈ ${Math.round(total / 60)} мин · ${story.scenes.length} сцен · термины по-английски, пояснения по-русски`}</p>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <button onClick={() => startScene(0)} className="h-12 rounded-2xl bg-white font-semibold text-black">▶ Смотреть</button>
              {saved > 0 && saved < story.scenes.length && (
                <button onClick={() => startScene(saved)} className="h-12 rounded-2xl border border-white/25 font-semibold">{`Продолжить: сцена ${saved + 1}`}</button>
              )}
            </div>
            <ol className="mt-6 space-y-1.5">
              {story.scenes.map((s, i) => (
                <li key={s.id}>
                  <button onClick={() => startScene(i)} className="flex w-full items-center justify-between gap-3 rounded-2xl bg-white/5 px-4 py-3 text-left text-sm hover:bg-white/10">
                    <span lang="ru">{`${i + 1}. ${s.title}`}</span>
                    <span className="shrink-0 tabular-nums text-white/50">{clock(lines[i].duration)}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}

      {phase === "play" && (
        <>
          <header className="flex items-center gap-2 px-3 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))]">
            <button onClick={exit} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 text-lg" aria-label="Закрыть историю">✕</button>
            <p className="min-w-0 flex-1 truncate text-center text-xs font-semibold text-white/70">
              <span>{`Сцена ${scene + 1} из ${story.scenes.length} · `}</span>
              <span lang="ru">{current.title}</span>
            </p>
            <button onClick={() => setChapters(true)} className="h-10 shrink-0 rounded-full bg-white/10 px-3 text-xs font-semibold" aria-label="Сцены истории">☰ Сцены</button>
          </header>

          <div className="flex min-h-0 flex-1 flex-col items-center justify-center">
            <button
              type="button"
              onClick={toggle}
              aria-label={playing ? "Пауза" : "Смотреть дальше"}
              className="relative aspect-video w-full max-w-[min(100%,calc((100dvh-300px)*16/9))] overflow-hidden sm:rounded-2xl"
            >
              {current.lines.map((l, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={l.frame}
                  src={frameSrc(story, l.frame)}
                  alt=""
                  className="story-frame"
                  data-kb={i === lineIdx ? String((scene + i) % 4) : undefined}
                  style={{
                    opacity: i === lineIdx ? 1 : 0,
                    animationDuration: `${span + 1}s`,
                    animationPlayState: playing ? "running" : "paused",
                  }}
                />
              ))}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />
              {!playing && (
                <span className="absolute inset-0 grid place-items-center">
                  <span className="grid h-16 w-16 place-items-center rounded-full bg-black/55 text-3xl backdrop-blur">▶</span>
                </span>
              )}
            </button>

            <div className="mt-3 w-full max-w-3xl flex-1 px-4">
              {term && (
                <div key={`${scene}-${lineIdx}-${termIdx}`} className="story-term mb-3 rounded-2xl border border-amber-300/40 bg-amber-300/10 p-3">
                  <p className="text-lg font-bold leading-tight text-amber-200" lang="en">{term.term}</p>
                  {term.full && <p className="text-sm text-amber-100/80" lang="en">{term.full}</p>}
                  <p className="mt-1 text-sm leading-snug text-white/90" lang="ru">{term.ru}</p>
                </div>
              )}
              <div aria-live="polite">
                <p className={cn("text-xs font-semibold uppercase tracking-wider", colors[line.who])}>
                  <span lang="ru">{who?.name}</span>
                  {who?.role && <span className="ml-1.5 normal-case tracking-normal text-white/40" lang="en">{who.role}</span>}
                </p>
                <p className="mt-1 text-[17px] leading-snug" lang="ru">{line.text}</p>
              </div>
            </div>
          </div>

          <footer className="px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2">
            <div className="mx-auto max-w-3xl">
              <div className="h-1 overflow-hidden rounded-full bg-white/15" role="progressbar" aria-label="Прогресс истории" aria-valuemin={0} aria-valuemax={Math.round(total)} aria-valuenow={Math.round(before + t)}>
                <div className="h-full rounded-full bg-white" style={{ width: `${Math.min(100, ((before + t) / total) * 100)}%` }} />
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="w-14 text-xs tabular-nums text-white/50">{clock(before + t)}</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => startScene(Math.max(0, scene - 1))} disabled={scene === 0} className="grid h-11 w-11 place-items-center rounded-full bg-white/10 disabled:opacity-30" aria-label="Предыдущая сцена">⏮</button>
                  <button onClick={toggle} className="grid h-14 w-14 place-items-center rounded-full bg-white text-xl text-black" aria-label={playing ? "Пауза" : "Смотреть дальше"}>{playing ? "❚❚" : "▶"}</button>
                  <button onClick={sceneEnded} className="grid h-11 w-11 place-items-center rounded-full bg-white/10" aria-label="Следующая сцена">⏭</button>
                </div>
                <span className="w-14 text-right text-xs tabular-nums text-white/50">{clock(total)}</span>
              </div>
            </div>
          </footer>

          {chapters && (
            <div className="absolute inset-0 z-10 flex flex-col bg-[#0b0b0c]" role="dialog" aria-modal="true" aria-label="Сцены">
              <div className="flex items-center justify-between gap-2 border-b border-white/10 p-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
                <p className="font-semibold">Сцены</p>
                <button onClick={() => setChapters(false)} className="grid h-10 w-10 place-items-center rounded-full bg-white/10" aria-label="Закрыть список сцен">✕</button>
              </div>
              <ol className="flex-1 space-y-1.5 overflow-y-auto p-4">
                {story.scenes.map((s, i) => (
                  <li key={s.id}>
                    <button onClick={() => startScene(i)} aria-current={i === scene ? "true" : undefined} className={cn("flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left text-sm", i === scene ? "bg-white text-black" : "bg-white/5")}>
                      <span lang="ru">{`${i + 1}. ${s.title}`}</span>
                      <span className="shrink-0 tabular-nums opacity-60">{clock(lines[i].duration)}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </>
      )}

      {phase === "end" && (
        <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-6 text-center">
          <p className="text-5xl" aria-hidden>🏁</p>
          <p className="mt-4 max-w-xl text-2xl font-bold leading-snug" lang="en">{story.moral}</p>
          <p className="mt-3 max-w-md text-sm text-white/60">Теперь закрепи: конспект лекции и квиз — там же вопросы, как в тесте.</p>
          <div className="mt-6 grid w-full max-w-sm gap-2">
            <Link href={`/events/${story.lecture.eventId}`} className="grid h-12 place-items-center rounded-2xl bg-white font-semibold text-black">К лекции — конспект и квиз</Link>
            <button onClick={() => startScene(0)} className="h-12 rounded-2xl border border-white/25 font-semibold">Смотреть заново</button>
            <Link href="/learn#learning-stories" className="grid h-12 place-items-center rounded-2xl text-sm text-white/70 underline">Все истории</Link>
          </div>
        </div>
      )}
    </div>,
    host,
  );
}
