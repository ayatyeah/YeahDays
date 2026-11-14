'use client';

import { useState } from 'react';
import { Icon } from './Brand';

const stages = [
  { id: 'read', label: 'Read', icon: 'book' },
  { id: 'practice', label: 'Practice', icon: 'plan' },
  { id: 'reflect', label: 'Reflect', icon: 'progress' },
] as const;

export default function StudyTour() {
  const [stage, setStage] = useState<(typeof stages)[number]['id']>('read');
  const [language, setLanguage] = useState<'en' | 'ru'>('en');
  const [answer, setAnswer] = useState<number | null>(null);
  const [reflection, setReflection] = useState('');

  return <div className="g-tour">
    <div className="g-tour-top"><span><Icon name="book" size={17}/> A small study session</span><span>Interactive preview</span></div>
    <div className="g-tour-tabs" role="group" aria-label="Explore the study experience">
      {stages.map(item => <button key={item.id} type="button" aria-pressed={stage === item.id} aria-controls="study-tour-panel" onClick={() => setStage(item.id)}><Icon name={item.icon} size={18}/>{item.label}</button>)}
    </div>
    <div className="g-tour-panel" id="study-tour-panel">
      {stage === 'read' && <section aria-label="Reading preview">
        <div className="g-tour-meta"><span>RMT / Research design</span><div role="group" aria-label="Preview reading language"><button type="button" aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>EN</button><button type="button" aria-pressed={language === 'ru'} onClick={() => setLanguage('ru')}>RU</button></div></div>
        <div lang={language}>
          <h3>{language === 'en' ? 'Two ways to answer a question.' : 'Два способа ответить на вопрос.'}</h3>
          <p>{language === 'en' ? 'A survey can show how common a pattern is. An interview helps you explore the experiences behind it.' : 'Опрос помогает измерить, насколько распространена закономерность. Интервью помогает понять стоящий за ней опыт.'}</p>
          <div className="g-tour-note"><Icon name="spark" size={19}/><p>{language === 'en' ? 'Start with what you want to find out. Then choose a method that can answer it.' : 'Сначала определите, что хотите узнать. Затем выберите метод, который поможет ответить на этот вопрос.'}</p></div>
        </div>
        <p className="g-tour-caption">A clear explanation, with another language close by.</p>
      </section>}
      {stage === 'practice' && <section aria-label="Practice preview">
        <div className="g-tour-meta"><span>RMT / One practice question</span><span>Try it here</span></div>
        <h3>Go from reading to understanding.</h3>
        <p>Which method helps you explore why students prefer a particular study app?</p>
        <div className="g-tour-answers" role="group" aria-label="Choose a practice answer">
          {['An open interview', 'Counting app downloads'].map((option, i) => <button key={option} type="button" aria-pressed={answer === i} data-correct={answer !== null && i === 0 ? 'true' : undefined} data-wrong={answer === 1 && i === 1 ? 'true' : undefined} onClick={() => setAnswer(i)}><span aria-hidden="true">{answer !== null && i === 0 ? '✓' : answer === i ? '×' : String.fromCharCode(65 + i)}</span>{option}</button>)}
        </div>
        <div className="g-tour-feedback" role="status">{answer === null ? 'Choose an answer to see the explanation.' : answer === 0 ? 'Exactly. An interview lets students explain their reasons in their own words.' : 'A download count shows how often, but not why. An interview lets you explore students’ reasons.'}</div>
      </section>}
      {stage === 'reflect' && <section aria-label="Reflection preview">
        <div className="g-tour-meta"><span>RMT / Your takeaway</span><span>Make it yours</span></div>
        <h3>Leave yourself a little insight.</h3>
        <label className="g-tour-reflection">What clicked for you today?<textarea value={reflection} onChange={e => setReflection(e.target.value)} maxLength={300} rows={3} placeholder="I would use an interview when…"/></label>
        <div className="g-tour-takeaway"><span>{reflection.trim() ? 'Your takeaway' : 'An example takeaway'}</span><p>{reflection.trim() || 'A survey measures patterns. An interview helps explain experiences.'}</p></div>
      </section>}
    </div>
    <div className="g-tour-foot"><Icon name="check" size={15}/><span>A sample session. Your account progress is not changed.</span></div>
  </div>;
}
