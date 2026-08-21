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

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const key = await authorizeServiceKey(req);
  if (!key) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const code = typeof body.code === "string" ? body.code.trim().toUpperCase() : "";
  if (!code) {
    return NextResponse.json({ error: "code required" }, { status: 400 });
  }

  const row = await prisma.pairingCode.findUnique({ where: { code } });
  if (!row || row.consumedAt || row.expiresAt.getTime() < Date.now()) {
    return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
  }
  if (row.apiKeyId && row.apiKeyId !== key.id) {
    return NextResponse.json({ error: "Code issued for a different service" }, { status: 403 });
  }

  await prisma.$transaction([
    prisma.pairingCode.update({ where: { code }, data: { consumedAt: new Date() } }),
    prisma.apiKeyUser.upsert({
      where: { apiKeyId_userId: { apiKeyId: key.id, userId: row.userId } },
      create: { apiKeyId: key.id, userId: row.userId },
      update: {},
    }),
  ]);

  return NextResponse.json({ ok: true, userId: row.userId });
}
