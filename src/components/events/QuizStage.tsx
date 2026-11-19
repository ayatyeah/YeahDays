'use client';
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import styles from './quiz-stage.module.css';

/** Video stays mounted across questions; it never downloads before opting in. */
export default function QuizStage({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const [failed, setFailed] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const resume = useRef(false);
  const id = useId();
  useEffect(() => {
    if (!enabled) return;
    let inView = true;
    const visibility = () => {
      const player = video.current;
      if (!player) return;
      if (document.hidden || !inView) { if (!player.paused) resume.current = true; player.pause(); }
      else if (resume.current) { resume.current = false; void player.play().catch(() => {}); }
    };
    document.addEventListener('visibilitychange', visibility);
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; visibility(); });
    if (video.current) observer.observe(video.current);
    return () => { observer.disconnect(); resume.current = false; document.removeEventListener('visibilitychange', visibility); };
  }, [enabled]);
  return <div className={styles.stage}>
    <div className={styles.toolbar}><button type="button" aria-pressed={enabled} aria-controls={id} onClick={() => { setFailed(false); setEnabled(value => !value); }}>▸ DenMode{enabled ? ' · вкл' : ''}</button></div>
    <div className={enabled ? styles.split : styles.solo}>
      <div className={styles.question}>{children}</div>
      {enabled && <aside id={id} className={styles.player} aria-label="DenMode — Subway Surfers">
        <span>DenMode · Subway Surfers</span>
        {failed ? <p role="alert">Видео не загрузилось. Выключи и включи DenMode, чтобы повторить.</p> : <video ref={video} src="/video/denmode-subway.mp4" autoPlay muted loop playsInline controls preload="metadata" onError={() => setFailed(true)} aria-label="Прохождение Subway Surfers без звука" />}
        <small>Можно поставить на паузу или выключить DenMode.</small>
      </aside>}
    </div>
  </div>;
}
