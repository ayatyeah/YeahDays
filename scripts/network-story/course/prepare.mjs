import{readFileSync,writeFileSync,mkdirSync,existsSync}from'node:fs';import{createHash}from'node:crypto';import{homedir}from'node:os';import{execFileSync}from'node:child_process';
const lessons=JSON.parse(readFileSync('scripts/network-story/course/lessons.json')),jokes=JSON.parse(readFileSync('scripts/network-story/course/dialogues.json'));
const supplements=JSON.parse(readFileSync('scripts/network-story/course/supplements.json'));
const hash=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex').slice(0,20);
for(const lesson of lessons){const out=`output/network-season/m${lesson.module}`;mkdirSync(out,{recursive:true});const lines=[];
for(const [i,s]of lesson.scenes.entries()){
const spoken=s.voice.replace(/\bEthernet\b/g,'эзернет').replace(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g,a=>a.split('.').join(' точка '));
const cached=homedir()+'/.cache/yg-video/network-endterm/'+hash(['eleven_flash_v2_5','ogi2DyUAKJb7CEdqqvlU',{stability:.55,similarity_boost:.75,style:0,speed:1},spoken]);if(!existsSync(cached+'.mp3'))throw Error('Missing cached lesson '+lesson.module+'/'+i);
lines.push({who:i%3===1?'arpi':'ayat',text:jokes[lesson.module][i],chapter:i,laugh:i%2===0?'chuckle':undefined});lines.push({who:'guard',text:spoken,chapter:i,reuse:cached});for(const extra of supplements[lesson.module]||[])if(extra.chapter===i)lines.push({who:'guard',text:extra.text,chapter:i});
}
writeFileSync(out+'/script.json',JSON.stringify({...lesson,lines}));
}
