# Вопросы для эндки: модули 8–16

Отобрано **571 вхождение из прежних 795** по содержанию тем 8–16, включая совпадающие темы ранних модулей и смешанных экзаменов. После удаления точных повторов «формулировка + набор вариантов» осталось **558 карточек**. Перефразированные вопросы оставлены: на экзамене важно узнавать смысл. Это тематический отбор, а не подтверждённый список вопросов преподавателя.

Внутри самих модулей 8–16 — **250 вхождений**. Они отдельно в `модули_08–16/`, чтобы начать с основного материала.

Вопросы и варианты сохранены на английском для узнавания на письменном экзамене; объяснения на русском. Правильные варианты указаны текстом, а не только буквами: порядок в NetAcad может меняться. Задания на сопоставление даны готовыми парами. Выбранный в аккаунте ответ сопоставлен с правилом; неоднозначные/неточные формулировки отмечены. Вопросы, зависящие от отсутствующей схемы или PT, не объявлены независимо проверенными.

Для экзаменов сохранён конкретный доступный вариант; это не полный скрытый банк Cisco. У `exam_7` внутренний заголовок был Introduction to Cybersecurity при пункте меню Course Final Exam; вопросы отобраны по содержанию, а не по этому заголовку.


## Модуль 8: Сетевой уровень и маршрутизация

### E029. Which device performs the function of determining the path that messages should take through internetworks?

Источник: модули_01, Q9; тесты_exam_0, Q31. Тема: модуль 8.

1. A router
2. A firewall
3. A web server
4. A DSL modem

**Ответ:** A router.

**Объяснение:** Маршрутизатор ищет сеть назначения в таблице маршрутизации, предпочитая самый длинный совпавший префикс. show ip route показывает таблицу IOS; O означает OSPF, S — static. Default route используется при отсутствии более специфичного маршрута. Windows: route print или netstat -r.

### E066. BGP and OSPF are examples of which type of protocol?

Источник: модули_03, Q1. Тема: модуль 8.

1. Network communication
2. Network security
3. Routing
4. Service discovery

**Ответ:** Routing.

**Объяснение:** Маршрутизатор ищет сеть назначения в таблице маршрутизации, предпочитая самый длинный совпавший префикс. show ip route показывает таблицу IOS; O означает OSPF, S — static. Default route используется при отсутствии более специфичного маршрута. Windows: route print или netstat -r.

### E078. This standards organization is responsible for IP address allocation and domain name management.

Источник: модули_03, Q3. Тема: модуль 8.

1. Internet Society (ISOC)
2. Internet Engineering Task Force (IETF)
3. Internet Architecture Board (IAB)
4. Internet Assigned Numbers Authority (IANA)

**Ответ:** Internet Assigned Numbers Authority (IANA).

**Объяснение:** IANA распределяет крупные адресные ресурсы региональным интернет-регистратурам (RIR), которые выделяют их провайдерам и организациям.

### E085. True or false? The right-most part of an IP address is used to identify the network that a device belongs to.

Источник: модули_03, Q2. Тема: модуль 8.

1. True
2. False

**Ответ:** False.

**Объяснение:** Network address = IP AND subnet mask. При /24 сравнивают первые три октета, при /16 — первые два; совпадение сетевой части означает одну подсеть. Для обычного хоста нельзя использовать адрес сети и broadcast.

### E087. Which of the following statements are true regarding network layer and data link layer addresses? (Choose three.)

Источник: модули_03, Q4. Тема: модуль 8.

1. Data link layer addresses are logical and network layer addresses are physical.
2. Network layer addresses are expressed as 12 hexadecimal digits and data link layer addresses are decimal.
3. Network layer addresses are logical and data link addresses are expressed as 12 hexadecimal digits.
4. Data link layer addresses are physical and network layer addresses are logical.
5. Network layer addresses are either 32 or 128 bits in length.
6. Data link layer addresses are 32 bits in length.

**Ответ:** Network layer addresses are logical and data link addresses are expressed as 12 hexadecimal digits.; Data link layer addresses are physical and network layer addresses are logical.; Network layer addresses are either 32 or 128 bits in length..

**Объяснение:** Source/Destination IP задают конечных отправителя и получателя. Обычно по пути они сохраняются; исключение — преобразование NAT. MAC-адреса относятся к текущему каналу и меняются на маршрутизаторах.

### E096. Which logical address is used for delivery of data to a remote network?

Источник: модули_03, Q7. Тема: модуль 8.

1. Destination MAC address
2. Destination IP address
3. Destination port number
4. Source MAC address
5. Source IP address

**Ответ:** Destination IP address.

**Объяснение:** Маршрутизатор ищет сеть назначения в таблице маршрутизации, предпочитая самый длинный совпавший префикс. show ip route показывает таблицу IOS; O означает OSPF, S — static. Default route используется при отсутствии более специфичного маршрута. Windows: route print или netstat -r.

### E129. Which is the binary equivalent to the 192.168.11.10 IP address?

Источник: модули_05, Q1. Тема: модуль 8.

1. 11000000‬.11000000.00001011‬.‭00001010‬‬
2. 11000000.10101000‬.00001011‬.‭00001010
3. 11000000.10101000‬.00001010‬.‭00001011‬‬
4. 11000000.10101000‬.00001011‬.‭00010010‬‬

**Ответ:** 11000000.10101000‬.00001011‬.‭00001010.

**Объяснение:** Преобразуйте каждый октет отдельно по весам 128, 64, 32, 16, 8, 4, 2, 1. Например 11000000 = 128+64 = 192. Сохраняйте восемь бит в каждой группе.

### E130. Which of the following is the binary equivalent to the 172.16.31.30 IP address?

Источник: модули_05, Q2. Тема: модуль 8.

1. 11000000.00010000‬.00011111‬.‭00011110‬‬
2. 10101000.00010000‬.00011111‬.‭00011110‬‬
3. 10101100.00010000‬.00011110‬.‭00011110‬‬
4. 10101100.00010000‬.00011111‬.‭00011110‬‬

**Ответ:** 10101100.00010000‬.00011111‬.‭00011110‬‬.

**Объяснение:** Преобразуйте каждый октет отдельно по весам 128, 64, 32, 16, 8, 4, 2, 1. Например 11000000 = 128+64 = 192. Сохраняйте восемь бит в каждой группе.

### E162. Which lists the Layer 2 and Layer 3 address fields in the correct order?

Источник: модули_06, Q3. Тема: модуль 8.

1. Destination NIC address, source NIC address, source IP address, destination IP address
2. Source NIC address, destination NIC address, source IP address, destination IP address
3. Destination NIC address, source NIC address, destination IP address, source IP address
4. Source NIC address, destination NIC address, destination IP address, source IP address

**Ответ:** Destination NIC address, source NIC address, source IP address, destination IP address.

**Объяснение:** Source/Destination IP задают конечных отправителя и получателя. Обычно по пути они сохраняются; исключение — преобразование NAT. MAC-адреса относятся к текущему каналу и меняются на маршрутизаторах.

### E196. What type of address is 01-00-5E-0A-00-02?

Источник: модули_07, Q11. Тема: модуль 8.

1. An address that reaches every host inside a local subnet
2. An address that reaches one specific host
3. An address that reaches every host in the network
4. An address that reaches a specific group of hosts

**Ответ:** An address that reaches a specific group of hosts.

**Объяснение:** IPv4 multicast отображается на Ethernet MAC с префиксом 01:00:5E. Это групповой адрес, не индивидуальный unicast и не FF:FF:FF:FF:FF:FF broadcast.

### E200. Which OSI layer sends segments to be encapsulated in an IPv4 or IPv6 packet?

Источник: модули_08, Q1. Тема: модуль 8.

1. Data link layer
2. Network layer
3. Transport layer
4. Session layer

**Ответ:** Transport layer.

**Объяснение:** Транспортный уровень создаёт сегменты; сетевой добавляет IP-заголовок. Поэтому на L3 появляются IP-адреса, а PDU становится пакетом.

### E201. Which layer is responsible for taking an IP packet and preparing it for transmission over the communications medium?

Источник: модули_08, Q2. Тема: модуль 8.

1. Physical layer
2. Network layer
3. Data link layer
4. Transport layer

**Ответ:** Data link layer.

**Объяснение:** Канальный уровень помещает IP-пакет в кадр. Маршрутизатор снимает входной L2-заголовок и формирует новый для следующего канала; IP-пакет передаётся дальше.

### E202. What is the term for splitting up an IP packet when forwarding it from one medium to another medium with a smaller MTU?

Источник: модули_08, Q3. Тема: модуль 8.

1. Encapsulation
2. Fragmentation
3. Segmentation
4. Serialization

**Ответ:** Fragmentation.

**Объяснение:** MTU ограничивает размер пакета, переносимого каналом. IPv4-пакет при допустимой фрагментации делят на части; IPv6-маршрутизатор не фрагментирует, а сообщает Packet Too Big.

### E203. Which delivery method does not guarantee that the packet will be delivered fully without errors?

Источник: модули_08, Q4. Тема: модуль 8.

1. Connectionless
2. Best effort
3. Media independent

**Ответ:** Best effort.

**Объяснение:** IP работает без установления соединения и по принципу best effort: не обещает доставку, порядок или повторную передачу. При необходимости надёжность обеспечивает TCP либо приложение.

### E204. What are the two most commonly referenced fields in an IPv4 packet header that indicate where the packet is coming from and where it is going? (Choose two.)

Источник: модули_08, Q1. Тема: модуль 8.

1. Destination IP address
2. Protocol
3. Time to Live
4. Source IP address
5. Differentiated Services (DS)

**Ответ:** Destination IP address; Source IP address.

**Объяснение:** Source/Destination IP задают конечных отправителя и получателя. Обычно по пути они сохраняются; исключение — преобразование NAT. MAC-адреса относятся к текущему каналу и меняются на маршрутизаторах.

### E205. Which statement is correct about IPv4 packet header fields?

Источник: модули_08, Q2. Тема: модуль 8.

1. The source and destination IPv4 addresses remain the same while travelling from source to destination.
2. The Time to Live field is used to determine the priority of each packet.
3. The Total Length and Header Checksum fields are used to reorder a fragmented packet.
4. The Version field identifies the next level protocol.

**Ответ:** The source and destination IPv4 addresses remain the same while travelling from source to destination..

**Объяснение:** Source/Destination IP задают конечных отправителя и получателя. Обычно по пути они сохраняются; исключение — преобразование NAT. MAC-адреса относятся к текущему каналу и меняются на маршрутизаторах.

### E206. Which field is used to detect corruption in the IPv4 header?

Источник: модули_08, Q3. Тема: модуль 8.

1. Header Checksum
2. Time to Live
3. Protocol
4. Differentiated Services (DS)

**Ответ:** Header Checksum.

**Объяснение:** IPv4 Header Checksum проверяет только заголовок IPv4. Это не проверка всего полезного содержимого и не механизм восстановления потерянных пакетов.

### E207. Which field includes common values such as ICMP (1), TCP (6), and UDP (17)?

Источник: модули_08, Q4. Тема: модуль 8.

1. Header Checksum
2. Time to Live
3. Protocol
4. Differentiated Services (DS)

**Ответ:** Protocol.

**Объяснение:** Поле Protocol говорит, кому передать полезную нагрузку IPv4: ICMP = 1, TCP = 6, UDP = 17. В IPv6 аналогичная роль у Next Header.

### E208. Which three options are major issues associated with IPv4? (Choose three.)

Источник: модули_08, Q1. Тема: модуль 8.

1. IP address depletion
2. Increased network complexity and Internet routing table expansion
3. Connections always active
4. Lack of end-to-end connectivity
5. Global and political boundaries
6. Too many IPv4 addresses available

**Ответ:** IP address depletion; Increased network complexity and Internet routing table expansion; Lack of end-to-end connectivity.

**Объяснение:** IPv4 использует 32 бита и имеет ограниченный запас адресов. IPv6 даёт 128 бит и упрощённый базовый заголовок; достаточное адресное пространство снимает необходимость NAT для экономии адресов.

### E209. Which two options are improvements provided by IPv6 as compared to IPv4? (Choose two.)

Источник: модули_08, Q2. Тема: модуль 8.

1. Header supports additional fields for complex packets
2. Increased the IP address space
3. Standardizes the use of NAT
4. Supports class-based networks
5. Uses a simpler header to provide improved packet handling

**Ответ:** Increased the IP address space; Uses a simpler header to provide improved packet handling.

**Объяснение:** IPv4 использует 32 бита и имеет ограниченный запас адресов. IPv6 даёт 128 бит и упрощённый базовый заголовок; достаточное адресное пространство снимает необходимость NAT для экономии адресов.

### E210. Which is true of the IPv6 header?

Источник: модули_08, Q3. Тема: модуль 8.

1. It consists of 20 octets.
2. It consists of 40 octets.
3. It contains 8 header fields.
4. It contains 12 header fields.

**Ответ:** It consists of 40 octets.; It contains 8 header fields..

**Объяснение:** Базовый IPv6-заголовок имеет фиксированные 40 байт и 8 полей. Extension headers идут отдельно и не входят в эти 40 байт.

### E211. Which is true of the IPv6 packet header?

Источник: модули_08, Q4. Тема: модуль 8.

1. The Hop Limit field replaces the IPv4 Time to Live field.
2. The Source and Destination IPv6 addresses change while travelling from source to destination.
3. The Time to Live field replaces the DiffServ field.
4. The Version field identifies the next header.

**Ответ:** The Hop Limit field replaces the IPv4 Time to Live field..

**Объяснение:** IPv4 TTL и IPv6 Hop Limit уменьшаются на каждом маршрутизаторе. При достижении нуля пакет отбрасывается; это ограничивает петли и позволяет работать traceroute.

### E212. Which statement about host forwarding decisions is true?

Источник: модули_08, Q1. Тема: модуль 8.

1. A host cannot ping itself.
2. A remote destination host is on the same local network as the sending host.
3. Local hosts can reach each other without the need of a router.
4. Routing is enabled on switches to discover the best path to a destination.

**Ответ:** Local hosts can reach each other without the need of a router..

**Объяснение:** Для локального адресата хост передаёт кадр напрямую. Для удалённой сети отправляет кадр MAC-адресу своего шлюза; сам IP destination остаётся адресом удалённого узла. Шлюз должен быть достижим в локальной подсети.

### E213. Which default gateway statement is true?

Источник: модули_08, Q2. Тема: модуль 8.

1. A default gateway is required to send packets to other hosts on the local network.
2. The default gateway address is the IP address of a switch on a remote network.
3. The default gateway address is the IP address of the router on the local network.
4. Traffic can only be forwarded outside the local network if there is no default gateway.

**Ответ:** The default gateway address is the IP address of the router on the local network..

**Объяснение:** Для локального адресата хост передаёт кадр напрямую. Для удалённой сети отправляет кадр MAC-адресу своего шлюза; сам IP destination остаётся адресом удалённого узла. Шлюз должен быть достижим в локальной подсети.

### E214. Which two commands could be entered on a Windows host to view its IPv4 and IPv6 routing table? (Choose two.)

Источник: модули_08, Q3. Тема: модуль 8.

1. netroute -l
2. netstat -r
3. print route
4. route print
5. print net

**Ответ:** netstat -r; route print.

**Объяснение:** Маршрутизатор ищет сеть назначения в таблице маршрутизации, предпочитая самый длинный совпавший префикс. show ip route показывает таблицу IOS; O означает OSPF, S — static. Default route используется при отсутствии более специфичного маршрута. Windows: route print или netstat -r.

### E215. What is the command used on a Cisco IOS router to view the routing table?

Источник: модули_08, Q1. Тема: модуль 8.

1. netstart -r
2. route print
3. show ip route
4. show routing table

**Ответ:** show ip route.

**Объяснение:** Маршрутизатор ищет сеть назначения в таблице маршрутизации, предпочитая самый длинный совпавший префикс. show ip route показывает таблицу IOS; O означает OSPF, S — static. Default route используется при отсутствии более специфичного маршрута. Windows: route print или netstat -r.

### E216. What does a code of “O” indicate next to a route in the routing table?

Источник: модули_08, Q2. Тема: модуль 8.

1. A directly connected route
2. A route with an administrative distance of 0
3. A gateway of last resort
4. A route learned dynamically from OSPF

**Ответ:** A route learned dynamically from OSPF.

**Объяснение:** Маршрутизатор ищет сеть назначения в таблице маршрутизации, предпочитая самый длинный совпавший префикс. show ip route показывает таблицу IOS; O означает OSPF, S — static. Default route используется при отсутствии более специфичного маршрута. Windows: route print или netstat -r.

### E217. This type of route is also known as a gateway of last resort.

Источник: модули_08, Q3. Тема: модуль 8.

1. Static route
2. Remote route
3. Default route
4. Directly connected route

**Ответ:** Default route.

**Объяснение:** Маршрутизатор ищет сеть назначения в таблице маршрутизации, предпочитая самый длинный совпавший префикс. show ip route показывает таблицу IOS; O означает OSPF, S — static. Default route используется при отсутствии более специфичного маршрута. Windows: route print или netstat -r.

### E218. Which is a characteristic of static routes?

Источник: модули_08, Q4. Тема: модуль 8.

1. They are manually configured.
2. They are advertised to directly connected neighbors.
3. They are appropriate when there are many redundant links.
4. They automatically adjust to a change in network topology.

**Ответ:** They are manually configured..

**Объяснение:** Маршрутизатор ищет сеть назначения в таблице маршрутизации, предпочитая самый длинный совпавший префикс. show ip route показывает таблицу IOS; O означает OSPF, S — static. Default route используется при отсутствии более специфичного маршрута. Windows: route print или netstat -r.

### E219. True or False? A router can be configured with a combination of both static routes and a dynamic routing protocol.

Источник: модули_08, Q5. Тема: модуль 8.

1. True
2. False

**Ответ:** True.

**Объяснение:** Маршрутизатор ищет сеть назначения в таблице маршрутизации, предпочитая самый длинный совпавший префикс. show ip route показывает таблицу IOS; O означает OSPF, S — static. Default route используется при отсутствии более специфичного маршрута. Windows: route print или netstat -r.

### E220. Which command can be used on a Windows host to display the routing table?

Источник: модули_08, Q1. Тема: модуль 8.

1. netstat -s
2. show ip route
3. netstat -r
4. tracert

**Ответ:** netstat -r.

**Объяснение:** Маршрутизатор ищет сеть назначения в таблице маршрутизации, предпочитая самый длинный совпавший префикс. show ip route показывает таблицу IOS; O означает OSPF, S — static. Default route используется при отсутствии более специфичного маршрута. Windows: route print или netstat -r.

### E221. What information is added during encapsulation at OSI Layer 3?

Источник: модули_08, Q2. Тема: модуль 8.

1. Source and destination MAC
2. Source and destination application protocol
3. Source and destination port number
4. Source and destination IP address

**Ответ:** Source and destination IP address.

**Объяснение:** Транспортный уровень создаёт сегменты; сетевой добавляет IP-заголовок. Поэтому на L3 появляются IP-адреса, а PDU становится пакетом.

### E222. How does the network layer use the MTU value?

Источник: модули_08, Q3. Тема: модуль 8.

1. The network layer depends on the higher level layers to determine the MTU.
2. The network layer depends on the data link layer to set the MTU, and adjusts the speed of transmission to accommodate it.
3. The MTU is passed to the network layer by the data link layer.
4. To increase speed of delivery, the network layer ignores the MTU.

**Ответ:** The MTU is passed to the network layer by the data link layer..

**Объяснение:** MTU ограничивает размер пакета, переносимого каналом. IPv4-пакет при допустимой фрагментации делят на части; IPv6-маршрутизатор не фрагментирует, а сообщает Packet Too Big.

### E223. Which characteristic describes an IPv6 enhancement over IPv4?

Источник: модули_08, Q4. Тема: модуль 8.

1. IPv6 addresses are based on 128-bit flat addressing as opposed to IPv4 which is based on 32-bit hierarchical addressing.
2. The IPv6 header is simpler than the IPv4 header is, which improves packet handling.
3. Both IPv4 and IPv6 support authentication, but only IPv6 supports privacy capabilities.
4. The IPv6 address space is four times bigger than the IPv4 address space.

**Ответ:** The IPv6 header is simpler than the IPv4 header is, which improves packet handling..

**Объяснение:** IPv4 использует 32 бита и имеет ограниченный запас адресов. IPv6 даёт 128 бит и упрощённый базовый заголовок; достаточное адресное пространство снимает необходимость NAT для экономии адресов.

### E224. Which statement accurately describes a characteristic of IPv4?

Источник: модули_08, Q5. Тема: модуль 8.

1. All IPv4 addresses are assignable to hosts.
2. IPv4 has a 32-bit address space.
3. An IPv4 header has fewer fields than an IPv6 header has.
4. IPv4 natively supports IPsec.

**Ответ:** IPv4 has a 32-bit address space..

**Объяснение:** IPv4 — 32 бита: четыре десятичных октета по 8 бит. IPv6 — 128 бит, обычно восемь шестнадцатеричных групп. Формат записи не меняет размер адреса.

### E225. When a router receives a packet, what information must be examined in order for the packet to be forwarded to a remote destination?

Источник: модули_08, Q6. Тема: модуль 8.

1. Destination MAC address
2. Source IP address
3. Destination IP address
4. Source MAC address

**Ответ:** Destination IP address.

**Объяснение:** Маршрутизатор ищет сеть назначения в таблице маршрутизации, предпочитая самый длинный совпавший префикс. show ip route показывает таблицу IOS; O означает OSPF, S — static. Default route используется при отсутствии более специфичного маршрута. Windows: route print или netstat -r.

### E226. A computer has to send a packet to a destination host in the same LAN. How will the packet be sent?

Источник: модули_08, Q7. Тема: модуль 8.

1. The packet will be sent to the default gateway first, and then, depending on the response from the gateway, it may be sent to the destination host.
2. The packet will be sent directly to the destination host.
3. The packet will first be sent to the default gateway, and then from the default gateway it will be sent directly to the destination host.
4. The packet will be sent only to the default gateway.

**Ответ:** The packet will be sent directly to the destination host..

**Объяснение:** Для локального адресата хост передаёт кадр напрямую. Для удалённой сети отправляет кадр MAC-адресу своего шлюза; сам IP destination остаётся адресом удалённого узла. Шлюз должен быть достижим в локальной подсети.

### E227. Which IPv4 address can a host use to ping the loopback interface?

Источник: модули_08, Q8. Тема: модуль 8.

1. 126.0.0.1
2. 127.0.0.0
3. 126.0.0.0
4. 127.0.0.1

**Ответ:** 127.0.0.1.

**Объяснение:** 127.0.0.1 для IPv4 и ::1 для IPv6 — loopback. Ответ проверяет локальный IP-стек; он не доказывает исправность кабеля, шлюза или интернета.

### E228. When a connectionless protocol is in use at a lower layer of the OSI model, how is missing data detected and retransmitted if necessary?

Источник: модули_08, Q9. Тема: модуль 8.

1. Connectionless acknowledgements are used to request retransmission.
2. Upper-layer connection-oriented protocols keep track of the data received and can request retransmission from the upper-level protocols on the sending host.
3. Network layer IP protocols manage the communication sessions if connection-oriented transport services are not available.
4. The best-effort delivery process guarantees that all packets that are sent are received.

**Ответ:** Upper-layer connection-oriented protocols keep track of the data received and can request retransmission from the upper-level protocols on the sending host..

**Объяснение:** IP работает без установления соединения и по принципу best effort: не обещает доставку, порядок или повторную передачу. При необходимости надёжность обеспечивает TCP либо приложение.

### E229. What was the reason for the creation and implementation of IPv6?

Источник: модули_08, Q10. Тема: модуль 8.

1. To make reading a 32-bit address easier
2. To relieve IPv4 address depletion
3. To provide more address space in the Internet Names Registry
4. To allow NAT support for private addressing

**Ответ:** To relieve IPv4 address depletion.

**Объяснение:** IPv4 использует 32 бита и имеет ограниченный запас адресов. IPv6 даёт 128 бит и упрощённый базовый заголовок; достаточное адресное пространство снимает необходимость NAT для экономии адресов.

### E230. Which information is used by routers to forward a data packet toward its destination?

Источник: модули_08, Q11. Тема: модуль 8.

1. Source IP address
2. Destination IP address
3. Source data-link address
4. Destination data-link address

**Ответ:** Destination IP address.

**Объяснение:** Маршрутизатор ищет сеть назначения в таблице маршрутизации, предпочитая самый длинный совпавший префикс. show ip route показывает таблицу IOS; O означает OSPF, S — static. Default route используется при отсутствии более специфичного маршрута. Windows: route print или netstat -r.

### E231. Which field in an IPv4 packet header will typically stay the same during its transmission?

Источник: модули_08, Q12. Тема: модуль 8.

1. Flag
2. Time-to-Live
3. Packet Length
4. Destination Address

**Ответ:** Destination Address.

**Объяснение:** Source/Destination IP задают конечных отправителя и получателя. Обычно по пути они сохраняются; исключение — преобразование NAT. MAC-адреса относятся к текущему каналу и меняются на маршрутизаторах.

### E232. Which field in an IPv6 packet is used by the router to determine if a packet has expired and should be dropped?

Источник: модули_08, Q13. Тема: модуль 8.

1. TTL
2. Hop Limit
3. Address Unreachable
4. No Route to Destination

**Ответ:** Hop Limit.

**Объяснение:** IPv4 TTL и IPv6 Hop Limit уменьшаются на каждом маршрутизаторе. При достижении нуля пакет отбрасывается; это ограничивает петли и позволяет работать traceroute.

### E475. Which two traffic types require delay sensitive delivery? (Choose two.)

Источник: модули_17, Q12. Тема: модуль 8.

1. Email
2. Web
3. FTP
4. Voice
5. Video

**Ответ:** Voice; Video.

**Объяснение:** Голос и интерактивное видео чувствительны к задержке и jitter: запоздавший фрагмент часто уже бесполезен. Этим объясняется выбор UDP и механизмов приоритизации для real-time.

### E483. What is the usable number of host IP addresses on a network that has a /26 mask?

Источник: тесты_IP_Addressing, Q5. Тема: модуль 8.

1. 256
2. 254
3. 64
4. 62
5. 32
6. 16

**Ответ:** 62.

**Объяснение:** Для обычной IPv4 LAN с h битами хоста: 2^h адресов, 2^h−2 пригодных хостам. /26: 64−2=62; /27: 32−2=30; /28: 16−2=14; /25: 128−2=126; /22: 1024−2=1022. /31 и /32 — отдельные случаи.

### E486. How many bits must be borrowed from the host portion of an address to accommodate a router with five connected networks?

Источник: тесты_IP_Addressing, Q8. Тема: модуль 8.

1. two
2. three
3. four
4. five

**Ответ:** three.

**Объяснение:** Число равных подсетей = 2^b, где b — число дополнительно занятых сетевых битов. /24→/26 занимает 2 бита и даёт 4 подсети. Для пяти сетей нужны 3 бита (8 вариантов). При VLSM размеры подсетей различаются.

### E529. At which layer of the OSI model would a logical address be added during encapsulation?

Источник: тесты_exam_0, Q18. Тема: модуль 8.

1. physical layer
2. data link layer
3. network layer
4. transport layer

**Ответ:** network layer.

**Объяснение:** Транспортный уровень создаёт сегменты; сетевой добавляет IP-заголовок. Поэтому на L3 появляются IP-адреса, а PDU становится пакетом.

### E539. Why would a Layer 2 switch need an IP address?

Источник: тесты_exam_0, Q28. Тема: модуль 8.

1. to enable the switch to send broadcast frames to attached PCs
2. to enable the switch to function as a default gateway
3. to enable the switch to be managed remotely
4. to enable the switch to receive frames from attached PCs

**Ответ:** to enable the switch to be managed remotely.

**Объяснение:** SVI — программный интерфейс VLAN, без отдельного физического порта. На L2-коммутаторе его IP позволяет управлять устройством; в начальных примерах используется VLAN 1. Для удалённой сети нужен default gateway.

### E544. At which OSI layer is a destination IP address added to a PDU during the encapsulation process?

Источник: тесты_exam_0, Q33. Тема: модуль 8.

1. network layer
2. application layer
3. transport layer
4. presentation layer

**Ответ:** network layer.

**Объяснение:** Транспортный уровень создаёт сегменты; сетевой добавляет IP-заголовок. Поэтому на L3 появляются IP-адреса, а PDU становится пакетом.

### E581. What is a basic characteristic of the IP protocol?

Источник: тесты_exam_2, Q3. Тема: модуль 8.

1. connectionless
2. media dependent
3. user data segmentation
4. reliable end-to-end delivery

**Ответ:** connectionless.

**Объяснение:** IP работает без установления соединения и по принципу best effort: не обещает доставку, порядок или повторную передачу. При необходимости надёжность обеспечивает TCP либо приложение.

### E586. Which statement describes a feature of the IP protocol?

Источник: тесты_exam_2, Q8. Тема: модуль 8.

1. IP encapsulation is modified based on network media.
2. IP relies on Layer 2 protocols for transmission error control.
3. MAC addresses are used during the IP packet encapsulation.
4. IP relies on upper layer services to handle situations of missing or out-of-order packets.

**Ответ:** IP relies on upper layer services to handle situations of missing or out-of-order packets..

**Объяснение:** IP работает без установления соединения и по принципу best effort: не обещает доставку, порядок или повторную передачу. При необходимости надёжность обеспечивает TCP либо приложение.

### E587. What IPv4 header field identifies the upper layer protocol carried in the packet?

Источник: тесты_exam_2, Q9. Тема: модуль 8.

1. Protocol
2. Identification
3. Version
4. Differentiated Services

**Ответ:** Protocol.

**Объяснение:** Поле Protocol говорит, кому передать полезную нагрузку IPv4: ICMP = 1, TCP = 6, UDP = 17. В IPv6 аналогичная роль у Next Header.

### E598. Refer to the exhibit. A user PC has successfully transmitted packets to www.cisco.com. Which IP address does the user PC target in order to forward its data off the local network?

Источник: тесты_exam_2, Q20. Тема: модуль 8.

1. 172.24.255.17
2. 172.24.1.22
3. 172.20.0.254
4. 172.24.255.4
5. 172.20.1.18

**Ответ для показанного варианта (нужна схема/PT для полной проверки):** 172.20.0.254.

**Объяснение:** Для локального адресата хост передаёт кадр напрямую. Для удалённой сети отправляет кадр MAC-адресу своего шлюза; сам IP destination остаётся адресом удалённого узла. Шлюз должен быть достижим в локальной подсети.

**Проверка условия:** исходный рисунок или PT-файл не включён в прежнюю текстовую выгрузку. Конкретные адреса/порты выше сохранены из отображённого варианта; это не универсальный ответ для иной схемы.

### E608. Open the PT activity. Perform the tasks in the activity instructions and then answer the question. Which interfaces in each router are active and operational?

Источник: тесты_exam_2, Q30. Тема: модуль 8.

1. R1: G0/0 and S0/0/0 R2: G0/0 and S0/0/0
2. R1: G0/1 and S0/0/1 R2: G0/0 and S0/0/1
3. R1: G0/0 and S0/0/0 R2: G0/1 and S0/0/0
4. R1: G0/0 and S0/0/1 R2: G0/1 and S0/0/1

**Ответ для показанного варианта (нужна схема/PT для полной проверки):** R1: G0/0 and S0/0/0 R2: G0/1 and S0/0/0.

**Объяснение:** Активный и работающий интерфейс в show ip interface brief имеет Status up и Protocol up. Указанные имена портов относятся к конкретной PT-топологии; без файла проверить именно этот набор нельзя.

**Проверка условия:** исходный рисунок или PT-файл не включён в прежнюю текстовую выгрузку. Конкретные адреса/порты выше сохранены из отображённого варианта; это не универсальный ответ для иной схемы.

### E609. Which term describes a field in the IPv4 packet header that contains a 4-bit binary value set to 0100?

Источник: тесты_exam_2, Q31. Тема: модуль 8.

1. Version
2. Source IPv4 address
3. Protocol
4. TTL

**Ответ:** Version.

**Объяснение:** Поле Version имеет 4 бита: двоичное 0100 означает IPv4, 0110 — IPv6. Это не длина заголовка и не поле Protocol.

### E620. What kind of port must be requested from IANA in order to be used with a specific application?

Источник: тесты_exam_4, Q9. Тема: модуль 8.

1. registered port
2. private port
3. dynamic port
4. source port

**Ответ:** registered port.

**Объяснение:** Well-known/system ports: 0–1023; registered: 1024–49151; dynamic/private: 49152–65535. netstat показывает соединения и порты. Telnet = TCP 23, SSH = TCP 22, DHCP server = UDP 67.

### E635. What is true about the Server Message Block protocol?

Источник: тесты_exam_4, Q24. Тема: модуль 8.

1. Different SMB message types have a different format.
2. Clients establish a long term connection to servers.
3. SMB messages cannot authenticate a session.
4. SMB uses the FTP protocol for communication.

**Ответ:** Clients establish a long term connection to servers..

**Объяснение:** SMB предназначен для совместного доступа к файлам/принтерам и поддерживает длительную сессию. Он доступен и вне Windows, например через Samba. FTP в первую очередь переносит файлы.

### E699. What routing table entry has a next hop address associated with a destination network?

Источник: тесты_exam_6, Q21. Тема: модуль 8.

1. directly-connected routes
2. local routes
3. remote routes
4. C and L source routes

**Ответ:** remote routes.

**Объяснение:** Маршрутизатор ищет сеть назначения в таблице маршрутизации, предпочитая самый длинный совпавший префикс. show ip route показывает таблицу IOS; O означает OSPF, S — static. Default route используется при отсутствии более специфичного маршрута. Windows: route print или netstat -r.

### E708. What type of address is 198.133.219.162?

Источник: тесты_exam_6, Q30. Тема: модуль 8.

1. public
2. link-local
3. loopback
4. multicast

**Ответ:** public.

**Объяснение:** Частные IPv4-диапазоны: 10/8, 172.16/12, 192.168/16. Они не маршрутизируются в публичном интернете как глобальные адреса. 169.254/16 — link-local, 127/8 — loopback, 192.0.2/24 — документация.

### E739. Which value, that is contained in an IPv4 header field, is decremented by each router that receives a packet?

Источник: тесты_exam_7, Q6. Тема: модуль 8.

1. Differentiated Services
2. Fragment Offset
3. Header Length
4. Time-to-Live

**Ответ:** Time-to-Live.

**Объяснение:** IPv4 TTL и IPv6 Hop Limit уменьшаются на каждом маршрутизаторе. При достижении нуля пакет отбрасывается; это ограничивает петли и позволяет работать traceroute.

### E744. Refer to the exhibit. Match the network with the correct IP address and prefix that will satisfy the usable host addressing requirements for each network. A Network D 192.168.0.224 /30 B Network C 192.168.0.192 /27 C Network A 192.168.0.0 /25 D Network B 192.168.0.128 /26

Источник: тесты_exam_7, Q11. Тема: модуль 8.

**Ответ для показанного варианта (нужна схема/PT для полной проверки):** Network A → 192.168.0.0/25; Network B → 192.168.0.128/26; Network C → 192.168.0.192/27; Network D → 192.168.0.224/30.

**Объяснение:** Размеры /25, /26, /27, /30 дают 126, 62, 30, 2 пригодных IPv4-адреса. При VLSM начинают с самой большой сети и размещают непересекающиеся блоки по границам соответствующего размера.

**Проверка условия:** исходный рисунок или PT-файл не включён в прежнюю текстовую выгрузку. Конкретные адреса/порты выше сохранены из отображённого варианта; это не универсальный ответ для иной схемы.

### E749. What are two functions that are provided by the network layer? (Choose two.)

Источник: тесты_exam_7, Q16. Тема: модуль 8.

1. carrying data between processes that are running on source and destination hosts
2. providing end devices with a unique network identifier
3. placing data on the network medium
4. directing data packets to destination hosts on other networks
5. providing dedicated end-to-end connections

**Ответ:** providing end devices with a unique network identifier; directing data packets to destination hosts on other networks.

**Объяснение:** Маршрутизатор ищет сеть назначения в таблице маршрутизации, предпочитая самый длинный совпавший префикс. show ip route показывает таблицу IOS; O означает OSPF, S — static. Default route используется при отсутствии более специфичного маршрута. Windows: route print или netstat -r.

### E764. What mechanism is used by a router to prevent a received IPv4 packet from traveling endlessly on a network?

Источник: тесты_exam_7, Q31. Тема: модуль 8.

1. It checks the value of the TTL field and if it is 0, it discards the packet and sends a Destination Unreachable message to the source host.
2. It checks the value of the TTL field and if it is 100, it discards the packet and sends a Destination Unreachable message to the source host.
3. It decrements the value of the TTL field by 1 and if the result is 0, it discards the packet and sends a Time Exceeded message to the source host.
4. It increments the value of the TTL field by 1 and if the result is 100, it discards the packet and sends a Parameter Problem message to the source host.

**Ответ:** It decrements the value of the TTL field by 1 and if the result is 0, it discards the packet and sends a Time Exceeded message to the source host..

**Объяснение:** IPv4 TTL и IPv6 Hop Limit уменьшаются на каждом маршрутизаторе. При достижении нуля пакет отбрасывается; это ограничивает петли и позволяет работать traceroute.

### E768. What are two characteristics of IP? (Choose two.)

Источник: тесты_exam_7, Q35. Тема: модуль 8.

1. does not require a dedicated end-to-end connection
2. operates independently of the network media
3. retransmits packets if errors occur
4. re-assembles out of order packets into the correct order at the receiver end
5. guarantees delivery of packets

**Ответ:** does not require a dedicated end-to-end connection; operates independently of the network media.

**Объяснение:** IP работает без установления соединения и по принципу best effort: не обещает доставку, порядок или повторную передачу. При необходимости надёжность обеспечивает TCP либо приложение.

### E777. Refer to the exhibit. On the basis of the output, which two statements about network connectivity are correct? (Choose two.)

Источник: тесты_exam_7, Q44. Тема: модуль 8.

1. There is connectivity between this device and the device at 192.168.100.1.
2. The connectivity between these two hosts allows for videoconferencing calls.
3. There are 4 hops between this device and the device at 192.168.100.1.
4. The average transmission time between the two hosts is 2 milliseconds.
5. This host does not have a default gateway configured.

**Ответ для показанного варианта (нужна схема/PT для полной проверки):** There is connectivity between this device and the device at 192.168.100.1.; There are 4 hops between this device and the device at 192.168.100.1..

**Объяснение:** traceroute/tracert последовательно увеличивает TTL/Hop Limit и получает ответы от промежуточных маршрутизаторов. Time Exceeded показывает очередной hop. Молчание hop может означать фильтрацию ICMP, а не обязательно поломку.

**Проверка условия:** исходный рисунок или PT-файл не включён в прежнюю текстовую выгрузку. Конкретные адреса/порты выше сохранены из отображённого варианта; это не универсальный ответ для иной схемы.


## Модуль 9: ARP и Neighbor Discovery

### E188. What is the special value assigned to the first 24 bits of a multicast MAC address transporting an IPv4 packet?

Источник: модули_07, Q3. Тема: модуль 9.

1. 01-5E-00
2. FF-00-5E
3. FF-FF-FF
4. 01-00-5E

**Ответ:** 01-00-5E.

**Объяснение:** IPv4 multicast отображается на Ethernet MAC с префиксом 01:00:5E. Это групповой адрес, не индивидуальный unicast и не FF:FF:FF:FF:FF:FF broadcast.

### E190. Which network device makes forwarding decisions based on the destination MAC address that is contained in the frame?

Источник: модули_07, Q5. Тема: модуль 9.

1. Repeater
2. Hub
3. Switch
4. Router

**Ответ:** Switch.

**Объяснение:** Коммутатор обучается по source MAC входящего кадра и запоминает порт. Пересылает по destination MAC. Повторное получение обновляет возраст записи, а неизвестный destination вызывает flood в пределах VLAN.

### E191. Which network device has the primary function to send data to a specific destination based on the information found in the MAC address table?

Источник: модули_07, Q6. Тема: модуль 9.

1. Hub
2. Router
3. Switch
4. Modem

**Ответ:** Switch.

**Объяснение:** Коммутатор обучается по source MAC входящего кадра и запоминает порт. Пересылает по destination MAC. Повторное получение обновляет возраст записи, а неизвестный destination вызывает flood в пределах VLAN.

### E194. What addressing information is recorded by a switch to build its MAC address table?

Источник: модули_07, Q9. Тема: модуль 9.

1. The destination Layer 3 address of incoming packets
2. The destination Layer 2 address of outgoing frames
3. The source Layer 3 address of outgoing packets
4. The source Layer 2 address of incoming frames

**Ответ:** The source Layer 2 address of incoming frames.

**Объяснение:** Коммутатор обучается по source MAC входящего кадра и запоминает порт. Пересылает по destination MAC. Повторное получение обновляет возраст записи, а неизвестный destination вызывает flood в пределах VLAN.

### E233. What destination MAC address would be included in a frame sent from a source device to a destination device on the same local network?

Источник: модули_09, Q1. Тема: модуль 9.

1. A broadcast MAC address of FF-FF-FF-FF-FF-FF.
2. The MAC address of the destination device.
3. The MAC address of the local router interface.

**Ответ:** The MAC address of the destination device..

**Объяснение:** ARP сопоставляет IPv4 с MAC на локальном канале: запрос обычно broadcast, ответ владельца IP — unicast. Для удалённой сети узнают MAC шлюза. IPv6 использует ICMPv6 ND (NS/NA), а не ARP. arp -a/show ip arp читают кэш, arp -d очищает его.

### E234. What destination MAC address would be included in a frame sent from a source device to a destination device on a remote local network?

Источник: модули_09, Q2. Тема: модуль 9.

1. A broadcast MAC address of FF-FF-FF-FF-FF-FF.
2. The MAC address of the destination device.
3. The MAC address of the local router interface.

**Ответ:** The MAC address of the local router interface..

**Объяснение:** Для локального адресата хост передаёт кадр напрямую. Для удалённой сети отправляет кадр MAC-адресу своего шлюза; сам IP destination остаётся адресом удалённого узла. Шлюз должен быть достижим в локальной подсети.

### E235. What two protocols are used to determine the MAC address of a known destination device IP address (IPv4 and IPv6)?

Источник: модули_09, Q3. Тема: модуль 9.

1. DHCP
2. ARP
3. DNS
4. ND

**Ответ:** ARP; ND.

**Объяснение:** ARP сопоставляет IPv4 с MAC на локальном канале: запрос обычно broadcast, ответ владельца IP — unicast. Для удалённой сети узнают MAC шлюза. IPv6 использует ICMPv6 ND (NS/NA), а не ARP. arp -a/show ip arp читают кэш, arp -d очищает его.

### E236. What two functions are provided by ARP? (Choose two.)

Источник: модули_09, Q1. Тема: модуль 9.

1. Maintains a table of IPv4 address to domain names
2. Maintains a table of IPv4 to MAC address mappings
3. Maintains a table of IPv6 to MAC address mappings
4. Resolves IPv4 addresses to domain names
5. Resolves IPv4 addresses to MAC addresses
6. Resolves IPv6 addresses to MAC addresses

**Ответ:** Maintains a table of IPv4 to MAC address mappings; Resolves IPv4 addresses to MAC addresses.

**Объяснение:** ARP сопоставляет IPv4 с MAC на локальном канале: запрос обычно broadcast, ответ владельца IP — unicast. Для удалённой сети узнают MAC шлюза. IPv6 использует ICMPv6 ND (NS/NA), а не ARP. arp -a/show ip arp читают кэш, arp -d очищает его.

### E237. Where is the ARP table stored on a device?

Источник: модули_09, Q2. Тема: модуль 9.

1. ROM
2. Flash
3. NVRAM
4. RAM

**Ответ:** RAM.

**Объяснение:** RAM энергозависима: там running-config, таблицы маршрутов и ARP-кэш. NVRAM сохраняет startup-config после отключения питания. Динамические ARP-записи временные.

### E238. Which statement is true about ARP?

Источник: модули_09, Q3. Тема: модуль 9.

1. An ARP cache cannot be manually deleted.
2. ARP entries are cached permanently.
3. ARP entries are cached temporarily.

**Ответ:** ARP entries are cached temporarily..

**Объяснение:** RAM энергозависима: там running-config, таблицы маршрутов и ARP-кэш. NVRAM сохраняет startup-config после отключения питания. Динамические ARP-записи временные.

### E239. Which command could be used on a Cisco router to view its ARP table?

Источник: модули_09, Q4. Тема: модуль 9.

1. arp -a
2. arp -d
3. show arp table
4. show ip arp

**Ответ:** show ip arp.

**Объяснение:** ARP сопоставляет IPv4 с MAC на локальном канале: запрос обычно broadcast, ответ владельца IP — unicast. Для удалённой сети узнают MAC шлюза. IPv6 использует ICMPv6 ND (NS/NA), а не ARP. arp -a/show ip arp читают кэш, arp -d очищает его.

### E240. What is an attack using ARP?

Источник: модули_09, Q5. Тема: модуль 9.

1. ARP broadcasts
2. ARP hopping attacks
3. ARP poisoning
4. ARP starvation

**Ответ:** ARP poisoning.

**Объяснение:** ARP poisoning подменяет соответствие IP→MAC, например убеждает жертву отправлять трафик шлюза атакующему. ARP сам по себе не аутентифицирует такие заявления.

### E241. Which two ICMPv6 messages are used in SLAAC?

Источник: модули_09, Q1. Тема: модуль 9.

1. Neighbor advertisement
2. Neighbor solicitation
3. Router advertisement
4. Router solicitation

**Ответ:** Router advertisement; Router solicitation.

**Объяснение:** RS запрашивает информацию у маршрутизаторов, RA сообщает префиксы/параметры сети. NS/NA разрешают адрес соседа и помогают DAD проверить уникальность IPv6-адреса. NS обычно направляется solicited-node multicast, а не broadcast.

### E242. Which two ICMPv6 messages are used in to determine the MAC address of a known IPv6 address?

Источник: модули_09, Q2. Тема: модуль 9.

1. Neighbor advertisement
2. Neighbor solicitation
3. Router advertisement
4. Router solicitation

**Ответ:** Neighbor advertisement; Neighbor solicitation.

**Объяснение:** RS запрашивает информацию у маршрутизаторов, RA сообщает префиксы/параметры сети. NS/NA разрешают адрес соседа и помогают DAD проверить уникальность IPv6-адреса. NS обычно направляется solicited-node multicast, а не broadcast.

### E243. To what type of address are ICMPv6 neighbor solicitation messages sent?

Источник: модули_09, Q3. Тема: модуль 9.

1. Unicast
2. Multicast
3. Broadcast

**Ответ:** Multicast.

**Объяснение:** RS запрашивает информацию у маршрутизаторов, RA сообщает префиксы/параметры сети. NS/NA разрешают адрес соседа и помогают DAD проверить уникальность IPv6-адреса. NS обычно направляется solicited-node multicast, а не broadcast.

### E244. Which router component holds the routing table, ARP cache, and running configuration file?

Источник: модули_09, Q1. Тема: модуль 9.

1. RAM
2. Flash
3. NVRAM
4. ROM

**Ответ:** RAM.

**Объяснение:** RAM энергозависима: там running-config, таблицы маршрутов и ARP-кэш. NVRAM сохраняет startup-config после отключения питания. Динамические ARP-записи временные.

### E245. What type of information is contained in an ARP table?

Источник: модули_09, Q2. Тема: модуль 9.

1. Switch ports associated with destination MAC addresses
2. Domain name to IPv4 address mappings
3. Routes to reach destination networks
4. IPv4 address to MAC address mappings

**Ответ:** IPv4 address to MAC address mappings.

**Объяснение:** ARP сопоставляет IPv4 с MAC на локальном канале: запрос обычно broadcast, ответ владельца IP — unicast. Для удалённой сети узнают MAC шлюза. IPv6 использует ICMPv6 ND (NS/NA), а не ARP. arp -a/show ip arp читают кэш, arp -d очищает его.

### E246. A PC is configured to obtain an IPv4 address automatically from network 192.168.1.0/24. The network administrator issues the arp -a command and notices an entry of 192.168.1.255 ff-ff-ff-ff-ff-ff. Which statement describes this entry?

Источник: модули_09, Q3. Тема: модуль 9.

1. This is a static map entry.
2. This is a dynamic map entry.
3. This entry refers to the PC itself.
4. This entry maps to the default gateway.

**Ответ:** This is a static map entry..

**Объяснение:** 192.168.1.255 — broadcast для /24; ему соответствует Ethernet FF-FF-FF-FF-FF-FF. Это служебное статическое соответствие, а не динамически найденный индивидуальный сосед.

### E247. A cybersecurity analyst believes an attacker is spoofing the MAC address of the default gateway to perform a man-in-the-middle attack. Which command should the analyst use to view the MAC address a host is using to reach the default gateway?

Источник: модули_09, Q4. Тема: модуль 9.

1. ipconfig /all
2. route print
3. netstat -r
4. arp -a

**Ответ:** arp -a.

**Объяснение:** ARP сопоставляет IPv4 с MAC на локальном канале: запрос обычно broadcast, ответ владельца IP — unicast. Для удалённой сети узнают MAC шлюза. IPv6 использует ICMPv6 ND (NS/NA), а не ARP. arp -a/show ip arp читают кэш, arp -d очищает его.

### E248. What will a Layer 2 switch do when the destination MAC address of a received frame is not in the MAC table?

Источник: модули_09, Q5. Тема: модуль 9.

1. It initiates an ARP request.
2. It broadcasts the frame out of all ports on the switch.
3. It notifies the sending host that the frame cannot be delivered.
4. It forwards the frame out of all ports except for the port at which the frame was received.

**Ответ:** It forwards the frame out of all ports except for the port at which the frame was received..

**Объяснение:** Коммутатор рассылает broadcast и unknown unicast по портам той же VLAN, кроме входного. Если destination MAC известен, кадр направляют на соответствующий порт.

### E249. Which two ICMPv6 messages are used during the Ethernet MAC address resolution process? (Choose two.)

Источник: модули_09, Q6. Тема: модуль 9.

1. Router solicitation
2. Router advertisement
3. Neighbor solicitation
4. Neighbor advertisement
5. Echo request

**Ответ:** Neighbor solicitation; Neighbor advertisement.

**Объяснение:** ARP сопоставляет IPv4 с MAC на локальном канале: запрос обычно broadcast, ответ владельца IP — unicast. Для удалённой сети узнают MAC шлюза. IPv6 использует ICMPv6 ND (NS/NA), а не ARP. arp -a/show ip arp читают кэш, arp -d очищает его.

### E250. How does the ARP process use an IPv4 address?

Источник: модули_09, Q7. Тема: модуль 9.

1. To determine the MAC address of the remote destination host
2. To determine the MAC address of a device on the same network
3. To determine the amount of time a packet takes when traveling from source to destination
4. To determine the network number based on the number of bits in the IPv4 address

**Ответ:** To determine the MAC address of a device on the same network.

**Объяснение:** ARP сопоставляет IPv4 с MAC на локальном канале: запрос обычно broadcast, ответ владельца IP — unicast. Для удалённой сети узнают MAC шлюза. IPv6 использует ICMPv6 ND (NS/NA), а не ARP. arp -a/show ip arp читают кэш, arp -d очищает его.

### E251. What is one function of the ARP protocol?

Источник: модули_09, Q8. Тема: модуль 9.

1. Obtaining an IPv4 address automatically
2. Mapping a domain name to its IP address
3. Resolving an IPv4 address to a MAC address
4. Maintaining a table of domain names with their resolved IP addresses

**Ответ:** Resolving an IPv4 address to a MAC address.

**Объяснение:** ARP сопоставляет IPv4 с MAC на локальном канале: запрос обычно broadcast, ответ владельца IP — unicast. Для удалённой сети узнают MAC шлюза. IPv6 использует ICMPv6 ND (NS/NA), а не ARP. arp -a/show ip arp читают кэш, arp -d очищает его.

### E252. Which action is taken by a Layer 2 switch when it receives a Layer 2 broadcast frame?

Источник: модули_09, Q9. Тема: модуль 9.

1. It drops the frame.
2. It sends the frame to all ports except the port on which it received the frame.
3. It sends the frame to all ports that are registered to forward broadcasts.
4. It sends the frame to all ports.

**Ответ:** It sends the frame to all ports except the port on which it received the frame..

**Объяснение:** Коммутатор рассылает broadcast и unknown unicast по портам той же VLAN, кроме входного. Если destination MAC известен, кадр направляют на соответствующий порт.

### E253. What addresses are mapped by ARP?

Источник: модули_09, Q10. Тема: модуль 9.

1. IPv4 address to a destination MAC address
2. Destination IPv4 address to the source MAC address
3. Destination IPv4 address to the destination host name
4. Destination MAC address to the source IPv4 address

**Ответ:** IPv4 address to a destination MAC address.

**Объяснение:** ARP сопоставляет IPv4 с MAC на локальном канале: запрос обычно broadcast, ответ владельца IP — unicast. Для удалённой сети узнают MAC шлюза. IPv6 использует ICMPv6 ND (NS/NA), а не ARP. arp -a/show ip arp читают кэш, arp -d очищает его.

### E254. When an IPv4 packet is sent to a host on a remote network, what information is provided by ARP?

Источник: модули_09, Q11. Тема: модуль 9.

1. The IPv4 address of the destination host
2. The IPv4 address of the default gateway
3. The MAC address of the router interface closest to the sending host
4. The MAC address of the switch port that connects to the sending host

**Ответ:** The MAC address of the router interface closest to the sending host.

**Объяснение:** Для локального адресата хост передаёт кадр напрямую. Для удалённой сети отправляет кадр MAC-адресу своего шлюза; сам IP destination остаётся адресом удалённого узла. Шлюз должен быть достижим в локальной подсети.

### E255. The ARP table in a switch maps which two types of address together?

Источник: модули_09, Q12. Тема: модуль 9.

1. Layer 3 address to a Layer 2 address
2. Layer 3 address to a Layer 4 address
3. Layer 4 address to a Layer 2 address
4. Layer 2 address to a Layer 4 address

**Ответ:** Layer 3 address to a Layer 2 address.

**Объяснение:** ARP сопоставляет IPv4 с MAC на локальном канале: запрос обычно broadcast, ответ владельца IP — unicast. Для удалённой сети узнают MAC шлюза. IPv6 использует ICMPv6 ND (NS/NA), а не ARP. arp -a/show ip arp читают кэш, arp -d очищает его.

### E256. What is the purpose of ARP in an IPv4 network?

Источник: модули_09, Q13. Тема: модуль 9.

1. To forward data onward based on the destination IP address
2. To obtain a specific MAC address when an IP address is known
3. To forward data onward based on the destination MAC address.
4. To build the MAC address table in a switch from the information that is gathered

**Ответ:** To obtain a specific MAC address when an IP address is known.

**Объяснение:** ARP сопоставляет IPv4 с MAC на локальном канале: запрос обычно broadcast, ответ владельца IP — unicast. Для удалённой сети узнают MAC шлюза. IPv6 использует ICMPv6 ND (NS/NA), а не ARP. arp -a/show ip arp читают кэш, arp -d очищает его.

### E257. Which destination address is used in an ARP request frame?

Источник: модули_09, Q14. Тема: модуль 9.

1. 0.0.0.0
2. 255.255.255.255
3. FFFF.FFFF.FFFF
4. 127.0.0.1
5. 01-00-5E-00-AA-23

**Ответ:** FFFF.FFFF.FFFF.

**Объяснение:** ARP сопоставляет IPv4 с MAC на локальном канале: запрос обычно broadcast, ответ владельца IP — unicast. Для удалённой сети узнают MAC шлюза. IPv6 использует ICMPv6 ND (NS/NA), а не ARP. arp -a/show ip arp читают кэш, arp -d очищает его.

### E491. What is used in the EUI-64 process to create an IPv6 interface ID on an IPv6 enabled interface?

Источник: тесты_IP_Addressing, Q13. Тема: модуль 9.

1. the MAC address of the IPv6 enabled interface
2. a randomly generated 64-bit hexadecimal address
3. an IPv6 address that is provided by a DHCPv6 server
4. an IPv4 address that is configured on the interface

**Ответ:** the MAC address of the IPv6 enabled interface.

**Объяснение:** Interface ID можно сформировать случайно либо методом modified EUI-64: из MAC вставляют FFFE посередине и инвертируют U/L-бит первого октета. Это не означает, что все современные устройства обязаны применять EUI-64.

### E560. Refer to the exhibit. What is the destination MAC address of the Ethernet frame as it leaves the web server if the final destination is PC1?

Источник: тесты_exam_1, Q16. Тема: модуль 9.

1. 00-60-2F-3A-07-AA
2. 00-60-2F-3A-07-BB
3. 00-60-2F-3A-07-CC
4. 00-60-2F-3A-07-DD

**Ответ для показанного варианта (нужна схема/PT для полной проверки):** 00-60-2F-3A-07-CC.

**Объяснение:** Для локального адресата хост передаёт кадр напрямую. Для удалённой сети отправляет кадр MAC-адресу своего шлюза; сам IP destination остаётся адресом удалённого узла. Шлюз должен быть достижим в локальной подсети.

**Проверка условия:** исходный рисунок или PT-файл не включён в прежнюю текстовую выгрузку. Конкретные адреса/порты выше сохранены из отображённого варианта; это не универсальный ответ для иной схемы.

### E563. Which is a multicast MAC address?

Источник: тесты_exam_1, Q19. Тема: модуль 9.

1. FF-FF-FF-FF-FF-FF
2. 5C-26-0A-4B-19-3E
3. 01-00-5E-00-00-03
4. 00-26-0F-4B-00-3E

**Ответ:** 01-00-5E-00-00-03.

**Объяснение:** IPv4 multicast отображается на Ethernet MAC с префиксом 01:00:5E. Это групповой адрес, не индивидуальный unicast и не FF:FF:FF:FF:FF:FF broadcast.

### E565. What are two actions performed by a Cisco switch? (Choose two.)

Источник: тесты_exam_1, Q21. Тема: модуль 9.

1. building a routing table that is based on the first IP address in the frame header
2. using the source MAC addresses of frames to build and maintain a MAC address table
3. forwarding frames with unknown destination IP addresses to the default gateway
4. utilizing the MAC address table to forward frames via the destination MAC address
5. examining the destination MAC address to add new entries to the MAC address table

**Ответ:** using the source MAC addresses of frames to build and maintain a MAC address table; utilizing the MAC address table to forward frames via the destination MAC address.

**Объяснение:** Коммутатор обучается по source MAC входящего кадра и запоминает порт. Пересылает по destination MAC. Повторное получение обновляет возраст записи, а неизвестный destination вызывает flood в пределах VLAN.

### E578. What action will occur if a switch receives a frame and does have the source MAC address in the MAC table?

Источник: тесты_exam_1, Q34. Тема: модуль 9.

1. The switch refreshes the timer on that entry.
2. The switch adds it to its MAC address table associated with the port number.
3. The switch forwards the frame to the associated port.
4. The switch sends the frame to a connected router because the destination MAC address is not local.

**Ответ:** The switch refreshes the timer on that entry..

**Объяснение:** Коммутатор обучается по source MAC входящего кадра и запоминает порт. Пересылает по destination MAC. Повторное получение обновляет возраст записи, а неизвестный destination вызывает flood в пределах VLAN.

### E588. Which statement describes the treatment of ARP requests on the local link?

Источник: тесты_exam_2, Q10. Тема: модуль 9.

1. They must be forwarded by all routers on the local network.
2. They are received and processed by every device on the local network.
3. They are dropped by all switches on the local network.
4. They are received and processed only by the target device.

**Ответ:** They are received and processed by every device on the local network..

**Объяснение:** ARP сопоставляет IPv4 с MAC на локальном канале: запрос обычно broadcast, ответ владельца IP — unicast. Для удалённой сети узнают MAC шлюза. IPv6 использует ICMPv6 ND (NS/NA), а не ARP. arp -a/show ip arp читают кэш, arp -d очищает его.

### E589. Under which two circumstances will a switch flood a frame out of every port except the port that the frame was received on? (Choose two.)

Источник: тесты_exam_2, Q11. Тема: модуль 9.

1. The frame has the broadcast address as the destination address.
2. The destination address is unknown to the switch.
3. The source address in the frame header is the broadcast address.
4. The source address in the frame is a multicast address.
5. The destination address in the frame is a known unicast address.

**Ответ:** The frame has the broadcast address as the destination address.; The destination address is unknown to the switch..

**Объяснение:** Коммутатор рассылает broadcast и unknown unicast по портам той же VLAN, кроме входного. Если destination MAC известен, кадр направляют на соответствующий порт.

### E590. Refer to the exhibit. The exhibit shows a small switched network and the contents of the MAC address table of the switch. PC1 has sent a frame addressed to PC3. What will the switch do with the frame?

Источник: тесты_exam_2, Q12; тесты_exam_6, Q24. Тема: модуль 9.

1. The switch will discard the frame.
2. The switch will forward the frame only to port 2.
3. The switch will forward the frame to all ports except port 4.
4. The switch will forward the frame to all ports.
5. The switch will forward the frame only to ports 1 and 3.

**Ответ для показанного варианта (нужна схема/PT для полной проверки):** The switch will forward the frame to all ports except port 4..

**Объяснение:** Коммутатор рассылает broadcast и unknown unicast по портам той же VLAN, кроме входного. Если destination MAC известен, кадр направляют на соответствующий порт.

**Проверка условия:** исходный рисунок или PT-файл не включён в прежнюю текстовую выгрузку. Конкретные адреса/порты выше сохранены из отображённого варианта; это не универсальный ответ для иной схемы.

### E591. A network technician issues the arp -d * command on a PC after the router that is connected to the LAN is reconfigured. What is the result after this command is issued?

Источник: тесты_exam_2, Q13. Тема: модуль 9.

1. The ARP cache is cleared.
2. The current content of the ARP cache is displayed.
3. The detailed information of the ARP cache is displayed.
4. The ARP cache is synchronized with the router interface.

**Ответ:** The ARP cache is cleared..

**Объяснение:** ARP сопоставляет IPv4 с MAC на локальном канале: запрос обычно broadcast, ответ владельца IP — unicast. Для удалённой сети узнают MAC шлюза. IPv6 использует ICMPv6 ND (NS/NA), а не ARP. arp -a/show ip arp читают кэш, arp -d очищает его.

### E592. Refer to the exhibit. PC1 attempts to connect to File_server1 and sends an ARP request to obtain a destination MAC address. Which MAC address will PC1 receive in the ARP reply?

Источник: тесты_exam_2, Q14. Тема: модуль 9.

1. the MAC address of S1
2. the MAC address of the G0/0 interface on R1
3. the MAC address of the G0/0 interface on R2
4. the MAC address of S2
5. the MAC address of File_server1

**Ответ для показанного варианта (нужна схема/PT для полной проверки):** the MAC address of the G0/0 interface on R1.

**Объяснение:** ARP сопоставляет IPv4 с MAC на локальном канале: запрос обычно broadcast, ответ владельца IP — unicast. Для удалённой сети узнают MAC шлюза. IPv6 использует ICMPv6 ND (NS/NA), а не ARP. arp -a/show ip arp читают кэш, arp -d очищает его.

**Проверка условия:** исходный рисунок или PT-файл не включён в прежнюю текстовую выгрузку. Конкретные адреса/порты выше сохранены из отображённого варианта; это не универсальный ответ для иной схемы.

### E593. What important information is examined in the Ethernet frame header by a Layer 2 device in order to forward the data onward?

Источник: тесты_exam_2, Q15. Тема: модуль 9.

1. source MAC address
2. source IP address
3. destination MAC address
4. ethernet type
5. destination IP address

**Ответ:** destination MAC address.

**Объяснение:** Коммутатор обучается по source MAC входящего кадра и запоминает порт. Пересылает по destination MAC. Повторное получение обновляет возраст записи, а неизвестный destination вызывает flood в пределах VLAN.

### E594. What statement describes the function of the Address Resolution Protocol?

Источник: тесты_exam_2, Q16. Тема: модуль 9.

1. ARP is used to discover the IP address of any host on a different network.
2. ARP is used to discover the IP address of any host on the local network.
3. ARP is used to discover the MAC address of any host on a different network.
4. ARP is used to discover the MAC address of any host on the local network.

**Ответ:** ARP is used to discover the MAC address of any host on the local network..

**Объяснение:** ARP сопоставляет IPv4 с MAC на локальном канале: запрос обычно broadcast, ответ владельца IP — unicast. Для удалённой сети узнают MAC шлюза. IPv6 использует ICMPv6 ND (NS/NA), а не ARP. arp -a/show ip arp читают кэш, arp -d очищает его.

### E610. What property of ARP forces all Ethernet NICs to process an ARP request?

Источник: тесты_exam_2, Q32. Тема: модуль 9.

1. The destination MAC address FF-FF-FF-FF-FF-FF appears in the header of the Ethernet frame.
2. The source MAC address appears in the header of the Ethernet frame.
3. The type field 0x806 appears in the header of the Ethernet frame.
4. ARP replies are broadcast on the network when a host receives an ARP request.

**Ответ:** The destination MAC address FF-FF-FF-FF-FF-FF appears in the header of the Ethernet frame..

**Объяснение:** ARP сопоставляет IPv4 с MAC на локальном канале: запрос обычно broadcast, ответ владельца IP — unicast. Для удалённой сети узнают MAC шлюза. IPv6 использует ICMPv6 ND (NS/NA), а не ARP. arp -a/show ip arp читают кэш, arp -d очищает его.

### E701. Which destination address is used in an ARP request frame?

Источник: тесты_exam_6, Q23. Тема: модуль 9.

1. 0.0.0.0
2. 255.255.255.255
3. FFFF.FFFF.FFFF
4. AAAA.AAAA.AAAA
5. the physical address of the destination host

**Ответ:** FFFF.FFFF.FFFF.

**Объяснение:** ARP сопоставляет IPv4 с MAC на локальном канале: запрос обычно broadcast, ответ владельца IP — unicast. Для удалённой сети узнают MAC шлюза. IPv6 использует ICMPv6 ND (NS/NA), а не ARP. arp -a/show ip arp читают кэш, arp -d очищает его.

### E703. Refer to the exhibit. PC1 issues an ARP request because it needs to send a packet to PC3. In this scenario, what will happen next?

Источник: тесты_exam_6, Q25. Тема: модуль 9.

1. RT1 will forward the ARP request to PC3.
2. RT1 will send an ARP reply with its own Fa0/0 MAC address.
3. RT1 will send an ARP reply with the PC3 MAC address.
4. SW1 will send an ARP reply with its Fa0/1 MAC address.
5. RT1 will send an ARP reply with its own Fa0/1 MAC address.

**Ответ для показанного варианта (нужна схема/PT для полной проверки):** RT1 will send an ARP reply with its own Fa0/0 MAC address..

**Объяснение:** ARP сопоставляет IPv4 с MAC на локальном канале: запрос обычно broadcast, ответ владельца IP — unicast. Для удалённой сети узнают MAC шлюза. IPv6 использует ICMPv6 ND (NS/NA), а не ARP. arp -a/show ip arp читают кэш, arp -d очищает его.

**Проверка условия:** исходный рисунок или PT-файл не включён в прежнюю текстовую выгрузку. Конкретные адреса/порты выше сохранены из отображённого варианта; это не универсальный ответ для иной схемы.

### E742. Match the header field with the appropriate layer of the OSI model. FCS (frame check sequence) Layer 2 802.2 header destination MAC address source IP address Layer 3 TTL destination port number Layer 4 Acknowledgement number

Источник: тесты_exam_7, Q9. Тема: модуль 9.

**Ответ:** Layer 2 → FCS, 802.2 header, destination MAC; Layer 3 → source IP, TTL; Layer 4 → destination port, acknowledgement number.

**Объяснение:** Транспортный уровень создаёт сегменты; сетевой добавляет IP-заголовок. Поэтому на L3 появляются IP-адреса, а PDU становится пакетом.

### E751. Refer to the exhibit. PC1 issues an ARP request because it needs to send a packet to PC2. In this scenario, what will happen next?

Источник: тесты_exam_7, Q18. Тема: модуль 9.

1. PC2 will send an ARP reply with its MAC address.
2. RT1 will send an ARP reply with its Fa0/0 MAC address.
3. RT1 will send an ARP reply with the PC2 MAC address.
4. SW1 will send an ARP reply with the PC2 MAC address.
5. SW1 will send an ARP reply with its Fa0/1 MAC address.

**Ответ для показанного варианта (нужна схема/PT для полной проверки):** PC2 will send an ARP reply with its MAC address..

**Объяснение:** ARP сопоставляет IPv4 с MAC на локальном канале: запрос обычно broadcast, ответ владельца IP — unicast. Для удалённой сети узнают MAC шлюза. IPv6 использует ICMPv6 ND (NS/NA), а не ARP. arp -a/show ip arp читают кэш, arp -d очищает его.

**Проверка условия:** исходный рисунок или PT-файл не включён в прежнюю текстовую выгрузку. Конкретные адреса/порты выше сохранены из отображённого варианта; это не универсальный ответ для иной схемы.

### E754. Which two statements are correct about MAC and IP addresses during data transmission if NAT is not involved? (Choose two.)

Источник: тесты_exam_7, Q21. Тема: модуль 9.

1. A packet that has crossed four routers has changed the destination IP address four times.
2. Destination MAC addresses will never change in a frame that goes across seven routers.
3. Destination and source MAC addresses have local significance and change every time a frame goes from one LAN to another.
4. Destination IP addresses in a packet header remain constant along the entire path to a target host.
5. Every time a frame is encapsulated with a new destination MAC address, a new destination IP address is needed.

**Ответ:** Destination and source MAC addresses have local significance and change every time a frame goes from one LAN to another.; Destination IP addresses in a packet header remain constant along the entire path to a target host..

**Объяснение:** Source/Destination IP задают конечных отправителя и получателя. Обычно по пути они сохраняются; исключение — преобразование NAT. MAC-адреса относятся к текущему каналу и меняются на маршрутизаторах.

### E756. What are two features of ARP? (Choose two.)

Источник: тесты_exam_7, Q23. Тема: модуль 9.

1. If a host is ready to send a packet to a local destination device and it has the IP address but not the MAC address of the destination, it generates an ARP broadcast.
2. An ARP request is sent to all devices on the Ethernet LAN and contains the IP address of the destination host and its multicast MAC address.
3. When a host is encapsulating a packet into a frame, it refers to the MAC address table to determine the mapping of IP addresses to MAC addresses.
4. If no device responds to the ARP request, then the originating node will broadcast the data packet to all devices on the network segment.
5. If a device receiving an ARP request has the destination IPv4 address, it responds with an ARP reply.

**Ответ:** If a host is ready to send a packet to a local destination device and it has the IP address but not the MAC address of the destination, it generates an ARP broadcast.; If a device receiving an ARP request has the destination IPv4 address, it responds with an ARP reply..

**Объяснение:** ARP сопоставляет IPv4 с MAC на локальном канале: запрос обычно broadcast, ответ владельца IP — unicast. Для удалённой сети узнают MAC шлюза. IPv6 использует ICMPv6 ND (NS/NA), а не ARP. arp -a/show ip arp читают кэш, arp -d очищает его.

### E761. A user sends an HTTP request to a web server on a remote network. During encapsulation for this request, what information is added to the address field of a frame to indicate the destination?

Источник: тесты_exam_7, Q28. Тема: модуль 9.

1. the MAC address of the destination host
2. the network domain of the destination host
3. the MAC address of the default gateway
4. the IP address of the default gateway

**Ответ:** the MAC address of the default gateway.

**Объяснение:** Для локального адресата хост передаёт кадр напрямую. Для удалённой сети отправляет кадр MAC-адресу своего шлюза; сам IP destination остаётся адресом удалённого узла. Шлюз должен быть достижим в локальной подсети.


## Модуль 10: Настройка маршрутизатора и IOS

### E036. Which IOS mode allows access to all commands and features?

Источник: модули_02, Q1. Тема: модуль 10.

1. Global configuration mode
2. Interface subconfiguration mode
3. Line console subconfiguration mode
4. Privileged EXEC mode
5. User EXEC mode

**Ответ:** Privileged EXEC mode.

**Объяснение:** User EXEC обозначается >, privileged EXEC — #, global configuration — (config)#. enable повышает режим; configure terminal открывает настройку. exit возвращает на один уровень, end/Ctrl-Z — в privileged EXEC.

### E037. Which IOS mode are you in if the Switch(config)# prompt is displayed?

Источник: модули_02, Q2. Тема: модуль 10.

1. Global configuration mode
2. Interface subconfiguration mode
3. Line console subconfiguration mode
4. Privileged EXEC mode
5. User EXEC mode

**Ответ:** Global configuration mode.

**Объяснение:** User EXEC обозначается >, privileged EXEC — #, global configuration — (config)#. enable повышает режим; configure terminal открывает настройку. exit возвращает на один уровень, end/Ctrl-Z — в privileged EXEC.

### E038. Which IOS mode are you in if the Switch> prompt is displayed?

Источник: модули_02, Q3. Тема: модуль 10.

1. Global configuration mode
2. Interface subconfiguration mode
3. Line console subconfiguration mode
4. Privileged EXEC mode
5. User EXEC mode

**Ответ:** User EXEC mode.

**Объяснение:** User EXEC обозначается >, privileged EXEC — #, global configuration — (config)#. enable повышает режим; configure terminal открывает настройку. exit возвращает на один уровень, end/Ctrl-Z — в privileged EXEC.

### E039. Which two commands would return you to the privileged EXEC prompt regardless of the configuration mode you are in? (Choose two.)

Источник: модули_02, Q4. Тема: модуль 10.

1. CTRL+Z
2. disable
3. enable
4. end
5. exit

**Ответ:** CTRL+Z; end.

**Объяснение:** User EXEC обозначается >, privileged EXEC — #, global configuration — (config)#. enable повышает режим; configure terminal открывает настройку. exit возвращает на один уровень, end/Ctrl-Z — в privileged EXEC.

### E040. What is the command to assign the name “Sw-Floor-2” to a switch?

Источник: модули_02, Q1. Тема: модуль 10.

1. hostname Sw-Floor-2
2. host name Sw-Floor-2
3. name Sw-Floor-2

**Ответ:** hostname Sw-Floor-2.

**Объяснение:** hostname меняет имя устройства и приглашение CLI; режим остаётся прежним. После hostname portsmouth приглашение global configuration — portsmouth(config)#.

### E041. How is the privileged EXEC mode access secured on a switch?

Источник: модули_02, Q2. Тема: модуль 10.

1. enable class
2. secret class
3. enable secret class
4. service password-encryption

**Ответ:** enable secret class.

**Объяснение:** enable secret защищает переход в privileged EXEC и хранит секрет как хеш. enable password — более слабый старый вариант; пароль console защищает другой этап доступа.

### E044. Which is the command to configure a banner to be displayed when connecting to a switch?

Источник: модули_02, Q5. Тема: модуль 10.

1. banner $ Keep out $
2. banner motd $ Keep out $
3. display $ Keep out $
4. login banner $ Keep out $

**Ответ:** banner motd $ Keep out $.

**Объяснение:** banner motd выводит информационное/предупреждающее сообщение при подключении. Это не пароль и не механизм аутентификации.

### E047. What type of interface has no physical port associated with it?

Источник: модули_02, Q3. Тема: модуль 10.

1. Console
2. Ethernet
3. Serial
4. Switch virtual interface (SVI)

**Ответ:** Switch virtual interface (SVI).

**Объяснение:** SVI — программный интерфейс VLAN, без отдельного физического порта. На L2-коммутаторе его IP позволяет управлять устройством; в начальных примерах используется VLAN 1. Для удалённой сети нужен default gateway.

### E048. Which statement is true about the running configuration file in a Cisco IOS device?

Источник: модули_02, Q1. Тема: модуль 10.

1. It affects the operation of the device immediately when modified.
2. It is stored in NVRAM.
3. It should be deleted using the erase running-config command.
4. It is automatically saved when the router reboots.

**Ответ:** It affects the operation of the device immediately when modified..

**Объяснение:** running-config действует сейчас в RAM; startup-config используется при загрузке. copy running-config startup-config сохраняет изменения. Настройка обычно начинает действовать сразу; несохранённые изменения пропадут после reload без сохранения.

### E049. Which two statements are true regarding the user EXEC mode? (Choose two.)

Источник: модули_02, Q2. Тема: модуль 10.

1. All router commands are available.
2. Global configuration mode can be accessed by entering the enable command.
3. The device prompt for this mode ends with the '>' symbol.
4. Interfaces and routing protocols can be configured.
5. Only some aspects of the router configuration can be viewed.

**Ответ:** The device prompt for this mode ends with the '>' symbol.; Only some aspects of the router configuration can be viewed..

**Объяснение:** User EXEC обозначается >, privileged EXEC — #, global configuration — (config)#. enable повышает режим; configure terminal открывает настройку. exit возвращает на один уровень, end/Ctrl-Z — в privileged EXEC.

### E050. Which type of access is secured on a Cisco router or switch with the enable secret command?

Источник: модули_02, Q3. Тема: модуль 10.

1. Virtual terminal
2. Privileged EXEC
3. AUX port
4. Console line

**Ответ:** Privileged EXEC.

**Объяснение:** enable secret защищает переход в privileged EXEC и хранит секрет как хеш. enable password — более слабый старый вариант; пароль console защищает другой этап доступа.

### E051. What is the default SVI on a Cisco switch?

Источник: модули_02, Q4. Тема: модуль 10.

1. VLAN1
2. VLAN99
3. VLAN100
4. VLAN999

**Ответ:** VLAN1.

**Объяснение:** SVI — программный интерфейс VLAN, без отдельного физического порта. На L2-коммутаторе его IP позволяет управлять устройством; в начальных примерах используется VLAN 1. Для удалённой сети нужен default gateway.

### E052. When a hostname is configured through the Cisco CLI, which three naming conventions are part of the guidelines? (Choose three.)

Источник: модули_02, Q5. Тема: модуль 10.

1. The hostname should be fewer than 64 characters in length
2. The hostname should be written in all lower case characters
3. The hostname should contain no spaces
4. The hostname should end with a special character
5. The hostname should begin with a letter

**Ответ:** The hostname should be fewer than 64 characters in length; The hostname should contain no spaces; The hostname should begin with a letter.

**Объяснение:** В правилах курса hostname начинается с буквы, не содержит пробелов и имеет менее 64 символов. Имя помогает различать устройства, но не заменяет IP-адрес.

### E055. An administrator has just changed the IP address of an interface on an IOS device. What else must be done in order to apply those changes to the device?

Источник: модули_02, Q8. Тема: модуль 10.

1. Copy the running configuration to the startup configuration file.
2. Copy the information in the startup configuration file to the running configuration.
3. Reload the device and type yes when prompted to save the configuration.
4. Nothing must be done. Changes to the configuration on an IOS device take effect as soon as the command is typed correctly and the Enter key has been pressed.

**Ответ:** Nothing must be done. Changes to the configuration on an IOS device take effect as soon as the command is typed correctly and the Enter key has been pressed..

**Объяснение:** running-config действует сейчас в RAM; startup-config используется при загрузке. copy running-config startup-config сохраняет изменения. Настройка обычно начинает действовать сразу; несохранённые изменения пропадут после reload без сохранения.

### E056. Which memory location on a Cisco router or switch will lose all content when the device is restarted?

Источник: модули_02, Q9. Тема: модуль 10.

1. ROM
2. Flash
3. NVRAM
4. RAM

**Ответ:** RAM.

**Объяснение:** RAM энергозависима: там running-config, таблицы маршрутов и ARP-кэш. NVRAM сохраняет startup-config после отключения питания. Динамические ARP-записи временные.

### E057. Why would a technician enter the command copy startup-config running-config ?

Источник: модули_02, Q10. Тема: модуль 10.

1. To remove all configurations from the switch
2. To save an active configuration to NVRAM
3. To copy an existing configuration into RAM
4. To make a changed configuration the new startup configuration

**Ответ:** To copy an existing configuration into RAM.

**Объяснение:** running-config действует сейчас в RAM; startup-config используется при загрузке. copy running-config startup-config сохраняет изменения. Настройка обычно начинает действовать сразу; несохранённые изменения пропадут после reload без сохранения.

### E059. Which two functions are provided to users by the context-sensitive help feature of the Cisco IOS CLI? (Choose two.)

Источник: модули_02, Q12. Тема: модуль 10.

1. Providing an error message when a wrong command is submitted
2. Displaying a list of all available commands within the current mode
3. Allowing the user to complete the remainder of an abbreviated command with the TAB key
4. Determining which option, keyword, or argument is available for the entered command
5. Selecting the best command to accomplish a task

**Ответ:** Displaying a list of all available commands within the current mode; Determining which option, keyword, or argument is available for the entered command.

**Объяснение:** Знак ? показывает доступные команды или следующие аргументы в текущем режиме. Tab дополняет однозначно распознанную команду. Контекст режима определяет, какие команды допустимы.

### E060. Which memory location on a Cisco router or switch stores the startup configuration file?

Источник: модули_02, Q13. Тема: модуль 10.

1. RAM
2. ROM
3. NVRAM
4. Flash

**Ответ:** NVRAM.

**Объяснение:** running-config действует сейчас в RAM; startup-config используется при загрузке. copy running-config startup-config сохраняет изменения. Настройка обычно начинает действовать сразу; несохранённые изменения пропадут после reload без сохранения.

### E074. A device receives a data link frame with data and processes and removes the Ethernet information. What information would be the next to be processed by the receiving device?

Источник: модули_03, Q5. Тема: модуль 10.

1. HTTP at the application layer
2. HTML at the application layer
3. IP at the internet layer
4. UDP at the internet layer
5. TCP at the transport layer

**Ответ:** IP at the internet layer.

**Объяснение:** Транспортный уровень создаёт сегменты; сетевой добавляет IP-заголовок. Поэтому на L3 появляются IP-адреса, а PDU становится пакетом.

### E084. True or false? Frames exchanged between devices in different IP networks must be forwarded to a default gateway.

Источник: модули_03, Q1. Тема: модуль 10.

1. True
2. False

**Ответ:** True.

**Объяснение:** Для локального адресата хост передаёт кадр напрямую. Для удалённой сети отправляет кадр MAC-адресу своего шлюза; сам IP destination остаётся адресом удалённого узла. Шлюз должен быть достижим в локальной подсети.

### E089. True or False? Data Link addresses are physical so they never change in the data link frame from source to destination.

Источник: модули_03, Q6. Тема: модуль 10.

1. True
2. False

**Ответ:** False.

**Объяснение:** Source/Destination IP задают конечных отправителя и получателя. Обычно по пути они сохраняются; исключение — преобразование NAT. MAC-адреса относятся к текущему каналу и меняются на маршрутизаторах.

### E102. What is done to an IP packet before it is transmitted over the physical medium?

Источник: модули_03, Q13. Тема: модуль 10.

1. It is tagged with information guaranteeing reliable delivery.
2. It is segmented into smaller individual pieces.
3. It is encapsulated into a TCP segment.
4. It is encapsulated in a Layer 2 frame.

**Ответ:** It is encapsulated in a Layer 2 frame..

**Объяснение:** Канальный уровень помещает IP-пакет в кадр. Маршрутизатор снимает входной L2-заголовок и формирует новый для следующего канала; IP-пакет передаётся дальше.

### E152. What Layer 2 function does a router perform? (Choose three.)

Источник: модули_06, Q4. Тема: модуль 10.

1. Accepts a frame from a medium
2. De-encapsulates the frame
3. Refers to its Layer 3 routing table for a matching destination network
4. Re-encapsulates the packet into a new frame

**Ответ:** Accepts a frame from a medium; De-encapsulates the frame; Re-encapsulates the packet into a new frame.

**Объяснение:** Канальный уровень помещает IP-пакет в кадр. Маршрутизатор снимает входной L2-заголовок и формирует новый для следующего канала; IP-пакет передаётся дальше.

### E258. A router boots and enters setup mode. What is the reason for this?

Источник: модули_10, Q1; тесты_exam_2, Q18; тесты_exam_6, Q26. Тема: модуль 10.

1. The IOS image is corrupt.
2. Cisco IOS is missing from flash memory.
3. The configuration file is missing from NVRAM.
4. The POST process has detected hardware failure.

**Ответ:** The configuration file is missing from NVRAM..

**Объяснение:** При отсутствии пригодного startup-config в NVRAM маршрутизатор может перейти к начальной настройке (setup). Это не означает отсутствие самого IOS.

### E259. Which command is used to encrypt all passwords in a router configuration file?

Источник: модули_10, Q2. Тема: модуль 10.

1. Router_A (config) # enable secret <password>
2. Router_A (config) # service password-encryption
3. Router_A (config) # enable password <password>
4. Router_A (config) # encrypt password

**Ответ:** Router_A (config) # service password-encryption.

**Объяснение:** service password-encryption скрывает поддерживаемые открытые пароли в конфигурации. В классическом IOS это слабая обратимая Type 7, не надёжная защита и не шифрование трафика. Для привилегированного доступа используют enable secret.

### E260. Company policy requires using the most secure method to safeguard access to the privileged exec and configuration mode on the routers. The privileged exec password is trustknow1 . Which of the following router commands achieves the goal of providing the highest level of security?

Источник: модули_10, Q3. Тема: модуль 10.

1. secret password trustknow1
2. enable password trustknow1
3. service password-encryption
4. enable secret trustknow1

**Ответ:** enable secret trustknow1.

**Объяснение:** enable secret защищает переход в privileged EXEC и хранит секрет как хеш. enable password — более слабый старый вариант; пароль console защищает другой этап доступа.

### E261. What will be the response from the router after the command, "router(config)# hostname portsmouth \" is entered?

Источник: модули_10, Q4. Тема: модуль 10.

1. portsmouth#
2. portsmouth(config)#
3. invalid input detected
4. router(config-host)#
5. hostname = portsmouth portsmouth#
6. ? command not recognized router(config)#

**Ответ:** portsmouth(config)#.

**Объяснение:** hostname меняет имя устройства и приглашение CLI; режим остаётся прежним. После hostname portsmouth приглашение global configuration — portsmouth(config)#.

### E262. An administrator is configuring a new router to permit out-of-band management access. Which set of commands will allow the required login using a password of cisco ?

Источник: модули_10, Q5. Тема: модуль 10.

1. Router(config)# line vty 0 4 Router(config-line)# password manage Router(config-line)# exit Router(config)# enable password cisco
2. Router(config)# line vty 0 4 Router(config-line)# password cisco Router(config-line)# login
3. Router(config)# line console 0 Router(config-line)# password cisco Router(config-line)# login
4. Router(config)# line console 0 Router(config-line)# password cisco Router(config-line)# exit Router(config)# service password-encryption

**Ответ:** Router(config)# line console 0 Router(config-line)# password cisco Router(config-line)# login.

**Объяснение:** Пароль линии задают в line console 0 или line vty. password задаёт значение, login включает проверку пароля этой линии. login local вместо этого использует локальную базу username.

### E263. Which command can be used on a Cisco router to display all interfaces, the IPv4 address assigned, and the current status?

Источник: модули_10, Q6. Тема: модуль 10.

1. show ip interface brief
2. ping
3. show ip route
4. show interface fa0/1

**Ответ:** show ip interface brief.

**Объяснение:** show ip interface brief кратко показывает интерфейс, IPv4-адрес и состояния Status/Protocol. Рабочий интерфейс обычно up/up; administratively down требует no shutdown. По выводу можно судить только о показанных интерфейсах.

### E264. Which CLI mode allows users to access all device commands, such as those used for configuration, management, and troubleshooting?

Источник: модули_10, Q7. Тема: модуль 10.

1. User EXEC mode
2. Privileged EXEC mode
3. Global configuration mode
4. Interface configuration mode

**Ответ:** Privileged EXEC mode.

**Объяснение:** User EXEC обозначается >, privileged EXEC — #, global configuration — (config)#. enable повышает режим; configure terminal открывает настройку. exit возвращает на один уровень, end/Ctrl-Z — в privileged EXEC.

### E265. What is the purpose of the startup configuration file on a Cisco router?

Источник: модули_10, Q8. Тема: модуль 10.

1. To facilitate the basic operation of the hardware components of a device
2. To contain the commands that are used to initially configure a router on startup
3. To contain the configuration commands that the router IOS is currently using
4. To provide a limited backup version of the IOS, in case the router cannot load the full featured IOS

**Ответ:** To contain the commands that are used to initially configure a router on startup.

**Объяснение:** running-config действует сейчас в RAM; startup-config используется при загрузке. copy running-config startup-config сохраняет изменения. Настройка обычно начинает действовать сразу; несохранённые изменения пропадут после reload без сохранения.

### E266. Which characteristic describes the default gateway of a host computer?

Источник: модули_10, Q9. Тема: модуль 10.

1. The logical address of the router interface on the same network as the host computer
2. The physical address of the switch interface connected to the host computer
3. The physical address of the router interface on the same network as the host computer
4. The logical address assigned to the switch interface connected to the router

**Ответ:** The logical address of the router interface on the same network as the host computer.

**Объяснение:** Для локального адресата хост передаёт кадр напрямую. Для удалённой сети отправляет кадр MAC-адресу своего шлюза; сам IP destination остаётся адресом удалённого узла. Шлюз должен быть достижим в локальной подсети.

### E267. What is the purpose of the banner motd command?

Источник: модули_10, Q10. Тема: модуль 10.

1. It configures a message that will identify printed documents to LAN users.
2. It is a way that routers communicate the status of their links with one another.
3. It provides an easy way of communicating with any user attached to a router's LANs.
4. It provides a way to make announcements to those who log in to a router.

**Ответ:** It provides a way to make announcements to those who log in to a router..

**Объяснение:** banner motd выводит информационное/предупреждающее сообщение при подключении. Это не пароль и не механизм аутентификации.

### E268. A technician is configuring a router to allow for all forms of management access. As part of each different type of access, the technician is trying to type the command login. Which configuration mode should be entered to do this task?

Источник: модули_10, Q11. Тема: модуль 10.

1. User executive mode
2. Global configuration mode
3. Any line configuration mode
4. Privileged EXEC mode

**Ответ:** Any line configuration mode.

**Объяснение:** Пароль линии задают в line console 0 или line vty. password задаёт значение, login включает проверку пароля этой линии. login local вместо этого использует локальную базу username.

### E269. What is stored in the NVRAM of a Cisco router?

Источник: модули_10, Q12. Тема: модуль 10.

1. The Cisco IOS
2. The running configuration
3. The bootup instructions
4. The startup configuration

**Ответ:** The startup configuration.

**Объяснение:** RAM энергозависима: там running-config, таблицы маршрутов и ARP-кэш. NVRAM сохраняет startup-config после отключения питания. Динамические ARP-записи временные.

### E270. Which statement regarding the service password-encryption command is true?

Источник: модули_10, Q13. Тема: модуль 10.

1. It is configured in privileged EXEC mode.
2. It encrypts only line mode passwords.
3. As soon as the service password-encryption command is entered, all currently set passwords formerly displayed in plain text are encrypted.
4. To see the passwords encrypted by the service password-encryption command in plain text, issue the no service password-encryption command.

**Ответ:** As soon as the service password-encryption command is entered, all currently set passwords formerly displayed in plain text are encrypted..

**Объяснение:** service password-encryption скрывает поддерживаемые открытые пароли в конфигурации. В классическом IOS это слабая обратимая Type 7, не надёжная защита и не шифрование трафика. Для привилегированного доступа используют enable secret.

### E513. Match the description with the associated IOS mode. limited number of basic monitoring commands user EXEC mode done the first entrance into the CLI of an IOS device accessed by entering the enable command privileged EXEC mode identified by a prompt ending with the # character changes made affect the operation of the device as a whole global configuration mode accessed by entering the configure terminal command

Источник: тесты_exam_0, Q2. Тема: модуль 10.

**Ответ:** user EXEC: базовый мониторинг и первый вход в CLI; privileged EXEC: enable, приглашение #; global configuration: configure terminal, изменения всего устройства.

**Объяснение:** User EXEC обозначается >, privileged EXEC — #, global configuration — (config)#. enable повышает режим; configure terminal открывает настройку. exit возвращает на один уровень, end/Ctrl-Z — в privileged EXEC.

### E515. What are three characteristics of an SVI? (Choose three.)

Источник: тесты_exam_0, Q4. Тема: модуль 10.

1. It is designed as a security protocol to protect switch ports.
2. It is not associated with any physical interface on a switch.
3. It is a special interface that allows connectivity by different types of media.
4. It is required to allow connectivity by any device at any location.
5. It provides a means to remotely manage a switch.
6. It is associated with VLAN1 by default.

**Ответ:** It is not associated with any physical interface on a switch.; It provides a means to remotely manage a switch.; It is associated with VLAN1 by default..

**Объяснение:** SVI — программный интерфейс VLAN, без отдельного физического порта. На L2-коммутаторе его IP позволяет управлять устройством; в начальных примерах используется VLAN 1. Для удалённой сети нужен default gateway.

### E516. Which two host names follow the guidelines for naming conventions on Cisco IOS devices? (Choose two.)

Источник: тесты_exam_0, Q5. Тема: модуль 10.

1. Branch2!
2. RM-3-Switch-2A4
3. Floor(15)
4. HO Floor 17
5. SwBranch799

**Ответ:** RM-3-Switch-2A4; SwBranch799.

**Объяснение:** hostname меняет имя устройства и приглашение CLI; режим остаётся прежним. После hostname portsmouth приглашение global configuration — portsmouth(config)#.

### E519. Which command or key combination allows a user to return to the previous level in the command hierarchy?

Источник: тесты_exam_0, Q8. Тема: модуль 10.

1. End
2. Exit
3. Ctrl-Z
4. Ctrl-C

**Ответ:** Exit.

**Объяснение:** User EXEC обозначается >, privileged EXEC — #, global configuration — (config)#. enable повышает режим; configure terminal открывает настройку. exit возвращает на один уровень, end/Ctrl-Z — в privileged EXEC.

### E522. What are two characteristics of RAM on a Cisco device? (Choose two.)

Источник: тесты_exam_0, Q11. Тема: модуль 10.

1. RAM provides nonvolatile storage.
2. The configuration that is actively running on the device is stored in RAM.
3. The contents of RAM are lost during a power cycle.
4. RAM is a component in Cisco switches but not in Cisco routers.
5. RAM is able to store multiple versions of IOS and configuration files.

**Ответ:** The configuration that is actively running on the device is stored in RAM.; The contents of RAM are lost during a power cycle..

**Объяснение:** RAM энергозависима: там running-config, таблицы маршрутов и ARP-кэш. NVRAM сохраняет startup-config после отключения питания. Динамические ARP-записи временные.

### E523. What function does pressing the Tab key have when entering a command in IOS?

Источник: тесты_exam_0, Q12. Тема: модуль 10.

1. It aborts the current command and returns to configuration mode.
2. It exits configuration mode and returns to user EXEC mode.
3. It moves the cursor to the beginning of the next line.
4. It completes the remainder of a partially typed word in a command.

**Ответ:** It completes the remainder of a partially typed word in a command..

**Объяснение:** Знак ? показывает доступные команды или следующие аргументы в текущем режиме. Tab дополняет однозначно распознанную команду. Контекст режима определяет, какие команды допустимы.

### E524. What command is used to verify the condition of the switch interfaces, including the status of the interfaces and a configured IP address?

Источник: тесты_exam_0, Q13. Тема: модуль 10.

1. ipconfig
2. ping
3. traceroute
4. show ip interface brief

**Ответ:** show ip interface brief.

**Объяснение:** show ip interface brief кратко показывает интерфейс, IPv4-адрес и состояния Status/Protocol. Рабочий интерфейс обычно up/up; administratively down требует no shutdown. По выводу можно судить только о показанных интерфейсах.

### E525. While trying to solve a network issue, a technician made multiple changes to the current router configuration file. The changes did not solve the problem and were not saved. What action can the technician take to discard the changes and work with the file in NVRAM?

Источник: тесты_exam_0, Q14. Тема: модуль 10.

1. Issue the reload command without saving the running configuration.
2. Delete the vlan.dat file and reboot the device.
3. Close and reopen the terminal emulation software.
4. Issue the copy startup-config running-config command.

**Ответ:** Issue the reload command without saving the running configuration..

**Объяснение:** running-config действует сейчас в RAM; startup-config используется при загрузке. copy running-config startup-config сохраняет изменения. Настройка обычно начинает действовать сразу; несохранённые изменения пропадут после reload без сохранения.

### E526. After making configuration changes on a Cisco switch, a network administrator issues a copy running-config startup-config command. What is the result of issuing this command?

Источник: тесты_exam_0, Q15. Тема: модуль 10.

1. The new configuration will be stored in flash memory.
2. The new configuration will be loaded if the switch is restarted.
3. The current IOS file will be replaced with the newly configured file.
4. The configuration changes will be removed and the original configuration will be restored.

**Ответ:** The new configuration will be loaded if the switch is restarted..

**Объяснение:** running-config действует сейчас в RAM; startup-config используется при загрузке. copy running-config startup-config сохраняет изменения. Настройка обычно начинает действовать сразу; несохранённые изменения пропадут после reload без сохранения.

### E540. Refer to the exhibit. An administrator is trying to configure the switch but receives the error message that is displayed in the exhibit. What is the problem?

Источник: тесты_exam_0, Q29; тесты_exam_6, Q5; тесты_exam_7, Q14. Тема: модуль 10.

1. The entire command, configure terminal, must be used.
2. The administrator is already in global configuration mode.
3. The administrator must first enter privileged EXEC mode before issuing the command.
4. The administrator must connect via the console port to access global configuration mode.

**Ответ для показанного варианта (нужна схема/PT для полной проверки):** The administrator must first enter privileged EXEC mode before issuing the command..

**Объяснение:** User EXEC обозначается >, privileged EXEC — #, global configuration — (config)#. enable повышает режим; configure terminal открывает настройку. exit возвращает на один уровень, end/Ctrl-Z — в privileged EXEC.

**Проверка условия:** исходный рисунок или PT-файл не включён в прежнюю текстовую выгрузку. Конкретные адреса/порты выше сохранены из отображённого варианта; это не универсальный ответ для иной схемы.

### E541. Open the PT Activity. Perform the tasks in the activity instructions and then answer the question. What is the IP address of the switch virtual interface (SVI) on Switch0?

Источник: тесты_exam_0, Q30. Тема: модуль 10.

1. 192.168.5.10
2. 192.168.10.5
3. 192.168.10.1
4. 192.168.5.0

**Ответ для показанного варианта (нужна схема/PT для полной проверки):** 192.168.5.10.

**Объяснение:** SVI — программный интерфейс VLAN, без отдельного физического порта. На L2-коммутаторе его IP позволяет управлять устройством; в начальных примерах используется VLAN 1. Для удалённой сети нужен default gateway.

**Проверка условия:** исходный рисунок или PT-файл не включён в прежнюю текстовую выгрузку. Конкретные адреса/порты выше сохранены из отображённого варианта; это не универсальный ответ для иной схемы.

### E580. Within a production network, what is the purpose of configuring a switch with a default gateway address?

Источник: тесты_exam_2, Q2. Тема: модуль 10.

1. Hosts that are connected to the switch can use the switch default gateway address to forward packets to a remote destination.
2. A switch must have a default gateway to be accessible by Telnet and SSH.
3. The default gateway address is used to forward packets originating from the switch to remote networks.
4. It provides a next-hop address for all traffic that flows through the switch.

**Ответ:** The default gateway address is used to forward packets originating from the switch to remote networks..

**Объяснение:** Для локального адресата хост передаёт кадр напрямую. Для удалённой сети отправляет кадр MAC-адресу своего шлюза; сам IP destination остаётся адресом удалённого узла. Шлюз должен быть достижим в локальной подсети.

### E584. A computer can access devices on the same network but cannot access devices on other networks. What is the probable cause of this problem?

Источник: тесты_exam_2, Q6. Тема: модуль 10.

1. The cable is not connected properly to the NIC.
2. The computer has an invalid IP address.
3. The computer has an incorrect subnet mask.
4. The computer has an invalid default gateway address.

**Ответ:** The computer has an invalid default gateway address..

**Объяснение:** Для локального адресата хост передаёт кадр напрямую. Для удалённой сети отправляет кадр MAC-адресу своего шлюза; сам IP destination остаётся адресом удалённого узла. Шлюз должен быть достижим в локальной подсети.

### E599. Match the phases to the functions during the boot up process of a Cisco router. A phase 1 perform the POST and load the bootstrap program done B phase 2 locate and load the Cisco IOS software C phase 3 locate and load the startup configuration file

Источник: тесты_exam_2, Q21. Тема: модуль 10.

**Ответ:** 1: POST и bootstrap; 2: поиск и загрузка IOS; 3: поиск и загрузка startup-config.

**Объяснение:** При загрузке сначала выполняется POST и bootstrap, затем загружается IOS, затем startup-config. Содержимое running-config формируется в RAM; при отсутствии конфигурации может открыться setup.

### E601. What are two functions of NVRAM? (Choose two.)

Источник: тесты_exam_2, Q23. Тема: модуль 10.

1. to store the routing table
2. to retain contents when power is removed
3. to store the startup configuration file
4. to contain the running configuration file
5. to store the ARP table

**Ответ:** to retain contents when power is removed; to store the startup configuration file.

**Объяснение:** RAM энергозависима: там running-config, таблицы маршрутов и ARP-кэш. NVRAM сохраняет startup-config после отключения питания. Динамические ARP-записи временные.

### E602. The global configuration command ip default-gateway 172.16.100.1 is applied to a switch. What is the effect of this command?

Источник: тесты_exam_2, Q24; тесты_exam_7, Q52. Тема: модуль 10.

1. The switch will have a management interface with the address 172.16.100.1.
2. The switch can be remotely managed from a host on another network.
3. The switch can communicate with other hosts on the 172.16.100.0 network.
4. The switch is limited to sending and receiving frames to and from the gateway 172.16.100.1.

**Ответ:** The switch can be remotely managed from a host on another network..

**Объяснение:** Для локального адресата хост передаёт кадр напрямую. Для удалённой сети отправляет кадр MAC-адресу своего шлюза; сам IP destination остаётся адресом удалённого узла. Шлюз должен быть достижим в локальной подсети.

### E603. Match the configuration mode with the command that is available in that mode. A R1(config-line)# login done B R1(config)# interface fastethernet 0/0 C R1# copy running-config startup-config D R1> enable

Источник: тесты_exam_2, Q25. Тема: модуль 10.

**Ответ:** R1(config-line)# → login; R1(config)# → interface fastethernet 0/0; R1# → copy running-config startup-config; R1> → enable.

**Объяснение:** User EXEC обозначается >, privileged EXEC — #, global configuration — (config)#. enable повышает режим; configure terminal открывает настройку. exit возвращает на один уровень, end/Ctrl-Z — в privileged EXEC.

### E604. Refer to the exhibit. Consider the IP address configuration shown from PC1. What is a description of the default gateway address?

Источник: тесты_exam_2, Q26. Тема: модуль 10.

1. It is the IP address of the Router1 interface that connects the company to the Internet.
2. It is the IP address of the Router1 interface that connects the PC1 LAN to Router1.
3. It is the IP address of Switch1 that connects PC1 to other devices on the same LAN.
4. It is the IP address of the ISP network device located in the cloud.

**Ответ для показанного варианта (нужна схема/PT для полной проверки):** It is the IP address of the Router1 interface that connects the PC1 LAN to Router1..

**Объяснение:** Для локального адресата хост передаёт кадр напрямую. Для удалённой сети отправляет кадр MAC-адресу своего шлюза; сам IP destination остаётся адресом удалённого узла. Шлюз должен быть достижим в локальной подсети.

**Проверка условия:** исходный рисунок или PT-файл не включён в прежнюю текстовую выгрузку. Конкретные адреса/порты выше сохранены из отображённого варианта; это не универсальный ответ для иной схемы.

### E605. What will happen if the default gateway address is incorrectly configured on a host?

Источник: тесты_exam_2, Q27; тесты_exam_7, Q4. Тема: модуль 10.

1. The host cannot communicate with other hosts in the local network.
2. The switch will not forward packets initiated by the host.
3. The host will have to use ARP to determine the correct address of the default gateway.
4. The host cannot communicate with hosts in other networks.
5. A ping from the host to 127.0.0.1 would not be successful.

**Ответ:** The host cannot communicate with hosts in other networks..

**Объяснение:** Для локального адресата хост передаёт кадр напрямую. Для удалённой сети отправляет кадр MAC-адресу своего шлюза; сам IP destination остаётся адресом удалённого узла. Шлюз должен быть достижим в локальной подсети.

### E606. What is the effect of using the Router# copy running-config startup-config command on a router?

Источник: тесты_exam_2, Q28. Тема: модуль 10.

1. The contents of ROM will change.
2. The contents of RAM will change.
3. The contents of NVRAM will change.
4. The contents of flash will change.

**Ответ:** The contents of NVRAM will change..

**Объяснение:** running-config действует сейчас в RAM; startup-config используется при загрузке. copy running-config startup-config сохраняет изменения. Настройка обычно начинает действовать сразу; несохранённые изменения пропадут после reload без сохранения.

### E658. Which command can an administrator execute to determine what interface a router will use to reach remote networks?

Источник: тесты_exam_5, Q15. Тема: модуль 10.

1. show arp
2. show interfaces
3. show ip route
4. show protocols

**Ответ:** show ip route.

**Объяснение:** Маршрутизатор ищет сеть назначения в таблице маршрутизации, предпочитая самый длинный совпавший префикс. show ip route показывает таблицу IOS; O означает OSPF, S — static. Default route используется при отсутствии более специфичного маршрута. Windows: route print или netstat -r.

### E661. What information about a Cisco router can be verified using the show version command?

Источник: тесты_exam_5, Q18. Тема: модуль 10.

1. the routing protocol version that is enabled
2. the value of the configuration register
3. the operational status of serial interfaces
4. the administrative distance used to reach networks

**Ответ:** the value of the configuration register.

**Объяснение:** show version показывает версию IOS, время работы, оборудование и параметры загрузки, в том числе configuration register на соответствующих платформах. Для IP интерфейсов удобнее show ip interface brief.

### E665. Refer to the exhibit. An administrator is testing connectivity to a remote device with the IP address 10.1.1.1. What does the output of this command indicate?

Источник: тесты_exam_5, Q22. Тема: модуль 10.

1. Connectivity to the remote device was successful.
2. A router along the path did not have a route to the destination.
3. A ping packet is being blocked by a security device along the path.
4. The connection timed out while waiting for a reply from the remote device.

**Ответ для показанного варианта (нужна схема/PT для полной проверки):** A router along the path did not have a route to the destination..

**Объяснение:** ping отправляет Echo Request и ждёт Echo Reply: проверяет достижимость и RTT. В IOS ! — ответ, . — таймаут, U — unreachable. Отсутствие ответа не локализует неисправность само по себе; ICMP мог быть запрещён.

**Проверка условия:** исходный рисунок или PT-файл не включён в прежнюю текстовую выгрузку. Конкретные адреса/порты выше сохранены из отображённого варианта; это не универсальный ответ для иной схемы.

### E678. A network technician is troubleshooting an issue and needs to verify the IP addresses of all interfaces on a router. What is the best command to use to accomplish the task?

Источник: тесты_exam_5, Q35. Тема: модуль 10.

1. show ip interface brief
2. nslookup
3. ipconfig getifaddr en0
4. show ip route

**Ответ:** show ip interface brief.

**Объяснение:** show ip interface brief кратко показывает интерфейс, IPv4-адрес и состояния Status/Protocol. Рабочий интерфейс обычно up/up; administratively down требует no shutdown. По выводу можно судить только о показанных интерфейсах.

### E696. What does a router do when it receives a Layer 2 frame over the network medium?

Источник: тесты_exam_6, Q18. Тема: модуль 10.

1. determines the best path
2. de-encapsulates the frame
3. re-encapsulates the packet into a new frame
4. forwards the new frame appropriate to the medium of that segment of the physical network

**Ответ:** de-encapsulates the frame.

**Объяснение:** Канальный уровень помещает IP-пакет в кадр. Маршрутизатор снимает входной L2-заголовок и формирует новый для следующего канала; IP-пакет передаётся дальше.

### E700. If the default gateway is configured incorrectly on the host, what is the impact on communications?

Источник: тесты_exam_6, Q22. Тема: модуль 10.

1. The host is unable to communicate on the local network.
2. The host can communicate with other hosts on the local network, but is unable to communicate with hosts on remote networks.
3. The host can communicate with other hosts on remote networks, but is unable to communicate with hosts on the local network.
4. There is no impact on communications.

**Ответ:** The host can communicate with other hosts on the local network, but is unable to communicate with hosts on remote networks..

**Объяснение:** Для локального адресата хост передаёт кадр напрямую. Для удалённой сети отправляет кадр MAC-адресу своего шлюза; сам IP destination остаётся адресом удалённого узла. Шлюз должен быть достижим в локальной подсети.

### E740. Which two statements describe features of an IPv4 routing table on a router? (Choose two.)

Источник: тесты_exam_7, Q7. Тема: модуль 10.

1. The netstat -r command can be used to display the routing table of a router.
2. Directly connected interfaces will have two route source codes in the routing table: C and S.
3. It stores information about routes derived from the active router interfaces.
4. If there are two or more possible routes to the same destination, the route associated with the higher metric value is included in the routing table.
5. If a default static route is configured in the router, an entry will be included in the routing table with source code S.
6. The routing table lists the MAC addresses of each active interface.

**Ответ:** It stores information about routes derived from the active router interfaces.; If a default static route is configured in the router, an entry will be included in the routing table with source code S..

**Объяснение:** Маршрутизатор ищет сеть назначения в таблице маршрутизации, предпочитая самый длинный совпавший префикс. show ip route показывает таблицу IOS; O означает OSPF, S — static. Default route используется при отсутствии более специфичного маршрута. Windows: route print или netstat -r.

### E766. Refer to the exhibit. If PC1 is sending a packet to PC2 and routing has been configured between the two routers, what will R1 do with the Ethernet frame header attached by PC1?

Источник: тесты_exam_7, Q33. Тема: модуль 10.

1. nothing, because the router has a route to the destination network
2. remove the Ethernet header and configure a new Layer 2 header before sending it out S0/0/0
3. open the header and replace the destination MAC address with a new one
4. open the header and use it to determine whether the data is to be sent out S0/0/0

**Ответ для показанного варианта (нужна схема/PT для полной проверки):** remove the Ethernet header and configure a new Layer 2 header before sending it out S0/0/0.

**Объяснение:** Канальный уровень помещает IP-пакет в кадр. Маршрутизатор снимает входной L2-заголовок и формирует новый для следующего канала; IP-пакет передаётся дальше.

**Проверка условия:** исходный рисунок или PT-файл не включён в прежнюю текстовую выгрузку. Конкретные адреса/порты выше сохранены из отображённого варианта; это не универсальный ответ для иной схемы.

### E769. Refer to the exhibit. What three facts can be determined from the viewable output of the show ip interface brief command? (Choose three.)

Источник: тесты_exam_7, Q36. Тема: модуль 10.

1. Two physical interfaces have been configured.
2. The switch can be remotely managed.
3. One device is attached to a physical interface.
4. Passwords have been configured on the switch.
5. Two devices are attached to the switch.
6. The default SVI has been configured.

**Ответ для показанного варианта (нужна схема/PT для полной проверки):** The switch can be remotely managed.; One device is attached to a physical interface.; The default SVI has been configured..

**Объяснение:** show ip interface brief кратко показывает интерфейс, IPv4-адрес и состояния Status/Protocol. Рабочий интерфейс обычно up/up; administratively down требует no shutdown. По выводу можно судить только о показанных интерфейсах.

**Проверка условия:** исходный рисунок или PT-файл не включён в прежнюю текстовую выгрузку. Конкретные адреса/порты выше сохранены из отображённого варианта; это не универсальный ответ для иной схемы.


## Модуль 11: IPv4 и подсети

### E045. What is the structure of an IPv4 address called?

Источник: модули_02, Q1. Тема: модуль 11.

1. Dotted-binary format
2. Dotted-decimal format
3. Dotted-hexadecimal format

**Ответ:** Dotted-decimal format.

**Объяснение:** IPv4 — 32 бита: четыре десятичных октета по 8 бит. IPv6 — 128 бит, обычно восемь шестнадцатеричных групп. Формат записи не меняет размер адреса.

### E046. How is an IPv4 address represented?

Источник: модули_02, Q2. Тема: модуль 11.

1. Four binary numbers between 0 and 1 separated by colons.
2. Four decimal numbers between 0 and 255 separated by periods.
3. Thirty-two hexadecimal numbers separated by colons.
4. Thirty-two hexadecimal numbers separated by periods.

**Ответ:** Four decimal numbers between 0 and 255 separated by periods..

**Объяснение:** IPv4 — 32 бита: четыре десятичных октета по 8 бит. IPv6 — 128 бит, обычно восемь шестнадцатеричных групп. Формат записи не меняет размер адреса.

### E061. To what subnet does the IP address 10.1.100.50 belong if a subnet mask of 255.255.0.0 is used?

Источник: модули_02, Q14. Тема: модуль 11.

1. 10.1.0.0
2. 10.0.0.0
3. 10.1.100.32
4. 10.1.100.0

**Ответ:** 10.1.0.0.

**Объяснение:** Network address = IP AND subnet mask. При /24 сравнивают первые три октета, при /16 — первые два; совпадение сетевой части означает одну подсеть. Для обычного хоста нельзя использовать адрес сети и broadcast.

### E065. Which delivery method is used to transmit information to one or more end devices, but not all devices on the network?

Источник: модули_03, Q4. Тема: модуль 11.

1. Unicast
2. Multicast
3. Broadcast

**Ответ:** Multicast.

**Объяснение:** Unicast — один получатель, multicast — заданная группа, broadcast — все в широковещательном домене. IPv4 multicast: 224.0.0.0/4. Directed broadcast использует адрес broadcast конкретной удалённой подсети; его пересылка обычно отключена.

### E086. What is used to determine the network portion of an IPv4 address?

Источник: модули_03, Q3. Тема: модуль 11.

1. Subnet mask
2. MAC address
3. Right-most part of the IP address
4. Left-most part of the MAC address

**Ответ:** Subnet mask.

**Объяснение:** Network address = IP AND subnet mask. При /24 сравнивают первые три октета, при /16 — первые два; совпадение сетевой части означает одну подсеть. Для обычного хоста нельзя использовать адрес сети и broadcast.

### E091. What type of communication will send a message to all devices on a local area network?

Источник: модули_03, Q2. Тема: модуль 11.

1. Broadcast
2. Multicast
3. Unicast
4. Allcast

**Ответ:** Broadcast.

**Объяснение:** Unicast — один получатель, multicast — заданная группа, broadcast — все в широковещательном домене. IPv4 multicast: 224.0.0.0/4. Directed broadcast использует адрес broadcast конкретной удалённой подсети; его пересылка обычно отключена.

### E093. Which message delivery option is used when all devices need to receive the same message simultaneously?

Источник: модули_03, Q4. Тема: модуль 11.

1. Duplex
2. Unicast
3. Multicast
4. Broadcast

**Ответ:** Broadcast.

**Объяснение:** Unicast — один получатель, multicast — заданная группа, broadcast — все в широковещательном домене. IPv4 multicast: 224.0.0.0/4. Directed broadcast использует адрес broadcast конкретной удалённой подсети; его пересылка обычно отключена.

### E100. Which type of communication will send a message to a group of host destinations simultaneously?

Источник: модули_03, Q11. Тема: модуль 11.

1. Broadcast
2. Multicast
3. Unicast
4. Anycast

**Ответ:** Multicast.

**Объяснение:** Unicast — один получатель, multicast — заданная группа, broadcast — все в широковещательном домене. IPv4 multicast: 224.0.0.0/4. Directed broadcast использует адрес broadcast конкретной удалённой подсети; его пересылка обычно отключена.

### E136. Given the binary address of 11101100 00010001 00001100 00001010, which address does this represent in dotted decimal format?

Источник: модули_05, Q2. Тема: модуль 11.

1. 234.17.10.9
2. 234.16.12.10
3. 236.17.12.6
4. 236.17.12.10

**Ответ:** 236.17.12.10.

**Объяснение:** Преобразуйте каждый октет отдельно по весам 128, 64, 32, 16, 8, 4, 2, 1. Например 11000000 = 128+64 = 192. Сохраняйте восемь бит в каждой группе.

### E140. Which IPv4 address format was created for ease of use by people and is expressed as 201.192.1.14?

Источник: модули_05, Q6. Тема: модуль 11.

1. Binary
2. Dotted decimal
3. Hexadecimal
4. ASCII

**Ответ:** Dotted decimal.

**Объяснение:** IPv4 — 32 бита: четыре десятичных октета по 8 бит. IPv6 — 128 бит, обычно восемь шестнадцатеричных групп. Формат записи не меняет размер адреса.

### E141. What is the dotted decimal representation of the IPv4 address 11001011.00000000.01110001.11010011?

Источник: модули_05, Q7. Тема: модуль 11.

1. 192.0.2.199
2. 198.51.100.201
3. 203.0.113.211
4. 209.165.201.223

**Ответ:** 203.0.113.211.

**Объяснение:** Преобразуйте каждый октет отдельно по весам 128, 64, 32, 16, 8, 4, 2, 1. Например 11000000 = 128+64 = 192. Сохраняйте восемь бит в каждой группе.

### E144. What is the dotted decimal representation of the IPv4 address which is represented as the binary string 00001010.01100100.00010101.00000001?

Источник: модули_05, Q10. Тема: модуль 11.

1. 10.100.21.1
2. 10.10.20.1
3. 100.10.11.1
4. 100.21.10.1

**Ответ:** 10.100.21.1.

**Объяснение:** Преобразуйте каждый октет отдельно по весам 128, 64, 32, 16, 8, 4, 2, 1. Например 11000000 = 128+64 = 192. Сохраняйте восемь бит в каждой группе.

### E148. How many bits are in an IPv4 address?

Источник: модули_05, Q14. Тема: модуль 11.

1. 32
2. 64
3. 128
4. 256

**Ответ:** 32.

**Объяснение:** IPv4 — 32 бита: четыре десятичных октета по 8 бит. IPv6 — 128 бит, обычно восемь шестнадцатеричных групп. Формат записи не меняет размер адреса.

### E271. Host-A has the IPv4 address and subnet mask 10.5.4.100 255.255.255.0. What is the network address of Host-A?

Источник: модули_11, Q1. Тема: модуль 11.

1. 10.0.0.0
2. 10.5.0.0
3. 10.5.4.0
4. 10.5.4.100

**Ответ:** 10.5.4.0.

**Объяснение:** Network address = IP AND subnet mask. При /24 сравнивают первые три октета, при /16 — первые два; совпадение сетевой части означает одну подсеть. Для обычного хоста нельзя использовать адрес сети и broadcast.

### E272. Host-A has the IPv4 address and subnet mask 172.16.4.100 255.255.0.0. What is the network address of Host-A?

Источник: модули_11, Q2. Тема: модуль 11.

1. 172.0.0.0
2. 172.16.0.0
3. 172.16.4.0
4. 172.16.4.100

**Ответ:** 172.16.0.0.

**Объяснение:** Network address = IP AND subnet mask. При /24 сравнивают первые три октета, при /16 — первые два; совпадение сетевой части означает одну подсеть. Для обычного хоста нельзя использовать адрес сети и broadcast.

### E273. Host-A has the IPv4 address and subnet mask 10.5.4.100 255.255.255.0. Which of the following IPv4 addresses would be on the same network as Host-A? (Choose all that apply)

Источник: модули_11, Q3. Тема: модуль 11.

1. 10.5.4.1
2. 10.5.0.1
3. 10.5.4.99
4. 10.0.0.98
5. 10.5.100.4

**Ответ:** 10.5.4.1; 10.5.4.99.

**Объяснение:** Network address = IP AND subnet mask. При /24 сравнивают первые три октета, при /16 — первые два; совпадение сетевой части означает одну подсеть. Для обычного хоста нельзя использовать адрес сети и broadcast.

### E274. Host-A has the IPv4 address and subnet mask 172.16.4.100 255.255.0.0. Which of the following IPv4 addresses would be on the same network as Host-A? (Choose all that apply)

Источник: модули_11, Q4. Тема: модуль 11.

1. 172.16.4.99
2. 172.16.0.1
3. 172.17.4.99
4. 172.17.4.1
5. 172.18.4.1

**Ответ:** 172.16.4.99; 172.16.0.1.

**Объяснение:** Network address = IP AND subnet mask. При /24 сравнивают первые три октета, при /16 — первые два; совпадение сетевой части означает одну подсеть. Для обычного хоста нельзя использовать адрес сети и broadcast.

### E275. Host-A has the IPv4 address and subnet mask 192.168.1.50 255.255.255.0. Which of the following IPv4 addresses would be on the same network as Host-A? (Choose all that apply)

Источник: модули_11, Q5. Тема: модуль 11.

1. 192.168.0.1
2. 192.168.0.100
3. 192.168.1.1
4. 192.168.1.100
5. 192.168.2.1

**Ответ:** 192.168.1.1; 192.168.1.100.

**Объяснение:** Network address = IP AND subnet mask. При /24 сравнивают первые три октета, при /16 — первые два; совпадение сетевой части означает одну подсеть. Для обычного хоста нельзя использовать адрес сети и broadcast.

### E276. Which two statements are correct about private IPv4 addresses? (Choose two.)

Источник: модули_11, Q1. Тема: модуль 11.

1. Private IPv4 addresses are assigned to devices within an organization’s intranet (internal network).
2. Internet routers will typically forward any packet with a destination address that is a private IPv4 address.
3. 172.99.1.1 is a private IPv4 address.
4. Any organization (home, school, office, company) can use the 10.0.0.0/8 address.

**Ответ:** Private IPv4 addresses are assigned to devices within an organization’s intranet (internal network).; Any organization (home, school, office, company) can use the 10.0.0.0/8 address..

**Объяснение:** Частные IPv4-диапазоны: 10/8, 172.16/12, 192.168/16. Они не маршрутизируются в публичном интернете как глобальные адреса. 169.254/16 — link-local, 127/8 — loopback, 192.0.2/24 — документация.

### E277. Which two statements are correct about public IPv4 addresses? (Choose two.)

Источник: модули_11, Q2. Тема: модуль 11.

1. Public IPv4 addresses are allowed to be assigned to devices within an organization’s intranet (internal network).
2. To access a device over the internet, the destination IPv4 address must be a public address.
3. 192.168.1.10 is a public IPv4 address.
4. Public IPv4 address exhaustion is a reason why there are private IPv4 addresses and why organizations are transitioning to IPv6.

**Ответ:** To access a device over the internet, the destination IPv4 address must be a public address.; Public IPv4 address exhaustion is a reason why there are private IPv4 addresses and why organizations are transitioning to IPv6..

**Объяснение:** Частные IPv4-диапазоны: 10/8, 172.16/12, 192.168/16. Они не маршрутизируются в публичном интернете как глобальные адреса. 169.254/16 — link-local, 127/8 — loopback, 192.0.2/24 — документация.

### E278. Which organization or group of organizations receives IP addresses from IANA and is responsible for allocating these addresses to ISPs and some organizations?

Источник: модули_11, Q3. Тема: модуль 11.

1. IETF
2. IEEE
3. RIRs
4. Tier 1 ISPs

**Ответ:** RIRs.

**Объяснение:** IANA распределяет крупные адресные ресурсы региональным интернет-регистратурам (RIR), которые выделяют их провайдерам и организациям.

### E279. Which devices will not forward an IPv4 broadcast packet by default?

Источник: модули_11, Q1. Тема: модуль 11.

1. Ethernet switch
2. Router
3. Windows PC
4. None of the above. All devices forward IPv4 broadcast packets by default.

**Ответ:** Router.

**Объяснение:** IPv4 broadcast остаётся в широковещательном домене: маршрутизатор обычно его не пересылает. Избыток broadcast занимает канал и заставляет хосты тратить ресурсы на обработку.

### E280. Which two situations are the result of excessive broadcast traffic? (Choose two)

Источник: модули_11, Q2. Тема: модуль 11.

1. Slow network operations
2. Slow device operations
3. When devices on all adjacent networks are affected
4. When the router has to forward an excessive number of packets

**Ответ:** Slow network operations; Slow device operations.

**Объяснение:** IPv4 broadcast остаётся в широковещательном домене: маршрутизатор обычно его не пересылает. Избыток broadcast занимает канал и заставляет хосты тратить ресурсы на обработку.

### E281. What is the prefix length notation for the subnet mask 255.255.255.224?

Источник: модули_11, Q1; тесты_IP_Addressing, Q28. Тема: модуль 11.

1. /25
2. /26
3. /27
4. /28

**Ответ:** /27.

**Объяснение:** В маске единицы задают network prefix, нули — host bits. /27 = 255.255.255.224 (5 host bits), /28 = .240 (4), /26 = .192 (6), /20 = 255.255.240.0.

### E282. How many valid host addresses are available on an IPv4 subnet that is configured with a /26 mask?

Источник: модули_11, Q2. Тема: модуль 11.

1. 254
2. 190
3. 192
4. 62
5. 64

**Ответ:** 62.

**Объяснение:** Для обычной IPv4 LAN с h битами хоста: 2^h адресов, 2^h−2 пригодных хостам. /26: 64−2=62; /27: 32−2=30; /28: 16−2=14; /25: 128−2=126; /22: 1024−2=1022. /31 и /32 — отдельные случаи.

### E283. Which subnet mask would be used if 5 host bits are available?

Источник: модули_11, Q3. Тема: модуль 11.

1. 255.255.255.0
2. 255.255.255.128
3. 255.255.255.224
4. 255.255.255.240

**Ответ:** 255.255.255.224.

**Объяснение:** В маске единицы задают network prefix, нули — host bits. /27 = 255.255.255.224 (5 host bits), /28 = .240 (4), /26 = .192 (6), /20 = 255.255.240.0.

### E284. A network administrator subnets the 192.168.10.0/24 network into subnets with /26 masks. How many equal-sized subnets are created?

Источник: модули_11, Q4. Тема: модуль 11.

1. 1
2. 2
3. 4
4. 8
5. 16
6. 64

**Ответ:** 4.

**Объяснение:** Число равных подсетей = 2^b, где b — число дополнительно занятых сетевых битов. /24→/26 занимает 2 бита и даёт 4 подсети. Для пяти сетей нужны 3 бита (8 вариантов). При VLSM размеры подсетей различаются.

### E285. What subnet mask is represented by the slash notation /20?

Источник: модули_11, Q5. Тема: модуль 11.

1. 255.255.255.248
2. 255.255.224.0
3. 255.255.240.0
4. 255.255.255.0
5. 255.255.255.192

**Ответ:** 255.255.240.0.

**Объяснение:** В маске единицы задают network prefix, нули — host bits. /27 = 255.255.255.224 (5 host bits), /28 = .240 (4), /26 = .192 (6), /20 = 255.255.240.0.

### E286. Which statement is true about variable-length subnet masking?

Источник: модули_11, Q6. Тема: модуль 11.

1. Each subnet is the same size.
2. The size of each subnet may be different, depending on requirements.
3. Subnets may only be subnetted one additional time.
4. Bits are returned, rather than borrowed, to create additional subnets.

**Ответ:** The size of each subnet may be different, depending on requirements..

**Объяснение:** Число равных подсетей = 2^b, где b — число дополнительно занятых сетевых битов. /24→/26 занимает 2 бита и даёт 4 подсети. Для пяти сетей нужны 3 бита (8 вариантов). При VLSM размеры подсетей различаются.

### E287. Why does a Layer 3 device perform the ANDing process on a destination IP address and subnet mask?

Источник: модули_11, Q7. Тема: модуль 11.

1. To identify the broadcast address of the destination network
2. To identify the host address of the destination host
3. To identify faulty frames
4. To identify the network address of the destination network

**Ответ:** To identify the network address of the destination network.

**Объяснение:** Network address = IP AND subnet mask. При /24 сравнивают первые три октета, при /16 — первые два; совпадение сетевой части означает одну подсеть. Для обычного хоста нельзя использовать адрес сети и broadcast.

### E288. How many usable IP addresses are available on the 192.168.1.0/27 network?

Источник: модули_11, Q8. Тема: модуль 11.

1. 256
2. 254
3. 62
4. 30
5. 16
6. 32

**Ответ:** 30.

**Объяснение:** Для обычной IPv4 LAN с h битами хоста: 2^h адресов, 2^h−2 пригодных хостам. /26: 64−2=62; /27: 32−2=30; /28: 16−2=14; /25: 128−2=126; /22: 1024−2=1022. /31 и /32 — отдельные случаи.

### E289. Which subnet mask would be used if exactly 4 host bits are available?

Источник: модули_11, Q9. Тема: модуль 11.

1. 255.255.255.224
2. 255.255.255.128
3. 255.255.255.240
4. 255.255.255.248

**Ответ:** 255.255.255.240.

**Объяснение:** В маске единицы задают network prefix, нули — host bits. /27 = 255.255.255.224 (5 host bits), /28 = .240 (4), /26 = .192 (6), /20 = 255.255.240.0.

### E290. Which two parts are components of an IPv4 address? (Choose two.)

Источник: модули_11, Q10. Тема: модуль 11.

1. Subnet portion
2. Network portion
3. Logical portion
4. Host portion
5. Physical portion
6. Broadcast portion

**Ответ:** Network portion; Host portion.

**Объяснение:** IPv4 состоит из сетевой и хостовой частей. У 172.17.4.250/24 сеть 172.17.4.0, broadcast 172.17.4.255, поэтому .250 — допустимый адрес хоста.

### E291. If a network device has a mask of /26, how many IP addresses are available for hosts on this network?

Источник: модули_11, Q11. Тема: модуль 11.

1. 64
2. 30
3. 62
4. 32
5. 16
6. 14

**Ответ:** 62.

**Объяснение:** Для обычной IPv4 LAN с h битами хоста: 2^h адресов, 2^h−2 пригодных хостам. /26: 64−2=62; /27: 32−2=30; /28: 16−2=14; /25: 128−2=126; /22: 1024−2=1022. /31 и /32 — отдельные случаи.

### E292. What does the IP address 172.17.4.250/24 represent?

Источник: модули_11, Q12. Тема: модуль 11.

1. Network address
2. Multicast address
3. Host address
4. Broadcast address

**Ответ:** Host address.

**Объяснение:** IPv4 состоит из сетевой и хостовой частей. У 172.17.4.250/24 сеть 172.17.4.0, broadcast 172.17.4.255, поэтому .250 — допустимый адрес хоста.

### E293. If a network device has a mask of /28, how many IP addresses are available for hosts on this network?

Источник: модули_11, Q13. Тема: модуль 11.

1. 256
2. 254
3. 62
4. 32
5. 16
6. 14

**Ответ:** 14.

**Объяснение:** Для обычной IPv4 LAN с h битами хоста: 2^h адресов, 2^h−2 пригодных хостам. /26: 64−2=62; /27: 32−2=30; /28: 16−2=14; /25: 128−2=126; /22: 1024−2=1022. /31 и /32 — отдельные случаи.

### E294. What is the purpose of the subnet mask in conjunction with an IP address?

Источник: модули_11, Q14. Тема: модуль 11.

1. To uniquely identify a host on a network
2. To identify whether the address is public or private
3. To determine the subnet to which the host belongs
4. To mask the IP address to outsiders

**Ответ:** To determine the subnet to which the host belongs.

**Объяснение:** Network address = IP AND subnet mask. При /24 сравнивают первые три октета, при /16 — первые два; совпадение сетевой части означает одну подсеть. Для обычного хоста нельзя использовать адрес сети и broadcast.

### E295. A network administrator is variably subnetting a network. The smallest subnet has a mask of 255.255.255.224. How many usable host addresses will this subnet provide?

Источник: модули_11, Q15. Тема: модуль 11.

1. 2
2. 6
3. 14
4. 30
5. 62

**Ответ:** 30.

**Объяснение:** Для обычной IPv4 LAN с h битами хоста: 2^h адресов, 2^h−2 пригодных хостам. /26: 64−2=62; /27: 32−2=30; /28: 16−2=14; /25: 128−2=126; /22: 1024−2=1022. /31 и /32 — отдельные случаи.

### E480. Match the subnetwork to a host address that would be included within the subnetwork. A 192.168.1.32/27 192.168.1.48 done B 192.168.1.64/27 192.168.1.68 C 192.168.1.96/27 192.168.1.121

Источник: тесты_IP_Addressing, Q2. Тема: модуль 11.

**Ответ:** 192.168.1.32/27 → 192.168.1.48; 192.168.1.64/27 → 192.168.1.68; 192.168.1.96/27 → 192.168.1.121.

**Объяснение:** При /27 размер блока 32: .32–.63, .64–.95, .96–.127. При /26 блок 64: .64–.127, пригодные хосты .65–.126, поэтому .96 в /26 — хост, а в соответствующей /27 — адрес сети.

### E481. How many host addresses are available on the network 172.16.128.0 with a subnet mask of 255.255.252.0?

Источник: тесты_IP_Addressing, Q3. Тема: модуль 11.

1. 510
2. 512
3. 1022
4. 1024
5. 2046
6. 2048

**Ответ:** 1022.

**Объяснение:** Для обычной IPv4 LAN с h битами хоста: 2^h адресов, 2^h−2 пригодных хостам. /26: 64−2=62; /27: 32−2=30; /28: 16−2=14; /25: 128−2=126; /22: 1024−2=1022. /31 и /32 — отдельные случаи.

### E482. Which address prefix range is reserved for IPv4 multicast?

Источник: тесты_IP_Addressing, Q4. Тема: модуль 11.

1. 240.0.0.0 - 254.255.255.255
2. 224.0.0.0 - 239.255.255.255
3. 169.254.0.0 - 169.254.255.255
4. 127.0.0.0 - 127.255.255.255

**Ответ:** 224.0.0.0 - 239.255.255.255.

**Объяснение:** Unicast — один получатель, multicast — заданная группа, broadcast — все в широковещательном домене. IPv4 multicast: 224.0.0.0/4. Directed broadcast использует адрес broadcast конкретной удалённой подсети; его пересылка обычно отключена.

### E484. A site administrator has been told that a particular network at the site must accommodate 126 hosts. Which subnet mask would be used that contains the required number of host bits?

Источник: тесты_IP_Addressing, Q6. Тема: модуль 11.

1. 255.255.255.0
2. 255.255.255.128
3. 255.255.255.224
4. 255.255.255.240

**Ответ:** 255.255.255.128.

**Объяснение:** Для обычной IPv4 LAN с h битами хоста: 2^h адресов, 2^h−2 пригодных хостам. /26: 64−2=62; /27: 32−2=30; /28: 16−2=14; /25: 128−2=126; /22: 1024−2=1022. /31 и /32 — отдельные случаи.

### E485. Refer to the exhibit. Considering the addresses already used and having to remain within the 10.16.10.0/24 network range, which subnet address could be assigned to the network containing 25 hosts?

Источник: тесты_IP_Addressing, Q7. Тема: модуль 11.

1. 10.16.10.160/26
2. 10.16.10.128/28
3. 10.16.10.64/27
4. 10.16.10.224/26
5. 10.16.10.240/27
6. 10.16.10.240/28

**Ответ для показанного варианта (нужна схема/PT для полной проверки):** 10.16.10.64/27.

**Объяснение:** Выберите минимальный блок с достаточным числом хостов и без пересечений: 25 хостам нужен /27 (30 пригодных), 10 хостам /28 (14). Допустимость конкретного свободного диапазона зависит от занятых сетей на схеме.

**Проверка условия:** исходный рисунок или PT-файл не включён в прежнюю текстовую выгрузку. Конкретные адреса/порты выше сохранены из отображённого варианта; это не универсальный ответ для иной схемы.

### E487. How many host addresses are available on the 192.168.10.128/26 network?

Источник: тесты_IP_Addressing, Q9. Тема: модуль 11.

1. 30
2. 32
3. 60
4. 62
5. 64

**Ответ:** 62.

**Объяснение:** Для обычной IPv4 LAN с h битами хоста: 2^h адресов, 2^h−2 пригодных хостам. /26: 64−2=62; /27: 32−2=30; /28: 16−2=14; /25: 128−2=126; /22: 1024−2=1022. /31 и /32 — отдельные случаи.

### E488. A message is sent to all hosts on a remote network. Which type of message is it?

Источник: тесты_IP_Addressing, Q10. Тема: модуль 11.

1. limited broadcast
2. multicast
3. directed broadcast
4. unicast

**Ответ:** directed broadcast.

**Объяснение:** Unicast — один получатель, multicast — заданная группа, broadcast — все в широковещательном домене. IPv4 multicast: 224.0.0.0/4. Directed broadcast использует адрес broadcast конкретной удалённой подсети; его пересылка обычно отключена.

### E489. Refer to the exhibit. An administrator must send a message to everyone on the router A network. What is the broadcast address for network 172.16.16.0/22?

Источник: тесты_IP_Addressing, Q11. Тема: модуль 11.

1. 172.16.16.255
2. 172.16.20.255
3. 172.16.19.255
4. 172.16.23.255
5. 172.16.255.255

**Ответ для показанного варианта (нужна схема/PT для полной проверки):** 172.16.19.255.

**Объяснение:** Маска /22 = 255.255.252.0; шаг третьего октета 4. Сеть 172.16.16.0 охватывает третьи октеты 16–19; последний адрес — 172.16.19.255.

**Проверка условия:** исходный рисунок или PT-файл не включён в прежнюю текстовую выгрузку. Конкретные адреса/порты выше сохранены из отображённого варианта; это не универсальный ответ для иной схемы.

### E505. Match each description with an appropriate IP address. A an experimental address 240.2.6.255 done B a private address 172.19.20.5 C a TEST-NET address 192.0.2.123 D a link-local address 169.254.1.5 E a loopback address 127.0.0.1

Источник: тесты_IP_Addressing, Q27. Тема: модуль 11.

**Ответ:** 240.2.6.255 → experimental/reserved; 172.19.20.5 → private; 192.0.2.123 → TEST-NET; 169.254.1.5 → link-local; 127.0.0.1 → loopback.

**Объяснение:** Частные IPv4-диапазоны: 10/8, 172.16/12, 192.168/16. Они не маршрутизируются в публичном интернете как глобальные адреса. 169.254/16 — link-local, 127/8 — loopback, 192.0.2/24 — документация.

### E507. Which subnet would include the address 192.168.1.96 as a usable host address?

Источник: тесты_IP_Addressing, Q29; тесты_exam_7, Q10. Тема: модуль 11.

1. 192.168.1.64/26
2. 192.168.1.32/27
3. 192.168.1.32/28
4. 192.168.1.64/29

**Ответ:** 192.168.1.64/26.

**Объяснение:** При /27 размер блока 32: .32–.63, .64–.95, .96–.127. При /26 блок 64: .64–.127, пригодные хосты .65–.126, поэтому .96 в /26 — хост, а в соответствующей /27 — адрес сети.

### E509. A host is transmitting a multicast. Which host or hosts will receive it?

Источник: тесты_IP_Addressing, Q31. Тема: модуль 11.

1. a specially defined group of hosts
2. one specific host
3. all hosts with the same IP address
4. the closest neighbor on the same network

**Ответ:** a specially defined group of hosts.

**Объяснение:** Unicast — один получатель, multicast — заданная группа, broadcast — все в широковещательном домене. IPv4 multicast: 224.0.0.0/4. Directed broadcast использует адрес broadcast конкретной удалённой подсети; его пересылка обычно отключена.

### E517. A technician configures a switch with these commands: SwitchA(config)# interface vlan 1 SwitchA(config-if)# ip address 192.168.1.1 255.255.255.0 SwitchA(config-if)# no shutdown What is the technician configuring?

Источник: тесты_exam_0, Q6. Тема: модуль 11.

1. Telnet access
2. SVI
3. Password encryption
4. Physical switchport access

**Ответ:** SVI.

**Объяснение:** SVI — программный интерфейс VLAN, без отдельного физического порта. На L2-коммутаторе его IP позволяет управлять устройством; в начальных примерах используется VLAN 1. Для удалённой сети нужен default gateway.

### E532. What is a characteristic of multicast messages?

Источник: тесты_exam_0, Q21. Тема: модуль 11.

1. They are sent to a select group of hosts.
2. They are sent to all hosts on a network.
3. They must be acknowledged.
4. They are sent to a single destination.

**Ответ:** They are sent to a select group of hosts..

**Объяснение:** Unicast — один получатель, multicast — заданная группа, broadcast — все в широковещательном домене. IPv4 multicast: 224.0.0.0/4. Directed broadcast использует адрес broadcast конкретной удалённой подсети; его пересылка обычно отключена.

### E611. HQ(config)# interface gi0/1 HQ(config-if)# description Connects to the Branch LAN HQ(config-if)# ip address 172.19.99.99 255.255.255.0 HQ(config-if)# no shutdown HQ(config-if)# interface gi0/0 HQ(config-if)# description Connects to the Store LAN HQ(config-if)# ip address 172.19.98.230 255.255.255.0 HQ(config-if)# no shutdown HQ(config-if)# interface s0/0/0 HQ(config-if)# description Connects to the ISP HQ(config-if)# ip address 10.98.99.254 255.255.255.0 HQ(config-if)# no shutdown HQ(config-if)# interface s0/0/1 HQ(config-if)# description Connects to the Head Office WAN HQ(config-if)# ip address 209.165.200.120 255.255.255.0 HQ(config-if)# no shutdown HQ(config-if)# end Refer to the exhibit. A network administrator is connecting a new host to the Store LAN. The host needs to communicate with remote networks. What IP address would be configured as the default gateway on the new host?

Источник: тесты_exam_2, Q33. Тема: модуль 11.

1. 172.19.98.230
2. 172.19.98.1
3. 10.98.99.254
4. 209.165.200.120
5. 172.19.99.99

**Ответ для показанного варианта (нужна схема/PT для полной проверки):** 172.19.98.230.

**Объяснение:** Для локального адресата хост передаёт кадр напрямую. Для удалённой сети отправляет кадр MAC-адресу своего шлюза; сам IP destination остаётся адресом удалённого узла. Шлюз должен быть достижим в локальной подсети.

**Проверка условия:** исходный рисунок или PT-файл не включён в прежнюю текстовую выгрузку. Конкретные адреса/порты выше сохранены из отображённого варианта; это не универсальный ответ для иной схемы.

### E634. Which three statements describe a DHCP Discover message? (Choose three.)

Источник: тесты_exam_4, Q23. Тема: модуль 11.

1. The source MAC address is 48 ones (FF-FF-FF-FF-FF-FF).
2. The destination IP address is 255.255.255.255.
3. The message comes from a server offering an IP address.
4. The message comes from a client seeking an IP address.
5. All hosts receive the message, but only a DHCP server replies.
6. Only the DHCP server receives the message.

**Ответ:** The destination IP address is 255.255.255.255.; The message comes from a client seeking an IP address.; All hosts receive the message, but only a DHCP server replies..

**Объяснение:** DHCP автоматически выдаёт IPv4-адрес, маску, шлюз и DNS. Процесс DORA: Discover, Offer, Request, Acknowledge. Первичный Discover обычно broadcast. 169.254.x.x при автоконфигурации часто означает, что DHCP-аренду получить не удалось.

### E685. What is a characteristic of a switch virtual interface (SVI)?

Источник: тесты_exam_6, Q7. Тема: модуль 11.

1. Although it is a virtual interface, it needs to have physical hardware on the device associated with it.
2. An SVI is created in software and requires a configured IP address and a subnet mask in order to provide remote access to the switch.
3. SVIs come preconfigured on Cisco switches.
4. SVIs do not require the no shutdown command to become enabled.

**Ответ:** An SVI is created in software and requires a configured IP address and a subnet mask in order to provide remote access to the switch..

**Объяснение:** SVI — программный интерфейс VLAN, без отдельного физического порта. На L2-коммутаторе его IP позволяет управлять устройством; в начальных примерах используется VLAN 1. Для удалённой сети нужен default gateway.

### E698. Which term describes a field in the IPv4 packet header that contains a unicast, multicast, or broadcast address?

Источник: тесты_exam_6, Q20. Тема: модуль 11.

1. destination IPv4 address
2. protocol
3. TTL
4. header checksum

**Ответ:** destination IPv4 address.

**Объяснение:** Source/Destination IP задают конечных отправителя и получателя. Обычно по пути они сохраняются; исключение — преобразование NAT. MAC-адреса относятся к текущему каналу и меняются на маршрутизаторах.

### E705. Floor(config)# interface gi0/1 Floor(config-if)# description Connects to the Registrar LAN Floor(config-if)# ip address 192.168.235.234 255.255.255.0 Floor(config-if)# no shutdown Floor(config-if)# interface gi0/0 Floor(config-if)# description Connects to the Manager LAN Floor(config-if)# ip address 192.168.234.114 255.255.255.0 Floor(config-if)# no shutdown Floor(config-if)# interface s0/0/0 Floor(config-if)# description Connects to the ISP Floor(config-if)# ip address 10.234.235.254 255.255.255.0 Floor(config-if)# no shutdown Floor(config-if)# interface s0/0/1 Floor(config-if)# description Connects to the Head Office WAN Floor(config-if)# ip address 203.0.113.3 255.255.255.0 Floor(config-if)# no shutdown Floor(config-if)# end Refer to the exhibit. A network administrator is connecting a new host to the Registrar LAN. The host needs to communicate with remote networks. What IP address would be configured as the default gateway on the new host?

Источник: тесты_exam_6, Q27. Тема: модуль 11.

1. 192.168.235.234
2. 192.168.235.1
3. 10.234.235.254
4. 203.0.113.3
5. 192.168.234.114

**Ответ для показанного варианта (нужна схема/PT для полной проверки):** 192.168.235.234.

**Объяснение:** Для локального адресата хост передаёт кадр напрямую. Для удалённой сети отправляет кадр MAC-адресу своего шлюза; сам IP destination остаётся адресом удалённого узла. Шлюз должен быть достижим в локальной подсети.

**Проверка условия:** исходный рисунок или PT-файл не включён в прежнюю текстовую выгрузку. Конкретные адреса/порты выше сохранены из отображённого варианта; это не универсальный ответ для иной схемы.

### E707. Three devices are on three different subnets. Match the network address and the broadcast address with each subnet where these devices are located. Device 1: IP address 192.168.10.77/28 on subnet 1Device 2: IP address192.168.10.17/30 on subnet 2Device 3: IP address 192.168.10.35/29 on subnet 3 A Subnet 1 broadcast address 192.168.10.79 done B Subnet 1 network number 192.168.10.64 C Subnet 3 network number 192.168.10.32 D Subnet 2 network number 192.168.10.16 E Subnet 2 broadcast address 192.168.10.19 F Subnet 3 broadcast address 192.168.10.39

Источник: тесты_exam_6, Q29. Тема: модуль 11.

**Ответ:** 192.168.10.77/28 → сеть .64, broadcast .79; 192.168.10.17/30 → сеть .16, broadcast .19; 192.168.10.35/29 → сеть .32, broadcast .39.

**Объяснение:** Для /28 блок 16 адресов; .77 лежит в .64–.79. Для /30 блок 4: .17 в .16–.19. Для /29 блок 8: .35 в .32–.39; адрес .15 завершает блок .8–.15 и является broadcast.

### E709. Given network 172.18.109.0, which subnet mask would be used if 6 host bits were available?

Источник: тесты_exam_6, Q31. Тема: модуль 11.

1. 255.255.255.192
2. 255.255.255.252
3. 255.255.224.0
4. 255.255.255.248
5. 255.255.192.0

**Ответ:** 255.255.255.192.

**Объяснение:** В маске единицы задают network prefix, нули — host bits. /27 = 255.255.255.224 (5 host bits), /28 = .240 (4), /26 = .192 (6), /20 = 255.255.240.0.

### E710. What does the IP address 192.168.1.15/29 represent?

Источник: тесты_exam_6, Q32. Тема: модуль 11.

1. subnetwork address
2. multicast address
3. unicast address
4. broadcast address

**Ответ:** broadcast address.

**Объяснение:** Для /28 блок 16 адресов; .77 лежит в .64–.79. Для /30 блок 4: .17 в .16–.19. Для /29 блок 8: .35 в .32–.39; адрес .15 завершает блок .8–.15 и является broadcast.

### E734. Refer to the exhibit. Host B on subnet Teachers transmits a packet to host D on subnet Students. Which Layer 2 and Layer 3 addresses are contained in the PDUs that are transmitted from host B to the router?

Источник: тесты_exam_7, Q1. Тема: модуль 11.

1. Layer 2 destination address = 00-00-0c-94-36-ab Layer 2 source address = 00-00-0c-94-36-bb Layer 3 destination address = 172.16.20.200 Layer 3 source address = 172.16.10.200
2. Layer 2 destination address = 00-00-0c-94-36-dd Layer 2 source address = 00-00-0c-94-36-bb Layer 3 destination address = 172.16.20.200 Layer 3 source address = 172.16.10.200
3. Layer 2 destination address = 00-00-0c-94-36-cd Layer 2 source address = 00-00-0c-94-36-bb Layer 3 destination address = 172.16.20.99 Layer 3 source address = 172.16.10.200
4. Layer 2 destination address = 00-00-0c-94-36-ab Layer 2 source address = 00-00-0c-94-36-bb Layer 3 destination address = 172.16.20.200 Layer 3 source address = 172.16.100.200

**Ответ для показанного варианта (нужна схема/PT для полной проверки):** Layer 2 destination address = 00-00-0c-94-36-ab Layer 2 source address = 00-00-0c-94-36-bb Layer 3 destination address = 172.16.20.200 Layer 3 source address = 172.16.10.200.

**Объяснение:** Source/Destination IP задают конечных отправителя и получателя. Обычно по пути они сохраняются; исключение — преобразование NAT. MAC-адреса относятся к текущему каналу и меняются на маршрутизаторах.

**Проверка условия:** исходный рисунок или PT-файл не включён в прежнюю текстовую выгрузку. Конкретные адреса/порты выше сохранены из отображённого варианта; это не универсальный ответ для иной схемы.

### E762. Match each description with an appropriate IP address. A a public address 198.133.219.2 B an experimental address 240.2.6.255 C a link-local address 169.254.1.5 D a loopback address 127.0.0.1

Источник: тесты_exam_7, Q29. Тема: модуль 11.

**Ответ:** 198.133.219.2 → public; 240.2.6.255 → experimental/reserved; 169.254.1.5 → link-local; 127.0.0.1 → loopback.

**Объяснение:** Частные IPv4-диапазоны: 10/8, 172.16/12, 192.168/16. Они не маршрутизируются в публичном интернете как глобальные адреса. 169.254/16 — link-local, 127/8 — loopback, 192.0.2/24 — документация.

### E773. Refer to the exhibit. Which two network addresses can be assigned to the network containing 10 hosts? Your answers should waste the fewest addresses, not reuse addresses that are already assigned, and stay within the 10.18.10.0/24 range of addresses. (Choose two.)

Источник: тесты_exam_7, Q40. Тема: модуль 11.

1. 10.18.10.200/28
2. 10.18.10.208/28
3. 10.18.10.224/28
4. 10.18.10.200/27
5. 10.18.10.224/27
6. 10.18.10.240/27

**Ответ для показанного варианта (нужна схема/PT для полной проверки):** 10.18.10.208/28; 10.18.10.224/28.

**Объяснение:** Выберите минимальный блок с достаточным числом хостов и без пересечений: 25 хостам нужен /27 (30 пригодных), 10 хостам /28 (14). Допустимость конкретного свободного диапазона зависит от занятых сетей на схеме.

**Проверка условия:** исходный рисунок или PT-файл не включён в прежнюю текстовую выгрузку. Конкретные адреса/порты выше сохранены из отображённого варианта; это не универсальный ответ для иной схемы.

### E781. Refer to the exhibit. A network engineer has been given the network address of 192.168.99.0 and a subnet mask of 255.255.255.192 to subnet across the four networks shown. How many total host addresses are unused across all four subnets?

Источник: тесты_exam_7, Q48. Тема: модуль 11.

1. 224
2. 88
3. 158
4. 200
5. 72

**Ответ для показанного варианта (нужна схема/PT для полной проверки):** 200.

**Объяснение:** Четыре подсети /26 дают 4×62=248 пригодных хостовых адресов. Чтобы получить 200 неиспользованных, схема должна требовать суммарно 48 хостов: 248−48=200. Число используемых хостов нужно сверить со схемой.

**Проверка условия:** исходный рисунок или PT-файл не включён в прежнюю текстовую выгрузку. Конкретные адреса/порты выше сохранены из отображённого варианта; это не универсальный ответ для иной схемы.

### E789. A network administrator is adding a new LAN to a branch office. The new LAN must support 90 connected devices. What is the smallest network mask that the network administrator can use for the new network?

Источник: тесты_exam_7, Q56. Тема: модуль 11.

1. 255.255.255.128
2. 255.255.255.248
3. 255.255.255.240
4. 255.255.255.224

**Ответ:** 255.255.255.128.

**Объяснение:** Для обычной IPv4 LAN с h битами хоста: 2^h адресов, 2^h−2 пригодных хостам. /26: 64−2=62; /27: 32−2=30; /28: 16−2=14; /25: 128−2=126; /22: 1024−2=1022. /31 и /32 — отдельные случаи.


## Модуль 12: IPv6

### E137. How many binary bits exist within an IPv6 address?

Источник: модули_05, Q3. Тема: модуль 12.

1. 32
2. 48
3. 64
4. 128
5. 256

**Ответ:** 128.

**Объяснение:** IPv4 — 32 бита: четыре десятичных октета по 8 бит. IPv6 — 128 бит, обычно восемь шестнадцатеричных групп. Формат записи не меняет размер адреса.

### E139. Which two statements are correct about IPv4 and IPv6 addresses? (Choose two.)

Источник: модули_05, Q5. Тема: модуль 12.

1. IPv6 addresses are represented by hexadecimal numbers.
2. IPv4 addresses are represented by hexadecimal numbers.
3. IPv6 addresses are 32 bits in length.
4. IPv4 addresses are 32 bits in length.
5. IPv4 addresses are 128 bits in length.
6. IPv6 addresses are 64 bits in length.

**Ответ:** IPv6 addresses are represented by hexadecimal numbers.; IPv4 addresses are 32 bits in length..

**Объяснение:** IPv4 — 32 бита: четыре десятичных октета по 8 бит. IPv6 — 128 бит, обычно восемь шестнадцатеричных групп. Формат записи не меняет размер адреса.

### E296. What is the most important motivating factor for moving to IPv6?

Источник: модули_12, Q1. Тема: модуль 12.

1. Better performance with IPv6
2. IPv6 addresses that are easier to work with
3. Better security with IPv6
4. Depletion of IPv4 addresses

**Ответ:** Depletion of IPv4 addresses.

**Объяснение:** IPv4 использует 32 бита и имеет ограниченный запас адресов. IPv6 даёт 128 бит и упрощённый базовый заголовок; достаточное адресное пространство снимает необходимость NAT для экономии адресов.

### E297. True or False: 4 out of 5 RIRs no longer have enough IPv4 addresses to allocate to customers on a regular basis.

Источник: модули_12, Q2. Тема: модуль 12.

1. True
2. False

**Ответ в курсе; см. уточнение ниже:** False.

**Объяснение:** Это историческое утверждение из курса, а не надёжный показатель состояния RIR на сегодня. В показанной попытке выбран False. Для эндки важна причина перехода на IPv6 — нехватка IPv4; текущую статистику этим вопросом не проверяют.

### E298. Which of the following techniques use native IPv6 connectivity?

Источник: модули_12, Q3. Тема: модуль 12.

1. Dual stack
2. Tunneling
3. Translation
4. All of the above

**Ответ:** Dual stack.

**Объяснение:** Dual stack использует оба протокола нативно. Tunneling переносит один пакет внутри другого. Translation преобразует представление между IPv4 и IPv6.

### E299. What is the recommended prefix length for most IPv6 subnets?

Источник: модули_12, Q1. Тема: модуль 12.

1. /32
2. /48
3. /64
4. /128

**Ответ:** /64.

**Объяснение:** Обычная IPv6-подсеть — /64. GUA состоит из global routing prefix, subnet ID и interface ID. При выделении /48 до /64 остаются 16 бит subnet ID; при /32 — 32 бита. Interface ID при этом не заимствуют.

### E300. Which part of a GUA is assigned by the ISP?

Источник: модули_12, Q2. Тема: модуль 12.

1. Global routing prefix
2. Global routing prefix and subnet ID
3. Prefix
4. RIR prefix

**Ответ:** Global routing prefix.

**Объяснение:** Обычная IPv6-подсеть — /64. GUA состоит из global routing prefix, subnet ID и interface ID. При выделении /48 до /64 остаются 16 бит subnet ID; при /32 — 32 бита. Interface ID при этом не заимствуют.

### E301. Which type of IPv6 unicast address is not routable between networks?

Источник: модули_12, Q3. Тема: модуль 12.

1. Unique local address
2. GUA
3. Embedded IPv4 address
4. LLA

**Ответ:** LLA.

**Объяснение:** Link-local (FE80::/10) работает только в пределах одного канала и не пересылается маршрутизаторами. На IPv6-интерфейсе требуется LLA; глобальный адрес для локального общения не обязателен.

### E302. True or false? The Subnet ID field in an GUA must borrow bits from the interface ID.

Источник: модули_12, Q4. Тема: модуль 12.

1. True
2. False

**Ответ:** False.

**Объяснение:** Обычная IPv6-подсеть — /64. GUA состоит из global routing prefix, subnet ID и interface ID. При выделении /48 до /64 остаются 16 бит subnet ID; при /32 — 32 бита. Interface ID при этом не заимствуют.

### E303. What type of IPv6 address begins with fe80?

Источник: модули_12, Q5. Тема: модуль 12.

1. GUA
2. LLA
3. Multicast address
4. None. An IPv6 address must begin with 2001.

**Ответ:** LLA.

**Объяснение:** Link-local (FE80::/10) работает только в пределах одного канала и не пересылается маршрутизаторами. На IPv6-интерфейсе требуется LLA; глобальный адрес для локального общения не обязателен.

### E304. True or false? RA messages are sent to all IPv6 routers by hosts requesting addressing information.

Источник: модули_12, Q1. Тема: модуль 12.

1. True
2. False

**Ответ:** False.

**Объяснение:** RS запрашивает информацию у маршрутизаторов, RA сообщает префиксы/параметры сети. NS/NA разрешают адрес соседа и помогают DAD проверить уникальность IPv6-адреса. NS обычно направляется solicited-node multicast, а не broadcast.

### E305. Which dynamic addressing method for GUAs is the one where devices rely solely on the contents of the RA message for their addressing information?

Источник: модули_12, Q2. Тема: модуль 12.

1. Method 1: SLAAC
2. Method 2: SLAAC and stateless DHCPv6
3. Method 3: Stateful DHCPv6

**Ответ:** Method 1: SLAAC.

**Объяснение:** SLAAC: адрес формируется по префиксу RA. SLAAC + stateless DHCPv6: адрес из RA, дополнительные параметры с DHCPv6. Stateful DHCPv6 выдаёт адрес и ведёт учёт; default gateway всё равно узнают через RA.

### E306. Which dynamic addressing method for GUAs is the one where devices rely solely on a DHCPv6 server for their addressing information?

Источник: модули_12, Q3. Тема: модуль 12.

1. Method 1: SLAAC
2. Method 2: SLAAC and stateless DHCPv6
3. Method 3: Stateful DHCPv6

**Ответ:** Method 3: Stateful DHCPv6.

**Объяснение:** SLAAC: адрес формируется по префиксу RA. SLAAC + stateless DHCPv6: адрес из RA, дополнительные параметры с DHCPv6. Stateful DHCPv6 выдаёт адрес и ведёт учёт; default gateway всё равно узнают через RA.

### E307. Which dynamic addressing method for GUAs is the one where devices get their IPv6 configuration in a RA message and request DNS information from a DHCPv6 server?

Источник: модули_12, Q4. Тема: модуль 12.

1. Method 1: SLAAC
2. Method 2: SLAAC and stateless DHCPv6
3. Method 3: Stateful DHCPv6

**Ответ:** Method 2: SLAAC and stateless DHCPv6.

**Объяснение:** SLAAC: адрес формируется по префиксу RA. SLAAC + stateless DHCPv6: адрес из RA, дополнительные параметры с DHCPv6. Stateful DHCPv6 выдаёт адрес и ведёт учёт; default gateway всё равно узнают через RA.

### E308. What are the two methods a device can use to generate its own IPv6 interface ID?

Источник: модули_12, Q5. Тема: модуль 12.

1. SLAAC
2. Stateless DHCPv6
3. Stateful DHCPv6
4. EUI-64
5. Randomly generated

**Ответ:** EUI-64; Randomly generated.

**Объяснение:** Interface ID можно сформировать случайно либо методом modified EUI-64: из MAC вставляют FFFE посередине и инвертируют U/L-бит первого октета. Это не означает, что все современные устройства обязаны применять EUI-64.

### E309. True or False? IPv6 was designed with subnetting in mind.

Источник: модули_12, Q1. Тема: модуль 12.

1. True
2. False

**Ответ:** True.

**Объяснение:** Обычная IPv6-подсеть — /64. GUA состоит из global routing prefix, subnet ID и interface ID. При выделении /48 до /64 остаются 16 бит subnet ID; при /32 — 32 бита. Interface ID при этом не заимствуют.

### E310. Which field in an IPv6 GUA is used for subnetting?

Источник: модули_12, Q2. Тема: модуль 12.

1. Prefix
2. Network
3. Global Routing Prefix
4. Subnet ID
5. Interface ID

**Ответ:** Subnet ID.

**Объяснение:** Обычная IPv6-подсеть — /64. GUA состоит из global routing prefix, subnet ID и interface ID. При выделении /48 до /64 остаются 16 бит subnet ID; при /32 — 32 бита. Interface ID при этом не заимствуют.

### E311. Given a /48 Global Routing Prefix and a /64 prefix, what is the subnet portion of the following address: 2001:db8:cafe:1111:2222:3333:4444:5555

Источник: модули_12, Q3. Тема: модуль 12.

1. Café
2. 1111
3. 2222
4. 3333
5. 4444

**Ответ:** 1111.

**Объяснение:** Обычная IPv6-подсеть — /64. GUA состоит из global routing prefix, subnet ID и interface ID. При выделении /48 до /64 остаются 16 бит subnet ID; при /32 — 32 бита. Interface ID при этом не заимствуют.

### E312. Given a /32 Global Routing Prefix and a /64 prefix, how many bits would be allocated for the Subnet ID?

Источник: модули_12, Q4. Тема: модуль 12.

1. 8
2. 16
3. 32
4. 48
5. 64

**Ответ:** 32.

**Объяснение:** Обычная IPv6-подсеть — /64. GUA состоит из global routing prefix, subnet ID и interface ID. При выделении /48 до /64 остаются 16 бит subnet ID; при /32 — 32 бита. Interface ID при этом не заимствуют.

### E313. What is the valid most compressed format possible of the IPv6 address 2001:0DB8:0000:AB00:0000:0000:0000:1234?

Источник: модули_12, Q1. Тема: модуль 12.

1. 2001:DB8:0:AB00::1234
2. 2001:DB8:0:AB::1234
3. 2001:DB8::AB00::1234
4. 2001:DB8:0:AB:0:1234

**Ответ:** 2001:DB8:0:AB00::1234.

**Объяснение:** В каждой шестнадцатеричной группе убирают ведущие нули; одну последовательность нулевых групп заменяют ::. Два :: в одном адресе недопустимы: длина адреса стала бы неоднозначной.

### E314. What is the prefix associated with the IPv6 address 2001:DB8:D15:EA:CC44::1/64?

Источник: модули_12, Q2. Тема: модуль 12.

1. 2001::/64
2. 2001:DB8::/64
3. 2001:DB8:D15:EA::/64
4. 2001:DB8:D15:EA:CC44::/64

**Ответ:** 2001:DB8:D15:EA::/64.

**Объяснение:** При /64 первые четыре группы — сетевой префикс, последние четыре — interface ID. Для записи сети обнуляют хостовую часть. Термин subnet ID иногда неточно используют для целого /64-префикса; строго это поле между global prefix и interface ID.

### E315. What type of address is automatically assigned to an interface when IPv6 is enabled on that interface?

Источник: модули_12, Q3. Тема: модуль 12.

1. Global unicast
2. Link-local
3. Loopback
4. Unique local

**Ответ:** Link-local.

**Объяснение:** Link-local (FE80::/10) работает только в пределах одного канала и не пересылается маршрутизаторами. На IPv6-интерфейсе требуется LLA; глобальный адрес для локального общения не обязателен.

### E316. Which IPv6 network prefix is only intended for local links and can not be routed?

Источник: модули_12, Q4. Тема: модуль 12.

1. 2001::/3
2. FC00::/7
3. FE80::/10
4. FF00::/12

**Ответ:** FE80::/10.

**Объяснение:** Link-local (FE80::/10) работает только в пределах одного канала и не пересылается маршрутизаторами. На IPv6-интерфейсе требуется LLA; глобальный адрес для локального общения не обязателен.

### E317. What is the purpose of the command ping ::1 ?

Источник: модули_12, Q5. Тема: модуль 12.

1. It tests the internal configuration of an IPv6 host.
2. It tests the broadcast capability of all hosts on the subnet.
3. It tests the multicast connectivity to all hosts on the subnet.
4. It tests the reachability of the default gateway for the network.

**Ответ:** It tests the internal configuration of an IPv6 host..

**Объяснение:** 127.0.0.1 для IPv4 и ::1 для IPv6 — loopback. Ответ проверяет локальный IP-стек; он не доказывает исправность кабеля, шлюза или интернета.

### E318. What is the interface ID of the IPv6 address 2001:DB8::1000:A9CD:47FF:FE57:FE94/64?

Источник: модули_12, Q6. Тема: модуль 12.

1. FE94
2. FE57:FE94
3. 47FF:FE57:FE94
4. A9CD:47FF:FE57:FE94
5. 1000:A9CD:47FF:FE57:FE94

**Ответ:** A9CD:47FF:FE57:FE94.

**Объяснение:** При /64 первые четыре группы — сетевой префикс, последние четыре — interface ID. Для записи сети обнуляют хостовую часть. Термин subnet ID иногда неточно используют для целого /64-префикса; строго это поле между global prefix и interface ID.

### E319. What is the network address for the IPv6 address 2001:DB8:AA04:B5::1/64?

Источник: модули_12, Q7. Тема: модуль 12.

1. 2001::/64
2. 2001:DB8::/64
3. 2001:DB8:AA04::/64
4. 2001:DB8:AA04:B5::/64

**Ответ:** 2001:DB8:AA04:B5::/64.

**Объяснение:** При /64 первые четыре группы — сетевой префикс, последние четыре — interface ID. Для записи сети обнуляют хостовую часть. Термин subnet ID иногда неточно используют для целого /64-префикса; строго это поле между global prefix и interface ID.

### E320. Which address type is not supported in IPv6?

Источник: модули_12, Q8. Тема: модуль 12.

1. Private
2. Multicast
3. Unicast
4. Broadcast

**Ответ:** Broadcast.

**Объяснение:** IPv6 не имеет broadcast. Unicast адресует один интерфейс; multicast — группу; anycast использует общий адрес на нескольких интерфейсах с доставкой ближайшему по маршрутизации. FF02::1 — все узлы канала, FF02::2 — маршрутизаторы, ::1 — loopback.

### E321. What is indicated by a successful ping to the ::1 IPv6 address?

Источник: модули_12, Q9. Тема: модуль 12.

1. The host is cabled properly.
2. The default gateway address is correctly configured.
3. All hosts on the local link are available.
4. The link-local address is correctly configured.
5. IP is properly installed on the host.

**Ответ:** IP is properly installed on the host..

**Объяснение:** 127.0.0.1 для IPv4 и ::1 для IPv6 — loopback. Ответ проверяет локальный IP-стек; он не доказывает исправность кабеля, шлюза или интернета.

### E322. What is the most compressed representation of the IPv6 address 2001:0db8:0000:abcd:0000:0000:0000:0001?

Источник: модули_12, Q10. Тема: модуль 12.

1. 2001:0db8:abcd::1
2. 2001:db8:0:abcd::1
3. 2001:0db8:abcd::0001
4. 2001:0db8:0000:abcd::1
5. 2001:db8::abcd:0:1

**Ответ:** 2001:db8:0:abcd::1.

**Объяснение:** В каждой шестнадцатеричной группе убирают ведущие нули; одну последовательность нулевых групп заменяют ::. Два :: в одном адресе недопустимы: длина адреса стала бы неоднозначной.

### E323. What is the minimum configuration for a router interface that is enabled for IPv6?

Источник: модули_12, Q11. Тема: модуль 12.

1. To have a link-local IPv6 address
2. To have both an IPv4 and an IPv6 address
3. To have a self-generated loopback address
4. To have both a link-local and a global unicast IPv6 address

**Ответ:** To have a link-local IPv6 address.

**Объяснение:** Link-local (FE80::/10) работает только в пределах одного канала и не пересылается маршрутизаторами. На IPv6-интерфейсе требуется LLA; глобальный адрес для локального общения не обязателен.

### E324. At a minimum, which address is required on IPv6-enabled interfaces?

Источник: модули_12, Q12. Тема: модуль 12.

1. Link-local
2. Unique local
3. Site local
4. Global unicast

**Ответ:** Link-local.

**Объяснение:** Link-local (FE80::/10) работает только в пределах одного канала и не пересылается маршрутизаторами. На IPv6-интерфейсе требуется LLA; глобальный адрес для локального общения не обязателен.

### E325. What are three parts of an IPv6 global unicast address? (Choose three.)

Источник: модули_12, Q13. Тема: модуль 12.

1. An interface ID that is used to identify the local network for a particular host
2. A global routing prefix that is used to identify the network portion of the address that has been provided by an ISP
3. A subnet ID that is used to identify networks inside of the local enterprise site
4. A global routing prefix that is used to identify the portion of the network address provided by a local administrator
5. An interface ID that is used to identify the local host on the network

**Ответ:** A global routing prefix that is used to identify the network portion of the address that has been provided by an ISP; A subnet ID that is used to identify networks inside of the local enterprise site; An interface ID that is used to identify the local host on the network.

**Объяснение:** Обычная IPv6-подсеть — /64. GUA состоит из global routing prefix, subnet ID и interface ID. При выделении /48 до /64 остаются 16 бит subnet ID; при /32 — 32 бита. Interface ID при этом не заимствуют.

### E326. Your organization is issued the IPv6 prefix of 2001:db8:130f::/48 by your service provider. With this prefix, how many bits are available for your organization to create /64 subnetworks if interface ID bits are not borrowed?

Источник: модули_12, Q14. Тема: модуль 12.

1. 8
2. 16
3. 80
4. 128

**Ответ:** 16.

**Объяснение:** Обычная IPv6-подсеть — /64. GUA состоит из global routing prefix, subnet ID и interface ID. При выделении /48 до /64 остаются 16 бит subnet ID; при /32 — 32 бита. Interface ID при этом не заимствуют.

### E327. Which type of IPv6 address is not routable and used only for communication on a single subnet?

Источник: модули_12, Q15. Тема: модуль 12.

1. Global unicast address
2. Link-local address
3. Loopback address
4. Unique local address
5. Unspecified address

**Ответ:** Link-local address.

**Объяснение:** Link-local (FE80::/10) работает только в пределах одного канала и не пересылается маршрутизаторами. На IPv6-интерфейсе требуется LLA; глобальный адрес для локального общения не обязателен.

### E490. What is the prefix for the host address 2001:DB8:BC15:A:12AB::1/64?

Источник: тесты_IP_Addressing, Q12. Тема: модуль 12.

1. 2001:DB8:BC15
2. 2001:DB8:BC15:A
3. 2001:DB8:BC15:A:1
4. 2001:DB8:BC15:A:12

**Ответ:** 2001:DB8:BC15:A.

**Объяснение:** При /64 первые четыре группы — сетевой префикс, последние четыре — interface ID. Для записи сети обнуляют хостовую часть. Термин subnet ID иногда неточно используют для целого /64-префикса; строго это поле между global prefix и interface ID.

### E492. Given IPv6 address prefix 2001:db8::/48, what will be the last subnet that is created if the subnet prefix is changed to /52?

Источник: тесты_IP_Addressing, Q14. Тема: модуль 12.

1. 2001:db8:0:f00::/52
2. 2001:db8:0:8000::/52
3. 2001:db8:0:f::/52
4. 2001:db8:0:f000::/52

**Ответ:** 2001:db8:0:f000::/52.

**Объяснение:** От /48 к /52 добавляются 4 бита subnet ID: 16 подсетей. Максимальное значение этих четырёх бит — F, поэтому последняя сеть имеет четвёртую группу F000: 2001:db8:0:f000::/52.

### E493. Which address is a valid IPv6 link-local unicast address?

Источник: тесты_IP_Addressing, Q15. Тема: модуль 12.

1. FEC8:1::FFFF
2. FD80::1:1234
3. FE80::1:4545:6578:ABC1
4. FE0A::100:7788:998F
5. FC90:5678:4251:FFFF

**Ответ:** FE80::1:4545:6578:ABC1.

**Объяснение:** Link-local (FE80::/10) работает только в пределах одного канала и не пересылается маршрутизаторами. На IPv6-интерфейсе требуется LLA; глобальный адрес для локального общения не обязателен.

### E494. Which type of IPv6 address refers to any unicast address that is assigned to multiple hosts?

Источник: тесты_IP_Addressing, Q16. Тема: модуль 12.

1. unique local
2. global unicast
3. link-local
4. anycast

**Ответ:** anycast.

**Объяснение:** IPv6 не имеет broadcast. Unicast адресует один интерфейс; multicast — группу; anycast использует общий адрес на нескольких интерфейсах с доставкой ближайшему по маршрутизации. FF02::1 — все узлы канала, FF02::2 — маршрутизаторы, ::1 — loopback.

### E495. What are two types of IPv6 unicast addresses? (Choose two.)

Источник: тесты_IP_Addressing, Q17. Тема: модуль 12.

1. multicast
2. loopback
3. link-local
4. anycast
5. broadcast

**Ответ:** loopback; link-local.

**Объяснение:** IPv6 не имеет broadcast. Unicast адресует один интерфейс; multicast — группу; anycast использует общий адрес на нескольких интерфейсах с доставкой ближайшему по маршрутизации. FF02::1 — все узлы канала, FF02::2 — маршрутизаторы, ::1 — loopback.

### E496. Which IPv6 prefix is reserved for communication between devices on the same link?

Источник: тесты_IP_Addressing, Q18. Тема: модуль 12.

1. FC00::/7
2. 2001::/32
3. FE80::/10
4. FDFF::/7

**Ответ:** FE80::/10.

**Объяснение:** Link-local (FE80::/10) работает только в пределах одного канала и не пересылается маршрутизаторами. На IPv6-интерфейсе требуется LLA; глобальный адрес для локального общения не обязателен.

### E497. Which service provides dynamic global IPv6 addressing to end devices without using a server that keeps a record of available IPv6 addresses?

Источник: тесты_IP_Addressing, Q19. Тема: модуль 12.

1. stateful DHCPv6
2. SLAAC
3. static IPv6 addressing
4. stateless DHCPv6

**Ответ:** SLAAC.

**Объяснение:** SLAAC: адрес формируется по префиксу RA. SLAAC + stateless DHCPv6: адрес из RA, дополнительные параметры с DHCPv6. Stateful DHCPv6 выдаёт адрес и ведёт учёт; default gateway всё равно узнают через RA.

### E498. Refer to the exhibit. A company is deploying an IPv6 addressing scheme for its network. The company design document indicates that the subnet portion of the IPv6 addresses is used for the new hierarchical network design, with the site subsection to represent multiple geographical sites of the company, the sub-site section to represent multiple campuses at each site, and the subnet section to indicate each network segment separated by routers. With such a scheme, what is the maximum number of subnets achieved per sub-site?

Источник: тесты_IP_Addressing, Q20. Тема: модуль 12.

1. 0
2. 4
3. 16
4. 256

**Ответ для показанного варианта (нужна схема/PT для полной проверки):** 16.

**Объяснение:** Если под номер подсети внутри sub-site выделена одна шестнадцатеричная цифра, это 4 бита и 2^4=16 значений. Распределение полей надо подтвердить по схеме задания.

**Проверка условия:** исходный рисунок или PT-файл не включён в прежнюю текстовую выгрузку. Конкретные адреса/порты выше сохранены из отображённого варианта; это не универсальный ответ для иной схемы.

### E499. An IPv6 enabled device sends a data packet with the destination address of FF02::1. What is the target of this packet?

Источник: тесты_IP_Addressing, Q21. Тема: модуль 12.

1. the one IPv6 device on the link that has been uniquely configured with this address
2. all IPv6 enabled devices on the local link or network
3. only IPv6 DHCP servers
4. only IPv6 configured routers

**Ответ:** all IPv6 enabled devices on the local link or network.

**Объяснение:** IPv6 не имеет broadcast. Unicast адресует один интерфейс; multicast — группу; anycast использует общий адрес на нескольких интерфейсах с доставкой ближайшему по маршрутизации. FF02::1 — все узлы канала, FF02::2 — маршрутизаторы, ::1 — loopback.

### E500. Three methods allow IPv6 and IPv4 to co-exist. Match each method with its description. A The IPv4 packets and IPv6 packets coexist in the same network. dual-stack done B IPv6 packets are converted into IPv4 packets, and vice versa. translation C The IPv6 packet is transported inside an IPv4 packet. tunneling

Источник: тесты_IP_Addressing, Q22. Тема: модуль 12.

**Ответ:** dual-stack: IPv4 и IPv6 работают параллельно; translation: преобразование IPv4 ↔ IPv6; tunneling: пакет IPv6 внутри IPv4.

**Объяснение:** Dual stack использует оба протокола нативно. Tunneling переносит один пакет внутри другого. Translation преобразует представление между IPv4 и IPv6.

### E501. Match the IPv6 address with the IPv6 address type. A FF02::1:FFAE:F85F solicited node multicast done B ::1 loopback C FF02::1 all node multicast D 2001:DB8::BAF:3F57:FE94 global unicast

Источник: тесты_IP_Addressing, Q23. Тема: модуль 12.

**Ответ:** FF02::1:FFAE:F85F → solicited-node multicast; ::1 → loopback; FF02::1 → all-nodes multicast; 2001:DB8::BAF:3F57:FE94 → global unicast.

**Объяснение:** IPv6 не имеет broadcast. Unicast адресует один интерфейс; multicast — группу; anycast использует общий адрес на нескольких интерфейсах с доставкой ближайшему по маршрутизации. FF02::1 — все узлы канала, FF02::2 — маршрутизаторы, ::1 — loopback.

### E508. Open the PT Activity. Perform the tasks in the activity instructions and then answer the question. What are the three IPv6 addresses displayed when the route from PC1 to PC2 is traced? (Choose three.)

Источник: тесты_IP_Addressing, Q30. Тема: модуль 12.

1. 2001:DB8:1:1::1
2. 2001:DB8:1:1::A
3. 2001:DB8:1:2::2
4. 2001:DB8:1:2::1
5. 2001:DB8:1:3::1
6. 2001:DB8:1:3::2
7. 2001:DB8:1:4::1

**Ответ для показанного варианта (нужна схема/PT для полной проверки):** 2001:DB8:1:1::1; 2001:DB8:1:2::1; 2001:DB8:1:3::2.

**Объяснение:** traceroute показывает IPv6-адреса отвечающих интерфейсов промежуточных маршрутизаторов и конечного узла. Конкретные адреса относятся к данному файлу Packet Tracer и не выводятся только из общего описания.

**Проверка условия:** исходный рисунок или PT-файл не включён в прежнюю текстовую выгрузку. Конкретные адреса/порты выше сохранены из отображённого варианта; это не универсальный ответ для иной схемы.

### E510. Which is the compressed format of the IPv6 address 2001:0db8:0000:0000:0000:a0b0:0008:0001?

Источник: тесты_IP_Addressing, Q32. Тема: модуль 12.

1. 2001:db8::a0b0:8:1
2. 2001:db8::ab8:1:0:1000
3. 2001:db80:0:1::80:1
4. 2001:db8:0:1::8:1

**Ответ:** 2001:db8::a0b0:8:1.

**Объяснение:** В каждой шестнадцатеричной группе убирают ведущие нули; одну последовательность нулевых групп заменяют ::. Два :: в одном адресе недопустимы: длина адреса стала бы неоднозначной.

### E579. What is one advantage that the IPv6 simplified header offers over IPv4?

Источник: тесты_exam_2, Q1. Тема: модуль 12.

1. smaller-sized header
2. little requirement for processing checksums
3. smaller-sized source and destination IP addresses
4. efficient packet handling

**Ответ:** efficient packet handling.

**Объяснение:** IPv4 использует 32 бита и имеет ограниченный запас адресов. IPv6 даёт 128 бит и упрощённый базовый заголовок; достаточное адресное пространство снимает необходимость NAT для экономии адресов.

### E583. Why is NAT not needed in IPv6?

Источник: тесты_exam_2, Q5; тесты_exam_6, Q19. Тема: модуль 12.

1. Because IPv6 has integrated security, there is no need to hide the IPv6 addresses of internal networks.
2. Any host or user can get a public IPv6 network address because the number of available IPv6 addresses is extremely large.
3. The problems that are induced by NAT applications are solved because the IPv6 header improves packet handling by intermediate routers.
4. The end-to-end connectivity problems that are caused by NAT are solved because the number of routes increases with the number of nodes that are connected to the Internet.

**Ответ:** Any host or user can get a public IPv6 network address because the number of available IPv6 addresses is extremely large..

**Объяснение:** IPv4 использует 32 бита и имеет ограниченный запас адресов. IPv6 даёт 128 бит и упрощённый базовый заголовок; достаточное адресное пространство снимает необходимость NAT для экономии адресов.

### E711. Which is the compressed format of the IPv6 address fe80:0000:0000:0000:0220:0b3f:f0e0:0029?

Источник: тесты_exam_6, Q33. Тема: модуль 12.

1. fe80::220:b3f:f0e0:29
2. fe80:9ea:0:2200::fe0:290
3. fe80:9ea0::2020:0:bf:e0:9290
4. fe80:9ea0::2020::bf:e0:9290

**Ответ:** fe80::220:b3f:f0e0:29.

**Объяснение:** В каждой шестнадцатеричной группе убирают ведущие нули; одну последовательность нулевых групп заменяют ::. Два :: в одном адресе недопустимы: длина адреса стала бы неоднозначной.

### E712. What type of IPv6 address is represented by ::1/128?

Источник: тесты_exam_6, Q34. Тема: модуль 12.

1. loopback
2. unspecified
3. global unicast
4. EUI-64 generated link-local

**Ответ:** loopback.

**Объяснение:** 127.0.0.1 для IPv4 и ::1 для IPv6 — loopback. Ответ проверяет локальный IP-стек; он не доказывает исправность кабеля, шлюза или интернета.

### E713. Refer to the exhibit. A user issues the command netstat –r on a workstation. Which IPv6 address is one of the link-local addresses of the workstation?

Источник: тесты_exam_6, Q35. Тема: модуль 12.

1. ::1/128
2. fe80::30d0:115:3f57:fe4c/128
3. fe80::/64
4. 2001:0:9d38:6ab8:30d0:115:3f57:fe4c/128

**Ответ для показанного варианта (нужна схема/PT для полной проверки):** fe80::30d0:115:3f57:fe4c/128.

**Объяснение:** Link-local (FE80::/10) работает только в пределах одного канала и не пересылается маршрутизаторами. На IPv6-интерфейсе требуется LLA; глобальный адрес для локального общения не обязателен.

**Проверка условия:** исходный рисунок или PT-файл не включён в прежнюю текстовую выгрузку. Конкретные адреса/порты выше сохранены из отображённого варианта; это не универсальный ответ для иной схемы.

### E729. Only employees connected to IPv6 interfaces are having difficulty connecting to remote networks. The analyst wants to verify that IPv6 routing has been enabled. What is the best command to use to accomplish the task?

Источник: тесты_exam_6, Q51. Тема: модуль 12.

1. show running-config
2. show interfaces
3. copy running-config startup-config
4. show ip nat translations

**Ответ:** show running-config.

**Объяснение:** ipv6 unicast-routing включает пересылку IPv6 на маршрутизаторе; соответствующие интерфейсы могут отправлять RA. Проверить наличие команды можно в show running-config. Одного IPv6-адреса на интерфейсе для маршрутизации недостаточно.

### E750. Match the description to the IPv6 addressing component. A This part of the address is used by an organization to identify subnets. subnet ID B This part of the address is the equivalent to the host portion of an IPv4 address. interface ID C This network portion of the address is assigned by the provider. global routing prefix

Источник: тесты_exam_7, Q17. Тема: модуль 12.

**Ответ:** subnet ID → подсеть организации; interface ID → интерфейс хоста; global routing prefix → префикс провайдера.

**Объяснение:** Обычная IPv6-подсеть — /64. GUA состоит из global routing prefix, subnet ID и interface ID. При выделении /48 до /64 остаются 16 бит subnet ID; при /32 — 32 бита. Interface ID при этом не заимствуют.

### E767. An IPv6 enabled device sends a data packet with the destination address of FF02::2. What is the target of this packet?

Источник: тесты_exam_7, Q34. Тема: модуль 12.

1. all IPv6 enabled devices across the network
2. all IPv6 enabled devices on the local link
3. all IPv6 DHCP servers
4. all IPv6 configured routers on the local link

**Ответ:** all IPv6 configured routers on the local link.

**Объяснение:** IPv6 не имеет broadcast. Unicast адресует один интерфейс; multicast — группу; anycast использует общий адрес на нескольких интерфейсах с доставкой ближайшему по маршрутизации. FF02::1 — все узлы канала, FF02::2 — маршрутизаторы, ::1 — loopback.

### E782. What is the subnet ID associated with the IPv6 address 2001:DA48:FC5:A4:3D1B::1/64?

Источник: тесты_exam_7, Q49. Тема: модуль 12.

1. 2001::/64
2. 2001:DA48::/64
3. 2001:DA48:FC5:A4::/64
4. 2001:DA48:FC5::A4:/64

**Ответ:** 2001:DA48:FC5:A4::/64.

**Объяснение:** При /64 первые четыре группы — сетевой префикс, последние четыре — interface ID. Для записи сети обнуляют хостовую часть. Термин subnet ID иногда неточно используют для целого /64-префикса; строго это поле между global prefix и interface ID.


## Модуль 13: ICMP и диагностика

### E073. Which of the following are protocols that provide feedback from the destination host to the source host regarding errors in packet delivery? (Choose two.)

Источник: модули_03, Q4. Тема: модуль 13.

1. IPv4
2. TCP
3. ICMPv4
4. IPv6
5. UDP
6. ICMPv6

**Ответ:** ICMPv4; ICMPv6.

**Объяснение:** ICMP передаёт диагностические сообщения и ошибки, например Destination Unreachable и Time Exceeded. Он не исправляет потерю пакета и не гарантирует доставку исходных данных.

### E098. Which two protocols function at the internet layer? (Choose two.)

Источник: модули_03, Q9. Тема: модуль 13.

1. POP
2. BOOTP
3. ICMP
4. IP
5. PPP

**Ответ:** ICMP; IP.

**Объяснение:** Маршрутизатор ищет сеть назначения в таблице маршрутизации, предпочитая самый длинный совпавший префикс. show ip route показывает таблицу IOS; O означает OSPF, S — static. Default route используется при отсутствии более специфичного маршрута. Windows: route print или netstat -r.

### E328. Which two types of ICMP messages are common to both ICMPv4 and ICMPv6? (Choose two.)

Источник: модули_13, Q1. Тема: модуль 13.

1. Destination or Service Unreachable
2. Hostname resolution
3. IP configuration
4. Source Unreachable
5. Time exceeded

**Ответ:** Destination or Service Unreachable; Time exceeded.

**Объяснение:** ICMP передаёт диагностические сообщения и ошибки, например Destination Unreachable и Time Exceeded. Он не исправляет потерю пакета и не гарантирует доставку исходных данных.

### E329. Which type of ICMPv6 message would a host send to acquire an IPv6 configuration when booting up?

Источник: модули_13, Q2. Тема: модуль 13.

1. Neighbor Advertisement (NA) message
2. Neighbor Solicitation (NS) message
3. Router Advertisement (RA) message
4. Router Solicitation (RS) message

**Ответ:** Router Solicitation (RS) message.

**Объяснение:** RS запрашивает информацию у маршрутизаторов, RA сообщает префиксы/параметры сети. NS/NA разрешают адрес соседа и помогают DAD проверить уникальность IPv6-адреса. NS обычно направляется solicited-node multicast, а не broadcast.

### E330. A technician is troubleshooting a network where it is suspected that a defective node in the network path is causing packets to be dropped. The technician only has the IP address of the end point device and does not have any details of the intermediate devices. What command can the technician use to identify the faulty node?

Источник: модули_13, Q1. Тема: модуль 13.

1. tracert
2. ping
3. ipconfig /flushdns
4. ipconfig /displaydns

**Ответ:** tracert.

**Объяснение:** traceroute/tracert последовательно увеличивает TTL/Hop Limit и получает ответы от промежуточных маршрутизаторов. Time Exceeded показывает очередной hop. Молчание hop может означать фильтрацию ICMP, а не обязательно поломку.

### E331. A user who is unable to connect to the file server contacts the help desk. The helpdesk technician asks the user to ping the IP address of the default gateway that is configured on the workstation. What is the purpose for this ping command?

Источник: модули_13, Q2. Тема: модуль 13.

1. To obtain a dynamic IP address from the server
2. To request that gateway forward the connection request to the file server
3. To test that the host has the capability to reach hosts on other networks
4. To resolve the domain name of the file server to its IP address

**Ответ в курсе; см. уточнение ниже:** Достижимость интерфейса default gateway; доступ к удалённым сетям ещё не доказан.

**Объяснение:** В отображённой попытке: To test that the host has the capability to reach hosts on other networks. Выбранный в курсе ответ связывает ping шлюза с выходом в другие сети. Строго ответ шлюза подтверждает лишь достижимость его интерфейса; дальнейшая маршрутизация и интернет этим не проверены.

### E332. What is a function of the tracert command that differs from the ping command when they are used on a workstation?

Источник: модули_13, Q3. Тема: модуль 13.

1. The tracert command reaches the destination faster.
2. The tracert command shows the information of routers in the path.
3. The tracert command sends one ICMP message to each hop in the path.
4. The tracert command is used to test the connectivity between two devices.

**Ответ:** The tracert command shows the information of routers in the path..

**Объяснение:** traceroute/tracert последовательно увеличивает TTL/Hop Limit и получает ответы от промежуточных маршрутизаторов. Time Exceeded показывает очередной hop. Молчание hop может означать фильтрацию ICMP, а не обязательно поломку.

### E333. Which ICMP message is used by the traceroute utility during the process of finding the path between two end hosts?

Источник: модули_13, Q4. Тема: модуль 13.

1. Redirect
2. Ping
3. Time exceeded
4. Destination unreachable

**Ответ:** Time exceeded.

**Объяснение:** traceroute/tracert последовательно увеличивает TTL/Hop Limit и получает ответы от промежуточных маршрутизаторов. Time Exceeded показывает очередной hop. Молчание hop может означать фильтрацию ICMP, а не обязательно поломку.

### E334. Which utility uses the Internet Control Messaging Protocol (ICMP)?

Источник: модули_13, Q5. Тема: модуль 13.

1. RIP
2. DNS
3. Ping
4. NTP

**Ответ:** Ping.

**Объяснение:** ping отправляет Echo Request и ждёт Echo Reply: проверяет достижимость и RTT. В IOS ! — ответ, . — таймаут, U — unreachable. Отсутствие ответа не локализует неисправность само по себе; ICMP мог быть запрещён.

### E335. Which protocol is used by IPv4 and IPv6 to provide error messaging?

Источник: модули_13, Q6. Тема: модуль 13.

1. ICMP
2. NDP
3. ARP
4. DHCP

**Ответ:** ICMP.

**Объяснение:** ICMP передаёт диагностические сообщения и ошибки, например Destination Unreachable и Time Exceeded. Он не исправляет потерю пакета и не гарантирует доставку исходных данных.

### E336. A network administrator is testing network connectivity by issuing the ping command on a router. Which symbol will be displayed to indicate that a time expired during the wait for an ICMP echo reply message?

Источник: модули_13, Q7. Тема: модуль 13.

1. !
2. .
3. U
4. $

**Ответ:** ..

**Объяснение:** ping отправляет Echo Request и ждёт Echo Reply: проверяет достижимость и RTT. В IOS ! — ответ, . — таймаут, U — unreachable. Отсутствие ответа не локализует неисправность само по себе; ICMP мог быть запрещён.

### E337. Which two things can be determined by using the ping command? (Choose two.)

Источник: модули_13, Q8. Тема: модуль 13.

1. The number of routers between the source and destination device
2. The IP address of the router nearest the destination device
3. The average time it takes a packet to reach the destination and for the response to return to the source
4. The destination device is reachable through the network
5. The average time it takes each router in the path between source and destination to respond

**Ответ:** The average time it takes a packet to reach the destination and for the response to return to the source; The destination device is reachable through the network.

**Объяснение:** ping отправляет Echo Request и ждёт Echo Reply: проверяет достижимость и RTT. В IOS ! — ответ, . — таймаут, U — unreachable. Отсутствие ответа не локализует неисправность само по себе; ICMP мог быть запрещён.

### E338. A user calls to report that a PC cannot access the internet. The network technician asks the user to issue the command ping 127.0.0.1 in a command prompt window. The user reports that the result is four positive replies. What conclusion can be drawn based on this connectivity test?

Источник: модули_13, Q9. Тема: модуль 13.

1. The PC can access the network. The problem exists beyond the local network.
2. The IP address obtained from the DHCP server is correct.
3. The PC can access the Internet. However, the web browser may not work.
4. The TCP/IP implementation is functional.

**Ответ:** The TCP/IP implementation is functional..

**Объяснение:** 127.0.0.1 для IPv4 и ::1 для IPv6 — loopback. Ответ проверяет локальный IP-стек; он не доказывает исправность кабеля, шлюза или интернета.

### E339. Which command can be used to test connectivity between two devices using echo request and echo reply messages?

Источник: модули_13, Q10. Тема: модуль 13.

1. netstat
2. ipconfig
3. ICMP
4. ping

**Ответ:** ping.

**Объяснение:** ping отправляет Echo Request и ждёт Echo Reply: проверяет достижимость и RTT. В IOS ! — ответ, . — таймаут, U — unreachable. Отсутствие ответа не локализует неисправность само по себе; ICMP мог быть запрещён.

### E340. What field content is used by ICMPv6 to determine that a packet has expired?

Источник: модули_13, Q11. Тема: модуль 13.

1. TTL field
2. CRC field
3. Hop Limit field
4. Time Exceeded field

**Ответ:** Hop Limit field.

**Объяснение:** IPv4 TTL и IPv6 Hop Limit уменьшаются на каждом маршрутизаторе. При достижении нуля пакет отбрасывается; это ограничивает петли и позволяет работать traceroute.

### E341. Which protocol provides feedback from the destination host to the source host about errors in packet delivery?

Источник: модули_13, Q12. Тема: модуль 13.

1. ARP
2. BOOTP
3. DNS
4. ICMP

**Ответ:** ICMP.

**Объяснение:** ICMP передаёт диагностические сообщения и ошибки, например Destination Unreachable и Time Exceeded. Он не исправляет потерю пакета и не гарантирует доставку исходных данных.

### E342. A network administrator can successfully ping the server at , but cannot ping the company web server located at an ISP in another city. Which tool or command would help identify the specific router where the packet was lost or delayed?

Источник: модули_13, Q13. Тема: модуль 13.

1. ipconfig
2. netstat
3. telnet
4. traceroute

**Ответ:** traceroute.

**Объяснение:** traceroute/tracert последовательно увеличивает TTL/Hop Limit и получает ответы от промежуточных маршрутизаторов. Time Exceeded показывает очередной hop. Молчание hop может означать фильтрацию ICMP, а не обязательно поломку.

### E343. What message is sent by a host to check the uniqueness of an IPv6 address before using that address?

Источник: модули_13, Q14. Тема: модуль 13.

1. Neighbor solicitation
2. ARP request
3. Echo request
4. Router solicitation

**Ответ:** Neighbor solicitation.

**Объяснение:** RS запрашивает информацию у маршрутизаторов, RA сообщает префиксы/параметры сети. NS/NA разрешают адрес соседа и помогают DAD проверить уникальность IPv6-адреса. NS обычно направляется solicited-node multicast, а не broadcast.

### E467. A network technician is investigating network connectivity from a PC to a remote host with the address 10.1.1.5. Which command, when issued on a Windows PC, will display the path to the remote host?

Источник: модули_17, Q4. Тема: модуль 13.

1. trace 10.1.1.5
2. traceroute 10.1.1.5
3. tracert 10.1.1.5
4. ping 10.1.1.5

**Ответ:** tracert 10.1.1.5.

**Объяснение:** traceroute/tracert последовательно увеличивает TTL/Hop Limit и получает ответы от промежуточных маршрутизаторов. Time Exceeded показывает очередной hop. Молчание hop может означать фильтрацию ICMP, а не обязательно поломку.

### E468. A user is unable to reach the website when typing http://www.cisco.com in a web browser, but can reach the same site by typing http://72.163.4.161 . What is the issue?

Источник: модули_17, Q5. Тема: модуль 13.

1. Default gateway
2. DHCP
3. DNS
4. TCP/IP protocol stack

**Ответ:** DNS.

**Объяснение:** DNS сопоставляет имена и записи: A→IPv4, AAAA→IPv6, NS→авторитетный сервер, MX→почтовый сервер. nslookup опрашивает DNS. Запрос вне своей зоны можно переслать/разрешить рекурсивно. DNS использует и UDP, и TCP; TCP применяется не только между серверами.

### E502. What is the purpose of ICMP messages?

Источник: тесты_IP_Addressing, Q24. Тема: модуль 13.

1. to inform routers about network topology changes
2. to ensure the delivery of an IP packet
3. to provide feedback of IP packet transmissions
4. to monitor the process of a domain name to IP address resolution

**Ответ:** to provide feedback of IP packet transmissions.

**Объяснение:** ICMP передаёт диагностические сообщения и ошибки, например Destination Unreachable и Time Exceeded. Он не исправляет потерю пакета и не гарантирует доставку исходных данных.

### E503. A user executes a traceroute over IPv6. At what point would a router in the path to the destination device drop the packet?

Источник: тесты_IP_Addressing, Q25. Тема: модуль 13.

1. when the value of the Hop Limit field reaches 255
2. when the value of the Hop Limit field reaches zero
3. when the router receives an ICMP time exceeded message
4. when the target host responds with an ICMP echo reply message

**Ответ:** when the value of the Hop Limit field reaches zero.

**Объяснение:** IPv4 TTL и IPv6 Hop Limit уменьшаются на каждом маршрутизаторе. При достижении нуля пакет отбрасывается; это ограничивает петли и позволяет работать traceroute.

### E504. Refer to the exhibit. An administrator is trying to troubleshoot connectivity between PC1 and PC2 and uses the tracert command from PC1 to do it. Based on the displayed output, where should the administrator begin troubleshooting?

Источник: тесты_IP_Addressing, Q26. Тема: модуль 13.

1. PC2
2. R1
3. SW2
4. R2
5. SW1

**Ответ для показанного варианта (нужна схема/PT для полной проверки):** R1.

**Объяснение:** traceroute/tracert последовательно увеличивает TTL/Hop Limit и получает ответы от промежуточных маршрутизаторов. Time Exceeded показывает очередной hop. Молчание hop может означать фильтрацию ICMP, а не обязательно поломку.

**Проверка условия:** исходный рисунок или PT-файл не включён в прежнюю текстовую выгрузку. Конкретные адреса/порты выше сохранены из отображённого варианта; это не универсальный ответ для иной схемы.

### E511. A user issues a ping 10.10.14.67 command and receives a response that includes a code of 0. What does this code represent?

Источник: тесты_IP_Addressing, Q33. Тема: модуль 13.

1. network unreachable
2. protocol unreachable
3. port unreachable
4. host unreachable

**Ответ в курсе; см. уточнение ниже:** network unreachable.

**Объяснение:** Code 0 означает network unreachable только в контексте ICMPv4 Destination Unreachable (Type 3). Один лишь «code 0» без типа неоднозначен: например Echo Reply имеет Type 0/Code 0. Вопрос курса опускает существенный контекст.

### E655. Refer to the exhibit. Host H3 is having trouble communicating with host H1. The network administrator suspects a problem exists with the H3 workstation and wants to prove that there is no problem with the R2 configuration. What tool could the network administrator use on router R2 to prove that communication exists to host H1 from the interface on R2, which is the interface that H3 uses when communicating with remote networks?

Источник: тесты_exam_5, Q12. Тема: модуль 13.

1. traceroute
2. show cdp neighbors
3. telnet
4. an extended ping

**Ответ для показанного варианта (нужна схема/PT для полной проверки):** an extended ping.

**Объяснение:** ping отправляет Echo Request и ждёт Echo Reply: проверяет достижимость и RTT. В IOS ! — ответ, . — таймаут, U — unreachable. Отсутствие ответа не локализует неисправность само по себе; ICMP мог быть запрещён.

**Проверка условия:** исходный рисунок или PT-файл не включён в прежнюю текстовую выгрузку. Конкретные адреса/порты выше сохранены из отображённого варианта; это не универсальный ответ для иной схемы.

### E656. Why would a network administrator use the tracert utility?

Источник: тесты_exam_5, Q13. Тема: модуль 13.

1. to determine the active TCP connections on a PC
2. to check information about a DNS name in the DNS server
3. to identify where a packet was lost or delayed on a network
4. to display the IP address, default gateway, and DNS server address for a PC

**Ответ:** to identify where a packet was lost or delayed on a network.

**Объяснение:** traceroute/tracert последовательно увеличивает TTL/Hop Limit и получает ответы от промежуточных маршрутизаторов. Time Exceeded показывает очередной hop. Молчание hop может означать фильтрацию ICMP, а не обязательно поломку.

### E657. Which method is used to send a ping message specifying the source address for the ping?

Источник: тесты_exam_5, Q14. Тема: модуль 13.

1. Issue the ping command from within interface configuration mode.
2. Issue the ping command without specifying a destination IP address.
3. Issue the ping command without extended commands.
4. Issue the ping command after shutting down un-needed interfaces.

**Ответ:** Issue the ping command without specifying a destination IP address..

**Объяснение:** ping отправляет Echo Request и ждёт Echo Reply: проверяет достижимость и RTT. В IOS ! — ответ, . — таймаут, U — unreachable. Отсутствие ответа не локализует неисправность само по себе; ICMP мог быть запрещён.

### E664. A network engineer is analyzing reports from a recently performed network baseline. Which situation would depict a possible latency issue?

Источник: тесты_exam_5, Q21. Тема: модуль 13.

1. a change in the bandwidth according to the show interfaces output
2. a next-hop timeout from a traceroute
3. an increase in host-to-host ping response times
4. a change in the amount of RAM according to the show version output

**Ответ:** an increase in host-to-host ping response times.

**Объяснение:** ping отправляет Echo Request и ждёт Echo Reply: проверяет достижимость и RTT. В IOS ! — ответ, . — таймаут, U — unreachable. Отсутствие ответа не локализует неисправность само по себе; ICMP мог быть запрещён.

### E667. Which statement is true about Cisco IOS ping indicators?

Источник: тесты_exam_5, Q24. Тема: модуль 13.

1. '!' indicates that the ping was unsuccessful and that the device may have issues finding a DNS server.
2. 'U' may indicate that a router along the path did not contain a route to the destination address and that the ping was unsuccessful.
3. '.' indicates that the ping was successful but the response time was longer than normal.
4. A combination of '.' and '!' indicates that a router along the path did not have a route to the destination address and responded with an ICMP unreachable message.

**Ответ:** 'U' may indicate that a router along the path did not contain a route to the destination address and that the ping was unsuccessful..

**Объяснение:** ping отправляет Echo Request и ждёт Echo Reply: проверяет достижимость и RTT. В IOS ! — ответ, . — таймаут, U — unreachable. Отсутствие ответа не локализует неисправность само по себе; ICMP мог быть запрещён.

### E668. A network technician issues the C:> tracert -6 www.cisco.com command on a Windows PC. What is the purpose of the -6 command option?

Источник: тесты_exam_5, Q25. Тема: модуль 13.

1. It forces the trace to use IPv6.
2. It limits the trace to only 6 hops.
3. It sets a 6 milliseconds timeout for each replay.
4. It sends 6 probes within each TTL time period.

**Ответ:** It forces the trace to use IPv6..

**Объяснение:** traceroute/tracert последовательно увеличивает TTL/Hop Limit и получает ответы от промежуточных маршрутизаторов. Time Exceeded показывает очередной hop. Молчание hop может означать фильтрацию ICMP, а не обязательно поломку.

### E669. A user reports a lack of network connectivity. The technician takes control of the user machine and attempts to ping other computers on the network and these pings fail. The technician pings the default gateway and that also fails. What can be determined for sure by the results of these tests?

Источник: тесты_exam_5, Q26. Тема: модуль 13.

1. The NIC in the PC is bad.
2. The TCP/IP protocol is not enabled.
3. The router that is attached to the same network as the workstation is down.
4. Nothing can be determined for sure at this point.

**Ответ:** Nothing can be determined for sure at this point..

**Объяснение:** ping отправляет Echo Request и ждёт Echo Reply: проверяет достижимость и RTT. В IOS ! — ответ, . — таймаут, U — unreachable. Отсутствие ответа не локализует неисправность само по себе; ICMP мог быть запрещён.

### E673. Which statement describes the ping and tracert commands?

Источник: тесты_exam_5, Q30. Тема: модуль 13.

1. Tracert shows each hop, while ping shows a destination reply only.
2. Tracert uses IP addresses; ping does not.
3. Both ping and tracert can show results in a graphical display.
4. Ping shows whether the transmission is successful; tracert does not.

**Ответ:** Tracert shows each hop, while ping shows a destination reply only..

**Объяснение:** traceroute/tracert последовательно увеличивает TTL/Hop Limit и получает ответы от промежуточных маршрутизаторов. Time Exceeded показывает очередной hop. Молчание hop может означать фильтрацию ICMP, а не обязательно поломку.

### E682. What is a user trying to determine when issuing a ping 10.1.1.1 command on a PC?

Источник: тесты_exam_6, Q4. Тема: модуль 13.

1. if the TCP/IP stack is functioning on the PC without putting traffic on the wire
2. if there is connectivity with the destination device
3. the path that traffic will take to reach the destination
4. what type of device is at the destination

**Ответ:** if there is connectivity with the destination device.

**Объяснение:** ping отправляет Echo Request и ждёт Echo Reply: проверяет достижимость и RTT. В IOS ! — ответ, . — таймаут, U — unreachable. Отсутствие ответа не локализует неисправность само по себе; ICMP мог быть запрещён.

### E714. A network technician types the command ping 127.0.0.1 at the command prompt on a computer. What is the technician trying to accomplish?

Источник: тесты_exam_6, Q36. Тема: модуль 13.

1. checking the IP address on the network card
2. testing the integrity of the TCP/IP stack on the local machine
3. pinging a host computer that has the IP address 127.0.0.1 on the network
4. tracing the path to a host computer on the network and the network has the IP address 127.0.0.1

**Ответ:** testing the integrity of the TCP/IP stack on the local machine.

**Объяснение:** 127.0.0.1 для IPv4 и ::1 для IPv6 — loopback. Ответ проверяет локальный IP-стек; он не доказывает исправность кабеля, шлюза или интернета.

### E715. Which two ICMP messages are used by both IPv4 and IPv6 protocols? (Choose two.)

Источник: тесты_exam_6, Q37. Тема: модуль 13.

1. router solicitation
2. route redirection
3. neighbor solicitation
4. protocol unreachable
5. router advertisement

**Ответ в курсе; см. уточнение ниже:** Нет полностью точной пары среди отмеченных вариантов: Redirect есть в обеих версиях; неизвестный протокол в ICMPv6 сообщается через Parameter Problem.

**Объяснение:** В отображённой попытке: route redirection; protocol unreachable. В показанном варианте отмечены route redirection и protocol unreachable. Точная формулировка спорная: IPv6 сообщает неизвестный Next Header через Parameter Problem, а не отдельный код protocol unreachable как IPv4. Общие механизмы — Echo, Destination Unreachable, Time Exceeded; не запоминайте выбранную пару как универсальное правило. См. RFC 4443.

### E716. Network information: * local router LAN interface: 172.19.29.254 / fe80:65ab:dcc1::10 * local router WAN interface: 198.133.219.33 / 2001:db8:FACE:39::10 * remote server: 192.135.250.103 What task might a user be trying to accomplish by using the ping 2001:db8:FACE:39::10 command?

Источник: тесты_exam_6, Q38. Тема: модуль 13.

1. verifying that there is connectivity to the internet
2. verifying that there is connectivity within the local network
3. creating a network performance benchmark to a server on the company intranet
4. determining the path to reach the remote server

**Ответ в курсе; см. уточнение ниже:** Проверка достижимости указанного WAN-интерфейса локального маршрутизатора.

**Объяснение:** В отображённой попытке: verifying that there is connectivity to the internet. Цель ping — WAN-адрес локального маршрутизатора. Ответ подтверждает достижимость именно этого адреса. Вариант курса про «connectivity to the internet» слишком широк: доступ к удалённому серверу так не доказан.

### E728. Which two commands could be used to check if DNS name resolution is working properly on a Windows PC? (Choose two.)

Источник: тесты_exam_6, Q50. Тема: модуль 13.

1. nslookup cisco.com
2. net cisco.com
3. ping cisco.com
4. nbtstat cisco.com
5. ipconfig /flushdns

**Ответ:** nslookup cisco.com; ping cisco.com.

**Объяснение:** DNS сопоставляет имена и записи: A→IPv4, AAAA→IPv6, NS→авторитетный сервер, MX→почтовый сервер. nslookup опрашивает DNS. Запрос вне своей зоны можно переслать/разрешить рекурсивно. DNS использует и UDP, и TCP; TCP применяется не только между серверами.

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

**Объяснение:** ipconfig показывает IP-настройки ПК; nslookup проверяет DNS; ping проверяет достижимость шлюза/узла. Каждый инструмент проверяет свою часть, поэтому один успешный тест не доказывает исправность всей сети.

### E763. What is the consequence of configuring a router with the ipv6 unicast-routing global configuration command?

Источник: тесты_exam_7, Q30. Тема: модуль 13.

1. All router interfaces will be automatically activated.
2. It statically creates a global unicast address on this router.
3. The IPv6 enabled router interfaces begin sending ICMPv6 Router Advertisement messages.
4. Each router interface will generate an IPv6 link-local address.

**Ответ:** The IPv6 enabled router interfaces begin sending ICMPv6 Router Advertisement messages..

**Объяснение:** ipv6 unicast-routing включает пересылку IPv6 на маршрутизаторе; соответствующие интерфейсы могут отправлять RA. Проверить наличие команды можно в show running-config. Одного IPv6-адреса на интерфейсе для маршрутизации недостаточно.


## Модуль 14: TCP и UDP

### E068. What is the purpose of the sequencing function in network communication?

Источник: модули_03, Q3. Тема: модуль 14.

1. To uniquely label transmitted segments of data for proper reassembly by the receiver
2. To determine if data is corrupted during transmission
3. To ensure data flows at an efficient rate between sender and receiver
4. To guarantee delivery of data

**Ответ:** To uniquely label transmitted segments of data for proper reassembly by the receiver.

**Объяснение:** Транспортный уровень разделяет данные на части и различает разговоры приложений с помощью портов. Мультиплексирование позволяет нескольким приложениям одновременно использовать сеть; TCP дополнительно обеспечивает упорядочивание и надёжность.

### E069. This protocol is responsible for guaranteeing the reliable delivery of information.

Источник: модули_03, Q4. Тема: модуль 14.

1. TCP
2. IP
3. HTTP
4. Ethernet

**Ответ:** TCP.

**Объяснение:** TCP устанавливает соединение и передаёт надёжный упорядоченный поток байтов. Потерю компенсирует повторная передача, получение подтверждается ACK. Классические FTP и HTTP в этом курсе используют TCP; HTTP/3 — отдельный современный случай поверх QUIC/UDP.

### E070. UDP and TCP belong to which layer of the TCP/IP protocol?

Источник: модули_03, Q1. Тема: модуль 14.

1. Application
2. Transport
3. Internet
4. Network access

**Ответ:** Transport.

**Объяснение:** Транспортный уровень разделяет данные на части и различает разговоры приложений с помощью портов. Мультиплексирование позволяет нескольким приложениям одновременно использовать сеть; TCP дополнительно обеспечивает упорядочивание и надёжность.

### E075. Which services are provided by the internet layer of the TCP/IP protocol suite? (Choose three.)

Источник: модули_03, Q6. Тема: модуль 14.

1. File Transfer
2. Address Resolution
3. Routing Protocols
4. Messaging
5. Ethernet
6. Internet Protocol

**Ответ:** Routing Protocols; Messaging; Internet Protocol.

**Объяснение:** Маршрутизатор ищет сеть назначения в таблице маршрутизации, предпочитая самый длинный совпавший префикс. show ip route показывает таблицу IOS; O означает OSPF, S — static. Default route используется при отсутствии более специфичного маршрута. Windows: route print или netstat -r.

### E080. What is the process of dividing a large data stream into smaller pieces prior to transmission?

Источник: модули_03, Q1. Тема: модуль 14.

1. Sequencing
2. Duplexing
3. Multiplexing
4. Segmentation

**Ответ:** Segmentation.

**Объяснение:** Транспортный уровень разделяет данные на части и различает разговоры приложений с помощью портов. Мультиплексирование позволяет нескольким приложениям одновременно использовать сеть; TCP дополнительно обеспечивает упорядочивание и надёжность.

### E081. What is the PDU associated with the transport layer?

Источник: модули_03, Q2. Тема: модуль 14.

1. Segment
2. Packet
3. Bits
4. Frame

**Ответ:** Segment.

**Объяснение:** Транспортный уровень разделяет данные на части и различает разговоры приложений с помощью портов. Мультиплексирование позволяет нескольким приложениям одновременно использовать сеть; TCP дополнительно обеспечивает упорядочивание и надёжность.

### E099. Which layer of the OSI model defines services to segment and reassemble data for individual communications between end devices?

Источник: модули_03, Q10. Тема: модуль 14.

1. Application
2. Presentation
3. Session
4. Transport
5. Network

**Ответ:** Transport.

**Объяснение:** Транспортный уровень разделяет данные на части и различает разговоры приложений с помощью портов. Мультиплексирование позволяет нескольким приложениям одновременно использовать сеть; TCP дополнительно обеспечивает упорядочивание и надёжность.

### E344. Which layer is responsible for establishing a temporary communication session between the source and destination host applications?

Источник: модули_14, Q1. Тема: модуль 14.

1. Application layer
2. Data link layer
3. Network layer
4. Physical layer
5. Transport layer

**Ответ:** Transport layer.

**Объяснение:** Транспортный уровень разделяет данные на части и различает разговоры приложений с помощью портов. Мультиплексирование позволяет нескольким приложениям одновременно использовать сеть; TCP дополнительно обеспечивает упорядочивание и надёжность.

### E345. Which three are transport layer responsibilities? (Choose three.)

Источник: модули_14, Q2. Тема: модуль 14.

1. Conversation multiplexing
2. Identifying frames
3. Identifying routing information
4. Segmenting data and reassembling segments
5. Tracking individual conversations

**Ответ:** Conversation multiplexing; Segmenting data and reassembling segments; Tracking individual conversations.

**Объяснение:** Транспортный уровень разделяет данные на части и различает разговоры приложений с помощью портов. Мультиплексирование позволяет нескольким приложениям одновременно использовать сеть; TCP дополнительно обеспечивает упорядочивание и надёжность.

### E346. Which transport layer protocol statement is true?

Источник: модули_14, Q3. Тема: модуль 14.

1. TCP has fewer fields than UDP.
2. TCP is faster than UDP.
3. UDP is a best-effort delivery protocol.
4. UDP provides reliability.

**Ответ:** UDP is a best-effort delivery protocol..

**Объяснение:** UDP не устанавливает соединение, не подтверждает доставку и не делает повторных передач или упорядочивания. Это уменьшает накладные расходы; подходит для real-time и простых запросов. Checksum обнаруживает повреждения, но не восстанавливает данные.

### E347. Which transport layer protocol would be used for VoIP applications?

Источник: модули_14, Q4. Тема: модуль 14.

1. Session Information Protocol (SIP)
2. Transmission Control Protocol (TCP)
3. User Datagram Protocol (UDP)
4. VoIP Transfer Protocol

**Ответ:** User Datagram Protocol (UDP).

**Объяснение:** UDP не устанавливает соединение, не подтверждает доставку и не делает повторных передач или упорядочивания. Это уменьшает накладные расходы; подходит для real-time и простых запросов. Checksum обнаруживает повреждения, но не восстанавливает данные.

### E348. Which transport layer protocol ensures reliable same-order delivery?

Источник: модули_14, Q1. Тема: модуль 14.

1. ICMP
2. IP
3. TCP
4. UDP

**Ответ:** TCP.

**Объяснение:** TCP устанавливает соединение и передаёт надёжный упорядоченный поток байтов. Потерю компенсирует повторная передача, получение подтверждается ACK. Классические FTP и HTTP в этом курсе используют TCP; HTTP/3 — отдельный современный случай поверх QUIC/UDP.

### E349. Which TCP header statement is true?

Источник: модули_14, Q2. Тема: модуль 14.

1. It consists of 4 fields in an 8-byte header.
2. It consists of 8 fields in a 10-byte header.
3. It consists of 10 fields in a 20-byte header.
4. It consists of 20 fields in a 40-byte header.

**Ответ:** It consists of 10 fields in a 20-byte header..

**Объяснение:** Минимальный TCP-заголовок — 20 байт, UDP — 8 байт (source port, destination port, length, checksum). У TCP есть sequence/acknowledgment, flags и window; у UDP таких полей нет.

### E350. Which two applications would use the TCP transport layer protocol? (Choose two.)

Источник: модули_14, Q3. Тема: модуль 14.

1. FTP
2. HTTP
3. ICMP
4. TFTP
5. VoIP

**Ответ:** FTP; HTTP.

**Объяснение:** TCP устанавливает соединение и передаёт надёжный упорядоченный поток байтов. Потерю компенсирует повторная передача, получение подтверждается ACK. Классические FTP и HTTP в этом курсе используют TCP; HTTP/3 — отдельный современный случай поверх QUIC/UDP.

### E351. Which of the following is a stateless best-effort delivery transport layer protocol?

Источник: модули_14, Q1. Тема: модуль 14.

1. ICMP
2. IP
3. TCP
4. UDP

**Ответ:** UDP.

**Объяснение:** UDP не устанавливает соединение, не подтверждает доставку и не делает повторных передач или упорядочивания. Это уменьшает накладные расходы; подходит для real-time и простых запросов. Checksum обнаруживает повреждения, но не восстанавливает данные.

### E352. Which UDP header statement is true?

Источник: модули_14, Q2. Тема: модуль 14.

1. It consists of 4 fields in an 8-byte header.
2. It consists of 8 fields in a 10-byte header.
3. It consists of 10 fields in a 20-byte header.
4. It consists of 20 fields in a 40-byte header.

**Ответ:** It consists of 4 fields in an 8-byte header..

**Объяснение:** Минимальный TCP-заголовок — 20 байт, UDP — 8 байт (source port, destination port, length, checksum). У TCP есть sequence/acknowledgment, flags и window; у UDP таких полей нет.

### E353. Which two applications would use the UDP transport layer protocol? (Choose two.)

Источник: модули_14, Q3. Тема: модуль 14.

1. FTP
2. HTTP
3. ICMP
4. TFTP
5. VoIP

**Ответ:** TFTP; VoIP.

**Объяснение:** UDP не устанавливает соединение, не подтверждает доставку и не делает повторных передач или упорядочивания. Это уменьшает накладные расходы; подходит для real-time и простых запросов. Checksum обнаруживает повреждения, но не восстанавливает данные.

### E354. Which two fields are the same in a TCP and UDP header? (Choose two.)

Источник: модули_14, Q4. Тема: модуль 14.

1. Control bits
2. Destination port number
3. Sequence number
4. Source port number
5. Well-known port number

**Ответ:** Destination port number; Source port number.

**Объяснение:** Минимальный TCP-заголовок — 20 байт, UDP — 8 байт (source port, destination port, length, checksum). У TCP есть sequence/acknowledgment, flags и window; у UDP таких полей нет.

### E355. Assume a host with IP address 10.1.1.10 wants to request web services from a server at 10.1.1.254. Which of the following would display the correct socket pair?

Источник: модули_14, Q1. Тема: модуль 14.

1. 1099:10.1.1.10, 80:10.1.1.254
2. 10.1.1.10:80, 10.1.1.254:1099
3. 10.1.1.10:1099, 10.1.1.254:80
4. 80:10.1.1.10, 1099:10.1.1.254

**Ответ:** 10.1.1.10:1099, 10.1.1.254:80.

**Объяснение:** Socket — IP-адрес вместе с портом. Клиент обычно выбирает временный source port, сервер слушает известный destination port: SMTP 25, DNS 53, HTTP 80. Ответ направляется обратно клиентскому порту.

### E356. Which port group includes port numbers for FTP, HTTP, and TFTP applications?

Источник: модули_14, Q2. Тема: модуль 14.

1. Dynamic ports
2. Private ports
3. Registered ports
4. Well-known ports

**Ответ:** Well-known ports.

**Объяснение:** Well-known/system ports: 0–1023; registered: 1024–49151; dynamic/private: 49152–65535. netstat показывает соединения и порты. Telnet = TCP 23, SSH = TCP 22, DHCP server = UDP 67.

### E357. Which Windows command would display the protocols in use, the local address and port numbers, the foreign address and port numbers, and the connection state?

Источник: модули_14, Q3. Тема: модуль 14.

1. Ipconfig /all
2. Ping
3. Netstat
4. Traceroute

**Ответ:** Netstat.

**Объяснение:** Well-known/system ports: 0–1023; registered: 1024–49151; dynamic/private: 49152–65535. netstat показывает соединения и порты. Telnet = TCP 23, SSH = TCP 22, DHCP server = UDP 67.

### E358. Which of the following would be valid source and destination ports for a host connecting to an email server?

Источник: модули_14, Q1. Тема: модуль 14.

1. Source: 25, Destination: 49152
2. Source: 80, Destination: 49152
3. Source: 49152, Destination: 25
4. Source: 49152, Destination: 80

**Ответ:** Source: 49152, Destination: 25.

**Объяснение:** Socket — IP-адрес вместе с портом. Клиент обычно выбирает временный source port, сервер слушает известный destination port: SMTP 25, DNS 53, HTTP 80. Ответ направляется обратно клиентскому порту.

### E359. Which control bit flags are used during the three-way handshake?

Источник: модули_14, Q2. Тема: модуль 14.

1. ACK and FIN
2. FIN and RESET
3. RESET and SYN
4. SYN and ACK

**Ответ:** SYN and ACK.

**Объяснение:** TCP открывается SYN → SYN+ACK → ACK. При обычном закрытии обе стороны отправляют FIN и получают ACK: часто четыре сообщения, но ACK и FIN могут объединяться. ACK подтверждает получение, SYN синхронизирует sequence numbers.

### E360. How many exchanges are needed to end both sessions between two hosts?

Источник: модули_14, Q3. Тема: модуль 14.

1. One exchange
2. Two exchanges
3. Three exchanges
4. Four exchanges
5. Five exchanges

**Ответ:** Four exchanges.

**Объяснение:** TCP открывается SYN → SYN+ACK → ACK. При обычном закрытии обе стороны отправляют FIN и получают ACK: часто четыре сообщения, но ACK и FIN могут объединяться. ACK подтверждает получение, SYN синхронизирует sequence numbers.

### E361. What field is used by the destination host to reassemble segments into the original order?

Источник: модули_14, Q1. Тема: модуль 14.

1. Control Bits
2. Destination Port
3. Sequence Number
4. Source Port
5. Window Size

**Ответ:** Sequence Number.

**Объяснение:** Sequence number задаёт положение байтов в TCP-потоке; ACK указывает следующий ожидаемый байт. Если первый байт имеет номер 1 и пришло 3×1500=4500 байт, ACK = 4501. Порядок восстанавливается по номерам, не по времени прихода.

### E362. What field is used to provide flow control?

Источник: модули_14, Q2. Тема: модуль 14.

1. Control Bits
2. Destination Port
3. Sequence Number
4. Source Port
5. Window Size

**Ответ:** Window Size.

**Объяснение:** Receive window ограничивает неподтверждённые данные по возможностям получателя (flow control). Sliding window позволяет передавать несколько сегментов без остановки после каждого. Congestion control отдельно уменьшает объём передачи при признаках перегрузки сети.

### E363. What happens when a sending host senses there is congestion?

Источник: модули_14, Q3. Тема: модуль 14.

1. The receiving host increases the number of bytes it sends before receiving an acknowledgment from the sending host.
2. The receiving host reduces the number of bytes it sends before receiving an acknowledgment from the sending host.
3. The sending host increases the number of bytes it sends before receiving an acknowledgment from the destination host.
4. The sending host reduces the number of bytes it sends before receiving an acknowledgment from the destination host.

**Ответ:** The sending host reduces the number of bytes it sends before receiving an acknowledgment from the destination host..

**Объяснение:** Receive window ограничивает неподтверждённые данные по возможностям получателя (flow control). Sliding window позволяет передавать несколько сегментов без остановки после каждого. Congestion control отдельно уменьшает объём передачи при признаках перегрузки сети.

### E364. Why is UDP desirable for protocols that make a simple request and reply transactions?

Источник: модули_14, Q1. Тема: модуль 14.

1. Flow Control
2. Low overhead
3. Reliability
4. Same-order delivery

**Ответ:** Low overhead.

**Объяснение:** UDP не устанавливает соединение, не подтверждает доставку и не делает повторных передач или упорядочивания. Это уменьшает накладные расходы; подходит для real-time и простых запросов. Checksum обнаруживает повреждения, но не восстанавливает данные.

### E365. Which UDP datagram reassembly statement is true?

Источник: модули_14, Q2. Тема: модуль 14.

1. UDP does not reassemble the data.
2. UDP reassembles the data in the order that it was received.
3. UDP reassembles the data using control bits.
4. UDP reassembles the data using sequence numbers.

**Ответ:** UDP reassembles the data in the order that it was received..

**Объяснение:** UDP не устанавливает соединение, не подтверждает доставку и не делает повторных передач или упорядочивания. Это уменьшает накладные расходы; подходит для real-time и простых запросов. Checksum обнаруживает повреждения, но не восстанавливает данные.

### E366. Which of the following would be valid source and destination ports for a host connecting to a DNS server?

Источник: модули_14, Q3. Тема: модуль 14.

1. Source: 53, Destination: 49152
2. Source: 1812, Destination: 49152
3. Source: 49152, Destination: 53
4. Source: 49152, Destination: 1812

**Ответ:** Source: 49152, Destination: 53.

**Объяснение:** Socket — IP-адрес вместе с портом. Клиент обычно выбирает временный source port, сервер слушает известный destination port: SMTP 25, DNS 53, HTTP 80. Ответ направляется обратно клиентскому порту.

### E367. Which transport layer feature is used to establish a connection-oriented session?

Источник: модули_14, Q1. Тема: модуль 14.

1. UDP ACK flag
2. TCP 3-way handshake
3. UDP sequence number
4. TCP port number

**Ответ:** TCP 3-way handshake.

**Объяснение:** TCP устанавливает соединение и передаёт надёжный упорядоченный поток байтов. Потерю компенсирует повторная передача, получение подтверждается ACK. Классические FTP и HTTP в этом курсе используют TCP; HTTP/3 — отдельный современный случай поверх QUIC/UDP.

### E368. What is the complete range of TCP and UDP well-known ports?

Источник: модули_14, Q2. Тема: модуль 14.

1. 0 to 255
2. 0 to 1023
3. 256 - 1023
4. 1024 - 49151

**Ответ:** 0 to 1023.

**Объяснение:** Well-known/system ports: 0–1023; registered: 1024–49151; dynamic/private: 49152–65535. netstat показывает соединения и порты. Telnet = TCP 23, SSH = TCP 22, DHCP server = UDP 67.

### E369. What is a socket?

Источник: модули_14, Q3. Тема: модуль 14.

1. The combination of the source and destination IP address and source and destination Ethernet address
2. The combination of a source IP address and port number or a destination IP address and port number
3. The combination of the source and destination sequence and acknowledgment numbers
4. The combination of the source and destination sequence numbers and port numbers

**Ответ:** The combination of a source IP address and port number or a destination IP address and port number.

**Объяснение:** Socket — IP-адрес вместе с портом. Клиент обычно выбирает временный source port, сервер слушает известный destination port: SMTP 25, DNS 53, HTTP 80. Ответ направляется обратно клиентскому порту.

### E370. How does a networked server manage requests from multiple clients for different services?

Источник: модули_14, Q4. Тема: модуль 14.

1. The server sends all requests through a default gateway.
2. Each request has a combination of source and destination port numbers, coming from a unique IP address.
3. The server uses IP addresses to identify different services.
4. Each request is tracked through the physical address of the client.

**Ответ:** Each request has a combination of source and destination port numbers, coming from a unique IP address..

**Объяснение:** Socket — IP-адрес вместе с портом. Клиент обычно выбирает временный source port, сервер слушает известный destination port: SMTP 25, DNS 53, HTTP 80. Ответ направляется обратно клиентскому порту.

### E371. What happens if part of an FTP message is not delivered to the destination?

Источник: модули_14, Q5. Тема: модуль 14.

1. The message is lost because FTP does not use a reliable delivery method.
2. The FTP source host sends a query to the destination host.
3. The part of the FTP message that was lost is re-sent.
4. The entire FTP message is re-sent.

**Ответ:** The part of the FTP message that was lost is re-sent..

**Объяснение:** TCP устанавливает соединение и передаёт надёжный упорядоченный поток байтов. Потерю компенсирует повторная передача, получение подтверждается ACK. Классические FTP и HTTP в этом курсе используют TCP; HTTP/3 — отдельный современный случай поверх QUIC/UDP.

### E372. What type of applications are best suited for using UDP?

Источник: модули_14, Q6. Тема: модуль 14.

1. Applications that are sensitive to delay
2. Applications that need reliable delivery
3. Applications that require retransmission of lost segments
4. Applications that are sensitive to packet loss

**Ответ:** Applications that are sensitive to delay.

**Объяснение:** UDP не устанавливает соединение, не подтверждает доставку и не делает повторных передач или упорядочивания. Это уменьшает накладные расходы; подходит для real-time и простых запросов. Checksum обнаруживает повреждения, но не восстанавливает данные.

### E373. Network congestion has resulted in the source learning of the loss of TCP segments that were sent to the destination. What is one way that the TCP protocol addresses this?

Источник: модули_14, Q7. Тема: модуль 14.

1. The source decreases the amount of data that it transmits before it receives an acknowledgement from the destination.
2. The source decreases the window size to decrease the rate of transmission from the destination.
3. The destination decreases the window size.
4. The destination sends fewer acknowledgement messages in order to conserve bandwidth.

**Ответ:** The source decreases the amount of data that it transmits before it receives an acknowledgement from the destination..

**Объяснение:** Receive window ограничивает неподтверждённые данные по возможностям получателя (flow control). Sliding window позволяет передавать несколько сегментов без остановки после каждого. Congestion control отдельно уменьшает объём передачи при признаках перегрузки сети.

### E374. Which two operations are provided by TCP but not by UDP? (Choose two.)

Источник: модули_14, Q8. Тема: модуль 14.

1. Identifying the applications
2. Acknowledging received data
3. Identifying individual conversations
4. Retransmitting any unacknowledged data
5. Reconstructing data in the order received

**Ответ:** Acknowledging received data; Retransmitting any unacknowledged data.

**Объяснение:** TCP устанавливает соединение и передаёт надёжный упорядоченный поток байтов. Потерю компенсирует повторная передача, получение подтверждается ACK. Классические FTP и HTTP в этом курсе используют TCP; HTTP/3 — отдельный современный случай поверх QUIC/UDP.

### E375. What is the purpose of using a source port number in a TCP communication?

Источник: модули_14, Q9. Тема: модуль 14.

1. To notify the remote device that the conversation is over
2. To assemble the segments that arrived out of order
3. To keep track of multiple conversations between devices
4. To inquire for a nonreceived segment

**Ответ:** To keep track of multiple conversations between devices.

**Объяснение:** Socket — IP-адрес вместе с портом. Клиент обычно выбирает временный source port, сервер слушает известный destination port: SMTP 25, DNS 53, HTTP 80. Ответ направляется обратно клиентскому порту.

### E376. Which two flags in the TCP header are used in a TCP three-way handshake to establish connectivity between two network devices? (Choose two.)

Источник: модули_14, Q10. Тема: модуль 14.

1. ACK
2. FIN
3. PSH
4. RST
5. SYN
6. URG

**Ответ:** ACK; SYN.

**Объяснение:** TCP открывается SYN → SYN+ACK → ACK. При обычном закрытии обе стороны отправляют FIN и получают ACK: часто четыре сообщения, но ACK и FIN могут объединяться. ACK подтверждает получение, SYN синхронизирует sequence numbers.

### E377. What TCP mechanism is used to enhance performance by allowing a device to continuously send a steady stream of segments as long as the device is also receiving necessary acknowledgements?

Источник: модули_14, Q11. Тема: модуль 14.

1. Three-way handshake
2. Socket pair
3. Two-way handshake
4. Sliding window

**Ответ:** Sliding window.

**Объяснение:** Receive window ограничивает неподтверждённые данные по возможностям получателя (flow control). Sliding window позволяет передавать несколько сегментов без остановки после каждого. Congestion control отдельно уменьшает объём передачи при признаках перегрузки сети.

### E378. Which action is performed by a client when establishing communication with a server via the use of UDP at the transport layer?

Источник: модули_14, Q12. Тема: модуль 14.

1. The client sets the window size for the session.
2. The client sends an ISN to the server to start the 3-way handshake.
3. The client randomly selects a source port number.
4. The client sends a synchronization segment to begin the session.

**Ответ:** The client randomly selects a source port number..

**Объяснение:** UDP не устанавливает соединение, не подтверждает доставку и не делает повторных передач или упорядочивания. Это уменьшает накладные расходы; подходит для real-time и простых запросов. Checksum обнаруживает повреждения, но не восстанавливает данные.

### E379. Which two services or protocols use the preferred UDP protocol for fast transmission and low overhead? (Choose two)

Источник: модули_14, Q13. Тема: модуль 14.

1. FTP
2. DNS
3. HTTP
4. POP3
5. VoIP

**Ответ:** DNS; VoIP.

**Объяснение:** UDP не устанавливает соединение, не подтверждает доставку и не делает повторных передач или упорядочивания. Это уменьшает накладные расходы; подходит для real-time и простых запросов. Checksum обнаруживает повреждения, но не восстанавливает данные.

### E380. Which number or set of numbers represents a socket?

Источник: модули_14, Q14. Тема: модуль 14.

1. 01-23-45-67-89-AB
2. 21
3. 192.168.1.1:80
4. 10.1.1.15

**Ответ:** 192.168.1.1:80.

**Объяснение:** Socket — IP-адрес вместе с портом. Клиент обычно выбирает временный source port, сервер слушает известный destination port: SMTP 25, DNS 53, HTTP 80. Ответ направляется обратно клиентскому порту.

### E381. What is a responsibility of transport layer protocols?

Источник: модули_14, Q15. Тема: модуль 14.

1. Providing network access
2. Tracking individual conversations
3. Determining the best path to forward a packet
4. Translating private IP addresses to public IP addresses

**Ответ:** Tracking individual conversations.

**Объяснение:** Транспортный уровень разделяет данные на части и различает разговоры приложений с помощью портов. Мультиплексирование позволяет нескольким приложениям одновременно использовать сеть; TCP дополнительно обеспечивает упорядочивание и надёжность.

### E533. What layer is responsible for routing messages through an internetwork in the TCP/IP model?

Источник: тесты_exam_0, Q22. Тема: модуль 14.

1. internet
2. transport
3. network access
4. session

**Ответ:** internet.

**Объяснение:** Маршрутизатор ищет сеть назначения в таблице маршрутизации, предпочитая самый длинный совпавший префикс. show ip route показывает таблицу IOS; O означает OSPF, S — static. Default route используется при отсутствии более специфичного маршрута. Windows: route print или netstat -r.

### E538. Which statement accurately describes a TCP/IP encapsulation process when a PC is sending data to the network?

Источник: тесты_exam_0, Q27. Тема: модуль 14.

1. Data is sent from the internet layer to the network access layer.
2. Packets are sent from the network access layer to the transport layer.
3. Segments are sent from the transport layer to the internet layer.
4. Frames are sent from the network access layer to the internet layer.

**Ответ:** Segments are sent from the transport layer to the internet layer..

**Объяснение:** Транспортный уровень создаёт сегменты; сетевой добавляет IP-заголовок. Поэтому на L3 появляются IP-адреса, а PDU становится пакетом.

### E582. What are two services provided by the OSI network layer? (Choose two.)

Источник: тесты_exam_2, Q4. Тема: модуль 14.

1. performing error detection
2. routing packets toward the destination
3. encapsulating PDUs from the transport layer
4. placement of frames on the media
5. collision detection

**Ответ:** routing packets toward the destination; encapsulating PDUs from the transport layer.

**Объяснение:** Транспортный уровень создаёт сегменты; сетевой добавляет IP-заголовок. Поэтому на L3 появляются IP-адреса, а PDU становится пакетом.

### E585. What information does the loopback test provide?

Источник: тесты_exam_2, Q7. Тема: модуль 14.

1. The TCP/IP stack on the device is working correctly.
2. The device has end-to-end connectivity.
3. DHCP is working correctly.
4. The Ethernet cable is working correctly.
5. The device has the correct IP address on the network.

**Ответ:** The TCP/IP stack on the device is working correctly..

**Объяснение:** 127.0.0.1 для IPv4 и ::1 для IPv6 — loopback. Ответ проверяет локальный IP-стек; он не доказывает исправность кабеля, шлюза или интернета.

### E612. What does a client do when it has UDP datagrams to send?

Источник: тесты_exam_4, Q1. Тема: модуль 14.

1. It just sends the datagrams.
2. It queries the server to see if it is ready to receive data.
3. It sends a simplified three-way handshake to the server.
4. It sends to the server a segment with the SYN flag set to synchronize the conversation.

**Ответ:** It just sends the datagrams..

**Объяснение:** UDP не устанавливает соединение, не подтверждает доставку и не делает повторных передач или упорядочивания. Это уменьшает накладные расходы; подходит для real-time и простых запросов. Checksum обнаруживает повреждения, но не восстанавливает данные.

### E613. Which flag in the TCP header is used in response to a received FIN in order to terminate connectivity between two network devices?

Источник: тесты_exam_4, Q2. Тема: модуль 14.

1. FIN
2. ACK
3. SYN
4. RST

**Ответ:** ACK.

**Объяснение:** TCP открывается SYN → SYN+ACK → ACK. При обычном закрытии обе стороны отправляют FIN и получают ACK: часто четыре сообщения, но ACK и FIN могут объединяться. ACK подтверждает получение, SYN синхронизирует sequence numbers.

### E614. Which two characteristics are associated with UDP sessions? (Choose two.)

Источник: тесты_exam_4, Q3. Тема: модуль 14.

1. Destination devices receive traffic with minimal delay.
2. Transmitted data segments are tracked.
3. Destination devices reassemble messages and pass them to an application.
4. Received data is unacknowledged.
5. Unacknowledged data packets are retransmitted.

**Ответ:** Destination devices receive traffic with minimal delay.; Received data is unacknowledged..

**Объяснение:** UDP не устанавливает соединение, не подтверждает доставку и не делает повторных передач или упорядочивания. Это уменьшает накладные расходы; подходит для real-time и простых запросов. Checksum обнаруживает повреждения, но не восстанавливает данные.

### E616. Which two fields are included in the TCP header but not in the UDP header? (Choose two.)

Источник: тесты_exam_4, Q5. Тема: модуль 14.

1. window
2. checksum
3. source port
4. destination port
5. sequence number

**Ответ:** window; sequence number.

**Объяснение:** Минимальный TCP-заголовок — 20 байт, UDP — 8 байт (source port, destination port, length, checksum). У TCP есть sequence/acknowledgment, flags и window; у UDP таких полей нет.

### E617. What is a characteristic of UDP?

Источник: тесты_exam_4, Q6. Тема: модуль 14.

1. UDP datagrams take the same path and arrive in the correct order at the destination.
2. Applications that use UDP are always considered unreliable.
3. UDP reassembles the received datagrams in the order they were received.
4. UDP only passes data to the network when the destination is ready to receive the data.

**Ответ:** UDP reassembles the received datagrams in the order they were received..

**Объяснение:** UDP не устанавливает соединение, не подтверждает доставку и не делает повторных передач или упорядочивания. Это уменьшает накладные расходы; подходит для real-time и простых запросов. Checksum обнаруживает повреждения, но не восстанавливает данные.

### E619. In what two situations would UDP be better than TCP as the preferred transport protocol? (Choose two.)

Источник: тесты_exam_4, Q8. Тема: модуль 14.

1. when applications need to guarantee that a packet arrives intact, in sequence, and unduplicated
2. when a faster delivery mechanism is needed
3. when delivery overhead is not an issue
4. when applications do not need to guarantee delivery of the data
5. when destination port numbers are dynamic

**Ответ:** when a faster delivery mechanism is needed; when applications do not need to guarantee delivery of the data.

**Объяснение:** UDP не устанавливает соединение, не подтверждает доставку и не делает повторных передач или упорядочивания. Это уменьшает накладные расходы; подходит для real-time и простых запросов. Checksum обнаруживает повреждения, но не восстанавливает данные.

### E621. What information is used by TCP to reassemble and reorder received segments?

Источник: тесты_exam_4, Q10. Тема: модуль 14.

1. port numbers
2. sequence numbers
3. acknowledgment numbers
4. fragment numbers

**Ответ:** sequence numbers.

**Объяснение:** Sequence number задаёт положение байтов в TCP-потоке; ACK указывает следующий ожидаемый байт. Если первый байт имеет номер 1 и пришло 3×1500=4500 байт, ACK = 4501. Порядок восстанавливается по номерам, не по времени прихода.

### E622. Which field in the TCP header indicates the status of the three-way handshake process?

Источник: тесты_exam_4, Q11. Тема: модуль 14.

1. window
2. reserved
3. checksum
4. control bits

**Ответ:** control bits.

**Объяснение:** TCP открывается SYN → SYN+ACK → ACK. При обычном закрытии обе стороны отправляют FIN и получают ACK: часто четыре сообщения, но ACK и FIN могут объединяться. ACK подтверждает получение, SYN синхронизирует sequence numbers.

### E624. Which three fields are used in a UDP segment header? (Choose three.)

Источник: тесты_exam_4, Q13. Тема: модуль 14.

1. Window Size
2. Length
3. Source Port
4. Acknowledgment Number
5. Checksum
6. Sequence Number

**Ответ:** Length; Source Port; Checksum.

**Объяснение:** Минимальный TCP-заголовок — 20 байт, UDP — 8 байт (source port, destination port, length, checksum). У TCP есть sequence/acknowledgment, flags и window; у UDP таких полей нет.

### E625. What are three responsibilities of the transport layer? (Choose three.)

Источник: тесты_exam_4, Q14. Тема: модуль 14.

1. meeting the reliability requirements of applications, if any
2. multiplexing multiple communication streams from many users or applications on the same network
3. identifying the applications and services on the client and server that should handle transmitted data
4. directing packets towards the destination network
5. formatting data into a compatible form for receipt by the destination devices
6. conducting error detection of the contents in frames

**Ответ:** meeting the reliability requirements of applications, if any; multiplexing multiple communication streams from many users or applications on the same network; identifying the applications and services on the client and server that should handle transmitted data.

**Объяснение:** Транспортный уровень разделяет данные на части и различает разговоры приложений с помощью портов. Мультиплексирование позволяет нескольким приложениям одновременно использовать сеть; TCP дополнительно обеспечивает упорядочивание и надёжность.

### E641. Which scenario describes a function provided by the transport layer?

Источник: тесты_exam_4, Q30; тесты_exam_7, Q5. Тема: модуль 14.

1. A student is using a classroom VoIP phone to call home. The unique identifier burned into the phone is a transport layer address used to contact another network device on the same network.
2. A student is playing a short web-based movie with sound. The movie and sound are encoded within the transport layer header.
3. A student has two web browser windows open in order to access two web sites. The transport layer ensures the correct web page is delivered to the correct browser window.
4. A corporate worker is accessing a web server located on a corporate network. The transport layer formats the screen so the web page appears properly no matter what device is being used to view the web site.

**Ответ:** A student has two web browser windows open in order to access two web sites. The transport layer ensures the correct web page is delivered to the correct browser window..

**Объяснение:** Транспортный уровень разделяет данные на части и различает разговоры приложений с помощью портов. Мультиплексирование позволяет нескольким приложениям одновременно использовать сеть; TCP дополнительно обеспечивает упорядочивание и надёжность.

### E642. A PC that is communicating with a web server has a TCP window size of 6,000 bytes when sending data and a packet size of 1,500 bytes. Which byte of information will the web server acknowledge after it has received three packets of data from the PC?

Источник: тесты_exam_4, Q31. Тема: модуль 14.

1. 4501
2. 6001
3. 6000
4. 4500

**Ответ:** 4501.

**Объяснение:** Sequence number задаёт положение байтов в TCP-потоке; ACK указывает следующий ожидаемый байт. Если первый байт имеет номер 1 и пришло 3×1500=4500 байт, ACK = 4501. Порядок восстанавливается по номерам, не по времени прихода.

### E687. Which PDU is processed when a host computer is de-encapsulating a message at the transport layer of the TCP/IP model?

Источник: тесты_exam_6, Q9. Тема: модуль 14.

1. bits
2. frame
3. packet
4. segment

**Ответ:** segment.

**Объяснение:** Транспортный уровень создаёт сегменты; сетевой добавляет IP-заголовок. Поэтому на L3 появляются IP-адреса, а PDU становится пакетом.

### E688. Which two OSI model layers have the same functionality as two layers of the TCP/IP model? (Choose two.)

Источник: тесты_exam_6, Q10. Тема: модуль 14.

1. data link
2. network
3. physical
4. session
5. transport

**Ответ:** network; transport.

**Объяснение:** Транспортный уровень разделяет данные на части и различает разговоры приложений с помощью портов. Мультиплексирование позволяет нескольким приложениям одновременно использовать сеть; TCP дополнительно обеспечивает упорядочивание и надёжность.

### E717. Refer to the exhibit. What does the value of the window size specify?

Источник: тесты_exam_6, Q39. Тема: модуль 14.

1. the amount of data that can be sent at one time
2. the total number of bits received during this TCP session
3. the amount of data that can be sent before an acknowledgment is required
4. a random number that is used in establishing a connection with the 3-way handshake

**Ответ для показанного варианта (нужна схема/PT для полной проверки):** the amount of data that can be sent before an acknowledgment is required.

**Объяснение:** Receive window ограничивает неподтверждённые данные по возможностям получателя (flow control). Sliding window позволяет передавать несколько сегментов без остановки после каждого. Congestion control отдельно уменьшает объём передачи при признаках перегрузки сети.

**Проверка условия:** исходный рисунок или PT-файл не включён в прежнюю текстовую выгрузку. Конкретные адреса/порты выше сохранены из отображённого варианта; это не универсальный ответ для иной схемы.

### E718. To which TCP port group does the port 414 belong?

Источник: тесты_exam_6, Q40. Тема: модуль 14.

1. registered
2. well-known
3. private or dynamic
4. public

**Ответ:** well-known.

**Объяснение:** Well-known/system ports: 0–1023; registered: 1024–49151; dynamic/private: 49152–65535. netstat показывает соединения и порты. Telnet = TCP 23, SSH = TCP 22, DHCP server = UDP 67.

### E748. What command can be used on a Windows PC to see the IP configuration of that computer?

Источник: тесты_exam_7, Q15. Тема: модуль 14.

1. ping
2. ipconfig
3. show interfaces
4. show ip interface brief

**Ответ:** ipconfig.

**Объяснение:** ipconfig показывает IP-настройки ПК; nslookup проверяет DNS; ping проверяет достижимость шлюза/узла. Каждый инструмент проверяет свою часть, поэтому один успешный тест не доказывает исправность всей сети.

### E783. A technician with a PC is using multiple applications while connected to the Internet. How is the PC able to keep track of the data flow between multiple application sessions and have each application receive the correct packet flows?

Источник: тесты_exam_7, Q50. Тема: модуль 14.

1. The data flow is being tracked based on the destination MAC address of the technician PC.
2. The data flow is being tracked based on the source port number that is used by each application.
3. The data flow is being tracked based on the source IP address that is used by the PC of the technician.
4. The data flow is being tracked based on the destination IP address that is used by the PC of the technician.

**Ответ:** The data flow is being tracked based on the source port number that is used by each application..

**Объяснение:** Транспортный уровень разделяет данные на части и различает разговоры приложений с помощью портов. Мультиплексирование позволяет нескольким приложениям одновременно использовать сеть; TCP дополнительно обеспечивает упорядочивание и надёжность.


## Модуль 15: Прикладные протоколы

### E058. Which functionality is provided by DHCP?

Источник: модули_02, Q11. Тема: модуль 15.

1. Automatic assignment of an IP address to each host
2. Remote switch management
3. Translation of IP addresses to domain names
4. End-to-end connectivity test

**Ответ:** Automatic assignment of an IP address to each host.

**Объяснение:** DHCP автоматически выдаёт IPv4-адрес, маску, шлюз и DNS. Процесс DORA: Discover, Offer, Request, Acknowledge. Первичный Discover обычно broadcast. 169.254.x.x при автоконфигурации часто означает, что DHCP-аренду получить не удалось.

### E067. Which two protocols are service discovery protocols? (Choose two.)

Источник: модули_03, Q2. Тема: модуль 15.

1. DNS
2. TCP
3. SSH
4. DHCP

**Ответ:** DNS; DHCP.

**Объяснение:** Application TCP/IP объединяет OSI application, presentation, session. Application предоставляет протоколы сервисов; presentation — формат/кодирование/сжатие; session — управление диалогом. Поэтому GIF/MPEG относятся к функциям верхних уровней, хотя это не сетевые протоколы вроде HTTP.

### E071. Which two protocols belong in the TCP/IP model application layer?

Источник: модули_03, Q2. Тема: модуль 15.

1. EIGRP
2. DNS
3. OSPF
4. ICMP
5. DHCP

**Ответ:** DNS; DHCP.

**Объяснение:** Application TCP/IP объединяет OSI application, presentation, session. Application предоставляет протоколы сервисов; presentation — формат/кодирование/сжатие; session — управление диалогом. Поэтому GIF/MPEG относятся к функциям верхних уровней, хотя это не сетевые протоколы вроде HTTP.

### E104. A web client is sending a request for a webpage to a web server. From the perspective of the client, what is the correct order of the protocol stack that is used to prepare the request for transmission?

Источник: модули_03, Q15. Тема: модуль 15.

1. HTTP, IP, TCP, Ethernet
2. HTTP, TCP, IP, Ethernet
3. Ethernet, TCP, IP, HTTP
4. Ethernet, IP, TCP, HTTP

**Ответ:** HTTP, TCP, IP, Ethernet.

**Объяснение:** Транспортный уровень создаёт сегменты; сетевой добавляет IP-заголовок. Поэтому на L3 появляются IP-адреса, а PDU становится пакетом.

### E382. This layer of the OSI model is concerned with the protocols that exchange data between programs running on hosts.

Источник: модули_15, Q1. Тема: модуль 15.

1. Application
2. Transport
3. Network
4. Physical

**Ответ:** Application.

**Объяснение:** Application TCP/IP объединяет OSI application, presentation, session. Application предоставляет протоколы сервисов; presentation — формат/кодирование/сжатие; session — управление диалогом. Поэтому GIF/MPEG относятся к функциям верхних уровней, хотя это не сетевые протоколы вроде HTTP.

### E383. MKV, GIF, and JPG standards are associated with which OSI layer?

Источник: модули_15, Q2. Тема: модуль 15.

1. Application
2. Presentation
3. Session
4. Transport

**Ответ:** Presentation.

**Объяснение:** Application TCP/IP объединяет OSI application, presentation, session. Application предоставляет протоколы сервисов; presentation — формат/кодирование/сжатие; session — управление диалогом. Поэтому GIF/MPEG относятся к функциям верхних уровней, хотя это не сетевые протоколы вроде HTTP.

### E384. These three OSI layers define the same functions as the TCP/IP model application layer.

Источник: модули_15, Q3. Тема: модуль 15.

1. Application
2. Presentation
3. Session
4. Transport
5. Network
6. Data link

**Ответ:** Application; Presentation; Session.

**Объяснение:** Application TCP/IP объединяет OSI application, presentation, session. Application предоставляет протоколы сервисов; presentation — формат/кодирование/сжатие; session — управление диалогом. Поэтому GIF/MPEG относятся к функциям верхних уровней, хотя это не сетевые протоколы вроде HTTP.

### E385. Which two are protocols that belong in the OSI application layer?

Источник: модули_15, Q4. Тема: модуль 15.

1. PNG
2. DNS
3. SMTP
4. QuickTime

**Ответ:** DNS; SMTP.

**Объяснение:** Application TCP/IP объединяет OSI application, presentation, session. Application предоставляет протоколы сервисов; presentation — формат/кодирование/сжатие; session — управление диалогом. Поэтому GIF/MPEG относятся к функциям верхних уровней, хотя это не сетевые протоколы вроде HTTP.

### E386. This is a function of the OSI session layer.

Источник: модули_15, Q5. Тема: модуль 15.

1. Compress and decompress data
2. Provide an interface between applications
3. Format data for the application layer
4. Exchange of information to initiate dialog between peers

**Ответ:** Exchange of information to initiate dialog between peers.

**Объяснение:** Application TCP/IP объединяет OSI application, presentation, session. Application предоставляет протоколы сервисов; presentation — формат/кодирование/сжатие; session — управление диалогом. Поэтому GIF/MPEG относятся к функциям верхних уровней, хотя это не сетевые протоколы вроде HTTP.

### E387. True or false? In a peer-to-peer network environment every peer can function as both a client and a server.

Источник: модули_15, Q1. Тема: модуль 15.

1. True
2. False

**Ответ:** True.

**Объяснение:** В client/server клиент инициирует запрос к серверному сервису; загрузка файла на сервер не делает ПК сервером. В P2P узел может и запрашивать, и предоставлять ресурсы без выделенного центра.

### E388. This message type is used when uploading data files to a web server.

Источник: модули_15, Q1. Тема: модуль 15.

1. GET
2. POST
3. PUT

**Ответ:** POST.

**Объяснение:** HTTP использует GET для получения ресурса, POST для отправки данных, PUT для создания/замены ресурса по адресу. Обычный HTTP не шифрует данные; HTTPS защищает HTTP с помощью TLS.

### E389. This protocol is used by a web browser to establish a connection to a web server.

Источник: модули_15, Q2. Тема: модуль 15.

1. HTTP
2. SSL
3. IMAP
4. SMTP

**Ответ:** HTTP.

**Объяснение:** HTTP использует GET для получения ресурса, POST для отправки данных, PUT для создания/замены ресурса по адресу. Обычный HTTP не шифрует данные; HTTPS защищает HTTP с помощью TLS.

### E390. This protocol is used by a client to send email to a mail server.

Источник: модули_15, Q3. Тема: модуль 15.

1. POP
2. SMTP
3. IMAP
4. HTTP

**Ответ:** SMTP.

**Объяснение:** SMTP отправляет почту; POP3 получает сообщения обычно с загрузкой на клиент; IMAP синхронизирует почтовый ящик и сохраняет сообщения на сервере. POP3 также может оставлять копии — удаление зависит от настройки.

### E391. Which is a feature of IMAP?

Источник: модули_15, Q4. Тема: модуль 15.

1. It uploads email messages to a server.
2. It listens passively on port 110 for client requests.
3. It downloads a copy of email messages leaving the original on the server.

**Ответ:** It downloads a copy of email messages leaving the original on the server..

**Объяснение:** SMTP отправляет почту; POP3 получает сообщения обычно с загрузкой на клиент; IMAP синхронизирует почтовый ящик и сохраняет сообщения на сервере. POP3 также может оставлять копии — удаление зависит от настройки.

### E392. True or false? HTTP is a secure protocol.

Источник: модули_15, Q5. Тема: модуль 15.

1. True
2. False

**Ответ:** False.

**Объяснение:** HTTP использует GET для получения ресурса, POST для отправки данных, PUT для создания/замены ресурса по адресу. Обычный HTTP не шифрует данные; HTTPS защищает HTTP с помощью TLS.

### E393. Which of the following DNS record types is used to resolve IPv6 addresses?

Источник: модули_15, Q1. Тема: модуль 15.

1. A
2. NS
3. AAAA
4. MX

**Ответ:** AAAA.

**Объяснение:** DNS сопоставляет имена и записи: A→IPv4, AAAA→IPv6, NS→авторитетный сервер, MX→почтовый сервер. nslookup опрашивает DNS. Запрос вне своей зоны можно переслать/разрешить рекурсивно. DNS использует и UDP, и TCP; TCP применяется не только между серверами.

### E394. True or false? A DNS server that receives a request for a name resolution that is not within its DNS zone will send a failure message to the requesting client.

Источник: модули_15, Q2. Тема: модуль 15.

1. True
2. False

**Ответ:** False.

**Объяснение:** DNS сопоставляет имена и записи: A→IPv4, AAAA→IPv6, NS→авторитетный сервер, MX→почтовый сервер. nslookup опрашивает DNS. Запрос вне своей зоны можно переслать/разрешить рекурсивно. DNS использует и UDP, и TCP; TCP применяется не только между серверами.

### E395. Which of the following is displayed by the nslookup utility?

Источник: модули_15, Q3. Тема: модуль 15.

1. The configured default DNS server
2. The IP address of the end device
3. All cached DNS entries

**Ответ:** The configured default DNS server.

**Объяснение:** DNS сопоставляет имена и записи: A→IPv4, AAAA→IPv6, NS→авторитетный сервер, MX→почтовый сервер. nslookup опрашивает DNS. Запрос вне своей зоны можно переслать/разрешить рекурсивно. DNS использует и UDP, и TCP; TCP применяется не только между серверами.

### E396. Which of the following DNS resource record types resolves authoritative name servers?

Источник: модули_15, Q4. Тема: модуль 15.

1. NS
2. A
3. MX
4. AAAA

**Ответ:** NS.

**Объяснение:** DNS сопоставляет имена и записи: A→IPv4, AAAA→IPv6, NS→авторитетный сервер, MX→почтовый сервер. nslookup опрашивает DNS. Запрос вне своей зоны можно переслать/разрешить рекурсивно. DNS использует и UDP, и TCP; TCP применяется не только между серверами.

### E397. How many connections are required by FTP between client and server?

Источник: модули_15, Q1. Тема: модуль 15.

1. 1
2. 2
3. 3
4. 4

**Ответ:** 2.

**Объяснение:** FTP имеет отдельные управляющее и data-соединения. Управление — TCP 21; в активном FTP сервер использует TCP 20 для data, пассивный режим согласует другой порт. Возможны upload и download.

### E398. True or false? FTP data transfers take place from client to server (push) and from server to client (pull).

Источник: модули_15, Q2. Тема: модуль 15.

1. True
2. False

**Ответ:** True.

**Объяснение:** FTP имеет отдельные управляющее и data-соединения. Управление — TCP 21; в активном FTP сервер использует TCP 20 для data, пассивный режим согласует другой порт. Возможны upload и download.

### E399. Which of these ports are used by FTP? (Choose two.)

Источник: модули_15, Q3. Тема: модуль 15.

1. 20
2. 21
3. 25
4. 110

**Ответ:** 20; 21.

**Объяснение:** FTP имеет отдельные управляющее и data-соединения. Управление — TCP 21; в активном FTP сервер использует TCP 20 для data, пассивный режим согласует другой порт. Возможны upload и download.

### E400. True or false? Resource sharing over SMB is only supported on Microsoft operating systems.

Источник: модули_15, Q4. Тема: модуль 15.

1. True
2. False

**Ответ:** False.

**Объяснение:** SMB предназначен для совместного доступа к файлам/принтерам и поддерживает длительную сессию. Он доступен и вне Windows, например через Samba. FTP в первую очередь переносит файлы.

### E401. On a home network, which device is most likely to provide dynamic IPv4 addressing to clients on the home network?

Источник: модули_15, Q1. Тема: модуль 15.

1. A dedicated file server
2. A home router
3. An ISP DHCP server
4. A DNS server

**Ответ:** A home router.

**Объяснение:** DHCP автоматически выдаёт IPv4-адрес, маску, шлюз и DNS. Процесс DORA: Discover, Offer, Request, Acknowledge. Первичный Discover обычно broadcast. 169.254.x.x при автоконфигурации часто означает, что DHCP-аренду получить не удалось.

### E402. What part of the URL, http://www.cisco.com/index.html, represents the top-level DNS domain?

Источник: модули_15, Q2. Тема: модуль 15.

1. .com
2. Www
3. Http
4. Index

**Ответ:** .com.

**Объяснение:** DNS сопоставляет имена и записи: A→IPv4, AAAA→IPv6, NS→авторитетный сервер, MX→почтовый сервер. nslookup опрашивает DNS. Запрос вне своей зоны можно переслать/разрешить рекурсивно. DNS использует и UDP, и TCP; TCP применяется не только между серверами.

### E403. What are two characteristics of the application layer of the TCP/IP model? (Choose two.)

Источник: модули_15, Q3. Тема: модуль 15.

1. Responsibility for logical addressing
2. Responsibility for physical addressing
3. The creation and maintenance of dialogue between source and destination applications
4. Closest to the end user

**Ответ:** The creation and maintenance of dialogue between source and destination applications; Closest to the end user.

**Объяснение:** Application TCP/IP объединяет OSI application, presentation, session. Application предоставляет протоколы сервисов; presentation — формат/кодирование/сжатие; session — управление диалогом. Поэтому GIF/MPEG относятся к функциям верхних уровней, хотя это не сетевые протоколы вроде HTTP.

### E404. What message type is used by an HTTP client to request data from a web server?

Источник: модули_15, Q4. Тема: модуль 15.

1. GET
2. POST
3. PUT
4. ACK

**Ответ:** GET.

**Объяснение:** HTTP использует GET для получения ресурса, POST для отправки данных, PUT для создания/замены ресурса по адресу. Обычный HTTP не шифрует данные; HTTPS защищает HTTP с помощью TLS.

### E405. Which protocol can be used to transfer messages from an email server to an email client?

Источник: модули_15, Q5. Тема: модуль 15.

1. SMTP
2. POP3
3. SNMP
4. HTTP

**Ответ:** POP3.

**Объяснение:** SMTP отправляет почту; POP3 получает сообщения обычно с загрузкой на клиент; IMAP синхронизирует почтовый ящик и сохраняет сообщения на сервере. POP3 также может оставлять копии — удаление зависит от настройки.

### E406. Which application layer protocol is used to provide file-sharing and print services to Microsoft applications?

Источник: модули_15, Q6. Тема: модуль 15.

1. HTTP
2. SMTP
3. DHCP
4. SMB

**Ответ:** SMB.

**Объяснение:** SMB предназначен для совместного доступа к файлам/принтерам и поддерживает длительную сессию. Он доступен и вне Windows, например через Samba. FTP в первую очередь переносит файлы.

### E407. Which three protocols or standards are used at the application layer of the TCP/IP model? (Choose three.)

Источник: модули_15, Q7. Тема: модуль 15.

1. TCP
2. HTTP
3. MPEG
4. GIF
5. IP
6. UDP

**Ответ:** HTTP; MPEG; GIF.

**Объяснение:** Application TCP/IP объединяет OSI application, presentation, session. Application предоставляет протоколы сервисов; presentation — формат/кодирование/сжатие; session — управление диалогом. Поэтому GIF/MPEG относятся к функциям верхних уровней, хотя это не сетевые протоколы вроде HTTP.

### E408. Why is DHCP for IPv4 preferred for use on large networks?

Источник: модули_15, Q8. Тема: модуль 15.

1. Large networks send more requests for domain to IP address resolution than do smaller networks.
2. DHCP uses a reliable transport layer protocol.
3. It prevents sharing of files that are copyrighted.
4. It is a more efficient way to manage IPv4 addresses than static address assignment is.
5. Hosts on large networks require more IPv4 addressing configuration settings than do hosts on small networks.

**Ответ:** It is a more efficient way to manage IPv4 addresses than static address assignment is..

**Объяснение:** DHCP автоматически выдаёт IPv4-адрес, маску, шлюз и DNS. Процесс DORA: Discover, Offer, Request, Acknowledge. Первичный Discover обычно broadcast. 169.254.x.x при автоконфигурации часто означает, что DHCP-аренду получить не удалось.

### E409. An author is uploading one chapter document from a personal computer to a file server of a book publisher. What role is the personal computer assuming in this network model?

Источник: модули_15, Q9. Тема: модуль 15.

1. Client
2. Agent
3. Server
4. Controller
5. Transient

**Ответ:** Client.

**Объяснение:** В client/server клиент инициирует запрос к серверному сервису; загрузка файла на сервер не делает ПК сервером. В P2P узел может и запрашивать, и предоставлять ресурсы без выделенного центра.

### E410. Which statement is true about FTP?

Источник: модули_15, Q10. Тема: модуль 15.

1. The client can choose if FTP is going to establish one or two connections with the server.
2. The client can download data from or upload data to the server.
3. FTP is a peer-to-peer application.
4. FTP does not provide reliability during data transmission.

**Ответ:** The client can download data from or upload data to the server..

**Объяснение:** FTP имеет отдельные управляющее и data-соединения. Управление — TCP 21; в активном FTP сервер использует TCP 20 для data, пассивный режим согласует другой порт. Возможны upload и download.

### E411. A wireless host needs to request an IPv4 address. What protocol would be used to process the request?

Источник: модули_15, Q11. Тема: модуль 15.

1. FTP
2. HTTP
3. DHCP
4. ICMP
5. SNMP

**Ответ:** DHCP.

**Объяснение:** DHCP автоматически выдаёт IPv4-адрес, маску, шлюз и DNS. Процесс DORA: Discover, Offer, Request, Acknowledge. Первичный Discover обычно broadcast. 169.254.x.x при автоконфигурации часто означает, что DHCP-аренду получить не удалось.

### E412. Which TCP/IP model layer is closest to the end user?

Источник: модули_15, Q12. Тема: модуль 15.

1. Application
2. Internet
3. Network access
4. Transport

**Ответ:** Application.

**Объяснение:** Application TCP/IP объединяет OSI application, presentation, session. Application предоставляет протоколы сервисов; presentation — формат/кодирование/сжатие; session — управление диалогом. Поэтому GIF/MPEG относятся к функциям верхних уровней, хотя это не сетевые протоколы вроде HTTP.

### E413. When retrieving email messages, which protocol allows for easy, centralized storage and backup of emails that would be desirable for a small- to medium-sized business?

Источник: модули_15, Q13. Тема: модуль 15.

1. IMAP
2. POP
3. SMTP
4. HTTPS

**Ответ:** IMAP.

**Объяснение:** SMTP отправляет почту; POP3 получает сообщения обычно с загрузкой на клиент; IMAP синхронизирует почтовый ящик и сохраняет сообщения на сервере. POP3 также может оставлять копии — удаление зависит от настройки.

### E414. Which protocol uses encryption?

Источник: модули_15, Q14. Тема: модуль 15.

1. DHCP
2. DNS
3. FTP
4. HTTPS

**Ответ:** HTTPS.

**Объяснение:** HTTP использует GET для получения ресурса, POST для отправки данных, PUT для создания/замены ресурса по адресу. Обычный HTTP не шифрует данные; HTTPS защищает HTTP с помощью TLS.

### E415. Which two tasks can be performed by a local DNS server? (Choose two.)

Источник: модули_15, Q15. Тема: модуль 15.

1. Providing IP addresses to local hosts
2. Allowing data transfer between two network devices
3. Mapping name-to-IP addresses for internal hosts
4. Forwarding name resolution requests between servers
5. Retrieving email messages

**Ответ:** Mapping name-to-IP addresses for internal hosts; Forwarding name resolution requests between servers.

**Объяснение:** DNS сопоставляет имена и записи: A→IPv4, AAAA→IPv6, NS→авторитетный сервер, MX→почтовый сервер. nslookup опрашивает DNS. Запрос вне своей зоны можно переслать/разрешить рекурсивно. DNS использует и UDP, и TCP; TCP применяется не только между серверами.

### E455. What are two forms of software programs or processes that provide access to the network? (Choose two.)

Источник: модули_17, Q1. Тема: модуль 15.

1. Antivirus software
2. Application layer services
3. Gaming software
4. Network applications
5. Productivity software
6. Virtual machine software

**Ответ:** Application layer services; Network applications.

**Объяснение:** Сетевое приложение обращается к сети непосредственно; сервис прикладного уровня обеспечивает сетевую функцию для приложений. Оба относятся к способам использования сети программами.

### E472. Which process failed if a computer cannot access the internet and received an IP address of 169.254.142.5?

Источник: модули_17, Q9. Тема: модуль 15.

1. IP
2. DNS
3. DHCP
4. HTTP

**Ответ:** DHCP.

**Объяснение:** DHCP автоматически выдаёт IPv4-адрес, маску, шлюз и DNS. Процесс DORA: Discover, Offer, Request, Acknowledge. Первичный Discover обычно broadcast. 169.254.x.x при автоконфигурации часто означает, что DHCP-аренду получить не удалось.

### E534. What three application layer protocols are part of the TCP/IP protocol suite? (Choose three.)

Источник: тесты_exam_0, Q23. Тема: модуль 15.

1. ARP
2. DHCP
3. DNS
4. FTP
5. NAT
6. PPP

**Ответ:** DHCP; DNS; FTP.

**Объяснение:** Application TCP/IP объединяет OSI application, presentation, session. Application предоставляет протоколы сервисов; presentation — формат/кодирование/сжатие; session — управление диалогом. Поэтому GIF/MPEG относятся к функциям верхних уровней, хотя это не сетевые протоколы вроде HTTP.

### E536. A web client is receiving a response for a web page from a web server. From the perspective of the client, what is the correct order of the protocol stack that is used to decode the received transmission?

Источник: тесты_exam_0, Q25. Тема: модуль 15.

1. Ethernet, IP, TCP, HTTP
2. HTTP, TCP, IP, Ethernet
3. Ethernet, TCP, IP, HTTP
4. HTTP, Ethernet, IP, TCP

**Ответ:** Ethernet, IP, TCP, HTTP.

**Объяснение:** Транспортный уровень создаёт сегменты; сетевой добавляет IP-заголовок. Поэтому на L3 появляются IP-адреса, а PDU становится пакетом.

### E615. Which three statements characterize UDP? (Choose three.)

Источник: тесты_exam_4, Q4. Тема: модуль 15.

1. UDP provides basic connectionless transport layer functions.
2. UDP provides connection-oriented, fast transport of data at Layer 3.
3. UDP relies on application layer protocols for error detection.
4. UDP is a low overhead protocol that does not provide sequencing or flow control mechanisms.
5. UDP relies on IP for error detection and recovery.
6. UDP provides sophisticated flow control mechanisms.

**Ответ в курсе; см. уточнение ниже:** UDP — connectionless; имеет небольшие накладные расходы; не обеспечивает sequencing/flow control. Утверждение об исключительно прикладном error detection неточно: у UDP есть checksum.

**Объяснение:** В отображённой попытке: UDP provides basic connectionless transport layer functions.; UDP relies on application layer protocols for error detection.; UDP is a low overhead protocol that does not provide sequencing or flow control mechanisms.. UDP не устанавливает соединение, не подтверждает доставку и не делает повторных передач или упорядочивания. Это уменьшает накладные расходы; подходит для real-time и простых запросов. Checksum обнаруживает повреждения, но не восстанавливает данные.

### E618. Which protocol or service uses UDP for a client-to-server communication and TCP for server-to-server communication?

Источник: тесты_exam_4, Q7. Тема: модуль 15.

1. HTTP
2. FTP
3. DNS
4. SMTP

**Ответ:** DNS.

**Объяснение:** DNS сопоставляет имена и записи: A→IPv4, AAAA→IPv6, NS→авторитетный сервер, MX→почтовый сервер. nslookup опрашивает DNS. Запрос вне своей зоны можно переслать/разрешить рекурсивно. DNS использует и UDP, и TCP; TCP применяется не только между серверами.

### E623. Why does HTTP use TCP as the transport layer protocol?

Источник: тесты_exam_4, Q12. Тема: модуль 15.

1. to ensure the fastest possible download speed
2. because HTTP is a best-effort protocol
3. because transmission errors can be tolerated easily
4. because HTTP requires reliable delivery

**Ответ:** because HTTP requires reliable delivery.

**Объяснение:** TCP устанавливает соединение и передаёт надёжный упорядоченный поток байтов. Потерю компенсирует повторная передача, получение подтверждается ACK. Классические FTP и HTTP в этом курсе используют TCP; HTTP/3 — отдельный современный случай поверх QUIC/UDP.

### E626. What do the client/server and peer-to-peer network models have in common?

Источник: тесты_exam_4, Q15. Тема: модуль 15.

1. Both models have dedicated servers.
2. Both models support devices in server and client roles.
3. Both models require the use of TCP/IP-based protocols.
4. Both models are used only in the wired network environment.

**Ответ:** Both models support devices in server and client roles..

**Объяснение:** В client/server клиент инициирует запрос к серверному сервису; загрузка файла на сервер не делает ПК сервером. В P2P узел может и запрашивать, и предоставлять ресурсы без выделенного центра.

### E627. What is an example of network communication that uses the client-server model?

Источник: тесты_exam_4, Q16. Тема: модуль 15.

1. A user uses eMule to download a file that is shared by a friend after the file location is determined.
2. A workstation initiates an ARP to find the MAC address of a receiving host.
3. A user prints a document by using a printer that is attached to a workstation of a coworker.
4. A workstation initiates a DNS request when the user types www.cisco.com in the address bar of a web browser.

**Ответ:** A workstation initiates a DNS request when the user types www.cisco.com in the address bar of a web browser..

**Объяснение:** В client/server клиент инициирует запрос к серверному сервису; загрузка файла на сервер не делает ПК сервером. В P2P узел может и запрашивать, и предоставлять ресурсы без выделенного центра.

### E628. Which networking model is being used when an author uploads one chapter document to a file server of a book publisher?

Источник: тесты_exam_4, Q17. Тема: модуль 15.

1. peer-to-peer
2. master-slave
3. client/server
4. point-to-point

**Ответ:** client/server.

**Объяснение:** В client/server клиент инициирует запрос к серверному сервису; загрузка файла на сервер не делает ПК сервером. В P2P узел может и запрашивать, и предоставлять ресурсы без выделенного центра.

### E629. What are two characteristics of peer-to-peer networks? (Choose two.)

Источник: тесты_exam_4, Q18. Тема: модуль 15.

1. scalability
2. one way data flow
3. decentralized resources
4. centralized user accounts
5. resource sharing without a dedicated server

**Ответ:** decentralized resources; resource sharing without a dedicated server.

**Объяснение:** В client/server клиент инициирует запрос к серверному сервису; загрузка файла на сервер не делает ПК сервером. В P2P узел может и запрашивать, и предоставлять ресурсы без выделенного центра.

### E630. What type of information is contained in a DNS MX record?

Источник: тесты_exam_4, Q19. Тема: модуль 15.

1. the FQDN of the alias used to identify a service
2. the IP address for an FQDN entry
3. the domain name mapped to mail exchange servers
4. the IP address of an authoritative name server

**Ответ:** the domain name mapped to mail exchange servers.

**Объяснение:** DNS сопоставляет имена и записи: A→IPv4, AAAA→IPv6, NS→авторитетный сервер, MX→почтовый сервер. nslookup опрашивает DNS. Запрос вне своей зоны можно переслать/разрешить рекурсивно. DNS использует и UDP, и TCP; TCP применяется не только между серверами.

### E631. In what networking model would eDonkey, eMule, BitTorrent, Bitcoin, and LionShare be used?

Источник: тесты_exam_4, Q20. Тема: модуль 15.

1. peer-to-peer
2. client-based
3. master-slave
4. point-to-point

**Ответ:** peer-to-peer.

**Объяснение:** В client/server клиент инициирует запрос к серверному сервису; загрузка файла на сервер не делает ПК сервером. В P2P узел может и запрашивать, и предоставлять ресурсы без выделенного центра.

### E632. Which applications or services allow hosts to act as client and server at the same time?

Источник: тесты_exam_4, Q21. Тема: модуль 15.

1. client/server applications
2. email applications
3. P2P applications
4. authentication services

**Ответ:** P2P applications.

**Объяснение:** В client/server клиент инициирует запрос к серверному сервису; загрузка файла на сервер не делает ПК сервером. В P2P узел может и запрашивать, и предоставлять ресурсы без выделенного центра.

### E633. What is the function of the HTTP GET message?

Источник: тесты_exam_4, Q22. Тема: модуль 15.

1. to request an HTML page from a web server
2. to send error information from a web server to a web client
3. to upload content to a web server from a web client
4. to retrieve client email from an email server using TCP port 110

**Ответ:** to request an HTML page from a web server.

**Объяснение:** HTTP использует GET для получения ресурса, POST для отправки данных, PUT для создания/замены ресурса по адресу. Обычный HTTP не шифрует данные; HTTPS защищает HTTP с помощью TLS.

### E636. Which application layer protocol uses message types such as GET, PUT, and POST?

Источник: тесты_exam_4, Q25. Тема: модуль 15.

1. DNS
2. DHCP
3. SMTP
4. HTTP
5. POP3

**Ответ:** HTTP.

**Объяснение:** HTTP использует GET для получения ресурса, POST для отправки данных, PUT для создания/замены ресурса по адресу. Обычный HTTP не шифрует данные; HTTPS защищает HTTP с помощью TLS.

### E637. What is an advantage of SMB over FTP?

Источник: тесты_exam_4, Q26. Тема: модуль 15.

1. Only with SMB can data transfers occur in both directions.
2. Only SMB establishes two simultaneous connections with the client, making the data transfer faster.
3. SMB is more reliable than FTP because SMB uses TCP and FTP uses UDP.
4. SMB clients can establish a long-term connection to the server.

**Ответ:** SMB clients can establish a long-term connection to the server..

**Объяснение:** SMB предназначен для совместного доступа к файлам/принтерам и поддерживает длительную сессию. Он доступен и вне Windows, например через Samba. FTP в первую очередь переносит файлы.

### E638. Which protocol is used by a client to communicate securely with a web server?

Источник: тесты_exam_4, Q27. Тема: модуль 15.

1. SMTP
2. SMB
3. IMAP
4. HTTPS

**Ответ:** HTTPS.

**Объяснение:** HTTP использует GET для получения ресурса, POST для отправки данных, PUT для создания/замены ресурса по адресу. Обычный HTTP не шифрует данные; HTTPS защищает HTTP с помощью TLS.

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

**Объяснение:** Application TCP/IP объединяет OSI application, presentation, session. Application предоставляет протоколы сервисов; presentation — формат/кодирование/сжатие; session — управление диалогом. Поэтому GIF/MPEG относятся к функциям верхних уровней, хотя это не сетевые протоколы вроде HTTP.

### E640. Which three layers of the OSI model provide similar network services to those provided by the application layer of the TCP/IP model? (Choose three.)

Источник: тесты_exam_4, Q29. Тема: модуль 15.

1. physical layer
2. session layer
3. transport layer
4. application layer
5. presentation layer
6. data link layer

**Ответ:** session layer; application layer; presentation layer.

**Объяснение:** Application TCP/IP объединяет OSI application, presentation, session. Application предоставляет протоколы сервисов; presentation — формат/кодирование/сжатие; session — управление диалогом. Поэтому GIF/MPEG относятся к функциям верхних уровней, хотя это не сетевые протоколы вроде HTTP.

### E670. An employee complains that a Windows PC cannot connect to the Internet. A network technician issues the ipconfig command on the PC and is shown an IP address of 169.254.10.3. Which two conclusions can be drawn? (Choose two.)

Источник: тесты_exam_5, Q27. Тема: модуль 15.

1. The PC cannot contact a DHCP server.
2. The DNS server address is misconfigured.
3. The default gateway address is not configured.
4. The PC is configured to obtain an IP address automatically.
5. The enterprise network is misconfigured for dynamic routing.

**Ответ:** The PC cannot contact a DHCP server.; The PC is configured to obtain an IP address automatically..

**Объяснение:** DHCP автоматически выдаёт IPv4-адрес, маску, шлюз и DNS. Процесс DORA: Discover, Offer, Request, Acknowledge. Первичный Discover обычно broadcast. 169.254.x.x при автоконфигурации часто означает, что DHCP-аренду получить не удалось.

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

**Объяснение:** Application TCP/IP объединяет OSI application, presentation, session. Application предоставляет протоколы сервисов; presentation — формат/кодирование/сжатие; session — управление диалогом. Поэтому GIF/MPEG относятся к функциям верхних уровней, хотя это не сетевые протоколы вроде HTTP.

### E720. What service is provided by POP3?

Источник: тесты_exam_6, Q42. Тема: модуль 15.

1. Retrieves email from the server by downloading the email to the local mail application of the client.
2. Allows remote access to network devices and servers.
3. Uses encryption to provide secure remote access to network devices and servers.
4. An application that allows real-time chatting among remote users.

**Ответ:** Retrieves email from the server by downloading the email to the local mail application of the client..

**Объяснение:** SMTP отправляет почту; POP3 получает сообщения обычно с загрузкой на клиент; IMAP синхронизирует почтовый ящик и сохраняет сообщения на сервере. POP3 также может оставлять копии — удаление зависит от настройки.

### E721. Two students are working on a network design project. One student is doing the drawing, while the other student is writing the proposal. The drawing is finished and the student wants to share the folder that contains the drawing so that the other student can access the file and copy it to a USB drive. Which networking model is being used?

Источник: тесты_exam_6, Q43. Тема: модуль 15.

1. peer-to-peer
2. client-based
3. master-slave
4. point-to-point

**Ответ:** peer-to-peer.

**Объяснение:** В client/server клиент инициирует запрос к серверному сервису; загрузка файла на сервер не делает ПК сервером. В P2P узел может и запрашивать, и предоставлять ресурсы без выделенного центра.

### E722. Which command is used to manually query a DNS server to resolve a specific host name?

Источник: тесты_exam_6, Q44. Тема: модуль 15.

1. nslookup
2. ipconfig /displaydns
3. tracert
4. net

**Ответ:** nslookup.

**Объяснение:** DNS сопоставляет имена и записи: A→IPv4, AAAA→IPv6, NS→авторитетный сервер, MX→почтовый сервер. nslookup опрашивает DNS. Запрос вне своей зоны можно переслать/разрешить рекурсивно. DNS использует и UDP, и TCP; TCP применяется не только между серверами.

### E760. Match the application protocols to the correct transport protocols. FTP TCP HTTP SMTP DHCP UDP TFTP

Источник: тесты_exam_7, Q27. Тема: модуль 15.

**Ответ:** TCP → FTP, HTTP, SMTP; UDP → DHCP, TFTP.

**Объяснение:** TCP устанавливает соединение и передаёт надёжный упорядоченный поток байтов. Потерю компенсирует повторная передача, получение подтверждается ACK. Классические FTP и HTTP в этом курсе используют TCP; HTTP/3 — отдельный современный случай поверх QUIC/UDP.

### E772. A wired laser printer is attached to a home computer. That printer has been shared so that other computers on the home network can also use the printer. What networking model is in use?

Источник: тесты_exam_7, Q39. Тема: модуль 15.

1. peer-to-peer (P2P)
2. client-based
3. master-slave
4. point-to-point

**Ответ:** peer-to-peer (P2P).

**Объяснение:** В client/server клиент инициирует запрос к серверному сервису; загрузка файла на сервер не делает ПК сервером. В P2P узел может и запрашивать, и предоставлять ресурсы без выделенного центра.

### E776. What is an advantage for small organizations of adopting IMAP instead of POP?

Источник: тесты_exam_7, Q43. Тема: модуль 15.

1. Messages are kept in the mail servers until they are manually deleted from the email client.
2. When the user connects to a POP server, copies of the messages are kept in the mail server for a short time, but IMAP keeps them for a long time.
3. IMAP sends and retrieves email, but POP only retrieves email.
4. POP only allows the client to store messages in a centralized way, while IMAP allows distributed storage.

**Ответ:** Messages are kept in the mail servers until they are manually deleted from the email client..

**Объяснение:** SMTP отправляет почту; POP3 получает сообщения обычно с загрузкой на клиент; IMAP синхронизирует почтовый ящик и сохраняет сообщения на сервере. POP3 также может оставлять копии — удаление зависит от настройки.

### E778. Which three layers of the OSI model map to the application layer of the TCP/IP model? (Choose three.)

Источник: тесты_exam_7, Q45. Тема: модуль 15.

1. application
2. presentation
3. session
4. data link
5. transport
6. network

**Ответ:** application; presentation; session.

**Объяснение:** Application TCP/IP объединяет OSI application, presentation, session. Application предоставляет протоколы сервисов; presentation — формат/кодирование/сжатие; session — управление диалогом. Поэтому GIF/MPEG относятся к функциям верхних уровней, хотя это не сетевые протоколы вроде HTTP.

### E784. Which two protocols operate at the top layer of the TCP/IP protocol suite? (Choose two.)

Источник: тесты_exam_7, Q51. Тема: модуль 15.

1. DNS
2. Ethernet
3. IP
4. POP
5. TCP
6. UDP

**Ответ:** DNS; POP.

**Объяснение:** Application TCP/IP объединяет OSI application, presentation, session. Application предоставляет протоколы сервисов; presentation — формат/кодирование/сжатие; session — управление диалогом. Поэтому GIF/MPEG относятся к функциям верхних уровней, хотя это не сетевые протоколы вроде HTTP.

### E790. A client packet is received by a server. The packet has a destination port number of 67. What service is the client requesting?

Источник: тесты_exam_7, Q57. Тема: модуль 15.

1. DHCP
2. FTP
3. SSH
4. Telnet

**Ответ:** DHCP.

**Объяснение:** Well-known/system ports: 0–1023; registered: 1024–49151; dynamic/private: 49152–65535. netstat показывает соединения и порты. Telnet = TCP 23, SSH = TCP 22, DHCP server = UDP 67.

### E791. What service is provided by HTTPS?

Источник: тесты_exam_7, Q58. Тема: модуль 15.

1. Uses encryption to secure the exchange of text, graphic images, sound, and video on the web.
2. Uses encryption to provide secure remote access to network devices and servers.
3. Resolves domain names, such as cisco.com, into IP addresses.
4. Allows remote access to network devices and servers.

**Ответ:** Uses encryption to secure the exchange of text, graphic images, sound, and video on the web..

**Объяснение:** HTTP использует GET для получения ресурса, POST для отправки данных, PUT для создания/замены ресурса по адресу. Обычный HTTP не шифрует данные; HTTPS защищает HTTP с помощью TLS.


## Модуль 16: Безопасность сети

### E012. Confidentiality, integrity, and availability are requirements of which of the four basic characteristics of network architecture?

Источник: модули_01, Q2. Тема: модуль 16.

1. Fault tolerance
2. Scalability
3. QoS
4. Security

**Ответ:** Security.

**Объяснение:** Информационная безопасность объединяет confidentiality (доступ только уполномоченным), integrity (целостность) и availability (доступность для законных пользователей).

### E020. Which option describes malicious code running on user devices?

Источник: модули_01, Q1. Тема: модуль 16.

1. Firewall
2. Virus, worm, or Trojan horse
3. Zero-day or Zero-hour
4. Virtual Private Network (VPN)
5. Denial of Service (DoS)

**Ответ:** Virus, worm, or Trojan horse.

**Объяснение:** Malware — вредоносное ПО. Trojan маскируется под полезную программу, spyware собирает сведения, worm самостоятельно распространяется, virus внедряется в другой объект и размножается при его запуске. Фраза «вирусы не размножаются» неверна: они не распространяются автономно как worm.

### E021. During a routine inspection, a technician discovered that software that was installed on a computer was secretly collecting data about websites that were visited by users of the computer. Which type of threat is affecting this computer?

Источник: модули_01, Q1. Тема: модуль 16.

1. DoS attack
2. Identity theft
3. Spyware
4. Zero-day attack

**Ответ:** Spyware.

**Объяснение:** Malware — вредоносное ПО. Trojan маскируется под полезную программу, spyware собирает сведения, worm самостоятельно распространяется, virus внедряется в другой объект и размножается при его запуске. Фраза «вирусы не размножаются» неверна: они не распространяются автономно как worm.

### E033. An employee wants to access the network of the organization remotely, in the safest possible way. What network feature would allow an employee to gain secure remote access to a company network?

Источник: модули_01, Q13. Тема: модуль 16.

1. ACL
2. IPS
3. VPN
4. BYOD

**Ответ:** VPN.

**Объяснение:** VPN создаёт защищённое логическое соединение через другую сеть. Обычно использует туннелирование и криптографическую защиту; название VPN обозначает технологию/решение, а не один конкретный протокол.

### E042. Which command enables password authentication for user EXEC mode access on a switch?

Источник: модули_02, Q3. Тема: модуль 16.

1. enable secret
2. login
3. secret
4. service password-encryption

**Ответ:** login.

**Объяснение:** Пароль линии задают в line console 0 или line vty. password задаёт значение, login включает проверку пароля этой линии. login local вместо этого использует локальную базу username.

### E043. Which command encrypts all plaintext passwords access on a switch?

Источник: модули_02, Q4. Тема: модуль 16.

1. enable secret
2. login
3. secret
4. service password-encryption

**Ответ:** service password-encryption.

**Объяснение:** service password-encryption скрывает поддерживаемые открытые пароли в конфигурации. В классическом IOS это слабая обратимая Type 7, не надёжная защита и не шифрование трафика. Для привилегированного доступа используют enable secret.

### E054. A router with a valid operating system contains a configuration file stored in NVRAM. The configuration file has an enable secret password but no console password. When the router boots up, which mode will display?

Источник: модули_02, Q7. Тема: модуль 16.

1. Global configuration mode
2. Setup mode
3. Privileged EXEC mode
4. User EXEC mode

**Ответ:** User EXEC mode.

**Объяснение:** running-config действует сейчас в RAM; startup-config используется при загрузке. copy running-config startup-config сохраняет изменения. Настройка обычно начинает действовать сразу; несохранённые изменения пропадут после reload без сохранения.

### E416. What kind of threat is described when a threat actor sends you a virus that can reformat your hard drive?

Источник: модули_16, Q1. Тема: модуль 16.

1. Data loss or manipulation
2. Disruption of service
3. Identify theft
4. Information theft

**Ответ:** Data loss or manipulation.

**Объяснение:** Различайте результат угрозы: уничтожение/изменение данных — data loss/manipulation; присвоение личности — identity theft; кража сведений — information theft; недоступность сервиса — disruption of service.

### E417. What kind of threat is described when a threat actor makes illegal online purchases using stolen credit information?

Источник: модули_16, Q2. Тема: модуль 16.

1. Data loss or manipulation
2. Disruption of service
3. Identify theft
4. Information theft

**Ответ:** Identify theft.

**Объяснение:** Различайте результат угрозы: уничтожение/изменение данных — data loss/manipulation; присвоение личности — identity theft; кража сведений — information theft; недоступность сервиса — disruption of service.

### E418. What kind of threat is described when a threat actor prevents legal users from accessing data services?

Источник: модули_16, Q3. Тема: модуль 16.

1. Data loss or manipulation
2. Disruption of service
3. Identify theft
4. Information theft

**Ответ:** Disruption of service.

**Объяснение:** Различайте результат угрозы: уничтожение/изменение данных — data loss/manipulation; присвоение личности — identity theft; кража сведений — information theft; недоступность сервиса — disruption of service.

### E419. What kind of threat is described when a threat actor steals scientific research data?

Источник: модули_16, Q4. Тема: модуль 16.

1. Data loss or manipulation
2. Disruption of service
3. Identify theft
4. Information theft

**Ответ:** Information theft.

**Объяснение:** Различайте результат угрозы: уничтожение/изменение данных — data loss/manipulation; присвоение личности — identity theft; кража сведений — information theft; недоступность сервиса — disruption of service.

### E420. What kind of threat is described when a threat actor overloads a network to deny other users network access?

Источник: модули_16, Q5. Тема: модуль 16.

1. Data loss or manipulation
2. Disruption of service
3. Identify theft
4. Information theft

**Ответ:** Disruption of service.

**Объяснение:** Различайте результат угрозы: уничтожение/изменение данных — data loss/manipulation; присвоение личности — identity theft; кража сведений — information theft; недоступность сервиса — disruption of service.

### E421. What kind of threat is described when a threat actor alters data records?

Источник: модули_16, Q6. Тема: модуль 16.

1. Data loss or manipulation
2. Disruption of service
3. Identify theft
4. Information theft

**Ответ:** Data loss or manipulation.

**Объяснение:** Различайте результат угрозы: уничтожение/изменение данных — data loss/manipulation; присвоение личности — identity theft; кража сведений — information theft; недоступность сервиса — disruption of service.

### E422. What kind of threat is described when a threat actor is stealing the user database of a company?

Источник: модули_16, Q7. Тема: модуль 16.

1. Data loss or manipulation
2. Disruption of service
3. Identify theft
4. Information theft

**Ответ:** Information theft.

**Объяснение:** Различайте результат угрозы: уничтожение/изменение данных — data loss/manipulation; присвоение личности — identity theft; кража сведений — information theft; недоступность сервиса — disruption of service.

### E423. What kind of threat is described when a threat actor impersonates another person to obtain credit information about that person?

Источник: модули_16, Q8. Тема: модуль 16.

1. Data loss or manipulation
2. Disruption of service
3. Identify theft
4. Information theft

**Ответ:** Identify theft.

**Объяснение:** Различайте результат угрозы: уничтожение/изменение данных — data loss/manipulation; присвоение личности — identity theft; кража сведений — information theft; недоступность сервиса — disruption of service.

### E424. Angela, an IT staff member at ACME Inc., notices that communication with the company’s web server is very slow. After investigating, she determines that the cause of the slow response is a computer on the internet sending a very large number of malformed web requests to ACME’S web server. What type of attack is described in this scenario?

Источник: модули_16, Q1. Тема: модуль 16.

1. Access attack
2. Denial of service (DoS) attack
3. Malware attack
4. Reconnaissance attack

**Ответ:** Denial of service (DoS) attack.

**Объяснение:** DoS истощает ресурсы или нарушает работу сервиса, лишая законных пользователей доступа. DDoS отличается множеством источников. В сценарии важен эффект отказа, а не только наличие вредоносного кода.

### E425. George needed to share a video with a co-worker. Because of the large size of the video file, he decided to run a simple FTP server on his workstation to serve the video file to his co-worker. To make things easier, George created an account with the simple password of “file” and provided it to his co-worker on Friday. Without the proper security measures or a strong password, the IT staff was not surprised to learn on Monday that George’s workstation had been compromised and was trying to upload work related documents to the internet. What type of attack is described in this scenario?

Источник: модули_16, Q2. Тема: модуль 16.

1. Access attack
2. Denial of service (DoS) attack
3. Malware attack
4. Reconnaissance attack

**Ответ:** Access attack.

**Объяснение:** Слабый пароль открывает неавторизованный доступ к сервису: это access attack. Наличие FTP само по себе ещё не доказывает DoS или разведку.

### E426. Jeremiah was browsing the internet from his personal computer when a random website offered a free program to clean his system. After the executable was downloaded and running, the operating system crashed. Crucial operating system related files had been corrupted and Jeremiah’s computer required a full disk format and operating system re-installation. What type of attack is described in this scenario?

Источник: модули_16, Q3. Тема: модуль 16.

1. Access attack
2. Denial of service (DoS) attack
3. Malware attack
4. Reconnaissance attack

**Ответ:** Malware attack.

**Объяснение:** Malware — вредоносное ПО. Trojan маскируется под полезную программу, spyware собирает сведения, worm самостоятельно распространяется, virus внедряется в другой объект и размножается при его запуске. Фраза «вирусы не размножаются» неверна: они не распространяются автономно как worm.

### E427. Arianna found a flash drive lying on the pavement of a mall parking lot. She asked around but could not find the owner. She decided to keep it and plugged it into her laptop, only to find a photo folder. Feeling curious, Arianna opened a few photos before formatting the flash drive for her own use. Afterwards, Arianna noticed that her laptop camera was active. What type of attack is described in this scenario?

Источник: модули_16, Q4. Тема: модуль 16.

1. Access attack
2. Denial of service (DoS) attack
3. Malware attack
4. Reconnaissance attack

**Ответ:** Malware attack.

**Объяснение:** Malware — вредоносное ПО. Trojan маскируется под полезную программу, spyware собирает сведения, worm самостоятельно распространяется, virus внедряется в другой объект и размножается при его запуске. Фраза «вирусы не размножаются» неверна: они не распространяются автономно как worm.

### E428. A computer is used as a print server for ACME Inc. The IT staff failed to apply security updates to this computer for over 60 days. Now the print server is operating slowly, and sending a high number of malicious packets to its NIC. What type of attack is described in this scenario?

Источник: модули_16, Q5. Тема: модуль 16.

1. Access attack
2. Denial of service (DoS) attack
3. Malware attack
4. Reconnaissance attack

**Ответ:** Denial of service (DoS) attack.

**Объяснение:** DoS истощает ресурсы или нарушает работу сервиса, лишая законных пользователей доступа. DDoS отличается множеством источников. В сценарии важен эффект отказа, а не только наличие вредоносного кода.

### E429. Sharon, an IT intern at ACME Inc., noticed some strange packets while revising the security logs generated by the firewall. A handful of IP addresses on the internet were sending malformed packets to several different IP addresses, at several different random port numbers inside ACME Inc. What type of attack is described in this scenario?

Источник: модули_16, Q6. Тема: модуль 16.

1. Access attack
2. Denial of service (DoS) attack
3. Malware attack
4. Reconnaissance attack

**Ответ:** Reconnaissance attack.

**Объяснение:** Reconnaissance — сбор сведений перед атакой: сканирование адресов/портов, DNS-запросы, обнаружение систем. Сами nslookup и ping легальны; классификация зависит от цели использования.

### E430. Which device controls traffic between two or more networks to help prevent unauthorized access?

Источник: модули_16, Q1. Тема: модуль 16.

1. AAA Server
2. Firewall
3. ESA/WSA
4. IPS

**Ответ:** Firewall.

**Объяснение:** Firewall разрешает/запрещает трафик по правилам; stateful firewall учитывает состояние соединений. Пакетные фильтры анализируют IP и порты; application-aware системы умеют глубже. Многоуровневая защита сочетает разные средства, а не полагается на одно.

### E431. Which device is used by other network devices to authenticate and authorize management access?

Источник: модули_16, Q2. Тема: модуль 16.

1. AAA Server
2. Firewall
3. ESA/WSA
4. IPS

**Ответ:** AAA Server.

**Объяснение:** AAA: Authentication — кто вы; Authorization — что разрешено; Accounting — что вы сделали. Разные права Read/Edit — authorization; журнал действий — accounting.

### E432. Which backup policy consideration is concerned with using strong passwords to protect the backups and for restoring data?

Источник: модули_16, Q3. Тема: модуль 16.

1. Frequency
2. Storage
3. Security
4. Validation

**Ответ:** Security.

**Объяснение:** Защита резервных копий включает контроль доступа и секреты, нужные для восстановления. Вопрос о паролях относится к security, а не к частоте или месту хранения backup.

### E433. This zone is used to house servers that should be accessible to outside users.

Источник: модули_16, Q4. Тема: модуль 16.

1. Inside
2. Outside
3. Internet
4. DMZ

**Ответ:** DMZ.

**Объяснение:** DMZ — отдельный сегмент для публично доступных серверов. Его изолируют от внутренней сети, чтобы компрометация веб-сервера не давала прямого доступа ко всем внутренним ресурсам.

### E434. Which is appropriate for providing endpoint security?

Источник: модули_16, Q5. Тема: модуль 16.

1. A AAA server
2. Antivirus software
3. A server-based firewall
4. An ESA/WSA

**Ответ:** Antivirus software.

**Объяснение:** Антивирус на конечном устройстве — endpoint protection. Он дополняет обновления, права пользователей и сетевую защиту, а не заменяет их.

### E435. Which component is designed to protect against unauthorized communications to and from a computer?

Источник: модули_16, Q1. Тема: модуль 16.

1. Security center
2. Port scanner
3. Antimalware
4. Antivirus
5. Firewall

**Ответ:** Firewall.

**Объяснение:** Firewall разрешает/запрещает трафик по правилам; stateful firewall учитывает состояние соединений. Пакетные фильтры анализируют IP и порты; application-aware системы умеют глубже. Многоуровневая защита сочетает разные средства, а не полагается на одно.

### E436. Which command will block login attempts on RouterA for a period of 30 seconds if there are 2 failed login attempts within 10 seconds?

Источник: модули_16, Q2. Тема: модуль 16.

1. RouterA(config)# login block-for 10 attempts 2 within 30
2. RouterA(config)# login block-for 30 attempts 2 within 10
3. RouterA(config)# login block-for 2 attempts 30 within 10
4. RouterA(config)# login block-for 30 attempts 10 within 2

**Ответ:** RouterA(config)# login block-for 30 attempts 2 within 10.

**Объяснение:** login block-for B attempts A within W блокирует вход на B секунд после A неудачных попыток за W секунд. Это ограничивает перебор паролей.

### E437. What is the purpose of the network security accounting function?

Источник: модули_16, Q3. Тема: модуль 16.

1. To require users to prove who they are
2. To determine which resources a user can access
3. To keep track of the actions of a user
4. To provide challenge and response questions

**Ответ:** To keep track of the actions of a user.

**Объяснение:** AAA: Authentication — кто вы; Authorization — что разрешено; Accounting — что вы сделали. Разные права Read/Edit — authorization; журнал действий — accounting.

### E438. What type of attack may involve the use of tools such as nslookup and fping?

Источник: модули_16, Q4. Тема: модуль 16.

1. Access attack
2. Reconnaissance attack
3. Denial of service attack
4. Worm attack

**Ответ:** Reconnaissance attack.

**Объяснение:** Reconnaissance — сбор сведений перед атакой: сканирование адресов/портов, DNS-запросы, обнаружение систем. Сами nslookup и ping легальны; классификация зависит от цели использования.

### E439. Which benefit does SSH offer over Telnet for remotely managing a router?

Источник: модули_16, Q5. Тема: модуль 16.

1. Encryption
2. TCP usage
3. Authorization
4. Connections via multiple VTY lines

**Ответ:** Encryption.

**Объяснение:** SSH шифрует аутентификацию и сеанс удалённого управления; Telnet передаёт данные без такой защиты. transport input ssh разрешает SSH на VTY, но для работы нужны ключи, пользователь, login local и IP-доступность.

### E440. What is one of the most effective security tools available for protecting users from external threats?

Источник: модули_16, Q6. Тема: модуль 16.

1. Firewalls
2. Router that run AAA services
3. Patch servers
4. Password encryption techniques

**Ответ:** Firewalls.

**Объяснение:** Firewall разрешает/запрещает трафик по правилам; stateful firewall учитывает состояние соединений. Пакетные фильтры анализируют IP и порты; application-aware системы умеют глубже. Многоуровневая защита сочетает разные средства, а не полагается на одно.

### E441. Which type of network threat is intended to prevent authorized users from accessing resources?

Источник: модули_16, Q7. Тема: модуль 16.

1. DoS attacks
2. Access attacks
3. Reconnaissance attacks
4. Trust exploitation

**Ответ:** DoS attacks.

**Объяснение:** DoS истощает ресурсы или нарушает работу сервиса, лишая законных пользователей доступа. DDoS отличается множеством источников. В сценарии важен эффект отказа, а не только наличие вредоносного кода.

### E442. Which three services are provided by the AAA framework? (Choose three.)

Источник: модули_16, Q8. Тема: модуль 16.

1. Accounting
2. Automation
3. Authorization
4. Authentication
5. Autobalancing
6. Autoconfiguration

**Ответ:** Accounting; Authorization; Authentication.

**Объяснение:** AAA: Authentication — кто вы; Authorization — что разрешено; Accounting — что вы сделали. Разные права Read/Edit — authorization; журнал действий — accounting.

### E443. Which malicious code attack is self-contained and tries to exploit a specific vulnerability in a system being attacked?

Источник: модули_16, Q9. Тема: модуль 16.

1. Virus
2. Worm
3. Trojan horse
4. Social engineering

**Ответ:** Worm.

**Объяснение:** Malware — вредоносное ПО. Trojan маскируется под полезную программу, spyware собирает сведения, worm самостоятельно распространяется, virus внедряется в другой объект и размножается при его запуске. Фраза «вирусы не размножаются» неверна: они не распространяются автономно как worm.

### E444. Some routers and switches in a wiring closet malfunctioned after an air conditioning unit failed. What type of threat does this situation describe?

Источник: модули_16, Q10. Тема: модуль 16.

1. Configuration
2. Environmental
3. Electrical
4. Maintenance

**Ответ:** Environmental.

**Объяснение:** Environmental threats связаны с температурой и влажностью. Электропитание — electrical, физическое повреждение — hardware, ошибки обслуживания — maintenance.

### E445. What does the term vulnerability mean?

Источник: модули_16, Q11. Тема: модуль 16.

1. A weakness that makes a target susceptible to an attack
2. A computer that contains sensitive information
3. A method of attack to exploit a target
4. A known target or victim machine
5. A potential threat that a hacker creates

**Ответ:** A weakness that makes a target susceptible to an attack.

**Объяснение:** Уязвимость — слабое место, которое можно использовать. Причина бывает технологической (ошибка ПО), конфигурационной (неверная настройка) или организационной (недостаточная политика безопасности).

### E446. What three configuration steps must be performed to implement SSH access to a router? (Choose three.)

Источник: модули_16, Q12. Тема: модуль 16.

1. A password on the console line
2. An IP domain name
3. A user account
4. An enable mode password
5. A unique hostname
6. An encrypted password

**Ответ:** An IP domain name; A user account; A unique hostname.

**Объяснение:** Для SSH нужны подходящие hostname/domain name, RSA keys, локальный пользователь, login local и transport input ssh на VTY. Если вопрос предлагает только три подготовительных пункта, выбирают hostname, domain name и user account; это не весь процесс.

### E447. What is the objective of a network reconnaissance attack?

Источник: модули_16, Q13. Тема: модуль 16.

1. Discovery and mapping of systems
2. Unauthorized manipulation of data
3. Disabling network systems or services
4. Denying access to resources by legitimate users

**Ответ:** Discovery and mapping of systems.

**Объяснение:** Reconnaissance — сбор сведений перед атакой: сканирование адресов/портов, DNS-запросы, обнаружение систем. Сами nslookup и ping легальны; классификация зависит от цели использования.

### E448. For security reasons a network administrator needs to ensure that local computers cannot ping each other. Which settings can accomplish this task?

Источник: модули_16, Q14. Тема: модуль 16.

1. Smartcard settings
2. Firewall settings
3. MAC address settings
4. File system settings

**Ответ:** Firewall settings.

**Объяснение:** Firewall разрешает/запрещает трафик по правилам; stateful firewall учитывает состояние соединений. Пакетные фильтры анализируют IP и порты; application-aware системы умеют глубже. Многоуровневая защита сочетает разные средства, а не полагается на одно.

### E449. A network administrator establishes a connection to a switch via SSH. What characteristic uniquely describes the SSH connection?

Источник: модули_16, Q15. Тема: модуль 16.

1. Out-of-band access to a switch through the use of a virtual terminal with password authentication
2. Remote access to the switch through the use of a telephone dialup connection
3. On-site access to a switch through the use of a directly connected PC and a console cable
4. Remote access to a switch where data is encrypted during the session
5. Direct access to the switch through the use of a terminal emulation program

**Ответ:** Remote access to a switch where data is encrypted during the session.

**Объяснение:** SSH шифрует аутентификацию и сеанс удалённого управления; Telnet передаёт данные без такой защиты. transport input ssh разрешает SSH на VTY, но для работы нужны ключи, пользователь, login local и IP-доступность.

### E456. Which two network protocols are used to establish a remote access network connection to a device? (Choose two.)

Источник: модули_17, Q2. Тема: модуль 16.

1. File Transfer Protocol (FTP)
2. Hypertext Transfer Protocol (HTTP)
3. Remote Connect (RC)
4. Secure Shell (SSH)
5. Simple Mail Transfer Protocol (SMTP)
6. Telnet

**Ответ:** Secure Shell (SSH); Telnet.

**Объяснение:** SSH шифрует аутентификацию и сеанс удалённого управления; Telnet передаёт данные без такой защиты. transport input ssh разрешает SSH на VTY, но для работы нужны ключи, пользователь, login local и IP-доступность.

### E479. A high school in New York (school A) is using videoconferencing technology to establish student interactions with another high school (school B) in Russia. The videoconferencing is conducted between two end devices through the Internet. The network administrator of school A configures the end device with the IP address 209.165.201.10. The administrator sends a request for the IP address for the end device in school B and the response is 192.168.25.10. Neither school is using a VPN. The administrator knows immediately that this IP will not work. Why?

Источник: тесты_IP_Addressing, Q1. Тема: модуль 16.

1. This is a loopback address.
2. This is a link-local address.
3. This is a private IP address.
4. There is an IP address conflict.

**Ответ:** This is a private IP address..

**Объяснение:** Частные IPv4-диапазоны: 10/8, 172.16/12, 192.168/16. Они не маршрутизируются в публичном интернете как глобальные адреса. 169.254/16 — link-local, 127/8 — loopback, 192.0.2/24 — документация.

### E514. An administrator is configuring a switch console port with a password. In what order will the administrator travel through the IOS modes of operation in order to reach the mode in which the configuration commands will be entered? A first mode user EXEC mode done B final mode line configuration mode C second mode privileged EXEC mode D third mode global configuration mode

Источник: тесты_exam_0, Q3. Тема: модуль 16.

**Ответ:** user EXEC → privileged EXEC → global configuration → line configuration.

**Объяснение:** User EXEC обозначается >, privileged EXEC — #, global configuration — (config)#. enable повышает режим; configure terminal открывает настройку. exit возвращает на один уровень, end/Ctrl-Z — в privileged EXEC.

### E518. A network administrator enters the service password-encryption command into the configuration mode of a router. What does this command accomplish?

Источник: тесты_exam_0, Q7. Тема: модуль 16.

1. This command encrypts passwords as they are transmitted across serial WAN links.
2. This command prevents someone from viewing the running configuration passwords.
3. This command enables a strong encryption algorithm for the enable secret password command.
4. This command automatically encrypts passwords in configuration files that are currently stored in NVRAM.
5. This command provides an exclusive encrypted password for external service personnel who are required to do router maintenance.

**Ответ:** This command prevents someone from viewing the running configuration passwords..

**Объяснение:** service password-encryption скрывает поддерживаемые открытые пароли в конфигурации. В классическом IOS это слабая обратимая Type 7, не надёжная защита и не шифрование трафика. Для привилегированного доступа используют enable secret.

### E520. What command will prevent all unencrypted passwords from displaying in plain text in a configuration file?

Источник: тесты_exam_0, Q9. Тема: модуль 16.

1. (config)# enable password secret
2. (config)# enable secret Secret_Password
3. (config-line)# password secret
4. (config)# service password-encryption
5. (config)# enable secret Encrypted_Password

**Ответ:** (config)# service password-encryption.

**Объяснение:** service password-encryption скрывает поддерживаемые открытые пароли в конфигурации. В классическом IOS это слабая обратимая Type 7, не надёжная защита и не шифрование трафика. Для привилегированного доступа используют enable secret.

### E521. Passwords can be used to restrict access to all or parts of the Cisco IOS. Select the modes and interfaces that can be protected with passwords. (Choose three.)

Источник: тесты_exam_0, Q10. Тема: модуль 16.

1. VTY interface
2. Console interface
3. Ethernet interface
4. Boot IOS mode
5. Privileged EXEC mode
6. Router configuration mode

**Ответ:** VTY interface; Console interface; Privileged EXEC mode.

**Объяснение:** Пароль линии задают в line console 0 или line vty. password задаёт значение, login включает проверку пароля этой линии. login local вместо этого использует локальную базу username.

### E527. Refer to the exhibit. A network administrator is configuring access control to switch SW1. If the administrator uses a console connection to connect to the switch, which password is needed to access user EXEC mode?

Источник: тесты_exam_0, Q16. Тема: модуль 16.

1. letmein
2. secretin
3. lineconin
4. linevtyin

**Ответ для показанного варианта (нужна схема/PT для полной проверки):** lineconin.

**Объяснение:** Пароль линии задают в line console 0 или line vty. password задаёт значение, login включает проверку пароля этой линии. login local вместо этого использует локальную базу username.

**Проверка условия:** исходный рисунок или PT-файл не включён в прежнюю текстовую выгрузку. Конкретные адреса/порты выше сохранены из отображённого варианта; это не универсальный ответ для иной схемы.

### E595. Match the commands to the correct actions. A configures a name on the router Router(config)# hostname CL1 done B displays a message after accessing the router Router(config)# banner motd # C provides security on the console Router(config-line)# password class

Источник: тесты_exam_2, Q17. Тема: модуль 16.

**Ответ:** hostname CL1 → имя устройства; banner motd → сообщение при входе; password class в config-line → пароль линии console.

**Объяснение:** banner motd выводит информационное/предупреждающее сообщение при подключении. Это не пароль и не механизм аутентификации.

### E597. What happens when the transport input ssh command is entered on the switch vty lines?

Источник: тесты_exam_2, Q19; тесты_exam_7, Q53. Тема: модуль 16.

1. The SSH client on the switch is enabled.
2. Communication between the switch and remote users is encrypted.
3. The switch requires a username/password combination for remote access.
4. The switch requires remote connections via a proprietary client software.

**Ответ:** Communication between the switch and remote users is encrypted..

**Объяснение:** SSH шифрует аутентификацию и сеанс удалённого управления; Telnet передаёт данные без такой защиты. transport input ssh разрешает SSH на VTY, но для работы нужны ключи, пользователь, login local и IP-доступность.

### E600. A network administrator requires access to manage routers and switches locally and remotely. Match the description to the access method. A remote access method that uses encryption SSH done B preferred out-of-band access method Console C unsecure remote access Telnet D remote access via a dialup connection AUX

Источник: тесты_exam_2, Q22. Тема: модуль 16.

**Ответ:** SSH → удалённый зашифрованный доступ; Console → локальный out-of-band; Telnet → удалённый незашифрованный; AUX → модемное соединение.

**Объяснение:** SSH шифрует аутентификацию и сеанс удалённого управления; Telnet передаёт данные без такой защиты. transport input ssh разрешает SSH на VTY, но для работы нужны ключи, пользователь, login local и IP-доступность.

### E607. What are two potential network problems that can result from ARP operation? (Choose two.)

Источник: тесты_exam_2, Q29. Тема: модуль 16.

1. Manually configuring static ARP associations could facilitate ARP poisoning or MAC address spoofing.
2. On large networks with low bandwidth, multiple ARP broadcasts could cause data communication delays.
3. Network attackers could manipulate MAC address and IP address mappings in ARP messages with the intent of intercepting network traffic.
4. Large numbers of ARP request broadcasts could cause the host MAC address table to overflow and prevent the host from communicating on the network.
5. Multiple ARP replies result in the switch MAC address table containing entries that match the MAC addresses of hosts that are connected to the relevant switch port.

**Ответ:** On large networks with low bandwidth, multiple ARP broadcasts could cause data communication delays.; Network attackers could manipulate MAC address and IP address mappings in ARP messages with the intent of intercepting network traffic..

**Объяснение:** ARP сопоставляет IPv4 с MAC на локальном канале: запрос обычно broadcast, ответ владельца IP — unicast. Для удалённой сети узнают MAC шлюза. IPv6 использует ICMPv6 ND (NS/NA), а не ARP. arp -a/show ip arp читают кэш, arp -d очищает его.

### E643. A client creates a packet to send to a server. The client is requesting telnet service. What number will be used as the destination port number in the sending packet?

Источник: тесты_exam_4, Q32. Тема: модуль 16.

1. 23
2. 443
3. 161
4. 110

**Ответ:** 23.

**Объяснение:** Well-known/system ports: 0–1023; registered: 1024–49151; dynamic/private: 49152–65535. netstat показывает соединения и порты. Telnet = TCP 23, SSH = TCP 22, DHCP server = UDP 67.

### E644. Identify the steps needed to configure a switch for SSH. The answer order does not matter. Create a local user. Required steps for SSH configuration done Generate RSA keys. Configure a domain name. Use the login local command. Use the transport input ssh command.

Источник: тесты_exam_5, Q1. Тема: модуль 16.

**Ответ:** Создать локального пользователя; Сгенерировать RSA keys; Задать domain name; login local; transport input ssh.

**Объяснение:** Для SSH нужны подходящие hostname/domain name, RSA keys, локальный пользователь, login local и transport input ssh на VTY. Если вопрос предлагает только три подготовительных пункта, выбирают hostname, domain name и user account; это не весь процесс.

### E645. What feature of SSH makes it more secure than Telnet for a device management connection?

Источник: тесты_exam_5, Q2. Тема: модуль 16.

1. confidentiality with IPsec
2. stronger password requirement
3. random one-time port connection
4. login information and data encryption

**Ответ:** login information and data encryption.

**Объяснение:** SSH шифрует аутентификацию и сеанс удалённого управления; Telnet передаёт данные без такой защиты. transport input ssh разрешает SSH на VTY, но для работы нужны ключи, пользователь, login local и IP-доступность.

### E646. What is the difference between a virus and a worm?

Источник: тесты_exam_5, Q3. Тема: модуль 16.

1. Viruses self-replicate but worms do not.
2. Worms self-replicate but viruses do not.
3. Worms require a host file but viruses do not.
4. Viruses hide in legitimate programs but worms do not.

**Ответ в курсе; см. уточнение ниже:** Worm распространяется самостоятельно; virus размножается через заражённый объект/программу.

**Объяснение:** В отображённой попытке: Worms self-replicate but viruses do not.. Malware — вредоносное ПО. Trojan маскируется под полезную программу, spyware собирает сведения, worm самостоятельно распространяется, virus внедряется в другой объект и размножается при его запуске. Фраза «вирусы не размножаются» неверна: они не распространяются автономно как worm.

### E647. Which firewall feature is used to ensure that packets coming into a network are legitimate responses to requests initiated from internal hosts?

Источник: тесты_exam_5, Q4. Тема: модуль 16.

1. Stateful packet inspection
2. URL filtering
3. Application filtering
4. Packet filtering

**Ответ:** Stateful packet inspection.

**Объяснение:** Firewall разрешает/запрещает трафик по правилам; stateful firewall учитывает состояние соединений. Пакетные фильтры анализируют IP и порты; application-aware системы умеют глубже. Многоуровневая защита сочетает разные средства, а не полагается на одно.

### E648. What is the advantage of using SSH over Telnet?

Источник: тесты_exam_5, Q5. Тема: модуль 16.

1. SSH is easier to use.
2. SSH operates faster than Telnet.
3. SSH provides secure communications to access hosts.
4. SSH supports authentication for a connection request.

**Ответ:** SSH provides secure communications to access hosts..

**Объяснение:** SSH шифрует аутентификацию и сеанс удалённого управления; Telnet передаёт данные без такой защиты. transport input ssh разрешает SSH на VTY, но для работы нужны ключи, пользователь, login local и IP-доступность.

### E649. A user is redesigning a network for a small company and wants to ensure security at a reasonable price. The user deploys a new application-aware firewall with intrusion detection capabilities on the ISP connection. The user installs a second firewall to separate the company network from the public network. Additionally, the user installs an IPS on the internal network of the company. What approach is the user implementing?

Источник: тесты_exam_5, Q6. Тема: модуль 16.

1. attack based
2. risk based
3. structured
4. layered

**Ответ:** layered.

**Объяснение:** Firewall разрешает/запрещает трафик по правилам; stateful firewall учитывает состояние соединений. Пакетные фильтры анализируют IP и порты; application-aware системы умеют глубже. Многоуровневая защита сочетает разные средства, а не полагается на одно.

### E650. Match the type of information security threat to the scenario. A identity theft pretending to be someone else by using stolen personal information to apply for a credit card done B information theft obtaining trade secret documents illegally C data loss installing virus code to destroy surveillance recordings for certain days D disruption of service preventing users from accessing a website by sending a large number of link requests in a short period

Источник: тесты_exam_5, Q7. Тема: модуль 16.

**Ответ:** identity theft → чужие данные для получения кредитной карты; information theft → кража коммерческих документов; data loss → уничтожение записей вирусом; disruption of service → перегрузка сайта запросами.

**Объяснение:** Различайте результат угрозы: уничтожение/изменение данных — data loss/manipulation; присвоение личности — identity theft; кража сведений — information theft; недоступность сервиса — disruption of service.

### E651. Match each weakness with an example. A security policy weakness The network administrator did not fully consider the implications of unauthorized users accessing the network. done B technological weakness A nework engineer is examining the operating system of a network device for vulnerabilities. C configuration weakness When implementing an access list on a router, a network engineer did not filter a type of malicous traffic.

Источник: тесты_exam_5, Q8. Тема: модуль 16.

**Ответ:** security policy → не учтены риски неавторизованного доступа; technological → уязвимости ОС; configuration → неверная фильтрация ACL.

**Объяснение:** Уязвимость — слабое место, которое можно использовать. Причина бывает технологической (ошибка ПО), конфигурационной (неверная настройка) или организационной (недостаточная политика безопасности).

### E652. Which attack involves a compromise of data that occurs between two end points?

Источник: тесты_exam_5, Q9. Тема: модуль 16.

1. denial-of-service
2. man-in-the-middle attack
3. extraction of security parameters
4. username enumeration

**Ответ:** man-in-the-middle attack.

**Объяснение:** Man-in-the-middle находится на пути между сторонами и перехватывает либо изменяет обмен. Например, подмена ARP может направить трафик через атакующего.

### E653. Match the description to the type of firewall filtering. A packet filtering prevents or allows access based on the IP or MAC addresses of the source and destination done B application filtering prevents or allows access based on the port numbers used in the request C stateful packet inspection prevents or allows access based on whether the traffic is in response to requests from internal hosts D URL filtering prevents or allows access based on web addresses or keywords

Источник: тесты_exam_5, Q10. Тема: модуль 16.

**Ответ:** packet filtering → адреса источника/назначения; application filtering (терминология задания) → порты; stateful inspection → связь с существующим соединением; URL filtering → адреса сайтов/ключевые слова.

**Объяснение:** Firewall разрешает/запрещает трафик по правилам; stateful firewall учитывает состояние соединений. Пакетные фильтры анализируют IP и порты; application-aware системы умеют глубже. Многоуровневая защита сочетает разные средства, а не полагается на одно.

### E654. Which example of malicious code would be classified as a Trojan horse?

Источник: тесты_exam_5, Q11. Тема: модуль 16.

1. malware that was written to look like a video game
2. malware that requires manual user intervention to spread between systems
3. malware that attaches itself to a legitimate program and spreads to other programs when launched
4. malware that can automatically spread from one system to another by exploiting a vulnerability in the target

**Ответ:** malware that was written to look like a video game.

**Объяснение:** Malware — вредоносное ПО. Trojan маскируется под полезную программу, spyware собирает сведения, worm самостоятельно распространяется, virus внедряется в другой объект и размножается при его запуске. Фраза «вирусы не размножаются» неверна: они не распространяются автономно как worm.

### E671. What is considered the most effective way to mitigate a worm attack?

Источник: тесты_exam_5, Q28. Тема: модуль 16.

1. Change system passwords every 30 days.
2. Ensure that all systems have the most current virus definitions.
3. Ensure that AAA is configured in the network.
4. Download security updates from the operating system vendor and patch all vulnerable systems.

**Ответ:** Download security updates from the operating system vendor and patch all vulnerable systems..

**Объяснение:** Malware — вредоносное ПО. Trojan маскируется под полезную программу, spyware собирает сведения, worm самостоятельно распространяется, virus внедряется в другой объект и размножается при его запуске. Фраза «вирусы не размножаются» неверна: они не распространяются автономно как worm.

### E672. When configuring SSH on a router to implement secure network management, a network engineer has issued the login local and transport input ssh line vty commands. What three additional configuration actions have to be performed to complete the SSH configuration? (Choose three.)

Источник: тесты_exam_5, Q29. Тема: модуль 16.

1. Set the user privilege levels.
2. Generate the asymmetric RSA keys.
3. Configure the correct IP domain name.
4. Configure role-based CLI access.
5. Create a valid local username and password database.
6. Manually enable SSH after the RSA keys are generated.

**Ответ:** Generate the asymmetric RSA keys.; Configure the correct IP domain name.; Create a valid local username and password database..

**Объяснение:** Для SSH нужны подходящие hostname/domain name, RSA keys, локальный пользователь, login local и transport input ssh на VTY. Если вопрос предлагает только три подготовительных пункта, выбирают hostname, domain name и user account; это не весь процесс.

### E674. On which two interfaces or ports can security be improved by configuring executive timeouts? (Choose two.)

Источник: тесты_exam_5, Q31. Тема: модуль 16.

1. fast Ethernet interfaces
2. console ports
3. serial interfaces
4. vty ports
5. loopback interfaces

**Ответ:** console ports; vty ports.

**Объяснение:** exec-timeout завершает простаивающий EXEC-сеанс на console/VTY. Это уменьшает риск использования оставленной открытой сессии; не ограничивает скорость пересылки пакетов.

### E675. Open the PT Activity. Perform the tasks in the activity instructions and then answer the question. Which command has to be configured on the router to complete the SSH configuration?

Источник: тесты_exam_5, Q32. Тема: модуль 16.

1. service password-encryption
2. transport input ssh
3. enable secret class
4. ip domain-name cisco.com

**Ответ для показанного варианта (нужна схема/PT для полной проверки):** transport input ssh.

**Объяснение:** SSH шифрует аутентификацию и сеанс удалённого управления; Telnet передаёт данные без такой защиты. transport input ssh разрешает SSH на VTY, но для работы нужны ключи, пользователь, login local и IP-доступность.

**Проверка условия:** исходный рисунок или PT-файл не включён в прежнюю текстовую выгрузку. Конкретные адреса/порты выше сохранены из отображённого варианта; это не универсальный ответ для иной схемы.

### E676. A technician is to document the current configurations of all network devices in a college, including those in off-site buildings. Which protocol would be best to use to securely access the network devices?

Источник: тесты_exam_5, Q33. Тема: модуль 16.

1. FTP
2. HTTP
3. SSH
4. Telnet

**Ответ:** SSH.

**Объяснение:** SSH шифрует аутентификацию и сеанс удалённого управления; Telnet передаёт данные без такой защиты. transport input ssh разрешает SSH на VTY, но для работы нужны ключи, пользователь, login local и IP-доступность.

### E677. An administrator decides to use "RobErT" as the password on a newly installed router. Which statement applies to the password choice?

Источник: тесты_exam_5, Q34. Тема: модуль 16.

1. It is weak since it uses easily found personal information.
2. It is strong because it uses a passphrase.
3. It is strong because it uses a minimum of 10 numbers, letters and special characters.
4. It is strong because it contains 10 numbers and special characters.

**Ответ:** It is weak since it uses easily found personal information..

**Объяснение:** Смена регистра в легко угадываемом имени не делает пароль стойким. Нужен длинный уникальный секрет, не основанный на общедоступных личных данных.

### E679. Which statement describes network security?

Источник: тесты_exam_6, Q1. Тема: модуль 16.

1. It ensures sensitive corporate data is available for authorized users.
2. It prioritizes data flows in order to give priority to delay-sensitive traffic.
3. It supports growth over time in accordance with approved network design procedures.
4. It synchronizes traffic flows using timestamps.

**Ответ:** It ensures sensitive corporate data is available for authorized users..

**Объяснение:** Информационная безопасность объединяет confidentiality (доступ только уполномоченным), integrity (целостность) и availability (доступность для законных пользователей).

### E681. What characteristic describes spyware?

Источник: тесты_exam_6, Q3. Тема: модуль 16.

1. software that is installed on a user device and collects information about the user
2. an attack that slows or crashes a device or network service
3. the use of stolen credentials to access private data
4. a network device that filters access and traffic coming into a network

**Ответ:** software that is installed on a user device and collects information about the user.

**Объяснение:** Malware — вредоносное ПО. Trojan маскируется под полезную программу, spyware собирает сведения, worm самостоятельно распространяется, virus внедряется в другой объект и размножается при его запуске. Фраза «вирусы не размножаются» неверна: они не распространяются автономно как worm.

### E706. Match the command with the device mode at which the command is entered. A service password-encryption R1(config)# done B login R1(config-line)# C ip address 192.168.4.4 255.255.255.0 R1(config-if)# D copy running-config startup-config R1# E enable R1>

Источник: тесты_exam_6, Q28. Тема: модуль 16.

**Ответ:** service password-encryption → R1(config)#; login → R1(config-line)#; ip address … → R1(config-if)#; copy running-config startup-config → R1#; enable → R1>.

**Объяснение:** User EXEC обозначается >, privileged EXEC — #, global configuration — (config)#. enable повышает режим; configure terminal открывает настройку. exit возвращает на один уровень, end/Ctrl-Z — в privileged EXEC.

### E719. A client packet is received by a server. The packet has a destination port number of 22. What service is the client requesting?

Источник: тесты_exam_6, Q41. Тема: модуль 16.

1. SSH
2. DHCP
3. DNS
4. TFTP

**Ответ:** SSH.

**Объяснение:** Well-known/system ports: 0–1023; registered: 1024–49151; dynamic/private: 49152–65535. netstat показывает соединения и порты. Telnet = TCP 23, SSH = TCP 22, DHCP server = UDP 67.

### E723. Which statement describes the characteristics of packet-filtering and stateful firewalls as they relate to the OSI model?

Источник: тесты_exam_6, Q45. Тема: модуль 16.

1. Both stateful and packet-filtering firewalls can filter at the application layer.
2. A stateful firewall can filter application layer information, whereas a packet-filtering firewall cannot filter beyond the network layer.
3. A packet-filtering firewall typically can filter up to the transport layer, whereas a stateful firewall can filter up to the session layer.
4. A packet-filtering firewall uses session layer information to track the state of a connection, whereas a stateful firewall uses application layer information to track the state of a connection.

**Ответ в курсе; см. уточнение ниже:** A packet-filtering firewall typically can filter up to the transport layer, whereas a stateful firewall can filter up to the session layer..

**Объяснение:** Firewall разрешает/запрещает трафик по правилам; stateful firewall учитывает состояние соединений. Пакетные фильтры анализируют IP и порты; application-aware системы умеют глубже. Многоуровневая защита сочетает разные средства, а не полагается на одно.

### E724. What are two ways to protect a computer from malware? (Choose two.)

Источник: тесты_exam_6, Q46. Тема: модуль 16.

1. Use antivirus software.
2. Empty the browser cache.
3. Keep software up to date.
4. Delete unused software.
5. Defragment the hard disk.

**Ответ:** Use antivirus software.; Keep software up to date..

**Объяснение:** Malware — вредоносное ПО. Trojan маскируется под полезную программу, spyware собирает сведения, worm самостоятельно распространяется, virus внедряется в другой объект и размножается при его запуске. Фраза «вирусы не размножаются» неверна: они не распространяются автономно как worm.

### E725. A network administrator is issuing the login block-for 180 attempts 2 within 30 command on a router. Which threat is the network administrator trying to prevent?

Источник: тесты_exam_6, Q47. Тема: модуль 16.

1. a user who is trying to guess a password to access the router
2. a worm that is attempting to access another part of the network
3. an unidentified individual who is trying to access the network equipment room
4. a device that is trying to inspect the traffic on a link

**Ответ:** a user who is trying to guess a password to access the router.

**Объяснение:** login block-for B attempts A within W блокирует вход на B секунд после A неудачных попыток за W секунд. Это ограничивает перебор паролей.

### E726. The employees and residents of Ciscoville cannot access the Internet or any remote web-based services. IT workers quickly determine that the city firewall is being flooded with so much traffic that a breakdown of connectivity to the Internet is occurring. Which type of attack is being launched at Ciscoville?

Источник: тесты_exam_6, Q48. Тема: модуль 16.

1. Trojan horse
2. reconnaissance
3. DoS
4. access

**Ответ:** DoS.

**Объяснение:** DoS истощает ресурсы или нарушает работу сервиса, лишая законных пользователей доступа. DDoS отличается множеством источников. В сценарии важен эффект отказа, а не только наличие вредоносного кода.

### E745. A disgruntled employee is using some free wireless networking tools to determine information about the enterprise wireless networks. This person is planning on using this information to hack the wireless network. What type of attack is this?

Источник: тесты_exam_7, Q12. Тема: модуль 16.

1. Reconnaissance
2. Access
3. DoS
4. Trojan horse

**Ответ:** Reconnaissance.

**Объяснение:** Reconnaissance — сбор сведений перед атакой: сканирование адресов/портов, DNS-запросы, обнаружение систем. Сами nslookup и ping легальны; классификация зависит от цели использования.

### E746. A company has a file server that shares a folder named Public. The network security policy specifies that the Public folder is assigned Read-Only rights to anyone who can log into the server while the Edit rights are assigned only to the network admin group. Which component is addressed in the AAA network service framework?

Источник: тесты_exam_7, Q13. Тема: модуль 16.

1. accounting
2. automation
3. authorization
4. authentication

**Ответ:** authorization.

**Объяснение:** AAA: Authentication — кто вы; Authorization — что разрешено; Accounting — что вы сделали. Разные права Read/Edit — authorization; журнал действий — accounting.

### E755. Match the type of threat with the cause. A maintenance threats poor handling of key electrical components (electrostatic discharge), lack of critical spare parts, poor cabling, and poor labeling B electrical threats voltage spikes, insufficient supply voltage (brownouts), unconditioned power (noise), and total power loss C environmental threats temperature extremes (too hot or too cold) or humidity extremes (too wet or too dry) D hardware threats physical damage to servers, routers, switches, cabling plant, and workstations

Источник: тесты_exam_7, Q22. Тема: модуль 16.

**Ответ:** maintenance → ошибки обслуживания, ESD, отсутствие запчастей/маркировки; electrical → скачки/падения напряжения, отключения; environmental → температура и влажность; hardware → физическое повреждение оборудования.

**Объяснение:** Environmental threats связаны с температурой и влажностью. Электропитание — electrical, физическое повреждение — hardware, ошибки обслуживания — maintenance.

### E779. Users report that the network access is slow. After questioning the employees, the network administrator learned that one employee downloaded a third-party scanning program for the printer. What type of malware might be introduced that causes slow performance of the network?

Источник: тесты_exam_7, Q46. Тема: модуль 16.

1. worm
2. virus
3. spam
4. phishing

**Ответ:** worm.

**Объяснение:** Malware — вредоносное ПО. Trojan маскируется под полезную программу, spyware собирает сведения, worm самостоятельно распространяется, virus внедряется в другой объект и размножается при его запуске. Фраза «вирусы не размножаются» неверна: они не распространяются автономно как worm.

### E792. What characteristic describes a VPN?

Источник: тесты_exam_7, Q59. Тема: модуль 16.

1. a tunneling protocol that provides remote users with secure access into the network of an organization
2. software on a router that filters traffic based on IP addresses or applications
3. a network device that filters access and traffic coming into a network
4. software that identifies fast-spreading threats

**Ответ:** a tunneling protocol that provides remote users with secure access into the network of an organization.

**Объяснение:** VPN создаёт защищённое логическое соединение через другую сеть. Обычно использует туннелирование и криптографическую защиту; название VPN обозначает технологию/решение, а не один конкретный протокол.

