import { Prisma } from "@prisma/client";
import { prisma } from "./db";
import { emptyLearning, LearningError, type LearningState } from "./learning";

export async function readLearning(userId: string) {
  const row = await prisma.learningProfile.findUnique({ where: { userId } });
  return { state: row ? row.data as unknown as LearningState : emptyLearning(), revision: row?.revision ?? 0 };
}
/** CAS retries protect rewards/purchases against double clicks and concurrent devices. */
export async function mutateLearning<T>(userId: string, change: (state: LearningState) => T) {
  await prisma.learningProfile.upsert({ where: { userId }, create: { userId, data: emptyLearning() as unknown as Prisma.InputJsonValue }, update: {} });
  for (let attempt = 0; attempt < 5; attempt++) {
    const { state, revision } = await readLearning(userId);
    const result = change(state);
    const written = await prisma.learningProfile.updateMany({ where: { userId, revision }, data: { data: state as unknown as Prisma.InputJsonValue, revision: { increment: 1 } } });
    if (written.count === 1) return { state, revision: revision + 1, result };
  }
  throw new LearningError("Прогресс изменился на другом устройстве. Обнови страницу и повтори.");
}
