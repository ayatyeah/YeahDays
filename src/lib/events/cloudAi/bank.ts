import data from './bank.json';
import { matchesAnswer } from '../quizAnswers';
export type SourceKind = 'lecture' | 'lab' | 'foundations' | 'developing';
export type AiQuestion = { id:string; sourceId:string; prompt:string; promptRu:string; options:string[]; optionsRu:string[]; answer:number; topic:string; difficulty:string; explanationRu:string; optionExplanationsRu:string[]; evidence:{page:number;concept:string}[] };
export type AiSource = {id:string;kind:SourceKind;title:string;url:string;coverage:string};
export const sources = data.sources as AiSource[];
export const questions = data.questions as AiQuestion[];
export const sourceKinds:Record<SourceKind,string> = {lecture:'Лекции LMS',lab:'Лабораторные и задания',foundations:'AWS Foundations',developing:'AWS Developing'};
export const topics:Record<string,string> = {'cloud-models':'Модели облака',infrastructure:'Инфраструктура',compute:'Вычисления',networking:'Сети',storage:'Хранение',databases:'Базы данных',security:'Безопасность',architecture:'Архитектура',serverless:'Serverless и API',containers:'Контейнеры',messaging:'Сообщения и workflows',devops:'Разработка и CI/CD',cost:'Стоимость',emerging:'Новые технологии'};
export const difficulties:Record<string,string> = {basic:'Основы',application:'Применение',troubleshooting:'Поиск ошибок'};
export const optionCounts = Object.fromEntries(questions.map(q=>[q.id,q.options.length]));
export type Filters = {kind:string;source:string;topic:string;difficulty:string;status:string;search:string};
export const defaultFilters:Filters = {kind:'all',source:'all',topic:'all',difficulty:'all',status:'all',search:''};
export function filterBank(filters:Filters, answers:Record<string,number[]>) {
 const term=filters.search.trim().toLowerCase();
 return questions.filter(q=>(filters.kind==='all'||sources.find(s=>s.id===q.sourceId)?.kind===filters.kind)&&(filters.source==='all'||q.sourceId===filters.source)&&(filters.topic==='all'||q.topic===filters.topic)&&(filters.difficulty==='all'||q.difficulty===filters.difficulty)&&(filters.status==='all'||(filters.status==='unanswered'?!answers[q.id]:!!answers[q.id]&&!matchesAnswer(answers[q.id],[q.answer])))&&(!term||[q.prompt,q.promptRu,...q.options,...q.optionsRu].join(' ').toLowerCase().includes(term)));
}
export function makeAttempt(pool:AiQuestion[], count:number, random:boolean) {
 if(!Number.isFinite(count)||count<1)return [];
 const result=[...pool];
 if(random)for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
 return result.slice(0,Math.min(Math.floor(count),result.length));
}
export function quizQuestion(q:AiQuestion) {
 const source=sources.find(s=>s.id===q.sourceId)!;
 return {id:q.id,q:q.prompt,options:q.options,correct:[q.answer],why:{ru:q.explanationRu,en:q.explanationRu},optionExplanations:q.optionExplanationsRu,caution:`Авторский вопрос по материалам: ${source.title} · стр./слайды ${q.evidence.map(e=>e.page).join(', ')}.`,studyLink:{href:source.url,title:source.title}};
}
