"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Avatar3D from "@/components/AvatarLazy";
import AuthCard from "@/components/AuthCard";
import PushOptIn from "@/components/PushOptIn";
import Quests from "@/components/Quests";
import ShareCard from "@/components/ShareCard";
import DataControls from "@/components/DataControls";
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

export default function AccountSection() {
  const hydrated = useHydrated();
  const name = useUserStore((s) => s.name);
  const setName = useUserStore((s) => s.setName);
  const plan = useUserStore((s) => s.plan);
  const goals = useUserStore((s) => s.goals);
  const setGoal = useUserStore((s) => s.setGoal);
  const moods = useUserStore((s) => s.moods);
  const setMood = useUserStore((s) => s.setMood);
  const resetAll = useUserStore((s) => s.resetAll);
  const createdAt = useUserStore((s) => s.createdAt);
  const freezes = useUserStore((s) => s.freezes);

  const stats = useMemo(() => selectStats(plan), [plan]);
  const totalXp = useMemo(() => selectTotalXp(plan), [plan]);
  const completed = useMemo(() => selectCompleted(plan), [plan]);
  const streak = useStreak();
  const level = getLevelProgress(totalXp).level;

  const todayMood = selectMood(moods);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);
  const [confirmReset, setConfirmReset] = useState(false);

  const days = Math.max(
    1,
    Math.ceil((Date.now() - createdAt) / 864e5),
  );

  if (!hydrated) {
    return <LogoLoader />;
  }

  return (
    <div className="flex flex-1 flex-col">
      <h1 className="text-[26px] font-bold tracking-tight">Профиль</h1>

      {/* Вход / аккаунт */}
      <div className="mt-3">
        <AuthCard />
      </div>

      {/* Карточка пользователя */}
      <section className="mt-3 flex items-center gap-4 rounded-3xl surface p-4">
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
          <p className="truncate text-lg font-bold">{name}</p>
          <p className="mt-0.5 text-[12px] text-[var(--color-muted)]">
            Уровень {level} · {totalXp} XP
          </p>
          <p className="mt-0.5 text-[12px] text-[var(--color-muted)]">
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

      {/* Напоминания */}
      <div className="mt-3">
        <PushOptIn />
      </div>

      {/* Заморозки — страховка стрика */}
      <section className="mt-3 flex items-center gap-3 rounded-3xl surface p-4">
        <span className="text-xl" aria-hidden>
          🧊
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold">
            Заморозки стрика: {freezes.left} из {FREEZES_PER_MONTH}
          </p>
          <p className="mt-0.5 text-[11.5px] leading-snug text-[var(--color-muted)]">
            {freezes.left > 0
              ? "Пропустишь день — серия сохранится автоматически. Обновляются каждый месяц."
              : "На этот месяц закончились. Новые придут первого числа."}
          </p>
        </div>
      </section>

      {/* Поделиться прогрессом */}
      <div className="mt-3">
        <ShareCard />
      </div>

      {/* Цели с горизонтом — подкручивают колоду под срок */}
      <Quests />

      {/* Приоритеты — напрямую кормят движок */}
      <section className="mt-6">
        <h2 className="text-[13px] font-semibold text-[var(--color-fg-dim)]">
          Приоритеты
        </h2>
        <p className="mb-3.5 mt-1 text-[11.5px] leading-snug text-[var(--color-muted)]">
          Чем выше приоритет — тем чаще такие действия будут появляться
          в подборке.
        </p>
        <div className="space-y-4">
          {STAT_LIST.map((s) => (
            <div key={s.key}>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-2 text-[13px] font-medium">
                  <span style={{ color: s.hex }}>{s.icon}</span>
                  {s.label}
                </span>
                <span className="text-[11px] tabular-nums text-[var(--color-muted)]">
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
        <h2 className="mb-3 text-[13px] font-semibold text-[var(--color-fg-dim)]">
          Состояние на сегодня
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {(["low", "medium", "high"] as EnergyLevel[]).map((e) => (
            <button
              key={e}
              onClick={() => setMood({ energy: e })}
              className={cn(
                "rounded-2xl border py-2.5 text-[12px] font-medium transition",
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
                "rounded-2xl border py-2.5 text-[12px] font-medium tabular-nums transition",
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

      {/* Как подбираются действия — человеческим языком, без формул движка */}
      <section className="mt-6 rounded-3xl surface p-4">
        <h2 className="text-[13px] font-semibold">Как я подбираю действия</h2>
        <p className="mt-1.5 text-[11.5px] leading-relaxed text-[var(--color-muted)]">
          Смотрю на твои приоритеты, время суток и сколько у тебя сейчас сил,
          и не предлагаю то, что не влезает в бюджет минут. Каждый свайп
          немного меняет подборку на завтра: чем чаще берёшь — тем больше
          похожего, отклоняешь — тем реже.
        </p>
      </section>

      <section className="mt-6">
        <Link
          href="/admin"
          className="flex items-center justify-between rounded-3xl surface px-4 py-3.5 transition hover:bg-[var(--color-surface-2)]"
        >
          <span>
            <span className="block text-[13px] font-semibold">Управление</span>
            <span className="mt-0.5 block text-[11.5px] text-[var(--color-muted)]">
              Действия, дни задним числом, челленджи, расписание
            </span>
          </span>
          <span className="text-[var(--color-muted)]">→</span>
        </Link>
      </section>

      <DataControls />

      <div className="mt-6">
        <Button
          variant="danger"
          className="w-full"
          onClick={() => setConfirmReset(true)}
        >
          Сбросить весь прогресс
        </Button>
      </div>

      {/* Бренд */}
      <div className="mt-8 mb-1 flex flex-col items-center gap-1.5 opacity-55">
        <Logo variant="white" className="h-4 w-auto" />
        <p className="text-[11px] text-[var(--color-muted)]">
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
          className="h-12 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 text-[15px] outline-none focus:border-[var(--color-fg-dim)]"
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

      {/* Модалка сброса */}
      <Modal
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        title="Сбросить прогресс?"
      >
        <p className="text-[14px] leading-snug text-[var(--color-fg-dim)]">
          Все выполненные действия, уровень и история свайпов будут удалены.
          Это нельзя отменить.
        </p>
        <div className="mt-5 flex gap-2.5">
          <Button className="flex-1" onClick={() => setConfirmReset(false)}>
            Отмена
          </Button>
          <Button
            variant="danger"
            className="flex-1"
            onClick={() => {
              resetAll();
              setConfirmReset(false);
            }}
          >
            Сбросить
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      className="press rounded-3xl surface px-3 py-4 text-center"
    >
      <p className="text-2xl font-bold tabular-nums">{value}</p>
      <p className="mt-0.5 text-[10.5px] text-[var(--color-muted)]">{label}</p>
    </motion.div>
  );
}
