import {test,newUser,session,openSection,check,sql} from '../harness.mjs';

test('Tutor quota: saved remaining budget refreshes after sending and survives new chat',async()=>{
 const user=await newUser();const {browser,page}=await session({user,engine:'chromium'});
 const day=new Date().toISOString().slice(0,10),key=`tutor-day:${user.id}`;
 try{
  sql(`INSERT INTO "AiLimit" (key,day,count) VALUES ('${key}','${day}',3) ON CONFLICT (key,day) DO UPDATE SET count=3`);
  await page.route('**/api/personalization',route=>route.fulfill({json:{ai:true,revision:999999}}));
  await page.route('**/api/study-events/tutor',async route=>{
   if(route.request().method()!=='POST')return route.continue();
   sql(`UPDATE "AiLimit" SET count=count+1 WHERE key='${key}' AND day='${day}'`);
   await route.fulfill({contentType:'text/plain',body:'Тестовый ответ без запроса к провайдеру.'});
  });
  await openSection(page,'/events/computer-networks-endterm');
  await page.getByRole('button',{name:'Открыть ИИ-помощника',exact:true}).click();
  const quota=page.getByTestId('tutor-quota');await quota.getByText('Ваш лимит сайта: осталось 117 из 120',{exact:true}).waitFor();
  check(true,'reads actual stored count, not a hard-coded allowance');
  await page.getByRole('textbox',{name:'Вопрос помощнику'}).fill('Объясни IP');
  await page.getByRole('button',{name:'Отправить',exact:true}).click();
  await quota.getByText('Ваш лимит сайта: осталось 116 из 120',{exact:true}).waitFor();
  check(true,'remaining refreshes after response');
  await page.getByRole('button',{name:'Новый чат',exact:true}).click();
  check((await quota.innerText()).includes('116 из 120'),'new chat does not reset server quota');
  await quota.locator('summary').click();
  check((await quota.innerText()).includes('Общий лимит сайта'),'shared app budget is labelled separately');
  await page.evaluate(()=>document.documentElement.dataset.theme='dark');await page.setViewportSize({width:390,height:844});
  check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'mobile quota panel fits');
  await page.screenshot({path:'e2e/.out/tutor-quota-dark.png'});
 }finally{sql(`DELETE FROM "AiLimit" WHERE key='${key}'`);await browser.close();}
});
