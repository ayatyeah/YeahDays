# Computer Networks — вопросы с разбором

Это доступный тематический отбор, а не гарантия вопросов экзамена. Карточки с оговорками сохранены для чтения; автоматические тесты используют только допустимые карточки.

### E029. Which device performs the function of determining the path that messages should take through internetworks?

Источник: модули_01, Q9; тесты_exam_0, Q31. Тема: модуль 8.

1. A router
2. A firewall
3. A web server
4. A DSL modem

**Ответ:** A router.

**Объяснение:** Router выбирает следующий переход по IP назначения и таблице маршрутизации, поэтому определяет путь между сетями. Firewall прежде всего разрешает/блокирует трафик, web server обслуживает HTTP-запросы, DSL modem обеспечивает доступ по линии. Совмещённое устройство может выполнять несколько ролей, но спрашивается именно роль маршрутизатора.

**Explanation in English:** A router selects a next hop from the destination IP and routing table, so it determines paths between networks. A firewall primarily filters traffic, a web server serves HTTP, and a DSL modem provides line access. A combined appliance may perform several roles, but routing is the role asked about.

### E066. BGP and OSPF are examples of which type of protocol?

Источник: модули_03, Q1. Тема: модуль 8.

1. Network communication
2. Network security
3. Routing
4. Service discovery

**Ответ:** Routing.

**Объяснение:** BGP и OSPF обмениваются информацией о достижимости сетей и помогают строить таблицы маршрутизации. Поэтому это routing protocols. Они не являются протоколами обнаружения служб вроде DNS/DHCP и не предназначены прежде всего для шифрования или фильтрации.

**Explanation in English:** BGP and OSPF exchange network reachability information and help construct routing tables, making them routing protocols. They are not service-discovery protocols such as DNS/DHCP and their primary job is not encryption or filtering.

### E078. This standards organization is responsible for IP address allocation and domain name management.

Источник: модули_03, Q3. Тема: модуль 8.

1. Internet Society (ISOC)
2. Internet Engineering Task Force (IETF)
3. Internet Architecture Board (IAB)
4. Internet Assigned Numbers Authority (IANA)

**Ответ:** Internet Assigned Numbers Authority (IANA).

**Объяснение:** IANA координирует глобальные IP-ресурсы, параметры протоколов и корневую DNS-зону. Региональные адресные блоки затем распределяют RIR. IETF разрабатывает стандарты, IAB обеспечивает архитектурный надзор, ISOC поддерживает развитие Интернета — это другие роли.

**Explanation in English:** IANA coordinates global IP resources, protocol parameters and the DNS root zone; RIRs distribute regional address blocks. IETF develops standards, IAB provides architectural oversight and ISOC supports Internet development. Those are different functions.

### E085. True or false? The right-most part of an IP address is used to identify the network that a device belongs to.

Источник: модули_03, Q2. Тема: модуль 8.

1. True
2. False

**Ответ:** False.

**Объяснение:** False: сеть определяется левыми, старшими битами — префиксом, длина которого задаётся маской. Правые оставшиеся биты идентифицируют узел/интерфейс в этой сети. Например, в 192.168.1.10/24 сеть 192.168.1.0, а последние 8 бит относятся к хосту.

**Explanation in English:** False: the leftmost, high-order prefix bits identify the network; the mask specifies their length. Remaining rightmost bits identify the host/interface within it. For 192.168.1.10/24 the network is 192.168.1.0 and the final eight bits form the host portion.

### E087. Which of the following statements are true regarding network layer and data link layer addresses? (Choose three.)

Источник: модули_03, Q4. Тема: модуль 8.

1. Data link layer addresses are logical and network layer addresses are physical.
2. Network layer addresses are expressed as 12 hexadecimal digits and data link layer addresses are decimal.
3. Network layer addresses are logical and data link addresses are expressed as 12 hexadecimal digits.
4. Data link layer addresses are physical and network layer addresses are logical.
5. Network layer addresses are either 32 or 128 bits in length.
6. Data link layer addresses are 32 bits in length.

**Ответ:** Network layer addresses are logical and data link addresses are expressed as 12 hexadecimal digits.; Data link layer addresses are physical and network layer addresses are logical.; Network layer addresses are either 32 or 128 bits in length..

**Объяснение:** Верны утверждения о логических IP-адресах, 12 hex-цифрах Ethernet MAC и длинах IP 32/128 бит. Один hex-символ кодирует 4 бита: 12 × 4 = 48 бит MAC. Поэтому варианты, меняющие местами logical/physical, приписывающие IP длину 12 hex или MAC длину 32 бита, неверны. Здесь речь об обычном Ethernet.

**Explanation in English:** The true statements identify IP addresses as logical, Ethernet MAC addresses as 12 hex digits, and IP addresses as 32 or 128 bits. Each hex digit encodes four bits, so 12 × 4 = 48 MAC bits. Options reversing logical/physical or assigning 12 hex digits to IP or 32 bits to MAC are wrong in this Ethernet context.

### E096. Which logical address is used for delivery of data to a remote network?

Источник: модули_03, Q7. Тема: модуль 8.

1. Destination MAC address
2. Destination IP address
3. Destination port number
4. Source MAC address
5. Source IP address

**Ответ:** Destination IP address.

**Объяснение:** Destination IP задаёт конечного получателя и позволяет каждому роутеру выбрать сеть назначения. Destination MAC действует только на текущем канале, а destination port выбирает приложение уже на узле. Source-адреса показывают отправителя, а не куда доставлять пакет.

**Explanation in English:** The destination IP identifies the final receiver and lets each router choose a destination network. The destination MAC applies only to the current link, while the destination port selects an application on the host. Source addresses identify the sender, not the forwarding destination.

### E129. Which is the binary equivalent to the 192.168.11.10 IP address?

Источник: модули_05, Q1. Тема: модуль 8.

1. 11000000‬.11000000.00001011‬.‭00001010‬‬
2. 11000000.10101000‬.00001011‬.‭00001010
3. 11000000.10101000‬.00001010‬.‭00001011‬‬
4. 11000000.10101000‬.00001011‬.‭00010010‬‬

**Ответ:** 11000000.10101000‬.00001011‬.‭00001010.

**Объяснение:** Преобразуем каждый октет: 192 = 128+64 → 11000000; 168 = 128+32+8 → 10101000; 11 = 8+2+1 → 00001011; 10 = 8+2 → 00001010. Получается 11000000.10101000.00001011.00001010. Другие варианты подменяют 168 на 192, меняют местами 11 и 10 или записывают 18 вместо 10.

**Explanation in English:** Convert each octet: 192 = 128+64 → 11000000; 168 = 128+32+8 → 10101000; 11 = 8+2+1 → 00001011; 10 = 8+2 → 00001010. Thus 11000000.10101000.00001011.00001010 is correct. Other choices replace 168 with 192, swap 11 and 10, or encode 18 instead of 10.

### E130. Which of the following is the binary equivalent to the 172.16.31.30 IP address?

Источник: модули_05, Q2. Тема: модуль 8.

1. 11000000.00010000‬.00011111‬.‭00011110‬‬
2. 10101000.00010000‬.00011111‬.‭00011110‬‬
3. 10101100.00010000‬.00011110‬.‭00011110‬‬
4. 10101100.00010000‬.00011111‬.‭00011110‬‬

**Ответ:** 10101100.00010000‬.00011111‬.‭00011110‬‬.

**Объяснение:** 172 = 128+32+8+4 → 10101100; 16 → 00010000; 31 = 16+8+4+2+1 → 00011111; 30 = 16+8+4+2 → 00011110. Ответ 10101100.00010000.00011111.00011110. В остальных ответах первый октет равен 192/168 либо третий равен 30 вместо 31.

**Explanation in English:** 172 = 128+32+8+4 → 10101100; 16 → 00010000; 31 = 16+8+4+2+1 → 00011111; 30 = 16+8+4+2 → 00011110. The result is 10101100.00010000.00011111.00011110. Other answers encode 192/168 in the first octet or 30 instead of 31 in the third.

### E162. Which lists the Layer 2 and Layer 3 address fields in the correct order?

Источник: модули_06, Q3. Тема: модуль 8.

1. Destination NIC address, source NIC address, source IP address, destination IP address
2. Source NIC address, destination NIC address, source IP address, destination IP address
3. Destination NIC address, source NIC address, destination IP address, source IP address
4. Source NIC address, destination NIC address, destination IP address, source IP address

**Ответ:** Destination NIC address, source NIC address, source IP address, destination IP address.

**Объяснение:** В Ethernet-заголовке destination MAC записан перед source MAC. В следующем IP-заголовке source IP расположен перед destination IP. Поэтому общий порядок: destination NIC, source NIC, source IP, destination IP. Нельзя переносить один и тот же порядок source/destination на оба заголовка.

**Explanation in English:** The Ethernet header places destination MAC before source MAC. The enclosed IP header places source IP before destination IP. Therefore the order is destination NIC, source NIC, source IP, destination IP. The source/destination order is not identical in the two headers.

### E196. What type of address is 01-00-5E-0A-00-02?

Источник: модули_07, Q11. Тема: модуль 8.

1. An address that reaches every host inside a local subnet
2. An address that reaches one specific host
3. An address that reaches every host in the network
4. An address that reaches a specific group of hosts

**Ответ:** An address that reaches a specific group of hosts.

**Объяснение:** Префикс 01:00:5E используется для отображения IPv4 multicast в Ethernet. Поэтому 01-00-5E-0A-00-02 адресует определённую группу. Unicast выбирал бы один узел, а broadcast FF:FF:FF:FF:FF:FF — все узлы локального широковещательного домена.

**Explanation in English:** The 01:00:5E prefix maps IPv4 multicast to Ethernet, so 01-00-5E-0A-00-02 targets a particular group. Unicast targets one node; broadcast FF:FF:FF:FF:FF:FF targets every node in the local broadcast domain.

### E200. Which OSI layer sends segments to be encapsulated in an IPv4 or IPv6 packet?

Источник: модули_08, Q1. Тема: модуль 8.

1. Data link layer
2. Network layer
3. Transport layer
4. Session layer

**Ответ:** Transport layer.

**Объяснение:** Сегменты создаёт транспортный уровень (например TCP) и передаёт их сетевому, где добавляется IPv4/IPv6-заголовок. Вопрос спрашивает, кто передаёт сегмент, поэтому Transport layer. Network layer создаёт пакет, Data link layer — кадр, Session layer управляет диалогом.

**Explanation in English:** The transport layer, such as TCP, produces segments and hands them to the network layer for an IPv4/IPv6 header. The question asks who supplies the segment, so Transport layer is correct. The network layer creates packets, data link creates frames, and session manages dialogs.

### E201. Which layer is responsible for taking an IP packet and preparing it for transmission over the communications medium?

Источник: модули_08, Q2. Тема: модуль 8.

1. Physical layer
2. Network layer
3. Data link layer
4. Transport layer

**Ответ:** Data link layer.

**Объяснение:** Data link layer принимает готовый IP-пакет и заключает его в кадр с правилами конкретного канала. Physical layer затем передаёт биты сигналами; он не выполняет это оформление пакета в кадр. Network layer создаёт IP-пакет, Transport layer работает с сегментами.

**Explanation in English:** The data link layer takes an IP packet and encapsulates it in a frame appropriate to the link. The physical layer then transmits bits as signals rather than performing this packet-to-frame encapsulation. Network creates IP packets; transport handles segments.

### E202. What is the term for splitting up an IP packet when forwarding it from one medium to another medium with a smaller MTU?

Источник: модули_08, Q3. Тема: модуль 8.

1. Encapsulation
2. Fragmentation
3. Segmentation
4. Serialization

**Ответ:** Fragmentation.

**Объяснение:** Разбиение уже существующего IP-пакета под меньший MTU называется fragmentation. Segmentation происходит уровнем выше, при подготовке транспортных данных; encapsulation добавляет оболочку, serialization передаёт данные последовательно. IPv4-роутер может фрагментировать при DF=0; IPv6-роутер вместо этого возвращает Packet Too Big.

**Explanation in English:** Splitting an existing IP packet to fit a smaller MTU is fragmentation. Segmentation happens at transport; encapsulation adds a wrapper; serialization sends data sequentially. An IPv4 router may fragment when DF=0; an IPv6 router instead returns Packet Too Big.

### E203. Which delivery method does not guarantee that the packet will be delivered fully without errors?

Источник: модули_08, Q4. Тема: модуль 8.

1. Connectionless
2. Best effort
3. Media independent

**Ответ:** Best effort.

**Объяснение:** Best effort означает отсутствие гарантии успешной и безошибочной доставки: IP не выполняет подтверждение и восстановление потерь. Connectionless отвечает на другой вопрос — устанавливается ли соединение заранее. Media independent означает независимость от среды, а не надёжность.

**Explanation in English:** Best effort means no guarantee of successful, error-free delivery: IP supplies no acknowledgment/recovery service. Connectionless answers a different question—whether a connection is established first. Media independent concerns the transmission medium, not reliability.

### E204. What are the two most commonly referenced fields in an IPv4 packet header that indicate where the packet is coming from and where it is going? (Choose two.)

Источник: модули_08, Q1. Тема: модуль 8.

1. Destination IP address
2. Protocol
3. Time to Live
4. Source IP address
5. Differentiated Services (DS)

**Ответ:** Destination IP address; Source IP address.

**Объяснение:** Source IP сообщает, откуда пришёл пакет, Destination IP — куда он направлен. Protocol обозначает тип вложенного протокола, TTL ограничивает переходы, DS обозначает обработку/приоритет. Эти три поля не идентифицируют пару конечных узлов.

**Explanation in English:** Source IP says where the packet originates and Destination IP where it is going. Protocol identifies the encapsulated protocol, TTL limits hops, and DS describes traffic treatment/priority. Those fields do not identify the endpoint pair.

### E205. Which statement is correct about IPv4 packet header fields?

Источник: модули_08, Q2. Тема: модуль 8.

1. The source and destination IPv4 addresses remain the same while travelling from source to destination.
2. The Time to Live field is used to determine the priority of each packet.
3. The Total Length and Header Checksum fields are used to reorder a fragmented packet.
4. The Version field identifies the next level protocol.

**Ответ:** The source and destination IPv4 addresses remain the same while travelling from source to destination..

**Объяснение:** В обычной маршрутизации без NAT source/destination IPv4 сохраняются между конечными узлами. TTL ограничивает переходы, а не приоритет. Для сборки фрагментов нужны Identification и Fragment Offset, а не checksum/total length. Version означает IPv4/IPv6; вложенный протокол задаёт Protocol.

**Explanation in English:** With ordinary routing and no NAT, source/destination IPv4 addresses remain the endpoint addresses. TTL limits hops, not priority. Fragment reassembly uses Identification and Fragment Offset, not checksum/total length. Version means IPv4/IPv6; Protocol identifies the encapsulated protocol.

### E206. Which field is used to detect corruption in the IPv4 header?

Источник: модули_08, Q3. Тема: модуль 8.

1. Header Checksum
2. Time to Live
3. Protocol
4. Differentiated Services (DS)

**Ответ:** Header Checksum.

**Объяснение:** Header Checksum вычисляется по IPv4-заголовку и позволяет обнаружить его повреждение. Он не защищает всю полезную нагрузку. TTL — счётчик переходов, Protocol — тип вложенных данных, DS — обработка трафика; ни один из них не служит контрольной суммой.

**Explanation in English:** Header Checksum is computed over the IPv4 header and detects corruption there, not across the whole payload. TTL counts hops, Protocol identifies the payload protocol, and DS indicates traffic treatment; none is a checksum.

### E207. Which field includes common values such as ICMP (1), TCP (6), and UDP (17)?

Источник: модули_08, Q4. Тема: модуль 8.

1. Header Checksum
2. Time to Live
3. Protocol
4. Differentiated Services (DS)

**Ответ:** Protocol.

**Объяснение:** Значения 1, 6 и 17 в поле Protocol обозначают ICMP, TCP и UDP, чтобы получатель передал полезную нагрузку нужному обработчику. Checksum проверяет заголовок, TTL ограничивает путь, DS задаёт обработку трафика — эти поля не выбирают протокол.

**Explanation in English:** Protocol values 1, 6 and 17 identify ICMP, TCP and UDP so the receiver dispatches the payload to the correct handler. Checksum checks the header, TTL bounds the path and DS controls traffic treatment; they do not select a protocol.

### E208. Which three options are major issues associated with IPv4? (Choose three.)

Источник: модули_08, Q1. Тема: модуль 8.

1. IP address depletion
2. Increased network complexity and Internet routing table expansion
3. Connections always active
4. Lack of end-to-end connectivity
5. Global and political boundaries
6. Too many IPv4 addresses available

**Ответ:** IP address depletion; Increased network complexity and Internet routing table expansion; Lack of end-to-end connectivity.

**Объяснение:** IPv4 имеет ограниченное 32-битное пространство, поэтому возникают depletion, рост сложности/таблиц и потеря прямой end-to-end связности из-за широкого применения NAT. IP не держит соединения всегда открытыми. Политические границы не являются свойством формата IPv4, а «слишком много адресов» противоположно реальной проблеме.

**Explanation in English:** IPv4 has a finite 32-bit space, leading to depletion, complexity/routing-table growth and reduced direct end-to-end connectivity from widespread NAT. IP does not keep connections always active. Political borders are not an IPv4 format limitation, and too many addresses is the opposite of the actual problem.

### E209. Which two options are improvements provided by IPv6 as compared to IPv4? (Choose two.)

Источник: модули_08, Q2. Тема: модуль 8.

1. Header supports additional fields for complex packets
2. Increased the IP address space
3. Standardizes the use of NAT
4. Supports class-based networks
5. Uses a simpler header to provide improved packet handling

**Ответ:** Increased the IP address space; Uses a simpler header to provide improved packet handling.

**Объяснение:** IPv6 увеличивает адрес с 32 до 128 бит и использует упрощённый фиксированный основной заголовок, облегчая обработку. Усложнение заголовка и классовая адресация не являются улучшениями IPv6; большой запас адресов уменьшает необходимость NAT ради их экономии, а не стандартизует его обязательное применение.

**Explanation in English:** IPv6 expands addresses from 32 to 128 bits and uses a simpler fixed base header for easier processing. More complex headers and class-based addressing are not IPv6 improvements; the larger space reduces address-conservation pressure for NAT rather than making NAT mandatory.

### E210. Which is true of the IPv6 header?

Источник: модули_08, Q3. Тема: модуль 8.

1. It consists of 20 octets.
2. It consists of 40 octets.
3. It contains 8 header fields.
4. It contains 12 header fields.

**Ответ:** It consists of 40 octets.; It contains 8 header fields..

**Объяснение:** У базового IPv6-заголовка два верных свойства: 40 байт и 8 полей — Version, Traffic Class, Flow Label, Payload Length, Next Header, Hop Limit, Source и Destination. 20 байт — минимальный IPv4-заголовок. Extension headers учитываются отдельно. В формулировке пропущено Choose two, но верны именно два варианта.

**Explanation in English:** The IPv6 base header has two correct properties: 40 bytes and eight fields—Version, Traffic Class, Flow Label, Payload Length, Next Header, Hop Limit, Source and Destination. Twenty bytes is the minimum IPv4 header. Extension headers are additional. The prompt omits “Choose two”, but two options are correct.

### E211. Which is true of the IPv6 packet header?

Источник: модули_08, Q4. Тема: модуль 8.

1. The Hop Limit field replaces the IPv4 Time to Live field.
2. The Source and Destination IPv6 addresses change while travelling from source to destination.
3. The Time to Live field replaces the DiffServ field.
4. The Version field identifies the next header.

**Ответ:** The Hop Limit field replaces the IPv4 Time to Live field..

**Объяснение:** Hop Limit выполняет в IPv6 роль ограничения переходов, которую в IPv4 выполняет TTL. Source/destination адреса обычно не меняются на каждом роутере. Version определяет версию IP, а Next Header — следующий заголовок; Traffic Class соответствует обработке трафика, а не TTL.

**Explanation in English:** Hop Limit performs IPv6 hop limiting, replacing IPv4 TTL. Source/destination addresses normally do not change at every router. Version identifies the IP version; Next Header identifies the following header. Traffic Class, not TTL, handles traffic classification.

### E212. Which statement about host forwarding decisions is true?

Источник: модули_08, Q1. Тема: модуль 8.

1. A host cannot ping itself.
2. A remote destination host is on the same local network as the sending host.
3. Local hosts can reach each other without the need of a router.
4. Routing is enabled on switches to discover the best path to a destination.

**Ответ:** Local hosts can reach each other without the need of a router..

**Объяснение:** Узлы одной IP-подсети передают кадры друг другу непосредственно через локальный канал/коммутатор, без маршрутизатора. Remote host по определению находится в другой сети. Хост может ping свой loopback. Обычному L2-switch не требуется включать IP routing для пересылки кадров.

**Explanation in English:** Hosts in the same IP subnet exchange frames directly over the local link/switch, without a router. A remote host is on another network by definition. A host can ping its loopback. A normal Layer 2 switch does not enable IP routing to forward frames.

### E213. Which default gateway statement is true?

Источник: модули_08, Q2. Тема: модуль 8.

1. A default gateway is required to send packets to other hosts on the local network.
2. The default gateway address is the IP address of a switch on a remote network.
3. The default gateway address is the IP address of the router on the local network.
4. Traffic can only be forwarded outside the local network if there is no default gateway.

**Ответ:** The default gateway address is the IP address of the router on the local network..

**Объяснение:** Default gateway обычно является IP локального интерфейса роутера в той же подсети, что и хост. Его можно достичь по локальному каналу, а он знает дальнейший путь. Для соседа в той же подсети gateway не нужен; удалённый L2-switch не может быть обычным локальным шлюзом.

**Explanation in English:** The default gateway is normally the local router-interface IP in the host’s subnet. The host can reach it directly and the router forwards beyond the subnet. Same-subnet neighbors need no gateway; a remote Layer 2 switch is not the normal local gateway.

### E214. Which two commands could be entered on a Windows host to view its IPv4 and IPv6 routing table? (Choose two.)

Источник: модули_08, Q3. Тема: модуль 8.

1. netroute -l
2. netstat -r
3. print route
4. route print
5. print net

**Ответ:** netstat -r; route print.

**Объяснение:** В Windows route print и netstat -r выводят таблицы маршрутов IPv4/IPv6. У route порядок слов именно route print. Остальные варианты print route, print net и netroute -l не являются правильным синтаксисом этих штатных команд.

**Explanation in English:** On Windows, route print and netstat -r display IPv4/IPv6 routing tables. The word order is specifically route print. The other proposed commands—print route, print net and netroute -l—are not the correct built-in syntax.

### E215. What is the command used on a Cisco IOS router to view the routing table?

Источник: модули_08, Q1. Тема: модуль 8.

1. netstart -r
2. route print
3. show ip route
4. show routing table

**Ответ:** show ip route.

**Объяснение:** В Cisco IOS IPv4-таблицу маршрутизации показывает show ip route из EXEC. route print и netstat -r относятся к Windows, причём netstart в варианте ещё и опечатка. show routing table не является требуемой IOS-командой этого курса.

**Explanation in English:** Cisco IOS displays the IPv4 routing table with show ip route in EXEC mode. route print and netstat -r are Windows commands; the proposed netstart is also misspelled. show routing table is not the IOS command taught here.

### E216. What does a code of “O” indicate next to a route in the routing table?

Источник: модули_08, Q2. Тема: модуль 8.

1. A directly connected route
2. A route with an administrative distance of 0
3. A gateway of last resort
4. A route learned dynamically from OSPF

**Ответ:** A route learned dynamically from OSPF.

**Объяснение:** Буква O обозначает маршрут, изученный OSPF. Для directly connected используется C; local — L; static — S. Код O — буква названия протокола, а не цифра 0 и не значение administrative distance. Default route определяется префиксом /0, а не буквой O.

**Explanation in English:** O marks a route learned through OSPF. C means connected, L local and S static. O is a protocol letter, not the digit zero or an administrative distance. A default route is recognized by its /0 prefix, not the letter O.

### E217. This type of route is also known as a gateway of last resort.

Источник: модули_08, Q3. Тема: модуль 8.

1. Static route
2. Remote route
3. Default route
4. Directly connected route

**Ответ:** Default route.

**Объяснение:** Default route применяется, когда не найден более специфичный подходящий маршрут, поэтому это gateway of last resort. IPv4-префикс 0.0.0.0/0 совпадает с любым адресом, но имеет наименьшую специфичность. Static означает способ настройки: статический маршрут может быть default, но не обязан.

**Explanation in English:** A default route is used when no more specific matching route exists, hence gateway of last resort. IPv4 prefix 0.0.0.0/0 matches every address but is least specific. Static describes how a route is configured; a static route may be default but need not be.

### E218. Which is a characteristic of static routes?

Источник: модули_08, Q4. Тема: модуль 8.

1. They are manually configured.
2. They are advertised to directly connected neighbors.
3. They are appropriate when there are many redundant links.
4. They automatically adjust to a change in network topology.

**Ответ:** They are manually configured..

**Объяснение:** Static route вручную задаёт администратор, указывая сеть и next hop/выходной интерфейс. Сам по себе он не обучается соседями, не рассылается им и не пересчитывает альтернативу после изменения топологии; для этого нужны дополнительные настройки или dynamic routing. Поэтому большое количество меняющихся резервных путей не его главное преимущество.

**Explanation in English:** An administrator manually configures a static route with a network and next hop/exit interface. By itself it is neither learned from nor advertised to neighbors and does not calculate alternatives after topology changes; additional configuration or dynamic routing is needed. Many changing redundant paths are therefore not its main advantage.

### E219. True or False? A router can be configured with a combination of both static routes and a dynamic routing protocol.

Источник: модули_08, Q5. Тема: модуль 8.

1. True
2. False

**Ответ:** True.

**Объяснение:** True: один роутер может одновременно иметь connected, static и learned dynamic routes. Например, default route задают вручную, а внутренние подсети изучают через OSPF. Эти способы заполнения таблицы совместимы; при конкуренции маршрутов применяются правила выбора маршрута.

**Explanation in English:** True: a router can simultaneously have connected, static and dynamically learned routes. For example, a default route may be configured manually while internal networks are learned with OSPF. These ways of populating a routing table are compatible; route-selection rules resolve competing entries.

### E220. Which command can be used on a Windows host to display the routing table?

Источник: модули_08, Q1. Тема: модуль 8.

1. netstat -s
2. show ip route
3. netstat -r
4. tracert

**Ответ:** netstat -r.

**Объяснение:** Флаг -r у netstat означает вывод routing table. netstat -s показывает статистику протоколов, tracert исследует переходы до выбранной цели, а show ip route — команда Cisco IOS, не Windows.

**Explanation in English:** The -r flag makes netstat display the routing table. netstat -s displays protocol statistics, tracert probes hops to one destination, and show ip route belongs to Cisco IOS rather than Windows.

### E221. What information is added during encapsulation at OSI Layer 3?

Источник: модули_08, Q2. Тема: модуль 8.

1. Source and destination MAC
2. Source and destination application protocol
3. Source and destination port number
4. Source and destination IP address

**Ответ:** Source and destination IP address.

**Объяснение:** Layer 3 добавляет IP-заголовок, содержащий source и destination IP. MAC-адреса появятся при оформлении кадра на Layer 2; номера портов принадлежат TCP/UDP на Layer 4. Поэтому из перечисленного именно IP-адреса являются добавлением сетевого уровня.

**Explanation in English:** Layer 3 adds an IP header containing source and destination IP addresses. MAC addresses are added by Layer 2 framing; port numbers belong to TCP/UDP at Layer 4. Therefore IP addresses are the network-layer addition listed.

### E222. How does the network layer use the MTU value?

Источник: модули_08, Q3. Тема: модуль 8.

1. The network layer depends on the higher level layers to determine the MTU.
2. The network layer depends on the data link layer to set the MTU, and adjusts the speed of transmission to accommodate it.
3. The MTU is passed to the network layer by the data link layer.
4. To increase speed of delivery, the network layer ignores the MTU.

**Ответ:** The MTU is passed to the network layer by the data link layer.

**Объяснение:** Канальный уровень сообщает сетевому допустимый MTU, чтобы IP-пакет помещался в кадр данного канала. Это ограничение размера, а не скорости передачи: IP не замедляет линию ради слишком большого пакета. Игнорировать MTU нельзя; его источник здесь нижний канальный, а не верхние уровни.

**Explanation in English:** The data link layer passes its MTU to the network layer so an IP packet fits the link’s frame capacity. This is packet size, not transmission speed: IP does not slow the line to accommodate an oversized packet. It cannot ignore MTU, which comes from the lower data link layer, not higher layers.

### E223. Which characteristic describes an IPv6 enhancement over IPv4?

Источник: модули_08, Q4. Тема: модуль 8.

1. IPv6 addresses are based on 128-bit flat addressing as opposed to IPv4 which is based on 32-bit hierarchical addressing.
2. The IPv6 header is simpler than the IPv4 header is, which improves packet handling.
3. Both IPv4 and IPv6 support authentication, but only IPv6 supports privacy capabilities.
4. The IPv6 address space is four times bigger than the IPv4 address space.

**Ответ:** The IPv6 header is simpler than the IPv4 header is, which improves packet handling..

**Объяснение:** IPv6 имеет упрощённый основной заголовок с фиксированными 40 байтами, поэтому правильный вариант — improved packet handling. IPv6-адреса тоже иерархические. 128 бит в четыре раза длиннее 32 бит, но число адресов больше в 2^96 раз, а не в четыре. Шифрование/IPsec возможно и для IPv4, поэтому privacy не исключительно IPv6.

**Explanation in English:** IPv6 uses a simplified fixed 40-byte base header, making improved packet handling the right choice. IPv6 addressing is also hierarchical. 128 bits is four times the bit length of 32, but the address count is 2^96 times larger, not four times. Encryption/IPsec is also available for IPv4, so privacy is not IPv6-only.

### E224. Which statement accurately describes a characteristic of IPv4?

Источник: модули_08, Q5. Тема: модуль 8.

1. All IPv4 addresses are assignable to hosts.
2. IPv4 has a 32-bit address space.
3. An IPv4 header has fewer fields than an IPv6 header has.
4. IPv4 natively supports IPsec.

**Ответ:** IPv4 has a 32-bit address space..

**Объяснение:** IPv4-адрес содержит ровно 32 бита, обычно четыре восьмибитных октета. Не все значения назначаются обычным хостам: есть network/broadcast и специальные диапазоны. У IPv4 заголовок сложнее базового IPv6, а наличие IPsec не является отличительным свойством 32-битного формата.

**Explanation in English:** An IPv4 address contains exactly 32 bits, usually written as four eight-bit octets. Not every value is assignable to ordinary hosts: network/broadcast and special-use ranges exist. IPv4 has a more complex header than the IPv6 base header; IPsec availability is not the defining property of its 32-bit format.

### E225. When a router receives a packet, what information must be examined in order for the packet to be forwarded to a remote destination?

Источник: модули_08, Q6. Тема: модуль 8.

1. Destination MAC address
2. Source IP address
3. Destination IP address
4. Source MAC address

**Ответ:** Destination IP address.

**Объяснение:** Роутер сопоставляет destination IP с префиксами routing table и выбирает маршрут к удалённой сети. Source IP обозначает отправителя. MAC-адреса нужны для входного/выходного канала, но по destination MAC нельзя определить конечную удалённую IP-сеть.

**Explanation in English:** The router matches destination IP against routing-table prefixes to choose a remote-network route. Source IP identifies the sender. MAC addresses serve ingress/egress links; a destination MAC does not identify the final remote IP network.

### E226. A computer has to send a packet to a destination host in the same LAN. How will the packet be sent?

Источник: модули_08, Q7. Тема: модуль 8.

1. The packet will be sent to the default gateway first, and then, depending on the response from the gateway, it may be sent to the destination host.
2. The packet will be sent directly to the destination host.
3. The packet will first be sent to the default gateway, and then from the default gateway it will be sent directly to the destination host.
4. The packet will be sent only to the default gateway.

**Ответ:** The packet will be sent directly to the destination host..

**Объяснение:** Если получатель в той же IP-подсети LAN, хост узнаёт его MAC и адресует кадр непосредственно ему. Default gateway используется для других сетей и не должен быть обязательным промежуточным шагом локальной передачи. Здесь курс подразумевает одну подсеть, а не просто общий физический коммутатор.

**Explanation in English:** For a destination in the same LAN IP subnet, the host resolves the destination MAC and sends the frame directly to it. A default gateway handles other networks and is not a mandatory hop for local delivery. The course assumes one subnet, not merely a shared physical switch.

### E227. Which IPv4 address can a host use to ping the loopback interface?

Источник: модули_08, Q8. Тема: модуль 8.

1. 126.0.0.1
2. 127.0.0.0
3. 126.0.0.0
4. 127.0.0.1

> Весь 127.0.0.0/8 — loopback; вариант 127.0.0.0 делает одиночный выбор неоднозначным.

**Ответ:** 127.0.0.1 — ожидаемый учебный ответ; формулировка неоднозначна из-за 127.0.0.0/8.

**Объяснение:** Ожидаемый учебный ответ — 127.0.0.1, стандартный адрес localhost для проверки своего IP-стека. Но весь 127.0.0.0/8 зарезервирован для loopback, поэтому вариант 127.0.0.0 делает формулировку «какой адрес можно использовать» неоднозначной. 126.x.x.x к loopback не относится. Карточка исключена из оцениваемого одиночного квиза, чтобы не наказывать за это различие.

**Explanation in English:** The expected course answer is 127.0.0.1, the conventional localhost address for testing the local IP stack. However, all of 127.0.0.0/8 is reserved for loopback, so the 127.0.0.0 option makes “which address can be used” ambiguous. 126.x.x.x is not loopback. This card is excluded from scored single-answer quizzes to avoid penalizing that distinction.

### E228. When a connectionless protocol is in use at a lower layer of the OSI model, how is missing data detected and retransmitted if necessary?

Источник: модули_08, Q9. Тема: модуль 8.

1. Connectionless acknowledgements are used to request retransmission.
2. Upper-layer connection-oriented protocols keep track of the data received and can request retransmission from the upper-level protocols on the sending host.
3. Network layer IP protocols manage the communication sessions if connection-oriented transport services are not available.
4. The best-effort delivery process guarantees that all packets that are sent are received.

**Ответ:** Upper-layer connection-oriented protocols keep track of the data received and can request retransmission from the upper-level protocols on the sending host..

**Объяснение:** Надёжный верхний протокол, например TCP, отслеживает полученные байты, подтверждения и пропуски и организует повторную отправку. IP остаётся connectionless/best effort; он не заводит сеанс и не получает магические «connectionless acknowledgements». Best effort не означает, что всё обязательно доставлено.

**Explanation in English:** A reliable upper-layer protocol such as TCP tracks bytes, acknowledgments and gaps and arranges retransmission. IP remains connectionless/best effort; it does not create sessions or provide “connectionless acknowledgements.” Best effort does not guarantee every packet arrives.

### E229. What was the reason for the creation and implementation of IPv6?

Источник: модули_08, Q10. Тема: модуль 8.

1. To make reading a 32-bit address easier
2. To relieve IPv4 address depletion
3. To provide more address space in the Internet Names Registry
4. To allow NAT support for private addressing

**Ответ:** To relieve IPv4 address depletion.

**Объяснение:** IPv6 создавался прежде всего для преодоления исчерпания адресов IPv4: вместо 32 бит используются 128. Это не способ легче читать 32-битный адрес и не проект для увеличения NAT; наоборот, большее пространство уменьшает нужду экономить адреса через NAT.

**Explanation in English:** IPv6 was created primarily to address IPv4 address exhaustion by using 128 instead of 32 bits. It is not a way to make a 32-bit address easier to read or a project to expand NAT; more address space reduces the need for address-conservation NAT.

### E230. Which information is used by routers to forward a data packet toward its destination?

Источник: модули_08, Q11. Тема: модуль 8.

1. Source IP address
2. Destination IP address
3. Source data-link address
4. Destination data-link address

**Ответ:** Destination IP address.

**Объяснение:** Для продвижения к конечной сети роутер использует destination IP. Source IP полезен для идентификации отправителя, но не задаёт направление к получателю. Канальные адреса меняются от участка к участку и обслуживают лишь текущий hop.

**Explanation in English:** A router uses destination IP to move toward the final network. Source IP identifies the sender rather than the target direction. Data-link addresses change across routed links and serve only the current hop.

### E231. Which field in an IPv4 packet header will typically stay the same during its transmission?

Источник: модули_08, Q12. Тема: модуль 8.

1. Flag
2. Time-to-Live
3. Packet Length
4. Destination Address

**Ответ:** Destination Address.

**Объяснение:** Destination Address обычно сохраняется до получателя, если нет NAT. TTL изменяется каждым роутером. Packet Length и флаги могут измениться при IPv4-фрагментации, поэтому не являются лучшим ответом на вопрос о типично неизменном поле.

**Explanation in English:** Destination Address normally remains the final receiver’s address unless NAT changes it. Each router changes TTL. Packet Length and flags can change during IPv4 fragmentation, so they are not the best answer for the typically unchanged field.

### E232. Which field in an IPv6 packet is used by the router to determine if a packet has expired and should be dropped?

Источник: модули_08, Q13. Тема: модуль 8.

1. TTL
2. Hop Limit
3. Address Unreachable
4. No Route to Destination

**Ответ:** Hop Limit.

**Объяснение:** В IPv6 роутер уменьшает Hop Limit и отбрасывает пакет при исчерпании. TTL — название аналогичного поля IPv4. Address Unreachable и No Route to Destination — причины диагностических сообщений, а не счётчик срока жизни IPv6-пакета.

**Explanation in English:** IPv6 routers decrement Hop Limit and discard the packet when it expires. TTL is the corresponding IPv4 field name. Address Unreachable and No Route to Destination are diagnostic reasons, not the IPv6 packet lifetime counter.

### E475. Which two traffic types require delay sensitive delivery? (Choose two.)

Источник: модули_17, Q12. Тема: модуль 8.

1. Email
2. Web
3. FTP
4. Voice
5. Video

**Ответ:** Voice; Video.

**Объяснение:** Голос и видео в реальном времени должны приходить вовремя: задержки и jitter нарушают разговор/показ. Email, обычная веб-страница и FTP в основном терпят ожидание ради полного получения данных. Речь о типичной интерактивной voice/video передаче, а не о скачивании видеофайла.

**Explanation in English:** Real-time voice and video must arrive promptly; delay and jitter disrupt the conversation/display. Email, ordinary web pages and FTP generally tolerate waiting for complete data. This refers to interactive voice/video, not downloading a video file.

### E483. What is the usable number of host IP addresses on a network that has a /26 mask?

Источник: тесты_IP_Addressing, Q5. Тема: модуль 8.

1. 256
2. 254
3. 64
4. 62
5. 32
6. 16

**Ответ:** 62.

**Объяснение:** При /26 из 32 бит остаётся 6 host bits: 2^6 = 64 адреса. В обычной IPv4-подсети один — network, один — broadcast, поэтому пригодны 64−2 = 62. Ответ 64 считает весь блок, а 254 относится к /24.

**Explanation in English:** A /26 leaves 32−26 = 6 host bits, giving 2^6 = 64 total addresses. An ordinary IPv4 subnet reserves network and broadcast, leaving 64−2 = 62 usable hosts. Sixty-four counts the whole block; 254 corresponds to /24.

### E486. How many bits must be borrowed from the host portion of an address to accommodate a router with five connected networks?

Источник: тесты_IP_Addressing, Q8. Тема: модуль 8.

1. two
2. three
3. four
4. five

**Ответ:** three.

**Объяснение:** Нужно минимум пять разных подсетей: 2^2 = 4 недостаточно, 2^3 = 8 достаточно. Поэтому заимствуются три host bits. Четыре или пять тоже дадут больше сетей, но вопрос ищет минимальное необходимое количество.

**Explanation in English:** At least five distinct subnets are needed: 2^2 = 4 is insufficient, while 2^3 = 8 is enough. Therefore borrow three host bits. Four or five would also create enough subnets, but the question asks for the minimum required.

### E529. At which layer of the OSI model would a logical address be added during encapsulation?

Источник: тесты_exam_0, Q18. Тема: модуль 8.

1. physical layer
2. data link layer
3. network layer
4. transport layer

**Ответ:** network layer.

**Объяснение:** Логический адрес здесь означает IP. Он добавляется в заголовок network layer при превращении транспортного сегмента в пакет. Data link добавляет канальные MAC-адреса, transport — порты, physical передаёт сигналы.

**Explanation in English:** The logical address here is an IP address. The network layer adds it when encapsulating a transport segment into a packet. Data link adds MAC addresses, transport adds ports, and physical transmits signals.

### E539. Why would a Layer 2 switch need an IP address?

Источник: тесты_exam_0, Q28. Тема: модуль 8.

1. to enable the switch to send broadcast frames to attached PCs
2. to enable the switch to function as a default gateway
3. to enable the switch to be managed remotely
4. to enable the switch to receive frames from attached PCs

**Ответ:** to enable the switch to be managed remotely.

**Объяснение:** L2-switch пересылает кадры по MAC-таблице без собственного IP. IP на SVI позволяет администратору подключаться к самому switch по SSH/другим IP-службам. Этот management IP не превращает L2-switch в default gateway и не нужен для приёма или рассылки кадров.

**Explanation in English:** A Layer 2 switch forwards frames using its MAC table without its own IP address. An SVI management IP lets administrators reach the switch via SSH or other IP services. It does not make a Layer 2 switch a default gateway and is not needed to receive or flood frames.

### E544. At which OSI layer is a destination IP address added to a PDU during the encapsulation process?

Источник: тесты_exam_0, Q33. Тема: модуль 8.

1. network layer
2. application layer
3. transport layer
4. presentation layer

**Ответ:** network layer.

**Объяснение:** Destination IP входит в IP-заголовок, который создаёт network layer (L3). Transport layer добавляет TCP/UDP-порты; application/presentation работают с приложением и представлением данных, а не с IP-адресацией пакета.

**Explanation in English:** Destination IP is part of the IP header created by the network layer (Layer 3). Transport adds TCP/UDP ports; application and presentation handle application data and representation rather than packet IP addressing.

### E581. What is a basic characteristic of the IP protocol?

Источник: тесты_exam_2, Q3. Тема: модуль 8.

1. connectionless
2. media dependent
3. user data segmentation
4. reliable end-to-end delivery

**Ответ:** connectionless.

**Объяснение:** IP является connectionless: отправка пакета не требует предварительного handshake IP. Он media independent, а не dependent, и не гарантирует надёжную end-to-end доставку. User-data segmentation — задача транспорта, а не базовая характеристика IP.

**Explanation in English:** IP is connectionless: sending a packet does not require a prior IP handshake. It is media independent rather than dependent and does not guarantee reliable end-to-end delivery. User-data segmentation is a transport task, not a defining IP characteristic.

### E586. Which statement describes a feature of the IP protocol?

Источник: тесты_exam_2, Q8. Тема: модуль 8.

1. IP encapsulation is modified based on network media.
2. IP relies on Layer 2 protocols for transmission error control.
3. MAC addresses are used during the IP packet encapsulation.
4. IP relies on upper layer services to handle situations of missing or out-of-order packets.

**Ответ:** IP relies on upper layer services to handle situations of missing or out-of-order packets..

**Объяснение:** IP не восстанавливает потери и порядок обычного потока пакетов; при необходимости это делают верхние уровни, например TCP. Тип среды меняет L2-оболочку, а не принцип IP-инкапсуляции. MAC находится в кадре, а ошибки на отдельном канале не заменяют end-to-end восстановление.

**Explanation in English:** IP does not recover lost packets or restore an ordinary packet stream’s order; upper layers such as TCP do so when needed. Media type changes Layer 2 encapsulation, not the basic IP encapsulation. MAC belongs to the frame, and per-link error handling cannot replace end-to-end recovery.

### E587. What IPv4 header field identifies the upper layer protocol carried in the packet?

Источник: тесты_exam_2, Q9. Тема: модуль 8.

1. Protocol
2. Identification
3. Version
4. Differentiated Services

**Ответ:** Protocol.

**Объяснение:** Protocol сообщает получателю, что находится в полезной нагрузке IPv4: например, TCP=6 или UDP=17. Identification связывает фрагменты одной исходной датаграммы; Version выбирает IPv4/IPv6; Differentiated Services задаёт класс обработки трафика.

**Explanation in English:** Protocol tells the receiver what IPv4 carries, such as TCP=6 or UDP=17. Identification associates fragments of one original datagram; Version selects IPv4/IPv6; Differentiated Services describes traffic treatment.

### E598. Refer to the exhibit. A user PC has successfully transmitted packets to www.cisco.com. Which IP address does the user PC target in order to forward its data off the local network?

Источник: тесты_exam_2, Q20. Тема: модуль 8.

1. 172.24.255.17
2. 172.24.1.22
3. 172.20.0.254
4. 172.24.255.4
5. 172.20.1.18

> Ответ для показанного варианта (нужна схема/PT для полной проверки)

**Ответ:** 172.20.0.254.

**Объяснение:** Без исходной схемы нельзя независимо подтвердить именно 172.20.0.254. Это сохранённый ответ варианта: он верен, если данный адрес принадлежит локальному интерфейсу default gateway ПК. Для выхода из LAN ПК доставляет кадр шлюзу, сохраняя destination IP удалённого сайта. Другие IP нельзя отвергать только по внешнему виду без маски и топологии.

**Explanation in English:** Without the exhibit, 172.20.0.254 cannot be independently verified. It is the saved variant answer and is correct if it identifies the PC’s local default-gateway interface. To leave the LAN, the PC sends the frame to that gateway while retaining the website’s destination IP. Other addresses cannot be rejected by appearance alone without the mask/topology.

### E608. Open the PT activity. Perform the tasks in the activity instructions and then answer the question. Which interfaces in each router are active and operational?

Источник: тесты_exam_2, Q30. Тема: модуль 8.

1. R1: G0/0 and S0/0/0 R2: G0/0 and S0/0/0
2. R1: G0/1 and S0/0/1 R2: G0/0 and S0/0/1
3. R1: G0/0 and S0/0/0 R2: G0/1 and S0/0/0
4. R1: G0/0 and S0/0/1 R2: G0/1 and S0/0/1

> Ответ для показанного варианта (нужна схема/PT для полной проверки)

**Ответ:** R1: G0/0 and S0/0/0 R2: G0/1 and S0/0/0.

**Объяснение:** Операционно работающий интерфейс имеет Status up и Protocol up в show ip interface brief. Сохранённый ответ перечисляет R1 G0/0,S0/0/0 и R2 G0/1,S0/0/0, но без исходного PT-файла состояния и конкретные имена портов не подтверждены. Проверяй оба столбца; administratively down не считается работающим.

**Explanation in English:** An operational interface shows both Status up and Protocol up in show ip interface brief. The saved answer lists R1 G0/0,S0/0/0 and R2 G0/1,S0/0/0, but the original PT file is required to verify those particular interfaces. Check both columns; administratively down is not operational.

### E609. Which term describes a field in the IPv4 packet header that contains a 4-bit binary value set to 0100?

Источник: тесты_exam_2, Q31. Тема: модуль 8.

1. Version
2. Source IPv4 address
3. Protocol
4. TTL

**Ответ:** Version.

**Объяснение:** Двоичное 0100 равно десятичному 4; четырёхбитное поле Version поэтому обозначает IPv4. Source IPv4 address занимает 32 бита. Protocol выбирает вложенный протокол, TTL ограничивает переходы — они не задают номер версии IP.

**Explanation in English:** Binary 0100 equals decimal 4, so the four-bit Version field identifies IPv4. Source IPv4 address occupies 32 bits. Protocol chooses the encapsulated protocol and TTL limits hops; neither gives the IP version.

### E620. What kind of port must be requested from IANA in order to be used with a specific application?

Источник: тесты_exam_4, Q9. Тема: модуль 8.

1. registered port
2. private port
3. dynamic port
4. source port

**Ответ:** registered port.

**Объяснение:** Registered port — зарегистрированный для службы/приложения номер в диапазоне 1024–49151, для назначения которого обращаются к IANA. Dynamic/private ports 49152–65535 не регистрируются как постоянные службы. Source port описывает роль поля в пакете, а не категорию регистрации.

**Explanation in English:** A registered port is assigned to a service/application in 1024–49151 through IANA registration. Dynamic/private ports 49152–65535 are not registered as permanent services. Source port describes a packet field’s role, not a registration category.

### E635. What is true about the Server Message Block protocol?

Источник: тесты_exam_4, Q24. Тема: модуль 8.

1. Different SMB message types have a different format.
2. Clients establish a long term connection to servers.
3. SMB messages cannot authenticate a session.
4. SMB uses the FTP protocol for communication.

**Ответ:** Clients establish a long term connection to servers..

**Объяснение:** SMB поддерживает длительную сессию клиента с сервером для общего доступа к файлам/принтерам: подключение не обязательно создаётся заново для каждого действия. SMB умеет аутентификацию и не использует FTP как свой транспорт. Сообщения организованы общим SMB-форматом с различными командами, поэтому утверждение о совершенно разных форматах не является нужной характеристикой.

**Explanation in English:** SMB supports a persistent client-server session for file/printer sharing rather than requiring a new connection for every operation. SMB supports authentication and does not use FTP as its transport. Its messages share an SMB structure with different commands, so completely different message formats is not the intended characteristic.

### E699. What routing table entry has a next hop address associated with a destination network?

Источник: тесты_exam_6, Q21. Тема: модуль 8.

1. directly-connected routes
2. local routes
3. remote routes
4. C and L source routes

**Ответ:** remote routes.

**Объяснение:** Remote route ведёт в сеть за другим роутером; next hop — IP этого соседнего роутера. Например, сеть 192.168.2.0/24 via 192.168.1.254 достигается через 192.168.1.254. C (connected) обозначает напрямую подключённую сеть, L (local) — собственный IP интерфейса: им не нужен промежуточный сосед для этих адресов. Поэтому remote routes — нужная категория.

**Explanation in English:** A remote route reaches a network beyond another router; the next hop is that neighboring router’s IP. For example, 192.168.2.0/24 via 192.168.1.254 forwards through 192.168.1.254. C (connected) marks a directly connected network, while L (local) marks the router’s own interface IP; neither needs an intermediate neighbor for those destinations. Thus remote routes is the category asked about.

### E708. What type of address is 198.133.219.162?

Источник: тесты_exam_6, Q30. Тема: модуль 8.

1. public
2. link-local
3. loopback
4. multicast

**Ответ:** public.

**Объяснение:** 198.133.219.162 — обычный публичный unicast-адрес в контексте задания. Он не входит в link-local 169.254/16, loopback 127/8 или multicast 224/4, а также не входит в RFC1918 private ranges. Это не 198.51.100/24, специально зарезервированный для документации.

**Explanation in English:** 198.133.219.162 is a public unicast address in this question. It is outside link-local 169.254/16, loopback 127/8, multicast 224/4 and RFC1918 private ranges. Do not confuse it with 198.51.100/24, which is reserved for documentation.

### E739. Which value, that is contained in an IPv4 header field, is decremented by each router that receives a packet?

Источник: тесты_exam_7, Q6. Тема: модуль 8.

1. Differentiated Services
2. Fragment Offset
3. Header Length
4. Time-to-Live

**Ответ:** Time-to-Live.

**Объяснение:** Каждый пересылающий IPv4-роутер уменьшает Time-to-Live, чтобы пакет не кружил бесконечно. Differentiated Services задаёт обработку, Fragment Offset — позицию фрагмента, Header Length — длину заголовка; они не являются уменьшаемым hop-счётчиком.

**Explanation in English:** Each forwarding IPv4 router decrements Time-to-Live to prevent indefinite looping. Differentiated Services specifies treatment, Fragment Offset locates a fragment and Header Length gives header size; none is the decremented hop counter.

### E744. Refer to the exhibit. Match the network with the correct IP address and prefix that will satisfy the usable host addressing requirements for each network. A Network D 192.168.0.224 /30 B Network C 192.168.0.192 /27 C Network A 192.168.0.0 /25 D Network B 192.168.0.128 /26

Источник: тесты_exam_7, Q11. Тема: модуль 8.



> Ответ для показанного варианта (нужна схема/PT для полной проверки)

**Ответ:** Network A → 192.168.0.0/25; Network B → 192.168.0.128/26; Network C → 192.168.0.192/27; Network D → 192.168.0.224/30.

**Объяснение:** Предложенные блоки не пересекаются: /25 .0–.127 даёт 126 хостов, /26 .128–.191 — 62, /27 .192–.223 — 30, /30 .224–.227 — 2. Поэтому такая раскладка подходит A/B/C/D, если их требования укладываются в эти ёмкости. Требования исходной схемы отсутствуют, значит именно соответствие букв проверить нельзя; проверена арифметика VLSM, не восстановленная картинка.

**Explanation in English:** The proposed blocks do not overlap: /25 .0–.127 provides 126 hosts; /26 .128–.191 provides 62; /27 .192–.223 provides 30; /30 .224–.227 provides 2. This assignment fits A/B/C/D if their requirements fit those capacities. The exhibit’s host requirements are missing, so the letter-to-network mapping cannot be verified; the VLSM arithmetic can.

### E749. What are two functions that are provided by the network layer? (Choose two.)

Источник: тесты_exam_7, Q16. Тема: модуль 8.

1. carrying data between processes that are running on source and destination hosts
2. providing end devices with a unique network identifier
3. placing data on the network medium
4. directing data packets to destination hosts on other networks
5. providing dedicated end-to-end connections

**Ответ:** providing end devices with a unique network identifier; directing data packets to destination hosts on other networks.

**Объяснение:** Network layer даёт логические IP-идентификаторы узлам и направляет пакеты в другие сети. Обмен между процессами — функция transport layer, физическое размещение сигналов на среде — physical layer. IP не предоставляет dedicated end-to-end connection, поэтому последний вариант противоречит connectionless.

**Explanation in English:** The network layer gives hosts logical IP identifiers and directs packets to other networks. Process-to-process delivery belongs to transport; placing signals on the medium belongs to physical. IP supplies no dedicated end-to-end connection, so that option contradicts connectionless operation.

### E764. What mechanism is used by a router to prevent a received IPv4 packet from traveling endlessly on a network?

Источник: тесты_exam_7, Q31. Тема: модуль 8.

1. It checks the value of the TTL field and if it is 0, it discards the packet and sends a Destination Unreachable message to the source host.
2. It checks the value of the TTL field and if it is 100, it discards the packet and sends a Destination Unreachable message to the source host.
3. It decrements the value of the TTL field by 1 and if the result is 0, it discards the packet and sends a Time Exceeded message to the source host.
4. It increments the value of the TTL field by 1 and if the result is 100, it discards the packet and sends a Parameter Problem message to the source host.

**Ответ:** It decrements the value of the TTL field by 1 and if the result is 0, it discards the packet and sends a Time Exceeded message to the source host..

**Объяснение:** Правильная последовательность: уменьшить TTL на 1; если получилось 0, отбросить пакет и обычно отправить ICMP Time Exceeded. Это ограничивает петлю числом переходов. TTL не увеличивается, значение 100 не является порогом, а Destination Unreachable/Parameter Problem обозначают другие причины ошибок.

**Explanation in English:** The correct sequence is decrement TTL by one, then discard at zero and normally return ICMP Time Exceeded. This bounds a loop by hop count. TTL is not incremented, 100 is not the expiry threshold, and Destination Unreachable/Parameter Problem describe different errors.

### E768. What are two characteristics of IP? (Choose two.)

Источник: тесты_exam_7, Q35. Тема: модуль 8.

1. does not require a dedicated end-to-end connection
2. operates independently of the network media
3. retransmits packets if errors occur
4. re-assembles out of order packets into the correct order at the receiver end
5. guarantees delivery of packets

**Ответ:** does not require a dedicated end-to-end connection; operates independently of the network media.

**Объяснение:** IP не устанавливает dedicated end-to-end connection и может переноситься разными L2-средами — это connectionless и media independent. Он не гарантирует доставку, не повторяет потерянные пакеты и не восстанавливает порядок потока: при необходимости это работа TCP/приложения. Сборка IP-фрагментов не равна упорядочиванию всех пакетов потока.

**Explanation in English:** IP requires no dedicated end-to-end connection and can run over different Layer 2 media: connectionless and media independent. It does not guarantee delivery, retransmit losses or restore stream order; TCP/applications handle that when needed. Reassembling IP fragments is not the same as ordering all packets in a stream.

### E777. Refer to the exhibit. On the basis of the output, which two statements about network connectivity are correct? (Choose two.)

Источник: тесты_exam_7, Q44. Тема: модуль 8.

1. There is connectivity between this device and the device at 192.168.100.1.
2. The connectivity between these two hosts allows for videoconferencing calls.
3. There are 4 hops between this device and the device at 192.168.100.1.
4. The average transmission time between the two hosts is 2 milliseconds.
5. This host does not have a default gateway configured.

> Ответ для показанного варианта (нужна схема/PT для полной проверки)

**Ответ:** There is connectivity between this device and the device at 192.168.100.1.; There are 4 hops between this device and the device at 192.168.100.1..

**Объяснение:** Сохранённый ключ утверждает достижимость 192.168.100.1 и четыре hop, но без вывода tracert эти конкретные числа не подтверждены. Успешный последний ответ подтверждает достижимость на момент проверки; номера строк дают hop count. Он не гарантирует качество видеосвязи, не доказывает отсутствие gateway, а RTT нельзя называть временем передачи в одну сторону.

**Explanation in English:** The saved key claims reachability of 192.168.100.1 and four hops, but those specifics cannot be verified without the tracert output. A successful final reply supports reachability at that time; numbered rows give hop count. It does not guarantee videoconferencing quality, prove a missing gateway, or turn round-trip measurements into one-way transmission time.

### E188. What is the special value assigned to the first 24 bits of a multicast MAC address transporting an IPv4 packet?

Источник: модули_07, Q3. Тема: модуль 9.

1. 01-5E-00
2. FF-00-5E
3. FF-FF-FF
4. 01-00-5E

**Ответ:** 01-00-5E.

**Объяснение:** У IPv4 multicast фиксированный Ethernet-префикс 01-00-5E, поэтому важен именно этот порядок трёх байтов. FF-FF-FF — начало broadcast FF-FF-FF-FF-FF-FF, а перестановки 01-5E-00 и FF-00-5E не являются заданным префиксом IPv4 multicast.

**Explanation in English:** IPv4 multicast uses the Ethernet prefix 01-00-5E in that exact byte order. FF-FF-FF begins the all-ones broadcast address; 01-5E-00 and FF-00-5E are not the defined IPv4 multicast prefix.

### E190. Which network device makes forwarding decisions based on the destination MAC address that is contained in the frame?

Источник: модули_07, Q5. Тема: модуль 9.

1. Repeater
2. Hub
3. Switch
4. Router

**Ответ:** Switch.

**Объяснение:** Switch читает destination MAC кадра и находит выходной порт в MAC-таблице. Repeater и hub повторяют сигнал без такого поиска, а router выбирает маршрут по адресу назначения сетевого уровня, обычно IP.

**Explanation in English:** A switch looks up the frame’s destination MAC to choose an output port. Repeaters and hubs repeat signals without this lookup; a router chooses a network-layer route, normally using the destination IP.

### E191. Which network device has the primary function to send data to a specific destination based on the information found in the MAC address table?

Источник: модули_07, Q6. Тема: модуль 9.

1. Hub
2. Router
3. Switch
4. Modem

**Ответ:** Switch.

**Объяснение:** MAC address table связывает MAC с портом коммутатора: именно switch использует её, чтобы отправить кадр нужному получателю. Hub не выбирает отдельного получателя, router использует таблицу IP-маршрутов, modem преобразует сигналы.

**Explanation in English:** A MAC address table maps a MAC address to a switch port, so a switch uses it to direct a frame to its recipient. A hub does not select one destination, a router uses IP routes, and a modem converts signals.

### E194. What addressing information is recorded by a switch to build its MAC address table?

Источник: модули_07, Q9. Тема: модуль 9.

1. The destination Layer 3 address of incoming packets
2. The destination Layer 2 address of outgoing frames
3. The source Layer 3 address of outgoing packets
4. The source Layer 2 address of incoming frames

**Ответ:** The source Layer 2 address of incoming frames.

**Объяснение:** Кадр пришёл через конкретный порт: его source Layer 2 address показывает, какой MAC достижим за этим портом. Поэтому коммутатор записывает source MAC входящего кадра. Destination используется для пересылки, а Layer 3 IP не является ключом MAC-таблицы.

**Explanation in English:** An arriving frame’s source Layer 2 address reveals which MAC is reachable through its ingress port. The switch therefore learns the source MAC of incoming frames. Destination MAC is used for forwarding, and Layer 3 IP is not the MAC table’s key.

### E233. What destination MAC address would be included in a frame sent from a source device to a destination device on the same local network?

Источник: модули_09, Q1. Тема: модуль 9.

1. A broadcast MAC address of FF-FF-FF-FF-FF-FF.
2. The MAC address of the destination device.
3. The MAC address of the local router interface.

**Ответ:** The MAC address of the destination device..

**Объяснение:** Узлы в одной IP-подсети доставляют обычный unicast напрямую: destination MAC кадра — MAC конечного устройства. MAC шлюза нужен при отправке за пределы подсети. Broadcast используется для ARP-запроса при неизвестном MAC, а не как адрес назначения самого обычного кадра данных.

**Explanation in English:** Hosts on the same subnet deliver ordinary unicast directly, so the frame targets the destination device’s MAC. The gateway MAC is needed for an off-subnet destination. Broadcast may discover the missing MAC via ARP; it is not the normal data frame’s destination.

### E234. What destination MAC address would be included in a frame sent from a source device to a destination device on a remote local network?

Источник: модули_09, Q2. Тема: модуль 9.

1. A broadcast MAC address of FF-FF-FF-FF-FF-FF.
2. The MAC address of the destination device.
3. The MAC address of the local router interface.

**Ответ:** The MAC address of the local router interface..

**Объяснение:** Удалённый узел нельзя достичь одним локальным Ethernet-кадром. Первый кадр поэтому адресуется локальному интерфейсу default gateway; тот маршрутизирует пакет дальше. IP назначения остаётся IP удалённого узла. Его удалённый MAC не нужен отправителю, а broadcast не доставляет обычный пакет через роутеры.

**Explanation in English:** A remote host cannot be reached in one local Ethernet frame. The first frame targets the local default-gateway interface, which forwards the packet onward. The destination IP remains the remote host’s IP. Its remote MAC is not needed by the sender, and broadcast does not carry normal data through routers.

### E235. What two protocols are used to determine the MAC address of a known destination device IP address (IPv4 and IPv6)?

Источник: модули_09, Q3. Тема: модуль 9.

1. DHCP
2. ARP
3. DNS
4. ND

**Ответ:** ARP; ND.

**Объяснение:** ARP разрешает известный IPv4-адрес соседа в MAC, а IPv6 использует Neighbor Discovery (ND), включая NS/NA. DHCP выдаёт сетевые настройки, DNS переводит имена в адреса; они не выполняют это разрешение IP→MAC.

**Explanation in English:** ARP resolves a known neighboring IPv4 address to a MAC; IPv6 uses Neighbor Discovery (ND), including NS/NA. DHCP supplies network configuration and DNS resolves names, not the IP-to-MAC mapping asked for here.

### E236. What two functions are provided by ARP? (Choose two.)

Источник: модули_09, Q1. Тема: модуль 9.

1. Maintains a table of IPv4 address to domain names
2. Maintains a table of IPv4 to MAC address mappings
3. Maintains a table of IPv6 to MAC address mappings
4. Resolves IPv4 addresses to domain names
5. Resolves IPv4 addresses to MAC addresses
6. Resolves IPv6 addresses to MAC addresses

**Ответ:** Maintains a table of IPv4 to MAC address mappings; Resolves IPv4 addresses to MAC addresses.

**Объяснение:** ARP сначала находит MAC по IPv4 и затем хранит найденное соответствие в ARP-кэше, чтобы не повторять запрос для каждого пакета. Поэтому верны и resolving IPv4→MAC, и maintaining IPv4→MAC mappings. Доменные имена относятся к DNS, а разрешение IPv6 — к ND.

**Explanation in English:** ARP resolves IPv4 to MAC and caches the result so subsequent packets need not repeat the lookup. Thus both resolving IPv4-to-MAC and maintaining that mapping table are correct. Domain names belong to DNS; IPv6 address resolution belongs to ND.

### E237. Where is the ARP table stored on a device?

Источник: модули_09, Q2. Тема: модуль 9.

1. ROM
2. Flash
3. NVRAM
4. RAM

**Ответ:** RAM.

**Объяснение:** ARP-таблица — изменяемый рабочий кэш в RAM, доступный при пересылке пакетов. Она не является загрузочным кодом ROM, образом IOS во Flash или сохранённой startup-config в NVRAM. После перезапуска динамические записи приходится узнавать заново.

**Explanation in English:** The ARP table is a changing working cache in RAM, consulted when packets are sent. It is not ROM boot code, the IOS image in Flash or startup-config in NVRAM. Dynamic mappings must be learned again after a restart.

### E238. Which statement is true about ARP?

Источник: модули_09, Q3. Тема: модуль 9.

1. An ARP cache cannot be manually deleted.
2. ARP entries are cached permanently.
3. ARP entries are cached temporarily.

**Ответ:** ARP entries are cached temporarily..

**Объяснение:** Вопрос относится к динамически изученным ARP-записям: они временные и удаляются по таймеру. Кэш можно очистить вручную, поэтому первый вариант неверен. Статические записи существуют и не стареют автоматически, но это исключение к обычному динамическому кэшу, а не основание считать все записи постоянными.

**Explanation in English:** The question refers to dynamically learned ARP entries: they are temporary and age out. The cache can be cleared manually, so the first option is false. Static entries do exist and do not age automatically, but that does not make ordinary dynamic entries permanent.

### E239. Which command could be used on a Cisco router to view its ARP table?

Источник: модули_09, Q4. Тема: модуль 9.

1. arp -a
2. arp -d
3. show arp table
4. show ip arp

**Ответ:** show ip arp.

**Объяснение:** На Cisco IOS команда show ip arp выводит IPv4→MAC соответствия. arp -a — привычная команда просмотра на ПК, arp -d удаляет записи, а show arp table не является требуемой IOS-командой среди этих вариантов.

**Explanation in English:** On Cisco IOS, show ip arp displays IPv4-to-MAC mappings. arp -a is a PC inspection command, arp -d deletes entries, and show arp table is not the required IOS syntax among these options.

### E240. What is an attack using ARP?

Источник: модули_09, Q5. Тема: модуль 9.

1. ARP broadcasts
2. ARP hopping attacks
3. ARP poisoning
4. ARP starvation

**Ответ:** ARP poisoning.

**Объяснение:** ARP poisoning подсовывает ложное соответствие IP→MAC, например связывает IP шлюза с MAC атакующего, чтобы перенаправить трафик. Обычные ARP broadcasts нужны для обнаружения соседей и сами по себе не атака; hopping и starvation здесь не названия описанного механизма подмены.

**Explanation in English:** ARP poisoning supplies a false IP-to-MAC mapping, such as mapping the gateway IP to an attacker’s MAC to redirect traffic. Ordinary ARP broadcasts discover neighbors and are not inherently attacks; hopping and starvation do not name this mapping-spoofing mechanism.

### E241. Which two ICMPv6 messages are used in SLAAC?

Источник: модули_09, Q1. Тема: модуль 9.

1. Neighbor advertisement
2. Neighbor solicitation
3. Router advertisement
4. Router solicitation

**Ответ:** Router advertisement; Router solicitation.

**Объяснение:** Для SLAAC host запрашивает параметры через Router Solicitation, а Router Advertisement сообщает префикс и сведения о маршрутизаторе. NS/NA в первую очередь разрешают адреса соседей; NS также используется DAD, но ожидаемая пара сообщений для получения параметров SLAAC — RS/RA.

**Explanation in English:** For SLAAC, a host requests configuration with Router Solicitation and receives prefix/router information in Router Advertisement. NS/NA primarily resolve neighbor addresses; NS also participates in DAD, but the configuration-discovery pair asked for is RS/RA.

### E242. Which two ICMPv6 messages are used in to determine the MAC address of a known IPv6 address?

Источник: модули_09, Q2. Тема: модуль 9.

1. Neighbor advertisement
2. Neighbor solicitation
3. Router advertisement
4. Router solicitation

**Ответ:** Neighbor advertisement; Neighbor solicitation.

**Объяснение:** Neighbor Solicitation спрашивает MAC устройства с заданным IPv6, а Neighbor Advertisement возвращает информацию об этом соседе. Router Solicitation/Advertisement ищут маршрутизатор и параметры сети, а не заменяют эту пару для разрешения адреса обычного соседа.

**Explanation in English:** Neighbor Solicitation requests information for a known neighboring IPv6 address; Neighbor Advertisement supplies that neighbor’s information. Router Solicitation/Advertisement discover routers and configuration rather than performing this neighbor-resolution exchange.

### E243. To what type of address are ICMPv6 neighbor solicitation messages sent?

Источник: модули_09, Q3. Тема: модуль 9.

1. Unicast
2. Multicast
3. Broadcast

**Ответ:** Multicast.

**Объяснение:** При первоначальном разрешении адреса NS отправляется в solicited-node multicast-группу целевого IPv6: это уменьшает число узлов, обрабатывающих запрос. IPv6 не имеет broadcast. Уточнение: NS для проверки достижимости уже известного соседа может быть unicast; вопрос курса подразумевает именно address resolution.

**Explanation in English:** Initial address-resolution NS targets the destination IPv6 address’s solicited-node multicast group, reducing the nodes that process it. IPv6 has no broadcast. Qualification: NS used to probe a known neighbor can be unicast; this course question assumes address resolution.

### E244. Which router component holds the routing table, ARP cache, and running configuration file?

Источник: модули_09, Q1. Тема: модуль 9.

1. RAM
2. Flash
3. NVRAM
4. ROM

**Ответ:** RAM.

**Объяснение:** Routing table, ARP cache и running-config — текущие изменяемые данные работающего роутера, поэтому находятся в RAM. Flash обычно хранит IOS, NVRAM — startup-config, ROM — загрузочные средства; они не заменяют оперативное хранилище этих трёх структур.

**Explanation in English:** The routing table, ARP cache and running-config are changing operational data, so they reside in RAM. Flash typically stores IOS, NVRAM startup-config and ROM bootstrap facilities, rather than these three live structures.

### E245. What type of information is contained in an ARP table?

Источник: модули_09, Q2. Тема: модуль 9.

1. Switch ports associated with destination MAC addresses
2. Domain name to IPv4 address mappings
3. Routes to reach destination networks
4. IPv4 address to MAC address mappings

**Ответ:** IPv4 address to MAC address mappings.

**Объяснение:** ARP-таблица отвечает на вопрос «какой MAC соответствует этому IPv4?». MAC→порт хранится в таблице коммутации, имя→IP — в DNS, а сеть→маршрут — в таблице маршрутизации. Эти таблицы решают разные задачи и не взаимозаменяемы.

**Explanation in English:** An ARP table answers “which MAC corresponds to this IPv4?” MAC-to-port belongs to the switching table, name-to-IP to DNS, and network-to-route to the routing table. They solve different problems.

### E246. A PC is configured to obtain an IPv4 address automatically from network 192.168.1.0/24. The network administrator issues the arp -a command and notices an entry of 192.168.1.255 ff-ff-ff-ff-ff-ff. Which statement describes this entry?

Источник: модули_09, Q3. Тема: модуль 9.

1. This is a static map entry.
2. This is a dynamic map entry.
3. This entry refers to the PC itself.
4. This entry maps to the default gateway.

**Ответ:** This is a static map entry..

**Объяснение:** При /24 адрес 192.168.1.255 имеет все единицы в host-части и является broadcast. Его Ethernet-назначение заранее известно: FF-FF-FF-FF-FF-FF. Поэтому это статическое служебное соответствие, а не изученный через ответ индивидуальный MAC ПК или шлюза.

**Explanation in English:** With /24, 192.168.1.255 has all host bits set and is the subnet broadcast. Its Ethernet destination is predetermined as FF-FF-FF-FF-FF-FF, making this a static special-purpose mapping, not a dynamically learned PC or gateway MAC.

### E247. A cybersecurity analyst believes an attacker is spoofing the MAC address of the default gateway to perform a man-in-the-middle attack. Which command should the analyst use to view the MAC address a host is using to reach the default gateway?

Источник: модули_09, Q4. Тема: модуль 9.

1. ipconfig /all
2. route print
3. netstat -r
4. arp -a

**Ответ:** arp -a.

**Объяснение:** arp -a показывает кэш IPv4→MAC: найди строку IP шлюза и сравни её MAC с доверенным значением. ipconfig /all показывает настройки ПК и адрес шлюза, а route print/netstat -r — маршруты; они не показывают нужное соответствие MAC шлюза.

**Explanation in English:** arp -a displays cached IPv4-to-MAC mappings: locate the gateway IP and compare its MAC with a trusted value. ipconfig /all shows PC configuration and the gateway IP; route print/netstat -r show routes, not the required gateway-MAC mapping.

### E248. What will a Layer 2 switch do when the destination MAC address of a received frame is not in the MAC table?

Источник: модули_09, Q5. Тема: модуль 9.

1. It initiates an ARP request.
2. It broadcasts the frame out of all ports on the switch.
3. It notifies the sending host that the frame cannot be delivered.
4. It forwards the frame out of all ports except for the port at which the frame was received.

**Ответ:** It forwards the frame out of all ports except for the port at which the frame was received..

**Объяснение:** Неизвестный destination MAC означает unknown unicast: switch не знает нужный порт и делает flood по разрешённым портам той же VLAN, кроме входного. Он не запускает ARP от имени отправителя и не сообщает об ошибке. «Все порты» неверно, поскольку входной исключается; адрес кадра при flood не превращается в broadcast.

**Explanation in English:** An unknown destination MAC causes unknown-unicast flooding through eligible ports in the same VLAN except the ingress port. The switch does not initiate ARP on the sender’s behalf or return an error. “All ports” wrongly includes ingress; flooding does not change the frame’s address into broadcast.

### E249. Which two ICMPv6 messages are used during the Ethernet MAC address resolution process? (Choose two.)

Источник: модули_09, Q6. Тема: модуль 9.

1. Router solicitation
2. Router advertisement
3. Neighbor solicitation
4. Neighbor advertisement
5. Echo request

**Ответ:** Neighbor solicitation; Neighbor advertisement.

**Объяснение:** Для Ethernet MAC resolution в IPv6 отправитель использует Neighbor Solicitation, а сосед сообщает свой MAC через Neighbor Advertisement. RS/RA относятся к обнаружению роутеров и настройке; Echo Request относится к ping и сам по себе не является сообщением разрешения MAC.

**Explanation in English:** IPv6 Ethernet address resolution uses Neighbor Solicitation and a neighbor’s Neighbor Advertisement carrying its link-layer information. RS/RA discover routers/configuration; Echo Request is used by ping rather than being an address-resolution message.

### E250. How does the ARP process use an IPv4 address?

Источник: модули_09, Q7. Тема: модуль 9.

1. To determine the MAC address of the remote destination host
2. To determine the MAC address of a device on the same network
3. To determine the amount of time a packet takes when traveling from source to destination
4. To determine the network number based on the number of bits in the IPv4 address

**Ответ:** To determine the MAC address of a device on the same network.

**Объяснение:** ARP берёт известный IPv4 адрес устройства на своём канале и узнаёт его MAC. Через маршрутизаторы запрос не переносится, поэтому удалённый host MAC так не находят; время пути измеряют диагностикой вроде ping, а номер сети вычисляют по адресу и маске.

**Explanation in English:** ARP takes a known local-link IPv4 address and discovers its MAC. Requests do not traverse routers to find a remote host MAC. Round-trip time is measured with diagnostics such as ping; a network number is calculated from the address and mask.

### E251. What is one function of the ARP protocol?

Источник: модули_09, Q8. Тема: модуль 9.

1. Obtaining an IPv4 address automatically
2. Mapping a domain name to its IP address
3. Resolving an IPv4 address to a MAC address
4. Maintaining a table of domain names with their resolved IP addresses

**Ответ:** Resolving an IPv4 address to a MAC address.

**Объяснение:** Правильна функция IPv4→MAC: ARP нужен для формирования Ethernet-кадра к известному IPv4-соседу. Автоматическую выдачу IPv4 выполняет DHCP; разрешение имён и хранение их IP-соответствий относятся к DNS.

**Explanation in English:** IPv4-to-MAC resolution is correct: ARP supplies the Ethernet destination for a known IPv4 neighbor. DHCP assigns IPv4 configuration automatically; DNS resolves names and stores name-to-IP records.

### E252. Which action is taken by a Layer 2 switch when it receives a Layer 2 broadcast frame?

Источник: модули_09, Q9. Тема: модуль 9.

1. It drops the frame.
2. It sends the frame to all ports except the port on which it received the frame.
3. It sends the frame to all ports that are registered to forward broadcasts.
4. It sends the frame to all ports.

**Ответ:** It sends the frame to all ports except the port on which it received the frame..

**Объяснение:** Broadcast адресован всем узлам VLAN, поэтому switch разошлёт кадр по всем подходящим портам этой VLAN, кроме входного: отправитель уже имеет кадр. Специальная регистрация получателей broadcast не нужна. «Все порты» без исключения входного и без границ VLAN — неточное утверждение.

**Explanation in English:** Broadcast is intended for every node in the VLAN, so a switch floods eligible VLAN ports except ingress; the sender already has the frame. Broadcast receivers need no special registration. “All ports” without the ingress exception or VLAN boundary is inaccurate.

### E253. What addresses are mapped by ARP?

Источник: модули_09, Q10. Тема: модуль 9.

1. IPv4 address to a destination MAC address
2. Destination IPv4 address to the source MAC address
3. Destination IPv4 address to the destination host name
4. Destination MAC address to the source IPv4 address

**Ответ:** IPv4 address to a destination MAC address.

**Объяснение:** ARP сопоставляет IPv4 следующего локального получателя с его destination MAC для кадра. Не source MAC отправителя и не имя хоста: отправитель уже знает собственный MAC, а имена разрешает DNS.

**Explanation in English:** ARP maps the next local recipient’s IPv4 address to the destination MAC needed for the frame. It does not map that IP to the sender’s source MAC or a hostname: the sender already knows its MAC, and DNS resolves names.

### E254. When an IPv4 packet is sent to a host on a remote network, what information is provided by ARP?

Источник: модули_09, Q11. Тема: модуль 9.

1. The IPv4 address of the destination host
2. The IPv4 address of the default gateway
3. The MAC address of the router interface closest to the sending host
4. The MAC address of the switch port that connects to the sending host

**Ответ:** The MAC address of the router interface closest to the sending host.

**Объяснение:** Для удалённой сети следующий локальный получатель — интерфейс default gateway на LAN отправителя. ARP узнаёт именно его MAC. IP конечного узла и IP шлюза уже нужны до запроса, а MAC порта коммутатора не является адресом назначения транзитного кадра.

**Explanation in English:** For a remote network, the next local recipient is the default gateway’s interface on the sender’s LAN. ARP discovers that interface’s MAC. The destination/gateway IPs must already be known, and a switch port’s MAC is not the transit frame’s destination.

### E255. The ARP table in a switch maps which two types of address together?

Источник: модули_09, Q12. Тема: модуль 9.

1. Layer 3 address to a Layer 2 address
2. Layer 3 address to a Layer 4 address
3. Layer 4 address to a Layer 2 address
4. Layer 2 address to a Layer 4 address

**Ответ:** Layer 3 address to a Layer 2 address.

**Объяснение:** ARP даже на коммутаторе связывает IPv4 (Layer 3) с MAC (Layer 2), например для собственного управляющего IP-трафика. Не путай её с MAC-таблицей коммутатора, связывающей MAC с портом; транспортные Layer 4 порты ARP не хранит.

**Explanation in English:** Even on a switch, ARP maps IPv4 (Layer 3) to MAC (Layer 2), for example for its own management IP traffic. This differs from the switch’s MAC-to-port table; ARP does not store Layer 4 transport ports.

### E256. What is the purpose of ARP in an IPv4 network?

Источник: модули_09, Q13. Тема: модуль 9.

1. To forward data onward based on the destination IP address
2. To obtain a specific MAC address when an IP address is known
3. To forward data onward based on the destination MAC address.
4. To build the MAC address table in a switch from the information that is gathered

**Ответ:** To obtain a specific MAC address when an IP address is known.

**Объяснение:** ARP узнаёт MAC по известному IPv4, чтобы устройство смогло создать Ethernet-кадр. Выбор пути по IP делает роутер; пересылку по MAC и обучение MAC-таблицы выполняет switch. ARP разрешает адрес, а не выполняет эти решения пересылки.

**Explanation in English:** ARP obtains a MAC for a known IPv4 address so the device can build an Ethernet frame. A router chooses routes by IP; a switch forwards by MAC and learns its MAC table. ARP resolves the address rather than performing those forwarding decisions.

### E257. Which destination address is used in an ARP request frame?

Источник: модули_09, Q14. Тема: модуль 9.

1. 0.0.0.0
2. 255.255.255.255
3. FFFF.FFFF.FFFF
4. 127.0.0.1
5. 01-00-5E-00-AA-23

**Ответ:** FFFF.FFFF.FFFF.

**Объяснение:** FFFF.FFFF.FFFF — запись 48-битного Ethernet broadcast MAC; запрос ARP должны принять все устройства локальной LAN, пока MAC цели неизвестен. 255.255.255.255, 0.0.0.0 и 127.0.0.1 — IPv4-адреса, а 01-00-5E-00-AA-23 — multicast MAC, не broadcast.

**Explanation in English:** FFFF.FFFF.FFFF is the 48-bit Ethernet broadcast MAC, allowing local devices to receive the ARP request while the target MAC is unknown. 255.255.255.255, 0.0.0.0 and 127.0.0.1 are IPv4 addresses; 01-00-5E-00-AA-23 is multicast, not broadcast.

### E491. What is used in the EUI-64 process to create an IPv6 interface ID on an IPv6 enabled interface?

Источник: тесты_IP_Addressing, Q13. Тема: модуль 9.

1. the MAC address of the IPv6 enabled interface
2. a randomly generated 64-bit hexadecimal address
3. an IPv6 address that is provided by a DHCPv6 server
4. an IPv4 address that is configured on the interface

**Ответ:** the MAC address of the IPv6 enabled interface.

**Объяснение:** Modified EUI-64 выводит 64-битный interface ID из 48-битного MAC: вставляет FF:FE в середину и инвертирует U/L-бит первого байта. Случайный IID — другой способ; IPv4 и адрес от DHCPv6 не являются исходными данными EUI-64.

**Explanation in English:** Modified EUI-64 derives a 64-bit interface ID from the 48-bit MAC by inserting FF:FE and flipping the first byte’s U/L bit. A random IID is another method; neither IPv4 nor a DHCPv6-assigned IPv6 address is the EUI-64 input.

### E560. Refer to the exhibit. What is the destination MAC address of the Ethernet frame as it leaves the web server if the final destination is PC1?

Источник: тесты_exam_1, Q16. Тема: модуль 9.

1. 00-60-2F-3A-07-AA
2. 00-60-2F-3A-07-BB
3. 00-60-2F-3A-07-CC
4. 00-60-2F-3A-07-DD

> Нужна исходная схема: принадлежность MAC 00-60-2F-3A-07-CC не проверена.

**Ответ:** 00-60-2F-3A-07-CC.

**Объяснение:** Без схемы нельзя проверить, какому интерфейсу принадлежит 00-60-2F-3A-07-CC. Сохранённый ключ верен только если это MAC следующего получателя на LAN веб-сервера: для удалённого PC1 — его локального шлюза, для локального PC1 — самого PC1. Не выбирай MAC конечного удалённого ПК только по имени адресата.

**Explanation in English:** Without the exhibit, ownership of 00-60-2F-3A-07-CC cannot be verified. The saved key is correct only if it is the next recipient on the server’s LAN: its local gateway for remote PC1, or PC1 itself if local. Do not select a remote endpoint’s MAC merely because it is the final recipient.

### E563. Which is a multicast MAC address?

Источник: тесты_exam_1, Q19. Тема: модуль 9.

1. FF-FF-FF-FF-FF-FF
2. 5C-26-0A-4B-19-3E
3. 01-00-5E-00-00-03
4. 00-26-0F-4B-00-3E

**Ответ:** 01-00-5E-00-00-03.

**Объяснение:** 01-00-5E-00-00-03 начинается с префикса IPv4 multicast 01-00-5E и имеет групповой бит. FF-FF-FF-FF-FF-FF — broadcast всем, а адреса с первыми байтами 5C и 00 имеют individual/unicast бит, поэтому не подходят.

**Explanation in English:** 01-00-5E-00-00-03 has the IPv4 multicast prefix 01-00-5E and the group bit set. FF-FF-FF-FF-FF-FF is broadcast to all; first bytes 5C and 00 have the individual/unicast bit, so those options are not multicast.

### E565. What are two actions performed by a Cisco switch? (Choose two.)

Источник: тесты_exam_1, Q21. Тема: модуль 9.

1. building a routing table that is based on the first IP address in the frame header
2. using the source MAC addresses of frames to build and maintain a MAC address table
3. forwarding frames with unknown destination IP addresses to the default gateway
4. utilizing the MAC address table to forward frames via the destination MAC address
5. examining the destination MAC address to add new entries to the MAC address table

**Ответ:** using the source MAC addresses of frames to build and maintain a MAC address table; utilizing the MAC address table to forward frames via the destination MAC address.

**Объяснение:** Две разные операции: source MAC входящего кадра обучает таблицу MAC→порт, destination MAC затем используется для выбора выходного порта. IP-таблица не строится обычным L2-switch по кадрам, неизвестный IP не является правилом его пересылки, а по destination MAC нельзя достоверно узнать местоположение отправителя.

**Explanation in English:** The two operations are distinct: an incoming frame’s source MAC teaches the MAC-to-port table, and destination MAC selects the output port. An ordinary Layer 2 switch does not build IP routes from frames or forward based on unknown IPs; learning from destination MAC would not reveal the sender’s location.

### E578. What action will occur if a switch receives a frame and does have the source MAC address in the MAC table?

Источник: тесты_exam_1, Q34. Тема: модуль 9.

1. The switch refreshes the timer on that entry.
2. The switch adds it to its MAC address table associated with the port number.
3. The switch forwards the frame to the associated port.
4. The switch sends the frame to a connected router because the destination MAC address is not local.

**Ответ:** The switch refreshes the timer on that entry..

**Объяснение:** Поскольку source MAC уже есть в таблице, новый кадр подтверждает активность устройства и обновляет таймер записи (при смене порта также обновляется порт). Новый адрес добавляют только если он ещё неизвестен. Пересылка определяется destination MAC, а не самим фактом известного source MAC.

**Explanation in English:** An already-known source MAC refreshes its entry’s age timer because the device has been seen again; a changed ingress port can also update the mapping. A new entry is needed only for an unknown source. Forwarding depends on destination MAC, not merely on a known source.

### E588. Which statement describes the treatment of ARP requests on the local link?

Источник: тесты_exam_2, Q10. Тема: модуль 9.

1. They must be forwarded by all routers on the local network.
2. They are received and processed by every device on the local network.
3. They are dropped by all switches on the local network.
4. They are received and processed only by the target device.

**Ответ:** They are received and processed by every device on the local network..

**Объяснение:** ARP request находится в Ethernet broadcast-кадре, поэтому все устройства локального broadcast domain принимают и проверяют запрос. Отвечает только владелец target IPv4 в обычном сценарии. Switch не отбрасывает такой кадр, а router не переносит его broadcast на другие интерфейсы.

**Explanation in English:** An ARP request is carried in an Ethernet broadcast frame, so local broadcast-domain devices receive and examine it. Normally only the target IPv4 owner replies. A switch forwards the broadcast; a router does not propagate it out other interfaces.

### E589. Under which two circumstances will a switch flood a frame out of every port except the port that the frame was received on? (Choose two.)

Источник: тесты_exam_2, Q11. Тема: модуль 9.

1. The frame has the broadcast address as the destination address.
2. The destination address is unknown to the switch.
3. The source address in the frame header is the broadcast address.
4. The source address in the frame is a multicast address.
5. The destination address in the frame is a known unicast address.

**Ответ:** The frame has the broadcast address as the destination address.; The destination address is unknown to the switch..

**Объяснение:** Flood нужен для destination broadcast (получатели все) и unknown destination unicast (порт получателя ещё неизвестен). Известный unicast отправляется по найденному порту. Source broadcast/multicast не является нормальным адресом отправителя Ethernet и не служит правилом выбора flood. Все действия ограничены VLAN и исключают входной порт.

**Explanation in English:** Flooding is needed for destination broadcast (all recipients) and unknown destination unicast (recipient port not learned). Known unicast uses its learned port. Broadcast/multicast source addresses are not normal Ethernet source addresses and are not flooding criteria. Flooding stays within the VLAN and excludes ingress.

### E590. Refer to the exhibit. The exhibit shows a small switched network and the contents of the MAC address table of the switch. PC1 has sent a frame addressed to PC3. What will the switch do with the frame?

Источник: тесты_exam_2, Q12; тесты_exam_6, Q24. Тема: модуль 9.

1. The switch will discard the frame.
2. The switch will forward the frame only to port 2.
3. The switch will forward the frame to all ports except port 4.
4. The switch will forward the frame to all ports.
5. The switch will forward the frame only to ports 1 and 3.

> Нужны схема и MAC-таблица: входной порт 4 и отсутствие PC3 в таблице не проверены.

**Ответ:** The switch will forward the frame to all ports except port 4..

**Объяснение:** Ключ «все порты, кроме 4» предполагает, что кадр пришёл на порт 4, а MAC PC3 отсутствует в таблице: unknown unicast рассылается на остальные подходящие порты VLAN. Если MAC PC3 известен, используется только его порт. Без исходной схемы и таблицы эти предпосылки проверить нельзя.

**Explanation in English:** “All ports except port 4” assumes ingress is port 4 and PC3’s MAC is unknown, causing unknown-unicast flooding to the other eligible VLAN ports. If PC3 is known, only its learned port is used. The original exhibit/table is required to verify those assumptions.

### E591. A network technician issues the arp -d * command on a PC after the router that is connected to the LAN is reconfigured. What is the result after this command is issued?

Источник: тесты_exam_2, Q13. Тема: модуль 9.

1. The ARP cache is cleared.
2. The current content of the ARP cache is displayed.
3. The detailed information of the ARP cache is displayed.
4. The ARP cache is synchronized with the router interface.

**Ответ:** The ARP cache is cleared..

**Объяснение:** В arp -d * ключ -d означает delete, а * выбирает записи для очистки. После перенастройки роутера это убирает устаревшие IPv4→MAC соответствия, и при следующей передаче они изучаются заново. Команда не отображает кэш (-a) и не синхронизирует его с роутером.

**Explanation in English:** In arp -d *, -d means delete and * selects the entries to clear. This removes stale IPv4-to-MAC mappings after router reconfiguration, allowing fresh resolution on subsequent traffic. It neither displays the cache (-a) nor synchronizes it with the router.

### E592. Refer to the exhibit. PC1 attempts to connect to File_server1 and sends an ARP request to obtain a destination MAC address. Which MAC address will PC1 receive in the ARP reply?

Источник: тесты_exam_2, Q14. Тема: модуль 9.

1. the MAC address of S1
2. the MAC address of the G0/0 interface on R1
3. the MAC address of the G0/0 interface on R2
4. the MAC address of S2
5. the MAC address of File_server1

> Нужна схема: расположение File_server1 и локального gateway PC1 не подтверждено.

**Ответ:** the MAC address of the G0/0 interface on R1.

**Объяснение:** Ответ R1 G0/0 верен при условии, что File_server1 находится в другой подсети, а G0/0 R1 — локальный gateway PC1. Тогда ARP запрашивает MAC шлюза, не удалённого сервера, R2 или коммутатора. Исходная схема не приложена к карточке, поэтому этот выбор интерфейса условный.

**Explanation in English:** R1 G0/0 is correct if File_server1 is off-subnet and R1 G0/0 is PC1’s local gateway. ARP then resolves that gateway, not the remote server, R2 or a switch. The exhibit is absent from the card, so the interface choice remains conditional.

### E593. What important information is examined in the Ethernet frame header by a Layer 2 device in order to forward the data onward?

Источник: тесты_exam_2, Q15. Тема: модуль 9.

1. source MAC address
2. source IP address
3. destination MAC address
4. ethernet type
5. destination IP address

**Ответ:** destination MAC address.

**Объяснение:** Destination MAC — поле, по которому L2-устройство выбирает порт пересылки. Source MAC используется для обучения таблицы, EtherType сообщает протокол полезной нагрузки, а source/destination IP находятся в сетевом пакете и не являются ключом обычной Ethernet-коммутации.

**Explanation in English:** Destination MAC selects the Layer 2 forwarding port. Source MAC teaches the table; EtherType identifies the payload protocol. Source/destination IP are network-packet fields rather than the key for ordinary Ethernet switching.

### E594. What statement describes the function of the Address Resolution Protocol?

Источник: тесты_exam_2, Q16. Тема: модуль 9.

1. ARP is used to discover the IP address of any host on a different network.
2. ARP is used to discover the IP address of any host on the local network.
3. ARP is used to discover the MAC address of any host on a different network.
4. ARP is used to discover the MAC address of any host on the local network.

**Ответ:** ARP is used to discover the MAC address of any host on the local network..

**Объяснение:** ARP узнаёт MAC локального IPv4-соседа по уже известному IPv4. Он не ищет IP неизвестного устройства и не переносит запрос через роутеры в чужую сеть. Для удалённой сети разрешается MAC своего шлюза, который находится локально.

**Explanation in English:** ARP discovers a local IPv4 neighbor’s MAC from its already-known IPv4 address. It does not discover an unknown IP or carry requests through routers into remote networks. Off-subnet traffic resolves the local gateway’s MAC instead.

### E610. What property of ARP forces all Ethernet NICs to process an ARP request?

Источник: тесты_exam_2, Q32. Тема: модуль 9.

1. The destination MAC address FF-FF-FF-FF-FF-FF appears in the header of the Ethernet frame.
2. The source MAC address appears in the header of the Ethernet frame.
3. The type field 0x806 appears in the header of the Ethernet frame.
4. ARP replies are broadcast on the network when a host receives an ARP request.

**Ответ:** The destination MAC address FF-FF-FF-FF-FF-FF appears in the header of the Ethernet frame..

**Объяснение:** Именно destination FF-FF-FF-FF-FF-FF заставляет Ethernet NIC принять broadcast-кадр. Source MAC только обозначает отправителя; EtherType 0x0806 после приёма сообщает, что внутри ARP, но сам не делает кадр адресованным всем. Обычный ARP reply — unicast, не broadcast.

**Explanation in English:** Destination FF-FF-FF-FF-FF-FF makes Ethernet NICs accept the broadcast frame. Source MAC merely identifies the sender; EtherType 0x0806 identifies ARP after reception but does not make the frame addressed to everyone. An ordinary ARP reply is unicast.

### E701. Which destination address is used in an ARP request frame?

Источник: тесты_exam_6, Q23. Тема: модуль 9.

1. 0.0.0.0
2. 255.255.255.255
3. FFFF.FFFF.FFFF
4. AAAA.AAAA.AAAA
5. the physical address of the destination host

**Ответ:** FFFF.FFFF.FFFF.

**Объяснение:** FFFF.FFFF.FFFF — Ethernet broadcast, нужный потому, что MAC искомого IPv4 ещё неизвестен. 0.0.0.0 и 255.255.255.255 относятся к IPv4, а поле destination в кадре требует MAC. AAAA.AAAA.AAAA не является broadcast; уже известный физический адрес цели устранил бы необходимость обычного запроса.

**Explanation in English:** FFFF.FFFF.FFFF is Ethernet broadcast, used because the target IPv4’s MAC is still unknown. 0.0.0.0 and 255.255.255.255 are IPv4 values, while a frame destination requires MAC. AAAA.AAAA.AAAA is not broadcast; an already-known target MAC would avoid the ordinary lookup.

### E703. Refer to the exhibit. PC1 issues an ARP request because it needs to send a packet to PC3. In this scenario, what will happen next?

Источник: тесты_exam_6, Q25. Тема: модуль 9.

1. RT1 will forward the ARP request to PC3.
2. RT1 will send an ARP reply with its own Fa0/0 MAC address.
3. RT1 will send an ARP reply with the PC3 MAC address.
4. SW1 will send an ARP reply with its Fa0/1 MAC address.
5. RT1 will send an ARP reply with its own Fa0/1 MAC address.

> Нужна схема: локальный интерфейс RT1 и подсеть PC3 не подтверждены.

**Ответ:** RT1 will send an ARP reply with its own Fa0/0 MAC address..

**Объяснение:** Сохранённый ответ Fa0/0 RT1 требует, чтобы PC3 был удалённым, а Fa0/0 RT1 — локальным gateway PC1. Роутер отвечает своим MAC на запрос о своём IP; не пересылает ARP-broadcast к PC3 и не возвращает удалённый PC3 MAC. Без схемы нельзя подтвердить выбор Fa0/0 вместо Fa0/1.

**Explanation in English:** The saved RT1 Fa0/0 answer assumes PC3 is remote and RT1 Fa0/0 is PC1’s local gateway. The router replies with its own MAC for its own IP; it does not forward ARP broadcast to PC3 or return PC3’s remote MAC. The missing exhibit prevents verifying Fa0/0 versus Fa0/1.

### E742. Match the header field with the appropriate layer of the OSI model. FCS (frame check sequence) Layer 2 802.2 header destination MAC address source IP address Layer 3 TTL destination port number Layer 4 Acknowledgement number

Источник: тесты_exam_7, Q9. Тема: модуль 9.



> Ответ

**Ответ:** Layer 2 → FCS, 802.2 header, destination MAC; Layer 3 → source IP, TTL; Layer 4 → destination port, acknowledgement number.

**Объяснение:** FCS проверяет кадр, 802.2 описывает LLC, destination MAC адресует канал — это Layer 2 (FCS технически находится в trailer, не header). Source IP и TTL относятся к IP-пакету, Layer 3. Destination port выбирает приложение, TCP acknowledgment отслеживает ожидаемые байты — Layer 4.

**Explanation in English:** FCS checks the frame, 802.2 describes LLC and destination MAC addresses the link: Layer 2 (FCS is technically in the trailer, not header). Source IP and TTL belong to the Layer 3 IP packet. Destination port selects an application and TCP acknowledgment tracks expected bytes at Layer 4.

### E751. Refer to the exhibit. PC1 issues an ARP request because it needs to send a packet to PC2. In this scenario, what will happen next?

Источник: тесты_exam_7, Q18. Тема: модуль 9.

1. PC2 will send an ARP reply with its MAC address.
2. RT1 will send an ARP reply with its Fa0/0 MAC address.
3. RT1 will send an ARP reply with the PC2 MAC address.
4. SW1 will send an ARP reply with the PC2 MAC address.
5. SW1 will send an ARP reply with its Fa0/1 MAC address.

> Нужна схема: общая подсеть PC1 и PC2 не подтверждена.

**Ответ:** PC2 will send an ARP reply with its MAC address..

**Объяснение:** Ответ PC2 предполагает, что PC1 и PC2 находятся в одной подсети. Тогда target IPv4 в ARP принадлежит PC2, и именно он отвечает своим MAC; switch лишь переносит кадры, а gateway не отвечает вместо обычного локального получателя. Без схемы общую подсеть нельзя проверить.

**Explanation in English:** PC2 is the answer if PC1 and PC2 share a subnet. The ARP target IPv4 then belongs to PC2, which replies with its own MAC; a switch merely forwards and the gateway does not normally answer for that local host. The missing exhibit prevents confirming the shared subnet.

### E754. Which two statements are correct about MAC and IP addresses during data transmission if NAT is not involved? (Choose two.)

Источник: тесты_exam_7, Q21. Тема: модуль 9.

1. A packet that has crossed four routers has changed the destination IP address four times.
2. Destination MAC addresses will never change in a frame that goes across seven routers.
3. Destination and source MAC addresses have local significance and change every time a frame goes from one LAN to another.
4. Destination IP addresses in a packet header remain constant along the entire path to a target host.
5. Every time a frame is encapsulated with a new destination MAC address, a new destination IP address is needed.

**Ответ:** Destination and source MAC addresses have local significance and change every time a frame goes from one LAN to another.; Destination IP addresses in a packet header remain constant along the entire path to a target host..

**Объяснение:** Без NAT destination IP обозначает конечного получателя и остаётся тем же на маршруте. MAC действует только на текущем Ethernet-канале: роутер снимает старую оболочку и создаёт новую со своим исходящим MAC и MAC следующего соседа. Поэтому изменение MAC не требует изменения IP, а количество роутеров не равно количеству замен destination IP.

**Explanation in English:** Without NAT, destination IP identifies the final recipient and remains unchanged along the route. MAC addresses apply only to the current Ethernet link: each router replaces the frame with its outgoing MAC and the next neighbor’s MAC. A new MAC does not require a new IP, and router count does not imply destination-IP changes.

### E756. What are two features of ARP? (Choose two.)

Источник: тесты_exam_7, Q23. Тема: модуль 9.

1. If a host is ready to send a packet to a local destination device and it has the IP address but not the MAC address of the destination, it generates an ARP broadcast.
2. An ARP request is sent to all devices on the Ethernet LAN and contains the IP address of the destination host and its multicast MAC address.
3. When a host is encapsulating a packet into a frame, it refers to the MAC address table to determine the mapping of IP addresses to MAC addresses.
4. If no device responds to the ARP request, then the originating node will broadcast the data packet to all devices on the network segment.
5. If a device receiving an ARP request has the destination IPv4 address, it responds with an ARP reply.

**Ответ:** If a host is ready to send a packet to a local destination device and it has the IP address but not the MAC address of the destination, it generates an ARP broadcast.; If a device receiving an ARP request has the destination IPv4 address, it responds with an ARP reply..

**Объяснение:** Если у локального IPv4 нет записи в ARP-кэше, отправитель рассылает запрос; владелец target IPv4 отвечает — это два верных действия. Запрос не содержит уже известный multicast MAC цели. IPv4→MAC ищут в ARP-кэше, а не MAC→порт таблице switch. Без ответа отправитель не превращает сам пакет данных в broadcast: после неуспешного разрешения доставка не состоится.

**Explanation in English:** With no cached MAC for a local IPv4, the sender broadcasts an ARP request and the target IPv4 owner replies: these are the two correct actions. The request does not contain a known target multicast MAC. IP-to-MAC lookup uses ARP cache, not the switch’s MAC-to-port table. Failure to resolve does not turn the data packet into broadcast; delivery ultimately fails.

### E761. A user sends an HTTP request to a web server on a remote network. During encapsulation for this request, what information is added to the address field of a frame to indicate the destination?

Источник: тесты_exam_7, Q28. Тема: модуль 9.

1. the MAC address of the destination host
2. the network domain of the destination host
3. the MAC address of the default gateway
4. the IP address of the default gateway

**Ответ:** the MAC address of the default gateway.

**Объяснение:** Вопрос спрашивает адрес в Ethernet-кадре, а сервер находится в удалённой сети: первый кадр адресуют MAC default gateway. IP сервера остаётся в IP-пакете. IP шлюза не помещается в поле MAC, доменное имя разрешается раньше через DNS, а MAC удалённого сервера не используется на первом локальном канале.

**Explanation in English:** The question asks for the Ethernet-frame destination, and the server is off-subnet: the first frame targets the default gateway’s MAC. The server IP stays in the IP packet. The gateway IP cannot fill a MAC field, DNS resolves the domain earlier, and the remote server’s MAC is not used on the first local link.

### E036. Which IOS mode allows access to all commands and features?

Источник: модули_02, Q1. Тема: модуль 10.

1. Global configuration mode
2. Interface subconfiguration mode
3. Line console subconfiguration mode
4. Privileged EXEC mode
5. User EXEC mode

**Ответ:** Privileged EXEC mode.

**Объяснение:** Privileged EXEC (#) даёт полный административный доступ и позволяет перейти к конфигурации через configure terminal. User EXEC (>) ограничен мониторингом; global/interface/line configuration — отдельные режимы изменения настроек. «Все команды» в формулировке означает полный доступ к возможностям, а не возможность вводить любую команду прямо в приглашении #.

**Explanation in English:** Privileged EXEC (#) grants full administrative access and permits entry to configuration through configure terminal. User EXEC (>) offers limited monitoring; global/interface/line configuration are specific editing modes. “All commands” means access to all capabilities, not that every configuration command is entered directly at the # prompt.

### E037. Which IOS mode are you in if the Switch(config)# prompt is displayed?

Источник: модули_02, Q2. Тема: модуль 10.

1. Global configuration mode
2. Interface subconfiguration mode
3. Line console subconfiguration mode
4. Privileged EXEC mode
5. User EXEC mode

**Ответ:** Global configuration mode.

**Объяснение:** Маркер (config) в Switch(config)# обозначает global configuration: здесь меняют настройки устройства в целом. Голый # — privileged EXEC, > — user EXEC; (config-if) и (config-line) означали бы интерфейс и линию соответственно.

**Explanation in English:** The (config) marker identifies global configuration, where device-wide settings are changed. A bare # indicates privileged EXEC and > user EXEC; interface and line modes would show (config-if) and (config-line).

### E038. Which IOS mode are you in if the Switch> prompt is displayed?

Источник: модули_02, Q3. Тема: модуль 10.

1. Global configuration mode
2. Interface subconfiguration mode
3. Line console subconfiguration mode
4. Privileged EXEC mode
5. User EXEC mode

**Ответ:** User EXEC mode.

**Объяснение:** Знак > без (config) — user EXEC, начальный режим с ограниченными командами просмотра. После enable приглашение станет Switch#; при входе в настройку появится (config)#. Поэтому ни privileged EXEC, ни режимы конфигурации здесь не подходят.

**Explanation in English:** A > prompt without (config) identifies user EXEC, the initial mode with limited monitoring commands. enable changes it to Switch#; configuration adds (config)#. Thus neither privileged EXEC nor a configuration mode matches this prompt.

### E039. Which two commands would return you to the privileged EXEC prompt regardless of the configuration mode you are in? (Choose two.)

Источник: модули_02, Q4. Тема: модуль 10.

1. CTRL+Z
2. disable
3. enable
4. end
5. exit

**Ответ:** CTRL+Z; end.

**Объяснение:** end и Ctrl+Z сразу завершают любую вложенную конфигурацию и возвращают к privileged EXEC (#). exit поднимает только на один уровень; enable предназначен для перехода из user EXEC, а disable понижает privileged EXEC до user EXEC.

**Explanation in English:** end and Ctrl+Z leave any nested configuration mode and return directly to privileged EXEC (#). exit moves up only one level; enable elevates user EXEC, while disable drops privileged EXEC to user EXEC.

### E040. What is the command to assign the name “Sw-Floor-2” to a switch?

Источник: модули_02, Q1. Тема: модуль 10.

1. hostname Sw-Floor-2
2. host name Sw-Floor-2
3. name Sw-Floor-2

**Ответ:** hostname Sw-Floor-2.

**Объяснение:** В global configuration команда hostname принимает новое имя одним аргументом: hostname Sw-Floor-2. Ключевое слово пишется слитно; host name и name не являются этим синтаксисом IOS. Имя изменит префикс приглашения, но не режим CLI.

**Explanation in English:** In global configuration, hostname takes the new name as its argument: hostname Sw-Floor-2. The keyword is one word; host name and name are not this IOS syntax. It changes the prompt name without changing CLI mode.

### E041. How is the privileged EXEC mode access secured on a switch?

Источник: модули_02, Q2. Тема: модуль 10.

1. enable class
2. secret class
3. enable secret class
4. service password-encryption

**Ответ:** enable secret class.

**Объяснение:** enable secret class задаёт секрет для перехода по enable в privileged EXEC; class здесь учебное значение пароля. enable class и secret class имеют неверный синтаксис. service password-encryption скрывает уже заданные открытые пароли, но само не задаёт пароль privileged EXEC.

**Explanation in English:** enable secret class sets the secret required when using enable to enter privileged EXEC; class is the sample password. enable class and secret class are invalid syntax. service password-encryption obscures existing plaintext passwords but does not itself set the privileged EXEC password.

### E044. Which is the command to configure a banner to be displayed when connecting to a switch?

Источник: модули_02, Q5. Тема: модуль 10.

1. banner $ Keep out $
2. banner motd $ Keep out $
3. display $ Keep out $
4. login banner $ Keep out $

**Ответ:** banner motd $ Keep out $.

**Объяснение:** Правильный синтаксис — banner motd, затем одинаковый разделитель до и после текста: $ Keep out $. IOS показывает этот текст при подключении. Остальные варианты не содержат корректного ключевого слова motd/синтаксиса banner; сообщение само по себе не проверяет пароль.

**Explanation in English:** The syntax is banner motd followed by the same delimiter before and after the text: $ Keep out $. IOS displays it on connection. The alternatives lack the correct motd/banner syntax; the message itself performs no authentication.

### E047. What type of interface has no physical port associated with it?

Источник: модули_02, Q3. Тема: модуль 10.

1. Console
2. Ethernet
3. Serial
4. Switch virtual interface (SVI)

**Ответ:** Switch virtual interface (SVI).

**Объяснение:** SVI — программный интерфейс VLAN, поэтому отдельного разъёма у него нет. Он представляет коммутатор в IP-сети для управления. Console, Ethernet и Serial в этих вариантах относятся к физическим подключениям.

**Explanation in English:** An SVI is a software VLAN interface and therefore has no dedicated physical connector. It gives the switch an IP presence for management. Console, Ethernet and Serial in these choices refer to physical connections.

### E048. Which statement is true about the running configuration file in a Cisco IOS device?

Источник: модули_02, Q1. Тема: модуль 10.

1. It affects the operation of the device immediately when modified.
2. It is stored in NVRAM.
3. It should be deleted using the erase running-config command.
4. It is automatically saved when the router reboots.

**Ответ:** It affects the operation of the device immediately when modified..

**Объяснение:** running-config — активная конфигурация в RAM: корректная команда изменяет работу устройства сразу. NVRAM хранит startup-config, а не running-config. Перезагрузка не сохраняет изменения автоматически; их сохраняют copy running-config startup-config.

**Explanation in English:** running-config is the active configuration in RAM, so a valid change affects operation immediately. NVRAM stores startup-config, not running-config. Rebooting does not automatically save changes; copy running-config startup-config does.

### E049. Which two statements are true regarding the user EXEC mode? (Choose two.)

Источник: модули_02, Q2. Тема: модуль 10.

1. All router commands are available.
2. Global configuration mode can be accessed by entering the enable command.
3. The device prompt for this mode ends with the '>' symbol.
4. Interfaces and routing protocols can be configured.
5. Only some aspects of the router configuration can be viewed.

**Ответ:** The device prompt for this mode ends with the '>' symbol.; Only some aspects of the router configuration can be viewed..

**Объяснение:** У user EXEC приглашение заканчивается > и доступна лишь часть команд просмотра. enable переводит в privileged EXEC, не сразу в global configuration; для последнего затем нужен configure terminal. Интерфейсы и routing protocols из user EXEC не настраиваются.

**Explanation in English:** User EXEC ends in > and permits only limited inspection. enable enters privileged EXEC, not global configuration directly; configure terminal is then required. Interfaces and routing protocols cannot be configured from user EXEC.

### E050. Which type of access is secured on a Cisco router or switch with the enable secret command?

Источник: модули_02, Q3. Тема: модуль 10.

1. Virtual terminal
2. Privileged EXEC
3. AUX port
4. Console line

**Ответ:** Privileged EXEC.

**Объяснение:** enable secret защищает повышение прав до privileged EXEC. Console, AUX и VTY — другие точки входа: их аутентификация задаётся в line configuration (login/password либо login local). Наличие enable secret не заменяет пароль входа на эти линии.

**Explanation in English:** enable secret protects elevation to privileged EXEC. Console, AUX and VTY are separate entry points whose authentication is configured under line configuration using login/password or login local. An enable secret does not replace line login authentication.

### E051. What is the default SVI on a Cisco switch?

Источник: модули_02, Q4. Тема: модуль 10.

1. VLAN1
2. VLAN99
3. VLAN100
4. VLAN999

**Ответ:** VLAN1.

**Объяснение:** В базовом состоянии учебного Cisco-коммутатора SVI связан с VLAN 1. VLAN 99, 100 или 999 могут быть выбраны администратором для управления, но не являются значением по умолчанию. Наличие VLAN 1 ещё не означает настроенный IP или доступность управления.

**Explanation in English:** The default SVI in the course switch configuration is VLAN 1. An administrator can choose VLAN 99, 100 or 999 for management, but these are not the default. VLAN 1 existing does not itself imply a configured IP or working remote management.

### E052. When a hostname is configured through the Cisco CLI, which three naming conventions are part of the guidelines? (Choose three.)

Источник: модули_02, Q5. Тема: модуль 10.

1. The hostname should be fewer than 64 characters in length
2. The hostname should be written in all lower case characters
3. The hostname should contain no spaces
4. The hostname should end with a special character
5. The hostname should begin with a letter

**Ответ:** The hostname should be fewer than 64 characters in length; The hostname should contain no spaces; The hostname should begin with a letter.

**Объяснение:** В правилах курса hostname начинается с буквы, не содержит пробелов и имеет менее 64 символов. Только нижний регистр не обязателен. Заканчиваться специальным символом нельзя: последний символ должен быть буквой или цифрой.

**Explanation in English:** Course hostname guidelines require a leading letter, no spaces and fewer than 64 characters. Lowercase-only spelling is not required. The name should end in a letter or digit, not a special character.

### E055. An administrator has just changed the IP address of an interface on an IOS device. What else must be done in order to apply those changes to the device?

Источник: модули_02, Q8. Тема: модуль 10.

1. Copy the running configuration to the startup configuration file.
2. Copy the information in the startup configuration file to the running configuration.
3. Reload the device and type yes when prompted to save the configuration.
4. Nothing must be done. Changes to the configuration on an IOS device take effect as soon as the command is typed correctly and the Enter key has been pressed.

**Ответ:** Nothing must be done. Changes to the configuration on an IOS device take effect as soon as the command is typed correctly and the Enter key has been pressed..

**Объяснение:** IP-адрес интерфейса изменяется в running-config сразу после принятия команды, поэтому отдельное apply или reload не требуется. copy running-config startup-config нужно для сохранения после перезагрузки, а обратное копирование загружает старую конфигурацию. Для фактической связи интерфейс также должен быть включён и подключён.

**Explanation in English:** The interface IP changes in running-config as soon as the command is accepted, so no separate apply or reload is needed. copy running-config startup-config preserves it across reboot; copying the other way loads saved settings. Actual communication also requires an enabled, connected interface.

### E056. Which memory location on a Cisco router or switch will lose all content when the device is restarted?

Источник: модули_02, Q9. Тема: модуль 10.

1. ROM
2. Flash
3. NVRAM
4. RAM

**Ответ:** RAM.

**Объяснение:** RAM энергозависима: рабочая конфигурация и динамические таблицы теряются при отключении питания/перезапуске. ROM, Flash и NVRAM сохраняют свои данные, поэтому они не подходят под условие «lose all content».

**Explanation in English:** RAM is volatile: active configuration and dynamic tables are lost on power cycling/restart. ROM, Flash and NVRAM retain their data, so they do not fit “lose all content”.

### E057. Why would a technician enter the command copy startup-config running-config ?

Источник: модули_02, Q10. Тема: модуль 10.

1. To remove all configurations from the switch
2. To save an active configuration to NVRAM
3. To copy an existing configuration into RAM
4. To make a changed configuration the new startup configuration

**Ответ:** To copy an existing configuration into RAM.

**Объяснение:** В copy сначала указан источник, потом назначение: startup-config → running-config загружает сохранённые команды в RAM. Команды объединяются с текущими, а не обязательно полностью заменяют их. Для сохранения в NVRAM направление было бы обратным; удаления конфигурации эта команда не выполняет.

**Explanation in English:** copy lists source first and destination second: startup-config → running-config loads saved commands into RAM. They merge with the current configuration rather than necessarily replacing it completely. Saving to NVRAM uses the reverse direction; this command does not erase configuration.

### E059. Which two functions are provided to users by the context-sensitive help feature of the Cisco IOS CLI? (Choose two.)

Источник: модули_02, Q12. Тема: модуль 10.

1. Providing an error message when a wrong command is submitted
2. Displaying a list of all available commands within the current mode
3. Allowing the user to complete the remainder of an abbreviated command with the TAB key
4. Determining which option, keyword, or argument is available for the entered command
5. Selecting the best command to accomplish a task

**Ответ:** Displaying a list of all available commands within the current mode; Determining which option, keyword, or argument is available for the entered command.

**Объяснение:** Контекстная справка ? перечисляет команды текущего режима или допустимые следующие keywords/arguments после уже введённого текста. Tab — отдельное дополнение слова; сообщение об ошибке появляется после неверного ввода. Справка не выбирает за администратора лучший способ решения задачи.

**Explanation in English:** Context-sensitive ? help lists commands available in the current mode or valid next keywords/arguments after entered text. Tab completion is a separate feature; an error message follows invalid input. Help does not choose the best solution to a task for the administrator.

### E060. Which memory location on a Cisco router or switch stores the startup configuration file?

Источник: модули_02, Q13. Тема: модуль 10.

1. RAM
2. ROM
3. NVRAM
4. Flash

**Ответ:** NVRAM.

**Объяснение:** В принятой в курсе архитектуре startup-config хранится в энергонезависимой NVRAM и читается при загрузке. RAM содержит действующую running-config; Flash обычно хранит образ IOS; ROM — начальный код загрузки/диагностики.

**Explanation in English:** In the course architecture, nonvolatile NVRAM holds startup-config for loading at boot. RAM holds active running-config, Flash normally holds the IOS image, and ROM contains initial boot/diagnostic code.

### E074. A device receives a data link frame with data and processes and removes the Ethernet information. What information would be the next to be processed by the receiving device?

Источник: модули_03, Q5. Тема: модуль 10.

1. HTTP at the application layer
2. HTML at the application layer
3. IP at the internet layer
4. UDP at the internet layer
5. TCP at the transport layer

**Ответ:** IP at the internet layer.

**Объяснение:** При decapsulation оболочки снимаются снаружи внутрь: Ethernet содержит IP-пакет, поэтому после Ethernet обрабатывается IP на internet/network layer. TCP/UDP находятся внутри IP, HTTP — ещё выше; UDP к internet layer не относится.

**Explanation in English:** Decapsulation removes outer headers first: Ethernet contains an IP packet, so IP at the internet/network layer is next. TCP/UDP are inside IP and HTTP is above them; UDP is not an internet-layer protocol.

### E084. True or false? Frames exchanged between devices in different IP networks must be forwarded to a default gateway.

Источник: модули_03, Q1. Тема: модуль 10.

1. True
2. False

**Ответ:** True.

**Объяснение:** В обычной схеме курса хост видит по маске, что получатель в другой сети, и отправляет первый кадр локальному шлюзу. L2-коммутатор сам не выполняет IP-маршрутизацию. Уточнение: технически хост может иметь более специфичный маршрут через другой роутер; утверждение про default gateway предполагает обычный хост без такого маршрута.

**Explanation in English:** In the course’s ordinary host setup, the mask shows that the destination is remote, so the first frame is addressed to the local gateway. A Layer 2 switch does not perform IP routing. Strictly, a host may have a more-specific route through another router; the default-gateway statement assumes the usual host without such a route.

### E089. True or False? Data Link addresses are physical so they never change in the data link frame from source to destination.

Источник: модули_03, Q6. Тема: модуль 10.

1. True
2. False

**Ответ:** False.

**Объяснение:** False: роутер снимает входной кадр и создаёт новый для следующего канала. Поэтому source/destination MAC относятся к текущему переходу, а не всему пути. Слово physical не делает MAC-пару в пересылаемых кадрах неизменной; IP конечных узлов обычно сохраняются при отсутствии NAT.

**Explanation in English:** False: a router removes the incoming frame and builds another for the next link. Source/destination MAC addresses therefore describe the current hop, not the whole path. “Physical” does not make the MAC pair in forwarded frames immutable; endpoint IPs normally remain unchanged without NAT.

### E102. What is done to an IP packet before it is transmitted over the physical medium?

Источник: модули_03, Q13. Тема: модуль 10.

1. It is tagged with information guaranteeing reliable delivery.
2. It is segmented into smaller individual pieces.
3. It is encapsulated into a TCP segment.
4. It is encapsulated in a Layer 2 frame.

**Ответ:** It is encapsulated in a Layer 2 frame..

**Объяснение:** Канальный уровень оборачивает IP-пакет в Layer 2 frame для конкретной среды, после чего физический уровень передаёт биты. TCP-сегмент находится внутри IP, а не снаружи. Ни L2-инкапсуляция, ни IP сами по себе не гарантируют надёжную доставку.

**Explanation in English:** The data link layer encapsulates an IP packet in a Layer 2 frame appropriate to the medium, then the physical layer sends bits. A TCP segment is inside IP, not its outer wrapper. Neither this encapsulation nor IP itself guarantees reliable delivery.

### E152. What Layer 2 function does a router perform? (Choose three.)

Источник: модули_06, Q4. Тема: модуль 10.

1. Accepts a frame from a medium
2. De-encapsulates the frame
3. Refers to its Layer 3 routing table for a matching destination network
4. Re-encapsulates the packet into a new frame

**Ответ:** Accepts a frame from a medium; De-encapsulates the frame; Re-encapsulates the packet into a new frame.

**Объяснение:** К L2 относятся приём кадра, снятие его оболочки и создание нового кадра на выходе. Поиск destination network в routing table — решение L3, поэтому этот вариант не входит в три канальные функции, хотя роутер выполняет его между decapsulation и re-encapsulation.

**Explanation in English:** Receiving a frame, removing its encapsulation and building an outgoing frame are Layer 2 functions. Looking up a destination network in the routing table is Layer 3, so it is excluded even though the router performs it between decapsulation and re-encapsulation.

### E258. A router boots and enters setup mode. What is the reason for this?

Источник: модули_10, Q1; тесты_exam_2, Q18; тесты_exam_6, Q26. Тема: модуль 10.

1. The IOS image is corrupt.
2. Cisco IOS is missing from flash memory.
3. The configuration file is missing from NVRAM.
4. The POST process has detected hardware failure.

**Ответ:** The configuration file is missing from NVRAM..

**Объяснение:** Setup mode предлагает первичную конфигурацию, когда IOS загрузился, но startup-config не найден в NVRAM. Повреждённый/отсутствующий IOS относится к проблеме загрузки ОС, а отказ POST — к аппаратной диагностике; они не объясняют обычный диалог настройки работающего IOS.

**Explanation in English:** Setup mode offers initial configuration when IOS has loaded but no startup-config is found in NVRAM. Missing/corrupt IOS is an operating-system boot problem and POST failure is hardware diagnosis; neither describes the normal setup dialog in running IOS.

### E259. Which command is used to encrypt all passwords in a router configuration file?

Источник: модули_10, Q2. Тема: модуль 10.

1. Router_A (config) # enable secret <password>
2. Router_A (config) # service password-encryption
3. Router_A (config) # enable password <password>
4. Router_A (config) # encrypt password

**Ответ:** Router_A (config) # service password-encryption.

**Объяснение:** service password-encryption в global configuration скрывает поддерживаемые открытые пароли в конфигурации. enable secret задаёт только секрет privileged EXEC; enable password задаёт один пароль и сам по себе не скрывает все остальные. В классическом IOS это слабая обратимая Type 7, а не защита трафика или сильное шифрование всех секретов.

**Explanation in English:** service password-encryption in global configuration obscures supported plaintext passwords in the configuration. enable secret sets only the privileged EXEC secret; enable password sets one password without obscuring others. In classic IOS this is weak reversible Type 7, not traffic encryption or strong protection for every secret.

### E260. Company policy requires using the most secure method to safeguard access to the privileged exec and configuration mode on the routers. The privileged exec password is trustknow1 . Which of the following router commands achieves the goal of providing the highest level of security?

Источник: модули_10, Q3. Тема: модуль 10.

1. secret password trustknow1
2. enable password trustknow1
3. service password-encryption
4. enable secret trustknow1

**Ответ:** enable secret trustknow1.

**Объяснение:** Среди вариантов enable secret trustknow1 — корректный способ задать хешируемый секрет для privileged EXEC, откуда доступны настройки. enable password — более слабый старый вариант; service password-encryption не задаёт секрет и использует слабое скрытие открытых паролей. trustknow1 здесь значение из задачи, не рекомендация хорошего пароля.

**Explanation in English:** Among the options, enable secret trustknow1 correctly sets a hashed secret for privileged EXEC, which gives access to configuration. enable password is the weaker legacy option; service password-encryption neither sets this secret nor provides strong protection. trustknow1 is the exercise value, not a recommended strong password.

### E261. What will be the response from the router after the command, "router(config)# hostname portsmouth \" is entered?

Источник: модули_10, Q4. Тема: модуль 10.

1. portsmouth#
2. portsmouth(config)#
3. invalid input detected
4. router(config-host)#
5. hostname = portsmouth portsmouth#
6. ? command not recognized router(config)#

**Ответ:** portsmouth(config)#.

**Объяснение:** hostname portsmouth меняет имя router на portsmouth, но оставляет текущий global configuration mode. Поэтому получается portsmouth(config)#. Голый portsmouth# означал бы переход в privileged EXEC, которого команда hostname не делает; режима config-host для этой команды нет.

**Explanation in English:** hostname portsmouth changes the name from router to portsmouth while retaining global configuration mode. The result is portsmouth(config)#. A bare portsmouth# would imply a mode change that hostname does not perform; there is no config-host mode for this command.

### E262. An administrator is configuring a new router to permit out-of-band management access. Which set of commands will allow the required login using a password of cisco ?

Источник: модули_10, Q5. Тема: модуль 10.

1. Router(config)# line vty 0 4 Router(config-line)# password manage Router(config-line)# exit Router(config)# enable password cisco
2. Router(config)# line vty 0 4 Router(config-line)# password cisco Router(config-line)# login
3. Router(config)# line console 0 Router(config-line)# password cisco Router(config-line)# login
4. Router(config)# line console 0 Router(config-line)# password cisco Router(config-line)# exit Router(config)# service password-encryption

**Ответ:** Router(config)# line console 0 Router(config-line)# password cisco Router(config-line)# login.

**Объяснение:** Out-of-band доступ в данном случае идёт через console, поэтому нужны line console 0, password cisco и login. VTY обеспечивает сетевой удалённый доступ. Без login заданный line password не включит требуемую проверку; enable password защищает повышение прав, а не вход на console.

**Explanation in English:** Here out-of-band access uses the console, requiring line console 0, password cisco and login. VTY is network remote access. Without login the line password does not enable the requested authentication; enable password protects privilege elevation, not console login.

### E263. Which command can be used on a Cisco router to display all interfaces, the IPv4 address assigned, and the current status?

Источник: модули_10, Q6. Тема: модуль 10.

1. show ip interface brief
2. ping
3. show ip route
4. show interface fa0/1

**Ответ:** show ip interface brief.

**Объяснение:** show ip interface brief сводит все интерфейсы, IPv4-адреса, Status и Protocol в одну таблицу. ping проверяет достижимость, show ip route показывает маршруты, а show interface fa0/1 ограничивается одним интерфейсом и выдаёт подробности вместо общей сводки.

**Explanation in English:** show ip interface brief summarizes all interfaces, IPv4 addresses, Status and Protocol in one table. ping tests reachability, show ip route lists routes, and show interface fa0/1 targets one interface rather than providing the requested overall summary.

### E264. Which CLI mode allows users to access all device commands, such as those used for configuration, management, and troubleshooting?

Источник: модули_10, Q7. Тема: модуль 10.

1. User EXEC mode
2. Privileged EXEC mode
3. Global configuration mode
4. Interface configuration mode

**Ответ:** Privileged EXEC mode.

**Объяснение:** Privileged EXEC (#) даёт полный административный доступ и позволяет перейти к конфигурации через configure terminal. User EXEC (>) ограничен мониторингом; global/interface/line configuration — отдельные режимы изменения настроек. «Все команды» в формулировке означает полный доступ к возможностям, а не возможность вводить любую команду прямо в приглашении #.

**Explanation in English:** Privileged EXEC (#) grants full administrative access and permits entry to configuration through configure terminal. User EXEC (>) offers limited monitoring; global/interface/line configuration are specific editing modes. “All commands” means access to all capabilities, not that every configuration command is entered directly at the # prompt.

### E265. What is the purpose of the startup configuration file on a Cisco router?

Источник: модули_10, Q8. Тема: модуль 10.

1. To facilitate the basic operation of the hardware components of a device
2. To contain the commands that are used to initially configure a router on startup
3. To contain the configuration commands that the router IOS is currently using
4. To provide a limited backup version of the IOS, in case the router cannot load the full featured IOS

**Ответ:** To contain the commands that are used to initially configure a router on startup.

**Объяснение:** startup-config содержит сохранённые команды, которые применяются при запуске IOS. Текущие используемые команды — running-config в RAM. Начальная аппаратная работа и резервная загрузочная среда относятся к ROM/bootstrap, а не к startup-config.

**Explanation in English:** startup-config contains saved commands applied when IOS starts. Currently active commands are running-config in RAM. Initial hardware operation and a limited boot environment belong to ROM/bootstrap, not startup-config.

### E266. Which characteristic describes the default gateway of a host computer?

Источник: модули_10, Q9. Тема: модуль 10.

1. The logical address of the router interface on the same network as the host computer
2. The physical address of the switch interface connected to the host computer
3. The physical address of the router interface on the same network as the host computer
4. The logical address assigned to the switch interface connected to the router

**Ответ:** The logical address of the router interface on the same network as the host computer.

**Объяснение:** Default gateway задаётся логическим IP-адресом локального интерфейса роутера: хост должен достигать его на своём канале перед отправкой в другие сети. MAC — физический адрес, который хост найдёт через ARP; IP L2-коммутатора для управления не заменяет маршрутизатор.

**Explanation in English:** The default gateway is the logical IP address of the router interface on the host’s local network, reachable before forwarding to remote networks. Its MAC is a physical address resolved with ARP; a Layer 2 switch management IP is not a substitute for a router.

### E267. What is the purpose of the banner motd command?

Источник: модули_10, Q10. Тема: модуль 10.

1. It configures a message that will identify printed documents to LAN users.
2. It is a way that routers communicate the status of their links with one another.
3. It provides an easy way of communicating with any user attached to a router's LANs.
4. It provides a way to make announcements to those who log in to a router.

**Ответ:** It provides a way to make announcements to those who log in to a router..

**Объяснение:** banner motd показывает объявление подключающемуся к устройству пользователю, например предупреждение о допустимом доступе. Это не рассылка всем LAN-хостам, не сообщение о состоянии маршрутизаторских каналов и не идентификатор печатных документов.

**Explanation in English:** banner motd displays an announcement to someone connecting to the device, such as an authorized-access notice. It is not a broadcast to all LAN users, a router link-status message or a printed-document identifier.

### E268. A technician is configuring a router to allow for all forms of management access. As part of each different type of access, the technician is trying to type the command login. Which configuration mode should be entered to do this task?

Источник: модули_10, Q11. Тема: модуль 10.

1. User executive mode
2. Global configuration mode
3. Any line configuration mode
4. Privileged EXEC mode

**Ответ:** Any line configuration mode.

**Объяснение:** login — команда line configuration: сначала выбирают console, vty или aux, затем включают проверку входа на этой линии. Global configuration выбирает линию, но сам login вводится в (config-line)#; EXEC-режимы не предназначены для настройки line authentication.

**Explanation in English:** login is a line-configuration command: select console, vty or aux first, then enable login authentication for that line. Global configuration selects the line, but login is entered at (config-line)#; EXEC modes do not configure line authentication.

### E269. What is stored in the NVRAM of a Cisco router?

Источник: модули_10, Q12. Тема: модуль 10.

1. The Cisco IOS
2. The running configuration
3. The bootup instructions
4. The startup configuration

**Ответ:** The startup configuration.

**Объяснение:** В принятой в курсе архитектуре startup-config хранится в энергонезависимой NVRAM и читается при загрузке. RAM содержит действующую running-config; Flash обычно хранит образ IOS; ROM — начальный код загрузки/диагностики.

**Explanation in English:** In the course architecture, nonvolatile NVRAM holds startup-config for loading at boot. RAM holds active running-config, Flash normally holds the IOS image, and ROM contains initial boot/diagnostic code.

### E270. Which statement regarding the service password-encryption command is true?

Источник: модули_10, Q13. Тема: модуль 10.

1. It is configured in privileged EXEC mode.
2. It encrypts only line mode passwords.
3. As soon as the service password-encryption command is entered, all currently set passwords formerly displayed in plain text are encrypted.
4. To see the passwords encrypted by the service password-encryption command in plain text, issue the no service password-encryption command.

**Ответ:** As soon as the service password-encryption command is entered, all currently set passwords formerly displayed in plain text are encrypted..

**Объяснение:** Команда service password-encryption в global configuration сразу скрывает поддерживаемые пароли, ранее показанные открыто, включая line passwords. Она не ограничивается одной линией. no service password-encryption отключает последующее преобразование, но не превращает уже записанные зашифрованные значения обратно в открытый текст.

**Explanation in English:** service password-encryption runs in global configuration and immediately obscures supported existing plaintext passwords, including line passwords. It is not limited to one line. no service password-encryption stops future conversion but does not convert already encoded values back to plaintext.

### E513. Match the description with the associated IOS mode. limited number of basic monitoring commands user EXEC mode done the first entrance into the CLI of an IOS device accessed by entering the enable command privileged EXEC mode identified by a prompt ending with the # character changes made affect the operation of the device as a whole global configuration mode accessed by entering the configure terminal command

Источник: тесты_exam_0, Q2. Тема: модуль 10.



> Ответ

**Ответ:** user EXEC: базовый мониторинг и первый вход в CLI; privileged EXEC: enable, приглашение #; global configuration: configure terminal, изменения всего устройства.

**Объяснение:** User EXEC — первый вход и ограниченный мониторинг (>). enable даёт privileged EXEC (#), откуда доступны административные действия. configure terminal открывает global configuration ((config)#), где hostname и другие глобальные настройки влияют на устройство в целом. Это различие прав и назначения режимов, а не разные физические интерфейсы.

**Explanation in English:** User EXEC is initial access and limited monitoring (>). enable enters privileged EXEC (#) for administrative actions. configure terminal enters global configuration ((config)#), where hostname and other global settings affect the device as a whole. These are privilege/function modes, not physical interfaces.

### E515. What are three characteristics of an SVI? (Choose three.)

Источник: тесты_exam_0, Q4. Тема: модуль 10.

1. It is designed as a security protocol to protect switch ports.
2. It is not associated with any physical interface on a switch.
3. It is a special interface that allows connectivity by different types of media.
4. It is required to allow connectivity by any device at any location.
5. It provides a means to remotely manage a switch.
6. It is associated with VLAN1 by default.

**Ответ:** It is not associated with any physical interface on a switch.; It provides a means to remotely manage a switch.; It is associated with VLAN1 by default..

**Объяснение:** SVI не имеет собственного физического порта, позволяет IP-управление коммутатором и в базовой конфигурации связан с VLAN 1. Это логический интерфейс, не security protocol и не переходник между типами среды. Обычная L2-пересылка пользовательских кадров не требует SVI.

**Explanation in English:** An SVI has no dedicated physical port, enables IP management of the switch, and defaults to VLAN 1 in the basic configuration. It is a logical interface, not a security protocol or media converter. Ordinary Layer 2 forwarding of user frames does not require an SVI.

### E516. Which two host names follow the guidelines for naming conventions on Cisco IOS devices? (Choose two.)

Источник: тесты_exam_0, Q5. Тема: модуль 10.

1. Branch2!
2. RM-3-Switch-2A4
3. Floor(15)
4. HO Floor 17
5. SwBranch799

**Ответ:** RM-3-Switch-2A4; SwBranch799.

**Объяснение:** RM-3-Switch-2A4 и SwBranch799 начинаются с буквы, заканчиваются буквой/цифрой и используют допустимые символы. Branch2! заканчивается !; Floor(15) содержит скобки; HO Floor 17 содержит пробелы. Дефисы внутри первого правильного имени допустимы.

**Explanation in English:** RM-3-Switch-2A4 and SwBranch799 begin with a letter, end with a letter/digit and use permitted characters. Branch2! ends with !, Floor(15) contains parentheses, and HO Floor 17 contains spaces. Internal hyphens in the first correct name are allowed.

### E519. Which command or key combination allows a user to return to the previous level in the command hierarchy?

Источник: тесты_exam_0, Q8. Тема: модуль 10.

1. End
2. Exit
3. Ctrl-Z
4. Ctrl-C

**Ответ:** Exit.

**Объяснение:** exit возвращает на один уровень иерархии, например из (config-if)# в (config)#. end и Ctrl+Z перескакивают прямо в privileged EXEC. Ctrl+C обычно прерывает текущую операцию/ввод и не является командой «на один уровень назад».

**Explanation in English:** exit moves back one hierarchy level, for example from (config-if)# to (config)#. end and Ctrl+Z go directly to privileged EXEC. Ctrl+C normally interrupts an operation/input rather than serving as the one-level-back command.

### E522. What are two characteristics of RAM on a Cisco device? (Choose two.)

Источник: тесты_exam_0, Q11. Тема: модуль 10.

1. RAM provides nonvolatile storage.
2. The configuration that is actively running on the device is stored in RAM.
3. The contents of RAM are lost during a power cycle.
4. RAM is a component in Cisco switches but not in Cisco routers.
5. RAM is able to store multiple versions of IOS and configuration files.

**Ответ:** The configuration that is actively running on the device is stored in RAM.; The contents of RAM are lost during a power cycle..

**Объяснение:** RAM содержит активно используемую running-config и теряет данные при power cycle — обе выбранные характеристики верны. RAM есть и у роутеров, и у коммутаторов. Энергонезависимое хранение нескольких образов IOS относится прежде всего к Flash, не RAM.

**Explanation in English:** RAM contains the active running-config and loses data during a power cycle, making both selected statements correct. Both routers and switches have RAM. Persistent storage of multiple IOS images primarily describes Flash, not RAM.

### E523. What function does pressing the Tab key have when entering a command in IOS?

Источник: тесты_exam_0, Q12. Тема: модуль 10.

1. It aborts the current command and returns to configuration mode.
2. It exits configuration mode and returns to user EXEC mode.
3. It moves the cursor to the beginning of the next line.
4. It completes the remainder of a partially typed word in a command.

**Ответ:** It completes the remainder of a partially typed word in a command..

**Объяснение:** Tab дополняет частично введённое слово, если оно однозначно распознано, например conf до configure. При неоднозначном начале нужно ввести больше символов или использовать ?. Tab не завершает сеанс, не выходит из конфигурации и не отменяет команду.

**Explanation in English:** Tab completes a partially entered word when it is unambiguous, such as conf to configure. Ambiguous input needs more letters or ? help. Tab does not end a session, leave configuration or cancel the command.

### E524. What command is used to verify the condition of the switch interfaces, including the status of the interfaces and a configured IP address?

Источник: тесты_exam_0, Q13. Тема: модуль 10.

1. ipconfig
2. ping
3. traceroute
4. show ip interface brief

**Ответ:** show ip interface brief.

**Объяснение:** show ip interface brief показывает Status/Protocol и назначенный IPv4 для интерфейсов, то есть именно требуемое состояние коммутатора. ipconfig — команда хоста, а ping/traceroute проверяют достижимость/путь и не выводят таблицу локальных интерфейсов IOS.

**Explanation in English:** show ip interface brief displays interface Status/Protocol and assigned IPv4 addresses, matching the requested switch information. ipconfig is a host command; ping/traceroute test reachability/path rather than listing IOS local interfaces.

### E525. While trying to solve a network issue, a technician made multiple changes to the current router configuration file. The changes did not solve the problem and were not saved. What action can the technician take to discard the changes and work with the file in NVRAM?

Источник: тесты_exam_0, Q14. Тема: модуль 10.

1. Issue the reload command without saving the running configuration.
2. Delete the vlan.dat file and reboot the device.
3. Close and reopen the terminal emulation software.
4. Issue the copy startup-config running-config command.

**Ответ:** Issue the reload command without saving the running configuration..

**Объяснение:** Перезагрузка без сохранения удалит несохранённые изменения RAM, затем загрузит startup-config из NVRAM. copy startup-config running-config лишь объединяет конфигурации и может оставить нежелательные команды. Перезапуск терминала не перезагружает роутер; удаление vlan.dat не восстанавливает его конфигурацию. В реальной сети reload прерывает работу, здесь это учебный выбор.

**Explanation in English:** Reloading without saving discards unsaved RAM changes and then loads startup-config from NVRAM. copy startup-config running-config merges configurations and may leave unwanted commands. Restarting a terminal does not reboot the router; deleting vlan.dat does not restore its configuration. A real reload interrupts service; this is the exercise’s choice.

### E526. After making configuration changes on a Cisco switch, a network administrator issues a copy running-config startup-config command. What is the result of issuing this command?

Источник: тесты_exam_0, Q15. Тема: модуль 10.

1. The new configuration will be stored in flash memory.
2. The new configuration will be loaded if the switch is restarted.
3. The current IOS file will be replaced with the newly configured file.
4. The configuration changes will be removed and the original configuration will be restored.

**Ответ:** The new configuration will be loaded if the switch is restarted..

**Объяснение:** Команда сохраняет текущую running-config как startup-config, поэтому новые настройки загрузятся после перезапуска. Это не замена образа IOS и не откат к старым параметрам. В модели курса файл startup-config сохраняется в NVRAM, а не в хранилище образа IOS Flash.

**Explanation in English:** The command saves the current running-config as startup-config, so the new settings load after restart. It neither replaces IOS nor restores old settings. In the course model startup-config is saved in NVRAM, not the Flash location used for the IOS image.

### E540. Refer to the exhibit. An administrator is trying to configure the switch but receives the error message that is displayed in the exhibit. What is the problem?

Источник: тесты_exam_0, Q29; тесты_exam_6, Q5; тесты_exam_7, Q14. Тема: модуль 10.

1. The entire command, configure terminal, must be used.
2. The administrator is already in global configuration mode.
3. The administrator must first enter privileged EXEC mode before issuing the command.
4. The administrator must connect via the console port to access global configuration mode.

> Нужен исходный рисунок/файл активности; сохранённый ответ не подтверждён независимо.

**Ответ:** The administrator must first enter privileged EXEC mode before issuing the command..

**Объяснение:** Сохранённый ответ предполагает приглашение Switch>: configure terminal доступна из privileged EXEC, поэтому сначала нужен enable. Однозначное сокращение conf t допустимо, console не является обязательным способом входа в конфигурацию. Сам рисунок с ошибкой здесь отсутствует, поэтому конкретный вывод нельзя независимо подтвердить.

**Explanation in English:** The saved answer assumes a Switch> prompt: configure terminal requires privileged EXEC, so enable is needed first. An unambiguous abbreviation such as conf t is allowed, and console access is not mandatory for configuration. The actual error exhibit is missing here, so its specific diagnosis cannot be independently confirmed.

### E541. Open the PT Activity. Perform the tasks in the activity instructions and then answer the question. What is the IP address of the switch virtual interface (SVI) on Switch0?

Источник: тесты_exam_0, Q30. Тема: модуль 10.

1. 192.168.5.10
2. 192.168.10.5
3. 192.168.10.1
4. 192.168.5.0

> Нужен исходный рисунок/файл активности; сохранённый ответ не подтверждён независимо.

**Ответ:** 192.168.5.10.

**Объяснение:** 192.168.5.10 — сохранённый ответ для конкретного PT-файла, не адрес по умолчанию у SVI. Его нужно проверить на Switch0 командой show ip interface brief или show running-config в interface vlan. Без исходной активности выбирать между перечисленными IP по теории невозможно; задача исключена из автоматического квиза.

**Explanation in English:** 192.168.5.10 is the saved answer for that PT activity, not a default SVI address. Verify it on Switch0 using show ip interface brief or show running-config under interface vlan. Without the activity, theory cannot distinguish these IPs; the question is excluded from the automatic quiz.

### E580. Within a production network, what is the purpose of configuring a switch with a default gateway address?

Источник: тесты_exam_2, Q2. Тема: модуль 10.

1. Hosts that are connected to the switch can use the switch default gateway address to forward packets to a remote destination.
2. A switch must have a default gateway to be accessible by Telnet and SSH.
3. The default gateway address is used to forward packets originating from the switch to remote networks.
4. It provides a next-hop address for all traffic that flows through the switch.

**Ответ:** The default gateway address is used to forward packets originating from the switch to remote networks..

**Объяснение:** Шлюз L2-коммутатора обслуживает пакеты, источником которых является сам коммутатор: например SSH-ответ администратору в другой сети. Он не подменяет default gateway на подключённых ПК и не используется для каждого транзитного кадра. Управление из той же подсети возможно без шлюза.

**Explanation in English:** A Layer 2 switch gateway serves packets originating from the switch itself, such as SSH replies to an administrator on another subnet. It does not replace gateways configured on attached PCs or handle every transit frame. Same-subnet management can work without a gateway.

### E584. A computer can access devices on the same network but cannot access devices on other networks. What is the probable cause of this problem?

Источник: тесты_exam_2, Q6. Тема: модуль 10.

1. The cable is not connected properly to the NIC.
2. The computer has an invalid IP address.
3. The computer has an incorrect subnet mask.
4. The computer has an invalid default gateway address.

**Ответ:** The computer has an invalid default gateway address..

**Объяснение:** В сценарии наиболее вероятен неверный default gateway: локальные пакеты доставляются напрямую, удалённые требуют роутера. Работа локальной сети делает обрыв кабеля менее вероятным. Неверная маска тоже способна дать похожие симптомы, поэтому это выбор наиболее подходящего варианта, а не окончательный диагноз без проверки IP/mask/gateway.

**Explanation in English:** An invalid default gateway best fits this scenario: local packets are delivered directly, while remote destinations need a router. Working local communication makes a disconnected cable less likely. A wrong mask can also cause similar symptoms, so this is the best listed explanation, not a definitive diagnosis without checking IP/mask/gateway.

### E599. Match the phases to the functions during the boot up process of a Cisco router. A phase 1 perform the POST and load the bootstrap program done B phase 2 locate and load the Cisco IOS software C phase 3 locate and load the startup configuration file

Источник: тесты_exam_2, Q21. Тема: модуль 10.



> Ответ

**Ответ:** 1: POST и bootstrap; 2: поиск и загрузка IOS; 3: поиск и загрузка startup-config.

**Объяснение:** Сначала POST проверяет оборудование и bootstrap начинает загрузку; затем находится и запускается IOS; после этого IOS читает startup-config. Нельзя применить обычные команды конфигурации до запуска ОС, поэтому фазы 2 и 3 не взаимозаменяемы.

**Explanation in English:** POST checks hardware and the bootstrap starts booting first; next IOS is located and loaded; then IOS reads startup-config. Normal configuration commands cannot be applied before the operating system runs, so phases 2 and 3 cannot be reversed.

### E601. What are two functions of NVRAM? (Choose two.)

Источник: тесты_exam_2, Q23. Тема: модуль 10.

1. to store the routing table
2. to retain contents when power is removed
3. to store the startup configuration file
4. to contain the running configuration file
5. to store the ARP table

**Ответ:** to retain contents when power is removed; to store the startup configuration file.

**Объяснение:** NVRAM сохраняет содержимое без питания и хранит startup-config. Routing table, ARP table и running-config — изменяемые рабочие данные в RAM. Поэтому из списка верны сохранность без питания и стартовая конфигурация.

**Explanation in English:** NVRAM retains its contents without power and stores startup-config. Routing table, ARP table and running-config are active working data in RAM. Thus power-independent retention and startup configuration are the two correct choices.

### E602. The global configuration command ip default-gateway 172.16.100.1 is applied to a switch. What is the effect of this command?

Источник: тесты_exam_2, Q24; тесты_exam_7, Q52. Тема: модуль 10.

1. The switch will have a management interface with the address 172.16.100.1.
2. The switch can be remotely managed from a host on another network.
3. The switch can communicate with other hosts on the 172.16.100.0 network.
4. The switch is limited to sending and receiving frames to and from the gateway 172.16.100.1.

**Ответ:** The switch can be remotely managed from a host on another network..

**Объяснение:** ip default-gateway 172.16.100.1 задаёт роутер для исходящего управления L2-коммутатора, чтобы он мог ответить администратору из другой сети. Команда не назначает 172.16.100.1 самому SVI и не ограничивает все кадры одним адресатом. Для результата также нужны настроенный SVI, доступный роутер и разрешённый удалённый доступ.

**Explanation in English:** ip default-gateway 172.16.100.1 sets the router for the Layer 2 switch’s own outbound traffic, allowing replies to administrators on another subnet. It neither assigns 172.16.100.1 to the SVI nor restricts all frames to one destination. A configured SVI, reachable router and enabled management access are also required.

### E603. Match the configuration mode with the command that is available in that mode. A R1(config-line)# login done B R1(config)# interface fastethernet 0/0 C R1# copy running-config startup-config D R1> enable

Источник: тесты_exam_2, Q25. Тема: модуль 10.



> Ответ

**Ответ:** R1(config-line)# → login; R1(config)# → interface fastethernet 0/0; R1# → copy running-config startup-config; R1> → enable.

**Объяснение:** login относится к выбранной линии и вводится в (config-line)#. interface fastethernet 0/0 выбирает интерфейс из (config)#. copy running-config startup-config — административная EXEC-команда в #. enable вводится из > для повышения прав. Важен не только текст команды, но и режим приглашения.

**Explanation in English:** login applies to a selected line at (config-line)#. interface fastethernet 0/0 selects an interface from (config)#. copy running-config startup-config is an administrative EXEC command at #. enable is entered from > to elevate privileges. The prompt mode matters as well as the command text.

### E604. Refer to the exhibit. Consider the IP address configuration shown from PC1. What is a description of the default gateway address?

Источник: тесты_exam_2, Q26. Тема: модуль 10.

1. It is the IP address of the Router1 interface that connects the company to the Internet.
2. It is the IP address of the Router1 interface that connects the PC1 LAN to Router1.
3. It is the IP address of Switch1 that connects PC1 to other devices on the same LAN.
4. It is the IP address of the ISP network device located in the cloud.

> Нужен исходный рисунок/файл активности; сохранённый ответ не подтверждён независимо.

**Ответ:** It is the IP address of the Router1 interface that connects the PC1 LAN to Router1..

**Объяснение:** По смыслу default gateway — IP интерфейса Router1, подключённого к LAN PC1. Хост должен сначала добраться до него локально; WAN-интерфейс, устройство ISP и IP управления Switch1 не подходят. Связь конкретных устройств на рисунке здесь не проверяется, потому что исходный exhibit отсутствует.

**Explanation in English:** By definition, the default gateway is the IP of Router1’s interface on PC1’s LAN. The host must reach it locally first; Router1’s WAN interface, an ISP device and Switch1’s management IP do not fit. The specific diagram connections cannot be verified here because the exhibit is absent.

### E605. What will happen if the default gateway address is incorrectly configured on a host?

Источник: тесты_exam_2, Q27; тесты_exam_7, Q4. Тема: модуль 10.

1. The host cannot communicate with other hosts in the local network.
2. The switch will not forward packets initiated by the host.
3. The host will have to use ARP to determine the correct address of the default gateway.
4. The host cannot communicate with hosts in other networks.
5. A ping from the host to 127.0.0.1 would not be successful.

**Ответ:** The host cannot communicate with hosts in other networks..

**Объяснение:** Неверный шлюз мешает доставлять пакеты в другие сети, но обычно не мешает прямому обмену внутри подсети и loopback ping 127.0.0.1. ARP разрешает заданный IP в MAC, а не исправляет ошибочный IP шлюза. Коммутатор не прекращает L2-пересылку из-за этой настройки хоста.

**Explanation in English:** A wrong gateway prevents reaching other networks but normally leaves direct same-subnet traffic and loopback ping 127.0.0.1 working. ARP resolves the configured IP to a MAC; it does not discover and fix a wrong gateway IP. The switch does not stop Layer 2 forwarding because of the host setting.

### E606. What is the effect of using the Router# copy running-config startup-config command on a router?

Источник: тесты_exam_2, Q28. Тема: модуль 10.

1. The contents of ROM will change.
2. The contents of RAM will change.
3. The contents of NVRAM will change.
4. The contents of flash will change.

**Ответ:** The contents of NVRAM will change..

**Объяснение:** В copy running-config startup-config источник — рабочая конфигурация RAM, назначение — startup-config в NVRAM. Поэтому изменяется содержимое NVRAM. Команда не перезаписывает ROM, образ IOS во Flash или саму конфигурацию-источник в RAM.

**Explanation in English:** In copy running-config startup-config, the source is the active RAM configuration and the destination is startup-config in NVRAM. Therefore NVRAM changes. The command does not overwrite ROM, the IOS image in Flash or the source configuration in RAM.

### E658. Which command can an administrator execute to determine what interface a router will use to reach remote networks?

Источник: тесты_exam_5, Q15. Тема: модуль 10.

1. show arp
2. show interfaces
3. show ip route
4. show protocols

**Ответ:** show ip route.

**Объяснение:** show ip route показывает destination prefixes, next hop и выходной интерфейс, поэтому по нему выбирают путь к удалённой сети. show arp сопоставляет локальные IP/MAC; show interfaces описывает состояние портов; show protocols не заменяет таблицу маршрутов назначения.

**Explanation in English:** show ip route lists destination prefixes, next hops and exit interfaces, allowing the path to a remote network to be identified. show arp maps local IP/MAC pairs, show interfaces describes port status, and show protocols does not replace the destination routing table.

### E661. What information about a Cisco router can be verified using the show version command?

Источник: тесты_exam_5, Q18. Тема: модуль 10.

1. the routing protocol version that is enabled
2. the value of the configuration register
3. the operational status of serial interfaces
4. the administrative distance used to reach networks

**Ответ:** the value of the configuration register.

**Объяснение:** show version выводит сведения об IOS, аппаратуре и загрузке, включая configuration register на соответствующих роутерах. Состояние serial смотрят через show interfaces; administrative distance — в маршрутах; сведения о протоколах маршрутизации — другими show-командами.

**Explanation in English:** show version reports IOS, hardware and boot information, including the configuration register on relevant routers. Serial status belongs in show interfaces, administrative distance in route information, and routing-protocol details in other show commands.

### E665. Refer to the exhibit. An administrator is testing connectivity to a remote device with the IP address 10.1.1.1. What does the output of this command indicate?

Источник: тесты_exam_5, Q22. Тема: модуль 10.

1. Connectivity to the remote device was successful.
2. A router along the path did not have a route to the destination.
3. A ping packet is being blocked by a security device along the path.
4. The connection timed out while waiting for a reply from the remote device.

> Нужен исходный рисунок/файл активности; сохранённый ответ не подтверждён независимо.

**Ответ:** A router along the path did not have a route to the destination..

**Объяснение:** Сохранённый ответ связывает вывод с отсутствием маршрута. В IOS ping символ U означает ICMP Destination Unreachable, ! — успешный ответ, . — таймаут. Однако U не доказывает одну-единственную причину: unreachable имеет разные коды. Без самого вывода и ICMP-кода утверждать, какой роутер не имел маршрута, нельзя; карточка остаётся вне автоматического квиза.

**Explanation in English:** The saved answer interprets the output as a missing route. IOS ping uses U for ICMP Destination Unreachable, ! for success and . for timeout. However, U alone does not prove one cause because unreachable has multiple codes. Without the output and ICMP code, a specific missing-route diagnosis is unverified; this card stays outside the automatic quiz.

### E678. A network technician is troubleshooting an issue and needs to verify the IP addresses of all interfaces on a router. What is the best command to use to accomplish the task?

Источник: тесты_exam_5, Q35. Тема: модуль 10.

1. show ip interface brief
2. nslookup
3. ipconfig getifaddr en0
4. show ip route

**Ответ:** show ip interface brief.

**Объяснение:** Для списка IP всех интерфейсов на Cisco-роутере подходит show ip interface brief. nslookup обращается к DNS; ipconfig getifaddr en0 — команда другой ОС для одного интерфейса; show ip route выводит маршруты, а не полную таблицу IP/состояний интерфейсов.

**Explanation in English:** show ip interface brief is the Cisco router command for an overview of all interface IPs. nslookup queries DNS; ipconfig getifaddr en0 is a different operating system’s command for one interface; show ip route lists routes rather than a full interface IP/status summary.

### E696. What does a router do when it receives a Layer 2 frame over the network medium?

Источник: тесты_exam_6, Q18. Тема: модуль 10.

1. determines the best path
2. de-encapsulates the frame
3. re-encapsulates the packet into a new frame
4. forwards the new frame appropriate to the medium of that segment of the physical network

**Ответ:** de-encapsulates the frame.

**Объяснение:** После приёма подходящего L2-кадра роутер снимает его заголовок/трейлер, чтобы получить IP-пакет. Только затем ищется маршрут; после выбора выхода создаётся новый кадр и передаётся дальше. Вопрос спрашивает непосредственное действие после получения, поэтому decapsulation предшествует другим вариантам.

**Explanation in English:** After accepting the relevant Layer 2 frame, the router removes its header/trailer to access the IP packet. It then looks up the route, builds an outgoing frame and forwards it. The question asks the immediate action on receipt, so decapsulation precedes the other listed steps.

### E700. If the default gateway is configured incorrectly on the host, what is the impact on communications?

Источник: тесты_exam_6, Q22. Тема: модуль 10.

1. The host is unable to communicate on the local network.
2. The host can communicate with other hosts on the local network, but is unable to communicate with hosts on remote networks.
3. The host can communicate with other hosts on remote networks, but is unable to communicate with hosts on the local network.
4. There is no impact on communications.

**Ответ:** The host can communicate with other hosts on the local network, but is unable to communicate with hosts on remote networks..

**Объяснение:** Локальный получатель находится по маске и ARP без участия шлюза, поэтому обмен внутри своей сети сохраняется. Пакеты в удалённые сети направляются неверному шлюзу и не доставляются обычным путём. Следовательно неверны варианты «не работает локально» и «никакого влияния».

**Explanation in English:** The host identifies a local destination using its mask and resolves it with ARP without using a gateway, so same-network communication remains possible. Remote packets are sent to the wrong gateway and fail through the normal path. Therefore “local communication fails” and “no impact” are incorrect.

### E740. Which two statements describe features of an IPv4 routing table on a router? (Choose two.)

Источник: тесты_exam_7, Q7. Тема: модуль 10.

1. The netstat -r command can be used to display the routing table of a router.
2. Directly connected interfaces will have two route source codes in the routing table: C and S.
3. It stores information about routes derived from the active router interfaces.
4. If there are two or more possible routes to the same destination, the route associated with the higher metric value is included in the routing table.
5. If a default static route is configured in the router, an entry will be included in the routing table with source code S.
6. The routing table lists the MAC addresses of each active interface.

**Ответ:** It stores information about routes derived from the active router interfaces.; If a default static route is configured in the router, an entry will be included in the routing table with source code S..

**Объяснение:** Активные адресованные интерфейсы дают непосредственно подключённые маршруты, а установленный статический default route имеет код S (часто S*). Локальные коды — C и L, не C и S; MAC находятся в ARP/канальных таблицах. В IOS таблицу смотрят show ip route, не netstat -r. Для сопоставимых маршрутов одного протокола обычно предпочтительна меньшая метрика, не большая.

**Explanation in English:** Active addressed interfaces contribute directly connected routes, and an installed static default route has code S (often S*). Local route codes are C and L, not C and S; MAC addresses belong to ARP/link-layer tables. IOS uses show ip route, not netstat -r. Comparable routes from one protocol normally prefer a lower metric, not a higher one.

### E766. Refer to the exhibit. If PC1 is sending a packet to PC2 and routing has been configured between the two routers, what will R1 do with the Ethernet frame header attached by PC1?

Источник: тесты_exam_7, Q33. Тема: модуль 10.

1. nothing, because the router has a route to the destination network
2. remove the Ethernet header and configure a new Layer 2 header before sending it out S0/0/0
3. open the header and replace the destination MAC address with a new one
4. open the header and use it to determine whether the data is to be sent out S0/0/0

> Нужен исходный рисунок/файл активности; сохранённый ответ не подтверждён независимо.

**Ответ:** remove the Ethernet header and configure a new Layer 2 header before sending it out S0/0/0.

**Объяснение:** Роутер удаляет входную Ethernet-оболочку и заново инкапсулирует IP-пакет для выходного Serial-интерфейса. Просто заменить destination MAC недостаточно: следующий канал может вообще не использовать Ethernet/MAC. Маршрут выбирается по IP, а не по Ethernet-заголовку. Указание именно S0/0/0 требует исходной схемы, которой здесь нет.

**Explanation in English:** The router removes the incoming Ethernet encapsulation and re-encapsulates the IP packet for the outgoing Serial link. Merely replacing the destination MAC is insufficient because that link may not use Ethernet/MAC at all. Routing uses IP, not the Ethernet header. The specific S0/0/0 exit still requires the missing diagram.

### E769. Refer to the exhibit. What three facts can be determined from the viewable output of the show ip interface brief command? (Choose three.)

Источник: тесты_exam_7, Q36. Тема: модуль 10.

1. Two physical interfaces have been configured.
2. The switch can be remotely managed.
3. One device is attached to a physical interface.
4. Passwords have been configured on the switch.
5. Two devices are attached to the switch.
6. The default SVI has been configured.

> Нужен исходный рисунок/файл активности; сохранённый ответ не подтверждён независимо.

**Ответ:** The switch can be remotely managed.; One device is attached to a physical interface.; The default SVI has been configured..

**Объяснение:** show ip interface brief позволяет увидеть IP VLAN 1 и состояния портов, но не пароли и не гарантированную доступность удалённого управления. Up/up физического порта указывает на активный канал, не точно на число конечных устройств за ним. Сохранённые три ответа относятся к отсутствующему exhibit; без него и дополнительных настроек их нельзя полностью подтвердить.

**Explanation in English:** show ip interface brief can reveal VLAN 1’s IP and interface states, but not passwords or guaranteed remote management reachability. An up/up physical port shows an active link, not the exact number of endpoints behind it. The saved three answers refer to a missing exhibit and cannot be fully verified without it and further configuration details.

### E045. What is the structure of an IPv4 address called?

Источник: модули_02, Q1. Тема: модуль 11.

1. Dotted-binary format
2. Dotted-decimal format
3. Dotted-hexadecimal format

**Ответ:** Dotted-decimal format.

**Объяснение:** IPv 4 обычно записывают четырьмя десятичными октетами через точки, поэтому dotted-decimal. Двоичные биты лежат в основе адреса, но dotted-binary не название привычной человекочитаемой записи; hex с двоеточиями характерен для IPv 6.

**Explanation in English:** IPv 4 is normally written as four decimal octets separated by dots, hence dotted-decimal. Binary bits underlie the address, but dotted-binary is not the usual human-readable notation; colon-separated hexadecimal is associated with IPv 6.

### E046. How is an IPv4 address represented?

Источник: модули_02, Q2. Тема: модуль 11.

1. Four binary numbers between 0 and 1 separated by colons.
2. Four decimal numbers between 0 and 255 separated by periods.
3. Thirty-two hexadecimal numbers separated by colons.
4. Thirty-two hexadecimal numbers separated by periods.

**Ответ:** Four decimal numbers between 0 and 255 separated by periods..

**Объяснение:** 32 бита IPv 4 разделяются на четыре октета по 8 бит. Каждый октет даёт 2^8=256 значений, от 0 до 255, и записывается десятичным числом между точками. Поэтому не четыре бита 0/1 и не 32 hex-числа с двоеточиями.

**Explanation in English:** IPv 4’s 32 bits form four eight-bit octets. Each has 2^8=256 values, from 0 through 255, written in decimal with dots. The address is neither four individual 0/1 bits nor 32 hexadecimal numbers separated by colons.

### E061. To what subnet does the IP address 10.1.100.50 belong if a subnet mask of 255.255.0.0 is used?

Источник: модули_02, Q14. Тема: модуль 11.

1. 10.1.0.0
2. 10.0.0.0
3. 10.1.100.32
4. 10.1.100.0

**Ответ:** 10.1.0.0.

**Объяснение:** 255.255.0.0 = /16: первые два октета 10.1 остаются сетевыми, последние два обнуляются. 10.1.100.50 AND 255.255.0.0 = 10.1.0.0. 10.0.0.0 получилось бы при /8, 10.1.100.0 — при /24.

**Explanation in English:** 255.255.0.0 is /16, preserving network octets 10.1 and zeroing the last two. 10.1.100.50 AND 255.255.0.0 = 10.1.0.0. 10.0.0.0 would require /8; 10.1.100.0 would require /24.

### E065. Which delivery method is used to transmit information to one or more end devices, but not all devices on the network?

Источник: модули_03, Q4. Тема: модуль 11.

1. Unicast
2. Multicast
3. Broadcast

**Ответ:** Multicast.

**Объяснение:** Multicast адресует выбранную группу: её участник может быть один или их несколько, но это не обязательная доставка всем. Unicast адресует один конкретный узел, broadcast — весь локальный широковещательный домен.

**Explanation in English:** Multicast targets a selected group, which may have one or several members, without targeting everyone. Unicast names one particular host; broadcast targets the entire local broadcast domain.

### E086. What is used to determine the network portion of an IPv4 address?

Источник: модули_03, Q3. Тема: модуль 11.

1. Subnet mask
2. MAC address
3. Right-most part of the IP address
4. Left-most part of the MAC address

**Ответ:** Subnet mask.

**Объяснение:** Subnet mask указывает, какие биты IPv 4 относятся к сети: единицы сохраняют сетевые биты при AND, нули убирают host portion. MAC относится к канальному адресу и не определяет IPv 4-префикс; правые IP-биты обычно относятся к хосту.

**Explanation in English:** The subnet mask identifies network bits: ones preserve them during AND, while zeros remove host bits. A MAC address belongs to Layer 2 and does not determine the IPv 4 prefix; the rightmost IP bits normally form the host portion.

### E091. What type of communication will send a message to all devices on a local area network?

Источник: модули_03, Q2. Тема: модуль 11.

1. Broadcast
2. Multicast
3. Unicast
4. Allcast

**Ответ:** Broadcast.

**Объяснение:** Broadcast направляет сообщение всем узлам данного broadcast domain LAN. Multicast предназначен группе, unicast — одному адресу. Allcast не является стандартным четвёртым режимом IPv 4-доставки.

**Explanation in English:** Broadcast addresses every node in that LAN broadcast domain. Multicast targets a group and unicast one address. Allcast is not a standard fourth IPv 4 delivery mode.

### E093. Which message delivery option is used when all devices need to receive the same message simultaneously?

Источник: модули_03, Q4. Тема: модуль 11.

1. Duplex
2. Unicast
3. Multicast
4. Broadcast

**Ответ:** Broadcast.

**Объяснение:** Если сообщение адресовано всем узлам одного локального широковещательного домена, используется broadcast. Duplex описывает возможность одновременной передачи в двух направлениях, а не выбор получателей. Unicast и multicast адресуют одного или выбранную группу.

**Explanation in English:** Broadcast is used when every node in a local broadcast domain should receive the message. Duplex describes simultaneous transmission directions, not recipient selection. Unicast and multicast target one host or a selected group.

### E100. Which type of communication will send a message to a group of host destinations simultaneously?

Источник: модули_03, Q11. Тема: модуль 11.

1. Broadcast
2. Multicast
3. Unicast
4. Anycast

**Ответ:** Multicast.

**Объяснение:** Multicast отправляет один поток выбранной группе получателей. Broadcast адресует всех в локальном домене, unicast — один конкретный узел. Anycast доставляет одному подходящему/ближайшему участнику группы, а не одновременно всей группе.

**Explanation in English:** Multicast sends to a selected group of receivers. Broadcast targets all nodes in the local domain and unicast one specific host. Anycast reaches one suitable/nearest group member rather than delivering simultaneously to all members.

### E136. Given the binary address of 11101100 00010001 00001100 00001010, which address does this represent in dotted decimal format?

Источник: модули_05, Q2. Тема: модуль 11.

1. 234.17.10.9
2. 234.16.12.10
3. 236.17.12.6
4. 236.17.12.10

**Ответ:** 236.17.12.10.

**Объяснение:** Считаем веса единичных битов в каждом октете: 11101100 = 128+64+32+8+4 = 236; 00010001 = 16+1 = 17; 00001100 = 8+4 = 12; 00001010 = 8+2 = 10. Получаем 236.17.12.10. Октеты сохраняют исходный порядок; другие варианты дают другую сумму хотя бы в одной группе.

**Explanation in English:** Sum the set-bit weights in each octet: 11101100 = 128+64+32+8+4 = 236; 00010001 = 16+1 = 17; 00001100 = 8+4 = 12; 00001010 = 8+2 = 10. This gives 236.17.12.10. Preserve octet order; every other choice changes the sum in at least one group.

### E140. Which IPv4 address format was created for ease of use by people and is expressed as 201.192.1.14?

Источник: модули_05, Q6. Тема: модуль 11.

1. Binary
2. Dotted decimal
3. Hexadecimal
4. ASCII

**Ответ:** Dotted decimal.

**Объяснение:** 201.192.1.14 состоит из десятичных чисел, разделённых точками: это dotted decimal. Binary выглядел бы как 8-битные группы 0/1. ASCII — кодировка символов, а не название формата IPv 4-адреса.

**Explanation in English:** 201.192.1.14 consists of decimal numbers separated by dots: dotted decimal. Binary would use groups of eight 0/1 bits. ASCII is a character encoding, not the name of this IPv 4 notation.

### E141. What is the dotted decimal representation of the IPv4 address 11001011.00000000.01110001.11010011?

Источник: модули_05, Q7. Тема: модуль 11.

1. 192.0.2.199
2. 198.51.100.201
3. 203.0.113.211
4. 209.165.201.223

**Ответ:** 203.0.113.211.

**Объяснение:** Считаем веса единичных битов в каждом октете: 11001011 = 128+64+8+2+1 = 203; 00000000 = 0; 01110001 = 64+32+16+1 = 113; 11010011 = 128+64+16+2+1 = 211. Получаем 203.0.113.211. Октеты сохраняют исходный порядок; другие варианты дают другую сумму хотя бы в одной группе.

**Explanation in English:** Sum the set-bit weights in each octet: 11001011 = 128+64+8+2+1 = 203; 00000000 = 0; 01110001 = 64+32+16+1 = 113; 11010011 = 128+64+16+2+1 = 211. This gives 203.0.113.211. Preserve octet order; every other choice changes the sum in at least one group.

### E144. What is the dotted decimal representation of the IPv4 address which is represented as the binary string 00001010.01100100.00010101.00000001?

Источник: модули_05, Q10. Тема: модуль 11.

1. 10.100.21.1
2. 10.10.20.1
3. 100.10.11.1
4. 100.21.10.1

**Ответ:** 10.100.21.1.

**Объяснение:** Считаем веса единичных битов в каждом октете: 00001010 = 8+2 = 10; 01100100 = 64+32+4 = 100; 00010101 = 16+4+1 = 21; 00000001 = 1 = 1. Получаем 10.100.21.1. Октеты сохраняют исходный порядок; другие варианты дают другую сумму хотя бы в одной группе.

**Explanation in English:** Sum the set-bit weights in each octet: 00001010 = 8+2 = 10; 01100100 = 64+32+4 = 100; 00010101 = 16+4+1 = 21; 00000001 = 1 = 1. This gives 10.100.21.1. Preserve octet order; every other choice changes the sum in at least one group.

### E148. How many bits are in an IPv4 address?

Источник: модули_05, Q14. Тема: модуль 11.

1. 32
2. 64
3. 128
4. 256

**Ответ:** 32.

**Объяснение:** IPv 4 содержит четыре октета по восемь бит: 4×8=32. 128 бит — IPv 6; 64 часто встречается как длина обычного IPv 6-префикса LAN, но не IPv 4-адреса.

**Explanation in English:** IPv 4 contains four eight-bit octets: 4×8=32. IPv 6 has 128 bits; 64 is commonly an IPv 6 LAN prefix length, not an IPv 4 address length.

### E271. Host-A has the IPv4 address and subnet mask 10.5.4.100 255.255.255.0. What is the network address of Host-A?

Источник: модули_11, Q1. Тема: модуль 11.

1. 10.0.0.0
2. 10.5.0.0
3. 10.5.4.0
4. 10.5.4.100

**Ответ:** 10.5.4.0.

**Объяснение:** Маска 255.255.255.0 соответствует /24: сохраняем сетевые биты и обнуляем хостовые. 10.5.4.100 AND 255.255.255.0 = 10.5.4.0. Сам 10.5.4.100 — адрес хоста; другие предложенные сети получаются при другой длине маски.

**Explanation in English:** Mask 255.255.255.0 means /24: preserve network bits and zero host bits. 10.5.4.100 AND 255.255.255.0 = 10.5.4.0. 10.5.4.100 itself is a host address; the other proposed networks require different masks.

### E272. Host-A has the IPv4 address and subnet mask 172.16.4.100 255.255.0.0. What is the network address of Host-A?

Источник: модули_11, Q2. Тема: модуль 11.

1. 172.0.0.0
2. 172.16.0.0
3. 172.16.4.0
4. 172.16.4.100

**Ответ:** 172.16.0.0.

**Объяснение:** Маска 255.255.0.0 соответствует /16: сохраняем сетевые биты и обнуляем хостовые. 172.16.4.100 AND 255.255.0.0 = 172.16.0.0. Сам 172.16.4.100 — адрес хоста; другие предложенные сети получаются при другой длине маски.

**Explanation in English:** Mask 255.255.0.0 means /16: preserve network bits and zero host bits. 172.16.4.100 AND 255.255.0.0 = 172.16.0.0. 172.16.4.100 itself is a host address; the other proposed networks require different masks.

### E273. Host-A has the IPv4 address and subnet mask 10.5.4.100 255.255.255.0. Which of the following IPv4 addresses would be on the same network as Host-A? (Choose all that apply)

Источник: модули_11, Q3. Тема: модуль 11.

1. 10.5.4.1
2. 10.5.0.1
3. 10.5.4.99
4. 10.0.0.98
5. 10.5.100.4

**Ответ:** 10.5.4.1; 10.5.4.99.

**Объяснение:** После AND с указанной маской сеть хоста — 10.5.4.0/24. Адреса 10.5.4.1 и 10.5.4.99 дают тот же сетевой префикс и являются хостовыми. У 10.5.0.1, 10.0.0.98, 10.5.100.4 сетевые биты отличаются; похожие остальные октеты этого не исправляют.

**Explanation in English:** Applying the given mask gives the host network 10.5.4.0/24. 10.5.4.1 and 10.5.4.99 produce that same prefix and are usable host addresses. 10.5.0.1, 10.0.0.98, 10.5.100.4 have different network bits; similarity in other octets does not make them local.

### E274. Host-A has the IPv4 address and subnet mask 172.16.4.100 255.255.0.0. Which of the following IPv4 addresses would be on the same network as Host-A? (Choose all that apply)

Источник: модули_11, Q4. Тема: модуль 11.

1. 172.16.4.99
2. 172.16.0.1
3. 172.17.4.99
4. 172.17.4.1
5. 172.18.4.1

**Ответ:** 172.16.4.99; 172.16.0.1.

**Объяснение:** После AND с указанной маской сеть хоста — 172.16.0.0/16. Адреса 172.16.4.99 и 172.16.0.1 дают тот же сетевой префикс и являются хостовыми. У 172.17.4.99, 172.17.4.1, 172.18.4.1 сетевые биты отличаются; похожие остальные октеты этого не исправляют.

**Explanation in English:** Applying the given mask gives the host network 172.16.0.0/16. 172.16.4.99 and 172.16.0.1 produce that same prefix and are usable host addresses. 172.17.4.99, 172.17.4.1, 172.18.4.1 have different network bits; similarity in other octets does not make them local.

### E275. Host-A has the IPv4 address and subnet mask 192.168.1.50 255.255.255.0. Which of the following IPv4 addresses would be on the same network as Host-A? (Choose all that apply)

Источник: модули_11, Q5. Тема: модуль 11.

1. 192.168.0.1
2. 192.168.0.100
3. 192.168.1.1
4. 192.168.1.100
5. 192.168.2.1

**Ответ:** 192.168.1.1; 192.168.1.100.

**Объяснение:** После AND с указанной маской сеть хоста — 192.168.1.0/24. Адреса 192.168.1.1 и 192.168.1.100 дают тот же сетевой префикс и являются хостовыми. У 192.168.0.1, 192.168.0.100, 192.168.2.1 сетевые биты отличаются; похожие остальные октеты этого не исправляют.

**Explanation in English:** Applying the given mask gives the host network 192.168.1.0/24. 192.168.1.1 and 192.168.1.100 produce that same prefix and are usable host addresses. 192.168.0.1, 192.168.0.100, 192.168.2.1 have different network bits; similarity in other octets does not make them local.

### E276. Which two statements are correct about private IPv4 addresses? (Choose two.)

Источник: модули_11, Q1. Тема: модуль 11.

1. Private IPv4 addresses are assigned to devices within an organization’s intranet (internal network).
2. Internet routers will typically forward any packet with a destination address that is a private IPv4 address.
3. 172.99.1.1 is a private IPv4 address.
4. Any organization (home, school, office, company) can use the 10.0.0.0/8 address.

**Ответ:** Private IPv4 addresses are assigned to devices within an organization’s intranet (internal network).; Any organization (home, school, office, company) can use the 10.0.0.0/8 address..

**Объяснение:** Private IPv 4 предназначены для внутренних сетей; любую организацию допускается адресовать из 10/8 без глобальной регистрации такого использования. Публичные роутеры обычно не маршрутизируют private destination. 172.99.1.1 не private: у диапазона 172.16/12 второй октет только 16–31.

**Explanation in English:** Private IPv 4 addresses serve internal networks, and any organization may use 10/8 internally without registering that private use globally. Public routers normally do not route private destinations. 172.99.1.1 is not private: 172.16/12 covers second octets 16–31 only.

### E277. Which two statements are correct about public IPv4 addresses? (Choose two.)

Источник: модули_11, Q2. Тема: модуль 11.

1. Public IPv4 addresses are allowed to be assigned to devices within an organization’s intranet (internal network).
2. To access a device over the internet, the destination IPv4 address must be a public address.
3. 192.168.1.10 is a public IPv4 address.
4. Public IPv4 address exhaustion is a reason why there are private IPv4 addresses and why organizations are transitioning to IPv6.

> Три утверждения допустимы при формулировке Choose two; исключено из оцениваемого квиза.

**Ответ:** To access a device over the internet, the destination IPv4 address must be a public address.; Public IPv4 address exhaustion is a reason why there are private IPv4 addresses and why organizations are transitioning to IPv6..

**Объяснение:** Учебный ключ выбирает публичный destination для прямого доступа через Интернет и исчерпание IPv 4 как причину private addressing/IPv 6. Но первый вариант тоже технически верен: организация вправе использовать выделенные ей public addresses внутри intranet. 192.168.1.10 точно private. Поэтому задание Choose two имеет три допустимых утверждения и исключено из оцениваемого квиза; VPN/NAT также требуют оговорок к «доступу через Интернет».

**Explanation in English:** The course key chooses a public destination for direct Internet access and IPv 4 exhaustion as motivation for private addressing/IPv 6. However, the first statement is also technically true: an organization may use its assigned public addresses inside an intranet. 192.168.1.10 is definitely private. Thus “Choose two” has three defensible statements and is excluded from scored quizzes; VPN/NAT also qualify Internet-access wording.

### E278. Which organization or group of organizations receives IP addresses from IANA and is responsible for allocating these addresses to ISPs and some organizations?

Источник: модули_11, Q3. Тема: модуль 11.

1. IETF
2. IEEE
3. RIRs
4. Tier 1 ISPs

**Ответ:** RIRs.

**Объяснение:** RIR получают региональные адресные ресурсы от IANA и распределяют их ISP и организациям. IETF разрабатывает интернет-стандарты, IEEE — например Ethernet/Wi-Fi; Tier 1 ISP не является общим названием региональной регистратуры.

**Explanation in English:** RIRs receive regional address resources from IANA and allocate them to ISPs and organizations. IETF develops Internet standards, IEEE develops standards such as Ethernet/Wi-Fi, and Tier 1 ISP is not the general name for a regional registry.

### E279. Which devices will not forward an IPv4 broadcast packet by default?

Источник: модули_11, Q1. Тема: модуль 11.

1. Ethernet switch
2. Router
3. Windows PC
4. None of the above. All devices forward IPv4 broadcast packets by default.

**Ответ:** Router.

**Объяснение:** В контексте пересылки между сетями ответ Router: он по умолчанию не переносит IPv 4 broadcast в соседнюю подсеть, ограничивая broadcast domain. L 2-switch обычно рассылает такой кадр внутри VLAN. Обычный PC вообще не является транзитным устройством: его наличие среди вариантов — упрощение формулировки курса.

**Explanation in English:** In the context of forwarding between networks, Router is the intended answer: it normally does not forward IPv 4 broadcasts into adjacent subnets, bounding the broadcast domain. A Layer 2 switch floods them inside its VLAN. An ordinary PC is not a transit device at all; its inclusion is a simplification in the course wording.

### E280. Which two situations are the result of excessive broadcast traffic? (Choose two)

Источник: модули_11, Q2. Тема: модуль 11.

1. Slow network operations
2. Slow device operations
3. When devices on all adjacent networks are affected
4. When the router has to forward an excessive number of packets

**Ответ:** Slow network operations; Slow device operations.

**Объяснение:** Много broadcast занимает полосу локальной сети и заставляет каждый принимающий узел обрабатывать лишние кадры, поэтому замедляются и сеть, и устройства. Это не означает, что broadcast автоматически затронет все соседние подсети: роутер обычно его туда не пересылает.

**Explanation in English:** Excessive broadcasts consume local bandwidth and force receiving devices to process extra frames, slowing both network and device operation. They do not automatically affect every adjacent subnet because routers normally do not forward them there.

### E281. What is the prefix length notation for the subnet mask 255.255.255.224?

Источник: модули_11, Q1; тесты_IP_Addressing, Q28. Тема: модуль 11.

1. /25
2. /26
3. /27
4. /28

**Ответ:** /27.

**Объяснение:** 255.255.255 даёт 24 единичных бита; 224 = 11100000 добавляет ещё три. Итого 27 единиц, значит /27. /25 соответствовал бы .128, /26 — .192, /28 — .240.

**Explanation in English:** 255.255.255 supplies 24 one-bits; 224 = 11100000 adds three more. Total 27, hence /27. /25 ends in .128, /26 in .192 and /28 in .240.

### E282. How many valid host addresses are available on an IPv4 subnet that is configured with a /26 mask?

Источник: модули_11, Q2. Тема: модуль 11.

1. 254
2. 190
3. 192
4. 62
5. 64

**Ответ:** 62.

**Объяснение:** /26 оставляет 6 host bits. Всего 2^6=64 адресов, но network и broadcast не назначаются обычным хостам: 64−2=62. Не путай общее число адресов с числом usable hosts; правило здесь для обычной подсети, не специального /31.

**Explanation in English:** /26 leaves 6 host bits. There are 2^6=64 total addresses, but network and broadcast are not ordinary host addresses: 64−2=62. Total addresses and usable hosts differ; this rule applies to an ordinary subnet, not a special /31 link.

### E283. Which subnet mask would be used if 5 host bits are available?

Источник: модули_11, Q3. Тема: модуль 11.

1. 255.255.255.0
2. 255.255.255.128
3. 255.255.255.224
4. 255.255.255.240

**Ответ:** 255.255.255.224.

**Объяснение:** Если хосту оставлено 5 бит из 32, сети принадлежит 32−5=27: /27, маска 255.255.255.224. Нужное число нулей в конце маски равно 5; остальные варианты оставляют другое количество host bits.

**Explanation in English:** Leaving 5 host bits out of 32 gives 32−5=27 network bits: /27, mask 255.255.255.224. The mask must end with 5 zero-bits; the other options leave a different number of host bits.

### E284. A network administrator subnets the 192.168.10.0/24 network into subnets with /26 masks. How many equal-sized subnets are created?

Источник: модули_11, Q4. Тема: модуль 11.

1. 1
2. 2
3. 4
4. 8
5. 16
6. 64

**Ответ:** 4.

**Объяснение:** Переход /24 → /26 заимствует 2 бита, значит 2^2=4 равные подсети: .0/26, .64/26, .128/26 и .192/26. Число 64 — адресов в одной подсети, а не число подсетей.

**Explanation in English:** Moving /24 → /26 borrows two bits, producing 2^2=4 equal subnets: .0/26, .64/26, .128/26 and .192/26. Sixty-four is the number of addresses in each subnet, not the number of subnets.

### E285. What subnet mask is represented by the slash notation /20?

Источник: модули_11, Q5. Тема: модуль 11.

1. 255.255.255.248
2. 255.255.224.0
3. 255.255.240.0
4. 255.255.255.0
5. 255.255.255.192

**Ответ:** 255.255.240.0.

**Объяснение:** /20 — двадцать единиц: 11111111.11111111.11110000.00000000 = 255.255.240.0. В третьем октете четыре единицы дают 128+64+32+16=240. 224 означало бы только /19.

**Explanation in English:** /20 is twenty one-bits: 11111111.11111111.11110000.00000000 = 255.255.240.0. Four ones in the third octet sum to 128+64+32+16=240. A third octet of 224 would mean /19.

### E286. Which statement is true about variable-length subnet masking?

Источник: модули_11, Q6. Тема: модуль 11.

1. Each subnet is the same size.
2. The size of each subnet may be different, depending on requirements.
3. Subnets may only be subnetted one additional time.
4. Bits are returned, rather than borrowed, to create additional subnets.

**Ответ:** The size of each subnet may be different, depending on requirements..

**Объяснение:** VLSM разрешает разные длины префиксов внутри исходного блока: например /25 для большой LAN и /30 для point-to-point. Размер выбирается по требованиям. Одинаковый размер всех подсетей — FLSM; повторное деление допустимо, пока хватает бит и блоки не пересекаются.

**Explanation in English:** VLSM permits different prefix lengths inside a parent block, such as /25 for a large LAN and /30 for point-to-point. Requirements determine size. Equal-size subnets describe FLSM; further subdivision is allowed as long as bits remain and blocks do not overlap.

### E287. Why does a Layer 3 device perform the ANDing process on a destination IP address and subnet mask?

Источник: модули_11, Q7. Тема: модуль 11.

1. To identify the broadcast address of the destination network
2. To identify the host address of the destination host
3. To identify faulty frames
4. To identify the network address of the destination network

**Ответ:** To identify the network address of the destination network.

**Объяснение:** Побитовое AND сохраняет биты назначения под единицами маски и обнуляет host bits, получая network address. Broadcast получается, наоборот, установкой всех host bits в 1. Проверка повреждённых кадров относится к FCS, не к AND адреса и маски.

**Explanation in English:** Bitwise AND preserves destination bits beneath mask ones and zeros the host bits, yielding the network address. Broadcast instead sets every host bit to one. Checking damaged frames uses FCS, not an address-mask AND operation.

### E288. How many usable IP addresses are available on the 192.168.1.0/27 network?

Источник: модули_11, Q8. Тема: модуль 11.

1. 256
2. 254
3. 62
4. 30
5. 16
6. 32

**Ответ:** 30.

**Объяснение:** 192.168.1.0/27: /27 оставляет 5 host bits. Всего 2^5=32 адресов, но network и broadcast не назначаются обычным хостам: 32−2=30. Не путай общее число адресов с числом usable hosts; правило здесь для обычной подсети, не специального /31.

**Explanation in English:** 192.168.1.0/27: /27 leaves 5 host bits. There are 2^5=32 total addresses, but network and broadcast are not ordinary host addresses: 32−2=30. Total addresses and usable hosts differ; this rule applies to an ordinary subnet, not a special /31 link.

### E289. Which subnet mask would be used if exactly 4 host bits are available?

Источник: модули_11, Q9. Тема: модуль 11.

1. 255.255.255.224
2. 255.255.255.128
3. 255.255.255.240
4. 255.255.255.248

**Ответ:** 255.255.255.240.

**Объяснение:** Если хосту оставлено 4 бит из 32, сети принадлежит 32−4=28: /28, маска 255.255.255.240. Нужное число нулей в конце маски равно 4; остальные варианты оставляют другое количество host bits.

**Explanation in English:** Leaving 4 host bits out of 32 gives 32−4=28 network bits: /28, mask 255.255.255.240. The mask must end with 4 zero-bits; the other options leave a different number of host bits.

### E290. Which two parts are components of an IPv4 address? (Choose two.)

Источник: модули_11, Q10. Тема: модуль 11.

1. Subnet portion
2. Network portion
3. Logical portion
4. Host portion
5. Physical portion
6. Broadcast portion

**Ответ:** Network portion; Host portion.

**Объяснение:** В базовом разбиении IPv 4 есть network portion и host portion; границу задаёт mask/prefix. Subnet bits можно выделить внутри сетевой части при более подробном разбиении, но это не третья основная часть наряду с network/host. Physical относится к MAC, broadcast — значение адреса, а не отдельная часть.

**Explanation in English:** The basic IPv 4 division is network portion and host portion, separated by the mask/prefix. Subnet bits can be identified within the network portion in a more detailed hierarchy, but are not a third basic part. Physical refers to MAC; broadcast is an address value, not a separate portion.

### E291. If a network device has a mask of /26, how many IP addresses are available for hosts on this network?

Источник: модули_11, Q11. Тема: модуль 11.

1. 64
2. 30
3. 62
4. 32
5. 16
6. 14

**Ответ:** 62.

**Объяснение:** /26 оставляет 6 host bits. Всего 2^6=64 адресов, но network и broadcast не назначаются обычным хостам: 64−2=62. Не путай общее число адресов с числом usable hosts; правило здесь для обычной подсети, не специального /31.

**Explanation in English:** /26 leaves 6 host bits. There are 2^6=64 total addresses, but network and broadcast are not ordinary host addresses: 64−2=62. Total addresses and usable hosts differ; this rule applies to an ordinary subnet, not a special /31 link.

### E292. What does the IP address 172.17.4.250/24 represent?

Источник: модули_11, Q12. Тема: модуль 11.

1. Network address
2. Multicast address
3. Host address
4. Broadcast address

**Ответ:** Host address.

**Объяснение:** /24 даёт сеть 172.17.4.0 и broadcast 172.17.4.255. 172.17.4.250 лежит между ними (.1–.254), значит host address. Private-статус 172.17.x.x этому не мешает; multicast начинается с 224–239, а не 172.

**Explanation in English:** /24 yields network 172.17.4.0 and broadcast 172.17.4.255. 172.17.4.250 is inside the usable .1–.254 range, making it a host address. Being private does not prevent that; multicast begins with 224–239, not 172.

### E293. If a network device has a mask of /28, how many IP addresses are available for hosts on this network?

Источник: модули_11, Q13. Тема: модуль 11.

1. 256
2. 254
3. 62
4. 32
5. 16
6. 14

**Ответ:** 14.

**Объяснение:** /28 оставляет 4 host bits. Всего 2^4=16 адресов, но network и broadcast не назначаются обычным хостам: 16−2=14. Не путай общее число адресов с числом usable hosts; правило здесь для обычной подсети, не специального /31.

**Explanation in English:** /28 leaves 4 host bits. There are 2^4=16 total addresses, but network and broadcast are not ordinary host addresses: 16−2=14. Total addresses and usable hosts differ; this rule applies to an ordinary subnet, not a special /31 link.

### E294. What is the purpose of the subnet mask in conjunction with an IP address?

Источник: модули_11, Q14. Тема: модуль 11.

1. To uniquely identify a host on a network
2. To identify whether the address is public or private
3. To determine the subnet to which the host belongs
4. To mask the IP address to outsiders

**Ответ:** To determine the subnet to which the host belongs.

**Объяснение:** Маска вместе с IP показывает, к какой подсети относится хост: IP AND mask = network. Она не шифрует адрес и не скрывает его от посторонних. Public/private определяется выделенными диапазонами; одного назначения маски недостаточно для уникального адреса хоста.

**Explanation in English:** The mask combines with IP to identify its subnet: IP AND mask = network. It does not encrypt or conceal the address. Public/private classification depends on designated ranges; a mask alone does not uniquely identify a host.

### E295. A network administrator is variably subnetting a network. The smallest subnet has a mask of 255.255.255.224. How many usable host addresses will this subnet provide?

Источник: модули_11, Q15. Тема: модуль 11.

1. 2
2. 6
3. 14
4. 30
5. 62

**Ответ:** 30.

**Объяснение:** 255.255.255.224: /27 оставляет 5 host bits. Всего 2^5=32 адресов, но network и broadcast не назначаются обычным хостам: 32−2=30. Не путай общее число адресов с числом usable hosts; правило здесь для обычной подсети, не специального /31.

**Explanation in English:** 255.255.255.224: /27 leaves 5 host bits. There are 2^5=32 total addresses, but network and broadcast are not ordinary host addresses: 32−2=30. Total addresses and usable hosts differ; this rule applies to an ordinary subnet, not a special /31 link.

### E480. Match the subnetwork to a host address that would be included within the subnetwork. A 192.168.1.32/27 192.168.1.48 done B 192.168.1.64/27 192.168.1.68 C 192.168.1.96/27 192.168.1.121

Источник: тесты_IP_Addressing, Q2. Тема: модуль 11.



> Ответ

**Ответ:** 192.168.1.32/27 → 192.168.1.48; 192.168.1.64/27 → 192.168.1.68; 192.168.1.96/27 → 192.168.1.121.

**Объяснение:** /27 имеет шаг 32: сеть .32 охватывает .32–.63, usable .33–.62, поэтому подходит .48; .64/27 даёт usable .65–.94, подходит .68; .96/27 даёт usable .97–.126, подходит .121. Проверяется попадание в интервал, исключая network/broadcast.

**Explanation in English:** A /27 advances in blocks of 32: .32 covers .32–.63 with usable .33–.62, so .48 fits; .64/27 has usable .65–.94, so .68 fits; .96/27 has usable .97–.126, so .121 fits. Check interval membership while excluding network/broadcast.

### E481. How many host addresses are available on the network 172.16.128.0 with a subnet mask of 255.255.252.0?

Источник: тесты_IP_Addressing, Q3. Тема: модуль 11.

1. 510
2. 512
3. 1022
4. 1024
5. 2046
6. 2048

**Ответ:** 1022.

**Объяснение:** 255.255.252.0 = /22: 22 сетевых и 10 хостовых бит. 2^10−2=1022 usable addresses. Для 172.16.128.0/22 весь блок .128.0–.131.255, пригодны .128.1–.131.254. 1024 — общий размер без вычитания двух специальных адресов.

**Explanation in English:** 255.255.252.0 is /22, leaving ten host bits. 2^10−2=1022 usable addresses. 172.16.128.0/22 spans .128.0–.131.255, usable .128.1–.131.254. 1024 counts every address without subtracting network and broadcast.

### E482. Which address prefix range is reserved for IPv4 multicast?

Источник: тесты_IP_Addressing, Q4. Тема: модуль 11.

1. 240.0.0.0 - 254.255.255.255
2. 224.0.0.0 - 239.255.255.255
3. 169.254.0.0 - 169.254.255.255
4. 127.0.0.0 - 127.255.255.255

**Ответ:** 224.0.0.0 - 239.255.255.255.

**Объяснение:** IPv 4 multicast — 224.0.0.0/4, то есть 224.0.0.0–239.255.255.255. 240/4 зарезервирован, 169.254/16 — link-local, 127/8 — loopback. Это разные назначения, несмотря на общий статус специальных диапазонов.

**Explanation in English:** IPv 4 multicast is 224.0.0.0/4, or 224.0.0.0–239.255.255.255. 240/4 is reserved, 169.254/16 link-local and 127/8 loopback. These are distinct purposes even though all are special ranges.

### E484. A site administrator has been told that a particular network at the site must accommodate 126 hosts. Which subnet mask would be used that contains the required number of host bits?

Источник: тесты_IP_Addressing, Q6. Тема: модуль 11.

1. 255.255.255.0
2. 255.255.255.128
3. 255.255.255.224
4. 255.255.255.240

**Ответ:** 255.255.255.128.

**Объяснение:** Для 126 хостов нужно 7 бит: 2^7−2=126. Префикс 32−7=/25, маска 255.255.255.128. /24 тоже вместит, но оставит лишний host bit и больший блок; /27 и /28 слишком малы.

**Explanation in English:** 126 hosts require seven host bits: 2^7−2=126. Thus 32−7=/25, mask 255.255.255.128. /24 would also fit but uses an unnecessarily larger block; /27 and /28 are too small.

### E485. Refer to the exhibit. Considering the addresses already used and having to remain within the 10.16.10.0/24 network range, which subnet address could be assigned to the network containing 25 hosts?

Источник: тесты_IP_Addressing, Q7. Тема: модуль 11.

1. 10.16.10.160/26
2. 10.16.10.128/28
3. 10.16.10.64/27
4. 10.16.10.224/26
5. 10.16.10.240/27
6. 10.16.10.240/28

> Ответ для показанного варианта (нужна схема/PT для полной проверки)

**Ответ:** 10.16.10.64/27.

**Объяснение:** 25 хостам нужен /27: 32 адреса, 30 usable. .64/27 стоит на правильной границе и даёт .65–.94. /28 даёт только 14 хостов; .160/26, .224/26 и .240/27 не являются выровненными адресами сети соответствующей длины. Без схемы отдельно не подтверждается условие «не занято», поэтому карточка остаётся условной.

**Explanation in English:** 25 hosts need /27: 32 total and 30 usable. .64/27 is aligned and provides .65–.94. /28 has only 14 hosts; .160/26, .224/26 and .240/27 are not aligned network addresses for those prefixes. The missing exhibit prevents checking the “not already used” condition, so the card remains conditional.

### E487. How many host addresses are available on the 192.168.10.128/26 network?

Источник: тесты_IP_Addressing, Q9. Тема: модуль 11.

1. 30
2. 32
3. 60
4. 62
5. 64

**Ответ:** 62.

**Объяснение:** 192.168.10.128/26: /26 оставляет 6 host bits. Всего 2^6=64 адресов, но network и broadcast не назначаются обычным хостам: 64−2=62. Не путай общее число адресов с числом usable hosts; правило здесь для обычной подсети, не специального /31.

**Explanation in English:** 192.168.10.128/26: /26 leaves 6 host bits. There are 2^6=64 total addresses, but network and broadcast are not ordinary host addresses: 64−2=62. Total addresses and usable hosts differ; this rule applies to an ordinary subnet, not a special /31 link.

### E488. A message is sent to all hosts on a remote network. Which type of message is it?

Источник: тесты_IP_Addressing, Q10. Тема: модуль 11.

1. limited broadcast
2. multicast
3. directed broadcast
4. unicast

**Ответ:** directed broadcast.

**Объяснение:** Directed broadcast адресует всех узлов конкретной подсети, например её последний адрес. Limited broadcast 255.255.255.255 ограничен своим каналом; multicast выбирает группу, unicast один хост. Название directed broadcast не означает, что роутеры обязаны его пропускать: по умолчанию пересылка обычно запрещена.

**Explanation in English:** A directed broadcast targets every host in a specified subnet, using that subnet’s final address. Limited broadcast 255.255.255.255 stays on-link; multicast selects a group and unicast one host. The name does not mean routers must forward it—forwarding is normally disabled by default.

### E489. Refer to the exhibit. An administrator must send a message to everyone on the router A network. What is the broadcast address for network 172.16.16.0/22?

Источник: тесты_IP_Addressing, Q11. Тема: модуль 11.

1. 172.16.16.255
2. 172.16.20.255
3. 172.16.19.255
4. 172.16.23.255
5. 172.16.255.255

**Ответ:** 172.16.19.255.

**Объяснение:** 172.16.16.0/22: маска 255.255.252.0, шаг третьего октета 256−252=4. Блок начинается с 16 и заканчивается перед 20, значит последний адрес 172.16.19.255. .16.255 обрезает блок как /24, а .20.255 уже за пределами. Эти данные полностью есть в тексте; схема для расчёта не нужна.

**Explanation in English:** 172.16.16.0/22 uses 255.255.252.0, a third-octet block size of 256−252=4. The block starts at 16 and ends before 20, so its last address is 172.16.19.255. .16.255 treats it like /24 and .20.255 lies outside. All required numbers are in the text; no exhibit is needed.

### E505. Match each description with an appropriate IP address. A an experimental address 240.2.6.255 done B a private address 172.19.20.5 C a TEST-NET address 192.0.2.123 D a link-local address 169.254.1.5 E a loopback address 127.0.0.1

Источник: тесты_IP_Addressing, Q27. Тема: модуль 11.



> Ответ

**Ответ:** 240.2.6.255 → experimental/reserved; 172.19.20.5 → private; 192.0.2.123 → TEST-NET; 169.254.1.5 → link-local; 127.0.0.1 → loopback.

**Объяснение:** 240.2.6.255 входит в reserved 240/4; 172.19.20.5 — private 172.16/12; 192.0.2.123 — TEST-NET-1 192.0.2/24; 169.254.1.5 — link-local 169.254/16; 127.0.0.1 — loopback 127/8. Классификация следует из диапазона, не из того, оканчивается ли адрес на .255.

**Explanation in English:** 240.2.6.255 lies in reserved 240/4; 172.19.20.5 in private 172.16/12; 192.0.2.123 in TEST-NET-1 192.0.2/24; 169.254.1.5 in link-local 169.254/16; 127.0.0.1 in loopback 127/8. Classification follows the range, not whether an address ends in .255.

### E507. Which subnet would include the address 192.168.1.96 as a usable host address?

Источник: тесты_IP_Addressing, Q29; тесты_exam_7, Q10. Тема: модуль 11.

1. 192.168.1.64/26
2. 192.168.1.32/27
3. 192.168.1.32/28
4. 192.168.1.64/29

**Ответ:** 192.168.1.64/26.

**Объяснение:** 192.168.1.64/26 охватывает .64–.127, usable .65–.126, поэтому .96 — хост. .32/27 заканчивается .63, .32/28 — .47, .64/29 — .71: ни одна из них .96 не содержит. При /27 сеть .96 была бы network address, но здесь выбран /26.

**Explanation in English:** 192.168.1.64/26 spans .64–.127, usable .65–.126, so .96 is a host. .32/27 ends at .63, .32/28 at .47 and .64/29 at .71; none contains .96. With a /27 starting at .96 it would be a network address, but the chosen mask is /26.

### E509. A host is transmitting a multicast. Which host or hosts will receive it?

Источник: тесты_IP_Addressing, Q31. Тема: модуль 11.

1. a specially defined group of hosts
2. one specific host
3. all hosts with the same IP address
4. the closest neighbor on the same network

**Ответ:** a specially defined group of hosts.

**Объяснение:** Multicast получает специально определённая группа, в которую вступили получатели. Это не один fixed host, не любые узлы с одинаковым unicast IP и не «ближайший сосед»: последнее ближе к идее anycast.

**Explanation in English:** Multicast is received by a defined group whose receivers join it. It is not one fixed host, arbitrary hosts sharing a unicast IP, or the nearest neighbor—the latter resembles anycast rather than multicast.

### E517. A technician configures a switch with these commands: SwitchA(config)# interface vlan 1 SwitchA(config-if)# ip address 192.168.1.1 255.255.255.0 SwitchA(config-if)# no shutdown What is the technician configuring?

Источник: тесты_exam_0, Q6. Тема: модуль 11.

1. Telnet access
2. SVI
3. Password encryption
4. Physical switchport access

**Ответ:** SVI.

**Объяснение:** interface vlan 1 выбирает логический Switch Virtual Interface; ip address назначает ему IP/маску, no shutdown включает его административно. Здесь не выбран физический switchport. Telnet требует ещё настроек VTY; password encryption вообще не выполняется этими командами.

**Explanation in English:** interface vlan 1 selects a logical Switch Virtual Interface; ip address assigns its address/mask and no shutdown administratively enables it. No physical switchport was selected. Telnet requires additional VTY configuration; these commands do not encrypt passwords.

### E532. What is a characteristic of multicast messages?

Источник: тесты_exam_0, Q21. Тема: модуль 11.

1. They are sent to a select group of hosts.
2. They are sent to all hosts on a network.
3. They must be acknowledged.
4. They are sent to a single destination.

**Ответ:** They are sent to a select group of hosts..

**Объяснение:** Multicast предназначен selected group: не всем узлам и не единственному заранее указанному хосту. Сам по себе IP multicast не требует подтверждения каждого сообщения; надёжность зависит от протокола/приложения поверх него.

**Explanation in English:** Multicast targets a selected group rather than all hosts or one individually named host. IP multicast itself does not require acknowledgments for every message; reliability depends on the protocol/application above it.

### E611. HQ(config)# interface gi0/1 HQ(config-if)# description Connects to the Branch LAN HQ(config-if)# ip address 172.19.99.99 255.255.255.0 HQ(config-if)# no shutdown HQ(config-if)# interface gi0/0 HQ(config-if)# description Connects to the Store LAN HQ(config-if)# ip address 172.19.98.230 255.255.255.0 HQ(config-if)# no shutdown HQ(config-if)# interface s0/0/0 HQ(config-if)# description Connects to the ISP HQ(config-if)# ip address 10.98.99.254 255.255.255.0 HQ(config-if)# no shutdown HQ(config-if)# interface s0/0/1 HQ(config-if)# description Connects to the Head Office WAN HQ(config-if)# ip address 209.165.200.120 255.255.255.0 HQ(config-if)# no shutdown HQ(config-if)# end Refer to the exhibit. A network administrator is connecting a new host to the Store LAN. The host needs to communicate with remote networks. What IP address would be configured as the default gateway on the new host?

Источник: тесты_exam_2, Q33. Тема: модуль 11.

1. 172.19.98.230
2. 172.19.98.1
3. 10.98.99.254
4. 209.165.200.120
5. 172.19.99.99

**Ответ:** 172.19.98.230.

**Объяснение:** В приведённой конфигурации gi 0/0 помечен Connects to the Store LAN и имеет 172.19.98.230/24: именно этот локальный интерфейс роутера — gateway нового узла Store. .98.1 нигде не настроен; .99.99 принадлежит Branch, а 10.98.99.254 и 209.165.200.120 — WAN/ISP. Текста достаточно без картинки.

**Explanation in English:** The supplied configuration labels gi 0/0 “Connects to the Store LAN” and assigns 172.19.98.230/24, making that local router interface the Store host’s gateway. .98.1 is not configured; .99.99 belongs to Branch and 10.98.99.254/209.165.200.120 to WAN/ISP. The text is sufficient without the exhibit.

### E634. Which three statements describe a DHCP Discover message? (Choose three.)

Источник: тесты_exam_4, Q23. Тема: модуль 11.

1. The source MAC address is 48 ones (FF-FF-FF-FF-FF-FF).
2. The destination IP address is 255.255.255.255.
3. The message comes from a server offering an IP address.
4. The message comes from a client seeking an IP address.
5. All hosts receive the message, but only a DHCP server replies.
6. Only the DHCP server receives the message.

**Ответ:** The destination IP address is 255.255.255.255.; The message comes from a client seeking an IP address.; All hosts receive the message, but only a DHCP server replies..

**Объяснение:** Discover отправляет клиент, которому нужен адрес. В начальном обмене он использует IP destination 255.255.255.255 и Ethernet broadcast destination; кадр получают узлы LAN, но DHCP-сервис отвечает предложением (или relay пересылает). Source MAC — собственный MAC клиента, не FF:FF:FF:FF:FF:FF. Серверское предложение называется Offer, не Discover.

**Explanation in English:** A client seeking an address sends Discover. Initially it uses destination IP 255.255.255.255 and Ethernet broadcast destination; LAN nodes receive it, while the DHCP service responds with an offer (or a relay forwards it). Source MAC is the client’s own MAC, not FF:FF:FF:FF:FF:FF. The server’s offer is Offer, not Discover.

### E685. What is a characteristic of a switch virtual interface (SVI)?

Источник: тесты_exam_6, Q7. Тема: модуль 11.

1. Although it is a virtual interface, it needs to have physical hardware on the device associated with it.
2. An SVI is created in software and requires a configured IP address and a subnet mask in order to provide remote access to the switch.
3. SVIs come preconfigured on Cisco switches.
4. SVIs do not require the no shutdown command to become enabled.

**Ответ:** An SVI is created in software and requires a configured IP address and a subnet mask in order to provide remote access to the switch..

**Объяснение:** SVI создаётся программно для VLAN; IP и mask позволяют обращаться к самому switch по IP из сети. Это не отдельный физический интерфейс. Его рабочее состояние зависит также от административного включения и состояния VLAN/портов, поэтому нельзя обещать автоматическую готовность всех SVI или ненужность no shutdown.

**Explanation in English:** An SVI is a software VLAN interface; its IP/mask enables IP management of the switch itself. It is not a separate physical interface. Operational state also depends on administrative enablement and VLAN/port state, so arbitrary SVIs are not guaranteed preconfigured or independent of no shutdown.

### E698. Which term describes a field in the IPv4 packet header that contains a unicast, multicast, or broadcast address?

Источник: тесты_exam_6, Q20. Тема: модуль 11.

1. destination IPv4 address
2. protocol
3. TTL
4. header checksum

**Ответ:** destination IPv4 address.

**Объяснение:** Поле destination IPv 4 address определяет, направлен пакет одному хосту, multicast-группе или broadcast-получателям. Protocol — номер вложенного протокола, TTL — ограничитель переходов, Header Checksum — контроль заголовка; они не содержат адрес получателя.

**Explanation in English:** Destination IPv 4 address determines whether the packet targets a unicast host, multicast group or broadcast recipients. Protocol identifies the carried protocol, TTL limits hops and Header Checksum checks the header; none contains the recipient address.

### E705. Floor(config)# interface gi0/1 Floor(config-if)# description Connects to the Registrar LAN Floor(config-if)# ip address 192.168.235.234 255.255.255.0 Floor(config-if)# no shutdown Floor(config-if)# interface gi0/0 Floor(config-if)# description Connects to the Manager LAN Floor(config-if)# ip address 192.168.234.114 255.255.255.0 Floor(config-if)# no shutdown Floor(config-if)# interface s0/0/0 Floor(config-if)# description Connects to the ISP Floor(config-if)# ip address 10.234.235.254 255.255.255.0 Floor(config-if)# no shutdown Floor(config-if)# interface s0/0/1 Floor(config-if)# description Connects to the Head Office WAN Floor(config-if)# ip address 203.0.113.3 255.255.255.0 Floor(config-if)# no shutdown Floor(config-if)# end Refer to the exhibit. A network administrator is connecting a new host to the Registrar LAN. The host needs to communicate with remote networks. What IP address would be configured as the default gateway on the new host?

Источник: тесты_exam_6, Q27. Тема: модуль 11.

1. 192.168.235.234
2. 192.168.235.1
3. 10.234.235.254
4. 203.0.113.3
5. 192.168.234.114

**Ответ:** 192.168.235.234.

**Объяснение:** gi 0/1 описан как Connects to the Registrar LAN и настроен 192.168.235.234/24 — это gateway нового Registrar-хоста. .235.1 отсутствует в конфигурации; .234.114 относится к Manager LAN; WAN/ISP-адреса не находятся на локальном интерфейсе Registrar. Схема не нужна: всё указано командами.

**Explanation in English:** gi 0/1 is described as “Connects to the Registrar LAN” and configured as 192.168.235.234/24, making it the new Registrar host’s gateway. .235.1 is not configured; .234.114 serves Manager LAN; WAN/ISP addresses are not the local Registrar interface. The commands provide all required evidence.

### E707. Three devices are on three different subnets. Match the network address and the broadcast address with each subnet where these devices are located. Device 1: IP address 192.168.10.77/28 on subnet 1Device 2: IP address192.168.10.17/30 on subnet 2Device 3: IP address 192.168.10.35/29 on subnet 3 A Subnet 1 broadcast address 192.168.10.79 done B Subnet 1 network number 192.168.10.64 C Subnet 3 network number 192.168.10.32 D Subnet 2 network number 192.168.10.16 E Subnet 2 broadcast address 192.168.10.19 F Subnet 3 broadcast address 192.168.10.39

Источник: тесты_exam_6, Q29. Тема: модуль 11.



> Ответ

**Ответ:** 192.168.10.77/28 → сеть .64, broadcast .79; 192.168.10.17/30 → сеть .16, broadcast .19; 192.168.10.35/29 → сеть .32, broadcast .39.

**Объяснение:** Для .77/28 шаг 16: floor(77/16)×16=64, broadcast 64+15=79. Для .17/30 шаг 4: network 16, broadcast 19. Для .35/29 шаг 8: network 32, broadcast 39. Первое число блока — network, последнее — broadcast; адреса устройств лежат между ними.

**Explanation in English:** For .77/28, block size 16 gives floor(77/16)×16=64 and broadcast 64+15=79. For .17/30, block size 4 gives network 16/broadcast 19. For .35/29, block size 8 gives network 32/broadcast 39. Each block’s first/last addresses are network/broadcast; the devices lie between them.

### E709. Given network 172.18.109.0, which subnet mask would be used if 6 host bits were available?

Источник: тесты_exam_6, Q31. Тема: модуль 11.

1. 255.255.255.192
2. 255.255.255.252
3. 255.255.224.0
4. 255.255.255.248
5. 255.255.192.0

**Ответ:** 255.255.255.192.

**Объяснение:** Если хосту оставлено 6 бит из 32, сети принадлежит 32−6=26: /26, маска 255.255.255.192. Нужное число нулей в конце маски равно 6; остальные варианты оставляют другое количество host bits.

**Explanation in English:** Leaving 6 host bits out of 32 gives 32−6=26 network bits: /26, mask 255.255.255.192. The mask must end with 6 zero-bits; the other options leave a different number of host bits.

### E710. What does the IP address 192.168.1.15/29 represent?

Источник: тесты_exam_6, Q32. Тема: модуль 11.

1. subnetwork address
2. multicast address
3. unicast address
4. broadcast address

**Ответ:** broadcast address.

**Объяснение:** /29 означает блоки по 8: .0–.7, .8–.15, .16–.23. .15 — последний адрес блока .8/29, то есть broadcast. Network address здесь .8, хосты .9–.14; назвать .15 обычным unicast-host нельзя.

**Explanation in English:** /29 creates blocks of eight: .0–.7, .8–.15, .16–.23. .15 is the final address of .8/29, therefore broadcast. The network address is .8 and usable hosts .9–.14; .15 is not an ordinary unicast host.

### E734. Refer to the exhibit. Host B on subnet Teachers transmits a packet to host D on subnet Students. Which Layer 2 and Layer 3 addresses are contained in the PDUs that are transmitted from host B to the router?

Источник: тесты_exam_7, Q1. Тема: модуль 11.

1. Layer 2 destination address = 00-00-0c-94-36-ab Layer 2 source address = 00-00-0c-94-36-bb Layer 3 destination address = 172.16.20.200 Layer 3 source address = 172.16.10.200
2. Layer 2 destination address = 00-00-0c-94-36-dd Layer 2 source address = 00-00-0c-94-36-bb Layer 3 destination address = 172.16.20.200 Layer 3 source address = 172.16.10.200
3. Layer 2 destination address = 00-00-0c-94-36-cd Layer 2 source address = 00-00-0c-94-36-bb Layer 3 destination address = 172.16.20.99 Layer 3 source address = 172.16.10.200
4. Layer 2 destination address = 00-00-0c-94-36-ab Layer 2 source address = 00-00-0c-94-36-bb Layer 3 destination address = 172.16.20.200 Layer 3 source address = 172.16.100.200

> Ответ для показанного варианта (нужна схема/PT для полной проверки)

**Ответ:** Layer 2 destination address = 00-00-0c-94-36-ab Layer 2 source address = 00-00-0c-94-36-bb Layer 3 destination address = 172.16.20.200 Layer 3 source address = 172.16.10.200.

**Объяснение:** При отправке B → D в другую подсеть L 3 остаётся B IP → D IP: 172.16.10.200 → 172.16.20.200. L 2 идёт B MAC → MAC локального интерфейса роутера, а не MAC D. Сохранённый ключ использует bb → ab. Без схемы привязка MAC ab к этому интерфейсу не проверена; вывод о ролях адресов проверен.

**Explanation in English:** When B sends to D on another subnet, Layer 3 remains B IP → D IP: 172.16.10.200 → 172.16.20.200. Layer 2 uses B’s MAC → its local router-interface MAC, not D’s MAC. The saved key uses bb → ab. Without the exhibit, the assignment of ab to that interface is unverified; the address roles are established.

### E762. Match each description with an appropriate IP address. A a public address 198.133.219.2 B an experimental address 240.2.6.255 C a link-local address 169.254.1.5 D a loopback address 127.0.0.1

Источник: тесты_exam_7, Q29. Тема: модуль 11.



> Ответ

**Ответ:** 198.133.219.2 → public; 240.2.6.255 → experimental/reserved; 169.254.1.5 → link-local; 127.0.0.1 → loopback.

**Объяснение:** 198.133.219.2 — public unicast в задании; 240.2.6.255 входит в reserved/experimental 240/4; 169.254.1.5 — link-local 169.254/16; 127.0.0.1 — loopback. Назначение определяется специальным префиксом, а не последним октетом.

**Explanation in English:** 198.133.219.2 is public unicast here; 240.2.6.255 is in reserved/experimental 240/4; 169.254.1.5 is link-local 169.254/16; 127.0.0.1 is loopback. Special prefixes, not the last octet, determine their purpose.

### E773. Refer to the exhibit. Which two network addresses can be assigned to the network containing 10 hosts? Your answers should waste the fewest addresses, not reuse addresses that are already assigned, and stay within the 10.18.10.0/24 range of addresses. (Choose two.)

Источник: тесты_exam_7, Q40. Тема: модуль 11.

1. 10.18.10.200/28
2. 10.18.10.208/28
3. 10.18.10.224/28
4. 10.18.10.200/27
5. 10.18.10.224/27
6. 10.18.10.240/27

> Ответ для показанного варианта (нужна схема/PT для полной проверки)

**Ответ:** 10.18.10.208/28; 10.18.10.224/28.

**Объяснение:** 10 хостам минимально нужен /28: 16 адресов,14 usable. /28 начинается на кратном 16, поэтому .208/28 и .224/28 корректны; .200/28 не выровнен. /27 больше необходимого, а .200/27 и .240/27 ещё и не сетевые границы. Без схемы нельзя независимо подтвердить, что .208 и .224 свободны.

**Explanation in English:** Ten hosts minimally need /28: 16 total,14 usable. /28 starts at multiples of 16, so .208/28 and .224/28 are aligned; .200/28 is not. /27 wastes more addresses, and .200/27/.240/27 are not network boundaries. The missing exhibit prevents independently verifying that .208 and .224 are unused.

### E781. Refer to the exhibit. A network engineer has been given the network address of 192.168.99.0 and a subnet mask of 255.255.255.192 to subnet across the four networks shown. How many total host addresses are unused across all four subnets?

Источник: тесты_exam_7, Q48. Тема: модуль 11.

1. 224
2. 88
3. 158
4. 200
5. 72

> Ответ для показанного варианта (нужна схема/PT для полной проверки)

**Ответ:** 200.

**Объяснение:** Маска .192 = /26 даёт 62 usable адреса на подсеть; четыре подсети дают 4×62=248. Ответ 200 означал бы, что суммарно занято 48 host addresses: 248−48=200. Числа устройств на отсутствующей схеме не известны, поэтому 200 — сохранённый, но не подтверждённый результат. Нельзя подставлять его для любой схемы из четырёх /26.

**Explanation in English:** Mask .192 is /26, with 62 usable addresses per subnet and 4×62=248 across four. An answer of 200 implies 48 host addresses used:248−48=200. The missing diagram’s device counts are unknown, so 200 is a saved but unverified result, not a universal answer for four /26 networks.

### E789. A network administrator is adding a new LAN to a branch office. The new LAN must support 90 connected devices. What is the smallest network mask that the network administrator can use for the new network?

Источник: тесты_exam_7, Q56. Тема: модуль 11.

1. 255.255.255.128
2. 255.255.255.248
3. 255.255.255.240
4. 255.255.255.224

**Ответ:** 255.255.255.128.

**Объяснение:** Для 90 устройств /26 дал бы только 62 usable, недостаточно. /25 даёт 2^7−2=126, поэтому минимально достаточный блок —255.255.255.128. Остальные предложенные /27,/28,/29 дают 30,14,6 хостов. «Smallest» здесь означает наименьший блок адресов, вмещающий 90.

**Explanation in English:** For 90 devices, /26 provides only 62 usable addresses, too few. /25 provides 2^7−2=126, so 255.255.255.128 is the smallest sufficient block. The other offered /27,/28,/29 masks provide 30,14,6 hosts. “Smallest” means the smallest address block that accommodates 90.

### E137. How many binary bits exist within an IPv6 address?

Источник: модули_05, Q3. Тема: модуль 12.

1. 32
2. 48
3. 64
4. 128
5. 256

**Ответ:** 128.

**Объяснение:** IPv6 имеет восемь групп по 16 бит: 8 × 16 = 128. 32 бита — IPv4, 48 — обычный MAC, 64 — типичный interface ID, но не весь IPv6-адрес.

**Explanation in English:** IPv6 has eight 16-bit groups: 8 × 16 = 128 bits. 32 describes IPv4, 48 an ordinary MAC and 64 a typical interface ID, not the full IPv6 address.

### E139. Which two statements are correct about IPv4 and IPv6 addresses? (Choose two.)

Источник: модули_05, Q5. Тема: модуль 12.

1. IPv6 addresses are represented by hexadecimal numbers.
2. IPv4 addresses are represented by hexadecimal numbers.
3. IPv6 addresses are 32 bits in length.
4. IPv4 addresses are 32 bits in length.
5. IPv4 addresses are 128 bits in length.
6. IPv6 addresses are 64 bits in length.

**Ответ:** IPv6 addresses are represented by hexadecimal numbers.; IPv4 addresses are 32 bits in length..

**Объяснение:** IPv6 обычно записывают hex-группами, а IPv4 содержит 32 бита и обычно записывается четырьмя десятичными октетами. IPv6 содержит 128, не 32/64 бита. Здесь спрашивают стандартное представление адресов, а не возможность математически записать любое число в hex.

**Explanation in English:** IPv6 normally uses hexadecimal groups; IPv4 has 32 bits and normally uses four decimal octets. IPv6 is 128 bits, not 32/64. The question concerns conventional address notation, not the mathematical possibility of writing any number in hex.

### E296. What is the most important motivating factor for moving to IPv6?

Источник: модули_12, Q1. Тема: модуль 12.

1. Better performance with IPv6
2. IPv6 addresses that are easier to work with
3. Better security with IPv6
4. Depletion of IPv4 addresses

**Ответ:** Depletion of IPv4 addresses.

**Объяснение:** Главный стимул — ограниченные 2^32 IPv4-адресов и их исчерпание при росте Интернета. 128-битный IPv6 резко увеличивает пространство. Улучшения заголовка полезны, но IPv6 не гарантирует автоматическую безопасность, меньшую задержку или более простую запись каждого адреса.

**Explanation in English:** The main driver is exhaustion of the limited 2^32 IPv4 address space as Internet use grows. IPv6 greatly expands it to 128 bits. Header improvements help, but IPv6 does not automatically guarantee security, lower latency or easier notation.

### E297. True or False: 4 out of 5 RIRs no longer have enough IPv4 addresses to allocate to customers on a regular basis.

Источник: модули_12, Q2. Тема: модуль 12.

1. True
2. False

> Историческая статистика версии курса; без даты не подходит для однозначного оцениваемого вопроса.

**Ответ:** False.

**Объяснение:** В сохранённом тексте §12.1.1 говорится о всех пяти RIR, поэтому фразе «4 из 5» сопоставлен False. Это датированное утверждение конкретной версии курса, не надёжная проверка современной политики выделения IPv4. В карточке не указана дата; исключаем её из оцениваемого квиза, чтобы не учить устаревающую статистику как постоянный закон.

**Explanation in English:** Saved section 12.1.1 says all five RIRs, which explains its False key for “4 out of 5.” This is a dated course-version claim, not a reliable statement of current IPv4 allocation policy. Because the card has no reference date, it is excluded from scored practice rather than teaching changeable statistics as a permanent rule.

### E298. Which of the following techniques use native IPv6 connectivity?

Источник: модули_12, Q3. Тема: модуль 12.

1. Dual stack
2. Tunneling
3. Translation
4. All of the above

**Ответ:** Dual stack.

**Объяснение:** Dual stack запускает IPv4 и IPv6 параллельно: IPv6-пакет передаётся как IPv6. Tunneling прячет IPv6 внутри IPv4, translation преобразует форматы; это не native IPv6 в смысле вопроса. Поэтому All of the above не подходит.

**Explanation in English:** Dual stack runs IPv4 and IPv6 alongside each other, so IPv6 packets travel as IPv6. Tunneling encapsulates IPv6 inside IPv4 and translation converts protocols; those are not native IPv6 in this question’s sense. Therefore “All of the above” is wrong.

### E299. What is the recommended prefix length for most IPv6 subnets?

Источник: модули_12, Q1. Тема: модуль 12.

1. /32
2. /48
3. /64
4. /128

**Ответ:** /64.

**Объяснение:** Для большинства обычных IPv6 LAN рекомендуется /64: первые 64 бита задают сеть, оставшиеся 64 — interface ID, совместимый с обычным SLAAC. /32 и /48 обычно описывают более крупные блоки, /128 — один адрес. Это правило LAN, не запрет других префиксов для специальных каналов.

**Explanation in English:** Most ordinary IPv6 LANs use /64: 64 network bits and a 64-bit interface ID suitable for normal SLAAC. /32 and /48 usually represent larger allocations; /128 is a single address. This LAN convention does not prohibit other prefixes on specialized links.

### E300. Which part of a GUA is assigned by the ISP?

Источник: модули_12, Q2. Тема: модуль 12.

1. Global routing prefix
2. Global routing prefix and subnet ID
3. Prefix
4. RIR prefix

**Ответ:** Global routing prefix.

**Объяснение:** ISP выделяет global routing prefix организации. Организация сама использует последующие биты subnet ID для своих LAN; interface ID идентифицирует узел внутри LAN. Поэтому ответ не включает автоматически назначение всех внутренних subnet ID провайдером.

**Explanation in English:** The ISP allocates the organization’s global routing prefix. The organization uses following subnet-ID bits for its internal LANs, and an interface ID identifies a node on a LAN. The provider does not thereby choose all internal subnet IDs.

### E301. Which type of IPv6 unicast address is not routable between networks?

Источник: модули_12, Q3. Тема: модуль 12.

1. Unique local address
2. GUA
3. Embedded IPv4 address
4. LLA

**Ответ:** LLA.

**Объяснение:** LLA действует только на своём link: роутеры не пересылают пакеты с такими source/destination за его пределы. ULA может маршрутизироваться между внутренними сетями организации, GUA — глобально; поэтому «не глобальный» не равно «вообще не маршрутизируется».

**Explanation in English:** An LLA is confined to its link; routers do not forward packets with link-local source/destination beyond it. ULAs may be routed between internal networks, while GUAs are globally routable. “Not global” does not mean “never routable.”

### E302. True or false? The Subnet ID field in an GUA must borrow bits from the interface ID.

Источник: модули_12, Q4. Тема: модуль 12.

1. True
2. False

**Ответ:** False.

**Объяснение:** False: subnet ID расположен между global routing prefix и interface ID. Например, из /48 для LAN /64 доступны 64−48 = 16 subnet bits без заимствования последних 64 бит interface ID. Не нужно переносить привычное IPv4-правило заимствования host bits на эту схему буквально.

**Explanation in English:** False: the subnet ID sits between the global routing prefix and interface ID. A /48 allocation with /64 LANs leaves 64−48 = 16 subnet bits without borrowing the final 64 interface-ID bits. The IPv4 host-bit borrowing analogy should not be applied literally here.

### E303. What type of IPv6 address begins with fe80?

Источник: модули_12, Q5. Тема: модуль 12.

1. GUA
2. LLA
3. Multicast address
4. None. An IPv6 address must begin with 2001.

**Ответ:** LLA.

**Объяснение:** fe80 относится к FE80::/10, зарезервированному для link-local unicast (LLA). Multicast начинается с ff, GUA не обязан начинаться именно с 2001. Это определение области адреса, а не признак отсутствующей конфигурации.

**Explanation in English:** fe80 falls in FE80::/10, the link-local unicast range. Multicast starts with ff; a GUA need not specifically start with 2001. The prefix identifies address scope, not missing configuration.

### E304. True or false? RA messages are sent to all IPv6 routers by hosts requesting addressing information.

Источник: модули_12, Q1. Тема: модуль 12.

1. True
2. False

**Ответ:** False.

**Объяснение:** False: host запрашивает информацию сообщением RS (Router Solicitation), обычно к FF02::2. RA (Router Advertisement) отправляет роутер и сообщает префикс/параметры. Утверждение перепутало названия сообщений и отправителей.

**Explanation in English:** False: a host requests information with RS (Router Solicitation), normally to FF02::2. A router sends RA (Router Advertisement) containing prefix/configuration information. The statement reverses message names and senders.

### E305. Which dynamic addressing method for GUAs is the one where devices rely solely on the contents of the RA message for their addressing information?

Источник: модули_12, Q2. Тема: модуль 12.

1. Method 1: SLAAC
2. Method 2: SLAAC and stateless DHCPv6
3. Method 3: Stateful DHCPv6

**Ответ:** Method 1: SLAAC.

**Объяснение:** SLAAC использует префикс из RA, после чего host самостоятельно формирует interface ID и проверяет уникальность. DHCPv6-сервер для выдачи адреса не нужен. В методе 2 сервер даёт дополнительные настройки, а в методе 3 — сам адрес.

**Explanation in English:** SLAAC uses the RA prefix and lets the host generate an interface ID and check uniqueness. No DHCPv6 server assigns its address. Method 2 adds a server for extra settings; method 3 assigns the address through the server.

### E306. Which dynamic addressing method for GUAs is the one where devices rely solely on a DHCPv6 server for their addressing information?

Источник: модули_12, Q3. Тема: модуль 12.

1. Method 1: SLAAC
2. Method 2: SLAAC and stateless DHCPv6
3. Method 3: Stateful DHCPv6

**Ответ:** Method 3: Stateful DHCPv6.

**Объяснение:** Stateful DHCPv6 выдаёт IPv6-адрес и ведёт состояние аренд, поэтому подходит формулировка о серверной выдаче адресной информации. Важно: слово solely не относится к default gateway — его host обычно узнаёт через RA, даже используя stateful DHCPv6. SLAAC формирует адрес на самом host.

**Explanation in English:** Stateful DHCPv6 assigns the IPv6 address and tracks leases, matching the server-based assignment described. Important: “solely” does not cover the default gateway, which normally still comes from RA. SLAAC forms the address on the host.

### E307. Which dynamic addressing method for GUAs is the one where devices get their IPv6 configuration in a RA message and request DNS information from a DHCPv6 server?

Источник: модули_12, Q4. Тема: модуль 12.

1. Method 1: SLAAC
2. Method 2: SLAAC and stateless DHCPv6
3. Method 3: Stateful DHCPv6

**Ответ:** Method 2: SLAAC and stateless DHCPv6.

**Объяснение:** Это SLAAC + stateless DHCPv6: адрес host формирует по RA, а DNS и дополнительные параметры получает от DHCPv6. Сервер не выдаёт здесь сам IPv6-адрес и не ведёт адресные аренды как stateful DHCPv6.

**Explanation in English:** This is SLAAC plus stateless DHCPv6: the host forms its address using RA, then obtains DNS and other settings through DHCPv6. The server does not assign the IPv6 address or maintain address leases as stateful DHCPv6 does.

### E308. What are the two methods a device can use to generate its own IPv6 interface ID?

Источник: модули_12, Q5. Тема: модуль 12.

1. SLAAC
2. Stateless DHCPv6
3. Stateful DHCPv6
4. EUI-64
5. Randomly generated

**Ответ:** EUI-64; Randomly generated.

**Объяснение:** EUI-64 и randomly generated — именно способы сформировать interface ID: первый выводит его из MAC, второй не требует MAC. SLAAC — процесс автоконфигурации в целом; stateless DHCPv6 даёт другие параметры, а stateful DHCPv6 назначает адрес сервером.

**Explanation in English:** EUI-64 and random generation are interface-ID construction methods: one derives it from MAC, the other need not. SLAAC is the overall autoconfiguration process; stateless DHCPv6 supplies other settings and stateful DHCPv6 assigns addresses through a server.

### E309. True or False? IPv6 was designed with subnetting in mind.

Источник: модули_12, Q1. Тема: модуль 12.

1. True
2. False

**Ответ:** True.

**Объяснение:** True: структура GUA явно предусматривает subnet ID, которым организация разделяет выделенный префикс на внутренние сети. Например, /48 содержит 65536 подсетей /64. Это не означает, что все сети автоматически настроятся без плана адресации.

**Explanation in English:** True: GUA structure includes a subnet ID that lets an organization divide its allocation into internal networks. A /48, for example, contains 65536 /64s. This does not mean all networks configure themselves without an addressing plan.

### E310. Which field in an IPv6 GUA is used for subnetting?

Источник: модули_12, Q2. Тема: модуль 12.

1. Prefix
2. Network
3. Global Routing Prefix
4. Subnet ID
5. Interface ID

**Ответ:** Subnet ID.

**Объяснение:** Subnet ID выбирает конкретную подсеть внутри выделенного организации global routing prefix. Interface ID выбирает интерфейс в этой подсети. Слова prefix/network шире и не называют конкретное поле, о котором спрашивают.

**Explanation in English:** The subnet ID selects an internal subnet within the organization’s allocated global routing prefix. The interface ID selects an interface on that subnet. “Prefix/network” are broader terms rather than the specific field requested.

### E311. Given a /48 Global Routing Prefix and a /64 prefix, what is the subnet portion of the following address: 2001:db8:cafe:1111:2222:3333:4444:5555

Источник: модули_12, Q3. Тема: модуль 12.

1. Café
2. 1111
3. 2222
4. 3333
5. 4444

**Ответ:** 1111.

**Объяснение:** /48 занимает первые три hextet: 2001:db8:cafe. LAN /64 включает четвёртый hextet, поэтому 1111 — 16-битный subnet ID. 2222:3333:4444:5555 составляет interface ID; cafe ещё входит в выделенный провайдером префикс.

**Explanation in English:** /48 covers the first three hextets, 2001:db8:cafe. The /64 LAN includes the fourth, so 1111 is the 16-bit subnet ID. 2222:3333:4444:5555 is the interface ID; cafe still belongs to the provider prefix.

### E312. Given a /32 Global Routing Prefix and a /64 prefix, how many bits would be allocated for the Subnet ID?

Источник: модули_12, Q4. Тема: модуль 12.

1. 8
2. 16
3. 32
4. 48
5. 64

**Ответ:** 32.

**Объяснение:** Subnet ID занимает промежуток от /32 провайдера до /64 LAN: 64−32 = 32 бита. Последние 64 бита остаются interface ID. Ответ 16 был бы верен для /48→/64, но здесь исходный префикс /32.

**Explanation in English:** Subnet ID spans from the /32 allocation to the /64 LAN boundary: 64−32 = 32 bits. The last 64 remain interface ID. 16 would be correct for /48 to /64, not this /32 allocation.

### E313. What is the valid most compressed format possible of the IPv6 address 2001:0DB8:0000:AB00:0000:0000:0000:1234?

Источник: модули_12, Q1. Тема: модуль 12.

1. 2001:DB8:0:AB00::1234
2. 2001:DB8:0:AB::1234
3. 2001:DB8::AB00::1234
4. 2001:DB8:0:AB:0:1234

**Ответ:** 2001:DB8:0:AB00::1234.

**Объяснение:** Убираем ведущий ноль в 0DB8 → DB8 и заменяем три подряд нулевых hextet после AB00 на ::. Получаем 2001:DB8:0:AB00::1234. Нули в конце AB00 нельзя удалять (AB — другое число), два :: создают неоднозначность.

**Explanation in English:** Remove the leading zero from 0DB8 and replace the three consecutive zero hextets after AB00 with ::. The result is 2001:DB8:0:AB00::1234. Trailing zeros in AB00 cannot be removed (AB is a different value), and two :: would be ambiguous.

### E314. What is the prefix associated with the IPv6 address 2001:DB8:D15:EA:CC44::1/64?

Источник: модули_12, Q2. Тема: модуль 12.

1. 2001::/64
2. 2001:DB8::/64
3. 2001:DB8:D15:EA::/64
4. 2001:DB8:D15:EA:CC44::/64

**Ответ:** 2001:DB8:D15:EA::/64.

**Объяснение:** /64 сохраняет первые четыре группы: 2001:DB8:D15:EA. Остальные биты host-части обнуляем: 2001:DB8:D15:EA::/64. CC44 — пятая группа и уже относится к interface ID.

**Explanation in English:** /64 retains the first four groups: 2001:DB8:D15:EA. Zeroing the interface portion produces 2001:DB8:D15:EA::/64. CC44 is the fifth group and belongs to the interface ID.

### E315. What type of address is automatically assigned to an interface when IPv6 is enabled on that interface?

Источник: модули_12, Q3. Тема: модуль 12.

1. Global unicast
2. Link-local
3. Loopback
4. Unique local

**Ответ:** Link-local.

**Объяснение:** При включении IPv6 интерфейс автоматически формирует link-local адрес для общения на своём link и Neighbor Discovery. GUA или ULA требуют дополнительного назначения/автоконфигурации; ::1 — loopback всего локального стека, не автоматически выдаваемый каждому интерфейсу адрес.

**Explanation in English:** Enabling IPv6 automatically creates a link-local address for local-link communication and Neighbor Discovery. GUA/ULA need further assignment/autoconfiguration; ::1 is stack loopback, not an address assigned separately to every interface.

### E316. Which IPv6 network prefix is only intended for local links and can not be routed?

Источник: модули_12, Q4. Тема: модуль 12.

1. 2001::/3
2. FC00::/7
3. FE80::/10
4. FF00::/12

**Ответ:** FE80::/10.

**Объяснение:** FE80::/10 — link-local диапазон, ограниченный одним link. FC00::/7 — unique-local, который может маршрутизироваться внутри организации. Global unicast имеет другой scope; FF обозначает multicast, а не link-local unicast.

**Explanation in English:** FE80::/10 is the link-local range confined to one link. FC00::/7 is unique-local and can be internally routed. Global unicast has a different scope; FF identifies multicast, not link-local unicast.

### E317. What is the purpose of the command ping ::1 ?

Источник: модули_12, Q5. Тема: модуль 12.

1. It tests the internal configuration of an IPv6 host.
2. It tests the broadcast capability of all hosts on the subnet.
3. It tests the multicast connectivity to all hosts on the subnet.
4. It tests the reachability of the default gateway for the network.

**Ответ:** It tests the internal configuration of an IPv6 host..

**Объяснение:** ::1 — IPv6 loopback: ping обращается к собственному стеку и проверяет его локальную работу. Пакет не идёт по кабелю к gateway или другим host, поэтому тест не проверяет сеть, multicast и тем более отсутствующий в IPv6 broadcast.

**Explanation in English:** ::1 is IPv6 loopback: ping exercises the local stack. It does not travel over the cable to a gateway or other hosts, so it does not test external connectivity, multicast or the broadcast mechanism IPv6 does not have.

### E318. What is the interface ID of the IPv6 address 2001:DB8::1000:A9CD:47FF:FE57:FE94/64?

Источник: модули_12, Q6. Тема: модуль 12.

1. FE94
2. FE57:FE94
3. 47FF:FE57:FE94
4. A9CD:47FF:FE57:FE94
5. 1000:A9CD:47FF:FE57:FE94

**Ответ:** A9CD:47FF:FE57:FE94.

**Объяснение:** Сначала раскрываем ::: 2001:DB8:0000:1000:A9CD:47FF:FE57:FE94. /64 оставляет первые четыре группы сети, а последние четыре A9CD:47FF:FE57:FE94 — interface ID. 1000 относится к четвёртой группе, не к host-части.

**Explanation in English:** Expand :: first: 2001:DB8:0000:1000:A9CD:47FF:FE57:FE94. /64 makes the first four groups the network and the final four, A9CD:47FF:FE57:FE94, the interface ID. 1000 is the fourth network group, not host portion.

### E319. What is the network address for the IPv6 address 2001:DB8:AA04:B5::1/64?

Источник: модули_12, Q7. Тема: модуль 12.

1. 2001::/64
2. 2001:DB8::/64
3. 2001:DB8:AA04::/64
4. 2001:DB8:AA04:B5::/64

**Ответ:** 2001:DB8:AA04:B5::/64.

**Объяснение:** Четыре hextet по 16 бит дают /64: 2001:DB8:AA04:B5. Обнуляем последние четыре и получаем 2001:DB8:AA04:B5::/64. Убирать B5 из сетевой части нельзя: это изменит первые 64 бита.

**Explanation in English:** Four 16-bit hextets make /64: 2001:DB8:AA04:B5. Zero the final four to obtain 2001:DB8:AA04:B5::/64. Removing B5 changes the actual first 64 bits.

### E320. Which address type is not supported in IPv6?

Источник: модули_12, Q8. Тема: модуль 12.

1. Private
2. Multicast
3. Unicast
4. Broadcast

**Ответ:** Broadcast.

**Объяснение:** В IPv6 нет broadcast; доставку группе выполняет multicast. Unicast существует, а аналогом ограниченной внутренней адресации служат unique-local адреса, поэтому слово private не является лучшим ответом по сравнению с явно отсутствующим broadcast.

**Explanation in English:** IPv6 has no broadcast; multicast provides group delivery. Unicast exists, and unique-local addresses support limited internal addressing, so “private” is not the best choice compared with the explicitly absent broadcast type.

### E321. What is indicated by a successful ping to the ::1 IPv6 address?

Источник: модули_12, Q9. Тема: модуль 12.

1. The host is cabled properly.
2. The default gateway address is correctly configured.
3. All hosts on the local link are available.
4. The link-local address is correctly configured.
5. IP is properly installed on the host.

**Ответ:** IP is properly installed on the host..

**Объяснение:** Успешный ping ::1 подтверждает, что локальный IPv6/IP-стек отвечает. Он не выходит на реальную сеть, поэтому не доказывает исправность кабеля, gateway, link-local настройки или доступность остальных host.

**Explanation in English:** A successful ::1 ping confirms the local IPv6/IP stack responds. It never tests the real link, so it cannot prove cabling, gateway configuration, link-local configuration or other hosts’ reachability.

### E322. What is the most compressed representation of the IPv6 address 2001:0db8:0000:abcd:0000:0000:0000:0001?

Источник: модули_12, Q10. Тема: модуль 12.

1. 2001:0db8:abcd::1
2. 2001:db8:0:abcd::1
3. 2001:0db8:abcd::0001
4. 2001:0db8:0000:abcd::1
5. 2001:db8::abcd:0:1

**Ответ:** 2001:db8:0:abcd::1.

**Объяснение:** 2001:0db8:0000:abcd:0000:0000:0000:0001 → убираем ведущие нули, затем сокращаем три нулевые группы после abcd: 2001:db8:0:abcd::1. Единственную нулевую группу перед abcd надо сохранить: иначе изменится её позиция и весь адрес.

**Explanation in English:** Remove leading zeros, then compress the three zero groups after abcd: 2001:db8:0:abcd::1. Keep the single zero group before abcd; dropping it would move abcd and change the address.

### E323. What is the minimum configuration for a router interface that is enabled for IPv6?

Источник: модули_12, Q11. Тема: модуль 12.

1. To have a link-local IPv6 address
2. To have both an IPv4 and an IPv6 address
3. To have a self-generated loopback address
4. To have both a link-local and a global unicast IPv6 address

**Ответ:** To have a link-local IPv6 address.

**Объяснение:** Минимум — link-local IPv6 address: он обеспечивает работу IPv6 на своём канале и ND. Глобальный адрес нужен не каждому интерфейсу для локального обмена; IPv4 параллельно не обязателен. Loopback не заменяет адрес интерфейса на link.

**Explanation in English:** A link-local IPv6 address is the minimum for local-link IPv6 and ND. Global unicast is not required for every local exchange, and IPv4 need not coexist. Stack loopback cannot substitute for a link interface address.

### E324. At a minimum, which address is required on IPv6-enabled interfaces?

Источник: модули_12, Q12. Тема: модуль 12.

1. Link-local
2. Unique local
3. Site local
4. Global unicast

**Ответ:** Link-local.

**Объяснение:** Link-local требуется для базового общения и обнаружения соседей на IPv6-enabled интерфейсе. GUA нужен для глобальной адресации, ULA — для внутренней; site-local — устаревший тип. Ни один из них не заменяет минимальную LLA.

**Explanation in English:** Link-local is required for basic IPv6 communication and neighbor discovery on the link. GUA supports global addressing, ULA internal addressing, and site-local is deprecated. None substitutes for the minimum LLA.

### E325. What are three parts of an IPv6 global unicast address? (Choose three.)

Источник: модули_12, Q13. Тема: модуль 12.

1. An interface ID that is used to identify the local network for a particular host
2. A global routing prefix that is used to identify the network portion of the address that has been provided by an ISP
3. A subnet ID that is used to identify networks inside of the local enterprise site
4. A global routing prefix that is used to identify the portion of the network address provided by a local administrator
5. An interface ID that is used to identify the local host on the network

**Ответ:** A global routing prefix that is used to identify the network portion of the address that has been provided by an ISP; A subnet ID that is used to identify networks inside of the local enterprise site; An interface ID that is used to identify the local host on the network.

**Объяснение:** Три части: global routing prefix выделяет ISP; subnet ID выбирает сеть внутри организации; interface ID идентифицирует локальный интерфейс host. В неверных вариантах перепутаны роли: interface ID не задаёт локальную сеть, а глобальный префикс не описан здесь как произвольный выбор локального администратора.

**Explanation in English:** The ISP supplies the global routing prefix; subnet ID selects an internal network; interface ID identifies the host interface on that network. The wrong options swap roles: interface ID does not identify the network, and the provider prefix is not simply assigned by the local administrator.

### E326. Your organization is issued the IPv6 prefix of 2001:db8:130f::/48 by your service provider. With this prefix, how many bits are available for your organization to create /64 subnetworks if interface ID bits are not borrowed?

Источник: модули_12, Q14. Тема: модуль 12.

1. 8
2. 16
3. 80
4. 128

**Ответ:** 16.

**Объяснение:** До границы LAN /64 после /48 остаётся 64−48 = 16 бит subnet ID. Это 2^16 = 65536 /64-подсетей. 80 — все биты после /48, включая interface ID, который условие запрещает заимствовать.

**Explanation in English:** There are 64−48 = 16 subnet-ID bits before the /64 LAN boundary, giving 2^16 = 65536 /64s. 80 counts every bit after /48, including interface-ID bits the question forbids borrowing.

### E327. Which type of IPv6 address is not routable and used only for communication on a single subnet?

Источник: модули_12, Q15. Тема: модуль 12.

1. Global unicast address
2. Link-local address
3. Loopback address
4. Unique local address
5. Unspecified address

**Ответ:** Link-local address.

**Объяснение:** Link-local предназначен для общения только на одном link и не пересылается роутерами. Loopback замыкается на самом узле, unspecified означает отсутствие адреса; ULA может маршрутизироваться внутри нескольких сетей организации, GUA — глобально.

**Explanation in English:** Link-local communicates on one link and is not forwarded by routers. Loopback stays inside the host, unspecified means no address, ULA can route across internal networks and GUA globally.

### E490. What is the prefix for the host address 2001:DB8:BC15:A:12AB::1/64?

Источник: тесты_IP_Addressing, Q12. Тема: модуль 12.

1. 2001:DB8:BC15
2. 2001:DB8:BC15:A
3. 2001:DB8:BC15:A:1
4. 2001:DB8:BC15:A:12

**Ответ:** 2001:DB8:BC15:A.

**Объяснение:** /64 — четыре полных hextet: 2001:DB8:BC15:A. Полная запись сетевого префикса — 2001:DB8:BC15:A::/64. 12AB уже interface ID; первые три группы были бы лишь /48.

**Explanation in English:** /64 means four complete hextets: 2001:DB8:BC15:A. Written fully, the network prefix is 2001:DB8:BC15:A::/64. 12AB belongs to interface ID; three groups would describe only /48.

### E492. Given IPv6 address prefix 2001:db8::/48, what will be the last subnet that is created if the subnet prefix is changed to /52?

Источник: тесты_IP_Addressing, Q14. Тема: модуль 12.

1. 2001:db8:0:f00::/52
2. 2001:db8:0:8000::/52
3. 2001:db8:0:f::/52
4. 2001:db8:0:f000::/52

**Ответ:** 2001:db8:0:f000::/52.

**Объяснение:** Удлинение /48 до /52 добавляет 4 subnet bits — старший hex-разряд четвёртого hextet. Его значения 0…f дают 16 подсетей; младшие 12 бит этого hextet должны быть нулевыми. Последняя сеть поэтому 2001:db8:0:f000::/52, а не :f: или :f00:.

**Explanation in English:** Extending /48 to /52 adds four subnet bits: the highest hex digit of the fourth hextet. Values 0…f yield 16 subnets, while its lower 12 bits remain zero. Thus the last network is 2001:db8:0:f000::/52, not :f: or :f00:.

### E493. Which address is a valid IPv6 link-local unicast address?

Источник: тесты_IP_Addressing, Q15. Тема: модуль 12.

1. FEC8:1::FFFF
2. FD80::1:1234
3. FE80::1:4545:6578:ABC1
4. FE0A::100:7788:998F
5. FC90:5678:4251:FFFF

**Ответ:** FE80::1:4545:6578:ABC1.

**Объяснение:** FE80::1:4545:6578:ABC1 попадает в FE80::/10 и имеет корректную IPv6-запись. FD80 и FC90 относятся к ULA; FEC8 не входит в link-local /10, FE0A тоже ниже его начала. Последний вариант вдобавок не содержит восемь групп или :: для пропущенных.

**Explanation in English:** FE80::1:4545:6578:ABC1 is valid IPv6 notation inside FE80::/10. FD80/FC90 are in the ULA range; FEC8 and FE0A are outside link-local /10. The last option also lacks eight groups or :: to represent omissions.

### E494. Which type of IPv6 address refers to any unicast address that is assigned to multiple hosts?

Источник: тесты_IP_Addressing, Q16. Тема: модуль 12.

1. unique local
2. global unicast
3. link-local
4. anycast

**Ответ:** anycast.

**Объяснение:** Anycast использует один unicast-адрес на нескольких интерфейсах; маршрутизация доставляет пакет одному ближайшему по метрике экземпляру. Multicast доставлял бы группе, а GUA/LLA/ULA описывают область адреса, не этот способ назначения нескольким узлам.

**Explanation in English:** Anycast assigns one unicast address to multiple interfaces and routing delivers to one nearest instance by metric. Multicast would deliver to a group; GUA/LLA/ULA describe scope rather than this multiple-instance assignment.

### E495. What are two types of IPv6 unicast addresses? (Choose two.)

Источник: тесты_IP_Addressing, Q17. Тема: модуль 12.

1. multicast
2. loopback
3. link-local
4. anycast
5. broadcast

**Ответ:** loopback; link-local.

**Объяснение:** Loopback (::1) и link-local — разновидности unicast: адресуют один интерфейс/локальный стек. Multicast и anycast — отдельные типы доставки; broadcast в IPv6 отсутствует.

**Explanation in English:** Loopback (::1) and link-local are unicast forms, addressing one interface/local stack. Multicast and anycast are separate delivery categories; IPv6 has no broadcast.

### E496. Which IPv6 prefix is reserved for communication between devices on the same link?

Источник: тесты_IP_Addressing, Q18. Тема: модуль 12.

1. FC00::/7
2. 2001::/32
3. FE80::/10
4. FDFF::/7

**Ответ:** FE80::/10.

**Объяснение:** FE80::/10 специально выделен для link-local общения; такие пакеты не покидают канал. FC00::/7 (включая FD…) — ULA для ограниченных внутренних сетей и может маршрутизироваться между ними. 2001::/32 не является link-local префиксом.

**Explanation in English:** FE80::/10 is reserved for link-local communication and its packets stay on the link. FC00::/7, including FD…, is ULA and can route between limited internal networks. 2001::/32 is not link-local.

### E497. Which service provides dynamic global IPv6 addressing to end devices without using a server that keeps a record of available IPv6 addresses?

Источник: тесты_IP_Addressing, Q19. Тема: модуль 12.

1. stateful DHCPv6
2. SLAAC
3. static IPv6 addressing
4. stateless DHCPv6

**Ответ:** SLAAC.

**Объяснение:** SLAAC формирует GUA на host из рекламируемого роутером префикса и собственного IID, без сервера адресных аренд. Stateless DHCPv6 обычно даёт дополнительные параметры, не сам адрес; stateful DHCPv6 ведёт аренды, а static — ручное назначение.

**Explanation in English:** SLAAC forms a GUA on the host using the advertised prefix and its own IID, without an address-lease server. Stateless DHCPv6 supplies additional settings rather than the address; stateful DHCPv6 tracks leases and static means manual assignment.

### E498. Refer to the exhibit. A company is deploying an IPv6 addressing scheme for its network. The company design document indicates that the subnet portion of the IPv6 addresses is used for the new hierarchical network design, with the site subsection to represent multiple geographical sites of the company, the sub-site section to represent multiple campuses at each site, and the subnet section to indicate each network segment separated by routers. With such a scheme, what is the maximum number of subnets achieved per sub-site?

Источник: тесты_IP_Addressing, Q20. Тема: модуль 12.

1. 0
2. 4
3. 16
4. 256

> Нужна схема с шириной полей; 16 верно только при 4 битах subnet на sub-site.

**Ответ:** 16.

**Объяснение:** 16 подсетей получается только если схема оставляет 4 бита subnet-поля внутри каждого sub-site: 2^4 = 16. Иерархию site/sub-site/subnet нельзя восстановить из текста без размеров полей на рисунке. Ключ сохранён как условный; без схемы карточка не оценивается.

**Explanation in English:** 16 subnets follows only if the diagram allocates four subnet bits within each sub-site: 2^4 = 16. The text alone does not specify the site/sub-site/subnet field widths. The key remains conditional and the exhibit-free card is not scored.

### E499. An IPv6 enabled device sends a data packet with the destination address of FF02::1. What is the target of this packet?

Источник: тесты_IP_Addressing, Q21. Тема: модуль 12.

1. the one IPv6 device on the link that has been uniquely configured with this address
2. all IPv6 enabled devices on the local link or network
3. only IPv6 DHCP servers
4. only IPv6 configured routers

**Ответ:** all IPv6 enabled devices on the local link or network.

**Объяснение:** FF02::1 — all-nodes multicast со scope link-local: получают IPv6-узлы именно этого канала. Только роутеры — FF02::2. Пакет не адресован одному уникальному host и не является специальным запросом DHCP-серверам.

**Explanation in English:** FF02::1 is link-local all-nodes multicast, targeting IPv6 nodes on this link. Routers only would be FF02::2. It is neither one unique host nor the DHCP-server group.

### E500. Three methods allow IPv6 and IPv4 to co-exist. Match each method with its description. A The IPv4 packets and IPv6 packets coexist in the same network. dual-stack done B IPv6 packets are converted into IPv4 packets, and vice versa. translation C The IPv6 packet is transported inside an IPv4 packet. tunneling

Источник: тесты_IP_Addressing, Q22. Тема: модуль 12.



> Ответ

**Ответ:** dual-stack: IPv4 и IPv6 работают параллельно; translation: преобразование IPv4 ↔ IPv6; tunneling: пакет IPv6 внутри IPv4.

**Объяснение:** Dual-stack сохраняет два независимых стека и оба формата пакетов. Tunneling оставляет исходный IPv6 пакет внутри IPv4-оболочки. Translation преобразует один протокол в другой, поэтому это не то же самое, что вложить неизменённый пакет.

**Explanation in English:** Dual stack keeps both protocol stacks and packet formats. Tunneling carries the original IPv6 packet inside an IPv4 envelope. Translation converts one protocol into the other rather than merely enclosing the unchanged packet.

### E501. Match the IPv6 address with the IPv6 address type. A FF02::1:FFAE:F85F solicited node multicast done B ::1 loopback C FF02::1 all node multicast D 2001:DB8::BAF:3F57:FE94 global unicast

Источник: тесты_IP_Addressing, Q23. Тема: модуль 12.



> Ответ

**Ответ:** FF02::1:FFAE:F85F → solicited-node multicast; ::1 → loopback; FF02::1 → all-nodes multicast; 2001:DB8::BAF:3F57:FE94 → global unicast.

**Объяснение:** FF02::1:FFAE:F85F соответствует solicited-node шаблону FF02::1:FFxx:xxxx; ::1 — loopback; FF02::1 — all-nodes multicast. 2001:DB8::BAF:3F57:FE94 имеет формат GUA в учебной классификации, но 2001:db8::/32 специально зарезервирован для документации, а не реальной публичной маршрутизации.

**Explanation in English:** FF02::1:FFAE:F85F matches the solicited-node FF02::1:FFxx:xxxx pattern; ::1 is loopback; FF02::1 is all-nodes multicast. 2001:DB8::BAF:3F57:FE94 has GUA form in the exercise, but 2001:db8::/32 is reserved for documentation, not actual public routing.

### E508. Open the PT Activity. Perform the tasks in the activity instructions and then answer the question. What are the three IPv6 addresses displayed when the route from PC1 to PC2 is traced? (Choose three.)

Источник: тесты_IP_Addressing, Q30. Тема: модуль 12.

1. 2001:DB8:1:1::1
2. 2001:DB8:1:1::A
3. 2001:DB8:1:2::2
4. 2001:DB8:1:2::1
5. 2001:DB8:1:3::1
6. 2001:DB8:1:3::2
7. 2001:DB8:1:4::1

> Требуется исходная PT-активность и вывод traceroute; конкретные три адреса не проверены.

**Ответ:** 2001:DB8:1:1::1; 2001:DB8:1:2::1; 2001:DB8:1:3::2.

**Объяснение:** Traceroute показывает адреса узлов, отвечающих на исчерпание Hop Limit, затем назначение. Сохранённые три адреса можно подтвердить только выполнив исходную PT-активность и проверив её маршруты. По одному списку IPv6-адресов порядок реального пути не определяется; карточка исключена из оценивания.

**Explanation in English:** Traceroute reports nodes responding to expired Hop Limit and then the destination. The saved three addresses require the original Packet Tracer activity and its routing state to verify. A list of candidate IPv6 addresses alone cannot reveal the actual path; the card is excluded from scoring.

### E510. Which is the compressed format of the IPv6 address 2001:0db8:0000:0000:0000:a0b0:0008:0001?

Источник: тесты_IP_Addressing, Q32. Тема: модуль 12.

1. 2001:db8::a0b0:8:1
2. 2001:db8::ab8:1:0:1000
3. 2001:db80:0:1::80:1
4. 2001:db8:0:1::8:1

**Ответ:** 2001:db8::a0b0:8:1.

**Объяснение:** Три последовательные группы 0000 после 0db8 заменяются ::; ведущие нули убираются: 0db8→db8, 0008→8, 0001→1. В a0b0 нули внутренние/конечные и остаются. Итог 2001:db8::a0b0:8:1; остальные варианты меняют значения или позиции групп.

**Explanation in English:** Compress the three zero groups after 0db8 to :: and remove leading zeros: 0db8→db8, 0008→8, 0001→1. Zeros inside/after nonzero digits in a0b0 stay. The result is 2001:db8::a0b0:8:1; other options change group values or positions.

### E579. What is one advantage that the IPv6 simplified header offers over IPv4?

Источник: тесты_exam_2, Q1. Тема: модуль 12.

1. smaller-sized header
2. little requirement for processing checksums
3. smaller-sized source and destination IP addresses
4. efficient packet handling

**Ответ:** efficient packet handling.

**Объяснение:** Упрощённый основной IPv6-заголовок улучшает обработку пакетов: фиксированная структура и отсутствие checksum основного заголовка уменьшают некоторые действия роутера. Он не меньше минимального IPv4-заголовка (40 против 20 байт), а адреса длиннее (128 против 32). «Efficient packet handling» — общий результат этих изменений.

**Explanation in English:** The simplified IPv6 base header supports efficient packet handling through its fixed structure and lack of a base-header checksum. It is not smaller than the minimum IPv4 header (40 versus 20 bytes), and addresses are larger (128 versus 32 bits). “Efficient packet handling” is the overall benefit.

### E583. Why is NAT not needed in IPv6?

Источник: тесты_exam_2, Q5; тесты_exam_6, Q19. Тема: модуль 12.

1. Because IPv6 has integrated security, there is no need to hide the IPv6 addresses of internal networks.
2. Any host or user can get a public IPv6 network address because the number of available IPv6 addresses is extremely large.
3. The problems that are induced by NAT applications are solved because the IPv6 header improves packet handling by intermediate routers.
4. The end-to-end connectivity problems that are caused by NAT are solved because the number of routes increases with the number of nodes that are connected to the Internet.

**Ответ:** Any host or user can get a public IPv6 network address because the number of available IPv6 addresses is extremely large..

**Объяснение:** 128-битное адресное пространство позволяет выделять огромное количество глобальных адресов, поэтому NAT не требуется как мера экономии IPv4. Это не означает, что IPv6 автоматически безопасен или что firewall не нужен. Увеличение таблиц маршрутов и упрощение заголовка сами по себе не объясняют отказ от NAT ради экономии адресов.

**Explanation in English:** The 128-bit space permits vast numbers of global addresses, removing IPv4-style address-conservation pressure for NAT. It does not make IPv6 automatically secure or eliminate firewalls. Route-table growth and header simplification do not explain this address-conservation benefit.

### E711. Which is the compressed format of the IPv6 address fe80:0000:0000:0000:0220:0b3f:f0e0:0029?

Источник: тесты_exam_6, Q33. Тема: модуль 12.

1. fe80::220:b3f:f0e0:29
2. fe80:9ea:0:2200::fe0:290
3. fe80:9ea0::2020:0:bf:e0:9290
4. fe80:9ea0::2020::bf:e0:9290

**Ответ:** fe80::220:b3f:f0e0:29.

**Объяснение:** Три подряд 0000 после fe80 сокращаются до ::; 0220→220, 0b3f→b3f и 0029→29. f0e0 сохраняется, потому что удаляются лишь ведущие нули. Получается fe80::220:b3f:f0e0:29; варианты с 9ea добавляют отсутствующие данные.

**Explanation in English:** Compress the three zero groups after fe80 to ::; 0220→220, 0b3f→b3f and 0029→29. Keep f0e0 because only leading zeros may be removed. The result is fe80::220:b3f:f0e0:29; options containing 9ea introduce nonexistent data.

### E712. What type of IPv6 address is represented by ::1/128?

Источник: тесты_exam_6, Q34. Тема: модуль 12.

1. loopback
2. unspecified
3. global unicast
4. EUI-64 generated link-local

**Ответ:** loopback.

**Объяснение:** ::1/128 — единственный IPv6 loopback-адрес для обращения к себе. Unspecified — ::/128 без единицы. GUA и link-local адресуют интерфейсы сети; loopback не генерируется из EUI-64.

**Explanation in English:** ::1/128 is IPv6’s loopback address for the local host. Unspecified is ::/128 without the final one. GUA/link-local identify network interfaces, and loopback is not generated using EUI-64.

### E713. Refer to the exhibit. A user issues the command netstat –r on a workstation. Which IPv6 address is one of the link-local addresses of the workstation?

Источник: тесты_exam_6, Q35. Тема: модуль 12.

1. ::1/128
2. fe80::30d0:115:3f57:fe4c/128
3. fe80::/64
4. 2001:0:9d38:6ab8:30d0:115:3f57:fe4c/128

> Тип адреса определим по префиксу, но принадлежность workstation требует исходного вывода netstat.

**Ответ:** fe80::30d0:115:3f57:fe4c/128.

**Объяснение:** fe80::30d0:115:3f57:fe4c/128 — отдельный адрес в link-local диапазоне. fe80::/64 выглядит как маршрут префикса, ::1/128 — loopback, а 2001:… не link-local. Но подтвердить, что выбранный адрес принадлежит именно этой workstation, можно только по отсутствующему выводу netstat; ключ условный.

**Explanation in English:** fe80::30d0:115:3f57:fe4c/128 is a single address in the link-local range. fe80::/64 is a prefix route, ::1/128 is loopback and 2001:… is not link-local. However, proving ownership by this workstation requires the missing netstat output; the key remains conditional.

### E729. Only employees connected to IPv6 interfaces are having difficulty connecting to remote networks. The analyst wants to verify that IPv6 routing has been enabled. What is the best command to use to accomplish the task?

Источник: тесты_exam_6, Q51. Тема: модуль 12.

1. show running-config
2. show interfaces
3. copy running-config startup-config
4. show ip nat translations

**Ответ:** show running-config.

**Объяснение:** В show running-config ищут глобальную команду ipv6 unicast-routing: именно она включает IPv6 forwarding. show interfaces описывает интерфейсы, copy … сохраняет настройки, show ip nat translations показывает IPv4 NAT; ни одна из них прямо не подтверждает нужную конфигурационную команду.

**Explanation in English:** Use show running-config to find the global ipv6 unicast-routing command enabling IPv6 forwarding. show interfaces reports interfaces, copy … saves settings and show ip nat translations shows IPv4 NAT; none directly verifies that configuration command.

### E750. Match the description to the IPv6 addressing component. A This part of the address is used by an organization to identify subnets. subnet ID B This part of the address is the equivalent to the host portion of an IPv4 address. interface ID C This network portion of the address is assigned by the provider. global routing prefix

Источник: тесты_exam_7, Q17. Тема: модуль 12.



> Ответ

**Ответ:** subnet ID → подсеть организации; interface ID → интерфейс хоста; global routing prefix → префикс провайдера.

**Объяснение:** Global routing prefix — блок от провайдера; subnet ID — выбранная организацией сеть внутри блока; interface ID — интерфейс host внутри этой сети. Поэтому аналог host-части IPv4 — interface ID, а не subnet ID.

**Explanation in English:** Global routing prefix is the provider allocation; subnet ID selects the organization’s network within it; interface ID identifies the host interface within that subnet. The IPv4 host-portion analogue is interface ID, not subnet ID.

### E767. An IPv6 enabled device sends a data packet with the destination address of FF02::2. What is the target of this packet?

Источник: тесты_exam_7, Q34. Тема: модуль 12.

1. all IPv6 enabled devices across the network
2. all IPv6 enabled devices on the local link
3. all IPv6 DHCP servers
4. all IPv6 configured routers on the local link

**Ответ:** all IPv6 configured routers on the local link.

**Объяснение:** FF02::2 — all-routers multicast только на локальном link (scope 02). FF02::1 адресовал бы всем IPv6-узлам этого link. Ни глобальная рассылка всем сетям, ни выделенная группа DHCP-серверов здесь не указаны.

**Explanation in English:** FF02::2 is all-routers multicast on the local link only (scope 02). FF02::1 would target all IPv6 nodes there. This is neither an all-network group nor the DHCP-server group.

### E782. What is the subnet ID associated with the IPv6 address 2001:DA48:FC5:A4:3D1B::1/64?

Источник: тесты_exam_7, Q49. Тема: модуль 12.

1. 2001::/64
2. 2001:DA48::/64
3. 2001:DA48:FC5:A4::/64
4. 2001:DA48:FC5::A4:/64

> Под subnet ID здесь имеется в виду полный network prefix /64; размер отдельного поля subnet ID без allocation провайдера неизвестен.

**Ответ:** 2001:DA48:FC5:A4::/64.

**Объяснение:** Варианты фактически спрашивают полный /64 network prefix: сохраняем 2001:DA48:FC5:A4 и обнуляем interface ID → 2001:DA48:FC5:A4::/64. Термин subnet ID в вопросе неточен: отдельное поле subnet ID зависит от длины allocation провайдера (при /48 это A4), которая здесь не задана.

**Explanation in English:** The options actually ask for the full /64 network prefix: retain 2001:DA48:FC5:A4 and zero interface ID → 2001:DA48:FC5:A4::/64. “Subnet ID” is imprecise: the separate subnet-ID field depends on provider-allocation length (A4 for /48), which is not specified here.

### E073. Which of the following are protocols that provide feedback from the destination host to the source host regarding errors in packet delivery? (Choose two.)

Источник: модули_03, Q4. Тема: модуль 13.

1. IPv4
2. TCP
3. ICMPv4
4. IPv6
5. UDP
6. ICMPv6

**Ответ:** ICMPv4; ICMPv6.

**Объяснение:** ICMPv4 и ICMPv6 передают уведомления об ошибках обработки IPv4/IPv6-пакетов, например недостижимости назначения. IP переносит пакеты best effort; UDP не сообщает такие сетевые ошибки сам. TCP отвечает за свою надёжную доставку, но не является общим механизмом IP-диагностики. Уведомление может прийти и от промежуточного роутера, не только конечного хоста.

**Explanation in English:** ICMPv4 and ICMPv6 report IPv4/IPv6 packet-processing problems such as unreachable destinations. IP carries packets best effort; UDP does not provide this network-error reporting. TCP handles its own reliable delivery but is not the general IP diagnostic protocol. Reports may come from intermediate routers as well as destination hosts.

### E098. Which two protocols function at the internet layer? (Choose two.)

Источник: модули_03, Q9. Тема: модуль 13.

1. POP
2. BOOTP
3. ICMP
4. IP
5. PPP

**Ответ:** ICMP; IP.

**Объяснение:** IP обеспечивает адресацию и пересылку на internet layer, а ICMP — диагностические сообщения этого уровня. POP и BOOTP относятся к application layer; PPP — канальная инкапсуляция, поэтому эти три варианта не подходят.

**Explanation in English:** IP provides addressing/forwarding at the internet layer and ICMP provides diagnostic messages for that layer. POP and BOOTP are application-layer protocols, while PPP is link-layer encapsulation, so those choices do not fit.

### E328. Which two types of ICMP messages are common to both ICMPv4 and ICMPv6? (Choose two.)

Источник: модули_13, Q1. Тема: модуль 13.

1. Destination or Service Unreachable
2. Hostname resolution
3. IP configuration
4. Source Unreachable
5. Time exceeded

**Ответ:** Destination or Service Unreachable; Time exceeded.

**Объяснение:** Обе версии ICMP имеют Destination Unreachable и Time Exceeded: первая сообщает о невозможной доставке, вторая — например об исчерпании TTL/Hop Limit. Hostname resolution относится к DNS, Source Unreachable не является указанным стандартным типом, а IP configuration не общее название сообщения обеих версий.

**Explanation in English:** Both ICMP versions have Destination Unreachable and Time Exceeded: the former reports delivery failure and the latter includes TTL/Hop Limit expiration. Hostname resolution belongs to DNS; Source Unreachable is not the listed standard type, and IP configuration is not a shared message name.

### E329. Which type of ICMPv6 message would a host send to acquire an IPv6 configuration when booting up?

Источник: модули_13, Q2. Тема: модуль 13.

1. Neighbor Advertisement (NA) message
2. Neighbor Solicitation (NS) message
3. Router Advertisement (RA) message
4. Router Solicitation (RS) message

**Ответ:** Router Solicitation (RS) message.

**Объяснение:** Хост отправляет Router Solicitation, чтобы не ждать очередного Router Advertisement и запросить сведения о роутере/префиксе. RA посылает роутер; NS/NA служат обнаружению соседей, разрешению адресов и DAD, а не запросу сетевых параметров у роутера.

**Explanation in English:** A host sends Router Solicitation to request router/prefix information without waiting for a periodic Router Advertisement. Routers send RA; NS/NA support neighbor discovery, address resolution and DAD rather than requesting router configuration.

### E330. A technician is troubleshooting a network where it is suspected that a defective node in the network path is causing packets to be dropped. The technician only has the IP address of the end point device and does not have any details of the intermediate devices. What command can the technician use to identify the faulty node?

Источник: модули_13, Q1. Тема: модуль 13.

1. tracert
2. ping
3. ipconfig /flushdns
4. ipconfig /displaydns

**Ответ:** tracert.

**Объяснение:** tracert последовательно увеличивает TTL/Hop Limit и показывает отвечающие промежуточные роутеры, поэтому помогает сузить место потерь. ping проверяет конечную достижимость, а команды flushdns/displaydns работают с DNS-кэшем. Трасса даёт подсказку, но один молчащий hop не доказывает его неисправность: ответы могут фильтроваться.

**Explanation in English:** tracert increases TTL/Hop Limit and displays responding intermediate routers, helping narrow down where loss occurs. ping tests endpoint reachability; flushdns/displaydns operate on the DNS cache. A trace is evidence, not proof that a silent hop is broken, because responses may be filtered.

### E331. A user who is unable to connect to the file server contacts the help desk. The helpdesk technician asks the user to ping the IP address of the default gateway that is configured on the workstation. What is the purpose for this ping command?

Источник: модули_13, Q2. Тема: модуль 13.

1. To obtain a dynamic IP address from the server
2. To request that gateway forward the connection request to the file server
3. To test that the host has the capability to reach hosts on other networks
4. To resolve the domain name of the file server to its IP address

> Ответ в курсе; см. уточнение ниже

**Ответ:** Достижимость интерфейса default gateway; доступ к удалённым сетям ещё не доказан.

**Объяснение:** Ping шлюза проверяет доступность локального интерфейса роутера, не путь до файлового сервера или всех удалённых сетей. Он не получает DHCP-адрес, не разрешает DNS-имя и не просит шлюз устанавливать файловое соединение. Вариант про достижение других сетей преувеличивает результат; полностью точного ответа среди опций нет, поэтому карточка исключена из автоматического квиза.

**Explanation in English:** Pinging the gateway tests reachability of the router’s local interface, not the file server or all remote networks. It does not obtain DHCP addressing, resolve DNS or ask the gateway to establish a file connection. The remote-networks option overstates the result; no option is fully accurate, so the card is excluded from the automatic quiz.

### E332. What is a function of the tracert command that differs from the ping command when they are used on a workstation?

Источник: модули_13, Q3. Тема: модуль 13.

1. The tracert command reaches the destination faster.
2. The tracert command shows the information of routers in the path.
3. The tracert command sends one ICMP message to each hop in the path.
4. The tracert command is used to test the connectivity between two devices.

**Ответ:** The tracert command shows the information of routers in the path..

**Объяснение:** Отличие tracert — показ промежуточных hops и времени ответа каждого. ping даёт ответ целевого устройства без списка роутеров. tracert не обязан быть быстрее и обычно посылает несколько проб на один hop, поэтому варианты «быстрее» и «один ICMP» неверны.

**Explanation in English:** tracert differs by showing intermediate hops and their response times. ping reports the target response without listing routers. tracert need not be faster and usually sends multiple probes per hop, so the faster/one-ICMP claims are wrong.

### E333. Which ICMP message is used by the traceroute utility during the process of finding the path between two end hosts?

Источник: модули_13, Q4. Тема: модуль 13.

1. Redirect
2. Ping
3. Time exceeded
4. Destination unreachable

**Ответ:** Time exceeded.

**Объяснение:** Проба с TTL 1 истекает на первом роутере, который возвращает Time Exceeded; TTL 2 выявляет следующий и так далее. Redirect предлагает другой маршрут, а Ping — название утилиты, не нужного сообщения. На конце трассы может прийти Echo Reply или Port Unreachable в зависимости от вида проб, но промежуточные hops обнаруживаются по Time Exceeded.

**Explanation in English:** A TTL-1 probe expires at the first router, which returns Time Exceeded; TTL 2 reveals the next router, and so on. Redirect suggests another route and Ping is a utility name, not this message. The endpoint may return Echo Reply or Port Unreachable depending on probe type, but intermediate hops are discovered through Time Exceeded.

### E334. Which utility uses the Internet Control Messaging Protocol (ICMP)?

Источник: модули_13, Q5. Тема: модуль 13.

1. RIP
2. DNS
3. Ping
4. NTP

**Ответ:** Ping.

**Объяснение:** Ping использует ICMP Echo Request/Echo Reply для проверки достижимости. RIP обменивается маршрутами, DNS разрешает имена, NTP синхронизирует часы; они не являются утилитой ICMP Echo из вопроса.

**Explanation in English:** Ping uses ICMP Echo Request/Echo Reply for reachability testing. RIP exchanges routes, DNS resolves names and NTP synchronizes clocks; none is the ICMP Echo utility asked about.

### E335. Which protocol is used by IPv4 and IPv6 to provide error messaging?

Источник: модули_13, Q6. Тема: модуль 13.

1. ICMP
2. NDP
3. ARP
4. DHCP

**Ответ:** ICMP.

**Объяснение:** Общее имя ICMP охватывает ICMPv4 и ICMPv6, которые сообщают об IP-ошибках. ARP находит MAC по IPv4; DHCP выдаёт настройки; NDP — набор функций IPv6 Neighbor Discovery поверх ICMPv6, а не общий механизм ошибок для IPv4 и IPv6.

**Explanation in English:** ICMP covers ICMPv4 and ICMPv6 error reporting. ARP resolves IPv4 to MAC, DHCP supplies configuration, and NDP is IPv6 Neighbor Discovery carried by ICMPv6 rather than the general error protocol for both IP versions.

### E336. A network administrator is testing network connectivity by issuing the ping command on a router. Which symbol will be displayed to indicate that a time expired during the wait for an ICMP echo reply message?

Источник: модули_13, Q7. Тема: модуль 13.

1. !
2. .
3. U
4. $

**Ответ:** ..

**Объяснение:** Точка (.) в IOS ping означает, что Echo Reply не получен до истечения таймера. ! означает успешный ответ, U — полученное сообщение unreachable. Таймаут не объясняет причину: пакет или ответ могли потеряться либо быть отфильтрованы.

**Explanation in English:** A dot (.) in IOS ping means no Echo Reply arrived before the timer expired. ! means a successful reply and U means an unreachable message was received. Timeout alone does not identify the cause; the request/reply may have been lost or filtered.

### E337. Which two things can be determined by using the ping command? (Choose two.)

Источник: модули_13, Q8. Тема: модуль 13.

1. The number of routers between the source and destination device
2. The IP address of the router nearest the destination device
3. The average time it takes a packet to reach the destination and for the response to return to the source
4. The destination device is reachable through the network
5. The average time it takes each router in the path between source and destination to respond

**Ответ:** The average time it takes a packet to reach the destination and for the response to return to the source; The destination device is reachable through the network.

**Объяснение:** Успешный ping подтверждает достижимость целевого IP для Echo и измеряет RTT — время запроса туда плюс ответа обратно. Он не показывает число промежуточных роутеров, ближайший к назначению роутер или время каждого hop; для этого нужна трассировка.

**Explanation in English:** Successful ping demonstrates target reachability for Echo and measures RTT: request travel plus return reply time. It does not list router count, the nearest router to the destination or each hop’s delay; those require tracing.

### E338. A user calls to report that a PC cannot access the internet. The network technician asks the user to issue the command ping 127.0.0.1 in a command prompt window. The user reports that the result is four positive replies. What conclusion can be drawn based on this connectivity test?

Источник: модули_13, Q9. Тема: модуль 13.

1. The PC can access the network. The problem exists beyond the local network.
2. The IP address obtained from the DHCP server is correct.
3. The PC can access the Internet. However, the web browser may not work.
4. The TCP/IP implementation is functional.

**Ответ:** The TCP/IP implementation is functional..

**Объяснение:** 127.0.0.1 — loopback собственного компьютера: ответы подтверждают работающий локальный IP-стек без выхода на кабель. Они не проверяют DHCP-адрес, NIC/канал, gateway или Интернет, поэтому заключения о внешней сети из этого теста не следуют.

**Explanation in English:** 127.0.0.1 is the local loopback: replies confirm a working local IP stack without traffic leaving on the cable. They do not test the DHCP address, NIC/link, gateway or Internet, so no external-connectivity conclusion follows.

### E339. Which command can be used to test connectivity between two devices using echo request and echo reply messages?

Источник: модули_13, Q10. Тема: модуль 13.

1. netstat
2. ipconfig
3. ICMP
4. ping

**Ответ:** ping.

**Объяснение:** Команда ping отправляет Echo Request и ожидает Echo Reply. ICMP — протокол этих сообщений, но не название команды в данном списке; netstat показывает соединения/маршруты, ipconfig — конфигурацию IP.

**Explanation in English:** ping sends Echo Request and waits for Echo Reply. ICMP is the underlying protocol, not the command name in this list; netstat shows connections/routes and ipconfig shows IP configuration.

### E340. What field content is used by ICMPv6 to determine that a packet has expired?

Источник: модули_13, Q11. Тема: модуль 13.

1. TTL field
2. CRC field
3. Hop Limit field
4. Time Exceeded field

**Ответ:** Hop Limit field.

**Объяснение:** В IPv6 лимит переходов находится в Hop Limit; роутер уменьшает его при пересылке, и ноль вызывает отбрасывание с Time Exceeded. TTL — название поля IPv4, CRC проверяет повреждение данных, а Time Exceeded — сообщение, не поле исходного пакета.

**Explanation in English:** IPv6 stores the hop budget in Hop Limit; routers decrement it while forwarding, and zero causes discard with Time Exceeded. TTL is the IPv4 field name, CRC checks corruption, and Time Exceeded is a message rather than a field in the original packet.

### E341. Which protocol provides feedback from the destination host to the source host about errors in packet delivery?

Источник: модули_13, Q12. Тема: модуль 13.

1. ARP
2. BOOTP
3. DNS
4. ICMP

**Ответ:** ICMP.

**Объяснение:** ICMP сообщает источнику об ошибках обработки IP, например Destination Unreachable. ARP разрешает локальный MAC, BOOTP выдаёт загрузочные параметры, DNS переводит имена в адреса. Они не выполняют запрошенную функцию обратной связи об IP-доставке.

**Explanation in English:** ICMP reports IP-processing problems to the sender, for example Destination Unreachable. ARP resolves local MAC addresses, BOOTP supplies boot configuration and DNS resolves names. None performs the requested IP-delivery error feedback.

### E342. A network administrator can successfully ping the server at , but cannot ping the company web server located at an ISP in another city. Which tool or command would help identify the specific router where the packet was lost or delayed?

Источник: модули_13, Q13. Тема: модуль 13.

1. ipconfig
2. netstat
3. telnet
4. traceroute

**Ответ:** traceroute.

**Объяснение:** traceroute показывает отвечающие промежуточные роутеры и RTT, позволяя искать участок между доступной локальной сетью и удалённым сервером. ipconfig показывает настройки хоста, netstat — соединения, telnet устанавливает сеанс. Звёздочка или медленный ответ hop могут быть фильтрацией/ограничением ICMP, поэтому трасса не доказывает конкретную поломку автоматически.

**Explanation in English:** traceroute displays responding routers and RTTs, helping locate a suspect segment toward the remote server. ipconfig shows host settings, netstat connections, and telnet opens a session. A silent or slow hop may reflect ICMP filtering/rate limiting, so tracing does not automatically prove a specific fault.

### E343. What message is sent by a host to check the uniqueness of an IPv6 address before using that address?

Источник: модули_13, Q14. Тема: модуль 13.

1. Neighbor solicitation
2. ARP request
3. Echo request
4. Router solicitation

**Ответ:** Neighbor solicitation.

**Объяснение:** Для Duplicate Address Detection узел посылает Neighbor Solicitation с проверяемым IPv6 target address до обычного использования адреса. Ответ/обнаруженный конфликт означает, что адрес уже занят. ARP в IPv6 не используется; Echo проверяет достижимость, RS запрашивает роутерские объявления.

**Explanation in English:** Duplicate Address Detection sends Neighbor Solicitation targeting the tentative IPv6 address before normal use. A response/conflict indicates the address is already used. IPv6 does not use ARP; Echo tests reachability and RS requests router advertisements.

### E467. A network technician is investigating network connectivity from a PC to a remote host with the address 10.1.1.5. Which command, when issued on a Windows PC, will display the path to the remote host?

Источник: модули_17, Q4. Тема: модуль 13.

1. trace 10.1.1.5
2. traceroute 10.1.1.5
3. tracert 10.1.1.5
4. ping 10.1.1.5

**Ответ:** tracert 10.1.1.5.

**Объяснение:** В Windows утилита называется tracert: tracert 10.1.1.5 покажет отвечающие hops до этого IP. traceroute — имя на многих других ОС, trace не нужная команда, ping проверяет цель без списка промежуточных устройств.

**Explanation in English:** Windows calls the utility tracert: tracert 10.1.1.5 lists responding hops toward that IP. traceroute is the name on many other systems, trace is not the requested command, and ping tests the target without listing intermediate devices.

### E468. A user is unable to reach the website when typing http://www.cisco.com in a web browser, but can reach the same site by typing http://72.163.4.161 . What is the issue?

Источник: модули_17, Q5. Тема: модуль 13.

1. Default gateway
2. DHCP
3. DNS
4. TCP/IP protocol stack

**Ответ:** DNS.

**Объяснение:** В учебном сценарии доступ по IP работает, а по имени нет: это указывает на проблему name resolution, то есть DNS. Прямой IP не требует DNS, но всё ещё использует сетевой стек и маршрут через шлюз. Это диагностический признак: реальные сайты с виртуальным хостингом/TLS могут вести себя по прямому IP иначе, поэтому применяй вывод к условиям задачи.

**Explanation in English:** In this exercise, IP access works while name-based access fails, pointing to DNS name resolution. Direct IP access bypasses DNS but still needs the network stack and route. This is a diagnostic clue under the stated conditions; real virtual-hosted/TLS websites can behave differently when accessed by bare IP.

### E502. What is the purpose of ICMP messages?

Источник: тесты_IP_Addressing, Q24. Тема: модуль 13.

1. to inform routers about network topology changes
2. to ensure the delivery of an IP packet
3. to provide feedback of IP packet transmissions
4. to monitor the process of a domain name to IP address resolution

**Ответ:** to provide feedback of IP packet transmissions.

**Объяснение:** ICMP предоставляет обратную связь об обработке IP-пакетов — ошибки и диагностические ответы. Сообщение об ошибке само не повторяет пакет и не гарантирует доставку. Обмен топологией выполняют routing protocols; разрешение доменного имени — DNS.

**Explanation in English:** ICMP provides feedback about IP-packet processing through error and diagnostic messages. Reporting a failure does not itself retransmit the packet or guarantee delivery. Routing protocols exchange topology; DNS resolves domain names.

### E503. A user executes a traceroute over IPv6. At what point would a router in the path to the destination device drop the packet?

Источник: тесты_IP_Addressing, Q25. Тема: модуль 13.

1. when the value of the Hop Limit field reaches 255
2. when the value of the Hop Limit field reaches zero
3. when the router receives an ICMP time exceeded message
4. when the target host responds with an ICMP echo reply message

**Ответ:** when the value of the Hop Limit field reaches zero.

**Объяснение:** Роутер уменьшает Hop Limit при пересылке; когда значение исчерпывается до нуля, пакет отбрасывается и обычно возвращается ICMPv6 Time Exceeded. 255 — возможное начальное значение, не условие истечения. Echo Reply означает достижение цели; получение роутером Time Exceeded не является причиной истечения этой пробы.

**Explanation in English:** A router decrements Hop Limit while forwarding; when it expires at zero, the packet is discarded and normally triggers ICMPv6 Time Exceeded. 255 can be an initial value, not expiration. Echo Reply signals reaching the destination, and receiving a Time Exceeded message is not what expires this probe.

### E504. Refer to the exhibit. An administrator is trying to troubleshoot connectivity between PC1 and PC2 and uses the tracert command from PC1 to do it. Based on the displayed output, where should the administrator begin troubleshooting?

Источник: тесты_IP_Addressing, Q26. Тема: модуль 13.

1. PC2
2. R1
3. SW2
4. R2
5. SW1

> Ответ для показанного варианта (нужна схема/PT для полной проверки)

**Ответ:** R1.

**Объяснение:** Сохранённый ответ R1 зависит от строк отсутствующей трассировки. Обычно начинают с границы между последним отвечающим hop и следующим участком, одновременно проверяя фильтрацию и обратный маршрут. Без exhibit нельзя определить, почему нужно начать именно с R1, а не R2/ПК/коммутатора; карточка не используется в автоматическом квизе.

**Explanation in English:** The saved R1 answer depends on the missing trace output. Normally investigate around the last responding hop and the next segment while checking filtering and the return route. Without the exhibit, choosing R1 over R2/PC/switch is unverified; the card is excluded from the automatic quiz.

### E511. A user issues a ping 10.10.14.67 command and receives a response that includes a code of 0. What does this code represent?

Источник: тесты_IP_Addressing, Q33. Тема: модуль 13.

1. network unreachable
2. protocol unreachable
3. port unreachable
4. host unreachable

> Ответ в курсе; см. уточнение ниже

**Ответ:** network unreachable.

**Объяснение:** Если речь именно об ICMPv4 Destination Unreachable (type 3), code 0 означает network unreachable; code 1 — host, 2 — protocol, 3 — port unreachable. Но у Echo Reply type 0/code 0 значение другое. В вопросе не указан type, поэтому однозначного вывода из «code 0» нет и карточка исключена.

**Explanation in English:** For ICMPv4 Destination Unreachable (type 3), code 0 means network unreachable; codes 1, 2 and 3 mean host, protocol and port unreachable. However, Echo Reply type 0/code 0 means something else. The question omits type, so “code 0” is ambiguous and the card is excluded.

### E655. Refer to the exhibit. Host H3 is having trouble communicating with host H1. The network administrator suspects a problem exists with the H3 workstation and wants to prove that there is no problem with the R2 configuration. What tool could the network administrator use on router R2 to prove that communication exists to host H1 from the interface on R2, which is the interface that H3 uses when communicating with remote networks?

Источник: тесты_exam_5, Q12. Тема: модуль 13.

1. traceroute
2. show cdp neighbors
3. telnet
4. an extended ping

> Ответ для показанного варианта (нужна схема/PT для полной проверки)

**Ответ:** an extended ping.

**Объяснение:** Extended ping позволяет вручную указать source IP/interface на R2 и проверить связь с H1 именно от интерфейса, который служит шлюзом H3. Обычный ping часто берёт адрес выходного интерфейса; CDP показывает соседей, а telnet/traceroute решают другие задачи. Отдельно привязку имен к портам нужно подтвердить отсутствующей схемой.

**Explanation in English:** Extended ping lets the administrator choose R2’s source IP/interface and test H1 specifically from H3’s gateway-facing interface. Ordinary ping often uses the outgoing-interface address; CDP lists neighbors and telnet/traceroute serve other purposes. The particular device-to-interface mapping still depends on the missing diagram.

### E656. Why would a network administrator use the tracert utility?

Источник: тесты_exam_5, Q13. Тема: модуль 13.

1. to determine the active TCP connections on a PC
2. to check information about a DNS name in the DNS server
3. to identify where a packet was lost or delayed on a network
4. to display the IP address, default gateway, and DNS server address for a PC

**Ответ:** to identify where a packet was lost or delayed on a network.

**Объяснение:** tracert показывает hops и задержки ответов, поэтому помогает локализовать участок потерь/задержки. Активные TCP-соединения показывает netstat, DNS-записи — nslookup, настройки ПК — ipconfig. Молчащий hop может лишь не отвечать на пробы, поэтому результат требует дальнейшей проверки.

**Explanation in English:** tracert shows hops and response delays, helping localize a segment with loss/delay. netstat shows active TCP connections, nslookup DNS records, and ipconfig PC settings. A silent hop may simply not answer probes, so the result needs interpretation.

### E657. Which method is used to send a ping message specifying the source address for the ping?

Источник: тесты_exam_5, Q14. Тема: модуль 13.

1. Issue the ping command from within interface configuration mode.
2. Issue the ping command without specifying a destination IP address.
3. Issue the ping command without extended commands.
4. Issue the ping command after shutting down un-needed interfaces.

**Ответ:** Issue the ping command without specifying a destination IP address..

**Объяснение:** В классическом IOS введи ping без IP в privileged EXEC: откроется диалог, где выбираются Extended commands и Source address/interface. Изменять shutdown на ненужных портах не нужно; interface configuration не является способом выбора источника этой интерактивной команды.

**Explanation in English:** In classic IOS, entering ping without an IP at privileged EXEC opens a dialog where Extended commands and Source address/interface can be selected. Shutting down unused interfaces is unnecessary; entering interface configuration is not the source-selection mechanism of this interactive command.

### E664. A network engineer is analyzing reports from a recently performed network baseline. Which situation would depict a possible latency issue?

Источник: тесты_exam_5, Q21. Тема: модуль 13.

1. a change in the bandwidth according to the show interfaces output
2. a next-hop timeout from a traceroute
3. an increase in host-to-host ping response times
4. a change in the amount of RAM according to the show version output

**Ответ:** an increase in host-to-host ping response times.

**Объяснение:** Рост host-to-host ping RTT относительно baseline прямо указывает на возможное увеличение задержки пути туда и обратно. Изменение RAM не измеряет задержку; изменение bandwidth — другая характеристика; timeout отдельного hop может быть фильтрацией. RTT не показывает, на каком именно участке возникла задержка.

**Explanation in English:** An increase in host-to-host ping RTT compared with the baseline directly suggests greater round-trip delay. RAM is not a latency measurement, bandwidth is a different property, and a single-hop timeout may reflect filtering. RTT does not identify the exact delayed segment.

### E667. Which statement is true about Cisco IOS ping indicators?

Источник: тесты_exam_5, Q24. Тема: модуль 13.

1. '!' indicates that the ping was unsuccessful and that the device may have issues finding a DNS server.
2. 'U' may indicate that a router along the path did not contain a route to the destination address and that the ping was unsuccessful.
3. '.' indicates that the ping was successful but the response time was longer than normal.
4. A combination of '.' and '!' indicates that a router along the path did not have a route to the destination address and responded with an ICMP unreachable message.

**Ответ:** 'U' may indicate that a router along the path did not contain a route to the destination address and that the ping was unsuccessful..

**Объяснение:** U означает полученное ICMP unreachable; одна возможная причина — отсутствие маршрута у роутера, поэтому формулировка «may indicate» верна. ! — успешный Echo Reply, . — таймаут. Смесь . и ! означает часть потерянных/неполученных вовремя ответов, а не обязательно unreachable.

**Explanation in English:** U means an ICMP unreachable was received; a router missing a route is one possible cause, so “may indicate” is accurate. ! is successful Echo Reply and . is timeout. A mixture of . and ! means some replies were absent/late, not necessarily unreachable messages.

### E668. A network technician issues the C:> tracert -6 www.cisco.com command on a Windows PC. What is the purpose of the -6 command option?

Источник: тесты_exam_5, Q25. Тема: модуль 13.

1. It forces the trace to use IPv6.
2. It limits the trace to only 6 hops.
3. It sets a 6 milliseconds timeout for each replay.
4. It sends 6 probes within each TTL time period.

**Ответ:** It forces the trace to use IPv6..

**Объяснение:** Ключ -6 выбирает IPv6 для разрешения имени и трассировки. Цифра относится к версии IP, не к количеству hops, проб или миллисекунд. Для ограничения длины трассы/таймера используются другие параметры.

**Explanation in English:** The -6 option selects IPv6 for name resolution and tracing. The digit identifies the IP version, not the hop count, number of probes or milliseconds. Other options control hop and timeout limits.

### E669. A user reports a lack of network connectivity. The technician takes control of the user machine and attempts to ping other computers on the network and these pings fail. The technician pings the default gateway and that also fails. What can be determined for sure by the results of these tests?

Источник: тесты_exam_5, Q26. Тема: модуль 13.

1. The NIC in the PC is bad.
2. The TCP/IP protocol is not enabled.
3. The router that is attached to the same network as the workstation is down.
4. Nothing can be determined for sure at this point.

**Ответ:** Nothing can be determined for sure at this point..

**Объяснение:** Эти неудачные ping подтверждают отсутствие ожидаемых Echo Reply, но не единственную причину. Возможны неверные настройки, фильтрация, неисправность кабеля/порта/NIC или недоступный роутер. Поэтому нельзя наверняка объявить неисправной NIC, отключённым TCP/IP или выключенным роутер; нужны дополнительные тесты.

**Explanation in English:** The failed pings confirm missing expected Echo Replies, not a unique cause. Bad settings, filtering, a cable/port/NIC fault or an unavailable router are possible. Thus the NIC, TCP/IP or router cannot be singled out with certainty; further tests are required.

### E673. Which statement describes the ping and tracert commands?

Источник: тесты_exam_5, Q30. Тема: модуль 13.

1. Tracert shows each hop, while ping shows a destination reply only.
2. Tracert uses IP addresses; ping does not.
3. Both ping and tracert can show results in a graphical display.
4. Ping shows whether the transmission is successful; tracert does not.

**Ответ:** Tracert shows each hop, while ping shows a destination reply only..

**Объяснение:** tracert пытается показать промежуточные hops, ping — достижимость и ответ целевого IP. Оба работают с IP, даже если вводится доменное имя. Видимость каждого hop не гарантирована из-за фильтрации, но именно обнаружение промежуточного пути отличает трассировку.

**Explanation in English:** tracert attempts to show intermediate hops, while ping reports target reachability/replies. Both use IP even when given a domain name. Filtering can hide hops, but discovery of the intermediate path is the distinguishing feature of tracing.

### E682. What is a user trying to determine when issuing a ping 10.1.1.1 command on a PC?

Источник: тесты_exam_6, Q4. Тема: модуль 13.

1. if the TCP/IP stack is functioning on the PC without putting traffic on the wire
2. if there is connectivity with the destination device
3. the path that traffic will take to reach the destination
4. what type of device is at the destination

**Ответ:** if there is connectivity with the destination device.

**Объяснение:** ping 10.1.1.1 проверяет, возвращает ли этот адрес ICMP Echo Reply, то есть достижимость назначения. Для чисто локального стека используют loopback 127.0.0.1; путь показывает tracert; тип устройства ping не определяет.

**Explanation in English:** ping 10.1.1.1 checks whether that address returns ICMP Echo Reply, testing destination reachability. Local-only stack testing uses loopback 127.0.0.1; tracert shows the path; ping does not identify the device type.

### E714. A network technician types the command ping 127.0.0.1 at the command prompt on a computer. What is the technician trying to accomplish?

Источник: тесты_exam_6, Q36. Тема: модуль 13.

1. checking the IP address on the network card
2. testing the integrity of the TCP/IP stack on the local machine
3. pinging a host computer that has the IP address 127.0.0.1 on the network
4. tracing the path to a host computer on the network and the network has the IP address 127.0.0.1

**Ответ:** testing the integrity of the TCP/IP stack on the local machine.

**Объяснение:** 127.0.0.1 зарезервирован для loopback: пакет остаётся внутри собственного хоста и проверяет локальный IP-стек. Это не адрес удалённого компьютера, не проверка назначенного NIC адреса и не трассировка внешнего пути.

**Explanation in English:** 127.0.0.1 is loopback: the packet stays inside the host and tests its local IP stack. It is not a remote computer’s address, a check of the NIC’s configured IP or a trace of an external path.

### E715. Which two ICMP messages are used by both IPv4 and IPv6 protocols? (Choose two.)

Источник: тесты_exam_6, Q37. Тема: модуль 13.

1. router solicitation
2. route redirection
3. neighbor solicitation
4. protocol unreachable
5. router advertisement

> Choose two неоднозначно: IPv4 RS/RA определены RFC 1256; ICMPv6 unknown Next Header — Parameter Problem (RFC 4443).

**Ответ:** Нет единственной пары: Redirect, RS и RA существуют в IPv4 и IPv6; карточка исключена.

**Объяснение:** Задание «выберите два» неоднозначно. Redirect существует в обеих версиях; Router Solicitation/Advertisement также определены для IPv4 Router Discovery (RFC 1256) и для IPv6 ND, то есть технически подходят больше двух вариантов. IPv6 неизвестный Next Header сообщает как Parameter Problem, а не отдельный Protocol Unreachable. Поэтому не заучивай спорную пару: карточка исключена. Источники: RFC 1256 и RFC 4443.

**Explanation in English:** “Choose two” is ambiguous here. Redirect exists in both versions; Router Solicitation/Advertisement are also defined for IPv4 Router Discovery (RFC 1256) and IPv6 ND, giving more than two technically valid options. IPv6 reports an unknown Next Header through Parameter Problem, not a separate Protocol Unreachable message. Do not memorize a disputed pair; the card is excluded. Sources: RFC 1256 and RFC 4443.

### E716. Network information: * local router LAN interface: 172.19.29.254 / fe80:65ab:dcc1::10 * local router WAN interface: 198.133.219.33 / 2001:db8:FACE:39::10 * remote server: 192.135.250.103 What task might a user be trying to accomplish by using the ping 2001:db8:FACE:39::10 command?

Источник: тесты_exam_6, Q38. Тема: модуль 13.

1. verifying that there is connectivity to the internet
2. verifying that there is connectivity within the local network
3. creating a network performance benchmark to a server on the company intranet
4. determining the path to reach the remote server

> Ответ в курсе; см. уточнение ниже

**Ответ:** Проверка достижимости указанного WAN-интерфейса локального маршрутизатора.

**Объяснение:** Адрес 2001:db8:FACE:39::10 дан как WAN-интерфейс локального роутера. Ping проверяет достижимость именно этого интерфейса, а не удалённого сервера и не всего Интернета; путь он тоже не показывает. Предложенные варианты не формулируют это точно, поэтому карточка исключена из автоматической оценки.

**Explanation in English:** 2001:db8:FACE:39::10 is specified as the local router’s WAN interface. Ping tests that interface’s reachability, not the remote server or the entire Internet, and it does not show the path. None of the offered choices states this accurately, so the card is excluded from automatic grading.

### E728. Which two commands could be used to check if DNS name resolution is working properly on a Windows PC? (Choose two.)

Источник: тесты_exam_6, Q50. Тема: модуль 13.

1. nslookup cisco.com
2. net cisco.com
3. ping cisco.com
4. nbtstat cisco.com
5. ipconfig /flushdns

**Ответ:** nslookup cisco.com; ping cisco.com.

**Объяснение:** nslookup cisco.com напрямую запрашивает DNS. ping cisco.com сначала должен разрешить имя: отображение IP подтверждает успешное разрешение, даже если Echo Reply затем блокируется. ipconfig /flushdns лишь очищает кэш, net и nbtstat не являются этими двумя DNS-проверками.

**Explanation in English:** nslookup cisco.com directly queries DNS. ping cisco.com must first resolve the name; displaying its IP demonstrates resolution even if Echo Reply is later blocked. ipconfig /flushdns only clears the cache, and net/nbtstat are not these two DNS tests.

### E758. A group of Windows PCs in a new subnet has been added to an Ethernet network. When testing the connectivity, a technician finds that these PCs can access local network resources but not the Internet resources. To troubleshoot the problem, the technician wants to initially confirm the IP address and DNS configurations on the PCs, and also verify connectivity to the local router. Which three Windows CLI commands and utilities will provide the necessary information? (Choose three.)

Источник: тесты_exam_7, Q25. Тема: модуль 13.

1. arp -a
2. ipconfig
3. nslookup
4. ping
5. telnet
6. tracert
7. netsh interface ipv6 show neighbor

**Ответ:** ipconfig; nslookup; ping.

**Объяснение:** ipconfig показывает IP/mask/gateway и с /all DNS-настройки; nslookup проверяет DNS-запрос; ping адреса локального роутера проверяет связь с ним. arp -a показывает кэш соседей, tracert — hops, telnet — сеанс: они не заменяют требуемую комбинацию конфигурации, DNS и reachability.

**Explanation in English:** ipconfig shows IP/mask/gateway and, with /all, DNS settings; nslookup tests DNS queries; ping to the local router tests reachability. arp -a shows neighbors, tracert shows hops and telnet opens a session; they do not replace the requested combination of configuration, DNS and reachability checks.

### E763. What is the consequence of configuring a router with the ipv6 unicast-routing global configuration command?

Источник: тесты_exam_7, Q30. Тема: модуль 13.

1. All router interfaces will be automatically activated.
2. It statically creates a global unicast address on this router.
3. The IPv6 enabled router interfaces begin sending ICMPv6 Router Advertisement messages.
4. Each router interface will generate an IPv6 link-local address.

**Ответ:** The IPv6 enabled router interfaces begin sending ICMPv6 Router Advertisement messages..

**Объяснение:** ipv6 unicast-routing включает работу устройства как IPv6-роутера; на активных IPv6-интерфейсах обычно начинается отправка RA, если она не подавлена отдельно. Команда не выполняет no shutdown за все интерфейсы и не назначает им глобальные IPv6-адреса. Link-local создаётся при включении IPv6 на интерфейсе, а не этой глобальной командой как таковой.

**Explanation in English:** ipv6 unicast-routing enables IPv6 router operation; active IPv6-enabled interfaces normally begin sending RA unless separately suppressed. It does not execute no shutdown on every port or assign global IPv6 addresses. Link-local creation follows enabling IPv6 on an interface, not this global command by itself.

### E068. What is the purpose of the sequencing function in network communication?

Источник: модули_03, Q3. Тема: модуль 14.

1. To uniquely label transmitted segments of data for proper reassembly by the receiver
2. To determine if data is corrupted during transmission
3. To ensure data flows at an efficient rate between sender and receiver
4. To guarantee delivery of data

**Ответ:** To uniquely label transmitted segments of data for proper reassembly by the receiver.

**Объяснение:** Sequencing помечает позиции данных, чтобы получатель восстановил исходный порядок; у TCP номера относятся к байтам. Checksum выявляет повреждения, window регулирует поток. Одна нумерация не гарантирует доставку: нужны ACK, таймеры и retransmission.

**Explanation in English:** Sequencing identifies data positions so the receiver can restore order; TCP numbers bytes. Checksums detect corruption and windows regulate flow. Numbering alone does not guarantee delivery—ACKs, timers and retransmission are also needed.

### E069. This protocol is responsible for guaranteeing the reliable delivery of information.

Источник: модули_03, Q4. Тема: модуль 14.

1. TCP
2. IP
3. HTTP
4. Ethernet

**Ответ:** TCP.

**Объяснение:** TCP обеспечивает надёжный упорядоченный байтовый поток с ACK и повторной передачей потерь. IP и Ethernet сами не дают такой end-to-end услуги, а HTTP использует транспорт. «Гарантия» не означает успех при вечном разрыве: TCP в таком случае сообщает ошибку.

**Explanation in English:** TCP provides a reliable ordered byte stream using acknowledgments and retransmissions. IP and Ethernet alone do not provide that end-to-end service; HTTP uses a transport. “Guarantee” does not mean success through a permanent outage—TCP eventually reports failure.

### E070. UDP and TCP belong to which layer of the TCP/IP protocol?

Источник: модули_03, Q1. Тема: модуль 14.

1. Application
2. Transport
3. Internet
4. Network access

**Ответ:** Transport.

**Объяснение:** TCP и UDP обслуживают обмен между приложениями, используют номера портов и относятся к transport layer TCP/IP. Internet layer маршрутизирует IP-пакеты, network access обслуживает кадры/среду, application — прикладные протоколы.

**Explanation in English:** TCP and UDP serve application-to-application communication using ports and belong to the TCP/IP transport layer. Internet routes IP packets, network access handles frames/media and application provides application protocols.

### E075. Which services are provided by the internet layer of the TCP/IP protocol suite? (Choose three.)

Источник: модули_03, Q6. Тема: модуль 14.

1. File Transfer
2. Address Resolution
3. Routing Protocols
4. Messaging
5. Ethernet
6. Internet Protocol

**Ответ:** Routing Protocols; Messaging; Internet Protocol.

**Объяснение:** Internet layer включает IP, маршрутизацию и диагностические сообщения ICMP, поэтому выбираются Internet Protocol, Routing Protocols и Messaging. File Transfer — application, Ethernet — network access. ARP address resolution в модели курса относится к network access.

**Explanation in English:** The Internet layer includes IP, routing and ICMP diagnostic messaging, so Internet Protocol, Routing Protocols and Messaging are selected. File Transfer is application; Ethernet is network access. The course places ARP address resolution in network access.

### E080. What is the process of dividing a large data stream into smaller pieces prior to transmission?

Источник: модули_03, Q1. Тема: модуль 14.

1. Sequencing
2. Duplexing
3. Multiplexing
4. Segmentation

**Ответ:** Segmentation.

**Объяснение:** Segmentation делит поток данных на меньшие транспортные единицы. Sequencing задаёт их позиции, multiplexing перемежает несколько разговоров, duplexing описывает направления передачи. Эти операции связаны, но именно деление называется segmentation.

**Explanation in English:** Segmentation divides a data stream into smaller transport units. Sequencing identifies their positions, multiplexing interleaves conversations and duplexing describes transmission directions. The splitting operation specifically is segmentation.

### E081. What is the PDU associated with the transport layer?

Источник: модули_03, Q2. Тема: модуль 14.

1. Segment
2. Packet
3. Bits
4. Frame

**Ответ:** Segment.

**Объяснение:** Для транспортного уровня курс использует PDU segment (особенно TCP); UDP обычно называет свою единицу datagram. Packet — L 3, frame — L 2, bits — L 1. Поэтому среди данных вариантов правильный Segment.

**Explanation in English:** The course names the transport PDU a segment, particularly for TCP; UDP commonly calls its unit a datagram. Packet is Layer 3, frame Layer 2 and bits Layer 1. Therefore Segment is the correct offered choice.

### E099. Which layer of the OSI model defines services to segment and reassemble data for individual communications between end devices?

Источник: модули_03, Q10. Тема: модуль 14.

1. Application
2. Presentation
3. Session
4. Transport
5. Network

**Ответ:** Transport.

**Объяснение:** Transport layer разделяет данные каждого разговора и при необходимости собирает/упорядочивает их у получателя. Network выбирает маршруты пакетов, session управляет диалогами на своём уровне, presentation — представлением. Здесь ключевые слова segment/reassemble указывают на transport.

**Explanation in English:** The transport layer segments each conversation and, when provided by the protocol, reassembles/orders it at the receiver. Network selects packet routes, session manages dialogs and presentation handles representation. Segment/reassemble identifies transport here.

### E344. Which layer is responsible for establishing a temporary communication session between the source and destination host applications?

Источник: модули_14, Q1. Тема: модуль 14.

1. Application layer
2. Data link layer
3. Network layer
4. Physical layer
5. Transport layer

**Ответ:** Transport layer.

**Объяснение:** В контексте TCP/IP разговор между source/destination applications отслеживает transport layer с портами; TCP также устанавливает соединение. Network связывает хосты, data link соседей на канале, physical сигналы. Слово session здесь не означает отдельный OSI Session layer, которого нет среди вариантов.

**Explanation in English:** In this TCP/IP context, transport tracks source/destination application conversations using ports; TCP also establishes a connection. Network connects hosts, data link link-neighbors and physical signals. “Session” here does not mean the separate OSI Session layer, which is not offered.

### E345. Which three are transport layer responsibilities? (Choose three.)

Источник: модули_14, Q2. Тема: модуль 14.

1. Conversation multiplexing
2. Identifying frames
3. Identifying routing information
4. Segmenting data and reassembling segments
5. Tracking individual conversations

**Ответ:** Conversation multiplexing; Segmenting data and reassembling segments; Tracking individual conversations.

**Объяснение:** Transport отслеживает отдельные разговоры, сегментирует/собирает данные и multiplexes разговоры на общей сети. Identifying frames — работа L 2, routing information — L 3. Поэтому эти два отвлекающих варианта не входят в три обязанности транспорта.

**Explanation in English:** Transport tracks conversations, segments/reassembles data and multiplexes conversations across the network. Frame identification belongs to Layer 2 and routing information to Layer 3, so those distractors are not transport responsibilities.

### E346. Which transport layer protocol statement is true?

Источник: модули_14, Q3. Тема: модуль 14.

1. TCP has fewer fields than UDP.
2. TCP is faster than UDP.
3. UDP is a best-effort delivery protocol.
4. UDP provides reliability.

**Ответ:** UDP is a best-effort delivery protocol..

**Объяснение:** UDP — best effort: сам не подтверждает доставку и не повторяет потери. TCP имеет больше полей и механизмов надёжности, чем UDP. Нельзя без условий утверждать, что TCP быстрее: производительность зависит от задачи и сети.

**Explanation in English:** UDP is best effort: it does not itself acknowledge delivery or retransmit losses. TCP has more fields and reliability mechanisms than UDP. TCP cannot universally be called faster; performance depends on the application and network.

### E347. Which transport layer protocol would be used for VoIP applications?

Источник: модули_14, Q4. Тема: модуль 14.

1. Session Information Protocol (SIP)
2. Transmission Control Protocol (TCP)
3. User Datagram Protocol (UDP)
4. VoIP Transfer Protocol

**Ответ:** User Datagram Protocol (UDP).

**Объяснение:** Для медиа VoIP обычно выбирают UDP: запоздавший голосовой фрагмент часто бесполезнее небольшой потери, а handshake/retransmission добавили бы задержку. SIP — сигнализация приложения, не транспортный протокол; TCP возможен для других частей системы, но не ожидаемый транспорт голосового потока здесь.

**Explanation in English:** VoIP media commonly uses UDP because a late voice fragment is often less useful than tolerating a small loss, and handshake/retransmission adds delay. SIP is application signaling, not a transport protocol. TCP may serve other system functions, but is not the intended media-stream answer.

### E348. Which transport layer protocol ensures reliable same-order delivery?

Источник: модули_14, Q1. Тема: модуль 14.

1. ICMP
2. IP
3. TCP
4. UDP

**Ответ:** TCP.

**Объяснение:** TCP использует sequence numbers для порядка и ACK/retransmission для надёжности. UDP не даёт этих гарантий сам; IP маршрутизирует best-effort пакеты, ICMP передаёт диагностику. Поэтому reliable same-order delivery относится к TCP.

**Explanation in English:** TCP uses sequence numbers for order and ACK/retransmission for reliability. UDP does not itself provide these guarantees; IP routes best-effort packets and ICMP carries diagnostics. Reliable same-order delivery therefore identifies TCP.

### E349. Which TCP header statement is true?

Источник: модули_14, Q2. Тема: модуль 14.

1. It consists of 4 fields in an 8-byte header.
2. It consists of 8 fields in a 10-byte header.
3. It consists of 10 fields in a 20-byte header.
4. It consists of 20 fields in a 40-byte header.

**Ответ:** It consists of 10 fields in a 20-byte header..

**Объяснение:** Курс группирует основной TCP-заголовок в 10 полей, минимум 20 байт без options. 4 поля/8 байт — UDP. Реальная длина TCP может увеличиваться опциями; это не означает, что фиксированный минимум составляет 40 байт.

**Explanation in English:** The course groups the base TCP header into ten fields occupying at least 20 bytes without options. Four fields/eight bytes describes UDP. TCP options can increase actual length, but its fixed minimum is not 40 bytes.

### E350. Which two applications would use the TCP transport layer protocol? (Choose two.)

Источник: модули_14, Q3. Тема: модуль 14.

1. FTP
2. HTTP
3. ICMP
4. TFTP
5. VoIP

**Ответ:** FTP; HTTP.

**Объяснение:** FTP использует TCP для надёжной передачи файлов; HTTP в контексте курса (HTTP/1.1 и HTTP/2) также использует TCP. TFTP и обычный VoIP media — UDP, ICMP вообще не приложение поверх TCP. Современный HTTP/3 использует QUIC/UDP, но не является подразумеваемым вариантом задания.

**Explanation in English:** FTP uses TCP for reliable files, and the course’s HTTP context (HTTP/1.1 and HTTP/2) also uses TCP. TFTP and typical VoIP media use UDP; ICMP is not a TCP application. Modern HTTP/3 uses QUIC/UDP but is outside this question’s intended HTTP assumption.

### E351. Which of the following is a stateless best-effort delivery transport layer protocol?

Источник: модули_14, Q1. Тема: модуль 14.

1. ICMP
2. IP
3. TCP
4. UDP

**Ответ:** UDP.

**Объяснение:** UDP не поддерживает TCP-подобное состояние соединения и передаёт datagrams best effort. TCP является connection-oriented. IP тоже best effort, но находится на internet/network layer, а вопрос требует transport protocol; ICMP — диагностика.

**Explanation in English:** UDP has no TCP-style connection state and sends best-effort datagrams. TCP is connection-oriented. IP is also best effort but belongs to the Internet/network layer; the question asks for a transport protocol. ICMP provides diagnostics.

### E352. Which UDP header statement is true?

Источник: модули_14, Q2. Тема: модуль 14.

1. It consists of 4 fields in an 8-byte header.
2. It consists of 8 fields in a 10-byte header.
3. It consists of 10 fields in a 20-byte header.
4. It consists of 20 fields in a 40-byte header.

**Ответ:** It consists of 4 fields in an 8-byte header..

**Объяснение:** UDP имеет четыре поля по 16 бит: Source Port, Destination Port, Length, Checksum. 4×16=64 бита=8 байт. Вариант 10 полей/20 байт описывает минимум TCP, а не UDP.

**Explanation in English:** UDP has four 16-bit fields: Source Port, Destination Port, Length and Checksum. 4×16=64 bits=eight bytes. Ten fields/twenty bytes describes the minimum TCP header rather than UDP.

### E353. Which two applications would use the UDP transport layer protocol? (Choose two.)

Источник: модули_14, Q3. Тема: модуль 14.

1. FTP
2. HTTP
3. ICMP
4. TFTP
5. VoIP

**Ответ:** TFTP; VoIP.

**Объяснение:** TFTP использует UDP для простого обмена файлами; VoIP media — ради низкой задержки. FTP и классический HTTP используют TCP. ICMP — собственный сетевой протокол, поэтому он не является приложением, выбирающим UDP.

**Explanation in English:** TFTP uses UDP for simple file transfer and VoIP media for low delay. FTP and classic HTTP use TCP. ICMP is its own network-layer protocol, not an application selecting UDP.

### E354. Which two fields are the same in a TCP and UDP header? (Choose two.)

Источник: модули_14, Q4. Тема: модуль 14.

1. Control bits
2. Destination port number
3. Sequence number
4. Source port number
5. Well-known port number

**Ответ:** Destination port number; Source port number.

**Объяснение:** Source Port и Destination Port присутствуют и в TCP, и в UDP и указывают приложения/разговоры. Sequence Number и Control Bits есть у TCP, но не UDP. Well-known port — диапазон значений номера, а не самостоятельное поле заголовка.

**Explanation in English:** Source Port and Destination Port exist in both TCP and UDP to identify applications/conversations. Sequence Number and Control Bits are TCP features absent from UDP. Well-known port is a range of port values, not a separate header field.

### E355. Assume a host with IP address 10.1.1.10 wants to request web services from a server at 10.1.1.254. Which of the following would display the correct socket pair?

Источник: модули_14, Q1. Тема: модуль 14.

1. 1099:10.1.1.10, 80:10.1.1.254
2. 10.1.1.10:80, 10.1.1.254:1099
3. 10.1.1.10:1099, 10.1.1.254:80
4. 80:10.1.1.10, 1099:10.1.1.254

**Ответ:** 10.1.1.10:1099, 10.1.1.254:80.

**Объяснение:** Socket записывается IP:port. Клиент 10.1.1.10 выбирает исходный 1099, сервер 10.1.1.254 слушает HTTP 80: 10.1.1.10:1099 ↔ 10.1.1.254:80. Обратные пары перепутали роли или порядок записи. Клиентский порт не обязательно находится только в IANA dynamic range: диапазон зависит от ОС.

**Explanation in English:** A socket is written IP:port. Client 10.1.1.10 uses source 1099 and server 10.1.1.254 listens on HTTP 80:10.1.1.10:1099 ↔10.1.1.254:80. Other pairs reverse roles or notation. Client ephemeral ranges depend on the OS and are not necessarily restricted to IANA’s dynamic range.

### E356. Which port group includes port numbers for FTP, HTTP, and TFTP applications?

Источник: модули_14, Q2. Тема: модуль 14.

1. Dynamic ports
2. Private ports
3. Registered ports
4. Well-known ports

**Ответ:** Well-known ports.

**Объяснение:** FTP control 21, HTTP 80 и TFTP 69 находятся в 0–1023, группе well-known/system ports. Registered —1024–49151; dynamic/private —49152–65535. Наличие разных транспортов TCP/UDP не меняет номерную группу.

**Explanation in English:** FTP control 21, HTTP 80 and TFTP 69 are within 0–1023, the well-known/system group. Registered spans 1024–49151; dynamic/private 49152–65535. Using TCP versus UDP does not change the numeric group.

### E357. Which Windows command would display the protocols in use, the local address and port numbers, the foreign address and port numbers, and the connection state?

Источник: модули_14, Q3. Тема: модуль 14.

1. Ipconfig /all
2. Ping
3. Netstat
4. Traceroute

**Ответ:** Netstat.

**Объяснение:** netstat показывает протокол, local/foreign IP:port и состояние соединения. ipconfig /all показывает настройки интерфейсов, ping достижимость, traceroute переходы. Они не выводят требуемый список conversations/states.

**Explanation in English:** netstat shows protocol, local/foreign IP:port and connection state. ipconfig /all shows interface configuration, ping reachability and traceroute hops. Those do not provide the requested conversation/state list.

### E358. Which of the following would be valid source and destination ports for a host connecting to an email server?

Источник: модули_14, Q1. Тема: модуль 14.

1. Source: 25, Destination: 49152
2. Source: 80, Destination: 49152
3. Source: 49152, Destination: 25
4. Source: 49152, Destination: 80

**Ответ:** Source: 49152, Destination: 25.

**Объяснение:** Для SMTP сервер слушает destination port 25, клиент в примере использует source 49152. Обмен местами сделал бы клиентом службу 25, а destination 80 выбрал бы HTTP. Почта имеет и другие порты/режимы; среди предложенных подразумевается SMTP 25.

**Explanation in English:** For SMTP, the server listens on destination port 25 while the example client uses source 49152. Reversing them swaps the service/client roles; destination 80 selects HTTP. Mail has other modes/ports, but the offered choices imply SMTP 25.

### E359. Which control bit flags are used during the three-way handshake?

Источник: модули_14, Q2. Тема: модуль 14.

1. ACK and FIN
2. FIN and RESET
3. RESET and SYN
4. SYN and ACK

**Ответ:** SYN and ACK.

**Объяснение:** TCP открывает соединение SYN → SYN+ACK → ACK, поэтому используются флаги SYN и ACK. FIN закрывает направление, RST аварийно сбрасывает соединение; они не входят в обычный успешный handshake.

**Explanation in English:** TCP opens with SYN → SYN+ACK → ACK, using SYN and ACK flags. FIN closes a direction and RST resets a connection; neither belongs to the normal successful handshake.

### E360. How many exchanges are needed to end both sessions between two hosts?

Источник: модули_14, Q3. Тема: модуль 14.

1. One exchange
2. Two exchanges
3. Three exchanges
4. Four exchanges
5. Five exchanges

**Ответ:** Four exchanges.

**Объяснение:** У обычного полного TCP-закрытия четыре сообщения: FIN, ACK, затем FIN от другой стороны и ACK. Это завершает два направления одной duplex-связи. Реальные реализации могут объединить ACK+FIN, поэтому четыре — типичная учебная последовательность, не обязательный минимум каждого захвата.

**Explanation in English:** A normal full TCP close has four messages: FIN, ACK, then the peer’s FIN and ACK. This closes both directions of one duplex connection. Implementations may combine ACK+FIN, so four is the typical teaching sequence, not a mandatory minimum in every capture.

### E361. What field is used by the destination host to reassemble segments into the original order?

Источник: модули_14, Q1. Тема: модуль 14.

1. Control Bits
2. Destination Port
3. Sequence Number
4. Source Port
5. Window Size

**Ответ:** Sequence Number.

**Объяснение:** Sequence Number задаёт позицию первого байта сегмента в TCP-потоке, позволяя расположить полученные данные в исходном порядке. Порты выбирают приложение, Window Size регулирует объём, Control Bits описывают состояние/управление.

**Explanation in English:** Sequence Number identifies the first byte’s position in the TCP stream, allowing the receiver to restore original order. Ports select applications, Window Size regulates volume and Control Bits signal state/control.

### E362. What field is used to provide flow control?

Источник: модули_14, Q2. Тема: модуль 14.

1. Control Bits
2. Destination Port
3. Sequence Number
4. Source Port
5. Window Size

**Ответ:** Window Size.

**Объяснение:** TCP Window Size сообщает, сколько данных получатель способен принять без дополнительного подтверждения, и предотвращает переполнение его буфера. Sequence Number отвечает за позиции байтов; ports — за приложения. Flow control не равен выбору маршрута или handshake.

**Explanation in English:** TCP Window Size advertises how much data the receiver can accept without further acknowledgment, preventing buffer overload. Sequence Number identifies byte positions; ports identify applications. Flow control is not routing or handshake.

### E363. What happens when a sending host senses there is congestion?

Источник: модули_14, Q3. Тема: модуль 14.

1. The receiving host increases the number of bytes it sends before receiving an acknowledgment from the sending host.
2. The receiving host reduces the number of bytes it sends before receiving an acknowledgment from the sending host.
3. The sending host increases the number of bytes it sends before receiving an acknowledgment from the destination host.
4. The sending host reduces the number of bytes it sends before receiving an acknowledgment from the destination host.

**Ответ:** The sending host reduces the number of bytes it sends before receiving an acknowledgment from the destination host..

**Объяснение:** Обнаружив признаки congestion, отправитель уменьшает объём неподтверждённых данных и темп отправки. Увеличение объёма усугубило бы перегрузку. Варианты про изменение передачи receiving host путают направление: вопрос о реакции source на перегрузку пути к destination.

**Explanation in English:** On congestion signals, the sender reduces outstanding unacknowledged data and its sending rate. Increasing it would worsen congestion. Choices changing the receiving host’s transmission confuse directions; the question concerns the source reacting to congestion toward the destination.

### E364. Why is UDP desirable for protocols that make a simple request and reply transactions?

Источник: модули_14, Q1. Тема: модуль 14.

1. Flow Control
2. Low overhead
3. Reliability
4. Same-order delivery

**Ответ:** Low overhead.

**Объяснение:** Для короткого request/reply UDP экономит обмен установления соединения и имеет маленький 8-байтовый заголовок: low overhead. Flow control, гарантированная доставка и same-order delivery не встроены в UDP, поэтому не могут объяснять его выбор.

**Explanation in English:** For short request/reply exchanges, UDP avoids connection setup and has a small eight-byte header: low overhead. Flow control, guaranteed delivery and same-order delivery are not built into UDP, so they cannot explain choosing it.

### E365. Which UDP datagram reassembly statement is true?

Источник: модули_14, Q2. Тема: модуль 14.

1. UDP does not reassemble the data.
2. UDP reassembles the data in the order that it was received.
3. UDP reassembles the data using control bits.
4. UDP reassembles the data using sequence numbers.

**Ответ:** UDP reassembles the data in the order that it was received..

**Объяснение:** В формулировке курса «reassembles in received order» означает: UDP отдаёт поступившие datagrams приложению без восстановления порядка отправки. В нём нет TCP sequence numbers/control bits для такой сортировки. Технически UDP сохраняет границы сообщений и не собирает надёжный байтовый поток; IP-фрагменты собирает IP, не UDP.

**Explanation in English:** The course’s “reassembles in received order” means UDP passes received datagrams to the application without restoring send order. It lacks TCP sequence numbers/control bits for that sorting. Technically UDP preserves message boundaries rather than building a reliable byte stream; IP, not UDP, reassembles IP fragments.

### E366. Which of the following would be valid source and destination ports for a host connecting to a DNS server?

Источник: модули_14, Q3. Тема: модуль 14.

1. Source: 53, Destination: 49152
2. Source: 1812, Destination: 49152
3. Source: 49152, Destination: 53
4. Source: 49152, Destination: 1812

**Ответ:** Source: 49152, Destination: 53.

**Объяснение:** DNS-сервер принимает запрос на destination 53; source 49152 — временный порт клиента в примере. В ответе роли портов меняются.1812 относится к RADIUS, а source 53/destination 49152 описывает скорее ответ сервера, не начальный запрос.

**Explanation in English:** A DNS server receives the query at destination 53; source 49152 is the example client’s temporary port. Replies reverse these roles.1812 is RADIUS, while source 53/destination 49152 resembles a server reply rather than the initial query.

### E367. Which transport layer feature is used to establish a connection-oriented session?

Источник: модули_14, Q1. Тема: модуль 14.

1. UDP ACK flag
2. TCP 3-way handshake
3. UDP sequence number
4. TCP port number

**Ответ:** TCP 3-way handshake.

**Объяснение:** TCP three-way handshake согласует начальные sequence numbers и подтверждает готовность двух сторон: SYN,SYN-ACK,ACK. Один port number лишь идентифицирует endpoint и не устанавливает соединение. У UDP нет собственных ACK/SYN/sequence fields.

**Explanation in English:** TCP’s three-way handshake synchronizes initial sequence numbers and confirms both endpoints:SYN,SYN-ACK,ACK. A port number only identifies an endpoint; it does not establish a connection. UDP has no native ACK/SYN/sequence fields.

### E368. What is the complete range of TCP and UDP well-known ports?

Источник: модули_14, Q2. Тема: модуль 14.

1. 0 to 255
2. 0 to 1023
3. 256 - 1023
4. 1024 - 49151

**Ответ:** 0 to 1023.

**Объяснение:** Well-known/system ports занимают 0–1023 включительно.0–255 и 256–1023 — только части диапазона;1024–49151 — registered. Это классификация номеров, не число одновременно разрешённых соединений.

**Explanation in English:** Well-known/system ports span 0–1023 inclusive.0–255 and 256–1023 are only subsets;1024–49151 is registered. This classifies port numbers, not the number of simultaneous allowed connections.

### E369. What is a socket?

Источник: модули_14, Q3. Тема: модуль 14.

1. The combination of the source and destination IP address and source and destination Ethernet address
2. The combination of a source IP address and port number or a destination IP address and port number
3. The combination of the source and destination sequence and acknowledgment numbers
4. The combination of the source and destination sequence numbers and port numbers

**Ответ:** The combination of a source IP address and port number or a destination IP address and port number.

**Объяснение:** Socket — endpoint IP+port, например 192.168.1.1:80. Socket pair даёт оба конца разговора. MAC-адреса не входят в TCP socket, а sequence/ACK numbers описывают поток внутри соединения, не endpoint.

**Explanation in English:** A socket is an IP+port endpoint such as 192.168.1.1:80; a socket pair identifies both conversation ends. MAC addresses are not part of a TCP socket, and sequence/ACK numbers describe the stream rather than an endpoint.

### E370. How does a networked server manage requests from multiple clients for different services?

Источник: модули_14, Q4. Тема: модуль 14.

1. The server sends all requests through a default gateway.
2. Each request has a combination of source and destination port numbers, coming from a unique IP address.
3. The server uses IP addresses to identify different services.
4. Each request is tracked through the physical address of the client.

**Ответ:** Each request has a combination of source and destination port numbers, coming from a unique IP address..

**Объяснение:** Сервер различает TCP-соединения комбинацией source/destination IP и ports (и протоколом), поэтому выбирается вариант про сочетание адресов/портов. Один IP не определяет службу, MAC удалённого клиента не проходит через роутеры, gateway не разделяет приложения. У разных клиентов может быть общий public IP за NAT — различение сохраняют порты.

**Explanation in English:** The server distinguishes TCP connections using source/destination IP and ports (plus protocol), making the address/port-combination option best. One IP does not identify a service, remote-client MACs do not cross routers, and a gateway does not demultiplex applications. NAT clients may share a public IP but remain distinguishable by ports.

### E371. What happens if part of an FTP message is not delivered to the destination?

Источник: модули_14, Q5. Тема: модуль 14.

1. The message is lost because FTP does not use a reliable delivery method.
2. The FTP source host sends a query to the destination host.
3. The part of the FTP message that was lost is re-sent.
4. The entire FTP message is re-sent.

**Ответ:** The part of the FTP message that was lost is re-sent..

**Объяснение:** FTP использует TCP: потерянные байты обнаруживаются по отсутствующим ACK/sequence progress и передаются повторно. Не требуется повторять весь файл/FTP-message с начала. Утверждение о ненадёжности FTP неверно для его обычного TCP-транспорта.

**Explanation in English:** FTP uses TCP, which detects missing bytes from absent ACK/sequence progress and retransmits them. The entire file/FTP message need not restart. Claiming FTP lacks reliable delivery is wrong for its normal TCP transport.

### E372. What type of applications are best suited for using UDP?

Источник: модули_14, Q6. Тема: модуль 14.

1. Applications that are sensitive to delay
2. Applications that need reliable delivery
3. Applications that require retransmission of lost segments
4. Applications that are sensitive to packet loss

**Ответ:** Applications that are sensitive to delay.

**Объяснение:** Delay-sensitive приложения часто предпочитают UDP, чтобы не ждать retransmission/упорядочивания TCP. Если требуется надёжность, отсутствие потерь и повторная передача, TCP обычно лучше либо приложение должно реализовать это поверх UDP. UDP сам по себе не гарантирует низкую задержку сети.

**Explanation in English:** Delay-sensitive applications often choose UDP to avoid TCP retransmission/order waiting. If reliable loss-free retransmission is needed, TCP is normally better or the application must implement it above UDP. UDP itself does not guarantee a low-latency network.

### E373. Network congestion has resulted in the source learning of the loss of TCP segments that were sent to the destination. What is one way that the TCP protocol addresses this?

Источник: модули_14, Q7. Тема: модуль 14.

1. The source decreases the amount of data that it transmits before it receives an acknowledgement from the destination.
2. The source decreases the window size to decrease the rate of transmission from the destination.
3. The destination decreases the window size.
4. The destination sends fewer acknowledgement messages in order to conserve bandwidth.

**Ответ:** The source decreases the amount of data that it transmits before it receives an acknowledgement from the destination..

**Объяснение:** TCP source при перегрузке сокращает данные в полёте до получения ACK, уменьшая congestion window. Это уменьшает нагрузку от source к destination. Уменьшение advertised window для передачи destination в обратном направлении и сокращение ACK не решают описанную задачу тем же механизмом.

**Explanation in English:** On congestion, the TCP source reduces in-flight data before ACKs by shrinking its congestion window. This reduces source-to-destination load. Changing the advertised window for the reverse direction or sending fewer ACKs is not the mechanism asked about.

### E374. Which two operations are provided by TCP but not by UDP? (Choose two.)

Источник: модули_14, Q8. Тема: модуль 14.

1. Identifying the applications
2. Acknowledging received data
3. Identifying individual conversations
4. Retransmitting any unacknowledged data
5. Reconstructing data in the order received

**Ответ:** Acknowledging received data; Retransmitting any unacknowledged data.

**Объяснение:** TCP подтверждает полученные байты и повторно передаёт данные, которые не были подтверждены при обнаружении потерь/таймауте. UDP этого не делает сам. Порты и разделение conversations есть у обоих, поэтому identifying applications/conversations не являются отличиями TCP.

**Explanation in English:** TCP acknowledges received bytes and retransmits unacknowledged data when loss/timeout is detected; UDP does not do this itself. Both use ports and distinguish conversations, so identifying applications/conversations are not TCP-only differences.

### E375. What is the purpose of using a source port number in a TCP communication?

Источник: модули_14, Q9. Тема: модуль 14.

1. To notify the remote device that the conversation is over
2. To assemble the segments that arrived out of order
3. To keep track of multiple conversations between devices
4. To inquire for a nonreceived segment

**Ответ:** To keep track of multiple conversations between devices.

**Объяснение:** Source port помогает отличать несколько разговоров от одного устройства, например две TCP-сессии к одному web server. Завершение обозначает FIN/RST, порядок — sequence numbers, восстановление потерь — ACK/таймеры. Port не выполняет эти три функции.

**Explanation in English:** The source port distinguishes conversations from one device, such as two TCP sessions to the same web server. FIN/RST signals termination, sequence numbers order bytes and ACKs/timers support loss recovery. A port does not perform those functions.

### E376. Which two flags in the TCP header are used in a TCP three-way handshake to establish connectivity between two network devices? (Choose two.)

Источник: модули_14, Q10. Тема: модуль 14.

1. ACK
2. FIN
3. PSH
4. RST
5. SYN
6. URG

**Ответ:** ACK; SYN.

**Объяснение:** Для открытия используются SYN и ACK: первый SYN, ответ SYN+ACK, финальный ACK. FIN закрывает, RST сбрасывает, PSH просит передать данные приложению, URG связан с urgent indication; они не являются флагами базового handshake.

**Explanation in English:** Opening uses SYN and ACK:first SYN, then SYN+ACK, then ACK. FIN closes, RST resets, PSH requests delivery to the application and URG marks urgent indication. They are not the basic handshake flags.

### E377. What TCP mechanism is used to enhance performance by allowing a device to continuously send a steady stream of segments as long as the device is also receiving necessary acknowledgements?

Источник: модули_14, Q11. Тема: модуль 14.

1. Three-way handshake
2. Socket pair
3. Two-way handshake
4. Sliding window

**Ответ:** Sliding window.

**Объяснение:** Sliding window позволяет держать несколько сегментов в полёте и сдвигать разрешённый диапазон по мере ACK. Поэтому не нужно ждать отдельного ACK перед каждым следующим сегментом. Handshake только открывает соединение, socket pair только идентифицирует концы.

**Explanation in English:** A sliding window permits multiple segments in flight and advances the allowed range as ACKs arrive, avoiding a wait after every single segment. Handshake only opens a connection; the socket pair only identifies endpoints.

### E378. Which action is performed by a client when establishing communication with a server via the use of UDP at the transport layer?

Источник: модули_14, Q12. Тема: модуль 14.

1. The client sets the window size for the session.
2. The client sends an ISN to the server to start the 3-way handshake.
3. The client randomly selects a source port number.
4. The client sends a synchronization segment to begin the session.

**Ответ:** The client randomly selects a source port number..

**Объяснение:** UDP-клиент выбирает доступный source port (обычно ephemeral, часто рандомизированный), чтобы ответы попали в нужное приложение. У UDP нет SYN, ISN, three-way handshake или advertised TCP window. Выбор порта не является установлением соединения.

**Explanation in English:** A UDP client chooses an available source port, typically ephemeral and often randomized, so replies reach the right application. UDP has no SYN, ISN, three-way handshake or TCP advertised window. Selecting a port is not connection establishment.

### E379. Which two services or protocols use the preferred UDP protocol for fast transmission and low overhead? (Choose two)

Источник: модули_14, Q13. Тема: модуль 14.

1. FTP
2. DNS
3. HTTP
4. POP3
5. VoIP

**Ответ:** DNS; VoIP.

**Объяснение:** Обычные DNS-запросы часто используют UDP ради короткого request/reply; VoIP media — ради малой задержки. FTP, POP 3 и классический HTTP используют TCP. DNS также умеет TCP, а HTTP/3 использует UDP/QUIC: ответ отражает типичный учебный сценарий, не исключительное правило навсегда.

**Explanation in English:** Ordinary DNS queries often use UDP for short request/reply, and VoIP media for low delay. FTP, POP 3 and classic HTTP use TCP. DNS also supports TCP and HTTP/3 uses UDP/QUIC; the answer reflects the typical course scenario, not an exclusive universal rule.

### E380. Which number or set of numbers represents a socket?

Источник: модули_14, Q14. Тема: модуль 14.

1. 01-23-45-67-89-AB
2. 21
3. 192.168.1.1:80
4. 10.1.1.15

**Ответ:** 192.168.1.1:80.

**Объяснение:** 192.168.1.1:80 сочетает IP и port и потому является socket endpoint.01-23-45-67-89-AB — MAC;21 — только port;10.1.1.15 — только IP. Каждому из них отдельно не хватает второй составляющей socket.

**Explanation in English:** 192.168.1.1:80 combines IP and port, making a socket endpoint.01-23-45-67-89-AB is a MAC,21 only a port and 10.1.1.15 only an IP. Each alone lacks the second socket component.

### E381. What is a responsibility of transport layer protocols?

Источник: модули_14, Q15. Тема: модуль 14.

1. Providing network access
2. Tracking individual conversations
3. Determining the best path to forward a packet
4. Translating private IP addresses to public IP addresses

**Ответ:** Tracking individual conversations.

**Объяснение:** Transport tracks individual application conversations with ports and protocol state where needed. Network access относится к нижнему уровню, best path — маршрутизация L 3, private/public translation — NAT. Поэтому tracking individual conversations — единственный подходящий транспортный пункт.

**Explanation in English:** Transport tracks individual application conversations using ports and protocol state where needed. Network access belongs below it, best-path selection is Layer 3 routing and private/public translation is NAT. Tracking individual conversations is therefore the transport responsibility.

### E533. What layer is responsible for routing messages through an internetwork in the TCP/IP model?

Источник: тесты_exam_0, Q22. Тема: модуль 14.

1. internet
2. transport
3. network access
4. session

**Ответ:** internet.

**Объяснение:** В TCP/IP internet layer соответствует сетевому уровню OSI и маршрутизирует IP-пакеты между сетями. Transport разделяет приложения, network access передаёт по текущему каналу. Session не является отдельным слоем четырёхуровневой TCP/IP-модели.

**Explanation in English:** The TCP/IP Internet layer corresponds to OSI network and routes IP packets between networks. Transport distinguishes applications; network access transmits on the current link. Session is not a separate layer in the four-layer TCP/IP model.

### E538. Which statement accurately describes a TCP/IP encapsulation process when a PC is sending data to the network?

Источник: тесты_exam_0, Q27. Тема: модуль 14.

1. Data is sent from the internet layer to the network access layer.
2. Packets are sent from the network access layer to the transport layer.
3. Segments are sent from the transport layer to the internet layer.
4. Frames are sent from the network access layer to the internet layer.

> Два утверждения описывают исходящую инкапсуляцию; single-choice неоднозначен.

**Ответ:** Segments are sent from the transport layer to the internet layer..

**Объяснение:** Точное PDU-утверждение: transport передаёт segments в internet layer, который делает packets. Но общий вариант «Data is sent from internet layer to network access layer» тоже описывает реальный следующий шаг исходящей инкапсуляции. Поэтому при единственном ответе формулировка неоднозначна; карточка исключена. Обратные переходы packets к transport и frames к internet описывают приём, не отправку.

**Explanation in English:** The precise PDU statement is that transport passes segments to Internet, which creates packets. However, the generic “Data is sent from Internet layer to network access layer” also describes the real next outbound step. The single-answer wording is therefore ambiguous and excluded. Reverse packet/frame transitions describe reception rather than outbound encapsulation.

### E582. What are two services provided by the OSI network layer? (Choose two.)

Источник: тесты_exam_2, Q4. Тема: модуль 14.

1. performing error detection
2. routing packets toward the destination
3. encapsulating PDUs from the transport layer
4. placement of frames on the media
5. collision detection

**Ответ:** routing packets toward the destination; encapsulating PDUs from the transport layer.

**Объяснение:** Network layer инкапсулирует transport PDU в IP-пакет и маршрутизирует его к destination. Размещение кадров на среде/обнаружение коллизий относятся к нижним уровням. IPv 4 header checksum существует, но общий frame-error detection не является здесь одной из двух запрошенных L 3-услуг.

**Explanation in English:** The network layer encapsulates transport PDUs into IP packets and routes them toward the destination. Placing frames on media and collision detection belong below it. Although IPv 4 has a header checksum, general frame error detection is not one of the two intended Layer 3 services.

### E585. What information does the loopback test provide?

Источник: тесты_exam_2, Q7. Тема: модуль 14.

1. The TCP/IP stack on the device is working correctly.
2. The device has end-to-end connectivity.
3. DHCP is working correctly.
4. The Ethernet cable is working correctly.
5. The device has the correct IP address on the network.

**Ответ:** The TCP/IP stack on the device is working correctly..

**Объяснение:** Ping loopback проходит внутри собственного TCP/IP-стека, поэтому проверяет его работу. Он не выходит через Ethernet-кабель, не проверяет DHCP, правильность LAN-IP или end-to-end путь к другому хосту.

**Explanation in English:** A loopback ping stays inside the local TCP/IP stack and tests that stack. It does not traverse the Ethernet cable or verify DHCP, the configured LAN address, or end-to-end reachability to another host.

### E612. What does a client do when it has UDP datagrams to send?

Источник: тесты_exam_4, Q1. Тема: модуль 14.

1. It just sends the datagrams.
2. It queries the server to see if it is ready to receive data.
3. It sends a simplified three-way handshake to the server.
4. It sends to the server a segment with the SYN flag set to synchronize the conversation.

**Ответ:** It just sends the datagrams..

**Объяснение:** UDP не устанавливает транспортное соединение: клиент формирует datagram с адресами/портами и отправляет. Предварительный запрос готовности или SYN/three-way handshake не входят в UDP. Приложение может иметь собственный обмен, но это уже другой уровень.

**Explanation in English:** UDP establishes no transport connection: the client builds a datagram with addresses/ports and sends it. A readiness query or SYN/three-way handshake is not part of UDP. An application may implement its own exchange at a different layer.

### E613. Which flag in the TCP header is used in response to a received FIN in order to terminate connectivity between two network devices?

Источник: тесты_exam_4, Q2. Тема: модуль 14.

1. FIN
2. ACK
3. SYN
4. RST

**Ответ:** ACK.

**Объяснение:** Полученный FIN подтверждается ACK: сторона сообщает, что приняла запрос закрытия данного направления. Её собственный FIN закрывает обратное направление отдельно. SYN открывает соединение, RST аварийно сбрасывает — это не обычное подтверждение FIN.

**Explanation in English:** A received FIN is acknowledged with ACK, confirming closure of that direction. The peer’s own FIN closes the reverse direction separately. SYN opens and RST resets; neither is the normal FIN acknowledgment.

### E614. Which two characteristics are associated with UDP sessions? (Choose two.)

Источник: тесты_exam_4, Q3. Тема: модуль 14.

1. Destination devices receive traffic with minimal delay.
2. Transmitted data segments are tracked.
3. Destination devices reassemble messages and pass them to an application.
4. Received data is unacknowledged.
5. Unacknowledged data packets are retransmitted.

**Ответ:** Destination devices receive traffic with minimal delay.; Received data is unacknowledged..

**Объяснение:** UDP не посылает собственных ACK и не ждёт восстановления потерь, что уменьшает протокольные задержки. Поэтому курс выбирает minimal delay и received data is unacknowledged. Это не гарантия скорости сети; UDP не отслеживает сегменты для retransmission или TCP-подобной сборки потока.

**Explanation in English:** UDP sends no native ACKs and does not wait for loss recovery, reducing protocol-induced delay. Hence the course selects minimal delay and unacknowledged reception. This is not a network-speed guarantee; UDP does not track segments for retransmission or TCP-style stream reassembly.

### E616. Which two fields are included in the TCP header but not in the UDP header? (Choose two.)

Источник: тесты_exam_4, Q5. Тема: модуль 14.

1. window
2. checksum
3. source port
4. destination port
5. sequence number

**Ответ:** window; sequence number.

**Объяснение:** Window и Sequence Number поддерживают TCP flow control и упорядочивание; у UDP этих полей нет. Checksum, Source Port и Destination Port имеются в обоих заголовках, поэтому они не отличают TCP от UDP.

**Explanation in English:** Window and Sequence Number support TCP flow control and ordering; UDP lacks them. Checksum, Source Port and Destination Port exist in both headers, so they do not distinguish TCP from UDP.

### E617. What is a characteristic of UDP?

Источник: тесты_exam_4, Q6. Тема: модуль 14.

1. UDP datagrams take the same path and arrive in the correct order at the destination.
2. Applications that use UDP are always considered unreliable.
3. UDP reassembles the received datagrams in the order they were received.
4. UDP only passes data to the network when the destination is ready to receive the data.

**Ответ:** UDP reassembles the received datagrams in the order they were received..

**Объяснение:** Под «reassembles in received order» курс понимает передачу datagrams приложению в порядке поступления без сортировки по исходной последовательности. UDP не гарантирует одинаковый маршрут/порядок и не ждёт готовности получателя. Приложение поверх UDP может реализовать надёжность, поэтому «always unreliable applications» слишком категорично.

**Explanation in English:** The course’s “reassembles in received order” means passing datagrams to the application as received without restoring original order. UDP guarantees neither identical paths/order nor receiver readiness. An application above UDP can implement reliability, so “applications are always unreliable” is too absolute.

### E619. In what two situations would UDP be better than TCP as the preferred transport protocol? (Choose two.)

Источник: тесты_exam_4, Q8. Тема: модуль 14.

1. when applications need to guarantee that a packet arrives intact, in sequence, and unduplicated
2. when a faster delivery mechanism is needed
3. when delivery overhead is not an issue
4. when applications do not need to guarantee delivery of the data
5. when destination port numbers are dynamic

**Ответ:** when a faster delivery mechanism is needed; when applications do not need to guarantee delivery of the data.

**Объяснение:** UDP подходит, когда важны быстрый старт/малые накладные расходы и приложение не требует гарантии доставки от транспорта. Если нужны intact,in-sequence,unduplicated данные, эти услуги предоставляет TCP или дополнительный протокол. Dynamic destination ports сами по себе не определяют выбор TCP/UDP.

**Explanation in English:** UDP suits quick startup/low overhead when the application does not require transport-level delivery guarantees. Intact,in-sequence,unduplicated delivery calls for TCP or an additional protocol. Dynamic destination ports alone do not determine TCP versus UDP.

### E621. What information is used by TCP to reassemble and reorder received segments?

Источник: тесты_exam_4, Q10. Тема: модуль 14.

1. port numbers
2. sequence numbers
3. acknowledgment numbers
4. fragment numbers

**Ответ:** sequence numbers.

**Объяснение:** TCP Sequence Number указывает позицию байтов и позволяет восстановить порядок сегментов. Acknowledgment Number сообщает следующий ожидаемый байт, ports выбирают приложение, а fragment numbers относятся к другой задаче IP-фрагментации.

**Explanation in English:** TCP Sequence Number locates bytes and permits segment reordering. Acknowledgment Number reports the next expected byte, ports select the application, and fragment numbering concerns the different task of IP fragmentation.

### E622. Which field in the TCP header indicates the status of the three-way handshake process?

Источник: тесты_exam_4, Q11. Тема: модуль 14.

1. window
2. reserved
3. checksum
4. control bits

**Ответ:** control bits.

**Объяснение:** Control bits/flags SYN и ACK показывают этап handshake. Window задаёт объём, checksum проверяет сегмент, reserved отведено под расширения. Эти три поля не заменяют управляющие флаги открытия.

**Explanation in English:** Control bits/flags SYN and ACK indicate the handshake stage. Window gives capacity, checksum checks the segment and reserved bits support extensions. Those fields do not replace connection-opening flags.

### E624. Which three fields are used in a UDP segment header? (Choose three.)

Источник: тесты_exam_4, Q13. Тема: модуль 14.

1. Window Size
2. Length
3. Source Port
4. Acknowledgment Number
5. Checksum
6. Sequence Number

**Ответ:** Length; Source Port; Checksum.

**Объяснение:** Из предложенного UDP содержит Length, Source Port и Checksum. Четвёртое реальное поле — Destination Port — в списке отсутствует. Window Size, Acknowledgment Number и Sequence Number относятся к TCP; поэтому Choose three не означает, что в UDP всего три поля.

**Explanation in English:** The listed UDP fields are Length, Source Port and Checksum. Its actual fourth field, Destination Port, is absent from the choices. Window Size, Acknowledgment Number and Sequence Number belong to TCP; “Choose three” does not mean UDP has only three fields.

### E625. What are three responsibilities of the transport layer? (Choose three.)

Источник: тесты_exam_4, Q14. Тема: модуль 14.

1. meeting the reliability requirements of applications, if any
2. multiplexing multiple communication streams from many users or applications on the same network
3. identifying the applications and services on the client and server that should handle transmitted data
4. directing packets towards the destination network
5. formatting data into a compatible form for receipt by the destination devices
6. conducting error detection of the contents in frames

**Ответ:** meeting the reliability requirements of applications, if any; multiplexing multiple communication streams from many users or applications on the same network; identifying the applications and services on the client and server that should handle transmitted data.

**Объяснение:** Transport предоставляет требуемые приложению услуги надёжности (TCP), multiplexes потоки и определяет приложения по ports. Направлять packets в destination network — L 3; форматировать представление — presentation/application; frame-error detection — L 2.

**Explanation in English:** Transport can supply required reliability (TCP), multiplex streams and identify applications through ports. Directing packets to destination networks belongs to Layer 3; formatting representation to presentation/application; frame error detection to Layer 2.

### E641. Which scenario describes a function provided by the transport layer?

Источник: тесты_exam_4, Q30; тесты_exam_7, Q5. Тема: модуль 14.

1. A student is using a classroom VoIP phone to call home. The unique identifier burned into the phone is a transport layer address used to contact another network device on the same network.
2. A student is playing a short web-based movie with sound. The movie and sound are encoded within the transport layer header.
3. A student has two web browser windows open in order to access two web sites. The transport layer ensures the correct web page is delivered to the correct browser window.
4. A corporate worker is accessing a web server located on a corporate network. The transport layer formats the screen so the web page appears properly no matter what device is being used to view the web site.

**Ответ:** A student has two web browser windows open in order to access two web sites. The transport layer ensures the correct web page is delivered to the correct browser window..

**Объяснение:** Две браузерные коммуникации различаются transport endpoints/ports, поэтому данные попадают нужному соединению и затем приложению. Впаянный MAC относится к L 2, кодирование movie/audio — к представлению данных, форматирование страницы — к приложению. Транспорт не знает вкладки напрямую: их сопоставляет браузер поверх соединений.

**Explanation in English:** Two browser communications are distinguished by transport endpoints/ports so data reaches the right connection and application. A burned-in MAC is Layer 2, movie/audio encoding is representation and page formatting application logic. Transport does not literally know tabs; the browser maps connections to them.

### E642. A PC that is communicating with a web server has a TCP window size of 6,000 bytes when sending data and a packet size of 1,500 bytes. Which byte of information will the web server acknowledge after it has received three packets of data from the PC?

Источник: тесты_exam_4, Q31. Тема: модуль 14.

1. 4501
2. 6001
3. 6000
4. 4500

**Ответ:** 4501.

**Объяснение:** Учебный расчёт предполагает первый байт 1 и 1500 байт TCP-данных в каждом из трёх пакетов: получены 1–4500, следующий ожидаемый байт 4501, значит ACK 4501. Window 6000 не заставляет ждать ровно 6000 байт. Если 1500 — полный IP-пакет с заголовками либо другой начальный sequence, точный ACK изменится; эти допущения в исходнике не уточнены.

**Explanation in English:** The course calculation assumes first data byte 1 and 1500 TCP payload bytes in each of three packets: bytes 1–4500 arrive, so the next expected byte is 4501 and ACK=4501. Window 6000 does not require waiting for exactly 6000 bytes. If 1500 includes IP/TCP headers or the initial sequence differs, the exact ACK changes; the source leaves these assumptions implicit.

### E687. Which PDU is processed when a host computer is de-encapsulating a message at the transport layer of the TCP/IP model?

Источник: тесты_exam_6, Q9. Тема: модуль 14.

1. bits
2. frame
3. packet
4. segment

**Ответ:** segment.

**Объяснение:** На transport при деинкапсуляции обрабатывается TCP segment (для UDP — datagram). Frame был обработан L 2, packet — L 3, bits — физическим уровнем. Здесь из предложенных PDU нужен segment.

**Explanation in English:** Transport de-encapsulation processes a TCP segment (a datagram for UDP). Layer 2 handled the frame, Layer 3 the packet and physical the bits. Among the offered PDUs, segment is correct.

### E688. Which two OSI model layers have the same functionality as two layers of the TCP/IP model? (Choose two.)

Источник: тесты_exam_6, Q10. Тема: модуль 14.

1. data link
2. network
3. physical
4. session
5. transport

**Ответ:** network; transport.

**Объяснение:** OSI network соответствует TCP/IP internet, а transport соответствует transport с теми же основными функциями. OSI physical+data link объединены в network access; session объединён с верхними уровнями в application. Поэтому именно network и transport имеют прямые отдельные аналоги.

**Explanation in English:** OSI network maps directly to TCP/IP Internet, and transport to transport with the same core functions. OSI physical+data link combine into network access; session joins upper layers in application. Thus network and transport have direct separate counterparts.

### E717. Refer to the exhibit. What does the value of the window size specify?

Источник: тесты_exam_6, Q39. Тема: модуль 14.

1. the amount of data that can be sent at one time
2. the total number of bits received during this TCP session
3. the amount of data that can be sent before an acknowledgment is required
4. a random number that is used in establishing a connection with the 3-way handshake

**Ответ:** the amount of data that can be sent before an acknowledgment is required.

**Объяснение:** Window size задаёт, сколько байтов может оставаться неподтверждёнными/быть принято по объявленному окну, а не общий итог битов за всю сессию. Это не один пакет «за один раз» и не random initial sequence number. Для определения смысла поля картинка не нужна.

**Explanation in English:** Window size bounds outstanding unacknowledged bytes according to the advertised receive window, not the session’s total bits. It is not one packet “at one time” or a random initial sequence number. No exhibit is needed to identify the field’s meaning.

### E718. To which TCP port group does the port 414 belong?

Источник: тесты_exam_6, Q40. Тема: модуль 14.

1. registered
2. well-known
3. private or dynamic
4. public

**Ответ:** well-known.

**Объяснение:** 414 лежит между 0 и 1023, поэтому относится к well-known/system ports. Registered начинается с 1024, private/dynamic с 49152. Public не является стандартной категорией IANA port numbers.

**Explanation in English:** 414 is between 0 and 1023, so it is a well-known/system port. Registered starts at 1024 and private/dynamic at 49152. Public is not a standard IANA port-number category.

### E748. What command can be used on a Windows PC to see the IP configuration of that computer?

Источник: тесты_exam_7, Q15. Тема: модуль 14.

1. ping
2. ipconfig
3. show interfaces
4. show ip interface brief

**Ответ:** ipconfig.

**Объяснение:** ipconfig выводит IP-конфигурацию Windows PC; /all добавляет подробности. ping проверяет достижимость, show interfaces и show ip interface brief — команды сетевых ОС Cisco, не штатный Windows-синтаксис.

**Explanation in English:** ipconfig displays a Windows PC’s IP configuration; /all adds details. ping tests reachability, while show interfaces and show ip interface brief are Cisco networking commands rather than normal Windows syntax.

### E783. A technician with a PC is using multiple applications while connected to the Internet. How is the PC able to keep track of the data flow between multiple application sessions and have each application receive the correct packet flows?

Источник: тесты_exam_7, Q50. Тема: модуль 14.

1. The data flow is being tracked based on the destination MAC address of the technician PC.
2. The data flow is being tracked based on the source port number that is used by each application.
3. The data flow is being tracked based on the source IP address that is used by the PC of the technician.
4. The data flow is being tracked based on the destination IP address that is used by the PC of the technician.

**Ответ:** The data flow is being tracked based on the source port number that is used by each application..

**Объяснение:** Разные source ports приложений позволяют отличать параллельные исходящие разговоры; полная идентификация включает IP/ports обеих сторон и transport protocol. IP и MAC самого PC общие для многих приложений, поэтому одних этих адресов недостаточно для demultiplexing.

**Explanation in English:** Different application source ports distinguish simultaneous outbound conversations; the full identity includes both endpoints’ IP/ports and transport protocol. The PC’s own IP/MAC is shared across applications, so those addresses alone cannot demultiplex them.

### E058. Which functionality is provided by DHCP?

Источник: модули_02, Q11. Тема: модуль 15.

1. Automatic assignment of an IP address to each host
2. Remote switch management
3. Translation of IP addresses to domain names
4. End-to-end connectivity test

**Ответ:** Automatic assignment of an IP address to each host.

**Объяснение:** DHCP автоматически выдаёт IP-адрес и сетевые параметры, избавляя от ручной настройки каждого host. Удалённое управление — SSH/Telnet, имена обслуживает DNS, достижимость проверяет ping/ICMP.

**Explanation in English:** DHCP automatically assigns IP configuration instead of requiring manual setup on every host. SSH/Telnet provide remote management, DNS handles names, and ping/ICMP tests reachability.

### E067. Which two protocols are service discovery protocols? (Choose two.)

Источник: модули_03, Q2. Тема: модуль 15.

1. DNS
2. TCP
3. SSH
4. DHCP

**Ответ:** DNS; DHCP.

**Объяснение:** В классификации этого курса DNS и DHCP помогают обнаружить нужную адресную/служебную информацию: DNS разрешает имена, DHCP обнаруживает сервер настройки и выдаёт параметры. TCP переносит данные, SSH даёт защищённый сеанс управления, поэтому эта пара не подходит.

**Explanation in English:** In this course’s classification, DNS and DHCP discover addressing/service information: DNS resolves names, while DHCP discovers configuration servers and supplies settings. TCP transports data and SSH provides secure management sessions, so they are not the intended pair.

### E071. Which two protocols belong in the TCP/IP model application layer?

Источник: модули_03, Q2. Тема: модуль 15.

1. EIGRP
2. DNS
3. OSPF
4. ICMP
5. DHCP

**Ответ:** DNS; DHCP.

**Объяснение:** DNS предоставляет разрешение имён, DHCP — конфигурацию host: это прикладные сетевые сервисы. EIGRP и OSPF обмениваются маршрутами, ICMP служит диагностике сетевого уровня; они не являются выбранными application-layer сервисами.

**Explanation in English:** DNS provides name resolution and DHCP host configuration, making them application services. EIGRP/OSPF exchange routes and ICMP supports network-layer control/diagnostics rather than the application services requested.

### E104. A web client is sending a request for a webpage to a web server. From the perspective of the client, what is the correct order of the protocol stack that is used to prepare the request for transmission?

Источник: модули_03, Q15. Тема: модуль 15.

1. HTTP, IP, TCP, Ethernet
2. HTTP, TCP, IP, Ethernet
3. Ethernet, TCP, IP, HTTP
4. Ethernet, IP, TCP, HTTP

**Ответ:** HTTP, TCP, IP, Ethernet.

**Объяснение:** При отправке инкапсуляция идёт сверху вниз: HTTP-запрос становится данными TCP, TCP-сегмент помещается в IP-пакет, затем в Ethernet-кадр. Поэтому порядок HTTP → TCP → IP → Ethernet. Обратный порядок относится к приёму.

**Explanation in English:** Sending encapsulates top-down: HTTP request inside TCP, TCP segment inside IP, IP packet inside Ethernet. Thus HTTP → TCP → IP → Ethernet; reverse order describes receiving.

### E382. This layer of the OSI model is concerned with the protocols that exchange data between programs running on hosts.

Источник: модули_15, Q1. Тема: модуль 15.

1. Application
2. Transport
3. Network
4. Physical

**Ответ:** Application.

**Объяснение:** Application layer определяет прикладные протоколы обмена между программами, например HTTP или SMTP. Transport даёт общую доставку между процессами, Network — IP/маршрутизацию, Physical — передачу сигналов; вопрос про смысл прикладного обмена.

**Explanation in English:** Application layer defines protocols such as HTTP/SMTP for programs exchanging data. Transport provides process-to-process delivery, Network IP/routing and Physical signals; the question asks about application-specific exchange.

### E383. MKV, GIF, and JPG standards are associated with which OSI layer?

Источник: модули_15, Q2. Тема: модуль 15.

1. Application
2. Presentation
3. Session
4. Transport

**Ответ:** Presentation.

**Объяснение:** MKV, GIF и JPG определяют формат представления мультимедийных данных, поэтому в OSI относятся к Presentation. Они не выбирают маршрут, не управляют транспортной доставкой и сами по себе не устанавливают Session-диалог.

**Explanation in English:** MKV, GIF and JPG define multimedia representation formats, so they map to OSI Presentation. They do not route packets, provide transport delivery or establish session dialogs.

### E384. These three OSI layers define the same functions as the TCP/IP model application layer.

Источник: модули_15, Q3. Тема: модуль 15.

1. Application
2. Presentation
3. Session
4. Transport
5. Network
6. Data link

**Ответ:** Application; Presentation; Session.

**Объяснение:** Верхний уровень TCP/IP объединяет OSI Application (сервис), Presentation (формат/кодирование) и Session (диалог). Transport и Network остаются самостоятельными уровнями TCP/IP, Data link входит в Network access.

**Explanation in English:** TCP/IP Application combines OSI Application services, Presentation formats/encoding and Session dialogs. Transport and Network remain separate TCP/IP layers; Data link belongs to Network access.

### E385. Which two are protocols that belong in the OSI application layer?

Источник: модули_15, Q4. Тема: модуль 15.

1. PNG
2. DNS
3. SMTP
4. QuickTime

**Ответ:** DNS; SMTP.

**Объяснение:** DNS и SMTP задают обмен сообщениями для разрешения имён и отправки почты — прикладные протоколы. PNG и QuickTime описывают представление/форматы мультимедиа и в модели OSI связаны с Presentation.

**Explanation in English:** DNS and SMTP define exchanges for name resolution and sending email, so they are application protocols. PNG and QuickTime concern multimedia representation/formats, associated with OSI Presentation.

### E386. This is a function of the OSI session layer.

Источник: модули_15, Q5. Тема: модуль 15.

1. Compress and decompress data
2. Provide an interface between applications
3. Format data for the application layer
4. Exchange of information to initiate dialog between peers

**Ответ:** Exchange of information to initiate dialog between peers.

**Объяснение:** Session устанавливает и поддерживает диалог между peers, поэтому подходит обмен информацией для начала диалога. Сжатие и форматирование — Presentation; предоставление прикладного интерфейса — Application.

**Explanation in English:** Session establishes and maintains peer dialogs, matching information exchange to initiate a dialog. Compression/formatting belong to Presentation; an application-facing interface belongs to Application.

### E387. True or false? In a peer-to-peer network environment every peer can function as both a client and a server.

Источник: модули_15, Q1. Тема: модуль 15.

1. True
2. False

**Ответ:** True.

**Объяснение:** True: peer может предоставлять свой ресурс (роль server) и одновременно запрашивать чужой (роль client). P2P не означает, что ролей нет; роли распределены между участниками без обязательного выделенного сервера.

**Explanation in English:** True: a peer can offer its resource as a server and request another peer’s resource as a client. P2P does not eliminate roles; it distributes them without requiring a dedicated server.

### E388. This message type is used when uploading data files to a web server.

Источник: модули_15, Q1. Тема: модуль 15.

1. GET
2. POST
3. PUT

> Неоднозначная формулировка: загрузка возможна через POST и PUT; POST — ожидаемый ответ курса.

**Ответ:** POST.

**Объяснение:** Курс ожидает POST для загрузки данных на обработку веб-серверу. Но формулировка «uploading files» без условий неоднозначна: PUT тоже может загрузить/заменить ресурс по заданному URI. GET получает ресурс. Поэтому ключ POST сохранён как ответ курса, а карточка исключена из строгого оцениваемого квиза.

**Explanation in English:** The course expects POST for submitting uploaded data to a web server. However, “uploading files” alone is ambiguous: PUT can also upload/create or replace a resource at a specified URI. GET retrieves a resource. POST is retained as the course key, but the card is excluded from strict scored practice.

### E389. This protocol is used by a web browser to establish a connection to a web server.

Источник: модули_15, Q2. Тема: модуль 15.

1. HTTP
2. SSL
3. IMAP
4. SMTP

**Ответ:** HTTP.

**Объяснение:** HTTP — прикладной протокол запроса и получения веб-ресурсов, поэтому из этих вариантов выбирают его. IMAP/SMTP относятся к почте. SSL — устаревшее название технологии защиты, не сам веб-протокол; транспортное соединение при HTTP/1.1 устанавливает TCP.

**Explanation in English:** HTTP is the application protocol for requesting web resources, so it is the correct option. IMAP/SMTP concern email. SSL is an obsolete security technology name, not the web application protocol; TCP establishes the transport connection for HTTP/1.1.

### E390. This protocol is used by a client to send email to a mail server.

Источник: модули_15, Q3. Тема: модуль 15.

1. POP
2. SMTP
3. IMAP
4. HTTP

**Ответ:** SMTP.

**Объяснение:** SMTP отправляет сообщение от почтового клиента к серверу и пересылает между серверами. POP и IMAP используются для получения/синхронизации mailbox. HTTP может использовать webmail-интерфейс, но не является указанным почтовым протоколом отправки.

**Explanation in English:** SMTP submits mail from a client to a server and relays it between servers. POP/IMAP retrieve or synchronize mailboxes. Webmail may use HTTP as an interface, but it is not the email-submission protocol asked for.

### E391. Which is a feature of IMAP?

Источник: модули_15, Q4. Тема: модуль 15.

1. It uploads email messages to a server.
2. It listens passively on port 110 for client requests.
3. It downloads a copy of email messages leaving the original on the server.

**Ответ:** It downloads a copy of email messages leaving the original on the server..

**Объяснение:** IMAP сохраняет mailbox на сервере и позволяет клиенту получить/кэшировать копии, синхронизируя изменения. Поэтому выбираем вариант с сохранением оригинала. TCP 110 относится к POP3; отправку новых писем обычно выполняет SMTP, не IMAP.

**Explanation in English:** IMAP retains the mailbox on the server while clients retrieve/cache copies and synchronize changes, matching the original-preserving option. TCP 110 belongs to POP3; SMTP normally submits new mail rather than IMAP.

### E392. True or false? HTTP is a secure protocol.

Источник: модули_15, Q5. Тема: модуль 15.

1. True
2. False

**Ответ:** False.

**Объяснение:** False: обычный HTTP не шифрует обмен и не защищает его от чтения по пути. HTTPS добавляет TLS. Это различие протоколов, а не обещание, что любой сайт с HTTPS добросовестен.

**Explanation in English:** False: plain HTTP does not encrypt traffic against interception. HTTPS adds TLS. This protocol distinction does not mean every HTTPS website is trustworthy.

### E393. Which of the following DNS record types is used to resolve IPv6 addresses?

Источник: модули_15, Q1. Тема: модуль 15.

1. A
2. NS
3. AAAA
4. MX

**Ответ:** AAAA.

**Объяснение:** AAAA хранит IPv6-адрес для имени. A предназначен для IPv4, NS указывает authoritative name server, MX — mail exchanger. Количество A в названии помогает отличить семейство адреса, но не число возвращаемых ответов.

**Explanation in English:** AAAA maps a name to IPv6. A maps to IPv4, NS names authoritative DNS servers and MX identifies mail exchangers. The record type specifies address family, not how many answers are returned.

### E394. True or false? A DNS server that receives a request for a name resolution that is not within its DNS zone will send a failure message to the requesting client.

Источник: модули_15, Q2. Тема: модуль 15.

1. True
2. False

**Ответ:** False.

**Объяснение:** False: отсутствие имени в своей зоне не означает немедленный отказ. DNS-сервер может использовать кэш, переслать запрос/выполнить рекурсию или дать referral; итоговая ошибка возможна, если разрешение действительно не удалось.

**Explanation in English:** False: an out-of-zone name does not require immediate failure. A server may use cache, forward/recurse or provide a referral; an error is possible only if resolution actually fails or policy disallows it.

### E395. Which of the following is displayed by the nslookup utility?

Источник: модули_15, Q3. Тема: модуль 15.

1. The configured default DNS server
2. The IP address of the end device
3. All cached DNS entries

**Ответ:** The configured default DNS server.

**Объяснение:** nslookup показывает используемый default DNS server и результаты запросов к нему. Адрес самого клиента смотрят через ipconfig; все локально закэшированные DNS-записи — через ipconfig /displaydns. Это разные источники диагностики.

**Explanation in English:** nslookup identifies the default DNS server it uses and query results. ipconfig shows the client’s configuration; ipconfig /displaydns shows the local DNS cache. They inspect different things.

### E396. Which of the following DNS resource record types resolves authoritative name servers?

Источник: модули_15, Q4. Тема: модуль 15.

1. NS
2. A
3. MX
4. AAAA

**Ответ:** NS.

**Объяснение:** NS-запись указывает имя сервера, авторитетного для зоны. A/AAAA дают адреса host, а MX выбирает почтовый сервер. Адрес NS-сервера может дополнительно разрешаться A/AAAA, но его роль описывает именно NS.

**Explanation in English:** An NS record names an authoritative server for a zone. A/AAAA map host addresses and MX selects mail exchangers. The NS server’s address may separately resolve through A/AAAA, but NS identifies its authoritative role.

### E397. How many connections are required by FTP between client and server?

Источник: модули_15, Q1. Тема: модуль 15.

1. 1
2. 2
3. 3
4. 4

**Ответ:** 2.

**Объяснение:** FTP разделяет управление и данные: одна TCP control connection переносит команды/ответы, отдельная data connection — файл или список каталога. Поэтому ожидаются 2 соединения при передаче; это не одна универсальная connection для обоих потоков.

**Explanation in English:** FTP separates control from data: one TCP connection carries commands/replies and another carries a file or directory listing. A transfer therefore uses two connections, not one combined channel.

### E398. True or false? FTP data transfers take place from client to server (push) and from server to client (pull).

Источник: модули_15, Q2. Тема: модуль 15.

1. True
2. False

**Ответ:** True.

**Объяснение:** True: FTP поддерживает upload (client→server, push) и download (server→client, pull). Роль client определяется тем, кто инициирует сервисный запрос, а не направлением байтов конкретного файла.

**Explanation in English:** True: FTP supports uploads (client→server, push) and downloads (server→client, pull). Client role is determined by initiating service requests, not by the direction of a particular file’s bytes.

### E399. Which of these ports are used by FTP? (Choose two.)

Источник: модули_15, Q3. Тема: модуль 15.

1. 20
2. 21
3. 25
4. 110

**Ответ:** 20; 21.

**Объяснение:** TCP 21 — управляющее соединение FTP; TCP 20 — серверный data port классического active FTP. 25 относится к SMTP, 110 — POP3. В passive FTP data connection использует согласованный другой порт, поэтому 20 не обязателен для каждого FTP-сеанса.

**Explanation in English:** TCP 21 is FTP control; TCP 20 is the server data port in classic active FTP. 25 is SMTP and 110 POP3. Passive FTP negotiates another data port, so port 20 is not used by every FTP session.

### E400. True or false? Resource sharing over SMB is only supported on Microsoft operating systems.

Источник: модули_15, Q4. Тема: модуль 15.

1. True
2. False

**Ответ:** False.

**Объяснение:** False: SMB реализован и вне Windows — например, Samba в Linux/Unix, а macOS также поддерживает SMB. Популярность протокола в Microsoft-сетях не делает его эксклюзивным для этой ОС.

**Explanation in English:** False: SMB exists outside Windows, including Samba on Linux/Unix and SMB support in macOS. Its popularity in Microsoft networks does not make it exclusive to that OS.

### E401. On a home network, which device is most likely to provide dynamic IPv4 addressing to clients on the home network?

Источник: модули_15, Q1. Тема: модуль 15.

1. A dedicated file server
2. A home router
3. An ISP DHCP server
4. A DNS server

**Ответ:** A home router.

**Объяснение:** Домашний роутер обычно содержит DHCP-сервер для внутренней LAN и выдаёт клиентам частные IPv4/маску/gateway/DNS. DHCP провайдера обычно настраивает WAN роутера; DNS-сервер не выдаёт аренды, а выделенный file server для домашней сети не требуется.

**Explanation in English:** A home router commonly runs DHCP for its internal LAN, supplying client IPv4/mask/gateway/DNS. ISP DHCP generally configures the router’s WAN side; DNS does not issue leases and a dedicated home file server is unnecessary.

### E402. What part of the URL, http://www.cisco.com/index.html, represents the top-level DNS domain?

Источник: модули_15, Q2. Тема: модуль 15.

1. .com
2. Www
3. Http
4. Index

**Ответ:** .com.

**Объяснение:** В DNS-имени www.cisco.com самый правый label — com, top-level domain. www — имя узла/поддомен, http — схема URL, index.html — путь к ресурсу; они не являются TLD.

**Explanation in English:** In www.cisco.com, the rightmost DNS label com is the top-level domain. www is a host/subdomain, http the URL scheme and index.html the resource path, not TLDs.

### E403. What are two characteristics of the application layer of the TCP/IP model? (Choose two.)

Источник: модули_15, Q3. Тема: модуль 15.

1. Responsibility for logical addressing
2. Responsibility for physical addressing
3. The creation and maintenance of dialogue between source and destination applications
4. Closest to the end user

**Ответ:** The creation and maintenance of dialogue between source and destination applications; Closest to the end user.

**Объяснение:** TCP/IP Application ближе всего к пользователю и включает OSI Session-функции управления диалогом приложений. Logical IP addressing выполняется Internet layer, physical/MAC addressing — Network access; они не относятся к этим двум характеристикам.

**Explanation in English:** TCP/IP Application is closest to the user and includes OSI Session’s dialog-management functions. Logical IP addressing belongs to Internet and MAC addressing to Network access, not these application characteristics.

### E404. What message type is used by an HTTP client to request data from a web server?

Источник: модули_15, Q4. Тема: модуль 15.

1. GET
2. POST
3. PUT
4. ACK

**Ответ:** GET.

**Объяснение:** GET просит сервер вернуть представление ресурса, например страницу. POST отправляет данные на обработку, PUT задаёт/заменяет ресурс. ACK — флаг/подтверждение TCP, не HTTP-метод.

**Explanation in English:** GET asks for a resource representation such as a page. POST submits data for processing and PUT creates/replaces a resource. ACK is a TCP acknowledgment/flag, not an HTTP method.

### E405. Which protocol can be used to transfer messages from an email server to an email client?

Источник: модули_15, Q5. Тема: модуль 15.

1. SMTP
2. POP3
3. SNMP
4. HTTP

**Ответ:** POP3.

**Объяснение:** POP3 получает сообщения с почтового сервера в клиент. SMTP в базовой модели отправляет/пересылает почту, SNMP управляет устройствами. HTTP может обслуживать webmail, но среди перечисленных именно POP3 — специальный протокол получения mailbox.

**Explanation in English:** POP3 retrieves mail from a mail server into a client. SMTP submits/relays mail and SNMP manages devices. HTTP may serve webmail, but POP3 is the dedicated retrieval protocol among these options.

### E406. Which application layer protocol is used to provide file-sharing and print services to Microsoft applications?

Источник: модули_15, Q6. Тема: модуль 15.

1. HTTP
2. SMTP
3. DHCP
4. SMB

**Ответ:** SMB.

**Объяснение:** SMB предоставляет сетевой доступ к общим файлам и принтерам, поэтому соответствует сценарию Microsoft-приложений. HTTP обслуживает веб, SMTP — почту, DHCP — IP-настройки; они не заменяют SMB-доступ к ресурсам.

**Explanation in English:** SMB provides shared-file and printer access, matching the Microsoft-application scenario. HTTP serves web resources, SMTP email and DHCP IP configuration rather than SMB resource access.

### E407. Which three protocols or standards are used at the application layer of the TCP/IP model? (Choose three.)

Источник: модули_15, Q7. Тема: модуль 15.

1. TCP
2. HTTP
3. MPEG
4. GIF
5. IP
6. UDP

**Ответ:** HTTP; MPEG; GIF.

**Объяснение:** HTTP — прикладной протокол, MPEG/GIF — стандарты представления данных; TCP/IP Application включает также Presentation-функции, поэтому верны все три. TCP/UDP — Transport, IP — Internet. Вопрос намеренно говорит «protocols or standards».

**Explanation in English:** HTTP is an application protocol and MPEG/GIF are representation standards. TCP/IP Application includes Presentation functions, so all three fit. TCP/UDP belong to Transport and IP to Internet. The question explicitly includes “protocols or standards.”

### E408. Why is DHCP for IPv4 preferred for use on large networks?

Источник: модули_15, Q8. Тема: модуль 15.

1. Large networks send more requests for domain to IP address resolution than do smaller networks.
2. DHCP uses a reliable transport layer protocol.
3. It prevents sharing of files that are copyrighted.
4. It is a more efficient way to manage IPv4 addresses than static address assignment is.
5. Hosts on large networks require more IPv4 addressing configuration settings than do hosts on small networks.

**Ответ:** It is a more efficient way to manage IPv4 addresses than static address assignment is..

**Объяснение:** Централизованная выдача и аренда адресов сокращают ручные ошибки и работу при большом числе host, поэтому DHCP эффективнее статической настройки. Причина не в DNS, авторских правах или большем числе настроек у каждого host; DHCPv4 использует UDP, а не надёжный TCP.

**Explanation in English:** Centralized address leasing reduces manual effort and errors across many hosts. This is unrelated to DNS, copyright or more settings per host; DHCPv4 uses UDP rather than reliable TCP.

### E409. An author is uploading one chapter document from a personal computer to a file server of a book publisher. What role is the personal computer assuming in this network model?

Источник: модули_15, Q9. Тема: модуль 15.

1. Client
2. Agent
3. Server
4. Controller
5. Transient

**Ответ:** Client.

**Объяснение:** ПК автора инициирует запрос к файловому сервису издателя, поэтому он client, хотя отправляет данные. Server — сторона, предоставляющая доступ к файлам; направление upload не меняет эти роли.

**Explanation in English:** The author’s PC initiates a request to the publisher’s file service, so it is the client even while uploading. The server provides the resource; upload direction does not reverse the roles.

### E410. Which statement is true about FTP?

Источник: модули_15, Q10. Тема: модуль 15.

1. The client can choose if FTP is going to establish one or two connections with the server.
2. The client can download data from or upload data to the server.
3. FTP is a peer-to-peer application.
4. FTP does not provide reliability during data transmission.

**Ответ:** The client can download data from or upload data to the server..

**Объяснение:** FTP умеет upload и download, поэтому клиент может передавать файл в обе стороны. Это client/server, а не P2P. Control и data разделяются протоколом, не произвольным выбором «одно или два»; TCP обеспечивает надёжную доставку.

**Explanation in English:** FTP supports both upload and download. It is client/server, not P2P. Control and data are separate protocol channels, not an arbitrary client choice of one/two, and TCP supplies reliable transport.

### E411. A wireless host needs to request an IPv4 address. What protocol would be used to process the request?

Источник: модули_15, Q11. Тема: модуль 15.

1. FTP
2. HTTP
3. DHCP
4. ICMP
5. SNMP

**Ответ:** DHCP.

**Объяснение:** Запрос автоматической IPv4-конфигурации обслуживает DHCP независимо от того, Wi‑Fi это или провод. FTP/HTTP переносят прикладные данные, ICMP диагностирует IP, SNMP управляет устройствами — адресную аренду они не выдают.

**Explanation in English:** DHCP handles automatic IPv4 configuration on both wireless and wired links. FTP/HTTP transfer application data, ICMP provides IP diagnostics and SNMP manages devices; none assigns the requested lease.

### E412. Which TCP/IP model layer is closest to the end user?

Источник: модули_15, Q12. Тема: модуль 15.

1. Application
2. Internet
3. Network access
4. Transport

**Ответ:** Application.

**Объяснение:** Application — верхний TCP/IP уровень, предоставляющий приложениям сетевые сервисы. Transport обслуживает доставку, Internet — маршрутизацию, Network access — локальный канал; они ниже и дальше от пользовательских функций.

**Explanation in English:** Application is the top TCP/IP layer exposing network services to applications. Transport handles delivery, Internet routing and Network access the local link; those are lower-level functions.

### E413. When retrieving email messages, which protocol allows for easy, centralized storage and backup of emails that would be desirable for a small- to medium-sized business?

Источник: модули_15, Q13. Тема: модуль 15.

1. IMAP
2. POP
3. SMTP
4. HTTPS

**Ответ:** IMAP.

**Объяснение:** IMAP хранит и синхронизирует mailbox на сервере, что облегчает централизованный backup и работу с нескольких устройств. POP ориентирован на скачивание в клиент, SMTP — на отправку. HTTPS защищает веб, но сам по себе не задаёт серверную модель mailbox.

**Explanation in English:** IMAP keeps and synchronizes the mailbox on the server, supporting central backups and multiple devices. POP is download-oriented and SMTP handles submission. HTTPS protects web traffic but does not itself define mailbox storage/synchronization.

### E414. Which protocol uses encryption?

Источник: модули_15, Q14. Тема: модуль 15.

1. DHCP
2. DNS
3. FTP
4. HTTPS

**Ответ:** HTTPS.

**Объяснение:** HTTPS добавляет TLS к HTTP и шифрует веб-обмен. Обычные DHCP, DNS и FTP в базовых вариантах не обеспечивают такого шифрования; защищённые расширения DNS/FTP — отдельные варианты, не указанные здесь.

**Explanation in English:** HTTPS adds TLS encryption to HTTP. Basic DHCP, DNS and FTP do not provide that encryption; secured DNS/FTP variants are distinct alternatives not named here.

### E415. Which two tasks can be performed by a local DNS server? (Choose two.)

Источник: модули_15, Q15. Тема: модуль 15.

1. Providing IP addresses to local hosts
2. Allowing data transfer between two network devices
3. Mapping name-to-IP addresses for internal hosts
4. Forwarding name resolution requests between servers
5. Retrieving email messages

**Ответ:** Mapping name-to-IP addresses for internal hosts; Forwarding name resolution requests between servers.

**Объяснение:** Локальный DNS хранит записи внутренних имён и может пересылать запросы другим DNS-серверам, когда сам не может ответить. Выдача IP-аренд — DHCP, получение почты — POP/IMAP; общий перенос данных не является этим специализированным сервисом DNS.

**Explanation in English:** Local DNS can map internal host names and forward unresolved queries to other DNS servers. DHCP assigns leases, POP/IMAP retrieve email, and general data transfer is not the DNS service described.

### E455. What are two forms of software programs or processes that provide access to the network? (Choose two.)

Источник: модули_17, Q1. Тема: модуль 15.

1. Antivirus software
2. Application layer services
3. Gaming software
4. Network applications
5. Productivity software
6. Virtual machine software

**Ответ:** Application layer services; Network applications.

**Объяснение:** Курс различает network applications (например браузер с сетевыми функциями) и application-layer services (фоновые службы вроде разрешения имён), которые помогают приложениям обращаться в сеть. Gaming/productivity/antivirus/VM — категории программ: они могут использовать сеть, но не являются двумя базовыми формами доступа в этой классификации.

**Explanation in English:** The course distinguishes network applications, such as browsers, and application-layer services, such as background name resolution. Gaming/productivity/antivirus/VM are software categories that may use networking, not the two access forms in this classification.

### E472. Which process failed if a computer cannot access the internet and received an IP address of 169.254.142.5?

Источник: модули_17, Q9. Тема: модуль 15.

1. IP
2. DNS
3. DHCP
4. HTTP

**Ответ:** DHCP.

**Объяснение:** 169.254.142.5 — IPv4 link-local/APIPA. В стандартном Windows-сценарии автоматической настройки он появляется, когда DHCP-аренда не получена. Это указывает на сбой процесса DHCP, а не обязательно самого сервера; DNS/HTTP не назначают этот адрес.

**Explanation in English:** 169.254.142.5 is IPv4 link-local/APIPA. In the usual Windows automatic-configuration scenario it appears when no DHCP lease is obtained. It indicates failed DHCP acquisition, not necessarily a broken server; DNS/HTTP do not assign this address.

### E534. What three application layer protocols are part of the TCP/IP protocol suite? (Choose three.)

Источник: тесты_exam_0, Q23. Тема: модуль 15.

1. ARP
2. DHCP
3. DNS
4. FTP
5. NAT
6. PPP

**Ответ:** DHCP; DNS; FTP.

**Объяснение:** DHCP, DNS и FTP предоставляют host-настройку, имена и файлы — application services. ARP разрешает локальные IPv4→MAC, PPP относится к канальному уровню, NAT — механизм преобразования адресов, не прикладной протокол в этом списке.

**Explanation in English:** DHCP, DNS and FTP provide host configuration, name resolution and file transfer: application services. ARP resolves local IPv4-to-MAC, PPP is link-layer and NAT is address translation rather than an application protocol here.

### E536. A web client is receiving a response for a web page from a web server. From the perspective of the client, what is the correct order of the protocol stack that is used to decode the received transmission?

Источник: тесты_exam_0, Q25. Тема: модуль 15.

1. Ethernet, IP, TCP, HTTP
2. HTTP, TCP, IP, Ethernet
3. Ethernet, TCP, IP, HTTP
4. HTTP, Ethernet, IP, TCP

**Ответ:** Ethernet, IP, TCP, HTTP.

**Объяснение:** При получении оболочки снимаются снизу вверх: сначала Ethernet, затем IP, затем TCP, после чего HTTP-ответ передаётся приложению. HTTP→TCP→IP→Ethernet описывает отправку, а перестановка TCP/IP нарушает вложенность.

**Explanation in English:** Reception removes encapsulation bottom-up: Ethernet, IP, TCP, then the HTTP response reaches the application. HTTP→TCP→IP→Ethernet describes sending; swapping IP and TCP breaks their nesting.

### E615. Which three statements characterize UDP? (Choose three.)

Источник: тесты_exam_4, Q4. Тема: модуль 15.

1. UDP provides basic connectionless transport layer functions.
2. UDP provides connection-oriented, fast transport of data at Layer 3.
3. UDP relies on application layer protocols for error detection.
4. UDP is a low overhead protocol that does not provide sequencing or flow control mechanisms.
5. UDP relies on IP for error detection and recovery.
6. UDP provides sophisticated flow control mechanisms.

> Нельзя выбрать три корректных варианта: UDP имеет checksum; карточка сохранена для разбора ошибки формулировки.

**Ответ:** UDP — connectionless; имеет небольшие накладные расходы; не обеспечивает sequencing/flow control. Утверждение об исключительно прикладном error detection неточно: у UDP есть checksum.

**Объяснение:** Варианты не содержат трёх полностью верных утверждений. Однозначно верны connectionless transport и low overhead without sequencing/flow control. UDP имеет checksum, поэтому «полагается на application для error detection» буквально неверно; восстановление/повторы действительно может реализовать приложение. IP также не гарантирует recovery. Карточка не оценивается.

**Explanation in English:** The options do not contain three fully correct claims. Connectionless transport and low overhead without sequencing/flow control are correct. UDP has a checksum, so relying exclusively on applications for error detection is false as written; applications may implement recovery/retries. IP also does not guarantee recovery. This card is not scored.

### E618. Which protocol or service uses UDP for a client-to-server communication and TCP for server-to-server communication?

Источник: тесты_exam_4, Q7. Тема: модуль 15.

1. HTTP
2. FTP
3. DNS
4. SMTP

**Ответ:** DNS.

**Объяснение:** DNS часто использует UDP 53 для обычного client query и TCP 53 для zone transfer между серверами. HTTP/FTP/SMTP в базовой модели используют TCP. Уточнение: DNS-клиенты тоже могут использовать TCP; правило «UDP только clients, TCP только servers» не абсолютное.

**Explanation in English:** DNS commonly uses UDP 53 for ordinary client queries and TCP 53 for server zone transfers. Basic HTTP/FTP/SMTP use TCP. DNS clients can also use TCP, so “UDP only for clients, TCP only for servers” is not an absolute rule.

### E623. Why does HTTP use TCP as the transport layer protocol?

Источник: тесты_exam_4, Q12. Тема: модуль 15.

1. to ensure the fastest possible download speed
2. because HTTP is a best-effort protocol
3. because transmission errors can be tolerated easily
4. because HTTP requires reliable delivery

**Ответ:** because HTTP requires reliable delivery.

**Объяснение:** Для HTTP/1.1 и HTTP/2 TCP обеспечивает упорядоченный поток и повтор потерянных байтов, чтобы страница пришла целиком. Это не гарантия максимальной скорости и не готовность игнорировать ошибки. Современный HTTP/3 использует QUIC/UDP; вопрос относится к классической TCP-модели курса.

**Explanation in English:** For HTTP/1.1 and HTTP/2, TCP supplies an ordered stream and retransmits lost bytes so the resource arrives intact. It does not guarantee maximum speed or tolerate missing data. HTTP/3 uses QUIC/UDP; this question assumes the course’s classic TCP model.

### E626. What do the client/server and peer-to-peer network models have in common?

Источник: тесты_exam_4, Q15. Тема: модуль 15.

1. Both models have dedicated servers.
2. Both models support devices in server and client roles.
3. Both models require the use of TCP/IP-based protocols.
4. Both models are used only in the wired network environment.

**Ответ:** Both models support devices in server and client roles..

**Объяснение:** В обоих моделях есть роли client (запрашивает) и server (предоставляет). Разница в распределении: P2P позволяет одному узлу выполнять обе роли и не требует выделенного сервера. Модели не определяются проводной средой или обязательным конкретным набором протоколов.

**Explanation in English:** Both models have client/requester and server/provider roles. P2P lets a node take both roles without requiring a dedicated server. The models are not defined by wired media or one mandatory protocol suite.

### E627. What is an example of network communication that uses the client-server model?

Источник: тесты_exam_4, Q16. Тема: модуль 15.

1. A user uses eMule to download a file that is shared by a friend after the file location is determined.
2. A workstation initiates an ARP to find the MAC address of a receiving host.
3. A user prints a document by using a printer that is attached to a workstation of a coworker.
4. A workstation initiates a DNS request when the user types www.cisco.com in the address bar of a web browser.

**Ответ:** A workstation initiates a DNS request when the user types www.cisco.com in the address bar of a web browser..

**Объяснение:** DNS-запрос от workstation к DNS-server — явный client/server обмен: клиент спрашивает, сервер отвечает по своей службе имён. eMule и общий принтер coworker-PC — примеры P2P в курсе; ARP — механизм разрешения соседнего адреса, не этот прикладной сценарий.

**Explanation in English:** A workstation querying a DNS server is explicit client/server communication: a client requests the naming service. eMule and a coworker-PC shared printer are course P2P examples; ARP is neighbor address resolution rather than this application scenario.

### E628. Which networking model is being used when an author uploads one chapter document to a file server of a book publisher?

Источник: тесты_exam_4, Q17. Тема: модуль 15.

1. peer-to-peer
2. master-slave
3. client/server
4. point-to-point

**Ответ:** client/server.

**Объяснение:** ПК обращается к файловой службе выделенного file server, поэтому схема client/server. Upload не делает ПК сервером: он остаётся инициатором запроса. Point-to-point описывает связь/топологию, а не распределение этих прикладных ролей.

**Explanation in English:** The PC accesses a file server’s service, making this client/server. Uploading does not make the PC the server; it still initiates the request. Point-to-point describes connectivity/topology, not these application roles.

### E629. What are two characteristics of peer-to-peer networks? (Choose two.)

Источник: тесты_exam_4, Q18. Тема: модуль 15.

1. scalability
2. one way data flow
3. decentralized resources
4. centralized user accounts
5. resource sharing without a dedicated server

**Ответ:** decentralized resources; resource sharing without a dedicated server.

**Объяснение:** P2P распределяет ресурсы между peers и позволяет sharing без выделенного server. Централизованные user accounts не обязательны; обмен не односторонний. Простые P2P-сети обычно сложнее администрировать при росте, поэтому scalability не является ожидаемым преимуществом здесь.

**Explanation in English:** P2P distributes resources among peers and allows sharing without a dedicated server. Centralized accounts are not required and traffic is not one-way. Basic P2P networks become harder to administer at scale, so scalability is not the intended advantage.

### E630. What type of information is contained in a DNS MX record?

Источник: тесты_exam_4, Q19. Тема: модуль 15.

1. the FQDN of the alias used to identify a service
2. the IP address for an FQDN entry
3. the domain name mapped to mail exchange servers
4. the IP address of an authoritative name server

**Ответ:** the domain name mapped to mail exchange servers.

**Объяснение:** MX связывает домен с именами mail exchange servers, которым следует доставлять почту. Это не прямое IP-соответствие (A/AAAA) и не alias (CNAME). IP почтового сервера затем разрешается отдельным DNS-запросом.

**Explanation in English:** MX associates a domain with mail-exchanger hostnames for mail delivery. It is not a direct IP mapping (A/AAAA) or alias (CNAME). The mail server’s IP can then be resolved separately.

### E631. In what networking model would eDonkey, eMule, BitTorrent, Bitcoin, and LionShare be used?

Источник: тесты_exam_4, Q20. Тема: модуль 15.

1. peer-to-peer
2. client-based
3. master-slave
4. point-to-point

**Ответ:** peer-to-peer.

**Объяснение:** Эти примеры используют peer-to-peer обмен: участники могут получать и предоставлять ресурсы/данные друг другу. Наличие вспомогательного индекса или tracker не превращает сами peer transfers в master-slave или point-to-point модель.

**Explanation in English:** These examples use peer-to-peer exchange, with participants receiving and supplying resources/data. A supporting index or tracker does not turn peer transfers into a master-slave or point-to-point application model.

### E632. Which applications or services allow hosts to act as client and server at the same time?

Источник: тесты_exam_4, Q21. Тема: модуль 15.

1. client/server applications
2. email applications
3. P2P applications
4. authentication services

**Ответ:** P2P applications.

**Объяснение:** P2P-приложение может одновременно запрашивать чужие ресурсы и отдавать свои: один host выполняет client и server роли. Email/authentication сами по себе не означают такую архитектуру, а классический client/server разделяет роли сервиса.

**Explanation in English:** A P2P application can request remote resources while serving its own, so one host acts as client and server. Email/authentication do not inherently imply that architecture; classic client/server separates service roles.

### E633. What is the function of the HTTP GET message?

Источник: тесты_exam_4, Q22. Тема: модуль 15.

1. to request an HTML page from a web server
2. to send error information from a web server to a web client
3. to upload content to a web server from a web client
4. to retrieve client email from an email server using TCP port 110

**Ответ:** to request an HTML page from a web server.

**Объяснение:** HTTP GET запрашивает представление ресурса, например HTML-страницу. Upload обычно использует POST/PUT; сообщение ошибки — ответ сервера со status code, а почта через TCP 110 относится к POP3.

**Explanation in English:** HTTP GET requests a resource representation such as an HTML page. Uploads use POST/PUT; errors are server responses with status codes, while mail on TCP 110 is POP3.

### E636. Which application layer protocol uses message types such as GET, PUT, and POST?

Источник: тесты_exam_4, Q25. Тема: модуль 15.

1. DNS
2. DHCP
3. SMTP
4. HTTP
5. POP3

**Ответ:** HTTP.

**Объяснение:** GET, PUT и POST — имена методов HTTP: получить, создать/заменить и отправить на обработку. DNS, DHCP, SMTP и POP3 имеют другие форматы команд/сообщений, поэтому не подходят.

**Explanation in English:** GET, PUT and POST are HTTP method names for retrieval, creation/replacement and submission. DNS, DHCP, SMTP and POP3 use different message/command formats.

### E637. What is an advantage of SMB over FTP?

Источник: тесты_exam_4, Q26. Тема: модуль 15.

1. Only with SMB can data transfers occur in both directions.
2. Only SMB establishes two simultaneous connections with the client, making the data transfer faster.
3. SMB is more reliable than FTP because SMB uses TCP and FTP uses UDP.
4. SMB clients can establish a long-term connection to the server.

**Ответ:** SMB clients can establish a long-term connection to the server..

**Объяснение:** SMB поддерживает длительный сеанс доступа к файлам/принтерам как к общим ресурсам, что и подчёркивает курс. FTP тоже передаёт в обе стороны и использует TCP, поэтому противопоставление ему UDP/ненадёжности неверно. Именно FTP разделяет control/data connections; это не особая причина большей скорости SMB.

**Explanation in English:** SMB supports a persistent session for shared file/printer access, the feature emphasized by the course. FTP also transfers both ways and uses TCP, so calling it UDP/unreliable is false. FTP has separate control/data connections; that is not SMB’s special speed advantage.

### E638. Which protocol is used by a client to communicate securely with a web server?

Источник: тесты_exam_4, Q27. Тема: модуль 15.

1. SMTP
2. SMB
3. IMAP
4. HTTPS

**Ответ:** HTTPS.

**Объяснение:** HTTPS — HTTP поверх TLS для защищённого веб-обмена. SMTP/IMAP относятся к почте, SMB — к общим файлам; они не заменяют web-протокол HTTPS в этом сценарии.

**Explanation in English:** HTTPS is HTTP protected by TLS for secure web exchange. SMTP/IMAP handle email and SMB file sharing, rather than this web protocol.

### E639. The application layer of the TCP/IP model performs the functions of what three layers of the OSI model? (Choose three.)

Источник: тесты_exam_4, Q28. Тема: модуль 15.

1. physical
2. session
3. network
4. presentation
5. data link
6. transport
7. application

**Ответ:** session; presentation; application.

**Объяснение:** Application TCP/IP включает три верхних OSI-слоя: Session управляет диалогом, Presentation форматом/кодированием, Application прикладным сервисом. Physical/Data link находятся в Network access, Network в Internet, Transport отдельно.

**Explanation in English:** TCP/IP Application includes OSI Session dialog management, Presentation representation/encoding and Application services. Physical/Data link map to Network access, Network to Internet and Transport remains separate.

### E640. Which three layers of the OSI model provide similar network services to those provided by the application layer of the TCP/IP model? (Choose three.)

Источник: тесты_exam_4, Q29. Тема: модуль 15.

1. physical layer
2. session layer
3. transport layer
4. application layer
5. presentation layer
6. data link layer

**Ответ:** session layer; application layer; presentation layer.

**Объяснение:** Нужны Session, Application и Presentation: TCP/IP объединяет их функции в один верхний уровень. Transport доставляет данные между процессами и не входит в эту тройку; Physical/Data link обслуживают канал и сигналы.

**Explanation in English:** Session, Application and Presentation map to the single TCP/IP application layer. Transport delivers data between processes and is outside this trio; Physical/Data link handle signals and the link.

### E670. An employee complains that a Windows PC cannot connect to the Internet. A network technician issues the ipconfig command on the PC and is shown an IP address of 169.254.10.3. Which two conclusions can be drawn? (Choose two.)

Источник: тесты_exam_5, Q27. Тема: модуль 15.

1. The PC cannot contact a DHCP server.
2. The DNS server address is misconfigured.
3. The default gateway address is not configured.
4. The PC is configured to obtain an IP address automatically.
5. The enterprise network is misconfigured for dynamic routing.

**Ответ:** The PC cannot contact a DHCP server.; The PC is configured to obtain an IP address automatically..

**Объяснение:** В типичном сценарии Windows адрес 169.254.10.3 — автоматически выбранный APIPA после неудачного получения DHCP-аренды. Поэтому ожидаются auto-address configuration и отсутствие успешного контакта DHCP. По одному этому адресу нельзя установить неправильный DNS или enterprise dynamic routing. Вручную назначенный 169.254 адрес был бы другим сценарием.

**Explanation in English:** In the usual Windows scenario, 169.254.10.3 is automatically selected APIPA after DHCP acquisition fails. Thus automatic configuration and unsuccessful DHCP contact are the expected conclusions. The address alone cannot prove DNS or enterprise routing misconfiguration; manual assignment would be a different scenario.

### E686. Which three layers of the OSI model are comparable in function to the application layer of the TCP/IP model? (Choose three.)

Источник: тесты_exam_6, Q8. Тема: модуль 15.

1. application
2. presentation
3. session
4. transport
5. data link
6. physical
7. network

**Ответ:** application; presentation; session.

**Объяснение:** В TCP/IP верхний Application охватывает OSI 7/6/5: Application, Presentation, Session. Не выбирай Transport только потому, что он тоже обслуживает приложения: он отдельно обеспечивает общую доставку и порты.

**Explanation in English:** TCP/IP Application covers OSI layers 7/6/5: Application, Presentation and Session. Transport also serves applications but remains separate, providing common delivery and ports.

### E720. What service is provided by POP3?

Источник: тесты_exam_6, Q42. Тема: модуль 15.

1. Retrieves email from the server by downloading the email to the local mail application of the client.
2. Allows remote access to network devices and servers.
3. Uses encryption to provide secure remote access to network devices and servers.
4. An application that allows real-time chatting among remote users.

**Ответ:** Retrieves email from the server by downloading the email to the local mail application of the client..

**Объяснение:** POP3 загружает сообщения из mailbox сервера в почтовый клиент. Удалённый доступ к устройствам — Telnet/SSH, realtime chat — другие приложения. POP3 не является протоколом управления сетевым оборудованием.

**Explanation in English:** POP3 downloads messages from a server mailbox to a mail client. Device remote access belongs to Telnet/SSH and real-time chat to other applications; POP3 does not manage network equipment.

### E721. Two students are working on a network design project. One student is doing the drawing, while the other student is writing the proposal. The drawing is finished and the student wants to share the folder that contains the drawing so that the other student can access the file and copy it to a USB drive. Which networking model is being used?

Источник: тесты_exam_6, Q43. Тема: модуль 15.

1. peer-to-peer
2. client-based
3. master-slave
4. point-to-point

**Ответ:** peer-to-peer.

**Объяснение:** Один обычный студенческий ПК предоставляет общую папку другому без выделенного file server — P2P-сеть в классификации курса. Первый ПК временно выступает server, второй client; будущая копия на USB не меняет модель сетевого обмена.

**Explanation in English:** One ordinary student PC shares a folder with another without a dedicated file server, the course’s P2P model. The first acts as server and the second as client; later copying to USB does not change that network model.

### E722. Which command is used to manually query a DNS server to resolve a specific host name?

Источник: тесты_exam_6, Q44. Тема: модуль 15.

1. nslookup
2. ipconfig /displaydns
3. tracert
4. net

**Ответ:** nslookup.

**Объяснение:** nslookup явно посылает запрос DNS-серверу для указанного имени. ipconfig /displaydns лишь выводит локальный кэш; tracert исследует путь по hops, net — набор команд сетевых ресурсов, не требуемая DNS-утилита.

**Explanation in English:** nslookup explicitly queries a DNS server for a hostname. ipconfig /displaydns only displays local cache, tracert examines hops and net is a network-resource command family rather than the required DNS tool.

### E760. Match the application protocols to the correct transport protocols. FTP TCP HTTP SMTP DHCP UDP TFTP

Источник: тесты_exam_7, Q27. Тема: модуль 15.



> Ответ

**Ответ:** TCP → FTP, HTTP, SMTP; UDP → DHCP, TFTP.

**Объяснение:** В базовой модели FTP, HTTP/1.x/2 и SMTP используют TCP для упорядоченного потока; DHCPv4 и TFTP используют UDP. TFTP реализует нужные подтверждения на прикладном уровне, не превращаясь в TCP. HTTP/3 — современное исключение с QUIC/UDP, поэтому уточняем версию HTTP.

**Explanation in English:** In the basic model, FTP, HTTP/1.x/2 and SMTP use TCP streams; DHCPv4 and TFTP use UDP. TFTP supplies its own needed acknowledgments without becoming TCP. HTTP/3 is a modern QUIC/UDP exception, so the HTTP version matters.

### E772. A wired laser printer is attached to a home computer. That printer has been shared so that other computers on the home network can also use the printer. What networking model is in use?

Источник: тесты_exam_7, Q39. Тема: модуль 15.

1. peer-to-peer (P2P)
2. client-based
3. master-slave
4. point-to-point

**Ответ:** peer-to-peer (P2P).

**Объяснение:** Принтер подключён к обычному домашнему ПК, который делится ресурсом с peers без выделенного print server — это P2P-сеть. ПК-хозяин всё равно выполняет server роль для печати; P2P не означает полного отсутствия серверных функций.

**Explanation in English:** The printer is shared by an ordinary home PC without a dedicated print server, making this a P2P network. The owning PC still serves print requests; P2P does not eliminate server functions.

### E776. What is an advantage for small organizations of adopting IMAP instead of POP?

Источник: тесты_exam_7, Q43. Тема: модуль 15.

1. Messages are kept in the mail servers until they are manually deleted from the email client.
2. When the user connects to a POP server, copies of the messages are kept in the mail server for a short time, but IMAP keeps them for a long time.
3. IMAP sends and retrieves email, but POP only retrieves email.
4. POP only allows the client to store messages in a centralized way, while IMAP allows distributed storage.

**Ответ:** Messages are kept in the mail servers until they are manually deleted from the email client..

**Объяснение:** IMAP сохраняет сообщения и папки на сервере и синхронизирует действия клиентов, облегчая работу с нескольких устройств. Отправку выполняет SMTP, не IMAP. POP может оставлять серверные копии по настройке, поэтому преимущество IMAP — серверная синхронизация, а не магический фиксированный срок хранения.

**Explanation in English:** IMAP retains server-side messages/folders and synchronizes client actions, aiding multiple-device access. SMTP sends mail, not IMAP. POP can optionally leave server copies, so IMAP’s advantage is server synchronization rather than an arbitrary fixed retention period.

### E778. Which three layers of the OSI model map to the application layer of the TCP/IP model? (Choose three.)

Источник: тесты_exam_7, Q45. Тема: модуль 15.

1. application
2. presentation
3. session
4. data link
5. transport
6. network

**Ответ:** application; presentation; session.

**Объяснение:** Application, Presentation и Session соответствуют TCP/IP Application: сервис, представление данных и диалог. Data link, Network и Transport остаются ниже и обслуживают передачу, а не эту верхнюю группу функций.

**Explanation in English:** Application, Presentation and Session map to TCP/IP Application: service, representation and dialog. Data link, Network and Transport remain lower-layer delivery functions.

### E784. Which two protocols operate at the top layer of the TCP/IP protocol suite? (Choose two.)

Источник: тесты_exam_7, Q51. Тема: модуль 15.

1. DNS
2. Ethernet
3. IP
4. POP
5. TCP
6. UDP

**Ответ:** DNS; POP.

**Объяснение:** DNS и POP — прикладные сервисы разрешения имён и получения почты. Ethernet находится на Network access, IP — Internet, TCP/UDP — Transport; значит верхний слой TCP/IP представляет именно DNS/POP.

**Explanation in English:** DNS and POP are application services for naming and email retrieval. Ethernet is Network access, IP Internet and TCP/UDP Transport, leaving DNS/POP at the top TCP/IP layer.

### E790. A client packet is received by a server. The packet has a destination port number of 67. What service is the client requesting?

Источник: тесты_exam_7, Q57. Тема: модуль 15.

1. DHCP
2. FTP
3. SSH
4. Telnet

**Ответ:** DHCP.

**Объяснение:** UDP destination 67 — серверная сторона DHCPv4, принимающая запросы клиентов; клиентская сторона использует 68. FTP control — TCP 21, SSH 22, Telnet 23. Сам порт лишь указывает ожидаемую службу, но в учебном вопросе этого достаточно для DHCP.

**Explanation in English:** UDP destination 67 identifies the DHCPv4 server; clients use 68. FTP control is TCP 21, SSH 22 and Telnet 23. A port suggests the expected service, which is sufficient to identify DHCP in this exercise.

### E791. What service is provided by HTTPS?

Источник: тесты_exam_7, Q58. Тема: модуль 15.

1. Uses encryption to secure the exchange of text, graphic images, sound, and video on the web.
2. Uses encryption to provide secure remote access to network devices and servers.
3. Resolves domain names, such as cisco.com, into IP addresses.
4. Allows remote access to network devices and servers.

**Ответ:** Uses encryption to secure the exchange of text, graphic images, sound, and video on the web..

**Объяснение:** HTTPS защищает HTTP-ресурсы — текст, изображения и другие веб-данные — с помощью TLS. Secure remote device access обычно SSH, name→IP — DNS, а незашифрованный remote access — Telnet; это отдельные службы.

**Explanation in English:** HTTPS protects HTTP resources such as text/images and other web data using TLS. Secure device administration is normally SSH, name-to-IP is DNS and plaintext remote administration Telnet; those are separate services.

### E012. Confidentiality, integrity, and availability are requirements of which of the four basic characteristics of network architecture?

Источник: модули_01, Q2. Тема: модуль 16.

1. Fault tolerance
2. Scalability
3. QoS
4. Security

**Ответ:** Security.

**Объяснение:** Confidentiality ограничивает раскрытие данных, integrity защищает от недопустимого изменения, availability обеспечивает доступ законным пользователям. Это три цели security. Fault tolerance относится к устойчивости к отказам, scalability — росту сети, QoS — приоритетам трафика, а не всей тройке CIA.

**Explanation in English:** Confidentiality limits disclosure, integrity protects against unauthorized alteration, and availability preserves legitimate access. Together these are security goals. Fault tolerance concerns failures, scalability growth and QoS traffic priorities rather than the entire CIA triad.

### E020. Which option describes malicious code running on user devices?

Источник: модули_01, Q1. Тема: модуль 16.

1. Firewall
2. Virus, worm, or Trojan horse
3. Zero-day or Zero-hour
4. Virtual Private Network (VPN)
5. Denial of Service (DoS)

**Ответ:** Virus, worm, or Trojan horse.

**Объяснение:** Virus, worm и Trojan horse — виды вредоносного программного кода на устройствах. Firewall и VPN — защитные средства; zero-day описывает эксплуатацию ещё неизвестной/неисправленной уязвимости, DoS — отказ в обслуживании, который не обязательно требует установленного malware.

**Explanation in English:** Viruses, worms and Trojan horses are types of malicious code running on devices. Firewalls and VPNs are defensive tools; zero-day describes exploitation of an unknown/unpatched flaw, while DoS describes service denial and need not involve installed malware.

### E021. During a routine inspection, a technician discovered that software that was installed on a computer was secretly collecting data about websites that were visited by users of the computer. Which type of threat is affecting this computer?

Источник: модули_01, Q1. Тема: модуль 16.

1. DoS attack
2. Identity theft
3. Spyware
4. Zero-day attack

**Ответ:** Spyware.

**Объяснение:** Программа тайно собирает историю посещения сайтов — это определяющий признак spyware. В условии нет перегрузки сервиса (DoS), использования чужой личности или доказательства неизвестной уязвимости (zero-day); следи за действием «secretly collecting data».

**Explanation in English:** Secret collection of browsing activity is the defining clue for spyware. The scenario does not describe service overload (DoS), impersonation or proof of an unknown flaw (zero-day); the key action is secretly collecting user data.

### E033. An employee wants to access the network of the organization remotely, in the safest possible way. What network feature would allow an employee to gain secure remote access to a company network?

Источник: модули_01, Q13. Тема: модуль 16.

1. ACL
2. IPS
3. VPN
4. BYOD

**Ответ:** VPN.

**Объяснение:** VPN создаёт защищённый туннель от удалённого сотрудника до сети организации. ACL фильтрует трафик, IPS обнаруживает/блокирует атаки, BYOD означает использование личных устройств; ни один из них сам не предоставляет требуемый удалённый туннель.

**Explanation in English:** A VPN provides a protected tunnel from the remote employee to the organization. An ACL filters traffic, an IPS detects/blocks attacks, and BYOD means using personal devices; none alone provides the requested remote tunnel.

### E042. Which command enables password authentication for user EXEC mode access on a switch?

Источник: модули_02, Q3. Тема: модуль 16.

1. enable secret
2. login
3. secret
4. service password-encryption

**Ответ:** login.

**Объяснение:** login в режиме настройки линии включает проверку ранее заданного line password при входе в user EXEC. enable secret защищает последующее повышение привилегий, service password-encryption скрывает пароли в конфигурации, а secret без контекста не является требуемой командой входа.

**Explanation in English:** login under line configuration enables checking the previously configured line password on entry to user EXEC. enable secret protects later privilege elevation; service password-encryption obscures configuration passwords; secret alone is not this login command.

### E043. Which command encrypts all plaintext passwords access on a switch?

Источник: модули_02, Q4. Тема: модуль 16.

1. enable secret
2. login
3. secret
4. service password-encryption

**Ответ:** service password-encryption.

**Объяснение:** service password-encryption скрывает поддерживаемые пароли, отображавшиеся открытым текстом в конфигурации. enable secret задаёт один секрет privileged EXEC, а login включает аутентификацию линии. В классическом IOS скрытие Type 7 обратимо и не является сильной защитой или шифрованием сетевого сеанса.

**Explanation in English:** service password-encryption obscures supported passwords previously shown as plaintext in configuration. enable secret sets one privileged EXEC secret and login enables line authentication. Classic IOS Type 7 is reversible obfuscation, not strong secret protection or session encryption.

### E054. A router with a valid operating system contains a configuration file stored in NVRAM. The configuration file has an enable secret password but no console password. When the router boots up, which mode will display?

Источник: модули_02, Q7. Тема: модуль 16.

1. Global configuration mode
2. Setup mode
3. Privileged EXEC mode
4. User EXEC mode

**Ответ:** User EXEC mode.

**Объяснение:** После загрузки существующей конфигурации обычный вход через console приводит в user EXEC (>). Отсутствие console password означает отсутствие этой проверки входа; enable secret понадобится только при команде enable для #. Setup mode ожидался бы при отсутствии startup-config, а не отсутствии console password.

**Explanation in English:** After loading an existing configuration, normal console access enters user EXEC (>). With no console password, that login check is absent; enable secret is needed later when enable requests # access. Setup mode would reflect missing startup-config, not merely a missing console password.

### E416. What kind of threat is described when a threat actor sends you a virus that can reformat your hard drive?

Источник: модули_16, Q1. Тема: модуль 16.

1. Data loss or manipulation
2. Disruption of service
3. Identify theft
4. Information theft

**Ответ:** Data loss or manipulation.

**Объяснение:** Переформатирование диска уничтожает хранящиеся файлы, поэтому главное последствие — data loss/manipulation. Information theft означает копирование/кражу сведений, identity theft — выдачу себя за другого, а disruption of service — недоступность сервиса без обязательного уничтожения данных.

**Explanation in English:** Reformatting the disk destroys stored files, so the principal impact is data loss/manipulation. Information theft steals/copies information, identity theft impersonates someone, and service disruption denies availability without necessarily destroying data.

### E417. What kind of threat is described when a threat actor makes illegal online purchases using stolen credit information?

Источник: модули_16, Q2. Тема: модуль 16.

1. Data loss or manipulation
2. Disruption of service
3. Identify theft
4. Information theft

**Ответ:** Identify theft.

**Объяснение:** Покупки с чужими кредитными данными означают использование чужой личности/платёжной идентичности — identity theft (в варианте опечатка Identify). Кража данных могла произойти раньше, но вопрос описывает уже их использование от чужого имени, не просто information theft.

**Explanation in English:** Purchases using someone else’s credit information misuse that person’s identity/payment identity: identity theft (misspelled Identify in the option). Information theft may have happened earlier, but the described action is impersonation, not merely stealing data.

### E418. What kind of threat is described when a threat actor prevents legal users from accessing data services?

Источник: модули_16, Q3. Тема: модуль 16.

1. Data loss or manipulation
2. Disruption of service
3. Identify theft
4. Information theft

**Ответ:** Disruption of service.

**Объяснение:** Пользователи имеют право на сервис, но не могут его получить: нарушается availability, то есть disruption of service. В условии не сказано, что данные украдены, изменены или кто-то присвоил чужую личность.

**Explanation in English:** Authorized users are prevented from receiving service, violating availability: disruption of service. The scenario does not state that data was stolen/altered or that anyone impersonated another person.

### E419. What kind of threat is described when a threat actor steals scientific research data?

Источник: модули_16, Q4. Тема: модуль 16.

1. Data loss or manipulation
2. Disruption of service
3. Identify theft
4. Information theft

**Ответ:** Information theft.

**Объяснение:** Исследовательские данные украдены — это information theft, нарушение конфиденциальности. Их изменение/уничтожение было бы data manipulation/loss, а использование чужой личности — identity theft. Простая кража не требует отказа сервиса.

**Explanation in English:** Stealing research data is information theft and a confidentiality breach. Altering/destroying it would be manipulation/loss, while impersonation is identity theft. Theft need not disrupt the service.

### E420. What kind of threat is described when a threat actor overloads a network to deny other users network access?

Источник: модули_16, Q5. Тема: модуль 16.

1. Data loss or manipulation
2. Disruption of service
3. Identify theft
4. Information theft

**Ответ:** Disruption of service.

**Объяснение:** Перегрузка сети специально лишает остальных доступа, то есть disruption of service/DoS. Ключевой ущерб — доступность, а не кража документов, изменение записей или использование чужой личности.

**Explanation in English:** Overloading the network to deny others access is disruption of service/DoS. The main harm concerns availability rather than document theft, record alteration or impersonation.

### E421. What kind of threat is described when a threat actor alters data records?

Источник: модули_16, Q6. Тема: модуль 16.

1. Data loss or manipulation
2. Disruption of service
3. Identify theft
4. Information theft

**Ответ:** Data loss or manipulation.

**Объяснение:** Alter data records означает изменить записи, нарушив их целостность: data loss or manipulation. Копирование записей без изменения было бы information theft; перегрузка доступа — service disruption.

**Explanation in English:** Altering data records violates their integrity, so data loss or manipulation is the match. Copying records without changing them would be information theft; denying access through overload would be service disruption.

### E422. What kind of threat is described when a threat actor is stealing the user database of a company?

Источник: модули_16, Q7. Тема: модуль 16.

1. Data loss or manipulation
2. Disruption of service
3. Identify theft
4. Information theft

**Ответ:** Information theft.

**Объяснение:** Кража пользовательской базы — information theft: атакующий получает конфиденциальные сведения. Даже если в базе есть личности пользователей, identity theft требует их использования для выдачи себя за этих людей; это в условии не описано.

**Explanation in English:** Stealing a user database is information theft: the attacker obtains confidential information. Even if it contains identities, identity theft involves using them to impersonate people, which is not stated here.

### E423. What kind of threat is described when a threat actor impersonates another person to obtain credit information about that person?

Источник: модули_16, Q8. Тема: модуль 16.

1. Data loss or manipulation
2. Disruption of service
3. Identify theft
4. Information theft

**Ответ:** Identify theft.

**Объяснение:** Атакующий притворяется другим человеком ради его кредитных сведений — это identity theft. Information theft описывает саму кражу данных, но здесь определяющий признак — impersonates another person. Изменение данных и отказ сервиса не указаны.

**Explanation in English:** The attacker impersonates another person to obtain credit information, making identity theft the match. Information theft describes stealing data, but the defining clue here is impersonation. Neither alteration nor service denial is described.

### E424. Angela, an IT staff member at ACME Inc., notices that communication with the company’s web server is very slow. After investigating, she determines that the cause of the slow response is a computer on the internet sending a very large number of malformed web requests to ACME’S web server. What type of attack is described in this scenario?

Источник: модули_16, Q1. Тема: модуль 16.

1. Access attack
2. Denial of service (DoS) attack
3. Malware attack
4. Reconnaissance attack

**Ответ:** Denial of service (DoS) attack.

**Объяснение:** Очень большое число некорректных web-запросов замедляет сервер для законных пользователей — DoS. Указан один атакующий компьютер, поэтому не требуется называть это распределённой DDoS. Reconnaissance собирало бы сведения; access attack предполагало бы неразрешённый вход, а установка malware не доказана.

**Explanation in English:** A very large volume of malformed web requests slows service for legitimate users: DoS. One attacking computer is specified, so distributed DDoS is not required. Reconnaissance gathers information, access attacks gain unauthorized entry, and installed malware is not established here.

### E425. George needed to share a video with a co-worker. Because of the large size of the video file, he decided to run a simple FTP server on his workstation to serve the video file to his co-worker. To make things easier, George created an account with the simple password of “file” and provided it to his co-worker on Friday. Without the proper security measures or a strong password, the IT staff was not surprised to learn on Monday that George’s workstation had been compromised and was trying to upload work related documents to the internet. What type of attack is described in this scenario?

Источник: модули_16, Q2. Тема: модуль 16.

1. Access attack
2. Denial of service (DoS) attack
3. Malware attack
4. Reconnaissance attack

**Ответ:** Access attack.

**Объяснение:** Слабый FTP-пароль позволил компрометировать рабочую станцию; ключевой шаг — неразрешённый доступ, поэтому access attack. Последующая выгрузка документов — кража данных, возможное последствие этого доступа. Нет описания простого сканирования или перегрузки сервиса.

**Explanation in English:** A weak FTP password led to workstation compromise; the defining step is unauthorized access, hence access attack. Document exfiltration is a possible consequence of that access. The scenario is not merely scanning or overwhelming a service.

### E426. Jeremiah was browsing the internet from his personal computer when a random website offered a free program to clean his system. After the executable was downloaded and running, the operating system crashed. Crucial operating system related files had been corrupted and Jeremiah’s computer required a full disk format and operating system re-installation. What type of attack is described in this scenario?

Источник: модули_16, Q3. Тема: модуль 16.

1. Access attack
2. Denial of service (DoS) attack
3. Malware attack
4. Reconnaissance attack

**Ответ:** Malware attack.

**Объяснение:** После запуска скачанного «очистителя» повреждены системные файлы: вредоносный исполняемый код означает malware attack. Маскировка под полезную программу может быть признаком Trojan, но среди вариантов дана более широкая категория malware. Сканирование и сетевой flood не описаны.

**Explanation in English:** Running the downloaded “cleaner” corrupts system files, identifying a malicious executable and thus a malware attack. Its useful-software disguise may suggest a Trojan, but malware is the offered broader category. Scanning and network flooding are not described.

### E427. Arianna found a flash drive lying on the pavement of a mall parking lot. She asked around but could not find the owner. She decided to keep it and plugged it into her laptop, only to find a photo folder. Feeling curious, Arianna opened a few photos before formatting the flash drive for her own use. Afterwards, Arianna noticed that her laptop camera was active. What type of attack is described in this scenario?

Источник: модули_16, Q4. Тема: модуль 16.

1. Access attack
2. Denial of service (DoS) attack
3. Malware attack
4. Reconnaissance attack

**Ответ:** Malware attack.

**Объяснение:** Учебный сценарий связывает найденный USB и последующий несанкционированный доступ к камере с внедрённым malware. Поэтому выбирается malware attack, а не DoS или reconnaissance. В реальной диагностике сам светодиод камеры не доказывает причину; требуются проверка процессов и устройства.

**Explanation in English:** The exercise links a found USB device with subsequent unauthorized camera activity, pointing to introduced malware. That matches malware attack rather than DoS or reconnaissance. In real diagnosis a camera indicator alone does not prove the cause; processes and device activity need checking.

### E428. A computer is used as a print server for ACME Inc. The IT staff failed to apply security updates to this computer for over 60 days. Now the print server is operating slowly, and sending a high number of malicious packets to its NIC. What type of attack is described in this scenario?

Источник: модули_16, Q5. Тема: модуль 16.

1. Access attack
2. Denial of service (DoS) attack
3. Malware attack
4. Reconnaissance attack

**Ответ:** Denial of service (DoS) attack.

**Объяснение:** В сохранённом сценарии массовые вредоносные пакеты и замедление сервиса трактуются как DoS: ресурс занят и плохо обслуживает законные запросы. Пропущенные обновления повышают уязвимость, но сами не определяют вид атаки. Если пакеты исходят из заражённого сервера, malware может сосуществовать с DoS; формулировка источника неоднозначна.

**Explanation in English:** The saved scenario treats large volumes of malicious packets and service slowdown as DoS: resources are occupied instead of serving legitimate requests. Missed updates increase vulnerability but do not alone identify the attack. If the server emits those packets because it is infected, malware may coexist with DoS; the source wording is ambiguous.

### E429. Sharon, an IT intern at ACME Inc., noticed some strange packets while revising the security logs generated by the firewall. A handful of IP addresses on the internet were sending malformed packets to several different IP addresses, at several different random port numbers inside ACME Inc. What type of attack is described in this scenario?

Источник: модули_16, Q6. Тема: модуль 16.

1. Access attack
2. Denial of service (DoS) attack
3. Malware attack
4. Reconnaissance attack

**Ответ:** Reconnaissance attack.

**Объяснение:** Проверка многих адресов и случайных портов похожа на сканирование для выяснения доступных систем/служб — reconnaissance. В условии нет подтверждённого входа, установки кода или достаточного flood для отказа сервиса. Некорректность пакетов сама по себе не делает атаку DoS.

**Explanation in English:** Probing multiple addresses and random ports suggests scanning to discover systems/services: reconnaissance. Successful access, installed code or enough flooding to deny service is not established. Malformed packets alone do not make an attack DoS.

### E430. Which device controls traffic between two or more networks to help prevent unauthorized access?

Источник: модули_16, Q1. Тема: модуль 16.

1. AAA Server
2. Firewall
3. ESA/WSA
4. IPS

**Ответ:** Firewall.

**Объяснение:** Firewall стоит между сетями и применяет правила разрешения/запрета их обмена. AAA проверяет личности/права администраторов, IPS выявляет и блокирует атаки, ESA/WSA специализируются на почте/вебе. Формулировка про контроль трафика между сетями прямо описывает firewall.

**Explanation in English:** A firewall sits between networks and enforces allow/deny rules on their traffic. AAA verifies identities/permissions, IPS detects/blocks attacks, and ESA/WSA specialize in email/web protection. General traffic control between networks directly describes a firewall.

### E431. Which device is used by other network devices to authenticate and authorize management access?

Источник: модули_16, Q2. Тема: модуль 16.

1. AAA Server
2. Firewall
3. ESA/WSA
4. IPS

**Ответ:** AAA Server.

**Объяснение:** AAA server централизует проверку административной личности и разрешённых действий, поэтому устройства обращаются к нему за authentication/authorization. Firewall и IPS фильтруют/анализируют трафик; ESA/WSA защищают почту и веб, а не являются базой прав управления оборудованием.

**Explanation in English:** An AAA server centralizes administrator identity verification and permitted actions, so devices consult it for authentication/authorization. Firewalls/IPS filter or analyze traffic; ESA/WSA protect mail/web rather than serving as the device-management permissions database.

### E432. Which backup policy consideration is concerned with using strong passwords to protect the backups and for restoring data?

Источник: модули_16, Q3. Тема: модуль 16.

1. Frequency
2. Storage
3. Security
4. Validation

**Ответ:** Security.

**Объяснение:** Сильный пароль защищает backup от неразрешённого восстановления/чтения, поэтому это Security. Frequency определяет расписание, Storage — место хранения, Validation — проверку целостности и успешного восстановления.

**Explanation in English:** A strong password protects a backup against unauthorized reading/restoration, so this is Security. Frequency sets the schedule, Storage determines location, and Validation checks integrity and successful recovery.

### E433. This zone is used to house servers that should be accessible to outside users.

Источник: модули_16, Q4. Тема: модуль 16.

1. Inside
2. Outside
3. Internet
4. DMZ

**Ответ:** DMZ.

**Объяснение:** DMZ — отдельный сегмент для публично доступных серверов с контролируемыми правилами доступа извне и внутрь. Inside — доверенная внутренняя сеть; Outside/Internet — внешняя сторона, а не специально выделенная серверная зона.

**Explanation in English:** A DMZ is a separate segment for externally accessible servers with controlled inbound and internal access. Inside is the internal network; Outside/Internet is the external side, not the dedicated public-server zone.

### E434. Which is appropriate for providing endpoint security?

Источник: модули_16, Q5. Тема: модуль 16.

1. A AAA server
2. Antivirus software
3. A server-based firewall
4. An ESA/WSA

**Ответ:** Antivirus software.

**Объяснение:** Антивирус работает на endpoint и обнаруживает/блокирует вредоносное ПО на самом устройстве — ожидаемый пример в курсе. AAA и ESA/WSA решают централизованные задачи. Host firewall тоже может входить в endpoint protection, но предложенный server-based firewall не является выбранным здесь примером защиты конечного клиента.

**Explanation in English:** Antivirus runs on an endpoint to detect/block malware on that device, the course’s intended example. AAA and ESA/WSA address centralized functions. A host firewall can also contribute to endpoint protection, but the offered server-based firewall is not the selected end-client example.

### E435. Which component is designed to protect against unauthorized communications to and from a computer?

Источник: модули_16, Q1. Тема: модуль 16.

1. Security center
2. Port scanner
3. Antimalware
4. Antivirus
5. Firewall

**Ответ:** Firewall.

**Объяснение:** Firewall контролирует входящие и исходящие сетевые соединения компьютера по правилам. Antivirus/antimalware ищут вредоносный код, port scanner обнаруживает открытые порты, а security center объединяет настройки. Именно фильтрация неразрешённых коммуникаций описывает firewall.

**Explanation in English:** A firewall controls a computer’s inbound/outbound communications using rules. Antivirus/antimalware detect malicious code, a port scanner discovers open ports, and a security center groups settings. Filtering unauthorized communications specifically describes a firewall.

### E436. Which command will block login attempts on RouterA for a period of 30 seconds if there are 2 failed login attempts within 10 seconds?

Источник: модули_16, Q2. Тема: модуль 16.

1. RouterA(config)# login block-for 10 attempts 2 within 30
2. RouterA(config)# login block-for 30 attempts 2 within 10
3. RouterA(config)# login block-for 2 attempts 30 within 10
4. RouterA(config)# login block-for 30 attempts 10 within 2

**Ответ:** RouterA(config)# login block-for 30 attempts 2 within 10.

**Объяснение:** Синтаксис: block-for B — длительность блокировки, attempts N — число неудач, within W — окно наблюдения. Здесь B=30 секунд, N=2, W=10 секунд: login block-for 30 attempts 2 within 10. Остальные варианты переставляют значения и задают другое условие. В курсе речь о блокировании попыток VTY-входа.

**Explanation in English:** Syntax: block-for B is blocking duration, attempts N is the failure threshold, and within W is the observation window. Here B=30 seconds, N=2 and W=10 seconds: login block-for 30 attempts 2 within 10. Other choices swap values. The course describes blocking VTY login attempts.

### E437. What is the purpose of the network security accounting function?

Источник: модули_16, Q3. Тема: модуль 16.

1. To require users to prove who they are
2. To determine which resources a user can access
3. To keep track of the actions of a user
4. To provide challenge and response questions

**Ответ:** To keep track of the actions of a user.

**Объяснение:** Accounting ведёт журнал действий пользователя: когда вошёл, что выполнял и какие ресурсы использовал. Доказать личность — authentication; разрешить определённые ресурсы — authorization. Challenge/response относится к механизму проверки личности, не учёту действий.

**Explanation in English:** Accounting records user activity, such as login times, actions and resource use. Proving identity is authentication; granting access to resources is authorization. Challenge/response is an identity-checking mechanism, not activity accounting.

### E438. What type of attack may involve the use of tools such as nslookup and fping?

Источник: модули_16, Q4. Тема: модуль 16.

1. Access attack
2. Reconnaissance attack
3. Denial of service attack
4. Worm attack

**Ответ:** Reconnaissance attack.

**Объяснение:** nslookup помогает узнавать DNS-имена/адреса, fping — обнаруживать отвечающие узлы. Использование для сбора картины сети соответствует reconnaissance. Инструменты также легитимны для администратора; само их наличие не доказывает атаку, а контекст вопроса задаёт вредоносную разведку.

**Explanation in English:** nslookup discovers DNS names/addresses and fping can identify responsive hosts. Using them to map a network matches reconnaissance. These are also legitimate administration tools; their mere presence does not prove an attack, while the question supplies malicious context.

### E439. Which benefit does SSH offer over Telnet for remotely managing a router?

Источник: модули_16, Q5. Тема: модуль 16.

1. Encryption
2. TCP usage
3. Authorization
4. Connections via multiple VTY lines

**Ответ:** Encryption.

**Объяснение:** SSH шифрует сеанс, включая учётные данные; Telnet передаёт их открыто. Оба могут использовать TCP, VTY и аутентификацию, поэтому эти признаки не являются преимуществом SSH именно над Telnet.

**Explanation in English:** SSH encrypts the session, including credentials; Telnet sends them in plaintext. Both can use TCP, VTY lines and authentication, so those features do not distinguish SSH from Telnet.

### E440. What is one of the most effective security tools available for protecting users from external threats?

Источник: модули_16, Q6. Тема: модуль 16.

1. Firewalls
2. Router that run AAA services
3. Patch servers
4. Password encryption techniques

**Ответ:** Firewalls.

**Объяснение:** Firewall предотвращает нежелательный сетевой обмен на границе и потому служит основным средством защиты от внешних соединений. AAA контролирует доступ пользователей, patches закрывают уязвимости, password protection защищает секреты; они дополняют firewall, но не заменяют его фильтрацию. Это не утверждение, что firewall защищает от всех угроз.

**Explanation in English:** A firewall blocks unwanted network communication at the boundary, making it a major protection against external connections. AAA controls user access, patches fix flaws and password protection secures secrets; they complement rather than replace traffic filtering. This does not mean a firewall stops every threat.

### E441. Which type of network threat is intended to prevent authorized users from accessing resources?

Источник: модули_16, Q7. Тема: модуль 16.

1. DoS attacks
2. Access attacks
3. Reconnaissance attacks
4. Trust exploitation

**Ответ:** DoS attacks.

**Объяснение:** Цель DoS — сделать ресурс недоступным законным пользователям. Access attack стремится получить чужие права, reconnaissance собирает сведения, trust exploitation использует доверительные отношения. Формулировка «prevent authorized users from accessing» прямо указывает на отказ в обслуживании.

**Explanation in English:** DoS aims to make a resource unavailable to legitimate users. Access attacks seek unauthorized privileges, reconnaissance gathers information, and trust exploitation abuses trusted relationships. Preventing authorized access directly describes denial of service.

### E442. Which three services are provided by the AAA framework? (Choose three.)

Источник: модули_16, Q8. Тема: модуль 16.

1. Accounting
2. Automation
3. Authorization
4. Authentication
5. Autobalancing
6. Autoconfiguration

**Ответ:** Accounting; Authorization; Authentication.

**Объяснение:** AAA расшифровывается Authentication (проверка личности), Authorization (разрешённые действия), Accounting (учёт действий). Automation, autobalancing и autoconfiguration не входят в эту тройку, хотя тоже начинаются с A.

**Explanation in English:** AAA stands for Authentication (identity verification), Authorization (permitted actions) and Accounting (activity records). Automation, autobalancing and autoconfiguration are not part of this framework despite starting with A.

### E443. Which malicious code attack is self-contained and tries to exploit a specific vulnerability in a system being attacked?

Источник: модули_16, Q9. Тема: модуль 16.

1. Virus
2. Worm
3. Trojan horse
4. Social engineering

**Ответ:** Worm.

**Объяснение:** Worm — самостоятельный вредоносный код, способный распространяться, эксплуатируя уязвимости других систем. Virus обычно связан с заражённым объектом/программой; Trojan определяется маскировкой под полезное ПО. Social engineering воздействует на человека, а не является самостоятельным кодом.

**Explanation in English:** A worm is self-contained malicious code that can spread by exploiting other systems’ vulnerabilities. A virus is typically attached to an infected object/program; a Trojan is defined by disguising itself as useful software. Social engineering targets people rather than being self-contained code.

### E444. Some routers and switches in a wiring closet malfunctioned after an air conditioning unit failed. What type of threat does this situation describe?

Источник: модули_16, Q10. Тема: модуль 16.

1. Configuration
2. Environmental
3. Electrical
4. Maintenance

**Ответ:** Environmental.

**Объяснение:** После отказа кондиционера нарушился температурный режим — environmental threat. Electrical означало бы проблему напряжения/питания; configuration — неверные настройки; maintenance — ошибки обращения/обслуживания. В условии непосредственный фактор — окружающая среда.

**Explanation in English:** A failed air conditioner disrupts temperature control, an environmental threat. Electrical concerns voltage/power, configuration concerns settings, and maintenance concerns handling/service errors. The direct factor here is the environment.

### E445. What does the term vulnerability mean?

Источник: модули_16, Q11. Тема: модуль 16.

1. A weakness that makes a target susceptible to an attack
2. A computer that contains sensitive information
3. A method of attack to exploit a target
4. A known target or victim machine
5. A potential threat that a hacker creates

**Ответ:** A weakness that makes a target susceptible to an attack.

**Объяснение:** Vulnerability — слабое место, которое делает систему восприимчивой к атаке. Метод использования этого слабого места — exploit; потенциальный источник вреда — threat. Компьютер-жертва и чувствительные данные — объекты защиты, а не определение уязвимости.

**Explanation in English:** A vulnerability is a weakness that makes a system susceptible to attack. An exploit is a way to use the weakness; a threat is a potential source of harm. A victim computer or sensitive information is an asset/target, not the definition of vulnerability.

### E446. What three configuration steps must be performed to implement SSH access to a router? (Choose three.)

Источник: модули_16, Q12. Тема: модуль 16.

1. A password on the console line
2. An IP domain name
3. A user account
4. An enable mode password
5. A unique hostname
6. An encrypted password

**Ответ:** An IP domain name; A user account; A unique hostname.

**Объяснение:** В базовой IOS SSH-настройке нужны hostname, domain name и local user: имя/домен используются при создании ключей, пользователь — для login local. Console password и enable password защищают другие этапы доступа. Это три верных пункта из предложенных, но для рабочего SSH также нужны RSA keys, IP-доступность и VTY transport input ssh.

**Explanation in English:** Basic IOS SSH setup needs hostname, domain name and a local user: name/domain are used when generating keys, and the user supports login local. Console and enable passwords protect different access stages. These are the three offered prerequisites; working SSH also needs RSA keys, IP reachability and VTY transport input ssh.

### E447. What is the objective of a network reconnaissance attack?

Источник: модули_16, Q13. Тема: модуль 16.

1. Discovery and mapping of systems
2. Unauthorized manipulation of data
3. Disabling network systems or services
4. Denying access to resources by legitimate users

**Ответ:** Discovery and mapping of systems.

**Объяснение:** Reconnaissance выясняет, какие системы, адреса, порты и службы существуют, чтобы подготовить последующие действия. Изменение данных, отключение сервисов и блокирование пользователей — уже другие цели/стадии атак, а не разведка.

**Explanation in English:** Reconnaissance discovers systems, addresses, ports and services to prepare later actions. Altering data, disabling services and denying users access are different attack goals/stages, not reconnaissance itself.

### E448. For security reasons a network administrator needs to ensure that local computers cannot ping each other. Which settings can accomplish this task?

Источник: модули_16, Q14. Тема: модуль 16.

1. Smartcard settings
2. Firewall settings
3. MAC address settings
4. File system settings

**Ответ:** Firewall settings.

**Объяснение:** Правила firewall на хостах могут запрещать ICMP Echo Request/Reply и тем самым ping между компьютерами. Smartcard управляет удостоверением личности, файловые права — файлами, изменение MAC не является корректным способом выборочной блокировки ICMP. Блокирование ping не равнозначно полной изоляции хостов.

**Explanation in English:** Host firewall rules can block ICMP Echo Request/Reply and therefore ping between computers. Smartcards address identity, file permissions protect files, and changing MAC addresses is not selective ICMP filtering. Blocking ping does not fully isolate the hosts.

### E449. A network administrator establishes a connection to a switch via SSH. What characteristic uniquely describes the SSH connection?

Источник: модули_16, Q15. Тема: модуль 16.

1. Out-of-band access to a switch through the use of a virtual terminal with password authentication
2. Remote access to the switch through the use of a telephone dialup connection
3. On-site access to a switch through the use of a directly connected PC and a console cable
4. Remote access to a switch where data is encrypted during the session
5. Direct access to the switch through the use of a terminal emulation program

**Ответ:** Remote access to a switch where data is encrypted during the session.

**Объяснение:** SSH — удалённый доступ по IP с шифрованием данных сеанса. Console-кабель даёт локальный out-of-band доступ, AUX может обслуживать dialup; использование терминальной программы само не определяет способ подключения. VTY по сети не становится out-of-band из-за пароля.

**Explanation in English:** SSH is remote IP access with encrypted session data. A console cable gives local out-of-band access, AUX may support dialup, and using terminal software alone does not identify the connection method. Network VTY access is not out-of-band merely because it uses a password.

### E456. Which two network protocols are used to establish a remote access network connection to a device? (Choose two.)

Источник: модули_17, Q2. Тема: модуль 16.

1. File Transfer Protocol (FTP)
2. Hypertext Transfer Protocol (HTTP)
3. Remote Connect (RC)
4. Secure Shell (SSH)
5. Simple Mail Transfer Protocol (SMTP)
6. Telnet

**Ответ:** Secure Shell (SSH); Telnet.

**Объяснение:** В контексте удалённого CLI-доступа используются SSH и Telnet. FTP передаёт файлы, SMTP — почту, HTTP обслуживает веб; Remote Connect не указан как стандартный протокол этой задачи. SSH защищает сеанс, Telnet — нет.

**Explanation in English:** For remote CLI access, SSH and Telnet are the matching protocols. FTP transfers files, SMTP mail and HTTP web content; Remote Connect is not a standard protocol in this task. SSH protects the session, whereas Telnet does not.

### E479. A high school in New York (school A) is using videoconferencing technology to establish student interactions with another high school (school B) in Russia. The videoconferencing is conducted between two end devices through the Internet. The network administrator of school A configures the end device with the IP address 209.165.201.10. The administrator sends a request for the IP address for the end device in school B and the response is 192.168.25.10. Neither school is using a VPN. The administrator knows immediately that this IP will not work. Why?

Источник: тесты_IP_Addressing, Q1. Тема: модуль 16.

1. This is a loopback address.
2. This is a link-local address.
3. This is a private IP address.
4. There is an IP address conflict.

**Ответ:** This is a private IP address..

**Объяснение:** 192.168.25.10 принадлежит private-блоку 192.168.0.0/16 и не маршрутизируется напрямую через публичный Интернет. Нужен публичный способ доступа, например соответствующая NAT-публикация или VPN. Это не loopback (127/8), не link-local (169.254/16), и конфликт адресов из условия не следует.

**Explanation in English:** 192.168.25.10 belongs to private 192.168.0.0/16 and cannot be routed directly across the public Internet. A public access arrangement such as appropriate NAT publishing or a VPN is needed. It is neither loopback (127/8) nor link-local (169.254/16), and no address conflict is established.

### E514. An administrator is configuring a switch console port with a password. In what order will the administrator travel through the IOS modes of operation in order to reach the mode in which the configuration commands will be entered? A first mode user EXEC mode done B final mode line configuration mode C second mode privileged EXEC mode D third mode global configuration mode

Источник: тесты_exam_0, Q3. Тема: модуль 16.



**Ответ:** user EXEC → privileged EXEC → global configuration → line configuration.

**Объяснение:** Сначала user EXEC (>), enable открывает privileged EXEC (#), configure terminal — global configuration, line console 0 — line configuration. Пароль console задаётся именно на линии, поэтому нельзя остановиться в global config или перепрыгнуть туда напрямую из >.

**Explanation in English:** Start at user EXEC (>), use enable for privileged EXEC (#), configure terminal for global configuration, and line console 0 for line configuration. The console password is configured on the line, so global configuration is not the final mode and cannot be entered directly from >.

### E518. A network administrator enters the service password-encryption command into the configuration mode of a router. What does this command accomplish?

Источник: тесты_exam_0, Q7. Тема: модуль 16.

1. This command encrypts passwords as they are transmitted across serial WAN links.
2. This command prevents someone from viewing the running configuration passwords.
3. This command enables a strong encryption algorithm for the enable secret password command.
4. This command automatically encrypts passwords in configuration files that are currently stored in NVRAM.
5. This command provides an exclusive encrypted password for external service personnel who are required to do router maintenance.

**Ответ:** This command prevents someone from viewing the running configuration passwords..

**Объяснение:** В формулировке курса имеется в виду: открытые пароли перестают быть читаемыми прямо в running-config. Значения всё равно видны как Type 7 и обратимо декодируются, поэтому это не абсолютный запрет увидеть пароль. Команда не шифрует WAN-трафик, не меняет алгоритм enable secret и не сохраняет изменения в NVRAM автоматически.

**Explanation in English:** The course means plaintext passwords stop being directly readable in running-config. Encoded Type 7 values remain visible and reversible, so this is not an absolute barrier to recovering passwords. It does not encrypt WAN traffic, change the enable secret algorithm or automatically save to NVRAM.

### E520. What command will prevent all unencrypted passwords from displaying in plain text in a configuration file?

Источник: тесты_exam_0, Q9. Тема: модуль 16.

1. (config)# enable password secret
2. (config)# enable secret Secret_Password
3. (config-line)# password secret
4. (config)# service password-encryption
5. (config)# enable secret Encrypted_Password

**Ответ:** (config)# service password-encryption.

**Объяснение:** service password-encryption скрывает поддерживаемые пароли, отображавшиеся открытым текстом в конфигурации. enable secret задаёт один секрет privileged EXEC, а login включает аутентификацию линии. В классическом IOS скрытие Type 7 обратимо и не является сильной защитой или шифрованием сетевого сеанса.

**Explanation in English:** service password-encryption obscures supported passwords previously shown as plaintext in configuration. enable secret sets one privileged EXEC secret and login enables line authentication. Classic IOS Type 7 is reversible obfuscation, not strong secret protection or session encryption.

### E521. Passwords can be used to restrict access to all or parts of the Cisco IOS. Select the modes and interfaces that can be protected with passwords. (Choose three.)

Источник: тесты_exam_0, Q10. Тема: модуль 16.

1. VTY interface
2. Console interface
3. Ethernet interface
4. Boot IOS mode
5. Privileged EXEC mode
6. Router configuration mode

**Ответ:** VTY interface; Console interface; Privileged EXEC mode.

**Объяснение:** Console и VTY имеют настройки line authentication, а privileged EXEC защищается enable secret. Ethernet-порт не получает обычный CLI line password; global configuration защищён тем, что вход в него идёт через privileged EXEC, а не отдельным паролем режима.

**Explanation in English:** Console and VTY have line-authentication settings, while privileged EXEC is protected by enable secret. An Ethernet port does not receive an ordinary CLI line password; global configuration is reached through privileged EXEC rather than having its own separate mode password.

### E527. Refer to the exhibit. A network administrator is configuring access control to switch SW1. If the administrator uses a console connection to connect to the switch, which password is needed to access user EXEC mode?

Источник: тесты_exam_0, Q16. Тема: модуль 16.

1. letmein
2. secretin
3. lineconin
4. linevtyin

> Ответ для показанного варианта (нужна схема/PT для полной проверки)

**Ответ:** lineconin.

**Объяснение:** Для console-входа нужно значение password из line console 0, а не enable secret и не line vty. Сохранённый ответ lineconin предполагает именно такую строку в отсутствующем exhibit. Без самой конфигурации невозможно проверить буквальное значение, поэтому карточка исключена из автоматического квиза.

**Explanation in English:** Console login uses the password under line console 0, not enable secret or the VTY password. The saved lineconin answer assumes that value in the missing exhibit. Without the configuration its literal value cannot be verified, so the card is excluded from the automatic quiz.

### E595. Match the commands to the correct actions. A configures a name on the router Router(config)# hostname CL1 done B displays a message after accessing the router Router(config)# banner motd # C provides security on the console Router(config-line)# password class

Источник: тесты_exam_2, Q17. Тема: модуль 16.



> Ответ

**Ответ:** hostname CL1 → имя устройства; banner motd → сообщение при входе; password class в config-line → пароль линии console.

**Объяснение:** hostname CL1 меняет имя устройства; banner motd задаёт объявление при подключении; password class в выбранной console line задаёт её пароль. Для фактической проверки этого line password дополнительно нужен login. Banner не аутентифицирует, hostname не изменяет пароль.

**Explanation in English:** hostname CL1 sets the device name; banner motd defines a connection notice; password class under the selected console line sets its password. login is additionally needed to enforce that line password. A banner does not authenticate and hostname does not change passwords.

### E597. What happens when the transport input ssh command is entered on the switch vty lines?

Источник: тесты_exam_2, Q19; тесты_exam_7, Q53. Тема: модуль 16.

1. The SSH client on the switch is enabled.
2. Communication between the switch and remote users is encrypted.
3. The switch requires a username/password combination for remote access.
4. The switch requires remote connections via a proprietary client software.

**Ответ:** Communication between the switch and remote users is encrypted..

**Объяснение:** transport input ssh разрешает входящие VTY-сеансы по SSH, который шифрует обмен, и исключает Telnet из списка разрешённых протоколов. Эта команда не создаёт пользователя и не заменяет login local; она также не включает исходящий SSH-клиент. Полный SSH-сервер требует остальных настроек и ключей.

**Explanation in English:** transport input ssh permits inbound VTY sessions using encrypted SSH and excludes Telnet from the allowed protocols. It does not create users or replace login local, nor does it enable an outbound SSH client. The full SSH server still needs its other configuration and keys.

### E600. A network administrator requires access to manage routers and switches locally and remotely. Match the description to the access method. A remote access method that uses encryption SSH done B preferred out-of-band access method Console C unsecure remote access Telnet D remote access via a dialup connection AUX

Источник: тесты_exam_2, Q22. Тема: модуль 16.



> Ответ

**Ответ:** SSH → удалённый зашифрованный доступ; Console → локальный out-of-band; Telnet → удалённый незашифрованный; AUX → модемное соединение.

**Объяснение:** SSH — сетевой сеанс с шифрованием; Telnet — сетевой сеанс с открытым текстом. Console — прямой доступ вне рабочего IP-пути, удобный при неисправной сети; AUX исторически используется для модемного dialup. Выбирай по каналу подключения и защите, а не только по наличию пароля.

**Explanation in English:** SSH is an encrypted network session; Telnet is plaintext network access. Console is direct access outside the working IP path, useful when the network fails; AUX traditionally supports modem dialup. Classify by connection path and protection, not merely by whether a password exists.

### E607. What are two potential network problems that can result from ARP operation? (Choose two.)

Источник: тесты_exam_2, Q29. Тема: модуль 16.

1. Manually configuring static ARP associations could facilitate ARP poisoning or MAC address spoofing.
2. On large networks with low bandwidth, multiple ARP broadcasts could cause data communication delays.
3. Network attackers could manipulate MAC address and IP address mappings in ARP messages with the intent of intercepting network traffic.
4. Large numbers of ARP request broadcasts could cause the host MAC address table to overflow and prevent the host from communicating on the network.
5. Multiple ARP replies result in the switch MAC address table containing entries that match the MAC addresses of hosts that are connected to the relevant switch port.

**Ответ:** On large networks with low bandwidth, multiple ARP broadcasts could cause data communication delays.; Network attackers could manipulate MAC address and IP address mappings in ARP messages with the intent of intercepting network traffic..

**Объяснение:** ARP requests широковещательны и при большом объёме нагружают LAN. ARP также не аутентифицирует обычные ответы, поэтому поддельная IP→MAC привязка может направить трафик атакующему. ARP-кэш хоста и MAC-таблица коммутатора — разные таблицы; множество запросов не означает автоматически переполнение «host MAC table».

**Explanation in English:** ARP requests are broadcasts and can burden a LAN in large volumes. Ordinary ARP replies are not authenticated, so forged IP-to-MAC mappings can redirect traffic to an attacker. A host ARP cache and a switch MAC table are different structures; many requests do not automatically imply a “host MAC table” overflow.

### E643. A client creates a packet to send to a server. The client is requesting telnet service. What number will be used as the destination port number in the sending packet?

Источник: тесты_exam_4, Q32. Тема: модуль 16.

1. 23
2. 443
3. 161
4. 110

**Ответ:** 23.

**Объяснение:** Стандартный серверный TCP-порт Telnet — 23, поэтому клиент ставит 23 в destination port. 443 обычно HTTPS, 161 SNMP, 110 POP3. Исходный клиентский порт будет отдельным значением и не определяет требуемую службу.

**Explanation in English:** The standard Telnet server TCP port is 23, so the client uses 23 as destination port. 443 normally identifies HTTPS, 161 SNMP and 110 POP3. The separate client source port does not identify the requested server service.

### E644. Identify the steps needed to configure a switch for SSH. The answer order does not matter. Create a local user. Required steps for SSH configuration done Generate RSA keys. Configure a domain name. Use the login local command. Use the transport input ssh command.

Источник: тесты_exam_5, Q1. Тема: модуль 16.



**Ответ:** Создать локального пользователя; Сгенерировать RSA keys; Задать domain name; login local; transport input ssh.

**Объяснение:** Domain name вместе с hostname используется в стандартной настройке RSA keys; RSA обеспечивает идентичность/криптографию SSH-сервера. Local user создаёт учётную запись, login local выбирает эту базу для VTY, transport input ssh разрешает только SSH. Эти команды решают разные задачи и не заменяют IP-доступность устройства.

**Explanation in English:** The domain name and hostname are used in standard RSA-key setup; RSA supports SSH server identity/cryptography. A local user creates credentials, login local selects that database for VTY, and transport input ssh permits SSH only. These steps serve different purposes and do not replace IP reachability.

### E645. What feature of SSH makes it more secure than Telnet for a device management connection?

Источник: тесты_exam_5, Q2. Тема: модуль 16.

1. confidentiality with IPsec
2. stronger password requirement
3. random one-time port connection
4. login information and data encryption

**Ответ:** login information and data encryption.

**Объяснение:** SSH шифрует login information и данные сеанса, тогда как Telnet передаёт их открыто. SSH не требует IPsec для собственной защиты и не использует случайный одноразовый серверный порт; сила выбранного пароля сама по себе не является главным различием этих протоколов.

**Explanation in English:** SSH encrypts login information and session data, while Telnet sends them in plaintext. SSH does not need IPsec for its own protection or use a random one-time server port; password strength itself is not the fundamental distinction.

### E646. What is the difference between a virus and a worm?

Источник: тесты_exam_5, Q3. Тема: модуль 16.

1. Viruses self-replicate but worms do not.
2. Worms self-replicate but viruses do not.
3. Worms require a host file but viruses do not.
4. Viruses hide in legitimate programs but worms do not.

> Ответ в курсе; см. уточнение ниже

**Ответ:** Worm распространяется самостоятельно; virus размножается через заражённый объект/программу.

**Объяснение:** Worm может распространяться самостоятельно, а virus размножается через заражённый объект/программу и её выполнение. Оба могут самовоспроизводиться, поэтому «worms self-replicate but viruses do not» неверно. Предложенные варианты упрощены/неточны; полностью корректной пары в них нет, карточка остаётся исключённой.

**Explanation in English:** A worm can spread independently, whereas a virus replicates through an infected object/program and its execution. Both can replicate, so “worms self-replicate but viruses do not” is false. The offered statements are inaccurate/oversimplified; no fully correct distinction is present and the card remains excluded.

### E647. Which firewall feature is used to ensure that packets coming into a network are legitimate responses to requests initiated from internal hosts?

Источник: тесты_exam_5, Q4. Тема: модуль 16.

1. Stateful packet inspection
2. URL filtering
3. Application filtering
4. Packet filtering

**Ответ:** Stateful packet inspection.

**Объяснение:** Stateful packet inspection ведёт состояние соединений и проверяет, соответствует ли входящий пакет уже разрешённому обмену. Обычная фильтрация адресов/портов рассматривает поля пакета, URL filtering — адрес сайта; они сами не проверяют принадлежность к существующему сеансу.

**Explanation in English:** Stateful packet inspection tracks connection state and checks whether incoming traffic belongs to an already permitted exchange. Basic address/port filtering inspects packet fields and URL filtering inspects website addresses; neither alone establishes membership in an existing session.

### E648. What is the advantage of using SSH over Telnet?

Источник: тесты_exam_5, Q5. Тема: модуль 16.

1. SSH is easier to use.
2. SSH operates faster than Telnet.
3. SSH provides secure communications to access hosts.
4. SSH supports authentication for a connection request.

**Ответ:** SSH provides secure communications to access hosts..

**Объяснение:** SSH обеспечивает защищённый зашифрованный удалённый сеанс. Telnet тоже может требовать аутентификацию, поэтому наличие login не отличает SSH. Более высокая скорость или простота использования не гарантируются и не являются причиной выбора безопасного протокола.

**Explanation in English:** SSH supplies a protected, encrypted remote session. Telnet can also authenticate users, so login support alone is not the difference. Greater speed or ease of use is not guaranteed and is not the security reason to choose SSH.

### E649. A user is redesigning a network for a small company and wants to ensure security at a reasonable price. The user deploys a new application-aware firewall with intrusion detection capabilities on the ISP connection. The user installs a second firewall to separate the company network from the public network. Additionally, the user installs an IPS on the internal network of the company. What approach is the user implementing?

Источник: тесты_exam_5, Q6. Тема: модуль 16.

1. attack based
2. risk based
3. structured
4. layered

**Ответ:** layered.

**Объяснение:** Несколько средств на разных участках — perimeter firewall, дополнительное разделение и внутренний IPS — образуют layered/defense-in-depth защиту. Она не полагается на один барьер: пропущенную одной системой угрозу может остановить другая. В условии описана архитектура слоёв, не процедура расчёта риска.

**Explanation in English:** Multiple controls at different locations—a perimeter firewall, further separation and an internal IPS—form layered/defense-in-depth protection. It avoids reliance on one barrier so another control may stop a missed threat. The scenario describes layers rather than a risk-assessment procedure.

### E650. Match the type of information security threat to the scenario. A identity theft pretending to be someone else by using stolen personal information to apply for a credit card done B information theft obtaining trade secret documents illegally C data loss installing virus code to destroy surveillance recordings for certain days D disruption of service preventing users from accessing a website by sending a large number of link requests in a short period

Источник: тесты_exam_5, Q7. Тема: модуль 16.



> Ответ

**Ответ:** identity theft → чужие данные для получения кредитной карты; information theft → кража коммерческих документов; data loss → уничтожение записей вирусом; disruption of service → перегрузка сайта запросами.

**Объяснение:** Чужая личность для кредитной карты → identity theft; украденные секретные документы → information theft; уничтоженные записи → data loss; перегруженный сайт → disruption of service. Различай действие и главный ущерб: кража сведений, подмена личности, целостность/потеря или доступность.

**Explanation in English:** Using another identity for credit is identity theft; stealing secret documents is information theft; destroying recordings is data loss; overwhelming a website is disruption of service. Match the action and primary harm: stolen information, impersonation, integrity/loss or availability.

### E651. Match each weakness with an example. A security policy weakness The network administrator did not fully consider the implications of unauthorized users accessing the network. done B technological weakness A nework engineer is examining the operating system of a network device for vulnerabilities. C configuration weakness When implementing an access list on a router, a network engineer did not filter a type of malicous traffic.

Источник: тесты_exam_5, Q8. Тема: модуль 16.



> Ответ

**Ответ:** security policy → не учтены риски неавторизованного доступа; technological → уязвимости ОС; configuration → неверная фильтрация ACL.

**Объяснение:** Непродуманные правила доступа — security policy weakness; уязвимость самой ОС — technological weakness; ошибочная ACL, пропускающая вредоносный трафик, — configuration weakness. Разница: слабые правила, слабая технология или неверно настроенная технология.

**Explanation in English:** Inadequately planned access rules are a security-policy weakness; an OS flaw is a technological weakness; an incorrectly configured ACL permitting malicious traffic is a configuration weakness. Distinguish deficient rules, flawed technology and incorrectly configured technology.

### E652. Which attack involves a compromise of data that occurs between two end points?

Источник: тесты_exam_5, Q9. Тема: модуль 16.

1. denial-of-service
2. man-in-the-middle attack
3. extraction of security parameters
4. username enumeration

**Ответ:** man-in-the-middle attack.

**Объяснение:** Man-in-the-middle вмешивается в обмен между двумя сторонами: читает или подменяет сообщения, пока стороны считают, что общаются напрямую. DoS лишает доступа, username enumeration выясняет существующие имена. Именно компрометация данных между endpoints описывает MITM.

**Explanation in English:** A man-in-the-middle intervenes between two parties to read or modify messages while they believe they communicate directly. DoS denies availability and username enumeration discovers valid names. Compromising data between endpoints specifically describes MITM.

### E653. Match the description to the type of firewall filtering. A packet filtering prevents or allows access based on the IP or MAC addresses of the source and destination done B application filtering prevents or allows access based on the port numbers used in the request C stateful packet inspection prevents or allows access based on whether the traffic is in response to requests from internal hosts D URL filtering prevents or allows access based on web addresses or keywords

Источник: тесты_exam_5, Q10. Тема: модуль 16.



> Ответ

**Ответ:** packet filtering → адреса источника/назначения; application filtering (терминология задания) → порты; stateful inspection → связь с существующим соединением; URL filtering → адреса сайтов/ключевые слова.

**Объяснение:** В терминологии задания: packet filtering → адреса, application filtering → порты предполагаемых приложений, URL filtering → URL/ключевые слова, stateful inspection → связь с существующим обменом. Уточнение: обычный packet filter тоже может учитывать порты, а современные application-aware фильтры анализируют само приложение; классификация курса упрощена.

**Explanation in English:** In the exercise terminology: packet filtering matches addresses, application filtering matches presumed-application ports, URL filtering matches URLs/keywords, and stateful inspection matches existing exchanges. In practice, packet filters can also inspect ports and modern application-aware filters identify applications themselves; the course classification is simplified.

### E654. Which example of malicious code would be classified as a Trojan horse?

Источник: тесты_exam_5, Q11. Тема: модуль 16.

1. malware that was written to look like a video game
2. malware that requires manual user intervention to spread between systems
3. malware that attaches itself to a legitimate program and spreads to other programs when launched
4. malware that can automatically spread from one system to another by exploiting a vulnerability in the target

**Ответ:** malware that was written to look like a video game.

**Объяснение:** Malware, выглядящее как видеоигра, — Trojan horse: пользователь запускает его, доверяя маскировке. Прикрепление к другой программе и распространение при запуске описывает virus; автоматическое распространение через уязвимость — worm. Одной необходимости ручного действия недостаточно для определения Trojan.

**Explanation in English:** Malware disguised as a video game is a Trojan horse: the user runs it because of its benign appearance. Attaching to another program and spreading on execution describes a virus; automatic exploitation-driven spread describes a worm. Requiring manual action alone does not define a Trojan.

### E671. What is considered the most effective way to mitigate a worm attack?

Источник: тесты_exam_5, Q28. Тема: модуль 16.

1. Change system passwords every 30 days.
2. Ensure that all systems have the most current virus definitions.
3. Ensure that AAA is configured in the network.
4. Download security updates from the operating system vendor and patch all vulnerable systems.

**Ответ:** Download security updates from the operating system vendor and patch all vulnerable systems..

**Объяснение:** Патчи всех уязвимых систем закрывают слабость, через которую worm автоматически распространяется. Антивирусные определения помогают обнаружению, но не устраняют саму уязвимость; смена паролей и AAA не исправляют дефект ОС. Поэтому обновление систем — наиболее прямой ответ в этом вопросе.

**Explanation in English:** Patching all vulnerable systems removes the flaw through which a worm spreads automatically. Antivirus definitions help detection but do not fix the flaw; password changes and AAA do not repair OS defects. Updating systems is therefore the most direct answer here.

### E672. When configuring SSH on a router to implement secure network management, a network engineer has issued the login local and transport input ssh line vty commands. What three additional configuration actions have to be performed to complete the SSH configuration? (Choose three.)

Источник: тесты_exam_5, Q29. Тема: модуль 16.

1. Set the user privilege levels.
2. Generate the asymmetric RSA keys.
3. Configure the correct IP domain name.
4. Configure role-based CLI access.
5. Create a valid local username and password database.
6. Manually enable SSH after the RSA keys are generated.

**Ответ:** Generate the asymmetric RSA keys.; Configure the correct IP domain name.; Create a valid local username and password database..

**Объяснение:** Уже заданы правила VTY, но для реального SSH ещё нужны RSA keys, domain name для стандартной генерации ключей и local username/password database, на которую ссылается login local. RBAC и privilege levels могут настраивать права, но не являются обязательными тремя шагами из этого списка. В стандартном сценарии SSH активируется при готовых ключах/настройках.

**Explanation in English:** The VTY rules are present, but SSH still needs RSA keys, the domain name used in standard key generation, and the local username/password database referenced by login local. RBAC and privilege levels can refine permissions but are not the three prerequisites listed here. In the standard setup SSH becomes available with the required keys/settings.

### E674. On which two interfaces or ports can security be improved by configuring executive timeouts? (Choose two.)

Источник: тесты_exam_5, Q31. Тема: модуль 16.

1. fast Ethernet interfaces
2. console ports
3. serial interfaces
4. vty ports
5. loopback interfaces

**Ответ:** console ports; vty ports.

**Объяснение:** exec-timeout относится к интерактивным EXEC-сеансам на линиях console и VTY: незанятый терминал автоматически отключается. Ethernet, serial и loopback — сетевые интерфейсы, не линии пользовательского CLI-сеанса, поэтому этот таймер там не настраивается как line command.

**Explanation in English:** exec-timeout applies to interactive EXEC sessions on console and VTY lines, disconnecting unattended idle terminals. Ethernet, serial and loopback are network interfaces rather than user CLI lines, so this line-session timer is not configured on them.

### E675. Open the PT Activity. Perform the tasks in the activity instructions and then answer the question. Which command has to be configured on the router to complete the SSH configuration?

Источник: тесты_exam_5, Q32. Тема: модуль 16.

1. service password-encryption
2. transport input ssh
3. enable secret class
4. ip domain-name cisco.com

> Ответ для показанного варианта (нужна схема/PT для полной проверки)

**Ответ:** transport input ssh.

**Объяснение:** transport input ssh на VTY разрешает входящие SSH-сеансы и исключает Telnet. Это объясняет роль сохранённого ответа, но определить, что именно этой команды недостаёт в конкретном роутере, можно только по PT-файлу/running-config. Без активности ответ не подтверждён, карточка исключена.

**Explanation in English:** transport input ssh on VTY permits incoming SSH sessions and excludes Telnet. This explains the saved answer’s role, but establishing that this is the missing command requires the actual PT file/running-config. Without the activity the answer is unverified and the card is excluded.

### E676. A technician is to document the current configurations of all network devices in a college, including those in off-site buildings. Which protocol would be best to use to securely access the network devices?

Источник: тесты_exam_5, Q33. Тема: модуль 16.

1. FTP
2. HTTP
3. SSH
4. Telnet

**Ответ:** SSH.

**Объяснение:** SSH предоставляет защищённый удалённый CLI-доступ для просмотра конфигураций устройств, в том числе в других зданиях. Telnet не шифрует, HTTP без TLS тоже открыт, FTP предназначен для передачи файлов, а не защищённого интерактивного управления.

**Explanation in English:** SSH provides protected remote CLI access for inspecting device configurations, including off-site devices. Telnet is plaintext, HTTP without TLS is also unencrypted, and FTP transfers files rather than providing protected interactive management.

### E677. An administrator decides to use "RobErT" as the password on a newly installed router. Which statement applies to the password choice?

Источник: тесты_exam_5, Q34. Тема: модуль 16.

1. It is weak since it uses easily found personal information.
2. It is strong because it uses a passphrase.
3. It is strong because it uses a minimum of 10 numbers, letters and special characters.
4. It is strong because it contains 10 numbers and special characters.

**Ответ:** It is weak since it uses easily found personal information..

**Объяснение:** RobErT — короткое распространённое имя с предсказуемой сменой регистра. Это не длинная passphrase и не строка из десяти цифр/символов. Изменение регистра само по себе не делает легко угадываемое личное слово сильным паролем.

**Explanation in English:** RobErT is a short common name with predictable capitalization. It is neither a long passphrase nor ten digits/special characters. Mixed case alone does not make an easily guessed personal word a strong password.

### E679. Which statement describes network security?

Источник: тесты_exam_6, Q1. Тема: модуль 16.

1. It ensures sensitive corporate data is available for authorized users.
2. It prioritizes data flows in order to give priority to delay-sensitive traffic.
3. It supports growth over time in accordance with approved network design procedures.
4. It synchronizes traffic flows using timestamps.

**Ответ:** It ensures sensitive corporate data is available for authorized users..

**Объяснение:** Security защищает чувствительные данные и сохраняет доступ к ним для уполномоченных пользователей — сочетание конфиденциальности и доступности. Приоритизация delay-sensitive потоков — QoS; рост сети — scalability; синхронизация timestamp не является определением security.

**Explanation in English:** Security protects sensitive data while preserving access for authorized users, combining confidentiality and availability. Prioritizing delay-sensitive traffic is QoS, growth is scalability, and timestamp synchronization is not the definition of security.

### E681. What characteristic describes spyware?

Источник: тесты_exam_6, Q3. Тема: модуль 16.

1. software that is installed on a user device and collects information about the user
2. an attack that slows or crashes a device or network service
3. the use of stolen credentials to access private data
4. a network device that filters access and traffic coming into a network

**Ответ:** software that is installed on a user device and collects information about the user.

**Объяснение:** Spyware — установленное ПО, собирающее сведения о пользователе, обычно скрытно. Сбой/замедление сервиса описывает DoS, использование украденных credentials — неразрешённый доступ, а фильтрующее устройство — firewall.

**Explanation in English:** Spyware is installed software that gathers user information, usually covertly. Slowing/crashing a service describes DoS, using stolen credentials describes unauthorized access, and a traffic-filtering device is a firewall.

### E706. Match the command with the device mode at which the command is entered. A service password-encryption R1(config)# done B login R1(config-line)# C ip address 192.168.4.4 255.255.255.0 R1(config-if)# D copy running-config startup-config R1# E enable R1>

Источник: тесты_exam_6, Q28. Тема: модуль 16.



> Ответ

**Ответ:** service password-encryption → R1(config)#; login → R1(config-line)#; ip address … → R1(config-if)#; copy running-config startup-config → R1#; enable → R1>.

**Объяснение:** service password-encryption — глобальная настройка (config)#; login — правило выбранной линии (config-line)#; ip address — адрес интерфейса (config-if)#; copy running-config startup-config — административная операция в #; enable — повышение прав из >. Сопоставление определяется областью действия команды.

**Explanation in English:** service password-encryption is global configuration (config)#; login configures the selected line (config-line)#; ip address configures an interface (config-if)#; copy running-config startup-config is an administrative operation at #; enable elevates from >. Match commands by their configuration scope.

### E719. A client packet is received by a server. The packet has a destination port number of 22. What service is the client requesting?

Источник: тесты_exam_6, Q41. Тема: модуль 16.

1. SSH
2. DHCP
3. DNS
4. TFTP

**Ответ:** SSH.

**Объяснение:** Серверный TCP-порт 22 стандартно используется SSH для защищённого удалённого доступа. DHCP использует UDP 67/68, DNS — 53, TFTP — UDP 69. В реальной сети порты можно изменить, но вопрос спрашивает стандартное назначение.

**Explanation in English:** Server TCP port 22 is the standard SSH port for protected remote access. DHCP uses UDP 67/68, DNS 53 and TFTP UDP 69. Real deployments can change ports, but this question asks the standard assignment.

### E723. Which statement describes the characteristics of packet-filtering and stateful firewalls as they relate to the OSI model?

Источник: тесты_exam_6, Q45. Тема: модуль 16.

1. Both stateful and packet-filtering firewalls can filter at the application layer.
2. A stateful firewall can filter application layer information, whereas a packet-filtering firewall cannot filter beyond the network layer.
3. A packet-filtering firewall typically can filter up to the transport layer, whereas a stateful firewall can filter up to the session layer.
4. A packet-filtering firewall uses session layer information to track the state of a connection, whereas a stateful firewall uses application layer information to track the state of a connection.

> Ответ в курсе; см. уточнение ниже

**Ответ:** A packet-filtering firewall typically can filter up to the transport layer, whereas a stateful firewall can filter up to the session layer..

**Объяснение:** Смысл сохранённого ответа: stateless packet filter проверяет заголовки L3/L4, stateful firewall дополнительно хранит состояние соединения. Называть это строгой границей «до session layer» неточно: TCP state находится в транспорте, а набор возможностей зависит от продукта. Поэтому карточка оставлена вне автоматической оценки; изучай различие наличия состояния, а не искусственный потолок OSI.

**Explanation in English:** The intended distinction is that a stateless packet filter checks Layer 3/4 headers while a stateful firewall also tracks connection state. Calling this a strict “up to session layer” boundary is imprecise: TCP state is transport-layer information and capabilities vary by product. The card remains excluded; learn state tracking rather than an artificial OSI ceiling.

### E724. What are two ways to protect a computer from malware? (Choose two.)

Источник: тесты_exam_6, Q46. Тема: модуль 16.

1. Use antivirus software.
2. Empty the browser cache.
3. Keep software up to date.
4. Delete unused software.
5. Defragment the hard disk.

**Ответ:** Use antivirus software.; Keep software up to date..

**Объяснение:** Антивирус обнаруживает/блокирует malware, а обновления закрывают уязвимости, через которые он попадает/распространяется. Очистка cache и дефрагментация не являются защитой от вредоносного кода. Удаление ненужных программ уменьшает поверхность атаки, но два прямых основных средства из вопроса — antivirus и updates.

**Explanation in English:** Antivirus detects/blocks malware and updates fix vulnerabilities used for entry/spread. Clearing cache and defragmenting are not malware defenses. Removing unused software can reduce attack surface, but the two direct main controls asked for are antivirus and updates.

### E725. A network administrator is issuing the login block-for 180 attempts 2 within 30 command on a router. Which threat is the network administrator trying to prevent?

Источник: тесты_exam_6, Q47. Тема: модуль 16.

1. a user who is trying to guess a password to access the router
2. a worm that is attempting to access another part of the network
3. an unidentified individual who is trying to access the network equipment room
4. a device that is trying to inspect the traffic on a link

**Ответ:** a user who is trying to guess a password to access the router.

**Объяснение:** После двух неудачных входов за 30 секунд команда блокирует VTY-входы на 180 секунд. Это замедляет brute-force guessing пароля. Она не останавливает распространение worm как таковое, не защищает физическую серверную и не обнаруживает пассивный перехват трафика.

**Explanation in English:** After two failed logins within 30 seconds, this command blocks VTY login attempts for 180 seconds, slowing brute-force password guessing. It does not directly stop worm propagation, protect the equipment room or detect passive traffic interception.

### E726. The employees and residents of Ciscoville cannot access the Internet or any remote web-based services. IT workers quickly determine that the city firewall is being flooded with so much traffic that a breakdown of connectivity to the Internet is occurring. Which type of attack is being launched at Ciscoville?

Источник: тесты_exam_6, Q48. Тема: модуль 16.

1. Trojan horse
2. reconnaissance
3. DoS
4. access

**Ответ:** DoS.

**Объяснение:** Firewall перегружен трафиком, и законные пользователи потеряли доступ к Интернету: это DoS, нарушение доступности. По условию нельзя утверждать Trojan или факт неразрешённого входа; reconnaissance обычно собирает сведения, а здесь явно описан отказ обслуживания.

**Explanation in English:** Traffic overwhelms the firewall and legitimate users lose Internet access: DoS, an availability attack. The scenario does not establish a Trojan or unauthorized login; reconnaissance generally gathers information, whereas service denial is explicit here.

### E745. A disgruntled employee is using some free wireless networking tools to determine information about the enterprise wireless networks. This person is planning on using this information to hack the wireless network. What type of attack is this?

Источник: тесты_exam_7, Q12. Тема: модуль 16.

1. Reconnaissance
2. Access
3. DoS
4. Trojan horse

**Ответ:** Reconnaissance.

**Объяснение:** Сотрудник пока собирает сведения о Wi-Fi для будущего взлома — стадия reconnaissance. Access attack началась бы при получении неразрешённого доступа; DoS — при нарушении работы; Trojan — вид маскирующегося ПО, которого условие не описывает.

**Explanation in English:** The employee is gathering wireless information for a future break-in: reconnaissance. An access attack would involve unauthorized entry, DoS disruption, and a Trojan disguised software; none of those is the action described yet.

### E746. A company has a file server that shares a folder named Public. The network security policy specifies that the Public folder is assigned Read-Only rights to anyone who can log into the server while the Edit rights are assigned only to the network admin group. Which component is addressed in the AAA network service framework?

Источник: тесты_exam_7, Q13. Тема: модуль 16.

1. accounting
2. automation
3. authorization
4. authentication

**Ответ:** authorization.

**Объяснение:** Разделение Read-only и Edit определяет разрешённые действия уже вошедших пользователей — authorization. Authentication проверяет, кто вошёл; accounting записывает, что он сделал. Automation не компонент AAA.

**Explanation in English:** Assigning Read-only versus Edit determines what already logged-in users may do: authorization. Authentication verifies who logged in, and accounting records actions. Automation is not an AAA component.

### E755. Match the type of threat with the cause. A maintenance threats poor handling of key electrical components (electrostatic discharge), lack of critical spare parts, poor cabling, and poor labeling B electrical threats voltage spikes, insufficient supply voltage (brownouts), unconditioned power (noise), and total power loss C environmental threats temperature extremes (too hot or too cold) or humidity extremes (too wet or too dry) D hardware threats physical damage to servers, routers, switches, cabling plant, and workstations

Источник: тесты_exam_7, Q22. Тема: модуль 16.



> Ответ

**Ответ:** maintenance → ошибки обслуживания, ESD, отсутствие запчастей/маркировки; electrical → скачки/падения напряжения, отключения; environmental → температура и влажность; hardware → физическое повреждение оборудования.

**Объяснение:** ESD/плохое обслуживание/маркировка → maintenance; скачки/просадки/отключения питания → electrical; температура/влажность → environmental; физические повреждения оборудования → hardware. Категории определяются непосредственной причиной: например отказ кондиционера приводит к environmental-угрозе перегрева.

**Explanation in English:** ESD/poor handling/labeling map to maintenance; voltage spikes/brownouts/outages to electrical; temperature/humidity to environmental; physical equipment damage to hardware. Categorize by the immediate cause: air-conditioning failure leads to environmental overheating.

### E779. Users report that the network access is slow. After questioning the employees, the network administrator learned that one employee downloaded a third-party scanning program for the printer. What type of malware might be introduced that causes slow performance of the network?

Источник: тесты_exam_7, Q46. Тема: модуль 16.

1. worm
2. virus
3. spam
4. phishing

**Ответ:** worm.

**Объяснение:** Worm может самостоятельно размножаться и создавать много сетевого трафика, поэтому это возможное объяснение замедления после установки подозрительного ПО. Spam — нежелательные сообщения, phishing — обман для получения сведений. Но из одного замедления нельзя доказать worm; формулировка asks might, а не подтверждённый диагноз.

**Explanation in English:** A worm can replicate independently and generate heavy traffic, so it is a possible explanation after suspicious software installation. Spam is unsolicited messaging and phishing is deceptive information gathering. Slow performance alone cannot prove a worm; the question asks what might have been introduced, not a confirmed diagnosis.

### E792. What characteristic describes a VPN?

Источник: тесты_exam_7, Q59. Тема: модуль 16.

1. a tunneling protocol that provides remote users with secure access into the network of an organization
2. software on a router that filters traffic based on IP addresses or applications
3. a network device that filters access and traffic coming into a network
4. software that identifies fast-spreading threats

**Ответ:** a tunneling protocol that provides remote users with secure access into the network of an organization.

**Объяснение:** В контексте задачи VPN создаёт защищённый туннель, через который удалённый пользователь получает доступ к сети организации. Другие варианты описывают firewall или обнаружение угроз. VPN — семейство решений/технологий, а не один-единственный протокол; здесь имеется в виду безопасный remote-access VPN.

**Explanation in English:** In this task, a VPN provides a protected tunnel for a remote user to access an organization’s network. The other options describe firewalls or threat detection. VPN is a family of solutions/technologies rather than one single protocol; the intended case is a secure remote-access VPN.
