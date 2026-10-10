import {mkdirSync} from 'node:fs';
import {test,check,newUser,session} from '../harness.mjs';
test('Главная: свайп, одно активное дело, восстановление и завершение', async()=>{
 const actions=['Прочитать страницу','Размяться пять минут','Записать одну мысль'].map((title,i)=>({id:`one-${i}`,title,why:'Небольшое действие помогает начать.',category:'learning',difficulty:1,duration:5,energy:'low',timePreference:'any',impact:2,custom:true}));
 const user=await newUser({state:{customActions:actions,useOwnActionsOnly:true}});
 const {browser,page}=await session({user,serviceWorkers:'block',initScript:()=>{localStorage.setItem('yd-install-dismissed','1');localStorage.setItem('yeahdays-theme',JSON.stringify({state:{theme:'light'},version:0}));}});
 const top=()=>page.locator('.one-action article').last();
 mkdirSync('artifacts/one-action',{recursive:true});
 try {
  await page.setViewportSize({width:390,height:844});
  await page.goto('/today',{waitUntil:'networkidle'});
  await top().waitFor(); await page.waitForTimeout(400);
  check(!await page.locator('.one-action-plan').evaluate(el=>el.open),'план свёрнут: на главной только одно решение');
  const first=await top().locator('h2').innerText();
  const r=await top().boundingBox();
  await page.mouse.move(r.x+r.width*.5,r.y+r.height*.5);
  await page.mouse.down();
  await page.mouse.move(r.x+r.width*.5+20,r.y+r.height*.5,{steps:10});
  await page.waitForTimeout(150); await page.mouse.up(); await page.waitForTimeout(500);
  check(await top().locator('h2').innerText()===first,'короткий жест возвращает ту же карточку');
  await page.mouse.move(r.x+r.width*.7,r.y+r.height*.5);
  await page.mouse.down(); await page.mouse.move(r.x+15,r.y+r.height*.5,{steps:15}); await page.waitForTimeout(80); await page.mouse.up();
  await page.waitForFunction(title=>[...document.querySelectorAll('.one-action article h2')].at(-1)?.textContent!==title,first);
  await page.waitForTimeout(400);
  const accepted=await top().locator('h2').innerText();
  check(first!==accepted,'свайп влево показывает другую карточку');
  await page.getByRole('button',{name:'Беру',exact:true}).click();
  await page.getByRole('heading',{name:'Сейчас — только это',exact:true}).waitFor();
  check(await page.locator('.one-action article').count()===0,'принятие закрывает колоду');
  await page.waitForFunction(async()=>{const d=await fetch('/api/state').then(r=>r.json());return JSON.stringify(d).includes('one-');});
  await page.waitForTimeout(2200);
  await page.reload({waitUntil:'networkidle'});
  await page.getByRole('heading',{name:accepted,exact:true}).waitFor();
  check(await page.locator('.one-action article').count()===0,'после перезагрузки сохраняется одно активное дело');
  await page.getByRole('button',{name:/Сделал ·/}).click();
  await page.getByRole('button',{name:'Выбрать ещё одно дело',exact:true}).waitFor();
  check(await page.locator('.one-action article').count()===0,'после завершения можно остановиться без новой нагрузки');
  await page.getByRole('button',{name:'Выбрать ещё одно дело',exact:true}).click();
  await top().waitFor();
  check(await top().locator('h2').innerText()!==accepted,'выполненное действие не возвращается');
  await page.waitForTimeout(4500); // Day-completion celebration finishes before design captures.
  for(const width of [320,390,1440]){
   await page.setViewportSize({width,height:width===1440?900:844});
   await page.locator('[data-section="today"]').evaluate(el=>el.scrollTo(0,0));
   await page.waitForTimeout(300);
   check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`нет переполнения ${width}`);
   await page.screenshot({path:`artifacts/one-action/today-${width}.png`});
  }
 }finally{await browser.close();}
});
