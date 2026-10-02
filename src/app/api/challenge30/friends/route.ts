/**
 * GET /api/challenge30/friends — «челлендж вместе»: как идут друзья.
 *
 * Взаимность вместо разрешений: чужой прогресс видит только тот, кто
 * включил показ своего, и только у друзей, которые сделали то же самое.
 * Наружу уходит минимум — день челленджа, зачтённые дни и часы; ни целей,
 * ни расписания, ни названий занятий здесь нет.
 */

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { LEVELS, dayIndex, localDay, stats, type Plan30 } from "@/lib/challenge30";
import { friendIds, publicNames } from "@/lib/friends";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function card(plan: Plan30, name: string, me: boolean) {
  const st = stats(plan);
  return {
    name,
    me,
    level: LEVELS[plan.brief.level].label,
    day: Math.min(30, Math.max(1, dayIndex(plan.startDate!, localDay(plan.brief.timezone)) + 1)),
    successes: st.successes,
    hours: Math.round(st.total / 6) / 10,
  };
}

export async function GET() {
  const userId = (await auth())?.user?.id;
  if (!userId) return NextResponse.json({ error: "Войди в аккаунт" }, { status: 401 });
  try {
    const mine = (await prisma.challenge30.findUnique({ where: { userId }, select: { data: true } }))?.data as Plan30 | null;
    const ids = await friendIds(userId);
    if (!mine?.startDate || !mine.share) return NextResponse.json({ share: false, friendCount: ids.length, board: [] });
    const rows = ids.length ? await prisma.challenge30.findMany({ where: { userId: { in: ids } }, select: { userId: true, data: true } }) : [];
    const sharing = rows.filter((r) => { const p = r.data as Plan30 | null; return !!p?.startDate && p.share === true; });
    const names = await publicNames(sharing.map((r) => r.userId));
    const board = [card(mine, "Ты", true)];
    for (const r of sharing) {
      // Чужая строка в старом формате не должна ронять весь список.
      try { board.push(card(r.data as unknown as Plan30, names.get(r.userId) ?? "Без имени", false)); } catch { /* пропускаем */ }
    }
    board.sort((a, b) => b.successes - a.successes || b.hours - a.hours);
    return NextResponse.json({ share: true, friendCount: ids.length, board }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Не удалось загрузить друзей" }, { status: 503 });
  }
}
