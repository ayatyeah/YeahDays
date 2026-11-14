import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { standardTasks, type StudyProfile } from './finalStudy';
vi.mock('./geminiTutor', () => ({ geminiKeys: () => Array.from({ length: 6 }, (_, i) => `test-key-${i}`) }));
const profile: StudyProfile = { goal:'Learn joins',topic:'Databases',difficulty:'Missing matches',minutes:15,mode:'ai' };
const valid = () => new Response(JSON.stringify({ responseId:'generated-id', candidates:[{finishReason:'STOP',content:{parts:[{text:JSON.stringify({tasks:standardTasks(15)})}]}}] }));
beforeEach(()=>vi.resetModules());
afterEach(()=>vi.unstubAllGlobals());
it('uses all six configured slots for failover without exposing keys in URLs or payloads', async()=>{
 const fetcher=vi.fn();for(let i=0;i<5;i++)fetcher.mockResolvedValueOnce(new Response('{}',{status:503}));fetcher.mockResolvedValueOnce(valid());vi.stubGlobal('fetch',fetcher);
 const {generateFinalTasks}=await import('./finalStudyAi');const result=await generateFinalTasks(profile);
 expect(result.tasks).toHaveLength(9);expect(result.generation.provider).toBe('google-gemini');
 expect(new Set(fetcher.mock.calls.map(c=>c[1].headers['x-goog-api-key'])).size).toBe(6);
 for(const [url,request] of fetcher.mock.calls){expect(url).not.toContain('test-key');expect(request.body).not.toContain('test-key');}
 const body=JSON.parse(fetcher.mock.calls[0][1].body);expect(body.generationConfig.responseMimeType).toBe('application/json');
 expect(JSON.parse(body.contents[0].parts[0].text)).toEqual({goal:profile.goal,topic:profile.topic,difficulty:profile.difficulty,minutes:15});
});
it('keeps a throttled key in cooldown on the next generation',async()=>{
 const fetcher=vi.fn().mockResolvedValueOnce(new Response('{}',{status:429,headers:{'retry-after':'120'}})).mockImplementation(async()=>valid());vi.stubGlobal('fetch',fetcher);
 const {generateFinalTasks}=await import('./finalStudyAi');await generateFinalTasks(profile);await generateFinalTasks(profile);
 const rejected=fetcher.mock.calls[0][1].headers['x-goog-api-key'];expect(fetcher.mock.calls[1][1].headers['x-goog-api-key']).not.toBe(rejected);expect(fetcher.mock.calls[2][1].headers['x-goog-api-key']).not.toBe(rejected);
});
it.each(['SAFETY','MAX_TOKENS'])('does not retry blocked or truncated output (%s)',async reason=>{
 const fetcher=vi.fn().mockResolvedValue(new Response(JSON.stringify({candidates:[{finishReason:reason}]})));vi.stubGlobal('fetch',fetcher);
 const {generateFinalTasks}=await import('./finalStudyAi');await expect(generateFinalTasks(profile)).rejects.toThrow('ai_unavailable');expect(fetcher).toHaveBeenCalledTimes(1);
});
it('does not cycle through keys for a schema/configuration error',async()=>{
 const fetcher=vi.fn().mockResolvedValue(new Response('provider details',{status:400}));vi.stubGlobal('fetch',fetcher);
 const {generateFinalTasks}=await import('./finalStudyAi');await expect(generateFinalTasks(profile)).rejects.toThrow('ai_unavailable');expect(fetcher).toHaveBeenCalledTimes(1);
});
