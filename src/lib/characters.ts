export type BodyId = "slim" | "esthete" | "jacked";

export interface Skin {
  id: string;
  label: string;
  src: string;
}

export interface BodyDef {
  id: BodyId;
  label: string;
  minLevel: number;
  /** первый скин — базовый (без одежды) */
  skins: Skin[];
}

const C = "/characters";

export const BODIES: BodyDef[] = [
  {
    id: "slim",
    label: "Слимбой",
    minLevel: 1,
    skins: [
      { id: "base", label: "Базовый", src: `${C}/slim-base.png` },
      { id: "slim", label: "Слим", src: `${C}/slim-slim.png` },
      { id: "oversize", label: "Оверсайз", src: `${C}/slim-oversize.png` },
      { id: "fashion", label: "Модный", src: `${C}/slim-fashion.png` },
    ],
  },
  {
    id: "esthete",
    label: "Эстет",
    minLevel: 20,
    skins: [
      { id: "base", label: "Базовый", src: `${C}/esthete-base.png` },
      { id: "classic", label: "Классика", src: `${C}/esthete-classic.png` },
      { id: "sport", label: "Спорт", src: `${C}/esthete-sport.png` },
      { id: "sport2", label: "Спорт 2", src: `${C}/esthete-sport2.png` },
    ],
  },
  {
    id: "jacked",
    label: "Качок",
    minLevel: 50,
    skins: [
      { id: "base", label: "Базовый", src: `${C}/jacked-base.png` },
      { id: "tshirt", label: "Футболка", src: `${C}/jacked-tshirt.png` },
      { id: "oversize", label: "Оверсайз", src: `${C}/jacked-oversize.png` },
      { id: "shirt", label: "Рубашка", src: `${C}/jacked-shirt.png` },
      { id: "suit", label: "Костюм", src: `${C}/jacked-suit.png` },
      { id: "fashion", label: "Модный", src: `${C}/jacked-fashion.png` },
    ],
  },
];

export const BODY_MAP = Object.fromEntries(
  BODIES.map((b) => [b.id, b]),
) as Record<BodyId, BodyDef>;

export function bodyForLevel(level: number): BodyId {
  if (level >= 50) return "jacked";
  if (level >= 20) return "esthete";
  return "slim";
}

export function skinSrc(body: BodyId, skinId: string): string {
  const b = BODY_MAP[body];
  const s = b.skins.find((x) => x.id === skinId) ?? b.skins[0];
  return s.src;
}
