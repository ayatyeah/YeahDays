import paper from './midterm.json';
import {archiveBank} from './grind';
import {event as midterm} from '../computerNetworks/event';
import {present} from '../engine';
import type {EventQuizQuestion} from '@/components/events/EventQuiz';

const lectureForModule=[1,1,2,3,3,4,4,5,5,5,6,7,7,8,9,10,0];
export const midtermPaper:EventQuizQuestion[]=paper.map(q=>({...q,source:{kind:'paper',module:q.module,lecture:lectureForModule[q.module-1]}}));

// Module item numbers selected for the decisions tested on the 25-question paper.
const relevant:Record<number,number[]>={
  2:[1,2,3,4,5,6,7,8,13,14,15,17,19,20,21,22,24,25],
  3:[5,8,9,13,19,20,21,22,26,27,35,36,38,41,43],
  4:[7,10,11,12,13],5:[1,2,7,8,10,13,14,16,19],
  6:[1,7,9,10,11,12,13,14,16,17,19,20,21,22,24,26,27,28,29],
  7:[1,2,3,4,7,10,11,12,14,15,16,18,19,20,22,23,24],
  8:[13,14,16,18,26,31],9:[1,2,3,4,5,6,7,13,15,16,18,19,20,21,22,23,24,25],
  10:[2,3,4,6,7,8,12],11:[9,10,22],13:[1,7,8,12,14],14:[3,4,5,7,8,18,24,28,31],
};
const matchesPaper=/\b(OSI|PDU|T568B|crossover|MDIX|ICMP|duplex|CSMA|binary|hostname|cat\s?6|star topology|FCS|CRC|EtherType|preamble|payload|OUI|broadcast|MAC address table|MAC address-table|unknown unicast|EXEC|NVRAM|ARP|password-encryption|connection-oriented|reliable delivery)\b/i;
const moduleQuestions=archiveBank.flatMap(q=>{
  const id=/^module-(\d+)-(\d+)$/.exec(q.id);
  if(!id || !q.correct.length || !relevant[+id[1]]?.includes(+id[2]))return [];
  return [{...q,source:{kind:'module',module:+id[1],lecture:lectureForModule[+id[1]-1]}}];
});
const lectureQuestions=midterm.lectures.flatMap(l=>l.parts.flatMap(p=>p.questions.filter(q=>matchesPaper.test(q.q)).map(q=>{
  // Stable order keeps saved answer indices valid across devices.
  let seed=Array.from(q.id).reduce((h,c)=>Math.imul(h,31)+c.charCodeAt(0)|0,1);
  const n=Number(l.id.split('-l')[1]);
  const result=present(q,n,()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296));
  return {...result,correct:[result.correct],source:{kind:'lecture',lecture:n}};
})));
export const midtermRelated:EventQuizQuestion[]=[...moduleQuestions,...lectureQuestions];
