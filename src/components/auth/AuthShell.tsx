"use client";

import Image from "next/image";
import Link from "next/link";
import Logo from "@/components/Logo";
import { cn } from "@/lib/cn";

/**
 * Каркас экранов входа и регистрации — в том же стиле, что и лендинг:
 * тёмный фон, салатовый акцент, маскот. Слева (на широком экране) —
 * панель «зачем это всё» с маскотом, справа — карточка формы; на телефоне
 * панель сжимается в шапку над формой.
 *
 * Вход и регистрация — разные экраны с разным смыслом: вход — «с
 * возвращением», регистрация — «начни с одного действия». Переключатель
 * сверху карточки держит их рядом, чтобы не искать ссылку внизу.
 */

export type AuthMode = "login" | "register";

const PANEL: Record<AuthMode | "neutral", { eyebrow: string; title: string; accent: string; text: string; points: string[]; image: string; alt: string }> = {
  login: {
    eyebrow: "Маленькие шаги. Большие перемены.",
    title: "С возвращением.",
    accent: "Продолжим?",
    text: "Серия, план на сегодня и прогресс — на своих местах и ждут тебя.",
    points: ["Прогресс на всех устройствах", "Один сложный день не обнуляет серию", "Вход в одно нажатие через Google"],
    image: "/landing/looks/sport-wave.webp",
    alt: "Маскот YeahGrind машет рукой",
  },
  register: {
    eyebrow: "Маленькие шаги. Большие перемены.",
    title: "Начни с одного",
    accent: "действия.",
    text: "Пара полей — и YeahGrind предложит первое посильное дело. Без гонки за идеалом.",
    points: ["Бесплатно", "Без карты", "В твоём ритме"],
    image: "/landing/looks/campus.webp",
    alt: "Маскот YeahGrind с рюкзаком и учебником",
  },
  neutral: {
    eyebrow: "Маленькие шаги. Большие перемены.",
    title: "Почти",
    accent: "готово.",
    text: "Ещё шаг — и вернёшься к своему плану.",
    points: ["Данные остаются твоими", "Без лишних писем и спама"],
    image: "/landing/mascot-guide.webp",
    alt: "Маскот YeahGrind показывает на карточку с галочкой",
  },
};

export const authInput =
  "h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-[16px] text-[#f2f3ed] outline-none transition placeholder:text-[#a0a39c]/60 focus:border-[#d3f693]/70 focus:bg-white/[0.06] focus:ring-4 focus:ring-[#d3f693]/10";

export const authPrimary =
  "flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#d3f693] text-[16px] font-semibold text-[#10120f] transition hover:brightness-105 active:scale-[0.99] disabled:opacity-60";

export const authSecondary =
  "flex h-12 w-full items-center justify-center gap-2.5 rounded-2xl border border-white/12 bg-white/[0.03] px-3 text-center text-[15px] font-semibold text-[#f2f3ed] transition hover:bg-white/[0.07]";

/** Поле с подписью над ним: на телефоне подсказка-плейсхолдер исчезает при наборе, подпись — нет. */
export function AuthField({ label, hint, aside, children }: { label: string; hint?: string; aside?: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between gap-2 text-[13px] font-medium text-[#b4b8ae]">
        <span>{label}</span>
        {aside}
      </span>
      {children}
      {hint && <span className="mt-1 block text-[12px] text-[#a0a39c]">{hint}</span>}
    </label>
  );
}

export function AuthDivider({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-5 flex items-center gap-3 text-[13px] text-[#a0a39c]">
      <span className="h-px flex-1 bg-white/10" />
      {children}
      <span className="h-px flex-1 bg-white/10" />
    </div>
  );
}

export function AuthError({ children }: { children: React.ReactNode }) {
  return <p role="alert" className="rounded-2xl border border-red-400/30 bg-red-500/10 px-3.5 py-2.5 text-[14px] text-red-200">{children}</p>;
}

export function MicrosoftIcon() {
  return (
    <svg viewBox="0 0 21 21" className="h-[18px] w-[18px]" aria-hidden>
      <rect x="1" y="1" width="9" height="9" fill="#f25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
      <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
      <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
    </svg>
  );
}

export default function AuthShell({
  mode,
  title,
  subtitle,
  callbackUrl,
  tabs = true,
  children,
}: {
  mode: AuthMode | "neutral";
  title: string;
  subtitle?: string;
  callbackUrl?: string;
  tabs?: boolean;
  children: React.ReactNode;
}) {
  const panel = PANEL[mode];
  const keep = callbackUrl && callbackUrl !== "/app" ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : "";
  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#10120f] text-[#f2f3ed]">
      <div aria-hidden className="pointer-events-none absolute -left-48 -top-48 h-[520px] w-[520px] rounded-full bg-[#d3f693]/[0.08] blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-40 -right-40 h-[460px] w-[460px] rounded-full bg-violet-400/[0.09] blur-3xl" />

      <div className="relative mx-auto grid min-h-dvh w-full max-w-7xl items-center gap-6 px-4 pb-10 pt-[calc(max(0.75rem,env(safe-area-inset-top))+3.25rem)] sm:px-6 lg:grid-cols-[1.3fr_1fr] lg:gap-10 lg:px-8 lg:py-12">
        {/* Панель смысла: на широком экране — во всю высоту, на телефоне — шапка с маскотом */}
        <aside className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-[#1c201a] via-[#171a15] to-[#12140f] p-5 sm:p-7 lg:flex lg:min-h-[640px] lg:flex-col lg:p-10">
          <Link href="/" aria-label="YeahGrind — на главную" className="inline-flex">
            <Logo className="h-8 w-auto lg:h-9" />
          </Link>
          <div className="relative z-10 mt-5 max-w-[66%] lg:mt-12 lg:max-w-[58%]">
            <p className="flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[#b4b8ae]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d3f693]" />
              {panel.eyebrow}
            </p>
            <h2 className="mt-3 text-[25px] font-bold leading-[1.04] tracking-tight [overflow-wrap:anywhere] sm:text-[38px] lg:text-[40px] xl:text-[46px] 2xl:text-[52px]">
              {panel.title} <em className="block font-semibold italic text-[#d3f693]">{panel.accent}</em>
            </h2>
            <p className="mt-3 hidden text-[15px] leading-relaxed text-[#b4b8ae] sm:block lg:mt-5 lg:text-[16px]">{panel.text}</p>
            <ul className="mt-7 hidden space-y-2.5 lg:block">
              {panel.points.map((p) => (
                <li key={p} className="flex items-center gap-2.5 text-[15px]">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#d3f693]/15 text-[11px] text-[#d3f693]">✓</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="pointer-events-none absolute -bottom-6 right-0 h-[200px] w-[150px] sm:h-[250px] sm:w-[190px] lg:bottom-0 lg:right-6 lg:h-[440px] lg:w-[230px] xl:h-[480px] xl:w-[260px]">
            <span className="absolute -left-8 top-[46%] z-10 hidden h-20 w-20 rotate-[-12deg] items-center justify-center rounded-full bg-[#c9b6ff] text-center text-[10px] font-bold uppercase leading-tight text-[#10120f] xl:flex">
              100% твой<br />темп
            </span>
            <Image src={panel.image} alt={panel.alt} fill priority sizes="(min-width: 1024px) 300px, 190px" className="object-contain object-bottom drop-shadow-[0_24px_40px_rgba(0,0,0,0.45)]" />
          </div>
        </aside>

        {/* Карточка формы */}
        <main className="w-full rounded-[28px] border border-white/10 bg-[#161914]/90 p-5 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)] backdrop-blur sm:p-8 lg:mx-auto lg:max-w-[460px]">
          {tabs && mode !== "neutral" && (
            <nav aria-label="Вход или регистрация" className="mb-6 grid grid-cols-2 rounded-2xl border border-white/10 bg-white/[0.03] p-1 text-[15px] font-semibold">
              <Link
                href={`/login${keep}`}
                aria-current={mode === "login" ? "page" : undefined}
                className={cn("rounded-xl py-2.5 text-center transition", mode === "login" ? "bg-[#d3f693] text-[#10120f]" : "text-[#b4b8ae] hover:text-[#f2f3ed]")}
              >
                Вход
              </Link>
              <Link
                href={`/register${keep}`}
                aria-current={mode === "register" ? "page" : undefined}
                className={cn("rounded-xl py-2.5 text-center transition", mode === "register" ? "bg-[#d3f693] text-[#10120f]" : "text-[#b4b8ae] hover:text-[#f2f3ed]")}
              >
                Регистрация
              </Link>
            </nav>
          )}
          <h1 className="text-[26px] font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-1.5 text-[15px] leading-relaxed text-[#b4b8ae]">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
