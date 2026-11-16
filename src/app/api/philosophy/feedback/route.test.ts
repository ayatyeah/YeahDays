import { beforeEach, describe, expect, it, vi } from 'vitest';
const mocks=vi.hoisted(()=>({auth:vi.fn(),review:vi.fn(),available:vi.fn(),limit:vi.fn()}));
vi.mock('@/auth',()=>({auth:mocks.auth}));
vi.mock('@/lib/philosophy/feedback',()=>({reviewEssay:mocks.review}));
vi.mock('@/lib/geminiTutor',()=>({geminiAvailable:mocks.available}));
vi.mock('@/lib/aiLimit',()=>({dailyLimit:mocks.limit}));
vi.mock('@/lib/rateLimit',()=>({rateLimit:()=>true}));
import { POST } from './route';
import { ESSAY_CONSENT } from '@/lib/philosophy/practice';
const input={news:'A hypothetical AI app monitors emotions.',draft:'The main problem is privacy and autonomy.',mode:'plan',lang:'ru',consent:ESSAY_CONSENT};
const req=(body:unknown=input,origin='https://yeahgrind.site')=>new Request('https://yeahgrind.site/api/philosophy/feedback',{method:'POST',headers:{origin,'Content-Type':'application/json'},body:JSON.stringify(body)});
beforeEach(()=>{vi.clearAllMocks();mocks.auth.mockResolvedValue({user:{id:'student'}});mocks.available.mockReturnValue(true);mocks.limit.mockResolvedValue(true);mocks.review.mockResolvedValue({criteria:[{score:9}]});});
describe('essay review access',()=>{
 it('requires authentication and explicit consent before provider calls',async()=>{mocks.auth.mockResolvedValue(null);expect((await POST(req())).status).toBe(401);mocks.auth.mockResolvedValue({user:{id:'student'}});expect((await POST(req({...input,consent:false}))).status).toBe(400);expect(mocks.review).not.toHaveBeenCalled();});
 it('rejects cross-site requests, invalid bodies and oversized drafts',async()=>{expect((await POST(req(input,'https://untrusted.example'))).status).toBe(403);expect((await POST(req(null))).status).toBe(400);expect((await POST(req({...input,draft:'a'.repeat(70001)}))).status).toBe(413);expect(mocks.review).not.toHaveBeenCalled();});
 it('does not assign an essay total to an early practice attempt',async()=>{const response=await POST(req());expect(response.status).toBe(200);expect((await response.json()).total).toBeNull();expect(response.headers.get('Cache-Control')).toContain('no-store');});
 it('honors durable budgets and reports a provider failure honestly',async()=>{mocks.limit.mockResolvedValue(false);expect((await POST(req())).status).toBe(429);expect(mocks.review).not.toHaveBeenCalled();mocks.limit.mockResolvedValue(true);mocks.review.mockRejectedValue(Error('secret-provider-details'));const response=await POST(req());expect(response.status).toBe(502);expect(await response.text()).not.toContain('secret-provider-details');});
});
