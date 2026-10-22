/** GET /api/team/export — все задачи в CSV для импорта в YouTrack. */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { toCsv } from "@/lib/tracker";
import { deny, teamUser } from "@/lib/trackerAccess";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const me = await teamUser();
  if (!me || me === "anonymous") return deny(me);
  const tasks = await prisma.trackerTask.findMany({ orderBy: { number: "asc" } });
  return new NextResponse(toCsv(tasks as unknown as Array<Record<string, unknown> & { number: number }>), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="yeahgrind-tasks-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "private, no-store",
    },
  });
}
