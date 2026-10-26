"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import ExplainerPlayer from "@/components/events/ExplainerPlayer";
import { MODES, SceneView, type Mode } from "@/components/events/LectureVideo";
import { cn } from "@/lib/cn";
import { answer, loadDrill, saveDrill } from "@/lib/events/drill";
import { buildFeed, loadFeed, saveFeed, type Clip, type FeedItem, type FeedMemory, type QuizCard } from "@/lib/events/feed";
import { shortTitle } from "@/lib/events/route";
import { holdFor, narration } from "@/lib/events/scenes";
import { loadPref, savePref } from "@/lib/events/storage";
import type { StudyEvent } from "@/lib/events/types";
import { RATES, clampRate, rankVoices } from "@/lib/events/voice";

/**
 * Лента коротких видео по курсу — листаешь вверх, как в TikTok.
 *
 * Клип — одна тема конспекта, проигрывается сценами с голосом браузера
 * (как «Смотреть как видео», только короче и подряд). Играет тот клип,
 * что на экране; кончился — лента сама листает дальше. Тап — пауза.
 * Между клипами — быстрые вопросы: ответ идёт в «Учить вопросами».
 *
 * Рисуются только соседние клипы: в ленте их сотни, а держать в DOM
 * анимации и схемы всех сразу телефону тяжело.
 *
 * Лента выводится порталом в body: страница ивента живёт внутри анимированной
 * обёртки, а у неё свой слой наложения — изнутри неё «fixed» оказывался под
 * нижней навигацией и кнопкой помощника.
 */

/** Лента всегда тёмная, как видеоплеер: подменяем цвета темы внутри неё. */
const DARK = {
  "--color-fg": "#ffffff",
  "--color-fg-dim": "rgba(255,255,255,0.72)",
  "--color-muted": "rgba(255,255,255,0.6)",
  "--color-bg": "#07070b",
  "--color-surface": "#121218",
  "--color-surface-2": "#1d1d26",
  "--color-border": "rgba(255,255,255,0.14)",
  "--color-border-strong": "rgba(255,255,255,0.3)",
} as CSSProperties;

const BACKDROPS = [
  "from-violet-700/50 via-[#07070b] to-sky-700/30",
  "from-emerald-700/40 via-[#07070b] to-violet-700/30",
  "from-amber-700/40 via-[#07070b] to-rose-700/30",
  "from-sky-700/40 via-[#07070b] to-emerald-700/30",
  "from-rose-700/40 via-[#07070b] to-indigo-700/30",
];

export default function Feed({
  event,
  userId,
  onExit,
  onOpenPart,
  onPartQuiz,
}: {
  event: StudyEvent;
  userId: string;
  onExit: () => void;
  onOpenPart: (partId: string) => void;
  onPartQuiz: (partId: string) => void;
}) {
  const [items, setItems] = useState<FeedItem[] | null>(null);
  const [memory, setMemory] = useState<FeedMemory>({ saved: [] });
  const [onlySaved, setOnlySaved] = useState(false);
  const [active, setActive] = useState(0);
  const [mode, setMode] = useState<Mode>("mix");
  const [rate, setRate] = useState(1);
  const [muted, setMuted] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [canSpeak, setCanSpeak] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const start = useRef<string | undefined>(undefined);
  // Один аудиоэлемент на всю ленту: после первого тапа телефон пускает звук и для следующих роликов.
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  // Лента собирается в браузере: вопросы между клипами случайные, а освоенные
  // в «Учить вопросами» — в последнюю очередь.
  useEffect(() => {
    const mem = loadFeed(userId, event.id);
    const drill = loadDrill(userId, event.id);
    const mastered = new Set(Object.entries(drill).filter(([, c]) => c.level === 2).map(([id]) => id));
    start.current = mem.at;
    setMemory(mem);
    setItems(buildFeed(event, Math.random, mastered));
    setMode((loadPref("video-mode", "mix") as Mode) || "mix");
    setRate(clampRate(Number(loadPref("voice-rate", "1"))));
    setMuted(loadPref("feed-muted", "off") === "on");
    if (!("speechSynthesis" in window)) return;
    setCanSpeak(true);
    const read = () => setVoices(window.speechSynthesis.getVoices());
    read();
    window.speechSynthesis.addEventListener?.("voiceschanged", read);
    return () => window.speechSynthesis.removeEventListener?.("voiceschanged", read);
  }, [userId, event]);

  // Страница под лентой не прокручивается, пока лента открыта.
  useEffect(() => {
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = before;
      try { window.speechSynthesis?.cancel(); } catch { /* нет синтезатора */ }
    };
  }, []);

  const list = useMemo(
    () => (items && onlySaved ? items.filter((f) => f.kind === "clip" && memory.saved.includes(f.id)) : items ?? []),
    [items, onlySaved, memory.saved],
  );

  // Вернуться туда, где остановился в прошлый раз.
  useEffect(() => {
    if (!items || !box.current || !start.current) return;
    const at = items.findIndex((f) => f.id === start.current);
    start.current = undefined;
    if (at > 0) {
      box.current.scrollTop = at * box.current.clientHeight;
      setActive(at);
    }
  }, [items]);

  // Какой клип на экране: тот, что виден хотя бы на 60%.
  useEffect(() => {
    const root = box.current;
    if (!root || !list.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
      },
      { root, threshold: 0.6 },
    );
    for (const child of Array.from(root.children)) observer.observe(child);
    return () => observer.disconnect();
  }, [list]);

  useEffect(() => {
    const item = list[active];
    if (!item || item.kind !== "clip" || onlySaved) return;
    setMemory((m) => {
      const next = { ...m, at: item.id };
      saveFeed(userId, event.id, next);
      return next;
    });
  }, [active, list, onlySaved, userId, event.id]);

  const voiceFor = useCallback((lang: "ru" | "en") => {
    const ranked = rankVoices(voices, lang);
    const saved = loadPref(`voice-${lang}`, "");
    return ranked.find((v) => v.name === saved) ?? ranked[0] ?? null;
  }, [voices]);

  function scrollTo(index: number) {
    const root = box.current;
    if (root) root.scrollTo({ top: index * root.clientHeight, behavior: "smooth" });
  }

  function toggleSave(id: string) {
    setMemory((m) => {
      const next = { ...m, saved: m.saved.includes(id) ? m.saved.filter((x) => x !== id) : [...m.saved, id] };
      saveFeed(userId, event.id, next);
      return next;
    });
  }

  const lectureLabel = (li: number) => shortTitle(event.lectures[li])[mode === "en" ? "en" : "ru"];
  const clipsTotal = items?.filter((f) => f.kind !== "quiz").length ?? 0;
  const clipNumber = list.slice(0, active + 1).filter((f) => f.kind !== "quiz").length;

  if (typeof document === "undefined") return null;
  return createPortal(
    <div className="fixed inset-0 z-[200] bg-[#07070b] text-white" style={DARK} role="dialog" aria-modal="true" aria-label="Лента коротких видео">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-2 bg-gradient-to-b from-black/70 to-transparent p-3 pb-8">
        <button className="pointer-events-auto grid h-10 w-10 place-items-center rounded-full bg-white/10 text-lg backdrop-blur" onClick={onExit} aria-label="Закрыть ленту">✕</button>
        <div className="pointer-events-auto flex flex-wrap items-center justify-end gap-1.5 text-xs">
          <select aria-label="Язык видео" className="h-8 max-w-[7.5rem] rounded-full bg-white/10 px-2 backdrop-blur" value={mode} onChange={(e) => { const m = e.target.value as Mode; setMode(m); savePref("video-mode", m); }}>
            {MODES.map(([m, label]) => <option key={m} value={m} className="text-black">{label}</option>)}
          </select>
          <select aria-label="Скорость голоса" className="h-8 rounded-full bg-white/10 px-2 backdrop-blur" value={rate} onChange={(e) => { const r = Number(e.target.value); setRate(r); savePref("voice-rate", String(r)); }}>
            {RATES.map((r) => <option key={r} value={r} className="text-black">{r}×</option>)}
          </select>
          <button className="h-8 rounded-full bg-white/10 px-3 backdrop-blur" aria-pressed={muted} aria-label={muted ? "Без звука" : "Звук"} onClick={() => { setMuted(!muted); savePref("feed-muted", muted ? "off" : "on"); }}>
            {muted ? "🔇" : "🔊"}
          </button>
          <button className={cn("h-8 rounded-full px-3 backdrop-blur", onlySaved ? "bg-white text-black" : "bg-white/10")} aria-pressed={onlySaved} onClick={() => { setOnlySaved(!onlySaved); setActive(0); box.current?.scrollTo({ top: 0 }); }}>
            {`♥ ${memory.saved.length}`}
          </button>
        </div>
      </div>

      {!items && <p className="grid h-full place-items-center text-sm text-white/70" role="status">Собираем ленту…</p>}
      {items && !list.length && (
        <div className="grid h-full place-items-center p-8 text-center">
          <div>
            <p className="text-lg font-semibold">Сохранённых клипов пока нет</p>
            <p className="mt-2 text-sm text-white/70">Жми ♥ на клипе, чтобы пересмотреть его перед тестом.</p>
            <button className="mt-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black" onClick={() => setOnlySaved(false)}>Ко всей ленте</button>
          </div>
        </div>
      )}

      <audio ref={setAudio} preload="auto" playsInline className="hidden" />
      <div ref={box} className="h-[100dvh] snap-y snap-mandatory overflow-y-auto overscroll-contain [scrollbar-width:none]">
        {list.map((item, i) => (
          <section key={item.id} data-index={i} data-kind={item.kind} data-id={item.id} className="relative h-[100dvh] snap-start snap-always overflow-hidden">
            {Math.abs(i - active) <= 1 &&
              (item.kind === "video" ? (
                <>
                  <ExplainerPlayer
                    video={item.video}
                    active={i === active}
                    audioEl={audio}
                    muted={muted}
                    rate={rate}
                    backdrop={i}
                    onEnded={() => { if (i + 1 < list.length) scrollTo(i + 1); }}
                  />
                  {/* Кнопки — внизу справа, поверх костюма персонажа: картинку и реплику сверху не закрывают. */}
                  <div className="absolute bottom-[5%] right-1.5 z-30 flex flex-col items-center gap-2.5">
                    <MiniRail icon={memory.saved.includes(item.id) ? "♥" : "♡"} label={memory.saved.includes(item.id) ? "Сохранено" : "Сохранить"} onClick={() => toggleSave(item.id)} pressed={memory.saved.includes(item.id)} />
                    <MiniRail icon="📖" label="Конспект" onClick={() => { audio?.pause(); onOpenPart(item.partId); }} />
                    <MiniRail icon="⚡" label="Квиз" onClick={() => { audio?.pause(); onPartQuiz(item.partId); }} />
                  </div>
                </>
              ) : item.kind === "clip" ? (
                <ClipView
                  clip={item}
                  active={i === active}
                  mode={mode}
                  rate={rate}
                  muted={muted || !canSpeak || !voices.length}
                  voiceFor={voiceFor}
                  backdrop={BACKDROPS[i % BACKDROPS.length]}
                  caption={`${lectureLabel(item.lecture)} · ${mode === "en" ? "part" : "часть"} ${item.part + 1}`}
                  saved={memory.saved.includes(item.id)}
                  onSave={() => toggleSave(item.id)}
                  onNotes={() => onOpenPart(item.partId)}
                  onQuiz={() => onPartQuiz(item.partId)}
                  onEnded={() => { if (i + 1 < list.length) scrollTo(i + 1); }}
                />
              ) : (
                <QuizView card={item} mode={mode} userId={userId} eventId={event.id} caption={lectureLabel(item.lecture)} onNext={() => { if (i + 1 < list.length) scrollTo(i + 1); }} />
              ))}
          </section>
        ))}
      </div>

      {!!list.length && !onlySaved && (
        <p className="pointer-events-none absolute bottom-2 left-1/2 z-20 -translate-x-1/2 text-[11px] tabular-nums text-white/50">{`${clipNumber} / ${clipsTotal}`}</p>
      )}
    </div>,
    document.body,
  );
}

/* ───────── Клип ───────── */

function ClipView({
  clip, active, mode, rate, muted, voiceFor, backdrop, caption, saved, onSave, onNotes, onQuiz, onEnded,
}: {
  clip: Clip;
  active: boolean;
  mode: Mode;
  rate: number;
  muted: boolean;
  voiceFor: (lang: "ru" | "en") => SpeechSynthesisVoice | null;
  backdrop: string;
  caption: string;
  saved: boolean;
  onSave: () => void;
  onNotes: () => void;
  onQuiz: () => void;
  onEnded: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [reveal, setReveal] = useState(false);
  const [flash, setFlash] = useState<"play" | "pause" | null>(null);
  const run = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scene = clip.scenes[index];
  const ended = useRef(onEnded);
  useEffect(() => {
    ended.current = onEnded;
  });

  const stop = useCallback(() => {
    run.current++;
    if (timer.current) clearTimeout(timer.current);
    try { window.speechSynthesis?.cancel(); } catch { /* нет синтезатора */ }
  }, []);

  // Ушли с клипа — он начнётся сначала, когда вернутся.
  useEffect(() => {
    if (!active) { stop(); setIndex(0); setPlaying(true); }
  }, [active, stop]);

  useEffect(() => {
    stop();
    setReveal(false);
    if (!active || !playing || !scene) return;
    const id = ++run.current;
    const after = (ms: number) => { timer.current = setTimeout(() => { if (id !== run.current) return; if (index + 1 < clip.scenes.length) setIndex(index + 1); else ended.current(); }, ms); };
    const extra = scene.kind === "diagram" || scene.kind === "table" ? 3000 : scene.kind === "question" ? 2000 : 400;
    if (scene.kind === "question") timer.current = setTimeout(() => { if (id === run.current) setReveal(true); }, 2500);
    const lines = muted ? [] : narration(scene, mode).filter((n) => n.text);
    if (scene.kind === "question" && !muted) {
      // В вопросе — пауза на раздумье, потом ответ голосом.
      const answerLine = { lang: mode === "en" ? ("en" as const) : ("ru" as const), text: mode === "en" ? scene.answerEn : scene.answerRu };
      lines.push(answerLine);
    }
    if (!lines.length) { after(holdFor(scene) / rate); return stop; }
    const synth = window.speechSynthesis;
    const speak = (k: number) => {
      if (id !== run.current) return;
      if (k >= lines.length) { after(extra); return; }
      const say = () => {
        if (id !== run.current) return;
        if (scene.kind === "question" && k === 1) setReveal(true);
        const u = new SpeechSynthesisUtterance(lines[k].text);
        const voice = voiceFor(lines[k].lang);
        u.lang = voice?.lang ?? (lines[k].lang === "ru" ? "ru-RU" : "en-US");
        if (voice) u.voice = voice;
        u.rate = rate;
        u.onend = () => speak(k + 1);
        // Синтез не справился — досматриваем сцену по таймеру, иначе клип пролетит за секунду.
        u.onerror = (e) => { if (e.error !== "interrupted" && e.error !== "canceled" && id === run.current) after(holdFor(scene) / rate); };
        synth.speak(u);
      };
      if (scene.kind === "question" && k === 1) timer.current = setTimeout(say, 2500);
      else say();
    };
    speak(0);
    return stop;
    // голоса подхватываются при следующей сцене — перезапускать ради них не нужно
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, playing, index, mode, rate, muted, clip]);

  function toggle() {
    setFlash(playing ? "pause" : "play");
    setPlaying(!playing);
    window.setTimeout(() => setFlash(null), 600);
  }

  return (
    <div className={cn("absolute inset-0 bg-gradient-to-br", backdrop)}>
      <div className="absolute inset-x-3 top-1.5 z-30 flex gap-1" aria-hidden>
        {clip.scenes.map((_, k) => (
          <span key={k} className="h-1 flex-1 overflow-hidden rounded-full bg-white/25">
            <span className={cn("block h-full bg-white transition-[width] duration-300", k < index ? "w-full" : k === index ? (active ? "w-1/2" : "w-0") : "w-0")} />
          </span>
        ))}
      </div>

      <div
        role="button"
        tabIndex={0}
        className="absolute inset-0 z-0 flex w-full cursor-default flex-col justify-center pb-40 pl-6 pr-20 pt-24 text-left sm:pl-12"
        onClick={toggle}
        onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); toggle(); } }}
        aria-label={playing ? "Пауза" : "Играть"}
        data-no-i18n
      >
        <AnimatePresence mode="wait">
          {scene && (
            <motion.div key={index} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="mx-auto w-full max-w-xl">
              <SceneView scene={scene} mode={mode} reveal={reveal} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {flash && (
          <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="pointer-events-none absolute inset-0 z-10 grid place-items-center text-6xl" aria-hidden>
            {flash === "pause" ? "⏸" : "▶"}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-24 right-3 z-10 flex flex-col items-center gap-4 text-xs">
        <Rail icon={saved ? "♥" : "♡"} label={saved ? "Сохранено" : "Сохранить"} onClick={onSave} pressed={saved} />
        <Rail icon="📖" label="Конспект" onClick={() => { stop(); onNotes(); }} />
        <Rail icon="⚡" label="Квиз" onClick={() => { stop(); onQuiz(); }} />
        <Rail icon="↺" label="Сначала" onClick={() => { setIndex(0); setPlaying(true); }} />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-4 pb-8 pr-20" data-no-i18n>
        <p className="text-xs font-semibold uppercase tracking-widest text-white/70">{caption}</p>
        <p className="mt-1 text-lg font-bold leading-snug" lang={mode === "ru" ? "ru" : "en"}>
          {mode === "ru" ? clip.heading.ru : clip.heading.en}
          {clip.piece && <span className="ml-2 text-sm font-normal text-white/60">{clip.piece}</span>}
        </p>
        {mode === "mix" && <p className="text-sm text-white/70" lang="ru">{clip.heading.ru}</p>}
        {!playing && <p className="mt-1 text-xs text-white/60">Пауза — тапни по экрану</p>}
      </div>
    </div>
  );
}

/** Кнопка ролика: только значок, подпись — для экранного диктора. */
function MiniRail({ icon, label, onClick, pressed }: { icon: string; label: string; onClick: () => void; pressed?: boolean }) {
  return (
    <button className={cn("grid h-11 w-11 place-items-center rounded-full bg-black/45 text-xl backdrop-blur", pressed && "text-rose-400")} onClick={onClick} aria-pressed={pressed} aria-label={label} title={label}>
      {icon}
    </button>
  );
}

function Rail({ icon, label, onClick, pressed }: { icon: string; label: string; onClick: () => void; pressed?: boolean }) {
  return (
    <button className="flex flex-col items-center gap-1" onClick={onClick} aria-pressed={pressed}>
      <span className={cn("grid h-12 w-12 place-items-center rounded-full bg-white/12 text-2xl backdrop-blur", pressed && "text-rose-400")}>{icon}</span>
      <span className="text-white/85">{label}</span>
    </button>
  );
}

/* ───────── Быстрый вопрос ───────── */

function QuizView({ card, mode, userId, eventId, caption, onNext }: { card: QuizCard; mode: Mode; userId: string; eventId: string; caption: string; onNext: () => void }) {
  // Несколько вопросов (после ролика) идут по одному: ответ → разбор → следующий.
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [right, setRight] = useState(0);
  const q = card.questions[index];
  const last = index + 1 >= card.questions.length;
  const lang = mode === "en" ? "en" : "ru";
  const title = card.about ? `Проверь себя · ${card.about[lang]}` : `⚡ Быстрый вопрос · ${caption}`;

  function choose(i: number) {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.correct) setRight((n) => n + 1);
    // Ответ в ленте тоже учит: ошибка вернётся в «Учить вопросами».
    saveDrill(userId, eventId, answer(loadDrill(userId, eventId), q.id, i === q.correct, Date.now()));
  }

  return (
    <div className="absolute inset-0 flex flex-col justify-center overflow-y-auto bg-gradient-to-b from-amber-600/25 via-[#07070b] to-[#07070b] px-5 pb-16 pt-28">
      <div className="mx-auto w-full max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-300">{card.about ? "✅ " : ""}{title}</p>
        {card.questions.length > 1 && (
          <div className="mt-3 flex gap-1.5" aria-hidden>
            {card.questions.map((_, i) => <span key={i} className={cn("h-1.5 flex-1 rounded-full", i < index || (i === index && picked !== null) ? "bg-amber-300" : "bg-white/20")} />)}
          </div>
        )}
        <h2 lang="en" className="mt-3 text-xl font-bold leading-snug">{q.q}</h2>
        <div className="mt-5 space-y-2">
          {q.options.map((option, i) => {
            const ok = picked !== null && i === q.correct;
            const bad = picked === i && i !== q.correct;
            return (
              <button
                key={`${index}-${i}`}
                lang="en"
                disabled={picked !== null}
                onClick={() => choose(i)}
                className={cn(
                  "block w-full rounded-2xl border p-3 text-left text-[15px] transition",
                  ok ? "border-emerald-400 bg-emerald-500/20" : bad ? "border-red-400 bg-red-500/20" : "border-white/20 bg-white/5",
                  picked !== null && !ok && !bad && "opacity-50",
                )}
              >
                {ok && "✓ "}{bad && "✗ "}{option}
              </button>
            );
          })}
        </div>
        {picked !== null && (
          <div role="status" className="mt-4 rounded-2xl bg-white/10 p-4 text-sm">
            <p className="font-semibold">{picked === q.correct ? "Верно" : "Неверно — вопрос вернётся в «Учить вопросами»"}</p>
            <p className="mt-1 text-white/85" lang={lang}>{q.why[lang]}</p>
            {picked !== q.correct && q.wrong?.[picked] && <p className="mt-2 text-white/70" lang={lang}>{q.wrong[picked]![lang]}</p>}
            {last ? (
              <>
                {card.questions.length > 1 && <p className="mt-3 font-semibold">{`Итог: ${right} из ${card.questions.length}`}</p>}
                <button className="mt-3 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black" onClick={onNext}>Листай дальше ↓</button>
              </>
            ) : (
              <button className="mt-3 rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-black" onClick={() => { setIndex(index + 1); setPicked(null); }}>Следующий вопрос →</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
