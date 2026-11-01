"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import AppBrand from "@/components/mono/AppBrand";
import SyncIndicator from "@/components/SyncIndicator";
import { YgIcon } from "@/components/yg-icons";
import { useT } from "@/i18n/useT";
import { useLocaleStore } from "@/i18n/locale";
import { useUserStore, selectStreak, selectTotalXp } from "@/store/useUserStore";
import { useLearningStore } from "@/store/useLearningStore";
import { getLevelProgress } from "@/lib/leveling";

export function TodayPrimeHeader({ completed, count }: { completed: number; count: number }) {
  const t = useT();
  const locale = useLocaleStore(s => s.locale);
  const streak = useUserStore(s => selectStreak(s.plan, s.freezes.days, s.todos));
  return <header className="prime-header" data-no-i18n>
    <div className="prime-brand-row"><AppBrand /><SyncIndicator /></div>
    <div className="prime-title-row">
      <div><h1>{t("nav.today")}</h1><p>{new Date().toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long" })}</p></div>
      <Link prefetch={false} href="/calendar" className="prime-calendar" aria-label={t("nav.calendar")}><YgIcon name="calendar" /></Link>
    </div>
    <div className="prime-day-summary">
      <span><YgIcon name="flame" /><b>{t("prime.streak", { count: streak })}</b></span>
      <span className="prime-day-count">{t("prime.completed", { done: completed, total: count })}<progress value={completed} max={count || 1} aria-label={t("prime.dayProgress")} /></span>
    </div>
  </header>;
}

export function TodayPrimeLevel() {
  const t = useT();
  const xp = useUserStore(s => selectTotalXp(s.plan, s.todos));
  const level = getLevelProgress(xp);
  return <Link prefetch={false} href="/progress" className="prime-level" data-no-i18n>
    <div><b>{t("prime.level", { level: level.level })}</b><span>{t("prime.remaining", { xp: level.neededForNext - level.currentInLevel })}</span></div>
    <progress value={level.currentInLevel} max={level.neededForNext} aria-label={t("prime.levelProgress")} />
  </Link>;
}

export function TodayPrimeLearning() {
  const t = useT();
  const owner = useSession().data?.user?.id;
  const data = useLearningStore(s => owner && s.owner === owner ? s.data : null);
  const skill = data?.skills.find(s => s.quests.some(q => !q.completed));
  const index = skill?.quests.findIndex(q => !q.completed) ?? -1;
  const quest = skill?.quests[index];
  const href = skill && quest ? `/learn?view=lesson&skill=${encodeURIComponent(skill.id)}&quest=${encodeURIComponent(quest.id)}` : "/learn";
  return <Link prefetch={false} href={href} className="prime-learning" data-no-i18n>
    <span className="prime-learning-icon"><YgIcon name="book" /></span>
    <span><b>{t(skill ? "flow.continue" : "nav.learn")}</b><small>{skill ? `${skill.title} · ${t("prime.quest", { current: index + 1, total: skill.quests.length })}` : t("prime.chooseSubject")}</small></span>
    <YgIcon name="chevron" />
  </Link>;
}
