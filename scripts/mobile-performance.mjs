import {chromium,request} from 'playwright';
import {newUser,cleanupUsers,BASE,assertLocalDb} from '../e2e/harness.mjs';
import {writeFileSync} from 'node:fs';
assertLocalDb();
if (!["localhost", "127.0.0.1"].includes(new URL(BASE).hostname)) throw Error("Use a local test server");
const user=await newUser();const login=await request.newContext({baseURL:BASE});const csrf=await(await login.get('/api/auth/csrf')).json();await login.post('/api/auth/callback/credentials',{form:{csrfToken:csrf.csrfToken,identifier:user.email,password:user.password,callbackUrl:BASE+'/today',json:'true'},headers:{'X-Auth-Return-Redirect':'1'}});const state=await login.storageState();const browser=await chromium.launch();const results=[];
try{for(const path of ['/login','/today']){for(let trial=0;trial<3;trial++){
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,deviceScaleFactor:3,serviceWorkers:'block',...(path==='/today'?{storageState:state}:{})});const page=await context.newPage();
 await page.addInitScript(()=>{window.__lcp=0;new PerformanceObserver(list=>{for(const e of list.getEntries())window.__lcp=e.startTime;}).observe({type:'largest-contentful-paint',buffered:true});});
 const cdp=await context.newCDPSession(page);await cdp.send('Network.enable');await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:200000,uploadThroughput:93750,connectionType:'cellular4g'});await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});let bytes=0,count=0;cdp.on('Network.loadingFinished',e=>{bytes+=e.encodedDataLength;count++;});const start=performance.now();
 await page.goto(BASE+path,{waitUntil:'domcontentloaded'});await page.locator(path==='/today'?'[data-section="today"] .flow-next':'input[name="identifier"]').waitFor({timeout:90000});const ready=performance.now()-start;await page.waitForTimeout(15000);const lcp=await page.evaluate(()=>window.__lcp);results.push({path,trial,readyMs:Math.round(ready),lcpMs:Math.round(lcp),bytes,requests:count});console.log(results.at(-1));await context.close();
}}writeFileSync(process.env.PERF_OUTPUT || '/tmp/yg-mobile-result.json',JSON.stringify(results,null,2));}finally{await browser.close();await login.dispose();cleanupUsers();}
