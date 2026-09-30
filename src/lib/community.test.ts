import { describe, it, expect } from 'vitest';
import { focusCredit, focusRequired, linesField, textField } from './community';
import { chatInput } from './aiChat';
describe('community validation and focus',()=>{
  const d=(n:number)=>new Date(n*1000);
  it('never credits background gaps, future timestamps or rapid duplicate pulses',()=>{
    expect(focusCredit(d(0),d(1000),d(91))).toBe(0);
    expect(focusCredit(d(10),d(1000),d(5))).toBe(0);
    expect(focusCredit(d(0),d(1000),d(9))).toBe(0);
    expect(focusCredit(d(0),d(1000),d(15))).toBe(15);
  });
  it('caps credit and never runs past room end',()=>{
    expect(focusCredit(d(0),d(1000),d(80))).toBe(45);
    expect(focusCredit(d(90),d(100),d(120))).toBe(10);
    expect(focusCredit(d(110),d(100),d(140))).toBe(0);
    expect(focusRequired(d(0),d(1500))).toBe(1200);
  });
  it('rejects malformed fields and limits public lists',()=>{
    expect(()=>textField({},100)).toThrow();expect(()=>textField('  ',100)).toThrow();
    expect(()=>linesField(Array(9).fill('a'))).toThrow();expect(linesField([' a ','a'])).toEqual(['a']);
  });
  it('bounds history context independently of retained messages',()=>{
    const history=Array.from({length:40},(_,i)=>({id:String(i),role:'user' as const,text:'x'.repeat(6000),at:''}));
    const input=chatInput(history,'hello');expect(input.length).toBe(4);expect(input.at(-1)?.content).toBe('hello');
  });
});
