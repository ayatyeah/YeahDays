import { expect, it } from "vitest";
import { createLearningSkill, gradeLearningAnswer } from "./learningAi";
// Explicit opt-in only: this test makes paid requests using the local environment.
it.skipIf(process.env.RUN_LIVE_LEARNING !== "1")("creates a route and evaluates a concrete answer through OpenAI", async () => {
  const skill = await createLearningSkill("Хочу с нуля научиться складывать целые числа от 1 до 10", 10);
  expect(skill.quests).toHaveLength(6); expect(skill.quests[5].boss).toBe(true);
  const grade = await gradeLearningAnswer({ ...skill.quests[0], exercise: "Вычисли 2+2 и объясни", rubric: "Ответ 4 и короткое объяснение сложения." }, "2+2=4. К двум предметам добавляем ещё два и получаем четыре.");
  expect(grade.score).toBeGreaterThanOrEqual(80);
}, 160_000);
