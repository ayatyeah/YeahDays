"use client";

import { useMemo } from "react";
import { useUserStore, selectStats } from "@/store/useUserStore";
import { useThemeStore } from "@/store/useThemeStore";
import { dominantStat, STAT_HEX } from "@/lib/statVisuals";

/**
 * Тихий фон. Цвет подхватывает доминирующий стат: приложение
 * визуально «окрашивается» в то, что ты качаешь.
 *
 * ПРОИЗВОДИТЕЛЬНОСТЬ: раньше здесь было три вечно анимирующихся
 * div'а с filter: blur(70–90px). Большой blur — одна из самых
 * дорогих операций для мобильного GPU, а работал он постоянно,
 * в том числе во время скролла, на каждом экране. Это была
 * основная причина «ада на телефоне».
 *
 * Теперь тот же визуальный эффект — статичными CSS-градиентами:
 * ноль анимации, ноль filter, ноль слоёв композитинга.
 */
export default function Ambient() {
  const plan = useUserStore((s) => s.plan);
  const todos = useUserStore((s) => s.todos);
  const theme = useThemeStore((s) => s.theme);
  const isLight = theme === "light";

  const tint = useMemo(() => {
    const stats = selectStats(plan, todos);
    const total = Object.values(stats).reduce((a, b) => a + b, 0);
    if (total === 0) return "110,115,135";
    const hex = STAT_HEX[dominantStat(stats)];
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r},${g},${b}`;
  }, [plan, todos]);

  // Тёмная тема: цветные пятна + затемнение к низу экрана — держит нижнюю
  // навигацию контрастной на чёрном. На светлой теме то же затемнение
  // читалось бы грязным серым пятном внизу белой страницы, поэтому вместо
  // него — просто более лёгкие цветные пятна без финального затемнения.
  const backgroundImage = isLight
    ? `
      radial-gradient(60% 40% at 12% 8%,  rgba(${tint},0.09) 0%, transparent 60%),
      radial-gradient(55% 35% at 92% 38%, rgba(${tint},0.07) 0%, transparent 62%),
      radial-gradient(60% 40% at 30% 96%, rgba(${tint},0.06) 0%, transparent 60%)
    `
    : `
      radial-gradient(60% 40% at 12% 8%,  rgba(${tint},0.16) 0%, transparent 60%),
      radial-gradient(55% 35% at 92% 38%, rgba(${tint},0.13) 0%, transparent 62%),
      radial-gradient(60% 40% at 30% 96%, rgba(${tint},0.10) 0%, transparent 60%),
      radial-gradient(120% 80% at 50% -10%, transparent 50%, rgba(0,0,0,0.55) 100%)
    `;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
      style={{ backgroundImage }}
    />
  );
}
