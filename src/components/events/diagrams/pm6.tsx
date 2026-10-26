import { A, Arrow, B, Box, F, G, R, S, Svg, V, type Draw } from "./kit";

/** Подпись в одну-две строки: строки разделены «|». */
function Lines({ x, y, text, size = 10, weight = 400, opacity = 1 }: { x: number; y: number; text: string; size?: number; weight?: number; opacity?: number }) {
  const lines = text.split("|");
  const top = y - ((lines.length - 1) * (size + 2)) / 2;
  return (
    <>
      {lines.map((l, i) => (
        <text key={i} x={x} y={top + i * (size + 2)} textAnchor="middle" fontSize={size} fontWeight={weight} fill="currentColor" opacity={opacity}>{l}</text>
      ))}
    </>
  );
}

/** Схемы лекции 6 курса Project Management: имена с префиксом «pm6-», в конспекте — «@diagram pm6-…». */
export const diagrams: Record<string, Draw> = {
  "pm6-inverted-triangle": (t) => (
    <Svg h={214} label={t("Традиционный и agile треугольник ограничений: что фиксировано, а что меняется", "Traditional vs agile triangle of constraints: what is fixed and what varies")}>
      <text x={90} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">{t("Традиционный", "Traditional")}</text>
      <text x={270} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">Agile</text>
      <text x={90} y={27} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.7}>{t("треугольник ограничений", "triangle of constraints")}</text>
      <text x={270} y={27} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.7}>{t("перевёрнутый треугольник", "inverted triangle")}</text>
      <polygon points="90,54 32,158 148,158" fill={G} fillOpacity={0.45} stroke={G} strokeWidth={1.5} />
      <polygon points="212,54 328,54 270,158" fill={G} fillOpacity={0.2} stroke={G} strokeWidth={1.5} />
      <text x={90} y={47} textAnchor="middle" fontSize={11} fontWeight={700} fill={S}>{t("Объём", "Scope")}</text>
      <text x={30} y={174} textAnchor="middle" fontSize={11} fontWeight={700} fill={A}>{t("Сроки", "Time")}</text>
      <text x={150} y={174} textAnchor="middle" fontSize={11} fontWeight={700} fill={A}>{t("Стоимость", "Cost")}</text>
      <text x={212} y={47} textAnchor="middle" fontSize={11} fontWeight={700} fill={S}>{t("Стоимость", "Cost")}</text>
      <text x={328} y={47} textAnchor="middle" fontSize={11} fontWeight={700} fill={S}>{t("Сроки", "Time")}</text>
      <text x={270} y={174} textAnchor="middle" fontSize={11} fontWeight={700} fill={A}>{t("Объём", "Scope")}</text>
      <Arrow x1={150} y1={58} x2={112} y2={58} color={S} />
      <Arrow x1={150} y1={58} x2={190} y2={58} color={S} />
      <text x={150} y={72} textAnchor="middle" fontSize={9.5} fontWeight={600} fill={S}>{t("фиксировано", "fixed")}</text>
      <Arrow x1={210} y1={150} x2={166} y2={150} color={A} />
      <Arrow x1={210} y1={150} x2={252} y2={150} color={A} />
      <text x={210} y={142} textAnchor="middle" fontSize={9.5} fontWeight={600} fill={A}>{t("меняется", "variable")}</text>
      <text x={90} y={124} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.85}>{t("план", "the plan")}</text>
      <text x={90} y={136} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.85}>{t("фиксирует объём", "fixes scope")}</text>
      <text x={270} y={82} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.85}>{t("команда и дата", "team and date")}</text>
      <text x={270} y={94} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.85}>{t("фиксированы", "are fixed")}</text>
      <text x={180} y={196} textAnchor="middle" fontSize={9.5} fill="currentColor">{t("agile: стоимость и сроки фиксированы —", "agile: cost and time are fixed —")}</text>
      <text x={180} y={208} textAnchor="middle" fontSize={9.5} fill="currentColor">{t("объём меняется по приоритету", "scope varies by priority")}</text>
    </Svg>
  ),
  "pm6-manifesto-values": (t) => {
    const rows: [string, string][] = [
      [t("Люди и|взаимодействие", "Individuals and|interactions"), t("Процессы и|инструменты", "Processes and|tools")],
      [t("Работающий софт", "Working software"), t("Исчерпывающая|документация", "Comprehensive|documentation")],
      [t("Сотрудничество|с заказчиком", "Customer|collaboration"), t("Согласование|контракта", "Contract|negotiation")],
      [t("Реагирование|на изменения", "Responding|to change"), t("Следование плану", "Following a plan")],
    ];
    return (
      <Svg h={238} label={t("Четыре ценности Agile Manifesto: левое ценится больше правого", "Four values of the Agile Manifesto: the left is valued more than the right")}>
        <text x={81} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={V}>{t("ценим больше", "valued more")}</text>
        <text x={279} y={16} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.7}>{t("тоже ценно", "still has value")}</text>
        {rows.map(([left, right], i) => {
          const y = 26 + i * 44;
          return (
            <g key={i}>
              <rect x={8} y={y} width={146} height={36} rx={8} fill={V} fillOpacity={0.16} stroke={V} strokeWidth={1.5} />
              <Lines x={81} y={y + 22} text={left} size={10.5} weight={700} />
              <text x={180} y={y + 22} textAnchor="middle" fontSize={10} fontWeight={600} fill="currentColor">{t("важнее", "over")}</text>
              <rect x={206} y={y} width={146} height={36} rx={8} fill={F} stroke={B} strokeWidth={1.5} />
              <Lines x={279} y={y + 22} text={right} size={10} opacity={0.75} />
            </g>
          );
        })}
        <text x={180} y={214} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.8}>{t("«Хотя то, что справа, тоже ценно,", "“While there is value in the items on the right,")}</text>
        <text x={180} y={226} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.8}>{t("мы больше ценим то, что слева»", "we value the items on the left more.”")}</text>
      </Svg>
    );
  },
  "pm6-servant-leader": (t) => (
    <Svg h={236} label={t("Четыре главные обязанности лидера-слуги вокруг команды", "Four primary duties of a servant leader around the team")}>
      <circle cx={180} cy={110} r={34} fill={G} fillOpacity={0.2} stroke={G} strokeWidth={1.5} />
      <text x={180} y={114} textAnchor="middle" fontSize={12} fontWeight={700} fill="currentColor">{t("Команда", "Team")}</text>
      <Box x={95} y={6} w={170} h={40} label={t("1 · Оградить команду", "1 · Shield the team")} sub={t("от отвлечений", "from interruptions")} stroke={S} size={11} />
      <Box x={246} y={88} w={108} h={44} label={t("2 · Убирать", "2 · Remove")} sub={t("препятствия", "impediments")} stroke={R} size={11} />
      <Box x={95} y={172} w={170} h={40} label={t("3 · Доносить видение", "3 · Communicate")} sub={t("(снова и снова)", "(and re-communicate) vision")} stroke={V} size={11} />
      <Box x={6} y={88} w={108} h={44} label={t("4 · «Еда и вода»", "4 · Carry food")} sub={t("ресурсы команде", "and water")} stroke={A} size={11} />
      <Arrow x1={180} y1={46} x2={180} y2={74} color={S} />
      <Arrow x1={246} y1={110} x2={216} y2={110} color={R} />
      <Arrow x1={180} y1={172} x2={180} y2={146} color={V} />
      <Arrow x1={114} y1={110} x2={144} y2={110} color={A} />
      <text x={180} y={228} textAnchor="middle" fontSize={9.5} fill="currentColor" opacity={0.8}>{t("лидер-слуга сначала служит команде, а не управляет ею", "the servant leader serves the team first instead of directing it")}</text>
    </Svg>
  ),
};
