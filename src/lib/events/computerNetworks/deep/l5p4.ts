import { qx, tfx, type Draft } from "../../types";

export const deepL5P4: Draft[] = [
  qx("Which prompt shows that a Cisco router is in privileged EXEC mode?", "Router#", [
    ["Router>", "The > prompt is user EXEC mode, which allows only basic monitoring commands.", "Приглашение > — режим user EXEC, там доступны только простые команды просмотра."],
    ["Router(config)#", "(config)# is global configuration mode, entered from privileged EXEC.", "(config)# — режим глобальной конфигурации, в него входят из privileged EXEC."],
    ["Router(config-if)#", "(config-if)# is interface configuration mode.", "(config-if)# — режим настройки интерфейса."],
  ], "Router> is user EXEC, Router# is privileged EXEC (reached with enable), Router(config)# is global configuration.", "Router> — user EXEC, Router# — privileged EXEC (вход командой enable), Router(config)# — глобальная конфигурация."),

  qx("Which command moves the router from privileged EXEC mode into global configuration mode?", "configure terminal", [
    ["enable", "enable moves from user EXEC to privileged EXEC, one step earlier.", "enable переводит из user EXEC в privileged EXEC — это шаг раньше."],
    ["interface gigabitEthernet 0/0/0", "This enters interface mode and must be typed from global configuration.", "Эта команда входит в режим интерфейса и вводится уже из глобальной конфигурации."],
    ["line console 0", "This enters line configuration mode, also from global configuration.", "Она открывает режим настройки линии — тоже из глобальной конфигурации."],
  ], "configure terminal (conf t) enters global configuration mode, Router(config)#.", "configure terminal (conf t) открывает режим глобальной конфигурации Router(config)#."),

  qx("In which mode is the hostname command entered?", "Global configuration, Router(config)#", [
    ["Privileged EXEC, Router#", "Configuration changes such as hostname are not accepted in privileged EXEC.", "Изменения конфигурации вроде hostname в privileged EXEC не принимаются."],
    ["Interface configuration, Router(config-if)#", "hostname applies to the whole device, not to one interface.", "hostname относится ко всему устройству, а не к одному интерфейсу."],
    ["Line configuration, Router(config-line)#", "Line mode holds settings for console and vty lines, not the device name.", "В режиме линии задаются параметры console и vty, а не имя устройства."],
  ], "The device name is set in global configuration mode: Router(config)# hostname R1.", "Имя устройства задаётся в глобальной конфигурации: Router(config)# hostname R1."),

  qx("Which command secures privileged EXEC mode with an encrypted password?", "enable secret class", [
    ["enable password class", "enable password stores the password in plaintext; enable secret stores it encrypted (hashed).", "enable password хранит пароль открытым текстом, а enable secret — в зашифрованном (хешированном) виде."],
    ["service password-encryption class", "service password-encryption takes no password; it only encrypts existing plaintext ones.", "service password-encryption не принимает пароль — она лишь шифрует уже заданные открытые."],
    ["password class under line console 0", "That secures console (user EXEC) access, not privileged EXEC.", "Это защищает доступ с консоли (user EXEC), а не privileged EXEC."],
  ], "Router(config)# enable secret password secures privileged EXEC mode; in the example the password is class.", "Router(config)# enable secret <пароль> защищает privileged EXEC; в примере пароль — class."),

  qx("A router has both enable password and enable secret configured with different values. Which one unlocks privileged EXEC mode?", "The enable secret", [
    ["The enable password, since it was set first", "Order does not matter; enable secret always takes precedence.", "Порядок неважен: enable secret всегда главнее."],
    ["Either one of them is accepted", "Only the enable secret is checked when both exist.", "Когда заданы оба, проверяется только enable secret."],
    ["Neither, until one of them is removed", "The router works normally and simply uses the secret.", "Маршрутизатор работает нормально и просто использует secret."],
  ], "When both exist, IOS uses enable secret and ignores enable password.", "Когда заданы оба, IOS использует enable secret и не учитывает enable password."),

  qx("Which command sequence secures user EXEC access on the console port?", "line console 0, password cisco, login", [
    ["line vty 0 4, password cisco, login", "vty lines protect remote Telnet/SSH access, not the console port.", "Линии vty защищают удалённый доступ по Telnet/SSH, а не консольный порт."],
    ["enable secret cisco, then login", "enable secret protects privileged EXEC; login belongs under a line.", "enable secret защищает privileged EXEC, а login вводится в режиме линии."],
    ["line console 0, then password cisco and nothing else", "Without login the password is set but never requested.", "Без login пароль задан, но не запрашивается."],
  ], "Router(config)# line console 0, then password and login in line configuration mode.", "Router(config)# line console 0, затем password и login в режиме настройки линии."),

  qx("An administrator types password cisco under line console 0 but forgets the login command. What is the result?", "No password is asked for at the console", [
    ["The console port is locked for everyone", "Nothing is locked; the line simply does not check the password.", "Ничего не блокируется: линия просто не проверяет пароль."],
    ["The password is asked for only over Telnet", "Console settings do not affect vty (Telnet) lines.", "Настройки консоли не влияют на линии vty (Telnet)."],
    ["The router rejects the password command", "The password is accepted and stored; it is just not enforced.", "Пароль принимается и сохраняется, просто не применяется."],
  ], "login tells the line to check the configured password; without it the password is not requested.", "login велит линии проверять заданный пароль; без него пароль не спрашивается."),

  qx("What does line vty 0 4 select for configuration?", "Five virtual lines used for remote Telnet/SSH", [
    ["Four physical console ports numbered 0 to 4", "There is one console line (console 0); vty lines are virtual remote lines.", "Консольная линия одна (console 0); линии vty — виртуальные удалённые."],
    ["Gigabit interfaces G0/0 through G0/4", "Interfaces are configured with the interface command, not line vty.", "Интерфейсы настраиваются командой interface, а не line vty."],
    ["VLANs 0 through 4 on the router", "VLANs are not configured with line commands.", "VLAN не настраиваются командами line."],
  ], "line vty 0 4 configures virtual terminal lines 0–4 (five lines) that carry remote Telnet or SSH sessions.", "line vty 0 4 настраивает виртуальные терминальные линии 0–4 (пять линий) для удалённых сеансов Telnet или SSH."),

  qx("What is the effect of transport input ssh entered under line vty 0 4?", "Only SSH connections are accepted on the vty lines", [
    ["Both Telnet and SSH are blocked on the vty lines", "SSH is allowed; only protocols not listed (such as Telnet) are refused.", "SSH разрешён; отклоняются только протоколы не из списка (например, Telnet)."],
    ["SSH is enabled on the console port", "transport input under vty lines affects remote access, not the console.", "transport input на линиях vty влияет на удалённый доступ, а не на консоль."],
    ["The router opens an SSH session to another device", "transport input controls incoming sessions; it does not start one.", "transport input управляет входящими сеансами и не открывает исходящих."],
  ], "transport input {ssh | telnet} chooses which protocols may be used for remote access on the vty lines.", "transport input {ssh | telnet} выбирает, какими протоколами можно удалённо подключаться к линиям vty."),

  qx("What does service password-encryption do?", "Encrypts all plaintext passwords in the configuration", [
    ["Hashes only the enable secret password", "enable secret is already hashed; this command targets the plaintext ones.", "enable secret и так хеширован; эта команда касается открытых паролей."],
    ["Turns on SSH encryption for the vty lines", "SSH is set with transport input and key generation, not with this command.", "SSH настраивается через transport input и генерацию ключей, а не этой командой."],
    ["Encrypts all traffic leaving the router's interfaces", "It only affects how passwords appear in the configuration, not traffic.", "Она влияет только на вид паролей в конфигурации, а не на трафик."],
  ], "service password-encryption (global configuration) encrypts plaintext passwords such as console and vty passwords.", "service password-encryption (глобальная конфигурация) шифрует открытые пароли, например console и vty."),

  qx("Which of these commands is entered in global configuration mode?", "service password-encryption", [
    ["password cisco", "password is entered in line configuration mode.", "password вводится в режиме настройки линии."],
    ["no shutdown", "no shutdown is entered in interface configuration mode.", "no shutdown вводится в режиме настройки интерфейса."],
    ["copy running-config startup-config", "Saving the configuration is done from privileged EXEC.", "Сохранение конфигурации выполняется из privileged EXEC."],
  ], "On the slides service password-encryption is typed at R1(config)#, the global configuration prompt.", "На слайдах service password-encryption вводится в приглашении R1(config)# — глобальной конфигурации."),

  qx("Which of these commands is entered in line configuration mode, Router(config-line)#?", "login", [
    ["hostname R1", "hostname is a global configuration command.", "hostname — команда глобальной конфигурации."],
    ["banner motd", "banner motd is a global configuration command.", "banner motd — команда глобальной конфигурации."],
    ["enable secret", "enable secret is a global configuration command.", "enable secret — команда глобальной конфигурации."],
  ], "password, login and transport input belong under line console 0 or line vty 0 4.", "password, login и transport input вводятся под line console 0 или line vty 0 4."),

  qx("What is the purpose of the banner motd command?", "To show a legal notice to anyone who connects", [
    ["To encrypt the passwords that users type in", "Password encryption is the job of enable secret and service password-encryption.", "Шифрованием паролей занимаются enable secret и service password-encryption."],
    ["To change the router's prompt to a custom name", "The prompt follows the hostname command.", "Приглашение меняется командой hostname."],
    ["To describe the network attached to each interface", "That is the job of description in interface mode.", "Это задача команды description в режиме интерфейса."],
  ], "banner motd provides legal notification, e.g. \"WARNING: Unauthorized access is prohibited!\".", "banner motd даёт юридическое предупреждение, например «WARNING: Unauthorized access is prohibited!»."),

  qx("In banner motd # Unauthorized access is prohibited! #, what is the role of the # characters?", "They mark where the message starts and ends", [
    ["They are comments that IOS ignores completely", "IOS uses the delimiter to know where the banner text stops.", "IOS по разделителю понимает, где кончается текст баннера."],
    ["They make the banner text appear in bold", "IOS banners are plain text; there is no bold formatting.", "Баннеры IOS — обычный текст, жирного шрифта там нет."],
    ["They are needed to encrypt the banner in the config", "Banners are stored as plain text, not encrypted.", "Баннеры хранятся открытым текстом, без шифрования."],
  ], "The # is a delimiter: IOS prompts \"End with a new line and the #\" and stops reading the banner there.", "# — разделитель: IOS подсказывает «End with a new line and the #» и на нём заканчивает читать баннер."),

  qx("Which command saves the configuration so that it survives a reload?", "copy running-config startup-config", [
    ["copy startup-config running-config", "This copies the saved file into RAM, the opposite direction.", "Это копирует сохранённый файл в RAM — в обратную сторону."],
    ["show running-config", "show running-config only displays the configuration; it saves nothing.", "show running-config лишь показывает конфигурацию и ничего не сохраняет."],
    ["end", "end only returns to privileged EXEC; it does not save.", "end лишь возвращает в privileged EXEC и не сохраняет."],
  ], "Router# copy running-config startup-config saves the current configuration to NVRAM.", "Router# copy running-config startup-config сохраняет текущую конфигурацию в NVRAM."),

  qx("In which memory is the startup configuration stored?", "NVRAM", [
    ["RAM", "RAM holds the running configuration, which is lost on reload.", "В RAM лежит running-config, и он теряется при перезагрузке."],
    ["Flash", "Flash typically stores the IOS image, not the startup configuration.", "Во Flash обычно хранится образ IOS, а не startup-config."],
    ["ROM", "ROM holds bootstrap code, not the saved configuration.", "В ROM хранится загрузочный код, а не сохранённая конфигурация."],
  ], "The slides note the configuration is saved to NVRAM, which keeps it through power loss.", "На слайдах отмечено, что конфигурация сохраняется в NVRAM, где она переживает отключение питания."),

  qx("In which mode is copy running-config startup-config entered?", "Privileged EXEC, R1#", [
    ["Global configuration, R1(config)#", "On the slides the admin types exit first and saves at R1#.", "На слайдах администратор сначала вводит exit и сохраняет уже в R1#."],
    ["User EXEC, R1>", "User EXEC cannot copy configurations.", "В user EXEC копировать конфигурации нельзя."],
    ["Line configuration, R1(config-line)#", "Line mode is only for console and vty settings.", "Режим линии — только для параметров console и vty."],
  ], "The save command is run from privileged EXEC: R1# copy running-config startup-config.", "Команда сохранения выполняется из privileged EXEC: R1# copy running-config startup-config."),

  qx("What is the difference between exit and end in IOS configuration modes?", "exit goes up one level; end returns to privileged EXEC", [
    ["exit saves the configuration; end discards the changes", "Neither command saves or discards anything; they only change mode.", "Ни одна из команд ничего не сохраняет и не отменяет — они лишь меняют режим."],
    ["exit logs out of the router; end reboots it", "exit at privileged EXEC ends the session, but end never reboots a device.", "exit в privileged EXEC завершает сеанс, но end никогда не перезагружает устройство."],
    ["They do exactly the same thing in every mode", "From interface mode exit goes to (config)#, while end goes straight to #.", "Из режима интерфейса exit ведёт в (config)#, а end — сразу в #."],
  ], "exit returns one level (config-if → config); end jumps straight back to privileged EXEC (Router#).", "exit возвращает на уровень выше (config-if → config); end сразу ведёт в privileged EXEC (Router#)."),

  qx("Which command enters interface configuration mode for interface G0/0/0?", "interface gigabitEthernet 0/0/0", [
    ["ip address gigabitEthernet 0/0/0", "ip address assigns an address inside interface mode; it does not enter it.", "ip address назначает адрес уже внутри режима интерфейса, а не входит в него."],
    ["line gigabitEthernet 0/0/0", "line is used for console and vty lines, not Ethernet interfaces.", "line используется для линий console и vty, а не Ethernet-интерфейсов."],
    ["show interfaces gigabitEthernet 0/0/0", "show interfaces displays statistics; it does not change the mode.", "show interfaces показывает статистику и режим не меняет."],
  ], "Router(config)# interface type-and-number, e.g. interface gigabitEthernet 0/0/0, gives Router(config-if)#.", "Router(config)# interface <тип и номер>, например interface gigabitEthernet 0/0/0, даёт приглашение Router(config-if)#."),

  qx("Which command correctly assigns an IPv4 address to a router interface?", "ip address 192.168.10.1 255.255.255.0", [
    ["ip address 192.168.10.1/24", "IOS expects a dotted-decimal subnet mask for IPv4, not a /24 prefix.", "Для IPv4 IOS ждёт маску в точечной записи, а не префикс /24."],
    ["ipv4 address 192.168.10.1 255.255.255.0", "There is no ipv4 address command; the IPv4 command is ip address.", "Команды ipv4 address нет; для IPv4 используется ip address."],
    ["ip address 192.168.10.1 default-gateway 192.168.10.254", "A router interface takes an address and mask; it does not set a default gateway this way.", "Интерфейсу маршрутизатора задают адрес и маску; шлюз так не настраивается."],
  ], "Router(config-if)# ip address ipv4-address subnet-mask, e.g. ip address 192.168.10.1 255.255.255.0.", "Router(config-if)# ip address <адрес> <маска>, например ip address 192.168.10.1 255.255.255.0."),

  qx("Which command assigns an IPv6 global unicast address to a router interface?", "ipv6 address 2001:db8:acad:10::1/64", [
    ["ipv6 address 2001:db8:acad:10::1 255.255.255.0", "IPv6 uses a /prefix-length, not a dotted-decimal mask.", "IPv6 использует /длину префикса, а не маску в точечной записи."],
    ["ip address 2001:db8:acad:10::1/64", "ip address is the IPv4 command; IPv6 needs ipv6 address.", "ip address — команда IPv4; для IPv6 нужна ipv6 address."],
    ["ipv6 address 2001:db8:acad:10::1 prefix 64", "The prefix length is written straight after a slash, not with the word prefix.", "Длина префикса пишется сразу после косой черты, без слова prefix."],
  ], "Router(config-if)# ipv6 address ipv6-address/prefix-length, e.g. 2001:db8:acad:10::1/64.", "Router(config-if)# ipv6 address <адрес>/<длина префикса>, например 2001:db8:acad:10::1/64."),

  qx("Why is it good practice to use the description command on a router interface?", "It records which network the interface connects to", [
    ["It brings the interface up after configuration", "Activating the interface is the job of no shutdown.", "Включает интерфейс команда no shutdown."],
    ["It sets the interface's speed and duplex mode", "Speed and duplex have their own commands; description is only text.", "У скорости и дуплекса свои команды; description — только текст."],
    ["It is shown as a banner to users who log in", "Login banners come from banner motd, not from description.", "Баннеры при входе задаёт banner motd, а не description."],
  ], "description adds information about the connected network (e.g. \"Link to LAN\", \"Link to R2\") and appears in show interfaces.", "description добавляет сведения о подключённой сети (например, «Link to LAN», «Link to R2») и видна в show interfaces."),

  qx("R1's G0/0/0 has an IP address, but show ip interface brief lists it as administratively down. Which command fixes this?", "no shutdown", [
    ["ip address dhcp", "The interface already has an address; the problem is that it is disabled.", "Адрес у интерфейса уже есть; проблема в том, что он выключен."],
    ["enable secret", "enable secret protects privileged EXEC and does not touch interfaces.", "enable secret защищает privileged EXEC и интерфейсов не касается."],
    ["copy running-config startup-config", "Saving the configuration does not activate a shut-down interface.", "Сохранение конфигурации не включает выключенный интерфейс."],
  ], "\"Administratively down\" means the interface is shut down; no shutdown activates it.", "«Administratively down» означает, что интерфейс выключен; no shutdown его активирует."),

  tfx("Router interfaces are active by default, so the no shutdown command is optional.", false,
    "Router interfaces start administratively down; without no shutdown they never come up.", "Интерфейсы маршрутизатора по умолчанию административно выключены; без no shutdown они не поднимутся.",
    "Answering true confuses routers with switch ports, which are enabled by default; the slides stress that no shutdown activates the interface.", "Ответ «верно» путает маршрутизатор с портами коммутатора, которые включены по умолчанию; на слайдах подчёркнуто, что no shutdown активирует интерфейс."),

  qx("After no shutdown, the console shows \"%LINEPROTO-5-UPDOWN: Line protocol on Interface GigabitEthernet0/0/0, changed state to up\". What does this mean?", "The interface's data link protocol is now up", [
    ["A routing protocol has started on the router", "LINEPROTO refers to the interface's Layer 2 line protocol, not to OSPF or EIGRP.", "LINEPROTO — линейный протокол уровня 2 интерфейса, а не OSPF или EIGRP."],
    ["The console line is now ready for login", "The message is about GigabitEthernet0/0/0, not the console line.", "Сообщение относится к GigabitEthernet0/0/0, а не к консольной линии."],
    ["The interface address has been saved to NVRAM", "Saving happens only with copy running-config startup-config.", "Сохранение происходит только по copy running-config startup-config."],
  ], "%LINK-3-UPDOWN reports the physical link state; %LINEPROTO-5-UPDOWN reports the data link line protocol state.", "%LINK-3-UPDOWN сообщает о физическом канале, %LINEPROTO-5-UPDOWN — о состоянии линейного протокола канального уровня."),

  qx("Which command quickly lists every interface with its IPv4 address and up/down status?", "show ip interface brief", [
    ["show running-config", "It shows the configuration, not a compact status table of all interfaces.", "Она показывает конфигурацию, а не компактную таблицу состояния интерфейсов."],
    ["show ip route", "show ip route lists routes, not the status of each interface.", "show ip route выводит маршруты, а не состояние каждого интерфейса."],
    ["show version", "show version shows the IOS version, uptime and hardware, not interface status.", "show version показывает версию IOS, время работы и оборудование, а не состояние интерфейсов."],
  ], "show ip interface brief (and show ipv6 interface brief) display all interfaces, their IP addresses and current status.", "show ip interface brief (и show ipv6 interface brief) показывают все интерфейсы, их IP-адреса и текущее состояние."),

  qx("show ip interface brief on R1 includes \"Vlan1  unassigned  YES unset  administratively down  down\". What does this tell the administrator?", "Vlan1 has no IP address and is shut down", [
    ["Vlan1 has a DHCP address and is running normally", "\"unassigned\" means there is no address, and the status is down.", "«unassigned» значит, что адреса нет, а состояние — down."],
    ["Vlan1 is up but its cable is unplugged", "\"Administratively down\" is a configuration state, not a cabling fault.", "«Administratively down» — состояние конфигурации, а не неисправность кабеля."],
    ["Vlan1 has been deleted from the router", "A deleted interface would not appear in the list at all.", "Удалённый интерфейс вообще не появился бы в списке."],
  ], "\"unassigned\" means no IP address, and \"administratively down / down\" means the interface is shut down.", "«unassigned» — IP-адреса нет, «administratively down / down» — интерфейс выключен."),

  qx("Which details does show ipv6 interface brief give for each interface?", "Its status plus link-local and global IPv6 addresses", [
    ["Its packet counters, MTU, bandwidth and duplex settings", "Those detailed statistics come from show interfaces.", "Такую подробную статистику даёт show interfaces."],
    ["The IPv6 neighbours learned on it", "Neighbours are listed by show ipv6 neighbors.", "Соседей показывает show ipv6 neighbors."],
    ["The IPv6 routes that leave through it", "Routes are shown by show ipv6 route.", "Маршруты показывает show ipv6 route."],
  ], "show ipv6 interface brief shows each interface's [status/protocol] and its addresses, e.g. FE80::201:C9FF:FE89:4501 and 2001:DB8:ACAD:10::1.", "show ipv6 interface brief показывает [состояние/протокол] каждого интерфейса и его адреса, например FE80::201:C9FF:FE89:4501 и 2001:DB8:ACAD:10::1."),

  qx("Which command displays detailed statistics such as MTU, bandwidth, duplex, runts and giants for all interfaces?", "show interfaces", [
    ["show ip interface brief", "The brief command shows only addresses and status, not detailed statistics.", "Краткая команда показывает только адреса и состояние, без подробной статистики."],
    ["show ip arp", "show ip arp lists ARP entries, not interface statistics.", "show ip arp выводит записи ARP, а не статистику интерфейсов."],
    ["show ipv6 route", "show ipv6 route lists IPv6 routes only.", "show ipv6 route выводит только маршруты IPv6."],
  ], "show interfaces displays statistics for all interfaces (MTU, BW, duplex, input/output counters, runts, giants).", "show interfaces выводит статистику по всем интерфейсам (MTU, BW, дуплекс, счётчики, runts, giants)."),

  tfx("The show interfaces command displays both the IPv4 and the IPv6 addressing of each interface.", false,
    "Per the slides, show interfaces only displays the IPv4 addressing information; IPv6 details come from show ipv6 interface.", "По слайдам show interfaces показывает только IPv4-адресацию; сведения об IPv6 даёт show ipv6 interface.",
    "Answering true overlooks the note that show interfaces shows IPv4 addressing only.", "Ответ «верно» упускает пометку, что show interfaces показывает только IPv4-адресацию."),

  qx("Which command shows IPv4 settings such as Proxy ARP, ICMP redirects and access lists for a router interface?", "show ip interface", [
    ["show interfaces", "show interfaces gives Layer 1/2 statistics and the IPv4 address, not these IPv4 options.", "show interfaces даёт статистику уровней 1/2 и адрес IPv4, но не эти параметры IPv4."],
    ["show ipv6 interface", "That command covers IPv6 settings such as ND and DAD, not IPv4.", "Эта команда показывает параметры IPv6 (ND, DAD), а не IPv4."],
    ["show running-config interface", "The configuration lists commands entered, not runtime IPv4 statistics.", "Конфигурация перечисляет введённые команды, а не рабочую статистику IPv4."],
  ], "show ip interface displays IPv4 statistics for router interfaces: helper address, access lists, Proxy ARP, ICMP redirects and more.", "show ip interface выводит статистику IPv4 по интерфейсам: helper address, списки доступа, Proxy ARP, ICMP redirects и другое."),

  qx("Where is the routing table shown by show ip route stored?", "In RAM", [
    ["In NVRAM", "NVRAM keeps the startup configuration; the routing table is built at runtime.", "В NVRAM хранится startup-config; таблица маршрутов строится во время работы."],
    ["In Flash", "Flash stores the IOS image and files, not the live routing table.", "Во Flash лежат образ IOS и файлы, а не рабочая таблица маршрутов."],
    ["In ROM", "ROM contains bootstrap code only.", "В ROM только загрузочный код."],
  ], "show ip route and show ipv6 route display the IP routing tables stored in RAM.", "show ip route и show ipv6 route показывают таблицы маршрутизации, хранящиеся в RAM."),

  qx("Which command displays the configuration that the router is currently running from RAM?", "show running-config", [
    ["show startup-config", "show startup-config shows the saved file in NVRAM, which may differ.", "show startup-config показывает сохранённый файл в NVRAM, он может отличаться."],
    ["show ip interface brief", "This lists interface status, not the whole configuration.", "Это список состояния интерфейсов, а не вся конфигурация."],
    ["copy running-config startup-config", "This saves the configuration instead of displaying it.", "Эта команда сохраняет конфигурацию, а не показывает её."],
  ], "show running-config displays the active configuration in RAM, including unsaved changes.", "show running-config показывает действующую конфигурацию в RAM, включая несохранённые изменения."),

  qx("After configuring R1's LAN interface as 192.168.10.1, the administrator wants to confirm that PC1 can reach it. Which command should be run on PC1?", "ping 192.168.10.1", [
    ["show ip route 192.168.10.1", "show ip route is an IOS command and does not test reachability from the PC.", "show ip route — команда IOS, и доступность с ПК она не проверяет."],
    ["arp -d 192.168.10.1", "arp -d removes an ARP entry; it does not test the connection.", "arp -d удаляет запись ARP и связь не проверяет."],
    ["ipconfig /release 192.168.10.1", "ipconfig /release drops a DHCP lease and would break connectivity, not test it.", "ipconfig /release освобождает аренду DHCP и скорее сломает связь, чем проверит её."],
  ], "ping sends ICMP Echo Requests and confirms end-to-end reachability when Echo Replies return.", "ping отправляет ICMP Echo Request и подтверждает сквозную доступность, если приходят Echo Reply."),

  qx("PC1 is 192.168.10.10/24 on the LAN behind R1 G0/0/0 (192.168.10.1); R1 G0/0/1 is 209.165.200.225. What should PC1's default gateway be?", "192.168.10.1", [
    ["209.165.200.225", "That is R1's WAN interface, which is not on PC1's network.", "Это WAN-интерфейс R1, он не в сети PC1."],
    ["192.168.10.255", "192.168.10.255 is the broadcast address of the LAN.", "192.168.10.255 — широковещательный адрес LAN."],
    ["192.168.10.0", "192.168.10.0 is the network address, not a usable host address.", "192.168.10.0 — адрес сети, а не адрес узла."],
  ], "The default gateway is the router interface attached to the host's local network; host and interface must be in the same network.", "Шлюз по умолчанию — интерфейс маршрутизатора в локальной сети хоста; хост и интерфейс должны быть в одной сети."),

  qx("Why does a Layer 2 switch need a default gateway address?", "To be managed remotely from another network", [
    ["To forward user frames between VLANs", "Moving traffic between VLANs needs a router or Layer 3 switch, not the switch's gateway setting.", "Для трафика между VLAN нужен маршрутизатор или коммутатор уровня 3, а не шлюз коммутатора."],
    ["To learn MAC addresses on its ports", "MAC learning works without any IP settings at all.", "Изучение MAC-адресов работает вообще без IP-настроек."],
    ["To route traffic for the hosts that are plugged into it", "Hosts use their own gateway; a Layer 2 switch does not route their traffic.", "Хосты используют свой шлюз; коммутатор уровня 2 их трафик не маршрутизирует."],
  ], "A switch must have a default gateway configured so that it can be managed remotely from another network.", "У коммутатора должен быть задан шлюз по умолчанию, чтобы им можно было управлять удалённо из другой сети."),

  qx("Which command sets an IPv4 default gateway on a Cisco Layer 2 switch?", "ip default-gateway 192.168.10.1", [
    ["ip route default 192.168.10.1", "This is not valid IOS syntax; the switch command is ip default-gateway.", "Такого синтаксиса в IOS нет; на коммутаторе используется ip default-gateway."],
    ["default-gateway 192.168.10.1 on interface vlan 1", "The gateway is set globally, not under the VLAN interface.", "Шлюз задаётся глобально, а не в интерфейсе VLAN."],
    ["ip gateway 192.168.10.1", "There is no ip gateway command in IOS.", "Команды ip gateway в IOS нет."],
  ], "Use the ip default-gateway ip-address global configuration command on the switch.", "На коммутаторе используется команда глобальной конфигурации ip default-gateway <адрес>."),

  qx("In which mode is ip default-gateway entered on a switch?", "Global configuration mode", [
    ["Interface configuration mode for VLAN 1", "The management address goes on interface vlan 1, but the gateway is global.", "Адрес управления задаётся в interface vlan 1, а шлюз — глобально."],
    ["Privileged EXEC mode", "Privileged EXEC does not accept configuration commands.", "Privileged EXEC не принимает команды конфигурации."],
    ["Line configuration mode for vty 0 15", "Line mode configures remote access lines, not the gateway.", "Режим линии настраивает линии удалённого доступа, а не шлюз."],
  ], "ip default-gateway is a global configuration command: Switch(config)# ip default-gateway 192.168.10.1.", "ip default-gateway — команда глобальной конфигурации: Switch(config)# ip default-gateway 192.168.10.1."),
];
