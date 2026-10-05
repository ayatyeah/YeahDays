import { part, q, tf, type Lecture } from "../types";

export const lecture4: Lecture = {
  id: "cn-l4",
  title: { en: "Lecture 4 — Data Link Layer. Ethernet Switching", ru: "Лекция 4 — Канальный уровень. Коммутация Ethernet" },
  parts: [
    part(
      "cn-l4-p1",
      { en: "The data link layer, topologies and access control", ru: "Канальный уровень, топологии и управление доступом" },
      {
        en: `## Purpose of the data link layer
- Responsible for communication between end-device **network interface cards**.
- Lets upper-layer protocols access the physical media and **encapsulates Layer 3 packets into Layer 2 frames**.
- Performs **error detection** and rejects corrupt frames.
## Two sublayers
- **LLC (Logical Link Control), IEEE 802.2** — communicates between the networking software of the upper layers and the hardware; places information in the frame that identifies **which network layer protocol** is used.
- **MAC (Media Access Control), IEEE 802.3, 802.11, 802.15** — responsible for **data encapsulation** and **media access control**; provides data link layer **addressing**.
Data link protocols are defined by the **IEEE, ITU, ISO and ANSI**.
## Topologies
- **Physical topology** — the physical connections and how devices are interconnected.
- **Logical topology** — the virtual connections, using device interfaces and IP addressing schemes.
**WAN topologies:**
- **Point-to-point** — the simplest and most common; a permanent link between two endpoints. The two nodes do not share the media with other hosts, so point-to-point WAN protocols can be very simple.
- **Hub and spoke** — a central site connects branch sites through point-to-point links (like a star).
- **Mesh** — high availability, but every end system is connected to every other.
**LAN topologies:**
- **Star and extended star** — end devices connect to a **central device** (switch). Easy to install, very scalable, easy to troubleshoot.
- **Bus** — all end systems chained together and terminated on each end (early Ethernet).
- **Ring** — each end system connects to its neighbors to form a ring (legacy Token Ring).
## Half and full duplex
- **Half-duplex** — only one device can send or receive at a time. Used on **WLANs** and legacy bus topologies with **hubs**.
- **Full-duplex** — both devices transmit and receive simultaneously. **Ethernet switches** work in full-duplex.
## Access control methods
A **multiaccess network** can have two or more end devices trying to access the network at the same time.
- **Contention-based access** — all nodes compete for the medium in half-duplex:
- **CSMA/CD** (collision **detection**) — legacy bus-topology **Ethernet**. Devices detect the collision, wait a random time and retransmit.
- **CSMA/CA** (collision **avoidance**) — IEEE 802.11 **wireless LANs**. A device includes the time it needs, so others know how long the medium is busy.
- **Controlled access** — deterministic; each node has its own time on the medium. Legacy **Token Ring** and ARCNET.
> CD = wired half-duplex Ethernet, CA = Wi-Fi. A full-duplex switch port needs neither.`,
        ru: `## Назначение канального уровня
- Отвечает за связь между **сетевыми картами** конечных устройств.
- Даёт протоколам верхних уровней доступ к физической среде и **упаковывает пакеты уровня 3 в кадры уровня 2**.
- **Обнаруживает ошибки** и отбрасывает повреждённые кадры.
## Два подуровня
- **LLC (управление логическим каналом), IEEE 802.2** — связывает сетевое ПО верхних уровней с оборудованием; помещает в кадр сведения о том, **какой протокол сетевого уровня** используется.
- **MAC (управление доступом к среде), IEEE 802.3, 802.11, 802.15** — отвечает за **инкапсуляцию данных** и **управление доступом к среде**; даёт **адресацию** канального уровня.
Протоколы канального уровня определяют **IEEE, ITU, ISO и ANSI**.
## Топологии
- **Физическая топология** — физические соединения и то, как устройства связаны между собой.
- **Логическая топология** — виртуальные соединения, с интерфейсами устройств и схемой IP-адресации.
**Топологии WAN:**
- **Точка — точка** — самая простая и распространённая; постоянный канал между двумя конечными точками. Два узла не делят среду с другими хостами, поэтому протоколы WAN «точка — точка» могут быть очень простыми.
- **Звезда с центром (hub and spoke)** — центральный узел связан с филиалами каналами «точка — точка».
- **Полносвязная (mesh)** — высокая доступность, но каждая система соединена с каждой.
**Топологии LAN:**
- **Звезда и расширенная звезда** — конечные устройства подключены к **центральному устройству** (коммутатору). Легко монтировать, хорошо масштабируется, просто искать неисправности.
- **Шина** — все системы на одной линии с терминаторами на концах (ранний Ethernet).
- **Кольцо** — каждая система соединена с соседями, образуя кольцо (старый Token Ring).
## Полудуплекс и полный дуплекс
- **Полудуплекс** — в каждый момент передаёт или принимает только одно устройство. Применяется в **WLAN** и старых шинных сетях с **концентраторами**.
- **Полный дуплекс** — оба устройства передают и принимают одновременно. **Коммутаторы Ethernet** работают в полном дуплексе.
## Методы управления доступом
**Сеть множественного доступа** — та, где два и более устройств могут одновременно пытаться выйти в среду.
- **Состязательный доступ** — все узлы конкурируют за среду в полудуплексе:
- **CSMA/CD** (**обнаружение** коллизий) — старый шинный **Ethernet**. Устройства обнаруживают коллизию, ждут случайное время и передают снова.
- **CSMA/CA** (**предотвращение** коллизий) — **беспроводные сети** IEEE 802.11. Устройство сообщает, сколько времени ему нужно, и остальные знают, как долго среда занята.
- **Управляемый доступ** — детерминированный; у каждого узла своё время в среде. Старые **Token Ring** и ARCNET.
> CD = проводной полудуплексный Ethernet, CA = Wi-Fi. Порту коммутатора в полном дуплексе не нужно ни то, ни другое.`,
      },
      [
        q("Which media access mechanism manages collisions on half-duplex Ethernet?", "CSMA/CD", ["CSMA/CA", "Token Passing", "TDMA"], "Legacy half-duplex Ethernet uses carrier sense multiple access with collision detection.", "Старый полудуплексный Ethernet использует CSMA с обнаружением коллизий."),
        q("Which topology connects all nodes to a central switch?", "Star", ["Bus", "Ring", "Mesh"], "In a star topology end devices connect to a central device.", "В звезде конечные устройства подключены к центральному устройству."),
        q("Which access method is used by IEEE 802.11 wireless LANs?", "CSMA/CA", ["CSMA/CD", "Token passing", "Polling"], "WLANs use collision avoidance: a device announces how long it needs the medium.", "WLAN используют предотвращение коллизий: устройство сообщает, на сколько займёт среду."),
        q("Which sublayer of Layer 2 handles interface card hardware address management?", "Media Access Control (MAC)", ["Logical Link Control (LLC)", "Physical Layer Sublayer", "Network Interface Sublayer"], "The MAC sublayer provides data link addressing and media access control.", "Подуровень MAC даёт канальную адресацию и управление доступом к среде."),
        q("Which sublayer identifies the network layer protocol carried in the frame?", "LLC", ["MAC", "PHY", "FCS"], "The LLC sublayer (IEEE 802.2) places that information in the frame.", "Подуровень LLC (IEEE 802.2) помещает эти сведения в кадр."),
        q("Which WAN topology consists of a permanent link between two endpoints?", "Point-to-point", ["Hub and spoke", "Full mesh", "Extended star"], "Point-to-point is the simplest and most common WAN topology.", "«Точка — точка» — самая простая и распространённая топология WAN."),
        q("Which duplex mode do modern Ethernet switches use?", "Full-duplex", ["Half-duplex", "Simplex", "Token-based"], "Switches let both ends send and receive at the same time, so CSMA/CD is not needed.", "Коммутаторы дают обеим сторонам передавать и принимать одновременно, CSMA/CD не нужен."),
        q("What do devices do after detecting a collision under CSMA/CD?", "Wait a random time and retransmit", ["Switch to full-duplex mode", "Send a token to the next node", "Drop the frame permanently"], "After a collision each device backs off for a random period and tries again.", "После коллизии каждое устройство ждёт случайное время и пробует снова."),
        q("Which legacy technology used controlled (deterministic) access?", "Token Ring", ["Ethernet with hubs", "Wi-Fi", "Fast Ethernet"], "Token Ring and ARCNET gave each node its own time on the medium.", "Token Ring и ARCNET давали каждому узлу своё время в среде."),
        q("What does the data link layer do with Layer 3 packets?", "Encapsulates them into frames", ["Splits them into segments", "Routes them between networks", "Converts them into signals"], "Layer 2 puts a header and trailer around the packet to form a frame.", "Уровень 2 добавляет к пакету заголовок и концевик, получая кадр."),
        tf("In a mesh WAN topology every end system is connected to every other end system.", true, "Mesh gives high availability at the cost of many links.", "Полносвязная топология даёт высокую доступность ценой большого числа каналов."),
      ],
    ),
    part(
      "cn-l4-p2",
      { en: "The data link frame and Ethernet frame fields", ru: "Кадр канального уровня и поля кадра Ethernet" },
      {
        en: `## A frame has three parts
The data link layer wraps the packet with a **header** and a **trailer**:
- **Header**
- **Data** (the payload)
- **Trailer**
The fields vary by protocol. Generic frame fields:
- **Frame start and stop** — the beginning and end of the frame.
- **Addressing** — source and destination nodes.
- **Type** — identifies the encapsulated **Layer 3 protocol**.
- **Control** — flow control services.
- **Data** — the frame payload.
- **Error detection** — used to determine transmission errors.
## Layer 2 addresses
Also called **physical addresses**. They sit in the frame header, are used only for **local delivery** on the link and are **updated by each device that forwards the frame**.
## LAN and WAN frames
The logical topology and the physical media decide which protocol is used: **Ethernet, 802.11 wireless, PPP, HDLC, Frame Relay**.
## Ethernet
Ethernet works at the **data link and physical layers**. It is a family of technologies defined in **IEEE 802.2 and 802.3**.
## Ethernet frame fields
- **Preamble (7 bytes) and Start Frame Delimiter, SFD (1 byte)** — **synchronize** the receiver's clock and mark the **start of the frame**.
- **Destination MAC address** — 6 bytes.
- **Source MAC address** — 6 bytes.
- **Type / Length (EtherType)** — 2 bytes; identifies the upper-layer protocol. **0x0800 = IPv4**, 0x86DD = IPv6, 0x0806 = ARP.
- **Data** — **46 to 1500 bytes**. A shorter payload is **padded** to 46 bytes.
- **Frame Check Sequence (FCS)** — 4 bytes; a **CRC** used for **error detection**.
## Frame size
- Minimum frame size **64 bytes**, maximum **1518 bytes**. The preamble is **not** counted.
- A frame shorter than 64 bytes is a **collision fragment** or **runt frame** and is discarded.
- Frames with more than 1500 bytes of data are **jumbo** or baby giant frames.
- A frame that is too small or too large is dropped by the receiver.
= 64 bytes minimum = 6 + 6 + 2 + 46 + 4
> Payload 46–1500, whole frame 64–1518. FCS = CRC = error detection, never correction or encryption.`,
        ru: `## В кадре три части
Канальный уровень оборачивает пакет **заголовком** и **концевиком**:
- **Заголовок**
- **Данные** (полезная нагрузка)
- **Концевик (трейлер)**
Набор полей зависит от протокола. Общие поля кадра:
- **Начало и конец кадра** — границы кадра.
- **Адресация** — узлы источника и назначения.
- **Тип** — определяет вложенный **протокол уровня 3**.
- **Управление** — службы управления потоком.
- **Данные** — полезная нагрузка кадра.
- **Обнаружение ошибок** — служит для выявления ошибок передачи.
## Адреса уровня 2
Их называют **физическими адресами**. Они находятся в заголовке кадра, нужны только для **локальной доставки** на участке и **обновляются каждым устройством, пересылающим кадр**.
## Кадры LAN и WAN
Какой протокол используется, определяют логическая топология и среда: **Ethernet, беспроводной 802.11, PPP, HDLC, Frame Relay**.
## Ethernet
Ethernet работает на **канальном и физическом уровнях**. Это семейство технологий, описанных в **IEEE 802.2 и 802.3**.
## Поля кадра Ethernet
- **Преамбула (7 байт) и начальный ограничитель кадра, SFD (1 байт)** — **синхронизируют** часы приёмника и отмечают **начало кадра**.
- **MAC-адрес назначения** — 6 байт.
- **MAC-адрес источника** — 6 байт.
- **Тип / длина (EtherType)** — 2 байта; определяет протокол верхнего уровня. **0x0800 = IPv4**, 0x86DD = IPv6, 0x0806 = ARP.
- **Данные** — **от 46 до 1500 байт**. Более короткая нагрузка **дополняется** до 46 байт.
- **Контрольная последовательность кадра (FCS)** — 4 байта; **CRC** для **обнаружения ошибок**.
## Размер кадра
- Минимальный размер кадра **64 байта**, максимальный **1518 байт**. Преамбула **не** учитывается.
- Кадр короче 64 байт — **фрагмент коллизии** или **runt-кадр**, он отбрасывается.
- Кадры с данными больше 1500 байт — **jumbo** или baby giant.
- Слишком маленький или слишком большой кадр приёмник отбрасывает.
= 64 bytes minimum = 6 + 6 + 2 + 46 + 4
> Нагрузка 46–1500, весь кадр 64–1518. FCS = CRC = обнаружение ошибок, но не исправление и не шифрование.`,
      },
      [
        q("What is the purpose of the FCS field in an Ethernet frame?", "CRC error detection", ["IP addressing", "Data encryption", "Speed autonegotiation"], "The frame check sequence carries a CRC used to detect transmission errors.", "Контрольная последовательность кадра содержит CRC для обнаружения ошибок передачи."),
        q("Which field in an IEEE 802.3 Ethernet frame header synchronizes receiver clocks and indicates frame start?", "Preamble and SFD", ["Destination MAC Address", "EtherType Field", "FCS"], "The 7-byte preamble and the 1-byte start frame delimiter synchronize the receiver.", "7 байт преамбулы и 1 байт начального ограничителя синхронизируют приёмник."),
        q("What is the minimum payload size for an Ethernet frame to avoid padding?", "46 bytes", ["64 bytes", "1500 bytes", "1518 bytes"], "The data field is 46 to 1500 bytes; 64 bytes is the minimum size of the whole frame.", "Поле данных — от 46 до 1500 байт; 64 байта — минимум для всего кадра."),
        q("What protocol is encapsulated when EtherType equals 0x0800?", "IPv4", ["IPv6", "ARP", "ICMP"], "0x0800 is IPv4, 0x86DD is IPv6 and 0x0806 is ARP.", "0x0800 — IPv4, 0x86DD — IPv6, 0x0806 — ARP."),
        q("What is the minimum size of an Ethernet frame?", "64 bytes", ["46 bytes", "128 bytes", "1500 bytes"], "Minimum 64 bytes, maximum 1518 bytes; the preamble is not counted.", "Минимум 64 байта, максимум 1518; преамбула не учитывается."),
        q("What is the maximum size of a standard Ethernet frame?", "1518 bytes", ["1500 bytes", "1024 bytes", "9000 bytes"], "1500 bytes of data plus 18 bytes of header and trailer.", "1500 байт данных плюс 18 байт заголовка и концевика."),
        q("What is a frame shorter than 64 bytes called?", "Runt frame", ["Jumbo frame", "Baby giant frame", "Broadcast frame"], "A runt or collision fragment is discarded automatically.", "Runt-кадр, или фрагмент коллизии, отбрасывается автоматически."),
        q("Which three parts make up a data link frame?", "Header, data, trailer", ["Preamble, packet, port", "Source, channel, receiver", "Segment, packet, bits"], "The packet is wrapped with a header in front and a trailer behind.", "Пакет оборачивается заголовком спереди и концевиком сзади."),
        q("Which IEEE standards define Ethernet?", "802.2 and 802.3", ["802.11 and 802.15", "802.1Q and 802.16", "802.5 and 802.4"], "Ethernet is defined in IEEE 802.2 (LLC) and 802.3 (MAC and physical).", "Ethernet описан в IEEE 802.2 (LLC) и 802.3 (MAC и физический уровень)."),
        q("What does the Type field of a frame identify?", "The encapsulated Layer 3 protocol", ["The speed of the outgoing link", "The vendor of the network card", "The length of the preamble"], "Type (EtherType) tells the receiver which upper-layer protocol is inside.", "Тип (EtherType) сообщает приёмнику, какой протокол верхнего уровня внутри."),
        tf("The preamble is included when the size of an Ethernet frame is described.", false, "The 64–1518 byte sizes do not count the preamble.", "Размеры 64–1518 байт указаны без преамбулы."),
      ],
    ),
    part(
      "cn-l4-p3",
      { en: "Ethernet MAC addresses: unicast, broadcast, multicast", ru: "MAC-адреса Ethernet: unicast, broadcast, multicast" },
      {
        en: `## The MAC address
- A **48-bit** value written as **12 hexadecimal digits** — that is **6 bytes**.
- Hex values can be written with **0x** in front (0x73) or with an **H** after (73H). Leading zeroes are kept: binary 0000 1010 is **0A**.
- Every MAC address must be unique. A vendor registers with the **IEEE** and receives a 24-bit (3-byte, 6 hex digits) **Organizationally Unique Identifier (OUI)**.
= 00:1A:2B : 3C:4D:5E
= OUI (vendor)  : vendor-assigned value
The **first 3 bytes** are the OUI; the **last 3 bytes** are assigned by the vendor.
## Frame processing
- The Ethernet header carries a **source MAC** and a **destination MAC**.
- A NIC compares the destination MAC with its own address stored in **RAM**. **No match — the frame is discarded.** A match — the frame goes up the layers for de-encapsulation.
- A NIC also accepts a frame addressed to the **broadcast** address or to a **multicast group** it belongs to.
## Unicast
A **unicast MAC** is the unique address used when a frame goes from one device to one device.
- A host finds the destination MAC for an **IPv4** address with **ARP** (Address Resolution Protocol).
- For an **IPv6** address it uses **ND** (Neighbor Discovery).
- The **source MAC is always a unicast**.
## Broadcast
- Destination MAC **FF-FF-FF-FF-FF-FF** (48 ones in binary).
- Received and processed by **every device** on the Ethernet LAN.
- **Flooded out all switch ports except the incoming port.** **Not forwarded by a router.**
- An IPv4 broadcast packet has all ones in the host portion; the local (limited) IPv4 broadcast address is **255.255.255.255**.
## Multicast
- Received and processed by a **group** of devices.
- Destination MAC starts with **01-00-5E** for IPv4 multicast and **33-33** for IPv6 multicast.
- Flooded out all ports except the incoming one unless the switch uses **multicast snooping**; not forwarded by a router unless it is configured to route multicast.
- A multicast address can only be a **destination**, never a source.
> 48 bits = 12 hex digits = 6 bytes. First half — who made it (OUI), second half — which card.`,
        ru: `## MAC-адрес
- **48-битное** значение, записанное **12 шестнадцатеричными цифрами** — это **6 байт**.
- Шестнадцатеричные значения пишут с **0x** впереди (0x73) или с **H** после (73H). Ведущие нули сохраняются: двоичное 0000 1010 — это **0A**.
- Каждый MAC-адрес должен быть уникальным. Производитель регистрируется в **IEEE** и получает 24-битный (3 байта, 6 шестнадцатеричных цифр) **уникальный идентификатор организации (OUI)**.
= 00:1A:2B : 3C:4D:5E
= OUI (vendor)  : vendor-assigned value
**Первые 3 байта** — OUI; **последние 3 байта** назначает производитель.
## Обработка кадра
- В заголовке Ethernet есть **MAC источника** и **MAC назначения**.
- Сетевая карта сравнивает MAC назначения со своим адресом, хранящимся в **RAM**. **Не совпал — кадр отбрасывается.** Совпал — кадр идёт вверх по уровням на деинкапсуляцию.
- Карта также принимает кадр с **широковещательным** адресом или адресом **группы multicast**, в которую входит.
## Unicast
**Одноадресный MAC** — уникальный адрес, когда кадр идёт от одного устройства одному устройству.
- MAC назначения для адреса **IPv4** хост находит через **ARP** (протокол разрешения адресов).
- Для адреса **IPv6** — через **ND** (обнаружение соседей).
- **MAC источника — всегда одноадресный**.
## Broadcast
- MAC назначения **FF-FF-FF-FF-FF-FF** (48 единиц в двоичном виде).
- Принимается и обрабатывается **каждым устройством** в Ethernet LAN.
- **Рассылается во все порты коммутатора, кроме входящего.** **Маршрутизатор его не пересылает.**
- У широковещательного пакета IPv4 в узловой части все единицы; локальный (ограниченный) широковещательный адрес IPv4 — **255.255.255.255**.
## Multicast
- Принимается и обрабатывается **группой** устройств.
- MAC назначения начинается с **01-00-5E** для multicast IPv4 и с **33-33** для multicast IPv6.
- Рассылается во все порты, кроме входящего, если на коммутаторе нет **multicast snooping**; маршрутизатор не пересылает, если не настроен маршрутизировать multicast.
- Групповой адрес может быть только **адресом назначения**, но не источника.
> 48 бит = 12 шестнадцатеричных цифр = 6 байт. Первая половина — кто сделал (OUI), вторая — какая именно карта.`,
      },
      [
        q("In MAC address 00:1A:2B:3C:4D:5E, which part is the OUI?", "First 3 bytes (00:1A:2B)", ["Last 3 bytes (3C:4D:5E)", "Entire 48 bits", "First byte (00)"], "The organizationally unique identifier is the first 24 bits assigned to the vendor by the IEEE.", "Уникальный идентификатор организации — первые 24 бита, выданные производителю IEEE."),
        q("What is the primary function of ARP?", "Map a known IPv4 address to a MAC address", ["Map IP address to domain name", "Assign IP addresses dynamically", "Route packets between VLANs"], "ARP finds the destination MAC address that belongs to a known IPv4 address.", "ARP находит MAC-адрес назначения по известному адресу IPv4."),
        q("What is the local IPv4 broadcast address?", "255.255.255.255", ["127.0.0.1", "224.0.0.1", "0.0.0.0"], "All ones is the limited broadcast; 127.0.0.1 is loopback and 224.0.0.1 is multicast.", "Все единицы — ограниченный broadcast; 127.0.0.1 — loopback, 224.0.0.1 — multicast."),
        q("How long is an Ethernet MAC address?", "48 bits", ["32 bits", "64 bits", "128 bits"], "48 bits, written as 12 hexadecimal digits, or 6 bytes.", "48 бит, записанных 12 шестнадцатеричными цифрами, то есть 6 байт."),
        q("What is the Ethernet broadcast MAC address?", "FF-FF-FF-FF-FF-FF", ["00-00-00-00-00-00", "01-00-5E-00-00-01", "33-33-00-00-00-01"], "The broadcast address is 48 ones in binary.", "Широковещательный адрес — 48 единиц в двоичном виде."),
        q("What does a NIC do when the destination MAC of a unicast frame does not match its own address?", "It discards the frame", ["It forwards the frame to the router", "It floods the frame to all hosts", "It replies with an ARP request"], "Without a match (and if it is not broadcast or its multicast group) the NIC drops the frame.", "Если совпадения нет (и это не broadcast и не его группа), карта отбрасывает кадр."),
        q("With which prefix does a destination MAC address start for an IPv4 multicast packet?", "01-00-5E", ["33-33", "FF-FF-FF", "00-1A-2B"], "01-00-5E is IPv4 multicast; 33-33 is IPv6 multicast.", "01-00-5E — multicast IPv4; 33-33 — multicast IPv6."),
        q("Which protocol finds the destination MAC address for an IPv6 address?", "Neighbor Discovery", ["ARP", "DHCP", "DNS"], "IPv4 uses ARP; IPv6 uses Neighbor Discovery (ND).", "В IPv4 используется ARP; в IPv6 — Neighbor Discovery (ND)."),
        q("What does a router do with an Ethernet broadcast frame?", "It does not forward it", ["It floods it to all networks", "It converts it into a unicast", "It sends it to the default gateway"], "A broadcast stays inside its broadcast domain; routers do not forward it.", "Broadcast остаётся в своём широковещательном домене; маршрутизаторы его не пересылают."),
        q("Which organization assigns the OUI to vendors?", "IEEE", ["IETF", "ICANN", "TIA"], "Vendors register with the IEEE to obtain a unique 3-byte code.", "Производители регистрируются в IEEE и получают уникальный трёхбайтовый код."),
        tf("A multicast MAC address can be used as the source address of a frame.", false, "The source must always be a unicast address; multicast is only a destination.", "Источник — всегда одноадресный; multicast бывает только адресом назначения."),
      ],
    ),
    part(
      "cn-l4-p4",
      { en: "The MAC address table and switching methods", ru: "Таблица MAC-адресов и методы коммутации" },
      {
        en: `## Switch fundamentals
A Layer 2 Ethernet switch makes forwarding decisions **only by MAC addresses**. It does not look at the protocol carried in the data. A legacy **hub** repeats bits out all ports; a switch consults its **MAC address table**, also called the **CAM table**. When a switch is turned on, the table is **empty**.
= Switch# show mac address-table
## Step 1 — learn (source MAC)
For every frame the switch examines the **source MAC address** and the **port** where the frame entered.
- New address — it is **added** to the table with the port number.
- Known address — the **refresh timer** is reset. By default an entry lives **5 minutes**.
## Step 2 — forward (destination MAC)
- Destination is a unicast **in the table** — forward out **that one port** (filtering).
- Destination is a unicast **not in the table** — **flood** out all ports **except the incoming port**. This is an **unknown unicast**.
- Destination is a **broadcast or multicast** — also flooded out all ports except the incoming one.
## Forwarding methods
- **Store-and-forward** — receives the **entire frame**, computes the **CRC**, and forwards only if it is valid. Frames with errors are discarded. Required for **QoS** analysis on converged networks.
- **Cut-through** — forwards **before** the frame is entirely received; it only needs the destination MAC. **No error checking.** Two variants:
- **Fast-forward** — lowest latency; forwards immediately after reading the destination address. The typical cut-through method.
- **Fragment-free** — stores and checks the **first 64 bytes** before forwarding, because most errors and collisions happen there. A compromise.
## Memory buffering
- **Port-based memory** — frames are queued per port; one frame for a busy port can delay all the others behind it.
- **Shared memory** — one common buffer for all ports, allocated dynamically. Fewer dropped frames; important for **asymmetric switching** (different data rates on different ports).
## Duplex, speed and Auto-MDIX
- Duplex and speed must **match** on both ends. **Autonegotiation** lets two devices agree on the best speed and duplex. Gigabit Ethernet ports work only in full-duplex.
- A **duplex mismatch** (one side half, the other full) is one of the most common causes of poor performance on 10/100 Mbps links.
- **Auto-MDIX** automatically detects the cable type and swaps the transmit and receive pairs, so either a straight-through or a crossover cable works. Enabled by default; re-enabled with:
= Switch(config-if)# mdix auto
> A switch learns from the source and forwards by the destination. Unknown — flood everywhere except where it came from.`,
        ru: `## Основы коммутатора
Коммутатор Ethernet уровня 2 принимает решения о пересылке **только по MAC-адресам**. Он не смотрит, какой протокол внутри данных. Старый **концентратор** повторяет биты во все порты; коммутатор сверяется с **таблицей MAC-адресов**, её ещё называют **таблицей CAM**. При включении коммутатора таблица **пуста**.
= Switch# show mac address-table
## Шаг 1 — изучение (MAC источника)
Для каждого кадра коммутатор смотрит на **MAC-адрес источника** и **порт**, через который кадр вошёл.
- Новый адрес — **добавляется** в таблицу вместе с номером порта.
- Известный адрес — **таймер** записи сбрасывается. По умолчанию запись живёт **5 минут**.
## Шаг 2 — пересылка (MAC назначения)
- Назначение — unicast, который **есть в таблице**: отправить **в один этот порт** (фильтрация).
- Назначение — unicast, которого **нет в таблице**: **разослать** во все порты, **кроме входящего**. Это **неизвестный unicast**.
- Назначение — **broadcast или multicast**: тоже рассылается во все порты, кроме входящего.
## Методы пересылки
- **Store-and-forward** — принимает **кадр целиком**, вычисляет **CRC** и пересылает, только если он верен. Кадры с ошибками отбрасываются. Нужен для анализа **QoS** в конвергентных сетях.
- **Cut-through** — пересылает, **не дожидаясь** всего кадра; ему нужен только MAC назначения. **Ошибки не проверяются.** Два варианта:
- **Fast-forward** — наименьшая задержка; пересылает сразу после чтения адреса назначения. Типичный вариант cut-through.
- **Fragment-free** — сохраняет и проверяет **первые 64 байта** перед пересылкой, потому что большинство ошибок и коллизий случается там. Компромисс.
## Буферизация
- **Буфер на порт** — кадры стоят в очереди своего порта; один кадр для занятого порта задерживает все следующие.
- **Общая память** — единый буфер для всех портов, выделяется динамически. Меньше потерянных кадров; важно для **асимметричной коммутации** (разные скорости на разных портах).
## Дуплекс, скорость и Auto-MDIX
- Дуплекс и скорость должны **совпадать** на обоих концах. **Автосогласование** позволяет двум устройствам выбрать лучшие скорость и дуплекс. Порты Gigabit Ethernet работают только в полном дуплексе.
- **Несовпадение дуплекса** (с одной стороны half, с другой full) — одна из самых частых причин плохой работы каналов 10/100 Мбит/с.
- **Auto-MDIX** сам определяет тип кабеля и меняет местами пары передачи и приёма, поэтому подходит и прямой, и перекрёстный кабель. Включён по умолчанию; включается заново командой:
= Switch(config-if)# mdix auto
> Коммутатор учится по источнику, а пересылает по назначению. Не знает — рассылает всюду, кроме порта, откуда пришло.`,
      },
      [
        q("What does a switch do when receiving an unknown unicast frame?", "Floods frame out all ports except ingress port", ["Drops the frame", "Sends ICMP unreachable", "Queries default gateway"], "If the destination MAC is not in the table, the frame is flooded out all ports except the incoming one.", "Если MAC назначения нет в таблице, кадр рассылается во все порты, кроме входящего."),
        q("Which command displays the switch Layer 2 address table?", "show mac address-table", ["show ip arp", "show switchport", "show interface brief"], "The MAC address (CAM) table is shown with show mac address-table.", "Таблицу MAC-адресов (CAM) показывает show mac address-table."),
        q("Which feature automatically swaps transmit and receive pairs on switchports?", "Auto-MDIX", ["Auto-Speed", "Port Security", "PoE"], "Auto-MDIX detects the cable type and configures the interface accordingly.", "Auto-MDIX определяет тип кабеля и настраивает интерфейс под него."),
        q("Which address does a switch examine to build its MAC address table?", "The source MAC address", ["The destination MAC address", "The source IP address", "The destination IP address"], "A switch learns from the source MAC and the port the frame arrived on.", "Коммутатор учится по MAC источника и порту, через который пришёл кадр."),
        q("How long does a switch keep an entry in the MAC address table by default?", "5 minutes", ["30 seconds", "1 hour", "Until reboot"], "Most Ethernet switches age entries out after 5 minutes without refresh.", "Большинство коммутаторов удаляют запись через 5 минут без обновления."),
        q("Which switching method receives the entire frame and checks the CRC before forwarding?", "Store-and-forward", ["Fast-forward", "Fragment-free", "Cut-through"], "Store-and-forward discards frames with errors before propagating them.", "Store-and-forward отбрасывает кадры с ошибками, не пропуская их дальше."),
        q("Which cut-through variant checks the first 64 bytes of a frame before forwarding?", "Fragment-free", ["Fast-forward", "Store-and-forward", "Shared memory"], "Most errors and collisions occur in the first 64 bytes, so fragment-free checks them.", "Большинство ошибок и коллизий случается в первых 64 байтах, их и проверяет fragment-free."),
        q("Which switching method offers the lowest latency?", "Fast-forward", ["Store-and-forward", "Fragment-free", "Port-based buffering"], "Fast-forward starts forwarding right after reading the destination address.", "Fast-forward начинает пересылку сразу после чтения адреса назначения."),
        q("What is another name for the MAC address table?", "CAM table", ["ARP table", "Routing table", "NAT table"], "The table is stored in content addressable memory.", "Таблица хранится в ассоциативной памяти (content addressable memory)."),
        q("What is a duplex mismatch?", "One end runs half-duplex, the other full-duplex", ["Two ports use different MAC addresses", "A crossover cable is used by mistake", "The switch table has duplicate entries"], "A mismatch is a common cause of poor performance on 10/100 Mbps links.", "Несовпадение — частая причина плохой работы каналов 10/100 Мбит/с."),
        q("Which buffering method uses one common buffer for all switch ports?", "Shared memory", ["Port-based memory", "Cut-through memory", "Flash memory"], "Shared memory is allocated dynamically and supports asymmetric switching.", "Общая память выделяется динамически и поддерживает асимметричную коммутацию."),
        tf("When a switch is first turned on, its MAC address table already contains the addresses of all connected hosts.", false, "The table starts empty and is filled as frames arrive.", "Таблица сначала пуста и заполняется по мере поступления кадров."),
      ],
    ),
  ],
};
