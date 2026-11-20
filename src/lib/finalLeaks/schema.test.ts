import {describe,it,expect} from 'vitest';
import template from '../../../public/final-leaks/template.json';
import {parseLeakBatch,questionFingerprint,publishQuestions} from './schema';
describe('photo-question import validation',()=>{
 it('preserves original text/order and multiple correct answers',()=>{const b=parseLeakBatch({...template,questions:[{...template.questions[0],answers:[2,0]}]});expect(b.questions[0].options).toEqual(template.questions[0].options);expect(b.questions[0].answers).toEqual([0,2]);expect(publishQuestions(b)[0].id).toBe(`leak-${b.id}-1`);});
 it('rejects missing explanation, mismatched translation and invalid keys',()=>{for(const patch of [{answers:[9]},{answers:[]},{answers:[0,0]},{answers:[0.5]},{optionsRu:['one']},{optionExplanationsRu:['one']},{explanationRu:''},{options:['same','same']}])expect(()=>parseLeakBatch({...template,questions:[{...template.questions[0],...patch}]})).toThrow();});
 it('detects exact duplicates but preserves printed variants with reordered options',()=>{const q=template.questions[0];expect(questionFingerprint(q)).toBe(questionFingerprint({...q,prompt:' '+q.prompt.toUpperCase()+' '}));expect(questionFingerprint(q)).not.toBe(questionFingerprint({...q,options:[...q.options].reverse()}));expect(()=>parseLeakBatch({...template,questions:[q,{...q}]})).toThrow(/повтор/);});
 it('bounds ids, batches and text',()=>{for(const patch of [{id:'../admin'},{questions:[]},{questions:Array(101).fill(template.questions[0])},{title:'a'.repeat(181)}])expect(()=>parseLeakBatch({...template,...patch})).toThrow();});
});
