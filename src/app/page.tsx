import Link from "next/link";
import type { Metadata } from "next";
import Logo from "@/components/Logo";
import StandaloneRedirect from "@/components/StandaloneRedirect";

export const metadata: Metadata = {
  title: "YeahDays — одно действие в день",
  description:
    "Не список задач, а ежедневная подборка действий под твоё состояние. Свайпни то, что берёшь на сегодня — и смотри, как растёт персонаж.",
};

/**
 * Лендинг — витрина продукта.
 *
 * Живёт на «/», само приложение на «/app». Установка PWA от этого не
 * страдает: scope манифеста остался «/», поэтому предложить установку
 * можно с любой страницы, а start_url ведёт в «/app» — с домашнего
 * экрана человек попадает сразу в приложение и лендинг больше не видит.
 *
 * Серверный компонент: страница статическая, ей не нужен ни стор,
 * ни JS для отрисовки — быстрый первый экран и нормальная индексация.
 */

const STEPS = [
  {
    n: "01",
    title: "Скажи, как ты сегодня",
    text: "Два касания: сколько сил и сколько минут. Утром колода мягче, вечером — злее.",
  },
  {
    n: "02",
    title: "Свайпни то, что берёшь",
    text: "Вправо — беру, влево — не сейчас. Каждый свайп меняет завтрашнюю подборку.",
  },
  {
    n: "03",
    title: "Сделай — и только потом дальше",
    text: "Пока взятое не закрыто, новых карточек не будет. Взял — сделай.",
  },
];

const FEATURES = [
  {
    icon: "🎴",
    title: "Колода вместо списка",
    text: "176 действий, которые подбираются под цель, время суток и остаток сил — а не висят виной в бесконечном списке.",
  },
  {
    icon: "🪜",
    title: "Лестницы навыков",
    text: "20 отжиманий → 35 → 50. Следующая ступень открывается, когда освоена текущая. Виден рост, а не топтание.",
  },
  {
    icon: "🧊",
    title: "Стрик не рушится от одного дня",
    text: "Две заморозки в месяц тратятся сами, когда серия под угрозой. Сорвался раз — не повод бросать.",
  },
  {
    icon: "📅",
    title: "Свои задачи и расписание",
    text: "Обычный тудушник рядом: приоритеты, подзадачи, повторы, дедлайны — плюс почасовой план дня.",
  },
  {
    icon: "🔔",
    title: "Напоминания, а не спам",
    text: "Два раза в день по твоему времени. Вечернее подстраивается под час, когда ты реально что-то делаешь.",
  },
  {
    icon: "🧍",
    title: "Персонаж растёт с тобой",
    text: "Четыре характеристики качаются от того, что ты реально закрываешь. Прогресс видно, а не только в цифрах.",
  },
];

export default function LandingPage() {
  return (
    <>
      {/* Установленное приложение не должно упираться в витрину */}
      <StandaloneRedirect />

      <div className="flex flex-1 flex-col pb-10">
        {/* Шапка */}
        <header className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2.5">
            <Logo variant="white" className="h-7 w-auto" />
            <span className="text-[19px] font-extrabold tracking-tight">
              YeahDays
            </span>
          </div>
          <Link
            href="/app"
            className="press rounded-xl px-3 py-2 text-[13px] font-medium text-[var(--color-fg-dim)]"
          >
            Открыть
          </Link>
        </header>

        {/* Первый экран */}
        <section className="mt-10">
          <h1 className="text-[34px] font-extrabold leading-[1.08]">
            Одно действие в день
            <br />
            <span className="text-[var(--color-fg-dim)]">
              делает тебя лучшей версией себя
            </span>
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-[var(--color-fg-dim)]">
            Не список задач, который копит вину, а ежедневная колода действий
            под твоё состояние. Свайпнул — сделал — день засчитан.
          </p>

          <Link
            href="/app"
            className="press mt-7 flex h-13 w-full items-center justify-center rounded-2xl bg-[var(--color-fg)] py-4 text-[15px] font-bold text-[var(--color-bg)]"
          >
            Начать бесплатно
          </Link>
          <p className="mt-2.5 text-center text-[11.5px] text-[var(--color-muted)]">
            Без регистрации. Вход нужен только чтобы прогресс жил на всех
            устройствах.
          </p>
        </section>

        {/* Как это работает */}
        <section className="mt-14">
          <h2 className="text-[13px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">
            Как это работает
          </h2>
          <div className="mt-4 space-y-3">
            {STEPS.map((s) => (
              <div key={s.n} className="surface rounded-3xl p-4">
                <div className="flex items-start gap-3.5">
                  <span className="num text-[13px] font-bold text-[var(--color-muted)]">
                    {s.n}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[15px] font-bold">{s.title}</p>
                    <p className="mt-1 text-[13px] leading-snug text-[var(--color-fg-dim)]">
                      {s.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Что внутри */}
        <section className="mt-12">
          <h2 className="text-[13px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">
            Что внутри
          </h2>
          <div className="mt-4 space-y-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="surface rounded-3xl p-4">
                <div className="flex items-start gap-3.5">
                  <span className="text-[20px]" aria-hidden>
                    {f.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[14.5px] font-bold">{f.title}</p>
                    <p className="mt-1 text-[13px] leading-snug text-[var(--color-fg-dim)]">
                      {f.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Честный блок про данные — доверие важнее маркетинга */}
        <section className="mt-12">
          <div className="surface-raised rounded-3xl p-5">
            <h2 className="text-[15px] font-bold">Что с твоими данными</h2>
            <ul className="mt-3 space-y-2 text-[13px] leading-snug text-[var(--color-fg-dim)]">
              <li>— Без входа всё лежит только в твоём браузере.</li>
              <li>
                — Войдёшь — прогресс синхронизируется, чтобы был на всех
                устройствах.
              </li>
              <li>— Данные можно выгрузить или стереть в один клик.</li>
              <li>— Мы не продаём и не передаём их рекламодателям.</li>
            </ul>
            <div className="mt-4 flex gap-4 text-[12.5px]">
              <Link href="/terms" className="underline underline-offset-4">
                Условия
              </Link>
              <Link href="/privacy" className="underline underline-offset-4">
                Конфиденциальность
              </Link>
            </div>
          </div>
        </section>

        {/* Финальный призыв */}
        <section className="mt-12 text-center">
          <p className="text-[19px] font-bold leading-snug">
            Начни с одного действия.
            <br />
            Сегодня.
          </p>
          <Link
            href="/app"
            className="press mt-5 inline-flex h-12 items-center justify-center rounded-2xl bg-[var(--color-fg)] px-7 text-[15px] font-bold text-[var(--color-bg)]"
          >
            Открыть YeahDays
          </Link>
        </section>

        <footer className="mt-14 flex flex-col items-center gap-2 opacity-55">
          <Logo variant="white" className="h-4 w-auto" />
          <p className="text-[11px] text-[var(--color-muted)]">
            Одно действие в день
          </p>
        </footer>
      </div>
    </>
  );
}
