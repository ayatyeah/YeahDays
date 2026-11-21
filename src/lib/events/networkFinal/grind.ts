import archive from './archive.json';
import practice from './practice.json';
import units from './grindUnits.json';
import corrections from './grindReasons.json';
import {conceptFor} from './concepts';
import type {EventQuizQuestion} from '@/components/events/EventQuiz';

export const grindUnits=units;
const unitByQuestion=new Map(units.flatMap(unit=>unit.ids.map(id=>[id,unit] as const)));
const normalize=(s:string)=>s.toLowerCase().normalize('NFKC').replace(/[\u202a-\u202e]/g,'').replace(/[^\p{L}\p{N}./]+/gu,' ').trim();
const studyByPrompt=new Map(practice.map(q=>[normalize(q.prompt),q]));
const lessonByUnit=new Map(units.map(unit=>[unit.id,{
  id:unit.id,title:unit.title,module:unit.module,
  lecture:[1,1,2,3,3,4,4,5,5,5,6,7,7,8,9,10,0][unit.module-1],ru:unit.ru,en:unit.en,
}]));
const overrides=new Map(corrections.flatMap(reason=>reason.ids.map(id=>[id,reason] as const)));

type Entry=typeof archive['module-01'][number];
function explain(q:Entry):EventQuizQuestion{
  const unit=unitByQuestion.get(q.id)!;
  const study=studyByPrompt.get(normalize(q.q));
  const definitions=q.options.map(conceptFor);
  const key=q.correct.map(i=>q.options[i]).join(' · ');
  const weak=!q.why || q.why.startsWith('В завершённом задании');
  const specific=overrides.get(q.id);
  const ru=specific?.ru ?? study?.explanation ?? (weak?[...new Set(q.correct.map(i=>definitions[i]).filter(Boolean)),unit.ru].join(' '):q.why);
  const en=specific?.en ?? study?.explanationEn ?? unit.en;
  return {...q,why:{ru,en},optionExplanations:q.optionExplanations.length===q.options.length && q.options.length?q.optionExplanations:definitions.every((r):r is string=>!!r)?definitions:undefined,
    lesson:lessonByUnit.get(unit.id)!,
    ...(weak && !specific && !study && key?{why:{ru:key+' — '+ru,en:key+' — '+en}}:{})};
}
export const archiveBank=Object.values(archive).flat().map(explain);
const byId=new Map(archiveBank.map(q=>[q.id,q]));

// Each row tests the same decision; similar-looking questions about different fields stay separate.
// m.n = module and item, tN.n = checkpoint and item.
const equivalences=`
1.9 1.22
1.16 1.23
1.11 1.26
1.14 1.27
2.1 10.7
2.3 2.19
2.6 10.3
2.8 t0.7 t0.9
3.1 3.31
3.4 3.39 t0.21
3.6 3.10
3.22 3.42 t0.17
3.30 3.32
3.34 t0.26
4.6 1.2
4.7 t1.32
4.9 t6.13
4.22 t7.47
5.7 5.10 5.19
5.3 5.4
5.5 5.6 5.15 5.17
6.2 6.25 t6.17
6.11 6.24
6.13 7.2 t1.7 t1.24
6.16 6.17
6.20 t7.20
6.23 7.6 7.17 t1.15
6.29 t6.16
7.15 7.16
7.10 t1.23
7.14 t6.54
8.15 8.21
8.26 8.31
8.13 8.27
8.30 12.1
8.33 13.13
9.2 9.22 t7.28
9.10 9.17
9.18 9.19 9.21 9.23 9.24
9.25 t6.23
10.1 t2.18 t6.26
10.6 t0.13 t5.35
10.9 8.14
11.1 11.2
11.3 11.4 11.5
11.12 11.18 11.21 11.23 11.25
11.13 11.19
11.17 11.24
12.6 12.8 12.21 12.32
12.17 12.31
12.18 12.27
12.19 12.24
12.20 12.28 12.29
12.22 12.26
13.3 13.15 t5.13
13.5 t5.30
13.7 13.12
13.8 13.14
14.4 14.29
14.12 14.15 14.23
14.16 14.33
14.18 t4.10
14.19 14.34 t6.39
14.20 14.30
14.26 14.37
15.3 t4.28 t4.29 t6.8 t7.45
15.10 15.32 t7.43
15.23 t4.22
15.30 2.23
16.3 16.5
16.4 16.7
16.2 16.8
16.9 16.13
16.15 16.20
16.24 16.34 t5.2 t5.5
17.2 17.29
17.4 17.24 t5.19
17.5 17.22
17.14 t5.16 t5.20
t1.18 t1.20
t1.22 t7.24
t1.31 t7.60
t2.6 t2.27 t6.22 t7.4
t2.19 t7.53
t2.24 t7.52
t6.49 17.24
`;
const parent=new Map<string,string>();
function root(id:string):string {const next=parent.get(id);return next?root(next):id;}
function unite(a:string,b:string){const x=root(a),y=root(b);if(x!==y)parent.set(y,x);}
for(const line of equivalences.trim().split('\n')){
  const ids=line.split(' ').map(token=>{const [g,n]=token.split('.');return (g.startsWith('t')?'test-exam_'+g.slice(1):'module-'+g.padStart(2,'0'))+'-'+n;});
  for(const id of ids.slice(1))unite(ids[0],id);
}
const exact=new Map<string,string>();
for(const q of archiveBank.filter(q=>q.correct.length)){
  const fingerprint=normalize(q.q)+'|'+q.correct.map(i=>normalize(q.options[i])).sort().join('|');
  const first=exact.get(fingerprint);
  if(first)unite(first,q.id);else exact.set(fingerprint,q.id);
}
const chosen=new Set<string>();
export const compactBank=archiveBank.filter(q=>{
  const key=root(q.id);
  if(!q.correct.length || chosen.has(key))return false;
  chosen.add(key);return true;
});
export function forUnit(id:string){
  return units.find(u=>u.id===id)!.ids.map(id=>byId.get(id)!);
}
export const grindBank=units.flatMap(unit=>unit.sample.map(id=>byId.get(id)!));
