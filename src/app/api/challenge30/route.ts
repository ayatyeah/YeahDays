import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { randomUUID } from "node:crypto";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rateLimit";
import { ChallengeError, parseBrief, localDay, plusDays, logBlock, type Plan30 } from "@/lib/challenge30";
import { createRecipe } from "@/lib/challenge30Ai";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const available = () => !!process.env.OPENAI_API_KEY?.trim();
const json = (v: unknown) => v === null ? Prisma.JsonNull : v as Prisma.InputJsonValue;
function publicRow(row: { data: unknown; revision: number; aiDay: string; aiCount: number; pendingId: string | null; pendingAt: Date | null } | null) {
  const plan = row?.data as Plan30 | null;
  return { plan, revision: row?.revision ?? 0, available: available(), remaining: Math.max(0, 2 - (row?.aiDay === new Date().toISOString().slice(0, 10) ? row.aiCount : 0)), busy: !!row?.pendingId && !!row.pendingAt && Date.now() - row.pendingAt.getTime() < 90_000, today: localDay(plan?.brief.timezone ?? "Asia/Almaty") };
}
async function locked<T>(userId: string, run: (tx: Prisma.TransactionClient, row: NonNullable<Awaited<ReturnType<typeof prisma.challenge30.findUnique>>>) => Promise<T>) {
  await prisma.challenge30.upsert({ where: { userId }, create: { userId, data: Prisma.JsonNull }, update: {} });
  return prisma.$transaction(async tx => {
    await tx.$queryRaw`SELECT "userId" FROM "Challenge30" WHERE "userId" = ${userId} FOR UPDATE`;
    return run(tx, (await tx.challenge30.findUnique({ where: { userId } }))!);
  });
}
export async function GET() {
  const userId = (await auth())?.user?.id;
  if (!userId) return NextResponse.json({ error: "Войди в аккаунт" }, { status: 401 });
  try { return NextResponse.json(publicRow(await prisma.challenge30.findUnique({ where: { userId } })), { headers: { "Cache-Control": "no-store" } }); }
  catch { return NextResponse.json({ error: "Не удалось загрузить челлендж" }, { status: 503 }); }
}
async function readBody(req: Request) {
  const reader = req.body?.getReader(); if (!reader) throw new ChallengeError("Пустой запрос");
  const chunks: Uint8Array[] = []; let size = 0;
  while (true) { const { done, value } = await reader.read(); if (done) break; size += value.length; if (size > 8000) { await reader.cancel(); throw new ChallengeError("Слишком длинная анкета"); } chunks.push(value); }
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8")); } catch { throw new ChallengeError("Некорректный запрос"); }
}
export async function POST(req: Request) {
  const userId = (await auth())?.user?.id;
  if (!userId) return NextResponse.json({ error: "Войди в аккаунт" }, { status: 401 });
  if (!rateLimit(`challenge30:${userId}`, 30, 60_000)) return NextResponse.json({ error: "Подожди минуту" }, { status: 429 });
  let reservation: string | undefined;
  try {
    const b = await readBody(req);
    if (!b || !Number.isInteger(b.revision) || b.revision < 0) throw new ChallengeError("Обнови страницу перед изменением челленджа");
    if (b.action === "generate") {
      if (b.consent !== "challenge30-v1") throw new ChallengeError("Нужно согласие на отправку анкеты в OpenAI");
      const brief = parseBrief(b.brief);
      if (!available()) return NextResponse.json({ error: "ИИ ещё не подключён" }, { status: 503 });
      if (!rateLimit("challenge30:global", 100, 86400000)) return NextResponse.json({ error: "Общий дневной лимит ИИ исчерпан" }, { status: 429 });
      const token = randomUUID(); const now = new Date(); const day = now.toISOString().slice(0, 10);
      await locked(userId, async (tx, row) => {
        if (row.revision !== b.revision) throw new ChallengeError("Челлендж изменился. Обнови страницу");
        if ((row.data as Plan30 | null)?.startDate) throw new ChallengeError("Сначала заверши текущий челлендж");
        if (row.pendingId && row.pendingAt && now.getTime() - row.pendingAt.getTime() < 90_000) throw new ChallengeError("План уже создаётся. Подожди");
        const count = row.aiDay === day ? row.aiCount : 0;
        if (count >= 2) throw new ChallengeError("На сегодня доступны только 2 попытки генерации. Лимит обновится в 00:00 UTC");
        await tx.challenge30.update({ where: { userId }, data: { pendingId: token, pendingAt: now, aiDay: day, aiCount: count + 1 } });
      });
      reservation = token;
      const { recipe, tokens } = await createRecipe(brief);
      const plan: Plan30 = { id: randomUUID(), brief, recipe, tokens, createdAt: now.toISOString(), consentAt: now.toISOString(), startDate: null, logs: {} };
      const updated = await locked(userId, async (tx, row) => {
        if (row.pendingId !== token) throw new ChallengeError("Создание плана отменено");
        return tx.challenge30.update({ where: { userId }, data: { data: json(plan), pendingId: null, pendingAt: null, revision: { increment: 1 } } });
      });
      return NextResponse.json(publicRow(updated));
    }
    const updated = await locked(userId, async (tx, row) => {
      if (row.revision !== b.revision) throw new ChallengeError("Изменения уже сохранены с другого устройства. Обнови страницу");
      let plan = row.data as Plan30 | null;
      if (b.action === "delete") {
        if (b.confirm !== true) throw new ChallengeError("Подтверди удаление челленджа");
        plan = null;
      } else {
        if (row.pendingId && row.pendingAt && Date.now() - row.pendingAt.getTime() < 90_000) throw new ChallengeError("Дождись создания плана");
        if (!plan || b.planId !== plan.id) throw new ChallengeError("План не найден. Обнови страницу");
        if (b.action === "start") {
          if (plan.startDate) throw new ChallengeError("Челлендж уже начат");
          if (b.offset !== 0 && b.offset !== 1) throw new ChallengeError("Начни сегодня или завтра");
          plan.startDate = plusDays(localDay(plan.brief.timezone), b.offset);
        } else if (b.action === "log") {
          logBlock(plan, b.day, b.blockId, b.minutes);
        } else throw new ChallengeError("Неизвестное действие");
      }
      return tx.challenge30.update({ where: { userId }, data: { data: json(plan), pendingId: null, pendingAt: null, revision: { increment: 1 } } });
    });
    return NextResponse.json(publicRow(updated));
  } catch (e) {
    if (reservation) await prisma.challenge30.updateMany({ where: { userId, pendingId: reservation }, data: { pendingId: null, pendingAt: null } }).catch(() => {});
    return NextResponse.json({ error: e instanceof ChallengeError ? e.message : "Не удалось создать или сохранить план. Повтори загрузку. Попытка обращения к ИИ учитывается в дневном лимите." }, { status: e instanceof ChallengeError ? 400 : 502 });
  }
}
