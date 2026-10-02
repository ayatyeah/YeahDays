/**
 * Музыка в квизе — официальная загрузка трека на YouTube во встроенном
 * плеере.
 *
 * Почему не mp3 на сайте: трек коммерческий, выложить файл для всех
 * пользователей значило бы распространять чужую музыку без лицензии.
 * Встраивание официального видео YouTube разрешено автором через саму
 * платформу, артист получает просмотры, а на сайте нет ни одного байта
 * чужого аудио.
 *
 * Правила YouTube требуют, чтобы плеер был виден и не меньше 200×200 —
 * поэтому это карточка с видео в шапке квиза, а не скрытый аудио-поток.
 * Хост youtube-nocookie.com — режим без рекламных cookie.
 */

export const TRACK = {
  id: "achi9ONHVt4",
  title: "Lofi girl",
  artist: "Егор Крид",
  url: "https://www.youtube.com/watch?v=achi9ONHVt4",
};

export interface YouTubePlayer {
  playVideo(): void;
  pauseVideo(): void;
  destroy(): void;
  getCurrentTime(): number;
  setVolume(volume: number): void;
}

interface PlayerEvent { target: YouTubePlayer; data: number }

export interface YouTubeApi {
  Player: new (
    element: HTMLElement,
    options: {
      videoId: string;
      host?: string;
      width?: string | number;
      height?: string | number;
      playerVars?: Record<string, string | number>;
      events?: { onReady?: (e: PlayerEvent) => void; onStateChange?: (e: PlayerEvent) => void; onError?: (e: PlayerEvent) => void };
    },
  ) => YouTubePlayer;
}

declare global {
  interface Window {
    YT?: YouTubeApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let api: Promise<YouTubeApi> | null = null;

/** Скрипт IFrame API грузится один раз и только когда музыка действительно нужна. */
export function loadYouTube(): Promise<YouTubeApi> {
  if (api) return api;
  api = new Promise((resolve, reject) => {
    if (window.YT?.Player) {
      resolve(window.YT);
      return;
    }
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      if (window.YT) resolve(window.YT);
      else reject(new Error("YouTube API missing"));
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = () => {
      api = null;
      reject(new Error("YouTube API failed to load"));
    };
    document.head.appendChild(script);
  });
  return api;
}

// Позиция трека между квизами: новый квиз продолжает песню, а не начинает
// её с первой секунды в пятый раз.
let position = 0;
export const rememberPosition = (seconds: number) => {
  if (Number.isFinite(seconds) && seconds > 0) position = seconds;
};
export const savedPosition = () => Math.floor(position);
