import { qx, tfx, type Draft } from "../../types";

/** Лекция 1, часть 3 — Cisco IOS: доступ, режимы и структура команд. Разбор «до косточек». */
export const deepL1P3: Draft[] = [
  qx("Which part of an operating system is the user interface through which you request tasks?", "Shell", [
    ["Kernel", "The kernel communicates between hardware and software; it is not what the user talks to.", "Ядро связывает железо и программы; пользователь напрямую с ним не общается."],
    ["Hardware", "Hardware is the physical part of the device, including the electronics.", "Аппаратная часть — физическая часть устройства, включая электронику."],
    ["Console", "The console is a physical management port for accessing the device, not a part of the OS.", "Консоль — физический порт управления для доступа к устройству, а не часть ОС."],
  ], "The shell is the user interface, accessed through a CLI or a GUI, that lets the user request specific tasks.", "Оболочка — интерфейс пользователя (CLI или GUI), через который отдаются команды."),

  qx("Which OS component communicates between hardware and software and manages how hardware resources are used?", "Kernel", [
    ["Shell", "The shell is the user interface (CLI or GUI), not the resource manager.", "Оболочка — интерфейс пользователя (CLI или GUI), а не управляющий ресурсами компонент."],
    ["GUI", "A GUI is just one form of shell; it does not manage hardware resources.", "GUI — лишь одна из форм оболочки; аппаратными ресурсами он не управляет."],
    ["Firmware", "Firmware is not one of the three OS parts the lecture lists (shell, kernel, hardware).", "Прошивка не входит в три части ОС, названные в лекции (оболочка, ядро, аппаратная часть)."],
  ], "The kernel communicates between the hardware and software and manages how hardware resources are used.", "Ядро связывает железо и программы и распределяет аппаратные ресурсы."),

  qx("In the lecture's three-part model of an operating system, what is the 'hardware'?", "The physical part, including the electronics", [
    ["The command-line interface program", "The CLI is a form of shell, not the hardware.", "CLI — форма оболочки, а не аппаратная часть."],
    ["The software managing resources", "Managing resources is the kernel's job.", "Распределение ресурсов — работа ядра."],
    ["The terminal emulator program running on the PC", "PuTTY or Tera Term run on the admin's PC; they are not part of the device's OS model.", "PuTTY или Tera Term работают на ПК администратора; в модель ОС устройства они не входят."],
  ], "The three parts are shell, kernel and hardware; hardware is the physical part of the device including the electronics.", "Три части — оболочка, ядро и аппаратная часть; аппаратная часть — физическая часть устройства, включая электронику."),

  qx("Why are network devices usually managed through the CLI rather than a GUI?", "A GUI can fail or crash", [
    ["A CLI is friendlier for beginners", "The lecture calls the GUI friendlier; the CLI is preferred for reliability, not ease.", "В лекции GUI назван удобнее; CLI предпочитают за надёжность, а не за простоту."],
    ["A GUI cannot show command output", "A GUI can display output; the issue is that it may fail or crash.", "GUI может показывать вывод; проблема в том, что он может зависнуть или упасть."],
    ["A CLI does not need a kernel", "Every OS has a kernel regardless of CLI or GUI shell.", "Ядро есть в любой ОС независимо от оболочки — CLI или GUI."],
  ], "A GUI is friendlier but may fail or crash, so network devices are usually managed via the CLI.", "GUI удобнее, но может зависнуть или упасть, поэтому сетевыми устройствами обычно управляют через CLI."),

  qx("Which list contains only GUI-based operating systems named in the lecture?", "Windows, macOS, Linux KDE, Apple iOS, Android", [
    ["Cisco IOS, Windows, macOS, Apple iOS, Android", "Cisco IOS is the CLI-based network operating system, not a GUI example.", "Cisco IOS — сетевая ОС с CLI, а не пример GUI."],
    ["PuTTY, Tera Term, SecureCRT, Windows", "PuTTY, Tera Term and SecureCRT are terminal emulation programs, not operating systems.", "PuTTY, Tera Term и SecureCRT — эмуляторы терминала, а не операционные системы."],
    ["Windows, Linux KDE, SSH, Telnet", "SSH and Telnet are access methods, not operating systems.", "SSH и Telnet — способы доступа, а не операционные системы."],
  ], "The lecture lists Windows, macOS, Linux KDE, Apple iOS and Android as GUI systems.", "В лекции как системы с GUI перечислены Windows, macOS, Linux KDE, Apple iOS и Android."),

  qx("How does a technician interact with a CLI-based network operating system?", "Text commands from the keyboard, output on a monitor", [
    ["Mouse clicks on icons and menus", "Mouse-driven interaction describes a PC GUI operating system.", "Работа мышью по значкам и меню — это GUI на ПК."],
    ["Voice commands through a headset", "Voice control is not an access method for Cisco IOS.", "Голосовое управление — не способ доступа к Cisco IOS."],
    ["Touch gestures on the device's own built-in touchscreen", "Switches have no touchscreen; the technician types commands.", "У коммутаторов нет сенсорного экрана; техник вводит команды."],
  ], "A CLI-based network OS lets the technician enter text-based commands from the keyboard and see the output on a monitor.", "Сетевая ОС с CLI позволяет технику вводить текстовые команды с клавиатуры и видеть вывод на мониторе."),

  qx("Which access method uses a physical management port and is used for the initial configuration?", "Console", [
    ["SSH", "SSH is a remote connection over the network; it needs an IP configuration that a new device does not yet have.", "SSH — удалённое подключение по сети; ему нужна IP-настройка, которой у нового устройства ещё нет."],
    ["Telnet", "Telnet is also network-based and insecure; it cannot be used before the device has network settings.", "Telnet тоже работает по сети и небезопасен; до настройки сети им не воспользоваться."],
    ["AUX", "AUX is a line type mentioned for line configuration, not the method named for initial setup.", "AUX — тип линии, упомянутый в режиме конфигурации линии, а не способ первоначальной настройки."],
  ], "The console is a physical management port used for maintenance and the initial configuration.", "Консоль — физический порт управления для обслуживания и первоначальной настройки."),

  qx("Which remote access method does the lecture recommend?", "SSH", [
    ["Telnet", "Telnet sends authentication, passwords and commands in plaintext, so it is the insecure option.", "Telnet передаёт логин, пароли и команды открытым текстом — это небезопасный вариант."],
    ["Console", "The console requires physical access to the device; it is not a remote method.", "Консоль требует физического доступа к устройству; это не удалённый способ."],
    ["Dial-up", "Dial-up is an internet connection type from part 1, not a device access method.", "Dial-up — тип подключения к интернету из первой части, а не способ доступа к устройству."],
  ], "SSH provides a secure, encrypted remote CLI connection and is the recommended remote method.", "SSH даёт защищённое шифрованное удалённое подключение к CLI и является рекомендуемым способом."),

  qx("An admin connects remotely and the username, password and every command cross the network in plaintext. Which method is in use?", "Telnet", [
    ["SSH", "SSH encrypts the session, so nothing travels in plaintext.", "SSH шифрует сеанс, открытым текстом ничего не идёт."],
    ["Console", "The console cable does not cross the network at all.", "Консольный кабель вообще не проходит через сеть."],
    ["PuTTY", "PuTTY is a terminal emulator that can open SSH, Telnet or console sessions; it is not itself the protocol.", "PuTTY — эмулятор терминала, открывающий SSH, Telnet или консоль; сам по себе он не протокол."],
  ], "Telnet is insecure: authentication, passwords and commands are sent in plaintext.", "Telnet небезопасен: логин, пароли и команды передаются открытым текстом."),

  qx("Which programs are named as terminal emulators for connecting to a switch?", "PuTTY, Tera Term, SecureCRT", [
    ["Windows, macOS, Android", "These are GUI operating systems, not terminal programs.", "Это операционные системы с GUI, а не терминальные программы."],
    ["Webex, TelePresence, Webex Teams", "These are collaboration and video tools from part 2.", "Это инструменты совместной работы и видео из второй части."],
    ["SSH, Telnet, Console", "These are access methods; a terminal emulator is the program that uses them.", "Это способы доступа; эмулятор терминала — программа, которая ими пользуется."],
  ], "PuTTY, Tera Term and SecureCRT are terminal emulation programs.", "PuTTY, Tera Term и SecureCRT — программы-эмуляторы терминала."),

  qx("In the access-method table, why is the console considered secure?", "It requires physical access to the device", [
    ["It encrypts all traffic crossing the network", "Encryption over the network is the SSH property; the console does not use the network.", "Шифрование по сети — свойство SSH; консоль сетью не пользуется."],
    ["It uses a password by default", "A console password must be configured; by default none is set.", "Пароль на консоль нужно настроить; по умолчанию его нет."],
    ["It is a legacy method nobody uses", "Legacy and 'avoid' describe Telnet; the console is still used for initial setup.", "«Устаревший, избегать» — это про Telnet; консоль по-прежнему нужна для первоначальной настройки."],
  ], "The console is secure because only someone with physical access to the device can use it.", "Консоль защищена тем, что воспользоваться ею может лишь тот, у кого есть физический доступ к устройству."),

  qx("How does the table describe Telnet in the 'When' column?", "Legacy; avoid", [
    ["Initial configuration, maintenance", "That is the 'When' entry for the console.", "Это запись «когда» для консоли."],
    ["Everyday remote management", "That is the entry for SSH.", "Это запись для SSH."],
    ["Only inside a data center", "The table does not restrict Telnet to a location; it simply says to avoid it.", "Таблица не ограничивает Telnet местом; она просто говорит его избегать."],
  ], "Telnet is marked as not secure (plaintext) and listed as legacy to be avoided.", "Telnet помечен как незащищённый (открытый текст) и указан как устаревший, которого следует избегать."),

  qx("Which command mode offers only limited basic monitoring commands?", "User EXEC", [
    ["Privileged EXEC", "Privileged EXEC gives access to all commands.", "Привилегированный EXEC даёт доступ ко всем командам."],
    ["Global configuration", "Global configuration is for changing device-wide settings, not basic monitoring.", "Глобальная конфигурация — для изменения настроек всего устройства, а не для наблюдения."],
    ["Line configuration", "Line configuration sets up console, SSH, Telnet or AUX access.", "Конфигурация линии настраивает доступ через консоль, SSH, Telnet или AUX."],
  ], "User EXEC mode has limited basic monitoring commands and its prompt ends with >.", "Пользовательский EXEC имеет ограниченный набор команд наблюдения, его приглашение кончается на >."),

  qx("Which prompt shows that you are in privileged EXEC mode?", "Switch#", [
    ["Switch>", "The > prompt is user EXEC mode with only basic monitoring commands.", "Приглашение > — пользовательский EXEC только с базовыми командами наблюдения."],
    ["Switch(config)#", "(config)# is global configuration mode, one level deeper than privileged EXEC.", "(config)# — режим глобальной конфигурации, на уровень глубже привилегированного EXEC."],
    ["Switch(config-line)#", "(config-line)# is line configuration mode for console, SSH, Telnet or AUX access.", "(config-line)# — режим настройки линии: консоль, SSH, Telnet или AUX."],
  ], "Privileged EXEC mode, with access to all commands, is identified by a prompt ending in #.", "Привилегированный EXEC с доступом ко всем командам узнаётся по приглашению, кончающемуся на #."),

  qx("Which mode lets you change configuration options that affect the whole device?", "Global configuration", [
    ["User EXEC", "User EXEC only allows basic monitoring commands.", "Пользовательский EXEC допускает лишь базовые команды наблюдения."],
    ["Line configuration", "Line configuration affects only console, SSH, Telnet or AUX access lines.", "Конфигурация линии затрагивает только линии доступа: консоль, SSH, Telnet или AUX."],
    ["Interface configuration", "Interface configuration affects a single switch port or router interface.", "Конфигурация интерфейса затрагивает один порт коммутатора или интерфейс маршрутизатора."],
  ], "Global configuration mode, prompt (config)#, holds configuration options for the whole device.", "Режим глобальной конфигурации с приглашением (config)# содержит настройки всего устройства."),

  qx("Which prompt appears after you type 'line console 0' in global configuration mode?", "Switch(config-line)#", [
    ["Switch(config-if)#", "(config-if)# appears after an interface command such as interface vlan 1.", "(config-if)# появляется после команды interface, например interface vlan 1."],
    ["Switch(config)#", "(config)# is where you typed the command; line console 0 moves you one level deeper.", "(config)# — то, где ты ввёл команду; line console 0 переводит на уровень глубже."],
    ["Switch#", "Switch# is privileged EXEC, which you left when entering configure terminal.", "Switch# — привилегированный EXEC, из которого ты вышел командой configure terminal."],
  ], "Line configuration mode (console, SSH, Telnet or AUX access) uses the prompt (config-line)#.", "Режим конфигурации линии (консоль, SSH, Telnet или AUX) использует приглашение (config-line)#."),

  qx("Which access types are configured in line configuration mode?", "Console, SSH, Telnet or AUX", [
    ["Switch ports and router interfaces", "Ports and interfaces are configured in interface configuration mode, (config-if)#.", "Порты и интерфейсы настраиваются в режиме конфигурации интерфейса, (config-if)#."],
    ["Hostname and device-wide settings", "Device-wide settings such as hostname belong to global configuration mode.", "Настройки всего устройства, например hostname, относятся к глобальной конфигурации."],
    ["Cable, DSL and satellite links", "These are internet connection types, not IOS lines.", "Это типы подключения к интернету, а не линии IOS."],
  ], "Line configuration mode configures console, SSH, Telnet or AUX access; its prompt is (config-line)#.", "Режим конфигурации линии настраивает доступ через консоль, SSH, Telnet или AUX; приглашение — (config-line)#."),

  qx("An admin sees Switch(config-if)#. What is being configured?", "A switch port or router interface", [
    ["A console or VTY line", "Lines are configured under the (config-line)# prompt.", "Линии настраиваются под приглашением (config-line)#."],
    ["The whole device", "Device-wide settings are made at the (config)# prompt.", "Настройки всего устройства делаются при приглашении (config)#."],
    ["A terminal emulator session on the PC", "Terminal emulator settings live on the PC, not in any IOS mode.", "Настройки эмулятора терминала живут на ПК, а не в режимах IOS."],
  ], "Interface configuration mode, prompt (config-if)#, configures a switch port or router interface.", "Режим конфигурации интерфейса с приглашением (config-if)# настраивает порт коммутатора или интерфейс маршрутизатора."),

  qx("Which command moves you from user EXEC to privileged EXEC?", "enable", [
    ["configure terminal", "configure terminal goes from privileged EXEC into global configuration, one step later.", "configure terminal переводит из привилегированного EXEC в глобальную конфигурацию — это следующий шаг."],
    ["end", "end returns to privileged EXEC from a configuration mode; it is not used from user EXEC.", "end возвращает в привилегированный EXEC из режима конфигурации; из пользовательского EXEC он не используется."],
    ["exit", "exit moves one level back or, at user EXEC, ends the session.", "exit возвращает на уровень назад, а в пользовательском EXEC завершает сеанс."],
  ], "enable moves from user EXEC (>) to privileged EXEC (#).", "enable переводит из пользовательского EXEC (>) в привилегированный (#)."),

  qx("Which command moves you from privileged EXEC into global configuration mode?", "configure terminal", [
    ["enable", "enable goes from user EXEC to privileged EXEC, one step earlier.", "enable переводит из пользовательского EXEC в привилегированный — это шаг раньше."],
    ["line console 0", "line console 0 is typed inside global configuration to enter line configuration mode.", "line console 0 вводится уже в глобальной конфигурации для входа в режим линии."],
    ["interface vlan 1", "interface vlan 1 enters interface configuration mode from global configuration.", "interface vlan 1 входит в режим интерфейса из глобальной конфигурации."],
  ], "configure terminal takes you from Switch# to Switch(config)#.", "configure terminal переводит из Switch# в Switch(config)#."),

  qx("Which command sequence correctly goes from user EXEC to interface configuration mode?", "enable, configure terminal, interface vlan 1", [
    ["configure terminal, enable, interface vlan 1", "configure terminal is not available in user EXEC; enable must come first.", "configure terminal недоступна в пользовательском EXEC; сначала нужен enable."],
    ["enable, interface vlan 1, configure terminal", "interface commands are entered in global configuration, so configure terminal must come before interface vlan 1.", "Команды interface вводятся в глобальной конфигурации, поэтому configure terminal должен идти до interface vlan 1."],
    ["enable, line console 0, interface vlan 1", "line console 0 leads to line configuration, and skips the required configure terminal step.", "line console 0 ведёт в режим линии и пропускает обязательный шаг configure terminal."],
  ], "The path is Switch> enable → Switch# configure terminal → Switch(config)# interface vlan 1 → Switch(config-if)#.", "Путь: Switch> enable → Switch# configure terminal → Switch(config)# interface vlan 1 → Switch(config-if)#."),

  qx("You are at Switch(config-line)# and type exit. Which prompt do you see next?", "Switch(config)#", [
    ["Switch#", "exit goes only one level back; reaching Switch# in one step needs end or Ctrl+Z.", "exit возвращает лишь на уровень назад; попасть в Switch# за один шаг можно командой end или Ctrl+Z."],
    ["Switch>", "User EXEC is two levels above global configuration; exit cannot jump there from line mode.", "Пользовательский EXEC на два уровня выше глобальной конфигурации; exit туда из режима линии не прыгнет."],
    ["Switch(config-if)#", "Interface mode is a sibling of line mode, reached via an interface command, not via exit.", "Режим интерфейса — соседний с режимом линии; в него попадают командой interface, а не exit."],
  ], "exit moves one level back, from line configuration to global configuration.", "exit возвращает на один уровень назад — из режима линии в глобальную конфигурацию."),

  qx("You see Switch(config-if)# and want Switch# in a single step. Which command?", "end", [
    ["exit", "exit only goes one level up, to Switch(config)#.", "exit поднимает лишь на один уровень, в Switch(config)#."],
    ["enable", "enable is used from user EXEC to reach privileged EXEC; it does not leave configuration mode.", "enable используется из пользовательского EXEC для входа в привилегированный; из конфигурации он не выводит."],
    ["disable", "disable drops privileges from # to >; it does not apply inside configuration mode.", "disable понижает уровень с # до >; внутри режима конфигурации не применяется."],
  ], "end (or Ctrl+Z) returns straight to privileged EXEC from any configuration mode.", "end (или Ctrl+Z) возвращает сразу в привилегированный EXEC из любого режима конфигурации."),

  qx("Which keystroke is equivalent to the 'end' command?", "Ctrl+Z", [
    ["Ctrl+P", "Ctrl+P recalls the previous command, like the Up Arrow.", "Ctrl+P вызывает предыдущую команду, как стрелка вверх."],
    ["Ctrl+Shift+6", "Ctrl+Shift+6 is the break sequence that aborts pings, traceroutes and DNS lookups.", "Ctrl+Shift+6 — прерывание, останавливающее ping, traceroute и DNS-поиск."],
    ["Tab", "Tab completes a partially typed command.", "Tab дописывает частично введённую команду."],
  ], "end or Ctrl+Z (and also Ctrl+C) leave configuration mode and return to privileged EXEC.", "end или Ctrl+Z (а также Ctrl+C) выводят из режима конфигурации в привилегированный EXEC."),

  qx("In the command 'ping 10.10.10.5', what is the IP address?", "An argument", [
    ["A keyword", "Keywords are predefined by the OS; 10.10.10.5 is a value the user supplies.", "Ключевые слова заданы в ОС; 10.10.10.5 — значение, которое вводит пользователь."],
    ["A hot key", "Hot keys are keystrokes such as Tab or Ctrl+Z, not parts of a command.", "Горячие клавиши — это нажатия вроде Tab или Ctrl+Z, а не части команды."],
    ["A prompt", "A prompt is what the device displays (Switch#), not something you type after a command.", "Приглашение — то, что показывает устройство (Switch#), а не то, что вводится после команды."],
  ], "An argument is a value supplied by the user; in ping 10.10.10.5 the argument is the IP address.", "Аргумент — значение, которое вводит пользователь; в ping 10.10.10.5 аргумент — IP-адрес."),

  qx("What is a keyword in an IOS command?", "A parameter predefined by the operating system", [
    ["A value the user supplies", "A user-supplied value is an argument.", "Значение, подставляемое пользователем, — это аргумент."],
    ["The prompt shown before the command", "The prompt indicates the mode; it is not part of the command.", "Приглашение показывает режим; частью команды оно не является."],
    ["An optional element written in square brackets", "Square brackets are a syntax convention; optional elements may be keywords or arguments.", "Квадратные скобки — обозначение синтаксиса; необязательным элементом может быть и ключевое слово, и аргумент."],
  ], "A command is followed by keywords (predefined by the OS) and arguments (values you supply).", "За командой идут ключевые слова (заданные в ОС) и аргументы (значения, которые вводишь ты)."),

  qx("In Cisco syntax documentation, what does boldface text mean?", "Type it exactly as shown", [
    ["Supply your own value", "A value you supply is shown in italics.", "Значение, которое подставляешь ты, пишется курсивом."],
    ["The element is optional", "Optional elements are enclosed in square brackets [x].", "Необязательные элементы заключаются в квадратные скобки [x]."],
    ["The element is required", "Required elements are enclosed in braces {x}.", "Обязательные элементы заключаются в фигурные скобки {x}."],
  ], "Boldface marks commands and keywords typed as shown; italics mark values you supply.", "Жирным выделяют команды и ключевые слова, вводимые как написано; курсивом — значения, которые подставляешь ты."),

  qx("Which syntax notation marks a required element?", "{x}", [
    ["[x]", "Square brackets mark an optional element.", "Квадратные скобки обозначают необязательный элемент."],
    ["italic x", "Italics mark a value the user supplies, not whether it is required.", "Курсив обозначает значение, которое вводит пользователь, а не его обязательность."],
    ["bold x", "Boldface means type the text exactly as shown.", "Жирный шрифт означает «вводить как написано»."],
  ], "Braces {x} mark a required element; square brackets [x] mark an optional one.", "Фигурные скобки {x} — обязательный элемент; квадратные [x] — необязательный."),

  qx("Which key provides context-sensitive help with available commands and keywords?", "?", [
    ["Tab", "Tab completes a partial command; it does not list options.", "Tab дописывает команду, а варианты не перечисляет."],
    ["Ctrl+P", "Ctrl+P recalls the previous command from history.", "Ctrl+P вызывает предыдущую команду из истории."],
    ["Space", "At the --More-- prompt Space shows the next screen; it is not help.", "На приглашении --More-- пробел показывает следующий экран; это не справка."],
  ], "The ? key gives context-sensitive help listing available commands and keywords.", "Клавиша ? даёт контекстную справку со списком доступных команд и ключевых слов."),

  qx("Which IOS feature tells you what is wrong with a command you typed?", "Command syntax check", [
    ["Context-sensitive help", "Context-sensitive help (?) lists what is available; it does not evaluate a typed command.", "Контекстная справка (?) показывает, что доступно, а введённую команду не оценивает."],
    ["Command completion", "Tab completion finishes a partial word; it does not report errors.", "Автодополнение по Tab заканчивает слово, об ошибках не сообщает."],
    ["Command history", "History (Up Arrow / Ctrl+P) recalls past commands; it does not check them.", "История (стрелка вверх / Ctrl+P) вызывает прошлые команды, но не проверяет их."],
  ], "The command syntax check tells you what is wrong with a command.", "Проверка синтаксиса сообщает, что не так с командой."),

  qx("Which two keystrokes recall the previous command?", "Up Arrow or Ctrl+P", [
    ["Down Arrow or Ctrl+N", "The lecture lists Up Arrow / Ctrl+P for recalling previous commands.", "В лекции для вызова прошлых команд указаны стрелка вверх / Ctrl+P."],
    ["Left Arrow or Ctrl+B", "Left Arrow / Ctrl+B move the cursor one character left.", "Стрелка влево / Ctrl+B сдвигают курсор на символ влево."],
    ["Right Arrow or Ctrl+F", "Right Arrow / Ctrl+F move the cursor one character right.", "Стрелка вправо / Ctrl+F сдвигают курсор на символ вправо."],
  ], "Up Arrow or Ctrl+P recalls previous commands.", "Стрелка вверх или Ctrl+P вызывают прошлые команды."),

  qx("Which keystroke moves the cursor one character to the left?", "Ctrl+B", [
    ["Ctrl+F", "Ctrl+F moves the cursor one character to the right.", "Ctrl+F сдвигает курсор на символ вправо."],
    ["Backspace", "Backspace erases the character to the left instead of just moving.", "Backspace стирает символ слева, а не просто сдвигает курсор."],
    ["Ctrl+P", "Ctrl+P recalls the previous command.", "Ctrl+P вызывает предыдущую команду."],
  ], "Left Arrow or Ctrl+B moves the cursor one character left; Right Arrow or Ctrl+F moves it right.", "Стрелка влево или Ctrl+B сдвигают курсор на символ влево; стрелка вправо или Ctrl+F — вправо."),

  qx("A ping to a wrong address hangs. Which keystroke aborts it?", "Ctrl+Shift+6", [
    ["Ctrl+Z", "Ctrl+Z leaves configuration mode; it does not interrupt a running ping.", "Ctrl+Z выходит из режима конфигурации, а запущенный ping не прерывает."],
    ["Ctrl+P", "Ctrl+P recalls the previous command.", "Ctrl+P вызывает предыдущую команду."],
    ["Backspace", "Backspace only erases a character on the command line.", "Backspace лишь стирает символ в командной строке."],
  ], "Ctrl+Shift+6 is the all-purpose break that aborts DNS lookups, traceroutes and pings.", "Ctrl+Shift+6 — универсальное прерывание: останавливает DNS-поиск, traceroute и ping."),

  qx("At the --More-- prompt, which key shows the next screen of output?", "Space", [
    ["Enter", "Enter shows only the next single line.", "Enter показывает только следующую строку."],
    ["Tab", "Tab is not listed for --More--; any key other than Enter and Space ends the display.", "Tab для --More-- не предусмотрен; любая клавиша, кроме Enter и пробела, прекращает вывод."],
    ["Ctrl+P", "Ctrl+P is for command history, not for paging output.", "Ctrl+P — для истории команд, а не для листания вывода."],
  ], "At --More--, Enter shows the next line, Space the next screen, and any other key ends the display.", "На --More-- Enter показывает следующую строку, пробел — следующий экран, любая другая клавиша прекращает вывод."),

  qx("What happens if you press a key other than Enter or Space at the --More-- prompt?", "The display ends and you return to privileged EXEC", [
    ["The next line of output is shown", "Showing the next line is what Enter does.", "Следующую строку показывает Enter."],
    ["The next screen of output is shown", "Showing the next screen is what Space does.", "Следующий экран показывает пробел."],
    ["The whole command is executed again from the start", "No key at --More-- re-runs the command; the output simply stops.", "Ни одна клавиша на --More-- не перезапускает команду; вывод просто останавливается."],
  ], "Any other key at --More-- ends the display and returns to privileged EXEC.", "Любая другая клавиша на --More-- прекращает вывод и возвращает в привилегированный EXEC."),

  qx("An admin types 'conf' and IOS accepts it. Why does this work?", "Commands may be shortened to their fewest unique characters", [
    ["conf is a separate command from configure", "conf is not a distinct command; it is an abbreviation of configure.", "conf — не отдельная команда, а сокращение от configure."],
    ["Tab completion was triggered automatically", "Tab must be pressed to complete; IOS simply accepts unambiguous abbreviations.", "Для дополнения нужно нажать Tab; IOS просто принимает однозначные сокращения."],
    ["IOS silently ignores every character after the first letter", "One letter would be ambiguous; enough characters must be typed to be unique.", "Одной буквы было бы недостаточно; нужно ввести столько символов, чтобы команда была однозначной."],
  ], "Commands and keywords can be shortened to the minimum number of characters that identify them uniquely, such as conf for configure.", "Команды и ключевые слова можно сокращать до минимума уникальных символов, например conf вместо configure."),

  tfx("The hostname command can be entered directly at the Switch# prompt.", false,
    "hostname works only in global configuration mode, so you must pass through enable and configure terminal first.",
    "hostname работает только в режиме глобальной конфигурации, поэтому сначала нужны enable и configure terminal.",
    "Answering True confuses privileged EXEC with global configuration; Switch# accepts show and copy commands, not device-wide configuration.",
    "Ответ «верно» путает привилегированный EXEC с глобальной конфигурацией; Switch# принимает show и copy, а не настройку устройства."),

  tfx("Ctrl+C, like Ctrl+Z, leaves configuration mode and returns to privileged EXEC.", true,
    "The hot-key list says Ctrl+C or Ctrl+Z leaves configuration mode and returns to privileged EXEC.",
    "В списке горячих клавиш сказано: Ctrl+C или Ctrl+Z выходят из режима конфигурации в привилегированный EXEC.",
    "Answering False would mean only Ctrl+Z works; the notes list both keystrokes for leaving configuration mode.",
    "Ответ «неверно» означал бы, что работает только Ctrl+Z; в конспекте для выхода из конфигурации названы обе комбинации."),
];
