import { A, Arrow, B, Box, Device, F, G, R, S, Svg, V, Wrap, type Draw } from "./kit";

/** Схемы лекции «cc7»: имена с префиксом «cc7-», в конспекте — «@diagram cc7-…». */
export const diagrams: Record<string, Draw> = {
  "cc7-shared-model": (t) => (
    <Svg h={236} label={t("Модель разделённой ответственности AWS", "The AWS shared responsibility model")}>
      <rect x={4} y={4} width={352} height={126} rx={12} fill="none" stroke={G} strokeDasharray="5 4" />
      <text x={180} y={20} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={G}>{t("Клиент — безопасность В облаке", "Customer — security IN the cloud")}</text>
      <Box x={14} y={28} w={332} h={20} label={t("Данные клиента", "Customer data")} stroke={G} size={10} />
      <Box x={14} y={52} w={332} h={20} label={t("Платформа, приложения, управление доступом (IAM)", "Platform, applications, identity & access management")} stroke={G} size={10} />
      <Box x={14} y={76} w={332} h={20} label={t("Гостевая ОС, настройки сети и firewall", "Guest OS, network & firewall configuration")} stroke={G} size={10} />
      <Box x={14} y={100} w={332} h={20} label={t("Шифрование на клиенте и сервере, защита трафика", "Client- & server-side encryption, traffic protection")} stroke={G} size={10} />
      <rect x={4} y={138} width={352} height={78} rx={12} fill="none" stroke={A} strokeDasharray="5 4" />
      <text x={180} y={154} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={A}>{t("AWS — безопасность САМОГО облака", "AWS — security OF the cloud")}</text>
      <Box x={14} y={162} w={332} h={20} label={t("ПО: вычисления, хранение, базы данных, сеть", "Software: compute, storage, database, networking")} stroke={A} size={10} />
      <Box x={14} y={186} w={332} h={20} label={t("Оборудование и инфраструктура: регионы, AZ, edge", "Hardware & global infrastructure: Regions, AZs, edge")} stroke={A} size={10} />
      <text x={180} y={230} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.75}>{t("Чем управляемее сервис (EC2 → RDS → Lambda), тем больше делает AWS", "The more managed the service (EC2 → RDS → Lambda), the more AWS takes on")}</text>
    </Svg>
  ),
  "cc7-policy-eval": (t) => (
    <Svg h={186} label={t("Как IAM решает: разрешить или запретить", "How IAM decides: allow or deny")}>
      <Box x={4} y={12} w={82} h={32} label={t("Запрос", "Request")} size={11} />
      <Arrow x1={86} y1={28} x2={112} y2={28} />
      <Box x={112} y={12} w={160} h={32} label={t("Есть явный Deny?", "Explicit Deny anywhere?")} stroke={R} size={11} />
      <Arrow x1={272} y1={28} x2={294} y2={28} color={R} />
      <text x={283} y={20} textAnchor="middle" fontSize={9} fill={R}>{t("да", "yes")}</text>
      <Box x={294} y={12} w={62} h={32} label="DENY" stroke={R} size={11} />
      <Arrow x1={192} y1={44} x2={192} y2={72} />
      <text x={204} y={62} fontSize={9} fill="currentColor" opacity={0.8}>{t("нет", "no")}</text>
      <Box x={112} y={72} w={160} h={32} label={t("Есть явный Allow?", "Explicit Allow?")} stroke={G} size={11} />
      <Arrow x1={272} y1={88} x2={294} y2={88} color={G} />
      <text x={283} y={80} textAnchor="middle" fontSize={9} fill={G}>{t("да", "yes")}</text>
      <Box x={294} y={72} w={62} h={32} label="ALLOW" stroke={G} size={11} />
      <Arrow x1={192} y1={104} x2={192} y2={132} />
      <text x={204} y={122} fontSize={9} fill="currentColor" opacity={0.8}>{t("нет", "no")}</text>
      <Box x={112} y={132} w={160} h={32} label="DENY" sub={t("неявный (по умолчанию)", "implicit (the default)")} stroke={R} size={11} />
      <text x={180} y={180} textAnchor="middle" fontSize={9.5} fill="currentColor" opacity={0.75}>{t("явный Deny > явный Allow > неявный Deny", "explicit Deny > explicit Allow > implicit Deny")}</text>
    </Svg>
  ),
  "cc7-lab1": (t) => (
    <Svg h={178} label={t("Lab 1: пользователи, группы и политики", "Lab 1: users, groups and policies")}>
      <text x={40} y={12} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.7}>{t("пользователь", "user")}</text>
      <text x={149} y={12} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.7}>{t("группа", "group")}</text>
      <text x={287} y={12} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.7}>{t("политика группы", "group policy")}</text>
      {[
        ["user-1", "S3-Support", "AmazonS3ReadOnlyAccess", t("AWS managed · чтение", "AWS managed · read-only"), S],
        ["user-2", "EC2-Support", "AmazonEC2ReadOnlyAccess", t("AWS managed · чтение", "AWS managed · read-only"), V],
        ["user-3", "EC2-Admin", "EC2-Admin-Policy", t("inline · старт/стоп", "inline · start/stop"), A],
      ].map(([user, group, policy, sub, color], i) => (
        <g key={user}>
          <Box x={6} y={20 + i * 44} w={68} h={34} label={user} size={11} />
          <Arrow x1={74} y1={37 + i * 44} x2={96} y2={37 + i * 44} />
          <Box x={96} y={20 + i * 44} w={106} h={34} label={group} stroke={color} size={11} />
          <Arrow x1={202} y1={37 + i * 44} x2={218} y2={37 + i * 44} />
          <Box x={218} y={20 + i * 44} w={138} h={34} label={policy} sub={sub} stroke={color} size={9.5} />
        </g>
      ))}
      <text x={180} y={166} textAnchor="middle" fontSize={9.5} fill={R}>{t("ec2:TerminateInstances нигде не разрешён → неявный deny", "ec2:TerminateInstances is allowed nowhere → implicit deny")}</text>
    </Svg>
  ),
};

void [A, Arrow, B, Box, Device, F, G, R, S, Svg, V, Wrap];
