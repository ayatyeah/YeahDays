/**
 * Кто пускается в командный трекер (/team): владелец сайта (OWNER_EMAIL)
 * и участники, которых он добавил в TrackerMember. Каждый работает под
 * своим аккаунтом — журнал изменений показывает, кто что сделал.
 */
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rateLimit";

export type TeamUser = { email: string; name: string; isOwner: boolean };

const norm = (email: string) => email.trim().toLowerCase();

export async function teamUser(): Promise<TeamUser | null | "anonymous"> {
  const session = await auth();
  const email = session?.user?.email ? norm(session.user.email) : "";
  if (!email) return "anonymous";
  const owner = process.env.OWNER_EMAIL ? norm(process.env.OWNER_EMAIL) : "";
  if (owner && email === owner) return { email, name: session?.user?.name || email, isOwner: true };
  const member = await prisma.trackerMember.findUnique({ where: { email } });
  return member ? { email, name: member.name, isOwner: false } : null;
}

const NO_STORE = { "Cache-Control": "private, no-store" };

export function deny(user: TeamUser | null | "anonymous") {
  return user === "anonymous"
    ? NextResponse.json({ error: "Sign in first" }, { status: 401, headers: NO_STORE })
    : NextResponse.json({ error: "Team members only" }, { status: 403, headers: NO_STORE });
}

/** Для изменений: участник команды и не больше 120 записей в минуту. */
export async function teamWriter(): Promise<TeamUser | NextResponse> {
  const user = await teamUser();
  if (!user || user === "anonymous") return deny(user);
  if (!rateLimit(`team:${user.email}`, 120, 60_000)) return NextResponse.json({ error: "Too many changes, try again in a minute" }, { status: 429, headers: NO_STORE });
  return user;
}

export function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: NO_STORE });
}

export async function readJson(req: Request, maxBytes = 64_000): Promise<unknown> {
  const raw = await req.text();
  if (raw.length > maxBytes) throw new Error("too large");
  return JSON.parse(raw);
}
