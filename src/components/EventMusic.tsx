"use client";

import { useEffect, useRef, useState } from "react";
import { TRACK, loadYouTube, rememberPosition, savedPosition, type YouTubePlayer } from "@/lib/events/music";

/**
 * Карточка с музыкой для квиза: официальное видео трека во встроенном
 * плеере YouTube. Монтируется при старте квиза, размонтируется при выходе
 * или выключении музыки — так плеер живёт ровно столько, сколько квиз.
 *
 * Автовоспроизведение со звуком браузер разрешает после действия человека;
 * кнопка «Начать квиз» им и была. Там, где этого мало (iPhone), плеер
 * покажет свою кнопку Play — он виден, и нажать её можно.
 */
export default function EventMusic() {
  const box = useRef<HTMLDivElement>(null);
  const player = useRef<YouTubePlayer | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    loadYouTube()
      .then((YT) => {
        if (!alive || !box.current) return;
        const mount = document.createElement("div");
        box.current.appendChild(mount);
        player.current = new YT.Player(mount, {
          videoId: TRACK.id,
          host: "https://www.youtube-nocookie.com",
          width: "100%",
          height: "100%",
          playerVars: { autoplay: 1, playsinline: 1, loop: 1, playlist: TRACK.id, rel: 0, start: savedPosition(), origin: window.location.origin },
          events: {
            onReady: (e) => {
              e.target.setVolume(40);
              e.target.playVideo();
            },
            // Состояние плеера наружу — для проверок; на вид не влияет.
            onStateChange: (e) => box.current?.setAttribute("data-player-state", String(e.data)),
            onError: () => setFailed(true),
          },
        });
      })
      .catch(() => {
        if (alive) setFailed(true);
      });
    return () => {
      alive = false;
      try {
        rememberPosition(player.current?.getCurrentTime() ?? 0);
        player.current?.destroy();
      } catch {
        /* плеер мог не успеть создаться */
      }
      player.current = null;
    };
  }, []);

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
      <div ref={box} data-testid="event-music" className="h-[220px] w-full overflow-hidden rounded-xl bg-black [&_iframe]:h-full [&_iframe]:w-full" />
      <p className="mt-2 text-xs text-[var(--color-muted)]">
        ♪ {TRACK.artist} — {TRACK.title} ·{" "}
        <a href={TRACK.url} target="_blank" rel="noreferrer" className="underline">YouTube</a>
        {failed && " · плеер не загрузился, квиз работает без музыки"}
      </p>
    </div>
  );
}
