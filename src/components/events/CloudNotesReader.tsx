'use client';
import { useState } from 'react';
import Link from 'next/link';
import english from '@/lib/events/cloudComputingEndterm/examNotes.en.json';
import russian from '@/lib/events/cloudComputingEndterm/examNotes.json';
import NotesToolbar from './NotesToolbar';
import SelectionMenu from './SelectionMenu';
import { Icon } from '@/components/final/Brand';

export default function CloudNotesReader() {
  const [lang, setLang] = useState<'en' | 'ru'>('en');
  const [query, setQuery] = useState('');
  const notes = lang === 'en' ? english : russian;
  const filtered = notes.filter(n => `${n.title} ${n.body.join(' ')}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  return <div className="g-notes-page" data-no-i18n>
    <Link className="g-reader-back" href="/events/cloud-computing-endterm">← Cloud Computing</Link>
    <header className="g-reader-heading"><div><p>Cloud Computing / Exam revision</p><h1>Your revision notebook.</h1><p>47 topics. Clear explanations, examples and the details that matter.</p></div><span><Icon name="book" size={20}/>47 parts</span></header>
    <NotesToolbar lang={lang} onLang={setLang}/>
    <div className="g-notes-layout"><aside className="g-notes-outline"><label>Find a topic<input type="search" name="notes-search" autoComplete="off" value={query} onChange={e => setQuery(e.target.value)} placeholder="IAM, DynamoDB, Docker…"/></label><nav aria-label="Notebook contents">{filtered.map(n => <a key={n.questionId} href={`#${n.questionId}`} lang={lang}><span>{notes.indexOf(n) + 1}</span>{n.title}</a>)}</nav>{!filtered.length && <p>No topics found. Try another search.</p>}</aside><div className="g-notes-articles">{notes.map((note, i) => <article id={note.questionId} key={note.questionId} className="g-note-paper"><div className="g-note-meta"><span>Part {i + 1} of {notes.length}</span><Icon name="book" size={18}/></div><div data-selection-notes lang={lang}><h2 data-selection-translation={lang === 'en' ? russian[i].title : undefined}>{note.title}</h2>{note.body.map((text, j) => <p key={j} data-selection-translation={lang === 'en' ? russian[i].body[j] : undefined}>{text}</p>)}</div><details className="g-note-sources"><summary>Sources & documentation</summary><ul>{note.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title}<Icon name="arrow" size={15}/></a></li>)}</ul></details><nav className="g-note-pagination" aria-label={`Navigation for part ${i + 1}`}>{i > 0 ? <a href={`#${notes[i-1].questionId}`}>← Previous part</a> : <span/>}{i < notes.length - 1 ? <a href={`#${notes[i+1].questionId}`}>Next part →</a> : <a href="#workspace-content">Back to top ↑</a>}</nav></article>)}</div></div>
    <SelectionMenu allowTutor={false}/>
  </div>;
}
