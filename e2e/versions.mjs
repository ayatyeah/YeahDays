import assert from 'node:assert/strict';
import {PrismaClient} from '@prisma/client';
import {encode} from 'next-auth/jwt';
import {chromium} from 'playwright';
import {mkdirSync} from 'node:fs';
const base=process.env.E2E_BASE||'http://localhost:3109';
assert(new URL(process.env.DATABASE_URL).hostname==='localhost' && /test/.test(new URL(process.env.DATABASE_URL).pathname));
const db=new PrismaClient();const browser=await chromium.launch();let user;
try {
 const context=await browser.newContext({viewport:{width:390,height:844}});const page=await context.newPage();
 await page.goto(base);await page.getByRole('heading',{name:/Какую версию/}).waitFor();
 mkdirSync('artifacts/versions',{recursive:true});
 for(const width of [320,390,1440]){await page.setViewportSize({width,height:900});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:`artifacts/versions/selector-${width}.png`,fullPage:true});}
 await page.getByRole('button',{name:'Открыть обычную версию'}).click();await page.waitForURL(base+'/ordinary');
 user=await db.user.create({data:{email:`versions-${crypto.randomUUID()}@test.local`,name:'Version test'}});
 const actions=['Прочитать страницу','Размяться пять минут','Записать одну мысль'].map((title,i)=>({id:`one-${i}`,title,why:'Небольшое действие помогает начать.',category:'learning',difficulty:1,duration:5,energy:'low',timePreference:'any',impact:2,custom:true}));
 await db.userState.create({data:{userId:user.id,clientAt:new Date(1000),data:{name:user.name,onboarded:true,seenGuide:true,seenFeatures:['cv-midterm-2026-10','cc-midterm-2026-10','cn-midterm-2026-10','social-2026-10','events-2026-10','challenge30-2026-10','community-2026-09','challenges','todos','schedule','timeslots','push','personal-duration'],todos:[],plan:[],updatedAt:1,customActions:actions,useOwnActionsOnly:true}}});
 const at=new Date().toISOString();await db.personalizationProfile.create({data:{userId:user.id,data:{revision:1,version:'2026-10-05',acceptedAt:at,enabled:false,since:null,ai:false,receipts:[],timezone:'Asia/Almaty',days:{},seen:[],lastTick:0}}});
 const token=await encode({secret:process.env.AUTH_SECRET,salt:'authjs.session-token',token:{id:user.id,sub:user.id,email:user.email,name:user.name}});
 await context.addCookies([{name:'authjs.session-token',value:token,url:base,httpOnly:true}]);
 await page.goto(base+'/today');await page.getByRole('button',{name:'Беру',exact:true}).waitFor();
 await page.getByRole('button',{name:'Беру',exact:true}).click();await page.getByRole('heading',{name:'Сейчас — только это',exact:true}).waitFor();
 await page.waitForFunction(async()=>JSON.stringify(await fetch('/api/state').then(r=>r.json())).includes('one-'));
 await page.waitForTimeout(2200);await page.reload();await page.getByRole('heading',{name:'Сейчас — только это',exact:true}).waitFor();
 await page.getByRole('button',{name:/Сделал ·/}).click();await page.getByRole('button',{name:'Выбрать ещё одно дело',exact:true}).waitFor();
 await page.screenshot({path:'artifacts/versions/ordinary-task.png',fullPage:true});
 assert.equal(await db.researchParticipant.count({where:{userId:user.id}}),0);
 console.log('PASS: version selector 320/390/1440, ordinary landing, restored task acceptance, persistence and completion, no implicit study enrollment');
}finally{await browser.close();if(user)await db.user.delete({where:{id:user.id}});await db.$disconnect();}
