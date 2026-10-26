import { qx, tfx, type Draft } from "../../types";

export const deepL7P2: Draft[] = [
  qx("What does an IPv6 unicast address identify?", "One interface on an IPv6-enabled device", [
    ["A group of devices that all receive the packet", "Delivery to a whole group is multicast.", "Доставка целой группе — это multicast."],
    ["The nearest of several devices sharing it", "Delivery to the nearest device is anycast.", "Доставка ближайшему устройству — это anycast."],
    ["Every IPv6 device on the local link", "Reaching every device on the link is the job of the all-nodes multicast ff02::1.", "До всех устройств в канале достаёт multicast всех узлов ff02::1."],
  ], "Unicast uniquely identifies an interface on an IPv6-enabled device: one-to-one communication.", "Unicast однозначно обозначает интерфейс устройства с IPv6: связь «один к одному»."),

  qx("Which IPv6 address category sends a single packet to multiple destinations?", "Multicast", [
    ["Anycast", "Anycast also involves several devices, but only the nearest one gets the packet.", "В anycast тоже несколько устройств, но пакет получает только ближайшее."],
    ["Unicast", "Unicast identifies a single interface.", "Unicast обозначает один интерфейс."],
    ["Broadcast", "IPv6 has no broadcast address at all.", "Broadcast-адреса в IPv6 нет вообще."],
  ], "Multicast is used to send a single IPv6 packet to multiple destinations — one-to-many.", "Multicast служит для отправки одного пакета IPv6 нескольким получателям — «один ко многим»."),

  qx("How can you tell an anycast address apart from a unicast address just by looking at it?", "You cannot: it uses the ordinary unicast format", [
    ["It always starts with ff, like other group addresses", "Addresses starting with ff are multicast; anycast has no prefix of its own.", "Адреса, начинающиеся с ff, — multicast; своего префикса у anycast нет."],
    ["It comes from the reserved block fc00::/7", "fc00::/7 is the unique local range, not an anycast range.", "fc00::/7 — диапазон unique local, а не anycast."],
    ["Its interface ID always ends in ::1", "Any unicast address can serve as anycast; the ending says nothing.", "Anycast-адресом может быть любой unicast-адрес; окончание ничего не говорит."],
  ], "Anycast is any IPv6 unicast address assigned to multiple devices; it becomes anycast only by being configured on several devices.", "Anycast — это любой unicast-адрес IPv6, назначенный нескольким устройствам; anycast он становится лишь потому, что настроен на нескольких устройствах."),

  qx("Which of the following is NOT a characteristic of an IPv6 anycast address?", "A one-to-many communication model", [
    ["A one-to-nearest communication model", "One-to-nearest is exactly the anycast model.", "«Один к ближайшему» — это и есть модель anycast."],
    ["The same address on multiple devices", "Anycast means one address shared by the devices in the group.", "Anycast — это один адрес, общий для устройств группы."],
    ["Delivery to the closest group interface", "Routing delivers the packet to the group interface closest to the sender.", "Маршрутизация доставляет пакет ближайшему к отправителю интерфейсу группы."],
  ], "One-to-many is multicast. Anycast is one-to-nearest: the same address on several devices, and the closest one gets the packet.", "«Один ко многим» — это multicast. Anycast — «один к ближайшему»: один адрес на нескольких устройствах, и пакет получает ближайшее."),

  qx("A DNS provider configures the same IPv6 address on servers in many cities, and each client reaches the closest one. Which address type is this?", "Anycast", [
    ["Multicast", "Multicast would deliver each query to every server in the group, not just the closest.", "Multicast доставил бы каждый запрос всем серверам группы, а не только ближайшему."],
    ["Link-local unicast", "Link-local addresses never leave their link, so they cannot serve clients in other cities.", "Link-local адреса не выходят за пределы канала и не могут обслуживать клиентов в других городах."],
    ["Unique local unicast", "Unique local addresses are not globally routed, so internet clients cannot reach them.", "Unique local адреса глобально не маршрутизируются, и клиенты из интернета до них не достанут."],
  ], "One unicast address on many devices with delivery to the nearest is anycast, the one-to-nearest model.", "Один unicast-адрес на многих устройствах с доставкой ближайшему — это anycast, модель «один к ближайшему»."),

  qx("Which pair lists only real IPv6 address categories?", "Multicast and anycast", [
    ["Broadcast and multicast", "Broadcast does not exist in IPv6.", "Broadcast в IPv6 не существует."],
    ["Allcast and anycast", "Allcast is an invented word from the slide question.", "Allcast — выдуманное слово из вопроса на слайде."],
    ["Podcast and unicast", "Podcast is an invented distractor, not an address type.", "Podcast — выдуманная ловушка, а не тип адреса."],
  ], "The slide answer to “Which two are features of IPv6?” is multicast and anycast; broadcast, allcast and podcast are traps.", "Ответ на вопрос слайда «Which two are features of IPv6?» — multicast и anycast; broadcast, allcast и podcast — ловушки."),

  tfx("ff02::1 is the IPv6 broadcast address.", false,
    "False. IPv6 has no broadcast address. ff02::1 is the all-nodes multicast address, which essentially gives the same result.",
    "Неверно. В IPv6 нет broadcast-адреса. ff02::1 — multicast-адрес всех узлов, который по сути даёт тот же результат.",
    "Answering True confuses the effect with the address type: every device does receive ff02::1, but it is a multicast group.",
    "Ответ «верно» путает результат с типом адреса: ff02::1 действительно получают все устройства, но это multicast-группа."),

  qx("What does the IPv6 prefix length indicate?", "The network portion of the address", [
    ["The number of hosts allowed on the link", "The host count follows from the bits left over, but the prefix length itself marks the network part.", "Число хостов следует из оставшихся бит, а сама длина префикса отмечает сетевую часть."],
    ["The number of hextets written out", "How many hextets are written depends on compression, not on the prefix length.", "Сколько хекстетов записано, зависит от сжатия, а не от длины префикса."],
    ["The length of the interface ID", "The interface ID is what is left: 128 minus the prefix length.", "Идентификатор интерфейса — это остаток: 128 минус длина префикса."],
  ], "The prefix length, in slash notation, indicates the network portion of an IPv6 address.", "Длина префикса в записи через косую черту показывает сетевую часть адреса IPv6."),

  qx("What range can an IPv6 prefix length have?", "0 to 128", [
    ["0 to 32", "0–32 is the IPv4 range, because IPv4 addresses are 32 bits.", "0–32 — диапазон IPv4, ведь адреса IPv4 — 32 бита."],
    ["8 to 64", "Prefixes shorter than 8 (such as /3 or /7) and longer than 64 (such as /128) are used too.", "Используются и префиксы короче 8 (например, /3 или /7), и длиннее 64 (например, /128)."],
    ["1 to 64", "/128 is common, for example ::1/128 or the L routes in show ipv6 route.", "/128 встречается часто — например, ::1/128 или маршруты L в show ipv6 route."],
  ], "The IPv6 prefix length can range from 0 to 128.", "Длина префикса IPv6 может быть от 0 до 128."),

  qx("Which prefix length is recommended for LANs and most other types of networks?", "/64", [
    ["/48", "/48 is a typical global routing prefix for a whole site, not one LAN.", "/48 — типичный глобальный префикс маршрутизации для всей площадки, а не для одной LAN."],
    ["/128", "/128 identifies a single address, such as the loopback ::1/128.", "/128 обозначает один адрес, например loopback ::1/128."],
    ["/24", "/24 is a familiar IPv4 LAN size, not the IPv6 recommendation.", "/24 — привычный размер LAN в IPv4, а не рекомендация для IPv6."],
  ], "The recommended IPv6 prefix length for LANs and most other networks is /64: a 64-bit prefix and a 64-bit interface ID.", "Рекомендуемая длина префикса IPv6 для LAN и большинства сетей — /64: 64 бита префикса и 64 бита идентификатора интерфейса."),

  qx("For 2001:db8:a::/64, what is the 64-bit prefix written out in full?", "2001:0db8:000a:0000", [
    ["2001:0db8:a000:0000", "a was padded on the right; padding is always on the left (000a).", "a дополнено справа, а дополнять нужно всегда слева (000a)."],
    ["2001:0db8:0000:000a", "a is the third hextet; :: comes after it, so the fourth hextet is 0000.", "a — третий хекстет; :: идёт после него, поэтому четвёртый хекстет — 0000."],
    ["0000:0000:0000:000a", "The first two hextets 2001 and db8 cannot disappear.", "Первые два хекстета 2001 и db8 никуда не исчезают."],
  ], "2001:db8:a:: expands to 2001:0db8:000a:0000:0000:0000:0000:0000; the first four hextets are the /64 prefix.", "2001:db8:a:: разворачивается в 2001:0db8:000a:0000:0000:0000:0000:0000; первые четыре хекстета — префикс /64."),

  qx("How does IPv6 show where the network part of an address ends?", "Only with the prefix length after the slash", [
    ["With a dotted-decimal subnet mask, as in IPv4", "IPv6 has no dotted-decimal subnet mask.", "У IPv6 нет маски подсети в десятичной записи с точками."],
    ["With the position of the double colon", ":: only compresses zeros; it can appear in any part of the address.", ":: лишь сжимает нули и может стоять в любой части адреса."],
    ["With the first hextet that starts with a letter", "Letters are ordinary hex digits and say nothing about the prefix.", "Буквы — обычные шестнадцатеричные цифры, о префиксе они ничего не говорят."],
  ], "IPv6 uses no subnet mask: the prefix length in slash notation alone marks the network portion.", "IPv6 не использует маску: сетевую часть отмечает только длина префикса через косую черту."),

  qx("Unlike an IPv4 device, how many unicast addresses does an IPv6 device typically have on an interface?", "Two: a GUA and an LLA", [
    ["One: a GUA only", "Every IPv6 interface must also have a link-local address.", "У каждого интерфейса IPv6 обязательно есть ещё и link-local адрес."],
    ["Two: a GUA and a unique local address", "A ULA is optional; the address every interface must have is the LLA.", "ULA необязателен; обязательный адрес каждого интерфейса — LLA."],
    ["Three: a GUA, an LLA and a broadcast address", "IPv6 has no broadcast address.", "Broadcast-адреса в IPv6 нет."],
  ], "IPv6 devices typically have two unicast addresses: a global unicast address (GUA) and a link-local address (LLA).", "У устройств IPv6 обычно два unicast-адреса: глобальный (GUA) и link-local (LLA)."),

  qx("Which IPv4 address type is an IPv6 global unicast address most similar to?", "A public IPv4 address", [
    ["A private RFC 1918 address", "Private addresses resemble IPv6 unique local addresses, not GUAs.", "Частные адреса похожи на unique local адреса IPv6, а не на GUA."],
    ["The loopback address 127.0.0.1", "127.0.0.1 corresponds to the IPv6 loopback ::1.", "127.0.0.1 соответствует loopback IPv6 ::1."],
    ["The broadcast address 255.255.255.255", "IPv6 has no broadcast; the all-nodes multicast ff02::1 is the closest thing.", "В IPv6 нет broadcast; ближе всего к нему multicast всех узлов ff02::1."],
  ], "A GUA is similar to a public IPv4 address: globally unique and internet-routable.", "GUA похож на публичный адрес IPv4: глобально уникален и маршрутизируется в интернете."),

  qx("Which IPv6 address does the same job as 127.0.0.1 in IPv4?", "::1", [
    ["::", ":: is the unspecified address, all 128 bits zero.", ":: — неопределённый адрес, все 128 бит нулевые."],
    ["fe80::1", "fe80::1 is a link-local unicast address of an interface, often a router.", "fe80::1 — link-local unicast-адрес интерфейса, часто маршрутизатора."],
    ["ff02::1", "ff02::1 is the all-nodes multicast group, not the host itself.", "ff02::1 — multicast-группа всех узлов, а не сам хост."],
  ], "The loopback address ::1/128 lets a host send packets to itself, like 127.0.0.1 in IPv4.", "Loopback-адрес ::1/128 позволяет хосту отправлять пакеты самому себе, как 127.0.0.1 в IPv4."),

  qx("When is the unspecified address :: used?", "As a source before a device has an address of its own", [
    ["As the destination that reaches every node on the link", "Reaching every node is the all-nodes multicast ff02::1.", "До всех узлов достаёт multicast всех узлов ff02::1."],
    ["As the loopback address a host uses to test itself", "The loopback is ::1/128, not ::/128.", "Loopback — это ::1/128, а не ::/128."],
    ["As the router address in an RA", "The RA comes from the router's LLA, a real fe80 address.", "RA приходит с LLA маршрутизатора — настоящего адреса fe80."],
  ], "The unspecified address ::/128 (all zeros) is used as a source address before a device has an address of its own.", "Неопределённый адрес ::/128 (все нули) используется как адрес источника, пока у устройства нет своего адреса."),

  qx("What is ::ffff:192.168.10.1?", "An IPv4 address embedded in an IPv6 address", [
    ["An invalid address, because dots are not allowed", "The embedded IPv4 format is exactly where dotted decimal appears inside an IPv6 address.", "Формат embedded IPv4 — как раз тот случай, когда внутри адреса IPv6 встречается запись с точками."],
    ["The link-local address of a dual-stack router", "Link-local addresses start with fe80, not ::ffff.", "Link-local адреса начинаются с fe80, а не с ::ffff."],
    ["A unique local address for IPv4 hosts", "Unique local addresses start with fc or fd (fc00::/7).", "Unique local адреса начинаются с fc или fd (fc00::/7)."],
  ], "Embedded IPv4 addresses carry an IPv4 address inside an IPv6 address and are used during the transition.", "Адреса embedded IPv4 несут адрес IPv4 внутри адреса IPv6 и используются во время перехода."),

  qx("Which prefix contains IPv6 unique local addresses?", "fc00::/7", [
    ["fe80::/10", "fe80::/10 is link-local.", "fe80::/10 — это link-local."],
    ["ff00::/8", "ff00::/8 is multicast.", "ff00::/8 — это multicast."],
    ["2000::/3", "2000::/3 is the global unicast block.", "2000::/3 — блок глобальных unicast-адресов."],
  ], "Unique local addresses are in fc00::/7: the first hextet runs from fc00 to fdff.", "Unique local адреса лежат в fc00::/7: первый хекстет — от fc00 до fdff."),

  qx("Which of these is a unique local address?", "fd00::1", [
    ["fe80::fd00:1", "It starts with fe80, so it is link-local; fd inside the interface ID does not matter.", "Он начинается с fe80, значит, это link-local; fd внутри идентификатора интерфейса роли не играет."],
    ["ff02::fd00:1", "It starts with ff, so it is multicast.", "Он начинается с ff, значит, это multicast."],
    ["2001:db8:fd00::1", "It starts with 2001, inside 2000::/3, so it is a global unicast address.", "Он начинается с 2001, внутри 2000::/3, значит, это глобальный unicast-адрес."],
  ], "The type is decided by the first bits: fd00 is inside fc00::/7, the unique local range.", "Тип определяют первые биты: fd00 входит в fc00::/7 — диапазон unique local."),

  qx("For which devices does the lecture say unique local addresses can be used?", "Devices that will never need to access another network", [
    ["Web servers that must be reachable from the internet", "ULAs are not globally routed, so internet users could not reach such servers.", "ULA глобально не маршрутизируются, и пользователи интернета до таких серверов не достанут."],
    ["Hosts that NAT will translate to reach the internet", "ULAs are not translated to global addresses, unlike RFC 1918 with NAT.", "ULA не транслируются в глобальные адреса — в отличие от RFC 1918 с NAT."],
    ["Every interface, as their required address", "The address every interface must have is the LLA, not a ULA.", "Обязательный адрес каждого интерфейса — LLA, а не ULA."],
  ], "Unique local addresses can be used for devices that will never need to access another network.", "Unique local адреса можно использовать для устройств, которым никогда не понадобится выход в другую сеть."),

  qx("Which statement describes IPv6 unique local addresses?", "They are used within a site or a few sites", [
    ["They are globally routed on the IPv6 internet", "ULAs are not globally routed.", "ULA глобально не маршрутизируются."],
    ["They are translated to GUAs by the edge router", "ULAs are not translated to a global IPv6 address.", "ULA не транслируются в глобальные адреса IPv6."],
    ["They identify the local link and are never forwarded", "Link-only scope describes LLAs; ULAs can be routed between a limited number of sites.", "Действие только в канале — это LLA; ULA можно маршрутизировать между ограниченным числом площадок."],
  ], "Unique local addresses are used for local addressing within a site or between a limited number of sites.", "Unique local адреса используют для локальной адресации внутри площадки или между ограниченным числом площадок."),

  qx("Which first three bits do the global unicast addresses being assigned today have?", "001", [
    ["000", "000 covers addresses such as ::1 and ::, not GUAs.", "000 — это адреса вроде ::1 и ::, а не GUA."],
    ["111", "111 leads to the fc, fe and ff ranges: unique local, link-local and multicast.", "111 ведёт к диапазонам fc, fe и ff: unique local, link-local и multicast."],
    ["010", "010 would be 4000::/3, which is not assigned as GUA space today.", "010 — это 4000::/3, сейчас это пространство как GUA не выдаётся."],
  ], "Currently only GUAs with the first three bits 001, that is 2000::/3, are being assigned.", "Сейчас выдаются только GUA с первыми тремя битами 001, то есть 2000::/3."),

  qx("What fraction of the whole IPv6 address space does 2000::/3 cover?", "1/8", [
    ["1/2", "1/2 would be one fixed bit; 2000::/3 fixes three.", "1/2 — это один фиксированный бит, а в 2000::/3 их три."],
    ["1/3", "A /3 does not mean one third: each fixed bit halves the space.", "/3 не означает треть: каждый фиксированный бит делит пространство пополам."],
    ["1/16", "1/16 would be four fixed bits, a /4.", "1/16 — это четыре фиксированных бита, /4."],
  ], "Three fixed bits: 1/2 × 1/2 × 1/2 = 1/8 of the total IPv6 address space.", "Три фиксированных бита: 1/2 × 1/2 × 1/2 = 1/8 всего пространства IPv6."),

  qx("Which of these is NOT a global unicast address?", "4001:db8::1", [
    ["2001:db8::1", "2001 begins with the bits 0010, inside 2000::/3.", "2001 начинается с битов 0010 — это внутри 2000::/3."],
    ["3fff:1::1", "3fff is the last first-hextet value in 2000::/3.", "3fff — последнее значение первого хекстета в 2000::/3."],
    ["2a02:6b8::1", "2a02 begins with 0010, so it is a GUA.", "2a02 начинается с 0010, значит, это GUA."],
  ], "GUAs begin with 2 or 3 (2000 – 3fff). 4001 begins with the bits 0100, outside 2000::/3.", "GUA начинаются с 2 или 3 (2000 – 3fff). 4001 начинается с битов 0100 — вне 2000::/3."),

  qx("Which first-hextet range does 2000::/3 cover?", "2000 – 3fff", [
    ["2000 – 2fff", "That is only 0010; 2000::/3 also includes 0011 (3000 – 3fff).", "Это только 0010; в 2000::/3 входит и 0011 (3000 – 3fff)."],
    ["2000 – 3999", "The hextet is hexadecimal; after 3999 come 399a … 3fff.", "Хекстет шестнадцатеричный: после 3999 идут 399a … 3fff."],
    ["0000 – 3fff", "0000 – 1fff start with 000, not 001.", "0000 – 1fff начинаются с 000, а не с 001."],
  ], "With 001 fixed, the first hextet runs from 0010 0000 0000 0000 (2000) to 0011 1111 1111 1111 (3fff).", "При фиксированных 001 первый хекстет идёт от 0010 0000 0000 0000 (2000) до 0011 1111 1111 1111 (3fff)."),

  qx("In a GUA, who assigns the global routing prefix?", "The provider, such as an ISP", [
    ["The organization's network administrator", "The organization chooses the subnet ID, not the routing prefix.", "Организация выбирает subnet ID, а не префикс маршрутизации."],
    ["The host itself, with the EUI-64 process", "EUI-64 builds the interface ID, the last 64 bits.", "EUI-64 строит идентификатор интерфейса — последние 64 бита."],
    ["The IEEE, based on the MAC address", "The IEEE manages MAC addresses; it does not assign IPv6 prefixes.", "IEEE управляет MAC-адресами, а префиксы IPv6 не назначает."],
  ], "The global routing prefix is the network portion assigned by the provider, such as an ISP, to a customer or site; it varies with ISP policies.", "Глобальный префикс маршрутизации — сетевая часть, которую провайдер (ISP) выдаёт клиенту или площадке; он зависит от политики провайдера."),

  qx("Which part of a GUA is equivalent to the host portion of an IPv4 address?", "The interface ID", [
    ["The subnet ID", "The subnet ID numbers the subnets inside a site.", "Subnet ID нумерует подсети внутри площадки."],
    ["The global routing prefix", "The routing prefix is the network part from the ISP.", "Префикс маршрутизации — сетевая часть от провайдера."],
    ["The prefix length", "The prefix length is a number after the slash, not a part of the address.", "Длина префикса — число после косой черты, а не часть адреса."],
  ], "The IPv6 interface ID is equivalent to the host portion of an IPv4 address; /64 subnets give a 64-bit interface ID.", "Идентификатор интерфейса IPv6 соответствует хостовой части адреса IPv4; подсети /64 дают 64-битный идентификатор."),

  qx("With a /48 global routing prefix and /64 subnets, what are the sizes of the three GUA parts, in order?", "48 + 16 + 64 bits", [
    ["48 + 64 + 16 bits", "The interface ID comes last and is 64 bits; the subnet ID in the middle is 16.", "Идентификатор интерфейса идёт последним и занимает 64 бита; subnet ID посередине — 16."],
    ["32 + 32 + 64 bits", "A /32 routing prefix would leave 32 subnet bits, but the site here is a /48.", "Префикс /32 оставил бы 32 бита на подсети, но здесь площадка /48."],
    ["64 + 16 + 48 bits", "The order is reversed: the routing prefix is 48 bits and the interface ID 64.", "Порядок перевёрнут: префикс маршрутизации — 48 бит, а идентификатор интерфейса — 64."],
  ], "Global routing prefix 48 bits + subnet ID 16 bits + interface ID 64 bits = 128 bits; /48 + 16 = /64.", "Префикс маршрутизации 48 бит + subnet ID 16 бит + идентификатор интерфейса 64 бита = 128 бит; /48 + 16 = /64."),

  qx("The address 2001:db8:cafe:2c::1b/64 comes from the site prefix 2001:db8:cafe::/48. What is its interface ID?", "::1b", [
    ["2c", "2c is the fourth hextet, the subnet ID.", "2c — четвёртый хекстет, это subnet ID."],
    ["2001:db8:cafe", "2001:db8:cafe is the /48 global routing prefix.", "2001:db8:cafe — глобальный префикс маршрутизации /48."],
    ["cafe:2c", "cafe belongs to the routing prefix and 2c to the subnet ID; neither is the interface ID.", "cafe относится к префиксу маршрутизации, 2c — к subnet ID; ни то ни другое не идентификатор интерфейса."],
  ], "The last 64 bits, 0000:0000:0000:001b (written ::1b), are the interface ID.", "Последние 64 бита — 0000:0000:0000:001b (запись ::1b) — это идентификатор интерфейса."),

  qx("A host has 2001:db8:aaaa:bbbb:cccc:dddd:eeee:ffff/64, and its site prefix is a /48. What is the global routing prefix?", "2001:db8:aaaa::/48", [
    ["2001:db8:aaaa:bbbb::/64", "This is the /64 subnet prefix: it already includes the subnet ID bbbb.", "Это префикс подсети /64: в него уже входит subnet ID bbbb."],
    ["2001:db8::/32", "A /32 stops after db8; the site's prefix is 48 bits long.", "/32 заканчивается после db8, а префикс площадки — 48 бит."],
    ["cccc:dddd:eeee:ffff", "These last four hextets are the interface ID.", "Последние четыре хекстета — идентификатор интерфейса."],
  ], "The first 48 bits — 2001:db8:aaaa — are the global routing prefix; bbbb is the subnet ID; the rest is the interface ID.", "Первые 48 бит — 2001:db8:aaaa — глобальный префикс маршрутизации; bbbb — subnet ID; остальное — идентификатор интерфейса."),

  qx("An interface has a GUA configured, but nobody configured a link-local address on it. What happens?", "The device creates an LLA automatically", [
    ["The interface works with the GUA only", "Every IPv6-enabled interface must have an LLA, so one is created.", "У каждого интерфейса с IPv6 обязан быть LLA, поэтому он создаётся."],
    ["IPv6 stays disabled until an LLA is typed in", "Manual configuration is optional; the device makes its own LLA.", "Ручная настройка необязательна; устройство само создаёт LLA."],
    ["The GUA is also used as the link-local address", "LLAs are always in fe80::/10; a GUA cannot play that role.", "LLA всегда лежат в fe80::/10; GUA эту роль играть не может."],
  ], "If an LLA is not configured manually on an interface, the device will automatically create one.", "Если LLA не настроен на интерфейсе вручную, устройство создаст его автоматически."),

  qx("PC1 sends a packet to fe80::2, which belongs to a host on a different subnet behind the router. What does the router do with it?", "It does not forward it to the other subnet", [
    ["It forwards it like any other unicast packet", "Packets with a link-local destination cannot be routed.", "Пакеты с link-local адресом назначения не маршрутизируются."],
    ["It rewrites fe80::2 into the host's GUA", "Routers do not translate link-local addresses into global ones.", "Маршрутизаторы не переводят link-local адреса в глобальные."],
    ["It floods it to every subnet it is connected to", "IPv6 routers do not flood packets; the link-local scope ends at the link.", "Маршрутизаторы IPv6 не рассылают пакеты во все стороны; область link-local заканчивается на канале."],
  ], "An LLA works only on its own link; packets with a source or destination LLA cannot be routed.", "LLA работает только в своём канале; пакеты с link-local адресом источника или назначения не маршрутизируются."),

  qx("According to the slide figure, what do routers use the link-local addresses of neighbor routers for?", "To send routing updates", [
    ["To assign GUAs with stateful DHCPv6", "Address assignment is DHCPv6's job and has nothing to do with neighbor routers' LLAs.", "Выдача адресов — работа DHCPv6, к LLA соседних маршрутизаторов она отношения не имеет."],
    ["To reach web servers on the internet", "LLAs are not routable, so they cannot reach the internet.", "LLA не маршрутизируются и до интернета не достают."],
    ["To build their own EUI-64 interface IDs", "EUI-64 uses the router's own MAC address, not a neighbor's LLA.", "EUI-64 использует собственный MAC маршрутизатора, а не LLA соседа."],
  ], "Routers use the LLA of neighbor routers to send routing updates, and hosts use the LLA of a local router as the default gateway.", "Маршрутизаторы используют LLA соседних маршрутизаторов для обмена обновлениями маршрутизации, а хосты — LLA местного маршрутизатора как шлюз по умолчанию."),

  qx("fe80::/10 fixes the first 10 bits. Which first hextet still falls inside this range?", "fe90", [
    ["fec0", "fec0 = 1111 1110 11..., so its 10th bit is 1 instead of 0.", "fec0 = 1111 1110 11..., его десятый бит — 1 вместо 0."],
    ["fe00", "fe00 = 1111 1110 00..., so its 9th bit is 0 instead of 1.", "fe00 = 1111 1110 00..., его девятый бит — 0 вместо 1."],
    ["ff80", "ff80 starts with ff, so it is multicast.", "ff80 начинается с ff, значит, это multicast."],
  ], "fe80::/10 = 1111 1110 10 followed by any bits, so the first hextet can be fe80 to febf; fe90 = 1111 1110 1001 fits. In practice LLAs use fe80.", "fe80::/10 = 1111 1110 10, а дальше любые биты, поэтому первый хекстет может быть от fe80 до febf; fe90 = 1111 1110 1001 подходит. На практике LLA начинаются с fe80."),

  qx("Which prefix do all IPv6 multicast addresses begin with?", "ff00::/8", [
    ["fe80::/10", "fe80::/10 is link-local unicast.", "fe80::/10 — link-local unicast."],
    ["fc00::/7", "fc00::/7 is unique local unicast.", "fc00::/7 — unique local unicast."],
    ["2000::/3", "2000::/3 is global unicast.", "2000::/3 — глобальный unicast."],
  ], "All IPv6 multicast addresses start with ff — the block ff00::/8.", "Все multicast-адреса IPv6 начинаются с ff — блок ff00::/8."),

  qx("Which devices listen to the multicast address ff02::2?", "All IPv6 routers on the link", [
    ["All IPv6 nodes on the link", "All nodes is ff02::1.", "Все узлы — это ff02::1."],
    ["Only DHCPv6 servers", "DHCPv6 servers are not the ff02::2 group; that group is the routers.", "DHCPv6-серверы не составляют группу ff02::2; эта группа — маршрутизаторы."],
    ["The nearest member of an anycast group", "ff02::2 is multicast, and every router on the link receives it.", "ff02::2 — multicast, и его получает каждый маршрутизатор в канале."],
  ], "ff02::2 is the all-routers multicast group; a Cisco router joins it after ipv6 unicast-routing, and hosts send RSs there.", "ff02::2 — multicast-группа всех маршрутизаторов; маршрутизатор Cisco вступает в неё после ipv6 unicast-routing, и хосты шлют туда RS."),

  qx("What is the solicited-node multicast address for 2001:db8:acad:1::1:abcd?", "ff02::1:ff01:abcd", [
    ["ff02::1:ff00:abcd", "Only the last 16 bits were taken; the solicited-node address uses the last 24 bits (01:abcd).", "Взяты только последние 16 бит, а solicited-node берёт последние 24 бита (01:abcd)."],
    ["ff02::2:ff01:abcd", "The prefix is ff02::1:ff, not ff02::2 (all routers).", "Префикс — ff02::1:ff, а не ff02::2 (все маршрутизаторы)."],
    ["ff02::1:abcd", "The ff part of ff02::1:ff is missing, and only 16 bits are copied.", "Пропущена часть ff из ff02::1:ff, и скопированы только 16 бит."],
  ], "The address ends with 0001:abcd, so the last 24 bits are 01:abcd; ff02::1:ff + 01:abcd = ff02::1:ff01:abcd.", "Адрес оканчивается на 0001:abcd, значит, последние 24 бита — 01:abcd; ff02::1:ff + 01:abcd = ff02::1:ff01:abcd."),

  qx("Why is a Neighbor Solicitation sent to a solicited-node multicast address and not to ff02::1?", "Only devices with matching last 24 bits process it", [
    ["Routers forward it to every subnet of the site", "Solicited-node groups are link-scope (ff02); they are not forwarded off the link.", "Группы solicited-node действуют в пределах канала (ff02); за его пределы их не пересылают."],
    ["It reaches every node, like an IPv4 broadcast", "That is what ff02::1 does; the solicited-node group avoids disturbing everyone.", "Так работает ff02::1; группа solicited-node как раз не беспокоит всех."],
    ["It carries the MAC address of every host", "The NS asks for one MAC address; it does not carry everybody's.", "NS спрашивает один MAC-адрес, а не несёт адреса всех."],
  ], "The solicited-node address is ff02::1:ff plus the last 24 bits of the unicast address, so only the device whose address ends that way processes the NS.", "Solicited-node адрес — это ff02::1:ff плюс последние 24 бита unicast-адреса, поэтому NS обрабатывает только устройство, адрес которого так оканчивается."),

  tfx("Every IPv6-enabled network interface must have a link-local address.", true,
    "True. Every IPv6-enabled interface must have an LLA; if none is configured manually, the device creates one automatically.",
    "Верно. У каждого интерфейса с IPv6 обязан быть LLA; если его не настроили вручную, устройство создаёт его само.",
    "Answering False treats the LLA as optional, like a ULA; the LLA is the one address an IPv6 interface cannot do without.",
    "Ответ «неверно» считает LLA необязательным, как ULA; а LLA — тот адрес, без которого интерфейс IPv6 не обходится."),
];
