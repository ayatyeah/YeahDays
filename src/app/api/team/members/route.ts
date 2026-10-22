/**
 * Участники трекера. GET — список (любой участник); POST/DELETE — добавить
 * или убрать участника по email (только владелец).
 */
import { prisma } from "@/lib/db";
import { deny, json, readJson, teamUser, teamWriter } from "@/lib/trackerAccess";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET() {
  const me = await teamUser();
  if (!me || me === "anonymous") return deny(me);
  return json({ members: await prisma.trackerMember.findMany({ orderBy: { addedAt: "asc" } }) });
}

async function ownerBody(req: Request) {
  const me = await teamWriter();
  if (!("email" in me)) return { error: me };
  if (!me.isOwner) return { error: json({ error: "Only the owner can manage members" }, 403) };
  try { return { body: (await readJson(req, 2_000)) as { email?: unknown; name?: unknown } }; } catch { return { error: json({ error: "Invalid JSON" }, 400) }; }
}

export async function POST(req: Request) {
  const { body, error } = await ownerBody(req);
  if (error) return error;
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const name = typeof body?.name === "string" ? body.name.trim().slice(0, 80) : "";
  if (!EMAIL.test(email) || email.length > 200) return json({ error: "Enter a valid e-mail" }, 400);
  if (!name) return json({ error: "Enter a display name" }, 400);
  const member = await prisma.trackerMember.upsert({ where: { email }, create: { email, name }, update: { name } });
  return json({ member }, 201);
}

export async function DELETE(req: Request) {
  const { body, error } = await ownerBody(req);
  if (error) return error;
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const removed = await prisma.trackerMember.deleteMany({ where: { email } });
  return removed.count ? json({ ok: true }) : json({ error: "Not a member" }, 404);
}
