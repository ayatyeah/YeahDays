"use client";
import {
  useUserStore,
  selectToday,
  isTodoOnDay,
  isTodoDone,
} from "@/store/useUserStore";
import { weeklyActivity } from "@/lib/weeklyActivity";
import { dateKey } from "@/lib/domain";
import { useLocaleStore } from "@/i18n/locale";
import Link from "next/link";
import ProgressRing from "./ProgressRing";
export default function WeeklyOverview({
  ratio,
  level,
}: {
  ratio: number;
  level: number;
}) {
  const plan = useUserStore((s) => s.plan),
    todos = useUserStore((s) => s.todos);
  const locale = useLocaleStore((s) => s.locale);
  const days = weeklyActivity(plan, todos);
  const active = days.filter((d) => d.count > 0).length;
  const todayPlan = selectToday(plan),
    todayTodos = todos.filter((t) => isTodoOnDay(t, dateKey()));
  const done =
    todayPlan.filter((p) => p.completed).length +
    todayTodos.filter((t) => isTodoDone(t, dateKey())).length;
  const total = todayPlan.length + todayTodos.length;
  const max = Math.max(1, ...days.map((d) => d.count));
  if (!active && !total && level === 1 && ratio === 0)
    return (
      <section className="flow-result">
        <h2>Первый результат важнее цифр</h2>
        <p>Заверши одно небольшое дело. Здесь появится твой ритм за неделю.</p>
        <Link className="flow-primary" href="/today">
          Выбрать свой шаг
        </Link>
      </section>
    );
  return (
    <section className="mono-weekly-overview">
      <div className="mono-rings">
        <div>
          <ProgressRing
            value={done}
            max={total}
            label={`План дня: ${done} из ${total}`}
          >
            {done}/{total}
          </ProgressRing>
          <span>План дня</span>
        </div>
        <div>
          <ProgressRing
            value={active}
            max={7}
            label={`Активных дней за неделю: ${active} из 7`}
            tone="stone"
          >
            {active}/7
          </ProgressRing>
          <span>Активных дней</span>
        </div>
        <div>
          <ProgressRing
            value={ratio}
            max={1}
            label={`До следующего уровня: ${Math.round(ratio * 100)}%`}
            tone="sage"
          >
            {level}
          </ProgressRing>
          <span>Уровень</span>
        </div>
      </div>
      {!active ? (
        <div className="flow-result">
          <h2>Первый результат важнее цифр</h2>
          <p>
            Заверши одно небольшое дело. Здесь появится твой ритм за неделю.
          </p>
          <Link className="flow-primary" href="/today">
            Выбрать свой шаг
          </Link>
        </div>
      ) : (
        <div className="mono-week-chart">
          <div>
            <h2>Эта неделя</h2>
            <small>{`Выполнено: ${days.reduce((n, d) => n + d.count, 0)}`}</small>
          </div>
          <div className="mono-bars">
            {days.map((d) => (
              <div
                key={d.key}
                aria-label={`${d.date.toLocaleDateString(locale, { weekday: "long" })}: ${d.count}`}
              >
                <span className="mono-bar-track">
                  <i
                    className={d.key === dateKey() ? "is-today" : ""}
                    style={{
                      height: d.count ? `${(d.count / max) * 100}%` : "3px",
                    }}
                  />
                </span>
                <small>
                  {d.date.toLocaleDateString(locale, { weekday: "short" })}
                </small>
              </div>
            ))}
          </div>
          {!days.some((d) => d.count) && (
            <p>Здесь появятся твои выполненные дела</p>
          )}
        </div>
      )}
    </section>
  );
}
