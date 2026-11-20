import {cookies} from 'next/headers';
import styles from '@/app/events/courses.module.css';

const preference='yg-network-reading-lang';
export async function readingLanguage() {
  return (await cookies()).get(preference)?.value==='en' ? 'en' : 'ru';
}
export default function ReadingLanguage({lang}:{lang:'ru'|'en'}) {
  async function select(data:FormData) {
    'use server';
    const value=data.get('lang');
    if(value==='ru'||value==='en') (await cookies()).set('yg-network-reading-lang',value,{path:'/',maxAge:31536000,sameSite:'lax'});
  }
  return <form action={select} aria-label={lang==='ru'?'Язык материала':'Reading language'} className={styles.readingLanguage}>
    {(['ru','en'] as const).map(code=><button key={code} type="submit" name="lang" value={code} lang={code} aria-pressed={lang===code}>{code==='ru'?'Русский':'English'}</button>)}
  </form>;
}
