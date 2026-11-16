import { afterEach, describe, expect, it, vi } from 'vitest';
import { countWords, RUBRIC, validateFeedback } from './practice';
import { reviewEssay } from './feedback';
vi.mock('@/lib/geminiTutor',()=>({geminiKeys:()=>['test-key']}));
vi.mock('@/lib/aiUsage',()=>({recordAiUsage:vi.fn()}));
const valid=()=>({summary:'Start by making the claim specific.',strength:'You name a relevant value.',criteria:RUBRIC.map(r=>({id:r.id,score:0,reason:'Needs development.'})),fixes:[{quote:'AI is good',explanation:'Name who benefits.',example:'The app could help users notice changes.'}],nextSteps:['Name the problem.','Explain one idea.','Apply it to the case.']});
afterEach(()=>vi.unstubAllGlobals());
describe('philosophy feedback',()=>{
 it('counts words across languages without counting punctuation',()=>{expect(countWords('  AI — это инструмент. Don’t over-claim!  ')).toBe(5);expect(countWords('… ---')).toBe(0);});
 it('rejects impossible marks and missing criteria',()=>{const f=valid();f.criteria[0].score=11;expect(()=>validateFeedback(f)).toThrow();const g=valid();g.criteria[1].id='problem';expect(()=>validateFeedback(g)).toThrow();});
 it('grounds suggested changes in the actual draft',async()=>{const fetcher=vi.fn().mockResolvedValue(Response.json({candidates:[{finishReason:'STOP',content:{parts:[{text:JSON.stringify(valid())}]}}]}));vi.stubGlobal('fetch',fetcher);const result=await reviewEssay({news:'A fictional application monitors emotions.',draft:'AI is good because it helps people.',mode:'paragraph',lang:'ru'});expect(result.fixes[0].quote).toBe('AI is good');const body=JSON.parse(fetcher.mock.calls[0][1].body);expect(body.systemInstruction.parts[0].text).toContain('UNTRUSTED DATA');expect(body.systemInstruction.parts[0].text).toContain('scores are unused and must all be zero');});
 it('rejects fabricated quotes and truncated responses',async()=>{vi.stubGlobal('fetch',vi.fn().mockResolvedValue(Response.json({candidates:[{finishReason:'STOP',content:{parts:[{text:JSON.stringify(valid())}]}}]})));await expect(reviewEssay({news:'A fictional application monitors emotions.',draft:'Privacy needs protection.',mode:'essay',lang:'en'})).rejects.toThrow('ungrounded');vi.stubGlobal('fetch',vi.fn().mockResolvedValue(Response.json({candidates:[{finishReason:'MAX_TOKENS'}]})));await expect(reviewEssay({news:'A fictional application monitors emotions.',draft:'AI is good',mode:'essay',lang:'en'})).rejects.toThrow('incomplete');});
});
