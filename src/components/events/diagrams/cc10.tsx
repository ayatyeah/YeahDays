import { A, Arrow, Box, Device, F, G, S, Svg, V, type Draw } from "./kit";

/** Схемы лекции «cc10»: имена с префиксом «cc10-», в конспекте — «@diagram cc10-…». */
export const diagrams: Record<string, Draw> = {
  /* CloudWatch alarm → SNS (fan-out: email, SMS, SQS) и → EC2 Auto Scaling. */
  "cc10-alarm-flow": (t) => (
    <Svg h={218} label={t("Аларм CloudWatch: уведомление через SNS и масштабирование", "CloudWatch alarm: SNS notification and scaling")}>
      <Box x={4} y={10} w={98} h={44} label={t("Метрика EC2", "EC2 metric")} sub="CPUUtilization" stroke={S} size={10.5} />
      <Arrow x1={102} y1={32} x2={128} y2={32} />
      <Box x={128} y={10} w={104} h={44} label={t("Аларм CloudWatch", "CloudWatch alarm")} sub="CPU > 70%" stroke={V} size={9.5} />
      <Arrow x1={232} y1={32} x2={258} y2={32} color={G} />
      <Box x={258} y={10} w={98} h={44} label="Auto Scaling" sub={t("+1 инстанс", "+1 instance")} stroke={G} size={10.5} />
      <Arrow x1={180} y1={54} x2={180} y2={82} color={A} />
      <text x={186} y={72} fontSize={9} fontWeight={600} fill={A}>ALARM</text>
      <Box x={116} y={82} w={128} h={40} label="SNS topic" sub={t("publish → push всем", "publish → push to all")} stroke={A} size={11} />
      {[60, 180, 300].map((x) => <Arrow key={x} x1={180} y1={122} x2={x} y2={150} color={A} />)}
      <Box x={10} y={150} w={100} h={40} label="Email" sub={t("сразу", "right now")} size={10.5} />
      <Box x={130} y={150} w={100} h={40} label="SMS" sub={t("сразу", "right now")} size={10.5} />
      <Box x={250} y={150} w={100} h={40} label="SQS queue" sub={t("воркер — позже", "worker — later")} stroke={S} size={10.5} />
      <text x={180} y={210} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.8}>{t("SNS толкает сообщение сразу; SQS хранит его, пока воркер не заберёт", "SNS pushes at once; SQS keeps the message until a worker polls it")}</text>
    </Svg>
  ),

  /* Lab 6: ALB в двух публичных подсетях, Auto Scaling group в двух частных. */
  "cc10-alb-asg": (t) => (
    <Svg h={262} label={t("ALB и группа Auto Scaling в двух зонах доступности", "ALB and an Auto Scaling group across two Availability Zones")}>
      <text x={180} y={14} textAnchor="middle" fontSize={9.5} fontWeight={600} fill="currentColor">{t("Пользователи → DNS-имя балансировщика", "Users → the load balancer's DNS name")}</text>
      <Arrow x1={180} y1={20} x2={180} y2={94} color={A} />
      <rect x={4} y={30} width={352} height={210} rx={12} fill="none" stroke={V} strokeDasharray="6 4" />
      <text x={12} y={44} fontSize={9.5} fontWeight={700} fill={V}>VPC 10.0.0.0/16</text>
      {[0, 1].map((k) => (
        <g key={k}>
          <rect x={14 + k * 172} y={50} width={160} height={182} rx={10} fill="none" stroke={S} strokeDasharray="4 3" />
          <text x={94 + k * 172} y={62} textAnchor="middle" fontSize={9} fontWeight={600} fill={S}>{k ? "AZ B" : "AZ A"}</text>
          <rect x={22 + k * 172} y={68} width={144} height={58} rx={8} fill={G} opacity={0.1} stroke={G} />
          <text x={30 + k * 172} y={80} fontSize={8.5} fontWeight={600} fill={G}>{t("Публичная", "Public")} {k ? "10.0.2.0/24" : "10.0.0.0/24"}</text>
          <rect x={22 + k * 172} y={134} width={144} height={90} rx={8} fill={S} opacity={0.08} stroke={S} />
          <text x={30 + k * 172} y={146} fontSize={8.5} fontWeight={600} fill={S}>{t("Частная", "Private")} {k ? "10.0.3.0/24" : "10.0.1.0/24"}</text>
          <Box x={40 + k * 172} y={162} w={50} h={28} label="EC2" size={10} />
          <rect x={100 + k * 172} y={162} width={50} height={28} rx={8} fill={F} stroke={G} strokeWidth={1.5} strokeDasharray="4 3" />
          <text x={125 + k * 172} y={180} textAnchor="middle" fontSize={10} fontWeight={600} fill="currentColor" opacity={0.7}>EC2</text>
          <Arrow x1={k ? 250 : 110} y1={122} x2={65 + k * 172} y2={162} color={A} />
        </g>
      ))}
      <Box x={60} y={94} w={240} h={28} label="Application Load Balancer" sub={t("слушатель HTTP:80 → target group", "listener HTTP:80 → target group")} stroke={A} size={10} />
      <rect x={32} y={156} width={296} height={62} rx={8} fill="none" stroke={G} strokeWidth={1.5} strokeDasharray="7 4" />
      <text x={180} y={210} textAnchor="middle" fontSize={9} fontWeight={600} fill={G}>Auto Scaling group · min 2 · desired 2 · max 6</text>
      <text x={180} y={254} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.8}>{t("пунктир — инстансы, которые target tracking добавит под нагрузкой", "dashed — instances that target tracking adds under load")}</text>
    </Svg>
  ),

  /* Route 53 latency-based routing: каждый пользователь — в регион с наименьшей задержкой. */
  "cc10-latency": (t) => (
    <Svg h={196} label={t("Route 53: маршрутизация по задержке", "Route 53 latency-based routing")}>
      <Box x={120} y={8} w={110} h={40} label="Route 53" sub={t("политика latency", "latency policy")} stroke={V} size={11} />
      <Device x={36} y={84} kind="pc" label={t("Европа", "Europe")} />
      <Device x={36} y={150} kind="pc" label={t("Азия", "Asia")} />
      <Arrow x1={50} y1={74} x2={140} y2={48} dashed color={V} />
      <Arrow x1={50} y1={140} x2={160} y2={48} dashed color={V} />
      <text x={70} y={52} fontSize={8.5} fill={V}>{t("DNS-запрос", "DNS query")}</text>
      <Box x={258} y={8} w={98} h={40} label="us-east-1" sub={t("исходный регион", "original Region")} size={10} />
      <Box x={258} y={64} w={98} h={40} label="eu-central-1" sub={t("Франкфурт", "Frankfurt")} stroke={S} size={10} />
      <Box x={258} y={130} w={98} h={40} label="ap-southeast-1" sub={t("Сингапур", "Singapore")} stroke={G} size={10} />
      <Arrow x1={54} y1={84} x2={258} y2={84} color={S} />
      <Arrow x1={54} y1={150} x2={258} y2={150} color={G} />
      <text x={156} y={80} textAnchor="middle" fontSize={8.5} fill={S}>{t("наименьшая задержка", "lowest latency")}</text>
      <text x={156} y={146} textAnchor="middle" fontSize={8.5} fill={G}>{t("наименьшая задержка", "lowest latency")}</text>
      <text x={180} y={190} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.8}>{t("Route 53 отвечает адресом региона с наименьшей задержкой для этого пользователя", "Route 53 answers with the Region that has the lowest latency for this user")}</text>
    </Svg>
  ),
};
