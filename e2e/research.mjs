// DATABASE_URL=postgresql://.../research_test AUTH_SECRET=... E2E_BASE=http://localhost:3109 node e2e/research.mjs
// Server uses the same DB/secret, RESEARCH_ENABLED=true and a valid contact/deletion date.
import assert from 'node:assert/strict';
import { PrismaClient } from '@prisma/client';
import { encode } from 'next-auth/jwt';
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
const url = new URL(process.env.DATABASE_URL || 'https://invalid');
const base = process.env.E2E_BASE || 'http://localhost:3109';
assert(['localhost','127.0.0.1'].includes(url.hostname) && /test/.test(url.pathname), 'Use an isolated local test database');
assert(['localhost','127.0.0.1'].includes(new URL(base).hostname));
assert(process.env.AUTH_SECRET);
const db = new PrismaClient(); const browser = await chromium.launch({ headless: true }); const ids=[];
async function account(owner=false) {
  const user=await db.user.create({data:{email:owner?'research-owner@test.local':`research-${crypto.randomUUID()}@test.local`,name:'Test'}});ids.push(user.id);
  const context=await browser.newContext({viewport:{width:390,height:844}});
  const token=await encode({secret:process.env.AUTH_SECRET,salt:'authjs.session-token',token:{id:user.id,sub:user.id,email:user.email,name:user.name}});
  await context.addCookies([{name:'authjs.session-token',value:token,url:base,httpOnly:true},{name:'yg-version',value:'rmt',url:base,httpOnly:true}]);
  return {user,context,page:await context.newPage()};
}
async function post(context,body) { const r=await context.request.post(`${base}/api/research`,{data:body});assert.equal(r.status(),200,await r.text());return r.json(); }
const consent={version:'assignment3-v1',appVersion:'main-app-v1',adult:true,notDeveloper:true,consent:true,aiConsent:true};
try {
  const anon=await browser.newContext(); assert.equal((await anon.request.get(`${base}/api/research`)).status(),401);
  const landing=await anon.newPage();await landing.goto(base);await landing.getByRole('heading',{name:/Какую версию/}).waitFor();
  const a=await account();const forbidden=[];
  a.page.on('request',r=>{if(['/api/state','/api/personalization','/api/visit','/api/learning'].some(p=>r.url().endsWith(p)))forbidden.push(r.url());});
  await a.page.goto(`${base}/rmt`);await a.page.getByRole('button',{name:'Начать участие'}).waitFor();
  assert.equal((await a.context.request.post(`${base}/api/research`,{data:{action:'activity'}})).status(),400);
  for(const box of await a.page.getByRole('checkbox').all())await box.check();
  await a.page.getByRole('button',{name:'Начать участие'}).click();
  await a.page.getByRole('heading',{name:'Следующий шаг'}).waitFor();
  await a.page.getByRole('button',{name:'Открыть и начать'}).click();
  await a.page.getByRole('button',{name:'Завершить',exact:true}).click();
  await a.page.getByRole('heading',{name:'Пять минут внимания',exact:true}).waitFor();
  await Promise.all(Array.from({length:3},()=>post(a.context,{action:'complete',taskId:'w1-plan'})));
  let row=await db.researchParticipant.findUniqueOrThrow({where:{userId:a.user.id}});
  assert.equal(row.data.events.filter(e=>e.event_type==='task_complete').length,1);
  assert.equal(row.data.events.filter(e=>e.event_type==='session_start').length,1);
  const b=await account();const second=await post(b.context,{...consent,action:'enroll',condition:row.condition});assert.notEqual(second.participant.condition,row.condition);
  const standard=row.condition==='A'?a:b; const standardFeedback=await standard.context.request.post(`${base}/api/research/feedback`);assert.equal(standardFeedback.status(),200);assert.equal((await standardFeedback.json()).source,'standard');
  for(const user of [a,b])for(const path of ['/api/ai/chat','/api/ai/planner','/api/learning','/api/recommendations','/api/study-events/tutor','/api/integrations/add-todo','/api/push/send'])assert.equal((await user.context.request.post(base+path,{data:{}})).status(),403,path);
  assert.equal((await a.context.request.post(`${base}/api/research/retention`)).status(),401);
  await a.page.goto(`${base}/research`);assert.equal(new URL(a.page.url()).pathname,'/rmt');
  await a.page.goto(`${base}/chat`);assert.equal(new URL(a.page.url()).pathname,'/rmt');
  await a.page.goto(`${base}/`);await a.page.getByRole('heading',{name:/Какую версию/}).waitFor();
  mkdirSync('artifacts/research',{recursive:true});
  for(const width of [320,390,1440]) {
    await a.page.setViewportSize({width,height:900});
    for(const [path,title] of [['/rmt','Следующий шаг'],['/rmt/tasks','Ваши задания'],['/rmt/calendar','Ваши четыре недели'],['/rmt/progress','Ваш прогресс'],['/rmt/account','Ваш профиль']]) {
      await a.page.goto(base+path);await a.page.getByRole('heading',{name:title,exact:true}).waitFor();
      assert(await a.page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${path} overflow at ${width}`);
      await a.page.screenshot({path:`artifacts/research/main-${path.slice(1).replaceAll('/','-')}-${width}.png`,fullPage:true});
    }
  }
  await a.page.evaluate(()=>localStorage.setItem('yeahdays-theme',JSON.stringify({state:{theme:'dark'},version:0})));
  await a.page.goto(`${base}/rmt`);await a.page.getByRole('heading',{name:'Следующий шаг'}).waitFor();await a.page.screenshot({path:'artifacts/research/main-dark.png',fullPage:true});
  assert.deepEqual(forbidden,[],'No legacy analytics or synchronization runs');
  // Switching versions preserves assignment and marks research crossover once.
  const beforeSwitch=await db.researchParticipant.findUniqueOrThrow({where:{userId:a.user.id}});
  await a.page.goto(base);await a.page.getByRole('button',{name:'Открыть обычную версию'}).click();
  await a.page.waitForURL(base+'/app');
  assert.equal((await a.context.request.get(base+'/api/state')).status(),200);
  await a.page.getByRole('link',{name:/Сменить версию/}).click();
  await a.page.getByRole('button',{name:'Открыть версию для РМТ'}).click();
  await a.page.waitForURL(base+'/rmt');await a.page.getByRole('heading',{name:'Следующий шаг'}).waitFor();
  const afterSwitch=await db.researchParticipant.findUniqueOrThrow({where:{userId:a.user.id}});
  assert.equal(afterSwitch.condition,beforeSwitch.condition);assert(afterSwitch.data.ordinaryAccessAt);
  assert.equal(afterSwitch.data.selectedVersion,'rmt');
  assert.equal(afterSwitch.data.events.filter(e=>e.event_type==='version_switch').length,1);
  assert.equal((await a.context.request.get(base+'/api/state')).status(),403);

  assert.equal((await a.context.request.get(`${base}/api/owner/research`)).status(),403);
  await db.researchParticipant.update({where:{userId:a.user.id},data:{enrolledAt:new Date(Date.now()-22*86400000)}});
  await a.page.goto(`${base}/rmt/progress`);await a.page.getByRole('button',{name:'Отправить ответы'}).waitFor();
  for(const box of await a.page.getByRole('textbox').all())await box.fill('Neutral test feedback');
  await a.page.getByRole('button',{name:'Отправить ответы'}).click();await a.page.getByText('Ответы сохранены. Спасибо!').waitFor();
  const owner=await account(true);await owner.page.goto(`${base}/admin/research`);await owner.page.getByRole('heading',{name:'Исследование A/B'}).waitFor();
  const exp=await owner.context.request.get(`${base}/api/owner/research`);assert.equal(exp.status(),200);const text=await exp.text();assert(!text.includes(a.user.id)&&!text.includes(a.user.email)&&!text.includes('Neutral test feedback'));assert(text.includes('main-app-v1'));
  const interview=await owner.context.request.get(`${base}/api/owner/research?dataset=interviews`);assert((await interview.text()).includes('Neutral test feedback'));
  const own=await a.context.request.get(`${base}/api/account`);assert.equal(own.status(),200);assert.equal((await own.json()).research.participantId,row.participantId);
  // Upgrade an existing standalone account without changing its assignment or events.
  const old=await account();const oldStart=new Date(Date.now()-86400000);const oldEvents=[{event_type:'session_start',event_timestamp:oldStart.toISOString(),task_id:null}];
  await db.researchParticipant.create({data:{userId:old.user.id,participantId:crypto.randomUUID(),condition:'A',pilot:true,enrolledAt:oldStart,data:{version:'assignment3-v1',aiConsent:true,lastActivity:oldStart.getTime(),events:oldEvents,interview:null}}});
  assert.equal((await old.context.request.post(`${base}/api/research`,{data:{action:'start',taskId:'w1-plan'}})).status(),400);
  await old.page.goto(`${base}/rmt`);await old.page.getByRole('heading',{name:'Приложение обновилось'}).waitFor();
  await post(old.context,{...consent,action:'consent'});await post(old.context,{...consent,action:'consent'});
  const preserved=await db.researchParticipant.findUniqueOrThrow({where:{userId:old.user.id}});assert.equal(preserved.data.appConsent.migrated,true);assert.equal(preserved.condition,'A');assert.equal(preserved.enrolledAt.getTime(),oldStart.getTime());assert.deepEqual(preserved.data.events[0],oldEvents[0]);assert.equal(preserved.data.events.filter(e=>e.event_type==='app_consent').length,1);
  const exported=await(await owner.context.request.get(`${base}/api/owner/research`)).json();assert(!exported.participants.some(p=>p.participant_id===preserved.participantId));
  await post(a.context,{action:'withdraw'});row=await db.researchParticipant.findUniqueOrThrow({where:{userId:a.user.id}});assert(row.withdrawnAt);assert.equal(row.data.appConsent.version,'main-app-v1');assert(row.data.consentInformation.deleteAt);assert.deepEqual(row.data.events,[]);assert.equal(row.data.interview,null);
  assert.equal((await a.context.request.post(`${base}/api/research`,{data:{action:'start',taskId:'w1-review'}})).status(),400);
  assert((await post(a.context,{...consent,action:'enroll'})).participant.withdrawnAt);
  console.log('PASS: five main sections, 320/390/1440px, dark theme, consent, persistent tasks, A/B isolation, legacy API blocks, no background analytics, interview, admin export, upgrade preservation and withdrawal');
} finally {await browser.close();await db.user.deleteMany({where:{id:{in:ids}}});await db.$disconnect();}
