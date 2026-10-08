import { A, Arrow, B, Box, F, G, R, S, Svg, V, Wrap, type Draw } from "./kit";

/** Схемы лекции «rm1»: имена с префиксом «rm1-», в конспекте — «@diagram rm1-…». */
export const diagrams: Record<string, Draw> = {
  /** Разработка даёт артефакт, исследование — знание; прототип становится инструментом исследования. */
  "rm1-research-vs-dev": (t) => (
    <Svg h={212} label={t("Разработка и исследование дают разные результаты", "Development and research produce different outputs")}>
      <text x={8} y={14} fontSize={11} fontWeight={700} fill={S}>{t("Разработка — создаёт артефакт", "Development — builds an artifact")}</text>
      <Box x={8} y={22} w={100} h={38} label={t("Требования", "Requirements")} size={11} />
      <Arrow x1={108} y1={41} x2={128} y2={41} />
      <Box x={130} y={22} w={100} h={38} label={t("Дизайн и код", "Design + code")} size={11} />
      <Arrow x1={230} y1={41} x2={250} y2={41} />
      <Box x={252} y={22} w={100} h={38} label={t("Прототип", "Prototype")} stroke={S} size={11} />
      <text x={302} y={74} textAnchor="middle" fontSize={9} fontWeight={600} fill={S}>development output</text>
      <Arrow x1={290} y1={80} x2={236} y2={110} color={A} dashed />
      <text x={8} y={102} fontSize={11} fontWeight={700} fill={G}>{t("Исследование — отвечает на вопрос", "Research — answers a question")}</text>
      {[t("Вопрос", "Question"), t("Метод", "Method"), t("Данные", "Data"), t("Выводы", "Findings")].map((label, i) => (
        <g key={i}>
          <Box x={8 + i * 90} y={112} w={74} h={36} label={label} stroke={i === 3 ? G : B} size={11} />
          {i < 3 && <Arrow x1={82 + i * 90} y1={130} x2={96 + i * 90} y2={130} />}
        </g>
      ))}
      <text x={315} y={162} textAnchor="middle" fontSize={9} fontWeight={600} fill={G}>research output</text>
      <Wrap x={180} y={180} text={t("SafeDrive: само приложение — development output; сравнение водителей с оповещениями и без — research output", "SafeDrive: the app itself is a development output; comparing drivers with and without alerts is a research output")} max={64} size={9.5} gap={12} />
    </Svg>
  ),

  /** Как из уверенного утверждения сделать проверяемую гипотезу. */
  "rm1-claim-to-hypothesis": (t) => {
    const steps: [string, string][] = [
      ["−", t("убрать уверенность: «точно» → «ожидается»", "remove certainty: \"definitely\" → \"expected\"")],
      ["+", t("группа: начинающие водители", "population: novice drivers")],
      ["+", t("сравнение: с оповещениями и без", "comparison: with vs without alerts")],
      ["+", t("показатель и срок: превышения на 100 км, 8 недель", "outcome + time: speeding events / 100 km, 8 weeks")],
    ];
    return (
      <Svg h={236} label={t("Как превратить утверждение в проверяемую гипотезу", "Turning a claim into a testable hypothesis")}>
        <rect x={8} y={8} width={344} height={36} rx={8} fill={F} stroke={R} strokeWidth={1.5} />
        <text x={180} y={24} textAnchor="middle" fontSize={11} fontWeight={600} fill="currentColor">{t("«Приложение точно снизит число аварий»", "\"The app will definitely reduce accidents\"")}</text>
        <text x={180} y={38} textAnchor="middle" fontSize={9} fill={R}>{t("утверждение без доказательств (claim)", "unsupported claim")}</text>
        <Arrow x1={24} y1={46} x2={24} y2={164} />
        {steps.map(([sign, text], i) => (
          <g key={i}>
            <circle cx={24} cy={62 + i * 26} r={9} fill={F} stroke={sign === "+" ? G : R} strokeWidth={1.5} />
            <text x={24} y={66 + i * 26} textAnchor="middle" fontSize={12} fontWeight={700} fill={sign === "+" ? G : R}>{sign}</text>
            <text x={42} y={66 + i * 26} fontSize={9.5} fill="currentColor">{text}</text>
          </g>
        ))}
        <rect x={8} y={166} width={344} height={64} rx={8} fill={F} stroke={G} strokeWidth={1.5} />
        <text x={180} y={180} textAnchor="middle" fontSize={9} fontWeight={700} fill={G}>{t("проверяемая гипотеза", "testable hypothesis")}</text>
        <Wrap x={180} y={194} text={t("У начинающих водителей с оповещениями за 8 недель будет меньше превышений на 100 км, чем у водителей без оповещений", "Novice drivers with alerts will record fewer speeding events per 100 km than drivers without alerts over 8 weeks")} max={60} size={9.5} opacity={1} gap={12} />
      </Svg>
    );
  },

  /** Воронка сужения: область → тема → проблема → вопрос, с примером SafeDrive. */
  "rm1-funnel": (t) => {
    const levels: [string, string, string][] = [
      [t("Область", "Area"), t("Технологии безопасности на дорогах", "Road-safety technology"), S],
      [t("Тема", "Topic"), t("Приложения с обратной связью для водителей", "Driver-feedback mobile apps"), V],
      [t("Проблема", "Problem"), t("Новички превышают скорость; эффект оповещений неизвестен", "Novice drivers speed; the effect of real-time alerts is unknown"), A],
      [t("Вопрос", "Question"), t("Снижают ли оповещения SafeDrive число превышений на 100 км у новичков за 8 недель?", "Do SafeDrive alerts cut speeding events per 100 km among novice drivers over 8 weeks?"), G],
    ];
    const cx = 98;
    return (
      <Svg h={218} label={t("Сужение: от области к исследовательскому вопросу", "Narrowing: from an area to a research question")}>
        {levels.map(([name, example, color], i) => {
          const y = 8 + i * 48;
          const top = 90 - i * 18;
          const bottom = 90 - (i + 1) * 18;
          const lines = Math.ceil(example.length / 30);
          return (
            <g key={i}>
              <polygon points={`${cx - top},${y} ${cx + top},${y} ${cx + bottom},${y + 42} ${cx - bottom},${y + 42}`} fill={color} fillOpacity={0.22} stroke={color} strokeWidth={1.5} />
              <text x={cx} y={y + 25} textAnchor="middle" fontSize={10.5} fontWeight={700} fill="currentColor">{name}</text>
              <line x1={cx + top - 6} y1={y + 21} x2={196} y2={y + 21} stroke={color} strokeDasharray="3 3" />
              <Wrap x={276} y={y + 24 - (lines - 1) * 5.5} text={example} max={32} size={9} opacity={0.9} />
            </g>
          );
        })}
        <text x={180} y={210} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.75}>{t("каждый шаг — уже, конкретнее и ближе к измерению", "each step: narrower, more concrete, closer to a measurement")}</text>
      </Svg>
    );
  },
};
