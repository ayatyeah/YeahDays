import type { Metadata } from "next";
import { notFound } from "next/navigation";
import StoryPlayer from "@/components/stories/StoryPlayer";
import { STORIES, storyById, storyTimings } from "@/lib/stories";

/**
 * История — статическая страница на каждую историю: сценарий и тайминги
 * озвучки вшиты при сборке, кадры и звук — файлы из public/stories.
 */
export function generateStaticParams() {
  return STORIES.map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const story = storyById((await params).id);
  return { title: story ? `${story.title} — Истории YeahGrind` : "История — YeahGrind" };
}

export default async function StoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const story = storyById(id);
  if (!story) notFound();
  return <StoryPlayer story={story} timings={storyTimings(id)} />;
}
