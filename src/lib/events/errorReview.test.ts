import { describe, expect, it } from 'vitest';
import { missedQuestions, reviewDelay, shuffledOptions, readyForReview, creditReview } from './errorReview';
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
  it('never selects a fresh mistake while an older mistake is due', () => {
    const mistakes = [{id:'old'},{id:'fresh'},{id:'recent'}];
    expect(readyForReview(mistakes,{old:1,recent:2,fresh:3},3)).toEqual([{id:'old'}]);
    expect(readyForReview([{id:'fresh'}],{fresh:3},4)).toEqual([]);
    expect(readyForReview([{id:'fresh'}],{fresh:3},5)).toEqual([{id:'fresh'}]);
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


describe('review score correction', () => {
  const questions = [{id:'single',correct:[2]}, {id:'multi',correct:[0,3]}, {id:'last',correct:[1]}];
  const score = (answers: number[][]) => questions.filter((q,i) => matchesAnswer(answers[i],q.correct)).length;
  it('increases the final score exactly once and removes the corrected mistake', () => {
    const original = [[0],[0,3],[1]];
    const corrected = creditReview(questions, original, 'single', [2]);
    expect(score(original)).toBe(2);
    expect(score(corrected)).toBe(3);
    expect(original[0]).toEqual([0]);
    expect(missedQuestions(questions, corrected, [])).toEqual([]);
    expect(creditReview(questions, corrected, 'single', [2])).toBe(corrected);
  });
  it('uses original answer keys after shuffling and rejects partial or wrong answers', () => {
    const answers = [[2],[1],[1]];
    expect(creditReview(questions,answers,'multi',[0])).toBe(answers);
    expect(creditReview(questions,answers,'multi',[1,3])).toBe(answers);
    expect(score(creditReview(questions,answers,'multi',[3,0]))).toBe(3);
    expect(creditReview(questions,answers,'missing',[0])).toBe(answers);
    expect(creditReview(questions,[], 'single',[2])).toEqual([]);
  });
});
