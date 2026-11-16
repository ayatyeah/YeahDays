'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import EventNotes from '@/components/EventNotes';
import { Icon } from '@/components/final/Brand';
import { eventCourseHref } from '@/lib/events/courses';
import type { StudyEvent } from '@/lib/events/types';
import type { FinalNotebook } from '@/lib/events/finals';
import dynamic from 'next/dynamic';
import { useTutorFocus } from '@/lib/tutorFocus';
import NotesToolbar from './NotesToolbar';
import SelectionMenu from './SelectionMenu';
import Tutor from './Tutor';
import styles from './notebook-navigation.module.css';
const CvFinalPrep = dynamic(() => import('./CvFinalPrep'));
const NetworkStoryClip = dynamic(() => import('./NetworkStoryClip'));

/** Reading-only course materials: no assessment bank is imported by this view. */
export default function LectureNotebook({ event, notebook }: { event: StudyEvent; notebook: FinalNotebook }) {
  const { data: session } = useSession();
  const parts = useMemo(() => event.lectures.flatMap(lecture => lecture.parts), [event]);
  const [activePart, setActivePart] = useState(parts[0]?.id);
  const [lang, setLang] = useState<'en' | 'ru'>('en');
  const [query, setQuery] = useState('');
  const segmented = event.id === 'computer-vision-final';
  const [section, setSection] = useState<'overview' | 'practice' | 'lectures' | 'files'>('overview');
  const ru = lang === 'ru';
  useEffect(() => {
    if (!segmented) return;
    const sync = () => {
      const hash = window.location.hash.slice(1);
      if (hash === 'practice' || hash === 'files') setSection(hash);
      else if (hash === 'lectures' || parts.some(part => part.id === hash)) {
        setSection('lectures');
        if (parts.some(part => part.id === hash)) setActivePart(hash);
      } else if (!hash || hash === 'overview' || hash === 'final-guide') setSection('overview');
    };
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, [segmented, parts]);
  useEffect(() => {
    if (!segmented) return;
    useTutorFocus.getState().setBase({ view: 'read', partId: section === 'lectures' ? activePart : section === 'overview' ? 'final-guide' : undefined, step: `${event.course} · ${section}` });
    useTutorFocus.getState().setDetail({});
    return () => useTutorFocus.getState().setBase({});
  }, [segmented, section, activePart, event.course]);
  function selectTopic(id: string) {
    setActivePart(id);
    setSection('lectures');
    window.location.hash = id;
  }
  useEffect(() => {
    if (segmented) return;
    const setPart = (id: string) => {
      setActivePart(id);
      useTutorFocus.getState().setBase({ view: 'read', partId: id, step: `${event.course} · lecture notebook` });
    };
    setPart('final-guide');
    const observer = new IntersectionObserver(entries => {
      const current = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (current) setPart(current.target.id);
    }, { rootMargin: '-80px 0px -45% 0px', threshold: 0 });
    document.querySelectorAll('.g-note-paper').forEach(article => observer.observe(article));
    return () => { observer.disconnect(); useTutorFocus.getState().setBase({}); };
  }, [event.course, parts, segmented]);
  const filtered = parts.filter(part => `${part.title[lang]} ${part.notes[lang]}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));

  return <div className="g-notes-page" data-no-i18n>
    <Link className="g-reader-back" href={eventCourseHref(event.id)}>← {event.course}</Link>
    <header className="g-reader-heading"><div><p>{event.course} / Final preparation</p><h1>{segmented ? (ru ? 'Подготовка к CV final' : 'CV final preparation') : 'Your revision notebook.'}</h1><p>{notebook.coverage[lang]}</p></div><span><Icon name="book" size={20}/>{parts.length} parts</span></header>
    <div className={segmented ? styles.controls : undefined}>
    {segmented && <nav className={styles.navigation} aria-label={ru ? 'Разделы подготовки' : 'Preparation sections'}>
      {([
        ['overview', ru ? 'Обзор финала' : 'Overview', '01'],
        ['practice', ru ? 'Практика' : 'Practice', '02'],
        ['lectures', ru ? 'Лекции' : 'Lectures', '03'],
        ['files', ru ? 'Материалы' : 'Materials', '04'],
      ] as const).map(([id, title, number]) => <a key={id} href={`#${id}`} aria-current={section === id ? 'page' : undefined} onClick={() => setSection(id)}><small>{number}</small>{title}</a>)}
    </nav>}
    <NotesToolbar lang={lang} onLang={setLang}/>
    </div>
    {(!segmented || section === 'overview') && <>
    <section id="final-guide" className="g-note-paper g-final-guide" aria-labelledby="final-guide-title" lang={lang}>
      <div className="g-note-meta"><span>{lang === 'en' ? 'Start here · Your final' : 'Начни здесь · Твой финал'}</span><Icon name="plan" size={18}/></div>
      <h2 id="final-guide-title">{lang === 'en' ? 'Know what you are preparing for.' : 'Что именно нужно подготовить.'}</h2>
      <EventNotes text={notebook.guide[lang]} lang={lang}/>
      <details className="g-note-sources"><summary>{lang === 'en' ? 'Syllabus & final instructions' : 'Силлабус и требования финала'}</summary><ul>{notebook.sources.filter(source => !source.lectureId).map(source => <li key={source.id}><a href={source.url} target="_blank" rel="noreferrer">{source.title}<Icon name="arrow" size={15}/></a></li>)}</ul></details>
      {notebook.practiceId && <Link className="f-button" href={`/events/${notebook.practiceId}`}>{lang === 'en' ? 'Practise lecture concepts' : 'Потренировать понятия лекций'}<Icon name="arrow" size={17}/></Link>}
    </section>
    </>}
    {segmented && section === 'practice' && <CvFinalPrep lang={lang} signedIn={!!session?.user?.id}/>}
    {segmented && section === 'files' && <section className="g-note-paper">
      <h2>{ru ? 'Материалы под рукой' : 'Your study materials'}</h2>
      <p>{ru ? 'Полный конспект можно скачать для подготовки без интернета. Оригиналы лекций открываются в LMS.' : 'Download the complete notes for offline revision. Original lectures open in LMS.'}</p>
      <div className={styles.files}><a className="f-button" href={`/events/computer-vision-final/notes-${lang}.md`} download>{ru ? 'Скачать полный конспект' : 'Download complete notes'}</a>
      {notebook.sources.map(source => <a key={source.id} href={source.url} target="_blank" rel="noreferrer">{source.title}</a>)}</div>
    </section>}
    {(!segmented || section === 'lectures') && <>
    {segmented && <div className={styles.chooser}>
      <label>{ru ? 'Найти тему' : 'Find a topic'}<input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder={ru ? 'CNN, attention, метрики…' : 'CNN, attention, metrics…'}/></label>
      <label>{ru ? 'Открытая тема' : 'Current topic'}<select value={activePart} onChange={e => selectTopic(e.target.value)}>{parts.map((part, i) => <option key={part.id} value={part.id}>{i + 1}. {part.title[lang]}</option>)}</select></label>
    </div>}
    <div className="g-notes-layout">
      {segmented ? <aside className={styles.topics} aria-label={ru ? 'Содержание лекций' : 'Lecture contents'}>
        {event.lectures.map(lecture => {
          const topics = lecture.parts.filter(part => filtered.includes(part));
          return topics.length > 0 ? <details key={lecture.id} open={!!query || lecture.parts.some(part => part.id === activePart)}><summary>{lecture.title[lang]}</summary><nav>{topics.map(part => <a key={part.id} href={`#${part.id}`} aria-current={activePart === part.id ? true : undefined} onClick={() => setActivePart(part.id)}>{part.title[lang]}</a>)}</nav></details> : null;
        })}
        {!filtered.length && <p>{ru ? 'Ничего не найдено. Попробуй другое слово.' : 'No topics found. Try another word.'}</p>}
      </aside> : <aside className="g-notes-outline"><label>Find a topic<input type="search" name="notes-search" autoComplete="off" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search your notes…"/></label><nav aria-label="Notebook contents">{filtered.map(part => <a key={part.id} href={`#${part.id}`} aria-current={activePart === part.id ? true : undefined} lang={lang}><span>{parts.indexOf(part) + 1}</span>{part.title[lang]}</a>)}</nav>{!filtered.length && <p>No topics found. Try another search.</p>}</aside>}
      <div className="g-notes-articles">{parts.map((part, i) => (!segmented || part.id === activePart) && <article id={part.id} key={part.id} className="g-note-paper">
        <div className="g-note-meta"><span>Part {i + 1} of {parts.length}</span><Icon name="book" size={18}/></div>
        <div data-selection-notes lang={lang}><h2 data-selection-translation={lang === 'en' ? part.title.ru : undefined}>{part.title[lang]}</h2><EventNotes text={part.notes[lang]} lang={lang} translation={lang === 'en' ? part.notes.ru : undefined}/></div>
        <details className="g-note-sources"><summary>{lang === 'en' ? 'Source lecture & reading' : 'Лекция и материалы'}</summary><ul>{notebook.sources.filter(source => source.lectureId === event.lectures.find(lecture => lecture.parts.some(p => p.id === part.id))?.id).map(source => <li key={source.id}><a href={source.url} target="_blank" rel="noreferrer">{source.title}{source.pages ? ` · ${source.pages}` : ''}<Icon name="arrow" size={15}/></a></li>)}</ul></details>
        {event.id === 'computer-networks-final' && part.id.startsWith('cne-') && <NetworkStoryClip partId={part.id}/>}
        <nav className="g-note-pagination" aria-label={`Navigation for part ${i + 1}`}>{i > 0 ? <a href={`#${parts[i - 1].id}`} onClick={() => segmented && setActivePart(parts[i - 1].id)}>← {ru ? 'Предыдущая тема' : 'Previous part'}</a> : <span/>}{i < parts.length - 1 ? <a href={`#${parts[i + 1].id}`} onClick={() => segmented && setActivePart(parts[i + 1].id)}>{ru ? 'Следующая тема' : 'Next part'} →</a> : <a href="#workspace-content">Back to top ↑</a>}</nav>
      </article>)}</div>
    </div>
    </>}
    {session?.user?.id && <Tutor event={{ id: event.id }} userId={session.user.id}/>}
    <SelectionMenu/>
  </div>;
}
