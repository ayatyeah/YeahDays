import Link from 'next/link';
import type { Metadata } from 'next';
import s from '@/components/study/study.module.css';
export const metadata: Metadata = { title: 'YeahGrind — маленькие действия, видимый прогресс', description: 'Четыре недели простых заданий, обратной связи и видимого прогресса. Примите участие в исследовании опыта использования приложения.' };
export default function Page() {
  return <div className={s.landing}>
    <nav className={s.landingNav} aria-label="Главная"><Link className={s.brand} href="/"><span className={s.brandMark}>Y</span>YeahGrind</Link><Link href="/app" className={s.cta}>Войти →</Link></nav>
    <main><section className={s.landingHero}><div><span className={s.eyebrow}>МАЛЕНЬКИЕ ДЕЙСТВИЯ КАЖДЫЙ ДЕНЬ</span><h1>Меньше откладывать.<br/>Больше завершать.</h1><p>Один понятный шаг за раз. Выполняйте небольшие задания, получайте обратную связь и наблюдайте за своим прогрессом.</p><Link href="/app" className={s.cta}>Начать свой маршрут <span aria-hidden>→</span></Link><p style={{fontSize:12,marginTop:16}}>4 недели · 12 заданий · участие по вашему желанию</p></div><div className={s.landingPreview} aria-label="Пример интерфейса, не результаты участника"><span className={s.eyebrow}>ТАК ВЫГЛЯДИТ ВАШ ДЕНЬ</span><h2>Всё начинается<br/>с первого шага.</h2><div><span>≡ &nbsp; План из трёх шагов</span><small>10 очков</small></div><div><span>◷ &nbsp; Пять минут внимания</span><small>10 очков</small></div><div><span>↗ &nbsp; Короткое подведение итогов</span><small>10 очков</small></div><p style={{fontSize:11,marginTop:20,marginBottom:0}}>Пример заданий первой недели</p></div></section>
    <section className={s.landingIntro}><div><strong>Понятный маршрут</strong><p>Три задания в неделю, одинаковые очки и достижения. Без рейтингов и давления.</p></div><div><strong>Ваш реальный опыт</strong><p>Мы сравниваем две версии обратной связи: заранее заданную и созданную ИИ. Версия назначается случайно.</p></div><div><strong>Вы решаете</strong><p>Участие для совершеннолетних, после знакомства с условиями. Можно прекратить участие и удалить данные.</p></div></section></main>
    <footer className={s.footer}><span>YeahGrind · исследование пользовательского опыта</span><Link href="/privacy">Приватность</Link><Link href="/terms">Условия</Link><a href="mailto:balmagambet.ayat@gmail.com">Связаться</a></footer>
  </div>;
}
