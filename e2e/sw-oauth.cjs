// Regression: navigation preload must not redeem an OAuth code twice.
// Run from repo root: node e2e/sw-oauth.cjs
const assert=require('node:assert/strict');
const http=require('node:http');
const fs=require('node:fs');
const {chromium}=require(process.cwd()+'/node_modules/playwright');
(async()=>{
let hits=0;const preloads=[];
const server=http.createServer((req,res)=>{
res.setHeader('Cache-Control','no-store');
if(req.url.startsWith('/sw.js')){res.setHeader('Content-Type','application/javascript');return res.end(fs.readFileSync('public/sw.js'));}
if(req.url.startsWith('/api/auth/callback/')){hits++;preloads.push(!!req.headers['service-worker-navigation-preload']);res.writeHead(302,{Location:'/done'});return res.end();}
res.setHeader('Content-Type','text/html');res.end('<html><body>Test</body></html>');
});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({headless:true});
try{const page=await browser.newPage();await page.goto(base);
await page.evaluate(async()=>{await navigator.serviceWorker.register('/sw.js');await navigator.serviceWorker.ready;});
await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
await page.goto(base+'/api/auth/callback/microsoft-entra-id?code=fake-one-use-code');
await page.waitForTimeout(500);
assert.equal(hits,1,"OAuth callback must reach the server exactly once");
assert.deepEqual(preloads,[true]);
console.log("PASS: OAuth callback uses one preload request, with no replay");
}finally{await browser.close();server.close();}
})().catch(e=>{console.error(e.message);process.exitCode=1});
