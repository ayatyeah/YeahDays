'use client';

import { useId, useState } from 'react';
import { Icon } from '@/components/final/Brand';
import { openTutorDraft } from '@/lib/tutorFocus';

/** A finite practice loop; no grades or completion are inferred from reading. */
export default function TopicLearningModes({ title, lang, children, signedIn = true }: {
  title: string; lang: 'ru' | 'en'; children: React.ReactNode; signedIn?: boolean;
}) {
  const [mode, setMode] = useState<'understand' | 'recall' | 'apply'>('understand');
  const [attempt, setAttempt] = useState('');
  const [compare, setCompare] = useState(false);
  const id = useId();
  const ru = lang === 'ru';
  return <div className="prime-topic-loop">
    <div className="prime-mode-tabs" role="group" aria-label={ru ? 'Как учимся' : 'Learning mode'}>
      {([['understand', 'book', ru ? 'Пойми' : 'Understand'], ['recall', 'spark', ru ? 'Вспомни' : 'Recall'], ['apply', 'research', ru ? 'Примени' : 'Apply']] as const).map(([key, icon, label]) => <button key={key} type="button" aria-pressed={mode === key} onClick={() => { setMode(key); setCompare(false); }}><Icon name={icon} size={19}/>{label}</button>)}
    </div>
    {mode !== 'understand' && <section className="prime-recall" aria-labelledby={`${id}-title`}>
      <h3 id={`${id}-title`}>{mode === 'recall' ? (ru ? 'Что осталось в памяти?' : 'What can you recall?') : (ru ? 'Перенеси идею в свой пример' : 'Put the idea to work')}</h3>
      <p>{mode === 'recall' ? (ru ? 'Не подглядывая, объясни главную идею и назови два важных условия или ограничения.' : 'Without looking, explain the main idea and name two important conditions or limitations.') : (ru ? 'Придумай конкретный случай для этой темы. Что ты сделаешь, почему это сработает и где подход может не сработать?' : 'Describe a concrete case for this topic. What would you do, why would it work, and where might the approach fail?')}</p>
      <label htmlFor={`${id}-attempt`}>{ru ? 'Твоя попытка' : 'Your attempt'}</label>
      <textarea id={`${id}-attempt`} value={attempt} onChange={e => setAttempt(e.target.value)} placeholder={ru ? 'Своими словами, без идеального ответа…' : 'In your own words, no perfect answer needed…'} rows={5}/>
      <div className="prime-recall-actions"><button type="button" onClick={() => setCompare(v => !v)}>{compare ? (ru ? 'Скрыть конспект' : 'Hide notes') : (ru ? 'Сравнить с конспектом' : 'Compare with notes')}</button>{signedIn && <button type="button" disabled={!attempt.trim()} onClick={() => openTutorDraft(ru ? `Проверь мою учебную попытку по теме «${title}». Не ставь выдуманную оценку. Укажи одну сильную сторону, конкретный пробел и задай один вопрос. Моя попытка: ${attempt}` : `Check my practice attempt on “${title}”. Do not invent a grade. Identify one strength, a specific gap and ask one question. My attempt: ${attempt}`)}>{ru ? 'Разобрать с помощником' : 'Review with the tutor'}</button>}</div>
      <small>{ru ? 'Черновик на этом экране. Помощник откроет вопрос для отправки.' : 'A draft for this screen. The tutor opens a question for you to send.'}</small>
    </section>}
    {(mode === 'understand' || compare) && children}
    {mode === 'understand' && <button type="button" className="prime-check-yourself" onClick={() => setMode('recall')}>{ru ? 'Проверить себя' : 'Check yourself'}<Icon name="arrow" size={22}/></button>}
  </div>;
}

export function TopicTutorRail({ title, lang }: { title: string; lang: 'ru' | 'en' }) {
  const ru = lang === 'ru';
  return <aside className="prime-tutor-rail" aria-label={ru ? 'Помощник по теме' : 'Topic tutor'}>
    <div className="prime-tutor-gem" aria-hidden="true"><Icon name="spark" size={48}/></div>
    <h2>{ru ? 'Разобраться с темой' : 'Make it click'}</h2>
    <p>{ru ? 'Один вопрос — один понятный следующий шаг.' : 'One question. One clear next step.'}</p>
    <button type="button" onClick={() => openTutorDraft(ru ? `Объясни тему «${title}» проще, через конкретный пример. Затем задай один вопрос для проверки понимания.` : `Explain “${title}” simply with a concrete example. Then ask one question to check my understanding.`)}><Icon name="spark"/>{ru ? 'Объясни проще' : 'Explain simply'}<Icon name="chevron" size={16}/></button>
    <button type="button" onClick={() => openTutorDraft(ru ? `Дай небольшую подсказку по теме «${title}». Сначала спроси, на каком шаге я остановился, не раскрывай весь ответ.` : `Give me a small hint about “${title}”. First ask where I got stuck; do not reveal the full answer.`)}><Icon name="research"/>{ru ? 'Дай подсказку' : 'Give me a hint'}<Icon name="chevron" size={16}/></button>
    <button type="button" className="prime-tutor-question" onClick={() => openTutorDraft(ru ? `У меня вопрос по теме «${title}»: ` : `My question about “${title}”: `)}>{ru ? 'Задай свой вопрос…' : 'Ask your question…'}<Icon name="arrow"/></button>
    <small>{ru ? 'Ты проверяешь вопрос перед отправкой.' : 'You review the question before sending.'}</small>
  </aside>;
}
