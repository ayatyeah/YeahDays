'use client';
import { useEffect, useRef, useState } from 'react';
import { loadYouTube, type YouTubePlayer } from '@/lib/events/music';
import styles from './quiz-stage.module.css';

export default function DenYouTube({ videoId }: { videoId: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let alive = true;
    let player: YouTubePlayer | null = null;
    let playing = false;
    let resume = false;
    const timer = setTimeout(() => { if (alive) setFailed(true); }, 20000);
    const visibility = () => {
      if (document.hidden) { resume = playing; player?.pauseVideo(); }
      else if (resume) { resume = false; player?.playVideo(); }
    };
    document.addEventListener('visibilitychange', visibility);
    loadYouTube().then(YT => {
      if (!alive || !box.current) return;
      const mount = document.createElement('div');
      box.current.appendChild(mount);
      player = new YT.Player(mount, {
        videoId, host: 'https://www.youtube-nocookie.com', width: '100%', height: '100%',
        playerVars: { autoplay: 1, mute: 1, playsinline: 1, loop: 1, playlist: videoId, rel: 0, origin: window.location.origin },
        events: {
          onReady: e => { clearTimeout(timer); if (!alive) return; setFailed(false); e.target.setVolume(0); if (!document.hidden) e.target.playVideo(); },
          onStateChange: e => { playing = e.data === 1; box.current?.setAttribute('data-player-state', String(e.data)); },
          onError: () => { clearTimeout(timer); if (alive) setFailed(true); },
        },
      });
    }).catch(() => { clearTimeout(timer); if (alive) setFailed(true); });
    return () => { alive = false; clearTimeout(timer); document.removeEventListener('visibilitychange', visibility); try { player?.destroy(); } catch {} };
  }, [videoId]);
  return <div className={styles.youtube}>
    <div ref={box} className={styles.youtubeFrame} data-testid="den-youtube" />
    {failed && <p role="status">YouTube не открыл это видео. Выбери другое или скачанный Subway Surfers.</p>}
    <a href={`https://www.youtube.com/watch?v=${videoId}`} target="_blank" rel="noreferrer">Открыть на YouTube ↗</a>
    <small>Без звука, чтобы не мешать музыке. Если не запустилось — нажми ▶ в плеере.</small>
  </div>;
}
