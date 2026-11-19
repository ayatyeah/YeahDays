import {describe,it,expect} from 'vitest';
import {questions,sources,filterBank,defaultFilters,makeAttempt,quizQuestion,topics,difficulties} from './bank';
import translations from '../../../../public/quiz-language/ru.json';
import foundations from '../awsCloudFoundations/questions.json';
import developing from '../awsCloudDeveloping/questions.json';
describe('authored Cloud Computing bank',()=>{
 it('covers all source groups without replacing the original bank',()=>{
  expect(foundations.length+developing.length).toBe(220);
  expect(sources).toHaveLength(40);
  for(const s of sources)expect(questions.filter(q=>q.sourceId===s.id).length).toBeGreaterThanOrEqual(3);
  expect(new Set(questions.map(q=>q.id)).size).toBe(questions.length);
  expect(new Set(questions.map(q=>q.prompt.toLowerCase().trim())).size).toBe(questions.length);
 });
 it('has aligned bilingual choices, valid keys, explanations and evidence',()=>{
  const dict=translations as Record<string,string>;
  for(const q of questions){
   expect(sources.some(s=>s.id===q.sourceId)).toBe(true);
   expect(q.options).toHaveLength(4);expect(new Set(q.options).size).toBe(4);
   expect(q.optionsRu).toHaveLength(4);expect(q.optionExplanationsRu).toHaveLength(4);
   expect(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4).toBe(true);
   expect(q.explanationRu.length).toBeGreaterThan(30);
   for(const e of q.optionExplanationsRu)expect(e.length).toBeGreaterThan(15);
   expect(q.evidence.length).toBeGreaterThan(0);
   for(const e of q.evidence)expect(Number.isInteger(e.page)&&e.page>0).toBe(true);
   expect(topics[q.topic]).toBeTruthy();expect(difficulties[q.difficulty]).toBeTruthy();
   expect(dict[q.prompt]).toBeTruthy();for(const o of q.options)expect(dict[o]).toBeTruthy();
   expect(quizQuestion(q).correct).toEqual([q.answer]);
   expect(quizQuestion(q).why.en).toBe(q.explanationRu);
  }
 });
 it('combines filters and distinguishes mistakes from unanswered',()=>{
  const q=questions[0],s=sources.find(s=>s.id===q.sourceId)!;
  expect(filterBank({...defaultFilters,kind:s.kind,source:s.id,topic:q.topic,search:q.prompt},{})).toContain(q);
  expect(filterBank({...defaultFilters,status:'errors'},{[q.id]:[(q.answer+1)%4]})).toEqual([q]);
  expect(filterBank({...defaultFilters,status:'errors'},{[q.id]:[q.answer]})).toEqual([]);
  expect(filterBank({...defaultFilters,status:'unanswered'},{[q.id]:[q.answer]})).not.toContain(q);
 });
 it('caps selection, validates counts and shuffles without changing the bank',()=>{
  const before=questions.map(q=>q.id);
  expect(makeAttempt(questions,2,false)).toEqual(questions.slice(0,2));
  expect(makeAttempt(questions,Infinity,true)).toEqual([]);
  expect(makeAttempt(questions,0,true)).toEqual([]);
  expect(makeAttempt(questions,2.9,false)).toHaveLength(2);
  const shuffled=makeAttempt(questions,questions.length+100,true);
  expect(new Set(shuffled.map(q=>q.id))).toEqual(new Set(before));
  expect(questions.map(q=>q.id)).toEqual(before);
 });
});
