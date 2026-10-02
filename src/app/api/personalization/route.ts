import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rateLimit";
import { completions, emptyPersonalization, POLICY_VERSION, publicPersonalization, recordActivity, validTimezone, type Personalization } from "@/lib/personalization";
import { mutatePersonalization } from "@/lib/personalizationDb";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const json = (value: unknown, status = 200) => NextResponse.json(value, { status, headers: { "Cache-Control": "private, no-store" } });
export async function GET() {
  const userId = (await auth())?.user?.id; if (!userId) return json({ error: "Войди в аккаунт" }, 401);
  try { const row = await prisma.personalizationProfile.findUnique({ where: { userId } }); return json(publicPersonalization(row ? row.data as unknown as Personalization : emptyPersonalization())); }
  catch { return json({ error: "Не удалось загрузить настройки приватности" }, 503); }
}
export async function POST(req: Request) {
  const userId = (await auth())?.user?.id; if (!userId) return json({ error: "Войди в аккаунт" }, 401);
  if (!rateLimit(`personalization:${userId}`, 40, 60_000)) return json({ error: "Попробуй через минуту" }, 429);
  try {
    const raw = await req.text(); if (raw.length > 2000) return json({ error: "Запрос слишком большой" }, 400);
    const body = JSON.parse(raw);
    if (!body || !["consent", "heartbeat", "refresh"].includes(body.action)) return json({ error: "Некорректное действие" }, 400);
    if (body.action === "consent" && (body.version !== POLICY_VERSION || typeof body.enabled !== "boolean")) return json({ error: "Прими текущую версию политики" }, 400);
    let timezone: string | undefined;
    if (body.action === "consent") { try { timezone = validTimezone(body.timezone); } catch { return json({ error: "Некорректный часовой пояс" }, 400); } }
    const { profile } = await mutatePersonalization(userId, async p => {
      const now = Date.now();
      if (body.action === "consent") {
        const previousVersion = p.version;
        const enabling = body.enabled && (!p.enabled || p.version !== POLICY_VERSION);
        p.version = POLICY_VERSION; p.acceptedAt = new Date(now).toISOString(); p.timezone = timezone!;
        // One acceptance covers the policy, activity tracking and AI data transfer; each part can still be switched separately later.
        const ai = typeof body.ai === "boolean" ? body.ai : previousVersion === POLICY_VERSION && p.ai === true;
        if (previousVersion !== POLICY_VERSION || p.enabled !== body.enabled || (p.ai === true) !== ai || enabling || !p.receipts.length) p.receipts.push({ version: POLICY_VERSION, at: p.acceptedAt, enabled: body.enabled, ai });
        p.enabled = body.enabled; p.ai = ai;
        if (!p.enabled) { p.days = {}; p.seen = []; p.since = null; p.lastTick = 0; }
        if (enabling) {
          const [state, learning] = await Promise.all([prisma.userState.findUnique({ where: { userId } }), prisma.learningProfile.findUnique({ where: { userId } })]);
          p.seen = completions(state?.data, learning?.data).map(c => c.key); p.since = p.acceptedAt; p.lastTick = 0;
        }
      } else if (p.enabled && p.version === POLICY_VERSION) {
        const [state, learning] = await Promise.all([prisma.userState.findUnique({ where: { userId } }), prisma.learningProfile.findUnique({ where: { userId } })]);
        recordActivity(p, now, typeof body.section === "string" ? body.section : "other", completions(state?.data, learning?.data), body.action === "heartbeat");
      }
    });
    return json(publicPersonalization(profile));
  } catch { return json({ error: "Не удалось сохранить настройки или активность" }, 503); }
}
