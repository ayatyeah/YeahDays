import { qx, tfx, type Draft } from "../../types";

export const deepL5P2: Draft[] = [
  qx("Which organization developed IPv6?", "Internet Engineering Task Force (IETF)", [
    ["Institute of Electrical and Electronics Engineers (IEEE)", "The IEEE writes LAN standards such as 802.3 and 802.11, not IP.", "IEEE пишет стандарты LAN вроде 802.3 и 802.11, а не IP."],
    ["International Organization for Standardization (ISO)", "ISO is known for the OSI model, but IPv6 came from the IETF.", "ISO известна моделью OSI, но IPv6 разработала IETF."],
    ["Internet Assigned Numbers Authority (IANA)", "IANA allocates addresses and numbers; it does not design protocols.", "IANA распределяет адреса и номера, а протоколы не разрабатывает."],
  ], "IPv6 was developed by the Internet Engineering Task Force (IETF) to overcome the limitations of IPv4.", "IPv6 разработала IETF (Internet Engineering Task Force), чтобы преодолеть ограничения IPv4."),

  qx("Which set of improvements does IPv6 bring compared with IPv4?", "Larger address space, simpler packet handling, no need for NAT", [
    ["A smaller header, built-in broadcasts and shorter 64-bit addresses", "The IPv6 header is not smaller, IPv6 has no broadcasts and addresses are 128 bits.", "Заголовок IPv6 не меньше, широковещания в IPv6 нет, а адреса — 128 бит."],
    ["Mandatory router fragmentation and a stronger header checksum", "IPv6 routers do not fragment, and the header checksum was removed altogether.", "Маршрутизаторы IPv6 не фрагментируют, а контрольную сумму заголовка вообще убрали."],
    ["Guaranteed delivery and acknowledgments for every packet", "IPv6 is still best effort; reliability stays with TCP.", "IPv6 по-прежнему best effort; надёжность остаётся за TCP."],
  ], "IPv6 improvements: increased address space (128 bits), improved packet handling (simplified header) and no need for NAT.", "Улучшения IPv6: больше адресов (128 бит), упрощённая обработка пакетов (простой заголовок) и отсутствие нужды в NAT."),

  qx("How long is an IPv6 address?", "128 bits", [
    ["32 bits", "32 bits is the length of an IPv4 address.", "32 бита — длина адреса IPv4."],
    ["48 bits", "48 bits is the length of a MAC address.", "48 бит — длина MAC-адреса."],
    ["64 bits", "64 bits is usually only the interface ID half of an IPv6 address.", "64 бита — обычно лишь половина адреса IPv6, идентификатор интерфейса."],
  ], "IPv6 addresses are 128 bits long, compared with 32 bits for IPv4.", "Адрес IPv6 — 128 бит, против 32 бит у IPv4."),

  qx("Why does IPv6 remove the need for NAT?", "There are enough public addresses for every device", [
    ["The IPv6 header has no address fields that NAT could rewrite", "The IPv6 header still has 128-bit source and destination address fields.", "В заголовке IPv6 по-прежнему есть 128-битные поля адресов источника и назначения."],
    ["IPv6 routers translate addresses automatically", "IPv6 routers do not translate addresses; with enough addresses nothing needs translating.", "Маршрутизаторы IPv6 адреса не транслируют; при таком количестве адресов транслировать нечего."],
    ["IPv6 hosts never leave their local network", "IPv6 hosts reach remote networks through routers just as IPv4 hosts do.", "Хосты IPv6 выходят в удалённые сети через маршрутизаторы так же, как в IPv4."],
  ], "With a huge amount of addressing there is no need for private internal addresses mapped to a shared public address.", "При огромном запасе адресов не нужны частные внутренние адреса, отображаемые на общий публичный."),

  qx("The IPv6 header is called simplified but not smaller. What is its size?", "Fixed at 40 bytes", [
    ["Variable, from 20 to 60 bytes", "A variable 20–60 byte header with options describes IPv4, not IPv6.", "Переменный заголовок 20–60 байт с опциями — это IPv4, а не IPv6."],
    ["Fixed at 20 bytes", "20 bytes is the minimum IPv4 header; the IPv6 header is twice that.", "20 байт — минимальный заголовок IPv4; заголовок IPv6 вдвое больше."],
    ["Fixed at 128 bytes, the size of one address", "An address is 128 bits (16 bytes), and the whole header is 40 bytes.", "Адрес — 128 бит (16 байт), а весь заголовок — 40 байт."],
  ], "The IPv6 header is fixed at 40 bytes (octets): fewer fields than IPv4, but larger because of the 128-bit addresses.", "Заголовок IPv6 фиксирован — 40 байт (октетов): полей меньше, чем в IPv4, но он больше из-за 128-битных адресов."),

  qx("Which IPv4 header fields were removed from the IPv6 header to improve performance?", "Flag, Fragment Offset and Header Checksum", [
    ["Time to Live, Protocol and Differentiated Services", "These were not removed but renamed: Hop Limit, Next Header and Traffic Class.", "Их не убрали, а переименовали: Hop Limit, Next Header и Traffic Class."],
    ["Version, Source Address and Destination Address", "IPv6 still has Version and both address fields (now 128 bits).", "В IPv6 остались Version и оба поля адресов (теперь по 128 бит)."],
    ["Payload Length, Flow Label and Next Header", "These are IPv6 fields; they were added or renamed, not removed.", "Это поля IPv6 — их добавили или переименовали, а не убрали."],
  ], "Flag, Fragment Offset and Header Checksum were removed: routers no longer fragment or re-check the header at every hop.", "Убраны Flag, Fragment Offset и Header Checksum: маршрутизаторы больше не фрагментируют и не перепроверяют заголовок на каждом переходе."),

  qx("What binary value does the 4-bit Version field contain in an IPv6 packet?", "0110", [
    ["0100", "0100 (4) is the value for IPv4.", "0100 (4) — значение для IPv4."],
    ["0101", "0101 (5) is not used for IPv6; IPv6 is version 6.", "0101 (5) не используется для IPv6; IPv6 — версия 6."],
    ["1100", "1100 is decimal 12, not the IPv6 version number.", "1100 — это десятичное 12, а не номер версии IPv6."],
  ], "For IPv6 the Version field is 0110 (6); for IPv4 it is 0100 (4).", "У IPv6 поле Version равно 0110 (6), у IPv4 — 0100 (4)."),

  qx("Which IPv6 header field is the equivalent of the IPv4 Differentiated Services field?", "Traffic Class", [
    ["Flow Label", "Flow Label marks packets of one flow for identical handling; QoS class is Traffic Class.", "Flow Label помечает пакеты одного потока для одинаковой обработки; класс QoS — это Traffic Class."],
    ["Next Header", "Next Header replaces the IPv4 Protocol field, not DS.", "Next Header заменяет поле Protocol из IPv4, а не DS."],
    ["Payload Length", "Payload Length is the size of the data portion, unrelated to QoS.", "Payload Length — размер данных, к QoS отношения не имеет."],
  ], "Traffic Class is used for QoS and is equivalent to the IPv4 DiffServ (DS) field.", "Traffic Class служит для QoS и равнозначен полю DiffServ (DS) в IPv4."),

  qx("All packets of one video call carry the same 20-bit value so that routers treat them identically. Which IPv6 field is this?", "Flow Label", [
    ["Traffic Class", "Traffic Class is an 8-bit QoS marking, not the 20-bit flow identifier.", "Traffic Class — 8-битная метка QoS, а не 20-битный идентификатор потока."],
    ["Hop Limit", "Hop Limit is a hop counter, not a flow identifier.", "Hop Limit — счётчик переходов, а не идентификатор потока."],
    ["A mobility extension header", "Extension headers carry optional information; the flow value sits in the main header.", "Заголовки расширения несут необязательные сведения; значение потока лежит в основном заголовке."],
  ], "The 20-bit Flow Label informs devices to handle packets with identical flow labels the same way.", "20-битное поле Flow Label сообщает устройствам, что пакеты с одинаковой меткой нужно обрабатывать одинаково."),

  qx("What does the 16-bit Payload Length field of an IPv6 header indicate?", "The length of the data portion of the packet", [
    ["The length of the whole packet including the 40-byte header", "Counting header plus data is how IPv4 Total Length works; IPv6 counts only the payload.", "Заголовок плюс данные считает Total Length в IPv4; в IPv6 считается только нагрузка."],
    ["The length of the IPv6 header only", "The basic IPv6 header is always 40 bytes, so it needs no length field.", "Основной заголовок IPv6 всегда 40 байт, поле длины ему не нужно."],
    ["The number of extension headers present", "Extension headers are chained by Next Header values, not counted in Payload Length.", "Заголовки расширения связываются значениями Next Header, а не считаются в Payload Length."],
  ], "Payload Length (16 bits) gives the length of the data portion, or payload, of the IPv6 packet.", "Payload Length (16 бит) задаёт длину данных, то есть полезной нагрузки пакета IPv6."),

  qx("Which IPv6 header field does the job of the IPv4 Protocol field?", "Next Header", [
    ["Hop Limit", "Hop Limit replaces TTL, not Protocol.", "Hop Limit заменяет TTL, а не Protocol."],
    ["Traffic Class", "Traffic Class replaces the DS field for QoS.", "Traffic Class заменяет поле DS для QoS."],
    ["Flow Label", "Flow Label has no IPv4 equivalent; it groups packets of a flow.", "У Flow Label нет аналога в IPv4; оно объединяет пакеты одного потока."],
  ], "Next Header identifies the next-level protocol (ICMP, TCP, UDP, etc.) or the next extension header.", "Next Header указывает протокол следующего уровня (ICMP, TCP, UDP и т. д.) или следующий заголовок расширения."),

  qx("Which IPv6 header field replaces the IPv4 Time to Live field?", "Hop Limit", [
    ["Payload Length", "Payload Length is the size of the data, not a hop counter.", "Payload Length — размер данных, а не счётчик переходов."],
    ["Flow Label", "Flow Label identifies a flow; it does not limit the packet's lifetime.", "Flow Label определяет поток и время жизни пакета не ограничивает."],
    ["Next Header", "Next Header names the next protocol, the job of IPv4 Protocol.", "Next Header называет следующий протокол — это работа поля Protocol в IPv4."],
  ], "Hop Limit replaces the TTL field: it is the Layer 3 hop count.", "Hop Limit заменяет поле TTL: это счётчик переходов уровня 3."),

  qx("A router decrements the Hop Limit of an IPv6 packet to zero. What does it do?", "Discards the packet", [
    ["Fragments the packet and forwards the pieces", "IPv6 routers never fragment, and a packet at zero is not forwarded at all.", "Маршрутизаторы IPv6 не фрагментируют, а пакет с нулём вообще не пересылается."],
    ["Forwards it, since Hop Limit is only advisory", "Hop Limit works like TTL and is enforced by every router.", "Hop Limit работает как TTL, и его соблюдает каждый маршрутизатор."],
    ["Resets the Hop Limit to 255 and forwards it", "Resetting the counter would let looping packets live forever.", "Сброс счётчика позволил бы зациклившимся пакетам жить вечно."],
  ], "Hop Limit behaves like TTL: when it reaches zero the router discards the packet.", "Hop Limit ведёт себя как TTL: при нуле маршрутизатор отбрасывает пакет."),

  qx("Where are IPv6 extension headers placed?", "Between the IPv6 header and the payload", [
    ["Before the IPv6 header, at the very start", "The fixed IPv6 header always comes first; extension headers follow it.", "Фиксированный заголовок IPv6 всегда первый, а заголовки расширения идут после него."],
    ["Inside the Flow Label field of the header", "The Flow Label is a 20-bit field; it cannot hold extension headers.", "Flow Label — поле в 20 бит, заголовки расширения в него не помещаются."],
    ["After the payload, as a trailer at the end of the packet", "Extension headers are not trailers; they sit before the upper-layer data.", "Заголовки расширения — не концевик; они стоят перед данными верхнего уровня."],
  ], "Extension headers are optional and are placed between the IPv6 header and the payload.", "Заголовки расширения необязательны и размещаются между заголовком IPv6 и нагрузкой."),

  qx("What are IPv6 extension headers used for?", "Optional extras such as fragmentation, security and mobility", [
    ["Mandatory addressing that every router must read before forwarding", "Extension headers are optional; forwarding relies on the fixed header's destination address.", "Заголовки расширения необязательны; пересылка опирается на адрес назначения в основном заголовке."],
    ["Carrying the source and destination MAC addresses", "MAC addresses belong in the Layer 2 frame, not in IPv6 headers.", "MAC-адреса находятся в кадре уровня 2, а не в заголовках IPv6."],
    ["Replacing the 40-byte header on small packets", "The 40-byte header is always present; extension headers are added after it.", "Заголовок в 40 байт есть всегда; заголовки расширения добавляются после него."],
  ], "Extension headers provide optional network layer information, e.g. for fragmentation, security or mobility support.", "Заголовки расширения дают необязательные сведения сетевого уровня — например, для фрагментации, безопасности или мобильности."),

  tfx("Every IPv6 packet must contain at least one extension header.", false,
    "Extension headers are optional; many IPv6 packets have only the fixed 40-byte header before the payload.", "Заголовки расширения необязательны; у многих пакетов IPv6 перед данными только фиксированный заголовок в 40 байт.",
    "Saying true ignores the slide: EH headers are optional and used only when extra information is needed.", "Ответ «верно» противоречит слайду: заголовки расширения необязательны и нужны только для дополнительных сведений."),

  qx("To which three kinds of destinations can a host send packets?", "Itself, local hosts and remote hosts", [
    ["Only remote hosts, always through the default gateway", "Local hosts are reached directly, and a host can also send to itself via loopback.", "Локальные хосты достигаются напрямую, а себе хост может отправить через loopback."],
    ["Local hosts, switches and DNS servers", "Switches and DNS servers are not the categories; destinations are self, local or remote.", "Коммутаторы и DNS-серверы — не те категории; назначение бывает «сам», локальное или удалённое."],
    ["Unicast, multicast and anycast hosts", "These are address types, not the three destination categories in the forwarding decision.", "Это типы адресов, а не три категории назначения при решении о пересылке."],
  ], "A host can send to itself (127.0.0.1 or ::1), to local hosts on the same LAN and to remote hosts on other networks.", "Хост может отправлять себе (127.0.0.1 или ::1), локальным хостам в той же LAN и удалённым хостам в других сетях."),

  qx("Which addresses does a host use to send a packet to itself?", "127.0.0.1 and ::1", [
    ["0.0.0.0 and ::", "These are unspecified (\"any\") addresses, not loopback.", "Это неуказанные адреса («любой»), а не loopback."],
    ["255.255.255.255 and FF02::1", "These are the IPv4 limited broadcast and the IPv6 all-nodes multicast.", "Это ограниченное широковещание IPv4 и групповой адрес всех узлов IPv6."],
    ["169.254.0.1 and FE80::1", "These are link-local style addresses used on the LAN, not loopback.", "Это адреса вида link-local для работы в LAN, а не loopback."],
  ], "The loopback addresses are 127.0.0.1 for IPv4 and ::1 for IPv6.", "Адреса loopback — 127.0.0.1 для IPv4 и ::1 для IPv6."),

  qx("How does an IPv4 host decide whether a destination is local or remote?", "It compares its own IP and mask with the destination IP", [
    ["It sends an ARP broadcast and treats any reply as proof the host is local", "ARP happens after the decision; the decision itself is made with the subnet mask.", "ARP идёт после решения; само решение принимается по маске подсети."],
    ["It asks its default gateway about each new destination", "Hosts decide on their own; the gateway is used only once the destination is remote.", "Хост решает сам; шлюз используется, только когда назначение удалённое."],
    ["It checks the switch's MAC address table", "A host cannot read a switch's MAC table, and that table holds no IP information.", "Хост не может читать таблицу MAC коммутатора, да и IP в ней нет."],
  ], "IPv4: the source uses its own IP address and subnet mask together with the destination IP address.", "IPv4: источник использует свой IP-адрес и маску подсети вместе с IP-адресом назначения."),

  qx("How does an IPv6 host decide whether a destination is local or remote?", "It uses the prefix advertised by the local router", [
    ["It uses a subnet mask typed in dotted-decimal form", "Dotted-decimal masks are IPv4; IPv6 uses a prefix length learned from the router.", "Маски в точечной записи — это IPv4; IPv6 использует длину префикса от маршрутизатора."],
    ["It compares the destination MAC with its own", "MAC addresses do not say which IP network a host belongs to.", "MAC-адреса не говорят, к какой IP-сети относится хост."],
    ["It always sends to the router, since IPv6 has no local delivery", "IPv6 hosts deliver directly to local neighbours; only remote traffic goes to the router.", "Хосты IPv6 доставляют локальным соседям напрямую; к маршрутизатору идёт только удалённый трафик."],
  ], "IPv6: the source uses the network address and prefix advertised by the local router.", "IPv6: источник использует адрес сети и префикс, которые объявляет локальный маршрутизатор."),

  qx("PC1 is 192.168.10.10/24 and sends a packet to 192.168.20.5. Where does PC1 forward the packet?", "To its default gateway", [
    ["Directly to 192.168.20.5 on the LAN", "192.168.20.5 is in a different /24 network, so it is remote, not local.", "192.168.20.5 в другой сети /24, значит, назначение удалённое, а не локальное."],
    ["To all hosts as a broadcast", "Unicast traffic to a remote host is not broadcast; it goes to the gateway.", "Одноадресный трафик к удалённому хосту не рассылается всем, а идёт на шлюз."],
    ["To the DNS server, which passes it on to 192.168.20.5", "DNS only resolves names; it does not forward packets for hosts.", "DNS лишь разрешает имена и пакеты за хосты не пересылает."],
  ], "With a /24 mask, 192.168.10.x and 192.168.20.x are different networks, so the packet goes to the default gateway.", "При маске /24 сети 192.168.10.x и 192.168.20.x разные, поэтому пакет уходит на шлюз по умолчанию."),

  qx("PC1 is 10.1.1.20/24 and sends a packet to 10.1.1.200. Where does PC1 send it?", "Directly to 10.1.1.200 on the LAN", [
    ["To the default gateway first", "Both addresses are in 10.1.1.0/24, so the destination is local; no gateway is needed.", "Оба адреса в 10.1.1.0/24, назначение локальное, шлюз не нужен."],
    ["Nowhere, because 10.1.1.200 is outside the /24 network", "A /24 covers 10.1.1.0–10.1.1.255, so .200 is inside it.", "Сеть /24 охватывает 10.1.1.0–10.1.1.255, так что .200 внутри неё."],
    ["To the edge router for NAT translation", "NAT is used for internet-bound traffic, not for a host on the same LAN.", "NAT нужен для трафика в интернет, а не к хосту в той же LAN."],
  ], "Same network address after applying the mask means local delivery, straight to the destination's MAC.", "Одинаковый адрес сети после применения маски — локальная доставка, прямо на MAC получателя."),

  qx("Which statement about a default gateway is correct?", "It must have an IP address in the same range as the LAN", [
    ["It must sit in a different network from the hosts it serves", "The opposite is true: hosts can only reach a gateway in their own network.", "Верно обратное: хосты могут достучаться только до шлюза в своей сети."],
    ["It must be a Layer 2 switch without an IP address", "A Layer 2 switch cannot route; the gateway is a router or Layer 3 switch with an IP.", "Коммутатор уровня 2 не маршрутизирует; шлюз — маршрутизатор или коммутатор уровня 3 с IP."],
    ["It is only needed for traffic inside the LAN", "Traffic inside the LAN does not need the gateway; it is used to leave the LAN.", "Трафику внутри LAN шлюз не нужен; он служит для выхода из LAN."],
  ], "A default gateway (a router or Layer 3 switch) must have an IP address in the LAN's range, accept LAN traffic and route it to other networks.", "Шлюз по умолчанию (маршрутизатор или коммутатор уровня 3) должен иметь IP из диапазона LAN, принимать трафик LAN и маршрутизировать его в другие сети."),

  qx("A PC can ping every host on its own LAN but no IP address on any other network. Which setting is most likely wrong or missing?", "The default gateway", [
    ["The DNS server address", "A DNS problem breaks names, not pings to IP addresses on other networks.", "Проблема с DNS ломает имена, а не ping по IP в другие сети."],
    ["The MAC address of the PC's network card", "Local pings work, so the NIC and its MAC address are fine.", "Локальный ping работает, значит, карта и её MAC в порядке."],
    ["The speed and duplex settings of the switch port", "If the port were mis-set, local pings would also suffer.", "Если бы порт был настроен плохо, страдал бы и локальный ping."],
  ], "With no default gateway or a bad one, a device's traffic cannot leave the LAN.", "Без шлюза по умолчанию или с неверным шлюзом трафик устройства не может покинуть LAN."),

  qx("How does an IPv4 host learn its default gateway?", "Statically or through DHCP", [
    ["Only through a Router Solicitation", "Router Solicitation is an IPv6 ICMPv6 message, not how IPv4 hosts learn a gateway.", "Router Solicitation — сообщение ICMPv6 из IPv6, а не способ IPv4."],
    ["From the switch's ARP table", "Switches do not hand out gateway addresses; ARP maps IP to MAC.", "Коммутаторы не раздают адреса шлюзов; ARP лишь сопоставляет IP и MAC."],
    ["From the answer of a DNS query", "DNS answers give addresses of names, not the host's gateway.", "Ответы DNS дают адреса по именам, а не шлюз хоста."],
  ], "In IPv4 the default gateway is configured statically or learned through DHCP; IPv6 learns it via RS/RA or manual configuration.", "В IPv4 шлюз по умолчанию задают вручную или получают по DHCP; в IPv6 — через RS/RA или вручную."),

  qx("How does the default gateway appear in a host's routing table?", "As a static last-resort route (0.0.0.0/0)", [
    ["As a directly connected /32 host route", "/32 local routes describe the host's own address, not the gateway route.", "Локальные маршруты /32 описывают собственный адрес хоста, а не маршрут к шлюзу."],
    ["As a dynamic route learned by OSPF", "Hosts do not normally run OSPF; the gateway entry is static.", "Хосты обычно не запускают OSPF; запись шлюза статическая."],
    ["As a loopback route pointing to 127.0.0.1", "The loopback route is for traffic to itself, not the way off the LAN.", "Маршрут loopback — для трафика себе, а не для выхода из LAN."],
  ], "The default gateway is a static route that acts as the last-resort route in the host's routing table.", "Шлюз по умолчанию — статический маршрут, служащий маршрутом последней надежды в таблице хоста."),

  qx("Which Windows commands display the PC's own routing table?", "route print or netstat -r", [
    ["show ip route or show ip interface brief", "These are Cisco IOS commands for routers and switches, not Windows.", "Это команды Cisco IOS для маршрутизаторов и коммутаторов, а не Windows."],
    ["ipconfig /all or arp -a", "ipconfig shows address settings and arp -a shows the ARP cache, not the routing table.", "ipconfig показывает настройки адреса, arp -a — кэш ARP, а не таблицу маршрутов."],
    ["tracert or nslookup", "tracert traces a path and nslookup queries DNS; neither prints the routing table.", "tracert трассирует путь, nslookup опрашивает DNS; таблицу маршрутов ни одна не выводит."],
  ], "On Windows, route print or netstat -r display the PC routing table.", "В Windows таблицу маршрутов ПК выводят route print или netstat -r."),

  qx("Which three sections does route print display?", "Interface List, IPv4 Route Table, IPv6 Route Table", [
    ["ARP Cache, DNS Cache and Interface List", "ARP and DNS caches are shown by other commands (arp -a, ipconfig /displaydns).", "Кэши ARP и DNS показывают другие команды (arp -a, ipconfig /displaydns)."],
    ["Connected, Static and Dynamic routes", "These are route types on a router, not the section headings of route print.", "Это типы маршрутов на маршрутизаторе, а не разделы вывода route print."],
    ["Running configuration, startup configuration and NVRAM contents", "These belong to Cisco IOS devices, not to a Windows routing table.", "Это относится к устройствам Cisco IOS, а не к таблице маршрутов Windows."],
  ], "route print / netstat -r show the Interface List (interfaces and MAC addresses), the IPv4 Route Table and the IPv6 Route Table.", "route print / netstat -r показывают Interface List (интерфейсы и MAC-адреса), IPv4 Route Table и IPv6 Route Table."),

  tfx("Each host builds its own routing table rather than downloading it from the router.", true,
    "The slides state that each host device creates its own routing table.", "На слайдах сказано, что каждое устройство-хост само создаёт свою таблицу маршрутов.",
    "Answering false assumes the router pushes tables to hosts; it does not, hosts only use it as a gateway.", "Ответ «неверно» предполагает, что маршрутизатор рассылает таблицы хостам; этого нет, хосты лишь используют его как шлюз."),

  qx("Which three types of routes can a router's routing table contain?", "Directly connected, remote and default routes", [
    ["Local, broadcast and multicast routes", "Broadcast and multicast are kinds of traffic, not the route types of the table.", "Широковещание и multicast — виды трафика, а не типы маршрутов таблицы."],
    ["Static, ARP and MAC routes", "ARP and MAC entries live in the ARP and MAC tables, not the routing table.", "Записи ARP и MAC хранятся в таблицах ARP и MAC, а не в таблице маршрутов."],
    ["Primary, secondary and backup routes for each interface", "These are not the categories used; routes are directly connected, remote or default.", "Это не те категории: маршруты бывают directly connected, remote или default."],
  ], "A router's table holds directly connected routes, remote routes (static or dynamic) and a default route.", "В таблице маршрутизатора — непосредственно подключённые маршруты, удалённые (статические или динамические) и маршрут по умолчанию."),

  qx("When does a router add a directly connected route to its table?", "Automatically, once the interface is active and addressed", [
    ["Only after the administrator types an ip route command", "ip route creates a static remote route; connected routes need no such command.", "ip route создаёт статический удалённый маршрут; для подключённых такая команда не нужна."],
    ["Only after OSPF learns it from a neighbour router", "Connected networks are known locally; no neighbour has to advertise them.", "Подключённые сети известны локально; соседу не нужно их объявлять."],
    ["At boot, before any interface comes up", "An interface that is down or unaddressed produces no connected route.", "Выключенный интерфейс или интерфейс без адреса подключённого маршрута не даёт."],
  ], "Directly connected routes are added automatically, provided the interface is active and has addressing.", "Подключённые маршруты добавляются автоматически, если интерфейс активен и имеет адрес."),

  qx("What does a default route do in a router's routing table?", "Forwards traffic that matches no other route", [
    ["Drops all traffic for unknown networks", "Without a default route unknown traffic is dropped; with one it is forwarded.", "Без маршрута по умолчанию неизвестный трафик отбрасывается, а с ним — пересылается."],
    ["Lists the networks on the router's own interfaces", "Those are the directly connected (C) routes.", "Это непосредственно подключённые маршруты (C)."],
    ["Shares the routing table with every neighbouring router", "Sharing routes is what dynamic routing protocols do, not a default route.", "Обмен маршрутами — дело протоколов динамической маршрутизации, а не маршрута по умолчанию."],
  ], "A default route forwards all traffic in a specific direction when there is no match in the routing table.", "Маршрут по умолчанию отправляет весь трафик в заданном направлении, когда в таблице нет совпадения."),

  qx("A small branch office has one router and a single non-redundant link to headquarters. Which routing approach fits best?", "Static routing", [
    ["A dynamic protocol on every host PC", "Hosts do not run routing protocols; this is about the router.", "Хосты не запускают протоколы маршрутизации; речь о маршрутизаторе."],
    ["Dynamic routing only, with no default route", "Dynamic routing is useful for larger or redundant networks; it adds nothing on one link.", "Динамика полезна в крупных или резервированных сетях; на одном канале она ничего не даёт."],
    ["No routing; the switch handles remote networks", "A Layer 2 switch cannot reach other networks; routing is still needed.", "Коммутатор уровня 2 не достаёт до других сетей; маршрутизация всё равно нужна."],
  ], "Static routes are good for small non-redundant networks, though they must be configured and adjusted manually.", "Статические маршруты хороши для небольших сетей без резервирования, хотя их настраивают и меняют вручную."),

  qx("Which ability does dynamic routing have that static routing lacks?", "Finding a new best path after a topology change", [
    ["Working without any configuration on the router at all", "Dynamic routing still has to be configured; it then maintains routes automatically.", "Динамическую маршрутизацию тоже надо настроить; затем она поддерживает маршруты сама."],
    ["Forwarding packets by MAC address instead of IP", "Routing of either kind works with IP addresses, not MAC addresses.", "Маршрутизация любого вида работает с IP-адресами, а не MAC."],
    ["Guaranteeing that no packet is ever lost", "No routing method guarantees delivery; IP stays best effort.", "Никакая маршрутизация не гарантирует доставку; IP остаётся best effort."],
  ], "Dynamic routing discovers remote networks, keeps information up to date, picks the best path and finds new best paths after changes.", "Динамическая маршрутизация находит удалённые сети, поддерживает актуальность, выбирает лучший путь и ищет новый после изменений."),

  qx("In show ip route output, what does the code L mean?", "Local IP address of the router's own interface", [
    ["Route learned by a link-state routing protocol", "Link-state OSPF routes are marked O, not L.", "Маршруты link-state протокола OSPF помечаются O, а не L."],
    ["Last-resort default route", "A static default route is shown as S*.", "Статический маршрут по умолчанию показан как S*."],
    ["Loopback interface route only", "L covers the address of any configured interface, not only loopbacks.", "L относится к адресу любого настроенного интерфейса, а не только loopback."],
  ], "L marks the directly connected local interface IP address; C marks the directly connected network.", "L обозначает IP-адрес локального интерфейса; C — непосредственно подключённую сеть."),

  qx("In show ip route, which code precedes the line \"192.168.10.0/24 is directly connected, GigabitEthernet0/0/0\"?", "C", [
    ["L", "L would be the /32 entry for the interface's own address, 192.168.10.1/32.", "L стояло бы у записи /32 для адреса самого интерфейса, 192.168.10.1/32."],
    ["S", "S marks a static route typed by an administrator, not a connected network.", "S помечает статический маршрут, введённый администратором, а не подключённую сеть."],
    ["O", "O marks a route learned through OSPF.", "O помечает маршрут, полученный по OSPF."],
  ], "C = directly connected network; the matching L line holds the interface's own /32 address.", "C — непосредственно подключённая сеть; парная строка L содержит собственный адрес интерфейса /32."),

  qx("What does the code S* indicate in a router's IPv4 routing table?", "A static default route", [
    ["A static route that is currently down", "The asterisk marks a candidate default route, not a failed route.", "Звёздочка обозначает кандидата в маршрут по умолчанию, а не упавший маршрут."],
    ["A summary route learned through OSPF", "OSPF routes are marked O; S means static.", "Маршруты OSPF помечаются O; S означает статический."],
    ["A route to one of the router's own interface addresses", "Own interface addresses are marked L.", "Собственные адреса интерфейсов помечаются L."],
  ], "S* is a static default route; S alone is any route manually configured by an administrator.", "S* — статический маршрут по умолчанию; просто S — любой маршрут, настроенный администратором вручную."),

  qx("Which pair of codes identifies routes learned through OSPF and through EIGRP?", "O and D", [
    ["O and E", "E is not the EIGRP code; EIGRP routes are marked D.", "E — не код EIGRP; маршруты EIGRP помечаются D."],
    ["S and R", "S is static; neither S nor R is listed for OSPF or EIGRP.", "S — статический; ни S, ни R не относятся к OSPF или EIGRP."],
    ["C and L", "C and L are directly connected entries, not remote dynamic routes.", "C и L — непосредственно подключённые записи, а не удалённые динамические маршруты."],
  ], "O = OSPF and D = EIGRP; both are remote routes learned dynamically.", "O — OSPF, D — EIGRP; оба — удалённые маршруты, полученные динамически."),

  qx("R1's G0/0/0 interface is configured as 192.168.10.1/24. Which L entry appears in show ip route?", "192.168.10.1/32", [
    ["192.168.10.0/24", "192.168.10.0/24 is the C entry for the connected network, not the L entry.", "192.168.10.0/24 — запись C для подключённой сети, а не L."],
    ["192.168.10.1/24", "L entries always use a /32 for IPv4, because they describe a single address.", "Записи L в IPv4 всегда /32, ведь они описывают один адрес."],
    ["192.168.10.255/32", "That is the broadcast address of the network, not the interface's own address.", "Это широковещательный адрес сети, а не собственный адрес интерфейса."],
  ], "The local route is the interface address with a /32 (IPv4) or /128 (IPv6) prefix.", "Локальный маршрут — адрес интерфейса с префиксом /32 (IPv4) или /128 (IPv6)."),

  qx("The output of show ip route says \"Gateway of last resort is not set\". What does this mean?", "No default route is configured on the router", [
    ["The router's LAN hosts have no default gateway", "The line describes the router's own table, not the settings of the hosts.", "Строка описывает собственную таблицу маршрутизатора, а не настройки хостов."],
    ["The router cannot reach its directly connected networks", "Connected C and L routes still work without a default route.", "Подключённые маршруты C и L работают и без маршрута по умолчанию."],
    ["Every interface on the router is administratively down", "Interface status is shown by show ip interface brief, not by this line.", "Состояние интерфейсов показывает show ip interface brief, а не эта строка."],
  ], "\"Gateway of last resort is not set\" means there is no default route; packets for unknown networks are dropped.", "«Gateway of last resort is not set» значит, что маршрута по умолчанию нет; пакеты в неизвестные сети отбрасываются."),
];
