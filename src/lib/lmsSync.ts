import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { parseEvents } from "@/lib/ical";
import { planSync, newDeadlineNotice, DEFAULT_ZONE } from "@/lib/lmsCalendar";
import { makeId, type StateShape, type Todo } from "@/lib/externalState";
import { sendPushToUser, pushConfigured } from "@/lib/push";
import { fetchLmsCalendar } from "@/lib/lmsClient";

export async function syncLmsCalendar(userId: string, url: string, zone = DEFAULT_ZONE, dry = false) {
  const events = parseEvents(await fetchLmsCalendar(url), zone);
  const result = await prisma.$transaction(async (tx) => {
    if (!dry) {
      await tx.userState.upsert({ where: { userId }, create: { userId, data: {}, clientAt: new Date(0) }, update: {} });
      await tx.$queryRaw`SELECT "userId" FROM "UserState" WHERE "userId" = ${userId} FOR UPDATE`;
    }
    const row = await tx.userState.findUnique({ where: { userId } });
    const state = (row?.data ?? {}) as StateShape;
    const existing = Array.isArray(state.todos) ? state.todos : [];
    const plan = planSync(events, existing, { zone });
    const now = Math.max(Date.now(), (row?.clientAt.getTime() ?? 0) + 1);
    if (!dry && plan.create.length) {
      const todos: Todo[] = plan.create.map((draft) => ({
        ...draft, id: makeId(), subtasks: [], done: false, doneDays: [], createdAt: now, completedAt: null,
      }));
      await tx.userState.update({ where: { userId }, data: {
        data: { ...state, todos: [...todos, ...existing], updatedAt: now } as unknown as Prisma.InputJsonValue,
        clientAt: new Date(now),
      } });
    }
    return plan;
  });
  if (!dry && result.create.length && pushConfigured) {
    const notice = newDeadlineNotice(result.create, new Date().toISOString().slice(0, 10));
    try { if (notice) await sendPushToUser(userId, notice); } catch { /* Calendar is already saved. */ }
  }
  return { ok: true, dry, events: events.length, created: dry ? 0 : result.create.length,
    wouldCreate: result.create.length, alreadyPresent: result.alreadyPresent, unusable: result.unusable };
}
