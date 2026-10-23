/**
 * Учебная карточка из ленты сообщества: участник сразу попадает к тому,
 * чем поделились (цель, юнит, видео); остальным — предложение присоединиться.
 */
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { blockedIds } from "@/lib/communityDb";
import JoinGoal from "@/components/path/JoinGoal";

export const metadata = { title: "Учиться вместе — YeahGrind" };

export default async function Page({ params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params;
  const userId = (await auth())?.user?.id;
  if (!userId) redirect(`/login?callbackUrl=/learn/s/${postId}`);
  const share = await prisma.pathShare.findUnique({ where: { postId }, include: { post: { select: { userId: true } }, goal: { select: { title: true, subject: true, invite: true, owner: { select: { name: true } }, skills: { orderBy: { position: "asc" }, select: { name: true } }, _count: { select: { members: true, units: true } } } } } });
  if (!share || (await blockedIds(userId)).includes(share.post.userId)) notFound();
  const member = await prisma.pathMember.findUnique({ where: { goalId_userId: { goalId: share.goalId, userId } } });
  const target = share.unitId ? `/learn/g/${share.goalId}/u/${share.unitId}${share.kind === "video" ? "#video" : ""}` : `/learn/g/${share.goalId}`;
  if (member) redirect(target);
  const g = share.goal;
  // Приглашает только репост владельца с действующим кодом; иначе — только описание цели.
  const canJoin = !!share.invite && share.invite === g.invite;
  return <JoinGoal postId={postId} canJoin={canJoin} preview={{ title: g.title, subject: g.subject, owner: g.owner.name || "Студент", skills: g.skills.map((s) => s.name), members: g._count.members, units: g._count.units }} target={target} />;
}
