import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { EVENTS } from './index';
import { FINAL_NOTEBOOKS } from './finals';
import { studyQuestions } from './awsStudy/bank';
import { termQuestions } from './awsTerms/quiz';
import pm from './projectManagement/quiz2_questions.json';
const dictionaries = {en:JSON.parse(readFileSync('public/quiz-language/en.json','utf8')),ru:JSON.parse(readFileSync('public/quiz-language/ru.json','utf8'))} as Record<'en'|'ru',Record<string,string>>;
function translated(text:string,lang:'en'|'ru') {return (/[а-яё]/i.test(text)?'ru':'en')===lang?text:dictionaries[lang][text];}
function check(q:string, options:string[]) {
 for(const lang of ['en','ru'] as const) {
  expect(translated(q,lang),q).toBeTruthy();
  for(const option of options) expect(translated(option,lang),option).toBeTruthy();
 }
}
describe('complete bilingual quiz banks',()=>{
 it('covers all 220 AWS questions and preserves original English text and option positions',()=>{
  expect(studyQuestions).toHaveLength(220);
  for(const q of studyQuestions){check(q.prompt,q.options);expect(new Set(q.options.map(o=>translated(o,'ru'))).size,q.id).toBe(new Set(q.options).size);expect(translated(q.prompt,'en')).toBe(q.prompt);expect(q.options.map(o=>translated(o,'en'))).toEqual(q.options);}
 });
 it('covers all 134 term questions and every distractor in English',()=>{
  expect(termQuestions).toHaveLength(134);
  for(const q of termQuestions){check(q.q,q.options);expect(new Set(q.options.map(o=>translated(o,'en'))).size,q.id).toBe(new Set(q.options).size);expect(translated(q.q,'en')).not.toMatch(/[а-яё]/i);for(const o of q.options)expect(translated(o,'en')).not.toMatch(/[а-яё]/i);}
 });
 it('keeps the Organizations definition attached to its own translation',()=>{
  const text='Organizations объединяет аккаунты; SCP ограничивает доступные разрешения; RAM делится поддерживаемыми ресурсами.';
  expect(translated(text,'en')).toContain('Organizations');
  expect(translated(text,'en')).toContain('permissions');
  expect(translated(text,'en')).not.toContain('WAF');
 });
 it('covers the other published static event banks and timed PM quiz',()=>{
  for(const event of [...EVENTS,...FINAL_NOTEBOOKS.map(n=>n.event)]) for(const lecture of event.lectures) for(const part of lecture.parts) for(const q of [...part.questions,...part.deep??[]])check(q.q,q.options);
  for(const q of pm){check(q.question,q.options);expect(translated(q.scenario,'ru')).toBeTruthy();}
 });
});
