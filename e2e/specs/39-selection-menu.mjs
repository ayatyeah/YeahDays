import {newUser,session,test,openSection} from '../harness.mjs';
import assert from 'node:assert/strict';
test("Selection menu: copy, consent, translation, explanation and errors", async () => {
const user=await newUser();const {browser,page}=await session({user,engine:'chromium',initScript:"localStorage.setItem('yd-install-dismissed','1')"});
try{
 page.setDefaultTimeout(12000);
 await page.addInitScript(()=>{Object.defineProperty(navigator,'clipboard',{value:{writeText:async text=>{window.__copied=text;}}});});
 await openSection(page,'/events/computer-networks-endterm');
 await page.getByRole('button',{name:'Начать с первой части',exact:true}).click();
 await page.getByRole('group',{name:'Язык конспекта',exact:true}).getByRole('button',{name:'EN',exact:true}).click();
 const paragraph=page.getByTestId('lecture-notes').locator('p').first();
 const menu=page.getByRole('dialog',{name:'Действия с выделенным текстом'});
 const select=async()=>{await paragraph.scrollIntoViewIfNeeded();await page.waitForTimeout(250); await paragraph.evaluate(el=>{const r=document.createRange();r.selectNodeContents(el);const s=window.getSelection();s.removeAllRanges();s.addRange(r);}); await menu.waitFor();};
 let payload;
 await page.route('**/api/study-events/tutor',async route=>{if(route.request().method()==='POST'){payload=route.request().postDataJSON();await route.fulfill({status:200,contentType:'text/plain',body:'Сетевой уровень передаёт пакеты между сетями.'});}else await route.continue();});
 await select();
 await menu.getByRole('button',{name:'Русский абзац · без ИИ',exact:true}).click();
 await menu.getByText('Русская версия выделенных абзацев',{exact:true}).waitFor();
 assert.equal(payload,undefined,'bilingual notes translate without AI or consent');
 assert((await menu.innerText()).includes('IP отвечает за адресацию'));
 await page.keyboard.press('Escape');
 // Remove the source mapping to exercise the AI fallback and consent separately.
 await paragraph.evaluate(el=>el.removeAttribute('data-selection-translation'));
 await select();
 await menu.getByRole('button',{name:'Копировать',exact:true}).click();
 assert.equal(await page.evaluate(()=>window.__copied),(await paragraph.innerText()).trim());
 await menu.getByRole('button',{name:'Перевести на русский',exact:true}).click();
 const checkbox=menu.getByRole('checkbox');
 if(await checkbox.count()){
  assert.equal(payload,undefined,'no send without consent');
  await checkbox.check();await menu.getByRole('button',{name:'Получить ответ'}).click();
 }
 await menu.getByText('Сетевой уровень передаёт пакеты между сетями.',{exact:true}).waitFor();
 assert.equal(payload.lang,'ru');assert(payload.messages[0].text.includes('Переведи'));
 await page.screenshot({path:'e2e/.out/selection-mobile.png'});
 const box=await menu.boundingBox();assert(box.x>=0&&box.x+box.width<=await page.evaluate(()=>innerWidth));
 await page.keyboard.press('Escape');assert.equal(await menu.count(),0);
 await page.setViewportSize({width:1280,height:900});
 await select();
 await menu.getByRole('button',{name:'Объяснить проще'}).click();
 await menu.getByText('Сетевой уровень передаёт пакеты между сетями.',{exact:true}).waitFor();
 assert(payload.messages[0].text.includes('Объясни'));
 await page.screenshot({path:'e2e/.out/selection-desktop.png'});
 await page.keyboard.press('Escape');
 await page.route('**/api/study-events/tutor',route=>route.fulfill({status:429,contentType:'application/json',body:JSON.stringify({error:'Лимит запросов. Попробуй позже.'})}));
 await select();await menu.getByRole('button',{name:'Перевести на русский'}).click();
 await menu.getByRole('alert').filter({hasText:'Лимит запросов'}).waitFor();
 console.log('PASS: selection, copy, explicit consent, translation/explanation payloads, streamed response UI, mobile bounds, Escape, server errors. AI response mocked.');
}finally{await browser.close();}
});
