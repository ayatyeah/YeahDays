import { afterEach, beforeEach, expect, it, vi } from 'vitest';
const mocks=vi.hoisted(()=>({auth:vi.fn(),limit:vi.fn(),fetch:vi.fn()}));
vi.mock('@/auth',()=>({auth:mocks.auth}));
vi.mock('@/lib/rateLimit',()=>({rateLimit:mocks.limit}));
vi.mock('@/lib/geminiTutor',()=>({geminiKeys:()=>['test-key']}));
import { POST } from './route';
const req=(body:unknown={language:'en',texts:['Вопрос?']})=>new Request('https://yeahgrind.site/api/quiz-language',{method:'POST',headers:{origin:'https://yeahgrind.site','Content-Type':'application/json'},body:JSON.stringify(body)});
beforeEach(()=>{vi.clearAllMocks();vi.stubGlobal('fetch',mocks.fetch);mocks.auth.mockResolvedValue({user:{id:'student'}});mocks.limit.mockReturnValue(true);});
afterEach(()=>vi.unstubAllGlobals());
it('requires authentication and bounded valid input before using a provider',async()=>{
 mocks.auth.mockResolvedValue(null);expect((await POST(req())).status).toBe(401);
 mocks.auth.mockResolvedValue({user:{id:'student'}});
 for(const body of [null,{}, {language:'fr',texts:['x']},{language:'en',texts:['x'.repeat(6001)]}])expect((await POST(req(body))).status).toBe(400);
 mocks.limit.mockReturnValue(false);expect((await POST(req())).status).toBe(429);expect(mocks.fetch).not.toHaveBeenCalled();
});
it('maps translations by exact source even when returned in a different order',async()=>{
 mocks.fetch.mockResolvedValue(Response.json({candidates:[{content:{parts:[{text:JSON.stringify({items:[{source:'Нет',translation:'No'},{source:'Да',translation:'Yes'}]})}]}}]}));
 const response=await POST(req({language:'en',texts:['Да','Нет']}));expect(response.status).toBe(200);expect(await response.json()).toEqual({'Да':'Yes','Нет':'No'});expect(response.headers.get('Cache-Control')).toContain('no-store');
});
it('rejects missing or substituted source strings without leaking provider output',async()=>{
 mocks.fetch.mockResolvedValue(Response.json({candidates:[{content:{parts:[{text:JSON.stringify({items:[{source:'Wrong source',translation:'secret'}]})}]}}]}));
 const response=await POST(req());expect(response.status).toBe(503);expect(await response.text()).not.toContain('secret');
});
