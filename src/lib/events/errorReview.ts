import { matchesAnswer } from './quizAnswers';
export function reviewDelay(random = Math.random) { return 2 + Math.floor(random() * 2); }
export function missedQuestions<T extends { id: string; correct: number[] }>(questions: T[], answers: number[][], mastered: string[]) {
  return questions.filter((q, i) => answers[i] !== undefined && q.correct.length > 0 && !matchesAnswer(answers[i], q.correct) && !mastered.includes(q.id));
}
export function shuffledOptions(length: number, random = Math.random) {
  const order = Array.from({ length }, (_, i) => i);
  for (let i = length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
  // A repeated question should visibly differ even when the random shuffle is identity.
  if (length > 1 && order.every((value, i) => value === i)) order.push(order.shift()!);
  return order;
}
