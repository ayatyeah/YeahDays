import { SKINS } from "./learning";

export const CHARACTER_STAGES = [
  { id: "slim", label: "Худой", levels: "1–7" },
  { id: "fit", label: "Подтянутый", levels: "8–19" },
  { id: "jacked", label: "Накачанный", levels: "20+" },
] as const;
export type CharacterStage = typeof CHARACTER_STAGES[number]["id"];

export function characterStageForLevel(level: number): CharacterStage {
  return level >= 20 ? "jacked" : level >= 8 ? "fit" : "slim";
}

export function skinImageForStage(id: string | undefined, stage: CharacterStage): string {
  if (id === "henley") {
    return stage === "fit" ? "/characters/skins/henley.webp" : `/characters/skins/henley-${stage}.webp`;
  }
  const skin = SKINS.find(s => s.id === id && s.id !== "default");
  return skin?.image ?? `/characters/${stage}.webp`;
}
