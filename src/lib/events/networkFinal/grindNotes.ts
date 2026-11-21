import book from '../finals/computer-networks.json';
import {modules} from './readings';
import {readingEnglish} from './readingEnglish';
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

// Place each module's worked case beside the microtopic that uses it.
const caseUnits = new Set(['1b','2b','3b','4a','5b','6a','7b','8b','9a','10b','11b','12b','13b','14b','15b','16b','17a']);

export function grindNotes(id:string){
  function read(lang:'ru'|'en'){
    const blocks=sections[id].flatMap(([lecture,part,...indices])=>{
      const text=book.event.lectures[lecture].parts[part].notes[lang];
      const chunks=text.trim().split(/\n(?=#{2,3} )/);
      return indices.map(index=>{
        const chunk=chunks[index]?.trim();
        if(!chunk)throw Error('Missing GRIND reading section for '+id);
        return chunk.replace(/^### /,'## ');
      });
    });
    if(caseUnits.has(id)){
      const index=parseInt(id,10)-1;
      const {scenario,explanation,question,answer}=modules[index];
      const [, , problem,worked,check,solution]=readingEnglish[index];
      blocks.push(lang==='ru'
        ? ['## Разбор задачи',scenario,explanation,'?? '+question,'?= '+answer].join('\n')
        : ['## Worked example',problem,worked,'?? '+check,'?= '+solution].join('\n'));
    }
    const notes=blocks.join('\n\n');
    return lang==='ru'?withNetworkTerms(notes):notes;
  }
  return {ru:read('ru'),en:read('en')};
}
