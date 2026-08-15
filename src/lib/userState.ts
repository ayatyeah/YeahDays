/**
 * Атомарная запись UserState с last-write-wins по clientAt.
 *
 * И /api/state (PUT из браузера), и /api/assistant (запись от СалемАй)
 * писали сюда через read-then-write в два отдельных запроса: сначала
 * findUnique, потом (если локально не устарело) upsert. Между этими двумя
 * шагами нет блокировки — два почти одновременных запроса (например,
 * голосовое "добавь задачу" через СалемАй и автосохранение из открытой
 * вкладки браузера) оба читают "существующее не новее меня" ДО того, как
 * любой из них записал, и оба потом пишут — чья запись физически
 * завершится последней в БД, тот и победит, вне зависимости от того, чей
 * clientAt на самом деле свежее. Устаревшие данные могут затереть свежие.
 * Воспроизвёл вживую: включил поллинг на "Сегодня" и одновременно дёрнул
 * add_todo через assistant API — задача терялась именно так.
 *
 * Фикс — один атомарный SQL: INSERT ... ON CONFLICT ... WHERE. Postgres
 * гарантирует, что условие в WHERE и сама запись происходят как единая
 * операция под блокировкой строки, конкурирующий запрос не может
 * протиснуться между чтением условия и записью.
 */
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

export interface UserStateWriteResult {
  /** false — на сервере уже было не старше нашего clientAt, наша запись отклонена. */
  applied: boolean;
  data: Prisma.JsonValue;
  clientAt: number;
}

export async function upsertUserStateIfNewer(
  userId: string,
  data: unknown,
  clientAtMs: number,
): Promise<UserStateWriteResult> {
  await prisma.user.upsert({
    where: { id: userId },
    create: { id: userId },
    update: {},
  });

  const clientAt = new Date(clientAtMs);
  const json = JSON.stringify(data);

  const affected = await prisma.$executeRaw`
    INSERT INTO "UserState" ("userId", "data", "clientAt", "updatedAt")
    VALUES (${userId}, ${json}::jsonb, ${clientAt}, now())
    ON CONFLICT ("userId") DO UPDATE
      SET "data" = EXCLUDED."data", "clientAt" = EXCLUDED."clientAt", "updatedAt" = now()
      WHERE "UserState"."clientAt" <= EXCLUDED."clientAt"
  `;

  if (affected > 0) {
    return { applied: true, data: data as Prisma.JsonValue, clientAt: clientAtMs };
  }

  // Отклонено (сервер не старше нас) — отдаём вызывающему то, что реально сейчас в БД.
  const existing = await prisma.userState.findUniqueOrThrow({ where: { userId } });
  return { applied: false, data: existing.data, clientAt: existing.clientAt.getTime() };
}
