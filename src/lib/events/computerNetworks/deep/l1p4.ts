import { qx, tfx, type Draft } from "../../types";

/** Разбор до косточек: лекция 1, часть 4 — базовая настройка устройства и её сохранение. */
export const deepL1P4: Draft[] = [
  qx("What should the very first configuration command on a new Cisco device do?", "Give the device a unique hostname", [
    ["Set the privileged EXEC enable secret password", "The enable secret is important, but the notes say the first command should give the device a unique name so it can be told apart.", "Пароль enable secret важен, но по конспекту первая команда — дать устройству уникальное имя, чтобы его можно было отличить."],
    ["Configure the banner message", "The banner is a legal warning added later; it does not identify the device.", "Баннер — юридическое предупреждение, его добавляют позже; устройство он не идентифицирует."],
    ["Secure the console line", "Securing the console comes after naming the device; the hostname is the first step in the notes.", "Защита консоли идёт после присвоения имени; в конспекте hostname — первый шаг."],
  ], "The notes state that the first configuration command on any device should give it a unique hostname.", "В конспекте сказано: первая команда настройки на любом устройстве — дать ему уникальное имя (hostname)."),

  qx("What is the factory default hostname of a Cisco switch?", "Switch", [
    ["Router", "Router is the default name of a Cisco router, not of a switch.", "Router — заводское имя маршрутизатора Cisco, а не коммутатора."],
    ["Cisco", "Cisco is the vendor name and a weak lab password, not the default hostname.", "Cisco — имя производителя и слабый лабораторный пароль, а не имя по умолчанию."],
    ["Catalyst", "Catalyst is a product line name; the prompt of an unconfigured switch shows Switch.", "Catalyst — название линейки продуктов; приглашение ненастроенного коммутатора показывает Switch."],
  ], "An unconfigured Cisco switch is named Switch, which is why its prompt shows Switch> and Switch#.", "Ненастроенный коммутатор Cisco называется Switch, поэтому его приглашение — Switch> и Switch#."),

  qx("According to the naming guidelines, a hostname must begin with which kind of character?", "A letter", [
    ["A digit", "A digit may appear inside or at the end of the name, but the name must not start with one.", "Цифра может стоять внутри или в конце имени, но начинаться с неё имя не может."],
    ["A dash", "A dash is allowed inside the name only; it cannot be the first or the last character.", "Дефис допустим только внутри имени; первым или последним символом он быть не может."],
    ["An underscore", "Underscores are not allowed anywhere in a hostname; only letters, digits and dashes are.", "Подчёркивание в имени недопустимо вообще; разрешены только буквы, цифры и дефисы."],
  ], "A hostname must start with a letter and end with a letter or a digit.", "Имя должно начинаться с буквы и заканчиваться буквой или цифрой."),

  qx("An admin wants to rename a switch. Which of these names will IOS accept?", "Branch-SW2", [
    ["2nd-Floor-SW", "This name starts with a digit, but a hostname must start with a letter.", "Это имя начинается с цифры, а hostname должен начинаться с буквы."],
    ["Main Switch", "Spaces are not allowed in a hostname; IOS would treat the second word as a separate argument.", "Пробелы в имени недопустимы; IOS воспримет второе слово как отдельный аргумент."],
    ["Core-SW-", "A hostname must end with a letter or digit, so a trailing dash is invalid.", "Имя должно заканчиваться буквой или цифрой, поэтому дефис в конце недопустим."],
  ], "Branch-SW2 starts with a letter, ends with a digit, has no spaces and uses only letters, digits and dashes.", "Branch-SW2 начинается с буквы, заканчивается цифрой, без пробелов и состоит только из букв, цифр и дефисов."),

  qx("Why is 'Sw_Floor_1' not a valid Cisco hostname?", "It contains underscores, which are not allowed", [
    ["It is longer than the 64-character maximum length", "The name has only 10 characters, well under the 64-character limit.", "В имени всего 10 символов — намного меньше предела в 64 символа."],
    ["It starts with a letter", "Starting with a letter is required, not forbidden; that part of the name is fine.", "Начинаться с буквы как раз обязательно, а не запрещено; эта часть имени в порядке."],
    ["It ends with a digit", "Ending with a digit is allowed; names must end with a letter or digit.", "Заканчиваться цифрой разрешено; имя должно кончаться буквой или цифрой."],
  ], "Only letters, digits and dashes are allowed, so the underscores make the name invalid.", "Разрешены только буквы, цифры и дефисы, поэтому подчёркивания делают имя недопустимым."),

  qx("What is the maximum length rule for a Cisco hostname?", "Shorter than 64 characters", [
    ["Shorter than 16 characters", "The limit in the notes is 64 characters, not 16; a 20-character name is fine.", "Предел по конспекту — 64 символа, а не 16; имя из 20 символов допустимо."],
    ["Shorter than 32 characters", "32 is not the limit given; a hostname may be up to 63 characters long.", "32 — не тот предел; имя может быть длиной до 63 символов."],
    ["Shorter than 128 characters", "128 is too generous; the guideline says the name must be shorter than 64 characters.", "128 — слишком много; по правилу имя должно быть короче 64 символов."],
  ], "The naming guidelines require the hostname to be shorter than 64 characters.", "По правилам именования hostname должен быть короче 64 символов."),

  qx("An admin typed 'hostname Sw-Floor-1' at Switch(config)#. Which prompt appears next?", "Sw-Floor-1(config)#", [
    ["Switch(config)#", "The hostname change takes effect immediately, so the old name Switch no longer appears in the prompt.", "Смена имени действует сразу, поэтому старое имя Switch в приглашении больше не показывается."],
    ["Sw-Floor-1#", "The admin stays in global configuration mode; the # alone would mean privileged EXEC.", "Админ остаётся в режиме глобальной конфигурации; одна # означала бы привилегированный EXEC."],
    ["Sw-Floor-1(config-line)#", "(config-line)# is line configuration mode, entered with the line command; hostname does not move you there.", "(config-line)# — режим настройки линии, в него входят командой line; hostname туда не переводит."],
  ], "The new name replaces Switch in the prompt right away, and the mode stays global configuration.", "Новое имя сразу заменяет Switch в приглашении, а режим остаётся глобальной конфигурацией."),

  qx("What does the command 'no hostname' do?", "Returns the device name to the default Switch", [
    ["Leaves the device with an empty, nameless prompt", "A device always has a name; removing the custom one restores the default Switch.", "У устройства всегда есть имя; удаление своего возвращает заводское Switch."],
    ["Erases the whole running-config", "The no form removes only the hostname command, not the rest of the configuration.", "Форма no убирает только команду hostname, а не остальную конфигурацию."],
    ["Reloads the device immediately", "no hostname does not restart anything; a restart is done with reload.", "no hostname ничего не перезапускает; перезагрузку делает команда reload."],
  ], "The no form of a command undoes it, so no hostname brings back the factory name Switch.", "Форма no отменяет команду, поэтому no hostname возвращает заводское имя Switch."),

  qx("How long should a device password be, according to the guidelines?", "More than eight characters", [
    ["Exactly eight characters", "Eight is the minimum to exceed, not the target; the guideline says more than eight.", "Восемь — порог, который надо превысить, а не цель; по правилу — больше восьми."],
    ["At least four characters", "Four characters is far too short; such a password is easy to guess or brute-force.", "Четыре символа — слишком мало; такой пароль легко подобрать."],
    ["No more than eight characters", "This is backwards: the notes recommend passwords longer than eight characters.", "Это наоборот: конспект рекомендует пароли длиннее восьми символов."],
  ], "Passwords should use more than eight characters and mix cases, digits and special characters.", "Пароль должен быть длиннее восьми символов и смешивать регистр, цифры и спецсимволы."),

  qx("Which password practice do the notes recommend?", "Mix upper case, lower case, digits and symbols", [
    ["Reuse one password on every device", "Reusing a password means one leak compromises all devices; the notes explicitly warn against it.", "Один пароль на все устройства — одна утечка открывает их все; конспект прямо это запрещает."],
    ["Pick a common word that is easy to type", "Common words are in every dictionary attack list; the notes say to avoid them.", "Обычные слова есть в любом словаре для перебора; конспект велит их избегать."],
    ["Keep the standard lab passwords cisco and class", "cisco and class are the classic weak lab passwords and must not be used in production.", "cisco и class — классические слабые лабораторные пароли, в бою их использовать нельзя."],
  ], "A strong password mixes character types, is longer than eight characters and is unique per device.", "Надёжный пароль смешивает типы символов, длиннее восьми знаков и уникален для устройства."),

  qx("Which kind of access does the command 'line console 0' let you protect?", "User EXEC access through the console port", [
    ["Privileged EXEC access", "Privileged EXEC is protected with enable secret in global configuration mode, not on a line.", "Привилегированный EXEC защищается командой enable secret в глобальной конфигурации, а не на линии."],
    ["Remote Telnet and SSH access over the VTY lines", "Remote sessions use the VTY lines (line vty 0 15), not the console line.", "Удалённые сессии идут через линии VTY (line vty 0 15), а не через консоль."],
    ["Global configuration mode", "There is no separate password for configuration mode; it is reached from privileged EXEC.", "Отдельного пароля на режим конфигурации нет; в него входят из привилегированного EXEC."],
  ], "line console 0 enters line configuration mode for the console, where a password protects user EXEC access.", "line console 0 входит в настройку консольной линии, где пароль защищает доступ к пользовательскому EXEC."),

  tfx("On a console or VTY line, 'password cisco' alone is enough to make the device ask for the password.", false,
    "The password command only stores the password; the login command is what enables password checking on the line.", "Команда password лишь сохраняет пароль; проверку пароля на линии включает команда login.",
    "Without login the line never prompts for the stored password, so the two commands must be used together.", "Без login линия никогда не спросит сохранённый пароль, поэтому команды используются вместе."),

  qx("After 'Sw1(config)# line console 0', which prompt does the admin see?", "Sw1(config-line)#", [
    ["Sw1(config-if)#", "(config-if)# is interface configuration mode, entered with the interface command, not with line.", "(config-if)# — режим настройки интерфейса, в него входят командой interface, а не line."],
    ["Sw1(config)#", "The line command moves one level deeper than global configuration, so the prompt changes.", "Команда line уводит на уровень глубже глобальной конфигурации, поэтому приглашение меняется."],
    ["Sw1(config-console)#", "IOS uses the generic (config-line)# prompt for console and VTY lines alike; there is no (config-console)#.", "IOS использует общее приглашение (config-line)# и для консоли, и для VTY; (config-console)# не существует."],
  ], "Both console and VTY lines are configured in line configuration mode, shown as (config-line)#.", "И консоль, и линии VTY настраиваются в режиме линии с приглашением (config-line)#."),

  qx("Which command protects entry into privileged EXEC mode?", "enable secret class", [
    ["password class", "password is a line sub-command for console or VTY access; it does not guard the enable command.", "password — подкоманда линии для консоли или VTY; команду enable она не защищает."],
    ["login class", "login takes no password argument; it only turns on password checking for a line.", "login не принимает пароль как аргумент; она лишь включает проверку пароля на линии."],
    ["secret enable class", "The keyword order is wrong; the command begins with enable, then secret, then the password.", "Порядок слов неверен; команда начинается с enable, затем secret, затем пароль."],
  ], "enable secret sets the password requested when a user types enable to reach privileged EXEC.", "enable secret задаёт пароль, который спрашивается, когда пользователь вводит enable для входа в привилегированный EXEC."),

  qx("Only 'enable secret class' is configured. What happens when someone connects via the console?", "User EXEC opens freely; 'class' is asked at enable", [
    ["The console asks for 'class' before showing any prompt", "enable secret guards the step from user EXEC to privileged EXEC, not the console login itself.", "enable secret защищает переход из пользовательского EXEC в привилегированный, а не сам вход через консоль."],
    ["The console is locked until a VTY password is set", "VTY passwords affect only remote sessions; the console is independent of them.", "Пароли VTY влияют только на удалённые сессии; консоль от них не зависит."],
    ["Privileged EXEC opens without any password", "The enable secret is exactly what makes privileged EXEC ask for a password.", "Как раз enable secret и заставляет привилегированный EXEC спрашивать пароль."],
  ], "Without a console password the > prompt appears directly, and the enable secret is requested only on enable.", "Без консольного пароля приглашение > появляется сразу, а пароль enable secret спрашивается только при enable."),

  qx("Which command enters configuration mode for all 16 remote-access lines at once?", "line vty 0 15", [
    ["line vty 0 16", "Lines are numbered 0 to 15; there is no line 16 on these switches.", "Линии нумеруются с 0 по 15; линии 16 на таких коммутаторах нет."],
    ["line vty 1 16", "Numbering starts at 0, so this range skips line 0 and names a non-existent line 16.", "Нумерация начинается с 0, поэтому диапазон пропускает линию 0 и называет несуществующую 16."],
    ["line console 0 15", "The console is a single line 0; ranges apply to VTY lines, not to the console.", "Консоль — одна линия 0; диапазоны относятся к линиям VTY, а не к консоли."],
  ], "VTY lines are numbered 0 to 15, so line vty 0 15 configures all 16 of them together.", "Линии VTY нумеруются с 0 по 15, поэтому line vty 0 15 настраивает все 16 сразу."),

  qx("How many VTY lines does the range 'vty 0 15' include?", "16", [
    ["15", "Counting from 0 to 15 inclusive gives 16 lines, not 15; the zero line counts too.", "Счёт от 0 до 15 включительно даёт 16 линий, а не 15; нулевая линия тоже считается."],
    ["5", "Five is the number of concurrent sessions on some older devices, but the notes say 16 lines.", "Пять — число сессий на некоторых старых устройствах, но по конспекту линий 16."],
    ["32", "The notes mention 16 lines; 32 would need a range such as vty 0 31.", "В конспекте 16 линий; для 32 понадобился бы диапазон вроде vty 0 31."],
  ], "Lines 0 through 15 inclusive make 16 VTY lines.", "Линии с 0 по 15 включительно — это 16 линий VTY."),

  qx("Which command sequence from the table protects remote Telnet/SSH access?", "line vty 0 15 → password … → login", [
    ["line console 0 → password … → login", "This sequence protects the console port, which is local user EXEC access, not remote access.", "Эта последовательность защищает консольный порт — локальный доступ, а не удалённый."],
    ["enable secret … → login", "enable secret protects privileged EXEC and is not followed by login; it is not about remote lines.", "enable secret защищает привилегированный EXEC и за ним не идёт login; к удалённым линиям он не относится."],
    ["service password-encryption → login", "service password-encryption hides passwords in the config; it does not configure any line.", "service password-encryption скрывает пароли в конфигурации; линии она не настраивает."],
  ], "Remote access is secured on the VTY lines with a password followed by login.", "Удалённый доступ защищается на линиях VTY паролем и командой login."),

  qx("What does 'service password-encryption' do?", "Encrypts all plaintext passwords in the config files", [
    ["Encrypts the Telnet traffic between the PC and the switch", "Telnet stays plaintext on the wire; the command only changes how passwords are stored in the configuration.", "Telnet остаётся открытым в сети; команда меняет лишь то, как пароли хранятся в конфигурации."],
    ["Encrypts only the enable secret", "The enable secret is already hashed; this command targets the other plaintext passwords, such as line passwords.", "enable secret и так захэширован; команда предназначена для остальных открытых паролей, например на линиях."],
    ["Requires a password on every line", "It adds no password requirements; it only encrypts passwords that are already configured.", "Она не добавляет требований к паролям, а лишь шифрует уже настроенные."],
  ], "The configuration normally shows most passwords in plaintext; this command encrypts them all.", "Обычно в конфигурации большинство паролей видны открытым текстом; эта команда шифрует их все."),

  qx("An admin typed 'service password-encryption' at Sw1(config-line)# and got an error. At which prompt does it belong?", "Sw1(config)#", [
    ["Sw1#", "Privileged EXEC is for show and copy commands; configuration commands need a (config) prompt.", "Привилегированный EXEC — для show и copy; команды настройки требуют приглашения (config)."],
    ["Sw1>", "User EXEC allows only basic monitoring and cannot change the configuration at all.", "Пользовательский EXEC даёт только базовое наблюдение и ничего не меняет в конфигурации."],
    ["Sw1(config-if)#", "Interface mode is for one port's settings; a service command is global, not per interface.", "Режим интерфейса — для настроек одного порта; команда service глобальная, а не поинтерфейсная."],
  ], "service password-encryption is a global configuration command, entered at the (config)# prompt.", "service password-encryption — команда глобальной конфигурации, вводится в приглашении (config)#."),

  qx("What is the purpose of a banner on a Cisco device?", "To warn unauthorized people that access is restricted", [
    ["To welcome users with a friendly greeting at every login", "A welcoming message can weaken a legal case against an intruder; the banner should warn, not invite.", "Приветствие может ослабить юридическую позицию против нарушителя; баннер должен предупреждать, а не приглашать."],
    ["To list the interfaces of the device", "Interface information comes from show commands, not from the banner text.", "Сведения об интерфейсах дают команды show, а не текст баннера."],
    ["To display hints about the passwords", "Hints would help an attacker; a banner never reveals anything about passwords.", "Подсказки помогли бы злоумышленнику; баннер никогда не раскрывает ничего о паролях."],
  ], "The banner is a legal warning to unauthorized people, shown before they log in.", "Баннер — юридическое предупреждение посторонним, показывается до входа."),

  qx("In 'banner motd #Authorized access only!#', where must the delimiting character appear?", "Before and after the message text", [
    ["Only at the start of the message", "Without the closing delimiter IOS would keep reading more lines as part of the banner.", "Без закрывающего разделителя IOS продолжит считать следующие строки частью баннера."],
    ["Only at the end of the message", "The opening delimiter tells IOS which character will end the message, so it is required too.", "Открывающий разделитель сообщает IOS, какой символ завершит сообщение, поэтому он тоже обязателен."],
    ["Between every two words of the message", "The delimiter marks the boundaries of the whole message, not of individual words.", "Разделитель отмечает границы всего сообщения, а не отдельных слов."],
  ], "The delimiting character is typed before and after the message so IOS knows where it starts and ends.", "Символ-разделитель ставится до и после сообщения, чтобы IOS знала, где оно начинается и заканчивается."),

  qx("Which keyword follows 'banner' to set the message-of-the-day text?", "motd", [
    ["login", "banner login exists in IOS, but the notes and the example use the message-of-the-day banner, motd.", "banner login в IOS есть, но в конспекте и примере используется баннер дня — motd."],
    ["message", "message is not a banner type; the message-of-the-day keyword is abbreviated motd.", "message — не тип баннера; ключевое слово баннера дня сокращается до motd."],
    ["warning", "There is no banner warning command; the warning text goes into banner motd.", "Команды banner warning не существует; предупреждение пишут в banner motd."],
  ], "banner motd sets the message of the day, as in banner motd #Authorized access only!#.", "banner motd задаёт сообщение дня, как в banner motd #Authorized access only!#."),

  qx("In which memory is the startup-config stored?", "NVRAM", [
    ["RAM", "RAM holds the running-config and is volatile; it loses everything on power-off.", "В RAM лежит running-config, и она энергозависима: при выключении всё теряется."],
    ["Flash", "Flash holds the IOS image; the notes place the startup-config in NVRAM.", "Во flash хранится образ IOS; по конспекту startup-config лежит в NVRAM."],
    ["ROM", "ROM holds bootstrap code and cannot be rewritten with a copy command.", "В ROM — загрузочный код, и его нельзя перезаписать командой copy."],
  ], "The startup-config lives in NVRAM, which keeps its contents through a power-off.", "startup-config хранится в NVRAM, которая сохраняет содержимое при выключении."),

  qx("Which configuration file reflects a change the moment the admin types a command?", "The running-config in RAM", [
    ["The startup-config in NVRAM", "The startup-config changes only when you copy the running-config into it.", "startup-config меняется только когда в него копируют running-config."],
    ["The log file in the terminal program", "The terminal log only records what is displayed; it is not a configuration the device uses.", "Журнал терминала лишь записывает выводимое; устройство эту запись как конфигурацию не использует."],
    ["The IOS image in flash", "The IOS image is the operating system, not a configuration file, and commands do not modify it.", "Образ IOS — операционная система, а не файл конфигурации; команды его не меняют."],
  ], "The running-config is the current configuration; changes to it take effect immediately.", "running-config — текущая конфигурация; изменения в ней действуют сразу."),

  tfx("RAM is volatile, so the running-config is lost when the device is powered off or restarted.", true,
    "RAM keeps data only while powered; anything not copied to NVRAM disappears on reboot.", "RAM хранит данные только при питании; всё, что не скопировано в NVRAM, пропадает при перезагрузке.",
    "Claiming RAM survives a reboot confuses it with NVRAM, where the startup-config is kept.", "Утверждать, что RAM переживает перезагрузку, — путать её с NVRAM, где лежит startup-config."),

  qx("Which file does the device load when it boots or reboots?", "startup-config from NVRAM", [
    ["running-config from RAM", "RAM is empty after a reboot, so there is no running-config to load; it is rebuilt from the startup-config.", "После перезагрузки RAM пуста, загружать running-config неоткуда; он строится из startup-config."],
    ["The last show running-config output", "Show output is just text displayed on the screen; the device never boots from it.", "Вывод show — просто текст на экране; устройство с него не загружается."],
    ["The terminal program's log file", "A terminal log is an external backup that must be pasted in manually; the device does not read it.", "Журнал терминала — внешняя копия, которую вставляют вручную; устройство его не читает."],
  ], "At startup the device copies the startup-config from NVRAM into RAM as the new running-config.", "При запуске устройство копирует startup-config из NVRAM в RAM как новый running-config."),

  qx("An admin finished configuring and wants the settings to survive a reboot. What should be typed at Sw1#?", "copy running-config startup-config", [
    ["copy startup-config running-config", "This goes the other way: it merges the saved file into RAM and could undo the new work.", "Это обратное направление: сохранённый файл сливается в RAM и может отменить новую работу."],
    ["save running-config", "save is not an IOS command; saving is done with copy from running-config to startup-config.", "save — не команда IOS; сохранение делается командой copy из running-config в startup-config."],
    ["write startup-config", "There is no write startup-config; the notes use copy running-config startup-config.", "Команды write startup-config нет; в конспекте используется copy running-config startup-config."],
  ], "copy running-config startup-config writes the current configuration from RAM into NVRAM.", "copy running-config startup-config записывает текущую конфигурацию из RAM в NVRAM."),

  qx("Fill the gap: 'copy running-config startup-config' is typed at the ___ prompt.", "Sw1#", [
    ["Sw1>", "User EXEC cannot save the configuration; you must type enable first to reach the # prompt.", "Пользовательский EXEC не может сохранить конфигурацию; сначала нужно ввести enable, чтобы попасть в #."],
    ["Sw1(config)#", "copy is an EXEC command, not a configuration command, so it is not entered in (config) mode.", "copy — команда EXEC, а не настройки, поэтому в режиме (config) её не вводят."],
    ["Sw1(config-line)#", "Line configuration mode is for passwords and login on a line; copy does not belong there.", "Режим линии — для паролей и login на линии; команде copy там не место."],
  ], "The callout says it: copy running-config startup-config is typed at the # prompt, privileged EXEC.", "Так и сказано в выноске: copy running-config startup-config вводится в приглашении # — привилегированном EXEC."),

  qx("You made unwanted changes but have not saved them. Which action discards them?", "Reload the device so RAM is refilled from NVRAM", [
    ["Erase the startup-config and keep working in RAM", "That deletes the saved good configuration, while the unwanted changes stay in RAM.", "Это удалит сохранённую хорошую конфигурацию, а нежелательные изменения останутся в RAM."],
    ["Copy running-config to startup-config", "That would save the unwanted changes permanently instead of discarding them.", "Это навсегда сохранит нежелательные изменения вместо того, чтобы их отбросить."],
    ["Disable logging in the terminal program", "Terminal logging only affects the text file on the PC; it has no effect on the device.", "Запись журнала в терминале влияет лишь на файл на ПК; на устройство она не действует."],
  ], "Unsaved changes live only in RAM, so removing them one by one or reloading gets rid of them.", "Несохранённые изменения живут только в RAM, поэтому их убирают по одной или перезагрузкой."),

  qx("What is the downside of using 'reload' to drop unsaved changes?", "The device goes offline for a short time", [
    ["The startup-config in NVRAM is erased as well", "reload does not touch NVRAM; the startup-config is exactly what the device boots from.", "reload не трогает NVRAM; как раз с startup-config устройство и загружается."],
    ["All passwords are decrypted", "Password encryption is part of the saved configuration and stays as it was.", "Шифрование паролей — часть сохранённой конфигурации и остаётся как было."],
    ["The hostname returns to Switch", "The hostname is restored from the startup-config, unless it was never saved.", "Имя восстанавливается из startup-config, если только оно не было не сохранено."],
  ], "A reload restarts the device, so it is unreachable while it boots.", "reload перезапускает устройство, и оно недоступно, пока загружается."),

  qx("After 'erase startup-config', why is 'reload' still needed?", "To clear the old running-config out of RAM", [
    ["To write the running-config into NVRAM", "That is what copy running-config startup-config does, and it would re-save the unwanted settings.", "Это делает copy running-config startup-config, и так нежелательные настройки сохранились бы заново."],
    ["To re-encrypt the passwords", "Encryption is handled by service password-encryption; a reload has nothing to do with it.", "Шифрованием ведает service password-encryption; перезагрузка тут ни при чём."],
    ["To restore the startup-config that was just erased", "Once erased, the startup-config is gone; reload cannot bring it back.", "После стирания startup-config исчез; reload его не вернёт."],
  ], "Erasing NVRAM does not change RAM; the reload makes the device boot with the now-empty startup-config.", "Стирание NVRAM не меняет RAM; перезагрузка заставляет устройство стартовать с уже пустым startup-config."),

  qx("Which two commands display the two configuration files?", "show running-config and show startup-config", [
    ["copy running-config and copy startup-config", "copy transfers a file somewhere; it does not display its contents on the screen.", "copy переносит файл куда-то; его содержимое на экран она не выводит."],
    ["display running-config and display nvram", "display is not an IOS keyword; IOS uses show to view files and status.", "display — не ключевое слово IOS; для просмотра файлов и состояния IOS использует show."],
    ["list running-config and list startup-config", "list is not a valid IOS command for viewing configuration.", "list — недопустимая команда IOS для просмотра конфигурации."],
  ], "show running-config and show startup-config print the RAM and NVRAM configurations.", "show running-config и show startup-config выводят конфигурации из RAM и NVRAM."),

  qx("Which programs do the notes name for capturing the configuration to a text file?", "PuTTY or Tera Term", [
    ["Packet Tracer or Wireshark", "Packet Tracer is a simulator and Wireshark a packet analyzer; neither is a terminal with logging.", "Packet Tracer — симулятор, Wireshark — анализатор пакетов; ни один не терминал с записью журнала."],
    ["Notepad or Word", "Text editors can open the saved file later, but they cannot connect to the switch and log the session.", "Текстовые редакторы откроют сохранённый файл потом, но подключиться к коммутатору и записать сессию не могут."],
    ["Chrome or Firefox", "Web browsers do not talk to the console or SSH port of a switch.", "Браузеры не работают с консолью или SSH-портом коммутатора."],
  ], "PuTTY and Tera Term are terminal programs that can log the session to a file.", "PuTTY и Tera Term — терминальные программы, умеющие записывать сессию в файл."),

  qx("Which is the correct order of steps to capture the configuration to a text file?", "Enable logging, run show running-config, disable logging", [
    ["Run show running-config, enable logging, disable logging", "If logging is enabled after the show command, the output has already scrolled by and is not captured.", "Если включить запись после show, вывод уже прошёл и в файл не попал."],
    ["Disable logging, run show running-config, enable logging", "Logging must be on while the output appears; turning it off first captures nothing.", "Запись должна быть включена, пока идёт вывод; выключив её сначала, не захватишь ничего."],
    ["Enable logging, reload, run show startup-config", "A reload is not part of the procedure and would take the device offline for no reason.", "Перезагрузка не входит в процедуру и зря выведет устройство из сети."],
  ], "Turn logging on and pick a file, run the show command so its text goes to the file, then turn logging off.", "Включи запись и выбери файл, выполни show, чтобы текст попал в файл, затем выключи запись."),

  tfx("A captured configuration text file can always be pasted back into a device without any editing.", false,
    "The notes say the file is a record of the configuration and may need editing before it is used to restore a device.", "В конспекте сказано: файл — запись конфигурации, и перед восстановлением устройства его может понадобиться отредактировать.",
    "Treating the capture as a ready-to-use script ignores the warning that it may need editing first.", "Считать захваченный текст готовым скриптом — значит игнорировать предупреждение, что его может понадобиться править."),

  qx("A switch lost power after being configured and everything was gone. Why?", "The settings existed only as running-config in volatile RAM", [
    ["The NVRAM is wiped clean every time the power supply is interrupted", "NVRAM is non-volatile and keeps the startup-config through a power-off; that is its whole purpose.", "NVRAM энергонезависима и сохраняет startup-config при выключении; в этом её смысл."],
    ["The hostname command never persists", "A hostname is saved like any other command once copy running-config startup-config is run.", "Имя сохраняется как любая команда, стоит выполнить copy running-config startup-config."],
    ["Switches cannot store passwords at all", "Passwords are part of the configuration and are kept in NVRAM once the config is saved.", "Пароли — часть конфигурации и хранятся в NVRAM после сохранения."],
  ], "The admin forgot copy running-config startup-config, so the configuration was never written to NVRAM.", "Админ забыл copy running-config startup-config, и конфигурация так и не попала в NVRAM."),
];
