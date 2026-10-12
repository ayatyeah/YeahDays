import { qx, tfx, type Draft } from "../../types";

export const deepL5P3: Draft[] = [
  qx("Which address does an Ethernet NIC use to deliver a frame to another NIC on the same network?", "The Layer 2 MAC address", [
    ["The Layer 3 IPv4 address", "The IP address carries the packet end to end; NIC-to-NIC delivery on a link uses the MAC.", "IP-адрес ведёт пакет от начала до конца; доставка между картами на участке идёт по MAC."],
    ["The TCP port number of the application", "Ports identify applications at Layer 4; NICs do not deliver frames by port.", "Порты обозначают приложения на уровне 4; карты не доставляют кадры по порту."],
    ["The IPv4 address of the default gateway", "The gateway's IP is used only for remote traffic and is still resolved to a MAC.", "IP шлюза нужен только для удалённого трафика и всё равно переводится в MAC."],
  ], "On an Ethernet LAN the MAC address is used for NIC-to-NIC communication on the same network; the IP address delivers the packet source to destination.", "В Ethernet LAN MAC-адрес служит для связи между картами в одной сети, а IP-адрес доставляет пакет от источника к получателю."),

  qx("PC-A sends a packet to PC-B on the same IPv4 network. Which destination MAC address does the frame carry?", "The MAC address of PC-B", [
    ["The MAC address of the default gateway", "The gateway's MAC is used only when the destination is on a remote network.", "MAC шлюза используется, только когда получатель в удалённой сети."],
    ["The broadcast MAC address FF-FF-FF-FF-FF-FF", "Broadcast is used for the ARP request, not for the data frame once PC-B's MAC is known.", "Широковещание нужно для ARP-запроса, а не для кадра с данными, когда MAC PC-B уже известен."],
    ["PC-A's own MAC address", "PC-A's MAC is the source MAC, not the destination.", "MAC PC-A — это MAC источника, а не назначения."],
  ], "If the destination IP address is on the same network, the destination MAC address is that of the destination device.", "Если IP назначения в той же сети, MAC назначения — это MAC самого устройства-получателя."),

  qx("PC-A sends a packet to a server on a remote network. Which destination MAC address does the frame leaving PC-A carry?", "The MAC of the default gateway's interface", [
    ["The MAC address of the remote server itself", "PC-A cannot reach the server's NIC directly; that MAC never appears on PC-A's LAN.", "PC-A не может напрямую достучаться до карты сервера; этот MAC в LAN PC-A не появляется."],
    ["The broadcast MAC so that every router sees it", "Data frames to a remote host are unicast to the gateway, not broadcast.", "Кадры с данными к удалённому хосту идут одноадресно на шлюз, а не широковещательно."],
    ["The MAC address of the switch PC-A is plugged into", "A Layer 2 switch is transparent; the frame is addressed to the router.", "Коммутатор уровня 2 прозрачен; кадр адресуется маршрутизатору."],
  ], "When the destination IP address is on a remote network, the destination MAC address is that of the default gateway.", "Когда IP назначения в удалённой сети, MAC назначения — это MAC шлюза по умолчанию."),

  qx("PC-A sends packets to an FTP server through routers RA and RB. Which addresses does the packet carry as it leaves RA Fa0/0 toward RB?", "MAC: RA Fa0/0 to RB; IP: PC-A to the FTP server", [
    ["MAC: PC-A to the FTP server; IP: PC-A to the FTP server", "MAC addresses are rewritten on each link; PC-A's and the server's MACs are not on the RA–RB link.", "MAC-адреса переписываются на каждом участке; MAC PC-A и сервера на канале RA–RB не встречаются."],
    ["MAC: RA Fa0/0 to RB; IP: RA Fa0/0 to RB", "Routers rewrite only the MACs; the IP source and destination stay PC-A and the server.", "Маршрутизаторы меняют только MAC; IP источника и назначения остаются PC-A и сервером."],
    ["MAC: RA Fa0/0 to the FTP server; IP: RA to the FTP server", "The next device on the link is RB, so the destination MAC is RB's, and IPs never change.", "Следующее устройство на канале — RB, поэтому MAC назначения — RB, а IP не меняются."],
  ], "On each hop the frame gets new MACs (this router out, next router in), while the IP addresses stay PC-A to the server.", "На каждом участке кадр получает новые MAC (выход этого маршрутизатора — вход следующего), а IP-адреса остаются «PC-A — сервер»."),

  qx("Which mechanism does IPv6 use instead of ARP to associate an IPv6 address with a MAC address?", "ICMPv6 Neighbor Discovery", [
    ["ARP version 6 broadcasts", "There is no ARPv6; IPv6 has no broadcasts and uses ICMPv6 instead.", "ARPv6 не существует; в IPv6 нет широковещания, используется ICMPv6."],
    ["DHCPv6 address leases", "DHCPv6 can assign addresses but does not resolve them to MACs.", "DHCPv6 может выдавать адреса, но в MAC их не разрешает."],
    ["Reverse ARP (RARP) requests", "RARP maps MAC to IP for old IPv4 hosts; it is not used by IPv6.", "RARP сопоставлял MAC с IP у старых хостов IPv4; в IPv6 не используется."],
  ], "ARP is used by IPv4; ICMPv6 (Neighbor Discovery) is used by IPv6 to associate an IPv6 address with a NIC's MAC address.", "ARP используется в IPv4; в IPv6 IPv6-адрес с MAC-адресом карты связывает ICMPv6 (Neighbor Discovery)."),

  qx("Which two functions does ARP provide?", "Resolving IPv4 to MAC and keeping an ARP table", [
    ["Resolving names to IPv4 and caching DNS answers", "Name resolution and its cache belong to DNS.", "Разрешение имён и его кэш — это DNS."],
    ["Assigning IPv4 addresses and leasing them for a set time", "Assigning and leasing addresses is what DHCP does.", "Выдача и аренда адресов — это DHCP."],
    ["Resolving MAC to IPv4 and building routing tables", "ARP goes from IPv4 to MAC, and routing tables are built by routing, not ARP.", "ARP идёт от IPv4 к MAC, а таблицы маршрутов строит маршрутизация, а не ARP."],
  ], "ARP resolves IPv4 addresses to MAC addresses and maintains an ARP table of IPv4-to-MAC mappings.", "ARP разрешает IPv4-адреса в MAC-адреса и ведёт таблицу соответствий IPv4 — MAC."),

  qx("A host must send a packet to an IPv4 address on another network. Which IPv4 address does it look up in its ARP table?", "The default gateway's address", [
    ["The remote destination's address", "The remote host's MAC is unreachable from the LAN, so ARP is done for the gateway.", "MAC удалённого хоста из LAN недоступен, поэтому ARP делается для шлюза."],
    ["Its own interface address", "A host already knows its own MAC; looking itself up gives nothing.", "Свой MAC хост и так знает; искать себя бессмысленно."],
    ["The address of its DNS server", "The DNS server is unrelated unless it is the destination; the next hop is the gateway.", "DNS-сервер тут ни при чём, если он не получатель; следующий узел — шлюз."],
  ], "For a different network, the device searches the ARP table for the IPv4 address of the default gateway.", "Для другой сети устройство ищет в таблице ARP IPv4-адрес шлюза по умолчанию."),

  qx("A host has no ARP entry for its default gateway's IPv4 address. What does it do?", "Sends an ARP request for that address", [
    ["Sends the data frame to the broadcast MAC instead", "Data frames are not broadcast to dodge ARP; the host resolves the MAC first.", "Кадры с данными не рассылают всем, чтобы обойти ARP; сначала хост узнаёт MAC."],
    ["Drops the packet and reports a gateway error", "A missing entry is normal; the host simply asks with ARP.", "Отсутствие записи — норма; хост просто спрашивает через ARP."],
    ["Asks its DNS server for the gateway's MAC address", "DNS returns IP addresses for names, never MAC addresses.", "DNS по именам возвращает IP-адреса, но не MAC."],
  ], "If no ARP table entry is found, the device sends an ARP request.", "Если записи в таблице ARP нет, устройство отправляет ARP-запрос."),

  qx("How is an ARP request delivered on the LAN?", "As a broadcast frame to FF-FF-FF-FF-FF-FF", [
    ["As a unicast frame to the target's MAC address", "The target's MAC is exactly what is unknown, so the request cannot be unicast.", "MAC цели как раз неизвестен, поэтому запрос нельзя отправить одноадресно."],
    ["As a multicast to the all-routers group", "ARP does not use multicast groups; the request goes to everyone.", "ARP не использует группы multicast; запрос получают все."],
    ["As an IP packet routed to the target's network", "ARP works inside one broadcast domain and is not routed.", "ARP работает внутри одного широковещательного домена и не маршрутизируется."],
  ], "The ARP request is a broadcast, so every device on the LAN receives it.", "ARP-запрос — широковещательный, его получает каждое устройство в LAN."),

  qx("An ARP request asking for 192.168.1.50 reaches every host on the LAN. Which device replies?", "Only the device that owns 192.168.1.50", [
    ["Every host that receives the broadcast request", "Hosts that do not own the address simply ignore the request.", "Хосты, которым адрес не принадлежит, просто игнорируют запрос."],
    ["The switch, answering from its MAC table", "A Layer 2 switch only forwards the broadcast; it does not answer ARP.", "Коммутатор уровня 2 лишь пересылает широковещание и на ARP не отвечает."],
    ["The default gateway, on behalf of every host", "The gateway answers only for its own IP address in this case.", "Шлюз в этом случае отвечает только за свой IP-адрес."],
  ], "Only the device whose IPv4 address matches the target sends an ARP reply.", "ARP-ответ шлёт только устройство, чей IPv4-адрес совпадает с запрошенным."),

  qx("How is the ARP reply sent back to the requesting host?", "As a unicast frame to the requester", [
    ["As a broadcast so that every host can learn the mapping", "The reply is unicast; the requester's MAC is known from the request.", "Ответ одноадресный: MAC запросившего известен из запроса."],
    ["As a multicast to all routers on the LAN", "ARP replies are not multicast.", "ARP-ответы не рассылаются групповым способом."],
    ["It is not sent; the requester waits for a timeout", "Without a reply the requester could never learn the MAC.", "Без ответа запросивший никогда не узнал бы MAC."],
  ], "The ARP reply is a unicast frame sent directly to the device that asked.", "ARP-ответ — одноадресный кадр, отправленный прямо тому, кто спрашивал."),

  qx("A host receives an ARP request from a neighbour. Which mapping can it add to its own ARP table from that request?", "The sender's IPv4 and MAC address", [
    ["The target's IPv4 and its broadcast MAC", "A broadcast MAC is never stored as the mapping of a host address.", "Широковещательный MAC никогда не сохраняется как адрес хоста."],
    ["The default gateway's IPv4 and MAC", "The request comes from the sender, not necessarily from the gateway.", "Запрос пришёл от отправителя, а не обязательно от шлюза."],
    ["The switch port the request arrived on", "Port mapping is what a switch stores in its MAC table, not a host's ARP table.", "Привязку к порту хранит коммутатор в таблице MAC, а не хост в таблице ARP."],
  ], "An ARP request contains the sender's IPv4 and MAC addresses, so receivers can cache that mapping.", "ARP-запрос содержит IPv4 и MAC отправителя, поэтому получатели могут занести это соответствие в кэш."),

  qx("What happens to a dynamic ARP table entry that has not been used for some time?", "Its cache timer expires and it is removed", [
    ["It stays in the table until the device is rebooted", "Dynamic entries age out by timer; only static entries stay put.", "Динамические записи удаляются по таймеру; не уходят только статические."],
    ["It is converted into a permanent static entry", "Entries never become static on their own; static ones are added manually.", "Записи сами статическими не становятся; статические добавляют вручную."],
    ["It is moved into the device's routing table", "ARP mappings and routes are separate tables.", "Соответствия ARP и маршруты — разные таблицы."],
  ], "Each dynamic ARP entry has a timer; when it expires the entry is removed, and entries can also be cleared manually.", "У каждой динамической записи ARP есть таймер; по истечении она удаляется, а ещё записи можно очистить вручную."),

  qx("show interfaces on R1 includes \"ARP type: ARPA, ARP Timeout 04:00:00\". What does this mean?", "Dynamic ARP entries age out after 4 hours", [
    ["ARP requests are sent out every 4 hours", "ARP requests are sent when needed; the timeout is how long a learned entry is kept.", "ARP-запросы отправляются по мере надобности; тайм-аут — срок хранения записи."],
    ["The interface has been up for exactly 4 hours", "Uptime is not shown by the ARP Timeout value.", "Время работы интерфейса значение ARP Timeout не показывает."],
    ["ARP stays disabled on this interface for 4 hours", "The line shows ARP is active (type ARPA) with a 4-hour cache timer.", "Строка показывает, что ARP работает (тип ARPA) с таймером кэша 4 часа."],
  ], "On Cisco routers the default ARP timeout is 4 hours, shown in show interfaces as 04:00:00.", "На маршрутизаторах Cisco стандартный тайм-аут ARP — 4 часа, в show interfaces это 04:00:00."),

  qx("Which command displays the ARP table on a Windows PC?", "arp -a", [
    ["route print", "route print shows the routing table, not IPv4-to-MAC mappings.", "route print показывает таблицу маршрутов, а не соответствия IPv4 — MAC."],
    ["ipconfig /all", "ipconfig /all shows the PC's own addressing, not its neighbours' MACs.", "ipconfig /all показывает собственные адреса ПК, а не MAC соседей."],
    ["show ip arp", "show ip arp is the Cisco IOS command, not Windows.", "show ip arp — команда Cisco IOS, а не Windows."],
  ], "On Windows, arp -a displays the ARP table (cache).", "В Windows arp -a показывает таблицу (кэш) ARP."),

  qx("Which command displays the ARP table on a Cisco router?", "show ip arp", [
    ["show mac address-table", "That shows a switch's MAC-to-port table, not IPv4-to-MAC mappings.", "Это таблица «MAC — порт» коммутатора, а не соответствия IPv4 — MAC."],
    ["show ip route", "show ip route lists routes, not ARP entries.", "show ip route выводит маршруты, а не записи ARP."],
    ["show ipv6 interface brief", "This shows IPv6 interface status and addresses, not the ARP table.", "Это состояние и адреса IPv6-интерфейсов, а не таблица ARP."],
  ], "On a Cisco router, show ip arp displays the ARP table.", "На маршрутизаторе Cisco таблицу ARP показывает show ip arp."),

  qx("An administrator wants to remove all ARP entries manually. Which pair of commands does that on Windows and on a Cisco router?", "arp -d on Windows, clear arp-cache on Cisco", [
    ["arp -a on Windows, show ip arp on Cisco", "These commands only display the ARP table; they do not remove entries.", "Эти команды лишь показывают таблицу ARP, а записи не удаляют."],
    ["ipconfig /release on Windows, shutdown on Cisco", "Releasing a DHCP lease or shutting an interface is not the way to clear ARP.", "Освобождение аренды DHCP или выключение интерфейса — не способ очистить ARP."],
    ["netstat -r on Windows, no ip arp on Cisco", "netstat -r shows routes, and \"no ip arp\" is not the clearing command.", "netstat -r показывает маршруты, а «no ip arp» — не команда очистки."],
  ], "ARP entries can be removed manually: arp -d on Windows, clear arp-cache on Cisco IOS.", "Записи ARP можно удалить вручную: arp -d в Windows, clear arp-cache в Cisco IOS."),

  qx("Why can heavy ARP traffic hurt performance on a large LAN?", "Every device must receive and process each ARP broadcast", [
    ["ARP replies are routed across the whole internet", "ARP never leaves the local network; it is not routed.", "ARP никогда не покидает локальную сеть и не маршрутизируется."],
    ["ARP disables the switch's MAC address table", "ARP does not affect how a switch learns MAC addresses.", "ARP не влияет на то, как коммутатор изучает MAC-адреса."],
    ["Each ARP request lowers the TTL of other packets", "TTL belongs to IP packets and is changed only by routers.", "TTL — поле IP-пакетов, и меняют его только маршрутизаторы."],
  ], "ARP requests are broadcasts: all devices on the LAN receive and process them, which can reduce performance when many hosts start at once.", "ARP-запросы широковещательные: их принимают и обрабатывают все устройства LAN, и при массовом старте хостов это снижает производительность."),

  qx("An attacker on the LAN answers ARP requests for the default gateway with the attacker's own MAC address. What is this attack called?", "ARP spoofing (ARP poisoning)", [
    ["MAC address table flooding attack", "MAC flooding fills a switch's table with fake MACs; it does not fake ARP replies.", "MAC flooding забивает таблицу коммутатора поддельными MAC, а не подделывает ARP-ответы."],
    ["DNS cache poisoning", "DNS poisoning fakes name-to-IP answers, not IP-to-MAC answers.", "Отравление DNS подделывает ответы «имя — IP», а не «IP — MAC»."],
    ["DHCP starvation", "DHCP starvation exhausts the address pool; it is not about ARP replies.", "DHCP starvation истощает пул адресов и к ARP-ответам не относится."],
  ], "ARP spoofing (ARP poisoning) sends fake ARP replies so that an IPv4 address maps to the attacker's MAC.", "ARP spoofing (ARP poisoning) — рассылка поддельных ARP-ответов, чтобы IPv4-адрес сопоставлялся с MAC атакующего."),

  qx("What does the attacker gain from a successful ARP spoofing attack on the default gateway?", "Hosts send their off-LAN traffic to the attacker", [
    ["The attacker receives a new public IPv4 address", "ARP spoofing changes MAC mappings, not the attacker's addressing.", "ARP spoofing меняет соответствия MAC, а не адрес атакующего."],
    ["The router's routing table is erased", "The attack poisons hosts' ARP caches; the routing table is untouched.", "Атака отравляет ARP-кэши хостов; таблица маршрутов не трогается."],
    ["The switch shuts down every port except the attacker's", "Switches do not react this way to fake ARP replies.", "Коммутаторы так на поддельные ARP-ответы не реагируют."],
  ], "With the gateway's IP mapped to the attacker's MAC, traffic flows through the attacker: a man-in-the-middle position.", "Когда IP шлюза сопоставлен с MAC атакующего, трафик идёт через атакующего — это позиция «человек посередине»."),

  qx("Which feature on enterprise switches helps mitigate ARP spoofing?", "Dynamic ARP Inspection (DAI)", [
    ["Spanning Tree Protocol (STP)", "STP prevents Layer 2 loops; it does not validate ARP messages.", "STP предотвращает петли уровня 2, а ARP-сообщения не проверяет."],
    ["VLAN Trunking Protocol (VTP)", "VTP distributes VLAN information between switches, not ARP checks.", "VTP распространяет сведения о VLAN между коммутаторами, а не проверяет ARP."],
    ["Port speed and duplex auto-negotiation", "Auto-negotiation sets link parameters and has no security role.", "Автосогласование задаёт параметры канала и защиты не даёт."],
  ], "Enterprise switches use Dynamic ARP Inspection (DAI) to drop invalid ARP replies.", "Коммутаторы корпоративного класса используют Dynamic ARP Inspection (DAI), чтобы отбрасывать поддельные ARP-ответы."),

  tfx("A router forwards ARP requests to other networks so that a host can learn the MAC address of a remote host.", false,
    "ARP broadcasts stay inside one LAN; for remote destinations the host resolves the gateway's MAC instead.", "Широковещание ARP остаётся внутри одной LAN; для удалённых адресов хост узнаёт MAC шлюза.",
    "Answering true assumes routers pass broadcasts; they do not, which is why the destination MAC for a remote host is the gateway's.", "Ответ «верно» предполагает, что маршрутизаторы пропускают широковещание; это не так, поэтому для удалённого хоста MAC назначения — шлюза."),

  qx("Which pairing of IPv6 Neighbor Discovery messages is correct?", "NS/NA between devices, RS/RA between devices and routers", [
    ["RS/RA between devices, NS/NA between devices and routers", "This swaps the roles: Router Solicitation/Advertisement involve routers.", "Здесь роли перепутаны: Router Solicitation/Advertisement — сообщения с маршрутизаторами."],
    ["ARP request/reply between devices, RS/RA with routers", "IPv6 does not use ARP; device-to-device resolution uses NS/NA.", "IPv6 не использует ARP; между устройствами работают NS/NA."],
    ["NS/RA between devices, RS/NA between devices and routers", "Solicitations pair with advertisements of the same kind: NS with NA, RS with RA.", "Запросы образуют пары с объявлениями того же вида: NS с NA, RS с RA."],
  ], "Device-to-device: Neighbor Solicitation (NS) and Neighbor Advertisement (NA). Device-to-router: Router Solicitation (RS) and Router Advertisement (RA).", "Между устройствами: Neighbor Solicitation (NS) и Neighbor Advertisement (NA). С маршрутизатором: Router Solicitation (RS) и Router Advertisement (RA)."),

  qx("An IPv6 host knows a neighbour's IPv6 address but not its MAC. Which message does it send?", "Neighbor Solicitation (NS)", [
    ["Router Solicitation (RS)", "RS asks routers for prefix and gateway information, not a neighbour's MAC.", "RS просит у маршрутизаторов префикс и шлюз, а не MAC соседа."],
    ["Neighbor Advertisement (NA)", "NA is the reply that carries the MAC, sent by the neighbour.", "NA — ответ с MAC, его посылает сосед."],
    ["Redirect message", "Redirect is sent by a router to suggest a better first hop.", "Redirect посылает маршрутизатор, предлагая лучший первый переход."],
  ], "IPv6 address resolution: the host sends an NS and the owner of the address answers with an NA.", "Разрешение адресов в IPv6: хост шлёт NS, а владелец адреса отвечает NA."),

  qx("Which ND message carries the requested MAC address back to the asking host?", "Neighbor Advertisement (NA)", [
    ["Router Advertisement (RA)", "RA carries prefix and gateway information from a router, not a neighbour's MAC reply.", "RA несёт от маршрутизатора префикс и шлюз, а не ответ соседа с MAC."],
    ["Neighbor Solicitation (NS)", "NS is the question; the answer is the NA.", "NS — это вопрос, а ответ — NA."],
    ["ICMPv6 Echo Reply from the neighbour", "Echo Reply answers a ping; it is not part of address resolution.", "Echo Reply отвечает на ping и в разрешение адресов не входит."],
  ], "The target replies with a Neighbor Advertisement containing its MAC address, similar to an ARP reply.", "Цель отвечает Neighbor Advertisement со своим MAC-адресом — аналог ARP-ответа."),

  qx("Where is a Neighbor Solicitation for address resolution sent?", "To the solicited-node multicast of the target", [
    ["To the IPv6 broadcast address of the link", "IPv6 has no broadcast address; ND relies on multicast.", "В IPv6 нет широковещательного адреса; ND опирается на multicast."],
    ["To the all-routers multicast group FF02::2", "FF02::2 is used for Router Solicitations, not neighbour address resolution.", "FF02::2 используется для Router Solicitation, а не для разрешения адресов соседей."],
    ["As a unicast frame to the target's MAC address", "The MAC is unknown, which is the reason for sending the NS.", "MAC неизвестен — потому NS и отправляется."],
  ], "NS messages for address resolution go to the target's solicited-node multicast address, so only a few devices process them.", "NS для разрешения адресов отправляется на solicited-node multicast цели, и обрабатывают его лишь немногие устройства."),

  qx("Which part of an IPv6 unicast address is copied into the end of its solicited-node multicast address?", "The last 24 bits", [
    ["The first 64 bits (the prefix)", "The prefix is shared by all hosts on the link, so it would not narrow the group.", "Префикс общий для всех хостов участка и группу бы не сузил."],
    ["The full 48-bit MAC address", "The solicited-node address is built from the IPv6 address, not the MAC.", "Адрес solicited-node строится из адреса IPv6, а не из MAC."],
    ["The last 16 bits only", "The format FF02::1:FFxx:xxxx keeps 24 bits, not 16.", "Формат FF02::1:FFxx:xxxx сохраняет 24 бита, а не 16."],
  ], "Solicited-node multicast = FF02::1:FF plus the last 24 bits of the unicast address.", "Solicited-node multicast = FF02::1:FF плюс последние 24 бита одноадресного адреса."),

  qx("R1's G0/0/0 has global address 2001:DB8:ACAD:10::1. Which joined group in show ipv6 interface is its solicited-node multicast address?", "FF02::1:FF00:1", [
    ["FF02::1:FF44:49B0", "This one matches the link-local address ending in 44:49B0, not ::1.", "Этот адрес соответствует link-local, оканчивающемуся на 44:49B0, а не ::1."],
    ["FF02::1", "FF02::1 is the all-nodes group joined by every IPv6 device.", "FF02::1 — группа всех узлов, в неё входит каждое IPv6-устройство."],
    ["FF02::2", "FF02::2 is the all-routers group, not a solicited-node address.", "FF02::2 — группа всех маршрутизаторов, а не solicited-node."],
  ], "The last 24 bits of 2001:DB8:ACAD:10::1 are 00:0001, giving FF02::1:FF00:1, exactly as in the slide output.", "Последние 24 бита 2001:DB8:ACAD:10::1 — 00:0001, получается FF02::1:FF00:1, как в выводе на слайде."),

  qx("Why is an NS sent to a solicited-node multicast address rather than to all nodes?", "Only devices whose address ends in those bits must process it", [
    ["Multicast frames are encrypted while all-nodes ones are not", "Neither kind is encrypted; the benefit is fewer devices doing work.", "Ни один вариант не шифруется; польза — в меньшем числе обрабатывающих устройств."],
    ["The all-nodes group can only be used by routers", "Every IPv6 device joins FF02::1; that is not the reason.", "В FF02::1 входит каждое устройство IPv6; причина не в этом."],
    ["Solicited-node frames are always sent at higher speed", "Link speed does not depend on the destination address.", "Скорость канала не зависит от адреса назначения."],
  ], "Using the solicited-node group means almost only the target processes the NS, unlike an IPv4 ARP broadcast.", "Благодаря группе solicited-node NS обрабатывает почти только цель — в отличие от широковещания ARP в IPv4."),

  qx("A newly connected IPv6 host wants addressing information from local routers. Where does it send its Router Solicitation?", "FF02::2", [
    ["FF02::1", "FF02::1 is all nodes; routers send RAs there, while RS goes to all routers.", "FF02::1 — все узлы; туда маршрутизаторы шлют RA, а RS идёт всем маршрутизаторам."],
    ["FF02::1:FF00:1", "That is a solicited-node address used for NS, not for RS.", "Это адрес solicited-node для NS, а не для RS."],
    ["::1", "::1 is the host's own loopback address.", "::1 — собственный адрес loopback хоста."],
  ], "An RS is sent to the all-IPv6-routers multicast address FF02::2.", "RS отправляется на групповой адрес всех IPv6-маршрутизаторов FF02::2."),

  qx("Which information does a Router Advertisement give an IPv6 host?", "Prefix, prefix length and default gateway details", [
    ["The MAC address of every host on the link", "RAs describe the network and the router, not all neighbours' MACs.", "RA описывает сеть и маршрутизатор, а не MAC всех соседей."],
    ["The complete routing table of the router", "Hosts receive prefix and gateway information, not the full routing table.", "Хосты получают префикс и сведения о шлюзе, а не всю таблицу маршрутов."],
    ["A list of DNS names with their IPv6 addresses", "Name-to-address records come from DNS, not from RAs.", "Записи «имя — адрес» приходят от DNS, а не в RA."],
  ], "The RA carries the network prefix and prefix length and lets the host use the router as default gateway (its link-local address).", "RA несёт префикс сети и его длину и позволяет хосту использовать маршрутизатор как шлюз по умолчанию (его link-local адрес)."),

  qx("When does an IPv6 router send Router Advertisements?", "Periodically, and in reply to a Router Solicitation", [
    ["Only when the administrator issues a manual command", "RAs are sent automatically; no command per message is needed.", "RA рассылаются автоматически, команда на каждое сообщение не нужна."],
    ["Only once, when the interface first comes up", "RAs are repeated periodically so new hosts can learn the prefix.", "RA повторяются периодически, чтобы новые хосты могли узнать префикс."],
    ["Only in reply to a Neighbor Solicitation", "An NS is answered by an NA, not by an RA.", "На NS отвечают NA, а не RA."],
  ], "IPv6 routers send RAs periodically to FF02::1 and also in response to an RS.", "Маршрутизаторы IPv6 шлют RA периодически на FF02::1, а также в ответ на RS."),

  qx("What is the purpose of an ICMPv6 Redirect message?", "A router telling a host about a better first hop", [
    ["A host announcing that its IPv6 address has changed", "Address announcements use NA messages, not Redirect.", "Об адресах сообщают через NA, а не Redirect."],
    ["A switch moving a host to another VLAN", "Redirect is a Layer 3 ICMPv6 message from a router, not a switch VLAN action.", "Redirect — сообщение ICMPv6 уровня 3 от маршрутизатора, а не действие коммутатора с VLAN."],
    ["A server sending a web browser to another URL", "That is an HTTP redirect at the application layer.", "Это HTTP-перенаправление на прикладном уровне."],
  ], "The ND Redirect message is used by a router to inform a host of a better first-hop router for a destination.", "Сообщение Redirect в ND маршрутизатор использует, чтобы сообщить хосту о лучшем первом маршрутизаторе к назначению."),

  qx("What is Duplicate Address Detection (DAD) in IPv6?", "Checking that a new address is not already used on the link", [
    ["Detecting that the default gateway has stopped responding", "Gateway reachability is a different check; DAD is about address uniqueness.", "Доступность шлюза — другая проверка; DAD — про уникальность адреса."],
    ["Removing duplicate routes from the routing table", "DAD works on interface addresses, not on routes.", "DAD работает с адресами интерфейсов, а не с маршрутами."],
    ["Finding switch loops caused by duplicate cabling", "Loops are handled by STP, not by DAD.", "Петли — забота STP, а не DAD."],
  ], "DAD makes sure an IPv6 address is unique on the link before the interface starts using it.", "DAD проверяет, что адрес IPv6 уникален на участке, прежде чем интерфейс начнёт его использовать."),

  qx("How does a host perform Duplicate Address Detection for a new IPv6 address?", "It sends an NS for its own new address", [
    ["It sends an ARP request for its own address", "ARP is IPv4; IPv6 DAD uses ICMPv6 Neighbor Solicitation.", "ARP — это IPv4; DAD в IPv6 использует ICMPv6 Neighbor Solicitation."],
    ["It pings FF02::1 and counts all the replies", "Counting ping replies cannot tell which host owns the address.", "Подсчёт ответов на ping не покажет, кому принадлежит адрес."],
    ["It sends an RS and checks the list of addresses in the RA", "RAs do not list the addresses already in use on the link.", "RA не содержит списка уже занятых на участке адресов."],
  ], "For DAD the host sends an NS with its own address as the target; if nobody answers, the address is unique.", "Для DAD хост шлёт NS, где целью указан его собственный адрес; если никто не отвечает, адрес уникален."),

  qx("During DAD a host receives a Neighbor Advertisement for the address it wanted to use. What does that mean?", "The address is already in use on the link", [
    ["The address is confirmed unique and may be used", "Silence means unique; an NA means someone already owns the address.", "Уникальность означает тишина; NA означает, что адрес уже занят."],
    ["The router has accepted the host as its gateway", "Hosts use routers as gateways, not the other way round, and NA has no such role.", "Хосты используют маршрутизаторы как шлюзы, а не наоборот, и у NA такой роли нет."],
    ["The host must switch from IPv6 to IPv4", "A duplicate address calls for a different IPv6 address, not a protocol change.", "Дубликат требует другого адреса IPv6, а не смены протокола."],
  ], "An NA in reply to a DAD solicitation shows a duplicate: the host must not use that address.", "NA в ответ на запрос DAD означает дубликат: хост не должен использовать этот адрес."),

  qx("R1's show ipv6 interface output lists the joined group FF02::1. What is this group?", "The all-nodes multicast group", [
    ["The all-routers multicast group", "All-routers is FF02::2.", "Группа всех маршрутизаторов — это FF02::2."],
    ["R1's solicited-node multicast group", "Solicited-node groups look like FF02::1:FFxx:xxxx.", "Группы solicited-node выглядят как FF02::1:FFxx:xxxx."],
    ["R1's IPv6 loopback address", "The IPv6 loopback is ::1, not FF02::1.", "Loopback в IPv6 — ::1, а не FF02::1."],
  ], "FF02::1 is the all-nodes multicast group; every IPv6 device joins it, and RAs are sent to it.", "FF02::1 — группа всех узлов; в неё входит каждое устройство IPv6, и на неё рассылаются RA."),

  qx("Which Cisco IOS command shows the IPv6 neighbour table, the IPv6 counterpart of the ARP table?", "show ipv6 neighbors", [
    ["show ip arp", "show ip arp lists IPv4-to-MAC entries only.", "show ip arp показывает только записи IPv4 — MAC."],
    ["show ipv6 route", "show ipv6 route lists IPv6 routes, not neighbour MAC addresses.", "show ipv6 route выводит маршруты IPv6, а не MAC соседей."],
    ["show ipv6 interface brief", "This shows interface status and addresses, not learned neighbours.", "Это состояние интерфейсов и их адреса, а не изученные соседи."],
  ], "show ipv6 neighbors displays the IPv6 neighbour cache learned through NS/NA messages.", "show ipv6 neighbors показывает кэш соседей IPv6, изученный через NS/NA."),

  tfx("IPv6 Neighbor Discovery relies on multicast because IPv6 has no broadcast addresses.", true,
    "IPv6 has no broadcast, so ND uses multicast groups such as FF02::1, FF02::2 and solicited-node addresses.", "В IPv6 нет широковещания, поэтому ND использует группы multicast: FF02::1, FF02::2 и адреса solicited-node.",
    "Answering false assumes IPv6 can broadcast like ARP; it cannot, which is why ICMPv6 ND uses multicast.", "Ответ «неверно» предполагает, что IPv6 умеет широковещание, как ARP; не умеет, поэтому ICMPv6 ND использует multicast."),
];
