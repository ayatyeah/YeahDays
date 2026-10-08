import { A, Arrow, B, Box, Device, F, G, R, S, Svg, V, Wrap, type Draw } from "./kit";

/** Схемы лекции «cc9»: имена с префиксом «cc9-», в конспекте — «@diagram cc9-…». */
export const diagrams: Record<string, Draw> = {
  /* Том EBS живёт в одной AZ; snapshot в S3 — на весь регион; из него — новый том в другой AZ. */
  "cc9-ebs-snapshot": (t) => (
    <Svg h={210} label={t("Snapshot EBS: перенос тома в другую AZ", "EBS snapshot: moving a volume to another AZ")}>
      <rect x={4} y={4} width={352} height={150} rx={12} fill="none" stroke={B} strokeDasharray="5 4" />
      <text x={14} y={18} fontSize={10} fontWeight={600} fill="currentColor" opacity={0.75}>{t("Регион", "Region")}</text>
      <rect x={12} y={26} width={104} height={120} rx={10} fill="none" stroke={S} strokeDasharray="4 3" />
      <text x={64} y={40} textAnchor="middle" fontSize={10} fontWeight={600} fill={S}>AZ a</text>
      <Box x={24} y={48} w={80} h={28} label="EC2" stroke={A} />
      <Box x={24} y={100} w={80} h={34} label={t("Том EBS", "EBS volume")} sub="gp3" stroke={V} size={11} />
      <line x1={64} y1={76} x2={64} y2={100} stroke="currentColor" strokeWidth={1.5} />
      <rect x={244} y={26} width={104} height={120} rx={10} fill="none" stroke={S} strokeDasharray="4 3" />
      <text x={296} y={40} textAnchor="middle" fontSize={10} fontWeight={600} fill={S}>AZ b</text>
      <Box x={256} y={48} w={80} h={28} label="EC2" stroke={A} />
      <Box x={256} y={100} w={80} h={34} label={t("Новый том", "New volume")} sub={t("из snapshot", "from snapshot")} stroke={V} size={11} />
      <line x1={296} y1={76} x2={296} y2={100} stroke="currentColor" strokeWidth={1.5} />
      <rect x={134} y={30} width={92} height={112} rx={10} fill={G} fillOpacity={0.08} stroke={G} strokeWidth={1.5} />
      <text x={180} y={46} textAnchor="middle" fontSize={11} fontWeight={600} fill={G}>Amazon S3</text>
      {[[t("Snap 1 · всё", "Snap 1 · full"), 0.45], [t("Snap 2 · Δ", "Snap 2 · Δ"), 0.25], [t("Snap 3 · Δ", "Snap 3 · Δ"), 0.25]].map(([name, op], i) => (
        <g key={i}>
          <rect x={144} y={56 + i * 26} width={72} height={20} rx={5} fill={G} opacity={op as number} />
          <text x={180} y={70 + i * 26} textAnchor="middle" fontSize={9} fontWeight={600} fill="currentColor">{name as string}</text>
        </g>
      ))}
      <Arrow x1={104} y1={117} x2={134} y2={117} color={G} />
      <text x={119} y={110} textAnchor="middle" fontSize={8} fill={G}>snapshot</text>
      <Arrow x1={226} y1={117} x2={256} y2={117} color={V} />
      <text x={241} y={110} textAnchor="middle" fontSize={8} fill={V}>create</text>
      <text x={180} y={172} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.8}>{t("Том — в одной AZ; snapshot в S3 доступен всему региону", "A volume lives in one AZ; a snapshot in S3 serves the whole Region")}</text>
      <text x={180} y={188} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.8}>{t("Инкрементно: после первого — только изменённые блоки", "Incremental: after the first, only changed blocks")}</text>
      <text x={180} y={204} textAnchor="middle" fontSize={10} fontWeight={600} fill={R}>{t("Подключить том к EC2 в другой AZ нельзя", "A volume cannot attach to EC2 in another AZ")}</text>
    </Svg>
  ),

  /* Как на мидтерме: VPC с тремя AZ, в каждой mount target (network interface), к ним подключены EC2. */
  "cc9-efs-mount-targets": (t) => (
    <Svg h={236} label={t("Amazon EFS: mount target в каждой AZ", "Amazon EFS: a mount target in each AZ")}>
      <rect x={4} y={4} width={352} height={176} rx={12} fill="none" stroke={G} strokeWidth={1.5} />
      <text x={14} y={18} fontSize={10} fontWeight={600} fill={G}>VPC</text>
      {["A", "B", "C"].map((az, i) => {
        const x = 12 + i * 116;
        const ec2 = i === 0 ? [x + 8, x + 54] : i === 2 ? [x + 31] : [];
        return (
          <g key={az}>
            <rect x={x} y={24} width={104} height={148} rx={8} fill="none" stroke={S} strokeDasharray="4 3" />
            <text x={x + 52} y={37} textAnchor="middle" fontSize={10} fontWeight={600} fill={S}>{t("AZ ", "AZ ") + az}</text>
            <rect x={x + 4} y={44} width={96} height={122} rx={6} fill={S} fillOpacity={0.07} />
            <text x={x + 8} y={55} fontSize={8} fill={S}>{t("частная подсеть", "private subnet")}</text>
            {ec2.map((ex) => (
              <g key={ex}>
                <Box x={ex} y={62} w={42} h={28} label="EC2" stroke={A} size={11} />
                <Arrow x1={ex + 21} y1={90} x2={x + 52} y2={118} color={A} />
              </g>
            ))}
            {!ec2.length && <text x={x + 52} y={84} textAnchor="middle" fontSize={8} fill="currentColor" opacity={0.6}>{t("инстансов пока нет", "no instances yet")}</text>}
            <Box x={x + 10} y={118} w={84} h={38} label="Mount target" sub={t("network interface", "network interface")} stroke={V} size={10} />
            <line x1={x + 52} y1={156} x2={180} y2={194} stroke={G} strokeWidth={1.2} />
          </g>
        );
      })}
      <Box x={110} y={194} w={140} h={36} label="Amazon EFS" sub={t("данные в нескольких AZ", "data stored across AZs")} stroke={G} />
    </Svg>
  ),

  /* RDS: Multi-AZ (синхронный standby, автоматический failover) против read replica (асинхронно, чтение). */
  "cc9-rds-multiaz": (t) => (
    <Svg h={222} label={t("RDS Multi-AZ и read replica", "RDS Multi-AZ and a read replica")}>
      <Box x={120} y={6} w={120} h={30} label={t("Приложение", "App")} sub="EC2" stroke={A} size={11} />
      <text x={246} y={24} fontSize={8} fill="currentColor" opacity={0.75}>{t("один DB endpoint (DNS)", "one DB endpoint (DNS)")}</text>
      {[[8, "AZ a"], [125, "AZ b"], [242, t("AZ c или другой регион", "AZ c or another Region")]].map(([x, name]) => (
        <g key={x as number}>
          <rect x={x as number} y={60} width={110} height={88} rx={8} fill="none" stroke={S} strokeDasharray="4 3" />
          <text x={(x as number) + 55} y={73} textAnchor="middle" fontSize={9} fontWeight={600} fill={S}>{name as string}</text>
        </g>
      ))}
      <Box x={18} y={86} w={90} h={42} label="Primary" sub={t("чтение и запись", "read / write")} stroke={G} />
      <Box x={135} y={86} w={90} h={42} label="Standby" sub={t("чтения нет", "no reads")} stroke={A} />
      <Box x={252} y={86} w={90} h={42} label="Read replica" sub={t("только чтение", "read-only")} stroke={S} size={11} />
      <Arrow x1={150} y1={36} x2={70} y2={86} color={G} />
      <Arrow x1={180} y1={36} x2={180} y2={86} color={R} dashed />
      <text x={186} y={64} fontSize={8} fill={R}>failover</text>
      <Arrow x1={212} y1={36} x2={290} y2={86} color={S} />
      <text x={262} y={56} fontSize={8} fill={S}>{t("чтение", "reads")}</text>
      <Arrow x1={108} y1={107} x2={135} y2={107} color={G} />
      <text x={121} y={100} textAnchor="middle" fontSize={8} fill={G}>sync</text>
      <line x1={63} y1={128} x2={63} y2={160} stroke={S} strokeWidth={1.5} strokeDasharray="4 3" />
      <line x1={63} y1={160} x2={297} y2={160} stroke={S} strokeWidth={1.5} strokeDasharray="4 3" />
      <Arrow x1={297} y1={160} x2={297} y2={128} color={S} dashed />
      <text x={180} y={156} textAnchor="middle" fontSize={8} fill={S}>async</text>
      <Wrap x={180} y={180} max={70} size={9} text={t("Multi-AZ — синхронная копия и автоматический failover (надёжность). Read replica — асинхронная копия для масштабирования чтения.", "Multi-AZ — a synchronous copy and automatic failover (availability). Read replica — an asynchronous copy to scale reads.")} />
    </Svg>
  ),
};

void [Device, F];
