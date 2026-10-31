import type { Story } from "./types";

/*
 * «Падение QuickBite» — история к лекции 6 Project Management (Griffiths:
 * принципы и мышление Agile). Третья часть QuickBite и первая без
 * счастливого конца: пользователь попросил трагедию — «чтобы было понятно,
 * что не всё так радужно». Финал горький: компания выжила маленькой, а Дани
 * не вернулся.
 *
 * Трагедия выросла из лекции: огромный контракт ведут как defined process —
 * план на девять месяцев, двести страниц требований, ни одного демо, лишние
 * фичи, недоделанная работа, переключения и ночи без устойчивого темпа. Всё
 * падает в день большого запуска, а клиенту продукт уже не нужен. Дальше —
 * манифест (четыре ценности и двенадцать принципов), перевёрнутый
 * треугольник, методы (Scrum и его опоры, XP, Lean и его потери, Kanban,
 * FDD, DSDM, Crystal) и agile-лидерство.
 *
 * Сверено с оригинальными слайдами лекции 6: формулировки ценностей и
 * принципов — дословно; «семь потерь» lean на слайде — шесть строк (нет
 * waiting); Lean близок к agile, но не agile-метод. Термины на карточках —
 * по-английски, пояснения — по-русски.
 */
export const pmLecture6Story: Story = {
  id: "pm-l6-quickbite-falls",
  title: "Падение QuickBite",
  subtitle: "Огромный контракт по плану на девять месяцев — и что Agile Manifesto говорит о цене такой ошибки.",
  lecture: { eventId: "project-management-test-2", lectureId: "pm-l6", label: "Project Management · Лекция 6 — Принципы и мышление Agile" },
  cover: "s03_e",
  // Голоса: voice — Gemini (прежняя озвучка), eleven — ElevenLabs (русская библиотека голосов).
  cast: {
    narrator: { name: "Рассказчик", voice: "Charon", eleven: "ogi2DyUAKJb7CEdqqvlU" },
    sara: { name: "Профессор Сара", role: "Advisor", voice: "Gacrux", eleven: "ymDCYd8puC7gYjxIamPt" },
    ayat: { name: "Аят", role: "CEO", voice: "Puck", eleven: "gJEfHTTiifXEDmO687lC" },
    mira: { name: "Мира", role: "Project Manager", voice: "Leda", eleven: "AB9XsbSA4eLG12t2myjN" },
    dani: { name: "Дани", role: "Head of Engineering", voice: "Fenrir", eleven: "kwajW3Xh5svCeKU5ky2S" },
    arman: { name: "Арман", role: "Finance Director", voice: "Iapetus", eleven: "rQOBu7YxCDxGiFdTm28w" },
    bekzat: { name: "Бекзат", role: "Client · MegaMart", voice: "Algenib", eleven: "6A9D8WSMm4rFsg2DWFeE" },
  },
  scenes: [
    {
      id: "s01",
      title: "Слишком большой контракт",
      mood: "hope",
      ambience: "busy bright startup office, keyboard typing, light chatter far away, no clear voices",
      lines: [
        { who: "narrator", frame: "s01_a", text: "Год спустя. После Green Bazaar к QuickBite приходит гигант — сеть MegaMart. Им нужно суперприложение на всю страну." },
        { who: "bekzat", frame: "s01_b", say: "[confidently]", text: "Нам нужен полный план на девять месяцев — всё, до последней кнопки. И фиксированный контракт." },
        { who: "ayat", frame: "s01_c", say: "[proudly]", text: "Сделаем. Двести страниц требований — и ни шагу в сторону." },
        {
          who: "sara",
          frame: "s01_d",
          text: "Аят, это работа людей знания. Её нельзя расписать заранее, как стройку. Тут нужен эмпирический процесс — короткими итерациями.",
          terms: [
            { term: "Knowledge worker", ru: "Человек с экспертизой в предметной области, который делится знаниями и участвует в анализе и/или разработке: инженеры, учителя, учёные, врачи." },
            { term: "Defined process", ru: "Все шаги определены заранее — как в строительстве." },
            { term: "Empirical process", ru: "Итеративный и инкрементальный — для новых и неопределённых проектов. Agile — для knowledge work в быстром и сложном окружении." },
          ],
        },
        { who: "ayat", frame: "s01_e", say: "[dismissively, confident]", text: "Профессор, у нас всё под контролем." },
      ],
    },
    {
      id: "s02",
      title: "Девять месяцев в темноте",
      mood: "tension",
      ambience: "late night office, quiet computer fans and a ticking wall clock, no voices",
      lines: [
        {
          who: "narrator",
          frame: "s02_a",
          text: "Команда месяцами пишет документацию и собирает подписи. Ни одного демо заказчику: «покажем в конце».",
          terms: [{ term: "Extra processes", ru: "Потеря lean: работа, которая не добавляет ценности, — документация, которую никто не читает, лишние согласования." }],
        },
        {
          who: "mira",
          frame: "s02_b",
          text: "Давайте добавим ещё анимации, голосового помощника и витрину в дополненной реальности!",
          terms: [{ term: "Extra features", full: "gold-plating", ru: "Потеря lean: фичи, которые не требовались или считались «приятно иметь»." }],
        },
        {
          who: "arman",
          frame: "s02_c",
          text: "Половина модулей начата и не закончена. Деньги вложены, а пользы — ноль.",
          terms: [{ term: "Partially done work", ru: "Потеря lean: начато, но не закончено — код ждёт тестов, спецификации ждут разработки." }],
        },
        {
          who: "dani",
          frame: "s02_d",
          say: "[stressed]",
          text: "Я веду три проекта сразу. Переключаюсь — и всё забываю.",
          terms: [{ term: "Task switching", ru: "Потеря lean: человека держат на нескольких проектах, и каждое переключение контекста стоит времени." }],
        },
        {
          who: "narrator",
          frame: "s02_e",
          text: "Дани неделями работает по ночам. Об устойчивом темпе никто не думает.",
          terms: [{ term: "Sustainable pace", ru: "Принцип 8 манифеста: спонсоры, разработчики и пользователи должны держать постоянный темп бесконечно долго. В XP высшая продуктивность — при устойчивом темпе." }],
        },
      ],
    },
    {
      id: "s03",
      title: "День запуска",
      mood: "conflict",
      ambience: "tense launch room, rapid alert notification beeps, servers humming, no voices",
      lines: [
        { who: "narrator", frame: "s03_a", text: "Девять месяцев спустя. Большой запуск — всё и сразу." },
        { who: "dani", frame: "s03_b", say: "[panicking]", text: "Серверы падают… Интеграция с кассами не работает!" },
        { who: "bekzat", frame: "s03_c", say: "[coldly]", text: "И главное: рынок изменился. Конкуренты полгода назад запустили похожее. Нам это больше не нужно." },
        { who: "bekzat", frame: "s03_d", say: "[flatly]", text: "Мы расторгаем контракт." },
        {
          who: "sara",
          frame: "s03_e",
          text: "Первоначальный план составили, когда о проекте знали меньше всего. А вы девять месяцев следовали плану, а не изменениям, — и прятались за контрактом вместо того, чтобы работать с заказчиком.",
          terms: [
            { term: "Responding to change over following a plan", ru: "Ценность манифеста: первоначальный план составлен, когда знали меньше всего; усилия — на ответ неизбежным изменениям." },
            { term: "Customer collaboration over contract negotiation", ru: "Ценность манифеста: быть гибкими и работать с заказчиком к общему определению «done»." },
          ],
        },
      ],
    },
    {
      id: "s04",
      title: "Потери",
      mood: "grief",
      ambience: "rain on large office windows, quiet empty office, no voices",
      lines: [
        { who: "arman", frame: "s04_a", say: "[grimly]", text: "Инвестор уходит. Денег хватит на два месяца. Нам придётся сократить половину команды." },
        { who: "narrator", frame: "s04_b", say: "[quietly]", text: "Аят сам говорит с каждым. Это самый тяжёлый день в жизни QuickBite." },
        { who: "dani", frame: "s04_c", say: "[exhausted, voice breaking]", text: "Аят, я больше не могу. Я выгорел. Я ухожу." },
        { who: "ayat", frame: "s04_d", say: "[stunned, quietly]", text: "Дани… Ты же со мной с первого курса." },
        { who: "dani", frame: "s04_e", say: "[sadly]", text: "Поэтому и ухожу. Пока мы ещё друзья." },
        {
          who: "narrator",
          frame: "s04_f",
          text: "Проекты делают люди, а не процессы и инструменты. QuickBite забыл об этом — и потерял своих людей.",
          terms: [{ term: "Individuals and interactions over processes and tools", ru: "Ценность манифеста: проекты делают люди, а не инструменты; проблемы решают люди, а не процессы." }],
        },
      ],
    },
    {
      id: "s05",
      title: "Манифест",
      mood: "calm",
      ambience: "calm office meeting room, a marker on a whiteboard now and then, soft ventilation, no voices",
      lines: [
        {
          who: "sara",
          frame: "s05_a",
          text: "Знаете, что вас сломало? Вы делали agile на словах, но не были agile. Agile — это прежде всего мышление.",
          terms: [
            { term: "Being agile vs doing agile", ru: "Doing agile — практики; being agile — мышление, из которого они вырастают. Без мышления практики не спасают." },
            { term: "Agile mindset", full: "Declaration of Interdependence", ru: "Растить отдачу от вложений, давать надёжный результат, ожидать неопределённости, раскрывать творчество, повышать производительность, улучшать эффективность и надёжность." },
          ],
        },
        {
          who: "sara",
          frame: "s05_b",
          text: "Agile Manifesto — четыре ценности. Люди и взаимодействие важнее процессов и инструментов. Работающий продукт важнее исчерпывающей документации. Сотрудничество с заказчиком важнее переговоров о контракте. Ответ на изменения важнее следования плану.",
          terms: [
            { term: "Individuals and interactions over processes and tools", ru: "Ценность 1." },
            { term: "Working software over comprehensive documentation", ru: "Ценность 2: важно поставлять — бизнес-ценность, а не бумаги." },
            { term: "Customer collaboration over contract negotiation", ru: "Ценность 3." },
            { term: "Responding to change over following a plan", ru: "Ценность 4." },
          ],
        },
        {
          who: "sara",
          frame: "s05_c",
          text: "То, что справа, тоже ценно. Но то, что слева, — ценнее.",
          terms: [{ term: "We value the items on the left more", ru: "«While there is value in the items on the right, we value the items on the left more»: документы, планы, контракты и процессы не плохи — просто левое важнее." }],
        },
        { who: "mira", frame: "s05_d", text: "А что говорят двенадцать принципов?" },
        {
          who: "sara",
          frame: "s05_e",
          text: "Главное — радовать заказчика ранней и непрерывной поставкой. Приветствовать изменения даже в конце. Поставлять часто — от пары недель до пары месяцев. И бизнес с разработчиками — вместе, каждый день.",
          terms: [
            { term: "Early and continuous delivery", ru: "Принцип 1: высший приоритет — удовлетворить заказчика ранней и непрерывной поставкой ценного ПО." },
            { term: "Welcome changing requirements", ru: "Принцип 2: изменения приветствуются даже поздно — agile обращает их в конкурентное преимущество заказчика." },
            { term: "Deliver working software frequently", ru: "Принцип 3: от пары недель до пары месяцев, чем короче — тем лучше." },
            { term: "Work together daily", ru: "Принцип 4: бизнес и разработчики работают вместе каждый день." },
          ],
        },
        {
          who: "sara",
          frame: "s05_f",
          text: "Дальше: мотивированные люди и доверие к ним. Разговор лицом к лицу. Работающий продукт — главная мера прогресса. Устойчивый темп. Техническое совершенство и простота — искусство не делать лишнего. Самоорганизующиеся команды. И регулярная рефлексия.",
          terms: [
            { term: "Motivated individuals · face-to-face", ru: "Принципы 5–6: проект — вокруг мотивированных людей, им доверяют; лучший способ передать информацию — разговор лицом к лицу." },
            { term: "Working software is the primary measure of progress", ru: "Принцип 7." },
            { term: "Sustainable pace · technical excellence · simplicity", ru: "Принципы 8–10: постоянный темп; внимание к качеству и дизайну; простота — искусство максимизировать объём несделанной работы." },
            { term: "Self-organizing teams · reflect and adjust", ru: "Принципы 11–12: лучшие архитектуры и требования рождаются в самоорганизующихся командах; команда регулярно думает, как стать эффективнее." },
          ],
        },
        {
          who: "sara",
          frame: "s05_g",
          text: "И треугольник переворачивается: время и стоимость фиксированы, а меняется объём.",
          terms: [{ term: "Agile triangle", full: "inverted triangle model", ru: "Agile-команды позволяют объёму (scope) меняться в рамках фиксированных стоимости и времени. Knowledge work — это эксперимент и неопределённость." }],
        },
      ],
    },
    {
      id: "s06",
      title: "Заново, но маленькими",
      mood: "strategy",
      ambience: "small office in the morning, soft keyboard typing, light background hum, no voices",
      lines: [
        { who: "ayat", frame: "s06_a", say: "[determined]", text: "Начинаем заново. Маленький клиент, итерации по две недели, демо каждый раз." },
        {
          who: "sara",
          frame: "s06_b",
          text: "Методов больше двенадцати. Чаще всего берут Scrum и XP. Scrum держится на трёх опорах: прозрачность, проверка, адаптация.",
          terms: [
            { term: "Agile methodologies", ru: "Scrum, Extreme Programming (XP), Lean, Kanban, FDD, DSDM, Crystal… Самые распространённые — Scrum и XP." },
            { term: "Scrum pillars", full: "transparency, inspection, adaptation", ru: "Видимость для тех, кто отвечает за результат; своевременные проверки прогресса; подстройка процесса, если проверка нашла проблему." },
          ],
        },
        {
          who: "mira",
          frame: "s06_c",
          text: "Из XP берём парное программирование, тесты до кода и непрерывную интеграцию.",
          terms: [
            { term: "XP core values", ru: "Пять ценностей XP: simplicity (простота), communication (общение), feedback (обратная связь), courage (смелость), respect (уважение)." },
            { term: "XP practices", ru: "Практики XP: pair programming (двое за одним кодом), test-driven development (сначала тест, потом код), continuous integration (сливать код каждый день), refactoring, simple design, small releases, collective code ownership, sustainable pace, whole team." },
          ],
        },
        {
          who: "arman",
          frame: "s06_d",
          text: "А я повешу канбан-доску и ограничу незавершённую работу. Больше никаких «начато и брошено».",
          terms: [
            { term: "Kanban", ru: "По-японски «signboard» — вывеска. Из lean-системы Toyota; главное — ограничить незавершённую работу (WIP)." },
            { term: "5 principles of Kanban", ru: "Пять принципов Kanban: visualize the workflow (работа видна на доске), limit WIP (не больше N задач в работе), manage flow (следить, чтобы задачи текли), make process policies explicit (правила записаны), improve collaboratively (улучшать вместе)." },
          ],
        },
        {
          who: "sara",
          frame: "s06_e",
          text: "И Lean: убирайте потери — лишние фичи, лишние процессы, недоделанную работу, переключения. Только помните: Lean близок к agile, но сам не agile-метод.",
          terms: [
            { term: "Lean core concepts", ru: "Опоры Lean: eliminate waste (убрать потери), empower the team (доверять команде), deliver fast (отдавать быстро), optimize the whole (улучшать весь поток, а не кусок), build quality in (качество сразу), defer decisions (решать как можно позже), amplify learning (учиться на ходу)." },
            { term: "The 7 wastes of lean", ru: "Partially done work, extra processes, extra features, task switching, motion, defects — на слайде шесть строк; седьмая — waiting." },
          ],
        },
        {
          who: "narrator",
          frame: "s06_f",
          text: "Есть и другие: FDD — разработка по фичам, DSDM — восемь принципов с фокусом на потребности бизнеса, Crystal — метод подбирают по критичности проекта и размеру команды.",
          terms: [
            { term: "FDD", full: "Feature-Driven Development", ru: "Моделирование предметной области, разработка по фичам, владение классом, feature teams, инспекции, регулярные сборки, видимость прогресса." },
            { term: "DSDM", full: "Dynamic Systems Development Method", ru: "8 принципов: фокус на бизнес-потребности, в срок, сотрудничество, качество без компромиссов, инкременты на прочном фундаменте, итерации, постоянная коммуникация, демонстрация контроля." },
            { term: "Crystal", ru: "Семейство методов под ситуацию: проекты классифицируют по критичности и размеру команды." },
          ],
        },
      ],
    },
    {
      id: "s07",
      title: "Лидер, а не начальник",
      mood: "uplift",
      ambience: "warm friendly office, soft keyboard typing, quiet murmur far away, no clear voices",
      lines: [
        {
          who: "ayat",
          frame: "s07_a",
          text: "Я управлял задачами и сроками. А надо было — людьми и смыслом.",
          terms: [{ term: "Management vs leadership", ru: "Management — механика: задачи, контроль, скорость. Leadership — люди и цель: полномочия и эффективность." }],
        },
        {
          who: "sara",
          frame: "s07_b",
          text: "У agile-лидера четыре обязанности: защищать команду от помех, убирать препятствия, снова и снова доносить видение — и «носить еду и воду», то есть давать всё, что нужно для работы.",
          terms: [{ term: "4 primary duties", ru: "Четыре обязанности agile-лидера: shield the team from interruptions (закрыть команду от помех), remove impediments to progress (убирать препятствия), communicate (and re-communicate) the project vision (повторять, зачем проект), carry food and water (дать людям всё нужное для работы)." }],
        },
        {
          who: "sara",
          frame: "s07_c",
          text: "Организации меняются через людей: сначала сам усвой принципы, потом делай, потом вдохнови других.",
          terms: [
            { term: "Think → Do → Encourage others", ru: "Как создаётся организационное изменение: усвоить принципы agile, практиковать их, вдохновлять других." },
            { term: "Agile leadership practices", ru: "Практики лидера: model desired behavior (показывать пример), communicate the project vision (объяснять цель), enable others to act (давать команде действовать самой), be willing to challenge the status quo (не бояться менять привычный порядок)." },
          ],
        },
        {
          who: "mira",
          frame: "s07_d",
          text: "И давайте сделаем так, чтобы пробовать новое было безопасно. Чтобы никто больше не боялся ошибиться.",
          terms: [{ term: "Safe environment for experimentation", ru: "Задача лидера: люди пробуют новое, если не боятся критики. Рядом — прозрачность через визуализацию и emergent leadership." }],
        },
      ],
    },
    {
      id: "s08",
      title: "Не всё радужно",
      mood: "calm",
      ambience: "quiet evening office, distant city traffic, soft ventilation hum, no voices",
      lines: [
        { who: "narrator", frame: "s08_a", text: "Полгода спустя. QuickBite маленький, но живой: каждые две недели — работающая версия, каждое демо — вместе с клиентом." },
        { who: "arman", frame: "s08_b", say: "[relieved, smiling]", text: "Впервые за год мы в плюсе." },
        {
          who: "narrator",
          frame: "s08_c",
          text: "На ретроспективе команда решает, что улучшить в следующей итерации.",
          terms: [{ term: "Reflect and adjust", ru: "Принцип 12: через равные промежутки команда думает, как стать эффективнее, и подстраивает своё поведение." }],
        },
        { who: "narrator", frame: "s08_d", say: "[quietly]", text: "Стол Дани так и стоит у окна, пустой. От него — одно сообщение." },
        { who: "dani", frame: "s08_e", say: "[softly, distant]", text: "Рад за вас. Правда. Но мне нужно время." },
        { who: "narrator", frame: "s08_f", say: "[thoughtfully]", text: "Планы составляют, когда знают меньше всего. А цена того, что QuickBite этого не понял, — не только деньги." },
      ],
    },
  ],
  moral: "Responding to change over following a plan",
};
