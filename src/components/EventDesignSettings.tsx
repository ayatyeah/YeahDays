'use client';

import { useId } from 'react';
import { useSession } from 'next-auth/react';
import { useLocaleStore } from '@/i18n/locale';
import { eventDesignForUser, useThemeStore, type EventDesign } from '@/store/useThemeStore';
import styles from './event-design-settings.module.css';

const options: { id: EventDesign; title: string; ru: string; en: string; kk: string }[] = [
  { id: 'prime', title: 'Prime', ru: 'Объёмные формы, жемчужный свет и фиолетовые акценты.', en: 'Sculpted shapes, pearl light and violet accents.', kk: 'Көлемді пішіндер, інжу реңктері және күлгін екпіндер.' },
  { id: 'ocean', title: 'Ocean', ru: 'Прохладные синие оттенки, больше воздуха и ясные контуры.', en: 'Cool blue tones, breathing room and crisp outlines.', kk: 'Салқын көк реңктер, кеңістік және айқын контурлар.' },
  { id: 'sunset', title: 'Sunset', ru: 'Тёплая бумага, персиковые оттенки и уютный конспект.', en: 'Warm paper, peach tones and a cozy notebook.', kk: 'Жылы қағаз, шабдалы реңктері және жайлы конспект.' },
];

export default function EventDesignSettings() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const locale = useLocaleStore(s => s.locale);
  const selected = useThemeStore(s => eventDesignForUser(s.eventDesignByUser, userId));
  const setDesign = useThemeStore(s => s.setEventDesign);
  const name = useId();
  const title = locale === 'ru' ? 'Дизайн ивентов' : locale === 'kk' ? 'Ивенттер дизайны' : 'Event design';
  return <section className="mt-7" data-no-i18n>
    <fieldset className={styles.fieldset} disabled={!userId}>
      <legend className="inset-title">{title}</legend>
      <p className={styles.description}>{locale === 'ru' ? 'Один стиль для всех ивентов. Сохраняется для твоего аккаунта в этом браузере. Тёмная тема работает отдельно.' : locale === 'kk' ? 'Барлық ивенттерге ортақ стиль. Осы браузерде аккаунтың үшін сақталады. Қараңғы тақырып бөлек жұмыс істейді.' : 'One style for every event. Saved for your account in this browser. Dark mode works separately.'}</p>
      <div className={styles.grid}>{options.map(option => <label key={option.id} className={styles.option} data-selected={selected === option.id} data-design={option.id}>
        <input type="radio" name={name} value={option.id} checked={selected === option.id} onChange={() => { if (userId) setDesign(userId, option.id); }}/>
        <span className={styles.preview} aria-hidden="true"><span className={styles.previewNav}><i/><i/><i/></span><span className={styles.previewBody}><i/><span><b/><i/><i/><strong/></span></span></span>
        <span className={styles.title}>{option.title}<span className={styles.selected} aria-hidden="true">{selected === option.id ? '✓' : ''}</span></span>
        <span className={styles.detail}>{option[locale]}</span>
      </label>)}</div>
    </fieldset>
  </section>;
}
