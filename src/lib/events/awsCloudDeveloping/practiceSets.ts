import questions from './questions.json';
import type { AwsAnswers } from './progress';
import { shuffle } from '../engine';
import { matchesAnswer } from '../quizAnswers';

export type DayPracticeKind = 'all' | 'diagnostic' | 'final' | 'mistakes';
export function dayPracticeSet(answers: AwsAnswers, modules: number[], kind: DayPracticeKind) {
  const bank = questions.filter(q => !modules.length || modules.includes(q.module));
  if (kind === 'mistakes') return bank.filter(q => answers[q.id] && !matchesAnswer(answers[q.id], q.answers));
  if (kind === 'all') return bank;
  const perModule = kind === 'diagnostic' ? 1 : 2;
  return shuffle([...new Set(bank.map(q => q.module))].flatMap(module => shuffle(bank.filter(q => q.module === module)).slice(0, perModule)));
}
