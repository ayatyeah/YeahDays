"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { YgIcon, type YgIconName } from "@/components/yg-icons";
import StandaloneRedirect from "@/components/StandaloneRedirect";
import CookieConsent from "@/components/CookieConsent";
import LanguageSwitcher from "@/i18n/LanguageSwitcher";
import styles from "./landing.module.css";

const actions = [
  {
    name: "Выйди на прогулку",
    category: "ЗДОРОВЬЕ",
    icon: "leaf" as YgIconName,
    text: "Свежий воздух, любимый плейлист и немного времени для себя.",
    minutes: 15,
    xp: 25,
  },
  {
    name: "Прочитай 10 страниц",
    category: "ИНТЕЛЛЕКТ",
    icon: "book" as YgIconName,
    text: "Открой книгу, которую давно откладываешь. Всего одна маленькая глава.",
    minutes: 15,
    xp: 30,
  },
  {
    name: "Разомнись немного",
    category: "СИЛА",
    icon: "bolt" as YgIconName,
    text: "Расправь плечи, потянись и сделай несколько простых упражнений.",
    minutes: 5,
    xp: 15,
  },
];
const features: { icon: YgIconName; title: string; text: string }[] = [
  {
    icon: "cards",
    title: "Подстраивается под тебя",
    text: "Пять минут или целый час? Колода учитывает твоё время, энергию и то, что тебе интересно.",
  },
  {
    icon: "snowflake",
    title: "Можно просто выдохнуть",
    text: "Две заморозки в месяц сохранят серию. Один сложный день не обнуляет весь твой путь.",
  },
  {
    icon: "phone",
    title: "Всегда под рукой",
    text: "На ноутбуке и телефоне. Установи как приложение и продолжай даже без интернета.",
  },
];
const faq = [
  [
    "Это бесплатно?",
    "Да. Колода действий, задачи и прогресс доступны бесплатно. Можно начать без аккаунта, а зарегистрироваться позже для синхронизации.",
  ],
  [
    "Чем это отличается от списка задач?",
    "YeahGrind предлагает конкретное действие под твоё состояние. Выбираешь одно, выполняешь и только потом переходишь к следующему. Свои задачи тоже можно добавлять.",
  ],
  [
    "Что будет, если я пропущу день?",
    "Две автоматические заморозки в месяц помогают сохранить серию. А если серия закончится — накопленный прогресс останется с тобой.",
  ],
  [
    "Нужно скачивать приложение?",
    "Нет, можно пользоваться прямо в браузере. А ещё сайт можно добавить на домашний экран телефона как приложение.",
  ],
];

function Mascot({
  className = "",
  priority = false,
  pose = "wave",
}: {
  className?: string;
  priority?: boolean;
  pose?: "wave" | "read" | "guide" | "win";
}) {
  return (
    <Image
      className={className}
      src={
        pose === "wave"
          ? "/landing/founder-mascot.webp"
          : `/landing/mascot-${pose}.webp`
      }
      alt=""
      width={160}
      height={240}
      sizes="(max-width: 700px) 100px, 160px"
      priority={priority}
    />
  );
}

const LOOKS = [
  {
    id: "streetwear",
    label: "Город",
    title: "Выйти за привычный маршрут.",
    text: "Новые места, новые идеи. Иногда достаточно просто выйти из дома.",
    color: "#c8b4ed",
  },
  {
    id: "campus",
    label: "Учёба",
    title: "Разобраться. А не зазубрить.",
    text: "Одна тема, несколько страниц и чуть больше уверенности в себе.",
    color: "#b5d4bb",
  },
  {
    id: "sport-wave",
    label: "Спорт",
    title: "Начать со своего темпа.",
    text: "Пять минут движения сегодня лучше идеальной тренировки когда-нибудь.",
    color: "#d3f693",
  },
  {
    id: "sport-warmup",
    label: "Разминка",
    title: "Расправить плечи. Выдохнуть.",
    text: "Небольшая пауза для тела — и можно продолжать с новыми силами.",
    color: "#edc4aa",
  },
  {
    id: "hiking",
    label: "Природа",
    title: "Чуть дальше от уведомлений.",
    text: "Свежий воздух и время для себя тоже заслуживают места в планах.",
    color: "#eab786",
  },
  {
    id: "smart-casual",
    label: "Планы",
    title: "Большие идеи. Маленькие шаги.",
    text: "Разложи то, что важно, на действия, которые можно сделать сегодня.",
    color: "#dcc7ab",
  },
  {
    id: "black-tee",
    label: "Каждый день",
    title: "Просто быть собой.",
    text: "Без гонки за идеалом. У каждого дня может быть свой ритм.",
    color: "#bfc8d8",
  },
  {
    id: "sport-win",
    label: "Победа",
    title: "Получилось. Это считается.",
    text: "Замечай сделанное. Даже самый маленький шаг меняет твою историю.",
    color: "#d3f693",
  },
];

function Outfit({
  name,
  className = "",
  priority = false,
}: {
  name: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={`/landing/looks/${name}.webp`}
      alt=""
      width={360}
      height={540}
      sizes="(max-width: 700px) 240px, 360px"
      className={className}
      priority={priority}
    />
  );
}

export default function Landing() {
  const [menu, setMenu] = useState(false);
  const [lookIndex, setLookIndex] = useState(0);
  const look = LOOKS[lookIndex];
  const [actionIndex, setActionIndex] = useState(0);
  const [done, setDone] = useState(false);
  const action = actions[actionIndex];
  function next() {
    setActionIndex((i) => (i + 1) % actions.length);
    setDone(false);
  }
  return (
    <div className={styles.landing} id="top">
      <StandaloneRedirect />
      <a className={styles.skip} href="#main">
        Перейти к содержимому
      </a>
      <header className={styles.header}>
        <Link
          href="/"
          className={styles.brand}
          aria-label="YeahGrind — главная"
        >
          <Image src="/logo-white.webp" alt="" width={31} height={29} />
          yeahgrind<span>®</span>
        </Link>
        <nav className={styles.desktopNav} aria-label="Основная навигация">
          <a href="#product">Возможности</a>
          <a href="#how">Как это работает</a>
          <a href="#about">О проекте</a>
        </nav>
        <div className={styles.navActions}>
          <Link href="/login" className={styles.login}>
            Войти
          </Link>
          <Link className={styles.navCta} href="/app">
            Начать <span>↗</span>
          </Link>
          <button
            className={styles.menuButton}
            aria-label={menu ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={menu}
            aria-controls="landing-menu"
            onClick={() => setMenu(!menu)}
          >
            {menu ? (
              "✕"
            ) : (
              <>
                <i />
                <i />
              </>
            )}
          </button>
        </div>
        {menu && (
          <nav
            id="landing-menu"
            className={styles.mobileNav}
            aria-label="Мобильная навигация"
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setMenu(false);
                document
                  .querySelector<HTMLButtonElement>(
                    `button[aria-controls="landing-menu"]`,
                  )
                  ?.focus();
              }
            }}
          >
            <a href="#product" onClick={() => setMenu(false)}>
              Возможности <span>↗</span>
            </a>
            <a href="#how" onClick={() => setMenu(false)}>
              Как это работает <span>↗</span>
            </a>
            <a href="#about" onClick={() => setMenu(false)}>
              О проекте <span>↗</span>
            </a>
            <Link href="/login">
              Войти в аккаунт <span>↗</span>
            </Link>
          </nav>
        )}
      </header>
      <main id="main" className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <div className={styles.eyebrow}>
              <span className={styles.liveDot} /> МАЛЕНЬКИЕ ШАГИ. БОЛЬШИЕ
              ПЕРЕМЕНЫ.
            </div>
            <div className={styles.heroEdition}>
              ЖИЗНЬ В РЕЖИМЕ <span>«МОГУ» ↗</span>
            </div>
            <h1>
              Не идеальнее.
              <br />
              <span>Живее.</span>
            </h1>
            <p className={styles.heroText}>
              Не нужно менять жизнь за понедельник.
              <br />
              Начни с одного действия — мы поможем
              <br className={styles.desktopBreak} /> выбрать то, на что сегодня
              хватит сил.
            </p>
            <div className={styles.heroButtons}>
              <Link href="/app" className={styles.primary}>
                Начать свой путь <span>↗</span>
              </Link>
              <a href="#how" className={styles.secondary}>
                <span className={styles.play}>▷</span> Как это работает
              </a>
            </div>
            <p className={styles.free}>
              <span>✓</span> Бесплатно <i /> Без карты <i /> В твоём ритме
            </p>
          </div>
          <div className={styles.heroVisual}>
            <span className={styles.heroWord} aria-hidden>
              YEAH!
            </span>
            <Outfit name="streetwear" className={styles.heroOutfit} priority />
            <span className={styles.heroSticker}>100% ТВОЙ ТЕМП</span>
            <div className={styles.orbit} />
            <div className={styles.visualLabel}>
              МЕНЬШЕ ПЛАНИРУЙ. БОЛЬШЕ ЖИВИ.
            </div>
            <div className={styles.streak}>
              <span className={styles.streakIcon}>
                <YgIcon name="flame" className="h-[23px] w-[23px]" />
              </span>
              <div>
                <strong>7 дней подряд</strong>
                <small>Ты в отличном ритме</small>
              </div>
              <span className={styles.streakDots}>•••</span>
            </div>
            <div className={styles.cardStack}>
              <div className={styles.actionCard}>
                <div className={styles.cardTop}>
                  <span>ТВОЁ ДЕЙСТВИЕ НА СЕГОДНЯ</span>
                  <span>{String(actionIndex + 1).padStart(2, "0")} / 03</span>
                </div>
                <div className={styles.actionArt}>
                  <div className={styles.artCircle} />
                  <Mascot
                    className={styles.cardMascot}
                    pose={
                      done
                        ? "win"
                        : actionIndex === 1
                          ? "read"
                          : actionIndex === 2
                            ? "guide"
                            : "wave"
                    }
                    priority
                  />
                  <span className={styles.sparkOne}>✳</span>
                  <span className={styles.sparkTwo}>+</span>
                </div>
                <span className={styles.category}>{action.category}</span>
                <h2>{action.name}</h2>
                <p>{action.text}</p>
                <div className={styles.cardMeta}>
                  <span>
                    <YgIcon name="clock" className="h-[15px] w-[15px]" />{" "}
                    {action.minutes} минут
                  </span>
                  <span>
                    +{action.xp} XP{" "}
                    <YgIcon name="bolt" className="h-[14px] w-[14px]" />
                  </span>
                </div>
                <div className={styles.demoButtons}>
                  <button onClick={next} aria-label="Следующее действие">
                    ↻
                  </button>
                  <button onClick={() => (done ? next() : setDone(true))}>
                    {done ? "Ещё одно действие" : "Попробовать в демо"}
                    <span>{done ? "↗" : "+"}</span>
                  </button>
                </div>
                <span className={styles.demoStatus} aria-live="polite">
                  {done
                    ? `Отлично! +${action.xp} XP в демо`
                    : "Демо колоды · попробуй нажать"}
                </span>
              </div>
            </div>
            <div className={styles.progressFloat}>
              <span className={styles.mascotAvatar}>
                <Mascot />
              </span>
              <div>
                <strong>Маленький шаг — уже победа</strong>
                <small>Становись лучше, а не идеальнее</small>
              </div>
            </div>
          </div>
        </section>
        <section className={styles.numbers} aria-label="YeahGrind в цифрах">
          {[
            ["159", "действий в колоде"],
            ["12", "лестниц навыков"],
            ["5", "характеристик персонажа"],
            ["0 ₸", "чтобы начать"],
          ].map(([n, t]) => (
            <div key={n}>
              <strong>
                {n}
                <span>↗</span>
              </strong>
              <p>{t}</p>
            </div>
          ))}
        </section>
        <section
          className={styles.wardrobe}
          aria-labelledby="wardrobe-heading"
          style={{ "--look-color": look.color } as React.CSSProperties}
        >
          <div className={styles.wardrobeTop}>
            <span>ОДИН ТЫ. МНОГО ВОЗМОЖНОСТЕЙ.</span>
            <span>01 — 08 / ВЫБЕРИ НАСТРОЕНИЕ</span>
          </div>
          <div className={styles.wardrobeBody}>
            <div className={styles.wardrobeCopy}>
              <h2 id="wardrobe-heading">
                Сегодня ты
                <br />
                можешь <em>по-разному.</em>
              </h2>
              <div className={styles.lookStory} aria-live="polite">
                <h3>{look.title}</h3>
                <p>{look.text}</p>
              </div>
              <Link href="/app" className={styles.darkCta}>
                Найти своё действие <span>↗</span>
              </Link>
            </div>
            <div className={styles.lookStage}>
              <span className={styles.lookNumber} aria-hidden>
                {String(lookIndex + 1).padStart(2, "0")}
              </span>
              <Outfit
                key={look.id}
                name={look.id}
                className={styles.lookModel}
              />
              <span className={styles.lookStamp}>
                SAME YOU.
                <br />
                NEW ENERGY.
              </span>
            </div>
          </div>
          <div
            className={styles.lookPicker}
            role="group"
            aria-label="Образы маскота"
          >
            {LOOKS.map((item, i) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={i === lookIndex}
                onClick={() => setLookIndex(i)}
              >
                <Outfit name={item.id} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </section>
        <section id="how" className={styles.section}>
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.eyebrow}>
                01 / ВСЁ ПРОЩЕ, ЧЕМ КАЖЕТСЯ
              </span>
              <h2>
                Не новый план.
                <br />
                <span>Новый маленький шаг.</span>
              </h2>
            </div>
            <div className={styles.guideNote}>
              <Mascot pose="guide" />
              <p>
                Я рядом. Давай начнём
                <br />с чего-нибудь небольшого.
              </p>
            </div>
          </div>
          <div className={styles.steps}>
            {[
              {
                n: "01",
                icon: "heart" as YgIconName,
                title: "Как ты сегодня?",
                text: "Выбери уровень энергии и свободное время. Можно честно: «сил немного».",
              },
              {
                n: "02",
                icon: "cards" as YgIconName,
                title: "Найди своё действие",
                text: "Листай колоду. Бери то, что откликается, остальное оставь на потом.",
              },
              {
                n: "03",
                icon: "check" as YgIconName,
                title: "Сделай. И порадуйся.",
                text: "Закрой действие, получи опыт и посмотри, как растёт твой прогресс.",
              },
            ].map((s) => (
              <article key={s.n}>
                <div className={styles.stepTop}>
                  <span className={styles.stepIcon}>
                    <YgIcon name={s.icon} className="h-[25px] w-[25px]" />
                  </span>
                  <span>{s.n}</span>
                </div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <Outfit
                  name={
                    s.n === "01"
                      ? "black-tee"
                      : s.n === "02"
                        ? "campus"
                        : "sport-win"
                  }
                  className={styles.stepOutfit}
                />
              </article>
            ))}
          </div>
        </section>
        <section
          className={`${styles.section} ${styles.lifeSection}`}
          aria-labelledby="life-heading"
        >
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.eyebrow}>ЗА ПРЕДЕЛАМИ ЭКРАНА</span>
              <h2 id="life-heading">
                Больше жизни.
                <br />
                <span>В маленьких моментах.</span>
              </h2>
            </div>
            <p>
              Прогресс — это не только цифры.
              <br />
              Это время, которое ты выбираешь для себя.
            </p>
          </div>
          <div className={styles.lifeGrid}>
            {[
              {
                image: "walk",
                title: "Выйти. Вдохнуть. Перезагрузиться.",
                detail: "15 минут на свежем воздухе",
                tag: "ДЛЯ ТЕЛА",
                alt: "Прогулка по парку с видом на горы",
              },
              {
                image: "read",
                title: "Ещё одна глава для себя.",
                detail: "10 страниц без спешки",
                tag: "ДЛЯ УМА",
                alt: "Чтение книги у окна кафе в тёплом солнечном свете",
              },
              {
                image: "plan",
                title: "Освободить место в голове.",
                detail: "5 минут на свои планы",
                tag: "ДЛЯ УМА",
                alt: "Планирование в блокноте у окна",
              },
            ].map((item) => (
              <article className={styles.lifeCard} key={item.image}>
                <Image
                  src={`/landing/life-${item.image}.webp`}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 700px) 100vw, 550px"
                />
                <Outfit
                  name={
                    item.image === "walk"
                      ? "hiking"
                      : item.image === "read"
                        ? "campus"
                        : "smart-casual"
                  }
                  className={styles.lifeOutfit}
                />
                <span className={styles.lifeTag}>{item.tag}</span>
                <div className={styles.lifeCaption}>
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                </div>
              </article>
            ))}
          </div>
          <div className={styles.lifeNote}>
            <span className={styles.mascotAvatar}>
              <Mascot />
            </span>
            <p>Не обязательно успеть всё. Выбери один момент для себя.</p>
          </div>
        </section>
        <section id="product" className={styles.section}>
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.eyebrow}>02 / СОБРАНО ВОКРУГ ТЕБЯ</span>
              <h2>
                Жизнь — не чек-лист.
                <br />
                <span>Прокачивай то, что важно.</span>
              </h2>
            </div>
            <Link href="/app" className={styles.textLink}>
              Заглянуть внутрь <span>↗</span>
            </Link>
          </div>
          <div className={styles.bento}>
            <article className={styles.characterCard}>
              <div>
                <span className={styles.tag}>ТВОЙ ПЕРСОНАЖ</span>
                <h3>
                  Растёшь ты.
                  <br />
                  Растёт твой герой.
                </h3>
                <p>
                  Сила, интеллект, капитал, стабильность и здоровье. Каждое
                  действие делает тебя чуть сильнее.
                </p>
                <div className={styles.statPills}>
                  <span>↗ Сила</span>
                  <span>✳ Интеллект</span>
                  <span>♡ Здоровье</span>
                </div>
              </div>
              <div className={styles.characterArt}>
                <span className={styles.characterHalo} />
                <Image
                  src="/characters/fit.webp"
                  alt="Персонаж YeahGrind, который растёт вместе с твоим прогрессом"
                  width={300}
                  height={400}
                />
                <span className={styles.level}>
                  УРОВЕНЬ 12 <b>↗</b>
                </span>
              </div>
            </article>
            <article className={styles.calendarCard}>
              <span className={styles.tag}>ТВОЙ РИТМ</span>
              <h3>Прогресс, который видно.</h3>
              <p>
                Каждый зелёный день — маленькое обещание себе, которое ты
                сдержал.
              </p>
              <div className={styles.weekLabels}>
                {["П", "В", "С", "Ч", "П", "С", "В"].map((d, i) => (
                  <span key={i}>{d}</span>
                ))}
              </div>
              <div
                className={styles.calendar}
                aria-label="Пример календаря активности"
              >
                {Array.from({ length: 28 }, (_, i) => (
                  <span
                    key={i}
                    className={
                      i < 24 && ![3, 8, 16].includes(i)
                        ? styles.filledDay
                        : undefined
                    }
                  >
                    {i === 23 ? "✓" : i + 1}
                  </span>
                ))}
              </div>
              <div className={styles.calendarCaption}>
                <Mascot className={styles.calendarMascot} pose="win" /> Не
                идеально. Зато регулярно.
              </div>
            </article>
          </div>
          <div className={styles.features}>
            {features.map((f) => (
              <article key={f.title}>
                <span className={styles.featureIcon}>
                  <YgIcon name={f.icon} className="h-[23px] w-[23px]" />
                </span>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </article>
            ))}
          </div>
        </section>
        <section
          id="about"
          className={`${styles.about} ${styles.founderSection}`}
        >
          <div className={styles.founderPhotos}>
            <figure className={styles.founderPortrait}>
              <Image
                src="/landing/founder-fisheye.jpg"
                alt="Аят, основатель YeahGrind, на выставке — фото через фишай"
                fill
                sizes="(max-width: 700px) 85vw, 420px"
              />
              <figcaption>
                <span className={styles.liveDot} /> ЧЕЛОВЕК ЗА YEAHGRIND
              </figcaption>
            </figure>
            <figure className={styles.founderSnapshot}>
              <Image
                src="/landing/founder-event-v2.jpg"
                alt="Аят у геометрической инсталляции на выставке"
                fill
                sizes="180px"
              />
              <figcaption>из жизни, не из стока ↗</figcaption>
            </figure>
          </div>
          <div className={styles.founderStory}>
            <div>
              <span className={styles.eyebrow}>03 / СДЕЛАНО С ЗАБОТОЙ</span>
              <h2>
                «Мне не нужен был ещё
                <br />
                один список того,
                <br />
                <span>что я не успел».</span>
              </h2>
            </div>
            <div>
              <p>
                Привет, я Аят — разработчик из Казахстана. Я создал YeahGrind,
                потому что длинные списки задач отнимали больше сил, чем давали.
              </p>
              <p>
                Мне хотелось открыть приложение и увидеть одно посильное дело.
                Без чувства вины и гонки за идеальной версией себя. Теперь этот
                инструмент есть и у тебя.
              </p>
              <a
                href="https://yeahayat.dev"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.author}
              >
                <Image
                  className={styles.authorAvatar}
                  src="/landing/founder-avatar.jpg"
                  alt=""
                  width={44}
                  height={44}
                />
                <div>
                  <strong>Аят Балмагамбетов</strong>
                  <small>Создатель YeahGrind</small>
                </div>
                <b>↗</b>
              </a>
            </div>
          </div>
        </section>
        <section className={`${styles.section} ${styles.faq}`}>
          <div>
            <span className={styles.eyebrow}>ЕЩЁ ПАРА МОМЕНТОВ</span>
            <h2>
              Хорошие вопросы.
              <br />
              <span>Простые ответы.</span>
            </h2>
            <div className={styles.faqMascot}>
              <Outfit name="smart-casual" />
              <span>
                Спрашивай.
                <br />
                Всё расскажем.
              </span>
            </div>
            <a
              href="mailto:balmagambet.ayat@gmail.com"
              className={styles.textLink}
            >
              Задать свой вопрос ↗
            </a>
          </div>
          <div className={styles.questions}>
            {faq.map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q}
                  <span>+</span>
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
        <section className={`${styles.finalCta} ${styles.mascotCta}`}>
          <div className={styles.mascotWelcome}>
            <span className={styles.mascotBubble}>
              Я тоже начинал с одного шага.
            </span>
            <Image
              src="/landing/looks/sport-win.webp"
              alt="Маскот YeahGrind радуется маленькой победе и показывает большой палец"
              width={360}
              height={540}
              sizes="(max-width: 700px) 230px, 320px"
            />
            <span className={styles.mascotCaption}>АЯТ, ТОЛЬКО НЕМНОГО 3D</span>
          </div>
          <div className={styles.mascotCtaCopy}>
            <span className={styles.eyebrow}>
              <span className={styles.liveDot} /> ТВОЙ СЛЕДУЮЩИЙ ШАГ
            </span>
            <h2>
              Не с понедельника.
              <br />
              <span>С одного действия.</span>
            </h2>
            <p>Пять минут сегодня — уже начало чего-то большего.</p>
            <Link href="/app" className={styles.primary}>
              Начать бесплатно <span>↗</span>
            </Link>
            <small>В твоём темпе. На твоих условиях.</small>
          </div>
          <span className={styles.finalStar} aria-hidden>
            ✳
          </span>
        </section>
      </main>
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <Link href="/" className={styles.brand}>
            <Image src="/logo-white.webp" alt="" width={28} height={26} />
            yeahgrind<span>®</span>
          </Link>
          <p className={styles.footerMascot}>
            <span className={styles.mascotAvatar}>
              <Mascot />
            </span>
            Становись лучше. Оставайся собой.
          </p>
          <a href="#top" aria-label="Наверх">
            ↑
          </a>
        </div>
        <div className={styles.footerBottom}>
          <span>© {new Date().getFullYear()} YeahGrind</span>
          <LanguageSwitcher />
          <nav aria-label="Юридическая информация">
            <Link href="/privacy">Конфиденциальность</Link>
            <Link href="/terms">Условия</Link>
          </nav>
          <span>Сделано в Казахстане ↗</span>
        </div>
      </footer>
      <CookieConsent />
    </div>
  );
}
