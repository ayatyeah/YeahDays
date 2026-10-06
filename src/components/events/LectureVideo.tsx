"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import EventMusic from "@/components/EventMusic";
import NotesDiagram from "@/components/events/NotesDiagram";
import { cn } from "@/lib/cn";
import { holdFor, narration, scenes, type Scene } from "@/lib/events/scenes";
import { loadPref, savePref } from "@/lib/events/storage";
import type { Text } from "@/lib/events/types";
import { RATES, clampRate, rankVoices } from "@/lib/events/voice";

/**
 * «Видео» по части лекции: конспект проигрывается сценами — одна мысль на
 * экране, короткие переходы, голос, схемы, музыка на фоне.
 *
 * Это не видеофайл, а сцена за сценой прямо на сайте. Так оно бесплатно
 * (голос браузера, схемы из конспекта, музыка — тот же плеер, что в квизе),
 * доступно на двух языках и подстраивается под человека: скорость голоса,
 * язык, пауза в любой момент.
 *
 * Три режима языка. «Смешанный» — для подготовки к экзамену на английском:
 * заголовки и термины звучат и показываются по-английски, объяснение —
 * по-русски, а английский оригинал строки всегда виден мелким текстом.
 *
 * Сцена живёт, пока её дочитывает голос (или фиксированное время, если
 * голоса нет), и сменяется переходом. Переходы разные по очереди — глазу
 * есть за что зацепиться, и внимание не уплывает.
 */

type Mode = "mix" | "ru" | "en";
const MODES: [Mode, string][] = [["mix", "RU + термины EN"], ["en", "English"], ["ru", "Русский"]];

/** Варианты переходов — чередуются, чтобы сцены не сливались в одно движение. */
const TRANSITIONS = [
  { initial: { opacity: 0, x: 80 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -80 } },
  { initial: { opacity: 0, scale: 0.88 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 1.08 } },
  { initial: { opacity: 0, y: 60 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -60 } },
  { initial: { opacity: 0, rotateX: 25, y: 30 }, animate: { opacity: 1, rotateX: 0, y: 0 }, exit: { opacity: 0, rotateX: -20, y: -30 } },
];
/** Фон сцены меняется каждый раз — ещё один сигнал «началось новое». */
const BACKDROPS = [
  "from-violet-600/30 via-transparent to-sky-500/20",
  "from-emerald-500/25 via-transparent to-violet-500/20",
  "from-amber-500/25 via-transparent to-rose-500/20",
  "from-sky-500/25 via-transparent to-emerald-500/20",
];

export default function LectureVideo({ notes, title, lectureTitle, music, onMusic, onExit, onQuiz }: {
  notes: Text; title: Text; lectureTitle: Text; music: boolean; onMusic: () => void; onExit: () => void; onQuiz: () => void;
}) {
  const all = useMemo(() => scenes(notes, title), [notes, title]);
  // Иллюстрации добавляются отдельно от текста; которых ещё нет — в видео не попадают.
  const [missing, setMissing] = useState<Set<string>>(new Set());
  useEffect(() => {
    let alive = true;
    for (const s of all) if (s.kind === "image") {
      const img = new Image();
      img.onerror = () => { if (alive) setMissing((m) => new Set(m).add(s.src)); };
      img.src = s.src;
    }
    return () => { alive = false; };
  }, [all]);
  const list = useMemo(() => all.filter((s) => s.kind !== "image" || !missing.has(s.src)), [all, missing]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [mode, setMode] = useState<Mode>("mix");
  const [rate, setRate] = useState(1);
  const [reveal, setReveal] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [canSpeak, setCanSpeak] = useState(false);
  const run = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMode((loadPref("video-mode", "mix") as Mode) || "mix");
    setRate(clampRate(Number(loadPref("voice-rate", "1"))));
    if (!("speechSynthesis" in window)) return;
    setCanSpeak(true);
    const read = () => setVoices(window.speechSynthesis.getVoices());
    read();
    window.speechSynthesis.addEventListener?.("voiceschanged", read);
    return () => window.speechSynthesis.removeEventListener?.("voiceschanged", read);
  }, []);

  const voiceFor = useCallback((lang: "ru" | "en") => {
    const ranked = rankVoices(voices, lang);
    const saved = loadPref(`voice-${lang}`, "");
    return ranked.find((v) => v.name === saved) ?? ranked[0] ?? null;
  }, [voices]);

  const scene = list[index];
  const total = list.length;
  const done = index >= total;

  const stopSpeech = useCallback(() => {
    run.current++;
    if (timer.current) clearTimeout(timer.current);
    try { window.speechSynthesis?.cancel(); } catch { /* нет синтезатора */ }
  }, []);

  const next = useCallback(() => setIndex((i) => Math.min(total, i + 1)), [total]);

  // Проигрывание сцены: озвучить реплики по очереди, потом перейти дальше.
  // Без голоса — подождать время, рассчитанное по длине текста.
  useEffect(() => {
    stopSpeech();
    setReveal(false);
    if (!playing || !scene) return;
    const id = ++run.current;
    const lines = canSpeak ? narration(scene, mode).filter((n) => n.text) : [];
    const finish = () => {
      if (id !== run.current) return;
      // Схемы и вопросы держим дольше: их рассматривают и обдумывают.
      const extra = scene.kind === "diagram" || scene.kind === "table" ? 3500 : scene.kind === "question" ? 2500 : 500;
      timer.current = setTimeout(() => { if (id === run.current) next(); }, extra);
    };
    if (scene.kind === "question") timer.current = setTimeout(() => { if (id === run.current) setReveal(true); }, 3000);
    if (!lines.length) {
      timer.current = setTimeout(() => { if (id === run.current) next(); }, holdFor(scene) / rate);
      return;
    }
    const synth = window.speechSynthesis;
    const speak = (k: number) => {
      if (id !== run.current) return;
      if (k >= lines.length) { finish(); return; }
      const u = new SpeechSynthesisUtterance(lines[k].text);
      const voice = voiceFor(lines[k].lang);
      u.lang = voice?.lang ?? (lines[k].lang === "ru" ? "ru-RU" : "en-US");
      if (voice) u.voice = voice;
      u.rate = rate;
      u.onend = () => speak(k + 1);
      u.onerror = (e) => { if (e.error !== "interrupted" && e.error !== "canceled") speak(k + 1); };
      synth.speak(u);
    };
    // В вопросе ответ озвучивается после паузы на раздумье.
    if (scene.kind === "question") {
      const q = lines[0];
      const u = new SpeechSynthesisUtterance(q.text);
      const voice = voiceFor(q.lang);
      u.lang = voice?.lang ?? "ru-RU"; if (voice) u.voice = voice; u.rate = rate;
      u.onend = () => { if (id !== run.current) return; timer.current = setTimeout(() => {
        if (id !== run.current) return;
        setReveal(true);
        const a = new SpeechSynthesisUtterance(mode === "en" ? scene.answerEn : scene.answerRu);
        const av = voiceFor(mode === "en" ? "en" : "ru"); a.lang = av?.lang ?? "ru-RU"; if (av) a.voice = av; a.rate = rate;
        a.onend = finish; a.onerror = finish;
        synth.speak(a);
      }, 2500); };
      synth.speak(u);
      return;
    }
    speak(0);
    return stopSpeech;
    // Голоса и режим меняются редко; перезапуск сцены по ним нужен и допустим.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, playing, mode, rate, canSpeak, voices.length]);

  useEffect(() => () => stopSpeech(), [stopSpeech]);

  function changeMode(m: Mode) { setMode(m); savePref("video-mode", m); }
  function changeRate(r: number) { setRate(r); savePref("voice-rate", String(r)); }
  const go = (i: number) => { setIndex(Math.max(0, Math.min(total, i))); };

  const t = TRANSITIONS[index % TRANSITIONS.length];
  const backdrop = BACKDROPS[index % BACKDROPS.length];

  return (
    <section className="space-y-3" data-no-i18n>
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <button className="underline" onClick={() => { stopSpeech(); onExit(); }}>← К конспекту</button>
        <span className="text-[var(--color-muted)]">{lectureTitle[mode === "en" ? "en" : "ru"]}</span>
      </div>

      <div className={cn("relative overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] bg-gradient-to-br", backdrop)} style={{ minHeight: 420, perspective: 900 }}>
        <div className="absolute inset-x-0 top-0 h-1 bg-black/20" aria-hidden>
          <motion.div className="h-full bg-[var(--color-fg)]" animate={{ width: `${(Math.min(index, total) / total) * 100}%` }} transition={{ duration: 0.3 }} />
        </div>
        <div className="absolute left-4 top-3 text-xs text-[var(--color-fg-dim)] tabular-nums">{Math.min(index + 1, total)} / {total}</div>

        <AnimatePresence mode="wait">
          {done ? (
            <motion.div key="done" {...TRANSITIONS[1]} transition={{ duration: 0.4 }} className="flex min-h-[420px] flex-col items-center justify-center gap-4 p-8 text-center">
              <p className="text-3xl font-bold">{mode === "en" ? "That's the whole part" : "Это вся часть"}</p>
              <p className="text-[var(--color-fg-dim)]">{mode === "en" ? "Now check yourself with the quiz." : "Теперь проверь себя квизом."}</p>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                <Button variant="primary" onClick={() => { stopSpeech(); onQuiz(); }}>{mode === "en" ? "Start the quiz" : "Начать квиз"}</Button>
                <Button onClick={() => { go(0); setPlaying(true); }}>{mode === "en" ? "Watch again" : "Смотреть ещё раз"}</Button>
              </div>
            </motion.div>
          ) : (
            <motion.div key={index} initial={t.initial} animate={t.animate} exit={t.exit} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} className="flex min-h-[420px] flex-col justify-center p-6 pt-10 sm:p-10">
              <SceneView scene={scene} mode={mode} reveal={reveal} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" onClick={() => go(index - 1)} disabled={index === 0} aria-label="Назад">⏮</Button>
        <Button size="sm" variant="primary" onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Пауза" : "Играть"}>{playing ? "⏸ Пауза" : "▶ Играть"}</Button>
        <Button size="sm" onClick={() => go(index + 1)} disabled={done} aria-label="Дальше">⏭</Button>
        <select aria-label="Скорость" className="h-9 rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-surface-2)] px-2 text-sm" value={rate} onChange={(e) => changeRate(Number(e.target.value))}>
          {RATES.map((r) => <option key={r} value={r}>{r}×</option>)}
        </select>
        <div className="flex overflow-hidden rounded-xl border border-[var(--color-border-strong)] text-xs" role="group" aria-label="Язык видео">
          {MODES.map(([m, label]) => <button key={m} aria-pressed={mode === m} className={cn("px-3 py-2", mode === m ? "bg-[var(--color-fg)] text-[var(--color-bg)]" : "bg-[var(--color-surface-2)]")} onClick={() => changeMode(m)}>{label}</button>)}
        </div>
        <button className={cn("rounded-xl border border-[var(--color-border-strong)] px-3 py-2 text-xs", music ? "bg-[var(--color-surface)]" : "bg-[var(--color-surface-2)] text-[var(--color-fg-dim)]")} aria-pressed={music} onClick={onMusic}>{music ? "♪ Музыка: вкл" : "♪ Музыка: выкл"}</button>
      </div>
      {!canSpeak && <p className="text-xs text-[var(--color-muted)]">В этом браузере нет синтеза речи — сцены сменяются по таймеру, без голоса.</p>}
      {music && <EventMusic />}
    </section>
  );
}

/* ────────────────────────  Сцены  ──────────────────────── */

function Pair({ ru, en, mode, size = "text-2xl sm:text-3xl" }: { ru: string; en: string; mode: Mode; size?: string }) {
  if (mode === "en") return <p className={cn("font-semibold leading-snug", size)} lang="en">{en}</p>;
  if (mode === "ru") return <p className={cn("font-semibold leading-snug", size)} lang="ru">{ru}</p>;
  return (
    <>
      <p className={cn("font-semibold leading-snug", size)} lang="ru">{ru}</p>
      <p className="mt-4 text-sm leading-relaxed text-[var(--color-fg-dim)]" lang="en">{en}</p>
    </>
  );
}

function SceneView({ scene, mode, reveal }: { scene: Scene; mode: Mode; reveal: boolean }) {
  switch (scene.kind) {
    case "title":
      return (
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-fg-dim)]">{mode === "ru" ? "Раздел" : "Section"}</p>
          <p className="mt-3 text-3xl font-bold leading-tight sm:text-4xl" lang="en">{mode === "ru" ? scene.ru : scene.en}</p>
          {mode === "mix" && <p className="mt-3 text-lg text-[var(--color-fg-dim)]" lang="ru">{scene.ru}</p>}
        </div>
      );
    case "bullet":
      return (
        <div>
          <div className="mb-4 flex gap-1.5" aria-hidden>{Array.from({ length: scene.total }, (_, i) => <span key={i} className={cn("h-1.5 w-6 rounded-full", i < scene.index ? "bg-[var(--color-fg)]" : "bg-[var(--color-fg)]/20")} />)}</div>
          <Pair ru={scene.ru} en={scene.en} mode={mode} />
        </div>
      );
    case "text":
      return <Pair ru={scene.ru} en={scene.en} mode={mode} />;
    case "quote":
      return (
        <div className="rounded-2xl border-l-4 border-violet-400 bg-black/20 p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-300">{mode === "en" ? "Remember" : "Запомни"}</p>
          <div className="mt-2"><Pair ru={scene.ru} en={scene.en} mode={mode} size="text-xl sm:text-2xl" /></div>
        </div>
      );
    case "code":
      return <pre className="overflow-x-auto rounded-2xl bg-black/40 p-5 font-mono text-lg leading-relaxed sm:text-xl">{scene.code}</pre>;
    case "diagram":
      return <div className="[&_figure]:border-0 [&_figure]:bg-transparent"><NotesDiagram name={scene.name} lang={mode === "en" ? "en" : "ru"} /></div>;
    case "table": {
      const rows = mode === "en" ? scene.en : scene.ru;
      const [head, ...body] = rows;
      return (
        <table className="w-full text-sm sm:text-base">
          <thead><tr>{head.map((h, i) => <th key={i} className="border-b border-white/20 px-2 py-2 text-left font-semibold">{h}</th>)}</tr></thead>
          <tbody>{body.slice(0, 8).map((r, k) => <tr key={k}>{r.map((c, i) => <td key={i} className="border-b border-white/10 px-2 py-2 align-top">{c}</td>)}</tr>)}</tbody>
        </table>
      );
    }
    case "question":
      return (
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-300">{mode === "en" ? "Question" : "Вопрос"}</p>
          <div className="mt-2"><Pair ru={scene.ru} en={scene.en} mode={mode} size="text-xl sm:text-2xl" /></div>
          <AnimatePresence>
            {reveal && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-5 rounded-2xl bg-emerald-500/20 p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-300">{mode === "en" ? "Answer" : "Ответ"}</p>
                <p className="mt-1 text-lg">{mode === "en" ? scene.answerEn : scene.answerRu}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    case "image":
      return (
        <figure className="text-center">
          <img src={scene.src} alt={mode === "en" ? scene.en : scene.ru} className="mx-auto max-h-72 rounded-2xl" />
          <figcaption className="mt-3 text-sm text-[var(--color-fg-dim)]">{mode === "en" ? scene.en : scene.ru}</figcaption>
        </figure>
      );
  }
}
