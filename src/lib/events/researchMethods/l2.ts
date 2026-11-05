import type { Lecture } from "../types";

/** Конспект и вопросы по темам лекции; учебные примеры заданий выделены отдельно. */
export const lecture2: Lecture = {
  "id": "rm-l2",
  "title": {
    "en": "Lecture 2 — Research detective: from problem to evidence to gap; developing research questions",
    "ru": "Лекция 2 — Детектив исследования: от проблемы к доказательствам и пробелу; исследовательский вопрос"
  },
  "parts": [
    {
      "id": "rm-l2-p1",
      "title": {
        "en": "From claim to problem statement",
        "ru": "От утверждения к постановке проблемы"
      },
      "notes": {
        "en": "## Where this lecture sits\nWeek 1 went from a broad **area** to a focused **topic** and a **problem**. Week 2 has two jobs: **prove** with academic literature that the problem deserves research attention, and turn it into a **research question** (RQ).\n= Problem → Evidence → Gap → Research question\nThe detective session has six steps: **keywords → find papers → screen fast → compare → detect the gap → refine the question**.\n> You already THINK you found a problem. Now PROVE IT.\n## Case #001: a claim is not research\n\"Kazakh-language LLMs are bad.\" Is this enough to open a research paper? **No.** It is an opinion until it is supported by measurable, documented evidence from prior scholarly work.\n| | Claim only | Research-based statement |\n|---|---|---|\n| Example | \"Kazakh LLMs have many problems.\" | \"Previous studies report limitations in factual accuracy for low-resource language LLMs, including Kazakh-language tasks.\" |\n| Source | \"I think so.\" | cited academic literature with a DOI |\n| In a paper? | no: not verifiable, not reproducible, not scholarly | yes: any reader can check the cited studies |\n= CLAIM + ACADEMIC EVIDENCE = RESEARCH ARGUMENT\n> Your first job is NOT to prove you are right. It is to discover what previous research actually says — even if it surprises you.\n## The three-part problem statement\n- **1. Current situation** — what is happening and who is affected. Neutral facts, no promises.\n- **2. Literature-supported limitation** — what previous research has not settled, **with citations**: evidence is limited, mixed, or comes from another population or context.\n- **3. Need for this study** — \"therefore\": what this study will investigate, tied to that limitation.\n= [Situation] X is increasingly used by Y. [Limitation] However, previous studies (Author, Year) focus on Z / report mixed results. [Need] Therefore, this study investigates ... among ...\nThe practical task asks the same thing as four questions: **What is happening? What is not sufficiently known or solved? Who or what is affected? Why is it worth investigating?**\nExample from the practical task: \"AI coding assistants are increasingly used by Software Engineering students. These tools can generate code quickly, but students may rely on generated solutions without fully understanding them. It is therefore important to investigate whether the use of AI coding assistants affects students' programming performance and code understanding.\" In a real paper the middle sentence needs a citation.",
        "ru": "## Место этой лекции\nНа неделе 1 путь шёл от широкой **области (area)** к сфокусированной **теме (topic)** и **проблеме (problem)**. У недели 2 две задачи: **доказать** с помощью научной литературы, что проблема заслуживает исследования, и превратить её в **исследовательский вопрос (research question, RQ)**.\n= Problem → Evidence → Gap → Research question\nВ «детективном» занятии шесть шагов: **ключевые слова → найти статьи → быстро отсеять → сравнить → найти пробел → уточнить вопрос**.\n> Вы уже ДУМАЕТЕ, что нашли проблему. Теперь это нужно ДОКАЗАТЬ.\n## Дело №001: утверждение — ещё не исследование\n«Kazakh-language LLMs are bad» («казахоязычные LLM плохие»). Хватит ли этого, чтобы начать научную статью? **Нет.** Это мнение, пока его не подкрепляют измеримые, задокументированные данные из прежних научных работ.\n| | Только утверждение (claim) | Утверждение на основе исследований |\n|---|---|---|\n| Пример | «У казахских LLM много проблем». | «Предыдущие исследования сообщают об ограничениях фактической точности LLM для малоресурсных языков, включая задачи на казахском». |\n| Источник | «Я так думаю». | цитируемая научная литература с DOI |\n| Годится для статьи? | нет: не проверить, не воспроизвести, не научно | да: любой читатель может проверить цитируемые работы |\n= CLAIM + ACADEMIC EVIDENCE = RESEARCH ARGUMENT\n> Первая задача — НЕ доказать свою правоту, а выяснить, что на самом деле говорят прежние исследования, даже если это удивит.\n## Постановка проблемы из трёх частей\n- **1. Текущая ситуация (current situation)** — что происходит и кого это касается. Нейтральные факты, без обещаний.\n- **2. Ограничение, подтверждённое литературой (literature-supported limitation)** — что прежние исследования не выяснили, **со ссылками**: данных мало, они противоречивы или получены на другой группе или в другом контексте.\n- **3. Потребность в этом исследовании (need for this study)** — «поэтому»: что именно изучит это исследование, в связке с этим ограничением.\n= [Situation] X is increasingly used by Y. [Limitation] However, previous studies (Author, Year) focus on Z / report mixed results. [Need] Therefore, this study investigates ... among ...\nПрактическое задание спрашивает то же самое четырьмя вопросами: **Что происходит? Что недостаточно известно или не решено? Кого или что это затрагивает? Почему это стоит исследовать?**\nПример из практического задания: «AI coding assistants are increasingly used by Software Engineering students. These tools can generate code quickly, but students may rely on generated solutions without fully understanding them. It is therefore important to investigate whether the use of AI coding assistants affects students' programming performance and code understanding.» В настоящей статье среднему предложению нужна ссылка."
      },
      "questions": [
        {
          "q": "A student starts a paper with “Kazakh-language LLMs are bad.” Why is this not acceptable as it stands?",
          "options": [
            "It is an opinion until documented evidence supports it",
            "It should be phrased as a research question instead of a statement",
            "It is too narrow a topic for a whole research paper",
            "It concerns a language with too few speakers to study"
          ],
          "answer": 0,
          "why": {
            "en": "Case #001: the verdict is NO. The sentence is an opinion until it is supported by measurable, documented evidence from prior scholarly work.",
            "ru": "Дело №001: вердикт — НЕТ. Это мнение, пока его не подкрепляют измеримые, задокументированные данные из прежних научных работ."
          },
          "wrong": [
            {
              "en": "Rephrasing it as a question adds no evidence; it would still be an unsupported opinion.",
              "ru": "Если переделать фразу в вопрос, доказательств не прибавится — это останется мнением без опоры."
            },
            {
              "en": "Narrowness is not the issue — a focused topic is desirable. The problem is that nothing backs the statement.",
              "ru": "Дело не в узости — сфокусированная тема как раз нужна. Проблема в том, что утверждение ничем не подкреплено."
            },
            {
              "en": "Any language can be studied; the number of speakers does not make a statement unscholarly.",
              "ru": "Изучать можно любой язык; число носителей не делает утверждение ненаучным."
            }
          ],
          "id": "rm-l2-p1-1"
        },
        {
          "q": "Which sentence could go into a research paper as it stands?",
          "options": [
            "“Previous studies report lower LLM accuracy in low-resource languages [1–3].”",
            "“Kazakh LLMs obviously have many serious problems, as every user already knows.”",
            "“I think LLMs are inaccurate in Kazakh because my own answers were wrong.”",
            "“Our team strongly believes LLMs will never be reliable for Kazakh tasks.”"
          ],
          "answer": 0,
          "why": {
            "en": "A research-based statement reports what previous studies found and points to the sources, so any reader can verify it: claim + academic evidence.",
            "ru": "Утверждение на основе исследований сообщает, что нашли прежние работы, и указывает источники — любой читатель может их проверить: утверждение + научные доказательства."
          },
          "wrong": [
            {
              "en": "“Obviously” and “every user knows” replace evidence with common opinion; there is no source to check.",
              "ru": "«Очевидно» и «все знают» подменяют доказательства общим мнением; проверить нечего."
            },
            {
              "en": "Personal experience is an anecdote, not documented, reproducible evidence.",
              "ru": "Личный опыт — это частный случай, а не задокументированные воспроизводимые данные."
            },
            {
              "en": "A belief about the future is a claim; a research paper needs findings from cited studies.",
              "ru": "Убеждение о будущем — это утверждение; статье нужны результаты цитируемых работ."
            }
          ],
          "id": "rm-l2-p1-2"
        },
        {
          "q": "Complete the lecture formula: CLAIM + ______ = RESEARCH ARGUMENT.",
          "options": [
            "Academic evidence",
            "Strong personal conviction",
            "A clear research question",
            "Precise technical vocabulary"
          ],
          "answer": 0,
          "why": {
            "en": "CLAIM + ACADEMIC EVIDENCE = RESEARCH ARGUMENT. Evidence from cited, peer-reviewed studies is what turns an opinion into an argument.",
            "ru": "CLAIM + ACADEMIC EVIDENCE = RESEARCH ARGUMENT. Мнение превращается в аргумент благодаря данным из цитируемых рецензируемых работ."
          },
          "wrong": [
            {
              "en": "Conviction does not make a claim verifiable; the formula needs documented findings.",
              "ru": "Убеждённость не делает утверждение проверяемым; формуле нужны задокументированные результаты."
            },
            {
              "en": "The question comes later in the chain; it does not support the claim.",
              "ru": "Вопрос появляется позже в цепочке; он не подкрепляет утверждение."
            },
            {
              "en": "Academic-sounding words do not add evidence.",
              "ru": "Наукообразные слова не добавляют доказательств."
            }
          ],
          "id": "rm-l2-p1-3"
        },
        {
          "q": "What makes a statement a hypothesis rather than a claim?",
          "options": [
            "It is a prediction that the data could prove wrong",
            "It is stated with full confidence by an expert",
            "It describes a result the team has already observed",
            "It contains the words “will” and “definitely”"
          ],
          "answer": 0,
          "why": {
            "en": "A hypothesis is a testable, falsifiable prediction: it is framed so that the collected data can support it or reject it.",
            "ru": "Гипотеза — проверяемое, опровержимое (falsifiable) предсказание: она сформулирована так, чтобы собранные данные могли её поддержать или отвергнуть."
          },
          "wrong": [
            {
              "en": "Confidence is what makes a claim; a hypothesis is open to being rejected.",
              "ru": "Уверенность — признак утверждения; гипотеза допускает, что её отвергнут."
            },
            {
              "en": "An observed result is a finding; a hypothesis is stated before the data are collected.",
              "ru": "Наблюдённый результат — это вывод (finding); гипотезу формулируют до сбора данных."
            },
            {
              "en": "“Definitely” signals certainty — the opposite of a testable prediction.",
              "ru": "«Definitely» говорит об уверенности — противоположности проверяемого предсказания."
            }
          ],
          "id": "rm-l2-p1-6"
        },
        {
          "q": "Which order gives the three-part problem statement asked for in the quiz?",
          "options": [
            "Current situation → literature-supported limitation → need for this study",
            "Research question → hypothesis → expected results that the study will deliver",
            "Personal motivation → description of the app → expected benefits for users",
            "Need for this study → current situation → personal opinion of the team"
          ],
          "answer": 0,
          "why": {
            "en": "Situation (what is happening) → limitation supported by literature (what research has not settled) → need (therefore this study). Mnemonic S-L-N.",
            "ru": "Ситуация (что происходит) → ограничение, подтверждённое литературой (что не выяснено) → потребность (поэтому это исследование). Мнемоника S-L-N."
          },
          "wrong": [
            {
              "en": "These are later elements; a problem statement must not promise results.",
              "ru": "Это более поздние элементы; постановка проблемы не должна обещать результаты."
            },
            {
              "en": "Motivation and app benefits make a product pitch, not a research problem.",
              "ru": "Мотивация и польза приложения — это реклама продукта, а не исследовательская проблема."
            },
            {
              "en": "The need comes last, as the conclusion drawn from the limitation, and opinion has no place here.",
              "ru": "Потребность идёт последней, как вывод из ограничения, а мнению здесь не место."
            }
          ],
          "id": "rm-l2-p1-9"
        },
        {
          "q": "“AI coding assistants are widely used by SE students. Therefore, this study investigates their effect on code understanding.” What is missing?",
          "options": [
            "A literature-supported limitation between the two sentences",
            "A description of the current situation of AI assistant use",
            "A final sentence stating the need for carrying out this study",
            "A list of the specific tools that students used"
          ],
          "answer": 0,
          "why": {
            "en": "The statement jumps from situation to need. The middle move — what previous research has not settled, with a citation — is missing, so the need is not justified.",
            "ru": "Постановка перескакивает от ситуации к потребности. Нет середины — что прежние работы не выяснили, со ссылкой, — поэтому потребность не обоснована."
          },
          "wrong": [
            {
              "en": "The first sentence already describes the situation.",
              "ru": "Первое предложение уже описывает ситуацию."
            },
            {
              "en": "The “Therefore…” sentence is the need for this study.",
              "ru": "Предложение с «Therefore…» и есть потребность в исследовании."
            },
            {
              "en": "Naming tools is detail; it is not one of the three required parts.",
              "ru": "Перечень инструментов — деталь, а не одна из трёх обязательных частей."
            }
          ],
          "id": "rm-l2-p1-11"
        },
        {
          "q": "The practical task lists questions a problem statement should answer. Which question does NOT belong to that list?",
          "options": [
            "What app will the team build?",
            "What is happening?",
            "What is not sufficiently known or solved?",
            "Why is the problem worth investigating?"
          ],
          "answer": 0,
          "why": {
            "en": "The four questions are: what is happening, what is not sufficiently known or solved, who or what is affected, and why it is worth investigating. Building an app is a development task, not part of a research problem.",
            "ru": "Четыре вопроса: что происходит, что недостаточно известно или не решено, кого или что это затрагивает и почему это стоит исследовать. Создание приложения — задача разработки, а не часть исследовательской проблемы."
          },
          "wrong": [
            {
              "en": "This is the first question: the current situation.",
              "ru": "Это первый вопрос: текущая ситуация."
            },
            {
              "en": "This is the core of the problem — the limitation.",
              "ru": "Это ядро проблемы — ограничение."
            },
            {
              "en": "This justifies the need for the study.",
              "ru": "Это обосновывает потребность в исследовании."
            }
          ],
          "id": "rm-l2-p1-13"
        },
        {
          "q": "“We want to build a chatbot that answers students' timetable questions.” Why is this not a research problem?",
          "options": [
            "It names a development task, not something unknown",
            "It names a specific population, which a problem should never do",
            "Chatbots cannot be studied with scientific methods",
            "It is too short to count as a problem statement"
          ],
          "answer": 0,
          "why": {
            "en": "A research problem states what is not yet known and why it matters. “Build a chatbot” is a project task; the research would be, for example, whether the chatbot answers accurately.",
            "ru": "Исследовательская проблема говорит, что пока неизвестно и почему это важно. «Сделать чат-бота» — задача проекта; исследованием было бы, например, насколько точно бот отвечает."
          },
          "wrong": [
            {
              "en": "Problems often name who is affected; that is not the issue.",
              "ru": "Проблема часто называет, кого она касается; дело не в этом."
            },
            {
              "en": "Chatbots can be studied — for example their accuracy or user satisfaction.",
              "ru": "Чат-ботов вполне можно изучать — например, их точность или удовлетворённость пользователей."
            },
            {
              "en": "Length is not the criterion; a short statement can still describe a gap.",
              "ru": "Длина — не критерий; и короткая формулировка может описывать пробел."
            }
          ],
          "id": "rm-l2-p1-14"
        },
        {
          "q": "Week 1 built Area → Topic → Problem. What does Week 2 add?",
          "options": [
            "Literature evidence, a gap and a refined research question",
            "A complete methodology section with data-collection instruments",
            "Final results that confirm the original Week 1 problem",
            "A longer list of interesting areas to choose from"
          ],
          "answer": 0,
          "why": {
            "en": "Week 2: prove the problem with academic literature (evidence), find what remains unknown (gap) and refine the research question. Logbook: evidence, evidence matrix, research gap, refined question.",
            "ru": "Неделя 2: доказать проблему научной литературой, найти, что остаётся неизвестным (пробел), и уточнить исследовательский вопрос. В Logbook: доказательства, матрица, пробел, уточнённый вопрос."
          },
          "wrong": [
            {
              "en": "Methodology comes later in the course (Week 5 onwards).",
              "ru": "Методология будет позже в курсе (с недели 5)."
            },
            {
              "en": "No data are collected yet, and the aim is to test the problem, not confirm it.",
              "ru": "Данные ещё не собраны, а цель — проверить проблему, а не подтвердить её."
            },
            {
              "en": "Areas were chosen in Week 1; Week 2 narrows down, it does not widen.",
              "ru": "Области выбраны на неделе 1; неделя 2 сужает, а не расширяет."
            }
          ],
          "id": "rm-l2-p1-16"
        },
        {
          "q": "What is your first job when you start reading the literature on your problem?",
          "options": [
            "Find out what previous research actually says",
            "Collect only the sources that prove you are right",
            "Choose the research method you want to use",
            "Draft the conclusion section of your paper"
          ],
          "answer": 0,
          "why": {
            "en": "“Your first job is NOT to prove you are right. Your first job is to discover what previous research actually says — even if it surprises you.”",
            "ru": "«Первая задача — НЕ доказать свою правоту, а выяснить, что на самом деле говорят прежние исследования, даже если это удивит»."
          },
          "wrong": [
            {
              "en": "That is cherry-picking; the lecture says your first job is NOT to prove you are right.",
              "ru": "Это выборочный отбор (cherry-picking); лекция прямо говорит: первая задача — НЕ доказать свою правоту."
            },
            {
              "en": "The method is chosen later, from the question — not before reading.",
              "ru": "Метод выбирают позже, исходя из вопроса, а не до чтения."
            },
            {
              "en": "Conclusions come after data; at this stage you are discovering evidence.",
              "ru": "Выводы пишут после данных; сейчас идёт поиск доказательств."
            }
          ],
          "id": "rm-l2-p1-17"
        },
        {
          "q": "“Previous studies report X” with a cited DOI is a research-based statement, while “I think X” is only a claim.",
          "options": [
            "True",
            "False"
          ],
          "answer": 0,
          "fixed": true,
          "why": {
            "en": "The difference is verifiable academic evidence: a cited source that any reader can check.",
            "ru": "Разница — в проверяемых научных доказательствах: цитируемом источнике, который может проверить любой читатель."
          },
          "wrong": [
            {
              "en": "“False” would treat an opinion with no source as equal to a cited finding.",
              "ru": "Ответ «неверно» приравнял бы мнение без источника к результату со ссылкой."
            }
          ],
          "id": "rm-l2-p1-19"
        },
        {
          "q": "“AI is very important nowadays and everyone uses it.” Which parts of the three-part problem statement does this contain?",
          "options": [
            "Only a vague situation — no limitation and no need",
            "All three parts, written in a very short form",
            "A limitation and a need, but no current situation",
            "A cited limitation, because the fact is well known"
          ],
          "answer": 0,
          "why": {
            "en": "It only states a general situation, and vaguely. There is no literature-supported limitation and no need for a specific study.",
            "ru": "Здесь только общая и расплывчатая ситуация. Нет ни ограничения, подтверждённого литературой, ни потребности в конкретном исследовании."
          },
          "wrong": [
            {
              "en": "There is no limitation from the literature and no “therefore” — only a general remark.",
              "ru": "Нет ни ограничения из литературы, ни «therefore» — только общее замечание."
            },
            {
              "en": "It is the other way round: only a vague situation is present.",
              "ru": "Наоборот: есть только расплывчатая ситуация."
            },
            {
              "en": "“Well known” is not a citation; nothing here is supported by literature.",
              "ru": "«Общеизвестно» — не ссылка; ничего здесь не подкреплено литературой."
            }
          ],
          "id": "rm-l2-p1-20"
        }
      ]
    },
    {
      "id": "rm-l2-p2",
      "title": {
        "en": "Finding evidence: keywords, Boolean search, screening",
        "ru": "Поиск доказательств: ключевые слова, булев поиск, отсев"
      },
      "notes": {
        "en": "## Challenge 1: turn the problem into keywords\nDo not paste the whole problem sentence into Google Scholar: almost no paper uses exactly your wording, and different authors name the same idea differently. Break the problem into **3 core concepts** and give each **at least 2 synonyms**.\nProblem: \"LLMs may provide inaccurate answers to Kazakh-language questions.\"\n| Concept | Synonyms and alternatives |\n|---|---|\n| Large language models | LLM · multilingual LLM · generative AI model |\n| Kazakh language | Kazakh NLP · low-resource language · Central Asian language |\n| Accuracy | factual accuracy · hallucination · factuality · reliability |\n## Boolean operators\n| Operator | What it does | Effect | Example |\n|---|---|---|---|\n| \" \" | exact phrase | narrows | \"large language model\" |\n| AND | both concepts required | narrows | LLM AND hallucination |\n| OR | either alternative is enough | broadens | LLM OR \"large language model\" |\n| ( ) | groups the synonyms of one concept | keeps the logic clear | (LLM OR \"large language model\") |\nRule: **OR inside the brackets** (synonyms of one concept), **AND between the brackets** (different concepts).\n= (\"large language model\" OR LLM) AND (\"Kazakh language\" OR \"Kazakh NLP\") AND (hallucination OR \"factual accuracy\")\n## Where researchers search\n| Database | Best for |\n|---|---|\n| Google Scholar | free and broad; the best starting point; citations and PDFs |\n| Scopus, Web of Science | premium indexed databases with high-quality filtering; access through the library |\n| IEEE Xplore, ACM Digital Library | essential for CS and Software Engineering: conference and journal papers |\n| ScienceDirect, SpringerLink | interdisciplinary work: HCI, education, applied CS |\n> Google ≠ Google Scholar. Regular Google is fine for general information; only academic databases surface peer-reviewed scholarly evidence.\n## Live mission: find 5 relevant papers\nFor each candidate record **Title · Year · Authors · Venue (journal or conference) · DOI or link**.\n**Golden rule:** do not choose a paper only because its title sounds interesting — check what it actually studies.\n## Don't read everything: screen first\nYou found 30 papers. You do not read all 30: each step is cheaper than the next, and only papers that pass go on.\n- **1. Title** — is the topic related to my problem at all?\n- **2. Abstract** — what did they study, how, and what did they find?\n- **3. Keywords** — do they match my conceptual space?\n- **4. Conclusion** — what is the take-away, and are gaps mentioned?\n- **5. Full read** — only if steps 1–4 confirm relevance.\n= SEARCH WIDE. SCREEN FAST. READ RELEVANT WORK DEEPLY.\n## The 60-second paper test\nAbstract: \"This study evaluates the factual accuracy of three multilingual large language models on a 500-item question-answering benchmark across five domains. Performance degrades significantly in low-resource languages, with accuracy 18–34% lower than English baselines. Training data imbalance is suggested as the primary factor.\"\n| Question | Answer from the abstract |\n|---|---|\n| What did they study? | factual accuracy of multilingual LLMs on a QA benchmark |\n| Who / what? | 3 multilingual LLMs · 500 questions · 5 domains |\n| How? | benchmark evaluation, low-resource vs English performance |\n| What did they find? | accuracy 18–34% lower in low-resource languages |\n| Relevant to me? | highly, if my problem is about Kazakh LLM accuracy |\n## Five questions for every paper\nWhat problem did they study? What research question did they ask? How did they investigate it? What did they find? **What is still missing?** The last one — limitations, open questions, future work — is where research gaps begin. If you cannot answer all five, you have only *looked at* the paper, not read it.\n## AI tools and academic integrity\n| AI can help you | AI cannot replace |\n|---|---|\n| generate initial keyword ideas | peer-reviewed academic evidence |\n| suggest synonyms for Boolean queries | real authors, papers, DOIs or findings |\n| explain difficult terminology | verified research gaps |\n| organise and format notes | legitimate citations |\nA literature folder of AI-suggested records, some **with no DOI and never opened**, creates the risk of **citing fabricated, unverified sources**. Open each paper, confirm that it exists, and check that it says what you cite it for. Inventing authors, papers, DOIs, findings or gaps is an academic integrity violation, with or without AI.\n?? The query LLM AND Kazakh AND hallucination returns three results. What is the first fix?\n?= Broaden every concept with OR synonyms inside brackets: (LLM OR \"large language model\") AND (Kazakh OR \"low-resource language\") AND (hallucination OR \"factual accuracy\"). Dropping a whole concept comes later, because it changes the problem.\n?? At which screening step do you first learn how a study was done and what it found?\n?= Step 2, the abstract: it says what was studied, how, and what was found.",
        "ru": "## Задание 1: превратить проблему в ключевые слова\nНе стоит вставлять в Google Scholar всё предложение с проблемой: почти ни одна статья не использует именно вашу формулировку, а разные авторы называют одну идею по-разному. Проблему разбивают на **3 ключевых понятия (core concepts)** и к каждому подбирают **минимум 2 синонима**.\nПроблема: «LLMs may provide inaccurate answers to Kazakh-language questions» (LLM могут давать неточные ответы на вопросы на казахском).\n| Понятие | Синонимы и варианты |\n|---|---|\n| Большие языковые модели | LLM · multilingual LLM · generative AI model |\n| Казахский язык | Kazakh NLP · low-resource language · Central Asian language |\n| Точность | factual accuracy · hallucination · factuality · reliability |\n## Булевы операторы (Boolean operators)\n| Оператор | Что делает | Эффект | Пример |\n|---|---|---|---|\n| \" \" | точная фраза | сужает | \"large language model\" |\n| AND | нужны оба понятия | сужает | LLM AND hallucination |\n| OR | достаточно любого варианта | расширяет | LLM OR \"large language model\" |\n| ( ) | группирует синонимы одного понятия | сохраняет ясную логику | (LLM OR \"large language model\") |\nПравило: **OR — внутри скобок** (синонимы одного понятия), **AND — между скобками** (разные понятия).\n= (\"large language model\" OR LLM) AND (\"Kazakh language\" OR \"Kazakh NLP\") AND (hallucination OR \"factual accuracy\")\n## Где ищут исследователи\n| База | Для чего лучше всего |\n|---|---|\n| Google Scholar | бесплатная и широкая; лучшая точка старта; цитирования и PDF |\n| Scopus, Web of Science | платные индексируемые базы с качественной фильтрацией; доступ через библиотеку |\n| IEEE Xplore, ACM Digital Library | обязательны для CS и Software Engineering: статьи конференций и журналов |\n| ScienceDirect, SpringerLink | междисциплинарные работы: HCI, образование, прикладная CS |\n> Google ≠ Google Scholar. Обычный Google годится для общей информации; рецензируемые научные работы (peer-reviewed) выдают только академические базы.\n## Задание: найти 5 релевантных статей\nДля каждой статьи-кандидата записать **название · год · авторов · издание (журнал или конференцию) · DOI или ссылку**.\n**Золотое правило:** не выбирать статью только потому, что название звучит интересно, — проверить, что именно в ней изучают.\n## Не читать всё подряд: сначала отсев\nНашлось 30 статей. Все 30 не читают: каждый шаг дешевле следующего, и дальше проходят только подходящие статьи.\n- **1. Название (title)** — относится ли тема к моей проблеме вообще?\n- **2. Аннотация (abstract)** — что изучали, как и что нашли?\n- **3. Ключевые слова (keywords)** — совпадают ли с моими понятиями?\n- **4. Заключение (conclusion)** — какой главный вывод и упомянуты ли пробелы?\n- **5. Полное чтение (full read)** — только если шаги 1–4 подтвердили релевантность.\n= SEARCH WIDE. SCREEN FAST. READ RELEVANT WORK DEEPLY.\n## Тест статьи за 60 секунд\nАннотация: «This study evaluates the factual accuracy of three multilingual large language models on a 500-item question-answering benchmark across five domains. Performance degrades significantly in low-resource languages, with accuracy 18–34% lower than English baselines. Training data imbalance is suggested as the primary factor.»\n| Вопрос | Ответ по аннотации |\n|---|---|\n| Что изучали? | фактическую точность мультиязычных LLM на наборе вопросов (benchmark) |\n| Кого / что? | 3 мультиязычные LLM · 500 вопросов · 5 областей |\n| Как? | оценка на бенчмарке: малоресурсные языки против английского |\n| Что нашли? | точность на 18–34% ниже в малоресурсных языках |\n| Важно ли для меня? | очень, если проблема — точность LLM на казахском |\n## Пять вопросов к каждой статье\nКакую проблему изучали? Какой исследовательский вопрос задали? Как исследовали? Что нашли? **Чего всё ещё не хватает?** Последний вопрос — ограничения, открытые вопросы, future work — место, где начинаются исследовательские пробелы. Если на все пять ответить не получается, статью только *посмотрели*, а не прочитали.\n## ИИ-инструменты и академическая честность\n| ИИ может помочь | ИИ не заменит |\n|---|---|\n| придумать первые ключевые слова | рецензируемые научные доказательства |\n| подсказать синонимы для булевых запросов | реальных авторов, статьи, DOI и результаты |\n| объяснить сложные термины | проверенные исследовательские пробелы |\n| упорядочить и оформить заметки | корректные ссылки |\nПапка с литературой из записей, которые подсказал ИИ, причём часть **без DOI и ни разу не открыта**, создаёт риск **сослаться на выдуманные, непроверенные источники**. Каждую статью нужно открыть, убедиться, что она существует и что в ней написано именно то, ради чего её цитируют. Выдумывать авторов, статьи, DOI, результаты или пробелы — нарушение академической честности, с ИИ или без.\n?? Запрос LLM AND Kazakh AND hallucination даёт три результата. Что исправить в первую очередь?\n?= Расширить каждое понятие синонимами через OR в скобках: (LLM OR \"large language model\") AND (Kazakh OR \"low-resource language\") AND (hallucination OR \"factual accuracy\"). Убирать целое понятие — следующий шаг, потому что это меняет саму проблему.\n?? На каком шаге отсева впервые становится известно, как проводили исследование и что нашли?\n?= На шаге 2, по аннотации: в ней сказано, что изучали, как и что нашли."
      },
      "questions": [
        {
          "q": "Why should you not paste your whole problem sentence into Google Scholar?",
          "options": [
            "Papers rarely use your exact wording, so relevant ones are missed",
            "Google Scholar rejects any query that is longer than about five words",
            "Long queries always return far too many irrelevant papers",
            "Sentences reveal your research idea to other researchers"
          ],
          "answer": 0,
          "why": {
            "en": "Different authors describe the same idea with different words. Break the problem into concepts and synonyms instead of searching for your own sentence.",
            "ru": "Разные авторы описывают одну идею разными словами. Проблему разбивают на понятия и синонимы, а не ищут собственное предложение."
          },
          "wrong": [
            {
              "en": "There is no such limit; long sentences simply match poorly.",
              "ru": "Такого ограничения нет; длинные предложения просто плохо совпадают."
            },
            {
              "en": "A full sentence usually returns too FEW good matches, not too many.",
              "ru": "Целое предложение обычно находит СЛИШКОМ МАЛО подходящих статей, а не слишком много."
            },
            {
              "en": "Searches are not published; the issue is matching, not secrecy.",
              "ru": "Запросы не публикуются; дело в совпадении слов, а не в секретности."
            }
          ],
          "id": "rm-l2-p2-1"
        },
        {
          "q": "Challenge 1 asks you to turn your Week 1 problem into keywords. What exactly does it require?",
          "options": [
            "3 core concepts, each with at least 2 synonyms",
            "1 main concept with as many synonyms as possible",
            "5 concepts, each written as one exact phrase",
            "The full problem sentence plus its translation"
          ],
          "answer": 0,
          "why": {
            "en": "Break the problem into 3 core concepts and generate at least 2 synonym alternatives for each — e.g. LLM / Kazakh language / accuracy.",
            "ru": "Разбить проблему на 3 ключевых понятия и к каждому подобрать минимум 2 синонима — например, LLM / казахский язык / точность."
          },
          "wrong": [
            {
              "en": "One concept cannot describe a problem; the task asks for three.",
              "ru": "Одно понятие не описывает проблему; в задании их три."
            },
            {
              "en": "The task is three concepts with synonyms, not exact phrases only.",
              "ru": "Задание — три понятия с синонимами, а не только точные фразы."
            },
            {
              "en": "Whole sentences are exactly what the challenge tells you not to use.",
              "ru": "Целые предложения — именно то, от чего задание предостерегает."
            }
          ],
          "id": "rm-l2-p2-2"
        },
        {
          "q": "You add “AND Kazakh” to the query LLM AND hallucination. What happens to the result list?",
          "options": [
            "It gets smaller, because one more concept is required",
            "It gets larger, because Kazakh papers are added",
            "It stays the same, because Boolean terms are ignored",
            "It doubles, because each term is searched separately"
          ],
          "answer": 0,
          "why": {
            "en": "AND narrows: every result must contain all the joined concepts, so each extra AND term removes papers.",
            "ru": "AND сужает: каждый результат обязан содержать все соединённые понятия, поэтому каждый новый термин через AND отсекает статьи."
          },
          "wrong": [
            {
              "en": "That is what OR would do; AND adds a requirement.",
              "ru": "Так работает OR; AND добавляет требование."
            },
            {
              "en": "Academic databases do apply AND; the results change.",
              "ru": "Академические базы учитывают AND; результаты меняются."
            },
            {
              "en": "AND does not run separate searches; it requires all terms in one paper.",
              "ru": "AND не запускает отдельные поиски; он требует все термины в одной статье."
            }
          ],
          "id": "rm-l2-p2-3"
        },
        {
          "q": "What does OR do when it joins two terms, as in LLM OR “large language model”?",
          "options": [
            "Accepts papers with either term, so results grow",
            "Requires both terms in every paper, so results shrink",
            "Searches for both words as one exact phrase",
            "Removes papers that contain the second term"
          ],
          "answer": 0,
          "why": {
            "en": "OR broadens: either synonym is acceptable, so it joins alternative names of the same concept.",
            "ru": "OR расширяет: подходит любой из синонимов, поэтому им соединяют разные названия одного понятия."
          },
          "wrong": [
            {
              "en": "That describes AND.",
              "ru": "Это описание AND."
            },
            {
              "en": "Exact phrases are made with quotation marks.",
              "ru": "Точную фразу задают кавычками."
            },
            {
              "en": "Excluding terms is not what OR does; OR adds alternatives.",
              "ru": "Исключение терминов — не работа OR; OR добавляет альтернативы."
            }
          ],
          "id": "rm-l2-p2-4"
        },
        {
          "q": "What do quotation marks do in the query “large language model”?",
          "options": [
            "Find the words together, as one exact phrase",
            "Exclude the phrase from all of the results",
            "Search for the phrase only in paper titles",
            "Add every synonym of the words automatically"
          ],
          "answer": 0,
          "why": {
            "en": "Phrase search forces the database to find that exact phrase — the words together and in this order — instead of the words scattered anywhere.",
            "ru": "Поиск по фразе заставляет базу искать именно эту фразу — слова вместе и в этом порядке, — а не разбросанные по тексту слова."
          },
          "wrong": [
            {
              "en": "Quotation marks include an exact phrase; they do not exclude it.",
              "ru": "Кавычки ищут точную фразу, а не исключают её."
            },
            {
              "en": "Quotation marks do not limit the search to titles.",
              "ru": "Кавычки не ограничивают поиск названиями."
            },
            {
              "en": "Synonyms are added by you, with OR.",
              "ru": "Синонимы добавляют вручную, через OR."
            }
          ],
          "id": "rm-l2-p2-5"
        },
        {
          "q": "What is the job of the parentheses in (LLM OR “large language model”) AND hallucination?",
          "options": [
            "They group synonyms so OR is applied before AND",
            "They mark optional words the database may skip",
            "They tell the database to search only abstracts",
            "They turn the bracketed words into an exact phrase"
          ],
          "answer": 0,
          "why": {
            "en": "Brackets keep the synonyms of one concept together: (A OR B) AND C means “A or B, and also C”. Without them the database may combine the operators differently.",
            "ru": "Скобки держат синонимы одного понятия вместе: (A OR B) AND C значит «A или B, и при этом C». Без скобок база может сочетать операторы иначе."
          },
          "wrong": [
            {
              "en": "Brackets do not make words optional; they set the logic.",
              "ru": "Скобки не делают слова необязательными; они задают логику."
            },
            {
              "en": "Brackets do not restrict the field that is searched.",
              "ru": "Скобки не ограничивают область поиска."
            },
            {
              "en": "Exact phrases are made with quotation marks.",
              "ru": "Точную фразу задают кавычками."
            }
          ],
          "id": "rm-l2-p2-6"
        },
        {
          "q": "A student searches LLM AND “large language model” AND Kazakh. What is the error?",
          "options": [
            "Synonyms are joined with AND, so papers using one form are lost",
            "The phrase in quotation marks should be written without the quotation marks",
            "Kazakh should be joined with OR to keep the query focused",
            "Boolean operators must be written in lower case to work"
          ],
          "answer": 0,
          "why": {
            "en": "LLM and “large language model” are two names of one concept. Join them with OR inside brackets: (LLM OR “large language model”) AND Kazakh.",
            "ru": "LLM и «large language model» — два названия одного понятия. Их соединяют OR в скобках: (LLM OR “large language model”) AND Kazakh."
          },
          "wrong": [
            {
              "en": "The quotation marks are correct; the problem is AND between synonyms.",
              "ru": "Кавычки здесь верны; ошибка — AND между синонимами."
            },
            {
              "en": "OR with a different concept would broaden the search, not focus it.",
              "ru": "OR с другим понятием расширил бы поиск, а не сфокусировал его."
            },
            {
              "en": "Capital AND / OR is the usual convention; case is not the problem in this query.",
              "ru": "AND / OR принято писать заглавными; ошибка этого запроса не в регистре."
            }
          ],
          "id": "rm-l2-p2-8"
        },
        {
          "q": "Your query LLM AND Kazakh AND hallucination returns only three papers. What is the best first fix?",
          "options": [
            "Add OR synonyms in brackets to each concept",
            "Delete the Kazakh concept from the query",
            "Put the whole query inside one pair of quotation marks",
            "Join another concept to the query with AND"
          ],
          "answer": 0,
          "why": {
            "en": "Too few results means the query is too narrow. Widen each concept with synonyms: (LLM OR “large language model”) AND (Kazakh OR “low-resource language”) AND (hallucination OR “factual accuracy”).",
            "ru": "Слишком мало результатов — запрос слишком узкий. Каждое понятие расширяют синонимами: (LLM OR “large language model”) AND (Kazakh OR “low-resource language”) AND (hallucination OR “factual accuracy”)."
          },
          "wrong": [
            {
              "en": "That changes the problem itself; broaden each concept first.",
              "ru": "Это меняет саму проблему; сначала стоит расширить каждое понятие."
            },
            {
              "en": "That would demand the exact sentence and find even fewer papers.",
              "ru": "Это потребовало бы точную фразу и нашло бы ещё меньше статей."
            },
            {
              "en": "Another AND term narrows the results further.",
              "ru": "Ещё один термин через AND сужает поиск ещё сильнее."
            }
          ],
          "id": "rm-l2-p2-9"
        },
        {
          "q": "The query LLM OR hallucination returns two million results. What is the best fix?",
          "options": [
            "Join the two different concepts with AND, not OR",
            "Add more synonyms to the query with OR",
            "Remove the quotation marks from every term",
            "Switch the search from Google Scholar to regular Google Search"
          ],
          "answer": 0,
          "why": {
            "en": "LLM and hallucination are different concepts. OR returns every paper on either one; AND keeps only papers about both.",
            "ru": "LLM и hallucination — разные понятия. OR выдаёт все статьи про любое из них; AND оставляет только статьи про оба."
          },
          "wrong": [
            {
              "en": "More OR terms make the list even larger.",
              "ru": "Больше терминов через OR — ещё больше результатов."
            },
            {
              "en": "There are no quotation marks here, and removing them would only broaden the search.",
              "ru": "Кавычек здесь нет, а их удаление только расширило бы поиск."
            },
            {
              "en": "Regular Google gives general web results, not fewer peer-reviewed papers.",
              "ru": "Обычный Google выдаёт общие веб-результаты, а не меньше научных статей."
            }
          ],
          "id": "rm-l2-p2-10"
        },
        {
          "q": "Which databases does the lecture call essential for Computer Science and Software Engineering topics?",
          "options": [
            "IEEE Xplore and the ACM Digital Library",
            "ScienceDirect and SpringerLink",
            "Scopus and Web of Science, via the library",
            "Regular Google and Wikipedia articles"
          ],
          "answer": 0,
          "why": {
            "en": "IEEE Xplore and ACM DL hold the main CS and SE conference and journal papers.",
            "ru": "IEEE Xplore и ACM DL содержат основные статьи конференций и журналов по CS и SE."
          },
          "wrong": [
            {
              "en": "They are strong for interdisciplinary work (HCI, education, applied CS).",
              "ru": "Они сильны в междисциплинарных работах (HCI, образование, прикладная CS)."
            },
            {
              "en": "These are premium general indexed databases, not CS-specific ones.",
              "ru": "Это платные общие индексируемые базы, не специализированные на CS."
            },
            {
              "en": "Neither surfaces peer-reviewed evidence.",
              "ru": "Ни один из них не выдаёт рецензируемые научные работы."
            }
          ],
          "id": "rm-l2-p2-11"
        },
        {
          "q": "Regular Google and Google Scholar are interchangeable for finding peer-reviewed evidence.",
          "options": [
            "True",
            "False"
          ],
          "answer": 1,
          "fixed": true,
          "why": {
            "en": "Google ≠ Google Scholar: regular Google is for general information; only academic databases surface peer-reviewed scholarly evidence.",
            "ru": "Google ≠ Google Scholar: обычный Google — для общей информации; рецензируемые научные работы выдают только академические базы."
          },
          "wrong": [
            {
              "en": "“True” ignores the slide's rule: blogs and news from regular Google are not scholarly evidence.",
              "ru": "Ответ «верно» игнорирует правило слайда: блоги и новости из обычного Google — не научные доказательства."
            }
          ],
          "id": "rm-l2-p2-12"
        },
        {
          "q": "During the live mission, what must you record for every candidate paper?",
          "options": [
            "Title, year, authors, venue, and DOI or link",
            "Title and the downloaded PDF file only",
            "The abstract, copied word for word into the logbook",
            "Page count, number of figures and tables"
          ],
          "answer": 0,
          "why": {
            "en": "Title · Year · Authors · Venue (journal or conference) · DOI or link — enough to verify and cite the paper later.",
            "ru": "Название · год · авторы · издание (журнал или конференция) · DOI или ссылка — этого хватит, чтобы потом проверить и процитировать статью."
          },
          "wrong": [
            {
              "en": "Without authors, year, venue and DOI the source cannot be cited or traced.",
              "ru": "Без авторов, года, издания и DOI источник нельзя ни процитировать, ни найти."
            },
            {
              "en": "A copied abstract is not the record asked for, and it is not your own words.",
              "ru": "Копия аннотации — не та запись, которую просят, и не ваши слова."
            },
            {
              "en": "These say nothing about relevance or how to cite the paper.",
              "ru": "Это ничего не говорит о релевантности или о том, как сослаться на статью."
            }
          ],
          "id": "rm-l2-p2-13"
        },
        {
          "q": "What is the order of the 5-step screening protocol?",
          "options": [
            "Title → abstract → keywords → conclusion → full read",
            "Abstract → title → conclusion → keywords → full read",
            "Full read → conclusion → abstract → keywords → title",
            "Title → introduction → method → results → references"
          ],
          "answer": 0,
          "why": {
            "en": "From the cheapest check to the most expensive: title, abstract, keywords, conclusion, and a full read only if steps 1–4 confirm relevance.",
            "ru": "От самой дешёвой проверки к самой дорогой: название, аннотация, ключевые слова, заключение и полное чтение — только если шаги 1–4 подтвердили релевантность."
          },
          "wrong": [
            {
              "en": "The title is the quickest check and comes first; the abstract follows it.",
              "ru": "Название — самая быстрая проверка и идёт первым; аннотация — после него."
            },
            {
              "en": "A full read is the most expensive step and comes last, only after screening.",
              "ru": "Полное чтение — самый дорогой шаг и идёт последним, только после отсева."
            },
            {
              "en": "These are sections of a full read, not a screening sequence.",
              "ru": "Это разделы полного чтения, а не последовательность отсева."
            }
          ],
          "id": "rm-l2-p2-15"
        },
        {
          "q": "You found 30 papers. According to the screening protocol, when should a paper be read in full?",
          "options": [
            "Only after the first four steps confirm its relevance",
            "Always, for all 30, before deciding which ones are relevant",
            "Only when it is shorter than ten pages",
            "Only when it is the most cited paper on the whole topic"
          ],
          "answer": 0,
          "why": {
            "en": "Search wide, screen fast, read relevant work deeply: a full read is step 5, after title, abstract, keywords and conclusion have confirmed relevance.",
            "ru": "Искать широко, отсеивать быстро, релевантное читать глубоко: полное чтение — шаг 5, после того как название, аннотация, ключевые слова и заключение подтвердили релевантность."
          },
          "wrong": [
            {
              "en": "Reading all 30 in full is exactly what screening avoids.",
              "ru": "Читать все 30 целиком — именно то, от чего избавляет отсев."
            },
            {
              "en": "Length is not a relevance criterion.",
              "ru": "Длина — не критерий релевантности."
            },
            {
              "en": "Citation count is not part of the protocol; relevance to your problem is.",
              "ru": "Число цитирований не входит в протокол; важна релевантность вашей проблеме."
            }
          ],
          "id": "rm-l2-p2-16"
        },
        {
          "q": "Abstract: “…evaluates the factual accuracy of three multilingual LLMs on a 500-item benchmark… accuracy drops 18–34% in low-resource languages compared with English.” In the 60-second test, what answers “HOW?”",
          "options": [
            "Benchmark evaluation comparing low-resource and English results",
            "Accuracy drops by 18–34% for low-resource languages compared with English",
            "Three multilingual LLMs, 500 items and five domains",
            "Factual accuracy of multilingual LLMs on a QA task"
          ],
          "answer": 0,
          "why": {
            "en": "“How” is the method: a benchmark evaluation that compares performance in low-resource languages with English.",
            "ru": "«Как» — это метод: оценка на бенчмарке, которая сравнивает результаты на малоресурсных языках с английским."
          },
          "wrong": [
            {
              "en": "That answers “What did they find?”.",
              "ru": "Это ответ на «Что нашли?»."
            },
            {
              "en": "That answers “Who / what?” — the objects and data.",
              "ru": "Это ответ на «Кого / что?» — объекты и данные."
            },
            {
              "en": "That answers “What did they study?”.",
              "ru": "Это ответ на «Что изучали?»."
            }
          ],
          "id": "rm-l2-p2-17"
        },
        {
          "q": "Which of the five questions for every paper is where research gaps usually start to appear?",
          "options": [
            "What is still missing?",
            "What problem did they study?",
            "How did they investigate it?",
            "What did they find?"
          ],
          "answer": 0,
          "why": {
            "en": "“What is still missing?” — limitations, unanswered questions and future work — is where research gaps begin to appear.",
            "ru": "«Чего всё ещё не хватает?» — ограничения, неотвеченные вопросы, future work — здесь начинают проступать пробелы."
          },
          "wrong": [
            {
              "en": "This gives the context and motivation, not what is left open.",
              "ru": "Это контекст и мотивация, а не то, что осталось открытым."
            },
            {
              "en": "This is the method; a gap appears in what the method could not cover.",
              "ru": "Это метод; пробел виден в том, чего метод не охватил."
            },
            {
              "en": "Findings are what is known; gaps are what is not.",
              "ru": "Результаты — это известное; пробелы — неизвестное."
            }
          ],
          "id": "rm-l2-p2-18"
        },
        {
          "q": "The literature folder contains records suggested by a generative AI tool, some with no DOI and never opened. What risk does this create?",
          "options": [
            "The risk of citing fabricated, unverified sources",
            "No real risk at all, as long as the topics look relevant",
            "The articles may turn out to be too recent",
            "DOIs are unnecessary, so nothing is lost"
          ],
          "answer": 0,
          "why": {
            "en": "AI tools can invent authors, titles and DOIs. Records that nobody opened may be fabricated or may not say what you cite them for — an academic integrity risk.",
            "ru": "ИИ-инструменты могут выдумывать авторов, названия и DOI. Записи, которые никто не открывал, могут оказаться выдуманными или говорить не то, ради чего их цитируют, — это риск для академической честности."
          },
          "wrong": [
            {
              "en": "A relevant-looking topic says nothing about whether the paper exists.",
              "ru": "Подходящая тема ничего не говорит о том, существует ли статья."
            },
            {
              "en": "Recency is not the risk; existence and accuracy are.",
              "ru": "Риск не в свежести, а в существовании и точности."
            },
            {
              "en": "DOIs help verify that a paper exists; their absence is a warning sign.",
              "ru": "DOI помогает проверить, что статья существует; его отсутствие — тревожный знак."
            }
          ],
          "id": "rm-l2-p2-19"
        },
        {
          "q": "Which use of AI is acceptable in the Week 2 research workflow?",
          "options": [
            "Suggesting synonyms for your Boolean query",
            "Supplying citations that you have not opened",
            "Confirming that your research gap is real",
            "Summarising papers so you need not read them"
          ],
          "answer": 0,
          "why": {
            "en": "AI can help with keyword ideas, synonyms, terminology and organising notes. It cannot replace peer-reviewed evidence, real papers and DOIs, verified gaps or legitimate citations.",
            "ru": "ИИ помогает с идеями ключевых слов, синонимами, терминами и организацией заметок. Он не заменяет рецензируемые доказательства, реальные статьи и DOI, проверенные пробелы и корректные ссылки."
          },
          "wrong": [
            {
              "en": "Unopened citations may be fabricated; AI cannot replace real sources.",
              "ru": "Неоткрытые ссылки могут оказаться выдуманными; ИИ не заменяет настоящие источники."
            },
            {
              "en": "A gap must be verified against literature you have read.",
              "ru": "Пробел проверяют по прочитанной литературе."
            },
            {
              "en": "Every claimed gap must rest on literature you actually read, not on AI summaries.",
              "ru": "Каждый заявленный пробел должен опираться на действительно прочитанную литературу, а не на пересказы ИИ."
            }
          ],
          "id": "rm-l2-p2-20"
        }
      ]
    },
    {
      "id": "rm-l2-p3",
      "title": {
        "en": "Connecting evidence and detecting the gap",
        "ru": "Связать доказательства и найти пробел"
      },
      "notes": {
        "en": "## The evidence matrix\nStop collecting papers in a list: put them in a comparison table, one row per paper.\n| Paper | Problem / purpose | Method | Data / participants | Main finding | Limitation | What is missing? |\n|---|---|---|---|---|---|---|\n| Smith et al. (2023) | multilingual LLM factual QA accuracy | benchmark evaluation | 3 LLMs · 500 QA items · 5 domains | accuracy drops 18–34% for low-resource languages | no Kazakh-specific tasks | Kazakh factual QA evaluation |\n- Write every cell **in your own words**; do not copy the abstract.\n- A cell you cannot fill is a signal to re-read the paper.\n- Gaps start in the **Limitation** and **What is missing?** columns. The matrix later becomes the base of your literature review.\n## Don't collect papers — connect them\n| Summary trap | Pattern approach |\n|---|---|\n| \"Paper 1 says X. Paper 2 says Y. Paper 3 says Z.\" | \"Papers 1–3 converge on X in English contexts; Paper 4 challenges this in multilingual settings.\" |\n| a list of summaries: no analysis, no gap | agreements, contradictions and what nobody studied |\n= Pattern → Contradiction → Gap → Your question\nAsk of any set of papers: what do they **agree** on, where do they **disagree**, what have **none** of them studied? Clues: the same finding everywhere, conflicting results, one dataset reused, a missing population or language, outdated data, small samples, only one method.",
        "ru": "## Матрица доказательств (evidence matrix)\nСтатьи не копят списком, а сводят в сравнительную таблицу, по строке на статью.\n| Статья | Проблема / цель | Метод | Данные / участники | Главный результат | Ограничение | Чего не хватает? |\n|---|---|---|---|---|---|---|\n| Smith et al. (2023) | точность мультиязычных LLM в фактических вопросах | оценка на бенчмарке | 3 LLM · 500 вопросов · 5 областей | точность падает на 18–34% для малоресурсных языков | нет задач на казахском | оценка фактических вопросов на казахском |\n- Каждую ячейку заполняют **своими словами**; аннотацию не копируют.\n- Ячейка, которую не получается заполнить, — сигнал перечитать статью.\n- Пробелы начинаются в колонках **«Ограничение»** и **«Чего не хватает?»**. Позже матрица станет основой обзора литературы.\n## Не копить статьи, а связывать\n| Ловушка пересказа (summary trap) | Подход через закономерности (pattern approach) |\n|---|---|\n| «Статья 1 говорит X. Статья 2 говорит Y. Статья 3 говорит Z». | «Статьи 1–3 сходятся на X для английского; статья 4 оспаривает это в мультиязычной среде». |\n| список пересказов: ни анализа, ни пробела | согласия, противоречия и то, чего никто не изучал |\n= Pattern → Contradiction → Gap → Your question\nК любому набору статей три вопроса: в чём они **согласны**, где **расходятся**, чего **ни одна** не изучала? Подсказки: везде один и тот же вывод, противоречивые результаты, один и тот же датасет, пропущенная группа людей или язык, устаревшие данные, малые выборки, только один метод."
      },
      "questions": [
        {
          "q": "Which set of columns makes up the evidence matrix from the lecture?",
          "options": [
            "Paper, purpose, method, data, finding, limitation, what is missing",
            "Paper, journal, impact factor, citation count, year, country, page count",
            "Author, university, funding, co-authors, email, website, awards",
            "Title, abstract, figures, tables, appendices, references, notes"
          ],
          "answer": 0,
          "why": {
            "en": "Seven columns: Paper · Problem / Purpose · Method · Data / Participants · Main Finding · Limitation · What Is Missing?",
            "ru": "Семь колонок: статья · проблема / цель · метод · данные / участники · главный результат · ограничение · чего не хватает?"
          },
          "wrong": [
            {
              "en": "These describe where a paper sits, not what it studied or left open.",
              "ru": "Это описывает, где статья опубликована, а не что в ней изучено и что осталось открытым."
            },
            {
              "en": "Biographical data do not help compare studies.",
              "ru": "Биографические данные не помогают сравнивать исследования."
            },
            {
              "en": "These are parts of a paper, not analysis columns.",
              "ru": "Это части статьи, а не колонки для анализа."
            }
          ],
          "id": "rm-l2-p3-1"
        },
        {
          "q": "How should the cells of the evidence matrix be filled in?",
          "options": [
            "In your own words, after reading each paper closely",
            "By pasting each paper's abstract into the cells",
            "By asking an AI tool to fill them from the titles",
            "With guesses, to be checked at the end of the course"
          ],
          "answer": 0,
          "why": {
            "en": "Describe each study in your own words — do not copy the abstract. If you cannot fill a field, re-read the paper more carefully.",
            "ru": "Каждое исследование описывают своими словами — аннотацию не копируют. Если поле не заполняется, статью перечитывают внимательнее."
          },
          "wrong": [
            {
              "en": "Copied abstracts show no understanding and are not your writing.",
              "ru": "Скопированные аннотации не показывают понимания и не являются вашим текстом."
            },
            {
              "en": "AI cannot replace reading; it may invent findings.",
              "ru": "ИИ не заменяет чтения и может выдумать результаты."
            },
            {
              "en": "A cell you cannot fill means: re-read the paper now.",
              "ru": "Ячейка, которую не получается заполнить, значит: перечитать статью сейчас."
            }
          ],
          "id": "rm-l2-p3-3"
        },
        {
          "q": "“Paper 1 says X. Paper 2 says Y. Paper 3 says Z.” What is wrong with this literature work?",
          "options": [
            "It lists summaries instead of comparing the papers",
            "It cites too few papers to be a proper review",
            "It should present the papers in order of their publication date",
            "It is too analytical for an undergraduate review"
          ],
          "answer": 0,
          "why": {
            "en": "This is the summary trap: no agreements, contradictions or gaps are shown. A researcher compares — what do the papers agree on, where do they disagree, what has none of them studied?",
            "ru": "Это ловушка пересказа: не видно ни согласий, ни противоречий, ни пробелов. Исследователь сравнивает: в чём статьи согласны, где расходятся, чего не изучала ни одна?"
          },
          "wrong": [
            {
              "en": "The number is not the issue; even 20 papers listed this way would still be a list.",
              "ru": "Дело не в количестве: и 20 статей, перечисленных так, останутся списком."
            },
            {
              "en": "Ordering by date is still listing; the comparison is missing.",
              "ru": "Сортировка по дате — всё равно список; сравнения нет."
            },
            {
              "en": "It is the opposite — there is no analysis at all.",
              "ru": "Наоборот — анализа здесь нет вообще."
            }
          ],
          "id": "rm-l2-p3-4"
        },
        {
          "q": "Which chain describes how comparing papers leads to your research question?",
          "options": [
            "Pattern → Contradiction → Gap → Your question",
            "Your question → Gap → Pattern → Contradiction",
            "Gap → Your question → Pattern → Contradiction",
            "Contradiction → Your question → Gap → Pattern"
          ],
          "answer": 0,
          "why": {
            "en": "Pattern → Contradiction → Gap → Your question: compare the papers, notice agreement and disagreement, find what is missing, then ask about it.",
            "ru": "Закономерность → противоречие → пробел → ваш вопрос: сравнить статьи, заметить согласия и расхождения, найти недостающее и спросить о нём."
          },
          "wrong": [
            {
              "en": "The question comes last — it follows from the gap, not the other way round.",
              "ru": "Вопрос идёт последним — он следует из пробела, а не наоборот."
            },
            {
              "en": "Patterns and contradictions are noticed first; they reveal the gap.",
              "ru": "Сначала замечают закономерности и противоречия — они и показывают пробел."
            },
            {
              "en": "The question cannot come before the gap it is meant to address.",
              "ru": "Вопрос не может появиться раньше пробела, на который он отвечает."
            }
          ],
          "id": "rm-l2-p3-7"
        },
        {
          "q": "Which statement best defines a research gap?",
          "options": [
            "What previous studies have not adequately answered in your context",
            "A topic that nobody anywhere in the world has ever studied or written about",
            "Any topic the researcher personally finds interesting",
            "A paper you could not find in a five-minute search"
          ],
          "answer": 0,
          "why": {
            "en": "A research gap is something important that previous research has not adequately answered, tested, explained, compared or studied in your specific context.",
            "ru": "Исследовательский пробел — нечто важное, что прежние работы недостаточно ответили, проверили, объяснили, сравнили или изучили в вашем конкретном контексте."
          },
          "wrong": [
            {
              "en": "Almost every topic has some research; a gap is narrower and context-specific.",
              "ru": "Почти по любой теме что-то есть; пробел уже и привязан к контексту."
            },
            {
              "en": "Interest is not evidence; a gap must emerge from the literature.",
              "ru": "Интерес — не доказательство; пробел должен вытекать из литературы."
            },
            {
              "en": "A failed search is not a gap.",
              "ru": "Неудачный поиск — не пробел."
            }
          ],
          "id": "rm-l2-p3-8"
        },
        {
          "q": "“I searched Google and didn't find anything about this topic.” How is this classified in the gap game?",
          "options": [
            "Not enough evidence — a search failure, not a gap",
            "A possible context gap, since the topic is missing",
            "A strong gap, because the search came back empty",
            "A contradiction gap, since sources seem to disagree"
          ],
          "answer": 0,
          "why": {
            "en": "Verdict: NOT ENOUGH EVIDENCE. A gap must emerge from examining previous research, not from a failed search on regular Google.",
            "ru": "Вердикт: НЕДОСТАТОЧНО ДОКАЗАТЕЛЬСТВ. Пробел должен вытекать из анализа прежних работ, а не из неудачного поиска в обычном Google."
          },
          "wrong": [
            {
              "en": "Nothing was examined, so no context gap can be shown.",
              "ru": "Ничего не проанализировано, поэтому контекстный пробел не показан."
            },
            {
              "en": "An empty result may just mean poor keywords or the wrong database.",
              "ru": "Пустой результат может означать лишь плохие ключевые слова или не ту базу."
            },
            {
              "en": "No sources were found, so nothing can disagree.",
              "ru": "Источники не найдены, значит, и расходиться нечему."
            }
          ],
          "id": "rm-l2-p3-9"
        },
        {
          "q": "“Two relevant studies report conflicting results on whether AI coding assistants improve novice programming performance.” What is this?",
          "options": [
            "A possible contradiction gap in the evidence",
            "Not a gap, because the two studies simply disagree",
            "A population gap among novice programmers",
            "A method gap, since only surveys were used"
          ],
          "answer": 0,
          "why": {
            "en": "Inconsistent evidence across studies is a legitimate gap signal: a possible contradiction gap that needs investigation.",
            "ru": "Противоречивые данные разных исследований — законный сигнал: возможный пробел-противоречие, который нужно исследовать."
          },
          "wrong": [
            {
              "en": "Disagreement is exactly what makes it a legitimate gap signal.",
              "ru": "Расхождение — именно то, что делает это законным сигналом пробела."
            },
            {
              "en": "Novices were studied; the issue is the inconsistent results.",
              "ru": "Новичков изучали; дело в противоречивых результатах."
            },
            {
              "en": "Nothing says only surveys were used; the signal is conflicting findings.",
              "ru": "Нигде не сказано, что использовались только опросы; сигнал — противоречивые результаты."
            }
          ],
          "id": "rm-l2-p3-10"
        },
        {
          "q": "Most studies on a tool used surveys, and experimental evaluation is limited. Which gap type is this?",
          "options": [
            "Method gap: it was studied in only one way",
            "Population gap: a group of people is missing",
            "Context gap: a country or language is missing",
            "Contradiction gap: the results disagree"
          ],
          "answer": 0,
          "why": {
            "en": "A method gap asks how the topic has NOT been studied: mostly surveys, limited experimental evaluation.",
            "ru": "Методический пробел — о том, КАК тему ещё не изучали: в основном опросы, экспериментов мало."
          },
          "wrong": [
            {
              "en": "No group is said to be missing; the issue is how the topic was studied.",
              "ru": "Не сказано, что не хватает группы; вопрос в том, как изучали тему."
            },
            {
              "en": "No country or language is mentioned; the method is the issue.",
              "ru": "Страна или язык не упоминаются; дело в методе."
            },
            {
              "en": "Nothing says the results conflict.",
              "ru": "Нигде не сказано, что результаты противоречат друг другу."
            }
          ],
          "id": "rm-l2-p3-12"
        },
        {
          "q": "What is the order of the gap formula?",
          "options": [
            "We know… → However… → We still do not know… → Therefore, this study…",
            "Therefore, this study… → We know… → However… → We still do not know…",
            "However… → Therefore, this study… → We know… → We still do not know…",
            "We still do not know… → We know… → Therefore, this study… → However…"
          ],
          "answer": 0,
          "why": {
            "en": "Literature (we know) → limitation (however) → gap (we still do not know) → your study (therefore).",
            "ru": "Литература (мы знаем) → ограничение (однако) → пробел (мы всё ещё не знаем) → ваше исследование (поэтому)."
          },
          "wrong": [
            {
              "en": "“Therefore” is the conclusion; it cannot open the argument.",
              "ru": "«Therefore» — вывод; аргумент с него не начинается."
            },
            {
              "en": "The limitation needs the established knowledge before it.",
              "ru": "Ограничению нужно сначала установленное знание."
            },
            {
              "en": "The unknown is defined against what is known, so the known comes first.",
              "ru": "Неизвестное определяют относительно известного, поэтому известное идёт первым."
            }
          ],
          "id": "rm-l2-p3-17"
        },
        {
          "q": "Words like “however”, “limited” and “remains unclear” in a paper prove that a research gap exists.",
          "options": [
            "True",
            "False"
          ],
          "answer": 1,
          "fixed": true,
          "why": {
            "en": "They are clues, not proof: verify them against your full literature review before claiming a gap.",
            "ru": "Это подсказки, а не доказательство: их проверяют всем обзором литературы, прежде чем заявлять пробел."
          },
          "wrong": [
            {
              "en": "“True” would let one sentence in one paper stand in for a review of the literature.",
              "ru": "Ответ «верно» позволил бы одному предложению из одной статьи заменить обзор литературы."
            }
          ],
          "id": "rm-l2-p3-18"
        },
        {
          "q": "A 2021 paper lists your idea under “Future work”. What must you check before claiming it as your gap?",
          "options": [
            "Whether it was done since, fits your project and is doable",
            "Whether the authors give written permission to use the idea",
            "Nothing — an author's future work is automatically a valid gap",
            "Whether the sentence can be copied into your introduction"
          ],
          "answer": 0,
          "why": {
            "en": "Three checks: has it already been done (search for later papers)? is it relevant to your project? can you realistically investigate it with your time, data and resources?",
            "ru": "Три проверки: не сделано ли это уже (поиск более поздних статей)? относится ли к вашему проекту? реально ли это исследовать при ваших времени, данных и ресурсах?"
          },
          "wrong": [
            {
              "en": "Permission is not the issue; you cite the idea and verify it.",
              "ru": "Дело не в разрешении: идею цитируют и проверяют."
            },
            {
              "en": "The slide says the opposite: future work ≠ your gap — yet.",
              "ru": "Слайд говорит обратное: future work ≠ ваш пробел — пока."
            },
            {
              "en": "Copying it as your own writing is plagiarism.",
              "ru": "Скопировать это как свой текст — плагиат."
            }
          ],
          "id": "rm-l2-p3-19"
        }
      ]
    },
    {
      "id": "rm-l2-p4",
      "title": {
        "en": "From gap to a research question",
        "ru": "От пробела к исследовательскому вопросу"
      },
      "notes": {
        "en": "## Topic or research question?\nA **topic** names an area: \"Software quality\", \"Cybersecurity in mobile applications\". A **research question** asks something that collected data can answer: \"How does the use of AI coding assistants affect programming task completion time among university students?\" Narrow the topic in several steps first:\n= Artificial Intelligence → AI in Software Engineering → AI coding assistants → AI coding assistants used by university students → Effect of AI coding assistants on programming performance\n## Five criteria for every RQ\n| Criterion | Test | Fails when… |\n|---|---|---|\n| Clear | do two readers understand it the same way? | vague words: \"good\", \"better\", \"improve\", \"technology\" |\n| Focused | one question with a bounded scope? | it covers a whole field or bundles several questions |\n| Researchable | can evidence be collected to answer it? | it is a value judgement or asks for a definition |\n| Feasible | can you get the data with your time, access and tools? | it needs private data, huge compute or years of follow-up |\n| Connected | does it follow from the problem and the gap? | it ignores the limitation you found |",
        "ru": "## Тема или исследовательский вопрос?\n**Тема (topic)** называет область: «Software quality», «Cybersecurity in mobile applications». **Исследовательский вопрос** спрашивает то, на что могут ответить собранные данные: «How does the use of AI coding assistants affect programming task completion time among university students?» Сначала тему сужают в несколько шагов:\n= Artificial Intelligence → AI in Software Engineering → AI coding assistants → AI coding assistants used by university students → Effect of AI coding assistants on programming performance\n## Пять критериев для любого RQ\n| Критерий | Проверка | Не проходит, когда… |\n|---|---|---|\n| Ясный (clear) | двое читателей поймут его одинаково? | размытые слова: «good», «better», «improve», «technology» |\n| Сфокусированный (focused) | один вопрос с ограниченными рамками? | охватывает целую область или объединяет несколько вопросов |\n| Исследуемый (researchable) | можно ли собрать доказательства для ответа? | это оценочное суждение или вопрос об определении |\n| Выполнимый (feasible) | можно ли получить данные при имеющихся времени, доступе и инструментах? | нужны закрытые данные, огромные вычисления или годы наблюдения |\n| Связанный (connected) | следует ли он из проблемы и пробела? | игнорирует найденное ограничение |"
      },
      "questions": [
        {
          "q": "Which of these is a research question rather than a broad topic?",
          "options": [
            "How does AI assistant use affect task completion time among SE students?",
            "Artificial Intelligence and its role in modern Software Engineering practice",
            "Cybersecurity of mobile banking applications in Kazakhstan",
            "Software quality and automated testing tools in agile teams"
          ],
          "answer": 0,
          "why": {
            "en": "A research question asks something data can answer: population (SE students), factor (AI assistant use), outcome (task completion time).",
            "ru": "Исследовательский вопрос спрашивает то, на что ответят данные: группа (студенты SE), фактор (использование ИИ-ассистента), результат (время выполнения задания)."
          },
          "wrong": [
            {
              "en": "A broad area — nothing is asked and nothing can be measured.",
              "ru": "Широкая область — ничего не спрашивается и ничего не измеряется."
            },
            {
              "en": "Narrower, but still a topic: it names an area without a question.",
              "ru": "Уже, но всё ещё тема: область названа, вопроса нет."
            },
            {
              "en": "A topic phrase with no factor–outcome question to answer.",
              "ru": "Название темы без вопроса о факторе и результате."
            }
          ],
          "id": "rm-l2-p4-1"
        },
        {
          "q": "RQ: “How does the use of AI coding assistants affect programming task completion time among Software Engineering students?” What is the outcome?",
          "options": [
            "Programming task completion time",
            "Software Engineering students",
            "The use of AI coding assistants by students",
            "University programming courses"
          ],
          "answer": 0,
          "why": {
            "en": "The outcome is what is measured: programming task completion time. The practical task's own breakdown: population — SE students, factor — AI assistant use, outcome — completion time, context — university tasks.",
            "ru": "Результат — то, что измеряют: время выполнения задания. Разбор из практического задания: группа — студенты SE, фактор — использование ИИ-ассистентов, результат — время, контекст — университетские задания."
          },
          "wrong": [
            {
              "en": "That is the population.",
              "ru": "Это группа (population)."
            },
            {
              "en": "That is the factor being investigated.",
              "ru": "Это исследуемый фактор."
            },
            {
              "en": "That would be the context.",
              "ru": "Это контекст."
            }
          ],
          "id": "rm-l2-p4-4"
        },
        {
          "q": "Why is “What is Artificial Intelligence?” rejected in the practical task?",
          "options": [
            "It can be answered with a definition, without research",
            "It is far too specific and narrow for a third-year research project",
            "It mentions a technology instead of a population",
            "It should start with “Why” instead of “What”"
          ],
          "answer": 0,
          "why": {
            "en": "The practical task warns: do not use questions that can be answered only with a definition. A research question needs evidence to answer.",
            "ru": "Практическое задание предупреждает: не использовать вопросы, на которые отвечают одним определением. Исследовательскому вопросу для ответа нужны данные."
          },
          "wrong": [
            {
              "en": "It is not specific at all; the problem is that no data are needed.",
              "ru": "Он совсем не конкретный; проблема в том, что данные не нужны."
            },
            {
              "en": "Mentioning a technology is fine; the question simply needs no data.",
              "ru": "Упоминать технологию можно; просто этот вопрос не требует данных."
            },
            {
              "en": "The question word is not the issue.",
              "ru": "Дело не в вопросительном слове."
            }
          ],
          "id": "rm-l2-p4-6"
        },
        {
          "q": "What is the main test of whether a research question is researchable?",
          "options": [
            "Can evidence be collected to answer the question?",
            "Is the topic currently popular among researchers?",
            "Does it use advanced technical terminology?",
            "Does the researcher already know the answer?"
          ],
          "answer": 0,
          "why": {
            "en": "Researchable means the question can be answered with collected data, not with opinion or a definition.",
            "ru": "«Исследуемый» значит, что ответ можно получить из собранных данных, а не из мнения или определения."
          },
          "wrong": [
            {
              "en": "Popularity does not make a question answerable.",
              "ru": "Популярность не делает вопрос отвечаемым."
            },
            {
              "en": "Jargon does not make a question answerable.",
              "ru": "Сложные термины не делают вопрос отвечаемым."
            },
            {
              "en": "If the answer is known in advance, there is nothing to research.",
              "ru": "Если ответ известен заранее, исследовать нечего."
            }
          ],
          "id": "rm-l2-p4-7"
        },
        {
          "q": "Why is “Is Rust better than Java?” not researchable as written?",
          "options": [
            "“Better” is undefined, so no evidence can settle it",
            "Rust and Java cannot be compared with each other",
            "It is too narrow for a research project",
            "It does not mention a specific database, framework or cloud platform"
          ],
          "answer": 0,
          "why": {
            "en": "Name a measurable outcome and conditions: “How do Rust and Java microservices compare in latency at 100,000 requests/sec?”",
            "ru": "Нужно назвать измеримый результат и условия: «How do Rust and Java microservices compare in latency at 100,000 requests/sec?»"
          },
          "wrong": [
            {
              "en": "They can be compared — on defined measures such as latency or memory.",
              "ru": "Сравнить их можно — по заданным показателям вроде задержки или памяти."
            },
            {
              "en": "It is too vague, not too narrow.",
              "ru": "Он слишком расплывчатый, а не слишком узкий."
            },
            {
              "en": "Adding a framework would not define “better”.",
              "ru": "Добавление фреймворка не определит, что значит «better»."
            }
          ],
          "id": "rm-l2-p4-8"
        },
        {
          "q": "What does a feasibility check mainly ask about a research question?",
          "options": [
            "Whether the needed data can realistically be obtained",
            "Whether many papers on the topic already exist",
            "Whether the topic is popular among the other students in the course",
            "Whether the results are likely to look positive"
          ],
          "answer": 0,
          "why": {
            "en": "Feasible means you can actually get the data — with access rights, infrastructure (devices, compute) and time within the trimester.",
            "ru": "Выполнимо — значит, данные действительно можно получить: есть право доступа, инфраструктура (устройства, вычисления) и время в пределах триместра."
          },
          "wrong": [
            {
              "en": "A crowded topic may still be feasible; the check is about your data and resources.",
              "ru": "Даже по изученной теме исследование может быть выполнимым; проверка — о ваших данных и ресурсах."
            },
            {
              "en": "Popularity is irrelevant to feasibility.",
              "ru": "Популярность не имеет отношения к выполнимости."
            },
            {
              "en": "Expecting positive results is bias, not feasibility.",
              "ru": "Ожидание «хороших» результатов — предвзятость, а не выполнимость."
            }
          ],
          "id": "rm-l2-p4-10"
        },
        {
          "q": "A strong research question should follow logically from the identified problem and gap.",
          "options": [
            "True",
            "False"
          ],
          "answer": 0,
          "fixed": true,
          "why": {
            "en": "Connected is one of the criteria: problem → evidence → gap → research question must form one chain.",
            "ru": "Связанность — один из критериев: проблема → доказательства → пробел → исследовательский вопрос образуют одну цепочку."
          },
          "wrong": [
            {
              "en": "“False” would allow a question that ignores the limitation the literature revealed.",
              "ru": "Ответ «неверно» допустил бы вопрос, который игнорирует ограничение, найденное в литературе."
            }
          ],
          "id": "rm-l2-p4-11"
        },
        {
          "q": "After reading five papers, your research question is word-for-word the same as in Week 1. What does the lecture conclude?",
          "options": [
            "You probably have not engaged deeply enough with the literature",
            "Your Week 1 question was already perfect, so it needs no change at all",
            "The literature is irrelevant to your research problem",
            "You should stop reading and start collecting data"
          ],
          "answer": 0,
          "why": {
            "en": "“The literature should change your question. If your research question is identical to Week 1, you have probably not engaged deeply enough.”",
            "ru": "«Литература должна менять вопрос. Если RQ такой же, как на неделе 1, погружение, вероятно, было недостаточно глубоким»."
          },
          "wrong": [
            {
              "en": "The lecture says the literature should change your question.",
              "ru": "Лекция говорит, что литература должна менять вопрос."
            },
            {
              "en": "If it were, you would need new papers — not an unchanged question.",
              "ru": "Если бы так было, нужны были бы новые статьи, а не прежний вопрос."
            },
            {
              "en": "Research is iterative: Idea → Reading → Question → More reading.",
              "ru": "Исследование итеративно: идея → чтение → вопрос → ещё чтение."
            }
          ],
          "id": "rm-l2-p4-12"
        },
        {
          "q": "Which sequence is O'Leary's cycle for developing a research question?",
          "options": [
            "Idea → Reading → Question → More reading → Refined question",
            "Question → Data collection → Reading → Idea → Final question",
            "Idea → Question → Results → Reading → Publication",
            "Reading → Idea → Results → Question → Conclusion"
          ],
          "answer": 0,
          "why": {
            "en": "Research questions evolve through reading: Idea → Reading → Question → More reading → Refined question.",
            "ru": "Вопрос развивается через чтение: идея → чтение → вопрос → ещё чтение → уточнённый вопрос."
          },
          "wrong": [
            {
              "en": "Data collection does not come before the question is refined by reading.",
              "ru": "Сбор данных не идёт раньше, чем вопрос уточнён чтением."
            },
            {
              "en": "Results cannot come before the reading that shapes the question.",
              "ru": "Результаты не могут появиться раньше чтения, которое формирует вопрос."
            },
            {
              "en": "The question must exist before any results.",
              "ru": "Вопрос должен появиться раньше любых результатов."
            }
          ],
          "id": "rm-l2-p4-13"
        },
        {
          "q": "The gap is “limited evaluation of Kazakh factual question answering”. Which research question follows from it?",
          "options": [
            "How accurately do selected multilingual LLMs answer Kazakh factual questions?",
            "How do large language models work, and why are they useful for society?",
            "Will large language models definitely become the best tool for Kazakh speakers?",
            "How well do LLMs translate English news articles into Spanish and French?"
          ],
          "answer": 0,
          "why": {
            "en": "The RQ targets exactly what the gap says is missing: accuracy (outcome) of selected LLMs (object) on Kazakh factual questions (context).",
            "ru": "RQ нацелен ровно на то, чего, по пробелу, не хватает: точность (результат) выбранных LLM (объект) на фактических вопросах на казахском (контекст)."
          },
          "wrong": [
            {
              "en": "Explanatory and general; it ignores the gap about Kazakh factual QA.",
              "ru": "Общий объяснительный вопрос; он игнорирует пробел о фактических вопросах на казахском."
            },
            {
              "en": "A prediction stated with certainty and no measurable outcome — closer to a claim.",
              "ru": "Уверенный прогноз без измеримого результата — это ближе к утверждению."
            },
            {
              "en": "A different task and different languages; it does not address the gap.",
              "ru": "Другая задача и другие языки; пробел не затронут."
            }
          ],
          "id": "rm-l2-p4-14"
        },
        {
          "q": "What is wrong with the research question “Why is ChatGPT so inaccurate in Kazakh?”",
          "options": [
            "It assumes its own answer before any data exist",
            "It names one specific model instead of covering all existing LLMs",
            "It is too narrow to be a research question",
            "It should be written in Kazakh, not English"
          ],
          "answer": 0,
          "why": {
            "en": "“Why is it so inaccurate?” presumes inaccuracy is already proven. Ask first how accurate it is: “How often do selected LLMs give factually incorrect answers to Kazakh questions?”",
            "ru": "«Почему так неточен?» исходит из того, что неточность уже доказана. Сначала спрашивают, насколько он точен: «How often do selected LLMs give factually incorrect answers to Kazakh questions?»"
          },
          "wrong": [
            {
              "en": "Naming specific models is fine and makes the question feasible.",
              "ru": "Называть конкретные модели можно — это делает вопрос выполнимым."
            },
            {
              "en": "Narrowness is not the problem; the built-in assumption is.",
              "ru": "Проблема не в узости, а во встроенном предположении."
            },
            {
              "en": "The language of the question is irrelevant.",
              "ru": "Язык самого вопроса значения не имеет."
            }
          ],
          "id": "rm-l2-p4-15"
        },
        {
          "q": "In the 60-second peer review, what is the only question Student B may ask?",
          "options": [
            "What is your evidence?",
            "Why this topic?",
            "Which method will you use?",
            "Is your topic interesting?"
          ],
          "answer": 0,
          "why": {
            "en": "“What is your evidence?” forces the presenter to cite actual papers for each link of the chain.",
            "ru": "«What is your evidence?» заставляет докладчика назвать реальные статьи для каждого звена цепочки."
          },
          "wrong": [
            {
              "en": "The slide says explicitly: not “I think your topic is interesting”.",
              "ru": "Слайд прямо говорит: не «мне кажется, тема интересная»."
            },
            {
              "en": "The method is not the focus of this exercise; evidence is.",
              "ru": "Метод — не фокус этого упражнения; фокус — доказательства."
            },
            {
              "en": "Interest is not evidence; the partner must force the presenter to cite papers.",
              "ru": "Интерес — не доказательство; партнёр должен заставить докладчика назвать статьи."
            }
          ],
          "id": "rm-l2-p4-18"
        }
      ]
    }
  ]
};
