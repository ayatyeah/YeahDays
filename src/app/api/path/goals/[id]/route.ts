/**
 * GET — экран цели (план дня, карта навыков, круг). POST — действия
 * участника: чек-ин, «отложить», настройки, репост, жалоба; и владельца:
 * участники, приглашение, решения по жалобам, удаление цели.
 */
import {
  checkIn, deleteGoal, goalView, leave, PathError, postpone, removeMember, reportContent,
  resolveReport, rotateInvite, shareEvent, shareToFeed, skipPlacement, updateSettings,
} from "@/lib/path/service";
import { json, readBody, withUser } from "@/lib/path/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  return withUser(async (userId) => json(await goalView(userId, id)));
}

export async function POST(req: Request, { params }: Ctx) {
  const { id } = await params;
  return withUser(async (userId) => {
    const body = await readBody(req);
    const str = (v: unknown) => (typeof v === "string" ? v : "");
    switch (body.action) {
      case "checkin": await checkIn(userId, id, body.energy, body.minutes); break;
      case "postpone": await postpone(userId, str(body.unitId)); break;
      case "settings": await updateSettings(userId, id, body); break;
      case "skipPlacement": await skipPlacement(userId, id); break;
      case "leave": await leave(userId, id); return json({ ok: true });
      case "delete": await deleteGoal(userId, id); return json({ ok: true });
      case "removeMember": await removeMember(userId, id, str(body.userId)); break;
      case "rotateInvite": await rotateInvite(userId, id); break;
      case "shareEvent": await shareEvent(userId, str(body.eventId)); break;
      case "share": return json({ postId: await shareToFeed(userId, id, body) }, 201);
      case "report": await reportContent(userId, id, body); return json({ ok: true }, 201);
      case "resolveReport": await resolveReport(userId, id, str(body.reportId), body.decision); break;
      default: throw new PathError("Неизвестное действие", 422);
    }
    return json(await goalView(userId, id));
  }, true);
}
