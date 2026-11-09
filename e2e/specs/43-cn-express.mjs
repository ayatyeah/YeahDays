import {test,newUser,session,openSection,check} from '../harness.mjs';
test('CN express: recall, persistence, weak filter and module navigation',async()=>{
 const user=await newUser();const {browser,page}=await session({user,engine:'chromium'});
 try {
  await openSection(page,'/events/computer-networks-endterm');
  await page.getByRole('button',{name:'Открыть подготовку к эндке',exact:true}).click();
  await page.getByRole('button',{name:'Экспресс-подготовка',exact:true}).click();
  const express=page.getByTestId('cn-express');
  await express.getByText('Могу объяснить: 0 из 24',{exact:true}).waitFor();
  check(await express.locator('article').count()===24,'24 recall cards cover study topics');
  check(await express.locator('details[open]').count()===0,'answers initially concealed');
  await express.getByLabel('Могу объяснить без подсказки',{exact:true}).first().check();
  await express.getByLabel('Только то, что нужно повторить',{exact:true}).check();
  check(await express.locator('article').count()===23,'weak filter hides mastered card');
  await page.reload();await page.getByRole('button',{name:'Открыть подготовку к эндке',exact:true}).click();
  await page.getByRole('button',{name:'Экспресс-подготовка',exact:true}).click();
  await express.getByText('Могу объяснить: 1 из 24',{exact:true}).waitFor();check(true,'self-review survives reload');
  await express.locator('summary').first().click();
  await express.getByRole('button',{name:'Разобрать модуль 8',exact:true}).first().click();
  await page.getByRole('heading',{name:'Подробные конспекты · Модули 8–16',exact:true}).waitFor();
  check((await page.locator('details[open]').first().innerText()).includes('next hop'),'review opens relevant full module');
  await page.getByRole('button',{name:'Экспресс-подготовка',exact:true}).click();
  await page.setViewportSize({width:390,height:844});
  check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'express fits mobile');
  await page.screenshot({path:'e2e/.out/cn-express.png'});
 }finally{await browser.close();}
});
