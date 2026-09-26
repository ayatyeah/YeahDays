import { prisma } from "@/lib/db";

/** Legacy device IDs are allowed only for truly anonymous users, including before their first write. */
export async function resolveAnonymousUserId(value: unknown): Promise<string> {
  const id = typeof value === "string" ? value.slice(0, 64) : "";
  if (!id) return "";
  const user = await prisma.user.findUnique({ where: { id }, select: {
    email: true, username: true, passwordHash: true, banned: true,
    accounts: { select: { id: true }, take: 1 },
  } });
  return user && (user.email || user.username || user.passwordHash || user.banned || user.accounts.length) ? "" : id;
}
