import type { ReactNode } from "react";
import { A, Arrow, B, Box, Device, F, G, R, S, Svg, V, Wrap, type Draw, type L } from "./diagrams/kit";
import { diagrams as rm1 } from "./diagrams/rm1";
import { diagrams as rm2 } from "./diagrams/rm2";
import { diagrams as rm3 } from "./diagrams/rm3";
import { diagrams as rm4 } from "./diagrams/rm4";
import { diagrams as rm5 } from "./diagrams/rm5";
import { diagrams as rmx } from "./diagrams/rmx";
import { diagrams as cc6 } from "./diagrams/cc6";
import { diagrams as cc7 } from "./diagrams/cc7";
import { diagrams as cc8 } from "./diagrams/cc8";
import { diagrams as cc9 } from "./diagrams/cc9";
import { diagrams as cc10 } from "./diagrams/cc10";

/**
 * Схемы для конспектов — рукописный SVG, без картинок и библиотек.
 *
 * Цвета берутся из темы (currentColor и переменные), поэтому схемы одинаково
 * читаются в тёмной и светлой теме и переводятся вместе с текстом: подписи
 * приходят парой ru/en. Новая схема — новая функция в реестре ниже и строка
 * «@diagram имя» в конспекте.
 */

/* ────────────────────────  Схемы  ──────────────────────── */

const DIAGRAMS: Record<string, Draw> = {
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

  /* ── Защита проекта YeahTrack (Project Management) — цифры из отчёта команды ── */
  "pm-process-groups": (t) => (
    <Svg h={176} label={t("Пять групп процессов и где проект на мидтерме", "Five process groups and where the project is at the midterm")}>
      <rect x={176} y={6} width={92} height={18} rx={9} fill={A} opacity={0.25} stroke={A} />
      <text x={222} y={19} textAnchor="middle" fontSize={9.5} fontWeight={700} fill="currentColor">{t("мы здесь · 5 окт", "we are here · 5 Oct")}</text>
      <Box x={4} y={34} w={80} h={42} label="Initiation" sub={t("готово", "done")} stroke={G} size={10.5} />
      <Box x={92} y={34} w={80} h={42} label="Planning" sub="M1 · 5 Sep" stroke={G} size={10.5} />
      <Box x={180} y={34} w={84} h={42} label="Execution" sub={t("сейчас", "now")} stroke={A} fill={F} size={10.5} />
      <Box x={272} y={34} w={84} h={42} label="Closing" sub="4 Nov" stroke={B} size={10.5} />
      <Arrow x1={84} y1={55} x2={92} y2={55} /><Arrow x1={172} y1={55} x2={180} y2={55} /><Arrow x1={264} y1={55} x2={272} y2={55} />
      <Box x={80} y={100} w={200} h={40} label="Monitoring & controlling" sub={t("сверки, изменения, риски, часы", "check-ins, change log, risks, hours")} stroke={A} size={10.5} />
      <Arrow x1={222} y1={76} x2={222} y2={100} color={A} /><Arrow x1={140} y1={100} x2={140} y2={76} color={A} dashed />
      <text x={180} y={162} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.75}>{t("на мидтерме проект одновременно выполняется и контролируется", "at the midterm the project is executed and controlled at the same time")}</text>
    </Svg>
  ),
  "pm-change-flow": (t) => (
    <Svg h={190} label={t("Семь шагов запроса на изменение", "The seven steps of a change request")}>
      {[["1 Submit", t("issue в GitHub", "GitHub issue")], ["2 Assess", t("влияние · 2 дня", "impact · 2 days")], ["3 Classify", "minor / major"], ["4 Decide", t("кто решает ↓", "who decides ↓")]].map(([l, sub], i) => (
        <Box key={l} x={4 + i * 89} y={10} w={82} h={40} label={l} sub={sub} stroke={i === 3 ? V : B} size={10.5} />
      ))}
      {[0, 1, 2].map((i) => <Arrow key={i} x1={86 + i * 89} y1={30} x2={93 + i * 89} y2={30} />)}
      <Arrow x1={301} y1={50} x2={301} y2={76} />
      {[["5 Baselines", t("обновить scope, WBS…", "update scope, WBS…")], ["6 Implement", t("ветка + PR", "branch + PR")], ["7 Close & log", t("Telegram + журнал", "Telegram + log")]].map(([l, sub], i) => (
        <Box key={l} x={246 - i * 118} y={76} w={110} h={40} label={l} sub={sub} stroke={i === 2 ? G : B} size={10.5} />
      ))}
      <Arrow x1={246} y1={96} x2={238} y2={96} /><Arrow x1={128} y1={96} x2={120} y2={96} />
      <text x={8} y={138} fontSize={9.5} fill="currentColor"><tspan fontWeight={700} fill={G}>minor</tspan>{t(" — меньше 4 ч, вехи и цели на месте:", " — under 4 h, no milestone or objective moves:")}</text>
      <text x={8} y={151} fontSize={9.5} fill="currentColor">{t("владелец области + Ayat, в тот же день", "area owner + Ayat, the same day")}</text>
      <text x={8} y={167} fontSize={9.5} fill="currentColor"><tspan fontWeight={700} fill={R}>major</tspan>{t(" — веха, цель, функция, покупка или 4+ ч: все четверо", " — milestone, objective, feature, purchase or 4+ h: all four")}</text>
      <text x={8} y={182} fontSize={9} fill="currentColor" opacity={0.7}>{t("нет согласия — решает Ayat как владелец дизайна системы", "no agreement — Ayat decides as the owner of the system design")}</text>
    </Svg>
  ),
  "pm-network": (t) => {
    const path: [string, string][] = [["1.1", "1–3 Sep"], ["1.2", "3–5 Sep"], ["2.1", "5–12 Sep"], ["3.1", "12–19 Sep"], ["3.2", t("19 сен–10 окт", "19 Sep–10 Oct")], ["3.3", "3–20 Oct"], ["4.3", t("20 окт–1 ноя", "20 Oct–1 Nov")], ["4.4", "1–4 Nov"]];
    const x = (i: number) => 4 + i * 44.5;
    return (
      <Svg h={200} label={t("Сетевой график и критический путь YeahTrack", "YeahTrack network diagram and critical path")}>
        {path.map(([code, dates], i) => (
          <g key={code}>
            <Wrap x={x(i) + 19} y={14} text={dates} max={7} size={7.5} gap={9} />
            <rect x={x(i)} y={46} width={38} height={30} rx={7} fill={F} stroke={R} strokeWidth={2} />
            <text x={x(i) + 19} y={65} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">{code}</text>
            {i > 0 && <Arrow x1={x(i) - 6.5} y1={61} x2={x(i)} y2={61} color={R} />}
          </g>
        ))}
        <Box x={100} y={112} w={58} h={30} label="3.4" sub="4–5 Oct" stroke={S} size={10} />
        <Box x={170} y={112} w={58} h={30} label="4.1" sub="6–15 Oct" stroke={S} size={10} />
        <Box x={240} y={112} w={58} h={30} label="4.2" sub="13–18 Oct" stroke={S} size={10} />
        <Arrow x1={210} y1={112} x2={x(6) + 12} y2={76} color={S} dashed />
        <Arrow x1={276} y1={112} x2={x(6) + 22} y2={76} color={S} dashed />
        <text x={129} y={156} textAnchor="middle" fontSize={8.5} fill={S}>{t("вне пути", "off the path")}</text>
        <text x={269} y={156} textAnchor="middle" fontSize={8.5} fill={S}>{t("резерв ≈ 2 дня", "float ≈ 2 days")}</text>
        <text x={180} y={178} textAnchor="middle" fontSize={9.5} fontWeight={600} fill={R}>{t("критический путь: 1 сен → 4 ноя", "critical path: 1 Sep → 4 Nov")}</text>
        <text x={180} y={193} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.7}>{t("3.3 стартует 3 окт — на неделю раньше конца 3.2 (перекрытие)", "3.3 starts on 3 Oct — a week before 3.2 ends (overlap)")}</text>
      </Svg>
    );
  },
  "pm-budget": (t) => {
    const items: [string, number][] = [[t("Веб-камеры ×2", "Webcams ×2"), 32580], [t("Кольцевая лампа", "Ring light"), 12238], ["Railway × 3", 6660], [t("Резерв 10%", "Reserve 10%"), 5191], [t("Домен", "Domain"), 435]];
    const labour = 708240, cash = 57104, total = 765344;
    const w = (v: number) => (v / total) * 340;
    return (
      <Svg h={200} label={t("Бюджет YeahTrack: деньги и труд", "YeahTrack budget: cash and labour")}>
        <text x={10} y={14} fontSize={10} fontWeight={700} fill="currentColor">{t("Полная экономическая стоимость — 765 344 ₸", "Total economic cost — 765 344 ₸")}</text>
        <rect x={10} y={22} width={w(cash)} height={22} fill={A} opacity={0.8} />
        <rect x={10 + w(cash)} y={22} width={w(labour)} height={22} fill={V} opacity={0.45} />
        <text x={14 + w(cash)} y={37} fontSize={9.5} fill="currentColor">{t("труд 300 ч — 708 240 ₸ (не платится, вклад студентов)", "labour 300 h — 708 240 ₸ (unpaid, in kind)")}</text>
        <text x={10} y={58} fontSize={9} fill={A}>{t("деньги 57 104 ₸ — платит команда, ≈ 14 276 ₸ с человека", "cash 57 104 ₸ — paid by the team, ≈ 14 276 ₸ each")}</text>
        <text x={10} y={80} fontSize={10} fontWeight={700} fill="currentColor">{t("Из чего 57 104 ₸", "What the 57 104 ₸ is")}</text>
        {items.map(([label, v], i) => (
          <g key={label}>
            <text x={10} y={100 + i * 19} fontSize={9.5} fill="currentColor">{label}</text>
            <rect x={110} y={91 + i * 19} width={Math.max(2, (v / 32580) * 170)} height={12} rx={2} fill={i === 3 ? G : A} opacity={0.75} />
            <text x={286} y={100 + i * 19} fontSize={9.5} fill="currentColor">{v.toLocaleString("ru-RU")} ₸</text>
          </g>
        ))}
        <text x={180} y={196} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.7}>{t("покупки 51 913 ₸ + резерв 5 191 ₸ · курс 444 ₸ за $", "purchases 51 913 ₸ + reserve 5 191 ₸ · 444 ₸ per USD")}</text>
      </Svg>
    );
  },
  "pm-evm": (t) => {
    const pv = [75, 146, 213, 279, 350, 430, 497, 581, 666, 708];
    const px = (wk: number) => 40 + (wk - 1) * 33;
    const py = (v: number) => 150 - (v / 720) * 128;
    return (
      <Svg h={214} label={t("Освоенный объём на мидтерме", "Earned value at the midterm")}>
        <line x1={40} y1={150} x2={344} y2={150} stroke="currentColor" opacity={0.4} />
        <line x1={40} y1={18} x2={40} y2={150} stroke="currentColor" opacity={0.4} />
        {pv.map((_, i) => <text key={i} x={px(i + 1)} y={162} textAnchor="middle" fontSize={8} fill="currentColor" opacity={0.7}>W{i + 1}</text>)}
        <text x={6} y={22} fontSize={8} fill="currentColor" opacity={0.7}>{t("тыс ₸", "k ₸")}</text>
        <polyline points={pv.map((v, i) => `${px(i + 1)},${py(v)}`).join(" ")} fill="none" stroke={V} strokeWidth={2} />
        {pv.map((v, i) => <circle key={i} cx={px(i + 1)} cy={py(v)} r={2.5} fill={V} />)}
        <line x1={px(5)} y1={14} x2={px(5)} y2={150} stroke={A} strokeDasharray="4 3" />
        <text x={px(5) + 4} y={22} fontSize={8.5} fill={A}>{t("мидтерм", "midterm")}</text>
        <circle cx={px(5)} cy={py(350)} r={4} fill={V} />
        <text x={px(5) + 6} y={py(350) + 16} fontSize={8.5} fill={V}>PV = 349 900</text>
        <circle cx={px(5)} cy={py(470)} r={4} fill={G} />
        <text x={px(5) - 8} y={py(470) + 3} textAnchor="end" fontSize={8.5} fill={G}>{t("EV > PV: впереди", "EV > PV: ahead")}</text>
        <Arrow x1={px(5) - 3} y1={py(350) - 4} x2={px(5) - 3} y2={py(470) + 6} color={G} />
        <text x={px(5) - 8} y={py(410) + 6} textAnchor="end" fontSize={8.5} fill={G}>SV &gt; 0</text>
        <text x={px(8) + 4} y={py(581) + 16} fontSize={8.5} fill={V}>PV (BCWS)</text>
        <text x={8} y={180} fontSize={9.5} fill="currentColor">CV = EV − AC · SV = EV − PV · CPI = EV / AC · SPI = EV / PV</text>
        <text x={8} y={196} fontSize={9} fill="currentColor" opacity={0.75}>{t("AC (фактические часы) пока неизвестны точно: журнал часов ведётся с 5 окт", "AC (actual hours) is not known precisely yet: the time log started on 5 Oct")}</text>
        <text x={8} y={209} fontSize={8.5} fill="currentColor" opacity={0.6}>{t("точка EV показывает направление, а не измеренную сумму", "the EV point shows the direction, not a measured amount")}</text>
      </Svg>
    );
  },
  "pm-org-structures": (t) => {
    const tree = (cx: number, top: string, kids: string[], color: string) => (
      <g>
        <Box x={cx - 44} y={30} w={88} h={24} label={top} stroke={color} size={9.5} />
        {kids.map((k, i) => {
          const x = cx - 38 + i * (76 / Math.max(1, kids.length - 1));
          return <g key={k}><line x1={cx} y1={54} x2={x} y2={84} stroke="currentColor" opacity={0.5} /><Box x={x - 18} y={84} w={36} h={22} label={k} size={8} /></g>;
        })}
      </g>
    );
    return (
      <Svg h={190} label={t("Функциональная, матричная и проектная структуры", "Functional, matrix and projectized structures")}>
        <text x={60} y={16} textAnchor="middle" fontSize={10.5} fontWeight={700} fill="currentColor">Functional</text>
        {tree(60, t("Директор", "Director"), ["Dev", "QA", "Web"], B)}
        <Wrap x={60} y={124} text={t("проект делят отделы, у каждого свой начальник", "the project is split across departments, each with its own boss")} max={22} />
        <text x={180} y={16} textAnchor="middle" fontSize={10.5} fontWeight={700} fill="currentColor">Matrix</text>
        {[0, 1, 2].map((c) => <line key={c} x1={150 + c * 30} y1={30} x2={150 + c * 30} y2={104} stroke={B} />)}
        {[0, 1].map((r) => <line key={r} x1={136} y1={50 + r * 34} x2={226} y2={50 + r * 34} stroke={V} strokeWidth={2} />)}
        <text x={180} y={116} textAnchor="middle" fontSize={8.5} fill={V}>{t("PM по горизонтали", "PMs across")}</text>
        <Wrap x={180} y={130} text={t("два начальника: функциональный и проектный", "two bosses: functional and project")} max={22} />
        <rect x={244} y={4} width={112} height={182} rx={10} fill={G} opacity={0.08} stroke={G} />
        <text x={300} y={16} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={G}>Projectized</text>
        {tree(300, "Ayat · lead", ["Yernar", "Akbota", "Aizat"], G)}
        <Wrap x={300} y={124} text={t("наш случай: команда работает только на проект", "our case: the team works only on the project")} max={20} />
        <Wrap x={300} y={160} text={t("спонсор — преподаватель", "sponsor — the instructor")} max={20} opacity={0.65} />
      </Svg>
    );
  },
  "pm-risk-matrix": (t) => {
    const cells: Record<string, string> = { "3-3": "R-01 R-02 R-03", "2-3": "R-04 R-08", "3-2": "R-05 R-06", "2-2": "R-07 R-12", "3-1": "R-11", "1-2": "R-09 R-10" };
    const color = (s: number) => (s >= 6 ? R : s >= 3 ? A : G);
    return (
      <Svg h={206} label={t("Матрица рисков YeahTrack: вероятность × влияние", "YeahTrack risk matrix: probability × impact")}>
        {[3, 2, 1].map((p, row) => [1, 2, 3].map((i, col) => {
          const score = p * i;
          return (
            <g key={`${p}-${i}`}>
              <rect x={70 + col * 94} y={8 + row * 48} width={90} height={44} rx={6} fill={color(score)} opacity={0.18} stroke={color(score)} />
              <text x={70 + col * 94 + 84} y={8 + row * 48 + 13} textAnchor="end" fontSize={9} fontWeight={700} fill={color(score)}>{score}</text>
              {cells[`${p}-${i}`] && <Wrap x={70 + col * 94 + 45} y={8 + row * 48 + 26} text={cells[`${p}-${i}`]} max={10} size={9.5} opacity={1} gap={12} />}
            </g>
          );
        }))}
        {["3", "2", "1"].map((p, row) => <text key={p} x={60} y={34 + row * 48} textAnchor="end" fontSize={10} fill="currentColor">P {p}</text>)}
        {["1", "2", "3"].map((i, col) => <text key={i} x={115 + col * 94} y={164} textAnchor="middle" fontSize={10} fill="currentColor">I {i}</text>)}
        <text x={8} y={84} fontSize={9} fill="currentColor" opacity={0.7} transform="rotate(-90 14 84)">{t("вероятность", "probability")}</text>
        <text x={210} y={178} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.7}>{t("влияние", "impact")}</text>
        <text x={180} y={198} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.75}>{t("6–9: на каждой встрече · 3–4: на вехах · 1–2: при изменении условий", "6–9: every weekly meeting · 3–4: each milestone · 1–2: if conditions change")}</text>
      </Svg>
    );
  },

  /* ── Computer Vision ── */
  "cv-image-array": (t) => (
    <Svg h={176} label={t("Изображение в OpenCV — массив высота × ширина × 3 (BGR)", "An OpenCV image — a height × width × 3 array (BGR)")}>
      {([[2, "R", R], [1, "G", G], [0, "B", S]] as const).map(([k, name, color]) => (
        <g key={name}>
          <rect x={20 + k * 14} y={30 - k * 12} width={96} height={96} fill={F} stroke={color} strokeWidth={1.8} />
          <text x={20 + k * 14 + 100} y={30 - k * 12 + 10} fontSize={10} fontWeight={700} fill={color}>{name}</text>
        </g>
      ))}
      {[1, 2, 3, 4, 5].map((i) => <g key={i} opacity={0.35}><line x1={20 + i * 16} y1={30} x2={20 + i * 16} y2={126} stroke="currentColor" /><line x1={20} y1={30 + i * 16} x2={116} y2={30 + i * 16} stroke="currentColor" /></g>)}
      <rect x={52} y={62} width={16} height={16} fill={A} opacity={0.6} />
      <text x={68} y={142} textAnchor="middle" fontSize={9} fill="currentColor">{t("ширина (столбцы x) →", "width (columns x) →")}</text>
      <text x={10} y={78} fontSize={9} fill="currentColor" transform="rotate(-90 10 78)" textAnchor="middle">{t("высота (строки y)", "height (rows y)")}</text>
      <text x={170} y={36} fontSize={10.5} fontWeight={700} fill="currentColor">img.shape = (h, w, 3)</text>
      <text x={170} y={52} fontSize={9.5} fill="currentColor">dtype uint8 · 0–255</text>
      <text x={170} y={72} fontSize={9.5} fill={A}>img[y, x] = [B, G, R]</text>
      <text x={170} y={86} fontSize={9.5} fill={A}>= [12, 200, 34]</text>
      <text x={170} y={108} fontSize={9.5} fill="currentColor">{t("cv2.imread → порядок BGR,", "cv2.imread → BGR order,")}</text>
      <text x={170} y={121} fontSize={9.5} fill="currentColor">{t("не RGB", "not RGB")}</text>
      <text x={170} y={142} fontSize={9.5} fill={S}>BGR2GRAY → (h, w)</text>
      <text x={180} y={168} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.7}>{t("индекс сначала строка (y), потом столбец (x)", "index the row (y) first, then the column (x)")}</text>
    </Svg>
  ),
  "cv-pipeline": (t) => {
    const rows: [string, string, string][] = [
      ["cv2.imread('cat.jpg')", "(h, w, 3) · BGR", B],
      ["cv2.resize(img, (224, 224))", "(224, 224, 3)", S],
      ["cvtColor(…, COLOR_BGR2GRAY)", t("(224, 224) · 1 канал", "(224, 224) · 1 channel"), V],
      ["GaussianBlur(gray, (5, 5), 0)", t("(224, 224) · меньше шума", "(224, 224) · less noise"), G],
      ["cv2.Canny(blur, 100, 200)", t("(224, 224) · края 0/255", "(224, 224) · edges 0/255"), A],
    ];
    return (
      <Svg h={190} label={t("Пайплайн OpenCV и форма массива на каждом шаге", "An OpenCV pipeline and the array shape after each step")}>
        {rows.map(([call, shape, color], i) => (
          <g key={call}>
            <rect x={6} y={6 + i * 34} width={196} height={26} rx={7} fill={F} stroke={color} strokeWidth={1.5} />
            <text x={14} y={23 + i * 34} fontSize={9.5} fontFamily="ui-monospace, monospace" fill="currentColor">{call}</text>
            <Arrow x1={204} y1={19 + i * 34} x2={222} y2={19 + i * 34} />
            <text x={228} y={23 + i * 34} fontSize={9.5} fontWeight={600} fill={color}>{shape}</text>
            {i < rows.length - 1 && <line x1={104} y1={32 + i * 34} x2={104} y2={40 + i * 34} stroke="currentColor" opacity={0.4} />}
          </g>
        ))}
        <text x={180} y={184} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.7}>{t("resize берёт (ширина, высота); после серого и Canny цвета нет", "resize takes (width, height); after gray and Canny the colour is gone")}</text>
      </Svg>
    );
  },
  "cv-knn": (t) => {
    const a: [number, number][] = [[60, 50], [90, 80], [70, 120], [120, 40], [100, 135]];
    const b: [number, number][] = [[200, 70], [230, 110], [182, 120], [250, 60], [215, 140], [168, 118]];
    const qx = 150, qy = 98;
    return (
      <Svg h={190} label={t("kNN: k = 1 и k = 3 дают разный ответ", "kNN: k = 1 and k = 3 give different answers")}>
        <circle cx={qx} cy={qy} r={13} fill="none" stroke={V} strokeDasharray="4 3" />
        <circle cx={qx} cy={qy} r={42} fill="none" stroke={A} strokeDasharray="4 3" />
        {a.map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={6} fill={S} opacity={0.8} />)}
        {b.map(([x, y]) => <polygon key={`${x}-${y}`} points={`${x},${y - 7} ${x - 6},${y + 5} ${x + 6},${y + 5}`} fill={R} opacity={0.8} />)}
        <circle cx={140} cy={92} r={6} fill={S} opacity={0.8} />
        <text x={qx} y={qy + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill={A}>?</text>
        <text x={266} y={30} fontSize={9} fill={V}>k = 1:</text>
        <text x={266} y={43} fontSize={9} fontWeight={700} fill={S}>{t("круг", "circle")}</text>
        <text x={266} y={66} fontSize={9} fill={A}>{t("k = 3: 2 треуг.", "k = 3: 2 triangles")}</text>
        <text x={266} y={79} fontSize={9} fill={A}>{t("и 1 круг →", "+ 1 circle →")}</text>
        <text x={266} y={92} fontSize={9} fontWeight={700} fill={R}>{t("треугольник", "triangle")}</text>
        <text x={180} y={168} textAnchor="middle" fontSize={9} fill="currentColor">L1 = Σ|I₁ − I₂| · L2 = √Σ(I₁ − I₂)²</text>
        <text x={180} y={182} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.7}>{t("k и метрика — гиперпараметры: подбираются на validation", "k and the metric are hyperparameters: tune them on validation")}</text>
      </Svg>
    );
  },
  "cv-data-split": (t) => (
    <Svg h={180} label={t("Train, validation, test и кросс-валидация", "Train, validation, test and cross-validation")}>
      <text x={8} y={14} fontSize={10} fontWeight={700} fill="currentColor">{t("2 000 изображений · 70 / 15 / 15", "2 000 images · 70 / 15 / 15")}</text>
      <rect x={8} y={22} width={240} height={26} fill={S} opacity={0.35} stroke={S} /><text x={128} y={39} textAnchor="middle" fontSize={10} fill="currentColor">train · 1 400</text>
      <rect x={248} y={22} width={52} height={26} fill={A} opacity={0.35} stroke={A} /><text x={274} y={39} textAnchor="middle" fontSize={9} fill="currentColor">val · 300</text>
      <rect x={300} y={22} width={52} height={26} fill={R} opacity={0.35} stroke={R} /><text x={326} y={39} textAnchor="middle" fontSize={9} fill="currentColor">test · 300</text>
      <text x={8} y={68} fontSize={10} fontWeight={700} fill="currentColor">{t("5-fold cross-validation (на train + val)", "5-fold cross-validation (on train + val)")}</text>
      {[0, 1, 2, 3, 4].map((r) => (
        <g key={r}>
          {[0, 1, 2, 3, 4].map((c) => <rect key={c} x={8 + c * 58} y={76 + r * 15} width={56} height={12} fill={c === r ? A : S} opacity={c === r ? 0.55 : 0.25} />)}
          <text x={300} y={86 + r * 15} fontSize={8.5} fill="currentColor">{t(`раунд ${r + 1}`, `round ${r + 1}`)}</text>
        </g>
      ))}
      <text x={180} y={168} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.75}>{t("test трогаем один раз в самом конце; делим по классам (stratified)", "touch the test set once, at the very end; split per class (stratified)")}</text>
    </Svg>
  ),
  "cv-linear": (t) => {
    const col = (x: number, vals: string[], color: string, w = 26) => (
      <g>
        <rect x={x} y={20} width={w} height={vals.length * 22 + 6} rx={4} fill="none" stroke={color} strokeWidth={1.5} />
        {vals.map((v, i) => <text key={i} x={x + w / 2} y={38 + i * 22} textAnchor="middle" fontSize={11} fill="currentColor">{v}</text>)}
      </g>
    );
    return (
      <Svg h={160} label={t("Линейный классификатор s = Wx + b на числах варианта 1", "The linear classifier s = Wx + b with the Variant 1 numbers")}>
        <rect x={6} y={20} width={64} height={72} rx={4} fill="none" stroke={V} strokeWidth={1.5} />
        {[["1", "2"], ["−1", "1"], ["2", "−1"]].map((r, i) => r.map((v, j) => <text key={`${i}${j}`} x={22 + j * 30} y={38 + i * 22} textAnchor="middle" fontSize={11} fill="currentColor">{v}</text>))}
        <text x={38} y={110} textAnchor="middle" fontSize={10} fontWeight={700} fill={V}>W (3×2)</text>
        <text x={80} y={60} fontSize={13} fill="currentColor">×</text>
        <g transform="translate(0, 22)">{col(92, ["2", "−1"], S)}</g>
        <text x={105} y={110} textAnchor="middle" fontSize={10} fontWeight={700} fill={S}>x</text>
        <text x={128} y={60} fontSize={13} fill="currentColor">+</text>
        {col(142, ["0", "1", "−1"], A)}
        <text x={155} y={110} textAnchor="middle" fontSize={10} fontWeight={700} fill={A}>b</text>
        <text x={178} y={60} fontSize={13} fill="currentColor">=</text>
        {col(194, ["0", "−2", "4"], G, 30)}
        <text x={209} y={110} textAnchor="middle" fontSize={10} fontWeight={700} fill={G}>s</text>
        <text x={236} y={38} fontSize={9.5} fill="currentColor">Cat: 2 − 2 + 0 = 0</text>
        <text x={236} y={60} fontSize={9.5} fill="currentColor">Dog: −2 − 1 + 1 = −2</text>
        <text x={236} y={82} fontSize={9.5} fontWeight={700} fill={G}>Bird: 4 + 1 − 1 = 4</text>
        <text x={180} y={136} textAnchor="middle" fontSize={10} fontWeight={600} fill={G}>{t("argmax(s) = 2 → Bird", "argmax(s) = 2 → Bird")}</text>
        <text x={180} y={152} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.7}>{t("строка W — шаблон класса, b — сдвиг оценки класса", "a row of W is a class template, b shifts that class's score")}</text>
      </Svg>
    );
  },
  "cv-softmax": (t) => {
    const rows: [string, string, string, string][] = [["cat", "3.2", "24.5", "0.13"], ["car", "5.1", "164.0", "0.87"], ["frog", "−1.7", "0.18", "0.00"]];
    return (
      <Svg h={170} label={t("Softmax и cross-entropy на примере из лекции", "Softmax and cross-entropy on the lecture example")}>
        {[t("класс", "class"), t("оценка s", "score s"), "exp(s)", t("вероятность", "probability")].map((h, i) => <text key={h} x={40 + i * 86} y={16} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={[B, V, A, G][i]}>{h}</text>)}
        {rows.map((r, i) => r.map((v, j) => <text key={`${i}${j}`} x={40 + j * 86} y={40 + i * 22} textAnchor="middle" fontSize={11} fontWeight={i === 0 && j === 3 ? 700 : 400} fill="currentColor">{v}</text>))}
        {[1, 2].map((j) => <Arrow key={j} x1={66 + j * 86} y1={58} x2={96 + j * 86} y2={58} color={B} />)}
        <text x={212} y={112} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.8}>{t("сумма 188.68", "sum 188.68")}</text>
        <text x={298} y={112} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.8}>{t("сумма = 1", "sum = 1")}</text>
        <text x={180} y={136} textAnchor="middle" fontSize={10.5} fill="currentColor">{t("верный класс cat: L = −log(0.13) = 2.04", "true class cat: L = −log(0.13) = 2.04")}</text>
        <text x={180} y={156} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.7}>{t("оценки — любые числа; вероятности в (0, 1); argmax не меняется", "scores are any real numbers; probabilities are in (0, 1); argmax is unchanged")}</text>
      </Svg>
    );
  },
  "cv-overfitting": (t) => {
    const train = [40, 58, 70, 79, 85, 89, 92, 94, 95, 95.5];
    const val = [38, 52, 60, 64, 65, 64.5, 63.5, 63, 62.5, 62];
    const px = (i: number) => 40 + i * 32;
    const py = (v: number) => 150 - (v - 30) * 1.75;
    return (
      <Svg h={186} label={t("Переобучение: train растёт, validation падает", "Overfitting: train keeps rising, validation drops")}>
        <line x1={40} y1={150} x2={340} y2={150} stroke="currentColor" opacity={0.4} /><line x1={40} y1={14} x2={40} y2={150} stroke="currentColor" opacity={0.4} />
        <polyline points={train.map((v, i) => `${px(i)},${py(v)}`).join(" ")} fill="none" stroke={S} strokeWidth={2} />
        <polyline points={val.map((v, i) => `${px(i)},${py(v)}`).join(" ")} fill="none" stroke={R} strokeWidth={2} />
        <text x={px(9) - 4} y={py(95.5) - 6} textAnchor="end" fontSize={9.5} fill={S}>train 95%</text>
        <text x={px(9) - 4} y={py(62) + 14} textAnchor="end" fontSize={9.5} fill={R}>validation 62%</text>
        <line x1={px(4)} y1={14} x2={px(4)} y2={150} stroke={G} strokeDasharray="4 3" />
        <text x={px(4) + 4} y={24} fontSize={8.5} fill={G}>early stopping</text>
        <Arrow x1={px(8) + 10} y1={py(94)} x2={px(8) + 10} y2={py(63)} color={A} />
        <text x={px(8) + 4} y={py(78)} textAnchor="end" fontSize={8.5} fill={A}>{t("разрыв", "gap")}</text>
        <text x={190} y={164} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.7}>{t("эпохи обучения →", "training epochs →")}</text>
        <text x={180} y={180} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.75}>{t("лечат: больше данных и аугментация, регуляризация, проще модель", "fixes: more data and augmentation, regularization, a simpler model")}</text>
      </Svg>
    );
  },
  "cv-neuron": (t) => (
    <Svg h={140} label={t("Искусственный нейрон", "An artificial neuron")}>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <circle cx={30} cy={30 + i * 36} r={13} fill={F} stroke={S} strokeWidth={1.5} />
          <text x={30} y={34 + i * 36} textAnchor="middle" fontSize={10} fill="currentColor">x{i + 1}</text>
          <Arrow x1={44} y1={30 + i * 36} x2={140} y2={66} color={S} />
          <text x={86} y={[40, 60, 100][i]} fontSize={9} fill={V}>w{i + 1}</text>
        </g>
      ))}
      <circle cx={162} cy={66} r={22} fill={F} stroke={V} strokeWidth={1.5} />
      <text x={162} y={70} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">Σ + b</text>
      <text x={162} y={104} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.8}>z = w·x + b</text>
      <Arrow x1={184} y1={66} x2={214} y2={66} />
      <Box x={214} y={50} w={64} h={32} label="g(z)" sub="ReLU, σ" stroke={G} size={11} />
      <Arrow x1={278} y1={66} x2={306} y2={66} />
      <text x={326} y={70} textAnchor="middle" fontSize={11} fontWeight={700} fill={G}>a</text>
      <text x={180} y={130} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.75}>{t("без нелинейности g слои схлопываются в один линейный классификатор", "without the non-linearity g the layers collapse into one linear classifier")}</text>
    </Svg>
  ),
  "cv-backprop-gates": (t) => {
    const gate = (x: number, y: number, name: string, color: string, inA: string, inB: string, gA: string, gB: string, rule: string) => (
      <g>
        <circle cx={x + 80} cy={y + 32} r={15} fill={F} stroke={color} strokeWidth={1.5} />
        <text x={x + 80} y={y + 36} textAnchor="middle" fontSize={11} fontWeight={700} fill={color}>{name}</text>
        <line x1={x + 10} y1={y + 16} x2={x + 66} y2={y + 28} stroke="currentColor" opacity={0.5} /><line x1={x + 10} y1={y + 48} x2={x + 66} y2={y + 36} stroke="currentColor" opacity={0.5} />
        <line x1={x + 95} y1={y + 32} x2={x + 150} y2={y + 32} stroke="currentColor" opacity={0.5} />
        <text x={x + 8} y={y + 12} fontSize={9} fill="currentColor">{inA}</text><text x={x + 8} y={y + 60} fontSize={9} fill="currentColor">{inB}</text>
        <text x={x + 30} y={y + 22} fontSize={9} fill={R}>{gA}</text><text x={x + 30} y={y + 52} fontSize={9} fill={R}>{gB}</text>
        <text x={x + 122} y={y + 26} fontSize={9} fill={R}>↑ 2</text>
        <text x={x + 80} y={y + 74} textAnchor="middle" fontSize={8.5} fill={color}>{rule}</text>
      </g>
    );
    return (
      <Svg h={176} label={t("Как градиент проходит через гейты", "How the gradient flows through gates")}>
        {gate(4, 4, "+", S, "x = 3", "y = −4", "2", "2", t("add: копирует градиент", "add: distributes the gradient"))}
        {gate(184, 4, "×", V, "x = 3", "y = −4", "−8", "6", t("mul: меняет местами (y·up, x·up)", "mul: swaps (y·up, x·up)"))}
        {gate(4, 92, "max", A, "x = 3", "y = −4", "2", "0", t("max: всё — большему входу", "max: routes to the larger input"))}
        <g>
          <circle cx={264} cy={124} r={15} fill={F} stroke={G} strokeWidth={1.5} />
          <text x={264} y={128} textAnchor="middle" fontSize={10} fontWeight={700} fill={G}>copy</text>
          <line x1={194} y1={124} x2={249} y2={124} stroke="currentColor" opacity={0.5} />
          <line x1={279} y1={118} x2={334} y2={104} stroke="currentColor" opacity={0.5} /><line x1={279} y1={130} x2={334} y2={144} stroke="currentColor" opacity={0.5} />
          <text x={318} y={100} fontSize={9} fill={R}>↑ 4</text><text x={318} y={156} fontSize={9} fill={R}>↑ 1</text>
          <text x={214} y={118} fontSize={9} fill={R}>5</text>
          <text x={264} y={166} textAnchor="middle" fontSize={8.5} fill={G}>{t("copy: градиенты складываются", "copy: gradients add up")}</text>
        </g>
      </Svg>
    );
  },
  "cv-convolution": (t) => {
    const cell = 18;
    return (
      <Svg h={176} label={t("Свёртка: фильтр 3×3 по входу 5×5", "Convolution: a 3×3 filter over a 5×5 input")}>
        {[0, 1, 2, 3, 4].map((r) => [0, 1, 2, 3, 4].map((c) => <rect key={`${r}${c}`} x={10 + c * cell} y={20 + r * cell} width={cell} height={cell} fill={r < 3 && c < 3 ? S : F} opacity={r < 3 && c < 3 ? 0.35 : 1} stroke={B} />))}
        <rect x={10} y={20} width={cell * 3} height={cell * 3} fill="none" stroke={S} strokeWidth={2.5} />
        <text x={55} y={14} textAnchor="middle" fontSize={9.5} fontWeight={700} fill="currentColor">{t("вход 5×5", "input 5×5")}</text>
        <text x={125} y={70} fontSize={14} fill="currentColor">∗</text>
        {[0, 1, 2].map((r) => [0, 1, 2].map((c) => <rect key={`f${r}${c}`} x={145 + c * cell} y={38 + r * cell} width={cell} height={cell} fill={V} opacity={0.3} stroke={V} />))}
        <text x={172} y={32} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={V}>{t("фильтр 3×3", "filter 3×3")}</text>
        <text x={216} y={70} fontSize={14} fill="currentColor">=</text>
        {[0, 1, 2].map((r) => [0, 1, 2].map((c) => <rect key={`o${r}${c}`} x={236 + c * cell} y={38 + r * cell} width={cell} height={cell} fill={r === 0 && c === 0 ? G : F} opacity={r === 0 && c === 0 ? 0.6 : 1} stroke={B} />))}
        <text x={263} y={32} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={G}>{t("выход 3×3", "output 3×3")}</text>
        <text x={180} y={130} textAnchor="middle" fontSize={10.5} fontWeight={600} fill="currentColor">(W − F + 2P) / S + 1 = (5 − 3 + 0) / 1 + 1 = 3</text>
        <text x={180} y={148} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.8}>{t("одна выходная клетка = сумма 9 произведений + bias", "one output cell = sum of 9 products + bias")}</text>
        <text x={180} y={164} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.7}>{t("параметры слоя: K × (F·F·C + 1)", "layer parameters: K × (F·F·C + 1)")}</text>
      </Svg>
    );
  },
  "cv-pooling": (t) => {
    const m = [[1, 1, 2, 4], [5, 6, 7, 8], [3, 2, 1, 0], [1, 2, 3, 4]];
    const q = (r: number, c: number) => [S, V, A, G][Math.floor(r / 2) * 2 + Math.floor(c / 2)];
    return (
      <Svg h={150} label={t("Max pooling 2×2 с шагом 2", "2×2 max pooling with stride 2")}>
        {m.map((row, r) => row.map((v, c) => (
          <g key={`${r}${c}`}>
            <rect x={20 + c * 26} y={20 + r * 26} width={26} height={26} fill={q(r, c)} opacity={0.3} stroke={B} />
            <text x={33 + c * 26} y={37 + r * 26} textAnchor="middle" fontSize={11} fill="currentColor">{v}</text>
          </g>
        )))}
        <Arrow x1={140} y1={72} x2={196} y2={72} />
        <text x={168} y={64} textAnchor="middle" fontSize={8.5} fill="currentColor">max 2×2, S = 2</text>
        {[[6, 8], [3, 4]].map((row, r) => row.map((v, c) => (
          <g key={`p${r}${c}`}>
            <rect x={212 + c * 34} y={38 + r * 34} width={34} height={34} fill={[S, V, A, G][r * 2 + c]} opacity={0.4} stroke={B} />
            <text x={229 + c * 34} y={60 + r * 34} textAnchor="middle" fontSize={13} fontWeight={700} fill="currentColor">{v}</text>
          </g>
        )))}
        <text x={180} y={140} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.75}>{t("4×4 → 2×2: меньше размер, нет параметров, глубина не меняется", "4×4 → 2×2: smaller size, no parameters, depth unchanged")}</text>
      </Svg>
    );
  },
  "cv-resnet": (t) => (
    <Svg h={150} label={t("Residual-блок ResNet", "A ResNet residual block")}>
      <text x={18} y={74} fontSize={12} fontWeight={700} fill="currentColor">x</text>
      <Arrow x1={30} y1={70} x2={58} y2={70} />
      <Box x={58} y={56} w={64} h={28} label="3×3 conv" stroke={V} size={10} />
      <Arrow x1={122} y1={70} x2={138} y2={70} />
      <Box x={138} y={56} w={44} h={28} label="ReLU" stroke={G} size={10} />
      <Arrow x1={182} y1={70} x2={198} y2={70} />
      <Box x={198} y={56} w={64} h={28} label="3×3 conv" stroke={V} size={10} />
      <Arrow x1={262} y1={70} x2={282} y2={70} />
      <circle cx={292} cy={70} r={10} fill={F} stroke={A} strokeWidth={1.5} />
      <text x={292} y={74} textAnchor="middle" fontSize={12} fontWeight={700} fill={A}>+</text>
      <Arrow x1={302} y1={70} x2={326} y2={70} />
      <text x={330} y={66} fontSize={8.5} fill="currentColor">ReLU</text>
      <path d="M 44 70 L 44 26 L 292 26 L 292 58" fill="none" stroke={A} strokeWidth={1.5} strokeDasharray="5 3" />
      <text x={168} y={20} textAnchor="middle" fontSize={9} fill={A}>{t("shortcut: x идёт в обход", "shortcut: x skips the layers")}</text>
      <text x={160} y={104} textAnchor="middle" fontSize={9.5} fill={V}>F(x)</text>
      <text x={180} y={126} textAnchor="middle" fontSize={11} fontWeight={600} fill="currentColor">{t("выход = F(x) + x", "output = F(x) + x")}</text>
      <text x={180} y={142} textAnchor="middle" fontSize={8.5} fill="currentColor" opacity={0.75}>{t("если слой не нужен, F(x) → 0 и блок пропускает x: глубже не хуже", "if a layer isn't needed, F(x) → 0 and the block passes x: deeper isn't worse")}</text>
    </Svg>
  ),
};

Object.assign(DIAGRAMS, rm1, rm2, rm3, rm4, rm5, rmx, cc6, cc7, cc8, cc9, cc10);

export default function NotesDiagram({ name, lang }: { name: string; lang: string }) {
  const draw = DIAGRAMS[name];
  if (!draw) return null;
  const t: L = (ru, en) => (lang === "ru" ? ru : en);
  return <>{draw(t)}</>;
}

export const DIAGRAM_NAMES = Object.keys(DIAGRAMS);
