import foundations from '../awsCloudFoundations/questions.json';
import developing from '../awsCloudDeveloping/questions.json';
import foundationExplanations from '../awsCloudFoundations/explanations.ru.json';
import developingExplanations from '../awsCloudDeveloping/explanations.ru.json';
import { shuffle } from '../engine';
import { matchesAnswer } from '../quizAnswers';
import type { AwsAnswers } from '../awsCloudDeveloping/progress';
import { topicForQuestion } from './topics';
export const studyQuestions = [...foundations, ...developing];
export const studyExplanations: Record<string, {summary: string; options: string[]}> = { ...foundationExplanations, ...developingExplanations };
export const studyCounts = Object.fromEntries(studyQuestions.map(q => [q.id, q.options.length]));
export type StudyPractice = 'all' | 'diagnostic' | 'final' | 'mistakes' | 'unanswered';
export function studyPracticeSet(answers: AwsAnswers, topicIds: string[], kind: StudyPractice) {
  const bank = studyQuestions.filter(q => !topicIds.length || topicIds.includes(topicForQuestion(q).id));
  if (kind === 'mistakes') return bank.filter(q => answers[q.id] && !matchesAnswer(answers[q.id], q.answers));
  if (kind === 'unanswered') return bank.filter(q => !answers[q.id]);
  if (kind === 'all') return bank;
  const groups = [...new Set(bank.map(q => q.id.split('-q')[0]))];
  return shuffle(groups.flatMap(group => shuffle(bank.filter(q => q.id.startsWith(`${group}-q`))).slice(0, kind === 'diagnostic' ? 1 : 2)));
}
export const courseStorage = { foundations: 'yg-aws-foundations-checks-v1', developing: 'yg-aws-developing-checks-v1' };
