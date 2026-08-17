"use client";

import { useEffect } from "react";
import {
  useUserStore,
  useHydrated,
  selectActiveDays,
} from "@/store/useUserStore";
import { dateKey } from "@/lib/domain";
import { track } from "@/lib/analytics";

/**
 * Страховка стрика.
 *
 * Один пропущенный день не должен обнулять месяц работы: человек решает
 * «всё равно уже сломал» и уходит совсем. Если вчера пропущено, но до
 * этого стрик шёл — молча тратим заморозку и сохраняем серию.
 *
 * Осознанно НЕ тратим заморозку, если стрика и не было: спасать нечего,
 * а лимит месяца надо беречь на реальные срывы.
 */
export default function StreakGuard() {
  const hydrated = useHydrated();
  const plan = useUserStore((s) => s.plan);
  const todos = useUserStore((s) => s.todos);
  const freezes = useUserStore((s) => s.freezes);
  const refillFreezes = useUserStore((s) => s.refillFreezes);
  const spendFreeze = useUserStore((s) => s.spendFreeze);

  useEffect(() => {
    if (!hydrated) return;

    // новый месяц — вернуть лимит
    refillFreezes();

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dayBefore = new Date();
    dayBefore.setDate(dayBefore.getDate() - 2);

    const yKey = dateKey(yesterday);
    const bKey = dateKey(dayBefore);

    const active = selectActiveDays(plan, todos);
    const frozen = new Set(freezes.days);
    const covered = (k: string) => active.has(k) || frozen.has(k);

    if (covered(yKey)) return; // вчера закрыт — спасать нечего
    if (!covered(bKey)) return; // стрика не было — заморозку бережём
    if (freezes.left <= 0) return; // лимит месяца исчерпан

    spendFreeze(yKey);
    track("streak_saved_by_freeze");
  }, [hydrated, plan, todos, freezes, refillFreezes, spendFreeze]);

  return null;
}
