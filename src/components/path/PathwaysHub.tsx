"use client";
import { useCopy } from "@/i18n/useCopy";

/** Траектории в хабе «Учёба»: мои цели со следующим шагом и кнопка новой цели. */
import Link from "next/link";
import { useEffect, useState } from "react";
import { YgIcon } from "@/components/yg-icons";
import { call, type GoalSummary } from "./client";
import "./path.css";

export default function PathwaysHub() {
  const tx = useCopy();
  const [goals, setGoals] = useState<GoalSummary[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    call<{ goals: GoalSummary[] }>("/api/path/goals").then((r) => setGoals(r.goals), (e) => setError(e.message));
  }, []);

  return (
    <section aria-labelledby="path-hub-title">
      <div className="learning-section-title">
        <h2 id="path-hub-title">{tx("Мои траектории")}</h2>
        <Link href="/learn/new">{tx("+ Новая цель")}</Link>
      </div>
      {error && <p className="path-error" role="alert">{tx(error)}</p>}
      {!goals && !error && <p className="path-muted" role="status">{tx("Загружаем траектории…")}</p>}
      {goals?.length === 0 && (
        <div className="path-card path-stack">
          <h3>{tx("Персональная траектория под твою цель")}</h3>
          <ul className="path-muted" style={{ listStyle: "disc", paddingLeft: 18, display: "grid", gap: 4 }}>
            <li>{tx("ИИ строит карту навыков и делит тему на микро-юниты по 2–5 минут — можно по твоему конспекту.")}</li>
            <li>{tx("Вопросы подстраиваются под уровень, а траектория — под результаты и дедлайн.")}</li>
            <li>{tx("К каждому юниту — короткое видео с озвучкой и субтитрами.")}</li>
            <li>{tx("Можно учиться вместе: общий круг, челлендж недели без рейтингов.")}</li>
          </ul>
          <Link className="path-btn" href="/learn/new">{tx("Построить траекторию")}</Link>
        </div>
      )}
      <div className="learning-subjects">
        {goals?.map((g) => (
          <Link key={g.id} href={`/learn/g/${g.id}`} className="learning-subject">
            <span className="learning-subject-icon"><YgIcon name="target" /></span>
            <span className="learning-subject-content path-hub-goal">
              <b data-no-i18n>{g.title}</b>
              <small>{tx("Юниты: {0} из {1} · навыки: {2} из {3}{4}", {"0": g.unitsDone, "1": g.units, "2": g.skillsMastered, "3": g.skills, "4": g.members > 1 ? ` · участников: ${g.members}` : ""})}</small>
              <progress value={g.unitsDone} max={g.units || 1} aria-label={tx("Прогресс: {0}", {"0": g.title})} />
              {!g.placementDone ? <span className="path-reason">{tx("Начни со стартового теста")}</span> : g.next && <span className="path-reason"><span data-no-i18n>{g.next.title}</span> — {g.next.reason}</span>}
            </span>
            <YgIcon name="chevron" />
          </Link>
        ))}
      </div>
    </section>
  );
}
