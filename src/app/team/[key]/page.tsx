import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import TaskDetail from "@/components/team/TaskDetail";
import { parseKey } from "@/lib/tracker";
import { teamUser } from "@/lib/trackerAccess";

export const metadata: Metadata = { title: "Task — YeahGrind team", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  if (!parseKey(key)) notFound();
  const me = await teamUser();
  if (me === "anonymous") redirect(`/login?callbackUrl=/team/${encodeURIComponent(key)}`);
  if (!me) redirect("/team");
  return <TaskDetail taskKey={key.toUpperCase()} />;
}
