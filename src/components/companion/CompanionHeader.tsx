"use client";
import { useCopy } from "@/i18n/useCopy";

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
  const tx = useCopy();
  const slot = currentSlot();
  const energy = useUserStore((s) => s.energyProfile[slot]);
  const setEnergy = useUserStore((s) => s.setSlotEnergy);
  const locale = useLocaleStore((s) => s.locale);
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  return (
    <div className={`companion-header${compact ? " polish-header" : ""}`}>
      <AppBrand />
      <header className="mono-page-heading">
        <h1>{tx("Сегодня")}</h1>
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
            label={tx("Выполнение плана дня: {0} из {1}", {"0": completed, "1": count})}
            tone="sage"
          >
            {completed}/{count}
          </ProgressRing>
          <div>
            <h2>
              {count > 0 && completed === count
                ? tx("Всё на сегодня сделано")
                : tx("Хороший ритм")}
            </h2>
            <p>
              {count
                ? tx("Выполнено: {0} из {1}", {"0": completed, "1": count})
                : tx("Начни с одного небольшого дела")}
            </p>
          </div>
        </section>
      )}
      {compact && count > 0 && (
        <div className="flow-compact-progress">
          <span>{tx("Выполнено: ")}{completed}{tx(" из ")}{count}
          </span>
          <progress
            value={completed}
            max={count}
            aria-label={tx("Выполнение плана дня")}
          />
        </div>
      )}
      {!compact && (
        <div className="mono-week" aria-label={tx("Текущая неделя")}>
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
      {!compact && (
        <>
          <div className="companion-energy-label">
            <b>{tx("Как твоя энергия?")}</b>
          </div>
          <div className="companion-energy">
            {(
              [
                ["low", tx("Спокойно")],
                ["medium", tx("Нормально")],
                ["high", tx("Много сил")],
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
        </>
      )}
    </div>
  );
}
