import {test,newUser,session,openSection,check} from '../harness.mjs';
test('Network story: comedy clip loads only when opened and stops when closed',async()=>{
 const user=await newUser();const {browser,page}=await session({user,engine:'chromium'});
 try{
  page.setDefaultTimeout(20000);
  await openSection(page,'/events/computer-networks-endterm');
  await page.getByRole('button',{name:'Начать с первой части',exact:true}).click();
  const toggle=page.locator('summary').filter({hasText:'История: пакет не пролезает'});
  check(await page.locator('video').count()===0,'closed card does not load video');
  await toggle.click();const video=page.getByLabel('История: пакет не пролезает',{exact:true});
  await page.waitForFunction(()=>document.querySelector('video')?.readyState>=1);
  check(await video.evaluate(v=>v.duration>120),'new comedy cut loaded');
  await video.evaluate(v=>v.play());await page.waitForFunction(()=>document.querySelector('video').currentTime>.4);
  check(await video.evaluate(v=>v.videoWidth===1280),'video frames decode');
  await page.setViewportSize({width:390,height:844});
  check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'mobile layout fits');
  await video.evaluate(v=>{v.pause();v.currentTime=20});await page.waitForTimeout(400);
  await page.screenshot({path:'e2e/.out/network-story-mobile.png'});
  await toggle.click();await video.waitFor({state:'detached'});check(await page.locator('video').count()===0,'closing card unmounts audio/video');
 }finally{await browser.close()}
});
