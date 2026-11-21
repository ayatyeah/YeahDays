import book from '../finals/computer-networks.json';
import early from './grindWorkedEarly.json';
import middle from './grindWorkedMiddle.json';
import late from './grindWorkedLate.json';
import {withNetworkTerms} from './terminology';

// Zero-based lecture, part and section indices. Each selection ends at the
// next heading, keeping worked examples, tables and lists together.
type Selection = [lecture:number, part:number, ...sections:number[]];
const sections:Record<string,Selection[]> = {
  '1a':[[0,0,0,1]], '1b':[[0,0,3,4,5]], '1c':[[0,1,0,1,2]],
  '2a':[[0,2,1,2,3]], '2b':[[0,3,0,1,3]],
  '3a':[[1,0,2,3,4]], '3b':[[1,2,2,4,5]], '3c':[[1,1,2,3,4]],
  '4a':[[2,0,1,2,3,4]], '4b':[[2,1,2,5],[2,2,1,4]], '4c':[[2,2,5,6]],
  '5a':[[2,3,1,2,3]], '5b':[[2,3,4,5]],
  '6a':[[3,0,0,1],[3,1,0]], '6b':[[3,0,2,3,4]],
  '7a':[[3,1,4,5],[3,2,0]], '7b':[[3,3,1,2,3]],
  '8a':[[4,0,1,2,6]], '8b':[[4,0,3,5,7]],
  '9a':[[4,1,1,4,5]], '9b':[[4,1,2,6]],
  '10a':[[4,2,1,2,3]], '10b':[[4,2,4,6,8]],
  '11a':[[5,0,0,4,6]], '11b':[[5,0,1,2,8]],
  '12a':[[6,0,0,2,9]], '12b':[[6,0,1,3,8]],
  '13a':[[6,1,0,2]], '13b':[[6,1,3,4]],
  '14a':[[7,0,0,1,7]], '14b':[[7,0,2,4,6]],
  '15a':[[8,0,1,4,9]], '15b':[[8,0,2,3,8]],
  '16a':[[9,0,0,1,5]], '16b':[[9,0,2,6,7]],
  '17a':[[5,0,8],[4,0,3]], '17b':[[6,1,4],[4,2,7,8]],
};

// The timed route keeps the sections needed for its actual practice set.
const shortSections:Record<string,Selection[]>={
  '1b':[[0,0,4,5]], '1c':[[0,1,1]], '2a':[[0,2,2,3]], '2b':[[0,3,3]],
  '4a':[[2,0,1,2,4]], '4b':[[2,1,1],[2,2,1,4]],
  '7a':[[3,1,4],[3,2,0]], '8a':[[4,0,1,2]], '8b':[[4,0,3,7]],
  '9a':[[4,1,1,4]], '10a':[[4,2,1,2]], '10b':[[4,2,4,8]],
  '13a':[[6,1,2]], '15a':[[8,0,4,9]], '16b':[[9,0,2,6]],
  '17a':[[0,1,1]], '17b':[[6,1,4]],
};

type WorkedCase = {scenario:string;reasoning:string;check:string;answer:string;rule?:string};
const examples:Record<string, Record<'ru'|'en', WorkedCase>> = {...early,...middle,...late};

export function grindNotes(id:string, short:boolean){
  function read(lang:'ru'|'en'){
    const selected=(short && shortSections[id]) || sections[id];
    const blocks=selected.flatMap(([lecture,part,...indices])=>{
      const text=book.event.lectures[lecture].parts[part].notes[lang];
      const chunks=text.trim().split(/\n(?=#{2,3} )/);
      return indices.map(index=>{
        const chunk=chunks[index]?.trim();
        if(!chunk)throw Error('Missing GRIND reading section for '+id);
        return chunk.replace(/^### /,'## ');
      });
    });
    const example=examples[id][lang];
    if(example.rule) blocks.push((lang==='ru'?'## Как различать варианты':'## How to tell the options apart')+'\n'+example.rule);
    blocks.push([
      lang==='ru'?'## Разбор задачи':'## Worked example',
      example.scenario,
      example.reasoning,
      '?? '+example.check,
      '?= '+example.answer,
    ].join('\n'));
    const notes=blocks.join('\n\n');
    return lang==='ru'?withNetworkTerms(notes):notes;
  }
  return {ru:read('ru'),en:read('en')};
}
