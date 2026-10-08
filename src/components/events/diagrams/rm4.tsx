import { A, Arrow, B, Box, F, G, R, S, Svg, V, Wrap, type Draw } from "./kit";

/** Схемы лекции «rm4»: имена с префиксом «rm4-», в конспекте — «@diagram rm4-…». */
export const diagrams: Record<string, Draw> = {
  /* Сбалансированная поисковая строка: блок на понятие, OR внутри, AND между. */
  "rm4-search-blocks": (t) => {
    const blocks: [string, string, string][] = [
      [t("технология", "technology"), '("drowsiness detection" OR "fatigue detection")', S],
      [t("кто", "population"), '("truck drivers" OR "long-haul drivers")', A],
      [t("исход", "outcome"), '(accident* OR "near-miss")', G],
    ];
    return (
      <Svg h={214} label={t("Сбалансированная поисковая строка: OR внутри блока, AND между блоками", "A balanced search string: OR inside a block, AND between blocks")}>
        <text x={180} y={14} textAnchor="middle" fontSize={9.5} fontWeight={600} fill="currentColor">{t("OR внутри блока — шире · AND между блоками — уже", "OR inside a block widens · AND between blocks narrows")}</text>
        {blocks.map(([name, terms, color], i) => (
          <g key={name}>
            <rect x={6} y={26 + i * 62} width={238} height={40} rx={8} fill={F} stroke={color} strokeWidth={1.5} />
            <text x={14} y={40 + i * 62} fontSize={9} fontWeight={700} fill={color}>{t("блок ", "block ")}{i + 1} · {name}</text>
            <text x={14} y={57 + i * 62} fontSize={8.3} fill="currentColor">{terms}</text>
            {i < 2 && <text x={125} y={81 + i * 62} textAnchor="middle" fontSize={11} fontWeight={700} fill={V}>AND</text>}
          </g>
        ))}
        <circle cx={288} cy={88} r={34} fill={S} opacity={0.18} stroke={S} />
        <circle cx={324} cy={88} r={34} fill={A} opacity={0.18} stroke={A} />
        <circle cx={306} cy={118} r={34} fill={G} opacity={0.18} stroke={G} />
        <circle cx={306} cy={99} r={7} fill={V} opacity={0.85} />
        <text x={270} y={66} textAnchor="middle" fontSize={9} fontWeight={700} fill={S}>1</text>
        <text x={342} y={66} textAnchor="middle" fontSize={9} fontWeight={700} fill={A}>2</text>
        <text x={306} y={146} textAnchor="middle" fontSize={9} fontWeight={700} fill={G}>3</text>
        <Wrap x={306} y={166} text={t("результаты = где пересекаются все три блока", "results = where all three blocks overlap")} max={22} size={8.5} />
        <text x={180} y={208} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.75}>{t("одно понятие на блок · фразы в кавычках · все скобки закрыты", "one concept per block · phrases in quotes · every bracket closed")}</text>
      </Svg>
    );
  },

  /* Пересказ по статьям против синтеза по темам: строка матрицы vs столбец. */
  "rm4-synthesis": (t) => {
    const cols = [t("результат", "finding"), t("метод", "method"), t("огранич.", "limit")];
    const rows: [string, string, string, string][] = [
      ["A", t("↓ риск", "↓ risk"), "RCT", t("коротко", "short")],
      ["B", t("↓ риск", "↓ risk"), t("наблюд.", "observ."), t("без рандом.", "not random.")],
      ["C", t("выключают", "alerts off"), t("интервью", "interviews"), "n = 18"],
      ["D", t("симул.: да", "sim.: works"), t("обзор", "review"), t("легковые", "cars only")],
    ];
    return (
      <Svg h={204} label={t("Пересказ по статьям и синтез по темам", "Summary by study versus synthesis by theme")}>
        <text x={78} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={R}>{t("Пересказ: по статьям", "Summary: study by study")}</text>
        {["A", "B", "C", "D"].map((s, i) => (
          <Box key={s} x={8} y={28 + i * 32} w={140} h={26} label={t(`Работа ${s} нашла…`, `Study ${s} found…`)} stroke={R} size={10} />
        ))}
        <Wrap x={78} y={168} text={t("каждая статья — отдельный остров, связей нет", "each study is an island, nothing is connected")} max={26} size={8.5} />
        <text x={268} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={G}>{t("Синтез: по темам", "Synthesis: theme by theme")}</text>
        {cols.map((c, j) => (
          <text key={c} x={221 + j * 52} y={34} textAnchor="middle" fontSize={8.5} fontWeight={700} fill="currentColor">{c}</text>
        ))}
        {rows.map(([s, ...cells], r) => (
          <g key={s}>
            <text x={184} y={57 + r * 28} textAnchor="middle" fontSize={10} fontWeight={700} fill="currentColor">{s}</text>
            {cells.map((c, j) => (
              <g key={j}>
                <rect x={196 + j * 52} y={41 + r * 28} width={50} height={24} rx={4} fill={F} stroke={j === 2 ? G : B} strokeWidth={j === 2 ? 1.5 : 1} />
                <text x={221 + j * 52} y={56 + r * 28} textAnchor="middle" fontSize={7.5} fill="currentColor">{c}</text>
              </g>
            ))}
          </g>
        ))}
        <rect x={297} y={37} width={52} height={120} rx={6} fill="none" stroke={G} strokeWidth={1.5} strokeDasharray="4 3" />
        <Arrow x1={323} y1={158} x2={323} y2={172} color={G} />
        <Wrap x={268} y={184} text={t("столбец → абзац: «у всех четырёх общее ограничение…»", "column → paragraph: \"all four share a limitation…\"")} max={36} size={8.5} />
      </Svg>
    );
  },

  /* Цепочка согласованности плана исследования и пример разрыва. */
  "rm4-alignment": (t) => {
    const top: [string, string][] = [
      ["Problem", t("усталость за рулём", "driver fatigue")],
      ["Aim", t("оценить сигналы", "evaluate alerts")],
      ["RQ", t("меньше near-miss?", "fewer near-misses?")],
    ];
    const bottom: [string, string][] = [
      ["Evidence", t("число near-miss", "near-miss counts")],
      ["Method", t("до / после", "before / after")],
      ["Analysis", t("сравнить средние", "compare means")],
    ];
    return (
      <Svg h={172} label={t("Проверка согласованности плана исследования", "The alignment check of a research plan")}>
        {top.map(([l, sub], i) => <Box key={l} x={8 + i * 122} y={14} w={100} h={38} label={l} sub={sub} stroke={G} size={11} />)}
        <Arrow x1={108} y1={33} x2={130} y2={33} color={G} />
        <Arrow x1={230} y1={33} x2={252} y2={33} color={G} />
        <path d="M 302 52 L 302 64 L 58 64 L 58 70" fill="none" stroke={G} strokeWidth={1.5} />
        <Arrow x1={58} y1={68} x2={58} y2={78} color={G} />
        {bottom.map(([l, sub], i) => <Box key={l} x={8 + i * 122} y={78} w={100} h={38} label={l} sub={sub} stroke={G} size={11} />)}
        <Arrow x1={108} y1={97} x2={130} y2={97} color={G} />
        <Arrow x1={230} y1={97} x2={252} y2={97} color={G} />
        <text x={180} y={136} textAnchor="middle" fontSize={9} fill="currentColor">{t("на каждой связи: следует ли шаг из предыдущего?", "at every link: does this step follow from the previous one?")}</text>
        <text x={180} y={154} textAnchor="middle" fontSize={9} fontWeight={600} fill={R}>{t("разрыв: RQ «почему?» + метод «посчитать аварии»", "break: a \"why?\" RQ + a \"count accidents\" method")}</text>
        <text x={180} y={167} textAnchor="middle" fontSize={8} fill="currentColor" opacity={0.7}>{t("вопрос о причинах требует интервью, а не подсчёта", "a question about reasons needs interviews, not counts")}</text>
      </Svg>
    );
  },
};
