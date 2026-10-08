import { part, qx, tfx, type Lecture } from "../types";

/*
 * Лекция 1 RMT: неделя 1 (Course introduction; Taking a leap into the research world)
 * и неделя 2 силлабуса (Research setups; The right mindset for researchers).
 * Источник — «lesson 1» (Practice Session 1, три занятия) + силлабус; примеры
 * SafeDrive — под Practice Quiz 3 (research vs development output, слишком
 * широкий вопрос, утверждение без доказательств).
 */

const p1 = part(
  "rm-l1-p1",
  { en: "What research is — and what it is not", ru: "Что такое исследование — и что им не является" },
  {
    en: `## The myth and the reality
**The myth:** research means reading Wikipedia, checking TechCrunch, scrolling Reddit or asking ChatGPT for a quick tech fact. That is **looking things up**: it collects what someone else already said and cannot tell you whether it is true.
**The reality (Zina O'Leary, the course textbook):** research is a **systematic, creative and critical process** used to:
- find **verifiable** answers to complex, **unsolved** questions;
- solve real-world, **localized** computing and software problems;
- build new, **credible and reproducible** knowledge.
| Word | What it means | IT example |
|---|---|---|
| Systematic | planned, ordered, documented steps — not random browsing | the same load test is run on every option |
| Creative | designing a question and a way to answer it; there is no ready recipe | inventing a way to measure an LLM's "hallucination rate" |
| Critical | questioning sources, assumptions and your own results | asking on what hardware a benchmark graph was produced |
| Verifiable | anyone can check the answer against the evidence | raw latency logs are published with the paper |
| Localized | tied to a concrete context: these users, this system, this city | your legacy database under your traffic peaks |
| Reproducible | another team following your documented steps gets the same result | scripts, versions and settings are all reported |
> Research in one line: a **question**, answered by a **method**, with **evidence**, leading to a **conclusion** that others can check. Drop any of the four and you get a search, an opinion or a product — not research.
## Case: guessing vs researching
A team must choose a programming language for a heavy, high-traffic microservice. The lead developer says: "Let's use Rust — it's trendy, and I read a Medium post saying it's incredibly fast."
- **What is wrong:** the decision rests on **intuition, fashion and a low-credibility blog post**. Nobody knows how Rust will work with *their* legacy database under *their* sudden traffic spikes.
- **The research approach:** a **controlled experiment (benchmarking)**. Simulate a load of **100,000 requests/sec** on both a Java and a Rust microservice, collect empirical data on **CPU utilization, RAM overhead and latency (ms)**, and make an **evidence-based decision**.
- **Why "controlled":** both services get the same load, the same hardware and the same database, so the language is the only thing that differs. Otherwise a difference could be caused by the setup, not by the language.
> The result may favour Java. Research is worth doing precisely because the answer is not known in advance.
## Research vs development
Both happen in IT projects, but they produce different things.
| | Development | Research |
|---|---|---|
| Goal | build something that works | find out something that is not yet known |
| Starts with | requirements | a question |
| Output | **development output** — an artifact: app, prototype, feature, API, dashboard | **research output** — knowledge: findings, group comparisons, analysed data, a review of studies |
| Success means | it runs and meets the requirements | the answer is backed by evidence and a sound method, even if it is "no effect" |
| SafeDrive example | a working prototype of the driving-safety app | comparing speeding events of drivers with and without the app |
@diagram rm1-research-vs-dev
**Sorting SafeDrive outputs** (SafeDrive is an app that warns drivers about speeding and harsh braking):
- Building and releasing the app prototype → **development output**.
- Adding a dark mode or a new dashboard screen → **development output**.
- Comparing two groups of drivers (with alerts / without alerts) over 8 weeks → **research output**.
- Analysing 6 months of trip logs to see whether speeding drops after an alert → **research output**.
- A **systematic literature review** of published studies on driver-feedback apps → **research output**: it follows a protocol and produces new synthesized knowledge, it is not "just reading".
> Exam trap: a prototype — however innovative — is a **development** output. It becomes part of research only when it is used as an instrument to answer a question; then the **findings** of that evaluation are the research output, not the app itself.
## Research is a process
Research is not one action but a sequence of steps. The course (built on O'Leary's chapters) follows the same path week by week.
| Step | Course week |
|---|---|
| Choose an area and narrow it to a topic and a research question | 1–2 |
| Plan credible and ethical research; draft a proposal | 3 |
| Review the literature; design a research plan | 4 |
| Choose a methodology: quantitative, qualitative or mixed | 5–6 |
| Select samples, informants and cases | 7 |
| Collect primary or secondary data | 8 |
| Analyse quantitative and qualitative data | 9 |
| Write up and present the findings | 10 |
The syllabus frames research both as a **challenge** (it needs resources, method and discipline) and as an **opportunity for situation improvement**: a well-answered question can change a real system, team or policy.
?? A startup gives SafeDrive to 50 friends and says the app "works great". Is this a research output?
?= No. Releasing the app is development, and "works great" is an impression. It becomes research if they ask a clear question, compare with a baseline or a control group, measure a defined outcome (e.g. speeding events per 100 km) and analyse the data.
?? Why is "I asked ChatGPT and it said Rust is faster" not research?
?= There is no systematic method, no evidence about their own system, and the answer cannot be verified or reproduced — it may even be a hallucination. It is looking things up, which is exactly the myth.`,
    ru: `## Миф и реальность
**Миф:** исследование — это почитать Википедию, заглянуть в TechCrunch, полистать Reddit или спросить у ChatGPT быстрый технический факт. Это **поиск готового (looking things up)**: он собирает то, что кто-то уже сказал, и не может показать, правда ли это.
**Реальность (Зина О'Лири, учебник курса):** исследование (research) — это **систематический, творческий и критический процесс (systematic, creative and critical process)**, который нужен, чтобы:
- находить **проверяемые (verifiable)** ответы на сложные **нерешённые** вопросы;
- решать реальные **локальные (localized)** задачи в вычислениях и разработке ПО;
- создавать новое **достоверное и воспроизводимое (credible and reproducible)** знание.
| Слово | Что означает | Пример из IT |
|---|---|---|
| Systematic (систематический) | спланированные, упорядоченные, задокументированные шаги — а не случайный сёрфинг | один и тот же нагрузочный тест запускают для каждого варианта |
| Creative (творческий) | придумать вопрос и способ на него ответить; готового рецепта нет | придумать, как измерить «долю галлюцинаций» LLM |
| Critical (критический) | сомневаться в источниках, допущениях и собственных результатах | спросить, на каком железе построен график бенчмарка |
| Verifiable (проверяемый) | любой может сверить ответ с данными | сырые логи задержек опубликованы вместе со статьёй |
| Localized (локальный) | привязан к конкретному контексту: эти пользователи, эта система, этот город | ваша старая база данных при ваших пиках трафика |
| Reproducible (воспроизводимый) | другая команда по описанным шагам получает тот же результат | указаны скрипты, версии и настройки |
> Исследование одной строкой: **вопрос**, на который отвечает **метод**, с **данными (evidence)**, ведущими к **выводу**, который могут проверить другие. Уберите любой из четырёх элементов — и получится поиск, мнение или продукт, но не исследование.
## Кейс: гадать или исследовать
Команде нужно выбрать язык программирования для тяжёлого высоконагруженного микросервиса. Тимлид говорит: «Берём Rust — он в тренде, и я читал пост на Medium, что он невероятно быстрый».
- **Что не так:** решение опирается на **интуицию, моду и пост в блоге низкой достоверности**. Никто не знает, как Rust поведёт себя с *их* старой базой данных при *их* внезапных всплесках трафика.
- **Исследовательский подход:** **контролируемый эксперимент (benchmarking)**. Сымитировать нагрузку **100 000 запросов/с** на микросервисы на Java и на Rust, собрать эмпирические данные о **загрузке CPU, расходе RAM и задержке (мс)** и принять **решение на основе данных (evidence-based decision)**.
- **Почему «контролируемый»:** оба сервиса получают одинаковую нагрузку, одинаковое железо и одну и ту же базу, так что различается только язык. Иначе разница могла бы объясняться окружением, а не языком.
> Результат может оказаться в пользу Java. Исследование и нужно именно потому, что ответ заранее неизвестен.
## Исследование и разработка (research vs development)
И то и другое бывает в IT-проектах, но результат у них разный.
| | Разработка (development) | Исследование (research) |
|---|---|---|
| Цель | создать то, что работает | узнать то, что ещё неизвестно |
| Начинается с | требований | вопроса |
| Результат | **development output** — артефакт: приложение, прототип, функция, API, дашборд | **research output** — знание: выводы, сравнение групп, проанализированные данные, обзор исследований |
| Успех — это | работает и отвечает требованиям | ответ подкреплён данными и надёжным методом, даже если это «эффекта нет» |
| Пример SafeDrive | работающий прототип приложения для безопасного вождения | сравнение превышений скорости у водителей с приложением и без него |
@diagram rm1-research-vs-dev
**Раскладываем результаты SafeDrive** (SafeDrive — приложение, которое предупреждает водителя о превышении скорости и резком торможении):
- Создать и выпустить прототип приложения → **development output**.
- Добавить тёмную тему или новый экран-дашборд → **development output**.
- Сравнить две группы водителей (с оповещениями и без) за 8 недель → **research output**.
- Проанализировать логи поездок за 6 месяцев: снижается ли скорость после оповещения → **research output**.
- **Систематический обзор литературы (systematic literature review)** опубликованных исследований о приложениях с обратной связью для водителей → **research output**: он идёт по протоколу и даёт новое обобщённое знание, это не «просто чтение».
> Ловушка экзамена: прототип — даже самый новаторский — это результат **разработки**. Частью исследования он становится, только когда служит инструментом для ответа на вопрос; тогда research output — это **выводы** такой проверки, а не само приложение.
## Исследование — это процесс
Исследование — не одно действие, а последовательность шагов. Курс (построенный по главам O'Leary) идёт тем же путём неделя за неделей.
| Шаг | Неделя курса |
|---|---|
| Выбрать область и сузить её до темы и исследовательского вопроса | 1–2 |
| Спланировать достоверное и этичное исследование; набросать proposal | 3 |
| Сделать обзор литературы; составить план исследования | 4 |
| Выбрать методологию: количественную, качественную или смешанную | 5–6 |
| Отобрать выборку, информантов и кейсы | 7 |
| Собрать первичные или вторичные данные | 8 |
| Проанализировать количественные и качественные данные | 9 |
| Написать и представить результаты | 10 |
Силлабус описывает исследование и как **вызов (challenge)** — нужны ресурсы, метод и дисциплина, — и как **возможность улучшить ситуацию (opportunity for situation improvement)**: хорошо отвеченный вопрос может изменить реальную систему, команду или правила.
?? Стартап раздал SafeDrive 50 друзьям и говорит, что приложение «отлично работает». Это research output?
?= Нет. Выпуск приложения — это разработка, а «отлично работает» — впечатление. Исследованием это станет, если задать чёткий вопрос, сравнить с исходным уровнем (baseline) или контрольной группой, измерить определённый результат (например, превышения скорости на 100 км) и проанализировать данные.
?? Почему «спросил у ChatGPT, и он сказал, что Rust быстрее» — не исследование?
?= Нет систематического метода, нет данных о собственной системе, а ответ нельзя проверить или воспроизвести — он может оказаться даже галлюцинацией. Это поиск готового, то есть тот самый миф.`,
  },
  [
    qx("According to O'Leary, as quoted in the lecture, what is research?", "A systematic, creative and critical process", [
      ["A quick, reliable and thorough search for facts", "Searching for facts that already exist is exactly the myth the lecture rejects; research produces new, verifiable knowledge.", "Поиск уже существующих фактов — это как раз миф, который отвергает лекция; исследование создаёт новое проверяемое знание."],
      ["A neutral and complete summary of expert opinion", "Summarising what experts think adds no method and no evidence of your own.", "Пересказ мнений экспертов не добавляет ни метода, ни собственных данных."],
      ["A creative and fast way to confirm an idea", "Research is not there to confirm an idea you already hold; it must stay critical and open to the data.", "Исследование нужно не для того, чтобы подтвердить уже имеющуюся идею: оно остаётся критичным и открытым данным."],
    ], "O'Leary: research is a systematic, creative and critical process used to find verifiable answers, solve localized problems and build credible, reproducible knowledge.", "О'Лири: исследование — систематический, творческий и критический процесс, чтобы находить проверяемые ответы, решать локальные задачи и создавать достоверное воспроизводимое знание."),
    qx("A student says: \"I researched it — I read three Reddit threads and asked ChatGPT.\" Why is this not research in the course's sense?", "No method, and the answer cannot be verified", [
      ["Reddit and ChatGPT are banned by the course rules", "Nothing is banned here; the activity simply has no systematic method and no checkable evidence.", "Ничего не запрещено: просто у такого занятия нет систематического метода и проверяемых данных."],
      ["Three sources are too few; ten would be enough", "More look-ups are still look-ups — the number of sources does not create a method.", "Больше поисков — всё равно поиски: число источников не создаёт метода."],
      ["Research may use only printed books and journals", "Online sources are fine when credible; the problem is the missing method, not the medium.", "Онлайн-источники допустимы, если достоверны; проблема в отсутствии метода, а не в носителе."],
    ], "Looking things up collects what others have said. Research needs a systematic method and evidence that others can check — that is the lecture's myth vs reality.", "Поиск готового собирает то, что сказали другие. Исследованию нужны систематический метод и данные, которые могут проверить другие, — в этом и разница «миф и реальность»."),
    qx("The lead developer wants Rust \"because it's trendy and a Medium post says it's fast\". What is the main weakness of this decision?", "It rests on a trend and one unverified blog", [
      ["Rust is known to be slower than Java under load", "The lecture claims nothing of the kind; the point is that nobody measured it for this system.", "Лекция ничего такого не утверждает; суть в том, что для этой системы никто ничего не измерял."],
      ["Medium posts are always factually wrong", "Not always wrong — but unverified, low-credibility (Tier 3) and not about their legacy database.", "Не всегда ошибочны — но не проверены, низкой достоверности (Tier 3) и не про их старую базу данных."],
      ["Trendy languages make hiring developers harder", "Hiring may matter, but the case is about deciding without evidence.", "Найм может быть важен, но кейс — о решении без данных."],
    ], "Nobody knows how Rust will behave with their legacy database under sudden traffic spikes; the choice is intuition, not an evidence-based decision.", "Никто не знает, как Rust поведёт себя с их старой базой при внезапных всплесках трафика; выбор основан на интуиции, а не на данных."),
    qx("What makes the Java-vs-Rust benchmark a controlled experiment?", "Same load, hardware and database for both services", [
      ["The team decides in advance which result to publish", "Choosing what to publish is selective reporting, not experimental control.", "Выбирать, что публиковать, — это выборочная отчётность, а не контроль эксперимента."],
      ["It is run by the most senior engineer on the team", "Seniority controls nothing; equal conditions do.", "Старшинство ничего не контролирует; контролируют одинаковые условия."],
      ["It records several metrics rather than only latency", "Several metrics are useful, but control means that only the language differs.", "Несколько метрик полезны, но контроль означает, что различается только язык."],
    ], "Control = everything is held equal except the compared factor, so differences in CPU, RAM and latency can be attributed to the language, not to the setup.", "Контроль — всё одинаково, кроме сравниваемого фактора; тогда разницу в CPU, RAM и задержке можно приписать языку, а не окружению."),
    qx("Which data would give the team an evidence-based answer about performance under 100,000 requests/sec?", "CPU use, RAM overhead and latency measured under that load", [
      ["GitHub stars, download counts and release frequency", "These measure popularity, not how the service behaves under load.", "Это показатели популярности, а не поведения сервиса под нагрузкой."],
      ["Lines of code, build time and binary size of each service", "These are development properties, not runtime behaviour under traffic.", "Это свойства разработки, а не поведения во время работы под трафиком."],
      ["Opinions of five senior developers from other companies", "Opinions are not empirical data about their system.", "Мнения — не эмпирические данные об их системе."],
    ], "The lecture's benchmark collects empirical data on CPU utilization, RAM overhead and latency (ms) under a simulated load of 100,000 requests/sec.", "Бенчмарк из лекции собирает эмпирические данные о загрузке CPU, расходе RAM и задержке (мс) при имитации 100 000 запросов в секунду."),
    qx("SafeDrive's team builds a working prototype of its driving-safety app. What kind of output is this?", "A development output: a working artifact", [
      ["A research output: a new piece of knowledge", "A new product is not new knowledge — nothing was asked, measured or analysed.", "Новый продукт — не новое знание: ничего не спрашивали, не измеряли и не анализировали."],
      ["A research output: a validated finding", "Nothing has been validated yet; validation would require a study of the app's effect.", "Ничего ещё не проверено; для проверки нужно исследование эффекта приложения."],
      ["A hypothesis: a prediction about accidents", "A prototype is an artifact, not a statement; a hypothesis is a testable prediction.", "Прототип — это артефакт, а не утверждение; гипотеза — проверяемый прогноз."],
    ], "Development builds artifacts (apps, prototypes, features); research produces knowledge. The SafeDrive quiz treats the app prototype as a development output.", "Разработка создаёт артефакты (приложения, прототипы, функции), исследование — знание. В квизе SafeDrive прототип приложения — это development output."),
    qx("Which SafeDrive activity produces a research output?", "Comparing speeding events of drivers with and without alerts", [
      ["Adding a night mode and a redesigned trip-history screen", "New UI features are development output.", "Новые функции интерфейса — это development output."],
      ["Releasing version 2.0 of the app on the App Store and Google Play", "A release is a development milestone, not new knowledge.", "Релиз — веха разработки, а не новое знание."],
      ["Writing a landing page that lists the app's main safety benefits", "Marketing text makes claims; it does not test them.", "Маркетинговый текст делает заявления, а не проверяет их."],
    ], "Comparing groups on a measured outcome answers a question with evidence — exactly what a research output is.", "Сравнение групп по измеренному показателю отвечает на вопрос с опорой на данные — это и есть research output."),
    qx("A team performs a systematic literature review of 40 published studies on driver-feedback apps. How is this classified?", "Research output: a protocol-based synthesis of evidence", [
      ["Not research: it only re-reads what others already wrote", "A systematic review follows an explicit protocol (search, screening, synthesis) and produces new, synthesized knowledge.", "Систематический обзор идёт по явному протоколу (поиск, отбор, синтез) и даёт новое обобщённое знание."],
      ["Development output: it is the first step of building the app", "It may inform the app, but what it produces is knowledge, not an artifact.", "Он может помочь приложению, но производит знание, а не артефакт."],
      ["An unsupported claim, since it collects no new primary data", "A claim lacks evidence; a review is built entirely from evidence. Secondary data is legitimate.", "У утверждения нет доказательств, а обзор целиком построен на них. Вторичные данные — законный источник."],
    ], "The SafeDrive quiz lists the systematic review as a research output: it searches, screens and synthesizes studies by a documented, reproducible protocol.", "В квизе SafeDrive систематический обзор — research output: он ищет, отбирает и обобщает исследования по задокументированному воспроизводимому протоколу."),
    tfx("A prototype becomes a research output as soon as it contains an innovative feature.", false,
      "Innovation makes a better product, not knowledge. The prototype stays a development output; only the findings of evaluating it — with a question, method and data — are research output.",
      "Новизна делает продукт лучше, но не создаёт знания. Прототип остаётся development output; research output — только выводы его проверки с вопросом, методом и данными.",
      "\"True\" confuses a novel artifact with new knowledge: nothing has been asked or measured yet.",
      "«Верно» путает новый артефакт с новым знанием: пока ничего не спрошено и не измерено."),
    qx("When does building an app become part of a research project?", "When the app is used as an instrument to answer a question", [
      ["When the app gains enough active users to attract investors", "Popularity is not evidence; with no question and no analysis there is no research.", "Популярность — не доказательство; без вопроса и анализа исследования нет."],
      ["When the full source code is published openly on GitHub", "Open code helps reproducibility, but the code itself is still a development output.", "Открытый код помогает воспроизводимости, но сам код — всё равно development output."],
      ["When the app relies on AI or another advanced technology", "The technology level is irrelevant; the question, method and evidence are what count.", "Уровень технологии неважен; важны вопрос, метод и данные."],
    ], "One project can contain both: the app is built (development) and then evaluated systematically; the findings of that evaluation are the research output.", "В одном проекте может быть и то и другое: приложение создают (разработка), затем систематически проверяют; выводы этой проверки — research output."),
    qx("What does \"verifiable\" mean in the definition of research?", "Others can check the answer against the evidence", [
      ["A well-known expert has approved the answer publicly", "Authority is not verification; evidence that others can inspect is.", "Авторитет — не проверка; проверка — это данные, которые могут изучить другие."],
      ["The answer is repeated by several popular websites", "Repetition is not verification — many sites may copy one unchecked claim.", "Повторение — не проверка: многие сайты могут копировать одно непроверенное утверждение."],
      ["The answer can never turn out to be wrong later", "The opposite: a verifiable answer is exposed to checking and could fail it.", "Наоборот: проверяемый ответ открыт для проверки и может её не пройти."],
    ], "Verifiable = anyone can compare the answer with the evidence (data, logs, documented method) and see whether it holds.", "Проверяемый — любой может сверить ответ с данными (измерения, логи, описанный метод) и убедиться, держится ли он."),
    qx("The lecture says research solves \"localized\" problems. Which project fits that idea best?", "Latency of our own legacy database under our traffic peaks", [
      ["A general essay on the history of databases around the world", "A broad overview of a field is not a concrete problem in a specific context.", "Широкий обзор области — не конкретная задача в определённом контексте."],
      ["Proving that Rust is the best language for every single situation", "A universal claim ignores context, and \"proving the best\" is a claim, not a problem.", "Универсальное утверждение игнорирует контекст, а «доказать, что лучший» — это заявление, а не задача."],
      ["Ranking the ten most popular databases by their GitHub stars", "A popularity ranking does not address a real problem in a specific system.", "Рейтинг популярности не решает реальную задачу конкретной системы."],
    ], "Localized = tied to a concrete context: these users, this system, this city. The case's legacy database under sudden spikes is exactly that.", "Локальная — привязанная к конкретному контексту: эти пользователи, эта система, этот город. Старая база из кейса при внезапных всплесках — именно такая задача."),
    qx("Which sequence shows the core logic of research?", "Question → method → evidence → conclusion", [
      ["Conclusion → evidence → method → question", "Starting from the conclusion and then looking for support is confirmation, not research.", "Начинать с вывода и потом искать подтверждения — это подгонка, а не исследование."],
      ["Method → question → conclusion → evidence", "A method is chosen to fit a question, and a conclusion must follow the evidence, not precede it.", "Метод выбирают под вопрос, а вывод следует из данных, а не опережает их."],
      ["Evidence → conclusion → question → method", "Data collected without a question gives no direction for analysis.", "Данные, собранные без вопроса, не дают направления для анализа."],
    ], "A question comes first, a method is chosen to answer it, evidence is collected, and the conclusion follows from the evidence.", "Сначала вопрос, затем метод для ответа на него, потом данные, и вывод следует из данных."),
    qx("Which statement about research and development is accurate?", "One project can contain both: build an app, then test its effect", [
      ["They are the same thing, since any coding project is research", "Coding builds artifacts; research produces knowledge.", "Программирование создаёт артефакты; исследование создаёт знание."],
      ["Research never involves building any software or prototype", "Researchers often build prototypes or tools as instruments for a study.", "Исследователи часто создают прототипы или инструменты для своего исследования."],
      ["Development is simply the later, more advanced stage of research", "Development is a different activity with a different output, not a stage of research.", "Разработка — другая деятельность с другим результатом, а не этап исследования."],
    ], "Development and research differ in goal and output, but they often live in one project: the prototype is development, the evaluation findings are research.", "Разработка и исследование различаются целью и результатом, но часто живут в одном проекте: прототип — разработка, выводы проверки — исследование."),
    qx("Which of these is NOT one of the three purposes of research named in the lecture?", "To confirm a decision the team has already made", [
      ["To find verifiable answers to complex, unsolved questions", "This is purpose 1 in the lecture.", "Это первая цель из лекции."],
      ["To solve real-world, localized computing problems", "This is purpose 2 in the lecture.", "Это вторая цель из лекции."],
      ["To build new, credible and reproducible knowledge", "This is purpose 3 in the lecture.", "Это третья цель из лекции."],
    ], "Research is not a tool for justifying a decision already taken — that is confirmation bias. The three purposes: verifiable answers, localized problems, credible and reproducible knowledge.", "Исследование — не способ оправдать уже принятое решение: это предвзятость подтверждения. Три цели: проверяемые ответы, локальные задачи, достоверное и воспроизводимое знание."),
    qx("What does \"reproducible\" knowledge require from the researcher?", "Steps documented so another team can repeat the result", [
      ["A result the same team managed to get once on a good day", "One lucky run by the same team is not reproduction.", "Один удачный запуск той же командой — не воспроизведение."],
      ["A result confirmed by asking several AI assistants", "Agreement of chatbots is not reproduction; independently repeating the method is.", "Согласие чат-ботов — не воспроизведение; воспроизведение — независимый повтор метода."],
      ["Private scripts, so that nobody else can copy the work", "Hiding the method makes reproduction impossible.", "Скрытый метод делает воспроизведение невозможным."],
    ], "Reproducible = another team following your documented steps (versions, settings, data, scripts) obtains the same result.", "Воспроизводимый — другая команда по вашим описанным шагам (версии, настройки, данные, скрипты) получает тот же результат."),
    qx("The syllabus calls research an \"opportunity for situation improvement\". What does that mean?", "A well-answered question can change a real system or practice", [
      ["Research is mainly a way for students to raise their grades", "Grades are a course matter; the phrase is about improving real situations.", "Оценки — вопрос курса; фраза — об улучшении реальных ситуаций."],
      ["Research should always end with a new commercial product", "A product is development or commercialization; research output is knowledge that can inform change.", "Продукт — это разработка или коммерция; research output — знание, на основе которого можно что-то менять."],
      ["Research counts only when it solves the whole problem at once", "Partial or negative answers can still guide improvement.", "Частичные или отрицательные ответы тоже помогают улучшениям."],
    ], "Research is both a challenge (resources, method, discipline) and an opportunity: credible answers can improve a real system, team or policy.", "Исследование — одновременно вызов (ресурсы, метод, дисциплина) и возможность: достоверные ответы могут улучшить реальную систему, команду или правила."),
    qx("Which activity shows the creative side of research?", "Designing a new way to measure an LLM's hallucination rate", [
      ["Repeating a published benchmark exactly as the paper describes", "Exact repetition is reproduction — valuable rigor, but not the creative design of a study.", "Точный повтор — это воспроизведение: ценная строгость, но не творческое построение исследования."],
      ["Copying the conclusion of a highly cited paper word for word", "Copying without attribution is plagiarism, not creativity.", "Копирование без ссылки — плагиат, а не творчество."],
      ["Choosing the language that the team personally likes most", "Personal preference is intuition, not research design.", "Личное предпочтение — интуиция, а не дизайн исследования."],
    ], "There is no ready recipe for most real questions: inventing a way to make a vague idea (hallucination) measurable is the creative part of research.", "Для большинства реальных вопросов нет готового рецепта: придумать, как сделать измеримой расплывчатую идею (галлюцинации), — творческая часть исследования."),
    qx("An analyst studies 6 months of SafeDrive trip logs to see whether speeding drops after an alert. What does this produce?", "A research output: findings from analysing data", [
      ["A development output, because the logs come from the app", "Where data comes from does not decide the output; analysing it to answer a question produces knowledge.", "Происхождение данных не определяет тип результата: анализ ради ответа на вопрос даёт знание."],
      ["A claim, because the analyst already expects speeding to drop", "An expectation is fine (it is a hypothesis); the analysis tests it with data.", "Ожидание допустимо (это гипотеза); анализ проверяет его данными."],
      ["Nothing useful: existing logs are secondary data, not research", "Analysing existing (secondary) data is a legitimate research method.", "Анализ уже существующих (вторичных) данных — законный метод исследования."],
    ], "Data analysis that answers a question is one of the research outputs named in the SafeDrive quiz.", "Анализ данных, отвечающий на вопрос, — один из research output, названных в квизе SafeDrive."),
    tfx("A hunch may start a research question, but the final decision must rest on measured evidence.", true,
      "Intuition (\"Rust might be faster\") is a fine starting point for a question; the benchmark then decides with data.",
      "Интуиция («может, Rust быстрее») — нормальная отправная точка для вопроса; решает потом бенчмарк, по данным.",
      "\"False\" would mean either that hunches are forbidden or that they can replace evidence — the lecture says neither.",
      "«Неверно» означало бы, что догадки запрещены или что они могут заменить данные, — лекция не говорит ни того, ни другого."),
  ],
);

const p2 = part(
  "rm-l1-p2",
  { en: "The researcher's mindset: skepticism, rigor, open-mindedness", ru: "Мышление исследователя: скептицизм, строгость, открытость" },
  {
    en: `## Three habits of a researcher
To move from a **tech consumer** (who believes what is popular) to a **scientific researcher** (who believes what is shown), the lecture names three core habits.
| Habit | What you do | Anti-pattern |
|---|---|---|
| **Critical skepticism** | ask how a result was obtained before accepting it | trusting a benchmark graph because the repo has many stars |
| **Methodological rigor** | document every step so another engineer can reproduce the result | "it was faster on my laptop" — no versions, no settings |
| **Open-mindedness** | accept that data may prove your favourite tool or theory wrong | calling the test "broken" because your framework lost |
Mnemonic **S-R-O**: **S**keptical about other people's claims, **R**igorous about your own work, **O**pen to being wrong.
## Critical skepticism: interrogate every claim
Do not trust data or benchmark graphs in GitHub repositories blindly. Always examine:
- **Methodology** — what exactly was measured, how, with which versions and settings, how many repetitions, with or without warm-up?
- **Hardware constraints** — on what CPU, RAM, disk or cloud instance? A result from a gaming laptop may not hold on a 2-vCPU server.
- **Sample size** — one run, ten runs, a thousand users? One run or five friends is an **anecdote**, not evidence.
Also ask **who** produced the result (a vendor benchmarking its own product has an interest) and whether the comparison is **fair** (a tuned configuration against a default one is not).
> Skepticism is not cynicism. A cynic says "everything is fake"; a skeptic says "not accepted *yet* — show me how it was measured". A well-documented result should be accepted.
## Claim, problem, question, hypothesis
Exam questions often ask you to label a statement. The SafeDrive app is the standard example.
| Type | What it is | SafeDrive example |
|---|---|---|
| **Unsupported claim** | stated as fact with no evidence; often uses certainty words | "The app will definitely reduce accidents." |
| **Research problem** | what is happening, what is not known or solved, who is affected, why it matters | "Novice drivers often speed, and it is unknown whether real-time alerts change this behaviour." |
| **Research question** | a focused, answerable question that names what will be measured | "How do SafeDrive speed alerts affect speeding events per 100 km among novice drivers over 8 weeks?" |
| **Hypothesis** | a tentative, testable prediction that data could prove wrong | "Novice drivers who receive alerts will record fewer speeding events per 100 km than drivers without alerts." |
Why "The app will definitely reduce accidents" is **neither a problem nor a hypothesis**:
- it describes no gap in knowledge and no affected group — so it is not a problem;
- "definitely" announces the answer before any data, while a hypothesis is **tentative** and **falsifiable**: some possible result must be able to show it is wrong;
- it names no population, no comparison, no time frame and no measurable outcome — accidents of whom, counted how, compared with what?
@diagram rm1-claim-to-hypothesis
> Exam trap: a confident prediction is not a hypothesis. Words like *definitely, always, proves, revolutionary, 10x* signal a **claim**. A hypothesis says what is expected **and** could turn out false.
## Methodological rigor: make it reproducible
Document every step of development, testing and data collection **transparently**: software versions, configuration, hardware, dataset, scripts, number of runs, date. Then any other engineer can **reproduce** the result — and a result that nobody can reproduce is not credible knowledge.
**FinTech case.** A local bank wants to plug an LLM (like GPT-4) into its mobile app to give customers automated financial and investment advice. Pushing it straight to production without research risks:
- **technical** — hallucinated rates, wrong calculations, outdated data;
- **ethical** — misleading customers who trust the bank, unfair advice for some groups;
- **security** — prompt injection, customer data leaking through prompts or logs (plus legal liability for bad advice).
Rigor turns "the bot seems fine" into a number. Build a test set of questions whose answers are **verified by experts**, run the model, label every answer and compute:
= hallucination (error) rate = (wrong + fabricated answers) / total test questions
For example, 18 wrong or invented answers out of 300 questions = 6%. Report the model version, the prompt, the date and the test set so that others can repeat the measurement.
## Open-mindedness: be ready to be wrong
Be fully prepared for empirical data to prove your favourite framework, library or personal theory wrong.
- **Confirmation bias** — noticing and reading only the evidence that supports what you already believe.
- **Moving the goalposts** — changing the metric or the question after seeing the results so that your favourite wins.
- A careful **"no difference"** result is still knowledge: it saves others from making the same wrong bet.
?? Label "The app will definitely reduce accidents" and rewrite it as a hypothesis.
?= It is an unsupported claim. As a hypothesis: "Novice drivers who receive SafeDrive alerts for 8 weeks will record fewer speeding events per 100 km than a comparable group without alerts."
?? A README graph shows framework X is "5x faster", measured once on the author's laptop. What three things should a skeptic check?
?= The methodology (what was measured, which settings, how many repetitions), the hardware constraints (a laptop is not the production server) and the sample size (one run is an anecdote).`,
    ru: `## Три привычки исследователя
Чтобы из **потребителя технологий (tech consumer)**, который верит в популярное, стать **исследователем**, который верит в показанное, лекция называет три ключевые привычки.
| Привычка | Что делать | Антипример |
|---|---|---|
| **Critical skepticism (критический скептицизм)** | спрашивать, как получен результат, прежде чем его принять | верить графику бенчмарка, потому что у репозитория много звёзд |
| **Methodological rigor (методологическая строгость)** | документировать каждый шаг, чтобы другой инженер мог воспроизвести результат | «у меня на ноутбуке было быстрее» — без версий и настроек |
| **Open-mindedness (открытость)** | признавать, что данные могут опровергнуть любимый инструмент или теорию | объявить тест «сломанным», потому что любимый фреймворк проиграл |
Мнемоника **S-R-O**: **S**keptical — скептичность к чужим утверждениям, **R**igorous — строгость к своей работе, **O**pen — готовность оказаться неправым.
## Критический скептицизм: допрашивать каждое утверждение
Не стоит вслепую доверять данным и графикам бенчмарков в репозиториях GitHub. Всегда проверяется:
- **Методология** — что именно измеряли, как, на каких версиях и настройках, сколько повторов, был ли прогрев?
- **Ограничения железа** — какой CPU, RAM, диск или облачный инстанс? Результат с игрового ноутбука может не подтвердиться на сервере с 2 vCPU.
- **Размер выборки** — один запуск, десять, тысяча пользователей? Один запуск или пятеро друзей — это **случай (anecdote)**, а не доказательство.
Ещё стоит спросить, **кто** получил результат (вендор, тестирующий свой продукт, заинтересован), и **честно ли** сравнение (настроенная конфигурация против конфигурации по умолчанию — нечестно).
> Скептицизм — не цинизм. Циник говорит «всё фальшивка»; скептик говорит «пока *не* принято — покажите, как измеряли». Хорошо задокументированный результат стоит принять.
## Утверждение, проблема, вопрос, гипотеза
На экзамене часто просят определить тип высказывания. Стандартный пример — приложение SafeDrive.
| Тип | Что это | Пример SafeDrive |
|---|---|---|
| **Unsupported claim (утверждение без доказательств)** | подаётся как факт без доказательств; часто со словами уверенности | «Приложение точно снизит число аварий» (The app will definitely reduce accidents). |
| **Research problem (исследовательская проблема)** | что происходит, что неизвестно или не решено, кого это касается, почему это важно | «Начинающие водители часто превышают скорость, и неизвестно, меняют ли это оповещения в реальном времени». |
| **Research question (исследовательский вопрос)** | сфокусированный вопрос, на который можно ответить, с названным измеряемым показателем | «Как оповещения SafeDrive о скорости влияют на число превышений на 100 км у начинающих водителей за 8 недель?» |
| **Hypothesis (гипотеза)** | предположительный проверяемый прогноз, который данные могут опровергнуть | «У начинающих водителей с оповещениями будет меньше превышений на 100 км, чем у водителей без оповещений». |
Почему «Приложение точно снизит число аварий» — **ни проблема, ни гипотеза**:
- в нём нет пробела в знании и затронутой группы — значит, это не проблема;
- «точно» объявляет ответ до всяких данных, а гипотеза **предположительна** и **опровержима (falsifiable)**: какой-то возможный результат должен быть способен показать, что она неверна;
- нет ни группы, ни сравнения, ни срока, ни измеримого результата — аварии у кого, как их считать, по сравнению с чем?
@diagram rm1-claim-to-hypothesis
> Ловушка экзамена: уверенный прогноз — ещё не гипотеза. Слова вроде *definitely, always, proves, revolutionary, 10x* («точно», «всегда», «доказывает», «революционный», «в 10 раз») — признак **утверждения**. Гипотеза говорит, чего ожидают, **и** может оказаться ложной.
## Методологическая строгость: результат должен воспроизводиться
Каждый шаг разработки, тестирования и сбора данных документируется **прозрачно**: версии ПО, конфигурация, железо, датасет, скрипты, число запусков, дата. Тогда любой инженер сможет **воспроизвести** результат, а результат, который никто не может воспроизвести, — не достоверное знание.
**Кейс FinTech.** Местный банк хочет встроить LLM (вроде GPT-4) в мобильное приложение, чтобы давать клиентам автоматические финансовые и инвестиционные советы. Выкатить это сразу в прод без исследования — значит рискнуть:
- **технически** — выдуманные ставки, неверные расчёты, устаревшие данные;
- **этически** — ввести в заблуждение клиентов, которые доверяют банку, дать несправедливые советы отдельным группам;
- **в плане безопасности** — prompt injection, утечка данных клиентов через промпты или логи (плюс юридическая ответственность за плохой совет).
Строгость превращает «бот вроде нормальный» в число. Собирается тестовый набор вопросов с ответами, **проверенными экспертами**, модель прогоняется на нём, каждый ответ размечается, и считается:
= hallucination (error) rate = (wrong + fabricated answers) / total test questions
Например, 18 неверных или выдуманных ответов из 300 вопросов = 6%. Указываются версия модели, промпт, дата и тестовый набор, чтобы другие могли повторить измерение.
## Открытость: готовность ошибиться
Нужно быть полностью готовым к тому, что эмпирические данные опровергнут любимый фреймворк, библиотеку или личную теорию.
- **Предвзятость подтверждения (confirmation bias)** — замечать и читать только то, что подтверждает уже имеющееся мнение.
- **Перенос ворот (moving the goalposts)** — менять метрику или вопрос после результатов, чтобы победил любимец.
- Аккуратный результат **«разницы нет»** — тоже знание: он уберегает других от той же ошибочной ставки.
?? Какой тип у высказывания «Приложение точно снизит число аварий» и как переписать его в гипотезу?
?= Это утверждение без доказательств (unsupported claim). Гипотеза: «Начинающие водители, которые 8 недель получают оповещения SafeDrive, зафиксируют меньше превышений скорости на 100 км, чем сопоставимая группа без оповещений».
?? На графике в README фреймворк X «в 5 раз быстрее», измерено один раз на ноутбуке автора. Какие три вещи проверит скептик?
?= Методологию (что измеряли, какие настройки, сколько повторов), ограничения железа (ноутбук — не продакшен-сервер) и размер выборки (один запуск — это случай).`,
  },
  [
    qx("Before adopting a library, a team checks how its published benchmark was run, on what hardware and with how many runs. Which habit is this?", "Critical skepticism", [
      ["Methodological rigor", "Rigor is about documenting your own work so others can reproduce it; here the team evaluates someone else's claim.", "Строгость — это документировать собственную работу для воспроизведения; здесь же команда оценивает чужое утверждение."],
      ["Open-mindedness", "Open-mindedness is readiness to be proven wrong by data, not checking other people's methods.", "Открытость — готовность признать, что данные опровергли вас, а не проверка чужих методов."],
      ["Confirmation bias", "Confirmation bias is seeking only supporting evidence — the opposite of careful checking.", "Предвзятость подтверждения — поиск только подтверждающих данных, противоположность тщательной проверке."],
    ], "Critical skepticism: do not trust benchmark graphs blindly — examine the methodology, the hardware constraints and the sample size.", "Критический скептицизм: не верить графикам бенчмарков вслепую — проверять методологию, ограничения железа и размер выборки."),
    qx("An engineer records library versions, server type, dataset, scripts and the number of runs for every test. Which habit is this?", "Methodological rigor", [
      ["Critical skepticism", "Skepticism targets other people's claims; this is about making one's own work reproducible.", "Скептицизм направлен на чужие утверждения; здесь речь о воспроизводимости собственной работы."],
      ["Open-mindedness", "Open-mindedness concerns accepting unwelcome results, not documentation.", "Открытость — про принятие неудобных результатов, а не про документацию."],
      ["Systematic skepticism", "There is no such habit in the lecture; documenting your own steps is rigor.", "Такой привычки в лекции нет; документирование своих шагов — это строгость."],
    ], "Methodological rigor: document every step of development, testing and data collection transparently so that any other engineer can reproduce the result.", "Методологическая строгость: прозрачно документировать каждый шаг разработки, тестирования и сбора данных, чтобы любой инженер мог воспроизвести результат."),
    qx("Benchmarks show the team's favourite framework is slower, and the lead says: \"The test must be wrong — our framework is the best.\" Which habit is missing?", "Open-mindedness", [
      ["Methodological rigor", "The test may be perfectly rigorous; the problem is refusing to accept its result.", "Тест может быть вполне строгим; проблема — в отказе принять его результат."],
      ["Critical skepticism", "Skepticism would need a methodological reason to doubt the test; \"we lost\" is not one.", "Скептицизму нужна методологическая причина сомневаться в тесте; «мы проиграли» — не причина."],
      ["Creative thinking", "Creativity is about designing studies, not about accepting their results.", "Творчество — про построение исследований, а не про принятие их результатов."],
    ], "Open-mindedness: be fully prepared for empirical data to prove your favourite framework, library or theory wrong.", "Открытость: быть готовым к тому, что эмпирические данные опровергнут любимый фреймворк, библиотеку или теорию."),
    qx("In the SafeDrive case, how should \"The app will definitely reduce accidents\" be classified?", "An unsupported claim", [
      ["A research problem", "A problem describes what is unknown and who is affected; this statement announces the answer instead.", "Проблема описывает, что неизвестно и кого это касается; а это высказывание сразу объявляет ответ."],
      ["A testable hypothesis", "A hypothesis is tentative and names measurable variables; \"definitely\" and the missing measure make it a claim.", "Гипотеза предположительна и называет измеримые переменные; «точно» и отсутствие показателя делают это утверждением."],
      ["A research question", "It is not a question at all; it asserts a conclusion.", "Это вообще не вопрос — это готовый вывод."],
    ], "It asserts a result with certainty and without evidence, names no comparison and no measurable outcome — an unsupported claim, not a problem or a hypothesis.", "Это уверенное заявление о результате без доказательств, без сравнения и без измеримого показателя — утверждение без доказательств, а не проблема и не гипотеза."),
    qx("Which statement is a testable hypothesis for SafeDrive?", "Alerted drivers will log fewer speeding events per 100 km than non-alerted ones", [
      ["SafeDrive is the most effective road-safety app on the market in Kazakhstan today", "A superlative claim: no comparison group, no measure, no time frame.", "Превосходная степень без группы сравнения, показателя и срока — это утверждение."],
      ["Road safety is a serious problem that modern technology should help cities to solve", "A general statement of concern, not a prediction that data could test.", "Общее выражение озабоченности, а не прогноз, который можно проверить данными."],
      ["SafeDrive will certainly make every driver in the city much safer within a year", "Certainty plus a vague outcome (\"much safer\") makes it a claim, not a hypothesis.", "Уверенность плюс расплывчатый результат («намного безопаснее») — это утверждение, а не гипотеза."],
    ], "A hypothesis is a tentative prediction with a comparison and a measurable outcome; data could show it is wrong.", "Гипотеза — предположительный прогноз со сравнением и измеримым результатом; данные могут показать, что он неверен."),
    qx("What is the main reason \"The app will definitely reduce accidents\" is not a hypothesis?", "It asserts certainty and names no measurable comparison", [
      ["It is written about the future instead of the past", "Hypotheses usually are predictions about the future; tense is not the issue.", "Гипотезы обычно и есть прогнозы на будущее; время глагола ни при чём."],
      ["It mentions accidents, which researchers cannot study", "Accidents can be studied with proper data; the problems are certainty and vagueness.", "Аварии можно изучать при нужных данных; проблема в уверенности и расплывчатости."],
      ["It is too short; hypotheses need at least two sentences", "Length is not a criterion — testability is.", "Длина не критерий — критерий проверяемость."],
    ], "A hypothesis is tentative and falsifiable and names measurable variables (e.g. speeding events per 100 km, with vs without alerts). \"Definitely\" closes the question before any data.", "Гипотеза предположительна, опровержима и называет измеримые переменные (например, превышения на 100 км с оповещениями и без). «Точно» закрывает вопрос до всяких данных."),
    qx("Which statement is a research problem rather than a claim?", "Novice drivers often speed; whether app alerts change this is unknown", [
      ["Our app is clearly the best solution to dangerous driving in Astana", "Self-promotion: it asserts an answer without evidence.", "Самореклама: ответ заявлен без доказательств."],
      ["Everyone knows that mobile apps make drivers more careful on the road", "\"Everyone knows\" appeals to common belief; there is no evidence and no gap.", "«Все знают» — ссылка на общее мнение; нет ни доказательств, ни пробела в знании."],
      ["Novice drivers speed because they are careless and ignore all the rules", "A cause is stated as fact without evidence — that is a claim.", "Причина заявлена как факт без доказательств — это утверждение."],
    ], "A research problem says what is happening (novice drivers speed), what is not known (the effect of alerts) and who is affected — without announcing the answer.", "Исследовательская проблема говорит, что происходит (новички превышают скорость), что неизвестно (эффект оповещений) и кого это касается, — не объявляя ответ."),
    qx("A GitHub README shows framework X is \"5x faster\", measured in one run on the author's laptop. What is the biggest methodological weakness?", "One run on one laptop says little about other systems", [
      ["The chart should have used a logarithmic scale for speed", "A presentation detail; it does not fix how the data were obtained.", "Деталь оформления; она не исправляет то, как получены данные."],
      ["Frameworks can never be compared fairly by speed at all", "They can — with equal conditions, repeated runs and stated hardware.", "Можно — при одинаковых условиях, повторных запусках и указанном железе."],
      ["The author is not a well-known programmer with many stars", "Authority is not the issue; method, hardware and sample size are.", "Дело не в авторитете, а в методе, железе и размере выборки."],
    ], "Skepticism checks methodology, hardware constraints and sample size: a single run on a laptop is an anecdote that may not hold on a server.", "Скептицизм проверяет методологию, ограничения железа и размер выборки: один запуск на ноутбуке — случай, который может не подтвердиться на сервере."),
    tfx("Being critically skeptical means rejecting every published benchmark.", false,
      "Skepticism suspends acceptance until the methodology, hardware and sample size are checked; a well-documented result is then accepted. Rejecting everything is cynicism.",
      "Скептицизм откладывает принятие, пока не проверены методология, железо и размер выборки; хорошо задокументированный результат затем принимается. Отвергать всё подряд — цинизм.",
      "\"True\" confuses skepticism with cynicism: a cynic dismisses all evidence, a skeptic weighs it.",
      "«Верно» путает скептицизм с цинизмом: циник отметает любые данные, скептик их взвешивает."),
    qx("A bank wants an LLM to give investment advice. How can its hallucination rate be measured before launch?", "Run it on questions with expert-verified answers and count errors", [
      ["Ask the model to rate its own confidence in every single answer", "Self-reported confidence is not ground truth; an LLM can be confidently wrong.", "Самооценка уверенности — не эталон; LLM бывает уверенно неправа."],
      ["Count the customer complaints received in the first month after launch", "That measures after the harm is done, and complaints undercount errors.", "Это измерение уже после вреда, к тому же жалобы учитывают не все ошибки."],
      ["Compare its average answer length with that of a rival chatbot", "Length says nothing about correctness.", "Длина ответа ничего не говорит о его правильности."],
    ], "Error (hallucination) rate = (wrong + fabricated answers) / total test questions, measured on a test set with verified answers.", "Доля ошибок (галлюцинаций) = (неверные + выдуманные ответы) / все тестовые вопросы на наборе с проверенными ответами."),
    qx("On 400 finance questions with verified answers, the LLM gives 22 wrong and 6 fabricated answers. What is its hallucination (error) rate?", "7%", [
      ["5.5%", "This counts only the 22 wrong answers (22/400) and ignores the 6 fabricated ones.", "Здесь учтены только 22 неверных ответа (22/400), а 6 выдуманных пропущены."],
      ["1.5%", "This counts only the 6 fabricated answers (6/400).", "Здесь учтены только 6 выдуманных ответов (6/400)."],
      ["28%", "28 is the number of bad answers, not their share of 400.", "28 — это число плохих ответов, а не их доля от 400."],
    ], "(22 + 6) / 400 = 28 / 400 = 0.07 = 7%.", "(22 + 6) / 400 = 28 / 400 = 0,07 = 7%."),
    qx("Launching the bank's LLM advisor without research creates several risks. Which one is a security risk?", "A prompt injection makes the bot reveal customer data", [
      ["The bot invents an interest rate that does not exist", "That is a technical (accuracy) risk — a hallucination.", "Это технический риск (точность) — галлюцинация."],
      ["The bot pushes risky investment products to vulnerable clients", "That is an ethical risk — harm to people who trust the bank.", "Это этический риск — вред людям, которые доверяют банку."],
      ["The bot's answers become slower during peak hours", "That is a performance (technical) risk.", "Это риск производительности (технический)."],
    ], "Security risks concern attacks and data protection: prompt injection, customer data leaking through prompts or logs.", "Риски безопасности — про атаки и защиту данных: prompt injection, утечка данных клиентов через промпты или логи."),
    qx("A team finds that its new caching layer gives no measurable speed-up. How should a researcher treat this result?", "As valid knowledge worth reporting", [
      ["As a failed study that should be deleted", "Deleting null results distorts the record and wastes other people's effort.", "Удаление нулевых результатов искажает картину и заставляет других тратить силы впустую."],
      ["As a sign to rerun until a speed-up appears", "Rerunning until the wanted result appears is fishing for results — bias.", "Перезапускать, пока не выйдет нужный результат, — подгонка, то есть предвзятость."],
      ["As proof that the measuring tools were broken", "Without evidence of a fault, blaming the tools is just rejecting unwelcome data.", "Без доказательств неисправности винить инструменты — значит просто отвергать неудобные данные."],
    ], "Open-mindedness: a carefully measured \"no difference\" is knowledge — it saves others from the same wrong bet.", "Открытость: аккуратно измеренное «разницы нет» — тоже знание; оно уберегает других от той же ошибочной ставки."),
    qx("After seeing that its framework loses on latency, a team switches the main metric to \"lines of code\" so that it wins. What is this?", "Moving the goalposts after seeing the results", [
      ["A normal refinement of the research question", "Refinement is justified and happens before the data, not to make a favourite win.", "Уточнение обосновано и делается до данных, а не ради победы любимца."],
      ["Critical skepticism towards the first metric", "Skepticism needs a methodological reason; \"we lost\" is not one.", "Скептицизму нужна методологическая причина; «мы проиграли» — не причина."],
      ["A way to improve the benchmark's reproducibility", "Changing the metric does nothing for reproducibility.", "Смена метрики никак не улучшает воспроизводимость."],
    ], "Changing the metric or the question after seeing results so that the favourite wins violates open-mindedness (and honest reporting).", "Менять метрику или вопрос после результатов, чтобы победил любимец, — нарушение открытости (и честной отчётности)."),
    qx("To turn \"The app will definitely reduce accidents\" into a hypothesis, what has to change?", "Drop the certainty; add a group, comparison and measure", [
      ["Add the word \"significantly\" so the claim sounds more precise", "An adverb adds no comparison and no measure.", "Наречие не добавляет ни сравнения, ни показателя."],
      ["Rephrase it as a question that ends with a question mark", "That would make it a (still vague) question, not a hypothesis.", "Получится (всё ещё расплывчатый) вопрос, а не гипотеза."],
      ["Support it with a blog post that agrees with the statement", "Agreement from a Tier 3 source does not make a statement testable.", "Согласие источника уровня Tier 3 не делает утверждение проверяемым."],
    ], "Remove \"definitely\" and name the population (novice drivers), the comparison (with vs without alerts), the measurable outcome (speeding events per 100 km) and the time frame.", "Убрать «точно» и назвать группу (начинающие водители), сравнение (с оповещениями и без), измеримый результат (превышения на 100 км) и срок."),
    qx("A hypothesis must be falsifiable. What does that mean?", "Some possible data could show it is wrong", [
      ["It must already be proven by earlier studies", "Then it would be a finding, not a hypothesis.", "Тогда это был бы результат, а не гипотеза."],
      ["It must be written as a yes/no question", "That would be a question, not a hypothesis.", "Это был бы вопрос, а не гипотеза."],
      ["It must hold true in every possible case", "Universal truth is not required; testability is.", "Всеобщая истинность не требуется; требуется проверяемость."],
    ], "Falsifiable = the prediction is specific enough that a possible result (e.g. no fewer speeding events) would refute it.", "Опровержимая — прогноз настолько конкретен, что возможный результат (например, превышений не меньше) его опровергнет."),
    qx("Five friends tried SafeDrive and said they now drive more carefully. What is this?", "An anecdote, not evidence", [
      ["Strong evidence, since all five agreed", "Agreement of five hand-picked friends is not evidence.", "Единодушие пяти друзей, выбранных не случайно, — не доказательство."],
      ["A research output, because users were asked", "Asking friends without a method, a measure or a comparison is not research.", "Спросить друзей без метода, показателя и сравнения — не исследование."],
      ["A controlled experiment with a small sample", "There is no control group, and nothing was measured.", "Нет контрольной группы, и ничего не измерено."],
    ], "A tiny, self-reported, uncontrolled sample is an anecdote. Evidence needs a defined measure, a comparison and an adequate sample.", "Крошечная выборка с самоотчётом и без контроля — это случай (anecdote). Доказательству нужны определённый показатель, сравнение и достаточная выборка."),
    tfx("If the data show that a hypothesis is wrong, the study can still be good research.", true,
      "A hypothesis is a tentative prediction; rejecting it with sound data is a valid finding.",
      "Гипотеза — предположительный прогноз; опровергнуть её надёжными данными — полноценный результат.",
      "\"False\" would mean research must confirm its predictions — that is confirmation bias.",
      "«Неверно» означало бы, что исследование обязано подтверждать свои прогнозы, — это предвзятость подтверждения."),
    qx("Which sentence from a project report is an unsupported claim?", "Our approach always outperforms every existing solution", [
      ["In 3 of 4 tests our approach had lower latency than baseline X", "A specific, measured result with a baseline — a supported statement.", "Конкретный измеренный результат с базой сравнения — обоснованное утверждение."],
      ["We expect alerted drivers to speed less than non-alerted drivers", "A tentative, comparative prediction — a hypothesis.", "Предположительный сравнительный прогноз — гипотеза."],
      ["It is not known whether alerts change novice drivers' speed", "This states a gap in knowledge — part of a research problem.", "Это пробел в знании — часть исследовательской проблемы."],
    ], "\"Always\" and \"every\" claim a universal result without evidence — typical markers of an unsupported claim.", "«Всегда» и «любое» заявляют всеобщий результат без доказательств — типичные признаки утверждения без доказательств."),
    qx("A researcher reads only the papers that support their favourite framework and skips the critical ones. What is this called?", "Confirmation bias", [
      ["Critical skepticism", "Skepticism examines all evidence carefully, including evidence against you.", "Скептицизм тщательно проверяет все данные, в том числе те, что против вас."],
      ["Methodological rigor", "Rigor means transparent, documented steps, not selective reading.", "Строгость — прозрачные описанные шаги, а не выборочное чтение."],
      ["Peer review", "Peer review is independent expert checking before publication.", "Рецензирование — независимая экспертная проверка до публикации."],
    ], "Confirmation bias = noticing only the evidence that supports what you already believe; open-mindedness is its antidote.", "Предвзятость подтверждения — замечать только данные в пользу уже имеющегося мнения; противоядие — открытость."),
  ],
);

const p3 = part(
  "rm-l1-p3",
  { en: "Narrowing the focus: from an interest area to a researchable question", ru: "Сужение темы: от области интересов к исследуемому вопросу" },
  {
    en: `## Why broad topics fail
If your topic is "Artificial Intelligence in 2026" or "Cybersecurity", you will **drown in millions of papers**. The literature review turns into a **superficial essay**, and you fail to build **distinct knowledge**.
**The goal:** turn a massive domain into a **sharp, bounded and manageable** engineering or scientific problem.
## The narrowing ladder
Each step down is smaller, more concrete and closer to something you can measure:
= Area → Topic → Problem → Research question
- Course practical task: Artificial Intelligence → AI in Software Engineering → AI coding assistants → AI coding assistants used by university students → *effect of AI coding assistants on students' programming performance*.
- SafeDrive: road-safety technology → driver-feedback apps → novice drivers keep speeding and the effect of alerts is unknown → *do SafeDrive alerts reduce speeding events per 100 km among novice drivers over 8 weeks?*
@diagram rm1-funnel
| Too broad | Narrowed topic (from the lecture) |
|---|---|
| Blockchain technology | Comparing the transaction throughput (TPS) of Proof-of-Stake vs Proof-of-History consensus under artificial network degradation |
| Mobile application performance | The impact of Flutter vs React Native on device battery consumption during active background GPS tracking |
> A narrowed topic names **what is compared**, **what is measured** and **under which conditions**.
## Four elements of a researchable question
| Element | Question it answers | Flutter example |
|---|---|---|
| Population / object | who or what is studied? | Android phones running the same test app |
| Factor / variable | what is changed or compared? | Flutter vs React Native |
| Outcome | what is measured? | battery consumption (% or mAh per hour) |
| Context | where, under which conditions? | active background GPS tracking |
If one element is missing, the question is usually still too broad: "How do AI coding assistants affect students?" has no outcome — affect *what*?
## "Does technology improve road safety?" — what is wrong
This question appears in the SafeDrive quiz. It is **too broad and has no measurable outcome**:
- **"technology"** — which one? Airbags, traffic cameras, navigation apps, SafeDrive? Each would be a separate study.
- **"improve road safety"** — measured how? Accidents, deaths, speeding events, harsh braking? Nothing is defined.
- **no population, context or time frame** — whose driving, where, over what period?
- **a yes/no question about the whole world** — no single study can answer it; the honest answer is "it depends".
**Narrowed:** "Do SafeDrive real-time speed alerts reduce speeding events per 100 km among novice drivers in Astana over 8 weeks, compared with drivers who receive no alerts?"
| Weak question | Problem | Better |
|---|---|---|
| What is Artificial Intelligence? | a definition answers it; nothing to investigate | How does an AI coding assistant affect the task completion time of SE students? |
| Software quality | a topic, not a question | Is test coverage associated with post-release defects in open-source Java projects? |
| Why is Flutter better than React Native? | presupposes the answer (a loaded question) | How do Flutter and React Native differ in battery use during background GPS tracking? |
| Does technology improve road safety? | too broad, no measurable outcome | the SafeDrive version above |
> Exam trap: a question can sound important and still be unresearchable. Check that it is **clear, specific, researchable, relevant and feasible**. Big words — technology, AI, safety, quality — need a population, a factor, an outcome and a context.
## The Feasibility Matrix — three hard filters
Before a team commits to a topic, it must pass three strict practical constraints:
- **Data accessibility** — do you actually have the right to access the source code, private APIs, premium server logs or target users? *"How will you get private banking data?"*
- **Infrastructure requirements** — do you have the computing power, emulators, cloud credits or hardware tools to run the tests? *"Who pays for 100 GPU-hours?"*
- **Time constraints** — can data collection, analysis and report writing fit into the remaining weeks of the trimester? *"Doesn't this experiment take six months?"*
A topic that fails a filter is **reshaped, not abandoned**: a public dataset instead of private logs, a simulator or testnet instead of real infrastructure, 6 weeks instead of a year, one city instead of the whole country — never "borrowed" or invented data.
## Research setup and the peer challenge
A good question is not enough. Before starting, a researcher secures the **right resources** (data, software, equipment), **supervision** (feedback from the instructor and peers), **literature** (access to academic databases) and a **realistic schedule**.
In class, each team narrows two of its three interest areas into measurable topics and swaps them with the neighbouring team. The neighbours act as critical reviewers and must find **at least one major feasibility flaw**.
?? Why is "Does technology improve road safety?" a poor research question, and how can it be fixed?
?= It is too broad and has no measurable outcome: no specific technology, no defined measure of safety, no population, context or time frame. Fix it by naming them — e.g. speeding events per 100 km among novice drivers with vs without SafeDrive alerts over 8 weeks.
?? A team wants to measure the latency of the internal systems of every bank in Kazakhstan this trimester. Which filters does it fail?
?= Data accessibility (no right to access the banks' internal systems) and time (every bank in one trimester is unrealistic). Reshape it, e.g. to the public APIs of three banks or a simulated system.`,
    ru: `## Почему широкие темы проваливаются
Если тема — «Искусственный интеллект в 2026 году» или «Кибербезопасность», команда **утонет в миллионах статей**. Обзор литературы превратится в **поверхностное эссе**, и **нового знания (distinct knowledge)** не получится.
**Цель:** превратить огромную область в **чёткую, ограниченную и посильную** инженерную или научную задачу.
## Лестница сужения
Каждый шаг вниз — уже, конкретнее и ближе к тому, что можно измерить:
= Area → Topic → Problem → Research question
- Практическое задание курса: Artificial Intelligence → ИИ в Software Engineering → ИИ-ассистенты для кода → ИИ-ассистенты, которыми пользуются студенты → *влияние ИИ-ассистентов на результаты студентов в программировании*.
- SafeDrive: технологии безопасности на дорогах → приложения с обратной связью для водителей → новички превышают скорость, а эффект оповещений неизвестен → *снижают ли оповещения SafeDrive число превышений на 100 км у начинающих водителей за 8 недель?*
@diagram rm1-funnel
| Слишком широко | Суженная тема (из лекции) |
|---|---|
| Технология блокчейн | Сравнение пропускной способности (TPS) консенсусов Proof-of-Stake и Proof-of-History при искусственной деградации сети |
| Производительность мобильных приложений | Влияние Flutter и React Native на расход батареи устройства при активном фоновом GPS-трекинге |
> Суженная тема называет, **что сравнивается**, **что измеряется** и **в каких условиях**.
## Четыре элемента исследуемого вопроса
| Элемент | На какой вопрос отвечает | Пример с Flutter |
|---|---|---|
| Population / object (группа, объект) | кого или что изучаем? | Android-телефоны с одним и тем же тестовым приложением |
| Factor / variable (фактор, переменная) | что меняем или сравниваем? | Flutter против React Native |
| Outcome (результат) | что измеряем? | расход батареи (% или мА·ч в час) |
| Context (контекст) | где, в каких условиях? | активный фоновый GPS-трекинг |
Если какого-то элемента нет, вопрос обычно всё ещё слишком широкий: «Как ИИ-ассистенты влияют на студентов?» — без результата: влияют на *что*?
## «Does technology improve road safety?» — что не так
Этот вопрос есть в квизе SafeDrive. Он **слишком широкий и без измеримого результата**:
- **«технологии»** — какие? Подушки безопасности, камеры, навигаторы, SafeDrive? Каждая — отдельное исследование.
- **«повышают безопасность»** — как измерять? Аварии, гибель людей, превышения скорости, резкие торможения? Ничего не определено.
- **нет группы, контекста и срока** — чьё вождение, где, за какой период?
- **вопрос «да/нет» обо всём мире** — ни одно исследование на него не ответит; честный ответ — «зависит от обстоятельств».
**Суженный вариант:** «Снижают ли оповещения SafeDrive о скорости в реальном времени число превышений на 100 км у начинающих водителей в Астане за 8 недель по сравнению с водителями без оповещений?»
| Слабый вопрос | Проблема | Лучше |
|---|---|---|
| What is Artificial Intelligence? | на него отвечает определение; исследовать нечего | Как ИИ-ассистент для кода влияет на время выполнения заданий студентами SE? |
| Software quality | тема, а не вопрос | Связано ли покрытие тестами с числом дефектов после релиза в open-source проектах на Java? |
| Why is Flutter better than React Native? | заранее содержит ответ (наводящий вопрос) | Чем Flutter и React Native различаются по расходу батареи при фоновом GPS-трекинге? |
| Does technology improve road safety? | слишком широко, нет измеримого результата | вариант с SafeDrive выше |
> Ловушка экзамена: вопрос может звучать важно и при этом не поддаваться исследованию. Стоит проверить, что он **ясный, конкретный, исследуемый, релевантный и выполнимый** (clear, specific, researchable, relevant, feasible). Большим словам — технологии, ИИ, безопасность, качество — нужны группа, фактор, результат и контекст.
## Матрица выполнимости (Feasibility Matrix) — три жёстких фильтра
Прежде чем взять тему, команда должна пройти три строгих практических ограничения:
- **Доступность данных (data accessibility)** — есть ли реальное право доступа к исходному коду, закрытым API, платным логам серверов или нужным пользователям? *«Как вы получите закрытые банковские данные?»*
- **Инфраструктура (infrastructure requirements)** — хватает ли вычислительной мощности, эмуляторов, облачных кредитов или железа для тестов? *«Кто оплатит 100 GPU-часов?»*
- **Время (time constraints)** — уложатся ли сбор данных, анализ и написание отчёта в оставшиеся недели триместра? *«Разве этот эксперимент не займёт полгода?»*
Тему, которая не прошла фильтр, **перестраивают, а не бросают**: открытый датасет вместо закрытых логов, симулятор или testnet вместо реальной инфраструктуры, 6 недель вместо года, один город вместо всей страны — но никогда не «одолженные» или выдуманные данные.
## Подготовка к исследованию и взаимная проверка
Хорошего вопроса мало. До старта исследователь обеспечивает себе **нужные ресурсы** (данные, ПО, оборудование), **руководство (supervision)** — обратную связь от преподавателя и однокурсников, **литературу** (доступ к академическим базам) и **реалистичный график**.
На занятии каждая команда сужает две из трёх своих областей до измеримых тем и обменивается ими с соседней командой. Соседи выступают критическими рецензентами и обязаны найти **хотя бы один серьёзный изъян выполнимости**.
?? Почему «Does technology improve road safety?» — плохой исследовательский вопрос и как его исправить?
?= Он слишком широкий и без измеримого результата: нет конкретной технологии, определённого показателя безопасности, группы, контекста и срока. Исправление — назвать их: например, превышения на 100 км у начинающих водителей с оповещениями SafeDrive и без них за 8 недель.
?? Команда хочет за триместр измерить задержки внутренних систем всех банков Казахстана. Какие фильтры она не проходит?
?= Доступность данных (нет права доступа к внутренним системам банков) и время (все банки за триместр — нереально). Тему стоит перестроить: например, открытые API трёх банков или симулированная система.`,
  },
  [
    qx("Why is \"Does technology improve road safety?\" a weak research question?", "It is too broad and has no measurable outcome", [
      ["It is a yes/no question, which is never allowed", "Narrow yes/no questions can work (\"Do alerts reduce speeding events per 100 km…?\"); the problem is breadth.", "Узкие вопросы «да/нет» допустимы («Снижают ли оповещения число превышений на 100 км…?»); проблема в ширине."],
      ["Road safety is not a topic for IT research", "It can be — through apps, sensors and data; the issue is the scope.", "Может быть — через приложения, датчики и данные; проблема в охвате."],
      ["It has already been answered by earlier studies", "At this breadth there is no single answer to find; it is unanswerable as posed.", "При такой ширине единого ответа нет; в такой формулировке на вопрос нельзя ответить."],
    ], "\"Technology\" and \"road safety\" are undefined; there is no population, context, time frame or measurable outcome.", "«Технологии» и «безопасность» не определены; нет группы, контекста, срока и измеримого результата."),
    qx("Which version of the SafeDrive question is properly narrowed?", "Do alerts cut speeding events per 100 km among novice drivers in 8 weeks?", [
      ["How does modern technology influence road safety in cities around the world?", "Still broad: no specific technology, measure or population.", "Всё ещё широко: нет конкретной технологии, показателя и группы."],
      ["Is SafeDrive a good app for drivers who would like to be safer on the roads?", "\"Good\" and \"safer\" are not measurable outcomes.", "«Хорошее» и «безопаснее» — неизмеримые результаты."],
      ["What are all the ways in which mobile apps can affect driving behaviour?", "\"All the ways\" is an open-ended scope, not a bounded question.", "«Все способы» — безграничный охват, а не ограниченный вопрос."],
    ], "It names the factor (alerts), the outcome (speeding events per 100 km), the population (novice drivers) and the time frame (8 weeks).", "Названы фактор (оповещения), результат (превышения на 100 км), группа (начинающие водители) и срок (8 недель)."),
    qx("In \"The impact of Flutter vs React Native on battery consumption during active background GPS tracking\", what is the measured outcome?", "Battery consumption", [
      ["Flutter vs React Native", "That is the factor being compared.", "Это сравниваемый фактор."],
      ["Background GPS tracking", "That is the context — the condition of the test.", "Это контекст — условие теста."],
      ["Mobile app performance", "That is the broad area the topic was narrowed from.", "Это широкая область, из которой сужали тему."],
    ], "The outcome is what gets measured: battery consumption (e.g. % or mAh per hour).", "Результат — то, что измеряют: расход батареи (например, % или мА·ч в час)."),
    qx("RQ: \"How does the use of AI coding assistants affect programming task completion time among Software Engineering students?\" Which element is the population?", "Software Engineering students", [
      ["Use of AI coding assistants", "That is the factor (variable) being investigated.", "Это исследуемый фактор (переменная)."],
      ["Programming task completion time", "That is the outcome being measured.", "Это измеряемый результат."],
      ["University programming tasks", "That is the context of the study.", "Это контекст исследования."],
    ], "Population / object = who or what is studied; here, Software Engineering students.", "Population (группа, объект) — кого или что изучают; здесь студенты Software Engineering."),
    qx("Practical task 2 lists \"Software quality\" and \"Does automated testing reduce the number of software defects?\". What is the key difference?", "Only the second names a factor and an outcome to study", [
      ["Only the first is broad enough to fill a whole thesis", "Breadth is a weakness here, not a virtue.", "Ширина здесь — недостаток, а не достоинство."],
      ["Both are topics, since a real RQ must start with \"How\"", "Research questions may start with Does, Is, What factors… — not only How.", "Вопрос может начинаться с Does, Is, What factors… — не только с How."],
      ["The second is a hypothesis, not a research question", "It is a question; a hypothesis is a statement that predicts a result.", "Это вопрос; гипотеза — утверждение-прогноз результата."],
    ], "\"Software quality\" is a broad topic; the second is a research question with a factor (automated testing) and an outcome (number of defects).", "«Software quality» — широкая тема; второе — исследовательский вопрос с фактором (автотесты) и результатом (число дефектов)."),
    qx("Why is \"What is Artificial Intelligence?\" a poor research question?", "A definition answers it; nothing needs investigating", [
      ["It is too narrow and specific for a whole research project", "Rather the opposite — and the main issue is that a definition answers it.", "Скорее наоборот — а главное, на него отвечает определение."],
      ["It does not mention any programming language or framework", "An RQ does not need to name a language; it needs something to investigate.", "Вопросу не обязательно называть язык; ему нужно то, что можно исследовать."],
      ["AI is too new a field for any research to exist on it", "AI has decades of research; the problem is the type of question.", "У ИИ десятилетия исследований; проблема — в типе вопроса."],
    ], "Practical task 2 warns: do not use questions that can be answered only with a definition.", "Practical task 2 предупреждает: не брать вопросы, на которые отвечает одно определение."),
    qx("What usually happens to the literature review of a team whose topic is just \"Cybersecurity\"?", "It becomes a superficial essay with no distinct contribution", [
      ["It finds too few relevant papers to say anything useful at all", "The opposite: the team drowns in millions of papers.", "Наоборот: команда тонет в миллионах статей."],
      ["It becomes deeper, because there is so much more to read", "Breadth kills depth — there is no time to read critically.", "Ширина убивает глубину — на критическое чтение не хватает времени."],
      ["It automatically passes all three of the feasibility filters", "Broad topics usually fail the filters, especially time.", "Широкие темы обычно проваливают фильтры, особенно по времени."],
    ], "Too broad → millions of papers → a superficial essay and no distinct knowledge.", "Слишком широко → миллионы статей → поверхностное эссе и никакого нового знания."),
    qx("Which sequence shows the narrowing ladder in the right order?", "Area → topic → problem → research question", [
      ["Topic → area → research question → problem", "The area is the broadest level, so it comes first.", "Область — самый широкий уровень, она идёт первой."],
      ["Research question → problem → topic → area", "This runs from narrow to broad — the reverse.", "Здесь от узкого к широкому — обратный порядок."],
      ["Area → research question → topic → problem", "The question is the narrowest step and comes last, after the problem.", "Вопрос — самый узкий шаг и идёт последним, после проблемы."],
    ], "Each step down is narrower and more concrete: area → topic → problem → research question.", "Каждый шаг вниз уже и конкретнее: область → тема → проблема → исследовательский вопрос."),
    qx("A team plans to analyse private transaction logs of a commercial bank. A reviewer asks: \"How will you get this data?\" Which feasibility filter is tested?", "Data accessibility", [
      ["Infrastructure requirements", "Infrastructure is about compute, emulators, cloud credits and hardware.", "Инфраструктура — про вычислительные мощности, эмуляторы, облачные кредиты и железо."],
      ["Time constraints", "Time is about fitting the work into the trimester.", "Время — про то, уложится ли работа в триместр."],
      ["Topic relevance", "Relevance is not one of the three hard filters.", "Релевантность не входит в три жёстких фильтра."],
    ], "Data accessibility: do you actually have the right to access the code, private APIs, server logs or target users?", "Доступность данных: есть ли реальное право доступа к коду, закрытым API, логам серверов или нужным пользователям?"),
    qx("A team wants to fine-tune a large language model but has no GPUs and no cloud credits. Which filter does the topic fail?", "Infrastructure requirements", [
      ["Data accessibility", "Data rights are a separate filter; the gap here is compute.", "Права на данные — отдельный фильтр; здесь не хватает вычислений."],
      ["Time constraints", "Time could also be tight, but the first blocker is missing hardware.", "Со временем тоже может быть туго, но первым мешает отсутствие железа."],
      ["Ethical approval requirements", "Ethics matters (Lecture 3), but it is not one of the three filters and not the problem here.", "Этика важна (лекция 3), но это не один из трёх фильтров и не проблема в данном случае."],
    ], "Infrastructure: the computational power, emulators, cloud credits or hardware tools needed to run the tests.", "Инфраструктура: вычислительная мощность, эмуляторы, облачные кредиты или железо для тестов."),
    qx("An experiment needs six months of user data, but only eight weeks of the trimester remain. What is the best response?", "Reshape it: shorter collection or a smaller scope", [
      ["Keep the plan and report the partial data at the end", "Unfinished collection cannot answer the question.", "Незавершённый сбор данных не ответит на вопрос."],
      ["Drop the research and just build the app instead", "Switching to development abandons the research goal.", "Переход к разработке — отказ от исследовательской цели."],
      ["Collect for two weeks and extrapolate to six months", "Stretching two weeks of data into six-month conclusions is unsupported.", "Растягивать данные за две недели до выводов о полугоде — необоснованно."],
    ], "A topic that fails a filter is reshaped, not abandoned: e.g. 6 weeks of data on one feature instead of a 6-month study.", "Тему, не прошедшую фильтр, перестраивают, а не бросают: например, 6 недель данных по одной функции вместо полугодового исследования."),
    qx("A topic fails the data accessibility filter because the logs are private. Which fix keeps the research honest and feasible?", "Use a public dataset or a simulated system instead", [
      ["Ask a friend inside the company to quietly copy the logs", "Unauthorized access is an ethical and legal violation.", "Несанкционированный доступ — этическое и юридическое нарушение."],
      ["Generate realistic-looking fake logs for the analysis", "Inventing data is fabrication — research misconduct.", "Выдумывать данные — фабрикация, нарушение научной этики."],
      ["Describe what the private logs would most likely show", "Speculation is not data.", "Предположения — не данные."],
    ], "Reshape the topic so that the data are legitimately accessible: public datasets, open APIs, your own simulation or consenting participants.", "Перестроить тему так, чтобы данные были законно доступны: открытые датасеты, открытые API, собственная симуляция или добровольные участники."),
    qx("What is wrong with the question \"Why is Flutter better than React Native?\"", "It assumes the answer before any data is collected", [
      ["It compares two frameworks instead of studying just one", "Comparisons are fine — the lecture's own example compares the two.", "Сравнение допустимо — пример из лекции как раз сравнивает их."],
      ["It is about mobile development, which is not a research field", "Mobile development is a legitimate research area.", "Мобильная разработка — вполне законная область исследований."],
      ["It is far too narrow to find any published papers on", "There is plenty of literature; the issue is the built-in conclusion.", "Литературы достаточно; проблема во встроенном выводе."],
    ], "A loaded question presupposes its conclusion. A neutral version: \"How do Flutter and React Native differ in battery use during background GPS tracking?\"", "Наводящий вопрос заранее содержит вывод. Нейтрально: «Чем Flutter и React Native различаются по расходу батареи при фоновом GPS-трекинге?»"),
    qx("\"How do AI coding assistants affect students?\" Which element is missing and keeps it too broad?", "A measurable outcome, e.g. task completion time", [
      ["A population, since students are not a group", "Students are a population (if a broad one); the missing piece is what is measured.", "Студенты — это группа (пусть и широкая); не хватает того, что измеряется."],
      ["A factor, since AI assistants are not a variable", "The use of AI assistants is exactly the factor.", "Использование ИИ-ассистентов — это и есть фактор."],
      ["A hypothesis, since every RQ must contain one", "A research question does not have to contain a hypothesis.", "Исследовательский вопрос не обязан содержать гипотезу."],
    ], "\"Affect students\" — affect what? Completion time, grades, code understanding? Without an outcome there is nothing to measure.", "«Влияют на студентов» — на что именно? Время выполнения, оценки, понимание кода? Без результата нечего измерять."),
    qx("According to the lecture, what should a narrowed topic name?", "What is compared, what is measured, under what conditions", [
      ["Which tools are trendy, who funds it, and when it is due", "Trendiness, funding and deadlines do not make a topic bounded.", "Модность, финансирование и сроки не делают тему ограниченной."],
      ["The team members, their roles, and the submission deadline", "That is project administration, not the topic.", "Это организация проекта, а не тема."],
      ["The research area, the newest papers, and the main author", "Listing papers does not narrow the topic itself.", "Список статей не сужает саму тему."],
    ], "The narrowed examples (PoS vs PoH throughput under degradation; Flutter vs React Native battery use during GPS tracking) each name a comparison, a measure and a condition.", "Суженные примеры (TPS PoS и PoH при деградации сети; батарея Flutter и React Native при GPS-трекинге) называют сравнение, показатель и условие."),
    tfx("Narrowing a topic weakens the literature review, because fewer papers are directly relevant.", false,
      "Fewer but directly relevant papers allow a deeper, critical review; a broad topic produces a superficial essay.",
      "Меньше, но прямо относящихся к делу статей дают более глубокий критический обзор; широкая тема даёт поверхностное эссе.",
      "\"True\" assumes that more papers mean a better review; the lecture says breadth drowns you in millions of papers.",
      "«Верно» предполагает, что чем больше статей, тем лучше обзор; лекция говорит, что ширина топит в миллионах статей."),
    qx("During the peer challenge in class, what must the neighbouring team do with your narrowed topics?", "Find at least one major feasibility flaw", [
      ["Rewrite them so that they sound more impressive", "The goal is critical review, not polishing the wording.", "Цель — критическая рецензия, а не шлифовка формулировок."],
      ["Vote for the most interesting topic in the class", "Interest is not the criterion; feasibility is.", "Критерий — не интерес, а выполнимость."],
      ["Approve them if they sound important enough", "Sounding important is exactly what the review should look past.", "«Звучит важно» — как раз то, за что рецензия должна заглянуть."],
    ], "The neighbouring team acts as a critical reviewer and must find at least one major feasibility flaw (data access, infrastructure, time).", "Соседняя команда — критический рецензент: она обязана найти хотя бы один серьёзный изъян выполнимости (данные, инфраструктура, время)."),
    qx("Which topic passes all three feasibility filters for a student team in one trimester?", "Battery use of two cross-platform apps on lab phones over 3 weeks", [
      ["Latency of all Kazakh banks' internal payment systems this month", "Fails data accessibility: no right to access the banks' internal systems.", "Не проходит доступность данных: нет права доступа к внутренним системам банков."],
      ["Training a new GPT-scale language model from scratch on campus", "Fails infrastructure: it requires enormous compute.", "Не проходит инфраструктуру: нужны огромные мощности."],
      ["Career outcomes of this year's graduates over the next 10 years", "Fails time: ten years do not fit into a trimester.", "Не проходит время: десять лет не умещаются в триместр."],
    ], "Lab phones (infrastructure), the team's own test apps (data access) and 3 weeks (time) — every filter is satisfied.", "Телефоны лаборатории (инфраструктура), свои тестовые приложения (данные) и 3 недели (время) — все фильтры пройдены."),
    qx("A team's question is \"Is AI good for education?\" Which checklist criterion does it fail most clearly?", "Specific — \"AI\", \"good\" and \"education\" are undefined", [
      ["Relevant — education has nothing at all to do with IT", "Educational technology is a legitimate IT research area.", "Образовательные технологии — законная область IT-исследований."],
      ["Clear — it is written in English rather than in Kazakh", "The language of the question is irrelevant.", "Язык вопроса не имеет значения."],
      ["Feasible — students are not allowed to study AI tools", "There is no such rule; AI tools can be studied.", "Такого правила нет; ИИ-инструменты можно изучать."],
    ], "Course checklist: clear, specific, researchable, relevant, feasible. This question has no defined factor, outcome, population or context.", "Чек-лист курса: ясный, конкретный, исследуемый, релевантный, выполнимый. Здесь не определены фактор, результат, группа и контекст."),
    qx("In \"Do SafeDrive alerts reduce speeding events per 100 km among novice drivers in Astana over 8 weeks?\", what is the context?", "Astana, 8 weeks", [
      ["Novice drivers", "That is the population.", "Это группа (population)."],
      ["SafeDrive alerts", "That is the factor.", "Это фактор."],
      ["Speeding events per 100 km", "That is the measured outcome.", "Это измеряемый результат."],
    ], "Context = where and under which conditions: in Astana, over 8 weeks.", "Контекст — где и в каких условиях: в Астане, за 8 недель."),
  ],
);

const p4 = part(
  "rm-l1-p4",
  { en: "Credible sources vs hype, academic search and the course rules", ru: "Достоверные источники и хайп, академический поиск и правила курса" },
  {
    en: `## The literature hierarchy in IT
The internet is flooded with technology blogs, marketing hype and basic tutorials. Academic research follows a strict hierarchy of source credibility:
| Tier | Credibility | Examples | In a literature review |
|---|---|---|---|
| Tier 1 | highest | peer-reviewed journal articles and conference proceedings (IEEE Xplore, ACM Digital Library, Springer, Scopus) | the core evidence |
| Tier 2 | moderate | official technical whitepapers (W3C web standards, the original Ethereum whitepaper), verified system documentation | facts about a standard or a system |
| Tier 3 | lowest | Medium posts, TechCrunch articles, YouTube tutorials, personal GitHub READMEs, tech-influencer tweets | avoid |
- **Peer review** means independent experts checked the method and conclusions **before** publication. In computer science, conference proceedings (IEEE, ACM) are full Tier 1 venues.
- A whitepaper or official documentation is authoritative about **what a system is**, but it is written by its creators and is not an independent test of **how well it works**.
- A Tier 3 source can still be a useful **lead**: if a blog mentions a study, find the original peer-reviewed paper, read it and cite that.
> Exam trap: popularity is not credibility. A README with 40k stars, a viral tweet or a TechCrunch article is still Tier 3.
## Hype vs science
- **Text A (tech blog):** "Our revolutionary new JavaScript engine runs 10x faster than Node.js! It completely disrupts backend development! Download our NPM package now."
- **Text B (research):** "Under synthetic memory stress tests mapping 50,000 concurrent V8 isolates, this architecture demonstrated an 11.2% reduction in garbage collection pause times compared to Node.js v20, with a trade-off of 4% higher baseline idle RAM utilization."
| Feature | Text A (hype) | Text B (science) |
|---|---|---|
| Conditions | none | synthetic memory stress test, 50,000 concurrent V8 isolates |
| Metric | "10x faster" — at what? | 11.2% shorter garbage-collection pauses |
| Baseline | "Node.js" — which version? | Node.js v20 |
| Trade-off | none, only benefits | 4% higher baseline idle RAM |
| Tone | emotional, a call to action | neutral and precise |
> The core rule: in your literature review, arguments, metrics and tone must mirror Text B, not Text A.
## Academic search engines
- **Google Scholar** — the widest open index of academic papers; perfect for **initial keyword discovery**.
- **IEEE Xplore and ACM Digital Library** — the gold standards for computer science, software architecture and hardware research.
- **Litmaps / Connected Papers** — visual discovery tools: plug in **one core, foundational paper** and the tool maps the related, interconnected studies.
Build keywords from the elements of your narrowed topic (factor + outcome + context), for example: React Native, battery consumption, background GPS.
## The extraction table — the start of Assignment 1
For every paper, fill in one row:
| Column | What to write |
|---|---|
| Article | short title or ID |
| APA Reference | the full reference in APA style |
| Problem | the problem the paper addresses |
| Method / Data | how the study was done and on what data |
| Metrics & Results | what was measured and what was found, with numbers |
| Limitations | weaknesses the authors admit or you notice |
| Relevance / Gap | how it relates to your topic and what remains unexplored |
**Homework before the next session:** (1) finalize **one** narrowed topic; (2) find and download **3 peer-reviewed papers** (Google Scholar, IEEE, ACM); (3) bring the PDFs to class for a live breakdown. **Assignment 1 — Writing a Literature Review** is due in **week 4** and is worth **20 points** of the 1st attestation.
## Course rules you may be tested on
- **Attendance:** at least **70%** is required for admission to the final exam. Missing **30% or more** without a valid documented excuse → "not graded": no admission, automatic failure. Arriving 5–10 minutes late may be marked as an absence.
- **Academic integrity:** zero tolerance for plagiarism and unauthorized AI use. AI-generated content or copied code/text without proper citation → **0 points and a report to the disciplinary committee**. AI tools may be used for learning only when the instructor permits, and the student stays responsible for accuracy.
- **Teams:** groups of **3–4 students**, permanent for the trimester. First deliverable: the members' names and **3 general IT areas** of interest.
- **Assessment:** each attestation is 100 points — two assignments (20 each), three quizzes (10 each) and a midterm or endterm (30). Below **25%** in either attestation → automatic failure. The final exam is a **team research manuscript and presentation**.
= Final grade = 0.3 × Attestation 1 + 0.3 × Attestation 2 + 0.4 × Final
?? A TechCrunch article says a new database is "3x faster" and links to an IEEE conference paper. What goes into the literature review?
?= The IEEE conference paper (Tier 1), after reading its method and results. TechCrunch is Tier 3 and only served as a lead.
?? Which extraction-table column holds "no study has tested this with Kazakh-language users"?
?= Relevance / Gap — it is a gap that your own project could fill.`,
    ru: `## Иерархия источников в IT
Интернет переполнен технологическими блогами, маркетинговым хайпом и простыми туториалами. В академическом исследовании действует строгая иерархия достоверности источников:
| Уровень | Достоверность | Примеры | В обзоре литературы |
|---|---|---|---|
| Tier 1 | высшая | рецензируемые журнальные статьи и труды конференций (IEEE Xplore, ACM Digital Library, Springer, Scopus) | основа доказательств |
| Tier 2 | средняя | официальные технические whitepaper (веб-стандарты W3C, оригинальный whitepaper Ethereum), проверенная документация систем | факты о стандарте или системе |
| Tier 3 | низшая | посты на Medium, статьи TechCrunch, обучалки на YouTube, личные README на GitHub, твиты техно-инфлюенсеров | избегать |
- **Рецензирование (peer review)** — независимые эксперты проверили метод и выводы **до** публикации. В computer science труды конференций (IEEE, ACM) — полноценные площадки уровня Tier 1.
- Whitepaper или официальная документация авторитетны в том, **что представляет собой система**, но их пишут её создатели, и это не независимая проверка того, **насколько хорошо она работает**.
- Источник Tier 3 может быть полезной **подсказкой**: если блог упоминает исследование, стоит найти оригинальную рецензируемую статью, прочитать её и ссылаться на неё.
> Ловушка экзамена: популярность — не достоверность. README с 40 тысячами звёзд, вирусный твит или статья в TechCrunch — всё равно Tier 3.
## Хайп и наука
- **Текст A (техноблог):** «Наш революционный новый JavaScript-движок работает в 10 раз быстрее Node.js! Он полностью меняет бэкенд-разработку! Скачайте наш NPM-пакет прямо сейчас».
- **Текст B (исследование):** «В синтетических стресс-тестах памяти с 50 000 одновременных изолятов V8 эта архитектура показала сокращение пауз сборки мусора на 11,2% по сравнению с Node.js v20 ценой на 4% большего базового расхода RAM в простое».
| Признак | Текст A (хайп) | Текст B (наука) |
|---|---|---|
| Условия | никаких | синтетический стресс-тест памяти, 50 000 одновременных изолятов V8 |
| Метрика | «в 10 раз быстрее» — в чём? | паузы сборки мусора короче на 11,2% |
| База сравнения | «Node.js» — какая версия? | Node.js v20 |
| Компромисс | нет, одни плюсы | на 4% больше базовый расход RAM в простое |
| Тон | эмоциональный, призыв к действию | нейтральный и точный |
> Главное правило: в обзоре литературы аргументы, метрики и тон должны быть как в тексте B, а не как в тексте A.
## Академические поисковики
- **Google Scholar** — самый широкий открытый индекс научных статей; идеален для **первого поиска по ключевым словам**.
- **IEEE Xplore и ACM Digital Library** — золотой стандарт для computer science, архитектуры ПО и исследований железа.
- **Litmaps / Connected Papers** — инструменты визуального поиска: на вход **одна ключевая основополагающая статья**, на выходе — карта связанных исследований.
Ключевые слова берутся из элементов суженной темы (фактор + результат + контекст), например: React Native, battery consumption, background GPS.
## Таблица извлечения — начало Assignment 1
Для каждой статьи заполняется одна строка:
| Колонка | Что писать |
|---|---|
| Article | краткое название или номер |
| APA Reference | полная ссылка в стиле APA |
| Problem | какую проблему решает статья |
| Method / Data | как проведено исследование и на каких данных |
| Metrics & Results | что измеряли и что получили, с числами |
| Limitations | слабости, которые признают авторы или видно со стороны |
| Relevance / Gap | как статья связана с вашей темой и что осталось неизученным |
**Домашнее задание к следующему занятию:** (1) окончательно выбрать **одну** суженную тему; (2) найти и скачать **3 рецензируемые статьи** (Google Scholar, IEEE, ACM); (3) принести PDF на занятие для разбора. **Assignment 1 — обзор литературы (Writing a Literature Review)** сдаётся на **4-й неделе** и даёт **20 баллов** первой аттестации.
## Правила курса, которые могут спросить
- **Посещаемость:** для допуска к итоговому экзамену нужно не меньше **70%**. Пропуск **30% и больше** без уважительной документально подтверждённой причины → «not graded»: нет допуска, автоматический провал. Опоздание на 5–10 минут могут отметить как пропуск.
- **Академическая честность:** нулевая терпимость к плагиату и несанкционированному использованию ИИ. Сгенерированный ИИ текст или скопированный код/текст без ссылки → **0 баллов и сообщение в дисциплинарную комиссию**. ИИ можно использовать для учёбы, только если разрешил преподаватель, и ответственность за точность остаётся на студенте.
- **Команды:** по **3–4 человека**, постоянные на весь триместр. Первый результат: имена участников и **3 общие IT-области**, интересные команде.
- **Оценивание:** каждая аттестация — 100 баллов: два задания (по 20), три квиза (по 10) и мидтерм или эндтерм (30). Меньше **25%** за любую аттестацию → автоматический провал. Итоговый экзамен — **командная исследовательская рукопись и презентация**.
= Final grade = 0.3 × Attestation 1 + 0.3 × Attestation 2 + 0.4 × Final
?? Статья в TechCrunch пишет, что новая база данных «в 3 раза быстрее», и ссылается на доклад конференции IEEE. Что идёт в обзор литературы?
?= Доклад IEEE (Tier 1) — после того как прочитаны его метод и результаты. TechCrunch — Tier 3 и служит лишь подсказкой.
?? В какую колонку таблицы извлечения записать «ни одно исследование не проверяло это на казахоязычных пользователях»?
?= Relevance / Gap — это пробел, который может закрыть ваш собственный проект.`,
  },
  [
    qx("A team needs the core evidence for its literature review on consensus throughput. Which source should carry the most weight?", "A peer-reviewed IEEE conference paper", [
      ["The original whitepaper of the blockchain", "Tier 2: authoritative about the design, but not an independent, peer-reviewed test.", "Tier 2: авторитетен в описании устройства, но это не независимая рецензируемая проверка."],
      ["A Medium post by a well-known core developer", "Tier 3, however famous the author.", "Tier 3, как бы ни был известен автор."],
      ["A YouTube benchmark with a million views", "Tier 3: popularity is not peer review.", "Tier 3: популярность — не рецензирование."],
    ], "Tier 1 — peer-reviewed journal articles and conference proceedings (IEEE Xplore, ACM DL, Springer, Scopus) — is the core evidence.", "Tier 1 — рецензируемые журнальные статьи и труды конференций (IEEE Xplore, ACM DL, Springer, Scopus) — основа доказательной базы."),
    qx("Where does the official W3C specification of WebSockets sit in the hierarchy?", "Tier 2 — official documentation", [
      ["Tier 1 — peer-reviewed research", "A standard is authoritative, but it is not peer-reviewed research that tests something.", "Стандарт авторитетен, но это не рецензируемое исследование, которое что-то проверяет."],
      ["Tier 3 — avoid in a review", "It is official, verified documentation, not a blog.", "Это официальная проверенная документация, а не блог."],
      ["Outside the hierarchy entirely", "The lecture explicitly lists W3C standards as Tier 2.", "Лекция прямо относит стандарты W3C к Tier 2."],
    ], "Tier 2: official technical whitepapers and standards (W3C, the original Ethereum whitepaper) and verified system documentation.", "Tier 2: официальные технические whitepaper и стандарты (W3C, оригинальный whitepaper Ethereum) и проверенная документация систем."),
    qx("A GitHub README with 40,000 stars claims the library is \"the fastest ever\". How should it be treated in a literature review?", "As Tier 3 — at most a lead, not evidence", [
      ["As Tier 1, since thousands of developers trust it", "Stars measure popularity, not peer review.", "Звёзды измеряют популярность, а не рецензирование."],
      ["As Tier 2, since it is the project's official page", "The lecture lists personal GitHub READMEs as Tier 3; a marketing claim is not verified documentation.", "Лекция относит README на GitHub к Tier 3; рекламное заявление — не проверенная документация."],
      ["As primary data that proves the speed claim", "A claim is not data; no method or measurements are given.", "Заявление — не данные; ни метода, ни измерений нет."],
    ], "Popularity is not credibility. Use such a source only as a pointer towards real, peer-reviewed evidence.", "Популярность — не достоверность. Такой источник годится лишь как подсказка, где искать настоящие рецензируемые данные."),
    qx("What does peer review add that a tech blog lacks?", "Independent experts check the method before publication", [
      ["A guarantee that the results will stay correct forever", "Peer review reduces errors but guarantees nothing forever.", "Рецензирование снижает число ошибок, но ничего не гарантирует навсегда."],
      ["Faster publication of the newest ideas to a wide audience", "Blogs are faster; peer review is slower but checked.", "Блоги быстрее; рецензирование медленнее, зато с проверкой."],
      ["Proof that the paper is popular and widely read by engineers", "Popularity is not what peer review measures.", "Рецензирование не измеряет популярность."],
    ], "Peer review = independent experts scrutinize the method and the conclusions before the work is published.", "Рецензирование (peer review) — независимые эксперты проверяют метод и выводы до публикации."),
    qx("A TechCrunch article says a new database is \"3x faster\" and links to an IEEE paper. What should the literature review cite?", "The IEEE paper, after reading its method", [
      ["The TechCrunch article, since it is easier to read", "TechCrunch is Tier 3; being easy to read is not credibility.", "TechCrunch — Tier 3; лёгкость чтения — не достоверность."],
      ["Both equally, since they report the same result", "A journalist's summary may distort the original; the tiers differ.", "Пересказ журналиста может исказить оригинал; уровни разные."],
      ["Neither, since \"3x faster\" must be hype", "The claim may be true — check it in the original paper.", "Заявление может оказаться правдой — его стоит проверить в оригинальной статье."],
    ], "Trace the claim to its original peer-reviewed source, read it and cite that; the article only served as a lead.", "Проследить заявление до оригинального рецензируемого источника, прочитать его и сослаться на него; статья была лишь подсказкой."),
    qx("Which sentence is written in the academic style of Text B?", "GC pauses fell 11.2% vs Node.js v20, with 4% more idle RAM", [
      ["Our engine is 10x faster than Node.js and disrupts the backend", "Hype: a vague multiplier, no conditions, an emotional claim.", "Хайп: расплывчатое «в 10 раз», нет условий, эмоциональное заявление."],
      ["Developers everywhere agree this is the best runtime ever built", "An appeal to popularity — nothing is measured.", "Ссылка на популярность — никаких измерений."],
      ["This revolutionary engine will change how you build servers", "\"Revolutionary\" is a hype marker; nothing is measured.", "«Революционный» — маркер хайпа; ничего не измерено."],
    ], "Academic style: an exact metric, a named baseline (Node.js v20) and an honest trade-off (more idle RAM).", "Академический стиль: точная метрика, названная база сравнения (Node.js v20) и честно указанная цена (больше RAM в простое)."),
    qx("What makes Text B (\"11.2% reduction in GC pause times compared to Node.js v20, with 4% higher idle RAM\") credible?", "Stated conditions, exact metric, baseline and trade-off", [
      ["A confident tone and a clear call to action for readers", "Those are features of Text A — the hype.", "Это черты текста A — хайпа."],
      ["A bigger performance gain than Text A reports for its engine", "11.2% is smaller than \"10x\"; credibility does not come from the size of the number.", "11,2% меньше, чем «в 10 раз»; достоверность не зависит от размера цифры."],
      ["Technical vocabulary that makes the claim sound impressive", "Jargon is not evidence; the specifics are.", "Жаргон — не доказательство; доказательство — конкретика."],
    ], "Text B states the test conditions (50,000 concurrent V8 isolates), the exact metric, the baseline and the cost.", "Текст B указывает условия теста (50 000 одновременных изолятов V8), точную метрику, базу сравнения и цену."),
    qx("Text A says the engine \"runs 10x faster than Node.js\". What is the main problem with \"10x\"?", "No conditions, workload or metric are given", [
      ["A 10x speed-up is physically impossible for any engine", "Large speed-ups are possible on specific workloads; the problem is the missing specification.", "Большие ускорения возможны на отдельных нагрузках; проблема — в отсутствии конкретики."],
      ["It should have been written as 1000% instead", "The format is irrelevant.", "Формат записи не важен."],
      ["Node.js is not a valid baseline for comparison", "Node.js is a fine baseline; its version and setup must be stated.", "Node.js — нормальная база сравнения; нужно лишь указать версию и настройки."],
    ], "\"10x faster\" — at what, measured how, on which version and hardware? Without that, the number cannot be verified.", "«В 10 раз быстрее» — в чём, как измерено, на какой версии и железе? Без этого число нельзя проверить."),
    qx("A team has one foundational paper and wants to see the related studies around it. Which tool fits best?", "Litmaps or Connected Papers", [
      ["A Google Scholar keyword search", "Good for initial keyword discovery, but it does not map connections from one seed paper.", "Хорош для первого поиска по ключевым словам, но не строит карту связей от одной статьи."],
      ["The IEEE Xplore list of journals", "A list of journals does not show how studies connect.", "Список журналов не показывает связи между исследованиями."],
      ["A reference manager such as Mendeley", "It stores and cites papers but does not map connections.", "Он хранит статьи и оформляет ссылки, но не строит карту связей."],
    ], "Litmaps / Connected Papers: plug in one core paper and the tool visually maps the related, interconnected studies.", "Litmaps / Connected Papers: на вход одна ключевая статья, инструмент визуально строит карту связанных исследований."),
    qx("Which databases does the lecture call the gold standards for computer science research?", "IEEE Xplore and ACM Digital Library", [
      ["Google Scholar and the Wikipedia reference lists", "Scholar is the widest open index, not the gold standard; Wikipedia is not an academic database.", "Scholar — самый широкий открытый индекс, а не золотой стандарт; Википедия — не академическая база."],
      ["Stack Overflow and GitHub Discussions", "These are community Q&A sites, not academic databases.", "Это сообщества вопросов и ответов, а не академические базы."],
      ["Scopus and the Medium partner program", "Scopus indexes peer-reviewed work, but Medium is Tier 3.", "Scopus индексирует рецензируемые работы, но Medium — Tier 3."],
    ], "IEEE Xplore and ACM DL are the gold standards for computer science, software architecture and hardware research.", "IEEE Xplore и ACM DL — золотой стандарт для computer science, архитектуры ПО и исследований железа."),
    qx("Which extraction-table column should hold \"the authors admit their sample of 12 users is too small to generalize\"?", "Limitations", [
      ["Metrics & Results", "Results are what was found; admitted weaknesses go elsewhere.", "Результаты — что найдено; признанные слабости идут в другую колонку."],
      ["Method / Data", "Method describes how the study was done; its weaknesses are limitations.", "Метод описывает, как проведено исследование; его слабости — ограничения."],
      ["Relevance / Gap", "Relevance / Gap links the paper to your own topic.", "Relevance / Gap связывает статью с вашей темой."],
    ], "Limitations: weaknesses the authors admit or you notice — small samples, narrow settings, missing tests.", "Limitations: слабости, которые признают авторы или видно со стороны, — маленькая выборка, узкие условия, недостающие тесты."),
    qx("Which column of the extraction table shows how a paper connects to your topic and what is still unexplored?", "Relevance / Gap", [
      ["Problem", "Problem is the paper's own research problem.", "Problem — собственная исследовательская проблема статьи."],
      ["Limitations", "Limitations are weaknesses of the paper itself.", "Limitations — слабости самой статьи."],
      ["APA Reference", "That is just the formatted citation.", "Это просто оформленная ссылка."],
    ], "Relevance / Gap connects each paper to your project and records what remains unexplored — the seed of your research gap.", "Relevance / Gap связывает статью с вашим проектом и фиксирует, что осталось неизученным, — зерно вашего research gap."),
    qx("A paper reports \"median latency dropped from 120 ms to 85 ms\". Where does this go in the extraction table?", "Metrics & Results", [
      ["Method / Data", "Method / Data describes how and on what data the study was done, not the numbers it found.", "Method / Data описывает, как и на каких данных проведено исследование, а не найденные числа."],
      ["Problem", "Problem is what the paper set out to solve.", "Problem — то, что статья собиралась решить."],
      ["Limitations", "A measured improvement is a result, not a weakness.", "Измеренное улучшение — результат, а не слабость."],
    ], "Metrics & Results: what was measured and what was found, with numbers.", "Metrics & Results: что измеряли и что получили, с числами."),
    qx("What must every team bring to the next practice session?", "One narrowed topic and 3 peer-reviewed papers as PDFs", [
      ["A finished literature review of at least ten sources", "The literature review is Assignment 1, due in week 4.", "Обзор литературы — это Assignment 1, срок — 4-я неделя."],
      ["A working prototype of the team's research app", "A prototype is development, not part of this homework.", "Прототип — это разработка, в домашнее задание он не входит."],
      ["Three broad IT areas and the list of team members", "That was the deliverable of the first session itself.", "Это было результатом самого первого занятия."],
    ], "Homework: finalize one narrowed topic, find and download 3 peer-reviewed papers (Scholar, IEEE, ACM) and bring the PDFs for a live breakdown.", "Домашнее задание: выбрать одну суженную тему, найти и скачать 3 рецензируемые статьи (Scholar, IEEE, ACM) и принести PDF для разбора."),
    qx("Assignment 1 (Writing a Literature Review): when is it due and what is it worth?", "Week 4, 20 points of the 1st attestation", [
      ["Week 2, 10 points of the 1st attestation", "A quiz is worth 10; Assignment 1 is 20 points, due in week 4.", "10 баллов стоит квиз; Assignment 1 — 20 баллов, срок — 4-я неделя."],
      ["Week 10, 40% of the final course grade", "40% is the weight of the final team paper presentation.", "40% — это вес итоговой презентации командной работы."],
      ["Week 7, 30 points as the midterm", "The midterm is a separate 30-point assessment.", "Мидтерм — отдельная работа на 30 баллов."],
    ], "Assignment 1 is due in week 4 and gives 20 of the 100 points of the 1st attestation.", "Assignment 1 сдаётся на 4-й неделе и даёт 20 из 100 баллов первой аттестации."),
    qx("A student misses 30% of classes without a documented excuse. What happens?", "\"Not graded\": no exam admission, course failed", [
      ["Only the attendance points for those classes are lost", "Attendance earns no points; the consequence is admission to the exam.", "За посещаемость баллов не дают; последствие — допуск к экзамену."],
      ["A warning, followed by retakes of the missed quizzes", "There is no such rule; 30% unexcused absence means automatic failure.", "Такого правила нет; 30% пропусков без причины — автоматический провал."],
      ["Nothing, as long as the quiz scores are high enough", "Grades cannot compensate for missing attendance.", "Оценки не компенсируют посещаемость."],
    ], "At least 70% attendance is required for exam admission; 30% or more unexcused absence → \"not graded\" and automatic failure.", "Для допуска к экзамену нужно не меньше 70% посещаемости; 30% и больше пропусков без причины → «not graded» и автоматический провал."),
    qx("A student submits AI-generated text as their own work without acknowledgement. What does the course policy say?", "0 points and a report to the disciplinary committee", [
      ["Allowed, as long as the grammar has been checked", "Checking grammar does not make someone else's text your own work.", "Проверка грамматики не делает чужой текст своей работой."],
      ["A 10% penalty on that assignment", "The policy is zero points plus a report, not a small penalty.", "Правило — ноль баллов и сообщение в комиссию, а не маленький штраф."],
      ["Allowed, because the syllabus permits AI tools for learning", "AI is allowed for learning only with the instructor's permission; submitting it as your own work is a violation.", "ИИ допустим для учёбы только с разрешения преподавателя; сдавать его текст как свой — нарушение."],
    ], "Zero tolerance: unauthorized AI content or uncited copying → 0 points and a report to the disciplinary committee.", "Нулевая терпимость: несанкционированный ИИ-текст или копирование без ссылки → 0 баллов и сообщение в дисциплинарную комиссию."),
    qx("How is the final course grade calculated?", "0.3 × Att. 1 + 0.3 × Att. 2 + 0.4 × final", [
      ["0.5 × Att. 1 + 0.5 × Att. 2", "This ignores the final team paper presentation.", "Здесь забыта итоговая презентация командной работы."],
      ["0.2 × Att. 1 + 0.2 × Att. 2 + 0.6 × final", "The weights are 0.3, 0.3 and 0.4.", "Веса — 0,3, 0,3 и 0,4."],
      ["0.4 × Att. 1 + 0.4 × Att. 2 + 0.2 × final", "The final paper has the largest weight, 0.4.", "У итоговой работы наибольший вес — 0,4."],
    ], "Syllabus: 0.3 × 1st attestation + 0.3 × 2nd attestation + 0.4 × final (team manuscript and presentation).", "Силлабус: 0,3 × первая аттестация + 0,3 × вторая + 0,4 × итог (командная рукопись и презентация)."),
    tfx("An official whitepaper is Tier 2, so it can replace peer-reviewed studies as proof that a system performs well.", false,
      "A whitepaper describes what a system is and intends to do; it is written by its creators and is not an independent test. Performance claims need Tier 1 evidence.",
      "Whitepaper описывает, что такое система и что она должна делать; его пишут её создатели, это не независимая проверка. Утверждениям о производительности нужны данные уровня Tier 1.",
      "\"True\" treats the creators' own document as independent evidence of performance.",
      "«Верно» принимает собственный документ создателей за независимое доказательство производительности."),
    tfx("Scoring below 25% in either attestation leads to automatic failure of the course.", true,
      "The syllabus: students who score less than 25% for Attestation I or II automatically fail the course.",
      "Силлабус: студенты, набравшие меньше 25% за первую или вторую аттестацию, автоматически не проходят курс.",
      "\"False\" would mean a weak attestation can be compensated later — the syllabus says it cannot.",
      "«Неверно» означало бы, что слабую аттестацию можно потом компенсировать, — силлабус говорит, что нельзя."),
  ],
);

export const lecture1: Lecture = {
  id: "rm-l1",
  title: { en: "Lecture 1 — Taking a leap into research", ru: "Лекция 1 — Шаг в мир исследований" },
  parts: [p1, p2, p3, p4],
};
