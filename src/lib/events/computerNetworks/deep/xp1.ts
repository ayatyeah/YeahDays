import { qx, tfx, type Draft } from "../../types";

/** Разбор до косточек: сверх слайдов, часть 1 — службы, порты и транспортные протоколы. */
export const deepXP1: Draft[] = [
  qx("Which service turns a name such as example.com into an IP address?", "DNS", [
    ["DHCP", "DHCP hands out IP addresses to clients; it does not translate names into addresses.", "DHCP выдаёт клиентам IP-адреса, а имена в адреса не переводит."],
    ["ARP", "ARP maps a known IPv4 address to a MAC address; it is explicitly not a name service.", "ARP сопоставляет известный адрес IPv4 с MAC-адресом; это не служба имён."],
    ["NAT", "NAT rewrites private IP addresses to a public one; it knows nothing about domain names.", "NAT подменяет частные IP-адреса публичным; о доменных именах он ничего не знает."],
  ], "DNS, the Domain Name System, resolves domain names like example.com into IP addresses.", "DNS, система доменных имён, превращает имена вроде example.com в IP-адреса."),

  qx("Which three parameters does DHCP automatically give a client?", "IP address, subnet mask and default gateway", [
    ["IP address, MAC address and hostname", "A MAC address is burned into the NIC and a hostname is set locally; DHCP assigns neither.", "MAC-адрес зашит в сетевую карту, а имя хоста задаётся локально; DHCP ни то ни другое не выдаёт."],
    ["Subnet mask, MAC address and VLAN", "DHCP does not assign MAC addresses or VLAN membership; those are Layer 2 settings.", "DHCP не назначает MAC-адреса и принадлежность к VLAN; это настройки уровня 2."],
    ["Default gateway, port number and TTL", "Port numbers and TTL are per-packet transport and IP fields, not DHCP options.", "Номера портов и TTL — поля отдельных пакетов транспортного уровня и IP, а не параметры DHCP."],
  ], "DHCP automatically assigns an IP address, a subnet mask and a default gateway to the client.", "DHCP автоматически выдаёт клиенту IP-адрес, маску подсети и шлюз по умолчанию."),

  qx("A laptop joins the Wi-Fi and receives its IP settings without any manual input. Which protocol did this?", "DHCP", [
    ["DNS", "DNS answers name queries; it does not configure the laptop's own address.", "DNS отвечает на запросы имён; собственный адрес ноутбука он не настраивает."],
    ["SNMP", "SNMP collects monitoring data from network devices; it does not assign addresses.", "SNMP собирает данные мониторинга с устройств; адреса он не выдаёт."],
    ["NTP", "NTP synchronizes clocks, not IP settings.", "NTP синхронизирует часы, а не настройки IP."],
  ], "Automatic addressing on joining a network is the job of DHCP.", "Автоматическая выдача адреса при подключении к сети — задача DHCP."),

  qx("What does NAT do?", "Translates private IP addresses into a public one", [
    ["Resolves host names into numeric IP addresses", "Name resolution is DNS; NAT works on addresses that are already numeric.", "Разрешение имён — это DNS; NAT работает с уже числовыми адресами."],
    ["Assigns IP addresses to internal clients", "Assigning addresses is DHCP's role; NAT only rewrites them on the way out.", "Выдача адресов — роль DHCP; NAT лишь подменяет их на выходе."],
    ["Maps IP addresses to MAC addresses", "IP-to-MAC mapping is ARP, a Layer 2/3 helper, not address translation.", "Сопоставление IP и MAC — это ARP, а не трансляция адресов."],
  ], "NAT translates private internal IP addresses into a public IP address for traffic going to the internet.", "NAT преобразует частные внутренние IP-адреса в публичный IP-адрес для трафика в интернет."),

  qx("Which protocol collects monitoring metrics and management telemetry from network devices?", "SNMP", [
    ["SMTP", "SMTP sends email; the similar name is the trap.", "SMTP отправляет почту; похожее название — ловушка."],
    ["NTP", "NTP keeps device clocks in sync; it does not gather metrics.", "NTP согласует часы устройств; метрики он не собирает."],
    ["FTP", "FTP transfers files between hosts; it has no monitoring role.", "FTP передаёт файлы между хостами; мониторингом он не занимается."],
  ], "SNMP, the Simple Network Management Protocol, collects monitoring and management data from devices.", "SNMP, простой протокол управления сетью, собирает с устройств данные мониторинга и управления."),

  qx("Which protocol is used for sending email?", "SMTP", [
    ["SNMP", "SNMP is network management, not mail; only one letter differs.", "SNMP — управление сетью, а не почта; разница в одной букве."],
    ["HTTP", "HTTP delivers web pages; webmail runs over it, but the mail protocol itself is SMTP.", "HTTP доставляет веб-страницы; веб-почта работает поверх него, но почтовый протокол — SMTP."],
    ["FTP", "FTP is for file transfer, not for mail delivery.", "FTP — для передачи файлов, а не для доставки почты."],
  ], "SMTP is the protocol for sending email, on TCP port 25.", "SMTP — протокол отправки почты, порт TCP 25."),

  qx("Which protocol synchronizes the time on network devices?", "NTP", [
    ["SNMP", "SNMP reads metrics from devices; clock synchronization is a separate protocol.", "SNMP читает метрики с устройств; синхронизация часов — отдельный протокол."],
    ["DHCP", "DHCP configures addressing, not the system clock.", "DHCP настраивает адресацию, а не системные часы."],
    ["ICMP", "ICMP carries ping and error messages; it does not distribute time.", "ICMP несёт ping и сообщения об ошибках; время он не раздаёт."],
  ], "NTP, the Network Time Protocol, is responsible for time synchronization.", "NTP, протокол сетевого времени, отвечает за синхронизацию времени."),

  qx("Which protocol is responsible for file transfer?", "FTP", [
    ["SMTP", "SMTP moves email messages, not arbitrary files.", "SMTP передаёт почтовые сообщения, а не произвольные файлы."],
    ["DNS", "DNS resolves names; it carries no file content.", "DNS разрешает имена; содержимое файлов он не переносит."],
    ["ARP", "ARP resolves IP to MAC on the local segment and has nothing to do with files.", "ARP сопоставляет IP и MAC в локальном сегменте и к файлам отношения не имеет."],
  ], "FTP, the File Transfer Protocol, uses TCP ports 20 (data) and 21 (control).", "FTP, протокол передачи файлов, использует порты TCP 20 (данные) и 21 (управление)."),

  qx("Which statement about ARP is true?", "It maps a known IPv4 address to a MAC address", [
    ["It resolves domain names to IP addresses", "That is DNS; the notes stress ARP is not a name service.", "Это DNS; в конспекте подчёркнуто, что ARP — не служба имён."],
    ["It assigns IP addresses to new clients", "Address assignment is DHCP; ARP only discovers who already has an address.", "Выдача адресов — DHCP; ARP лишь выясняет, у кого адрес уже есть."],
    ["It translates private addresses to a public one", "That is NAT, performed on a border router.", "Это NAT, который выполняет пограничный маршрутизатор."],
  ], "ARP answers 'who has this IPv4 address?' with a MAC address; it is not a name service.", "ARP отвечает на вопрос «у кого этот IPv4-адрес?» MAC-адресом; это не служба имён."),

  qx("Which port does FTP use for its control connection?", "21", [
    ["20", "Port 20 is the FTP data connection; control commands go over 21.", "Порт 20 — соединение данных FTP; команды управления идут по 21."],
    ["22", "Port 22 is SSH, not FTP.", "Порт 22 — SSH, а не FTP."],
    ["23", "Port 23 is Telnet, not FTP.", "Порт 23 — Telnet, а не FTP."],
  ], "FTP uses two ports: 21 for control and 20 for data.", "FTP использует два порта: 21 для управления и 20 для данных."),

  qx("Which port carries FTP data transfers?", "20", [
    ["21", "Port 21 is the FTP control channel for commands, not the data channel.", "Порт 21 — канал управления FTP для команд, а не канал данных."],
    ["25", "Port 25 belongs to SMTP, which sends email.", "Порт 25 принадлежит SMTP, который отправляет почту."],
    ["53", "Port 53 belongs to DNS.", "Порт 53 принадлежит DNS."],
  ], "FTP data flows over port 20 while the control connection stays on port 21.", "Данные FTP идут по порту 20, а управляющее соединение остаётся на порту 21."),

  qx("Which port does SSH use?", "22", [
    ["20", "Port 20 is FTP data.", "Порт 20 — данные FTP."],
    ["23", "Port 23 is Telnet, the insecure predecessor of SSH.", "Порт 23 — Telnet, небезопасный предшественник SSH."],
    ["443", "Port 443 is HTTPS, web traffic over TLS.", "Порт 443 — HTTPS, веб поверх TLS."],
  ], "SSH, secure remote command-line access, uses TCP port 22.", "SSH, защищённый удалённый доступ к командной строке, использует порт TCP 22."),

  qx("Which port does Telnet use?", "23", [
    ["22", "Port 22 is SSH, the secure alternative to Telnet.", "Порт 22 — SSH, защищённая альтернатива Telnet."],
    ["25", "Port 25 is SMTP for sending email.", "Порт 25 — SMTP для отправки почты."],
    ["80", "Port 80 is HTTP for web pages.", "Порт 80 — HTTP для веб-страниц."],
  ], "Telnet, insecure plaintext remote CLI access, uses TCP port 23.", "Telnet, незащищённый удалённый CLI открытым текстом, использует порт TCP 23."),

  qx("Which port does SMTP use?", "25", [
    ["23", "Port 23 is Telnet.", "Порт 23 — Telnet."],
    ["53", "Port 53 is DNS.", "Порт 53 — DNS."],
    ["443", "Port 443 is HTTPS.", "Порт 443 — HTTPS."],
  ], "SMTP sends email over TCP port 25.", "SMTP отправляет почту по порту TCP 25."),

  qx("Which port does DNS use?", "53", [
    ["25", "Port 25 is SMTP, email sending.", "Порт 25 — SMTP, отправка почты."],
    ["67", "Port 67 is one of the two DHCP ports.", "Порт 67 — один из двух портов DHCP."],
    ["80", "Port 80 is HTTP, web traffic.", "Порт 80 — HTTP, веб-трафик."],
  ], "DNS listens on port 53, mainly over UDP, with TCP also possible.", "DNS слушает порт 53, в основном по UDP, но возможен и TCP."),

  qx("Which port does HTTP use by default?", "80", [
    ["443", "Port 443 is HTTPS, the TLS-encrypted version of web traffic.", "Порт 443 — HTTPS, веб-трафик, зашифрованный TLS."],
    ["8080", "8080 is a common alternative for proxies and test servers, not the default HTTP port.", "8080 — распространённая альтернатива для прокси и тестовых серверов, но не порт HTTP по умолчанию."],
    ["21", "Port 21 is FTP control.", "Порт 21 — управление FTP."],
  ], "Plain HTTP web traffic uses TCP port 80.", "Обычный веб-трафик HTTP идёт по порту TCP 80."),

  qx("Which port does HTTPS use by default?", "443", [
    ["80", "Port 80 is unencrypted HTTP.", "Порт 80 — незашифрованный HTTP."],
    ["22", "Port 22 is SSH; it is secure but is remote CLI, not web.", "Порт 22 — SSH; он защищён, но это удалённый CLI, а не веб."],
    ["53", "Port 53 is DNS.", "Порт 53 — DNS."],
  ], "HTTPS is web over TLS on TCP port 443.", "HTTPS — веб поверх TLS на порту TCP 443."),

  qx("Which pair of ports does DHCP use?", "67 and 68", [
    ["20 and 21", "20 and 21 are the FTP data and control ports.", "20 и 21 — порты данных и управления FTP."],
    ["53 and 54", "53 is DNS and 54 is not assigned to any service in the notes.", "53 — DNS, а 54 ни за какой службой в конспекте не закреплён."],
    ["80 and 443", "80 and 443 are HTTP and HTTPS.", "80 и 443 — HTTP и HTTPS."],
  ], "DHCP runs over UDP ports 67 and 68.", "DHCP работает по портам UDP 67 и 68."),

  qx("An admin needs secure remote CLI access to a switch. Which protocol and port should be used?", "SSH on TCP 22", [
    ["Telnet on TCP 23", "Telnet sends everything, including passwords, in plaintext, so it is not secure.", "Telnet передаёт всё, включая пароли, открытым текстом, поэтому небезопасен."],
    ["HTTP on TCP 80", "HTTP is for web pages and is unencrypted; it is not a CLI protocol.", "HTTP — для веб-страниц и без шифрования; это не протокол CLI."],
    ["SMTP on TCP 25", "SMTP sends email and gives no command-line access at all.", "SMTP отправляет почту и никакого доступа к командной строке не даёт."],
  ], "SSH on port 22 provides encrypted remote CLI access; Telnet on 23 is its insecure predecessor.", "SSH на порту 22 даёт зашифрованный удалённый CLI; Telnet на 23 — его небезопасный предшественник."),

  qx("How do SSH and Telnet differ?", "SSH is encrypted; Telnet sends plaintext", [
    ["SSH uses UDP; Telnet uses TCP", "Both SSH and Telnet run over TCP; the difference is encryption, not transport.", "И SSH, и Telnet работают по TCP; разница в шифровании, а не в транспорте."],
    ["SSH is for web; Telnet is for CLI", "Both provide remote command-line access; neither is a web protocol.", "Оба дают удалённый доступ к командной строке; ни один не веб-протокол."],
    ["SSH is port 23; Telnet is port 22", "The ports are swapped: SSH is 22 and Telnet is 23.", "Порты перепутаны: SSH — 22, Telnet — 23."],
  ], "SSH (22) is secure remote CLI; Telnet (23) does the same job but in plaintext.", "SSH (22) — защищённый удалённый CLI; Telnet (23) делает то же, но открытым текстом."),

  qx("Which set of features belongs to TCP?", "Acknowledgments, sequencing, retransmission, flow control", [
    ["Connectionless, best-effort delivery with very low overhead", "Connectionless, low-overhead delivery describes UDP, not TCP.", "Доставка без соединения и с малыми накладными — это UDP, а не TCP."],
    ["Name resolution and address assignment", "Those are DNS and DHCP application services, not transport features.", "Это прикладные службы DNS и DHCP, а не свойства транспорта."],
    ["Echo Request and Echo Reply messages", "Echo messages belong to ICMP, used by ping.", "Сообщения Echo принадлежат ICMP, их использует ping."],
  ], "TCP is connection-oriented and reliable: it acknowledges, sequences, retransmits and controls the flow.", "TCP — с установлением соединения и надёжный: подтверждает, нумерует, повторяет передачу и управляет потоком."),

  qx("Which statement describes UDP correctly?", "Connectionless, fast, delivery not guaranteed", [
    ["Connection-oriented with guaranteed reliable delivery", "Connection-oriented reliability is TCP's defining property.", "Надёжность с установлением соединения — определяющее свойство TCP."],
    ["Uses a three-way handshake", "Only TCP opens a connection with SYN, SYN-ACK, ACK; UDP has no handshake.", "Только TCP открывает соединение через SYN, SYN-ACK, ACK; у UDP рукопожатия нет."],
    ["Retransmits lost segments", "Retransmission requires acknowledgments, which UDP does not use.", "Повторная передача требует подтверждений, которых у UDP нет."],
  ], "UDP is connectionless and does not guarantee delivery, but it is fast with low overhead.", "UDP без установления соединения и доставку не гарантирует, зато быстрый и с малыми накладными."),

  qx("Which mechanism gives TCP its ordering of data?", "Sequence numbers", [
    ["Port numbers", "Port numbers identify the application, not the position of data in the stream.", "Номера портов определяют приложение, а не положение данных в потоке."],
    ["Checksums", "A checksum detects corruption; it says nothing about order.", "Контрольная сумма обнаруживает повреждение; о порядке она ничего не говорит."],
    ["Time-to-live values", "TTL is an IP header field that limits hops; it does not order segments.", "TTL — поле заголовка IP, ограничивающее число узлов; сегменты оно не упорядочивает."],
  ], "The TCP vs UDP table lists sequence numbers as the ordering mechanism of TCP; UDP has none.", "В таблице TCP и UDP порядок у TCP обеспечивают номера последовательности; у UDP их нет."),

  qx("What is the exact order of segments in the TCP three-way handshake?", "SYN, SYN-ACK, ACK", [
    ["SYN, ACK, SYN-ACK", "The server's combined SYN-ACK comes second, before the client's final ACK.", "Объединённый SYN-ACK сервера идёт вторым, перед финальным ACK клиента."],
    ["ACK, SYN, SYN-ACK", "A connection cannot begin with an ACK; there is nothing to acknowledge yet.", "Соединение не может начинаться с ACK; подтверждать ещё нечего."],
    ["SYN, SYN, ACK", "The second segment also carries ACK for the client's SYN; it is SYN-ACK, not a plain SYN.", "Второй сегмент несёт и ACK на SYN клиента; это SYN-ACK, а не просто SYN."],
  ], "The client sends SYN, the server replies SYN-ACK, the client finishes with ACK.", "Клиент шлёт SYN, сервер отвечает SYN-ACK, клиент завершает ACK."),

  qx("In the three-way handshake, who sends the SYN-ACK segment?", "The server, to the client", [
    ["The client, to the server", "The client sends SYN first and ACK last; SYN-ACK is the server's reply.", "Клиент шлёт SYN первым и ACK последним; SYN-ACK — ответ сервера."],
    ["Both sides at the same time", "The handshake is strictly sequential; SYN-ACK is the single middle step.", "Рукопожатие строго последовательное; SYN-ACK — единственный средний шаг."],
    ["The default gateway", "Routers forward the segments but do not take part in the handshake.", "Маршрутизаторы пересылают сегменты, но в рукопожатии не участвуют."],
  ], "Step 2 is SYN-ACK from the server to the client, answering the client's SYN.", "Шаг 2 — SYN-ACK от сервера клиенту в ответ на SYN клиента."),

  qx("Which segment completes the TCP handshake, and who sends it?", "ACK from the client", [
    ["ACK from the server", "The server's acknowledgment is already in the SYN-ACK; the final ACK is the client's.", "Подтверждение сервера уже содержится в SYN-ACK; финальный ACK — от клиента."],
    ["SYN from the client", "SYN opens the handshake as step 1; it does not finish it.", "SYN открывает рукопожатие как шаг 1; он его не завершает."],
    ["FIN from the client", "FIN closes an established connection; it is not part of opening one.", "FIN закрывает установленное соединение; к открытию он не относится."],
  ], "Step 3 is a plain ACK from client to server, after which the connection is open.", "Шаг 3 — обычный ACK от клиента серверу, после которого соединение открыто."),

  qx("Which messages does ping send and expect?", "ICMP Echo Request and Echo Reply", [
    ["TCP SYN and SYN-ACK", "SYN and SYN-ACK open a TCP connection; ping does not use TCP at all.", "SYN и SYN-ACK открывают соединение TCP; ping вовсе не использует TCP."],
    ["DNS query and response", "DNS resolves names; ping tests reachability of an address.", "DNS разрешает имена; ping проверяет доступность адреса."],
    ["ARP request broadcast and ARP reply", "ARP finds a MAC on the local segment; ping tests end-to-end reachability across networks.", "ARP ищет MAC в локальном сегменте; ping проверяет сквозную доступность через сети."],
  ], "ping tests end-to-end reachability with ICMP Echo Requests and waits for Echo Replies.", "ping проверяет сквозную доступность сообщениями ICMP Echo Request и ждёт Echo Reply."),

  qx("Which tool shows the path to a destination hop by hop?", "traceroute", [
    ["ping", "ping only reports whether the end host answers, not the routers in between.", "ping сообщает лишь, отвечает ли конечный хост, а не маршрутизаторы по пути."],
    ["nslookup", "nslookup queries DNS; it does not trace a path.", "nslookup опрашивает DNS; путь он не трассирует."],
    ["arp -a", "arp -a prints the local ARP cache, not a route.", "arp -a печатает локальный кэш ARP, а не маршрут."],
  ], "traceroute (tracert on Windows) lists each hop on the way to the destination.", "traceroute (tracert в Windows) перечисляет каждый узел на пути к назначению."),

  qx("At which OSI layer does a hub or repeater operate, and what does it do?", "Layer 1; it repeats bits", [
    ["Layer 2; it forwards frames by MAC", "Forwarding by MAC is what a switch does at Layer 2.", "Пересылка по MAC — работа коммутатора на уровне 2."],
    ["Layer 3; it routes by IP address", "Routing by IP is a router's job at Layer 3.", "Маршрутизация по IP — задача маршрутизатора на уровне 3."],
    ["Layer 4; it tracks TCP sessions", "No basic LAN device in the notes works at Layer 4.", "Ни одно базовое устройство LAN из конспекта не работает на уровне 4."],
  ], "A hub or repeater is a Layer 1 device that simply repeats bits.", "Концентратор или повторитель — устройство уровня 1, которое просто повторяет биты."),

  qx("Which device forwards frames based on MAC addresses?", "Switch", [
    ["Router", "A router decides by IP address at Layer 3, not by MAC.", "Маршрутизатор решает по IP-адресу на уровне 3, а не по MAC."],
    ["Hub", "A hub repeats bits to every port and does not read MAC addresses.", "Концентратор повторяет биты во все порты и MAC-адреса не читает."],
    ["Access point", "An access point bridges wireless clients to the wired LAN; MAC forwarding is the switch's defining role.", "Точка доступа подключает беспроводных клиентов к проводной LAN; пересылка по MAC — определяющая роль коммутатора."],
  ], "A switch is a Layer 2 device that forwards frames by MAC address.", "Коммутатор — устройство уровня 2, пересылающее кадры по MAC-адресу."),

  qx("Which device connects different logical networks and decides by IP address?", "Router", [
    ["Switch", "A switch works within one network at Layer 2 using MACs.", "Коммутатор работает внутри одной сети на уровне 2 по MAC."],
    ["Repeater", "A repeater is Layer 1 and only regenerates bits.", "Повторитель — уровень 1, он лишь восстанавливает биты."],
    ["Access point", "An access point attaches wireless clients to a LAN; it does not route between networks.", "Точка доступа подключает беспроводных клиентов к LAN; между сетями она не маршрутизирует."],
  ], "A router is a Layer 3 device that connects logical networks and forwards by IP address.", "Маршрутизатор — устройство уровня 3, соединяющее логические сети и пересылающее по IP-адресу."),

  qx("What is the role of a wireless access point?", "Connects wireless clients to the wired LAN", [
    ["Routes packets between different IP networks", "Routing between networks is a router's Layer 3 function.", "Маршрутизация между сетями — функция маршрутизатора на уровне 3."],
    ["Translates private addresses to public", "That is NAT, performed on a router.", "Это NAT, который выполняет маршрутизатор."],
    ["Repeats bits to every wired port", "Repeating bits to all ports is a hub.", "Повторение битов во все порты — концентратор."],
  ], "An access point bridges Wi-Fi clients onto the wired LAN.", "Точка доступа подключает Wi-Fi-клиентов к проводной LAN."),

  qx("According to the service table, which transport does DNS primarily use?", "UDP, with TCP also possible", [
    ["TCP only", "The table lists DNS as UDP (TCP): UDP first, TCP only as an alternative.", "В таблице DNS указан как UDP (TCP): UDP — основной, TCP — лишь альтернатива."],
    ["ICMP", "ICMP is used by ping, not by DNS.", "ICMP использует ping, а не DNS."],
    ["Neither — it runs directly on IP", "DNS is an application protocol and always needs a transport layer.", "DNS — прикладной протокол, транспортный уровень ему нужен всегда."],
  ], "DNS is listed as UDP (TCP) on port 53: UDP is the main transport, TCP a fallback.", "DNS указан как UDP (TCP) на порту 53: UDP — основной транспорт, TCP — запасной."),

  qx("Which group of applications uses UDP according to the comparison table?", "DNS, video, voice, DHCP", [
    ["Web, email, file transfer", "These are the TCP users: HTTP, SMTP and FTP all need reliable delivery.", "Это пользователи TCP: HTTP, SMTP и FTP нуждаются в надёжной доставке."],
    ["SSH, Telnet, HTTPS", "All three are TCP services on ports 22, 23 and 443.", "Все три — службы TCP на портах 22, 23 и 443."],
    ["FTP, SMTP, DNS", "FTP and SMTP are TCP; only DNS from this list is a UDP user.", "FTP и SMTP — TCP; из этого списка UDP использует только DNS."],
  ], "Latency-sensitive or simple request-reply traffic — DNS, video, voice, DHCP — uses UDP.", "Чувствительный к задержке или простой трафик «запрос — ответ» — DNS, видео, голос, DHCP — использует UDP."),

  qx("Which group of applications uses TCP according to the comparison table?", "Web, email, file transfer", [
    ["DNS, video, voice", "These are listed under UDP: speed matters more than guaranteed delivery.", "Они перечислены под UDP: скорость важнее гарантированной доставки."],
    ["DHCP, voice, DNS", "All three are UDP users in the table.", "Все три в таблице — пользователи UDP."],
    ["Video, DHCP, file transfer", "File transfer is TCP, but video and DHCP are UDP, so the group is wrong.", "Передача файлов — TCP, но видео и DHCP — UDP, поэтому группа составлена неверно."],
  ], "Web (HTTP/HTTPS), email (SMTP) and file transfer (FTP) need reliable, ordered delivery, so they use TCP.", "Веб (HTTP/HTTPS), почта (SMTP) и передача файлов (FTP) требуют надёжной упорядоченной доставки, поэтому используют TCP."),

  qx("Compared with UDP, how does TCP rate on speed and overhead?", "Slower, with bigger headers", [
    ["Faster, with smaller headers", "Fast and small describes UDP; TCP pays for reliability with larger headers.", "Быстро и мало — это UDP; TCP платит за надёжность более крупными заголовками."],
    ["The same speed and header size", "The table explicitly contrasts them: TCP slower and bigger, UDP fast and small.", "Таблица прямо их противопоставляет: TCP медленнее и больше, UDP быстро и мало."],
    ["Faster, but with bigger headers", "TCP's larger headers and handshake make it slower, not faster.", "Крупные заголовки и рукопожатие делают TCP медленнее, а не быстрее."],
  ], "The table rates TCP as slower with bigger headers and UDP as fast with small overhead.", "В таблице TCP — медленнее и с большими заголовками, UDP — быстро и с малыми накладными."),

  tfx("UDP guarantees delivery by using acknowledgments and retransmission.", false,
    "UDP is connectionless and has no acknowledgments or retransmission; it does not guarantee delivery.",
    "UDP без установления соединения, без подтверждений и повторной передачи; доставку он не гарантирует.",
    "Answering True attributes TCP's reliability mechanisms to UDP, whose whole point is to skip them for speed.",
    "Ответ «верно» приписывает UDP механизмы надёжности TCP, тогда как смысл UDP — обойтись без них ради скорости."),

  tfx("HTTPS is HTTP carried over TLS and uses port 443.", true,
    "The service table defines HTTPS as web over TLS on TCP port 443.",
    "В таблице служб HTTPS определён как веб поверх TLS на порту TCP 443.",
    "Answering False would mean confusing HTTPS with plain HTTP on port 80.",
    "Ответ «неверно» означал бы путаницу HTTPS с обычным HTTP на порту 80."),
];
