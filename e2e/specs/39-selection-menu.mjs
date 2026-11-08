import {newUser,session,test,openSection,check} from '../harness.mjs';
test('Selection menu: ordinary actions never send AI requests',async()=>{
 const user=await newUser();const {browser,page}=await session({user,engine:'chromium'});
 try{
  page.setDefaultTimeout(15000);
  let posts=0;
  await page.route('**/api/study-events/tutor',async route=>{if(route.request().method()==='POST'){posts++;await route.fulfill({status:200,contentType:'text/plain',body:'Ответ помощника.'});}else await route.fulfill({json:{available:true}});});
  await page.route('**/api/personalization',route=>route.fulfill({json:{ai:true,revision:999999}}));
  await page.addInitScript(()=>{
   Object.defineProperty(navigator,'clipboard',{value:{writeText:async text=>{window.__copied=text;}}});
   Object.defineProperty(window,'speechSynthesis',{value:{getVoices(){return [];},cancel(){},speak(){window.__spoken=true;}}});
   window.SpeechSynthesisUtterance=class {constructor(text){this.text=text;}};
  });
  await openSection(page,'/events/computer-networks-endterm');
  await page.getByRole('button',{name:'Начать с первой части',exact:true}).click();
  await page.getByRole('group',{name:'Язык конспекта',exact:true}).getByRole('button',{name:'EN',exact:true}).click();
  const p=page.getByTestId('lecture-notes').locator('p').first();
  const menu=page.getByRole('dialog',{name:'Действия с выделенным текстом'});
  async function select(){await p.scrollIntoViewIfNeeded();await page.waitForTimeout(300);await p.evaluate(el=>{const r=document.createRange();r.selectNodeContents(el);const s=getSelection();s.removeAllRanges();s.addRange(r);});await menu.waitFor();}
  await select();
  await p.evaluate(el=>{const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let node;while((node=walker.nextNode())){const start=node.textContent.indexOf('IP addresses');if(start>=0){const r=document.createRange();r.setStart(node,start);r.setEnd(node,start+'IP addresses'.length);const s=getSelection();s.removeAllRanges();s.addRange(r);break;}}});
  await page.waitForTimeout(300);
  let translationCalls=0;
  await page.context().route('https://api.mymemory.translated.net/get?**',route=>{
   translationCalls++;const url=new URL(route.request().url());
   check(url.searchParams.get('q')==='IP addresses','only selected phrase sent to translator');
   return route.fulfill({headers:{'access-control-allow-origin':'*'},json:{responseStatus:200,responseData:{translatedText:'IP-адреса'}}});
  });
  const tabs=page.context().pages().length;
  await menu.getByRole('button',{name:'Перевести выделенное',exact:true}).click();
  await menu.getByText('IP-адреса',{exact:true}).waitFor();
  check(page.context().pages().length===tabs,'translation stays inside the original menu');
  await menu.getByRole('button',{name:'Перевести выделенное',exact:true}).click();
  await menu.getByText('IP-адреса',{exact:true}).waitFor();
  check(translationCalls===1,'repeat translation uses cache');
  check(posts===0,'inline translator never calls Gemini');
  await page.screenshot({path:'e2e/.out/selection-inline.png'});
  await page.keyboard.press('Escape');await select();
  await menu.getByRole('button',{name:'Русский абзац · без ИИ',exact:true}).click();
  check((await menu.innerText()).includes('IP отвечает за адресацию'),'Russian source paragraph shown');
  await menu.getByRole('button',{name:'Копировать',exact:true}).click();
  check(await page.evaluate(()=>window.__copied)===(await p.innerText()).trim(),'selected text copied');
  await menu.getByRole('button',{name:'Озвучить',exact:true}).click();
  check(await page.evaluate(()=>window.__spoken===true),'browser speech used');
  check(posts===0,'translation, copy and speech make zero AI POSTs');
  await menu.getByRole('button',{name:'Спросить ИИ…',exact:true}).click();
  const field=page.getByRole('textbox',{name:'Вопрос помощнику'});
  await field.waitFor();await page.waitForTimeout(700);
  check((await field.inputValue()).includes('Объясни простыми словами'),'question prepared as draft');
  check(posts===0,'opening tutor with prior AI permission does not auto-send');
  await page.screenshot({path:'e2e/.out/selection-draft.png'});
  await page.getByRole('button',{name:'Отправить',exact:true}).click();
  await page.getByText('Ответ помощника.',{exact:true}).waitFor();
  check(posts===1,'only explicit send consumes one AI request');
 }finally{await browser.close();}
});

test('Selection menu: full notes translate in both directions',async()=>{
 const user=await newUser();const {browser,page}=await session({user,engine:'chromium'});
 try{
  let aiCalls=0;const pairs=[];
  await page.route('**/api/study-events/tutor',route=>{if(route.request().method()==='POST')aiCalls++;return route.fulfill({json:{available:true}});});
  await page.route('https://api.mymemory.translated.net/get?**',route=>{const url=new URL(route.request().url());const pair=url.searchParams.get('langpair');pairs.push(pair);check(url.searchParams.get('q')===(pair==='ru|en'?'Главная мысль:':'Key idea:'),'exact selected label sent');return route.fulfill({headers:{'access-control-allow-origin':'*'},json:{responseStatus:200,responseData:{translatedText:pair==='ru|en'?'Main idea:':'Ключевая идея:'}}});});
  await openSection(page,'/events/computer-networks-endterm');
  await page.getByRole('button',{name:'Начать с первой части',exact:true}).click();
  for(const lang of ['RU','EN']){
   await page.getByRole('group',{name:'Язык конспекта',exact:true}).getByRole('button',{name:lang,exact:true}).click();
   await page.getByRole('button',{name:'Полный конспект',exact:true}).click();
   const label=page.getByTestId('lecture-notes').locator('p strong').first();await label.scrollIntoViewIfNeeded();await page.waitForTimeout(300);
   await label.evaluate(el=>{const range=document.createRange();range.selectNodeContents(el);const s=getSelection();s.removeAllRanges();s.addRange(range);});
   const menu=page.getByRole('dialog',{name:'Действия с выделенным текстом'});await menu.waitFor();
   await menu.getByRole('button',{name:'Перевести выделенное',exact:true}).click();
   await menu.getByText(lang==='RU'?'Main idea:':'Ключевая идея:',{exact:true}).waitFor();
   check(await menu.getByText(lang==='RU'?'Перевод на английский':'Перевод на русский',{exact:true}).isVisible(),'result direction labelled');
   await page.keyboard.press('Escape');
  }
  check(pairs.join(',')==='ru|en,en|ru','direction follows current notes language');
  check(aiCalls===0,'neither direction uses Gemini');
 }finally{await browser.close();}
});

test('Selection menu: quiz questions and option selection do not submit answers',async()=>{
 const user=await newUser();const {browser,page}=await session({user,engine:'chromium'});
 try{
  await page.setViewportSize({width:1280,height:900});
  await page.route('https://api.mymemory.translated.net/get?**',route=>route.fulfill({headers:{'access-control-allow-origin':'*'},json:{responseStatus:200,responseData:{translatedText:'Тестовый перевод фрагмента'}}}));
  await openSection(page,'/events/computer-networks-endterm');
  await page.getByRole('button',{name:'Начать с первой части',exact:true}).click();
  await page.getByRole('button',{name:/Начать квиз по этой части/}).click();
  const question=page.locator('h2[data-selection-question]').first();await question.waitFor();
  await question.evaluate(el=>{const r=document.createRange();r.selectNodeContents(el);const s=getSelection();s.removeAllRanges();s.addRange(r);});
  const menu=page.getByRole('dialog',{name:'Действия с выделенным текстом'});await menu.waitFor();
  await menu.getByRole('button',{name:'Перевести выделенное',exact:true}).click();
  await menu.getByText('Тестовый перевод фрагмента',{exact:true}).waitFor();
  check(await menu.getByText('Перевод на русский',{exact:true}).isVisible(),'English question translates in place');
  await page.keyboard.press('Escape');await page.evaluate(()=>getSelection()?.removeAllRanges());
  const option=page.locator('button[data-selection-question]').first();await option.scrollIntoViewIfNeeded();
  const rect=await option.evaluate(el=>{const node=Array.from(el.childNodes).find(n=>n.nodeType===Node.TEXT_NODE&&n.textContent.trim().length>2);const r=document.createRange();r.setStart(node,0);r.setEnd(node,Math.min(8,node.textContent.length));const b=r.getBoundingClientRect();return {x:b.x,y:b.y,width:b.width,height:b.height};});
  await page.mouse.move(rect.x+1,rect.y+rect.height/2);await page.mouse.down();await page.mouse.move(rect.x+rect.width-1,rect.y+rect.height/2,{steps:12});await page.mouse.up();
  await menu.waitFor();
  check(await option.isEnabled(),'dragging option text does not answer');
  check(await page.locator('button[data-answer-state]').count()===0,'no answer feedback from selection');
  await menu.getByRole('button',{name:'Перевести выделенное',exact:true}).click();
  await menu.getByText('Тестовый перевод фрагмента',{exact:true}).waitFor();
  await page.keyboard.press('Escape');await page.evaluate(()=>getSelection()?.removeAllRanges());
  await option.click();
  check(await option.isDisabled(),'normal answer click still works');
  check(await option.getAttribute('aria-pressed')==='true','chosen answer remains selected');
  await page.waitForTimeout(650);
  const other=page.locator('button[data-selection-question]').nth(1);
  await other.scrollIntoViewIfNeeded();
  const answeredRect=await other.evaluate(el=>{const node=Array.from(el.childNodes).find(n=>n.nodeType===Node.TEXT_NODE&&n.textContent.trim().length>2);const r=document.createRange();r.setStart(node,0);r.setEnd(node,Math.min(8,node.textContent.length));const b=r.getBoundingClientRect();return {x:b.x,y:b.y,width:b.width,height:b.height};});
  await page.mouse.move(answeredRect.x+1,answeredRect.y+answeredRect.height/2);await page.mouse.down();await page.mouse.move(answeredRect.x+answeredRect.width-1,answeredRect.y+answeredRect.height/2,{steps:12});await page.mouse.up();
  await menu.waitFor();
  await menu.getByRole('button',{name:'Перевести выделенное',exact:true}).click();
  await menu.getByText('Тестовый перевод фрагмента',{exact:true}).waitFor();
  check(await other.evaluate(el=>!el.disabled),'answered option retains native text selection');
  await page.keyboard.press('Escape');await page.evaluate(()=>getSelection()?.removeAllRanges());
  await other.dispatchEvent('click');
  check(await option.getAttribute('aria-pressed')==='true' && await other.getAttribute('aria-pressed')==='false','clicking another answered option cannot change the answer');

 }finally{await browser.close();}
});
