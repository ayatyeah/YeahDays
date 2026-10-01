import { part, q, tf, type Lecture } from "../types";

export const week4: Lecture = {
  id: "rm-w4",
  title: { en: "Week 4 — Literature review and designing a research plan", ru: "Неделя 4 — Обзор литературы и план исследования" },
  parts: [
    part(
      "rm-w4-p1",
      { en: "What a literature review is; information vs evidence", ru: "Что такое обзор литературы; информация и доказательства" },
      {
        en: `## The central question
"How do you know someone has not already answered your research question?"
"Great idea — can I start my experiment immediately?" **No.** Find out what is already known first.
> The literature comes before the lab.
Hypothetical: you spend 3 months, 500 hours and GPU money on an experiment — and then find a two-year-old paper with the same experiment, methods, data and conclusions. What went wrong? You did not know the literature.
## What is a literature review?
Not a list of papers, not a summary of papers and not a bibliography. It is an **analysis and synthesis of existing research**. It examines what is known, how it was studied, what was found, where studies agree or disagree, what limitations exist and what remains unknown.
## Why it matters — six reasons
- Understand what is already known.
- Avoid unnecessary duplication.
- Identify existing methods, datasets, benchmarks and metrics.
- Discover contradictions and limitations.
- Justify your own research.
- Identify a possible research gap.
## The funnel from question to gap
My research question → What do we already know? → How was it studied? → What did they find? → Where do studies agree? → Where do they disagree? → What are the limitations? → What is still unknown? → **Research gap**.
## Information vs evidence
- **Informal:** a blog, Wikipedia, YouTube, a ChatGPT summary.
- **Educational:** a textbook, technical documentation.
- **Scholarly:** a research article, a conference paper, a systematic review.
The key question is: **where does the claim come from?** Trace claims to the original scholarly source.
## Primary and secondary sources
- **Primary** — original research; the authors conducted and reported the study. Closest to the evidence.
- **Secondary** — analyses, reviews or synthesises primary work: review articles, systematic reviews, textbook chapters. Good for orientation; check the originals for important claims.
## Source detective
- A blog claiming "LLMs are 95% accurate" with no citation and no method → untraceable.
- A peer-reviewed paper with a documented method, dataset and reproducible results → the best (primary).
- A Wikipedia paragraph → only for orientation; trace its references.
- A systematic review in a peer-reviewed journal → good (secondary; check the key originals).
- An AI-generated summary with no citation → not verifiable.`,
        ru: `## Главный вопрос
«Откуда вы знаете, что на ваш исследовательский вопрос ещё никто не ответил?»
«Отличная идея — можно сразу начинать эксперимент?» **Нет.** Сначала выясните, что уже известно.
> Литература идёт раньше лаборатории.
Представьте: вы потратили 3 месяца, 500 часов и деньги на GPU — а потом нашли статью двухлетней давности с тем же экспериментом, методами, данными и выводами. Что пошло не так? Вы не знали литературу.
## Что такое обзор литературы?
Не список статей, не пересказ статей и не библиография. Это **анализ и синтез существующих исследований**. Он показывает, что известно, как это изучали, что нашли, где работы согласны и где расходятся, какие есть ограничения и что остаётся неизвестным.
## Зачем он нужен — шесть причин
- Понять, что уже известно.
- Избежать ненужного повторения.
- Найти существующие методы, датасеты, бенчмарки и метрики.
- Обнаружить противоречия и ограничения.
- Обосновать собственное исследование.
- Найти возможный пробел.
## Воронка от вопроса к пробелу
Мой вопрос → Что уже известно? → Как это изучали? → Что нашли? → Где работы согласны? → Где расходятся? → Какие ограничения? → Что ещё неизвестно? → **Исследовательский пробел**.
## Информация и доказательства
- **Неформальные:** блог, Википедия, YouTube, пересказ от ChatGPT.
- **Учебные:** учебник, техническая документация.
- **Научные:** исследовательская статья, доклад конференции, систематический обзор.
Ключевой вопрос: **откуда взято утверждение?** Прослеживайте утверждения до исходного научного источника.
## Первичные и вторичные источники
- **Первичный** — оригинальное исследование; авторы сами провели и описали работу. Ближе всего к данным.
- **Вторичный** — анализирует, обозревает или обобщает первичные работы: обзорные статьи, систематические обзоры, главы учебников. Хорош для ориентации; важные утверждения проверяют по оригиналам.
## Детектив источников
- Блог «LLM точны на 95%» без ссылки и метода → не проследить.
- Рецензируемая статья с описанным методом, датасетом и воспроизводимыми результатами → лучший вариант (первичный).
- Абзац из Википедии → только для ориентации; идти по его ссылкам.
- Систематический обзор в рецензируемом журнале → хорошо (вторичный; ключевые оригиналы проверить).
- Пересказ от ИИ без ссылки → не проверить.`,
      },
      [
        q("What is a literature review?", "An analysis and synthesis of existing research", ["A list of all the papers ever published on a topic", "A summary of each paper in turn", "A bibliography formatted in APA style"], "It analyses and connects research rather than listing or summarising it.", "Он анализирует и связывает исследования, а не перечисляет и не пересказывает."),
        q("\"Great idea — can I start my experiment immediately?\" What is the answer?", "No — first find out what is already known", ["Yes — data are more valuable than reading", "Yes — if the idea was approved by the team", "No — first buy the necessary hardware"], "The literature comes before the lab.", "Литература идёт раньше лаборатории."),
        q("After three months of work you find a two-year-old paper with the same experiment. What went wrong?", "You did not know the literature", ["You used the wrong GPU model", "You chose a dataset that was too small", "You wrote the final paper too slowly"], "A literature review would have revealed the duplicate before the work started.", "Обзор литературы показал бы дубликат до начала работы."),
        q("Which of these is one of the six reasons to review the literature?", "To avoid unnecessary duplication", ["To increase the length of the paper", "To prove your hypothesis in advance", "To replace your own data collection"], "The review also reveals methods, contradictions and a possible gap.", "Обзор также показывает методы, противоречия и возможный пробел."),
        q("What is a primary source?", "Original research reported by those who conducted it", ["A review article that summarises many other studies", "A textbook chapter that explains the topic to students", "A blog post that explains a paper in simple words"], "Primary sources are closest to the evidence.", "Первичные источники ближе всего к данным."),
        q("A systematic review in a peer-reviewed journal is a…", "Secondary source", ["Primary source", "Tier 3 source", "Informal source"], "It synthesises primary studies; check the key originals.", "Он обобщает первичные работы; ключевые оригиналы стоит проверить."),
        q("A blog says \"LLMs are 95% accurate\" with no citation and no method. How should you treat it?", "As untraceable — not usable as evidence", ["As a primary source of evidence", "As a secondary scholarly source", "As a Tier 1 peer-reviewed source"], "You cannot trace where the claim comes from.", "Нельзя проследить, откуда взято утверждение."),
        q("How should a Wikipedia paragraph be used?", "Only for orientation; trace its references", ["As the main evidence for a key claim", "As a primary source of the experiment", "It must never even be opened"], "It is community-edited and may be outdated.", "Её редактирует сообщество, и она может быть устаревшей."),
        q("What is the problem with an AI-generated summary that has no citation?", "It is not verifiable", ["It is always completely wrong", "It is too short to be useful", "It is written too formally"], "Evidence must be traceable to a real source.", "Доказательство должно вести к реальному источнику."),
        q("What is the key question to ask about any claim?", "Where does the claim come from?", ["How many people repeat the claim?", "How confident does the author sound?", "How recently was the claim posted?"], "Trace claims to the original scholarly source.", "Прослеживайте утверждения до исходного научного источника."),
        q("What is the last step of the funnel that starts from your research question?", "Research gap", ["Bibliography", "Data collection", "Conclusion"], "The funnel ends at what is still unknown — the gap.", "Воронка заканчивается тем, что ещё неизвестно, — пробелом."),
        q("Which of these is a scholarly source?", "A conference paper", ["A YouTube tutorial", "A company blog post", "A ChatGPT summary"], "Research articles, conference papers and systematic reviews are scholarly.", "Научные источники — статьи, доклады конференций и систематические обзоры."),
        tf("The literature comes before the lab.", true, "You must find out what is already known before starting the experiment.", "Нужно выяснить, что уже известно, до начала эксперимента."),
        q("How should secondary sources be used?", "For orientation, checking originals for key claims", ["As a full replacement for reading any primary sources", "Never, because they contain no real evidence", "Only when no primary source has a DOI"], "They are useful maps, but important claims need the original study.", "Это полезные карты, но важным утверждениям нужен оригинал."),
      ],
    ),
    part(
      "rm-w4-p2",
      { en: "Search strategy, filtering and strategic reading", ru: "Стратегия поиска, отсев и стратегическое чтение" },
      {
        en: `## The search ecosystem
- **Google Scholar** — broad and free.
- **Scopus** — a large citation database with strong metrics.
- **Web of Science** — high-quality journal indexing.
- **IEEE Xplore** — engineering and computer science.
- **ACM Digital Library** — computing and software research.
- **SpringerLink / ScienceDirect** — broad scientific publishing.
No single database covers everything.
## Searching the wrong way
Wrong: typing the whole research question — "How do large language models make mistakes when answering Kazakh programming questions for university students?" It matches nothing.
Right: break it into concepts — LLMs · Kazakh language · programming questions · factual errors / evaluation.
**Concepts → Synonyms → Keywords → Search query.**
## Boolean search
AND narrows, OR broadens, quotation marks give an exact phrase.
= ("large language model" OR LLM) AND (Kazakh OR "low-resource language") AND (hallucination OR factuality OR accuracy)
Week 4 task: **3–4 concepts, 2–4 keywords each, at least 2 queries**; try them in Google Scholar or IEEE and compare the results with a neighbour.
## 2,438 papers
A large result set is not success — it is the start of filtering.
The filter funnel: 2,438 results (keyword match) → title screening → abstract reading → keyword check → relevance to the RQ → method and context check → full text of the relevant papers.
> A paper containing your keyword is not automatically relevant.
## The 60-second paper test
Research aim → Title → Abstract → Method → Findings → **YES**: keep and read fully / **NO**: move on. It is a screening tool, not a replacement for careful reading.
## Strategic reading order
Do not read a paper like a novel, from page 1 to page 20. Read: **Title and abstract → Conclusion → Method → Results → Full text (if relevant).**`,
        ru: `## Где искать
- **Google Scholar** — широкий и бесплатный.
- **Scopus** — большая база цитирований с сильными метриками.
- **Web of Science** — индексация журналов высокого качества.
- **IEEE Xplore** — инженерия и computer science.
- **ACM Digital Library** — вычисления и исследования ПО.
- **SpringerLink / ScienceDirect** — широкий круг научных изданий.
Ни одна база не покрывает всё.
## Как искать не надо
Неправильно: вводить весь исследовательский вопрос — «How do large language models make mistakes when answering Kazakh programming questions for university students?» Ничего не найдётся.
Правильно: разбить на понятия — LLM · казахский язык · вопросы по программированию · фактические ошибки / оценка.
**Понятия → синонимы → ключевые слова → поисковый запрос.**
## Булев поиск
AND сужает, OR расширяет, кавычки дают точную фразу.
= ("large language model" OR LLM) AND (Kazakh OR "low-resource language") AND (hallucination OR factuality OR accuracy)
Задание 4-й недели: **3–4 понятия, по 2–4 ключевых слова, минимум 2 запроса**; проверить их в Google Scholar или IEEE и сравнить результаты с соседом.
## 2 438 статей
Большая выдача — не успех, а начало отсева.
Воронка отсева: 2 438 результатов (совпадение по ключевым словам) → отсев по названиям → чтение аннотаций → проверка ключевых слов → релевантность вопросу → проверка метода и контекста → полный текст релевантных статей.
> Статья, в которой есть ваше ключевое слово, не обязательно релевантна.
## Тест статьи за 60 секунд
Цель исследования → название → аннотация → метод → результаты → **ДА**: оставить и прочитать целиком / **НЕТ**: идти дальше. Это инструмент отсева, а не замена внимательному чтению.
## Порядок стратегического чтения
Не читайте статью как роман, с 1-й страницы по 20-ю. Порядок: **название и аннотация → заключение → метод → результаты → полный текст (если релевантно).**`,
      },
      [
        q("Your query returns 2,438 papers. What does that mean?", "It is the start of filtering, not success", ["The search is finished and successful", "All of the papers must be read in full", "The query should be made much broader"], "A large result set still has to be screened.", "Большую выдачу ещё предстоит отсеять."),
        q("What is the order of the filter funnel after the keyword match?", "Titles → abstracts → keywords → relevance to RQ → method and context → full text", ["Full text → method and context → abstracts → keywords → titles → relevance to RQ", "Abstracts → full text → titles → relevance to RQ → keywords → method", "Keywords → full text → relevance to RQ → titles → abstracts → context"], "Each stage is more expensive, so it is applied to fewer papers.", "Каждая стадия дороже, поэтому применяется к меньшему числу статей."),
        q("What is the strategic reading order?", "Title and abstract → Conclusion → Method → Results → Full text", ["Introduction → Related work → Method → Results → Conclusion", "References → Method → Title and abstract → Results → Conclusion", "Results → Introduction → Conclusion → References → Method"], "Do not read a paper like a novel from the first page to the last.", "Не читайте статью как роман от первой страницы до последней."),
        q("A paper contains your keyword. What follows?", "It is not automatically relevant", ["It must be added to your review", "It certainly studies your problem", "It can be cited without reading"], "Relevance is decided by the abstract, method and context.", "Релевантность определяют аннотация, метод и контекст."),
        q("How is the 60-second paper test described?", "A screening tool, not a replacement for careful reading", ["A complete method for understanding any paper without reading it", "A way to write the literature review faster", "A test of how quickly you are able to read"], "It only decides whether a paper deserves a full read.", "Он лишь решает, заслуживает ли статья полного чтения."),
        q("Why should you search more than one database?", "No single database covers everything", ["Each database charges a separate fee", "Databases delete papers every year", "Google Scholar contains only books"], "Coverage differs between databases.", "Покрытие у баз разное."),
        q("What did the Week 4 search task require?", "3–4 concepts, 2–4 keywords each, at least 2 queries", ["1 concept, 10 keywords and a single long query", "5 concepts, no synonyms and one query per concept", "A full-sentence query pasted into two databases"], "Several queries are compared in Google Scholar or IEEE.", "Несколько запросов сравнивают в Google Scholar или IEEE."),
        q("What is Scopus mainly known for?", "A large citation database with strong metrics", ["Free visual maps of related papers", "A reference manager with a Word plugin", "A registry of DOI metadata records"], "Scopus is a premium citation database.", "Scopus — платная база цитирований."),
        q("What is Web of Science known for?", "High-quality journal indexing", ["Computing conference proceedings", "Free access to every full text", "Automatic translation of papers"], "It indexes selected high-quality journals.", "Она индексирует отобранные журналы высокого качества."),
        q("Which process turns a problem into a query?", "Concepts → Synonyms → Keywords → Search query", ["Search query → Keywords → Concepts → Synonyms", "Keywords → Search query → Synonyms → Concepts", "Synonyms → Search query → Concepts → Keywords"], "You name the concepts first and build the query last.", "Сначала называют понятия, запрос собирают в конце."),
        q("In the query group (hallucination OR factuality OR accuracy), what does the bracket contain?", "Synonyms of one concept", ["Three different concepts", "Terms to be excluded", "An exact phrase to match"], "OR inside brackets collects alternative names for one concept.", "OR в скобках собирает альтернативные названия одного понятия."),
        tf("Reading every paper from the first page to the last is the most efficient strategy.", false, "Strategic reading starts with the title, abstract and conclusion.", "Стратегическое чтение начинают с названия, аннотации и заключения."),
        q("In the strategic reading order, what do you read right after the title and abstract?", "The conclusion", ["The method", "The references", "The introduction"], "The conclusion shows the take-away before you invest in the details.", "Заключение показывает главный вывод до погружения в детали."),
      ],
    ),
    part(
      "rm-w4-p3",
      { en: "Synthesis, contradictions, limitations and the gap", ru: "Синтез, противоречия, ограничения и пробел" },
      {
        en: `## The biggest literature review mistake
"Smith (2021) found… Lee (2022) found… Kim (2023) found… Ali (2023) found…" This is **reporting, not reviewing**.
What is needed: **comparison, connection, critique and synthesis**.
> Make the papers talk to each other.
## The detective evidence board
- Study A: high accuracy, English only, Model X.
- Study B: lower accuracy, multilingual data, Model X.
- Study C: good performance, but a very small evaluation set.
- Study D: Kazakh included — translation only, not QA.
Agree: Model X works well in English. Disagree: performance drops on multilingual data (A vs B). Why: language and dataset differences, sample size. Missing: Kazakh **factual QA** at an adequate scale.
## Contradictions are valuable
Study A: "Method X improves accuracy." Study B: "No improvement." Who is wrong? **Maybe neither.** Check: a different dataset or domain? A different architecture? A different language or metric? A different sample size or setup? Contradictions may reveal a gap.
## Limitations are clues, not dead ends
- "Only English was evaluated." → What about other languages?
- "Only one model was tested." → How do results compare across models?
- "The evaluation set was small." → Would the results hold at scale?
- "May not generalize to low-resource languages." → Which languages need study?
## What is a research gap?
Not "nobody ever studied it". Four forms: **limited evidence · contradictory results · understudied context · outdated evidence**. A gap must be justified by the literature.
## The gap formula
**We know…** (existing studies have established that…) → **However…** (most studies focus on Y, or studies disagree about…) → **We still do not know…** (it remains unclear whether Z holds in this context) → **Therefore, this study will…** (investigate Z to address the gap).
## Find the gap
Study A: hallucinations in English factual QA. Study B: factual QA in Russian. Study C: Kazakh translation quality, not QA. RQ: "How accurately do selected LLMs answer factual questions in Kazakh?"
Known: factual QA was evaluated in English and Russian; Kazakh only for translation. Missing: **Kazakh factual QA**. In real research the gap must be justified with actual papers.`,
        ru: `## Главная ошибка обзора литературы
«Smith (2021) обнаружил… Lee (2022) обнаружил… Kim (2023) обнаружил… Ali (2023) обнаружил…» Это **отчёт, а не обзор**.
Нужно: **сравнение, связь, критика и синтез**.
> Заставьте статьи разговаривать друг с другом.
## Доска улик
- Исследование A: высокая точность, только английский, модель X.
- Исследование B: ниже точность, мультиязычные данные, модель X.
- Исследование C: хорошие результаты, но очень маленький набор для оценки.
- Исследование D: казахский есть — но только перевод, а не ответы на вопросы.
Согласны: модель X хорошо работает на английском. Расходятся: на мультиязычных данных качество падает (A против B). Почему: различия языка и датасета, размер выборки. Не хватает: **фактических вопросов** на казахском в достаточном масштабе.
## Противоречия ценны
Исследование A: «Метод X повышает точность». Исследование B: «Улучшения нет». Кто неправ? **Возможно, никто.** Проверьте: другой датасет или область? Другая архитектура? Другой язык или метрика? Другой размер выборки или настройка? Противоречие может указывать на пробел.
## Ограничения — подсказки, а не тупики
- «Оценивался только английский». → А другие языки?
- «Тестировалась только одна модель». → А как у других моделей?
- «Набор для оценки был маленьким». → Сохранятся ли результаты в масштабе?
- «Может не обобщаться на малоресурсные языки». → Какие языки нужно изучить?
## Что такое исследовательский пробел?
Не «никто никогда не изучал». Четыре формы: **мало данных · противоречивые результаты · малоизученный контекст · устаревшие данные**. Пробел обязан быть обоснован литературой.
## Формула пробела
**We know… (мы знаем)** — существующие работы установили… → **However… (однако)** — большинство сосредоточено на Y или работы расходятся… → **We still do not know… (мы всё ещё не знаем)** — неясно, верно ли Z в этом контексте → **Therefore, this study will… (поэтому это исследование)** — изучит Z, чтобы закрыть пробел.
## Найди пробел
Исследование A: галлюцинации в фактических вопросах на английском. B: фактические вопросы на русском. C: качество перевода на казахский, не вопросы. RQ: «Насколько точно выбранные LLM отвечают на фактические вопросы на казахском?»
Известно: фактические вопросы оценены для английского и русского; казахский — только перевод. Не хватает: **фактических вопросов на казахском**. В реальной работе пробел обосновывают настоящими статьями.`,
      },
      [
        q("\"Smith (2021) found… Lee (2022) found… Kim (2023) found…\" What is wrong with this review?", "It is reporting, not reviewing", ["It cites too few recent papers", "It uses the wrong citation style", "It contains too much critique"], "The studies are listed one by one without being connected.", "Работы перечислены по одной, без связи между ними."),
        q("What does a real literature review need?", "Comparison, connection, critique and synthesis", ["Description, quotation, listing and formatting", "Introduction, method, results and discussion", "Keywords, queries, databases and filters"], "\"Make the papers talk to each other.\"", "«Заставьте статьи разговаривать друг с другом»."),
        q("Study A says Method X improves accuracy; Study B finds no improvement. Who is wrong?", "Maybe neither — compare datasets, models and setups", ["Study A, because positive results are less reliable", "Study B, because it failed to reproduce the result", "Both, so neither study can be cited in a review"], "Different datasets, architectures, metrics or samples may explain the difference.", "Различие могут объяснять разные датасеты, архитектуры, метрики или выборки."),
        q("A paper states: \"Only English was evaluated.\" Which question does this limitation suggest?", "What about other languages?", ["Was the paper peer-reviewed?", "Who funded the research?", "Is English a suitable language?"], "A limitation points to what could be studied next.", "Ограничение указывает, что можно изучить дальше."),
        q("A paper states: \"Only one model was tested.\" Which question follows?", "How do results compare across models?", ["Why was the paper published at all?", "Is that model still on the market?", "Who developed the tested model?"], "The limitation suggests a comparison across models.", "Ограничение подсказывает сравнение по моделям."),
        q("What is the gap formula?", "We know → However → We still do not know → Therefore, this study will", ["Therefore → We know → However → We still do not know → This study did", "However → Therefore → We know → This study will → We do not know", "We do not know → We know → Therefore → However → This study will"], "It moves from established knowledge to the unknown and then to your study.", "Формула ведёт от известного к неизвестному и затем к вашему исследованию."),
        q("Which four forms of a research gap are named in Week 4?", "Limited evidence, contradictory results, understudied context, outdated evidence", ["New technology, large market, strong team and enough funding for the whole study", "Short papers, old journals, unknown authors, missing reference lists", "Interesting topic, popular field, easy method, quick results expected"], "All four must be justified by the literature.", "Все четыре формы обосновываются литературой."),
        q("Only models released before 2023 were evaluated. Which form of gap is this?", "Outdated evidence", ["Contradictory results", "Understudied context", "Limited evidence"], "Old studies may not reflect current models and tools.", "Старые работы могут не отражать текущие модели и инструменты."),
        q("Study A: English factual QA. Study B: Russian factual QA. Study C: Kazakh translation. What is missing?", "Kazakh factual QA", ["English translation quality", "Russian translation quality", "English factual QA"], "Kazakh was examined only for translation, not question answering.", "Казахский изучали только в переводе, а не в ответах на вопросы."),
        q("Which statement about research gaps is correct?", "A gap rarely means that nobody has ever studied the topic", ["A gap exists whenever a topic feels new to the researcher", "A gap is confirmed as soon as one search returns nothing", "A gap can be stated without citing any previous studies"], "A gap is specific and grounded in what previous studies did and did not do.", "Пробел конкретен и опирается на то, что прежние работы сделали и не сделали."),
        q("How does the lecture describe limitations?", "Clues, not dead ends", ["Errors, not findings", "Excuses, not results", "Opinions, not evidence"], "They show where new research can begin.", "Они показывают, где может начаться новое исследование."),
        q("What may a contradiction between studies reveal?", "A research gap", ["A case of plagiarism", "A formatting error", "A weak search query"], "Unexplained disagreement is one form of gap.", "Необъяснённое расхождение — одна из форм пробела."),
        q("On the evidence board, why might Study A (English) and Study B (multilingual) report different accuracy for the same model?", "Language and dataset differences", ["One of the studies fabricated data", "The two studies used different fonts", "The model was renamed between studies"], "Context differences often explain apparent contradictions.", "Различия контекста часто объясняют кажущиеся противоречия."),
        tf("A research gap must be justified by the literature.", true, "It should not be invented because it sounds interesting.", "Его нельзя выдумывать потому, что звучит интересно."),
        q("Complete the advice: \"Make the papers …\"", "talk to each other", ["longer than before", "agree with you", "easier to cite"], "Synthesis connects studies instead of listing them.", "Синтез связывает исследования, а не перечисляет их."),
      ],
    ),
    part(
      "rm-w4-p4",
      { en: "The research plan, feasibility and alignment", ru: "План исследования, выполнимость и согласованность" },
      {
        en: `## Now we can plan
Literature → Synthesis → Evidence → Gap → Research question. You now know not only *what* you study but *why* it adds new knowledge.
## What is a research plan?
A logical plan for turning a research question into evidence. It is preliminary — the full methodology comes in Week 5 and later. Five questions:
- What evidence do I need to answer my RQ?
- Where can I get that evidence or data?
- How could I collect or generate it?
- How could I analyse it?
- Can I actually do it — is it feasible?
## Methods are not a shopping list
"I will use: a survey, an interview, an experiment, machine learning, ChatGPT." — no connection to the RQ.
> A method is chosen because it helps answer the research question, not because it sounds impressive.
## From question to evidence
- "What types of errors occur in Kazakh LLM responses?" → systematically collected LLM responses plus manual error annotation and classification.
- "Why do students stop using an educational app?" → user interviews plus usage logs showing drop-off points.
- "Does Tool X reduce debugging time?" → task completion time in an experiment with and without Tool X.
## Research plan workshop
1. My RQ. 2. What the literature tells me. 3. Contradictions and limitations. 4. A possible gap. 5. What to observe or measure. 6. Data sources and resources (tools, access, time).
## Reality check
Checklist: **Time · Data access · Computing · Skills · Ethics · Scope.** Green — proceed. Yellow — adjust the scope. Red — redesign.
The GPU story: "I will train a new 70B-parameter LLM from scratch" with a personal laptop, 12 weeks, no GPU cluster and no dataset. The research *area* is legitimate, but the *plan* is not feasible.
> Adjust the scope — not the ambition.
## Alignment check
**Research problem → Research question → Literature → Research gap → Research aim → Evidence → Method → Data → Answer.**
At each link ask: does this follow from the previous one? If you answer NO at any link, that is exactly where you need to revise.
## Closing
> Don't just find papers. Find the story the papers are telling.
Next: Week 5 — Research Methodology.`,
        ru: `## Теперь можно планировать
Литература → синтез → доказательства → пробел → исследовательский вопрос. Теперь вы знаете не только *что* изучаете, но и *почему* это даёт новое знание.
## Что такое план исследования?
Логичный план того, как превратить исследовательский вопрос в доказательства. Он предварительный — полная методология будет с 5-й недели. Пять вопросов:
- Какие доказательства нужны, чтобы ответить на мой вопрос?
- Где взять эти доказательства или данные?
- Как их собрать или получить?
- Как их анализировать?
- Смогу ли я это сделать — выполнимо ли это?
## Методы — не список покупок
«Я использую: опрос, интервью, эксперимент, машинное обучение, ChatGPT». — связи с вопросом нет.
> Метод выбирают потому, что он помогает ответить на исследовательский вопрос, а не потому, что звучит внушительно.
## От вопроса к доказательствам
- «Какие типы ошибок встречаются в ответах LLM на казахском?» → систематически собранные ответы LLM плюс ручная разметка и классификация ошибок.
- «Почему студенты бросают учебное приложение?» → интервью с пользователями плюс логи, показывающие точки ухода.
- «Сокращает ли инструмент X время отладки?» → время выполнения задач в эксперименте с X и без него.
## Мастерская плана
1. Мой вопрос. 2. Что говорит литература. 3. Противоречия и ограничения. 4. Возможный пробел. 5. Что наблюдать или измерять. 6. Источники данных и ресурсы (инструменты, доступ, время).
## Проверка реальностью
Чек-лист: **время · доступ к данным · вычисления · навыки · этика · объём.** Зелёный — продолжать. Жёлтый — скорректировать объём. Красный — переделать.
История про GPU: «Я обучу новую LLM на 70 млрд параметров с нуля» на личном ноутбуке, за 12 недель, без GPU-кластера и датасета. *Область* исследования достойная, но *план* невыполним.
> Меняй объём, а не амбицию.
## Проверка согласованности
**Проблема → вопрос → литература → пробел → цель → доказательства → метод → данные → ответ.**
У каждого звена спрашивайте: следует ли оно из предыдущего? Если где-то ответ «нет» — именно там и нужно править.
## Напоследок
> Не просто находите статьи. Найдите историю, которую они рассказывают.
Дальше: 5-я неделя — методология исследования.`,
      },
      [
        q("What is a research plan?", "A logical plan for turning a research question into evidence", ["A complete methodology chapter with all the statistical tests", "A schedule of team meetings for the whole trimester", "A list of every method that the team is able to use"], "It is preliminary; the full methodology comes later.", "Он предварительный; полная методология будет позже."),
        q("What is the first of the five questions of a research plan?", "What evidence do I need to answer my RQ?", ["Which method sounds the most advanced?", "How many pages should the paper have?", "Which journal will accept the paper?"], "Evidence comes first; sources, collection, analysis and feasibility follow.", "Сначала доказательства; затем источники, сбор, анализ и выполнимость."),
        q("\"I will use a survey, an interview, an experiment, machine learning and ChatGPT.\" What is the problem?", "The methods are not connected to the research question", ["The list is too short for a serious research project", "Surveys and interviews cannot be used in IT research", "Machine learning must always be listed before surveys and interviews"], "Methods are not a shopping list.", "Методы — не список покупок."),
        q("Why is a method chosen?", "Because it helps answer the research question", ["Because it sounds impressive to reviewers", "Because other teams are also using it", "Because it needs the least preparation"], "The method follows from the evidence the question requires.", "Метод вытекает из того, какие доказательства нужны вопросу."),
        q("Which evidence fits the question \"Why do students stop using an educational app?\"", "User interviews and usage logs showing drop-off points", ["Task completion time measured with and without the app", "Benchmark accuracy of the app on a 500-item QA set", "The number of downloads in the app store per month"], "A \"why\" question needs reasons and behaviour, not a benchmark.", "Вопросу «почему» нужны причины и поведение, а не бенчмарк."),
        q("Which evidence fits the question \"Does Tool X reduce debugging time?\"", "Task completion time with and without Tool X", ["Interviews about how developers feel about tools", "Manual annotation of errors in LLM responses", "A systematic review of tool documentation"], "An experiment compares the measured time in two conditions.", "Эксперимент сравнивает измеренное время в двух условиях."),
        q("Which evidence fits \"What types of errors occur in Kazakh LLM responses?\"", "Collected LLM responses with manual error annotation", ["Task completion time measured in an experiment", "Usage logs that show the points where users leave the app", "A survey about attitudes towards AI in general"], "Error types are found by annotating and classifying real responses.", "Типы ошибок находят разметкой и классификацией реальных ответов."),
        q("Which items are on the reality-check list?", "Time, data access, computing, skills, ethics, scope", ["Title, abstract, keywords, method, results, conclusion", "Novelty, impact, citations, funding, awards, prestige", "Problem, question, literature, gap, aim, evidence"], "Each item is rated green, yellow or red.", "Каждый пункт оценивают как зелёный, жёлтый или красный."),
        q("In the reality check, what does yellow mean?", "Adjust the scope", ["Proceed as planned", "Redesign the study", "Stop the project"], "Green — proceed, yellow — adjust the scope, red — redesign.", "Зелёный — продолжать, жёлтый — скорректировать объём, красный — переделать."),
        q("In the reality check, what does red mean?", "Redesign", ["Proceed", "Adjust the scope slightly", "Collect more data"], "A red item means the plan cannot work as designed.", "Красный пункт значит, что план в таком виде не сработает."),
        q("What is the lesson of the GPU story?", "Adjust the scope — not the ambition", ["Buy better hardware before you start", "Avoid research on language models", "Ambitious topics are never feasible"], "Evaluate or fine-tune an existing model instead of training a 70B model from scratch.", "Вместо обучения модели на 70 млрд параметров — оценить или дообучить существующую."),
        q("Training a 70B-parameter LLM from scratch on a laptop in 12 weeks is…", "A legitimate area but an infeasible plan", ["A feasible plan with an unethical aim", "An illegitimate area with a good plan", "A plan that only needs more keywords"], "The area is fine; time, computing and data make the plan impossible.", "Область достойная; время, вычисления и данные делают план невыполнимым."),
        q("What is the order of the alignment check?", "Problem → RQ → Literature → Gap → Aim → Evidence → Method → Data → Answer", ["RQ → Problem → Method → Literature → Data → Gap → Aim → Evidence → Answer", "Literature → Problem → Aim → RQ → Method → Gap → Data → Evidence → Answer", "Problem → Method → Data → RQ → Gap → Literature → Evidence → Aim → Answer"], "Every element must follow from the previous one.", "Каждый элемент должен следовать из предыдущего."),
        q("You answer NO at one link of the alignment check. What does it mean?", "That is exactly where you need to revise", ["The whole project must be abandoned", "The link can simply be skipped", "The next link must be removed"], "The check locates the weak connection in the chain.", "Проверка показывает слабое звено цепочки."),
        q("Complete the closing message: \"Don't just find papers. Find the … the papers are telling.\"", "story", ["numbers", "errors", "authors"], "A review explains what the literature as a whole says.", "Обзор объясняет, что говорит литература в целом."),
        tf("A method should be chosen because it sounds impressive.", false, "It is chosen because it helps answer the research question.", "Его выбирают потому, что он помогает ответить на исследовательский вопрос."),
      ],
    ),
  ],
};
