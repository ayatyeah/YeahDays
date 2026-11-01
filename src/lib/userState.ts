import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

/** Serializes with ALL writers via the UserState row lock. User lock also
 * serializes creation of the first state. Revision is incremented by a DB trigger. */
export async function mergeUserState(userId: string, base: Record<string, unknown> | null, incoming: Record<string, unknown>) {
  const { mergeSnapshots } = await import("./syncMerge");
  return prisma.$transaction(async tx => {
    await tx.user.upsert({ where: { id: userId }, create: { id: userId }, update: {} });
    await tx.$queryRaw`SELECT "id" FROM "User" WHERE "id" = ${userId} FOR UPDATE`;
    await tx.$queryRaw`SELECT "userId" FROM "UserState" WHERE "userId" = ${userId} FOR UPDATE`;
    const row = await tx.userState.findUnique({ where: { userId } });
    const data = row ? mergeSnapshots(base, incoming, row.data as Record<string, unknown>) : incoming;
    const now = Date.now();
    data.updatedAt = now;
    const saved = await tx.userState.upsert({ where: { userId },
      create: { userId, data: data as Prisma.InputJsonValue, clientAt: new Date(now) },
      update: { data: data as Prisma.InputJsonValue, clientAt: new Date(now) },
    });
    return { data: saved.data, revision: saved.revision };
  });
}
