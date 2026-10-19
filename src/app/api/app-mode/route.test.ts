import {beforeEach,expect,it,vi} from 'vitest';
const m=vi.hoisted(()=>({auth:vi.fn(),find:vi.fn(),mutate:vi.fn()}));
vi.mock('@/auth',()=>({auth:m.auth}));
vi.mock('@/lib/db',()=>({prisma:{researchParticipant:{findUnique:m.find}}}));
vi.mock('@/lib/researchDb',()=>({mutateResearch:m.mutate}));
import {POST} from './route';
const request=(mode:unknown,origin?:string)=>new Request('https://example.com/api/app-mode',{method:'POST',headers:{'Content-Type':'application/json',...(origin?{origin}:{})},body:JSON.stringify({mode})});
beforeEach(()=>{vi.resetAllMocks();m.auth.mockResolvedValue(null);});
it('allows choosing either version before authentication without enrolling',async()=>{for(const mode of ['normal','rmt']){const r=await POST(request(mode));expect(r.status).toBe(200);expect(r.headers.get('set-cookie')).toContain(`yg-version=${mode}`);expect(r.headers.get('set-cookie')).toContain('HttpOnly');}expect(m.find).not.toHaveBeenCalled();});
it('rejects invalid modes and cross-origin changes',async()=>{expect((await POST(request('B'))).status).toBe(400);expect((await POST(request('normal','https://evil.example'))).status).toBe(403);});
it('records crossover only once and never changes assignment or clears study data',async()=>{
 m.auth.mockResolvedValue({user:{id:'alice'}});m.find.mockResolvedValue({withdrawnAt:null});const data:any={events:[],appConsent:{version:'main-app-v1'},condition:'B'};m.mutate.mockImplementation(async(_id,change)=>change(data));
 await POST(request('normal'));await POST(request('normal'));expect(data.events).toHaveLength(1);expect(data.condition).toBe('B');expect(data.ordinaryAccessAt).toBeTruthy();
 await POST(request('rmt'));expect(data.selectedVersion).toBe('rmt');expect(data.events).toHaveLength(1);expect(data.ordinaryAccessAt).toBeTruthy();
});
it('does not create a study account for ordinary users',async()=>{m.auth.mockResolvedValue({user:{id:'alice'}});m.find.mockResolvedValue(null);const r=await POST(request('normal'));expect((await r.json()).redirect).toBe('/app');expect(m.mutate).not.toHaveBeenCalled();});

it('uses the public HTTPS origin behind the deployment proxy',async()=>{
 const req=new Request('http://localhost:3000/api/app-mode',{method:'POST',headers:{origin:'https://yeahgrind.site','x-forwarded-host':'yeahgrind.site','x-forwarded-proto':'https'},body:JSON.stringify({mode:'normal'})});
 const response=await POST(req);expect(response.status).toBe(200);expect(response.headers.get('set-cookie')).toContain('Secure');
 const bad=new Request('http://localhost:3000/api/app-mode',{method:'POST',headers:{origin:'https://evil.example','x-forwarded-host':'yeahgrind.site','x-forwarded-proto':'https'},body:JSON.stringify({mode:'normal'})});expect((await POST(bad)).status).toBe(403);
});
