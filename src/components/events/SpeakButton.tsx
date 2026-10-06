"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import { loadPref, savePref } from "@/lib/events/storage";
import type { Lang } from "@/lib/events/types";
import { RATES, clampRate, rankVoices } from "@/lib/events/voice";

/** Убрать разметку конспекта: синтезатор должен читать текст, а не «решётка-решётка». */
function plain(text: string): string[] {
  return text
    .split("\n")
    // Таблицы, схемы, иллюстрации и ответы на самопроверку голосом не читаются: таблица
    // превратилась бы в поток слов без строк, а ответ — в подсказку раньше вопроса.
    .filter((line) => line.trim() && !/^(= |\||@|!\[|\?= )/.test(line))
    .map((line) => line.replace(/^(## |- |> |\?\? )/, "").replace(/\*+/g, "").trim());
}

const select = "h-9 min-w-0 rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-surface-2)] px-2 text-sm";

/**
 * «Слушать» — конспект голосом браузера (Web Speech API): бесплатно, без
 * сервера и без ИИ.
 *
 * Голос. По умолчанию браузер берёт первый голос языка, и часто это старый
 * «робот», хотя на устройстве есть нормальный. Мы сами выбираем лучший из
 * установленных (см. lib/events/voice.ts) и даём сменить его в списке;
 * выбор и скорость запоминаются на устройстве.
 *
 * Чтение идёт по одному абзацу: следующий отдаётся синтезатору, когда
 * закончился предыдущий. Так смена скорости или голоса применяется сразу —
 * с текущего абзаца, а не с начала, — и длинный текст не обрывается
 * (Chrome глушит реплику длиннее ~15 секунд).
 */
export default function SpeakButton({ text, lang }: { text: string; lang: Lang }) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [supported, setSupported] = useState(false);
  const [state, setState] = useState<"idle" | "playing" | "paused">("idle");
  const [rate, setRate] = useState(1);
  const [voiceName, setVoiceName] = useState("");
  const lines = useMemo(() => plain(text), [text]);
  const position = useRef(0);
  // Номер запуска: реплика отменённого запуска всё равно присылает onend,
  // и без этой метки она запускала бы чтение дальше поверх нового.
  const run = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    setSupported(true);
    setRate(clampRate(Number(loadPref("voice-rate", "1"))));
    // Список голосов в Chrome приходит не сразу, а событием.
    const read = () => setVoices(window.speechSynthesis.getVoices());
    read();
    window.speechSynthesis.addEventListener?.("voiceschanged", read);
    return () => window.speechSynthesis.removeEventListener?.("voiceschanged", read);
  }, []);

  const ranked = useMemo(() => rankVoices(voices, lang), [voices, lang]);
  useEffect(() => setVoiceName(loadPref(`voice-${lang}`, "")), [lang]);
  const voice = ranked.find((v) => v.name === voiceName) ?? ranked[0] ?? null;

  const stop = useCallback(() => {
    run.current++;
    try {
      window.speechSynthesis?.cancel();
    } catch {
      /* синтезатора нет — останавливать нечего */
    }
    setState("idle");
  }, []);

  // Сменился текст или язык, либо экран закрыли — замолкаем.
  useEffect(() => {
    position.current = 0;
    return stop;
  }, [text, lang, stop]);

  function speakFrom(index: number, withRate = rate, withVoice: SpeechSynthesisVoice | null = voice) {
    const synth = window.speechSynthesis;
    const id = ++run.current;
    synth.cancel();
    const next = (i: number) => {
      if (id !== run.current) return;
      if (i >= lines.length) {
        position.current = 0;
        setState("idle");
        return;
      }
      position.current = i;
      const utterance = new SpeechSynthesisUtterance(lines[i]);
      utterance.lang = withVoice?.lang ?? (lang === "ru" ? "ru-RU" : "en-US");
      if (withVoice) utterance.voice = withVoice;
      utterance.rate = withRate;
      utterance.onend = () => next(i + 1);
      utterance.onerror = (event) => {
        // «interrupted» и «canceled» — это мы сами остановили чтение.
        if (id === run.current && event.error !== "interrupted" && event.error !== "canceled") setState("idle");
      };
      synth.speak(utterance);
    };
    next(index);
    setState("playing");
  }

  function changeRate(value: number) {
    setRate(value);
    savePref("voice-rate", String(value));
    if (state !== "idle") speakFrom(position.current, value);
  }

  function changeVoice(name: string) {
    setVoiceName(name);
    savePref(`voice-${lang}`, name);
    if (state !== "idle") speakFrom(position.current, rate, ranked.find((v) => v.name === name) ?? null);
  }

  if (!supported) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {state === "idle" && <Button size="sm" onClick={() => speakFrom(0)}>▶ Слушать</Button>}
      {state === "playing" && <Button size="sm" onClick={() => { window.speechSynthesis.pause(); setState("paused"); }}>⏸ Пауза</Button>}
      {state === "paused" && <Button size="sm" onClick={() => { window.speechSynthesis.resume(); setState("playing"); }}>▶ Продолжить</Button>}
      {state !== "idle" && <Button size="sm" variant="ghost" onClick={() => { position.current = 0; stop(); }}>■ Стоп</Button>}
      <select aria-label="Скорость озвучки" className={select} value={rate} onChange={(e) => changeRate(Number(e.target.value))}>
        {RATES.map((r) => <option key={r} value={r}>{r === 1 ? "Скорость 1×" : `${r}×`}</option>)}
      </select>
      {ranked.length > 1 && (
        <select aria-label="Голос" data-no-i18n className={`${select} max-w-[11rem]`} value={voice?.name ?? ""} onChange={(e) => changeVoice(e.target.value)}>
          {ranked.map((v) => <option key={v.name} value={v.name}>{v.name.replace(/^(Microsoft|Google)\s+/, "").replace(/\s+-\s+.*$/, "")}</option>)}
        </select>
      )}
    </div>
  );
}
