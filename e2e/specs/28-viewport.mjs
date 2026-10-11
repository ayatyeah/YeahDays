import { test,check,newUser,session } from '../harness.mjs';
test('PWA: нижний бар следует видимому окну при запуске и изменении высоты',async()=>{
 const user=await newUser();
 const {browser,page}=await session({user,serviceWorkers:'block',initScript:()=>{
  localStorage.setItem('yd-install-dismissed','1');
  Object.defineProperty(navigator,'standalone',{get:()=>true,configurable:true});
  window.__testVisibleHeight=800;
  Object.defineProperty(window.visualViewport,'height',{get:()=>window.__testVisibleHeight,configurable:true});
 }});
 try{
  await page.goto('/today',{waitUntil:'networkidle'});
  const bar=page.locator('.yg-bottom-nav'); await bar.waitFor();
  check(Math.abs((await bar.boundingBox()).y+(await bar.boundingBox()).height-800)<2,'бар сразу стоит у измеренного нижнего края');
  check(await page.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--app-h').trim())==='800px','оболочка использует ту же высоту');
  await page.evaluate(()=>{window.__testVisibleHeight=820;visualViewport.dispatchEvent(new Event('resize'));});
  await page.waitForFunction(()=>document.documentElement.style.getPropertyValue('--app-h')==='820px');
  const r=await bar.boundingBox();check(Math.abs(r.y+r.height-820)<2,'изменение высоты не оставляет зазора');
  await page.evaluate(()=>{const input=document.createElement('input');document.body.append(input);input.focus();window.__testVisibleHeight=400;visualViewport.dispatchEvent(new Event('resize'));});
  await page.waitForTimeout(100);
  check(await page.evaluate(()=>document.documentElement.style.getPropertyValue('--app-h'))==='820px','клавиатура не сжимает оболочку приложения');
  await page.evaluate(()=>{window.__testVisibleHeight=810;document.activeElement.blur();visualViewport.dispatchEvent(new Event('resize'));});
  await page.waitForFunction(()=>document.documentElement.style.getPropertyValue('--app-h')==='810px');
  check(true,'после закрытия клавиатуры высота обновляется');
 }finally{await browser.close();}
});
