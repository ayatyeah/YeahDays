import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/owner";
import { prisma } from "@/lib/db";
export const dynamic = "force-dynamic";
export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const jobs = await prisma.backgroundJob.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json({ jobs });
  } catch {
    return NextResponse.json({ error: "Не удалось получить статус заданий" }, { status: 503 });
  }
}
