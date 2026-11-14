import { beforeEach, expect, it, vi } from 'vitest';
const m=vi.hoisted(()=>({auth:vi.fn(),find:vi.fn(),rate:vi.fn(),daily:vi.fn(),ai:vi.fn(),transaction:vi.fn(),create:vi.fn(),update:vi.fn(),lock:vi.fn()}));
vi.mock('@/auth',()=>({auth:m.auth}));
vi.mock('@/lib/db',()=>({prisma:{finalStudyWorkspace:{findUnique:m.find},$transaction:m.transaction}}));
vi.mock('@/lib/rateLimit',()=>({rateLimit:m.rate}));
vi.mock('@/lib/aiLimit',()=>({dailyLimit:m.daily}));
vi.mock('@/lib/finalStudyAi',()=>({generateFinalTasks:m.ai}));
import {GET,POST} from './route';
import {createFinalStudy,readProfile,standardTasks} from '@/lib/finalStudy';
const profile={goal:'Study database joins',topic:'Databases',difficulty:'Understanding foreign keys',minutes:15,mode:'standard'};
const post=(body:unknown,headers:Record<string,string>={})=>POST(new Request('https://example.test/api/final-study',{method:'POST',headers:{'Content-Type':'application/json',...headers},body:JSON.stringify(body)}));
beforeEach(()=>{
 vi.clearAllMocks();m.auth.mockResolvedValue({user:{id:'owner'}});m.find.mockResolvedValue(null);m.rate.mockReturnValue(true);m.daily.mockResolvedValue(true);
 m.transaction.mockImplementation(fn=>fn({$queryRaw:m.lock,finalStudyWorkspace:{findUnique:m.find,create:m.create,update:m.update}}));
 m.create.mockImplementation(({data})=>Promise.resolve(data));m.update.mockImplementation(({data})=>Promise.resolve(data));
});
it('requires login and uses only the session owner',async()=>{
 m.auth.mockResolvedValue(null);expect((await GET()).status).toBe(401);expect((await post({action:'create'})).status).toBe(401);expect(m.find).not.toHaveBeenCalled();
 m.auth.mockResolvedValue({user:{id:'owner'}});expect((await GET()).status).toBe(200);expect(m.find).toHaveBeenCalledWith({where:{userId:'owner'}});
});
it('rejects cross-origin, malformed and excessive mutations',async()=>{
 expect((await post({action:'create',profile},{origin:'https://other.test'})).status).toBe(403);
 expect((await post({action:'erase'})).status).toBe(400);
 expect((await post({action:'create',profile},{'Content-Type':'text/plain'})).status).toBe(400);
 m.rate.mockReturnValue(false);expect((await post({action:'create',profile})).status).toBe(429);
});
it('requires explicit AI consent before contacting a provider',async()=>{
 expect((await post({action:'create',profile:{...profile,mode:'ai'},consent:false})).status).toBe(403);expect(m.ai).not.toHaveBeenCalled();
});
it('never replaces unavailable AI with a mislabeled template',async()=>{
 m.ai.mockRejectedValue(Error('ai_unavailable'));
 const response=await post({action:'create',profile:{...profile,mode:'ai'},consent:true});
 expect(response.status).toBe(503);expect(await response.json()).toEqual({error:'ai_unavailable'});expect(m.create).not.toHaveBeenCalled();
});
it('creates a standard plan without AI and ignores a supplied owner',async()=>{
 const response=await post({action:'create',profile,userId:'someone-else'});expect(response.status).toBe(200);
 expect(m.ai).not.toHaveBeenCalled();expect(m.create.mock.calls[0][0].data.userId).toBe('owner');
 expect((await response.json()).study.tasks).toHaveLength(9);
});
it('keeps an existing plan on repeat creation',async()=>{
 const data=createFinalStudy(readProfile(profile),standardTasks(15),null);data.tasks[0].completedAt='2026-11-14T10:00:00Z';m.find.mockResolvedValue({data});
 const response=await post({action:'create',profile:{...profile,mode:'ai'},consent:true});
 expect((await response.json()).study.tasks[0].completedAt).toBe(data.tasks[0].completedAt);expect(m.ai).not.toHaveBeenCalled();expect(m.create).not.toHaveBeenCalled();
});
it('honors the public origin behind Railway TLS termination',async()=>{
 const req=new Request('http://internal:8080/api/final-study',{method:'POST',headers:{'content-type':'application/json','origin':'https://yeahgrind.site','x-forwarded-host':'yeahgrind.site','x-forwarded-proto':'https'},body:JSON.stringify({action:'create',profile})});
 expect((await POST(req)).status).toBe(200);
});

it('rejects a forged forwarded origin and bounds request bytes', async()=>{
 expect((await post({action:'create',profile},{origin:'https://attacker.test','x-forwarded-host':'attacker.test','x-forwarded-proto':'https'})).status).toBe(403);
 expect((await post({action:'create',profile,extra:'a'.repeat(7000)})).status).toBe(413);
 expect(m.ai).not.toHaveBeenCalled();expect(m.create).not.toHaveBeenCalled();
});
