import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import Logo from "@/components/Logo";
import StandaloneRedirect from "@/components/StandaloneRedirect";
import LandingDemo from "@/components/LandingDemo";
import SiteNav from "@/components/SiteNav";
import Reveal, { RevealGroup, RevealItem } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "YeahDays — одно действие в день",
  description:
    "Не список задач, а ежедневная колода действий под твоё состояние. Свайпнул — сделал — день засчитан.",
  openGraph: {
    title: "YeahDays — одно действие в день",
    description:
      "Не список задач, а ежедневная колода действий под твоё состояние.",
    type: "website",
  },
};

/**
 * Лендинг — одна страница.
 *
 * Многостраничный сайт для продукта такого размера вредит: каждый переход
 * — это шанс уйти. Здесь всё в одном потоке, навигация ведёт по якорям.
 * Отдельным адресом остаётся только политика: у правового документа
 * должен быть постоянный URL, на него ссылаются сторы и Google.
 *
 * Серверный компонент: статика и нулевой JS для отрисовки. Интерактив
 * живёт в двух островках — демо и появление блоков при скролле.
 */

const NUMBERS = [
  { k: "176", t: "действий в колоде", d: "Девять направлений — от спорта до финансов" },
  { k: "12", t: "лестниц навыков", d: "Ступени открываются по мере освоения" },
  { k: "2", t: "заморозки в месяц", d: "Стрик не рушится от одного пропуска" },
  { k: "0 ₸", t: "стоимость", d: "Бесплатно и без регистрации" },
];

const STEPS = [
  {
    n: "01",
    title: "Скажи, как ты сегодня",
    text: "Два касания: сколько сил и сколько минут есть. Утром колода мягче, вечером допускает тяжёлое — потому что энергия у людей не постоянна за день.",
  },
  {
    n: "02",
    title: "Свайпни то, что берёшь",
    text: "Вправо — беру, влево — не сейчас. Каждый свайп меняет завтрашнюю подборку: движок запоминает, что ты доводишь до конца, а что игнорируешь.",
  },
  {
    n: "03",
    title: "Сделай — и только потом дальше",
    text: "Пока взятое не закрыто, новых карточек не будет, и идёт таймер. Это главное правило: взял — сделай, иначе снова получается список из десяти «когда-нибудь».",
  },
];

const FEATURES = [
  {
    icon: "🎴",
    title: "Колода вместо списка",
    text: "176 действий подбираются по пяти сигналам: приоритеты, время суток, бюджет минут, история и свежесть. Каждая карточка объясняет, почему показана именно она.",
  },
  {
    icon: "🪜",
    title: "Лестницы навыков",
    text: "20 отжиманий → 35 → 50. Следующая ступень открывается, когда закрыл текущую три раза. Не показываем «50» тому, кто не осилил 20, и не гоняем вечно лёгкое.",
  },
  {
    icon: "📈",
    title: "Сложность едет сама",
    text: "Стабильно закрываешь взятое — планка растёт. Систематически сливаешь — снижается. Никаких настроек: всё по реальному поведению, а не по самооценке.",
  },
  {
    icon: "🧊",
    title: "Заморозка стрика",
    text: "Две в месяц, тратятся автоматически и только когда серия реально была. Один сорванный день не должен обнулять месяц работы.",
  },
  {
    icon: "🎯",
    title: "Цели с дедлайном",
    text: "«20 действий на силу за месяц». Чем ближе срок и больше отставание, тем настойчивее колода подкидывает нужное. И честно говорит, сколько нужно в день.",
  },
  {
    icon: "🔥",
    title: "Челленджи с уровнями дня",
    text: "Ежедневные обязательства со своими порогами: взял минимум — день жёлтый, норму — зелёный. В календаре виден весь месяц одним взглядом.",
  },
  {
    icon: "✅",
    title: "Полноценный список задач",
    text: "Приоритеты, подзадачи, заметки, повторы по будням и выходным, перенос на завтра, отмена удаления. Просроченное само подтягивается в сегодня.",
  },
  {
    icon: "🕘",
    title: "Почасовое расписание",
    text: "Колода отвечает «что сделать», расписание — «когда именно». Без привязки ко времени намерение так и остаётся намерением.",
  },
  {
    icon: "🔔",
    title: "Умные напоминания",
    text: "Два раза в день по твоему часовому поясу. Вечернее время подстраивается под час, когда ты реально закрываешь дела. Закрыл норму — не потревожим.",
  },
  {
    icon: "📱",
    title: "Работает офлайн",
    text: "Ставится на телефон как приложение. Без сети всё работает, а действия отправятся, когда связь вернётся — ничего не теряется.",
  },
  {
    icon: "🔄",
    title: "Синхронизация устройств",
    text: "Вошёл — прогресс появится везде. Начал на телефоне, продолжил на ноутбуке. Без входа данные не покидают браузер.",
  },
  {
    icon: "🧍",
    title: "Персонаж растёт с тобой",
    text: "Четыре характеристики качаются от того, что ты реально закрываешь. Прогресс видно, а не только в цифрах на экране.",
  },
];

const BELIEFS = [
  {
    t: "Маленький шаг лучше идеального плана",
    d: "Два действия в день, которые ты правда делаешь, обгоняют двадцать запланированных.",
  },
  {
    t: "Приложение не должно давить виной",
    d: "Пропустил день — бывает. Поэтому стрик не рушится с первого раза.",
  },
  {
    t: "Честные цифры вместо ободрений",
    d: "Отстаёшь от цели — скажем, сколько нужно в день, а не «ты молодец».",
  },
  {
    t: "Твои данные — твои",
    d: "Выгрузить и удалить всё можно самому, двумя кнопками, без переписки с поддержкой.",
  },
];

const FAQ = [
  {
    q: "Это платно?",
    a: "Нет. Пользоваться можно бесплатно и без регистрации — данные тогда лежат только в твоём браузере.",
  },
  {
    q: "Зачем тогда вход?",
    a: "Чтобы прогресс жил на всех устройствах и не пропал при очистке браузера. Вход через Google, запрашиваем только имя, почту и аватар.",
  },
  {
    q: "Чем это отличается от обычного тудушника?",
    a: "Тудушник хранит то, что ты в него записал. YeahDays сам предлагает, что делать сегодня, под твоё состояние — и не даёт набрать десять дел, пока не закрыто текущее. Список задач при этом тоже есть.",
  },
  {
    q: "Что если я пропущу день?",
    a: "Ничего страшного. Есть две заморозки в месяц — они тратятся сами, когда серия под угрозой.",
  },
  {
    q: "Можно добавлять своё?",
    a: "Да: свои задачи, свои челленджи с любыми порогами, почасовое расписание. Ненужные направления и отдельные действия можно скрыть.",
  },
  {
    q: "Нужно ли что-то устанавливать?",
    a: "Нет, работает в браузере. Но можно поставить на домашний экран — тогда откроется как обычное приложение и будет работать офлайн.",
  },
];

const SHOTS = [
  { src: "/shots/deck.png", cap: "Колода — свайпни то, что берёшь" },
  { src: "/shots/today.png", cap: "День — челленджи, задачи, расписание" },
  { src: "/shots/progress.png", cap: "Прогресс — характеристики и стрик" },
];

function Cta({ children }: { children: React.ReactNode }) {
  return (
    <Link
      href="/app"
      className="press inline-flex h-14 items-center justify-center rounded-2xl bg-[var(--color-fg)] px-8 text-[16px] font-bold text-[var(--color-bg)] shadow-[var(--shadow-2)]"
    >
      {children}
    </Link>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
      {children}
    </p>
  );
}

export default function LandingPage() {
  return (
    <>
      <StandaloneRedirect />
      <SiteNav />

      <main className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* ─────────────  Первый экран  ───────────── */}
        <section
          id="top"
          className="grid scroll-mt-24 items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16"
        >
          <Reveal>
            <Eyebrow>Трекер, который не давит</Eyebrow>
            <h1 className="mt-5 text-[42px] font-extrabold leading-[1.03] sm:text-[58px] lg:text-[64px]">
              Одно действие
              <br />в день
            </h1>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-[var(--color-fg-dim)] sm:text-[19px]">
              Списки задач копят вину: чем длиннее, тем меньше хочется их
              открывать. YeahDays каждый день предлагает колоду действий под
              твоё состояние. Свайпнул — сделал — день засчитан.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Cta>Попробовать</Cta>
              <span className="text-[13px] text-[var(--color-muted)]">
                Бесплатно · без регистрации
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="relative">
            <div
              className="glow-spot left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2"
              style={{ background: "rgba(149,132,255,0.30)" }}
              aria-hidden
            />
            <LandingDemo />
          </Reveal>
        </section>

        {/* ─────────────  Цифры  ───────────── */}
        <RevealGroup className="grid gap-4 border-t border-[var(--color-border)] py-14 sm:grid-cols-2 lg:grid-cols-4">
          {NUMBERS.map((n) => (
            <RevealItem key={n.t} className="marble rounded-3xl p-5">
              <p className="num text-[40px] font-extrabold leading-none">
                {n.k}
              </p>
              <p className="mt-2.5 text-[14.5px] font-bold">{n.t}</p>
              <p className="mt-1.5 text-[13px] leading-snug text-[var(--color-fg-dim)]">
                {n.d}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* ─────────────  О продукте  ───────────── */}
        <section
          id="product"
          className="scroll-mt-24 border-t border-[var(--color-border)] py-16 sm:py-20"
        >
          <Reveal>
            <Eyebrow>О продукте</Eyebrow>
            <h2 className="mt-4 max-w-3xl text-[32px] font-extrabold leading-[1.1] sm:text-[42px]">
              Приложение решает за тебя,{" "}
              <span className="text-[var(--color-fg-dim)]">
                что делать сегодня
              </span>
            </h2>
            <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-[var(--color-fg-dim)]">
              Обычный трекер — это хранилище: ты сам придумал задачи, сам их
              записал, сам про них забыл. YeahDays устроен наоборот. Он знает
              176 полезных действий и каждый день собирает из них небольшую
              колоду именно под тебя: под твои приоритеты, под время суток,
              под то, сколько у тебя сейчас сил и минут.
            </p>
          </Reveal>

          <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-3">
            {STEPS.map((s) => (
              <RevealItem key={s.n} className="marble rounded-3xl p-6">
                <p className="num text-[13px] font-bold text-[var(--color-muted)]">
                  {s.n}
                </p>
                <p className="mt-3 text-[19px] font-bold leading-snug">
                  {s.title}
                </p>
                <p className="mt-2.5 text-[14px] leading-relaxed text-[var(--color-fg-dim)]">
                  {s.text}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal className="mt-16">
            <h3 className="text-[24px] font-extrabold sm:text-[30px]">
              Как выглядит
            </h3>
            <p className="mt-3 max-w-2xl text-[14.5px] leading-relaxed text-[var(--color-fg-dim)]">
              Настоящие экраны приложения — без мокапов и приукрашивания.
            </p>
          </Reveal>
          <RevealGroup className="mt-8 grid gap-8 sm:grid-cols-3">
            {SHOTS.map((s) => (
              <RevealItem key={s.src}>
                <div className="marble overflow-hidden rounded-[28px] p-1.5">
                  <Image
                    src={s.src}
                    alt={s.cap}
                    width={560}
                    height={1212}
                    className="h-auto w-full rounded-[22px]"
                    sizes="(min-width: 640px) 300px, 90vw"
                  />
                </div>
                <p className="mt-3 text-[13px] text-[var(--color-muted)]">
                  {s.cap}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal className="mt-16">
            <h3 className="text-[24px] font-extrabold sm:text-[30px]">
              Что внутри
            </h3>
          </Reveal>
          <RevealGroup className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <RevealItem key={f.title} className="marble rounded-3xl p-5">
                <span className="text-[22px]" aria-hidden>
                  {f.icon}
                </span>
                <p className="mt-3 text-[15.5px] font-bold leading-snug">
                  {f.title}
                </p>
                <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--color-fg-dim)]">
                  {f.text}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>
        </section>

        {/* ─────────────  Обо мне  ───────────── */}
        <section
          id="about"
          className="scroll-mt-24 border-t border-[var(--color-border)] py-16 sm:py-20"
        >
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <Eyebrow>Обо мне</Eyebrow>
              <h2 className="mt-4 text-[32px] font-extrabold leading-[1.1] sm:text-[40px]">
                Я делаю YeahDays
                <br />
                <span className="text-[var(--color-fg-dim)]">
                  для себя в первую очередь
                </span>
              </h2>
              <div className="mt-6 space-y-5 text-[15.5px] leading-relaxed text-[var(--color-fg-dim)]">
                <p>
                  Меня зовут Аят, я разработчик. YeahDays появился из личной
                  проблемы: списки задач у меня не работали. Чем длиннее
                  становился список, тем меньше хотелось его открывать — он
                  превращался в напоминание о том, чего я не сделал.
                </p>
                <p>
                  Мне не нужен был ещё один органайзер. Нужно было что-то, что
                  само скажет: «вот одно дело, оно занимает пятнадцать минут,
                  сил у тебя хватит — сделай». Не двадцать дел. Одно.
                </p>
                <p>
                  Приложение сделано на Next.js и TypeScript, с Postgres для
                  синхронизации, входом через Google и веб-пушами. Подборку
                  считает собственный движок. Внешней аналитики и рекламы
                  внутри нет.
                </p>
              </div>
              <a
                href="mailto:balmagambet.ayat@gmail.com"
                className="press mt-7 inline-flex h-12 items-center rounded-2xl border border-[var(--color-border-strong)] px-5 text-[14px] font-semibold"
              >
                Написать мне
              </a>
            </Reveal>

            <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:content-start">
              {BELIEFS.map((b) => (
                <RevealItem key={b.t} className="marble rounded-3xl p-5">
                  <p className="text-[15.5px] font-bold leading-snug">{b.t}</p>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--color-fg-dim)]">
                    {b.d}
                  </p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>

        {/* ─────────────  Вопросы  ───────────── */}
        <section className="border-t border-[var(--color-border)] py-16 sm:py-20">
          <Reveal>
            <Eyebrow>Вопросы</Eyebrow>
            <h2 className="mt-4 text-[32px] font-extrabold sm:text-[40px]">
              Частое
            </h2>
          </Reveal>
          <RevealGroup className="mt-8 grid gap-4 lg:grid-cols-2">
            {FAQ.map((f) => (
              <RevealItem key={f.q} className="marble rounded-3xl p-5">
                <p className="text-[15.5px] font-bold">{f.q}</p>
                <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--color-fg-dim)]">
                  {f.a}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>
        </section>

        {/* ─────────────  Данные  ───────────── */}
        <section className="border-t border-[var(--color-border)] py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <Reveal>
              <Eyebrow>Приватность</Eyebrow>
              <h2 className="mt-4 text-[30px] font-extrabold sm:text-[38px]">
                Твои данные — твои
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-[var(--color-fg-dim)]">
                Мы не продаём их и не передаём рекламодателям, не используем
                трекеры и пиксели соцсетей.
              </p>
              <Link
                href="/privacy"
                className="press mt-6 inline-flex h-11 items-center rounded-xl border border-[var(--color-border-strong)] px-5 text-[13.5px] font-semibold"
              >
                Политика конфиденциальности
              </Link>
            </Reveal>

            <RevealGroup className="space-y-3">
              {[
                "Без входа всё лежит только в твоём браузере.",
                "Войдёшь — прогресс появится на всех устройствах.",
                "Выгрузка всех данных одним файлом.",
                "Удаление аккаунта без следа и без переписки с поддержкой.",
              ].map((t) => (
                <RevealItem
                  key={t}
                  className="marble flex items-start gap-3.5 rounded-2xl p-4"
                >
                  <span
                    className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--color-stability)]"
                    aria-hidden
                  />
                  <span className="text-[14.5px] leading-relaxed text-[var(--color-fg-dim)]">
                    {t}
                  </span>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>

        {/* ─────────────  Финал  ───────────── */}
        <section className="relative border-t border-[var(--color-border)] py-20 text-center sm:py-28">
          <div
            className="glow-spot left-1/2 top-1/2 h-[380px] w-[600px] -translate-x-1/2 -translate-y-1/2"
            style={{ background: "rgba(70,203,164,0.16)" }}
            aria-hidden
          />
          <Reveal>
            <h2 className="mx-auto max-w-2xl text-[34px] font-extrabold leading-[1.1] sm:text-[46px]">
              Начни с одного действия.
              <br />
              Сегодня.
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-[16px] leading-relaxed text-[var(--color-fg-dim)]">
              Установи как приложение на телефон — работает офлайн и
              открывается с домашнего экрана.
            </p>
            <div className="mt-9">
              <Cta>Попробовать</Cta>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="border-t border-[var(--color-border)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex items-center gap-2.5 opacity-70">
            <Logo variant="white" className="h-5 w-auto" />
            <span className="text-[13px] text-[var(--color-muted)]">
              Одно действие в день
            </span>
          </div>
          <nav className="flex flex-wrap gap-6 text-[13.5px] text-[var(--color-muted)]">
            <Link href="/app" className="transition hover:text-[var(--color-fg)]">
              Приложение
            </Link>
            <a href="#product" className="transition hover:text-[var(--color-fg)]">
              О продукте
            </a>
            <Link href="/terms" className="transition hover:text-[var(--color-fg)]">
              Условия
            </Link>
            <Link
              href="/privacy"
              className="transition hover:text-[var(--color-fg)]"
            >
              Конфиденциальность
            </Link>
          </nav>
        </div>
      </footer>
    </>
  );
}
