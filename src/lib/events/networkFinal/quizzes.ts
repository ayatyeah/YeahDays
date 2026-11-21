import {grindNotes} from './grindNotes';
import {endtermPaper,endtermRelated} from './endterm';
import {midtermPaper,midtermRelated} from './midterm';
import {families,sprints} from './sprints';
import {archiveBank,compactBank,grindBank,grindUnits,forUnit} from './grind';
import bank from './practice.json';
import sets from './sets.json';
import sources from './sources.json';
import type { EventQuizQuestion } from '@/components/events/EventQuiz';

const bilingual = (ru: string, en = ru) => ({ru, en});
export const groups = [
  {id:'endterm-paper',title:'Банк эндтерма',count:endtermPaper.length},
  {id:'endterm-related',title:'Практика по темам эндтерма',count:endtermRelated.length},
  {id:'midterm-paper',title:'Банк мидтерма',count:midtermPaper.length},
  {id:'midterm-related',title:'Практика по темам мидтерма',count:midtermRelated.length},
  {id:'complete',title:'Общий банк',count:archiveBank.length},
  {id:'compact',title:'Укороченный банк',count:compactBank.length},
  {id:'grind-full',title:'GRIND MODE · полный проход',count:archiveBank.filter(q=>q.correct.length).length},
  {id:'grind',title:'GRIND MODE',count:grindBank.length},
  ...grindUnits.map(u=>({id:'unit-'+u.id,title:u.title,count:u.ids.length})),
  ...sprints.map(plan=>({...plan,count:families.length*plan.rounds})),
  ...sources.map(s => ({id:s.file, title:s.title, count:s.count})),
  ...Array.from(new Set(bank.map(q => q.topic)), topic => ({id:'topic-'+topic,title:'Модуль '+topic+' · разборы',count:bank.filter(q => q.topic === topic).length})),
  ...Array.from(new Set(sets.map(q => q.set)), set => ({id:'vrt-'+set,title:'VRT · вариант '+set,count:sets.filter(q => q.set === set).length})),
];

// Both GRIND routes share 37 lesson objects, including their bilingual text.
type Lesson = NonNullable<EventQuizQuestion['lesson']>;
const detailedLessons = new Map<string,Lesson>();
function withGrindLesson(question:EventQuizQuestion):EventQuizQuestion {
  const lesson=question.lesson!;
  let detailed=detailedLessons.get(lesson.id);
  if(!detailed){
    detailed={...lesson,notes:grindNotes(lesson.id)};
    detailedLessons.set(lesson.id,detailed);
  }
  return {...question,lesson:detailed};
}

export function questionsFor(group: string): EventQuizQuestion[] {
  const plan=sprints.find(p=>p.id===group);
  if(plan){
    const byId=new Map(bank.map(q=>[q.id,q]));
    return Array.from({length:plan.rounds},(_,round)=>families.map(family=>{
      const q=byId.get(family.ids[round])!;
      const related=family.ids.filter(id=>id!==q.id).map(id=>{
        const other=byId.get(id)!;
        return {prompt:other.prompt,answer:other.correct.map(i=>other.options[i]).join(' · ')};
      });
      return {id:q.id,q:q.prompt,options:q.options,correct:q.correct,why:bilingual(q.explanation,q.explanationEn),
        transfer:{title:family.title,rule:family.rule,related}};
    })).flat();
  }
  if(group==='endterm-paper')return endtermPaper;
  if(group==='endterm-related')return endtermRelated;
  if(group==='midterm-paper')return midtermPaper;
  if(group==='midterm-related')return midtermRelated;
  if(group==='complete')return archiveBank;
  if(group==='compact')return compactBank;
  if(group==='grind' || group==='grind-full'){
    const pool=group==='grind'?grindBank:grindUnits.flatMap(u=>forUnit(u.id)).filter(q=>q.correct.length);
    return pool.map(withGrindLesson);
  }
  if(group.startsWith('unit-') && grindUnits.some(u=>u.id===group.slice(5)))return forUnit(group.slice(5));
  if(sources.some(s=>s.file===group))return archiveBank.filter(q=>q.id.slice(0,q.id.lastIndexOf('-'))===group);
  if (group.startsWith('topic-')) return bank.filter(q => 'topic-'+q.topic === group).map(q => ({
    id:q.id, q:q.prompt, options:q.options, correct:q.eligible ? q.correct : [], caution:q.caution,
    why:bilingual(q.explanation, q.explanationEn),
    optionExplanations:q.id === 'E029' ? ['Маршрутизатор выбирает следующий переход по таблице маршрутизации.', 'Межсетевой экран фильтрует трафик по правилам безопасности.', 'Веб-сервер отвечает на HTTP-запросы.', 'DSL-модем передаёт сигнал по абонентской линии.'] : undefined,
  }));
  return endtermPaper.filter(q=>'vrt-'+q.source?.variant===group);
}

let reportQuestions: Map<string, EventQuizQuestion> | undefined;
export function networkReportQuestion(id: string) {
  if (!reportQuestions) {
    reportQuestions = new Map(groups.flatMap(group =>
      questionsFor(group.id).map(question => [question.id, question] as const)
    ));
  }
  return reportQuestions.get(id);
}
