import type { Story } from "./types";

/*
 * «Последний спринт Сары» — история к лекции 7 Project Management (Scrum
 * framework по Scrum Guide 2020). Четвёртая часть QuickBite. Пользователь
 * попросил трагедию со смертью и «более человечные реплики, грубость»:
 * наставница Сара тяжело больна, становится Scrum Master команды на её
 * последнюю цель и учит Scrum так, чтобы стать ненужной. В последний день
 * спринта её не стало (смерть — за кадром: пустой стул, маркер, письмо).
 *
 * Всё содержание лекции — на карточках: определение и теория Scrum, три
 * опоры и пять ценностей, Scrum Team и три accountabilities (Developers,
 * Product Owner, Scrum Master и кому он служит), события с таймбоксами
 * (Sprint, Planning с тремя вопросами, Daily Scrum, Review, Retrospective,
 * отмена спринта только Product Owner), артефакты и их обязательства
 * (Product Goal, Sprint Goal, Definition of Done). Формулировки сверены со
 * слайдами лекции 7. Термины — по-английски, пояснения — по-русски.
 */
export const pmLecture7Story: Story = {
  id: "pm-l7-saras-last-sprint",
  title: "Последний спринт Сары",
  subtitle: "Сара больна и знает, что времени мало. Её последний спринт — научить команду Scrum так, чтобы она стала не нужна.",
  lecture: { eventId: "project-management-test-2", lectureId: "pm-l7", label: "Project Management · Лекция 7 — Scrum framework" },
  cover: "s06_c",
  // Голоса: voice — Gemini (прежняя озвучка), eleven — ElevenLabs (русская библиотека голосов).
  cast: {
    narrator: { name: "Рассказчик", voice: "Charon", eleven: "ogi2DyUAKJb7CEdqqvlU" },
    sara: { name: "Профессор Сара", role: "Scrum Master", voice: "Gacrux", eleven: "ymDCYd8puC7gYjxIamPt" },
    ayat: { name: "Аян", role: "Product Owner", voice: "Puck", eleven: "gJEfHTTiifXEDmO687lC" },
    mira: { name: "Мира", role: "Developer", voice: "Leda", eleven: "AB9XsbSA4eLG12t2myjN" },
    arman: { name: "Арман", role: "Developer", voice: "Iapetus", eleven: "rQOBu7YxCDxGiFdTm28w" },
    aliya: { name: "Алия", role: "Developer", voice: "Aoede", eleven: "dVRDrbP5ULGXB94se4KZ" },
    gulnara: { name: "Гульнара", role: "Stakeholder · Shymkent cafe", voice: "Sulafat", eleven: "5dORE7Khzn5FlSDUvuHn" },
  },
  scenes: [
    {
      id: "s01",
      title: "Новость",
      mood: "tension",
      ambience: "quiet modern office in the evening, distant city traffic behind glass, soft air conditioning hum, no voices",
      lines: [
        { who: "narrator", frame: "s01_a", text: "Полгода спустя. QuickBite выжил — маленький и упрямый. Вечер пятницы, все уже собираются домой, но Сара просит остаться." },
        { who: "arman", frame: "s01_b", say: "[joking]", text: "Если это опять лекция про манифест — я пас. У меня пятница. У меня шашлык." },
        { who: "sara", frame: "s01_c", say: "[calmly, gently]", text: "Не лекция. Буду честной — это и есть openness. Я тяжело больна. Врачи дают несколько месяцев." },
        { who: "mira", frame: "s01_d", say: "[shocked, voice trembling]", text: "Что?.. Нет. Нет-нет-нет. Почему вы молчали?!" },
        { who: "ayat", frame: "s01_e", say: "[hurt and angry]", text: "Вы год сидели с нами — и ни слова? Серьёзно?" },
        {
          who: "sara",
          frame: "s01_f",
          say: "[warmly, with a sad smile]",
          text: "Потому что хотела успеть главное. Дайте мне одну последнюю цель. Я буду вашим Scrum Master — и научу вас так, что больше вам не понадоблюсь.",
          terms: [
            { term: "Scrum", ru: "Лёгкий каркас (lightweight framework), который помогает людям и командам создавать ценность через адаптивные решения сложных задач. Scrum Master создаёт среду, где Product Owner упорядочивает работу в Product Backlog, команда за Sprint превращает часть работы в Increment, вместе со стейкхолдерами проверяет результат и подстраивается. И так по кругу." },
          ],
        },
      ],
    },
    {
      id: "s02",
      title: "Scrum на одной доске",
      mood: "smart",
      ambience: "bright open-plan startup office in the morning, soft keyboard typing, faint distant murmur, no clear voices",
      lines: [
        {
          who: "sara",
          frame: "s02_a",
          text: "Scrum нарочно неполный. Правил мало — остальное вы достраиваете сами, своими практиками.",
          terms: [
            { term: "Purposefully incomplete", ru: "Scrum определяет только то, что нужно для его теории. Детальных инструкций нет: правила направляют отношения и взаимодействие людей, а Scrum «обёртывает» их практики или делает лишние ненужными." },
          ],
        },
        { who: "aliya", frame: "s02_b", say: "[sarcastic]", text: "Я тут неделю, и это звучит как «разбирайтесь сами». Удобно." },
        {
          who: "sara",
          frame: "s02_c",
          say: "[amused]",
          text: "Почти так, Алия. Scrum стоит на эмпиризме и lean thinking: решаем по тому, что видим, и режем всё лишнее.",
          terms: [
            { term: "Empiricism", ru: "Знание берётся из опыта, решения — по тому, что наблюдаем." },
            { term: "Lean thinking", ru: "Сокращает потери и фокусируется на главном." },
            { term: "Iterative, incremental approach", ru: "Так Scrum повышает предсказуемость и управляет риском. В команде есть все нужные навыки, или она их добирает." },
          ],
        },
        {
          who: "sara",
          frame: "s02_d",
          text: "Три опоры. Без прозрачности проверка врёт. А проверка без адаптации — пустая трата времени.",
          terms: [
            { term: "Transparency", ru: "Процесс и работа видны и тем, кто делает, и тем, кто получает. Прозрачность делает возможной проверку; проверка без прозрачности вводит в заблуждение." },
            { term: "Inspection", ru: "Артефакты и прогресс к целям проверяют часто и тщательно; ритм задают пять событий. Проверка делает возможной адаптацию; без адаптации она бессмысленна." },
            { term: "Adaptation", ru: "Если процесс или продукт вышли за допустимые пределы — подстроиться как можно скорее. Труднее, когда люди не наделены полномочиями и не управляют собой сами." },
          ],
        },
        {
          who: "arman",
          frame: "s02_e",
          say: "[proudly]",
          text: "И пять ценностей. Commitment, focus, openness, respect, courage. Я выучил, не смотрите на меня так.",
          terms: [
            { term: "Scrum values", ru: "Commitment — обязательство перед целями и друг другом; Focus — фокус на работе спринта; Openness — открытость о работе и трудностях; Respect — уважение друг к другу как к способным людям; Courage — смелость делать правильное и браться за трудное." },
          ],
        },
        { who: "mira", frame: "s02_f", say: "[softly, tearful]", text: "Courage — это вы. Вчера вечером." },
      ],
    },
    {
      id: "s03",
      title: "Кто есть кто",
      mood: "strategy",
      ambience: "bright open-plan startup office, soft keyboard typing, a marker squeaking on a whiteboard now and then, no clear voices",
      lines: [
        {
          who: "sara",
          frame: "s03_a",
          text: "Scrum Team — один Scrum Master, один Product Owner и Developers. Ни подкоманд, ни начальников.",
          terms: [
            { term: "Scrum Team", ru: "Один Scrum Master, один Product Owner и Developers; без подкоманд и иерархий, одна цель за раз — Product Goal. Обычно 10 человек или меньше; слишком большая команда делится на несколько с общими Product Goal, Product Backlog и Product Owner." },
            { term: "Cross-functional", ru: "В команде есть все навыки, чтобы создавать ценность каждый спринт." },
            { term: "Self-managing", ru: "Команда сама решает, кто, что, когда и как делает." },
          ],
        },
        { who: "ayat", frame: "s03_b", say: "[half-joking, annoyed]", text: "То есть я больше не начальник? Шикарно. А кто отвечает, если всё рухнет?" },
        {
          who: "sara",
          frame: "s03_c",
          text: "Ты — Product Owner. Отвечаешь за ценность продукта и за бэклог. Один человек, не комитет.",
          terms: [
            { term: "Product Owner", ru: "Отвечает за максимальную ценность продукта и управление Product Backlog: формулирует и доносит Product Goal, создаёт и объясняет элементы бэклога, упорядочивает их, следит, чтобы бэклог был прозрачен и понятен. Один человек, не комитет; может делегировать, но отвечает всё равно он." },
          ],
        },
        {
          who: "ayat",
          frame: "s03_d",
          say: "[confidently]",
          text: "Ладно. Product Goal — QuickBite в каждом городе Казахстана. И порядок в бэклоге ставлю я, а не тот, кто громче орёт.",
          terms: [
            { term: "Product Goal", ru: "Будущее состояние продукта, долгосрочная цель команды. Сначала выполнить (или бросить) одну — потом браться за следующую." },
            { term: "Product Backlog", ru: "Растущий упорядоченный список того, что нужно продукту; единственный источник работы команды. Refinement — дробить и уточнять элементы; размер оценивают Developers." },
          ],
        },
        { who: "arman", frame: "s03_e", say: "[mock-offended]", text: "Это ты сейчас про меня? Я не ору. Я аргументированно повышаю голос." },
        {
          who: "sara",
          frame: "s03_f",
          text: "Мира, Арман, Алия — вы Developers. А я — Scrum Master. Служу вам, Аяну и всей компании.",
          terms: [
            { term: "Developers", ru: "Создают Increment каждый спринт. Отвечают за: план спринта (Sprint Backlog), качество по Definition of Done, ежедневную подстройку плана к Sprint Goal и взаимную ответственность как профессионалов." },
            { term: "Scrum Master", ru: "Отвечает за то, чтобы Scrum работал как в Scrum Guide, и за эффективность команды. True leader who serves — лидер, который служит команде и организации." },
            { term: "Serves the team, PO and organization", ru: "Команде — учит самоуправлению и кросс-функциональности, убирает препятствия, следит, чтобы события шли и укладывались в таймбокс. Product Owner — помогает с Product Goal и бэклогом. Организации — обучает Scrum и убирает барьеры между стейкхолдерами и командами." },
          ],
        },
      ],
    },
    {
      id: "s04",
      title: "Сердце Scrum",
      mood: "hope",
      ambience: "calm office meeting room, sticky notes and pens on a table, soft ventilation hum, no voices",
      lines: [
        {
          who: "narrator",
          frame: "s04_a",
          text: "Первый спринт — две недели. Новый начинается сразу, как закончился предыдущий.",
          terms: [
            { term: "Sprint", ru: "Сердцебиение Scrum: событие фиксированной длины, месяц или меньше; контейнер для всех остальных событий. Следующий спринт начинается сразу после предыдущего. Каждый спринт — как короткий проект." },
          ],
        },
        {
          who: "sara",
          frame: "s04_b",
          text: "Sprint Planning — три вопроса: зачем этот спринт, что успеем сделать и как.",
          terms: [
            { term: "Sprint Planning", ru: "Открывает спринт. Topic 1: почему спринт ценен → Sprint Goal. Topic 2: что можно сделать (Done) за спринт. Topic 3: как — работу дробят на куски по дню или меньше. Таймбокс — до 8 часов для месячного спринта." },
          ],
        },
        {
          who: "ayat",
          frame: "s04_c",
          text: "Зачем — чтобы в Шымкенте заказывали еду за три нажатия. Вот наша Sprint Goal.",
          terms: [
            { term: "Sprint Goal", ru: "Единственная цель спринта. Обязательство Developers, но с гибкостью в том, какой именно работой её достичь." },
            { term: "Sprint Backlog", ru: "Sprint Goal (зачем) + выбранные элементы Product Backlog (что) + план их сделать (как). План Developers и для Developers, обновляется весь спринт." },
          ],
        },
        { who: "aliya", frame: "s04_d", say: "[skeptical]", text: "Окей, а «готово» — это когда? Когда я сказала «готово» или когда оно реально работает?" },
        {
          who: "sara",
          frame: "s04_e",
          say: "[firmly]",
          text: "Когда выполнен Definition of Done. Не выполнен — это не Increment. Обратно в бэклог, и никаких «почти».",
          terms: [
            { term: "Definition of Done", ru: "Формальное описание состояния Increment, когда он отвечает требованиям качества. Не прошло — нельзя выпустить и даже показать на Review: элемент возвращается в Product Backlog. Если это стандарт организации — минимум для всех команд." },
            { term: "Increment", ru: "Конкретная ступенька к Product Goal: добавляется ко всем прошлым, проверен и пригоден к использованию. За спринт их может быть несколько; Review — не «шлагбаум» для выпуска." },
            { term: "Artifacts & commitments", ru: "У каждого артефакта своё обязательство, по нему меряют прогресс: Product Backlog → Product Goal; Sprint Backlog → Sprint Goal; Increment → Definition of Done." },
          ],
        },
        {
          who: "sara",
          frame: "s04_f",
          text: "И пока идёт спринт — ничего, что угрожает его цели. Качество не падает. Договорились?",
          terms: [
            { term: "During the Sprint", ru: "Никаких изменений, угрожающих Sprint Goal; качество не снижается; Product Backlog уточняется по мере надобности; объём можно уточнить и пересогласовать с Product Owner." },
          ],
        },
      ],
    },
    {
      id: "s05",
      title: "Daily Scrum из больницы",
      mood: "tension",
      ambience: "quiet hospital room, slow soft heart monitor beep, gentle ventilation hum, no voices",
      lines: [
        { who: "narrator", frame: "s05_a", text: "На второй неделе Сару увозят в больницу. Но ровно в девять утра она на связи — бледная, с планшетом на коленях." },
        {
          who: "sara",
          frame: "s05_b",
          say: "[weak but warm]",
          text: "Daily Scrum. Пятнадцать минут. Это ваша встреча, а не отчёт мне. Ну?",
          terms: [
            { term: "Daily Scrum", ru: "15 минут для Developers, каждый рабочий день в одно время и в одном месте: проверить прогресс к Sprint Goal и подстроить Sprint Backlog — план на следующий день." },
          ],
        },
        { who: "arman", frame: "s05_c", say: "[frustrated]", text: "Оплата встала. Банк третий день кормит нас завтраками. Ещё день — и я им лично всё выскажу." },
        {
          who: "sara",
          frame: "s05_d",
          say: "[determined]",
          text: "Это impediment. Убирать его — моя работа. Дай мне номер.",
          terms: [{ term: "Impediment", ru: "Препятствие на пути команды. Scrum Master добивается, чтобы его убрали." }],
        },
        { who: "mira", frame: "s05_e", say: "[upset, almost shouting]", text: "Вы в больнице, чёрт возьми! Положите телефон!" },
        {
          who: "sara",
          frame: "s05_f",
          say: "[tired, with a weak smile]",
          text: "Мира, я пока ещё ваш Scrum Master. И burn-down — это хорошо, но решайте по тому, что уже случилось, а не по красивой линии.",
          terms: [
            { term: "Burn-down / burn-up / cumulative flow", ru: "Практики прогноза прогресса. Полезны, но не заменяют эмпиризм: в сложной среде для решений годится только то, что уже произошло." },
          ],
        },
      ],
    },
    {
      id: "s06",
      title: "Пятница",
      mood: "grief",
      ambience: "steady rain on large office windows, very distant thunder, quiet empty office, no voices",
      lines: [
        { who: "narrator", frame: "s06_a", say: "[quietly]", text: "Пятница. Последний день спринта. В шесть утра у Миры звонит телефон." },
        { who: "mira", frame: "s06_b", say: "[crying]", text: "Сары больше нет. Ночью. Во сне." },
        { who: "narrator", frame: "s06_c", say: "[softly]", text: "Её стул. Её маркер. Её почерк на доске: «Transparency. Inspection. Adaptation»." },
        { who: "ayat", frame: "s06_d", say: "[shouting]", text: "Всё. Я отменяю спринт. Какой, к чёрту, Review? Какое демо?!" },
        {
          who: "arman",
          frame: "s06_e",
          say: "[firmly]",
          text: "Аян, остынь. Отменить спринт можешь только ты, как Product Owner, — и только если Sprint Goal устарела. Она не устарела.",
          terms: [{ term: "Cancelling a Sprint", ru: "Спринт можно отменить, только если Sprint Goal устарела. Право отменить — только у Product Owner." }],
        },
        { who: "ayat", frame: "s06_f", say: "[angry, voice breaking]", text: "Не учи меня, Арман! Не сегодня!" },
        { who: "aliya", frame: "s06_g", say: "[quietly, but firmly]", text: "Хватит орать, Аян. Она из больницы звонила в банк — ради этой цели. Давайте хотя бы допишем." },
      ],
    },
    {
      id: "s07",
      title: "Review и Retrospective",
      mood: "calm",
      ambience: "quiet office in the evening, soft crackle of a candle, distant city traffic, no voices",
      lines: [
        {
          who: "narrator",
          frame: "s07_a",
          text: "Sprint Review. Гульнара из маленького кафе в Шымкенте — на видеосвязи. Это не презентация, а рабочая сессия.",
          terms: [
            { term: "Sprint Review", ru: "Проверить результат спринта со стейкхолдерами и решить, что дальше; бэклог можно поправить. Рабочая сессия, а не презентация. Предпоследнее событие спринта, до 4 часов для месячного." },
          ],
        },
        { who: "gulnara", frame: "s07_b", say: "[cheerful, laughing]", text: "Ой, а можно, чтобы лагман сразу на двоих заказывать? У меня все парами ходят." },
        { who: "aliya", frame: "s07_c", say: "[softly]", text: "Записала. В Product Backlog — а куда в очереди, решит Аян." },
        {
          who: "narrator",
          frame: "s07_d",
          say: "[quietly]",
          text: "Вечером — Retrospective. Стулья в кругу. Один пустой. Мира достаёт письмо.",
          terms: [
            { term: "Sprint Retrospective", ru: "Как повысить качество и эффективность: команда смотрит на людей, взаимодействие, процессы, инструменты и Definition of Done. Завершает спринт; до 3 часов для месячного." },
          ],
        },
        { who: "mira", frame: "s07_e", say: "[reading through tears]", text: "«Хороший Scrum Master делает себя ненужным. Если вы читаете это и справились без меня — значит, я справилась. И не смейте раскисать»." },
        { who: "arman", frame: "s07_f", say: "[laughing through tears]", text: "Блин... Даже тут командует." },
        { who: "ayat", frame: "s07_g", say: "[humbly, voice breaking]", text: "Мира. Будешь нашим Scrum Master? Она бы выбрала тебя. И... прости меня за пятницу. Всех вас." },
      ],
    },
    {
      id: "s08",
      title: "Следующий спринт",
      mood: "calm",
      ambience: "sunny morning office, birds outside the window, a coffee machine far away, soft footsteps, no voices",
      lines: [
        { who: "narrator", frame: "s08_a", text: "Понедельник. Новый спринт начинается сразу после предыдущего — даже после такой недели." },
        { who: "mira", frame: "s08_b", say: "[firmly, with a small smile]", text: "Daily Scrum — в девять ноль-ноль. Кто опоздал — покупает всем кофе. Это не обсуждается." },
        { who: "aliya", frame: "s08_c", say: "[teasing]", text: "Скажи честно, ты это у неё украла?" },
        { who: "mira", frame: "s08_d", say: "[sadly smiling]", text: "Конечно. Всё лучшее — у неё." },
        { who: "narrator", frame: "s08_e", say: "[warmly]", text: "Надпись Сары так и осталась на доске. Никто её не стирает. Scrum держится не на одном человеке — на том, что люди продолжают делать каждый день." },
      ],
    },
  ],
  moral: "Scrum Masters are true leaders who serve",
};
