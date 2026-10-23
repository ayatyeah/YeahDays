/**
 * Адаптивная проверка: стартовый тест, проверка юнита и повторение.
 *
 * Сервер держит, какой вопрос сейчас открыт (PathQuiz.current), и выдаёт
 * его без ключа ответа; ключ и объяснения приходят только после попытки
 * (FR-29). Ответ принимается один раз: повтор с тем же ключом
 * идемпотентности возвращает прежний результат и ничего не меняет (FR-27),
 * а двойной клик с новым ключом упирается в захват current.
 *
 * После каждого ответа в одной транзакции: Elo-обновление способности по
 * навыку и сложности вопроса, общая способность ученика, освоение и
 * расписание повторений, выбор следующего вопроса или остановка.
 */

import type { PathQuestion, PathQuiz, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { dailyLimit } from "@/lib/aiLimit";
import { gradeOpen } from "./ai";
import { fakeEnabled } from "./fake";
import { eloUpdate, isMasteredStatus, masteryOf, MAX_ITEMS, priorUpdate, selectItem, shouldStop } from "./elo";
import { reviewDue, scheduleReview } from "./pathway";
import { membership, PathError } from "./service";

type Kind = "placement" | "unit" | "review";
const RESUME_MS = 2 * 3600_000;

function publicItem(q: PathQuestion, quiz: Pick<PathQuiz, "served" | "hints" | "kind" | "skillIds">, skillName: string) {
  return {
    id: q.id,
    kind: q.kind as "mcq" | "open",
    stem: q.stem,
    options: q.kind === "mcq" ? q.options : [],
    skill: skillName,
    hints: q.hints.slice(0, quiz.hints),
    hintsLeft: Math.max(0, Math.min(2, q.hints.length) - quiz.hints),
    number: quiz.served.length + 1,
    max: quiz.kind === "placement" ? Math.min(MAX_ITEMS, quiz.skillIds.length) : MAX_ITEMS,
  };
}

/** Открытые задания — только в проверке юнита и только когда есть кому их проверить. */
function servable(items: PathQuestion[], kind: string) {
  const grading = kind === "unit" && (fakeEnabled() || !!process.env.OPENAI_API_KEY?.trim());
  return items.filter((q) => q.kind === "mcq" || grading);
}

async function bank(goalId: string, skillIds: string[], kind: Kind) {
  return servable(await prisma.pathQuestion.findMany({ where: { goalId, skillId: { in: skillIds }, status: "active" } }), kind);
}

/** Способности по навыкам; недостающие строки создаются от общей способности ученика. */
async function abilities(tx: Db, userId: string, goalId: string, skillIds: string[]) {
  const existing = await tx.pathMastery.findMany({ where: { userId, skillId: { in: skillIds } } });
  const missing = skillIds.filter((id) => !existing.some((m) => m.skillId === id));
  if (missing.length) {
    const prior = await tx.pathLearner.findUnique({ where: { userId } });
    await tx.pathMastery.createMany({ data: missing.map((skillId) => ({ userId, skillId, goalId, theta: prior?.theta ?? 0 })), skipDuplicates: true });
    return tx.pathMastery.findMany({ where: { userId, skillId: { in: skillIds } } });
  }
  return existing;
}

type Db = Prisma.TransactionClient | typeof prisma;

/** Вопросы, на которые человек уже отвечал в любой проверке. */
async function seenBy(db: Db, userId: string, questionIds: string[]) {
  if (!questionIds.length) return new Set<string>();
  const rows = await db.pathAttempt.findMany({ where: { userId, questionId: { in: questionIds } }, select: { questionId: true }, distinct: ["questionId"] });
  return new Set(rows.map((r) => r.questionId));
}

/**
 * Следующий вопрос: сначала те, что человек ещё не видел, и только когда
 * они кончились — уже знакомые. Иначе пересдача по памяти накручивала бы
 * освоение и сдвигала общую сложность вопросов для всего круга.
 */
function nextAdaptive(items: PathQuestion[], theta: Record<string, number>, served: string[], seen: Set<string>) {
  return selectItem(items.filter((q) => !seen.has(q.id)), theta, served) ?? selectItem(items, theta, served);
}

/** Стартовый тест: по одному вопросу на навык (до 10), тот, что ближе всего к P = 0.7. */
function placementNext(items: PathQuestion[], theta: Record<string, number>, quiz: Pick<PathQuiz, "served" | "skillIds">) {
  const servedSkills = new Set(items.filter((q) => quiz.served.includes(q.id)).map((q) => q.skillId));
  const skill = quiz.skillIds.find((id) => !servedSkills.has(id) && items.some((q) => q.skillId === id));
  if (!skill || quiz.served.length >= MAX_ITEMS) return null;
  const pool = items.filter((q) => q.skillId === skill);
  const preferred = pool.filter((q) => q.placement);
  return selectItem(preferred.length ? preferred : pool, { [skill]: theta[skill] ?? 0 }, quiz.served);
}

export async function startQuiz(userId: string, goalId: string, body: Record<string, unknown>) {
  const member = await membership(userId, goalId);
  const kind = (["placement", "unit", "review"] as const).find((k) => k === body.kind);
  if (!kind) throw new PathError("Какая проверка?", 422);
  const unitId = typeof body.unitId === "string" && body.unitId ? body.unitId : null;
  let skillIds: string[];
  if (kind === "placement") {
    skillIds = (await prisma.pathSkill.findMany({ where: { goalId }, orderBy: { position: "asc" }, take: MAX_ITEMS, select: { id: true } })).map((s) => s.id);
  } else if (unitId) {
    const unit = await prisma.pathUnit.findFirst({ where: { id: unitId, goalId } });
    if (!unit) throw new PathError("Юнит не найден", 404);
    if (unit.status !== "ready") throw new PathError("Юнит ещё готовится", 409);
    skillIds = unit.skillIds;
  } else {
    const now = new Date();
    const due = await prisma.pathMastery.findMany({ where: { userId, goalId, masteredAt: { not: null }, reviewAt: { lte: now } } });
    skillIds = due.filter((m) => reviewDue(m, now)).map((m) => m.skillId);
    if (!skillIds.length) throw new PathError("Сейчас нечего повторять — загляни завтра", 409);
  }
  const resume = await prisma.pathQuiz.findFirst({ where: { userId, goalId, kind, unitId, status: "active", createdAt: { gt: new Date(Date.now() - RESUME_MS) }, current: { not: null } }, orderBy: { createdAt: "desc" } });
  const quiz = resume ?? (await prisma.pathQuiz.create({ data: { userId, goalId, unitId, kind, skillIds } }));
  const items = await bank(goalId, quiz.skillIds, kind);
  const mastery = await abilities(prisma, userId, goalId, quiz.skillIds);
  const theta = Object.fromEntries(mastery.map((m) => [m.skillId, m.theta]));
  let current = quiz.current ? items.find((q) => q.id === quiz.current) ?? null : null;
  if (!current) {
    current = kind === "placement" ? placementNext(items, theta, quiz) : nextAdaptive(items, theta, quiz.served, await seenBy(prisma, userId, items.map((q) => q.id)));
    if (!current) throw new PathError("Для этой проверки пока нет вопросов", 409);
    await prisma.pathQuiz.update({ where: { id: quiz.id }, data: { current: current.id, hints: 0 } });
    quiz.hints = 0;
  }
  const skill = await prisma.pathSkill.findUnique({ where: { id: current.skillId }, select: { name: true } });
  return { quizId: quiz.id, kind, unitId, language: member.goal.language, item: publicItem(current, quiz, skill?.name ?? "") };
}

export async function hint(userId: string, quizId: string, questionId: unknown) {
  const quiz = await prisma.pathQuiz.findFirst({ where: { id: quizId, userId, status: "active" } });
  if (!quiz?.current || quiz.current !== questionId) throw new PathError("Вопрос уже закрыт", 409);
  await membership(userId, quiz.goalId);
  const q = await prisma.pathQuestion.findUnique({ where: { id: quiz.current } });
  if (!q) throw new PathError("Вопрос больше не доступен", 404);
  const limit = Math.min(2, q.hints.length);
  if (quiz.hints >= limit) throw new PathError("Подсказок больше нет — попробуй ответить");
  const updated = await prisma.pathQuiz.updateMany({ where: { id: quizId, current: q.id, hints: quiz.hints }, data: { hints: { increment: 1 } } });
  if (!updated.count) throw new PathError("Подсказка уже открыта", 409);
  return { hints: q.hints.slice(0, quiz.hints + 1), hintsLeft: limit - quiz.hints - 1 };
}

interface Outcome {
  correct: boolean;
  score: number;
  correctIndex: number | null;
  explanation: string;
  chosenWhy: string;
  feedback: { strength: string; improvement: string } | null;
}

function outcomeFor(q: PathQuestion, score: number, choice: number | null, feedback: Outcome["feedback"]): Outcome {
  const wrongIndex = choice !== null && choice !== q.answer ? (choice < q.answer ? choice : choice - 1) : -1;
  return {
    correct: q.kind === "mcq" ? score === 1 : score >= 0.8,
    score,
    correctIndex: q.kind === "mcq" ? q.answer : null,
    explanation: q.explanation,
    chosenWhy: wrongIndex >= 0 ? q.wrongWhy[wrongIndex] ?? "" : "",
    feedback,
  };
}

/** Ответ на текущий вопрос. body: { questionId, choice | text, key, ms }. */
export async function answer(userId: string, quizId: string, body: Record<string, unknown>) {
  const key = typeof body.key === "string" ? body.key : "";
  if (!/^[A-Za-z0-9_-]{8,64}$/.test(key)) throw new PathError("Нет ключа ответа", 422);
  const previous = await prisma.pathAttempt.findUnique({ where: { key } });
  if (previous) {
    if (previous.userId !== userId) throw new PathError("Некорректный запрос", 409);
    return replay(userId, previous.quizId, previous);
  }
  const quiz = await prisma.pathQuiz.findFirst({ where: { id: quizId, userId } });
  if (!quiz) throw new PathError("Проверка не найдена", 404);
  const member = await membership(userId, quiz.goalId);
  if (quiz.status !== "active" || !quiz.current || quiz.current !== body.questionId) return closed(userId, key);
  const q = await prisma.pathQuestion.findUnique({ where: { id: quiz.current } });
  if (!q) throw new PathError("Вопрос больше не доступен", 404);

  let score: number;
  let choice: number | null = null;
  let given: string;
  let feedback: Outcome["feedback"] = null;
  if (q.kind === "mcq") {
    choice = Number(body.choice);
    if (!Number.isInteger(choice) || choice < 0 || choice >= q.options.length) throw new PathError("Выбери вариант", 422);
    score = choice === q.answer ? 1 : 0;
    given = String(choice);
  } else {
    const text = typeof body.text === "string" ? body.text.trim() : "";
    if (text.length < 2 || text.length > 4000) throw new PathError("Напиши ответ (до 4000 символов)", 422);
    if (!(await dailyLimit(`path:grade:${userId}`, 40)) || !(await dailyLimit("path:grade:global", 2000))) throw new PathError("Лимит проверок на сегодня исчерпан", 429);
    const grade = await gradeOpen(q.stem, q.rubric, text, member.goal.language);
    score = grade.score / 100;
    given = text;
    feedback = { strength: grade.strength, improvement: grade.improvement };
  }
  const ms = Math.max(0, Math.min(3_600_000, Math.round(Number(body.ms) || 0)));
  const now = new Date();

  const result = await prisma.$transaction(async (tx) => {
    const claim = await tx.pathQuiz.updateMany({ where: { id: quiz.id, status: "active", current: q.id }, data: { current: null } });
    if (!claim.count) throw new PathError("Этот вопрос уже закрыт", 409);
    // Повтор уже виденного вопроса — слабое свидетельство: θ двигается вдвое меньше, а сложность
    // вопроса и общая способность не меняются (иначе пересдача по памяти сдвигала бы их для всех).
    const repeat = (await tx.pathAttempt.count({ where: { userId, questionId: q.id } })) > 0;
    const masteryRows = await abilities(tx, userId, quiz.goalId, quiz.skillIds.includes(q.skillId) ? quiz.skillIds : [...quiz.skillIds, q.skillId]);
    const before = masteryRows.find((m) => m.skillId === q.skillId)!;
    const learner = await tx.pathLearner.upsert({ where: { userId }, create: { userId }, update: {} });
    const elo = eloUpdate({ theta: before.theta, thetaAnswers: before.answers, difficulty: q.difficulty, itemAnswers: q.answers, score });
    const theta = repeat ? before.theta + (elo.theta - before.theta) / 2 : elo.theta;
    const difficulty = repeat ? q.difficulty : elo.difficulty;
    if (!repeat) {
      await tx.pathQuestion.update({ where: { id: q.id }, data: { difficulty: { increment: elo.difficulty - q.difficulty }, answers: { increment: 1 } } });
      await tx.pathLearner.update({ where: { userId }, data: { theta: priorUpdate(learner.theta, learner.answers, score, elo.p), answers: { increment: 1 } } });
    }
    const difficulties = (await tx.pathQuestion.findMany({ where: { goalId: quiz.goalId, skillId: q.skillId, status: "active" }, select: { difficulty: true } })).map((x) => x.difficulty);
    const after = { mastery: masteryOf(theta, difficulties), answers: before.answers + 1 };
    const review = scheduleReview(before, after, now);
    await tx.pathMastery.update({ where: { userId_skillId: { userId, skillId: q.skillId } }, data: { theta, answers: after.answers, mastery: after.mastery, ...review } });
    await tx.pathAttempt.create({ data: { quizId: quiz.id, userId, questionId: q.id, skillId: q.skillId, score, answer: given.slice(0, 4000), p: elo.p, thetaBefore: before.theta, thetaAfter: theta, bBefore: q.difficulty, bAfter: difficulty, hints: quiz.hints, ms, key } });

    const served = [...quiz.served, q.id];
    const skills = await tx.pathSkill.findMany({ where: { id: { in: quiz.skillIds } }, select: { id: true, name: true } });
    const status = await tx.pathMastery.findMany({ where: { userId, skillId: { in: quiz.skillIds } } });
    if (!before.masteredAt && review.masteredAt) {
      await tx.pathEvent.create({ data: { goalId: quiz.goalId, userId, kind: "skill_mastered", title: skills.find((s) => s.id === q.skillId)?.name ?? "" } });
    }
    const items = await tx.pathQuestion.findMany({ where: { goalId: quiz.goalId, skillId: { in: quiz.skillIds }, status: "active" } });
    const usable = servable(items, quiz.kind);
    const thetas = Object.fromEntries(status.map((m) => [m.skillId, m.theta]));
    const nextQuiz = { ...quiz, served };
    let next: PathQuestion | null = null;
    if (quiz.kind === "placement") next = placementNext(usable, thetas, nextQuiz);
    else if (!shouldStop(status, served.length, usable.filter((x) => !served.includes(x.id)).length)) next = nextAdaptive(usable, thetas, served, await seenBy(tx, userId, usable.map((x) => x.id)));
    if (next) {
      await tx.pathQuiz.update({ where: { id: quiz.id }, data: { served, current: next.id, hints: 0 } });
    } else {
      await tx.pathQuiz.update({ where: { id: quiz.id }, data: { served, status: "done", finishedAt: now } });
      const attempts = await tx.pathAttempt.findMany({ where: { quizId: quiz.id }, select: { score: true } });
      const share = attempts.reduce((a, x) => a + x.score, 0) / Math.max(1, attempts.length);
      if (quiz.kind === "unit" && quiz.unitId) {
        const unit = await tx.pathUnit.findUnique({ where: { id: quiz.unitId }, select: { title: true } });
        await tx.pathProgress.upsert({ where: { userId_unitId: { userId, unitId: quiz.unitId } }, create: { userId, unitId: quiz.unitId, goalId: quiz.goalId, completedAt: now }, update: { completedAt: now } });
        await tx.pathEvent.create({ data: { goalId: quiz.goalId, userId, kind: "unit_done", title: unit?.title ?? "", score: share } });
      }
      if (quiz.kind === "placement") {
        await tx.pathMember.update({ where: { goalId_userId: { goalId: quiz.goalId, userId } }, data: { placementDone: true } });
        await tx.pathEvent.create({ data: { goalId: quiz.goalId, userId, kind: "placement_done", title: "", score: share } });
      }
    }
    return {
      next: next ? publicItem(next, { ...nextQuiz, hints: 0 }, skills.find((x) => x.id === next!.skillId)?.name ?? "") : null,
      mastery: skills.map((s) => {
        const m = status.find((x) => x.skillId === s.id);
        return { skillId: s.id, name: s.name, mastery: m?.mastery ?? 0, answers: m?.answers ?? 0, mastered: !!m && isMasteredStatus(m) };
      }),
    };
  }).catch(async (error) => {
    // Параллельный запрос с тем же ключом успел записать ответ — отдаём его исход, а не 409.
    if ((error instanceof PathError && error.status === 409) || (error as { code?: string })?.code === "P2002") {
      const same = await prisma.pathAttempt.findUnique({ where: { key } });
      if (same?.userId === userId) return null;
    }
    throw error;
  });
  if (!result) return closed(userId, key);
  return { outcome: outcomeFor(q, score, choice, feedback), done: !result.next, next: result.next, mastery: result.mastery, summary: result.next ? null : await summary(quiz.id) };
}

/** Вопрос уже закрыт: если это наш же ответ (тот же ключ) — повторяем его исход, иначе 409. */
async function closed(userId: string, key: string) {
  const same = await prisma.pathAttempt.findUnique({ where: { key } });
  if (same?.userId === userId) return replay(userId, same.quizId, same);
  throw new PathError("Этот вопрос уже закрыт", 409);
}

async function summary(quizId: string) {
  const attempts = await prisma.pathAttempt.findMany({ where: { quizId }, select: { score: true } });
  return { asked: attempts.length, correct: attempts.filter((a) => a.score >= 0.8).length };
}

/** Повтор запроса с тем же ключом: тот же исход, состояние проверки как сейчас. */
async function replay(userId: string, quizId: string, attempt: { questionId: string; score: number; answer: string }) {
  const [q, quiz] = await Promise.all([
    prisma.pathQuestion.findUnique({ where: { id: attempt.questionId } }),
    prisma.pathQuiz.findFirst({ where: { id: quizId, userId } }),
  ]);
  if (!q || !quiz) throw new PathError("Проверка больше не доступна", 404);
  const choice = q.kind === "mcq" ? Number(attempt.answer) : null;
  const status = await prisma.pathMastery.findMany({ where: { userId, skillId: { in: quiz.skillIds } }, include: { skill: { select: { name: true } } } });
  const current = quiz.status === "active" && quiz.current ? await prisma.pathQuestion.findUnique({ where: { id: quiz.current } }) : null;
  return {
    outcome: outcomeFor(q, attempt.score, choice, null),
    done: quiz.status === "done",
    next: current ? publicItem(current, quiz, status.find((m) => m.skillId === current.skillId)?.skill.name ?? "") : null,
    mastery: status.map((m) => ({ skillId: m.skillId, name: m.skill.name, mastery: m.mastery, answers: m.answers, mastered: isMasteredStatus(m) })),
    summary: quiz.status === "done" ? await summary(quiz.id) : null,
  };
}
