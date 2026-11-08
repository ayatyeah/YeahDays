"use client";

import { useEffect, useRef, useState } from "react";

const root = "/events/computer-networks-endterm/stories";

/** A focused story about MTU; this is not a replacement for the full module. */
export default function NetworkStoryClip() {
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);
  const player = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const element = player.current;
    return () => element?.pause();
  }, [open]);
  return <details className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-5" onToggle={e => { if (!e.currentTarget.open) player.current?.pause(); setOpen(e.currentTarget.open); }}>
    <summary className="cursor-pointer font-semibold">🎬 История: пакет не пролезает · MTU и IPv6</summary>
    <p className="mt-2 text-sm text-[var(--color-muted)]">Аян, Сара, инспектор Порт Петрович и Арпи разбираются, почему скорость не поможет слишком большому пакету. С юмором и закадровым смехом.</p>
    {open && <div className="mt-4 space-y-3">
      <video ref={player} controls playsInline preload="metadata" poster={`${root}/packet-too-big-v3.jpg`} src={`${root}/packet-too-big-v3.mp4`} aria-label="История: пакет не пролезает" className="aspect-video w-full rounded-xl bg-black" onError={() => setFailed(true)}>
        <track kind="captions" src={`${root}/packet-too-big-v3.vtt`} srcLang="ru" label="Русский" />
      </video>
      {failed && <p role="alert" className="text-sm">Не удалось загрузить плеер. Видео можно открыть по ссылке ниже.</p>}
      <div className="flex flex-wrap gap-4 text-sm underline"><a href={`${root}/packet-too-big-v3.mp4`} download>Скачать историю</a><a href={`${root}/packet-too-big-v3.vtt`} download>Субтитры</a></div>
    </div>}
  </details>;
}
