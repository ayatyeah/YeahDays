import type { Metadata } from "next";
import { redirect } from "next/navigation";
import TeamTracker from "@/components/team/TeamTracker";
import { teamUser } from "@/lib/trackerAccess";

export const metadata: Metadata = { title: "Team tracker — YeahGrind", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function Page() {
  const me = await teamUser();
  if (me === "anonymous") redirect("/login?callbackUrl=/team");
  if (!me) return <main data-no-i18n className="mx-auto max-w-lg p-6 text-[var(--color-fg)]"><h1 className="text-xl font-bold">Team tracker</h1><p className="mt-2 text-sm text-[var(--color-fg-dim)]">This page is for the YeahGrind team. Ask the owner to add your e-mail as a member.</p></main>;
  return <TeamTracker />;
}
