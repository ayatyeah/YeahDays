import {readFileSync,writeFileSync,existsSync,mkdirSync}from'node:fs';import{homedir}from'node:os';import{join}from'node:path';import{createHash}from'node:crypto';import{execFileSync}from'node:child_process';
const storyPath=process.argv[2]||'scripts/network-story/pilot.json';const out=process.argv[3]||'output/network-story-v2';mkdirSync(out,{recursive:true});const story=JSON.parse(readFileSync(storyPath));const dir=join(homedir(),'.cache/yg-video/network-story');mkdirSync(dir,{recursive:true});
const voices={ayat:'gJEfHTTiifXEDmO687lC',sara:'ymDCYd8puC7gYjxIamPt',system:'ogi2DyUAKJb7CEdqqvlU',guard:'ogi2DyUAKJb7CEdqqvlU',arpi:'kwajW3Xh5svCeKU5ky2S'};
const key=readFileSync(join(homedir(),'.config/yeahgrind/elevenlabs-key'),'utf8').trim();let time=1;const concat=[];
for(const [i,l] of story.lines.entries()){
 const id=createHash('sha256').update(JSON.stringify([voices[l.who],l.text,'eleven_flash_v2_5'])).digest('hex').slice(0,20);const base=l.reuse||join(dir,id);
 if(!existsSync(base+'.mp3')){
 const r=await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voices[l.who]}/with-timestamps?output_format=mp3_44100_128`,{method:'POST',headers:{'xi-api-key':key,'Content-Type':'application/json'},body:JSON.stringify({text:l.text,model_id:'eleven_flash_v2_5',language_code:'ru',voice_settings:{stability:.4,similarity_boost:.75,speed:1.03}}),signal:AbortSignal.timeout(120000)});const j=await r.json();if(!r.ok)throw Error(`${r.status}: ${j.detail?.status}`);writeFileSync(base+'.mp3',Buffer.from(j.audio_base64,'base64'));delete j.audio_base64;writeFileSync(base+'.json',JSON.stringify(j));}
 const d=Number(execFileSync('ffprobe',['-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',base+'.mp3'],{encoding:'utf8'}));
 // Sample actual audio loudness at 24 fps for lip movement.
 const pcm=execFileSync('ffmpeg',['-v','error','-i',base+'.mp3','-f','f32le','-ac','1','-ar','24000','-'],{maxBuffer:16*1024*1024});const samples=new Float32Array(pcm.buffer,pcm.byteOffset,pcm.byteLength/4);const envelope=[];for(let j=0;j<samples.length;j+=1000){let sum=0;for(let k=j;k<Math.min(j+1000,samples.length);k++)sum+=samples[k]*samples[k];envelope.push(Math.min(1,Math.sqrt(sum/1000)*8));}
 const meta=JSON.parse(readFileSync(base+'.json'));l.start=time;l.end=time+d;l.audio=base+'.mp3';l.envelope=envelope;l.alignment=meta.normalized_alignment||meta.alignment;time=l.end+(l.laugh?2.9:.45);console.log(`Dialogue ${i+1}/${story.lines.length}: ${d.toFixed(1)}s`);
}
story.duration=time+1;writeFileSync(join(out,'timeline.json'),JSON.stringify(story));
// One continuous speech track with deliberate pauses, no repeated provider calls.
const inputs=story.lines.flatMap(l=>['-i',l.audio]);const filters=story.lines.map((l,i)=>`[${i}:a]adelay=${Math.round(l.start*1000)}|${Math.round(l.start*1000)}[a${i}]`).join(';')+';'+story.lines.map((_,i)=>`[a${i}]`).join('')+`amix=inputs=${story.lines.length}:normalize=0,apad,atrim=duration=${story.duration}[out]`;
execFileSync('ffmpeg',['-v','error','-y',...inputs,'-filter_complex',filters,'-map','[out]','-ar','44100','-ac','2',join(out,'dialogue.wav')]);console.log('Duration',story.duration);
