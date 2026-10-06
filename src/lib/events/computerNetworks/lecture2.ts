import { part, q, tf, type Lecture } from "../types";

export const lecture2: Lecture = {
  id: "cn-l2",
  title: { en: "Lecture 2 — Protocols and Models", ru: "Лекция 2 — Протоколы и модели" },
  parts: [
    part(
      "cn-l2-p1",
      { en: "The rules of communication and what protocols do", ru: "Правила общения и что делают протоколы" },
      {
        en: `## Three elements of communication
A connection is not enough — devices must agree on **how** to communicate. Every communication has:
- a **source** (sender);
- a **destination** (receiver);
- a **channel** (media) that provides the path.
All communications are governed by **protocols** — the rules that the communication follows.
## Establishing the rules
People use established rules to hold a conversation, and so do devices. Protocols must account for:
- an **identified sender and receiver**;
- a **common language and grammar**;
- the **speed and timing** of delivery;
- **confirmation or acknowledgment** requirements.
## What a protocol must define
- **Message encoding** — converting information into another acceptable form for transmission. **Decoding** reverses it.
- **Message formatting and encapsulation** — a message must use a specific format or structure, which depends on the message type and the channel.
- **Message size** — a long message is broken into pieces that meet the minimum and maximum size; each frame has its own addressing, and the receiver reconstructs the message.
- **Message timing** — flow control, response timeout and access method.
- **Message delivery options** — unicast, multicast, broadcast.
## Message timing
- **Flow control** — manages the rate of transmission: how much can be sent and how fast.
- **Response timeout** — how long a device waits when it hears no reply.
- **Access method** — determines when someone can send. A **collision** happens when more than one device sends at the same time and the messages become corrupt.
## Delivery options
- **Unicast** — one to one.
- **Multicast** — one to many (a group).
- **Broadcast** — one to all.
| Option | Who receives | Example |
|---|---|---|
| Unicast | one device | web page to one PC |
| Multicast | a group | video stream to subscribers |
| Broadcast | everyone on the network | ARP request |
## Types and functions of protocols
Protocol types: **network communications**, **network security** (authentication, integrity, encryption), **routing** (exchange route information and select the best path), **service discovery** (automatic detection of devices or services).
Protocol functions:
- **Addressing** — identifies sender and receiver.
- **Reliability** — provides guaranteed delivery.
- **Flow control** — data flows at an efficient rate.
- **Sequencing** — uniquely labels each transmitted segment.
- **Error detection** — determines whether data became corrupted.
- **Application interface** — process-to-process communication between applications.
## Protocols working together
- **HTTP** — governs how a web server and a web client interact.
- **TCP** — manages individual conversations, guarantees delivery, manages flow control.
- **IP** — delivers messages globally from the sender to the receiver.
- **Ethernet** — delivers messages from one NIC to another NIC on the same LAN.
> HTTP talks, TCP guarantees, IP finds the way across networks, Ethernet carries inside one LAN.
| Protocol | Job | Layer |
|---|---|---|
| HTTP | web client and server talk; defines content and format | application |
| TCP | conversations, guaranteed delivery, flow control | transport |
| IP | global delivery from sender to receiver | network / internet |
| Ethernet | NIC to NIC inside one LAN | data link |
?? Which protocol function makes sure that lost pieces are detected and resent?
?= Reliability — guaranteed delivery. Sequencing numbers the pieces; error detection finds corrupted ones.
?? A device waits for an answer and gives up after a while. Which message timing element is that?
?= Response timeout.`,
        ru: `## Три элемента общения
Одного соединения мало — устройства должны договориться, **как** общаться. В любом общении есть:
- **источник** (отправитель);
- **получатель**;
- **канал** (среда), по которому идёт сообщение.
Любое общение подчиняется **протоколам** — правилам, по которым оно идёт.
## Установление правил
Люди ведут разговор по принятым правилам — и устройства тоже. Протоколы должны учитывать:
- **определённых отправителя и получателя**;
- **общий язык и грамматику**;
- **скорость и время** доставки;
- требования к **подтверждению** получения.
## Что должен определять протокол
- **Кодирование сообщения** — преобразование информации в форму, пригодную для передачи. **Декодирование** — обратный процесс.
- **Формат и инкапсуляция** — у сообщения должен быть определённый формат, который зависит от типа сообщения и канала.
- **Размер сообщения** — длинное сообщение делится на части, укладывающиеся в минимальный и максимальный размер; у каждого кадра своя адресация, а получатель собирает сообщение обратно.
- **Синхронизация (timing)** — управление потоком, тайм-аут ответа и метод доступа.
- **Варианты доставки** — одноадресная, групповая, широковещательная.
## Синхронизация сообщений
- **Управление потоком** — регулирует скорость передачи: сколько можно отправить и как быстро.
- **Тайм-аут ответа** — сколько устройство ждёт, если ответа нет.
- **Метод доступа** — определяет, когда можно передавать. **Коллизия** возникает, когда несколько устройств передают одновременно и сообщения портятся.
## Варианты доставки
- **Unicast** — один одному.
- **Multicast** — один группе.
- **Broadcast** — один всем.
| Вариант | Кто получает | Пример |
|---|---|---|
| Unicast | одно устройство | веб-страница одному ПК |
| Multicast | группа | видеопоток подписчикам |
| Broadcast | все в сети | запрос ARP |
## Типы и функции протоколов
Типы протоколов: **сетевого взаимодействия**, **безопасности** (аутентификация, целостность, шифрование), **маршрутизации** (обмен маршрутами и выбор лучшего пути), **обнаружения сервисов** (автоматический поиск устройств и сервисов).
Функции протоколов:
- **Адресация** — определяет отправителя и получателя.
- **Надёжность** — гарантирует доставку.
- **Управление потоком** — данные идут с эффективной скоростью.
- **Упорядочивание (sequencing)** — нумерует каждый переданный сегмент.
- **Обнаружение ошибок** — определяет, не повредились ли данные.
- **Интерфейс приложений** — связь между процессами сетевых приложений.
## Протоколы работают вместе
- **HTTP** — определяет, как общаются веб-сервер и веб-клиент.
- **TCP** — ведёт отдельные диалоги, гарантирует доставку, управляет потоком.
- **IP** — доставляет сообщения глобально от отправителя к получателю.
- **Ethernet** — доставляет сообщения от одной сетевой карты к другой внутри одной LAN.
> HTTP разговаривает, TCP гарантирует, IP находит путь между сетями, Ethernet несёт внутри одной LAN.
| Протокол | Задача | Уровень |
|---|---|---|
| HTTP | общение веб-клиента и сервера; содержимое и формат | прикладной |
| TCP | диалоги, гарантированная доставка, управление потоком | транспортный |
| IP | глобальная доставка от отправителя к получателю | сетевой / интернет |
| Ethernet | от карты к карте внутри одной LAN | канальный |
?? Какая функция протокола гарантирует, что потерянные части заметят и отправят заново?
?= Надёжность — гарантированная доставка. Упорядочивание нумерует части; обнаружение ошибок находит повреждённые.
?? Устройство ждёт ответа и через какое-то время перестаёт. Какой это элемент синхронизации сообщений?
?= Тайм-аут ответа.`,
      },
      [
        q("Which three elements are present in any communication?", "Source, destination and channel", ["Sender, router and switch", "Client, server and protocol", "Encoding, timing and size"], "Every communication has a sender, a receiver and a channel (media).", "В любом общении есть отправитель, получатель и канал (среда)."),
        q("What is the process of converting information into another acceptable form for transmission?", "Encoding", ["Encapsulation", "Segmenting", "Multiplexing"], "Encoding converts information for transmission; decoding reverses the process.", "Кодирование преобразует информацию для передачи; декодирование — обратный процесс."),
        q("Which message timing element defines how long a device waits for a reply?", "Response timeout", ["Flow control", "Access method", "Sequencing"], "Response timeout manages the wait when no reply is heard from the destination.", "Тайм-аут ответа определяет, сколько ждать, если получатель молчит."),
        q("Which message timing element manages the rate of data transmission?", "Flow control", ["Response timeout", "Access method", "Error detection"], "Flow control defines how much information can be sent and at what speed.", "Управление потоком определяет, сколько информации можно отправить и с какой скоростью."),
        q("Which delivery option sends a message to all devices on the network?", "Broadcast", ["Unicast", "Multicast", "Anycast"], "Broadcast is one-to-all, multicast is one-to-many, unicast is one-to-one.", "Broadcast — всем, multicast — группе, unicast — одному."),
        q("Which protocol function uniquely labels each transmitted segment of data?", "Sequencing", ["Addressing", "Reliability", "Flow control"], "Sequencing numbers the segments so that they can be reassembled.", "Упорядочивание нумерует сегменты, чтобы их можно было собрать обратно."),
        q("Which protocol delivers messages from one NIC to another NIC on the same LAN?", "Ethernet", ["IP", "TCP", "HTTP"], "Ethernet delivers within one LAN; IP delivers globally between networks.", "Ethernet доставляет внутри одной LAN; IP — глобально между сетями."),
        q("Which protocol manages individual conversations and provides guaranteed delivery?", "TCP", ["IP", "Ethernet", "HTTP"], "TCP manages conversations, guarantees delivery and manages flow control.", "TCP ведёт диалоги, гарантирует доставку и управляет потоком."),
        q("Which type of protocol lets routers exchange path information and select the best path?", "Routing protocol", ["Service discovery protocol", "Network security protocol", "Application protocol"], "Routing protocols exchange route information and compare paths.", "Протоколы маршрутизации обмениваются маршрутами и сравнивают пути."),
        tf("A collision happens when more than one device sends traffic at the same time and the messages become corrupt.", true, "The access method exists to prevent collisions or recover from them.", "Метод доступа нужен, чтобы предотвращать коллизии или восстанавливаться после них."),
      ],
    ),
    part(
      "cn-l2-p2",
      { en: "Protocol suites and standards organizations", ru: "Наборы протоколов и организации по стандартизации" },
      {
        en: `## Protocol suites
A **protocol suite** is a group of inter-related protocols needed to perform a communication function. The protocols are viewed as layers: lower layers move the data and serve the upper layers.
- **Internet Protocol Suite (TCP/IP)** — the most common suite, maintained by the **IETF**.
- **OSI protocols** — developed by the **ISO** and the **ITU**.
- **AppleTalk** — proprietary, released by Apple.
- **Novell NetWare** — proprietary, developed by Novell.
## TCP/IP
TCP/IP is the suite used by the internet. It is:
- an **open standard** — freely available to the public and usable by any vendor;
- a **standards-based** suite — endorsed by the industry and approved by a standards organization to ensure **interoperability**.
TCP/IP protocols operate at the **application, transport and internet** layers. The most common **network access** layer LAN protocols are **Ethernet** and **WLAN**.
## Open standards
Open standards encourage **interoperability, competition and innovation**. Standards organizations are **vendor-neutral, non-profit** organizations.
## Internet standards
- **ISOC** (Internet Society) — promotes the open development and evolution of the internet.
- **IAB** (Internet Architecture Board) — responsible for the management and development of internet standards.
- **IETF** (Internet Engineering Task Force) — develops, updates and maintains internet and TCP/IP technologies.
- **IRTF** (Internet Research Task Force) — long-term research.
- **ICANN** — coordinates IP address allocation, management of domain names and other assignments.
- **IANA** — oversees and manages IP address allocation, domain names and protocol identifiers **for ICANN**.
## Electronic and communications standards
- **IEEE** ("I-triple-E") — standards in power and energy, healthcare, telecommunications and **networking** (802.3 Ethernet, 802.11 Wi-Fi).
- **EIA** — electrical wiring, connectors and the **19-inch racks** for network equipment.
- **TIA** — radio equipment, cellular towers, VoIP devices, satellite communications.
- **ITU-T** — video compression, IPTV and broadband such as **DSL**.
| Organization | Remember it by |
|---|---|
| IETF | TCP/IP and internet technologies, RFC documents |
| IAB | management and development of internet standards |
| IRTF | long-term research |
| ISOC | promotes the open internet |
| ICANN / IANA | IP addresses, domain names, protocol numbers |
| IEEE | 802.3 Ethernet, 802.11 Wi-Fi, OUI for MAC addresses |
| EIA | wiring, connectors, 19-inch racks |
| TIA | radio, cellular, VoIP, satellite |
| ITU-T | video compression, IPTV, DSL |
?? Which organization would publish a new version of the Wi-Fi standard?
?= IEEE — Wi-Fi is IEEE 802.11.
?? Who manages the allocation of IP addresses on behalf of ICANN?
?= IANA.
> IETF builds TCP/IP, ICANN and IANA hand out addresses and names, IEEE defines Ethernet and Wi-Fi, TIA/EIA define cabling.`,
        ru: `## Наборы протоколов
**Набор (стек) протоколов** — группа взаимосвязанных протоколов, нужных для выполнения функции связи. Протоколы рассматривают как уровни: нижние перемещают данные и обслуживают верхние.
- **Набор протоколов интернета (TCP/IP)** — самый распространённый, поддерживается **IETF**.
- **Протоколы OSI** — разработаны **ISO** и **ITU**.
- **AppleTalk** — закрытый набор Apple.
- **Novell NetWare** — закрытый набор Novell.
## TCP/IP
TCP/IP — набор протоколов интернета. Это:
- **открытый стандарт** — доступен всем бесплатно и может использоваться любым производителем;
- набор, **основанный на стандартах** — принят отраслью и утверждён организацией по стандартизации ради **совместимости**.
Протоколы TCP/IP работают на уровнях **приложений, транспортном и интернет**. Самые распространённые протоколы уровня **сетевого доступа** в LAN — **Ethernet** и **WLAN**.
## Открытые стандарты
Открытые стандарты поощряют **совместимость, конкуренцию и инновации**. Организации по стандартизации — **независимые от производителей, некоммерческие**.
## Стандарты интернета
- **ISOC** (Общество интернета) — продвигает открытое развитие интернета.
- **IAB** (Совет по архитектуре интернета) — отвечает за управление стандартами интернета и их развитие.
- **IETF** (Инженерный совет интернета) — разрабатывает, обновляет и поддерживает технологии интернета и TCP/IP.
- **IRTF** (Исследовательская группа интернета) — долгосрочные исследования.
- **ICANN** — координирует распределение IP-адресов, управление доменными именами и другие назначения.
- **IANA** — ведёт распределение IP-адресов, доменных имён и идентификаторов протоколов **для ICANN**.
## Стандарты электроники и связи
- **IEEE** («ай-трипл-и») — стандарты в энергетике, здравоохранении, телекоммуникациях и **сетях** (802.3 Ethernet, 802.11 Wi-Fi).
- **EIA** — электропроводка, разъёмы и **19-дюймовые стойки** для сетевого оборудования.
- **TIA** — радиооборудование, вышки сотовой связи, устройства VoIP, спутниковая связь.
- **ITU-T** — сжатие видео, IPTV и широкополосный доступ, например **DSL**.
| Организация | Как запомнить |
|---|---|
| IETF | TCP/IP и технологии интернета, документы RFC |
| IAB | управление стандартами интернета и их развитие |
| IRTF | долгосрочные исследования |
| ISOC | продвигает открытый интернет |
| ICANN / IANA | IP-адреса, доменные имена, номера протоколов |
| IEEE | 802.3 Ethernet, 802.11 Wi-Fi, OUI для MAC-адресов |
| EIA | проводка, разъёмы, 19-дюймовые стойки |
| TIA | радио, сотовая связь, VoIP, спутники |
| ITU-T | сжатие видео, IPTV, DSL |
?? Какая организация выпустит новую версию стандарта Wi-Fi?
?= IEEE — Wi-Fi это IEEE 802.11.
?? Кто ведёт распределение IP-адресов от имени ICANN?
?= IANA.
> IETF создаёт TCP/IP, ICANN и IANA раздают адреса и имена, IEEE определяет Ethernet и Wi-Fi, TIA/EIA — кабельные системы.`,
      },
      [
        q("Which organization maintains the TCP/IP protocol suite?", "IETF", ["IEEE", "ISO", "TIA"], "The Internet Engineering Task Force develops, updates and maintains internet and TCP/IP technologies.", "IETF разрабатывает, обновляет и поддерживает технологии интернета и TCP/IP."),
        q("Which organization developed the OSI protocols together with the ITU?", "ISO", ["IETF", "IANA", "EIA"], "The OSI protocols came from the International Organization for Standardization and the ITU.", "Протоколы OSI разработаны Международной организацией по стандартизации (ISO) и ITU."),
        q("Which organization coordinates IP address allocation and the management of domain names?", "ICANN", ["IRTF", "ISOC", "ITU-T"], "ICANN coordinates addresses and domain names; IANA manages them on its behalf.", "ICANN координирует адреса и доменные имена; IANA ведёт их от его имени."),
        q("Which organization creates networking standards such as 802.3 and 802.11?", "IEEE", ["IETF", "ICANN", "IAB"], "The IEEE publishes the 802 family: 802.3 Ethernet and 802.11 wireless LAN.", "IEEE выпускает семейство 802: 802.3 Ethernet и 802.11 беспроводные сети."),
        q("Which organization develops standards for electrical wiring, connectors and 19-inch racks?", "EIA", ["TIA", "IRTF", "ISOC"], "The Electronic Industries Alliance covers wiring, connectors and equipment racks.", "EIA отвечает за проводку, разъёмы и стойки для оборудования."),
        q("Which of these protocol suites is proprietary?", "AppleTalk", ["TCP/IP", "OSI", "Internet Protocol Suite"], "AppleTalk and Novell NetWare are proprietary; TCP/IP and OSI are open.", "AppleTalk и Novell NetWare — закрытые; TCP/IP и OSI — открытые."),
        q("What does it mean that TCP/IP is an open standard protocol suite?", "It is freely available and any vendor can use it", ["Its messages are sent without encryption", "It can be changed by any network user", "It works only on open-source systems"], "Open means freely available to the public and usable by any vendor.", "Открытый — значит доступен всем бесплатно и может использоваться любым производителем."),
        q("Which body focuses on long-term research related to internet and TCP/IP protocols?", "IRTF", ["IETF", "IANA", "TIA"], "The Internet Research Task Force does long-term research; the IETF does engineering.", "IRTF ведёт долгосрочные исследования; IETF — инженерную разработку."),
        tf("Standards organizations are usually vendor-neutral, non-profit organizations.", true, "They are established to develop and promote open standards.", "Они созданы, чтобы разрабатывать и продвигать открытые стандарты."),
        q("Which are the most common network access layer LAN protocols?", "Ethernet and WLAN", ["TCP and UDP", "HTTP and DNS", "IPv4 and IPv6"], "TCP/IP itself covers the application, transport and internet layers; Ethernet and WLAN sit below.", "Сам TCP/IP охватывает уровни приложений, транспортный и интернет; Ethernet и WLAN — ниже."),
      ],
    ),
    part(
      "cn-l2-p3",
      { en: "OSI and TCP/IP models, encapsulation and PDUs", ru: "Модели OSI и TCP/IP, инкапсуляция и PDU" },
      {
        en: `## Why layered models
A layered model makes a complex process easier to explain. Benefits:
- **assists protocol design** — a protocol at a layer has defined information and a defined interface to the layers above and below;
- **fosters competition** — products of different vendors work together;
- **prevents** changes in one layer from affecting the others;
- gives a **common language** to describe networking functions.
## The OSI reference model
- **7 Application** — protocols for process-to-process communications.
- **6 Presentation** — common representation of data: **formatting, compression, encryption**.
- **5 Session** — services to the presentation layer; manages data exchange (dialogs).
- **4 Transport** — segments, transfers and reassembles data. TCP and UDP live here.
- **3 Network** — exchanges individual pieces of data over the network: **logical addressing and routing**.
- **2 Data Link** — exchanges frames over a common media. MAC addresses and switches.
- **1 Physical** — activates, maintains and de-activates physical connections. Bits, cables, signals.
## The TCP/IP model
- **Application** — represents data to the user, plus encoding and dialog control (OSI 5, 6, 7).
- **Transport** — supports communication between devices across diverse networks (OSI 4).
- **Internet** — determines the best path through the network (OSI 3).
- **Network Access** — controls the hardware devices and media (OSI 1 and 2).
@diagram osi-tcpip
| OSI | Keyword | Device / protocol |
|---|---|---|
| 7 Application | process to process | HTTP, DNS, DHCP |
| 6 Presentation | format, compression, encryption | TLS, JPEG |
| 5 Session | dialogs | — |
| 4 Transport | segments, ports | TCP, UDP |
| 3 Network | logical address, routing | IP, router |
| 2 Data Link | frames, MAC | Ethernet, switch |
| 1 Physical | bits, signals | cables, hub |
## Segmenting, multiplexing, sequencing
**Segmenting** breaks a message into smaller units. **Multiplexing** interleaves several streams of segmented data. Benefits: **speed** (the link is not tied up) and **efficiency** (only failed segments are retransmitted). **Sequencing** numbers the segments for reassembly — **TCP** is responsible for it.
## Protocol data units
**Encapsulation** is the process where protocols add their information to the data; it goes **top down**. Each layer's PDU has its own name:
- Application — **Data**
- Transport — **Segment**
- Network (Internet) — **Packet**
- Data Link — **Frame**
- Physical — **Bits**
**De-encapsulation** goes up the stack: each layer strips its header and passes the rest up.
@diagram encapsulation
@demo encapsulation
## Example: a web page travels
A web server sends a page: the **HTTP data** gets a **TCP header** (segment), then an **IP header** (packet), then an **Ethernet header and trailer** (frame), and leaves as bits. The client receives the bits and removes the Ethernet, IP and TCP information in that order, until the browser gets the page.
> Down the stack: Data, Segment, Packet, Frame, Bits. Layer 3 = packet and routing, Layer 2 = frame and MAC.
?? A switch reads a frame header. Which OSI layer is it working at, and what is the PDU called?
?= Layer 2, data link. The PDU is a frame.
?? Which TCP/IP layer covers OSI layers 5, 6 and 7 together?
?= The application layer.`,
        ru: `## Зачем нужны уровневые модели
Уровневая модель упрощает объяснение сложного процесса. Преимущества:
- **помогает проектировать протоколы** — у протокола на уровне есть определённая информация и определённый интерфейс к соседним уровням;
- **поощряет конкуренцию** — продукты разных производителей работают вместе;
- **не даёт** изменениям на одном уровне затронуть остальные;
- даёт **общий язык** для описания сетевых функций.
## Эталонная модель OSI
- **7 Прикладной** — протоколы для связи между процессами.
- **6 Представления** — общее представление данных: **формат, сжатие, шифрование**.
- **5 Сеансовый** — обслуживает уровень представления; управляет обменом данными (диалогами).
- **4 Транспортный** — сегментирует, передаёт и собирает данные. Здесь TCP и UDP.
- **3 Сетевой** — обмен отдельными частями данных по сети: **логическая адресация и маршрутизация**.
- **2 Канальный** — обмен кадрами через общую среду. MAC-адреса и коммутаторы.
- **1 Физический** — включает, поддерживает и отключает физические соединения. Биты, кабели, сигналы.
## Модель TCP/IP
- **Приложений** — представляет данные пользователю, плюс кодирование и управление диалогом (OSI 5, 6, 7).
- **Транспортный** — поддерживает связь между устройствами через разные сети (OSI 4).
- **Интернет** — определяет лучший путь через сеть (OSI 3).
- **Сетевого доступа** — управляет оборудованием и средой передачи (OSI 1 и 2).
@diagram osi-tcpip
| OSI | Ключевое слово | Устройство / протокол |
|---|---|---|
| 7 Прикладной | процесс — процесс | HTTP, DNS, DHCP |
| 6 Представления | формат, сжатие, шифрование | TLS, JPEG |
| 5 Сеансовый | диалоги | — |
| 4 Транспортный | сегменты, порты | TCP, UDP |
| 3 Сетевой | логический адрес, маршрутизация | IP, маршрутизатор |
| 2 Канальный | кадры, MAC | Ethernet, коммутатор |
| 1 Физический | биты, сигналы | кабели, концентратор |
## Сегментация, мультиплексирование, упорядочивание
**Сегментация** делит сообщение на меньшие части. **Мультиплексирование** чередует несколько потоков сегментированных данных. Польза: **скорость** (канал не занят одним сообщением) и **эффективность** (повторно шлются только потерянные сегменты). **Упорядочивание** нумерует сегменты для сборки — за него отвечает **TCP**.
## Блоки данных протокола (PDU)
**Инкапсуляция** — процесс, при котором протоколы добавляют к данным свою информацию; идёт **сверху вниз**. У PDU каждого уровня своё имя:
- Прикладной — **Данные (Data)**
- Транспортный — **Сегмент (Segment)**
- Сетевой (Интернет) — **Пакет (Packet)**
- Канальный — **Кадр (Frame)**
- Физический — **Биты (Bits)**
**Деинкапсуляция** идёт вверх по стеку: каждый уровень снимает свой заголовок и передаёт остальное выше.
@diagram encapsulation
@demo encapsulation
## Пример: путь веб-страницы
Веб-сервер отправляет страницу: к **данным HTTP** добавляется **заголовок TCP** (сегмент), затем **заголовок IP** (пакет), затем **заголовок и концевик Ethernet** (кадр), и всё уходит битами. Клиент принимает биты и снимает информацию Ethernet, IP и TCP в этом порядке, пока браузер не получит страницу.
> Вниз по стеку: Data, Segment, Packet, Frame, Bits. Уровень 3 = пакет и маршрутизация, уровень 2 = кадр и MAC.
?? Коммутатор читает заголовок кадра. На каком уровне OSI он работает и как называется PDU?
?= Уровень 2, канальный. PDU — кадр.
?? Какой уровень TCP/IP объединяет уровни OSI 5, 6 и 7?
?= Уровень приложений.`,
      },
      [
        q("Which OSI layer performs logical addressing and routing?", "Layer 3 - Network", ["Layer 2 - Data Link", "Layer 4 - Transport", "Layer 7 - Application"], "The network layer exchanges pieces of data over the network using logical (IP) addresses.", "Сетевой уровень передаёт данные по сети, используя логические (IP) адреса."),
        q("What is the PDU name at Layer 2?", "Frame", ["Packet", "Segment", "Bit"], "Data link — frame, network — packet, transport — segment, physical — bits.", "Канальный — кадр, сетевой — пакет, транспортный — сегмент, физический — биты."),
        q("What is the PDU name at the transport layer?", "Segment", ["Frame", "Packet", "Data"], "The transport layer PDU is the segment.", "PDU транспортного уровня — сегмент."),
        q("Which OSI layer is responsible for data encryption, compression and formatting?", "Presentation (Layer 6)", ["Application (Layer 7)", "Session (Layer 5)", "Transport (Layer 4)"], "The presentation layer provides a common representation of the data.", "Уровень представления обеспечивает общее представление данных."),
        q("Which TCP/IP layer corresponds to OSI Layers 1 and 2?", "Network Access", ["Internet", "Transport", "Application"], "The OSI model splits the TCP/IP network access layer into physical and data link.", "Модель OSI делит уровень сетевого доступа TCP/IP на физический и канальный."),
        q("Which three OSI layers map to the TCP/IP application layer?", "Application, Presentation, Session", ["Session, Transport, Network", "Transport, Network, Data Link", "Presentation, Session, Transport"], "The TCP/IP application layer covers OSI layers 5, 6 and 7.", "Уровень приложений TCP/IP охватывает уровни OSI 5, 6 и 7."),
        q("What is the correct order of PDUs as data moves down the stack?", "Data, Segment, Packet, Frame, Bits", ["Data, Packet, Segment, Frame, Bits", "Bits, Frame, Packet, Segment, Data", "Data, Frame, Packet, Segment, Bits"], "Encapsulation is top down: data, segment, packet, frame, bits.", "Инкапсуляция идёт сверху вниз: данные, сегмент, пакет, кадр, биты."),
        q("Which TCP/IP layer determines the best path through the network?", "Internet", ["Transport", "Network Access", "Application"], "The internet layer matches the OSI network layer and selects the path.", "Уровень интернет соответствует сетевому уровню OSI и выбирает путь."),
        q("Which is a benefit of segmenting messages?", "Only failed segments need to be retransmitted", ["The message no longer needs addressing", "Every segment uses the same route", "Encryption becomes unnecessary"], "Segmenting increases speed and efficiency: only the lost segments are sent again.", "Сегментация повышает скорость и эффективность: повторно шлются только потерянные сегменты."),
        q("Which protocol is responsible for sequencing the individual segments?", "TCP", ["IP", "Ethernet", "HTTP"], "TCP numbers the segments so the message can be reassembled at the destination.", "TCP нумерует сегменты, чтобы сообщение можно было собрать у получателя."),
        tf("During de-encapsulation each layer adds its own header before passing the data up.", false, "On the way up each layer strips off its header; headers are added during encapsulation.", "При движении вверх каждый уровень снимает свой заголовок; заголовки добавляются при инкапсуляции."),
      ],
    ),
    part(
      "cn-l2-p4",
      { en: "Data access: IP addresses, MAC addresses and the default gateway", ru: "Доступ к данным: IP-адреса, MAC-адреса и шлюз по умолчанию" },
      {
        en: `## Two kinds of addresses
Both the network and the data link layers use addressing:
- **Network layer (Layer 3) addresses** deliver the IP packet from the **original source** to the **final destination**.
- **Data link layer (Layer 2) addresses** deliver the frame from one **NIC** to another NIC **on the same network**.
## The IP address
An IP packet contains a **source IP address** and a **destination IP address**. An IP address has two parts:
- **Network portion** (IPv4) or **prefix** (IPv6) — the left-most part; the same for every device in one LAN or WAN.
- **Host portion** (IPv4) or **interface ID** (IPv6) — the remaining part; unique for each device on the network.
Two devices are on the **same network** when the network portions match: PC1 192.168.1.110 and FTP server 192.168.1.9.
## Same network
The frame uses the actual **MAC address of the destination NIC**. MAC addresses are physically embedded in the Ethernet NIC and are **local** addresses.
## Remote network
When the network portions differ (PC1 192.168.1.x, web server 172.16.1.x), the devices are on different networks. Layer 3 gives Layer 2 the address of the **default gateway (DGW)** — the router interface IP address that is part of this LAN, the "door" to all remote networks.
- The frame from PC1 goes to the **MAC address of the default gateway**, not of the web server.
- Every device on the LAN must know the default gateway address, or its traffic stays inside the LAN.
## What changes hop by hop
Data link addressing is local, so there is a new source and destination MAC for **each link**:
- PC1 NIC to first router (DGW interface);
- first router exit interface to second router;
- second router exit interface to web server NIC.
The **packet is not modified**: the Layer 3 source and destination IP addresses **stay the same** from end to end, while the frame and its **MAC addresses change at every hop**.
@diagram address-journey
| Hop | Source MAC | Destination MAC | Source IP | Destination IP |
|---|---|---|---|---|
| PC1 → R1 | PC1 | R1 (gateway) | 192.168.1.110 | 172.16.1.99 |
| R1 → R2 | R1 exit interface | R2 | 192.168.1.110 | 172.16.1.99 |
| R2 → Web | R2 exit interface | Web server | 192.168.1.110 | 172.16.1.99 |
?? PC1 sends a packet to a server in another city. Whose MAC address is the destination in the first frame?
?= The default gateway's (router R1). The server's MAC is never used by PC1 — it is on a different network.
?? What stays the same across all hops, and what changes?
?= The IP addresses stay the same end to end; the frame with its MAC addresses is rebuilt on every link.
> IP = global, end to end, does not change. MAC = local, link by link, changes at every router.`,
        ru: `## Два вида адресов
Адресацию используют и сетевой, и канальный уровни:
- **Адреса сетевого уровня (уровень 3)** доставляют IP-пакет от **исходного отправителя** к **конечному получателю**.
- **Адреса канального уровня (уровень 2)** доставляют кадр от одной **сетевой карты** к другой **в пределах одной сети**.
## IP-адрес
В IP-пакете есть **IP-адрес источника** и **IP-адрес назначения**. IP-адрес состоит из двух частей:
- **Сетевая часть** (IPv4) или **префикс** (IPv6) — левая часть; одинаковая у всех устройств одной LAN или WAN.
- **Узловая часть** (IPv4) или **идентификатор интерфейса** (IPv6) — оставшаяся часть; уникальна для каждого устройства в сети.
Два устройства находятся в **одной сети**, если сетевые части совпадают: PC1 192.168.1.110 и FTP-сервер 192.168.1.9.
## Одна сеть
В кадре стоит настоящий **MAC-адрес сетевой карты получателя**. MAC-адреса физически вшиты в сетевую карту Ethernet и являются **локальными** адресами.
## Удалённая сеть
Если сетевые части разные (PC1 192.168.1.x, веб-сервер 172.16.1.x), устройства в разных сетях. Уровень 3 передаёт уровню 2 адрес **шлюза по умолчанию (DGW)** — IP-адрес интерфейса маршрутизатора в этой LAN, «дверь» во все удалённые сети.
- Кадр от PC1 идёт на **MAC-адрес шлюза по умолчанию**, а не веб-сервера.
- Каждое устройство в LAN должно знать адрес шлюза, иначе его трафик не выйдет за пределы LAN.
## Что меняется от узла к узлу
Канальная адресация локальна, поэтому на **каждом участке** свои MAC-адреса источника и назначения:
- сетевая карта PC1 — первый маршрутизатор (интерфейс шлюза);
- выходной интерфейс первого маршрутизатора — второй маршрутизатор;
- выходной интерфейс второго маршрутизатора — сетевая карта веб-сервера.
**Пакет не изменяется**: IP-адреса источника и назначения уровня 3 **остаются теми же** от начала до конца, а кадр и его **MAC-адреса меняются на каждом переходе**.
@diagram address-journey
| Участок | MAC источника | MAC назначения | IP источника | IP назначения |
|---|---|---|---|---|
| PC1 → R1 | PC1 | R1 (шлюз) | 192.168.1.110 | 172.16.1.99 |
| R1 → R2 | выходной интерфейс R1 | R2 | 192.168.1.110 | 172.16.1.99 |
| R2 → Web | выходной интерфейс R2 | веб-сервер | 192.168.1.110 | 172.16.1.99 |
?? PC1 отправляет пакет серверу в другом городе. Чей MAC-адрес стоит в назначении первого кадра?
?= Шлюза по умолчанию (маршрутизатора R1). MAC сервера PC1 никогда не использует — тот в другой сети.
?? Что остаётся одинаковым на всех участках, а что меняется?
?= IP-адреса одинаковы от начала до конца; кадр с MAC-адресами строится заново на каждом участке.
> IP = глобальный, от конца до конца, не меняется. MAC = локальный, от участка к участку, меняется на каждом маршрутизаторе.`,
      },
      [
        q("Which addresses deliver a packet from the original source to the final destination?", "Layer 3 IP addresses", ["Layer 2 MAC addresses", "Layer 4 port numbers", "Layer 1 bit patterns"], "Network layer addresses are global and identify the original source and final destination.", "Адреса сетевого уровня глобальны и указывают исходный источник и конечного получателя."),
        q("PC1 sends a packet to a web server on a remote network. Which destination MAC address is in the frame leaving PC1?", "The MAC of the default gateway", ["The MAC of the web server", "The broadcast MAC address", "The MAC of the nearest switch"], "The destination MAC is always on the same link as the source, so it is the router's (gateway's) MAC.", "MAC назначения всегда на том же участке, что и источник, — это MAC маршрутизатора (шлюза)."),
        q("As a packet crosses several routers, what happens to the addresses?", "MAC addresses change, IP addresses stay", ["IP addresses change, MAC addresses stay", "Both IP and MAC addresses change", "Neither IP nor MAC addresses change"], "The packet is not modified, but a new frame is built for every link.", "Пакет не изменяется, но для каждого участка строится новый кадр."),
        q("What is the default gateway?", "The router interface IP address on the local LAN", ["The IP address of the DNS server", "The MAC address of the nearest switch", "The first usable host address in the LAN"], "The default gateway is the router interface that is part of this LAN — the door to remote networks.", "Шлюз по умолчанию — интерфейс маршрутизатора в этой LAN, дверь в удалённые сети."),
        q("Which part of an IPv4 address is the same for all devices in one LAN?", "The network portion", ["The host portion", "The interface ID", "The last octet"], "The left-most network portion identifies the network group; the host portion is unique.", "Левая, сетевая часть определяет сеть; узловая часть уникальна."),
        q("PC1 is 192.168.1.110 and the FTP server is 192.168.1.9. Which statement is true?", "They are on the same network", ["They need a default gateway to talk", "They are on different networks", "They have the same host portion"], "The network portions (192.168.1) match, so the frame goes directly to the server's MAC.", "Сетевые части (192.168.1) совпадают, значит кадр идёт прямо на MAC сервера."),
        q("In IPv6, what is the equivalent of the IPv4 host portion called?", "Interface ID", ["Prefix", "Hextet", "Network ID"], "IPv6 uses a prefix for the network and an interface ID for the device.", "В IPv6 сеть задаёт префикс, а устройство — идентификатор интерфейса."),
        q("What happens if a host has no default gateway configured?", "Its traffic stays inside the local LAN", ["It cannot reach hosts in its own LAN", "Its MAC address stops working", "It receives a new IP address"], "Without the gateway address a host cannot send traffic to remote networks.", "Без адреса шлюза хост не может отправлять трафик в удалённые сети."),
        tf("A MAC address is used only for local delivery of a frame on the link.", true, "Layer 2 addresses are local and are replaced at every hop.", "Адреса уровня 2 локальны и заменяются на каждом переходе."),
        q("Where is a MAC address physically stored?", "It is embedded in the Ethernet NIC", ["It is assigned by the router", "It is stored on the DNS server", "It is typed in by the network user"], "MAC addresses are physically embedded into the NIC by the vendor.", "MAC-адреса физически вшиты в сетевую карту производителем."),
      ],
    ),
  ],
};
