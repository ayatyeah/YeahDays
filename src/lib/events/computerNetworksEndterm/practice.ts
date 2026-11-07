import bank from "./bank.json";
export type BankQuestion = (typeof bank)[number];
export const openQuestions = [
  { id: "ip", prompt: "Explain the key characteristics of Internet Protocol (IP).", answer: "Connectionless: соединение заранее не устанавливается. Best effort: нет гарантии доставки, порядка или повторной передачи. Media independent: IP работает поверх разных сред передачи. Надёжность при необходимости обеспечивает транспорт или приложение." },
  { id: "subnet", prompt: "For 192.168.10.77/27, give the subnet mask, network address, broadcast address and usable host range.", answer: "Маска 255.255.255.224. Размер блока 32. Network 192.168.10.64; broadcast 192.168.10.95; hosts 192.168.10.65–192.168.10.94 (30 хостов)." },
  { id: "tcp", prompt: "Compare TCP and UDP. Explain the TCP three-way handshake and the meaning of an acknowledgment number.", answer: "TCP: соединение, упорядочивание, ACK и повторная передача. UDP: без установления соединения и встроенных гарантий доставки/порядка. Handshake: SYN → SYN-ACK → ACK. ACK обозначает номер следующего ожидаемого байта." },
  { id: "dhcp", prompt: "Explain DHCPv4 DORA and distinguish DHCP from DNS.", answer: "Discover: клиент ищет сервер. Offer: сервер предлагает конфигурацию. Request: клиент запрашивает выбранное предложение. ACK: сервер подтверждает аренду. DHCP выдаёт IP-настройки (UDP 67/68); DNS разрешает имена (порт 53)." },
  { id: "ios", prompt: "Write IOS commands to configure G0/0 with 192.168.1.1/24, enable the interface, verify it and save the configuration.", answer: "enable → configure terminal → interface g0/0 → ip address 192.168.1.1 255.255.255.0 → no shutdown → end → show ip interface brief → copy running-config startup-config. Имя интерфейса зависит от устройства." },
  { id: "ssh", prompt: "Describe how to enable SSH management on a Cisco IOS device and why SSH is preferable to Telnet.", answer: "Hostname и ip domain-name, локальный username … secret …, crypto key generate rsa, ip ssh version 2; line vty 0 4, login local, transport input ssh. Нужны доступный IP и рабочая сеть. SSH шифрует сеанс; Telnet передаёт данные открыто." },
  { id: "arp", prompt: "A host sends a packet to another network. Which destination IP and MAC addresses are used on its first Ethernet hop, and why?", answer: "Destination IP — адрес конечного удалённого хоста. Destination MAC — MAC локального шлюза, полученный через ARP для IPv4. Маршрутизатор заменяет L2-кадр на следующем канале; IP назначения обычно сохраняется при отсутствии NAT." },
  { id: "ipv6", prompt: "Explain IPv6 link-local addressing, SLAAC and the role of Router Advertisements.", answer: "Link-local (fe80::/10) действует только на локальном канале. RA сообщает префикс и параметры, а также помогает узнать default router. SLAAC позволяет узлу сформировать адрес по данным RA. DAD проверяет уникальность; DHCPv6 может дать дополнительные параметры или адрес." },
  { id: "icmp", prompt: "Compare ping and traceroute. What can and cannot be concluded from an unanswered probe?", answer: "Ping проверяет достижимость и RTT через Echo Request/Reply. Traceroute изменяет TTL/Hop Limit и использует Time Exceeded для определения переходов. Отсутствие ответа может быть связано с фильтрацией, потерей или таймаутом; оно не доказывает отказ конкретного узла." },
  { id: "security", prompt: "Distinguish threats, vulnerabilities and exploits. Give practical ways to secure a network device.", answer: "Threat — потенциальная опасность; vulnerability — слабость; exploit — способ её использования. Защита: обновления, сильные пароли, минимум привилегий, SSH вместо Telnet, отключение неиспользуемых интерфейсов и резервные копии." },
];
export interface Attempt { version: 1; ids: string[]; openIds: string[]; answers: Record<string, number[]>; written: Record<string, string>; deadline: number; finished: boolean }
export function newAttempt(random = Math.random, now = Date.now()): Attempt {
  const sample = <T,>(values: T[], count: number) => {
    const copy = [...values];
    for (let i = copy.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]]; }
    return copy.slice(0, count);
  };
  const singles = sample(bank.filter(q => q.eligible && q.correct.length === 1), 20);
  const multiple = sample(bank.filter(q => q.eligible && [2,3].includes(q.correct.length)), 5);
  return { version: 1, ids: [...singles, ...multiple].map(q => q.id), openIds: sample(openQuestions,5).map(q => q.id), answers: {}, written: {}, deadline: now + 45 * 60_000, finished: false };
}
export function isCorrect(q: BankQuestion, selected: number[]) {
  return selected.length === q.correct.length && q.correct.every(i => selected.includes(i));
}
export function scoreAttempt(a: Attempt) {
  return a.ids.reduce((total, id) => { const q = bank.find(q => q.id === id)!; return total + (isCorrect(q,a.answers[id] ?? []) ? (q.correct.length === 1 ? 3 : 4) : 0); },0);
}
export function parseAttempt(raw: string | null): Attempt | null {
  try {
    const a = JSON.parse(raw ?? "null");
    if (!a || a.version !== 1 || !Array.isArray(a.ids) || a.ids.length !== 25 || new Set(a.ids).size !== 25 || !Array.isArray(a.openIds) || a.openIds.length !== 5 || new Set(a.openIds).size !== 5 || !Number.isFinite(a.deadline) || typeof a.finished !== "boolean" || !a.answers || !a.written) return null;
    if (!a.ids.every((id: string, i: number) => bank.some(q => q.id === id && q.eligible && (i < 20 ? q.correct.length === 1 : [2,3].includes(q.correct.length))))) return null;
    if (!a.openIds.every((id: string) => openQuestions.some(q => q.id === id))) return null;
    for (const [id, values] of Object.entries(a.answers)) {
      const q = bank.find(q => q.id === id);
      if (!a.ids.includes(id) || !q || !Array.isArray(values) || new Set(values).size !== values.length || !values.every(i => Number.isInteger(i) && i >= 0 && i < q.options.length)) return null;
    }
    if (!Object.entries(a.written).every(([id,text]) => a.openIds.includes(id) && typeof text === "string")) return null;
    return a as Attempt;
  } catch { return null; }
}
