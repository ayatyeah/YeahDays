import { part, q, tf, type Lecture } from "../types";

/**
 * Темы из образца преподавателя и из варианта, который прислали студенты,
 * но которых нет в слайдах четырёх лекций: службы и порты, основы
 * IP-адресации, команды диагностики. На мидтерме они встречаются, поэтому
 * здесь — короткая выжимка и вопросы в том же стиле.
 */
export const drill: Lecture = {
  id: "cn-x",
  title: { en: "Beyond the slides — topics from the sample midterms", ru: "Сверх слайдов — темы из образцов мидтерма" },
  parts: [
    part(
      "cn-x-p1",
      { en: "Services, ports and transport protocols", ru: "Службы, порты и транспортные протоколы" },
      {
        en: `## Why this part exists
The sample variant from the instructor and the variant shared by students contain questions that the four lecture decks do not cover directly. They are standard facts — learn them as a list.
## Application services
- **DNS** — resolves domain names such as example.com into IP addresses.
- **DHCP** — automatically assigns IP addresses, subnet masks and default gateways to clients.
- **NAT** — translates private internal IP addresses into a public IP address for internet traffic.
- **SNMP** — collects monitoring metrics and management telemetry from network devices.
- **HTTP / HTTPS** — web pages; **FTP** — file transfer; **SMTP** — sending email; **NTP** — time synchronization.
- **ARP** — maps a known IPv4 address to a MAC address (not a name service).
## Well-known ports
= FTP 20 (data), 21 (control)
= SSH 22
= Telnet 23
= SMTP 25
= DNS 53
= HTTP 80
= HTTPS 443
## TCP and UDP
- **TCP** — **connection-oriented** and **reliable**: acknowledgments, sequencing, retransmission, flow control.
- **UDP** — **connectionless**; does **not guarantee** delivery, but is fast and has low overhead.
## The TCP three-way handshake
A TCP connection is opened with three control segments in this exact order:
= 1. SYN        client -> server
= 2. SYN-ACK    server -> client
= 3. ACK        client -> server
## ICMP and ping
**ping** tests end-to-end reachability by sending **ICMP Echo Request** messages and waiting for Echo Replies. **traceroute** shows the path hop by hop.
## Devices by layer
- **Hub / repeater** — Layer 1; repeats bits.
- **Switch** — Layer 2; forwards frames by **MAC address**.
- **Router** — Layer 3; connects different logical networks and decides by **IP address**.
- **Access point** — connects wireless clients to the wired LAN.
> SSH is 22 and secure, Telnet is 23 and plaintext. HTTP 80, HTTPS 443, DNS 53.`,
        ru: `## Зачем эта часть
В образце варианта от преподавателя и в варианте, которым поделились студенты, есть вопросы, которых слайды четырёх лекций напрямую не раскрывают. Это стандартные факты — выучи их списком.
## Прикладные службы
- **DNS** — превращает доменные имена вроде example.com в IP-адреса.
- **DHCP** — автоматически выдаёт клиентам IP-адреса, маски подсети и шлюзы по умолчанию.
- **NAT** — преобразует частные внутренние IP-адреса в публичный IP-адрес для выхода в интернет.
- **SNMP** — собирает с сетевых устройств метрики мониторинга и данные управления.
- **HTTP / HTTPS** — веб-страницы; **FTP** — передача файлов; **SMTP** — отправка почты; **NTP** — синхронизация времени.
- **ARP** — сопоставляет известный адрес IPv4 с MAC-адресом (это не служба имён).
## Известные порты
= FTP 20 (data), 21 (control)
= SSH 22
= Telnet 23
= SMTP 25
= DNS 53
= HTTP 80
= HTTPS 443
## TCP и UDP
- **TCP** — **с установлением соединения** и **надёжный**: подтверждения, нумерация, повторная передача, управление потоком.
- **UDP** — **без установления соединения**; доставку **не гарантирует**, зато быстрый и с малыми накладными расходами.
## Трёхэтапное рукопожатие TCP
Соединение TCP открывается тремя управляющими сегментами строго в таком порядке:
= 1. SYN        client -> server
= 2. SYN-ACK    server -> client
= 3. ACK        client -> server
## ICMP и ping
**ping** проверяет сквозную доступность, отправляя сообщения **ICMP Echo Request** и ожидая Echo Reply. **traceroute** показывает путь по узлам.
## Устройства по уровням
- **Концентратор / повторитель** — уровень 1; повторяет биты.
- **Коммутатор** — уровень 2; пересылает кадры по **MAC-адресу**.
- **Маршрутизатор** — уровень 3; соединяет разные логические сети и решает по **IP-адресу**.
- **Точка доступа** — подключает беспроводных клиентов к проводной LAN.
> SSH — 22 и защищён, Telnet — 23 и открытым текстом. HTTP 80, HTTPS 443, DNS 53.`,
      },
      [
        q("Which protocol is responsible for resolving domain names like 'example.com' into IP addresses?", "DNS", ["DHCP", "ARP", "FTP"], "The Domain Name System translates names into IP addresses.", "Система доменных имён переводит имена в IP-адреса."),
        q("Which port number does HTTP use by default?", "80", ["21", "22", "443"], "HTTP is 80, HTTPS is 443, FTP control is 21 and SSH is 22.", "HTTP — 80, HTTPS — 443, управление FTP — 21, SSH — 22."),
        q("Which transport protocol is connectionless and does not guarantee packet delivery?", "UDP", ["TCP", "SSH", "BGP"], "UDP sends without a connection or acknowledgments.", "UDP отправляет без соединения и подтверждений."),
        q("Which transport protocol provides connection-oriented reliable delivery?", "TCP", ["UDP", "IP", "ICMP"], "TCP sets up a connection and guarantees delivery with acknowledgments.", "TCP устанавливает соединение и гарантирует доставку подтверждениями."),
        q("What protocol automatically assigns IP addresses, subnet masks, and default gateways to client devices?", "DHCP", ["DNS", "SNMP", "NTP"], "The Dynamic Host Configuration Protocol hands out addressing automatically.", "DHCP автоматически выдаёт параметры адресации."),
        q("What is the standard port number for SSH (Secure Shell) remote management connections?", "22", ["20", "23", "8080"], "SSH uses port 22; Telnet uses 23.", "SSH использует порт 22; Telnet — 23."),
        q("In a TCP three-way handshake, what is the exact sequence of flag control segments exchanged?", "SYN, SYN-ACK, ACK", ["SYN, ACK, SYN-ACK", "ACK, SYN, SYN-ACK", "FIN, ACK, FIN-ACK"], "The client sends SYN, the server answers SYN-ACK, the client confirms with ACK.", "Клиент шлёт SYN, сервер отвечает SYN-ACK, клиент подтверждает ACK."),
        q("Which service translates private internal IP addresses into a public IP address for internet traffic?", "NAT", ["DNS", "CIDR", "VLAN"], "Network Address Translation maps private addresses to a public one.", "NAT отображает частные адреса на публичный."),
        q("Which protocol collects monitoring metrics and management telemetry from network devices?", "SNMP", ["SMTP", "SFTP", "Syslog"], "The Simple Network Management Protocol polls devices for metrics.", "SNMP опрашивает устройства и собирает метрики."),
        q("What tool tests end-to-end network reachability using ICMP Echo Request messages?", "ping", ["nslookup", "arp -a", "telnet"], "ping sends ICMP Echo Requests and waits for Echo Replies.", "ping отправляет ICMP Echo Request и ждёт Echo Reply."),
        q("Which device operates primarily at Layer 2 of the OSI model and forwards traffic based on MAC addresses?", "Switch", ["Router", "Hub", "Firewall"], "A switch is a Layer 2 device; a router works at Layer 3 and a hub at Layer 1.", "Коммутатор — устройство уровня 2; маршрутизатор работает на уровне 3, концентратор — на уровне 1."),
        q("Which device connects two or more different logical networks and makes routing decisions based on IP addresses?", "Router", ["Layer 2 Switch", "Repeater", "Access Point"], "Routers work at Layer 3 and forward packets between networks.", "Маршрутизаторы работают на уровне 3 и пересылают пакеты между сетями."),
        q("Which port number does Telnet use?", "23", ["22", "25", "53"], "Telnet is 23 and insecure; SSH on 22 replaces it.", "Telnet — 23 и небезопасен; его заменяет SSH на порту 22."),
        q("Which port number does HTTPS use by default?", "443", ["80", "8080", "143"], "HTTPS is HTTP over TLS on port 443.", "HTTPS — это HTTP поверх TLS на порту 443."),
      ],
    ),
    part(
      "cn-x-p2",
      { en: "IP addressing basics, commands and other exam facts", ru: "Основы IP-адресации, команды и другие факты из вариантов" },
      {
        en: `## Classes and default masks
- **Class A** — default mask **255.0.0.0** (/8).
- **Class B** — default mask **255.255.0.0** (/16).
- **Class C** — default mask **255.255.255.0** (/24).
## CIDR prefix from a mask
Count the ones in the mask. The last octet values:
= 128 -> /25    192 -> /26    224 -> /27    240 -> /28    248 -> /29    252 -> /30
So **255.255.255.192 = /26**: 24 bits plus two more (128 + 64).
## Special addresses
- **127.0.0.1** — **loopback**; tests the local network stack.
- **255.255.255.255** — the local (limited) IPv4 **broadcast**.
- **224.0.0.0 – 239.255.255.255** — **multicast** range.
- **Private (RFC 1918)**: **10.0.0.0 – 10.255.255.255**, **172.16.0.0 – 172.31.255.255**, **192.168.0.0 – 192.168.255.255**.
## Commands on a PC
- **ipconfig** — shows the local IP configuration in the **Windows** CLI (**ifconfig** / ip on Linux and macOS).
- **ping** — reachability; **tracert / traceroute** — the path; **nslookup** — DNS queries; **arp -a** — the ARP cache.
## Commands in Cisco IOS
- **show ip interface brief** — the operational status and IP address of all interfaces.
- **show running-config** — the current configuration.
- **show mac address-table** — the Layer 2 address table of a switch.
- **show vlan brief** — VLANs and their ports; **show version** — IOS version and hardware.
## Wireshark
To isolate ICMP traffic, type the display filter:
= icmp
Other simple filters: arp, dns, tcp, ip.addr == 192.168.1.10
## Ethernet speeds
- Ethernet — **10 Mbps**; **Fast Ethernet — 100 Mbps**; Gigabit Ethernet — **1 Gbps**; 10 Gigabit — 10 Gbps.
## Wi-Fi generations
- **802.11b** and **802.11g** — 2.4 GHz.
- **802.11n** — 2.4 and 5 GHz.
- **802.11ac** — **5 GHz**, multi-gigabit speeds.
- **802.3** is wired Ethernet, not Wi-Fi.
## Two more facts
- **Spanning Tree Protocol (STP)** prevents **switching loops** in Ethernet networks with redundant links.
- **Administrative distance** in Cisco IOS: connected interface **0**, **static route 1**, EIGRP 90, OSPF 110.
> Mask to prefix: 255.255.255.0 is /24, then every extra bit in the last octet adds one — 128 /25, 192 /26, 224 /27.`,
        ru: `## Классы и маски по умолчанию
- **Класс A** — маска по умолчанию **255.0.0.0** (/8).
- **Класс B** — маска по умолчанию **255.255.0.0** (/16).
- **Класс C** — маска по умолчанию **255.255.255.0** (/24).
## Префикс CIDR по маске
Посчитай единицы в маске. Значения последнего октета:
= 128 -> /25    192 -> /26    224 -> /27    240 -> /28    248 -> /29    252 -> /30
Значит, **255.255.255.192 = /26**: 24 бита плюс ещё два (128 + 64).
## Особые адреса
- **127.0.0.1** — **loopback**; проверяет локальный сетевой стек.
- **255.255.255.255** — локальный (ограниченный) **широковещательный** адрес IPv4.
- **224.0.0.0 – 239.255.255.255** — диапазон **multicast**.
- **Частные (RFC 1918)**: **10.0.0.0 – 10.255.255.255**, **172.16.0.0 – 172.31.255.255**, **192.168.0.0 – 192.168.255.255**.
## Команды на компьютере
- **ipconfig** — показывает локальные настройки IP в командной строке **Windows** (**ifconfig** / ip в Linux и macOS).
- **ping** — доступность; **tracert / traceroute** — путь; **nslookup** — запросы DNS; **arp -a** — кэш ARP.
## Команды в Cisco IOS
- **show ip interface brief** — рабочее состояние и IP-адрес всех интерфейсов.
- **show running-config** — текущая конфигурация.
- **show mac address-table** — таблица адресов уровня 2 на коммутаторе.
- **show vlan brief** — VLAN и их порты; **show version** — версия IOS и оборудование.
## Wireshark
Чтобы оставить только трафик ICMP, введи фильтр отображения:
= icmp
Другие простые фильтры: arp, dns, tcp, ip.addr == 192.168.1.10
## Скорости Ethernet
- Ethernet — **10 Мбит/с**; **Fast Ethernet — 100 Мбит/с**; Gigabit Ethernet — **1 Гбит/с**; 10 Gigabit — 10 Гбит/с.
## Поколения Wi-Fi
- **802.11b** и **802.11g** — 2,4 ГГц.
- **802.11n** — 2,4 и 5 ГГц.
- **802.11ac** — **5 ГГц**, скорости больше гигабита.
- **802.3** — проводной Ethernet, а не Wi-Fi.
## Ещё два факта
- **Протокол связующего дерева (STP)** предотвращает **петли коммутации** в сетях Ethernet с избыточными каналами.
- **Административное расстояние** в Cisco IOS: подключённый интерфейс **0**, **статический маршрут 1**, EIGRP 90, OSPF 110.
> От маски к префиксу: 255.255.255.0 — это /24, дальше каждый бит последнего октета добавляет единицу — 128 /25, 192 /26, 224 /27.`,
      },
      [
        q("What is the default subnet mask for a Class C IPv4 address?", "255.255.255.0", ["255.0.0.0", "255.255.0.0", "255.255.255.255"], "Class A is 255.0.0.0, class B is 255.255.0.0, class C is 255.255.255.0.", "Класс A — 255.0.0.0, класс B — 255.255.0.0, класс C — 255.255.255.0."),
        q("What is the loopback IPv4 address used for testing local network stack integrity?", "127.0.0.1", ["10.0.0.1", "172.16.0.1", "192.168.1.1"], "127.0.0.1 always points back to the local host.", "127.0.0.1 всегда указывает на сам локальный хост."),
        q("Which command in Windows CLI displays the local IP configuration details?", "ipconfig", ["ifconfig", "netstat", "traceroute"], "ipconfig is the Windows command; ifconfig is its Linux and macOS counterpart.", "ipconfig — команда Windows; ifconfig — её аналог в Linux и macOS."),
        q("Which IPv4 address range is designated for private network use under RFC 1918?", "10.0.0.0 - 10.255.255.255", ["8.8.8.0 - 8.8.8.255", "100.64.0.0 - 100.127.255.255", "224.0.0.0 - 239.255.255.255"], "RFC 1918 reserves 10.0.0.0/8, 172.16.0.0/12 and 192.168.0.0/16.", "RFC 1918 резервирует 10.0.0.0/8, 172.16.0.0/12 и 192.168.0.0/16."),
        q("What is the CIDR prefix notation equivalent for the subnet mask 255.255.255.192?", "/26", ["/24", "/25", "/27"], "192 is 11000000: two more bits after /24.", "192 — это 11000000: ещё два бита после /24."),
        q("Which command in Cisco IOS displays the operational status of all router or switch interfaces?", "show ip interface brief", ["show running-config", "show vlan brief", "show version"], "show ip interface brief lists every interface with its address and status.", "show ip interface brief выводит каждый интерфейс с адресом и состоянием."),
        q("Which Wireshark filter isolates ICMP traffic?", "icmp", ["ip.proto == icmp", "protocol.icmp", "show icmp"], "The display filter is simply the protocol name in lower case.", "Фильтр отображения — просто имя протокола строчными буквами."),
        q("What mechanism prevents switching loops in Ethernet networks with redundant physical links?", "Spanning Tree Protocol (STP)", ["OSPF", "VLAN Trunking Protocol (VTP)", "NAT"], "STP blocks redundant paths so that frames do not circulate forever.", "STP блокирует избыточные пути, чтобы кадры не ходили по кругу бесконечно."),
        q("What is the maximum throughput speed supported by standard Fast Ethernet?", "100 Mbps", ["10 Mbps", "1 Gbps", "10 Gbps"], "Ethernet is 10 Mbps, Fast Ethernet 100 Mbps, Gigabit Ethernet 1 Gbps.", "Ethernet — 10 Мбит/с, Fast Ethernet — 100 Мбит/с, Gigabit Ethernet — 1 Гбит/с."),
        q("Which wireless standard operates in the 5 GHz band and supports up to multi-gigabit speeds?", "802.11ac", ["802.11b", "802.11g", "802.3"], "802.11b and g use 2.4 GHz; 802.3 is wired Ethernet.", "802.11b и g работают на 2,4 ГГц; 802.3 — проводной Ethernet."),
        q("What is the default administrative distance of a static route in Cisco IOS?", "1", ["0", "90", "110"], "Connected is 0, static is 1, EIGRP is 90 and OSPF is 110.", "Подключённая сеть — 0, статический — 1, EIGRP — 90, OSPF — 110."),
        q("Which IPv4 address range is reserved for multicast?", "224.0.0.0 - 239.255.255.255", ["127.0.0.0 - 127.255.255.255", "169.254.0.0 - 169.254.255.255", "192.168.0.0 - 192.168.255.255"], "Class D addresses 224–239 are multicast.", "Адреса класса D, 224–239, — групповые."),
        q("What is the CIDR prefix for the subnet mask 255.255.255.224?", "/27", ["/26", "/28", "/29"], "224 is 11100000: three more bits after /24.", "224 — это 11100000: ещё три бита после /24."),
        tf("192.168.10.5 is a private IPv4 address.", true, "192.168.0.0 – 192.168.255.255 is one of the three RFC 1918 private ranges.", "192.168.0.0 – 192.168.255.255 — один из трёх частных диапазонов RFC 1918."),
      ],
    ),
  ],
};
