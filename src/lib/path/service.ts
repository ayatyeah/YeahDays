/**
 * Траектории в базе: цели, юниты, участники, круг, репосты и жалобы.
 * Проверка ответов — quiz.ts, видео — video.ts; формулы — elo.ts и
 * pathway.ts. Права проверяются здесь, в каждой функции: роуты только
 * разбирают запрос и превращают PathError в ответ.
 *
 * Содержимое цели общее для её участников, освоение и прогресс у каждого
 * свои. Чужая цель для постороннего выглядит как несуществующая (404),
 * чтобы по id нельзя было узнать, что она есть.
 */

import { randomBytes } from "node:crypto";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { dailyLimit } from "@/lib/aiLimit";
import { characterStageForLevel } from "@/lib/characterSkins";
import { mediaUrl } from "@/lib/socialMedia";
import { blockedIds } from "@/lib/communityDb";
import { requireMember as requireCommunityMember } from "@/lib/socialDb";
import { generateSkillMap, generateUnit } from "./ai";
import { LEVEL_DIFFICULTY } from "./elo";
import { isMastered, planDay, recommend, reviewDue, type MasteryState } from "./pathway";
import { paragraphs } from "./validate";

export class PathError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}

export const LEVELS = ["beginner", "intermediate", "advanced"] as const;
export const LANGUAGES = ["ru", "en", "kk"] as const;
export const MAX_MATERIAL = 20_000;
const MAX_GOALS = 10;
const MAX_MEMBERS = 30;
/** Генерация юнита — до двух попыток по 90 с; дольше пяти минут — значит, процесс умер. */
const STALE_MS = 5 * 60_000;
const ZONE = "Asia/Almaty";

/** Сегодняшний день в часовом поясе Казахстана, YYYY-MM-DD. */
export function today(at = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).format(at);
}

/** Начало текущей недели (понедельник 00:00 по Алматы) — для совместного челленджа. */
export function weekStart(at = new Date()) {
  const day = today(at);
  const weekday = (new Date(`${day}T00:00:00Z`).getUTCDay() + 6) % 7;
  return new Date(Date.parse(`${day}T00:00:00+05:00`) - weekday * 86_400_000);
}

const inviteCode = () => randomBytes(9).toString("base64url");
const isUnique = (error: unknown) => (error as { code?: string })?.code === "P2002";

/** Настоящая дата YYYY-MM-DD (а не просто похожая на неё строка вроде 2026-13-01). */
export function validDate(value: string) {
  const time = Date.parse(`${value}T00:00:00Z`);
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === value;
}

/** Участник цели или 404 — посторонний не узнаёт, что цель существует. */
export async function membership(userId: string, goalId: string) {
  const member = await prisma.pathMember.findUnique({ where: { goalId_userId: { goalId, userId } }, include: { goal: true } });
  if (!member) throw new PathError("Цель не найдена", 404);
  return member;
}

/** Как membership, но для вложенного объекта: и чужой, и несуществующий объект — одна и та же 404. */
async function memberFor(userId: string, goalId: string, notFound: string) {
  try {
    return await membership(userId, goalId);
  } catch (error) {
    if (error instanceof PathError && error.status === 404) throw new PathError(notFound, 404);
    throw error;
  }
}

async function ownerOf(userId: string, goalId: string) {
  const member = await membership(userId, goalId);
  if (member.role !== "owner") throw new PathError("Это может только владелец цели", 403);
  return member;
}

// ---------- создание цели ----------

export interface GoalInput {
  goal: string;
  subject: string;
  level: (typeof LEVELS)[number];
  language: (typeof LANGUAGES)[number];
  minutes: number;
  deadline: string;
  material: string;
  requestId: string;
}

/** Разбор формы новой цели (FR-05, FR-06): неверные значения — 422, длинный материал — 413. */
export function parseGoalInput(body: Record<string, unknown>): GoalInput {
  const text = (v: unknown) => (typeof v === "string" ? v.replace(/\r\n/g, "\n").trim() : "");
  const goal = text(body.goal);
  if (goal.length < 5 || goal.length > 600) throw new PathError("Опиши цель: от 5 до 600 символов", 422);
  const subject = text(body.subject);
  if (subject.length > 180) throw new PathError("Название предмета — до 180 символов", 422);
  const level = LEVELS.find((l) => l === body.level);
  const language = LANGUAGES.find((l) => l === body.language);
  if (!level || !language) throw new PathError("Выбери уровень и язык", 422);
  const minutes = Number(body.minutes);
  if (!Number.isInteger(minutes) || minutes < 5 || minutes > 60) throw new PathError("Время на день — от 5 до 60 минут", 422);
  const deadline = text(body.deadline);
  if (deadline && !validDate(deadline)) throw new PathError("Дата в формате ГГГГ-ММ-ДД", 422);
  const material = text(body.material);
  if (material.length > MAX_MATERIAL) throw new PathError("Материал — до 20 000 символов", 413);
  const requestId = text(body.requestId);
  if (!/^[0-9a-f-]{36}$/i.test(requestId)) throw new PathError("Некорректный запрос", 422);
  return { goal, subject, level, language, minutes, deadline, material, requestId };
}

export async function createGoal(userId: string, input: GoalInput) {
  const existing = await prisma.pathGoal.findUnique({ where: { id: input.requestId }, select: { id: true, ownerId: true } });
  if (existing) {
    if (existing.ownerId !== userId) throw new PathError("Некорректный запрос", 422);
    return existing.id;
  }
  if ((await prisma.pathMember.count({ where: { userId } })) >= MAX_GOALS) throw new PathError("Уже 10 целей. Выйди из одной, чтобы начать новую.");
  if (!(await dailyLimit(`path:goal:${userId}`, 3)) || !(await dailyLimit("path:goal:global", 150))) throw new PathError("На сегодня лимит новых целей исчерпан", 429);
  const map = await generateSkillMap({ goal: input.goal, subject: input.subject, level: input.level, language: input.language, minutes: input.minutes, material: input.material });
  const skillIds = new Map(map.skills.map((s) => [s.key, `${input.requestId.slice(0, 8)}-${s.key}-${randomBytes(4).toString("hex")}`]));
  // Повтор того же запроса, пока первый ещё генерировал: цель уже создана — отдаём её.
  const created = await prisma.$transaction(async (tx) => {
    await tx.pathGoal.create({
      data: {
        id: input.requestId,
        ownerId: userId,
        title: map.title,
        goal: input.goal,
        subject: input.subject,
        level: input.level,
        language: input.language,
        source: input.material,
        invite: inviteCode(),
        members: { create: { userId, role: "owner", minutes: input.minutes, deadline: input.deadline } },
        skills: { create: map.skills.map((s, position) => ({ id: skillIds.get(s.key)!, position, name: s.name, description: s.description, prerequisites: s.prerequisites.map((p) => skillIds.get(p)!) })) },
        units: { create: map.units.map((u, position) => ({ position, title: u.title, objective: u.objective, minutes: u.minutes, weight: u.weight, sourceSpan: u.sourceQuote, skillIds: u.skills.map((k) => skillIds.get(k)!) })) },
        questions: { create: map.placement.map((q) => ({ skillId: skillIds.get(q.skill)!, kind: "mcq", stem: q.stem, options: q.options, answer: q.answer, explanation: q.explanation, wrongWhy: q.wrongWhy, hints: q.hints, level: q.level, difficulty: LEVEL_DIFFICULTY[q.level], placement: true })) },
        events: { create: { userId, kind: "joined", title: map.title } },
      },
    });
  }).then(() => true, (error) => {
    if (isUnique(error)) return false;
    throw error;
  });
  if (!created && (await prisma.pathGoal.findUnique({ where: { id: input.requestId }, select: { ownerId: true } }))?.ownerId !== userId) throw new PathError("Некорректный запрос", 422);
  return input.requestId;
}

// ---------- просмотр ----------

const AUTHOR = { select: { id: true, name: true, communityProfile: { select: { avatarId: true } }, publicStats: { select: { level: true } } } } satisfies Prisma.UserDefaultArgs;
type Author = Prisma.UserGetPayload<typeof AUTHOR>;
const person = (u: Author) => {
  const level = u.publicStats?.level ?? 1;
  return { userId: u.id, name: u.name || "Студент", avatar: u.communityProfile?.avatarId ? mediaUrl(u.communityProfile.avatarId) : `/characters/${characterStageForLevel(level)}.webp` };
};

async function learnerState(userId: string, goalId: string) {
  const [skills, units, mastery, progress] = await Promise.all([
    prisma.pathSkill.findMany({ where: { goalId }, orderBy: { position: "asc" } }),
    prisma.pathUnit.findMany({ where: { goalId }, orderBy: { position: "asc" }, select: { id: true, title: true, objective: true, minutes: true, weight: true, position: true, skillIds: true, status: true } }),
    prisma.pathMastery.findMany({ where: { userId, goalId } }),
    prisma.pathProgress.findMany({ where: { userId, goalId } }),
  ]);
  const masteryBy: Record<string, MasteryState & { reviewStep: number }> = Object.fromEntries(mastery.map((m) => [m.skillId, m]));
  const progressBy = Object.fromEntries(progress.map((p) => [p.unitId, p]));
  return { skills, units, masteryBy, progressBy };
}

/** Мои цели с короткой сводкой и следующим шагом — для хаба «Учёба». */
export async function listGoals(userId: string) {
  const members = await prisma.pathMember.findMany({ where: { userId }, include: { goal: { select: { id: true, title: true, subject: true, _count: { select: { members: true } } } } }, orderBy: { joinedAt: "desc" } });
  const day = today();
  return Promise.all(
    members.map(async (m) => {
      const { skills, units, masteryBy, progressBy } = await learnerState(userId, m.goalId);
      const ranked = recommend({ skills, units, mastery: masteryBy, progress: progressBy, deadline: m.deadline, today: day, now: new Date() });
      return {
        id: m.goal.id,
        title: m.goal.title,
        subject: m.goal.subject,
        role: m.role,
        members: m.goal._count.members,
        units: units.length,
        unitsDone: units.filter((u) => progressBy[u.id]?.completedAt).length,
        skills: skills.length,
        skillsMastered: skills.filter((s) => isMastered(masteryBy[s.id])).length,
        next: ranked[0] ? { unitId: ranked[0].unitId, title: ranked[0].title, reason: ranked[0].reason.text } : null,
        placementDone: m.placementDone,
      };
    }),
  );
}

/** Экран цели: план на сегодня, карта навыков с освоением, круг и лента круга. */
export async function goalView(userId: string, goalId: string) {
  const member = await membership(userId, goalId);
  const goal = member.goal;
  const day = today();
  const now = new Date();
  const [{ skills, units, masteryBy, progressBy }, checkIn, lastCheckIn, members, done, weekly, events, reports] = await Promise.all([
    learnerState(userId, goalId),
    prisma.pathCheckIn.findUnique({ where: { userId_day: { userId, day } } }),
    prisma.pathCheckIn.findFirst({ where: { userId, day: { lt: day } }, orderBy: { day: "desc" } }),
    prisma.pathMember.findMany({ where: { goalId }, orderBy: { joinedAt: "asc" }, include: { user: AUTHOR } }),
    prisma.pathProgress.groupBy({ by: ["userId"], where: { goalId, completedAt: { not: null } }, _count: { _all: true } }),
    prisma.pathProgress.count({ where: { goalId, completedAt: { gte: weekStart(now) } } }),
    prisma.pathEvent.findMany({ where: { goalId }, orderBy: { createdAt: "desc" }, take: 30, include: { user: AUTHOR } }),
    member.role === "owner" ? prisma.pathReport.findMany({ where: { goalId, resolved: false }, orderBy: { createdAt: "desc" }, take: 30 }) : Promise.resolve([]),
  ]);
  const ranked = recommend({ skills, units, mastery: masteryBy, progress: progressBy, deadline: member.deadline, today: day, now });
  // Ключ ответа в жалобе на вопрос владелец видит, только если сам уже на него отвечал.
  const reportedQuestions = reports.filter((r) => r.target === "question").map((r) => r.targetId);
  const attempted = new Set(reportedQuestions.length ? (await prisma.pathAttempt.findMany({ where: { userId, questionId: { in: reportedQuestions } }, select: { questionId: true } })).map((a) => a.questionId) : []);
  const doneBy = Object.fromEntries(done.map((d) => [d.userId, d._count._all]));
  const target = goal.weeklyTarget || 3 * members.length;
  const unitOf = (skillId: string) => units.find((u) => u.skillIds.includes(skillId))?.id ?? null;
  return {
    id: goal.id,
    title: goal.title,
    goal: goal.goal,
    subject: goal.subject,
    level: goal.level,
    language: goal.language,
    hasSource: !!goal.source,
    role: member.role,
    minutes: member.minutes,
    deadline: member.deadline,
    placementDone: member.placementDone,
    today: day,
    checkIn: checkIn ? { energy: checkIn.energy, minutes: checkIn.minutes } : null,
    checkInDefaults: { energy: lastCheckIn?.energy ?? 3, minutes: lastCheckIn?.minutes ?? member.minutes },
    plan: checkIn ? planDay(ranked, checkIn) : null,
    recommendations: ranked.slice(0, 8),
    skills: skills.map((s) => {
      const m = masteryBy[s.id];
      return {
        id: s.id,
        name: s.name,
        description: s.description,
        prerequisites: s.prerequisites,
        mastery: m?.mastery ?? null,
        answers: m?.answers ?? 0,
        mastered: isMastered(m),
        reviewDue: reviewDue(m, now),
        reviewAt: m?.reviewAt ?? null,
        unitId: unitOf(s.id),
      };
    }),
    units: units.map((u) => ({ id: u.id, title: u.title, objective: u.objective, minutes: u.minutes, skillIds: u.skillIds, ready: u.status === "ready", completed: !!progressBy[u.id]?.completedAt, opened: !!progressBy[u.id] })),
    circle: {
      members: members.map((m) => ({ ...person(m.user), role: m.role, unitsDone: doneBy[m.userId] ?? 0, me: m.userId === userId })),
      weekly: { done: weekly, target },
      weeklyTarget: goal.weeklyTarget,
      invite: member.role === "owner" ? goal.invite : null,
    },
    events: events.map((e) => ({ id: e.id, kind: e.kind, title: e.title, createdAt: e.createdAt, ...person(e.user), mine: e.userId === userId, shared: e.shared, score: e.userId === userId || e.shared ? e.score : null })),
    reports: reports.map((r) => {
      const snap = (r.snapshot ?? {}) as Record<string, unknown>;
      const hidden = r.target === "question" && !attempted.has(r.targetId);
      return { id: r.id, target: r.target, targetId: r.targetId, reason: r.reason, createdAt: r.createdAt, snapshot: hidden ? { stem: snap.stem, options: snap.options, answer: "откроется после твоей попытки" } : snap };
    }),
  };
}

// ---------- юниты ----------

/**
 * Текст и банк вопросов юнита пишутся при первом открытии и дальше общие
 * для всех участников. Захват через updateMany: пишет один запрос, второй
 * получает «готовится» и опрашивает статус; зависшая генерация (> 3 мин)
 * перехватывается.
 */
export async function ensureUnit(userId: string, unitId: string) {
  const unit = await prisma.pathUnit.findUnique({ where: { id: unitId } });
  if (!unit) throw new PathError("Юнит не найден", 404);
  const member = await memberFor(userId, unit.goalId, "Юнит не найден");
  if (unit.status === "ready") return "ready";
  const stale = new Date(Date.now() - STALE_MS);
  if (unit.status === "generating" && unit.startedAt && unit.startedAt > stale) return "generating";
  if (!(await dailyLimit(`path:unit:${userId}`, 25)) || !(await dailyLimit("path:unit:global", 1500))) throw new PathError("На сегодня лимит подготовки юнитов исчерпан", 429);
  // startedAt — ещё и токен захвата: записывает результат только тот, чей захват ещё действует.
  const claimedAt = new Date();
  const claim = await prisma.pathUnit.updateMany({
    where: { id: unitId, OR: [{ status: { in: ["outline", "failed"] } }, { status: "generating", startedAt: { lt: stale } }] },
    data: { status: "generating", startedAt: claimedAt },
  });
  if (claim.count === 0) return "generating";
  try {
    const skills = await prisma.pathSkill.findMany({ where: { id: { in: unit.skillIds } }, orderBy: { position: "asc" } });
    const keys = new Map(skills.map((s, i) => [`k${i + 1}`, s.id]));
    const content = await generateUnit({
      goal: member.goal.goal,
      language: member.goal.language,
      level: member.goal.level,
      unit: { title: unit.title, objective: unit.objective, sourceQuote: unit.sourceSpan },
      skills: skills.map((s, i) => ({ key: `k${i + 1}`, name: s.name, description: s.description })),
      material: member.goal.source,
    });
    const saved = await prisma.$transaction(async (tx) => {
      const done = await tx.pathUnit.updateMany({ where: { id: unitId, status: "generating", startedAt: claimedAt }, data: { body: content.body, status: "ready" } });
      if (!done.count) return false;
      await tx.pathQuestion.createMany({
        data: content.items.map((q) => ({
          goalId: unit.goalId,
          unitId,
          skillId: keys.get(q.skill)!,
          kind: q.kind,
          stem: q.stem,
          options: q.kind === "mcq" ? q.options : [],
          answer: q.kind === "mcq" ? q.answer : -1,
          explanation: q.kind === "mcq" ? q.explanation : "",
          wrongWhy: q.kind === "mcq" ? q.wrongWhy : [],
          hints: q.hints,
          rubric: q.kind === "open" ? q.rubric : "",
          level: q.level,
          difficulty: LEVEL_DIFFICULTY[q.level],
        })),
      });
      return true;
    });
    if (saved) return "ready";
    return (await prisma.pathUnit.findUnique({ where: { id: unitId }, select: { status: true } }))?.status === "ready" ? "ready" : "generating";
  } catch (error) {
    await prisma.pathUnit.updateMany({ where: { id: unitId, status: "generating", startedAt: claimedAt }, data: { status: "failed" } }).catch(() => {});
    throw error;
  }
}

export async function unitView(userId: string, unitId: string) {
  const unit = await prisma.pathUnit.findUnique({ where: { id: unitId } });
  if (!unit) throw new PathError("Юнит не найден", 404);
  const member = await memberFor(userId, unit.goalId, "Юнит не найден");
  const now = new Date();
  const [skills, mastery, progress, siblings, bank, video] = await Promise.all([
    prisma.pathSkill.findMany({ where: { id: { in: unit.skillIds } }, orderBy: { position: "asc" } }),
    prisma.pathMastery.findMany({ where: { userId, skillId: { in: unit.skillIds } } }),
    unit.status === "ready"
      ? prisma.pathProgress.upsert({ where: { userId_unitId: { userId, unitId } }, create: { userId, unitId, goalId: unit.goalId }, update: {} })
      : prisma.pathProgress.findUnique({ where: { userId_unitId: { userId, unitId } } }),
    prisma.pathUnit.findMany({ where: { goalId: unit.goalId }, orderBy: { position: "asc" }, select: { id: true } }),
    prisma.pathQuestion.count({ where: { goalId: unit.goalId, skillId: { in: unit.skillIds }, status: "active" } }),
    prisma.pathVideo.findUnique({ where: { unitId_unitVersion_language: { unitId, unitVersion: unit.version, language: member.goal.language } }, select: { id: true, status: true } }),
  ]);
  const at = siblings.findIndex((s) => s.id === unitId);
  const masteryBy = Object.fromEntries(mastery.map((m) => [m.skillId, m]));
  return {
    id: unit.id,
    goalId: unit.goalId,
    goalTitle: member.goal.title,
    language: member.goal.language,
    title: unit.title,
    objective: unit.objective,
    minutes: unit.minutes,
    status: unit.status,
    paragraphs: unit.status === "ready" ? paragraphs(unit.body) : [],
    sourceSpan: unit.sourceSpan,
    skills: skills.map((s) => ({ id: s.id, name: s.name, mastery: masteryBy[s.id]?.mastery ?? null, answers: masteryBy[s.id]?.answers ?? 0, mastered: isMastered(masteryBy[s.id]), reviewDue: reviewDue(masteryBy[s.id], now) })),
    completed: !!progress?.completedAt,
    bank,
    video: video ?? null,
    prev: at > 0 ? siblings[at - 1].id : null,
    next: at >= 0 && at < siblings.length - 1 ? siblings[at + 1].id : null,
    role: member.role,
  };
}

// ---------- день ----------

export async function checkIn(userId: string, goalId: string, energy: unknown, minutes: unknown) {
  await membership(userId, goalId);
  const e = Number(energy);
  const m = Number(minutes);
  if (!Number.isInteger(e) || e < 1 || e > 5 || !Number.isInteger(m) || m < 0 || m > 240) throw new PathError("Энергия 1–5 и минуты 0–240", 422);
  const day = today();
  await prisma.pathCheckIn.upsert({ where: { userId_day: { userId, day } }, create: { userId, day, energy: e, minutes: m }, update: { energy: e, minutes: m } });
}

export async function postpone(userId: string, unitId: string) {
  const unit = await prisma.pathUnit.findUnique({ where: { id: unitId }, select: { goalId: true } });
  if (!unit) throw new PathError("Юнит не найден", 404);
  await memberFor(userId, unit.goalId, "Юнит не найден");
  const day = today();
  await prisma.pathProgress.upsert({ where: { userId_unitId: { userId, unitId } }, create: { userId, unitId, goalId: unit.goalId, postponedOn: day }, update: { postponedOn: day } });
}

export async function updateSettings(userId: string, goalId: string, body: Record<string, unknown>) {
  const member = await membership(userId, goalId);
  const data: Prisma.PathMemberUpdateInput = {};
  if (body.minutes !== undefined) {
    const m = Number(body.minutes);
    if (!Number.isInteger(m) || m < 5 || m > 60) throw new PathError("Время на день — от 5 до 60 минут", 422);
    data.minutes = m;
  }
  if (body.deadline !== undefined) {
    const d = typeof body.deadline === "string" ? body.deadline.trim() : "";
    if (d && !validDate(d)) throw new PathError("Дата в формате ГГГГ-ММ-ДД", 422);
    data.deadline = d;
  }
  await prisma.pathMember.update({ where: { goalId_userId: { goalId, userId } }, data });
  if (body.weeklyTarget !== undefined) {
    if (member.role !== "owner") throw new PathError("Цель челленджа меняет владелец", 403);
    const t = Number(body.weeklyTarget);
    if (!Number.isInteger(t) || t < 0 || t > 500) throw new PathError("Цель недели — от 0 до 500 юнитов", 422);
    await prisma.pathGoal.update({ where: { id: goalId }, data: { weeklyTarget: t } });
  }
}

export async function skipPlacement(userId: string, goalId: string) {
  await membership(userId, goalId);
  await prisma.pathMember.update({ where: { goalId_userId: { goalId, userId } }, data: { placementDone: true } });
}

// ---------- круг ----------

export async function joinPreview(code: string) {
  const goal = await prisma.pathGoal.findUnique({ where: { invite: code }, include: { owner: { select: { name: true } }, skills: { orderBy: { position: "asc" }, select: { name: true } }, _count: { select: { members: true, units: true } } } });
  if (!goal) throw new PathError("Приглашение устарело или не существует", 404);
  return { title: goal.title, subject: goal.subject, owner: goal.owner.name || "Студент", skills: goal.skills.map((s) => s.name), members: goal._count.members, units: goal._count.units };
}

async function addMember(userId: string, goalId: string) {
  const exists = await prisma.pathMember.findUnique({ where: { goalId_userId: { goalId, userId } } });
  if (exists) return goalId;
  const [count, mine] = await Promise.all([prisma.pathMember.count({ where: { goalId } }), prisma.pathMember.count({ where: { userId } })]);
  if (count >= MAX_MEMBERS) throw new PathError("В этой цели уже 30 участников");
  if (mine >= MAX_GOALS) throw new PathError("Уже 10 целей. Выйди из одной, чтобы присоединиться.");
  const goal = await prisma.pathGoal.findUniqueOrThrow({ where: { id: goalId }, select: { title: true } });
  await prisma
    .$transaction([prisma.pathMember.create({ data: { goalId, userId } }), prisma.pathEvent.create({ data: { goalId, userId, kind: "joined", title: goal.title } })])
    .catch((error) => {
      // Двойное нажатие «Присоединиться»: второй запрос видит, что участник уже есть.
      if (!isUnique(error)) throw error;
    });
  return goalId;
}

export async function join(userId: string, code: string) {
  const goal = await prisma.pathGoal.findUnique({ where: { invite: code }, select: { id: true } });
  if (!goal) throw new PathError("Приглашение устарело или не существует", 404);
  return addMember(userId, goal.id);
}

/**
 * Вступить по учебной карточке из ленты. Приглашает только репост
 * владельца и только пока код в нём совпадает с текущим: «Сменить ссылку»
 * отзывает и старые посты. Заблокированным друг другом пост не открывается.
 */
export async function joinViaShare(userId: string, postId: string) {
  const share = await prisma.pathShare.findUnique({ where: { postId }, include: { goal: { select: { invite: true } }, post: { select: { userId: true } } } });
  if (!share || (await blockedIds(userId)).includes(share.post.userId)) throw new PathError("Пост больше не доступен", 404);
  if (!share.invite || share.invite !== share.goal.invite) throw new PathError("Приглашение по этому посту больше не действует — попроси у владельца новую ссылку", 403);
  await addMember(userId, share.goalId);
  return share;
}

export async function leave(userId: string, goalId: string) {
  const member = await membership(userId, goalId);
  if (member.role === "owner") throw new PathError("Владелец не может выйти — можно удалить цель целиком");
  await prisma.pathMember.delete({ where: { goalId_userId: { goalId, userId } } });
}

export async function removeMember(userId: string, goalId: string, target: string) {
  await ownerOf(userId, goalId);
  if (target === userId) throw new PathError("Себя удалить нельзя");
  await prisma.pathMember.deleteMany({ where: { goalId, userId: target } });
}

export async function rotateInvite(userId: string, goalId: string) {
  await ownerOf(userId, goalId);
  await prisma.pathGoal.update({ where: { id: goalId }, data: { invite: inviteCode() } });
}

export async function deleteGoal(userId: string, goalId: string) {
  await ownerOf(userId, goalId);
  await prisma.pathGoal.delete({ where: { id: goalId } });
}

/** Показать свой результат в ленте круга: без этого остальные видят событие без баллов (FR-32). */
export async function shareEvent(userId: string, eventId: string) {
  const updated = await prisma.pathEvent.updateMany({ where: { id: eventId, userId }, data: { shared: true } });
  if (!updated.count) throw new PathError("Событие не найдено", 404);
}

// ---------- лента сообщества ----------

/** Репост цели, юнита или видео в ленту сообщества (FR-33): карточка ведёт в цель. */
export async function shareToFeed(userId: string, goalId: string, body: Record<string, unknown>) {
  const member = await membership(userId, goalId);
  await requireCommunityMember(userId);
  const kind = ["goal", "unit", "video"].find((k) => k === body.kind) as "goal" | "unit" | "video" | undefined;
  if (!kind) throw new PathError("Что публикуем?", 422);
  // Звать в цель может только владелец: остальные делятся юнитом или видео, но приглашением это не станет.
  if (kind === "goal" && member.role !== "owner") throw new PathError("Позвать в цель может её владелец", 403);
  // Тот же суточный потолок, что у обычных постов: рейт-лимит в памяти сбрасывается при деплое.
  if ((await prisma.socialPost.count({ where: { userId, parentId: null, createdAt: { gt: new Date(Date.now() - 86_400_000) } } })) >= 20) throw new PathError("Не больше 20 постов в сутки", 429);
  let unitId: string | null = null;
  let videoId: string | null = null;
  let subject = member.goal.title;
  if (kind === "unit" || kind === "video") {
    const unit = await prisma.pathUnit.findFirst({ where: { id: String(body.unitId ?? ""), goalId } });
    if (!unit) throw new PathError("Юнит не найден", 404);
    unitId = unit.id;
    subject = unit.title;
    if (kind === "video") {
      const video = await prisma.pathVideo.findFirst({ where: { unitId: unit.id, status: "succeeded" }, orderBy: { createdAt: "desc" } });
      if (!video) throw new PathError("Видео ещё не готово", 409);
      videoId = video.id;
    }
  }
  const note = typeof body.text === "string" ? body.text.trim().slice(0, 500) : "";
  const fallback = kind === "goal" ? `Учусь: ${subject}. Присоединяйтесь!` : kind === "unit" ? `Разобрал(а) юнит «${subject}»` : `Короткое видео: ${subject}`;
  const invite = member.role === "owner" ? member.goal.invite : "";
  const post = await prisma.socialPost.create({ data: { userId, text: note || fallback, pathShare: { create: { goalId, unitId, videoId, kind, invite } } } });
  return post.id;
}

// ---------- жалобы на сгенерированное ----------

export async function reportContent(userId: string, goalId: string, body: Record<string, unknown>) {
  await membership(userId, goalId);
  const target = ["unit", "question", "video"].find((t) => t === body.target) as "unit" | "question" | "video" | undefined;
  const targetId = typeof body.targetId === "string" ? body.targetId : "";
  const reason = typeof body.reason === "string" ? body.reason.trim().slice(0, 500) : "";
  if (!target || !targetId || reason.length < 3) throw new PathError("Опиши, что не так (от 3 символов)", 422);
  let snapshot: Prisma.InputJsonValue;
  if (target === "question") {
    const q = await prisma.pathQuestion.findFirst({ where: { id: targetId, goalId } });
    if (!q) throw new PathError("Вопрос не найден", 404);
    snapshot = { stem: q.stem, options: q.options, answer: q.answer, explanation: q.explanation };
  } else if (target === "unit") {
    const u = await prisma.pathUnit.findFirst({ where: { id: targetId, goalId } });
    if (!u) throw new PathError("Юнит не найден", 404);
    snapshot = { title: u.title, body: u.body.slice(0, 4000), version: u.version };
  } else {
    const v = await prisma.pathVideo.findFirst({ where: { id: targetId, unit: { goalId } } });
    if (!v) throw new PathError("Видео не найдено", 404);
    snapshot = { script: v.script ?? null, unitVersion: v.unitVersion };
  }
  await prisma.pathReport.upsert({
    where: { userId_target_targetId: { userId, target, targetId } },
    create: { userId, goalId, target, targetId, reason, snapshot },
    update: { reason, snapshot, resolved: false },
  });
  // Два разных человека пожаловались на вопрос — он больше не выдаётся, пока владелец не решит.
  if (target === "question" && (await prisma.pathReport.count({ where: { target, targetId, resolved: false } })) >= 2) {
    await prisma.pathQuestion.update({ where: { id: targetId }, data: { status: "rejected" } });
  }
}

/**
 * Решение владельца по жалобе (FR-36): «убрать» — вопрос больше не
 * выдаётся, юнит переписывается заново (новая версия, старое видео не
 * используется), видео удаляется; «оставить» — жалоба закрывается, а
 * снятый по жалобам вопрос возвращается.
 */
export async function resolveReport(userId: string, goalId: string, reportId: string, action: unknown) {
  await ownerOf(userId, goalId);
  const report = await prisma.pathReport.findFirst({ where: { id: reportId, goalId } });
  if (!report) throw new PathError("Жалоба не найдена", 404);
  if (action !== "reject" && action !== "keep") throw new PathError("Убрать или оставить?", 422);
  await prisma.$transaction(async (tx) => {
    if (action === "reject") {
      if (report.target === "question") await tx.pathQuestion.updateMany({ where: { id: report.targetId, goalId }, data: { status: "rejected" } });
      if (report.target === "unit") {
        await tx.pathQuestion.updateMany({ where: { unitId: report.targetId, goalId }, data: { status: "rejected" } });
        await tx.pathUnit.updateMany({ where: { id: report.targetId, goalId }, data: { status: "outline", body: "", version: { increment: 1 } } });
      }
      if (report.target === "video") await tx.pathVideo.deleteMany({ where: { id: report.targetId, unit: { goalId } } });
    } else if (report.target === "question") {
      await tx.pathQuestion.updateMany({ where: { id: report.targetId, goalId }, data: { status: "active" } });
    }
    await tx.pathReport.updateMany({ where: { goalId, target: report.target, targetId: report.targetId }, data: { resolved: true } });
  });
}
