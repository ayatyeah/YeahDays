import type { Story } from "./types";

/*
 * «ХроноЕрнар» — финальная история QuickBite, к лекции 8 Project Management
 * (Practices in agile frameworks: Agile Extension to the BABOK® Guide —
 * выбор техники и Table 1, Personas, User Stories). Сюжет пользователя:
 * Ернар, бывший однокурсник Аята, находит в подвале посох Времени и
 * становится ХроноЕрнаром в красной мантии. Он объясняет команде лекцию 8 —
 * где они ошиблись с самого начала, — и предлагает сделку: Сара жива, Дани
 * не уходит, проект работает, но команда забывает Аята, и тот рассыпается
 * пылью. Аят соглашается. Финал повторяет первую сцену истории 4 — без Аята.
 *
 * Ернар — реальный друг пользователя, он сам захотел оказаться в истории;
 * внешность на кадрах — по его фотографиям. Все понятия лекции 8 — на
 * карточках (термин по-английски, пояснение по-русски), сверено со слайдами
 * и конспектом l8.ts: Table 1 даёт отправную точку, а не закон; Personas и
 * User Stories в Table 1 — только у internal teams; в INVEST S — Sized
 * Appropriately; needs конечны, wants бесконечны.
 */
export const pmLecture8Story: Story = {
  id: "pm-l8-chronoyernar",
  title: "ХроноЕрнар",
  subtitle: "Финал. Бывший друг Аята с посохом Времени знает, где команда ошиблась с самого начала, — и предлагает всё исправить. Но у сделки есть цена.",
  lecture: { eventId: "project-management-test-2", lectureId: "pm-l8", label: "Project Management · Лекция 8 — Practices in agile frameworks" },
  cover: "s01_c",
  // Голоса: voice — Gemini (про запас), eleven — ElevenLabs (русская библиотека голосов).
  cast: {
    narrator: { name: "Рассказчик", voice: "Charon", eleven: "ogi2DyUAKJb7CEdqqvlU" },
    yernar: { name: "ХроноЕрнар", role: "Time Traveler", voice: "Orus", eleven: "txnCCHHGKmYIwrn7HfHQ" },
    ayat: { name: "Аят", role: "Product Owner", voice: "Puck", eleven: "gJEfHTTiifXEDmO687lC" },
    mira: { name: "Мира", role: "Scrum Master", voice: "Leda", eleven: "AB9XsbSA4eLG12t2myjN" },
    arman: { name: "Арман", role: "Developer", voice: "Iapetus", eleven: "rQOBu7YxCDxGiFdTm28w" },
    aliya: { name: "Алия", role: "Developer", voice: "Aoede", eleven: "dVRDrbP5ULGXB94se4KZ" },
    sara: { name: "Профессор Сара", role: "Mentor", voice: "Gacrux", eleven: "ymDCYd8puC7gYjxIamPt" },
    dani: { name: "Дани", role: "Developer", voice: "Fenrir", eleven: "kwajW3Xh5svCeKU5ky2S" },
  },
  scenes: [
    {
      id: "s01",
      title: "Посох Времени",
      mood: "tension",
      ambience: "dusty old basement, a single light bulb buzzing, faint low magical hum, no voices",
      lines: [
        { who: "narrator", frame: "s01_a", text: "Где-то в Алматы, в подвале старого дома, Ернар разбирает дедовский хлам. Когда-то они с Аятом сидели за одной партой. Потом их пути разошлись." },
        { who: "yernar", frame: "s01_b", say: "[annoyed, then surprised]", text: "Ну и пылища… А это что? Он светится?" },
        { who: "narrator", frame: "s01_c", text: "Ернар берёт посох — и подвал заливает красным светом. На плечах — мантия. Посох Времени выбрал хозяина." },
        { who: "yernar", frame: "s01_d", say: "[awed, then smug]", text: "ХроноЕрнар… А звучит. Ну что, Аят, посмотрим, как ты там без меня." },
      ],
    },
    {
      id: "s02",
      title: "Гость в мантии",
      mood: "tension",
      lines: [
        { who: "narrator", frame: "s02_a", say: "[quietly]", text: "Неделя после ухода Сары. Ночь. Аят один в офисе — смотрит на её пустой стул." },
        { who: "ayat", frame: "s02_b", say: "[startled]", text: "Ернар?! Ты как сюда попал? И что на тебе — халат?" },
        { who: "yernar", frame: "s02_c", say: "[amused]", text: "Мантия, Аят. И посох Времени. Я видел каждый ваш спринт. Каждую ошибку." },
        { who: "ayat", frame: "s02_d", say: "[cold]", text: "Мы пять лет не разговаривали. Чего тебе надо?" },
        { who: "narrator", frame: "s02_e", text: "Ернар бьёт посохом об пол — и вся команда оказывается в офисе. В пижамах." },
        { who: "arman", frame: "s02_f", say: "[outraged]", text: "Я в пижаме. Почему я в пижаме?! Кто это вообще такой?!" },
      ],
    },
    {
      id: "s03",
      title: "С чего начать",
      mood: "smart",
      lines: [
        {
          who: "yernar",
          frame: "s03_a",
          text: "Сначала — инструмент. Подобрать технику трудно. Таблица — не закон, а отправная точка. Остальное — опыт, знание области и голова.",
          terms: [
            { term: "Selecting the Right Technique", ru: "Подобрать технику под ситуацию трудно. Table 1 — общая подсказка, отправная точка, а не обязательное правило; многие техники работают в разных контекстах. Выбирают по знанию предметной области, опыту, своим компетенциям и креативности." },
            { term: "Table 1", ru: "Пять контекстов (Communications, Process Analysis, Product Management Refinement, Requirements Management, Understanding your Customer) × «works well with internal teams» / «with stakeholders external to the team»; 24 техники. Personas — Understanding your Customer, User Stories — Requirements Management, обе только у internal teams." },
          ],
        },
        { who: "aliya", frame: "s03_b", say: "[sarcastic]", text: "То есть нас в пижамах будет учить человек в красной шторе. Супер." },
        { who: "yernar", frame: "s03_c", say: "[smirking]", text: "Человек в красной шторе знает главное: вы ни разу не спросили, для кого строите QuickBite." },
      ],
    },
    {
      id: "s04",
      title: "Персона",
      mood: "smart",
      lines: [
        {
          who: "yernar",
          frame: "s04_a",
          text: "Знакомьтесь. Гульнара, пятьдесят пять, кафе в Шымкенте, очки на цепочке, обед на сорок человек. Это persona.",
          terms: [
            { term: "Personas", ru: "Вымышленные персонажи-архетипы: как типичный пользователь работает с решением. Помогают понять ценность глазами стейкхолдера, когда прямого доступа к клиенту нет, и сосредоточиться на том, что ему ценнее всего. Персоны ранжируют — кому решение даст больше пользы." },
            { term: "Persona Name and Image", ru: "Персону описывают как живого человека: реалистичное имя, вымышленное фото, характер, работа, навыки, привычки, цели, иногда «day in the life» — чтобы было ближе и вызывало эмпатию." },
          ],
        },
        {
          who: "mira",
          frame: "s04_b",
          say: "[thoughtful]",
          text: "Черты, мотивы, потребности… И чем она отличается от других.",
          terms: [
            { term: "Traits and Characteristics", ru: "Отличительные черты стейкхолдера. Пример с банкоматом: один — офис-менеджер, вносит наличные в конце дня; другой снимает понемногу." },
            { term: "Motivations", ru: "Почему и как человек пользуется решением: менеджер хочет снизить риск кражи, другой — снять минимум." },
            { term: "Needs", ru: "Конкретные потребности — базовые (безопасность, доверие, еда и жильё) или высшие (признание). Needs конечны, wants — бесконечны." },
            { term: "Differentiators", ru: "Чем эта персона отличается от других: поколение, опыт, предпочтения, приметы." },
          ],
        },
        {
          who: "yernar",
          frame: "s04_c",
          text: "Сначала короткий шаблон на страницу. Узнали больше — переходите на длинный.",
          terms: [
            { term: "Short and Long Template", ru: "Short — одна страница ключевого: имя и фото, детали, черты, цели. Long — подробно: демография, мотив покупки, черты, потребности, мотивация, отличия. Из short в long — через дополнительное исследование пользователей." },
          ],
        },
        { who: "aliya", frame: "s04_d", say: "[skeptical]", text: "А нафига выдумывать человека, если можно спросить живого?" },
        {
          who: "yernar",
          frame: "s04_e",
          say: "[nodding]",
          text: "Правильный вопрос. Персона не заменит живого пользователя, и её надо пересматривать. Но она даёт лицо — и не даёт строить для себя.",
          terms: [
            { term: "Personas: strengths", ru: "Общее понимание требований разных групп — из них пишут user stories; фичи приоритизируют по нуждам персон; «человеческое лицо» для эмпатии; старт — демографические данные, иначе придумывают по немногим фактам; нужен представительный набор; мешают проецировать свои ценности и предубеждения." },
            { term: "Personas: limitations", ru: "Выдуманы — тянет сделать «среднего» пользователя и решение «для всех»; не замена живому пользователю и могут отдалить команду от людей; их надо регулярно пересматривать и обновлять." },
          ],
        },
      ],
    },
    {
      id: "s05",
      title: "Одна фраза вместо двухсот страниц",
      mood: "strategy",
      lines: [
        {
          who: "yernar",
          frame: "s05_a",
          text: "Помнишь двести страниц для MegaMart, Аят? Надо было одну фразу.",
          terms: [
            { term: "User Stories", ru: "Передают команде требование клиента: короткая фраза о фиче, которая даёт ценность. Пишут клиенты, product owner или аналитики; живут в бэклоге; по ним PO определяет объём и приоритеты инкрементов. Не всё в бэклоге — user stories, но они подчёркивают ценность для клиента." },
          ],
        },
        {
          who: "yernar",
          frame: "s05_b",
          text: "Как владелица кафе, я хочу заказать лагман на двоих в три нажатия, чтобы не терять гостей в обед. Кто, что и зачем.",
          terms: [
            { term: "User Story Format", ru: "WHO — роль или персона, WHAT — действие или фича, WHY — польза. «As a <role>, I need to <feature> so that <goal or value>» или «In order to <business value>, as a <role>, I need to <behavior>»." },
          ],
        },
        { who: "arman", frame: "s05_c", say: "[interested]", text: "INVEST? Наконец-то что-то про деньги." },
        {
          who: "yernar",
          frame: "s05_d",
          say: "[dryly]",
          text: "Не про деньги. Independent, Negotiable, Valuable, Estimable, Sized Appropriately, Testable.",
          terms: [
            { term: "INVEST", ru: "Independent — не зависит от других фич; Negotiable — как сделать, команда договаривается; Valuable — ценна для клиента; Estimable — можно оценить по опыту; Sized Appropriately — влезает в одну итерацию, чем меньше, тем лучше; Testable — стейкхолдер проверит объективно." },
          ],
        },
        {
          who: "yernar",
          frame: "s05_e",
          text: "И три C: Card, Conversation, Confirmation. Карточка зовёт к разговору, а критерии приёмки подтверждают, что сделали нужное.",
          terms: [
            { term: "3Cs", ru: "Card — карточка: название с активным глаголом, как у use case, и формулировка. Conversation — история нарочно неполная и зовёт команду и стейкхолдеров к разговору. Confirmation — подтвердить, что сделанное закрывает потребность." },
            { term: "Acceptance Criteria", ru: "Границы истории: по ним проверяют, что решение отвечает потребности, и видят минимум нужных функций. Ими пользуются PO и стейкхолдеры; на них строят приёмочные, регрессионные и исследовательские тесты." },
          ],
        },
      ],
    },
    {
      id: "s06",
      title: "Где вы ошиблись",
      mood: "tension",
      lines: [
        {
          who: "yernar",
          frame: "s06_a",
          text: "Вот вы у MegaMart: сотни историй, бэклог раздуло, все смотрят на «что» — и никто не помнит «зачем».",
          terms: [
            { term: "User Stories: limitations", ru: "Ответов заранее нет — это непросто; много историй раздувают бэклог; дробление плодит новые — их надо упорядочивать, уточнять и приоритизировать; за отдельными историями теряют видение и roadmap; привычка смотреть на WHAT и забывать WHY." },
          ],
        },
        {
          who: "yernar",
          frame: "s06_b",
          text: "Историям нужен присмотр: refinement, roadmap, дробление, уточнение и видение. Тогда они работают.",
          terms: [
            { term: "User Story Management", ru: "Истории затрагивают Backlog Refinement, Product Roadmap, Story Decomposition, Story Elaboration и Visioning." },
            { term: "User Stories: strengths", ru: "Маленькие проверяемые срезы — быстрая поставка и частая обратная связь; понятны стейкхолдерам; писать учатся за минуты; совместная работа над ними строит commitment и общее понимание; их дополняют моделями — данные, бизнес-правила, мокапы, диаграммы." },
          ],
        },
        { who: "ayat", frame: "s06_c", say: "[angry]", text: "Хватит лекций! Ты пришёл не учить. Чего ты хочешь, Ернар?" },
      ],
    },
    {
      id: "s07",
      title: "Сделка",
      mood: "conflict",
      lines: [
        { who: "yernar", frame: "s07_a", say: "[serious]", text: "Я могу вернуться в прошлое. Сара жива. Дани не уходит. QuickBite работает с первой итерации." },
        { who: "mira", frame: "s07_b", say: "[hopeful, trembling]", text: "Сара… жива? А цена?" },
        { who: "yernar", frame: "s07_c", say: "[quietly]", text: "Аят. Его не будет. Никто из вас его не вспомнит. Будто его никогда и не было." },
        { who: "arman", frame: "s07_d", say: "[furious]", text: "Ты больной? Нет! Никаких сделок с типом в шторе!" },
        { who: "aliya", frame: "s07_e", say: "[angry]", text: "Это не сделка. Это шантаж в мантии." },
        { who: "ayat", frame: "s07_f", say: "[quietly, resolved]", text: "Сара жива. Дани с вами. Проект живёт… Я согласен." },
        { who: "mira", frame: "s07_g", say: "[shouting, crying]", text: "Аят, нет!" },
      ],
    },
    {
      id: "s08",
      title: "Щелчок",
      mood: "grief",
      ambience: "deep magical whoosh, shimmering golden particles dissolving into silence, no voices",
      lines: [
        { who: "ayat", frame: "s08_a", say: "[softly, smiling through tears]", text: "Начните с людей. С историй. Не с плана. И берегите друг друга." },
        { who: "yernar", frame: "s08_b", say: "[hesitant, guilty]", text: "Ты всегда решал за всех, Аят. В этот раз — только за себя." },
        { who: "narrator", frame: "s08_c", say: "[quietly]", text: "Ернар поднимает посох. Аят рассыпается золотой пылью — его стирает из самой истории." },
        { who: "arman", frame: "s08_d", say: "[confused, whispering]", text: "Аят?.. Кто… кто такой Аят?" },
      ],
    },
    {
      id: "s09",
      title: "Как будто впервые",
      mood: "hope",
      lines: [
        { who: "narrator", frame: "s09_a", text: "Это история команды QuickBite. Приложение для быстрого заказа еды у местных продавцов. Идея, месяц до Demo Day и маленький бюджет." },
        { who: "sara", frame: "s09_b", text: "У вас один месяц. Один шанс. И ограниченный бюджет. Сможете запустить QuickBite?" },
        { who: "dani", frame: "s09_c", say: "[confidently]", text: "Сможем. Только начнём с тех, кто будет этим пользоваться." },
        { who: "mira", frame: "s09_d", say: "[puzzled]", text: "Странно… Мне кажется, за этим столом кого-то не хватает." },
        { who: "narrator", frame: "s09_e", say: "[quietly]", text: "За окном в красной мантии стоит ХроноЕрнар. Только он помнит Аята — и цену, которую тот заплатил." },
      ],
    },
  ],
  moral: "Start with who and why — not with what",
};
