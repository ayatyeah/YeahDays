import type { Story } from "./types";

/*
 * «Возвращение Аяна» — финал сезона QuickBite, повторение лекций 4–8 Project
 * Management. Продолжение «ХроноЕрнара» (история 8): Ернар заключил сделку —
 * Сара жива, Дани остался, проект работает, — а Аяна стёрло из истории.
 *
 * Сюжет пользователя: в новой истории всё идеально, но Мира находит следы —
 * ничью чёрную толстовку с горой и стикер «Start with who and why» чужим
 * почерком. Она собирает ретро «чего нам не хватает»; каждая сцена ретро —
 * лекция, которую команда вспоминает (4, 5, 6, 7, 8), и каждое воспоминание
 * возвращает кусочек Аяна из золотой пыли. Аян возвращается. Ернар видит, что
 * общая память сильнее посоха, — и оказывается злодеем: он всю жизнь завидовал
 * Аяну. Драка на кулаках и терминах: Аян называет сильную сторону техники,
 * Ернар бьёт её ограничением — пока Аян не бьёт тем, у чего ограничений нет:
 * принципом лидерства. Аян поднимает посох: «Ернар, у тебя мысли были совсем
 * не как у проджект-менеджера», — Ернар исчезает. Вся команда вместе.
 * Эпилог: ночь, Ернар с чёрным посохом — «Ну и сволочь ты, человек-паук…»,
 * зловещий смех, портал. Fin — в moral.
 *
 * Герой теперь «Аян» (раньше «Аят»); id в cast остаётся ayat — по нему лежат
 * готовые голоса.
 *
 * Понятия на карточках (термин по-английски, пояснение по-русски), сверено с
 * конспектами l4–l8:
 * - l4: BCWS, BCWP, ACWP, CV = BCWP − ACWP, SV = BCWP − BCWS (пример со слайда
 *   1000/800/700); EVMS — early warning system; трудность — BCWP = (% complete)
 *   × BAC; пять стадий Forming → … → Adjourning; Informal groups (friendship).
 * - l5: Accountability = Authority + Responsibility; Matrix organization и
 *   Balanced matrix; Best of two worlds; матрица — самая сложная из всех форм.
 * - l6: Responding to change over following a plan; Management vs leadership;
 *   Agile triangle и его риск для заказчика (часть фич с низким приоритетом не
 *   будет поставлена); из 12 принципов руководства agile-проектами — 3 (Act for
 *   the simultaneous welfare of the team and the project), 8 (conflict as a
 *   positive step — о конфликте идей, не кулаков) и 9–10 (этика — часть мышления).
 * - l7: Sprint Retrospective; Scrum Team; Product Owner; Scrum pillars;
 *   Adaptation — труднее, когда люди не наделены полномочиями и не управляют
 *   собой сами.
 * - l8: User Story Format (WHO / WHAT / WHY); Personas: strengths / limitations;
 *   User Stories: strengths / limitations; Usage Considerations (у каждой
 *   техники Agile Extension to the BABOK Guide — Strengths и Limitations).
 * Воспоминания из стёртой истории (провал MegaMart, болезнь Сары) героям
 * «снятся» — в новой истории этого не было, но память осталась.
 */
export const pmFinaleStory: Story = {
  id: "pm-finale-ayan-returns",
  title: "Возвращение Аяна",
  subtitle:
    "Финал сезона. Аяна стёрли из истории, но команда помнит всё, чему научилась с ним, — и ХроноЕрнару придётся драться за свою сделку.",
  lecture: {
    eventId: "project-management-test-2",
    lectureId: "pm-l8",
    label: "Project Management · Финал сезона — повторение лекций 4–8",
  },
  cover: "s08_a",
  finale: true,
  // Голоса: voice — Gemini (про запас), eleven — ElevenLabs (русская библиотека голосов).
  cast: {
    narrator: {
      name: "Рассказчик",
      voice: "Charon",
      eleven: "ogi2DyUAKJb7CEdqqvlU",
    },
    ayat: {
      name: "Аян",
      role: "Product Owner",
      voice: "Puck",
      eleven: "gJEfHTTiifXEDmO687lC",
    },
    mira: {
      name: "Мира",
      role: "Scrum Master",
      voice: "Leda",
      eleven: "AB9XsbSA4eLG12t2myjN",
    },
    dani: {
      name: "Дани",
      role: "Developer",
      voice: "Fenrir",
      eleven: "kwajW3Xh5svCeKU5ky2S",
    },
    arman: {
      name: "Арман",
      role: "Developer",
      voice: "Iapetus",
      eleven: "rQOBu7YxCDxGiFdTm28w",
    },
    aliya: {
      name: "Алия",
      role: "Developer",
      voice: "Aoede",
      eleven: "dVRDrbP5ULGXB94se4KZ",
    },
    sara: {
      name: "Профессор Сара",
      role: "Mentor",
      voice: "Gacrux",
      eleven: "ymDCYd8puC7gYjxIamPt",
    },
    yernar: {
      name: "ХроноЕрнар",
      role: "Time Traveler",
      voice: "Orus",
      eleven: "txnCCHHGKmYIwrn7HfHQ",
    },
  },
  scenes: [
    {
      id: "s01",
      title: "Следы",
      stage: {
        plate: "office_day",
        cast: {
          sara: { x: 0.1, y: 1.3, h: 1.08, pose: "happy" },
          arman: { x: 0.23, y: 1.29, h: 1.1, pose: "idle" },
          mira: { x: 0.35, y: 1.32, h: 1.06, pose: "idle" },
          dani: { x: 0.47, y: 1.31, h: 1.1, pose: "idle" },
          aliya: { x: 0.59, y: 1.32, h: 1.06, pose: "idle" },
          ayat: {
            x: 0.78,
            y: 1.32,
            h: 1.13,
            pose: "talk",
            flip: true,
            level: 0,
          },
        },
      },
      mood: "calm",
      lines: [
        {
          who: "narrator",
          frame: "s01_a",
          act: { shot: "wide" },
          text: "История переписана. QuickBite работает с первой итерации. Сара жива. Дани никуда не ушёл. Всё идеально. Почти.",
        },
        {
          who: "mira",
          frame: "s01_b",
          act: { shot: "close:mira", pose: { mira: "worried" } },
          say: "[puzzled]",
          text: "Опять эта толстовка. Чёрная, с горой на груди. Чья? Никто не признаётся.",
        },
        {
          who: "dani",
          frame: "s01_c",
          act: { pose: { dani: "talk" } },
          say: "[uneasy]",
          text: "Не моя. Но почему-то пахнет нашей общагой с первого курса.",
        },
        {
          who: "mira",
          frame: "s01_d",
          act: { pose: { dani: "idle" } },
          say: "[quietly]",
          text: "И стикер на мониторе: «Start with who and why». Почерк ничей.",
        },
        {
          who: "aliya",
          frame: "s01_e",
          act: { pose: { aliya: "talk" } },
          say: "[sarcastic]",
          text: "Супер. У нас завелось привидение. Продуктовое.",
        },
        {
          who: "mira",
          frame: "s01_f",
          act: { pose: { mira: "talk", aliya: "idle" } },
          say: "[determined]",
          text: "Значит, ретро. Прямо сейчас. Тема — чего нам не хватает.",
          terms: [
            {
              term: "Sprint Retrospective",
              ru: "Последнее событие спринта: как повысить качество и эффективность. Команда разбирает людей, взаимодействие, процессы, инструменты и Definition of Done — и ищет допущения, которые сбили её с пути.",
            },
          ],
        },
      ],
    },
    {
      id: "s02",
      title: "Ретро: деньги и буря",
      stage: {
        plate: "office_day",
        cast: {
          sara: { x: 0.1, y: 1.3, h: 1.08, pose: "happy" },
          arman: { x: 0.23, y: 1.29, h: 1.1, pose: "idle" },
          mira: { x: 0.35, y: 1.32, h: 1.06, pose: "idle" },
          dani: { x: 0.47, y: 1.31, h: 1.1, pose: "idle" },
          aliya: { x: 0.59, y: 1.32, h: 1.06, pose: "idle" },
          ayat: {
            x: 0.78,
            y: 1.32,
            h: 1.13,
            pose: "talk",
            flip: true,
            level: 0,
          },
        },
      },
      mood: "smart",
      lines: [
        {
          who: "arman",
          frame: "s02_a",
          act: { pose: { arman: "talk" } },
          say: "[confidently]",
          text: "Начну я. Earned value помню наизусть: BCWS тысяча, BCWP восемьсот, ACWP семьсот. Under budget, behind schedule.",
          terms: [
            {
              term: "BCWS",
              full: "Budgeted Cost for Work Scheduled",
              ru: "Плановая стоимость работы, которая по графику должна быть сделана к этому дню. Planned value.",
            },
            {
              term: "BCWP",
              full: "Budgeted Cost for Work Performed",
              ru: "Плановая стоимость реально выполненной работы — earned value, освоенный объём.",
            },
            {
              term: "ACWP",
              full: "Actual Cost for Work Performed",
              ru: "Сколько фактически потратили на выполненную работу.",
            },
            {
              term: "CV = BCWP − ACWP",
              full: "Cost Variance",
              ru: "800 − 700 = +100: дешевле плана, under budget. Отрицательное CV — перерасход.",
            },
            {
              term: "SV = BCWP − BCWS",
              full: "Schedule Variance",
              ru: "800 − 1000 = −200: behind schedule. SV считают в деньгах или часах, а не в днях.",
            },
          ],
        },
        {
          who: "dani",
          frame: "s02_b",
          act: { pose: { dani: "talk", arman: "idle" } },
          say: "[slowly remembering]",
          text: "А в storming мы орали друг на друга. И кто-то сказал: «Давайте искать решение, а не виноватого».",
          terms: [
            {
              term: "Forming → Storming → Norming → Performing → Adjourning",
              ru: "Пятиэтапная модель развития группы: знакомство и нестрогие правила → конфликт, иерархия начинает складываться → начало сплочённости → зрелая группа → роспуск, когда цели достигнуты.",
            },
          ],
        },
        {
          who: "dani",
          frame: "s02_c",
          act: { shot: "close:dani" },
          say: "[voice breaking]",
          text: "У меня с первого курса есть друг. Friendship group — нас двое. Я… и кто?",
          terms: [
            {
              term: "Informal groups",
              full: "interest, friendship",
              ru: "Возникают сами, вокруг общих интересов и дружбы, а не по решению руководства: interest и friendship.",
            },
          ],
        },
        {
          who: "narrator",
          frame: "s02_d",
          act: {
            shot: "medium:ayat",
            pose: { dani: "idle" },
            fx: ["assemble:ayat:0.15"],
          },
          say: "[softly]",
          text: "Над пустым стулом кружится золотая пыль. Из неё складываются кеды.",
        },
      ],
    },
    {
      id: "s03",
      title: "Ретро: кто отвечает",
      stage: {
        plate: "office_day",
        cast: {
          sara: { x: 0.1, y: 1.3, h: 1.08, pose: "happy" },
          arman: { x: 0.23, y: 1.29, h: 1.1, pose: "idle" },
          mira: { x: 0.35, y: 1.32, h: 1.06, pose: "idle" },
          dani: { x: 0.47, y: 1.31, h: 1.1, pose: "idle" },
          aliya: { x: 0.59, y: 1.32, h: 1.06, pose: "idle" },
          ayat: {
            x: 0.78,
            y: 1.32,
            h: 1.13,
            pose: "talk",
            flip: true,
            level: 0.15,
          },
        },
      },
      mood: "strategy",
      lines: [
        {
          who: "mira",
          frame: "s03_a",
          act: { pose: { mira: "talk" } },
          text: "Green Bazaar. Мне дали проект — и полномочия. Accountability — это authority плюс responsibility.",
          terms: [
            {
              term: "Accountability = Authority + Responsibility",
              ru: "Подотчётность — отвечать за удовлетворительное выполнение задания. Она возможна, только когда есть и полномочия на окончательные решения (authority), и обязанность выполнить работу (responsibility).",
            },
          ],
        },
        {
          who: "dani",
          frame: "s03_b",
          act: { pose: { dani: "talk", mira: "idle" } },
          say: "[frowning]",
          text: "А в матрице Мира решала «что и когда», а я — «кто и как». Кто нас тогда так рассудил?",
          terms: [
            {
              term: "Matrix organization",
              ru: "Попытка совместить плюсы функциональной и проектной структур: менеджер проекта отвечает за успех проекта, функциональные отделы — за technical excellence.",
            },
            {
              term: "Balanced matrix",
              ru: "Влияние менеджера проекта и линейных менеджеров на ежедневную работу людей примерно равно: PM — что и когда, отдел — кто и как.",
            },
          ],
        },
        {
          who: "narrator",
          frame: "s03_c",
          act: {
            shot: "medium:ayat",
            pose: { dani: "idle" },
            fx: ["assemble:ayat:0.4"],
          },
          text: "Пыль поднимается выше: колени, ладони, рукава.",
        },
      ],
    },
    {
      id: "s04",
      title: "Ретро: манифест",
      stage: {
        plate: "office_day",
        cast: {
          sara: { x: 0.1, y: 1.3, h: 1.08, pose: "talk" },
          arman: { x: 0.23, y: 1.29, h: 1.1, pose: "idle" },
          mira: { x: 0.35, y: 1.32, h: 1.06, pose: "idle" },
          dani: { x: 0.47, y: 1.31, h: 1.1, pose: "idle" },
          aliya: { x: 0.59, y: 1.32, h: 1.06, pose: "idle" },
          ayat: {
            x: 0.78,
            y: 1.32,
            h: 1.13,
            pose: "talk",
            flip: true,
            level: 0.4,
          },
        },
      },
      mood: "calm",
      lines: [
        {
          who: "sara",
          frame: "s04_a",
          act: { shot: "medium:sara" },
          say: "[quietly]",
          text: "Мне снится студент, который хотел план на двести страниц. А я ему: responding to change over following a plan.",
          terms: [
            {
              term: "Responding to change over following a plan",
              ru: "Ценность Agile Manifesto: первоначальный план составляют, когда о проекте знают меньше всего, поэтому силы — на ответ неизбежным изменениям.",
            },
          ],
        },
        {
          who: "sara",
          frame: "s04_b",
          act: { shot: "close:sara" },
          say: "[warmly]",
          text: "А потом он сказал: «Я управлял задачами и сроками. А надо было — людьми и смыслом».",
          terms: [
            {
              term: "Management vs leadership",
              ru: "Management — механистический фокус: задачи, контроль, скорость. Leadership — гуманистический: люди и цель, полномочия и результативность.",
            },
          ],
        },
        {
          who: "arman",
          frame: "s04_c",
          act: {
            shot: "wide",
            pose: { arman: "talk", sara: "happy" },
            fx: ["assemble:ayat:0.65"],
          },
          say: "[whispering]",
          text: "Профессор… толстовка. Она сама ложится ему на плечи.",
        },
      ],
    },
    {
      id: "s05",
      title: "Ретро: дыра в Scrum Team",
      stage: {
        plate: "office_day",
        cast: {
          sara: { x: 0.1, y: 1.3, h: 1.08, pose: "happy" },
          arman: { x: 0.23, y: 1.29, h: 1.1, pose: "idle" },
          mira: { x: 0.35, y: 1.32, h: 1.06, pose: "idle" },
          dani: { x: 0.47, y: 1.31, h: 1.1, pose: "idle" },
          aliya: { x: 0.59, y: 1.32, h: 1.06, pose: "idle" },
          ayat: {
            x: 0.78,
            y: 1.32,
            h: 1.13,
            pose: "talk",
            flip: true,
            level: 0.65,
          },
        },
      },
      mood: "tension",
      lines: [
        {
          who: "aliya",
          frame: "s05_a",
          act: { pose: { aliya: "talk" } },
          text: "Ладно, Scrum по Guide. Scrum Team — один Scrum Master, один Product Owner и Developers.",
          terms: [
            {
              term: "Scrum Team",
              ru: "Один Scrum Master, один Product Owner и Developers; ни подкоманд, ни иерархий, одна цель за раз — Product Goal.",
            },
          ],
        },
        {
          who: "aliya",
          frame: "s05_b",
          act: { shot: "close:aliya" },
          say: "[alarmed]",
          text: "Scrum Master — Мира. Developers — мы. А Product Owner?.. Его нет. Кто тогда упорядочивает бэклог?!",
          terms: [
            {
              term: "Product Owner",
              ru: "Отвечает за максимальную ценность продукта и за Product Backlog: формулирует Product Goal, упорядочивает элементы бэклога. Один человек, не комитет.",
            },
          ],
        },
        {
          who: "arman",
          frame: "s05_c",
          act: { pose: { arman: "shout", aliya: "idle" } },
          say: "[stunned]",
          text: "«Порядок в бэклоге ставлю я, а не тот, кто громче орёт». Это ж про меня было! Кто это сказал?!",
        },
        {
          who: "mira",
          frame: "s05_d",
          act: {
            shot: "two:mira,ayat",
            pose: { mira: "worried", arman: "idle" },
            fx: ["assemble:ayat:0.85"],
          },
          say: "[whispering]",
          text: "У него появилось лицо… Я знаю это лицо.",
        },
      ],
    },
    {
      id: "s06",
      title: "Кто и зачем",
      stage: {
        plate: "office_day",
        cast: {
          sara: { x: 0.1, y: 1.3, h: 1.08, pose: "happy" },
          arman: { x: 0.23, y: 1.29, h: 1.1, pose: "idle" },
          mira: { x: 0.35, y: 1.32, h: 1.06, pose: "idle" },
          dani: { x: 0.47, y: 1.31, h: 1.1, pose: "idle" },
          aliya: { x: 0.59, y: 1.32, h: 1.06, pose: "idle" },
          ayat: {
            x: 0.78,
            y: 1.32,
            h: 1.13,
            pose: "talk",
            flip: true,
            level: 0.85,
          },
        },
      },
      mood: "hope",
      lines: [
        {
          who: "mira",
          frame: "s06_a",
          act: { pose: { mira: "talk" } },
          say: "[reading slowly]",
          text: "«Start with who and why». WHO — роль или персона. WHAT — фича. WHY — польза.",
          terms: [
            {
              term: "User Story Format",
              ru: "WHO — роль или персона, WHAT — действие или фича, WHY — польза или бизнес-ценность: «As a <role>, I need to <feature> so that <goal or value>». Обязательной структуры нет — это самый популярный формат.",
            },
          ],
        },
        {
          who: "mira",
          frame: "s06_b",
          act: { shot: "close:mira", pose: { mira: "worried" } },
          say: "[trembling]",
          text: "Мы все помним «что». Но «зачем» всегда спрашивал он…",
        },
        {
          who: "dani",
          frame: "s06_c",
          act: { shot: "close:dani", pose: { dani: "shout" }, fx: ["shake"] },
          say: "[shouting, crying]",
          text: "Аян! Его зовут Аян! Мой друг с первого курса!",
        },
        {
          who: "narrator",
          frame: "s06_d",
          act: {
            shot: "wide",
            pose: {
              mira: "happy",
              dani: "happy",
              arman: "happy",
              aliya: "happy",
              sara: "happy",
              ayat: "happy",
            },
            fx: ["assemble:ayat:1", "flash@2"],
          },
          text: "Имя — последний кусочек. Вспышка — и посреди ретро стоит Аян. В той самой толстовке.",
        },
        {
          who: "ayat",
          frame: "s06_e",
          act: { shot: "close:ayat" },
          say: "[breathless, laughing]",
          text: "Вы вспомнили… Без всякого посоха. Просто взяли и вспомнили.",
        },
      ],
    },
    {
      id: "s07",
      title: "Зависть",
      stage: {
        plate: "office_crack",
        light: [1.06, 0.9, 0.86],
        cast: {
          sara: { x: 0.07, y: 1.3, h: 1.08, pose: "happy" },
          arman: { x: 0.17, y: 1.29, h: 1.1, pose: "idle" },
          mira: { x: 0.27, y: 1.32, h: 1.06, pose: "idle" },
          dani: { x: 0.37, y: 1.31, h: 1.1, pose: "idle" },
          aliya: { x: 0.47, y: 1.32, h: 1.06, pose: "idle" },
          ayat: { x: 0.62, y: 1.32, h: 1.13, pose: "talk" },
          yernar: { x: 1.3, y: 1.32, h: 1.2, pose: "talk" },
        },
      },
      mood: "tension",
      lines: [
        {
          who: "narrator",
          frame: "s07_a",
          act: { shot: "wide", move: { yernar: 0.84 }, fx: ["shake"] },
          text: "Окно трескается красным светом. В офис шагает ХроноЕрнар.",
        },
        {
          who: "yernar",
          frame: "s07_b",
          act: { shot: "medium:yernar" },
          say: "[stunned, whispering]",
          text: "Я стёр тебя из самой истории. А их общая память… сильнее посоха?",
        },
        {
          who: "ayat",
          frame: "s07_c",
          act: { shot: "medium:ayat" },
          say: "[cold]",
          text: "Ты обещал: Сара жива, Дани остаётся. Ты же ради них старался, да?",
        },
        {
          who: "yernar",
          frame: "s07_d",
          act: {
            shot: "close:yernar",
            pose: { yernar: "angry" },
            fx: ["shake"],
          },
          say: "[bitter, then shouting]",
          text: "Ради них? Первая парта — Аян! Стартап — Аян! Друзья — у Аяна! А я — в подвале с хламом. Я стёр тебя ради себя!",
        },
        {
          who: "yernar",
          frame: "s07_e",
          act: {
            shot: "two:ayat,yernar",
            pose: { yernar: "fight", ayat: "fight" },
          },
          say: "[roaring]",
          text: "Посох не справился? Тогда руками!",
        },
        {
          who: "arman",
          frame: "s07_f",
          act: { pose: { arman: "shout" } },
          say: "[excited]",
          text: "Принцип восемь: конфликт — положительный шаг! Врежь ему, Аян!",
          terms: [
            {
              term: "Recognize team conflict as a positive step",
              ru: "Принцип 8 из 12 принципов руководства agile-проектами: лидер не подавляет конфликт в команде. Речь о здоровом конфликте идей — он ведёт к лучшим решениям.",
            },
          ],
        },
        {
          who: "aliya",
          frame: "s07_g",
          act: { pose: { aliya: "talk", arman: "idle" } },
          say: "[deadpan]",
          text: "Там про конфликт идей, Арман. Не кулаков.",
        },
      ],
    },
    {
      id: "s08",
      title: "Раунд первый",
      stage: {
        plate: "office_crack",
        mirror: true,
        light: [1.06, 0.9, 0.86],
        cast: {
          ayat: { x: 0.34, y: 1.32, h: 1.13, pose: "fight" },
          yernar: { x: 0.72, y: 1.32, h: 1.2, pose: "fight" },
        },
      },
      mood: "conflict",
      ambience:
        "office fistfight, fast punches and whooshes, chairs scraping and crashing, papers flying, faint crackle of a magic staff, no voices",
      lines: [
        {
          who: "ayat",
          frame: "s08_a",
          act: {
            shot: "two:ayat,yernar",
            pose: { ayat: "punch", yernar: "hurt" },
            fx: ["hit:ayat>yernar"],
          },
          say: "[shouting, punching]",
          text: "EVMS — раннее предупреждение! Мелкие отклонения правятся легко!",
          terms: [
            {
              term: "EVMS — early warning system",
              full: "Earned Value Measurement System",
              ru: "Профилактика выше лечения: тренды и отклонения от плана видны рано, курс правят малыми шагами. Малые отклонения исправить легче, чем большие.",
            },
          ],
        },
        {
          who: "yernar",
          frame: "s08_b",
          act: {
            pose: { yernar: "punch", ayat: "hurt" },
            fx: ["hit:yernar>ayat"],
          },
          say: "[grunting, hitting back]",
          text: "А процент готовности кто предскажет? BCWP — самое трудное!",
          terms: [
            {
              term: "BCWP = (% complete) × BAC",
              ru: "Трудность анализа отклонений — посчитать BCWP: приходится предсказывать процент готовности. Самая простая формула — доля готовности, умноженная на BAC.",
            },
          ],
        },
        {
          who: "ayat",
          frame: "s08_c",
          act: {
            pose: { ayat: "punch", yernar: "hurt" },
            fx: ["hit:ayat>yernar"],
          },
          say: "[shouting]",
          text: "Матрица — лучшее из двух миров!",
          terms: [
            {
              term: "Best of two worlds",
              ru: "Матрица — компромисс: в проектной структуре страдает технология, в функциональной жертвуют сроками; матрица хочет максимум технологии и результата экономно и в рамках сроков.",
            },
          ],
        },
        {
          who: "yernar",
          frame: "s08_d",
          act: {
            pose: { yernar: "punch", ayat: "hurt" },
            fx: ["hit:yernar>ayat"],
          },
          say: "[mocking]",
          text: "Самая сложная структура из всех! У каждого — два начальника!",
          terms: [
            {
              term: "Matrix: the most complex form",
              ru: "Матрица — самая сложная из всех организационных форм: человек числится в функциональном отделе и работает на проекты, то есть у него фактически два начальника. Нужны обучение, совместимые системы вознаграждения и чёткие роли.",
            },
          ],
        },
        {
          who: "ayat",
          frame: "s08_e",
          act: {
            pose: { ayat: "punch", yernar: "hurt" },
            fx: ["hit:ayat>yernar"],
          },
          say: "[punching]",
          text: "Agile-треугольник! Срок и деньги фиксированы — scope гибкий!",
          terms: [
            {
              term: "Agile triangle",
              full: "inverted triangle model",
              ru: "Agile-команды фиксируют стоимость и время и позволяют меняться объёму (scope) — по приоритету, так что самое ценное делается первым.",
            },
          ],
        },
        {
          who: "yernar",
          frame: "s08_f",
          act: {
            pose: { yernar: "punch", ayat: "hurt" },
            fx: ["hit:yernar>ayat"],
          },
          say: "[hitting hard]",
          text: "И часть фич клиент так и не получит!",
          terms: [
            {
              term: "Inverted triangle: risk for the customer",
              ru: "Риск для заказчика в agile-треугольнике: часть фич с низким приоритетом не будет поставлена. В традиционном треугольнике риск другой — опоздать или выйти за бюджет.",
            },
          ],
        },
        {
          who: "narrator",
          frame: "s08_g",
          act: {
            shot: "wide",
            pose: { ayat: "hurt", yernar: "fight" },
            move: { ayat: [0.14, 0.4, 0.3] },
            fx: ["stickers:0.08:0.42@0.6", "shake@0.6"],
          },
          say: "[fast, excited]",
          text: "Бам! Аян влетает в доску с бэклогом. Стикеры сыплются, как снег.",
        },
      ],
    },
    {
      id: "s09",
      title: "Раунд второй",
      stage: {
        plate: "office_crack",
        mirror: true,
        light: [1.06, 0.9, 0.86],
        cast: {
          ayat: { x: 0.14, y: 1.32, h: 1.13, pose: "hurt" },
          yernar: { x: 0.72, y: 1.32, h: 1.2, pose: "fight" },
        },
      },
      mood: "conflict",
      ambience:
        "office fistfight continues, heavy punches, a whiteboard crashing down, glass rattling, a magic staff humming louder and louder, no voices",
      lines: [
        {
          who: "ayat",
          frame: "s09_a",
          act: {
            shot: "two:ayat,yernar",
            pose: { ayat: "punch", yernar: "hurt" },
            move: { ayat: [0.34, 0.45] },
            fx: ["hit:ayat>yernar@0.35"],
          },
          say: "[getting up, furious]",
          text: "Scrum прост! Прозрачность, проверка, адаптация!",
          terms: [
            {
              term: "Scrum pillars",
              full: "transparency, inspection, adaptation",
              ru: "Три опоры эмпиризма: работа видна и тем, кто делает, и тем, кто получает; артефакты и прогресс часто проверяют; при отклонении подстраиваются как можно скорее.",
            },
          ],
        },
        {
          who: "yernar",
          frame: "s09_b",
          act: {
            pose: { yernar: "punch", ayat: "hurt" },
            fx: ["hit:yernar>ayat"],
          },
          say: "[sneering]",
          text: "А без полномочий и самоуправления твоя адаптация буксует!",
          terms: [
            {
              term: "Adaptation",
              ru: "Если процесс или продукт вышли за допустимые пределы — подстроиться как можно скорее. Адаптация труднее, когда люди не наделены полномочиями и не управляют собой сами.",
            },
          ],
        },
        {
          who: "ayat",
          frame: "s09_c",
          act: {
            pose: { ayat: "punch", yernar: "hurt" },
            fx: ["hit:ayat>yernar"],
          },
          say: "[punching]",
          text: "Персоны дают решению человеческое лицо!",
          terms: [
            {
              term: "Personas: strengths",
              ru: "Человеческое «лицо» фокусирует эмпатию; общее понимание требований разных групп — из них пишут user stories; фичи приоритизируют по нуждам персон; персоны мешают проецировать на решение свои ценности и предубеждения.",
            },
          ],
        },
        {
          who: "yernar",
          frame: "s09_d",
          act: {
            pose: { yernar: "punch", ayat: "hurt" },
            fx: ["hit:yernar>ayat"],
          },
          say: "[blocking, laughing]",
          text: "Выдуманное лицо! Средний юзер — решение для всех сразу!",
          terms: [
            {
              term: "Personas: limitations",
              ru: "Персоны выдуманы — тянет собрать «среднего» пользователя, неотличимого и нереалистичного, и решение, которое пытается быть всем для всех. Не замена живому пользователю, могут отдалить команду от людей; их надо регулярно пересматривать.",
            },
          ],
        },
        {
          who: "ayat",
          frame: "s09_e",
          act: {
            pose: { ayat: "punch", yernar: "hurt" },
            fx: ["hit:ayat>yernar"],
          },
          say: "[shouting]",
          text: "User stories — маленькие срезы! Быстрая поставка, частая обратная связь!",
          terms: [
            {
              term: "User Stories: strengths",
              ru: "Маленькие реализуемые и проверяемые срезы — быстрая поставка и частая обратная связь; понятны стейкхолдерам; писать учатся за минуты; совместная работа над ними строит commitment и общее понимание.",
            },
          ],
        },
        {
          who: "yernar",
          frame: "s09_f",
          act: {
            pose: { yernar: "punch", ayat: "hurt" },
            fx: ["hit:yernar>ayat"],
          },
          say: "[triumphant]",
          text: "И раздутый бэклог! Все видят WHAT — и забывают WHY!",
          terms: [
            {
              term: "User Stories: limitations",
              ru: "Много историй раздувают бэклог; дробление плодит новые — их надо упорядочивать, регулярно уточнять и приоритизировать; за отдельными историями теряют видение и roadmap; привычка смотреть на фичу (WHAT) и забывать ценность (WHY).",
            },
          ],
        },
        {
          who: "ayat",
          frame: "s09_g",
          act: { shot: "close:ayat", pose: { ayat: "talk", yernar: "fight" } },
          say: "[quietly, then firmly]",
          text: "А теперь не техника. Принцип: благо команды и проекта — одновременно.",
          terms: [
            {
              term: "Act for the simultaneous welfare of the team and the project",
              ru: "Принцип 3 из 12 принципов руководства agile-проектами: действовать одновременно во благо команды и проекта — не жертвовать людьми ради срока, а проектом ради комфорта.",
            },
          ],
        },
        {
          who: "yernar",
          frame: "s09_h",
          act: { shot: "close:yernar" },
          say: "[panicking]",
          text: "Где limitations?! У всего есть limitations!",
          terms: [
            {
              term: "Usage Considerations",
              ru: "Так в Agile Extension to the BABOK Guide описана каждая техника: Purpose → Description → Elements → Usage Considerations (Strengths и Limitations). Personas и User Stories — техники; принцип лидерства — нет.",
            },
          ],
        },
        {
          who: "ayat",
          frame: "s09_i",
          act: {
            shot: "two:ayat,yernar",
            pose: { ayat: "punch", yernar: "hurt" },
            fx: ["hit:ayat>yernar"],
          },
          say: "[shouting]",
          text: "Не у всего. А ты обменял человека на проект!",
        },
        {
          who: "narrator",
          frame: "s09_j",
          act: {
            shot: "wide",
            pose: { yernar: "down", ayat: "fight" },
            fx: ["shake"],
          },
          say: "[fast]",
          text: "Последний удар. Ернар валится на пол. Посох Времени катится к ногам Аяна.",
        },
      ],
    },
    {
      id: "s10",
      title: "Не как проджект-менеджер",
      stage: {
        plate: "office_day",
        cast: {
          sara: { x: 0.07, y: 1.3, h: 1.08, pose: "happy" },
          arman: { x: 0.17, y: 1.29, h: 1.1, pose: "idle" },
          mira: { x: 0.27, y: 1.32, h: 1.06, pose: "idle" },
          dani: { x: 0.37, y: 1.31, h: 1.1, pose: "idle" },
          aliya: { x: 0.47, y: 1.32, h: 1.06, pose: "idle" },
          ayat: { x: 0.62, y: 1.32, h: 1.13, pose: "staff" },
          yernar: { x: 0.84, y: 1.32, h: 1.2, pose: "down" },
        },
      },
      mood: "triumph",
      lines: [
        {
          who: "ayat",
          frame: "s10_a",
          act: { shot: "medium:ayat" },
          say: "[calmly, raising the staff]",
          text: "Ернар, у тебя мысли были совсем не как у проджект-менеджера.",
          terms: [
            {
              term: "Manage with an eye toward ethics",
              ru: "Принципы 9–10 руководства agile-проектами: управлять с оглядкой на этику и помнить, что этика — не запоздалая мысль, а неотъемлемая часть мышления (an integral part of our thinking).",
            },
          ],
        },
        {
          who: "narrator",
          frame: "s10_b",
          act: { shot: "wide", fx: ["flash", "vanish:yernar@0.8"] },
          say: "[quietly]",
          text: "Посох вспыхивает золотом. Ернар бледнеет, становится прозрачным — и исчезает совсем.",
        },
        {
          who: "sara",
          frame: "s10_c",
          act: { pose: { sara: "happy" } },
          say: "[warmly]",
          text: "С возвращением, Аян. Мы скучали, даже не зная по кому.",
        },
        {
          who: "dani",
          frame: "s10_d",
          act: { pose: { dani: "happy" } },
          say: "[laughing, emotional]",
          text: "Толстовку свою забери. Я её чуть не присвоил.",
        },
        {
          who: "aliya",
          frame: "s10_e",
          act: { pose: { aliya: "happy" } },
          say: "[teasing]",
          text: "Ещё раз пропадёшь — сама тебя сотру. Без посоха.",
        },
        {
          who: "arman",
          frame: "s10_f",
          act: { pose: { arman: "happy" } },
          say: "[relieved, joking]",
          text: "Product Owner на месте. Всё, теперь можно и шашлык.",
        },
        {
          who: "mira",
          frame: "s10_g",
          act: { pose: { mira: "happy" } },
          say: "[smiling through tears]",
          text: "Ретро закрыто. Чего нам не хватало — нашли.",
        },
        {
          who: "ayat",
          frame: "s10_h",
          act: { shot: "close:ayat", pose: { ayat: "happy" } },
          say: "[warmly]",
          text: "Начинаем с людей. С «кто» и «зачем». Все вместе.",
        },
      ],
    },
    {
      id: "s11",
      title: "Чёрный посох",
      stage: {
        plate: "street_night",
        portal: { x: 0.78, y: 0.55, r: 0.2 },
        cast: { yernar: { x: 0.45, y: 0.97, h: 0.78, pose: "dark" } },
      },
      mood: "tension",
      ambience:
        "dark empty street behind an office building at night, distant city traffic, cold wind, a low ominous hum, a magical portal crackling open, no voices",
      lines: [
        {
          who: "narrator",
          frame: "s11_a",
          act: { shot: "wide", fx: ["dark-in"] },
          say: "[quietly, ominous]",
          text: "Темнота. Ночь за офисом. Там стоит Ернар. В руке — посох. Чёрный.",
        },
        {
          who: "yernar",
          frame: "s11_b",
          act: { shot: "close:yernar" },
          say: "[sinister, low voice]",
          text: "Ну и сволочь ты, человек-паук…",
        },
        {
          who: "yernar",
          frame: "s11_c",
          act: {
            shot: "wide",
            pose: { yernar: "laugh" },
            move: { yernar: [0.78, 1.4, 2.4] },
            fx: ["portal", "vanish:yernar@3.2"],
          },
          say: "[sinister laughter]",
          text: "Ха-ха-ха-ха-ха…",
        },
      ],
    },
  ],
  moral: "Fin — remember: start with who and why",
};
