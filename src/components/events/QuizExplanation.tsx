'use client';

import { useEffect, useState } from 'react';
import { QuestionLanguage, QuestionText } from './QuestionLanguage';
import type { EventQuizQuestion } from './EventQuiz';

const preference = 'yeahgrind.quiz.explanation-language';

export default function QuizExplanation({ question, expanded }: {question: EventQuizQuestion; expanded?: boolean}) {
  const [lang, setLang] = useState<'ru' | 'en'>('ru');
  useEffect(() => {
    try { if (localStorage.getItem(preference) === 'en') setLang('en'); } catch {}
  }, []);
  function choose(value: 'ru' | 'en') {
    setLang(value);
    try { localStorage.setItem(preference, value); } catch {}
  }

  const ru = lang === 'ru';
  const { why, caution, optionExplanations, transfer, wrong } = question;
  const summary = why[lang];
  const extraTexts = [caution, transfer?.title, transfer?.rule, ...(optionExplanations ?? [])].filter((text): text is string => !!text);
  if (why.ru === why.en) extraTexts.push(summary);
  return <section aria-label="Explanation" lang={lang} data-no-i18n>
    <QuestionLanguage language={lang} label="Explanation language" sourceTexts={extraTexts} tools={<>
      <span>{ru ? 'Язык объяснения' : 'Explanation language'}</span>
      <button type="button" aria-pressed={ru} onClick={() => choose('ru')}>Русский</button>
      <button type="button" aria-pressed={!ru} onClick={() => choose('en')}>English</button>
    </>}>
      {caution && <p className="mt-2"><QuestionText>{caution}</QuestionText></p>}
      <p data-explanation-summary data-selection-question>{why.ru === why.en ? <QuestionText>{summary}</QuestionText> : summary}</p>
      {transfer && <section className="mt-4"><h3 className="font-semibold"><QuestionText>{transfer.title}</QuestionText></h3><p><QuestionText>{transfer.rule}</QuestionText></p>
        <details><summary>{ru ? 'Похожие вопросы' : 'Related questions'} ({transfer.related.length})</summary><ul className="list-disc space-y-2 pl-5">{transfer.related.map(example => <li key={example.prompt}>{example.prompt}<details><summary>{ru ? 'Показать ответ' : 'Show answer'}</summary>{example.answer}</details></li>)}</ul></details></section>}
      {optionExplanations && <details open={expanded || undefined} className="mt-4 border-t border-[var(--color-border)] pt-3">
        <summary>{ru ? 'Почему каждый вариант подходит или не подходит' : 'Why each option works or does not'}</summary>
        <ul className="mt-3 space-y-4">{question.options.map((option, i) => <li key={i}>
          <p className="font-medium">{question.correct.length ? (question.correct.includes(i) ? '✓ ' : '✗ ') : ''}{question.labels?.[i] ?? String.fromCharCode(65 + i)}. {option}</p>
          <p data-selection-question><QuestionText>{optionExplanations[i] ?? ''}</QuestionText></p>
        </li>)}</ul></details>}
      {wrong && <ul className="mt-3 space-y-2">{question.options.map((option, i) => wrong[i] && <li key={i}>✗ {option} — {wrong[i]![lang]}</li>)}</ul>}
    </QuestionLanguage>
  </section>;
}
