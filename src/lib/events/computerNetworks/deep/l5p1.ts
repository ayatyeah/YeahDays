import { qx, tfx, type Draft } from "../../types";

export const deepL5P1: Draft[] = [
  qx("Which protocols are the principal network layer communication protocols?", "IPv4 and IPv6", [
    ["TCP and UDP", "TCP and UDP are transport layer (Layer 4) protocols that ride inside IP packets.", "TCP и UDP — протоколы транспортного уровня (4), они едут внутри IP-пакетов."],
    ["Ethernet and Wi-Fi (802.11)", "Ethernet and Wi-Fi are data link and physical layer technologies, below the network layer.", "Ethernet и Wi-Fi — технологии канального и физического уровней, ниже сетевого."],
    ["ARP and ICMP", "ARP and ICMP support IP (address resolution, error messages), but the main Layer 3 protocols are IPv4 and IPv6.", "ARP и ICMP помогают IP (разрешение адресов, сообщения об ошибках), но основные протоколы уровня 3 — IPv4 и IPv6."],
  ], "IP version 4 (IPv4) and IP version 6 (IPv6) are the principal network layer communication protocols.", "Основные протоколы сетевого уровня — IP версии 4 (IPv4) и IP версии 6 (IPv6)."),

  qx("Which list gives the four basic operations of the network layer?", "Addressing end devices, encapsulation, routing, de-encapsulation", [
    ["Segmentation, flow control, sequencing, reassembly", "These are transport layer jobs (mostly TCP), not network layer operations.", "Это задачи транспортного уровня (в основном TCP), а не операции сетевого уровня."],
    ["Framing, media access control, error detection and MAC addressing", "These are data link layer functions performed on each link, not Layer 3 operations.", "Это функции канального уровня на каждом участке, а не операции уровня 3."],
    ["Addressing, encapsulation, switching, error correction", "Switching by MAC is Layer 2 and IP performs no error correction, so two items are wrong.", "Коммутация по MAC — уровень 2, а IP не исправляет ошибки, так что два пункта неверны."],
  ], "The network layer performs four basic operations: addressing end devices, encapsulation, routing and de-encapsulation.", "Сетевой уровень выполняет четыре базовые операции: адресация конечных устройств, инкапсуляция, маршрутизация и деинкапсуляция."),

  qx("A router receives a packet, looks up the destination network and selects the best path to forward it. Which network layer operation is this?", "Routing", [
    ["Encapsulation", "Encapsulation is adding the IP header to a segment at the source, not choosing a path.", "Инкапсуляция — добавление IP-заголовка к сегменту у источника, а не выбор пути."],
    ["De-encapsulation", "De-encapsulation removes the IP header at the destination host; the router here is choosing a path.", "Деинкапсуляция снимает IP-заголовок у получателя; здесь же маршрутизатор выбирает путь."],
    ["Addressing end devices", "Addressing means giving each end device a unique IP address; the router is forwarding, not addressing.", "Адресация — это выдача каждому устройству уникального IP; маршрутизатор здесь пересылает, а не адресует."],
  ], "Routing is the operation of directing the packet toward the destination network along the best path.", "Маршрутизация — операция, при которой пакет направляется к сети назначения по лучшему пути."),

  qx("The destination host removes the IP header and passes the segment up to the transport layer. Which operation is this?", "De-encapsulation", [
    ["Routing", "Routing is path selection done by routers on the way, not header removal at the destination.", "Маршрутизация — выбор пути маршрутизаторами по дороге, а не снятие заголовка у получателя."],
    ["Packet fragmentation", "Fragmentation splits a packet into smaller packets; it does not hand the segment up to Layer 4.", "Фрагментация делит пакет на меньшие части и не передаёт сегмент на уровень 4."],
    ["Encapsulation", "Encapsulation is the opposite step: the source adds the IP header to the segment.", "Инкапсуляция — обратный шаг: источник добавляет IP-заголовок к сегменту."],
  ], "At the destination the IP header is examined and removed, and the Layer 4 segment is passed up: this is de-encapsulation.", "У получателя IP-заголовок проверяется и снимается, а сегмент уровня 4 передаётся вверх — это деинкапсуляция."),

  qx("What exactly does IP encapsulate when it builds a packet?", "The transport layer segment", [
    ["The Layer 2 frame with its MAC addresses", "The frame is built after the packet, by the data link layer; IP sits inside the frame, not around it.", "Кадр строится после пакета, канальным уровнем; IP находится внутри кадра, а не вокруг него."],
    ["The raw application data, skipping Layer 4", "Application data first goes through the transport layer; IP receives a segment (or datagram).", "Данные приложения сначала проходят транспортный уровень; IP получает сегмент (или датаграмму)."],
    ["The bits produced by the physical layer", "Bits are produced last, from the frame; the physical layer is below IP.", "Биты получаются последними, из кадра; физический уровень ниже IP."],
  ], "IP encapsulates the transport layer segment by adding an IP header, forming the Layer 3 packet.", "IP инкапсулирует сегмент транспортного уровня, добавляя IP-заголовок, — получается пакет уровня 3."),

  qx("A host can send the same TCP segment inside either an IPv4 or an IPv6 packet. How does this choice affect the Layer 4 segment?", "The segment itself is not affected", [
    ["The segment must be re-segmented for IPv6", "IPv6 does not require TCP to resize its segments; the IP version is invisible to Layer 4.", "IPv6 не требует от TCP менять размер сегментов; версия IP не видна уровню 4."],
    ["TCP port numbers are rewritten to IPv6 ports", "There are no separate IPv6 port numbers; ports belong to Layer 4 and stay the same.", "Отдельных «портов IPv6» нет; порты принадлежат уровню 4 и не меняются."],
    ["The segment is converted from TCP to UDP", "IP never changes the transport protocol; it only wraps the segment it receives.", "IP никогда не меняет транспортный протокол — он лишь упаковывает полученный сегмент."],
  ], "IP can use either an IPv4 or an IPv6 packet without impacting the Layer 4 segment.", "IP может использовать пакет IPv4 или IPv6, и это не влияет на сегмент уровня 4."),

  qx("Which devices examine the IP packet header as the packet crosses the network?", "Every Layer 3 device along the path", [
    ["Only the destination host", "Routers along the way must read the destination address and TTL to forward the packet.", "Маршрутизаторы по пути обязаны читать адрес назначения и TTL, чтобы переслать пакет."],
    ["Only the default gateway of the source", "The first-hop router is one of many; every Layer 3 hop looks at the header.", "Первый маршрутизатор — лишь один из многих; заголовок смотрит каждый узел уровня 3."],
    ["Every Layer 2 switch on each link", "A Layer 2 switch forwards by MAC address in the frame; it does not process the IP header.", "Коммутатор уровня 2 пересылает по MAC в кадре и IP-заголовок не обрабатывает."],
  ], "The IP packet is examined by all Layer 3 devices as it traverses the network.", "IP-пакет проверяют все устройства уровня 3 на его пути через сеть."),

  qx("PC-A sends a packet across three routers to a web server, with no NAT on the path. What happens to the source and destination IP addresses?", "They stay the same from source to destination", [
    ["Each router writes its own address as the source", "Routers do not rewrite IP addresses; only NAT would change them, and there is none here.", "Маршрутизаторы не переписывают IP-адреса; это сделал бы только NAT, а его здесь нет."],
    ["The destination becomes the next router at each hop", "That is what happens to the destination MAC address in each new frame, not to the IP address.", "Так меняется MAC-адрес назначения в каждом новом кадре, а не IP-адрес."],
    ["The source is replaced by the gateway at the first hop", "Without NAT the source IP of PC-A is carried all the way to the server unchanged.", "Без NAT IP-адрес PC-A доезжает до сервера без изменений."],
  ], "The IP addressing does not change from source to destination; MAC addresses change hop by hop.", "IP-адресация не меняется от источника до получателя; меняются MAC-адреса на каждом участке."),

  qx("IP is described as connectionless. What does that mean?", "No connection is set up with the destination before sending", [
    ["IP packets can only travel over wireless links", "Connectionless has nothing to do with cables; IP works over copper, fiber and wireless.", "«Без соединения» не про кабели; IP работает по меди, оптике и радио."],
    ["IP sends the destination a pre-notification before each packet", "IP sends no pre-notifications at all; the destination just receives the packet when it arrives.", "IP вообще не шлёт предупреждений; получатель просто принимает пакет, когда тот придёт."],
    ["Every packet is acknowledged by the receiver", "IP uses no acknowledgments or synchronizations; that control traffic is what connectionless avoids.", "IP не использует подтверждений и синхронизаций — именно этого управляющего трафика нет без соединения."],
  ], "IP does not establish a connection before sending and needs no control information such as synchronizations or acknowledgments.", "IP не устанавливает соединение перед отправкой и не требует управляющих сведений вроде синхронизаций и подтверждений."),

  qx("An application needs connection-oriented, reliable delivery over IP. Which protocol usually provides it?", "TCP at the transport layer", [
    ["IP itself, by enabling a flag", "IP has no reliable mode; connection-oriented service is left to another protocol.", "У IP нет надёжного режима; передачу с соединением обеспечивает другой протокол."],
    ["UDP at the transport layer", "UDP is connectionless like IP, so it does not add a connection or reliability.", "UDP так же работает без соединения, как и IP, поэтому надёжности не добавляет."],
    ["ARP at the network layer", "ARP only resolves IPv4 addresses to MAC addresses; it does not manage connections.", "ARP лишь сопоставляет IPv4-адрес с MAC-адресом и соединениями не управляет."],
  ], "If connection-oriented traffic is needed, another protocol handles it, typically TCP at the transport layer.", "Если нужна передача с установлением соединения, этим занимается другой протокол — обычно TCP на транспортном уровне."),

  qx("Why is IP described as best effort?", "Packet delivery is not guaranteed", [
    ["It always picks the best path to the destination", "Choosing the best path is routing; best effort is about not guaranteeing delivery.", "Выбор лучшего пути — это маршрутизация; best effort означает отсутствие гарантии доставки."],
    ["It always uses the fastest available medium", "IP is media independent and does not pick media; best effort is about reliability.", "IP не зависит от среды и не выбирает её; best effort — про надёжность."],
    ["It gives priority to voice and video traffic", "Prioritising traffic is QoS (the DS field), not the meaning of best effort.", "Приоритизация трафика — это QoS (поле DS), а не смысл best effort."],
  ], "IP is best effort: it is inherently unreliable because packet delivery is not guaranteed.", "IP работает по принципу best effort: он по природе ненадёжен, потому что доставка пакетов не гарантируется."),

  qx("An IP packet is dropped by a congested router halfway to the destination. What does IP do about it?", "Nothing; IP has no mechanism to resend it", [
    ["The source IP layer resends it after a timeout", "IP keeps no copies and sets no timers; any resending must come from an upper layer such as TCP.", "IP не хранит копий и не ставит таймеров; повторную отправку делает верхний уровень, например TCP."],
    ["The previous router resends its stored copy", "Routers do not keep copies of forwarded packets for retransmission.", "Маршрутизаторы не хранят копии пересланных пакетов для повторной отправки."],
    ["The destination IP layer requests the packet again", "IP does not expect acknowledgments and does not even know the packet was sent.", "IP не ждёт подтверждений и даже не знает, что пакет был отправлен."],
  ], "IP has reduced overhead because there is no mechanism to resend data that is not received.", "У IP малые накладные расходы, потому что механизма повторной отправки недоставленных данных нет."),

  qx("Which of these tasks can IP NOT perform on its own?", "Realign packets that arrive out of sequence", [
    ["Carry both a source and a destination IP address", "Carrying source and destination addresses is exactly what the IP header does.", "Нести адреса источника и назначения — прямая задача IP-заголовка."],
    ["Cross several networks through routers", "Being routed across networks is the core purpose of IP.", "Пересекать несколько сетей через маршрутизаторы — главное назначение IP."],
    ["Travel over copper, fiber or wireless", "IP is media independent, so it can travel over any of these media.", "IP не зависит от среды и может идти по любой из них."],
  ], "IP is unreliable: it cannot fix corrupt packets, retransmit after an error or realign out-of-sequence packets; it relies on other protocols for that.", "IP ненадёжен: он не чинит испорченные пакеты, не передаёт повторно после ошибки и не упорядочивает пакеты; для этого он полагается на другие протоколы."),

  qx("What does it mean that IP is media independent?", "IP works the same over copper, fiber or wireless", [
    ["IP builds a different frame type for each kind of medium", "Building the frame is the data link layer's job; IP does not concern itself with the frame type.", "Строить кадр — задача канального уровня; IP тип кадра не интересует."],
    ["IP can run only over Ethernet media", "IP runs over any medium, not just Ethernet.", "IP работает поверх любой среды, а не только Ethernet."],
    ["IP decides how bits are encoded on the wire", "Bit encoding is the physical layer's job, two layers below IP.", "Кодирование битов — задача физического уровня, на два уровня ниже IP."],
  ], "IP does not concern itself with the frame type at Layer 2 or the media type at Layer 1; it can be sent over copper, fiber or wireless.", "IP не интересуется типом кадра на уровне 2 и типом среды на уровне 1; его можно передавать по меди, оптике или радио."),

  qx("Where does the network layer get the information it uses to establish the MTU?", "From control information sent by the data link layer", [
    ["From the TCP window size of the session", "The TCP window controls how much data is unacknowledged; it does not set the MTU.", "Окно TCP определяет объём неподтверждённых данных и MTU не задаёт."],
    ["From acknowledgments sent back by the destination host", "IP does not use acknowledgments at all, so it cannot learn the MTU from them.", "IP вообще не использует подтверждения, поэтому MTU из них не узнать."],
    ["From the DNS server configured on the host", "DNS resolves names to addresses; it has nothing to do with the MTU.", "DNS разрешает имена в адреса и к MTU отношения не имеет."],
  ], "The network layer receives control information from the data link layer and then establishes the Maximum Transmission Unit (MTU) size.", "Сетевой уровень получает управляющие сведения от канального уровня и по ним устанавливает размер MTU (Maximum Transmission Unit)."),

  qx("What is fragmentation in the context of the network layer?", "Layer 3 splitting an IPv4 packet into smaller units", [
    ["Layer 4 dividing application data into segments", "That is segmentation at the transport layer, done before the packet even exists.", "Это сегментация на транспортном уровне — она происходит ещё до появления пакета."],
    ["Layer 2 cutting a frame into separate bits", "Turning a frame into bits is the physical layer's encoding, not fragmentation.", "Превращение кадра в биты — кодирование на физическом уровне, а не фрагментация."],
    ["A switch splitting one collision domain into many smaller ones", "Microsegmentation by switches is a Layer 2 concept, unrelated to IP fragmentation.", "Микросегментация коммутаторами — понятие уровня 2, к фрагментации IP не относится."],
  ], "Fragmentation is when Layer 3 splits the IPv4 packet into smaller units.", "Фрагментация — это когда уровень 3 делит пакет IPv4 на меньшие части."),

  qx("A router forwards a 1500-byte IPv4 packet from an Ethernet LAN onto a slow WAN link with a smaller MTU. What may the router do?", "Fragment the IPv4 packet into smaller packets", [
    ["Raise the MTU of the WAN link to 1500 bytes", "A router cannot change the MTU that the WAN link supports just to fit one packet.", "Маршрутизатор не может поднять MTU канала WAN ради одного пакета."],
    ["Return the data to the source TCP for re-segmentation", "IP has no way to hand a packet back to the sender's transport layer.", "У IP нет способа вернуть пакет транспортному уровню отправителя."],
    ["Convert the packet into an IPv6 packet", "Converting to IPv6 would not help (IPv6 is not fragmented by routers) and routers do not do it here.", "Переход на IPv6 не помог бы (маршрутизаторы IPv6 не фрагментируют), и так здесь никто не делает."],
  ], "The slides give exactly this example: a router going from Ethernet to a slow WAN with a smaller MTU fragments the IPv4 packet.", "На слайдах именно такой пример: маршрутизатор, переходя с Ethernet на медленный WAN с меньшим MTU, фрагментирует пакет IPv4."),

  qx("What drawback of fragmentation is named on the slides?", "It causes latency", [
    ["It changes the source IP address", "Fragments keep the original source and destination addresses.", "Фрагменты сохраняют исходные адреса источника и назначения."],
    ["It removes the header checksum", "Every IPv4 fragment still carries its own header with a checksum.", "Каждый фрагмент IPv4 по-прежнему несёт свой заголовок с контрольной суммой."],
    ["It resets the TTL of each piece to zero", "A TTL of zero would make routers drop the fragments; fragmentation does not do that.", "TTL, равный нулю, заставил бы маршрутизаторы отбросить фрагменты; фрагментация так не делает."],
  ], "Fragmenting causes latency, which is one reason IPv6 routers do not fragment packets.", "Фрагментация вызывает задержку — это одна из причин, по которой маршрутизаторы IPv6 пакеты не фрагментируют."),

  tfx("Routers fragment IPv6 packets in the same way that they fragment IPv4 packets.", false,
    "IPv6 routers do not fragment packets; fragmentation is left to the source, using an extension header if needed.", "Маршрутизаторы IPv6 пакеты не фрагментируют; при необходимости это делает сам источник с помощью заголовка расширения.",
    "Believing it is true mixes up IPv4 and IPv6: the slides state that IPv6 does not fragment packets at routers.", "Считать это верным — значит путать IPv4 и IPv6: на слайдах сказано, что IPv6-пакеты маршрутизаторы не фрагментируют."),

  qx("How is the standard IPv4 header diagram read?", "Left to right, 4 bytes per line", [
    ["Right to left, 8 bytes per line", "The diagram is read from left to right, and each row is 32 bits (4 bytes), not 8 bytes.", "Схему читают слева направо, и каждая строка — 32 бита (4 байта), а не 8 байт."],
    ["Top to bottom, 1 byte per column", "Rows are read one by one from left to right; the unit is a 4-byte line, not a column.", "Строки читаются по очереди слева направо; единица — строка в 4 байта, а не столбец."],
    ["Left to right, 2 bytes per line", "Each line of the IPv4 header is 32 bits wide, which is 4 bytes, not 2.", "Каждая строка заголовка IPv4 шириной 32 бита, то есть 4 байта, а не 2."],
  ], "The IPv4 header is in binary, has several fields and its diagram is read from left to right, 4 bytes per line.", "Заголовок IPv4 двоичный, состоит из нескольких полей, а его схему читают слева направо по 4 байта в строке."),

  qx("Which two IPv4 header fields are called the most important?", "Source and destination addresses", [
    ["Version and Time to Live", "Version and TTL matter, but the slides name the source and destination as the two key fields.", "Version и TTL важны, но на слайдах главными названы адреса источника и назначения."],
    ["Protocol and Header Checksum", "Protocol and checksum help processing, yet delivery depends first on the two addresses.", "Protocol и контрольная сумма помогают обработке, но доставка прежде всего зависит от двух адресов."],
    ["Differentiated Services and Flags", "DS and Flags are for QoS and fragmentation, not the most important fields.", "DS и Flags нужны для QoS и фрагментации, это не самые важные поля."],
  ], "The two most important fields in the IPv4 header are the source and destination IP addresses.", "Два самых важных поля заголовка IPv4 — IP-адреса источника и назначения."),

  qx("What is the binary value of the 4-bit Version field in an IPv4 packet?", "0100", [
    ["0110", "0110 (decimal 6) is the Version value of IPv6, not IPv4.", "0110 (десятичное 6) — значение Version у IPv6, а не IPv4."],
    ["1000", "1000 is decimal 8, which is not the IPv4 version number.", "1000 — это десятичное 8, а не номер версии IPv4."],
    ["0010", "0010 is decimal 2; IPv4 is version 4, written 0100.", "0010 — это десятичное 2; IPv4 — версия 4, то есть 0100."],
  ], "The Version field is 4 bits; for IPv4 it contains 0100 (4), for IPv6 0110 (6).", "Поле Version занимает 4 бита; у IPv4 там 0100 (4), у IPv6 — 0110 (6)."),

  qx("A network engineer wants voice packets to receive priority over file downloads. Which IPv4 header field carries that QoS marking?", "Differentiated Services (DS)", [
    ["Time to Live (TTL)", "TTL is a hop counter that limits the packet's lifetime, not a priority marker.", "TTL — счётчик переходов, ограничивающий жизнь пакета, а не метка приоритета."],
    ["Identification and Fragment Offset", "These fields keep track of fragments of one packet; they carry no priority.", "Эти поля отслеживают фрагменты одного пакета и приоритета не несут."],
    ["Header Checksum", "The checksum only detects header corruption; it carries no priority information.", "Контрольная сумма лишь обнаруживает порчу заголовка и приоритета не несёт."],
  ], "The Differentiated Services (DS) field is used for QoS, so devices can prioritise traffic such as voice.", "Поле Differentiated Services (DS) используется для QoS, чтобы устройства могли давать приоритет, например, голосу."),

  qx("Which older name refers to the same QoS byte that is now the DS field in the IPv4 header?", "Type of Service (ToS)", [
    ["Traffic Class", "Traffic Class is the IPv6 equivalent of DS, not the older IPv4 name.", "Traffic Class — аналог DS в IPv6, а не старое название в IPv4."],
    ["Flow Label", "Flow Label is a 20-bit IPv6 field for handling flows the same way.", "Flow Label — 20-битное поле IPv6 для одинаковой обработки потоков."],
    ["Explicit Congestion Notification", "ECN is only the last 2 bits inside the DS byte, not an older name of the whole field.", "ECN — лишь последние 2 бита внутри байта DS, а не старое название всего поля."],
  ], "The DS field (DiffServ) replaced the older Type of Service (ToS) field; both are used for QoS.", "Поле DS (DiffServ) заменило прежнее поле Type of Service (ToS); оба служат для QoS."),

  qx("What does the IPv4 Header Checksum detect?", "Corruption in the IPv4 header", [
    ["Corruption anywhere in the packet, including data", "The IPv4 checksum covers only the header, not the payload.", "Контрольная сумма IPv4 покрывает только заголовок, а не данные."],
    ["Errors in the Ethernet frame on the link", "Frame errors are detected by the Ethernet FCS at Layer 2, not by the IP checksum.", "Ошибки кадра обнаруживает Ethernet FCS на уровне 2, а не контрольная сумма IP."],
    ["Packets that were lost along the way", "A checksum cannot notice a missing packet; IP does not track lost packets.", "Контрольная сумма не может заметить пропавший пакет; IP потери не отслеживает."],
  ], "The Header Checksum is used to detect corruption in the IPv4 header.", "Header Checksum служит для обнаружения повреждения заголовка IPv4."),

  qx("Why must every router recalculate the IPv4 header checksum before forwarding?", "The TTL value changes at each hop", [
    ["The source IP address changes at each hop", "Without NAT the source address stays the same end to end.", "Без NAT адрес источника не меняется на всём пути."],
    ["The payload is re-encrypted by each router", "Routers do not encrypt the payload, and the checksum does not cover the payload anyway.", "Маршрутизаторы не шифруют данные, да и контрольная сумма данные не покрывает."],
    ["The checksum also covers the MAC addresses", "MAC addresses are in the Layer 2 frame, outside the IPv4 header.", "MAC-адреса находятся в кадре уровня 2, вне заголовка IPv4."],
  ], "Each router decrements TTL, which changes the header, so the header checksum has to be recomputed.", "Каждый маршрутизатор уменьшает TTL, заголовок меняется, и контрольную сумму приходится пересчитывать."),

  qx("What does the Time to Live (TTL) field represent?", "A Layer 3 hop count", [
    ["A timer in seconds for the TCP session", "TCP timers belong to Layer 4; TTL is a Layer 3 hop counter.", "Таймеры TCP — уровень 4; TTL — счётчик переходов уровня 3."],
    ["The lifetime of an entry in the ARP table", "ARP table entries have their own timer; TTL is a field in the IPv4 header.", "У записей ARP свой таймер; TTL — поле заголовка IPv4."],
    ["The number of fragments in the packet", "Fragments are tracked with Identification, Flags and Fragment Offset, not TTL.", "Фрагменты отслеживают поля Identification, Flags и Fragment Offset, а не TTL."],
  ], "TTL is a Layer 3 hop count; when it becomes zero the router discards the packet.", "TTL — счётчик переходов уровня 3; когда он доходит до нуля, маршрутизатор отбрасывает пакет."),

  qx("A router receives an IPv4 packet whose TTL is 1. What happens?", "TTL drops to 0 and the router discards the packet", [
    ["The router forwards it with TTL 0", "A packet whose TTL reaches zero is never forwarded.", "Пакет, у которого TTL дошёл до нуля, никогда не пересылается."],
    ["The router resets the TTL to 64 and then forwards it", "Routers only decrement TTL; resetting it would defeat its purpose.", "Маршрутизаторы только уменьшают TTL; сброс лишил бы поле смысла."],
    ["The router sends it to the default route instead", "The route used does not matter; the packet's lifetime has expired.", "Маршрут уже неважен: время жизни пакета истекло."],
  ], "The router decrements TTL by one; at zero it discards the packet (and normally reports ICMP Time Exceeded to the source).", "Маршрутизатор уменьшает TTL на единицу; при нуле пакет отбрасывается (обычно источнику уходит ICMP Time Exceeded)."),

  qx("Which IPv4 header field tells the receiver which next-level protocol the data belongs to?", "Protocol", [
    ["Version", "Version only says whether the packet is IPv4 or IPv6.", "Version лишь сообщает, IPv4 это или IPv6."],
    ["Differentiated Services", "DS carries QoS markings, not the upper-layer protocol.", "DS несёт метки QoS, а не протокол верхнего уровня."],
    ["Identification", "Identification groups fragments of one packet; it does not name a protocol.", "Identification объединяет фрагменты одного пакета, а протокол не указывает."],
  ], "The Protocol field identifies the next-level protocol: ICMP, TCP, UDP and so on.", "Поле Protocol указывает протокол следующего уровня: ICMP, TCP, UDP и т. д."),

  qx("The Protocol field of a received IPv4 packet contains the value 6. What does the payload carry?", "A TCP segment", [
    ["A UDP datagram", "UDP is protocol number 17, not 6.", "У UDP номер протокола 17, а не 6."],
    ["An ICMP message", "ICMP is protocol number 1, not 6.", "У ICMP номер протокола 1, а не 6."],
    ["An ARP request", "ARP is not carried inside IP at all; it is identified by an EtherType in the frame.", "ARP вообще не едет внутри IP — его обозначает EtherType в кадре."],
  ], "Common Protocol values: 1 = ICMP, 6 = TCP, 17 = UDP.", "Частые значения поля Protocol: 1 = ICMP, 6 = TCP, 17 = UDP."),

  qx("Which IPv4 header fields are used to keep track of fragments and reassemble them?", "Identification, Flags and Fragment Offset", [
    ["TTL, Protocol and Header Checksum", "These fields handle hop count, next protocol and header errors, not fragments.", "Эти поля отвечают за счётчик переходов, протокол и ошибки заголовка, а не за фрагменты."],
    ["Version, IHL and Differentiated Services", "These describe version, header length and QoS, not fragment order.", "Они описывают версию, длину заголовка и QoS, а не порядок фрагментов."],
    ["Source address, destination address and Total Length", "Addresses and length are copied into each fragment but do not identify its position.", "Адреса и длина копируются в каждый фрагмент, но не указывают его место."],
  ], "Identification marks fragments of the same packet, Flags (such as More Fragments) and Fragment Offset give their order; IPv6 removed Flag and Fragment Offset from its header.", "Identification помечает фрагменты одного пакета, Flags (например, More Fragments) и Fragment Offset задают их порядок; в IPv6 поля Flag и Fragment Offset из заголовка убрали."),

  qx("What does the Total Length field of an IPv4 header indicate?", "The size of the whole packet, header plus data", [
    ["The size of the header only, in 32-bit words", "That is the Internet Header Length (IHL) field, not Total Length.", "Это поле Internet Header Length (IHL), а не Total Length."],
    ["The size of the data portion only, without header", "Counting only the payload is how the IPv6 Payload Length field works.", "Только полезную нагрузку считает поле Payload Length в IPv6."],
    ["The number of hops the packet may still cross", "The remaining hop count is the TTL field.", "Оставшееся число переходов хранит поле TTL."],
  ], "Total Length gives the size of the entire IPv4 packet, header and data, in bytes.", "Total Length показывает размер всего пакета IPv4 — заголовка и данных — в байтах."),

  qx("Which address block is one of the RFC 1918 private ranges?", "172.16.0.0/12", [
    ["169.254.0.0/16", "169.254.0.0/16 is the link-local (APIPA) range, not an RFC 1918 private block.", "169.254.0.0/16 — диапазон link-local (APIPA), а не частный блок RFC 1918."],
    ["100.64.0.0/10", "100.64.0.0/10 is shared address space for carriers, not RFC 1918.", "100.64.0.0/10 — общее адресное пространство провайдеров, не RFC 1918."],
    ["224.0.0.0/4", "224.0.0.0/4 is the multicast range, not private unicast space.", "224.0.0.0/4 — диапазон многоадресной рассылки, а не частные адреса."],
  ], "RFC 1918 private ranges: 10.0.0.0/8, 172.16.0.0/12 (172.16.0.0–172.31.255.255) and 192.168.0.0/16.", "Частные диапазоны RFC 1918: 10.0.0.0/8, 172.16.0.0/12 (172.16.0.0–172.31.255.255) и 192.168.0.0/16."),

  qx("Which of these IPv4 addresses is a private address?", "172.20.5.9", [
    ["172.32.1.1", "172.16.0.0/12 ends at 172.31.255.255, so 172.32.x.x is public.", "172.16.0.0/12 кончается на 172.31.255.255, так что 172.32.x.x — публичный."],
    ["192.169.1.1", "Only 192.168.x.x is private; 192.169 is outside 192.168.0.0/16.", "Частный только 192.168.x.x; 192.169 вне 192.168.0.0/16."],
    ["11.0.0.1", "The private block is 10.0.0.0/8; 11.x.x.x is public space.", "Частный блок — 10.0.0.0/8; 11.x.x.x — публичное пространство."],
  ], "172.20.5.9 falls in 172.16.0.0–172.31.255.255, one of the RFC 1918 ranges.", "172.20.5.9 попадает в 172.16.0.0–172.31.255.255 — один из диапазонов RFC 1918."),

  qx("A laptop with address 192.168.1.10 tries to reach a web server on the internet. Why does it need NAT on the edge router?", "Private addresses are not routable on the internet", [
    ["Private addresses cannot carry TCP traffic", "Private addresses work with TCP and UDP normally; the issue is internet routing.", "Частные адреса нормально работают с TCP и UDP; проблема в маршрутизации в интернете."],
    ["The 192.168.x.x block is reserved for loopback tests", "Loopback is 127.0.0.1; 192.168.0.0/16 is ordinary private space.", "Loopback — 127.0.0.1; 192.168.0.0/16 — обычное частное пространство."],
    ["Private addresses are longer than public ones", "All IPv4 addresses, private or public, are 32 bits.", "Все адреса IPv4, частные и публичные, — по 32 бита."],
  ], "Private IPv4 addresses are not unique and are not globally routable, so NAT translates them to a public address.", "Частные адреса IPv4 не уникальны и не маршрутизируются глобально, поэтому NAT транслирует их в публичный адрес."),

  qx("What does NAT do for IPv4 traffic leaving an organization?", "Translates private IPv4 addresses into public ones", [
    ["Translates the domain names that hosts use into IP addresses", "Resolving names to addresses is the job of DNS.", "Имена в адреса превращает DNS."],
    ["Maps IPv4 addresses to MAC addresses", "Mapping IPv4 to MAC is what ARP does on the local network.", "Сопоставление IPv4 и MAC выполняет ARP в локальной сети."],
    ["Hands out IP addresses to client devices", "Assigning addresses automatically is DHCP.", "Автоматически выдаёт адреса DHCP."],
  ], "Network Address Translation (NAT) translates internal private IPv4 addresses to a public global IPv4 address.", "NAT (Network Address Translation) транслирует внутренние частные адреса IPv4 в публичный глобальный адрес."),

  qx("Where is NAT typically enabled?", "On the edge router connecting to the internet", [
    ["On every host inside the LAN", "Hosts keep their private addresses; translation happens where the LAN meets the internet.", "Хосты сохраняют частные адреса; трансляция идёт там, где LAN выходит в интернет."],
    ["On each access switch that the office floors plug into", "A Layer 2 access switch does not translate IP addresses.", "Коммутатор доступа уровня 2 IP-адреса не транслирует."],
    ["On the company's DNS server", "A DNS server answers name queries; it does not rewrite packet headers.", "DNS-сервер отвечает на запросы имён и заголовки пакетов не переписывает."],
  ], "NAT is typically enabled on the edge router that connects the organization to the internet.", "NAT обычно включают на пограничном маршрутизаторе, соединяющем организацию с интернетом."),

  qx("Which three problems are listed as the major limitations of IPv4?", "Address depletion, lost end-to-end connectivity, complexity", [
    ["No QoS field, no checksum and no TTL", "IPv4 has a DS field for QoS, a header checksum and a TTL, so none of these are its limitations.", "У IPv4 есть поле DS для QoS, контрольная сумма и TTL, так что это не его ограничения."],
    ["No support for fiber, multicast or DHCP", "IPv4 is media independent and supports multicast and DHCP.", "IPv4 не зависит от среды и поддерживает multicast и DHCP."],
    ["Slow routing lookups, a very small MTU and no broadcast support", "These are not the limitations named; IPv4 even supports broadcasts, unlike IPv6.", "Это не названные ограничения; IPv4 даже поддерживает широковещание, в отличие от IPv6."],
  ], "IPv4's three major limitations: address depletion, lack of end-to-end connectivity and increased network complexity.", "Три главных ограничения IPv4: исчерпание адресов, отсутствие сквозной связности и усложнение сети."),

  qx("Why does IPv4 today often lack end-to-end connectivity?", "Hosts sit behind NAT with private addresses", [
    ["The TTL field is too small for long internet paths", "TTL up to 255 is enough for internet paths; the problem is addressing.", "TTL до 255 хватает для путей в интернете; проблема в адресации."],
    ["IPv4 packets cannot cross WAN links", "IPv4 crosses WAN links every day; it is media independent.", "IPv4 ежедневно проходит через каналы WAN; он не зависит от среды."],
    ["ARP requests do not pass through routers", "ARP is local by design and is not the reason for the lost end-to-end model.", "ARP по замыслу локален и не является причиной потери сквозной модели."],
  ], "To make IPv4 survive, private addressing and NAT were created, which ended direct communication with public addressing.", "Чтобы продлить жизнь IPv4, придумали частные адреса и NAT, и прямая связь по публичным адресам прекратилась."),

  tfx("Private IPv4 addresses must be unique across the whole internet.", false,
    "Private addresses are not unique: the same 10.x or 192.168.x addresses are reused inside many organizations.", "Частные адреса не уникальны: одни и те же 10.x или 192.168.x используются во многих организациях.",
    "Calling it true confuses private with public addresses; only public addresses are globally unique and routed between ISPs.", "Считать это верным — значит путать частные адреса с публичными; глобально уникальны и маршрутизируются между провайдерами только публичные."),
];
