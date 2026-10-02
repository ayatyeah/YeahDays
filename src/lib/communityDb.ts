import { randomBytes } from 'node:crypto';
import { prisma } from '@/lib/db';
import { CommunityError, textField, linesField, focusCredit, focusRequired } from './community';
import { askChat } from './aiChat';
import { rateLimit } from './rateLimit';

export async function blockedIds(userId: string) {
  const [own, others] = await Promise.all([
    prisma.communityProfile.findUnique({ where: { userId }, select: { blocked: true } }),
    prisma.communityProfile.findMany({ where: { blocked: { has: userId } }, select: { userId: true } }),
  ]);
  return [...new Set([...(own?.blocked ?? []), ...others.map(p => p.userId)])];
}
export async function communityHome(userId: string) {
  const [profile, teams, blocks] = await Promise.all([
    prisma.communityProfile.findUnique({ where: { userId } }),
    prisma.studyTeam.findMany({ where: { members: { some: { userId } } }, select: { id: true, name: true, subject: true, ownerId: true, _count: { select: { members: true } } }, orderBy: { createdAt: 'desc' } }),
    blockedIds(userId),
  ]);
  return { userId, profile, teams, blocked: blocks, available: !!process.env.OPENAI_API_KEY };
}
export async function teamView(userId: string, teamId: string) {
  const membership = await prisma.studyMember.findUnique({ where: { teamId_userId: { teamId, userId } } });
  if (!membership) throw new CommunityError('Вступи в команду, чтобы видеть её обсуждения', 403);
  const blocked = await blockedIds(userId);
  const team = await prisma.studyTeam.findUniqueOrThrow({ where: { id: teamId }, include: {
    members: { select: { userId: true, user: { select: { name: true } } }, orderBy: { joinedAt: 'asc' } },
    quests: { orderBy: { createdAt: 'desc' }, take: 20, include: { rooms: { select: { participants: { where: { completedAt: { not: null } }, select: { userId: true } } } } } },
    rooms: { orderBy: { startsAt: 'desc' }, take: 10, include: { participants: { select: { userId: true, lastSeenAt: true, seconds: true, completedAt: true, summary: true } } } },
  } });
  const postWhere = { teamId, userId: { notIn: blocked } };
  const posts = await prisma.studyPost.findMany({ where: { ...postWhere, parentId: null, roomId: null }, orderBy: { createdAt: 'desc' }, take: 50, include: { user: { select: { name: true } }, replies: { where: { userId: { notIn: blocked } }, orderBy: { createdAt: 'asc' }, take: 100, include: { user: { select: { name: true } } } } } });
  const chat = await prisma.studyPost.findMany({ where: { ...postWhere, roomId: { in: team.rooms.map(r => r.id) } }, orderBy: { createdAt: 'desc' }, take: 100, include: { user: { select: { name: true } } } });
  const reports = team.ownerId === userId ? await prisma.communityReport.findMany({ where: { teamId, resolved: false }, select: { id: true, postId: true, reason: true, post: { select: { text: true } } }, take: 100 }) : [];
  return { id: team.id, name: team.name, subject: team.subject, open: team.open, about: team.about, ownerId: team.ownerId, invite: team.ownerId === userId ? team.invite : null,
    members: team.members.filter(m => !blocked.includes(m.userId)), posts, chat: chat.reverse(), reports,
    quests: team.quests.map(({ rooms, ...q }) => { const contributions = rooms.flatMap(r => r.participants); return { ...q, progress: contributions.length, mine: contributions.some(p => p.userId === userId), earned: contributions.length >= q.target && contributions.some(p => p.userId === userId) }; }),
    rooms: team.rooms.map(r => ({ ...r, participants: r.participants.filter(p => !blocked.includes(p.userId)) })), serverNow: new Date().toISOString() };
}

export async function communityAction(userId: string, body: Record<string, unknown>) {
  const action = textField(body.action, 40);
  if (action === 'profile') {
    // «О себе» — дополнение к профилю-аккаунту (см. socialDb.ts). Видимость решает переключатель «Скрыть меня», а не эти поля.
    const data = { bio: textField(body.bio, 500, true), subjects: linesField(body.subjects), goals: linesField(body.goals) };
    await prisma.communityProfile.upsert({ where: { userId }, create: { userId, ...data }, update: data }); return;
  }
  if (action === 'block' || action === 'unblock') {
    const target = textField(body.userId, 100); if (target === userId) throw new CommunityError('Нельзя заблокировать себя');
    await prisma.$transaction(async tx => {
      await tx.communityProfile.upsert({ where: { userId }, create: { userId }, update: {} });
      await tx.$queryRaw`SELECT "userId" FROM "CommunityProfile" WHERE "userId" = ${userId} FOR UPDATE`;
      const row = await tx.communityProfile.findUniqueOrThrow({ where: { userId } });
      const blocked = row.blocked.filter(id => id !== target); if (action === 'block') blocked.push(target);
      if (blocked.length > 500) throw new CommunityError('Достигнут лимит блокировок');
      await tx.communityProfile.update({ where: { userId }, data: { blocked } });
      if (action === 'block') {
        await tx.friendship.deleteMany({ where: { OR: [{ userId, friendId: target }, { userId: target, friendId: userId }] } });
        await tx.follow.deleteMany({ where: { OR: [{ followerId: userId, followingId: target }, { followerId: target, followingId: userId }] } });
      }
    }); return;
  }
  if (action === 'create') {
    if (await prisma.studyMember.count({ where: { userId } }) >= 20) throw new CommunityError('Можно состоять в 20 командах');
    const row = await prisma.studyTeam.create({ data: { name: textField(body.name, 80), subject: textField(body.subject, 100), ownerId: userId, invite: randomBytes(18).toString('hex'), members: { create: { userId } } } }); return { teamId: row.id };
  }
  if (action === 'join') {
    const invite = textField(body.invite, 100);
    const team = await prisma.studyTeam.findUnique({ where: { invite } }); if (!team) throw new CommunityError('Приглашение устарело', 404);
    if ((await blockedIds(userId)).includes(team.ownerId)) throw new CommunityError('Команда недоступна', 403);
    return prisma.$transaction(async tx => {
      await tx.$queryRaw`SELECT id FROM "StudyTeam" WHERE id = ${team.id} FOR UPDATE`;
      if (!await tx.studyTeam.findFirst({ where: { id: team.id, invite } })) throw new CommunityError('Приглашение обновлено', 409);
      if (await tx.studyMember.count({ where: { teamId: team.id } }) >= 100 || await tx.studyMember.count({ where: { userId } }) >= 20) throw new CommunityError('Достигнут лимит участников или команд');
      await tx.studyMember.upsert({ where: { teamId_userId: { teamId: team.id, userId } }, create: { teamId: team.id, userId }, update: {} }); return { teamId: team.id };
    });
  }
  const teamId = textField(body.teamId, 100);
  if (action === 'ai') return answerDiscussion(userId, teamId, textField(body.postId, 100));
  const blocked = await blockedIds(userId);
  return prisma.$transaction(async tx => {
    await tx.$queryRaw`SELECT id FROM "StudyTeam" WHERE id = ${teamId} FOR UPDATE`;
    const team = await tx.studyTeam.findUnique({ where: { id: teamId } });
    if (!team || !await tx.studyMember.findUnique({ where: { teamId_userId: { teamId, userId } } })) throw new CommunityError('Нет доступа к команде', 403);
    const owner = team.ownerId === userId;
    if (['rotate', 'deleteTeam', 'quest', 'resolve'].includes(action) && !owner) throw new CommunityError('Только организатор команды', 403);
    if (action === 'rotate') { await tx.studyTeam.update({ where: { id: teamId }, data: { invite: randomBytes(18).toString('hex') } }); return; }
    if (action === 'deleteTeam') { await tx.studyTeam.delete({ where: { id: teamId } }); return; }
    if (action === 'leave') { if (owner) throw new CommunityError('Организатор может удалить команду'); await tx.studyMember.delete({ where: { teamId_userId: { teamId, userId } } }); return; }
    if (action === 'quest') {
      const target = Number(body.target); const days = Number(body.days);
      if (!Number.isInteger(target) || target < 1 || target > 100 || !Number.isInteger(days) || days < 1 || days > 30) throw new CommunityError('Цель: 1–100 занятий, срок: 1–30 дней');
      if (await tx.studyQuest.count({ where: { teamId, deadline: { gt: new Date() } } }) >= 5) throw new CommunityError('Сначала заверши активные квесты');
      await tx.studyQuest.create({ data: { teamId, title: textField(body.title, 140), target, deadline: new Date(Date.now() + days * 86400000) } }); return;
    }
    if (action === 'room') {
      if (await tx.studyRoom.count({ where: { teamId, endsAt: { gt: new Date() } } }) >= 3) throw new CommunityError('У команды уже 3 активные комнаты');
      const minutes = Number(body.minutes); if (![15,25,50].includes(minutes)) throw new CommunityError('Выбери 15, 25 или 50 минут');
      const questId = body.questId ? textField(body.questId, 100) : null;
      const endsAt = new Date(Date.now() + minutes * 60000);
      if (questId && !await tx.studyQuest.findFirst({ where: { id: questId, teamId, deadline: { gte: endsAt } } })) throw new CommunityError('Квест недоступен или закончится раньше комнаты');
      await tx.studyRoom.create({ data: { teamId, title: textField(body.title, 100), questId, startsAt: new Date(), endsAt } }); return;
    }
    if (['enter','pulse','finish'].includes(action)) {
      await tx.$queryRaw`SELECT id FROM "User" WHERE id = ${userId} FOR UPDATE`;
      const roomId = textField(body.roomId, 100); const now = new Date();
      const room = await tx.studyRoom.findFirst({ where: { id: roomId, teamId } }); if (!room) throw new CommunityError('Комната не найдена', 404);
      const key = { roomId_userId: { roomId, userId } };
      let p = await tx.studyAttendance.findUnique({ where: key });
      if (action === 'enter') {
        if (now >= room.endsAt) throw new CommunityError('Занятие уже завершено');
        if (await tx.studyAttendance.findFirst({ where: { userId, roomId: { not: roomId }, lastSeenAt: { gt: new Date(Date.now()-90000) }, room: { endsAt: { gt: now } } } })) throw new CommunityError('Сначала заверши занятие в другой комнате');
        if (!p) await tx.studyAttendance.create({ data: { roomId, userId } }); return;
      }
      if (!p) throw new CommunityError('Сначала присоединись к комнате');
      if (action === 'pulse' && await tx.studyAttendance.findFirst({ where: { userId, roomId: { not: roomId }, lastSeenAt: { gt: new Date(Date.now()-90000) }, room: { endsAt: { gt: now } } } })) throw new CommunityError('Можно учиться только в одной комнате одновременно');
      if (p.completedAt) return;
      const seconds = Math.min(Math.floor((room.endsAt.getTime()-room.startsAt.getTime())/1000), p.seconds + focusCredit(p.lastSeenAt, room.endsAt, now));
      if (action === 'finish') {
        if (now < room.endsAt || seconds < focusRequired(room.startsAt, room.endsAt)) throw new CommunityError('Для зачёта нужно дождаться конца и провести в комнате не менее 80% времени');
        await tx.studyAttendance.update({ where: key, data: { seconds, lastSeenAt: now, completedAt: now, summary: textField(body.summary, 500) } });
      } else if (now.getTime()-p.lastSeenAt.getTime() >= 10000) await tx.studyAttendance.update({ where: key, data: { seconds, lastSeenAt: now } }); return;
    }
    if (action === 'post') {
      const parentId = body.parentId ? textField(body.parentId, 100) : null;
      const roomId = body.roomId ? textField(body.roomId, 100) : null;
      if (parentId && roomId) throw new CommunityError('Выбери обсуждение или комнату');
      if (parentId) {
        const parent = await tx.studyPost.findFirst({ where: { id: parentId, teamId, parentId: null, roomId: null } });
        if (!parent || blocked.includes(parent.userId)) throw new CommunityError('Обсуждение недоступно', 404);
        if (await tx.studyPost.count({ where: { parentId } }) >= 100) throw new CommunityError('В обсуждении уже 100 ответов');
      }
      if (roomId && !await tx.studyRoom.findFirst({ where: { id: roomId, teamId } })) throw new CommunityError('Комната не найдена');
      const kind = parentId || roomId ? 'reply' : textField(body.kind, 20);
      if (!['question','resource','progress','reply'].includes(kind)) throw new CommunityError('Выбери тип публикации');
      await tx.studyPost.create({ data: { teamId, userId, parentId, roomId, kind, text: textField(body.text, 4000) } }); return;
    }
    if (action === 'deletePost' || action === 'report') {
      const postId = textField(body.postId, 100); const post = await tx.studyPost.findFirst({ where: { id: postId, teamId } }); if (!post) throw new CommunityError('Публикация не найдена', 404);
      if (action === 'deletePost') { if (post.userId !== userId && !owner) throw new CommunityError('Нельзя удалить чужую публикацию', 403); await tx.studyPost.delete({ where: { id: postId } }); }
      else { const reason = textField(body.reason, 500); await tx.communityReport.upsert({ where: { postId_userId: { postId, userId } }, create: { teamId, postId, userId, reason }, update: { reason, resolved: false } }); } return;
    }
    if (action === 'resolve') { await tx.communityReport.updateMany({ where: { id: textField(body.reportId,100), teamId }, data: { resolved: true } }); return; }
    throw new CommunityError('Неизвестное действие');
  }, { timeout: 15000 });
}

async function answerDiscussion(userId: string, teamId: string, postId: string) {
  if (!process.env.OPENAI_API_KEY) throw new CommunityError('ИИ пока не подключён', 503);
  if (!rateLimit(`community-ai:${userId}`, 20, 86400000) || !rateLimit('community-ai:global',500,86400000)) throw new CommunityError('Лимит ИИ на сегодня исчерпан',429);
  // Only the author sends their own post; no other member's replies/private data go to OpenAI.
  const post = await prisma.$transaction(async tx => {
    await tx.$queryRaw`SELECT id FROM "StudyPost" WHERE id = ${postId} FOR UPDATE`;
    if (!await tx.studyMember.findUnique({ where: { teamId_userId: { teamId, userId } } })) throw new CommunityError('Нет доступа',403);
    const p = await tx.studyPost.findFirst({ where: { id: postId, teamId, userId, parentId: null, roomId: null, ai: false }, include: { replies: { where: { ai: true } } } });
    if (!p) throw new CommunityError('ИИ можно подключить к своему вопросу',403);
    if (p.replies.length) throw new CommunityError('ИИ уже ответил');
    if (p.aiPendingAt && Date.now()-p.aiPendingAt.getTime()<120000) throw new CommunityError('ИИ уже готовит ответ',409);
    await tx.studyPost.update({ where: { id: postId }, data: { aiPendingAt: new Date() } }); return p;
  });
  try {
    const answer = await askChat([], post.text);
    await prisma.$transaction(async tx => {
      await tx.$queryRaw`SELECT id FROM "StudyPost" WHERE id = ${postId} FOR UPDATE`;
      if (!await tx.studyPost.findUnique({ where: { id: postId } }) || !await tx.studyMember.findUnique({ where: { teamId_userId: { teamId,userId } } })) return;
      if (!await tx.studyPost.findFirst({ where: { parentId: postId, ai: true } })) await tx.studyPost.create({ data: { teamId, userId, parentId: postId, text: answer, kind: 'reply', ai: true } });
      await tx.studyPost.update({ where: { id: postId }, data: { aiPendingAt: null } });
    });
  } catch { await prisma.studyPost.updateMany({ where: { id: postId }, data: { aiPendingAt: null } }); throw new CommunityError('Не удалось получить ответ ИИ. Попробуй позже',502); }
}
