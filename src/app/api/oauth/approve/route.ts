/**
 * /api/oauth/approve — обрабатывает «Разрешить»/«Отмена» с экрана
 * /oauth/authorize. Настоящая точка проверки безопасности: страница уже
 * проверяла client_id/redirect_uri, но форма — не граница доверия (могла
 * быть подделана), поэтому всё перепроверяется здесь заново.
 *
 * POST form-data { client_id, redirect_uri, state, decision } → редирект на
 * redirect_uri (с code&state при согласии, с error=access_denied&state при
 * отказе). Статус редиректа — намеренно 303: дефолтный NextResponse.redirect
 * это 307, который сохраняет метод запроса — браузер повторил бы POST с
 * телом формы уже на СТОРОННИЙ redirect_uri вместо чистого GET с
 * query-параметрами, как того ждёт любой OAuth callback.
 */

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { generatePairingCode } from "@/lib/apiKey";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TTL_MS = 10 * 60_000;

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const clientId = String(form.get("client_id") ?? "");
  const redirectUri = String(form.get("redirect_uri") ?? "");
  const state = String(form.get("state") ?? "");
  const decision = String(form.get("decision") ?? "");

  const key = clientId ? await prisma.apiKey.findUnique({ where: { id: clientId } }) : null;
  const validTarget = !!key && !key.revokedAt && key.redirectUris.includes(redirectUri);
  if (!validTarget) {
    // redirect_uri не подтверждён — некуда безопасно отправить даже отказ,
    // это и есть защита от открытого редиректа.
    return NextResponse.json({ error: "Invalid client_id or redirect_uri" }, { status: 400 });
  }

  const back = new URL(redirectUri);
  if (state) back.searchParams.set("state", state);

  if (decision !== "approve") {
    back.searchParams.set("error", "access_denied");
    return NextResponse.redirect(back, 303);
  }

  const userId = session.user.id;
  // Непогашенный старый код для ЭТОЙ же пары (пользователь, сервис) больше
  // не нужен — иначе за долгий visит к экрану согласия с "назад"/повтором
  // копится мусор.
  await prisma.pairingCode.deleteMany({
    where: { userId, apiKeyId: key!.id, consumedAt: null },
  });

  const expiresAt = new Date(Date.now() + TTL_MS);
  let code = generatePairingCode();
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      await prisma.pairingCode.create({
        data: { code, userId, apiKeyId: key!.id, expiresAt },
      });
      back.searchParams.set("code", code);
      return NextResponse.redirect(back, 303);
    } catch {
      code = generatePairingCode(); // коллизия по code (крайне маловероятно) — пробуем другой
    }
  }
  return NextResponse.json({ error: "Could not generate code" }, { status: 500 });
}
