"use client";
import EventNotes from "@/components/EventNotes";
import AnswerOption from "@/components/events/AnswerOption";
import { QuestionText } from "./QuestionLanguage";
import QuizStage from "./QuizStage";
import QuizExplanation from "./QuizExplanation";
import ErrorReview from "./ErrorReview";
import { missedQuestions, reviewDelay, readyForReview, creditReview } from "@/lib/events/errorReview";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import Button from "@/components/ui/Button";
import EventMusic from "@/components/EventMusic";
import ReportQuestion from "@/components/events/ReportQuestion";
import { cn } from "@/lib/cn";
import { useContentLang } from "@/i18n/locale";
import { useTutorDetail } from "@/lib/tutorFocus";
import type { Lang } from "@/lib/events/types";
import type { QuizQuestion, Step } from "@/lib/events/engine";
import { matchesAnswer } from "@/lib/events/quizAnswers";
import styles from "./event-quiz.module.css";

export type EventQuizQuestion = Omit<QuizQuestion, "correct" | "lecture"> & { correct: number[]; source?: {kind:string;positions?:Record<number,number>;variant?:number;module?:number;lecture:number}; lesson?: {id:string;module:number;lecture:number;title:string;ru:string;en:string;notes?:Record<Lang,string>}; transfer?: {title:string;rule:string;related:{prompt:string;answer:string}[]}; labels?: string[]; caution?: string; optionExplanations?: string[]; optionReasons?: ReadonlyArray<Record<Lang, string>>; studyLink?: { href: string; title: string } };
const panel = "rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5";

export default function EventQuiz({
  eventId, step, quiz, lang, music, onMusic, onExit, onFinish, onAnswer, explainOptionsOpen = false, resume, onNavigate, lessons = false, menuInfo,
}: {
  lessons?: boolean;
  menuInfo?: ReactNode;
  eventId: string;
  step: Pick<Step, "title">;
  quiz: EventQuizQuestion[];
  lang: Lang;
  music: boolean;
  onLang?: () => void;
  explainOptionsOpen?: boolean;
  resume?: {index:number; answers:number[][]};
  onNavigate?: (index:number)=>void;
  onMusic: () => void;
  onExit: () => void;
  onFinish: (answers: number[][]) => void;
  onAnswer?: (id: string, answer: number[]) => void;
}) {
  const tl = useContentLang();
  const [navigationHost, setNavigationHost] = useState<HTMLElement | null>(null);
  useEffect(() => { setNavigationHost(document.body); }, []);
  const [index, setIndex] = useState(resume?.index ?? 0);
  const [showLesson,setShowLesson]=useState(lessons);
  function navigate(i:number){
    if(lessons && quiz[i].lesson?.id!==quiz[index].lesson?.id)setShowLesson(true);
    setIndex(i);onNavigate?.(i);
  }
  const [answers, setAnswers] = useState<number[][]>(resume?.answers ?? []);
  const answeredCount = answers.filter(Boolean).length;
  const [answeredAt, setAnsweredAt] = useState<Record<string, number>>(() => {
    const times: Record<string, number> = {};
    let count = 0;
    quiz.forEach((q, i) => { if (resume?.answers[i]) times[q.id] = ++count; });
    return times;
  });
  const [reviewAt, setReviewAt] = useState<number | null>(() => {
    const pending = missedQuestions(quiz, answers, []);
    return pending.length ? answeredAt[pending[0].id] + reviewDelay() : null;
  });
  const [reviewing, setReviewing] = useState(false);
  const [mastered, setMastered] = useState<string[]>([]);
  const item = quiz[index];
  const picked = answers[index];
  const [drafts, setDrafts] = useState<Record<number, number[]>>({});
  const selected = drafts[index] ?? [];
  function setSelected(value: number[]) { setDrafts(previous => ({ ...previous, [index]: value })); }
  const expected = item.correct;
  const multi = expected.length > 1;
  function submit(value: number[]) {
    setAnswers(previous => { const next = [...previous]; next[index] = value; return next; });
    if (answers[index] === undefined && expected.length && !matchesAnswer(value, expected) && reviewAt === null) setReviewAt(answeredCount + 1 + reviewDelay());
    if (answers[index] === undefined) setAnsweredAt(previous => ({ ...previous, [item.id]: answeredCount + 1 }));
    onAnswer?.(item.id, value);
  }
  const answered = picked !== undefined;
  useTutorDetail({ quiz: { id: item.id, question: item.q, options: item.options, pickedMany: picked, correctMany: answered ? expected : undefined, picked: picked?.[0], correct: answered ? expected[0] : undefined, index, total: quiz.length } }, `${index + 1}/${quiz.length}`);
  const questionHeading = useRef<HTMLHeadingElement>(null);
  const previousIndex = useRef<number | null>(null);
  const previousLesson = useRef(showLesson);

  useEffect(() => {
    const firstQuestion = previousIndex.current === null;
    const navigated = previousIndex.current !== index || previousLesson.current !== showLesson;
    previousLesson.current = showLesson;
    previousIndex.current = index;
    // Only explicit question navigation moves the viewport. Answer feedback
    // is announced by role="status" without moving focus or scrolling.
    if (!navigated) return;
    const target = questionHeading.current;
    if (!target) return;
    const mobileQuiz = target.closest<HTMLElement>("[data-network-quiz=true]");
    const inMobileQuiz = mobileQuiz && window.matchMedia("(max-width: 760px)").matches;
    if (firstQuestion && !inMobileQuiz) return;
    target.focus({ preventScroll: true });
    if (inMobileQuiz) mobileQuiz.scrollTop = 0;
    else target.scrollIntoView({ block: "start", behavior: "instant" });
  }, [index, showLesson]);

  const missed = readyForReview(missedQuestions(quiz, answers, mastered), answeredAt, answeredCount);
  function advance() {
    if (index + 1 === quiz.length) onFinish(answers); else navigate(index+1);
  }

  if(showLesson && item.lesson){
    const lesson=item.lesson;
    const en=lang==='en';
    const count=quiz.filter(q=>q.lesson?.id===lesson.id).length;
    return <section className={panel} lang={lang} aria-label={en?'Study topic':'Тема для изучения'}>
      {menuInfo && <details><summary>Меню квиза</summary>{menuInfo}</details>}
      <small>{en?'Module':'Модуль'} {lesson.module} · {lesson.lecture?(en?'Lecture ':'Лекция ')+lesson.lecture:(en?'Applied review · lectures 5–10':'Практическое повторение · лекции 5–10')}</small>
      <h2 ref={questionHeading} tabIndex={-1} className={styles.scrollTarget}>{lesson.title}</h2><p className="my-4 leading-relaxed">{lesson[lang]}</p>
      {lesson.notes && <EventNotes key={lesson.id} text={lesson.notes[lang]} lang={lang}/>}
      <div className="my-3 flex flex-wrap gap-4 text-sm underline"><a target="_blank" rel="noreferrer" href={'/events/courses/computer-networks/theory/'+lesson.module}>{en?'Module notes':'Конспект модуля'}</a><a target="_blank" rel="noreferrer" href={'/events/courses/computer-networks/lectures/'+(lesson.lecture||5)}>{en?'Lecture notes':'Лекция'}</a><a target="_blank" rel="noreferrer" href={'/events/courses/computer-networks/practice/unit-'+lesson.id}>{en?'Full topic bank':'Все вопросы темы'}</a></div>
      <p>{en?'Practice questions': 'Вопросов по теме'} · {count}</p>
      {navigationHost && createPortal(<nav className={styles.navigation} aria-label="Study navigation">
        <Button onClick={onExit}>{en?'Exit':'Выйти'}</Button><Button variant="primary" onClick={()=>setShowLesson(false)}>{en?'Next · practice':'Далее · к вопросам'}</Button>
      </nav>,navigationHost)}
    </section>;
  }
  return (
    <>
      <QuizStage menu={<>
        {menuInfo ?? <p>{step.title[tl]}</p>}
        <div className="flex items-center gap-3">
          <div
            className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--color-surface-2)]"
            role="progressbar"
            aria-label="Answered questions"
            aria-valuemin={0}
            aria-valuemax={quiz.length}
            aria-valuenow={answeredCount}
          >
            <div className="h-full rounded-full bg-violet-400 transition-[width]" style={{ width: `${(answeredCount / quiz.length) * 100}%` }} />
          </div>
          <span className="shrink-0 text-sm tabular-nums">Question {index + 1} of {quiz.length}</span>
        </div>
        <Button onClick={onExit}>← Exit quiz</Button>
        <Button aria-pressed={music} onClick={onMusic}>{music ? "♪ Music: on" : "♪ Music: off"}</Button>
      </>} language={lessons?lang:undefined} questionTexts={[item.q,...item.options]}>{reviewing ? <ErrorReview candidates={missed} onCorrect={(id, selected) => {
        const corrected = creditReview(quiz, answers, id, selected);
        if (corrected !== answers) { setAnswers(corrected); onAnswer?.(id, selected); }
      }} onDone={id => {
        const nextMastered = id ? [...mastered, id] : mastered;
        setMastered(nextMastered); setReviewing(false);
        setReviewAt(missedQuestions(quiz, answers, nextMastered).length ? answeredCount + reviewDelay() : null);
        advance();
      }}/> : <><section data-quiz-card className={panel}>
        <h2 ref={questionHeading} tabIndex={-1} data-selection-question lang="en" className={cn(styles.scrollTarget, "whitespace-pre-wrap break-words text-lg font-semibold leading-snug")}><QuestionText>{item.q}</QuestionText></h2>
        {multi && <p className="mt-3 text-sm" role="status">Choose {expected.length} answers · Selected: {(picked ?? selected).length} / {expected.length}</p>}
        <div className="mt-4 space-y-2">
          {item.options.map((option, i) => {
            const right = answered && expected.includes(i);
            const wrong = answered && picked?.includes(i) && expected.length > 0 && !expected.includes(i);
            const chosen = (picked ?? selected).includes(i);
            return (
              <AnswerOption
                key={`${item.id}-${i}`}
                data-selection-question lang="en"
                data-answer-state={right ? "correct" : wrong ? "wrong" : undefined}
                aria-disabled={answered}
                aria-pressed={chosen}
                onClick={() => { if (!answered) { if (multi) setSelected(selected.includes(i) ? selected.filter(n => n !== i) : [...selected, i]); else submit([i]); } }}
                className={cn(
                  "relative block w-full rounded-2xl border p-3 text-left text-[15px] transition",
                  right ? "border-emerald-400 bg-emerald-500/15" : wrong ? "border-red-400 bg-red-500/15" : "border-[var(--color-border)]",
                  !answered && "hover:bg-[var(--color-surface-2)]",
                  answered && !right && !wrong && "opacity-60",
                )}
              >
                <span className="quiz-answer-mark" data-checkbox={multi && !answered ? "true" : undefined} aria-hidden="true">{right ? "✓" : wrong ? "✗" : chosen ? "✓" : ""}</span><span>{item.labels && `${item.labels[i]}. `}<QuestionText>{option}</QuestionText></span>
                {(right || wrong) && <span className="sr-only">{right ? " — correct answer" : " — incorrect answer"}</span>}
              </AnswerOption>
            );
          })}
        </div>

        {multi && <Button variant="primary" className="mt-4 w-full" disabled={answered || selected.length !== expected.length} onClick={() => submit(selected)}>Check answers</Button>}
      </section>
        {answered && (
          <div className="yg-rise mt-4 scroll-mb-28 space-y-3">
            <div role="status" className={cn(styles.scrollTarget, "rounded-2xl bg-[var(--color-surface-2)] p-4 text-sm")}>
              <p className="font-semibold">{!expected.length ? "Explanation only" : matchesAnswer(picked, expected) ? "Correct" : "Not quite"}</p>
              <QuizExplanation question={item} expanded={explainOptionsOpen} picked={picked ?? []}/>
              {item.studyLink && <a href={item.studyLink.href} target="_blank" rel="noreferrer" className="mt-3 block font-medium underline">Study notes: {item.studyLink.title} ↗</a>}
              <ReportQuestion key={item.id} eventId={eventId} questionId={item.id} />
            </div>
          </div>
        )}
        {navigationHost && createPortal(<nav className={styles.navigation} aria-label="Question navigation">
          <Button disabled={index === 0} onClick={() => navigate(index-1)}>← Back</Button>
          <Button variant="primary" className="flex-1" disabled={!answered}
            onClick={() => { if (reviewAt !== null && answeredCount >= reviewAt && missed.length) setReviewing(true); else advance(); }}>
            {index + 1 === quiz.length ? "Finish quiz" : "Next"}
          </Button>
        </nav>, navigationHost)}
      </>}</QuizStage>
      {/* Плеер — под вопросом, а не над ним. Сверху он занимал на телефоне
          треть экрана (меньше 200×200 правила YouTube делать не дают), и
          варианты ответа уезжали за край. Позиция в дереве не меняется от
          вопроса к вопросу — музыка не перезапускается. */}
      {music && <EventMusic />}
    </>
  );
}

