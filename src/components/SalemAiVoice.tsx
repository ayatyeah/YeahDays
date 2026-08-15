"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/cn";

type State = "idle" | "recording" | "thinking" | "speaking" | "error";

interface Turn {
  id: string;
  you: string;
  reply: string;
}

/** Первый поддерживаемый MediaRecorder-формат — Safari не умеет webm, только mp4. */
function pickMimeType(): string | undefined {
  const candidates = ["audio/mp4", "audio/webm"];
  for (const type of candidates) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }
  return undefined;
}

function speak(text: string, onDone: () => void) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    onDone();
    return;
  }
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "ru-RU";
  const ru = window.speechSynthesis.getVoices().find((v) => v.lang.startsWith("ru"));
  if (ru) utter.voice = ru;
  utter.onend = onDone;
  utter.onerror = onDone;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

/**
 * Голосовая команда СалемАй прямо в PWA — независимо от десктоп-приложения
 * (то может быть выключено). Тап — запись, тап — стоп: без детекции тишины
 * ради простоты и предсказуемости на телефоне, где фоновый шум непредсказуем.
 * Распознавание — сервер (Whisper, см. /api/voice/transcribe), ответ
 * читает сам браузер (speechSynthesis) — не гонять ещё один платный TTS-
 * запрос ради голоса, который и так неплохо звучит на iOS/Android из коробки.
 *
 * ?autostart=1 в адресе запускает запись сразу при открытии страницы —
 * настоящий "Привет, Siri, СалемАй" с PWA не сделать (SiriKit/App Intents
 * требуют нативное приложение), но через Команды (Shortcuts) можно
 * повесить свою голосовую фразу на "Открыть URL: .../didi?autostart=1" —
 * по факту голосовой вызов одной фразой, без ручного тапа по кнопке.
 */
export default function SalemAiVoice() {
  const searchParams = useSearchParams();
  const [state, setState] = useState<State>("idle");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const autostartedRef = useRef(false);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const startRecording = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType = pickMimeType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => void handleRecorded(mimeType);
      mediaRecorderRef.current = recorder;
      recorder.start();
      setState("recording");
    } catch {
      setError("Нет доступа к микрофону — разреши в настройках браузера.");
      setState("error");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    stopStream();
  }, [stopStream]);

  useEffect(() => {
    if (autostartedRef.current) return;
    if (searchParams.get("autostart") !== "1") return;
    autostartedRef.current = true;
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    void startRecording();
  }, [searchParams, startRecording]);

  async function handleRecorded(mimeType: string | undefined) {
    setState("thinking");
    try {
      const blob = new Blob(chunksRef.current, { type: mimeType || "audio/webm" });
      if (blob.size < 1000) {
        setError("Не расслышала — попробуй ещё раз.");
        setState("idle");
        return;
      }

      const form = new FormData();
      form.append("audio", blob, `voice.${mimeType?.includes("mp4") ? "mp4" : "webm"}`);
      const transcribeRes = await fetch("/api/voice/transcribe", { method: "POST", body: form });
      const transcribeJson = (await transcribeRes.json()) as { text?: string; error?: string };
      if (!transcribeRes.ok || !transcribeJson.text) {
        setError(transcribeJson.error || "Не получилось распознать речь.");
        setState("error");
        return;
      }

      const chatRes = await fetch("/api/voice/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: transcribeJson.text }),
      });
      const chatJson = (await chatRes.json()) as { reply?: string; error?: string };
      if (!chatRes.ok || !chatJson.reply) {
        setError(chatJson.error || "Не получилось получить ответ.");
        setState("error");
        return;
      }

      const turn: Turn = { id: `${Date.now()}`, you: transcribeJson.text, reply: chatJson.reply };
      setTurns((prev) => [...prev.slice(-4), turn]);
      setState("speaking");
      speak(chatJson.reply, () => setState("idle"));
    } catch {
      setError("Сеть подвела — попробуй ещё раз.");
      setState("error");
    }
  }

  const busy = state === "thinking" || state === "speaking";

  return (
    <section ref={sectionRef} className="rounded-3xl surface p-4">
      <h2 className="mb-3 text-[13px] font-semibold text-[var(--color-fg-dim)]">Голосом</h2>
      <p className="mb-4 text-[11.5px] leading-snug text-[var(--color-muted)]">
        Работает прямо здесь, даже если ноутбук с десктоп-приложением выключен.
      </p>

      <div className="flex flex-col items-center gap-3 py-2">
        <button
          type="button"
          onClick={() => (state === "recording" ? stopRecording() : void startRecording())}
          disabled={busy}
          aria-label={state === "recording" ? "Остановить запись" : "Начать запись"}
          className={cn(
            "press flex h-20 w-20 items-center justify-center rounded-full text-[28px] transition disabled:opacity-50",
            state === "recording"
              ? "animate-pulse bg-[var(--color-strength)] text-white"
              : "bg-[var(--color-fg)] text-[var(--color-bg)]",
          )}
        >
          {state === "recording" ? "◼" : "🎙️"}
        </button>
        <p className="text-[12.5px] text-[var(--color-muted)]">
          {state === "idle" && "Нажми и скажи команду"}
          {state === "recording" && "Слушаю… нажми, чтобы остановить"}
          {state === "thinking" && "Секунду…"}
          {state === "speaking" && "Отвечаю…"}
          {state === "error" && (error ?? "Что-то пошло не так")}
        </p>
      </div>

      {turns.length > 0 && (
        <div className="mt-2 flex flex-col gap-2.5 border-t border-[var(--color-border)] pt-3">
          {turns.map((t) => (
            <div key={t.id} className="text-[12.5px] leading-snug">
              <p className="text-[var(--color-muted)]">Ты: {t.you}</p>
              <p className="mt-0.5 font-medium">СалемАй: {t.reply}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
