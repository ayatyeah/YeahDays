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
