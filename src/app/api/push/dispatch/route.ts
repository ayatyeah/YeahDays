/**
 * /api/push/dispatch — отправка запланированных уведомлений по запросу крона.
 *
 * Основной путь теперь встроенный планировщик (lib/pushScheduler.ts): крон
 * GitHub Actions обещал раз в 5 минут, а на деле приходил раз в 2–5 часов,
 * и «через 5 минут пара» не доходило никогда. Маршрут оставлен как
 * запасной вход и для ручной проверки. Логика — в lib/pushDispatch.ts.
 */

import { NextResponse } from "next/server";
import { cronAuthorized } from "@/lib/cronAuth";
import { runDispatch } from "@/lib/pushDispatch";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!cronAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const res = await runDispatch();
    return NextResponse.json(res, { status: res.ok ? 200 : 503 });
  } catch (e) {
    console.error("dispatch failed:", e);
    return NextResponse.json({ error: "Dispatch failed" }, { status: 500 });
  }
}
