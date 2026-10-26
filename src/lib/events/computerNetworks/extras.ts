import type { Term, Text } from "../types";

const t = (term: string, en: string, ru: string): Term => ({ term, def: { en, ru } });

/** Глоссарий курса — он же колода карточек «термин → определение». */
export const glossary: Term[] = [
  t("End device (host)", "A device where a message originates or is received.", "Устройство, откуда сообщение отправляется или где принимается."),
  t("Intermediary device", "Interconnects end devices: switch, router, access point, firewall.", "Соединяет конечные устройства: коммутатор, маршрутизатор, точка доступа, межсетевой экран."),
  t("LAN", "A network over a small area, administered by one organization.", "Сеть на небольшой территории под управлением одной организации."),
  t("WAN", "A network over a wide area that interconnects LANs, run by service providers.", "Сеть на большой территории, соединяющая LAN; управляется провайдерами."),
  t("Extranet", "Secure access to an organization's network for people from another organization.", "Защищённый доступ к сети организации для людей из другой организации."),
  t("Converged network", "Carries data, voice and video over one infrastructure.", "Передаёт данные, голос и видео по одной инфраструктуре."),
  t("Fault tolerance", "Limits the impact of a failure; needs multiple paths.", "Ограничивает последствия сбоя; требует нескольких путей."),
  t("QoS", "The primary mechanism to ensure reliable delivery of content for all users.", "Основной механизм надёжной доставки содержимого всем пользователям."),
  t("Confidentiality / Integrity / Availability", "Only intended readers / data not altered / timely access for authorized users.", "Читает только адресат / данные не изменены / своевременный доступ для авторизованных."),
  t("User EXEC mode", "Limited monitoring commands; prompt ends with >.", "Ограниченные команды наблюдения; приглашение кончается на >."),
  t("Privileged EXEC mode", "All commands; prompt ends with #. Entered with enable.", "Все команды; приглашение кончается на #. Вход командой enable."),
  t("Global configuration mode", "Device-wide configuration; entered with configure terminal.", "Настройки всего устройства; вход командой configure terminal."),
  t("running-config", "The current configuration, stored in volatile RAM.", "Текущая конфигурация, хранится в энергозависимой RAM."),
  t("startup-config", "The saved configuration, stored in NVRAM and loaded at boot.", "Сохранённая конфигурация, хранится в NVRAM и загружается при запуске."),
  t("service password-encryption", "Encrypts all plaintext passwords in the configuration.", "Шифрует все открытые пароли в конфигурации."),
  t("Ctrl+Shift+6", "The all-purpose break sequence: aborts DNS lookups, pings and traceroutes.", "Универсальное прерывание: останавливает DNS-поиск, ping и traceroute."),
  t("Protocol", "A set of rules that governs communication.", "Набор правил, по которым идёт общение."),
  t("Encapsulation", "Each layer adds its own header to the data on the way down.", "Каждый уровень добавляет к данным свой заголовок по пути вниз."),
  t("PDU", "Protocol data unit: data, segment, packet, frame, bits.", "Блок данных протокола: данные, сегмент, пакет, кадр, биты."),
  t("Segment", "The PDU of the transport layer.", "PDU транспортного уровня."),
  t("Packet", "The PDU of the network layer.", "PDU сетевого уровня."),
  t("Frame", "The PDU of the data link layer.", "PDU канального уровня."),
  t("Default gateway", "The router interface on the local LAN — the door to remote networks.", "Интерфейс маршрутизатора в локальной сети — дверь в удалённые сети."),
  t("IETF", "Develops and maintains internet and TCP/IP technologies.", "Разрабатывает и поддерживает технологии интернета и TCP/IP."),
  t("IEEE", "Creates networking standards such as 802.3 Ethernet and 802.11 Wi-Fi; assigns OUIs.", "Создаёт сетевые стандарты, например 802.3 Ethernet и 802.11 Wi-Fi; выдаёт OUI."),
  t("ICANN / IANA", "Coordinate IP address allocation and domain names.", "Координируют распределение IP-адресов и доменные имена."),
  t("Bandwidth", "The capacity of a medium to carry data, in bits per second.", "Ёмкость среды передачи, в битах в секунду."),
  t("Throughput", "The actual transfer of bits over a period of time.", "Реальная передача битов за период времени."),
  t("Goodput", "Usable data transferred: throughput minus traffic overhead.", "Переданные полезные данные: throughput минус служебный трафик."),
  t("Latency", "The time, including delays, for data to travel between two points.", "Время, включая задержки, за которое данные проходят между двумя точками."),
  t("Attenuation", "Loss of signal strength as distance grows.", "Ослабление сигнала с ростом расстояния."),
  t("Crosstalk", "Interference between neighbouring wires; reduced by twisting.", "Наводки между соседними проводами; уменьшаются скруткой."),
  t("UTP", "Unshielded twisted pair: four pairs, RJ-45, up to 100 m.", "Неэкранированная витая пара: четыре пары, RJ-45, до 100 м."),
  t("Straight-through cable", "Same standard on both ends; connects unlike devices.", "Один стандарт на обоих концах; соединяет разные устройства."),
  t("Crossover cable", "T568A on one end, T568B on the other; connects like devices.", "T568A на одном конце, T568B на другом; соединяет одинаковые устройства."),
  t("Rollover cable", "Cisco console cable from a PC serial port to the console port.", "Консольный кабель Cisco от последовательного порта ПК к консольному порту."),
  t("Single-mode fiber", "Very small core, laser, long distances, yellow jacket.", "Тонкая сердцевина, лазер, большие расстояния, жёлтая оболочка."),
  t("Multimode fiber", "Larger core, LED, up to 550 m, orange jacket.", "Толстая сердцевина, светодиод, до 550 м, оранжевая оболочка."),
  t("Octet", "Eight bits; an IPv4 address has four of them.", "Восемь бит; в адресе IPv4 их четыре."),
  t("Hextet", "Four hexadecimal digits; an IPv6 address has eight of them.", "Четыре шестнадцатеричные цифры; в адресе IPv6 их восемь."),
  t("LLC sublayer", "IEEE 802.2; identifies the network layer protocol in the frame.", "IEEE 802.2; указывает в кадре протокол сетевого уровня."),
  t("MAC sublayer", "Data encapsulation, media access control and Layer 2 addressing.", "Инкапсуляция данных, управление доступом к среде и адресация уровня 2."),
  t("CSMA/CD", "Collision detection on legacy half-duplex Ethernet.", "Обнаружение коллизий в старом полудуплексном Ethernet."),
  t("CSMA/CA", "Collision avoidance on 802.11 wireless LANs.", "Предотвращение коллизий в беспроводных сетях 802.11."),
  t("FCS", "Frame check sequence: a CRC in the trailer used for error detection.", "Контрольная последовательность кадра: CRC в концевике для обнаружения ошибок."),
  t("Preamble and SFD", "Synchronize the receiver and mark the start of the frame.", "Синхронизируют приёмник и отмечают начало кадра."),
  t("EtherType 0x0800", "Marks an IPv4 packet inside the Ethernet frame.", "Обозначает пакет IPv4 внутри кадра Ethernet."),
  t("Runt frame", "A frame shorter than 64 bytes; discarded.", "Кадр короче 64 байт; отбрасывается."),
  t("OUI", "The first 3 bytes of a MAC address, identifying the vendor.", "Первые 3 байта MAC-адреса, определяющие производителя."),
  t("ARP", "Maps a known IPv4 address to a MAC address.", "Сопоставляет известный адрес IPv4 с MAC-адресом."),
  t("Unknown unicast", "A frame whose destination MAC is not in the table; flooded out all ports except the incoming one.", "Кадр, MAC назначения которого нет в таблице; рассылается во все порты, кроме входящего."),
  t("Store-and-forward", "Receives the whole frame and checks the CRC before forwarding.", "Принимает кадр целиком и проверяет CRC перед пересылкой."),
  t("Fragment-free", "Checks the first 64 bytes, then forwards.", "Проверяет первые 64 байта, затем пересылает."),
  t("Auto-MDIX", "Detects the cable type and swaps transmit and receive pairs.", "Определяет тип кабеля и меняет местами пары передачи и приёма."),
  t("DNS", "Resolves domain names into IP addresses.", "Превращает доменные имена в IP-адреса."),
  t("DHCP", "Automatically assigns IP address, mask and default gateway.", "Автоматически выдаёт IP-адрес, маску и шлюз по умолчанию."),
  t("NAT", "Translates private addresses into a public address.", "Преобразует частные адреса в публичный."),
  t("Three-way handshake", "SYN, SYN-ACK, ACK — how a TCP connection opens.", "SYN, SYN-ACK, ACK — так открывается соединение TCP."),
  t("Best effort", "IP does not guarantee delivery: no acknowledgments, no resending.", "IP не гарантирует доставку: нет подтверждений и повторной отправки."),
  t("MTU", "Maximum Transmission Unit: the largest packet a medium can carry; 1500 bytes on Ethernet.", "Наибольший пакет, который может передать среда; в Ethernet — 1500 байт."),
  t("Fragmentation", "Layer 3 splits an IPv4 packet bigger than the next link's MTU; routers never fragment IPv6.", "Уровень 3 делит пакет IPv4, который больше MTU следующего канала; IPv6 маршрутизаторы не фрагментируют."),
  t("TTL", "IPv4 hop count: every router subtracts 1 and drops the packet at 0.", "Счётчик переходов IPv4: каждый маршрутизатор вычитает 1 и при 0 отбрасывает пакет."),
  t("Hop Limit", "The IPv6 header field that replaces TTL.", "Поле заголовка IPv6, которое заменяет TTL."),
  t("Flow Label", "A 20-bit IPv6 field: packets with the same label are handled the same way.", "20-битное поле IPv6: пакеты с одной меткой обрабатываются одинаково."),
  t("Extension header", "An optional IPv6 header between the main header and the payload: fragmentation, security, mobility.", "Необязательный заголовок IPv6 между основным заголовком и нагрузкой: фрагментация, безопасность, мобильность."),
  t("Directly connected route (C / L)", "Added automatically for an active interface: C — its network, L — its own /32 address.", "Добавляется автоматически для активного интерфейса: C — его сеть, L — его собственный адрес /32."),
  t("Default route (S*)", "0.0.0.0/0 — the gateway of last resort, used when no other route matches.", "0.0.0.0/0 — шлюз последней надежды, когда другие маршруты не подходят."),
  t("ARP request / ARP reply", "The request is a broadcast to FF-FF-FF-FF-FF-FF; the reply is a unicast with the MAC address.", "Запрос — broadcast на FF-FF-FF-FF-FF-FF; ответ — unicast с MAC-адресом."),
  t("ARP spoofing", "Fake ARP replies with the attacker's MAC for another IP, usually the gateway's; mitigated by DAI.", "Поддельные ARP-ответы с MAC злоумышленника для чужого IP, обычно шлюза; защита — DAI."),
  t("NS / NA", "ICMPv6 Neighbor Solicitation and Advertisement: IPv6 address resolution and DAD.", "ICMPv6 Neighbor Solicitation и Advertisement: разрешение адресов IPv6 и DAD."),
  t("RS / RA", "Router Solicitation (a host asks) and Router Advertisement (a router sends the prefix and default gateway).", "Router Solicitation (хост спрашивает) и Router Advertisement (маршрутизатор сообщает префикс и шлюз по умолчанию)."),
  t("Solicited-node multicast", "FF02::1:FF plus the last 24 bits of an IPv6 address; where an NS is sent.", "FF02::1:FF плюс последние 24 бита адреса IPv6; туда отправляется NS."),
  t("ip default-gateway", "Gives a Layer 2 switch a gateway so that it can be managed from other networks.", "Даёт коммутатору уровня 2 шлюз, чтобы им можно было управлять из других сетей."),
  // Лекция 7: IPv6, ICMP
  t("Dual stack", "Devices run the IPv4 and IPv6 protocol stacks at the same time; also called native IPv6.", "Устройства одновременно запускают стеки IPv4 и IPv6; ещё называется native IPv6."),
  t("Tunneling (IPv6 over IPv4)", "An IPv6 packet is encapsulated inside an IPv4 packet to cross an IPv4-only network.", "Пакет IPv6 инкапсулируется в пакет IPv4, чтобы пройти через сеть только с IPv4."),
  t("NAT64", "Translates IPv6 packets into IPv4 packets and back, so IPv6-only and IPv4-only devices can talk.", "Переводит пакеты IPv6 в IPv4 и обратно, чтобы общались устройства только с IPv6 и только с IPv4."),
  t("Anycast", "One unicast address on several devices; a packet goes to the nearest of them (one-to-nearest).", "Один unicast-адрес на нескольких устройствах; пакет идёт к ближайшему из них («один к ближайшему»)."),
  t("GUA (global unicast address)", "A globally unique, internet-routable IPv6 address from 2000::/3, like a public IPv4 address.", "Глобально уникальный, маршрутизируемый в интернете адрес IPv6 из 2000::/3, как публичный IPv4."),
  t("LLA (link-local address)", "An fe80::/10 address required on every IPv6 interface; works on one link only and is never routed.", "Адрес из fe80::/10, обязательный на каждом интерфейсе IPv6; работает только в своём канале и не маршрутизируется."),
  t("Unique local address", "fc00::/7, similar to RFC 1918 private addresses; not globally routed or translated.", "fc00::/7, похож на частные адреса RFC 1918; глобально не маршрутизируется и не транслируется."),
  t("Subnet ID", "The GUA field between the global routing prefix and the interface ID; 16 bits in a /48 site.", "Поле GUA между глобальным префиксом и идентификатором интерфейса; 16 бит у площадки /48."),
  t("SLAAC", "Stateless Address Autoconfiguration: the host builds its GUA from the RA prefix, without DHCPv6.", "Автонастройка адреса без сохранения состояния: хост строит GUA из префикса в RA, без DHCPv6."),
  t("Stateless DHCPv6", "Gives only other information, such as DNS and the domain name; the GUA comes from SLAAC (RA method 2).", "Выдаёт только прочие сведения, например DNS и доменное имя; GUA — через SLAAC (метод RA 2)."),
  t("Stateful DHCPv6", "Assigns the GUA, prefix length and DNS, like DHCP for IPv4; the gateway still comes from the RA (method 3).", "Выдаёт GUA, длину префикса и DNS, как DHCP для IPv4; шлюз всё равно берётся из RA (метод 3)."),
  t("EUI-64", "Builds a 64-bit interface ID from the MAC: insert fffe in the middle and reverse the 7th bit.", "Строит 64-битный идентификатор интерфейса из MAC: вставить fffe в середину и инвертировать 7-й бит."),
  t("DAD", "Duplicate address detection: an NS for the device's own address; no NA in reply means the address is unique.", "Обнаружение дублирующихся адресов: NS со своим адресом; если NA не пришёл, адрес уникален."),
  t("ICMP Time Exceeded", "Sent to the source when TTL (IPv4) or Hop Limit (IPv6) reaches 0; traceroute is built on it.", "Уходит источнику, когда TTL (IPv4) или Hop Limit (IPv6) доходит до 0; на нём построен traceroute."),
];

/** Шпаргалка на одну страницу — то, что стоит перечитать за пять минут до мидтерма. */
export const cheatSheet: Text = {
  en: `## OSI layers and PDUs
- **7 Application, 6 Presentation, 5 Session, 4 Transport, 3 Network, 2 Data Link, 1 Physical.**
- PDUs down the stack: **Data, Segment, Packet, Frame, Bits.**
- Layer 3 — logical addressing and routing (router). Layer 2 — MAC addresses (switch). Layer 6 — encryption, compression, formatting.
- TCP/IP: Application (OSI 5–7), Transport, Internet, Network Access (OSI 1–2).
## Cisco IOS
- **>** user EXEC, **#** privileged EXEC, **(config)#** global configuration.
- **enable**, then **configure terminal**; **exit** one level back, **end** / **Ctrl+Z** to privileged EXEC.
- **hostname** — global configuration. **enable secret** — privileged EXEC password. **line console 0** and **line vty 0 15** with **password** and **login**.
- **service password-encryption** encrypts plaintext passwords. **banner motd #text#**.
- **copy running-config startup-config** saves RAM to NVRAM. **erase startup-config** plus **reload** wipes the device.
- **Ctrl+Shift+6** cancels a hung command or DNS lookup. **Tab** completes, **?** helps.
- **show ip interface brief**, **show running-config**, **show mac address-table**.
## Cables
- UTP: RJ-45, four pairs, **100 m** maximum. **T568B: white-orange, orange, white-green…**
- **Straight-through** — unlike devices. **Crossover** — like devices (switch to switch when Auto-MDIX is off). **Rollover** — console.
- Fiber: **single-mode** — laser, long, yellow; **multimode** — LED, 550 m, orange. Connectors **ST, SC (square, push-pull), LC**.
- Wireless: **802.11 Wi-Fi**, 802.15 Bluetooth, 802.16 WiMAX, 802.15.4 Zigbee.
## Numbers
= 128  64  32  16  8  4  2  1
- **192 = 11000000**, 168 = 10101000, 255 = 11111111.
- Hex: A=10 … F=15; 168 = A8; D2 = 210.
- IPv4 — **32 bits**, MAC — **48 bits**, IPv6 — **128 bits**.
## Ethernet frame
- **Preamble + SFD** — synchronization and frame start. **FCS** — CRC error detection.
- Payload **46–1500 bytes**; frame **64–1518 bytes**; under 64 — runt.
- **EtherType 0x0800 = IPv4.**
- **CSMA/CD** — half-duplex Ethernet; **CSMA/CA** — Wi-Fi. **Star** — everything to a central switch.
## MAC and switching
- MAC = 48 bits; **first 3 bytes = OUI**. Broadcast **FF-FF-FF-FF-FF-FF**.
- **ARP: IPv4 address to MAC address.** Local IPv4 broadcast **255.255.255.255**.
- Switch: **learn the source, forward by the destination**. **Unknown unicast — flood out all ports except the ingress port.**
- **Store-and-forward** checks CRC; **fast-forward** is fastest; **fragment-free** checks 64 bytes.
- **Auto-MDIX** swaps transmit and receive pairs.
## Services and ports
- **DNS** names, **DHCP** addresses, **NAT** private to public, **SNMP** monitoring.
- FTP 20/21, **SSH 22**, **Telnet 23**, DNS 53, **HTTP 80**, **HTTPS 443**.
- **TCP** — reliable, connection-oriented; handshake **SYN, SYN-ACK, ACK**. **UDP** — connectionless.
- **ping** uses **ICMP Echo Request**. Wireshark filter: **icmp**.
## Addresses
- Class C mask **255.255.255.0**. **255.255.255.192 = /26**, .224 = /27.
- Loopback **127.0.0.1**. Private: **10.0.0.0/8**, 172.16.0.0/12, 192.168.0.0/16.
- Fast Ethernet **100 Mbps**. **802.11ac** — 5 GHz. **STP** prevents switching loops. Static route distance **1**.
## Network layer and routers
- IP is **connectionless, best effort, media independent**. Ethernet MTU **1500 bytes**; routers fragment IPv4 only.
- IPv4 header: **TTL** −1 per router (0 = drop), **Protocol** 1 ICMP / 6 TCP / 17 UDP, **DS** = QoS, the checksum covers the header only.
- IPv6 header: fixed **40 bytes**; **Hop Limit** = TTL, **Traffic Class** = DS, **Next Header** = Protocol, **Flow Label** 20 bits.
- Host: same network — straight to the host; other network — **default gateway**. Routing table: **route print** / **netstat -r**.
- **show ip route**: **C** connected network, **L** own interface /32, **S** static, S* default, **O** OSPF, **D** EIGRP.
- **ARP request = broadcast, reply = unicast**; **arp -a** (PC), **show ip arp** (router). IPv6: **NS/NA**, **RS/RA**, solicited-node **FF02::1:FF** + last 24 bits.
- Router interfaces are **shut down by default** — **no shutdown**. **line vty 0 4**, **transport input ssh**. Switch: **ip default-gateway** for remote management.
## IPv6 addressing and ICMP
- IPv6: **128 bits**, hex, **8 hextets × 16 bits**. **Rule 1** — drop leading zeros only; **Rule 2** — **::** replaces one run of zero hextets, **only once**.
- Coexistence: **dual stack**, **tunneling** (IPv6 inside IPv4), **translation NAT64**. Address types: unicast, multicast, **anycast = one-to-nearest**; **no broadcast**.
- **GUA 2000::/3** (starts with 2 or 3), **LLA fe80::/10** (on every interface, never routed), **ULA fc00::/7**, **multicast ff00::/8**, **::1** loopback, **::** unspecified; **ff02::1** all nodes, **ff02::2** all routers.
- GUA = **/48 global routing prefix + 16-bit subnet ID + 64-bit interface ID**; a /48 gives **65,536** /64 subnets, counted in hex (…9, a, b…).
- **ipv6 address 2001:db8:acad:1::1/64**, **ipv6 address fe80::1:1 link-local**, **ipv6 unicast-routing**; check with **show ipv6 interface brief** and **ipconfig**.
- RA = prefix + **default gateway (the RA source LLA)** + DNS. Methods: **SLAAC**; **SLAAC + stateless DHCPv6** (DNS); **stateful DHCPv6** (GUA). **EUI-64**: fffe in the middle + reverse the 7th bit.
- ICMP v4 and v6: **echo**, **destination unreachable** (port = code 3 in v4, code 4 in v6), **time exceeded** (TTL / Hop Limit). ND: **RS/RA**, **NS/NA** (DAD, address resolution).
- Test order: **ping 127.0.0.1 / ::1** → **default gateway** → **remote host**; **traceroute / tracert** raises the TTL 1, 2, 3…; an asterisk means no reply.`,
  ru: `## Уровни OSI и PDU
- **7 Прикладной, 6 Представления, 5 Сеансовый, 4 Транспортный, 3 Сетевой, 2 Канальный, 1 Физический.**
- PDU вниз по стеку: **Data, Segment, Packet, Frame, Bits.**
- Уровень 3 — логическая адресация и маршрутизация (маршрутизатор). Уровень 2 — MAC-адреса (коммутатор). Уровень 6 — шифрование, сжатие, формат.
- TCP/IP: Приложений (OSI 5–7), Транспортный, Интернет, Сетевого доступа (OSI 1–2).
## Cisco IOS
- **>** пользовательский EXEC, **#** привилегированный EXEC, **(config)#** глобальная конфигурация.
- **enable**, затем **configure terminal**; **exit** — на уровень назад, **end** / **Ctrl+Z** — в привилегированный EXEC.
- **hostname** — глобальная конфигурация. **enable secret** — пароль привилегированного EXEC. **line console 0** и **line vty 0 15** с **password** и **login**.
- **service password-encryption** шифрует открытые пароли. **banner motd #text#**.
- **copy running-config startup-config** сохраняет RAM в NVRAM. **erase startup-config** плюс **reload** очищает устройство.
- **Ctrl+Shift+6** прерывает зависшую команду или DNS-поиск. **Tab** дописывает, **?** подсказывает.
- **show ip interface brief**, **show running-config**, **show mac address-table**.
## Кабели
- UTP: RJ-45, четыре пары, максимум **100 м**. **T568B: бело-оранжевый, оранжевый, бело-зелёный…**
- **Прямой** — разные устройства. **Перекрёстный** — одинаковые (коммутатор с коммутатором при выключенном Auto-MDIX). **Rollover** — консоль.
- Оптика: **одномод** — лазер, далеко, жёлтый; **многомод** — светодиод, 550 м, оранжевый. Разъёмы **ST, SC (квадратный, push-pull), LC**.
- Беспроводные: **802.11 Wi-Fi**, 802.15 Bluetooth, 802.16 WiMAX, 802.15.4 Zigbee.
## Числа
= 128  64  32  16  8  4  2  1
- **192 = 11000000**, 168 = 10101000, 255 = 11111111.
- Hex: A=10 … F=15; 168 = A8; D2 = 210.
- IPv4 — **32 бита**, MAC — **48 бит**, IPv6 — **128 бит**.
## Кадр Ethernet
- **Преамбула + SFD** — синхронизация и начало кадра. **FCS** — обнаружение ошибок по CRC.
- Нагрузка **46–1500 байт**; кадр **64–1518 байт**; меньше 64 — runt.
- **EtherType 0x0800 = IPv4.**
- **CSMA/CD** — полудуплексный Ethernet; **CSMA/CA** — Wi-Fi. **Звезда** — всё подключено к центральному коммутатору.
## MAC и коммутация
- MAC = 48 бит; **первые 3 байта = OUI**. Broadcast **FF-FF-FF-FF-FF-FF**.
- **ARP: адрес IPv4 в MAC-адрес.** Локальный broadcast IPv4 **255.255.255.255**.
- Коммутатор: **учится по источнику, пересылает по назначению**. **Неизвестный unicast — во все порты, кроме входящего.**
- **Store-and-forward** проверяет CRC; **fast-forward** самый быстрый; **fragment-free** проверяет 64 байта.
- **Auto-MDIX** меняет местами пары передачи и приёма.
## Службы и порты
- **DNS** — имена, **DHCP** — адреса, **NAT** — частные в публичный, **SNMP** — мониторинг.
- FTP 20/21, **SSH 22**, **Telnet 23**, DNS 53, **HTTP 80**, **HTTPS 443**.
- **TCP** — надёжный, с соединением; рукопожатие **SYN, SYN-ACK, ACK**. **UDP** — без соединения.
- **ping** использует **ICMP Echo Request**. Фильтр Wireshark: **icmp**.
## Адреса
- Маска класса C **255.255.255.0**. **255.255.255.192 = /26**, .224 = /27.
- Loopback **127.0.0.1**. Частные: **10.0.0.0/8**, 172.16.0.0/12, 192.168.0.0/16.
- Fast Ethernet **100 Мбит/с**. **802.11ac** — 5 ГГц. **STP** предотвращает петли коммутации. Расстояние статического маршрута **1**.
## Сетевой уровень и маршрутизаторы
- IP — **без соединения, по возможности (best effort), независим от среды**. MTU Ethernet — **1500 байт**; маршрутизаторы фрагментируют только IPv4.
- Заголовок IPv4: **TTL** −1 на каждом маршрутизаторе (0 = отброс), **Protocol** 1 ICMP / 6 TCP / 17 UDP, **DS** = QoS, контрольная сумма — только заголовок.
- Заголовок IPv6: фиксированные **40 байт**; **Hop Limit** = TTL, **Traffic Class** = DS, **Next Header** = Protocol, **Flow Label** 20 бит.
- Хост: та же сеть — прямо хосту; другая сеть — **шлюзу по умолчанию**. Таблица маршрутизации: **route print** / **netstat -r**.
- **show ip route**: **C** подключённая сеть, **L** свой адрес интерфейса /32, **S** статический, S* по умолчанию, **O** OSPF, **D** EIGRP.
- **ARP-запрос = broadcast, ответ = unicast**; **arp -a** (ПК), **show ip arp** (маршрутизатор). IPv6: **NS/NA**, **RS/RA**, solicited-node **FF02::1:FF** + последние 24 бита.
- Интерфейсы маршрутизатора **по умолчанию выключены** — **no shutdown**. **line vty 0 4**, **transport input ssh**. Коммутатор: **ip default-gateway** для удалённого управления.
## Адресация IPv6 и ICMP
- IPv6: **128 бит**, hex, **8 хекстетов × 16 бит**. **Правило 1** — убираются только ведущие нули; **правило 2** — **::** заменяет одну цепочку нулевых хекстетов, **только один раз**.
- Сосуществование: **dual stack**, **tunneling** (IPv6 внутри IPv4), **трансляция NAT64**. Типы адресов: unicast, multicast, **anycast = «один к ближайшему»**; **broadcast нет**.
- **GUA 2000::/3** (начало 2 или 3), **LLA fe80::/10** (на каждом интерфейсе, не маршрутизируется), **ULA fc00::/7**, **multicast ff00::/8**, **::1** loopback, **::** unspecified; **ff02::1** все узлы, **ff02::2** все маршрутизаторы.
- GUA = **глобальный префикс /48 + 16-битный subnet ID + 64-битный interface ID**; /48 даёт **65 536** подсетей /64, счёт в hex (…9, a, b…).
- **ipv6 address 2001:db8:acad:1::1/64**, **ipv6 address fe80::1:1 link-local**, **ipv6 unicast-routing**; проверка — **show ipv6 interface brief** и **ipconfig**.
- RA = префикс + **шлюз по умолчанию (LLA-источник RA)** + DNS. Методы: **SLAAC**; **SLAAC + stateless DHCPv6** (DNS); **stateful DHCPv6** (GUA). **EUI-64**: fffe в середину + инвертировать 7-й бит.
- ICMP v4 и v6: **echo**, **destination unreachable** (port — код 3 в v4, код 4 в v6), **time exceeded** (TTL / Hop Limit). ND: **RS/RA**, **NS/NA** (DAD, разрешение адресов).
- Порядок проверки: **ping 127.0.0.1 / ::1** → **шлюз по умолчанию** → **удалённый хост**; **traceroute / tracert** увеличивает TTL 1, 2, 3…; звёздочка — нет ответа.`,
};
