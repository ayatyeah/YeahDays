/**
 * /api/share — картинка прогресса для сторис и мессенджеров.
 *
 * Рисуется на сервере через next/og (satori), без внешних сервисов и
 * без headless-браузера: параметры приходят в query, наружу уходит PNG.
 *
 * Смысл: человек делится не ссылкой на приложение, а своим результатом —
 * это единственный вид рекламы, который люди публикуют добровольно.
 */

import { ImageResponse } from "next/og";

export const runtime = "nodejs";

const BG = "#0e0f13";
const FG = "#f4f4f5";
const DIM = "#8b8d98";

const STAT_COLORS: Record<string, string> = {
  strength: "#f97362",
  intelligence: "#8b7cf6",
  wealth: "#f0b23f",
  stability: "#3fbf9a",
};

const STAT_LABELS: Record<string, string> = {
  strength: "Сила",
  intelligence: "Интеллект",
  wealth: "Капитал",
  stability: "Стабильность",
};

function clampInt(v: string | null, min: number, max: number, dflt: number) {
  const n = Number(v);
  if (!Number.isFinite(n)) return dflt;
  return Math.min(max, Math.max(min, Math.round(n)));
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const name = (searchParams.get("name") ?? "").slice(0, 24) || "Странник";
  const level = clampInt(searchParams.get("level"), 1, 999, 1);
  const streak = clampInt(searchParams.get("streak"), 0, 9999, 0);
  const done = clampInt(searchParams.get("done"), 0, 99999, 0);
  const xp = clampInt(searchParams.get("xp"), 0, 9_999_999, 0);

  const stats = (["strength", "intelligence", "wealth", "stability"] as const).map(
    (key) => ({
      key,
      value: clampInt(searchParams.get(key), 0, 9_999_999, 0),
      color: STAT_COLORS[key],
    }),
  );
  const maxStat = Math.max(...stats.map((s) => s.value), 1);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: BG,
          padding: 64,
          fontFamily: "sans-serif",
          color: FG,
        }}
      >
        {/* шапка */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              display: "flex",
              width: 40,
              height: 40,
              borderRadius: 12,
              background: FG,
              color: BG,
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              fontWeight: 800,
            }}
          >
            Y
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: -0.5,
            }}
          >
            YeahDays
          </div>
        </div>

        {/* главное число — стрик */}
        <div
          style={{ display: "flex", flexDirection: "column", marginTop: 56 }}
        >
          {/* текст собираем в одну строку: satori считает каждую вставку
              отдельным узлом и требует явный display у их контейнера */}
          <div style={{ display: "flex", fontSize: 26, color: DIM }}>
            {`${name} · уровень ${level}`}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 20,
              marginTop: 8,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 150,
                fontWeight: 800,
                lineHeight: 1,
              }}
            >
              {String(streak)}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 40,
                fontWeight: 700,
                color: DIM,
              }}
            >
              {streak === 1 ? "день подряд" : "дней подряд"}
            </div>
          </div>
        </div>

        {/* статы */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            marginTop: 48,
          }}
        >
          {stats.map((s) => (
            <div
              key={s.key}
              style={{ display: "flex", alignItems: "center", gap: 18 }}
            >
              <div
                style={{
                  display: "flex",
                  width: 190,
                  fontSize: 24,
                  color: DIM,
                }}
              >
                {STAT_LABELS[s.key]}
              </div>
              <div
                style={{
                  display: "flex",
                  height: 18,
                  width: `${Math.round((s.value / maxStat) * 560)}px`,
                  minWidth: 18,
                  borderRadius: 999,
                  background: s.color,
                }}
              />
              <div
                style={{
                  display: "flex",
                  fontSize: 22,
                  color: DIM,
                }}
              >
                {String(s.value)}
              </div>
            </div>
          ))}
        </div>

        {/* подвал */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginTop: "auto",
          }}
        >
          <div style={{ display: "flex", gap: 48 }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", fontSize: 44, fontWeight: 800 }}>
                {String(done)}
              </div>
              <div style={{ display: "flex", fontSize: 22, color: DIM }}>
                действий
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", fontSize: 44, fontWeight: 800 }}>
                {String(xp)}
              </div>
              <div style={{ display: "flex", fontSize: 22, color: DIM }}>
                XP
              </div>
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 24, color: DIM }}>
            Одно действие в день
          </div>
        </div>
      </div>
    ),
    { width: 1080, height: 1080 },
  );
}
