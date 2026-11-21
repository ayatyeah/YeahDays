'use client';
import styles from './question-language.module.css';
import english from '../../../public/quiz-language/en.json';
import { createContext, useContext, useEffect, useState, useSyncExternalStore, type ReactNode } from 'react';

type Language = 'en' | 'ru';
type Dictionary = Record<string,string>;
const dictionaries = new Map<Language, Dictionary>([['en',english]]);
const pending = new Map<Language, Promise<Dictionary>>();
// Share the choice across mounted quiz cards. A fresh page starts in English.
let selectedLanguage: Language = 'en';
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };
function selectLanguage(language: Language) { selectedLanguage = language; listeners.forEach(listener => listener()); }
function load(lang: Language) {
  if (dictionaries.has(lang)) return Promise.resolve(dictionaries.get(lang)!);
  if (!pending.has(lang)) pending.set(lang, fetch(`/quiz-language/${lang}.json?v=${process.env.NEXT_PUBLIC_BUILD_ID ?? 'dev'}`).then(async response => {
    if (!response.ok) throw Error('translation');
    const data = await response.json() as Dictionary; dictionaries.set(lang,data);return data;
  }).finally(()=>pending.delete(lang)));
  return pending.get(lang)!;
}
const Overrides = createContext<Partial<Record<Language,Dictionary>>>({});
export function QuestionTranslations({translations,children}:{translations:Partial<Record<Language,Dictionary>>;children:ReactNode}) {return <Overrides.Provider value={translations}>{children}</Overrides.Provider>;}
const Context = createContext<{lang:Language; dictionary:Dictionary; loading:boolean}>({lang:'en',dictionary:{},loading:true});
export function QuestionLanguage({ children, sourceTexts = [], language }: { children: ReactNode; sourceTexts?: string[];language?:Language }) {
  const selected = useSyncExternalStore(subscribe, () => selectedLanguage, () => 'en' as Language);
  const lang=language??selected;
  const [dictionary,setDictionary]=useState<Dictionary>(english);
  const [loading,setLoading]=useState(false);
  const [failed,setFailed]=useState(false);
  const [retry,setRetry]=useState(0);
  const textKey = JSON.stringify(sourceTexts);
  const overrideKey = JSON.stringify(useContext(Overrides)[lang] ?? {});
  useEffect(()=>{
    let alive=true;setLoading(true);setFailed(false);
    const controller = new AbortController();
    load(lang).then(async data=>{
      const known = {...data,...JSON.parse(overrideKey) as Dictionary};
      const missing = [...new Set(JSON.parse(textKey) as string[])].filter(text => (/[а-яё]/i.test(text)?'ru':'en')!==lang && !known[text]);
      if(missing.length){
        const response=await fetch('/api/quiz-language',{method:'POST',signal:controller.signal,headers:{'Content-Type':'application/json'},body:JSON.stringify({language:lang,texts:missing})});
        if(!response.ok)throw Error('translation');
        data={...dictionaries.get(lang),...data,...await response.json() as Dictionary};dictionaries.set(lang,data);
      }
      if(alive){setDictionary(data);setLoading(false);}
    }).catch(()=>{if(alive){setDictionary({});setLoading(false);setFailed(true);}});
    return ()=>{alive=false;controller.abort();};
  },[lang,retry,textKey,overrideKey]);
  return <Context.Provider value={{lang,dictionary:{...(dictionaries.get(lang) ?? dictionary),...JSON.parse(overrideKey) as Dictionary},loading}}>
    <div className={`quiz-language ${styles.controls}`} data-no-i18n role="group" aria-label="Question language">
      {!language && <><button type="button" aria-pressed={lang==='en'} onClick={()=>selectLanguage('en')}>English</button>
      <button type="button" aria-pressed={lang==='ru'} onClick={()=>selectLanguage('ru')}>Русский</button></>}
      {loading && <span role="status">{lang==='ru'?'Загрузка перевода…':'Loading translation…'}</span>}
      {failed && <button type="button" onClick={()=>setRetry(n=>n+1)}>{lang==='en'?'Translation unavailable · retry':'Перевод не загрузился · повторить'}</button>}
    </div>{children}
  </Context.Provider>;
}
export function QuestionText({ children }: { children: string }) {
  const {lang,dictionary}=useContext(Context);
  const source:Language = /[а-яё]/i.test(children)?'ru':'en';
  const translated=source===lang?children:dictionary[children];
  return <span lang={translated?lang:source} data-no-i18n>{translated ?? children}</span>;
}
