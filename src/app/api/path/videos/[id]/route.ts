/** GET — статус и сценарий видео (зависшую задачу перезапускает); POST approve — владелец разрешает озвучку после проверки. */
import { after } from "next/server";
import { PathError } from "@/lib/path/service";
import { approveVideo, runVideo, videoStatus } from "@/lib/path/video";
import { json, readBody, withUser } from "@/lib/path/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;
type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  return withUser(async (userId) => {
    const { kick, view } = await videoStatus(userId, id);
    if (kick) after(() => runVideo(id));
    return json(view);
  });
}

export async function POST(req: Request, { params }: Ctx) {
  const { id } = await params;
  return withUser(async (userId) => {
    const body = await readBody(req, 2000);
    if (body.action !== "approve") throw new PathError("Неизвестное действие", 422);
    await approveVideo(userId, id);
    after(() => runVideo(id));
    return json({ status: "queued" }, 202);
  }, true);
}
