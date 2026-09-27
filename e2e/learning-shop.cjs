// Opt-in integration check: uses a temporary DB account and one paid OpenAI grading call.
// Run the release build locally on port 3120 with AUTH_SECRET=local-learning-test-secret,
// DATABASE_URL and OPENAI_API_KEY, then: node --env-file=.env e2e/learning-shop.cjs
// Only the synthetic qa-learning-* account is mutated; cleanup runs in finally.
const {chromium}=require(process.cwd()+'/node_modules/playwright');
const {PrismaClient}=require(process.cwd()+'/node_modules/@prisma/client');
const {randomUUID}=require('node:crypto');
const assert=require('node:assert/strict');
(async()=>{
const prisma=new PrismaClient(); const id='qa-learning-'+randomUUID(); let browser;
try{
await prisma.user.create({data:{id,name:'Learning QA'}});
const quests=Array.from({length:6},(_,i)=>({id:'q'+i,title:'Практика '+(i+1),lesson:'Сложение объединяет группы предметов. Проверь сумму пересчётом.',exercise:'Вычисли 2+2 и объясни своими словами.',rubric:'Ответ 4 с корректным коротким объяснением сложения.',boss:i===5,completed:i<2,attempts:i<2?1:0,feedback:'',completedAt:i<2?new Date().toISOString():null}));
await prisma.learningProfile.create({data:{userId:id,data:{xp:100,coins:40,owned:['default'],equipped:'default',skills:[{id:'skill',goal:'Сложение',title:'Основы сложения',minutes:10,createdAt:new Date().toISOString(),quests}]}}});
browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:390,height:844},serviceWorkers:'block'});page.setDefaultTimeout(20000);
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.addInitScript(id=>{localStorage.setItem('yeahdays-store',JSON.stringify({version:13,state:{name:'Learning QA',onboarded:true,seenGuide:true,seenFeatures:['challenges','todos','schedule','timeslots','push','personal-duration'],todos:[],plan:[],updatedAt:Date.now()}}));localStorage.setItem('yd-active-account',id);},id);
const {encode}=await import(process.cwd()+'/node_modules/@auth/core/jwt.js');
await page.context().addCookies([{name:'authjs.session-token',value:await encode({secret:'local-learning-test-secret',salt:'authjs.session-token',token:{id,sub:id,name:'Learning QA'}}),url:'http://localhost:3120'}]);
await page.route('**/api/**',async route=>{const p=new URL(route.request().url()).pathname;if(p==='/api/learning')return route.continue();let data={ok:true};if(p==='/api/auth/session')data={user:{id,name:'Learning QA'},expires:'2099-01-01T00:00:00Z'};else if(p==='/api/state')data={data:null,updatedAt:null};await route.fulfill({contentType:'application/json',body:JSON.stringify(data)});});
await page.goto('http://localhost:3120/learn');
await page.getByLabel('Твой ответ',{exact:true}).waitFor();
await page.waitForTimeout(1000);
if(await page.getByRole('button',{name:'Понятно',exact:true}).isVisible())await page.getByRole('button',{name:'Понятно',exact:true}).click();
await page.getByLabel('Твой ответ',{exact:true}).fill('2+2=4. Если к двум предметам добавить ещё два, всего получится четыре предмета.');
await page.getByRole('button',{name:'Проверить ответ',exact:true}).click();
await page.getByText('Квест пройден! +50 XP · +20 монет',{exact:true}).waitFor({timeout:90000});
let state=await (await page.request.get('http://localhost:3120/api/learning')).json();assert.equal(state.coins,60);assert.equal(state.xp,150);assert.ok(!JSON.stringify(state).includes('rubric'));
const duplicate=await page.request.post('http://localhost:3120/api/learning',{data:{action:'answer',skillId:'skill',questId:'q2',answer:'4'}});assert.equal((await duplicate.json()).result.awarded,false);
await page.screenshot({path:'/tmp/learning-qa.png',fullPage:true});
await page.goto('http://localhost:3120/shop');
const card=page.locator('article').filter({has:page.getByRole('heading',{name:'Учёный',exact:true})});
await card.getByRole('button',{name:'Купить',exact:true}).click();
await card.getByRole('button',{name:'Надеть',exact:true}).waitFor();
state=await (await page.request.get('http://localhost:3120/api/learning')).json();assert.equal(state.coins,0);
await card.getByRole('button',{name:'Надеть',exact:true}).click();await card.getByRole('button',{name:'Выбран',exact:true}).waitFor();
await page.reload();await page.getByText('◈ 0 монет',{exact:true}).waitFor();await page.getByAltText('Примерка: Учёный',{exact:true}).waitFor();await page.waitForTimeout(700);
assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
await page.screenshot({path:'/tmp/shop-qa.png',fullPage:true});
await page.goto('http://localhost:3120/account');await page.locator('img[alt="Персонаж: Учёный"]:visible').first().waitFor();
state=await (await page.request.get('http://localhost:3120/api/learning')).json();assert.equal(state.equipped,'scholar');assert.equal(state.coins,0);
assert.deepEqual(errors,[]);console.log('PASS: real AI grading → single reward → purchase → equip → reload persistence → profile avatar; mobile layout OK');
}finally{if(browser)await browser.close();await prisma.user.deleteMany({where:{id}});await prisma.$disconnect();console.log('Temporary QA account removed');}
})().catch(e=>{console.error(e.message);process.exitCode=1;});
