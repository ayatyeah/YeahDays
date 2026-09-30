// Isolated local PostgreSQL only; never point this test at production.
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const { PrismaClient } = require('@prisma/client');
const { chromium, request } = require('playwright');
(async()=>{
  if(!process.env.DATABASE_URL?.includes('yeahgrind_community_qa'))throw new Error('Use isolated yeahgrind_community_qa DB');
  const db=new PrismaClient();const ids=Array.from({length:3},()=> 'community-qa-'+randomUUID());let browser;const contexts=[];
  const base=process.env.E2E_BASE||'http://localhost:3122';
  try {
    for(let i=0;i<ids.length;i++)await db.user.create({data:{id:ids[i],name:['Аят QA','Одногруппник QA','Посторонний QA'][i]}});
    const {encode}=await import('@auth/core/jwt');
    for(const id of ids){const token=await encode({secret:'community-qa-secret',salt:'authjs.session-token',token:{id,sub:id,name:'QA'}});contexts.push(await request.newContext({baseURL:base,extraHTTPHeaders:{Cookie:'authjs.session-token='+token}}));}
    const [a,b,c]=contexts;const send=async(ctx,data,status=200)=>{const r=await ctx.post('/api/community',{data});const d=await r.json();assert.equal(r.status(),status,JSON.stringify(d));return d;};
    const get=async(ctx,q='',status=200)=>{const r=await ctx.get('/api/community'+q);const d=await r.json();assert.equal(r.status(),status,JSON.stringify(d));return d;};
    const anon=await request.newContext({baseURL:base});assert.equal((await anon.get('/api/community')).status(),401);await anon.dispose();
    assert.equal((await get(a)).profile,null);
    const friendInvite=await (await a.get('/api/social/invite')).json();assert.ok(friendInvite.code);
    assert.equal((await b.post('/api/social',{data:{invite:friendInvite.code}})).status(),200);
    assert.equal(await db.friendship.count({where:{userId:ids[0],friendId:ids[1]}}),1);
    const friendRotated=await (await a.post('/api/social/invite')).json();assert.notEqual(friendInvite.code,friendRotated.code);
    assert.equal((await c.post('/api/social',{data:{invite:friendInvite.code}})).status(),404);
    const {teamId}=await send(a,{action:'create',name:'Networks QA',subject:'Computer Networks'});
    let t=await get(a,'?team='+teamId);const oldInvite=t.invite;
    await get(c,'?team='+teamId,403);await send(c,{action:'post',teamId,kind:'question',text:'Intruder'},403);
    await send(b,{action:'join',invite:oldInvite});assert.equal((await get(b,'?team='+teamId)).invite,null);
    await send(b,{action:'rotate',teamId},403);await send(a,{action:'rotate',teamId});await send(c,{action:'join',invite:oldInvite},404);
    await send(a,{action:'profile',published:true,bio:'Учусь',subjects:['Networks'],goals:['Понять TCP'],showCharacter:true,showAchievements:true});
    const p=await get(b,'?profile='+ids[0]);assert.equal(p.bio,'Учусь');assert.equal(p.blocked,undefined);assert.equal(p.email,undefined);
    await send(b,{action:'post',teamId,kind:'question',text:'Чем TCP отличается от UDP?'});t=await get(a,'?team='+teamId);const post=t.posts[0];
    await send(a,{action:'post',teamId,parentId:post.id,text:'TCP подтверждает доставку.'});
    await send(c,{action:'deletePost',teamId,postId:post.id},403);
    await send(a,{action:'report',teamId,postId:post.id,reason:'QA moderation'});t=await get(a,'?team='+teamId);assert.equal(t.reports.length,1);assert.equal(t.reports[0].userId,undefined);assert.equal((await get(b,'?team='+teamId)).reports.length,0);
    await send(a,{action:'resolve',teamId,reportId:t.reports[0].id});
    await send(a,{action:'quest',teamId,title:'Разобраться в TCP/IP',target:1,days:7});t=await get(a,'?team='+teamId);const questId=t.quests[0].id;
    await send(b,{action:'quest',teamId,title:'No',target:1,days:7},403);
    await send(a,{action:'room',teamId,title:'Фокус QA',minutes:15,questId});t=await get(a,'?team='+teamId);const roomId=t.rooms[0].id;
    await send(a,{action:'enter',teamId,roomId});await send(a,{action:'finish',teamId,roomId,summary:'Too early'},400);
    await db.studyAttendance.update({where:{roomId_userId:{roomId,userId:ids[0]}},data:{lastSeenAt:new Date(Date.now()-15000)}});
    await Promise.all([send(a,{action:'pulse',teamId,roomId}),send(a,{action:'pulse',teamId,roomId})]);
    let attendance=await db.studyAttendance.findUnique({where:{roomId_userId:{roomId,userId:ids[0]}}});assert.ok(attendance.seconds>=15&&attendance.seconds<25);
    await send(b,{action:'post',teamId,roomId,text:'Готов заниматься'});
    // Advance only synthetic fixtures to test reward idempotency without waiting 15 minutes.
    await db.studyRoom.update({where:{id:roomId},data:{startsAt:new Date(Date.now()-901000),endsAt:new Date(Date.now()-1000)}});
    await db.studyAttendance.update({where:{roomId_userId:{roomId,userId:ids[0]}},data:{seconds:850,lastSeenAt:new Date(Date.now()-5000)}});
    await Promise.all([send(a,{action:'finish',teamId,roomId,summary:'Понял подтверждение пакетов'}),send(a,{action:'finish',teamId,roomId,summary:'Понял подтверждение пакетов'})]);
    t=await get(a,'?team='+teamId);assert.equal(t.quests[0].progress,1);assert.equal(t.quests[0].earned,true);
    await send(a,{action:'block',userId:ids[1]});assert.equal((await get(a,'?team='+teamId)).posts.length,0);await get(b,'?profile='+ids[0],404);assert.equal((await b.post('/api/social',{data:{invite:friendRotated.code}})).status(),403);await send(a,{action:'unblock',userId:ids[1]});
    // Chat history remains private, and clearing it invalidates pending work.
    await db.aiChat.create({data:{userId:ids[0],messages:[{id:'private',role:'user',text:'Private message',at:new Date().toISOString()}],pendingId:'pending',pendingAt:new Date()}});
    assert.equal((await (await b.get('/api/ai/chat')).json()).messages.length,0);
    const beforeClear=(await (await a.get('/api/ai/chat')).json()).revision;
    assert.equal((await a.delete('/api/ai/chat')).status(),200);
    const afterClear=await db.aiChat.findUnique({where:{userId:ids[0]}});assert.equal(afterClear.pendingId,null);assert.ok(afterClear.revision>beforeClear);
    if(process.env.QA_LIVE_AI==='1') {
      const payload={message:'Ответь одним словом: сколько будет два плюс два?',withPlan:false,requestId:randomUUID()};
      const response=await a.post('/api/ai/chat',{data:payload,timeout:90000});assert.equal(response.status(),200,await response.text());
      const result=await response.json();assert.equal(result.messages.length,2);assert.ok(result.messages[1].text.length>0);
      const repeated=await (await a.post('/api/ai/chat',{data:payload})).json();assert.equal(repeated.messages.length,2);
      await a.delete('/api/ai/chat');console.log('PASS live OpenAI response and request deduplication.');
    }
    const exportRes=await a.get('/api/account');assert.equal(exportRes.status(),200);const exp=await exportRes.json();assert.ok(exp.community.profile);assert.equal(exp.community.posts.some(p=>p.userId===ids[1]),false);
    browser=await chromium.launch();const page=await browser.newPage({viewport:{width:390,height:844},serviceWorkers:'block'});
    const cookies=(await a.storageState()).cookies; // API header auth is not in cookie storage.
    await page.context().addCookies([{name:'authjs.session-token',value:await encode({secret:'community-qa-secret',salt:'authjs.session-token',token:{id:ids[0],sub:ids[0],name:'QA'}}),url:base}]);
    await page.addInitScript(()=>localStorage.setItem('yeahdays-store',JSON.stringify({state:{onboarded:true,name:'QA',plan:[],todos:[]},version:13})));
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(base+'/community');await page.waitForTimeout(1600);for(let i=0;i<3;i++){const dismiss=page.getByRole('button',{name:'Понятно',exact:true});if(await dismiss.count())await dismiss.first().click();await page.waitForTimeout(500);}await page.getByRole('button',{name:/Networks QA/}).click();await page.getByRole('heading',{name:'Networks QA'}).waitFor();
    await page.getByRole('button',{name:'Квесты',exact:true}).click();await page.getByText('✦ Твой значок: Командный прорыв').waitFor();
    for(const width of [320,390,768]){await page.setViewportSize({width,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);}
    await page.setViewportSize({width:390,height:844});await page.screenshot({path:'/tmp/community-mobile.png',fullPage:true});
    await page.getByRole('button',{name:'Фокус',exact:true}).click();await page.getByRole('heading',{name:'Фокус QA'}).waitFor();
    await page.getByRole('navigation',{name:'Основная навигация'}).getByRole('button',{name:'Сегодня',exact:true}).click();await page.waitForURL('**/today');
    await page.goto(base+'/chat');await page.getByRole('heading',{name:'ИИ-помощник'}).waitFor();await page.getByLabel('Учитывать мой план в этом сообщении').waitFor();assert.equal(await page.getByLabel('Учитывать мой план в этом сообщении').isChecked(),false);
    assert.deepEqual(errors,[]);
    await send(a,{action:'deletePost',teamId,postId:post.id});assert.equal(await db.studyPost.count({where:{parentId:post.id}}),0);
    console.log('PASS: auth, membership, invitation rotation, public projection, posts/replies, moderation, focus clock, concurrent idempotency, badges, blocks, export, 320/390/768 UI, navigation, chat privacy default.');
  }finally{if(browser)await browser.close();for(const c of contexts)await c.dispose();await db.user.deleteMany({where:{id:{in:ids}}});assert.equal(await db.studyTeam.count({where:{ownerId:{in:ids}}}),0);await db.$disconnect();}
})().catch(e=>{console.error(e);process.exitCode=1;});
