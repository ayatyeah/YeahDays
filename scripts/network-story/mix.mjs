import{readFileSync}from'node:fs';import{execFileSync}from'node:child_process';
const out=process.argv[2]||'output/network-story-v3';const story=JSON.parse(readFileSync(out+'/timeline.json'));
const laughs=story.lines.filter(l=>l.laugh);const inputs=['-i',out+'/pilot-silent.mp4','-i',out+'/dialogue.wav','-i',out+'/score.wav',...laughs.flatMap(l=>['-i',out+'/'+l.laugh+'.mp3'])];
// Laughter sits entirely inside intentionally extended dialogue pauses.
const filters=laughs.map((l,i)=>`[${i+3}:a]atrim=duration=2.5,asetpts=PTS-STARTPTS,afade=t=out:st=1.9:d=0.6,volume=0.35,adelay=${Math.round((l.end+.15)*1000)}|${Math.round((l.end+.15)*1000)}[laugh${i}]`).join(';')+';[1:a][2:a]'+laughs.map((_,i)=>`[laugh${i}]`).join('')+`amix=inputs=${laughs.length+2}:normalize=0,loudnorm=I=-16:TP=-1.5:LRA=11[a]`;
for(const l of laughs){const next=story.lines[story.lines.indexOf(l)+1];if(next&&l.end+2.65>next.start)throw Error('Laughter overlaps next line');}
execFileSync('ffmpeg',['-v','error','-y',...inputs,'-filter_complex',filters,'-map','0:v','-map','[a]','-c:v','copy','-c:a','aac','-b:a','160k','-ar','48000','-movflags','+faststart','-shortest',out+'/01-packet-too-big-comedy.mp4']);
console.log(`${laughs.length} laugh cues, no dialogue overlap`);
