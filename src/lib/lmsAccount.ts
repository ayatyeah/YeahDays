import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { encryptLmsUrl } from "@/lib/lmsConnection";
import { notifyNewUser } from "@/lib/telegram";

export const LMS_PROVIDER = "lms-aitu";
export class LmsAccountConflict extends Error {}

/** An LMS identity is keyed by Moodle's authenticated ID, never a supplied email/login. */
export async function saveLmsAccount(identity: { id: string; calendarUrl: string | null }, username: string, linkUserId?: string) {
  const encryptedUrl = identity.calendarUrl ? encryptLmsUrl(identity.calendarUrl) : null;
  let created = false;
  const write = () => prisma.$transaction(async (tx) => {
    created = false;
    const linked = await tx.account.findUnique({
      where: { provider_providerAccountId: { provider: LMS_PROVIDER, providerAccountId: identity.id } },
      include: { user: true },
    });
    if (linkUserId && linked && linked.userId !== linkUserId) throw new LmsAccountConflict();
    if (linkUserId) {
      const previous = await tx.account.findFirst({ where: { userId: linkUserId, provider: LMS_PROVIDER } });
      if (previous && previous.providerAccountId !== identity.id) throw new LmsAccountConflict();
    }
    let user = linked?.user ?? (linkUserId ? await tx.user.findUniqueOrThrow({ where: { id: linkUserId } }) : null);
    if (!user) {
      user = await tx.user.create({ data: { name: username } });
      created = true;
    }
    if (user.banned) throw new LmsAccountConflict();
    if (!linked) await tx.account.create({ data: {
      userId: user.id, type: "credentials", provider: LMS_PROVIDER, providerAccountId: identity.id,
    } });
    if (encryptedUrl) {
      await tx.lmsConnection.upsert({ where: { userId: user.id },
        create: { userId: user.id, encryptedUrl }, update: { encryptedUrl, lastError: null },
      });
    }
    return user;
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  // Concurrent first logins must resolve to one identity/account.
  for (let attempt = 0; ; attempt++) {
    try {
      const user = await write();
      // владельцу в Telegram; не ждём — вход от этого не зависит
      if (created) void notifyNewUser({ name: user.name, username }, LMS_PROVIDER);
      return user;
    }
    catch (e) {
      if (attempt < 2 && e instanceof Prisma.PrismaClientKnownRequestError && ["P2002", "P2034"].includes(e.code)) continue;
      throw e;
    }
  }
}
