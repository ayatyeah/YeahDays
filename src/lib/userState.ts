/**
 * Атомарная запись UserState с last-write-wins по clientAt.
 *
 * И /api/state (PUT из браузера), и внешние интеграции
 * (/api/integrations/*) писали сюда через read-then-write в два отдельных
 * запроса: сначала findUnique, потом (если локально не устарело) upsert.
 * Между этими двумя шагами нет блокировки — два почти одновременных
 * запроса (например, "добавь задачу" из стороннего сервиса и
 * автосохранение из открытой вкладки браузера) оба читают
 * "существующее не новее меня" ДО того, как
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
 *
 * Стоимость. Раньше одна запись = три похода в базу: upsert User (на
 * случай анонимного device-id), сама запись, и контрольное чтение, чтобы
 * узнать, применилась ли она. С прокси Railway каждый поход — сотни
 * миллисекунд, и автосохранение занимало 2+ секунды. Теперь один: запись
 * с RETURNING говорит сама, применилась ли; User создаётся только если
 * база ответила нарушением внешнего ключа (анонимное устройство впервые);
 * повторное чтение — только при реальном отказе (гонка с другим устройством).
 */
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

export interface UserStateWriteResult {
  /** false — на сервере уже было не старше нашего clientAt, наша запись отклонена. */
  applied: boolean;
  data: Prisma.JsonValue;
  clientAt: number;
}

/** Postgres 23503 — foreign_key_violation: строки User для этого id ещё нет. */
function isForeignKeyViolation(e: unknown): boolean {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    const meta = e.meta as { code?: string } | undefined;
    if (meta?.code === "23503") return true;
  }
  const msg = e instanceof Error ? e.message : String(e);
  return msg.includes("23503") || /foreign key/i.test(msg);
}

export async function upsertUserStateIfNewer(
  userId: string,
  data: unknown,
  clientAtMs: number,
): Promise<UserStateWriteResult> {
  const clientAt = new Date(clientAtMs);
  const json = JSON.stringify(data);

  const write = () =>
    prisma.$queryRaw<{ clientAt: Date }[]>`
      INSERT INTO "UserState" ("userId", "data", "clientAt", "updatedAt")
      VALUES (${userId}, ${json}::jsonb, ${clientAt}, now())
      ON CONFLICT ("userId") DO UPDATE
        SET "data" = EXCLUDED."data", "clientAt" = EXCLUDED."clientAt", "updatedAt" = now()
        WHERE "UserState"."clientAt" <= EXCLUDED."clientAt"
      RETURNING "clientAt"
    `;

  let rows: { clientAt: Date }[];
  try {
    rows = await write();
  } catch (e) {
    if (!isForeignKeyViolation(e)) throw e;
    // анонимное устройство пишет впервые — заводим User и повторяем
    await prisma.user.upsert({ where: { id: userId }, create: { id: userId }, update: {} });
    rows = await write();
  }

  if (rows.length > 0) {
    return { applied: true, data: data as Prisma.JsonValue, clientAt: clientAtMs };
  }

  // Отклонено (сервер не старше нас) — отдаём вызывающему то, что реально сейчас в БД.
  const existing = await prisma.userState.findUniqueOrThrow({ where: { userId } });
  return { applied: false, data: existing.data, clientAt: existing.clientAt.getTime() };
}
