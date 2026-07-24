import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import Logo from "@/components/Logo";
import StandaloneRedirect from "@/components/StandaloneRedirect";
import LandingDemo from "@/components/LandingDemo";

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
 * Лендинг — маркетинговая витрина, а не приложение в вебе.
 *
 * Живёт на «/», продукт на «/app». Оболочку выбирает Shell: здесь полная
 * ширина и никакой нижней навигации.
 *
 * Серверный компонент: статика, нулевой JS для отрисовки, быстрый первый
 * экран и нормальная индексация поисковиками.
 */

const STEPS = [
  {
    n: "01",
    title: "Скажи, как ты сегодня",
    text: "Два касания: сколько сил и сколько минут есть. Утром колода мягче, вечером допускает тяжёлое.",
  },
  {
    n: "02",
    title: "Свайпни то, что берёшь",
    text: "Вправо — беру, влево — не сейчас. Каждый свайп меняет завтрашнюю подборку.",
  },
  {
    n: "03",
    title: "Сделай — и только потом дальше",
    text: "Пока взятое не закрыто, новых карточек не будет. Никаких списков из десяти «когда-нибудь».",
  },
];

const NUMBERS = [
  {
    k: "176",
    title: "действий в колоде",
    text: "Подбираются под цель, время суток и остаток сил. Девять направлений — от спорта до финансов.",
  },
  {
    k: "12",
    title: "лестниц навыков",
    text: "20 отжиманий → 35 → 50. Следующая ступень открывается, когда освоена текущая. Виден рост, а не топтание.",
  },
  {
    k: "2",
    title: "заморозки стрика в месяц",
    text: "Тратятся сами, когда серия под угрозой. Один сорванный день больше не повод бросить всё.",
  },
];

const BLOCKS = [
  {
    title: "Движок, который подстраивается",
    text: "Подборка считается по пяти сигналам: приоритеты, время суток, бюджет минут, твоя история и свежесть. Стабильно закрываешь взятое — планка растёт сама. Сливаешь — снижается. Никаких настроек, всё по поведению.",
  },
  {
    title: "Задачи и расписание рядом",
    text: "Полноценный список дел: приоритеты, подзадачи, заметки, повторы по будням и выходным, перенос на завтра, отмена удаления. Плюс почасовой план дня — от подъёма до вечера.",
  },
  {
    title: "Челленджи с уровнями дня",
    text: "Ежедневные обязательства со своими порогами: дотянул до минимума — день жёлтый, взял норму — зелёный. В календаре месяц виден одним взглядом.",
  },
  {
    title: "Напоминания, а не спам",
    text: "Два раза в день по твоему часовому поясу. Вечернее время подстраивается под час, когда ты реально закрываешь дела. Закрыл норму — вечером не потревожим.",
  },
];

const SHOTS = [
  { src: "/shots/deck.png", cap: "Колода — свайпни то, что берёшь" },
  { src: "/shots/today.png", cap: "День — челленджи, задачи, расписание" },
  { src: "/shots/progress.png", cap: "Прогресс — характеристики и стрик" },
];

function Cta({
  children,
  variant = "primary",
}: {
  children: React.ReactNode;
  variant?: "primary" | "ghost";
}) {
  return (
    <Link
      href="/app"
      className={
        variant === "primary"
          ? "press inline-flex h-14 items-center justify-center rounded-2xl bg-[var(--color-fg)] px-8 text-[16px] font-bold text-[var(--color-bg)] shadow-[var(--shadow-2)]"
          : "press inline-flex h-11 items-center justify-center rounded-xl border border-[var(--color-border-strong)] px-5 text-[14px] font-semibold"
      }
    >
      {children}
    </Link>
  );
}

export default function LandingPage() {
  return (
    <>
      <StandaloneRedirect />

      {/* ── Шапка ── */}
      <header className="sticky top-0 z-30">
        <div className="liquid-bar border-b border-[var(--color-border)]">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
            <div className="flex items-center gap-2.5">
              <Logo variant="white" className="h-7 w-auto" />
              <span className="text-[18px] font-extrabold tracking-tight">
                YeahDays
              </span>
            </div>
            <Cta variant="ghost">Попробовать</Cta>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* ── Первый экран ── */}
        <section className="grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
              Трекер, который не давит
            </p>
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
          </div>

          {/* Живое демо вместо картинки: показать, как ОЩУЩАЕТСЯ,
              важнее, чем показать, как выглядит */}
          <div className="relative">
            <div
              className="glow-spot left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2"
              style={{ background: "rgba(149,132,255,0.30)" }}
              aria-hidden
            />
            <LandingDemo />
          </div>
        </section>

        {/* ── Цифры ── */}
        <section className="grid gap-8 border-t border-[var(--color-border)] py-14 sm:grid-cols-3 sm:py-16">
          {NUMBERS.map((f) => (
            <div key={f.title}>
              <p className="num text-[44px] font-extrabold leading-none sm:text-[52px]">
                {f.k}
              </p>
              <p className="mt-2 text-[15px] font-bold">{f.title}</p>
              <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-[var(--color-fg-dim)]">
                {f.text}
              </p>
            </div>
          ))}
        </section>

        {/* ── Как это работает ── */}
        <section className="border-t border-[var(--color-border)] py-16 sm:py-20">
          <h2 className="text-[30px] font-extrabold sm:text-[38px]">
            Как это работает
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="liquid rounded-3xl p-5">
                <p className="num text-[13px] font-bold text-[var(--color-muted)]">
                  {s.n}
                </p>
                <p className="mt-3 text-[19px] font-bold leading-snug">
                  {s.title}
                </p>
                <p className="mt-2.5 text-[14.5px] leading-relaxed text-[var(--color-fg-dim)]">
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Экраны ── */}
        <section className="border-t border-[var(--color-border)] py-16 sm:py-20">
          <h2 className="text-[30px] font-extrabold sm:text-[38px]">
            Как выглядит
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[var(--color-fg-dim)]">
            Настоящие экраны приложения — без мокапов и приукрашивания.
          </p>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {SHOTS.map((s) => (
              <figure key={s.src}>
                <div className="liquid overflow-hidden rounded-[28px] p-1.5">
                  <Image
                    src={s.src}
                    alt={s.cap}
                    width={560}
                    height={1212}
                    className="h-auto w-full rounded-[22px]"
                    sizes="(min-width: 640px) 300px, 90vw"
                  />
                </div>
                <figcaption className="mt-3 text-[13.5px] text-[var(--color-muted)]">
                  {s.cap}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* ── Что внутри ── */}
        <section className="border-t border-[var(--color-border)] py-16 sm:py-20">
          <h2 className="text-[30px] font-extrabold sm:text-[38px]">
            Что внутри
          </h2>
          <div className="mt-10 grid gap-10 sm:grid-cols-2 sm:gap-x-14 sm:gap-y-12">
            {BLOCKS.map((b) => (
              <div key={b.title} className="liquid rounded-3xl p-6">
                <h3 className="text-[20px] font-bold leading-snug">
                  {b.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[var(--color-fg-dim)]">
                  {b.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Данные ── */}
        <section className="border-t border-[var(--color-border)] py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <h2 className="text-[30px] font-extrabold sm:text-[38px]">
                Твои данные — твои
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-[var(--color-fg-dim)]">
                Мы не продаём их и не передаём рекламодателям. Забрать копию
                или стереть всё можно самому, двумя кнопками в профиле.
              </p>
            </div>
            <ul className="space-y-4">
              {[
                "Без входа всё лежит только в твоём браузере.",
                "Войдёшь — прогресс появится на всех устройствах.",
                "Выгрузка всех данных одним файлом.",
                "Удаление аккаунта без следа и без переписки с поддержкой.",
              ].map((t) => (
                <li key={t} className="flex gap-3.5">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-stability)]"
                    aria-hidden
                  />
                  <span className="text-[15px] leading-relaxed text-[var(--color-fg-dim)]">
                    {t}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Финальный призыв ── */}
        <section className="relative border-t border-[var(--color-border)] py-20 text-center sm:py-28">
          <div
            className="glow-spot left-1/2 top-1/2 h-[380px] w-[600px] -translate-x-1/2 -translate-y-1/2"
            style={{ background: "rgba(70,203,164,0.16)" }}
            aria-hidden
          />
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
        </section>
      </main>

      {/* ── Подвал ── */}
      <footer className="border-t border-[var(--color-border)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex items-center gap-2.5 opacity-70">
            <Logo variant="white" className="h-5 w-auto" />
            <span className="text-[13px] text-[var(--color-muted)]">
              Одно действие в день
            </span>
          </div>
          <nav className="flex gap-6 text-[13.5px] text-[var(--color-muted)]">
            <Link href="/app" className="transition hover:text-[var(--color-fg)]">
              Приложение
            </Link>
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
