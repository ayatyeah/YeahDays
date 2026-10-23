"use client";
/** Траектории в хабе «Учёба»: мои цели со следующим шагом и кнопка новой цели. */
import Link from "next/link";
import { useEffect, useState } from "react";
import { YgIcon } from "@/components/yg-icons";
import { call, type GoalSummary } from "./client";
import "./path.css";

export default function PathwaysHub() {
  const [goals, setGoals] = useState<GoalSummary[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    call<{ goals: GoalSummary[] }>("/api/path/goals").then((r) => setGoals(r.goals), (e) => setError(e.message));
  }, []);

  return (
    <section aria-labelledby="path-hub-title">
      <div className="learning-section-title">
        <h2 id="path-hub-title">Мои траектории</h2>
        <Link href="/learn/new">+ Новая цель</Link>
      </div>
      {error && <p className="path-error" role="alert">{error}</p>}
      {!goals && !error && <p className="path-muted" role="status">Загружаем траектории…</p>}
      {goals?.length === 0 && (
        <div className="path-card path-stack">
          <h3>Персональная траектория под твою цель</h3>
          <ul className="path-muted" style={{ listStyle: "disc", paddingLeft: 18, display: "grid", gap: 4 }}>
            <li>ИИ строит карту навыков и делит тему на микро-юниты по 2–5 минут — можно по твоему конспекту.</li>
            <li>Вопросы подстраиваются под уровень, а траектория — под результаты и дедлайн.</li>
            <li>К каждому юниту — короткое видео с озвучкой и субтитрами.</li>
            <li>Можно учиться вместе: общий круг, челлендж недели без рейтингов.</li>
          </ul>
          <Link className="path-btn" href="/learn/new">Построить траекторию</Link>
        </div>
      )}
      <div className="learning-subjects">
        {goals?.map((g) => (
          <Link key={g.id} href={`/learn/g/${g.id}`} className="learning-subject">
            <span className="learning-subject-icon"><YgIcon name="target" /></span>
            <span className="learning-subject-content path-hub-goal">
              <b data-no-i18n>{g.title}</b>
              <small>{`Юниты: ${g.unitsDone} из ${g.units} · навыки: ${g.skillsMastered} из ${g.skills}${g.members > 1 ? ` · участников: ${g.members}` : ""}`}</small>
              <progress value={g.unitsDone} max={g.units || 1} aria-label={`Прогресс: ${g.title}`} />
              {!g.placementDone ? <span className="path-reason">Начни со стартового теста</span> : g.next && <span className="path-reason"><span data-no-i18n>{g.next.title}</span> — {g.next.reason}</span>}
            </span>
            <YgIcon name="chevron" />
          </Link>
        ))}
      </div>
    </section>
  );
}
