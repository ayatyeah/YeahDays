export type LeakQuestion = {prompt:string;promptRu:string;options:string[];optionsRu:string[];answers:number[];explanationRu:string;optionExplanationsRu:string[];topic:string;source:string};
export type LeakBatch = {id:string;title:string;questions:LeakQuestion[]};
export type PublishedLeak = LeakQuestion & {id:string;batchId:string;batchTitle:string};
function text(v:unknown,name:string,max=5000):string {if(typeof v!=='string'||!v.trim()||v.length>max)throw Error(`${name}: нужен непустой текст до ${max} символов`);return v.trim();}
function strings(v:unknown,name:string){if(!Array.isArray(v))throw Error(`${name}: нужен массив`);return v.map((x,i)=>text(x,`${name}[${i}]`));}
export function parseLeakBatch(value:unknown):LeakBatch {
 if(!value||typeof value!=='object')throw Error('Нужен JSON-объект');
 const b=value as Record<string,unknown>;
 const id=text(b.id,'id',80);if(!/^[a-z0-9][a-z0-9-]{2,79}$/.test(id))throw Error('id: 3–80 строчных латинских букв, цифр и дефисов');
 if(!Array.isArray(b.questions)||b.questions.length<1||b.questions.length>100)throw Error('В одной загрузке должно быть 1–100 вопросов');
 const questions=b.questions.map((value,index)=>{
  if(!value||typeof value!=='object')throw Error(`Вопрос ${index+1}: нужен объект`);
  const q=value as Record<string,unknown>;const options=strings(q.options,'options');const optionsRu=strings(q.optionsRu,'optionsRu');const explanations=strings(q.optionExplanationsRu,'optionExplanationsRu');
  if(options.length<2||options.length>8||optionsRu.length!==options.length||explanations.length!==options.length)throw Error(`Вопрос ${index+1}: нужно 2–8 вариантов и столько же переводов/разборов`);
  if(new Set(options.map(s=>s.toLowerCase())).size!==options.length)throw Error(`Вопрос ${index+1}: повторяются варианты`);
  if(!Array.isArray(q.answers)||!q.answers.length||q.answers.some(a=>!Number.isInteger(a)||a<0||a>=options.length)||new Set(q.answers).size!==q.answers.length)throw Error(`Вопрос ${index+1}: answers — уникальные индексы правильных вариантов с нуля`);
  return {prompt:text(q.prompt,'prompt'),promptRu:text(q.promptRu,'promptRu'),options,optionsRu,answers:[...q.answers].sort((a,b)=>a-b) as number[],explanationRu:text(q.explanationRu,'explanationRu'),optionExplanationsRu:explanations,topic:text(q.topic,'topic',120),source:text(q.source,'source',240)};
 });
 if(new Set(questions.map(questionFingerprint)).size!==questions.length)throw Error('В загрузке есть повторяющиеся вопросы');
 return {id,title:text(b.title,'title',180),questions};
}
export function questionFingerprint(q:Pick<LeakQuestion,'prompt'|'options'>){const norm=(s:string)=>s.normalize('NFKC').toLowerCase().replace(/\s+/g,' ').trim();return JSON.stringify([norm(q.prompt),q.options.map(norm).sort()]);}
export function publishQuestions(batch:LeakBatch):PublishedLeak[]{return batch.questions.map((q,i)=>({...q,id:`leak-${batch.id}-${i+1}`,batchId:batch.id,batchTitle:batch.title}));}
