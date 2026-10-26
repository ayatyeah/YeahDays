import { qx, tfx, type Draft } from "../../types";

export const deepL7P4: Draft[] = [
  qx("Where in an IPv6 GUA are the bits that an organization uses to create its subnets?", "In the separate subnet ID field", [
    ["In host bits borrowed from the interface ID", "IPv6 subnetting borrows no host bits; the interface ID stays 64 bits.", "При разбиении на подсети в IPv6 биты хоста не заимствуют; идентификатор интерфейса остаётся 64-битным."],
    ["In the first three bits, 001", "001 marks the 2000::/3 global block and is part of the routing prefix.", "001 обозначает глобальный блок 2000::/3 и входит в префикс маршрутизации."],
    ["In the prefix length after the slash", "The prefix length tells where the network ends; it holds no subnet numbers.", "Длина префикса показывает, где кончается сеть, но номеров подсетей не содержит."],
  ], "IPv6 was designed with subnetting in mind: a separate subnet ID field, between the global routing prefix and the interface ID, is used to create subnets.", "IPv6 проектировали с расчётом на подсети: для них есть отдельное поле subnet ID между глобальным префиксом маршрутизации и идентификатором интерфейса."),

  qx("How does subnetting a /48 into /64s differ from classic IPv4 subnetting?", "No host bits are borrowed; only the subnet ID changes", [
    ["Host bits are borrowed from the interface ID, as in IPv4", "With /64 subnets the interface ID always stays 64 bits.", "В подсетях /64 идентификатор интерфейса всегда остаётся 64-битным."],
    ["Network and broadcast addresses are subtracted in each subnet", "IPv6 has no broadcast address, and nothing is subtracted.", "В IPv6 нет broadcast-адреса, и ничего не вычитается."],
    ["Each subnet needs its own routing prefix from the ISP", "The global routing prefix is the same for all subnets.", "Глобальный префикс маршрутизации одинаков для всех подсетей."],
  ], "The interface ID stays 64 bits, and only the 16-bit subnet ID is incremented; there is no borrowing and no subtraction.", "Идентификатор интерфейса остаётся 64-битным, и меняется только 16-битный subnet ID; ничего не заимствуется и не вычитается."),

  tfx("With IPv6, address conservation is the main concern when choosing subnet sizes.", false,
    "False. The 128-bit address supports more than enough subnets and hosts per subnet; address conservation is not an issue.",
    "Неверно. 128-битный адрес даёт с запасом и подсетей, и хостов в каждой; экономия адресов не проблема.",
    "Answering True carries the IPv4 habit over: in IPv6 every LAN simply gets a /64.",
    "Ответ «верно» переносит привычку из IPv4: в IPv6 каждая LAN просто получает /64."),

  qx("How many addresses does a single /64 subnet support?", "2^64, about 18 quintillion", [
    ["2^16, that is 65,536", "65,536 is the number of /64 subnets in a /48, not the addresses in one subnet.", "65 536 — число подсетей /64 в /48, а не адресов в одной подсети."],
    ["2^64 − 2, after network and broadcast", "IPv6 has no broadcast address, so nothing is subtracted.", "В IPv6 нет broadcast-адреса, поэтому ничего не вычитается."],
    ["2^48, about 281 trillion", "48 bits is the routing prefix length, not the interface ID.", "48 бит — длина префикса маршрутизации, а не идентификатора интерфейса."],
  ], "A 64-bit interface ID supports 2^64 = 18,446,744,073,709,551,616 addresses per subnet — about 18 quintillion.", "64-битный идентификатор интерфейса даёт 2^64 = 18 446 744 073 709 551 616 адресов на подсеть — около 18 квинтиллионов."),

  qx("A site receives a /52 prefix. How many /64 subnets can it create?", "4,096", [
    ["256", "256 comes from a /56 (8 bits).", "256 даёт префикс /56 (8 бит)."],
    ["65,536", "65,536 comes from a /48 (16 bits).", "65 536 даёт префикс /48 (16 бит)."],
    ["12", "12 is the number of subnet ID bits, not the number of subnets.", "12 — число бит subnet ID, а не число подсетей."],
  ], "64 − 52 = 12 bits of subnet ID: 2^12 = 4,096 subnets.", "64 − 52 = 12 бит subnet ID: 2^12 = 4 096 подсетей."),

  qx("A home customer gets a /60 from the ISP. How many /64 subnets can the customer create?", "16", [
    ["4", "4 is the number of subnet ID bits; 2^4 subnets are possible.", "4 — это число бит subnet ID; подсетей получается 2^4."],
    ["60", "60 is the prefix length, not a number of subnets.", "60 — длина префикса, а не число подсетей."],
    ["256", "256 subnets need 8 bits, that is a /56.", "Для 256 подсетей нужно 8 бит, то есть /56."],
  ], "64 − 60 = 4 bits: 2^4 = 16 /64 subnets.", "64 − 60 = 4 бита: 2^4 = 16 подсетей /64."),

  qx("Which formula gives the number of /64 subnets in a site prefix of length n?", "2^(64 − n)", [
    ["2^(128 − n)", "128 − n counts every bit after the prefix, so it gives addresses, not /64 subnets.", "128 − n считает все биты после префикса, то есть даёт адреса, а не подсети /64."],
    ["2^(n − 48)", "The number of subnets falls as n grows, so n cannot be in the exponent with a plus sign.", "С ростом n подсетей становится меньше, поэтому n не может входить в степень со знаком плюс."],
    ["64 − n", "64 − n is the number of subnet ID bits; the subnets are 2 to that power.", "64 − n — число бит subnet ID; подсетей — 2 в этой степени."],
  ], "The subnet ID has 64 − n bits, so a site prefix /n gives 2^(64 − n) /64 subnets.", "У subnet ID 64 − n бит, поэтому префикс площадки /n даёт 2^(64 − n) подсетей /64."),

  qx("What is the last /64 subnet of 2001:db8:acad::/48?", "2001:db8:acad:ffff::/64", [
    ["2001:db8:acad:9999::/64", "The subnet ID is hexadecimal; after 9999 the values continue up to ffff.", "Subnet ID шестнадцатеричный: после 9999 значения продолжаются до ffff."],
    ["2001:db8:acad:65536::/64", "65536 is a decimal count, and a hextet holds only four hex digits.", "65536 — десятичное число, а в хекстете только четыре шестнадцатеричные цифры."],
    ["2001:db8:ffff:ffff::/64", "The third hextet belongs to the /48 routing prefix and stays acad.", "Третий хекстет относится к префиксу /48 и остаётся acad."],
  ], "The 16-bit subnet ID runs from 0000 to ffff, so the last subnet is 2001:db8:acad:ffff::/64.", "16-битный subnet ID идёт от 0000 до ffff, поэтому последняя подсеть — 2001:db8:acad:ffff::/64."),

  qx("Why is the total 65,536 subnets in the /48 example and not 65,535?", "Subnet 0000 is counted too", [
    ["One subnet is kept for broadcasts", "IPv6 has no broadcast, so no subnet is kept for it.", "В IPv6 нет broadcast, и подсеть под него не резервируют."],
    ["The ISP reserves subnet ffff for itself", "ffff is the customer's last subnet; the ISP owns only the routing prefix.", "ffff — последняя подсеть клиента; провайдеру принадлежит только префикс маршрутизации."],
    ["The router keeps one subnet for its LLAs", "LLAs come from fe80::/10, not from the GUA subnets.", "LLA берутся из fe80::/10, а не из подсетей GUA."],
  ], "0000 through ffff is 2^16 = 65,536 values, and 0000 is a valid subnet like any other.", "От 0000 до ffff — 2^16 = 65 536 значений, и 0000 — такая же допустимая подсеть, как остальные."),

  qx("Which subnet directly follows 2001:db8:acad:f::/64?", "2001:db8:acad:10::/64", [
    ["2001:db8:acad:g::/64", "g is not a hex digit; after f the count carries into the next digit.", "g — не шестнадцатеричная цифра; после f счёт переходит в следующий разряд."],
    ["2001:db8:acad:ff::/64", "ff is 255; it comes much later in the sequence.", "ff — это 255; до неё ещё далеко."],
    ["2001:db8:acad:f1::/64", "f1 is 241; after f (15) comes 10 (16).", "f1 — это 241; после f (15) идёт 10 (16)."],
  ], "The subnet ID is counted in hexadecimal: …:e, …:f, …:10, …:11.", "Subnet ID считают в шестнадцатеричной системе: …:e, …:f, …:10, …:11."),

  qx("In the 2001:db8:acad::/48 example, which part stays identical in every subnet?", "The global routing prefix 2001:db8:acad", [
    ["The subnet ID hextet", "The subnet ID is the part that changes from subnet to subnet.", "Subnet ID — как раз та часть, что меняется от подсети к подсети."],
    ["The interface ID part of every host address", "Interface IDs identify individual hosts and differ.", "Идентификаторы интерфейсов обозначают отдельные хосты и различаются."],
    ["The fourth hextet, 0001", "The fourth hextet is the subnet ID, which takes values 0000 to ffff.", "Четвёртый хекстет — subnet ID, он принимает значения от 0000 до ffff."],
  ], "The global routing prefix is the same for all subnets; only the subnet ID hextet is incremented.", "Глобальный префикс маршрутизации одинаков для всех подсетей; увеличивается только хекстет subnet ID."),

  qx("In the slide allocation from 2001:db8:acad::/48, how many subnets are used, and why that number?", "Five — one per link, the R1–R2 serial link included", [
    ["Four — one per LAN, since the serial link needs none", "The serial WAN link between the routers is a link too and gets its own /64.", "Последовательный канал WAN между маршрутизаторами — тоже канал, и он получает свой /64."],
    ["Two — one per router, shared by its interfaces", "Each router interface must be on a different IPv6 subnet.", "Каждый интерфейс маршрутизатора должен быть в своей подсети IPv6."],
    ["Five — one per PC, plus one for the routers", "There are four PCs; the five subnets are the four LANs and the serial link.", "ПК четыре; пять подсетей — это четыре LAN и последовательный канал."],
  ], "Five subnets out of 65,536: 2001:db8:acad:1:: to 5::/64 — four LANs and the serial link between R1 and R2.", "Пять подсетей из 65 536: от 2001:db8:acad:1:: до 5::/64 — четыре LAN и последовательный канал между R1 и R2."),

  qx("R1's S0/1/0 has 2001:db8:acad:3::1/64. Which address can R2's S0/1/0 use on the same serial link?", "2001:db8:acad:3::2/64", [
    ["2001:db8:acad:4::1/64", "Subnet 4 is the LAN of PC3; both ends of the serial link share subnet 3.", "Подсеть 4 — LAN компьютера PC3; оба конца последовательного канала — в подсети 3."],
    ["2001:db8:acad:3::1/64", "::1 is already used by R1 on this link; duplicate addresses are not allowed.", "::1 в этом канале уже занят R1; дубликаты адресов недопустимы."],
    ["2001:db8:acad::3/64", "This address is in subnet 0000, not subnet 3; ::3 here is the interface ID.", "Этот адрес — в подсети 0000, а не 3; ::3 здесь — идентификатор интерфейса."],
  ], "Both ends of a link are in the same /64: in the slide R1 S0/1/0 is ::1 and R2 S0/1/0 is ::2 in 2001:db8:acad:3::/64.", "Оба конца канала — в одной подсети /64: на слайде у R1 S0/1/0 — ::1, а у R2 S0/1/0 — ::2 в 2001:db8:acad:3::/64."),

  qx("What rule does the slide “Router Configured with IPv6 Subnets” demonstrate?", "Each router interface is on a different IPv6 subnet", [
    ["All interfaces of a router share one /64", "One subnet per link: G0/0/0 uses :1::, G0/0/1 :2:: and S0/1/0 :3::.", "Одна подсеть на канал: G0/0/0 — :1::, G0/0/1 — :2::, S0/1/0 — :3::."],
    ["Router interfaces need no GUA when they already have an LLA", "The slide gives every interface a GUA with ipv6 address.", "На слайде каждому интерфейсу задан GUA командой ipv6 address."],
    ["The serial interface uses the whole /48 prefix", "S0/1/0 gets 2001:db8:acad:3::1/64, one /64 like the others.", "S0/1/0 получает 2001:db8:acad:3::1/64 — такой же /64, как остальные."],
  ], "Each of R1's interfaces is configured in its own /64: 2001:db8:acad:1::1, 2::1 and 3::1.", "Каждый интерфейс R1 настроен в своей подсети /64: 2001:db8:acad:1::1, 2::1 и 3::1."),

  qx("What does ICMP provide?", "Feedback about problems in processing IP packets", [
    ["Reliable delivery by resending any lost packets automatically", "ICMP reports problems; it does not resend anything or make IP reliable.", "ICMP сообщает о проблемах, но ничего не пересылает заново и не делает IP надёжным."],
    ["Automatic address assignment for hosts", "Address assignment is the job of SLAAC and DHCP.", "Выдачей адресов занимаются SLAAC и DHCP."],
    ["Encryption of the IP payload", "ICMP has nothing to do with encryption.", "ICMP не имеет отношения к шифрованию."],
  ], "ICMP provides feedback about issues related to the processing of IP packets under certain conditions.", "ICMP даёт обратную связь о проблемах при обработке IP-пакетов в определённых условиях."),

  qx("How does ICMPv6 compare with ICMPv4?", "It adds functionality, such as Neighbor Discovery", [
    ["It drops Echo messages, so IPv6 ping needs ICMPv4", "ping works over IPv6 with ICMPv6 Echo Request and Echo Reply.", "ping работает и по IPv6 — через ICMPv6 Echo Request и Echo Reply."],
    ["It runs only between routers, never on hosts", "Hosts use ICMPv6 all the time: RS, NS, NA, echo.", "Хосты постоянно используют ICMPv6: RS, NS, NA, echo."],
    ["It replaces the IPv6 header with its own", "ICMPv6 messages travel inside IPv6 packets.", "Сообщения ICMPv6 едут внутри пакетов IPv6."],
  ], "ICMPv6 is the messaging protocol for IPv6 and includes additional functionality, including the four Neighbor Discovery messages.", "ICMPv6 — протокол сообщений для IPv6 с дополнительными функциями, включая четыре сообщения Neighbor Discovery."),

  qx("What does the lecture note about ICMPv4 messages inside a network?", "They are not required and are often blocked for security", [
    ["They are required on every IPv4 host and cannot be filtered", "ICMPv4 messages are not required and are often not allowed.", "Сообщения ICMPv4 не обязательны и часто запрещены."],
    ["They are encrypted, so firewalls cannot read them", "ICMP is not encrypted; administrators filter it for security.", "ICMP не шифруется; администраторы фильтруют его ради безопасности."],
    ["They are sent only by DHCP servers", "Routers and hosts send ICMP messages, not only servers.", "ICMP-сообщения шлют маршрутизаторы и хосты, а не только серверы."],
  ], "ICMPv4 messages are not required and are often not allowed within a network for security reasons.", "Сообщения ICMPv4 не обязательны и часто запрещены в сети по соображениям безопасности."),

  qx("Which ICMP messages does ping use?", "Echo Request and Echo Reply", [
    ["Time Exceeded and Destination Unreachable", "These are error messages; ping relies on echo.", "Это сообщения об ошибках, а ping опирается на echo."],
    ["Router Solicitation and Router Advertisement", "RS and RA are for dynamic address allocation.", "RS и RA служат для динамической выдачи адресов."],
    ["Neighbor Solicitation and Neighbor Advertisement", "NS and NA are for DAD and address resolution.", "NS и NA нужны для DAD и разрешения адресов."],
  ], "The local host sends an ICMP Echo Request, and if the destination is available it responds with an Echo Reply.", "Локальный хост отправляет ICMP Echo Request, и если узел доступен, он отвечает Echo Reply."),

  qx("What does the code inside a Destination Unreachable message tell the source?", "Why the packet could not be delivered", [
    ["How many hops the packet travelled", "Hop counting is TTL or Hop Limit, not the code.", "Переходы считают TTL или Hop Limit, а не код."],
    ["Which TTL value to use next time", "The code gives a reason; it does not set a TTL.", "Код сообщает причину и не задаёт TTL."],
    ["Which port the reply must be sent from", "The code may say a port is unreachable, but it never chooses one.", "Код может сказать, что порт недоступен, но порт он не выбирает."],
  ], "The ICMP message includes a code indicating why the packet could not be delivered.", "Сообщение ICMP содержит код, указывающий, почему пакет не удалось доставить."),

  qx("A router has no route to the destination network of an IPv4 packet. Which ICMPv4 Destination Unreachable code fits?", "0 — net unreachable", [
    ["1 — host unreachable", "Code 1 means the network was found but not the host.", "Код 1 значит, что сеть найдена, а хост — нет."],
    ["2 — protocol unreachable", "Code 2 means the host does not support the protocol.", "Код 2 значит, что хост не поддерживает протокол."],
    ["3 — port unreachable", "Code 3 means the host has no service on that port.", "Код 3 значит, что на хосте нет службы на этом порту."],
  ], "ICMPv4 codes: 0 net, 1 host, 2 protocol, 3 port unreachable.", "Коды ICMPv4: 0 — сеть, 1 — хост, 2 — протокол, 3 — порт недоступен."),

  qx("What does ICMPv6 Destination Unreachable code 1 mean?", "Communication administratively prohibited", [
    ["Host unreachable", "Host unreachable is code 1 in ICMPv4, not in ICMPv6.", "Host unreachable — код 1 в ICMPv4, а не в ICMPv6."],
    ["No route to destination", "No route to destination is ICMPv6 code 0.", "No route to destination — код 0 в ICMPv6."],
    ["Port unreachable", "Port unreachable is code 4 in ICMPv6.", "Port unreachable — код 4 в ICMPv6."],
  ], "ICMPv6 code 1: communication with the destination is administratively prohibited, for example by a firewall.", "Код 1 в ICMPv6: связь с узлом административно запрещена, например межсетевым экраном."),

  qx("Which ICMPv6 Destination Unreachable code means port unreachable?", "Code 4", [
    ["Code 3", "Code 3 is port unreachable in ICMPv4; in ICMPv6 code 3 is address unreachable.", "Код 3 — port unreachable в ICMPv4; в ICMPv6 код 3 — address unreachable."],
    ["Code 1", "ICMPv6 code 1 is administratively prohibited.", "Код 1 в ICMPv6 — administratively prohibited."],
    ["Code 2", "ICMPv6 code 2 is beyond scope of the source address.", "Код 2 в ICMPv6 — beyond scope of the source address."],
  ], "ICMPv6 codes: 0 no route, 1 administratively prohibited, 2 beyond scope, 3 address unreachable, 4 port unreachable.", "Коды ICMPv6: 0 — нет маршрута, 1 — административный запрет, 2 — вне области адреса источника, 3 — адрес недоступен, 4 — порт недоступен."),

  qx("What does ICMPv6 Destination Unreachable code 3 mean?", "Address unreachable", [
    ["Port unreachable", "Port unreachable is code 3 only in ICMPv4; in ICMPv6 it is code 4.", "Port unreachable — код 3 только в ICMPv4; в ICMPv6 это код 4."],
    ["No route to destination", "No route to destination is ICMPv6 code 0.", "No route to destination — код 0 в ICMPv6."],
    ["Beyond scope of the source address", "Beyond scope of the source address is ICMPv6 code 2.", "Beyond scope of the source address — код 2 в ICMPv6."],
  ], "In ICMPv6, code 3 is address unreachable; ICMPv6 has similar but slightly different codes from ICMPv4.", "В ICMPv6 код 3 — address unreachable; коды ICMPv6 похожи на коды ICMPv4, но немного отличаются."),

  qx("A router decrements the TTL of an IPv4 packet to 0. What does it do?", "Drops it and sends Time Exceeded to the source", [
    ["Resets the TTL to 255 and forwards it", "Routers never reset the TTL; that would let packets loop forever.", "Маршрутизаторы никогда не сбрасывают TTL — иначе пакеты кружили бы вечно."],
    ["Sends Destination Unreachable code 0 to the destination", "The report goes to the source, and the message is Time Exceeded.", "Сообщение идёт источнику, и это Time Exceeded."],
    ["Forwards it along the default route anyway", "A packet with TTL 0 is never forwarded.", "Пакет с TTL 0 никогда не пересылается."],
  ], "When the TTL is decremented to 0, the packet is discarded and an ICMPv4 Time Exceeded message is sent to the source host.", "Когда TTL уменьшается до 0, пакет отбрасывается, а источнику отправляется сообщение ICMPv4 Time Exceeded."),

  qx("A ping to 8.8.8.8 shows “Reply from 192.168.1.1: TTL expired in transit” four times and 0% loss. What is true?", "8.8.8.8 was not reached; 192.168.1.1 dropped the packets", [
    ["8.8.8.8 answered all four echo requests", "The replies come from 192.168.1.1, not from 8.8.8.8.", "Ответы пришли от 192.168.1.1, а не от 8.8.8.8."],
    ["192.168.1.1 is the address that 8.8.8.8 uses inside the LAN", "192.168.1.1 is the router where the TTL reached 0.", "192.168.1.1 — маршрутизатор, на котором TTL дошёл до 0."],
    ["The host's own TTL was set to 0 before sending", "A packet sent with TTL 0 would never reach the router at all.", "Пакет с TTL 0 вообще не дошёл бы до маршрутизатора."],
  ], "The replies are Time Exceeded messages from router 192.168.1.1, for example because of a routing loop. Received = 4 counts these errors, so 0% loss does not mean 8.8.8.8 answered.", "Ответы — это сообщения Time Exceeded от маршрутизатора 192.168.1.1, например из-за петли маршрутизации. Received = 4 считает эти ошибки, так что 0% потерь не значит, что 8.8.8.8 ответил."),

  qx("Which four messages make up the ICMPv6 Neighbor Discovery Protocol?", "RS, RA, NS and NA", [
    ["RS, RA, Echo Request and Echo Reply", "Echo messages are common to ICMPv4 and ICMPv6, not part of ND.", "Сообщения echo есть и в ICMPv4, и в ICMPv6; к ND они не относятся."],
    ["NS, NA, ARP request and ARP reply", "ARP belongs to IPv4; IPv6 replaced it with NS and NA.", "ARP относится к IPv4; в IPv6 его заменили NS и NA."],
    ["RS, RA, DHCPv6 Solicit and Reply", "DHCPv6 is a separate protocol, not part of ND.", "DHCPv6 — отдельный протокол, а не часть ND."],
  ], "ND has four messages: RS and RA between a router and a device, NS and NA between devices.", "В ND четыре сообщения: RS и RA — между маршрутизатором и устройством, NS и NA — между устройствами."),

  qx("How often do IPv6-enabled routers send RA messages, according to the lecture?", "Every 200 seconds", [
    ["Every 30 seconds", "30 seconds is not the RA interval given on the slide.", "30 секунд — не тот интервал RA, что указан на слайде."],
    ["Every 2 seconds", "2 seconds is the ping timeout in the IOS output, not the RA interval.", "2 секунды — тайм-аут ping в выводе IOS, а не интервал RA."],
    ["Only once, after boot", "RAs are sent periodically, and also in response to an RS.", "RA рассылаются периодически, а также в ответ на RS."],
  ], "RA messages are sent by IPv6-enabled routers every 200 seconds to provide addressing information to hosts.", "Маршрутизаторы с IPv6 рассылают RA каждые 200 секунд, чтобы передать хостам сведения об адресации."),

  qx("In the slide dialogue R1 says: “use my link-local address fe80::1 as your default gateway.” What will PC1 set as its gateway?", "fe80::1", [
    ["2001:db8:acad:1::1", "R1's GUA could be a gateway, but the RA offers the LLA, the source of the RA.", "GUA маршрутизатора R1 мог бы быть шлюзом, но RA предлагает LLA — источник RA."],
    ["ff02::2", "ff02::2 is the all-routers multicast group, not a gateway.", "ff02::2 — multicast-группа всех маршрутизаторов, а не шлюз."],
    ["2001:db8:acad:1::/64", "This is the prefix from the RA, not a gateway address.", "Это префикс из RA, а не адрес шлюза."],
  ], "A host using SLAAC sets its default gateway to the link-local address of the router that sent the RA — here fe80::1.", "Хост со SLAAC делает шлюзом по умолчанию link-local адрес маршрутизатора, приславшего RA, — здесь fe80::1."),

  qx("During duplicate address detection, which address is the target of the NS message?", "The device's own new address", [
    ["The router's link-local address", "DAD checks the device's own address, not the router's.", "DAD проверяет собственный адрес устройства, а не адрес маршрутизатора."],
    ["The all-routers address ff02::2", "DAD is about other devices using the address, not routers in general.", "DAD выясняет, не занят ли адрес другим устройством, а маршрутизаторы тут ни при чём."],
    ["The DNS server address from the RA", "DNS servers play no part in DAD.", "DNS-серверы в DAD не участвуют."],
  ], "To check uniqueness, the device sends an NS with its own IPv6 address as the targeted address.", "Чтобы проверить уникальность, устройство отправляет NS, где целевой адрес — его собственный адрес IPv6."),

  tfx("DAD is mandatory: an IPv6 device must perform it for every unicast address.", false,
    "False. A device may perform DAD. It is not required, but RFC 4861 recommends performing it on unicast addresses.",
    "Неверно. Устройство может выполнять DAD. Это не обязательно, но RFC 4861 рекомендует выполнять его для unicast-адресов.",
    "Answering True turns a recommendation into a rule; the slide says “may perform” and “not required”.",
    "Ответ «верно» превращает рекомендацию в правило; на слайде сказано «may perform» и «not required»."),

  qx("To learn a neighbor's MAC address, where does an IPv6 host send the NS?", "To the target's solicited-node multicast address", [
    ["To ff02::1, like an ARP broadcast", "The NS goes to the solicited-node group so that only the target processes it.", "NS идёт группе solicited-node, чтобы его обработал только нужный узел."],
    ["To ff02::2, the all-routers group", "The neighbor is usually a host, not a router.", "Соседом обычно бывает хост, а не маршрутизатор."],
    ["To the MAC address ff:ff:ff:ff:ff:ff", "That is the Ethernet broadcast used by IPv4 ARP.", "Это широковещательный Ethernet-адрес, который использует ARP в IPv4."],
  ], "The device sends an NS to the solicited-node address with the targeted IPv6 address; the owner answers with an NA containing its MAC.", "Устройство отправляет NS на solicited-node адрес с целевым адресом IPv6; владелец отвечает NA со своим MAC."),

  qx("On the slide R1 sends an NS asking for the MAC address of 2001:db8:acad:1::10. What does PC1's reply contain?", "An NA with its MAC, 00:aa:bb:cc:dd:ee", [
    ["An RA with the prefix 2001:db8:acad:1::/64", "Hosts do not send RAs; the answer to an NS is an NA.", "Хосты не шлют RA; ответ на NS — это NA."],
    ["An Echo Reply with its interface ID", "Echo Reply answers a ping, not an NS.", "Echo Reply отвечает на ping, а не на NS."],
    ["An NS asking R1 for its own MAC address", "PC1 answers the question; it does not ask a new one.", "PC1 отвечает на вопрос, а не задаёт новый."],
  ], "The device with the targeted IPv6 address responds with an NA containing its Ethernet MAC address — 00:aa:bb:cc:dd:ee on the slide.", "Устройство с целевым адресом IPv6 отвечает NA со своим MAC-адресом Ethernet — на слайде 00:aa:bb:cc:dd:ee."),

  tfx("IPv6 hosts use ARP to find the MAC address of a neighbor.", false,
    "False. IPv6 has no ARP; NS and NA messages do the job of the ARP request and reply.",
    "Неверно. В IPv6 нет ARP; работу запроса и ответа ARP выполняют сообщения NS и NA.",
    "Answering True carries IPv4 over to IPv6: ARP relies on broadcast, which IPv6 does not have.",
    "Ответ «верно» переносит IPv4 на IPv6: ARP опирается на broadcast, которого в IPv6 нет."),

  qx("Besides individual replies, what summary does ping print at the end?", "The success rate and average round-trip time", [
    ["A list of every hop on the path", "A list of hops is what traceroute provides.", "Список переходов выдаёт traceroute."],
    ["The MAC address of the destination", "MAC addresses come from ARP or ND, not from the ping summary.", "MAC-адреса дают ARP или ND, а не итог ping."],
    ["The TTL value that each router on the path set", "Routers' TTL values are not part of the ping summary.", "Значения TTL на маршрутизаторах в итог ping не входят."],
  ], "ping provides a summary that includes the success rate and the average round-trip time to the destination.", "ping выводит итог с долей успешных ответов и средним временем приёма-передачи до узла."),

  qx("In Cisco IOS ping output, what do the symbols ! and . mean?", "! is a reply received, . is a timeout", [
    ["! is a timeout, . is a reply received", "The meanings are swapped: .!!!! shows one timeout and then four replies.", "Значения перепутаны: .!!!! — это один тайм-аут и затем четыре ответа."],
    ["! is TTL expired, . is net unreachable", "Neither symbol stands for those errors in this output.", "Ни один из символов в этом выводе не обозначает такие ошибки."],
    ["! is an ARP request, . is an NS message", "The symbols report echo results, not address resolution messages.", "Символы показывают результат echo, а не сообщения разрешения адресов."],
  ], "In IOS output ! is a received reply and . is a timeout; .!!!! is the classic picture of the first packet lost to ARP.", "В выводе IOS ! — полученный ответ, . — тайм-аут; .!!!! — классическая картина, когда первый пакет теряется из-за ARP."),

  qx("Pinging 127.0.0.1 returns an error instead of replies. What does this indicate?", "TCP/IP is not operational on the host", [
    ["The default gateway is down", "The loopback test never leaves the host, so the gateway is not involved.", "Проверка loopback не выходит за пределы хоста, шлюз в ней не участвует."],
    ["The remote server blocks ICMP", "No remote server is involved in a loopback ping.", "Удалённый сервер в пинге loopback не участвует."],
    ["The cable from the host to the switch is unplugged", "The loopback ping does not use the NIC or the cable.", "Пинг loopback не задействует сетевую карту и кабель."],
  ], "A response from 127.0.0.1 (or ::1) means IP is properly installed; an error message indicates that TCP/IP is not operational on the host.", "Ответ от 127.0.0.1 (или ::1) значит, что IP установлен правильно; сообщение об ошибке говорит, что TCP/IP на хосте не работает."),

  qx("A ping to the default gateway succeeds. What does that confirm?", "The host and the gateway interface work on the local network", [
    ["The remote web server is reachable", "Remote reachability needs a ping to a host on another network.", "Для проверки удалённой доступности нужен пинг хоста в другой сети."],
    ["Every router on the path to the internet is up", "Only the first router, the gateway, has been tested.", "Проверен только первый маршрутизатор — шлюз."],
    ["Only that IP is installed on the host", "That is what the loopback test shows; the gateway test proves more.", "Это показывает проверка loopback; проверка шлюза доказывает больше."],
  ], "A successful ping to the default gateway indicates that the host and the router interface serving as the gateway are both operational on the local network.", "Успешный пинг шлюза по умолчанию показывает, что и хост, и интерфейс маршрутизатора, служащий шлюзом, работают в локальной сети."),

  qx("A ping to a remote web server fails, yet the website opens fine in a browser from the same host. What is the most likely explanation?", "ICMP is filtered for security reasons", [
    ["The default gateway is down", "The website would not open if the gateway were down.", "При неработающем шлюзе сайт бы не открылся."],
    ["IP is not properly installed on the host", "The browser works over IP, so IP is clearly installed.", "Браузер работает поверх IP, значит, IP точно установлен."],
    ["The server's TTL is set too high", "A high TTL does not stop replies.", "Высокий TTL ответам не мешает."],
  ], "Many administrators limit or prohibit ICMP messages, so a missing ping response can be due to security restrictions, not a fault.", "Многие администраторы ограничивают или запрещают ICMP, поэтому отсутствие ответа на ping может объясняться ограничениями безопасности, а не неисправностью."),

  qx("Which Layer 3 header fields does traceroute rely on?", "TTL in IPv4 and Hop Limit in IPv6", [
    ["Flow Label in IPv6 and DS in IPv4", "These fields mark flows and QoS; they do not count hops.", "Эти поля помечают потоки и QoS, а не считают переходы."],
    ["The source and destination ports", "Ports are Layer 4, not Layer 3 header fields.", "Порты относятся к уровню 4, а не к заголовку уровня 3."],
    ["The header checksum and fragment offset", "Neither field limits how far a packet travels.", "Ни одно из этих полей не ограничивает дальность пакета."],
  ], "Traceroute uses the TTL field in IPv4 and the Hop Limit field in IPv6, along with the ICMP Time Exceeded message.", "Traceroute использует поле TTL в IPv4 и поле Hop Limit в IPv6 вместе с сообщением ICMP Time Exceeded."),

  qx("In the slide trace R1#traceroute 192.168.40.2, why does line 4 show 192.168.40.2 itself?", "The probe reached the destination, which answered", [
    ["The fourth router uses the same address", "Two devices cannot share that address; 192.168.40.2 is the destination.", "Два устройства не могут делить этот адрес; 192.168.40.2 — узел назначения."],
    ["The TTL expired exactly at the destination", "With TTL 4 the probe arrives; the destination gives the final answer.", "С TTL 4 проба доходит; узел назначения даёт последний ответ."],
    ["Traceroute always repeats the target address at the end", "The line shows a real reply from the destination, not a repeat.", "Строка показывает настоящий ответ узла назначения, а не повтор."],
  ], "Probes with TTL 1–3 expire at the three routers; the probe with TTL 4 arrives, the destination answers and the trace ends.", "Пробы с TTL 1–3 истекают на трёх маршрутизаторах; проба с TTL 4 доходит, узел назначения отвечает, и трассировка заканчивается."),
];
