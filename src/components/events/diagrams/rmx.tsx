import { A, Arrow, B, Box, F, G, R, S, Svg, V, Wrap, type Draw } from "./kit";

/** Схемы практики «формат квиза-кейса» (rm-px): имена с префиксом «rmx-», в конспекте — «@diagram rmx-…». */
export const diagrams: Record<string, Draw> = {
  /** Три части постановки проблемы ведут к одному вопросу: популяция + сравнение + исход. */
  "rmx-rq-builder": (t) => (
    <Svg h={196} label={t("Постановка проблемы из трёх частей ведёт к вопросу: популяция, сравнение, исход", "A three-part problem statement leads to one RQ: population, comparison, outcome")}>
      <Box x={6} y={8} w={108} h={50} label={t("Ситуация", "Situation")} sub={t("кто, что, где", "who, what, where")} stroke={S} />
      <Box x={126} y={8} w={108} h={50} label={t("Ограничение", "Limitation")} sub={t("со ссылкой на Study", "cite Study A–D")} stroke={A} />
      <Box x={246} y={8} w={108} h={50} label={t("Потребность", "Need")} sub={t("каких данных нет", "missing evidence")} stroke={V} />
      <Arrow x1={114} y1={33} x2={126} y2={33} />
      <Arrow x1={234} y1={33} x2={246} y2={33} />
      <Arrow x1={300} y1={58} x2={300} y2={88} />
      <rect x={6} y={88} width={348} height={70} rx={10} fill="none" stroke={B} strokeWidth={1.5} strokeDasharray="4 3" />
      <text x={180} y={101} textAnchor="middle" fontSize={10} fontWeight={700} fill="currentColor">{t("Один исследовательский вопрос (RQ)", "One research question (RQ)")}</text>
      <Box x={14} y={108} w={104} h={42} label={t("Популяция", "Population")} sub={t("дальнобойщики", "long-haul drivers")} fill={F} stroke={S} size={11} />
      <Box x={128} y={108} w={104} h={42} label={t("Сравнение", "Comparison")} sub={t("app vs чек-лист", "app vs checklist")} fill={F} stroke={A} size={11} />
      <Box x={242} y={108} w={104} h={42} label={t("Исход", "Outcome")} sub={t("балл усталости", "fatigue score")} fill={F} stroke={G} size={11} />
      <text x={180} y={172} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.8}>{t("Контекст: 6 недель, 60 водителей, клиника", "Context: 6 weeks, 60 drivers, clinic study")}</text>
      <text x={180} y={188} textAnchor="middle" fontSize={9} fontWeight={600} fill={G}>{t("Один вопрос · измеримый исход · данные уже есть в кейсе", "One question · a measurable outcome · data the case already has")}</text>
    </Svg>
  ),

  /** Синтез пишется по строкам (результаты, методы, ограничения), а не по столбцам-исследованиям. */
  "rmx-synthesis-grid": (t) => {
    const studies = ["A", "B", "C", "D"];
    const rows: { label: string; color: string; cells: string[] }[] = [
      {
        label: t("Результаты", "Findings"),
        color: V,
        cells: [
          t("near-miss ↓, аварии n.s.", "near-misses ↓, accidents n.s."),
          t("меньше событий (связь)", "fewer events (association)"),
          t("звук ценят, видео мешает", "audio valued, video intrusive"),
          t("смешанные итоги", "mixed results"),
        ],
      },
      {
        label: t("Методы", "Methods"),
        color: S,
        cells: [t("рандомизация", "randomised"), t("наблюдение", "observational"), t("18 интервью", "18 interviews"), t("обзор 15 работ", "review of 15")],
      },
      {
        label: t("Ограничения", "Limits"),
        color: A,
        cells: [
          t("самоотчёт; таксисты", "self-report; taxi drivers"),
          t("самоотбор; сон", "self-selection; sleep"),
          t("мало; нет оценки эффекта", "small; no effect size"),
          t("мало дальнобоя; отсев", "few long-haul; attrition"),
        ],
      },
    ];
    return (
      <Svg h={228} label={t("Сетка синтеза: исследования A–D по строкам результатов, методов и ограничений", "Synthesis grid: Studies A–D across rows of findings, methods and limitations")}>
        {studies.map((s, i) => (
          <text key={s} x={114 + i * 68} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">Study {s}</text>
        ))}
        {rows.map((r, j) => (
          <g key={r.label}>
            <rect x={4} y={24 + j * 48} width={348} height={44} rx={8} fill={F} stroke={r.color} strokeWidth={1.5} />
            <text x={40} y={50 + j * 48} textAnchor="middle" fontSize={10} fontWeight={700} fill={r.color}>{r.label}</text>
            {r.cells.map((c, i) => (
              <g key={i}>
                <line x1={80 + i * 68} y1={28 + j * 48} x2={80 + i * 68} y2={64 + j * 48} stroke="currentColor" opacity={0.2} />
                <Wrap x={114 + i * 68} y={40 + j * 48} text={c} max={14} size={8} gap={10} />
              </g>
            ))}
          </g>
        ))}
        <Arrow x1={20} y1={178} x2={340} y2={178} color={G} />
        <text x={180} y={172} textAnchor="middle" fontSize={9} fontWeight={600} fill="currentColor">{t("Пишите по строкам: Both… In contrast… Only…", "Write across the rows: Both… In contrast… Only…")}</text>
        <rect x={50} y={190} width={260} height={30} rx={8} fill="none" stroke={G} strokeWidth={1.5} />
        <text x={180} y={209} textAnchor="middle" fontSize={10} fontWeight={600} fill="currentColor">{t("→ пробел: эффект для дальнобойщиков неясен", "→ gap: effect on long-haul drivers unclear")}</text>
      </Svg>
    );
  },

  /** Риск → мера защиты → запись, которая доказывает, что мера применена. */
  "rmx-risk-chain": (t) => {
    const rows: [string, string, string][] = [
      [
        t("Видео пишется по умолчанию: лица водителей и пассажиров", "Video recorded by default: faces of drivers and passengers"),
        t("Видео выключено; детекция на телефоне, кадры не хранятся", "Off by default; on-phone detection, no frames stored"),
        t("Экспорт настроек + согласие с описанием камеры", "Settings export + consent form on camera use"),
      ],
      [
        t("Непрерывный GPS выдаёт дом и маршруты", "Continuous GPS reveals homes and routes"),
        t("Место — только в момент сигнала и огрублённо", "Location only at alerts, coarsened"),
        t("Словарь полей; выгрузка без сырых GPS", "Data dictionary; export with no raw GPS"),
      ],
    ];
    const cols: [string, string][] = [[t("Риск", "Risk"), R], [t("Мера защиты", "Safeguard"), G], [t("Запись", "Record"), S]];
    return (
      <Svg h={200} label={t("Цепочка: риск, мера защиты, запись-доказательство", "Chain: risk, safeguard, evidence record")}>
        {cols.map(([name, color], i) => (
          <text key={name} x={60 + i * 120} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill={color}>{name}</text>
        ))}
        {rows.map((row, j) => (
          <g key={j}>
            {row.map((text, i) => (
              <g key={i}>
                <rect x={6 + i * 120} y={22 + j * 72} width={108} height={62} rx={8} fill={F} stroke={cols[i][1]} strokeWidth={1.5} />
                <Wrap x={60 + i * 120} y={38 + j * 72} text={text} max={21} size={8.5} gap={11} opacity={0.9} />
              </g>
            ))}
            <Arrow x1={114} y1={53 + j * 72} x2={126} y2={53 + j * 72} />
            <Arrow x1={234} y1={53 + j * 72} x2={246} y2={53 + j * 72} />
          </g>
        ))}
        <text x={180} y={178} textAnchor="middle" fontSize={9} fontWeight={600} fill="currentColor">{t("Нет записи — нет доказательства, что мера применена", "No record means no proof that the safeguard was applied")}</text>
        <text x={180} y={192} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.75}>{t("«Мы получим согласие» — мера; подписанная форма — запись", "“We will get consent” is a safeguard; the signed form is the record")}</text>
      </Svg>
    );
  },
};
