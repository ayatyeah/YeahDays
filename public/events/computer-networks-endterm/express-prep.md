# Экспресс-подготовка к Computer Networks

Сначала ответь вслух, затем открой разбор. Это повторение ключевых тем, не прогноз состава квиза.

## План на 3 часа
35 минут TCP/UDP и приложения; 25 минут IOS/SSH; 30 минут адресация; 20 минут IP/ARP/ICMP; 10 минут безопасность; 45 минут пробная эндка; 15 минут ошибки.

## План на 1 час
По 15 минут: транспорт/приложения; IOS/маршруты/SSH; адресация/ARP/ICMP; самопроверка.

## Модуль 8 · Почему remote route связан с next hop, а C и L — нет?

Remote network не подключена напрямую: пакет передают соседнему роутеру. C — подключённая сеть, L — собственный IP интерфейса. S и O показывают источник маршрута, а не отдельную категорию local/remote.

What routing table entry has a next hop?

## Модуль 8 · ПК отправляет пакет на сервер в другой сети. Чьи destination IP и MAC в первом кадре?

IP — удалённого сервера; MAC — локального default gateway. Роутер меняет канальную оболочку для следующего участка; без NAT конечные IP сохраняются.

Remote destination: server IP, gateway MAC.

## Модуль 8 · MTU — это скорость или размер? Кто сообщает ограничение IP?

Максимальный размер пакета на канале; ограничение приходит от data link layer. IPv4 может фрагментировать при DF=0. IPv6-роутер не фрагментирует: возвращает Packet Too Big.

MTU comes from the data link layer.

## Модуль 9 · Как коммутатор учится и как решает, куда отправить кадр?

Учится по source MAC и входному порту. Ищет destination MAC. Известный unicast идёт в нужный порт; неизвестный unicast и broadcast — по VLAN кроме входного порта.

Learn source; forward by destination.

## Модуль 9 · ARP и Neighbor Discovery: запросы и адреса назначения?

ARP Request — Ethernet broadcast, ответ обычно unicast. IPv6 использует ICMPv6 NS/NA и multicast вместо ARP; RS/RA служат для обнаружения роутеров и параметров сети.

ARP = IPv4→MAC; NS/NA = IPv6 neighbors.

## Модуль 10 · Как настроить и сохранить IP интерфейса IOS?

enable → configure terminal → interface g0/0 → ip address 192.168.1.1 255.255.255.0 → no shutdown → end → copy running-config startup-config. Проверка: show ip interface brief и show ip route.

Save RAM running-config to NVRAM startup-config.

## Модуль 10 · Зачем Layer 2 switch нужны SVI и ip default-gateway?

SVI с IP/маской нужен для управления самим switch. Шлюз нужен его управляющему трафику в другие сети. Коммутация пользовательских Ethernet-кадров выполняется по MAC и не требует IP на switch.

Management IP is not required for Layer 2 forwarding.

## Модуль 11 · 192.168.10.77/27: сеть, broadcast, хосты и их число?

Осталось 5 бит: блок 32, хостов 30. Границы 0,32,64,96: .77 входит в .64–.95. Сеть .64, broadcast .95, хосты .65–.94.

Network .64; broadcast .95; 30 hosts.

## Модуль 11 · Пять подсетей: сколько заимствованных бит? А 90 хостов: какой префикс?

Для 5 подсетей: 2²=4 мало, 2³=8 достаточно — 3 бита. Для 90 хостов: 2⁶−2=62 мало, 2⁷−2=126 достаточно — 7 host bits, /25.

Subnet count: 2^b. Ordinary host count: 2^h−2.

## Модуль 11 · Назови RFC 1918 и отличи 169.254 от публичного IP.

Private: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16. 169.254/16 — link-local, часто после неудачи DHCP. Не каждый адрес вне RFC1918 публичный: есть loopback, multicast и другие специальные блоки.

Private ≠ link-local; public ≠ merely not private.

## Модуль 12 · Что остаётся от 2001:db8:1:2:abcd::7 при /64?

Первые 4 hextets — сеть 2001:db8:1:2::/64. Последние 64 бита — interface ID abcd:0:0:7. При выделенном /48 под subnet ID здесь 16 бит.

Expand :: before dividing the prefix and interface ID.

## Модуль 12 · Кто сообщает IPv6 default gateway: RA или DHCPv6?

Router Advertisement. SLAAC формирует адрес из объявленного префикса и interface ID; DHCPv6 может дать адрес и/или другие настройки. DAD через NS проверяет уникальность.

RA supplies the default router; DAD detects duplicates.

## Модуль 12 · ff02::1, ff02::2, fe80::/10, ::1 — что это?

ff02::1 — все узлы канала, ff02::2 — все роутеры канала, fe80::/10 — link-local, ::1 — loopback. IPv6 не использует broadcast.

All nodes; all routers; link-local; loopback.

## Модуль 13 · Чем ping отличается от traceroute? Что значит *?

Ping Echo Request/Reply проверяет достижимость и RTT. Traceroute меняет TTL/Hop Limit и использует Time Exceeded для поиска хопов. * означает отсутствие ответа за время ожидания; фильтрация возможна даже при работающем маршруте.

A timeout is not proof that the router is down.

## Модуль 13 · Что доказывает ping 127.0.0.1? Зачем extended ping?

Loopback проверяет локальный IP-стек, а не кабель/шлюз. Extended ping в IOS позволяет выбрать source address/interface и проверить достижимость именно с него.

Loopback tests the local stack; extended ping selects the source.

## Модуль 14 · TCP получил байты 4001–4500. Какой ACK?

4501 — следующий ожидаемый байт. ACK не номер последнего принятого байта. Нумерация позволяет обнаруживать пропуски и упорядочивать данные.

ACK means next expected byte.

## Модуль 14 · TCP vs UDP: соединение, порядок, заголовок, повторы?

TCP: handshake SYN→SYN/ACK→ACK, порядок, подтверждения и повторы; минимум 20 байт заголовка. UDP: без handshake, 8 байт, нет собственного восстановления порядка/потерь. UDP checksum обнаруживает ошибки, но не обеспечивает доставку.

UDP trades built-in reliability for lower overhead.

## Модуль 14 · Receive window и congestion control — одно и то же?

Нет. Flow control ограничивает отправителя возможностями получателя (receive window). Congestion control реагирует на загрузку сети. Оба могут ограничивать объём данных в пути.

Receiver capacity versus network congestion.

## Модуль 15 · DNS A/AAAA/NS/MX и команды: что для чего?

A→IPv4, AAAA→IPv6, NS→authoritative name servers, MX→mail servers. nslookup делает DNS-запросы. DNS использует UDP и TCP 53; не только UDP.

MX points to mail exchange; AAAA resolves IPv6.

## Модуль 15 · Как различить SMTP, POP3, IMAP, FTP, SMB?

SMTP отправляет почту; POP3 скачивает; IMAP синхронизирует серверные папки. FTP передаёт файлы с отдельными control/data соединениями. SMB даёт длительное совместное использование файлов и принтеров.

Send mail, download mail, sync mail, transfer files, share resources.

## Модуль 15 · DORA, HTTP GET/POST/PUT и основные порты?

DHCP Discover→Offer→Request→ACK, UDP67 сервер/68 клиент. GET читает ресурс; POST отправляет на обработку; PUT задаёт ресурс по URI. HTTP80, HTTPS443, DNS53, SMTP25, POP3110, IMAP143, FTP control21, SSH22, Telnet23.

Know the service destination port, not a random client source port.

## Модуль 16 · Authentication, authorization, accounting: примеры?

Authentication проверяет личность (логин). Authorization разрешает действие (Read-only или Edit). Accounting фиксирует действия в журнале. Право редактирования папки — authorization.

Who are you? What may you do? What did you do?

## Модуль 16 · Reconnaissance, access, DoS и malware — как отличить?

Сканирование портов/карта сети — reconnaissance; несанкционированный вход — access; недоступность сервиса из-за атаки — DoS. Worm распространяется самостоятельно, virus связан с заражённым объектом, Trojan маскируется под полезное, spyware собирает данные.

Classify the action, not just a scary word in the scenario.

## Модуль 16 · Что нужно для SSH в IOS? Почему password-encryption не заменяет SSH?

Hostname, domain name, RSA keys, local username/secret; на VTY login local и transport input ssh. SSH шифрует сетевой сеанс. service password-encryption только скрывает открытые пароли в конфигурации; legacy Type7 обратим.

SSH encrypts transport; Type7 obscures stored configuration passwords.
