/**
 * Сквозная проверка траекторий на настоящей базе — только локальной.
 * Запуск: PATH_DB_TEST=1 PATH_AI_FAKE=1 AUTH_URL=http://localhost:3120
 *   DATABASE_URL=<yeahdays_dev> npx vitest run src/lib/path/service.db.test.ts
 * Без PATH_DB_TEST тест пропускается; на неместной базе — отказывается работать.
 */
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const enabled = process.env.PATH_DB_TEST === "1";
const local = /@localhost[/:]|host=\/var\/run\/postgresql/.test(process.env.DATABASE_URL ?? "");

describe.skipIf(!enabled)("pathways on the local database", () => {
  const tag = `pathtest-${Date.now()}`;
  const ids: string[] = [];
  let db: typeof import("@/lib/db").prisma;
  let service: typeof import("./service");
  let quiz: typeof import("./quiz");
  let video: typeof import("./video");

  beforeAll(async () => {
    if (!local || process.env.PATH_AI_FAKE !== "1") throw new Error("только локальная база и фейковый ИИ");
    db = (await import("@/lib/db")).prisma;
    service = await import("./service");
    quiz = await import("./quiz");
    video = await import("./video");
    for (const name of ["owner", "friend", "stranger"]) {
      const user = await db.user.create({ data: { name: `${name} ${tag}`, email: `${name}-${tag}@yeahgrind.test` } });
      // Публиковать в ленте может только принявший политику сообщества.
      await db.personalizationProfile.create({ data: { userId: user.id, data: { version: (await import("@/lib/personalization")).POLICY_VERSION } } });
      ids.push(user.id);
    }
  });

  afterAll(async () => {
    if (db && ids.length) await db.user.deleteMany({ where: { id: { in: ids } } });
  });

  it("builds a pathway, adapts the quiz, schedules review, shares and makes a video", async () => {
    const [owner, friend, stranger] = ids;
    const material = "LEFT JOIN возвращает все строки левой таблицы. Если пары нет, поля правой таблицы равны NULL. INNER JOIN оставляет только совпадения. GROUP BY собирает строки в группы. HAVING фильтрует группы после агрегации.";
    const input = service.parseGoalInput({ goal: "Подготовиться к экзамену по SQL", subject: "Базы данных", level: "beginner", language: "ru", minutes: 15, deadline: "", material, requestId: crypto.randomUUID() });
    const goalId = await service.createGoal(owner, input);
    expect(await service.createGoal(owner, input)).toBe(goalId);

    // Посторонний не видит цель; карта — 5 навыков, юниты с цитатами из материала.
    await expect(service.goalView(stranger, goalId)).rejects.toMatchObject({ status: 404 });
    let view = await service.goalView(owner, goalId);
    expect(view.skills).toHaveLength(5);
    expect(view.units.every((u) => !u.ready)).toBe(true);
    expect(view.recommendations.map((r) => r.unitId)).toEqual([view.units[0].id]);
    expect(view.recommendations[0].reason.kind).toBe("new");
    const spans = await db.pathUnit.findMany({ where: { goalId }, select: { sourceSpan: true } });
    expect(spans.every((s) => material.includes(s.sourceSpan))).toBe(true);

    // Стартовый тест: по вопросу на навык, без ключа ответа в выдаче.
    let started = await quiz.startQuiz(owner, goalId, { kind: "placement" });
    expect(started.item).not.toHaveProperty("answer");
    expect(started.item.max).toBe(5);
    for (let i = 0; i < 5; i++) {
      const q = await db.pathQuestion.findUniqueOrThrow({ where: { id: started.item.id } });
      const res = await quiz.answer(owner, started.quizId, { questionId: q.id, choice: i === 0 ? q.answer : (q.answer + 1) % 4, key: `pl-${tag}-${i}` });
      if (i < 4) started = { ...started, item: res.next! };
      else expect(res.done).toBe(true);
    }
    expect((await db.pathMember.findUniqueOrThrow({ where: { goalId_userId: { goalId, userId: owner } } })).placementDone).toBe(true);

    // Первый юнит пишется при открытии; банк ≥ 5 тестовых вопросов.
    const unitId = view.units[0].id;
    expect(await service.ensureUnit(owner, unitId)).toBe("ready");
    const unit = await service.unitView(owner, unitId);
    expect(unit.paragraphs.length).toBeGreaterThanOrEqual(2);
    expect(unit.bank).toBeGreaterThanOrEqual(6);

    // Подсказки до ответа: не больше доступных, без ответа.
    started = await quiz.startQuiz(owner, goalId, { kind: "unit", unitId });
    const firstQ = await db.pathQuestion.findUniqueOrThrow({ where: { id: started.item.id } });
    const h = await quiz.hint(owner, started.quizId, firstQ.id);
    expect(h.hints).toHaveLength(1);
    expect(h.hints[0]).not.toContain(firstQ.options[firstQ.answer] ?? "§");

    // Отвечаем верно, пока проверка не остановится; повтор с тем же ключом ничего не меняет.
    let item = started.item;
    let rounds = 0;
    let last: Awaited<ReturnType<typeof quiz.answer>> | null = null;
    while (item && rounds < 12) {
      const q = await db.pathQuestion.findUniqueOrThrow({ where: { id: item.id } });
      const body = q.kind === "mcq" ? { questionId: q.id, choice: q.answer, key: `u-${tag}-${rounds}` } : { questionId: q.id, text: "Главная мысль: LEFT JOIN сохраняет строки слева. Пример: студенты без оценок остаются в выборке.", key: `u-${tag}-${rounds}` };
      last = await quiz.answer(owner, started.quizId, body);
      if (rounds === 0) {
        const thetaAfterFirst = (await db.pathMastery.findFirstOrThrow({ where: { userId: owner, skillId: q.skillId } })).theta;
        const again = await quiz.answer(owner, started.quizId, body);
        expect(again.outcome.correct).toBe(true);
        expect((await db.pathMastery.findFirstOrThrow({ where: { userId: owner, skillId: q.skillId } })).theta).toBe(thetaAfterFirst);
      }
      item = last.next!;
      rounds++;
    }
    expect(last?.done).toBe(true);
    expect(rounds).toBeGreaterThanOrEqual(3);
    expect(rounds).toBeLessThanOrEqual(10);
    const m = await db.pathMastery.findFirstOrThrow({ where: { userId: owner, skillId: unit.skills[0].id } });
    expect(m.mastery).toBeGreaterThanOrEqual(0.85);
    expect(m.reviewAt!.getTime() - Date.now()).toBeGreaterThan(23 * 3600_000);
    view = await service.goalView(owner, goalId);
    expect(view.units[0].completed).toBe(true);
    expect(view.recommendations[0].unitId).toBe(view.units[1].id);
    // Стартовый тест уже дал ответы по всем навыкам, поэтому это «пробел», а не «новая тема».
    expect(view.recommendations[0].reason).toEqual({ kind: "gap", text: `Пробел в навыке: ${view.skills[1].name}` });

    // Чек-ин строит план в пределах минут.
    await service.checkIn(owner, goalId, 2, 4);
    view = await service.goalView(owner, goalId);
    expect(view.plan!.reduce((n, p) => n + p.minutes, 0)).toBeLessThanOrEqual(4);

    // Друг вступает по приглашению, видит круг; баллы владельца ему не видны.
    await service.join(friend, view.circle.invite!);
    const friendView = await service.goalView(friend, goalId);
    expect(friendView.circle.members).toHaveLength(2);
    expect(friendView.circle.invite).toBeNull();
    const done = friendView.events.find((e) => e.kind === "unit_done");
    expect(done?.score).toBeNull();
    expect(friendView.circle.weekly).toEqual({ done: 1, target: 6 });
    await expect(service.rotateInvite(friend, goalId)).rejects.toMatchObject({ status: 403 });

    // Видео: задача → сценарий → сверка → озвучка; повторный запрос — то же видео.
    const req1 = await video.requestVideo(owner, unitId);
    expect(req1.created).toBe(true);
    await video.runVideo(req1.video.id);
    const st = await video.videoStatus(friend, req1.video.id);
    expect(st.view.status).toBe("succeeded");
    expect(st.view.clips).toHaveLength(1);
    expect(st.view.seconds).toBeGreaterThan(0);
    const req2 = await video.requestVideo(friend, unitId);
    expect(req2).toMatchObject({ created: false, video: { id: req1.video.id } });
    const vtt = await video.captionsFor(friend, req1.video.id);
    expect(vtt.startsWith("WEBVTT")).toBe(true);
    await expect(video.clipFor(stranger, req1.video.id, 0)).rejects.toMatchObject({ status: 404 });

    // Повтор уже виденного вопроса не меняет его сложность для всего круга.
    const bBefore = (await db.pathQuestion.findUniqueOrThrow({ where: { id: firstQ.id } })).difficulty;
    const again = await quiz.startQuiz(owner, goalId, { kind: "unit", unitId });
    for (let i = 0; i < 12; i++) {
      const cur = await db.pathQuestion.findUniqueOrThrow({ where: { id: (await db.pathQuiz.findUniqueOrThrow({ where: { id: again.quizId } })).current! } });
      const res = await quiz.answer(owner, again.quizId, cur.kind === "mcq" ? { questionId: cur.id, choice: cur.answer, key: `r-${tag}-${i}` } : { questionId: cur.id, text: "Главная мысль юнита и пример: студенты без оценок остаются в выборке LEFT JOIN.", key: `r-${tag}-${i}` });
      if (res.done) break;
    }
    expect((await db.pathQuestion.findUniqueOrThrow({ where: { id: firstQ.id } })).difficulty).toBe(bBefore);

    // Звать в цель может только владелец; смена ссылки отзывает и старые репосты.
    await expect(service.shareToFeed(friend, goalId, { kind: "goal" })).rejects.toMatchObject({ status: 403 });
    await expect(service.joinViaShare(stranger, await service.shareToFeed(friend, goalId, { kind: "unit", unitId }))).rejects.toMatchObject({ status: 403 });
    const ownerPost = await service.shareToFeed(owner, goalId, { kind: "goal" });
    await service.rotateInvite(owner, goalId);
    await expect(service.joinViaShare(stranger, ownerPost)).rejects.toMatchObject({ status: 403 });
    await service.join(friend, (await service.goalView(owner, goalId)).circle.invite!);

    // Две жалобы на вопрос снимают его с выдачи; владелец может вернуть.
    await service.reportContent(owner, goalId, { target: "question", targetId: firstQ.id, reason: "Неверный ключ" });
    await service.reportContent(friend, goalId, { target: "question", targetId: firstQ.id, reason: "Спорный вопрос" });
    expect((await db.pathQuestion.findUniqueOrThrow({ where: { id: firstQ.id } })).status).toBe("rejected");
    const report = (await service.goalView(owner, goalId)).reports[0];
    expect((report.snapshot as { answer: unknown }).answer).toBe(firstQ.answer); // владелец уже отвечал на этот вопрос
    await service.resolveReport(owner, goalId, report.id, "keep");
    expect((await db.pathQuestion.findUniqueOrThrow({ where: { id: firstQ.id } })).status).toBe("active");

    // Удаление аккаунта владельца убирает цель целиком (каскад).
    await db.user.delete({ where: { id: owner } });
    ids.splice(ids.indexOf(owner), 1);
    expect(await db.pathGoal.findUnique({ where: { id: goalId } })).toBeNull();
    expect(await db.pathMastery.count({ where: { userId: owner } })).toBe(0);
  }, 60_000);
});
