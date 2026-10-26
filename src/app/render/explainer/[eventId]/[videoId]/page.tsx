import { notFound } from "next/navigation";
import { findEvent } from "@/lib/events";
import RenderStage from "./RenderStage";

/**
 * Сцена для рендера ролика в MP4 (scripts/video-render.mjs). Только локально:
 * без VIDEO_RENDER=1 страницы нет — на проде она не нужна.
 */
export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ eventId: string; videoId: string }> }) {
  if (process.env.VIDEO_RENDER !== "1") notFound();
  const { eventId, videoId } = await params;
  const video = findEvent(eventId)?.videos?.find((v) => v.id === videoId);
  if (!video) notFound();
  const index = findEvent(eventId)!.videos!.indexOf(video);
  return <RenderStage video={video} backdrop={index} course={findEvent(eventId)!.course.split(" · ")[0]} />;
}
