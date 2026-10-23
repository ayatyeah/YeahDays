/**
 * GET — юнит (текст, навыки с освоением, статус видео). POST prepare —
 * написать текст и банк вопросов при первом открытии; POST video —
 * готовое видео или новая задача (202), которая выполняется после ответа.
 */
import { after } from "next/server";
import { ensureUnit, PathError, unitView } from "@/lib/path/service";
import { requestVideo, runVideo } from "@/lib/path/video";
import { json, readBody, withUser } from "@/lib/path/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;
type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  return withUser(async (userId) => json(await unitView(userId, id)));
}

export async function POST(req: Request, { params }: Ctx) {
  const { id } = await params;
  return withUser(async (userId) => {
    const body = await readBody(req, 4000);
    if (body.action === "prepare") {
      const status = await ensureUnit(userId, id);
      return json({ status, unit: status === "ready" ? await unitView(userId, id) : null }, status === "ready" ? 200 : 202);
    }
    if (body.action === "video") {
      const { video, created } = await requestVideo(userId, id, body.rewrite === true);
      if (created || video.status === "queued") after(() => runVideo(video.id));
      return json({ videoId: video.id, status: video.status }, video.status === "succeeded" ? 200 : 202);
    }
    throw new PathError("Неизвестное действие", 422);
  }, true);
}
