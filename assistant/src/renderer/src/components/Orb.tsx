import { memo } from "react";
import type { DidiState } from "../didi";

/** Три кольца с разной задержкой — эффект расходящихся колец без ручного спавна DOM-узлов. */
const RINGS = [0, 1, 2];

function Orb({ state }: { state: DidiState }) {
  return (
    <div className={`orb-stage orb-${state}`}>
      <div className="orb-glow" />
      {RINGS.map((i) => (
        <div key={i} className="orb-ring" style={{ animationDelay: `${i * 0.55}s` }} />
      ))}
      <div className="orb-core">
        <div className="orb-sweep" />
      </div>
    </div>
  );
}

export default memo(Orb);
