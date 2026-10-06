import { qx, tfx, type Draft } from "../../types";

/** Разбор до косточек: лекция 2, часть 2 — наборы протоколов и организации по стандартизации. */
export const deepL2P2: Draft[] = [
  qx("What is a protocol suite?", "A group of inter-related protocols for a communication function", [
    ["A single protocol that handles every layer of the network by itself", "A suite is by definition several protocols working together, not one protocol doing everything.", "Набор по определению — несколько протоколов, работающих вместе, а не один протокол на всё."],
    ["A list of standards organizations", "Organizations such as IETF or IEEE publish standards; they are not themselves a suite of protocols.", "Организации вроде IETF или IEEE публикуют стандарты; сами они набором протоколов не являются."],
    ["A set of cables and connectors for a LAN", "Cables and connectors are physical media, defined by EIA/TIA; a suite is software rules.", "Кабели и разъёмы — физическая среда, которую описывают EIA/TIA; набор — это программные правила."],
  ], "A protocol suite is a group of inter-related protocols needed to perform a communication function.", "Набор протоколов — группа взаимосвязанных протоколов, нужных для выполнения функции связи."),

  qx("In a protocol suite viewed as layers, what do the lower layers do?", "Move the data and provide services to the upper layers", [
    ["Define the content shown to the user", "User-facing content is the job of the upper (application) layers, not the lower ones.", "Содержимое для пользователя — задача верхних (прикладных) уровней, а не нижних."],
    ["Approve the standards that the upper layers are allowed to use", "Standards are approved by organizations like the IETF, not by layers of the suite.", "Стандарты утверждают организации вроде IETF, а не уровни набора."],
    ["Replace the upper layers when they fail", "Layers do not substitute for one another; each has its own role and serves the layer above.", "Уровни друг друга не подменяют; у каждого своя роль, и он обслуживает уровень выше."],
  ], "The lower layers are concerned with moving data over the network and serving the upper layers.", "Нижние уровни перемещают данные по сети и обслуживают верхние уровни."),

  qx("Which protocol suite is the most common today, and who maintains it?", "TCP/IP, maintained by the IETF", [
    ["OSI protocols, maintained by the ISO", "The OSI protocols were developed by ISO and ITU but are not the suite in common use today.", "Протоколы OSI разработаны ISO и ITU, но сегодня не являются широко используемым набором."],
    ["AppleTalk, maintained by Apple", "AppleTalk is a proprietary Apple suite, long superseded by TCP/IP.", "AppleTalk — закрытый набор Apple, давно вытесненный TCP/IP."],
    ["TCP/IP, maintained by the IEEE", "The IEEE handles 802.3 Ethernet and 802.11 Wi-Fi; TCP/IP is maintained by the IETF.", "IEEE ведёт 802.3 Ethernet и 802.11 Wi-Fi; TCP/IP поддерживает IETF."],
  ], "The Internet Protocol Suite (TCP/IP) is the most common suite and is maintained by the IETF.", "Набор протоколов интернета (TCP/IP) — самый распространённый, его поддерживает IETF."),

  qx("Which two organizations developed the OSI protocols?", "ISO and ITU", [
    ["IETF and IRTF", "IETF and IRTF are internet bodies behind TCP/IP engineering and research, not OSI.", "IETF и IRTF — интернет-организации, занимающиеся инженерией и исследованиями TCP/IP, а не OSI."],
    ["IEEE and EIA", "IEEE covers LAN standards like 802.3; EIA covers wiring and racks; neither made the OSI protocols.", "IEEE ведёт стандарты LAN вроде 802.3, EIA — проводку и стойки; протоколы OSI они не создавали."],
    ["ICANN and IANA", "ICANN and IANA allocate addresses and names; they do not develop protocol suites.", "ICANN и IANA распределяют адреса и имена; наборы протоколов они не разрабатывают."],
  ], "The OSI protocols were developed by the ISO together with the ITU.", "Протоколы OSI разработаны ISO совместно с ITU."),

  qx("Which company released the proprietary AppleTalk suite?", "Apple", [
    ["Novell", "Novell developed NetWare, a different proprietary suite.", "Novell разработала NetWare — другой закрытый набор."],
    ["Cisco", "Cisco builds network devices; it did not release AppleTalk.", "Cisco выпускает сетевое оборудование; AppleTalk она не выпускала."],
    ["IBM", "IBM is not mentioned in the notes; AppleTalk, as the name hints, is from Apple.", "IBM в конспекте нет; AppleTalk, как видно по названию, — от Apple."],
  ], "AppleTalk is a short-lived proprietary suite released by Apple.", "AppleTalk — недолго живший закрытый набор, выпущенный Apple."),

  qx("Which proprietary protocol suite was developed by Novell?", "NetWare", [
    ["AppleTalk", "AppleTalk is Apple's proprietary suite, not Novell's.", "AppleTalk — закрытый набор Apple, а не Novell."],
    ["TCP/IP", "TCP/IP is an open standard maintained by the IETF, not a proprietary Novell product.", "TCP/IP — открытый стандарт, поддерживаемый IETF, а не закрытый продукт Novell."],
    ["OSI", "The OSI protocols were developed by ISO and ITU, standards bodies, not by a company.", "Протоколы OSI разработаны ISO и ITU — организациями по стандартизации, а не компанией."],
  ], "Novell NetWare is a proprietary protocol suite developed by Novell.", "Novell NetWare — закрытый набор протоколов, разработанный Novell."),

  qx("Which two suites in the notes are proprietary?", "AppleTalk and Novell NetWare", [
    ["TCP/IP and OSI", "Both are open: TCP/IP from the IETF and OSI from ISO/ITU, not owned by a single vendor.", "Оба открытые: TCP/IP от IETF и OSI от ISO/ITU, ни один не принадлежит одному производителю."],
    ["The TCP/IP suite and AppleTalk", "AppleTalk is proprietary, but TCP/IP is an open standard available to any vendor.", "AppleTalk закрытый, но TCP/IP — открытый стандарт, доступный любому производителю."],
    ["OSI and Novell NetWare", "NetWare is proprietary, but the OSI protocols come from standards organizations.", "NetWare закрытый, но протоколы OSI созданы организациями по стандартизации."],
  ], "AppleTalk (Apple) and NetWare (Novell) are the two proprietary suites listed.", "AppleTalk (Apple) и NetWare (Novell) — два закрытых набора из списка."),

  qx("What does it mean that TCP/IP is an open standard?", "It is freely available and usable by any vendor", [
    ["Its traffic is sent without encryption", "Open refers to the availability of the specification, not to a lack of encryption in the data.", "Открытый — о доступности спецификации, а не об отсутствии шифрования данных."],
    ["Any user may change the protocol at will", "Changes go through the IETF standards process; openness does not mean anyone can edit it.", "Изменения проходят через процесс стандартизации IETF; открытость не значит, что любой может его править."],
    ["It runs only on open-source operating systems like Linux", "TCP/IP runs on every OS, open-source or not; that is what vendor-neutral availability allows.", "TCP/IP работает на любой ОС, открытой или нет; это и обеспечивает независимость от производителя."],
  ], "An open standard is freely available to the public and can be used by any vendor.", "Открытый стандарт доступен всем бесплатно и может использоваться любым производителем."),

  qx("TCP/IP is 'standards-based'. What does that mean?", "It is endorsed by the industry and approved by a standards body", [
    ["It was created by a single hardware vendor", "A single-vendor origin is what makes AppleTalk and NetWare proprietary, the opposite of standards-based.", "Происхождение от одного производителя делает AppleTalk и NetWare закрытыми — противоположность стандартизованному."],
    ["It uses only the seven layers defined in the OSI reference model", "TCP/IP has its own four-layer model; being standards-based is about approval, not about OSI layers.", "У TCP/IP своя четырёхуровневая модель; стандартизованность — об утверждении, а не об уровнях OSI."],
    ["It requires a paid license from the IETF", "The IETF makes its standards freely available; no license fee is involved.", "IETF публикует стандарты бесплатно; никакой лицензионной платы нет."],
  ], "Standards-based means endorsed by the networking industry and approved by a standards organization to ensure interoperability.", "Основанный на стандартах — принятый отраслью и утверждённый организацией по стандартизации ради совместимости."),

  qx("Why is it important that TCP/IP is approved by a standards organization?", "To ensure interoperability between vendors' products", [
    ["To make the protocols faster", "Approval is about agreement on the rules, not about speed of transmission.", "Утверждение — о согласии с правилами, а не о скорости передачи."],
    ["To keep the specification secret", "Standards are published openly; secrecy would defeat the purpose of a standard.", "Стандарты публикуются открыто; секретность противоречила бы смыслу стандарта."],
    ["To limit the suite to a single vendor's operating system", "Standards do the opposite: they let many systems from many vendors work together.", "Стандарты делают наоборот: позволяют системам разных производителей работать вместе."],
  ], "The notes say the suite is approved by a standards organization to ensure interoperability.", "В конспекте сказано: набор утверждён организацией по стандартизации ради совместимости."),

  qx("At which layers do the TCP/IP protocols themselves operate?", "Application, transport and internet", [
    ["Application, session and presentation", "Session and presentation are OSI layers; TCP/IP merges them into its application layer.", "Сеансовый и представления — уровни OSI; в TCP/IP они входят в уровень приложений."],
    ["Transport, internet and network access", "The network access layer is served by LAN protocols like Ethernet and WLAN, not by TCP/IP itself.", "Уровень сетевого доступа обслуживают протоколы LAN вроде Ethernet и WLAN, а не сам TCP/IP."],
    ["Physical, data link and network", "These are OSI layer names; the notes list application, transport and internet for TCP/IP.", "Это названия уровней OSI; для TCP/IP в конспекте перечислены приложений, транспортный и интернет."],
  ], "TCP/IP protocols operate at the application, transport and internet layers.", "Протоколы TCP/IP работают на уровнях приложений, транспортном и интернет."),

  qx("Which are the most common network access layer LAN protocols?", "Ethernet and WLAN", [
    ["TCP and UDP", "TCP and UDP are transport-layer protocols, not network access protocols.", "TCP и UDP — протоколы транспортного уровня, а не сетевого доступа."],
    ["IPv4 and IPv6 addressing", "IPv4 and IPv6 live at the internet layer; they ride on top of Ethernet or WLAN.", "IPv4 и IPv6 — уровень интернет; они работают поверх Ethernet или WLAN."],
    ["HTTP and DNS", "HTTP and DNS are application-layer protocols far above network access.", "HTTP и DNS — протоколы прикладного уровня, намного выше сетевого доступа."],
  ], "The most common network access layer LAN protocols are Ethernet and WLAN (wireless LAN).", "Самые распространённые протоколы уровня сетевого доступа в LAN — Ethernet и WLAN."),

  qx("Which three things do open standards encourage, according to the notes?", "Interoperability, competition and innovation", [
    ["Secrecy, monopoly and stability", "Secrecy and monopoly are what proprietary suites bring; open standards do the reverse.", "Секретность и монополия — удел закрытых наборов; открытые стандарты дают обратное."],
    ["Speed, bandwidth and latency", "These are performance measures, not effects of open standards on the market.", "Это показатели производительности, а не влияние открытых стандартов на рынок."],
    ["Encryption, data integrity and authentication", "These are the tasks of network security protocols, not benefits of openness.", "Это задачи протоколов безопасности, а не преимущества открытости."],
  ], "Open standards encourage interoperability, competition and innovation.", "Открытые стандарты поощряют совместимость, конкуренцию и инновации."),

  tfx("Standards organizations are usually vendor-neutral, non-profit organizations.", true,
    "They are set up to develop and promote open standards rather than one vendor's products.", "Они созданы, чтобы разрабатывать и продвигать открытые стандарты, а не продукты одного производителя.",
    "If they were owned by a vendor or run for profit, their standards would not be trusted as neutral.", "Будь они собственностью производителя или коммерческими, их стандартам не доверяли бы как нейтральным."),

  qx("Which organization promotes the open development and evolution of the internet?", "ISOC", [
    ["IAB", "The IAB manages and develops internet standards; promotion of the open internet is ISOC's role.", "IAB управляет стандартами интернета и развивает их; продвижение открытого интернета — роль ISOC."],
    ["IRTF", "The IRTF does long-term research, not public promotion of the internet.", "IRTF ведёт долгосрочные исследования, а не публичное продвижение интернета."],
    ["ICANN", "ICANN coordinates IP addresses and domain names; it is not the internet's advocacy body.", "ICANN координирует IP-адреса и доменные имена; защитой интересов интернета он не занимается."],
  ], "ISOC, the Internet Society, promotes the open development and evolution of the internet.", "ISOC, Общество интернета, продвигает открытое развитие и эволюцию интернета."),

  qx("Which body is responsible for the overall management and development of internet standards?", "IAB", [
    ["ISOC", "ISOC promotes the open internet in general; the IAB oversees the standards themselves.", "ISOC продвигает открытый интернет в целом; надзор за самими стандартами — у IAB."],
    ["IANA", "IANA manages IP addresses, domain names and protocol identifiers for ICANN, not the standards process.", "IANA ведёт IP-адреса, доменные имена и идентификаторы протоколов для ICANN, а не процесс стандартизации."],
    ["TIA", "The TIA handles radio, cellular, VoIP and satellite equipment standards, not internet standards.", "TIA занимается стандартами радио, сотовой связи, VoIP и спутников, а не интернета."],
  ], "The IAB, Internet Architecture Board, is responsible for the management and development of internet standards.", "IAB, Совет по архитектуре интернета, отвечает за управление стандартами интернета и их развитие."),

  qx("Which organization develops, updates and maintains internet and TCP/IP technologies?", "IETF", [
    ["IEEE", "The IEEE produces 802.3 and 802.11 LAN standards, not the TCP/IP suite.", "IEEE выпускает стандарты LAN 802.3 и 802.11, а не набор TCP/IP."],
    ["IRTF", "The IRTF focuses on long-term research; day-to-day engineering of TCP/IP is the IETF's job.", "IRTF сосредоточен на долгосрочных исследованиях; инженерия TCP/IP — дело IETF."],
    ["ITU-T", "ITU-T works on video compression, IPTV and DSL, not on TCP/IP maintenance.", "ITU-T занимается сжатием видео, IPTV и DSL, а не поддержкой TCP/IP."],
  ], "The IETF, Internet Engineering Task Force, develops, updates and maintains internet and TCP/IP technologies.", "IETF, Инженерный совет интернета, разрабатывает, обновляет и поддерживает технологии интернета и TCP/IP."),

  qx("Which internet body is focused on long-term research?", "IRTF", [
    ["IETF", "The IETF engineers and maintains current TCP/IP technologies rather than doing long-term research.", "IETF разрабатывает и поддерживает текущие технологии TCP/IP, а не ведёт долгосрочные исследования."],
    ["IAB", "The IAB manages the development of internet standards; research is left to the IRTF.", "IAB управляет развитием стандартов интернета; исследования оставлены IRTF."],
    ["EIA", "The EIA deals with wiring, connectors and 19-inch racks, nothing to do with internet research.", "EIA занимается проводкой, разъёмами и 19-дюймовыми стойками, к исследованиям интернета отношения не имеет."],
  ], "The IRTF, Internet Research Task Force, is focused on long-term research related to the internet.", "IRTF, Исследовательская группа интернета, ведёт долгосрочные исследования, связанные с интернетом."),

  qx("Which organization coordinates IP address allocation and the management of domain names?", "ICANN", [
    ["IETF", "The IETF writes the protocols; it does not hand out addresses or domain names.", "IETF пишет протоколы; адреса и доменные имена он не раздаёт."],
    ["IEEE", "The IEEE assigns OUIs for MAC addresses, not IP addresses or domain names.", "IEEE назначает OUI для MAC-адресов, а не IP-адреса или доменные имена."],
    ["ISOC", "ISOC promotes the open internet; coordination of addresses and names is ICANN's task.", "ISOC продвигает открытый интернет; координация адресов и имён — задача ICANN."],
  ], "ICANN coordinates IP address allocation, domain name management and other assignments.", "ICANN координирует распределение IP-адресов, управление доменными именами и другие назначения."),

  qx("Which organization oversees IP addresses, domain names and protocol identifiers on behalf of ICANN?", "IANA", [
    ["IAB", "The IAB oversees internet standards, not the day-to-day allocation of addresses and identifiers.", "IAB надзирает за стандартами интернета, а не за ежедневным распределением адресов и идентификаторов."],
    ["IRTF", "The IRTF conducts long-term research and allocates nothing.", "IRTF ведёт долгосрочные исследования и ничего не распределяет."],
    ["ITU-T", "ITU-T standardizes video compression, IPTV and DSL; it does not manage addresses for ICANN.", "ITU-T стандартизирует сжатие видео, IPTV и DSL; адресами для ICANN он не управляет."],
  ], "IANA oversees and manages IP address allocation, domain names and protocol identifiers for ICANN.", "IANA ведёт распределение IP-адресов, доменных имён и идентификаторов протоколов для ICANN."),

  qx("How are ICANN and IANA related?", "IANA does the allocation work for ICANN", [
    ["ICANN is a department of the IETF", "ICANN is a separate organization; the IETF develops TCP/IP technologies and does not contain ICANN.", "ICANN — отдельная организация; IETF разрабатывает технологии TCP/IP и ICANN не включает."],
    ["IANA approves the standards ICANN writes", "Neither body writes protocol standards; that is the IETF's role under the IAB.", "Ни одна из них не пишет стандарты протоколов; это роль IETF под надзором IAB."],
    ["They are two names for one organization", "They are distinct: ICANN coordinates, and IANA manages allocation on its behalf.", "Это разные организации: ICANN координирует, а IANA ведёт распределение от его имени."],
  ], "IANA oversees and manages address, name and protocol identifier allocation for ICANN.", "IANA ведёт распределение адресов, имён и идентификаторов протоколов для ICANN."),

  qx("Which standards are listed under 'ICANN / IANA' in the memory table?", "IP addresses, domain names, protocol numbers", [
    ["802.3 Ethernet, 802.11 Wi-Fi, OUI for MAC addresses", "These are the IEEE's row in the table: LAN standards and MAC address prefixes.", "Это строка IEEE в таблице: стандарты LAN и префиксы MAC-адресов."],
    ["Wiring, connectors, 19-inch racks", "That is the EIA row, about physical infrastructure.", "Это строка EIA — о физической инфраструктуре."],
    ["Video compression, IPTV, DSL", "That is the ITU-T row, about broadband and media standards.", "Это строка ITU-T — о широкополосном доступе и медиа."],
  ], "The table remembers ICANN / IANA by IP addresses, domain names and protocol numbers.", "В таблице ICANN / IANA запоминаются по IP-адресам, доменным именам и номерам протоколов."),

  qx("How is the abbreviation IEEE commonly pronounced?", "I-triple-E", [
    ["I-double-E", "There are three E's in IEEE, so it is pronounced triple, not double.", "В IEEE три буквы E, поэтому произносится triple, а не double."],
    ["Eye-eee", "Spelling it as one sound is not the accepted pronunciation; engineers say I-triple-E.", "Произносить одним звуком не принято; инженеры говорят I-triple-E."],
    ["I-E-E-E", "Spelling out every letter is not how the notes present it; the standard form is I-triple-E.", "Произносить каждую букву отдельно — не так, как в конспекте; принятая форма — I-triple-E."],
  ], "The notes give the pronunciation of IEEE as I-triple-E.", "В конспекте произношение IEEE указано как «ай-трипл-и»."),

  qx("Which organization publishes the 802.3 Ethernet and 802.11 Wi-Fi standards?", "IEEE", [
    ["IETF", "The IETF maintains TCP/IP and publishes RFCs; the 802 family comes from the IEEE.", "IETF поддерживает TCP/IP и публикует RFC; семейство 802 выпускает IEEE."],
    ["TIA", "The TIA covers radio equipment, cellular towers, VoIP and satellite, not LAN standards.", "TIA занимается радиооборудованием, вышками сотовой связи, VoIP и спутниками, а не стандартами LAN."],
    ["ITU-T", "ITU-T focuses on video compression, IPTV and DSL, not on Ethernet or Wi-Fi.", "ITU-T сосредоточен на сжатии видео, IPTV и DSL, а не на Ethernet или Wi-Fi."],
  ], "The IEEE publishes networking standards including 802.3 Ethernet and 802.11 Wi-Fi.", "IEEE выпускает сетевые стандарты, включая 802.3 Ethernet и 802.11 Wi-Fi."),

  qx("Besides networking, in which fields does the IEEE set standards, according to the notes?", "Power and energy, healthcare, telecommunications", [
    ["Radio, cellular towers, satellite", "Those are the TIA's areas, not the IEEE's.", "Это области TIA, а не IEEE."],
    ["Video compression, IPTV, DSL", "Those belong to ITU-T, the telecommunication standardization sector.", "Это сфера ITU-T — сектора стандартизации телекоммуникаций."],
    ["Electrical wiring, connectors, 19-inch equipment racks", "Those are the EIA's areas of electrical and physical standards.", "Это области EIA — электрические и физические стандарты."],
  ], "The IEEE sets standards in power and energy, healthcare, telecommunications and networking.", "IEEE задаёт стандарты в энергетике, здравоохранении, телекоммуникациях и сетях."),

  qx("Which IEEE standard number corresponds to Wi-Fi?", "802.11", [
    ["802.3", "802.3 is the Ethernet standard for wired LANs.", "802.3 — стандарт Ethernet для проводных LAN."],
    ["802.1", "802.1 covers bridging and management; it is not the wireless LAN standard.", "802.1 охватывает мосты и управление; это не стандарт беспроводных LAN."],
    ["802.15", "802.15 deals with personal area networks such as Bluetooth, not Wi-Fi.", "802.15 относится к персональным сетям вроде Bluetooth, а не к Wi-Fi."],
  ], "Wi-Fi is defined by IEEE 802.11; Ethernet is IEEE 802.3.", "Wi-Fi определён стандартом IEEE 802.11; Ethernet — IEEE 802.3."),

  qx("A new version of the Wi-Fi standard is being published. Which organization releases it?", "IEEE", [
    ["IANA", "IANA manages addresses, names and protocol numbers; it does not write wireless standards.", "IANA управляет адресами, именами и номерами протоколов; беспроводные стандарты она не пишет."],
    ["ISO", "ISO co-developed the OSI protocols; Wi-Fi (802.11) is an IEEE standard.", "ISO участвовала в разработке протоколов OSI; Wi-Fi (802.11) — стандарт IEEE."],
    ["EIA", "The EIA defines wiring, connectors and racks, not wireless LAN protocols.", "EIA определяет проводку, разъёмы и стойки, а не протоколы беспроводных LAN."],
  ], "Wi-Fi is IEEE 802.11, so new versions come from the IEEE.", "Wi-Fi — это IEEE 802.11, поэтому новые версии выпускает IEEE."),

  qx("In the memory table, which item besides 802.3 and 802.11 is linked to the IEEE?", "OUI for MAC addresses", [
    ["RFC documents for TCP/IP", "RFCs are the IETF's publications for TCP/IP and internet technologies.", "RFC — публикации IETF по TCP/IP и технологиям интернета."],
    ["Domain names", "Domain names are coordinated by ICANN and managed by IANA.", "Доменные имена координирует ICANN, а ведёт IANA."],
    ["19-inch racks", "Equipment racks are an EIA standard, not an IEEE one.", "Стойки для оборудования — стандарт EIA, а не IEEE."],
  ], "The table lists the IEEE with 802.3 Ethernet, 802.11 Wi-Fi and the OUI for MAC addresses.", "В таблице IEEE связан с 802.3 Ethernet, 802.11 Wi-Fi и OUI для MAC-адресов."),

  qx("Which organization sets standards for electrical wiring, connectors and 19-inch racks?", "EIA", [
    ["TIA", "The TIA covers radio equipment, cellular towers, VoIP devices and satellite communications.", "TIA занимается радиооборудованием, вышками сотовой связи, устройствами VoIP и спутниковой связью."],
    ["IEEE", "The IEEE defines LAN protocols like Ethernet and Wi-Fi, not racks and wiring.", "IEEE определяет протоколы LAN вроде Ethernet и Wi-Fi, а не стойки и проводку."],
    ["ITU-T", "ITU-T deals with video compression, IPTV and DSL, not physical infrastructure.", "ITU-T занимается сжатием видео, IPTV и DSL, а не физической инфраструктурой."],
  ], "The EIA is known for standards on electrical wiring, connectors and the 19-inch racks for network equipment.", "EIA известна стандартами на электропроводку, разъёмы и 19-дюймовые стойки для сетевого оборудования."),

  qx("What is the standard width of equipment racks mentioned in the notes?", "19 inches", [
    ["24 inches", "The notes specify 19-inch racks; 24 inches is not the standard rack width given.", "В конспекте указаны 19-дюймовые стойки; 24 дюйма — не тот размер."],
    ["12 inches", "12 inches is too narrow for network equipment; the standard rack is 19 inches wide.", "12 дюймов слишком узко для сетевого оборудования; стандартная стойка — 19 дюймов."],
    ["42 inches", "42 is a common rack height in units (42U), not the 19-inch width.", "42 — распространённая высота стойки в юнитах (42U), а не ширина 19 дюймов."],
  ], "The EIA standardizes the 19-inch racks used to mount network equipment.", "EIA стандартизирует 19-дюймовые стойки для монтажа сетевого оборудования."),

  qx("Which organization develops standards for radio equipment, cellular towers, VoIP devices and satellite communications?", "TIA", [
    ["EIA", "The EIA handles wiring, connectors and racks; radio and cellular belong to the TIA.", "EIA ведёт проводку, разъёмы и стойки; радио и сотовая связь — у TIA."],
    ["IRTF", "The IRTF is an internet research body and has nothing to do with radio hardware.", "IRTF — исследовательская интернет-организация, к радиооборудованию отношения не имеет."],
    ["ISOC", "ISOC promotes the open internet; it does not standardize telecom equipment.", "ISOC продвигает открытый интернет; телеком-оборудование он не стандартизирует."],
  ], "The TIA is responsible for standards on radio equipment, cellular towers, VoIP devices and satellite communications.", "TIA отвечает за стандарты радиооборудования, вышек сотовой связи, устройств VoIP и спутниковой связи."),

  qx("Which organization works on video compression, IPTV and broadband such as DSL?", "ITU-T", [
    ["IEEE", "The IEEE covers Ethernet, Wi-Fi and the OUI, not video compression or DSL.", "IEEE ведёт Ethernet, Wi-Fi и OUI, а не сжатие видео или DSL."],
    ["IETF", "The IETF maintains TCP/IP and internet technologies; DSL and IPTV standards come from ITU-T.", "IETF поддерживает TCP/IP и технологии интернета; стандарты DSL и IPTV — от ITU-T."],
    ["ICANN", "ICANN coordinates addresses and names and has no role in media or broadband standards.", "ICANN координирует адреса и имена и не участвует в стандартах медиа или широкополосного доступа."],
  ], "ITU-T defines standards for video compression, IPTV and broadband communications such as DSL.", "ITU-T определяет стандарты сжатия видео, IPTV и широкополосной связи, например DSL."),

  qx("Which document type is linked to the IETF in the memory table?", "RFC documents", [
    ["802 standards", "The 802 series (802.3, 802.11) is published by the IEEE.", "Серия 802 (802.3, 802.11) публикуется IEEE."],
    ["OUI registrations", "OUIs for MAC addresses are assigned by the IEEE, not the IETF.", "OUI для MAC-адресов назначает IEEE, а не IETF."],
    ["DSL recommendations", "DSL falls under ITU-T, not the IETF.", "DSL относится к ITU-T, а не к IETF."],
  ], "The table remembers the IETF by TCP/IP, internet technologies and RFC documents.", "В таблице IETF запоминается по TCP/IP, технологиям интернета и документам RFC."),

  qx("Which pairing from the memory table is correct?", "TIA — radio, cellular, VoIP, satellite", [
    ["EIA — video compression, IPTV, DSL", "Video compression, IPTV and DSL are ITU-T's row; the EIA covers wiring, connectors and racks.", "Сжатие видео, IPTV и DSL — строка ITU-T; EIA ведёт проводку, разъёмы и стойки."],
    ["IRTF — promotes the open internet", "Promoting the open internet is ISOC's row; the IRTF does long-term research.", "Продвижение открытого интернета — строка ISOC; IRTF ведёт долгосрочные исследования."],
    ["IAB — IP addresses, domain names, protocol numbers", "Addresses and names are ICANN / IANA; the IAB manages the development of internet standards.", "Адреса и имена — ICANN / IANA; IAB управляет развитием стандартов интернета."],
  ], "The table pairs the TIA with radio, cellular, VoIP and satellite.", "В таблице TIA сопоставлена с радио, сотовой связью, VoIP и спутниками."),

  qx("Complete the callout: 'IETF builds TCP/IP, ICANN and IANA hand out addresses and names, IEEE defines Ethernet and Wi-Fi, ___ define cabling.'", "TIA/EIA", [
    ["ISO/ITU", "ISO and ITU developed the OSI protocols; cabling standards are TIA/EIA.", "ISO и ITU разработали протоколы OSI; стандарты кабельных систем — TIA/EIA."],
    ["IAB/IRTF", "The IAB manages standards and the IRTF does research; neither defines cabling.", "IAB управляет стандартами, IRTF ведёт исследования; кабели не определяет ни один."],
    ["ISOC/IANA", "ISOC promotes the open internet and IANA allocates identifiers; cabling is not their field.", "ISOC продвигает открытый интернет, IANA распределяет идентификаторы; кабели — не их область."],
  ], "The callout ends with TIA/EIA defining cabling, matching their wiring, connector and rack standards.", "Выноска заканчивается тем, что TIA/EIA определяют кабельные системы, что соответствует их стандартам проводки, разъёмов и стоек."),

  tfx("The IETF is the organization that assigns IP address blocks and domain names.", false,
    "Address and name allocation is coordinated by ICANN and managed by IANA; the IETF develops the TCP/IP technologies.", "Распределение адресов и имён координирует ICANN и ведёт IANA; IETF разрабатывает технологии TCP/IP.",
    "Saying true confuses the body that writes the protocols with the bodies that hand out the identifiers.", "Ответ «верно» путает организацию, пишущую протоколы, с организациями, раздающими идентификаторы."),
];
