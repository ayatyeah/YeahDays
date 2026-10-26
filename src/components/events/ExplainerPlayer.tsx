"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { flushSync } from "react-dom";
import NotesDiagram from "@/components/events/NotesDiagram";
import { cn } from "@/lib/cn";
import { lineAt, posesAt, termChunks, timeline, visualAt } from "@/lib/events/explainer";
import type { CastRole, ExplainerVideo, VideoVisual } from "@/lib/events/types";

/**
 * Ролик-объяснение: два персонажа (маскот в костюмах ролей) разговаривают,
 * сверху меняются картинки — термин, формула, схема, пример, ловушка, вопрос.
 *
 * Это не видеофайл: сцена собирается здесь же по сценарию, а звук — один
 * файл озвучки на ролик (scripts/video-tts.mjs), поэтому ролик весит как
 * аудио. Время берётся из звука; без озвучки — по таймеру, по длине реплик.
 *
 * Аудиоэлемент один на всю ленту (audioEl): iPhone разрешает звук только
 * после тапа, и разблокированный элемент дальше играет новые источники сам.
 * Если звук всё же не пустили — на ролике кнопка «включить звук».
 * Тот же компонент рисует кадры для MP4 (render): там время идёт по часам
 * страницы, которые рендер двигает покадрово.
 *
 * Все движения — функция времени ролика t (появление картинки и реплики,
 * пункты списка по очереди, покачивание говорящего), без анимационной
 * библиотеки: кадр в момент t всегда один и тот же. С framer-motion в рендере
 * под нагрузкой смена картинок «застревала» — выход старой картинки не
 * доигрывал, и новая не появлялась.
 */

/** На сколько секунд отматывать назад, когда снимают с паузы. */
const RESUME_REWIND = 1;

/** 0…1 за `span` секунд после `from`, с плавным торможением в конце. */
function appear(t: number, from: number, span: number): number {
  const x = Math.min(1, Math.max(0, (t - from) / span));
  return 1 - (1 - x) ** 3;
}

/** Появление снизу: прозрачность и сдвиг по доле p. */
const rise = (p: number, dy: number, from = 1): CSSProperties => ({ opacity: p, transform: `translateY(${(1 - p) * dy}px) scale(${from + (1 - from) * p})` });

const ROLE_RU: Record<CastRole, string> = {
  mentor: "Наставник",
  student: "Студент",
  "scrum-master": "Scrum Master",
  "product-owner": "Product Owner",
  developer: "Developer",
  sponsor: "Sponsor",
  "functional-manager": "Functional manager",
  customer: "Customer",
  tester: "Tester",
  finance: "Finance",
};
const ROLE_EMOJI: Record<CastRole, string> = {
  mentor: "🧑‍🏫", student: "🧑‍🎓", "scrum-master": "🧭", "product-owner": "📋", developer: "💻",
  sponsor: "💼", "functional-manager": "🏗️", customer: "🛍️", tester: "🔍", finance: "🧮",
};

/** Подсветить английские термины в русской реплике. */
function Terms({ text, className }: { text: string; className?: string }) {
  return (
    <>
      {termChunks(text).map((c, i) =>
        c.term ? <span key={i} lang="en" className={cn("font-bold text-amber-300", className)}>{c.text}</span> : <span key={i}>{c.text}</span>,
      )}
    </>
  );
}

function Panel({ children, tone = "bg-white/10" }: { children: ReactNode; tone?: string }) {
  return <div className={cn("w-full rounded-3xl border border-white/15 p-4 shadow-2xl backdrop-blur", tone)}>{children}</div>;
}

/** age — сколько секунд картинка на экране: от него — появление строк по очереди. */
function Visual({ visual, revealed, age }: { visual: VideoVisual; revealed: boolean; age: number }) {
  switch (visual.kind) {
    case "hook":
      return <p className="text-center text-[1.75rem] font-black leading-tight tracking-tight drop-shadow-lg"><Terms text={visual.text} /></p>;
    case "card":
      return (
        <Panel>
          <p lang="en" className="text-[1.4rem] font-black leading-tight text-amber-300">{visual.term}</p>
          <p className="mt-2 text-base leading-snug text-white/90">{visual.meaning}</p>
        </Panel>
      );
    case "formula":
      return (
        <Panel tone="bg-black/40">
          {visual.lines.map((l, i) => (
            <p key={i} lang="en" className="font-mono text-[1.15rem] font-bold leading-relaxed text-emerald-300" style={{ opacity: appear(age, 0.25 * i, 0.35), transform: `translateX(${(1 - appear(age, 0.25 * i, 0.35)) * -20}px)` }}>
              {l}
            </p>
          ))}
          {visual.note && <p className="mt-2 text-sm text-white/80"><Terms text={visual.note} /></p>}
        </Panel>
      );
    case "diagram":
      return <div className="w-full rounded-3xl bg-white/95 p-2 text-black [&_figure]:border-0 [&_figure]:bg-transparent" style={{ "--color-fg": "#111", "--color-surface": "#fff", "--color-surface-2": "#eef0f4", "--color-border": "#d4d4d8", "--color-border-strong": "#a1a1aa", "--color-muted": "#52525b", "--color-fg-dim": "#3f3f46" } as React.CSSProperties}><NotesDiagram name={visual.name} lang="ru" /></div>;
    case "list":
      return (
        <Panel>
          <p className="text-base font-bold text-amber-300"><Terms text={visual.title} className="text-amber-300" /></p>
          <ul className="mt-2 space-y-1.5">
            {visual.items.map((item, i) => (
              <li key={i} lang="en" className={cn("rounded-xl px-3 py-1.5 text-[0.95rem] font-semibold leading-snug", visual.mark === i ? "bg-amber-400 text-black" : "bg-white/10 text-white")} style={rise(appear(age, 0.12 * i, 0.3), 10)}>
                {item}
              </li>
            ))}
          </ul>
        </Panel>
      );
    case "compare":
      return (
        <div className="grid w-full grid-cols-2 gap-3">
          {[visual.left, visual.right].map((col, k) => (
            <Panel key={k} tone={k ? "bg-sky-500/20" : "bg-violet-500/20"}>
              <p className="text-[0.95rem] font-black leading-tight"><Terms text={col.title} /></p>
              <ul className="mt-2 space-y-1 text-sm leading-snug text-white/90">{col.items.map((it, i) => <li key={i}>• <Terms text={it} /></li>)}</ul>
            </Panel>
          ))}
        </div>
      );
    case "example":
      return (
        <Panel tone="bg-sky-500/15">
          <p className="text-sm font-bold uppercase tracking-widest text-sky-300">📌 Пример</p>
          <p className="mt-1 text-lg font-bold leading-snug"><Terms text={visual.title} /></p>
          <div className="mt-1.5 space-y-1 text-base leading-snug text-white/90">{visual.lines.map((l, i) => <p key={i}><Terms text={l} /></p>)}</div>
        </Panel>
      );
    case "trap":
      return (
        <div className="w-full space-y-3">
          <Panel tone="bg-red-500/20"><p className="text-base leading-snug">❌ <Terms text={visual.wrong} /></p></Panel>
          <div style={rise(appear(age, 0.6, 0.35), 14)}>
            <Panel tone="bg-emerald-500/20"><p className="text-base font-semibold leading-snug">✅ <Terms text={visual.right} /></p></Panel>
          </div>
        </div>
      );
    case "quiz":
      return (
        <Panel tone="bg-amber-500/15">
          <p className="text-sm font-bold uppercase tracking-widest text-amber-300">⚡ Test question</p>
          <p lang="en" className="mt-1 text-lg font-bold leading-snug">{visual.q}</p>
          <div className="mt-2 space-y-1.5">
            {visual.options.map((o, i) => (
              <div key={i} lang="en" className={cn("rounded-xl border px-3 py-1.5 text-base leading-snug transition", revealed && i === visual.answer ? "border-emerald-300 bg-emerald-500/30 font-bold" : revealed ? "border-white/10 opacity-50" : "border-white/25 bg-white/5")}>
                {String.fromCharCode(65 + i)}. {o} {revealed && i === visual.answer && "✓"}
              </div>
            ))}
          </div>
        </Panel>
      );
  }
}

/** Картинка не влезла в свою зону — уменьшаем её целиком, а не обрезаем. */
function FitBox({ children }: { children: ReactNode }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const fit = () => {
      if (!outer.current || !inner.current) return;
      const need = inner.current.scrollHeight;
      const have = outer.current.clientHeight;
      setScale(need > have && need > 0 ? Math.max(0.4, have / need) : 1);
    };
    fit();
    const observer = new ResizeObserver(fit);
    if (outer.current) observer.observe(outer.current);
    if (inner.current) observer.observe(inner.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={outer} className="flex h-full w-full items-center justify-center">
      <div ref={inner} className="w-full origin-center" style={{ transform: scale < 1 ? `scale(${scale})` : undefined }}>
        {children}
      </div>
    </div>
  );
}

/**
 * Персонаж: говорящий крупнее и подпрыгивает (`bob`, px), молчащий — меньше и
 * приглушён. `turn` — доля перехода (0…1) с момента, как сменился говорящий.
 */
function Character({ role, pose, side, speaking, turn, bob }: { role: CastRole; pose: string; side: "left" | "right"; speaking: boolean; turn: number; bob: number }) {
  const [broken, setBroken] = useState(false);
  useEffect(() => setBroken(false), [role, pose]);
  const level = speaking ? turn : 1 - turn; // 1 — говорит, 0 — молчит
  const scale = 0.92 + 0.14 * level;
  const opacity = 0.72 + 0.28 * level;
  return (
    <div
      className={cn("absolute bottom-0 flex h-[42%] w-[52%] items-end justify-center", side === "left" ? "left-[-4%]" : "right-[-4%]")}
      style={{ transformOrigin: "bottom center", zIndex: speaking ? 2 : 1, opacity, transform: `translateY(${speaking ? bob : 0}px) scale(${scale})` }}
    >
      {broken ? (
        <div className="mb-6 grid h-32 w-32 place-items-center rounded-full bg-white/15 text-6xl">{ROLE_EMOJI[role]}</div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/cast/${role}-${pose}.webp`}
          alt=""
          draggable={false}
          onError={() => setBroken(true)}
          // Не отражаем: на костюмах есть бейджи с текстом (PM, PO, SM), зеркальные буквы видно сразу.
          className="max-h-full w-auto select-none object-contain drop-shadow-[0_12px_30px_rgba(0,0,0,0.55)]"
        />
      )}
      <span className="absolute bottom-2 rounded-full bg-black/60 px-2.5 py-0.5 text-[11px] font-semibold text-white/90">{ROLE_RU[role]}</span>
    </div>
  );
}

const BACKDROPS = [
  "from-indigo-700 via-[#0b0b14] to-fuchsia-800",
  "from-emerald-700 via-[#0b0b14] to-sky-800",
  "from-amber-600 via-[#0b0b14] to-rose-800",
  "from-sky-700 via-[#0b0b14] to-violet-800",
];

export default function ExplainerPlayer({
  video,
  active,
  audioEl,
  muted,
  rate = 1,
  render = false,
  backdrop = 0,
  onEnded,
  onProgress,
}: {
  video: ExplainerVideo;
  active: boolean;
  audioEl?: HTMLAudioElement | null;
  muted?: boolean;
  rate?: number;
  /** Рендер в MP4: без звука, время по часам страницы, конец — в window.__explainerDone. */
  render?: boolean;
  backdrop?: number;
  onEnded?: () => void;
  onProgress?: (share: number) => void;
}) {
  const { starts, duration } = useMemo(() => timeline(video), [video]);
  const [t, setT] = useState(0);
  const [paused, setPaused] = useState(false);
  const [needsTap, setNeedsTap] = useState(false);
  const clock = useRef<{ base: number; at: number } | null>(null);
  const ended = useRef(onEnded);
  useEffect(() => {
    ended.current = onEnded;
  });

  const src = video.audio && !render ? video.audio.src : null;
  const mine = () => !!(audioEl && src && audioEl.src.endsWith(src));

  // Ушли с ролика — он начнётся сначала.
  useEffect(() => {
    if (active) return;
    setT(0);
    setPaused(false);
    setNeedsTap(false);
    clock.current = null;
    if (audioEl && src && audioEl.src.endsWith(src)) audioEl.pause();
  }, [active, audioEl, src]);

  /** exact — ставить звук ровно в `at` (после паузы), иначе — только если ушёл больше чем на 0,3 с. */
  function startAudio(at: number, exact = false) {
    if (!audioEl || !src) return;
    if (!audioEl.src.endsWith(src)) audioEl.src = src;
    audioEl.muted = !!muted;
    audioEl.playbackRate = rate;
    if (Math.abs(audioEl.currentTime - at) > (exact ? 0.05 : 0.3)) audioEl.currentTime = at;
    void audioEl.play().then(
      () => setNeedsTap(false),
      () => setNeedsTap(true), // звук не пустили без тапа — время пока идёт по часам
    );
  }

  // Время: по звуку, если он есть и играет, иначе по часам.
  useEffect(() => {
    if (!active || paused) {
      if (mine()) audioEl!.pause();
      clock.current = null;
      return;
    }
    let frame = 0;
    let done = false;
    startAudio(t);
    const tick = () => {
      let now: number;
      if (mine() && !audioEl!.paused) {
        now = audioEl!.currentTime;
        clock.current = null;
      } else {
        const wall = performance.now() / 1000;
        if (!clock.current) clock.current = { base: wall, at: t };
        now = clock.current.at + (wall - clock.current.base) * rate;
      }
      // В рендере — синхронно: кадр снимают сразу после шага часов, и он должен уже показывать момент t.
      if (render) flushSync(() => setT(now));
      else setT(now);
      onProgress?.(Math.min(1, now / duration));
      if (now >= duration + 0.6 && !done) {
        done = true;
        if (render) (window as unknown as { __explainerDone?: boolean }).__explainerDone = true;
        ended.current?.();
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // t — точка старта при снятии с паузы, повторно её не читаем
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, paused, src, audioEl, muted, rate, duration, render]);

  const i = lineAt(starts, t);
  const line = video.lines[i];
  const { visual, from } = visualAt(video, i);
  const poses = posesAt(video, i);
  const revealed = visual?.kind === "quiz" && i > from;
  const speakerSide = line.who === "A" ? "left" : "right";
  // Говорящий сменился на этой реплике — переход за 0,3 с, иначе всё уже на месте.
  const turn = i > 0 && video.lines[i - 1].who !== line.who ? appear(t, starts[i], 0.3) : 1;
  const visualIn = from >= 0 ? appear(t, starts[from], 0.4) : 1;
  const bubbleIn = appear(t, starts[i], 0.22);
  // В MP4 между репликами кадр стоит, и рендер его не снимает заново: поэтому там
  // говорящий подпрыгивает один раз в начале реплики, а полоска шагает по репликам.
  // В приложении — покачивание всю реплику и плавная полоска.
  const lineIn = Math.min(1, Math.max(0, (t - starts[i]) / 0.4));
  const bob = render ? -8 * Math.sin(Math.PI * lineIn) : -6 * Math.abs(Math.sin((Math.PI * t) / 0.9)) * turn;
  const shown = render ? starts[i] + appear(t, starts[i], 0.3) * ((starts[i + 1] ?? duration) - starts[i]) : t;

  return (
    <div
      className={cn("relative h-full w-full overflow-hidden bg-gradient-to-b text-white", BACKDROPS[backdrop % BACKDROPS.length])}
      onClick={render ? undefined : () => {
        // Тап — это и есть разрешение на звук: звук трогаем прямо в обработчике,
        // а не потом в эффекте — иначе телефон может счесть запуск автоплеем и не пустить.
        if (needsTap) return startAudio(t);
        if (!paused) {
          const at = mine() && !audioEl!.paused ? audioEl!.currentTime : t;
          if (mine()) audioEl!.pause();
          setT(at);
          setPaused(true);
          return;
        }
        // С паузы — на секунду назад, но не раньше начала реплики: наушники и
        // колонки после тишины просыпаются не сразу и съедают начало звука.
        const at = Math.max(starts[lineAt(starts, t)] ?? 0, t - RESUME_REWIND, 0);
        setT(at);
        startAudio(at, true);
        setPaused(false);
      }}
      data-no-i18n
    >
      <div aria-hidden className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-20 top-10 h-60 w-60 rounded-full bg-amber-300/10 blur-3xl" />

      <div className="absolute inset-x-4 top-3 z-10 h-1 overflow-hidden rounded-full bg-white/20">
        <div className="h-full bg-white" style={{ width: `${Math.min(100, (shown / duration) * 100)}%` }} />
      </div>
      <p className="absolute left-4 right-4 top-[3.7rem] z-10 truncate text-center text-[11px] font-bold uppercase tracking-[0.2em] text-white/75">{video.title.ru}</p>

      <div className="absolute inset-x-4 top-[14%] z-10 flex h-[34%] items-center justify-center overflow-hidden">
        {visual && (
          <div key={from} className="flex h-full w-full justify-center" style={rise(visualIn, 30, 0.94)}>
            <FitBox>
              <Visual visual={visual} revealed={revealed} age={t - starts[from]} />
            </FitBox>
          </div>
        )}
      </div>

      <div className={cn("absolute z-20 max-w-[80%] top-[49%]", speakerSide === "left" ? "left-4" : "right-4")}>
        <div
          key={i}
          className={cn("rounded-3xl px-4 py-2.5 text-[0.98rem] font-semibold leading-snug shadow-xl", speakerSide === "left" ? "rounded-bl-md bg-white text-black" : "rounded-br-md bg-black/75 text-white")}
          style={rise(bubbleIn, 10, 0.96)}
        >
          <Terms text={line.text} className={speakerSide === "left" ? "text-indigo-700" : undefined} />
        </div>
      </div>

      <Character role={video.cast.A} pose={poses.A} side="left" speaking={line.who === "A"} turn={turn} bob={bob} />
      <Character role={video.cast.B} pose={poses.B} side="right" speaking={line.who === "B"} turn={turn} bob={bob} />

      {paused && !render && <div className="absolute inset-0 z-30 grid place-items-center bg-black/30 text-6xl" aria-hidden>▶</div>}
      {needsTap && !paused && !muted && !render && (
        <div className="pointer-events-none absolute inset-x-0 top-[44%] z-30 flex justify-center">
          <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-black shadow-xl">🔊 Нажми, чтобы включить звук</span>
        </div>
      )}
    </div>
  );
}
