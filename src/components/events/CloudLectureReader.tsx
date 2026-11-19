'use client';
import { useEffect } from 'react';
import type { StudyEvent } from '@/lib/events/types';
import type { FinalNotebook } from '@/lib/events/finals';
import { lectureBrief } from '@/lib/events/cloudReader/briefs';
import { useTutorFocus } from '@/lib/tutorFocus';
import EventNotes from '@/components/EventNotes';
import TopicLearningModes from './TopicLearningModes';
import { useNotebookHash } from './useNotebookHash';
import styles from './study-folders.module.css';

export default function CloudLectureReader({ event, notebook, lang, signedIn }: { event: StudyEvent; notebook: FinalNotebook; lang: 'ru'|'en'; signedIn: boolean }) {
  const hash = useNotebookHash();
  const [, lectureId, requestedMode, partId] = hash.split('/');
  const legacy = event.lectures.find(lecture => lecture.parts.some(part => part.id === hash));
  const lecture = legacy ?? event.lectures.find(lecture => lecture.id === lectureId);
  const mode = requestedMode === 'short' ? 'short' : 'detailed';
  const part = lecture?.parts.find(part => part.id === (legacy ? hash : partId)) ?? lecture?.parts[0];
  useEffect(() => {
    useTutorFocus.getState().setBase({ view: 'read', partId: part?.id, step: lecture?.title[lang] ?? 'Cloud Computing · лекции' });
    useTutorFocus.getState().setDetail({});
  }, [part?.id, lecture, lang]);
  if (!lecture || !part) return <section className={styles.root} aria-label="Папки лекций">
    <p>Сначала выбери лекцию. Внутри — её темы и две версии конспекта.</p>
    <nav className={styles.grid} aria-label="Лекции Cloud Computing">{event.lectures.map(lecture => <a className={styles.folder} href={`#lectures/${lecture.id}/detailed`} key={lecture.id}><strong>{lecture.title[lang]}</strong><small>Тем: {lecture.parts.length} · Кратко / Подробно</small><span aria-hidden="true">Открыть папку →</span></a>)}</nav>
  </section>;
  const href = (nextMode: string, nextPart = part.id) => `#lectures/${lecture.id}/${nextMode}/${nextPart}`;
  return <section className={styles.root} aria-label="Выбранная лекция">
    <a className={styles.back} href="#lectures">← К папкам лекций</a>
    <h2 className={styles.heading}>{lecture.title[lang]}</h2>
    <nav className={styles.mode} aria-label="Объём лекции"><a href={href('short')} aria-current={mode === 'short' ? 'page' : undefined}>Короткая лекция</a><a href={href('detailed')} aria-current={mode === 'detailed' ? 'page' : undefined}>Подробная лекция</a></nav>
    {mode === 'short' ? <div>{lecture.parts.map(item => <article className={styles.brief} key={item.id}><h3>{item.title[lang]}</h3><EventNotes text={lectureBrief(item,lang)} lang={lang}/><a className={styles.back} href={href('detailed',item.id)}>Разобрать тему подробно →</a></article>)}</div> : <>
      <label className={styles.mobileTopic}>Тема этой лекции<select value={part.id} onChange={event => { window.location.hash = href('detailed',event.target.value).slice(1); }}>{lecture.parts.map(item => <option key={item.id} value={item.id}>{item.title[lang]}</option>)}</select></label>
      <div className={styles.layout}>
        <nav className={styles.contents} aria-label="Темы выбранной лекции">{lecture.parts.map((item,index) => <a key={item.id} href={href('detailed',item.id)} aria-current={item.id === part.id ? 'page' : undefined}>{index + 1}. {item.title[lang]}</a>)}</nav>
        <article className="g-note-paper" key={part.id}><h3 className={styles.heading}>{part.title[lang]}</h3><TopicLearningModes title={part.title[lang]} lang={lang} signedIn={signedIn}><div data-selection-notes lang={lang}><EventNotes text={part.notes[lang]} lang={lang} translation={lang === 'en' ? part.notes.ru : undefined}/></div></TopicLearningModes>
          <nav className={styles.mode} aria-label="Переход между темами">{lecture.parts.indexOf(part) > 0 && <a href={href('detailed',lecture.parts[lecture.parts.indexOf(part)-1].id)}>← Предыдущая тема</a>}{lecture.parts.indexOf(part) < lecture.parts.length - 1 && <a href={href('detailed',lecture.parts[lecture.parts.indexOf(part)+1].id)}>Следующая тема →</a>}</nav>
        </article>
      </div>
    </>}
    <details className="g-note-sources"><summary>Оригинал лекции</summary><ul>{notebook.sources.filter(source => source.lectureId === lecture.id).map(source => <li key={source.id}><a href={source.url} target="_blank" rel="noreferrer">{source.title}</a></li>)}</ul></details>
  </section>;
}
