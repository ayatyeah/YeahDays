/**
 * Сообщество как соцсеть: подписки, публичные посты, лайки, поиск людей и
 * открытых команд. Команды с их обсуждениями, квестами и комнатами живут в
 * communityDb.ts и здесь не меняются.
 *
 * Одно правило на весь файл: участвует только тот, кто сам опубликовал
 * профиль. Читать ленту и чужие профили может любой вошедший, но появиться
 * в поиске, написать пост, поставить лайк или подписаться — только после
 * согласия показывать своё имя. Тот, кто профиль снял, исчезает отовсюду
 * сразу: его посты и подписки не удаляются, но перестают показываться.
 */

import { prisma } from "@/lib/db";
import { CommunityError, textField } from "./community";
import { blockedIds, publicProfile } from "./communityDb";

const PUBLISHED = { communityProfile: { published: true } } as const;
const PAGE = 20;
const DAY = 86_400_000;

async function requireProfile(userId: string) {
  const profile = await prisma.communityProfile.findUnique({ where: { userId }, select: { published: true } });
  if (!profile?.published) throw new CommunityError("Сначала создай профиль в сообществе — тогда тебя увидят другие", 403);
}

type PostRow = {
  id: string; userId: string; text: string; createdAt: Date;
  user: { name: string | null };
  _count: { likes: number; replies: number };
  likes: { userId: string }[];
};

const postInclude = (viewer: string) => ({
  user: { select: { name: true } },
  _count: { select: { likes: true, replies: true } },
  likes: { where: { userId: viewer }, select: { userId: true } },
});

function postView(p: PostRow, viewer: string) {
  return { id: p.id, userId: p.userId, name: p.user.name || "Студент", text: p.text, createdAt: p.createdAt, likes: p._count.likes, comments: p._count.replies, liked: p.likes.length > 0, mine: p.userId === viewer };
}

/** Короткая сводка о себе для шапки сообщества. */
export async function socialHome(viewer: string) {
  const [user, profile, followers, following, posts] = await Promise.all([
    prisma.user.findUnique({ where: { id: viewer }, select: { name: true } }),
    prisma.communityProfile.findUnique({ where: { userId: viewer }, select: { published: true } }),
    prisma.follow.count({ where: { followingId: viewer, follower: PUBLISHED } }),
    prisma.follow.count({ where: { followerId: viewer, following: PUBLISHED } }),
    prisma.socialPost.count({ where: { userId: viewer, parentId: null } }),
  ]);
  return { userId: viewer, name: user?.name || "Студент", published: !!profile?.published, followers, following, posts };
}

/**
 * Лента. «following» — посты тех, на кого подписан, и свои; «all» — все
 * свежие посты сообщества. Страницы — по времени (before), а не по номеру:
 * новый пост сверху не сдвигает уже показанные.
 */
export async function feed(viewer: string, scope: string, before?: string | null) {
  const blocked = await blockedIds(viewer);
  let authors: string[] | null = null;
  if (scope === "following") {
    const rows = await prisma.follow.findMany({ where: { followerId: viewer }, select: { followingId: true } });
    authors = [viewer, ...rows.map((r) => r.followingId)];
  }
  const cursor = before ? new Date(before) : null;
  if (cursor && Number.isNaN(cursor.getTime())) throw new CommunityError("Некорректный запрос");
  const rows = await prisma.socialPost.findMany({
    where: {
      parentId: null,
      userId: { notIn: blocked, ...(authors ? { in: authors } : {}) },
      user: PUBLISHED,
      ...(cursor ? { createdAt: { lt: cursor } } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: PAGE + 1,
    include: postInclude(viewer),
  });
  return { posts: rows.slice(0, PAGE).map((p) => postView(p, viewer)), more: rows.length > PAGE };
}

/** Пост с комментариями — открывается по нажатию, в ленте только счётчик. */
export async function thread(viewer: string, postId: string) {
  const blocked = await blockedIds(viewer);
  const post = await prisma.socialPost.findFirst({ where: { id: postId, parentId: null, userId: { notIn: blocked }, user: PUBLISHED }, include: postInclude(viewer) });
  if (!post) throw new CommunityError("Пост недоступен", 404);
  const comments = await prisma.socialPost.findMany({
    where: { parentId: postId, userId: { notIn: blocked }, user: PUBLISHED },
    orderBy: { createdAt: "asc" },
    take: 200,
    include: postInclude(viewer),
  });
  return { post: postView(post, viewer), comments: comments.map((c) => postView(c, viewer)) };
}

/** Профиль человека: то, что он сам открыл, счётчики и его посты. */
export async function profileView(viewer: string, id: string) {
  const base = await publicProfile(viewer, id); // сам проверяет блокировки и публикацию
  const [followers, following, isFollowing, followsMe, posts, postCount, published] = await Promise.all([
    prisma.follow.count({ where: { followingId: id, follower: PUBLISHED } }),
    prisma.follow.count({ where: { followerId: id, following: PUBLISHED } }),
    prisma.follow.findUnique({ where: { followerId_followingId: { followerId: viewer, followingId: id } } }),
    prisma.follow.findUnique({ where: { followerId_followingId: { followerId: id, followingId: viewer } } }),
    prisma.socialPost.findMany({ where: { userId: id, parentId: null }, orderBy: { createdAt: "desc" }, take: PAGE, include: postInclude(viewer) }),
    prisma.socialPost.count({ where: { userId: id, parentId: null } }),
    prisma.communityProfile.findUnique({ where: { userId: id }, select: { published: true } }),
  ]);
  return {
    ...base,
    published: !!published?.published,
    followers, following, postCount,
    isFollowing: !!isFollowing, followsMe: !!followsMe, mine: viewer === id,
    // Посты неопубликованного профиля видит только он сам.
    posts: published?.published || viewer === id ? posts.map((p) => postView(p, viewer)) : [],
  };
}

type PersonRow = { id: string; name: string | null; communityProfile: { bio: string; subjects: string[] } | null; _count: { followers: number } };

async function people(viewer: string, where: object, take: number) {
  const blocked = await blockedIds(viewer);
  const rows: PersonRow[] = await prisma.user.findMany({
    where: { ...where, id: { notIn: [...blocked, viewer] }, communityProfile: { published: true }, banned: false },
    select: { id: true, name: true, communityProfile: { select: { bio: true, subjects: true } }, _count: { select: { followers: true } } },
    orderBy: { followers: { _count: "desc" } },
    take,
  });
  const mine = await prisma.follow.findMany({ where: { followerId: viewer, followingId: { in: rows.map((r) => r.id) } }, select: { followingId: true } });
  const followed = new Set(mine.map((m) => m.followingId));
  return rows.map((r) => ({ userId: r.id, name: r.name || "Студент", bio: (r.communityProfile?.bio ?? "").slice(0, 140), subjects: r.communityProfile?.subjects.slice(0, 3) ?? [], followers: r._count.followers, isFollowing: followed.has(r.id) }));
}

/** Поиск по имени; без запроса — те, кого чаще всего читают. */
export async function searchPeople(viewer: string, query: string) {
  const q = query.trim().slice(0, 60);
  return { people: await people(viewer, q ? { name: { contains: q, mode: "insensitive" } } : {}, 30) };
}

export async function followList(viewer: string, id: string, kind: "followers" | "following") {
  await publicProfile(viewer, id);
  const where = kind === "followers" ? { following: { some: { followingId: id } } } : { followers: { some: { followerId: id } } };
  return { people: await people(viewer, where, 100) };
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

const SOCIAL_ACTIONS = ["quickProfile", "follow", "unfollow", "socialPost", "comment", "like", "unlike", "deleteSocial", "reportSocial", "teamSettings", "joinOpen"];
export const isSocialAction = (action: unknown): action is string => typeof action === "string" && SOCIAL_ACTIONS.includes(action);

export async function socialAction(userId: string, body: Record<string, unknown>) {
  const action = body.action as string;

  if (action === "quickProfile") {
    // Одно нажатие вместо анкеты: публикуем профиль с тем, что уже есть.
    // Био, предметы и цели человек допишет позже — или не допишет.
    await prisma.communityProfile.upsert({ where: { userId }, create: { userId, published: true }, update: { published: true } });
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

  await requireProfile(userId);

  if (action === "follow" || action === "unfollow") {
    const target = textField(body.userId, 100);
    if (target === userId) throw new CommunityError("На себя подписаться нельзя");
    const key = { followerId_followingId: { followerId: userId, followingId: target } };
    if (action === "unfollow") {
      await prisma.follow.deleteMany({ where: { followerId: userId, followingId: target } });
      return;
    }
    await publicProfile(userId, target); // опубликован и не заблокирован
    if ((await prisma.follow.count({ where: { followerId: userId } })) >= 2000) throw new CommunityError("Достигнут лимит подписок");
    await prisma.follow.upsert({ where: key, create: { followerId: userId, followingId: target }, update: {} });
    return;
  }

  if (action === "socialPost" || action === "comment") {
    const since = new Date(Date.now() - DAY);
    if (action === "socialPost") {
      // Потолок на сутки — от спама: рейт-лимит в памяти сбрасывается при каждом деплое.
      if ((await prisma.socialPost.count({ where: { userId, parentId: null, createdAt: { gt: since } } })) >= 20) throw new CommunityError("Не больше 20 постов в сутки");
      const post = await prisma.socialPost.create({ data: { userId, text: textField(body.text, 2000) } });
      return { postId: post.id };
    }
    const postId = textField(body.postId, 100);
    const blocked = await blockedIds(userId);
    const parent = await prisma.socialPost.findFirst({ where: { id: postId, parentId: null, userId: { notIn: blocked }, user: PUBLISHED } });
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
    if (!(await prisma.socialPost.findFirst({ where: { id: postId, userId: { notIn: blocked }, user: PUBLISHED } }))) throw new CommunityError("Пост недоступен", 404);
    await prisma.socialLike.upsert({ where: { postId_userId: { postId, userId } }, create: { postId, userId }, update: {} });
    return;
  }

  if (action === "deleteSocial") {
    // deleteMany с автором в условии: чужой пост просто не найдётся.
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
