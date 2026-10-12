import { part, qx, tfx, type Lecture } from "../types";
import { deepL5P1 } from "./deep/l5p1";
import { deepL5P2 } from "./deep/l5p2";
import { deepL5P3 } from "./deep/l5p3";
import { deepL5P4 } from "./deep/l5p4";

export const lecture5: Lecture = {
  id: "cn-l5",
  title: { en: "Lecture 5 — Network Layer. Address Resolution. Basic Router Configuration", ru: "Лекция 5 — Сетевой уровень. Разрешение адресов. Базовая настройка маршрутизатора" },
  parts: [
    part(
      "cn-l5-p1",
      { en: "Network layer characteristics and the IPv4 packet", ru: "Характеристики сетевого уровня и пакет IPv4" },
      {
        en: `## What the network layer does
The network layer (Layer 3) provides the services that let end devices exchange data **across networks**. The principal network layer protocols are **IPv4** and **IPv6**. It performs four basic operations:
- **Addressing end devices** — every end device gets a unique **IP address** that identifies it on the network.
- **Encapsulation** — the transport layer **segment** gets an IP header and becomes a **packet**.
- **Routing** — routers select the best path and forward the packet hop by hop toward the destination network.
- **De-encapsulation** — the destination host removes the IP header, checks that the destination address is its own and passes the segment up to the transport layer.
> Mnemonic: **A-E-R-D** — Address, Encapsulate, Route, De-encapsulate. Encapsulation happens at the source, de-encapsulation at the destination.
## IP encapsulation
- IP encapsulates the **transport layer segment** (TCP or UDP) by adding an IP header.
- The same segment can travel in an **IPv4 or an IPv6** packet — the Layer 4 segment is not affected.
- The IP header is examined by **every Layer 3 device** (router) the packet passes through.
- The IP addresses **do not change** from source to destination; only the frame and its MAC addresses change on each link (lecture 2). The exception is NAT at the network edge.
## Characteristics of IP
IP is designed for **low overhead**. Three words describe it:
| Characteristic | What it means | Who covers the gap |
|---|---|---|
| Connectionless | no connection is set up before sending; no control information (synchronizations, acknowledgments); the destination gets no advance notice | TCP, if a connection is needed |
| Best effort | delivery is **not guaranteed**; no acknowledgments, no resending; IP does not even know whether the other device is operational | upper-layer protocols such as TCP |
| Media independent | works the same over **copper, fiber or wireless**; IP does not care about the frame type or the media | the data link and physical layers |
IP is called **unreliable**: it cannot manage or fix undelivered or corrupt packets, cannot retransmit after an error and cannot realign out-of-sequence packets. It relies on other protocols for these functions.
> Exam trap: "unreliable" does not mean that IP often loses packets — it means IP has **no mechanism** that guarantees delivery. Like a letter posted without tracking: it usually arrives, but nobody confirms it.
## MTU and fragmentation
- The one media property the network layer does consider is the **Maximum Transmission Unit (MTU)** — the largest packet the medium can carry. The data link layer passes this value up in control information, and the network layer sets the MTU size. For Ethernet the MTU is **1500 bytes**.
- **Fragmentation** — Layer 3 splits an IPv4 packet into smaller units when it is bigger than the MTU of the next link. Example: a router forwards from Ethernet onto a slow WAN link with a smaller MTU.
- Fragmenting causes **latency**.
- **Routers do not fragment IPv6 packets.**
## The IPv4 packet header
The header makes sure the packet goes toward the right destination and carries the information every Layer 3 device needs. It is binary and is drawn **4 bytes (32 bits) per row**, read left to right; without options it is **20 bytes**. The two most important fields are the **source** and **destination** addresses.
@diagram cn5-ipv4-header
| Field | Size | Purpose |
|---|---|---|
| Version | 4 bits | **0100** = version 4 (IPv6 has 0110) |
| Differentiated Services (DS) | 8 bits | **QoS**: 6-bit DSCP + 2-bit ECN; the older name is ToS (Type of Service) |
| Total Length, Identification, Flags, Fragment Offset | 16 / 16 / 3 / 13 bits | packet size and the reassembly of fragments |
| Time to Live (TTL) | 8 bits | Layer 3 **hop count**: every router subtracts 1; at **0** the router discards the packet |
| Protocol | 8 bits | identifies the **next-level protocol**: ICMP, TCP, UDP |
| Header Checksum | 16 bits | detects corruption **in the IPv4 header** only |
| Source / Destination IPv4 address | 32 bits each | who sent the packet / who must receive it |
= Protocol: 1 = ICMP, 6 = TCP, 17 = UDP
> Exam trap: TTL stops a packet from looping forever; it counts routers, not seconds. The Header Checksum does not check the data — that is left to Layer 2 (FCS) and Layer 4.
## Public and private IPv4 addresses
- **Public** addresses are globally routed between internet service provider (ISP) routers.
- **Private** addresses (RFC 1918) are common blocks that most organizations use for internal hosts. They are **not unique** and **not globally routable**:
= 10.0.0.0/8       10.0.0.0 – 10.255.255.255
= 172.16.0.0/12    172.16.0.0 – 172.31.255.255
= 192.168.0.0/16   192.168.0.0 – 192.168.255.255
- **NAT** (Network Address Translation) translates private IPv4 addresses into public ones. It is typically enabled on the **edge router** that connects to the internet.
## Limitations of IPv4
- **Address depletion** — the IPv4 address space has basically run out.
- **Lack of end-to-end connectivity** — private addressing and NAT kept IPv4 alive but ended direct communication between devices with public addresses: a host on the internet cannot simply open a connection to a host hidden behind NAT.
- **Increased network complexity** — NAT was meant to be temporary; rewriting the addresses in the headers adds latency and makes troubleshooting harder.
?? Which IPv4 header field keeps a packet from circling forever in a routing loop, and how?
?= TTL — every router subtracts 1, and the router that brings it to 0 discards the packet.
?? A host with the address 172.20.5.9 can browse the web, but nobody on the internet can start a connection to it. Why?
?= 172.20.5.9 is a private RFC 1918 address (inside 172.16.0.0/12). It reaches the internet through NAT, and NAT breaks end-to-end connectivity.
?? The Protocol field of a packet contains 17. What is inside the packet?
?= A UDP datagram (6 would be TCP, 1 would be ICMP).`,
        ru: `## Что делает сетевой уровень
Сетевой уровень (уровень 3) даёт службы, с помощью которых конечные устройства обмениваются данными **между сетями**. Основные протоколы сетевого уровня — **IPv4** и **IPv6**. Он выполняет четыре базовые операции:
- **Адресация конечных устройств (addressing)** — каждое конечное устройство получает уникальный **IP-адрес**, по которому его узнают в сети.
- **Инкапсуляция (encapsulation)** — **сегмент** транспортного уровня получает IP-заголовок и становится **пакетом**.
- **Маршрутизация (routing)** — маршрутизаторы выбирают лучший путь и передают пакет от перехода к переходу в сторону сети назначения.
- **Деинкапсуляция (de-encapsulation)** — хост назначения снимает IP-заголовок, проверяет, что адрес назначения — его собственный, и передаёт сегмент вверх, транспортному уровню.
> Мнемоника: **A-E-R-D** — Address, Encapsulate, Route, De-encapsulate. Инкапсуляция происходит у отправителя, деинкапсуляция — у получателя.
## Инкапсуляция IP
- IP инкапсулирует **сегмент транспортного уровня** (TCP или UDP), добавляя к нему IP-заголовок.
- Один и тот же сегмент может идти в пакете **IPv4 или IPv6** — на сегмент уровня 4 это не влияет.
- IP-заголовок просматривает **каждое устройство уровня 3** (маршрутизатор), через которое проходит пакет.
- IP-адреса **не меняются** от источника до назначения; на каждом участке меняются только кадр и его MAC-адреса (лекция 2). Исключение — NAT на границе сети.
## Характеристики IP
IP задуман с **малыми накладными расходами (low overhead)**. Его описывают три слова:
| Характеристика | Что это значит | Кто восполняет пробел |
|---|---|---|
| Без установления соединения (connectionless) | перед отправкой соединение не устанавливается; нет управляющей информации (синхронизаций, подтверждений); получателя заранее не предупреждают | TCP, если соединение нужно |
| Доставка по возможности (best effort) | доставка **не гарантируется**; нет подтверждений и повторной отправки; IP даже не знает, работает ли другое устройство | протоколы верхних уровней, например TCP |
| Независимость от среды (media independent) | работает одинаково по **меди, оптике и радио**; IP безразличны тип кадра и среда | канальный и физический уровни |
IP называют **ненадёжным (unreliable)**: он не умеет обрабатывать или исправлять недоставленные и повреждённые пакеты, не передаёт повторно после ошибки и не восстанавливает порядок пакетов, пришедших не по очереди. Для этих функций он опирается на другие протоколы.
> Ловушка экзамена: «ненадёжный» не значит, что IP часто теряет пакеты, — это значит, что в IP **нет механизма**, гарантирующего доставку. Как письмо без отслеживания: обычно доходит, но никто этого не подтверждает.
## MTU и фрагментация
- Единственное свойство среды, которое сетевой уровень учитывает, — **MTU (Maximum Transmission Unit)**, наибольший пакет, который способна передать среда. Канальный уровень сообщает это значение наверх в управляющей информации, а сетевой уровень устанавливает размер MTU. Для Ethernet MTU — **1500 байт**.
- **Фрагментация (fragmentation)** — уровень 3 делит пакет IPv4 на меньшие части, если тот больше MTU следующего канала. Пример: маршрутизатор передаёт пакет из Ethernet в медленный канал WAN с меньшим MTU.
- Фрагментация добавляет **задержку (latency)**.
- **Маршрутизаторы не фрагментируют пакеты IPv6.**
## Заголовок пакета IPv4
Заголовок направляет пакет к нужному получателю и несёт сведения, нужные каждому устройству уровня 3. Он двоичный, его рисуют **по 4 байта (32 бита) в строке** и читают слева направо; без опций он занимает **20 байт**. Два самых важных поля — адреса **источника** и **назначения**.
@diagram cn5-ipv4-header
| Поле | Размер | Назначение |
|---|---|---|
| Version (версия) | 4 бита | **0100** = версия 4 (у IPv6 — 0110) |
| Differentiated Services (DS) | 8 бит | **QoS**: 6 бит DSCP + 2 бита ECN; старое название — ToS (Type of Service) |
| Total Length, Identification, Flags, Fragment Offset | 16 / 16 / 3 / 13 бит | размер пакета и сборка фрагментов |
| Time to Live (TTL, время жизни) | 8 бит | **счётчик переходов** уровня 3: каждый маршрутизатор вычитает 1; при **0** маршрутизатор отбрасывает пакет |
| Protocol (протокол) | 8 бит | указывает **протокол следующего уровня**: ICMP, TCP, UDP |
| Header Checksum (контрольная сумма заголовка) | 16 бит | обнаруживает повреждение только **в заголовке IPv4** |
| IPv4-адрес источника / назначения | по 32 бита | кто отправил пакет / кто должен его получить |
= Protocol: 1 = ICMP, 6 = TCP, 17 = UDP
> Ловушка экзамена: TTL не даёт пакету вечно крутиться в петле; он считает маршрутизаторы, а не секунды. Header Checksum не проверяет данные — это оставлено уровню 2 (FCS) и уровню 4.
## Публичные и частные адреса IPv4
- **Публичные (public)** адреса маршрутизируются глобально между маршрутизаторами интернет-провайдеров (ISP).
- **Частные (private)** адреса (RFC 1918) — общие блоки, которые большинство организаций выдаёт внутренним хостам. Они **не уникальны** и **глобально не маршрутизируются**:
= 10.0.0.0/8       10.0.0.0 – 10.255.255.255
= 172.16.0.0/12    172.16.0.0 – 172.31.255.255
= 192.168.0.0/16   192.168.0.0 – 192.168.255.255
- **NAT** (преобразование сетевых адресов) переводит частные адреса IPv4 в публичные. Обычно его включают на **пограничном маршрутизаторе (edge router)**, который подключён к интернету.
## Ограничения IPv4
- **Исчерпание адресов (address depletion)** — адреса IPv4, по сути, закончились.
- **Нет сквозной связности (end-to-end connectivity)** — частные адреса и NAT продлили жизнь IPv4, но покончили с прямой связью между устройствами с публичными адресами: хост в интернете не может просто открыть соединение с хостом, спрятанным за NAT.
- **Рост сложности сети** — NAT задумывался как временное решение; подмена адресов в заголовках добавляет задержку и усложняет поиск неисправностей.
?? Какое поле заголовка IPv4 не даёт пакету вечно крутиться в петле маршрутизации и как?
?= TTL — каждый маршрутизатор вычитает 1, и тот, у которого получается 0, отбрасывает пакет.
?? Хост с адресом 172.20.5.9 открывает сайты, но никто из интернета не может начать с ним соединение. Почему?
?= 172.20.5.9 — частный адрес RFC 1918 (внутри 172.16.0.0/12). В интернет он выходит через NAT, а NAT лишает сквозной связности.
?? В поле Protocol пакета стоит 17. Что внутри пакета?
?= Датаграмма UDP (6 было бы TCP, 1 — ICMP).`,
      },
      [
        qx("Which network layer operation takes place at the destination host when it removes the IP header and passes the segment up?", "De-encapsulation", [
          ["Encapsulation", "Encapsulation adds the IP header at the source; the destination does the opposite.", "Инкапсуляция добавляет IP-заголовок у отправителя; получатель делает обратное."],
          ["Routing", "Routing is done by the routers along the path when they choose where to forward the packet.", "Маршрутизацию выполняют маршрутизаторы на пути, когда выбирают, куда передать пакет."],
          ["Addressing end devices", "Addressing gives each device its unique IP address; it does not strip headers.", "Адресация даёт устройству уникальный IP-адрес; заголовки она не снимает."],
        ], "De-encapsulation: the destination checks the destination IP address, removes the IP header and hands the segment to the transport layer.", "Деинкапсуляция: получатель проверяет IP-адрес назначения, снимает IP-заголовок и передаёт сегмент транспортному уровню."),
        qx("IP is described as connectionless. What does this mean?", "No connection is set up before packets are sent", [
          ["Packets carry no destination address", "Every IP packet carries source and destination addresses; connectionless refers to the missing setup.", "В каждом IP-пакете есть адреса источника и назначения; «без соединения» говорит об отсутствии предварительной установки."],
          ["Every packet is acknowledged by the receiver", "IP uses no acknowledgments at all; that is connection-oriented behaviour, typical of TCP.", "IP вообще не использует подтверждений; это поведение протоколов с соединением, как TCP."],
          ["The whole path is reserved before the first packet leaves", "Nothing is reserved in advance; each packet is forwarded on its own.", "Заранее ничего не резервируется; каждый пакет пересылается сам по себе."],
        ], "IP sends packets without first establishing a connection: no synchronization, no acknowledgments, no advance notice to the destination.", "IP отправляет пакеты, не устанавливая соединения: без синхронизации, без подтверждений, без предупреждения получателя."),
        qx("Why is IP called a best-effort protocol?", "It does not guarantee packet delivery", [
          ["It always picks the fastest path", "Path selection is the job of routing; best effort is about the missing delivery guarantee.", "Выбор пути — задача маршрутизации; best effort говорит об отсутствии гарантии доставки."],
          ["It resends lost packets until they arrive", "IP has no mechanism to resend lost data; TCP does that.", "В IP нет механизма повторной отправки; этим занимается TCP."],
          ["It reserves bandwidth for each flow", "IP reserves nothing; QoS marking in the DS field is a different topic.", "IP ничего не резервирует; маркировка QoS в поле DS — другая тема."],
        ], "Best effort: IP does its best but gives no guarantee — no acknowledgments, no resending, no knowledge of whether the destination is even operational.", "Best effort: IP старается, но ничего не гарантирует — нет подтверждений и повторной отправки, он даже не знает, работает ли получатель."),
        qx("What does it mean that IP is media independent?", "It can travel over copper, fiber or wireless", [
          ["IP chooses the cable type for each link", "IP never chooses media; the physical layer and the network design do.", "IP не выбирает среду; это делают физический уровень и проект сети."],
          ["IP works only inside Ethernet frames", "IP can be carried in any Layer 2 frame — Ethernet, Wi-Fi, PPP and others.", "IP переносится в любом кадре уровня 2 — Ethernet, Wi-Fi, PPP и других."],
          ["IP itself turns the packet into signals on the wire", "Turning bits into signals is the physical layer's job, not IP's.", "Превращать биты в сигналы — задача физического уровня, а не IP."],
        ], "IP does not concern itself with the frame type or the media: the same packet can cross copper, fiber-optic and wireless links.", "IP безразличны тип кадра и среда: один и тот же пакет может пройти по меди, оптике и радиоканалу."),
        qx("A router must forward a large IPv4 packet from Ethernet onto a WAN link with a smaller MTU. What can it do?", "Fragment the packet into smaller units", [
          ["Raise the MTU of the WAN link", "The MTU is a property of the link that the data link layer reports; the router cannot stretch it for one packet.", "MTU — свойство канала, о котором сообщает канальный уровень; растянуть его ради одного пакета нельзя."],
          ["Convert the packet into IPv6", "Routers do not convert between IP versions — and they would not fragment IPv6 anyway.", "Маршрутизаторы не переводят пакеты из одной версии IP в другую — а IPv6 они и вовсе не фрагментируют."],
          ["Compress the payload until it fits the link", "IP has no payload compression; the network layer fragments instead.", "В IP нет сжатия нагрузки; вместо этого сетевой уровень фрагментирует пакет."],
        ], "Fragmentation: Layer 3 splits the IPv4 packet into smaller units that fit the next link's MTU. The price is extra latency.", "Фрагментация: уровень 3 делит пакет IPv4 на части, которые проходят по MTU следующего канала. Цена — дополнительная задержка."),
        tfx("Routers fragment IPv6 packets that are larger than the MTU of the next link.", false,
          "False. Unlike IPv4, routers do not fragment IPv6 packets — the Flags and Fragment Offset fields are not even in the IPv6 base header.",
          "Неверно. В отличие от IPv4, маршрутизаторы не фрагментируют пакеты IPv6 — полей Flags и Fragment Offset даже нет в базовом заголовке IPv6.",
          "Answering True mixes IPv6 up with IPv4: only IPv4 packets are fragmented by routers.",
          "Ответ «верно» путает IPv6 с IPv4: маршрутизаторы фрагментируют только пакеты IPv4."),
        qx("Which IPv4 header field does every router decrease by one, discarding the packet when it reaches zero?", "Time to Live (TTL)", [
          ["Header Checksum", "The checksum only detects corruption of the header; it is not a hop counter.", "Контрольная сумма только обнаруживает повреждение заголовка; это не счётчик переходов."],
          ["Fragment Offset", "Fragment Offset marks where a fragment belongs in the original packet.", "Fragment Offset показывает, где фрагмент стоял в исходном пакете."],
          ["Differentiated Services", "DS carries the QoS marking; routers do not count it down.", "DS несёт метку QoS; маршрутизаторы её не уменьшают."],
        ], "TTL is the Layer 3 hop count: each router subtracts 1, and at 0 the packet is discarded, so it cannot loop forever.", "TTL — счётчик переходов уровня 3: каждый маршрутизатор вычитает 1, при 0 пакет отбрасывается, поэтому вечной петли не будет."),
        qx("An IPv4 packet has the value 6 in its Protocol field. Which protocol is inside?", "TCP", [
          ["UDP", "UDP is protocol number 17.", "У UDP номер протокола 17."],
          ["ICMP", "ICMP is protocol number 1.", "У ICMP номер протокола 1."],
          ["ARP", "ARP is never inside an IP packet; it has its own EtherType 0x0806.", "ARP никогда не бывает внутри IP-пакета; у него свой EtherType 0x0806."],
        ], "The Protocol field identifies the next-level protocol: 1 = ICMP, 6 = TCP, 17 = UDP.", "Поле Protocol указывает протокол следующего уровня: 1 = ICMP, 6 = TCP, 17 = UDP."),
        qx("What does the Header Checksum of an IPv4 packet check?", "Only the IPv4 header", [
          ["The whole packet, header and data", "The data is not covered; error checking of the payload is left to other layers.", "Данные не охватываются; проверку нагрузки оставляют другим уровням."],
          ["The Ethernet frame trailer", "The frame is checked by the FCS in the Layer 2 trailer, not by an IP field.", "Кадр проверяет FCS в концевике уровня 2, а не поле IP."],
          ["The TCP data", "TCP has its own checksum; the IPv4 checksum stops at the end of the IP header.", "У TCP своя контрольная сумма; контрольная сумма IPv4 заканчивается на IP-заголовке."],
        ], "The Header Checksum detects corruption in the IPv4 header only.", "Header Checksum обнаруживает повреждение только в заголовке IPv4."),
        qx("Which IPv4 header field is used for QoS, marking how a packet should be prioritized?", "Differentiated Services (DS)", [
          ["Identification and Fragment Offset", "These fields are used to reassemble fragments, not to set priority.", "Эти поля нужны для сборки фрагментов, а не для приоритета."],
          ["Time to Live (TTL)", "TTL limits the number of hops; it does not prioritize traffic.", "TTL ограничивает число переходов; приоритет он не задаёт."],
          ["Protocol", "Protocol names the next-level protocol, such as TCP or UDP.", "Protocol называет протокол следующего уровня, например TCP или UDP."],
        ], "The DS field (DiffServ, 6-bit DSCP + 2-bit ECN; formerly ToS) carries the QoS marking.", "Поле DS (DiffServ, 6 бит DSCP + 2 бита ECN; раньше ToS) несёт метку QoS."),
        qx("Which limitation of IPv4 is a direct side effect of private addressing and NAT?", "Lack of end-to-end connectivity", [
          ["Address depletion", "Depletion is the reason NAT was introduced, not a side effect of it.", "Исчерпание — причина появления NAT, а не его побочный эффект."],
          ["A 20-byte minimum header", "The header size has nothing to do with NAT, and the slides do not list it as a limitation.", "Размер заголовка не связан с NAT, и в слайдах он не назван ограничением."],
          ["Fragmentation at every router hop", "NAT does not cause fragmentation; fragmentation depends on the MTU.", "NAT не вызывает фрагментацию; она зависит от MTU."],
        ], "Private addressing and NAT ended direct communication with public addressing: hosts behind NAT cannot simply be reached end to end.", "Частные адреса и NAT покончили с прямой связью по публичным адресам: до хостов за NAT нельзя просто достучаться напрямую."),
        qx("Which of these addresses can be used inside a company but is not routed on the internet?", "172.20.14.3", [
          ["172.32.14.3", "172.32.x.x is just outside 172.16.0.0/12, which ends at 172.31.255.255 — it is public.", "172.32.x.x лежит сразу за пределами 172.16.0.0/12, который заканчивается на 172.31.255.255, — это публичный адрес."],
          ["8.8.4.4", "8.8.4.4 is a public address (a public DNS server).", "8.8.4.4 — публичный адрес (публичный DNS-сервер)."],
          ["193.168.1.1", "Only 192.168.0.0/16 is private; 193.168.x.x is public.", "Частный только 192.168.0.0/16; 193.168.x.x — публичный."],
        ], "172.20.14.3 falls in the RFC 1918 block 172.16.0.0/12 (172.16.0.0 – 172.31.255.255); private addresses are not globally routable.", "172.20.14.3 входит в блок RFC 1918 172.16.0.0/12 (172.16.0.0 – 172.31.255.255); частные адреса глобально не маршрутизируются."),
      ],
      deepL5P1,
    ),
    part(
      "cn-l5-p2",
      { en: "The IPv6 packet and how hosts and routers route", ru: "Пакет IPv6 и как маршрутизируют хосты и маршрутизаторы" },
      {
        en: `## Why IPv6
IPv6 was developed by the **Internet Engineering Task Force (IETF)** to overcome the limitations of IPv4. It brings:
- **Increased address space** — **128-bit** addresses instead of 32-bit ones.
- **Improved packet handling** — a simplified header with fewer fields.
- **No need for NAT** — there are so many addresses that private addressing mapped to a shared public address is unnecessary, and end-to-end connectivity returns.
## The IPv6 header
- **Simplified, but not smaller**: the header is fixed at **40 bytes** (IPv4: 20 bytes without options).
- Several IPv4 fields were removed to improve performance: **Flags, Fragment Offset and Header Checksum**.
| IPv6 field | Size | Purpose | In IPv4 |
|---|---|---|---|
| Version | 4 bits | **0110** = version 6 | Version (0100) |
| Traffic Class | 8 bits | QoS | DS field |
| Flow Label | **20 bits** | devices handle all packets with the same flow label the same way | — (new) |
| Payload Length | 16 bits | length of the **data portion** (payload) only | Total Length (header + data) |
| Next Header | 8 bits | next-level protocol: ICMPv6, TCP, UDP — or an extension header | Protocol |
| Hop Limit | 8 bits | **replaces TTL**: −1 at each router, dropped at 0 | TTL |
| Source / Destination address | 128 bits each | sender / receiver | 32 bits each |
> Pairs to remember: **Traffic Class = DS, Next Header = Protocol, Hop Limit = TTL.** Flow Label is the one truly new field.
## Extension headers
An IPv6 packet may also contain **extension headers (EH)**. They are **optional**, carry extra network layer information, sit **between the IPv6 header and the payload** and are used for fragmentation, security, mobility support and more. Routers do not fragment IPv6 packets — if fragmentation is needed, the source does it with an extension header.
?? Which IPv4 header fields have no place in the IPv6 base header?
?= Flags, Fragment Offset and Header Checksum. Routers do not fragment IPv6, and error checking is left to Layer 2 and Layer 4.
## How a host decides where to send
Packets are always created at the source, and every host builds its **own routing table**. A host can send a packet to:
- **itself** — loopback **127.0.0.1** (IPv4) or **::1** (IPv6), to test its own TCP/IP stack;
- a **local host** — on the same LAN;
- a **remote host** — on another network.
The source decides whether the destination is local or remote:
- **IPv4** — it combines its own IP address and **subnet mask** with the destination IP address and compares the network portions.
- **IPv6** — it uses the network address and **prefix advertised by the local router**.
Local traffic goes straight out the host interface, and the switch delivers it. Remote traffic is sent to the **default gateway**.
@diagram cn5-host-decision
## The default gateway
- A **router or a Layer 3 switch** can be the default gateway (DGW).
- It must have an IP address **in the same range as the rest of the LAN**, accept data from the LAN, forward it off the LAN and route to other networks.
- With **no gateway or a wrong one**, traffic cannot leave the LAN; local traffic still works.
- An IPv4 host learns the DGW **statically or through DHCP**; an IPv6 host gets it from a **Router Advertisement** (it can ask with a Router Solicitation) or manually.
- In the host routing table the DGW is a **default route** (0.0.0.0/0) — the route of last resort.
## The host routing table
On Windows either command displays it:
= C:\\> route print
= C:\\> netstat -r
Three sections: **Interface List** (all interfaces with their MAC addresses), **IPv4 Route Table** and **IPv6 Route Table**.
## The router routing table
A router that receives a frame de-encapsulates the packet, looks up the **destination IP address** in its routing table, picks the exit interface and puts the packet into a **new frame**. There are three types of routes:
- **Directly connected** — added **automatically** when an interface is active and has an address.
- **Remote** — networks without a direct connection, learned **manually** (static route) or **dynamically** (a routing protocol lets routers share information).
- **Default route** — sends all traffic in one direction when no other route matches.
| Static routing | Dynamic routing |
|---|---|
| configured by hand | discovers remote networks automatically |
| adjusted by hand when the topology changes | keeps information up to date, finds a new best path after a change |
| good for small networks without redundancy | chooses the best path to the destination |
| often used for the default route next to a routing protocol | can share a static default route with other routers |
= R1# show ip route
| Code | Meaning | Route type |
|---|---|---|
| L | the router's own interface address (/32) | directly connected |
| C | the network on that interface | directly connected |
| S | static route set by an administrator | remote |
| S* | static default route | default |
| O / D | learned by OSPF / EIGRP | remote (dynamic) |
> Exam trap: **C** is the network (192.168.10.0/24), **L** is the interface's own address (192.168.10.1/32). "Gateway of last resort is not set" means there is no default route.
?? PC1 is 192.168.10.10/24. Does it send a packet for 192.168.11.5 directly or to its gateway?
?= To the default gateway: the network portions 192.168.10 and 192.168.11 differ, so the destination is remote.
?? R1 shows "S* 0.0.0.0/0". What is this route?
?= A static default route — the gateway of last resort, used when nothing more specific matches.`,
        ru: `## Зачем IPv6
IPv6 разработала **IETF (Internet Engineering Task Force)**, чтобы преодолеть ограничения IPv4. Что он даёт:
- **Больше адресов (increased address space)** — **128-битные** адреса вместо 32-битных.
- **Улучшенная обработка пакетов** — упрощённый заголовок с меньшим числом полей.
- **NAT не нужен** — адресов так много, что частные адреса за общим публичным не нужны, и сквозная связность возвращается.
## Заголовок IPv6
- **Упрощённый, но не меньший**: заголовок фиксирован и занимает **40 байт** (у IPv4 — 20 байт без опций).
- Ради скорости несколько полей IPv4 убрали: **Flags, Fragment Offset и Header Checksum**.
| Поле IPv6 | Размер | Назначение | В IPv4 |
|---|---|---|---|
| Version (версия) | 4 бита | **0110** = версия 6 | Version (0100) |
| Traffic Class | 8 бит | QoS | поле DS |
| Flow Label (метка потока) | **20 бит** | устройства обрабатывают все пакеты с одной меткой потока одинаково | — (новое) |
| Payload Length | 16 бит | длина только **части с данными** (полезной нагрузки) | Total Length (заголовок + данные) |
| Next Header | 8 бит | протокол следующего уровня: ICMPv6, TCP, UDP — или заголовок расширения | Protocol |
| Hop Limit (предел переходов) | 8 бит | **заменяет TTL**: −1 на каждом маршрутизаторе, при 0 пакет отбрасывается | TTL |
| Адрес источника / назначения | по 128 бит | отправитель / получатель | по 32 бита |
> Пары для запоминания: **Traffic Class = DS, Next Header = Protocol, Hop Limit = TTL.** Flow Label — единственное по-настоящему новое поле.
## Заголовки расширения
В пакете IPv6 могут быть ещё **заголовки расширения (extension headers, EH)**. Они **необязательны**, несут дополнительную информацию сетевого уровня, стоят **между заголовком IPv6 и полезной нагрузкой** и служат для фрагментации, безопасности, поддержки мобильности и не только. Маршрутизаторы пакеты IPv6 не фрагментируют — если фрагментация нужна, её делает источник с помощью заголовка расширения.
?? Каких полей заголовка IPv4 нет в базовом заголовке IPv6?
?= Flags, Fragment Offset и Header Checksum. Маршрутизаторы IPv6 не фрагментируют, а проверку ошибок оставили уровням 2 и 4.
## Как хост решает, куда отправить
Пакеты всегда создаются у источника, и каждый хост строит **собственную таблицу маршрутизации**. Хост может отправить пакет:
- **самому себе** — loopback **127.0.0.1** (IPv4) или **::1** (IPv6), чтобы проверить свой стек TCP/IP;
- **локальному хосту (local host)** — в той же LAN;
- **удалённому хосту (remote host)** — в другой сети.
Источник сам решает, локальное назначение или удалённое:
- **IPv4** — сопоставляет свой IP-адрес и **маску подсети** с IP-адресом назначения и сравнивает сетевые части.
- **IPv6** — использует адрес сети и **префикс, который объявляет локальный маршрутизатор**.
Локальный трафик уходит прямо из интерфейса хоста, и его доставляет коммутатор. Удалённый трафик отправляется **шлюзу по умолчанию (default gateway)**.
@diagram cn5-host-decision
## Шлюз по умолчанию
- Шлюзом по умолчанию (DGW) может быть **маршрутизатор или коммутатор уровня 3**.
- У него должен быть IP-адрес **из того же диапазона, что и у остальной LAN**; он принимает данные из LAN, выводит их за пределы LAN и маршрутизирует в другие сети.
- **Без шлюза или с неверным шлюзом** трафик не может выйти из LAN; локальный трафик при этом работает.
- Хост IPv4 узнаёт шлюз **из статической настройки или через DHCP**; хост IPv6 получает его из **Router Advertisement** (может попросить через Router Solicitation) или вручную.
- В таблице маршрутизации хоста шлюз — это **маршрут по умолчанию (default route)** 0.0.0.0/0, маршрут последней надежды.
## Таблица маршрутизации хоста
В Windows её показывает любая из команд:
= C:\\> route print
= C:\\> netstat -r
Три раздела: **Interface List** (все интерфейсы с их MAC-адресами), **IPv4 Route Table** и **IPv6 Route Table**.
## Таблица маршрутизации маршрутизатора
Получив кадр, маршрутизатор извлекает пакет, ищет **IP-адрес назначения** в своей таблице маршрутизации, выбирает выходной интерфейс и кладёт пакет в **новый кадр**. Маршруты бывают трёх типов:
- **Непосредственно подключённые (directly connected)** — добавляются **автоматически**, когда интерфейс активен и у него есть адрес.
- **Удалённые (remote)** — сети без прямого подключения; узнаются **вручную** (статический маршрут) или **динамически** (протокол маршрутизации позволяет маршрутизаторам делиться сведениями).
- **Маршрут по умолчанию (default route)** — отправляет весь трафик в одну сторону, когда другие маршруты не подходят.
| Статическая маршрутизация | Динамическая маршрутизация |
|---|---|
| настраивается вручную | сама обнаруживает удалённые сети |
| при изменении топологии правится вручную | держит сведения актуальными, после изменений находит новый лучший путь |
| подходит для небольших сетей без резервирования | выбирает лучший путь к назначению |
| часто задаёт маршрут по умолчанию рядом с протоколом маршрутизации | может раздавать статический маршрут по умолчанию другим маршрутизаторам |
= R1# show ip route
| Код | Значение | Тип маршрута |
|---|---|---|
| L | собственный адрес интерфейса маршрутизатора (/32) | непосредственно подключённый |
| C | сеть на этом интерфейсе | непосредственно подключённый |
| S | статический маршрут, заданный администратором | удалённый |
| S* | статический маршрут по умолчанию | по умолчанию |
| O / D | получен через OSPF / EIGRP | удалённый (динамический) |
> Ловушка экзамена: **C** — это сеть (192.168.10.0/24), **L** — собственный адрес интерфейса (192.168.10.1/32). «Gateway of last resort is not set» значит, что маршрута по умолчанию нет.
?? У PC1 адрес 192.168.10.10/24. Пакет для 192.168.11.5 он отправит напрямую или шлюзу?
?= Шлюзу по умолчанию: сетевые части 192.168.10 и 192.168.11 различаются, значит, назначение удалённое.
?? R1 показывает «S* 0.0.0.0/0». Что это за маршрут?
?= Статический маршрут по умолчанию — шлюз последней надежды, который используется, когда ничего более точного не подходит.`,
      },
      [
        qx("How long is the fixed IPv6 base header?", "40 bytes", [
          ["20 bytes", "20 bytes is the IPv4 header without options.", "20 байт — это заголовок IPv4 без опций."],
          ["60 bytes", "60 bytes is the largest possible IPv4 header, with options.", "60 байт — наибольший возможный заголовок IPv4, с опциями."],
          ["128 bytes", "128 is the number of bits in an IPv6 address, not the header size.", "128 — это число бит в адресе IPv6, а не размер заголовка."],
        ], "The IPv6 header is simplified but not smaller: it is fixed at 40 bytes.", "Заголовок IPv6 упрощён, но не уменьшен: он фиксирован и занимает 40 байт."),
        qx("Which IPv6 header field replaced the IPv4 Time to Live field?", "Hop Limit", [
          ["Flow Label", "Flow Label marks packets that belong to one flow; it is not a hop counter.", "Flow Label помечает пакеты одного потока; это не счётчик переходов."],
          ["Traffic Class", "Traffic Class is the QoS field, the counterpart of DS.", "Traffic Class — поле QoS, аналог DS."],
          ["Version", "Version only says which IP version this is (0110).", "Version лишь сообщает версию IP (0110)."],
        ], "Hop Limit replaces TTL: each router subtracts 1 and drops the packet at 0.", "Hop Limit заменяет TTL: каждый маршрутизатор вычитает 1 и при 0 отбрасывает пакет."),
        qx("Which 20-bit IPv6 field asks devices to handle all packets of one flow the same way?", "Flow Label", [
          ["Traffic Class", "Traffic Class is an 8-bit QoS marking, not a flow identifier.", "Traffic Class — 8-битная метка QoS, а не идентификатор потока."],
          ["Payload Length", "Payload Length is a 16-bit field with the size of the data portion.", "Payload Length — 16-битное поле с размером части с данными."],
          ["Hop Limit", "Hop Limit counts down the remaining hops.", "Hop Limit отсчитывает оставшиеся переходы."],
        ], "The 20-bit Flow Label tells devices to treat packets with the same label in the same way.", "20-битная Flow Label сообщает устройствам, что пакеты с одинаковой меткой нужно обрабатывать одинаково."),
        qx("Where is an IPv6 extension header placed?", "Between the IPv6 header and the payload", [
          ["Inside the Ethernet header, before the IPv6 header", "Extension headers belong to the network layer, not to the Layer 2 frame.", "Заголовки расширения относятся к сетевому уровню, а не к кадру уровня 2."],
          ["After the payload, like a trailer", "IPv6 has no trailer; optional information comes before the payload.", "У IPv6 нет концевика; необязательные сведения идут перед нагрузкой."],
          ["Inside the Flow Label field", "Flow Label is a fixed 20-bit field and cannot hold extra headers.", "Flow Label — фиксированное 20-битное поле, заголовки в него не помещаются."],
        ], "Optional extension headers sit between the fixed IPv6 header and the payload — for fragmentation, security, mobility and more.", "Необязательные заголовки расширения стоят между фиксированным заголовком IPv6 и нагрузкой — для фрагментации, безопасности, мобильности и т. д."),
        qx("Which IPv6 improvement removes the need for NAT?", "A 128-bit address space", [
          ["The 20-bit Flow Label", "Flow Label helps handle flows; it has nothing to do with address shortage.", "Flow Label помогает обрабатывать потоки; к нехватке адресов она отношения не имеет."],
          ["Extension headers that add security", "Security options do not create addresses; NAT existed because addresses ran out.", "Опции безопасности не добавляют адресов; NAT появился из-за нехватки адресов."],
          ["The fixed 40-byte header", "A fixed header speeds up processing but adds no addresses.", "Фиксированный заголовок ускоряет обработку, но адресов не добавляет."],
        ], "With 128-bit addressing there are enough addresses for everyone, so private addresses mapped to a shared public one are no longer needed.", "При 128-битных адресах их хватает всем, поэтому частные адреса за общим публичным больше не нужны."),
        qx("PC1 has 192.168.10.10 with mask 255.255.255.0. For which destination will it send the packet to its default gateway?", "192.168.20.10", [
          ["192.168.10.1", "192.168.10.1 is in PC1's own network 192.168.10.0/24 — often the gateway itself, reached directly.", "192.168.10.1 — в собственной сети PC1 192.168.10.0/24, часто это сам шлюз, до него идут напрямую."],
          ["192.168.10.254", "Same network 192.168.10.0/24, so the packet is delivered locally.", "Та же сеть 192.168.10.0/24, пакет доставляется локально."],
          ["192.168.10.99", "The first three octets match PC1's network, so it is a local host.", "Первые три октета совпадают с сетью PC1 — это локальный хост."],
        ], "With a /24 mask the network portion is the first three octets; only 192.168.20.10 is on a different network, so it goes to the gateway.", "При маске /24 сетевая часть — первые три октета; только 192.168.20.10 в другой сети, поэтому пакет идёт шлюзу."),
        qx("How does an IPv6 host decide whether a destination is on its own network?", "It uses the prefix advertised by the local router", [
          ["It sends an ARP broadcast for the address", "IPv6 does not use ARP at all, and ARP does not decide local versus remote.", "IPv6 вообще не использует ARP, и ARP не решает, локальное назначение или нет."],
          ["It forwards every packet to the default gateway", "Local destinations are reached directly, without the gateway.", "До локальных назначений хост доходит напрямую, без шлюза."],
          ["It compares the destination MAC address with its own", "Layer 3 decisions are made with IP prefixes; the MAC is found later.", "Решения уровня 3 принимаются по IP-префиксам; MAC находится позже."],
        ], "IPv4 uses its own address and subnet mask; IPv6 uses the network address and prefix advertised by the local router.", "IPv4 использует свой адрес и маску подсети; IPv6 — адрес сети и префикс, объявленный локальным маршрутизатором."),
        qx("Which pair of Windows commands displays the host routing table?", "route print and netstat -r", [
          ["ipconfig and arp -a", "ipconfig shows the IP settings and arp -a the ARP cache, not the routing table.", "ipconfig показывает настройки IP, а arp -a — ARP-кэш, но не таблицу маршрутизации."],
          ["show ip route and show arp", "These are Cisco IOS commands, not Windows commands.", "Это команды Cisco IOS, а не Windows."],
          ["tracert and nslookup", "tracert traces the path and nslookup queries DNS.", "tracert трассирует путь, а nslookup опрашивает DNS."],
        ], "route print and netstat -r show the same output: Interface List, IPv4 Route Table and IPv6 Route Table.", "route print и netstat -r выводят одно и то же: Interface List, IPv4 Route Table и IPv6 Route Table."),
        qx("In show ip route output, what does a route with the code L represent?", "The router's own interface address", [
          ["A directly connected network", "That is code C; L is the /32 address of the interface itself.", "Это код C; L — адрес /32 самого интерфейса."],
          ["A static route typed in by an administrator", "Static routes have the code S.", "У статических маршрутов код S."],
          ["An OSPF route", "OSPF routes are marked O.", "Маршруты OSPF помечаются буквой O."],
        ], "L is a local route: the router's own interface IP address as a /32 host route. C is the network on that interface.", "L — локальный маршрут: собственный IP-адрес интерфейса как маршрут /32. C — сеть на этом интерфейсе."),
        qx("R1 shows S* 0.0.0.0/0 in its routing table. What is this route?", "A static default route", [
          ["A directly connected network", "Connected networks have the code C and a real network address.", "У подключённых сетей код C и настоящий адрес сети."],
          ["An EIGRP route", "EIGRP routes are marked D.", "Маршруты EIGRP помечаются буквой D."],
          ["The router's own loopback address", "A local address is marked L with a /32 mask, not 0.0.0.0/0.", "Собственный адрес помечается L с маской /32, а не 0.0.0.0/0."],
        ], "S means static, the asterisk marks a default route; 0.0.0.0/0 matches every destination — the gateway of last resort.", "S — статический, звёздочка обозначает маршрут по умолчанию; 0.0.0.0/0 подходит под любое назначение — шлюз последней надежды."),
        qx("Which statement describes static routing?", "It must be updated by hand when the topology changes", [
          ["It finds a new best path after a link failure", "Finding new paths automatically is a feature of dynamic routing.", "Сам находить новые пути умеет динамическая маршрутизация."],
          ["It discovers remote networks automatically", "Automatic discovery is what routing protocols do.", "Автоматическое обнаружение — работа протоколов маршрутизации."],
          ["It suits large networks with many redundant links best", "Static routing is good for small networks without redundancy.", "Статическая маршрутизация хороша для небольших сетей без резервирования."],
        ], "Static routes are configured and adjusted manually; they suit small non-redundant networks and are often used for a default route.", "Статические маршруты настраиваются и правятся вручную; они подходят для небольших сетей без резервирования и часто задают маршрут по умолчанию."),
        tfx("A host with a wrong default gateway can still communicate with hosts on its own LAN.", true,
          "True. Local traffic is delivered directly inside the LAN; only traffic for remote networks needs the gateway.",
          "Верно. Локальный трафик доставляется прямо внутри LAN; шлюз нужен только для трафика в другие сети.",
          "Answering False confuses local and remote delivery: a bad gateway only stops traffic from leaving the LAN.",
          "Ответ «неверно» путает локальную и удалённую доставку: плохой шлюз лишь не даёт трафику выйти из LAN."),
      ],
      deepL5P2,
    ),
    part(
      "cn-l5-p3",
      { en: "Address resolution: ARP and IPv6 Neighbor Discovery", ru: "Разрешение адресов: ARP и IPv6 Neighbor Discovery" },
      {
        en: `## Which MAC address goes into the frame
A device on an Ethernet LAN has two primary addresses:
- **Layer 2 physical address (MAC)** — for NIC-to-NIC communication on the same Ethernet network.
- **Layer 3 logical address (IP)** — to send the packet from the source device to the destination device.
The rule for the destination MAC:
- destination IP on the **same network** — the MAC of the **destination device**;
- destination IP on a **remote network** — the MAC of the **default gateway**.
To find the MAC that belongs to an IP address, **IPv4 uses ARP** and **IPv6 uses ICMPv6** (Neighbor Discovery).
The slide exhibit: PC-A sends packets to an FTP server behind routers RA and RB. As the packets leave RA's Fa0/0 toward RB:
| Field | Value on the RA → RB link |
|---|---|
| Source MAC | RA Fa0/0 |
| Destination MAC | RB's interface on that link |
| Source IP | PC-A |
| Destination IP | FTP server |
> The IP pair is the same on every link; the MAC pair is always "this hop → next hop".
## ARP — two functions
A device uses ARP to find the MAC address of a **local** device when it knows its IPv4 address. ARP provides:
- **resolving IPv4 addresses to MAC addresses**;
- **maintaining an ARP table** (ARP cache) of IPv4-to-MAC mappings.
To send a frame, the device searches its ARP table:
- destination on the same network — for the **destination IPv4 address**;
- destination on another network — for the IPv4 address of the **default gateway**;
- entry found — that MAC becomes the destination MAC of the frame;
- no entry — the device sends an **ARP request**.
## ARP request and ARP reply
- The **ARP request** travels directly in an Ethernet frame (EtherType **0x0806**, no IP header) to **FF-FF-FF-FF-FF-FF** — a **broadcast** that every device on the LAN receives and processes: "Who has 192.168.1.20? Tell 192.168.1.10."
- Only the owner of the target IPv4 address answers with an **ARP reply** — a **unicast** frame back to the requester with its MAC address.
- The requester adds the mapping to its ARP table. Routers do not forward the broadcast — it stays in the LAN.
@diagram cn5-arp
## The ARP table
- A **cache timer** removes entries that have not been used for some time: some Windows versions keep them **15–45 seconds**, and show interfaces on a Cisco router shows **ARP Timeout 04:00:00** (4 hours).
- Entries can also be removed by hand: **arp -d** on Windows, **clear arp-cache** on Cisco IOS.
= R1# show ip arp
= C:\\> arp -a
> Exam trap: **show ip arp** is the router's IPv4-to-MAC table; **show mac address-table** is the switch's MAC-to-port table. Different devices, different tables.
## ARP issues
- **Broadcasts** — every device on the LAN must process each ARP request. When many devices power up at once, the burst of requests can briefly slow the network.
- **ARP spoofing (ARP poisoning)** — a threat actor answers ARP requests with **its own MAC** for someone else's IPv4 address, usually the default gateway's, so frames go to the attacker (man-in-the-middle). Enterprise switches mitigate it with **Dynamic ARP Inspection (DAI)**.
?? PC-A wants to reach a server on another network and its ARP table is empty. Whose IPv4 address is in its ARP request?
?= The default gateway's. For a remote destination a device resolves the gateway's MAC, never the remote server's.
## IPv6 Neighbor Discovery
**Neighbor Discovery (ND)** is part of **ICMPv6**. It provides address resolution, router discovery and redirection with five messages:
| Message | From → to | Purpose |
|---|---|---|
| Router Solicitation (RS) | host → all routers FF02::2 | asks routers to send an RA now |
| Router Advertisement (RA) | router → all nodes FF02::1 | prefix, prefix length, default gateway; periodic or in reply to an RS |
| Neighbor Solicitation (NS) | device → solicited-node multicast | "what is the MAC of this IPv6 address?"; also used for DAD |
| Neighbor Advertisement (NA) | device → requester | the answer with the MAC address |
| Redirect | router → host | points the host to a better first-hop router |
- **Address resolution** — the NS goes to the **solicited-node multicast** address of the target: **FF02::1:FF** plus the **last 24 bits** of the target address (Ethernet MAC 33-33-FF-…). Only devices whose address ends with those bits listen, so the others never process it. The target answers with an NA.
- **Duplicate Address Detection (DAD)** — a device sends an NS for **its own new address**; an NA in reply means the address is already in use. R1's output shows "ND DAD is enabled".
In the slide output of show ipv6 interface, R1 joined these solicited-node groups (plus FF02::1, the all-nodes group):
= 2001:DB8:ACAD:10::1          →  FF02::1:FF00:1
= FE80::868A:8DFF:FE44:49B0    →  FF02::1:FF44:49B0
| Feature | ARP (IPv4) | ND (IPv6) |
|---|---|---|
| Carried in | its own frame type 0x0806 | ICMPv6 inside IPv6 |
| Question | ARP request, broadcast | NS, solicited-node multicast |
| Answer | ARP reply, unicast | NA, unicast |
| Extras | — | RS/RA, Redirect, DAD |
?? Why is an NS sent to a solicited-node multicast address more efficient than an ARP request?
?= Only devices whose address ends with the same 24 bits listen to that group; an ARP broadcast must be processed by every device on the LAN.`,
        ru: `## Какой MAC-адрес ставится в кадр
У устройства в Ethernet LAN два основных адреса:
- **Физический адрес уровня 2 (MAC)** — для связи сетевой карты с сетевой картой в одной сети Ethernet.
- **Логический адрес уровня 3 (IP)** — чтобы доставить пакет от устройства-источника до устройства назначения.
Правило для MAC назначения:
- IP назначения в **той же сети** — MAC **самого устройства назначения**;
- IP назначения в **удалённой сети** — MAC **шлюза по умолчанию**.
Чтобы узнать MAC, соответствующий IP-адресу, **IPv4 использует ARP**, а **IPv6 — ICMPv6** (Neighbor Discovery).
Пример со слайда: PC-A отправляет пакеты FTP-серверу за маршрутизаторами RA и RB. Когда пакеты выходят из Fa0/0 маршрутизатора RA в сторону RB:
| Поле | Значение на участке RA → RB |
|---|---|
| MAC источника | RA Fa0/0 |
| MAC назначения | интерфейс RB на этом участке |
| IP источника | PC-A |
| IP назначения | FTP-сервер |
> Пара IP одинакова на каждом участке; пара MAC — всегда «этот переход → следующий переход».
## ARP — две функции
ARP нужен устройству, чтобы найти MAC-адрес **локального** устройства, когда известен его адрес IPv4. ARP обеспечивает:
- **разрешение адресов IPv4 в MAC-адреса**;
- **ведение ARP-таблицы** (ARP-кэша) соответствий IPv4 → MAC.
Чтобы отправить кадр, устройство ищет в своей ARP-таблице:
- назначение в той же сети — **IPv4-адрес назначения**;
- назначение в другой сети — IPv4-адрес **шлюза по умолчанию**;
- запись нашлась — этот MAC становится MAC назначения кадра;
- записи нет — устройство отправляет **ARP-запрос (ARP request)**.
## ARP-запрос и ARP-ответ
- **ARP-запрос** идёт прямо в кадре Ethernet (EtherType **0x0806**, без IP-заголовка) на **FF-FF-FF-FF-FF-FF** — это **broadcast**, который получает и обрабатывает каждое устройство LAN: «Кто 192.168.1.20? Ответь 192.168.1.10».
- Отвечает только владелец искомого адреса IPv4 — **ARP-ответом (ARP reply)**, **одноадресным (unicast)** кадром спросившему со своим MAC-адресом.
- Спросивший добавляет соответствие в ARP-таблицу. Маршрутизаторы broadcast не пересылают — он остаётся в LAN.
@diagram cn5-arp
## ARP-таблица
- **Таймер кэша** удаляет записи, которыми давно не пользовались: некоторые версии Windows хранят их **15–45 секунд**, а show interfaces на маршрутизаторе Cisco показывает **ARP Timeout 04:00:00** (4 часа).
- Записи можно удалить и вручную: **arp -d** в Windows, **clear arp-cache** в Cisco IOS.
= R1# show ip arp
= C:\\> arp -a
> Ловушка экзамена: **show ip arp** — таблица IPv4 → MAC маршрутизатора; **show mac address-table** — таблица MAC → порт коммутатора. Разные устройства, разные таблицы.
## Проблемы ARP
- **Широковещательные запросы** — каждое устройство LAN обязано обработать каждый ARP-запрос. Когда много устройств включается одновременно, всплеск запросов может ненадолго замедлить сеть.
- **ARP spoofing (ARP poisoning, отравление ARP)** — злоумышленник отвечает на ARP-запросы **своим MAC** для чужого адреса IPv4, обычно для адреса шлюза, и кадры уходят к нему (атака «человек посередине»). Корпоративные коммутаторы защищаются функцией **Dynamic ARP Inspection (DAI)**.
?? PC-A хочет связаться с сервером в другой сети, а его ARP-таблица пуста. Чей IPv4-адрес будет в его ARP-запросе?
?= Шлюза по умолчанию. Для удалённого назначения устройство узнаёт MAC шлюза и никогда — MAC удалённого сервера.
## IPv6 Neighbor Discovery
**Neighbor Discovery (ND, обнаружение соседей)** входит в **ICMPv6**. Он обеспечивает разрешение адресов, обнаружение маршрутизаторов и перенаправление с помощью пяти сообщений:
| Сообщение | От кого → кому | Назначение |
|---|---|---|
| Router Solicitation (RS) | хост → все маршрутизаторы FF02::2 | просит маршрутизаторы прислать RA сейчас |
| Router Advertisement (RA) | маршрутизатор → все узлы FF02::1 | префикс, длина префикса, шлюз по умолчанию; периодически или в ответ на RS |
| Neighbor Solicitation (NS) | устройство → solicited-node multicast | «какой MAC у этого адреса IPv6?»; также для DAD |
| Neighbor Advertisement (NA) | устройство → спросившему | ответ с MAC-адресом |
| Redirect | маршрутизатор → хост | указывает хосту лучший маршрутизатор первого перехода |
- **Разрешение адресов** — NS отправляется на **solicited-node multicast** адрес цели: **FF02::1:FF** плюс **последние 24 бита** адреса цели (MAC в Ethernet 33-33-FF-…). Слушают только устройства, чей адрес оканчивается этими битами, остальные его вообще не обрабатывают. Цель отвечает сообщением NA.
- **Duplicate Address Detection (DAD, обнаружение дубликатов)** — устройство отправляет NS для **своего нового адреса**; если пришёл NA, адрес уже занят. В выводе R1 есть строка «ND DAD is enabled».
В выводе show ipv6 interface на слайде R1 вступил в такие solicited-node группы (плюс FF02::1 — группа всех узлов):
= 2001:DB8:ACAD:10::1          →  FF02::1:FF00:1
= FE80::868A:8DFF:FE44:49B0    →  FF02::1:FF44:49B0
| Признак | ARP (IPv4) | ND (IPv6) |
|---|---|---|
| В чём переносится | собственный тип кадра 0x0806 | ICMPv6 внутри IPv6 |
| Вопрос | ARP-запрос, broadcast | NS, solicited-node multicast |
| Ответ | ARP-ответ, unicast | NA, unicast |
| Дополнительно | — | RS/RA, Redirect, DAD |
?? Почему NS на solicited-node multicast адрес эффективнее ARP-запроса?
?= Эту группу слушают только устройства, у которых адрес оканчивается теми же 24 битами; ARP-broadcast обязано обработать каждое устройство LAN.`,
      },
      [
        qx("How are the two ARP messages delivered on the LAN?", "Request as broadcast, reply as unicast", [
          ["Request as unicast, reply as broadcast", "The asker does not know the target's MAC yet, so the request cannot be a unicast.", "Спрашивающий ещё не знает MAC цели, поэтому запрос не может быть одноадресным."],
          ["Both as broadcasts to every device", "The reply goes only to the asker, whose MAC is in the request.", "Ответ идёт только спросившему — его MAC есть в запросе."],
          ["Both as multicasts to group members", "Multicast address resolution is IPv6 ND (solicited-node), not ARP.", "Разрешение адресов через multicast — это IPv6 ND (solicited-node), а не ARP."],
        ], "The ARP request goes to FF-FF-FF-FF-FF-FF so every device sees it; the owner of the address answers with a unicast reply.", "ARP-запрос уходит на FF-FF-FF-FF-FF-FF, и его видят все; владелец адреса отвечает одноадресным ответом."),
        qx("What is Duplicate Address Detection (DAD) used for?", "Checking that a new IPv6 address is not in use", [
          ["Removing repeated entries from the ARP table", "DAD is an IPv6 ND function; it does not manage the IPv4 ARP cache.", "DAD — функция IPv6 ND; ARP-кэшем IPv4 она не управляет."],
          ["Finding a backup default gateway", "Routers are discovered with RS and RA, not with DAD.", "Маршрутизаторы обнаруживаются через RS и RA, а не через DAD."],
          ["Detecting two hosts with the same MAC on one switch port", "DAD checks IPv6 addresses, not MAC addresses on switch ports.", "DAD проверяет адреса IPv6, а не MAC-адреса на портах коммутатора."],
        ], "With DAD a device sends an NS for its own new address; if an NA comes back, the address is already taken.", "При DAD устройство отправляет NS для своего нового адреса; если пришёл NA, адрес уже занят."),
        qx("PC-A (192.168.1.10/24) must send a packet to 10.5.5.5, and its ARP table is empty. Which IPv4 address does it put in the ARP request?", "The default gateway's address", [
          ["10.5.5.5, the remote server", "10.5.5.5 is on another network; its owner would never see a LAN broadcast.", "10.5.5.5 в другой сети; его владелец никогда не увидит broadcast этой LAN."],
          ["255.255.255.255", "That is the IPv4 broadcast address; ARP asks for a specific target address.", "Это широковещательный адрес IPv4; ARP спрашивает конкретный адрес цели."],
          ["Its own address, 192.168.1.10", "PC-A already knows its own MAC; it needs the next hop's MAC.", "Свой MAC PC-A и так знает; ему нужен MAC следующего перехода."],
        ], "For a remote destination the device searches its ARP table for the default gateway and, if needed, sends an ARP request for the gateway's IPv4 address.", "Для удалённого назначения устройство ищет в ARP-таблице шлюз по умолчанию и при необходимости отправляет ARP-запрос для IPv4-адреса шлюза."),
        qx("PC-A sends packets to an FTP server behind routers RA and RB. As a frame leaves RA toward RB, what is its destination MAC address?", "The MAC of RB's interface on that link", [
          ["The MAC of the FTP server", "The server's MAC is used only on the last link, from RB to the server.", "MAC сервера используется только на последнем участке, от RB до сервера."],
          ["The MAC of PC-A", "PC-A's MAC appeared only as the source on the first link.", "MAC PC-A был только источником на первом участке."],
          ["The MAC of RA's interface toward the PC-A LAN", "RA's own interface on this link is the source MAC, and its LAN interface is not involved at all.", "Интерфейс RA на этом участке — MAC источника, а его LAN-интерфейс здесь вообще ни при чём."],
        ], "On every link the destination MAC is the next hop; here that is RB. The IP addresses stay PC-A → FTP server.", "На каждом участке MAC назначения — следующий переход, здесь это RB. IP-адреса остаются PC-A → FTP-сервер."),
        qx("Which command displays the ARP table of a Cisco router?", "show ip arp", [
          ["show mac address-table", "That is the switch's MAC-to-port table, not the IPv4-to-MAC table.", "Это таблица MAC → порт коммутатора, а не таблица IPv4 → MAC."],
          ["arp -a", "arp -a shows the ARP cache on a Windows PC, not in Cisco IOS.", "arp -a показывает ARP-кэш на ПК с Windows, а не в Cisco IOS."],
          ["show ip route", "show ip route displays the routing table.", "show ip route показывает таблицу маршрутизации."],
        ], "show ip arp lists the router's IPv4-to-MAC mappings with their age, type and interface.", "show ip arp выводит соответствия IPv4 → MAC маршрутизатора с возрастом записи, типом и интерфейсом."),
        tfx("A device removes an ARP table entry automatically when it has not been used for some time.", true,
          "True. A cache timer ages entries out (15–45 seconds on some Windows versions, 4 hours by default on a Cisco interface); entries can also be removed by hand.",
          "Верно. Таймер кэша удаляет старые записи (15–45 секунд в некоторых версиях Windows, 4 часа по умолчанию на интерфейсе Cisco); удалить их можно и вручную.",
          "Answering False assumes ARP entries are permanent, but only manually added static entries stay.",
          "Ответ «неверно» предполагает, что записи ARP вечные, но остаются только статические записи, добавленные вручную."),
        qx("A threat actor replies to ARP requests with its own MAC address for the default gateway's IPv4 address. What is this attack?", "ARP spoofing (ARP poisoning)", [
          ["MAC address table overflow (flooding)", "MAC flooding fills a switch's MAC table with fake source addresses; it does not answer ARP requests.", "MAC flooding забивает таблицу коммутатора поддельными адресами источника; на ARP-запросы оно не отвечает."],
          ["DNS cache poisoning", "DNS poisoning fakes name-to-IP answers, not IP-to-MAC answers.", "Отравление DNS подделывает ответы «имя → IP», а не «IP → MAC»."],
          ["DHCP starvation", "DHCP starvation exhausts the pool of addresses on a DHCP server.", "DHCP starvation исчерпывает пул адресов DHCP-сервера."],
        ], "ARP spoofing poisons ARP caches so that frames for the gateway go to the attacker; Dynamic ARP Inspection mitigates it.", "ARP spoofing отравляет ARP-кэши, и кадры для шлюза уходят злоумышленнику; защищает от этого Dynamic ARP Inspection."),
        qx("Why can ARP slow a LAN down for a moment when many devices power up at once?", "Every device must process each broadcast request", [
          ["Each reply is flooded to every network", "Replies are unicast, and nothing ARP sends leaves the LAN.", "Ответы одноадресные, и ничего из ARP не выходит за пределы LAN."],
          ["Routers forward every ARP request to all connected networks", "Routers do not forward ARP broadcasts at all.", "Маршрутизаторы ARP-broadcast вообще не пересылают."],
          ["ARP tables are saved to NVRAM on boot", "ARP caches live in RAM and are never written to NVRAM.", "ARP-кэш живёт в RAM и в NVRAM не записывается."],
        ], "ARP requests are broadcasts; a burst of them makes every device on the LAN process every request, which can briefly reduce performance.", "ARP-запросы широковещательные; при всплеске каждое устройство LAN обрабатывает каждый запрос, и производительность ненадолго падает."),
        qx("Which ICMPv6 messages does IPv6 use in place of the ARP request and the ARP reply?", "NS and NA", [
          ["RS and RA", "Router Solicitation and Advertisement discover routers and prefixes, not neighbours' MACs.", "Router Solicitation и Advertisement обнаруживают маршрутизаторы и префиксы, а не MAC соседей."],
          ["Echo Request and Echo Reply", "Echo messages are used by ping to test reachability.", "Сообщения Echo использует ping для проверки доступности."],
          ["Redirect and RA", "Redirect points to a better first-hop router; it does not resolve addresses.", "Redirect указывает лучший маршрутизатор первого перехода; адреса он не разрешает."],
        ], "Neighbor Solicitation asks for the MAC of an IPv6 address, and Neighbor Advertisement answers it.", "Neighbor Solicitation спрашивает MAC для адреса IPv6, а Neighbor Advertisement отвечает."),
        qx("To which kind of address is an IPv6 Neighbor Solicitation for address resolution sent?", "A solicited-node multicast address", [
          ["The Ethernet broadcast FF-FF-FF-FF-FF-FF", "IPv6 has no broadcast at all; that is what ARP uses.", "В IPv6 вообще нет broadcast; так делает ARP."],
          ["The all-routers multicast FF02::2", "FF02::2 is where hosts send Router Solicitations.", "На FF02::2 хосты отправляют Router Solicitation."],
          ["The default gateway's link-local address", "The NS goes to the target's group, not to the gateway.", "NS идёт в группу цели, а не шлюзу."],
        ], "The NS goes to FF02::1:FF plus the last 24 bits of the target address, so only a few devices process it.", "NS отправляется на FF02::1:FF плюс последние 24 бита адреса цели, поэтому его обрабатывают лишь немногие устройства."),
        qx("What is the solicited-node multicast address for 2001:DB8:ACAD:10::1?", "FF02::1:FF00:1", [
          ["FF02::1", "FF02::1 is the all-nodes group, which every IPv6 interface joins.", "FF02::1 — группа всех узлов, в неё входит каждый интерфейс IPv6."],
          ["FF02::2", "FF02::2 is the all-routers group.", "FF02::2 — группа всех маршрутизаторов."],
          ["FF02::1:FFAC:AD10", "These bits come from the middle of the address; the group uses the last 24 bits.", "Эти биты взяты из середины адреса; группа строится из последних 24 бит."],
        ], "The last 24 bits of 2001:DB8:ACAD:10::1 are 00:0001, so the group is FF02::1:FF00:1 — exactly as in R1's show ipv6 interface output.", "Последние 24 бита адреса 2001:DB8:ACAD:10::1 — 00:0001, поэтому группа FF02::1:FF00:1 — как в выводе show ipv6 interface на R1."),
        qx("Which ND message does a router send to give hosts the prefix and the default gateway?", "Router Advertisement (RA)", [
          ["Router Solicitation (RS)", "A host sends an RS to ask for an RA; routers do not send RS to hosts.", "RS отправляет хост, чтобы попросить RA; маршрутизаторы RS хостам не шлют."],
          ["Neighbor Advertisement (NA)", "An NA answers a neighbour's request with a MAC address.", "NA отвечает соседу MAC-адресом."],
          ["Redirect", "Redirect only suggests a better first-hop router for a destination.", "Redirect лишь подсказывает лучший маршрутизатор первого перехода."],
        ], "Routers send RAs periodically or in reply to an RS, with the prefix, prefix length and default gateway.", "Маршрутизаторы отправляют RA периодически или в ответ на RS — с префиксом, длиной префикса и шлюзом по умолчанию."),
      ],
      deepL5P3,
    ),
    part(
      "cn-l5-p4",
      { en: "Basic router configuration and the default gateway", ru: "Базовая настройка маршрутизатора и шлюз по умолчанию" },
      {
        en: `## Basic router configuration
A router is set up with the same basic steps as a switch (lecture 1). The slide example for R1:
= Router(config)# hostname R1
= R1(config)# enable secret class
= R1(config)# line console 0
= R1(config-line)# password cisco
= R1(config-line)# login
= R1(config-line)# line vty 0 4
= R1(config-line)# password cisco
= R1(config-line)# login
= R1(config-line)# transport input ssh telnet
= R1(config-line)# exit
= R1(config)# service password-encryption
= R1(config)# banner motd # WARNING: Unauthorized access is prohibited! #
= R1(config)# exit
= R1# copy running-config startup-config
| Step | Command | Mode |
|---|---|---|
| name the device | hostname R1 | global configuration |
| secure privileged EXEC | enable secret class | global configuration |
| secure user EXEC (console) | line console 0, password, login | line configuration |
| secure remote Telnet / SSH | line vty 0 4, password, login, transport input | line configuration |
| encrypt all plaintext passwords | service password-encryption | global configuration |
| legal notification | banner motd # message # | global configuration |
| save to NVRAM | copy running-config startup-config | privileged EXEC |
- **line vty 0 4** selects the five virtual lines 0 to 4 for remote access (the switch in lecture 1 used 0 15).
- **transport input** says which protocols may use the VTY lines: **ssh** — SSH only, **telnet** — Telnet only, **ssh telnet** — both.
> Exam trap: the slide prints "service password encryption" without the hyphen; the real IOS command is **service password-encryption**.
## Configuring a router interface
= Router(config)# interface type-and-number
= Router(config-if)# description description-text
= Router(config-if)# ip address ipv4-address subnet-mask
= Router(config-if)# ipv6 address ipv6-address/prefix-length
= Router(config-if)# no shutdown
- **description** is good practice: it records information about the network connected to the interface and does not change how the interface works.
- IPv4 is entered as **address + subnet mask**, IPv6 as **address/prefix length**.
- Router interfaces are **shut down by default**. **no shutdown** activates the interface; the console then logs %LINK-3-UPDOWN … changed state to up and %LINEPROTO-5-UPDOWN … changed state to up.
The slide example for R1:
= R1(config)# interface gigabitEthernet 0/0/0
= R1(config-if)# description Link to LAN
= R1(config-if)# ip address 192.168.10.1 255.255.255.0
= R1(config-if)# ipv6 address 2001:db8:acad:10::1/64
= R1(config-if)# no shutdown
G0/0/1 is set up the same way: description "Link to R2", 209.165.200.225 255.255.255.252 and 2001:db8:feed:224::1/64.
## Verification commands
| Command | What it displays |
|---|---|
| show ip interface brief / show ipv6 interface brief | all interfaces, their IP addresses and current status |
| show ip route / show ipv6 route | the routing table stored in RAM |
| show interfaces | statistics for all interfaces; only IPv4 addressing information |
| show ip interface | IPv4 statistics for all interfaces |
| show ipv6 interface | IPv6 statistics for all interfaces |
| show running-config | the current configuration in RAM |
Reading show ip interface brief on R1:
= Interface             IP-Address       OK? Method Status                Protocol
= GigabitEthernet0/0/0  192.168.10.1     YES manual up                    up
= GigabitEthernet0/0/1  209.165.200.225  YES manual up                    up
= Vlan1                 unassigned       YES unset  administratively down down
- **up / up** — the interface works: Status is the physical (Layer 1) state, Protocol is the Layer 2 line protocol.
- **administratively down** — the interface is shut down: **no shutdown** is missing.
- **show ipv6 interface brief** lists two addresses per interface: the automatic **link-local** FE80:: address and the configured **global unicast** 2001:DB8:… address.
- **show ip route** for these two interfaces shows two **C** and two **L** routes and "Gateway of last resort is not set"; **show ipv6 route** also lists L FF00::/8 via Null0 (multicast).
- **show interfaces g0/0/0** shows the MAC address (bia), MTU 1500 bytes, bandwidth, duplex, ARP Timeout and counters such as runts and giants.
- **ping** tests reachability with ICMP Echo Request and Echo Reply.
## The default gateway on a host
- A host uses its default gateway when it sends a packet to a device on **another network**.
- The gateway is generally the **router interface attached to the host's local network**; the host and that interface must be **in the same network**.
- To reach PC3, PC1 puts **PC3's IPv4 address** into the packet but sends the frame to its default gateway, R1's G0/0/0.
## The default gateway on a switch
- A Layer 2 switch needs a default gateway only to be **managed remotely from another network** (SSH or Telnet to its management address). Switching frames between its ports works without one.
= S1(config)# ip default-gateway 192.168.10.1
- The command is entered in **global configuration** mode; the address is the router interface on the switch's management network.
> Exam trap: the hosts behind the switch do **not** use the switch's default gateway — each host has its own, configured statically or received from DHCP.
?? After an IP address was set on G0/0/0, show ip interface brief reports "administratively down down". What is missing?
?= no shutdown on the interface — router interfaces are shut down by default.
?? A switch answers ping from its own LAN but not from a PC on another network. What is the likely fix?
?= Configure ip default-gateway with the router's address on the switch, in global configuration mode.`,
        ru: `## Базовая настройка маршрутизатора
Маршрутизатор настраивается теми же базовыми шагами, что и коммутатор (лекция 1). Пример со слайда для R1:
= Router(config)# hostname R1
= R1(config)# enable secret class
= R1(config)# line console 0
= R1(config-line)# password cisco
= R1(config-line)# login
= R1(config-line)# line vty 0 4
= R1(config-line)# password cisco
= R1(config-line)# login
= R1(config-line)# transport input ssh telnet
= R1(config-line)# exit
= R1(config)# service password-encryption
= R1(config)# banner motd # WARNING: Unauthorized access is prohibited! #
= R1(config)# exit
= R1# copy running-config startup-config
| Шаг | Команда | Режим |
|---|---|---|
| задать имя устройства | hostname R1 | глобальная конфигурация |
| защитить привилегированный EXEC | enable secret class | глобальная конфигурация |
| защитить пользовательский EXEC (консоль) | line console 0, password, login | конфигурация линии |
| защитить удалённый доступ Telnet / SSH | line vty 0 4, password, login, transport input | конфигурация линии |
| зашифровать все открытые пароли | service password-encryption | глобальная конфигурация |
| юридическое предупреждение | banner motd # message # | глобальная конфигурация |
| сохранить в NVRAM | copy running-config startup-config | привилегированный EXEC |
- **line vty 0 4** выбирает пять виртуальных линий с 0 по 4 для удалённого доступа (у коммутатора в лекции 1 было 0 15).
- **transport input** задаёт, какие протоколы могут использовать линии VTY: **ssh** — только SSH, **telnet** — только Telnet, **ssh telnet** — оба.
> Ловушка экзамена: на слайде напечатано «service password encryption» без дефиса; настоящая команда IOS — **service password-encryption**.
## Настройка интерфейса маршрутизатора
= Router(config)# interface type-and-number
= Router(config-if)# description description-text
= Router(config-if)# ip address ipv4-address subnet-mask
= Router(config-if)# ipv6 address ipv6-address/prefix-length
= Router(config-if)# no shutdown
- **description (описание)** — хорошая практика: записывает сведения о сети, подключённой к интерфейсу, и не влияет на работу интерфейса.
- IPv4 вводится как **адрес + маска подсети**, IPv6 — как **адрес/длина префикса**.
- Интерфейсы маршрутизатора **по умолчанию выключены (shutdown)**. **no shutdown** включает интерфейс; консоль затем пишет %LINK-3-UPDOWN … changed state to up и %LINEPROTO-5-UPDOWN … changed state to up.
Пример со слайда для R1:
= R1(config)# interface gigabitEthernet 0/0/0
= R1(config-if)# description Link to LAN
= R1(config-if)# ip address 192.168.10.1 255.255.255.0
= R1(config-if)# ipv6 address 2001:db8:acad:10::1/64
= R1(config-if)# no shutdown
G0/0/1 настраивается так же: описание «Link to R2», 209.165.200.225 255.255.255.252 и 2001:db8:feed:224::1/64.
## Команды проверки
| Команда | Что показывает |
|---|---|
| show ip interface brief / show ipv6 interface brief | все интерфейсы, их IP-адреса и текущее состояние |
| show ip route / show ipv6 route | таблицу маршрутизации, хранящуюся в RAM |
| show interfaces | статистику всех интерфейсов; из адресации — только IPv4 |
| show ip interface | статистику IPv4 по всем интерфейсам |
| show ipv6 interface | статистику IPv6 по всем интерфейсам |
| show running-config | текущую конфигурацию в RAM |
Как читать show ip interface brief на R1:
= Interface             IP-Address       OK? Method Status                Protocol
= GigabitEthernet0/0/0  192.168.10.1     YES manual up                    up
= GigabitEthernet0/0/1  209.165.200.225  YES manual up                    up
= Vlan1                 unassigned       YES unset  administratively down down
- **up / up** — интерфейс работает: Status — физическое состояние (уровень 1), Protocol — линейный протокол уровня 2.
- **administratively down** — интерфейс выключен: не хватает **no shutdown**.
- **show ipv6 interface brief** выводит по два адреса на интерфейс: автоматический **link-local** FE80:: и настроенный **global unicast** 2001:DB8:….
- **show ip route** для этих двух интерфейсов показывает два маршрута **C**, два **L** и «Gateway of last resort is not set»; **show ipv6 route** добавляет ещё L FF00::/8 via Null0 (multicast).
- **show interfaces g0/0/0** показывает MAC-адрес (bia), MTU 1500 байт, полосу, дуплекс, ARP Timeout и счётчики вроде runts и giants.
- **ping** проверяет доступность с помощью ICMP Echo Request и Echo Reply.
## Шлюз по умолчанию на хосте
- Хост использует шлюз по умолчанию, когда отправляет пакет устройству в **другой сети**.
- Шлюз — обычно **интерфейс маршрутизатора, подключённый к локальной сети хоста**; хост и этот интерфейс должны быть **в одной сети**.
- Чтобы связаться с PC3, PC1 ставит в пакет **IPv4-адрес PC3**, но отправляет кадр своему шлюзу по умолчанию — интерфейсу G0/0/0 маршрутизатора R1.
## Шлюз по умолчанию на коммутаторе
- Коммутатору уровня 2 шлюз по умолчанию нужен только для **удалённого управления из другой сети** (SSH или Telnet на его адрес управления). Коммутация кадров между портами работает и без него.
= S1(config)# ip default-gateway 192.168.10.1
- Команда вводится в режиме **глобальной конфигурации**; адрес — интерфейс маршрутизатора в сети управления коммутатора.
> Ловушка экзамена: хосты за коммутатором **не** используют шлюз коммутатора — у каждого хоста свой шлюз, заданный вручную или полученный от DHCP.
?? После настройки IP-адреса на G0/0/0 show ip interface brief показывает «administratively down down». Чего не хватает?
?= no shutdown на интерфейсе — интерфейсы маршрутизатора по умолчанию выключены.
?? Коммутатор отвечает на ping из своей LAN, но не с ПК из другой сети. Как это скорее всего исправить?
?= Настроить на коммутаторе ip default-gateway с адресом маршрутизатора в режиме глобальной конфигурации.`,
      },
      [
        qx("An IP address was configured on R1 G0/0/0, but show ip interface brief shows administratively down down. What is missing?", "no shutdown on the interface", [
          ["copy running-config startup-config", "Saving the configuration does not bring an interface up.", "Сохранение конфигурации не включает интерфейс."],
          ["ip default-gateway on R1", "A router routes with its routing table; ip default-gateway is for switches and does not enable interfaces.", "Маршрутизатор работает по таблице маршрутизации; ip default-gateway нужен коммутаторам и интерфейсы не включает."],
          ["a description on the interface", "A description is only a comment and does not affect the state.", "Описание — только комментарий, на состояние оно не влияет."],
        ], "Router interfaces are shut down by default; administratively down means no shutdown has not been entered.", "Интерфейсы маршрутизатора по умолчанию выключены; administratively down значит, что no shutdown не введена."),
        qx("Which interface command records that G0/0/0 connects to the LAN, without changing how the interface works?", "description Link to LAN", [
          ["banner motd #Link to LAN#", "banner motd is a global message shown at login, not an interface note.", "banner motd — общее сообщение при входе, а не пометка интерфейса."],
          ["hostname Link-to-LAN", "hostname renames the whole device.", "hostname переименовывает всё устройство."],
          ["name Link to LAN", "There is no such interface command in the lecture; the keyword is description.", "Такой команды интерфейса в лекции нет; нужно ключевое слово description."],
        ], "description adds information about the connected network to the interface — good practice that does not affect operation.", "description добавляет к интерфейсу сведения о подключённой сети — хорошая практика, на работу она не влияет."),
        qx("Which command assigns an IPv6 address to a router interface?", "ipv6 address 2001:db8:acad:10::1/64", [
          ["ip address 2001:db8:acad:10::1/64", "ip address is for IPv4 and expects an address with a subnet mask.", "ip address служит для IPv4 и ждёт адрес с маской подсети."],
          ["ipv6 address 2001:db8:acad:10::1 255.255.255.0", "IPv6 uses a prefix length after a slash, not a dotted subnet mask.", "В IPv6 после косой черты пишется длина префикса, а не маска с точками."],
          ["ipv6 route 2001:db8:acad:10::1/64", "ipv6 route creates a static route; it does not address an interface.", "ipv6 route создаёт статический маршрут, а не адресует интерфейс."],
        ], "In interface configuration mode IPv6 is entered as ipv6 address followed by address/prefix-length.", "В режиме конфигурации интерфейса IPv6 задаётся командой ipv6 address с адресом/длиной префикса."),
        qx("Which VTY line command allows remote sessions over SSH only?", "transport input ssh", [
          ["transport input ssh telnet", "This allows both SSH and Telnet, as in the slide example.", "Так разрешены и SSH, и Telnet, как в примере на слайде."],
          ["transport input telnet", "This allows only Telnet, which sends everything in plaintext.", "Так разрешён только Telnet, который передаёт всё открытым текстом."],
          ["login", "login only turns on password checking on the line.", "login лишь включает проверку пароля на линии."],
        ], "transport input selects which protocols may use the VTY lines; ssh alone blocks Telnet.", "transport input выбирает протоколы, которым разрешены линии VTY; один ssh закрывает Telnet."),
        qx("Which command lists every interface with its link-local and global IPv6 addresses and its status?", "show ipv6 interface brief", [
          ["show ip interface brief", "This shows only IPv4 addresses.", "Эта команда показывает только адреса IPv4."],
          ["show ipv6 route", "This shows the IPv6 routing table, not the interface list.", "Эта команда показывает таблицу маршрутизации IPv6, а не список интерфейсов."],
          ["show running-config | include ipv6", "The configuration lists only typed commands, without status or the automatic link-local address.", "В конфигурации есть только введённые команды — без состояния и без автоматического link-local адреса."],
        ], "show ipv6 interface brief prints each interface with [up/up] and its FE80:: link-local and global unicast addresses.", "show ipv6 interface brief выводит каждый интерфейс с [up/up], его link-local FE80:: и global unicast адреса."),
        qx("Which command shows statistics such as MTU, duplex and runts for all interfaces, but only IPv4 addressing?", "show interfaces", [
          ["show ip route", "show ip route displays the routing table, not interface counters.", "show ip route показывает таблицу маршрутизации, а не счётчики интерфейсов."],
          ["show ipv6 interface brief", "The brief form lists addresses and status without statistics.", "Краткая форма выводит адреса и состояние без статистики."],
          ["show ip arp", "show ip arp lists IPv4-to-MAC mappings.", "show ip arp выводит соответствия IPv4 → MAC."],
        ], "show interfaces displays statistics for all interfaces and only IPv4 addressing information.", "show interfaces показывает статистику всех интерфейсов и из адресации только IPv4."),
        qx("R1 G0/0/0 is configured with 192.168.10.1 255.255.255.0 and is up. Which entries does it add to show ip route?", "C 192.168.10.0/24 and L 192.168.10.1/32", [
          ["C 192.168.10.1/32 and L 192.168.10.0/24", "The codes are swapped: C is the network, L is the interface's own /32 address.", "Коды перепутаны: C — сеть, L — собственный адрес интерфейса /32."],
          ["S 192.168.10.0/24 and S* 0.0.0.0/0", "Static routes appear only when an administrator configures them.", "Статические маршруты появляются, только если их настроит администратор."],
          ["Only O 192.168.10.0/24", "O routes are learned from OSPF neighbours, not from the router's own interface.", "Маршруты O приходят от соседей по OSPF, а не от собственного интерфейса."],
        ], "An active, addressed interface adds a connected network (C) and a local host route (L) automatically.", "Активный интерфейс с адресом автоматически добавляет подключённую сеть (C) и локальный маршрут хоста (L)."),
        qx("R1's routing table says Gateway of last resort is not set. What does this mean?", "R1 has no default route configured", [
          ["No interface of R1 has an IP address", "The same output shows C and L routes, so interfaces are addressed.", "В том же выводе есть маршруты C и L, значит, адреса у интерфейсов есть."],
          ["The LAN hosts have no default gateway", "The message describes R1's own table, not the hosts' settings.", "Сообщение описывает таблицу самого R1, а не настройки хостов."],
          ["OSPF is not running", "The gateway of last resort is about the default route, not about which routing protocol runs.", "Шлюз последней надежды — это про маршрут по умолчанию, а не про то, какой протокол маршрутизации работает."],
        ], "The gateway of last resort is the default route; until one is configured, R1 drops packets that match no route.", "Шлюз последней надежды — это маршрут по умолчанию; пока его нет, R1 отбрасывает пакеты, под которые не подходит ни один маршрут."),
        qx("PC1 is 192.168.10.10/24. Which address can be its default gateway?", "192.168.10.1, R1's LAN interface", [
          ["192.168.20.1, R1's other interface", "That interface is on another network; the gateway must be in PC1's own network.", "Этот интерфейс в другой сети; шлюз должен быть в собственной сети PC1."],
          ["209.165.200.225, R1's WAN interface", "The WAN interface is not attached to PC1's LAN.", "WAN-интерфейс не подключён к LAN компьютера PC1."],
          ["127.0.0.1, its own loopback", "Loopback only tests the local stack; it cannot forward traffic off the LAN.", "Loopback лишь проверяет свой стек; выводить трафик из LAN он не может."],
        ], "The host and the gateway interface must be in the same network: 192.168.10.1 is on 192.168.10.0/24 together with PC1.", "Хост и интерфейс шлюза должны быть в одной сети: 192.168.10.1 находится в 192.168.10.0/24 вместе с PC1."),
        qx("Why does a Layer 2 switch need a default gateway?", "To be managed remotely from another network", [
          ["To forward frames between hosts connected to its own ports", "Switching between its ports uses the MAC table and works without a gateway.", "Коммутация между портами идёт по таблице MAC и работает без шлюза."],
          ["To learn MAC addresses on its ports", "MAC learning comes from source addresses of incoming frames.", "MAC-адреса изучаются по адресам источника входящих кадров."],
          ["To give the hosts their IP settings", "Hosts get their settings statically or from DHCP, not from the switch's gateway.", "Хосты получают настройки вручную или от DHCP, а не от шлюза коммутатора."],
        ], "The gateway lets the switch answer management traffic (SSH, Telnet, ping) that comes from other networks.", "Шлюз позволяет коммутатору отвечать на управляющий трафик (SSH, Telnet, ping) из других сетей."),
        qx("Which command sets the default gateway on a Cisco switch?", "ip default-gateway 192.168.10.1", [
          ["ip default-network 192.168.10.1", "ip default-network is a different router command, not the switch gateway from the lecture.", "ip default-network — другая команда маршрутизатора, а не шлюз коммутатора из лекции."],
          ["gateway 192.168.10.1", "IOS has no plain gateway command.", "Простой команды gateway в IOS нет."],
          ["ip gateway default 192.168.10.1", "The keywords are in the wrong order; IOS would reject it.", "Ключевые слова идут не в том порядке; IOS её не примет."],
        ], "ip default-gateway ip-address is entered in global configuration mode on the switch.", "ip default-gateway ip-address вводится на коммутаторе в режиме глобальной конфигурации."),
        tfx("The line vty 0 4 command selects five virtual lines for remote access.", true,
          "True. Lines 0, 1, 2, 3 and 4 make five VTY lines for Telnet or SSH sessions.",
          "Верно. Линии 0, 1, 2, 3 и 4 — это пять линий VTY для сеансов Telnet или SSH.",
          "Answering False forgets that counting starts at 0: 0 to 4 is five lines, not four.",
          "Ответ «неверно» забывает, что счёт идёт с 0: от 0 до 4 — пять линий, а не четыре."),
      ],
      deepL5P4,
    ),
  ],
};
