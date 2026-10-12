import { A, Arrow, B, Box, Device, F, G, R, S, Svg, V, type Draw } from "./kit";

/** Схемы лекции 5 Computer Networks: имена с префиксом «cn5-», в конспекте — «@diagram cn5-…». */
export const diagrams: Record<string, Draw> = {
  /* Заголовок IPv4: по 32 бита в строке, поля, о которых спрашивают на экзамене, подсвечены. */
  "cn5-ipv4-header": (t) => {
    const rows: [label: string, bits: number, color: string, sub?: string][][] = [
      [["Version", 4, V, "4"], ["IHL", 4, B, "4"], ["DS (DSCP + ECN)", 8, A, "8 · QoS"], ["Total Length", 16, B, "16"]],
      [["Identification", 16, B, "16"], ["Flags", 3, B, "3"], ["Fragment Offset", 13, B, "13"]],
      [["TTL", 8, R, t("8 · −1 на хоп", "8 · −1 per hop")], ["Protocol", 8, S, "8 · 1/6/17"], ["Header Checksum", 16, G, t("16 · только заголовок", "16 · header only")]],
      [[t("IPv4-адрес источника", "Source IPv4 address"), 32, V, "32"]],
      [[t("IPv4-адрес назначения", "Destination IPv4 address"), 32, V, "32"]],
    ];
    return (
      <Svg h={214} label={t("Поля заголовка IPv4", "IPv4 header fields")}>
        {[0, 8, 16, 24].map((b) => <text key={b} x={20 + b * 10} y={14} fontSize={8} fill="currentColor" opacity={0.6}>{b}</text>)}
        <text x={340} y={14} textAnchor="end" fontSize={8} fill="currentColor" opacity={0.6}>31</text>
        {rows.flatMap((row, r) => {
          let bit = 0;
          return row.map(([label, bits, color, sub]) => {
            const x = 20 + bit * 10, w = bits * 10, y = 20 + r * 28;
            bit += bits;
            return (
              <g key={`${r}-${label}`}>
                <rect x={x} y={y} width={w} height={26} fill={color === B ? F : color} fillOpacity={color === B ? 1 : 0.28} stroke={B} />
                <text x={x + w / 2} y={y + 12} textAnchor="middle" fontSize={bits < 8 ? 7.5 : 8.5} fontWeight={600} fill="currentColor">{label}</text>
                {sub && <text x={x + w / 2} y={y + 22} textAnchor="middle" fontSize={7} fill="currentColor" opacity={0.7}>{sub}</text>}
              </g>
            );
          });
        })}
        <rect x={20} y={160} width={320} height={20} fill="none" stroke={B} strokeDasharray="4 3" />
        <text x={180} y={174} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.7}>{t("Options + Padding — редко", "Options + Padding — rarely used")}</text>
        <text x={180} y={196} textAnchor="middle" fontSize={9} fill="currentColor">{t("строка = 4 байта (32 бита) · без опций заголовок = 20 байт", "row = 4 bytes (32 bits) · no options = 20-byte header")}</text>
        <text x={180} y={209} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.75}>{t("Protocol: 1 ICMP · 6 TCP · 17 UDP · версия 0100 = IPv4", "Protocol: 1 ICMP · 6 TCP · 17 UDP · version 0100 = IPv4")}</text>
      </Svg>
    );
  },

  /* Хост решает: адрес назначения в своей сети — напрямую, иначе — шлюзу по умолчанию. */
  "cn5-host-decision": (t) => (
    <Svg h={236} label={t("Хост решает: своя сеть или шлюз по умолчанию", "A host decides: local network or default gateway")}>
      <Box x={70} y={6} w={220} h={40} label="PC1 · 192.168.10.10 /24" sub={t("пакет для адреса D", "packet for address D")} size={11} />
      <Arrow x1={180} y1={46} x2={180} y2={62} />
      <Box x={30} y={62} w={300} h={44} label={t("Сеть D совпадает с моей сетью?", "Is D on my network?")} sub={t("IPv4: свой адрес + маска · IPv6: префикс из RA", "IPv4: own address + mask · IPv6: prefix from RA")} stroke={A} size={11} />
      <Arrow x1={110} y1={106} x2={90} y2={136} color={G} />
      <Arrow x1={250} y1={106} x2={270} y2={136} color={V} />
      <text x={84} y={124} textAnchor="end" fontSize={9.5} fontWeight={700} fill={G}>{t("да", "yes")}</text>
      <text x={276} y={124} fontSize={9.5} fontWeight={700} fill={V}>{t("нет", "no")}</text>
      <Box x={8} y={136} w={166} h={50} label={t("Локальный хост", "Local host")} sub={t("кадр на MAC самого хоста", "frame to the host's own MAC")} stroke={G} size={11} />
      <Box x={186} y={136} w={166} h={50} label={t("Удалённый хост", "Remote host")} sub={t("кадр на MAC шлюза .10.1", "frame to the gateway's MAC")} stroke={V} size={11} />
      <text x={91} y={204} textAnchor="middle" fontSize={9} fill="currentColor">D = 192.168.10.20</text>
      <text x={269} y={204} textAnchor="middle" fontSize={9} fill="currentColor">D = 10.1.1.5</text>
      <text x={180} y={226} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.8}>{t("Шлюза нет или он неверный — наружу не выйти, но LAN работает", "No or wrong gateway — no way out, but the LAN still works")}</text>
    </Svg>
  ),

  /* ARP: запрос — broadcast всем в LAN, ответ — unicast только спросившему. */
  "cn5-arp": (t) => (
    <Svg h={278} label={t("ARP: запрос — broadcast, ответ — unicast", "ARP: the request is a broadcast, the reply is a unicast")}>
      <text x={8} y={14} fontSize={10} fontWeight={700} fill={A}>{t("1. ARP-запрос — broadcast", "1. ARP request — broadcast")}</text>
      <Device x={40} y={64} kind="pc" label="PC-A .10" />
      <Device x={165} y={64} kind="switch" label="" />
      <Device x={312} y={38} kind="pc" label="PC-B .20" />
      <Device x={312} y={98} kind="pc" label="PC-C .30" />
      <Arrow x1={58} y1={62} x2={141} y2={62} color={A} />
      <Arrow x1={189} y1={58} x2={294} y2={40} color={A} />
      <Arrow x1={189} y1={70} x2={294} y2={96} color={A} />
      <text x={100} y={50} textAnchor="middle" fontSize={8} fontFamily="monospace" fill={A}>FF-FF-FF-FF-FF-FF</text>
      <text x={312} y={79} textAnchor="middle" fontSize={8} fontWeight={600} fill={G}>{t("это мой IP!", "that's my IP!")}</text>
      <text x={312} y={138} textAnchor="middle" fontSize={8} fill="currentColor" opacity={0.7}>{t("не мой IP — молчит", "not my IP — silent")}</text>
      <text x={8} y={116} fontSize={9} fill="currentColor">{t("«Кто 192.168.1.20?", "\"Who has 192.168.1.20?")}</text>
      <text x={8} y={128} fontSize={9} fill="currentColor">{t("Ответь 192.168.1.10»", "Tell 192.168.1.10\"")}</text>
      <line x1={8} y1={152} x2={352} y2={152} stroke={B} strokeDasharray="4 3" />
      <text x={8} y={170} fontSize={10} fontWeight={700} fill={G}>{t("2. ARP-ответ — unicast", "2. ARP reply — unicast")}</text>
      <Device x={40} y={212} kind="pc" label="PC-A .10" />
      <Device x={165} y={212} kind="switch" label="" />
      <Device x={312} y={212} kind="pc" label="PC-B .20" />
      <Arrow x1={296} y1={210} x2={189} y2={210} color={G} />
      <Arrow x1={141} y1={210} x2={58} y2={210} color={G} />
      <text x={242} y={200} textAnchor="middle" fontSize={8} fill={G}>{t("MAC назн. = PC-A", "dst MAC = PC-A")}</text>
      <text x={100} y={200} textAnchor="middle" fontSize={8} fill={G}>{t("«.20 — это BB-BB-…»", "\".20 is at BB-BB-…\"")}</text>
      <text x={180} y={258} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.8}>{t("PC-A кладёт 192.168.1.20 → BB-BB-… в ARP-кэш", "PC-A caches 192.168.1.20 → BB-BB-…")}</text>
      <text x={180} y={271} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.8}>{t("broadcast маршрутизатор не пропускает — он остаётся в LAN", "routers don't pass the broadcast — it stays in the LAN")}</text>
    </Svg>
  ),
};
