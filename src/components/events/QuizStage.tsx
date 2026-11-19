'use client';
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { QuestionLanguage } from './QuestionLanguage';
import DenYouTube from './DenYouTube';
import { denVideos, youtubeVideoId } from '@/lib/events/denVideos';
import styles from './quiz-stage.module.css';

/** Video stays mounted across questions; it never downloads before opting in. */
export default function QuizStage({ children, questionTexts }: { children: ReactNode; questionTexts?: string[] }) {
  const [enabled, setEnabled] = useState(false);
  const [source, setSource] = useState(denVideos[0].id);
  const [custom, setCustom] = useState('');
  const [urlError, setUrlError] = useState(false);
  const [failed, setFailed] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const resume = useRef(false);
  const id = useId();
  useEffect(() => {
    if (!enabled || source !== 'local') return;
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
  }, [enabled, source]);
  const content = <div className={styles.stage}>
    <div className={styles.toolbar}><button type="button" aria-pressed={enabled} aria-controls={id} onClick={() => { setFailed(false); setEnabled(value => !value); }}>▸ DenMode{enabled ? ' · вкл' : ''}</button></div>
    <div className={enabled ? `${styles.split} ${source !== 'local' ? styles.youtubeSplit : ''}` : styles.solo}>
      <div className={styles.question}>{children}</div>
      {enabled && <aside id={id} className={styles.player} aria-label="DenMode — залипалка">
        <span>DenMode · Залипалка</span>
        <label className={styles.source}>Что смотреть<select value={source} onChange={e => { setSource(e.target.value); setFailed(false); }}>{denVideos.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}<option value="local">Subway Surfers · скачанное видео</option>{source !== 'local' && !denVideos.some(item => item.id === source) && <option value={source}>Твоё видео YouTube</option>}</select></label>
        <details className={styles.custom}><summary>Своя ссылка YouTube</summary><form onSubmit={e => { e.preventDefault(); const parsed = youtubeVideoId(custom.trim()); setUrlError(!parsed); if (parsed) setSource(parsed); }}><label>Ссылка на видео<input type="url" value={custom} onChange={e => setCustom(e.target.value)} placeholder="https://youtu.be/…" required/></label><button type="submit">Включить</button>{urlError && <p role="alert">Нужна ссылка на видео YouTube или Shorts.</p>}</form></details>
        {source !== 'local' ? <DenYouTube key={source} videoId={source}/> : failed ? <p role="alert">Видео не загрузилось. Выключи и включи DenMode, чтобы повторить.</p> : <video ref={video} src="/video/denmode-subway.mp4" autoPlay muted loop playsInline controls preload="metadata" onError={() => setFailed(true)} aria-label="Прохождение Subway Surfers без звука" />}
        <small>Можно поставить на паузу или выключить DenMode.</small>
      </aside>}
    </div>
  </div>;
  return <QuestionLanguage sourceTexts={questionTexts}>{content}</QuestionLanguage>;
}
