import { part, qx, tfx, type Lecture } from "../types";
import { deepL7P1 } from "./deep/l7p1";
import { deepL7P2 } from "./deep/l7p2";
import { deepL7P3 } from "./deep/l7p3";
import { deepL7P4 } from "./deep/l7p4";

/*
 * Лекция 7 курса Computer Networks — «IPv6 Addressing. ICMP» (Cisco NetAcad ITN, модули 12–13).
 * Источник: «Lecture 7 (1).pdf», 73 слайда; текст — /home/yeahayat/.cache/yg-events/cn7/txt/l7c.txt.
 * Только на картинках слайдов (перенесено в конспект): карта исчерпания IPv4 по регистраторам и
 * график поддержки IPv6 в Казахстане; рисунки dual stack / tunneling / NAT64; разметка 4 hex = 16 бит;
 * таблицы Preferred / No leading zeros / Compressed; дерево типов unicast-адресов (опечатка
 * «Unspecified ::1/128»); окно настроек IPv6 в Windows и топологии со статическими GUA и LLA;
 * шесть вопросов преподавателя (слайды 30–35); рисунки RS → RA → DHCPv6 Solicit (в методе 3 сервер
 * подписан «Stateless» — опечатка); разбиение /48 на подсети и распределение 5 × /64; вывод ping,
 * «TTL expired in transit» и traceroute.
 * Сверх слайдов (помечено в тексте): multicast ff00::/8, ff02::1, ff02::2, solicited-node, флаги RA A/O/M,
 * show ipv6 route.
 */

export const lecture7: Lecture = {
  id: "cn-l7",
  title: { en: "Lecture 7 — IPv6 Addressing. ICMP", ru: "Лекция 7 — Адресация IPv6. ICMP" },
  parts: [
    part(
      "cn-l7-p1",
      { en: "Why IPv6, and how to write an IPv6 address", ru: "Зачем нужен IPv6 и как записывать его адреса" },
      {
        en: `## Why the world needs IPv6
- **IPv4 is running out of addresses.** IPv6 is the **successor** to IPv4 and has a much larger **128-bit** address space (IPv4 has only 32 bits).
- The development of IPv6 also included **fixes for IPv4 limitations** and other enhancements.
- With an **increasing internet population**, a **limited IPv4 address space**, **issues with NAT** and the **IoT** (Internet of Things), the time has come to begin the transition to IPv6.
> Memory hook: four reasons — **more people, no space, NAT, IoT**. New users and billions of IoT devices each need an address, the free IPv4 space is gone, and NAT (lecture 5) breaks end-to-end connectivity.
The slide map shows when each regional internet registry (RIR) ran out of IPv4 addresses:
| RIR | Region | IPv4 exhaustion date on the slide |
|---|---|---|
| LACNIC | Latin America and the Caribbean | April 2011 |
| RIPE NCC | Europe, the Middle East, Central Asia | September 2012 |
| APNIC | Asia-Pacific | June 2014 |
| ARIN | North America | July 2015 |
| AfriNIC | Africa | projected 2020 |
> Exam trap: in reality APNIC ran out first (April 2011) and LACNIC in June 2014 — the slide map seems to swap these two labels. Remember the idea, not the dates: the registries ran out one after another between 2011 and 2015.
- A second slide shows **IPv6 and IPv4 protocol support in Kazakhstan**: almost **100%** of hosts support IPv4, while IPv6 grows **slowly** (it jumps between roughly 10% and 75%, usually 20–40%). That is why the two versions must work side by side for years.
## IPv4 and IPv6 coexistence
Both IPv4 and IPv6 will **coexist** in the near future, and the transition will take **several years**. The **IETF** has created various protocols and tools to help network administrators migrate their networks to IPv6. These migration techniques fall into **three categories**:
| Technique | How it works | Picture on the slide |
|---|---|---|
| **Dual stack** | devices run **both IPv4 and IPv6 protocol stacks simultaneously**; IPv4 and IPv6 coexist on the same network segment | every PC and the router are labelled "Dual Stack IPv4 and IPv6" |
| **Tunneling** | a method of transporting an **IPv6 packet over an IPv4 network**: the IPv6 packet is **encapsulated inside an IPv4 packet**, similar to other types of data | two IPv6-only networks joined by a tunnel through an IPv4-only network; the edge routers are dual stack |
| **Translation** | **NAT64** (Network Address Translation 64) lets IPv6-enabled devices communicate with IPv4-enabled devices with a technique similar to NAT for IPv4: an IPv6 packet is translated to an IPv4 packet and back | PC1 in an IPv6-only network talks to PC2 in an IPv4-only network through a NAT64 router |
- Dual stack is also called **native IPv6**: the customer network has an IPv6 connection to its ISP and can reach content on the internet over IPv6.
> Memory hook: **speak both, hide inside, translate** — dual stack speaks both languages, tunneling hides IPv6 inside IPv4, NAT64 translates one into the other.
> Exam trap: tunneling translates nothing — the IPv6 packet travels unchanged as the payload of an IPv4 packet. Only **translation (NAT64)** rewrites a packet from one IP version into the other.
The slides end this section with a question: "Which three approaches can be used while migrating from an IPv4 addressing scheme to an IPv6 scheme?" The answers are **configuring IPv4 tunnels between IPv6 islands**, **using proxying and translation (NAT-PT) to translate IPv6 packets into IPv4 packets** and **enabling dual-stack routing**. NAT-PT is the older name of the translation approach that NAT64 replaced. "Static mapping of IPv4 addresses to IPv6 addresses", "using DHCPv6 to map IPv4 addresses to IPv6 addresses" and "configuring IPv6 directly" are not migration techniques.
## The IPv6 address format
- IPv6 addresses are **128 bits** long and written in **hexadecimal**.
- They are **not case-sensitive**: lowercase and uppercase mean the same (2001:DB8::1 = 2001:db8::1).
- The **preferred format** is **x:x:x:x:x:x:x:x**, where each "x" consists of **four hexadecimal values**.
- A **hextet** is the unofficial term for a segment of **16 bits**, or four hexadecimal values.
= x:x:x:x:x:x:x:x       each x = 0000 to ffff
= 1 hex digit = 4 bits  ->  4 hex digits = 16 bits = 1 hextet
= 8 hextets x 16 bits = 128 bits
Examples of IPv6 addresses in the preferred format:
= 2001:0db8:0000:1111:0000:0000:0000:0200
= 2001:0db8:0000:00a3:abcd:0000:0000:1234
| | IPv4 | IPv6 |
|---|---|---|
| Length | 32 bits | 128 bits |
| Written in | dotted decimal | hexadecimal |
| Groups | 4 octets of 8 bits | 8 hextets of 16 bits |
| Separator | dot (.) | colon (:) |
| Number of addresses | 2^32 ≈ 4.3 billion | 2^128 ≈ 340 undecillion (3.4 × 10^38) |
> Exam trap: "preferred" means the **full** form — exactly 8 hextets of exactly 4 digits each, nothing omitted. The short forms below are compressed formats.
## Rule 1 — omit leading zeros
The first rule to reduce the notation of IPv6 addresses is to **omit any leading 0s** (zeros) in a hextet.
- 01ab can be represented as **1ab**
- 09f0 can be represented as **9f0**
- 0a00 can be represented as **a00**
- 00ab can be represented as **ab**
- 0000 becomes **0** — a hextet of all zeros keeps one zero.
This rule applies only to **leading** 0s, **NOT to trailing** 0s; otherwise the address would be ambiguous. If trailing zeros could also go, "abc" might mean 0abc or abc0, and nobody could tell which.
= Preferred         2001:0db8:0000:1111:0000:0000:0000:0200
= No leading zeros  2001:db8:0:1111:0:0:0:200
> Exam trap: 0200 becomes **200**, never 2; 0a00 becomes **a00**, never a. The zeros at the end of a hextet always stay.
## Rule 2 — double colon
A **double colon (::)** can replace any **single, contiguous string** of one or more 16-bit hextets consisting of **all zeros**.
- Example: 2001:db8:cafe:1:0:0:0:1 (leading 0s omitted) can be represented as **2001:db8:cafe:1::1**.
- The double colon can be used **only once** within an address; otherwise there would be more than one possible resulting address.
- If there are two strings of zeros, compress the **longest** one; if they are equal, the **first** one. Both choices give valid addresses; this is only the recommended style (RFC 5952).
= Preferred   2001:0db8:0000:1111:0000:0000:0000:0200
= Compressed  2001:db8:0:1111::200
Why only once: in 2001::abcd::1 six zero hextets have to be shared between two gaps — 1 + 5, 2 + 4, 3 + 3… Each split gives a different address, so the notation is invalid.
> Exam trap: 2001:db8::1111::200 is **not** a valid address — it has two double colons. A single zero hextet may be left as 0 or replaced by ::, but only if no other :: is used.
## Compress step by step
Always apply Rule 1 first, then Rule 2 to the longest run of zero hextets.
= 2001:0db8:0000:00a3:abcd:0000:0000:1234
= Rule 1:  2001:db8:0:a3:abcd:0:0:1234
= Rule 2:  2001:db8:0:a3:abcd::1234
= fe80:0000:0000:0000:0123:4567:89ab:cdef
= Rule 1:  fe80:0:0:0:123:4567:89ab:cdef
= Rule 2:  fe80::123:4567:89ab:cdef
= 2001:0db8:0a00:0000:0000:0000:0000:00f0
= Rule 1:  2001:db8:a00:0:0:0:0:f0
= Rule 2:  2001:db8:a00::f0
= 2001:0db8:0000:0000:abcd:0000:0000:0001
= Rule 1:  2001:db8:0:0:abcd:0:0:1
= Rule 2:  2001:db8::abcd:0:0:1
= ff02:0000:0000:0000:0000:0000:0000:0001  ->  ff02::1
= 0000:0000:0000:0000:0000:0000:0000:0001  ->  ::1
= 0000:0000:0000:0000:0000:0000:0000:0000  ->  ::
- In the fourth example both runs of zeros have the same length (two hextets each), so the first one is compressed; 2001:db8:0:0:abcd::1 would also be a valid address.
## Expand back to the preferred format
Expanding is the same work in reverse:
- Count the hextets that are written.
- The double colon stands for **8 minus that number** hextets of 0000.
- Pad every hextet with leading zeros to four digits.
= 2001:db8:acad:1::10   ->  5 hextets written, :: = 3 x 0000
= 2001:0db8:acad:0001:0000:0000:0000:0010
= fe80::1:1             ->  3 hextets written, :: = 5 x 0000
= fe80:0000:0000:0000:0000:0000:0001:0001
?? Compress 2001:0db8:0000:0000:0000:0a00:0000:0100 as far as possible.
?= 2001:db8::a00:0:100 — Rule 1 gives 2001:db8:0:0:0:a00:0:100; the longest run of zero hextets (the three after db8) becomes ::, and the single 0 before 100 stays.
?? How many zero hextets does :: replace in 2001:db8:cafe::1?
?= Four: four hextets are written (2001, db8, cafe, 1), and 8 − 4 = 4.
?? A provider network is IPv4-only, but two branch offices run IPv6 only. Which coexistence technique connects them?
?= Tunneling: the IPv6 packets are encapsulated inside IPv4 packets to cross the IPv4-only network.
## Exam focus
- IPv6: **128 bits**, **hexadecimal**, **8 hextets × 16 bits**, not case-sensitive, preferred format **x:x:x:x:x:x:x:x**.
- Reasons to move: address depletion, a growing internet population, NAT issues, IoT.
- Coexistence: **dual stack** (both stacks at once, native IPv6), **tunneling** (IPv6 inside IPv4), **translation** (NAT64, formerly NAT-PT).
- **Rule 1** — only **leading** zeros go. **Rule 2** — **::** replaces one contiguous run of all-zero hextets, **only once**.
- Typical traps: two :: in one address; 0200 shortened to 2; counting the hextets that :: replaces.`,
        ru: `## Зачем миру IPv6
- **Адреса IPv4 заканчиваются.** IPv6 — **преемник (successor)** IPv4, и адресное пространство у него намного больше — **128 бит** (у IPv4 всего 32 бита).
- При разработке IPv6 заодно **исправили ограничения IPv4 (IPv4 limitations)** и добавили другие улучшения.
- **Растущее число пользователей интернета (internet population)**, **ограниченное пространство IPv4**, **проблемы NAT** и **IoT** (интернет вещей) — пора начинать переход на IPv6.
> Запомни: четыре причины — **больше людей, нет места, NAT, IoT**. Новым пользователям и миллиардам IoT-устройств нужны адреса, свободного пространства IPv4 больше нет, а NAT (лекция 5) лишает сквозной связности.
Карта на слайде показывает, когда у каждого регионального интернет-регистратора (RIR) закончились адреса IPv4:
| RIR | Регион | Дата исчерпания IPv4 на слайде |
|---|---|---|
| LACNIC | Латинская Америка и Карибы | апрель 2011 |
| RIPE NCC | Европа, Ближний Восток, Центральная Азия | сентябрь 2012 |
| APNIC | Азиатско-Тихоокеанский регион | июнь 2014 |
| ARIN | Северная Америка | июль 2015 |
| AfriNIC | Африка | прогноз — 2020 |
> Ловушка экзамена: в реальности первым адреса исчерпал APNIC (апрель 2011), а LACNIC — в июне 2014; на карте слайда эти две подписи, похоже, перепутаны. Запоминай суть, а не даты: регистраторы исчерпали IPv4 один за другим в 2011–2015 годах.
- Второй слайд — **поддержка IPv6 и IPv4 в Казахстане**: почти **100%** хостов поддерживают IPv4, а доля IPv6 растёт **медленно** (скачет примерно от 10% до 75%, обычно 20–40%). Поэтому две версии ещё годы будут работать бок о бок.
## Сосуществование IPv4 и IPv6
IPv4 и IPv6 будут **сосуществовать (coexist)** в ближайшем будущем, а переход займёт **несколько лет**. **IETF** создала протоколы и инструменты, которые помогают администраторам перевести сети на IPv6. Эти способы миграции делятся на **три категории**:
| Способ | Как работает | Рисунок на слайде |
|---|---|---|
| **Двойной стек (dual stack)** | устройства запускают **стеки IPv4 и IPv6 одновременно**; IPv4 и IPv6 сосуществуют в одном сегменте сети | все ПК и маршрутизатор подписаны «Dual Stack IPv4 and IPv6» |
| **Туннелирование (tunneling)** | способ передать **пакет IPv6 через сеть IPv4**: пакет IPv6 **инкапсулируется внутрь пакета IPv4**, как любые другие данные | две сети только с IPv6 соединены туннелем через сеть только с IPv4; пограничные маршрутизаторы — dual stack |
| **Трансляция (translation)** | **NAT64** (Network Address Translation 64) позволяет устройствам с IPv6 общаться с устройствами с IPv4 приёмом, похожим на NAT для IPv4: пакет IPv6 переводится в пакет IPv4 и обратно | PC1 в сети только с IPv6 общается с PC2 в сети только с IPv4 через маршрутизатор NAT64 |
- Двойной стек ещё называют **native IPv6**: у сети клиента есть IPv6-подключение к провайдеру (ISP), и она получает содержимое интернета по IPv6.
> Запомни: **говорить на обоих, спрятать внутрь, перевести** — dual stack говорит на двух языках, туннель прячет IPv6 внутри IPv4, NAT64 переводит один в другой.
> Ловушка экзамена: туннель ничего не переводит — пакет IPv6 едет без изменений как нагрузка пакета IPv4. Переписывает пакет из одной версии IP в другую только **трансляция (NAT64)**.
Раздел на слайдах заканчивается вопросом: «Which three approaches can be used while migrating from an IPv4 addressing scheme to an IPv6 scheme?» Верные ответы — **туннели IPv4 между «островами» IPv6 (configuring IPv4 tunnels between IPv6 islands)**, **прокси и трансляция (NAT-PT) пакетов IPv6 в пакеты IPv4** и **маршрутизация с двойным стеком (dual-stack routing)**. NAT-PT — старое название трансляции, на смену ему пришёл NAT64. «Статическое сопоставление адресов IPv4 с IPv6», «DHCPv6 для сопоставления адресов IPv4 с IPv6» и «просто настроить IPv6» способами миграции не являются.
## Формат адреса IPv6
- Адрес IPv6 имеет длину **128 бит** и записывается в **шестнадцатеричной системе (hexadecimal)**.
- Он **не чувствителен к регистру (not case-sensitive)**: строчные и заглавные буквы равнозначны (2001:DB8::1 = 2001:db8::1).
- **Предпочтительный формат (preferred format)** — **x:x:x:x:x:x:x:x**, где каждый «x» — **четыре шестнадцатеричные цифры**.
- **Хекстет (hextet)** — неофициальное название сегмента из **16 бит**, то есть из четырёх шестнадцатеричных цифр.
= x:x:x:x:x:x:x:x       each x = 0000 to ffff
= 1 hex digit = 4 bits  ->  4 hex digits = 16 bits = 1 hextet
= 8 hextets x 16 bits = 128 bits
Примеры адресов IPv6 в предпочтительном формате:
= 2001:0db8:0000:1111:0000:0000:0000:0200
= 2001:0db8:0000:00a3:abcd:0000:0000:1234
| | IPv4 | IPv6 |
|---|---|---|
| Длина | 32 бита | 128 бит |
| Запись | десятичная с точками | шестнадцатеричная |
| Группы | 4 октета по 8 бит | 8 хекстетов по 16 бит |
| Разделитель | точка (.) | двоеточие (:) |
| Число адресов | 2^32 ≈ 4,3 млрд | 2^128 ≈ 340 ундециллионов (3,4 × 10^38) |
> Ловушка экзамена: «preferred» — это **полная** форма: ровно 8 хекстетов по ровно 4 цифры, ничего не пропущено. Короткие формы ниже — сжатые (compressed).
## Правило 1 — убрать ведущие нули
Первое правило сокращения записи IPv6 — **отбросить ведущие нули (leading 0s)** в хекстете.
- 01ab можно записать как **1ab**
- 09f0 можно записать как **9f0**
- 0a00 можно записать как **a00**
- 00ab можно записать как **ab**
- 0000 становится **0** — от хекстета из одних нулей остаётся один ноль.
Правило касается только **ведущих** нулей и **НЕ касается замыкающих (trailing)** — иначе адрес стал бы неоднозначным. Если бы можно было убирать и нули в конце, «abc» значило бы и 0abc, и abc0, и никто не понял бы, что именно.
= Preferred         2001:0db8:0000:1111:0000:0000:0000:0200
= No leading zeros  2001:db8:0:1111:0:0:0:200
> Ловушка экзамена: 0200 превращается в **200**, но никогда в 2; 0a00 — в **a00**, но не в a. Нули в конце хекстета всегда остаются.
## Правило 2 — двойное двоеточие
**Двойное двоеточие (::)** может заменить любую **одну непрерывную цепочку** из одного или нескольких 16-битных хекстетов, состоящих **только из нулей**.
- Пример: 2001:db8:cafe:1:0:0:0:1 (ведущие нули уже убраны) можно записать как **2001:db8:cafe:1::1**.
- Двойное двоеточие можно использовать **только один раз** в адресе — иначе адрес восстанавливался бы несколькими способами.
- Если цепочек нулей две, сжимают **самую длинную**; если они равны — **первую**. Оба варианта дают допустимый адрес, это лишь рекомендуемый стиль (RFC 5952).
= Preferred   2001:0db8:0000:1111:0000:0000:0000:0200
= Compressed  2001:db8:0:1111::200
Почему только один раз: в 2001::abcd::1 шесть нулевых хекстетов надо поделить между двумя пропусками — 1 + 5, 2 + 4, 3 + 3… Каждое деление даёт другой адрес, поэтому такая запись недопустима.
> Ловушка экзамена: 2001:db8::1111::200 — **недопустимый** адрес: в нём два двойных двоеточия. Одиночный нулевой хекстет можно оставить как 0 или заменить на ::, но только если другого :: в адресе нет.
## Сжатие по шагам
Сначала всегда применяй правило 1, затем правило 2 к самой длинной цепочке нулевых хекстетов.
= 2001:0db8:0000:00a3:abcd:0000:0000:1234
= Rule 1:  2001:db8:0:a3:abcd:0:0:1234
= Rule 2:  2001:db8:0:a3:abcd::1234
= fe80:0000:0000:0000:0123:4567:89ab:cdef
= Rule 1:  fe80:0:0:0:123:4567:89ab:cdef
= Rule 2:  fe80::123:4567:89ab:cdef
= 2001:0db8:0a00:0000:0000:0000:0000:00f0
= Rule 1:  2001:db8:a00:0:0:0:0:f0
= Rule 2:  2001:db8:a00::f0
= 2001:0db8:0000:0000:abcd:0000:0000:0001
= Rule 1:  2001:db8:0:0:abcd:0:0:1
= Rule 2:  2001:db8::abcd:0:0:1
= ff02:0000:0000:0000:0000:0000:0000:0001  ->  ff02::1
= 0000:0000:0000:0000:0000:0000:0000:0001  ->  ::1
= 0000:0000:0000:0000:0000:0000:0000:0000  ->  ::
- В четвёртом примере обе цепочки нулей одинаковой длины (по два хекстета), поэтому сжата первая; 2001:db8:0:0:abcd::1 тоже был бы допустимым адресом.
## Развернуть обратно в предпочтительный формат
Разворачивание — та же работа в обратную сторону:
- Посчитай, сколько хекстетов записано.
- Двойное двоеточие заменяет **8 минус это число** хекстетов 0000.
- Дополни каждый хекстет ведущими нулями до четырёх цифр.
= 2001:db8:acad:1::10   ->  5 hextets written, :: = 3 x 0000
= 2001:0db8:acad:0001:0000:0000:0000:0010
= fe80::1:1             ->  3 hextets written, :: = 5 x 0000
= fe80:0000:0000:0000:0000:0000:0001:0001
?? Сожми 2001:0db8:0000:0000:0000:0a00:0000:0100 до предела.
?= 2001:db8::a00:0:100 — правило 1 даёт 2001:db8:0:0:0:a00:0:100; самая длинная цепочка нулей (три хекстета после db8) превращается в ::, а одиночный 0 перед 100 остаётся.
?? Сколько нулевых хекстетов заменяет :: в адресе 2001:db8:cafe::1?
?= Четыре: записано четыре хекстета (2001, db8, cafe, 1), а 8 − 4 = 4.
?? Сеть провайдера работает только на IPv4, а два филиала — только на IPv6. Какой способ сосуществования их соединит?
?= Туннелирование: пакеты IPv6 инкапсулируются в пакеты IPv4 и так проходят через сеть только с IPv4.
## На экзамене
- IPv6: **128 бит**, **шестнадцатеричная запись**, **8 хекстетов × 16 бит**, регистр не важен, предпочтительный формат **x:x:x:x:x:x:x:x**.
- Причины перехода: исчерпание адресов, рост числа пользователей, проблемы NAT, IoT.
- Сосуществование: **dual stack** (оба стека сразу, native IPv6), **tunneling** (IPv6 внутри IPv4), **translation** (NAT64, раньше NAT-PT).
- **Правило 1** — убираются только **ведущие** нули. **Правило 2** — **::** заменяет одну непрерывную цепочку нулевых хекстетов, **только один раз**.
- Типичные ловушки: два :: в одном адресе; 0200, сокращённое до 2; подсчёт хекстетов, которые заменяет ::.`,
      },
      [
        qx("Which IPv4 and IPv6 coexistence technique runs both protocol stacks on a device at the same time?", "Dual stack", [
          ["Tunneling", "Tunneling carries IPv6 packets inside IPv4 packets across an IPv4 network; it does not run two stacks on every device.", "Туннелирование везёт пакеты IPv6 внутри пакетов IPv4 через сеть IPv4; два стека на каждом устройстве оно не запускает."],
          ["Translation (NAT64)", "NAT64 converts IPv6 packets into IPv4 packets and back, so that IPv6-only and IPv4-only devices can talk.", "NAT64 переводит пакеты IPv6 в IPv4 и обратно, чтобы общались устройства только с IPv6 и только с IPv4."],
          ["Stateful DHCPv6", "Stateful DHCPv6 hands out IPv6 addresses; it is not a coexistence technique.", "Stateful DHCPv6 раздаёт адреса IPv6; это не способ сосуществования версий."],
        ], "Dual stack devices run IPv4 and IPv6 protocol stacks simultaneously, so both versions coexist on the same network segment (native IPv6).", "Устройства с двойным стеком одновременно запускают стеки IPv4 и IPv6, и обе версии сосуществуют в одном сегменте сети (native IPv6)."),
        qx("Two IPv6-only networks must communicate across an IPv4-only network. Which technique encapsulates the IPv6 packets inside IPv4 packets?", "Tunneling", [
          ["Dual stack", "Dual stack needs IPv6 on every device along the path; here the network in the middle is IPv4-only.", "Двойному стеку нужен IPv6 на всех устройствах пути; а здесь сеть посередине работает только на IPv4."],
          ["NAT64", "NAT64 translates between IPv6 and IPv4 hosts; it does not wrap one packet inside another.", "NAT64 переводит между хостами IPv6 и IPv4, а не заворачивает один пакет в другой."],
          ["SLAAC", "SLAAC is how a host builds its own IPv6 address; it has nothing to do with crossing an IPv4 network.", "SLAAC — способ, которым хост сам строит себе адрес IPv6; к прохождению через сеть IPv4 он отношения не имеет."],
        ], "Tunneling transports an IPv6 packet over an IPv4 network by encapsulating it inside an IPv4 packet, like any other data; the routers at the tunnel ends are dual stack.", "Туннелирование передаёт пакет IPv6 через сеть IPv4, инкапсулируя его в пакет IPv4 как обычные данные; маршрутизаторы на концах туннеля работают с двойным стеком."),
        qx("Which technique lets an IPv6-only host communicate with an IPv4-only host by converting each packet into the other IP version?", "NAT64 translation", [
          ["Tunneling", "Tunneling never converts the packet: the IPv6 packet stays intact inside an IPv4 packet.", "Туннель никогда не преобразует пакет: пакет IPv6 остаётся нетронутым внутри пакета IPv4."],
          ["Dual stack", "Dual stack gives one device both stacks; it does not help a host that has only one of them.", "Двойной стек даёт одному устройству оба стека; хосту, у которого есть только один, он не поможет."],
          ["Anycast addressing", "Anycast delivers a packet to the nearest of several devices with the same address; it is not a transition technique.", "Anycast доставляет пакет ближайшему из нескольких устройств с одним адресом; это не способ перехода."],
        ], "Translation — NAT64 — translates an IPv6 packet into an IPv4 packet and an IPv4 packet into an IPv6 packet, similar to NAT for IPv4.", "Трансляция — NAT64 — переводит пакет IPv6 в пакет IPv4 и пакет IPv4 в пакет IPv6, похоже на NAT для IPv4."),
        qx("Which approach can be used while migrating from an IPv4 addressing scheme to an IPv6 scheme?", "Configuring IPv4 tunnels between IPv6 islands", [
          ["Using DHCPv6 to map IPv4 addresses to IPv6 addresses", "DHCPv6 assigns IPv6 settings; it neither maps IPv4 addresses to IPv6 nor carries traffic between the versions.", "DHCPv6 выдаёт настройки IPv6; он не сопоставляет адреса IPv4 с IPv6 и не передаёт трафик между версиями."],
          ["Statically mapping each IPv4 address to an IPv6 address", "A static mapping table is not one of the three migration categories (dual stack, tunneling, translation).", "Статическая таблица соответствия адресов не входит в три категории миграции (dual stack, tunneling, translation)."],
          ["Configuring IPv6 directly, with no transition mechanism", "Switching to IPv6 alone would cut off every IPv4-only device; migration needs a way for both versions to coexist.", "Просто включить IPv6 — значит отрезать все устройства только с IPv4; миграции нужен способ, при котором версии сосуществуют."],
        ], "The slide answers are IPv4 tunnels between IPv6 islands, translation (NAT-PT, today NAT64) and dual-stack routing — the three coexistence categories.", "Ответы со слайда — туннели IPv4 между «островами» IPv6, трансляция (NAT-PT, сегодня NAT64) и маршрутизация с двойным стеком — три категории сосуществования."),
        qx("How long is an IPv6 address, and how is it written?", "128 bits, in hexadecimal", [
          ["64 bits, in hexadecimal", "64 bits is only the interface ID of a /64 address — half of the whole address.", "64 бита — это лишь идентификатор интерфейса в адресе /64, половина адреса."],
          ["128 bits, in dotted decimal", "Dotted decimal is the IPv4 notation; IPv6 uses hexadecimal hextets separated by colons.", "Десятичная запись с точками — это IPv4; IPv6 записывают шестнадцатеричными хекстетами через двоеточие."],
          ["32 bits, in hexadecimal", "32 bits is the length of an IPv4 address.", "32 бита — длина адреса IPv4."],
        ], "IPv6 addresses are 128 bits long and written in hexadecimal: 8 hextets of 16 bits.", "Адрес IPv6 имеет длину 128 бит и записывается в шестнадцатеричной системе: 8 хекстетов по 16 бит."),
        qx("In IPv6, what is a hextet?", "A 16-bit segment of four hexadecimal digits", [
          ["An 8-bit segment written as two hexadecimal digits", "Eight bits make an octet — the unit of IPv4 addresses and MAC bytes, not a hextet.", "Восемь бит — это октет, единица адресов IPv4 и байтов MAC, а не хекстет."],
          ["A 4-bit value written as one hexadecimal digit", "One hex digit is 4 bits; a hextet holds four of them.", "Одна шестнадцатеричная цифра — это 4 бита; в хекстете их четыре."],
          ["The 64-bit interface ID at the end of the address", "The interface ID is four hextets long; a hextet is one 16-bit group.", "Идентификатор интерфейса занимает четыре хекстета; хекстет — одна 16-битная группа."],
        ], "A hextet is the unofficial term for a segment of 16 bits, or four hexadecimal values; an IPv6 address has eight of them.", "Хекстет — неофициальное название 16-битного сегмента, то есть четырёх шестнадцатеричных цифр; в адресе IPv6 их восемь."),
        qx("What is the preferred format of the address 2001:db8:0:1111::200?", "2001:0db8:0000:1111:0000:0000:0000:0200", [
          ["2001:db8:0:1111:0:0:0:200", "This only restores the zero hextets; the preferred format also needs four digits in every hextet.", "Здесь только восстановлены нулевые хекстеты; в предпочтительном формате ещё нужны четыре цифры в каждом хекстете."],
          ["2001:0db8:0000:1111:0000:0000:0000:2000", "The last hextet 200 must be padded on the left (0200); zeros are never added at the end.", "Последний хекстет 200 дополняется нулём слева (0200); нули в конец никогда не добавляются."],
          ["2001:0db8:0000:1111:0000:0000:0200", "Only seven hextets: here :: stands for three zero hextets, not two.", "Всего семь хекстетов: здесь :: заменяет три нулевых хекстета, а не два."],
        ], "Five hextets are written, so :: stands for three 0000 hextets; padding each hextet to four digits gives 2001:0db8:0000:1111:0000:0000:0000:0200.", "Записано пять хекстетов, значит, :: — это три хекстета 0000; дополнив каждый хекстет до четырёх цифр, получаем 2001:0db8:0000:1111:0000:0000:0000:0200."),
        qx("Applying only Rule 1 (omit leading zeros), how can the hextet 0a00 be written?", "a00", [
          ["a", "Removing trailing zeros is not allowed: a would expand back to 000a.", "Убирать замыкающие нули нельзя: a развернётся обратно в 000a."],
          ["a0", "Only leading zeros may go; without one trailing zero the value changes to 00a0.", "Убирать можно только ведущие нули; без одного замыкающего нуля значение превратится в 00a0."],
          ["0a0", "This removes a trailing zero instead of the leading one; 0a0 expands to 00a0.", "Здесь убран замыкающий ноль вместо ведущего; 0a0 развернётся в 00a0."],
        ], "Rule 1 omits only leading 0s: 0a00 becomes a00. Trailing zeros stay, otherwise the address would be ambiguous.", "Правило 1 убирает только ведущие нули: 0a00 превращается в a00. Замыкающие нули остаются, иначе адрес был бы неоднозначным."),
        qx("Which is a valid compressed form of 2001:0db8:0000:0000:abcd:0000:0000:0001?", "2001:db8::abcd:0:0:1", [
          ["2001:db8::abcd::1", "Two double colons make the address ambiguous: :: may be used only once.", "Два двойных двоеточия делают адрес неоднозначным: :: можно использовать только один раз."],
          ["2001:db8:abcd::1", "This loses the two zero hextets after db8: it expands to 2001:0db8:abcd:0000:0000:0000:0000:0001.", "Здесь потеряны два нулевых хекстета после db8: адрес развернётся в 2001:0db8:abcd:0000:0000:0000:0000:0001."],
          ["2001:db8::abcd:1", "Four hextets are written, so :: would stand for four zero hextets and abcd would move: 2001:db8:0:0:0:0:abcd:1.", "Записано четыре хекстета, значит, :: заменит четыре нулевых, и abcd сдвинется: 2001:db8:0:0:0:0:abcd:1."],
        ], "Rule 1 gives 2001:db8:0:0:abcd:0:0:1; the two runs of zeros are equal, so :: replaces one of them (by convention the first), and the other stays as 0:0.", "Правило 1 даёт 2001:db8:0:0:abcd:0:0:1; две цепочки нулей равны, поэтому :: заменяет одну из них (по соглашению первую), а вторая остаётся как 0:0."),
        tfx("The double colon (::) may be used twice in one IPv6 address when both strings of zeros have the same length.", false,
          "False. The double colon can be used only once within an address; with two of them there would be more than one possible resulting address.",
          "Неверно. Двойное двоеточие можно использовать в адресе только один раз; с двумя адрес можно было бы восстановить несколькими способами.",
          "Answering True ignores Rule 2: equal runs do not allow two ::, you simply compress one of them (the first) and write the other as 0:0.",
          "Ответ «верно» нарушает правило 2: равные цепочки не разрешают два ::, просто сжимают одну (первую), а другую пишут как 0:0."),
        qx("How many all-zero hextets does the double colon replace in 2001:db8:cafe::1?", "Four", [
          ["Three", "Three would be right with five written hextets, as in 2001:db8:acad:1::10; here only four are written.", "Три было бы при пяти записанных хекстетах, как в 2001:db8:acad:1::10; здесь записано только четыре."],
          ["Five", "Five would leave only three written hextets; this address has four (2001, db8, cafe, 1).", "Пять оставило бы три записанных хекстета; а в этом адресе их четыре (2001, db8, cafe, 1)."],
          ["One", "A single zero hextet would complete the address only if seven hextets were written.", "Один нулевой хекстет дополнил бы адрес, только если бы записано было семь хекстетов."],
        ], "An IPv6 address always has 8 hextets. Four are written (2001, db8, cafe, 1), so :: stands for 8 − 4 = 4 hextets of 0000.", "В адресе IPv6 всегда 8 хекстетов. Записано четыре (2001, db8, cafe, 1), значит, :: заменяет 8 − 4 = 4 хекстета 0000."),
        qx("Which of the following is NOT given in the lecture as a reason to begin the transition to IPv6?", "Too little Ethernet bandwidth", [
          ["The growth of the Internet of Things", "IoT is on the slide: billions of IoT devices each need an IP address.", "IoT есть на слайде: миллиардам IoT-устройств нужен IP-адрес."],
          ["Issues with NAT and end-to-end connectivity", "NAT issues are listed: NAT hides hosts and breaks end-to-end connectivity.", "Проблемы NAT названы: NAT прячет хосты и лишает сквозной связности."],
          ["An increasing internet population", "A growing number of internet users is listed as one of the reasons.", "Рост числа пользователей интернета назван среди причин."],
        ], "The slide lists an increasing internet population, a limited IPv4 address space, issues with NAT and the IoT. Ethernet bandwidth has nothing to do with the IP version.", "На слайде названы рост числа пользователей, ограниченное пространство IPv4, проблемы NAT и IoT. Пропускная способность Ethernet от версии IP не зависит."),
      ],
      deepL7P1,
    ),
    part(
      "cn-l7-p2",
      { en: "IPv6 address types: unicast, multicast, anycast", ru: "Типы адресов IPv6: unicast, multicast, anycast" },
      {
        en: `## Three kinds of IPv6 addresses
There are three broad categories of IPv6 addresses:
- **Unicast** — uniquely identifies an **interface** on an IPv6-enabled device.
- **Multicast** — used to send a **single IPv6 packet to multiple destinations**.
- **Anycast** — **any IPv6 unicast address that can be assigned to multiple devices**. A packet sent to an anycast address is routed to the **nearest** device having that address.
- **Note:** unlike IPv4, **IPv6 does not have a broadcast address**. However, there is an IPv6 **all-nodes multicast** address that essentially gives the same result.
| Type | Communication model | Who receives the packet |
|---|---|---|
| Unicast | one-to-one | the one interface with that address |
| Multicast | one-to-many | every device that has joined the group |
| Anycast | one-to-nearest | the nearest of the devices that share the address |
| Broadcast | — | does not exist in IPv6 |
> Exam trap: an anycast address has no special range — it looks exactly like a unicast address. It becomes anycast when the same address is configured on several devices; routing then delivers each packet to the closest one.
The slides ask three questions about this list:
- "Which three are characteristics of an IPv6 anycast address?" — **one-to-nearest communication model**, **the same address for multiple devices in the group**, **delivery of packets to the group interface that is closest to the sending device**. Not: one-to-many (that is multicast), any-to-many, a unique address for each device.
- "Which two are features of IPv6?" — **multicast** and **anycast**. Broadcast does not exist in IPv6; "allcast" and "podcast" are invented words.
- "What is known as one-to-nearest addressing in IPv6?" — **anycast**.
## Prefix length
- The **prefix length** is written in **slash notation** and indicates the **network portion** of an IPv6 address.
- It can range from **0 to 128**. The recommended prefix length for **LANs and most other types of networks is /64**.
- A /64 splits the address in half: a **64-bit prefix** and a **64-bit interface ID**.
= Example 2001:db8:a::/64
= Prefix (64 bits)        2001:0db8:000a:0000
= Interface ID (64 bits)  0000:0000:0000:0000
- IPv6 has **no dotted-decimal subnet mask**: the prefix length alone tells where the network part ends.
## Types of IPv6 unicast addresses
Unlike IPv4 devices, which have only a single address, IPv6 devices typically have **two unicast addresses**: a **GUA** and an **LLA**. The slide tree lists six types of unicast addresses:
| Unicast type | Prefix or range | Key facts |
|---|---|---|
| **Global unicast (GUA)** | 2000::/3 (first hextet 2000 – 3fff) | similar to a **public IPv4** address; globally unique, internet-routable |
| **Link-local (LLA)** | fe80::/10 | required on **every** IPv6-enabled interface; works on the local link only; **not routable** |
| **Loopback** | ::1/128 | the host sends packets to itself; like 127.0.0.1 in IPv4 |
| **Unspecified** | ::/128 | all 128 bits are zero; used as a source address before a device has an address of its own |
| **Unique local** | fc00::/7 (fc00 – fdff) | similar to **RFC 1918 private** addresses; not globally routed |
| **Embedded IPv4** | for example ::ffff:192.168.10.1 | an IPv4 address carried inside an IPv6 address; used during the transition |
> Exam trap: the slide figure labels the unspecified address "::1/128" — a misprint. ::1/128 is the **loopback** address; the **unspecified** address is **::/128** (all zeros).
The slide question "Which two statements describe characteristics of IPv6 unicast addressing?" has the answers **"Global addresses start with 2000::/3"** and **"There is only one loopback address and it is ::1"**. The traps: link-local addresses do not start with FE00::/12 or FF00::/10 (FF00::/8 is multicast), and a global address is **not** the only address of an interface — every IPv6 interface also has an LLA.
## Unique local addresses
The IPv6 **unique local addresses** (on the slide the range **fc00::/7 to fdff::/7**; the block itself is fc00::/7) have some similarity to RFC 1918 private addresses for IPv4, but there are significant differences:
- They are used for **local addressing within a site** or between a **limited number of sites**.
- They can be used for devices that will **never need to access another network**.
- They are **not globally routed or translated** to a global IPv6 address.
> Exam trap: private IPv4 addresses are normally translated by NAT to reach the internet; unique local addresses are not meant to be translated at all.
## Global unicast address (GUA)
IPv6 **global unicast addresses** are **globally unique** and **routable on the IPv6 internet**.
- Currently only GUAs with the **first three bits 001**, that is **2000::/3**, are being assigned.
- So the currently available GUAs begin with a **2 or a 3** — only **1/8th** of the total IPv6 address space (three fixed bits: 1/2 × 1/2 × 1/2 = 1/8).
= first hextet 2000 = 0010 0000 0000 0000
= first hextet 3fff = 0011 1111 1111 1111
= 001 fixed  ->  2000::/3 = 2000 ... 3fff
## Structure of a GUA
@diagram cn7-gua
| Part | What it is | Typical size |
|---|---|---|
| **Global routing prefix** | the prefix, or network, portion of the address that the **provider (ISP)** assigns to a customer or site; it varies with ISP policies | 48 bits |
| **Subnet ID** | the area between the global routing prefix and the interface ID; the **organization** uses it to identify **subnets within its site** | 16 bits |
| **Interface ID** | equivalent to the **host portion** of an IPv4 address; /64 subnets are strongly recommended, which creates a **64-bit** interface ID | 64 bits |
= 48 bits + 16 bits + 64 bits = 128 bits
= /48 routing prefix + 16-bit subnet ID = /64 prefix
Reading a real address — 2001:db8:acad:1::1/64 on R1's G0/0/0, from a /48 site:
= 2001:0db8:acad : 0001 : 0000:0000:0000:0001
= routing prefix   subnet   interface ID
- Global routing prefix **2001:db8:acad::/48** (from the ISP), subnet ID **0001** (chosen by the company), interface ID **::1** (the router's own number in the subnet).
## Link-local address (LLA)
An IPv6 **link-local address (LLA)** lets a device communicate with other IPv6-enabled devices **on the same link and only on that link (subnet)**.
- Packets with a **source or destination LLA cannot be routed**.
- **Every** IPv6-enabled network interface **must have an LLA**.
- If an LLA is not configured manually, the device **creates one automatically**.
- IPv6 LLAs are in the **fe80::/10** range.
= fe80::/10 = 1111 1110 10 + 118 bits
= first hextet fe80 ... febf, in practice always fe80
What LLAs are used for (the slide figure):
- **Routers use the LLA of neighbor routers to send routing updates.**
- **Hosts use the LLA of a local router as the default gateway.**
> Exam trap: "not routable" does not mean "useless" — the LLA is the address a router gives hosts as their default gateway, and the address routing protocols talk from.
## Multicast addresses
The slides only say that IPv6 has no broadcast; the rest of this section is standard CCNA material that questions often use.
- All IPv6 multicast addresses start with **ff** — the block **ff00::/8**.
- **Assigned multicast** addresses are reserved for predefined groups:
| Address | Group | Who listens |
|---|---|---|
| **ff02::1** | all-nodes multicast | every IPv6 device on the link; the IPv6 replacement for broadcast; RAs are sent here |
| **ff02::2** | all-routers multicast | every IPv6 router on the link (a Cisco router joins after ipv6 unicast-routing); RSs are sent here |
- **Solicited-node multicast**: **ff02::1:ff** plus the **last 24 bits** of a unicast address. A Neighbor Solicitation is sent there (lecture 5 and part 4), so only the device with matching last bits processes it.
= unicast        2001:db8:acad:1::10  ->  last 24 bits 00:0010
= solicited-node ff02::1:ff00:10
= unicast        fe80::7279:b3ff:fe92:3640  ->  last 24 bits 92:3640
= solicited-node ff02::1:ff92:3640
> Exam trap: ff02::1 is a **multicast** address, not a broadcast one — IPv6 has no broadcast at all.
?? Is 3ffe:1900:4545:3::5 a global unicast address (GUA)? Why?
?= Yes: its first hextet 3ffe starts with the bits 0011, so the address is inside 2000::/3 (2000 – 3fff).
?? A packet arrives with the source address fe80::1. Can a router forward it to another network?
?= No. fe80::/10 is link-local; packets with a link-local source or destination address are never routed.
?? In 2001:db8:acad:5::10/64 with a /48 site prefix, which part is the subnet ID?
?= 0005 (written as 5): the fourth hextet, between the /48 routing prefix 2001:db8:acad and the 64-bit interface ID ::10.
## Exam focus
- Three types: **unicast**, **multicast**, **anycast** (one-to-nearest); **no broadcast** — the all-nodes address **ff02::1** gives the same result.
- Prefixes: **GUA 2000::/3**, **LLA fe80::/10**, **unique local fc00::/7**, **multicast ff00::/8**, **loopback ::1/128**, **unspecified ::/128**.
- GUA structure: **global routing prefix (ISP)** + **subnet ID (organization)** + **interface ID (host)**; /48 + 16 = /64.
- LLA: on every interface, created automatically, never routed; used as the default gateway and by routing protocols.
- Recommended prefix length: **/64**.`,
        ru: `## Три вида адресов IPv6
Адреса IPv6 делятся на три большие категории:
- **Unicast (одноадресный)** — однозначно обозначает **интерфейс** устройства с IPv6.
- **Multicast (групповой)** — нужен, чтобы отправить **один пакет IPv6 нескольким получателям**.
- **Anycast** — **любой unicast-адрес IPv6, который назначен нескольким устройствам**. Пакет на anycast-адрес маршрутизируется к **ближайшему** устройству с этим адресом.
- **Обрати внимание:** в отличие от IPv4, **в IPv6 нет broadcast-адреса**. Но есть **multicast-адрес всех узлов (all-nodes multicast)**, который по сути даёт тот же результат.
| Тип | Модель связи | Кто получает пакет |
|---|---|---|
| Unicast | один к одному | единственный интерфейс с этим адресом |
| Multicast | один ко многим | каждое устройство, вступившее в группу |
| Anycast | один к ближайшему | ближайшее из устройств с общим адресом |
| Broadcast | — | в IPv6 не существует |
> Ловушка экзамена: у anycast нет особого диапазона — он выглядит в точности как unicast-адрес. Адрес становится anycast, когда его настраивают сразу на нескольких устройствах; маршрутизация доставляет каждый пакет ближайшему из них.
На слайдах к этому списку три вопроса:
- «Which three are characteristics of an IPv6 anycast address?» — **модель «один к ближайшему» (one-to-nearest)**, **один и тот же адрес у нескольких устройств группы**, **доставка пакетов тому интерфейсу группы, который ближе всего к отправителю**. Неверно: «один ко многим» (это multicast), «any-to-many», уникальный адрес у каждого устройства.
- «Which two are features of IPv6?» — **multicast** и **anycast**. Broadcast в IPv6 нет; «allcast» и «podcast» — выдуманные слова.
- «What is known as one-to-nearest addressing in IPv6?» — **anycast**.
## Длина префикса
- **Длина префикса (prefix length)** записывается **через косую черту (slash notation)** и показывает **сетевую часть** адреса IPv6.
- Она может быть **от 0 до 128**. Рекомендуемая длина для **LAN и большинства других сетей — /64**.
- /64 делит адрес пополам: **64 бита префикса** и **64 бита идентификатора интерфейса (interface ID)**.
= Example 2001:db8:a::/64
= Prefix (64 bits)        2001:0db8:000a:0000
= Interface ID (64 bits)  0000:0000:0000:0000
- В IPv6 **нет маски подсети в десятичной записи с точками**: где кончается сеть, говорит одна длина префикса.
## Виды unicast-адресов IPv6
В отличие от устройств IPv4, у которых один адрес, у устройств IPv6 обычно **два unicast-адреса**: **GUA** и **LLA**. Дерево на слайде перечисляет шесть видов unicast-адресов:
| Вид unicast | Префикс или диапазон | Главное |
|---|---|---|
| **Глобальный (global unicast, GUA)** | 2000::/3 (первый хекстет 2000 – 3fff) | похож на **публичный адрес IPv4**; глобально уникален, маршрутизируется в интернете |
| **Локальный для канала (link-local, LLA)** | fe80::/10 | обязателен на **каждом** интерфейсе с IPv6; работает только в своём канале; **не маршрутизируется** |
| **Loopback (петля)** | ::1/128 | хост отправляет пакеты сам себе; как 127.0.0.1 в IPv4 |
| **Неопределённый (unspecified)** | ::/128 | все 128 бит — нули; используется как адрес источника, пока у устройства ещё нет своего адреса |
| **Уникальный локальный (unique local)** | fc00::/7 (fc00 – fdff) | похож на **частные адреса RFC 1918**; глобально не маршрутизируется |
| **Встроенный IPv4 (embedded IPv4)** | например, ::ffff:192.168.10.1 | адрес IPv4, перенесённый внутрь адреса IPv6; нужен в переходный период |
> Ловушка экзамена: на рисунке слайда неопределённый адрес подписан «::1/128» — это опечатка. ::1/128 — это **loopback**, а **unspecified** — **::/128** (одни нули).
У вопроса со слайда «Which two statements describe characteristics of IPv6 unicast addressing?» ответы — **«Global addresses start with 2000::/3»** и **«There is only one loopback address and it is ::1»**. Ловушки: link-local адреса не начинаются с FE00::/12 или FF00::/10 (FF00::/8 — это multicast), а глобальный адрес — **не** единственный адрес интерфейса: у каждого интерфейса IPv6 есть ещё и LLA.
## Уникальные локальные адреса
**Уникальные локальные адреса (unique local)** IPv6 (на слайде диапазон **fc00::/7 to fdff::/7**; сам блок — fc00::/7) отчасти похожи на частные адреса IPv4 из RFC 1918, но есть важные отличия:
- Они нужны для **локальной адресации внутри площадки (site)** или между **ограниченным числом площадок**.
- Их можно давать устройствам, которым **никогда не понадобится доступ в другую сеть**.
- Они **глобально не маршрутизируются и не транслируются** в глобальный адрес IPv6.
> Ловушка экзамена: частные адреса IPv4 обычно транслируют через NAT, чтобы выйти в интернет; уникальные локальные адреса вообще не предназначены для трансляции.
## Глобальный unicast-адрес (GUA)
**Глобальные unicast-адреса (global unicast addresses)** IPv6 **глобально уникальны** и **маршрутизируются в IPv6-интернете**.
- Сейчас выдаются только GUA с **первыми тремя битами 001**, то есть **2000::/3**.
- Поэтому доступные сейчас GUA начинаются с **2 или 3** — это всего **1/8** пространства IPv6 (три фиксированных бита: 1/2 × 1/2 × 1/2 = 1/8).
= first hextet 2000 = 0010 0000 0000 0000
= first hextet 3fff = 0011 1111 1111 1111
= 001 fixed  ->  2000::/3 = 2000 ... 3fff
## Структура GUA
@diagram cn7-gua
| Часть | Что это | Обычный размер |
|---|---|---|
| **Глобальный префикс маршрутизации (global routing prefix)** | префиксная, то есть сетевая, часть адреса, которую **провайдер (ISP)** выдаёт клиенту или площадке; зависит от политики провайдера | 48 бит |
| **Идентификатор подсети (subnet ID)** | область между глобальным префиксом и идентификатором интерфейса; ею **организация** нумерует **подсети внутри своей площадки** | 16 бит |
| **Идентификатор интерфейса (interface ID)** | аналог **хостовой части** адреса IPv4; настоятельно рекомендуются подсети /64, то есть **64-битный** interface ID | 64 бита |
= 48 bits + 16 bits + 64 bits = 128 bits
= /48 routing prefix + 16-bit subnet ID = /64 prefix
Разберём настоящий адрес — 2001:db8:acad:1::1/64 на интерфейсе G0/0/0 маршрутизатора R1, площадка /48:
= 2001:0db8:acad : 0001 : 0000:0000:0000:0001
= routing prefix   subnet   interface ID
- Глобальный префикс **2001:db8:acad::/48** (от провайдера), subnet ID **0001** (выбрала компания), interface ID **::1** (собственный номер маршрутизатора в подсети).
## Локальный адрес канала (LLA)
**Link-local адрес (LLA)** IPv6 позволяет устройству общаться с другими устройствами IPv6 **в том же канале и только в нём (в своей подсети)**.
- Пакеты с **LLA источника или назначения не маршрутизируются**.
- У **каждого** сетевого интерфейса с IPv6 **обязан быть LLA**.
- Если LLA не настроен вручную, устройство **создаёт его автоматически**.
- LLA IPv6 лежат в диапазоне **fe80::/10**.
= fe80::/10 = 1111 1110 10 + 118 bits
= first hextet fe80 ... febf, in practice always fe80
Для чего нужны LLA (рисунок на слайде):
- **Маршрутизаторы шлют обновления маршрутизации на LLA соседних маршрутизаторов.**
- **Хосты используют LLA локального маршрутизатора как шлюз по умолчанию (default gateway).**
> Ловушка экзамена: «не маршрутизируется» не значит «бесполезен» — именно LLA маршрутизатор сообщает хостам как шлюз, и с LLA общаются протоколы маршрутизации.
## Групповые адреса (multicast)
Слайды говорят лишь, что в IPv6 нет broadcast; остальное в этом разделе — стандартный материал CCNA, который часто встречается в вопросах.
- Все multicast-адреса IPv6 начинаются с **ff** — блок **ff00::/8**.
- **Назначенные групповые адреса (assigned multicast)** закреплены за заранее определёнными группами:
| Адрес | Группа | Кто слушает |
|---|---|---|
| **ff02::1** | все узлы (all-nodes multicast) | каждое устройство IPv6 в канале; замена broadcast в IPv6; сюда шлют RA |
| **ff02::2** | все маршрутизаторы (all-routers multicast) | каждый маршрутизатор IPv6 в канале (маршрутизатор Cisco вступает после ipv6 unicast-routing); сюда шлют RS |
- **Solicited-node multicast**: **ff02::1:ff** плюс **последние 24 бита** unicast-адреса. Туда отправляют Neighbor Solicitation (лекция 5 и часть 4), и обрабатывает его только устройство с совпадающими последними битами.
= unicast        2001:db8:acad:1::10  ->  last 24 bits 00:0010
= solicited-node ff02::1:ff00:10
= unicast        fe80::7279:b3ff:fe92:3640  ->  last 24 bits 92:3640
= solicited-node ff02::1:ff92:3640
> Ловушка экзамена: ff02::1 — **multicast**-адрес, а не broadcast: broadcast в IPv6 нет вовсе.
?? Является ли 3ffe:1900:4545:3::5 глобальным адресом (GUA)? Почему?
?= Да: первый хекстет 3ffe начинается с битов 0011, значит, адрес входит в 2000::/3 (2000 – 3fff).
?? Пакет пришёл с адресом источника fe80::1. Может ли маршрутизатор переслать его в другую сеть?
?= Нет. fe80::/10 — link-local; пакеты с link-local адресом источника или назначения никогда не маршрутизируются.
?? В адресе 2001:db8:acad:5::10/64 при префиксе площадки /48 какая часть — subnet ID?
?= 0005 (записано как 5): четвёртый хекстет, между префиксом /48 2001:db8:acad и 64-битным interface ID ::10.
## На экзамене
- Три вида: **unicast**, **multicast**, **anycast** («один к ближайшему»); **broadcast нет** — тот же результат даёт адрес всех узлов **ff02::1**.
- Префиксы: **GUA 2000::/3**, **LLA fe80::/10**, **unique local fc00::/7**, **multicast ff00::/8**, **loopback ::1/128**, **unspecified ::/128**.
- Структура GUA: **глобальный префикс (ISP)** + **subnet ID (организация)** + **interface ID (хост)**; /48 + 16 = /64.
- LLA: есть на каждом интерфейсе, создаётся автоматически, никогда не маршрутизируется; служит шлюзом по умолчанию и адресом для протоколов маршрутизации.
- Рекомендуемая длина префикса: **/64**.`,
      },
      [
        qx("Which type of address exists in IPv4 but not in IPv6?", "Broadcast", [
          ["Multicast", "IPv6 uses multicast heavily — for example ff02::1 and ff02::2.", "IPv6 активно использует multicast — например, ff02::1 и ff02::2."],
          ["Anycast", "Anycast is one of the three IPv6 address categories.", "Anycast — одна из трёх категорий адресов IPv6."],
          ["Unicast", "Unicast addresses (GUA, LLA and others) are the main IPv6 addresses.", "Unicast-адреса (GUA, LLA и другие) — основные адреса IPv6."],
        ], "Unlike IPv4, IPv6 does not have a broadcast address; the all-nodes multicast address ff02::1 gives essentially the same result.", "В отличие от IPv4, в IPv6 нет broadcast-адреса; почти тот же результат даёт multicast-адрес всех узлов ff02::1."),
        qx("What is known as “one-to-nearest” addressing in IPv6?", "Anycast", [
          ["Multicast", "Multicast is one-to-many: every member of the group gets the packet.", "Multicast — «один ко многим»: пакет получает каждый участник группы."],
          ["Global unicast", "A global unicast address identifies one interface: one-to-one.", "Глобальный unicast-адрес обозначает один интерфейс: «один к одному»."],
          ["Unspecified address", "The unspecified address :: means no address at all; it is never a destination.", "Неопределённый адрес :: означает «адреса нет»; адресом назначения он не бывает."],
        ], "Anycast: one unicast address is assigned to several devices, and a packet is routed to the nearest of them — one-to-nearest.", "Anycast: один unicast-адрес назначен нескольким устройствам, и пакет маршрутизируется к ближайшему из них — «один к ближайшему»."),
        qx("Which statement describes an IPv6 anycast address?", "One address on several devices; the nearest one gets the packet", [
          ["One packet is delivered to every member of the group","Delivery to every group member is multicast, the one-to-many model.", "Доставка всем участникам группы — это multicast, модель «один ко многим»."],
          ["Each device in the group keeps its own unique address", "A unique address per device is plain unicast; anycast shares one address.", "Свой уникальный адрес у каждого устройства — это обычный unicast; в anycast адрес общий."],
          ["Packets travel from any source to many receivers at once", "“Any-to-many” is not an IPv6 communication model; anycast delivers to exactly one device.", "«Любой ко многим» — не модель связи IPv6; anycast доставляет пакет ровно одному устройству."],
        ], "An anycast address is any unicast address assigned to multiple devices; a packet sent to it is routed to the nearest device having that address.", "Anycast-адрес — это любой unicast-адрес, назначенный нескольким устройствам; пакет на него маршрутизируется к ближайшему устройству с этим адресом."),
        qx("Which prefix identifies IPv6 link-local addresses?", "fe80::/10", [
          ["fc00::/7", "fc00::/7 is the unique local range, the IPv6 cousin of RFC 1918 private addresses.", "fc00::/7 — диапазон unique local, аналог частных адресов RFC 1918."],
          ["ff00::/10", "Addresses that start with ff are multicast (ff00::/8); the slide distractor “FF00::/10” mixes multicast up with link-local.", "Адреса, начинающиеся с ff, — это multicast (ff00::/8); ловушка со слайда «FF00::/10» путает multicast с link-local."],
          ["fe00::/12", "This is the slide distractor “FE00:/12”: both the hextet and the length are wrong — link-local is fe80::/10.", "Это ловушка со слайда «FE00:/12»: неверны и хекстет, и длина — link-local это fe80::/10."],
        ], "IPv6 link-local addresses are in the fe80::/10 range; in practice they start with fe80.", "Link-local адреса IPv6 лежат в диапазоне fe80::/10; на практике они начинаются с fe80."),
        qx("A host has the address 3ffe:1900:4545:3::5. What type of address is it?", "Global unicast", [
          ["Link-local", "Link-local addresses start with fe80; 3ffe is a different range.", "Link-local адреса начинаются с fe80; 3ffe — другой диапазон."],
          ["Unique local unicast", "Unique local addresses start with fc or fd (fc00::/7).", "Unique local адреса начинаются с fc или fd (fc00::/7)."],
          ["Multicast", "Multicast addresses always start with ff.", "Multicast-адреса всегда начинаются с ff."],
        ], "The first hextet 3ffe begins with the bits 0011, so the address is in 2000::/3 (2000 – 3fff) — a global unicast address.", "Первый хекстет 3ffe начинается с битов 0011, значит, адрес входит в 2000::/3 (2000 – 3fff) — это глобальный unicast-адрес."),
        qx("Which statement describes a characteristic of IPv6 unicast addressing?", "There is only one loopback address, ::1", [
          ["Link-local addresses start with FE00::/12", "Link-local addresses are fe80::/10; FE00::/12 is a distractor from the slide question.", "Link-local адреса — fe80::/10; FE00::/12 — ловушка из вопроса на слайде."],
          ["Link-local addresses start with FF00::/10", "Addresses that start with FF are multicast, not link-local.", "Адреса, начинающиеся с FF, — multicast, а не link-local."],
          ["An interface with a GUA cannot have any other address", "Every IPv6 interface also has an LLA, so a GUA is never its only address.", "У каждого интерфейса IPv6 есть ещё и LLA, так что GUA никогда не бывает его единственным адресом."],
        ], "The slide answers: global addresses start with 2000::/3, and there is only one loopback address — ::1 (::1/128).", "Ответы со слайда: глобальные адреса начинаются с 2000::/3, и loopback-адрес всего один — ::1 (::1/128)."),
        qx("What is the purpose of the subnet ID in an IPv6 global unicast address?", "It identifies subnets inside the site", [
          ["It identifies the interface, like the IPv4 host part", "That is the interface ID, the last 64 bits of a /64 address.", "Это идентификатор интерфейса — последние 64 бита адреса /64."],
          ["It is the network part assigned to the site by the ISP", "That is the global routing prefix, typically a /48 from the provider.", "Это глобальный префикс маршрутизации, обычно /48 от провайдера."],
          ["It marks the address as global with the first bits 001", "The bits 001 belong to the global routing prefix and mark the 2000::/3 block.", "Биты 001 относятся к глобальному префиксу маршрутизации и обозначают блок 2000::/3."],
        ], "The subnet ID is the area between the global routing prefix and the interface ID; the organization uses it to identify subnets within its site.", "Subnet ID — область между глобальным префиксом маршрутизации и идентификатором интерфейса; ею организация нумерует подсети внутри своей площадки."),
        qx("R1 has the address 2001:db8:acad:1::1/64 from the site prefix 2001:db8:acad::/48. Which part of the address is the subnet ID?", "0001", [
          ["acad", "acad is the third hextet and still part of the /48 global routing prefix.", "acad — третий хекстет, он ещё входит в глобальный префикс маршрутизации /48."],
          ["2001:db8:acad", "2001:db8:acad is the /48 global routing prefix assigned by the provider.", "2001:db8:acad — глобальный префикс маршрутизации /48 от провайдера."],
          ["::1", "::1 is the interface ID — the router's own number inside the subnet.", "::1 — идентификатор интерфейса, собственный номер маршрутизатора в подсети."],
        ], "Bits 1–48 are the routing prefix 2001:db8:acad, bits 49–64 — the fourth hextet, 0001 — are the subnet ID, and the last 64 bits are the interface ID.", "Биты 1–48 — префикс 2001:db8:acad, биты 49–64 (четвёртый хекстет, 0001) — subnet ID, последние 64 бита — идентификатор интерфейса."),
        qx("Which statement about IPv6 link-local addresses is true?", "Packets with an LLA source or destination are not routed", [
          ["They must be configured manually on every router interface", "If no LLA is configured, the device creates one automatically.", "Если LLA не настроен вручную, устройство создаёт его само."],
          ["They are assigned by the ISP together with the global prefix", "The ISP assigns the global routing prefix; LLAs never leave the link and need no provider.", "Провайдер выдаёт глобальный префикс; LLA не выходят за пределы канала, провайдер им не нужен."],
          ["They are needed only when the interface has no GUA", "Every IPv6-enabled interface must have an LLA, with or without a GUA.", "У каждого интерфейса с IPv6 обязан быть LLA — с GUA или без."],
        ], "An LLA works only on its own link (subnet): packets with a link-local source or destination address cannot be routed.", "LLA работает только в своём канале (подсети): пакеты с link-local адресом источника или назначения не маршрутизируются."),
        tfx("Unique local addresses (fc00::/7) are routed on the internet after being translated to global IPv6 addresses, just like RFC 1918 addresses with NAT.", false,
          "False. Unique local addresses are used within a site or between a limited number of sites; they are not globally routed or translated to a global IPv6 address.",
          "Неверно. Unique local адреса используют внутри площадки или между ограниченным числом площадок; глобально они не маршрутизируются и в глобальные адреса IPv6 не транслируются.",
          "Answering True carries the IPv4 NAT habit over to IPv6: the slide stresses that ULAs resemble RFC 1918 only in part, and the missing translation is one of the differences.",
          "Ответ «верно» переносит привычку NAT из IPv4: слайд подчёркивает, что ULA похожи на RFC 1918 лишь отчасти, и отсутствие трансляции — одно из отличий."),
        tfx("The IPv6 unspecified address is ::1/128.", false,
          "False. ::1/128 is the loopback address; the unspecified address is ::/128, with all 128 bits set to zero.",
          "Неверно. ::1/128 — это loopback; неопределённый адрес (unspecified) — ::/128, все 128 бит равны нулю.",
          "Answering True repeats a misprint in the slide figure, where the unspecified address is also labelled ::1/128.",
          "Ответ «верно» повторяет опечатку на рисунке слайда, где неопределённый адрес тоже подписан ::1/128."),
        qx("Which IPv6 address reaches all IPv6 devices on the local link and replaces the IPv4 broadcast?", "ff02::1", [
          ["ff02::2", "ff02::2 is the all-routers group; hosts do not listen to it.", "ff02::2 — группа всех маршрутизаторов; хосты её не слушают."],
          ["::1", "::1 is the loopback address of the device itself.", "::1 — loopback-адрес самого устройства."],
          ["fe80::1", "fe80::1 is a link-local unicast address of one interface, often a router's.", "fe80::1 — link-local unicast-адрес одного интерфейса, часто маршрутизатора."],
        ], "ff02::1 is the all-nodes multicast address: every IPv6 device on the link receives it, which gives essentially the same result as an IPv4 broadcast.", "ff02::1 — multicast-адрес всех узлов: его получает каждое устройство IPv6 в канале, что по сути даёт тот же результат, что broadcast в IPv4."),
      ],
      deepL7P2,
    ),
    part(
      "cn-l7-p3",
      { en: "Static and dynamic IPv6 addressing: SLAAC, DHCPv6, EUI-64", ru: "Статическая и динамическая адресация IPv6: SLAAC, DHCPv6, EUI-64" },
      {
        en: `## Static GUA on a router
Most IPv6 configuration and verification commands in Cisco IOS are similar to their IPv4 counterparts; in many cases the only difference is **ipv6** in place of **ip**.
- The command to configure an IPv6 GUA on an interface: **ipv6 address** *ipv6-address/prefix-length* (interface configuration mode).
= R1(config)# interface gigabitethernet 0/0/0
= R1(config-if)# ipv6 address 2001:db8:acad:1::1/64
= R1(config-if)# no shutdown
= R1(config-if)# exit
- IPv4 needs an address **and a subnet mask**; IPv6 needs only the address with **/prefix-length** after it.
- Router interfaces are shut down by default, so **no shutdown** is part of every example.
The slide topology: R1 connects two LANs and a serial WAN link, each link in its own /64:
| Interface | GUA | Static LLA | Connected to |
|---|---|---|---|
| G0/0/0 | 2001:db8:acad:1::1/64 | fe80::1:1 | LAN with PC1 (::10) |
| G0/0/1 | 2001:db8:acad:2::1/64 | fe80::2:1 | LAN with PC2 (::10) |
| S0/1/0 | 2001:db8:acad:3::1/64 | fe80::3:1 | the WAN cloud |
- To **forward** IPv6 packets between its interfaces, a Cisco router also needs **ipv6 unicast-routing** in global configuration mode. The same command makes the router send Router Advertisements and join the all-routers group ff02::2.
= R1(config)# ipv6 unicast-routing
> Exam trap: the slide question "Which command enables IPv6 forwarding on a Cisco router?" offers ipv6 host, ipv6 unicast-routing, ipv6 local and ipv6 neighbor. Only **ipv6 unicast-routing** turns on forwarding; ipv6 host maps a name to an address, ipv6 neighbor adds a static neighbor entry.
## Static GUA on a Windows host
- Manually configuring an IPv6 address on a host is **similar to configuring an IPv4 address**: Internet Protocol Version 6 (TCP/IPv6) Properties, "Use the following IPv6 address".
| Field | Value on the slide |
|---|---|
| IPv6 address | 2001:db8:acad:1::10 |
| Subnet prefix length | 64 |
| Default gateway | 2001:db8:acad:1::1 |
- The **GUA or the LLA** of the router interface can be used as the default gateway. **Best practice is to use the LLA.**
- Why the LLA: it is the address the router itself announces in its RAs, and it does not change if the global prefix is renumbered.
## Static link-local address
Configuring the LLA manually lets you create an address that is **recognizable and easier to remember** than a long automatic one.
- Command: **ipv6 address** *ipv6-link-local-address* **link-local** (no prefix length).
= R1(config)# interface gigabitethernet 0/0/0
= R1(config-if)# ipv6 address fe80::1:1 link-local
= R1(config-if)# no shutdown
= R1(config-if)# exit
- The **same LLA can be configured on each link** as long as it is **unique on that link** — LLAs never leave their link.
- Common practice is a **different LLA on each interface** of the router (fe80::1:1, fe80::2:1, fe80::3:1), so that it is easy to identify the router and the specific interface.
> Exam trap: the keyword **link-local** replaces the prefix length — "ipv6 address fe80::1:1/64" would be an ordinary address, not the interface's LLA.
## Dynamic GUAs: RS and RA messages
A host learns from the router how to get an address, with two ICMPv6 messages:
- **Router Solicitation (RS)** — the host asks: is there an IPv6 router on this link? It is sent to the all-routers group ff02::2.
- **Router Advertisement (RA)** — the router answers an RS, and it also sends RAs periodically to the all-nodes group ff02::1.
The ICMPv6 RA message is a **suggestion** to a device on how to obtain an IPv6 GUA; the **ultimate decision is up to the device operating system**. The RA includes:
| RA content | What it tells the device |
|---|---|
| Network prefix and prefix length | which network the device belongs to |
| Default gateway address | an IPv6 **LLA** — the **source IPv6 address of the RA message** |
| DNS addresses and domain name | the addresses of DNS servers and a domain name |
> Exam trap: the default gateway is not written inside the RA as a separate field — the host simply takes the **source address of the RA**, which is the router's link-local address.
## The three RA methods
@diagram cn7-ra-methods
| Method | What the RA says | GUA comes from | DNS and domain come from |
|---|---|---|---|
| **1. SLAAC** | "I have everything you need including the prefix, prefix length, and default gateway address." | the host creates it with **SLAAC** | the RA |
| **2. SLAAC with a stateless DHCPv6 server** | "Here is my information but you need to get other information such as DNS addresses from a stateless DHCPv6 server." | the host creates it with **SLAAC** | a **stateless DHCPv6** server |
| **3. Stateful DHCPv6 (no SLAAC)** | "I can give you your default gateway address. You need to ask a stateful DHCPv6 server for all your other information." | a **stateful DHCPv6** server | the same **stateful DHCPv6** server |
- In **all three** methods the **default gateway** is the **router's LLA, the source of the RA**. DHCPv6 never supplies the default gateway.
- **SLAAC** (Stateless Address Autoconfiguration) lets a device configure a GUA **without the services of DHCPv6**: the **prefix comes from the RA**, and the device creates the **interface ID** itself with **EUI-64** or **random generation**.
- **Stateless** DHCPv6 gives only other information (DNS, domain name) and keeps no record of addresses. **Stateful** DHCPv6 is **similar to DHCP for IPv4**: it assigns the GUA, prefix length and DNS addresses and keeps track of who has which address.
- The order in the figures: **1** the host sends an **RS**, **2** the router replies with an **RA**, **3** (methods 2 and 3 only) the host sends a **DHCPv6 SOLICIT** to find the DHCPv6 server.
The RA selects the method with flags (CCNA material, not on these slides):
= Method 1  SLAAC                      A=1  O=0  M=0
= Method 2  SLAAC + stateless DHCPv6   A=1  O=1  M=0
= Method 3  stateful DHCPv6            A=0       M=1
- **A** (Autonomous) — build a GUA with SLAAC; **O** (Other configuration) — get other information from a stateless DHCPv6 server; **M** (Managed address configuration) — get the address from a stateful DHCPv6 server.
> Exam trap: the Method 3 figure on the slide labels the server "Stateless DHCPv6 Server" — a copy-paste slip from Method 2. In Method 3 the server is **stateful**.
## The interface ID: EUI-64 or random
When the RA says **SLAAC** or **SLAAC with stateless DHCPv6**, the client must **generate its own interface ID** — the last 64 bits. There are two ways: the **EUI-64 process** or a **randomly generated 64-bit number**.
The IEEE defined the **Extended Unique Identifier (EUI)**, or **modified EUI-64**, process, which does two things:
- A **16-bit value of fffe** (hexadecimal) is **inserted into the middle** of the 48-bit Ethernet MAC address of the client.
- The **7th bit** of the client MAC address is **reversed** — on the slide, from binary 0 to 1.
@diagram cn7-eui64
The slide example step by step:
= 1. MAC address (48 bits)      fc:99:47:75:ce:e0
= 2. split into two halves      fc:99:47 | 75:ce:e0
= 3. insert ff:fe in between    fc:99:47:ff:fe:75:ce:e0
= 4. first byte in binary       fc = 1111 1100
= 5. reverse the 7th bit        1111 1110 = fe
= 6. EUI-64 interface ID        fe99:47ff:fe75:cee0
The same steps for R1's MAC address 7079.b392.3640:
= 70:79:b3 | 92:36:40  ->  70:79:b3:ff:fe:92:36:40
= 70 = 0111 0000  ->  0111 0010 = 72
= interface ID 7279:b3ff:fe92:3640  ->  LLA fe80::7279:b3ff:fe92:3640
- Shortcut: reversing the 7th bit changes the **second hex digit** of the first byte by 2: 0↔2, 1↔3, 4↔6, 5↔7, 8↔a, 9↔b, c↔e, d↔f.
- An EUI-64 interface ID is easy to recognise: **ff:fe in the middle** (xxxx:xxff:fexx:xxxx).
- A **random** 64-bit interface ID (for example 50a5:8a35:a5bb:66e1) hides the MAC address, so the device cannot be tracked by it; Windows uses random IDs by default.
> Exam trap: the slide's ipconfig and SLAAC figures show the interface ID fc99:47ff:fe75:cee0 for the MAC fc:99:47:75:ce:e0 — there the 7th bit was not reversed. The rule, as the EUI-64 slide itself shows, gives **fe99:47ff:fe75:cee0**; on a test, apply the rule.
## Dynamic link-local addresses
- **All IPv6 interfaces must have an IPv6 LLA.** Like GUAs, LLAs can be configured **dynamically**: the **fe80::/10 prefix** plus an interface ID from the **EUI-64 process** or a **random 64-bit number**.
- Operating systems such as **Windows** typically use the **same method** for both the SLAAC-created GUA and the dynamic LLA, so the two addresses end with the same 64 bits:
= C:\\> ipconfig
= IPv6 Address. . . . . . . . . . . : 2001:db8:acad:1:fc99:47ff:fe75:cee0
= Link-local IPv6 Address . . . . . : fe80::fc99:47ff:fe75:cee0
= Default Gateway . . . . . . . . . : fe80::1
With a random interface ID:
= IPv6 Address. . . . . . . . . . . : 2001:db8:acad:1:50a5:8a35:a5bb:66e1
= Link-local IPv6 Address . . . . . : fe80::50a5:8a35:a5bb:66e1
= Default Gateway . . . . . . . . . : fe80::1
- **Cisco routers** automatically create an LLA **whenever a GUA is assigned** to the interface, and by default they use **EUI-64** to generate the interface ID of all LLAs:
= R1# show interface gigabitEthernet 0/0/0
= Hardware is ISR4221-2x1GE, address is 7079.b392.3640 (bia 7079.b392.3640)
= R1# show ipv6 interface brief
= GigabitEthernet0/0/0 [up/up]
=     FE80::7279:B3FF:FE92:3640
=     2001:DB8:ACAD:1::1
## Duplicate address detection
- After a device gets a GUA or an LLA — static, SLAAC or DHCPv6 — it **may** check that nobody else uses it: **duplicate address detection (DAD)**.
- It sends a **Neighbor Solicitation** with its **own address as the target**. If another device has the address, that device answers with a **Neighbor Advertisement**; **no answer** means the address is **unique**. The details are in part 4.
## Verifying the addressing
| Command | Where | What it shows |
|---|---|---|
| show ipv6 interface brief | router | every interface with [status/protocol], its LLA (FE80::…) and its GUAs |
| show ipv6 route | router | the IPv6 routing table: **C** — the connected /64, **L** — the router's own address as /128 |
| show interface | router | the MAC address (address is … bia …) — the input for EUI-64 |
| ipconfig | Windows host | the GUA (IPv6 Address), the Link-local IPv6 Address and the Default Gateway |
| ping | both | reachability with ICMPv6 Echo Request and Echo Reply |
= R1# show ipv6 route
= C   2001:DB8:ACAD:1::/64 [0/0]
=      via GigabitEthernet0/0/0, directly connected
= L   2001:DB8:ACAD:1::1/128 [0/0]
=      via GigabitEthernet0/0/0, receive
?? A host receives an RA that says: build your own GUA, and ask a DHCPv6 server for the DNS address. Which method is it, and what is the default gateway?
?= Method 2, SLAAC with a stateless DHCPv6 server; the default gateway is the router's LLA — the source address of the RA.
?? Which EUI-64 interface ID comes from the MAC address 00:1a:2b:3c:4d:5e?
?= 021a:2bff:fe3c:4d5e — insert ff:fe after 00:1a:2b and reverse the 7th bit: 00 becomes 02.
?? Why do the GUA and the LLA in the Windows ipconfig output end with the same 64 bits?
?= Windows uses the same method (EUI-64 or random) for both the SLAAC-created GUA and the dynamic LLA, so both get the same interface ID.
## Exam focus
- **ipv6 address 2001:db8:acad:1::1/64** — static GUA; **ipv6 address fe80::1:1 link-local** — static LLA; **ipv6 unicast-routing** — IPv6 forwarding.
- The RA contains the **prefix and prefix length**, the **default gateway = the RA source LLA**, the **DNS addresses and domain name**; the final decision belongs to the host OS.
- Three methods: **SLAAC**; **SLAAC + stateless DHCPv6** (DNS from the server); **stateful DHCPv6** (GUA from the server). The gateway always comes from the RA.
- **EUI-64**: insert **fffe** in the middle of the MAC, reverse the **7th bit**; random IDs hide the MAC.
- A Cisco router creates an LLA with EUI-64 by itself as soon as a GUA is configured on the interface.`,
        ru: `## Статический GUA на маршрутизаторе
Большинство команд настройки и проверки IPv6 в Cisco IOS похожи на свои аналоги для IPv4; часто вся разница в том, что вместо **ip** пишут **ipv6**.
- Команда настройки GUA на интерфейсе: **ipv6 address** *ipv6-address/prefix-length* (режим настройки интерфейса).
= R1(config)# interface gigabitethernet 0/0/0
= R1(config-if)# ipv6 address 2001:db8:acad:1::1/64
= R1(config-if)# no shutdown
= R1(config-if)# exit
- Для IPv4 нужны адрес **и маска подсети**; для IPv6 — только адрес с **/длиной префикса** после него.
- Интерфейсы маршрутизатора по умолчанию выключены, поэтому **no shutdown** есть в каждом примере.
Топология на слайде: R1 соединяет две LAN и последовательный WAN-канал, у каждого канала своя /64:
| Интерфейс | GUA | Статический LLA | Куда подключён |
|---|---|---|---|
| G0/0/0 | 2001:db8:acad:1::1/64 | fe80::1:1 | LAN с PC1 (::10) |
| G0/0/1 | 2001:db8:acad:2::1/64 | fe80::2:1 | LAN с PC2 (::10) |
| S0/1/0 | 2001:db8:acad:3::1/64 | fe80::3:1 | облако WAN |
- Чтобы **пересылать** пакеты IPv6 между интерфейсами, маршрутизатору Cisco нужна ещё команда **ipv6 unicast-routing** в режиме глобальной конфигурации. Та же команда заставляет маршрутизатор рассылать Router Advertisement и вступить в группу всех маршрутизаторов ff02::2.
= R1(config)# ipv6 unicast-routing
> Ловушка экзамена: в вопросе со слайда «Which command enables IPv6 forwarding on a Cisco router?» варианты — ipv6 host, ipv6 unicast-routing, ipv6 local и ipv6 neighbor. Пересылку включает только **ipv6 unicast-routing**; ipv6 host сопоставляет имя с адресом, ipv6 neighbor добавляет статическую запись о соседе.
## Статический GUA на хосте Windows
- Ручная настройка адреса IPv6 на хосте **похожа на настройку адреса IPv4**: свойства Internet Protocol Version 6 (TCP/IPv6), пункт «Use the following IPv6 address».
| Поле | Значение на слайде |
|---|---|
| IPv6 address | 2001:db8:acad:1::10 |
| Subnet prefix length | 64 |
| Default gateway | 2001:db8:acad:1::1 |
- Шлюзом по умолчанию может быть **GUA или LLA** интерфейса маршрутизатора. **Лучшая практика — указывать LLA.**
- Почему LLA: именно его маршрутизатор сам объявляет в RA, и он не меняется, если глобальный префикс перенумеруют.
## Статический link-local адрес
Ручная настройка LLA позволяет сделать адрес **узнаваемым и легко запоминаемым** вместо длинного автоматического.
- Команда: **ipv6 address** *ipv6-link-local-address* **link-local** (без длины префикса).
= R1(config)# interface gigabitethernet 0/0/0
= R1(config-if)# ipv6 address fe80::1:1 link-local
= R1(config-if)# no shutdown
= R1(config-if)# exit
- **Один и тот же LLA можно настроить в каждом канале**, если он **уникален в этом канале**: LLA никогда не выходят за пределы своего канала.
- Обычно на каждом интерфейсе маршрутизатора делают **свой LLA** (fe80::1:1, fe80::2:1, fe80::3:1), чтобы легко узнавать и маршрутизатор, и конкретный интерфейс.
> Ловушка экзамена: ключевое слово **link-local** заменяет длину префикса — «ipv6 address fe80::1:1/64» будет обычным адресом, а не LLA интерфейса.
## Динамические GUA: сообщения RS и RA
Как получить адрес, хост узнаёт от маршрутизатора с помощью двух сообщений ICMPv6:
- **Router Solicitation (RS, запрос маршрутизатора)** — хост спрашивает: есть ли в канале маршрутизатор IPv6? Сообщение идёт на группу всех маршрутизаторов ff02::2.
- **Router Advertisement (RA, объявление маршрутизатора)** — маршрутизатор отвечает на RS, а ещё периодически рассылает RA на группу всех узлов ff02::1.
Сообщение ICMPv6 RA — это **рекомендация (suggestion)** устройству, как получить GUA; **окончательное решение принимает операционная система устройства**. В RA входят:
| Что в RA | Что это сообщает устройству |
|---|---|
| Сетевой префикс и длина префикса | к какой сети принадлежит устройство |
| Адрес шлюза по умолчанию | IPv6 **LLA** — **адрес источника самого сообщения RA** |
| Адреса DNS и доменное имя | адреса DNS-серверов и доменное имя |
> Ловушка экзамена: шлюз не записан в RA отдельным полем — хост просто берёт **адрес источника RA**, а это link-local адрес маршрутизатора.
## Три метода RA
@diagram cn7-ra-methods
| Метод | Что говорит RA | Откуда GUA | Откуда DNS и домен |
|---|---|---|---|
| **1. SLAAC** | «I have everything you need including the prefix, prefix length, and default gateway address» — у меня есть всё, что нужно | хост создаёт его сам через **SLAAC** | из RA |
| **2. SLAAC со stateless DHCPv6-сервером** | «Here is my information but you need to get other information such as DNS addresses from a stateless DHCPv6 server» — остальное, например DNS, возьми у stateless DHCPv6 | хост создаёт его сам через **SLAAC** | от **stateless DHCPv6**-сервера |
| **3. Stateful DHCPv6 (без SLAAC)** | «I can give you your default gateway address. You need to ask a stateful DHCPv6 server for all your other information» — дам только шлюз | от **stateful DHCPv6**-сервера | от того же **stateful DHCPv6**-сервера |
- Во **всех трёх** методах **шлюз по умолчанию** — **LLA маршрутизатора, источник RA**. DHCPv6 шлюз по умолчанию никогда не выдаёт.
- **SLAAC** (Stateless Address Autoconfiguration, автонастройка адреса без сохранения состояния) позволяет устройству настроить GUA **без DHCPv6**: **префикс приходит в RA**, а **идентификатор интерфейса** устройство создаёт само — через **EUI-64** или **случайно**.
- **Stateless** DHCPv6 выдаёт только прочие сведения (DNS, доменное имя) и не ведёт учёт адресов. **Stateful** DHCPv6 **похож на DHCP для IPv4**: выдаёт GUA, длину префикса и адреса DNS и помнит, кому какой адрес выдан.
- Порядок на рисунках: **1** хост шлёт **RS**, **2** маршрутизатор отвечает **RA**, **3** (только в методах 2 и 3) хост шлёт **DHCPv6 SOLICIT**, чтобы найти DHCPv6-сервер.
Метод RA выбирает флагами (материал CCNA, на этих слайдах его нет):
= Method 1  SLAAC                      A=1  O=0  M=0
= Method 2  SLAAC + stateless DHCPv6   A=1  O=1  M=0
= Method 3  stateful DHCPv6            A=0       M=1
- **A** (Autonomous) — строить GUA через SLAAC; **O** (Other configuration) — прочие сведения брать у stateless DHCPv6; **M** (Managed address configuration) — адрес брать у stateful DHCPv6.
> Ловушка экзамена: на рисунке к методу 3 сервер подписан «Stateless DHCPv6 Server» — ошибка копирования из метода 2. В методе 3 сервер **stateful**.
## Идентификатор интерфейса: EUI-64 или случайный
Когда RA говорит **SLAAC** или **SLAAC со stateless DHCPv6**, клиент должен **сам создать идентификатор интерфейса** — последние 64 бита. Способов два: **процесс EUI-64** или **случайное 64-битное число**.
IEEE определила процесс **Extended Unique Identifier (EUI)**, или **modified EUI-64**, который делает две вещи:
- **16-битное значение fffe** (в шестнадцатеричной записи) **вставляется в середину** 48-битного MAC-адреса Ethernet клиента.
- **Седьмой бит** MAC-адреса клиента **инвертируется** — на слайде из 0 в 1.
@diagram cn7-eui64
Пример со слайда по шагам:
= 1. MAC address (48 bits)      fc:99:47:75:ce:e0
= 2. split into two halves      fc:99:47 | 75:ce:e0
= 3. insert ff:fe in between    fc:99:47:ff:fe:75:ce:e0
= 4. first byte in binary       fc = 1111 1100
= 5. reverse the 7th bit        1111 1110 = fe
= 6. EUI-64 interface ID        fe99:47ff:fe75:cee0
Те же шаги для MAC-адреса маршрутизатора R1 7079.b392.3640:
= 70:79:b3 | 92:36:40  ->  70:79:b3:ff:fe:92:36:40
= 70 = 0111 0000  ->  0111 0010 = 72
= interface ID 7279:b3ff:fe92:3640  ->  LLA fe80::7279:b3ff:fe92:3640
- Короткий путь: инверсия 7-го бита меняет **вторую hex-цифру** первого байта на 2: 0↔2, 1↔3, 4↔6, 5↔7, 8↔a, 9↔b, c↔e, d↔f.
- Идентификатор EUI-64 легко узнать: **ff:fe в середине** (xxxx:xxff:fexx:xxxx).
- **Случайный** 64-битный идентификатор (например, 50a5:8a35:a5bb:66e1) скрывает MAC-адрес, и по нему устройство не отследить; Windows по умолчанию использует случайные идентификаторы.
> Ловушка экзамена: на рисунках слайда с ipconfig и SLAAC для MAC fc:99:47:75:ce:e0 показан идентификатор fc99:47ff:fe75:cee0 — там седьмой бит не инвертирован. По правилу, как показывает сам слайд про EUI-64, получается **fe99:47ff:fe75:cee0**; на тесте применяй правило.
## Динамические link-local адреса
- **У всех интерфейсов IPv6 обязан быть LLA.** Как и GUA, LLA можно получить **динамически**: **префикс fe80::/10** плюс идентификатор интерфейса из **процесса EUI-64** или **случайного 64-битного числа**.
- Операционные системы вроде **Windows** обычно используют **один и тот же способ** и для GUA из SLAAC, и для динамического LLA, поэтому оба адреса заканчиваются одинаковыми 64 битами:
= C:\\> ipconfig
= IPv6 Address. . . . . . . . . . . : 2001:db8:acad:1:fc99:47ff:fe75:cee0
= Link-local IPv6 Address . . . . . : fe80::fc99:47ff:fe75:cee0
= Default Gateway . . . . . . . . . : fe80::1
Со случайным идентификатором интерфейса:
= IPv6 Address. . . . . . . . . . . : 2001:db8:acad:1:50a5:8a35:a5bb:66e1
= Link-local IPv6 Address . . . . . : fe80::50a5:8a35:a5bb:66e1
= Default Gateway . . . . . . . . . : fe80::1
- **Маршрутизаторы Cisco** автоматически создают LLA, **как только интерфейсу назначен GUA**, и по умолчанию строят идентификатор интерфейса всех LLA через **EUI-64**:
= R1# show interface gigabitEthernet 0/0/0
= Hardware is ISR4221-2x1GE, address is 7079.b392.3640 (bia 7079.b392.3640)
= R1# show ipv6 interface brief
= GigabitEthernet0/0/0 [up/up]
=     FE80::7279:B3FF:FE92:3640
=     2001:DB8:ACAD:1::1
## Обнаружение дублирующихся адресов
- Получив GUA или LLA — вручную, через SLAAC или DHCPv6, — устройство **может** проверить, что адрес больше никем не занят: это **обнаружение дублирующихся адресов (duplicate address detection, DAD)**.
- Оно шлёт **Neighbor Solicitation**, указав **свой адрес как целевой**. Если адрес есть у другого устройства, то ответит **Neighbor Advertisement**; **нет ответа** — адрес **уникален**. Подробности — в части 4.
## Проверка адресации
| Команда | Где | Что показывает |
|---|---|---|
| show ipv6 interface brief | маршрутизатор | каждый интерфейс с [состояние/протокол], его LLA (FE80::…) и GUA |
| show ipv6 route | маршрутизатор | таблицу маршрутизации IPv6: **C** — подключённая /64, **L** — собственный адрес маршрутизатора как /128 |
| show interface | маршрутизатор | MAC-адрес (address is … bia …) — исходные данные для EUI-64 |
| ipconfig | хост Windows | GUA (IPv6 Address), Link-local IPv6 Address и Default Gateway |
| ping | оба | доступность через ICMPv6 Echo Request и Echo Reply |
= R1# show ipv6 route
= C   2001:DB8:ACAD:1::/64 [0/0]
=      via GigabitEthernet0/0/0, directly connected
= L   2001:DB8:ACAD:1::1/128 [0/0]
=      via GigabitEthernet0/0/0, receive
?? Хост получил RA: «построй GUA сам, а адрес DNS спроси у DHCPv6-сервера». Какой это метод и что будет шлюзом по умолчанию?
?= Метод 2, SLAAC со stateless DHCPv6-сервером; шлюз по умолчанию — LLA маршрутизатора, адрес источника RA.
?? Какой идентификатор интерфейса EUI-64 получится из MAC-адреса 00:1a:2b:3c:4d:5e?
?= 021a:2bff:fe3c:4d5e — вставляем ff:fe после 00:1a:2b и инвертируем 7-й бит: 00 превращается в 02.
?? Почему GUA и LLA в выводе ipconfig на Windows заканчиваются одинаковыми 64 битами?
?= Windows использует один и тот же способ (EUI-64 или случайный) и для GUA из SLAAC, и для динамического LLA, поэтому у обоих один идентификатор интерфейса.
## На экзамене
- **ipv6 address 2001:db8:acad:1::1/64** — статический GUA; **ipv6 address fe80::1:1 link-local** — статический LLA; **ipv6 unicast-routing** — пересылка IPv6.
- В RA есть **префикс и его длина**, **шлюз = LLA-источник RA**, **адреса DNS и доменное имя**; окончательное решение — за ОС хоста.
- Три метода: **SLAAC**; **SLAAC + stateless DHCPv6** (DNS от сервера); **stateful DHCPv6** (GUA от сервера). Шлюз всегда берётся из RA.
- **EUI-64**: вставить **fffe** в середину MAC, инвертировать **7-й бит**; случайные идентификаторы скрывают MAC.
- Маршрутизатор Cisco сам создаёт LLA через EUI-64, как только на интерфейсе настроен GUA.`,
      },
      [
        qx("Which command assigns the global unicast address 2001:db8:acad:1::1 with a /64 prefix to a router interface?", "ipv6 address 2001:db8:acad:1::1/64", [
          ["ip address 2001:db8:acad:1::1/64", "ip address is the IPv4 command; IPv6 commands use ipv6 in place of ip.", "ip address — команда IPv4; в командах IPv6 вместо ip пишут ipv6."],
          ["ipv6 address 2001:db8:acad:1::1 link-local", "The link-local keyword is for an LLA (fe80::/10); a GUA is entered with /prefix-length.", "Ключевое слово link-local — для LLA (fe80::/10); GUA вводят с /prefix-length."],
          ["ipv6 unicast-routing 2001:db8:acad:1::1/64", "ipv6 unicast-routing is a global command without an address; it enables IPv6 forwarding.", "ipv6 unicast-routing — глобальная команда без адреса; она включает пересылку IPv6."],
        ], "In interface configuration mode: ipv6 address ipv6-address/prefix-length — the prefix length replaces the IPv4 subnet mask.", "В режиме настройки интерфейса: ipv6 address ipv6-address/prefix-length — длина префикса заменяет маску подсети IPv4."),
        qx("Which command enables IPv6 forwarding on a Cisco router?", "ipv6 unicast-routing", [
          ["ipv6 address autoconfig", "This makes an interface obtain its own address with SLAAC, like a host; it does not turn on forwarding.", "Эта команда заставляет интерфейс получить адрес через SLAAC, как хост; пересылку она не включает."],
          ["ipv6 enable", "ipv6 enable turns on IPv6 on one interface and creates only an LLA.", "ipv6 enable включает IPv6 на одном интерфейсе и создаёт только LLA."],
          ["ipv6 neighbor", "ipv6 neighbor adds a static entry to the neighbor table — like a static ARP entry.", "ipv6 neighbor добавляет статическую запись в таблицу соседей — как статическая запись ARP."],
        ], "ipv6 unicast-routing (global configuration mode) lets the router forward IPv6 packets; it also starts RAs and joins the router to ff02::2.", "ipv6 unicast-routing (режим глобальной конфигурации) разрешает маршрутизатору пересылать пакеты IPv6; заодно он начинает рассылать RA и вступает в группу ff02::2."),
        qx("Which command configures fe80::1:1 as the link-local address of a router interface?", "ipv6 address fe80::1:1 link-local", [
          ["ipv6 address fe80::1:1/64", "Without the link-local keyword the address is not set as the interface's LLA.", "Без ключевого слова link-local адрес не становится LLA интерфейса."],
          ["ipv6 link-local fe80::1:1", "The syntax is wrong: the address follows ipv6 address, and link-local comes last.", "Синтаксис неверен: адрес пишут после ipv6 address, а link-local — в конце."],
          ["ipv6 address fe80::1:1/10 local-link", "There is no local-link keyword, and an LLA is entered without a prefix length.", "Ключевого слова local-link нет, а LLA вводят без длины префикса."],
        ], "LLAs are configured manually with ipv6 address ipv6-link-local-address link-local.", "LLA настраивают вручную командой ipv6 address ipv6-link-local-address link-local."),
        qx("Where does a host take its default gateway address from when it receives an ICMPv6 Router Advertisement?", "From the RA source address, the router's LLA", [
          ["From the first address of the prefix", "The prefix tells the host its network; the gateway is not derived from it.", "Префикс сообщает хосту его сеть; шлюз из него не вычисляется."],
          ["From the all-routers address ff02::2","ff02::2 is a group address that RS messages are sent to; it cannot be a default gateway.", "ff02::2 — групповой адрес, на который шлют RS; шлюзом по умолчанию он быть не может."],
          ["From the DNS server listed in the RA", "DNS servers resolve names; they do not forward packets off the link.", "DNS-серверы разрешают имена, а не пересылают пакеты за пределы канала."],
        ], "The default gateway address in the RA is an IPv6 LLA — the source IPv6 address of the RA message itself.", "Шлюз по умолчанию в RA — это IPv6 LLA, адрес источника самого сообщения RA."),
        qx("An RA tells hosts: “Here is my information, but you need to get other information such as DNS addresses from a DHCPv6 server.” Which method is this?", "SLAAC with a stateless DHCPv6 server", [
          ["SLAAC only", "With SLAAC only, the RA itself has everything needed, and no DHCPv6 server is asked.", "При одном SLAAC всё нужное есть в самом RA, и к DHCPv6-серверу не обращаются."],
          ["Stateful DHCPv6, with the GUA from the server", "In Method 3 the RA gives only the gateway and the server provides the GUA too; here the host builds its own GUA.", "В методе 3 RA даёт только шлюз, а сервер выдаёт и GUA; здесь же хост строит GUA сам."],
          ["Static configuration with EUI-64", "Static configuration needs no RA at all; EUI-64 is only a way to build the interface ID.", "Статической настройке RA не нужен вовсе; EUI-64 — лишь способ построить идентификатор интерфейса."],
        ], "Method 2: the device creates its GUA with SLAAC, uses the router LLA as its gateway and asks a stateless DHCPv6 server for DNS addresses and the domain name.", "Метод 2: устройство строит GUA через SLAAC, берёт LLA маршрутизатора как шлюз и спрашивает у stateless DHCPv6-сервера адреса DNS и доменное имя."),
        qx("With Method 3, stateful DHCPv6, where does a host get its default gateway address?", "From the RA — the router's link-local address", [
          ["From the stateful DHCPv6 server","DHCPv6 provides the GUA, DNS and domain name, but never the default gateway.", "DHCPv6 выдаёт GUA, DNS и доменное имя, но никогда — шлюз по умолчанию."],
          ["From EUI-64, based on its own MAC address", "EUI-64 builds the interface ID of the host's own address; it has nothing to do with the gateway.", "EUI-64 строит идентификатор интерфейса для собственного адреса хоста; к шлюзу он отношения не имеет."],
          ["From the DNS server that DHCPv6 provides", "A DNS server resolves names; it is not a router.", "DNS-сервер разрешает имена; это не маршрутизатор."],
        ], "Even in Method 3 the RA suggests the router LLA, the RA source address, as the default gateway; everything else comes from the stateful DHCPv6 server.", "Даже в методе 3 RA предлагает в качестве шлюза LLA маршрутизатора — адрес источника RA; всё остальное приходит от stateful DHCPv6-сервера."),
        qx("Which statement describes SLAAC?", "The host builds its GUA from the RA prefix, no DHCPv6", [
          ["A server assigns each host's GUA and keeps track of it", "Assigning and tracking addresses is stateful DHCPv6, similar to DHCP for IPv4.", "Выдавать и отслеживать адреса — это stateful DHCPv6, похожий на DHCP для IPv4."],
          ["The router sends each host a complete GUA in its RA", "The RA carries only the prefix and prefix length; the host creates the interface ID itself.", "В RA только префикс и его длина; идентификатор интерфейса хост создаёт сам."],
          ["The host copies the router's GUA and changes the last hextet", "Hosts never copy the router's address; they combine the RA prefix with their own interface ID.", "Хосты не копируют адрес маршрутизатора; они соединяют префикс из RA со своим идентификатором интерфейса."],
        ], "SLAAC lets a device configure a GUA without DHCPv6: the prefix comes from the RA, and the interface ID comes from EUI-64 or random generation.", "SLAAC позволяет устройству настроить GUA без DHCPv6: префикс приходит в RA, а идентификатор интерфейса — из EUI-64 или случайной генерации."),
        qx("Using the EUI-64 process, what is the interface ID for the MAC address fc:99:47:75:ce:e0?", "fe99:47ff:fe75:cee0", [
          ["fc99:47ff:fe75:cee0", "The 7th bit was not reversed: fc (1111 1100) must become fe (1111 1110). The slide's ipconfig output repeats this slip.", "Седьмой бит не инвертирован: fc (1111 1100) должен стать fe (1111 1110). Та же ошибка есть в выводе ipconfig на слайде."],
          ["fe99:47fe:ff75:cee0", "The inserted value is fffe in this order — ff first, then fe.", "Вставляется значение fffe именно в таком порядке — сначала ff, потом fe."],
          ["fe99:4775:ffce:fee0", "fffe goes exactly into the middle, after the first 24 bits (fc:99:47), not after the fourth byte.", "fffe вставляют ровно в середину, после первых 24 бит (fc:99:47), а не после четвёртого байта."],
        ], "Insert ff:fe between fc:99:47 and 75:ce:e0, then reverse the 7th bit of the first byte: fc becomes fe. Result: fe99:47ff:fe75:cee0.", "Вставляем ff:fe между fc:99:47 и 75:ce:e0, затем инвертируем седьмой бит первого байта: fc превращается в fe. Итог: fe99:47ff:fe75:cee0."),
        qx("A router interface has the MAC address 7079.b392.3640. Which link-local address does Cisco IOS create for it with EUI-64?", "FE80::7279:B3FF:FE92:3640", [
          ["FE80::7079:B3FF:FE92:3640", "The 7th bit was not reversed: 70 must become 72.", "Седьмой бит не инвертирован: 70 должно стать 72."],
          ["FE80::7279:B392:FFFE:3640", "FFFE goes into the middle of the MAC, after 70:79:b3, not after the fourth byte.", "FFFE вставляют в середину MAC, после 70:79:b3, а не после четвёртого байта."],
          ["FE80::B392:3640", "An interface ID is always 64 bits; this one uses only part of the MAC and no FFFE.", "Идентификатор интерфейса всегда 64 бита; здесь взята только часть MAC и нет FFFE."],
        ], "70:79:b3 + ff:fe + 92:36:40, and 70 (0111 0000) becomes 72 (0111 0010): FE80::7279:B3FF:FE92:3640 — exactly what show ipv6 interface brief shows on the slide.", "70:79:b3 + ff:fe + 92:36:40, а 70 (0111 0000) превращается в 72 (0111 0010): FE80::7279:B3FF:FE92:3640 — ровно то, что показывает show ipv6 interface brief на слайде."),
        tfx("Cisco routers automatically create an IPv6 link-local address on an interface as soon as a GUA is assigned to it.", true,
          "True. Cisco routers automatically create an IPv6 LLA whenever a GUA is assigned to the interface, using EUI-64 by default.",
          "Верно. Маршрутизаторы Cisco автоматически создают IPv6 LLA, как только интерфейсу назначен GUA, по умолчанию через EUI-64.",
          "Answering False assumes the LLA must be typed by hand; manual configuration is optional — it only makes the LLA easier to recognise.",
          "Ответ «неверно» предполагает, что LLA нужно вводить вручную; ручная настройка необязательна — она лишь делает LLA удобнее для узнавания."),
        qx("Which link-local address was most likely created with the EUI-64 process?", "fe80::fc99:47ff:fe75:cee0", [
          ["fe80::50a5:8a35:a5bb:66e1", "There is no ff:fe in the middle — this interface ID is a random 64-bit number.", "В середине нет ff:fe — это случайный 64-битный идентификатор."],
          ["fe80::1:1", "fe80::1:1 is a short, manually configured LLA, typical of router interfaces.", "fe80::1:1 — короткий LLA, настроенный вручную; так обычно делают на интерфейсах маршрутизаторов."],
          ["fe80::fffe:50a5:8a35:66e1", "fffe is at the start of the interface ID, not in the middle where EUI-64 puts it.", "fffe стоит в начале идентификатора интерфейса, а не в середине, куда его ставит EUI-64."],
        ], "An EUI-64 interface ID has ff:fe in the middle (xxxx:xxff:fexx:xxxx), because fffe is inserted between the two halves of the MAC.", "У идентификатора EUI-64 в середине стоит ff:fe (xxxx:xxff:fexx:xxxx): fffe вставляется между половинами MAC."),
        qx("On a Windows host, which command shows its IPv6 address, link-local IPv6 address and default gateway?", "ipconfig", [
          ["show ipv6 interface brief", "This is a Cisco IOS command for routers and switches, not a Windows command.", "Это команда Cisco IOS для маршрутизаторов и коммутаторов, а не Windows."],
          ["tracert", "tracert shows the hops on the path to a destination, not the host's own settings.", "tracert показывает переходы на пути к узлу, а не настройки самого хоста."],
          ["arp -a", "arp -a lists the IPv4 ARP cache; it shows neither IPv6 addresses nor the gateway setting.", "arp -a выводит кэш ARP для IPv4; ни адресов IPv6, ни настройки шлюза там нет."],
        ], "ipconfig prints the IPv6 Address (GUA), the Link-local IPv6 Address and the Default Gateway, as in the slide output.", "ipconfig выводит IPv6 Address (GUA), Link-local IPv6 Address и Default Gateway, как в выводе на слайде."),
      ],
      deepL7P3,
    ),
    part(
      "cn-l7-p4",
      { en: "IPv6 subnetting, ICMP messages, ping and traceroute", ru: "Подсети IPv6, сообщения ICMP, ping и traceroute" },
      {
        en: `## Subnetting with the subnet ID
IPv6 was **designed with subnetting in mind**.
- A **separate subnet ID field** in the IPv6 GUA is used to create subnets.
- The subnet ID field is the area **between the global routing prefix and the interface ID**.
- The benefit of a 128-bit address: it supports **more than enough subnets and hosts per subnet** for each network. **Address conservation is not an issue.**
- With a **/48** global routing prefix and the typical **64-bit interface ID**, the subnet ID is **16 bits**:
= 16-bit subnet ID     ->  2^16 = 65,536 subnets
= 64-bit interface ID  ->  2^64 = 18,446,744,073,709,551,616 addresses per subnet (about 18 quintillion)
- Unlike IPv4, there is **no borrowing of host bits** and no subtracting of network and broadcast addresses: the interface ID stays 64 bits, and only the subnet ID changes.
How many /64 subnets a site gets depends only on its prefix length (beyond the slides, but the same arithmetic):
| Site prefix | Subnet ID bits | /64 subnets |
|---|---|---|
| /48 | 16 | 65,536 |
| /52 | 12 | 4,096 |
| /56 | 8 | 256 |
| /60 | 4 | 16 |
| /64 | 0 | 1 |
= number of /64 subnets = 2^(64 - site prefix length)
## Subnetting example: 2001:db8:acad::/48
Given the **2001:db8:acad::/48** global routing prefix with a **16-bit subnet ID**:
- It allows **65,536 /64 subnets**.
- The **global routing prefix is the same** for all subnets.
- **Only the subnet ID hextet is incremented**, in **hexadecimal**, for each subnet.
= 2001:db8:acad:0000::/64
= 2001:db8:acad:0001::/64
= 2001:db8:acad:0002::/64
= ...
= 2001:db8:acad:0009::/64
= 2001:db8:acad:000a::/64
= 2001:db8:acad:000b::/64
= 2001:db8:acad:000c::/64
= ...  (subnets 13 - 65,534 not shown)
= 2001:db8:acad:ffff::/64
> Exam trap: after 0009 comes **000a**, not 0010 — the subnet ID is counted in hexadecimal. The last subnet is ffff, and the total is 65,536 because 0000 counts too.
## Allocating the subnets
The slide **IPv6 Subnet Allocation** takes **5 subnets from the 65,536 available** in the address block 2001:db8:acad::/48 — one for **every link**, including the serial WAN link between the two routers:
| Subnet | Link | Addresses on the link |
|---|---|---|
| 2001:db8:acad:1::/64 | LAN of PC1 | R1 G0/0/0 ::1, PC1 ::10 |
| 2001:db8:acad:2::/64 | LAN of PC2 | R1 G0/0/1 ::1, PC2 ::10 |
| 2001:db8:acad:3::/64 | serial link R1 – R2 | R1 S0/1/0 ::1, R2 S0/1/0 ::2 |
| 2001:db8:acad:4::/64 | LAN of PC3 | R2 G0/0/0 ::1, PC3 ::10 |
| 2001:db8:acad:5::/64 | LAN of PC4 | R2 G0/0/1 ::1, PC4 ::10 |
- Subnet 0000 and subnets 0006 – ffff stay free for future links.
- Each router interface is configured to be on a **different IPv6 subnet**:
= R1(config)# interface gigabitethernet 0/0/0
= R1(config-if)# ipv6 address 2001:db8:acad:1::1/64
= R1(config-if)# no shutdown
= R1(config-if)# exit
= R1(config)# interface gigabitethernet 0/0/1
= R1(config-if)# ipv6 address 2001:db8:acad:2::1/64
= R1(config-if)# no shutdown
= R1(config-if)# exit
= R1(config)# interface serial 0/1/0
= R1(config-if)# ipv6 address 2001:db8:acad:3::1/64
= R1(config-if)# no shutdown
## ICMP — what it is for
- **Internet Control Message Protocol (ICMP)** provides **feedback about issues** related to the processing of IP packets under certain conditions. ICMP reports problems; it does not fix them and does not make IP reliable.
- **ICMPv4** is the messaging protocol for IPv4. **ICMPv6** is the messaging protocol for IPv6 and **includes additional functionality**.
- The ICMP messages **common to both** ICMPv4 and ICMPv6:
- **Host reachability**
- **Destination or Service Unreachable**
- **Time exceeded**
- **Note:** ICMPv4 messages are **not required** and are often **not allowed within a network for security reasons**.
## Host reachability — Echo Request and Echo Reply
- An **ICMP Echo message** can be used to test the reachability of a host on an IP network.
- The local host sends an **ICMP Echo Request** to a host. If the host is available, the destination host responds with an **Echo Reply**.
- On the slide, H1 (192.168.10.1/24) asks "Is H2 reachable?", and H2 (192.168.30.1/24) answers "Yes, I am here."
## Destination or Service Unreachable
- An **ICMP Destination Unreachable** message notifies the **source** that a destination or service is unreachable.
- The message includes a **code** that indicates **why** the packet could not be delivered.
| Code | ICMPv4 | ICMPv6 |
|---|---|---|
| 0 | Net unreachable | No route to destination |
| 1 | Host unreachable | Communication with the destination is administratively prohibited (e.g., firewall) |
| 2 | Protocol unreachable | Beyond scope of the source address |
| 3 | Port unreachable | Address unreachable |
| 4 | — | Port unreachable |
- **Note:** ICMPv6 has **similar but slightly different codes** for Destination Unreachable messages.
> Exam trap: "port unreachable" is code **3** in ICMPv4 but code **4** in ICMPv6, where code 3 means "address unreachable". Code 1 is "host unreachable" in ICMPv4 but "administratively prohibited" in ICMPv6.
## Time Exceeded
- When the **TTL** field of an IPv4 packet is decremented to **0**, the router discards the packet and sends an **ICMPv4 Time Exceeded** message to the **source host**.
- **ICMPv6** also sends a Time Exceeded message; instead of the IPv4 TTL field it uses the IPv6 **Hop Limit** field to determine whether the packet has expired.
- **Time Exceeded messages are used by the traceroute tool.**
The slide output — a ping that runs into a routing loop:
= Pinging 8.8.8.8 with 32 bytes of data:
= Reply from 192.168.1.1: TTL expired in transit.
= Reply from 192.168.1.1: TTL expired in transit.
= Ping statistics for 8.8.8.8:
=     Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
- The replies come from router **192.168.1.1**, not from 8.8.8.8: it is the router where the TTL reached 0. "Received = 4" counts these error replies, so 0% loss does **not** mean that 8.8.8.8 was reached.
## ICMPv6 Neighbor Discovery
ICMPv6 has new features and improved functionality not found in ICMPv4, including **four new protocols** (messages) as part of the **Neighbor Discovery Protocol (ND or NDP)**:
| Messaging | Messages | Used for |
|---|---|---|
| between an **IPv6 router and an IPv6 device** | **Router Solicitation (RS)**, **Router Advertisement (RA)** | dynamic address allocation |
| between **IPv6 devices** | **Neighbor Solicitation (NS)**, **Neighbor Advertisement (NA)** | **duplicate address detection** and **address resolution** |
- IPv6-enabled routers send **RA messages every 200 seconds** to provide addressing information to IPv6-enabled hosts: the prefix, prefix length, DNS address and domain name.
- A host using **SLAAC** sets its **default gateway** to the **link-local address of the router that sent the RA**.
- A router also sends an **RA in response to an RS**. In the slide dialogue PC1 says: "Hi, I just booted up. Is there an IPv6 router on the network? I need to know how to get my IPv6 address information dynamically." R1 answers: "Hi all IPv6-enabled devices. I'm R1 and you can use SLAAC to create an IPv6 global unicast address. The prefix is 2001:db8:acad:1::/64. By the way, use my link-local address fe80::1 as your default gateway."
- **Duplicate address detection (DAD):** a device that has been assigned a global or link-local unicast address **may** perform DAD to ensure the address is unique. It sends an **NS with its own IPv6 address as the targeted address**; if another device has this address, it responds with an **NA** saying the address is in use. DAD is **not required**, but **RFC 4861 recommends** it for unicast addresses.
- **Address resolution:** to learn the MAC address of a destination, a device sends an **NS to the solicited-node multicast address**, with the known (targeted) IPv6 address inside. The device that has this address responds with an **NA containing its Ethernet MAC address**. On the slide R1 sends an NS for 2001:db8:acad:1::10, and PC1 answers with its MAC 00:aa:bb:cc:dd:ee.
> Memory hook: **R**-messages talk to the **R**outer (who is my router, what is my prefix); **N**-messages talk to a **N**eighbor (who has this address — the IPv6 ARP and DAD).
> Exam trap: IPv6 has **no ARP** and no broadcast — NS and NA do the job of the ARP request and reply. In DAD, silence is good news: no NA means the address is free.
## Ping — test connectivity
- **ping** is an **IPv4 and IPv6** testing utility that uses **ICMP Echo Request and Echo Reply** messages to test connectivity between hosts. It prints a summary with the **success rate** and the **average round-trip time** to the destination.
- If a reply is not received within the **timeout**, ping shows a message that a response was not received.
- It is common for the **first ping to time out** if **address resolution (ARP or ND)** has to be performed before the ICMP Echo Request is sent.
= S1#ping 192.168.20.2
= Sending 5, 100-byte ICMP Echos to 192.168.20.2, timeout is 2 seconds:
= .!!!!
= Success rate is 80 percent (4/5), round-trip min/avg/max = 0/0/1 ms
= R1#ping 2001:db8:acad:1::2
= Sending 5, 100-byte ICMP Echos to 2001:db8:acad:1::2, timeout is 2 seconds:
= !!!!!
= Success rate is 100 percent (5/5), round-trip min/avg/max = 0/0/1 ms
- In IOS output **!** is a received reply and **.** is a timeout; .!!!! is the classic picture of the first packet lost to ARP.
Test from the inside out:
| Step | What to ping | A reply means | No reply means |
|---|---|---|---|
| 1. Loopback | **127.0.0.1** (IPv4) or **::1** (IPv6) | IP is **properly installed** on the host | **TCP/IP is not operational** on the host |
| 2. Default gateway | the gateway, e.g. 10.0.0.254 for the host 10.0.0.1/24 | the host **and** the router interface serving as the gateway are both operational on the **local network** | ping another local host that is known to be operational |
| 3. Remote host | a host on another network | communication **across the internetwork** works — and so the local network works too | a fault on the path — or ICMP blocked for security |
- The **default gateway** address is used most often because **the router is normally always operational**.
- **Note:** many network administrators **limit or prohibit the entry of ICMP messages**, so a missing ping response can be due to **security restrictions**, not a fault.
## Traceroute — test the path
- **traceroute** (on Windows **tracert**) tests the **path** between two hosts and provides a **list of hops** that were successfully reached along that path.
- It gives the round-trip time for each hop and indicates if a hop fails to respond: an asterisk (*) marks a lost or unreplied packet.
- This information can locate a **problematic router** in the path, or may show that a router is **configured not to reply**.
- Traceroute uses the **TTL** field (IPv4) and the **Hop Limit** field (IPv6) of the Layer 3 headers, together with the **ICMP Time Exceeded** message.
How it works:
- The first message has **TTL = 1**. The TTL times out at the **first router**, which responds with an **ICMPv4 Time Exceeded** message — now traceroute knows hop 1.
- Traceroute then **increments the TTL** (2, 3, 4…) for each sequence of messages; each sequence expires one router further and reveals the address of the next hop.
- The TTL keeps increasing until the **destination is reached** or it reaches a **predefined maximum**.
= R1#traceroute 192.168.40.2
= Tracing the route to 192.168.40.2
=   1  192.168.10.2   1 msec  0 msec  0 msec
=   2  192.168.20.2   2 msec  1 msec  0 msec
=   3  192.168.30.2   1 msec  0 msec  0 msec
=   4  192.168.40.2   0 msec  0 msec  0 msec
| Probe TTL | Where the TTL hits 0 | Who replies | Reply |
|---|---|---|---|
| 1 | first router | 192.168.10.2 | Time Exceeded |
| 2 | second router | 192.168.20.2 | Time Exceeded |
| 3 | third router | 192.168.30.2 | Time Exceeded |
| 4 | nowhere — the probe arrives | 192.168.40.2 (destination) | the final answer, the trace ends |
> Exam trap: a missing reply in traceroute does not prove that a router is down — it may be configured not to reply, or ICMP may be filtered, while it still forwards traffic.
?? How many /64 subnets does a /56 site prefix give?
?= 2^(64 − 56) = 2^8 = 256.
?? A ping to the default gateway works, but a ping to a remote server fails. Which part works for sure?
?= The local network: the host and the gateway interface are both operational. The fault (or an ICMP filter) is beyond the gateway.
?? Which ICMPv6 messages does a host use to find the MAC address of a neighbor, and where is the request sent?
?= NS and NA: the NS goes to the solicited-node multicast address of the target, and the NA returns the MAC address.
## Exam focus
- /48 + 16-bit subnet ID → **65,536** /64 subnets; 64-bit interface ID → about **18 quintillion** hosts; only the **subnet ID hextet** is incremented, in **hex**.
- ICMP messages common to v4 and v6: **host reachability (echo)**, **destination or service unreachable**, **time exceeded**.
- Codes: ICMPv4 **0 net, 1 host, 2 protocol, 3 port**; ICMPv6 **0 no route, 1 administratively prohibited, 2 beyond scope, 3 address, 4 port**.
- ND: **RS/RA** (router ↔ device, address allocation, RA every **200 s**), **NS/NA** (device ↔ device, **DAD** and **address resolution**).
- Tests: **ping 127.0.0.1 / ::1** → **ping the default gateway** → **ping a remote host**; **traceroute/tracert** with TTL 1, 2, 3…; an asterisk in the output means a lost or unreplied packet.`,
        ru: `## Подсети по subnet ID
IPv6 **с самого начала задуман с расчётом на подсети (designed with subnetting in mind)**.
- Для подсетей в GUA есть **отдельное поле subnet ID**.
- Поле subnet ID — это область **между глобальным префиксом маршрутизации и идентификатором интерфейса**.
- Выгода 128-битного адреса: он даёт **более чем достаточно подсетей и хостов в каждой подсети** для любой сети. **Экономить адреса не нужно (address conservation is not an issue).**
- При глобальном префиксе **/48** и обычном **64-битном interface ID** subnet ID занимает **16 бит**:
= 16-bit subnet ID     ->  2^16 = 65,536 subnets
= 64-bit interface ID  ->  2^64 = 18,446,744,073,709,551,616 addresses per subnet (about 18 quintillion)
- В отличие от IPv4, здесь **не нужно занимать биты хоста** и вычитать адреса сети и broadcast: interface ID остаётся 64-битным, меняется только subnet ID.
Сколько подсетей /64 получает площадка, зависит только от длины её префикса (сверх слайдов, но арифметика та же):
| Префикс площадки | Бит в subnet ID | Подсетей /64 |
|---|---|---|
| /48 | 16 | 65 536 |
| /52 | 12 | 4 096 |
| /56 | 8 | 256 |
| /60 | 4 | 16 |
| /64 | 0 | 1 |
= number of /64 subnets = 2^(64 - site prefix length)
## Пример разбиения: 2001:db8:acad::/48
Дан глобальный префикс маршрутизации **2001:db8:acad::/48** с **16-битным subnet ID**:
- Он даёт **65 536 подсетей /64**.
- **Глобальный префикс одинаков** во всех подсетях.
- Для каждой новой подсети **увеличивается только хекстет subnet ID**, причём в **шестнадцатеричной** системе.
= 2001:db8:acad:0000::/64
= 2001:db8:acad:0001::/64
= 2001:db8:acad:0002::/64
= ...
= 2001:db8:acad:0009::/64
= 2001:db8:acad:000a::/64
= 2001:db8:acad:000b::/64
= 2001:db8:acad:000c::/64
= ...  (subnets 13 - 65,534 not shown)
= 2001:db8:acad:ffff::/64
> Ловушка экзамена: после 0009 идёт **000a**, а не 0010 — subnet ID считают в шестнадцатеричной системе. Последняя подсеть — ffff, а всего их 65 536, потому что 0000 тоже считается.
## Распределение подсетей
На слайде **IPv6 Subnet Allocation** из адресного блока 2001:db8:acad::/48 взято **5 подсетей из 65 536 доступных** — по одной на **каждый канал**, включая последовательный WAN-канал между двумя маршрутизаторами:
| Подсеть | Канал | Адреса в канале |
|---|---|---|
| 2001:db8:acad:1::/64 | LAN с PC1 | R1 G0/0/0 ::1, PC1 ::10 |
| 2001:db8:acad:2::/64 | LAN с PC2 | R1 G0/0/1 ::1, PC2 ::10 |
| 2001:db8:acad:3::/64 | последовательный канал R1 – R2 | R1 S0/1/0 ::1, R2 S0/1/0 ::2 |
| 2001:db8:acad:4::/64 | LAN с PC3 | R2 G0/0/0 ::1, PC3 ::10 |
| 2001:db8:acad:5::/64 | LAN с PC4 | R2 G0/0/1 ::1, PC4 ::10 |
- Подсеть 0000 и подсети 0006 – ffff остаются свободными для будущих каналов.
- Каждый интерфейс маршрутизатора настроен в **своей подсети IPv6**:
= R1(config)# interface gigabitethernet 0/0/0
= R1(config-if)# ipv6 address 2001:db8:acad:1::1/64
= R1(config-if)# no shutdown
= R1(config-if)# exit
= R1(config)# interface gigabitethernet 0/0/1
= R1(config-if)# ipv6 address 2001:db8:acad:2::1/64
= R1(config-if)# no shutdown
= R1(config-if)# exit
= R1(config)# interface serial 0/1/0
= R1(config-if)# ipv6 address 2001:db8:acad:3::1/64
= R1(config-if)# no shutdown
## ICMP — для чего он нужен
- **Internet Control Message Protocol (ICMP, протокол управляющих сообщений)** даёт **обратную связь о проблемах** при обработке IP-пакетов в определённых условиях. ICMP сообщает о проблемах, но не исправляет их и не делает IP надёжным.
- **ICMPv4** — протокол сообщений для IPv4. **ICMPv6** — протокол сообщений для IPv6, и в нём **есть дополнительные функции**.
- Сообщения ICMP, **общие для** ICMPv4 и ICMPv6:
- **Доступность узла (host reachability)**
- **Недоступность назначения или службы (destination or service unreachable)**
- **Превышение времени (time exceeded)**
- **Обрати внимание:** сообщения ICMPv4 **не обязательны** и часто **запрещены внутри сети по соображениям безопасности**.
## Доступность узла — Echo Request и Echo Reply
- **Сообщение ICMP Echo** позволяет проверить, доступен ли узел в IP-сети.
- Локальный хост отправляет узлу **ICMP Echo Request**. Если узел доступен, он отвечает **Echo Reply**.
- На слайде H1 (192.168.10.1/24) спрашивает «Is H2 reachable?», а H2 (192.168.30.1/24) отвечает «Yes, I am here.»
## Недоступность назначения или службы
- Сообщение **ICMP Destination Unreachable** сообщает **источнику**, что узел назначения или служба недоступны.
- В сообщении есть **код (code)**, который объясняет, **почему** пакет не удалось доставить.
| Код | ICMPv4 | ICMPv6 |
|---|---|---|
| 0 | Net unreachable — сеть недоступна | No route to destination — нет маршрута к назначению |
| 1 | Host unreachable — узел недоступен | Communication with the destination is administratively prohibited (e.g., firewall) — связь запрещена администратором, например межсетевым экраном |
| 2 | Protocol unreachable — протокол недоступен | Beyond scope of the source address — за пределами области адреса источника |
| 3 | Port unreachable — порт недоступен | Address unreachable — адрес недоступен |
| 4 | — | Port unreachable — порт недоступен |
- **Обрати внимание:** у ICMPv6 **похожие, но немного другие коды** Destination Unreachable.
> Ловушка экзамена: «port unreachable» — код **3** в ICMPv4, но код **4** в ICMPv6, где код 3 означает «address unreachable». Код 1 в ICMPv4 — «host unreachable», а в ICMPv6 — «administratively prohibited».
## Превышение времени (Time Exceeded)
- Когда поле **TTL** пакета IPv4 уменьшается до **0**, маршрутизатор отбрасывает пакет и отправляет **хосту-источнику** сообщение **ICMPv4 Time Exceeded**.
- **ICMPv6** тоже шлёт Time Exceeded; вместо поля TTL из IPv4 он смотрит на поле **Hop Limit** в IPv6, чтобы решить, истёк ли срок жизни пакета.
- **Сообщения Time Exceeded использует утилита traceroute.**
Вывод со слайда — ping, попавший в петлю маршрутизации:
= Pinging 8.8.8.8 with 32 bytes of data:
= Reply from 192.168.1.1: TTL expired in transit.
= Reply from 192.168.1.1: TTL expired in transit.
= Ping statistics for 8.8.8.8:
=     Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
- Ответы приходят от маршрутизатора **192.168.1.1**, а не от 8.8.8.8: это маршрутизатор, на котором TTL дошёл до 0. «Received = 4» считает эти ответы-ошибки, так что 0% потерь **не** означает, что 8.8.8.8 достигнут.
## Neighbor Discovery в ICMPv6
В ICMPv6 есть новые возможности и улучшения, которых нет в ICMPv4, в том числе **четыре новых протокола** (сообщения) в составе **протокола обнаружения соседей (Neighbor Discovery Protocol, ND или NDP)**:
| Обмен | Сообщения | Для чего |
|---|---|---|
| между **маршрутизатором IPv6 и устройством IPv6** | **Router Solicitation (RS)**, **Router Advertisement (RA)** | динамическая выдача адресов |
| между **устройствами IPv6** | **Neighbor Solicitation (NS)**, **Neighbor Advertisement (NA)** | **обнаружение дублирующихся адресов** и **разрешение адресов (address resolution)** |
- Маршрутизаторы с IPv6 рассылают **RA каждые 200 секунд**, сообщая хостам сведения об адресации: префикс, длину префикса, адрес DNS и доменное имя.
- Хост, использующий **SLAAC**, ставит **шлюзом по умолчанию link-local адрес маршрутизатора, приславшего RA**.
- Маршрутизатор также шлёт **RA в ответ на RS**. В диалоге на слайде PC1 говорит: «Hi, I just booted up. Is there an IPv6 router on the network? I need to know how to get my IPv6 address information dynamically» — я только что загрузился, есть ли в сети маршрутизатор IPv6 и как мне получить адрес? R1 отвечает: «Hi all IPv6-enabled devices. I'm R1 and you can use SLAAC to create an IPv6 global unicast address. The prefix is 2001:db8:acad:1::/64. By the way, use my link-local address fe80::1 as your default gateway» — используйте SLAAC, префикс 2001:db8:acad:1::/64, шлюз — мой fe80::1.
- **Обнаружение дублирующихся адресов (DAD):** устройство, получившее глобальный или link-local unicast-адрес, **может** выполнить DAD, чтобы убедиться, что адрес уникален. Оно шлёт **NS, где целевой адрес — его собственный адрес IPv6**; если этот адрес есть у другого устройства, то ответит **NA** о том, что адрес занят. DAD **не обязателен**, но **RFC 4861 рекомендует** выполнять его для unicast-адресов.
- **Разрешение адресов:** чтобы узнать MAC-адрес получателя, устройство шлёт **NS на solicited-node multicast-адрес**, указывая в нём известный (целевой) адрес IPv6. Устройство с этим адресом отвечает **NA со своим MAC-адресом Ethernet**. На слайде R1 шлёт NS для 2001:db8:acad:1::10, и PC1 отвечает своим MAC 00:aa:bb:cc:dd:ee.
> Запомни: **R**-сообщения говорят с **R**outer (кто мой маршрутизатор, какой мой префикс); **N**-сообщения говорят с **N**eighbor (у кого этот адрес — ARP и DAD для IPv6).
> Ловушка экзамена: в IPv6 **нет ARP** и нет broadcast — работу ARP-запроса и ответа делают NS и NA. При DAD тишина — хорошая новость: нет NA, значит, адрес свободен.
## Ping — проверка связи
- **ping** — утилита проверки для **IPv4 и IPv6**; она использует сообщения **ICMP Echo Request и Echo Reply**, чтобы проверить связь между хостами, и выводит сводку с **долей успешных ответов (success rate)** и **средним временем приёма-передачи (round-trip time)**.
- Если ответ не пришёл за время **тайм-аута (timeout)**, ping сообщает, что ответа нет.
- **Первый ping часто уходит в тайм-аут**, если перед отправкой ICMP Echo Request нужно выполнить **разрешение адресов (ARP или ND)**.
= S1#ping 192.168.20.2
= Sending 5, 100-byte ICMP Echos to 192.168.20.2, timeout is 2 seconds:
= .!!!!
= Success rate is 80 percent (4/5), round-trip min/avg/max = 0/0/1 ms
= R1#ping 2001:db8:acad:1::2
= Sending 5, 100-byte ICMP Echos to 2001:db8:acad:1::2, timeout is 2 seconds:
= !!!!!
= Success rate is 100 percent (5/5), round-trip min/avg/max = 0/0/1 ms
- В выводе IOS **!** — полученный ответ, **.** — тайм-аут; .!!!! — классическая картина, когда первый пакет потерян из-за ARP.
Проверяй изнутри наружу:
| Шаг | Что пинговать | Ответ есть — значит | Ответа нет — значит |
|---|---|---|---|
| 1. Loopback | **127.0.0.1** (IPv4) или **::1** (IPv6) | IP **правильно установлен** на хосте | **TCP/IP на хосте не работает** |
| 2. Шлюз по умолчанию | шлюз, например 10.0.0.254 для хоста 10.0.0.1/24 | и хост, **и** интерфейс маршрутизатора-шлюза работают в **локальной сети** | пингуй другой локальный хост, про который известно, что он работает |
| 3. Удалённый хост | хост в другой сети | связь **через объединённую сеть (internetwork)** работает — а значит, работает и локальная сеть | неисправность на пути — или ICMP закрыт по соображениям безопасности |
- **Шлюз по умолчанию** пингуют чаще всего, потому что **маршрутизатор обычно всегда работает**.
- **Обрати внимание:** многие администраторы **ограничивают или запрещают входящие сообщения ICMP**, поэтому отсутствие ответа на ping может объясняться **ограничениями безопасности**, а не неисправностью.
## Traceroute — проверка пути
- **traceroute** (в Windows — **tracert**) проверяет **путь** между двумя хостами и выдаёт **список переходов (hops)**, до которых удалось дойти.
- Он показывает время приёма-передачи для каждого перехода и отмечает переход, который не ответил: звёздочка (*) означает потерянный или оставшийся без ответа пакет.
- По этим данным можно найти **проблемный маршрутизатор** на пути — или увидеть, что маршрутизатор **настроен не отвечать**.
- Traceroute использует поле **TTL** (IPv4) и поле **Hop Limit** (IPv6) в заголовках уровня 3 вместе с сообщением **ICMP Time Exceeded**.
Как он работает:
- Первое сообщение идёт с **TTL = 1**. TTL истекает на **первом маршрутизаторе**, и тот отвечает сообщением **ICMPv4 Time Exceeded** — так traceroute узнаёт переход 1.
- Затем traceroute **увеличивает TTL** (2, 3, 4…) для каждой серии сообщений; каждая серия истекает на один маршрутизатор дальше и выдаёт адрес следующего перехода.
- TTL растёт, пока **не будет достигнуто назначение** или **заданный максимум**.
= R1#traceroute 192.168.40.2
= Tracing the route to 192.168.40.2
=   1  192.168.10.2   1 msec  0 msec  0 msec
=   2  192.168.20.2   2 msec  1 msec  0 msec
=   3  192.168.30.2   1 msec  0 msec  0 msec
=   4  192.168.40.2   0 msec  0 msec  0 msec
| TTL пробы | Где TTL обнулится | Кто отвечает | Ответ |
|---|---|---|---|
| 1 | первый маршрутизатор | 192.168.10.2 | Time Exceeded |
| 2 | второй маршрутизатор | 192.168.20.2 | Time Exceeded |
| 3 | третий маршрутизатор | 192.168.30.2 | Time Exceeded |
| 4 | нигде — проба доходит до цели | 192.168.40.2 (назначение) | последний ответ, трассировка закончена |
> Ловушка экзамена: отсутствие ответа в traceroute не доказывает, что маршрутизатор неисправен, — он может быть настроен не отвечать или ICMP фильтруется, а трафик при этом идёт дальше.
?? Сколько подсетей /64 даёт префикс площадки /56?
?= 2^(64 − 56) = 2^8 = 256.
?? Пинг шлюза по умолчанию проходит, а пинг удалённого сервера — нет. Что точно работает?
?= Локальная сеть: и хост, и интерфейс шлюза работают. Неисправность (или фильтр ICMP) — дальше шлюза.
?? Какими сообщениями ICMPv6 хост узнаёт MAC-адрес соседа и куда отправляется запрос?
?= NS и NA: NS идёт на solicited-node multicast-адрес цели, а NA возвращает MAC-адрес.
## На экзамене
- /48 + 16-битный subnet ID → **65 536** подсетей /64; 64-битный interface ID → около **18 квинтиллионов** хостов; увеличивается только **хекстет subnet ID**, в **hex**.
- Сообщения ICMP, общие для v4 и v6: **host reachability (echo)**, **destination or service unreachable**, **time exceeded**.
- Коды: ICMPv4 **0 net, 1 host, 2 protocol, 3 port**; ICMPv6 **0 no route, 1 administratively prohibited, 2 beyond scope, 3 address, 4 port**.
- ND: **RS/RA** (маршрутизатор ↔ устройство, выдача адресов, RA каждые **200 с**), **NS/NA** (устройство ↔ устройство, **DAD** и **разрешение адресов**).
- Проверки: **ping 127.0.0.1 / ::1** → **ping шлюза по умолчанию** → **ping удалённого хоста**; **traceroute/tracert** с TTL 1, 2, 3…; звёздочка в выводе — потерянный или оставшийся без ответа пакет.`,
      },
      [
        qx("A company has the global routing prefix 2001:db8:acad::/48 and uses /64 subnets. How many subnets can it create?", "65,536", [
          ["256", "256 subnets come from an 8-bit subnet ID, that is a /56 site prefix.", "256 подсетей даёт 8-битный subnet ID, то есть префикс площадки /56."],
          ["4,096", "4,096 subnets come from a 12-bit subnet ID, a /52 site prefix.", "4 096 подсетей даёт 12-битный subnet ID — префикс площадки /52."],
          ["18 quintillion", "About 18 quintillion is the number of addresses in one /64 subnet (2^64), not the number of subnets.", "Около 18 квинтиллионов — число адресов в одной подсети /64 (2^64), а не число подсетей."],
        ], "Between /48 and /64 there are 16 bits of subnet ID: 2^16 = 65,536 subnets.", "Между /48 и /64 — 16 бит subnet ID: 2^16 = 65 536 подсетей."),
        qx("In the 2001:db8:acad::/48 subnetting example, which subnet directly follows 2001:db8:acad:9::/64?", "2001:db8:acad:a::/64", [
          ["2001:db8:acad:10::/64", "Counting in decimal is the trap: in hexadecimal 9 is followed by a, and 10 (hex) is sixteen.", "Ловушка — счёт в десятичной системе: в шестнадцатеричной после 9 идёт a, а 10 (hex) — это шестнадцать."],
          ["2001:db8:acad:9:1::/64", "This changes the fifth hextet, which belongs to the interface ID, not to the subnet ID.", "Здесь меняется пятый хекстет, а он относится к идентификатору интерфейса, а не к subnet ID."],
          ["2001:db8:acad:b::/64", "b comes after a; this skips the subnet 2001:db8:acad:a::/64.", "b идёт после a; так пропущена подсеть 2001:db8:acad:a::/64."],
        ], "Only the subnet ID hextet is incremented, and in hexadecimal: …:9, …:a, …:b, …:c and so on up to …:ffff.", "Увеличивается только хекстет subnet ID, и в шестнадцатеричной системе: …:9, …:a, …:b, …:c и так далее до …:ffff."),
        qx("S1 pings a host on its LAN for the first time, and the output shows .!!!! with a success rate of 80 percent. What is the most likely reason the first echo failed?", "ARP had to resolve the MAC address first", [
          ["The destination host was rebooting at that moment", "A rebooting host would miss several echoes in a row, not exactly the first one.", "Перезагружающийся хост пропустил бы несколько эхо подряд, а не ровно первое."],
          ["The TTL of the first packet expired in transit", "An expired TTL would bring a Time Exceeded reply from a router, not a silent timeout inside the LAN.", "Истёкший TTL дал бы ответ Time Exceeded от маршрутизатора, а не тихий тайм-аут внутри LAN."],
          ["An ACL on the switch dropped the first packet only", "A filter drops every matching packet, not only the first one.", "Фильтр отбрасывает все подходящие пакеты, а не только первый."],
        ], "It is common for the first ping to time out when address resolution (ARP for IPv4, ND for IPv6) must run before the ICMP Echo Request can be sent.", "Первый пинг часто уходит в тайм-аут, когда перед отправкой ICMP Echo Request нужно разрешение адресов (ARP для IPv4, ND для IPv6)."),
        qx("Which ICMP message type is common to both ICMPv4 and ICMPv6?", "Time exceeded", [
          ["Neighbor Solicitation", "Neighbor Solicitation is one of the four new ICMPv6 Neighbor Discovery messages; ICMPv4 has no such message.", "Neighbor Solicitation — одно из четырёх новых сообщений Neighbor Discovery в ICMPv6; в ICMPv4 его нет."],
          ["Router Advertisement", "RA belongs to ICMPv6 Neighbor Discovery and is used for dynamic address allocation.", "RA относится к Neighbor Discovery в ICMPv6 и служит для динамической выдачи адресов."],
          ["Neighbor Advertisement", "NA is an ICMPv6-only message that answers an NS (DAD, address resolution).", "NA есть только в ICMPv6: это ответ на NS (DAD, разрешение адресов)."],
        ], "The messages common to ICMPv4 and ICMPv6 are host reachability (echo), destination or service unreachable, and time exceeded.", "Общие для ICMPv4 и ICMPv6 сообщения — host reachability (echo), destination or service unreachable и time exceeded."),
        qx("A host receives an ICMPv4 Destination Unreachable message with code 3. What does the code mean?", "Port unreachable", [
          ["Host unreachable", "Host unreachable is ICMPv4 code 1.", "Host unreachable — код 1 в ICMPv4."],
          ["Protocol unreachable", "Protocol unreachable is ICMPv4 code 2.", "Protocol unreachable — код 2 в ICMPv4."],
          ["Address unreachable", "Address unreachable is code 3 in ICMPv6, not in ICMPv4.", "Address unreachable — это код 3 в ICMPv6, а не в ICMPv4."],
        ], "ICMPv4 Destination Unreachable codes: 0 net, 1 host, 2 protocol, 3 port unreachable.", "Коды Destination Unreachable в ICMPv4: 0 — сеть, 1 — узел, 2 — протокол, 3 — порт недоступен."),
        tfx("In traceroute output, an asterisk (*) proves that the router at that hop has failed.", false,
          "False. An asterisk marks a lost or unreplied packet; the router may simply be configured not to reply, or ICMP may be filtered, while it still forwards traffic.",
          "Неверно. Звёздочка отмечает потерянный или оставшийся без ответа пакет; маршрутизатор может быть просто настроен не отвечать или ICMP фильтруется, а трафик он при этом пересылает.",
          "Answering True ignores the slide note: traceroute may indicate that a router is configured not to reply.",
          "Ответ «верно» игнорирует пометку слайда: traceroute может показывать, что маршрутизатор настроен не отвечать."),
        qx("Which IPv6 header field does a router check to decide that a packet has expired and that an ICMPv6 Time Exceeded message must be sent?", "Hop Limit", [
          ["Time to Live (TTL)", "TTL is the IPv4 field; IPv6 replaced it with Hop Limit.", "TTL — поле IPv4; в IPv6 его заменило поле Hop Limit."],
          ["Flow Label", "The Flow Label marks the packets of one flow for the same handling; it does not count hops.", "Flow Label помечает пакеты одного потока для одинаковой обработки; переходы оно не считает."],
          ["Traffic Class", "Traffic Class carries the QoS marking, like the IPv4 DS field.", "Traffic Class несёт метку QoS, как поле DS в IPv4."],
        ], "Instead of the IPv4 TTL field, ICMPv6 uses the IPv6 Hop Limit field to determine whether the packet has expired.", "Вместо поля TTL из IPv4 ICMPv6 смотрит на поле Hop Limit в IPv6, чтобы решить, истёк ли срок жизни пакета."),
        qx("Which pair of ICMPv6 messages is used for duplicate address detection and address resolution?", "NS and NA", [
          ["RS and RA", "RS and RA run between a router and a device, for dynamic address allocation.", "RS и RA ходят между маршрутизатором и устройством и нужны для динамической выдачи адресов."],
          ["Echo Request and Echo Reply", "Echo messages test host reachability (ping); they do not resolve addresses.", "Сообщения Echo проверяют доступность узла (ping); адреса они не разрешают."],
          ["ARP request and ARP reply", "ARP is used with IPv4 only; IPv6 replaced it with NS and NA.", "ARP работает только с IPv4; в IPv6 его заменили NS и NA."],
        ], "Neighbor Solicitation and Neighbor Advertisement are the messages between IPv6 devices: they perform DAD and address resolution.", "Neighbor Solicitation и Neighbor Advertisement — сообщения между устройствами IPv6: они выполняют DAD и разрешение адресов."),
        qx("During DAD, PC1 sends an NS with its new address as the target and receives no reply. What does PC1 conclude?", "The address is unique and can be used", [
          ["The router is down and the address must be dropped", "DAD checks other devices on the link, not the router; silence is the expected result.", "DAD проверяет другие устройства в канале, а не маршрутизатор; тишина — ожидаемый результат."],
          ["Another device on the link already uses the address", "A device that already used the address would answer with an NA.", "Устройство, у которого уже есть этот адрес, ответило бы сообщением NA."],
          ["It must request a new address from a DHCPv6 server", "A new address is needed only when DAD finds a duplicate, which did not happen.", "Новый адрес нужен, только если DAD нашёл дубликат, а этого не случилось."],
        ], "If another device had the address, it would respond with an NA saying the address is in use. No NA means the address is unique.", "Если бы адрес был у другого устройства, оно ответило бы NA о том, что адрес занят. Нет NA — адрес уникален."),
        qx("A technician pings ::1 on a PC and gets replies. What does this verify?", "IPv6 is properly installed on the PC", [
          ["The default gateway is reachable", "Pinging the gateway is the next step; a packet to ::1 never leaves the PC.", "Пинг шлюза — следующий шаг; пакет на ::1 вообще не покидает ПК."],
          ["The PC can reach remote networks", "Remote reachability needs a ping to a host on another network.", "Чтобы проверить удалённые сети, нужен пинг хоста в другой сети."],
          ["The network cable is plugged into the switch", "The loopback test does not use the NIC or the cable at all.", "Проверка loopback вообще не задействует сетевую карту и кабель."],
        ], "A response from 127.0.0.1 for IPv4, or ::1 for IPv6, indicates that IP is properly installed on the host.", "Ответ от 127.0.0.1 в IPv4 или от ::1 в IPv6 показывает, что IP правильно установлен на хосте."),
        qx("A ping to the default gateway gets no reply. According to the lecture, what should the technician try next?", "Ping another working host on the LAN", [
          ["Ping a host on a remote network instead", "If even the gateway does not answer, a remote host cannot be reached through it; that test comes last.", "Если не отвечает даже шлюз, удалённый хост через него не достать; этот тест идёт последним."],
          ["Run traceroute to a server on the internet", "Traceroute needs the gateway to forward its probes; it will stop at the first hop.", "Traceroute нужен шлюз, чтобы пересылать пробы; он остановится на первом же переходе."],
          ["Reinstall TCP/IP and ping ::1 again", "Nothing points to the local stack yet; the loopback test comes first, before the gateway.", "Пока ничто не указывает на локальный стек; проверку loopback делают первой, ещё до шлюза."],
        ], "If the default gateway address does not respond, a ping can be sent to the IP address of another host on the local network that is known to be operational.", "Если шлюз по умолчанию не отвечает, можно пропинговать IP-адрес другого хоста локальной сети, про который известно, что он работает."),
        qx("How does traceroute discover the address of each router along the path?", "It sends probes with TTL 1, 2, 3… and records each Time Exceeded reply", [
          ["It asks every router on the path to send a copy of its routing table", "Traceroute never reads routing tables; it learns each hop from the source address of an ICMP reply.", "Traceroute не читает таблицы маршрутизации; каждый переход он узнаёт по адресу источника ответа ICMP."],
          ["Each router adds its address to the Echo Reply","IP packets do not collect router addresses; the Echo Reply carries only the destination's address.", "IP-пакеты не собирают адреса маршрутизаторов; в Echo Reply есть только адрес назначения."],
          ["It sends one ping and reads the TTL left in the reply","One probe could at best give a hop count, never the addresses of the routers.", "Одна проба дала бы в лучшем случае число переходов, но не адреса маршрутизаторов."],
        ], "The first probe has TTL 1 and expires at the first router, which sends an ICMP Time Exceeded message; traceroute then increments the TTL (2, 3, 4…) until the destination or a predefined maximum is reached.", "Первая проба идёт с TTL 1 и истекает на первом маршрутизаторе, который шлёт ICMP Time Exceeded; затем traceroute увеличивает TTL (2, 3, 4…), пока не дойдёт до назначения или до заданного максимума."),
      ],
      deepL7P4,
    ),
  ],
};
