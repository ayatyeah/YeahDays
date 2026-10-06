import { qx, tfx, type Draft } from "../../types";

/** Лекция 1, часть 2 — надёжные сети и тенденции. Разбор «до косточек». */
export const deepL1P2: Draft[] = [
  qx("Before network convergence, how did an organization typically carry telephone, video and data?", "Over separate cabling for each service", [
    ["Over one shared infrastructure for everything", "A single shared infrastructure is the result of convergence, not the situation before it.", "Единая общая инфраструктура — результат конвергенции, а не ситуация до неё."],
    ["Only over wireless links", "The lecture describes separate wired systems, not wireless-only transport.", "В лекции описаны отдельные кабельные системы, а не только беспроводная передача."],
    ["Over the public internet only", "Pre-convergence networks were separate in-house systems, each with its own technology and rules.", "Сети до конвергенции были отдельными внутренними системами, каждая со своей технологией и правилами."],
  ], "Before convergence an organization had separate cabling for telephone, video and data, each with its own technologies, rules and standards.", "До конвергенции у организации были отдельные кабельные системы для телефона, видео и данных, каждая со своими технологиями и стандартами."),

  qx("Which three traffic types does a converged network carry over the same infrastructure?", "Data, voice and video", [
    ["Power, data and control signals", "Power delivery is not part of the convergence definition in the lecture.", "Передача электропитания не входит в определение конвергенции из лекции."],
    ["Wired, wireless and satellite", "These are media and access types, not the kinds of traffic that converge.", "Это среды и виды доступа, а не виды трафика, которые объединяются."],
    ["Email, web and file traffic", "All three are just data; convergence means adding voice and video to the same network.", "Всё это просто данные; конвергенция означает добавление голоса и видео в ту же сеть."],
  ], "A converged network carries data, voice and video with one set of rules and standards.", "Конвергентная сеть передаёт данные, голос и видео по единому набору правил и стандартов."),

  qx("Besides a shared infrastructure, what else does a converged network share for all its traffic?", "The same set of rules and standards", [
    ["The same IP address for every device", "Convergence is about shared infrastructure and standards, not about addressing.", "Конвергенция — про общую инфраструктуру и стандарты, а не про адресацию."],
    ["A separate cable per application", "Separate cabling per service is exactly what convergence replaces.", "Отдельный кабель на сервис — это именно то, что конвергенция заменяет."],
    ["One service provider for every link", "The provider is not part of the convergence definition.", "Провайдер не входит в определение конвергенции."],
  ], "A converged network uses the same infrastructure and the same set of rules and standards for data, voice and video.", "Конвергентная сеть использует одну инфраструктуру и единый набор правил и стандартов для данных, голоса и видео."),

  qx("What does the lecture call the set of technologies that supports the infrastructure moving data across the network?", "Network architecture", [
    ["Network topology", "A topology diagram shows how devices are placed or addressed, not the technologies supporting data movement.", "Схема топологии показывает расположение или адресацию устройств, а не технологии, поддерживающие передачу данных."],
    ["Network convergence", "Convergence is combining data, voice and video on one network, not the supporting set of technologies.", "Конвергенция — объединение данных, голоса и видео в одной сети, а не набор поддерживающих технологий."],
    ["Quality of Service (QoS)", "QoS is one mechanism inside the architecture, not the whole set of technologies.", "QoS — лишь один механизм внутри архитектуры, а не весь набор технологий."],
  ], "Network architecture is the set of technologies that support the infrastructure that moves data across the network.", "Архитектура сети — набор технологий, поддерживающих инфраструктуру, по которой движутся данные."),

  qx("Which four characteristics must a network architecture address to be reliable?", "Fault tolerance, scalability, QoS, security", [
    ["Speed, cost, size, ownership", "These describe network types (LAN vs WAN), not the four reliability characteristics.", "Это признаки типов сетей (LAN и WAN), а не четыре характеристики надёжности."],
    ["Confidentiality, integrity, availability, QoS", "The first three are the goals of security, which is itself one of the four characteristics.", "Первые три — цели безопасности, которая сама является одной из четырёх характеристик."],
    ["Redundancy, cabling, cloud, BYOD", "Cloud and BYOD are trends; cabling is a medium; only redundancy relates to a characteristic.", "Облако и BYOD — тенденции, кабель — среда; к характеристикам относится только избыточность."],
  ], "A reliable network architecture addresses fault tolerance, scalability, Quality of Service and security.", "Архитектура надёжной сети обеспечивает отказоустойчивость, масштабируемость, качество обслуживания и безопасность."),

  qx("How does a fault-tolerant network limit the impact of a failure?", "By limiting the number of affected devices", [
    ["By prioritizing voice and video", "Traffic prioritization is Quality of Service, not fault tolerance.", "Приоритизация трафика — это QoS, а не отказоустойчивость."],
    ["By following accepted standards", "Following standards is how scalability is achieved.", "Следование стандартам — способ достичь масштабируемости."],
    ["By encrypting all data while it is in transit", "Encryption serves security (confidentiality), not recovery from failures.", "Шифрование служит безопасности (конфиденциальности), а не восстановлению после сбоев."],
  ], "Fault tolerance limits the impact of a failure by limiting the number of affected devices, using multiple paths.", "Отказоустойчивость ограничивает последствия сбоя, уменьшая число затронутых устройств за счёт нескольких путей."),

  qx("What must a network have so that a single link failure does not cut users off?", "Multiple paths (redundancy)", [
    ["A dedicated circuit per session", "A dedicated circuit is circuit switching; if that circuit fails, the session is lost.", "Выделенный канал — это коммутация каналов; если он упадёт, сеанс потерян."],
    ["A single very fast backbone", "One backbone, however fast, is a single point of failure.", "Одна магистраль, какой бы быстрой она ни была, — единая точка отказа."],
    ["A QoS policy for all traffic", "QoS keeps voice and video smooth but does not provide alternative paths.", "QoS сохраняет плавность голоса и видео, но запасных путей не даёт."],
  ], "Redundancy means multiple paths, so traffic can be rerouted when one path fails.", "Избыточность — это несколько путей, чтобы трафик мог пойти в обход при отказе одного из них."),

  qx("What does packet switching do with the traffic of a message?", "Splits it into packets that may take different paths", [
    ["Sends it over one reserved circuit", "A reserved circuit is circuit switching, not packet switching.", "Зарезервированный канал — это коммутация каналов, а не пакетов."],
    ["Encrypts it so only the receiver can read", "Encryption is a security measure, unrelated to how traffic is switched.", "Шифрование — мера безопасности, не связанная со способом коммутации."],
    ["Holds it back until enough bandwidth becomes available", "Holding traffic is not what packet switching means; it is about dividing and routing packets.", "Задержка трафика — не суть коммутации пакетов; она про деление и маршрутизацию пакетов."],
  ], "Packet switching splits traffic into packets, and each packet can take a different path through the network.", "Коммутация пакетов делит трафик на пакеты, и каждый пакет может пойти своим путём."),

  qx("Why can a circuit-switched network not benefit from redundancy the way packet switching does?", "It sets up one dedicated circuit for the call", [
    ["It has no addressing scheme", "Circuit-switched networks do address endpoints; the limitation is the fixed circuit.", "В сетях с коммутацией каналов адресация есть; ограничение — фиксированный канал."],
    ["It works only over wireless media such as satellite", "Circuit switching is not tied to wireless; the issue is the dedicated path.", "Коммутация каналов не привязана к беспроводной среде; дело в выделенном пути."],
    ["It cannot carry voice traffic", "Circuit switching was classically used for voice; carrying voice is not its problem.", "Коммутация каналов классически применялась для голоса; передача голоса — не её проблема."],
  ], "A circuit-switched network establishes a dedicated circuit, so packets cannot be sent over different paths.", "Сеть с коммутацией каналов создаёт выделенный канал, поэтому пакеты нельзя пустить по разным путям."),

  qx("A university adds 500 new students to its network and nobody notices any slowdown. Which characteristic is at work?", "Scalability", [
    ["Fault tolerance", "Fault tolerance is about surviving failures, not about absorbing new users.", "Отказоустойчивость — про переживание сбоев, а не про приём новых пользователей."],
    ["Quality of Service", "QoS prioritizes delay-sensitive traffic; it does not describe growing the user base.", "QoS приоритизирует чувствительный к задержкам трафик; рост числа пользователей он не описывает."],
    ["Availability", "Availability is a security goal about timely access, not about expansion without slowdown.", "Доступность — цель безопасности о своевременном доступе, а не о расширении без замедления."],
  ], "A scalable network expands quickly to support new users without hurting the performance of existing users.", "Масштабируемая сеть быстро расширяется под новых пользователей, не ухудшая работу существующих."),

  qx("How do designers achieve scalability according to the lecture?", "By following accepted standards and protocols", [
    ["By buying the fastest hardware", "The lecture ties scalability to standards and protocols, not to hardware speed.", "В лекции масштабируемость связана со стандартами и протоколами, а не со скоростью оборудования."],
    ["By adding multiple redundant paths between devices", "Multiple paths provide fault tolerance, not scalability.", "Несколько путей дают отказоустойчивость, а не масштабируемость."],
    ["By configuring Quality of Service", "QoS manages traffic priority; it does not make the network grow more easily.", "QoS управляет приоритетами трафика; он не упрощает рост сети."],
  ], "Networks scale because designers follow accepted standards and protocols.", "Сети масштабируются потому, что проектировщики следуют принятым стандартам и протоколам."),

  qx("What does the lecture call the primary mechanism for ensuring reliable delivery of content to all users?", "Quality of Service (QoS)", [
    ["Fault tolerance (redundancy)", "Fault tolerance handles failures; it is not described as the primary delivery mechanism.", "Отказоустойчивость отвечает за сбои; основным механизмом доставки она не названа."],
    ["Packet switching", "Packet switching is how traffic is divided and routed, not the mechanism for reliable delivery under load.", "Коммутация пакетов — способ деления и маршрутизации трафика, а не механизм надёжной доставки под нагрузкой."],
    ["Network security", "Security protects devices and data; it does not manage delivery quality.", "Безопасность защищает устройства и данные, а качеством доставки не управляет."],
  ], "QoS is the primary mechanism that ensures reliable delivery of content for all users.", "QoS — основной механизм, обеспечивающий надёжную доставку содержимого всем пользователям."),

  qx("Which kinds of traffic are named as needing Quality of Service?", "Voice and live video", [
    ["Email and file downloads", "These tolerate delay well; they are not the traffic QoS is primarily for.", "Почта и загрузки файлов хорошо переносят задержки; QoS в первую очередь не для них."],
    ["Web pages and instant messages", "Short delays in text and pages are barely noticed; QoS targets real-time media.", "Короткие задержки текста и страниц почти незаметны; QoS нацелен на медиа в реальном времени."],
    ["Backups and software updates", "Bulk transfers can wait; they do not suffer breaks and pauses the way voice does.", "Массовые передачи могут подождать; они не страдают от обрывов и пауз, как голос."],
  ], "Voice and live video need QoS; without it, breaks and pauses appear when bandwidth demand exceeds supply.", "Голосу и живому видео нужен QoS; без него при нехватке полосы появляются обрывы и паузы."),

  qx("When do breaks and pauses appear in a voice or video stream?", "When demand exceeds available bandwidth and QoS is off", [
    ["When the network has redundant paths", "Redundant paths improve fault tolerance; they do not cause stuttering.", "Запасные пути улучшают отказоустойчивость; заикания они не вызывают."],
    ["When traffic is sent as packets", "Packet switching itself does not cause pauses; contention without QoS does.", "Сама по себе коммутация пакетов пауз не вызывает; их вызывает перегрузка без QoS."],
    ["When passwords are stored in plaintext in the config file", "Plaintext passwords are a security problem, not a cause of media interruptions.", "Открытые пароли — проблема безопасности, а не причина обрывов медиа."],
  ], "Breaks and pauses appear when demand for bandwidth is higher than what is available and QoS is not configured.", "Обрывы и паузы появляются, когда запрос на полосу больше доступной, а QoS не настроен."),

  qx("A live lecture stream stutters whenever many students download files. Which characteristic is missing?", "Quality of Service", [
    ["Fault tolerance", "Nothing has failed; the links are simply congested, which QoS handles.", "Ничего не сломалось; каналы просто перегружены, а с этим работает QoS."],
    ["Scalability of the network", "The users are already connected; the problem is prioritizing real-time traffic, not adding users.", "Пользователи уже подключены; проблема в приоритете трафика реального времени, а не в добавлении людей."],
    ["Confidentiality", "Confidentiality concerns who can read data, not whether the stream is smooth.", "Конфиденциальность — о том, кто может читать данные, а не о плавности потока."],
  ], "QoS prioritizes voice and video when demand for bandwidth exceeds supply, so the stream stays smooth.", "QoS отдаёт приоритет голосу и видео при нехватке полосы, поэтому поток остаётся плавным."),

  qx("Which two areas make up network security in the lecture?", "Infrastructure security and information security", [
    ["Physical security of devices and fault tolerance", "Fault tolerance is a separate characteristic, not a part of security.", "Отказоустойчивость — отдельная характеристика, а не часть безопасности."],
    ["Scalability and availability", "Scalability is a separate characteristic; availability is only one of security's goals.", "Масштабируемость — отдельная характеристика; доступность — лишь одна из целей безопасности."],
    ["Encryption and redundancy", "Redundancy belongs to fault tolerance; encryption is a tool, not one of the two named areas.", "Избыточность относится к отказоустойчивости; шифрование — инструмент, а не одна из двух названных областей."],
  ], "Security covers infrastructure security (physical protection, preventing unauthorized access) and information security (protecting the data).", "Безопасность включает защиту инфраструктуры (физическую, запрет несанкционированного доступа) и защиту информации (самих данных)."),

  qx("Locking a wiring closet so nobody can plug into the switch is an example of...", "Infrastructure security", [
    ["Information (data) security", "Information security protects the data itself, not the physical devices.", "Защита информации охраняет сами данные, а не физические устройства."],
    ["Fault tolerance", "A lock does not add alternative paths or limit failure impact.", "Замок не добавляет запасных путей и не уменьшает последствия сбоя."],
    ["Quality of Service", "QoS prioritizes traffic; it has nothing to do with physical access.", "QoS расставляет приоритеты трафика; к физическому доступу он не относится."],
  ], "Infrastructure security includes physical security of devices and preventing unauthorized access to them.", "Защита инфраструктуры включает физическую защиту устройств и запрет несанкционированного доступа к ним."),

  qx("In the characteristics table, which question does fault tolerance answer?", "Will one failure stop everyone?", [
    ["Can we add users without slowing others?", "That is the question answered by scalability.", "На этот вопрос отвечает масштабируемость."],
    ["Will voice and video stay smooth?", "That is the question for Quality of Service.", "Это вопрос качества обслуживания (QoS)."],
    ["Who can access devices and read data?", "That is the question for security.", "Это вопрос безопасности."],
  ], "Fault tolerance answers 'will one failure stop everyone?' with multiple paths and packet switching.", "Отказоустойчивость отвечает на вопрос «остановит ли один сбой всех?» несколькими путями и коммутацией пакетов."),

  qx("In the characteristics table, how is Quality of Service achieved?", "By prioritizing traffic", [
    ["By multiple paths and packet switching", "Those are the methods for fault tolerance.", "Это методы отказоустойчивости."],
    ["By standards and protocols", "Standards and protocols are how scalability is achieved.", "Стандарты и протоколы — способ достичь масштабируемости."],
    ["By infrastructure and information security", "Those are the two parts of security, not QoS.", "Это две составляющие безопасности, а не QoS."],
  ], "QoS keeps voice and video smooth by prioritizing traffic.", "QoS сохраняет плавность голоса и видео, расставляя приоритеты трафика."),

  qx("Which security goal guarantees that only the intended recipients can read the data?", "Confidentiality", [
    ["Integrity", "Integrity guarantees the data was not altered, not who may read it.", "Целостность гарантирует, что данные не изменены, а не то, кто их читает."],
    ["Availability", "Availability is about timely, reliable access for authorized users.", "Доступность — о своевременном и надёжном доступе авторизованных пользователей."],
    ["Scalability", "Scalability is a network characteristic about growth, not a security goal.", "Масштабируемость — характеристика роста сети, а не цель безопасности."],
  ], "Confidentiality means only the intended recipients can read the data.", "Конфиденциальность — данные читает только тот, кому они предназначены."),

  qx("A file arrives exactly as it was sent, with no changes in transit. Which security goal was met?", "Integrity", [
    ["Confidentiality", "Confidentiality is about keeping the content secret from others, not about it being unchanged.", "Конфиденциальность — о том, чтобы содержимое не прочитали чужие, а не о его неизменности."],
    ["Availability", "Availability means the service is reachable when needed, not that the data is intact.", "Доступность означает, что сервис доступен, когда нужен, а не что данные не изменены."],
    ["Redundancy", "Redundancy is multiple paths for fault tolerance, not a security goal.", "Избыточность — несколько путей для отказоустойчивости, а не цель безопасности."],
  ], "Integrity is the assurance that the data was not altered during transmission.", "Целостность — гарантия, что данные не изменены при передаче."),

  qx("Which security goal is about timely and reliable access to data for authorized users?", "Availability", [
    ["Confidentiality", "Confidentiality restricts who can read data; it does not guarantee access.", "Конфиденциальность ограничивает, кто читает данные, а доступ не гарантирует."],
    ["Integrity", "Integrity concerns data not being altered, not whether it is reachable.", "Целостность — о неизменности данных, а не о том, можно ли до них добраться."],
    ["Fault tolerance", "Fault tolerance is a network characteristic, not one of the three security goals.", "Отказоустойчивость — характеристика сети, а не одна из трёх целей безопасности."],
  ], "Availability means timely and reliable access to data services for authorized users.", "Доступность — своевременный и надёжный доступ к данным для авторизованных пользователей."),

  tfx("The three goals of network security are confidentiality, integrity and availability.", true,
    "Confidentiality (only intended readers), integrity (data not altered) and availability (timely access for authorized users) are the three goals; the callout calls them CIA.",
    "Конфиденциальность (читает только адресат), целостность (данные не изменены) и доступность (своевременный доступ) — три цели; в памятке это CIA.",
    "Answering False would mean rejecting the CIA triad stated directly in the notes; none of the three is replaced by scalability or fault tolerance.",
    "Ответ «неверно» отвергал бы триаду CIA, прямо названную в конспекте; ни одну из трёх целей не заменяют масштабируемость или отказоустойчивость."),

  qx("What does BYOD mean?", "Any device, with any ownership, used anywhere", [
    ["A corporate-issued device used only at the office", "BYOD is the opposite: users bring their own devices, not company-issued ones.", "BYOD — противоположность: пользователи приносят свои устройства, а не корпоративные."],
    ["Running applications on servers over the internet", "That is cloud computing, not BYOD.", "Это облачные вычисления, а не BYOD."],
    ["Connecting to the LAN through an electrical outlet", "That describes powerline networking.", "Это описание powerline-сети."],
  ], "BYOD (Bring Your Own Device) means any device, with any ownership, used anywhere.", "BYOD — любое устройство, чьё угодно, используемое где угодно."),

  qx("Which Cisco product is given as an example of online collaboration?", "Cisco Webex", [
    ["Cisco TelePresence", "TelePresence is named as the video example, not as the collaboration tool.", "TelePresence назван примером видео, а не инструментом совместной работы."],
    ["Cisco IOS", "IOS is the network device operating system, unrelated to collaboration.", "IOS — операционная система сетевых устройств, к совместной работе не относится."],
    ["Cisco Packet Tracer", "Packet Tracer is a simulation tool and is not mentioned in this part of the lecture.", "Packet Tracer — симулятор, в этой части лекции он не упоминается."],
  ], "The lecture names Cisco Webex for online collaboration and Cisco Webex Teams for messaging and sharing.", "В лекции Cisco Webex назван для совместной работы онлайн, а Cisco Webex Teams — для сообщений и обмена файлами."),

  qx("What does a tool such as Cisco Webex Teams let people do?", "Send instant messages and post images, videos and links", [
    ["Configure switches through a GUI", "Webex Teams is a collaboration tool, not a device management interface.", "Webex Teams — инструмент совместной работы, а не интерфейс управления устройствами."],
    ["Store files on servers in a data center", "Storing files on remote servers is cloud computing, not messaging.", "Хранение файлов на удалённых серверах — облачные вычисления, а не обмен сообщениями."],
    ["Connect a home to the LAN over power lines", "That is powerline networking, unrelated to collaboration software.", "Это powerline-сеть, не связанная с ПО для совместной работы."],
  ], "Collaboration tools like Cisco Webex Teams let people send instant messages and post images, videos and links.", "Инструменты вроде Cisco Webex Teams позволяют отправлять мгновенные сообщения и публиковать изображения, видео и ссылки."),

  qx("For which two sectors does the lecture call collaboration a very high priority?", "Business and education", [
    ["Healthcare and media", "Healthcare and media are the examples given for custom clouds, not for collaboration priority.", "Медицина и медиа — примеры для специализированных облаков, а не для приоритета совместной работы."],
    ["Government and military", "Government is mentioned as a private cloud example, not in the collaboration statement.", "Правительство упомянуто как пример частного облака, а не в утверждении о совместной работе."],
    ["Rural areas and home users", "Rural areas are where WISPs operate; they are not the sectors named for collaboration.", "Сельская местность — где работают WISP; это не секторы, названные для совместной работы."],
  ], "Collaboration is a very high priority for business and education.", "Совместная работа — очень высокий приоритет для бизнеса и образования."),

  qx("Which Cisco product is named as an example of video conferencing?", "Cisco TelePresence", [
    ["Cisco Webex Teams", "Webex Teams is the messaging and sharing tool; TelePresence is the video example.", "Webex Teams — инструмент сообщений и обмена; пример видео — TelePresence."],
    ["Cisco Catalyst", "Catalyst is a switch family and is not mentioned in the lecture.", "Catalyst — семейство коммутаторов, в лекции не упоминается."],
    ["Cisco Powerline", "There is no such product; powerline networking is a home technology, not a Cisco video product.", "Такого продукта нет; powerline — домашняя технология, а не видеопродукт Cisco."],
  ], "Video calls and conferencing reach anyone regardless of location; Cisco TelePresence is the example.", "Видеозвонки и конференции доступны независимо от места; пример — Cisco TelePresence."),

  qx("What is cloud computing as defined in the lecture?", "Storing files and running apps on servers over the internet", [
    ["Running a peer network without any centralized administration", "That describes a peer-to-peer network, not the cloud.", "Это описание одноранговой сети, а не облака."],
    ["Carrying voice, video and data on one network", "That is network convergence.", "Это конвергенция сетей."],
    ["Using your own device anywhere for work", "That is BYOD.", "Это BYOD."],
  ], "Cloud computing is storing files and running applications on servers over the internet, made possible by data centers.", "Облачные вычисления — хранение файлов и работа приложений на серверах через интернет; их делают возможными дата-центры."),

  qx("What makes cloud computing possible?", "Data centers", [
    ["Powerline adapters", "Powerline adapters connect a home device to the LAN; they do not host cloud services.", "Powerline-адаптеры подключают домашнее устройство к LAN, облачные сервисы они не размещают."],
    ["Wireless ISPs", "A WISP only provides access in rural areas; it does not run the servers behind the cloud.", "WISP лишь даёт доступ в сельской местности, серверы облака он не держит."],
    ["Circuit-switched networks", "Circuit switching is an older telephony model, not the foundation of cloud services.", "Коммутация каналов — старая телефонная модель, а не основа облачных сервисов."],
  ], "Cloud computing is made possible by data centers, where the servers physically live.", "Облачные вычисления возможны благодаря дата-центрам, где физически стоят серверы."),

  qx("Which type of cloud is available to the general public, free or pay-per-use?", "Public cloud", [
    ["Private cloud", "A private cloud is intended for a specific organization, such as a government.", "Частное облако предназначено для конкретной организации, например правительства."],
    ["Hybrid cloud", "A hybrid cloud is two or more cloud types connected by one architecture.", "Гибридное облако — два и более типа облаков с общей архитектурой."],
    ["Custom cloud", "A custom cloud is built for a specific industry such as healthcare or media.", "Специализированное облако строится под конкретную отрасль, например медицину или медиа."],
  ], "Public clouds are available to the general public, either free or pay-per-use.", "Публичные облака доступны всем, бесплатно или с оплатой по использованию."),

  qx("A government runs cloud services for its own agencies only. Which cloud type is this?", "Private cloud", [
    ["Public cloud", "A public cloud is open to the general public, not restricted to one organization.", "Публичное облако открыто всем, а не ограничено одной организацией."],
    ["Hybrid cloud", "Hybrid means combining two or more cloud types, which is not described here.", "Гибридное — сочетание двух и более типов облаков, чего здесь не описано."],
    ["Custom cloud", "A custom cloud targets an industry (healthcare, media), not a single organization.", "Специализированное облако нацелено на отрасль (медицина, медиа), а не на одну организацию."],
  ], "A private cloud is intended for a specific organization, such as a government.", "Частное облако предназначено для конкретной организации, например правительства."),

  qx("What is a hybrid cloud?", "Two or more cloud types connected by one architecture", [
    ["A cloud built for one industry like healthcare", "That is the definition of a custom cloud.", "Это определение специализированного облака."],
    ["A cloud that is free for the general public", "Free, public access describes a public cloud.", "Бесплатный доступ для всех — признак публичного облака."],
    ["A cloud used by a single organization", "A cloud for one organization is a private cloud.", "Облако для одной организации — частное."],
  ], "A hybrid cloud is made of two or more cloud types connected by the same architecture.", "Гибридное облако — два и более типа облаков, связанные общей архитектурой."),

  qx("A cloud service built specifically for hospitals is an example of which cloud type?", "Custom cloud", [
    ["Public cloud", "Public clouds serve everyone, not one industry's special needs.", "Публичные облака обслуживают всех, а не особые нужды одной отрасли."],
    ["Private cloud", "A private cloud is for one organization, not for a whole industry such as healthcare.", "Частное облако — для одной организации, а не для целой отрасли вроде медицины."],
    ["Hybrid cloud", "Hybrid describes combining cloud types, not targeting an industry.", "Гибридное облако — о сочетании типов, а не о нацеленности на отрасль."],
  ], "Custom clouds are built to meet the needs of a specific industry, such as healthcare or media.", "Специализированные облака строятся под нужды конкретной отрасли, например медицины или медиа."),

  qx("Which home technology connects a device to the LAN through an electrical outlet?", "Powerline networking", [
    ["Smart home technology", "Smart home means integrating technology into appliances, not how the data gets to the LAN.", "Умный дом — встраивание технологий в бытовую технику, а не способ доставки данных в LAN."],
    ["WISP", "A WISP is a wireless internet service provider for subscribers, not an in-home outlet connection.", "WISP — беспроводной интернет-провайдер для абонентов, а не подключение через розетку дома."],
    ["Ethernet WAN", "Ethernet WAN is a business service stretching LAN technology over the WAN.", "Ethernet WAN — бизнес-услуга, растягивающая технологию LAN на WAN."],
  ], "Powerline networking connects a device to the LAN through an electrical outlet where cables or wireless are not an option.", "Powerline-сеть подключает устройство к LAN через электрическую розетку там, где кабель или Wi-Fi не подходят."),

  qx("What does a WISP do, and where is it most common?", "Connects subscribers to wireless hotspots, mostly in rural areas", [
    ["Links two company offices with a reserved circuit across the city", "A reserved circuit between offices is a leased line, not a WISP.", "Зарезервированный канал между офисами — арендованная линия, а не WISP."],
    ["Runs data centers that host cloud services", "Data centers belong to cloud providers; a WISP provides wireless access.", "Дата-центры принадлежат облачным провайдерам; WISP даёт беспроводной доступ."],
    ["Carries data over home electrical wiring", "That is powerline networking.", "Это powerline-сеть."],
  ], "A WISP (wireless internet service provider) connects subscribers to access points or hotspots, mostly in rural areas.", "WISP (беспроводной интернет-провайдер) подключает абонентов к точкам доступа или хот-спотам, чаще всего в сельской местности."),

  qx("Which line matches the lecture's memory aid for the four characteristics?", "Fault tolerance = redundancy, QoS = priority", [
    ["Fault tolerance = growth, scalability = priority", "Growth belongs to scalability and priority to QoS; fault tolerance equals redundancy.", "Рост — это масштабируемость, приоритет — QoS; отказоустойчивость равна избыточности."],
    ["QoS = redundancy, security = growth", "Redundancy is fault tolerance and growth is scalability; security equals CIA.", "Избыточность — отказоустойчивость, рост — масштабируемость; безопасность равна CIA."],
    ["Scalability = CIA, security = redundancy", "CIA belongs to security; redundancy belongs to fault tolerance.", "CIA относится к безопасности; избыточность — к отказоустойчивости."],
  ], "The callout: fault tolerance = redundancy, scalability = growth, QoS = priority, security = CIA.", "Памятка: отказоустойчивость = избыточность, масштабируемость = рост, QoS = приоритет, безопасность = CIA."),

  tfx("Smart home technology integrates networking into everyday appliances.", true,
    "The lecture says smart home technology integrates into everyday appliances.",
    "В лекции сказано, что технологии умного дома встраиваются в бытовую технику.",
    "Answering False contradicts the notes; smart home is precisely about appliances becoming networked, not about business leased lines.",
    "Ответ «неверно» противоречит конспекту: умный дом — именно о подключённой бытовой технике, а не о бизнес-каналах."),
];
