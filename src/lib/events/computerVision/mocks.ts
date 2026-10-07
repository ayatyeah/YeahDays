import type { MockExam } from "../types";
import { mocksA } from "./mocksA";
import { mocksB } from "./mocksB";
import { mocksC } from "./mocksC";
import { mocksD } from "./mocksD";

/**
 * Пробные варианты мидтерма с открытыми вопросами (проверка ИИ — lib/examGrade.ts).
 * v1 — образец преподавателя дословно; v2 — настоящий вариант другой группы
 * (ткани); v7 — настоящий «Variant 5» (птицы на фотоловушках), недостающие
 * задания дописаны; v3–v6 и v8 — новые, по типам вопросов настоящих вариантов.
 */
export const mocks: MockExam[] = [...mocksA, ...mocksD, ...mocksB, ...mocksC].sort(
  (a, b) => Number(a.id.slice(1)) - Number(b.id.slice(1)),
);
