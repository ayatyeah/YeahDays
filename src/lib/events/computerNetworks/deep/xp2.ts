import { qx, tfx, type Draft } from "../../types";

/** Разбор до косточек: сверх слайдов, часть 2 — основы IP-адресации, команды и прочие факты из вариантов. */
export const deepXP2: Draft[] = [
  qx("What is the default subnet mask of a Class A address?", "255.0.0.0", [
    ["255.255.0.0", "255.255.0.0 (/16) is the Class B default mask.", "255.255.0.0 (/16) — маска по умолчанию класса B."],
    ["255.255.255.0", "255.255.255.0 (/24) is the Class C default mask.", "255.255.255.0 (/24) — маска по умолчанию класса C."],
    ["255.255.255.255", "255.255.255.255 is the limited broadcast address, not a class mask.", "255.255.255.255 — ограниченный широковещательный адрес, а не маска класса."],
  ], "Class A uses 255.0.0.0, i.e. /8 — one octet of network bits.", "Класс A использует 255.0.0.0, то есть /8 — один октет под сеть."),

  qx("Which class has the default mask 255.255.0.0?", "Class B", [
    ["Class A", "Class A's default mask is 255.0.0.0 (/8), with only one network octet.", "У класса A маска по умолчанию 255.0.0.0 (/8), только один сетевой октет."],
    ["Class C", "Class C's default mask is 255.255.255.0 (/24), three network octets.", "У класса C маска по умолчанию 255.255.255.0 (/24), три сетевых октета."],
    ["Class D", "Class D is the multicast range 224–239 and has no default host mask.", "Класс D — диапазон multicast 224–239, маски для хостов у него нет."],
  ], "255.255.0.0 is /16, the default mask of Class B.", "255.255.0.0 — это /16, маска по умолчанию класса B."),

  qx("What prefix length corresponds to the mask 255.255.255.128?", "/25", [
    ["/24", "/24 ends in .0; the extra 128 in the last octet adds one more bit.", "/24 заканчивается на .0; дополнительное 128 в последнем октете добавляет ещё один бит."],
    ["/26", "/26 would be 255.255.255.192 (128 + 64), two extra bits.", "/26 — это 255.255.255.192 (128 + 64), два дополнительных бита."],
    ["/27", "/27 is 255.255.255.224 (128 + 64 + 32), three extra bits.", "/27 — это 255.255.255.224 (128 + 64 + 32), три дополнительных бита."],
  ], "128 in the last octet is a single one-bit after /24, giving /25.", "128 в последнем октете — один бит после /24, получается /25."),

  qx("Which mask equals /26?", "255.255.255.192", [
    ["255.255.255.128", "128 is one extra bit after /24, so it is /25, not /26.", "128 — один дополнительный бит после /24, это /25, а не /26."],
    ["255.255.255.224", "224 is three extra bits (128 + 64 + 32), so it is /27.", "224 — три дополнительных бита (128 + 64 + 32), это /27."],
    ["255.255.255.240", "240 is four extra bits (128 + 64 + 32 + 16), so it is /28.", "240 — четыре дополнительных бита (128 + 64 + 32 + 16), это /28."],
  ], "255.255.255.192 = /26: 24 bits plus two more, since 192 = 128 + 64.", "255.255.255.192 = /26: 24 бита плюс ещё два, ведь 192 = 128 + 64."),

  qx("What prefix is the mask 255.255.255.240?", "/28", [
    ["/27", "/27 is 224; 240 has one more one-bit (the 16).", "/27 — это 224; у 240 на один бит больше (16)."],
    ["/29", "/29 is 248 (240 + 8), one bit more than 240.", "/29 — это 248 (240 + 8), на один бит больше, чем 240."],
    ["/30", "/30 is 252, two bits more than 240.", "/30 — это 252, на два бита больше, чем 240."],
  ], "240 = 11110000, four extra bits after /24, so the prefix is /28.", "240 = 11110000, четыре бита после /24, поэтому префикс /28."),

  qx("What prefix is the mask 255.255.255.252?", "/30", [
    ["/28", "/28 is 240; 252 has two more one-bits (8 and 4).", "/28 — это 240; у 252 ещё два бита (8 и 4)."],
    ["/29", "/29 is 248; 252 adds the 4, making one more bit.", "/29 — это 248; 252 добавляет 4, ещё один бит."],
    ["/31", "/31 would be 254 (252 + 2) and is not in the notes' list.", "/31 был бы 254 (252 + 2), его нет в списке конспекта."],
  ], "252 = 11111100, six extra bits after /24, so the prefix is /30.", "252 = 11111100, шесть бит после /24, поэтому префикс /30."),

  qx("How many host addresses does a /24 subnet provide?", "254", [
    ["256", "256 is the total number of addresses; the network and broadcast addresses must be subtracted.", "256 — общее число адресов; надо вычесть адрес сети и широковещательный."],
    ["126", "126 hosts is a /25 subnet with 7 host bits.", "126 хостов — это подсеть /25 с 7 битами хоста."],
    ["255", "Subtracting only one reserved address is wrong; both network and broadcast are unusable.", "Вычесть лишь один зарезервированный адрес неверно; непригодны и адрес сети, и широковещательный."],
  ], "A /24 has 8 host bits: 2^8 − 2 = 254 usable host addresses.", "У /24 восемь бит хоста: 2^8 − 2 = 254 пригодных адреса."),

  qx("How many hosts fit in a 255.255.255.128 subnet?", "126", [
    ["128", "128 is the raw count of addresses; network and broadcast make it 126.", "128 — общее число адресов; минус сеть и broadcast получается 126."],
    ["254", "254 is the host count for /24, which has one more host bit.", "254 — число хостов в /24, где на один бит хоста больше."],
    ["62", "62 hosts is /26 (255.255.255.192), with 6 host bits.", "62 хоста — это /26 (255.255.255.192), 6 бит хоста."],
  ], "/25 leaves 7 host bits: 2^7 − 2 = 126 hosts.", "/25 оставляет 7 бит хоста: 2^7 − 2 = 126 хостов."),

  qx("A subnet uses mask 255.255.255.224. How many host addresses does it have?", "30", [
    ["32", "32 is the block size; the network and broadcast addresses are not assignable.", "32 — размер блока; адрес сети и broadcast назначить нельзя."],
    ["62", "62 is for /26 (mask 192); 224 has one more network bit.", "62 — для /26 (маска 192); у 224 на один сетевой бит больше."],
    ["14", "14 is for /28 (mask 240), one more network bit than 224.", "14 — для /28 (маска 240), на один сетевой бит больше, чем у 224."],
  ], "255.255.255.224 is /27, leaving 5 host bits: 2^5 − 2 = 30 hosts.", "255.255.255.224 — это /27, остаётся 5 бит хоста: 2^5 − 2 = 30 хостов."),

  qx("How many hosts does a /28 subnet provide?", "14", [
    ["16", "16 is the block size; two addresses are reserved, leaving 14.", "16 — размер блока; два адреса зарезервированы, остаётся 14."],
    ["30", "30 is /27; /28 has one host bit fewer.", "30 — это /27; у /28 на один бит хоста меньше."],
    ["6", "6 hosts would be /29 (248), which is not in the hosts table.", "6 хостов — это /29 (248), которого нет в таблице хостов."],
  ], "/28 leaves 4 host bits: 2^4 − 2 = 14.", "/28 оставляет 4 бита хоста: 2^4 − 2 = 14."),

  qx("Which formula gives the usable host count for a prefix with 5 host bits?", "2^5 − 2", [
    ["2^5", "2^5 = 32 counts the network and broadcast addresses, which hosts cannot use.", "2^5 = 32 включает адрес сети и broadcast, которые хостам недоступны."],
    ["2^5 − 1", "Only one address subtracted leaves the broadcast address counted as a host.", "Если вычесть только один адрес, broadcast останется посчитанным как хост."],
    ["2^27 − 2", "27 is the number of network bits; the exponent must be the host bits, 5.", "27 — число сетевых бит; в показателе должны быть биты хоста, то есть 5."],
  ], "Hosts = 2^(host bits) − 2; for /27 that is 2^5 − 2 = 30.", "Хостов = 2^(биты хоста) − 2; для /27 это 2^5 − 2 = 30."),

  qx("Which address is the loopback used to test the local network stack?", "127.0.0.1", [
    ["0.0.0.0", "0.0.0.0 means 'any' or 'no address yet'; it does not loop back to the host.", "0.0.0.0 означает «любой» или «адреса ещё нет»; на сам хост он не замыкается."],
    ["169.254.0.1", "169.254.x.x is a link-local address assigned when DHCP does not answer.", "169.254.x.x — link-local адрес, назначаемый, когда DHCP не ответил."],
    ["255.255.255.255", "255.255.255.255 is the limited broadcast to everyone on the local network.", "255.255.255.255 — ограниченный broadcast всем в локальной сети."],
  ], "127.0.0.1 is the loopback: packets to it never leave the host.", "127.0.0.1 — loopback: пакеты на него не покидают хост."),

  qx("What is 255.255.255.255?", "The limited IPv4 broadcast address", [
    ["The default subnet mask for a Class C", "The Class C mask is 255.255.255.0; the last octet is 0, not 255.", "Маска класса C — 255.255.255.0; последний октет 0, а не 255."],
    ["The loopback address", "Loopback is 127.0.0.1.", "Loopback — это 127.0.0.1."],
    ["The top of the multicast range", "The multicast range ends at 239.255.255.255.", "Диапазон multicast заканчивается на 239.255.255.255."],
  ], "255.255.255.255 is the limited broadcast — everyone on the local network.", "255.255.255.255 — ограниченный broadcast, всем в локальной сети."),

  qx("What does the address 0.0.0.0 mean?", "'Any' address or 'no address yet'", [
    ["The local loopback", "Loopback is 127.0.0.1, not 0.0.0.0.", "Loopback — 127.0.0.1, а не 0.0.0.0."],
    ["The local broadcast", "The limited broadcast is all ones, 255.255.255.255.", "Ограниченный broadcast — все единицы, 255.255.255.255."],
    ["A private address from RFC 1918 ranges", "Private ranges are 10/8, 172.16/12 and 192.168/16; 0.0.0.0 is not among them.", "Частные диапазоны — 10/8, 172.16/12 и 192.168/16; 0.0.0.0 к ним не относится."],
  ], "0.0.0.0 stands for 'any' or 'no address assigned yet'.", "0.0.0.0 означает «любой» или «адреса ещё нет»."),

  qx("Which range is reserved for multicast?", "224.0.0.0 – 239.255.255.255", [
    ["127.0.0.0 – 127.255.255.255", "The 127 block is loopback.", "Блок 127 — loopback."],
    ["169.254.0.0 – 169.254.255.255", "169.254.0.0/16 is link-local, used when DHCP fails.", "169.254.0.0/16 — link-local, используется при отказе DHCP."],
    ["240.0.0.0 – 255.255.255.255", "240 and above is beyond the multicast range, which stops at 239.", "240 и выше — за пределами диапазона multicast, который кончается на 239."],
  ], "Multicast (Class D) is 224.0.0.0 through 239.255.255.255.", "Multicast (класс D) — от 224.0.0.0 до 239.255.255.255."),

  qx("A laptop got the address 169.254.3.7. What happened?", "DHCP did not answer; it self-assigned link-local", [
    ["It received a public address", "169.254.0.0/16 is never routed on the internet; it is link-local only.", "169.254.0.0/16 в интернете не маршрутизируется; это только link-local."],
    ["It joined a multicast group", "Multicast addresses start at 224; 169.254 is a host address range.", "Адреса multicast начинаются с 224; 169.254 — диапазон адресов хостов."],
    ["The DHCP server gave it a private RFC 1918 address", "RFC 1918 private ranges are 10/8, 172.16/12 and 192.168/16; 169.254 means DHCP failed.", "Частные диапазоны RFC 1918 — 10/8, 172.16/12 и 192.168/16; 169.254 значит, что DHCP не сработал."],
  ], "169.254.0.0/16 is link-local: the host picked it itself because no DHCP reply arrived.", "169.254.0.0/16 — link-local: хост выбрал его сам, потому что ответа DHCP не было."),

  qx("Which address is inside an RFC 1918 private range?", "172.20.5.1", [
    ["172.32.0.1", "The private 172 block ends at 172.31.255.255; 172.32 is public.", "Частный блок 172 кончается на 172.31.255.255; 172.32 — публичный."],
    ["11.0.0.1", "The private Class A block is only 10.0.0.0/8; 11.x.x.x is public.", "Частный блок класса A — только 10.0.0.0/8; 11.x.x.x — публичный."],
    ["192.169.1.1", "Private is 192.168.0.0/16 exactly; 192.169 falls outside it.", "Частный — ровно 192.168.0.0/16; 192.169 в него не входит."],
  ], "172.16.0.0 – 172.31.255.255 is private, and 172.20.5.1 lies within it.", "172.16.0.0 – 172.31.255.255 — частный диапазон, и 172.20.5.1 в него входит."),

  qx("Which are the three RFC 1918 private ranges?", "10/8, 172.16/12, 192.168/16", [
    ["10/8, 172.16/16, 192.168/24", "The 172 block is /12 (172.16 – 172.31) and the 192.168 block is /16, not /16 and /24.", "Блок 172 — /12 (172.16 – 172.31), а блок 192.168 — /16, а не /16 и /24."],
    ["127/8, 169.254/16, 224/4", "Those are loopback, link-local and multicast — special, but not RFC 1918 private.", "Это loopback, link-local и multicast — особые адреса, но не частные по RFC 1918."],
    ["10/8, 172.0/8, 192.0/8", "Only 172.16 – 172.31 and 192.168 are private, not the whole 172 and 192 blocks.", "Частные только 172.16 – 172.31 и 192.168, а не целые блоки 172 и 192."],
  ], "RFC 1918 reserves 10.0.0.0/8, 172.16.0.0/12 and 192.168.0.0/16; they need NAT to reach the internet.", "RFC 1918 резервирует 10.0.0.0/8, 172.16.0.0/12 и 192.168.0.0/16; для выхода в интернет им нужен NAT."),

  qx("A host with 10.5.5.5 needs to reach a public web server. What must the border router perform?", "NAT", [
    ["DHCP", "DHCP assigns addresses; it does not make a private address usable on the internet.", "DHCP выдаёт адреса; частный адрес пригодным для интернета он не делает."],
    ["STP", "STP prevents switching loops and has nothing to do with addressing.", "STP предотвращает петли коммутации и к адресации не относится."],
    ["ARP", "ARP works only within the local segment to find MACs.", "ARP работает только внутри локального сегмента для поиска MAC."],
  ], "Private RFC 1918 addresses are not routed on the internet, so NAT translates them into a public address.", "Частные адреса RFC 1918 в интернете не маршрутизируются, поэтому NAT переводит их в публичный."),

  qx("Which command shows the local IP configuration in the Windows CLI?", "ipconfig", [
    ["ifconfig", "ifconfig is the Linux and macOS equivalent, not the Windows command.", "ifconfig — аналог в Linux и macOS, а не команда Windows."],
    ["show ip interface brief", "That is a Cisco IOS command, not a Windows one.", "Это команда Cisco IOS, а не Windows."],
    ["nslookup", "nslookup queries DNS; it does not show the host's own IP settings.", "nslookup опрашивает DNS; собственные настройки IP хоста он не показывает."],
  ], "ipconfig is the Windows command; Linux and macOS use ifconfig or ip.", "ipconfig — команда Windows; в Linux и macOS используют ifconfig или ip."),

  qx("Which PC command is used for DNS queries?", "nslookup", [
    ["ping", "ping tests reachability; resolving a name is only a side effect.", "ping проверяет доступность; разрешение имени — лишь побочный эффект."],
    ["tracert", "tracert shows the path hop by hop, not DNS records.", "tracert показывает путь по узлам, а не записи DNS."],
    ["arp -a", "arp -a lists IP-to-MAC mappings from the ARP cache.", "arp -a выводит соответствия IP — MAC из кэша ARP."],
  ], "nslookup sends DNS queries and shows the answers.", "nslookup отправляет запросы DNS и показывает ответы."),

  qx("Which command displays the ARP cache on a PC?", "arp -a", [
    ["ipconfig", "ipconfig shows the host's IP settings, not the ARP cache.", "ipconfig показывает настройки IP хоста, а не кэш ARP."],
    ["nslookup", "nslookup is for DNS, not for MAC mappings.", "nslookup — для DNS, а не для соответствий MAC."],
    ["show mac address-table", "That is the Cisco IOS switch command the table pairs with arp -a, not a PC command.", "Это команда коммутатора Cisco IOS, с которой таблица сопоставляет arp -a, а не команда ПК."],
  ], "arp -a prints the ARP cache: which MAC belongs to which IP.", "arp -a печатает кэш ARP: какой MAC у какого IP."),

  qx("What is the Windows name of the tool that Cisco IOS calls traceroute?", "tracert", [
    ["traceroute", "traceroute is the IOS (and Linux) spelling; Windows shortens it to tracert.", "traceroute — написание в IOS (и Linux); Windows сокращает до tracert."],
    ["pathping", "pathping is a different Windows tool and is not in the notes' comparison table.", "pathping — другая утилита Windows, её нет в таблице конспекта."],
    ["route print", "route print shows the local routing table, not the path to a host.", "route print выводит локальную таблицу маршрутов, а не путь к хосту."],
  ], "The comparison table pairs Windows tracert with Cisco IOS traceroute.", "В таблице сравнения Windows tracert соответствует traceroute в Cisco IOS."),

  qx("Which Cisco IOS command shows the operational status and IP address of all interfaces?", "show ip interface brief", [
    ["show running-config", "show running-config prints the whole current configuration, not a status summary.", "show running-config печатает всю текущую конфигурацию, а не сводку состояния."],
    ["show vlan brief", "show vlan brief lists VLANs and their ports, not interface IPs.", "show vlan brief выводит VLAN и их порты, а не IP интерфейсов."],
    ["show version", "show version reports IOS version and hardware, not interface status.", "show version сообщает версию IOS и оборудование, а не состояние интерфейсов."],
  ], "show ip interface brief gives one line per interface with IP address and status.", "show ip interface brief выводит по строке на интерфейс с IP-адресом и состоянием."),

  qx("Which Cisco IOS command displays the current configuration?", "show running-config", [
    ["show ip interface brief", "That shows interface status and addresses only, not the configuration.", "Это показывает лишь состояние и адреса интерфейсов, а не конфигурацию."],
    ["show mac address-table", "That shows the Layer 2 address table of a switch.", "Это показывает таблицу адресов уровня 2 на коммутаторе."],
    ["show version", "show version is about IOS version and hardware.", "show version — о версии IOS и оборудовании."],
  ], "show running-config displays the configuration currently in effect.", "show running-config показывает действующую сейчас конфигурацию."),

  qx("Which IOS command lists VLANs and the ports assigned to them?", "show vlan brief", [
    ["show ip interface brief", "That lists interfaces with IPs and status, not VLAN membership.", "Это список интерфейсов с IP и состоянием, а не принадлежность к VLAN."],
    ["show mac address-table", "That lists learned MACs per port, not VLAN definitions.", "Это список выученных MAC по портам, а не определения VLAN."],
    ["show running-config", "The config contains VLAN lines, but the summary of VLANs and ports is show vlan brief.", "В конфигурации есть строки VLAN, но сводку VLAN и портов даёт show vlan brief."],
  ], "show vlan brief shows VLANs and their ports.", "show vlan brief показывает VLAN и их порты."),

  qx("Which Wireshark display filter shows only ICMP traffic?", "icmp", [
    ["ip.proto == icmp", "Wireshark compares ip.proto with a number, and the simple protocol name is the filter the notes give.", "Wireshark сравнивает ip.proto с числом, а конспект даёт просто имя протокола как фильтр."],
    ["show icmp", "show is Cisco IOS syntax, not a Wireshark filter.", "show — синтаксис Cisco IOS, а не фильтр Wireshark."],
    ["protocol.icmp", "There is no such field; the protocol name alone is enough.", "Такого поля нет; достаточно одного имени протокола."],
  ], "Typing icmp in the display filter leaves only Echo Request and Echo Reply packets.", "Ввод icmp в фильтр отображения оставляет только пакеты Echo Request и Echo Reply."),

  qx("Which Wireshark filter isolates all packets to or from 192.168.1.10?", "ip.addr == 192.168.1.10", [
    ["ping 192.168.1.10", "ping is a command, not a display filter.", "ping — команда, а не фильтр отображения."],
    ["ip.address == 192.168.1.10", "There is no field ip.address in Wireshark; the address field is spelled ip.addr.", "Поля ip.address в Wireshark нет; поле адреса пишется ip.addr."],
    ["host 192.168.1.10", "host is capture-filter (BPF) syntax, not the display-filter form in the notes.", "host — синтаксис фильтра захвата (BPF), а не фильтра отображения из конспекта."],
  ], "The notes list ip.addr == 192.168.1.10 among simple filters, alongside arp, dns and tcp.", "В конспекте ip.addr == 192.168.1.10 перечислен среди простых фильтров вместе с arp, dns и tcp."),

  qx("What is the speed of Fast Ethernet?", "100 Mbps", [
    ["10 Mbps", "10 Mbps is the original Ethernet.", "10 Мбит/с — исходный Ethernet."],
    ["1 Gbps", "1 Gbps is Gigabit Ethernet.", "1 Гбит/с — Gigabit Ethernet."],
    ["10 Gbps", "10 Gbps is 10 Gigabit Ethernet.", "10 Гбит/с — 10 Gigabit Ethernet."],
  ], "Ethernet 10 Mbps, Fast Ethernet 100 Mbps, Gigabit 1 Gbps, 10 Gigabit 10 Gbps.", "Ethernet — 10 Мбит/с, Fast Ethernet — 100 Мбит/с, Gigabit — 1 Гбит/с, 10 Gigabit — 10 Гбит/с."),

  qx("Which Wi-Fi standard operates in both the 2.4 GHz and 5 GHz bands?", "802.11n", [
    ["802.11b", "802.11b is 2.4 GHz only.", "802.11b — только 2,4 ГГц."],
    ["802.11g", "802.11g is 2.4 GHz only.", "802.11g — только 2,4 ГГц."],
    ["802.11ac", "802.11ac is 5 GHz only.", "802.11ac — только 5 ГГц."],
  ], "802.11n is the dual-band standard: 2.4 and 5 GHz.", "802.11n — двухдиапазонный стандарт: 2,4 и 5 ГГц."),

  qx("Which standard works at 5 GHz with multi-gigabit speeds?", "802.11ac", [
    ["802.11b", "802.11b is an early 2.4 GHz standard with low speeds.", "802.11b — ранний стандарт 2,4 ГГц с низкими скоростями."],
    ["802.11g", "802.11g is 2.4 GHz and far below gigabit.", "802.11g — 2,4 ГГц и далеко до гигабита."],
    ["802.3", "802.3 is wired Ethernet, not a Wi-Fi standard.", "802.3 — проводной Ethernet, а не стандарт Wi-Fi."],
  ], "802.11ac uses the 5 GHz band and reaches multi-gigabit speeds.", "802.11ac работает в диапазоне 5 ГГц и достигает скоростей больше гигабита."),

  qx("What does the IEEE 802.3 standard define?", "Wired Ethernet", [
    ["2.4 GHz Wi-Fi", "2.4 GHz Wi-Fi is 802.11b/g (and n).", "Wi-Fi на 2,4 ГГц — это 802.11b/g (и n)."],
    ["5 GHz Wi-Fi", "5 GHz Wi-Fi is 802.11ac (and n).", "Wi-Fi на 5 ГГц — это 802.11ac (и n)."],
    ["Spanning tree", "Spanning tree is 802.1D, a separate standard not listed in the notes.", "Связующее дерево — 802.1D, отдельный стандарт, не упомянутый в конспекте."],
  ], "802.3 is wired Ethernet; all the Wi-Fi standards are 802.11.", "802.3 — проводной Ethernet; все стандарты Wi-Fi — 802.11."),

  qx("Which protocol prevents switching loops in a LAN with redundant links?", "STP", [
    ["NAT", "NAT translates addresses on a router; it has no effect on Layer 2 loops.", "NAT транслирует адреса на маршрутизаторе; на петли уровня 2 он не влияет."],
    ["OSPF", "OSPF is a Layer 3 routing protocol; it does not block redundant switch links.", "OSPF — протокол маршрутизации уровня 3; избыточные линки коммутаторов он не блокирует."],
    ["DHCP", "DHCP assigns addresses and is unrelated to loops.", "DHCP выдаёт адреса и к петлям отношения не имеет."],
  ], "STP blocks redundant paths so that frames do not loop forever in an Ethernet network.", "STP блокирует избыточные пути, чтобы кадры не ходили по кругу в сети Ethernet."),

  qx("What is the administrative distance of a directly connected interface in Cisco IOS?", "0", [
    ["1", "1 is the administrative distance of a static route.", "1 — административное расстояние статического маршрута."],
    ["90", "90 is EIGRP.", "90 — EIGRP."],
    ["110", "110 is OSPF.", "110 — OSPF."],
  ], "Connected is 0, static 1, EIGRP 90, OSPF 110.", "Подключённый интерфейс — 0, статический — 1, EIGRP — 90, OSPF — 110."),

  qx("Which administrative distance values do EIGRP and OSPF have?", "EIGRP 90, OSPF 110", [
    ["EIGRP 110, OSPF 90", "The values are swapped: EIGRP is the lower one, 90.", "Значения перепутаны: у EIGRP меньшее — 90."],
    ["EIGRP 1, OSPF 0", "0 and 1 belong to connected interfaces and static routes.", "0 и 1 относятся к подключённым интерфейсам и статическим маршрутам."],
    ["EIGRP 100, OSPF 120", "Neither 100 nor 120 appears in the notes; the pair is 90 and 110.", "Ни 100, ни 120 в конспекте нет; пара — 90 и 110."],
  ], "In Cisco IOS EIGRP has administrative distance 90 and OSPF 110.", "В Cisco IOS административное расстояние EIGRP — 90, OSPF — 110."),

  tfx("A /25 subnet provides 128 usable host addresses.", false,
    "A /25 has 7 host bits, 2^7 = 128 addresses in total, but two are reserved, leaving 126 usable hosts.",
    "У /25 семь бит хоста, всего 2^7 = 128 адресов, но два зарезервированы, остаётся 126 пригодных.",
    "Answering True forgets to subtract the network and broadcast addresses from the block size.",
    "Ответ «верно» забывает вычесть из размера блока адрес сети и широковещательный."),

  tfx("According to the comparison table, Cisco IOS has a direct equivalent of the Windows nslookup command.", false,
    "The table shows a dash for name lookup on the IOS side; only Windows has nslookup listed.",
    "В таблице для запроса имени на стороне IOS стоит прочерк; nslookup указан только для Windows.",
    "Answering True would also need a Windows equivalent of show running-config, which the table likewise leaves blank.",
    "Ответ «верно» потребовал бы и аналога show running-config в Windows, а таблица и его оставляет пустым."),
];
