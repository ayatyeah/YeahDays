const canvas=document.querySelector('canvas'),ctx=canvas.getContext('2d');const W=1280,H=720;
const images={};await Promise.all(Object.entries(ASSETS).map(([k,v])=>new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>{images[k]=i;resolve()};i.onerror=reject;i.src=v})));
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));const ease=v=>{v=clamp(v);return v*v*(3-2*v)};const lerp=(a,b,v)=>a+(b-a)*v;
function rounded(x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r)}
function text(t,x,y,size=24,color='#fff',align='center'){ctx.font=`600 ${size}px Arial`;ctx.fillStyle=color;ctx.textAlign=align;ctx.fillText(t,x,y)}
function wrap(t,max,size){ctx.font=`500 ${size}px Arial`;const out=[];let row='';for(const word of t.split(' ')){const next=(row?row+' ':'')+word;if(ctx.measureText(next).width>max&&row){out.push(row);row=word}else row=next;}if(row)out.push(row);return out}
function pose(name,index){return name==='ayat'?(index===3?'hurt':index>=8&&index<=10?'happy':'talk'):(index>=8?'happy':'talk')}
function actor(name,x,y,h,t,index,speaking,flip=false){
 const key=name+'_'+pose(name,index),r=RIG.sprites[key],im=images[key];const scale=h/r.h;
 const phase=name==='ayat'?0:1.3;const bob=Math.sin(t*2.4+phase)*1.8;const sway=Math.sin(t*.8+phase)*.012;
 ctx.save();ctx.translate(x,y+bob);ctx.scale(flip?-1:1,1);ctx.rotate(sway+(speaking?Math.sin(t*4)*.008:0));ctx.scale(scale,scale);ctx.translate(-r.foot[0],-r.foot[1]);
 ctx.drawImage(im,0,0,r.w,r.h);
 const line=STORY.lines[index],elapsed=t-line.start;const env=speaking?(line.envelope[Math.floor(elapsed*24)]||0):0;
 if(r.mouth&&env>.1&&images[key+'_m']){ctx.globalAlpha=clamp(env*2);ctx.drawImage(images[key+'_m'],r.mouth.x,r.mouth.y,r.mouth.w,r.mouth.h);ctx.globalAlpha=1;}
 if(r.blink&&((t+phase)%4.7)<.13&&images[key+'_b'])ctx.drawImage(images[key+'_b'],r.blink.x,r.blink.y,r.blink.w,r.blink.h);
 ctx.restore();
}
function guest(name,x,y,h,t,speaking,flip=false){
 const im=images[name],w=h*im.width/im.height;
 const line=STORY.lines.find(l=>t>=l.start&&t<=l.end),env=speaking?(line?.envelope[Math.floor((t-line.start)*24)]||0):0;
 ctx.save();ctx.translate(x,y+(name==='arpi'?Math.sin(t*6)*4:Math.sin(t*2)*1.5));ctx.rotate((name==='arpi'?.03:.008)*Math.sin(t*4));ctx.scale(flip?-1:1,1);ctx.scale(1+env*.012,1-env*.018);ctx.drawImage(im,-w/2,-h,w,h);
 if(name==='guard'&&speaking){ctx.globalCompositeOperation='screen';ctx.globalAlpha=env*.6;ctx.fillStyle='#45ffed';ctx.shadowColor='#45ffed';ctx.shadowBlur=18;for(let k=0;k<4;k++){ctx.beginPath();ctx.ellipse(-w*.07+k*w*.055,-h*.52,4,2+env*4,0,0,Math.PI*2);ctx.fill()}}
 if(name==='arpi'&&speaking){ctx.strokeStyle='#ffe593';ctx.lineWidth=3;ctx.globalAlpha=.3+env*.6;for(let k=0;k<3;k++){ctx.beginPath();ctx.arc(w*.46,-h*.76,14+k*12+env*5,-.7,.7);ctx.stroke()}}
 ctx.restore();
}
function box(x,y,size,label,red=false,alpha=1,angle=0){ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.globalAlpha=alpha;const a=size,b=size*.66,d=size*.18;
 ctx.shadowColor=red?'#ff525d':'#5ffff1';ctx.shadowBlur=25;ctx.fillStyle=red?'#7e2238':'#126576';ctx.beginPath();ctx.moveTo(-a/2,-b/2);ctx.lineTo(a/2,-b/2);ctx.lineTo(a/2+d,-b/2-d);ctx.lineTo(-a/2+d,-b/2-d);ctx.closePath();ctx.fill();ctx.shadowBlur=0;
 const g=ctx.createLinearGradient(-a/2,-b/2,a/2,b/2);g.addColorStop(0,red?'#ed6375':'#50e2de');g.addColorStop(1,red?'#993354':'#207da4');ctx.fillStyle=g;ctx.fillRect(-a/2,-b/2,a,b);ctx.strokeStyle=red?'#ffc0c9':'#bafff6';ctx.lineWidth=2;ctx.strokeRect(-a/2,-b/2,a,b);
 ctx.fillStyle=red?'#86293c':'#114858';ctx.beginPath();ctx.moveTo(a/2,-b/2);ctx.lineTo(a/2+d,-b/2-d);ctx.lineTo(a/2+d,b/2-d);ctx.lineTo(a/2,b/2);ctx.closePath();ctx.fill();
 text('IPv6',0,-b*.12,Math.max(14,size*.13),'#082e3b');text(label,0,b*.23,Math.max(19,size*.16),'#fff');ctx.restore();}
function camera(index,t,boy,mentor){const l=STORY.lines[index],shot=l.shot;let c={x:640,y:360,z:1};if(shot==='ayat')c={x:boy,y:305,z:1.9};if(shot==='sara')c={x:mentor+10,y:310,z:1.9};if(shot==='two')c={x:(boy+mentor)/2,y:355,z:1.35};if(shot==='gate')c={x:870,y:330,z:1.45};if(shot==='guard')c={x:1010,y:425,z:1.5};if(shot==='arpi')c={x:915,y:430,z:1.65};if(shot==='follow')c={x:lerp(520,720,ease((t-l.start)/(l.end-l.start))),y:360,z:1.15};c.z+=Math.sin((t-l.start)*.12)*.025;return c}
window.draw=(t)=>{
 let index=STORY.lines.findIndex((l,i)=>t>=l.start&&t<(STORY.lines[i+1]?.start||STORY.duration));if(index<0)index=t<STORY.lines[0].start?0:STORY.lines.length-1;const l=STORY.lines[index],p=clamp((t-l.start)/(l.end-l.start)),local=t-l.start;
 let boy=index===0?lerp(170,360,ease(p)):index===1?lerp(360,590,ease(p)):index===2?lerp(590,540,ease(p)):550;
 let mentor=index<4?-200:index===4?lerp(100,320,ease(p*2)):320;
 let cam=camera(index,t,boy,mentor);
 if(index>0&&local<.45){const prev=camera(index-1,l.start,boy,mentor),q=ease(local/.45);cam={x:lerp(prev.x,cam.x,q),y:lerp(prev.y,cam.y,q),z:lerp(prev.z,cam.z,q)}}
 cam.x=clamp(cam.x,W/(2*cam.z),W-W/(2*cam.z));cam.y=clamp(cam.y,H/(2*cam.z),H-H/(2*cam.z));
 ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#050a16';ctx.fillRect(0,0,W,H);
 const shake=index===2&&local<.7?Math.sin(local*80)*7*(1-local/.7):0;
 ctx.save();ctx.translate(W/2+shake,H/2);ctx.scale(cam.z,cam.z);ctx.translate(-cam.x,-cam.y);
 ctx.drawImage(images.bg,0,0,W,H);
 // Moving ambient data traffic, behind the foreground characters.
 for(let i=0;i<12;i++){const x=((t*27+i*127)%1280);ctx.fillStyle=`rgba(125,255,240,${.25+.15*Math.sin(t+i)})`;ctx.fillRect(x,274+Math.sin(i)*18,22,3)}
 // Gate label is a physical display, not a presentation title.
 ctx.save();ctx.translate(903,112);ctx.rotate(-.065);rounded(-118,-33,236,57,9);ctx.fillStyle='#081d2e';ctx.fill();text('MTU 1500',0,5,27,index===2?'#ff657e':'#8bfff1');ctx.restore();
 if(index===2||index===3){ctx.save();ctx.globalAlpha=.13+.09*Math.sin(t*10);ctx.fillStyle='#ff2349';ctx.fillRect(800,210,245,230);ctx.restore();}
 // Grounded shadows anchor the actors to the scene.
 for(const [x,h]of[[boy,38],[mentor,30]]){ctx.fillStyle='#05132880';ctx.beginPath();ctx.ellipse(x,648,68,h/3,0,0,Math.PI*2);ctx.fill()}
 const talking=t>=l.start&&t<l.end;
 guest('guard',1080,640,350,t,talking&&l.who==='guard');
 actor('sara',mentor,645,460,t,index,talking&&l.who==='sara');
 actor('ayat',boy,660,500,t,index,talking&&l.who==='ayat',index>=4&&index<=10);
 let bx=boy+133,by=475,bs=192,label='2000 B',red=false,alpha=1;
 if(index===1){bx=lerp(493,885,ease(p));by=475-55*Math.sin(p*Math.PI)}
 if(index===2){bx=lerp(885,680,ease(p*2));by=440+Math.sin(p*Math.PI)*38;red=true}
 if(index>=3&&index<9){bx=705;by=484+Math.sin(t*2)*5;red=index===3}
 if(index===5){ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle='#fff';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(705,387);ctx.lineTo(705,560);ctx.stroke();ctx.restore();}
 if(index>=9){bs=lerp(192,128,ease(index===9?p*2:1));label='1200 B';bx=710}
 if(index===10){bx=lerp(710,1070,ease(p));by=lerp(480,407,ease(p));alpha=1-ease((p-.75)*4)}
 if(index>10)alpha=0;
 box(bx,by,bs,label,red,alpha,index===2?Math.sin(p*12)*.12:Math.sin(t*.7)*.025);
 if(index===7){const x=lerp(915,130,ease(p));const y=360-65*Math.sin(p*Math.PI);ctx.save();ctx.translate(x,y);rounded(-100,-24,200,48,12);ctx.fillStyle='#bf385e';ctx.fill();text('Packet Too Big',0,7,20);ctx.restore();text('← Источнику',220,445,23,'#fff');}
 if(index===10&&p>.6){ctx.save();ctx.globalAlpha=ease((p-.6)*5);text('✓',916,340,90,'#80ffd0');ctx.restore();}
 if(index>=11){ctx.save();ctx.translate(887,368+Math.sin(t*2)*5);rounded(-70,-45,140,90,20);ctx.fillStyle='#171a36dd';ctx.fill();text('MAC?',0,13,38,'#ffd38c');ctx.restore();}
 if(index>=11){const entry=index===11?ease(p*2):1;guest('arpi',lerp(1320,920,entry),lerp(200,655,entry),260,t,talking&&l.who==='arpi',true);}
 // Spark burst at the rejection rather than a generic slide transition.
 if(index===2&&local<1.5){for(let i=0;i<24;i++){const a=i*2.4,dist=local*100;ctx.fillStyle='#ffbf7a';ctx.globalAlpha=1-local/1.5;ctx.fillRect(890+Math.cos(a)*dist,430+Math.sin(a)*dist,5,5)}ctx.globalAlpha=1}
 ctx.restore();
 // Cinematic framing and readable dialogue, independent of camera motion.
 const grad=ctx.createLinearGradient(0,510,0,720);grad.addColorStop(0,'#02061700');grad.addColorStop(1,'#020617e8');ctx.fillStyle=grad;ctx.fillRect(0,510,W,210);
 ctx.fillStyle='#060b15';ctx.fillRect(0,0,W,30);ctx.fillRect(0,695,W,25);
 text('YeahGrind · Доставить до эндки',32,21,13,'#b5cad9','left');text('01 / ПАКЕТ НЕ ПРОЛЕЗАЕТ',1246,21,12,'#a8c8d1','right');
 if(talking){const a=l.alignment,at=local;let n=a.character_start_times_seconds.findLastIndex(x=>x<=at);let from=0,to=a.characters.length-1;for(let j=0;j<a.characters.length;j++){if(j-from>62&&/\s/.test(a.characters[j])){if(n<=j){to=j;break}from=j+1;}}const caption=a.characters.slice(from,to+1).join('').trim().replace(/ай пи версии четыре/gi,'IPv4').replace(/ай пи версии шесть/gi,'IPv6').replace(/эм ти ю/gi,'MTU').replace(/мак-адрес/gi,'MAC-адрес').replace(/ай пи/gi,'IP');const rows=wrap(caption,1050,29);text(l.who==='ayat'?'Аян':l.who==='sara'?'Сара':l.who==='guard'?'Порт Петрович':l.who==='arpi'?'Арпи':'Шлюз',640,600,17,l.who==='sara'?'#ffe0a8':l.who==='ayat'?'#8bffec':'#ffafc2');rows.slice(0,2).forEach((r,i)=>text(r,640,637+i*34,29));}
 if(t<1){ctx.fillStyle=`rgba(3,7,16,${1-t})`;ctx.fillRect(0,0,W,H)}
 if(t>STORY.duration-1){ctx.fillStyle=`rgba(3,7,16,${t-STORY.duration+1})`;ctx.fillRect(0,0,W,H)}
};window.ready=true;window.draw(0);
