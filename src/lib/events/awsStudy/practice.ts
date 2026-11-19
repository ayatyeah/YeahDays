import { studyQuestions } from './bank';
import { shuffle } from '../engine';
export type AwsCourse = 'foundations' | 'developing';
export type AwsQuestion = (typeof studyQuestions)[number];
export const questionCourse = (question: AwsQuestion): AwsCourse => question.id.startsWith('aws-found-') ? 'foundations' : 'developing';
export function moduleBank(course: AwsCourse | 'both', module = 0): AwsQuestion[] {
  const bank = studyQuestions.filter(q => course === 'both' || questionCourse(q) === course);
  if (!module) return bank;
  // These two introductory/certification modules have no original Knowledge Check.
  if (course === 'developing' && module === 1) return bank.filter(q => [2, 4].includes(q.module));
  if (course === 'developing' && module === 14) return bank;
  return bank.filter(q => q.module === module);
}
/** Five stable, non-overlapping variants: two questions from every source module. */
export function examVariant(number: number): AwsQuestion[] {
  if (!Number.isInteger(number) || number < 1 || number > 5) return [];
  return studyQuestions.filter(q => (q.number - 1) % 5 === number - 1);
}
export function prepareAttempt(bank: AwsQuestion[], count: number, random: boolean): AwsQuestion[] {
  if (!Number.isFinite(count) || count < 1) return [];
  return (random ? shuffle(bank) : bank.slice()).slice(0, Math.min(Math.floor(count), bank.length));
}
