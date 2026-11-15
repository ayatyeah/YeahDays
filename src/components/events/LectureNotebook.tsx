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
const NetworkStoryClip = dynamic(() => import('./NetworkStoryClip'));

/** Reading-only course materials: no assessment bank is imported by this view. */
export default function LectureNotebook({ event, notebook }: { event: StudyEvent; notebook: FinalNotebook }) {
  const { data: session } = useSession();
  const parts = useMemo(() => event.lectures.flatMap(lecture => lecture.parts), [event]);
  const [activePart, setActivePart] = useState(parts[0]?.id);
  const [lang, setLang] = useState<'en' | 'ru'>('en');
  const [query, setQuery] = useState('');
  useEffect(() => {
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
  }, [event.course, parts]);
  const filtered = parts.filter(part => `${part.title[lang]} ${part.notes[lang]}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));

  return <div className="g-notes-page" data-no-i18n>
    <Link className="g-reader-back" href={eventCourseHref(event.id)}>← {event.course}</Link>
    <header className="g-reader-heading"><div><p>{event.course} / Final preparation</p><h1>Your revision notebook.</h1><p>{notebook.coverage[lang]}</p></div><span><Icon name="book" size={20}/>{parts.length} parts</span></header>
    <NotesToolbar lang={lang} onLang={setLang}/>
    <section id="final-guide" className="g-note-paper g-final-guide" aria-labelledby="final-guide-title" lang={lang}>
      <div className="g-note-meta"><span>{lang === 'en' ? 'Start here · Your final' : 'Начни здесь · Твой финал'}</span><Icon name="plan" size={18}/></div>
      <h2 id="final-guide-title">{lang === 'en' ? 'Know what you are preparing for.' : 'Что именно нужно подготовить.'}</h2>
      <EventNotes text={notebook.guide[lang]} lang={lang}/>
      <details className="g-note-sources"><summary>{lang === 'en' ? 'Syllabus & final instructions' : 'Силлабус и требования финала'}</summary><ul>{notebook.sources.filter(source => !source.lectureId).map(source => <li key={source.id}><a href={source.url} target="_blank" rel="noreferrer">{source.title}<Icon name="arrow" size={15}/></a></li>)}</ul></details>
      {notebook.practiceId && <Link className="f-button" href={`/events/${notebook.practiceId}`}>{lang === 'en' ? 'Practise lecture concepts' : 'Потренировать понятия лекций'}<Icon name="arrow" size={17}/></Link>}
    </section>
    <div className="g-notes-layout">
      <aside className="g-notes-outline"><label>Find a topic<input type="search" name="notes-search" autoComplete="off" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search your notes…"/></label><nav aria-label="Notebook contents">{filtered.map(part => <a key={part.id} href={`#${part.id}`} aria-current={activePart === part.id ? true : undefined} lang={lang}><span>{parts.indexOf(part) + 1}</span>{part.title[lang]}</a>)}</nav>{!filtered.length && <p>No topics found. Try another search.</p>}</aside>
      <div className="g-notes-articles">{parts.map((part, i) => <article id={part.id} key={part.id} className="g-note-paper">
        <div className="g-note-meta"><span>Part {i + 1} of {parts.length}</span><Icon name="book" size={18}/></div>
        <div data-selection-notes lang={lang}><h2 data-selection-translation={lang === 'en' ? part.title.ru : undefined}>{part.title[lang]}</h2><EventNotes text={part.notes[lang]} lang={lang} translation={lang === 'en' ? part.notes.ru : undefined}/></div>
        <details className="g-note-sources"><summary>{lang === 'en' ? 'Source lecture & reading' : 'Лекция и материалы'}</summary><ul>{notebook.sources.filter(source => source.lectureId === event.lectures.find(lecture => lecture.parts.some(p => p.id === part.id))?.id).map(source => <li key={source.id}><a href={source.url} target="_blank" rel="noreferrer">{source.title}{source.pages ? ` · ${source.pages}` : ''}<Icon name="arrow" size={15}/></a></li>)}</ul></details>
        {event.id === 'computer-networks-final' && part.id.startsWith('cne-') && <NetworkStoryClip partId={part.id}/>}
        <nav className="g-note-pagination" aria-label={`Navigation for part ${i + 1}`}>{i > 0 ? <a href={`#${parts[i - 1].id}`}>← Previous part</a> : <span/>}{i < parts.length - 1 ? <a href={`#${parts[i + 1].id}`}>Next part →</a> : <a href="#workspace-content">Back to top ↑</a>}</nav>
      </article>)}</div>
    </div>
    {session?.user?.id && <Tutor event={{ id: event.id }} userId={session.user.id}/>}
    <SelectionMenu/>
  </div>;
}
