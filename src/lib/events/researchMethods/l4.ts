import type { Lecture } from "../types";

/** Конспект и вопросы по темам лекции; учебные примеры заданий выделены отдельно. */
export const lecture4: Lecture = {
  "id": "rm-l4",
  "title": {
    "en": "Lecture 4 — Literature review and designing a research plan",
    "ru": "Лекция 4 — Обзор литературы и план исследования"
  },
  "parts": [
    {
      "id": "rm-l4-p1",
      "title": {
        "en": "Why review the literature: sources and kinds of evidence",
        "ru": "Зачем нужен обзор литературы: источники и виды доказательств"
      },
      "notes": {
        "en": "## Literature before the lab\n\"I have a great research idea — can I start my experiment immediately?\" **Not yet.** First find out what is already known: **the literature comes before the lab.**\nHypothetical story: a student spends **3 months, 500 hours** and a lot of GPU time on an experiment — and then finds a paper published two years earlier with almost the same experiment, methods, data and conclusions. What went wrong? The existing literature was never checked.\n> The Week 4 question: you already have a research question (RQ) — how do you know someone has not already answered it?\n## What a literature review is — and is not\nA **literature review** is an **analysis and synthesis of existing research**. It is **not** a list of papers, **not** a summary of papers one by one and **not** a bibliography. It examines:\n- what is known and **how it was studied** (methods, data, participants);\n- **what was found**;\n- where studies **agree or disagree**;\n- what **limitations** exist;\n- what **remains unknown**.\n| It is NOT | It IS |\n|---|---|\n| a list of papers or a bibliography | an analysis of what the papers show together |\n| \"Paper A says X. Paper B says Y.\" | \"A and B agree on X; C differs, possibly because…\" |\n| background reading to fill pages | the argument for why your study is needed |\n## Six reasons it matters\n- **Understand** what is already known.\n- **Avoid unnecessary duplication** — the 3-months story.\n- **Identify existing methods, datasets, benchmarks and metrics** to reuse or compare against.\n- **Discover contradictions and limitations** in prior work.\n- **Justify** your own research.\n- **Identify a possible research gap.**\n## Information vs evidence\nAsk not only \"what does it say?\" but **\"where does the claim come from?\"** Trace every important claim to its **original scholarly source**.\n| Group | Examples | Role in academic work |\n|---|---|---|\n| Informal | blog, Wikipedia, YouTube, ChatGPT summary | orientation only; not evidence |\n| Educational | textbook, technical documentation | definitions, background, how a tool works |\n| Scholarly | research article, conference paper, systematic review | evidence for academic claims |\n## Primary vs secondary sources\n- **Primary source** — original research: the authors **conducted and reported the study themselves**, e.g. they ran an experiment and published the results. Closest to the evidence.\n- **Secondary source** — **analyses, reviews or synthesises** primary research: review articles, **systematic reviews**, textbook chapters, summaries. Good for orientation; for important claims **check the originals**.\n> Exam trap: a systematic review in a peer-reviewed journal is scholarly **and** secondary. \"Peer-reviewed\" is about quality control; \"primary\" is about who did the study.\n## Source detective\n| Source | Verdict |\n|---|---|\n| Blog: \"LLMs are 95% accurate\", no citation, no method | not usable: the claim cannot be traced |\n| Peer-reviewed paper with documented method, dataset and reproducible results | the best evidence (primary) |\n| Wikipedia paragraph | orientation; follow its references to the original |\n| Systematic review in a peer-reviewed journal | strong (secondary); check the key originals |\n| AI-generated summary with no citation | not verifiable; never cite it as evidence |",
        "ru": "## Литература раньше лаборатории\n«У меня отличная идея — можно сразу начинать эксперимент?» **Пока нет.** Сначала нужно выяснить, что уже известно: **литература идёт раньше лаборатории (the literature comes before the lab).**\nГипотетическая история: студент тратит **3 месяца, 500 часов** и много GPU-времени на эксперимент — а потом находит статью двухлетней давности почти с тем же экспериментом, методами, данными и выводами. Что пошло не так? Существующую литературу так и не проверили.\n> Вопрос 4-й недели: исследовательский вопрос (research question, RQ) уже есть — а откуда известно, что на него ещё никто не ответил?\n## Что такое обзор литературы — и чем он не является\n**Обзор литературы (literature review)** — это **анализ и синтез существующих исследований**. Это **не** список статей, **не** пересказ статей по очереди и **не** библиография. Он показывает:\n- что известно и **как это изучали** (методы, данные, участники);\n- **что обнаружили**;\n- где работы **согласны и где расходятся**;\n- какие есть **ограничения (limitations)**;\n- что **остаётся неизвестным**.\n| Это НЕ | Это |\n|---|---|\n| список статей или библиография | анализ того, что статьи показывают вместе |\n| «Статья A говорит X. Статья B говорит Y.» | «A и B согласны насчёт X; C расходится, возможно, потому что…» |\n| фоновое чтение ради объёма | аргумент, зачем нужно ваше исследование |\n## Шесть причин, зачем он нужен\n- **Понять**, что уже известно.\n- **Избежать ненужного дублирования** — история про 3 месяца.\n- **Найти существующие методы, датасеты, бенчмарки и метрики**, чтобы использовать их или сравниться с ними.\n- **Обнаружить противоречия и ограничения** прежних работ.\n- **Обосновать** собственное исследование.\n- **Найти возможный исследовательский пробел (research gap).**\n## Информация и доказательства\nСпрашивать стоит не только «что там сказано?», но и **«откуда взялось это утверждение?»**. Каждое важное утверждение прослеживают до **исходного научного источника**.\n| Группа | Примеры | Роль в научной работе |\n|---|---|---|\n| Неформальные (informal) | блог, Википедия, YouTube, пересказ от ChatGPT | только для ориентации; не доказательство |\n| Учебные (educational) | учебник, техническая документация | определения, фон, как работает инструмент |\n| Научные (scholarly) | научная статья, доклад конференции, систематический обзор | доказательства для научных утверждений |\n## Первичные и вторичные источники\n- **Первичный источник (primary source)** — оригинальное исследование: авторы **сами провели и описали работу**, например поставили эксперимент и опубликовали результаты. Ближе всего к доказательствам.\n- **Вторичный источник (secondary source)** — **анализирует, обозревает или обобщает** первичные исследования: обзорные статьи, **систематические обзоры (systematic reviews)**, главы учебников, пересказы. Хорош для ориентации; важные утверждения **проверяют по оригиналам**.\n> Ловушка экзамена: систематический обзор в рецензируемом журнале — научный **и** вторичный. «Рецензируемый (peer-reviewed)» — про контроль качества; «первичный» — про то, кто проводил исследование.\n## Детектив источников\n| Источник | Вердикт |\n|---|---|\n| Блог: «LLM точны на 95%», без ссылки и метода | не годится: утверждение нельзя проследить |\n| Рецензируемая статья с описанным методом, датасетом и воспроизводимыми результатами | лучшее доказательство (первичный) |\n| Абзац из Википедии | для ориентации; идти по её ссылкам к оригиналу |\n| Систематический обзор в рецензируемом журнале | сильный (вторичный); ключевые оригиналы проверить |\n| Пересказ от ИИ без ссылок | не проверить; не цитировать как доказательство |"
      },
      "questions": [
        {
          "q": "A student has a promising research idea and wants to start the experiment tomorrow. What should come first?",
          "options": [
            "Checking what the existing literature already knows",
            "Buying all the GPU time that the experiment will need",
            "Collecting as much raw data as possible right away",
            "Writing the conclusion to fix the expected result"
          ],
          "answer": 0,
          "why": {
            "en": "The literature comes before the lab: first find out what is already known, then plan the study.",
            "ru": "Литература идёт раньше лаборатории: сначала выясняют, что уже известно, потом планируют исследование."
          },
          "wrong": [
            {
              "en": "Resources come later: first make sure the question has not already been answered.",
              "ru": "Ресурсы — потом: сначала нужно убедиться, что на вопрос ещё не ответили."
            },
            {
              "en": "Collecting data without knowing prior work risks repeating a study that already exists.",
              "ru": "Сбор данных без знания прежних работ рискует повторить уже существующее исследование."
            },
            {
              "en": "Fixing the result in advance is bias, not planning.",
              "ru": "Заранее зафиксированный результат — предвзятость, а не планирование."
            }
          ],
          "id": "rm-l4-p1-1"
        },
        {
          "q": "Which of these is one of the six reasons for doing a literature review?",
          "options": [
            "Identifying methods, datasets, benchmarks and metrics",
            "Showing that nobody in the world has ever studied your topic",
            "Making the paper sound more academic to reviewers",
            "Collecting quotes to fill the introduction"
          ],
          "answer": 0,
          "why": {
            "en": "The six reasons: understand what is known, avoid duplication, find existing methods/datasets/benchmarks/metrics, discover contradictions and limitations, justify your research, identify a possible gap.",
            "ru": "Шесть причин: понять, что известно; избежать дублирования; найти методы, датасеты, бенчмарки и метрики; обнаружить противоречия и ограничения; обосновать исследование; найти возможный пробел."
          },
          "wrong": [
            {
              "en": "A gap almost never means 'never studied'; the review finds what is known and what is still missing.",
              "ru": "Пробел почти никогда не значит «никто не изучал»; обзор находит, что известно и чего ещё не хватает."
            },
            {
              "en": "Sounding academic is not a purpose; the review must inform and justify the study.",
              "ru": "Звучать «научно» — не цель; обзор должен информировать и обосновывать исследование."
            },
            {
              "en": "Quotes without analysis are padding, not a review.",
              "ru": "Цитаты без анализа — это наполнитель, а не обзор."
            }
          ],
          "id": "rm-l4-p1-4"
        },
        {
          "q": "Which source is the safest basis for an academic claim about LLM accuracy?",
          "options": [
            "A peer-reviewed paper with documented method and data",
            "A blog post stating 95% accuracy with no citation",
            "An AI-generated summary of several papers on the topic",
            "A YouTube lecture by a well-known AI engineer"
          ],
          "answer": 0,
          "why": {
            "en": "A documented, reproducible, peer-reviewed study is traceable evidence — the best basis for a claim.",
            "ru": "Описанное, воспроизводимое, рецензируемое исследование — прослеживаемое доказательство, лучшая опора для утверждения."
          },
          "wrong": [
            {
              "en": "No citation and no method: the claim cannot be traced or verified.",
              "ru": "Нет ссылки и нет метода: утверждение нельзя проследить и проверить."
            },
            {
              "en": "An AI summary without citations is not verifiable and may even invent findings.",
              "ru": "Пересказ от ИИ без ссылок нельзя проверить, и он может даже выдумать результаты."
            },
            {
              "en": "Popularity is not evidence; trace the claim to the original scholarly source.",
              "ru": "Популярность — не доказательство; утверждение прослеживают до научного первоисточника."
            }
          ],
          "id": "rm-l4-p1-6"
        },
        {
          "q": "A Wikipedia paragraph states a key fact you want to use. What is the correct move?",
          "options": [
            "Follow its references to the original scholarly source",
            "Cite Wikipedia, since it is edited by many people",
            "Ignore the fact entirely, since Wikipedia is always wrong",
            "Rephrase it so that no citation is needed"
          ],
          "answer": 0,
          "why": {
            "en": "Use Wikipedia for orientation, then trace the claim to the scholarly source and cite that.",
            "ru": "Википедия — для ориентации; затем утверждение прослеживают до научного источника и цитируют его."
          },
          "wrong": [
            {
              "en": "Community editing does not make it evidence; it may be outdated or unsourced.",
              "ru": "Редактирование сообществом не делает её доказательством; она может быть устаревшей или без источников."
            },
            {
              "en": "Wikipedia is fine for orientation — just not as the evidence you cite.",
              "ru": "Википедия годится для ориентации — просто её не цитируют как доказательство."
            },
            {
              "en": "Rephrasing a claim without its source is still using unverified information.",
              "ru": "Пересказ утверждения без источника — всё равно использование непроверенной информации."
            }
          ],
          "id": "rm-l4-p1-7"
        },
        {
          "q": "What makes a source primary?",
          "options": [
            "Its authors conducted and reported the study themselves",
            "It was published in a peer-reviewed journal",
            "It appears as the very first result in Google Scholar search",
            "It summarises all of the important studies on a topic"
          ],
          "answer": 0,
          "why": {
            "en": "A primary source is original research reported by the people who did it — the closest you get to the evidence.",
            "ru": "Первичный источник — оригинальное исследование, описанное теми, кто его провёл; ближе к доказательствам не подойти."
          },
          "wrong": [
            {
              "en": "Peer review is quality control; a peer-reviewed review article is still secondary.",
              "ru": "Рецензирование — контроль качества; рецензируемая обзорная статья всё равно вторична."
            },
            {
              "en": "Search ranking says nothing about whether the work is original research.",
              "ru": "Место в выдаче ничего не говорит о том, оригинальное ли это исследование."
            },
            {
              "en": "Summarising other studies is exactly what a secondary source does.",
              "ru": "Обобщать чужие исследования — это как раз работа вторичного источника."
            }
          ],
          "id": "rm-l4-p1-8"
        },
        {
          "q": "Which study type is designed to show that an intervention causes a change in an outcome?",
          "options": [
            "A randomised controlled trial",
            "An observational cohort study",
            "A semi-structured interview study",
            "A narrative literature review"
          ],
          "answer": 0,
          "why": {
            "en": "Random assignment makes the groups comparable, so a difference in the outcome can be attributed to the intervention.",
            "ru": "Случайное распределение делает группы сравнимыми, поэтому разницу в результате можно приписать вмешательству."
          },
          "wrong": [
            {
              "en": "It can show an association, but the groups were not randomised, so other differences may explain the result.",
              "ru": "Оно может показать связь, но группы не рандомизированы, и результат могут объяснять другие различия."
            },
            {
              "en": "Interviews explain experiences and reasons; they do not measure causal effects.",
              "ru": "Интервью объясняют опыт и причины, но не измеряют причинный эффект."
            },
            {
              "en": "A review summarises existing studies; it does not run a new controlled comparison.",
              "ru": "Обзор обобщает существующие работы и не проводит нового контролируемого сравнения."
            }
          ],
          "id": "rm-l4-p1-12"
        },
        {
          "q": "Which statement about information versus evidence matches the lecture?",
          "options": [
            "The key question is where a claim originally comes from",
            "Any source is fine if it sounds confident and precise",
            "Educational sources outrank research articles as evidence",
            "A claim repeated on many websites becomes evidence"
          ],
          "answer": 0,
          "why": {
            "en": "Not all sources are equal: ask where the claim comes from and trace it to the original scholarly source.",
            "ru": "Источники не равны: спрашивают, откуда утверждение, и прослеживают его до научного первоисточника."
          },
          "wrong": [
            {
              "en": "Confidence is not traceability; a precise-sounding number can be invented.",
              "ru": "Уверенный тон — не прослеживаемость; точное на вид число может быть выдумано."
            },
            {
              "en": "Textbooks and documentation are good for background; research articles are the evidence base.",
              "ru": "Учебники и документация хороши для фона; доказательная база — научные статьи."
            },
            {
              "en": "Repetition is not traceability; many sites may copy one unsourced claim.",
              "ru": "Повторение — не прослеживаемость; многие сайты могут копировать одно утверждение без источника."
            }
          ],
          "id": "rm-l4-p1-18"
        },
        {
          "q": "In a typical evidence summary, an observational study that counts accidents produces qualitative data.",
          "options": [
            "True",
            "False"
          ],
          "answer": 1,
          "fixed": true,
          "why": {
            "en": "Counting accidents gives numbers, so it is quantitative. 'Observational' means the researchers did not assign the groups, not that the data are words.",
            "ru": "Подсчёт аварий даёт числа, значит, это количественные данные. «Наблюдательное» значит, что группы не назначали, а не что данные — слова."
          },
          "wrong": [
            {
              "en": "'True' confuses an observational study with qualitative observation (field notes); here the label is about design, and the data are counts.",
              "ru": "Ответ «верно» путает наблюдательное исследование с качественным наблюдением (полевыми заметками); здесь название — про дизайн, а данные — подсчёты."
            }
          ],
          "id": "rm-l4-p1-19"
        }
      ]
    },
    {
      "id": "rm-l4-p2",
      "title": {
        "en": "Search strings, screening and strategic reading",
        "ru": "Поисковые строки, отсев и стратегическое чтение"
      },
      "notes": {
        "en": "## Where to search\nNo single database covers everything — choose by field and access.\n| Database | Strength |\n|---|---|\n| Google Scholar | broad, free, cross-disciplinary; a good starting point |\n| Scopus | large citation database with strong metrics |\n| Web of Science | high-quality journal indexing |\n| IEEE Xplore | engineering and computer science |\n| ACM Digital Library | computing and software research |\n| SpringerLink / ScienceDirect | broad scientific publishing |\nRegular Google is not Google Scholar: peer-reviewed research is found in academic databases.\n## Do not paste your research question\nToo specific: \"How do large language models make mistakes when answering Kazakh programming questions for university students?\" No paper uses exactly that phrasing, so the search returns very few results or none.\nBreak the RQ into **3–4 concepts**, give each concept **2–4 alternative terms**, then combine them:\n= Concepts → Synonyms → Keywords → Search query\n| Concept | Alternative terms |\n|---|---|\n| Large language models | LLM, \"large language model\", \"generative AI\", \"foundation model\" |\n| Kazakh | Kazakh, \"Kazakh language\", \"low-resource language\" |\n| Errors | \"factual error\", hallucination, factuality, accuracy |\n## The four tools of a search string\n| Tool | Job | Effect |\n|---|---|---|\n| AND | joins **different concepts**: every result must contain both | **narrows** |\n| OR | joins **alternative terms for one concept**: any one is enough | **broadens** |\n| \" \" | keeps a multi-word term together as an **exact phrase** | the words are not matched separately |\n| ( ) | **groups** the OR-alternatives of one concept into a block | the database reads the logic as intended |\nMost databases also support **truncation** with an asterisk: one word stem finds every ending.\n= accident* → accident, accidents, accidental\n## Tuning the balance\n- **Too many results** (thousands, off-topic): add a concept block with AND, use exact phrases, filter by years or document type.\n- **Too few results**: add synonyms with OR, use truncation, drop the narrowest block.\n- Write **at least two queries** and compare what each returns.\n## From 2,438 results to the relevant few\nA large result set is not success — it is the **start of filtering**. A paper that contains your keyword is **not automatically relevant**.\n= 2,438 results → titles → abstracts → keywords → relevance to RQ → method and context → full text\n**The 60-second paper test** — title → abstract → research aim → method → findings → **YES**: keep and read more, **NO**: move on. It is a **screening tool, not a replacement for careful reading.**",
        "ru": "## Где искать\nНи одна база не покрывает всё — выбирают по области и доступу.\n| База | Сильная сторона |\n|---|---|\n| Google Scholar | широкая, бесплатная, междисциплинарная; хорошая точка старта |\n| Scopus | большая база цитирований с сильными метриками |\n| Web of Science | индексация журналов высокого качества |\n| IEEE Xplore | инженерия и computer science |\n| ACM Digital Library | вычисления и исследования ПО |\n| SpringerLink / ScienceDirect | широкий круг научных изданий |\nОбычный Google — не Google Scholar: рецензируемые исследования ищут в академических базах.\n## Не вставлять исследовательский вопрос целиком\nСлишком конкретно: «How do large language models make mistakes when answering Kazakh programming questions for university students?» Ни одна статья не сформулирована именно так, поэтому поиск даёт очень мало результатов или ноль.\nRQ разбивают на **3–4 понятия (concepts)**, к каждому подбирают **2–4 альтернативных термина**, затем соединяют:\n= Concepts → Synonyms → Keywords → Search query\n| Понятие | Альтернативные термины |\n|---|---|\n| Большие языковые модели | LLM, \"large language model\", \"generative AI\", \"foundation model\" |\n| Казахский | Kazakh, \"Kazakh language\", \"low-resource language\" |\n| Ошибки | \"factual error\", hallucination, factuality, accuracy |\n## Четыре инструмента поисковой строки\n| Инструмент | Задача | Эффект |\n|---|---|---|\n| AND | соединяет **разные понятия**: в каждом результате должны быть оба | **сужает** |\n| OR | соединяет **альтернативные термины одного понятия**: достаточно любого | **расширяет** |\n| \" \" | держит многословный термин вместе как **точную фразу** | слова не ищутся по отдельности |\n| ( ) | **группирует** OR-альтернативы одного понятия в блок | база читает логику так, как задумано |\nБольшинство баз поддерживают и **усечение (truncation)** звёздочкой: одна основа слова находит все окончания.\n= accident* → accident, accidents, accidental\n## Настройка баланса\n- **Слишком много результатов** (тысячи, не по теме): добавить блок-понятие через AND, взять точные фразы, отфильтровать по годам или типу публикации.\n- **Слишком мало результатов**: добавить синонимы через OR, применить усечение, убрать самый узкий блок.\n- Стоит написать **минимум два запроса** и сравнить, что даёт каждый.\n## От 2 438 результатов к нескольким нужным\nБольшая выдача — не успех, а **начало отсева**. Статья с вашим ключевым словом **не обязательно релевантна**.\n= 2,438 results → titles → abstracts → keywords → relevance to RQ → method and context → full text\n**Тест статьи за 60 секунд (60-second paper test)** — название → аннотация → цель исследования → метод → результаты → **ДА**: оставить и читать дальше, **НЕТ**: идти дальше. Это **инструмент отсева, а не замена внимательному чтению.**"
      },
      "questions": [
        {
          "q": "In a search string, what is the job of AND?",
          "options": [
            "It joins different concepts, so results narrow",
            "It joins synonyms of one concept, so results grow",
            "It marks an exact multi-word phrase to match",
            "It excludes papers containing the next term"
          ],
          "answer": 0,
          "why": {
            "en": "AND connects different concepts: every result must contain a term from each block, so the set gets smaller.",
            "ru": "AND соединяет разные понятия: в каждом результате должен быть термин из каждого блока, поэтому выдача уменьшается."
          },
          "wrong": [
            {
              "en": "That is OR; AND requires every term, so it narrows.",
              "ru": "Это OR; AND требует каждого термина, поэтому сужает."
            },
            {
              "en": "Exact phrases are made with quotation marks.",
              "ru": "Точные фразы задают кавычками."
            },
            {
              "en": "Excluding is done with NOT, which the template does not need.",
              "ru": "Исключение делают через NOT, а шаблону он не нужен."
            }
          ],
          "id": "rm-l4-p2-2"
        },
        {
          "q": "How should the 60-second paper test be used?",
          "options": [
            "To decide whether a paper deserves a careful read",
            "As a full replacement for reading the paper",
            "To check the citation count and the journal impact factor",
            "To summarise the paper in your literature review"
          ],
          "answer": 0,
          "why": {
            "en": "Title → abstract → aim → method → findings: YES keep and read more, NO move on.",
            "ru": "Название → аннотация → цель → метод → результаты: ДА — оставить и читать дальше, НЕТ — идти дальше."
          },
          "wrong": [
            {
              "en": "It is a screening tool, not a replacement for careful reading.",
              "ru": "Это инструмент отсева, а не замена внимательному чтению."
            },
            {
              "en": "The test looks at title, abstract, aim, method and findings — not metrics.",
              "ru": "Тест смотрит на название, аннотацию, цель, метод и результаты, а не на метрики."
            },
            {
              "en": "The test only decides keep or move on; it does not write the review.",
              "ru": "Тест лишь решает «оставить или дальше»; обзор он не пишет."
            }
          ],
          "id": "rm-l4-p2-4"
        },
        {
          "q": "What is the purpose of the parentheses in (accident* OR \"near-miss\")?",
          "options": [
            "To group the synonyms of one concept into one block",
            "To make every term in the bracket optional for the search",
            "To limit the search to the titles of papers only",
            "To mark the terms as a single exact phrase"
          ],
          "answer": 0,
          "why": {
            "en": "Brackets keep the OR-alternatives of one concept together, so AND is applied to the whole block.",
            "ru": "Скобки держат OR-альтернативы одного понятия вместе, и AND применяется ко всему блоку."
          },
          "wrong": [
            {
              "en": "Grouping does not make terms optional: at least one term of the block must still match.",
              "ru": "Группировка не делает термины необязательными: хотя бы один термин блока должен совпасть."
            },
            {
              "en": "Field restriction is a database filter, not brackets.",
              "ru": "Ограничение по полям — это фильтр базы, а не скобки."
            },
            {
              "en": "Exact phrases are made with quotation marks, not brackets.",
              "ru": "Точные фразы задают кавычками, а не скобками."
            }
          ],
          "id": "rm-l4-p2-5"
        },
        {
          "q": "What does the asterisk in accident* do in most databases?",
          "options": [
            "Finds every word that starts with accident",
            "Marks accident as the main keyword",
            "Excludes every paper that contains the word accident",
            "Matches only the exact word accident"
          ],
          "answer": 0,
          "why": {
            "en": "Truncation: one stem finds accident, accidents, accidental — useful inside an OR block.",
            "ru": "Усечение: одна основа находит accident, accidents, accidental — удобно внутри OR-блока."
          },
          "wrong": [
            {
              "en": "There is no importance marker; the asterisk is truncation.",
              "ru": "Отметки важности нет; звёздочка — это усечение."
            },
            {
              "en": "Exclusion is NOT; the asterisk widens the search.",
              "ru": "Исключение — это NOT; звёздочка расширяет поиск."
            },
            {
              "en": "The opposite: it also matches accidents and accidental.",
              "ru": "Наоборот: она находит и accidents, и accidental."
            }
          ],
          "id": "rm-l4-p2-6"
        },
        {
          "q": "A search returns 9,000 results, mostly off-topic. Which change helps most?",
          "options": [
            "Add another concept block joined with AND",
            "Add more synonyms with OR inside every concept block",
            "Remove the quotation marks from phrases",
            "Replace AND between blocks with OR"
          ],
          "answer": 0,
          "why": {
            "en": "Each extra AND block adds a required concept, which narrows the set to papers that really match the RQ.",
            "ru": "Каждый новый AND-блок добавляет обязательное понятие и сужает выдачу до статей, действительно подходящих к RQ."
          },
          "wrong": [
            {
              "en": "OR broadens — the results would grow further.",
              "ru": "OR расширяет — результатов станет ещё больше."
            },
            {
              "en": "Without quotes words match separately — even more results.",
              "ru": "Без кавычек слова ищутся по отдельности — результатов ещё больше."
            },
            {
              "en": "That would merge all blocks into one huge OR search.",
              "ru": "Так все блоки слились бы в один огромный OR-поиск."
            }
          ],
          "id": "rm-l4-p2-12"
        },
        {
          "q": "A search returns only 6 papers. What is a sensible first fix?",
          "options": [
            "Add synonyms with OR and use truncation",
            "Add a fourth concept block with AND",
            "Put the whole research question in quotes",
            "Restrict the search to the last 12 months"
          ],
          "answer": 0,
          "why": {
            "en": "More alternatives inside the blocks (and word stems with an asterisk) widen the search without losing the concepts.",
            "ru": "Больше альтернатив внутри блоков (и основы слов со звёздочкой) расширяют поиск, не теряя понятий."
          },
          "wrong": [
            {
              "en": "AND narrows further — even fewer results.",
              "ru": "AND сужает ещё сильнее — результатов станет меньше."
            },
            {
              "en": "A full sentence in quotes matches almost nothing.",
              "ru": "Целое предложение в кавычках почти ни с чем не совпадёт."
            },
            {
              "en": "A date filter removes papers; it does not add any.",
              "ru": "Фильтр по датам убирает статьи, а не добавляет."
            }
          ],
          "id": "rm-l4-p2-13"
        },
        {
          "q": "Why does pasting the whole research question into the search bar usually fail?",
          "options": [
            "Almost no paper uses that exact phrasing",
            "Databases accept one word per search",
            "Questions are blocked by academic databases",
            "It always returns millions of irrelevant hits"
          ],
          "answer": 0,
          "why": {
            "en": "Break the RQ into concepts, find synonyms, then build the query.",
            "ru": "RQ разбивают на понятия, подбирают синонимы и только потом строят запрос."
          },
          "wrong": [
            {
              "en": "They accept long queries; the problem is the over-specific phrasing.",
              "ru": "Базы принимают длинные запросы; проблема в слишком конкретной формулировке."
            },
            {
              "en": "Nothing is blocked; the phrasing just matches almost nothing.",
              "ru": "Ничего не блокируется; формулировка просто почти ни с чем не совпадает."
            },
            {
              "en": "The typical result is too FEW hits, not too many.",
              "ru": "Типичный итог — слишком МАЛО результатов, а не слишком много."
            }
          ],
          "id": "rm-l4-p2-14"
        },
        {
          "q": "In which order is a search query built?",
          "options": [
            "Concepts → synonyms → keywords → query",
            "Query → keywords → synonyms → concepts",
            "Keywords → query → concepts → synonyms",
            "Synonyms → concepts → query → keywords"
          ],
          "answer": 0,
          "why": {
            "en": "Name the concepts of the RQ, list alternative terms, choose keywords, then combine them with operators.",
            "ru": "Называют понятия RQ, перечисляют альтернативные термины, выбирают ключевые слова и соединяют их операторами."
          },
          "wrong": [
            {
              "en": "Reversed: the query is the last step, not the first.",
              "ru": "Наоборот: запрос — последний шаг, а не первый."
            },
            {
              "en": "Concepts must come first; otherwise there is nothing to find synonyms for.",
              "ru": "Понятия идут первыми, иначе не к чему подбирать синонимы."
            },
            {
              "en": "Synonyms are found for concepts, so concepts come before synonyms.",
              "ru": "Синонимы подбирают к понятиям, поэтому понятия идут раньше."
            }
          ],
          "id": "rm-l4-p2-15"
        },
        {
          "q": "A software engineering student needs conference papers on code review tools. Which databases fit best?",
          "options": [
            "IEEE Xplore and the ACM Digital Library",
            "Wikipedia and YouTube lecture series",
            "Web of Science alone, as it covers everything",
            "Regular Google, since it indexes all papers"
          ],
          "answer": 0,
          "why": {
            "en": "IEEE Xplore and ACM DL focus on computing and software research, including conference papers.",
            "ru": "IEEE Xplore и ACM DL специализируются на computing и ПО, включая доклады конференций."
          },
          "wrong": [
            {
              "en": "These are informal sources, not academic databases.",
              "ru": "Это неформальные источники, а не академические базы."
            },
            {
              "en": "No single database covers everything.",
              "ru": "Ни одна база не покрывает всё."
            },
            {
              "en": "Google is not Google Scholar; it does not surface peer-reviewed research systematically.",
              "ru": "Google — не Google Scholar; он не находит рецензируемые исследования систематически."
            }
          ],
          "id": "rm-l4-p2-16"
        },
        {
          "q": "A query returns 2,438 papers. What does the lecture say this means?",
          "options": [
            "It is the beginning of a filtering process",
            "The literature search is complete",
            "The query is too narrow and needs OR",
            "Every one of the papers must now be read in full"
          ],
          "answer": 0,
          "why": {
            "en": "A keyword match is not relevance: titles, abstracts and methods are screened before any full read.",
            "ru": "Совпадение по ключевому слову — не релевантность: до полного чтения отсеивают по названиям, аннотациям и методам."
          },
          "wrong": [
            {
              "en": "A large result set is not success; the papers still have to be screened.",
              "ru": "Большая выдача — не успех; статьи ещё предстоит отсеять."
            },
            {
              "en": "2,438 is a lot — too narrow is not the issue.",
              "ru": "2 438 — это много; слишком узко — не та проблема."
            },
            {
              "en": "Nobody reads 2,438 papers; screen titles and abstracts first.",
              "ru": "2 438 статей никто не читает; сначала отсеивают по названиям и аннотациям."
            }
          ],
          "id": "rm-l4-p2-17"
        },
        {
          "q": "What is the correct order of the paper filter after the keyword search?",
          "options": [
            "Titles → abstracts → relevance to RQ → method → full text",
            "Full text → method → relevance to RQ → abstracts → titles",
            "Abstracts → full text → titles → method → relevance to RQ",
            "Method → titles → full text → abstracts → relevance to RQ"
          ],
          "answer": 0,
          "why": {
            "en": "Each stage is more expensive, so it is applied to fewer papers: titles first, full text last.",
            "ru": "Каждая стадия дороже предыдущей, поэтому применяется к меньшему числу статей: сначала названия, в конце полный текст."
          },
          "wrong": [
            {
              "en": "Reversed: the most expensive step, the full text, comes last.",
              "ru": "Наоборот: самый дорогой шаг — полный текст — идёт последним."
            },
            {
              "en": "Reading full texts before checking titles wastes hours.",
              "ru": "Читать полные тексты до проверки названий — потеря часов."
            },
            {
              "en": "Method checks come after the cheap title and abstract screens.",
              "ru": "Метод проверяют после быстрого отсева по названиям и аннотациям."
            }
          ],
          "id": "rm-l4-p2-18"
        },
        {
          "q": "In the strategic reading order, what comes right after the title and abstract?",
          "options": [
            "The conclusion section",
            "The method section",
            "The full reference list",
            "The related-work section"
          ],
          "answer": 0,
          "why": {
            "en": "Title and abstract → conclusion → method → results → full text if relevant.",
            "ru": "Название и аннотация → заключение → метод → результаты → полный текст, если релевантно."
          },
          "wrong": [
            {
              "en": "The method comes third, after the conclusion.",
              "ru": "Метод идёт третьим, после заключения."
            },
            {
              "en": "References are not part of the strategic order at all.",
              "ru": "Список литературы вообще не входит в стратегический порядок."
            },
            {
              "en": "Related work is not an early step in the strategic order.",
              "ru": "Обзор смежных работ — не ранний шаг стратегического порядка."
            }
          ],
          "id": "rm-l4-p2-19"
        },
        {
          "q": "Adding one more concept block with AND usually increases the number of results.",
          "options": [
            "True",
            "False"
          ],
          "answer": 1,
          "fixed": true,
          "why": {
            "en": "AND requires every block to match, so each new AND block narrows the result set.",
            "ru": "AND требует совпадения каждого блока, поэтому каждый новый AND-блок сужает выдачу."
          },
          "wrong": [
            {
              "en": "'True' confuses AND with OR: only more OR-alternatives widen a search.",
              "ru": "Ответ «верно» путает AND и OR: расширяют поиск только новые OR-альтернативы."
            }
          ],
          "id": "rm-l4-p2-20"
        }
      ]
    },
    {
      "id": "rm-l4-p3",
      "title": {
        "en": "Synthesis, the evidence matrix and the research gap",
        "ru": "Синтез, матрица доказательств и исследовательский пробел"
      },
      "notes": {
        "en": "## From reading to synthesis\nA literature review connects findings instead of listing papers one by one. Compare the research questions, participants, methods, measurements and limitations before drawing a shared conclusion.\n## Use an evidence matrix\n- Record the question and context of each paper.\n- Record its design, sample and measures.\n- Separate the reported finding from the authors' interpretation.\n- Record limitations and the claim each source can support.\n## Build an analytical paragraph\nState the shared point, compare the evidence, explain a relevant difference and identify what remains unresolved. Different results can reflect different methods or populations; they do not automatically show that one paper is wrong.\n## A defensible research gap\nA gap is an unresolved issue supported by the review: a missing population, a methodological limitation, inconsistent findings or inadequate evaluation. Check whether newer work has already addressed it and whether the proposed study can investigate it.\n## Keep claims proportional to evidence\nUse cautious language when evidence is limited. A small or narrowly sampled study cannot justify a claim about every population. Cite the relevant sources and distinguish established findings from the question your study will ask.",
        "ru": "## От чтения к синтезу\nОбзор литературы связывает результаты, а не перечисляет статьи по одной. Прежде чем делать общий вывод, сравни исследовательские вопросы, участников, методы, измерения и ограничения.\n## Используй матрицу доказательств\n- Запиши вопрос и контекст каждой статьи.\n- Запиши дизайн, выборку и измеряемые показатели.\n- Отдели полученный результат от интерпретации авторов.\n- Запиши ограничения и утверждение, которое источник может поддержать.\n## Построй аналитический абзац\nСформулируй общую мысль, сопоставь доказательства, объясни важное различие и укажи нерешённый вопрос. Разные результаты могут объясняться методами или группами; это не доказывает автоматически ошибку одной статьи.\n## Обоснованный исследовательский пробел\nПробел — нерешённый вопрос, подтверждённый обзором: неизученная группа, ограничение метода, противоречивые результаты или недостаточная оценка. Проверь, не закрыт ли он новыми работами и может ли предложенное исследование его изучить.\n## Соизмеряй утверждения с доказательствами\nПри ограниченных данных используй осторожные формулировки. Небольшая или узкая выборка не позволяет делать вывод обо всех группах. Ссылайся на соответствующие источники и отличай известные результаты от вопроса будущего исследования."
      },
      "questions": [
        {
          "q": "What is an evidence matrix?",
          "options": [
            "A table comparing papers across the same columns",
            "A list of all the references sorted in alphabetical order",
            "A chart of how often each paper is cited",
            "A short summary written for each paper"
          ],
          "answer": 0,
          "why": {
            "en": "Same columns (method, data, finding, limitation, what is missing) for every paper reveal patterns and gaps.",
            "ru": "Одинаковые столбцы (метод, данные, результат, ограничение, чего не хватает) для каждой статьи показывают закономерности и пробелы."
          },
          "wrong": [
            {
              "en": "That is a reference list, not an analysis tool.",
              "ru": "Это список литературы, а не инструмент анализа."
            },
            {
              "en": "Citation counts are not what the matrix records.",
              "ru": "Матрица не фиксирует число цитирований."
            },
            {
              "en": "Separate summaries are exactly what the matrix replaces.",
              "ru": "Отдельные пересказы — как раз то, что матрица заменяет."
            }
          ],
          "id": "rm-l4-p3-8"
        },
        {
          "q": "Reading DOWN one column of an evidence matrix, such as 'Limitation', helps you to…",
          "options": [
            "Write one theme paragraph across several studies",
            "Summarise one paper in full detail from start to end",
            "Check that the reference list follows APA format",
            "Count how many papers each author wrote"
          ],
          "answer": 0,
          "why": {
            "en": "A column collects one aspect for all studies — exactly the material for a synthesis paragraph.",
            "ru": "Столбец собирает один аспект по всем исследованиям — ровно материал для абзаца-синтеза."
          },
          "wrong": [
            {
              "en": "One paper in full is a row, not a column.",
              "ru": "Одна статья целиком — это строка, а не столбец."
            },
            {
              "en": "The matrix is about content, not citation formatting.",
              "ru": "Матрица — про содержание, а не про оформление ссылок."
            },
            {
              "en": "Author productivity is not part of the matrix.",
              "ru": "Продуктивность авторов в матрицу не входит."
            }
          ],
          "id": "rm-l4-p3-9"
        },
        {
          "q": "What is the correct order of the gap formula?",
          "options": [
            "We know → However → We still do not know → Therefore",
            "However → We know → Therefore → We still do not know",
            "We still do not know → We know → However → Therefore",
            "We know → Therefore → However → We still do not know"
          ],
          "answer": 0,
          "why": {
            "en": "Known → limitation or disagreement → what is still unknown → what this study will do.",
            "ru": "Известное → ограничение или расхождение → что ещё неизвестно → что сделает это исследование."
          },
          "wrong": [
            {
              "en": "The formula starts from established knowledge, not from 'however'.",
              "ru": "Формула начинается с установленного знания, а не с «однако»."
            },
            {
              "en": "The unknown comes after the known and the 'however'.",
              "ru": "Неизвестное идёт после известного и «однако»."
            },
            {
              "en": "'Therefore, this study will…' is the conclusion, so it comes last.",
              "ru": "«Therefore, this study will…» — вывод, он идёт последним."
            }
          ],
          "id": "rm-l4-p3-15"
        },
        {
          "q": "A paper's 'Future work' says: 'Other languages should be tested.' What must you do before claiming this as your gap?",
          "options": [
            "Check newer papers in case it has been done since",
            "Nothing — the author's suggestion proves the gap",
            "Copy the sentence into your proposal as your own",
            "Email the author to ask for permission to study it"
          ],
          "answer": 0,
          "why": {
            "en": "Verify: has it been done since, is it relevant to your project, and can you realistically investigate it?",
            "ru": "Проверить: не сделано ли это позже, относится ли к проекту и реально ли это исследовать."
          },
          "wrong": [
            {
              "en": "Future work is a clue, not proof; someone may have done it already.",
              "ru": "Future work — подсказка, а не доказательство; это уже могли сделать."
            },
            {
              "en": "Copying without citation is plagiarism.",
              "ru": "Копирование без ссылки — плагиат."
            },
            {
              "en": "No permission is needed; verification is.",
              "ru": "Разрешение не нужно; нужна проверка."
            }
          ],
          "id": "rm-l4-p3-17"
        },
        {
          "q": "A good synthesis paragraph may mention a study's limitation as part of the argument.",
          "options": [
            "True",
            "False"
          ],
          "answer": 0,
          "fixed": true,
          "why": {
            "en": "Limitations are clues: a shared limitation often leads straight to the gap at the end of the paragraph.",
            "ru": "Ограничения — подсказки: общее ограничение часто прямо ведёт к пробелу в конце абзаца."
          },
          "wrong": [
            {
              "en": "'False' treats limitations as weaknesses to hide; the lecture calls them clues, not dead ends.",
              "ru": "Ответ «неверно» считает ограничения слабостью, которую надо прятать; лекция называет их подсказками, а не тупиками."
            }
          ],
          "id": "rm-l4-p3-18"
        },
        {
          "q": "A research gap means that nobody in the world has ever studied the topic.",
          "options": [
            "True",
            "False"
          ],
          "answer": 1,
          "fixed": true,
          "why": {
            "en": "A gap is specific: limited evidence, contradictory results, an understudied context or outdated evidence — justified by the literature.",
            "ru": "Пробел конкретен: мало доказательств, противоречивые результаты, малоизученный контекст или устаревшие данные — и он обоснован литературой."
          },
          "wrong": [
            {
              "en": "'True' sets an impossible bar: almost every topic has been studied somewhere.",
              "ru": "Ответ «верно» ставит недостижимую планку: почти любую тему где-то уже изучали."
            }
          ],
          "id": "rm-l4-p3-19"
        }
      ]
    },
    {
      "id": "rm-l4-p4",
      "title": {
        "en": "From gap to a one-page research plan",
        "ru": "От пробела к плану исследования на одну страницу"
      },
      "notes": {
        "en": "## Now we can plan\nThe literature review was not background reading — it showed **why** your study may be needed.\n= Literature → Synthesis → Evidence → Research gap → Research question\n## What a research plan is\nA **logical plan for turning a research question into evidence**. In Week 4 it is **preliminary** — the full methodology comes from Week 5. It answers five questions:\n- What **evidence** do I need to answer my RQ?\n- **Where** can I get that evidence or data?\n- **How** could I collect or generate it?\n- How could I **analyse** it?\n- Can I actually do it — is it **feasible**?\n## Methods are not a shopping list\nBad: \"For my research I will use: survey, interview, experiment, machine learning, ChatGPT.\" — no link to the RQ; it is a list of things the student knows how to do.\n> A method is selected because it helps answer the research question — not because it sounds impressive or was learned in another course.\n## Research question → evidence\n| Research question | Possible evidence | Data |\n|---|---|---|\n| What types of errors occur in Kazakh LLM responses? | LLM responses collected systematically + manual error annotation and classification | categories, then counts |\n| Why do students stop using an educational app? | user interviews + app usage logs showing drop-off points | qualitative + quantitative |\n| Does Tool X reduce debugging time? | task completion time in an experiment with and without Tool X | quantitative |\nRule of thumb: **why / how / what is it like** → interviews (qualitative); **does X change Y / by how much** → experiment or measurement (quantitative); **how often / is X related to Y** → existing data, logs or a survey.\n## Reality check: is it feasible?\nSix checks: **time · data access · computing · skills · ethics · scope.** Green — feasible, proceed. Yellow — needs changes, adjust the scope. Red — not feasible yet, redesign.\nThe GPU story: \"I will train a new 70B-parameter LLM from scratch\" — a personal laptop, 12 weeks, no GPU cluster, no training dataset, no compute budget. A legitimate research **area**, but **not a feasible plan**.\n> Adjust the scope — not the ambition.\n## Exit ticket\nCan you name: your RQ · 3–5 keywords · what the literature already says · one contradiction or limitation · your possible gap · the evidence you need · an honest answer on feasibility?\n> Don't just find papers — find the story the papers are telling.\n?? Plan: RQ \"Does Tool X reduce debugging time?\", method \"interviews with 10 developers\". What is wrong?\n?= Misalignment: the RQ asks for a measured effect (quantitative), but interviews give opinions. Measure task completion time with and without Tool X.\n?? Name the six feasibility checks.\n?= Time, data access, computing, skills, ethics, scope.",
        "ru": "## Теперь можно планировать\nОбзор литературы был не фоновым чтением — он показал, **зачем** может быть нужно ваше исследование.\n= Literature → Synthesis → Evidence → Research gap → Research question\n## Что такое план исследования\n**План исследования (research plan)** — логический план того, как превратить исследовательский вопрос в доказательства. На 4-й неделе он **предварительный** — полная методология начинается с 5-й недели. Он отвечает на пять вопросов:\n- Какие **доказательства** нужны, чтобы ответить на RQ?\n- **Где** взять эти доказательства или данные?\n- **Как** их можно собрать или получить?\n- Как их **анализировать**?\n- Получится ли это на деле — **выполнимо ли (feasible)**?\n## Методы — не список покупок\nПлохо: «For my research I will use: survey, interview, experiment, machine learning, ChatGPT.» — никакой связи с RQ; это перечень того, что студент умеет делать.\n> Метод выбирают потому, что он помогает ответить на исследовательский вопрос, — а не потому, что звучит солидно или изучался на другом курсе.\n## Исследовательский вопрос → доказательства\n| Исследовательский вопрос | Возможные доказательства | Данные |\n|---|---|---|\n| Какие типы ошибок бывают в ответах LLM на казахском? | систематически собранные ответы LLM + ручная разметка и классификация ошибок | категории, затем подсчёт |\n| Почему студенты перестают пользоваться учебным приложением? | интервью с пользователями + логи использования, где видно, на каком шаге уходят | качественные + количественные |\n| Сокращает ли Tool X время отладки? | время выполнения задачи в эксперименте с Tool X и без него | количественные |\nПравило: **почему / как / каково это** → интервью (качественные данные); **меняет ли X величину Y / насколько** → эксперимент или измерение (количественные); **как часто / связан ли X с Y** → готовые данные, логи или опрос.\n## Проверка реальностью: выполнимо ли?\nШесть проверок: **время · доступ к данным · вычисления · навыки · этика · объём (scope).** Зелёный — выполнимо, можно начинать. Жёлтый — нужны изменения, сузить объём. Красный — пока невыполнимо, перепроектировать.\nИстория про GPU: «Обучу новую LLM на 70 млрд параметров с нуля» — личный ноутбук, 12 недель, нет GPU-кластера, нет обучающего датасета, нет вычислительного бюджета. Законная исследовательская **область**, но **невыполнимый план**.\n> Сужать объём, а не амбиции (adjust the scope — not the ambition).\n## Exit ticket\nПолучится ли назвать: свой RQ · 3–5 ключевых слов · что уже говорит литература · одно противоречие или ограничение · возможный пробел · нужные доказательства · честный ответ о выполнимости?\n> Искать не просто статьи — искать историю, которую они рассказывают.\n?? План: RQ «Сокращает ли Tool X время отладки?», метод — «интервью с 10 разработчиками». Что не так?\n?= Рассогласование: RQ спрашивает об измеряемом эффекте (количественные данные), а интервью дают мнения. Нужно измерить время выполнения задач с Tool X и без него.\n?? Назовите шесть проверок выполнимости.\n?= Время, доступ к данным, вычисления, навыки, этика, объём (scope)."
      },
      "questions": [
        {
          "q": "What is a research plan at the Week 4 stage?",
          "options": [
            "A preliminary logical plan for turning an RQ into evidence",
            "A complete methodology chapter with every statistical test",
            "A list of the methods the student already knows",
            "A timetable of lectures and assignment deadlines"
          ],
          "answer": 0,
          "why": {
            "en": "It asks: what evidence, where from, how to collect, how to analyse, is it feasible.",
            "ru": "Он спрашивает: какие доказательства, откуда, как собрать, как анализировать, выполнимо ли."
          },
          "wrong": [
            {
              "en": "The full methodology comes later, from Week 5.",
              "ru": "Полная методология будет позже, с 5-й недели."
            },
            {
              "en": "That is the 'shopping list' mistake.",
              "ru": "Это ошибка «списка покупок»."
            },
            {
              "en": "A course schedule is not a research plan.",
              "ru": "Расписание курса — не план исследования."
            }
          ],
          "id": "rm-l4-p4-1"
        },
        {
          "q": "'For my research I will use: survey, interview, experiment, machine learning, ChatGPT.' What is wrong?",
          "options": [
            "The methods are not linked to the research question",
            "It lists far too few methods for a strong, convincing study",
            "ChatGPT may never be used in research",
            "Surveys and interviews cannot be combined"
          ],
          "answer": 0,
          "why": {
            "en": "A method is chosen because it helps answer the RQ, not because it sounds impressive.",
            "ru": "Метод выбирают, потому что он помогает ответить на RQ, а не потому, что звучит солидно."
          },
          "wrong": [
            {
              "en": "More methods would not help; the issue is that none is tied to the RQ.",
              "ru": "Больше методов не помогло бы; проблема в том, что ни один не связан с RQ."
            },
            {
              "en": "AI tools can help with keywords and notes if used honestly; that is not the issue.",
              "ru": "ИИ-инструменты могут помогать с ключевыми словами и заметками при честном использовании; дело не в этом."
            },
            {
              "en": "Mixed methods are legitimate when the RQ justifies them.",
              "ru": "Смешанные методы допустимы, если их оправдывает RQ."
            }
          ],
          "id": "rm-l4-p4-2"
        },
        {
          "q": "RQ: 'Does Tool X reduce debugging time?' Which evidence fits?",
          "options": [
            "Task times measured with and without Tool X",
            "Interviews about how developers feel about Tool X",
            "A survey asking which IDE developers prefer",
            "A literature list of debugging tools"
          ],
          "answer": 0,
          "why": {
            "en": "An experimental comparison of task completion time directly answers 'does it reduce time'.",
            "ru": "Экспериментальное сравнение времени выполнения задач прямо отвечает на «сокращает ли время»."
          },
          "wrong": [
            {
              "en": "Feelings do not measure time; the RQ asks for a measured effect.",
              "ru": "Ощущения не измеряют время; RQ спрашивает об измеряемом эффекте."
            },
            {
              "en": "IDE preference does not answer a question about debugging time.",
              "ru": "Предпочтения IDE не отвечают на вопрос о времени отладки."
            },
            {
              "en": "A list of tools produces no evidence about Tool X's effect.",
              "ru": "Список инструментов не даёт доказательств об эффекте Tool X."
            }
          ],
          "id": "rm-l4-p4-3"
        },
        {
          "q": "RQ: 'Why do students stop using an educational app?' Which evidence did the lecture suggest?",
          "options": [
            "User interviews plus usage logs showing drop-off points",
            "A controlled lab experiment measuring students' typing speed",
            "App store download counts for the last year",
            "A benchmark of the app's server response time"
          ],
          "answer": 0,
          "why": {
            "en": "Interviews explain why (qualitative); logs show where they drop off (quantitative).",
            "ru": "Интервью объясняют «почему» (качественные данные); логи показывают, где уходят (количественные)."
          },
          "wrong": [
            {
              "en": "Typing speed is unrelated to why students leave the app.",
              "ru": "Скорость печати не связана с тем, почему студенты уходят из приложения."
            },
            {
              "en": "Downloads show how many start, not why they stop.",
              "ru": "Загрузки показывают, сколько начали, а не почему бросили."
            },
            {
              "en": "Server speed is one possible cause, but it does not cover students' reasons.",
              "ru": "Скорость сервера — лишь одна возможная причина, она не раскрывает причин студентов."
            }
          ],
          "id": "rm-l4-p4-4"
        },
        {
          "q": "RQ: 'What types of errors occur in Kazakh LLM responses?' Which evidence fits?",
          "options": [
            "Collected responses with manual error annotation",
            "A survey on how much students like using the LLM in class",
            "Server logs showing response latency",
            "An RCT comparing two keyboard layouts"
          ],
          "answer": 0,
          "why": {
            "en": "Systematically collected responses, annotated and classified by hand, show which errors occur.",
            "ru": "Систематически собранные ответы, размеченные и классифицированные вручную, показывают, какие ошибки бывают."
          },
          "wrong": [
            {
              "en": "Liking the model says nothing about error types.",
              "ru": "Симпатия к модели ничего не говорит о типах ошибок."
            },
            {
              "en": "Latency is speed, not error type.",
              "ru": "Задержка — это скорость, а не тип ошибки."
            },
            {
              "en": "Keyboard layouts are unrelated to LLM errors.",
              "ru": "Раскладки клавиатуры не связаны с ошибками LLM."
            }
          ],
          "id": "rm-l4-p4-5"
        },
        {
          "q": "Which section of the one-page plan must be ONE clear sentence?",
          "options": [
            "Research aim — what the study intends to achieve",
            "Research problem — what is not sufficiently known",
            "Research procedure — how the study runs step by step",
            "Data source — who or what provides the data"
          ],
          "answer": 0,
          "why": {
            "en": "The template asks for one clear sentence stating what the study intends to achieve.",
            "ru": "Шаблон требует одно ясное предложение о том, чего исследование должно достичь."
          },
          "wrong": [
            {
              "en": "The problem takes 2–3 sentences.",
              "ru": "Проблеме отводят 2–3 предложения."
            },
            {
              "en": "The procedure is 3–5 logical steps.",
              "ru": "Процедура — это 3–5 логичных шагов."
            },
            {
              "en": "This section names participants or datasets with a size; no one-sentence rule.",
              "ru": "Здесь называют участников или датасеты с размером; правила «одно предложение» нет."
            }
          ],
          "id": "rm-l4-p4-6"
        },
        {
          "q": "How long should the research problem section be in the course template?",
          "options": [
            "2–3 sentences on what is unknown and why it matters",
            "One word naming the general research area",
            "A full page that reviews all of the related studies in detail",
            "3–5 numbered steps from data to results"
          ],
          "answer": 0,
          "why": {
            "en": "What problem exists, what is not sufficiently known, why it is worth investigating — in 2–3 sentences.",
            "ru": "Какая проблема есть, что недостаточно известно, почему стоит изучать — в 2–3 предложениях."
          },
          "wrong": [
            {
              "en": "One word cannot explain the problem, the unknown and its importance.",
              "ru": "Одно слово не объяснит проблему, неизвестное и его важность."
            },
            {
              "en": "The whole plan must fit one page; the problem is 2–3 sentences.",
              "ru": "Весь план должен уместиться на одной странице; проблема — 2–3 предложения."
            },
            {
              "en": "That is the research procedure section.",
              "ru": "Это раздел «процедура исследования»."
            }
          ],
          "id": "rm-l4-p4-7"
        },
        {
          "q": "Which item is an 'Expected analysis' entry rather than a data collection method?",
          "options": [
            "Thematic analysis of interview transcripts",
            "Semi-structured interviews with 12 users",
            "An online survey sent to two hundred students",
            "Mining commits from public repositories"
          ],
          "answer": 0,
          "why": {
            "en": "Analysis is what you do with the collected data: descriptive statistics, comparison, correlation, thematic analysis, model evaluation.",
            "ru": "Анализ — то, что делают с собранными данными: описательная статистика, сравнение, корреляция, тематический анализ, оценка модели."
          },
          "wrong": [
            {
              "en": "Interviews are a way to collect data.",
              "ru": "Интервью — способ собрать данные."
            },
            {
              "en": "A survey is a data collection method.",
              "ru": "Опрос — метод сбора данных."
            },
            {
              "en": "Repository analysis collects data; the analysis comes after.",
              "ru": "Анализ репозиториев собирает данные; анализ идёт потом."
            }
          ],
          "id": "rm-l4-p4-9"
        },
        {
          "q": "What is the length limit of the course research plan?",
          "options": [
            "One A4 page, not counting references",
            "Two pages, including the references",
            "Five pages, with a full literature review",
            "No limit, as long as it is detailed"
          ],
          "answer": 0,
          "why": {
            "en": "ONE A4 page, excluding the reference list — write concisely.",
            "ru": "ОДНА страница A4 без списка литературы — писать кратко."
          },
          "wrong": [
            {
              "en": "The limit is one page, and references are excluded.",
              "ru": "Лимит — одна страница, и список литературы не считается."
            },
            {
              "en": "It must be concise — one page, not an essay.",
              "ru": "План должен быть кратким — одна страница, а не эссе."
            },
            {
              "en": "There is a strict one-page limit.",
              "ru": "Есть жёсткий лимит в одну страницу."
            }
          ],
          "id": "rm-l4-p4-11"
        },
        {
          "q": "A student plans to train a new 70B-parameter LLM from scratch on a laptop in 12 weeks. What is the verdict?",
          "options": [
            "A legitimate area, but the plan is not feasible",
            "A bad question, because LLM training is not research",
            "A feasible plan if the student works every weekend",
            "A good plan: ambition matters most"
          ],
          "answer": 0,
          "why": {
            "en": "Good question area, infeasible plan: no GPU cluster, no dataset, no budget. Adjust the scope, not the ambition.",
            "ru": "Хорошая область, невыполнимый план: нет GPU-кластера, датасета и бюджета. Сужать объём, а не амбиции."
          },
          "wrong": [
            {
              "en": "LLM training is a legitimate research area.",
              "ru": "Обучение LLM — законная исследовательская область."
            },
            {
              "en": "Effort cannot replace a GPU cluster, data and a compute budget.",
              "ru": "Усердие не заменит GPU-кластер, данные и вычислительный бюджет."
            },
            {
              "en": "Ambition without resources does not produce results.",
              "ru": "Амбиции без ресурсов не дают результатов."
            }
          ],
          "id": "rm-l4-p4-12"
        },
        {
          "q": "Which response to an infeasible plan follows the lecture's advice?",
          "options": [
            "Keep the ambition but narrow the scope",
            "Drop the research area altogether",
            "Keep the plan and ask for a deadline extension",
            "Replace real data with invented results"
          ],
          "answer": 0,
          "why": {
            "en": "'Adjust the scope — not the ambition': e.g. fine-tune or evaluate an existing model instead of training one from scratch.",
            "ru": "«Сужать объём, а не амбиции»: например, дообучить или оценить готовую модель вместо обучения с нуля."
          },
          "wrong": [
            {
              "en": "The area can stay; the scope must shrink.",
              "ru": "Область можно оставить; сужать нужно объём."
            },
            {
              "en": "More time does not fix missing data or compute.",
              "ru": "Больше времени не решит нехватку данных или вычислений."
            },
            {
              "en": "Inventing data or results is research misconduct.",
              "ru": "Выдумывать данные или результаты — нарушение научной этики."
            }
          ],
          "id": "rm-l4-p4-13"
        },
        {
          "q": "Which set lists the six feasibility checks?",
          "options": [
            "Time, data access, computing, skills, ethics, scope",
            "Title, abstract, method, results, discussion, references",
            "Budget, marketing, team, design, branding, launch",
            "Concepts, synonyms, keywords, query, filter, read"
          ],
          "answer": 0,
          "why": {
            "en": "Time · data access · computing · skills · ethics · scope, each rated green, yellow or red.",
            "ru": "Время · доступ к данным · вычисления · навыки · этика · объём, каждое — зелёный, жёлтый или красный."
          },
          "wrong": [
            {
              "en": "Those are parts of a paper.",
              "ru": "Это части научной статьи."
            },
            {
              "en": "Those are business-project concerns, not the lecture's checklist.",
              "ru": "Это заботы бизнес-проекта, а не чек-лист лекции."
            },
            {
              "en": "Those are search steps.",
              "ru": "Это шаги поиска."
            }
          ],
          "id": "rm-l4-p4-14"
        },
        {
          "q": "A feasibility check comes out YELLOW. What does that mean?",
          "options": [
            "The plan needs changes, such as a smaller scope",
            "The plan is feasible and can start right away",
            "The plan must be completely redesigned",
            "The plan is on hold until the ethics committee replies"
          ],
          "answer": 0,
          "why": {
            "en": "Green — proceed; yellow — needs changes, adjust scope; red — not feasible yet, redesign.",
            "ru": "Зелёный — начинать; жёлтый — нужны изменения, сузить объём; красный — пока невыполнимо, перепроектировать."
          },
          "wrong": [
            {
              "en": "That is green.",
              "ru": "Это зелёный."
            },
            {
              "en": "That is red: not feasible yet.",
              "ru": "Это красный: пока невыполнимо."
            },
            {
              "en": "Yellow is about adjusting scope, not waiting for approval.",
              "ru": "Жёлтый — про корректировку объёма, а не про ожидание одобрения."
            }
          ],
          "id": "rm-l4-p4-15"
        },
        {
          "q": "Which chain does the course's final check require every plan to follow?",
          "options": [
            "Problem → Aim → RQ → Evidence → Method → Analysis",
            "Method → RQ → Problem → Aim → Evidence → Analysis",
            "Aim → Analysis → Method → Problem → RQ → Evidence",
            "Evidence → Problem → Analysis → RQ → Aim → Method"
          ],
          "answer": 0,
          "why": {
            "en": "Each element follows from the previous one; a break anywhere means the design must be revised there.",
            "ru": "Каждый элемент следует из предыдущего; разрыв в любом месте — сигнал исправить план именно там."
          },
          "wrong": [
            {
              "en": "Starting from the method is the shopping-list mistake.",
              "ru": "Начинать с метода — ошибка «списка покупок»."
            },
            {
              "en": "Analysis cannot come before the evidence and the method.",
              "ru": "Анализ не может идти раньше доказательств и метода."
            },
            {
              "en": "Evidence is chosen to answer the RQ, so it comes after it.",
              "ru": "Доказательства выбирают под RQ, поэтому они идут после него."
            }
          ],
          "id": "rm-l4-p4-17"
        },
        {
          "q": "In the research plan, a claim based on the literature may be stated without a citation if it is widely known.",
          "options": [
            "True",
            "False"
          ],
          "answer": 1,
          "fixed": true,
          "why": {
            "en": "The final check says claims based on literature are cited; do not invent sources, data, results or references.",
            "ru": "Финальная проверка требует ссылок для утверждений из литературы; нельзя выдумывать источники, данные, результаты и ссылки."
          },
          "wrong": [
            {
              "en": "'True' would let unsupported claims into the plan, and the oral check may ask for the evidence.",
              "ru": "Ответ «верно» пропустил бы в план неподкреплённые утверждения, а на устной проверке могут спросить о доказательствах."
            }
          ],
          "id": "rm-l4-p4-18"
        },
        {
          "q": "During the oral check the instructor asks 'Why this method?' Which answer is strongest?",
          "options": [
            "It produces exactly the evidence my RQ needs",
            "It is the method I know best from other courses",
            "It sounds impressive to the examiners",
            "Most students in my group chose it"
          ],
          "answer": 0,
          "why": {
            "en": "A method is justified by the evidence it produces for the specific RQ.",
            "ru": "Метод оправдывают тем, какие доказательства он даёт для конкретного RQ."
          },
          "wrong": [
            {
              "en": "Familiarity is not a reason; fit to the RQ is.",
              "ru": "Привычность — не причина; причина — соответствие RQ."
            },
            {
              "en": "Sounding impressive is exactly what the lecture warns against.",
              "ru": "Звучать солидно — именно то, от чего предостерегает лекция."
            },
            {
              "en": "Popularity says nothing about fit to your question.",
              "ru": "Популярность ничего не говорит о соответствии вопросу."
            }
          ],
          "id": "rm-l4-p4-19"
        },
        {
          "q": "Which RQ–method pair is aligned?",
          "options": [
            "'How often do bugs reopen?' — analysis of issue-tracker logs",
            "'Why do developers distrust AI tools?' — a CPU speed benchmark",
            "'Does Tool X speed up tests?' — interviews about feelings",
            "'How do novices feel about pair work?' — code size metrics"
          ],
          "answer": 0,
          "why": {
            "en": "'How often' is a frequency question, and existing issue-tracker data measure exactly that.",
            "ru": "«Как часто» — вопрос о частоте, и готовые данные трекера задач измеряют именно её."
          },
          "wrong": [
            {
              "en": "A 'why' question needs interviews, not hardware benchmarks.",
              "ru": "Вопросу «почему» нужны интервью, а не бенчмарки железа."
            },
            {
              "en": "A speed question needs measured times, not opinions.",
              "ru": "Вопросу о скорости нужно измеренное время, а не мнения."
            },
            {
              "en": "Feelings need qualitative data, not lines-of-code counts.",
              "ru": "Для ощущений нужны качественные данные, а не число строк кода."
            }
          ],
          "id": "rm-l4-p4-20"
        }
      ]
    }
  ]
};
