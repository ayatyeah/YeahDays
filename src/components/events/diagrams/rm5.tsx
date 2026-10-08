import { A, Arrow, B, Box, Device, F, G, R, S, Svg, V, Wrap, type Draw } from "./kit";

/** Схемы лекции «rm5»: имена с префиксом «rm5-», в конспекте — «@diagram rm5-…». */
export const diagrams: Record<string, Draw> = {
  /** Цепочка решения: от исследовательского вопроса к методу (змейкой в два ряда). */
  "rm5-chain": (t) => (
    <Svg h={176} label={t("От исследовательского вопроса к методу", "From the research question to the method")}>
      <Box x={6} y={12} w={108} h={42} label="RQ" sub={t("исходный вопрос", "core inquiry")} stroke={V} />
      <Box x={126} y={12} w={108} h={42} label={t("Знание", "Knowledge")} sub={t("что нужно узнать", "what must be known")} size={11} />
      <Box x={246} y={12} w={108} h={42} label={t("Доказательства", "Evidence")} sub={t("что ответит на RQ", "what would answer")} stroke={G} size={11} />
      <Box x={246} y={88} w={108} h={42} label={t("Данные", "Data")} sub={t("числа · слова · логи", "numbers · words · logs")} size={11} />
      <Box x={126} y={88} w={108} h={42} label={t("Подход", "Approach")} sub="quan · qual · mixed" size={11} />
      <Box x={6} y={88} w={108} h={42} label={t("Метод", "Method")} sub={t("конкретная техника", "the technique")} stroke={A} />
      <Arrow x1={114} y1={33} x2={126} y2={33} />
      <Arrow x1={234} y1={33} x2={246} y2={33} />
      <Arrow x1={300} y1={54} x2={300} y2={88} />
      <Arrow x1={246} y1={109} x2={234} y2={109} />
      <Arrow x1={126} y1={109} x2={114} y2={109} />
      <Arrow x1={40} y1={88} x2={40} y2={54} color={R} dashed />
      <text x={46} y={75} fontSize={9} fill={R}>{t("✕ метод первым", "✕ method first")}</text>
      <text x={180} y={152} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.8}>{t("Метод — последнее решение, а не первое", "The method is the last decision, not the first")}</text>
      <text x={180} y={168} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.65}>{t("затем: выполнимо? этично? отвечает ли на RQ?", "then check: feasible? ethical? does it answer the RQ?")}</text>
    </Svg>
  ),

  /** Дедуктивная и индуктивная логика. */
  "rm5-logic": (t) => (
    <Svg h={160} label={t("Дедуктивная и индуктивная логика", "Deductive and inductive logic")}>
      <text x={6} y={14} fontSize={11} fontWeight={600} fill={S}>{t("Дедукция — часто в количественных", "Deductive — often quantitative")}</text>
      {[t("Теория", "Theory"), t("Гипотеза", "Hypothesis"), t("Данные", "Data"), t("Проверка", "Test")].map((label, i) => (
        <Box key={label} x={6 + i * 88} y={22} w={82} h={30} label={label} stroke={S} size={10} />
      ))}
      {[0, 1, 2].map((i) => <Arrow key={i} x1={88 + i * 88} y1={37} x2={94 + i * 88} y2={37} color={S} />)}
      <text x={6} y={82} fontSize={11} fontWeight={600} fill={G}>{t("Индукция — часто в качественных", "Inductive — often qualitative")}</text>
      {[t("Данные", "Data"), t("Паттерны", "Patterns"), t("Категории", "Categories"), t("Интерпретация", "Interpretation")].map((label, i) => (
        <Box key={label} x={6 + i * 88} y={90} w={82} h={30} label={label} stroke={G} size={10} />
      ))}
      {[0, 1, 2].map((i) => <Arrow key={i} x1={88 + i * 88} y1={105} x2={94 + i * 88} y2={105} color={G} />)}
      <Wrap x={180} y={140} max={70} size={9} text={t("«часто», а не «всегда»: реальные исследования сочетают обе логики", "“often”, not “always”: real studies frequently combine both")} />
    </Svg>
  ),

  /** Три базовых дизайна смешанных методов. */
  "rm5-mixed": (t) => (
    <Svg h={196} label={t("Дизайны смешанных методов", "Mixed-methods designs")}>
      {[
        { y: 14, title: t("Конвергентный (параллельный)", "Convergent (parallel)"), a: "QUAN", ac: S, b: "QUAL", bc: G, plus: true, end: t("Свести и сравнить", "Merge and compare") },
        { y: 76, title: t("Объяснительный последовательный", "Explanatory sequential"), a: "QUAN", ac: S, b: "qual", bc: G, plus: false, end: t("Объяснить итоги", "Explain the results") },
        { y: 138, title: t("Исследовательский последовательный", "Exploratory sequential"), a: "QUAL", ac: G, b: "quan", bc: S, plus: false, end: t("Проверить на многих", "Test at scale") },
      ].map((row) => (
        <g key={row.y}>
          <text x={6} y={row.y} fontSize={10} fontWeight={600} fill="currentColor">{row.title}</text>
          <Box x={6} y={row.y + 6} w={92} h={30} label={row.a} stroke={row.ac} size={11} />
          {row.plus
            ? <text x={109} y={row.y + 26} textAnchor="middle" fontSize={14} fontWeight={700} fill="currentColor">+</text>
            : <Arrow x1={98} y1={row.y + 21} x2={120} y2={row.y + 21} />}
          <Box x={120} y={row.y + 6} w={92} h={30} label={row.b} stroke={row.bc} size={11} />
          <Arrow x1={212} y1={row.y + 21} x2={234} y2={row.y + 21} />
          <Box x={234} y={row.y + 6} w={120} h={30} label={row.end} stroke={V} size={10} />
        </g>
      ))}
      <text x={180} y={190} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.7}>{t("ЗАГЛАВНЫЕ — ведущая часть · → по очереди · + одновременно", "CAPITALS — dominant strand · → one after the other · + at the same time")}</text>
    </Svg>
  ),
};

void [A, Arrow, B, Box, Device, F, G, R, S, Svg, V, Wrap];
