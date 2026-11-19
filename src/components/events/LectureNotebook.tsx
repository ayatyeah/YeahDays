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
import TopicLearningModes, { TopicTutorRail } from './TopicLearningModes';
import styles from './notebook-navigation.module.css';
const AwsKnowledgeChecks = dynamic(() => import('./AwsKnowledgeChecks'), { loading: () => <p role="status">Opening AWS Knowledge Checks…</p> });
const AwsStudyDay = dynamic(() => import('./AwsStudyDay'), { loading: () => <p role="status">Загружаем подготовку AWS…</p> });
const AwsCourseMaterials = dynamic(() => import('./AwsCourseMaterials'), { loading: () => <p role="status">Загружаем модули AWS…</p> });
const NetworkTests = dynamic(() => import('./NetworkTests'));
const NetworkStoryClip = dynamic(() => import('./NetworkStoryClip'));

/** Reading-only course materials: no assessment bank is imported by this view. */
export default function LectureNotebook({ event, notebook }: { event: StudyEvent; notebook: FinalNotebook }) {
  const { data: session } = useSession();
  const parts = useMemo(() => event.lectures.flatMap(lecture => lecture.parts), [event]);
  const [activePart, setActivePart] = useState(parts[0]?.id);
  const [lang, setLang] = useState<'en' | 'ru'>('en');
  const [query, setQuery] = useState('');
  const isCloud = event.id === 'cloud-computing-final';
  const isCv = event.id === 'computer-vision-final';
  const [section, setSection] = useState<'overview' | 'practice' | 'lectures' | 'files' | 'one-day' | 'aws-notes'>('lectures');
  const ru = lang === 'ru';
  useEffect(() => {
    const sync = () => {
      const hash = window.location.hash.slice(1);
      if (event.id === 'cloud-computing-final' && (hash.split('/')[0] === 'one-day' || hash.split('/')[0] === 'aws-notes')) setSection(hash.split('/')[0] as 'one-day' | 'aws-notes');
      else if (event.id === 'cloud-computing-final' && hash.startsWith('files/')) setSection('files');
      else if ((hash === 'practice' && event.id !== 'philosophy-final') || hash === 'files') setSection(hash);
      else if (hash === 'lectures' || parts.some(part => part.id === hash)) {
        setSection('lectures');
        if (parts.some(part => part.id === hash)) setActivePart(hash);
      } else if (!hash) setSection('lectures');
      else if (hash === 'overview' || hash === 'final-guide') setSection('overview');
    };
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, [parts, event.id]);
  useEffect(() => {
    useTutorFocus.getState().setBase({ view: 'read', partId: section === 'lectures' ? activePart : section === 'overview' ? 'final-guide' : undefined, step: `${event.course} · ${section}` });
    useTutorFocus.getState().setDetail({});
    return () => useTutorFocus.getState().setBase({});
  }, [section, activePart, event.course]);
  function selectTopic(id: string) {
    setActivePart(id);
    setSection('lectures');
    window.location.hash = id;
  }
  const filtered = parts.filter(part => `${part.title[lang]} ${part.notes[lang]}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));

  const selected = parts.find(part => part.id === activePart) ?? parts[0];
  const topicIndex = parts.findIndex(part => part.id === activePart);

  return <div className="g-notes-page" data-no-i18n>
    <Link className={`g-reader-back ${styles.courseBack}`} href={eventCourseHref(event.id)}>← {isCloud ? 'Назад к папкам Cloud Computing' : event.course}</Link>
    {!isCloud && <header className="g-reader-heading"><div><p>{event.course} / Final preparation</p><h1>{ru ? `Подготовка к финалу · ${event.course}` : `${event.course} · Final preparation`}</h1><p>{notebook.coverage[lang]}</p></div><span><Icon name="book" size={20}/>{parts.length} parts</span></header>}
    <div className={styles.controls}>
    {!isCloud && <nav className={styles.navigation} aria-label={ru ? 'Разделы подготовки' : 'Preparation sections'}>
      {([
        ['lectures', ru ? 'Лекции' : 'Lectures', 'book'],
        ['practice', event.id === 'cloud-computing-final' ? 'AWS Knowledge Checks' : ru ? 'Практика' : 'Practice', 'research'],
        ['one-day', 'Подготовка за 1 день', 'plan'],
        ['aws-notes', 'Конспекты AWS · 220', 'book'],
        ['overview', ru ? 'Требования' : 'Exam guide', 'home'],
        ['files', ru ? 'Материалы' : 'Materials', 'plan'],
      ] as const).filter(([id]) => (id !== 'one-day' && id !== 'aws-notes') || event.id === 'cloud-computing-final').filter(([id]) => id !== 'practice' || event.id !== 'philosophy-final').map(([id, title, number]) => <a key={id} href={`#${id}`} aria-current={section === id ? 'page' : undefined} onClick={() => setSection(id)}><Icon name={number} size={20}/>{title}</a>)}
    </nav>}
    {isCloud && <h1 className={styles.sectionTitle}>{({ lectures: 'Лекции', practice: 'Квиз · 220 вопросов', files: 'Модули AWS', 'aws-notes': 'Конспекты AWS', 'one-day': 'Подготовка за 1 день', overview: 'Требования к экзамену' })[section]}</h1>}
    {section === 'lectures' && <div className="prime-topic-position"><span>{ru ? 'Сейчас открыто' : 'Currently reading'}</span><strong>{ru ? `Тема ${topicIndex + 1} из ${parts.length}` : `Topic ${topicIndex + 1} of ${parts.length}`}</strong><meter min={0} max={parts.length} value={topicIndex + 1} aria-label={ru ? 'Положение в конспекте, не оценка знаний' : 'Position in notes, not mastery'}/></div>}
    {!(isCloud && section === 'files') && <NotesToolbar lang={lang} onLang={setLang}/>}
    </div>
    {section === 'overview' && <>
    <section id="final-guide" className="g-note-paper g-final-guide" aria-labelledby="final-guide-title" lang={lang}>
      <div className="g-note-meta"><span>{lang === 'en' ? 'Start here · Your final' : 'Начни здесь · Твой финал'}</span><Icon name="plan" size={18}/></div>
      <h2 id="final-guide-title">{lang === 'en' ? 'Know what you are preparing for.' : 'Что именно нужно подготовить.'}</h2>
      <EventNotes text={notebook.guide[lang]} lang={lang}/>
      <details className="g-note-sources"><summary>{lang === 'en' ? 'Syllabus & final instructions' : 'Силлабус и требования финала'}</summary><ul>{notebook.sources.filter(source => !source.lectureId).map(source => <li key={source.id}><a href={source.url} target="_blank" rel="noreferrer">{source.title}<Icon name="arrow" size={15}/></a></li>)}</ul></details>
      {event.id === 'cloud-computing-final' && <a className="f-button" href="#practice" onClick={() => setSection('practice')}>{ru ? 'AWS Knowledge Checks · 220 вопросов' : 'AWS Knowledge Checks · 220 questions'}<Icon name="arrow" size={17}/></a>}

    </section>
    </>}
    {section === 'practice' && (event.id === 'cloud-computing-final' ? (session?.user?.id ? <AwsKnowledgeChecks userId={session.user.id} lang={lang}/> : <section className="g-note-paper"><Link className="f-button" href="/login">{ru ? 'Войти для прохождения AWS Knowledge Checks' : 'Sign in for AWS Knowledge Checks'}</Link></section>) : <NetworkTests lang={lang}/> )}
    {(section === 'one-day' || section === 'aws-notes') && event.id === 'cloud-computing-final' && (session?.user?.id ? <AwsStudyDay key={`${session.user.id}:${section}`} userId={session.user.id} notesOnly={section === 'aws-notes'}/> : <section className="g-note-paper"><Link className="f-button" href="/login">Войти для подготовки AWS</Link></section>)}
    {section === 'files' && isCloud && <AwsCourseMaterials/>}
    {section === 'files' && <section className="g-note-paper">
      <h2>{isCloud ? 'Оригиналы университетских лекций' : ru ? 'Материалы под рукой' : 'Your study materials'}</h2>
      <p>{(ru || isCloud) ? 'Оригиналы лекций и требования преподавателя собраны здесь. Конспекты по темам — в папке «Лекции».' : 'Original lectures and instructor requirements are collected here. Topic notes are in the Lectures tab.'}</p>
      <div className={styles.files}>{isCv && <a className="f-button" href={`/events/computer-vision-final/notes-${lang}.md`} download>{ru ? 'Скачать полный конспект' : 'Download complete notes'}</a>}
      {notebook.sources.map(source => <a key={source.id} href={source.url} target="_blank" rel="noreferrer">{source.title}</a>)}</div>
    </section>}
    {section === 'lectures' && <>
    <div className={styles.chooser}>
      <label>{ru ? 'Найти тему' : 'Find a topic'}<input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder={ru ? 'Название или ключевое слово…' : 'Title or keyword…'}/></label>
      <label>{ru ? 'Открытая тема' : 'Current topic'}<select value={activePart} onChange={e => selectTopic(e.target.value)}>{parts.map((part, i) => <option key={part.id} value={part.id}>{i + 1}. {part.title[lang]}</option>)}</select></label>
    </div>
    <div className={`g-notes-layout${session?.user?.id ? " prime-has-rail" : ""}`}>
      <aside className={`${styles.topics} prime-topic-outline`} aria-label={ru ? 'Содержание лекций' : 'Lecture contents'}>
        {event.lectures.map(lecture => {
          const topics = lecture.parts.filter(part => filtered.includes(part));
          return topics.length > 0 ? <details key={lecture.id} open={!!query || lecture.parts.some(part => part.id === activePart)}><summary>{lecture.title[lang]}</summary><nav>{topics.map(part => <a key={part.id} href={`#${part.id}`} aria-current={activePart === part.id ? true : undefined} onClick={() => setActivePart(part.id)}>{part.title[lang]}</a>)}</nav></details> : null;
        })}
        {!filtered.length && <p>{ru ? 'Ничего не найдено. Попробуй другое слово.' : 'No topics found. Try another word.'}</p>}
      </aside>
      <div className="g-notes-articles">{parts.map((part, i) => (part.id === activePart) && <article id={part.id} key={part.id} className="g-note-paper">
        <div className="g-note-meta"><span>Part {i + 1} of {parts.length}</span><Icon name="book" size={18}/></div>
        <h2 data-selection-translation={lang === 'en' ? part.title.ru : undefined}>{part.title[lang]}</h2><TopicLearningModes key={part.id} title={part.title[lang]} lang={lang} signedIn={!!session?.user?.id}><div data-selection-notes lang={lang}><EventNotes text={part.notes[lang]} lang={lang} translation={lang === 'en' ? part.notes.ru : undefined}/></div></TopicLearningModes>
        <details className="g-note-sources"><summary>{lang === 'en' ? 'Source lecture & reading' : 'Лекция и материалы'}</summary><ul>{notebook.sources.filter(source => source.lectureId === event.lectures.find(lecture => lecture.parts.some(p => p.id === part.id))?.id).map(source => <li key={source.id}><a href={source.url} target="_blank" rel="noreferrer">{source.title}{source.pages ? ` · ${source.pages}` : ''}<Icon name="arrow" size={15}/></a></li>)}</ul></details>
        {event.id === 'computer-networks-final' && part.id.startsWith('cne-') && <NetworkStoryClip partId={part.id}/>}
        <nav className="g-note-pagination" aria-label={`Navigation for part ${i + 1}`}>{i > 0 ? <a href={`#${parts[i - 1].id}`} onClick={() => setActivePart(parts[i - 1].id)}>← {ru ? 'Предыдущая тема' : 'Previous part'}</a> : <span/>}{i < parts.length - 1 ? <a href={`#${parts[i + 1].id}`} onClick={() => setActivePart(parts[i + 1].id)}>{ru ? 'Следующая тема' : 'Next part'} →</a> : <a href="#workspace-content">Back to top ↑</a>}</nav>
      </article>)}</div>
      {session?.user?.id && selected && <TopicTutorRail title={selected.title[lang]} lang={lang}/>}
    </div>
    </>}
    {session?.user?.id && <Tutor event={{ id: event.id }} userId={session.user.id}/>}
    <SelectionMenu/>
  </div>;
}
