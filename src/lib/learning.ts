/** Server-authoritative learning economy. Shared types contain no API credentials. */
export const SKINS = [
  { id: "default", name: "Базовый", price: 0, image: "/characters/fit.webp", description: "Твой привычный персонаж", color: "#818890" },
  { id: "scholar", name: "Учёный", price: 60, image: "/characters/skins/scholar.webp", description: "Худи, очки и любопытство", color: "#a78bfa" },
  { id: "explorer", name: "Исследователь", price: 120, image: "/characters/skins/explorer.webp", description: "Для тех, кто идёт дальше основ", color: "#2dd4bf" },
  { id: "astronaut", name: "Орбита", price: 200, image: "/characters/skins/astronaut.webp", description: "Новый уровень притяжения знаний", color: "#60a5fa" },
] as const;
export type SkinId = typeof SKINS[number]["id"];
export type LearningQuest = { id: string; title: string; lesson: string; exercise: string; rubric: string; boss: boolean; completed: boolean; attempts: number; feedback: string; completedAt: string | null };
export type LearningSkill = { id: string; goal: string; title: string; minutes: number; quests: LearningQuest[]; createdAt: string };
export type LearningState = { xp: number; coins: number; owned: SkinId[]; equipped: SkinId; skills: LearningSkill[] };
export type PublicQuest = Omit<LearningQuest, "rubric">;
export type PublicLearningState = Omit<LearningState, "skills"> & { skills: (Omit<LearningSkill, "quests"> & { quests: PublicQuest[] })[]; revision: number; available: boolean };
export const emptyLearning = (): LearningState => ({ xp: 0, coins: 0, owned: ["default"], equipped: "default", skills: [] });
export class LearningError extends Error {}
export function publicLearning(state: LearningState, revision: number, available: boolean): PublicLearningState {
  return { ...state, revision, available, skills: state.skills.map(skill => {
    const next = skill.quests.findIndex(q => !q.completed);
    return { ...skill, quests: skill.quests.map((q, i) => {
      const { rubric: _rubric, ...visible } = q;
      return i > next && next !== -1 ? { ...visible, lesson: "", exercise: "" } : visible;
    }) };
  }) };
}
export function rewardFor(boss: boolean) { return boss ? { xp: 150, coins: 60 } : { xp: 50, coins: 20 }; }
export function applyGrade(state: LearningState, skillId: string, questId: string, score: number, feedback: string, now: string) {
  const skill = state.skills.find(s => s.id === skillId);
  const quest = skill?.quests.find(q => q.id === questId);
  if (!quest) throw new LearningError("Квест не найден");
  if (quest.completed) return { awarded: false, passed: true, ...rewardFor(false), xp: 0, coins: 0 };
  if (skill!.quests.find(q => !q.completed)?.id !== questId) throw new LearningError("Сначала пройди предыдущий квест");
  if (!Number.isInteger(score) || score < 0 || score > 100 || !feedback.trim()) throw new LearningError("Не удалось проверить ответ");
  quest.attempts += 1; quest.feedback = feedback;
  const passed = score >= 80;
  if (!passed) return { awarded: false, passed, xp: 0, coins: 0 };
  quest.completed = true; quest.completedAt = now;
  const reward = rewardFor(quest.boss); state.xp += reward.xp; state.coins += reward.coins;
  return { awarded: true, passed, ...reward };
}
export function buySkin(state: LearningState, id: string) {
  const skin = SKINS.find(s => s.id === id);
  if (!skin) throw new LearningError("Такого скина нет");
  if (state.owned.includes(skin.id)) return;
  if (state.coins < skin.price) throw new LearningError("Пока не хватает монет. Пройди ещё один квест.");
  state.coins -= skin.price; state.owned.push(skin.id);
}
export function equipSkin(state: LearningState, id: string) {
  if (!SKINS.some(s => s.id === id) || !state.owned.includes(id as SkinId)) throw new LearningError("Сначала купи этот скин");
  state.equipped = id as SkinId;
}
