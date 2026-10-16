/**
 * /api/integrations/stats — прогресс по одному стату для отображения во
 * внешнем сервисе. Авторизация: scoped ApiKey + userId, привязанный этим
 * же ключом через /api/keys/redeem.
 *
 * GET ?userId=&stat=intelligence → { stat, xp, level, streak }
 */

import { NextResponse } from "next/server";
import { authorizeServiceKey, userAllowedForKey } from "@/lib/apiKey";
import { loadState } from "@/lib/externalState";
import { computeProgress, STAT_KEYS } from "@/lib/integrationProgress";
import { dateKey, type StatKey } from "@/lib/domain";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const key = await authorizeServiceKey(req);
  if (!key) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const userId = url.searchParams.get("userId") ?? "";
  const stat = url.searchParams.get("stat") as StatKey | null;
  if (!userId || !stat || !STAT_KEYS.includes(stat)) {
    return NextResponse.json({ error: "userId and valid stat required" }, { status: 400 });
  }

  if (!(await userAllowedForKey(key.id, userId))) {
    return NextResponse.json({ error: "userId not linked to this key" }, { status: 403 });
  }

  const progress = computeProgress(await loadState(userId), dateKey());
  return NextResponse.json({
    stat,
    xp: progress.stats[stat],
    level: progress.level,
    streak: progress.streak,
  });
}
