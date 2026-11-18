/**
 * /api/keys/redeem — обменять пейринг-код на userId.
 *
 * POST { code } → { ok: true, userId }, авторизация: сервисный ApiKey
 * (Authorization: Bearer <key>, см. src/lib/apiKey.ts). Вызывается ровно
 * один раз, сразу после того как пользователь ввёл код на стороне
 * внешнего сервиса — тот дальше хранит userId у себя и переиспользует его
 * во всех /api/integrations/* вызовах тем же ключом.
 *
 * Код может быть привязан к конкретному ApiKey заранее (PairingCode.apiKeyId
 * — так делает /oauth/authorize после согласия пользователя): тогда обменять
 * его может ТОЛЬКО тот сервис, для которого он выпущен, иначе 403. Код без
 * привязки (сгенерирован самим пользователем в профиле, PairingCodeCard) —
 * как раньше, обменять может любой валидный ключ.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authorizeServiceKey } from "@/lib/apiKey";
import { boundedJson, RequestBodyError } from "@/lib/requestSecurity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const key = await authorizeServiceKey(req);
  if (!key) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await boundedJson(req);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: error instanceof RequestBodyError ? error.status : 400 });
  }

  const code = typeof body.code === "string" ? body.code.trim().toUpperCase() : "";
  if (!code) {
    return NextResponse.json({ error: "code required" }, { status: 400 });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const row = await tx.pairingCode.findUnique({ where: { code } });
      if (!row || row.consumedAt || row.expiresAt.getTime() <= Date.now()) return { status: 400, error: "Invalid or expired code" };
      if (row.apiKeyId && row.apiKeyId !== key.id) return { status: 403, error: "Code issued for a different service" };

      // Claim and grant in the same transaction. The predicate is rechecked
      // after a concurrent claimant's row lock, so only one caller can win.
      const claimed = await tx.pairingCode.updateMany({
        where: { code, consumedAt: null, expiresAt: { gt: new Date() }, OR: [{ apiKeyId: null }, { apiKeyId: key.id }] },
        data: { consumedAt: new Date() },
      });
      if (claimed.count !== 1) return { status: 400, error: "Invalid or expired code" };
      await tx.apiKeyUser.upsert({
        where: { apiKeyId_userId: { apiKeyId: key.id, userId: row.userId } },
        create: { apiKeyId: key.id, userId: row.userId }, update: {},
      });
      return { status: 200, userId: row.userId };
    });
    return "error" in result
      ? NextResponse.json({ error: result.error }, { status: result.status })
      : NextResponse.json({ ok: true, userId: result.userId });
  } catch {
    return NextResponse.json({ error: "Could not redeem code" }, { status: 503 });
  }
}
