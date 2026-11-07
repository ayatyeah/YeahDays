# 250 вопросов непосредственно из модулей 8–16

Начни с этого файла: только собственные вопросы нужных модулей, без дополнительных подборок из других разделов. Формулировки/варианты на английском, объяснения на русском. Спорные вопросы и зависимость от схем отмечены.

# Модуль 8. Сетевой уровень и маршрутизация

33 вопросов непосредственно из модуля. Объяснения на русском; формулировки сохранены на языке курса.

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



---

# Модуль 9. ARP и Neighbor Discovery

25 вопросов непосредственно из модуля. Объяснения на русском; формулировки сохранены на языке курса.

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



---

# Модуль 10. Настройка маршрутизатора и IOS

13 вопросов непосредственно из модуля. Объяснения на русском; формулировки сохранены на языке курса.

### E258. A router boots and enters setup mode. What is the reason for this?

Источник: модули_10, Q1. Тема: модуль 10.

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



---

# Модуль 11. IPv4 и подсети

25 вопросов непосредственно из модуля. Объяснения на русском; формулировки сохранены на языке курса.

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

Источник: модули_11, Q1. Тема: модуль 11.

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



---

# Модуль 12. IPv6

32 вопросов непосредственно из модуля. Объяснения на русском; формулировки сохранены на языке курса.

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



---

# Модуль 13. ICMP и диагностика

16 вопросов непосредственно из модуля. Объяснения на русском; формулировки сохранены на языке курса.

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



---

# Модуль 14. TCP и UDP

38 вопросов непосредственно из модуля. Объяснения на русском; формулировки сохранены на языке курса.

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



---

# Модуль 15. Прикладные протоколы

34 вопросов непосредственно из модуля. Объяснения на русском; формулировки сохранены на языке курса.

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



---

# Модуль 16. Безопасность сети

34 вопросов непосредственно из модуля. Объяснения на русском; формулировки сохранены на языке курса.

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

