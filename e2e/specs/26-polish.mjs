import { mkdirSync } from 'node:fs';
import { test, check, newUser, session } from '../harness.mjs';
test('Полировка: плотность, стабильность списка и настройки', async () => {
 const day = new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Almaty'}).format(new Date());
 const user = await newUser({state:{todos:['Прочитать главу','Повторить слова','Прогуляться'].map((title,i)=>({id:`polish-${i}`,title,date:day,duration:10,priority:'normal',subtasks:[],done:false,doneDays:[],createdAt:Date.now()}))}});
 const {browser,page}=await session({user,serviceWorkers:'block',initScript:()=>{localStorage.setItem('yd-install-dismissed','1');localStorage.setItem('yeahdays-theme',JSON.stringify({state:{theme:'light'},version:0}));}});
 mkdirSync('artifacts/polish',{recursive:true});
 try {
  await page.setViewportSize({width:390,height:844});
  await page.goto('/today',{waitUntil:'networkidle'});
  await page.locator(".one-action-plan > summary").click();
  await page.getByRole('button',{name:'Выполнить: Прочитать главу',exact:true}).waitFor();
  await page.getByLabel('Как твоя энергия?',{exact:true}).selectOption('low');
  await page.getByLabel('Сколько времени есть?',{exact:true}).selectOption('15');
  check(await page.getByLabel('Как твоя энергия?',{exact:true}).inputValue()==='low','энергия меняется компактным контролом');
  const row=page.locator('.companion-task').nth(1);
  const before=await row.evaluate(el=>el.offsetTop);
  await page.getByRole('button',{name:'Выполнить: Прочитать главу',exact:true}).click();
  await page.getByRole('button',{name:'Вернуть: Прочитать главу',exact:true}).waitFor();
  const after=await row.evaluate(el=>el.offsetTop);
  check(Math.abs(after-before)<2,'завершение задачи не сдвигает соседние строки');
  check(await page.locator('.companion-task').count()===3,'выполненная строка остаётся на месте');
  await page.getByRole('button',{name:'Отменить выполнение',exact:true}).click();
  for(const width of [320,390,1440]) {
   await page.setViewportSize({width,height:900});
   await page.locator('[data-section="today"]').evaluate(el=>el.scrollTo(0,0));
   await page.waitForTimeout(200);
   check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`нет переполнения ${width}`);
   await page.screenshot({path:`artifacts/polish/today-${width}.png`});
  }
 } finally {await browser.close();}
});
