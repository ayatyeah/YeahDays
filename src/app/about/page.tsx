import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Обо мне — YeahDays",
  description: "Кто делает YeahDays и зачем.",
};

/**
 * «Обо мне».
 *
 * Личная страница автора продукта. Для маленького продукта это не
 * формальность: люди охотнее доверяют сервису, за которым виден живой
 * человек, а не безликое «мы — команда энтузиастов».
 */
export default function AboutPage() {
  return (
    <>
    <SiteNav />
    <article className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
      <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
        Обо мне
      </p>
      <h1 className="mt-4 text-[34px] font-extrabold leading-[1.08] sm:text-[44px]">
        Я делаю YeahDays
        <br />
        <span className="text-[var(--color-fg-dim)]">для себя в первую очередь</span>
      </h1>

      <div className="mt-10 space-y-6 text-[16px] leading-relaxed text-[var(--color-fg-dim)]">
        <p>
          Меня зовут Аят. Я разработчик, и YeahDays появился из личной
          проблемы: списки задач у меня не работали. Чем длиннее становился
          список, тем меньше хотелось его открывать — он превращался в
          напоминание о том, чего я не сделал.
        </p>
        <p>
          Мне не нужен был ещё один органайзер. Нужно было что-то, что само
          скажет: «вот одно дело, оно занимает пятнадцать минут, сил у тебя
          хватит — сделай». Не двадцать дел. Одно.
        </p>
        <p>
          Так появилась колода. Каждый день приложение подбирает несколько
          действий под то, сколько у тебя сейчас сил и времени. Свайпнул
          вправо — взял. И пока не сделал, следующего не покажет: это
          принципиально, иначе снова получается список из «когда-нибудь».
        </p>
      </div>

      <h2 className="mt-14 text-[24px] font-extrabold sm:text-[30px]">
        Во что я верю
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {[
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
            d: "Если отстаёшь от цели — приложение скажет, сколько нужно в день, а не «ты молодец».",
          },
          {
            t: "Твои данные — твои",
            d: "Выгрузить и удалить всё можно самому, двумя кнопками, без переписки с поддержкой.",
          },
        ].map((x) => (
          <div key={x.t} className="liquid rounded-3xl p-5">
            <p className="text-[16px] font-bold leading-snug">{x.t}</p>
            <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-fg-dim)]">
              {x.d}
            </p>
          </div>
        ))}
      </div>

      <h2 className="mt-14 text-[24px] font-extrabold sm:text-[30px]">
        Как это сделано
      </h2>
      <p className="mt-5 text-[15px] leading-relaxed text-[var(--color-fg-dim)]">
        Next.js и TypeScript, Postgres для синхронизации между устройствами,
        вход через Google, веб-пуши для напоминаний. Приложение
        устанавливается на телефон и работает офлайн. Подборку считает
        собственный движок — по приоритетам, времени суток, бюджету минут,
        истории и свежести действия.
      </p>

      <div className="liquid mt-12 rounded-3xl p-6">
        <p className="text-[17px] font-bold">Напиши мне</p>
        <p className="mt-2 text-[14.5px] leading-relaxed text-[var(--color-fg-dim)]">
          Нашёл баг, есть идея или просто хочешь сказать, что зашло — буду
          рад. Отвечаю сам.
        </p>
        <a
          href="mailto:balmagambet.ayat@gmail.com"
          className="press mt-5 inline-flex h-12 items-center rounded-2xl bg-[var(--color-fg)] px-6 text-[14.5px] font-bold text-[var(--color-bg)]"
        >
          balmagambet.ayat@gmail.com
        </a>
      </div>

      <div className="mt-10 flex flex-wrap gap-5 text-[13.5px]">
        <Link href="/app" className="underline underline-offset-4">
          Открыть приложение
        </Link>
        <Link href="/privacy" className="underline underline-offset-4">
          Политика конфиденциальности
        </Link>
        <Link href="/terms" className="underline underline-offset-4">
          Условия
        </Link>
      </div>
    </article>
    </>
  );
}
