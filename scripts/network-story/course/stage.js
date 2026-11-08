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
 text('DATA',0,-b*.12,Math.max(14,size*.13),'#082e3b');text(label,0,b*.23,Math.max(19,size*.16),'#fff');ctx.restore();}
function plaque(label,x,y,w=210,color='#70fff0'){const rows=wrap(label,w-20,20);ctx.save();ctx.shadowColor=color;ctx.shadowBlur=12;rounded(x-w/2,y-23,w,Math.max(48,rows.length*25+16),12);ctx.fillStyle='#06192fee';ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle=color;ctx.lineWidth=1.5;ctx.stroke();rows.forEach((r,k)=>text(r,x,y+7+k*25,20,color));ctx.restore()}
function arrow(x,y,x2,y2,color='#7affec'){ctx.strokeStyle=color;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x2,y2);ctx.stroke();const a=Math.atan2(y2-y,x2-x);ctx.beginPath();ctx.moveTo(x2,y2);ctx.lineTo(x2-15*Math.cos(a-.5),y2-15*Math.sin(a-.5));ctx.lineTo(x2-15*Math.cos(a+.5),y2-15*Math.sin(a+.5));ctx.closePath();ctx.fillStyle=color;ctx.fill()}
function lChapter(s){return STORY.scenes.indexOf(s)}
function props(s,elapsed,progress,t){const items=s.items,phase=Math.min(items.length-1,Math.floor(progress*items.length));const tick=(elapsed%5)/5;
// The characters operate tangible packages, passports, consoles and neighborhood models.
if(s.kind==='routes'&&[8,11].includes(STORY.module)){
items.forEach((item,k)=>{const x=350+k*290;plaque(item.split('|').join(' · '),x,220,265,k===phase?'#ffe08f':'#70fff0');if(STORY.module===8)arrow(640,445,x,310,k===0?'#ffe08f':'#7795ac');else box(x,380,170-k*38,['/25','/26','/27'][k]);});plaque(STORY.module===8?'Для 192.168.2.20 выбираем /24':'VLSM · непересекающиеся блоки',640,130,620);if(STORY.module===8)box(lerp(640,350,tick),lerp(445,310,tick),55,'→');
}else if(['network','routes'].includes(s.kind)){

const n=items.length;for(let k=0;k<n;k++){const x=340+k*600/Math.max(1,n-1),y=260+(k%2)*70;box(x,y,65,String(k+1));plaque(items[k].split('|').join(' · '),x,y+65,Math.min(210,650/n));if(k<n-1)arrow(x+36,y,340+(k+1)*600/(n-1)-36,260+((k+1)%2)*70)}
const hop=Math.floor(elapsed/5)%Math.max(1,n-1);box(lerp(340+hop*600/(n-1),340+(hop+1)*600/(n-1),tick),410,65,'→');
 }else if(s.kind==='exchange'){
const item=items[phase].split('|'),reverse=/Сервер → Клиент|Узел → Источник|Владелец → ПК/.test(item[0]);plaque(item[0],640,170,600);const q=(elapsed%4)/4;arrow(reverse?900:360,320,reverse?360:900,320);box(lerp(reverse?900:360,reverse?360:900,q),320,100,item[1]||item[0]);plaque(item[1]||item[0],640,445,600);
}else if(s.kind==='stack'){
for(let k=0;k<items.length;k++){const active=k<=phase;ctx.globalAlpha=active?1:.3;box(640,425-k*55,230-k*24,items[k].split('|')[1]||items[k].split('|')[0]);}ctx.globalAlpha=1;plaque(items[phase].split('|').join(' · '),640,130,600);
}else if(s.kind==='terminal'){
rounded(320,150,650,325,20);ctx.fillStyle='#020e18f5';ctx.fill();text('ПЕТРОВИЧ / КОНСОЛЬ',345,184,15,'#68ecd2','left');const rows=items.flatMap(x=>x.split('|'));const shown=Math.max(1,Math.ceil(progress*rows.length));rows.slice(Math.max(0,shown-7),shown).forEach((r,k)=>text(r.slice(0,65),345,225+k*32,19,'#a5ffbd','left'));text('▌',345,455,20,Math.sin(t*5)>0?'#8bffb8':'#020e18','left');
}else if(s.kind==='subnet'&&STORY.module===14){
box(470,300,150,'1…4500');arrow(570,300,870,300);box(870,300,120,'ACK');plaque('ACK = 4501 · следующий ожидаемый байт',640,430,630);
}else if(s.kind==='subnet'||s.kind==='ipv6'){
const subnetExample=STORY.module===11&&lChapter(s)===2;const count=s.kind==='ipv6'?8:subnetExample?16:32;for(let k=0;k<count;k++){const cols=count===32?16:8;const x=(count===32?360:420)+(k%cols)*(count===32?37:63),y=260+Math.floor(k/cols)*85;box(x,y,count===32?27:46,s.kind==='ipv6'?'16':subnetExample?String(64+k):'',subnetExample&&(k===0||k===15));}plaque(items[phase].split('|').join(' · '),640,145,650);plaque(s.kind==='ipv6'?'128 бит · 8 групп по 16':subnetExample?'64 — сеть · 65…78 — хосты · 79 — broadcast':'32 бита IPv4 · маска отделяет сеть от хостов',640,440,660);
}else if(s.kind==='packet'){
box(lerp(410,790,tick<.65?tick/.65:1-(tick-.65)/.35),330,155,'пакет',tick>.65);ctx.fillStyle='#ffaf7c';ctx.fillRect(885,200,15,270);plaque(items[phase].split('|').join(' · '),635,150,600);
}else if(s.kind==='compare'&&[8,14].includes(STORY.module)&&lChapter(s)<4){
const headers=STORY.module===8?['IPv4','IPv6']:['TCP','UDP'];const cells=items[phase].split('|');for(let k=0;k<2;k++){const x=470+k*335;box(x,270,180,headers[k]);plaque(cells[k+1]||'',x,390,290);}plaque(cells[0],640,135,600);
}else if(s.kind==='shield'){
ctx.strokeStyle='#74ffdf';ctx.lineWidth=8;ctx.beginPath();ctx.arc(720,340,120,-1.5,1.5);ctx.stroke();for(let k=0;k<4;k++)box(350+((elapsed*70+k*130)%330),260+k*45,35,'!',true);plaque(items[phase].split('|').join(' · '),640,145,610);
}else{
// Physical information cards cycle with the explanation, leaving room for the actors.
const from=Math.max(0,phase-1),shown=items.slice(from,from+3);shown.forEach((item,k)=>{const x=410+k*235,y=265+(k===1?-25:15);ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(t*.7+k)*.025);rounded(-105,-80,210,195,16);ctx.fillStyle=k+from===phase?'#12465af2':'#101c36eb';ctx.fill();ctx.strokeStyle=k+from===phase?'#71ffde':'#b5b4ef';ctx.lineWidth=3;ctx.stroke();item.split('|').flatMap(v=>wrap(v,186,19)).slice(0,7).forEach((r,j)=>text(r,0,-40+j*25,19));ctx.restore()});
}
}
window.draw=t=>{let index=STORY.lines.findIndex((l,i)=>t>=l.start&&t<(STORY.lines[i+1]?.start||STORY.duration));if(index<0)index=0;const l=STORY.lines[index],s=STORY.scenes[l.chapter],local=t-l.start,talking=local>=0&&t<l.end,p=clamp(local/(l.end-l.start));
ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#06101f';ctx.fillRect(0,0,W,H);ctx.save();const zoom=l.who==='guard'?1+Math.sin(local*.08)*.018:1.07;ctx.translate(640,360);ctx.scale(zoom,zoom);ctx.translate(-640,-360);ctx.drawImage(images.bg,0,0,W,H);ctx.fillStyle='#07152e35';ctx.fillRect(0,0,W,H);
const enter=ease(Math.max(0,local)/1.2);const boy=l.who==='ayat'?lerp(105,175,enter):175+Math.sin(local*.45)*14;const arpi=l.who==='arpi'?lerp(1380,990,enter):1040;
for(const x of[boy,1090]){ctx.fillStyle='#02102070';ctx.beginPath();ctx.ellipse(x,620,70,15,0,0,Math.PI*2);ctx.fill()}
actor('ayat',boy,625,460,t,index,talking&&l.who==='ayat');guest('guard',1110-Math.sin(local*.35)*15,630,330,t,talking&&l.who==='guard');
if(l.who==='arpi'||l.chapter%3===1)guest('arpi',arpi,555,185,t,talking&&l.who==='arpi',true);
if(l.chapter%2===0)actor('sara',280,620,365,t,index,false,true);
if(l.who==='guard')props(s,local,p,t);else {box(550+Math.sin(local)*35,370,155,'?!',true,1,Math.sin(local*2)*.08);plaque(s.title,650,175,610);if(local>1.5) {text('?',800,345+Math.sin(t*3)*12,85,'#ffe2a3')}}
ctx.restore();const g=ctx.createLinearGradient(0,510,0,720);g.addColorStop(0,'#02061700');g.addColorStop(1,'#020617f5');ctx.fillStyle=g;ctx.fillRect(0,510,W,210);ctx.fillStyle='#060b15';ctx.fillRect(0,0,W,35);text(`YeahGrind · Доставить до эндки · Модуль ${STORY.module}`,25,24,15,'#b5cad9','left');text(`${l.chapter+1}/${STORY.scenes.length} · ${s.title}`,1250,24,15,'#b5cad9','right');
if(talking){const a=l.alignment,n=a.character_start_times_seconds.findLastIndex(x=>x<=local);let from=0,to=a.characters.length-1;for(let j=0;j<a.characters.length;j++){if(j-from>68&&/\s/.test(a.characters[j])){if(n<=j){to=j;break}from=j+1;}}const caption=a.characters.slice(from,to+1).join('').trim();text(l.who==='ayat'?'Аян':l.who==='arpi'?'Арпи':'Порт Петрович',640,585,18,l.who==='guard'?'#ffb4c7':'#81ffed');wrap(caption,1120,28).slice(0,2).forEach((r,i)=>text(r,640,625+i*34,28));}else if(l.laugh){text('♫ Смех в депо',640,630,16,'#a9bed4')}
ctx.fillStyle='#63eed3';ctx.fillRect(0,713,W*t/STORY.duration,4);
};window.ready=true;window.draw(0);
