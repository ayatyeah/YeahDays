"use client";
import { useUserStore } from "@/store/useUserStore";
import { currentSlot, type EnergyLevel } from "@/lib/domain";
import { useLocaleStore } from "@/i18n/locale";
import AppBrand from "@/components/mono/AppBrand";
import ProgressRing from "@/components/mono/ProgressRing";

export default function CompanionHeader({
  completed,
  count,
  compact = false,
}: {
  completed: number;
  count: number;
  compact?: boolean;
}) {
  const slot = currentSlot();
  const energy = useUserStore((s) => s.energyProfile[slot]);
  const setEnergy = useUserStore((s) => s.setSlotEnergy);
  const locale = useLocaleStore((s) => s.locale);
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  return (
    <div className="companion-header">
      <AppBrand />
      <header className="mono-page-heading">
        <h1>Сегодня</h1>
        <p>
          {now.toLocaleDateString(locale, {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </p>
      </header>
      {!compact && (
        <section className="mono-day-overview">
          <ProgressRing
            value={completed}
            max={count}
            label={`Выполнение плана дня: ${completed} из ${count}`}
            tone="sage"
          >
            {completed}/{count}
          </ProgressRing>
          <div>
            <h2>
              {count > 0 && completed === count
                ? "Всё на сегодня сделано"
                : "Хороший ритм"}
            </h2>
            <p>
              {count
                ? `Выполнено: ${completed} из ${count}`
                : "Начни с одного небольшого дела"}
            </p>
          </div>
        </section>
      )}
      {compact && count > 0 && (
        <div className="flow-compact-progress">
          <span>
            Выполнено: {completed} из {count}
          </span>
          <progress
            value={completed}
            max={count}
            aria-label="Выполнение плана дня"
          />
        </div>
      )}
      {!compact && (
        <div className="mono-week" aria-label="Текущая неделя">
          {Array.from({ length: 7 }, (_, i) => {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            const today = date.toDateString() === now.toDateString();
            return (
              <time
                key={i}
                dateTime={`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`}
                aria-current={today ? "date" : undefined}
              >
                <small>
                  {date.toLocaleDateString(locale, { weekday: "short" })}
                </small>
                <b>{date.getDate()}</b>
              </time>
            );
          })}
        </div>
      )}
      <div className="companion-energy-label">
        <b>Как твоя энергия?</b>
      </div>
      <div className="companion-energy">
        {(
          [
            ["low", "Спокойно"],
            ["medium", "Нормально"],
            ["high", "Много сил"],
          ] as [EnergyLevel, string][]
        ).map(([value, label]) => (
          <button
            key={value}
            aria-pressed={energy === value}
            onClick={() => setEnergy(slot, value)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
