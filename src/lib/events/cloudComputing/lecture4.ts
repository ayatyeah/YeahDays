import { part, qx, tfx, type Lecture } from "../types";

export const lecture4: Lecture = {
  id: "cc-l4",
  title: { en: "Lecture 4 — Networking and Content Delivery", ru: "Лекция 4 — Сети и доставка контента" },
  parts: [
    part(
      "cc-l4-p1",
      { en: "Networking basics", ru: "Основы сетей" },
      {
        en: `## What a computer network is
A **computer network** is two or more client machines that are connected together to **share resources**.
- A network can be **logically partitioned into subnets** — smaller parts of the network.
- Networking needs a **networking device** — a **router** or a **switch** — that connects the clients and lets them communicate.
- In the lecture diagram **Subnet 1** and **Subnet 2** are joined by a **router**: switches connect the machines inside a subnet, the router connects the subnets to each other.
![A small office network: one router in the middle with blue Ethernet cables running to two switches, each switch wired to three desktop PCs, paper labels 'Subnet 1' and 'Subnet 2' stuck on the switches](/events/cc/l4-router-two-subnets.webp)
## IP addresses
Each client machine in a network has a unique **Internet Protocol (IP) address** that identifies it.
- An IP address is a **numerical label** that people write in **decimal**; machines convert it to **binary**.
- An IPv4 address has **four numbers separated by dots**. Each number is **8 bits** (an **octet**), so it can be anything from **0 to 255**.
- 4 × 8 = **32 bits** in total.
= 192.0.2.0 = 11000000.00000000.00000010.00000000
| Decimal | Binary (8 bits) |
|---|---|
| 192 | 11000000 |
| 0 | 00000000 |
| 2 | 00000010 |
| 255 | 11111111 (the largest octet) |
## IPv4 and IPv6
- **IPv4** — a **32-bit** address, four decimal numbers separated by dots: 192.0.2.0.
- **IPv6** — a **128-bit** address that can accommodate **many more devices**. It is written as **eight groups of four hexadecimal digits** separated by **colons (:)**.
- Each IPv6 group is **16 bits** and can be anything from **0 to FFFF**; 8 × 16 = **128 bits**.
= IPv6: 2600:1f18:22ba:8c00:ba86:a05e:a5ba:00FF
| Feature | IPv4 | IPv6 |
|---|---|---|
| Length | 32 bits | 128 bits |
| Groups | 4 decimal numbers | 8 hexadecimal groups |
| Separator | dot (.) | colon (:) |
| One group | 8 bits, 0–255 | 16 bits, 0–FFFF |
| Example | 192.0.2.0 | 2600:1f18:22ba:8c00:ba86:a05e:a5ba:00FF |
## CIDR — Classless Inter-Domain Routing
**CIDR** is a common way to describe a network: it expresses a **group of consecutive IP addresses**. A CIDR address has three pieces:
- an **IP address** — the **first address** of the network;
- a **slash** character (/);
- a **number** that tells you **how many bits are fixed** — the **routing prefix**, also called the **network identifier**.
The bits that are not fixed are **flexible**: they form the **host identifier** and are allowed to change.
@diagram subnet-mask
## Counting addresses
The number of addresses in a CIDR block is **2 to the power of the flexible bits**:
= count = 2^(32 - prefix)
- **192.0.2.0/24** — the first 24 bits are fixed, the last 8 are flexible: 2^8 = **256** addresses, from 192.0.2.0 to 192.0.2.255. Only the **fourth** number changes.
- **192.0.0.0/16** — 16 bits are fixed, 16 are flexible: 2^16 = **65,536** addresses, from 192.0.0.0 to 192.0.255.255. The **third and fourth** numbers change. (The slide writes it as 192.0.2.0/16 — the network still starts at 192.0.0.0.)
- **10.0.0.0/28** — 4 flexible bits: 2^4 = **16** addresses, from 10.0.0.0 to 10.0.0.15.
Two special cases:
- **/32** — every bit is fixed, so it is **one single IP address** (for example 192.0.2.0/32). It is useful in a **firewall rule** that gives access to **one specific host**.
- **0.0.0.0/0** — every bit is flexible: it means **the whole internet** (every address).
| CIDR | Fixed bits | Flexible bits | Addresses |
|---|---|---|---|
| /32 | 32 | 0 | 1 |
| /28 | 28 | 4 | 16 |
| /24 | 24 | 8 | 256 |
| /20 | 20 | 12 | 4,096 |
| /16 | 16 | 16 | 65,536 |
| /0 | 0 | 32 | all (about 4.3 billion) |
The bigger the number after the slash, the **smaller** the network.
## The OSI model
The **Open Systems Interconnection (OSI) model** is a **conceptual model** that explains how data travels over a network. It has **seven layers** and shows the common protocols and addresses used at each layer.
- **Hubs and switches** work at **layer 2** (data link); **routers** work at **layer 3** (network).
- The same model helps to understand how communication takes place inside a **virtual private cloud (VPC)**.
| Layer | No. | Function | Protocol / address |
|---|---|---|---|
| Application | 7 | means for an application to access the network | HTTP(S), FTP, DHCP, LDAP |
| Presentation | 6 | makes sure the application layer can read the data; encryption | ASCII, ICA |
| Session | 5 | enables an orderly exchange of data | NetBIOS, RPC |
| Transport | 4 | protocols for host-to-host communication | TCP, UDP |
| Network | 3 | routing and packet forwarding (routers) | IP |
| Data link | 2 | transfers data inside the same LAN (hubs and switches) | MAC |
| Physical | 1 | sends and receives raw bitstreams over a physical medium | signals (1s and 0s) |
@diagram osi-tcpip
> CIDR in one line: the number after the slash is the count of fixed network bits, and 2^(32 − prefix) is how many addresses you get — /24 = 256, /16 = 65,536, /32 = one host, /0 = the internet.
?? How many IP addresses are in 172.16.0.0/20, and which one is the last?
?= 2^(32 − 20) = 2^12 = 4,096 addresses, from 172.16.0.0 to 172.16.15.255.
?? At which OSI layers do a switch and a router work?
?= A switch works at layer 2 (data link, MAC addresses); a router works at layer 3 (network, IP addresses and routing).`,
        ru: `## Что такое компьютерная сеть
**Компьютерная сеть (computer network)** — два или более клиентских компьютера, соединённых вместе, чтобы **совместно использовать ресурсы**.
- Сеть можно **логически разделить на подсети (subnets)** — меньшие части сети.
- Для работы сети нужно **сетевое устройство** — **router (маршрутизатор)** или **switch (коммутатор)**, — которое соединяет клиентов и позволяет им общаться.
- На схеме лекции **Subnet 1** и **Subnet 2** соединены **router**: коммутаторы связывают машины внутри подсети, а маршрутизатор связывает подсети между собой.
![Небольшая офисная сеть: в центре маршрутизатор, от него синие Ethernet-кабели идут к двум коммутаторам, к каждому подключены три настольных ПК; на коммутаторах бумажные наклейки «Subnet 1» и «Subnet 2»](/events/cc/l4-router-two-subnets.webp)
## IP-адреса
У каждого клиентского компьютера в сети есть уникальный **IP-адрес (Internet Protocol address)**, который его идентифицирует.
- IP-адрес — **числовая метка**, которую люди пишут в **десятичном** виде; машины переводят её в **двоичный**.
- Адрес IPv4 — это **четыре числа через точку**. Каждое число — **8 бит** (**октет**), поэтому оно может быть от **0 до 255**.
- 4 × 8 = **32 бита** всего.
= 192.0.2.0 = 11000000.00000000.00000010.00000000
| Десятичное | Двоичное (8 бит) |
|---|---|
| 192 | 11000000 |
| 0 | 00000000 |
| 2 | 00000010 |
| 255 | 11111111 (наибольший октет) |
## IPv4 и IPv6
- **IPv4** — **32-битный** адрес, четыре десятичных числа через точку: 192.0.2.0.
- **IPv6** — **128-битный** адрес, который вмещает **намного больше устройств**. Он записывается как **восемь групп по четыре шестнадцатеричные цифры**, разделённых **двоеточиями (:)**.
- Каждая группа IPv6 — **16 бит**, значение от **0 до FFFF**; 8 × 16 = **128 бит**.
= IPv6: 2600:1f18:22ba:8c00:ba86:a05e:a5ba:00FF
| Признак | IPv4 | IPv6 |
|---|---|---|
| Длина | 32 бита | 128 бит |
| Группы | 4 десятичных числа | 8 шестнадцатеричных групп |
| Разделитель | точка (.) | двоеточие (:) |
| Одна группа | 8 бит, 0–255 | 16 бит, 0–FFFF |
| Пример | 192.0.2.0 | 2600:1f18:22ba:8c00:ba86:a05e:a5ba:00FF |
## CIDR — Classless Inter-Domain Routing
**CIDR (бесклассовая междоменная маршрутизация)** — распространённый способ описать сеть: он задаёт **группу идущих подряд IP-адресов**. Адрес CIDR состоит из трёх частей:
- **IP-адрес** — **первый адрес** сети;
- символ **косой черты** (/);
- **число**, которое говорит, **сколько бит зафиксировано**, — это **routing prefix (префикс маршрутизации)**, его же называют **network identifier (идентификатор сети)**.
Незафиксированные биты — **гибкие (flexible)**: они образуют **host identifier (идентификатор узла)** и могут меняться.
@diagram subnet-mask
## Считаем адреса
Количество адресов в блоке CIDR — **2 в степени числа гибких бит**:
= count = 2^(32 - prefix)
- **192.0.2.0/24** — первые 24 бита зафиксированы, последние 8 гибкие: 2^8 = **256** адресов, от 192.0.2.0 до 192.0.2.255. Меняется только **четвёртое** число.
- **192.0.0.0/16** — зафиксировано 16 бит, гибких 16: 2^16 = **65 536** адресов, от 192.0.0.0 до 192.0.255.255. Меняются **третье и четвёртое** числа. (На слайде это записано как 192.0.2.0/16 — но сама сеть всё равно начинается с 192.0.0.0.)
- **10.0.0.0/28** — 4 гибких бита: 2^4 = **16** адресов, от 10.0.0.0 до 10.0.0.15.
Два особых случая:
- **/32** — зафиксированы все биты, это **один-единственный IP-адрес** (например, 192.0.2.0/32). Удобно в **правиле firewall**, которое даёт доступ **одному конкретному хосту**.
- **0.0.0.0/0** — гибкие все биты: это **весь интернет** (любой адрес).
| CIDR | Фиксированных бит | Гибких бит | Адресов |
|---|---|---|---|
| /32 | 32 | 0 | 1 |
| /28 | 28 | 4 | 16 |
| /24 | 24 | 8 | 256 |
| /20 | 20 | 12 | 4 096 |
| /16 | 16 | 16 | 65 536 |
| /0 | 0 | 32 | все (около 4,3 млрд) |
Чем больше число после косой черты, тем **меньше** сеть.
## Модель OSI
**Модель OSI (Open Systems Interconnection)** — **концептуальная модель**, которая объясняет, как данные проходят по сети. В ней **семь уровней**, и она показывает типичные протоколы и адреса каждого уровня.
- **Hubs и switches** работают на **уровне 2** (data link, канальный); **routers** — на **уровне 3** (network, сетевой).
- Та же модель помогает понять, как идёт обмен данными внутри **virtual private cloud (VPC)**.
| Уровень | № | Функция | Протокол / адрес |
|---|---|---|---|
| Application | 7 | способ для приложения получить доступ к сети | HTTP(S), FTP, DHCP, LDAP |
| Presentation | 6 | гарантирует, что уровень приложений сможет прочитать данные; шифрование | ASCII, ICA |
| Session | 5 | обеспечивает упорядоченный обмен данными | NetBIOS, RPC |
| Transport | 4 | протоколы для связи хост — хост | TCP, UDP |
| Network | 3 | маршрутизация и пересылка пакетов (routers) | IP |
| Data link | 2 | передача данных внутри одной LAN (hubs и switches) | MAC |
| Physical | 1 | передача и приём «сырого» потока бит через физическую среду | сигналы (1 и 0) |
@diagram osi-tcpip
> CIDR одной строкой: число после косой черты — это число фиксированных бит сети, а 2^(32 − prefix) — сколько получится адресов: /24 = 256, /16 = 65 536, /32 = один хост, /0 = весь интернет.
?? Сколько IP-адресов в блоке 172.16.0.0/20 и какой из них последний?
?= 2^(32 − 20) = 2^12 = 4 096 адресов, от 172.16.0.0 до 172.16.15.255.
?? На каких уровнях OSI работают switch и router?
?= Switch — на уровне 2 (data link, MAC-адреса); router — на уровне 3 (network, IP-адреса и маршрутизация).`,
      },
      [
        qx("How many bits make up an IPv4 address?", "32 bits", [
          ["128 bits", "128 bits is the length of an IPv6 address.", "128 бит — это длина адреса IPv6."],
          ["64 bits", "No IP version uses 64-bit addresses; IPv4 is four 8-bit octets.", "Ни одна версия IP не использует 64-битные адреса; IPv4 — это четыре октета по 8 бит."],
          ["8 bits", "8 bits is only one of the four numbers — a single octet.", "8 бит — это лишь одно из четырёх чисел, один октет."],
        ], "An IPv4 address is four numbers of 8 bits each: 4 × 8 = 32 bits.", "Адрес IPv4 — четыре числа по 8 бит: 4 × 8 = 32 бита."),
        qx("What values can each dot-separated number of an IPv4 address take?", "0 to 255", [
          ["0 to 256", "There are 256 values, but counting starts at 0, so the largest is 255.", "Значений 256, но счёт идёт с нуля, поэтому наибольшее — 255."],
          ["1 to 255", "Zero is a valid octet value, as in 192.0.2.0.", "Ноль — допустимое значение октета, как в 192.0.2.0."],
          ["0 to FFFF", "0 to FFFF is the range of one 16-bit IPv6 group.", "0–FFFF — диапазон одной 16-битной группы IPv6."],
        ], "Each number is 8 bits, so it runs from 00000000 (0) to 11111111 (255).", "Каждое число — 8 бит, поэтому от 00000000 (0) до 11111111 (255)."),
        qx("Which description matches an IPv6 address?", "Eight 16-bit hex groups separated by colons", [
          ["Four 8-bit decimal numbers separated by dots", "That describes an IPv4 address.", "Это описание адреса IPv4."],
          ["Eight 8-bit hex groups separated by dots", "IPv6 groups are 16 bits each and are separated by colons, not dots.", "Группы IPv6 — по 16 бит и разделяются двоеточиями, а не точками."],
          ["Sixteen 8-bit hex groups separated by dashes", "IPv6 has eight groups and uses colons; dashes are not used.", "В IPv6 восемь групп и двоеточия; дефисы не используются."],
        ], "IPv6 is 128 bits: eight groups of four hexadecimal digits (16 bits each), separated by colons.", "IPv6 — 128 бит: восемь групп по четыре шестнадцатеричные цифры (по 16 бит), через двоеточие."),
        qx("Why are IPv6 addresses used alongside IPv4?", "Their 128 bits fit many more user devices", [
          ["They encrypt every packet by default", "The lecture gives a bigger address space as the reason, not encryption.", "Лекция называет причиной больший объём адресов, а не шифрование."],
          ["They are shorter and easier to type", "IPv6 addresses are longer: eight hex groups instead of four numbers.", "Адреса IPv6 длиннее: восемь шестнадцатеричных групп вместо четырёх чисел."],
          ["They replace MAC addresses inside a LAN", "IPv6 is an IP (layer 3) address; MAC addresses are still used at layer 2.", "IPv6 — это IP-адрес (уровень 3); MAC-адреса по-прежнему нужны на уровне 2."],
        ], "IPv6 addresses are 128 bits, so they can accommodate far more devices than 32-bit IPv4.", "Адреса IPv6 — 128 бит, поэтому вмещают намного больше устройств, чем 32-битный IPv4."),
        qx("What is the binary form of the octet 192?", "11000000", [
          ["10100000", "10100000 is 128 + 32 = 160.", "10100000 — это 128 + 32 = 160."],
          ["11100000", "11100000 is 128 + 64 + 32 = 224.", "11100000 — это 128 + 64 + 32 = 224."],
          ["00000011", "00000011 is 2 + 1 = 3; the high-value bits are on the left.", "00000011 — это 2 + 1 = 3; старшие биты стоят слева."],
        ], "192 = 128 + 64, so the two left-most bits are 1: 11000000.", "192 = 128 + 64, поэтому две левые единицы: 11000000."),
        qx("In the CIDR address 192.0.2.0/24, what does the 24 tell you?", "How many bits are fixed for the network", [
          ["How many hosts the network can hold", "The block holds 2^8 = 256 addresses; 24 is the count of fixed bits.", "В блоке 2^8 = 256 адресов; 24 — это число фиксированных бит."],
          ["How many bits are flexible for hosts", "The flexible bits are the remaining 32 − 24 = 8.", "Гибких бит остаётся 32 − 24 = 8."],
          ["How many subnets the whole network contains", "The prefix says nothing about how many subnets exist.", "Префикс ничего не говорит о количестве подсетей."],
        ], "The number after the slash is how many left-most bits form the fixed routing prefix (network identifier).", "Число после косой черты — сколько левых бит зафиксировано под routing prefix (идентификатор сети)."),
        qx("How many IP addresses does the block 192.0.2.0/24 contain?", "256", [
          ["254", "254 is the classic usable host count; CIDR counts all 2^8 = 256 addresses.", "254 — классическое число узлов; CIDR считает все 2^8 = 256 адресов."],
          ["24", "24 is the number of fixed bits, not the number of addresses.", "24 — число фиксированных бит, а не адресов."],
          ["65,536", "65,536 is the size of a /16 block.", "65 536 — размер блока /16."],
        ], "32 − 24 = 8 flexible bits, and 2^8 = 256 addresses: 192.0.2.0 to 192.0.2.255.", "32 − 24 = 8 гибких бит, 2^8 = 256 адресов: от 192.0.2.0 до 192.0.2.255."),
        qx("How many IP addresses does a /16 CIDR block contain?", "65,536", [
          ["16", "16 is the number of fixed bits, not the number of addresses.", "16 — число фиксированных бит, а не адресов."],
          ["256", "256 is a /24 block, which has only 8 flexible bits.", "256 — это блок /24, в нём всего 8 гибких бит."],
          ["16,777,216", "16,777,216 is a /8 block with 24 flexible bits.", "16 777 216 — это блок /8 с 24 гибкими битами."],
        ], "A /16 leaves 16 flexible bits: 2^16 = 65,536 addresses.", "В /16 остаётся 16 гибких бит: 2^16 = 65 536 адресов."),
        qx("An admin sees the block 192.0.0.0/16. What is the last address in it?", "192.0.255.255", [
          ["192.0.0.255", "That is the end of 192.0.0.0/24; a /16 lets the third number change too.", "Это конец блока 192.0.0.0/24; в /16 меняется и третье число."],
          ["192.0.16.255", "16 is the prefix length, it is not part of the address range.", "16 — длина префикса, она не входит в диапазон адресов."],
          ["192.255.255.255", "That is the end of 192.0.0.0/8; a /16 keeps the first two numbers fixed.", "Это конец блока 192.0.0.0/8; в /16 первые два числа зафиксированы."],
        ], "With /16 the first two numbers are fixed and the last two run from 0 to 255, so it ends at 192.0.255.255.", "В /16 первые два числа зафиксированы, а последние два идут от 0 до 255, поэтому блок заканчивается на 192.0.255.255."),
        qx("A firewall rule must allow exactly one host, 203.0.113.10. Which CIDR do you write?", "203.0.113.10/32", [
          ["203.0.113.10/24", "/24 covers 256 addresses, not a single host.", "/24 охватывает 256 адресов, а не один хост."],
          ["203.0.113.10/0", "/0 fixes no bits, so it means every address — the whole internet.", "/0 не фиксирует ни одного бита, то есть означает весь интернет."],
          ["203.0.113.10/16", "/16 covers 65,536 addresses.", "/16 охватывает 65 536 адресов."],
        ], "With /32 every bit is fixed, so the block is exactly one IP address.", "В /32 зафиксированы все биты, поэтому блок — ровно один IP-адрес."),
        qx("Which CIDR block stands for the whole internet?", "0.0.0.0/0", [
          ["0.0.0.0/32", "/32 fixes every bit, so it is one single address.", "/32 фиксирует все биты, это один-единственный адрес."],
          ["255.255.255.255/32", "That is one single address, not every address.", "Это один адрес, а не все адреса сразу."],
          ["127.0.0.0/8", "127.0.0.0/8 is the loopback range of one machine, not the internet.", "127.0.0.0/8 — диапазон loopback одной машины, а не интернет."],
        ], "In 0.0.0.0/0 no bit is fixed, so every IPv4 address matches.", "В 0.0.0.0/0 не зафиксирован ни один бит, поэтому подходит любой адрес IPv4."),
        qx("In CIDR notation, what are the fixed left-most bits of the address called?", "The network identifier", [
          ["The host identifier", "The host identifier is the flexible part that is allowed to change.", "Host identifier — гибкая часть, которая может меняться."],
          ["The broadcast address", "The broadcast address is one specific address, the last one in the range.", "Широковещательный адрес — один конкретный адрес, последний в диапазоне."],
          ["The interface identifier", "Interface ID is the IPv6 name for the host part, not the fixed part.", "Interface ID — так в IPv6 называют узловую часть, а не фиксированную."],
        ], "The fixed bits are the routing prefix, also called the network identifier.", "Фиксированные биты — это routing prefix, его же называют network identifier."),
        tfx("The larger the number after the slash, the more IP addresses a CIDR block contains.", false,
          "It is the opposite: a larger prefix fixes more bits, so fewer addresses remain — /28 has 16, /16 has 65,536.",
          "Наоборот: больший префикс фиксирует больше бит, и адресов остаётся меньше — в /28 их 16, в /16 — 65 536.",
          "'True' mixes up fixed and flexible bits: only the flexible bits create addresses.",
          "Ответ «верно» путает фиксированные и гибкие биты: адреса дают только гибкие биты."),
        qx("What is CIDR used for?", "Describing a block of consecutive IP addresses", [
          ["Translating domain names into numeric IP addresses", "That is the job of DNS, not CIDR.", "Это работа DNS, а не CIDR."],
          ["Assigning MAC addresses to network cards", "MAC addresses are burned into NICs by vendors; CIDR is about IP ranges.", "MAC-адреса вшивает в сетевые карты производитель; CIDR — про диапазоны IP."],
          ["Encrypting traffic between two networks", "Encryption is done by protocols such as TLS or a VPN, not by CIDR.", "Шифрованием занимаются протоколы вроде TLS или VPN, а не CIDR."],
        ], "CIDR expresses a group of consecutive IP addresses as first address + slash + number of fixed bits.", "CIDR задаёт группу идущих подряд IP-адресов: первый адрес + косая черта + число фиксированных бит."),
        qx("Two subnets in an office must exchange traffic. Which device connects them?", "A router", [
          ["A hub", "A hub only repeats signals inside one segment; it cannot join subnets.", "Hub лишь повторяет сигнал внутри одного сегмента и не соединяет подсети."],
          ["A patch panel", "A patch panel is passive cabling hardware; it forwards nothing.", "Патч-панель — пассивное оборудование для кабелей, она ничего не пересылает."],
          ["A network card", "A NIC connects one computer to a network, not two subnets to each other.", "Сетевая карта подключает один компьютер к сети, а не две подсети друг к другу."],
        ], "In the lecture diagram a router joins Subnet 1 and Subnet 2; routers work at layer 3.", "На схеме лекции router соединяет Subnet 1 и Subnet 2; маршрутизаторы работают на уровне 3."),
        qx("At which OSI layer do routers work?", "Layer 3 - Network", [
          ["Layer 2 - Data link", "Layer 2 is where hubs and switches work, with MAC addresses.", "На уровне 2 работают hubs и switches с MAC-адресами."],
          ["Layer 4 - Transport", "Layer 4 holds TCP and UDP for host-to-host communication.", "На уровне 4 — TCP и UDP для связи хост — хост."],
          ["Layer 1 - Physical", "Layer 1 carries raw bits as signals and makes no routing decisions.", "Уровень 1 передаёт сырые биты сигналами и не принимает решений о маршруте."],
        ], "Layer 3 does routing and packet forwarding with IP addresses — exactly the job of routers.", "Уровень 3 отвечает за маршрутизацию и пересылку пакетов по IP-адресам — это и есть работа routers."),
        qx("Which OSI layer transfers data inside the same LAN using MAC addresses?", "Layer 2 - Data link", [
          ["Layer 3 - Network", "Layer 3 routes packets between networks with IP addresses.", "Уровень 3 маршрутизирует пакеты между сетями по IP-адресам."],
          ["Layer 1 - Physical", "Layer 1 only sends raw bitstreams; it knows nothing about MAC addresses.", "Уровень 1 лишь передаёт поток бит и ничего не знает о MAC-адресах."],
          ["Layer 7 - Application", "Layer 7 gives applications access to the network (HTTP, FTP, DHCP).", "Уровень 7 даёт приложениям доступ к сети (HTTP, FTP, DHCP)."],
        ], "The data link layer moves data inside one LAN; hubs and switches work there, addressing by MAC.", "Канальный уровень передаёт данные внутри одной LAN; там работают hubs и switches, адресация по MAC."),
        qx("Which pair of protocols works at the OSI transport layer?", "TCP and UDP", [
          ["HTTP and FTP", "HTTP and FTP are application layer (layer 7) protocols.", "HTTP и FTP — протоколы уровня приложений (уровень 7)."],
          ["NetBIOS and RPC", "NetBIOS and RPC are listed at the session layer (layer 5).", "NetBIOS и RPC отнесены к сеансовому уровню (уровень 5)."],
          ["IP and ICMP", "IP works at the network layer (layer 3).", "IP работает на сетевом уровне (уровень 3)."],
        ], "Layer 4 provides host-to-host communication with TCP and UDP.", "Уровень 4 обеспечивает связь хост — хост с помощью TCP и UDP."),
        qx("Which OSI layer makes sure the application layer can read the data, including encryption?", "Layer 6 - Presentation", [
          ["Layer 5 - Session", "The session layer enables an orderly exchange of data (NetBIOS, RPC).", "Сеансовый уровень обеспечивает упорядоченный обмен данными (NetBIOS, RPC)."],
          ["Layer 7 - Application", "Layer 7 gives applications access to the network (HTTP, FTP, DHCP).", "Уровень 7 даёт приложениям доступ к сети (HTTP, FTP, DHCP)."],
          ["Layer 4 - Transport", "Layer 4 provides host-to-host communication with TCP and UDP.", "Уровень 4 обеспечивает связь хост — хост с помощью TCP и UDP."],
        ], "The presentation layer ensures the data is readable for the application layer and handles encryption (ASCII, ICA).", "Уровень представления делает данные читаемыми для уровня приложений и отвечает за шифрование (ASCII, ICA)."),
        tfx("A computer network is two or more client machines connected together to share resources.", true,
          "That is the lecture's definition; a network can also be partitioned into subnets joined by a router.",
          "Это определение из лекции; сеть ещё можно разделить на подсети, соединённые router.",
          "'False' would need a different definition, but the lecture defines a network exactly this way.",
          "Ответ «неверно» требовал бы другого определения, а лекция определяет сеть именно так."),
      ],
    ),
    part(
      "cc-l4-p2",
      { en: "Amazon VPC, subnets and addressing", ru: "Amazon VPC, подсети и адресация" },
      {
        en: `## Amazon VPC
**Amazon Virtual Private Cloud (Amazon VPC)** is the AWS service that lets you provision a **logically isolated section of the AWS Cloud** — a **virtual private cloud (VPC)** — where you launch AWS resources in a **virtual network that you define**.
Many on-premises networking ideas still apply in the cloud, but much of the complexity is abstracted away **without sacrificing control, security and usability**. Amazon VPC gives you control over:
- the **selection of your own IP address range**;
- the **creation of subnets**;
- the **configuration of route tables and network gateways**.
It also lets you:
- use both **IPv4 and IPv6** for secure access to resources and applications;
- **customize the network configuration** — for example, a **public subnet** for web servers that can reach the internet, and a **private subnet** with no public internet access for back-end systems such as **databases or application servers**;
- use **multiple layers of security** — **security groups** and **network ACLs** — to control access to the **Amazon EC2 instances** in each subnet.
![AWS Management Console screenshot of the 'Create VPC' page: name tag 'lab-vpc', the IPv4 CIDR block field filled with 10.0.0.0/16, the IPv6 option set to 'No IPv6 CIDR block' and an orange 'Create VPC' button at the bottom](/events/cc/l4-create-vpc-console.webp)
## VPCs and subnets
A **VPC**:
- is **logically isolated** from other VPCs;
- is **dedicated to your AWS account**;
- belongs to **a single AWS Region** and **can span multiple Availability Zones**.
A **subnet**:
- is a **range of IP addresses** that divides a VPC;
- belongs to **a single Availability Zone**;
- is classified as **public** (direct access to the internet) or **private** (no direct access).
For **high availability**, create subnets in **different Availability Zones**.
@diagram cc-region-az
| Feature | VPC | Subnet |
|---|---|---|
| Lives in | one Region | one Availability Zone |
| Spans several AZs? | yes | no — exactly one AZ |
| Needs a CIDR block? | yes | yes, its own |
| Types | — | public or private |
## IP addressing in a VPC
- When you create a VPC, you assign it an **IPv4 CIDR block** — a range of **private IPv4 addresses**.
- You **cannot change the address range** after you create the VPC, so choose it carefully.
- The **largest** IPv4 CIDR block is **/16** = 2^16 = **65,536** addresses; the **smallest** is **/28** = 2^4 = **16** addresses.
- You can optionally associate an **IPv6 CIDR block** with the VPC and its subnets; IPv6 has a **different block size limit**.
- A subnet's CIDR block can be **the same** as the VPC's (one subnet fills the whole VPC) or a **subset** of it (several subnets).
- The CIDR blocks of subnets **cannot overlap** — there are no duplicate IP addresses in one VPC.
= VPC 10.0.0.0/16 -> 10.0.0.0/24, 10.0.1.0/24, 10.0.2.0/24, 10.0.3.0/24
## Reserved IP addresses
AWS **reserves five IP addresses** in every subnet CIDR block, and you cannot use them. In the subnet 10.0.0.0/24 (256 addresses) only **251** are available.
| Address | Reserved for |
|---|---|
| 10.0.0.0 | network address |
| 10.0.0.1 | VPC local router (internal communication) |
| 10.0.0.2 | Domain Name System (DNS) resolution |
| 10.0.0.3 | future use |
| 10.0.0.255 | network broadcast address |
So the **first four** addresses and the **last one** are taken. Usable addresses:
= usable = 2^(32 - prefix) - 5    /24: 256 - 5 = 251    /28: 16 - 5 = 11
Lecture example: the VPC 10.0.0.0/16 has 65,536 addresses and four equal-sized /24 subnets (10.0.0.0, 10.0.1.0, 10.0.2.0, 10.0.3.0); each subnet offers **251** usable addresses.
## Public IP address types
Every instance in a VPC automatically gets a **private IP address**. To be reachable from the internet it also needs a public one:
- **Public IPv4 address** — assigned **automatically** through the subnet's **auto-assign public IP address** setting, or **manually** through an Elastic IP address.
- **Elastic IP address** — a **static, public IPv4 address** designed for dynamic cloud computing. It is **associated with your AWS account**, can be **allocated and remapped at any time**, and **additional costs might apply** — so release it when you no longer need it.
With an Elastic IP you can **mask the failure of an instance** by quickly remapping the address to another instance in your VPC. Associating it with a **network interface** is better than with the instance itself: all the interface's attributes move to another instance in **one step**.
| Feature | Auto-assigned public IPv4 | Elastic IP address |
|---|---|---|
| How you get it | subnet's auto-assign setting | allocated to your account |
| Static? | no | yes |
| Remapping | not possible | any time, to any instance or interface in your VPCs |
| Belongs to | the instance | your AWS account |
## Elastic network interface
An **elastic network interface** is a **virtual network interface** that you can:
- **attach** to an instance in a VPC;
- **detach** from it and **attach to another instance** to **redirect network traffic** to the new instance;
- move freely — its **attributes follow it** when it is reattached.
Each instance has a **default (primary) network interface** with a **private IPv4 address** from the VPC's range. The primary interface **cannot be detached**. You can create and attach **additional** interfaces; how many depends on the **instance type**.
![AWS EC2 console screenshot of the 'Network interfaces' page: a table with two interfaces in subnet 10.0.1.0/24 — one with private IPv4 10.0.1.25 and status 'in-use', the other with status 'available', ready to be attached to an instance](/events/cc/l4-eni-console.webp)
## Route tables and routes
A **route table** contains a set of rules — **routes** — that direct network traffic from your subnet.
- Each route has a **destination** (the CIDR block the traffic is going to) and a **target** (what the traffic is sent through).
- By default every route table has a **local route** for communication **inside the VPC**. The local route **cannot be deleted**; you **add** other routes.
- Each subnet must be associated with a route table — **at most one** at a time; but **many subnets can share** one route table.
- The **main (default) route table** is created automatically with the VPC and controls every subnet that is not explicitly associated with another table.
| Destination | Target | Meaning |
|---|---|---|
| 10.0.0.0/16 (the VPC CIDR block) | local | traffic inside the VPC stays inside |
@diagram cc-vpc
> A VPC lives in one Region and spans AZs, a subnet lives in exactly one AZ; AWS keeps 5 addresses in every subnet, so a /24 gives 251 — and the local route can never be deleted.
?? A subnet is created as 10.0.5.0/28. How many addresses can your instances use?
?= 2^4 = 16 addresses minus the 5 that AWS reserves = 11 usable addresses.
?? Why associate an Elastic IP address with a network interface rather than directly with an instance?
?= Because the interface, with the Elastic IP and all its other attributes, can be moved to another instance in a single step.`,
        ru: `## Amazon VPC
**Amazon Virtual Private Cloud (Amazon VPC)** — сервис AWS, который позволяет создать **логически изолированный участок AWS Cloud** — **virtual private cloud (VPC)**, — где вы запускаете ресурсы AWS в **виртуальной сети, которую определяете сами**.
Многие идеи локальных (on-premises) сетей работают и в облаке, но большая часть сложности скрыта **без потери контроля, безопасности и удобства**. Amazon VPC даёт контроль над:
- **выбором собственного диапазона IP-адресов**;
- **созданием подсетей (subnets)**;
- **настройкой route tables и network gateways**.
Также он позволяет:
- использовать и **IPv4, и IPv6** для безопасного доступа к ресурсам и приложениям;
- **настраивать конфигурацию сети** — например, **public subnet** для веб-серверов с выходом в интернет и **private subnet** без публичного доступа для внутренних систем, таких как **базы данных и серверы приложений**;
- применять **несколько уровней защиты** — **security groups** и **network ACLs**, — чтобы контролировать доступ к **инстансам Amazon EC2** в каждой подсети.
![Скриншот AWS Management Console, страница «Create VPC»: тег имени «lab-vpc», в поле IPv4 CIDR block введено 10.0.0.0/16, для IPv6 выбрано «No IPv6 CIDR block», внизу оранжевая кнопка «Create VPC»](/events/cc/l4-create-vpc-console.webp)
## VPC и подсети
**VPC**:
- **логически изолирован** от других VPC;
- **принадлежит только вашему аккаунту AWS**;
- находится **в одном AWS Region** и **может охватывать несколько Availability Zones**.
**Subnet (подсеть)**:
- это **диапазон IP-адресов**, на которые делится VPC;
- находится **в одной Availability Zone**;
- бывает **public** (прямой доступ в интернет) или **private** (без прямого доступа).
Для **high availability (высокой доступности)** создавайте подсети в **разных Availability Zones**.
@diagram cc-region-az
| Признак | VPC | Subnet |
|---|---|---|
| Где находится | один Region | одна Availability Zone |
| Охватывает несколько AZ? | да | нет — ровно одну AZ |
| Нужен CIDR-блок? | да | да, свой собственный |
| Виды | — | public или private |
## IP-адресация в VPC
- При создании VPC вы назначаете ему **IPv4 CIDR block** — диапазон **частных (private) IPv4-адресов**.
- **Изменить диапазон адресов** после создания VPC **нельзя**, поэтому выбирайте его внимательно.
- **Самый большой** блок IPv4 — **/16** = 2^16 = **65 536** адресов; **самый маленький** — **/28** = 2^4 = **16** адресов.
- По желанию к VPC и подсетям можно привязать **IPv6 CIDR block**; у IPv6 **другие ограничения на размер блока**.
- CIDR-блок подсети может **совпадать** с блоком VPC (одна подсеть на весь VPC) или быть его **частью (subset)** (несколько подсетей).
- CIDR-блоки подсетей **не могут пересекаться** — в одном VPC не бывает повторяющихся IP-адресов.
= VPC 10.0.0.0/16 -> 10.0.0.0/24, 10.0.1.0/24, 10.0.2.0/24, 10.0.3.0/24
## Зарезервированные IP-адреса
AWS **резервирует пять IP-адресов** в каждом CIDR-блоке подсети, использовать их нельзя. В подсети 10.0.0.0/24 (256 адресов) доступен только **251**.
| Адрес | Зарезервирован для |
|---|---|
| 10.0.0.0 | адрес сети (network address) |
| 10.0.0.1 | локальный маршрутизатор VPC (внутренняя связь) |
| 10.0.0.2 | разрешение имён Domain Name System (DNS) |
| 10.0.0.3 | на будущее (future use) |
| 10.0.0.255 | широковещательный адрес сети (broadcast) |
То есть заняты **первые четыре** адреса и **последний**. Доступных адресов:
= usable = 2^(32 - prefix) - 5    /24: 256 - 5 = 251    /28: 16 - 5 = 11
Пример из лекции: у VPC 10.0.0.0/16 65 536 адресов и четыре одинаковые подсети /24 (10.0.0.0, 10.0.1.0, 10.0.2.0, 10.0.3.0); в каждой доступно **251** адрес.
## Виды публичных IP-адресов
Каждый инстанс в VPC автоматически получает **private IP address**. Чтобы до него можно было достучаться из интернета, нужен ещё и публичный:
- **Public IPv4 address** — назначается **автоматически** через настройку подсети **auto-assign public IP address** или **вручную** через Elastic IP address.
- **Elastic IP address** — **статический публичный IPv4-адрес**, созданный для динамичных облачных вычислений. Он **привязан к вашему аккаунту AWS**, его можно **выделить и перепривязать в любой момент**, и **может взиматься дополнительная плата** — поэтому освобождайте его, когда он не нужен.
С Elastic IP можно **скрыть сбой инстанса**, быстро перепривязав адрес к другому инстансу в VPC. Привязывать его лучше к **network interface**, а не к самому инстансу: все атрибуты интерфейса переходят на другой инстанс **за один шаг**.
| Признак | Автоматический public IPv4 | Elastic IP address |
|---|---|---|
| Как получить | настройка auto-assign подсети | выделяется вашему аккаунту |
| Статический? | нет | да |
| Перепривязка | невозможна | в любой момент, к любому инстансу или интерфейсу ваших VPC |
| Кому принадлежит | инстансу | вашему аккаунту AWS |
## Elastic network interface
**Elastic network interface** — **виртуальный сетевой интерфейс**, который можно:
- **подключить (attach)** к инстансу в VPC;
- **отключить (detach)** и **подключить к другому инстансу**, чтобы **перенаправить сетевой трафик** на новый инстанс;
- свободно переносить — **его атрибуты следуют за ним** при повторном подключении.
У каждого инстанса есть **сетевой интерфейс по умолчанию (primary network interface)** с **частным IPv4-адресом** из диапазона VPC. Основной интерфейс **нельзя отключить**. Можно создать и подключить **дополнительные** интерфейсы; их число зависит от **типа инстанса (instance type)**.
![Скриншот консоли AWS EC2, страница «Network interfaces»: таблица с двумя интерфейсами в подсети 10.0.1.0/24 — у одного частный IPv4 10.0.1.25 и статус «in-use», у другого статус «available», он готов к подключению к инстансу](/events/cc/l4-eni-console.webp)
## Route tables и маршруты
**Route table (таблица маршрутов)** содержит набор правил — **routes (маршрутов)**, — которые направляют сетевой трафик из подсети.
- У каждого маршрута есть **destination (назначение)** — CIDR-блок, куда идёт трафик, — и **target (цель)** — через что трафик отправляется.
- По умолчанию в каждой route table есть **local route** для связи **внутри VPC**. Local route **удалить нельзя**; остальные маршруты вы **добавляете** сами.
- Каждая подсеть должна быть связана с route table — **не более чем с одной** одновременно; но **несколько подсетей могут использовать** одну таблицу.
- **Main (default) route table** создаётся автоматически вместе с VPC и управляет всеми подсетями, которые явно не связаны с другой таблицей.
| Destination | Target | Смысл |
|---|---|---|
| 10.0.0.0/16 (CIDR-блок VPC) | local | трафик внутри VPC остаётся внутри |
@diagram cc-vpc
> VPC живёт в одном Region и охватывает несколько AZ, подсеть — ровно в одной AZ; AWS забирает 5 адресов в каждой подсети, поэтому /24 даёт 251 — а local route удалить нельзя никогда.
?? Подсеть создана как 10.0.5.0/28. Сколько адресов смогут использовать инстансы?
?= 2^4 = 16 адресов минус 5 зарезервированных AWS = 11 доступных адресов.
?? Почему Elastic IP address лучше привязывать к network interface, а не прямо к инстансу?
?= Потому что интерфейс вместе с Elastic IP и всеми остальными атрибутами можно перенести на другой инстанс за один шаг.`,
      },
      [
        qx("What does Amazon VPC let you provision?", "A logically isolated section of the AWS Cloud", [
          ["A physical server rack in an AWS data center", "A VPC is a virtual network, not dedicated physical hardware.", "VPC — виртуальная сеть, а не выделенное физическое оборудование."],
          ["A content cache in edge locations worldwide", "Caching content near users is what a CDN does.", "Кэшировать контент рядом с пользователями — задача CDN."],
          ["A private line from your office to AWS", "A dedicated private line is AWS Direct Connect.", "Выделенная частная линия — это AWS Direct Connect."],
        ], "Amazon VPC provisions a logically isolated virtual network where you launch your AWS resources.", "Amazon VPC создаёт логически изолированную виртуальную сеть, где вы запускаете ресурсы AWS."),
        qx("Which of these does Amazon VPC let you control?", "Your own IP address range and subnets", [
          ["The hypervisor software on the physical host", "AWS manages the hypervisor; you control the virtual network.", "Hypervisor управляет AWS; вы управляете виртуальной сетью."],
          ["The physical cabling of the Region", "Physical infrastructure is AWS's responsibility, not yours.", "Физическая инфраструктура — ответственность AWS, а не ваша."],
          ["The MAC addresses of AWS routers", "AWS hardware addresses are not configurable by customers.", "Аппаратные адреса оборудования AWS клиенты не настраивают."],
        ], "You choose the IP address range, create subnets and configure route tables and network gateways.", "Вы выбираете диапазон IP-адресов, создаёте подсети и настраиваете route tables и network gateways."),
        qx("Which statement about the scope of a VPC is true?", "In one Region, across several AZs", [
          ["In a single Availability Zone only", "That describes a subnet; a VPC can span several AZs.", "Это описание подсети; VPC может охватывать несколько AZ."],
          ["Across every AWS Region at the same time", "A VPC belongs to one single AWS Region.", "VPC принадлежит одному AWS Region."],
          ["Inside one edge location of a CDN", "Edge locations cache content; VPCs live in Regions.", "Edge locations кэшируют контент; VPC живут в регионах."],
        ], "A VPC belongs to a single AWS Region and can span multiple Availability Zones.", "VPC находится в одном AWS Region и может охватывать несколько Availability Zones."),
        qx("Which statement about subnets is true?", "A subnet belongs to a single Availability Zone", [
          ["A subnet can span several Regions", "A subnet cannot even span two AZs, let alone Regions.", "Подсеть не может охватить даже две AZ, не то что регионы."],
          ["A subnet can stretch across all the AZs of its Region", "Spanning AZs is a VPC property; a subnet stays in one AZ.", "Охватывать несколько AZ может VPC; подсеть остаётся в одной AZ."],
          ["A subnet has no CIDR block of its own", "Each subnet requires its own CIDR block.", "Каждой подсети нужен собственный CIDR-блок."],
        ], "Subnets divide a VPC, belong to one AZ and are public or private.", "Подсети делят VPC, находятся в одной AZ и бывают public или private."),
        qx("A team puts its database servers where the internet cannot reach them directly. Which subnet type is that?", "Private subnet", [
          ["Public subnet", "A public subnet has direct internet access — it is for web servers.", "У public subnet прямой доступ в интернет — она для веб-серверов."],
          ["Peered subnet", "There is no 'peered subnet' type; peering connects whole VPCs.", "Типа «peered subnet» нет; peering соединяет целые VPC."],
          ["Transit subnet", "There is no 'transit subnet' type; subnets are public or private.", "Типа «transit subnet» нет; подсети бывают public или private."],
        ], "Back-end systems such as databases go into a private subnet with no public internet access.", "Внутренние системы, например базы данных, размещают в private subnet без публичного доступа."),
        qx("What is the largest IPv4 CIDR block you can assign to a VPC?", "/16 (65,536 addresses)", [
          ["/8 (16,777,216 addresses)", "/8 is far larger than the VPC maximum of /16.", "/8 намного больше максимума для VPC — /16."],
          ["/28 (16 addresses)", "/28 is the smallest allowed block, not the largest.", "/28 — самый маленький допустимый блок, а не самый большой."],
          ["/24 (256 addresses)", "/24 is allowed, but much smaller than the /16 maximum.", "/24 допустим, но он намного меньше максимума /16."],
        ], "The largest VPC block is /16 = 2^16 = 65,536 addresses.", "Самый большой блок VPC — /16 = 2^16 = 65 536 адресов."),
        qx("What is the smallest IPv4 CIDR block allowed for a VPC?", "/28 (16 addresses)", [
          ["/32 (1 address)", "/32 is a single host, too small for a VPC.", "/32 — один хост, для VPC это слишком мало."],
          ["/30 (4 addresses)", "/30 is below the VPC minimum of /28.", "/30 меньше минимума для VPC — /28."],
          ["/16 (65,536 addresses)", "/16 is the largest block, not the smallest.", "/16 — самый большой блок, а не самый маленький."],
        ], "The smallest VPC block is /28 = 2^4 = 16 addresses.", "Самый маленький блок VPC — /28 = 2^4 = 16 адресов."),
        qx("An admin created a VPC with 10.0.0.0/24 and now needs more addresses. What does the lecture say?", "The range cannot change once the VPC exists", [
          ["Edit the VPC CIDR block to /16 in the console", "The lecture states the address range cannot be changed after creation.", "В лекции сказано, что диапазон адресов после создания изменить нельзя."],
          ["Reboot the VPC so that its CIDR block resizes", "A VPC is not rebooted, and rebooting would not change its range.", "VPC не перезагружают, и перезагрузка не изменила бы диапазон."],
          ["Subnets grow automatically when they are full", "Subnets have fixed CIDR blocks; they never grow by themselves.", "У подсетей фиксированные CIDR-блоки; сами они не растут."],
        ], "You cannot change the address range after you create the VPC, so it must be chosen carefully up front.", "Изменить диапазон адресов после создания VPC нельзя, поэтому его нужно выбирать заранее и внимательно."),
        qx("How many IP addresses does AWS reserve in every subnet?", "5", [
          ["2", "Classic networking reserves 2 (network and broadcast); AWS reserves 3 more.", "В классической сети резервируют 2 (сеть и broadcast); AWS добавляет ещё 3."],
          ["4", "AWS reserves the first four addresses and the last one — five in total.", "AWS резервирует первые четыре адреса и последний — всего пять."],
          ["0", "AWS always reserves addresses that instances cannot use.", "AWS всегда резервирует адреса, которые инстансы использовать не могут."],
        ], "Network address, VPC router, DNS, future use and broadcast: five reserved addresses.", "Адрес сети, маршрутизатор VPC, DNS, будущее использование и broadcast — пять адресов."),
        qx("How many usable IP addresses does a subnet with CIDR 10.0.0.0/24 have?", "251", [
          ["256", "256 is the total; AWS reserves 5 of them.", "256 — это всего; 5 из них резервирует AWS."],
          ["254", "254 is classic subnetting minus 2; AWS reserves 5.", "254 — классическая подсеть минус 2; AWS резервирует 5."],
          ["250", "Only 5 addresses are reserved: 256 − 5 = 251.", "Резервируется ровно 5 адресов: 256 − 5 = 251."],
        ], "A /24 has 256 addresses; minus the 5 reserved by AWS leaves 251.", "В /24 256 адресов; минус 5 зарезервированных AWS — остаётся 251."),
        qx("In the subnet 10.0.0.0/24, what is the address 10.0.0.2 reserved for?", "DNS resolution", [
          ["The VPC local router", "The VPC router uses 10.0.0.1.", "Маршрутизатор VPC использует 10.0.0.1."],
          ["Network broadcast", "Broadcast is the last address, 10.0.0.255.", "Broadcast — последний адрес, 10.0.0.255."],
          ["Future use", "Future use is 10.0.0.3.", "Для будущего использования — 10.0.0.3."],
        ], "The third address of a subnet (.2) is reserved for Domain Name System resolution.", "Третий адрес подсети (.2) зарезервирован для разрешения имён DNS."),
        qx("A new subnet is not explicitly associated with any route table. Which table controls its routing?", "The main route table of the VPC", [
          ["No table, so the subnet has no routes", "Every subnet must have a route table; it falls back to the main one.", "У каждой подсети должна быть route table; по умолчанию это главная."],
          ["The route table of the newest subnet", "There is no such rule; the main route table is the default.", "Такого правила нет; по умолчанию действует main route table."],
          ["The route table of the internet gateway", "Gateways are targets in route tables; they do not own a table.", "Шлюзы — это targets в route tables; своей таблицы у них нет."],
        ], "The main (default) route table controls every subnet that is not explicitly associated with another table.", "Main (default) route table управляет каждой подсетью, которую явно не связали с другой таблицей."),
        qx("A subnet is created as 10.0.1.0/28. How many addresses can instances use?", "11", [
          ["16", "16 is the total in a /28; AWS reserves 5.", "16 — всего адресов в /28; 5 резервирует AWS."],
          ["14", "14 = 16 − 2 is classic subnetting; AWS reserves 5, not 2.", "14 = 16 − 2 — классическая подсеть; AWS резервирует 5, а не 2."],
          ["12", "12 would mean only 4 reserved; the broadcast address is reserved too.", "12 означало бы 4 резервных; но broadcast тоже зарезервирован."],
        ], "A /28 has 2^4 = 16 addresses; 16 − 5 = 11 usable.", "В /28 2^4 = 16 адресов; 16 − 5 = 11 доступных."),
        qx("Which statement about the CIDR blocks of subnets in one VPC is true?", "They cannot overlap with each other", [
          ["They must all be exactly /24", "Subnets can be any size from the VPC block down to /28.", "Подсети могут быть любого размера — от блока VPC до /28."],
          ["They must be larger than the VPC block", "A subnet is the same size as or a subset of the VPC block.", "Подсеть равна блоку VPC или является его частью."],
          ["They may reuse the same IP addresses", "Duplicate IP addresses are not allowed in one VPC.", "Повторяющиеся IP-адреса в одном VPC запрещены."],
        ], "Subnet CIDR blocks cannot overlap, so no IP address is duplicated in the VPC.", "CIDR-блоки подсетей не пересекаются, поэтому ни один IP-адрес в VPC не повторяется."),
        qx("What is an Elastic IP address?", "A static public IPv4 address of your account", [
          ["A private IPv4 address that changes on reboot", "An Elastic IP is public and static, not private and changing.", "Elastic IP — публичный и статический, а не частный и меняющийся."],
          ["An IPv6 CIDR block that belongs to the VPC", "An Elastic IP is a single IPv4 address, not an IPv6 block.", "Elastic IP — один адрес IPv4, а не блок IPv6."],
          ["A MAC address that can move between instances", "It is an IP address; moving attributes is what a network interface does.", "Это IP-адрес; переносить атрибуты умеет network interface."],
        ], "An Elastic IP is a static, public IPv4 address associated with your AWS account and remappable at any time.", "Elastic IP — статический публичный IPv4-адрес, привязанный к аккаунту AWS и перепривязываемый в любой момент."),
        qx("An instance fails and its public address must quickly point to a standby instance. What should the admin use?", "An Elastic IP address", [
          ["An auto-assigned public IPv4 address", "An auto-assigned address cannot be remapped to another instance.", "Автоматически назначенный адрес нельзя перепривязать к другому инстансу."],
          ["A second private IP from the subnet", "A private IP is not reachable from the internet.", "Частный IP недоступен из интернета."],
          ["A new subnet in another Region", "A subnet does not move a public address; it lives in one AZ.", "Подсеть не переносит публичный адрес; она живёт в одной AZ."],
        ], "An Elastic IP can be remapped at any time to another instance, which masks the failure.", "Elastic IP можно в любой момент перепривязать к другому инстансу — так сбой скрывается."),
        qx("How can an instance get a public IPv4 address automatically?", "Via the subnet's auto-assign public IP setting", [
          ["Via the local route of the main route table", "The local route only handles traffic inside the VPC.", "Local route обслуживает только трафик внутри VPC."],
          ["By attaching an extra elastic network interface", "An extra interface gets a private IP from the VPC range.", "Дополнительный интерфейс получает частный IP из диапазона VPC."],
          ["By joining the subnet to a VPC peering link", "Peering connects VPCs privately and gives no public IPs.", "Peering соединяет VPC приватно и публичных IP не даёт."],
        ], "Public IPv4 addresses are assigned automatically by the subnet-level auto-assign setting, or manually via an Elastic IP.", "Публичный IPv4 назначается автоматически настройкой auto-assign на уровне подсети или вручную через Elastic IP."),
        qx("Which statement about elastic network interfaces is true?", "Its attributes follow it to the new instance", [
          ["The primary interface can be detached at will", "The primary (default) network interface cannot be detached.", "Основной (primary) интерфейс отключить нельзя."],
          ["Every instance type allows unlimited interfaces", "The number of interfaces depends on the instance type.", "Число интерфейсов зависит от типа инстанса."],
          ["It gets a public IP from the VPC CIDR block", "The VPC block is a private range; interfaces get private IPv4 addresses.", "Блок VPC — частный диапазон; интерфейсы получают частные IPv4."],
        ], "When an interface is reattached to another instance, its attributes follow and traffic is redirected.", "Когда интерфейс подключают к другому инстансу, атрибуты переходят вместе с ним и трафик перенаправляется."),
        qx("What does every route table contain by default?", "A local route for traffic inside the VPC", [
          ["A route 0.0.0.0/0 to an internet gateway", "That route must be added to make a subnet public.", "Этот маршрут добавляют, чтобы сделать подсеть публичной."],
          ["A route to every peered VPC", "Peering routes are added manually on both sides.", "Маршруты для peering добавляют вручную с обеих сторон."],
          ["A deny rule for all inbound traffic", "Route tables hold routes, not allow or deny rules; that is a firewall job.", "В route tables маршруты, а не правила allow/deny; это задача firewall."],
        ], "Every route table has a built-in local route for communication within the VPC, and it cannot be deleted.", "В каждой route table есть встроенный local route для связи внутри VPC, и удалить его нельзя."),
        tfx("A subnet can be associated with several route tables at the same time.", false,
          "Each subnet is associated with at most one route table at a time, although many subnets can share one table.",
          "Каждая подсеть связана не более чем с одной route table одновременно, хотя одну таблицу могут делить много подсетей.",
          "'True' confuses the two directions: one table can serve many subnets, not the other way round.",
          "Ответ «верно» путает направления: одна таблица может обслуживать много подсетей, а не наоборот."),
      ],
    ),
    part(
      "cc-l4-p3",
      { en: "VPC networking: gateways and connections", ru: "Сети VPC: шлюзы и подключения" },
      {
        en: `## Internet gateway
An **internet gateway** is a **scalable, redundant and highly available** VPC component that allows communication between instances in your VPC and **the internet**. It serves two purposes:
- it provides a **target in your route tables** for internet-routable traffic;
- it performs **network address translation (NAT)** for instances that have **public IPv4 addresses**.
To make a subnet **public**: attach an internet gateway to the VPC and add a route that sends **non-local traffic (0.0.0.0/0)** to it.
| Destination | Target | Meaning |
|---|---|---|
| 10.0.0.0/16 | local | traffic inside the VPC |
| 0.0.0.0/0 | igw-id | everything else goes to the internet gateway |
## NAT gateway
A **network address translation (NAT) gateway** lets instances in a **private subnet** connect **out** to the internet or other AWS services, but **prevents the internet from initiating a connection** with those instances. To create one:
- place it in a **public subnet**;
- associate an **Elastic IP address** with it;
- update the **route table of the private subnet(s)** so that internet-bound traffic goes to the NAT gateway.
= 10.0.0.0/16 -> local    0.0.0.0/0 -> nat-gw-id
You can also run a **NAT instance** in a public subnet, but a **NAT gateway** is a **managed** service with **better availability, higher bandwidth and less administrative effort**, so AWS recommends it for common use cases.
## VPC sharing
**VPC sharing** lets you share **subnets** with other AWS accounts **in the same organization in AWS Organizations**.
- The **owner** account owns the VPC and shares one or more subnets with **participant** accounts.
- Participants create their application resources — **EC2 instances, RDS databases, Redshift clusters, Lambda functions** — in the shared, **centrally managed** VPC.
- Participants can view, create, modify and delete **their own** resources in the shared subnets, but **cannot** view, modify or delete resources of **other participants or the owner**.
| Benefit | What it means |
|---|---|
| Separation of duties | VPC structure, routing and IP allocation are controlled centrally |
| Ownership | application owners keep their resources, accounts and security groups |
| Security groups | participants can reference each other's security group IDs |
| Efficiencies | higher density in subnets, efficient use of VPNs and Direct Connect |
| No hard limits | avoids limits such as 50 virtual interfaces per Direct Connect connection |
| Optimized costs | reuse of NAT gateways, VPC interface endpoints and intra-AZ traffic |
VPC sharing **decouples accounts and networks**: you get fewer, larger, centrally managed VPCs.
## VPC peering
A **VPC peering connection** links **two VPCs** so that you can route traffic between them **privately**; instances talk as if they were in the same network. You can peer:
- your own VPCs;
- with a VPC in **another AWS account**;
- with a VPC in **another AWS Region**.
Each side's route table gets a route to the other VPC through the peering connection (pcx-id):
= VPC A 10.0.0.0/16: 10.3.0.0/16 -> pcx-id    VPC B 10.3.0.0/16: 10.0.0.0/16 -> pcx-id
Restrictions:
- the **IP address ranges cannot overlap**;
- **transitive peering is not supported** — if A is peered with B and A with C, then B and C still **cannot** talk until you connect them explicitly;
- only **one peering resource** between the same two VPCs.
## AWS Site-to-Site VPN
By default, instances in a VPC **cannot communicate with a remote network**. To connect the VPC to a **corporate data center** over a VPN:
- create a **virtual private gateway (VPN gateway, vgw)** and attach it to the VPC;
- define the **customer gateway** — not a device, but an **AWS resource that describes your VPN device** to AWS;
- create a **custom route table** that sends data-center-bound traffic to the VPN gateway, and update the **security group rules**;
- establish the **AWS Site-to-Site VPN connection** and configure routing through it.
= 192.168.10.0/24 -> vgw-id
## AWS Direct Connect
If your data center is **far from the AWS Region**, network performance over the internet suffers. **AWS Direct Connect (DX)** gives a **dedicated, private network connection** between your network and one of the **DX locations**. It can:
- **reduce network costs**;
- **increase bandwidth throughput**;
- give a **more consistent network experience** than internet-based connections.
DX uses open standard **802.1q VLANs**.
## VPC endpoints
A **VPC endpoint** is a **virtual device** that privately connects your VPC to **supported AWS services** and to endpoint services powered by **AWS PrivateLink**. It needs no internet gateway, NAT device, VPN or Direct Connect; instances need **no public IP addresses**, and the traffic **does not leave the Amazon network**.
| Endpoint type | Works with | Cost |
|---|---|---|
| Interface endpoint | services powered by AWS PrivateLink, through an elastic network interface with a private IP | hourly and data-processing charges |
| Gateway endpoint | Amazon S3 and Amazon DynamoDB, as a target in the route table | no additional charge |
= Amazon S3 ID -> vpcep-id
## AWS Transit Gateway
All the options above are **point-to-point**, so with hundreds of VPCs the number of connections grows quickly and peering becomes hard to manage. **AWS Transit Gateway** is a **hub-and-spoke** alternative: each VPC, on-premises data center or remote office connects **once** to the central transit gateway, which controls how traffic is routed among them. A new VPC attached to it is automatically reachable by every other connected network.
## Labelling a VPC diagram
In the lecture activity you name every part of a typical design:
- **Region** → **Availability Zone** → **VPC** 10.0.0.0/16;
- a **public subnet** 10.0.1.0/24 with a **NAT gateway**, and an **internet gateway** on the edge of the VPC leading to the internet;
- a **private subnet** 10.0.2.0/24 whose instance has an **elastic network interface** with a **private IP address**;
- a **route table** whose **route** 0.0.0.0/0 → igw-id sends internet traffic out.
@diagram cc-vpc
![AWS VPC console 'Resource map' view of a VPC 10.0.0.0/16: a public subnet 10.0.1.0/24 and a private subnet 10.0.2.0/24 joined by lines to two route tables, one leading to an internet gateway and the other to a NAT gateway](/events/cc/l4-vpc-resource-map.webp)
| Need | Option |
|---|---|
| VPC to and from the internet | internet gateway |
| private subnet out to the internet only | NAT gateway |
| VPC to AWS services privately | VPC endpoint |
| VPC to another VPC | VPC peering |
| several accounts in one VPC | VPC sharing |
| VPC to an on-premises network over the internet | AWS Site-to-Site VPN |
| VPC to on-premises over a dedicated line | AWS Direct Connect |
| many VPCs and networks through one hub | AWS Transit Gateway |
You can use the **VPC Wizard** to implement your design.
> Internet gateway = two-way internet for public subnets; NAT gateway = outbound-only internet for private subnets; peering is never transitive; Direct Connect is a dedicated line, a VPN runs over the internet.
?? Instances in a private subnet must download updates, but nobody on the internet may connect to them. What do you add?
?= A NAT gateway in a public subnet with an Elastic IP, and a route 0.0.0.0/0 → nat-gw-id in the private subnet's route table.
?? VPC A is peered with B, and A with C. Can an instance in B reach C?
?= No. Transitive peering is not supported; you must create a separate B–C peering connection.`,
        ru: `## Internet gateway
**Internet gateway** — **масштабируемый, резервированный и высокодоступный** компонент VPC, который обеспечивает связь между инстансами в VPC и **интернетом**. У него две задачи:
- быть **target в route tables** для трафика, идущего в интернет;
- выполнять **network address translation (NAT)** для инстансов с **публичными IPv4-адресами**.
Чтобы сделать подсеть **public**: подключите internet gateway к VPC и добавьте маршрут, который отправляет **нелокальный трафик (0.0.0.0/0)** на него.
| Destination | Target | Смысл |
|---|---|---|
| 10.0.0.0/16 | local | трафик внутри VPC |
| 0.0.0.0/0 | igw-id | всё остальное идёт на internet gateway |
## NAT gateway
**NAT gateway (шлюз трансляции сетевых адресов)** позволяет инстансам в **private subnet** выходить **наружу** в интернет или к другим сервисам AWS, но **не даёт интернету начать соединение** с этими инстансами. Чтобы его создать:
- разместите его в **public subnet**;
- привяжите к нему **Elastic IP address**;
- обновите **route table частной подсети (подсетей)**, чтобы трафик в интернет шёл на NAT gateway.
= 10.0.0.0/16 -> local    0.0.0.0/0 -> nat-gw-id
Можно запустить и **NAT instance** в public subnet, но **NAT gateway** — **управляемый (managed)** сервис с **лучшей доступностью, большей пропускной способностью и меньшими усилиями на администрирование**, поэтому AWS рекомендует его для типичных задач.
## VPC sharing
**VPC sharing** позволяет делиться **подсетями** с другими аккаунтами AWS **из той же организации в AWS Organizations**.
- Аккаунт-**owner (владелец)** владеет VPC и делится одной или несколькими подсетями с аккаунтами-**participants (участниками)**.
- Участники создают свои ресурсы — **инстансы EC2, базы RDS, кластеры Redshift, функции Lambda** — в общем, **централизованно управляемом** VPC.
- Участники могут просматривать, создавать, изменять и удалять **свои** ресурсы в общих подсетях, но **не могут** видеть, менять или удалять ресурсы **других участников и владельца**.
| Преимущество | Что это значит |
|---|---|
| Separation of duties (разделение обязанностей) | структура VPC, маршрутизация и выдача IP управляются централизованно |
| Ownership (владение) | владельцы приложений сохраняют свои ресурсы, аккаунты и security groups |
| Security groups | участники могут ссылаться на ID security groups друг друга |
| Efficiencies (эффективность) | выше плотность в подсетях, эффективнее используются VPN и Direct Connect |
| No hard limits (нет жёстких лимитов) | обходятся лимиты вроде 50 виртуальных интерфейсов на одно подключение Direct Connect |
| Optimized costs (экономия) | повторное использование NAT gateways, interface endpoints и трафика внутри AZ |
VPC sharing **разделяет аккаунты и сети**: получается меньше VPC, но они крупнее и управляются централизованно.
## VPC peering
**VPC peering connection** соединяет **два VPC**, чтобы маршрутизировать трафик между ними **приватно**; инстансы общаются так, будто они в одной сети. Peering возможен:
- между вашими собственными VPC;
- с VPC в **другом аккаунте AWS**;
- с VPC в **другом AWS Region**.
В route table каждой стороны добавляется маршрут к другому VPC через peering connection (pcx-id):
= VPC A 10.0.0.0/16: 10.3.0.0/16 -> pcx-id    VPC B 10.3.0.0/16: 10.0.0.0/16 -> pcx-id
Ограничения:
- **диапазоны IP-адресов не должны пересекаться**;
- **transitive peering (транзитивный пиринг) не поддерживается** — если A связан с B и A с C, то B и C всё равно **не могут** общаться, пока вы не соедините их явно;
- между одними и теми же двумя VPC — только **один peering resource**.
## AWS Site-to-Site VPN
По умолчанию инстансы в VPC **не могут общаться с удалённой сетью**. Чтобы соединить VPC с **корпоративным дата-центром** через VPN:
- создайте **virtual private gateway (VPN gateway, vgw)** и подключите его к VPC;
- определите **customer gateway** — это не устройство, а **ресурс AWS, который описывает AWS ваше VPN-устройство**;
- создайте **custom route table**, отправляющую трафик в дата-центр на VPN gateway, и обновите **правила security groups**;
- установите **AWS Site-to-Site VPN connection** и настройте маршрутизацию через него.
= 192.168.10.0/24 -> vgw-id
## AWS Direct Connect
Если дата-центр **далеко от AWS Region**, производительность сети через интернет страдает. **AWS Direct Connect (DX)** даёт **выделенное частное сетевое подключение** между вашей сетью и одной из **DX locations**. Оно может:
- **снизить затраты на сеть**;
- **увеличить пропускную способность**;
- дать **более стабильную работу сети**, чем подключения через интернет.
DX использует открытый стандарт **802.1q VLANs**.
## VPC endpoints
**VPC endpoint** — **виртуальное устройство**, которое приватно соединяет VPC с **поддерживаемыми сервисами AWS** и сервисами на базе **AWS PrivateLink**. Не нужны ни internet gateway, ни NAT, ни VPN, ни Direct Connect; инстансам **не нужны публичные IP-адреса**, и трафик **не покидает сеть Amazon**.
| Тип endpoint | С чем работает | Стоимость |
|---|---|---|
| Interface endpoint | сервисы на базе AWS PrivateLink, через elastic network interface с частным IP | почасовая оплата и плата за обработку данных |
| Gateway endpoint | Amazon S3 и Amazon DynamoDB, как target в route table | без дополнительной платы |
= Amazon S3 ID -> vpcep-id
## AWS Transit Gateway
Все варианты выше — **точка-точка (point-to-point)**, поэтому при сотнях VPC число соединений быстро растёт и peering становится трудно сопровождать. **AWS Transit Gateway** — альтернатива по схеме **hub-and-spoke (звезда)**: каждый VPC, локальный дата-центр или удалённый офис подключается **один раз** к центральному transit gateway, который решает, как маршрутизировать трафик между ними. Новый VPC, подключённый к нему, автоматически доступен всем остальным подключённым сетям.
## Подписываем схему VPC
В задании лекции нужно назвать каждую часть типичной схемы:
- **Region** → **Availability Zone** → **VPC** 10.0.0.0/16;
- **public subnet** 10.0.1.0/24 с **NAT gateway**, а на границе VPC — **internet gateway**, ведущий в интернет;
- **private subnet** 10.0.2.0/24, у инстанса которой есть **elastic network interface** с **private IP address**;
- **route table**, в которой **route** 0.0.0.0/0 → igw-id выпускает трафик в интернет.
@diagram cc-vpc
![Консоль AWS VPC, вид «Resource map» для VPC 10.0.0.0/16: public subnet 10.0.1.0/24 и private subnet 10.0.2.0/24 соединены линиями с двумя route tables, одна ведёт к internet gateway, другая — к NAT gateway](/events/cc/l4-vpc-resource-map.webp)
| Задача | Решение |
|---|---|
| VPC в интернет и обратно | internet gateway |
| частная подсеть только наружу в интернет | NAT gateway |
| VPC к сервисам AWS приватно | VPC endpoint |
| VPC к другому VPC | VPC peering |
| несколько аккаунтов в одном VPC | VPC sharing |
| VPC к локальной сети через интернет | AWS Site-to-Site VPN |
| VPC к локальной сети по выделенной линии | AWS Direct Connect |
| много VPC и сетей через один хаб | AWS Transit Gateway |
Реализовать схему можно с помощью **VPC Wizard**.
> Internet gateway = интернет в обе стороны для public subnets; NAT gateway = интернет только наружу для private subnets; peering никогда не транзитивен; Direct Connect — выделенная линия, VPN идёт через интернет.
?? Инстансам в private subnet нужно скачивать обновления, но никто из интернета не должен к ним подключаться. Что добавить?
?= NAT gateway в public subnet с Elastic IP и маршрут 0.0.0.0/0 → nat-gw-id в route table частной подсети.
?? VPC A связан peering с B, и A — с C. Может ли инстанс в B достучаться до C?
?= Нет. Transitive peering не поддерживается; нужно создать отдельное peering connection между B и C.`,
      },
      [
        qx("What are the two purposes of an internet gateway?", "Route table target and NAT for public IPv4", [
          ["Caching website content and blocking DDoS attacks", "Caching content near users is what a CDN does.", "Кэшировать контент рядом с пользователями — задача CDN."],
          ["Encrypting traffic and storing VPN keys", "Encryption over the internet is the job of a VPN connection.", "Шифрование через интернет — задача VPN-подключения."],
          ["Assigning private IPs and resolving DNS", "Private IPs come from the subnet range; DNS uses a reserved address.", "Частные IP берутся из диапазона подсети; DNS использует зарезервированный адрес."],
        ], "An internet gateway is a route table target for internet traffic and does NAT for instances with public IPv4 addresses.", "Internet gateway — target в route table для интернет-трафика и NAT для инстансов с публичными IPv4."),
        qx("What makes a subnet public?", "A 0.0.0.0/0 route to an internet gateway", [
          ["A 0.0.0.0/0 route to a NAT gateway in the VPC", "That gives a private subnet outbound-only internet access.", "Так частная подсеть получает выход в интернет только наружу."],
          ["An Elastic IP address on the route table", "Elastic IPs go on instances or interfaces, not on route tables.", "Elastic IP привязывают к инстансам или интерфейсам, а не к route tables."],
          ["A VPC endpoint for Amazon S3", "An endpoint reaches AWS services privately, without the internet.", "Endpoint даёт приватный доступ к сервисам AWS, без интернета."],
        ], "Attach an internet gateway to the VPC and route non-local traffic (0.0.0.0/0) to it from the subnet's route table.", "Подключите internet gateway к VPC и направьте на него нелокальный трафик (0.0.0.0/0) в route table подсети."),
        qx("Instances in a private subnet need updates from the internet but must not accept connections from it. What do you use?", "A NAT gateway", [
          ["An internet gateway route", "A direct internet gateway route would make the subnet public and reachable.", "Прямой маршрут на internet gateway сделал бы подсеть публичной и доступной извне."],
          ["A VPC peering connection", "Peering connects two VPCs, not a VPC to the internet.", "Peering соединяет два VPC, а не VPC с интернетом."],
          ["A gateway VPC endpoint", "Gateway endpoints reach only Amazon S3 and DynamoDB, not the internet.", "Gateway endpoints ведут только к Amazon S3 и DynamoDB, а не в интернет."],
        ], "A NAT gateway lets private instances connect out but prevents the internet from initiating connections to them.", "NAT gateway выпускает частные инстансы наружу, но не даёт интернету начать соединение с ними."),
        qx("Where must a NAT gateway be placed when you create it?", "In a public subnet, with an Elastic IP", [
          ["In the private subnet whose traffic it serves", "It must sit in a public subnet so that it can reach the internet gateway.", "Он должен стоять в public subnet, чтобы иметь выход на internet gateway."],
          ["Outside the VPC, next to the internet", "A NAT gateway is created inside a subnet of your VPC.", "NAT gateway создаётся внутри подсети вашего VPC."],
          ["In any subnet, with no public address", "An Elastic IP address must be associated with it at creation.", "При создании к нему обязательно привязывают Elastic IP address."],
        ], "You specify a public subnet and an Elastic IP, then point the private route table's 0.0.0.0/0 at the NAT gateway.", "Указываются public subnet и Elastic IP, затем маршрут 0.0.0.0/0 частной таблицы направляется на NAT gateway."),
        qx("Why does AWS recommend a NAT gateway over a NAT instance?", "It is a managed service with higher bandwidth", [
          ["It accepts connections started from the internet", "Neither should; NAT blocks connections initiated from the internet.", "Ни один не должен; NAT блокирует соединения, начатые из интернета."],
          ["It needs no public subnet or Elastic IP", "A NAT gateway requires both a public subnet and an Elastic IP.", "NAT gateway требует и public subnet, и Elastic IP."],
          ["It is free while NAT instances are charged", "Cost is not the reason given; managed operation is.", "Причина не в цене, а в том, что сервис управляемый."],
        ], "A NAT gateway is managed: better availability, higher bandwidth and less administrative effort.", "NAT gateway — управляемый сервис: лучше доступность, выше пропускная способность, меньше администрирования."),
        qx("What does VPC sharing let you share with other accounts?", "Subnets, within the same AWS Organization", [
          ["Whole VPCs, with any AWS account worldwide", "Sharing works only inside one organization, and you share subnets.", "Делиться можно только внутри одной организации, и делятся подсетями."],
          ["Security groups, across all Regions", "Participants can reference security group IDs, but subnets are what is shared.", "Участники могут ссылаться на ID security groups, но делятся именно подсетями."],
          ["Route tables, with peered VPCs only", "Routing stays under central control of the owner; peering is a separate feature.", "Маршрутизация остаётся под контролем владельца; peering — отдельная функция."],
        ], "The VPC owner shares one or more subnets with participant accounts in the same organization in AWS Organizations.", "Владелец VPC делится одной или несколькими подсетями с аккаунтами-участниками из той же организации AWS Organizations."),
        qx("In VPC sharing, what can a participant account NOT do?", "Modify resources of other participants", [
          ["Create EC2 instances in a shared subnet", "Participants can create their own resources in shared subnets.", "Участники могут создавать свои ресурсы в общих подсетях."],
          ["Delete its own RDS database", "Participants can delete their own resources.", "Участники могут удалять свои ресурсы."],
          ["View its own resources in the subnet", "Participants can view their own resources.", "Участники могут видеть свои ресурсы."],
        ], "Participants manage only their own resources; they cannot view, modify or delete resources of others or of the owner.", "Участники управляют только своими ресурсами; чужие ресурсы и ресурсы владельца им недоступны."),
        qx("Which is a benefit of VPC sharing?", "Separation of duties with central VPC control", [
          ["Each account has to build and run its own VPC", "It is the opposite: fewer, larger, centrally managed VPCs.", "Наоборот: меньше VPC, они крупнее и управляются централизованно."],
          ["Transitive routing between all peered VPCs", "VPC sharing does not change peering, and peering is never transitive.", "VPC sharing не меняет peering, а peering никогда не транзитивен."],
          ["Participants control the owner's routing", "Routing and IP allocation are controlled centrally by the owner.", "Маршрутизацию и выдачу IP централизованно контролирует владелец."],
        ], "VPC structure, routing and IP address allocation are controlled centrally, while app owners keep their resources.", "Структура VPC, маршрутизация и выдача IP управляются централизованно, а владельцы приложений сохраняют свои ресурсы."),
        qx("VPC A is peered with VPC B, and VPC A with VPC C. Which statement is true?", "B and C cannot talk until peered directly", [
          ["B and C can talk through VPC A automatically", "Transitive peering is not supported.", "Transitive peering не поддерживается."],
          ["A must stop peering with C to reach B", "A VPC can have many peering connections, one per pair of VPCs.", "У VPC может быть много peering connections — по одному на пару."],
          ["B and C must share one CIDR block", "Peered VPC ranges must not overlap at all.", "Диапазоны связанных VPC вообще не должны пересекаться."],
        ], "Peering is not transitive; B–C connectivity needs its own explicit peering connection.", "Peering не транзитивен; для связи B–C нужно отдельное явное peering connection."),
        qx("Two VPCs both use 10.0.0.0/16. Can they be connected with VPC peering?", "No, peered ranges must not overlap", [
          ["Yes, if they are in the same AWS account", "Overlap is forbidden whatever the account.", "Пересечение запрещено независимо от аккаунта."],
          ["Yes, if they are in different Regions", "Overlap is forbidden in any Region.", "Пересечение запрещено в любом регионе."],
          ["Yes, if a NAT gateway translates them", "NAT gateways give internet access; they do not fix peering overlaps.", "NAT gateway даёт доступ в интернет и не решает пересечение при peering."],
        ], "A restriction of VPC peering is that the IP address spaces cannot overlap.", "Ограничение VPC peering: адресные пространства не должны пересекаться."),
        tfx("You can create a VPC peering connection with a VPC in a different AWS Region.", true,
          "Peering works between your own VPCs, between AWS accounts and between AWS Regions.",
          "Peering возможен между вашими VPC, между аккаунтами AWS и между регионами AWS.",
          "'False' would limit peering to one Region, but the lecture lists inter-Region peering as allowed.",
          "Ответ «неверно» ограничил бы peering одним регионом, а лекция прямо разрешает межрегиональный peering."),
        qx("In the Site-to-Site VPN setup, what is the customer gateway?", "An AWS resource describing your VPN device", [
          ["A physical router that AWS ships to you", "The customer gateway is not a device; it is an AWS resource.", "Customer gateway — не устройство, а ресурс AWS."],
          ["The gateway attached to the VPC side", "The VPC side is the virtual private gateway (vgw).", "Со стороны VPC стоит virtual private gateway (vgw)."],
          ["A NAT gateway inside the corporate office", "NAT gateways live in VPC public subnets, not in offices.", "NAT gateways живут в public subnets VPC, а не в офисах."],
        ], "The customer gateway is an AWS resource that gives AWS information about your on-premises VPN device.", "Customer gateway — ресурс AWS, который сообщает AWS сведения о вашем локальном VPN-устройстве."),
        qx("On the VPC side of a Site-to-Site VPN, which gateway do you attach to the VPC?", "A virtual private gateway", [
          ["An internet gateway", "An internet gateway connects to the internet, not to the VPN tunnel.", "Internet gateway ведёт в интернет, а не в VPN-туннель."],
          ["A NAT gateway in a public subnet", "A NAT gateway gives private instances outbound internet access.", "NAT gateway даёт частным инстансам выход в интернет."],
          ["A customer gateway resource", "The customer gateway represents your on-premises device, not the VPC side.", "Customer gateway представляет ваше локальное устройство, а не сторону VPC."],
        ], "You create a virtual private gateway (VPN gateway, vgw) and attach it to the VPC.", "Создаётся virtual private gateway (VPN gateway, vgw) и подключается к VPC."),
        qx("In the VPN example, which route sends traffic to the corporate data center?", "192.168.10.0/24 to vgw-id", [
          ["0.0.0.0/0 to igw-id", "That route sends internet traffic to the internet gateway.", "Этот маршрут отправляет интернет-трафик на internet gateway."],
          ["10.0.0.0/16 to local", "That is the local route for traffic inside the VPC.", "Это local route для трафика внутри VPC."],
          ["192.168.10.0/24 to igw-id", "The data center is reached through the VPN gateway, not the internet gateway.", "До дата-центра идут через VPN gateway, а не через internet gateway."],
        ], "The private route table points the data center range 192.168.10.0/24 at the virtual private gateway.", "Частная route table направляет диапазон дата-центра 192.168.10.0/24 на virtual private gateway."),
        qx("A data center is far from its AWS Region and needs consistent, high-bandwidth connectivity. What should it use?", "AWS Direct Connect", [
          ["AWS Site-to-Site VPN", "A VPN runs over the public internet, so performance is less consistent.", "VPN идёт через публичный интернет, поэтому работа менее стабильна."],
          ["VPC peering", "Peering connects VPCs to each other, not to a data center.", "Peering соединяет VPC между собой, а не с дата-центром."],
          ["An internet gateway", "An internet gateway uses the public internet with no dedicated line.", "Internet gateway работает через публичный интернет, без выделенной линии."],
        ], "Direct Connect is a dedicated private connection: lower cost, higher throughput, more consistent experience.", "Direct Connect — выделенное частное подключение: дешевле, быстрее и стабильнее."),
        qx("Which standard does AWS Direct Connect use for its connection?", "802.1q VLANs", [
          ["802.11 Wi-Fi", "Wi-Fi is wireless LAN; DX is a dedicated wired link.", "Wi-Fi — беспроводная LAN; DX — выделенное проводное подключение."],
          ["802.3 Ethernet hubs", "Hubs are layer 2 LAN devices, not the DX standard.", "Hubs — устройства LAN уровня 2, а не стандарт DX."],
          ["IPsec over the internet", "IPsec over the internet is how a Site-to-Site VPN works.", "IPsec через интернет — так работает Site-to-Site VPN."],
        ], "DX uses open standard 802.1q virtual LANs.", "DX использует открытый стандарт 802.1q VLAN."),
        qx("Which AWS services are reached through gateway VPC endpoints?", "Amazon S3 and Amazon DynamoDB", [
          ["Amazon EC2 and Amazon RDS", "EC2 and RDS run inside your VPC; they are not gateway endpoint services.", "EC2 и RDS работают внутри VPC; это не сервисы gateway endpoints."],
          ["AWS Lambda and Amazon Redshift", "Gateway endpoints exist only for S3 and DynamoDB.", "Gateway endpoints есть только для S3 и DynamoDB."],
          ["Amazon CloudFront and Route 53", "These are edge services, not gateway endpoint targets.", "Это edge-сервисы, а не цели gateway endpoints."],
        ], "Gateway endpoints serve Amazon S3 and Amazon DynamoDB and cost nothing extra.", "Gateway endpoints работают с Amazon S3 и Amazon DynamoDB и не требуют доплаты."),
        qx("Which statement about VPC endpoints is true?", "Traffic never leaves the Amazon network", [
          ["Instances need public IP addresses to use them", "Instances need no public IPs to reach the service through an endpoint.", "Инстансам не нужны публичные IP, чтобы обращаться к сервису через endpoint."],
          ["They only work through a NAT gateway", "Endpoints need no internet gateway, NAT device, VPN or Direct Connect.", "Endpoints не требуют internet gateway, NAT, VPN или Direct Connect."],
          ["Gateway endpoints are billed per hour", "Gateway endpoints have no extra charge; interface endpoints are hourly.", "Gateway endpoints без доплаты; почасово оплачиваются interface endpoints."],
        ], "A VPC endpoint connects privately to supported services, and the traffic stays on the Amazon network.", "VPC endpoint приватно соединяет с поддерживаемыми сервисами, и трафик остаётся в сети Amazon."),
        qx("Which endpoint type is powered by AWS PrivateLink and uses an elastic network interface?", "An interface endpoint", [
          ["A gateway endpoint", "Gateway endpoints are route table targets for S3 and DynamoDB.", "Gateway endpoints — targets в route table для S3 и DynamoDB."],
          ["A NAT gateway endpoint", "There is no such endpoint type; the two types are interface and gateway.", "Такого типа нет; типов два — interface и gateway."],
          ["A transit gateway endpoint", "Transit Gateway is a hub for networks, not an endpoint type.", "Transit Gateway — хаб для сетей, а не тип endpoint."],
        ], "Interface endpoints are powered by AWS PrivateLink and are charged hourly plus data processing.", "Interface endpoints работают на AWS PrivateLink и оплачиваются почасово плюс за обработку данных."),
        qx("A company has 100 VPCs and many VPN links, and peering is too hard to manage. Which service gives a hub-and-spoke model?", "AWS Transit Gateway", [
          ["Full-mesh VPC peering", "Full-mesh peering is exactly the point-to-point model that becomes hard to manage.", "Полносвязный peering — та самая схема точка-точка, которую трудно сопровождать."],
          ["VPC sharing", "VPC sharing shares subnets between accounts; it is not a routing hub.", "VPC sharing делит подсети между аккаунтами; это не хаб маршрутизации."],
          ["A NAT gateway", "A NAT gateway only gives private subnets outbound internet access.", "NAT gateway лишь выпускает частные подсети в интернет."],
        ], "With Transit Gateway each network connects once to a central hub that routes traffic among all spokes.", "С Transit Gateway каждая сеть подключается один раз к центральному хабу, который маршрутизирует трафик между всеми."),
      ],
    ),
    part(
      "cc-l4-p4",
      { en: "VPC security: security groups and network ACLs", ru: "Безопасность VPC: security groups и network ACLs" },
      {
        en: `## Two firewalls in a VPC
You can build security into your VPC architecture so that you have **complete control over incoming and outgoing traffic**. Amazon VPC offers two firewall options:
- **security groups** — work at the **instance** level;
- **network access control lists (network ACLs)** — work at the **subnet** level.
@diagram cc-sg-nacl
## Security groups
A **security group** acts as a **virtual firewall for your instance** and controls its **inbound and outbound traffic**.
- It acts at the **instance level, not the subnet level**, so each instance in a subnet can be assigned a **different set** of security groups.
- At the most basic level, a security group is a way to **filter traffic to your instances**.
## Security group rules
- Rules control **inbound** and **outbound** instance traffic.
- A new security group has **no inbound rules**: no inbound traffic from another host is allowed until you add rules.
- By default it has an **outbound rule that allows all outbound traffic**. You can remove it and allow only specific outbound traffic; with **no outbound rules**, no outbound traffic is allowed.
- **Default security groups deny all inbound traffic and allow all outbound traffic.**
## Stateful
Security groups are **stateful**: state information is kept even after a request is processed.
- If your instance sends a request, the **response is allowed back in** regardless of the inbound rules.
- Responses to **allowed inbound** traffic are allowed out regardless of the outbound rules.
## Custom security groups
- You can specify **allow rules, but not deny rules** — anything that is not allowed is denied.
- **All rules are evaluated** before the decision to allow traffic.
Example: a custom security group for a public web server.
| Direction | Protocol | Port | Source / destination | Why |
|---|---|---|---|---|
| Inbound | TCP | 80 (HTTP) | 0.0.0.0/0 | anyone can open the website |
| Inbound | TCP | 443 (HTTPS) | 0.0.0.0/0 | secure website traffic |
| Inbound | TCP | 22 (SSH) | 203.0.113.0/24 | administration only from the office range |
| Outbound | All | All | 0.0.0.0/0 | the default outbound rule |
![AWS EC2 console screenshot of 'Edit inbound rules' for a security group: three rows — SSH, TCP 22 from a custom IP range; HTTP, TCP 80 and HTTPS, TCP 443 from 0.0.0.0/0 — and an orange 'Save rules' button](/events/cc/l4-security-group-rules.webp)
## Network ACLs
A **network ACL** is an **optional layer of security** for your VPC. It acts as a **firewall for traffic in and out of one or more subnets**; its rules are similar to security group rules.
- Each subnet **must be associated** with a network ACL; if you do not choose one, the subnet gets the **default network ACL**.
- One network ACL can be associated with **many subnets**, but a subnet has **only one** network ACL at a time — a new association **replaces** the previous one.
- A network ACL has **separate inbound and outbound rules**, and each rule can **allow or deny** traffic.
- Your VPC comes with a **modifiable default network ACL** that **allows all inbound and outbound IPv4 traffic** (and IPv6 traffic, if applicable).
- Network ACLs are **stateless**: no information about a request is kept after it is processed, so **return traffic must be allowed explicitly** by rules.
## Custom network ACLs
- A **custom network ACL denies all inbound and outbound traffic** until you add rules.
- You can specify **both allow and deny** rules.
- Rules are **numbered** and evaluated **in number order, starting with the lowest**; the first rule that matches decides.
- The highest rule number you can use is **32,766**. AWS recommends creating rules in **increments of 10 or 100**, so that new rules can be inserted later where you need them.
- The final asterisk rule denies anything that matched no numbered rule.
Example inbound rules of a custom network ACL:
| Rule # | Type | Port | Source | Allow / Deny |
|---|---|---|---|---|
| 100 | HTTP | 80 | 0.0.0.0/0 | ALLOW |
| 110 | HTTPS | 443 | 0.0.0.0/0 | ALLOW |
| 120 | SSH | 22 | 203.0.113.0/24 | ALLOW |
| 130 | Custom TCP | 1024–65535 | 0.0.0.0/0 | ALLOW — replies to requests the instances send out |
| * | All traffic | All | 0.0.0.0/0 | DENY |
## Security groups versus network ACLs
| Attribute | Security groups | Network ACLs |
|---|---|---|
| Scope | instance level | subnet level |
| Supported rules | allow rules only | allow and deny rules |
| State | stateful — return traffic is automatically allowed, regardless of rules | stateless — return traffic must be explicitly allowed by rules |
| Order of rules | all rules are evaluated before the decision | rules are evaluated in number order |
| Default | default SG: deny all inbound, allow all outbound | default ACL: allow all inbound and outbound |
| Custom, before you add rules | no inbound rules, all outbound allowed | denies all inbound and outbound |
## Key takeaways for VPC security
- **Isolate subnets** if possible.
- Choose the **appropriate gateway device or VPN connection** for your needs.
- **Use firewalls** — security groups and network ACLs together give **defence in depth**: the ACL guards the subnet, the security group guards each instance.
> Security group = instance, allow-only, stateful, all rules checked. Network ACL = subnet, allow and deny, stateless, lowest number first.
?? A network ACL allows inbound HTTP on port 80 but has no outbound rules except the final deny. Will the web page reach the visitor?
?= No. Network ACLs are stateless, so the response needs its own outbound rule (for example ephemeral ports 1024–65535).
?? You want to block one specific IP address that attacks your web servers. Which firewall can do it, and why?
?= A network ACL, because it supports deny rules; security groups can only allow traffic.`,
        ru: `## Два firewall в VPC
Безопасность можно встроить в архитектуру VPC так, чтобы иметь **полный контроль над входящим и исходящим трафиком**. В Amazon VPC есть два варианта firewall:
- **security groups (группы безопасности)** — работают на уровне **инстанса**;
- **network access control lists (network ACLs, списки контроля доступа)** — работают на уровне **подсети**.
@diagram cc-sg-nacl
## Security groups
**Security group** работает как **виртуальный firewall для инстанса** и контролирует его **входящий (inbound) и исходящий (outbound) трафик**.
- Она действует на **уровне инстанса, а не подсети**, поэтому каждому инстансу в подсети можно назначить **свой набор** security groups.
- В самом простом смысле security group — это способ **фильтровать трафик к инстансам**.
## Правила security group
- Правила контролируют **inbound** и **outbound** трафик инстанса.
- У новой security group **нет inbound-правил**: входящий трафик от других хостов не пропускается, пока вы не добавите правила.
- По умолчанию в ней есть **outbound-правило, разрешающее весь исходящий трафик**. Его можно удалить и разрешить только нужный трафик; если **outbound-правил нет**, исходящий трафик не пропускается.
- **Default security group запрещает весь входящий трафик и разрешает весь исходящий.**
## Stateful
Security groups — **stateful (с отслеживанием состояния)**: информация о состоянии сохраняется и после обработки запроса.
- Если инстанс отправил запрос, **ответ пропускается обратно** независимо от inbound-правил.
- Ответы на **разрешённый входящий** трафик выходят наружу независимо от outbound-правил.
## Custom security groups
- Можно задавать **правила allow, но не deny** — всё, что не разрешено, запрещено.
- **Все правила проверяются** до того, как принимается решение пропустить трафик.
Пример: custom security group для публичного веб-сервера.
| Направление | Протокол | Порт | Источник / назначение | Зачем |
|---|---|---|---|---|
| Inbound | TCP | 80 (HTTP) | 0.0.0.0/0 | сайт может открыть любой |
| Inbound | TCP | 443 (HTTPS) | 0.0.0.0/0 | защищённый трафик сайта |
| Inbound | TCP | 22 (SSH) | 203.0.113.0/24 | администрирование только из диапазона офиса |
| Outbound | All | All | 0.0.0.0/0 | outbound-правило по умолчанию |
![Скриншот консоли AWS EC2, окно «Edit inbound rules» для security group: три строки — SSH, TCP 22 из своего диапазона IP; HTTP, TCP 80 и HTTPS, TCP 443 из 0.0.0.0/0 — и оранжевая кнопка «Save rules»](/events/cc/l4-security-group-rules.webp)
## Network ACLs
**Network ACL** — **необязательный дополнительный уровень защиты** VPC. Он работает как **firewall для трафика, входящего в одну или несколько подсетей и выходящего из них**; его правила похожи на правила security groups.
- Каждая подсеть **обязана быть связана** с network ACL; если вы ничего не выбрали, подсеть получает **default network ACL**.
- Один network ACL можно связать с **многими подсетями**, но у подсети **только один** network ACL одновременно — новая привязка **заменяет** прежнюю.
- В network ACL **отдельные inbound- и outbound-правила**, и каждое правило может **разрешать (allow) или запрещать (deny)** трафик.
- В VPC сразу есть **изменяемый default network ACL**, который **разрешает весь входящий и исходящий трафик IPv4** (и IPv6, если он используется).
- Network ACLs — **stateless (без отслеживания состояния)**: после обработки запроса информация о нём не хранится, поэтому **обратный трафик нужно разрешать явно** правилами.
## Custom network ACLs
- **Custom network ACL запрещает весь входящий и исходящий трафик**, пока вы не добавите правила.
- Можно задавать **и allow, и deny** правила.
- Правила **пронумерованы** и проверяются **по порядку номеров, начиная с наименьшего**; решает первое совпавшее правило.
- Наибольший допустимый номер правила — **32 766**. AWS советует создавать правила **с шагом 10 или 100**, чтобы позже можно было вставить новые правила в нужное место.
- Последнее правило со звёздочкой запрещает всё, что не совпало ни с одним пронумерованным правилом.
Пример inbound-правил custom network ACL:
| Rule # | Тип | Порт | Источник | Allow / Deny |
|---|---|---|---|---|
| 100 | HTTP | 80 | 0.0.0.0/0 | ALLOW |
| 110 | HTTPS | 443 | 0.0.0.0/0 | ALLOW |
| 120 | SSH | 22 | 203.0.113.0/24 | ALLOW |
| 130 | Custom TCP | 1024–65535 | 0.0.0.0/0 | ALLOW — ответы на запросы, которые отправляют инстансы |
| * | All traffic | All | 0.0.0.0/0 | DENY |
## Security groups и network ACLs: сравнение
| Признак | Security groups | Network ACLs |
|---|---|---|
| Scope (уровень) | уровень инстанса | уровень подсети |
| Правила | только allow | allow и deny |
| Состояние | stateful — обратный трафик пропускается автоматически, независимо от правил | stateless — обратный трафик нужно явно разрешить правилами |
| Порядок правил | все правила проверяются до решения | правила проверяются по порядку номеров |
| По умолчанию | default SG: весь inbound запрещён, весь outbound разрешён | default ACL: весь inbound и outbound разрешён |
| Custom, пока нет правил | inbound-правил нет, outbound разрешён | запрещает весь inbound и outbound |
## Главное о безопасности VPC
- По возможности **изолируйте подсети**.
- Выбирайте **подходящий шлюз или VPN-подключение** под задачу.
- **Используйте firewall** — security groups и network ACLs вместе дают **эшелонированную защиту (defence in depth)**: ACL охраняет подсеть, security group — каждый инстанс.
> Security group = инстанс, только allow, stateful, проверяются все правила. Network ACL = подсеть, allow и deny, stateless, сначала наименьший номер.
?? Network ACL разрешает входящий HTTP на порт 80, но из outbound-правил есть только финальный deny. Дойдёт ли страница до посетителя?
?= Нет. Network ACLs — stateless, поэтому ответу нужно своё outbound-правило (например, эфемерные порты 1024–65535).
?? Нужно заблокировать один конкретный IP-адрес, который атакует веб-серверы. Какой firewall это умеет и почему?
?= Network ACL, потому что он поддерживает правила deny; security groups умеют только разрешать трафик.`,
      },
      [
        qx("At which level does a security group act?", "At the instance level", [
          ["At the subnet level", "The subnet level is where network ACLs act.", "На уровне подсети работают network ACLs."],
          ["At the whole VPC level", "Security groups are assigned per instance, not per VPC.", "Security groups назначаются инстансам, а не всему VPC."],
          ["At the Region level", "Security groups filter traffic of individual instances, not Regions.", "Security groups фильтруют трафик отдельных инстансов, а не регионов."],
        ], "A security group is a virtual firewall for an instance, so each instance in a subnet can have different groups.", "Security group — виртуальный firewall инстанса, поэтому у инстансов одной подсети группы могут быть разными."),
        qx("At which level does a network ACL act?", "At the subnet level", [
          ["At the instance level", "The instance level is where security groups act.", "На уровне инстанса работают security groups."],
          ["At the Availability Zone level", "A network ACL is associated with subnets, not with whole AZs.", "Network ACL связывают с подсетями, а не с целыми AZ."],
          ["At the AWS account level", "Network ACLs belong to a VPC and protect its subnets.", "Network ACLs принадлежат VPC и защищают его подсети."],
        ], "A network ACL is a firewall for traffic in and out of one or more subnets.", "Network ACL — firewall для трафика, входящего в одну или несколько подсетей и выходящего из них."),
        qx("What does a newly created security group allow by default?", "No inbound traffic, all outbound traffic", [
          ["All inbound traffic, no outbound traffic", "It is reversed: inbound is denied and outbound is allowed.", "Наоборот: входящий запрещён, исходящий разрешён."],
          ["All inbound and all outbound traffic", "That is the default network ACL, not a security group.", "Так ведёт себя default network ACL, а не security group."],
          ["No inbound and no outbound traffic", "That is a custom network ACL before you add rules.", "Так ведёт себя custom network ACL до добавления правил."],
        ], "A new security group has no inbound rules and one outbound rule that allows all outbound traffic.", "У новой security group нет inbound-правил и есть одно outbound-правило, разрешающее весь исходящий трафик."),
        qx("Which kind of rules can you add to a security group?", "Allow rules only", [
          ["Deny rules only", "Security groups cannot contain deny rules at all.", "В security groups вообще не бывает правил deny."],
          ["Allow and deny rules", "Network ACLs support both; security groups only allow.", "Оба вида поддерживают network ACLs; security groups только разрешают."],
          ["Numbered deny-first rules", "Numbered rules belong to network ACLs.", "Пронумерованные правила — особенность network ACLs."],
        ], "In a custom security group you specify allow rules, but not deny rules.", "В custom security group задаются правила allow, но не deny."),
        qx("Security groups are stateful. What does that mean?", "Return traffic is allowed automatically", [
          ["Rules are checked from the lowest number up", "That is how network ACLs evaluate their rules.", "Так проверяют правила network ACLs."],
          ["Return traffic needs its own explicit rule", "That describes stateless network ACLs.", "Это описание stateless network ACLs."],
          ["The group keeps a log of every packet", "Stateful means tracking connections, not logging packets.", "Stateful — это отслеживание соединений, а не журнал пакетов."],
        ], "State is kept after a request, so responses flow back regardless of the rules in the other direction.", "Состояние сохраняется после запроса, поэтому ответы проходят независимо от правил в обратную сторону."),
        qx("An instance calls an API on the internet; its security group has no inbound rules. Considering only the group, does the reply get in?", "Yes, because security groups are stateful", [
          ["No, an inbound rule must allow the response", "Stateful groups allow responses to outbound requests automatically.", "Stateful-группы сами пропускают ответы на исходящие запросы."],
          ["No, security groups block all replies", "They do the opposite: replies are tracked and allowed.", "Наоборот: ответы отслеживаются и пропускаются."],
          ["Yes, but only on port 80 or 443", "The response is allowed whatever the port, because the state is tracked.", "Ответ пропускается на любом порту, потому что состояние отслеживается."],
        ], "Response traffic to a request sent from the instance is allowed in regardless of inbound rules.", "Ответ на запрос, отправленный инстансом, пропускается независимо от inbound-правил."),
        qx("How does a security group evaluate its rules?", "All rules are evaluated before deciding", [
          ["Lowest numbered rule first, first match wins", "That is the network ACL method.", "Так работают network ACLs."],
          ["Newest rule first, then the older ones", "Creation order does not matter in a security group.", "Порядок создания в security group не важен."],
          ["Deny rules first, then allow rules", "Security groups have no deny rules at all.", "В security groups вообще нет правил deny."],
        ], "For security groups, all rules are evaluated before the decision is made to allow traffic.", "В security groups все правила проверяются до решения пропустить трафик."),
        qx("How are network ACL rules evaluated?", "In number order, starting with the lowest", [
          ["All at once before any decision", "Evaluating all rules together is how security groups work.", "Проверять все правила сразу — так работают security groups."],
          ["In number order, starting with the highest", "Evaluation starts from the lowest number, not the highest.", "Проверка начинается с наименьшего номера, а не с наибольшего."],
          ["In the order they were created", "The rule number decides the order, not the creation time.", "Порядок задаёт номер правила, а не время создания."],
        ], "A network ACL is a numbered list of rules checked from the lowest number up.", "Network ACL — пронумерованный список правил, проверяемых от наименьшего номера."),
        qx("What is the highest rule number you can use in a network ACL?", "32,766", [
          ["65,535", "65,535 is the highest port number, not an ACL rule number.", "65 535 — наибольший номер порта, а не правила ACL."],
          ["1,000", "1,000 is far below the real maximum.", "1 000 намного меньше настоящего максимума."],
          ["100", "100 is a common first rule number, not the maximum.", "100 — частый номер первого правила, а не максимум."],
        ], "The highest rule number is 32,766.", "Наибольший номер правила — 32 766."),
        qx("Why does AWS recommend numbering network ACL rules in steps of 10 or 100?", "To leave room to insert new rules later", [
          ["Because AWS reads only multiples of 10", "Any number up to 32,766 is valid.", "Допустим любой номер до 32 766."],
          ["Because lower numbers cost more", "Rule numbers have no effect on cost.", "Номера правил не влияют на стоимость."],
          ["To make rules apply in random order", "Rules are always evaluated in number order.", "Правила всегда проверяются по порядку номеров."],
        ], "Gaps between numbers let you insert new rules exactly where you need them later.", "Промежутки между номерами позволяют потом вставить новые правила в нужное место."),
        qx("What does the default network ACL of a VPC allow?", "All inbound and outbound IPv4 traffic", [
          ["No traffic until you add rules", "That is a custom network ACL.", "Так ведёт себя custom network ACL."],
          ["Inbound traffic only from inside the same subnet", "The default ACL places no such limit; it allows everything.", "У default ACL нет такого ограничения; он разрешает всё."],
          ["Outbound only, inbound is denied", "That resembles a default security group, not the default ACL.", "Это похоже на default security group, а не на default ACL."],
        ], "The modifiable default network ACL allows all inbound and outbound IPv4 traffic (and IPv6, if applicable).", "Изменяемый default network ACL разрешает весь входящий и исходящий трафик IPv4 (и IPv6, если есть)."),
        qx("You create a custom network ACL and add no rules. What traffic passes?", "No traffic in either direction", [
          ["All inbound and outbound traffic", "Allowing everything is the default ACL, not a new custom one.", "Разрешать всё — свойство default ACL, а не нового custom."],
          ["Only outbound traffic from the subnet", "A custom ACL denies outbound traffic too until rules are added.", "Custom ACL запрещает и исходящий трафик, пока нет правил."],
          ["Only return traffic for open sessions", "ACLs are stateless; they do not track sessions.", "ACLs — stateless и сессии не отслеживают."],
        ], "Each custom network ACL denies all inbound and outbound traffic until you add rules.", "Каждый custom network ACL запрещает весь входящий и исходящий трафик, пока не добавлены правила."),
        qx("A web server must block one attacker's IP address. Which firewall can do this?", "A network ACL with a deny rule", [
          ["A security group with a deny rule", "Security groups have no deny rules.", "В security groups нет правил deny."],
          ["A route table with a deny route", "Route tables direct traffic; they have no deny entries.", "Route tables направляют трафик; записей deny в них нет."],
          ["An internet gateway block list", "An internet gateway has no rules or block lists.", "У internet gateway нет правил и списков блокировки."],
        ], "Only network ACLs support deny rules, so they can block a specific address.", "Правила deny поддерживают только network ACLs, поэтому они могут заблокировать конкретный адрес."),
        qx("A subnet's network ACL allows inbound HTTP but has no matching outbound rule. Why can the reply fail?", "Network ACLs are stateless", [
          ["Network ACLs are stateful", "If they were stateful, the reply would pass automatically.", "Будь они stateful, ответ прошёл бы автоматически."],
          ["Security groups block all replies", "Security groups are stateful and allow replies.", "Security groups — stateful и ответы пропускают."],
          ["Route tables drop port 80", "Route tables know nothing about ports.", "Route tables ничего не знают о портах."],
        ], "No state is kept, so return traffic must be explicitly allowed by an outbound rule.", "Состояние не хранится, поэтому обратный трафик нужно явно разрешить outbound-правилом."),
        qx("How many network ACLs can one subnet be associated with at a time?", "Exactly one", [
          ["Up to five", "A subnet has only one network ACL at a time.", "У подсети одновременно только один network ACL."],
          ["None, ACLs attach to instances", "ACLs attach to subnets; security groups attach to instances.", "ACL привязывают к подсетям; к инстансам — security groups."],
          ["As many as the VPC has", "A new association replaces the previous one.", "Новая привязка заменяет предыдущую."],
        ], "A subnet is associated with one network ACL at a time, though one ACL can serve many subnets.", "Подсеть связана с одним network ACL одновременно, хотя один ACL может обслуживать много подсетей."),
        qx("You do not associate a new subnet with any network ACL. What happens?", "It uses the default network ACL", [
          ["It has no firewall at the subnet level", "Every subnet must be associated with a network ACL.", "Каждая подсеть обязана быть связана с network ACL."],
          ["It uses the newest custom ACL", "Without a choice, the default ACL applies, not the newest one.", "Если ничего не выбрано, действует default ACL, а не самый новый."],
          ["It cannot be created until you pick one", "The subnet is created and gets the default ACL automatically.", "Подсеть создаётся и автоматически получает default ACL."],
        ], "A subnet that is not explicitly associated is automatically associated with the default network ACL.", "Подсеть без явной привязки автоматически связывается с default network ACL."),
        qx("Each instance in one subnet must allow a different set of ports. Which feature fits best?", "Security groups per instance", [
          ["One network ACL for the subnet", "A network ACL applies the same rules to the whole subnet.", "Network ACL применяет одни правила ко всей подсети."],
          ["A separate route table per instance", "Route tables attach to subnets and control routing, not ports.", "Route tables привязаны к подсетям и управляют маршрутами, а не портами."],
          ["One Elastic IP per instance", "An Elastic IP is an address, not a traffic filter.", "Elastic IP — адрес, а не фильтр трафика."],
        ], "Security groups act at the instance level, so each instance can get its own set of rules.", "Security groups работают на уровне инстанса, поэтому каждому можно дать свой набор правил."),
        tfx("A single network ACL can be associated with several subnets at the same time.", true,
          "One network ACL can serve many subnets; only the reverse is limited — one ACL per subnet.",
          "Один network ACL может обслуживать много подсетей; ограничено только обратное — один ACL на подсеть.",
          "'False' confuses the two directions: the limit is one ACL per subnet, not one subnet per ACL.",
          "Ответ «неверно» путает направления: ограничение — один ACL на подсеть, а не одна подсеть на ACL."),
        tfx("If a security group has no outbound rules, no outbound traffic that starts from the instance is allowed.", true,
          "Outbound traffic is allowed only by rules; the default 'allow all outbound' rule can be removed.",
          "Исходящий трафик разрешают только правила; правило «разрешить весь outbound» по умолчанию можно удалить.",
          "'False' assumes outbound is always open, but that is only the default rule, and it can be deleted.",
          "Ответ «неверно» считает, что outbound открыт всегда, но это лишь правило по умолчанию, и его можно удалить."),
        qx("Which statement correctly compares security groups and network ACLs?", "SGs are stateful; network ACLs are stateless", [
          ["SGs are stateless; network ACLs are stateful", "It is the other way round.", "Всё наоборот."],
          ["Both are stateful and allow-only", "Network ACLs are stateless and support deny rules.", "Network ACLs — stateless и поддерживают deny."],
          ["Both act at the subnet level", "Security groups act at the instance level.", "Security groups работают на уровне инстанса."],
        ], "Security groups: instance level, allow only, stateful. Network ACLs: subnet level, allow and deny, stateless.", "Security groups: уровень инстанса, только allow, stateful. Network ACLs: уровень подсети, allow и deny, stateless."),
      ],
    ),
    part(
      "cc-l4-p5",
      { en: "Content delivery and software-defined networking", ru: "Доставка контента и программно-определяемые сети" },
      {
        en: `## Content delivery network (CDN)
A **content delivery network (CDN)** is a **distributed server network** that delivers **temporarily stored (cached) copies** of website content to users **based on their geographic location**.
- It is a **geographically distributed network of proxy servers** and their data centers.
- Goal: **high availability and performance**, by distributing the service **spatially relative to end users**.
- A CDN stores content in distributed locations and **reduces the distance** between website visitors and the website server.
- CDNs appeared in the **late 1990s** to relieve the **performance bottlenecks of the internet**, when it was becoming a mission-critical medium for people and enterprises.
## What CDNs deliver today
- **web objects** — text, graphics, scripts;
- **downloadable objects** — media files, software, documents;
- **applications** — e-commerce, portals;
- **live streaming** and **on-demand streaming** media;
- **social media** sites.
## Single server versus CDN distribution
- **Single server distribution** — one origin server sends every response to every user, near or far. Distant users wait longer, and that one server carries the whole load.
- **CDN scheme of distribution** — many servers around the world each hold a cached copy and serve the users **closest** to them.
In the lecture video, users in Los Angeles and New York are about 1,500 miles from the origin, London about 4,800 miles and Sydney about 8,600 miles: the farther the user, the higher the **latency**, unless a nearby CDN server answers.
@diagram cc-cdn
![World map with one origin server in North America and orange CDN edge servers in Los Angeles, London and Sydney, each edge server drawn with short arrows to nearby user laptops instead of one long arrow from the origin](/events/cc/l4-cdn-edge-map.webp)
| Benefit | Why it happens |
|---|---|
| Faster load times (lower latency) | content comes from a nearby server, not from a distant origin |
| High availability | many servers: if one fails or is overloaded, others still serve the content |
| Less load on the origin server | cached copies answer most requests |
| Handles traffic spikes | the load is spread over many locations |
On AWS the CDN service is **Amazon CloudFront**, which caches content in **edge locations** around the world.
## Software-defined networking (SDN)
**SDN (software-defined networking)** is a networking **architecture approach** that enables the **control and management of the network using software applications**. The behaviour of the **entire network and its devices** is programmed in a **centrally controlled** manner through software applications using **open APIs**.
Definition from the slide: SDN is an approach to network management that enables **dynamic, programmatically efficient network configuration** to improve network **performance and monitoring**, in a manner more like **cloud computing** than traditional network management.
## Data plane and control plane
| Plane | What it does |
|---|---|
| Data plane | forwarding of packets; segmentation and reassembly of data; replication of packets for multicasting |
| Control plane | making routing tables; setting packet handling policies |
The data plane runs streaming algorithms on packets: forwarding, access control, mapping header fields, traffic monitoring, buffering and marking, shaping and scheduling, deep packet inspection.
- **Traditional network** — **each switch has its own data plane and control plane**. The control planes of the switches exchange topology information and build a **forwarding table** that decides where each incoming packet goes.
- **SDN** — the **control plane is taken away from the switch** and given to a **centralized SDN controller**. The administrator shapes traffic from a **central console** without touching each switch. The **data plane stays in the switch**, which forwards packets according to **flow tables** pre-assigned by the controller.
SDN addresses the **static architecture of traditional networks** by **decoupling** forwarding (data plane) from routing (control plane). The controllers are the **brains** of the network — but centralization has drawbacks in **security, scalability and elasticity**.
## SDN architecture
| Layer | Contains | Role |
|---|---|---|
| Application layer | network apps: intrusion detection, firewall, load balancing | decides what the network should do |
| Control layer | the SDN controller | the brain; abstracts the hardware for the apps above |
| Infrastructure layer | physical switches | the data plane: actually moves the packets |
- **Northbound APIs** connect the **application** and **control** layers.
- **Southbound APIs** connect the **control** and **infrastructure** layers.
@diagram cc-sdn
## Why SDN is important and where it is used
- **Better network connectivity** — for sales, services and internal communication, with faster data sharing.
- **Better deployment of applications** — new applications, services and business models are deployed faster.
- **Better security** — visibility across the whole network; operators can create **separate zones** for devices that need different security levels.
- **Better control with high speed** — thanks to an open-standard, software-based controller.
**Enterprises** use SDN to deploy applications faster while **lowering deployment and operating costs**, and to manage and provision network services **from a single location**. **Cloud providers** use **generic hardware**, so the cloud data center can be changed easily and **CAPEX and OPEX** are saved.
## Models of SDN
- **Open SDN** — built with **OpenFlow switches**; the controller talks to the switches through the **southbound API** using the **OpenFlow protocol**.
- **SDN via APIs** — functions in remote devices are invoked with conventional methods such as **SNMP or CLI**, or newer ones such as a **REST API**; the devices expose control points for the controller.
- **SDN via hypervisor-based overlay network** — the configuration of the physical devices is **unchanged**; hypervisors build **virtual overlay networks** on top of the physical network. Only the **edge devices** connect to the virtual networks, hiding the other physical devices.
- **Hybrid SDN** — **traditional networking and SDN combined** in one network to support different functions.
![SDN controller dashboard on a wide monitor in a network operations room: a topology map of switches as green circles joined by lines, a side panel listing flow-table rules, and a red highlight on one link with dropped suspicious traffic](/events/cc/l4-sdn-controller-dashboard.webp)
## SDN versus traditional networking
| Software-defined networking | Traditional networking |
|---|---|
| a virtual networking approach | the old conventional approach |
| centralized control | distributed control |
| programmable | non-programmable |
| open interface | closed interface |
| data and control planes decoupled by software | data and control planes on the same device |
## Advantages and disadvantages
Advantages:
- the network is **programmable**, so it is changed through the controller instead of switch by switch;
- **switch hardware becomes cheaper**, because each switch only needs a data plane;
- hardware is **abstracted**, so applications run on top of the controller **independent of the switch vendor**;
- **better security** — the controller monitors traffic and deploys security policies; on suspicious activity it can **reroute or drop** packets.
Disadvantages:
- the central controller is a **single point of failure** — if it is corrupted, the **entire network** is affected;
- the use of SDN at **large scale is not yet properly defined and explored**.
> SDN = the control plane is pulled out of the switches into one programmable controller, and the switches keep only the data plane; northbound APIs face the apps, southbound APIs (OpenFlow) face the switches.
?? In SDN, where do the data plane and the control plane live?
?= The data plane stays in each switch; the control plane moves to the centralized SDN controller.
?? Why does a CDN make a website faster for a user in Sydney when the origin server is in the USA?
?= The user gets a cached copy from a nearby CDN server, so the data travels a much shorter distance and latency drops.`,
        ru: `## Content delivery network (CDN)
**Content delivery network (CDN, сеть доставки контента)** — **распределённая сеть серверов**, которая доставляет пользователям **временно сохранённые (cached) копии** контента сайта **с учётом их географического положения**.
- Это **географически распределённая сеть прокси-серверов** и их дата-центров.
- Цель — **high availability и performance (высокая доступность и производительность)** за счёт того, что сервис **размещён в пространстве ближе к конечным пользователям**.
- CDN хранит контент в распределённых точках и **сокращает расстояние** между посетителями сайта и сервером.
- CDN появились в **конце 1990-х**, чтобы снять **узкие места производительности интернета**, когда он становился критически важным для людей и компаний.
## Что CDN доставляют сегодня
- **веб-объекты** — текст, графику, скрипты;
- **загружаемые объекты** — медиафайлы, программы, документы;
- **приложения** — e-commerce, порталы;
- **live streaming** и **on-demand streaming** (потоковое видео в прямом эфире и по запросу);
- сайты **социальных сетей**.
## Один сервер против схемы CDN
- **Single server distribution (раздача с одного сервера)** — один исходный сервер (origin) отвечает каждому пользователю, близкому или далёкому. Далёкие пользователи ждут дольше, а вся нагрузка ложится на один сервер.
- **CDN scheme of distribution (схема CDN)** — много серверов по всему миру, у каждого кэшированная копия, и каждый обслуживает **ближайших** к нему пользователей.
В видео лекции пользователи в Лос-Анджелесе и Нью-Йорке находятся примерно в 1 500 милях от origin, в Лондоне — в 4 800 милях, в Сиднее — в 8 600 милях: чем дальше пользователь, тем выше **latency (задержка)**, если только не ответит ближайший сервер CDN.
@diagram cc-cdn
![Карта мира: один исходный сервер в Северной Америке и оранжевые edge-серверы CDN в Лос-Анджелесе, Лондоне и Сиднее; от каждого edge-сервера короткие стрелки к ноутбукам пользователей поблизости вместо одной длинной стрелки от origin](/events/cc/l4-cdn-edge-map.webp)
| Преимущество | Почему так |
|---|---|
| Быстрее загрузка (меньше latency) | контент приходит с ближнего сервера, а не с далёкого origin |
| High availability | серверов много: если один упал или перегружен, контент отдают другие |
| Меньше нагрузка на origin | на большинство запросов отвечают кэшированные копии |
| Выдерживает всплески трафика | нагрузка распределена по многим точкам |
В AWS сервис CDN — **Amazon CloudFront**, он кэширует контент в **edge locations** по всему миру.
## Software-defined networking (SDN)
**SDN (software-defined networking, программно-определяемые сети)** — **архитектурный подход** к сетям, при котором **сеть контролируется и управляется с помощью программных приложений**. Поведение **всей сети и её устройств** программируется **централизованно** через программы, использующие **открытые API**.
Определение со слайда: SDN — подход к управлению сетью, который даёт **динамичную, программно эффективную настройку сети** для улучшения её **производительности и мониторинга** — скорее в духе **cloud computing**, чем традиционного управления сетью.
## Data plane и control plane
| Плоскость | Что делает |
|---|---|
| Data plane (плоскость данных) | пересылка пакетов; сегментация и сборка данных; копирование пакетов для multicast |
| Control plane (плоскость управления) | построение таблиц маршрутизации; задание политик обработки пакетов |
Data plane выполняет потоковые алгоритмы над пакетами: пересылку, контроль доступа, сопоставление полей заголовков, мониторинг трафика, буферизацию и маркировку, шейпинг и планирование, deep packet inspection.
- **Традиционная сеть** — **у каждого коммутатора свои data plane и control plane**. Control planes коммутаторов обмениваются сведениями о топологии и строят **forwarding table (таблицу пересылки)**, которая решает, куда пойдёт каждый входящий пакет.
- **SDN** — **control plane забирают у коммутатора** и передают **централизованному SDN controller**. Администратор управляет трафиком с **центральной консоли**, не трогая каждый коммутатор. **Data plane остаётся в коммутаторе**, и он пересылает пакеты по **flow tables**, заранее заполненным контроллером.
SDN решает проблему **статичной архитектуры традиционных сетей**, **разделяя** пересылку (data plane) и маршрутизацию (control plane). Контроллеры — это **«мозг»** сети, но у централизации есть минусы в **безопасности, масштабируемости и эластичности**.
## Архитектура SDN
| Уровень | Что содержит | Роль |
|---|---|---|
| Application layer | сетевые приложения: обнаружение вторжений, firewall, балансировка нагрузки | решает, что сеть должна делать |
| Control layer | SDN controller | «мозг»; абстрагирует оборудование для приложений сверху |
| Infrastructure layer | физические коммутаторы | data plane: реально перемещает пакеты |
- **Northbound APIs** соединяют уровни **application** и **control**.
- **Southbound APIs** соединяют уровни **control** и **infrastructure**.
@diagram cc-sdn
## Почему SDN важна и где её применяют
- **Лучшая связность сети** — для продаж, сервисов и внутренней связи, быстрее обмен данными.
- **Лучшее развёртывание приложений** — новые приложения, сервисы и бизнес-модели запускаются быстрее.
- **Лучшая безопасность** — видимость всей сети; операторы могут создавать **отдельные зоны** для устройств с разным уровнем защиты.
- **Лучший контроль на высокой скорости** — благодаря программному контроллеру на открытых стандартах.
**Компании (enterprises)** используют SDN, чтобы быстрее разворачивать приложения, **снижая затраты на развёртывание и эксплуатацию**, и управлять сетевыми сервисами **из одного места**. **Облачные провайдеры** используют **типовое (generic) оборудование**, поэтому дата-центр легко менять, а **CAPEX и OPEX** экономятся.
## Модели SDN
- **Open SDN** — строится на **OpenFlow switches**; контроллер общается с коммутаторами через **southbound API** по **протоколу OpenFlow**.
- **SDN via APIs** — функции удалённых устройств вызываются привычными способами, например **SNMP или CLI**, или новыми, например **REST API**; устройства предоставляют контроллеру точки управления.
- **SDN via hypervisor-based overlay network** — конфигурация физических устройств **не меняется**; hypervisors строят **виртуальные overlay-сети** поверх физической. К виртуальным сетям подключены только **пограничные (edge) устройства**, остальные физические устройства скрыты.
- **Hybrid SDN** — **традиционные сети и SDN вместе** в одной сети для поддержки разных функций.
![Панель SDN-контроллера на широком мониторе в центре управления сетью: карта топологии с коммутаторами в виде зелёных кругов, соединённых линиями, боковая панель со списком правил flow table и красная подсветка одного канала, где отброшен подозрительный трафик](/events/cc/l4-sdn-controller-dashboard.webp)
## SDN против традиционных сетей
| Software-defined networking | Traditional networking |
|---|---|
| виртуальный подход к сетям | старый традиционный подход |
| централизованное управление | распределённое управление |
| программируемая | непрограммируемая |
| открытый интерфейс | закрытый интерфейс |
| data plane и control plane разделены программно | data plane и control plane на одном устройстве |
## Преимущества и недостатки
Преимущества:
- сеть **программируемая**, поэтому её меняют через контроллер, а не коммутатор за коммутатором;
- **оборудование коммутаторов дешевеет**, потому что каждому нужен только data plane;
- оборудование **абстрагировано**, поэтому приложения работают поверх контроллера **независимо от производителя коммутаторов**;
- **лучше безопасность** — контроллер следит за трафиком и применяет политики; при подозрительной активности он может **перенаправить или отбросить** пакеты.
Недостатки:
- центральный контроллер — **single point of failure (единая точка отказа)**: если он повреждён, страдает **вся сеть**;
- применение SDN в **больших масштабах пока толком не определено и не изучено**.
> SDN = control plane вынесен из коммутаторов в один программируемый контроллер, а коммутаторы оставляют себе только data plane; northbound APIs смотрят на приложения, southbound APIs (OpenFlow) — на коммутаторы.
?? Где в SDN находятся data plane и control plane?
?= Data plane остаётся в каждом коммутаторе; control plane переезжает в централизованный SDN controller.
?? Почему CDN ускоряет сайт для пользователя в Сиднее, если origin-сервер в США?
?= Пользователь получает кэшированную копию с ближайшего сервера CDN, данные идут намного меньшее расстояние, и задержка падает.`,
      },
      [
        qx("What is a content delivery network (CDN)?", "Spread-out servers that serve cached copies", [
          ["One very large server that hosts every website", "A CDN is the opposite of a single server: it is distributed.", "CDN — противоположность одного сервера: она распределённая."],
          ["A private line from a data center to AWS", "A dedicated private line is AWS Direct Connect.", "Выделенная частная линия — это AWS Direct Connect."],
          ["A firewall that filters traffic per subnet", "A subnet-level firewall is a network ACL.", "Firewall на уровне подсети — это network ACL."],
        ], "A CDN is a distributed network of proxy servers that delivers cached copies of content based on the user's location.", "CDN — распределённая сеть прокси-серверов, которая отдаёт кэшированные копии контента с учётом местоположения пользователя."),
        tfx("A CDN reduces the distance between website visitors and the content they request.", true,
          "It stores content in distributed locations, so a nearby server can answer each visitor.",
          "Она хранит контент в распределённых точках, поэтому каждому посетителю отвечает ближайший сервер.",
          "'False' would describe single server distribution, where every request travels to one origin.",
          "Ответ «неверно» описывал бы раздачу с одного сервера, когда каждый запрос идёт к одному origin."),
        qx("What is the main goal of a CDN?", "High availability and performance", [
          ["Cheaper storage of database backups", "Backups are a storage topic; a CDN serves content to users.", "Резервные копии — тема хранения; CDN отдаёт контент пользователям."],
          ["Stronger encryption of every packet", "Encryption is not the stated goal of a CDN.", "Шифрование не названо целью CDN."],
          ["Central control of switch flow tables", "Controlling flow tables is the job of an SDN controller.", "Управлять flow tables — задача SDN controller."],
        ], "A CDN distributes the service spatially relative to end users to give high availability and performance.", "CDN размещает сервис ближе к конечным пользователям, чтобы дать высокую доступность и производительность."),
        qx("When did CDNs come into existence, and why?", "Late 1990s, to ease internet bottlenecks", [
          ["Early 1970s, to connect the first ARPANET hosts", "CDNs came much later, when the web became mission-critical.", "CDN появились намного позже, когда веб стал критически важным."],
          ["Late 2010s, to support 5G phones", "CDNs already existed two decades earlier.", "CDN существовали уже за двадцать лет до этого."],
          ["Mid 2000s, to replace DNS servers", "CDNs never replaced DNS; they relieve performance bottlenecks.", "CDN никогда не заменяли DNS; они снимают узкие места производительности."],
        ], "CDNs appeared in the late 1990s to relieve the internet's performance bottlenecks.", "CDN появились в конце 1990-х, чтобы снять узкие места производительности интернета."),
        qx("Which content do CDNs serve today, according to the lecture?", "Web objects, downloads and streaming media", [
          ["Only static HTML text pages, never media", "CDNs also serve media files and live or on-demand streams.", "CDN отдают и медиафайлы, и прямые или записанные трансляции."],
          ["Live video only, never web pages or files", "CDNs serve web objects and downloads as well as video.", "CDN отдают и веб-объекты, и загрузки, а не только видео."],
          ["Database tables and server operating systems", "These are not listed; CDNs deliver content to end users.", "Этого нет в списке; CDN доставляют контент конечным пользователям."],
        ], "CDNs serve web objects, downloadable objects, applications, live and on-demand streaming and social media.", "CDN отдают веб-объекты, загружаемые файлы, приложения, прямые и записанные трансляции и соцсети."),
        qx("A site's only server is in the USA and users in Sydney complain about slow pages. What helps most?", "A CDN with servers near Sydney", [
          ["A bigger server in the same US data center", "A bigger server does not shorten the 8,600-mile distance.", "Более мощный сервер не сокращает расстояние в 8 600 миль."],
          ["A NAT gateway in a public subnet", "NAT gives private instances outbound access; it brings nothing closer.", "NAT даёт частным инстансам выход наружу и ничего не приближает."],
          ["A /16 instead of a /24 subnet", "Subnet size has nothing to do with user latency.", "Размер подсети никак не влияет на задержку у пользователя."],
        ], "A nearby CDN server answers with a cached copy, so latency drops for distant users.", "Ближний сервер CDN отвечает кэшированной копией, и задержка у далёких пользователей падает."),
        qx("What does SDN stand for?", "Software-Defined Networking", [
          ["Secure Distributed Networking", "The S stands for software, not secure.", "S означает software, а не secure."],
          ["Storage Domain Networking", "SDN is about network control, not storage.", "SDN — про управление сетью, а не про хранение."],
          ["Service Directory Network", "SDN is not a directory of services.", "SDN — не каталог сервисов."],
        ], "SDN is software-defined networking: the network is controlled and managed by software applications.", "SDN — software-defined networking: сеть контролируется и управляется программными приложениями."),
        qx("Why does switch hardware become cheaper with SDN?", "Each switch only needs a data plane", [
          ["Each switch runs its own routing software", "That is the traditional model, with a control plane in every switch.", "Это традиционная модель, где control plane есть в каждом коммутаторе."],
          ["Switches are no longer needed at all", "Switches still form the data plane in the infrastructure layer.", "Коммутаторы по-прежнему образуют data plane на infrastructure layer."],
          ["The controller is built into every switch", "The controller is a separate, centralized unit.", "Контроллер — отдельное централизованное устройство."],
        ], "The control plane moves to the controller, so switches only forward packets and can be simpler.", "Control plane переходит в контроллер, поэтому коммутаторы только пересылают пакеты и становятся проще."),
        qx("Which task belongs to the data plane?", "Forwarding packets", [
          ["Making routing tables", "Building routing tables is a control plane task.", "Построение таблиц маршрутизации — задача control plane."],
          ["Setting packet handling policies", "Policies are set by the control plane.", "Политики задаёт control plane."],
          ["Running the SDN controller", "The controller is the control plane itself.", "Контроллер — это и есть control plane."],
        ], "The data plane forwards packets, segments and reassembles data and replicates packets for multicasting.", "Data plane пересылает пакеты, сегментирует и собирает данные и копирует пакеты для multicast."),
        qx("Which task belongs to the control plane?", "Building the routing tables", [
          ["Forwarding packets out of a port", "Forwarding is the data plane's job.", "Пересылка — задача data plane."],
          ["Reassembling segmented data", "Segmentation and reassembly are data plane tasks.", "Сегментация и сборка — задачи data plane."],
          ["Replicating packets for multicast", "Replicating packets is a data plane task.", "Копирование пакетов — задача data plane."],
        ], "The control plane makes routing tables and sets packet handling policies.", "Control plane строит таблицы маршрутизации и задаёт политики обработки пакетов."),
        qx("In a traditional network, where are the data and control planes?", "Together inside every switch", [
          ["Both in one central SDN controller", "A central controller is the SDN model, not the traditional one.", "Центральный контроллер — это модель SDN, а не традиционная."],
          ["Data in the controller, control in switches", "That reverses even the SDN model, where data stays in switches.", "Это переворачивает даже модель SDN, где data plane остаётся в коммутаторах."],
          ["Control in the cloud, data in the cables", "Cables carry signals; they do not hold a plane.", "Кабели передают сигналы и никакой плоскости не содержат."],
        ], "In a traditional network each switch has its own data plane as well as its own control plane.", "В традиционной сети у каждого коммутатора и свой data plane, и свой control plane."),
        qx("What does SDN move out of the switches into a central controller?", "The control plane", [
          ["The data plane", "The data plane stays in the switches and forwards packets.", "Data plane остаётся в коммутаторах и пересылает пакеты."],
          ["The physical ports", "Ports are hardware and remain on the switch.", "Порты — это железо, они остаются на коммутаторе."],
          ["The flow table hardware", "Flow tables stay in the switch; the controller only fills them.", "Flow tables остаются в коммутаторе; контроллер их только заполняет."],
        ], "SDN takes the control plane away from each switch and gives it to a centralized SDN controller.", "SDN забирает control plane у каждого коммутатора и передаёт его централизованному SDN controller."),
        qx("In SDN, how does a switch decide where to forward a packet?", "By flow table entries set by the controller", [
          ["By swapping topology data with neighbour switches", "Exchanging topology between switches is the traditional model.", "Обмен топологией между коммутаторами — традиционная модель."],
          ["By asking the user's application", "Applications talk to the controller, not directly to switches.", "Приложения общаются с контроллером, а не напрямую с коммутаторами."],
          ["By flooding it out of every port", "Flooding is not how SDN forwarding works; flow tables decide.", "SDN не рассылает пакеты во все порты; решают flow tables."],
        ], "The data plane in the switch forwards according to flow tables pre-assigned by the controller.", "Data plane в коммутаторе пересылает пакеты по flow tables, заранее заданным контроллером."),
        qx("Which SDN layer contains intrusion detection, firewall and load-balancing apps?", "Application layer", [
          ["Control layer", "The control layer holds the SDN controller.", "На control layer находится SDN controller."],
          ["Infrastructure layer", "The infrastructure layer holds the physical switches.", "На infrastructure layer находятся физические коммутаторы."],
          ["Physical layer", "The three SDN layers are application, control and infrastructure.", "Три уровня SDN — application, control и infrastructure."],
        ], "Network applications such as intrusion detection, firewall and load balancing sit in the application layer.", "Сетевые приложения — обнаружение вторжений, firewall, балансировка — находятся на application layer."),
        qx("Which SDN layer holds the physical switches that actually move packets?", "Infrastructure layer", [
          ["Application layer", "The application layer holds network apps.", "На application layer — сетевые приложения."],
          ["Control layer", "The control layer holds the controller, the brain.", "На control layer — контроллер, «мозг» сети."],
          ["Virtualization layer", "There is no such layer in the three-layer SDN architecture.", "Такого уровня в трёхуровневой архитектуре SDN нет."],
        ], "The infrastructure layer is the data plane: physical switches that carry the packets.", "Infrastructure layer — это data plane: физические коммутаторы, которые перемещают пакеты."),
        qx("Which interface connects the SDN control layer with the infrastructure layer?", "Southbound API", [
          ["Northbound API", "Northbound APIs connect the application and control layers.", "Northbound APIs соединяют уровни application и control."],
          ["Eastbound API", "The lecture names only northbound and southbound APIs.", "Лекция называет только northbound и southbound APIs."],
          ["Ethernet frame header", "A frame header is not an interface between SDN layers.", "Заголовок кадра — не интерфейс между уровнями SDN."],
        ], "Southbound APIs run between the controller and the switches; northbound APIs run up to the apps.", "Southbound APIs идут между контроллером и коммутаторами; northbound APIs — вверх к приложениям."),
        qx("In Open SDN, which protocol does the controller use to talk to the switches?", "OpenFlow", [
          ["SNMP", "SNMP is one of the methods in the 'SDN via APIs' model.", "SNMP — один из способов модели «SDN via APIs»."],
          ["REST over HTTP", "REST APIs are a newer method in the 'SDN via APIs' model.", "REST API — более новый способ в модели «SDN via APIs»."],
          ["DHCP", "DHCP hands out IP addresses; it does not control switches.", "DHCP раздаёт IP-адреса и коммутаторами не управляет."],
        ], "Open SDN uses OpenFlow switches, and the controller talks to them through the southbound API with OpenFlow.", "Open SDN использует OpenFlow switches, и контроллер общается с ними через southbound API по OpenFlow."),
        qx("Which SDN model leaves the physical network unchanged and builds virtual networks on top?", "Hypervisor-based overlay SDN", [
          ["Open SDN with OpenFlow switches", "Open SDN reprograms the switches themselves through OpenFlow.", "Open SDN перепрограммирует сами коммутаторы через OpenFlow."],
          ["SDN via APIs (SNMP, CLI, REST)", "This model calls functions on the remote devices themselves.", "Эта модель вызывает функции на самих удалённых устройствах."],
          ["Hybrid SDN with traditional parts", "Hybrid SDN mixes traditional networking and SDN in one network.", "Hybrid SDN смешивает традиционную сеть и SDN в одной сети."],
        ], "In SDN via hypervisor-based overlay, hypervisors build overlay networks and only edge devices join them.", "В SDN via hypervisor-based overlay hypervisors строят overlay-сети, и к ним подключены только edge-устройства."),
        qx("Which statement compares SDN with traditional networking correctly?", "SDN is programmable with centralized control", [
          ["SDN keeps distributed control inside each switch", "Distributed control is the traditional model.", "Распределённое управление — традиционная модель."],
          ["SDN uses closed, vendor-only interfaces", "SDN uses an open interface; traditional networks are closed.", "У SDN открытый интерфейс; закрытый — у традиционных сетей."],
          ["SDN mounts both planes on the same device", "In SDN the planes are decoupled by software.", "В SDN плоскости разделены программно."],
        ], "SDN: virtual, centralized, programmable, open, planes decoupled. Traditional: distributed, non-programmable, closed.", "SDN: виртуальная, централизованная, программируемая, открытая, плоскости разделены. Традиционная: распределённая, непрограммируемая, закрытая."),
        qx("What is the main disadvantage of SDN named in the lecture?", "The controller is a single point of failure", [
          ["Switch hardware becomes more expensive", "Switches get cheaper, since they only need a data plane.", "Коммутаторы дешевеют, ведь им нужен только data plane."],
          ["Applications become tied to one switch vendor's hardware", "Hardware is abstracted, so apps are vendor-independent.", "Оборудование абстрагировано, поэтому приложения не зависят от производителя."],
          ["The network can no longer be programmed", "Programmability is SDN's main advantage.", "Программируемость — главное преимущество SDN."],
        ], "If the central controller is corrupted, the entire network is affected.", "Если центральный контроллер повреждён, страдает вся сеть."),
      ],
    ),
  ],
};
