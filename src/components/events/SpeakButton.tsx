"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import type { Lang } from "@/lib/events/types";

/** Убрать разметку конспекта: синтезатор должен читать текст, а не «решётка-решётка». */
function plain(text: string): string[] {
  return text
    .split("\n")
    .filter((line) => line.trim() && !line.startsWith("= "))
    .map((line) => line.replace(/^(## |- |> )/, "").replace(/\*+/g, "").trim());
}

/**
 * «Слушать» — конспект голосом браузера (Web Speech API): бесплатно, без
 * сервера и без ИИ. Текст отдаётся синтезатору по абзацам: длинную реплику
 * целиком Chrome обрывает примерно на пятнадцатой секунде.
 */
export default function SpeakButton({ text, lang }: { text: string; lang: Lang }) {
  const [supported, setSupported] = useState(false);
  const [state, setState] = useState<"idle" | "playing" | "paused">("idle");

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
  }, []);

  // Сменился текст или язык, либо экран закрыли — замолкаем.
  useEffect(() => {
    setState("idle");
    return () => {
      try {
        window.speechSynthesis?.cancel();
      } catch {
        /* синтезатора нет — останавливать нечего */
      }
    };
  }, [text, lang]);

  if (!supported) return null;

  function play() {
    const synth = window.speechSynthesis;
    synth.cancel();
    const lines = plain(text);
    lines.forEach((line, i) => {
      const utterance = new SpeechSynthesisUtterance(line);
      utterance.lang = lang === "ru" ? "ru-RU" : "en-US";
      if (i === lines.length - 1) utterance.onend = () => setState("idle");
      synth.speak(utterance);
    });
    setState("playing");
  }

  return (
    <div className="flex flex-wrap gap-2">
      {state === "idle" && <Button size="sm" onClick={play}>▶ Слушать</Button>}
      {state === "playing" && <Button size="sm" onClick={() => { window.speechSynthesis.pause(); setState("paused"); }}>⏸ Пауза</Button>}
      {state === "paused" && <Button size="sm" onClick={() => { window.speechSynthesis.resume(); setState("playing"); }}>▶ Продолжить</Button>}
      {state !== "idle" && <Button size="sm" variant="ghost" onClick={() => { window.speechSynthesis.cancel(); setState("idle"); }}>■ Стоп</Button>}
    </div>
  );
}
