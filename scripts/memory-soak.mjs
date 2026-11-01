// One hour, four parallel 12 MP photos every five minutes. Synthetic accounts only.
import {spawn,execFileSync} from 'node:child_process';import {readFileSync,writeFileSync,mkdtempSync,openSync} from 'node:fs';import {setTimeout as sleep} from 'node:timers/promises';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import {createRequire} from 'node:module';const sharp=createRequire(import.meta.url)('sharp');
import {request} from 'playwright';
import { resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
const cwd = resolve(process.env.SOAK_BUILD_DIR || '.');
const url = process.env.DATABASE_URL;
if (!url) throw Error('Set DATABASE_URL to a dedicated local test database');
const parsed = new URL(url);
if (!['localhost', '127.0.0.1', '[::1]'].includes(parsed.hostname) || !/test/.test(parsed.pathname) || (parsed.searchParams.has('host') && parsed.searchParams.get('host') !== '/var/run/postgresql')) throw Error('Only a local test database is permitted');
const output = mkdtempSync(resolve(tmpdir(), 'yg-soak-'));
const port = 3131, base = `http://localhost:${port}`;
try { await fetch(base + '/api/auth/csrf'); throw Error('Port 3131 is already occupied'); } catch (error) { if (error.message === 'Port 3131 is already occupied') throw error; }
console.log('Artifacts:', output);
const sourceCommit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd, encoding: 'utf8' }).trim();
const db=new PrismaClient({datasourceUrl:url});const prefix='soak-'+Date.now();const users=[];const clients=[];const log=resolve(output, 'memory.jsonl');writeFileSync(log,'');
const policy=/POLICY_VERSION = "([^"]+)"/.exec(readFileSync(cwd+'/src/lib/personalization.ts','utf8'))[1];
const child=spawn(process.execPath,['--optimize-for-size','--max-old-space-size=256','--max-semi-space-size=2','--require',fileURLToPath(new URL('./memory-monitor.cjs', import.meta.url)),'node_modules/next/dist/bin/next','start','-p','3131'],{cwd,env:{...process.env,DATABASE_URL:url,AUTH_SECRET:'local-soak-only',AUTH_URL:base,AUTH_TRUST_HOST:'true',PUSH_SCHEDULER:'off',RESEARCH_RETENTION_ENABLED:'false',YG_MEMORY_LOG:log,MALLOC_ARENA_MAX:'2'},stdio:['ignore',openSync(resolve(output, 'server.log'),'w'),'ignore']});
let failures=0,requests=0,photos=0;const timings=[];let started;
try {
 for(let i=0;i<120;i++){try{if((await fetch(base+'/api/auth/csrf')).ok)break;}catch{}await sleep(500);}
 for(let i=0;i<4;i++){
  const id=prefix+'-'+i;users.push(id);await db.user.create({data:{id,email:id+'@test.local',name:'Load test',passwordHash:await bcrypt.hash('local-soak-pass',10),personalization:{create:{data:{version:policy,acceptedAt:new Date().toISOString(),enabled:false,ai:false}}},state:{create:{data:{todos:Array.from({length:500},(_,n)=>({id:String(n),title:'Synthetic task '+n,done:false})),updatedAt:1},clientAt:new Date()}}}});
  const client=await request.newContext({baseURL:base});clients.push(client);const csrf=await(await client.get('/api/auth/csrf')).json();await client.post('/api/auth/callback/credentials',{form:{csrfToken:csrf.csrfToken,identifier:id+'@test.local',password:'local-soak-pass',callbackUrl:base+'/today',json:'true'},headers:{'X-Auth-Return-Redirect':'1'}});
  const session=await(await client.get('/api/auth/session')).json();if(session.user?.id!==id)throw Error('Local benchmark login failed');
 }
 const photo=await sharp({create:{width:4000,height:3000,channels:3,background:'#47956a'}}).jpeg({quality:90}).toBuffer();
 started=Date.now();writeFileSync(resolve(output, 'started.txt'),new Date(started).toISOString());let nextPhoto=0,nextLog=0;
 while(Date.now()-started<3600000){
  const elapsed=Date.now()-started;
  await Promise.all(clients.map(async (c,i)=>{for(const path of ['/api/state','/today']){const t=performance.now();const r=await c.get(path);await r.body();timings.push(performance.now()-t);requests++;if(!r.ok())failures++;}}));
  if(elapsed>=nextPhoto){await Promise.all(clients.map(async c=>{const r=await c.post('/api/media?kind=avatar',{data:photo,headers:{'Content-Type':'image/jpeg'}});requests++;photos++;if(!r.ok()){failures++;console.log('Photo failure status',r.status());}else{const body=await r.json();await db.socialMedia.delete({where:{id:body.id}});}}));nextPhoto=elapsed+300000;}
  if(elapsed>=nextLog){console.log(JSON.stringify({minute:Math.floor(elapsed/60000),requests,photos,failures}));nextLog=elapsed+60000;}
  await sleep(5000);
 }
 const samples=readFileSync(log,'utf8').trim().split('\n').map(JSON.parse).filter(s=>s.time>=started);const avg=a=>a.reduce((n,s)=>n+s.rss,0)/a.length/1048576;
 timings.sort((a,b)=>a-b);const report={sourceCommit,durationSeconds:(Date.now()-started)/1000,requests,photos,failures,peakRssMiB:Math.max(...samples.map(s=>s.rss))/1048576,firstSteadyRssMiB:avg(samples.filter(s=>s.time>=started+60000&&s.time<started+300000)),lastFiveMinutesRssMiB:avg(samples.filter(s=>s.time>=started+3300000)),p95Ms:timings[Math.floor(timings.length*.95)]};writeFileSync(resolve(output, 'result.json'),JSON.stringify(report,null,2));console.log('FINISHED',JSON.stringify(report));
}finally{for(const c of clients)await c.dispose();await db.user.deleteMany({where:{id:{in:users}}});await db.$disconnect();child.kill('SIGTERM');}
