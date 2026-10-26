import { A, B, F, G, R, S, Svg, V, type Draw } from "./kit";

/** Разбить подпись на строки не длиннее max символов (SVG сам не переносит). */
function split(text: string, max: number): string[] {
  const lines: string[] = [];
  for (const word of text.split(" ")) {
    const last = lines[lines.length - 1];
    if (last && (last + " " + word).length <= max) lines[lines.length - 1] = last + " " + word;
    else lines.push(word);
  }
  return lines;
}

/** Подпись по центру ячейки: строки центрируются по вертикали. */
function Cell({ x, y, w, h, text, size = 8.5, max = 18, stroke = B, fill = F, mono = false, bold = false }: { x: number; y: number; w: number; h: number; text: string; size?: number; max?: number; stroke?: string; fill?: string; mono?: boolean; bold?: boolean }) {
  const lines = split(text, max);
  const gap = size + 2;
  const top = y + h / 2 - ((lines.length - 1) * gap) / 2 + size * 0.35;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6} fill={fill} fillOpacity={fill === F ? 1 : 0.22} stroke={stroke} strokeWidth={1.3} />
      {lines.map((l, i) => (
        <text key={i} x={x + w / 2} y={top + i * gap} textAnchor="middle" fontSize={size} fontWeight={bold ? 700 : 500} fontFamily={mono ? "monospace" : undefined} fill="currentColor">{l}</text>
      ))}
    </g>
  );
}

/** Схемы лекции 7 курса Computer Networks (IPv6, ICMP): имена с префиксом «cn7-», в конспекте — «@diagram cn7-…». */
export const diagrams: Record<string, Draw> = {
  /* GUA: 48 + 16 + 64 бита с разбором адреса R1; ниже для сравнения — LLA. */
  "cn7-gua": (t) => {
    const gua = [
      { x: 20, w: 120, c: V, name: t("Глобальный префикс", "Global routing prefix"), bits: t("48 бит · от ISP", "48 bits · from the ISP"), ex: "2001:db8:acad" },
      { x: 140, w: 56, c: A, name: "Subnet ID", bits: t("16 бит", "16 bits"), ex: ":0001" },
      { x: 196, w: 144, c: G, name: t("ID интерфейса", "Interface ID"), bits: t("64 бита · хост", "64 bits · host"), ex: ":0000:0000:0000:0001" },
    ];
    return (
      <Svg h={238} label={t("Структура GUA и LLA", "Structure of a GUA and an LLA")}>
        <text x={180} y={13} textAnchor="middle" fontSize={9.5} fontWeight={700} fill="currentColor">{t("GUA · 2000::/3: первые биты 001 → начало 2 или 3", "GUA · 2000::/3: first bits 001 → starts with 2 or 3")}</text>
        {gua.map((p) => (
          <g key={p.ex}>
            <text x={p.x + p.w / 2} y={31} textAnchor="middle" fontSize={8} fill="currentColor" opacity={0.75}>{p.bits}</text>
            <rect x={p.x} y={36} width={p.w} height={28} fill={p.c} fillOpacity={0.25} stroke={p.c} strokeWidth={1.4} />
            <text x={p.x + p.w / 2} y={54} textAnchor="middle" fontSize={9} fontWeight={600} fill="currentColor">{p.name}</text>
            <text x={p.x + p.w / 2} y={80} textAnchor="middle" fontSize={8.5} fontFamily="monospace" fill={p.c}>{p.ex}</text>
          </g>
        ))}
        <path d="M20 88v5h176v-5" fill="none" stroke="currentColor" strokeOpacity={0.6} />
        <path d="M196 88v5h144v-5" fill="none" stroke="currentColor" strokeOpacity={0.6} />
        <text x={108} y={106} textAnchor="middle" fontSize={8.5} fill="currentColor">{t("/48 + 16 = /64 — сеть", "/48 + 16 = /64 — network")}</text>
        <text x={268} y={106} textAnchor="middle" fontSize={8.5} fill="currentColor">{t("EUI-64 или случайно", "EUI-64 or random")}</text>
        <text x={180} y={121} textAnchor="middle" fontSize={8} fill="currentColor" opacity={0.7}>{t("R1 G0/0/0: 2001:db8:acad:1::1/64", "R1 G0/0/0: 2001:db8:acad:1::1/64")}</text>
        <line x1={10} y1={131} x2={350} y2={131} stroke={B} strokeDasharray="4 3" />
        <text x={180} y={148} textAnchor="middle" fontSize={9.5} fontWeight={700} fill="currentColor">{t("LLA · fe80::/10: только в своём канале", "LLA · fe80::/10: this link only")}</text>
        <rect x={20} y={156} width={176} height={28} fill={S} fillOpacity={0.25} stroke={S} strokeWidth={1.4} />
        <text x={108} y={174} textAnchor="middle" fontSize={9} fontWeight={600} fill="currentColor">{t("fe80 + нули = 64 бита", "fe80 + zeros = 64 bits")}</text>
        <rect x={196} y={156} width={144} height={28} fill={G} fillOpacity={0.25} stroke={G} strokeWidth={1.4} />
        <text x={268} y={174} textAnchor="middle" fontSize={9} fontWeight={600} fill="currentColor">{t("ID интерфейса", "Interface ID")}</text>
        <text x={108} y={200} textAnchor="middle" fontSize={8.5} fontFamily="monospace" fill={S}>fe80:0000:0000:0000</text>
        <text x={268} y={200} textAnchor="middle" fontSize={8.5} fontFamily="monospace" fill={G}>:7279:b3ff:fe92:3640</text>
        <text x={180} y={220} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.8}>{t("GUA маршрутизируется в интернете · LLA — никогда", "GUA is routed on the internet · LLA never is")}</text>
        <text x={180} y={233} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.8}>{t("LLA маршрутизатора — шлюз по умолчанию для хостов", "the router's LLA is the hosts' default gateway")}</text>
      </Svg>
    );
  },

  /* Три метода RA: откуда хост берёт GUA, DNS и шлюз; шлюз — всегда из RA. */
  "cn7-ra-methods": (t) => {
    const cols = [
      { x: 80, c: G, head: ["1 · SLAAC", ""], gua: t("сам, через SLAAC", "host, via SLAAC"), dns: t("из RA", "from the RA"), flags: "A=1 O=0 M=0" },
      { x: 174, c: A, head: ["2 · SLAAC +", "stateless DHCPv6"], gua: t("сам, через SLAAC", "host, via SLAAC"), dns: "stateless DHCPv6", flags: "A=1 O=1 M=0" },
      { x: 268, c: V, head: ["3 · Stateful", "DHCPv6"], gua: t("stateful DHCPv6-сервер", "stateful DHCPv6 server"), dns: "stateful DHCPv6", flags: "A=0 M=1" },
    ];
    const w = 88;
    const rows = [
      { y: 52, label: "GUA" },
      { y: 90, label: t("DNS, домен", "DNS, domain") },
      { y: 128, label: t("Шлюз", "Gateway") },
      { y: 166, label: t("Флаги RA", "RA flags") },
    ];
    return (
      <Svg h={250} label={t("Три метода RA: SLAAC, SLAAC + stateless DHCPv6, stateful DHCPv6", "Three RA methods: SLAAC, SLAAC + stateless DHCPv6, stateful DHCPv6")}>
        {cols.map((c) => (
          <g key={c.flags}>
            <rect x={c.x} y={6} width={w} height={38} rx={8} fill={c.c} fillOpacity={0.22} stroke={c.c} strokeWidth={1.5} />
            <text x={c.x + w / 2} y={c.head[1] ? 21 : 29} textAnchor="middle" fontSize={9.5} fontWeight={700} fill="currentColor">{c.head[0]}</text>
            {c.head[1] && <text x={c.x + w / 2} y={35} textAnchor="middle" fontSize={8.5} fontWeight={600} fill="currentColor">{c.head[1]}</text>}
          </g>
        ))}
        {rows.map((r) => (
          <text key={r.y} x={8} y={r.y + 19} fontSize={9} fontWeight={700} fill="currentColor">{r.label}</text>
        ))}
        {cols.map((c) => (
          <g key={`cells-${c.flags}`}>
            <Cell x={c.x} y={52} w={w} h={32} text={c.gua} max={16} stroke={c.c} />
            <Cell x={c.x} y={90} w={w} h={32} text={c.dns} max={16} stroke={c.c} />
            <Cell x={c.x} y={166} w={w} h={32} text={c.flags} mono size={8.5} max={20} stroke={c.c} />
          </g>
        ))}
        <Cell x={80} y={128} w={276} h={32} text={t("LLA маршрутизатора = адрес источника RA (во всех трёх)", "router LLA = source address of the RA (all three)")} max={36} stroke={R} fill={R} bold />
        <text x={180} y={216} textAnchor="middle" fontSize={9} fontWeight={600} fill="currentColor">{t("1 RS → 2 RA → 3 DHCPv6 SOLICIT (методы 2 и 3)", "1 RS → 2 RA → 3 DHCPv6 SOLICIT (methods 2 and 3)")}</text>
        <text x={180} y={232} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.75}>{t("DHCPv6 никогда не выдаёт шлюз по умолчанию", "DHCPv6 never hands out the default gateway")}</text>
        <text x={180} y={245} textAnchor="middle" fontSize={8} fill="currentColor" opacity={0.6}>{t("флаги A/O/M — материал CCNA, не со слайдов", "A/O/M flags — CCNA material, not on the slides")}</text>
      </Svg>
    );
  },

  /* EUI-64 по шагам: MAC → вставить ff:fe → инвертировать 7-й бит → ID интерфейса. */
  "cn7-eui64": (t) => {
    const slot = (i: number) => 14 + i * 42;
    const byte = (i: number, y: number, v: string, c?: string) => (
      <g key={`${y}-${i}`}>
        <rect x={slot(i)} y={y} width={38} height={22} rx={4} fill={c ?? F} fillOpacity={c ? 0.28 : 1} stroke={c ?? B} strokeWidth={1.3} />
        <text x={slot(i) + 19} y={y + 15} textAnchor="middle" fontSize={10} fontFamily="monospace" fontWeight={600} fill="currentColor">{v}</text>
      </g>
    );
    const bits = (x0: number, y: number, v: string) =>
      v.split("").map((b, i) => (
        <g key={`${x0}-${i}`}>
          <rect x={x0 + i * 14} y={y} width={14} height={18} fill={i === 6 ? R : F} fillOpacity={i === 6 ? 0.35 : 1} stroke={i === 6 ? R : B} />
          <text x={x0 + i * 14 + 7} y={y + 13} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="currentColor">{b}</text>
        </g>
      ));
    return (
      <Svg h={262} label={t("EUI-64 по шагам: из MAC-адреса в идентификатор интерфейса", "EUI-64 step by step: from a MAC address to an interface ID")}>
        <text x={8} y={14} fontSize={9.5} fontWeight={700} fill="currentColor">{t("1. MAC-адрес — 48 бит", "1. MAC address — 48 bits")}</text>
        {["fc", "99", "47"].map((v, i) => byte(i, 20, v))}
        {["75", "ce", "e0"].map((v, i) => byte(i + 5, 20, v))}
        <rect x={slot(3)} y={20} width={80} height={22} rx={4} fill="none" stroke={A} strokeDasharray="4 3" />
        <text x={slot(3) + 40} y={35} textAnchor="middle" fontSize={8.5} fill={A}>{t("сюда ↓", "here ↓")}</text>
        <text x={8} y={62} fontSize={9.5} fontWeight={700} fill="currentColor">{t("2. Вставить ff:fe в середину", "2. Insert ff:fe in the middle")}</text>
        {["fc", "99", "47"].map((v, i) => byte(i, 68, v))}
        {byte(3, 68, "ff", A)}
        {byte(4, 68, "fe", A)}
        {["75", "ce", "e0"].map((v, i) => byte(i + 5, 68, v))}
        <text x={8} y={110} fontSize={9.5} fontWeight={700} fill="currentColor">{t("3. Инвертировать 7-й бит первого байта", "3. Reverse the 7th bit of the first byte")}</text>
        <text x={36} y={130} textAnchor="end" fontSize={10} fontFamily="monospace" fontWeight={700} fill="currentColor">fc</text>
        {bits(42, 117, "11111100")}
        <text x={166} y={130} fontSize={11} fill="currentColor">→</text>
        <text x={204} y={130} textAnchor="end" fontSize={10} fontFamily="monospace" fontWeight={700} fill={R}>fe</text>
        {bits(210, 117, "11111110")}
        <text x={42 + 6 * 14 + 7} y={148} textAnchor="middle" fontSize={8} fill={R}>{t("7-й", "7th")}</text>
        <text x={210 + 6 * 14 + 7} y={148} textAnchor="middle" fontSize={8} fill={R}>{t("7-й", "7th")}</text>
        <text x={8} y={170} fontSize={9.5} fontWeight={700} fill="currentColor">{t("4. ID интерфейса — 64 бита", "4. Interface ID — 64 bits")}</text>
        {byte(0, 176, "fe", R)}
        {["99", "47"].map((v, i) => byte(i + 1, 176, v))}
        {byte(3, 176, "ff", A)}
        {byte(4, 176, "fe", A)}
        {["75", "ce", "e0"].map((v, i) => byte(i + 5, 176, v))}
        <text x={180} y={220} textAnchor="middle" fontSize={9.5} fontFamily="monospace" fontWeight={600} fill="currentColor">fe99:47ff:fe75:cee0</text>
        <text x={180} y={236} textAnchor="middle" fontSize={8.5} fontFamily="monospace" fill={G}>LLA fe80::fe99:47ff:fe75:cee0</text>
        <text x={180} y={252} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.8}>{t("Быстро: 2-я hex-цифра ±2 (c↔e, 0↔2) · ff:fe в середине", "Shortcut: 2nd hex digit ±2 (c↔e, 0↔2) · ff:fe in the middle")}</text>
      </Svg>
    );
  },
};
