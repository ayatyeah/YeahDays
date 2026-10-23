/**
 * Ручной смоук-тест с НАСТОЯЩИМИ OpenAI и Gemini (платно, несколько центов)
 * на локальной базе. Проверяет, что промпты дают ответы, проходящие
 * валидацию, и пишет отчёт в ~/.cache/yg-diploma/smoke-report.txt для просмотра глазами.
 * Запуск: PATH_REAL_SMOKE=1 AUTH_URL=http://localhost:3120 DATABASE_URL=<yeahdays_dev>
 *   OPENAI_API_KEY=… GOOGLE_GEMINI_API_SECRET=… npx vitest run src/lib/path/real.smoke.test.ts
 */
import { afterAll, describe, expect, it } from "vitest";

const enabled = process.env.PATH_REAL_SMOKE === "1";
const local = /@localhost[/:]|host=\/var\/run\/postgresql/.test(process.env.DATABASE_URL ?? "");

describe.skipIf(!enabled)("real AI smoke test", () => {
  let cleanup = async () => {};
  afterAll(() => cleanup());

  it("generates a map, a unit, a verified script and narration", async () => {
    const report: string[] = [];
    const { writeFileSync } = await import("node:fs");
    const log = (line: string) => {
      report.push(line);
      writeFileSync(`${process.env.HOME}/.cache/yg-diploma/smoke-report.txt`, report.join("\n"));
    };
    if (!local || process.env.PATH_AI_FAKE === "1") throw new Error("нужна локальная база и настоящий ИИ");
    const db = (await import("@/lib/db")).prisma;
    const service = await import("./service");
    const video = await import("./video");
    const user = await db.user.create({ data: { name: "Smoke", email: `smoke-${Date.now()}@yeahgrind.test` } });
    cleanup = async () => void (await db.user.delete({ where: { id: user.id } }).catch(() => {}));

    const material = [
      "Реляционная база данных хранит данные в таблицах, связанных ключами.",
      "Первичный ключ однозначно определяет строку таблицы, а внешний ключ ссылается на первичный ключ другой таблицы.",
      "Оператор INNER JOIN возвращает только те строки, для которых нашлась пара в обеих таблицах.",
      "LEFT JOIN возвращает все строки левой таблицы; если пары нет, поля правой таблицы заполняются значением NULL.",
      "GROUP BY объединяет строки с одинаковыми значениями в группы, а агрегатные функции COUNT, SUM и AVG считают итог по каждой группе.",
      "HAVING фильтрует уже сгруппированные строки, тогда как WHERE фильтрует строки до группировки.",
    ].join(" ");
    let t = Date.now();
    const goalId = await service.createGoal(user.id, service.parseGoalInput({ goal: "Сдать мидтерм по базам данных: JOIN и GROUP BY", subject: "Databases", level: "beginner", language: "ru", minutes: 20, deadline: "", material, requestId: crypto.randomUUID() }));
    const view = await service.goalView(user.id, goalId);
    log(`\nКАРТА (${Date.now() - t} мс): ${view.title}`);
    for (const s of view.skills) log(`  навык: ${s.name} ← ${s.prerequisites.map((p) => view.skills.find((x) => x.id === p)?.name).join(", ") || "—"}`);
    for (const u of view.units) log(`  юнит: ${u.title} (${u.minutes} мин) — ${u.objective}`);
    const placement = await db.pathQuestion.findMany({ where: { goalId, placement: true } });
    log(`  стартовый тест: ${placement.length} вопросов, напр.: ${placement[0]?.stem} → ${placement[0]?.options[placement[0].answer]}`);

    t = Date.now();
    const unitId = view.units[0].id;
    expect(await service.ensureUnit(user.id, unitId)).toBe("ready");
    const unit = await service.unitView(user.id, unitId);
    log(`\nЮНИТ (${Date.now() - t} мс): ${unit.title}\n${unit.paragraphs.join("\n\n")}`);
    const bank = await db.pathQuestion.findMany({ where: { unitId } });
    for (const q of bank) log(`  [${q.kind}/${q.level}] ${q.stem}${q.kind === "mcq" ? ` → ${q.options[q.answer]} | подсказка: ${q.hints[0]}` : ` | критерии: ${q.rubric.slice(0, 120)}`}`);

    t = Date.now();
    const { video: v } = await video.requestVideo(user.id, unitId);
    await video.runVideo(v.id);
    const status = await video.videoStatus(user.id, v.id);
    log(`\nВИДЕО (${Date.now() - t} мс): ${status.view.status} ${status.view.seconds.toFixed(1)} с, ошибка: ${status.view.error || "—"}`);
    for (const issue of status.view.issues) log(`  замечание: ${issue}`);
    for (const sc of status.view.script?.scenes ?? []) log(`  [${sc.kind}] ${sc.heading}: ${sc.sentences.map((x) => `${x.text} (¶${x.ref})`).join(" ")}`);
    expect(["succeeded", "needs_review"]).toContain(status.view.status);
    if (status.view.status === "succeeded") {
      const clip = await video.clipFor(user.id, v.id, 0);
      writeFileSync(`${process.env.HOME}/.cache/yg-diploma/tts/smoke-scene0.wav`, clip.data);
      log(await video.captionsFor(user.id, v.id));
    }
  }, 600_000);
});
