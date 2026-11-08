import {test,newUser,session,openSection,check} from '../harness.mjs';
test('Network story: comedy clip loads only when opened and stops when closed',async()=>{
 const user=await newUser();const {browser,page}=await session({user,engine:'chromium'});
 try{
  page.setDefaultTimeout(20000);
  await openSection(page,'/events/computer-networks-endterm');
  await page.getByRole('button',{name:'Начать с первой части',exact:true}).click();
  const toggle=page.locator('summary').filter({hasText:'История: IP: путешествие пакета'});
  check(await page.locator('video').count()===0,'closed card does not load video');
  await toggle.click();const video=page.getByLabel('История: IP: путешествие пакета',{exact:true});
  await page.waitForFunction(()=>document.querySelector('video')?.readyState>=1);
  check(await video.evaluate(v=>v.duration>300),'full story loaded');
  await video.evaluate(v=>v.play());await page.waitForFunction(()=>document.querySelector('video').currentTime>.4);
  check(await video.evaluate(v=>v.videoWidth===1280),'video frames decode');
  await page.getByText('Главы · 7', {exact:true}).click();
  await page.getByRole('button', {name:/MTU — размер/}).click();
  check(await video.evaluate(v=>v.currentTime>140),'chapter navigation seeks into the story');
  await page.setViewportSize({width:390,height:844});
  check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'mobile layout fits');
  await video.evaluate(v=>{v.pause();v.currentTime=20});await page.waitForTimeout(400);
  await page.screenshot({path:'e2e/.out/network-story-mobile.png'});
  await toggle.click();await video.waitFor({state:'detached'});check(await page.locator('video').count()===0,'closing card unmounts audio/video');
 }finally{await browser.close()}
});

test('Network season: every part opens its own full video and returns to notes',async()=>{
 const user=await newUser();const {browser,page}=await session({user,engine:'chromium'});
 try{
  page.setDefaultTimeout(20000);
  await openSection(page,'/events/computer-networks-endterm');
  await page.getByRole('button',{name:'Начать с первой части',exact:true}).click();
  for(let module=8;module<=16;module++){
   await page.getByRole('button',{name:'▶ Смотреть как видео',exact:true}).click();
   const video=page.locator('video');await video.waitFor();
   await page.waitForFunction(()=>document.querySelector('video')?.readyState>=1);
   check(await video.evaluate((v,m)=>v.currentSrc.endsWith(`/m${m}.mp4`)&&v.duration>150,module),`module ${module} has the correct full episode`);
   await video.evaluate(v=>{v.currentTime=v.duration*.8;return v.play()});
   await page.waitForFunction(()=>{const v=document.querySelector('video');return v&&v.videoWidth===1280&&!v.seeking&&v.readyState>=2});
   check(await video.evaluate(v=>!v.error),`module ${module} decodes after seeking`);
   await page.getByRole('button',{name:'← К конспекту',exact:true}).click();
   await video.waitFor({state:'detached'});
   if(module<16)await page.getByRole('button',{name:/Следующая часть →/}).click();
  }
 }finally{await browser.close()}
});
