# Computer Networks — вопросы с разбором

Это доступный тематический отбор, а не гарантия вопросов экзамена. Карточки с оговорками сохранены для чтения; автоматические тесты используют только допустимые карточки.

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
