/**
 * Сообщество как соцсеть: лента с фото, подписки, лайки, комментарии,
 * активность, поиск людей и открытых команд. Команды с их обсуждениями,
 * квестами и комнатами живут в communityDb.ts и здесь не меняются.
 *
 * Кто участвует. Отдельного «профиля в сообществе» нет: профиль — это сам
 * аккаунт YeahGrind (имя, персонаж, уровень, серия). Участником считается
 * каждый, кто принял действующую политику: именно в ней сказано, что эти
 * данные видны другим вошедшим. Тот, кто политику ещё не принял, никому не
 * показывается и сам действовать не может — ему предлагают одну кнопку.
 * Кто не хочет быть на виду, скрывает себя переключателем: тогда его нет
 * ни в поиске, ни в ленте, а сам он может только читать.
 */

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { characterStageForLevel, skinImageForStage } from "./characterSkins";
import { CommunityError, textField } from "./community";
import { blockedIds } from "./communityDb";
import { POLICY_VERSION } from "./personalization";
import { mediaUrl } from "./socialMedia";

/** Кого видно в сообществе: принял действующую политику, не скрыт и не заблокирован владельцем. */
export const MEMBER = {
  banned: false,
  personalization: { is: { data: { path: ["version"], equals: POLICY_VERSION } } },
  NOT: { communityProfile: { is: { hidden: true } } },
} satisfies Prisma.UserWhereInput;

const PAGE = 20;
const DAY = 86_400_000;

const AUTHOR = {
  select: { id: true, name: true, communityProfile: { select: { avatarId: true } }, publicStats: { select: { level: true, streak: true } } },
} satisfies Prisma.UserDefaultArgs;
type Author = Prisma.UserGetPayload<typeof AUTHOR>;

/**
 * Аватар: загруженное фото, а если его нет — персонаж аккаунта той стадии,
 * до которой человек дорос. `character` подсказывает экрану, что картинку
 * надо кадрировать по лицу, а не по центру.
 */
function person(u: Author) {
  const level = u.publicStats?.level ?? 1;
  const avatarId = u.communityProfile?.avatarId;
  return {
    userId: u.id,
    name: u.name || "Студент",
    avatar: avatarId ? mediaUrl(avatarId) : `/characters/${characterStageForLevel(level)}.webp`,
    character: !avatarId,
    level,
    streak: u.publicStats?.streak ?? 0,
  };
}

/** Может ли человек действовать в сообществе; если нет — понятная причина. */
export async function requireMember(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { personalization: { select: { data: true } }, communityProfile: { select: { hidden: true } } } });
  const version = (user?.personalization?.data as { version?: string } | null)?.version;
  if (version !== POLICY_VERSION) throw new CommunityError("Сначала прими политику — это одна кнопка, и сообщество откроется", 403);
  if (user?.communityProfile?.hidden) throw new CommunityError("Ты скрыт из сообщества. Включи видимость во вкладке «Профиль», чтобы писать и подписываться", 403);
}

const postInclude = (viewer: string) => ({
  user: AUTHOR,
  media: { orderBy: { position: "asc" as const }, select: { id: true, width: true, height: true } },
  _count: { select: { likes: true, replies: true } },
  likes: { where: { userId: viewer }, select: { userId: true } },
});
type PostRow = Prisma.SocialPostGetPayload<{ include: ReturnType<typeof postInclude> }>;

function postView(p: PostRow, viewer: string) {
  return {
    id: p.id, text: p.text, createdAt: p.createdAt, ...person(p.user),
    media: p.media.map((m) => ({ src: mediaUrl(m.id), width: m.width, height: m.height })),
    likes: p._count.likes, comments: p._count.replies, liked: p.likes.length > 0, mine: p.userId === viewer,
  };
}

/** Короткая сводка о себе: шапка сообщества и отметка о новой активности. */
export async function socialHome(viewer: string) {
  const [user, followers, following, posts] = await Promise.all([
    prisma.user.findUnique({ where: { id: viewer }, select: { ...AUTHOR.select, personalization: { select: { data: true } }, communityProfile: { select: { avatarId: true, hidden: true, noticesSeenAt: true } } } }),
    prisma.follow.count({ where: { followingId: viewer, follower: MEMBER } }),
    prisma.follow.count({ where: { followerId: viewer, following: MEMBER } }),
    prisma.socialPost.count({ where: { userId: viewer, parentId: null } }),
  ]);
  const accepted = (user?.personalization?.data as { version?: string } | null)?.version === POLICY_VERSION;
  const since = user?.communityProfile?.noticesSeenAt ?? new Date(0);
  const [newFollows, newLikes, newComments] = await Promise.all([
    prisma.follow.count({ where: { followingId: viewer, createdAt: { gt: since }, follower: MEMBER } }),
    prisma.socialLike.count({ where: { post: { userId: viewer }, userId: { not: viewer }, createdAt: { gt: since }, user: MEMBER } }),
    prisma.socialPost.count({ where: { parent: { userId: viewer }, userId: { not: viewer }, createdAt: { gt: since }, user: MEMBER } }),
  ]);
  return {
    ...person(user ?? { id: viewer, name: null, communityProfile: null, publicStats: null }),
    accepted, hidden: !!user?.communityProfile?.hidden, canAct: accepted && !user?.communityProfile?.hidden,
    followers, following, posts, unread: newFollows + newLikes + newComments,
  };
}

function cursorDate(before?: string | null) {
  if (!before) return null;
  const date = new Date(before);
  if (Number.isNaN(date.getTime())) throw new CommunityError("Некорректный запрос");
  return date;
}

/**
 * Лента. «following» — посты тех, на кого подписан, и свои; «all» — все
 * свежие посты; «explore» — только посты с фото, для сетки «Интересное».
 * Страницы — по времени (before), а не по номеру: новый пост сверху не
 * сдвигает уже показанные.
 */
export async function feed(viewer: string, scope: string, before?: string | null) {
  const blocked = await blockedIds(viewer);
  let authors: string[] | null = null;
  if (scope === "following") {
    const rows = await prisma.follow.findMany({ where: { followerId: viewer }, select: { followingId: true } });
    authors = [viewer, ...rows.map((r) => r.followingId)];
  }
  const cursor = cursorDate(before);
  const take = scope === "explore" ? 30 : PAGE;
  const rows = await prisma.socialPost.findMany({
    where: {
      parentId: null,
      userId: { notIn: blocked, ...(authors ? { in: authors } : {}) },
      // Свои посты видны автору всегда — даже если он скрыт или ещё не принял политику.
      OR: [{ user: MEMBER }, { userId: viewer }],
      ...(scope === "explore" ? { media: { some: {} } } : {}),
      ...(cursor ? { createdAt: { lt: cursor } } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: take + 1,
    include: postInclude(viewer),
  });
  return { posts: rows.slice(0, take).map((p) => postView(p, viewer)), more: rows.length > take };
}

/** Пост с комментариями — открывается по нажатию, в ленте только счётчик. */
export async function thread(viewer: string, postId: string) {
  const blocked = await blockedIds(viewer);
  const post = await prisma.socialPost.findFirst({ where: { id: postId, parentId: null, userId: { notIn: blocked }, OR: [{ user: MEMBER }, { userId: viewer }] }, include: postInclude(viewer) });
  if (!post) throw new CommunityError("Пост недоступен", 404);
  const comments = await prisma.socialPost.findMany({
    where: { parentId: postId, userId: { notIn: blocked }, OR: [{ user: MEMBER }, { userId: viewer }] },
    orderBy: { createdAt: "asc" },
    take: 200,
    include: postInclude(viewer),
  });
  return { post: postView(post, viewer), comments: comments.map((c) => postView(c, viewer)) };
}

/** Виден ли человек зрителю: участник сообщества и не в блокировке. Себя видно всегда. */
async function assertVisible(viewer: string, id: string) {
  if (viewer === id) return;
  if ((await blockedIds(viewer)).includes(id)) throw new CommunityError("Профиль недоступен", 404);
  if (!(await prisma.user.findFirst({ where: { id, ...MEMBER }, select: { id: true } }))) throw new CommunityError("Профиль недоступен", 404);
}

/** Профиль: данные аккаунта YeahGrind, счётчики и посты. */
export async function profileView(viewer: string, id: string) {
  await assertVisible(viewer, id);
  const [user, learning, followers, following, isFollowing, followsMe, posts, postCount] = await Promise.all([
    prisma.user.findUnique({ where: { id }, select: { ...AUTHOR.select, publicStats: { select: { level: true, streak: true, xp: true } }, communityProfile: { select: { avatarId: true, hidden: true, bio: true, subjects: true, goals: true } } } }),
    prisma.learningProfile.findUnique({ where: { userId: id }, select: { data: true } }),
    prisma.follow.count({ where: { followingId: id, follower: MEMBER } }),
    prisma.follow.count({ where: { followerId: id, following: MEMBER } }),
    prisma.follow.findUnique({ where: { followerId_followingId: { followerId: viewer, followingId: id } } }),
    prisma.follow.findUnique({ where: { followerId_followingId: { followerId: id, followingId: viewer } } }),
    prisma.socialPost.findMany({ where: { userId: id, parentId: null }, orderBy: { createdAt: "desc" }, take: 30, include: postInclude(viewer) }),
    prisma.socialPost.count({ where: { userId: id, parentId: null } }),
  ]);
  if (!user) throw new CommunityError("Профиль недоступен", 404);
  const base = person(user);
  const equipped = (learning?.data as { equipped?: string } | null)?.equipped;
  return {
    ...base,
    // Персонаж целиком, в надетом скине — то, как человек выглядит в самом приложении.
    figure: skinImageForStage(equipped, characterStageForLevel(base.level)),
    xp: user.publicStats?.xp ?? 0,
    bio: user.communityProfile?.bio ?? "", subjects: user.communityProfile?.subjects ?? [], goals: user.communityProfile?.goals ?? [],
    hidden: !!user.communityProfile?.hidden,
    followers, following, postCount,
    isFollowing: !!isFollowing, followsMe: !!followsMe, mine: viewer === id,
    posts: posts.map((p) => postView(p, viewer)),
  };
}

async function people(viewer: string, where: Prisma.UserWhereInput, take: number) {
  const blocked = await blockedIds(viewer);
  const rows = await prisma.user.findMany({
    where: { AND: [where, MEMBER, { id: { notIn: [...blocked, viewer] } }] },
    select: { ...AUTHOR.select, communityProfile: { select: { avatarId: true, bio: true, subjects: true } }, _count: { select: { followers: true } } },
    orderBy: { followers: { _count: "desc" } },
    take,
  });
  const mine = await prisma.follow.findMany({ where: { followerId: viewer, followingId: { in: rows.map((r) => r.id) } }, select: { followingId: true } });
  const followed = new Set(mine.map((m) => m.followingId));
  return rows.map((r) => ({ ...person(r), bio: (r.communityProfile?.bio ?? "").slice(0, 140), subjects: r.communityProfile?.subjects.slice(0, 3) ?? [], followers: r._count.followers, isFollowing: followed.has(r.id) }));
}

/** Поиск по имени; без запроса — те, кого чаще всего читают. */
export async function searchPeople(viewer: string, query: string) {
  const q = query.trim().slice(0, 60);
  return { people: await people(viewer, q ? { name: { contains: q, mode: "insensitive" } } : {}, 30) };
}

/** Кого почитать: участники, на которых зритель ещё не подписан. */
export async function suggestions(viewer: string) {
  return { people: await people(viewer, { followers: { none: { followerId: viewer } } }, 8) };
}

export async function followList(viewer: string, id: string, kind: "followers" | "following") {
  await assertVisible(viewer, id);
  const where = kind === "followers" ? { following: { some: { followingId: id } } } : { followers: { some: { followerId: id } } };
  return { people: await people(viewer, where, 100) };
}

/**
 * «Активность»: кто подписался, лайкнул и прокомментировал.
 *
 * Отдельной таблицы уведомлений нет — события и так лежат в подписках,
 * лайках и комментариях, их достаточно собрать и упорядочить по времени.
 * Так уведомление не может разойтись с действительностью: убрали лайк —
 * пропала и строка.
 */
export async function notices(viewer: string) {
  const blocked = await blockedIds(viewer);
  const post = { select: { id: true, text: true, parentId: true, media: { orderBy: { position: "asc" as const }, take: 1, select: { id: true } } } };
  const [follows, likes, comments, profile] = await Promise.all([
    prisma.follow.findMany({ where: { followingId: viewer, followerId: { notIn: blocked }, follower: MEMBER }, orderBy: { createdAt: "desc" }, take: 30, select: { createdAt: true, follower: AUTHOR } }),
    prisma.socialLike.findMany({ where: { post: { userId: viewer }, userId: { not: viewer, notIn: blocked }, user: MEMBER }, orderBy: { createdAt: "desc" }, take: 30, select: { createdAt: true, user: AUTHOR, post } }),
    prisma.socialPost.findMany({ where: { parent: { userId: viewer }, userId: { not: viewer, notIn: blocked }, user: MEMBER }, orderBy: { createdAt: "desc" }, take: 30, select: { createdAt: true, text: true, user: AUTHOR, parent: post } }),
    prisma.communityProfile.findUnique({ where: { userId: viewer }, select: { noticesSeenAt: true } }),
  ]);
  const thumb = (p: { id: string; text: string; parentId: string | null; media: { id: string }[] } | null) =>
    p ? { postId: p.parentId ?? p.id, excerpt: p.text.slice(0, 80), image: p.media[0] ? mediaUrl(p.media[0].id) : null } : { postId: null, excerpt: "", image: null };
  const seenAt = profile?.noticesSeenAt?.getTime() ?? 0;
  const items = [
    ...follows.map((f) => ({ kind: "follow" as const, at: f.createdAt, ...person(f.follower), postId: null as string | null, excerpt: "", image: null as string | null, comment: "" })),
    ...likes.map((l) => ({ kind: "like" as const, at: l.createdAt, ...person(l.user), ...thumb(l.post), comment: "" })),
    ...comments.map((c) => ({ kind: "comment" as const, at: c.createdAt, ...person(c.user), ...thumb(c.parent), comment: c.text.slice(0, 120) })),
  ].sort((a, b) => b.at.getTime() - a.at.getTime()).slice(0, 50);
  return { notices: items.map((n) => ({ ...n, fresh: n.at.getTime() > seenAt })) };
}

/** Открытые команды — их видно в поиске, и в них можно вступить без приглашения. */
export async function discoverTeams(viewer: string, query: string) {
  const q = query.trim().slice(0, 60);
  const blocked = await blockedIds(viewer);
  const rows = await prisma.studyTeam.findMany({
    where: { open: true, ownerId: { notIn: blocked }, ...(q ? { OR: [{ name: { contains: q, mode: "insensitive" as const } }, { subject: { contains: q, mode: "insensitive" as const } }] } : {}) },
    select: { id: true, name: true, subject: true, about: true, _count: { select: { members: true } }, members: { where: { userId: viewer }, select: { userId: true } } },
    orderBy: { members: { _count: "desc" } },
    take: 30,
  });
  return { teams: rows.map((t) => ({ id: t.id, name: t.name, subject: t.subject, about: t.about, members: t._count.members, joined: t.members.length > 0 })) };
}

const SOCIAL_ACTIONS = ["follow", "unfollow", "socialPost", "comment", "like", "unlike", "deleteSocial", "reportSocial", "teamSettings", "joinOpen", "setAvatar", "visibility", "seenNotices"];
export const isSocialAction = (action: unknown): action is string => typeof action === "string" && SOCIAL_ACTIONS.includes(action);

export async function socialAction(userId: string, body: Record<string, unknown>) {
  const action = body.action as string;

  if (action === "visibility") {
    if (typeof body.hidden !== "boolean") throw new CommunityError("Некорректный запрос");
    await prisma.communityProfile.upsert({ where: { userId }, create: { userId, hidden: body.hidden }, update: { hidden: body.hidden } });
    return;
  }

  if (action === "seenNotices") {
    const now = new Date();
    await prisma.communityProfile.upsert({ where: { userId }, create: { userId, noticesSeenAt: now }, update: { noticesSeenAt: now } });
    return;
  }

  if (action === "teamSettings") {
    const teamId = textField(body.teamId, 100);
    if (typeof body.open !== "boolean") throw new CommunityError("Некорректный запрос");
    const team = await prisma.studyTeam.findUnique({ where: { id: teamId }, select: { ownerId: true } });
    if (!team || team.ownerId !== userId) throw new CommunityError("Только организатор команды", 403);
    await prisma.studyTeam.update({ where: { id: teamId }, data: { open: body.open, about: textField(body.about, 300, true) } });
    return;
  }

  if (action === "joinOpen") {
    const teamId = textField(body.teamId, 100);
    const team = await prisma.studyTeam.findUnique({ where: { id: teamId }, select: { id: true, open: true, ownerId: true } });
    if (!team?.open) throw new CommunityError("Команда закрыта — нужна ссылка-приглашение", 403);
    if ((await blockedIds(userId)).includes(team.ownerId)) throw new CommunityError("Команда недоступна", 403);
    return prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM "StudyTeam" WHERE id = ${teamId} FOR UPDATE`;
      if ((await tx.studyMember.count({ where: { teamId } })) >= 100 || (await tx.studyMember.count({ where: { userId } })) >= 20) throw new CommunityError("Достигнут лимит участников или команд");
      await tx.studyMember.upsert({ where: { teamId_userId: { teamId, userId } }, create: { teamId, userId }, update: {} });
      return { teamId };
    });
  }

  await requireMember(userId);

  if (action === "setAvatar") {
    // null — вернуть персонажа аккаунта вместо загруженного фото.
    const mediaId = body.mediaId === null ? null : textField(body.mediaId, 100);
    if (mediaId && !(await prisma.socialMedia.findFirst({ where: { id: mediaId, userId, kind: "avatar" } }))) throw new CommunityError("Фото не найдено", 404);
    const previous = await prisma.communityProfile.findUnique({ where: { userId }, select: { avatarId: true } });
    await prisma.communityProfile.upsert({ where: { userId }, create: { userId, avatarId: mediaId }, update: { avatarId: mediaId } });
    // Прежний аватар больше никому не нужен — не оставляем его в базе.
    if (previous?.avatarId && previous.avatarId !== mediaId) await prisma.socialMedia.deleteMany({ where: { id: previous.avatarId, userId } });
    return;
  }

  if (action === "follow" || action === "unfollow") {
    const target = textField(body.userId, 100);
    if (target === userId) throw new CommunityError("На себя подписаться нельзя");
    if (action === "unfollow") {
      await prisma.follow.deleteMany({ where: { followerId: userId, followingId: target } });
      return;
    }
    await assertVisible(userId, target);
    if ((await prisma.follow.count({ where: { followerId: userId } })) >= 2000) throw new CommunityError("Достигнут лимит подписок");
    await prisma.follow.upsert({ where: { followerId_followingId: { followerId: userId, followingId: target } }, create: { followerId: userId, followingId: target }, update: {} });
    return;
  }

  if (action === "socialPost" || action === "comment") {
    const since = new Date(Date.now() - DAY);
    if (action === "socialPost") {
      const mediaIds = Array.isArray(body.mediaIds) ? body.mediaIds : [];
      if (mediaIds.length > 4 || mediaIds.some((id) => typeof id !== "string") || new Set(mediaIds).size !== mediaIds.length) throw new CommunityError("К посту можно прикрепить до 4 фото");
      // Подпись к фото необязательна, пост без фото и без текста — пустой.
      const text = textField(body.text ?? "", 2000, mediaIds.length > 0);
      // Потолок на сутки — от спама: рейт-лимит в памяти сбрасывается при каждом деплое.
      if ((await prisma.socialPost.count({ where: { userId, parentId: null, createdAt: { gt: since } } })) >= 20) throw new CommunityError("Не больше 20 постов в сутки");
      return prisma.$transaction(async (tx) => {
        const post = await tx.socialPost.create({ data: { userId, text } });
        for (const [position, id] of (mediaIds as string[]).entries()) {
          // Привязываем только свои и ещё свободные фото: чужой id просто не найдётся.
          const linked = await tx.socialMedia.updateMany({ where: { id, userId, kind: "post", postId: null }, data: { postId: post.id, position } });
          if (!linked.count) throw new CommunityError("Фото не найдено — загрузи его ещё раз");
        }
        return { postId: post.id };
      });
    }
    const postId = textField(body.postId, 100);
    const blocked = await blockedIds(userId);
    const parent = await prisma.socialPost.findFirst({ where: { id: postId, parentId: null, userId: { notIn: blocked }, OR: [{ user: MEMBER }, { userId }] } });
    if (!parent) throw new CommunityError("Пост недоступен", 404);
    if ((await prisma.socialPost.count({ where: { userId, parentId: { not: null }, createdAt: { gt: since } } })) >= 200) throw new CommunityError("Слишком много комментариев за сутки");
    if ((await prisma.socialPost.count({ where: { parentId: postId } })) >= 500) throw new CommunityError("Под постом уже 500 комментариев");
    await prisma.socialPost.create({ data: { userId, parentId: postId, text: textField(body.text, 1000) } });
    return;
  }

  const postId = textField(body.postId, 100);

  if (action === "like" || action === "unlike") {
    if (action === "unlike") {
      await prisma.socialLike.deleteMany({ where: { postId, userId } });
      return;
    }
    const blocked = await blockedIds(userId);
    if (!(await prisma.socialPost.findFirst({ where: { id: postId, userId: { notIn: blocked }, OR: [{ user: MEMBER }, { userId }] } }))) throw new CommunityError("Пост недоступен", 404);
    await prisma.socialLike.upsert({ where: { postId_userId: { postId, userId } }, create: { postId, userId }, update: {} });
    return;
  }

  if (action === "deleteSocial") {
    // deleteMany с автором в условии: чужой пост просто не найдётся. Фото уходят каскадом.
    const removed = await prisma.socialPost.deleteMany({ where: { id: postId, userId } });
    if (!removed.count) throw new CommunityError("Можно удалить только свою публикацию", 403);
    return;
  }

  if (action === "reportSocial") {
    const post = await prisma.socialPost.findUnique({ where: { id: postId }, select: { userId: true } });
    if (!post) throw new CommunityError("Пост не найден", 404);
    if (post.userId === userId) throw new CommunityError("Свой пост можно просто удалить");
    const reason = textField(body.reason, 500);
    await prisma.socialReport.upsert({ where: { postId_userId: { postId, userId } }, create: { postId, userId, reason }, update: { reason, resolved: false } });
    return;
  }

  throw new CommunityError("Неизвестное действие");
}
