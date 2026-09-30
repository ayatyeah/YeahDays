import { afterEach, expect, it, vi } from 'vitest';
import { askChat } from './aiChat';
afterEach(()=>{vi.unstubAllGlobals();vi.unstubAllEnvs();});
it('sends bounded chat context with storage disabled and plan only when explicitly supplied',async()=>{
  vi.stubEnv('OPENAI_API_KEY','qa-key');const fetcher=vi.fn().mockResolvedValue({ok:true,json:async()=>({status:'completed',output:[{content:[{type:'output_text',text:'Объяснение'}]}]})});vi.stubGlobal('fetch',fetcher);
  expect(await askChat([], 'Объясни TCP')).toBe('Объяснение');let body=JSON.parse(fetcher.mock.calls[0][1].body);expect(body.store).toBe(false);expect(body.input).toEqual([{role:'user',content:'Объясни TCP'}]);
  await askChat([], 'План', [{title:'Only authorized title'}]);body=JSON.parse(fetcher.mock.calls[1][1].body);expect(body.input[0].content).toContain('Only authorized title');
});
it('does not accept incomplete or failed provider responses',async()=>{
  vi.stubEnv('OPENAI_API_KEY','qa-key');vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:true,json:async()=>({status:'incomplete'})}));await expect(askChat([],'Hi')).rejects.toThrow('incomplete');
});
