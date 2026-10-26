import { A, Arrow, Box, F, G, R, S, Svg, V, Wrap, type Draw } from "./kit";

/** Схемы лекции 4 курса Project Management: имена с префиксом «pm4-», в конспекте — «@diagram pm4-…». */
export const diagrams: Record<string, Draw> = {
  "pm4-operating-cycle": (t) => {
    const boxes: [number, number, string, string, string][] = [
      [122, 8, t("I · Планирование", "I · Planning"), t("цикл планирования", "planning cycle"), A],
      [238, 76, t("II · Разрешение", "II · Authorization"), t("запуск работ", "work release"), S],
      [194, 178, t("III · Сбор данных", "III · Cost data"), t("о затратах", "collection"), S],
      [50, 178, t("IV · Анализ", "IV · Analysis"), t("отклонения", "variances"), S],
      [6, 76, t("V · Отчётность", "V · Reporting"), t("клиент, руководство", "customer, mgmt"), S],
    ];
    return (
      <Svg h={254} label={t("Операционный цикл MCCS: фазы II–V вместе с циклом планирования (I) — замкнутая система", "MCCS operating cycle: phases II–V plus the planning cycle (I) form a closed system")}>
        {boxes.map(([x, y, label, sub, c]) => (
          <Box key={label} x={x} y={y} w={116} h={44} label={label} sub={sub} stroke={c} size={10} />
        ))}
        <Arrow x1={238} y1={30} x2={282} y2={74} color={S} />
        <Arrow x1={292} y1={122} x2={264} y2={176} color={S} />
        <Arrow x1={194} y1={200} x2={168} y2={200} color={S} />
        <Arrow x1={92} y1={178} x2={70} y2={122} color={S} />
        <Arrow x1={76} y1={76} x2={120} y2={34} color={A} />
        <text x={180} y={118} textAnchor="middle" fontSize={13} fontWeight={700} fill="currentColor">MCCS</text>
        <text x={180} y={134} textAnchor="middle" fontSize={9.5} fill="currentColor" opacity={0.8}>{t("замкнутая система", "closed system network")}</text>
        <text x={180} y={246} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.75}>{t("янтарный — цикл планирования (I); голубой — операционный цикл (II–V)", "amber — planning cycle (I); blue — operating cycle (II–V)")}</text>
      </Svg>
    );
  },
  "pm4-evm-curves": (t) => {
    const s = (u: number) => 3 * u * u - 2 * u * u * u;
    const X = (k: number) => 30 + k * 30;
    const Y = (v: number) => 196 - 150 * v;
    const curve = (end: number, f: number) =>
      Array.from({ length: end * 2 + 1 }, (_, i) => i / 2).map((k) => `${X(k)},${Y(f * s(k / 10))}`).join(" ");
    const legend: [string, string][] = [
      [V, t("BCWS (PV) — план", "BCWS (PV) — plan")],
      [G, t("BCWP (EV) — освоено", "BCWP (EV) — earned")],
      [R, t("ACWP (AC) — факт", "ACWP (AC) — actual")],
    ];
    return (
      <Svg h={240} label={t("Кривые освоенного объёма: BCWS, BCWP и ACWP на дату статуса, отклонения CV и SV", "Earned value curves: BCWS, BCWP and ACWP at the status date, with CV and SV")}>
        <Arrow x1={30} y1={196} x2={348} y2={196} />
        <Arrow x1={30} y1={196} x2={30} y2={16} />
        <text x={36} y={22} fontSize={9} fill="currentColor" opacity={0.75}>{t("$ или часы", "$ or hours")}</text>
        <text x={346} y={210} textAnchor="end" fontSize={9} fill="currentColor" opacity={0.75}>{t("время", "time")}</text>
        <polyline points={curve(10, 1)} fill="none" stroke={V} strokeWidth={2} />
        <polyline points={curve(5, 1.2)} fill="none" stroke={R} strokeWidth={2} />
        <polyline points={curve(5, 0.8)} fill="none" stroke={G} strokeWidth={2} />
        <circle cx={330} cy={46} r={3} fill={V} />
        <text x={322} y={38} textAnchor="end" fontSize={9.5} fontWeight={700} fill={V}>BAC</text>
        <line x1={180} y1={26} x2={180} y2={196} stroke="currentColor" strokeDasharray="4 3" opacity={0.5} />
        <text x={180} y={20} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.8}>{t("дата статуса", "status date")}</text>
        <g stroke={R} strokeWidth={1.5}>
          <line x1={188} y1={106} x2={188} y2={136} />
          <line x1={184} y1={106} x2={192} y2={106} />
          <line x1={184} y1={136} x2={192} y2={136} />
        </g>
        <g stroke={A} strokeWidth={1.5}>
          <line x1={198} y1={121} x2={198} y2={136} />
          <line x1={194} y1={121} x2={202} y2={121} />
        </g>
        <text x={206} y={154} fontSize={9.5} fontWeight={700} fill={R}>{t("CV < 0 → перерасход", "CV < 0 → over budget")}</text>
        <text x={206} y={168} fontSize={9.5} fontWeight={700} fill={A}>{t("SV < 0 → отставание", "SV < 0 → behind schedule")}</text>
        <text x={206} y={182} fontSize={8.5} fill="currentColor" opacity={0.75}>{t("обе разности считают от BCWP", "both are measured from BCWP")}</text>
        {legend.map(([c, label], i) => (
          <g key={label}>
            <line x1={14 + i * 116} y1={225} x2={30 + i * 116} y2={225} stroke={c} strokeWidth={2.5} />
            <text x={34 + i * 116} y={229} fontSize={9} fill="currentColor">{label}</text>
          </g>
        ))}
      </Svg>
    );
  },
  "pm4-five-stages": (t) => {
    const stages: [string, string, string][] = [
      ["Forming", t("знакомство, правила", "ice-breaking, ground rules"), S],
      ["Storming", t("конфликт, иерархия", "conflict, hierarchy forms"), R],
      ["Norming", t("начало сплочённости", "cohesiveness begins"), A],
      ["Performing", t("зрелость, работа на цель", "mature, goal-focused"), G],
      ["Adjourning", t("роспуск, грусть", "disband, sadness"), V],
    ];
    return (
      <Svg h={220} label={t("Пятиэтапная модель развития группы и модель прерывистого равновесия", "Five-stage model of group development and the punctuated equilibrium model")}>
        <text x={180} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="currentColor">{t("Пятиэтапная модель — цикл созревания", "Five-stage model — a maturity cycle")}</text>
        {stages.map(([name, sign, c], i) => {
          const x = 6 + i * 70;
          return (
            <g key={name}>
              <rect x={x} y={22} width={66} height={30} rx={7} fill={F} stroke={c} strokeWidth={1.5} />
              <text x={x + 33} y={41} textAnchor="middle" fontSize={9.5} fontWeight={700} fill="currentColor">{name}</text>
              <Wrap x={x + 33} y={66} text={sign} max={13} size={8.5} gap={10} />
            </g>
          );
        })}
        <Arrow x1={8} y1={100} x2={352} y2={100} />
        <text x={352} y={112} textAnchor="end" fontSize={8.5} fill="currentColor" opacity={0.7}>{t("время", "time")}</text>
        <text x={180} y={130} textAnchor="middle" fontSize={10} fontWeight={700} fill="currentColor">{t("Модель прерывистого равновесия (PEM) — 3 фазы", "Punctuated equilibrium model (PEM) — 3 phases")}</text>
        <Box x={6} y={138} w={134} h={40} label={t("1 · План", "1 · Plan")} sub={t("задачи, цели, пути", "tasks, goals, ways")} stroke={S} size={11} />
        <Box x={146} y={138} w={68} h={40} label="2" sub={t("равновесие", "equilibrium")} stroke={A} size={11} />
        <Box x={220} y={138} w={134} h={40} label={t("3 · Действие", "3 · Action")} sub={t("выполнить задачи", "accomplish tasks")} stroke={G} size={11} />
        <text x={180} y={196} textAnchor="middle" fontSize={9} fontWeight={600} fill={A}>{t("точка равновесия: группа понимает, что время уходит", "equilibrium point: the group realizes time is running out")}</text>
        <text x={180} y={211} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.75}>{t("критика пятиэтапной модели: «слишком статична и нереалистична»", "critics: the five-stage model is \"too static and unrealistic\"")}</text>
      </Svg>
    );
  },
};
