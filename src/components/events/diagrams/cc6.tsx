import { A, Arrow, B, Box, F, G, R, S, Svg, V, Wrap, type Draw } from "./kit";

/** Схемы лекции «cc6»: имена с префиксом «cc6-», в конспекте — «@diagram cc6-…». */
export const diagrams: Record<string, Draw> = {
  "cc6-cost-drivers": (t) => (
    <Svg h={196} label={t("Три драйвера стоимости AWS: вычисления, хранение, передача данных", "Three drivers of AWS cost: compute, storage, data transfer")}>
      {[
        [t("Вычисления", "Compute"), t("за час / секунду", "per hour / second"), S],
        [t("Хранение", "Storage"), t("за ГБ в месяц", "per GB-month"), G],
        [t("Передача данных", "Data transfer"), t("исходящая — за ГБ", "outbound — per GB"), A],
      ].map(([label, sub, c], i) => (
        <Box key={i} x={6 + i * 118} y={10} w={112} h={48} label={label} sub={sub} stroke={c} size={11} />
      ))}
      <Box x={8} y={92} w={98} h={60} label={t("Интернет", "Internet")} sub={t("пользователи", "users")} />
      <Box x={254} y={92} w={98} h={60} label="AWS" sub={t("регион", "Region")} stroke={V} />
      <text x={180} y={102} textAnchor="middle" fontSize={9.5} fill={G}>{t("вход — обычно бесплатно", "inbound — usually free")}</text>
      <Arrow x1={108} y1={110} x2={252} y2={110} color={G} />
      <Arrow x1={252} y1={134} x2={108} y2={134} color={R} />
      <text x={180} y={150} textAnchor="middle" fontSize={9.5} fill={R}>{t("выход — $ за ГБ", "outbound — $ per GB")}</text>
      <text x={180} y={182} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.75}>{t("счёт AWS ≈ вычисления + хранение + исходящий трафик", "AWS bill ≈ compute + storage + outbound transfer")}</text>
    </Svg>
  ),
  "cc6-support-plans": (t) => (
    <Svg h={222} label={t("Планы AWS Support: от Basic до Enterprise", "AWS Support plans: from Basic to Enterprise")}>
      {[
        ["Basic", t("бесплатно; нет тех. обращений", "free; no tech cases"), B],
        ["Developer", t("e-mail в рабочие часы; <12ч", "business-hours email; <12h"), S],
        ["Business", t("24/7 телефон; <1ч; весь Trusted Advisor", "24/7 phone; <1h; full Trusted Advisor"), G],
        ["Ent. On-Ramp", t("пул TAM; <30мин", "pool of TAMs; <30min"), A],
        ["Enterprise", t("свой TAM, Concierge; <15мин", "own TAM, Concierge; <15min"), V],
      ].map(([name, sub, c], i) => {
        const h = 30 + i * 22;
        const x = 6 + i * 70.4;
        return (
          <g key={name}>
            <rect x={x} y={150 - h} width={66} height={h} rx={6} fill={F} stroke={c} strokeWidth={1.5} />
            <text x={x + 33} y={150 - h + 16} textAnchor="middle" fontSize={9} fontWeight={700} fill="currentColor">{name}</text>
            <Wrap x={x + 33} y={166} text={sub} max={13} size={8.5} gap={10} />
          </g>
        );
      })}
      <line x1={4} y1={150} x2={356} y2={150} stroke="currentColor" opacity={0.4} />
      <text x={180} y={214} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.75}>{t("выше ступень — быстрее ответ и больше проактивной помощи", "higher step — faster response, more proactive help")}</text>
    </Svg>
  ),
  "cc6-region-azs": (t) => (
    <Svg h={262} label={t("Регион AWS, зоны доступности и точки присутствия", "AWS Region, Availability Zones and points of presence")}>
      <rect x={6} y={6} width={348} height={150} rx={14} fill="none" stroke={V} strokeDasharray="6 4" />
      <text x={18} y={22} fontSize={11} fontWeight={700} fill={V}>AWS Region — us-east-1</text>
      {["a", "b", "c"].map((s, k) => (
        <g key={s}>
          <rect x={20 + k * 110} y={32} width={100} height={78} rx={10} fill={F} stroke={S} />
          <text x={70 + k * 110} y={47} textAnchor="middle" fontSize={10} fontWeight={600} fill={S}>{"AZ us-east-1" + s}</text>
          {[0, 1].map((d) => (
            <g key={d}>
              <rect x={34 + k * 110 + d * 40} y={56} width={32} height={44} rx={3} fill="none" stroke="currentColor" opacity={0.6} />
              {[0, 1, 2].map((r) => <line key={r} x1={38 + k * 110 + d * 40} y1={66 + r * 11} x2={62 + k * 110 + d * 40} y2={66 + r * 11} stroke="currentColor" opacity={0.5} />)}
            </g>
          ))}
        </g>
      ))}
      <line x1={120} y1={71} x2={130} y2={71} stroke={G} strokeWidth={3} />
      <line x1={230} y1={71} x2={240} y2={71} stroke={G} strokeWidth={3} />
      <text x={180} y={126} textAnchor="middle" fontSize={9} fill="currentColor">{t("AZ = 1+ дата-центров: своё питание, генераторы, охлаждение, ИБП", "AZ = 1+ data centers: own power, generators, cooling, UPS")}</text>
      <text x={180} y={142} textAnchor="middle" fontSize={9} fill={G}>{t("зелёное — быстрые частные каналы с низкой задержкой", "green — fast private low-latency links between AZs")}</text>
      <Arrow x1={180} y1={156} x2={180} y2={176} color={A} />
      <Box x={105} y={176} w={150} h={28} label="Regional edge cache" stroke={A} size={10} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <Arrow x1={180} y1={204} x2={50 + i * 130} y2={220} color={A} dashed />
          <Box x={10 + i * 130} y={220} w={80} h={22} label="edge location" size={9} />
        </g>
      ))}
      <text x={180} y={256} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.75}>{t("CloudFront и Route 53 отвечают пользователям из edge locations", "CloudFront and Route 53 serve users from edge locations")}</text>
    </Svg>
  ),
};
