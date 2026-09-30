import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import InviteAccept from "./InviteAccept";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Приглашение в YeahGrind",
  // ссылку кидают в чаты — превью должно звать, а не показывать «Вход»
  description: "Тебя зовут в друзья: будете видеть серии друг друга.",
  robots: { index: false },
};

/**
 * /invite/<код> — страница, на которую ведёт ссылка «Пригласить друга».
 *
 * Публичная (см. proxy.ts): её открывают из мессенджера люди, у которых
 * аккаунта ещё нет. Серверная часть только узнаёт, кто зовёт; всё
 * остальное — вход, регистрация с возвратом сюда, принятие — в клиенте.
 */
export default async function InvitePage({ params }: { params: Promise<{ code: string }> }) {
  const { code: raw } = await params;
  const code = raw.trim().toUpperCase().slice(0, 16);

  const [owner, session] = await Promise.all([
    prisma.publicStats
      .findUnique({ where: { inviteCode: code }, select: { userId: true, name: true } })
      .catch(() => null),
    auth().catch(() => null),
  ]);

  return (
    <InviteAccept
      code={code}
      inviter={owner ? owner.name || "Друг" : null}
      signedIn={Boolean(session?.user?.id)}
      own={Boolean(owner && session?.user?.id === owner.userId)}
    />
  );
}
