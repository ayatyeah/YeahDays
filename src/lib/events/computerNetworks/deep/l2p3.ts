import { qx, tfx, type Draft } from "../../types";

export const deepL2P3: Draft[] = [
  qx("Why does a layered model make networking easier to teach and build?", "It splits a complex process into parts explained one at a time", [
    ["It removes the need for protocols between communicating devices", "Protocols are still required; the model only organises them by layer.", "Протоколы всё равно нужны; модель лишь раскладывает их по уровням."],
    ["It forces every vendor to use the same hardware", "A layered model lets different vendors interoperate; it does not dictate the hardware.", "Уровневая модель позволяет разным производителям работать вместе, а не навязывает одно оборудование."],
    ["It makes every layer use the same PDU name", "Each layer keeps its own PDU name: data, segment, packet, frame, bits.", "У каждого уровня своё имя PDU: данные, сегмент, пакет, кадр, биты."],
  ], "A layered model breaks a complex process into layers so each can be explained and designed on its own.", "Уровневая модель делит сложный процесс на уровни, каждый из которых можно объяснять и проектировать отдельно."),

  qx("How does a layered model assist protocol design?", "A protocol has defined information and an interface to nearby layers", [
    ["A protocol may read and rewrite any header anywhere in the whole stack", "Each protocol works only with its own layer information and the defined interfaces, not every header.", "Протокол работает только со своей информацией и определёнными интерфейсами, а не со всеми заголовками."],
    ["A protocol is written once for all seven layers", "Protocols are specific to a layer; one protocol does not span all seven.", "Протоколы привязаны к уровню; один протокол не охватывает все семь."],
    ["A protocol no longer needs a header of its own", "Protocols still add their own header; that is what encapsulation is.", "Протоколы всё так же добавляют свой заголовок — в этом и состоит инкапсуляция."],
  ], "Protocols at a layer have defined information to work with and a defined interface to the neighbouring layers.", "У протокола на уровне есть определённая информация и определённый интерфейс к соседним уровням."),

  qx("Which benefit of layered models is described by 'products of different vendors work together'?", "It fosters competition", [
    ["It prevents changes in one layer from affecting others", "That benefit is about isolating change between layers, not about vendor interoperability.", "Это преимущество про изоляцию изменений между уровнями, а не про совместимость производителей."],
    ["It gives a common language for networking functions", "The common language benefit is about describing functions, not about products interoperating.", "Общий язык — про описание функций, а не про совместную работу продуктов."],
    ["It assists protocol design with defined interfaces", "Defined interfaces help designers; interoperable products of many vendors is the competition benefit.", "Определённые интерфейсы помогают проектировщикам; совместимость продуктов разных вендоров — это про конкуренцию."],
  ], "Because products from different vendors can work together, a layered model fosters competition.", "Раз продукты разных производителей работают вместе, уровневая модель поощряет конкуренцию."),

  qx("A vendor changes how its physical layer encodes bits. What does the layered model guarantee about the upper layers?", "They are not affected by the change", [
    ["They must be redesigned to match the new encoding", "A key benefit of layering is that changes in one layer do not force changes elsewhere.", "Ключевое преимущество уровней — изменения на одном уровне не вынуждают менять остальные."],
    ["They stop working until the vendor updates them", "Upper layers keep working because they use the same interface to the layer below.", "Верхние уровни продолжают работать, потому что интерфейс к уровню ниже не изменился."],
    ["They must switch to a different PDU name", "PDU names are fixed per layer and do not depend on another layer's internals.", "Имена PDU закреплены за уровнями и не зависят от внутреннего устройства другого уровня."],
  ], "Layering prevents changes in technology or capabilities in one layer from affecting the layers above and below.", "Уровни не дают изменениям технологии на одном уровне затронуть уровни выше и ниже."),

  qx("Which layered-model benefit lets two engineers from different companies discuss a problem precisely?", "A common language to describe networking functions", [
    ["A shared address space used by all vendors and products", "Addressing is a function of specific layers, not a benefit of the model itself.", "Адресация — функция конкретных уровней, а не преимущество самой модели."],
    ["A single mandatory protocol at every layer", "Models allow many protocols per layer; they do not mandate one.", "Модель допускает много протоколов на уровне и не навязывает один."],
    ["A fixed hardware design for every NIC", "Hardware design is up to the vendor; the model only defines functions and interfaces.", "Конструкцию оборудования выбирает производитель; модель задаёт лишь функции и интерфейсы."],
  ], "The model provides a common language and set of terms to describe networking functions and capabilities.", "Модель даёт общий язык и набор терминов для описания сетевых функций."),

  qx("How many layers does the OSI reference model have?", "7", [
    ["4", "Four layers is the TCP/IP model, not OSI.", "Четыре уровня — у модели TCP/IP, а не у OSI."],
    ["5", "OSI has seven layers; five is neither OSI nor the four-layer TCP/IP model.", "У OSI семь уровней; пять не соответствует ни OSI, ни четырёхуровневой TCP/IP."],
    ["6", "Presentation is layer 6, but there is a layer 7 (application) above it.", "Представление — уровень 6, но над ним есть ещё уровень 7 (прикладной)."],
  ], "The OSI model defines seven layers, from physical (1) to application (7).", "Модель OSI определяет семь уровней — от физического (1) до прикладного (7)."),

  qx("Which OSI layer contains protocols used for process-to-process communications?", "Layer 7 Application", [
    ["Layer 6 Presentation", "Presentation handles formatting, compression and encryption, not process-to-process protocols.", "Уровень представления отвечает за формат, сжатие и шифрование, а не за связь процессов."],
    ["Layer 5 Session", "Session manages dialogs between hosts; the process-to-process protocols are at layer 7.", "Сеансовый уровень управляет диалогами; протоколы процесс — процесс находятся на уровне 7."],
    ["Layer 4 Transport", "Transport segments and reassembles data; it carries the application data but is not the application layer.", "Транспортный уровень сегментирует и собирает данные; он несёт данные приложений, но сам не прикладной."],
  ], "The application layer (7) contains the protocols for process-to-process communications such as HTTP, DNS and DHCP.", "Прикладной уровень (7) содержит протоколы связи процесс — процесс: HTTP, DNS, DHCP."),

  qx("Formatting, compression and encryption of data belong to which OSI layer?", "Layer 6 Presentation", [
    ["Layer 7 Application", "Application protocols use the data; a common representation of it is the job of layer 6.", "Прикладные протоколы используют данные; общее представление — задача уровня 6."],
    ["Layer 5 Session", "The session layer manages dialogs, not the format of the data.", "Сеансовый уровень управляет диалогами, а не форматом данных."],
    ["Layer 2 Data Link", "Data link exchanges frames over common media; it does not format or encrypt application data.", "Канальный уровень передаёт кадры по среде и не форматирует и не шифрует данные приложений."],
  ], "The presentation layer provides a common representation of data: formatting, compression and encryption.", "Уровень представления обеспечивает общее представление данных: формат, сжатие, шифрование."),

  qx("Which OSI layer provides services to the presentation layer and manages the data exchange (dialogs)?", "Layer 5 Session", [
    ["Layer 6 Presentation", "Presentation is the layer being served; the one serving it and managing dialogs is session.", "Уровень представления — тот, кого обслуживают; обслуживает и ведёт диалоги сеансовый."],
    ["Layer 4 Transport", "Transport segments and transfers data; dialog management is above it at layer 5.", "Транспортный уровень сегментирует и передаёт данные; управление диалогом — выше, на уровне 5."],
    ["Layer 7 Application", "Application holds process-to-process protocols; it does not provide services to presentation.", "Прикладной уровень содержит протоколы процесс — процесс и не обслуживает уровень представления."],
  ], "The session layer provides services to the presentation layer and organises the dialog between applications.", "Сеансовый уровень обслуживает уровень представления и организует диалог между приложениями."),

  qx("TCP and UDP operate at which OSI layer?", "Layer 4 Transport", [
    ["Layer 3 Network", "Layer 3 is where IP lives; TCP and UDP sit one layer above it.", "На уровне 3 работает IP; TCP и UDP расположены уровнем выше."],
    ["Layer 5 Session", "Session manages dialogs; TCP and UDP are transport protocols at layer 4.", "Сеансовый уровень ведёт диалоги; TCP и UDP — транспортные протоколы уровня 4."],
    ["Layer 2 Data Link", "Layer 2 is Ethernet and MAC addressing, not TCP or UDP.", "Уровень 2 — это Ethernet и MAC-адреса, а не TCP или UDP."],
  ], "The transport layer segments, transfers and reassembles data; TCP and UDP live here.", "Транспортный уровень сегментирует, передаёт и собирает данные; здесь живут TCP и UDP."),

  qx("Which three verbs describe the OSI transport layer in the notes?", "Segments, transfers and reassembles data", [
    ["Formats, compresses and encrypts data", "Those are the presentation layer functions at layer 6.", "Это функции уровня представления, уровня 6."],
    ["Activates, maintains and de-activates connections", "That describes the physical layer handling physical connections.", "Так описан физический уровень, работающий с физическими соединениями."],
    ["Addresses, routes and forwards packets", "Logical addressing and routing are network layer tasks at layer 3.", "Логическая адресация и маршрутизация — задачи сетевого уровня, уровня 3."],
  ], "The transport layer segments data, transfers it and reassembles it at the destination.", "Транспортный уровень сегментирует данные, передаёт их и собирает у получателя."),

  qx("Logical addressing and routing are the job of which OSI layer?", "Layer 3 Network", [
    ["Layer 2 Data Link", "Data link uses physical MAC addresses on one medium; logical addressing is layer 3.", "Канальный уровень использует физические MAC-адреса в одной среде; логическая адресация — уровень 3."],
    ["Layer 4 Transport", "Transport deals with segments and ports, not with routing between networks.", "Транспортный уровень работает с сегментами и портами, а не с маршрутизацией между сетями."],
    ["Layer 1 Physical", "Physical moves bits and signals and has no concept of addresses.", "Физический уровень переносит биты и сигналы и не знает об адресах."],
  ], "The network layer exchanges individual pieces of data over the network using logical addresses and routing.", "Сетевой уровень передаёт отдельные части данных по сети, используя логические адреса и маршрутизацию."),

  qx("Which OSI layer exchanges frames between devices over a common media?", "Layer 2 Data Link", [
    ["Layer 3 Network", "Layer 3 exchanges packets across networks; frames over one medium are layer 2.", "Уровень 3 передаёт пакеты между сетями; кадры по одной среде — уровень 2."],
    ["Layer 1 Physical", "Physical sends bits as signals; it does not build or read frames.", "Физический уровень шлёт биты сигналами и не создаёт и не читает кадры."],
    ["Layer 4 Transport", "Transport handles segments; a frame is a layer 2 PDU.", "Транспортный уровень работает с сегментами; кадр — это PDU уровня 2."],
  ], "The data link layer exchanges frames over a common media and uses MAC addresses.", "Канальный уровень обменивается кадрами через общую среду и использует MAC-адреса."),

  qx("Which OSI layer activates, maintains and de-activates physical connections?", "Layer 1 Physical", [
    ["Layer 2 Data Link", "Data link exchanges frames over the medium; managing the physical connection itself is layer 1.", "Канальный уровень передаёт кадры по среде; самим физическим соединением управляет уровень 1."],
    ["Layer 5 Session", "Session manages dialogs between applications, not electrical or optical connections.", "Сеансовый уровень ведёт диалоги приложений, а не электрические или оптические соединения."],
    ["Layer 3 Network", "Network does logical addressing and routing; it has no role in the physical link.", "Сетевой уровень делает логическую адресацию и маршрутизацию и не касается физического канала."],
  ], "The physical layer activates, maintains and de-activates the physical connections: bits, cables, signals.", "Физический уровень включает, поддерживает и отключает физические соединения: биты, кабели, сигналы."),

  qx("How many layers does the TCP/IP model have?", "4", [
    ["7", "Seven layers is the OSI reference model, not TCP/IP.", "Семь уровней — у эталонной модели OSI, а не у TCP/IP."],
    ["3", "TCP/IP has four layers: application, transport, internet and network access.", "У TCP/IP четыре уровня: приложений, транспортный, интернет и сетевого доступа."],
    ["5", "No five-layer model is described in the notes; TCP/IP has four.", "Пятиуровневой модели в конспекте нет; у TCP/IP четыре уровня."],
  ], "The TCP/IP model has four layers: application, transport, internet and network access.", "Модель TCP/IP содержит четыре уровня: приложений, транспортный, интернет и сетевого доступа."),

  qx("Which TCP/IP layer represents data to the user, plus encoding and dialog control?", "Application", [
    ["Transport", "Transport supports communication between devices across networks; data representation is the application layer.", "Транспортный уровень поддерживает связь устройств через сети; представление данных — уровень приложений."],
    ["Internet", "Internet determines the best path; it does not encode data or control dialogs.", "Уровень интернет выбирает лучший путь и не кодирует данные и не ведёт диалоги."],
    ["Network Access", "Network access controls hardware and media, the lowest functions, not user data.", "Сетевой доступ управляет оборудованием и средой, а не данными пользователя."],
  ], "The TCP/IP application layer represents data to the user and adds encoding and dialog control (OSI 5, 6, 7).", "Уровень приложений TCP/IP представляет данные пользователю и добавляет кодирование и управление диалогом (OSI 5, 6, 7)."),

  qx("Which TCP/IP layer 'supports communication between devices across diverse networks'?", "Transport", [
    ["Application", "Application represents data to the user; device-to-device communication is transport.", "Уровень приложений представляет данные пользователю; связь между устройствами — транспортный."],
    ["Internet", "Internet determines the best path through the network, which is the OSI layer 3 role.", "Уровень интернет определяет лучший путь через сеть — роль уровня 3 OSI."],
    ["Network Access", "Network access controls hardware devices and media (OSI 1 and 2).", "Сетевой доступ управляет оборудованием и средой (OSI 1 и 2)."],
  ], "The transport layer supports communication between diverse devices across diverse networks, matching OSI layer 4.", "Транспортный уровень поддерживает связь между разными устройствами через разные сети и соответствует уровню 4 OSI."),

  qx("Which TCP/IP layer controls the hardware devices and media that make up the network?", "Network Access", [
    ["Internet", "Internet picks the path through the network; hardware and media control is network access.", "Уровень интернет выбирает путь; управление оборудованием и средой — сетевой доступ."],
    ["Transport", "Transport is about end-to-end communication between devices, not hardware or media.", "Транспортный уровень — про связь между устройствами, а не про оборудование и среду."],
    ["Application", "Application is the top layer, farthest from hardware and media.", "Уровень приложений — верхний, самый далёкий от оборудования и среды."],
  ], "The network access layer controls the hardware devices and media; it covers OSI layers 1 and 2.", "Уровень сетевого доступа управляет оборудованием и средой; он охватывает уровни 1 и 2 OSI."),

  qx("The TCP/IP internet layer corresponds to which OSI layer?", "Layer 3 Network", [
    ["Layer 4 Transport", "OSI layer 4 maps to the TCP/IP transport layer, not internet.", "Уровень 4 OSI соответствует транспортному уровню TCP/IP, а не интернет."],
    ["Layer 2 Data Link", "Layer 2 is part of the TCP/IP network access layer.", "Уровень 2 входит в уровень сетевого доступа TCP/IP."],
    ["Layer 5 Session", "Layer 5 is folded into the TCP/IP application layer.", "Уровень 5 входит в уровень приложений TCP/IP."],
  ], "The internet layer determines the best path through the network, which is exactly OSI layer 3.", "Уровень интернет определяет лучший путь через сеть — это и есть уровень 3 OSI."),

  qx("In the OSI summary table, which protocols are listed as examples at layer 7?", "HTTP, DNS, DHCP", [
    ["TLS, JPEG", "TLS and JPEG are the layer 6 presentation examples (encryption and format).", "TLS и JPEG — примеры уровня 6, представления (шифрование и формат)."],
    ["TCP, UDP", "TCP and UDP are the layer 4 transport examples.", "TCP и UDP — примеры транспортного уровня 4."],
    ["IP, router", "IP and the router belong to layer 3 network.", "IP и маршрутизатор относятся к сетевому уровню 3."],
  ], "The table lists HTTP, DNS and DHCP as application layer protocols.", "В таблице HTTP, DNS и DHCP указаны как протоколы прикладного уровня."),

  qx("Which pair in the summary table is attached to the presentation layer?", "TLS, JPEG", [
    ["HTTP, DNS", "HTTP and DNS are application layer (7) examples.", "HTTP и DNS — примеры прикладного уровня (7)."],
    ["TCP, UDP", "TCP and UDP are transport layer (4) examples.", "TCP и UDP — примеры транспортного уровня (4)."],
    ["Ethernet, switch", "Ethernet and the switch belong to the data link layer (2).", "Ethernet и коммутатор относятся к канальному уровню (2)."],
  ], "TLS (encryption) and JPEG (format) illustrate layer 6, presentation.", "TLS (шифрование) и JPEG (формат) иллюстрируют уровень 6, представления."),

  qx("Which OSI layer has no example device or protocol in the summary table?", "Layer 5 Session", [
    ["Layer 6 Presentation", "Presentation is illustrated by TLS and JPEG.", "Уровень представления проиллюстрирован TLS и JPEG."],
    ["Layer 4 Transport", "Transport is illustrated by TCP and UDP.", "Транспортный уровень проиллюстрирован TCP и UDP."],
    ["Layer 1 Physical", "Physical is illustrated by cables and the hub.", "Физический уровень проиллюстрирован кабелями и концентратором."],
  ], "The session layer row has a dash: its keyword is 'dialogs' and no protocol or device is listed.", "В строке сеансового уровня стоит прочерк: ключевое слово — «диалоги», протокола или устройства нет."),

  qx("According to the summary table, which device is the typical example at layer 3?", "Router", [
    ["Switch", "The switch is the layer 2 example, working with frames and MAC addresses.", "Коммутатор — пример уровня 2, работает с кадрами и MAC-адресами."],
    ["Hub", "The hub is the layer 1 example alongside cables.", "Концентратор — пример уровня 1 вместе с кабелями."],
    ["NIC", "The NIC is not listed in the table; the layer 3 device is the router.", "Сетевая карта в таблице не указана; устройство уровня 3 — маршрутизатор."],
  ], "Layer 3 is keyed by logical address and routing; its examples are IP and the router.", "Уровень 3 — логический адрес и маршрутизация; его примеры — IP и маршрутизатор."),

  qx("Which keywords does the table assign to layer 4?", "Segments, ports", [
    ["Frames, MAC", "Frames and MAC are the layer 2 keywords.", "Кадры и MAC — ключевые слова уровня 2."],
    ["Bits, signals", "Bits and signals are the layer 1 keywords.", "Биты и сигналы — ключевые слова уровня 1."],
    ["Logical address, routing", "Logical address and routing are the layer 3 keywords.", "Логический адрес и маршрутизация — ключевые слова уровня 3."],
  ], "The transport layer is remembered by segments and ports, with TCP and UDP as examples.", "Транспортный уровень запоминается по сегментам и портам, примеры — TCP и UDP."),

  qx("A hub and cables are the examples for which layer in the table?", "Layer 1 Physical", [
    ["Layer 2 Data Link", "Layer 2 examples are Ethernet and the switch, not the hub.", "Примеры уровня 2 — Ethernet и коммутатор, а не концентратор."],
    ["Layer 3 Network", "Layer 3 examples are IP and the router.", "Примеры уровня 3 — IP и маршрутизатор."],
    ["Layer 4 Transport", "Layer 4 examples are TCP and UDP, not hardware.", "Примеры уровня 4 — TCP и UDP, а не оборудование."],
  ], "Cables and the hub carry bits and signals, so they illustrate the physical layer.", "Кабели и концентратор несут биты и сигналы, поэтому иллюстрируют физический уровень."),

  qx("What does segmenting do to a message?", "Breaks it into smaller units for transmission", [
    ["Encrypts it so only the receiver can read it", "Encryption is a presentation layer function, not segmenting.", "Шифрование — функция уровня представления, а не сегментация."],
    ["Numbers its parts so they can be reassembled", "Numbering the parts is sequencing; segmenting is the act of splitting.", "Нумерация частей — это упорядочивание; сегментация — само разбиение."],
    ["Interleaves it with other streams on the link", "Interleaving streams is multiplexing, which follows segmenting.", "Чередование потоков — мультиплексирование, которое следует за сегментацией."],
  ], "Segmenting breaks a message into smaller units that are sent separately.", "Сегментация делит сообщение на меньшие части, которые передаются отдельно."),

  qx("What is multiplexing in the context of segmented data?", "Interleaving several streams of segments on the same link", [
    ["Splitting one long message into many fixed-size pieces for sending", "Splitting a message into pieces is segmenting, not multiplexing.", "Разбиение сообщения на части — сегментация, а не мультиплексирование."],
    ["Retransmitting only the segments that failed", "Retransmitting failed segments is the efficiency benefit, not multiplexing itself.", "Повторная отправка потерянных сегментов — выгода эффективности, а не само мультиплексирование."],
    ["Numbering segments in the order they were sent", "Numbering the segments is sequencing, done by TCP.", "Нумерация сегментов — упорядочивание, которым занимается TCP."],
  ], "Multiplexing interleaves the segments of several conversations so one message does not tie up the link.", "Мультиплексирование чередует сегменты нескольких потоков, чтобы одно сообщение не занимало канал."),

  qx("Which two benefits of segmenting and multiplexing are named in the notes?", "Speed and efficiency", [
    ["Security and privacy", "Segmenting does not protect content; encryption at layer 6 does that.", "Сегментация не защищает содержимое; этим занимается шифрование на уровне 6."],
    ["Addressing and routing", "Addressing and routing are layer 3 tasks unrelated to splitting messages.", "Адресация и маршрутизация — задачи уровня 3, не связанные с разбиением сообщений."],
    ["Compression and formatting", "Compression and formatting are presentation layer tasks.", "Сжатие и форматирование — задачи уровня представления."],
  ], "Speed, because the link is not tied up by one message, and efficiency, because only failed segments are retransmitted.", "Скорость — канал не занят одним сообщением, и эффективность — повторно шлются только потерянные сегменты."),

  qx("Why does segmenting increase speed on a shared link?", "The link is not tied up by one large message", [
    ["Each segment is sent at a higher bit rate", "The bit rate of the medium does not change; segments simply share the link in turn.", "Битовая скорость среды не меняется; сегменты просто по очереди делят канал."],
    ["Segments skip the lower layers of the stack", "Every segment still passes through all layers; nothing is skipped.", "Каждый сегмент всё равно проходит через все уровни; ничего не пропускается."],
    ["Headers are no longer added to the data", "Headers are still added to each segment during encapsulation.", "Заголовки по-прежнему добавляются к каждому сегменту при инкапсуляции."],
  ], "Because the message is split, many conversations can be interleaved and no single message monopolises the link.", "Раз сообщение разбито, можно чередовать много потоков, и ни одно сообщение не занимает канал целиком."),

  qx("Why does segmenting increase efficiency when something is lost?", "Only the failed segments have to be retransmitted", [
    ["The whole message is resent at once from the beginning", "Resending everything is what segmenting avoids; only lost parts go again.", "Пересылать всё — именно то, чего сегментация избегает; повторно идут только потерянные части."],
    ["Lost segments are simply ignored", "Lost segments are retransmitted so the message can be reassembled.", "Потерянные сегменты пересылаются повторно, чтобы сообщение можно было собрать."],
    ["Segments are compressed before sending", "Compression is a presentation layer task and is not part of this benefit.", "Сжатие — задача уровня представления и к этой выгоде не относится."],
  ], "If a segment fails to reach the destination, only that segment is retransmitted, not the whole message.", "Если сегмент не дошёл, повторно отправляется только он, а не всё сообщение."),

  qx("Which protocol is responsible for sequencing segments so they can be reassembled?", "TCP", [
    ["UDP", "UDP is a transport protocol too, but the notes name TCP as responsible for sequencing.", "UDP тоже транспортный протокол, но за упорядочивание, по конспекту, отвечает TCP."],
    ["IP", "IP works at layer 3 and routes packets; it does not number segments.", "IP работает на уровне 3 и маршрутизирует пакеты, а не нумерует сегменты."],
    ["Ethernet", "Ethernet is a layer 2 protocol exchanging frames, not segments.", "Ethernet — протокол уровня 2, обменивается кадрами, а не сегментами."],
  ], "Sequencing numbers the individual segments; TCP is responsible for it.", "Упорядочивание нумерует сегменты; за него отвечает TCP."),

  qx("What is encapsulation?", "Protocols adding their own information to the data, going top down", [
    ["Each layer removing its own header and passing the rest up the stack", "Removing headers on the way up is de-encapsulation.", "Снятие заголовков по пути вверх — это деинкапсуляция."],
    ["Splitting a message into smaller units", "Splitting a message into units is segmenting.", "Разбиение сообщения на части — сегментация."],
    ["Numbering segments so they can be reassembled", "Numbering segments is sequencing, a TCP job.", "Нумерация сегментов — упорядочивание, задача TCP."],
  ], "Encapsulation is the process where each protocol adds its own information (header) to the data as it moves down the stack.", "Инкапсуляция — процесс, при котором каждый протокол добавляет к данным свою информацию (заголовок) по пути вниз по стеку."),

  qx("What is the PDU called at the network (internet) layer?", "Packet", [
    ["Frame", "A frame is the layer 2 PDU; at layer 3 the unit is called a packet.", "Кадр — PDU уровня 2; на уровне 3 единица называется пакетом."],
    ["Segment", "A segment is the transport layer PDU, one layer above.", "Сегмент — PDU транспортного уровня, уровнем выше."],
    ["Data", "Data is the PDU name at the application layer.", "Данные — имя PDU на прикладном уровне."],
  ], "At the network (internet) layer the PDU is the packet.", "На сетевом (интернет) уровне PDU называется пакетом."),

  qx("What is the PDU at the application layer and at the physical layer, respectively?", "Data and bits", [
    ["Segment and frame", "Segment is transport and frame is data link, not the top and bottom layers.", "Сегмент — транспортный, кадр — канальный, а не верхний и нижний уровни."],
    ["Bits and data", "The order is reversed: application is data, physical is bits.", "Порядок перепутан: прикладной — данные, физический — биты."],
    ["Packet and bits", "Packet is the network layer PDU, not the application layer PDU.", "Пакет — PDU сетевого уровня, а не прикладного."],
  ], "The application layer PDU is simply called data; the physical layer PDU is bits.", "PDU прикладного уровня называется просто данными, физического — битами."),

  qx("A web server sends a page. Which header is added to the HTTP data first?", "TCP header", [
    ["IP header", "The IP header comes after the TCP header, turning the segment into a packet.", "Заголовок IP добавляется после TCP и превращает сегмент в пакет."],
    ["Ethernet header", "Ethernet header and trailer come last, forming the frame.", "Заголовок и концевик Ethernet добавляются последними, образуя кадр."],
    ["HTTP header", "HTTP information is the data itself; the first encapsulating header below it is TCP.", "Информация HTTP — это сами данные; первый заголовок ниже них — TCP."],
  ], "The HTTP data first gets a TCP header (segment), then IP (packet), then Ethernet header and trailer (frame).", "К данным HTTP сначала добавляется заголовок TCP (сегмент), затем IP (пакет), затем заголовок и концевик Ethernet (кадр)."),

  qx("Which layer adds both a header and a trailer in the web page example?", "Data link (Ethernet)", [
    ["Transport (TCP)", "TCP adds only a header to form the segment.", "TCP добавляет только заголовок, образуя сегмент."],
    ["Network (IP)", "IP adds only a header to form the packet.", "IP добавляет только заголовок, образуя пакет."],
    ["Physical", "The physical layer adds nothing; it converts the frame into bits.", "Физический уровень ничего не добавляет; он превращает кадр в биты."],
  ], "The Ethernet frame has both a header and a trailer around the IP packet.", "У кадра Ethernet есть и заголовок, и концевик вокруг IP-пакета."),

  qx("The client receives the web page as bits. In which order is information removed during de-encapsulation?", "Ethernet, IP, TCP", [
    ["TCP, IP, Ethernet", "That is the order headers were added; removal goes bottom up, Ethernet first.", "Это порядок добавления заголовков; снимаются они снизу вверх, Ethernet первым."],
    ["IP, Ethernet, TCP", "Ethernet is the outermost layer and must be removed before IP.", "Ethernet — самый внешний слой и снимается раньше IP."],
    ["Ethernet, TCP, IP", "After Ethernet comes the IP header, then the TCP header.", "После Ethernet идёт заголовок IP, затем заголовок TCP."],
  ], "De-encapsulation goes up the stack: Ethernet, then IP, then TCP, until the browser gets the page.", "Деинкапсуляция идёт вверх по стеку: Ethernet, затем IP, затем TCP, пока браузер не получит страницу."),

  tfx("Encapsulation proceeds from the bottom of the stack to the top.", false,
    "Encapsulation goes top down: data, segment, packet, frame, bits. Bottom up is de-encapsulation.",
    "Инкапсуляция идёт сверху вниз: данные, сегмент, пакет, кадр, биты. Снизу вверх — деинкапсуляция.",
    "Choosing True confuses encapsulation with de-encapsulation, which strips headers going up.",
    "Ответ «верно» путает инкапсуляцию с деинкапсуляцией, которая снимает заголовки по пути вверх."),
];
