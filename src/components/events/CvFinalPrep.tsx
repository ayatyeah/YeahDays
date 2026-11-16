'use client';

import { useState } from 'react';
import EventNotes from '@/components/EventNotes';
import { CV_PREP } from '@/lib/cvFinal/content';
import { openTutorDraft, useTutorFocus } from '@/lib/tutorFocus';

export default function CvFinalPrep({ lang, signedIn }: { lang: 'ru' | 'en'; signedIn: boolean }) {
  const [active, setActive] = useState(CV_PREP[0].id);
  const unit = CV_PREP.find(item => item.id === active)!;
  const ru = lang === 'ru';
  function ask(prompt: string) {
    useTutorFocus.getState().setBase({ view: 'read', partId: `cv-prep-${unit.id}`, step: 'Computer Vision final preparation' });
    openTutorDraft(prompt);
  }
  function download() {
    const text = '# Computer Vision · Final preparation\n\n' + CV_PREP.map(item => `# ${item.title[lang]}\n\n${item.notes[lang]}`).join('\n\n');
    const url = URL.createObjectURL(new Blob([text], { type: 'text/markdown;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = `CV-final-practice-${lang}.md`; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <section className="g-note-paper" aria-labelledby="cv-prep-title">
    <div className="g-note-meta"><span>CV / Final lab</span><span>{ru ? 'Подготовка до экзамена' : 'Before-exam preparation'}</span></div>
    <h2 id="cv-prep-title">{ru ? 'От конспекта к самостоятельному проекту.' : 'From notes to an independent project.'}</h2>
    <p>{ru ? 'Пять практических блоков: объяснение, упражнение и репетиция с ИИ. Теория находится во вкладке «Лекции». Упражнения авторские, не вопросы преподавателя.' : 'Five practical units: explanations, exercises and AI rehearsal. Theory is in the Lectures tab. Exercises are original practice, not instructor questions.'}</p>
    <div className="flex flex-wrap gap-2 my-5" role="group" aria-label={ru ? 'Блок подготовки' : 'Preparation unit'}>
      {CV_PREP.map(item => <button key={item.id} type="button" className="f-button" aria-pressed={active === item.id} onClick={() => setActive(item.id)} style={{ opacity: active === item.id ? 1 : 0.7 }}>{item.title[lang]}</button>)}
    </div>
    <div id={`cv-prep-${unit.id}`}><h3>{unit.title[lang]}</h3><EventNotes text={unit.notes[lang]} lang={lang}/></div>
    <div className="flex flex-wrap gap-3 mt-5">
      {signedIn ? <>
        <button type="button" className="f-button" onClick={() => ask(unit.prompt[lang])}>{ru ? 'Потренироваться с CV-помощником' : 'Practise with the CV tutor'}</button>
        <button type="button" className="f-button" onClick={() => ask(ru ? 'Помоги составить план подготовки к CV final по моим слабым темам. Сначала спроси, сколько времени осталось и что я уже умею.' : 'Help me plan CV final preparation around my weak topics. First ask how much time remains and what I can already do.')}>{ru ? 'Мой план подготовки' : 'My preparation plan'}</button>
      </> : <p>{ru ? 'Войди в YeahGrind, чтобы открыть ИИ-помощника. Конспекты и упражнения доступны без ИИ.' : 'Sign in to YeahGrind to use the AI tutor. Notes and exercises work without AI.'}</p>}
      <button type="button" className="f-button" onClick={download}>{ru ? 'Скачать практический конспект' : 'Download practice notes'}</button>
    </div>
    <p className="mt-3"><a href={`/events/computer-vision-final/notes-${lang}.md`} download>{ru ? 'Скачать весь курс: лекции 1–10 и практику' : 'Download the complete course: lectures 1–10 and practice'}</a></p>
    <p className="mt-3 text-sm">{ru ? 'Кнопка помощника открывает черновик вопроса: отправь его, когда будешь готов. По опубликованному образцу ИИ запрещён во время экзамена.' : 'The tutor button prepares a question draft; send it when ready. The published sample prohibits AI during the assessment.'}</p>
  </section>;
}
