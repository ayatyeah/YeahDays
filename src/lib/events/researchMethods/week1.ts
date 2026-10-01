import { part, q, tf, type Lecture } from "../types";

export const week1: Lecture = {
  id: "rm-w1",
  title: { en: "Week 1 — Taking a Leap into Research", ru: "Неделя 1 — Шаг в мир исследований" },
  parts: [
    part(
      "rm-w1-p1",
      { en: "What research is and the researcher's mindset", ru: "Что такое исследование и мышление исследователя" },
      {
        en: `## Myth and reality
The myth: research means reading Wikipedia, TechCrunch or Reddit, or asking ChatGPT for a quick fact.
The reality (Zina O'Leary): research is a **systematic, creative and critical process** used to:
- find **verifiable** answers to complex, unsolved questions;
- solve real-world, localized computing and software problems;
- build new, **credible and reproducible** knowledge.
## Case study: guessing vs researching
A team must choose a language for a heavy, high-traffic microservice. The lead developer says: "Let's use Rust — it is trendy and a Medium post says it is fast." That is intuition: nobody knows how Rust will behave with their legacy database under traffic spikes.
The research approach is a **controlled experiment (benchmarking)**: simulate 100,000 requests/sec on both a Java and a Rust service, collect **CPU utilisation, RAM overhead and latency (ms)**, and only then decide.
> Research replaces opinion with measured evidence.
## Discussion: an LLM in a banking app
A bank wants an LLM to give financial advice. Skipping the research phase risks wrong advice, legal liability, privacy leaks and security holes. The "hallucination rate" can be measured: build a set of questions with verified answers, run the model, and divide the wrong or invented answers by the total.
## Three habits of a researcher
- **Critical skepticism** — do not trust benchmark graphs blindly; check the methodology, the hardware constraints and the sample size.
- **Methodological rigor** — document every step so that any other engineer can **reproduce** the result.
- **Open-mindedness** — be ready for the data to prove your favourite framework or theory wrong.
## Course rules and teams
At least 70% attendance is required. Teams of **3–4 students** are permanent for the trimester, and the final grade depends heavily on a Team Research Manuscript and Presentation. Each team starts by naming 3 general IT areas it is interested in.`,
        ru: `## Миф и реальность
Миф: исследование — это почитать Википедию, TechCrunch или Reddit либо спросить у ChatGPT быстрый факт.
Реальность (Зина О'Лири): исследование — это **систематический, творческий и критический процесс**, который нужен, чтобы:
- находить **проверяемые** ответы на сложные нерешённые вопросы;
- решать реальные, конкретные задачи в вычислениях и разработке;
- создавать новое, **достоверное и воспроизводимое** знание.
## Кейс: гадать или исследовать
Команде нужно выбрать язык для нагруженного микросервиса. Тимлид говорит: «Берём Rust — он в тренде, и в посте на Medium написано, что он быстрый». Это интуиция: никто не знает, как Rust поведёт себя с их старой базой при всплесках трафика.
Исследовательский подход — **контролируемый эксперимент (бенчмарк)**: дать 100 000 запросов в секунду на сервисы на Java и на Rust, собрать **загрузку CPU, расход RAM и задержку (мс)** и только потом решать.
> Исследование заменяет мнение измеренными данными.
## Обсуждение: LLM в банковском приложении
Банк хочет, чтобы LLM давала финансовые советы. Без этапа исследования — риск неверных советов, юридической ответственности, утечек данных и дыр в безопасности. «Долю галлюцинаций» можно измерить: собрать набор вопросов с проверенными ответами, прогнать модель и поделить число неверных или выдуманных ответов на общее число.
## Три привычки исследователя
- **Критический скептицизм** — не верить графикам бенчмарков на слово; проверять методологию, ограничения железа и размер выборки.
- **Методологическая строгость** — документировать каждый шаг, чтобы другой инженер мог **воспроизвести** результат.
- **Открытость** — быть готовым, что данные опровергнут любимый фреймворк или теорию.
## Правила курса и команды
Нужно не меньше 70% посещаемости. Команды по **3–4 человека** остаются на весь триместр, а итоговая оценка сильно зависит от командной рукописи и презентации. Команда начинает с того, что называет 3 общие IT-области, которые ей интересны.`,
      },
      [
        q("According to O'Leary, research is best described as…", "A systematic, creative and critical process", ["Reading several trusted websites and summarising them", "Asking an AI assistant and checking the answer sounds right", "Collecting as many facts about a topic as time allows"], "Research is defined as a systematic, creative and critical process, not as looking things up.", "Исследование определяется как систематический, творческий и критический процесс, а не как поиск готовых фактов."),
        q("In the microservice case, what turns the choice of language into research?", "Benchmarking both options under the same load", ["Choosing the language the team already enjoys using", "Reading more blog posts until most of them agree", "Asking the lead developer to justify why Rust is fast"], "A controlled experiment with measured data replaces intuition.", "Контролируемый эксперимент с измерениями заменяет интуицию."),
        q("Which metrics did the team collect in the benchmark?", "CPU utilisation, RAM overhead and latency", ["Lines of code, number of files and build time", "GitHub stars, downloads and release frequency", "Developer satisfaction, hiring cost and salaries"], "The case names CPU utilisation, RAM overhead and latency in milliseconds.", "В кейсе названы загрузка CPU, расход RAM и задержка в миллисекундах."),
        q("Which habit means documenting every step so that others can repeat your work?", "Methodological rigor", ["Critical skepticism", "Open-mindedness", "Creative thinking"], "Rigor is about transparent documentation that makes results reproducible.", "Строгость — это прозрачная документация, благодаря которой результат можно воспроизвести."),
        q("Critical skepticism asks you to…", "Check the method, hardware and sample size", ["Reject every result not produced by your own team", "Trust only results that are published with graphs", "Assume popular repositories were already verified"], "Skepticism means examining how a result was obtained before trusting it.", "Скептицизм — это проверить, как получен результат, прежде чем ему верить."),
        q("Open-mindedness in research means…", "Accepting that data may prove your favourite tool wrong", ["Changing the research question whenever results look bad", "Giving every opinion in the team the same weight as data", "Avoiding firm conclusions so that nobody can disagree"], "You must be prepared for the evidence to contradict your preferences.", "Нужно быть готовым, что данные опровергнут ваши предпочтения."),
        q("How can the hallucination rate of an LLM be measured before release?", "Test it on questions with verified answers and count errors", ["Ask the model to rate the correctness of its own answers", "Count how many customers complain during the first month", "Compare the average length of its answers with a rival model"], "Error rate = wrong or fabricated answers divided by all test questions.", "Доля ошибок = неверные или выдуманные ответы, делённые на число тестовых вопросов."),
        tf("Finding a quick fact with ChatGPT or Wikipedia counts as research in the sense used in this course.", false, "That is the common myth; research is systematic and produces verifiable knowledge.", "Это как раз распространённый миф: исследование систематично и даёт проверяемое знание."),
        q("Which word describes a result that another team can obtain again by following your documented steps?", "Reproducible", ["Original", "Theoretical", "Qualitative"], "Reproducibility is one of the properties of knowledge that research must build.", "Воспроизводимость — одно из свойств знания, которое должно давать исследование."),
        q("How large are the permanent project teams in this course?", "3–4 students", ["2 students", "5–6 students", "Individual work only"], "Teams of 3–4 students are formed in the first session and stay for the trimester.", "Команды по 3–4 человека формируются на первом занятии и остаются на весь триместр."),
      ],
    ),
    part(
      "rm-w1-p2",
      { en: "Narrowing the focus and the feasibility matrix", ru: "Сужение темы и матрица выполнимости" },
      {
        en: `## The danger of being too broad
A topic such as "Artificial Intelligence in 2026" or "Cybersecurity" drowns you in millions of papers. The literature review turns into a superficial essay and no distinct knowledge is built.
**Goal:** turn a massive domain into a **sharp, bounded and manageable** problem.
## Examples of narrowing
- Computer Science. Too broad: *Blockchain technology*. Narrowed: *Comparing the transaction throughput (TPS) of Proof-of-Stake vs Proof-of-History under artificial network degradation.*
- Software Engineering. Too broad: *Mobile application performance*. Narrowed: *The impact of Flutter vs React Native on battery consumption during active background GPS tracking.*
> A narrowed topic names what is compared, what is measured and under which conditions.
## The Feasibility Matrix — three hard filters
Before a team commits to a topic, it must pass three practical constraints:
- **Data accessibility** — do you actually have the right to access the source code, private APIs, server logs or target users?
- **Infrastructure requirements** — do you have the computational power, emulators, cloud credits or hardware to run the tests?
- **Time constraints** — can you collect data, analyse it and write the report within the trimester?
## Team activity: peer review of topics
Each team narrows 2 of its 3 areas into measurable topics and swaps them with a neighbouring team. The reviewers must find **at least one major feasibility flaw**, for example "How will you access private banking data?" or "Doesn't this take six months?"`,
        ru: `## Чем опасна слишком широкая тема
Тема вроде «Искусственный интеллект в 2026 году» или «Кибербезопасность» топит в миллионах статей. Обзор литературы превращается в поверхностное эссе, и нового знания не получается.
**Цель:** превратить огромную область в **чёткую, ограниченную и посильную** задачу.
## Примеры сужения
- Computer Science. Слишком широко: *технология блокчейн*. Сужено: *сравнение пропускной способности (TPS) Proof-of-Stake и Proof-of-History при искусственной деградации сети*.
- Software Engineering. Слишком широко: *производительность мобильных приложений*. Сужено: *влияние Flutter и React Native на расход батареи при активном фоновом GPS-трекинге*.
> Суженная тема называет, что сравнивается, что измеряется и в каких условиях.
## Матрица выполнимости — три жёстких фильтра
Прежде чем команда берёт тему, она должна пройти три практических ограничения:
- **Доступность данных** — есть ли у вас право доступа к исходному коду, закрытым API, логам серверов или нужным пользователям?
- **Инфраструктура** — хватает ли вычислительной мощности, эмуляторов, облачных кредитов или железа для тестов?
- **Время** — успеете ли собрать данные, проанализировать их и написать отчёт за триместр?
## Командное задание: взаимная проверка тем
Каждая команда сужает 2 из 3 своих областей до измеримых тем и обменивается ими с соседней командой. Рецензенты обязаны найти **хотя бы один серьёзный изъян выполнимости**, например: «Как вы получите закрытые банковские данные?» или «Разве это не займёт полгода?»`,
      },
      [
        q("Why is \"Cybersecurity\" a poor research topic?", "It is too broad to investigate in depth", ["It has already been fully solved by industry", "It cannot be studied without special hardware", "It is unrelated to software engineering"], "Broad topics lead to a superficial literature review and no distinct knowledge.", "Широкие темы дают поверхностный обзор и не дают нового знания."),
        q("Which of these is a properly narrowed topic?", "Battery use of Flutter vs React Native during background GPS tracking", ["Mobile application performance on modern smartphones, tablets and wearables", "The future of cross-platform development in the next ten years", "Advantages and disadvantages of popular mobile frameworks"], "It names the comparison, the measured value and the condition.", "Здесь названо, что сравнивается, что измеряется и при каком условии."),
        q("A narrowed topic usually names…", "What is compared, what is measured and under which conditions", ["The newest technology, its vendor and its share of the market", "The team members, their roles and the submission deadline", "As many related subtopics as the team can list in a session"], "Those three elements make a topic bounded and measurable.", "Эти три элемента делают тему ограниченной и измеримой."),
        q("What are the three hard filters of the Feasibility Matrix?", "Data accessibility, infrastructure and time", ["Novelty, popularity and funding", "Topic, method and conclusion", "Interest of the team, difficulty of the topic and team size"], "Week 1 lists data accessibility, infrastructure requirements and time constraints.", "В первой неделе названы доступность данных, инфраструктура и время."),
        q("\"How will you access private banking data?\" attacks which filter?", "Data accessibility", ["Time constraints", "Infrastructure requirements", "Topic novelty"], "The question is about the right to obtain the data at all.", "Вопрос о том, есть ли вообще право получить эти данные."),
        q("The infrastructure filter asks…", "Do we have the compute and tools to run the tests?", ["Do we have the legal right to read the code or the logs?", "Can everything be finished before the trimester ends?", "Is the topic interesting enough for the whole team?"], "Infrastructure covers computational power, emulators, cloud credits and hardware.", "Инфраструктура — это мощности, эмуляторы, облачные кредиты и железо."),
        q("What usually happens to the literature review when the topic is too broad?", "It becomes a superficial essay", ["It automatically passes the feasibility check", "It finds too few papers to cite anything", "It becomes much easier to reproduce"], "With millions of papers, depth is impossible.", "При миллионах статей глубина невозможна."),
        q("\"Comparing the TPS of Proof-of-Stake vs Proof-of-History under network degradation\" is the narrowed version of which broad topic?", "Blockchain technology", ["Edge computing latency", "Mobile application performance", "LLM optimisation for mobile chips"], "This is the Computer Science example from the lecture.", "Это пример по Computer Science из лекции."),
        q("During the peer review of topics, the neighbouring team must…", "Find at least one major feasibility flaw", ["Rewrite the topic so that it sounds more impressive", "Approve the topic if it seems interesting to them", "Suggest three additional research areas to explore"], "The activity is designed to test topics against the feasibility filters.", "Задание проверяет темы фильтрами выполнимости."),
        tf("A topic that needs six months of data collection passes the time filter of a one-trimester course.", false, "Collection, analysis and writing must all fit within the trimester.", "Сбор данных, анализ и написание должны уложиться в триместр."),
      ],
    ),
    part(
      "rm-w1-p3",
      { en: "Credible sources and academic search engines", ru: "Достоверные источники и академические поисковики" },
      {
        en: `## The literature hierarchy in IT
- **Tier 1 — highest credibility:** peer-reviewed journal articles and conference proceedings (IEEE Xplore, ACM Digital Library, Springer, Scopus).
- **Tier 2 — moderate credibility:** official technical whitepapers (W3C standards, the original Ethereum whitepaper) and verified documentation.
- **Tier 3 — lowest, avoid in literature reviews:** Medium posts, TechCrunch articles, YouTube tutorials, personal GitHub READMEs, influencer tweets.
## Academic search engines
- **Google Scholar** — the widest open index of academic papers; perfect for initial keyword discovery.
- **IEEE Xplore and ACM Digital Library** — the gold standards for computer science, software architecture and hardware research.
- **Litmaps / Connected Papers** — visual tools: plug in one core paper and get a map of interconnected studies.
## Hype vs science
**Text A (blog):** "Our revolutionary JS engine runs 10x faster than Node.js! It completely disrupts backend development. Download now."
**Text B (academic):** "Under synthetic memory stress tests mapping 50,000 concurrent V8 isolates, the architecture demonstrated an 11.2% reduction in GC pause times versus Node.js v20, with a trade-off of 4% higher baseline idle RAM."
Text B gives precise conditions, exact metrics and an honest trade-off.
> Your literature review must sound like Text B.
## Homework towards Assignment 1
Assignment 1 (Literature Review) is due in **Week 4** and is worth **20 points** of the first attestation. Before the next session: finalize one narrowed topic, find and download **3 peer-reviewed papers**, and bring the PDFs.
The extraction table has these columns: Article · APA reference · Problem · Method / Data · Metrics and results · Limitations · Relevance / Gap.`,
        ru: `## Иерархия источников в IT
- **Уровень 1 — высшая достоверность:** рецензируемые статьи в журналах и труды конференций (IEEE Xplore, ACM Digital Library, Springer, Scopus).
- **Уровень 2 — средняя достоверность:** официальные технические whitepaper (стандарты W3C, оригинальный whitepaper Ethereum) и проверенная документация.
- **Уровень 3 — низшая, в обзоре литературы избегать:** посты на Medium, статьи TechCrunch, обучалки на YouTube, личные README на GitHub, твиты инфлюенсеров.
## Академические поисковики
- **Google Scholar** — самый широкий открытый индекс научных статей; идеален для первого поиска ключевых слов.
- **IEEE Xplore и ACM Digital Library** — золотой стандарт для computer science, архитектуры ПО и исследований железа.
- **Litmaps / Connected Papers** — визуальные инструменты: даёте одну ключевую статью и получаете карту связанных исследований.
## Хайп и наука
**Текст A (блог):** «Наш революционный JS-движок в 10 раз быстрее Node.js! Он полностью меняет бэкенд. Скачивайте».
**Текст B (академический):** «В синтетических стресс-тестах памяти с 50 000 одновременных изолятов V8 архитектура показала снижение пауз сборщика мусора на 11,2% по сравнению с Node.js v20 ценой на 4% большего базового расхода RAM в простое».
В тексте B — точные условия, точные метрики и честно названный компромисс.
> Обзор литературы должен звучать как текст B.
## Домашнее задание к Assignment 1
Assignment 1 (обзор литературы) сдаётся на **4-й неделе** и даёт **20 баллов** первой аттестации. К следующему занятию: окончательно выбрать одну суженную тему, найти и скачать **3 рецензируемые статьи** и принести PDF.
Колонки таблицы извлечения: статья · ссылка в APA · проблема · метод / данные · метрики и результаты · ограничения · релевантность / пробел.`,
      },
      [
        q("Which sources belong to Tier 1 of the literature hierarchy?", "Peer-reviewed journal articles and conference proceedings", ["Official technical whitepapers and verified documentation", "Popular Medium posts written by experienced engineers", "YouTube tutorials published by university channels"], "Tier 1 is peer-reviewed work indexed in IEEE Xplore, ACM DL, Springer or Scopus.", "Уровень 1 — рецензируемые работы из IEEE Xplore, ACM DL, Springer, Scopus."),
        q("A Medium post belongs to which tier?", "Tier 3", ["Tier 1", "Tier 2", "It has no tier at all"], "Blog posts are Tier 3 and should be avoided in literature reviews.", "Посты в блогах — уровень 3, в обзоре литературы их избегают."),
        q("Where does a W3C standard or the original Ethereum whitepaper sit?", "Tier 2 — moderate credibility", ["Tier 1 — peer-reviewed research", "Tier 3 — avoid in reviews", "Outside the hierarchy"], "Official technical whitepapers and verified documentation are Tier 2.", "Официальные whitepaper и проверенная документация — уровень 2."),
        q("Which tool builds a visual map of related studies from one core paper?", "Litmaps or Connected Papers", ["Google Scholar", "IEEE Xplore", "Mendeley Cite"], "These visual discovery tools start from a single paper.", "Эти инструменты визуального поиска строят карту от одной статьи."),
        q("Which pair is called the gold standard for computer science research papers?", "IEEE Xplore and ACM Digital Library", ["Wikipedia and Stack Overflow", "TechCrunch and Medium", "Reddit and GitHub READMEs"], "They index computing conference and journal papers.", "Они индексируют статьи конференций и журналов по компьютерным наукам."),
        q("What is Google Scholar best used for at the start of a project?", "Initial keyword discovery in a wide open index", ["Checking whether a paper has been retracted or corrected", "Storing and annotating your own PDF library", "Drawing a citation map of connected papers"], "It is the widest open index of academic papers.", "Это самый широкий открытый индекс научных статей."),
        q("Which sentence sounds like academic Text B rather than hype?", "GC pauses fell by 11.2% at the cost of 4% more idle RAM", ["Our revolutionary engine completely disrupts backend development", "This framework is ten times faster than anything else available", "Everyone agrees that it is the best tool on the market today"], "Academic writing reports exact metrics and trade-offs.", "Академический текст сообщает точные метрики и компромиссы."),
        q("What makes Text B credible?", "Precise conditions, exact metrics and an honest trade-off", ["Confident language together with a strong call to action", "A larger performance number than any competitor reports", "Short memorable sentences that are easy to quote in a review"], "It states the test conditions, the measured change and the cost.", "В нём указаны условия теста, измеренное изменение и его цена."),
        q("How many peer-reviewed papers must be found and downloaded as homework?", "3", ["1", "5", "10"], "The homework is one narrowed topic plus three peer-reviewed papers.", "Домашнее задание — одна суженная тема и три рецензируемые статьи."),
        q("When is Assignment 1 (Literature Review) due and how much is it worth?", "Week 4, 20 points", ["Week 2, 10 points", "Week 6, 30 points", "Week 10, 40 points"], "It is due in Week 4 and gives 20 points of the first attestation.", "Сдаётся на 4-й неделе и даёт 20 баллов первой аттестации."),
        q("Which column is part of the extraction table?", "Limitations", ["Journal subscription price", "Number of pages", "Author's nationality"], "Columns: article, APA reference, problem, method/data, metrics and results, limitations, relevance/gap.", "Колонки: статья, ссылка APA, проблема, метод/данные, метрики и результаты, ограничения, релевантность/пробел."),
      ],
    ),
  ],
};
