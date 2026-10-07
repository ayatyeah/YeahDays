import type { MockExam } from "../types";
import { mocksA } from "./mocksA";
import { mocksB } from "./mocksB";
import { mocksC } from "./mocksC";
import { mocksD } from "./mocksD";

/**
 * Пробные варианты мидтерма с открытыми вопросами (проверка ИИ — lib/examGrade.ts).
 * v1 — образец преподавателя дословно; v2 — настоящий вариант другой группы
 * (ткани); v7 — настоящий «Variant 5» (птицы на фотоловушках), недостающие
 * задания дописаны; v3–v6 и v8 — новые, по лекциям и типам вопросов настоящих
 * вариантов.
 *
 * Как на экзамене: пять заданий — три открытых вопроса (OpenCV, пайплайн,
 * своя система) и две задачи с расчётом (классификация по оценкам и
 * линейный классификатор). Название — «Midterm Variant N», сценарий уходит
 * в подпись.
 */
const scene = (title: string) => {
  const rest = title.replace(/^[^—]*—\s*/, "");
  return rest.charAt(0).toUpperCase() + rest.slice(1);
};

const asMidterm = (exam: MockExam): MockExam => {
  const n = exam.id.slice(1);
  return {
    ...exam,
    title: { en: `Midterm Variant ${n}`, ru: `Midterm Variant ${n}` },
    source: { en: `${scene(exam.title.en)} · ${exam.source.en}`, ru: `${scene(exam.title.ru)} · ${exam.source.ru}` },
    questions: exam.questions.map((q, i) => ({ ...q, kind: i === 1 || i === 2 ? "task" : "question" })),
  };
};

export const mocks: MockExam[] = [...mocksA, ...mocksB, ...mocksC, ...mocksD]
  .sort((a, b) => Number(a.id.slice(1)) - Number(b.id.slice(1)))
  .map(asMidterm);
