import { qx, tfx, type Draft } from "../../types";

/** Разбор до косточек: лекция 2, часть 1 — правила общения и что делают протоколы. */
export const deepL2P1: Draft[] = [
  qx("Which three elements are present in every communication?", "A source, a destination and a channel", [
    ["A client, a server and a router in between", "Client and server are roles of end devices, and a router is just one kind of intermediary; the general elements are source, destination and channel.", "Клиент и сервер — роли конечных устройств, а маршрутизатор — лишь один из посредников; общие элементы — источник, получатель и канал."],
    ["Encoding, formatting and timing", "These are things a protocol must define, not the elements of the communication itself.", "Это то, что должен определять протокол, а не элементы самого общения."],
    ["A sender, a switch and a cable", "A switch and a cable are implementation details; the notes name a sender, a receiver and a channel (media).", "Коммутатор и кабель — детали реализации; в конспекте названы отправитель, получатель и канал (среда)."],
  ], "Every communication has a source (sender), a destination (receiver) and a channel (media) that provides the path.", "В любом общении есть источник (отправитель), получатель и канал (среда), по которому идёт сообщение."),

  qx("In the three-element model of communication, what does the channel provide?", "The path over which the message travels", [
    ["The identity of the sender", "Identifying the sender is a matter of addressing, part of the protocol rules, not of the channel.", "Определение отправителя — вопрос адресации, часть правил протокола, а не канала."],
    ["The rules that the communication must follow", "The rules are the protocols; the channel is only the media that carries the message.", "Правила — это протоколы; канал — лишь среда, которая несёт сообщение."],
    ["The content of the message", "The content comes from the source; the channel carries it but does not create it.", "Содержимое создаёт источник; канал его переносит, но не создаёт."],
  ], "The channel, also called the media, provides the pathway from source to destination.", "Канал, он же среда, даёт путь от источника к получателю."),

  qx("What are protocols, as defined in the notes?", "The rules that a communication follows", [
    ["The cables and signals that carry data", "Cables and signals are the physical channel; protocols are the agreed rules, not hardware.", "Кабели и сигналы — физический канал; протоколы — согласованные правила, а не железо."],
    ["The devices that forward messages", "Routers and switches forward messages, but they do so by following protocols; they are not the protocols.", "Маршрутизаторы и коммутаторы пересылают сообщения, следуя протоколам; сами они протоколами не являются."],
    ["The applications that generate traffic", "Applications produce messages; the protocols govern how those messages are exchanged.", "Приложения порождают сообщения; протоколы определяют, как эти сообщения передаются."],
  ], "All communications are governed by protocols, the rules that the communication follows.", "Любое общение подчиняется протоколам — правилам, по которым оно идёт."),

  qx("Two devices are physically connected but still cannot exchange data. What is missing?", "An agreement on how to communicate", [
    ["A longer cable between them", "Cable length is about reach; the devices already have a connection, which the notes say is not enough by itself.", "Длина кабеля — вопрос дальности; соединение уже есть, а его по конспекту недостаточно."],
    ["A faster processor in each device", "Speed is irrelevant here; without shared rules even fast devices cannot understand each other.", "Скорость тут ни при чём; без общих правил даже быстрые устройства не поймут друг друга."],
    ["A second channel dedicated to replies", "One channel can carry both directions; the problem is the lack of common rules, not of channels.", "Один канал может нести оба направления; проблема в отсутствии общих правил, а не каналов."],
  ], "A connection is not enough; devices must agree on how to communicate, which is what protocols provide.", "Одного соединения мало: устройства должны договориться, как общаться, и это дают протоколы."),

  qx("Which of these is one of the things protocols must account for when establishing the rules?", "An identified sender and receiver", [
    ["A shared power supply", "Devices do not need to share power to talk; the rules concern identification, language, timing and acknowledgment.", "Общий источник питания для общения не нужен; правила касаются идентификации, языка, времени и подтверждений."],
    ["The same operating system on both devices", "Protocols exist precisely so that different systems can talk; a common OS is not required.", "Протоколы как раз и существуют, чтобы разные системы могли общаться; общая ОС не требуется."],
    ["The same brand of hardware", "Vendor independence is a goal of protocols, not a requirement of communication.", "Независимость от производителя — цель протоколов, а не требование общения."],
  ], "Protocols must account for an identified sender and receiver, a common language and grammar, speed and timing, and acknowledgment requirements.", "Протоколы должны учитывать определённых отправителя и получателя, общий язык и грамматику, скорость и время доставки и требования к подтверждению."),

  qx("Like people in a conversation, devices need a 'common language and grammar'. Which rule category is that?", "Establishing the rules of communication", [
    ["Message delivery options such as multicast", "Delivery options are about who receives the message (one, a group or all), not about the shared language.", "Варианты доставки — о том, кто получает сообщение (один, группа или все), а не об общем языке."],
    ["Message timing", "Timing covers flow control, timeouts and access method, not the shared vocabulary and syntax.", "Синхронизация охватывает управление потоком, тайм-ауты и метод доступа, а не общую лексику и синтаксис."],
    ["Message size", "Size concerns breaking long messages into pieces, not whether the parties understand each other.", "Размер касается деления длинных сообщений на части, а не взаимопонимания сторон."],
  ], "A common language and grammar is one of the four requirements listed under establishing the rules.", "Общий язык и грамматика — одно из четырёх требований в разделе об установлении правил."),

  qx("Which requirement from 'establishing the rules' is about whether the receiver must say it got the message?", "Confirmation or acknowledgment requirements", [
    ["The required speed and timing of message delivery", "Speed and timing govern how fast and when data is sent, not whether receipt must be confirmed.", "Скорость и время определяют, как быстро и когда посылать данные, а не нужно ли подтверждать получение."],
    ["Common language and grammar", "The shared language ensures the message is understood, not that its arrival is reported back.", "Общий язык обеспечивает понимание сообщения, а не отчёт о его прибытии."],
    ["Identified sender and receiver", "Identification says who is talking to whom; it does not require any reply.", "Идентификация говорит, кто с кем общается; ответа она не требует."],
  ], "Acknowledgment requirements define whether and how the receiver confirms that a message arrived.", "Требования к подтверждению определяют, нужно ли и как получатель подтверждает приход сообщения."),

  qx("Which list contains only things a protocol must define, according to the notes?", "Encoding, formatting, size, timing, delivery options", [
    ["Encoding, routing, security, discovery, timing", "Routing, security and discovery are types of protocols, not the five things every protocol must define.", "Маршрутизация, безопасность и обнаружение — типы протоколов, а не пять вещей, которые должен определять каждый протокол."],
    ["Source, destination, channel, size, timing", "Source, destination and channel are the elements of communication, not protocol definitions.", "Источник, получатель и канал — элементы общения, а не определения протокола."],
    ["Addressing, reliability, sequencing, size, delivery options", "Addressing, reliability and sequencing are protocol functions; the list of definitions is different.", "Адресация, надёжность и упорядочивание — функции протоколов; список определений другой."],
  ], "A protocol must define message encoding, formatting and encapsulation, size, timing and delivery options.", "Протокол должен определять кодирование, формат и инкапсуляцию, размер, синхронизацию и варианты доставки."),

  qx("What is message encoding?", "Converting information into a form suitable for transmission", [
    ["Breaking a long message into smaller pieces", "That is message size handling (segmenting), not encoding.", "Это работа с размером сообщения (сегментация), а не кодирование."],
    ["Adding a header carrying the sender's and receiver's addresses", "Adding headers is encapsulation, part of formatting, not encoding.", "Добавление заголовков — инкапсуляция, часть форматирования, а не кодирование."],
    ["Choosing who will receive the message", "Choosing one, a group or all receivers is a delivery option, not encoding.", "Выбор одного, группы или всех получателей — вариант доставки, а не кодирование."],
  ], "Encoding converts information into another acceptable form for transmission; decoding reverses it.", "Кодирование преобразует информацию в форму, пригодную для передачи; декодирование — обратный процесс."),

  qx("Which term names the reverse of encoding, performed by the receiver?", "Decoding", [
    ["De-encapsulation", "De-encapsulation removes headers added by lower layers; it is the reverse of encapsulation, not of encoding.", "Деинкапсуляция снимает заголовки нижних уровней; это обратное инкапсуляции, а не кодированию."],
    ["Reassembly", "Reassembly puts message pieces back together; it reverses segmentation, not encoding.", "Сборка соединяет части сообщения; она обратна сегментации, а не кодированию."],
    ["Acknowledgment", "An acknowledgment confirms receipt; it does not convert the message back into its original form.", "Подтверждение сообщает о получении; оно не возвращает сообщение к исходной форме."],
  ], "The notes state that decoding reverses encoding.", "В конспекте сказано: декодирование — обратный кодированию процесс."),

  qx("On what does the required format or structure of a message depend?", "The message type and the channel used", [
    ["The speed of the sender's CPU", "Processor speed affects how fast a message is built, not which structure it must have.", "Скорость процессора влияет на то, как быстро строится сообщение, а не на его структуру."],
    ["The length of the cable", "Cable length matters for signals, not for the message's format or structure.", "Длина кабеля важна для сигналов, а не для формата или структуры сообщения."],
    ["The number of receivers of the message", "The number of receivers is a delivery option; the notes tie format to message type and channel.", "Число получателей — вариант доставки; в конспекте формат связан с типом сообщения и каналом."],
  ], "A message must use a specific format that depends on the type of message and the channel.", "У сообщения должен быть определённый формат, зависящий от типа сообщения и канала."),

  qx("A long message is too big for the channel. How does the protocol handle message size?", "It is split into pieces within the min and max size", [
    ["It is compressed until the whole thing fits in one frame", "The notes describe breaking the message into pieces, not compressing it into a single frame.", "В конспекте сообщение делится на части, а не сжимается в один кадр."],
    ["It is sent slower to avoid overflow", "Sending slower is flow control, a timing matter; size is handled by dividing the message.", "Медленная отправка — управление потоком, вопрос синхронизации; размер решается делением сообщения."],
    ["It is discarded and must be rewritten", "Protocols do not reject long messages; they segment them so every piece fits the size limits.", "Протоколы не отвергают длинные сообщения; они сегментируют их, чтобы каждая часть укладывалась в лимиты."],
  ], "A long message is broken into pieces that meet the minimum and maximum size requirements.", "Длинное сообщение делится на части, укладывающиеся в минимальный и максимальный размер."),

  qx("When a message is split into frames, which statement about the pieces is true?", "Each frame carries its own addressing information", [
    ["Only the first frame carries the addressing information", "Every frame travels independently, so each one needs addressing, not only the first.", "Каждый кадр идёт самостоятельно, поэтому адрес нужен каждому, а не только первому."],
    ["The frames must all be the same size", "The pieces must fit between the minimum and maximum size; they need not be identical in length.", "Части должны укладываться между минимальным и максимальным размером; одинаковой длины не требуется."],
    ["The sender reassembles the frames", "Reconstruction happens at the receiver, which puts the pieces back into the original message.", "Сборка происходит у получателя, который восстанавливает исходное сообщение из частей."],
  ], "Each frame has its own addressing information, and the receiving host reconstructs the message.", "У каждого кадра своя адресация, а принимающий узел собирает сообщение обратно."),

  qx("Which three things make up 'message timing'?", "Flow control, response timeout, access method", [
    ["Encoding, decoding, formatting", "These concern how the message is represented, not when or how fast it is sent.", "Это о том, как сообщение представлено, а не о том, когда и как быстро его посылать."],
    ["Unicast, multicast, broadcast", "These are delivery options describing who receives the message, not timing.", "Это варианты доставки — кто получает сообщение, а не синхронизация."],
    ["Addressing, sequencing, reliability, error detection", "These are protocol functions from a different list; none of them is a timing element.", "Это функции протоколов из другого списка; ни одна не является элементом синхронизации."],
  ], "Message timing covers flow control, response timeout and the access method.", "Синхронизация сообщений включает управление потоком, тайм-аут ответа и метод доступа."),

  qx("A fast server is overwhelming a slow client. Which timing element solves this?", "Flow control", [
    ["Response timeout", "A timeout decides how long to wait for a reply; it does not slow the sender down.", "Тайм-аут решает, сколько ждать ответа; отправителя он не замедляет."],
    ["Access method", "The access method decides when a device may transmit on shared media, not how much data it may push.", "Метод доступа определяет, когда устройство может передавать в общей среде, а не сколько данных слать."],
    ["Error detection", "Error detection finds corrupted data; it does nothing about the rate of transmission.", "Обнаружение ошибок находит повреждённые данные; на скорость передачи оно не влияет."],
  ], "Flow control manages the rate of transmission: how much information can be sent and how fast.", "Управление потоком регулирует скорость передачи: сколько можно отправить и как быстро."),

  qx("A device sends a request, hears nothing, and after a set time gives up or retries. Which element is this?", "Response timeout", [
    ["Flow control", "Flow control adjusts the sending rate; it does not define how long to wait for a missing reply.", "Управление потоком подстраивает скорость отправки; сколько ждать пропавшего ответа, оно не задаёт."],
    ["Access method", "The access method governs when a device may start sending, not what to do when no answer comes.", "Метод доступа определяет, когда можно начать передачу, а не что делать при отсутствии ответа."],
    ["Message sequencing", "Sequencing numbers the pieces of a message; it has nothing to do with waiting for a reply.", "Упорядочивание нумерует части сообщения; к ожиданию ответа оно не относится."],
  ], "Response timeout specifies how long a device waits when it hears no reply from the destination.", "Тайм-аут ответа задаёт, сколько устройство ждёт, если ответа от получателя нет."),

  qx("Which message timing element determines when a device is allowed to send?", "Access method", [
    ["Response timeout", "The timeout concerns waiting for replies, not permission to transmit.", "Тайм-аут связан с ожиданием ответа, а не с разрешением передавать."],
    ["Flow control", "Flow control limits how much and how fast; the access method decides when sending may begin.", "Управление потоком ограничивает объём и скорость; метод доступа решает, когда можно начинать."],
    ["Delivery option", "Delivery options describe who receives (one, group, all), not the moment of transmission.", "Варианты доставки описывают, кто получает (один, группа, все), а не момент передачи."],
  ], "The access method determines when someone can send a message, helping to avoid collisions.", "Метод доступа определяет, когда можно передавать, помогая избегать коллизий."),

  qx("What is a collision, as described in the notes?", "Two or more devices send at once and the messages corrupt", [
    ["A receiver gets the same message twice from the same sender", "A duplicate is a reliability or sequencing matter, not a collision on the media.", "Дубликат — вопрос надёжности или упорядочивания, а не коллизия в среде."],
    ["A message exceeds the maximum size", "Oversized messages are a size problem handled by splitting; they are not collisions.", "Слишком большие сообщения — проблема размера, решаемая делением; это не коллизии."],
    ["A reply arrives after the timeout", "A late reply is a timeout event; a collision happens during simultaneous transmission.", "Опоздавший ответ — событие тайм-аута; коллизия происходит при одновременной передаче."],
  ], "A collision happens when more than one device sends at the same time and the messages become corrupt.", "Коллизия возникает, когда несколько устройств передают одновременно и сообщения портятся."),

  qx("Which delivery option describes one-to-one communication?", "Unicast", [
    ["Multicast", "Multicast is one to many: the message goes to a group of interested receivers.", "Multicast — один группе: сообщение идёт группе заинтересованных получателей."],
    ["Broadcast", "Broadcast is one to all: every device on the network receives the message.", "Broadcast — один всем: сообщение получает каждое устройство в сети."],
    ["Anycast", "Anycast is not among the three delivery options in the notes (unicast, multicast, broadcast).", "Anycast не входит в три варианта доставки из конспекта (unicast, multicast, broadcast)."],
  ], "Unicast delivers a message from one sender to exactly one receiver.", "Unicast доставляет сообщение от одного отправителя ровно одному получателю."),

  qx("A video stream is sent only to the devices that subscribed to it. Which delivery option is that?", "Multicast", [
    ["Unicast", "Unicast would need a separate copy of the stream for every single subscriber.", "При unicast для каждого подписчика понадобилась бы отдельная копия потока."],
    ["Broadcast", "Broadcast reaches every device on the network, including those that never subscribed.", "Broadcast дошёл бы до всех устройств сети, включая тех, кто не подписывался."],
    ["Flow control", "Flow control is a timing mechanism, not a way of choosing the receivers.", "Управление потоком — механизм синхронизации, а не способ выбора получателей."],
  ], "Multicast is one to many: the message goes to a group, as in the table's video-stream example.", "Multicast — один группе: сообщение идёт группе, как в примере с видеопотоком из таблицы."),

  qx("In the delivery-options table, which example is given for broadcast?", "An ARP request", [
    ["A web page sent to one PC", "A web page to one PC is the unicast example: one sender, one receiver.", "Веб-страница одному ПК — пример unicast: один отправитель, один получатель."],
    ["A video stream to subscribers", "The video stream is the multicast example, sent to a group.", "Видеопоток — пример multicast, он идёт группе."],
    ["A TCP acknowledgment", "An acknowledgment goes back to a single sender, so it is unicast, and it is not in the table.", "Подтверждение идёт одному отправителю, то есть unicast, и в таблице его нет."],
  ], "An ARP request is sent to everyone on the network, which is the broadcast example in the table.", "Запрос ARP отправляется всем в сети — это пример broadcast из таблицы."),

  qx("Who receives a multicast message, according to the table?", "A group of devices", [
    ["Exactly one device", "One device is the receiver of a unicast, such as a web page to one PC.", "Одно устройство — получатель unicast, например веб-страницы одному ПК."],
    ["Every device on the network", "Everyone on the network receives a broadcast, such as an ARP request.", "Все устройства сети получают broadcast, например запрос ARP."],
    ["Only the nearest router", "Delivery options are about end receivers; the nearest router is not a defined option.", "Варианты доставки — о конечных получателях; ближайший маршрутизатор как вариант не определён."],
  ], "The table lists multicast as one to many, received by a group.", "В таблице multicast — один группе, получает группа."),

  qx("Which protocol type handles authentication, integrity and encryption?", "Network security protocols", [
    ["Routing protocols", "Routing protocols exchange route information and choose the best path; they do not encrypt data.", "Протоколы маршрутизации обмениваются маршрутами и выбирают лучший путь; данные они не шифруют."],
    ["Service discovery protocols", "Service discovery automatically detects devices or services; it is not about securing data.", "Обнаружение сервисов автоматически находит устройства или сервисы; к защите данных оно не относится."],
    ["Network communications protocols", "These enable devices to communicate in general; the security tasks are a separate type.", "Эти протоколы обеспечивают общение устройств вообще; задачи безопасности — отдельный тип."],
  ], "Network security protocols secure data with authentication, integrity and encryption.", "Протоколы безопасности защищают данные аутентификацией, целостностью и шифрованием."),

  qx("Which protocol type lets devices automatically detect other devices or services on the network?", "Service discovery protocols", [
    ["Network security protocols", "Security protocols authenticate and encrypt; they do not announce or find services.", "Протоколы безопасности аутентифицируют и шифруют; сервисы они не объявляют и не ищут."],
    ["Routing protocols", "Routing protocols share path information between routers, not information about available services.", "Протоколы маршрутизации делятся путями между маршрутизаторами, а не сведениями о доступных сервисах."],
    ["Flow control and timing protocols", "Flow control is a function within protocols, not one of the four protocol types listed.", "Управление потоком — функция внутри протоколов, а не один из четырёх перечисленных типов."],
  ], "Service discovery protocols perform automatic detection of devices or services.", "Протоколы обнаружения сервисов автоматически находят устройства или сервисы."),

  qx("What do routing protocols do, according to the notes?", "Exchange route information and select the best path", [
    ["Encrypt all traffic passing between two neighboring routers", "Encryption belongs to network security protocols, not to routing.", "Шифрование — дело протоколов безопасности, а не маршрутизации."],
    ["Number the segments of a message", "Numbering segments is sequencing, a function performed by TCP, not by routing protocols.", "Нумерация сегментов — упорядочивание, функция TCP, а не протоколов маршрутизации."],
    ["Detect new printers on the LAN", "Finding printers or other services is service discovery, not routing.", "Поиск принтеров и других сервисов — обнаружение сервисов, а не маршрутизация."],
  ], "Routing protocols enable routers to exchange route information and compare paths to pick the best one.", "Протоколы маршрутизации позволяют маршрутизаторам обмениваться маршрутами и выбирать лучший путь."),

  qx("Which protocol function identifies the sender and the receiver?", "Addressing", [
    ["Sequencing", "Sequencing uniquely labels each transmitted segment; it does not identify the endpoints.", "Упорядочивание нумерует каждый переданный сегмент; конечные точки оно не определяет."],
    ["Reliability", "Reliability guarantees delivery; it relies on addressing but does not provide identification itself.", "Надёжность гарантирует доставку; она опирается на адресацию, но сама идентификацию не даёт."],
    ["Application interface", "The application interface enables process-to-process communication, not endpoint identification.", "Интерфейс приложений обеспечивает связь между процессами, а не идентификацию конечных точек."],
  ], "Addressing is the protocol function that identifies the sender and the receiver of a message.", "Адресация — функция протокола, определяющая отправителя и получателя сообщения."),

  qx("Which protocol function provides guaranteed delivery?", "Reliability", [
    ["Error detection", "Error detection only determines whether data was corrupted; it does not by itself resend anything.", "Обнаружение ошибок лишь определяет, повредились ли данные; само оно ничего не пересылает."],
    ["Flow control", "Flow control keeps the data rate efficient; it does not guarantee that every piece arrives.", "Управление потоком поддерживает эффективную скорость; оно не гарантирует, что каждая часть дойдёт."],
    ["Addressing", "Addressing says who the parties are; it does not ensure the message is actually delivered.", "Адресация говорит, кто участники; доставку сообщения она не обеспечивает."],
  ], "Reliability provides guaranteed delivery mechanisms, so lost data is detected and resent.", "Надёжность даёт механизмы гарантированной доставки: потерянное обнаруживается и отправляется заново."),

  qx("Which protocol function 'uniquely labels each transmitted segment of data'?", "Sequencing", [
    ["Addressing", "Addressing labels the sender and receiver, not the individual segments of a message.", "Адресация помечает отправителя и получателя, а не отдельные сегменты сообщения."],
    ["Error detection", "Error detection checks whether data is corrupted; it does not number the segments.", "Обнаружение ошибок проверяет, не повреждены ли данные; сегменты оно не нумерует."],
    ["Application interface", "The application interface is about process-to-process communication, not labeling segments.", "Интерфейс приложений — о связи между процессами, а не о нумерации сегментов."],
  ], "Sequencing numbers each segment so the receiver can put the message back in order.", "Упорядочивание нумерует каждый сегмент, чтобы получатель собрал сообщение в правильном порядке."),

  qx("Which protocol function determines whether data became corrupted during transmission?", "Error detection", [
    ["Reliability", "Reliability resends lost or damaged data, but detecting the corruption itself is error detection.", "Надёжность пересылает потерянное или повреждённое, но само обнаружение порчи — это обнаружение ошибок."],
    ["Sequencing", "Sequencing orders the segments; it says nothing about whether their content is intact.", "Упорядочивание расставляет сегменты по порядку; о целостности их содержимого оно не говорит."],
    ["Flow control", "Flow control regulates the rate of sending, not the integrity of what was sent.", "Управление потоком регулирует скорость отправки, а не целостность отправленного."],
  ], "Error detection is used to determine if data became corrupted during transmission.", "Обнаружение ошибок определяет, не повредились ли данные при передаче."),

  qx("Which protocol function enables process-to-process communication between network applications?", "Application interface", [
    ["Addressing", "Addressing identifies hosts; the application interface connects the processes running on them.", "Адресация определяет узлы; интерфейс приложений соединяет процессы, работающие на них."],
    ["Reliability", "Reliability guarantees delivery; it does not define how applications talk to each other.", "Надёжность гарантирует доставку; как приложения общаются между собой, она не определяет."],
    ["Sequencing", "Sequencing numbers segments; it is not the interface between applications.", "Упорядочивание нумерует сегменты; интерфейсом между приложениями оно не является."],
  ], "The application interface function contains information for process-to-process communications between applications.", "Функция интерфейса приложений обеспечивает связь между процессами сетевых приложений."),

  qx("Which protocol governs how a web server and a web client interact?", "HTTP", [
    ["TCP", "TCP manages the conversation and guarantees delivery; it does not define web content or format.", "TCP ведёт диалог и гарантирует доставку; содержимое и формат веб-обмена он не определяет."],
    ["IP", "IP delivers messages globally between networks; it knows nothing about web pages.", "IP доставляет сообщения глобально между сетями; о веб-страницах он ничего не знает."],
    ["Ethernet", "Ethernet moves frames between NICs inside one LAN; it is not a web protocol.", "Ethernet переносит кадры между сетевыми картами внутри одной LAN; это не веб-протокол."],
  ], "HTTP is the application protocol that governs the interaction of a web server and a web client.", "HTTP — прикладной протокол, определяющий взаимодействие веб-сервера и веб-клиента."),

  qx("Which protocol is responsible for delivering a message globally from the sender to the receiver?", "IP", [
    ["Ethernet", "Ethernet only reaches another NIC on the same LAN; crossing networks is the job of IP.", "Ethernet достигает только другой карты в той же LAN; переход между сетями — задача IP."],
    ["HTTP", "HTTP defines the web conversation; it relies on IP to get the messages across networks.", "HTTP определяет веб-диалог; доставку между сетями он поручает IP."],
    ["TCP", "TCP manages conversations and reliability; it does not find the way across networks.", "TCP ведёт диалоги и отвечает за надёжность; путь между сетями он не ищет."],
  ], "IP delivers messages globally from the sender to the receiver, across many networks.", "IP доставляет сообщения глобально от отправителя к получателю через многие сети."),

  qx("Which protocol delivers a message from one NIC to another NIC on the same LAN?", "Ethernet", [
    ["IP", "IP is the global delivery protocol; local NIC-to-NIC delivery is handled by Ethernet.", "IP — протокол глобальной доставки; локальную доставку от карты к карте выполняет Ethernet."],
    ["TCP", "TCP works end to end between applications' conversations, not between network cards.", "TCP работает между диалогами приложений из конца в конец, а не между сетевыми картами."],
    ["HTTP", "HTTP is an application protocol for web traffic; it never addresses NICs.", "HTTP — прикладной протокол для веба; сетевые карты он не адресует."],
  ], "Ethernet delivers messages from one NIC to another NIC on the same Ethernet LAN.", "Ethernet доставляет сообщения от одной сетевой карты к другой внутри одной LAN."),

  qx("According to the table, at which layer does TCP operate?", "Transport", [
    ["Application", "The application layer is where HTTP sits; TCP is one layer below.", "Прикладной уровень — место HTTP; TCP на уровень ниже."],
    ["Network / internet", "The network or internet layer belongs to IP, which handles global delivery.", "Сетевой уровень (интернет) принадлежит IP, который отвечает за глобальную доставку."],
    ["Data link", "The data link layer belongs to Ethernet, which delivers frames within a LAN.", "Канальный уровень принадлежит Ethernet, который доставляет кадры внутри LAN."],
  ], "TCP is the transport-layer protocol: conversations, guaranteed delivery and flow control.", "TCP — протокол транспортного уровня: диалоги, гарантированная доставка и управление потоком."),

  qx("Which row of the protocol table is correct?", "Ethernet — NIC to NIC in one LAN — data link", [
    ["IP — conversations and flow control — transport", "Conversations and flow control are TCP's job at the transport layer; IP does global delivery at the network layer.", "Диалоги и управление потоком — задача TCP на транспортном уровне; IP занимается глобальной доставкой на сетевом."],
    ["HTTP — global delivery — network / internet", "Global delivery is IP's job; HTTP is the application-layer web protocol.", "Глобальная доставка — задача IP; HTTP — веб-протокол прикладного уровня."],
    ["TCP — web client and server talk — application", "Web client and server interaction is HTTP at the application layer; TCP is transport.", "Общение веб-клиента и сервера — HTTP на прикладном уровне; TCP — транспортный."],
  ], "Ethernet works at the data link layer, delivering messages from one NIC to another inside a LAN.", "Ethernet работает на канальном уровне, доставляя сообщения от карты к карте внутри LAN."),

  qx("Complete the memory phrase: 'HTTP talks, TCP guarantees, IP finds the way across networks, Ethernet ___.'", "carries inside one LAN", [
    ["encrypts the whole session", "Ethernet does not encrypt; encryption is a network security protocol task.", "Ethernet не шифрует; шифрование — задача протоколов безопасности."],
    ["chooses the best route", "Route selection is done by IP with routing protocols, not by Ethernet.", "Выбор маршрута делает IP с протоколами маршрутизации, а не Ethernet."],
    ["formats the web page", "Web content and format are defined by HTTP at the application layer.", "Содержимое и формат веб-страницы определяет HTTP на прикладном уровне."],
  ], "The callout ends with 'Ethernet carries inside one LAN', matching its NIC-to-NIC role.", "Выноска заканчивается словами «Ethernet несёт внутри одной LAN», что соответствует его роли между картами."),

  tfx("Reliability is the protocol function that makes sure lost pieces of data are detected and resent.", true,
    "Reliability provides guaranteed delivery; sequencing numbers the pieces and error detection finds corrupted ones.", "Надёжность даёт гарантированную доставку; упорядочивание нумерует части, а обнаружение ошибок находит повреждённые.",
    "Attributing retransmission to sequencing or error detection confuses supporting functions with the guarantee itself.", "Приписывать повторную отправку упорядочиванию или обнаружению ошибок — путать вспомогательные функции с самой гарантией."),

  tfx("The access method is the timing element that specifies how long a device waits for a reply.", false,
    "Waiting for a reply is the response timeout; the access method decides when a device may send.", "Ожидание ответа — это тайм-аут ответа; метод доступа решает, когда устройство может передавать.",
    "Calling this true mixes up two timing elements: access method (when to send) and response timeout (how long to wait).", "Считать это верным — путать два элемента синхронизации: метод доступа (когда передавать) и тайм-аут (сколько ждать)."),
];
