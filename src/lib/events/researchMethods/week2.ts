import { part, q, tf, type Lecture } from "../types";

export const week2: Lecture = {
  id: "rm-w2",
  title: { en: "Week 2 — Research Detective: from problem to evidence to gap", ru: "Неделя 2 — Детектив: от проблемы к доказательствам и пробелу" },
  parts: [
    part(
      "rm-w2-p1",
      { en: "From claim to evidence: keywords and Boolean search", ru: "От утверждения к доказательству: ключевые слова и булев поиск" },
      {
        en: `## Where we are
Last week: **Area → Topic → Problem**. Today: **Evidence → Gap**.
> You already THINK you found a problem. Now PROVE IT.
The mission has six steps: keywords → find papers → screen fast → compare → detect the gap → refine the question.
## A claim is not research
"Kazakh-language LLMs are bad" is not enough for a paper: it is an opinion until it is supported by measurable, documented evidence.
- Claim: "Kazakh LLMs have many problems." Source: "I think so." Not verifiable, not reproducible.
- Research-based statement: "Previous studies report limitations in factual accuracy for low-resource-language LLMs, including Kazakh tasks." Source: cited literature with a DOI.
**Formula: CLAIM + ACADEMIC EVIDENCE = RESEARCH ARGUMENT.**
> Your first job is NOT to prove you are right. It is to discover what previous research actually says.
## Challenge 1: turn the problem into keywords
Pasting a whole sentence into a database returns almost nothing, because no paper uses exactly your wording. Break the problem into **core searchable concepts** and generate **synonyms** — 3 concepts with at least 2 synonyms each.
Problem: "LLMs may provide inaccurate answers to Kazakh-language questions."
- Concept 1 — Large Language Models: LLM, multilingual LLM, generative AI model.
- Concept 2 — Kazakh language: Kazakh NLP, low-resource language, Central Asian language.
- Concept 3 — Accuracy: factual accuracy, hallucination, factuality, reliability.
## Building the query
- **" "** — phrase search, the exact phrase: "large language model".
- **AND** — both concepts are required, so it **narrows**: LLM AND hallucination.
- **OR** — alternatives are allowed, so it **broadens**: LLM OR "large language model".
Synonyms of one concept go inside brackets with OR; different concepts are joined with AND:
= ("large language model" OR LLM) AND ("Kazakh language" OR "Kazakh NLP") AND (hallucination OR "factual accuracy")`,
        ru: `## Где мы сейчас
На прошлой неделе: **область → тема → проблема**. Сегодня: **доказательства → пробел**.
> Вы уже ДУМАЕТЕ, что нашли проблему. Теперь ДОКАЖИТЕ.
В миссии шесть шагов: ключевые слова → найти статьи → быстро отсеять → сравнить → найти пробел → уточнить вопрос.
## Утверждение — ещё не исследование
«Казахоязычные LLM плохие» — для статьи недостаточно: это мнение, пока оно не подкреплено измеримыми, задокументированными данными.
- Утверждение: «У казахских LLM много проблем». Источник: «Я так думаю». Не проверить и не воспроизвести.
- Исследовательское утверждение: «Предыдущие исследования сообщают об ограничениях фактической точности LLM для малоресурсных языков, включая казахский». Источник: цитируемая литература с DOI.
**Формула: УТВЕРЖДЕНИЕ + НАУЧНЫЕ ДОКАЗАТЕЛЬСТВА = ИССЛЕДОВАТЕЛЬСКИЙ АРГУМЕНТ.**
> Первая задача — НЕ доказать свою правоту, а узнать, что на самом деле говорят прежние исследования.
## Задание 1: превратить проблему в ключевые слова
Целое предложение в базе почти ничего не найдёт: ни одна статья не использует именно вашу формулировку. Разбейте проблему на **ключевые понятия** и подберите **синонимы** — 3 понятия, минимум по 2 синонима.
Проблема: «LLM могут давать неточные ответы на вопросы на казахском».
- Понятие 1 — большие языковые модели: LLM, multilingual LLM, generative AI model.
- Понятие 2 — казахский язык: Kazakh NLP, low-resource language, Central Asian language.
- Понятие 3 — точность: factual accuracy, hallucination, factuality, reliability.
## Сборка запроса
- **" "** — поиск фразы целиком: "large language model".
- **AND** — нужны оба понятия, поэтому **сужает**: LLM AND hallucination.
- **OR** — допускает альтернативы, поэтому **расширяет**: LLM OR "large language model".
Синонимы одного понятия — в скобках через OR; разные понятия соединяются через AND:
= ("large language model" OR LLM) AND ("Kazakh language" OR "Kazakh NLP") AND (hallucination OR "factual accuracy")`,
      },
      [
        q("\"Kazakh-language LLMs are bad.\" Why is this not enough for a paper?", "It is an opinion until evidence supports it", ["It is written in language that is too simple", "It concerns a language with too few speakers", "It was already proven by earlier research"], "A claim needs measurable, documented evidence to become a research argument.", "Утверждению нужны измеримые, задокументированные данные, чтобы стать аргументом."),
        q("Which formula describes a research argument?", "Claim + academic evidence", ["Claim + strong personal opinion", "Topic + a list of keywords", "Problem + a proposed solution"], "CLAIM + ACADEMIC EVIDENCE = RESEARCH ARGUMENT.", "УТВЕРЖДЕНИЕ + НАУЧНЫЕ ДОКАЗАТЕЛЬСТВА = ИССЛЕДОВАТЕЛЬСКИЙ АРГУМЕНТ."),
        q("What is a good first step when developing search terms for a literature search?", "Break the problem into core concepts and generate synonyms", ["Paste the full research question into the search box", "Search for the single most popular keyword in the whole field", "Ask an AI tool to list ready papers about the topic"], "Concepts and synonyms come first; a full sentence matches almost nothing.", "Сначала понятия и синонимы; целое предложение почти ничего не находит."),
        q("What does the Boolean operator AND do in a literature search?", "Narrows results by requiring both concepts", ["Broadens results by allowing either concept", "Searches only for one exact phrase", "Excludes papers that contain the second term"], "Every result must contain all terms joined with AND.", "Каждый результат должен содержать все термины, соединённые AND."),
        q("What does the Boolean operator OR do in a literature search?", "Broadens results by allowing alternative terms or synonyms", ["Narrows results by requiring every listed term to appear together", "Searches for the terms only as one exact phrase", "Removes duplicate papers from the list of results"], "A result matching either term is included, so there are more results.", "Подходит результат с любым из терминов, поэтому результатов больше."),
        q("Why are quotation marks used in a search query?", "To search for an exact phrase", ["To exclude a term from the results", "To search only in the titles of papers", "To include every synonym of a word"], "Quoted words must appear together in that exact order.", "Слова в кавычках должны стоять вместе именно в таком порядке."),
        q("Which query is built correctly?", "(\"large language model\" OR LLM) AND (Kazakh OR \"low-resource language\")", ["\"large language model\" AND LLM OR Kazakh AND low-resource language", "(large language model AND LLM) OR (Kazakh AND low-resource language)", "How do large language models work for the Kazakh language?"], "Synonyms sit in brackets with OR; different concepts are joined with AND.", "Синонимы — в скобках через OR; разные понятия соединяются через AND."),
        q("Synonyms of the same concept should be joined with…", "OR, inside brackets", ["AND, inside brackets", "Quotation marks only", "Nothing — list them with spaces"], "OR collects alternative names for one concept.", "OR собирает альтернативные названия одного понятия."),
        q("What did Challenge 1 of Practical Session 2 ask for?", "3 core concepts with at least 2 synonyms each", ["1 concept with as many synonyms as you can find", "5 concepts without any synonyms at all", "A single full-sentence search query"], "The task was three concepts, each with at least two synonyms.", "Задание: три понятия, у каждого минимум два синонима."),
        q("Why does pasting the whole research question into a database fail?", "Almost no paper uses exactly your wording", ["Databases reject queries longer than five words", "Long queries always return too many papers", "Question marks are not allowed in databases"], "Different authors use different vocabulary for the same idea.", "Разные авторы называют одну и ту же идею разными словами."),
        q("You add \"AND Kazakh\" to the query \"LLM AND hallucination\". What happens to the number of results?", "It decreases", ["It increases", "It stays exactly the same", "It doubles"], "Each extra AND adds a requirement, so fewer papers match.", "Каждое новое AND добавляет требование, и подходящих статей становится меньше."),
        tf("Your first job when you open the literature is to prove that you are right.", false, "The first job is to discover what previous research actually says.", "Первая задача — узнать, что на самом деле говорят прежние исследования."),
      ],
    ),
    part(
      "rm-w2-p2",
      { en: "Where to search and how to screen papers", ru: "Где искать и как отсеивать статьи" },
      {
        en: `## Where researchers search
- **Google Scholar** — free, broad, the best starting point.
- **Scopus and Web of Science** — premium, high-quality databases; ask the librarian for access.
- **IEEE Xplore and ACM Digital Library** — essential for Computer Science and Software Engineering.
- **ScienceDirect and SpringerLink** — interdisciplinary work, HCI, education, applied CS.
> Google ≠ Google Scholar. Regular Google returns general information such as blogs and news; academic databases surface peer-reviewed evidence.
## Live mission: find 5 papers
For every paper record: **Title · Year · Authors · Venue · DOI or link**.
**Golden rule:** do not pick a paper only because its title sounds interesting — check what it actually studies.
## The screening protocol
You may find 30 papers. You cannot read all of them, so screen from the cheapest check to the most expensive one:
- **1. Title** — is the topic related to my problem at all?
- **2. Abstract** — what did they study, how, and what did they find?
- **3. Keywords** — do they match my conceptual space?
- **4. Conclusion** — what is the take-away, and are gaps mentioned?
- **5. Full read** — only if steps 1–4 confirm relevance.
> Search wide. Screen fast. Read relevant work deeply.
## The 60-second abstract test
From the abstract alone answer: what did they study, who or what was studied, how, what was found, and is it relevant to me?
## Five questions for every paper
1. What problem did they study? 2. What research question did they ask? 3. How did they investigate it? 4. What did they find? 5. What is still missing?
The fifth question — limitations, open questions, future work — is where gaps appear. If you cannot answer these questions, you have only looked at the paper, not read it.`,
        ru: `## Где ищут исследователи
- **Google Scholar** — бесплатный, широкий, лучшая точка старта.
- **Scopus и Web of Science** — платные базы высокого качества; доступ спрашивают у библиотекаря.
- **IEEE Xplore и ACM Digital Library** — обязательны для Computer Science и Software Engineering.
- **ScienceDirect и SpringerLink** — междисциплинарные работы, HCI, образование, прикладная CS.
> Google ≠ Google Scholar. Обычный Google выдаёт общую информацию — блоги и новости; академические базы выдают рецензируемые работы.
## Задание: найти 5 статей
Для каждой статьи записать: **название · год · авторы · издание · DOI или ссылка**.
**Золотое правило:** не брать статью только из-за интересного названия — проверить, что именно в ней исследуется.
## Протокол отсева
Найдётся, скажем, 30 статей. Все не прочитать, поэтому отсев идёт от самой дешёвой проверки к самой дорогой:
- **1. Название** — относится ли тема к моей проблеме вообще?
- **2. Аннотация** — что изучали, как и что нашли?
- **3. Ключевые слова** — совпадают ли с моими понятиями?
- **4. Заключение** — какой главный вывод и упомянуты ли пробелы?
- **5. Полное чтение** — только если шаги 1–4 подтвердили релевантность.
> Ищи широко. Отсеивай быстро. Релевантное читай глубоко.
## Тест аннотации за 60 секунд
Только по аннотации ответить: что изучали, кого или что, как, что нашли и важно ли это для меня?
## Пять вопросов к каждой статье
1. Какую проблему изучали? 2. Какой исследовательский вопрос задали? 3. Как исследовали? 4. Что нашли? 5. Чего всё ещё не хватает?
Пятый вопрос — ограничения, открытые вопросы, будущая работа — место, где появляются пробелы. Если на эти вопросы ответить не получается, вы статью только посмотрели, а не прочитали.`,
      },
      [
        q("Which source is described as a broad, free starting point for academic searching?", "Google Scholar", ["Scopus", "Web of Science", "IEEE Xplore"], "The slides call Google Scholar free, broad and the best starting point.", "В слайдах Google Scholar назван бесплатным, широким и лучшей точкой старта."),
        q("Which databases are especially relevant for Computer Science and Software Engineering?", "IEEE Xplore and ACM Digital Library", ["ScienceDirect and SpringerLink", "Scopus and Web of Science", "Google Scholar and Wikipedia"], "They are described as essential for CS and SE.", "Они названы обязательными для CS и SE."),
        q("What is an efficient order for screening a scientific paper?", "Title → Abstract → Keywords → Conclusion → Full read if relevant", ["Introduction → Method → Results → References → Abstract", "Full read → Conclusion → Abstract → Keywords → Title", "References → Keywords → Introduction → Title → Full read of everything"], "Screening goes from the cheapest check to the most expensive one.", "Отсев идёт от самой дешёвой проверки к самой дорогой."),
        q("Why is regular Google not the same as Google Scholar?", "Regular Google mostly returns blogs and news", ["Regular Google is paid while Scholar is free", "Scholar indexes only computer science papers", "Regular Google cannot search an exact phrase"], "Only academic databases surface peer-reviewed evidence.", "Только академические базы выдают рецензируемые работы."),
        q("How are Scopus and Web of Science described?", "Premium, high-quality databases", ["Free visual discovery tools", "Field-specific computing libraries", "Reference managers for citing"], "They are premium; students are told to ask the librarian for access.", "Они платные; за доступом советуют обратиться к библиотекарю."),
        q("What is the golden rule when picking papers?", "Check what the paper actually studies, not only its title", ["Prefer the papers that have the most attractive titles", "Choose the newest paper regardless of what it actually covers", "Pick papers from a single journal for consistency"], "A title that sounds interesting does not guarantee relevance.", "Интересное название ещё не означает релевантность."),
        q("What should be recorded for each paper found in the live mission?", "Title, year, authors, venue and DOI or link", ["Only the title and the downloaded PDF file", "The abstract copied word for word", "The number of pages, tables and figures"], "These fields make the source traceable later.", "Эти поля позволяют потом найти источник."),
        q("When should you read a paper in full?", "Only if title, abstract, keywords and conclusion confirm relevance", ["Always, before deciding whether the paper is relevant to your problem", "Only if the paper is shorter than ten pages in total", "Only if it was published within the last twelve months"], "A full read is the fifth and most expensive screening step.", "Полное чтение — пятый и самый дорогой шаг отсева."),
        q("Which of the five questions for every paper is the one where gaps usually appear?", "What is still missing?", ["What problem did they study?", "How did they investigate it?", "What did they find?"], "Limitations, open questions and future work point to gaps.", "На пробелы указывают ограничения, открытые вопросы и будущая работа."),
        q("If you cannot answer the five questions about a paper, you have…", "Only looked at the paper, not read it", ["Found a research gap in that paper", "Proved that the paper is unreliable", "Completed the screening protocol"], "The five questions test whether you actually understood the study.", "Пять вопросов проверяют, действительно ли вы поняли исследование."),
        q("Complete the motto: \"Search wide. Screen fast. Read relevant work …\"", "deeply", ["first", "once", "quickly"], "Depth is reserved for the papers that passed screening.", "Глубокое чтение — только для статей, прошедших отсев."),
        q("What are ScienceDirect and SpringerLink especially useful for?", "Interdisciplinary, HCI, education and applied CS work", ["Hardware and electronics standards and nothing outside engineering", "Drawing visual citation maps of papers", "Checking DOI metadata of a reference"], "They cover broad scientific publishing beyond pure computing.", "Они покрывают широкий круг наук за пределами чистой информатики."),
      ],
    ),
    part(
      "rm-w2-p3",
      { en: "The evidence matrix: connect papers, don't collect them", ru: "Матрица доказательств: связывать статьи, а не копить" },
      {
        en: `## The Evidence Matrix
Each paper becomes one row with seven columns: **Paper · Problem / Purpose · Method · Data / Participants · Main Finding · Limitation · What Is Missing?**
Example row: Smith et al. (2023) · multilingual LLM factual QA accuracy · benchmark evaluation · 3 LLMs, 500 QA items, 5 domains · accuracy drops 18–34% for low-resource languages · no Kazakh-specific tasks included · Kazakh factual QA evaluation.
The **Limitation / What is missing** columns record what a study did NOT do — this is where gaps start to appear.
Fill the matrix **in your own words** (do not copy the abstract). If a cell is blank, re-read the paper. The matrix becomes the foundation of your literature review.
## Connect, don't collect
- The summary trap: "Paper 1 says X. Paper 2 says Y. Paper 3 says Z."
- The pattern approach: "Papers 1, 2 and 3 converge on X in English contexts. Paper 4 challenges this in multilingual settings. All share this limitation. None of them evaluated…"
> A researcher compares — not just summarizes.
When you compare studies, look for **patterns, agreements, contradictions, limitations and what is missing**. The chain is: Pattern → Contradiction → Gap → Your question.
## The detective board
- Paper A: multilingual LLM accuracy — English and Spanish only.
- Paper B: LLM and Kazakh — but translation, not question answering.
- Paper C: a different model family — inconsistent results.
- Paper D: factual QA — but only a 50-item dataset.
Pattern: nobody evaluated **Kazakh factual QA at a reasonable scale** → a possible gap.
## Clues to look for
Same findings across studies? Conflicting results? The same dataset reused? A missing population or language? Outdated data? Small samples? Only one method used?
Choosing only the results that support your own idea is **cherry-picking**, not comparison.`,
        ru: `## Матрица доказательств
Каждая статья — строка с семью колонками: **статья · проблема / цель · метод · данные / участники · главный результат · ограничение · чего не хватает?**
Пример строки: Smith et al. (2023) · точность мультиязычных LLM в фактических вопросах · бенчмарк · 3 LLM, 500 вопросов, 5 областей · точность падает на 18–34% для малоресурсных языков · задач на казахском нет · оценка фактических вопросов на казахском.
Колонки **«ограничение / чего не хватает»** фиксируют, чего исследование НЕ сделало, — здесь и начинают проступать пробелы.
Матрицу заполняют **своими словами** (аннотацию не копировать). Если ячейка пустая — перечитать статью. Матрица становится основой обзора литературы.
## Связывать, а не копить
- Ловушка пересказа: «Статья 1 говорит X. Статья 2 говорит Y. Статья 3 говорит Z».
- Подход через закономерности: «Статьи 1, 2 и 3 сходятся на X для английского. Статья 4 оспаривает это в мультиязычной среде. У всех одно ограничение. Никто не оценивал…»
> Исследователь сравнивает, а не просто пересказывает.
Сравнивая исследования, ищите **закономерности, согласия, противоречия, ограничения и то, чего не хватает**. Цепочка: закономерность → противоречие → пробел → ваш вопрос.
## Доска детектива
- Статья A: точность мультиязычных LLM — только английский и испанский.
- Статья B: LLM и казахский — но перевод, а не ответы на вопросы.
- Статья C: другое семейство моделей — противоречивые результаты.
- Статья D: фактические вопросы — но набор всего из 50 пунктов.
Закономерность: никто не оценивал **фактические вопросы на казахском в достаточном масштабе** → возможный пробел.
## На что обращать внимание
Одинаковые выводы в разных работах? Противоречащие результаты? Один и тот же датасет? Пропущенная группа людей или язык? Устаревшие данные? Малые выборки? Только один метод?
Брать только результаты, которые подтверждают вашу идею, — это **cherry-picking** (выборочный отбор), а не сравнение.`,
      },
      [
        q("What should you look for when comparing multiple scientific studies?", "Patterns, agreements, contradictions, limitations and what is missing", ["Citation counts, journal names, impact factors and years of publication", "Mainly the results which happen to support your own initial idea", "Which of the papers is the longest and has the most references"], "Comparison means synthesis across studies, not counting or cherry-picking.", "Сравнение — это синтез по исследованиям, а не подсчёт и не выборочный отбор."),
        q("Which category describes something a previous study did not investigate or could not fully address?", "Limitation / What is missing", ["Main finding", "Method", "Problem / Purpose"], "That column of the evidence matrix records what the study did not do.", "Эта колонка матрицы фиксирует, чего исследование не сделало."),
        q("Which set of columns belongs to the Evidence Matrix?", "Paper, purpose, method, data, finding, limitation, what is missing", ["Paper, price, page count, publisher, language, country, format", "Author, university, funding, awards, co-authors, email address, website", "Title, font, figures, tables, appendices, references, footnotes"], "Seven columns: paper, problem/purpose, method, data/participants, main finding, limitation, what is missing.", "Семь колонок: статья, проблема/цель, метод, данные/участники, результат, ограничение, чего не хватает."),
        q("How should the evidence matrix be filled in?", "In your own words", ["By pasting each abstract into the cells", "By an AI tool, without opening the papers", "Only with direct quotations from the paper"], "Copying the abstract shows you have not processed the study.", "Копирование аннотации показывает, что исследование не осмыслено."),
        q("\"Paper 1 says X. Paper 2 says Y. Paper 3 says Z.\" What is this?", "A summary, not a synthesis", ["A synthesis of three sources", "A research gap statement", "A completed evidence matrix"], "This is the summary trap: the papers are listed but not connected.", "Это ловушка пересказа: статьи перечислены, но не связаны."),
        q("Papers A–D cover English and Spanish only, Kazakh translation, inconsistent results, and a 50-item QA set. What possible gap does the board show?", "Kazakh factual QA at a reasonable scale", ["English factual QA with large datasets", "Translation quality for Spanish texts", "Whether any LLM supports Kazakh at all"], "None of the four studies evaluated Kazakh factual question answering at scale.", "Ни одно из четырёх исследований не оценивало фактические вопросы на казахском в масштабе."),
        q("Which chain leads from comparison to your own question?", "Pattern → Contradiction → Gap → Your question", ["Question → Gap → Pattern → Contradiction", "Gap → Pattern → Your question → Contradiction", "Contradiction → Your question → Pattern → Gap"], "You notice patterns and contradictions first; the gap and the question follow.", "Сначала закономерности и противоречия, затем пробел и вопрос."),
        q("Which observation is a clue that may point to a gap?", "Several studies reuse the same small dataset", ["The papers were written by different authors", "The papers have different numbers of pages", "The papers were found in the same database"], "Reused datasets, small samples and missing populations are listed as clues.", "Повторяющийся датасет, малые выборки и пропущенные группы названы подсказками."),
        q("Choosing only the results that support your own idea is called…", "Cherry-picking", ["Synthesis", "Screening", "Paraphrasing"], "Selective use of evidence distorts the picture of the literature.", "Выборочное использование данных искажает картину литературы."),
        q("What should you do if a cell of your evidence matrix is blank?", "Re-read the paper", ["Delete the paper from the matrix", "Fill the cell with a reasonable guess", "Copy the cell from a similar paper"], "A blank cell means you have not yet found that information in the paper.", "Пустая ячейка значит, что вы ещё не нашли это в статье."),
        tf("A researcher compares studies rather than just summarising them.", true, "\"Don't collect papers. Connect them.\"", "«Не копите статьи. Связывайте их»."),
      ],
    ),
    part(
      "rm-w2-p4",
      { en: "The research gap", ru: "Исследовательский пробел" },
      {
        en: `## Definition
**Research gap** = something important that previous research has not adequately answered, tested, explained, compared or studied **in your specific context** — the space between what is known and what is not.
A gap does NOT mean "nobody in the world has ever studied the topic". It must be **justified by the literature**, not invented because it sounds interesting.
## Types of gaps
- **Context gap** — studied elsewhere, not in your context: LLMs evaluated in English, limited evidence for Kazakh.
- **Population gap** — a group is missing: professional developers were studied, undergraduate programmers were not.
- **Method gap** — studied in only one way: mostly surveys, limited experimental evaluation.
- **Contradiction gap** — studies disagree and the reasons are unexplained.
- **Evaluation / data gap** — limited datasets, tasks or metrics: only a 50-item test set.
## Gap or not a gap?
- "I searched Google and didn't find anything." → Not enough evidence: a search failure is not a gap.
- "Several studies evaluate multilingual LLMs, but none of the reviewed studies evaluate Kazakh factual QA." → A possible gap, grounded in literature.
- "I personally think ChatGPT is inaccurate." → Not a gap: a personal opinion.
- "Two relevant studies report conflicting results on whether AI coding assistants improve novice performance." → A possible contradiction gap.
## "BUT…" — gap signal words
Watch for: **however, but, limited, few studies, remains unclear, future work**. They are **clues, not proof** — verify them against your full review.
In a real paper, look in the **Discussion, Limitations, Conclusion and Future Work** sections. Record the idea with a citation; do not copy the sentence as your own writing.
## Future work ≠ your gap (yet)
Before claiming an author's "future work" as your gap, verify: has it already been done since? Is it relevant to your project? Can you realistically investigate it?
## Bad and better gap statements
- Bad: "There are not many studies about Kazakh LLMs." — vague, no evidence.
- Better: "Existing studies have evaluated X. However, most focus on Y. Evidence regarding Z remains limited."`,
        ru: `## Определение
**Исследовательский пробел** — нечто важное, на что прежние исследования не ответили, не проверили, не объяснили, не сравнили или не изучили **в вашем конкретном контексте**; пространство между известным и неизвестным.
Пробел НЕ означает «никто в мире никогда этого не изучал». Он должен быть **обоснован литературой**, а не выдуман потому, что звучит интересно.
## Типы пробелов
- **Контекстный** — изучено в другом контексте: LLM оценивали на английском, по казахскому данных мало.
- **По группе (population)** — не хватает группы: изучали профессиональных разработчиков, а студентов-программистов нет.
- **Методический** — изучали одним способом: в основном опросы, экспериментов мало.
- **Противоречие** — исследования расходятся, причины не объяснены.
- **Оценочный / по данным** — ограниченные датасеты, задачи или метрики: тест всего из 50 пунктов.
## Пробел или нет?
- «Я поискал в Google и ничего не нашёл». → Недостаточно: неудачный поиск — не пробел.
- «Несколько исследований оценивают мультиязычные LLM, но ни одно из рассмотренных не оценивает фактические вопросы на казахском». → Возможный пробел, опирается на литературу.
- «Лично я считаю, что ChatGPT неточен». → Не пробел: личное мнение.
- «Два релевантных исследования дают противоречивые результаты о пользе ИИ-ассистентов для новичков». → Возможный пробел-противоречие.
## «НО…» — слова-сигналы
Обращайте внимание на: **however, but, limited, few studies, remains unclear, future work**. Это **подсказки, а не доказательство** — их проверяют всем обзором.
В статье ищите в разделах **Discussion, Limitations, Conclusion и Future Work**. Записывайте идею со ссылкой; не копируйте предложение как собственный текст.
## Future work ≠ ваш пробел (пока)
Прежде чем брать чужое «future work» как свой пробел, проверьте: не сделано ли это с тех пор? Относится ли к вашему проекту? Реально ли это исследовать?
## Плохая и хорошая формулировки
- Плохо: «Исследований про казахские LLM немного». — расплывчато, без доказательств.
- Лучше: «Существующие исследования оценили X. Однако большинство сосредоточено на Y. Данных о Z по-прежнему мало».`,
      },
      [
        q("What is a research gap?", "Something important that remains unknown, untested, limited or unexplored in the relevant context", ["A topic that the researcher personally finds interesting and would like to explore further", "A topic about which nothing at all can be found during a quick five-minute search on regular Google", "A mistake which the researcher noticed while reading the paper of another research team"], "A gap is specific to a context and must be justified by the literature.", "Пробел относится к конкретному контексту и обосновывается литературой."),
        tf("A research gap can be claimed simply because a topic is interesting to the researcher.", false, "A gap must emerge from examining previous research.", "Пробел должен вытекать из анализа прежних исследований."),
        q("\"I searched Google and didn't find anything about this topic.\" What is the verdict?", "Not enough evidence — a search failure is not a gap", ["A confirmed context gap that can be used in the proposal", "A contradiction gap between two studies", "A method gap in the existing research"], "Finding nothing may only mean the search was poor.", "«Ничего не нашёл» может означать лишь плохой поиск."),
        q("Two relevant studies report conflicting results on whether AI coding assistants help novices. Which gap type is this?", "Contradiction gap", ["Population gap", "Method gap", "Evaluation gap"], "Studies disagree and the reasons are unexplained.", "Исследования расходятся, и причины не объяснены."),
        q("Studies examined professional developers but not undergraduate programmers. Which gap type is this?", "Population gap", ["Method gap", "Contradiction gap", "Evaluation gap"], "A group of people is missing from the evidence.", "В данных отсутствует целая группа людей."),
        q("Most studies used surveys; experimental evaluation is limited. Which gap type is this?", "Method gap", ["Context gap", "Population gap", "Contradiction gap"], "The topic was studied in only one way.", "Тему изучали только одним способом."),
        q("LLMs were evaluated in English, with limited evidence for Kazakh. Which gap type is this?", "Context gap", ["Method gap", "Population gap", "Contradiction gap"], "It was studied elsewhere but not in your context.", "Изучено в другом контексте, но не в вашем."),
        q("A study evaluated a model on a test set of only 50 items. Which gap type does this suggest?", "Evaluation / data gap", ["Contradiction gap", "Population gap", "Context gap"], "Limited datasets, tasks or metrics form an evaluation gap.", "Ограниченные датасеты, задачи или метрики — оценочный пробел."),
        q("Which words are gap signal words?", "however, limited, few studies, remains unclear", ["therefore, clearly, obviously, proves", "firstly, secondly, finally, in sum", "revolutionary, fastest, best, disrupts"], "They often introduce what a study did not cover.", "Они часто вводят то, чего исследование не охватило."),
        q("Gap signal words are…", "Clues, not proof", ["Proof that a gap exists", "Signs of plagiarism", "Markers of a weak paper"], "They must be verified against your full review.", "Их нужно проверять всем обзором литературы."),
        q("In which sections of a paper do gap signals usually appear?", "Discussion, Limitations, Conclusion and Future Work", ["Title, author list and affiliations", "Acknowledgements, funding notes and author biographies", "Reference list and appendices"], "Authors describe what they could not do in those sections.", "В этих разделах авторы пишут, чего не смогли сделать."),
        q("What must you check before claiming an author's \"future work\" as your gap?", "That it was not done since, is relevant and is doable", ["That the author gives you written permission to use it", "That the sentence can be copied into your introduction", "Nothing: future work is always a valid research gap"], "Future work is not your gap until these three checks pass.", "«Future work» не ваш пробел, пока не пройдены три проверки."),
        q("A research gap must be…", "Justified by the literature", ["Confirmed by an AI assistant", "Completely unstudied in the world", "Interesting to a wide audience"], "It should not be invented because it sounds interesting.", "Его нельзя выдумывать только потому, что звучит интересно."),
      ],
    ),
    part(
      "rm-w2-p5",
      { en: "From gap to research question (Assignment 1 checks)", ru: "От пробела к исследовательскому вопросу (проверки Assignment 1)" },
      {
        en: `## From gap to research question
The chain is **Evidence → Possible gap → Problem → Research question**.
- Evidence: previous studies evaluate multilingual LLM performance.
- Gap: limited evaluation of Kazakh factual QA.
- Problem: LLMs may produce inaccurate Kazakh answers.
- RQ: "How accurately do selected multilingual LLMs answer Kazakh factual questions?"
> The literature should change your question. If your RQ is identical to Week 1, you probably have not engaged deeply enough.
O'Leary's cycle: **Idea → Reading → Question → More reading → Refined question.**
## Research Question Check (Assignment 1)
A good research question is **clear, focused, researchable, feasible and connected to the problem**.
- **Researchable** — the most important test: *can evidence be collected to answer the question?* "Is Rust better than Java?" cannot be settled; "How do Rust and Java services compare in latency under 100,000 requests/sec?" can.
- **Feasible** — the feasibility check mainly asks whether the required data **can realistically be obtained** (plus time, tools and skills).
- **Connected** — the question must follow logically from the identified problem or gap.
## Variables or concepts
Quantitative studies name an **independent variable** (what is changed or compared) and a **dependent variable** (what is measured). For "Does Tool X reduce debugging time?" the IV is using Tool X or not, the DV is debugging time.
Qualitative or exploratory studies identify the **main concepts or phenomena** instead — for "Why do students stop using an educational app?": disengagement, motivation, usability barriers.
## Do not invent findings
At the research-question stage you have no data. Inventing expected findings is **fabrication**. A hypothesis is a testable prediction, not a claimed result.
## The evidence chain and peer review
My claim → Academic sources → Evidence → Pattern across studies → Limitation / unknown → Research gap → Research question. An argument is only as strong as its weakest link.
60-second pitch: "My problem is… The literature suggests… However… My possible gap is… Therefore, my question is…" The partner may ask only one thing: **"What is your evidence?"**
## Deliverable and AI integrity
The Research Evidence Sheet contains the problem, keywords, query and databases; **at least 5 papers** in a full evidence matrix; what is known and limited plus a preliminary gap; the refined RQ and references with DOI or URL.
AI can help with keyword ideas, terminology, organising notes and synonyms. AI cannot replace real peer-reviewed evidence, real authors and DOIs, verified gaps or legitimate citations.
Today's work forms the Introduction: **Context → Problem → Previous research → Gap → Research question.**`,
        ru: `## От пробела к исследовательскому вопросу
Цепочка: **доказательства → возможный пробел → проблема → исследовательский вопрос (RQ)**.
- Доказательства: прежние работы оценивают мультиязычные LLM.
- Пробел: фактические вопросы на казахском оценены мало.
- Проблема: LLM могут давать неточные ответы на казахском.
- RQ: «Насколько точно выбранные мультиязычные LLM отвечают на фактические вопросы на казахском?»
> Литература должна изменить ваш вопрос. Если RQ такой же, как на первой неделе, вы, вероятно, погрузились недостаточно глубоко.
Цикл О'Лири: **идея → чтение → вопрос → ещё чтение → уточнённый вопрос.**
## Проверка исследовательского вопроса (Assignment 1)
Хороший исследовательский вопрос — **ясный, сфокусированный, исследуемый, выполнимый и связанный с проблемой**.
- **Исследуемый (researchable)** — главный тест: *можно ли собрать доказательства, чтобы ответить на вопрос?* «Rust лучше Java?» — решить нельзя; «Как сервисы на Rust и Java различаются по задержке при 100 000 запросов в секунду?» — можно.
- **Выполнимый (feasible)** — проверка выполнимости в первую очередь спрашивает, **можно ли реально получить нужные данные** (а также время, инструменты и навыки).
- **Связанный** — вопрос должен логически следовать из найденной проблемы или пробела.
## Переменные или понятия
В количественных исследованиях называют **независимую переменную** (что меняют или сравнивают) и **зависимую** (что измеряют). Для «Сокращает ли инструмент X время отладки?» независимая — использование X или нет, зависимая — время отладки.
В качественных и поисковых исследованиях вместо этого называют **основные понятия или явления** — для «Почему студенты бросают учебное приложение?»: потеря вовлечённости, мотивация, барьеры удобства.
## Не выдумывать результаты
На этапе вопроса данных ещё нет. Выдумывать ожидаемые результаты — это **фабрикация**. Гипотеза — проверяемое предсказание, а не заявленный результат.
## Цепочка доказательств и взаимная проверка
Моё утверждение → научные источники → доказательства → закономерность → ограничение / неизвестное → пробел → исследовательский вопрос. Аргумент не сильнее самого слабого звена.
Питч за 60 секунд: «Моя проблема… Литература говорит… Однако… Мой возможный пробел… Поэтому мой вопрос…» Партнёр может спросить только одно: **«Какие у тебя доказательства?»**
## Что сдавать и честность с ИИ
Research Evidence Sheet содержит проблему, ключевые слова, запрос и базы; **не меньше 5 статей** в полной матрице; что известно и что ограничено плюс предварительный пробел; уточнённый RQ и ссылки с DOI или URL.
ИИ может помочь с идеями ключевых слов, терминами, организацией заметок и синонимами. ИИ не заменяет настоящие рецензируемые работы, реальных авторов и DOI, проверенные пробелы и корректные ссылки.
Сегодняшняя работа — это введение статьи: **контекст → проблема → прежние исследования → пробел → исследовательский вопрос.**`,
      },
      [
        q("What is the most important test of whether a research question is researchable?", "Can evidence be collected to answer the question?", ["Is the topic currently popular in the research community?", "Does the question use advanced technical terminology?", "Does the researcher already know what the answer is?"], "Researchable means answerable with data, not with opinion.", "«Исследуемый» значит, что ответ можно получить из данных, а не из мнения."),
        q("Which characteristics should a good research question have?", "Clear, focused, researchable, feasible and connected to the problem", ["Broad, general and covering as many related topics as it possibly can", "Long, complex and written in highly technical language", "Trendy, impressive and never studied by anyone before"], "Remember C-F-R-F-C: clear, focused, researchable, feasible, connected.", "Запомните: ясный, сфокусированный, исследуемый, выполнимый, связанный."),
        q("For qualitative or exploratory studies, what should be identified instead of independent and dependent variables?", "Main concepts or phenomena", ["Control and treatment groups", "Statistical significance tests", "The required sample size"], "Such studies explore meanings and reasons rather than manipulating variables.", "Такие исследования изучают смыслы и причины, а не управляют переменными."),
        q("What does a feasibility check mainly consider?", "Whether the required data can realistically be obtained", ["Whether the topic already has a large number of published papers", "Whether the topic is popular among other students", "Whether the results are likely to look positive"], "Without data there is no evidence and therefore no answer.", "Без данных нет доказательств, а значит и ответа."),
        tf("A strong research question should logically follow from the identified research problem or gap.", true, "Evidence → possible gap → problem → research question must connect.", "Доказательства → пробел → проблема → вопрос должны быть связаны."),
        tf("At the research-question stage, students should invent expected findings to demonstrate that the project will be successful.", false, "Inventing results is fabrication; no data exists at this stage.", "Выдумывание результатов — фабрикация; данных на этом этапе ещё нет."),
        q("Inventing expected findings before any data exists is an example of…", "Fabrication", ["Synthesis", "Paraphrasing", "Feasibility"], "Fabrication means creating data or results that never existed.", "Фабрикация — создание данных или результатов, которых не было."),
        q("Which question is researchable?", "How accurately do selected LLMs answer Kazakh factual questions?", ["Is Rust a better programming language than Java for all kinds of projects?", "Should artificial intelligence exist at all?", "Is ChatGPT a good tool for everybody?"], "Accuracy can be measured on a set of questions; \"better\" and \"good\" cannot be settled by evidence.", "Точность можно измерить на наборе вопросов; «лучше» и «хороший» данными не решить."),
        q("In \"Does Tool X reduce debugging time?\", what is the independent variable?", "Using Tool X or not using it", ["Debugging time in minutes", "The number of participants", "The programming language"], "The independent variable is what is changed or compared.", "Независимая переменная — то, что меняют или сравнивают."),
        q("In \"Does Tool X reduce debugging time?\", what is the dependent variable?", "Debugging time", ["Tool X itself", "The group of participants", "The research question"], "The dependent variable is what is measured.", "Зависимая переменная — то, что измеряют."),
        q("After reading the literature your research question is identical to the one from Week 1. What does this suggest?", "You have probably not engaged deeply enough", ["Your first question was already perfect", "The literature is irrelevant to your topic", "You should stop reading any more papers"], "The literature should change your question.", "Литература должна менять ваш вопрос."),
        q("What is O'Leary's cycle?", "Idea → Reading → Question → More reading → Refined question", ["Question → Experiment → Reading → Idea → Conclusion → Publication", "Reading → Results → Idea → Question → Publication", "Idea → Results → Question → Reading → Refined idea"], "The question is refined through repeated reading.", "Вопрос уточняется через повторное чтение."),
        q("During the 60-second pitch, what is the only question the partner may ask?", "What is your evidence?", ["Why is this interesting?", "Who is your supervisor?", "How long is your paper?"], "Peer review tests whether each link is grounded in literature.", "Взаимная проверка смотрит, опирается ли каждое звено на литературу."),
        q("Which use of AI is acceptable according to the session?", "Suggesting synonyms for search queries", ["Supplying citations that you have not opened", "Replacing real peer-reviewed evidence", "Confirming that a research gap is real"], "AI may help with keywords and terminology but cannot replace real sources.", "ИИ помогает со словами и терминами, но не заменяет настоящие источники."),
        q("Which structure of the Introduction was built in this session?", "Context → Problem → Previous research → Gap → Research question", ["Research question → Method → Results → Discussion → Conclusion", "Gap → Context → Research question → Problem → References", "Problem → Solution → Evaluation → Future work → Gap"], "This is the logic of a paper's introduction.", "Это логика введения статьи."),
        q("How many papers must the Research Evidence Sheet contain at least?", "5", ["1", "3", "20"], "The deliverable requires at least five papers in a full evidence matrix.", "Нужно не меньше пяти статей в полной матрице."),
        q("What is a hypothesis?", "A testable prediction", ["A confirmed finding", "A research gap", "A search query"], "A hypothesis may be stated later, but it is not a claimed result.", "Гипотезу можно сформулировать позже, но это не заявленный результат."),
      ],
    ),
  ],
};
