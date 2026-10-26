import { A, B, Box, F, G, R, S, Svg, V, Wrap, type Draw } from "./kit";

/** Схемы лекции 5 курса Project Management: имена с префиксом «pm5-», в конспекте — «@diagram pm5-…». */
export const diagrams: Record<string, Draw> = {
  "pm5-integration-evolution": (t) => (
    <Svg h={226} label={t("Эволюция должностей интеграции: от project leader до проектной и матричной структур", "Evolution of work-integration positions: from project leader to projectized and matrix")}>
      <text x={8} y={16} fontSize={10} fontWeight={700} fill="currentColor">{t("полномочия интегратора растут →", "integrator's authority grows →")}</text>
      {[
        [t("Лидер проекта", "Project leader"), t("в своём отделе, временно", "inside one dept, temporary"), B],
        ["Task force", t("представители, без формальной власти", "unit reps, no formal authority"), S],
        [t("Отдел связи", "Liaison dept"), t("expeditor; только в подразделении", "expeditor; only within division"), A],
        ["Line / staff", t("coordinator; без линейной власти", "coordinator; no line authority"), V],
        [t("Проектная / матрица", "Projectized / matrix"), t("полная или общая власть PM", "full or shared line authority"), G],
      ].map(([name, sub, c], i) => {
        const h = 30 + i * 24;
        const x = 6 + i * 70.4;
        return (
          <g key={i}>
            <rect x={x} y={150 - h} width={66} height={h} rx={6} fill={F} stroke={c} strokeWidth={1.5} />
            <Wrap x={x + 33} y={150 - h + 13} text={name} max={11} size={9} gap={10} opacity={1} />
            <Wrap x={x + 33} y={164} text={sub} max={12} size={8.5} gap={10} />
          </g>
        );
      })}
      <line x1={4} y1={150} x2={356} y2={150} stroke="currentColor" opacity={0.4} />
      <text x={180} y={218} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.75}>{t("от координации без власти — к полной или общей власти PM", "from coordination without power to full or shared PM authority")}</text>
    </Svg>
  ),
  "pm5-structures": (t) => {
    const panel = (x0: number, title: string, c: string) => (
      <g>
        <text x={x0 + 56} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill={c}>{title}</text>
        <rect x={x0} y={22} width={112} height={150} rx={10} fill="none" stroke={c} strokeDasharray="5 4" />
      </g>
    );
    const worker = (x: number, y: number, k: string | number) => <circle key={k} cx={x} cy={y} r={5} fill={F} stroke="currentColor" strokeWidth={1.2} />;
    return (
      <Svg h={238} label={t("Три структуры рядом: функциональная, проектная и матричная", "Three structures side by side: functional, projectized and matrix")}>
        {panel(4, t("Функциональная", "Functional"), S)}
        {panel(124, t("Проектная", "Projectized"), A)}
        {panel(244, t("Матричная", "Matrix"), V)}
        {/* Функциональная: руководитель → отделы → люди; проект ничей */}
        <Box x={36} y={30} w={48} h={20} label={t("Рук.", "Exec")} size={9} />
        {[0, 1, 2].map((j) => {
          const cx = 25 + j * 35;
          return (
            <g key={j}>
              <line x1={60} y1={50} x2={cx} y2={66} stroke="currentColor" opacity={0.6} />
              <Box x={cx - 15} y={66} w={30} h={20} label={[t("Разр.", "Dev"), "QA", "Ops"][j]} size={8.5} stroke={S} />
              <line x1={cx} y1={86} x2={cx} y2={118} stroke="currentColor" opacity={0.5} />
              {worker(cx, 104, "a")}
              {worker(cx, 124, "b")}
            </g>
          );
        })}
        <line x1={12} y1={146} x2={108} y2={146} stroke={R} strokeDasharray="4 3" />
        <text x={60} y={162} textAnchor="middle" fontSize={8.5} fill={R}>{t("проект — ничей", "project: no owner")}</text>
        {/* Проектная: GM → PM A, PM B → свои люди */}
        <Box x={160} y={30} w={40} h={20} label="GM" size={9} />
        {[0, 1].map((j) => {
          const cx = 152 + j * 56;
          return (
            <g key={j}>
              <line x1={180} y1={50} x2={cx} y2={64} stroke="currentColor" opacity={0.6} />
              <Box x={cx - 22} y={64} w={44} h={22} label={j ? "PM B" : "PM A"} size={9} stroke={A} />
              {[0, 1].map((k) => (
                <g key={k}>
                  <line x1={cx} y1={86} x2={cx - 11 + k * 22} y2={100} stroke="currentColor" opacity={0.5} />
                  <Box x={cx - 21 + k * 22} y={100} w={20} h={18} label={k ? "QA" : t("Р", "D")} size={8} />
                </g>
              ))}
              <line x1={cx - 11} y1={118} x2={cx - 11} y2={129} stroke="currentColor" opacity={0.5} />
              <line x1={cx + 11} y1={118} x2={cx + 11} y2={129} stroke="currentColor" opacity={0.5} />
              {worker(cx - 11, 134, "a")}
              {worker(cx + 11, 134, "b")}
            </g>
          );
        })}
        <text x={180} y={162} textAnchor="middle" fontSize={8.5} fill={A}>{t("свои люди у проекта", "own staff per project")}</text>
        {/* Матричная: отделы по вертикали, проекты по горизонтали */}
        <Box x={280} y={30} w={40} h={20} label="GM" size={9} />
        {[0, 1, 2].map((j) => {
          const cx = 290 + j * 26;
          return (
            <g key={j}>
              <line x1={300} y1={50} x2={cx} y2={58} stroke="currentColor" opacity={0.6} />
              <Box x={cx - 12} y={58} w={24} h={18} label={[t("Р", "D"), "QA", "Op"][j]} size={8} stroke={S} />
              <line x1={cx} y1={76} x2={cx} y2={146} stroke={S} strokeWidth={1.2} />
            </g>
          );
        })}
        {[0, 1].map((r) => {
          const y = 100 + r * 28;
          return (
            <g key={r}>
              <Box x={248} y={y - 9} w={26} h={18} label={r ? "PM B" : "PM A"} size={7.5} stroke={V} />
              <line x1={274} y1={y} x2={350} y2={y} stroke={V} strokeWidth={1.2} />
              {[0, 1, 2].map((j) => worker(290 + j * 26, y, j))}
            </g>
          );
        })}
        <text x={300} y={162} textAnchor="middle" fontSize={8.5} fill={V}>{t("у каждого 2 начальника", "2 bosses per worker")}</text>
        {[
          [t("PM: нет власти", "PM: no authority"), t("PM: полная власть", "PM: full authority"), t("PM: общая власть", "PM: shared")],
          [t("затраты: низкие", "cost: low"), t("затраты: высокие", "cost: high"), t("затраты: средние", "cost: medium")],
          [t("сильная техника", "strong technology"), t("быстрая реакция", "rapid reaction"), t("самая сложная", "most complex")],
        ].map((row, ri) => row.map((txt, ci) => (
          <text key={`${ri}-${ci}`} x={60 + ci * 120} y={190 + ri * 16} textAnchor="middle" fontSize={9} fill="currentColor" opacity={ri === 0 ? 1 : 0.8} fontWeight={ri === 0 ? 600 : 400}>{txt}</text>
        )))}
      </Svg>
    );
  },
  "pm5-matrix-strength": (t) => (
    <Svg h={194} label={t("Сила матрицы: слабая, сбалансированная, сильная — по тому, у кого больше влияния на работников", "Matrix strength: weak, balanced, strong — by who has more influence over the workers")}>
      <polygon points="20,24 340,58 340,66 20,66" fill={S} opacity={0.35} />
      <text x={26} y={50} fontSize={9.5} fontWeight={600} fill="currentColor">{t("влияние линейного менеджера", "line manager's influence")}</text>
      <polygon points="20,106 340,72 340,114 20,114" fill={V} opacity={0.35} />
      <text x={334} y={102} textAnchor="end" fontSize={9.5} fontWeight={600} fill="currentColor">{t("влияние проектного менеджера", "project manager's influence")}</text>
      {[
        [t("Функц.", "Functional"), S],
        [t("Слабая", "Weak"), S],
        [t("Сбаланс.", "Balanced"), A],
        [t("Сильная", "Strong"), V],
        [t("Проектная", "Projectized"), V],
      ].map(([label, c], i) => (
        <g key={i}>
          <line x1={36 + i * 72} y1={118} x2={36 + i * 72} y2={126} stroke={c} strokeWidth={2} />
          <text x={36 + i * 72} y={138} textAnchor="middle" fontSize={9.5} fontWeight={i > 0 && i < 4 ? 700 : 400} fill="currentColor">{label}</text>
        </g>
      ))}
      <path d="M96 146 v6 h168 v-6" fill="none" stroke={A} strokeWidth={1.5} />
      <text x={180} y={166} textAnchor="middle" fontSize={9.5} fill={A}>{t("матрица — «глазами проектного менеджера»", "matrix — \"as seen by the project manager\"")}</text>
      <text x={180} y={186} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.75}>{t("кто сильнее влияет на ежедневную работу — тот и определяет силу", "who has more influence over daily work sets the strength")}</text>
    </Svg>
  ),
};
