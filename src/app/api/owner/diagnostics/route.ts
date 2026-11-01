import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/owner";
import { prisma } from "@/lib/db";
export const dynamic = "force-dynamic";
export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const rows = await prisma.runtimeSignal.findMany({ where: { hour: { gte: new Date(Date.now() - 86400000) } }, orderBy: [{ hour: "desc" }, { count: "desc" }], take: 150 });
  return NextResponse.json({ rows }, { headers: { "Cache-Control": "no-store" } });
}
