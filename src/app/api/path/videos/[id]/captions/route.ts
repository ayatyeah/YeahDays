/** Субтитры WebVTT к готовому видео (FR-19). */
import { captionsFor } from "@/lib/path/video";
import { withUser } from "@/lib/path/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  return withUser(async (userId) => new Response(await captionsFor(userId, id), { headers: { "Content-Type": "text/vtt; charset=utf-8", "Cache-Control": "private, max-age=3600" } }));
}
