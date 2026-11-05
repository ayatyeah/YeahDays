import type { Lecture } from "../types";

/** Конспект и вопросы по темам лекции; учебные примеры заданий выделены отдельно. */
export const lecture1: Lecture = {
  "id": "rm-l1",
  "title": {
    "en": "Lecture 1 — Taking a leap into research",
    "ru": "Лекция 1 — Шаг в мир исследований"
  },
  "parts": [
    {
      "id": "rm-l1-p1",
      "title": {
        "en": "What research is — and what it is not",
        "ru": "Что такое исследование — и что им не является"
      },
      "notes": {
        "en": "## The myth and the reality\n**The myth:** research means reading Wikipedia, checking TechCrunch, scrolling Reddit or asking ChatGPT for a quick tech fact. That is **looking things up**: it collects what someone else already said and cannot tell you whether it is true.\n**The reality (Zina O'Leary, the course textbook):** research is a **systematic, creative and critical process** used to:\n- find **verifiable** answers to complex, **unsolved** questions;\n- solve real-world, **localized** computing and software problems;\n- build new, **credible and reproducible** knowledge.\n| Word | What it means | IT example |\n|---|---|---|\n| Systematic | planned, ordered, documented steps — not random browsing | the same load test is run on every option |\n| Creative | designing a question and a way to answer it; there is no ready recipe | inventing a way to measure an LLM's \"hallucination rate\" |\n| Critical | questioning sources, assumptions and your own results | asking on what hardware a benchmark graph was produced |\n| Verifiable | anyone can check the answer against the evidence | raw latency logs are published with the paper |\n| Localized | tied to a concrete context: these users, this system, this city | your legacy database under your traffic peaks |\n| Reproducible | another team following your documented steps gets the same result | scripts, versions and settings are all reported |\n> Research in one line: a **question**, answered by a **method**, with **evidence**, leading to a **conclusion** that others can check. Drop any of the four and you get a search, an opinion or a product — not research.",
        "ru": "## Миф и реальность\n**Миф:** исследование — это почитать Википедию, заглянуть в TechCrunch, полистать Reddit или спросить у ChatGPT быстрый технический факт. Это **поиск готового (looking things up)**: он собирает то, что кто-то уже сказал, и не может показать, правда ли это.\n**Реальность (Зина О'Лири, учебник курса):** исследование (research) — это **систематический, творческий и критический процесс (systematic, creative and critical process)**, который нужен, чтобы:\n- находить **проверяемые (verifiable)** ответы на сложные **нерешённые** вопросы;\n- решать реальные **локальные (localized)** задачи в вычислениях и разработке ПО;\n- создавать новое **достоверное и воспроизводимое (credible and reproducible)** знание.\n| Слово | Что означает | Пример из IT |\n|---|---|---|\n| Systematic (систематический) | спланированные, упорядоченные, задокументированные шаги — а не случайный сёрфинг | один и тот же нагрузочный тест запускают для каждого варианта |\n| Creative (творческий) | придумать вопрос и способ на него ответить; готового рецепта нет | придумать, как измерить «долю галлюцинаций» LLM |\n| Critical (критический) | сомневаться в источниках, допущениях и собственных результатах | спросить, на каком железе построен график бенчмарка |\n| Verifiable (проверяемый) | любой может сверить ответ с данными | сырые логи задержек опубликованы вместе со статьёй |\n| Localized (локальный) | привязан к конкретному контексту: эти пользователи, эта система, этот город | ваша старая база данных при ваших пиках трафика |\n| Reproducible (воспроизводимый) | другая команда по описанным шагам получает тот же результат | указаны скрипты, версии и настройки |\n> Исследование одной строкой: **вопрос**, на который отвечает **метод**, с **данными (evidence)**, ведущими к **выводу**, который могут проверить другие. Уберите любой из четырёх элементов — и получится поиск, мнение или продукт, но не исследование."
      },
      "questions": [
        {
          "q": "According to O'Leary, as quoted in the lecture, what is research?",
          "options": [
            "A systematic, creative and critical process",
            "A quick, reliable and thorough search for facts",
            "A neutral and complete summary of expert opinion",
            "A creative and fast way to confirm an idea"
          ],
          "answer": 0,
          "why": {
            "en": "O'Leary: research is a systematic, creative and critical process used to find verifiable answers, solve localized problems and build credible, reproducible knowledge.",
            "ru": "О'Лири: исследование — систематический, творческий и критический процесс, чтобы находить проверяемые ответы, решать локальные задачи и создавать достоверное воспроизводимое знание."
          },
          "wrong": [
            {
              "en": "Searching for facts that already exist is exactly the myth the lecture rejects; research produces new, verifiable knowledge.",
              "ru": "Поиск уже существующих фактов — это как раз миф, который отвергает лекция; исследование создаёт новое проверяемое знание."
            },
            {
              "en": "Summarising what experts think adds no method and no evidence of your own.",
              "ru": "Пересказ мнений экспертов не добавляет ни метода, ни собственных данных."
            },
            {
              "en": "Research is not there to confirm an idea you already hold; it must stay critical and open to the data.",
              "ru": "Исследование нужно не для того, чтобы подтвердить уже имеющуюся идею: оно остаётся критичным и открытым данным."
            }
          ],
          "id": "rm-l1-p1-1"
        },
        {
          "q": "A student says: \"I researched it — I read three Reddit threads and asked ChatGPT.\" Why is this not research in the course's sense?",
          "options": [
            "No method, and the answer cannot be verified",
            "Reddit and ChatGPT are banned by the course rules",
            "Three sources are too few; ten would be enough",
            "Research may use only printed books and journals"
          ],
          "answer": 0,
          "why": {
            "en": "Looking things up collects what others have said. Research needs a systematic method and evidence that others can check — that is the lecture's myth vs reality.",
            "ru": "Поиск готового собирает то, что сказали другие. Исследованию нужны систематический метод и данные, которые могут проверить другие, — в этом и разница «миф и реальность»."
          },
          "wrong": [
            {
              "en": "Nothing is banned here; the activity simply has no systematic method and no checkable evidence.",
              "ru": "Ничего не запрещено: просто у такого занятия нет систематического метода и проверяемых данных."
            },
            {
              "en": "More look-ups are still look-ups — the number of sources does not create a method.",
              "ru": "Больше поисков — всё равно поиски: число источников не создаёт метода."
            },
            {
              "en": "Online sources are fine when credible; the problem is the missing method, not the medium.",
              "ru": "Онлайн-источники допустимы, если достоверны; проблема в отсутствии метода, а не в носителе."
            }
          ],
          "id": "rm-l1-p1-2"
        },
        {
          "q": "What makes the Java-vs-Rust benchmark a controlled experiment?",
          "options": [
            "Same load, hardware and database for both services",
            "The team decides in advance which result to publish",
            "It is run by the most senior engineer on the team",
            "It records several metrics rather than only latency"
          ],
          "answer": 0,
          "why": {
            "en": "Control = everything is held equal except the compared factor, so differences in CPU, RAM and latency can be attributed to the language, not to the setup.",
            "ru": "Контроль — всё одинаково, кроме сравниваемого фактора; тогда разницу в CPU, RAM и задержке можно приписать языку, а не окружению."
          },
          "wrong": [
            {
              "en": "Choosing what to publish is selective reporting, not experimental control.",
              "ru": "Выбирать, что публиковать, — это выборочная отчётность, а не контроль эксперимента."
            },
            {
              "en": "Seniority controls nothing; equal conditions do.",
              "ru": "Старшинство ничего не контролирует; контролируют одинаковые условия."
            },
            {
              "en": "Several metrics are useful, but control means that only the language differs.",
              "ru": "Несколько метрик полезны, но контроль означает, что различается только язык."
            }
          ],
          "id": "rm-l1-p1-4"
        },
        {
          "q": "Which data would give the team an evidence-based answer about performance under 100,000 requests/sec?",
          "options": [
            "CPU use, RAM overhead and latency measured under that load",
            "GitHub stars, download counts and release frequency",
            "Lines of code, build time and binary size of each service",
            "Opinions of five senior developers from other companies"
          ],
          "answer": 0,
          "why": {
            "en": "The lecture's benchmark collects empirical data on CPU utilization, RAM overhead and latency (ms) under a simulated load of 100,000 requests/sec.",
            "ru": "Бенчмарк из лекции собирает эмпирические данные о загрузке CPU, расходе RAM и задержке (мс) при имитации 100 000 запросов в секунду."
          },
          "wrong": [
            {
              "en": "These measure popularity, not how the service behaves under load.",
              "ru": "Это показатели популярности, а не поведения сервиса под нагрузкой."
            },
            {
              "en": "These are development properties, not runtime behaviour under traffic.",
              "ru": "Это свойства разработки, а не поведения во время работы под трафиком."
            },
            {
              "en": "Opinions are not empirical data about their system.",
              "ru": "Мнения — не эмпирические данные об их системе."
            }
          ],
          "id": "rm-l1-p1-5"
        },
        {
          "q": "A prototype becomes a research output as soon as it contains an innovative feature.",
          "options": [
            "True",
            "False"
          ],
          "answer": 1,
          "fixed": true,
          "why": {
            "en": "Innovation makes a better product, not knowledge. The prototype stays a development output; only the findings of evaluating it — with a question, method and data — are research output.",
            "ru": "Новизна делает продукт лучше, но не создаёт знания. Прототип остаётся development output; research output — только выводы его проверки с вопросом, методом и данными."
          },
          "wrong": [
            {
              "en": "\"True\" confuses a novel artifact with new knowledge: nothing has been asked or measured yet.",
              "ru": "«Верно» путает новый артефакт с новым знанием: пока ничего не спрошено и не измерено."
            }
          ],
          "id": "rm-l1-p1-9"
        },
        {
          "q": "When does building an app become part of a research project?",
          "options": [
            "When the app is used as an instrument to answer a question",
            "When the app gains enough active users to attract investors",
            "When the full source code is published openly on GitHub",
            "When the app relies on AI or another advanced technology"
          ],
          "answer": 0,
          "why": {
            "en": "One project can contain both: the app is built (development) and then evaluated systematically; the findings of that evaluation are the research output.",
            "ru": "В одном проекте может быть и то и другое: приложение создают (разработка), затем систематически проверяют; выводы этой проверки — research output."
          },
          "wrong": [
            {
              "en": "Popularity is not evidence; with no question and no analysis there is no research.",
              "ru": "Популярность — не доказательство; без вопроса и анализа исследования нет."
            },
            {
              "en": "Open code helps reproducibility, but the code itself is still a development output.",
              "ru": "Открытый код помогает воспроизводимости, но сам код — всё равно development output."
            },
            {
              "en": "The technology level is irrelevant; the question, method and evidence are what count.",
              "ru": "Уровень технологии неважен; важны вопрос, метод и данные."
            }
          ],
          "id": "rm-l1-p1-10"
        },
        {
          "q": "What does \"verifiable\" mean in the definition of research?",
          "options": [
            "Others can check the answer against the evidence",
            "A well-known expert has approved the answer publicly",
            "The answer is repeated by several popular websites",
            "The answer can never turn out to be wrong later"
          ],
          "answer": 0,
          "why": {
            "en": "Verifiable = anyone can compare the answer with the evidence (data, logs, documented method) and see whether it holds.",
            "ru": "Проверяемый — любой может сверить ответ с данными (измерения, логи, описанный метод) и убедиться, держится ли он."
          },
          "wrong": [
            {
              "en": "Authority is not verification; evidence that others can inspect is.",
              "ru": "Авторитет — не проверка; проверка — это данные, которые могут изучить другие."
            },
            {
              "en": "Repetition is not verification — many sites may copy one unchecked claim.",
              "ru": "Повторение — не проверка: многие сайты могут копировать одно непроверенное утверждение."
            },
            {
              "en": "The opposite: a verifiable answer is exposed to checking and could fail it.",
              "ru": "Наоборот: проверяемый ответ открыт для проверки и может её не пройти."
            }
          ],
          "id": "rm-l1-p1-11"
        },
        {
          "q": "Which sequence shows the core logic of research?",
          "options": [
            "Question → method → evidence → conclusion",
            "Conclusion → evidence → method → question",
            "Method → question → conclusion → evidence",
            "Evidence → conclusion → question → method"
          ],
          "answer": 0,
          "why": {
            "en": "A question comes first, a method is chosen to answer it, evidence is collected, and the conclusion follows from the evidence.",
            "ru": "Сначала вопрос, затем метод для ответа на него, потом данные, и вывод следует из данных."
          },
          "wrong": [
            {
              "en": "Starting from the conclusion and then looking for support is confirmation, not research.",
              "ru": "Начинать с вывода и потом искать подтверждения — это подгонка, а не исследование."
            },
            {
              "en": "A method is chosen to fit a question, and a conclusion must follow the evidence, not precede it.",
              "ru": "Метод выбирают под вопрос, а вывод следует из данных, а не опережает их."
            },
            {
              "en": "Data collected without a question gives no direction for analysis.",
              "ru": "Данные, собранные без вопроса, не дают направления для анализа."
            }
          ],
          "id": "rm-l1-p1-13"
        },
        {
          "q": "Which statement about research and development is accurate?",
          "options": [
            "One project can contain both: build an app, then test its effect",
            "They are the same thing, since any coding project is research",
            "Research never involves building any software or prototype",
            "Development is simply the later, more advanced stage of research"
          ],
          "answer": 0,
          "why": {
            "en": "Development and research differ in goal and output, but they often live in one project: the prototype is development, the evaluation findings are research.",
            "ru": "Разработка и исследование различаются целью и результатом, но часто живут в одном проекте: прототип — разработка, выводы проверки — исследование."
          },
          "wrong": [
            {
              "en": "Coding builds artifacts; research produces knowledge.",
              "ru": "Программирование создаёт артефакты; исследование создаёт знание."
            },
            {
              "en": "Researchers often build prototypes or tools as instruments for a study.",
              "ru": "Исследователи часто создают прототипы или инструменты для своего исследования."
            },
            {
              "en": "Development is a different activity with a different output, not a stage of research.",
              "ru": "Разработка — другая деятельность с другим результатом, а не этап исследования."
            }
          ],
          "id": "rm-l1-p1-14"
        },
        {
          "q": "Which of these is NOT one of the three purposes of research named in the lecture?",
          "options": [
            "To confirm a decision the team has already made",
            "To find verifiable answers to complex, unsolved questions",
            "To solve real-world, localized computing problems",
            "To build new, credible and reproducible knowledge"
          ],
          "answer": 0,
          "why": {
            "en": "Research is not a tool for justifying a decision already taken — that is confirmation bias. The three purposes: verifiable answers, localized problems, credible and reproducible knowledge.",
            "ru": "Исследование — не способ оправдать уже принятое решение: это предвзятость подтверждения. Три цели: проверяемые ответы, локальные задачи, достоверное и воспроизводимое знание."
          },
          "wrong": [
            {
              "en": "This is purpose 1 in the lecture.",
              "ru": "Это первая цель из лекции."
            },
            {
              "en": "This is purpose 2 in the lecture.",
              "ru": "Это вторая цель из лекции."
            },
            {
              "en": "This is purpose 3 in the lecture.",
              "ru": "Это третья цель из лекции."
            }
          ],
          "id": "rm-l1-p1-15"
        },
        {
          "q": "What does \"reproducible\" knowledge require from the researcher?",
          "options": [
            "Steps documented so another team can repeat the result",
            "A result the same team managed to get once on a good day",
            "A result confirmed by asking several AI assistants",
            "Private scripts, so that nobody else can copy the work"
          ],
          "answer": 0,
          "why": {
            "en": "Reproducible = another team following your documented steps (versions, settings, data, scripts) obtains the same result.",
            "ru": "Воспроизводимый — другая команда по вашим описанным шагам (версии, настройки, данные, скрипты) получает тот же результат."
          },
          "wrong": [
            {
              "en": "One lucky run by the same team is not reproduction.",
              "ru": "Один удачный запуск той же командой — не воспроизведение."
            },
            {
              "en": "Agreement of chatbots is not reproduction; independently repeating the method is.",
              "ru": "Согласие чат-ботов — не воспроизведение; воспроизведение — независимый повтор метода."
            },
            {
              "en": "Hiding the method makes reproduction impossible.",
              "ru": "Скрытый метод делает воспроизведение невозможным."
            }
          ],
          "id": "rm-l1-p1-16"
        },
        {
          "q": "The syllabus calls research an \"opportunity for situation improvement\". What does that mean?",
          "options": [
            "A well-answered question can change a real system or practice",
            "Research is mainly a way for students to raise their grades",
            "Research should always end with a new commercial product",
            "Research counts only when it solves the whole problem at once"
          ],
          "answer": 0,
          "why": {
            "en": "Research is both a challenge (resources, method, discipline) and an opportunity: credible answers can improve a real system, team or policy.",
            "ru": "Исследование — одновременно вызов (ресурсы, метод, дисциплина) и возможность: достоверные ответы могут улучшить реальную систему, команду или правила."
          },
          "wrong": [
            {
              "en": "Grades are a course matter; the phrase is about improving real situations.",
              "ru": "Оценки — вопрос курса; фраза — об улучшении реальных ситуаций."
            },
            {
              "en": "A product is development or commercialization; research output is knowledge that can inform change.",
              "ru": "Продукт — это разработка или коммерция; research output — знание, на основе которого можно что-то менять."
            },
            {
              "en": "Partial or negative answers can still guide improvement.",
              "ru": "Частичные или отрицательные ответы тоже помогают улучшениям."
            }
          ],
          "id": "rm-l1-p1-17"
        },
        {
          "q": "Which activity shows the creative side of research?",
          "options": [
            "Designing a new way to measure an LLM's hallucination rate",
            "Repeating a published benchmark exactly as the paper describes",
            "Copying the conclusion of a highly cited paper word for word",
            "Choosing the language that the team personally likes most"
          ],
          "answer": 0,
          "why": {
            "en": "There is no ready recipe for most real questions: inventing a way to make a vague idea (hallucination) measurable is the creative part of research.",
            "ru": "Для большинства реальных вопросов нет готового рецепта: придумать, как сделать измеримой расплывчатую идею (галлюцинации), — творческая часть исследования."
          },
          "wrong": [
            {
              "en": "Exact repetition is reproduction — valuable rigor, but not the creative design of a study.",
              "ru": "Точный повтор — это воспроизведение: ценная строгость, но не творческое построение исследования."
            },
            {
              "en": "Copying without attribution is plagiarism, not creativity.",
              "ru": "Копирование без ссылки — плагиат, а не творчество."
            },
            {
              "en": "Personal preference is intuition, not research design.",
              "ru": "Личное предпочтение — интуиция, а не дизайн исследования."
            }
          ],
          "id": "rm-l1-p1-18"
        },
        {
          "q": "A hunch may start a research question, but the final decision must rest on measured evidence.",
          "options": [
            "True",
            "False"
          ],
          "answer": 0,
          "fixed": true,
          "why": {
            "en": "Intuition (\"Rust might be faster\") is a fine starting point for a question; the benchmark then decides with data.",
            "ru": "Интуиция («может, Rust быстрее») — нормальная отправная точка для вопроса; решает потом бенчмарк, по данным."
          },
          "wrong": [
            {
              "en": "\"False\" would mean either that hunches are forbidden or that they can replace evidence — the lecture says neither.",
              "ru": "«Неверно» означало бы, что догадки запрещены или что они могут заменить данные, — лекция не говорит ни того, ни другого."
            }
          ],
          "id": "rm-l1-p1-20"
        }
      ]
    },
    {
      "id": "rm-l1-p2",
      "title": {
        "en": "The researcher's mindset: skepticism, rigor, open-mindedness",
        "ru": "Мышление исследователя: скептицизм, строгость, открытость"
      },
      "notes": {
        "en": "## Three habits of a researcher\nTo move from a **tech consumer** (who believes what is popular) to a **scientific researcher** (who believes what is shown), the lecture names three core habits.\n| Habit | What you do | Anti-pattern |\n|---|---|---|\n| **Critical skepticism** | ask how a result was obtained before accepting it | trusting a benchmark graph because the repo has many stars |\n| **Methodological rigor** | document every step so another engineer can reproduce the result | \"it was faster on my laptop\" — no versions, no settings |\n| **Open-mindedness** | accept that data may prove your favourite tool or theory wrong | calling the test \"broken\" because your framework lost |\nMnemonic **S-R-O**: **S**keptical about other people's claims, **R**igorous about your own work, **O**pen to being wrong.\n## Critical skepticism: interrogate every claim\nDo not trust data or benchmark graphs in GitHub repositories blindly. Always examine:\n- **Methodology** — what exactly was measured, how, with which versions and settings, how many repetitions, with or without warm-up?\n- **Hardware constraints** — on what CPU, RAM, disk or cloud instance? A result from a gaming laptop may not hold on a 2-vCPU server.\n- **Sample size** — one run, ten runs, a thousand users? One run or five friends is an **anecdote**, not evidence.\nAlso ask **who** produced the result (a vendor benchmarking its own product has an interest) and whether the comparison is **fair** (a tuned configuration against a default one is not).\n> Skepticism is not cynicism. A cynic says \"everything is fake\"; a skeptic says \"not accepted *yet* — show me how it was measured\". A well-documented result should be accepted.",
        "ru": "## Три привычки исследователя\nЧтобы из **потребителя технологий (tech consumer)**, который верит в популярное, стать **исследователем**, который верит в показанное, лекция называет три ключевые привычки.\n| Привычка | Что делать | Антипример |\n|---|---|---|\n| **Critical skepticism (критический скептицизм)** | спрашивать, как получен результат, прежде чем его принять | верить графику бенчмарка, потому что у репозитория много звёзд |\n| **Methodological rigor (методологическая строгость)** | документировать каждый шаг, чтобы другой инженер мог воспроизвести результат | «у меня на ноутбуке было быстрее» — без версий и настроек |\n| **Open-mindedness (открытость)** | признавать, что данные могут опровергнуть любимый инструмент или теорию | объявить тест «сломанным», потому что любимый фреймворк проиграл |\nМнемоника **S-R-O**: **S**keptical — скептичность к чужим утверждениям, **R**igorous — строгость к своей работе, **O**pen — готовность оказаться неправым.\n## Критический скептицизм: допрашивать каждое утверждение\nНе стоит вслепую доверять данным и графикам бенчмарков в репозиториях GitHub. Всегда проверяется:\n- **Методология** — что именно измеряли, как, на каких версиях и настройках, сколько повторов, был ли прогрев?\n- **Ограничения железа** — какой CPU, RAM, диск или облачный инстанс? Результат с игрового ноутбука может не подтвердиться на сервере с 2 vCPU.\n- **Размер выборки** — один запуск, десять, тысяча пользователей? Один запуск или пятеро друзей — это **случай (anecdote)**, а не доказательство.\nЕщё стоит спросить, **кто** получил результат (вендор, тестирующий свой продукт, заинтересован), и **честно ли** сравнение (настроенная конфигурация против конфигурации по умолчанию — нечестно).\n> Скептицизм — не цинизм. Циник говорит «всё фальшивка»; скептик говорит «пока *не* принято — покажите, как измеряли». Хорошо задокументированный результат стоит принять."
      },
      "questions": [
        {
          "q": "Before adopting a library, a team checks how its published benchmark was run, on what hardware and with how many runs. Which habit is this?",
          "options": [
            "Critical skepticism",
            "Methodological rigor",
            "Open-mindedness",
            "Confirmation bias"
          ],
          "answer": 0,
          "why": {
            "en": "Critical skepticism: do not trust benchmark graphs blindly — examine the methodology, the hardware constraints and the sample size.",
            "ru": "Критический скептицизм: не верить графикам бенчмарков вслепую — проверять методологию, ограничения железа и размер выборки."
          },
          "wrong": [
            {
              "en": "Rigor is about documenting your own work so others can reproduce it; here the team evaluates someone else's claim.",
              "ru": "Строгость — это документировать собственную работу для воспроизведения; здесь же команда оценивает чужое утверждение."
            },
            {
              "en": "Open-mindedness is readiness to be proven wrong by data, not checking other people's methods.",
              "ru": "Открытость — готовность признать, что данные опровергли вас, а не проверка чужих методов."
            },
            {
              "en": "Confirmation bias is seeking only supporting evidence — the opposite of careful checking.",
              "ru": "Предвзятость подтверждения — поиск только подтверждающих данных, противоположность тщательной проверке."
            }
          ],
          "id": "rm-l1-p2-1"
        },
        {
          "q": "An engineer records library versions, server type, dataset, scripts and the number of runs for every test. Which habit is this?",
          "options": [
            "Methodological rigor",
            "Critical skepticism",
            "Open-mindedness",
            "Systematic skepticism"
          ],
          "answer": 0,
          "why": {
            "en": "Methodological rigor: document every step of development, testing and data collection transparently so that any other engineer can reproduce the result.",
            "ru": "Методологическая строгость: прозрачно документировать каждый шаг разработки, тестирования и сбора данных, чтобы любой инженер мог воспроизвести результат."
          },
          "wrong": [
            {
              "en": "Skepticism targets other people's claims; this is about making one's own work reproducible.",
              "ru": "Скептицизм направлен на чужие утверждения; здесь речь о воспроизводимости собственной работы."
            },
            {
              "en": "Open-mindedness concerns accepting unwelcome results, not documentation.",
              "ru": "Открытость — про принятие неудобных результатов, а не про документацию."
            },
            {
              "en": "There is no such habit in the lecture; documenting your own steps is rigor.",
              "ru": "Такой привычки в лекции нет; документирование своих шагов — это строгость."
            }
          ],
          "id": "rm-l1-p2-2"
        },
        {
          "q": "Benchmarks show the team's favourite framework is slower, and the lead says: \"The test must be wrong — our framework is the best.\" Which habit is missing?",
          "options": [
            "Open-mindedness",
            "Methodological rigor",
            "Critical skepticism",
            "Creative thinking"
          ],
          "answer": 0,
          "why": {
            "en": "Open-mindedness: be fully prepared for empirical data to prove your favourite framework, library or theory wrong.",
            "ru": "Открытость: быть готовым к тому, что эмпирические данные опровергнут любимый фреймворк, библиотеку или теорию."
          },
          "wrong": [
            {
              "en": "The test may be perfectly rigorous; the problem is refusing to accept its result.",
              "ru": "Тест может быть вполне строгим; проблема — в отказе принять его результат."
            },
            {
              "en": "Skepticism would need a methodological reason to doubt the test; \"we lost\" is not one.",
              "ru": "Скептицизму нужна методологическая причина сомневаться в тесте; «мы проиграли» — не причина."
            },
            {
              "en": "Creativity is about designing studies, not about accepting their results.",
              "ru": "Творчество — про построение исследований, а не про принятие их результатов."
            }
          ],
          "id": "rm-l1-p2-3"
        },
        {
          "q": "What is the main reason \"The app will definitely reduce accidents\" is not a hypothesis?",
          "options": [
            "It asserts certainty and names no measurable comparison",
            "It is written about the future instead of the past",
            "It mentions accidents, which researchers cannot study",
            "It is too short; hypotheses need at least two sentences"
          ],
          "answer": 0,
          "why": {
            "en": "A hypothesis is tentative and falsifiable and names measurable variables (e.g. speeding events per 100 km, with vs without alerts). \"Definitely\" closes the question before any data.",
            "ru": "Гипотеза предположительна, опровержима и называет измеримые переменные (например, превышения на 100 км с оповещениями и без). «Точно» закрывает вопрос до всяких данных."
          },
          "wrong": [
            {
              "en": "Hypotheses usually are predictions about the future; tense is not the issue.",
              "ru": "Гипотезы обычно и есть прогнозы на будущее; время глагола ни при чём."
            },
            {
              "en": "Accidents can be studied with proper data; the problems are certainty and vagueness.",
              "ru": "Аварии можно изучать при нужных данных; проблема в уверенности и расплывчатости."
            },
            {
              "en": "Length is not a criterion — testability is.",
              "ru": "Длина не критерий — критерий проверяемость."
            }
          ],
          "id": "rm-l1-p2-6"
        },
        {
          "q": "A GitHub README shows framework X is \"5x faster\", measured in one run on the author's laptop. What is the biggest methodological weakness?",
          "options": [
            "One run on one laptop says little about other systems",
            "The chart should have used a logarithmic scale for speed",
            "Frameworks can never be compared fairly by speed at all",
            "The author is not a well-known programmer with many stars"
          ],
          "answer": 0,
          "why": {
            "en": "Skepticism checks methodology, hardware constraints and sample size: a single run on a laptop is an anecdote that may not hold on a server.",
            "ru": "Скептицизм проверяет методологию, ограничения железа и размер выборки: один запуск на ноутбуке — случай, который может не подтвердиться на сервере."
          },
          "wrong": [
            {
              "en": "A presentation detail; it does not fix how the data were obtained.",
              "ru": "Деталь оформления; она не исправляет то, как получены данные."
            },
            {
              "en": "They can — with equal conditions, repeated runs and stated hardware.",
              "ru": "Можно — при одинаковых условиях, повторных запусках и указанном железе."
            },
            {
              "en": "Authority is not the issue; method, hardware and sample size are.",
              "ru": "Дело не в авторитете, а в методе, железе и размере выборки."
            }
          ],
          "id": "rm-l1-p2-8"
        },
        {
          "q": "Being critically skeptical means rejecting every published benchmark.",
          "options": [
            "True",
            "False"
          ],
          "answer": 1,
          "fixed": true,
          "why": {
            "en": "Skepticism suspends acceptance until the methodology, hardware and sample size are checked; a well-documented result is then accepted. Rejecting everything is cynicism.",
            "ru": "Скептицизм откладывает принятие, пока не проверены методология, железо и размер выборки; хорошо задокументированный результат затем принимается. Отвергать всё подряд — цинизм."
          },
          "wrong": [
            {
              "en": "\"True\" confuses skepticism with cynicism: a cynic dismisses all evidence, a skeptic weighs it.",
              "ru": "«Верно» путает скептицизм с цинизмом: циник отметает любые данные, скептик их взвешивает."
            }
          ],
          "id": "rm-l1-p2-9"
        },
        {
          "q": "A bank wants an LLM to give investment advice. How can its hallucination rate be measured before launch?",
          "options": [
            "Run it on questions with expert-verified answers and count errors",
            "Ask the model to rate its own confidence in every single answer",
            "Count the customer complaints received in the first month after launch",
            "Compare its average answer length with that of a rival chatbot"
          ],
          "answer": 0,
          "why": {
            "en": "Error (hallucination) rate = (wrong + fabricated answers) / total test questions, measured on a test set with verified answers.",
            "ru": "Доля ошибок (галлюцинаций) = (неверные + выдуманные ответы) / все тестовые вопросы на наборе с проверенными ответами."
          },
          "wrong": [
            {
              "en": "Self-reported confidence is not ground truth; an LLM can be confidently wrong.",
              "ru": "Самооценка уверенности — не эталон; LLM бывает уверенно неправа."
            },
            {
              "en": "That measures after the harm is done, and complaints undercount errors.",
              "ru": "Это измерение уже после вреда, к тому же жалобы учитывают не все ошибки."
            },
            {
              "en": "Length says nothing about correctness.",
              "ru": "Длина ответа ничего не говорит о его правильности."
            }
          ],
          "id": "rm-l1-p2-10"
        },
        {
          "q": "On 400 finance questions with verified answers, the LLM gives 22 wrong and 6 fabricated answers. What is its hallucination (error) rate?",
          "options": [
            "7%",
            "5.5%",
            "1.5%",
            "28%"
          ],
          "answer": 0,
          "why": {
            "en": "(22 + 6) / 400 = 28 / 400 = 0.07 = 7%.",
            "ru": "(22 + 6) / 400 = 28 / 400 = 0,07 = 7%."
          },
          "wrong": [
            {
              "en": "This counts only the 22 wrong answers (22/400) and ignores the 6 fabricated ones.",
              "ru": "Здесь учтены только 22 неверных ответа (22/400), а 6 выдуманных пропущены."
            },
            {
              "en": "This counts only the 6 fabricated answers (6/400).",
              "ru": "Здесь учтены только 6 выдуманных ответов (6/400)."
            },
            {
              "en": "28 is the number of bad answers, not their share of 400.",
              "ru": "28 — это число плохих ответов, а не их доля от 400."
            }
          ],
          "id": "rm-l1-p2-11"
        },
        {
          "q": "A team finds that its new caching layer gives no measurable speed-up. How should a researcher treat this result?",
          "options": [
            "As valid knowledge worth reporting",
            "As a failed study that should be deleted",
            "As a sign to rerun until a speed-up appears",
            "As proof that the measuring tools were broken"
          ],
          "answer": 0,
          "why": {
            "en": "Open-mindedness: a carefully measured \"no difference\" is knowledge — it saves others from the same wrong bet.",
            "ru": "Открытость: аккуратно измеренное «разницы нет» — тоже знание; оно уберегает других от той же ошибочной ставки."
          },
          "wrong": [
            {
              "en": "Deleting null results distorts the record and wastes other people's effort.",
              "ru": "Удаление нулевых результатов искажает картину и заставляет других тратить силы впустую."
            },
            {
              "en": "Rerunning until the wanted result appears is fishing for results — bias.",
              "ru": "Перезапускать, пока не выйдет нужный результат, — подгонка, то есть предвзятость."
            },
            {
              "en": "Without evidence of a fault, blaming the tools is just rejecting unwelcome data.",
              "ru": "Без доказательств неисправности винить инструменты — значит просто отвергать неудобные данные."
            }
          ],
          "id": "rm-l1-p2-13"
        },
        {
          "q": "After seeing that its framework loses on latency, a team switches the main metric to \"lines of code\" so that it wins. What is this?",
          "options": [
            "Moving the goalposts after seeing the results",
            "A normal refinement of the research question",
            "Critical skepticism towards the first metric",
            "A way to improve the benchmark's reproducibility"
          ],
          "answer": 0,
          "why": {
            "en": "Changing the metric or the question after seeing results so that the favourite wins violates open-mindedness (and honest reporting).",
            "ru": "Менять метрику или вопрос после результатов, чтобы победил любимец, — нарушение открытости (и честной отчётности)."
          },
          "wrong": [
            {
              "en": "Refinement is justified and happens before the data, not to make a favourite win.",
              "ru": "Уточнение обосновано и делается до данных, а не ради победы любимца."
            },
            {
              "en": "Skepticism needs a methodological reason; \"we lost\" is not one.",
              "ru": "Скептицизму нужна методологическая причина; «мы проиграли» — не причина."
            },
            {
              "en": "Changing the metric does nothing for reproducibility.",
              "ru": "Смена метрики никак не улучшает воспроизводимость."
            }
          ],
          "id": "rm-l1-p2-14"
        },
        {
          "q": "A hypothesis must be falsifiable. What does that mean?",
          "options": [
            "Some possible data could show it is wrong",
            "It must already be proven by earlier studies",
            "It must be written as a yes/no question",
            "It must hold true in every possible case"
          ],
          "answer": 0,
          "why": {
            "en": "Falsifiable = the prediction is specific enough that a possible result (e.g. no fewer speeding events) would refute it.",
            "ru": "Опровержимая — прогноз настолько конкретен, что возможный результат (например, превышений не меньше) его опровергнет."
          },
          "wrong": [
            {
              "en": "Then it would be a finding, not a hypothesis.",
              "ru": "Тогда это был бы результат, а не гипотеза."
            },
            {
              "en": "That would be a question, not a hypothesis.",
              "ru": "Это был бы вопрос, а не гипотеза."
            },
            {
              "en": "Universal truth is not required; testability is.",
              "ru": "Всеобщая истинность не требуется; требуется проверяемость."
            }
          ],
          "id": "rm-l1-p2-16"
        },
        {
          "q": "A researcher reads only the papers that support their favourite framework and skips the critical ones. What is this called?",
          "options": [
            "Confirmation bias",
            "Critical skepticism",
            "Methodological rigor",
            "Peer review"
          ],
          "answer": 0,
          "why": {
            "en": "Confirmation bias = noticing only the evidence that supports what you already believe; open-mindedness is its antidote.",
            "ru": "Предвзятость подтверждения — замечать только данные в пользу уже имеющегося мнения; противоядие — открытость."
          },
          "wrong": [
            {
              "en": "Skepticism examines all evidence carefully, including evidence against you.",
              "ru": "Скептицизм тщательно проверяет все данные, в том числе те, что против вас."
            },
            {
              "en": "Rigor means transparent, documented steps, not selective reading.",
              "ru": "Строгость — прозрачные описанные шаги, а не выборочное чтение."
            },
            {
              "en": "Peer review is independent expert checking before publication.",
              "ru": "Рецензирование — независимая экспертная проверка до публикации."
            }
          ],
          "id": "rm-l1-p2-20"
        }
      ]
    },
    {
      "id": "rm-l1-p3",
      "title": {
        "en": "Narrowing the focus: from an interest area to a researchable question",
        "ru": "Сужение темы: от области интересов к исследуемому вопросу"
      },
      "notes": {
        "en": "## Why broad topics fail\nIf your topic is \"Artificial Intelligence in 2026\" or \"Cybersecurity\", you will **drown in millions of papers**. The literature review turns into a **superficial essay**, and you fail to build **distinct knowledge**.\n**The goal:** turn a massive domain into a **sharp, bounded and manageable** engineering or scientific problem.\n## Four elements of a researchable question\n| Element | Question it answers | Flutter example |\n|---|---|---|\n| Population / object | who or what is studied? | Android phones running the same test app |\n| Factor / variable | what is changed or compared? | Flutter vs React Native |\n| Outcome | what is measured? | battery consumption (% or mAh per hour) |\n| Context | where, under which conditions? | active background GPS tracking |\nIf one element is missing, the question is usually still too broad: \"How do AI coding assistants affect students?\" has no outcome — affect *what*?\n## The Feasibility Matrix — three hard filters\nBefore a team commits to a topic, it must pass three strict practical constraints:\n- **Data accessibility** — do you actually have the right to access the source code, private APIs, premium server logs or target users? *\"How will you get private banking data?\"*\n- **Infrastructure requirements** — do you have the computing power, emulators, cloud credits or hardware tools to run the tests? *\"Who pays for 100 GPU-hours?\"*\n- **Time constraints** — can data collection, analysis and report writing fit into the remaining weeks of the trimester? *\"Doesn't this experiment take six months?\"*\nA topic that fails a filter is **reshaped, not abandoned**: a public dataset instead of private logs, a simulator or testnet instead of real infrastructure, 6 weeks instead of a year, one city instead of the whole country — never \"borrowed\" or invented data.",
        "ru": "## Почему широкие темы проваливаются\nЕсли тема — «Искусственный интеллект в 2026 году» или «Кибербезопасность», команда **утонет в миллионах статей**. Обзор литературы превратится в **поверхностное эссе**, и **нового знания (distinct knowledge)** не получится.\n**Цель:** превратить огромную область в **чёткую, ограниченную и посильную** инженерную или научную задачу.\n## Четыре элемента исследуемого вопроса\n| Элемент | На какой вопрос отвечает | Пример с Flutter |\n|---|---|---|\n| Population / object (группа, объект) | кого или что изучаем? | Android-телефоны с одним и тем же тестовым приложением |\n| Factor / variable (фактор, переменная) | что меняем или сравниваем? | Flutter против React Native |\n| Outcome (результат) | что измеряем? | расход батареи (% или мА·ч в час) |\n| Context (контекст) | где, в каких условиях? | активный фоновый GPS-трекинг |\nЕсли какого-то элемента нет, вопрос обычно всё ещё слишком широкий: «Как ИИ-ассистенты влияют на студентов?» — без результата: влияют на *что*?\n## Матрица выполнимости (Feasibility Matrix) — три жёстких фильтра\nПрежде чем взять тему, команда должна пройти три строгих практических ограничения:\n- **Доступность данных (data accessibility)** — есть ли реальное право доступа к исходному коду, закрытым API, платным логам серверов или нужным пользователям? *«Как вы получите закрытые банковские данные?»*\n- **Инфраструктура (infrastructure requirements)** — хватает ли вычислительной мощности, эмуляторов, облачных кредитов или железа для тестов? *«Кто оплатит 100 GPU-часов?»*\n- **Время (time constraints)** — уложатся ли сбор данных, анализ и написание отчёта в оставшиеся недели триместра? *«Разве этот эксперимент не займёт полгода?»*\nТему, которая не прошла фильтр, **перестраивают, а не бросают**: открытый датасет вместо закрытых логов, симулятор или testnet вместо реальной инфраструктуры, 6 недель вместо года, один город вместо всей страны — но никогда не «одолженные» или выдуманные данные."
      },
      "questions": [
        {
          "q": "Why is \"Does technology improve road safety?\" a weak research question?",
          "options": [
            "It is too broad and has no measurable outcome",
            "It is a yes/no question, which is never allowed",
            "Road safety is not a topic for IT research",
            "It has already been answered by earlier studies"
          ],
          "answer": 0,
          "why": {
            "en": "\"Technology\" and \"road safety\" are undefined; there is no population, context, time frame or measurable outcome.",
            "ru": "«Технологии» и «безопасность» не определены; нет группы, контекста, срока и измеримого результата."
          },
          "wrong": [
            {
              "en": "Narrow yes/no questions can work (\"Do alerts reduce speeding events per 100 km…?\"); the problem is breadth.",
              "ru": "Узкие вопросы «да/нет» допустимы («Снижают ли оповещения число превышений на 100 км…?»); проблема в ширине."
            },
            {
              "en": "It can be — through apps, sensors and data; the issue is the scope.",
              "ru": "Может быть — через приложения, датчики и данные; проблема в охвате."
            },
            {
              "en": "At this breadth there is no single answer to find; it is unanswerable as posed.",
              "ru": "При такой ширине единого ответа нет; в такой формулировке на вопрос нельзя ответить."
            }
          ],
          "id": "rm-l1-p3-1"
        },
        {
          "q": "In \"The impact of Flutter vs React Native on battery consumption during active background GPS tracking\", what is the measured outcome?",
          "options": [
            "Battery consumption",
            "Flutter vs React Native",
            "Background GPS tracking",
            "Mobile app performance"
          ],
          "answer": 0,
          "why": {
            "en": "The outcome is what gets measured: battery consumption (e.g. % or mAh per hour).",
            "ru": "Результат — то, что измеряют: расход батареи (например, % или мА·ч в час)."
          },
          "wrong": [
            {
              "en": "That is the factor being compared.",
              "ru": "Это сравниваемый фактор."
            },
            {
              "en": "That is the context — the condition of the test.",
              "ru": "Это контекст — условие теста."
            },
            {
              "en": "That is the broad area the topic was narrowed from.",
              "ru": "Это широкая область, из которой сужали тему."
            }
          ],
          "id": "rm-l1-p3-3"
        },
        {
          "q": "RQ: \"How does the use of AI coding assistants affect programming task completion time among Software Engineering students?\" Which element is the population?",
          "options": [
            "Software Engineering students",
            "Use of AI coding assistants",
            "Programming task completion time",
            "University programming tasks"
          ],
          "answer": 0,
          "why": {
            "en": "Population / object = who or what is studied; here, Software Engineering students.",
            "ru": "Population (группа, объект) — кого или что изучают; здесь студенты Software Engineering."
          },
          "wrong": [
            {
              "en": "That is the factor (variable) being investigated.",
              "ru": "Это исследуемый фактор (переменная)."
            },
            {
              "en": "That is the outcome being measured.",
              "ru": "Это измеряемый результат."
            },
            {
              "en": "That is the context of the study.",
              "ru": "Это контекст исследования."
            }
          ],
          "id": "rm-l1-p3-4"
        },
        {
          "q": "Practical task 2 lists \"Software quality\" and \"Does automated testing reduce the number of software defects?\". What is the key difference?",
          "options": [
            "Only the second names a factor and an outcome to study",
            "Only the first is broad enough to fill a whole thesis",
            "Both are topics, since a real RQ must start with \"How\"",
            "The second is a hypothesis, not a research question"
          ],
          "answer": 0,
          "why": {
            "en": "\"Software quality\" is a broad topic; the second is a research question with a factor (automated testing) and an outcome (number of defects).",
            "ru": "«Software quality» — широкая тема; второе — исследовательский вопрос с фактором (автотесты) и результатом (число дефектов)."
          },
          "wrong": [
            {
              "en": "Breadth is a weakness here, not a virtue.",
              "ru": "Ширина здесь — недостаток, а не достоинство."
            },
            {
              "en": "Research questions may start with Does, Is, What factors… — not only How.",
              "ru": "Вопрос может начинаться с Does, Is, What factors… — не только с How."
            },
            {
              "en": "It is a question; a hypothesis is a statement that predicts a result.",
              "ru": "Это вопрос; гипотеза — утверждение-прогноз результата."
            }
          ],
          "id": "rm-l1-p3-5"
        },
        {
          "q": "Why is \"What is Artificial Intelligence?\" a poor research question?",
          "options": [
            "A definition answers it; nothing needs investigating",
            "It is too narrow and specific for a whole research project",
            "It does not mention any programming language or framework",
            "AI is too new a field for any research to exist on it"
          ],
          "answer": 0,
          "why": {
            "en": "Practical task 2 warns: do not use questions that can be answered only with a definition.",
            "ru": "Practical task 2 предупреждает: не брать вопросы, на которые отвечает одно определение."
          },
          "wrong": [
            {
              "en": "Rather the opposite — and the main issue is that a definition answers it.",
              "ru": "Скорее наоборот — а главное, на него отвечает определение."
            },
            {
              "en": "An RQ does not need to name a language; it needs something to investigate.",
              "ru": "Вопросу не обязательно называть язык; ему нужно то, что можно исследовать."
            },
            {
              "en": "AI has decades of research; the problem is the type of question.",
              "ru": "У ИИ десятилетия исследований; проблема — в типе вопроса."
            }
          ],
          "id": "rm-l1-p3-6"
        },
        {
          "q": "What usually happens to the literature review of a team whose topic is just \"Cybersecurity\"?",
          "options": [
            "It becomes a superficial essay with no distinct contribution",
            "It finds too few relevant papers to say anything useful at all",
            "It becomes deeper, because there is so much more to read",
            "It automatically passes all three of the feasibility filters"
          ],
          "answer": 0,
          "why": {
            "en": "Too broad → millions of papers → a superficial essay and no distinct knowledge.",
            "ru": "Слишком широко → миллионы статей → поверхностное эссе и никакого нового знания."
          },
          "wrong": [
            {
              "en": "The opposite: the team drowns in millions of papers.",
              "ru": "Наоборот: команда тонет в миллионах статей."
            },
            {
              "en": "Breadth kills depth — there is no time to read critically.",
              "ru": "Ширина убивает глубину — на критическое чтение не хватает времени."
            },
            {
              "en": "Broad topics usually fail the filters, especially time.",
              "ru": "Широкие темы обычно проваливают фильтры, особенно по времени."
            }
          ],
          "id": "rm-l1-p3-7"
        },
        {
          "q": "Which sequence shows the narrowing ladder in the right order?",
          "options": [
            "Area → topic → problem → research question",
            "Topic → area → research question → problem",
            "Research question → problem → topic → area",
            "Area → research question → topic → problem"
          ],
          "answer": 0,
          "why": {
            "en": "Each step down is narrower and more concrete: area → topic → problem → research question.",
            "ru": "Каждый шаг вниз уже и конкретнее: область → тема → проблема → исследовательский вопрос."
          },
          "wrong": [
            {
              "en": "The area is the broadest level, so it comes first.",
              "ru": "Область — самый широкий уровень, она идёт первой."
            },
            {
              "en": "This runs from narrow to broad — the reverse.",
              "ru": "Здесь от узкого к широкому — обратный порядок."
            },
            {
              "en": "The question is the narrowest step and comes last, after the problem.",
              "ru": "Вопрос — самый узкий шаг и идёт последним, после проблемы."
            }
          ],
          "id": "rm-l1-p3-8"
        },
        {
          "q": "A team plans to analyse private transaction logs of a commercial bank. A reviewer asks: \"How will you get this data?\" Which feasibility filter is tested?",
          "options": [
            "Data accessibility",
            "Infrastructure requirements",
            "Time constraints",
            "Topic relevance"
          ],
          "answer": 0,
          "why": {
            "en": "Data accessibility: do you actually have the right to access the code, private APIs, server logs or target users?",
            "ru": "Доступность данных: есть ли реальное право доступа к коду, закрытым API, логам серверов или нужным пользователям?"
          },
          "wrong": [
            {
              "en": "Infrastructure is about compute, emulators, cloud credits and hardware.",
              "ru": "Инфраструктура — про вычислительные мощности, эмуляторы, облачные кредиты и железо."
            },
            {
              "en": "Time is about fitting the work into the trimester.",
              "ru": "Время — про то, уложится ли работа в триместр."
            },
            {
              "en": "Relevance is not one of the three hard filters.",
              "ru": "Релевантность не входит в три жёстких фильтра."
            }
          ],
          "id": "rm-l1-p3-9"
        },
        {
          "q": "A team wants to fine-tune a large language model but has no GPUs and no cloud credits. Which filter does the topic fail?",
          "options": [
            "Infrastructure requirements",
            "Data accessibility",
            "Time constraints",
            "Ethical approval requirements"
          ],
          "answer": 0,
          "why": {
            "en": "Infrastructure: the computational power, emulators, cloud credits or hardware tools needed to run the tests.",
            "ru": "Инфраструктура: вычислительная мощность, эмуляторы, облачные кредиты или железо для тестов."
          },
          "wrong": [
            {
              "en": "Data rights are a separate filter; the gap here is compute.",
              "ru": "Права на данные — отдельный фильтр; здесь не хватает вычислений."
            },
            {
              "en": "Time could also be tight, but the first blocker is missing hardware.",
              "ru": "Со временем тоже может быть туго, но первым мешает отсутствие железа."
            },
            {
              "en": "Ethics matters (Lecture 3), but it is not one of the three filters and not the problem here.",
              "ru": "Этика важна (лекция 3), но это не один из трёх фильтров и не проблема в данном случае."
            }
          ],
          "id": "rm-l1-p3-10"
        },
        {
          "q": "An experiment needs six months of user data, but only eight weeks of the trimester remain. What is the best response?",
          "options": [
            "Reshape it: shorter collection or a smaller scope",
            "Keep the plan and report the partial data at the end",
            "Drop the research and just build the app instead",
            "Collect for two weeks and extrapolate to six months"
          ],
          "answer": 0,
          "why": {
            "en": "A topic that fails a filter is reshaped, not abandoned: e.g. 6 weeks of data on one feature instead of a 6-month study.",
            "ru": "Тему, не прошедшую фильтр, перестраивают, а не бросают: например, 6 недель данных по одной функции вместо полугодового исследования."
          },
          "wrong": [
            {
              "en": "Unfinished collection cannot answer the question.",
              "ru": "Незавершённый сбор данных не ответит на вопрос."
            },
            {
              "en": "Switching to development abandons the research goal.",
              "ru": "Переход к разработке — отказ от исследовательской цели."
            },
            {
              "en": "Stretching two weeks of data into six-month conclusions is unsupported.",
              "ru": "Растягивать данные за две недели до выводов о полугоде — необоснованно."
            }
          ],
          "id": "rm-l1-p3-11"
        },
        {
          "q": "A topic fails the data accessibility filter because the logs are private. Which fix keeps the research honest and feasible?",
          "options": [
            "Use a public dataset or a simulated system instead",
            "Ask a friend inside the company to quietly copy the logs",
            "Generate realistic-looking fake logs for the analysis",
            "Describe what the private logs would most likely show"
          ],
          "answer": 0,
          "why": {
            "en": "Reshape the topic so that the data are legitimately accessible: public datasets, open APIs, your own simulation or consenting participants.",
            "ru": "Перестроить тему так, чтобы данные были законно доступны: открытые датасеты, открытые API, собственная симуляция или добровольные участники."
          },
          "wrong": [
            {
              "en": "Unauthorized access is an ethical and legal violation.",
              "ru": "Несанкционированный доступ — этическое и юридическое нарушение."
            },
            {
              "en": "Inventing data is fabrication — research misconduct.",
              "ru": "Выдумывать данные — фабрикация, нарушение научной этики."
            },
            {
              "en": "Speculation is not data.",
              "ru": "Предположения — не данные."
            }
          ],
          "id": "rm-l1-p3-12"
        },
        {
          "q": "What is wrong with the question \"Why is Flutter better than React Native?\"",
          "options": [
            "It assumes the answer before any data is collected",
            "It compares two frameworks instead of studying just one",
            "It is about mobile development, which is not a research field",
            "It is far too narrow to find any published papers on"
          ],
          "answer": 0,
          "why": {
            "en": "A loaded question presupposes its conclusion. A neutral version: \"How do Flutter and React Native differ in battery use during background GPS tracking?\"",
            "ru": "Наводящий вопрос заранее содержит вывод. Нейтрально: «Чем Flutter и React Native различаются по расходу батареи при фоновом GPS-трекинге?»"
          },
          "wrong": [
            {
              "en": "Comparisons are fine — the lecture's own example compares the two.",
              "ru": "Сравнение допустимо — пример из лекции как раз сравнивает их."
            },
            {
              "en": "Mobile development is a legitimate research area.",
              "ru": "Мобильная разработка — вполне законная область исследований."
            },
            {
              "en": "There is plenty of literature; the issue is the built-in conclusion.",
              "ru": "Литературы достаточно; проблема во встроенном выводе."
            }
          ],
          "id": "rm-l1-p3-13"
        },
        {
          "q": "\"How do AI coding assistants affect students?\" Which element is missing and keeps it too broad?",
          "options": [
            "A measurable outcome, e.g. task completion time",
            "A population, since students are not a group",
            "A factor, since AI assistants are not a variable",
            "A hypothesis, since every RQ must contain one"
          ],
          "answer": 0,
          "why": {
            "en": "\"Affect students\" — affect what? Completion time, grades, code understanding? Without an outcome there is nothing to measure.",
            "ru": "«Влияют на студентов» — на что именно? Время выполнения, оценки, понимание кода? Без результата нечего измерять."
          },
          "wrong": [
            {
              "en": "Students are a population (if a broad one); the missing piece is what is measured.",
              "ru": "Студенты — это группа (пусть и широкая); не хватает того, что измеряется."
            },
            {
              "en": "The use of AI assistants is exactly the factor.",
              "ru": "Использование ИИ-ассистентов — это и есть фактор."
            },
            {
              "en": "A research question does not have to contain a hypothesis.",
              "ru": "Исследовательский вопрос не обязан содержать гипотезу."
            }
          ],
          "id": "rm-l1-p3-14"
        },
        {
          "q": "According to the lecture, what should a narrowed topic name?",
          "options": [
            "What is compared, what is measured, under what conditions",
            "Which tools are trendy, who funds it, and when it is due",
            "The team members, their roles, and the submission deadline",
            "The research area, the newest papers, and the main author"
          ],
          "answer": 0,
          "why": {
            "en": "The narrowed examples (PoS vs PoH throughput under degradation; Flutter vs React Native battery use during GPS tracking) each name a comparison, a measure and a condition.",
            "ru": "Суженные примеры (TPS PoS и PoH при деградации сети; батарея Flutter и React Native при GPS-трекинге) называют сравнение, показатель и условие."
          },
          "wrong": [
            {
              "en": "Trendiness, funding and deadlines do not make a topic bounded.",
              "ru": "Модность, финансирование и сроки не делают тему ограниченной."
            },
            {
              "en": "That is project administration, not the topic.",
              "ru": "Это организация проекта, а не тема."
            },
            {
              "en": "Listing papers does not narrow the topic itself.",
              "ru": "Список статей не сужает саму тему."
            }
          ],
          "id": "rm-l1-p3-15"
        },
        {
          "q": "Narrowing a topic weakens the literature review, because fewer papers are directly relevant.",
          "options": [
            "True",
            "False"
          ],
          "answer": 1,
          "fixed": true,
          "why": {
            "en": "Fewer but directly relevant papers allow a deeper, critical review; a broad topic produces a superficial essay.",
            "ru": "Меньше, но прямо относящихся к делу статей дают более глубокий критический обзор; широкая тема даёт поверхностное эссе."
          },
          "wrong": [
            {
              "en": "\"True\" assumes that more papers mean a better review; the lecture says breadth drowns you in millions of papers.",
              "ru": "«Верно» предполагает, что чем больше статей, тем лучше обзор; лекция говорит, что ширина топит в миллионах статей."
            }
          ],
          "id": "rm-l1-p3-16"
        },
        {
          "q": "During the peer challenge in class, what must the neighbouring team do with your narrowed topics?",
          "options": [
            "Find at least one major feasibility flaw",
            "Rewrite them so that they sound more impressive",
            "Vote for the most interesting topic in the class",
            "Approve them if they sound important enough"
          ],
          "answer": 0,
          "why": {
            "en": "The neighbouring team acts as a critical reviewer and must find at least one major feasibility flaw (data access, infrastructure, time).",
            "ru": "Соседняя команда — критический рецензент: она обязана найти хотя бы один серьёзный изъян выполнимости (данные, инфраструктура, время)."
          },
          "wrong": [
            {
              "en": "The goal is critical review, not polishing the wording.",
              "ru": "Цель — критическая рецензия, а не шлифовка формулировок."
            },
            {
              "en": "Interest is not the criterion; feasibility is.",
              "ru": "Критерий — не интерес, а выполнимость."
            },
            {
              "en": "Sounding important is exactly what the review should look past.",
              "ru": "«Звучит важно» — как раз то, за что рецензия должна заглянуть."
            }
          ],
          "id": "rm-l1-p3-17"
        },
        {
          "q": "Which topic passes all three feasibility filters for a student team in one trimester?",
          "options": [
            "Battery use of two cross-platform apps on lab phones over 3 weeks",
            "Latency of all Kazakh banks' internal payment systems this month",
            "Training a new GPT-scale language model from scratch on campus",
            "Career outcomes of this year's graduates over the next 10 years"
          ],
          "answer": 0,
          "why": {
            "en": "Lab phones (infrastructure), the team's own test apps (data access) and 3 weeks (time) — every filter is satisfied.",
            "ru": "Телефоны лаборатории (инфраструктура), свои тестовые приложения (данные) и 3 недели (время) — все фильтры пройдены."
          },
          "wrong": [
            {
              "en": "Fails data accessibility: no right to access the banks' internal systems.",
              "ru": "Не проходит доступность данных: нет права доступа к внутренним системам банков."
            },
            {
              "en": "Fails infrastructure: it requires enormous compute.",
              "ru": "Не проходит инфраструктуру: нужны огромные мощности."
            },
            {
              "en": "Fails time: ten years do not fit into a trimester.",
              "ru": "Не проходит время: десять лет не умещаются в триместр."
            }
          ],
          "id": "rm-l1-p3-18"
        }
      ]
    },
    {
      "id": "rm-l1-p4",
      "title": {
        "en": "Credible sources vs hype, academic search and the course rules",
        "ru": "Достоверные источники и хайп, академический поиск и правила курса"
      },
      "notes": {
        "en": "## The literature hierarchy in IT\nThe internet is flooded with technology blogs, marketing hype and basic tutorials. Academic research follows a strict hierarchy of source credibility:\n| Tier | Credibility | Examples | In a literature review |\n|---|---|---|---|\n| Tier 1 | highest | peer-reviewed journal articles and conference proceedings (IEEE Xplore, ACM Digital Library, Springer, Scopus) | the core evidence |\n| Tier 2 | moderate | official technical whitepapers (W3C web standards, the original Ethereum whitepaper), verified system documentation | facts about a standard or a system |\n| Tier 3 | lowest | Medium posts, TechCrunch articles, YouTube tutorials, personal GitHub READMEs, tech-influencer tweets | avoid |\n- **Peer review** means independent experts checked the method and conclusions **before** publication. In computer science, conference proceedings (IEEE, ACM) are full Tier 1 venues.\n- A whitepaper or official documentation is authoritative about **what a system is**, but it is written by its creators and is not an independent test of **how well it works**.\n- A Tier 3 source can still be a useful **lead**: if a blog mentions a study, find the original peer-reviewed paper, read it and cite that.\n> Exam trap: popularity is not credibility. A README with 40k stars, a viral tweet or a TechCrunch article is still Tier 3.\n## Hype vs science\n- **Text A (tech blog):** \"Our revolutionary new JavaScript engine runs 10x faster than Node.js! It completely disrupts backend development! Download our NPM package now.\"\n- **Text B (research):** \"Under synthetic memory stress tests mapping 50,000 concurrent V8 isolates, this architecture demonstrated an 11.2% reduction in garbage collection pause times compared to Node.js v20, with a trade-off of 4% higher baseline idle RAM utilization.\"\n| Feature | Text A (hype) | Text B (science) |\n|---|---|---|\n| Conditions | none | synthetic memory stress test, 50,000 concurrent V8 isolates |\n| Metric | \"10x faster\" — at what? | 11.2% shorter garbage-collection pauses |\n| Baseline | \"Node.js\" — which version? | Node.js v20 |\n| Trade-off | none, only benefits | 4% higher baseline idle RAM |\n| Tone | emotional, a call to action | neutral and precise |\n> The core rule: in your literature review, arguments, metrics and tone must mirror Text B, not Text A.\n## Academic search engines\n- **Google Scholar** — the widest open index of academic papers; perfect for **initial keyword discovery**.\n- **IEEE Xplore and ACM Digital Library** — the gold standards for computer science, software architecture and hardware research.\n- **Litmaps / Connected Papers** — visual discovery tools: plug in **one core, foundational paper** and the tool maps the related, interconnected studies.\nBuild keywords from the elements of your narrowed topic (factor + outcome + context), for example: React Native, battery consumption, background GPS.\n## The extraction table — the start of Assignment 1\nFor every paper, fill in one row:\n| Column | What to write |\n|---|---|\n| Article | short title or ID |\n| APA Reference | the full reference in APA style |\n| Problem | the problem the paper addresses |\n| Method / Data | how the study was done and on what data |\n| Metrics & Results | what was measured and what was found, with numbers |\n| Limitations | weaknesses the authors admit or you notice |\n| Relevance / Gap | how it relates to your topic and what remains unexplored |\n**Homework before the next session:** (1) finalize **one** narrowed topic; (2) find and download **3 peer-reviewed papers** (Google Scholar, IEEE, ACM); (3) bring the PDFs to class for a live breakdown. **Assignment 1 — Writing a Literature Review** is due in **week 4** and is worth **20 points** of the 1st attestation.",
        "ru": "## Иерархия источников в IT\nИнтернет переполнен технологическими блогами, маркетинговым хайпом и простыми туториалами. В академическом исследовании действует строгая иерархия достоверности источников:\n| Уровень | Достоверность | Примеры | В обзоре литературы |\n|---|---|---|---|\n| Tier 1 | высшая | рецензируемые журнальные статьи и труды конференций (IEEE Xplore, ACM Digital Library, Springer, Scopus) | основа доказательств |\n| Tier 2 | средняя | официальные технические whitepaper (веб-стандарты W3C, оригинальный whitepaper Ethereum), проверенная документация систем | факты о стандарте или системе |\n| Tier 3 | низшая | посты на Medium, статьи TechCrunch, обучалки на YouTube, личные README на GitHub, твиты техно-инфлюенсеров | избегать |\n- **Рецензирование (peer review)** — независимые эксперты проверили метод и выводы **до** публикации. В computer science труды конференций (IEEE, ACM) — полноценные площадки уровня Tier 1.\n- Whitepaper или официальная документация авторитетны в том, **что представляет собой система**, но их пишут её создатели, и это не независимая проверка того, **насколько хорошо она работает**.\n- Источник Tier 3 может быть полезной **подсказкой**: если блог упоминает исследование, стоит найти оригинальную рецензируемую статью, прочитать её и ссылаться на неё.\n> Ловушка экзамена: популярность — не достоверность. README с 40 тысячами звёзд, вирусный твит или статья в TechCrunch — всё равно Tier 3.\n## Хайп и наука\n- **Текст A (техноблог):** «Наш революционный новый JavaScript-движок работает в 10 раз быстрее Node.js! Он полностью меняет бэкенд-разработку! Скачайте наш NPM-пакет прямо сейчас».\n- **Текст B (исследование):** «В синтетических стресс-тестах памяти с 50 000 одновременных изолятов V8 эта архитектура показала сокращение пауз сборки мусора на 11,2% по сравнению с Node.js v20 ценой на 4% большего базового расхода RAM в простое».\n| Признак | Текст A (хайп) | Текст B (наука) |\n|---|---|---|\n| Условия | никаких | синтетический стресс-тест памяти, 50 000 одновременных изолятов V8 |\n| Метрика | «в 10 раз быстрее» — в чём? | паузы сборки мусора короче на 11,2% |\n| База сравнения | «Node.js» — какая версия? | Node.js v20 |\n| Компромисс | нет, одни плюсы | на 4% больше базовый расход RAM в простое |\n| Тон | эмоциональный, призыв к действию | нейтральный и точный |\n> Главное правило: в обзоре литературы аргументы, метрики и тон должны быть как в тексте B, а не как в тексте A.\n## Академические поисковики\n- **Google Scholar** — самый широкий открытый индекс научных статей; идеален для **первого поиска по ключевым словам**.\n- **IEEE Xplore и ACM Digital Library** — золотой стандарт для computer science, архитектуры ПО и исследований железа.\n- **Litmaps / Connected Papers** — инструменты визуального поиска: на вход **одна ключевая основополагающая статья**, на выходе — карта связанных исследований.\nКлючевые слова берутся из элементов суженной темы (фактор + результат + контекст), например: React Native, battery consumption, background GPS.\n## Таблица извлечения — начало Assignment 1\nДля каждой статьи заполняется одна строка:\n| Колонка | Что писать |\n|---|---|\n| Article | краткое название или номер |\n| APA Reference | полная ссылка в стиле APA |\n| Problem | какую проблему решает статья |\n| Method / Data | как проведено исследование и на каких данных |\n| Metrics & Results | что измеряли и что получили, с числами |\n| Limitations | слабости, которые признают авторы или видно со стороны |\n| Relevance / Gap | как статья связана с вашей темой и что осталось неизученным |\n**Домашнее задание к следующему занятию:** (1) окончательно выбрать **одну** суженную тему; (2) найти и скачать **3 рецензируемые статьи** (Google Scholar, IEEE, ACM); (3) принести PDF на занятие для разбора. **Assignment 1 — обзор литературы (Writing a Literature Review)** сдаётся на **4-й неделе** и даёт **20 баллов** первой аттестации."
      },
      "questions": [
        {
          "q": "A team needs the core evidence for its literature review on consensus throughput. Which source should carry the most weight?",
          "options": [
            "A peer-reviewed IEEE conference paper",
            "The original whitepaper of the blockchain",
            "A Medium post by a well-known core developer",
            "A YouTube benchmark with a million views"
          ],
          "answer": 0,
          "why": {
            "en": "Tier 1 — peer-reviewed journal articles and conference proceedings (IEEE Xplore, ACM DL, Springer, Scopus) — is the core evidence.",
            "ru": "Tier 1 — рецензируемые журнальные статьи и труды конференций (IEEE Xplore, ACM DL, Springer, Scopus) — основа доказательной базы."
          },
          "wrong": [
            {
              "en": "Tier 2: authoritative about the design, but not an independent, peer-reviewed test.",
              "ru": "Tier 2: авторитетен в описании устройства, но это не независимая рецензируемая проверка."
            },
            {
              "en": "Tier 3, however famous the author.",
              "ru": "Tier 3, как бы ни был известен автор."
            },
            {
              "en": "Tier 3: popularity is not peer review.",
              "ru": "Tier 3: популярность — не рецензирование."
            }
          ],
          "id": "rm-l1-p4-1"
        },
        {
          "q": "Where does the official W3C specification of WebSockets sit in the hierarchy?",
          "options": [
            "Tier 2 — official documentation",
            "Tier 1 — peer-reviewed research",
            "Tier 3 — avoid in a review",
            "Outside the hierarchy entirely"
          ],
          "answer": 0,
          "why": {
            "en": "Tier 2: official technical whitepapers and standards (W3C, the original Ethereum whitepaper) and verified system documentation.",
            "ru": "Tier 2: официальные технические whitepaper и стандарты (W3C, оригинальный whitepaper Ethereum) и проверенная документация систем."
          },
          "wrong": [
            {
              "en": "A standard is authoritative, but it is not peer-reviewed research that tests something.",
              "ru": "Стандарт авторитетен, но это не рецензируемое исследование, которое что-то проверяет."
            },
            {
              "en": "It is official, verified documentation, not a blog.",
              "ru": "Это официальная проверенная документация, а не блог."
            },
            {
              "en": "The lecture explicitly lists W3C standards as Tier 2.",
              "ru": "Лекция прямо относит стандарты W3C к Tier 2."
            }
          ],
          "id": "rm-l1-p4-2"
        },
        {
          "q": "A GitHub README with 40,000 stars claims the library is \"the fastest ever\". How should it be treated in a literature review?",
          "options": [
            "As Tier 3 — at most a lead, not evidence",
            "As Tier 1, since thousands of developers trust it",
            "As Tier 2, since it is the project's official page",
            "As primary data that proves the speed claim"
          ],
          "answer": 0,
          "why": {
            "en": "Popularity is not credibility. Use such a source only as a pointer towards real, peer-reviewed evidence.",
            "ru": "Популярность — не достоверность. Такой источник годится лишь как подсказка, где искать настоящие рецензируемые данные."
          },
          "wrong": [
            {
              "en": "Stars measure popularity, not peer review.",
              "ru": "Звёзды измеряют популярность, а не рецензирование."
            },
            {
              "en": "The lecture lists personal GitHub READMEs as Tier 3; a marketing claim is not verified documentation.",
              "ru": "Лекция относит README на GitHub к Tier 3; рекламное заявление — не проверенная документация."
            },
            {
              "en": "A claim is not data; no method or measurements are given.",
              "ru": "Заявление — не данные; ни метода, ни измерений нет."
            }
          ],
          "id": "rm-l1-p4-3"
        },
        {
          "q": "What does peer review add that a tech blog lacks?",
          "options": [
            "Independent experts check the method before publication",
            "A guarantee that the results will stay correct forever",
            "Faster publication of the newest ideas to a wide audience",
            "Proof that the paper is popular and widely read by engineers"
          ],
          "answer": 0,
          "why": {
            "en": "Peer review = independent experts scrutinize the method and the conclusions before the work is published.",
            "ru": "Рецензирование (peer review) — независимые эксперты проверяют метод и выводы до публикации."
          },
          "wrong": [
            {
              "en": "Peer review reduces errors but guarantees nothing forever.",
              "ru": "Рецензирование снижает число ошибок, но ничего не гарантирует навсегда."
            },
            {
              "en": "Blogs are faster; peer review is slower but checked.",
              "ru": "Блоги быстрее; рецензирование медленнее, зато с проверкой."
            },
            {
              "en": "Popularity is not what peer review measures.",
              "ru": "Рецензирование не измеряет популярность."
            }
          ],
          "id": "rm-l1-p4-4"
        },
        {
          "q": "A TechCrunch article says a new database is \"3x faster\" and links to an IEEE paper. What should the literature review cite?",
          "options": [
            "The IEEE paper, after reading its method",
            "The TechCrunch article, since it is easier to read",
            "Both equally, since they report the same result",
            "Neither, since \"3x faster\" must be hype"
          ],
          "answer": 0,
          "why": {
            "en": "Trace the claim to its original peer-reviewed source, read it and cite that; the article only served as a lead.",
            "ru": "Проследить заявление до оригинального рецензируемого источника, прочитать его и сослаться на него; статья была лишь подсказкой."
          },
          "wrong": [
            {
              "en": "TechCrunch is Tier 3; being easy to read is not credibility.",
              "ru": "TechCrunch — Tier 3; лёгкость чтения — не достоверность."
            },
            {
              "en": "A journalist's summary may distort the original; the tiers differ.",
              "ru": "Пересказ журналиста может исказить оригинал; уровни разные."
            },
            {
              "en": "The claim may be true — check it in the original paper.",
              "ru": "Заявление может оказаться правдой — его стоит проверить в оригинальной статье."
            }
          ],
          "id": "rm-l1-p4-5"
        },
        {
          "q": "Which sentence is written in the academic style of Text B?",
          "options": [
            "GC pauses fell 11.2% vs Node.js v20, with 4% more idle RAM",
            "Our engine is 10x faster than Node.js and disrupts the backend",
            "Developers everywhere agree this is the best runtime ever built",
            "This revolutionary engine will change how you build servers"
          ],
          "answer": 0,
          "why": {
            "en": "Academic style: an exact metric, a named baseline (Node.js v20) and an honest trade-off (more idle RAM).",
            "ru": "Академический стиль: точная метрика, названная база сравнения (Node.js v20) и честно указанная цена (больше RAM в простое)."
          },
          "wrong": [
            {
              "en": "Hype: a vague multiplier, no conditions, an emotional claim.",
              "ru": "Хайп: расплывчатое «в 10 раз», нет условий, эмоциональное заявление."
            },
            {
              "en": "An appeal to popularity — nothing is measured.",
              "ru": "Ссылка на популярность — никаких измерений."
            },
            {
              "en": "\"Revolutionary\" is a hype marker; nothing is measured.",
              "ru": "«Революционный» — маркер хайпа; ничего не измерено."
            }
          ],
          "id": "rm-l1-p4-6"
        },
        {
          "q": "What makes Text B (\"11.2% reduction in GC pause times compared to Node.js v20, with 4% higher idle RAM\") credible?",
          "options": [
            "Stated conditions, exact metric, baseline and trade-off",
            "A confident tone and a clear call to action for readers",
            "A bigger performance gain than Text A reports for its engine",
            "Technical vocabulary that makes the claim sound impressive"
          ],
          "answer": 0,
          "why": {
            "en": "Text B states the test conditions (50,000 concurrent V8 isolates), the exact metric, the baseline and the cost.",
            "ru": "Текст B указывает условия теста (50 000 одновременных изолятов V8), точную метрику, базу сравнения и цену."
          },
          "wrong": [
            {
              "en": "Those are features of Text A — the hype.",
              "ru": "Это черты текста A — хайпа."
            },
            {
              "en": "11.2% is smaller than \"10x\"; credibility does not come from the size of the number.",
              "ru": "11,2% меньше, чем «в 10 раз»; достоверность не зависит от размера цифры."
            },
            {
              "en": "Jargon is not evidence; the specifics are.",
              "ru": "Жаргон — не доказательство; доказательство — конкретика."
            }
          ],
          "id": "rm-l1-p4-7"
        },
        {
          "q": "Text A says the engine \"runs 10x faster than Node.js\". What is the main problem with \"10x\"?",
          "options": [
            "No conditions, workload or metric are given",
            "A 10x speed-up is physically impossible for any engine",
            "It should have been written as 1000% instead",
            "Node.js is not a valid baseline for comparison"
          ],
          "answer": 0,
          "why": {
            "en": "\"10x faster\" — at what, measured how, on which version and hardware? Without that, the number cannot be verified.",
            "ru": "«В 10 раз быстрее» — в чём, как измерено, на какой версии и железе? Без этого число нельзя проверить."
          },
          "wrong": [
            {
              "en": "Large speed-ups are possible on specific workloads; the problem is the missing specification.",
              "ru": "Большие ускорения возможны на отдельных нагрузках; проблема — в отсутствии конкретики."
            },
            {
              "en": "The format is irrelevant.",
              "ru": "Формат записи не важен."
            },
            {
              "en": "Node.js is a fine baseline; its version and setup must be stated.",
              "ru": "Node.js — нормальная база сравнения; нужно лишь указать версию и настройки."
            }
          ],
          "id": "rm-l1-p4-8"
        },
        {
          "q": "Which databases does the lecture call the gold standards for computer science research?",
          "options": [
            "IEEE Xplore and ACM Digital Library",
            "Google Scholar and the Wikipedia reference lists",
            "Stack Overflow and GitHub Discussions",
            "Scopus and the Medium partner program"
          ],
          "answer": 0,
          "why": {
            "en": "IEEE Xplore and ACM DL are the gold standards for computer science, software architecture and hardware research.",
            "ru": "IEEE Xplore и ACM DL — золотой стандарт для computer science, архитектуры ПО и исследований железа."
          },
          "wrong": [
            {
              "en": "Scholar is the widest open index, not the gold standard; Wikipedia is not an academic database.",
              "ru": "Scholar — самый широкий открытый индекс, а не золотой стандарт; Википедия — не академическая база."
            },
            {
              "en": "These are community Q&A sites, not academic databases.",
              "ru": "Это сообщества вопросов и ответов, а не академические базы."
            },
            {
              "en": "Scopus indexes peer-reviewed work, but Medium is Tier 3.",
              "ru": "Scopus индексирует рецензируемые работы, но Medium — Tier 3."
            }
          ],
          "id": "rm-l1-p4-10"
        },
        {
          "q": "Which extraction-table column should hold \"the authors admit their sample of 12 users is too small to generalize\"?",
          "options": [
            "Limitations",
            "Metrics & Results",
            "Method / Data",
            "Relevance / Gap"
          ],
          "answer": 0,
          "why": {
            "en": "Limitations: weaknesses the authors admit or you notice — small samples, narrow settings, missing tests.",
            "ru": "Limitations: слабости, которые признают авторы или видно со стороны, — маленькая выборка, узкие условия, недостающие тесты."
          },
          "wrong": [
            {
              "en": "Results are what was found; admitted weaknesses go elsewhere.",
              "ru": "Результаты — что найдено; признанные слабости идут в другую колонку."
            },
            {
              "en": "Method describes how the study was done; its weaknesses are limitations.",
              "ru": "Метод описывает, как проведено исследование; его слабости — ограничения."
            },
            {
              "en": "Relevance / Gap links the paper to your own topic.",
              "ru": "Relevance / Gap связывает статью с вашей темой."
            }
          ],
          "id": "rm-l1-p4-11"
        },
        {
          "q": "Which column of the extraction table shows how a paper connects to your topic and what is still unexplored?",
          "options": [
            "Relevance / Gap",
            "Problem",
            "Limitations",
            "APA Reference"
          ],
          "answer": 0,
          "why": {
            "en": "Relevance / Gap connects each paper to your project and records what remains unexplored — the seed of your research gap.",
            "ru": "Relevance / Gap связывает статью с вашим проектом и фиксирует, что осталось неизученным, — зерно вашего research gap."
          },
          "wrong": [
            {
              "en": "Problem is the paper's own research problem.",
              "ru": "Problem — собственная исследовательская проблема статьи."
            },
            {
              "en": "Limitations are weaknesses of the paper itself.",
              "ru": "Limitations — слабости самой статьи."
            },
            {
              "en": "That is just the formatted citation.",
              "ru": "Это просто оформленная ссылка."
            }
          ],
          "id": "rm-l1-p4-12"
        },
        {
          "q": "A paper reports \"median latency dropped from 120 ms to 85 ms\". Where does this go in the extraction table?",
          "options": [
            "Metrics & Results",
            "Method / Data",
            "Problem",
            "Limitations"
          ],
          "answer": 0,
          "why": {
            "en": "Metrics & Results: what was measured and what was found, with numbers.",
            "ru": "Metrics & Results: что измеряли и что получили, с числами."
          },
          "wrong": [
            {
              "en": "Method / Data describes how and on what data the study was done, not the numbers it found.",
              "ru": "Method / Data описывает, как и на каких данных проведено исследование, а не найденные числа."
            },
            {
              "en": "Problem is what the paper set out to solve.",
              "ru": "Problem — то, что статья собиралась решить."
            },
            {
              "en": "A measured improvement is a result, not a weakness.",
              "ru": "Измеренное улучшение — результат, а не слабость."
            }
          ],
          "id": "rm-l1-p4-13"
        },
        {
          "q": "What must every team bring to the next practice session?",
          "options": [
            "One narrowed topic and 3 peer-reviewed papers as PDFs",
            "A finished literature review of at least ten sources",
            "A working prototype of the team's research app",
            "Three broad IT areas and the list of team members"
          ],
          "answer": 0,
          "why": {
            "en": "Homework: finalize one narrowed topic, find and download 3 peer-reviewed papers (Scholar, IEEE, ACM) and bring the PDFs for a live breakdown.",
            "ru": "Домашнее задание: выбрать одну суженную тему, найти и скачать 3 рецензируемые статьи (Scholar, IEEE, ACM) и принести PDF для разбора."
          },
          "wrong": [
            {
              "en": "The literature review is Assignment 1, due in week 4.",
              "ru": "Обзор литературы — это Assignment 1, срок — 4-я неделя."
            },
            {
              "en": "A prototype is development, not part of this homework.",
              "ru": "Прототип — это разработка, в домашнее задание он не входит."
            },
            {
              "en": "That was the deliverable of the first session itself.",
              "ru": "Это было результатом самого первого занятия."
            }
          ],
          "id": "rm-l1-p4-14"
        },
        {
          "q": "A student misses 30% of classes without a documented excuse. What happens?",
          "options": [
            "\"Not graded\": no exam admission, course failed",
            "Only the attendance points for those classes are lost",
            "A warning, followed by retakes of the missed quizzes",
            "Nothing, as long as the quiz scores are high enough"
          ],
          "answer": 0,
          "why": {
            "en": "At least 70% attendance is required for exam admission; 30% or more unexcused absence → \"not graded\" and automatic failure.",
            "ru": "Для допуска к экзамену нужно не меньше 70% посещаемости; 30% и больше пропусков без причины → «not graded» и автоматический провал."
          },
          "wrong": [
            {
              "en": "Attendance earns no points; the consequence is admission to the exam.",
              "ru": "За посещаемость баллов не дают; последствие — допуск к экзамену."
            },
            {
              "en": "There is no such rule; 30% unexcused absence means automatic failure.",
              "ru": "Такого правила нет; 30% пропусков без причины — автоматический провал."
            },
            {
              "en": "Grades cannot compensate for missing attendance.",
              "ru": "Оценки не компенсируют посещаемость."
            }
          ],
          "id": "rm-l1-p4-16"
        },
        {
          "q": "A student submits AI-generated text as their own work without acknowledgement. What does the course policy say?",
          "options": [
            "0 points and a report to the disciplinary committee",
            "Allowed, as long as the grammar has been checked",
            "A 10% penalty on that assignment",
            "Allowed, because the syllabus permits AI tools for learning"
          ],
          "answer": 0,
          "why": {
            "en": "Zero tolerance: unauthorized AI content or uncited copying → 0 points and a report to the disciplinary committee.",
            "ru": "Нулевая терпимость: несанкционированный ИИ-текст или копирование без ссылки → 0 баллов и сообщение в дисциплинарную комиссию."
          },
          "wrong": [
            {
              "en": "Checking grammar does not make someone else's text your own work.",
              "ru": "Проверка грамматики не делает чужой текст своей работой."
            },
            {
              "en": "The policy is zero points plus a report, not a small penalty.",
              "ru": "Правило — ноль баллов и сообщение в комиссию, а не маленький штраф."
            },
            {
              "en": "AI is allowed for learning only with the instructor's permission; submitting it as your own work is a violation.",
              "ru": "ИИ допустим для учёбы только с разрешения преподавателя; сдавать его текст как свой — нарушение."
            }
          ],
          "id": "rm-l1-p4-17"
        },
        {
          "q": "How is the final course grade calculated?",
          "options": [
            "0.3 × Att. 1 + 0.3 × Att. 2 + 0.4 × final",
            "0.5 × Att. 1 + 0.5 × Att. 2",
            "0.2 × Att. 1 + 0.2 × Att. 2 + 0.6 × final",
            "0.4 × Att. 1 + 0.4 × Att. 2 + 0.2 × final"
          ],
          "answer": 0,
          "why": {
            "en": "Syllabus: 0.3 × 1st attestation + 0.3 × 2nd attestation + 0.4 × final (team manuscript and presentation).",
            "ru": "Силлабус: 0,3 × первая аттестация + 0,3 × вторая + 0,4 × итог (командная рукопись и презентация)."
          },
          "wrong": [
            {
              "en": "This ignores the final team paper presentation.",
              "ru": "Здесь забыта итоговая презентация командной работы."
            },
            {
              "en": "The weights are 0.3, 0.3 and 0.4.",
              "ru": "Веса — 0,3, 0,3 и 0,4."
            },
            {
              "en": "The final paper has the largest weight, 0.4.",
              "ru": "У итоговой работы наибольший вес — 0,4."
            }
          ],
          "id": "rm-l1-p4-18"
        },
        {
          "q": "Scoring below 25% in either attestation leads to automatic failure of the course.",
          "options": [
            "True",
            "False"
          ],
          "answer": 0,
          "fixed": true,
          "why": {
            "en": "The syllabus: students who score less than 25% for Attestation I or II automatically fail the course.",
            "ru": "Силлабус: студенты, набравшие меньше 25% за первую или вторую аттестацию, автоматически не проходят курс."
          },
          "wrong": [
            {
              "en": "\"False\" would mean a weak attestation can be compensated later — the syllabus says it cannot.",
              "ru": "«Неверно» означало бы, что слабую аттестацию можно потом компенсировать, — силлабус говорит, что нельзя."
            }
          ],
          "id": "rm-l1-p4-20"
        }
      ]
    }
  ]
};
