import type { StudyEvent } from '@/lib/events/types';
import { CV_PREP } from './content';

/** Bounded lexical retrieval over trusted bilingual course notes, never client-supplied documents. */
export function cvFinalContext(event: StudyEvent, question: string, partId?: string): string {
  if (event.id !== 'computer-vision-final') return '';
  const terms = [...new Set(question.toLocaleLowerCase().match(/[\p{L}\p{N}]{3,}/gu) ?? [])]
    .filter(term => !['the', 'and', 'what', 'this', 'that', 'как', 'что', 'мне', 'для', 'это', 'объясни'].includes(term)).slice(0, 60);
  const candidates = [
    ...CV_PREP.map(unit => ({ id: `cv-prep-${unit.id}`, title: unit.title, notes: unit.notes })),
    ...event.lectures.flatMap(lecture => lecture.parts),
  ];
  const ranked = candidates.filter(part => part.id !== partId && part.id !== 'final-guide').map(part => {
    const title = `${part.title.en} ${part.title.ru}`.toLocaleLowerCase();
    const text = `${part.notes.en} ${part.notes.ru}`.toLocaleLowerCase();
    return { part, score: terms.reduce((score, term) => score + (title.includes(term) ? 6 : 0) + (text.includes(term) ? 1 : 0), 0) };
  }).filter(item => item.score > 0).sort((a, b) => b.score - a.score).slice(0, 3);
  const active = CV_PREP.find(unit => `cv-prep-${unit.id}` === partId);
  const guide = event.lectures.flatMap(lecture => lecture.parts).find(part => part.id === 'final-guide');
  return [
    '=== COMPUTER VISION FINAL PREPARATION ===',
    'You coach preparation before the exam: explain concepts, review attempts, rehearse oral defence and generate original practice. Do not claim to know the actual exam variant or guarantee a mark. The published sample is a practice format, not the confirmed exam task. Separate measured results from hypotheses; never invent experiments or scores. For plans ask how much time remains if unknown. For oral rehearsal ask one question and wait, then give specific feedback and a short English answer frame.',
    'Use the supplied course excerpts as sources. Cite the lecture title or preparation unit when it supports the answer. If evidence is missing, say so; distinguish general background from LMS requirements. The local practice units are original study material, not instructor questions. The sample says AI assistants are not allowed during the assessment; these tools are for preparation.',
    guide ? `Published format and preparation guide:\n${guide.notes.en.slice(0, 5000)}` : '',
    active ? `Active preparation unit: ${active.title.en}\n${active.notes.en}\n${active.notes.ru}` : '',
    ...ranked.map(({ part }) => `Relevant course excerpt: ${part.title.en}\n${part.notes.en.slice(0, 4200)}\n${part.notes.ru.slice(0, 2500)}`),
  ].filter(Boolean).join('\n\n');
}
