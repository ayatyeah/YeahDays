/**
 * Друзья человека — общий список для рейтингов (ивенты, «Челлендж 30»).
 *
 * Заблокированные в любую сторону исключаются: рейтинг не должен
 * показывать человека тому, от кого он закрылся.
 */

import { prisma } from "@/lib/db";
import { blockedIds } from "@/lib/communityDb";

export async function friendIds(userId: string): Promise<string[]> {
  const [links, blocked] = await Promise.all([
    prisma.friendship.findMany({ where: { userId }, select: { friendId: true } }),
    blockedIds(userId),
  ]);
  return links.map((l) => l.friendId).filter((id) => !blocked.includes(id));
}

/** Имена так же, как в списке друзей: из публичной сводки, которую человек сам показывает. */
export async function publicNames(ids: string[]): Promise<Map<string, string>> {
  if (!ids.length) return new Map();
  const stats = await prisma.publicStats.findMany({ where: { userId: { in: ids } }, select: { userId: true, name: true } });
  const names = new Map(stats.map((s) => [s.userId, s.name]));
  return new Map(ids.map((id) => [id, names.get(id) || "Без имени"]));
}
