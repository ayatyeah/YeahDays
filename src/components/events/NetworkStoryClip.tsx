"use client";

import { useEffect, useRef, useState } from "react";
import season from "@/lib/events/computerNetworksEndterm/story-season.json";

const clock = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;

export default function NetworkStoryClip({ partId, initiallyOpen = false }: { partId: string; initiallyOpen?: boolean }) {
  const episode = season.find(item => item.partId === partId);
  const [open, setOpen] = useState(initiallyOpen);
  const [failed, setFailed] = useState(false);
  const player = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const element = player.current;
    return () => element?.pause();
  }, [open, partId]);
  if (!episode) return null;
  return <details open={open} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-5" onToggle={e => { if (!e.currentTarget.open) player.current?.pause(); setOpen(e.currentTarget.open); }}>
    <summary className="cursor-pointer font-semibold">🎬 История: {episode.title} · {clock(episode.duration)}</summary>
    <p className="mt-2 text-sm text-[var(--color-muted)]">Полный разбор этой части: приключения Аяна, Порта Петровича и Арпи, примеры, анимация и закадровый смех. Озвучка на русском.</p>
    {open && <div className="mt-4 space-y-3">
      <video ref={player} controls playsInline preload="metadata" poster={`${episode.base}.jpg`} src={`${episode.base}.mp4`} aria-label={`История: ${episode.title}`} className="aspect-video w-full rounded-xl bg-black" onError={() => setFailed(true)}>
        <track kind="captions" src={`${episode.base}.vtt`} srcLang="ru" label="Русский" />
      </video>
      {failed && <p role="alert" className="text-sm">Не удалось загрузить плеер. Видео можно открыть по ссылке ниже.</p>}
      <details className="rounded-xl border border-[var(--color-border)] p-3">
        <summary className="cursor-pointer text-sm font-semibold">Главы · {episode.chapters.length}</summary>
        <div className="mt-2 grid gap-1 sm:grid-cols-2">{episode.chapters.map(chapter => <button type="button" key={chapter.start} className="rounded-lg px-3 py-2 text-left text-sm hover:bg-[var(--color-border)]" onClick={() => { if (player.current) { player.current.currentTime = chapter.start; player.current.focus(); } }}><span className="mr-2 tabular-nums text-[var(--color-muted)]">{clock(chapter.start)}</span>{chapter.title}</button>)}</div>
      </details>
      <div className="flex flex-wrap gap-4 text-sm underline"><a href={`${episode.base}.mp4`} download>Скачать историю</a><a href={`${episode.base}.vtt`} download>Субтитры</a><a href={`${episode.base}.txt`} download>Текст диалогов</a></div>
    </div>}
  </details>;
}
