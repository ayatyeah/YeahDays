'use client';
import { useState } from 'react';
import Link from 'next/link';
import type { AppMode } from '@/lib/appMode';
import styles from './VersionPicker.module.css';
export default function VersionPicker(){
  const [busy,setBusy]=useState<AppMode|null>(null);const [error,setError]=useState('');
  async function choose(mode:AppMode){
    setBusy(mode);setError('');
    try{const response=await fetch('/api/app-mode',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({mode})});const data=await response.json();if(!response.ok)throw new Error(data.error);
      // Clear any cached old shell before moving between independent versions.
      navigator.serviceWorker?.controller?.postMessage({type:'FORGET_SHELL'});
      if('caches' in window) await Promise.all((await caches.keys()).filter(key=>key.startsWith('yg-shell-')).map(key=>caches.delete(key)));
      window.location.assign(data.redirect);
    }catch(e){setError(e instanceof Error?e.message:'Не удалось выбрать версию');setBusy(null);}
  }
  return <main className={styles.page}><Link href="/" className={styles.brand}>YeahGrind<span>●</span></Link><header><p>ОДИН АККАУНТ · ДВЕ ВЕРСИИ</p><h1>Какую версию<br/>откроем сегодня?</h1><div>Выберите привычное приложение или версию для исследования РМТ.</div></header><div className={styles.grid}>
    <section className={styles.card}><span className={styles.symbol}>◈</span><p className={styles.label}>ИССЛЕДОВАНИЕ</p><h2>Версия для РМТ</h2><p>Четыре недели одинаковых заданий, очки, достижения и обратная связь. Распределение A/B — после добровольного согласия.</p><ul><li>Маршрут из 12 заданий</li><li>Сравнение обратной связи A/B</li><li>Прогресс и итоговое интервью</li></ul><button disabled={!!busy} onClick={()=>choose('rmt')}>{busy==='rmt'?'Открываем…':'Открыть версию для РМТ'} <span>→</span></button></section>
    <section className={styles.card}><span className={styles.symbol}>✦</span><p className={styles.label}>ПРИВЫЧНЫЙ YEAHGRIND</p><h2>Обычная версия</h2><p>Приложение до Assignment 3: персонаж, прокачка, планирование, учёба, ИИ-помощник и ваши сохранённые данные.</p><ul><li>Персонаж, XP и игровые механики</li><li>Свои задачи, календарь и учебные маршруты</li><li>ИИ-чат и персональные рекомендации</li></ul><button disabled={!!busy} onClick={()=>choose('normal')}>{busy==='normal'?'Открываем…':'Открыть обычную версию'} <span>→</span></button></section>
    </div>{error&&<p role="alert" className={styles.error}>{error}</p>}<footer>Выбор можно изменить через «Сменить версию». Группа A/B и данные аккаунта сохраняются.<br/>Если вы участвуете в РМТ, использование обычной версии отмечается как смешанное использование для анализа исследования.</footer></main>;
}
