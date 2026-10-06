import { qx, tfx, type Draft } from "../../types";

export const deepL4P3: Draft[] = [
  qx("How many bits long is an Ethernet MAC address?", "48 bits", [
    ["32 bits", "32 bits is the length of an IPv4 address, not a MAC address.", "32 бита — длина адреса IPv4, а не MAC-адреса."],
    ["24 bits", "24 bits is only the OUI, the first half of the MAC address.", "24 бита — это только OUI, первая половина MAC-адреса."],
    ["128 bits", "128 bits is the length of an IPv6 address.", "128 бит — длина адреса IPv6."],
  ], "A MAC address is a 48-bit value, written as 12 hexadecimal digits, which is 6 bytes.", "MAC-адрес — 48-битное значение, записанное 12 шестнадцатеричными цифрами, то есть 6 байт."),

  qx("How many hexadecimal digits are used to write a MAC address?", "12", [
    ["6", "6 is the number of bytes in a MAC address, or the hex digits of the OUI alone.", "6 — число байт в MAC-адресе или шестнадцатеричных цифр только в OUI."],
    ["8", "8 hex digits would be only 32 bits, the size of an IPv4 address.", "8 шестнадцатеричных цифр — всего 32 бита, размер адреса IPv4."],
    ["16", "16 hex digits would be 64 bits, longer than any MAC address.", "16 шестнадцатеричных цифр — 64 бита, длиннее любого MAC-адреса."],
  ], "48 bits are written as 12 hexadecimal digits, since each hex digit represents 4 bits.", "48 бит записываются 12 шестнадцатеричными цифрами, ведь каждая цифра — это 4 бита."),

  qx("How many bytes is a MAC address?", "6 bytes", [
    ["3 bytes", "3 bytes is the size of the OUI, half of the address.", "3 байта — размер OUI, половина адреса."],
    ["4 bytes", "4 bytes is the size of an IPv4 address or of the Ethernet FCS.", "4 байта — размер адреса IPv4 или FCS Ethernet."],
    ["12 bytes", "12 is the number of hex digits, not bytes; two hex digits make one byte.", "12 — число шестнадцатеричных цифр, а не байт; две цифры дают один байт."],
  ], "48 bits = 12 hex digits = 6 bytes.", "48 бит = 12 шестнадцатеричных цифр = 6 байт."),

  qx("Which two notations mark a value as hexadecimal according to the notes?", "0x in front or H after, as in 0x73 and 73H", [
    ["# in front or h in the middle, as in #73 and 7h3", "The notes give only the 0x prefix and the H suffix as hexadecimal markers.", "В конспекте указаны только префикс 0x и суффикс H как признаки шестнадцатеричной записи."],
    ["0b in front or B after", "0b and B indicate binary, not hexadecimal.", "0b и B обозначают двоичную запись, а не шестнадцатеричную."],
    ["% in front or D after", "Neither % nor D is a hexadecimal marker in the notes.", "Ни %, ни D не являются признаком шестнадцатеричной записи по конспекту."],
  ], "Hex values can be written with 0x in front (0x73) or with an H after (73H).", "Шестнадцатеричные значения пишут с 0x впереди (0x73) или с H после (73H)."),

  qx("What is the hexadecimal representation of binary 0000 1010?", "0A", [
    ["A", "The leading zero is kept, so the byte is written as 0A, not A.", "Ведущий ноль сохраняется, поэтому байт записывается как 0A, а не A."],
    ["10", "10 in hex would be binary 0001 0000; 0000 1010 is decimal ten, hex 0A.", "10 в hex — это двоичное 0001 0000; 0000 1010 — десятичное десять, hex 0A."],
    ["A0", "A0 would be binary 1010 0000, with the bits in the wrong nibble.", "A0 — это двоичное 1010 0000, биты в не той половине байта."],
  ], "Leading zeroes are kept: binary 0000 1010 is written as 0A.", "Ведущие нули сохраняются: двоичное 0000 1010 записывается как 0A."),

  qx("With which organization does a vendor register to receive an OUI?", "IEEE", [
    ["IANA", "IANA allocates IP address blocks and port numbers, not MAC OUIs.", "IANA распределяет блоки IP-адресов и порты, а не OUI MAC-адресов."],
    ["IETF", "The IETF writes Internet protocol RFCs; it does not assign hardware identifiers.", "IETF пишет RFC интернет-протоколов и не выдаёт аппаратные идентификаторы."],
    ["ISO", "ISO is a standards body but does not assign OUIs to vendors.", "ISO — организация по стандартам, но OUI производителям не выдаёт."],
  ], "A vendor registers with the IEEE and receives an Organizationally Unique Identifier.", "Производитель регистрируется в IEEE и получает уникальный идентификатор организации."),

  qx("How long is an Organizationally Unique Identifier (OUI)?", "24 bits, that is 3 bytes or 6 hex digits", [
    ["48 bits, that is 6 bytes or 12 hex digits", "48 bits is the whole MAC address; the OUI is only its first half.", "48 бит — весь MAC-адрес; OUI — лишь первая половина."],
    ["16 bits, that is 2 bytes or 4 hex digits", "16 bits is the size of the EtherType field, not of the OUI.", "16 бит — размер поля EtherType, а не OUI."],
    ["32 bits, that is 4 bytes or 8 hex digits", "32 bits is an IPv4 address length, not an OUI.", "32 бита — длина адреса IPv4, а не OUI."],
  ], "The OUI is a 24-bit (3-byte, 6 hex digit) code assigned by the IEEE.", "OUI — 24-битный (3 байта, 6 шестнадцатеричных цифр) код, выданный IEEE."),

  qx("In the MAC address 00:1A:2B:3C:4D:5E, which part is assigned by the vendor itself?", "3C:4D:5E", [
    ["00:1A:2B", "The first 3 bytes are the OUI assigned by the IEEE, not by the vendor.", "Первые 3 байта — OUI, выданный IEEE, а не производителем."],
    ["00:1A", "The OUI is 3 bytes and the vendor part is the last 3 bytes; 2 bytes is neither.", "OUI — 3 байта, а часть производителя — последние 3 байта; 2 байта не подходят."],
    ["2B:3C:4D", "The vendor-assigned value is the last 3 bytes, not the middle 3.", "Значение производителя — последние 3 байта, а не средние."],
  ], "The first 3 bytes are the OUI; the last 3 bytes are assigned by the vendor.", "Первые 3 байта — OUI; последние 3 байта назначает производитель."),

  qx("Complete the callout: 'First half — who made it, second half — ___.'", "Which card", [
    ["Which network", "The network is identified by the IP address, not by any half of the MAC.", "Сеть определяется IP-адресом, а не половиной MAC."],
    ["Which protocol", "The protocol is given by the EtherType field, not by the MAC address.", "Протокол задаёт поле EtherType, а не MAC-адрес."],
    ["Which port", "Switch ports are learned from source MACs, but the address itself does not encode a port.", "Порты коммутатор узнаёт по MAC источника, но сам адрес порт не кодирует."],
  ], "The OUI half tells who made the card; the vendor-assigned half tells which specific card it is.", "Половина OUI говорит, кто сделал карту; половина производителя — какая именно это карта."),

  qx("Which two addresses does an Ethernet header carry?", "A source MAC and a destination MAC", [
    ["A source IP and a destination IP", "IP addresses are in the Layer 3 packet header, not the Ethernet header.", "IP-адреса находятся в заголовке пакета уровня 3, а не в заголовке Ethernet."],
    ["A destination MAC and a destination IP", "The Ethernet header has two MAC addresses; the IP address is inside the payload.", "В заголовке Ethernet два MAC-адреса; IP-адрес внутри полезной нагрузки."],
    ["A source port and a destination port", "Ports are transport layer fields, not part of the frame header.", "Порты — поля транспортного уровня, а не часть заголовка кадра."],
  ], "The Ethernet header carries a source MAC and a destination MAC.", "В заголовке Ethernet есть MAC источника и MAC назначения."),

  qx("Where does a NIC keep its own MAC address for comparing with incoming frames?", "In RAM", [
    ["In the FCS field", "The FCS is a CRC in the frame trailer, not a place where a NIC stores its address.", "FCS — это CRC в концевике кадра, а не место хранения адреса карты."],
    ["In the ARP cache", "The ARP cache maps other hosts' IPs to MACs; the NIC's own address is in RAM.", "Кэш ARP хранит соответствия IP и MAC других хостов; собственный адрес карты — в RAM."],
    ["In the routing table", "A routing table is a Layer 3 structure on a router, not NIC storage.", "Таблица маршрутизации — структура уровня 3 на маршрутизаторе, а не хранилище карты."],
  ], "A NIC compares the destination MAC with its own address stored in RAM.", "Сетевая карта сравнивает MAC назначения со своим адресом, хранящимся в RAM."),

  qx("A unicast frame arrives at a NIC whose MAC does not match the destination. What does the NIC do?", "Discards the frame", [
    ["Forwards it to the default gateway", "A NIC does not forward frames; only switches and routers forward.", "Карта кадры не пересылает; этим занимаются коммутаторы и маршрутизаторы."],
    ["Passes it up for de-encapsulation", "Only a matching frame (or broadcast / its multicast) goes up the layers.", "Вверх по уровням идёт только совпавший кадр (или broadcast / своя группа multicast)."],
    ["Sends an ARP reply to the sender", "ARP replies answer ARP requests; a non-matching frame is silently dropped.", "ARP-ответы даются на ARP-запросы; несовпавший кадр молча отбрасывается."],
  ], "No match — the frame is discarded.", "Не совпал — кадр отбрасывается."),

  qx("What happens to a frame whose destination MAC matches the NIC's own address?", "It goes up the layers for de-encapsulation", [
    ["It is flooded to all other hosts", "Flooding is a switch behaviour for broadcasts; a NIC processes a matching frame itself.", "Рассылка во все порты — поведение коммутатора для broadcast; карта обрабатывает совпавший кадр сама."],
    ["It is discarded as a duplicate", "Only non-matching frames are discarded; a match means the frame is for this host.", "Отбрасываются только несовпавшие кадры; совпадение означает, что кадр для этого хоста."],
    ["It is sent back as an acknowledgement", "Ethernet has no frame acknowledgements.", "В Ethernet нет подтверждений кадров."],
  ], "A match — the frame is passed up the layers to be de-encapsulated.", "Совпал — кадр идёт вверх по уровням на деинкапсуляцию."),

  qx("Besides its own unicast address, which frames does a NIC also accept?", "Broadcast frames and frames for a multicast group it belongs to", [
    ["Frames for any multicast group on the LAN", "A NIC accepts only multicast groups it has joined, not every group.", "Карта принимает только группы multicast, в которые входит, а не все подряд."],
    ["Frames addressed to its default gateway", "Frames for the gateway carry the gateway's MAC, which does not match the host.", "Кадры для шлюза несут MAC шлюза, который хосту не подходит."],
    ["Frames with any source MAC from its OUI", "Acceptance depends on the destination MAC, not on the source vendor.", "Приём зависит от MAC назначения, а не от производителя источника."],
  ], "A NIC also accepts a frame addressed to the broadcast address or to a multicast group it belongs to.", "Карта также принимает кадр с широковещательным адресом или адресом своей группы multicast."),

  qx("What is a unicast MAC address?", "The unique address for a frame from one device to one device", [
    ["An address received and processed by every device on the LAN", "That describes the broadcast address FF-FF-FF-FF-FF-FF.", "Это описание широковещательного адреса FF-FF-FF-FF-FF-FF."],
    ["An address received by a group of devices", "A group destination is a multicast address.", "Адрес для группы — это multicast."],
    ["An address that only appears as a destination", "Multicast and broadcast are destination-only; a unicast can be source or destination.", "Только в назначении бывают multicast и broadcast; unicast бывает и источником, и назначением."],
  ], "A unicast MAC is the unique address used when a frame is sent from one device to one device.", "Одноадресный MAC — уникальный адрес, когда кадр идёт от одного устройства одному устройству."),

  qx("A host knows a neighbour's IPv4 address but not its MAC. Which protocol does it use?", "ARP", [
    ["ND", "Neighbor Discovery resolves MAC addresses for IPv6, not IPv4.", "Neighbor Discovery находит MAC для IPv6, а не для IPv4."],
    ["DNS", "DNS maps names to IP addresses; it knows nothing about MAC addresses.", "DNS сопоставляет имена с IP-адресами и ничего не знает о MAC."],
    ["DHCP", "DHCP assigns IP configuration; it does not resolve IPv4 to MAC.", "DHCP выдаёт IP-настройки и не переводит IPv4 в MAC."],
  ], "A host finds the destination MAC for an IPv4 address with ARP, the Address Resolution Protocol.", "MAC назначения для адреса IPv4 хост находит через ARP — протокол разрешения адресов."),

  qx("Which protocol finds the destination MAC for an IPv6 address?", "Neighbor Discovery (ND)", [
    ["Address Resolution Protocol (ARP)", "ARP is used for IPv4; IPv6 replaces it with Neighbor Discovery.", "ARP используется для IPv4; в IPv6 его заменяет Neighbor Discovery."],
    ["Internet Control Message Protocol (ICMP)", "The notes name ND specifically as the IPv6 mechanism for MAC resolution.", "В конспекте механизмом разрешения MAC в IPv6 назван именно ND."],
    ["Dynamic Host Configuration Protocol (DHCP)", "DHCP distributes addresses; it does not resolve an IPv6 address to a MAC.", "DHCP раздаёт адреса и не находит MAC по адресу IPv6."],
  ], "For an IPv6 address the host uses Neighbor Discovery (ND).", "Для адреса IPv6 хост использует Neighbor Discovery (ND)."),

  qx("What does ARP stand for?", "Address Resolution Protocol", [
    ["Address Routing Protocol", "ARP does not route; it resolves an IPv4 address to a MAC address.", "ARP не маршрутизирует; он находит MAC по адресу IPv4."],
    ["Automatic Registration Protocol", "ARP registers nothing; it maps a known IPv4 address to a MAC.", "ARP ничего не регистрирует; он сопоставляет известный адрес IPv4 с MAC."],
    ["Adapter Reporting Protocol", "This is not a real protocol name; ARP is Address Resolution Protocol.", "Такого протокола нет; ARP — Address Resolution Protocol."],
  ], "ARP is the Address Resolution Protocol, used to find the MAC for a known IPv4 address.", "ARP — протокол разрешения адресов, которым находят MAC по известному адресу IPv4."),

  qx("Which statement about the source MAC address of a frame is always true?", "It is a unicast address", [
    ["It may be a broadcast address", "Broadcast only appears as a destination; a source is always one specific NIC.", "Broadcast бывает только в назначении; источник — всегда одна конкретная карта."],
    ["It may be a multicast address", "A multicast address can only be a destination, never a source.", "Групповой адрес может быть только адресом назначения, но не источника."],
    ["It starts with 01-00-5E", "01-00-5E is the IPv4 multicast prefix and is never used as a source.", "01-00-5E — префикс multicast IPv4, в источнике не встречается."],
  ], "The source MAC is always a unicast address.", "MAC источника — всегда одноадресный."),

  qx("What is the Ethernet broadcast MAC address?", "FF-FF-FF-FF-FF-FF", [
    ["00-00-00-00-00-00", "All zeros is not the broadcast address; broadcast is all ones.", "Все нули — не широковещательный адрес; broadcast — все единицы."],
    ["01-00-5E-00-00-00", "01-00-5E is the IPv4 multicast prefix, not broadcast.", "01-00-5E — префикс multicast IPv4, а не broadcast."],
    ["33-33-FF-FF-FF-FF", "33-33 is the IPv6 multicast prefix, not broadcast.", "33-33 — префикс multicast IPv6, а не broadcast."],
  ], "The broadcast destination MAC is FF-FF-FF-FF-FF-FF.", "Широковещательный MAC назначения — FF-FF-FF-FF-FF-FF."),

  qx("How is FF-FF-FF-FF-FF-FF written in binary?", "48 ones", [
    ["48 zeros", "48 zeros would be 00-00-00-00-00-00, not the broadcast address.", "48 нулей — это 00-00-00-00-00-00, а не широковещательный адрес."],
    ["32 ones", "32 ones is an all-ones IPv4 address; a MAC has 48 bits.", "32 единицы — IPv4-адрес из единиц; в MAC 48 бит."],
    ["24 ones and 24 zeros", "Each F is 1111, so all twelve digits give 48 ones with no zeros.", "Каждая F — это 1111, так что двенадцать цифр дают 48 единиц без нулей."],
  ], "The broadcast MAC is 48 ones in binary.", "Широковещательный MAC — 48 единиц в двоичном виде."),

  qx("Which devices process a broadcast frame on an Ethernet LAN?", "Every device on the LAN", [
    ["Only the devices in a specific group", "Group processing describes multicast, not broadcast.", "Обработка группой — это multicast, а не broadcast."],
    ["Only the device whose MAC matches", "A single matching device describes unicast delivery.", "Одно совпавшее устройство — это доставка unicast."],
    ["Only the router on the LAN", "The router receives it too, but every device on the LAN processes a broadcast.", "Маршрутизатор тоже его получает, но broadcast обрабатывают все устройства LAN."],
  ], "A broadcast frame is received and processed by every device on the Ethernet LAN.", "Широковещательный кадр принимается и обрабатывается каждым устройством в Ethernet LAN."),

  qx("A switch receives a frame for FF-FF-FF-FF-FF-FF on port 1. Where does it send it?", "Out all ports except port 1", [
    ["Out all ports including port 1", "The frame is never sent back out the port it came in on.", "Кадр никогда не отправляется обратно в порт, с которого пришёл."],
    ["Only out the port leading to the router", "Broadcasts are flooded to every port, not routed to one device.", "Broadcast рассылается во все порты, а не направляется одному устройству."],
    ["Nowhere; broadcasts are dropped by switches", "Switches flood broadcasts; it is routers that do not forward them.", "Коммутаторы рассылают broadcast; не пересылают его маршрутизаторы."],
  ], "A broadcast is flooded out all switch ports except the incoming port.", "Broadcast рассылается во все порты коммутатора, кроме входящего."),

  qx("What does a router do with an Ethernet broadcast frame?", "Does not forward it", [
    ["Floods it to all connected networks", "Flooding to all ports is what a switch does within one LAN; routers block broadcasts.", "Рассылка во все порты — поведение коммутатора внутри LAN; маршрутизаторы broadcast не пропускают."],
    ["Forwards it only if configured to", "Forwarding when configured applies to multicast, not to broadcast.", "Пересылка при настройке касается multicast, а не broadcast."],
    ["Converts it into a unicast frame", "Routers do not rewrite a broadcast into unicast; they simply do not forward it.", "Маршрутизаторы не переписывают broadcast в unicast, они его просто не пересылают."],
  ], "A broadcast frame is not forwarded by a router.", "Широковещательный кадр маршрутизатор не пересылает."),

  qx("What characterizes an IPv4 broadcast packet?", "All ones in the host portion of the address", [
    ["All zeros in the host portion", "All zeros in the host portion identifies the network address, not a broadcast.", "Все нули в узловой части — адрес сети, а не broadcast."],
    ["All ones in the network portion", "The network portion stays as is; the host bits are all ones.", "Сетевая часть остаётся как есть; единицами заполняются биты узла."],
    ["A first octet of 224", "224 begins the IPv4 multicast range, not broadcast.", "С 224 начинается диапазон multicast IPv4, а не broadcast."],
  ], "An IPv4 broadcast packet has all ones in the host portion of the destination address.", "У широковещательного пакета IPv4 в узловой части адреса все единицы."),

  qx("What is the local (limited) IPv4 broadcast address?", "255.255.255.255", [
    ["0.0.0.0", "0.0.0.0 is the unspecified address, not a broadcast.", "0.0.0.0 — неопределённый адрес, а не broadcast."],
    ["127.0.0.1", "127.0.0.1 is the loopback address.", "127.0.0.1 — адрес loopback."],
    ["224.0.0.1", "224.0.0.1 is an IPv4 multicast address.", "224.0.0.1 — адрес multicast IPv4."],
  ], "The local (limited) IPv4 broadcast address is 255.255.255.255.", "Локальный (ограниченный) широковещательный адрес IPv4 — 255.255.255.255."),

  qx("Which devices process a multicast frame?", "A group of devices that joined the multicast group", [
    ["Every device on the Ethernet LAN", "Every device processes a broadcast, not a multicast.", "Все устройства обрабатывают broadcast, а не multicast."],
    ["Exactly one device whose MAC matches", "One matching device describes unicast.", "Одно совпавшее устройство — это unicast."],
    ["Only routers configured for multicast", "Routers may forward it if configured, but the group members are the ones who process it.", "Маршрутизаторы могут его переслать при настройке, но обрабатывают его участники группы."],
  ], "A multicast frame is received and processed by a group of devices.", "Групповой кадр принимается и обрабатывается группой устройств."),

  qx("With which prefix does the destination MAC of an IPv4 multicast frame begin?", "01-00-5E", [
    ["33-33", "33-33 is the prefix for IPv6 multicast.", "33-33 — префикс multicast IPv6."],
    ["FF-FF-FF", "FF-FF-FF is the start of the broadcast address.", "FF-FF-FF — начало широковещательного адреса."],
    ["00-00-5E", "The IPv4 multicast prefix begins with 01, not 00.", "Префикс multicast IPv4 начинается с 01, а не с 00."],
  ], "IPv4 multicast destination MACs start with 01-00-5E.", "MAC назначения для multicast IPv4 начинается с 01-00-5E."),

  qx("A frame arrives with destination MAC 33-33-00-00-00-01. What kind of traffic is it?", "IPv6 multicast", [
    ["IPv4 multicast", "IPv4 multicast MACs begin with 01-00-5E, not 33-33.", "MAC multicast IPv4 начинаются с 01-00-5E, а не с 33-33."],
    ["Ethernet broadcast", "Broadcast is FF-FF-FF-FF-FF-FF, all ones.", "Broadcast — это FF-FF-FF-FF-FF-FF, все единицы."],
    ["A unicast from vendor 33-33-00", "33-33 is reserved as the IPv6 multicast prefix, not a vendor OUI for unicast.", "33-33 зарезервирован как префикс multicast IPv6, а не OUI производителя для unicast."],
  ], "Destination MACs starting with 33-33 carry IPv6 multicast.", "MAC назначения, начинающиеся с 33-33, несут multicast IPv6."),

  qx("How does a switch handle a multicast frame when it does not use multicast snooping?", "Floods it out all ports except the incoming one", [
    ["Drops it because no port matches", "Without snooping the switch treats the frame like a broadcast and floods it.", "Без snooping коммутатор обращается с кадром как с broadcast и рассылает его."],
    ["Sends it only to the group members' ports", "Delivering only to group ports is what multicast snooping enables.", "Доставка только в порты участников группы — то, что даёт multicast snooping."],
    ["Forwards it to the router only", "Routers are not the default target; the switch floods to all other ports.", "Маршрутизатор не цель по умолчанию; коммутатор рассылает во все остальные порты."],
  ], "Multicast is flooded out all ports except the incoming one unless the switch uses multicast snooping.", "Multicast рассылается во все порты, кроме входящего, если на коммутаторе нет multicast snooping."),

  qx("When does a router forward a multicast frame's traffic?", "Only if it is configured to route multicast", [
    ["Always, like unicast traffic", "Unicast is always forwarded; multicast needs explicit multicast routing configuration.", "Unicast пересылается всегда; multicast требует явной настройки маршрутизации."],
    ["Never, like broadcast traffic", "Broadcast is never forwarded, but multicast can be if the router is configured.", "Broadcast не пересылается никогда, а multicast — может, если маршрутизатор настроен."],
    ["Only when multicast snooping is enabled", "Snooping is a switch feature that limits flooding; router forwarding depends on routing configuration.", "Snooping — функция коммутатора против рассылки; пересылка на маршрутизаторе зависит от настройки маршрутизации."],
  ], "A router does not forward multicast unless it is configured to route multicast.", "Маршрутизатор не пересылает multicast, если не настроен маршрутизировать его."),

  qx("Can 01-00-5E-00-00-01 appear in the source MAC field of a frame?", "No, multicast addresses are destination-only", [
    ["Yes, if the sender joined that group", "Group membership affects what a NIC receives; the source is still its own unicast MAC.", "Членство в группе влияет на приём; источником всё равно остаётся собственный unicast MAC."],
    ["Yes, for IPv4 multicast only", "Neither IPv4 nor IPv6 multicast addresses can ever be a source.", "Ни адреса multicast IPv4, ни IPv6 не могут быть источником."],
    ["No, because it is a broadcast address", "It is an IPv4 multicast address, not broadcast, but it still cannot be a source.", "Это адрес multicast IPv4, а не broadcast, но источником он всё равно быть не может."],
  ], "A multicast address can only be a destination, never a source; the source is always unicast.", "Групповой адрес может быть только адресом назначения, но не источника; источник всегда unicast."),

  qx("According to the table, how does a switch forward a unicast frame whose destination is known?", "Out one port only", [
    ["Out all ports except the incoming one", "Flooding all but the ingress port is for broadcast (and multicast without snooping).", "Рассылка во все порты, кроме входящего, — для broadcast (и multicast без snooping)."],
    ["Out all ports including the incoming one", "A switch never sends a frame back out the port it arrived on.", "Коммутатор никогда не отправляет кадр обратно в порт, с которого он пришёл."],
    ["To the router for a forwarding decision", "A known unicast is switched directly; no router is involved on the LAN.", "Известный unicast коммутируется напрямую; маршрутизатор в LAN не участвует."],
  ], "For a known unicast destination the switch forwards the frame out one port.", "Для известного unicast-назначения коммутатор отправляет кадр в один порт."),

  qx("Which row correctly matches a frame type to router behaviour?", "Unicast - forwards; broadcast - does not forward", [
    ["Unicast - does not forward; broadcast - forwards", "This is reversed: routers forward unicast and block broadcast.", "Здесь наоборот: маршрутизаторы пересылают unicast и не пропускают broadcast."],
    ["Multicast - always forwards; unicast - forwards", "Multicast is forwarded only if the router is configured for it.", "Multicast пересылается, только если маршрутизатор для этого настроен."],
    ["Broadcast - floods all ports; multicast - forwards", "Flooding all ports is switch behaviour; a router does not forward broadcast.", "Рассылка во все порты — поведение коммутатора; маршрутизатор broadcast не пересылает."],
  ], "The table shows a router forwards unicast, does not forward broadcast and forwards multicast only if configured.", "В таблице: маршрутизатор пересылает unicast, не пересылает broadcast и пересылает multicast только при настройке."),

  tfx("Every MAC address is required to be unique.", true,
    "Every MAC address must be unique, which is why vendors register with the IEEE for an OUI.", "Каждый MAC-адрес должен быть уникальным — поэтому производители регистрируют OUI в IEEE.",
    "If MACs could repeat, a NIC could not reliably decide whether a frame was addressed to it.", "Если бы MAC повторялись, карта не могла бы надёжно определить, ей ли адресован кадр."),

  tfx("A broadcast frame is forwarded by a router to other networks.", false,
    "A broadcast is flooded by switches within the LAN but is not forwarded by a router.", "Broadcast рассылается коммутаторами внутри LAN, но маршрутизатор его не пересылает.",
    "Confusing switch flooding with router forwarding is the trap here; routers stop broadcasts.", "Ловушка — спутать рассылку коммутатором с пересылкой маршрутизатором; маршрутизаторы broadcast останавливают."),

  tfx("The prefix 33-33 in a destination MAC indicates IPv4 multicast.", false,
    "33-33 is the IPv6 multicast prefix; IPv4 multicast uses 01-00-5E.", "33-33 — префикс multicast IPv6; для multicast IPv4 используется 01-00-5E.",
    "Mixing up the two prefixes would make you misidentify the IP version of the multicast traffic.", "Перепутав два префикса, вы неверно определите версию IP группового трафика."),
];
