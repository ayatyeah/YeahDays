import { expect, it, vi } from 'vitest';
import { AI_ACCESS_VERSION, requestScopes, permittedHistory, projectContext } from './aiAccess';
import { loadAiContext } from './aiContext';
import { prisma } from './db';
vi.mock('./db',()=>({prisma:Object.fromEntries(['userState','learningProfile','personalizationProfile','communityProfile','lmsConnection','user'].map(k=>[k,{findUnique:vi.fn().mockResolvedValue(null)}]))}));
it('natural-language requests and old checkbox cannot grant expanded access',()=>{
 expect(requestScopes({message:'Изучи мой аккаунт'})).toEqual([]);
 expect(()=>requestScopes({withPlan:true})).toThrow();
 for(const consent of [{accepted:false,version:AI_ACCESS_VERSION,scopes:['plan']},{accepted:true,version:'old',scopes:['plan']},{accepted:true,version:AI_ACCESS_VERSION,scopes:['passwords']}])expect(()=>requestScopes({consent})).toThrow();
 expect(requestScopes({consent:{accepted:true,version:AI_ACCESS_VERSION,scopes:['learning','plan']}})).toEqual(['learning','plan']);
});
it('reads nothing without consent, and scopes every permitted lookup to the authenticated account',async()=>{
 vi.clearAllMocks();expect(await loadAiContext('me',[])).toBeUndefined();for(const model of Object.values(prisma))expect((model as any).findUnique).not.toHaveBeenCalled();
 await loadAiContext('me',['learning']);expect(prisma.learningProfile.findUnique).toHaveBeenCalledWith({where:{userId:'me'},select:{data:true}});expect(prisma.userState.findUnique).not.toHaveBeenCalled();expect(prisma.user.findUnique).not.toHaveBeenCalled();
});
it('projects allowlisted fields only and does not include other scopes or credentials',()=>{
 const rows={state:{email:'secret-email',todos:[{title:'Networks lab',date:'2026-10-02',notes:'secret-note',done:false}],goals:{health:0.5}},learning:{xp:90,skills:[{title:'TCP',subject:{name:'Networks',materials:'secret-material'},quests:[{title:'Quiz',rubric:'secret-rubric',completed:true}]}]},lms:{encryptedUrl:'secret-url',lastSyncedAt:null,timezone:'Asia/Almaty'},profile:{blocked:['secret-user'],subjects:['Networks'],goals:['Learn TCP']}};
 const plan=projectContext(['plan'],rows);expect(plan.learning).toBeUndefined();expect(JSON.stringify(plan)).toContain('Networks lab');expect(JSON.stringify(plan)).not.toContain('secret-');
 const learning=projectContext(['learning'],rows);expect(JSON.stringify(learning)).toContain('TCP');expect(JSON.stringify(learning)).not.toContain('secret-');expect(learning.plan).toBeUndefined();
});
it('cuts off private turns and downstream quotations after consent narrows, including legacy context',()=>{
 const base={at:'',role:'user' as const,text:'x'};
 const history=[{...base,id:'a'},{...base,id:'b',access:{scopes:['plan'],version:AI_ACCESS_VERSION,at:''}},{...base,id:'c',role:'assistant' as const,text:'private task quoted'},{...base,id:'d',text:'quote repeated'}];
 expect(permittedHistory(history,[]).map(m=>m.id)).toEqual(['a']);expect(permittedHistory(history,['plan'])).toHaveLength(4);
 expect(permittedHistory([{...base,id:'old',withPlan:true},{...base,id:'reply'}],[])).toEqual([]);
});
