"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Avatar3D from "@/components/AvatarLazy";
import AuthCard from "@/components/AuthCard";
import Quests from "@/components/Quests";
import ShareCard from "@/components/ShareCard";
import Logo, { LogoLoader } from "@/components/Logo";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import {
  useUserStore,
  useHydrated,
  selectStats,
  selectTotalXp,
  selectCompleted,
  selectMood,
  useStreak,
  FREEZES_PER_MONTH,
} from "@/store/useUserStore";
import { STAT_LIST, ENERGY_LABEL, type EnergyLevel } from "@/lib/domain";
import { getLevelProgress } from "@/lib/leveling";
import { cn } from "@/lib/cn";
import { YgIcon } from "@/components/yg-icons";

export default function AccountSection() {
  const hydrated = useHydrated();
  const name = useUserStore((s) => s.name);
  const setName = useUserStore((s) => s.setName);
  const plan = useUserStore((s) => s.plan);
  const todos = useUserStore((s) => s.todos);
  const goals = useUserStore((s) => s.goals);
  const setGoal = useUserStore((s) => s.setGoal);
  const moods = useUserStore((s) => s.moods);
  const setMood = useUserStore((s) => s.setMood);
  const createdAt = useUserStore((s) => s.createdAt);
  const freezes = useUserStore((s) => s.freezes);

  const stats = useMemo(() => selectStats(plan, todos), [plan, todos]);
  const totalXp = useMemo(() => selectTotalXp(plan, todos), [plan, todos]);
  const completed = useMemo(() => selectCompleted(plan), [plan]);
  const streak = useStreak();
  const level = getLevelProgress(totalXp).level;

  const todayMood = selectMood(moods);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);

  const days = Math.max(
    1,
    Math.ceil((Date.now() - createdAt) / 864e5),
  );

  if (!hydrated) {
    return <LogoLoader />;
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Шестерёнка — всё, что НАСТРАИВАЕТ приложение, живёт в /settings.
          Профиль остался про «кто я и как расту»: без уведомлений, сброса
          и интеграций он перестал читаться как свалка. */}
      <header className="flex items-center justify-between">
        <h1 className="ios-title text-[28px] font-bold tracking-tight">Профиль</h1>
        <Link
          href="/settings"
          aria-label="Настройки"
          className="press flex h-10 w-10 items-center justify-center rounded-xl surface text-[var(--color-fg-dim)] transition hover:text-[var(--color-fg)]"
        >
          <GearIcon className="h-5 w-5" />
        </Link>
      </header>

      {/* Вход / аккаунт */}
      <div className="mt-3">
        <AuthCard />
      </div>

      {/* Карточка пользователя */}
      <section className="mt-3 flex items-center gap-4 rounded-3xl surface p-5">
        <div className="canvas-slot h-28 w-24 shrink-0">
          <Avatar3D
            stats={stats}
            level={level}
            interactive={false}
            still
            className="h-full w-full"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[20px] font-bold">{name}</p>
          <p className="mt-0.5 text-[13px] text-[var(--color-muted)]">
            Уровень {level} · {totalXp} XP
          </p>
          <p className="mt-0.5 text-[13px] text-[var(--color-muted)]">
            {days} {days === 1 ? "день" : "дн."} в YeahGrind
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => {
            setDraft(name);
            setEditing(true);
          }}
        >
          Изменить
        </Button>
      </section>

      {/* Метрики */}
      <section className="mt-3 grid grid-cols-3 gap-2.5">
        <Stat value={completed.length} label="Выполнено" />
        <Stat value={streak} label="Стрик" />
        <Stat value={level} label="Уровень" />
      </section>

      {/*
        lg:+: два столбца, как на других страницах — широкий слева
        (уведомления, устройства, СалемАй, заморозки, шаринг), узкий справа
        (цели, приоритеты, состояние, пояснительный текст, редкие/опасные
        действия — экспорт данных, сброс). Порядок внутри каждого столбца —
        тот же, что раньше был одним потоком, разбит цельным куском, поэтому
        на мобильном (без lg:) всё складывается ровно как было. Граница
        между столбцами подобрана так, чтобы столбцы получились примерно
        одной высоты — см. живую проверку в Playwright, а не на глаз.
      */}
      <div className="desk">
        <div className="desk-main">
      {/* Цели с горизонтом — подкручивают колоду под срок. Здесь, а не в
          боковой: после переезда настроек боковая осталась бы вдвое длиннее. */}
      <div className="mt-3">
        <Quests />
      </div>

      {/* Заморозки — страховка стрика */}
      <section className="mt-3 flex items-center gap-3 rounded-3xl surface p-5">
        <span className="text-[22px]" aria-hidden>
          <YgIcon name="snowflake" className="h-6 w-6 text-[var(--color-muted)]" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold">
            Заморозки: {freezes.left} из {FREEZES_PER_MONTH}
          </p>
          <p className="mt-0.5 text-[13px] leading-snug text-[var(--color-muted)]">
            {freezes.left > 0
              ? "Пропущенный день не сломает серию"
              : "Закончились до первого числа"}
          </p>
        </div>
      </section>

      {/* Поделиться прогрессом */}
      <div className="mt-3">
        <ShareCard />
      </div>
        </div>

        <div className="desk-aside">

      {/* Приоритеты — напрямую кормят движок */}
      <section className="mt-6">
        <h2 className="mb-3.5 text-[15px] font-semibold text-[var(--color-fg-dim)]">
          Приоритеты
        </h2>
        <div className="space-y-4">
          {STAT_LIST.map((s) => (
            <div key={s.key}>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-2 text-[15px] font-medium">
                  <span className="flex" style={{ color: s.hex }}><YgIcon name={s.icon} className="h-4 w-4" /></span>
                  {s.label}
                </span>
                <span className="text-[12px] tabular-nums text-[var(--color-muted)]">
                  {Math.round(goals[s.key] * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(goals[s.key] * 100)}
                onChange={(e) => setGoal(s.key, Number(e.target.value) / 100)}
                className="w-full accent-[var(--color-fg)]"
                style={{ accentColor: s.hex }}
                aria-label={`Приоритет: ${s.label}`}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Настройки дня */}
      <section className="mt-6">
        <h2 className="mb-3 text-[15px] font-semibold text-[var(--color-fg-dim)]">
          Состояние на сегодня
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {(["low", "medium", "high"] as EnergyLevel[]).map((e) => (
            <button
              key={e}
              onClick={() => setMood({ energy: e })}
              className={cn(
                "rounded-2xl border py-2.5 text-[13px] font-medium transition",
                todayMood.energy === e
                  ? "border-[var(--color-fg)] bg-[var(--color-surface-2)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)]",
              )}
            >
              {ENERGY_LABEL[e]}
            </button>
          ))}
        </div>
        <div className="mt-2.5 grid grid-cols-4 gap-2">
          {[10, 20, 30, 60].map((m) => (
            <button
              key={m}
              onClick={() => setMood({ minutes: m })}
              className={cn(
                "rounded-2xl border py-2.5 text-[13px] font-medium tabular-nums transition",
                todayMood.minutes === m
                  ? "border-[var(--color-fg)] bg-[var(--color-surface-2)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)]",
              )}
            >
              {m} мин
            </button>
          ))}
        </div>
      </section>

        </div>
      </div>

      {/* Бренд */}
      <div className="mt-8 mb-1 flex flex-col items-center gap-1.5 opacity-55">
        <Logo variant="white" className="h-4 w-auto" />
        <p className="text-[12px] text-[var(--color-muted)]">
          Одно действие в день
        </p>
      </div>

      {/* Модалка имени */}
      <Modal open={editing} onClose={() => setEditing(false)} title="Как тебя звать?">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={24}
          autoFocus
          className="h-12 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 text-[16px] outline-none focus:border-[var(--color-fg-dim)]"
        />
        <div className="mt-4 flex gap-2.5">
          <Button className="flex-1" onClick={() => setEditing(false)}>
            Отмена
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            onClick={() => {
              setName(draft);
              setEditing(false);
            }}
          >
            Сохранить
          </Button>
        </div>
      </Modal>

    </div>
  );
}

function GearIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      className="press rounded-3xl surface px-3 py-4 text-center"
    >
      <p className="text-[28px] font-bold tabular-nums">{value}</p>
      <p className="mt-0.5 text-[12px] text-[var(--color-muted)]">{label}</p>
    </motion.div>
  );
}
