import { qx, tfx, type Draft } from "../../types";

export const deepL7P1: Draft[] = [
  qx("What is the main reason IPv6 was developed as the successor to IPv4?", "IPv4 is running out of addresses", [
    ["IPv4 packets cannot be carried over fiber links", "IPv4 is media independent and runs over copper, fiber and wireless alike.", "IPv4 не зависит от среды и работает по меди, оптике и радио одинаково."],
    ["IPv4 cannot carry TCP and UDP segments together", "IPv4 carries both TCP and UDP segments every day; the transport protocol is not the problem.", "IPv4 ежедневно переносит и сегменты TCP, и датаграммы UDP; транспортный протокол тут ни при чём."],
    ["IPv4 routers cannot read dotted-decimal addresses", "Dotted decimal is only how people write IPv4 addresses; routers work with the 32 bits.", "Десятичная запись с точками — лишь то, как люди пишут адреса IPv4; маршрутизаторы работают с 32 битами."],
  ], "IPv4 is running out of addresses. IPv6 is the successor to IPv4 and has a much larger 128-bit address space.", "Адреса IPv4 заканчиваются. IPv6 — преемник IPv4 с намного большим 128-битным адресным пространством."),

  qx("Besides a larger address space, what else did the development of IPv6 include?", "Fixes for IPv4 limitations and other enhancements", [
    ["A return to classful addressing with fixed classes", "Classful addressing is an old IPv4 idea; IPv6 uses prefix lengths, not classes.", "Классовая адресация — старая идея IPv4; в IPv6 используют длину префикса, а не классы."],
    ["Mandatory NAT on every router in the path", "IPv6 was designed to make NAT unnecessary, not mandatory.", "IPv6 задумывали так, чтобы NAT стал не нужен, а не обязателен."],
    ["Removal of the transport layer from the stack", "TCP and UDP still run above IPv6; the network layer change does not touch Layer 4.", "TCP и UDP по-прежнему работают поверх IPv6; смена сетевого уровня не затрагивает уровень 4."],
  ], "The development of IPv6 also included fixes for IPv4 limitations and other enhancements.", "При разработке IPv6 заодно исправили ограничения IPv4 и добавили другие улучшения."),

  qx("Which set of factors does the lecture give as the reason it is time to begin the transition to IPv6?", "More internet users, little IPv4 space, NAT issues, IoT", [
    ["Slow Ethernet, costly fiber, Wi-Fi noise and DNS outages", "These are physical or service problems; none of them depends on the IP version.", "Это проблемы физического уровня или служб; ни одна не зависит от версии IP."],
    ["Too few TCP ports, no multicast, no DHCP and a tiny MTU", "Ports belong to TCP and UDP, and IPv4 supports multicast and DHCP; these are not the listed reasons.", "Порты относятся к TCP и UDP, а IPv4 поддерживает multicast и DHCP; это не названные причины."],
    ["Short TTL values, weak checksums and ARP storms", "TTL, checksums and ARP are not the reasons on the slide; the problem is addressing.", "TTL, контрольные суммы и ARP — не причины со слайда; проблема в адресации."],
  ], "The slide lists an increasing internet population, a limited IPv4 address space, issues with NAT and the IoT.", "На слайде названы растущее число пользователей интернета, ограниченное пространство IPv4, проблемы NAT и IoT."),

  qx("Why does the Internet of Things (IoT) push networks toward IPv6?", "Billions of new devices each need an IP address", [
    ["IoT devices cannot understand IPv4 headers", "Many IoT devices run IPv4 today; the issue is the number of addresses, not the header.", "Многие IoT-устройства сегодня работают на IPv4; проблема в количестве адресов, а не в заголовке."],
    ["IoT traffic must be carried in tunnels", "Tunneling is a transition technique, not something IoT requires.", "Туннелирование — способ перехода, а не требование IoT."],
    ["IoT devices are too small for an Ethernet port", "The physical size of a device has nothing to do with the IP version.", "Физический размер устройства никак не связан с версией IP."],
  ], "Every connected sensor, camera or appliance needs an address, and the free IPv4 space is gone; the 128-bit IPv6 space solves this.", "Каждому подключённому датчику, камере или прибору нужен адрес, а свободного пространства IPv4 уже нет; 128-битное пространство IPv6 решает эту задачу."),

  qx("The slide map shows the regional internet registries (RIRs) and IPv4 exhaustion. What idea should you take from it?", "The RIRs ran out of IPv4 one after another, 2011–2015", [
    ["All RIRs ran out of IPv4 on the same day in 2020", "The dates differ by region; only AfriNIC's exhaustion was still a projection (2020).", "Даты по регионам разные; лишь исчерпание у AfriNIC было ещё прогнозом (2020)."],
    ["Only Africa has run out of IPv4 addresses so far", "Africa (AfriNIC) was the last region on the map, not the only one.", "Африка (AfriNIC) — последний регион на карте, а не единственный."],
    ["The RIRs ran out of IPv6 addresses before IPv4", "IPv6 has 2^128 addresses; no registry has run out of them.", "В IPv6 2^128 адресов; ни один регистратор их не исчерпал."],
  ], "The registries exhausted their IPv4 pools one after another between about 2011 and 2015. Remember the idea, not the exact dates — the slide seems to swap the APNIC and LACNIC labels.", "Регистраторы исчерпали запасы IPv4 один за другим примерно в 2011–2015 годах. Запоминай суть, а не точные даты: на слайде, похоже, перепутаны подписи APNIC и LACNIC."),

  qx("The slide graph for Kazakhstan shows almost 100% of hosts supporting IPv4 and a slow growth of IPv6. What follows from it?", "IPv4 and IPv6 must work side by side for years", [
    ["IPv4 can be switched off in Kazakhstan right away", "Almost every host still depends on IPv4, so switching it off would cut them off.", "Почти все хосты ещё зависят от IPv4, и его отключение отрезало бы их от сети."],
    ["IPv6 has already fully replaced IPv4 there", "IPv6 support grows slowly, usually around 20–40%, far from full replacement.", "Поддержка IPv6 растёт медленно, обычно около 20–40%, до полной замены далеко."],
    ["IPv6 is not used in Kazakhstan at all", "The graph shows IPv6 support, just a smaller and slower-growing share.", "На графике поддержка IPv6 есть, просто доля меньше и растёт медленнее."],
  ], "IPv4 support is near 100% while IPv6 grows slowly, so the two versions have to coexist during a transition of several years.", "Поддержка IPv4 близка к 100%, а IPv6 растёт медленно, поэтому обе версии должны сосуществовать в течение многолетнего перехода."),

  qx("Which organization created the protocols and tools that help administrators migrate their networks to IPv6?", "The IETF", [
    ["The IEEE", "The IEEE defines LAN standards and the EUI-64 process, not the IPv6 migration tools.", "IEEE определяет стандарты LAN и процесс EUI-64, но не инструменты миграции на IPv6."],
    ["The RIRs", "The regional registries allocate address blocks; they do not design protocols.", "Региональные регистраторы распределяют блоки адресов, а протоколы не разрабатывают."],
    ["Cisco", "Cisco implements the techniques in IOS, but the standards come from the IETF.", "Cisco реализует эти способы в IOS, но стандарты исходят от IETF."],
  ], "The IETF has created various protocols and tools to help network administrators migrate their networks to IPv6.", "IETF создала разные протоколы и инструменты, помогающие администраторам перевести сети на IPv6."),

  qx("Into which three categories are the IPv4-to-IPv6 migration techniques divided?", "Dual stack, tunneling, translation", [
    ["Unicast, multicast and anycast delivery", "These are the three IPv6 address categories, not migration techniques.", "Это три категории адресов IPv6, а не способы миграции."],
    ["Stateless, stateful and static addressing", "These describe how hosts get addresses (SLAAC, DHCPv6, manual), not how IPv4 and IPv6 coexist.", "Это способы получения адресов хостами (SLAAC, DHCPv6, вручную), а не способы сосуществования IPv4 и IPv6."],
    ["Rule 1, Rule 2 and full expansion", "These are the rules for writing IPv6 addresses, not migration techniques.", "Это правила записи адресов IPv6, а не способы миграции."],
  ], "The migration techniques fall into three categories: dual stack, tunneling and translation (NAT64).", "Способы миграции делятся на три категории: двойной стек, туннелирование и трансляция (NAT64)."),

  qx("A customer network is described as having native IPv6. What does that mean?", "It reaches internet content over its own IPv6 link to the ISP", [
    ["Its IPv6 packets cross the ISP inside IPv4 packets", "Carrying IPv6 inside IPv4 is tunneling, the opposite of native IPv6.", "Перенос IPv6 внутри IPv4 — это туннелирование, противоположность native IPv6."],
    ["Its IPv6 hosts reach IPv4 servers only through NAT64", "NAT64 is translation; native IPv6 means a real IPv6 connection.", "NAT64 — это трансляция; native IPv6 означает настоящее IPv6-подключение."],
    ["It has turned IPv4 off on every device", "Native IPv6 comes with dual stack: IPv4 keeps running alongside it.", "Native IPv6 идёт вместе с двойным стеком: IPv4 продолжает работать рядом."],
  ], "Dual stack is known as native IPv6: the customer network has an IPv6 connection to its ISP and can access internet content over IPv6.", "Двойной стек называют native IPv6: у сети клиента есть IPv6-подключение к провайдеру, и она получает содержимое интернета по IPv6."),

  qx("A company wants each PC and router to talk to IPv4 and IPv6 destinations directly, with no encapsulation and no translation. Which technique fits?", "Dual stack", [
    ["Tunneling", "Tunneling encapsulates IPv6 inside IPv4, which the company wants to avoid.", "Туннелирование инкапсулирует IPv6 в IPv4, а компания хочет без этого обойтись."],
    ["NAT64", "NAT64 translates packets between the versions, which the company wants to avoid.", "NAT64 переводит пакеты между версиями, а компания хочет без этого обойтись."],
    ["Unique local addressing", "Unique local addresses are a type of IPv6 address, not a way to keep IPv4 running too.", "Unique local — тип адресов IPv6, а не способ сохранить работу IPv4."],
  ], "Dual stack devices run both IPv4 and IPv6 protocol stacks simultaneously, so they reach each version natively.", "Устройства с двойным стеком одновременно запускают стеки IPv4 и IPv6 и обращаются к каждой версии напрямую."),

  qx("In tunneling, what happens to the IPv6 packet as it crosses the IPv4-only network?", "It rides unchanged as the payload of an IPv4 packet", [
    ["It is rewritten into an equivalent IPv4 packet", "Rewriting one version into the other is translation (NAT64), not tunneling.", "Переписывание одной версии в другую — это трансляция (NAT64), а не туннелирование."],
    ["Its 128-bit addresses are shortened to 32 bits", "Tunneling never changes the IPv6 addresses; the whole packet is carried as data.", "Туннель никогда не меняет адреса IPv6; весь пакет передаётся как данные."],
    ["It is split into four IPv4 fragments of 32 bits each", "Tunneling does not chop the packet by address size; it adds an IPv4 header around it.", "Туннель не режет пакет по размеру адреса; он добавляет вокруг него заголовок IPv4."],
  ], "Tunneling transports an IPv6 packet over an IPv4 network by encapsulating it inside an IPv4 packet, similar to other types of data.", "Туннелирование передаёт пакет IPv6 через сеть IPv4, инкапсулируя его в пакет IPv4 как обычные данные."),

  qx("In the slide's tunneling figure, which devices must run both IPv4 and IPv6?", "The edge routers at both ends of the tunnel", [
    ["Every router inside the IPv4-only network", "The routers in the middle see only IPv4 packets; they need no IPv6 at all.", "Маршрутизаторы посередине видят только пакеты IPv4; IPv6 им не нужен вовсе."],
    ["Only the IPv6 hosts in the two islands", "The hosts stay IPv6-only; it is the tunnel endpoints that add and remove the IPv4 header.", "Хосты остаются только с IPv6; заголовок IPv4 добавляют и снимают концы туннеля."],
    ["No device, since tunneling needs no IPv4 support", "Someone must build the IPv4 header around the IPv6 packet, so the tunnel ends need IPv4.", "Кто-то должен построить заголовок IPv4 вокруг пакета IPv6, поэтому концам туннеля нужен IPv4."],
  ], "The edge routers at the tunnel ends are dual stack: they encapsulate the IPv6 packet into IPv4 and take it out again.", "Пограничные маршрутизаторы на концах туннеля работают с двойным стеком: они вкладывают пакет IPv6 в IPv4 и достают его обратно."),

  qx("Which statement about NAT64 is correct?", "It converts IPv6 packets to IPv4 and IPv4 packets to IPv6", [
    ["It converts packets only in the IPv6-to-IPv4 direction", "Replies must come back too, so NAT64 also translates IPv4 packets into IPv6.", "Ответы тоже должны вернуться, поэтому NAT64 переводит и пакеты IPv4 в IPv6."],
    ["It carries IPv6 packets inside IPv4 without changes", "Carrying a packet unchanged inside another is tunneling.", "Перенос пакета без изменений внутри другого — это туннелирование."],
    ["It maps private IPv4 addresses to public ones", "That is ordinary NAT for IPv4; NAT64 works between the two IP versions.", "Это обычный NAT для IPv4; NAT64 работает между двумя версиями IP."],
  ], "NAT64 lets IPv6-enabled devices communicate with IPv4-enabled devices: an IPv6 packet is translated to IPv4 and an IPv4 packet to IPv6.", "NAT64 позволяет устройствам с IPv6 общаться с устройствами с IPv4: пакет IPv6 переводится в IPv4, а пакет IPv4 — в IPv6."),

  qx("One slide answer about migration mentions proxying and translation (NAT-PT). Which coexistence category is that?", "Translation", [
    ["Tunneling", "Tunneling encapsulates without translating; NAT-PT translates the packets.", "Туннелирование инкапсулирует без перевода, а NAT-PT именно переводит пакеты."],
    ["Dual stack", "Dual stack runs both stacks on a device; nothing is translated.", "Двойной стек запускает оба стека на устройстве; ничего не переводится."],
    ["Stateful DHCPv6", "DHCPv6 assigns addresses; it is not a coexistence technique.", "DHCPv6 выдаёт адреса; это не способ сосуществования."],
  ], "NAT-PT is the older name of the translation approach; NAT64 replaced it.", "NAT-PT — старое название подхода с трансляцией; на смену ему пришёл NAT64."),

  tfx("Tunneling converts each IPv6 packet into an IPv4 packet so that the IPv4 routers in the middle can read its addresses.", false,
    "False. Tunneling translates nothing: the IPv6 packet travels unchanged as the payload of an IPv4 packet, and the IPv4 routers read only the outer IPv4 header.",
    "Неверно. Туннель ничего не переводит: пакет IPv6 едет без изменений как нагрузка пакета IPv4, а маршрутизаторы IPv4 читают только внешний заголовок IPv4.",
    "Answering True mixes tunneling up with translation: only NAT64 rewrites a packet from one IP version into the other.",
    "Ответ «верно» путает туннелирование с трансляцией: переписывает пакет из одной версии IP в другую только NAT64."),

  qx("Which statement about uppercase and lowercase letters in IPv6 addresses is correct?", "2001:DB8::1 and 2001:db8::1 are the same address", [
    ["Uppercase hex digits make an IPv6 address invalid", "IPv6 addresses are not case-sensitive; Cisco IOS even prints them in uppercase.", "Адреса IPv6 не чувствительны к регистру; Cisco IOS даже выводит их заглавными буквами."],
    ["Lowercase letters mark a link-local address", "Link-local is identified by the prefix fe80::/10, not by letter case.", "Link-local определяется префиксом fe80::/10, а не регистром букв."],
    ["Only the first hextet may be written in uppercase", "There is no such rule: any hextet may use either case.", "Такого правила нет: любой хекстет можно писать в любом регистре."],
  ], "IPv6 addresses are not case-sensitive and can be written in either lowercase or uppercase.", "Адреса IPv6 не чувствительны к регистру: их можно писать и строчными, и заглавными буквами."),

  qx("How many bits does a single hexadecimal digit of an IPv6 address represent?", "4", [
    ["8", "Eight bits is a byte, written as two hex digits.", "Восемь бит — это байт, он записывается двумя шестнадцатеричными цифрами."],
    ["16", "Sixteen bits is a whole hextet, which is four hex digits.", "Шестнадцать бит — целый хекстет, то есть четыре шестнадцатеричные цифры."],
    ["2", "Two bits give only four values; a hex digit has sixteen (0–f).", "Два бита дают лишь четыре значения, а у шестнадцатеричной цифры их шестнадцать (0–f)."],
  ], "One hex digit = 4 bits, so four hex digits = 16 bits = one hextet.", "Одна шестнадцатеричная цифра — 4 бита, значит, четыре цифры — 16 бит, один хекстет."),

  qx("How many hextets does a complete IPv6 address contain?", "Eight", [
    ["Four", "Four groups is the IPv4 pattern of four octets.", "Четыре группы — это схема IPv4 из четырёх октетов."],
    ["Sixteen", "Sixteen groups of 8 bits would also give 128 bits, but IPv6 is written as 16-bit hextets.", "Шестнадцать групп по 8 бит тоже дали бы 128 бит, но IPv6 записывают 16-битными хекстетами."],
    ["Six", "Six hextets are only 96 bits, short of 128.", "Шесть хекстетов — всего 96 бит, меньше 128."],
  ], "8 hextets × 16 bits = 128 bits: the preferred format is x:x:x:x:x:x:x:x.", "8 хекстетов × 16 бит = 128 бит: предпочтительный формат — x:x:x:x:x:x:x:x."),

  qx("Roughly how many addresses does the 128-bit IPv6 space provide?", "2^128, about 3.4 × 10^38", [
    ["2^32, about 4.3 billion", "2^32 is the whole IPv4 space.", "2^32 — всё пространство IPv4."],
    ["2^64, about 18 quintillion", "2^64 is the number of addresses in a single /64 subnet, not in the whole IPv6 space.", "2^64 — число адресов в одной подсети /64, а не во всём пространстве IPv6."],
    ["2^96, about 7.9 × 10^28", "96 bits would be only six hextets; IPv6 addresses are 128 bits.", "96 бит — это всего шесть хекстетов; адреса IPv6 — 128 бит."],
  ], "128 bits give 2^128 addresses — about 340 undecillion, or 3.4 × 10^38.", "128 бит дают 2^128 адресов — около 340 ундециллионов, то есть 3,4 × 10^38."),

  qx("Which comparison of IPv4 and IPv6 notation is correct?", "IPv4: 4 octets, dots; IPv6: 8 hextets, colons", [
    ["IPv4: 8 octets, colons; IPv6: 4 hextets, dots", "Both counts and both separators are swapped.", "Перепутаны и количество групп, и разделители."],
    ["IPv4: 4 hextets, dots; IPv6: 8 octets, colons", "Octets (8 bits) belong to IPv4 and hextets (16 bits) to IPv6, not the other way round.", "Октеты (8 бит) — у IPv4, хекстеты (16 бит) — у IPv6, а не наоборот."],
    ["IPv4: 4 octets, colons; IPv6: 8 hextets, dots", "IPv4 uses dots and IPv6 uses colons; the separators are swapped.", "В IPv4 разделитель — точка, в IPv6 — двоеточие; здесь они перепутаны."],
  ], "IPv4 is dotted decimal with 4 octets of 8 bits; IPv6 is hexadecimal with 8 hextets of 16 bits separated by colons.", "IPv4 — десятичная запись с точками, 4 октета по 8 бит; IPv6 — шестнадцатеричная, 8 хекстетов по 16 бит через двоеточие."),

  qx("Which address is written in the preferred format?", "2001:0db8:0000:00a3:abcd:0000:0000:1234", [
    ["2001:db8:0:a3:abcd:0:0:1234", "Leading zeros are omitted here (Rule 1), so this is not the full preferred form.", "Здесь убраны ведущие нули (правило 1), так что это не полная предпочтительная форма."],
    ["2001:0db8:0000:00a3:abcd::1234", "The :: hides two zero hextets; the preferred format writes every hextet out.", "Здесь :: скрывает два нулевых хекстета; в предпочтительном формате выписан каждый хекстет."],
    ["2001:0db8:0000:00a3:abcd:0000:0000:1234:0000", "This has nine hextets (144 bits), so it is not a valid IPv6 address at all.", "Здесь девять хекстетов (144 бита), так что это вообще не адрес IPv6."],
  ], "The preferred format is the full one: exactly 8 hextets of exactly 4 hex digits, nothing omitted.", "Предпочтительный формат — полный: ровно 8 хекстетов по ровно 4 шестнадцатеричные цифры, ничего не пропущено."),

  qx("Which result applies only Rule 1 (omit leading zeros) to 2001:0db8:0000:1111:0000:0000:0000:0200?", "2001:db8:0:1111:0:0:0:200", [
    ["2001:db8:0:1111:0:0:0:2", "The zeros at the end of 0200 are trailing zeros; they must stay (200).", "Нули в конце 0200 — замыкающие, их оставляют (200)."],
    ["2001:db8:0:1111::200", "This also applies Rule 2 (::), but the question asks for Rule 1 only.", "Здесь применено ещё и правило 2 (::), а в вопросе — только правило 1."],
    ["2001:db8:0:1111:0:0:0:0200", "The leading zero of 0200 was not removed, so Rule 1 is applied only partly.", "Ведущий ноль в 0200 не убран, значит, правило 1 применено не до конца."],
  ], "Rule 1 removes only leading 0s in every hextet: 0db8 → db8, 0000 → 0, 0200 → 200.", "Правило 1 убирает только ведущие нули в каждом хекстете: 0db8 → db8, 0000 → 0, 0200 → 200."),

  qx("When Rule 1 is applied, what is left of a hextet 0000?", "A single 0", [
    ["Nothing; the hextet is dropped from the address", "Dropping zero hextets is what :: does under Rule 2; Rule 1 always leaves one digit.", "Убирать нулевые хекстеты умеет только :: по правилу 2; правило 1 всегда оставляет одну цифру."],
    ["00, the shortest legal two-digit form", "There is no two-digit minimum; all leading zeros go, and one 0 remains.", "Минимума в две цифры нет: все ведущие нули убираются, и остаётся один 0."],
    ["The whole 0000, since zero hextets cannot be shortened", "Zero hextets can be shortened: 0000 becomes 0.", "Нулевые хекстеты сокращаются: 0000 превращается в 0."],
  ], "Under Rule 1 a hextet of all zeros keeps one zero: 0000 becomes 0.", "По правилу 1 от хекстета из одних нулей остаётся один ноль: 0000 превращается в 0."),

  qx("Why does Rule 1 allow removing only leading zeros and never trailing zeros?", "Otherwise abc could mean 0abc or abc0", [
    ["Trailing zeros carry the prefix length", "The prefix length is written after the slash, not inside the hextets.", "Длину префикса пишут после косой черты, а не внутри хекстетов."],
    ["Routers drop hextets that end in a letter", "Routers work with the 128 bits; the written form does not matter to them.", "Маршрутизаторы работают со 128 битами; форма записи им не важна."],
    ["Trailing zeros mark the start of the interface ID", "Nothing in a hextet marks the interface ID; its position is set by the prefix length.", "Ничто внутри хекстета не отмечает идентификатор интерфейса; его положение задаёт длина префикса."],
  ], "The rule applies only to leading 0s, not trailing 0s, otherwise the address would be ambiguous: abc could expand to 0abc or abc0.", "Правило касается только ведущих нулей, иначе адрес стал бы неоднозначным: abc можно было бы развернуть и в 0abc, и в abc0."),

  qx("Which pair shows a correct use of Rule 1?", "01ab → 1ab", [
    ["0a00 → a", "Only leading zeros may go: 0a00 becomes a00, and a would mean 000a.", "Убирать можно только ведущие нули: 0a00 превращается в a00, а a означало бы 000a."],
    ["0200 → 2", "The trailing zeros stay: 0200 becomes 200.", "Замыкающие нули остаются: 0200 превращается в 200."],
    ["abc0 → abc", "abc0 has no leading zero; dropping its trailing 0 would change the value to 0abc.", "У abc0 нет ведущего нуля; если убрать замыкающий 0, значение станет 0abc."],
  ], "01ab loses only its leading zero and becomes 1ab; the value is unchanged.", "У 01ab убирается только ведущий ноль, получается 1ab; значение не меняется."),

  qx("Under Rule 2, what can a double colon (::) replace?", "One contiguous run of all-zero hextets", [
    ["Any run of zero digits, even inside a hextet", ":: works on whole 16-bit hextets of zeros, not on single digits inside a hextet.", ":: заменяет целые 16-битные нулевые хекстеты, а не отдельные цифры внутри хекстета."],
    ["Every all-zero hextet, wherever it appears", "Only one contiguous run can be replaced; other zero hextets stay as 0.", "Заменить можно только одну непрерывную цепочку; остальные нулевые хекстеты остаются как 0."],
    ["Any hextet whose value is lower than 00ff", "Only hextets that are entirely zero can be replaced.", "Заменять можно только хекстеты, состоящие целиком из нулей."],
  ], "A double colon can replace any single, contiguous string of one or more 16-bit hextets consisting of all zeros.", "Двойное двоеточие может заменить одну непрерывную цепочку из одного или нескольких 16-битных хекстетов, состоящих только из нулей."),

  qx("Compress fe80:0000:0000:0000:0123:4567:89ab:cdef as far as possible.", "fe80::123:4567:89ab:cdef", [
    ["fe80::0123:4567:89ab:cdef", "Valid, but not fully compressed: the leading zero of 0123 can still go.", "Адрес допустимый, но сжат не до конца: ведущий ноль в 0123 ещё можно убрать."],
    ["fe8::123:4567:89ab:cdef", "fe80 has no leading zero; dropping its trailing 0 changes it to 0fe8.", "У fe80 нет ведущего нуля; если убрать замыкающий 0, получится 0fe8."],
    ["fe80:0:0:0:123:4567:89ab:cdef", "Rule 2 was not applied: the three zero hextets should become ::.", "Правило 2 не применено: три нулевых хекстета надо заменить на ::."],
  ], "Rule 1 gives fe80:0:0:0:123:4567:89ab:cdef; Rule 2 turns the three zero hextets into ::.", "Правило 1 даёт fe80:0:0:0:123:4567:89ab:cdef; правило 2 превращает три нулевых хекстета в ::."),

  qx("What is the shortest valid form of 2001:0db8:0000:0001:0000:0000:0000:0001?", "2001:db8:0:1::1", [
    ["2001:db8::1:0:0:0:1", "Valid, but :: replaced the run of one zero hextet; compressing the run of three is shorter.", "Адрес допустимый, но :: заменил цепочку из одного нулевого хекстета; сжать цепочку из трёх — короче."],
    ["2001:db8::1::1", "Two double colons make the address ambiguous, so it is invalid.", "Два двойных двоеточия делают адрес неоднозначным, поэтому он недопустим."],
    ["2001:db8:1::1", "The zero hextet after db8 is lost: this expands to 2001:0db8:0001:0000:0000:0000:0000:0001.", "Потерян нулевой хекстет после db8: адрес развернётся в 2001:0db8:0001:0000:0000:0000:0000:0001."],
  ], "Rule 1 gives 2001:db8:0:1:0:0:0:1; the longest run of zeros (three hextets) becomes ::, and the single 0 stays.", "Правило 1 даёт 2001:db8:0:1:0:0:0:1; самая длинная цепочка нулей (три хекстета) становится ::, а одиночный 0 остаётся."),

  qx("2001:0db8:0000:0000:1111:0000:0000:0200 has two equal runs of zeros. Which compressed form follows the recommended convention?", "2001:db8::1111:0:0:200", [
    ["2001:db8:0:0:1111::200", "Valid, but with equal runs the convention (RFC 5952) compresses the first one.", "Адрес допустимый, но при равных цепочках по соглашению (RFC 5952) сжимают первую."],
    ["2001:db8::1111::200", "Two double colons are not allowed, even when the runs are equal.", "Два двойных двоеточия недопустимы, даже если цепочки равны."],
    ["2001:db8::1111:0:0:2", "0200 loses its trailing zeros here; it must be written 200.", "Здесь у 0200 потеряны замыкающие нули; правильно — 200."],
  ], "Both runs are two hextets long, so :: replaces the first one and the second stays as 0:0.", "Обе цепочки по два хекстета, поэтому :: заменяет первую, а вторая остаётся как 0:0."),

  qx("What is the preferred format of fe80::a:1b?", "fe80:0000:0000:0000:0000:0000:000a:001b", [
    ["fe80:0000:0000:0000:0000:0000:a000:1b00", "The hextets were padded on the right; zeros are always added on the left (000a, 001b).", "Хекстеты дополнены справа; нули всегда добавляют слева (000a, 001b)."],
    ["fe80:0000:0000:0000:0000:000a:001b", "Only seven hextets: three are written, so :: stands for five zero hextets, not four.", "Всего семь хекстетов: записано три, значит, :: заменяет пять нулевых хекстетов, а не четыре."],
    ["fe80:000a:001b:0000:0000:0000:0000:0000", "The zeros were put at the end; :: sits between fe80 and a, so the zeros go there.", "Нули поставлены в конец; :: стоит между fe80 и a, значит, нули идут туда."],
  ], "Three hextets are written (fe80, a, 1b), so :: = 8 − 3 = 5 hextets of 0000; then each hextet is padded to four digits.", "Записано три хекстета (fe80, a, 1b), значит, :: = 8 − 3 = 5 хекстетов 0000; затем каждый хекстет дополняется до четырёх цифр."),

  qx("How many all-zero hextets does :: replace in 2001:db8:0:a3:abcd::1234?", "Two", [
    ["One", "One would need seven written hextets; here six are written.", "Один нужен был бы при семи записанных хекстетах, а здесь записано шесть."],
    ["Three", "Three zero hextets would mean only five written hextets.", "Три нулевых хекстета означали бы, что записано только пять."],
    ["Four", "Four would leave just four written hextets; count 2001, db8, 0, a3, abcd and 1234.", "Четыре оставило бы лишь четыре записанных хекстета; посчитай 2001, db8, 0, a3, abcd и 1234."],
  ], "Six hextets are written (2001, db8, 0, a3, abcd, 1234 — the single 0 counts too), so :: stands for 8 − 6 = 2 hextets: 2001:0db8:0000:00a3:abcd:0000:0000:1234.", "Записано шесть хекстетов (2001, db8, 0, a3, abcd, 1234 — одиночный 0 тоже считается), значит, :: заменяет 8 − 6 = 2 хекстета: 2001:0db8:0000:00a3:abcd:0000:0000:1234."),

  tfx("A double colon may replace a single all-zero hextet, as long as no other :: appears in the address.", true,
    "True. Rule 2 says :: replaces a contiguous string of one or more all-zero hextets, used only once in the address.",
    "Верно. По правилу 2 :: заменяет непрерывную цепочку из одного или нескольких нулевых хекстетов и используется в адресе только один раз.",
    "Answering False assumes :: needs at least two zero hextets; the rule says one or more.",
    "Ответ «неверно» предполагает, что :: нужно минимум два нулевых хекстета; а правило говорит — один или больше."),

  qx("Why is 2001::abcd::1 not a valid IPv6 address?", "Its six zero hextets could be split between the gaps in several ways", [
    ["abcd is not a valid hexadecimal hextet", "a, b, c and d are all hex digits, so abcd is a valid hextet.", "a, b, c и d — шестнадцатеричные цифры, так что abcd — допустимый хекстет."],
    ["An address may not end with the hextet 1", "Many addresses end with 1, for example ::1 or 2001:db8:cafe:1::1.", "Многие адреса оканчиваются на 1, например ::1 или 2001:db8:cafe:1::1."],
    ["A double colon may not follow the first hextet", ":: may stand anywhere, for example 2001::1 or fe80::1.", ":: может стоять где угодно, например 2001::1 или fe80::1."],
  ], "With two :: the six missing hextets could be 1 + 5, 2 + 4, 3 + 3… Each split is a different address, so :: may be used only once.", "При двух :: шесть недостающих хекстетов можно поделить как 1 + 5, 2 + 4, 3 + 3… Каждое деление — другой адрес, поэтому :: допускается только один раз."),

  qx("What is the fully compressed form of ff02:0000:0000:0000:0000:0000:0000:0001?", "ff02::1", [
    ["ff2::1", "ff02 has a zero in the middle, not a leading zero; it cannot be shortened.", "Ноль в ff02 стоит в середине, а не в начале; этот хекстет не сокращается."],
    ["ff02:1", "Without :: only two hextets are written; the six zero hextets need ::.", "Без :: записано всего два хекстета; шесть нулевых хекстетов надо заменить на ::."],
    ["ff02::0001", "Valid, but not fully compressed: 0001 should lose its leading zeros.", "Адрес допустимый, но сжат не до конца: у 0001 надо убрать ведущие нули."],
  ], "Rule 1 turns 0001 into 1, and Rule 2 replaces the six zero hextets with :: — ff02::1.", "Правило 1 превращает 0001 в 1, а правило 2 заменяет шесть нулевых хекстетов на :: — получается ff02::1."),

  qx("Which string cannot be an IPv6 address?", "2001:db8:cafe:g::1", [
    ["2001:DB8:CAFE:A::1", "Uppercase is fine: IPv6 addresses are not case-sensitive.", "Заглавные буквы допустимы: адреса IPv6 не чувствительны к регистру."],
    ["2001:db8:cafe:a::1", "This is a valid compressed address with one :: and hex digits only.", "Это допустимый сжатый адрес с одним :: и только шестнадцатеричными цифрами."],
    ["2001:db8:cafe:a:0:0:0:1", "This is the same address with Rule 1 only; all eight hextets are present.", "Это тот же адрес только с правилом 1; все восемь хекстетов на месте."],
  ], "IPv6 is written in hexadecimal, and hex digits run from 0 to f; g is not a hex digit.", "IPv6 записывают в шестнадцатеричной системе, а её цифры — от 0 до f; g к ним не относится."),

  qx("What range of values can one hextet hold?", "0000 to ffff", [
    ["0 to 255", "0–255 is the range of one 8-bit IPv4 octet.", "0–255 — диапазон одного 8-битного октета IPv4."],
    ["0000 to 9999", "Hextets are hexadecimal, so after 9 come a–f; ffff is the maximum.", "Хекстеты шестнадцатеричные: после 9 идут a–f, а максимум — ffff."],
    ["00 to ff", "00–ff is one byte (8 bits); a hextet is 16 bits.", "00–ff — это один байт (8 бит), а хекстет — 16 бит."],
  ], "A hextet is 16 bits written as four hex digits, so each x runs from 0000 to ffff.", "Хекстет — 16 бит в виде четырёх шестнадцатеричных цифр, поэтому каждый x принимает значения от 0000 до ffff."),

  tfx("An address with the leading zeros removed, such as 2001:db8:0:1111:0:0:0:200, is still in the preferred format.", false,
    "False. Preferred means the full form: exactly 8 hextets of exactly 4 hex digits each. Removing leading zeros already gives a compressed form.",
    "Неверно. Preferred — это полная форма: ровно 8 хекстетов по ровно 4 цифры. Если убрать ведущие нули, это уже сжатая форма.",
    "Answering True checks only the eight hextets and forgets the four digits in each: the slide calls this form No leading zeros, not Preferred.",
    "Ответ «верно» проверяет только восемь хекстетов и забывает о четырёх цифрах в каждом: на слайде эта форма называется No leading zeros, а не Preferred."),

  qx("For 2001:db8:acad:1::10, how many hextets are written and how many does :: stand for?", "5 written, :: = 3", [
    ["4 written, :: = 4", "2001, db8, acad, 1 and 10 are five hextets, not four.", "2001, db8, acad, 1 и 10 — это пять хекстетов, а не четыре."],
    ["5 written, :: = 2", "5 + 2 = 7; an address always has 8 hextets.", "5 + 2 = 7, а в адресе всегда 8 хекстетов."],
    ["6 written, :: = 2", "The :: itself is not a hextet; only five values are written.", "Само :: хекстетом не считается; записано только пять значений."],
  ], "Five hextets are written, so :: = 8 − 5 = 3 × 0000: 2001:0db8:acad:0001:0000:0000:0000:0010.", "Записано пять хекстетов, значит, :: = 8 − 5 = 3 × 0000: 2001:0db8:acad:0001:0000:0000:0000:0010."),
];
