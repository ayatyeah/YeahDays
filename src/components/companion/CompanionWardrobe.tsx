"use client";
import Image from "next/image";
import { OUTFITS, useCompanionStore } from "@/store/useCompanionStore";
export default function CompanionWardrobe() {
  const outfit = useCompanionStore((s) => s.outfit);
  const setOutfit = useCompanionStore((s) => s.setOutfit);
  const selected = OUTFITS.find((o) => o.id === outfit) ?? OUTFITS[0];
  return (
    <section
      className="companion-wardrobe"
      aria-label="Образ твоего компаньона"
    >
      <div className="companion-stage">
        <span className="companion-scribble">
          Развитие —<br />
          тоже стиль жизни
        </span>
        <Image
          key={selected.id}
          src={selected.image}
          width={340}
          height={400}
          alt={`Маскот: ${selected.label}`}
          priority
        />
        <em>
          Версия лучше,
          <br />
          чем вчера
        </em>
        <div className="companion-stage-shadow" />
      </div>
      <div className="companion-energy-label">
        <h2>Твой стиль</h2>
        <span>Выбери образ</span>
      </div>
      <div className="companion-outfits">
        {OUTFITS.map((o) => (
          <button
            key={o.id}
            onClick={() => setOutfit(o.id)}
            aria-pressed={o.id === selected.id}
          >
            <span>
              <Image src={o.preview} width={100} height={150} alt="" />
            </span>
            <small>{o.label}</small>
          </button>
        ))}
      </div>
    </section>
  );
}
