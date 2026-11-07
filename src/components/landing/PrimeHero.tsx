"use client";

import Link from "next/link";
import Image from "next/image";
import { Anton } from "next/font/google";
import { useCopy } from "@/i18n/useCopy";
import { YgIcon } from "@/components/yg-icons";
import styles from "./prime-hero.module.css";

const display = Anton({ weight: "400", subsets: ["latin"], display: "swap" });

type DemoAction = { name: string; minutes: number; xp: number };
export default function PrimeHero({ action, done, onNext, onComplete }: {
  action: DemoAction; done: boolean; onNext: () => void; onComplete: () => void;
}) {
  const tx = useCopy();
  return <>
    <section className={styles.hero} aria-labelledby="prime-hero-title" data-no-i18n>
      <p className={styles.eyebrow}>{tx("МАЛЕНЬКИЕ ШАГИ. БОЛЬШИЕ ПЕРЕМЕНЫ.")}</p>
      <h1 id="prime-hero-title" className={`${styles.wordmark} ${display.className}`} aria-label="YEAH GRIND!!!!!!!!">
        <span>YEAH</span><span>GRIND<span className={styles.punctuation}>!!!!!!!!</span></span>
      </h1>
      <div className={styles.orbit} aria-hidden="true" />
      <span className={styles.scribble} aria-hidden="true" />
      <Image className={styles.character} src="/landing/looks/prime-stride-v1.webp" alt="" width={933} height={1400} sizes="(max-width: 700px) 240px, (max-width: 1000px) 360px, 520px" priority unoptimized />
      <div className={styles.copy}>
        <h2>{tx("Не идеальнее. Чуть лучше.")}</h2>
        <p>{tx("Один понятный шаг сегодня. Учёба, задачи и прогресс — в твоём ритме.")}</p>
        <div className={styles.actions}>
          <Link prefetch={false} data-button-motion className={styles.primary} href="/today">{tx("Начать свой путь")}<span aria-hidden="true">↗</span></Link>
          <a data-button-motion className={styles.secondary} href="#how">{tx("Как это работает")}</a>
        </div>
        <small>{tx("Бесплатно · Без карты · В твоём темпе")}</small>
      </div>
      <section className={styles.demo} aria-label={tx("Демо приложения")}>
        <div className={styles.demoTop}><b><YgIcon name="check" />{tx("Сегодня")}</b><span>{tx("Демо")}</span><button type="button" onClick={onNext} aria-label={tx("Следующее действие")}><YgIcon name="refresh" /></button></div>
        <div className={styles.demoBody}>
          <span className={styles.demoRing} data-done={done} aria-hidden="true">{done && <YgIcon name="check" />}</span>
          <div><h3>{tx(action.name)}</h3><div className={styles.meta}><span><YgIcon name="clock" />{tx("{0} мин", { "0": action.minutes })}</span><span>+{action.xp} XP</span></div></div>
        </div>
        <button type="button" className={styles.demoCta} onClick={onComplete}>{tx(done ? "Ещё одно действие" : "Попробовать в демо")}<span aria-hidden="true">↗</span></button>
        <span className={styles.demoStatus} role="status">{done ? tx("Готово! +{0} XP в демо", { "0": action.xp }) : tx("Пример задачи — попробуй нажать")}</span>
      </section>
    </section>
    <section className={styles.intro} data-no-i18n aria-label={tx("От шага к результату")}>
      <h2><span>{tx("Большие перемены")}</span> {tx("начинаются с малого.")}</h2>
      <ol>{[["01", "target", "Выбери шаг"], ["02", "bolt", "Сделай"], ["03", "chart", "Увидь прогресс"]].map(([n, icon, label]) => <li key={n}><span>{n}</span><YgIcon name={icon as "target" | "bolt" | "chart"} /><b>{tx(label)}</b><span aria-hidden="true">→</span></li>)}</ol>
    </section>
  </>;
}
