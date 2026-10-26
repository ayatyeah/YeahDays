import { A, Arrow, B, Box, F, G, S, Svg, V, Wrap, type Draw } from "./kit";

/** Схемы лекции 7 курса Project Management: имена с префиксом «pm7-», в конспекте — «@diagram pm7-…». */
export const diagrams: Record<string, Draw> = {
  "pm7-pillars-values": (t) => (
    <Svg h={226} label={t("Три столпа Scrum стоят на пяти ценностях", "Three Scrum pillars stand on five values")}>
      <polygon points="14,62 180,8 346,62" fill={F} stroke={V} strokeWidth={1.5} />
      <text x={180} y={44} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">{t("Столпы эмпиризма", "Pillars of empiricism")}</text>
      <rect x={14} y={62} width={332} height={8} rx={2} fill={F} stroke={V} strokeWidth={1.2} />
      {[
        ["Transparency", t("работа видна всем", "work visible to all"), S],
        ["Inspection", t("частые проверки: 5 событий", "frequent checks: 5 events"), A],
        ["Adaptation", t("исправить как можно скорее", "adjust as soon as possible"), G],
      ].map(([name, sub, c], i) => (
        <g key={name}>
          <rect x={25 + i * 110} y={74} width={90} height={78} rx={6} fill={F} stroke={c} strokeWidth={1.5} />
          <text x={70 + i * 110} y={94} textAnchor="middle" fontSize={10} fontWeight={700} fill="currentColor">{name}</text>
          <Wrap x={70 + i * 110} y={112} text={sub} max={16} size={8.5} gap={10} />
        </g>
      ))}
      <Arrow x1={116} y1={140} x2={134} y2={140} color={A} />
      <Arrow x1={226} y1={140} x2={244} y2={140} color={G} />
      <text x={180} y={166} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.75}>{t("→ «делает возможной» (enables)", "→ \"enables\"")}</text>
      <rect x={8} y={172} width={344} height={30} rx={6} fill={F} stroke={B} strokeWidth={1.5} />
      <text x={180} y={185} textAnchor="middle" fontSize={8.5} fontWeight={700} fill={V}>{t("опираются на ценности:", "supported by the values:")}</text>
      <text x={180} y={197} textAnchor="middle" fontSize={9} fill="currentColor">Commitment · Focus · Openness · Respect · Courage</text>
      <text x={180} y={218} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.8}>{t("ценности прожиты → столпы оживают → доверие", "values lived → pillars come to life → trust")}</text>
    </Svg>
  ),
  "pm7-scrum-flow": (t) => (
    <Svg h={248} label={t("Поток Scrum: бэклог, события спринта и таймбоксы", "Scrum flow: backlog, Sprint events and timeboxes")}>
      <rect x={116} y={4} width={240} height={190} rx={12} fill="none" stroke={V} strokeDasharray="6 4" strokeWidth={1.5} />
      <text x={126} y={18} fontSize={10} fontWeight={700} fill={V}>{t("Sprint — контейнер, ≤ 1 месяца", "Sprint — the container, ≤ 1 month")}</text>
      <Box x={4} y={26} w={100} h={42} label="Product Backlog" sub="Product Goal" size={10} />
      <Wrap x={56} y={150} text={t("уточнение — непрерывно, это не событие", "refinement — ongoing, not an event")} max={20} size={8.5} gap={10} />
      <Box x={126} y={26} w={104} h={42} label="Sprint Planning" sub={t("≤ 8 ч", "≤ 8 h")} stroke={S} size={10} />
      <Box x={244} y={26} w={104} h={42} label="Sprint Backlog" sub="why · what · how" size={10} />
      <Box x={244} y={84} w={104} h={42} label="Daily Scrum" sub={t("15 мин, ежедневно", "15 min, every day")} stroke={A} size={10} />
      <Box x={244} y={142} w={104} h={42} label="Increment" sub={t("отвечает DoD", "meets the DoD")} stroke={G} size={10} />
      <Box x={126} y={142} w={104} h={42} label="Sprint Review" sub={t("≤ 4 ч", "≤ 4 h")} stroke={S} size={10} />
      <Box x={126} y={84} w={104} h={42} label="Retrospective" sub={t("≤ 3 ч", "≤ 3 h")} stroke={S} size={10} />
      <Arrow x1={104} y1={47} x2={126} y2={47} />
      <Arrow x1={230} y1={47} x2={244} y2={47} />
      <Arrow x1={296} y1={68} x2={296} y2={84} />
      <Arrow x1={296} y1={126} x2={296} y2={142} />
      <Arrow x1={244} y1={163} x2={230} y2={163} />
      <Arrow x1={178} y1={142} x2={178} y2={126} />
      <Arrow x1={178} y1={84} x2={178} y2={68} color={V} dashed />
      <path d="M348 96 q14 9 0 18" fill="none" stroke={A} strokeWidth={1.5} />
      <Arrow x1={126} y1={150} x2={70} y2={70} color={B} dashed />
      <text x={46} y={112} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.75}>{t("PB меняется", "PB adjusted")}</text>
      <text x={180} y={210} textAnchor="middle" fontSize={9} fill="currentColor">{t("Review — предпоследнее, Retrospective завершает спринт", "Review is second to last; the Retrospective concludes the Sprint")}</text>
      <text x={180} y={224} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.75}>{t("таймбоксы — для месячного спринта", "timeboxes are for a one-month Sprint")}</text>
      <text x={180} y={239} textAnchor="middle" fontSize={9} fill={V}>{t("пунктир: следующий спринт начинается сразу", "dashed: the next Sprint starts immediately")}</text>
    </Svg>
  ),
  "pm7-artifact-commitments": (t) => (
    <Svg h={222} label={t("Три артефакта Scrum и их обязательства", "Three Scrum artifacts and their commitments")}>
      <text x={80} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="currentColor">{t("Артефакт", "Artifact")}</text>
      <text x={280} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="currentColor">{t("Обязательство", "Commitment")}</text>
      {[
        ["Product Backlog", t("упорядоченный, растущий", "emergent, ordered"), "Product Goal", t("долгосрочная цель", "long-term objective"), V],
        ["Sprint Backlog", "why · what · how", "Sprint Goal", t("одна цель спринта", "single Sprint objective"), S],
        ["Increment", t("шаг к Product Goal", "stepping stone"), "Definition of Done", t("мерки качества", "quality measures"), G],
      ].map(([art, artSub, com, comSub, c], i) => (
        <g key={art}>
          <Box x={10} y={26 + i * 60} w={140} h={44} label={art} sub={artSub} size={11} />
          <Box x={210} y={26 + i * 60} w={140} h={44} label={com} sub={comSub} stroke={c} size={11} />
          <Arrow x1={152} y1={48 + i * 60} x2={208} y2={48 + i * 60} color={c} />
          {i < 2 && <Arrow x1={80} y1={70 + i * 60} x2={80} y2={86 + i * 60} />}
        </g>
      ))}
      <text x={180} y={202} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.8}>{t("обязательства дают прозрачность и фокус, по ним меряют прогресс", "commitments give transparency and focus to measure progress")}</text>
      <text x={180} y={216} textAnchor="middle" fontSize={8.5} fill={V}>{t("не готово по DoD → назад в Product Backlog", "not Done → back to the Product Backlog")}</text>
    </Svg>
  ),
};
