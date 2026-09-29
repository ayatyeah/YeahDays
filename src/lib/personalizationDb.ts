import { Prisma } from "@prisma/client";
import { prisma } from "./db";
import { emptyPersonalization, type Personalization } from "./personalization";
export async function mutatePersonalization<T>(userId: string, change: (profile: Personalization) => T | Promise<T>) {
  return prisma.$transaction(async tx => {
    await tx.personalizationProfile.upsert({ where: { userId }, create: { userId, data: emptyPersonalization() as unknown as Prisma.InputJsonValue }, update: {} });
    await tx.$queryRaw`SELECT "userId" FROM "PersonalizationProfile" WHERE "userId" = ${userId} FOR UPDATE`;
    const row = await tx.personalizationProfile.findUniqueOrThrow({ where: { userId } });
    const profile = row.data as unknown as Personalization;
    const result = await change(profile);
    profile.revision = (profile.revision ?? 0) + 1;
    await tx.personalizationProfile.update({ where: { userId }, data: { data: profile as unknown as Prisma.InputJsonValue } });
    return { profile, result };
  }, { timeout: 15000 });
}
