import archive from './archive.json';
import bank from './practice.json';
import { conceptFor } from './concepts';
import sets from './sets.json';
import sources from './sources.json';
import type { EventQuizQuestion } from '@/components/events/EventQuiz';

const archives: Record<string, typeof archive['module-01']> = archive;
const bilingual = (ru: string, en = ru) => ({ru, en});
const normalize = (text: string) => text.trim().toLowerCase().replace(/[.!]+$/, '');

export const groups = [
  ...sources.map(s => ({id:s.file, title:s.title, count:s.count})),
  ...Array.from(new Set(bank.map(q => q.topic)), topic => ({id:'topic-'+topic,title:'Модуль '+topic+' · разборы',count:bank.filter(q => q.topic === topic).length})),
  ...Array.from(new Set(sets.map(q => q.set)), set => ({id:'vrt-'+set,title:'VRT · вариант '+set,count:sets.filter(q => q.set === set).length})),
];

export function questionsFor(group: string): EventQuizQuestion[] {
  if (Object.hasOwn(archives, group)) return archives[group].map(q => {
    const reasons = q.optionExplanations.length ? q.optionExplanations : q.options.map(conceptFor);
    const definitions = q.correct.map(i => reasons[i]).filter(Boolean);
    const why = q.why.startsWith('В завершённом задании') && definitions.length ? definitions.join(' ') : q.why;
    return {...q, why:bilingual(why), optionExplanations:reasons.every((r): r is string => !!r) ? reasons : undefined};
  });
  if (group.startsWith('topic-')) return bank.filter(q => 'topic-'+q.topic === group).map(q => ({
    id:q.id, q:q.prompt, options:q.options, correct:q.eligible ? q.correct : [], caution:q.caution,
    why:bilingual(q.explanation, q.explanationEn),
    optionExplanations:q.id === 'E029' ? ['Маршрутизатор выбирает следующий переход по таблице маршрутизации.', 'Межсетевой экран фильтрует трафик по правилам безопасности.', 'Веб-сервер отвечает на HTTP-запросы.', 'DSL-модем передаёт сигнал по абонентской линии.'] : undefined,
  }));
  return sets.filter(q => 'vrt-'+q.set === group).map(q => {
    const answers = q.answer.split(';').map(normalize);
    const indices = answers.map(a => q.options.findIndex(o => normalize(o) === a));
    return {id:q.id,q:q.prompt,options:q.options,correct:!q.caution && indices.every(i=>i>=0) ? indices : [], caution:q.caution,why:bilingual(q.answer+' — '+q.explanation)};
  });
}
