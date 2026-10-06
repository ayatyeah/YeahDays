import { qx, tfx, type Draft } from "../../types";

export const deepL2P4: Draft[] = [
  qx("Which two OSI layers use addressing to deliver data, according to the notes?", "Network and data link", [
    ["Transport and session", "Transport uses ports and session manages dialogs; the two addressing layers are 3 and 2.", "Транспортный использует порты, сеансовый ведёт диалоги; адресующие уровни — 3 и 2."],
    ["Physical and data link", "The physical layer moves bits and has no addresses.", "Физический уровень переносит биты и не имеет адресов."],
    ["Application and network", "Application protocols do not provide delivery addresses; data link does.", "Прикладные протоколы не дают адресов доставки; их даёт канальный уровень."],
  ], "Both the network layer (IP addresses) and the data link layer (MAC addresses) use addressing to deliver data.", "Адресацию для доставки используют и сетевой уровень (IP-адреса), и канальный (MAC-адреса)."),

  qx("What is the job of network layer (Layer 3) addresses?", "Deliver the IP packet from original source to final destination", [
    ["Deliver the frame from one NIC to a second NIC on the same network", "That is the job of data link (Layer 2) MAC addresses.", "Это задача MAC-адресов канального уровня (уровня 2)."],
    ["Identify the application that sent the data", "Applications are identified by port numbers at the transport layer.", "Приложения определяются номерами портов на транспортном уровне."],
    ["Select the physical cable the bits travel on", "Choosing a physical medium is below addressing; it is a physical layer matter.", "Выбор физической среды — ниже адресации, это дело физического уровня."],
  ], "Layer 3 addresses are end to end: they carry the packet from the original source to the final destination.", "Адреса уровня 3 — сквозные: они ведут пакет от исходного отправителя к конечному получателю."),

  qx("What is the job of data link layer (Layer 2) addresses?", "Deliver the frame from one NIC to another NIC on the same network", [
    ["Deliver the packet across all routers to the final destination host", "End-to-end delivery across routers is done with Layer 3 IP addresses.", "Сквозная доставка через маршрутизаторы делается IP-адресами уровня 3."],
    ["Identify the best path through the internetwork", "Path selection is a network layer function, not data link addressing.", "Выбор пути — функция сетевого уровня, а не канальной адресации."],
    ["Encode bits as signals on the medium", "Encoding signals is a physical layer task and involves no addresses.", "Кодирование сигналов — задача физического уровня, без адресов."],
  ], "Layer 2 addresses are local: they move a frame between two NICs on the same network.", "Адреса уровня 2 локальны: они переносят кадр между двумя сетевыми картами в одной сети."),

  qx("Which two addresses does an IP packet header contain?", "A source IP address and a destination IP address", [
    ["A source MAC address and a destination MAC address", "MAC addresses are in the frame header, not in the IP packet.", "MAC-адреса находятся в заголовке кадра, а не в IP-пакете."],
    ["A destination IP address and a default gateway address", "The gateway address is a host setting, not a field in the packet.", "Адрес шлюза — настройка узла, а не поле в пакете."],
    ["A source port number and a destination port number", "Port numbers belong to the transport layer segment header.", "Номера портов относятся к заголовку сегмента транспортного уровня."],
  ], "An IP packet carries the source IP address and the destination IP address.", "IP-пакет содержит IP-адрес источника и IP-адрес назначения."),

  qx("Which part of an IPv4 address is the left-most part and is shared by every device in one LAN?", "The network portion", [
    ["The host portion", "The host portion is the remaining right part and is unique per device.", "Узловая часть — оставшаяся правая часть, уникальная у каждого устройства."],
    ["The interface ID", "Interface ID is the IPv6 name for the unique device part, not the shared part.", "Идентификатор интерфейса — название уникальной части устройства в IPv6, а не общей части."],
    ["The MAC prefix", "A MAC address is a Layer 2 address and is not part of an IPv4 address.", "MAC-адрес — адрес уровня 2 и не является частью IPv4-адреса."],
  ], "The network portion is the left-most part of an IPv4 address and is the same for all devices in the LAN or WAN.", "Сетевая часть — левая часть IPv4-адреса, одинаковая у всех устройств одной LAN или WAN."),

  qx("In IPv6 terminology, what is the left-most, shared part of the address called?", "Prefix", [
    ["Interface ID", "The interface ID is the remaining part, unique for each device.", "Идентификатор интерфейса — оставшаяся часть, уникальная для каждого устройства."],
    ["Host portion", "Host portion is the IPv4 term for the unique part, not the IPv6 shared part.", "Узловая часть — термин IPv4 для уникальной части, а не общей части IPv6."],
    ["Network portion", "Network portion is the IPv4 term; IPv6 calls the same thing the prefix.", "Сетевая часть — термин IPv4; в IPv6 то же самое называется префиксом."],
  ], "IPv6 uses the term prefix for the left-most part that is common to a network.", "В IPv6 левую общую часть адреса называют префиксом."),

  qx("Which part of an IP address must be unique for each device on the network?", "The host portion (IPv4) or interface ID (IPv6)", [
    ["The network portion (IPv4) or prefix (IPv6)", "The network portion or prefix is the same for everyone on the network.", "Сетевая часть или префикс одинаковы у всех в сети."],
    ["The first octet (IPv4) or first hextet (IPv6)", "The first octet is part of the shared network portion, not the unique part.", "Первый октет входит в общую сетевую часть, а не в уникальную."],
    ["The default gateway address of the LAN", "The gateway address is shared by all hosts of the LAN as a setting.", "Адрес шлюза общий для всех хостов LAN как настройка."],
  ], "The host portion (IPv4) or interface ID (IPv6) is the remaining part and is unique for each device.", "Узловая часть (IPv4) или идентификатор интерфейса (IPv6) — оставшаяся часть, уникальная у каждого устройства."),

  qx("PC1 192.168.1.110 sends a file to an FTP server 192.168.1.9. How does it know they share a network?", "The network portions of both IPv4 addresses match", [
    ["The host portions of both addresses match", "The host portions (110 and 9) differ; it is the network portions that match.", "Узловые части (110 и 9) различаются; совпадают именно сетевые части."],
    ["Both devices have MAC addresses from the same vendor", "Vendor bytes of a MAC say nothing about IP network membership.", "Байты производителя в MAC ничего не говорят о принадлежности к IP-сети."],
    ["The server replied to a broadcast from PC1", "Same-network membership is decided by comparing IP network portions, not by a reply.", "Принадлежность к одной сети определяется сравнением сетевых частей IP, а не ответом."],
  ], "Two devices are on the same network when the network portions of their addresses match: 192.168.1 in both cases.", "Устройства в одной сети, если сетевые части совпадают: здесь это 192.168.1 у обоих."),

  qx("PC1 sends a frame to an FTP server on the same network. Whose MAC address is the destination?", "The actual MAC address of the FTP server NIC", [
    ["The MAC address of the default gateway router", "The gateway MAC is used only when the destination is on a remote network.", "MAC шлюза используется только для получателя в удалённой сети."],
    ["The MAC address of the switch port", "A switch forwards frames by MAC but is not the destination; frames address the end NIC.", "Коммутатор пересылает кадры по MAC, но не является получателем; кадр адресован конечной карте."],
    ["The MAC address of PC1 itself", "PC1's own MAC is the source address, not the destination.", "Собственный MAC PC1 — адрес источника, а не назначения."],
  ], "On the same network the frame carries the actual MAC address of the destination NIC.", "В одной сети кадр несёт настоящий MAC-адрес сетевой карты получателя."),

  qx("Where are MAC addresses physically embedded?", "In the Ethernet NIC", [
    ["In the router's routing table", "The routing table holds network routes, not MAC addresses of hosts.", "Таблица маршрутизации хранит маршруты сетей, а не MAC-адреса хостов."],
    ["In the IP packet header", "The IP header carries IP addresses; MACs are in the frame header.", "Заголовок IP несёт IP-адреса; MAC-адреса находятся в заголовке кадра."],
    ["In the DHCP server database", "DHCP hands out IP settings; it does not store or assign MAC addresses.", "DHCP выдаёт IP-настройки и не хранит и не назначает MAC-адреса."],
  ], "MAC addresses are physically embedded in the Ethernet NIC by the manufacturer.", "MAC-адреса физически вшиты производителем в сетевую карту Ethernet."),

  qx("Which word do the notes use to describe the scope of a MAC address?", "Local", [
    ["Global", "Global, end-to-end scope describes IP addresses, not MAC addresses.", "Глобальная, сквозная область действия описывает IP-адреса, а не MAC."],
    ["Logical", "Logical addressing is the Layer 3 IP concept; MACs are physical, local addresses.", "Логическая адресация — понятие IP уровня 3; MAC — физические локальные адреса."],
    ["Temporary", "A MAC is embedded in the NIC and does not change; its defining trait is being local.", "MAC вшит в карту и не меняется; его главная черта — локальность."],
  ], "MAC addresses are local addresses: they only matter on the one link between two NICs.", "MAC-адреса локальны: они имеют значение только на одном участке между двумя картами."),

  qx("PC1 is 192.168.1.110 and a web server is 172.16.1.99. Why are they on different networks?", "Their network portions (192.168.1 and 172.16.1) differ", [
    ["Their host portions (110 and 99) differ", "Host portions always differ between devices; the deciding factor is the network portion.", "Узловые части у разных устройств всегда различаются; решает сетевая часть."],
    ["A web server can never share a LAN with a PC", "Servers and PCs can be on one LAN; here the IP network portions simply do not match.", "Серверы и ПК могут быть в одной LAN; здесь просто не совпадают сетевые части IP."],
    ["The server address starts with 172, a private range", "Whether a range is private is irrelevant; the comparison is of network portions.", "Частный диапазон тут ни при чём; сравниваются сетевые части."],
  ], "When the network portions of the IPv4 addresses do not match, the devices are on different networks.", "Если сетевые части IPv4-адресов не совпадают, устройства находятся в разных сетях."),

  qx("What is the default gateway (DGW)?", "The IP address of the router interface that belongs to this LAN", [
    ["The MAC address of the nearest switch port that connects this LAN", "A switch has no routing role; the gateway is a router interface identified by its IP.", "Коммутатор не маршрутизирует; шлюз — интерфейс маршрутизатора, задаваемый IP."],
    ["The IP address of the remote web server", "The remote server is the final destination, not the door out of the LAN.", "Удалённый сервер — конечный получатель, а не дверь из LAN."],
    ["The first IP address of the remote network", "The gateway is on the local LAN, not on the remote network.", "Шлюз находится в локальной LAN, а не в удалённой сети."],
  ], "The default gateway is the router interface IP address that is part of this LAN, the 'door' to all remote networks.", "Шлюз по умолчанию — IP-адрес интерфейса маршрутизатора в этой LAN, «дверь» во все удалённые сети."),

  qx("Which layer tells Layer 2 to use the default gateway when the destination is remote?", "Layer 3", [
    ["Layer 2", "Layer 2 only builds the frame; the decision that the destination is remote comes from Layer 3.", "Уровень 2 лишь строит кадр; решение, что получатель удалён, принимает уровень 3."],
    ["Layer 4", "Layer 4 handles segments and ports and does not compare network portions.", "Уровень 4 работает с сегментами и портами и не сравнивает сетевые части."],
    ["Layer 1", "Layer 1 moves bits and knows nothing about addresses.", "Уровень 1 переносит биты и ничего не знает об адресах."],
  ], "Layer 3 compares the network portions and gives Layer 2 the default gateway address to build the frame to.", "Уровень 3 сравнивает сетевые части и передаёт уровню 2 адрес шлюза, на который строить кадр."),

  qx("PC1 sends a packet to a web server in another network. Whose MAC is the destination in the frame leaving PC1?", "The default gateway router interface", [
    ["The web server NIC on the remote network", "The web server is on a remote network, so its MAC is never used by PC1.", "Веб-сервер в удалённой сети, поэтому PC1 никогда не использует его MAC."],
    ["The second router on the path", "PC1 only knows the first hop; later routers are addressed by earlier routers.", "PC1 знает только первый переход; следующие маршрутизаторы адресуют предыдущие."],
    ["The broadcast address of the LAN", "The frame is unicast to the gateway, not broadcast to every host.", "Кадр идёт одноадресно шлюзу, а не всем хостам широковещательно."],
  ], "For a remote destination the frame goes to the MAC address of the default gateway, not of the web server.", "Для удалённого получателя кадр идёт на MAC шлюза по умолчанию, а не веб-сервера."),

  qx("A host has no default gateway configured. What happens to its traffic?", "It can reach only devices inside its own LAN", [
    ["It cannot reach any device at all", "Same-network delivery needs no gateway; only remote traffic is blocked.", "Для доставки в своей сети шлюз не нужен; блокируется только удалённый трафик."],
    ["It uses the MAC of the remote host directly", "Remote hosts are not on the link, so their MAC cannot be used.", "Удалённые хосты не на этом участке, поэтому их MAC использовать нельзя."],
    ["It is assigned a gateway by the switch", "Switches do not assign gateway addresses; the setting comes from the host or DHCP.", "Коммутаторы не назначают адрес шлюза; настройка задаётся на хосте или через DHCP."],
  ], "Every device on the LAN must know the default gateway address, or its traffic stays inside the LAN.", "Каждое устройство в LAN должно знать адрес шлюза, иначе его трафик не выйдет за пределы LAN."),

  qx("Why does the data link header get a new source and destination MAC on each link?", "Data link addressing is local to one link", [
    ["Routers change the IP addresses at each hop", "IP addresses do not change; only the frame is rebuilt per link.", "IP-адреса не меняются; заново строится только кадр на каждом участке."],
    ["MAC addresses expire after one second", "MACs are permanent; the new MACs reflect the new pair of NICs on the next link.", "MAC постоянны; новые MAC отражают новую пару карт на следующем участке."],
    ["Each router assigns a temporary MAC to the packet", "Routers use their own interface MACs; nothing is assigned to the packet itself.", "Маршрутизаторы используют MAC своих интерфейсов; пакету ничего не присваивается."],
  ], "Because Layer 2 addresses are local, every link needs its own source and destination MAC.", "Поскольку адреса уровня 2 локальны, на каждом участке нужны свои MAC источника и назначения."),

  qx("On the first link in the journey (PC1 to R1), what is the source MAC?", "PC1 NIC", [
    ["R1 gateway interface", "R1 is the destination MAC on the first link, not the source.", "R1 — MAC назначения на первом участке, а не источника."],
    ["R1 exit interface", "The R1 exit interface is the source MAC on the second link (R1 to R2).", "Выходной интерфейс R1 — MAC источника на втором участке (R1 — R2)."],
    ["Web server NIC", "The web server MAC appears only as the destination on the last link.", "MAC веб-сервера появляется только как назначение на последнем участке."],
  ], "On the PC1 to R1 link the source MAC is PC1's NIC and the destination MAC is R1's gateway interface.", "На участке PC1 — R1 MAC источника — карта PC1, MAC назначения — интерфейс шлюза R1."),

  qx("On the second link (R1 to R2), which MAC is the source?", "R1 exit interface", [
    ["PC1 NIC", "PC1's MAC is left behind after the first link; R1 rebuilds the frame.", "MAC PC1 остаётся на первом участке; R1 строит кадр заново."],
    ["R2 interface", "R2 is the destination MAC on this link, not the source.", "R2 — MAC назначения на этом участке, а не источника."],
    ["R1 gateway interface facing PC1", "The LAN-facing interface was the destination on link 1; the frame leaves through R1's exit interface.", "Интерфейс в сторону LAN был назначением на участке 1; кадр уходит через выходной интерфейс R1."],
  ], "R1 forwards the packet in a new frame whose source MAC is R1's exit interface and destination MAC is R2.", "R1 пересылает пакет в новом кадре: MAC источника — выходной интерфейс R1, назначения — R2."),

  qx("On the last link (R2 to the web server), what is the destination MAC?", "Web server NIC", [
    ["R2 exit interface", "R2's exit interface is the source MAC on this link.", "Выходной интерфейс R2 — MAC источника на этом участке."],
    ["R1 exit interface", "R1 is two links back; its MAC does not appear on the last link.", "R1 на два участка раньше; его MAC на последнем участке не фигурирует."],
    ["PC1 NIC", "PC1's MAC was only on the first link.", "MAC PC1 был только на первом участке."],
  ], "On the final link the source MAC is R2's exit interface and the destination MAC is the web server NIC.", "На последнем участке MAC источника — выходной интерфейс R2, MAC назначения — карта веб-сервера."),

  qx("In the address table, what is the source IP on every hop from PC1 to the web server?", "192.168.1.110", [
    ["172.16.1.99", "172.16.1.99 is the destination IP (the web server), not the source.", "172.16.1.99 — IP назначения (веб-сервер), а не источника."],
    ["192.168.1.9", "192.168.1.9 is the FTP server from the same-network example, not PC1.", "192.168.1.9 — FTP-сервер из примера с одной сетью, а не PC1."],
    ["The IP of the current router's exit interface", "Routers do not rewrite the source IP; the packet keeps PC1's address.", "Маршрутизаторы не переписывают IP источника; пакет сохраняет адрес PC1."],
  ], "The source IP stays 192.168.1.110 (PC1) on all three hops.", "IP источника остаётся 192.168.1.110 (PC1) на всех трёх участках."),

  qx("In the address table, what is the destination IP in the frame on the R1 to R2 link?", "172.16.1.99", [
    ["The IP of R2's interface", "R2 is the next hop at Layer 2; the destination IP is still the web server.", "R2 — следующий переход уровня 2; IP назначения всё равно веб-сервер."],
    ["192.168.1.110", "192.168.1.110 is the source IP of PC1.", "192.168.1.110 — IP источника, PC1."],
    ["The IP of R1's exit interface", "Router interfaces appear as MAC addresses in the frame, not as the packet's destination IP.", "Интерфейсы маршрутизаторов фигурируют в кадре как MAC-адреса, а не как IP назначения пакета."],
  ], "The destination IP stays 172.16.1.99 (web server) on every hop, including R1 to R2.", "IP назначения остаётся 172.16.1.99 (веб-сервер) на каждом участке, включая R1 — R2."),

  qx("How many different pairs of MAC addresses are used when PC1 reaches the web server through R1 and R2?", "3", [
    ["1", "One pair would be enough only on the same network; here there are three links.", "Одной пары хватило бы только в одной сети; здесь три участка."],
    ["2", "Two routers create three links: PC1-R1, R1-R2, R2-server.", "Два маршрутизатора образуют три участка: PC1-R1, R1-R2, R2-сервер."],
    ["4", "There are three links in the table, so three MAC pairs, not four.", "В таблице три участка, значит три пары MAC, а не четыре."],
  ], "The path has three links, and each link has its own source and destination MAC pair.", "На пути три участка, и у каждого своя пара MAC источника и назначения."),

  qx("As a packet crosses R1 and R2, which statement about the packet itself is correct?", "The packet is not modified; its IP addresses stay the same", [
    ["The packet gets a new destination IP address at every router", "Routers rebuild the frame, not the packet; the destination IP never changes.", "Маршрутизаторы перестраивают кадр, а не пакет; IP назначения не меняется."],
    ["The packet's source IP becomes the router's IP", "The source IP stays the original sender's address end to end.", "IP источника остаётся адресом исходного отправителя до конца."],
    ["The packet is discarded and recreated by each router", "The packet is passed through intact; only the Layer 2 frame is recreated.", "Пакет проходит нетронутым; заново создаётся только кадр уровня 2."],
  ], "The Layer 3 packet is not modified: source and destination IP stay the same from end to end.", "Пакет уровня 3 не изменяется: IP источника и назначения остаются теми же от начала до конца."),

  qx("Which PDU is rebuilt at every router on the path?", "The frame", [
    ["The packet", "The packet passes through routers unchanged.", "Пакет проходит через маршрутизаторы без изменений."],
    ["The segment", "Transport layer segments are not touched by routers.", "Сегменты транспортного уровня маршрутизаторы не трогают."],
    ["The data", "Application data is only read by the end hosts.", "Данные приложения читают только конечные хосты."],
  ], "Each router strips the incoming frame and builds a new frame with new MAC addresses for the next link.", "Каждый маршрутизатор снимает входящий кадр и строит новый с новыми MAC для следующего участка."),

  qx("Complete the callout: 'IP = global, end to end, does not change. MAC = ___'", "local, link by link, changes at every router", [
    ["global, end to end, changes at every router", "MAC is not global or end to end; it is local to one link.", "MAC не глобален и не сквозной; он локален для одного участка."],
    ["local, link by link, does not change", "The MAC pair does change on every link; that is the whole point of the contrast.", "Пара MAC меняется на каждом участке; в этом и смысл противопоставления."],
    ["logical, end to end, assigned by the router", "MACs are physical addresses embedded in the NIC, not assigned by routers.", "MAC — физические адреса, вшитые в карту, а не назначенные маршрутизатором."],
  ], "MAC addresses are local, work link by link and change at every router.", "MAC-адреса локальны, работают от участка к участку и меняются на каждом маршрутизаторе."),

  qx("Which pair of properties correctly contrasts IP and MAC addresses?", "IP is global and unchanged; MAC is local and changes per hop", [
    ["IP is local and changes per hop; MAC is global and unchanged", "This is reversed: IP is the end-to-end address, MAC the per-link one.", "Перепутано: IP — сквозной адрес, MAC — адрес одного участка."],
    ["Both are global and stay the same end to end", "Only IP stays the same; the MAC pair is rebuilt on each link.", "Неизменным остаётся только IP; пара MAC перестраивается на каждом участке."],
    ["Both are local and change at every router", "IP addresses do not change at routers; only the frame does.", "IP-адреса на маршрутизаторах не меняются; меняется только кадр."],
  ], "IP addresses are global and constant from source to destination; MAC addresses are local and change at every hop.", "IP-адреса глобальны и постоянны от источника до получателя; MAC локальны и меняются на каждом переходе."),

  qx("Which analogy do the notes use for the default gateway?", "The door to all remote networks", [
    ["The road between two routers", "The gateway is a router interface in the LAN, not the link between routers.", "Шлюз — интерфейс маршрутизатора в LAN, а не канал между маршрутизаторами."],
    ["The name tag on each NIC", "A name tag embedded in the NIC describes the MAC address.", "Бирка, вшитая в карту, описывает MAC-адрес."],
    ["The final destination of the packet", "The final destination is the remote host; the gateway is only the exit point.", "Конечный получатель — удалённый хост; шлюз — лишь точка выхода."],
  ], "The default gateway is the 'door' through which traffic leaves the LAN for any remote network.", "Шлюз по умолчанию — «дверь», через которую трафик покидает LAN в любую удалённую сеть."),

  qx("To which network does the default gateway interface belong?", "The same LAN as the sending host", [
    ["The destination host's remote network", "The gateway must be reachable at Layer 2, so it sits in the local LAN.", "Шлюз должен быть достижим на уровне 2, поэтому он находится в локальной LAN."],
    ["The link between the first and second routers", "That link is a different network; the gateway is the LAN-facing interface.", "Этот канал — другая сеть; шлюз — интерфейс, обращённый в LAN."],
    ["No network; it is a software setting only", "The gateway is a real router interface with an IP address in the LAN.", "Шлюз — реальный интерфейс маршрутизатора с IP-адресом в LAN."],
  ], "The default gateway is the router interface IP address that is part of this LAN.", "Шлюз по умолчанию — IP-адрес интерфейса маршрутизатора, входящего в эту LAN."),

  qx("A frame leaving PC1 has destination MAC = R1 and destination IP = 172.16.1.99. What does this tell you?", "The destination is on a remote network reached via the gateway", [
    ["The destination is on the same LAN as PC1 and reached directly", "On the same LAN the destination MAC would be the server's, not the router's.", "В одной LAN MAC назначения был бы серверный, а не маршрутизатора."],
    ["R1 is the final destination of the data", "R1 is only the next hop; the IP shows the real destination is 172.16.1.99.", "R1 — лишь следующий переход; IP показывает, что настоящий получатель 172.16.1.99."],
    ["PC1 has no default gateway configured", "Using the gateway's MAC proves the gateway is known and configured.", "Использование MAC шлюза как раз доказывает, что шлюз известен и настроен."],
  ], "A router's MAC with a remote destination IP means Layer 3 decided the destination is remote and handed the frame to the gateway.", "MAC маршрутизатора при удалённом IP назначения означает, что уровень 3 счёл получателя удалённым и передал кадр шлюзу."),

  qx("Which address does PC1 never use when sending to a web server on a remote network?", "The MAC address of the web server", [
    ["The IP address of the web server", "The web server IP is the destination IP in every packet.", "IP веб-сервера — IP назначения в каждом пакете."],
    ["The MAC address of the default gateway", "The gateway MAC is exactly what PC1 puts as the destination MAC.", "MAC шлюза — именно то, что PC1 ставит как MAC назначения."],
    ["Its own IP address", "PC1's IP is the source IP of the packet.", "IP PC1 — IP источника пакета."],
  ], "The server's MAC is never used by PC1: it is on a different network, so the frame goes to the gateway.", "MAC сервера PC1 никогда не использует: тот в другой сети, поэтому кадр идёт шлюзу."),

  qx("Which statement about a frame travelling between two hosts on one LAN is true?", "Its destination MAC belongs to the receiving host's NIC", [
    ["Its destination MAC belongs to the router's LAN interface", "The router MAC is used only for remote destinations.", "MAC маршрутизатора используется только для удалённых получателей."],
    ["Its IP addresses change when it crosses the switch", "IP addresses never change in transit; a switch does not even read them.", "IP-адреса в пути не меняются; коммутатор их даже не читает."],
    ["It needs the default gateway to be reachable", "Local delivery does not involve the gateway at all.", "Локальная доставка шлюз вообще не задействует."],
  ], "On the same network the frame goes straight to the destination NIC's MAC address.", "В одной сети кадр идёт прямо на MAC сетевой карты получателя."),

  qx("Which part of the IP address changes between PC1 192.168.1.110 and FTP server 192.168.1.9?", "Only the host portion", [
    ["Only the network portion", "The network portion 192.168.1 is identical; that is what puts them in one LAN.", "Сетевая часть 192.168.1 одинакова; именно это помещает их в одну LAN."],
    ["Both the network and host portions", "Only the last part (110 vs 9) differs.", "Различается только последняя часть (110 и 9)."],
    ["Neither portion; they are the same address", "The addresses differ in the host portion, so they are two distinct devices.", "Адреса различаются узловой частью, значит это два разных устройства."],
  ], "The network portion 192.168.1 is shared; only the host portion (110 and 9) is different.", "Сетевая часть 192.168.1 общая; различается только узловая часть (110 и 9)."),

  qx("Which Layer 2 address pair is used when R2 forwards the packet toward the web server?", "Source R2 exit interface, destination web server", [
    ["Source R1 exit interface, destination R2", "That pair belongs to the R1 to R2 link, one hop earlier.", "Эта пара относится к участку R1 — R2, на переход раньше."],
    ["Source PC1, destination R1 gateway", "That is the very first link, PC1 to R1.", "Это самый первый участок, PC1 — R1."],
    ["Source web server, destination R2 exit interface", "That would be a reply from the server, not the forward direction.", "Это был бы ответ от сервера, а не прямое направление."],
  ], "On the last hop the frame goes from R2's exit interface to the web server's NIC.", "На последнем переходе кадр идёт от выходного интерфейса R2 к сетевой карте веб-сервера."),

  tfx("A frame sent to a host on a remote network carries the MAC address of that remote host.", false,
    "The destination MAC must be on the local link, so the frame carries the default gateway's MAC; the remote host's MAC is never used.",
    "MAC назначения должен быть на локальном участке, поэтому в кадре MAC шлюза по умолчанию; MAC удалённого хоста не используется.",
    "Choosing True ignores that Layer 2 addresses are local and cannot reach past the router.",
    "Ответ «верно» не учитывает, что адреса уровня 2 локальны и не действуют за маршрутизатором."),

  tfx("The source and destination IP addresses stay the same across every hop from PC1 to the web server.", true,
    "The packet is not modified in transit: 192.168.1.110 and 172.16.1.99 appear on all three links.",
    "Пакет в пути не изменяется: 192.168.1.110 и 172.16.1.99 стоят на всех трёх участках.",
    "Choosing False confuses the IP addresses with the MAC addresses, which do change at every router.",
    "Ответ «неверно» путает IP-адреса с MAC-адресами, которые действительно меняются на каждом маршрутизаторе."),
];
