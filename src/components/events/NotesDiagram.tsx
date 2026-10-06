import type { ReactNode } from "react";

/**
 * Схемы для конспектов — рукописный SVG, без картинок и библиотек.
 *
 * Цвета берутся из темы (currentColor и переменные), поэтому схемы одинаково
 * читаются в тёмной и светлой теме и переводятся вместе с текстом: подписи
 * приходят парой ru/en. Новая схема — новая функция в реестре ниже и строка
 * «@diagram имя» в конспекте.
 */

type L = (ru: string, en: string) => string;
const V = "#a78bfa"; // violet-400
const G = "#34d399"; // emerald-400
const A = "#fbbf24"; // amber-400
const S = "#38bdf8"; // sky-400
const R = "#f87171"; // red-400
const F = "var(--color-surface-2)";
const B = "var(--color-border-strong)";

function Box({ x, y, w, h, label, sub, fill = F, stroke = B, size = 12 }: { x: number; y: number; w: number; h: number; label: string; sub?: string; fill?: string; stroke?: string; size?: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill={fill} stroke={stroke} strokeWidth={1.5} />
      <text x={x + w / 2} y={y + h / 2 + (sub ? -3 : 4)} textAnchor="middle" fontSize={size} fontWeight={600} fill="currentColor">{label}</text>
      {sub && <text x={x + w / 2} y={y + h / 2 + 11} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.7}>{sub}</text>}
    </g>
  );
}
function Arrow({ x1, y1, x2, y2, color = "currentColor", dashed = false }: { x1: number; y1: number; x2: number; y2: number; color?: string; dashed?: boolean }) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const hx = x2 - 8 * Math.cos(a), hy = y2 - 8 * Math.sin(a);
  return (
    <g stroke={color} fill={color} strokeWidth={1.5}>
      <line x1={x1} y1={y1} x2={hx} y2={hy} strokeDasharray={dashed ? "4 3" : undefined} />
      <polygon points={`${x2},${y2} ${hx - 4 * Math.sin(a)},${hy + 4 * Math.cos(a)} ${hx + 4 * Math.sin(a)},${hy - 4 * Math.cos(a)}`} stroke="none" />
    </g>
  );
}
function Device({ x, y, kind, label }: { x: number; y: number; kind: "pc" | "router" | "switch" | "server" | "cloud" | "hub"; label: string }) {
  return (
    <g>
      {kind === "pc" && <><rect x={x - 14} y={y - 12} width={28} height={18} rx={3} fill={F} stroke="currentColor" strokeWidth={1.5} /><rect x={x - 8} y={y + 8} width={16} height={3} fill="currentColor" /></>}
      {kind === "server" && <><rect x={x - 11} y={y - 14} width={22} height={28} rx={3} fill={F} stroke="currentColor" strokeWidth={1.5} /><line x1={x - 7} y1={y - 6} x2={x + 7} y2={y - 6} stroke="currentColor" /><line x1={x - 7} y1={y} x2={x + 7} y2={y} stroke="currentColor" /></>}
      {kind === "router" && <><circle cx={x} cy={y} r={14} fill={F} stroke={V} strokeWidth={1.5} /><path d={`M${x - 7} ${y - 3}h10M${x + 3} ${y - 3}l-3-3M${x + 3} ${y - 3}l-3 3M${x + 7} ${y + 3}h-10M${x - 3} ${y + 3}l3-3M${x - 3} ${y + 3}l3 3`} stroke={V} strokeWidth={1.5} fill="none" /></>}
      {kind === "switch" && <><rect x={x - 22} y={y - 9} width={44} height={18} rx={4} fill={F} stroke={S} strokeWidth={1.5} /><path d={`M${x - 14} ${y - 3}h8l-2-2M${x - 6} ${y - 3}l-2 2M${x + 14} ${y + 3}h-8l2-2M${x + 6} ${y + 3}l2 2`} stroke={S} strokeWidth={1.5} fill="none" /></>}
      {kind === "hub" && <rect x={x - 18} y={y - 7} width={36} height={14} rx={3} fill={F} stroke={A} strokeWidth={1.5} />}
      {kind === "cloud" && <path d={`M${x - 30} ${y + 8}a12 12 0 0 1 4-23a16 16 0 0 1 30-6a13 13 0 0 1 22 10a11 11 0 0 1-4 19z`} fill={F} stroke="currentColor" strokeWidth={1.5} />}
      <text x={x} y={y + 28} textAnchor="middle" fontSize={10} fill="currentColor">{label}</text>
    </g>
  );
}
/** Подпись в несколько строк: SVG сам текст не переносит. */
function Wrap({ x, y, text, max = 18, size = 9, opacity = 0.8, gap = 11 }: { x: number; y: number; text: string; max?: number; size?: number; opacity?: number; gap?: number }) {
  const lines: string[] = [];
  for (const word of text.split(" ")) {
    const last = lines[lines.length - 1];
    if (last && (last + " " + word).length <= max) lines[lines.length - 1] = last + " " + word;
    else lines.push(word);
  }
  return <>{lines.map((l, i) => <text key={i} x={x} y={y + i * gap} textAnchor="middle" fontSize={size} fill="currentColor" opacity={opacity}>{l}</text>)}</>;
}
const Svg = ({ h, label, children }: { h: number; label: string; children: ReactNode }) => (
  <figure className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
    <svg viewBox={`0 0 360 ${h}`} role="img" aria-label={label} className="h-auto w-full text-[var(--color-fg)]" fontFamily="inherit">{children}</svg>
  </figure>
);

/* ────────────────────────  Схемы  ──────────────────────── */

const DIAGRAMS: Record<string, (t: L) => ReactNode> = {
  "network-components": (t) => (
    <Svg h={120} label={t("Компоненты сети", "Network components")}>
      <Device x={40} y={40} kind="pc" label={t("Клиент", "Client")} />
      <Device x={130} y={40} kind="switch" label={t("Коммутатор", "Switch")} />
      <Device x={230} y={40} kind="router" label={t("Маршрутизатор", "Router")} />
      <Device x={320} y={40} kind="server" label={t("Сервер", "Server")} />
      <line x1={54} y1={38} x2={108} y2={38} stroke="currentColor" strokeWidth={1.5} /><line x1={152} y1={38} x2={216} y2={38} stroke="currentColor" strokeWidth={1.5} /><line x1={244} y1={38} x2={309} y2={38} stroke="currentColor" strokeWidth={1.5} />
      <text x={6} y={100} textAnchor="start" fontSize={10} fill={G}>{t("конечное", "end device")}</text>
      <text x={180} y={100} textAnchor="middle" fontSize={10} fill={V}>{t("промежуточные устройства", "intermediary devices")}</text>
      <text x={354} y={100} textAnchor="end" fontSize={10} fill={G}>{t("конечное", "end device")}</text>
      <text x={180} y={115} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.7}>{t("линии — среда передачи: медь, оптика, радио", "lines — the media: copper, fiber, wireless")}</text>
    </Svg>
  ),
  "lan-wan": (t) => (
    <Svg h={130} label={t("LAN, WAN и интернет", "LAN, WAN and the internet")}>
      <rect x={6} y={10} width={120} height={90} rx={12} fill="none" stroke={G} strokeDasharray="5 4" /><text x={66} y={24} textAnchor="middle" fontSize={11} fill={G} fontWeight={600}>LAN A</text>
      <rect x={234} y={10} width={120} height={90} rx={12} fill="none" stroke={G} strokeDasharray="5 4" /><text x={294} y={24} textAnchor="middle" fontSize={11} fill={G} fontWeight={600}>LAN B</text>
      <Device x={36} y={56} kind="pc" label="PC" /><Device x={96} y={56} kind="router" label="R1" />
      <Device x={264} y={56} kind="router" label="R2" /><Device x={324} y={56} kind="server" label="Srv" />
      <line x1={50} y1={54} x2={82} y2={54} stroke="currentColor" strokeWidth={1.5} /><line x1={278} y1={54} x2={313} y2={54} stroke="currentColor" strokeWidth={1.5} />
      <Device x={180} y={60} kind="cloud" label="" /><text x={180} y={58} textAnchor="middle" fontSize={11} fontWeight={600} fill="currentColor">WAN</text>
      <line x1={110} y1={54} x2={150} y2={54} stroke={V} strokeWidth={1.5} /><line x1={210} y1={54} x2={250} y2={54} stroke={V} strokeWidth={1.5} />
      <text x={180} y={118} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.75}>{t("LAN — одна организация, малая территория · WAN — провайдеры, соединяет LAN", "LAN — one organization, small area · WAN — providers, interconnects LANs")}</text>
    </Svg>
  ),
  "ios-modes": (t) => (
    <Svg h={150} label={t("Режимы Cisco IOS", "Cisco IOS modes")}>
      <Box x={8} y={10} w={100} h={38} label="Switch>" sub={t("польз. EXEC", "user EXEC")} />
      <Box x={130} y={10} w={100} h={38} label="Switch#" sub={t("привилег. EXEC", "privileged EXEC")} stroke={V} />
      <Box x={252} y={10} w={100} h={38} label="(config)#" sub={t("глобальная конф.", "global config")} stroke={G} />
      <Box x={130} y={100} w={100} h={38} label="(config-line)#" sub={t("линии", "line")} stroke={A} size={11} />
      <Box x={252} y={100} w={100} h={38} label="(config-if)#" sub={t("интерфейс", "interface")} stroke={A} size={11} />
      <Arrow x1={108} y1={22} x2={130} y2={22} /><text x={119} y={8} textAnchor="middle" fontSize={8} fill="currentColor">enable</text>
      <Arrow x1={230} y1={22} x2={252} y2={22} /><text x={241} y={8} textAnchor="middle" fontSize={8} fill="currentColor">conf t</text>
      <Arrow x1={252} y1={40} x2={230} y2={40} dashed /><text x={241} y={58} textAnchor="middle" fontSize={8} fill="currentColor">exit</text>
      <Arrow x1={290} y1={48} x2={290} y2={100} /><text x={322} y={78} textAnchor="middle" fontSize={9} fill="currentColor">interface …</text>
      <Arrow x1={270} y1={48} x2={200} y2={100} /><text x={212} y={78} textAnchor="middle" fontSize={9} fill="currentColor">line …</text>
      <Arrow x1={130} y1={119} x2={60} y2={48} color={V} dashed /><text x={70} y={92} textAnchor="middle" fontSize={9} fill={V}>end / Ctrl+Z</text>
    </Svg>
  ),
  "config-files": (t) => (
    <Svg h={110} label={t("Файлы конфигурации", "Configuration files")}>
      <Box x={6} y={14} w={160} h={54} label="running-config" sub={t("RAM · теряется без питания", "RAM · lost on power-off")} stroke={R} size={13} />
      <Box x={194} y={14} w={160} h={54} label="startup-config" sub={t("NVRAM · переживает reload", "NVRAM · survives a reboot")} stroke={G} size={13} />
      <Arrow x1={166} y1={30} x2={194} y2={30} color={G} /><text x={180} y={10} textAnchor="middle" fontSize={8} fill={G}>copy run start</text>
      <Arrow x1={194} y1={54} x2={166} y2={54} dashed /><text x={180} y={78} textAnchor="middle" fontSize={8} fill="currentColor">reload</text>
      <text x={180} y={96} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.75}>{t("Изменения действуют сразу, но живут в RAM, пока не сохранены", "Changes apply immediately but live in RAM until saved")}</text>
    </Svg>
  ),
  encapsulation: (t) => (
    <Svg h={190} label={t("Инкапсуляция и PDU", "Encapsulation and PDUs")}>
      {[
        [t("Данные", "Data"), "HTTP", 7, G], [t("Сегмент", "Segment"), "TCP", 4, S], [t("Пакет", "Packet"), "IP", 3, V], [t("Кадр", "Frame"), "Ethernet", 2, A],
      ].map(([name, proto, layer, color], i) => (
        <g key={i}>
          <text x={8} y={24 + i * 36} fontSize={11} fontWeight={600} fill="currentColor">{name}</text>
          <text x={8} y={36 + i * 36} fontSize={9} fill="currentColor" opacity={0.7}>L{layer} · {proto}</text>
          <rect x={90 + (3 - i) * 0} y={10 + i * 36} width={262} height={26} rx={6} fill="none" stroke={B} />
          {Array.from({ length: i }, (_, k) => <rect key={k} x={92 + k * 36} y={12 + i * 36} width={32} height={22} rx={4} fill={[A, V, S][3 - i + k] as string} opacity={0.85} />)}
          <rect x={92 + i * 36} y={12 + i * 36} width={258 - i * 36 - (i === 3 ? 36 : 0)} height={22} rx={4} fill={color as string} opacity={0.35} />
          {i === 3 && <rect x={316} y={12 + i * 36} width={34} height={22} rx={4} fill={A} opacity={0.85} />}
          {i === 3 && <text x={333} y={27 + i * 36} textAnchor="middle" fontSize={8} fill="currentColor">FCS</text>}
        </g>
      ))}
      <text x={8} y={172} fontSize={11} fontWeight={600} fill="currentColor">{t("Биты", "Bits")}</text>
      <text x={90} y={172} fontSize={11} fill="currentColor" fontFamily="monospace">0110100101 1010010110 0101…</text>
      <text x={180} y={186} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.7}>{t("вниз — каждый уровень добавляет заголовок; вверх — снимает", "down — each layer adds a header; up — strips it")}</text>
    </Svg>
  ),
  "osi-tcpip": (t) => (
    <Svg h={200} label={t("Модели OSI и TCP/IP", "OSI and TCP/IP models")}>
      {["7 Application", "6 Presentation", "5 Session", "4 Transport", "3 Network", "2 Data Link", "1 Physical"].map((name, i) => (
        <Box key={name} x={8} y={6 + i * 26} w={150} h={22} label={name} stroke={i < 3 ? G : i === 3 ? S : i === 4 ? V : A} size={11} />
      ))}
      {[["Application", 0, 3, G], ["Transport", 3, 1, S], ["Internet", 4, 1, V], ["Network Access", 5, 2, A]].map(([name, from, span, color]) => (
        <Box key={name as string} x={176} y={6 + (from as number) * 26} w={100} h={(span as number) * 26 - 4} label={name as string} stroke={color as string} size={11} />
      ))}
      {[[t("данные", "data"), 1], ["segment", 3], ["packet", 4], ["frame", 5], [t("биты", "bits"), 6]].map(([pdu, row]) => (
        <text key={pdu as string} x={290} y={6 + (row as number) * 26 + 15} fontSize={10} fill="currentColor" fontFamily="monospace">{pdu as string}</text>
      ))}
      <text x={290} y={192} fontSize={9} fill="currentColor" opacity={0.7}>PDU</text>
      <text x={83} y={192} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.7}>OSI</text>
      <text x={226} y={192} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.7}>TCP/IP</text>
    </Svg>
  ),
  "address-journey": (t) => (
    <Svg h={150} label={t("IP не меняется, MAC меняется на каждом участке", "IP stays the same, MAC changes at every hop")}>
      <Device x={30} y={40} kind="pc" label="PC1" /><Device x={130} y={40} kind="router" label="R1" /><Device x={230} y={40} kind="router" label="R2" /><Device x={330} y={40} kind="server" label="Web" />
      <Arrow x1={46} y1={38} x2={114} y2={38} color={A} /><Arrow x1={146} y1={38} x2={214} y2={38} color={A} /><Arrow x1={246} y1={38} x2={316} y2={38} color={A} />
      <text x={80} y={30} textAnchor="middle" fontSize={9} fill={A}>MAC: PC1 → R1</text><text x={180} y={30} textAnchor="middle" fontSize={9} fill={A}>MAC: R1 → R2</text><text x={281} y={30} textAnchor="middle" fontSize={9} fill={A}>MAC: R2 → Web</text>
      <rect x={20} y={84} width={320} height={26} rx={8} fill={V} opacity={0.2} /><text x={180} y={101} textAnchor="middle" fontSize={11} fontWeight={600} fill="currentColor">IP: 192.168.1.110 → 172.16.1.99 {t("— одинаково на всём пути", "— the same all the way")}</text>
      <text x={180} y={132} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.75}>{t("Уровень 2 — локальная доставка на участке; уровень 3 — от начала до конца", "Layer 2 — local delivery per link; Layer 3 — end to end")}</text>
    </Svg>
  ),
  topologies: (t) => (
    <Svg h={120} label={t("Топологии LAN", "LAN topologies")}>
      <Device x={60} y={50} kind="switch" label="" />
      {[[20, 14], [100, 14], [20, 92], [100, 92]].map(([x, y], i) => <g key={i}><line x1={60} y1={50} x2={x} y2={y} stroke="currentColor" /><circle cx={x} cy={y} r={6} fill={G} /></g>)}
      <text x={60} y={112} textAnchor="middle" fontSize={11} fontWeight={600} fill="currentColor">{t("Звезда", "Star")}</text>
      <line x1={140} y1={50} x2={230} y2={50} stroke="currentColor" strokeWidth={2} /><rect x={136} y={44} width={4} height={12} fill={R} /><rect x={230} y={44} width={4} height={12} fill={R} />
      {[155, 185, 215].map((x) => <g key={x}><line x1={x} y1={50} x2={x} y2={30} stroke="currentColor" /><circle cx={x} cy={26} r={6} fill={G} /></g>)}
      <text x={185} y={112} textAnchor="middle" fontSize={11} fontWeight={600} fill="currentColor">{t("Шина", "Bus")}</text>
      <circle cx={300} cy={52} r={30} fill="none" stroke="currentColor" />
      {[0, 72, 144, 216, 288].map((deg) => <circle key={deg} cx={300 + 30 * Math.cos((deg * Math.PI) / 180)} cy={52 + 30 * Math.sin((deg * Math.PI) / 180)} r={6} fill={G} />)}
      <text x={300} y={112} textAnchor="middle" fontSize={11} fontWeight={600} fill="currentColor">{t("Кольцо", "Ring")}</text>
    </Svg>
  ),
  "ethernet-frame": (t) => (
    <Svg h={110} label={t("Поля кадра Ethernet", "Ethernet frame fields")}>
      {[["Preamble", 7, 44, B], ["SFD", 1, 22, B], [t("MAC назн.", "Dst MAC"), 6, 50, V], [t("MAC источн.", "Src MAC"), 6, 50, V], ["Type", 2, 30, S], [t("Данные", "Data"), "46–1500", 100, G], ["FCS", 4, 36, A]].reduce<{ x: number; nodes: ReactNode[] }>((acc, [name, bytes, w, color]) => {
        acc.nodes.push(
          <g key={name as string}>
            <rect x={acc.x} y={20} width={w as number} height={34} fill={color as string} opacity={color === B ? 0.5 : 0.35} stroke={B} />
            <text x={acc.x + (w as number) / 2} y={34} textAnchor="middle" fontSize={8} fontWeight={600} fill="currentColor">{name as string}</text>
            <text x={acc.x + (w as number) / 2} y={47} textAnchor="middle" fontSize={8} fill="currentColor" opacity={0.8}>{bytes as string} {typeof bytes === "number" ? "B" : ""}</text>
          </g>,
        );
        acc.x += w as number;
        return acc;
      }, { x: 14, nodes: [] }).nodes}
      <line x1={80} y1={66} x2={346} y2={66} stroke="currentColor" /><line x1={80} y1={62} x2={80} y2={70} stroke="currentColor" /><line x1={346} y1={62} x2={346} y2={70} stroke="currentColor" />
      <text x={213} y={80} textAnchor="middle" fontSize={9} fill="currentColor">{t("размер кадра 64–1518 байт (преамбула не считается)", "frame size 64–1518 bytes (preamble not counted)")}</text>
      <text x={180} y={100} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.7}>{t("Type 0x0800 = IPv4 · FCS = CRC, обнаружение ошибок", "Type 0x0800 = IPv4 · FCS = CRC, error detection")}</text>
    </Svg>
  ),
  "mac-address": (t) => (
    <Svg h={90} label={t("Строение MAC-адреса", "MAC address structure")}>
      {["00", "1A", "2B", "3C", "4D", "5E"].map((b, i) => (
        <g key={i}><rect x={20 + i * 54} y={14} width={48} height={30} rx={6} fill={i < 3 ? V : G} opacity={0.3} stroke={i < 3 ? V : G} /><text x={44 + i * 54} y={34} textAnchor="middle" fontSize={14} fontFamily="monospace" fontWeight={600} fill="currentColor">{b}</text></g>
      ))}
      <text x={101} y={62} textAnchor="middle" fontSize={10} fill={V} fontWeight={600}>OUI — {t("производитель (выдаёт IEEE)", "vendor (assigned by IEEE)")}</text>
      <text x={263} y={62} textAnchor="middle" fontSize={10} fill={G} fontWeight={600}>{t("номер от производителя", "vendor-assigned")}</text>
      <text x={180} y={80} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.7}>48 {t("бит = 12 hex-цифр = 6 байт", "bits = 12 hex digits = 6 bytes")}</text>
    </Svg>
  ),
  "switch-forwarding": (t) => (
    <Svg h={200} label={t("Как коммутатор пересылает кадр", "How a switch forwards a frame")}>
      <Device x={110} y={92} kind="switch" label="" />
      {[[36, 30, "PC-A", 1, -16], [184, 30, "PC-B", 2, -16], [36, 150, "PC-C", 3, 26], [184, 150, "PC-D", 4, 26]].map(([x, y, n, p, dy]) => (
        <g key={n as string}>
          <line x1={110} y1={92} x2={x as number} y2={y as number} stroke="currentColor" opacity={0.35} />
          <Device x={x as number} y={y as number} kind="pc" label="" />
          <text x={x as number} y={(y as number) + (dy as number)} textAnchor="middle" fontSize={10} fill="currentColor">{n as string} · {t("порт", "port")} {p as number}</text>
        </g>
      ))}
      <Arrow x1={50} y1={40} x2={92} y2={82} color={A} />
      <Arrow x1={128} y1={82} x2={170} y2={40} color={G} /><Arrow x1={128} y1={102} x2={170} y2={140} color={R} dashed /><Arrow x1={92} y1={102} x2={50} y2={140} color={R} dashed />
      <rect x={236} y={24} width={116} height={70} rx={8} fill={F} stroke={B} />
      <text x={294} y={40} textAnchor="middle" fontSize={10} fontWeight={600} fill="currentColor">{t("Таблица MAC", "MAC table")}</text>
      <text x={246} y={58} fontSize={10} fontFamily="monospace" fill="currentColor">AA:AA → 1</text><text x={246} y={74} fontSize={10} fontFamily="monospace" fill="currentColor">BB:BB → 2</text>
      <text x={294} y={88} textAnchor="middle" fontSize={8} fill="currentColor" opacity={0.7}>{t("учится по источнику", "learns from the source")}</text>
      <text x={294} y={116} textAnchor="middle" fontSize={9} fill={G}>{t("известный → в один порт", "known → one port")}</text>
      <text x={294} y={130} textAnchor="middle" fontSize={9} fill={R}>{t("неизвестный → всем, кроме входа", "unknown → all but ingress")}</text>
      <text x={180} y={195} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.7}>{t("A шлёт B: B известен — только порт 2; будь B неизвестен — порты 2, 3, 4", "A sends to B: B known — port 2 only; B unknown — ports 2, 3, 4")}</text>
    </Svg>
  ),
  "binary-weights": (t) => (
    <Svg h={100} label={t("Веса битов октета", "Bit weights of an octet")}>
      {[128, 64, 32, 16, 8, 4, 2, 1].map((w, i) => {
        const on = i < 2;
        return (
          <g key={w}>
            <text x={26 + i * 42} y={16} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.7}>{w}</text>
            <rect x={8 + i * 42} y={22} width={36} height={32} rx={6} fill={on ? G : F} opacity={on ? 0.35 : 1} stroke={on ? G : B} />
            <text x={26 + i * 42} y={44} textAnchor="middle" fontSize={16} fontFamily="monospace" fontWeight={700} fill="currentColor">{on ? 1 : 0}</text>
          </g>
        );
      })}
      <text x={180} y={74} textAnchor="middle" fontSize={11} fill="currentColor">11000000 = 128 + 64 = <tspan fontWeight={700}>192</tspan></text>
      <text x={180} y={92} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.7}>{t("единица добавляет вес позиции, ноль — ничего", "a 1 adds the weight of its position, a 0 adds nothing")}</text>
    </Svg>
  ),
  t568: (t) => {
    const colors: Record<string, string> = { O: "#f97316", G: "#22c55e", Bl: "#3b82f6", Br: "#92400e" };
    const A568 = ["wG", "G", "wO", "Bl", "wBl", "O", "wBr", "Br"], B568 = ["wO", "O", "wG", "Bl", "wBl", "G", "wBr", "Br"];
    const Pins = ({ x, order, name }: { x: number; order: string[]; name: string }) => (
      <g>
        <text x={x + 80} y={14} textAnchor="middle" fontSize={11} fontWeight={600} fill="currentColor">{name}</text>
        {order.map((p, i) => {
          const white = p.startsWith("w"), c = colors[p.replace("w", "")];
          return (
            <g key={i}>
              <rect x={x + i * 20} y={22} width={16} height={40} rx={3} fill={white ? "#f4f4f5" : c} stroke={c} strokeWidth={white ? 2 : 0} />
              {white && <rect x={x + i * 20 + 5} y={26} width={6} height={32} fill={c} opacity={0.8} />}
              <text x={x + i * 20 + 8} y={74} textAnchor="middle" fontSize={8} fill="currentColor">{i + 1}</text>
            </g>
          );
        })}
      </g>
    );
    return (
      <Svg h={112} label={t("Порядок проводов T568A и T568B", "T568A and T568B wire order")}>
        <Pins x={12} order={A568} name="T568A" /><Pins x={192} order={B568} name="T568B" />
        <text x={180} y={92} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.75}>{t("A: бело-зелёный первый · B: бело-оранжевый первый", "A: white-green first · B: white-orange first")}</text>
        <text x={180} y={104} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.75}>{t("оба конца одинаковы — прямой, разные — перекрёстный", "same both ends — straight-through, different — crossover")}</text>
      </Svg>
    );
  },
  "cable-choice": (t) => (
    <Svg h={120} label={t("Какой кабель куда", "Which cable where")}>
      <Device x={34} y={30} kind="pc" label="PC" /><Device x={130} y={30} kind="switch" label={t("коммутатор", "switch")} />
      <line x1={50} y1={28} x2={106} y2={28} stroke={G} strokeWidth={3} /><text x={78} y={20} textAnchor="middle" fontSize={9} fill={G}>{t("прямой", "straight")}</text>
      <Device x={230} y={30} kind="switch" label={t("коммутатор", "switch")} /><Device x={324} y={30} kind="switch" label={t("коммутатор", "switch")} />
      <line x1={254} y1={28} x2={300} y2={28} stroke={A} strokeWidth={3} /><text x={277} y={20} textAnchor="middle" fontSize={9} fill={A}>{t("перекрёстный", "crossover")}</text>
      <Device x={34} y={90} kind="pc" label="PC · COM" /><Device x={130} y={90} kind="router" label={t("консоль", "console")} />
      <line x1={50} y1={88} x2={114} y2={88} stroke={S} strokeWidth={3} strokeDasharray="6 3" /><text x={82} y={80} textAnchor="middle" fontSize={9} fill={S}>rollover</text>
      <text x={277} y={92} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.75}>{t("Auto-MDIX включён —", "Auto-MDIX on —")}</text>
      <text x={277} y={106} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.75}>{t("подойдёт любой из двух", "either cable works")}</text>
    </Svg>
  ),
  "fiber-types": (t) => (
    <Svg h={110} label={t("Одномодовое и многомодовое волокно", "Single-mode and multimode fiber")}>
      <rect x={10} y={16} width={160} height={30} rx={15} fill="#eab308" opacity={0.25} stroke="#eab308" /><line x1={16} y1={31} x2={164} y2={31} stroke={R} strokeWidth={1.5} />
      <text x={90} y={62} textAnchor="middle" fontSize={11} fontWeight={600} fill="currentColor">{t("Одномод (SMF)", "Single-mode (SMF)")}</text>
      <text x={90} y={76} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.75}>{t("тонкая сердцевина · лазер · далеко", "small core · laser · long distance")}</text>
      <rect x={190} y={16} width={160} height={30} rx={15} fill="#f97316" opacity={0.25} stroke="#f97316" />
      <path d="M196 31 L244 20 L292 42 L344 24" stroke={R} strokeWidth={1.5} fill="none" /><path d="M196 31 L250 42 L300 20 L344 38" stroke={R} strokeWidth={1.5} fill="none" opacity={0.6} />
      <text x={270} y={62} textAnchor="middle" fontSize={11} fontWeight={600} fill="currentColor">{t("Многомод (MMF)", "Multimode (MMF)")}</text>
      <text x={270} y={76} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.75}>{t("толстая сердцевина · светодиод · 550 м", "large core · LED · up to 550 m")}</text>
      <text x={180} y={98} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.7}>{t("лучи под разными углами расплываются — это дисперсия", "rays at different angles spread out — that is dispersion")}</text>
    </Svg>
  ),
  duplex: (t) => (
    <Svg h={100} label={t("Полудуплекс и полный дуплекс", "Half-duplex and full-duplex")}>
      <Device x={30} y={30} kind="pc" label="A" /><Device x={150} y={30} kind="pc" label="B" />
      <Arrow x1={48} y1={24} x2={132} y2={24} color={A} /><Arrow x1={132} y1={34} x2={48} y2={34} color={A} dashed />
      <text x={90} y={14} textAnchor="middle" fontSize={9} fill={A}>{t("по очереди", "one at a time")}</text>
      <text x={90} y={76} textAnchor="middle" fontSize={11} fontWeight={600} fill="currentColor">{t("Полудуплекс", "Half-duplex")}</text><text x={90} y={90} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.7}>{t("хабы, Wi-Fi, CSMA", "hubs, Wi-Fi, CSMA")}</text>
      <Device x={210} y={30} kind="pc" label="A" /><Device x={330} y={30} kind="pc" label="B" />
      <Arrow x1={228} y1={24} x2={312} y2={24} color={G} /><Arrow x1={312} y1={34} x2={228} y2={34} color={G} />
      <text x={270} y={14} textAnchor="middle" fontSize={9} fill={G}>{t("одновременно", "simultaneously")}</text>
      <text x={270} y={76} textAnchor="middle" fontSize={11} fontWeight={600} fill="currentColor">{t("Полный дуплекс", "Full-duplex")}</text><text x={270} y={90} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.7}>{t("порты коммутатора", "switch ports")}</text>
    </Svg>
  ),
  handshake: (t) => (
    <Svg h={130} label={t("Трёхэтапное рукопожатие TCP", "TCP three-way handshake")}>
      <Device x={50} y={20} kind="pc" label={t("Клиент", "Client")} /><Device x={310} y={20} kind="server" label={t("Сервер", "Server")} />
      <line x1={50} y1={44} x2={50} y2={122} stroke="currentColor" opacity={0.4} /><line x1={310} y1={44} x2={310} y2={122} stroke="currentColor" opacity={0.4} />
      <Arrow x1={56} y1={58} x2={304} y2={66} color={S} /><text x={180} y={56} textAnchor="middle" fontSize={11} fontWeight={600} fill={S}>1. SYN</text>
      <Arrow x1={304} y1={84} x2={56} y2={92} color={V} /><text x={180} y={82} textAnchor="middle" fontSize={11} fontWeight={600} fill={V}>2. SYN-ACK</text>
      <Arrow x1={56} y1={108} x2={304} y2={116} color={G} /><text x={180} y={106} textAnchor="middle" fontSize={11} fontWeight={600} fill={G}>3. ACK</text>
    </Svg>
  ),
  "ports-devices": (t) => (
    <Svg h={110} label={t("Устройства по уровням OSI", "Devices by OSI layer")}>
      {[["L1", t("концентратор", "hub"), t("повторяет биты", "repeats bits"), A], ["L2", t("коммутатор", "switch"), t("по MAC", "by MAC"), S], ["L3", t("маршрутизатор", "router"), t("по IP", "by IP"), V]].map(([layer, name, how, color], i) => (
        <g key={i}>
          <Box x={12 + i * 116} y={10} w={104} h={56} label={`${layer} · ${name}`} sub={how} stroke={color as string} size={11} />
        </g>
      ))}
      <text x={180} y={92} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.75}>{t("чем выше уровень, тем умнее решение и тем больше заголовков читает устройство", "the higher the layer, the smarter the decision and the more headers the device reads")}</text>
    </Svg>
  ),
  "subnet-mask": (t) => (
    <Svg h={100} label={t("Маска подсети и префикс", "Subnet mask and prefix")}>
      {["11111111", "11111111", "11111111", "11000000"].map((o, i) => (
        <g key={i}><rect x={10 + i * 86} y={14} width={80} height={28} rx={6} fill={i < 3 ? V : A} opacity={0.3} stroke={i < 3 ? V : A} /><text x={50 + i * 86} y={33} textAnchor="middle" fontSize={11} fontFamily="monospace" fontWeight={600} fill="currentColor">{o}</text></g>
      ))}
      <text x={180} y={62} textAnchor="middle" fontSize={11} fill="currentColor">255.255.255.192 = 24 + 2 {t("единицы", "ones")} = <tspan fontWeight={700}>/26</tspan></text>
      <text x={180} y={84} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.7}>{t("единицы — сетевая часть, нули — узловая", "ones — network portion, zeros — host portion")}</text>
    </Svg>
  ),

  /* ────────────  Cloud Computing  ──────────── */
  "cc-service-models": (t) => {
    const rows = ["Applications", "Data", "Runtime", "Middleware", "OS", "Virtualization", "Servers", "Storage", "Networking"];
    // Сколько слоёв снизу берёт на себя провайдер в каждой модели.
    const cols: [string, number][] = [["On-premises", 0], ["IaaS", 4], ["PaaS", 7], ["SaaS", 9]];
    return (
      <Svg h={262} label={t("Кто чем управляет в IaaS, PaaS и SaaS", "Who manages what in IaaS, PaaS and SaaS")}>
        {cols.map(([name, provider], c) => (
          <g key={name}>
            <text x={50 + c * 88} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">{name}</text>
            {rows.map((r, i) => {
              const theirs = rows.length - 1 - i < provider;
              return (
                <g key={r}>
                  <rect x={10 + c * 88} y={22 + i * 24} width={80} height={21} rx={4} fill={theirs ? S : G} opacity={theirs ? 0.35 : 0.3} stroke={theirs ? S : G} />
                  <text x={50 + c * 88} y={36 + i * 24} textAnchor="middle" fontSize={8.5} fill="currentColor">{r}</text>
                </g>
              );
            })}
          </g>
        ))}
        <rect x={60} y={246} width={12} height={10} fill={G} opacity={0.5} /><text x={78} y={255} fontSize={9} fill="currentColor">{t("управляешь ты", "you manage")}</text>
        <rect x={200} y={246} width={12} height={10} fill={S} opacity={0.5} /><text x={218} y={255} fontSize={9} fill="currentColor">{t("управляет провайдер", "provider manages")}</text>
      </Svg>
    );
  },
  "cc-deployment-models": (t) => (
    <Svg h={130} label={t("Модели развёртывания облака", "Cloud deployment models")}>
      {[
        ["Public", t("общее для всех, оплата по факту", "shared, pay as you go"), S],
        ["Private", t("одна организация", "one organization"), V],
        ["Hybrid", t("public + private вместе", "public + private together"), A],
        ["Community", t("несколько организаций с общими целями", "orgs with shared concerns"), G],
      ].map(([name, sub, color], i) => (
        <g key={name as string}>
          <Device x={46 + i * 90} y={44} kind="cloud" label="" />
          <text x={46 + i * 90} y={42} textAnchor="middle" fontSize={10} fontWeight={700} fill={color as string}>{name as string}</text>
          <Wrap x={46 + i * 90} y={88} text={sub as string} max={16} />
        </g>
      ))}
    </Svg>
  ),
  "cc-capex-opex": (t) => (
    <Svg h={150} label={t("CapEx против OpEx", "CapEx versus OpEx")}>
      <text x={90} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={R}>CapEx · {t("своё железо", "own hardware")}</text>
      <rect x={20} y={30} width={50} height={90} fill={R} opacity={0.35} /><text x={45} y={136} textAnchor="middle" fontSize={9} fill="currentColor">{t("год 1", "year 1")}</text>
      {[1, 2, 3].map((k) => <rect key={k} x={20 + k * 40} y={110} width={30} height={10} fill={R} opacity={0.25} />)}
      <text x={270} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={G}>OpEx · {t("облако", "cloud")}</text>
      {[40, 55, 35, 70, 60, 45].map((h, k) => <rect key={k} x={200 + k * 24} y={120 - h} width={18} height={h} fill={G} opacity={0.4} />)}
      <text x={270} y={136} textAnchor="middle" fontSize={9} fill="currentColor">{t("платишь помесячно, по использованию", "pay monthly, by usage")}</text>
      <text x={90} y={148} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.7}>{t("большая покупка заранее", "big upfront purchase")}</text>
    </Svg>
  ),
  "cc-hypervisor-types": (t) => (
    <Svg h={190} label={t("Гипервизоры типа 1 и типа 2", "Type 1 and Type 2 hypervisors")}>
      {[["Type 1 · bare metal", 10, false], ["Type 2 · hosted", 190, true]].map(([title, x, hosted]) => {
        const layers = hosted ? ["VM · VM · VM", "Hypervisor", "Host OS", "Hardware"] : ["VM · VM · VM", "Hypervisor", "Hardware"];
        return (
          <g key={title as string}>
            <text x={(x as number) + 80} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">{title as string}</text>
            {layers.map((l, i) => <Box key={l} x={x as number} y={24 + i * 36 + (hosted ? 0 : 18)} w={160} h={30} label={l} stroke={l === "Hypervisor" ? V : l === "Host OS" ? A : l === "Hardware" ? B : G} size={11} />)}
          </g>
        );
      })}
      <text x={90} y={182} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.75}>{t("ESXi, Hyper-V, KVM, Xen — в облаках", "ESXi, Hyper-V, KVM, Xen — used in clouds")}</text>
      <text x={270} y={182} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.75}>{t("VirtualBox, VMware Workstation", "VirtualBox, VMware Workstation")}</text>
    </Svg>
  ),
  "cc-region-az": (t) => (
    <Svg h={170} label={t("Регион, зоны доступности и дата-центры", "Region, availability zones and data centers")}>
      <rect x={8} y={8} width={344} height={124} rx={14} fill="none" stroke={V} strokeDasharray="6 4" />
      <text x={20} y={24} fontSize={11} fontWeight={700} fill={V}>{t("Регион (например, eu-central-1)", "Region (e.g. eu-central-1)")}</text>
      {[0, 1, 2].map((k) => (
        <g key={k}>
          <rect x={22 + k * 110} y={36} width={98} height={84} rx={10} fill={F} stroke={S} />
          <text x={71 + k * 110} y={52} textAnchor="middle" fontSize={10} fontWeight={600} fill={S}>AZ {String.fromCharCode(97 + k)}</text>
          {[0, 1].map((d) => <g key={d}><rect x={34 + k * 110 + d * 40} y={62} width={34} height={46} rx={3} fill="none" stroke="currentColor" opacity={0.6} />{[0, 1, 2].map((r) => <line key={r} x1={38 + k * 110 + d * 40} y1={72 + r * 12} x2={64 + k * 110 + d * 40} y2={72 + r * 12} stroke="currentColor" opacity={0.5} />)}</g>)}
        </g>
      ))}
      <line x1={120} y1={78} x2={132} y2={78} stroke={G} strokeWidth={2} /><line x1={230} y1={78} x2={242} y2={78} stroke={G} strokeWidth={2} />
      <text x={180} y={150} textAnchor="middle" fontSize={9.5} fill="currentColor">{t("AZ — один или несколько дата-центров; AZ одного региона связаны быстрой сетью", "an AZ is one or more data centers; AZs in a region are linked by fast networks")}</text>
      <text x={180} y={164} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.7}>{t("разнеси копии по AZ — сбой одной не остановит сервис", "spread copies across AZs — one failure won't stop the service")}</text>
    </Svg>
  ),
  "cc-vm-vs-container": (t) => (
    <Svg h={200} label={t("Виртуальные машины против контейнеров", "Virtual machines versus containers")}>
      {[["VMs", 10, ["App A", "App B"], ["Guest OS", "Guest OS"], "Hypervisor"], [t("Контейнеры", "Containers"), 190, ["App A", "App B", "App C"], null, "Container runtime"]].map(([title, x, apps, guest, mid]) => (
        <g key={title as string}>
          <text x={(x as number) + 80} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">{title as string}</text>
          {(apps as string[]).map((a, i, arr) => <Box key={a} x={(x as number) + i * (160 / arr.length)} y={22} w={160 / arr.length - 4} h={26} label={a} stroke={G} size={10} />)}
          {guest && (guest as string[]).map((g, i) => <Box key={i} x={(x as number) + i * 80} y={52} w={76} h={26} label={g} stroke={R} size={10} />)}
          <Box x={x as number} y={guest ? 82 : 52} w={160} h={26} label={mid as string} stroke={V} size={10} />
          <Box x={x as number} y={guest ? 112 : 82} w={160} h={26} label={guest ? "Host OS / bare metal" : "Host OS"} stroke={A} size={10} />
          <Box x={x as number} y={guest ? 142 : 112} w={160} h={26} label="Hardware" size={10} />
        </g>
      ))}
      <text x={270} y={160} textAnchor="middle" fontSize={9} fill={G}>{t("общее ядро ОС: лёгкие, стартуют за секунды", "shared OS kernel: light, start in seconds")}</text>
      <text x={180} y={192} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.75}>{t("у каждой VM своя гостевая ОС — тяжелее, но сильнее изоляция", "each VM has its own guest OS — heavier, but stronger isolation")}</text>
    </Svg>
  ),
  "cc-docker-flow": (t) => (
    <Svg h={130} label={t("От Dockerfile до контейнера", "From Dockerfile to container")}>
      {[["Dockerfile", t("рецепт", "recipe"), B], ["Image", t("шаблон", "template"), S], ["Registry", "Docker Hub", V], ["Container", t("запущен", "running"), G]].map(([n, sub, c], i) => (
        <Box key={n as string} x={6 + i * 89} y={20} w={80} h={46} label={n as string} sub={sub as string} stroke={c as string} size={11} />
      ))}
      {[["build", 0], ["push", 1], ["pull / run", 2]].map(([cmd, i]) => (
        <g key={cmd as string}><Arrow x1={86 + (i as number) * 89} y1={43} x2={95 + (i as number) * 89} y2={43} /><text x={90 + (i as number) * 89} y={84} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="currentColor">docker {cmd as string}</text></g>
      ))}
      <text x={180} y={112} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.75}>{t("один образ → сколько угодно одинаковых контейнеров", "one image → any number of identical containers")}</text>
    </Svg>
  ),
  "cc-scale-up-out": (t) => (
    <Svg h={150} label={t("Вертикальное и горизонтальное масштабирование", "Scaling up and scaling out")}>
      <text x={90} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">{t("Scale up (вертикально)", "Scale up (vertical)")}</text>
      <rect x={50} y={80} width={30} height={30} rx={4} fill={S} opacity={0.35} stroke={S} /><Arrow x1={88} y1={95} x2={104} y2={95} />
      <rect x={110} y={50} width={50} height={60} rx={4} fill={S} opacity={0.35} stroke={S} />
      <text x={90} y={130} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.75}>{t("мощнее одна машина: CPU, RAM", "one bigger machine: CPU, RAM")}</text>
      <text x={270} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">{t("Scale out (горизонтально)", "Scale out (horizontal)")}</text>
      {[0, 1, 2, 3].map((k) => <rect key={k} x={206 + k * 34} y={80} width={28} height={30} rx={4} fill={G} opacity={k ? 0.25 : 0.4} stroke={G} strokeDasharray={k ? "3 2" : undefined} />)}
      <text x={270} y={130} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.75}>{t("больше машин + балансировщик", "more machines + load balancer")}</text>
    </Svg>
  ),
  "cc-kubernetes": (t) => (
    <Svg h={180} label={t("Кластер Kubernetes", "A Kubernetes cluster")}>
      <rect x={6} y={6} width={348} height={150} rx={12} fill="none" stroke={B} />
      <text x={18} y={22} fontSize={10} fontWeight={700} fill="currentColor">{t("Кластер", "Cluster")}</text>
      <Box x={16} y={32} w={90} h={110} label="Control plane" sub={t("API, scheduler", "API, scheduler")} stroke={V} size={10} />
      {[0, 1].map((n) => (
        <g key={n}>
          <rect x={120 + n * 118} y={32} width={110} height={110} rx={8} fill={F} stroke={S} />
          <text x={175 + n * 118} y={48} textAnchor="middle" fontSize={10} fontWeight={600} fill={S}>{t("Узел", "Node")} {n + 1}</text>
          {[0, 1].map((p) => (
            <g key={p}>
              <rect x={128 + n * 118} y={58 + p * 40} width={94} height={34} rx={6} fill={G} opacity={0.2} stroke={G} />
              <text x={136 + n * 118} y={72 + p * 40} fontSize={9} fontWeight={600} fill="currentColor">Pod</text>
              {[0, 1].map((c) => <rect key={c} x={166 + n * 118 + c * 26} y={64 + p * 40} width={22} height={22} rx={3} fill={A} opacity={0.45} />)}
            </g>
          ))}
        </g>
      ))}
      <Arrow x1={106} y1={87} x2={120} y2={87} color={V} />
      <text x={180} y={172} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.75}>{t("под — наименьшая единица: один или несколько контейнеров", "a pod is the smallest unit: one or more containers")}</text>
    </Svg>
  ),
  "cc-storage-types": (t) => (
    <Svg h={170} label={t("Блочное, файловое и объектное хранилище", "Block, file and object storage")}>
      {[
        ["Block", t("тома для одной VM", "volumes for one VM"), "EBS · Azure Disk", S, "blocks"],
        ["File", t("общие папки, NFS/SMB", "shared folders, NFS/SMB"), "EFS · Azure Files", V, "tree"],
        ["Object", t("бакеты, доступ по HTTP", "buckets, HTTP access"), "S3 · Blob · GCS", G, "objects"],
      ].map(([name, sub, ex, c, kind], i) => (
        <g key={name as string}>
          <rect x={8 + i * 118} y={8} width={108} height={150} rx={10} fill={F} stroke={c as string} />
          <text x={62 + i * 118} y={26} textAnchor="middle" fontSize={12} fontWeight={700} fill={c as string}>{name as string}</text>
          {kind === "blocks" && [0, 1, 2, 3, 4, 5].map((k) => <rect key={k} x={26 + (k % 3) * 26} y={40 + Math.floor(k / 3) * 26} width={22} height={22} rx={2} fill={S} opacity={0.4} />)}
          {kind === "tree" && <g stroke={V} fill="none" strokeWidth={1.5}><path d="M146 44h30M156 44v40M156 62h20M156 84h20" /><rect x={176} y={56} width={20} height={12} /><rect x={176} y={78} width={20} height={12} /><rect x={176} y={38} width={20} height={12} /></g>}
          {kind === "objects" && [0, 1, 2].map((k) => <circle key={k} cx={298 + (k - 1) * 22} cy={60 + (k % 2) * 14} r={10} fill={G} opacity={0.4} />)}
          <Wrap x={62 + i * 118} y={108} text={sub as string} max={20} opacity={0.9} />
          <text x={62 + i * 118} y={146} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.65}>{ex as string}</text>
        </g>
      ))}
    </Svg>
  ),
  "cc-vpc": (t) => (
    <Svg h={200} label={t("VPC с публичной и частной подсетью", "A VPC with a public and a private subnet")}>
      <Device x={180} y={18} kind="cloud" label="" /><text x={180} y={20} textAnchor="middle" fontSize={9} fontWeight={600} fill="currentColor">Internet</text>
      <rect x={6} y={44} width={348} height={146} rx={12} fill="none" stroke={V} strokeDasharray="6 4" />
      <text x={16} y={60} fontSize={10} fontWeight={700} fill={V}>VPC 10.0.0.0/16</text>
      <Box x={150} y={46} w={60} h={20} label="IGW" stroke={G} size={10} />
      <rect x={18} y={74} width={156} height={104} rx={8} fill={G} opacity={0.08} stroke={G} />
      <text x={26} y={90} fontSize={9.5} fontWeight={600} fill={G}>{t("Публичная", "Public")} 10.0.1.0/24</text>
      <Box x={30} y={100} w={60} h={30} label="EC2" sub="web" size={10} /><Box x={100} y={100} w={64} h={30} label="NAT GW" stroke={A} size={10} />
      <rect x={186} y={74} width={156} height={104} rx={8} fill={S} opacity={0.08} stroke={S} />
      <text x={194} y={90} fontSize={9.5} fontWeight={600} fill={S}>{t("Частная", "Private")} 10.0.2.0/24</text>
      <Box x={204} y={100} w={60} h={30} label="EC2" sub="app" size={10} /><Box x={274} y={100} w={60} h={30} label="DB" size={10} />
      <Arrow x1={180} y1={66} x2={70} y2={100} color={G} /><Arrow x1={204} y1={124} x2={164} y2={118} color={A} dashed />
      <text x={96} y={160} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.8}>0.0.0.0/0 → IGW</text>
      <text x={264} y={160} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.8}>0.0.0.0/0 → NAT GW</text>
    </Svg>
  ),
  "cc-sg-nacl": (t) => (
    <Svg h={170} label={t("Security group и network ACL", "Security group and network ACL")}>
      <rect x={10} y={10} width={340} height={120} rx={12} fill="none" stroke={A} strokeWidth={2} strokeDasharray="7 4" />
      <text x={22} y={28} fontSize={10.5} fontWeight={700} fill={A}>Network ACL · {t("на подсеть", "per subnet")}</text>
      {[0, 1].map((k) => (
        <g key={k}>
          <rect x={60 + k * 140} y={42} width={110} height={74} rx={10} fill="none" stroke={G} strokeWidth={2} />
          <text x={115 + k * 140} y={58} textAnchor="middle" fontSize={9.5} fontWeight={600} fill={G}>Security group</text>
          <Box x={80 + k * 140} y={66} w={70} h={36} label="EC2" size={11} />
        </g>
      ))}
      <text x={95} y={148} textAnchor="middle" fontSize={9} fill={A}>{t("NACL: stateless, allow + deny, правила по номерам", "NACL: stateless, allow + deny, numbered rules")}</text>
      <text x={265} y={148} textAnchor="middle" fontSize={9} fill={G}>{t("SG: stateful, только allow", "SG: stateful, allow only")}</text>
      <text x={180} y={164} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.7}>{t("SG — на экземпляр (интерфейс)", "SG — per instance (interface)")}</text>
    </Svg>
  ),
  "cc-cdn": (t) => (
    <Svg h={176} label={t("Сеть доставки контента", "Content delivery network")}>
      <Device x={180} y={24} kind="server" label="" />
      <text x={210} y={28} fontSize={10} fill="currentColor">{t("Origin — исходный сервер", "Origin server")}</text>
      {[60, 180, 300].map((x) => (
        <g key={x}>
          <line x1={180} y1={40} x2={x} y2={76} stroke={B} strokeDasharray="4 3" />
          <circle cx={x} cy={90} r={15} fill={V} opacity={0.3} stroke={V} /><text x={x} y={94} textAnchor="middle" fontSize={9} fontWeight={600} fill="currentColor">Edge</text>
          <line x1={x} y1={105} x2={x} y2={118} stroke={G} />
          <Device x={x} y={130} kind="pc" label="" />
        </g>
      ))}
      <text x={180} y={168} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.75}>{t("копия — на ближайшей точке: меньше задержка и нагрузка на origin", "a copy sits at the nearest edge: lower latency, less load on the origin")}</text>
    </Svg>
  ),
  "cc-sdn": (t) => (
    <Svg h={180} label={t("Архитектура SDN", "SDN architecture")}>
      <Box x={40} y={8} w={280} h={34} label={t("Приложения", "Application layer")} sub={t("маршрутизация, безопасность, балансировка", "routing, security, load balancing")} stroke={G} size={11} />
      <Box x={40} y={70} w={280} h={34} label={t("SDN-контроллер · control plane", "SDN controller · control plane")} sub={t("централизованная логика", "centralized logic")} stroke={V} size={11} />
      {[0, 1, 2, 3].map((k) => <Box key={k} x={40 + k * 72} y={134} w={64} h={30} label="Switch" sub="data plane" stroke={S} size={10} />)}
      <Arrow x1={180} y1={42} x2={180} y2={70} /><text x={196} y={60} fontSize={8.5} fill="currentColor" opacity={0.8}>northbound API</text>
      {[0, 1, 2, 3].map((k) => <Arrow key={k} x1={180} y1={104} x2={72 + k * 72} y2={134} color={V} />)}
      <text x={354} y={122} textAnchor="end" fontSize={8.5} fill="currentColor" opacity={0.8}>southbound (OpenFlow)</text>
    </Svg>
  ),
};

export default function NotesDiagram({ name, lang }: { name: string; lang: string }) {
  const draw = DIAGRAMS[name];
  if (!draw) return null;
  const t: L = (ru, en) => (lang === "ru" ? ru : en);
  return <>{draw(t)}</>;
}

export const DIAGRAM_NAMES = Object.keys(DIAGRAMS);
