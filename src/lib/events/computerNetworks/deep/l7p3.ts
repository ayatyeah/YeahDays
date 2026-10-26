import { qx, tfx, type Draft } from "../../types";

export const deepL7P3: Draft[] = [
  qx("How do most IPv6 configuration and verification commands in Cisco IOS differ from their IPv4 counterparts?", "In many cases ipv6 simply replaces ip", [
    ["They can be entered only in ROMMON mode", "IPv6 commands are entered in the normal IOS modes, just like IPv4 ones.", "Команды IPv6 вводят в обычных режимах IOS, как и команды IPv4."],
    ["They all need a dotted-decimal mask after the address", "IPv6 uses a /prefix-length, never a dotted-decimal mask.", "В IPv6 используется /prefix-length, а не маска с точками."],
    ["They work only after IPv4 is removed from the router", "IPv4 and IPv6 run side by side (dual stack); nothing has to be removed.", "IPv4 и IPv6 работают рядом (dual stack); ничего удалять не нужно."],
  ], "Most IPv6 commands are similar to their IPv4 counterparts; in many cases the only difference is ipv6 in place of ip.", "Большинство команд IPv6 похожи на команды IPv4; часто разница только в том, что вместо ip пишут ipv6."),

  qx("What does the IPv6 interface address command use in place of the IPv4 subnet mask?", "A /prefix-length after the address", [
    ["A wildcard mask after the address", "Wildcard masks are used in ACLs and OSPF, not for interface addresses.", "Wildcard-маски используются в ACL и OSPF, а не для адресов интерфейсов."],
    ["The keyword mask and a hexadecimal mask", "There is no mask keyword in the IPv6 address command.", "Ключевого слова mask в команде адреса IPv6 нет."],
    ["The link-local keyword", "link-local marks an LLA; it does not give the network size.", "link-local отмечает LLA и не задаёт размер сети."],
  ], "IPv4 needs an address and a subnet mask; IPv6 needs only the address with /prefix-length, as in ipv6 address 2001:db8:acad:1::1/64.", "IPv4 нужны адрес и маска подсети; IPv6 — только адрес с /prefix-length, как в ipv6 address 2001:db8:acad:1::1/64."),

  qx("Why do the slide examples finish the interface configuration with no shutdown?", "Router interfaces are shut down by default", [
    ["It saves the running configuration to NVRAM", "Saving is copy running-config startup-config, not no shutdown.", "Сохраняет конфигурацию copy running-config startup-config, а не no shutdown."],
    ["It turns on IPv6 routing for the whole router", "IPv6 forwarding is turned on with ipv6 unicast-routing in global configuration mode.", "Пересылка IPv6 включается командой ipv6 unicast-routing в режиме глобальной конфигурации."],
    ["It creates the interface's link-local address", "The LLA is created when IPv6 is configured on the interface, not by no shutdown.", "LLA создаётся, когда на интерфейсе настроен IPv6, а не командой no shutdown."],
  ], "Router interfaces are administratively down by default; no shutdown brings the interface up.", "Интерфейсы маршрутизатора по умолчанию выключены; no shutdown включает интерфейс."),

  qx("In which mode is ipv6 address 2001:db8:acad:1::1/64 entered?", "Interface configuration mode", [
    ["Global configuration mode", "Global mode is for router-wide commands such as ipv6 unicast-routing; the address belongs to one interface.", "Глобальный режим — для команд всего маршрутизатора, вроде ipv6 unicast-routing; адрес принадлежит одному интерфейсу."],
    ["Privileged EXEC mode", "Privileged EXEC (R1#) is for show and debug commands, not configuration.", "Привилегированный режим (R1#) — для команд show и debug, а не для настройки."],
    ["Line configuration mode (line vty 0 4)", "Line mode configures console and vty lines, not interface addresses.", "Режим line настраивает линии console и vty, а не адреса интерфейсов."],
  ], "The address is set after interface gigabitethernet 0/0/0, at the R1(config-if)# prompt.", "Адрес задают после interface gigabitethernet 0/0/0, в приглашении R1(config-if)#."),

  tfx("A Cisco router forwards IPv6 packets between its interfaces as soon as they have IPv6 addresses, with no other command.", false,
    "False. A Cisco router also needs ipv6 unicast-routing in global configuration mode before it forwards IPv6 packets.",
    "Неверно. Маршрутизатору Cisco ещё нужна команда ipv6 unicast-routing в режиме глобальной конфигурации, чтобы пересылать пакеты IPv6.",
    "Answering True assumes addresses alone are enough; the slide question about enabling forwarding has ipv6 unicast-routing as its answer.",
    "Ответ «верно» предполагает, что адресов достаточно; но на вопрос слайда о включении пересылки ответ — ipv6 unicast-routing."),

  qx("Besides enabling IPv6 forwarding, what else does ipv6 unicast-routing start on a Cisco router?", "Sending RAs and joining the group ff02::2", [
    ["Assigning a GUA to every interface automatically", "Each GUA is still configured per interface with ipv6 address.", "Каждый GUA по-прежнему настраивается на интерфейсе командой ipv6 address."],
    ["Turning off IPv4 routing", "IPv4 routing keeps working; the router becomes dual stack.", "Маршрутизация IPv4 продолжает работать; маршрутизатор становится dual stack."],
    ["Acting as a stateful DHCPv6 server", "A DHCPv6 server needs its own configuration; this command does not create one.", "Серверу DHCPv6 нужна отдельная настройка; эта команда его не создаёт."],
  ], "ipv6 unicast-routing makes the router forward IPv6 packets, send Router Advertisements and join the all-routers group ff02::2.", "ipv6 unicast-routing заставляет маршрутизатор пересылать пакеты IPv6, рассылать Router Advertisement и вступить в группу всех маршрутизаторов ff02::2."),

  qx("A technician types ipv6 host and ipv6 neighbor while looking for the command that enables IPv6 forwarding. What do these two commands really do?", "Map a name to an address; add a static neighbor", [
    ["Enable routing globally; enable RAs on one interface", "Neither command enables routing or RAs; that is ipv6 unicast-routing.", "Ни одна из них не включает маршрутизацию или RA; это делает ipv6 unicast-routing."],
    ["Set a static GUA; set a static LLA", "Static addresses are set with ipv6 address … and ipv6 address … link-local.", "Статические адреса задают командами ipv6 address … и ipv6 address … link-local."],
    ["Start a DHCPv6 server; start a DNS server", "Neither command starts a server.", "Ни одна из них не запускает сервер."],
  ], "ipv6 host maps a host name to an address, and ipv6 neighbor adds a static neighbor entry (like static ARP). Forwarding is ipv6 unicast-routing.", "ipv6 host сопоставляет имя узла с адресом, а ipv6 neighbor добавляет статическую запись о соседе (как статический ARP). Пересылку включает ipv6 unicast-routing."),

  qx("On the slide, which three values are entered when a Windows host gets a static IPv6 address?", "IPv6 address, prefix length 64, default gateway", [
    ["IPv6 address, subnet mask, broadcast address", "IPv6 has no subnet mask field and no broadcast address.", "В IPv6 нет поля маски подсети и нет broadcast-адреса."],
    ["MAC address, link-local address, DNS suffix", "The MAC is burned into the NIC, and the LLA is created automatically.", "MAC зашит в сетевую карту, а LLA создаётся автоматически."],
    ["GUA, unique local address and an anycast address", "The Windows dialog asks for one address, its prefix length and a gateway.", "Окно Windows спрашивает один адрес, длину префикса и шлюз."],
  ], "The slide fills in IPv6 address 2001:db8:acad:1::10, subnet prefix length 64 and default gateway 2001:db8:acad:1::1.", "На слайде заполнены IPv6 address 2001:db8:acad:1::10, subnet prefix length 64 и default gateway 2001:db8:acad:1::1."),

  qx("Which router address is the best practice for a host's default gateway?", "The router interface's LLA", [
    ["The router interface's GUA", "The GUA can be used, but the slide calls the LLA the best practice.", "GUA использовать можно, но на слайде лучшей практикой названа LLA."],
    ["The all-routers address ff02::2", "A multicast group cannot be a default gateway.", "Multicast-группа не может быть шлюзом по умолчанию."],
    ["The DNS server address from the RA", "A DNS server resolves names; it does not route packets.", "DNS-сервер разрешает имена и пакеты не маршрутизирует."],
  ], "The GUA or LLA of the router interface can be used as the default gateway; best practice is to use the LLA.", "Шлюзом по умолчанию может быть GUA или LLA интерфейса маршрутизатора; лучшая практика — LLA."),

  qx("Why does a host keep working with the router's LLA as its gateway even after the company changes its global prefix?", "The LLA does not change with the global prefix", [
    ["The LLA is routed across the internet", "LLAs are never routed; they stay on the link.", "LLA никогда не маршрутизируются и остаются в канале."],
    ["The LLA is the same on every router in the world", "LLAs only have to be unique on their own link.", "LLA должны быть уникальны только в своём канале."],
    ["A GUA can never be used as a gateway", "A GUA can be used; the LLA is just the better practice.", "GUA использовать можно; LLA просто лучшая практика."],
  ], "The LLA belongs to the link, not to the global prefix, so renumbering the GUAs does not change the gateway; it is also the address the router announces in its RAs.", "LLA принадлежит каналу, а не глобальному префиксу, поэтому смена GUA не меняет шлюз; кроме того, именно этот адрес маршрутизатор объявляет в RA."),

  qx("Why would an administrator configure a router's LLA manually?", "To make it recognizable and easier to remember", [
    ["Because routers cannot create LLAs by themselves", "Cisco routers create LLAs automatically with EUI-64.", "Маршрутизаторы Cisco создают LLA сами через EUI-64."],
    ["To make the link-local address routable", "No configuration makes an LLA routable.", "Никакая настройка не делает LLA маршрутизируемым."],
    ["To replace the GUA on the interface", "The LLA works alongside the GUA; it does not replace it.", "LLA работает вместе с GUA и не заменяет его."],
  ], "Configuring the LLA manually lets you create an address that is recognizable and easier to remember, such as fe80::1:1.", "Ручная настройка LLA позволяет создать узнаваемый и легко запоминаемый адрес, например fe80::1:1."),

  qx("Can R1 use the same link-local address on all three of its interfaces?", "Yes, if it is unique on each link", [
    ["No, LLAs must be unique across the whole network", "LLAs never leave their link, so uniqueness is needed only per link.", "LLA не покидают свой канал, поэтому уникальность нужна только в пределах канала."],
    ["No, only one interface may have an LLA", "Every IPv6 interface must have an LLA.", "LLA обязан быть у каждого интерфейса IPv6."],
    ["Yes, but only if each one has a /64 length", "LLAs are configured with the link-local keyword and no prefix length.", "LLA настраивают с ключевым словом link-local и без длины префикса."],
  ], "The same LLA can be configured on each link as long as it is unique on that link; common practice is still a different LLA per interface (fe80::1:1, fe80::2:1, fe80::3:1).", "Один и тот же LLA можно настроить в каждом канале, если в своём канале он уникален; но обычно на каждом интерфейсе делают свой LLA (fe80::1:1, fe80::2:1, fe80::3:1)."),

  qx("A host has just booted and wants to know how to get its IPv6 address. Which message does it send, and to which address?", "An RS to ff02::2", [
    ["An RA to ff02::1", "The RA is the router's answer and goes to the all-nodes group.", "RA — ответ маршрутизатора, и он идёт группе всех узлов."],
    ["An NS to ff02::1", "An NS is used for DAD and address resolution, not to find a router.", "NS служит для DAD и разрешения адресов, а не для поиска маршрутизатора."],
    ["A DHCPv6 Solicit to the gateway", "DHCPv6 is used only if the RA says so, and only after the RS and RA.", "DHCPv6 используют, только если так скажет RA, и только после RS и RA."],
  ], "The host sends a Router Solicitation to the all-routers group ff02::2: is there an IPv6 router on this link?", "Хост отправляет Router Solicitation группе всех маршрутизаторов ff02::2: есть ли в канале маршрутизатор IPv6?"),

  qx("When does an IPv6 router send Router Advertisements?", "Periodically, and also in reply to an RS", [
    ["Only when a host sends an RS", "Routers also send RAs on their own, periodically, to ff02::1.", "Маршрутизаторы шлют RA и сами, периодически, группе ff02::1."],
    ["Only once, when the interface comes up", "RAs are repeated periodically so that new hosts learn the prefix.", "RA повторяются периодически, чтобы новые хосты узнали префикс."],
    ["Only when a DHCPv6 server is configured on the link", "RAs are sent with or without DHCPv6; they also tell hosts whether to use it.", "RA рассылаются с DHCPv6 и без него; они же сообщают хостам, использовать ли его."],
  ], "The router answers each RS with an RA and also sends RAs periodically to the all-nodes group ff02::1.", "Маршрутизатор отвечает на каждый RS сообщением RA и, кроме того, периодически рассылает RA группе всех узлов ff02::1."),

  qx("Who makes the final decision about how a device obtains its IPv6 GUA?", "The device's operating system", [
    ["The router that sent the RA", "The RA is only a suggestion to the device.", "RA — лишь предложение устройству."],
    ["The stateful DHCPv6 server", "The server is used only if the device follows that method.", "Сервер используется, только если устройство выбирает этот метод."],
    ["The ISP that owns the global prefix", "The ISP assigns the routing prefix, not each host's method.", "Провайдер выдаёт префикс маршрутизации, а не метод для каждого хоста."],
  ], "The ICMPv6 RA message is a suggestion to a device on how to obtain an IPv6 GUA; the ultimate decision is up to the device operating system.", "Сообщение ICMPv6 RA — лишь предложение устройству, как получить GUA; окончательное решение принимает операционная система устройства."),

  qx("Which item does the slide NOT list among the contents of an RA?", "The MAC address of each host", [
    ["The network prefix and prefix length", "The prefix and prefix length tell the device which network it belongs to.", "Префикс и его длина сообщают устройству, к какой сети оно относится."],
    ["DNS addresses and a domain name", "The RA can carry DNS server addresses and a domain name.", "RA может нести адреса DNS-серверов и доменное имя."],
    ["A default gateway, its own LLA", "The default gateway is the router's LLA, the source of the RA.", "Шлюз по умолчанию — LLA маршрутизатора, источник RA."],
  ], "The RA includes the network prefix and prefix length, the default gateway address (the RA source LLA) and DNS addresses and a domain name. Hosts' MAC addresses are learned with NS and NA.", "RA содержит префикс и его длину, адрес шлюза (LLA — источник RA), адреса DNS и доменное имя. MAC-адреса хостов узнают через NS и NA."),

  qx("An RA says: “I have everything you need including the prefix, prefix length, and default gateway address.” Which method is this?", "Method 1: SLAAC", [
    ["Method 2: SLAAC with stateless DHCPv6", "Method 2 sends the host to a stateless DHCPv6 server for DNS and other information.", "Метод 2 отправляет хост к stateless DHCPv6-серверу за DNS и другими сведениями."],
    ["Method 3: stateful DHCPv6", "Method 3 gives only the gateway; the rest comes from a stateful server.", "Метод 3 даёт только шлюз; остальное приходит от stateful-сервера."],
    ["Static configuration", "Static configuration does not rely on an RA at all.", "Статическая настройка вообще не опирается на RA."],
  ], "Method 1, SLAAC: the RA has everything the host needs, and no DHCPv6 server is used.", "Метод 1, SLAAC: в RA есть всё, что нужно хосту, и DHCPv6-сервер не используется."),

  qx("An RA says: “I can give you your default gateway address. You need to ask a stateful DHCPv6 server for all your other information.” Which method is this?", "Method 3: stateful DHCPv6", [
    ["Method 1: SLAAC", "With SLAAC the RA already has the prefix, so no server is asked.", "При SLAAC префикс уже есть в RA, и ни к какому серверу не обращаются."],
    ["Method 2: SLAAC with stateless DHCPv6", "In Method 2 the host builds its own GUA and asks the stateless server only for DNS and the domain.", "В методе 2 хост сам строит GUA и спрашивает у stateless-сервера только DNS и домен."],
    ["Static configuration with EUI-64", "Static configuration involves no RA and no DHCPv6 server.", "Статическая настройка обходится без RA и без DHCPv6-сервера."],
  ], "Method 3, stateful DHCPv6 (no SLAAC): the RA gives only the default gateway, and a stateful DHCPv6 server provides the GUA, DNS and domain name.", "Метод 3, stateful DHCPv6 (без SLAAC): RA даёт только шлюз по умолчанию, а stateful DHCPv6-сервер выдаёт GUA, DNS и доменное имя."),

  qx("Under Method 2, SLAAC with a stateless DHCPv6 server, where do the DNS server addresses come from?", "A stateless DHCPv6 server", [
    ["The RA itself", "In Method 2 the RA tells the host to get DNS from a server.", "В методе 2 RA велит хосту взять DNS у сервера."],
    ["A stateful DHCPv6 server", "A stateful server is used in Method 3; in Method 2 it is stateless.", "Stateful-сервер используется в методе 3; в методе 2 он stateless."],
    ["The host's EUI-64 process", "EUI-64 builds an interface ID; it knows nothing about DNS.", "EUI-64 строит идентификатор интерфейса и ничего не знает о DNS."],
  ], "In Method 2 the host builds its GUA with SLAAC and gets other information, such as DNS addresses and a domain name, from a stateless DHCPv6 server.", "В методе 2 хост строит GUA через SLAAC, а другие сведения — адреса DNS и доменное имя — берёт у stateless DHCPv6-сервера."),

  qx("Under Method 3, how does a host get its GUA?", "From a stateful DHCPv6 server", [
    ["It builds it with SLAAC from the RA prefix", "Method 3 is stateful DHCPv6 with no SLAAC.", "Метод 3 — stateful DHCPv6 без SLAAC."],
    ["From a stateless DHCPv6 server", "A stateless server gives only other information, never the address.", "Stateless-сервер даёт только другие сведения, но не адрес."],
    ["From the RA, which lists a full address", "An RA never carries a complete address for a host.", "RA никогда не несёт готовый адрес для хоста."],
  ], "In Method 3 a device automatically receives a GUA, prefix length and DNS server addresses from a stateful DHCPv6 server.", "В методе 3 устройство автоматически получает GUA, длину префикса и адреса DNS-серверов от stateful DHCPv6-сервера."),

  qx("What is the difference between stateless and stateful DHCPv6?", "Stateful assigns and tracks addresses; stateless gives other info", [
    ["Stateless assigns and tracks addresses; stateful gives other info", "The roles are swapped: stateless means no record of addresses is kept.", "Роли перепутаны: stateless значит, что записи об адресах не ведутся."],
    ["Stateless is for IPv4 hosts; stateful is for IPv6 hosts", "Both are DHCPv6, so both serve IPv6 hosts.", "Оба — DHCPv6, значит, оба обслуживают хосты IPv6."],
    ["Stateful never gives DNS; stateless never gives a domain", "A stateful server gives the GUA and DNS; a stateless one gives DNS and a domain name.", "Stateful-сервер выдаёт GUA и DNS; stateless — DNS и доменное имя."],
  ], "Stateful DHCPv6 is like DHCP for IPv4: it assigns the GUA and keeps track of it. Stateless DHCPv6 only gives other information such as DNS and a domain name.", "Stateful DHCPv6 похож на DHCP для IPv4: выдаёт GUA и ведёт учёт. Stateless DHCPv6 даёт только другие сведения — DNS и доменное имя."),

  qx("In which of the three RA methods does the host take its default gateway from the RA?", "In all three methods", [
    ["Only in Method 1", "Methods 2 and 3 also use the RA source LLA as the gateway.", "Методы 2 и 3 тоже берут шлюзом LLA — источник RA."],
    ["In Methods 1 and 2 only", "Even in Method 3 the gateway comes from the RA, not from the server.", "Даже в методе 3 шлюз берут из RA, а не у сервера."],
    ["In none, since DHCPv6 supplies it", "DHCPv6 never supplies the default gateway.", "DHCPv6 никогда не выдаёт шлюз по умолчанию."],
  ], "In all three methods the default gateway is the router's LLA, the source address of the RA.", "Во всех трёх методах шлюз по умолчанию — LLA маршрутизатора, адрес источника RA."),

  qx("In Methods 2 and 3, in what order do the messages appear in the slide figures?", "RS, then RA, then DHCPv6 SOLICIT", [
    ["DHCPv6 SOLICIT, then RS, then RA", "The host learns from the RA that it should use DHCPv6, so the SOLICIT comes last.", "О том, что нужен DHCPv6, хост узнаёт из RA, поэтому SOLICIT идёт последним."],
    ["RA, then NS, then NA", "NS and NA are for DAD and address resolution, not part of this sequence.", "NS и NA нужны для DAD и разрешения адресов и в эту последовательность не входят."],
    ["RS, then DHCPv6 SOLICIT, then RA", "The RA must arrive before the host knows to ask a DHCPv6 server.", "RA должен прийти раньше, чем хост узнает, что надо спрашивать DHCPv6-сервер."],
  ], "1: the host sends an RS; 2: the router replies with an RA; 3: in Methods 2 and 3 the host sends a DHCPv6 SOLICIT to find the server.", "1 — хост отправляет RS; 2 — маршрутизатор отвечает RA; 3 — в методах 2 и 3 хост отправляет DHCPv6 SOLICIT, чтобы найти сервер."),

  qx("Which RA flag setting tells hosts to use SLAAC only (Method 1)?", "A=1, O=0, M=0", [
    ["A=1, O=1, M=0", "O=1 sends the host to a stateless DHCPv6 server too: that is Method 2.", "O=1 отправляет хост ещё и к stateless DHCPv6-серверу: это метод 2."],
    ["A=0, O=0, M=1", "M=1 means the address comes from a stateful DHCPv6 server: Method 3.", "M=1 значит, что адрес даёт stateful DHCPv6-сервер: метод 3."],
    ["A=0, O=1, M=1", "With A=0 the host does not build its own address, so it is not SLAAC.", "При A=0 хост не строит адрес сам, так что это не SLAAC."],
  ], "Method 1, SLAAC: A=1 (build a GUA yourself), O=0 and M=0 (no DHCPv6).", "Метод 1, SLAAC: A=1 (построй GUA сам), O=0 и M=0 (без DHCPv6)."),

  qx("What does the O (Other configuration) flag in an RA tell a host?", "Get other information, such as DNS, from stateless DHCPv6", [
    ["Build its own GUA with SLAAC", "Building the GUA with SLAAC is the A (Autonomous) flag.", "Строить GUA через SLAAC велит флаг A (Autonomous)."],
    ["Get its address from a stateful DHCPv6 server", "Getting the address from a stateful server is the M (Managed) flag.", "Получать адрес от stateful-сервера велит флаг M (Managed)."],
    ["Use another router as its default gateway", "No flag changes the gateway; it is always the RA source LLA.", "Никакой флаг шлюз не меняет: это всегда LLA — источник RA."],
  ], "O = Other configuration: get other information (DNS, domain name) from a stateless DHCPv6 server.", "O = Other configuration: взять другие сведения (DNS, доменное имя) у stateless DHCPv6-сервера."),

  qx("An RA arrives with the M flag set to 1. What should the host do?", "Get its address from a stateful DHCPv6 server", [
    ["Build its GUA with SLAAC and ask nobody", "That is Method 1 (A=1, O=0, M=0).", "Это метод 1 (A=1, O=0, M=0)."],
    ["Ask a stateless DHCPv6 server for DNS only", "That is the O flag of Method 2.", "Это флаг O метода 2."],
    ["Use a multicast address as its gateway", "The gateway is always the router's LLA, never a multicast group.", "Шлюз — всегда LLA маршрутизатора, а не multicast-группа."],
  ], "M = Managed address configuration: the address comes from a stateful DHCPv6 server (Method 3).", "M = Managed address configuration: адрес выдаёт stateful DHCPv6-сервер (метод 3)."),

  qx("In which RA methods must the client generate its own interface ID?", "Methods 1 and 2", [
    ["Methods 2 and 3", "In Method 3 the stateful server gives the whole address.", "В методе 3 stateful-сервер выдаёт весь адрес."],
    ["Method 3 only", "Method 3 is the one where the client does not build the address.", "Метод 3 — как раз тот, где клиент адрес не строит."],
    ["All three methods", "Method 3 has no SLAAC, so no interface ID is generated.", "В методе 3 нет SLAAC, поэтому идентификатор интерфейса не генерируется."],
  ], "When the RA says SLAAC or SLAAC with stateless DHCPv6, the client must generate its own interface ID with EUI-64 or a random 64-bit number.", "Когда RA говорит SLAAC или SLAAC со stateless DHCPv6, клиент должен сам сгенерировать идентификатор интерфейса — через EUI-64 или случайным 64-битным числом."),

  qx("With SLAAC, which two ways can a host use to create its interface ID?", "EUI-64 or a random 64-bit number", [
    ["Copying the router's ID or asking DHCPv6", "Hosts never copy the router's ID, and SLAAC works without DHCPv6.", "Хосты не копируют идентификатор маршрутизатора, а SLAAC обходится без DHCPv6."],
    ["A 16-bit counter or the host's IPv4 address", "The interface ID is 64 bits; neither a counter nor an IPv4 address is used.", "Идентификатор интерфейса — 64 бита; ни счётчик, ни адрес IPv4 не используются."],
    ["The RA prefix or the prefix length", "The prefix forms the first 64 bits; the interface ID is the other half.", "Префикс образует первые 64 бита; идентификатор интерфейса — вторая половина."],
  ], "The prefix comes from the RA, and the device uses either the EUI-64 process or random generation for the interface ID.", "Префикс приходит в RA, а идентификатор интерфейса устройство создаёт через EUI-64 или случайно."),

  qx("Who defined the Extended Unique Identifier (modified EUI-64) process?", "The IEEE", [
    ["The IETF", "The IETF created the IPv6 migration tools, but EUI-64 is an IEEE definition.", "IETF создала инструменты миграции на IPv6, но EUI-64 определила IEEE."],
    ["Cisco", "Cisco IOS uses EUI-64 by default but did not define it.", "Cisco IOS по умолчанию использует EUI-64, но не определяла его."],
    ["The RIRs", "The regional registries allocate address blocks only.", "Региональные регистраторы только распределяют блоки адресов."],
  ], "The IEEE defined the Extended Unique Identifier (EUI), or modified EUI-64, process.", "Процесс Extended Unique Identifier (EUI), или modified EUI-64, определила IEEE."),

  qx("In EUI-64, where is the value fffe inserted?", "Between the two 24-bit halves of the MAC", [
    ["Before the first byte of the MAC address", "fffe goes into the middle, after the first 24 bits, not in front of the MAC.", "fffe ставят в середину, после первых 24 бит, а не перед MAC."],
    ["After the last byte of the MAC address", "fffe goes into the middle, not at the end.", "fffe ставят в середину, а не в конец."],
    ["After the first 16 bits of the MAC address", "The split is after 24 bits (3 bytes), not 16.", "MAC делят после 24 бит (3 байт), а не после 16."],
  ], "A 16-bit value of fffe is inserted into the middle of the 48-bit MAC: 24 bits + fffe + 24 bits = 64 bits.", "16-битное значение fffe вставляется в середину 48-битного MAC: 24 бита + fffe + 24 бита = 64 бита."),

  qx("Which bit of the MAC address does EUI-64 reverse?", "The 7th bit of the first byte", [
    ["The 1st bit of the first byte", "The process reverses the 7th bit, not the first one.", "Процесс инвертирует седьмой бит, а не первый."],
    ["The 7th bit of the last byte", "The reversed bit is in the first byte of the MAC.", "Инвертируемый бит — в первом байте MAC."],
    ["The 8th bit of the first byte", "The 8th bit is left as it is; only the 7th changes.", "Восьмой бит не трогают; меняется только седьмой."],
  ], "The 7th bit of the client MAC address — in the first byte — is reversed (on the slide, from 0 to 1).", "Инвертируется седьмой бит MAC-адреса клиента — в первом байте (на слайде — с 0 на 1)."),

  qx("Using EUI-64, what is the interface ID for the MAC address a4:5e:60:12:34:56?", "a65e:60ff:fe12:3456", [
    ["a45e:60ff:fe12:3456", "The 7th bit was not reversed: a4 (1010 0100) must become a6 (1010 0110).", "Седьмой бит не инвертирован: a4 (1010 0100) должен стать a6 (1010 0110)."],
    ["a65e:60fe:ff12:3456", "fffe is inserted in this order: ff first, then fe.", "fffe вставляют именно в таком порядке: сначала ff, потом fe."],
    ["a65e:6012:fffe:3456", "fffe belongs after the first 24 bits (a4:5e:60), not after the fourth byte.", "fffe ставят после первых 24 бит (a4:5e:60), а не после четвёртого байта."],
  ], "a4:5e:60 + ff:fe + 12:34:56, and a4 → a6 after reversing the 7th bit: a65e:60ff:fe12:3456.", "a4:5e:60 + ff:fe + 12:34:56, а a4 после инверсии седьмого бита → a6: a65e:60ff:fe12:3456."),

  qx("Reversing the 7th bit changes the second hex digit of the first byte. What does a first byte of 5c become?", "5e", [
    ["5d", "5d differs from 5c in the last bit (bit 8), not bit 7.", "5d отличается от 5c последним битом (восьмым), а не седьмым."],
    ["7c", "7c changes bit 3 (value 0x20); the 7th bit is worth 0x02.", "7c меняет третий бит (вес 0x20), а седьмой бит весит 0x02."],
    ["dc", "dc changes the first bit; EUI-64 reverses the 7th.", "dc меняет первый бит, а EUI-64 инвертирует седьмой."],
  ], "5c = 0101 1100; reversing the 7th bit gives 0101 1110 = 5e. Shortcut: c ↔ e.", "5c = 0101 1100; инверсия седьмого бита даёт 0101 1110 = 5e. Короткий путь: c ↔ e."),

  qx("A Cisco router interface has the MAC address 0050.56c0.0001. Which LLA does EUI-64 give it?", "fe80::250:56ff:fec0:1", [
    ["fe80::50:56ff:fec0:1", "The 7th bit was not reversed: 00 must become 02.", "Седьмой бит не инвертирован: 00 должно стать 02."],
    ["fe80::250:56c0:fffe:1", "fffe goes after 00:50:56, the first 24 bits, not after the fourth byte.", "fffe ставят после 00:50:56, первых 24 бит, а не после четвёртого байта."],
    ["fe80::2050:56ff:fec0:1", "The wrong digit changed: reversing bit 7 turns 00 into 02, not 20.", "Изменена не та цифра: инверсия седьмого бита превращает 00 в 02, а не в 20."],
  ], "00:50:56 + ff:fe + c0:00:01, and 00 → 02: 0250:56ff:fec0:0001, compressed fe80::250:56ff:fec0:1.", "00:50:56 + ff:fe + c0:00:01, а 00 → 02: 0250:56ff:fec0:0001, в сжатом виде fe80::250:56ff:fec0:1."),

  qx("Why might a device use a random 64-bit interface ID instead of EUI-64?", "It hides the MAC, so the device cannot be tracked by it", [
    ["It is shorter, so the address fits in 64 bits", "A random interface ID is also 64 bits; the address is still 128.", "Случайный идентификатор тоже 64 бита; адрес по-прежнему 128."],
    ["Cisco routers require it on every interface", "Cisco routers use EUI-64 by default.", "Маршрутизаторы Cisco по умолчанию используют EUI-64."],
    ["It removes the need for an LLA on the interface", "Every IPv6 interface must still have an LLA.", "LLA по-прежнему обязателен на каждом интерфейсе IPv6."],
  ], "A random interface ID such as 50a5:8a35:a5bb:66e1 does not reveal the MAC address, so the device cannot be tracked by it.", "Случайный идентификатор вроде 50a5:8a35:a5bb:66e1 не раскрывает MAC-адрес, и по нему устройство нельзя отследить."),

  qx("Windows ipconfig shows the IPv6 Address 2001:db8:acad:1:50a5:8a35:a5bb:66e1. Which link-local address does the same output most likely show?", "fe80::50a5:8a35:a5bb:66e1", [
    ["fe80::1", "fe80::1 is the router's LLA, shown as the Default Gateway.", "fe80::1 — LLA маршрутизатора, он показан как Default Gateway."],
    ["fe80::50a5:8aff:fe35:66e1", "This inserts ff:fe as if it were EUI-64, but the GUA's interface ID is random.", "Здесь вставлено ff:fe, как в EUI-64, а идентификатор в GUA случайный."],
    ["fe80::2001:db8:acad:1", "The LLA uses the interface ID, not the GUA's prefix.", "LLA берёт идентификатор интерфейса, а не префикс GUA."],
  ], "Windows typically uses the same method for the SLAAC-created GUA and the dynamic LLA, so both end with the same 64 bits.", "Windows обычно использует один и тот же метод для GUA из SLAAC и для динамического LLA, поэтому оба оканчиваются одинаковыми 64 битами."),

  qx("By default, how does Cisco IOS build the interface ID of the LLAs it creates automatically?", "With EUI-64 from the interface MAC", [
    ["With a random 64-bit number", "Random IDs are typical of Windows; Cisco IOS uses EUI-64 by default.", "Случайные идентификаторы типичны для Windows; Cisco IOS по умолчанию использует EUI-64."],
    ["By copying the interface ID of the GUA", "R1's GUA ends in ::1, yet its LLA is FE80::7279:B3FF:FE92:3640.", "GUA у R1 оканчивается на ::1, а его LLA — FE80::7279:B3FF:FE92:3640."],
    ["By asking a stateful DHCPv6 server", "LLAs are created locally; no server is involved.", "LLA создаются локально, без всякого сервера."],
  ], "Cisco routers create an LLA whenever a GUA is assigned and, by default, use EUI-64 for the interface ID of all LLAs.", "Маршрутизаторы Cisco создают LLA, как только назначен GUA, и по умолчанию строят идентификатор всех LLA через EUI-64."),

  qx("Which router command shows each interface's status together with its LLA and its GUAs?", "show ipv6 interface brief", [
    ["show ipv6 route", "show ipv6 route lists routes (C and L entries), not each interface's LLA.", "show ipv6 route выводит маршруты (записи C и L), а не LLA каждого интерфейса."],
    ["show interface", "show interface gives hardware details such as the MAC (bia), not the IPv6 addresses.", "show interface показывает сведения об оборудовании, например MAC (bia), а не адреса IPv6."],
    ["ipconfig", "ipconfig is a Windows host command.", "ipconfig — команда хоста Windows."],
  ], "show ipv6 interface brief lists every interface with [status/protocol], its LLA (FE80::…) and its GUAs.", "show ipv6 interface brief выводит каждый интерфейс со [status/protocol], его LLA (FE80::…) и GUA."),

  qx("In show ipv6 route, what does the entry L 2001:DB8:ACAD:1::1/128 represent?", "The router's own address on that interface", [
    ["The connected /64 network", "The connected network is the C entry, 2001:DB8:ACAD:1::/64.", "Подключённая сеть — это запись C, 2001:DB8:ACAD:1::/64."],
    ["A route learned from a neighbor router", "This entry comes from the router's own interface address, not from a neighbor.", "Эта запись взята из адреса собственного интерфейса, а не от соседа."],
    ["The link-local address of the next hop", "No LLA appears in this entry; it is the router's GUA as a /128.", "LLA в этой записи нет; это GUA самого маршрутизатора как /128."],
  ], "C is the directly connected /64; L is the router's own interface address as a /128 host route (receive).", "C — непосредственно подключённая сеть /64; L — собственный адрес интерфейса маршрутизатора как маршрут /128 (receive)."),

  tfx("Stateless DHCPv6 keeps a record of which host uses which IPv6 address.", false,
    "False. Stateless DHCPv6 gives only other information (DNS, domain name) and keeps no record of addresses; that is the job of stateful DHCPv6.",
    "Неверно. Stateless DHCPv6 выдаёт только другие сведения (DNS, доменное имя) и не ведёт учёта адресов — это задача stateful DHCPv6.",
    "Answering True mixes up the two kinds: stateful (like DHCP for IPv4) tracks addresses, stateless does not hand them out at all.",
    "Ответ «верно» путает два вида: stateful (как DHCP для IPv4) ведёт учёт адресов, а stateless их вообще не выдаёт."),
];
