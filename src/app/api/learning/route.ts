import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { rateLimit } from "@/lib/rateLimit";
import { dailyLimit } from "@/lib/aiLimit";
import { applyGrade, buySkin, equipSkin, LearningError, publicLearning } from "@/lib/learning";
import { readLearning, mutateLearning } from "@/lib/learningDb";
import { createLearningSkill, gradeLearningAnswer } from "@/lib/learningAi";

import { parseLearningSubject } from "@/lib/learningSubjects";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const available = () => !!process.env.OPENAI_API_KEY?.trim();
export async function GET() {
  const userId = (await auth())?.user?.id;
  if (!userId) return NextResponse.json({ error: "Войди в аккаунт" }, { status: 401 });
  try {
    const { state, revision } = await readLearning(userId);
    return NextResponse.json(publicLearning(state, revision, available()));
  } catch { return NextResponse.json({ error: "Не удалось загрузить обучение и магазин. Попробуй позже." }, { status: 503 }); }
}
async function bodyOf(req: Request) {
  const reader = req.body?.getReader(); if (!reader) throw new LearningError("Пустой запрос");
  const chunks: Uint8Array[] = []; let bytes = 0;
  while (true) { const { value, done } = await reader.read(); if (done) break; bytes += value.length; if (bytes > 24_000) { await reader.cancel(); throw new LearningError("Ответ слишком длинный"); } chunks.push(value); }
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8")); } catch { throw new LearningError("Некорректный запрос"); }
}
export async function POST(req: Request) {
  const userId = (await auth())?.user?.id;
  if (!userId) return NextResponse.json({ error: "Войди в аккаунт" }, { status: 401 });
  if (!rateLimit(`learning:${userId}`, 15, 60_000)) return NextResponse.json({ error: "Слишком много запросов. Подожди минуту." }, { status: 429 });
  try {
    const body = await bodyOf(req);
    if (!body || typeof body.action !== "string") throw new LearningError("Выбери действие");
    if (body.action === "buy" || body.action === "equip") {
      if (typeof body.skinId !== "string") throw new LearningError("Выбери скин");
      const updated = await mutateLearning(userId, state => body.action === "buy" ? buySkin(state, body.skinId) : equipSkin(state, body.skinId));
      return NextResponse.json({ state: publicLearning(updated.state, updated.revision, available()) });
    }
    if (body.action !== "create" && body.action !== "answer") throw new LearningError("Неизвестное действие");
    if (!available()) return NextResponse.json({ error: "ИИ ещё не подключён на сервере" }, { status: 503 });
    const current = await readLearning(userId);
    if (body.action === "create") {
      if (typeof body.goal !== "string" || body.goal.trim().length < 5 || body.goal.length > 600 || ![10, 20, 30].includes(body.minutes) || typeof body.requestId !== "string" || !/^[0-9a-f-]{36}$/i.test(body.requestId)) throw new LearningError("Напиши цель от 5 до 600 символов и выбери время");
      const subject = parseLearningSubject(body.subject);
      if (current.state.skills.some(s => s.id === body.requestId)) return NextResponse.json({ state: publicLearning(current.state, current.revision, available()) });
      if (current.state.skills.length >= 12 || current.state.skills.filter(s => s.quests.some(q => !q.completed)).length >= 3) throw new LearningError("Сначала заверши один из начатых маршрутов (максимум 3 одновременно, 12 всего).");
      if (!(await dailyLimit(`learning:create:${userId}`, 3)) || !(await dailyLimit("learning:global:create", 100))) return NextResponse.json({ error: "На сегодня лимит новых маршрутов исчерпан" }, { status: 429 });
      const skill = await createLearningSkill(body.goal.trim(), body.minutes, subject); skill.id = body.requestId;
      const updated = await mutateLearning(userId, state => {
        if (state.skills.some(s => s.id === skill.id)) return;
        if (state.skills.length >= 12 || state.skills.filter(s => s.quests.some(q => !q.completed)).length >= 3) throw new LearningError("Уже открыто 3 маршрута. Заверши один из них.");
        state.skills.push(skill);
      });
      return NextResponse.json({ state: publicLearning(updated.state, updated.revision, available()), skillId: skill.id });
    }
    if (typeof body.skillId !== "string" || typeof body.questId !== "string" || typeof body.answer !== "string" || !body.answer.trim() || body.answer.length > 6000) throw new LearningError("Напиши ответ (до 6000 символов)");
    const skill = current.state.skills.find(s => s.id === body.skillId);
    const quest = skill?.quests.find(q => q.id === body.questId);
    if (!quest) throw new LearningError("Квест не найден в твоём аккаунте");
    if (quest.completed) return NextResponse.json({ state: publicLearning(current.state, current.revision, available()), result: { awarded: false, passed: true, xp: 0, coins: 0 } });
    if (skill!.quests.find(q => !q.completed)?.id !== quest.id) throw new LearningError("Пройди предыдущий квест");
    if (!(await dailyLimit(`learning:grade:${userId}`, 30)) || !(await dailyLimit("learning:global:grade", 1000))) return NextResponse.json({ error: "Лимит проверок на сегодня исчерпан. Продолжим завтра." }, { status: 429 });
    const grade = await gradeLearningAnswer(quest, body.answer.trim());
    const updated = await mutateLearning(userId, state => applyGrade(state, body.skillId, body.questId, grade.score, grade.feedback, new Date().toISOString()));
    return NextResponse.json({ state: publicLearning(updated.state, updated.revision, available()), result: { ...updated.result, feedback: grade.feedback, score: grade.score } });
  } catch (error) {
    if (error instanceof LearningError) return NextResponse.json({ error: error.message }, { status: 400 });
    // Neither provider errors nor database diagnostics are sent to the browser.
    return NextResponse.json({ error: "Не удалось выполнить действие. Проверь подключение ИИ или попробуй позже." }, { status: 502 });
  }
}
