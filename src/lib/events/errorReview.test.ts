import { describe, expect, it } from 'vitest';
import { missedQuestions, reviewDelay, shuffledOptions } from './errorReview';
import { matchesAnswer } from './quizAnswers';

describe('spaced error reinforcement', () => {
  it('waits two or three new answers, never zero or one', () => {
    expect(reviewDelay(() => 0)).toBe(2);
    expect(reviewDelay(() => .999999)).toBe(3);
  });
  it('includes even a single mistake, excludes unanswered, ungraded, correct and mastered items', () => {
    const questions = [{ id:'wrong',correct:[1] },{ id:'right',correct:[0] },{ id:'unanswered',correct:[0] },{ id:'ungraded',correct:[] }];
    const answers: number[][] = [[0], [0]];
    answers[3] = [0];
    expect(missedQuestions(questions,answers,[]).map(q=>q.id)).toEqual(['wrong']);
    expect(missedQuestions(questions,answers,['wrong'])).toEqual([]);
    expect(answers[0]).toEqual([0]);
  });
  it('changes option positions while preserving original keys, including multiple correct answers', () => {
    for (const length of [2,4,5,6]) for (const random of [()=>0,()=>.999999,Math.random]) {
      const order = shuffledOptions(length,random);
      expect([...order].sort((a,b)=>a-b)).toEqual(Array.from({length},(_,i)=>i));
      expect(order.some((value,i)=>value!==i)).toBe(true);
      const expected = [0,length-1];
      expect(matchesAnswer(order.filter(original=>expected.includes(original)),expected)).toBe(true);
    }
  });
});
