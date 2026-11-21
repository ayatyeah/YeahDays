import extra113 from './final113.json';
import variant4 from './final4.json';
import variant122 from './final122.json';
import variant123 from './final123.json';
import { archiveBank } from './grind';
import { midtermRelated } from './midterm';
import { endtermRelated } from './endterm';
import type { EventQuizQuestion } from '@/components/events/EventQuiz';

const variants = [
  { number: 4, questions: variant4 },
  { number: 122, questions: variant122 },
  { number: 123, questions: variant123 },
];
const lectures = [1,1,2,3,3,4,4,5,5,5,6,7,7,8,9,10,0];

// A printed position points to a shared question when its task, inputs and answer match.
const equivalent: Record<string, string> = {
  'final-123-02': 'final-122-11', 'final-123-09': 'final-122-14',
  'final-123-10': 'final-122-10', 'final-123-11': 'final-122-12',
  'final-123-15': 'final-122-13', 'final-123-22': 'final-4-22',
  'final-123-23': 'final-122-21', 'final-123-24': 'final-122-15',
};
const paper113 = [
  '123-21','113-02','123-17','122-14','123-05','122-05','113-07',
  '123-13','123-14','122-11','123-16','4-02','113-13','123-08',
  '113-15','122-12','4-22','122-21','123-18','113-20','122-13',
].map(id => 'final-' + id);
const papers = [
  ...variants.map(v => ({ number: v.number, ids: v.questions.map(q => equivalent[q.id] ?? q.id) })),
  { number: 113, ids: paper113 },
];
const unique = [...variants.flatMap(v => v.questions), ...extra113].filter(q => !equivalent[q.id]);
export const finalPaper: EventQuizQuestion[] = unique.map(q => ({
  id: q.id, q: q.q, options: q.options, correct: q.correct,
  why: { ru: q.explanation, en: q.explanationEn }, optionReasons: q.optionReasons,
  source: { kind: 'paper', module: q.module, lecture: lectures[q.module - 1],
    positions: Object.fromEntries(papers.flatMap(paper => {
      const index = paper.ids.indexOf(q.id);
      return index < 0 ? [] : [[paper.number, index + 1]];
    })),
  },
}));
export const finalOccurrences = papers.reduce((n, p) => n + p.ids.length, 0);
export const finalTranslations = Object.fromEntries(unique.flatMap(q =>
  [[q.q, q.qRu], ...q.options.map((option, i) => [option, q.optionsRu[i]])]
));

const coveredModules = new Set(unique.map(q => q.module));
export const finalRelated: EventQuizQuestion[] = [
  ...archiveBank.flatMap(q => {
    const module = Number(/^module-(\d+)-/.exec(q.id)?.[1]);
    if (!coveredModules.has(module) || !q.correct.length) return [];
    return [{ ...q, source: { kind: 'module', module, lecture: lectures[module - 1] } }];
  }),
  ...[...midtermRelated, ...endtermRelated].filter(q =>
    q.source?.kind === 'lecture' && (q.source.module ? coveredModules.has(q.source.module) :
      [...coveredModules].some(module => lectures[module - 1] === q.source?.lecture))
  ),
];
