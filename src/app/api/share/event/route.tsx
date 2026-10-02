/**
 * /api/share/event — картинка «готов к квизу на N%» для мессенджеров.
 *
 * Тот же приём, что и у /api/share: рисует сервер через next/og, параметры
 * в query. Картинка не раскрывает ничего, кроме того, что человек сам решил
 * показать, поэтому входа не требует — её открывает чужой мессенджер.
 */

import { ImageResponse } from "next/og";

export const runtime = "nodejs";

const BG = "#0e0f13";
const FG = "#f4f4f5";
const DIM = "#8b8d98";
const ACCENT = "#a78bfa";

function clampInt(v: string | null, min: number, max: number, dflt: number) {
  const n = Number(v);
  if (!Number.isFinite(n)) return dflt;
  return Math.min(max, Math.max(min, Math.round(n)));
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = (searchParams.get("name") ?? "").slice(0, 24) || "Странник";
  const title = (searchParams.get("title") ?? "").slice(0, 60) || "Подготовка к квизу";
  const course = (searchParams.get("course") ?? "").slice(0, 60);
  const percent = clampInt(searchParams.get("percent"), 0, 100, 0);
  const done = clampInt(searchParams.get("done"), 0, 999, 0);
  const total = clampInt(searchParams.get("total"), 1, 999, 1);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: BG, padding: 64, fontFamily: "sans-serif", color: FG }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", width: 40, height: 40, borderRadius: 12, background: FG, color: BG, alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 800 }}>Y</div>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 800, letterSpacing: -0.5 }}>YeahGrind</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", marginTop: 56 }}>
          <div style={{ display: "flex", fontSize: 26, color: DIM }}>{course ? `${name} · ${course}` : name}</div>
          <div style={{ display: "flex", fontSize: 44, fontWeight: 800, marginTop: 8 }}>{title}</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 20, marginTop: 28 }}>
            <div style={{ display: "flex", fontSize: 170, fontWeight: 800, lineHeight: 1, color: ACCENT }}>{`${percent}%`}</div>
            <div style={{ display: "flex", fontSize: 34, color: DIM }}>готовность</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", marginTop: "auto" }}>
          <div style={{ display: "flex", width: "100%", height: 18, borderRadius: 9, background: "#23242c" }}>
            <div style={{ display: "flex", width: `${percent}%`, height: 18, borderRadius: 9, background: ACCENT }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18, fontSize: 26, color: DIM }}>
            <div style={{ display: "flex" }}>{`Пройдено шагов: ${done} из ${total}`}</div>
            <div style={{ display: "flex" }}>yeahgrind.site</div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
