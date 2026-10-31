import type { Story } from "./types";

/*
 * «QuickBite: как команда спасла проект» — история к лекции 4 Project
 * Management (Kerzner: контроль затрат и EVM; Gibson: поведение групп).
 *
 * Сюжет и восемь ключевых кадров — из story pack пользователя
 * (lecture4_quickbite_story_pack.zip); промежуточные кадры дорисовал Codex.
 * Сверено с конспектом l4.ts, и где пак расходился с лекцией, держимся лекции:
 * - цикл контроля: planning cycle (фаза I) + operating cycle из ЧЕТЫРЁХ фаз
 *   (II–V), вместе — замкнутая система MCCS (ловушка теста: «operating cycle
 *   — сколько фаз»);
 * - стадий развития группы ПЯТЬ: после performing идёт adjourning — Demo Day
 *   как раз и есть его момент;
 * - роли: Mira — дизайнер, Dani — разработчик (так в диалогах, синопсисе и
 *   на кадре сцены 6; на исходном кадре 1 подписи были перепутаны, кадр
 *   перерисован).
 * Термины на карточках — по-английски, как на слайдах и в тесте; пояснения —
 * по-русски, формулировками конспекта.
 */
export const pmLecture4Story: Story = {
  id: "pm-l4-quickbite",
  title: "QuickBite: как команда спасла проект",
  subtitle: "Контроль затрат, earned value и стадии развития команды — на одном студенческом стартапе.",
  lecture: { eventId: "project-management-test-2", lectureId: "pm-l4", label: "Project Management · Лекция 4 — Контроль затрат и поведение групп" },
  cover: "s01_key",
  cast: {
    narrator: { name: "Рассказчик", voice: "Charon" },
    sara: { name: "Профессор Сара", role: "Mentor", voice: "Gacrux" },
    ayat: { name: "Аят", role: "Project Leader", voice: "Puck" },
    mira: { name: "Мира", role: "Designer", voice: "Leda" },
    dani: { name: "Дани", role: "Developer", voice: "Fenrir" },
    arman: { name: "Арман", role: "Finance", voice: "Iapetus" },
  },
  scenes: [
    {
      id: "s01",
      title: "Один месяц, один шанс",
      mood: "hope",
      lines: [
        { who: "narrator", frame: "s01_a", text: "Это история команды QuickBite. Они делают приложение для быстрого заказа еды у местных продавцов. У них есть идея, месяц до Demo Day и ограниченный бюджет." },
        { who: "sara", frame: "s01_b", text: "У вас один месяц. Один шанс. И ограниченный бюджет. Сможете запустить QuickBite?" },
        { who: "ayat", frame: "s01_key", text: "Сможем. Если будем работать как команда." },
        {
          who: "narrator",
          frame: "s01_c",
          text: "В начале любого проекта всё кажется возможным. Но мечта без контроля быстро становится риском.",
          terms: [{ term: "Planned budget", ru: "Бюджет по плану: сколько денег проект должен потратить на работу. С ним потом сравнивают фактические расходы." }],
        },
      ],
    },
    {
      id: "s02",
      title: "Бюджет трещит",
      mood: "tension",
      lines: [
        { who: "narrator", frame: "s02_a", text: "Прошло две недели. Промежуточная проверка." },
        {
          who: "arman",
          frame: "s02_key",
          text: "Подождите… фактические расходы уже сильно выше плана.",
          terms: [{ term: "Actual cost", ru: "Фактические расходы — сколько денег на самом деле ушло на выполненную работу." }],
        },
        { who: "mira", frame: "s02_b", text: "Что? Уже сейчас?" },
        { who: "dani", frame: "s02_c", text: "Если так пойдёт дальше, мы не доживём до запуска." },
        { who: "ayat", frame: "s02_d", text: "Значит, пора не просто работать… пора контролировать проект." },
        {
          who: "narrator",
          frame: "s02_e",
          text: "Cost control — это контроль затрат: видеть реальные цифры, сравнивать их с планом и вовремя реагировать. И сильнее всего он окупается в начале проекта: тщательное планирование и оценки — самые сильные инструменты контроля затрат.",
          terms: [{ term: "Cost control", ru: "Контроль затрат: следить за расходами проекта, сравнивать факт с бюджетом и вовремя исправлять курс." }],
        },
      ],
    },
    {
      id: "s03",
      title: "Цикл контроля",
      mood: "calm",
      lines: [
        {
          who: "sara",
          frame: "s03_key",
          text: "Контроль проекта — это не один отчёт в конце. Это замкнутый цикл. На нём держится MCCS — management cost and control system.",
          terms: [{ term: "MCCS", full: "Management Cost and Control System", ru: "Система управления и контроля затрат. Её основа — замкнутый цикл из планирования и операционного цикла." }],
        },
        {
          who: "sara",
          frame: "s03_a",
          text: "Фаза один — planning cycle: WBS, оценки, бюджет на каждый пакет работ, базовый график.",
          terms: [{ term: "Planning cycle", full: "Phase I", ru: "Цикл планирования — фаза I: WBS, оценки, бюджет по пакетам работ и базовый график." }],
        },
        {
          who: "sara",
          frame: "s03_b",
          text: "Дальше — operating cycle, в нём четыре фазы. Вторая — work authorization and release: никто не тратит деньги, пока пакет работ не открыт с бюджетом.",
          terms: [
            { term: "Operating cycle", full: "Phases II–V", ru: "Операционный цикл: четыре фазы, со второй по пятую. Вместе с планированием (фаза I) — замкнутая система." },
            { term: "Work authorization and release", full: "Phase II", ru: "Пакет работ официально открывают с бюджетом и кодом затрат. До этого никто не тратит." },
          ],
        },
        {
          who: "sara",
          frame: "s03_c",
          text: "Третья — cost data collection and reporting: собираем часы, счета подрядчиков, облачные расходы. Четвёртая — cost analysis: сравниваем факт и прогресс с планом. Пятая — reporting для заказчика и руководства.",
          terms: [
            { term: "Cost data collection and reporting", full: "Phase III", ru: "Сбор данных о затратах: табели, счета, облачные расходы — по каждому пакету работ." },
            { term: "Cost analysis", full: "Phase IV", ru: "Анализ затрат: факт и прогресс сравнивают с планом — отклонения и индексы." },
            { term: "Reporting", full: "Phase V · customer and management", ru: "Отчёты заказчику и руководству. Их решения возвращаются в планирование." },
          ],
        },
        { who: "ayat", frame: "s03_d", text: "То есть после отчёта мы снова планируем?" },
        {
          who: "sara",
          frame: "s03_e",
          text: "Именно. Поэтому система и замкнутая: отчёт возвращает нас к планированию. И запомните ловушку: в operating cycle четыре фазы — со второй по пятую.",
          terms: [{ term: "Closed system network", ru: "«Замкнутая»: после отчёта (V) — снова планирование (I), и новый план опять авторизуют (II)." }],
        },
      ],
    },
    {
      id: "s04",
      title: "Earned value",
      mood: "smart",
      lines: [
        {
          who: "arman",
          frame: "s04_a",
          text: "Смотрите. BCWS — плановая стоимость запланированной работы. У нас — тысяча.",
          terms: [{ term: "BCWS", full: "Budgeted Cost of Work Scheduled", ru: "Плановая стоимость работы, которая по графику должна быть сделана к этому дню. Planned value." }],
        },
        {
          who: "arman",
          frame: "s04_b",
          text: "BCWP — плановая стоимость работы, которую мы реально выполнили: восемьсот. Это earned value.",
          terms: [{ term: "BCWP", full: "Budgeted Cost of Work Performed", ru: "Плановая стоимость реально выполненной работы — earned value, освоенный объём." }],
        },
        {
          who: "arman",
          frame: "s04_c",
          text: "А ACWP — сколько мы на самом деле потратили: семьсот.",
          terms: [{ term: "ACWP", full: "Actual Cost of Work Performed", ru: "Фактическая стоимость выполненной работы — сколько реально заплатили." }],
        },
        { who: "mira", frame: "s04_key", text: "И что нам говорят цифры?" },
        {
          who: "arman",
          frame: "s04_d",
          text: "CV — это BCWP минус ACWP: плюс сто. Мы under budget. А SV — BCWP минус BCWS: минус двести. Мы behind schedule.",
          terms: [
            { term: "CV = BCWP − ACWP", full: "Cost Variance", ru: "Отклонение по стоимости. Плюс — дешевле плана (under budget), минус — перерасход." },
            { term: "SV = BCWP − BCWS", full: "Schedule Variance", ru: "Отклонение по графику. Минус — отстаём (behind schedule), плюс — опережаем." },
          ],
        },
        {
          who: "arman",
          frame: "s04_e",
          text: "И индексы. CPI — BCWP делить на ACWP: один и четырнадцать сотых. SPI — BCWP делить на BCWS: ноль целых восемь десятых.",
          terms: [
            { term: "CPI = BCWP / ACWP", full: "Cost Performance Index", ru: "Индекс по стоимости. Больше 1 — тратим меньше плана, меньше 1 — перерасход." },
            { term: "SPI = BCWP / BCWS", full: "Schedule Performance Index", ru: "Индекс по графику. Меньше 1 — отстаём от графика, больше 1 — опережаем." },
          ],
        },
        { who: "ayat", frame: "s04_f", text: "Теперь ясно. По деньгам всё не так плохо, но по времени мы отстаём." },
        {
          who: "narrator",
          frame: "s04_g",
          text: "CPI больше единицы — хороший знак по затратам. SPI меньше единицы — отставание по графику. Earned value даёт точную картину вместо ощущения «у нас проблемы».",
          terms: [{ term: "EVM", full: "Earned Value Management", ru: "Управление освоенным объёмом: стоимость и график сравнивают по трём числам — BCWS, BCWP и ACWP." }],
        },
      ],
    },
    {
      id: "s05",
      title: "Резать — пока дёшево",
      mood: "strategy",
      lines: [
        { who: "dani", frame: "s05_a", text: "Эта extra feature красивая, но она съест и время, и деньги." },
        { who: "mira", frame: "s05_b", text: "Лучше убрать её сейчас, чем переделывать потом." },
        {
          who: "ayat",
          frame: "s05_key",
          text: "Фокусируемся на MVP. Главное — ценность, а не лишняя сложность.",
          terms: [{ term: "MVP", full: "Minimum Viable Product", ru: "Минимальная версия продукта, которая уже приносит пользу. Всё лишнее — потом." }],
        },
        {
          who: "narrator",
          frame: "s05_c",
          text: "Чем дальше идёт проект, тем дороже каждое изменение — и тем меньше остаётся возможностей сократить стоимость. Больше всех влияет на стоимость заказчик, в самом начале — на инициации.",
          terms: [
            { term: "Cost of change", ru: "Цена изменения: в начале проекта низкая и растёт к концу жизненного цикла." },
            { term: "Possible cost reductions", ru: "Возможность сэкономить: в начале высокая и быстро падает. Кривые пересекаются рано — решать нужно рано." },
          ],
        },
      ],
    },
    {
      id: "s06",
      title: "Буря",
      mood: "conflict",
      lines: [
        { who: "mira", frame: "s06_a", text: "Если интерфейс будет скучным, пользователи не полюбят продукт!" },
        { who: "dani", frame: "s06_b", text: "А если всё усложнить, мы вообще не успеем!" },
        { who: "arman", frame: "s06_c", text: "И бюджет этого не выдержит." },
        { who: "ayat", frame: "s06_key", text: "Стоп. У нас одна цель. Давайте искать решение, а не виноватого." },
        {
          who: "sara",
          frame: "s06_d",
          text: "Это storming. Вы спорите, пробуете роли, и иерархия группы только начинает складываться. Это нормально. Важно не избегать конфликта, а управлять им.",
          terms: [{ term: "Storming", ru: "Стадия конфликта: спорят, экспериментируют с ролями, пытаются занять лидерство; иерархия группы начинает складываться." }],
        },
      ],
    },
    {
      id: "s07",
      title: "Мы — команда",
      mood: "uplift",
      lines: [
        {
          who: "narrator",
          frame: "s07_a",
          text: "Сильные команды не рождаются готовыми. Сначала — forming: растопить лёд, познакомиться и договориться о первых, пока нестрогих правилах.",
          terms: [{ term: "Forming", ru: "Знакомство: «растопить лёд», пробовать модели поведения, задавать вопросы; правила пока нестрогие, но конкретные." }],
        },
        {
          who: "narrator",
          frame: "s07_b",
          text: "Потом storming. А затем norming: появляется чувство «мы», начинается сплочённость, и группа сама договаривается, чего ждёт друг от друга.",
          terms: [{ term: "Norming", ru: "Группа начинает работать эффективнее, появляется чувство «мы» — начало сплочённости (cohesiveness)." }],
        },
        {
          who: "narrator",
          frame: "s07_key",
          text: "И только потом — performing: структура, иерархия и нормы на месте, группа зрелая и сосредоточена на цели.",
          terms: [{ term: "Performing", ru: "Зрелая группа: структура, иерархия и нормы на месте, все сосредоточены на целях." }],
        },
        { who: "arman", frame: "s07_c", text: "Теперь бюджет у нас под контролем." },
        { who: "mira", frame: "s07_d", text: "Дизайн стал лучше и проще." },
        { who: "dani", frame: "s07_e", text: "А разработка наконец двигается быстро." },
      ],
    },
    {
      id: "s08",
      title: "Demo Day",
      mood: "triumph",
      lines: [
        { who: "narrator", frame: "s08_a", text: "Demo Day." },
        { who: "ayat", frame: "s08_key", text: "QuickBite — это не просто приложение. Это проект, который научил нас принимать решения на основе данных." },
        { who: "sara", frame: "s08_b", text: "Вот так и выглядит настоящий project management." },
        {
          who: "narrator",
          frame: "s08_c",
          text: "А после Demo Day — последняя стадия, adjourning. Цели достигнуты, команда готовится разойтись — и немного грустит, что всё закончилось.",
          terms: [{ term: "Adjourning", ru: "Пятая стадия: цели достигнуты, группа готовится к роспуску; кому-то грустно терять общение и сплочённость." }],
        },
        { who: "narrator", frame: "s08_d", text: "Проектный успех — не случайность. Это cost control, earned value и зрелая команда." },
      ],
    },
  ],
  moral: "Project success = Cost Control + Smart Decisions + Teamwork",
};
