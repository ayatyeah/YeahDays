import { expect, it } from "vitest";
import { mocks } from "./mocks";
import { event } from "./event";

it("каждый учебный вариант покрывает пять лекций и использует их вопросы и объяснения", () => {
  const ids = new Set<string>();
  expect(mocks).toHaveLength(4);
  for (const mock of mocks) {
    expect(mock.questions).toHaveLength(5);
    expect(mock.questions.reduce((sum, q) => sum + q.points, 0)).toBe(100);
    mock.questions.forEach((block, index) => {
      const lectureQuestions = event.lectures[index].parts.flatMap(p => p.questions);
      expect(block.tasks).toHaveLength(4);
      for (const task of block.tasks) {
        const source = lectureQuestions.find(q => task.id === `${mock.id}-${q.id}`);
        expect(source, task.id).toBeDefined();
        if (!source) throw new Error(task.id);
        expect(ids.has(source.id), task.id).toBe(false);
        ids.add(source.id);
        expect(task.prompt).toContain(source.q);
        for (const option of source.options) expect(task.prompt).toContain(option);
        expect(task.answer.en).toContain(source.why.en);
        expect(task.answer.ru).toContain(source.why.ru);
      }
    });
  }
});
