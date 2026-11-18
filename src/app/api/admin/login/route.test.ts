import { beforeEach, expect, it, vi } from 'vitest';
const m=vi.hoisted(()=>({credentials:vi.fn(),gate:vi.fn()}));
vi.mock('@/lib/adminSession',()=>({ADMIN_COOKIE:'test-admin',adminLoginConfigured:()=>true,credentialsValid:m.credentials,issueToken:()=>({value:'test',maxAgeSec:1})}));
vi.mock('@/lib/rateLimit',()=>({clientIp:()=> 'local',failureLimit:m.gate}));
import { POST } from './route';
beforeEach(()=>{vi.resetAllMocks();m.gate.mockReturnValue({allowed:true,fail:vi.fn()});m.credentials.mockReturnValue(false);});
it('rejects invalid JSON values before checking credentials',async()=>{
 for(const body of ['null','[]','"text"','{']) {
  expect((await POST(new Request('https://test/api/admin/login',{method:'POST',body}))).status).toBe(400);
 }
 expect(m.credentials).not.toHaveBeenCalled();
});
it('limits the request size and retains normal credential rejection',async()=>{
 expect((await POST(new Request('https://test/api/admin/login',{method:'POST',body:JSON.stringify({password:'x'.repeat(7000)})}))).status).toBe(413);
 expect((await POST(new Request('https://test/api/admin/login',{method:'POST',body:JSON.stringify({username:'someone',password:'wrong'})}))).status).toBe(401);
 expect(m.credentials).toHaveBeenCalledWith('someone','wrong');
});
