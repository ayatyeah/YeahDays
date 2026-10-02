/**
 * POST /api/visit { path } — отметить открытие раздела (см. lib/visits.ts).
 *
 * Вызывается маячком со страницы при каждом переходе. Отвечает сразу и
 * всегда «204»: счётчик не должен ни задерживать страницу, ни сообщать
 * наружу, что с ним что-то не так.
 */

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rateLimit";
import { sectionOf, visitorHash } from "@/lib/visits";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DONE = new Response(null, { status: 204 });

export async function POST(req: Request) {
  try {
    const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
    const userAgent = (req.headers.get("user-agent") ?? "").slice(0, 300);
    // Роботы и проверки доступности — не посетители.
    if (!userAgent || /bot|crawl|spider|preview|monitor|curl|wget|headless/i.test(userAgent)) return DONE;
    if (!rateLimit(`visit:${ip}`, 120, 60_000)) return DONE;
    const body = JSON.parse((await req.text()).slice(0, 500));
    if (typeof body?.path !== "string") return DONE;
    const path = sectionOf(body.path);
    const day = new Date().toISOString().slice(0, 10);
    const hash = visitorHash(day, ip, userAgent);
    const authed = !!(await auth())?.user?.id;
    await Promise.all([
      prisma.siteVisit.upsert({ where: { day_path: { day, path } }, create: { day, path, views: 1 }, update: { views: { increment: 1 } } }),
      // Гость, который потом вошёл, остаётся одной строкой — но уже «вошедшим».
      prisma.siteVisitor.upsert({ where: { day_hash: { day, hash } }, create: { day, hash, authed }, update: authed ? { authed: true } : {} }),
    ]);
  } catch {
    /* потерянное посещение лучше ошибки на странице */
  }
  return DONE;
}
