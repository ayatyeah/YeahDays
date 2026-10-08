import { A, Arrow, B, Box, Device, F, G, R, S, Svg, V, Wrap, type Draw } from "./kit";

/** Схемы лекции «cc8»: имена с префиксом «cc8-», в конспекте — «@diagram cc8-…». */
export const diagrams: Record<string, Draw> = {
  "cc8-instance-name": (t) => (
    <Svg h={176} label={t("Из чего состоит имя типа инстанса c5n.xlarge", "What the instance type name c5n.xlarge is made of")}>
      <Box x={14} y={14} w={64} h={44} label="c" sub={t("семейство", "family")} stroke={V} size={16} />
      <Box x={84} y={14} w={64} h={44} label="5" sub={t("поколение", "generation")} stroke={S} size={16} />
      <Box x={154} y={14} w={64} h={44} label="n" sub={t("атрибут", "attribute")} stroke={A} size={16} />
      <text x={226} y={44} textAnchor="middle" fontSize={20} fontWeight={700} fill="currentColor">.</text>
      <Box x={234} y={14} w={112} h={44} label="xlarge" sub={t("размер", "size")} stroke={G} size={16} />
      <Wrap x={46} y={76} text={t("c = compute optimized", "c = compute optimized")} max={12} size={8.5} gap={10} />
      <Wrap x={116} y={76} text={t("выше — новее и выгоднее", "higher = newer, better value")} max={12} size={8.5} gap={10} />
      {[t("n — сеть", "n — network"), t("d — диск хоста", "d — local disk"), "g — Graviton", "a — AMD"].map((l, i) => <text key={l} x={186} y={76 + i * 10} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.8}>{l}</text>)}
      <Wrap x={290} y={76} text={t("каждый шаг вверх ≈ ×2 vCPU и RAM", "each step up ≈ ×2 vCPU and RAM")} max={20} size={8.5} gap={10} />
      <line x1={14} y1={124} x2={346} y2={124} stroke={B} />
      <text x={180} y={142} textAnchor="middle" fontSize={9.5} fill="currentColor">nano → micro → small → medium → large</text>
      <text x={180} y={158} textAnchor="middle" fontSize={9.5} fill="currentColor">→ xlarge → 2xlarge → 4xlarge → … → metal</text>
      <text x={180} y={172} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.7}>{t("t3.micro: семейство t, поколение 3, размер micro", "t3.micro: family t, generation 3, size micro")}</text>
    </Svg>
  ),
  "cc8-lifecycle": (t) => (
    <Svg h={196} label={t("Жизненный цикл инстанса EC2", "The EC2 instance lifecycle")}>
      <path d="M342 134 H352 V14 H48 V34" fill="none" stroke={S} strokeWidth={1.5} strokeDasharray="4 3" />
      <Arrow x1={48} y1={30} x2={48} y2={40} color={S} />
      <text x={200} y={10} textAnchor="middle" fontSize={9} fill={S}>start</text>
      <text x={56} y={33} fontSize={8.5} fill="currentColor" opacity={0.75}>{t("из AMI", "from AMI")}</text>
      <Box x={8} y={40} w={80} h={28} label="pending" stroke={A} size={11} />
      <Box x={140} y={40} w={80} h={28} label="running" stroke={G} size={11} />
      <Box x={262} y={40} w={80} h={28} label="stopping" stroke={A} size={11} />
      <Arrow x1={88} y1={54} x2={140} y2={54} />
      <Arrow x1={220} y1={54} x2={262} y2={54} />
      <text x={241} y={49} textAnchor="middle" fontSize={8.5} fill="currentColor">stop</text>
      <text x={158} y={84} textAnchor="middle" fontSize={9} fill={S}>↺ reboot</text>
      <Box x={262} y={120} w={80} h={28} label="stopped" stroke={S} size={11} />
      <Arrow x1={302} y1={68} x2={302} y2={120} />
      <text x={298} y={104} textAnchor="end" fontSize={8} fill="currentColor" opacity={0.8}>{t("или hibernate", "or hibernate")}</text>
      <Box x={140} y={120} w={80} h={28} label="shutting-down" stroke={R} size={9.5} />
      <Box x={8} y={120} w={80} h={28} label="terminated" stroke={R} size={11} />
      <Arrow x1={200} y1={68} x2={200} y2={120} color={R} />
      <text x={204} y={88} fontSize={8} fill={R}>terminate</text>
      <Arrow x1={140} y1={134} x2={88} y2={134} color={R} />
      <Arrow x1={262} y1={134} x2={220} y2={134} color={R} />
      <text x={180} y={168} textAnchor="middle" fontSize={8.5} fill="currentColor">{t("running — платите за инстанс; stopped — только за EBS", "running — you pay for the instance; stopped — only for EBS")}</text>
      <text x={180} y={184} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.75}>{t("stop: EBS цел, instance store стёрт, новый public IP", "stop: EBS kept, instance store wiped, new public IP")}</text>
    </Svg>
  ),
  "cc8-purchase": (t) => {
    const rows: [string, string, string, string][] = [
      [t("Нагрузка неясна, без обязательств", "Unknown load, no commitment"), "On-Demand", t("цена по умолчанию", "the reference price"), A],
      [t("Ровно 24/7 на 1–3 года", "Steady 24/7 for 1–3 years"), "RI / Savings Plans", t("до ~72%", "up to ~72%"), G],
      [t("Регулярное окно: ежемесячный отчёт", "Recurring window: monthly report"), "Scheduled RI", t("по расписанию, 1 год", "on a schedule, 1 year"), S],
      [t("Можно прервать, stateless", "Interruptible, stateless"), "Spot", t("до 90%, 2 мин. на выход", "up to 90%, 2-min notice"), V],
      [t("Compliance, BYOL, свой сервер", "Compliance, BYOL, own server"), "Dedicated Host", t("контроль размещения", "placement control"), R],
    ];
    return (
      <Svg h={190} label={t("Какой вариант покупки EC2 выбрать", "Which EC2 purchase option to choose")}>
        <text x={10} y={14} fontSize={10} fontWeight={700} fill="currentColor">{t("Нагрузка", "Workload")}</text>
        <text x={236} y={14} fontSize={10} fontWeight={700} fill="currentColor">{t("Вариант", "Option")}</text>
        {rows.map(([need, option, note, c], i) => (
          <g key={option}>
            <text x={10} y={40 + i * 34} fontSize={9.5} fill="currentColor">{need}</text>
            <Arrow x1={194} y1={36 + i * 34} x2={226} y2={36 + i * 34} color={c} />
            <rect x={228} y={22 + i * 34} width={124} height={28} rx={7} fill={F} stroke={c} strokeWidth={1.5} />
            <text x={290} y={34 + i * 34} textAnchor="middle" fontSize={9.5} fontWeight={700} fill="currentColor">{option}</text>
            <text x={290} y={45 + i * 34} textAnchor="middle" fontSize={8} fill="currentColor" opacity={0.7}>{note}</text>
          </g>
        ))}
      </Svg>
    );
  },
};

void [Device];
