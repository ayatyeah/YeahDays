/**
 * /api/push/send — утренняя и вечерняя рассылка по запросу крона.
 *
 * Основной путь теперь встроенный планировщик (lib/pushScheduler.ts);
 * маршрут оставлен как запасной вход и для ручной проверки. Сама логика —
 * в lib/pushDigest.ts.
 */

import { runTrackedJob } from "@/lib/backgroundJobs";
import { NextResponse } from "next/server";
import { cronAuthorized } from "@/lib/cronAuth";
import { runDigest } from "@/lib/pushDigest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!cronAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const res = await runTrackedJob("push-digest", () => runDigest());
    return NextResponse.json(res, { status: res.ok ? 200 : 503 });
  } catch (e) {
    console.error("push send failed:", e);
    return NextResponse.json({ error: "Send failed" }, { status: 500 });
  }
}
