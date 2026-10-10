import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { EVENTS } from "@/lib/events";
export async function GET() {
  if (!(await auth())?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(
    EVENTS.filter((e) => !e.unlisted).map((e) => ({
      id: e.id,
      title: e.title,
      course: e.course,
    })),
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
