import { A, Arrow, B, Box, G, R, S, Svg, V, Wrap, type Draw } from "./kit";

/** Схемы лекции «rm2»: имена с префиксом «rm2-», в конспекте — «@diagram rm2-…». */
export const diagrams: Record<string, Draw> = {
  /** Постановка проблемы из трёх частей и то, что в неё не входит. */
  "rm2-problem-statement": (t) => (
    <Svg h={150} label={t("Постановка проблемы из трёх частей", "Three-part problem statement")}>
      <Box x={4} y={8} w={108} h={42} label={t("1 Ситуация", "1 Situation")} sub={t("что происходит", "what is happening")} stroke={S} />
      <Arrow x1={112} y1={29} x2={126} y2={29} />
      <Box x={126} y={8} w={108} h={42} label={t("2 Ограничение", "2 Limitation")} sub={t("со ссылками", "cited literature")} stroke={A} />
      <Arrow x1={234} y1={29} x2={248} y2={29} />
      <Box x={248} y={8} w={108} h={42} label={t("3 Потребность", "3 Need")} sub={t("это исследование", "for this study")} stroke={G} />
      <Wrap x={58} y={66} text={t("кого касается; факты, без обещаний", "who is affected; facts, no promises")} max={20} />
      <Wrap x={180} y={66} text={t("чего прежние работы не выяснили", "what earlier studies have not settled")} max={20} />
      <Wrap x={302} y={66} text={t("«поэтому это исследование изучает…»", "“Therefore, this study investigates…”")} max={20} />
      <line x1={10} y1={104} x2={350} y2={104} stroke={B} strokeDasharray="4 3" />
      <text x={180} y={122} textAnchor="middle" fontSize={10} fontWeight={600} fill={R}>✗ “The app will definitely reduce accidents”</text>
      <text x={180} y={138} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.75}>{t("не часть проблемы и не гипотеза — необоснованное утверждение", "not part of a problem, not a hypothesis — an unsupported claim")}</text>
    </Svg>
  ),

  /** Воронка отсева: от 30 найденных статей к полному чтению немногих. */
  "rm2-screening-funnel": (t) => {
    const steps: [string, string][] = [
      [t("1 Название", "1 Title"), t("связано с проблемой?", "related to my problem?")],
      [t("2 Аннотация", "2 Abstract"), t("что, как, что нашли?", "what, how, what found?")],
      [t("3 Ключевые слова", "3 Keywords"), t("совпадают с понятиями?", "match my concepts?")],
      [t("4 Заключение", "4 Conclusion"), t("вывод? пробелы?", "take-away? gaps?")],
      [t("5 Полное чтение", "5 Full read"), t("только если 1–4 — да", "only if 1–4 say yes")],
    ];
    const cx = 118;
    const w = [220, 196, 172, 148, 124, 100];
    return (
      <Svg h={210} label={t("Воронка отсева статей", "Paper screening funnel")}>
        <text x={cx} y={14} textAnchor="middle" fontSize={10} fontWeight={600} fill="currentColor">{t("найдено 30 статей", "30 papers found")}</text>
        {steps.map(([name, ask], i) => {
          const y = 22 + i * 34;
          const a = w[i] / 2;
          const b = w[i + 1] / 2;
          return (
            <g key={i}>
              <polygon points={`${cx - a},${y} ${cx + a},${y} ${cx + b},${y + 30} ${cx - b},${y + 30}`} fill={S} fillOpacity={0.1 + i * 0.07} stroke={S} strokeWidth={1.2} />
              <text x={cx} y={y + 19} textAnchor="middle" fontSize={10} fontWeight={600} fill="currentColor">{name}</text>
              <text x={236} y={y + 19} fontSize={9} fill="currentColor" opacity={0.8}>{ask}</text>
            </g>
          );
        })}
        <text x={180} y={202} textAnchor="middle" fontSize={9.5} fontWeight={600} fill={G}>{t("Искать широко · отсеивать быстро · читать глубоко", "Search wide · screen fast · read deeply")}</text>
      </Svg>
    );
  },

  /** Из чего состоит сильный исследовательский вопрос — и чего нет у слабого. */
  "rm2-rq-anatomy": (t) => {
    const rows: [string, string, string][] = [
      [t("Группа (кто)", "Population"), "Among long-haul truck drivers,", S],
      [t("Фактор / сравнение", "Factor / comparison"), "does SafeDrive, vs a paper checklist,", V],
      [t("Измеряемый итог", "Outcome"), "lower validated fatigue-scale scores", G],
      [t("Контекст / срок", "Context / time"), "over six weeks?", A],
    ];
    return (
      <Svg h={198} label={t("Анатомия исследовательского вопроса", "Anatomy of a research question")}>
        {rows.map(([name, chunk, color], i) => (
          <g key={i}>
            <rect x={6} y={8 + i * 34} width={124} height={26} rx={7} fill={color} fillOpacity={0.15} stroke={color} strokeWidth={1.5} />
            <text x={68} y={25 + i * 34} textAnchor="middle" fontSize={10} fontWeight={600} fill="currentColor">{name}</text>
            <text x={140} y={25 + i * 34} fontSize={10} fill="currentColor">{chunk}</text>
          </g>
        ))}
        <line x1={10} y1={150} x2={350} y2={150} stroke={B} strokeDasharray="4 3" />
        <text x={180} y={170} textAnchor="middle" fontSize={10.5} fontWeight={600} fill={R}>✗ Does technology improve road safety?</text>
        <text x={180} y={188} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.75}>{t("нет группы, нет сравнения, нет измеримого итога — слишком широко", "no population, no comparison, no measurable outcome — too broad")}</text>
      </Svg>
    );
  },
};
