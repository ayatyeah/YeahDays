import { part, qx, tfx, type Lecture } from "../types";

/**
 * Лекция 3 курса Research Methods and Tools (неделя 3): этика исследования,
 * защита людей и данных, проверка источников, ИИ и Mendeley, каркас
 * исследовательского предложения. Практика — кейс SafeDrive из Practice Quiz 3:
 * риск → мера защиты → подтверждение, непроверенные ссылки от ИИ.
 */
export const lecture3: Lecture = {
  id: "rm-l3",
  title: { en: "Lecture 3 — Research ethics, source verification and Mendeley", ru: "Лекция 3 — Этика исследования, проверка источников и Mendeley" },
  parts: [
    part(
      "rm-l3-p1",
      { en: "Research integrity: misconduct, questionable practices and credit", ru: "Честность исследования: нарушения, сомнительные практики и авторство" },
      {
        en: `## Two responsibilities of research integrity
- **Knowledge — make claims credible:** accurate data, transparent methods, honest limitations and verifiable sources.
- **People — protect those affected:** consent, privacy, fair treatment, secure data and attention to downstream harm.
> A technically correct study can still be unethical, and a kind, careful study can still produce untrustworthy knowledge. Integrity needs both sides.
Integrity is visible in **records and decisions**, not in good intentions: a decision log, a consent record, a verified reference, a contribution statement.
## Diagnostic: approve, revise or stop?
| Decision | Who or what could be harmed | Name of the problem |
|---|---|---|
| Scrape public profiles and publish usernames | the users: privacy, re-identification | ethical / data-protection risk |
| Remove three low scores because they "look wrong" | the evidence: the data record | falsification |
| Use an AI-suggested citation without opening it | the evidence: the source base | possibly fabricated reference |
| Store interview audio in a shared class folder | the participants: confidentiality | data-protection breach |
## Misconduct: three breaches change the research record (FFP)
- **Fabrication — inventing.** Creating data, participants, results or references that never existed: accuracy for a test that was never run, invented survey respondents, a made-up DOI.
- **Falsification — distorting.** Changing, selecting or hiding real data or procedures so that the findings are misrepresented. It includes **misleading omission**: dropping "bad" runs, deleting inconvenient responses, silently changing the procedure.
- **Plagiarism — taking.** Using another person's **words, ideas or data** without clear attribution: a copied paragraph, a translated text, code from GitHub or someone's dataset presented as your own.
= Fabrication = inventing · Falsification = distorting · Plagiarism = taking
> Exam trap: falsification does not need an edited number. Hiding runs, subgroups or steps that would change the reader's conclusion is falsification too.
## Questionable practices often look ordinary
They sit below obvious fraud but still leave a misleading record.
| Practice | What it looks like | Repair |
|---|---|---|
| Cherry-picking | only the metric, run or subgroup that supports the claim is reported | fix the reporting rule in advance; report all runs |
| Hidden limits | a small convenience sample is described as representative | state the sample, the setting and the limits |
| Duplication | substantially the same work is presented as a new contribution | cite the earlier work and declare the overlap |
| Gift authorship | a name is added without a defensible contribution | contribution statement; thank helpers in the acknowledgements |
| HARKing | a hypothesis made up after seeing the results is presented as planned | separate planned and exploratory analysis |
**Disclosure test:** would a reasonable reader make a different decision if this were disclosed? If yes, disclose it — or change the practice.
## Classify the case, then repair it
"A team tests six models and reports only the best run. The other runs remain saved."
- Not fabrication — nothing was invented. Not plagiarism — no source was taken. Not "no issue" — the reader still lacks the full evidence, and saving runs is not disclosing them.
- It is **falsification**: selective reporting distorts the record. Cherry-picking is the everyday name; when it misrepresents the findings, it is classified as falsification.
- **Repair:** define the reporting rule **before** choosing the result — for example, report all six models with the mean and standard deviation over runs.
## The researcher's role: bias is managed by making decisions visible
- **Before:** state expectations, interests and possible conflicts ("the tool I am evaluating is my own").
- **During:** keep a **decision log** and apply the criteria consistently.
- **After:** report exceptions, uncertainty and limitations.
= Reflexive note: I may favour ______. I will check this by ______.
**Reflexivity** is not pretending to be neutral; it is making a possible bias and its check visible. Example: "I may favour my own model; I will check this by tuning every baseline with the same time budget."
## Credit: authorship, acknowledgement and conflicts need evidence
- **Contribution** — credit reflects meaningful work, not status or convenience.
- **Responsibility** — every author can explain and defend the submitted work.
- **Acknowledgement** — support that does not justify authorship (proofreading, lending a GPU, arranging access) is still recognised.
- **Conflict** — funding or relationships that may affect judgement are disclosed (for example, the company whose app is tested pays for the study).
Evidence: a one-line **contribution statement** for each team member. Gift authorship adds a name that did not earn it; **ghost authorship** leaves out someone who did.
?? A student drops two survey responses that contradict the hypothesis and does not mention it. Which FFP category, and why?
?= Falsification: real data were selectively omitted, which distorts the record. Nothing was invented, so it is not fabrication.
?? A team member only booked the lab room. Author or acknowledgement?
?= Acknowledgement: the help is real, but it is not a meaningful intellectual contribution that the person could defend as an author.`,
        ru: `## Две ответственности честного исследования
- **Перед знанием — делать утверждения достоверными:** точные данные, прозрачные методы, честные ограничения и проверяемые источники.
- **Перед людьми — защищать тех, кого затрагивает работа:** согласие, приватность, справедливое отношение, защищённые данные и внимание к последствиям.
> Технически корректное исследование может быть неэтичным, а доброжелательное и аккуратное — давать недостоверное знание. Честности нужны обе стороны.
Честность видна в **записях и решениях**, а не в добрых намерениях: журнал решений, запись о согласии, проверенная ссылка, заявление о вкладе.
## Разминка: одобрить, доработать или остановить?
| Решение | Кому или чему может быть вред | Как называется проблема |
|---|---|---|
| Собрать публичные профили и опубликовать имена пользователей | пользователям: приватность, повторная идентификация | этический риск / риск защиты данных |
| Убрать три низких результата, потому что они «выглядят неправильно» | доказательствам: запись данных | фальсификация |
| Сослаться на источник, предложенный ИИ, не открыв его | доказательствам: база источников | возможно, выдуманная ссылка |
| Хранить аудио интервью в общей папке группы | участникам: конфиденциальность | нарушение защиты данных |
## Нарушения: три вида, которые искажают научную запись (FFP)
- **Fabrication (фабрикация) — выдумывание.** Создание данных, участников, результатов или ссылок, которых не было: точность теста, который не запускали, выдуманные респонденты, несуществующий DOI.
- **Falsification (фальсификация) — искажение.** Изменение, отбор или сокрытие реальных данных или процедур так, что выводы искажаются. Сюда входит и **вводящее в заблуждение умолчание**: выбросить «плохие» прогоны, удалить неудобные ответы, молча поменять процедуру.
- **Plagiarism (плагиат) — присвоение.** Использование чужих **слов, идей или данных** без явной ссылки: скопированный абзац, переведённый текст, код с GitHub или чужой датасет, выданные за свои.
= Fabrication = inventing · Falsification = distorting · Plagiarism = taking
> Ловушка экзамена: для фальсификации не нужно править число. Скрыть прогоны, подгруппы или шаги, которые изменили бы вывод читателя, — тоже фальсификация.
## Сомнительные практики часто выглядят обычно
Они ниже явного мошенничества, но всё равно оставляют вводящую в заблуждение запись.
| Практика | Как выглядит | Как исправить |
|---|---|---|
| Cherry-picking (выборочный отчёт) | сообщается только метрика, прогон или подгруппа, которые подтверждают утверждение | заранее задать правило отчёта; сообщать все прогоны |
| Hidden limits (скрытые ограничения) | небольшая удобная выборка описана как репрезентативная | назвать выборку, условия и ограничения |
| Duplication (дублирование) | по сути та же работа подаётся как новый вклад | сослаться на прежнюю работу и указать пересечение |
| Gift authorship (подарочное авторство) | вписан человек без обоснованного вклада | заявление о вкладе; помощников — в благодарности |
| HARKing | гипотезу придумали после результатов и подают как запланированную | разделять запланированный и разведочный анализ |
**Тест на раскрытие (disclosure test):** принял бы разумный читатель другое решение, если бы это было раскрыто? Если да — раскрыть или изменить практику.
## Определить случай, затем исправить
«Команда тестирует шесть моделей и сообщает только лучший прогон. Остальные прогоны сохранены».
- Не фабрикация — ничего не выдумано. Не плагиат — ничего не присвоено. Не «всё в порядке» — у читателя нет полной картины, а сохранить прогоны не значит их раскрыть.
- Это **фальсификация**: выборочный отчёт искажает запись. Cherry-picking — бытовое название; когда он искажает выводы, его относят к фальсификации.
- **Исправление:** задать правило отчёта **до** выбора результата — например, показать все шесть моделей со средним и стандартным отклонением по прогонам.
## Роль исследователя: предвзятость контролируют, делая решения видимыми
- **До:** назвать ожидания, интересы и возможные конфликты («инструмент, который я оцениваю, — моя разработка»).
- **Во время:** вести **журнал решений (decision log)** и применять критерии одинаково.
- **После:** сообщить об исключениях, неопределённости и ограничениях.
= Reflexive note: I may favour ______. I will check this by ______.
**Рефлексивность (reflexivity)** — не притворство нейтральным, а видимость возможной предвзятости и способа её проверки. Пример: «Я могу отдавать предпочтение своей модели; проверю это, настроив каждую базовую модель с тем же бюджетом времени».
## Признание вклада: авторство, благодарности и конфликты требуют подтверждения
- **Contribution (вклад)** — авторство отражает существенную работу, а не статус или удобство.
- **Responsibility (ответственность)** — каждый автор может объяснить и защитить поданную работу.
- **Acknowledgement (благодарность)** — помощь, не дающая права на авторство (вычитка, одолженная GPU, организация доступа), всё равно отмечается.
- **Conflict (конфликт интересов)** — финансирование или отношения, способные повлиять на суждения, раскрываются (например, исследование оплачивает компания, чьё приложение тестируют).
Подтверждение: однострочное **заявление о вкладе (contribution statement)** для каждого участника команды. Подарочное авторство добавляет имя, которое его не заслужило; **ghost authorship (скрытое авторство)** убирает того, кто заслужил.
?? Студент убирает два ответа анкеты, противоречащих гипотезе, и не упоминает об этом. Какая категория FFP и почему?
?= Фальсификация: реальные данные выборочно опущены, и это искажает запись. Ничего не выдумано, поэтому это не фабрикация.
?? Участник команды только забронировал лабораторию. Автор или благодарность?
?= Благодарность: помощь реальная, но это не существенный интеллектуальный вклад, который человек мог бы защищать как автор.`,
      },
      [
        qx("A paper reports accuracy for a benchmark run that the team never actually executed. How is this classified?", "Fabrication", [
          ["Falsification", "Falsification distorts real data or procedures; here the result never existed at all.", "Фальсификация искажает реальные данные или процедуры, а здесь результата вообще не было."],
          ["Plagiarism", "Nothing was taken from another person; the problem is an invented result.", "Ничего не взято у другого человека; проблема — выдуманный результат."],
          ["Hidden limits", "Hidden limits conceal weaknesses of real data; inventing a result is a far more serious breach.", "Скрытые ограничения прячут слабости реальных данных; выдуманный результат — гораздо более тяжёлое нарушение."],
        ], "Fabrication means inventing data, results or references that never existed — a benchmark that was never run is exactly that.", "Фабрикация — выдумывание данных, результатов или ссылок, которых не было; результат незапущенного теста — именно это."),
        qx("A student removes three low test scores because they “look wrong”, without any rule set in advance. What is this?", "Falsification", [
          ["Fabrication", "Fabrication creates data that never existed; these scores were real.", "Фабрикация создаёт несуществующие данные, а эти оценки были реальными."],
          ["Data minimisation", "Data minimisation limits which personal data are collected; it never justifies deleting inconvenient results.", "Минимизация данных ограничивает сбор персональных данных и не оправдывает удаление неудобных результатов."],
          ["Normal data cleaning", "Cleaning follows a rule fixed before seeing the outcome and is reported; “looks wrong” is not a rule.", "Очистка следует правилу, заданному до просмотра результата, и описывается в отчёте; «выглядит неправильно» — не правило."],
        ], "Real data were removed to change the picture — distorting the record is falsification.", "Реальные данные убраны, чтобы изменить картину, — искажение записи и есть фальсификация."),
        qx("A team tests six models, reports only the best run and keeps the other runs saved on a laptop. How does the lecture classify this?", "Falsification by selective reporting", [
          ["Fabrication of the best result", "The best run really happened; nothing was invented.", "Лучший прогон действительно был; ничего не выдумано."],
          ["No issue, because all runs are still saved", "Keeping runs on a laptop is not disclosure: the reader still lacks the full evidence.", "Хранить прогоны на ноутбуке не значит раскрыть их: у читателя всё равно нет полной картины."],
          ["Plagiarism of the baseline models", "No one else's words, ideas or data were taken without credit.", "Чужие слова, идеи или данные не присваивались."],
        ], "Nothing was invented and nothing was taken, but reporting only the best run distorts the record — falsification.", "Ничего не выдумано и не присвоено, но отчёт только о лучшем прогоне искажает запись — это фальсификация."),
        qx("Which repair best fixes the “six models, best run only” report?", "Set the reporting rule in advance and report every run", [
          ["Delete the weaker runs so that readers are not confused", "Deleting runs hides even more evidence and makes the distortion permanent.", "Удаление прогонов прячет ещё больше данных и делает искажение окончательным."],
          ["Keep the best run but label it as “preliminary”", "A label does not give the reader the missing runs.", "Пометка не даёт читателю недостающих прогонов."],
          ["Rerun the best model until its score is stable", "More runs of the winner still hide how the other five performed.", "Новые прогоны победителя всё равно скрывают результаты остальных пяти."],
        ], "Define the reporting rule before choosing the result — for example, all six models with the mean and standard deviation over runs.", "Правило отчёта задаётся до выбора результата — например, все шесть моделей со средним и стандартным отклонением."),
        qx("A student copies a sorting function from a GitHub repository into the project and describes it as their own implementation. What is this?", "Plagiarism of code", [
          ["Fabrication of code", "The code exists and works; nothing was invented.", "Код существует и работает; ничего не выдумано."],
          ["Falsification of code", "No data or procedure was distorted; someone else's work was presented as one's own.", "Данные и процедуры не искажались; чужая работа выдана за свою."],
          ["Acceptable code reuse", "Reuse is acceptable only with attribution and within the licence; here the author is hidden.", "Повторное использование допустимо только со ссылкой и в рамках лицензии; здесь автор скрыт."],
        ], "Plagiarism covers words, ideas and data — and code: using it without attribution is taking.", "Плагиат касается слов, идей и данных — и кода: использование без ссылки — присвоение."),
        qx("A student translates two paragraphs of a Russian-language article into English and submits them without a citation. Which statement is correct?", "It is plagiarism: translated words and ideas still need a citation", [
          ["It is acceptable, because the English wording is entirely the student's own", "New wording does not make the ideas yours; a translation keeps another author's text.", "Новые слова не делают идеи вашими; перевод сохраняет чужой текст."],
          ["It is falsification, because meaning can shift in translation", "The core problem is missing attribution, not a distortion of data.", "Главная проблема — отсутствие ссылки, а не искажение данных."],
          ["It is fine if the original article has no English version", "Whether a translation exists does not remove the duty to credit the source.", "Наличие или отсутствие перевода не отменяет обязанности указать источник."],
        ], "Plagiarism covers words and ideas in any language; a translation of someone's text without a citation is taking.", "Плагиат касается слов и идей на любом языке; перевод чужого текста без ссылки — присвоение."),
        qx("What does the disclosure test ask?", "Would a reasonable reader decide differently if this were disclosed?", [
          ["Would the result look more convincing if this stayed undisclosed?", "That is the reasoning behind hiding things, not the test against it.", "Это логика сокрытия, а не проверка против него."],
          ["Has another research team already disclosed the same information?", "What others did is irrelevant; the test is about your reader's decision.", "Чужие действия не важны; тест — о решении вашего читателя."],
          ["Would the ethics committee object if it found out about this much later?", "The test is about the reader's decision, not about avoiding objections.", "Тест — о решении читателя, а не о том, как избежать претензий."],
        ], "If a reasonable reader would make a different decision, the information must be disclosed — or the practice changed.", "Если разумный читатель принял бы другое решение, информацию нужно раскрыть или изменить практику."),
        qx("A survey of 25 classmates is reported as showing how “university students in Kazakhstan” use AI tools. Which questionable practice is this?", "Hidden limits", [
          ["Duplication", "Duplication is presenting the same work twice as new.", "Дублирование — подача одной и той же работы дважды как новой."],
          ["Gift authorship", "Gift authorship is about an undeserved name on the paper.", "Подарочное авторство — о незаслуженном имени в списке авторов."],
          ["Fabrication", "The 25 responses are real; the problem is the overstated scope.", "25 ответов реальны; проблема — преувеличенный охват."],
        ], "A small convenience sample presented as representative hides the study's limits.", "Небольшая удобная выборка, поданная как репрезентативная, скрывает ограничения исследования."),
        qx("A team submits essentially the same experiment to a second conference under a new title, without mentioning the first paper. What is this?", "Duplication", [
          ["Synthesis", "Synthesis connects several sources into a new analytical point; this repeats one study.", "Синтез связывает несколько источников в новый вывод; здесь повторяется одно исследование."],
          ["Cherry-picking", "Cherry-picking selects favourable results; here the whole work is re-presented as new.", "Cherry-picking отбирает удобные результаты; здесь вся работа заново подаётся как новая."],
          ["Gift authorship", "Nothing in the case is about who is listed as an author.", "В этом случае речь не о том, кто указан автором."],
        ], "Presenting substantially the same work as a new contribution is duplication; the repair is to cite the earlier work and declare the overlap.", "Подача по сути той же работы как нового вклада — дублирование; исправление — сослаться на прежнюю работу и указать пересечение."),
        qx("A department head is added as a co-author “to improve the chance of acceptance”, although they did not work on the study. What is this?", "Gift authorship", [
          ["Acknowledgement", "An acknowledgement thanks someone without listing them as an author; here the name is on the author list.", "Благодарность отмечает человека, не делая его автором; здесь имя стоит в списке авторов."],
          ["Conflict of interest", "A conflict concerns interests that may bias judgement; here the issue is undeserved credit.", "Конфликт интересов — об интересах, способных исказить суждение; здесь проблема в незаслуженном авторстве."],
          ["Ghost authorship", "Ghost authorship leaves out a real contributor; here an unjustified name is added.", "Скрытое авторство убирает реального участника; здесь, наоборот, добавлено незаслуженное имя."],
        ], "Authorship must reflect a defensible contribution; adding a name for status is gift (honorary) authorship.", "Авторство должно отражать обоснованный вклад; имя ради статуса — подарочное (почётное) авторство."),
        qx("After the results show that the model works better at night, the team writes the introduction as if it had predicted this from the start. What is this practice called?", "HARKing", [
          ["Reflexivity", "Reflexivity makes the researcher's possible bias visible; this hides how the hypothesis appeared.", "Рефлексивность делает предвзятость видимой; здесь, наоборот, скрыто, откуда взялась гипотеза."],
          ["Duplication", "Duplication re-presents an old work as new; this is about a hypothesis invented after the data.", "Дублирование выдаёт старую работу за новую; здесь гипотеза придумана после данных."],
          ["Paraphrasing", "Paraphrasing is rewording a source; it has nothing to do with the timing of a hypothesis.", "Парафраз — пересказ источника; он не связан с моментом появления гипотезы."],
        ], "HARKing — Hypothesising After the Results are Known and presenting it as planned. Repair: separate planned and exploratory analysis.", "HARKing — гипотеза, придуманная после результатов и поданная как запланированная. Исправление — разделять запланированный и разведочный анализ."),
        qx("A study has flawless statistics but secretly records participants' screens during the tasks. Which responsibility of research integrity fails?", "Protecting the people affected by the study", [
          ["Making the knowledge claims credible", "The statistics may be correct; the failure is towards the participants.", "Статистика может быть верной; провал — по отношению к участникам."],
          ["Keeping the reference list verifiable", "The case says nothing about sources.", "В этом случае речь не об источниках."],
          ["Reporting the limitations of the chosen method", "Limitations concern knowledge; secret recording harms people.", "Ограничения касаются знания; тайная запись вредит людям."],
        ], "A technically correct study can still be unethical: secret recording breaks consent and privacy.", "Технически корректное исследование может быть неэтичным: тайная запись нарушает согласие и приватность."),
        qx("What does reflexivity mean for a researcher?", "Making a possible bias and its check visible", [
          ["Staying completely neutral and hiding opinions", "The lecture contrasts reflexivity with pretending to be neutral.", "Лекция противопоставляет рефлексивность притворству нейтральным."],
          ["Repeating every experiment at least twice", "That is replication, not reflexivity.", "Это повторение эксперимента, а не рефлексивность."],
          ["Letting participants approve the final paper", "Checking with participants is a different technique, not what reflexivity means.", "Проверка участниками — другая техника, это не рефлексивность."],
        ], "Reflexive note: “I may favour ___. I will check this by ___.”", "Рефлексивная заметка: «Я могу отдавать предпочтение ___. Проверю это так: ___»."),
        qx("In bias control, which action belongs to the “during” stage?", "Keeping a decision log and applying criteria consistently", [
          ["Stating expectations and possible conflicts of interest", "That is the “before” stage.", "Это этап «до»."],
          ["Reporting exceptions, uncertainty and the limitations", "That is the “after” stage.", "Это этап «после»."],
          ["Choosing the most impressive run for the paper's abstract", "That is cherry-picking, not bias control.", "Это cherry-picking, а не контроль предвзятости."],
        ], "Before: state expectations; during: a decision log and consistent criteria; after: report exceptions and limits.", "До — назвать ожидания; во время — журнал решений и одинаковые критерии; после — сообщить об исключениях и ограничениях."),
        qx("Which contribution best justifies authorship of a team paper?", "Designing the experiment and being able to defend its results", [
          ["Lending the team a GPU server for two weeks of model training", "Valuable support, but it belongs in the acknowledgements.", "Ценная помощь, но её место — в благодарностях."],
          ["Proofreading the grammar of the final manuscript draft", "Language editing is acknowledged, not credited with authorship.", "Языковую правку отмечают в благодарностях, а не авторством."],
          ["Being the head of the lab where the team usually works", "Status is not a contribution; adding a name for status is gift authorship.", "Статус — не вклад; имя ради статуса — подарочное авторство."],
        ], "Authorship requires a meaningful contribution and responsibility: authors can explain and defend the work.", "Авторство требует существенного вклада и ответственности: автор может объяснить и защитить работу."),
        qx("The company whose drowsiness app is being evaluated pays for a student study. What must the team do?", "Disclose the funding as a possible conflict of interest", [
          ["Add a company employee as a co-author to be fair", "Authorship follows contribution, not funding.", "Авторство следует за вкладом, а не за финансированием."],
          ["Keep the funding private so that readers are not biased", "Hiding it fails the disclosure test: readers would judge the results differently.", "Сокрытие проваливает тест на раскрытие: читатели оценили бы результаты иначе."],
          ["Refuse to report any results that favour the app", "Suppressing results is a distortion of its own; disclosure is the remedy.", "Замалчивание результатов — само по себе искажение; лекарство — раскрытие."],
        ], "Funding or relationships that may affect judgement are disclosed.", "Финансирование или отношения, способные повлиять на суждения, раскрываются."),
        tfx("Falsification requires that at least one value in the dataset was edited.", false,
          "False: selecting or hiding data, runs or procedures so that the findings are misrepresented is falsification even if every number is untouched.",
          "Неверно: отбор или сокрытие данных, прогонов или процедур, искажающие выводы, — фальсификация, даже если ни одно число не тронуто.",
          "“True” misses misleading omission, which the lecture explicitly includes in falsification.",
          "Ответ «верно» упускает вводящее в заблуждение умолчание, которое лекция прямо относит к фальсификации."),
        tfx("A technically correct study can still be unethical.", true,
          "True: integrity has two sides — credible knowledge and protection of the people affected.",
          "Верно: у честности две стороны — достоверное знание и защита затронутых людей.",
          "“False” assumes that correct methods guarantee ethics; consent, privacy and harm are separate questions.",
          "Ответ «неверно» предполагает, что верный метод гарантирует этичность; согласие, приватность и вред — отдельные вопросы."),
        qx("In the opening diagnostic, what is the main problem with storing interview audio in a shared class folder?", "Participants' confidentiality is not protected", [
          ["The audio may contain plagiarised ideas", "The risk is to the people recorded, not to the originality of ideas.", "Риск касается записанных людей, а не оригинальности идей."],
          ["The recordings count as fabricated data", "The recordings are real; nothing was invented.", "Записи реальны; ничего не выдумано."],
          ["The shared folder makes the study less reproducible", "Reproducibility is not the issue; uncontrolled access to identifiable data is.", "Проблема не в воспроизводимости, а в неконтролируемом доступе к опознаваемым данным."],
        ], "Identifiable recordings must be kept in controlled storage with named access; a shared folder exposes participants.", "Опознаваемые записи хранят в контролируемом месте с доступом по списку; общая папка раскрывает участников."),
        qx("A student who wrote all of the data-analysis code is left off the author list and is not thanked anywhere. What is this?", "Ghost authorship", [
          ["Gift authorship", "Gift authorship adds an undeserving name; here a deserving one is missing.", "Подарочное авторство добавляет незаслуженное имя; здесь пропало заслуженное."],
          ["Duplication", "Duplication re-presents the same work as new; nothing is published twice here.", "Дублирование — повторная подача той же работы; здесь ничего не публикуется дважды."],
          ["Conflict of interest", "No funding or relationship is biasing judgement; the issue is missing credit.", "Финансирование или отношения не искажают суждение; проблема — непризнанный вклад."],
        ], "Leaving out a real contributor hides credit and responsibility — ghost authorship. A contribution statement prevents it.", "Исключение реального участника скрывает вклад и ответственность — это скрытое авторство. Заявление о вкладе это предотвращает."),
      ],
    ),
    part(
      "rm-l3-p2",
      { en: "Protecting people and data: risk → safeguard → evidence", ru: "Защита людей и данных: риск → мера защиты → подтверждение" },
      {
        en: `## Informed consent is a process, not a signature
Before agreeing, a participant must be able to:
- **Understand** — the purpose, the tasks, the risks and what happens to the data (who sees it, where it is kept, for how long).
- **Choose** — take part voluntarily, without pressure. Watch power relations: teacher–student, employer–employee.
- **Withdraw** — use a clear route out and know its practical limits (an anonymous answer cannot be found and removed later).
- **Ask** — reach a contact for questions or complaints.
> Consent must match what will actually happen to the data. Recording audio, video or location needs explicit disclosure and permission.
Evidence: a dated **participant information sheet** and **signed consent forms** or an e-consent log with timestamps.
## Confidentiality is not anonymity
| Level | Can the team link data to a person? | Example |
|---|---|---|
| Identifiable | yes, directly | name, face video, phone number |
| Confidential | yes, but access and disclosure are controlled | transcripts kept by two named researchers |
| Pseudonymised | yes, through a separate name–code key | P07 instead of a name; the key in a locked file |
| Anonymous | no reasonable way | a form that never collects names, emails or IP addresses |
> Pseudonyms reduce exposure; they do not create anonymity. While a name–code key exists, the data are confidential, not anonymous — and they are still personal data.
Combinations re-identify: age + route + employer + date can point to one driver without any name, and a location trace reveals home and work.
## Plan the data lifecycle before collection
= Collect → Store → Access → Retain → Delete / Share
- **Collect** only what the question needs — **data minimisation**.
- **Store** in an encrypted or institution-approved location, not a shared class folder or a personal chat.
- **Access** — named people and roles.
- **Retain** — a justified period.
- **Delete / share** — the method, the permission and a record of when it happened.
> Never promise a protection your workflow cannot deliver: "anonymous" while collecting emails is a false promise.
## Online data: publicly accessible is not ethically simple
- **Expectations** — did users reasonably expect research use or wider publication?
- **Sensitivity** — could quotes, locations or combinations re-identify someone? A verbatim quote can be searched back to its author.
- **Platform terms** — is automated collection permitted and technically responsible?
- **Presentation** — could the result expose or stigmatise a person or group?
Legal access and ethical use are related but different questions.
## When in doubt, pause before collecting data
| Prompt | Action |
|---|---|
| People or identifiable traces? | YES → ethics review may be required |
| Sensitive, vulnerable or high-risk context? | YES → stronger review and safeguards |
| Institutional policy or external partner? | CHECK → follow the applicable process |
| Change after approval? | REPORT → seek an amendment before proceeding |
The local ethics committee, not the slide, decides the formal route. Evidence: an **approval letter** with a reference number.
## The ethics card: risk → safeguard → evidence
= DATA · PEOPLE · RISK · SAFEGUARD · EVIDENCE
@diagram rm3-evidence-chain
The safeguard must be **specific enough to perform**; the evidence must be a **record another person could inspect**, not an intention.
| Risk | Specific safeguard | Evidence / record |
|---|---|---|
| participants do not know what is recorded | information sheet + consent form | signed consent records (form version) |
| more data than the question needs | data minimisation; protective default (off, opt-in) | settings / configuration audit log |
| identities exposed in the dataset | pseudonymised IDs; key stored apart; raw video deleted | de-identification log; deletion record |
| unauthorised access | encrypted, approved storage; named access | access-control list and access log |
| pressure to take part | recruitment and consent away from the boss | recruitment script; consent log |
| study run without review | ethics committee review before collection | approval letter with reference number |
> Exam trap: "store the data securely" is too vague, and "we will be careful" is not evidence. Name the mechanism and the record.
## Applied: SafeDrive (practice quiz case)
The app watches the driver through the phone camera, logs alert counts and **location**, and by default **continuously records camera video and location** unless the driver changes the setting. Sixty long-haul truck drivers take part for six weeks.
- **Risk 1 — privacy / data protection:** continuous video and location by default collect far more than the question needs. **Safeguard:** recording off by default (opt-in); video processed on the phone, only alert counts and times stored. **Evidence:** a settings audit log of defaults and changes.
- **Risk 2 — informed, voluntary consent:** drivers may not realise that video and location are recorded and may feel pressured by employers. **Safeguard:** an information sheet that names video and location; consent taken by the researchers, refusal without consequences. **Evidence:** signed consent records.
- Also accepted: encrypted storage + access log; no individual data to employers + a data-sharing agreement; an ethics approval letter.
- Study C supports the risk: drivers found constant video monitoring intrusive, and some covered the camera.
?? Why is a separate name–code key confidentiality and not anonymity?
?= The team can still link each response to a person through the key; anonymity means there is no reasonable way to re-link.
?? Give a safeguard and an evidence record for "interview audio is stored in a shared class folder".
?= Move it to encrypted, university-approved storage open only to named researchers; evidence — the access-control list or access log, plus a deletion record after transcription.`,
        ru: `## Информированное согласие — процесс, а не подпись
Прежде чем согласиться, участник должен иметь возможность:
- **Understand (понять)** — цель, задания, риски и что будет с данными (кто их увидит, где они хранятся, как долго).
- **Choose (выбрать)** — участвовать добровольно, без давления. Важны отношения власти: преподаватель — студент, работодатель — сотрудник.
- **Withdraw (выйти)** — воспользоваться понятным способом отказаться и знать его практические пределы (анонимный ответ потом нельзя найти и удалить).
- **Ask (спросить)** — связаться с контактным лицом для вопросов и жалоб.
> Согласие должно соответствовать тому, что реально произойдёт с данными. Запись аудио, видео или геолокации требует явного предупреждения и разрешения.
Подтверждение: датированный **информационный лист участника (participant information sheet)** и **подписанные формы согласия** или журнал электронного согласия с отметками времени.
## Конфиденциальность — не анонимность
| Уровень | Может ли команда связать данные с человеком? | Пример |
|---|---|---|
| Identifiable (опознаваемые) | да, напрямую | имя, видео с лицом, номер телефона |
| Confidential (конфиденциальные) | да, но доступ и раскрытие контролируются | расшифровки хранят два названных исследователя |
| Pseudonymised (псевдонимизированные) | да, через отдельный ключ «имя — код» | P07 вместо имени; ключ в запертом файле |
| Anonymous (анонимные) | нет разумного способа | форма, которая вообще не собирает имена, почту и IP-адреса |
> Псевдонимы снижают риск, но не создают анонимность. Пока существует ключ «имя — код», данные конфиденциальны, а не анонимны, — и это по-прежнему персональные данные.
Сочетания раскрывают личность: возраст + маршрут + работодатель + дата могут указать на одного водителя без всякого имени, а трек геолокации выдаёт дом и работу.
## Жизненный цикл данных планируют до сбора
= Collect → Store → Access → Retain → Delete / Share
- **Collect (сбор)** — только то, что нужно вопросу, — **минимизация данных (data minimisation)**.
- **Store (хранение)** — в зашифрованном или одобренном вузом месте, а не в общей папке группы или личном чате.
- **Access (доступ)** — названные люди и роли.
- **Retain (срок хранения)** — обоснованный период.
- **Delete / share (удаление или передача)** — способ, разрешение и запись о том, когда это сделано.
> Никогда не обещайте защиту, которую ваш процесс не может обеспечить: «анонимно» при сборе почты — ложное обещание.
## Онлайн-данные: публично доступное — не значит этически простое
- **Ожидания** — могли ли пользователи разумно ожидать исследовательского использования или широкой публикации?
- **Чувствительность** — можно ли по цитатам, местам или их сочетанию опознать человека? Дословную цитату можно найти поиском и выйти на автора.
- **Условия платформы** — разрешён ли автоматический сбор и технически ли он ответственен?
- **Подача** — может ли результат выставить напоказ или заклеймить человека либо группу?
Законный доступ и этичное использование — связанные, но разные вопросы.
## Сомневаетесь — остановитесь до сбора данных
| Вопрос | Действие |
|---|---|
| Люди или опознаваемые следы? | ДА → может понадобиться этическая экспертиза |
| Чувствительный, уязвимый или рискованный контекст? | ДА → усиленная проверка и меры защиты |
| Политика вуза или внешний партнёр? | ПРОВЕРИТЬ → следовать применимой процедуре |
| Изменение после одобрения? | СООБЩИТЬ → получить поправку (amendment) до продолжения |
Формальный путь определяет местный этический комитет, а не слайд. Подтверждение: **письмо об одобрении (approval letter)** с номером решения.
## Этическая карточка: риск → мера защиты → подтверждение
= DATA · PEOPLE · RISK · SAFEGUARD · EVIDENCE
@diagram rm3-evidence-chain
Мера защиты (safeguard) должна быть **достаточно конкретной, чтобы её выполнить**; подтверждение (evidence) — **записью, которую может проверить другой человек**, а не намерением.
| Риск | Конкретная мера защиты | Подтверждение / запись |
|---|---|---|
| участники не знают, что записывается | информационный лист + форма согласия | подписанные формы согласия (версия формы) |
| данных больше, чем нужно вопросу | минимизация; защитная настройка по умолчанию (выключено, opt-in) | журнал аудита настроек / конфигурации |
| личности раскрыты в наборе данных | псевдонимы; ключ хранится отдельно; исходное видео удаляется | журнал обезличивания; запись об удалении |
| несанкционированный доступ | зашифрованное одобренное хранилище; доступ по списку | список доступа и журнал доступа |
| давление, чтобы участвовать | набор и согласие без участия начальника | сценарий набора; журнал согласий |
| исследование без экспертизы | экспертиза этического комитета до сбора | письмо об одобрении с номером |
> Ловушка экзамена: «хранить данные безопасно» — слишком размыто, а «мы будем осторожны» — не подтверждение. Назовите механизм и запись.
## Применение: SafeDrive (кейс пробного квиза)
Приложение следит за водителем через камеру телефона, записывает число сигналов и **геолокацию**, а по умолчанию **непрерывно пишет видео с камеры и геолокацию**, пока водитель не изменит настройку. В исследовании шесть недель участвуют 60 водителей дальнобойных грузовиков.
- **Риск 1 — приватность / защита данных:** непрерывные видео и геолокация по умолчанию собирают гораздо больше, чем нужно вопросу. **Мера:** запись выключена по умолчанию (opt-in); видео обрабатывается на телефоне, хранятся только число и время сигналов. **Подтверждение:** журнал аудита настроек со значениями по умолчанию и изменениями.
- **Риск 2 — информированное и добровольное согласие:** водители могут не понимать, что пишутся видео и геолокация, и чувствовать давление работодателя. **Мера:** информационный лист прямо называет видео и геолокацию; согласие берут исследователи, отказ без последствий. **Подтверждение:** подписанные формы согласия.
- Тоже засчитывается: зашифрованное хранение + журнал доступа; никаких индивидуальных данных работодателю + соглашение о передаче данных; письмо об одобрении этического комитета.
- Study C подкрепляет риск: водители сочли постоянное видеонаблюдение навязчивым, некоторые заклеивали камеру.
?? Почему отдельный ключ «имя — код» — это конфиденциальность, а не анонимность?
?= Через ключ команда всё ещё может связать каждый ответ с человеком; анонимность означает, что разумного способа связать нет.
?? Назовите меру защиты и подтверждение для риска «аудио интервью хранится в общей папке группы».
?= Перенести в зашифрованное хранилище вуза с доступом только для названных исследователей; подтверждение — список доступа или журнал доступа плюс запись об удалении после расшифровки.`,
      },
      [
        qx("A participant signed a consent form, but the form never said that the interview would be audio-recorded. What is the problem?", "Consent does not cover what actually happens to the data", [
          ["Nothing — the signature alone makes the consent fully valid", "Consent is a process, not a signature: it must match the real data use, including the recording.", "Согласие — процесс, а не подпись: оно должно соответствовать реальному использованию данных, включая запись."],
          ["The study needed anonymity rather than consent", "Anonymity does not replace consent, and a recorded voice is hardly anonymous anyway.", "Анонимность не заменяет согласие, да и записанный голос трудно назвать анонимным."],
          ["Recording is fine if the audio is deleted later", "Deleting later does not replace permission before recording.", "Последующее удаление не заменяет разрешения до записи."],
        ], "Recording an interview needs explicit disclosure and permission; consent must match what will actually happen to the data.", "Запись интервью требует явного предупреждения и разрешения; согласие должно соответствовать тому, что реально произойдёт с данными."),
        qx("A lecturer asks her own students to fill in a research survey during class time. Which element of consent is most at risk?", "Choosing freely without pressure", [
          ["Understanding the study's purpose", "The purpose can be explained well; the issue is the power relation between lecturer and students.", "Цель можно объяснить хорошо; проблема — в отношениях власти между преподавателем и студентами."],
          ["Having a contact for complaints", "A contact can be given easily; it does not remove the pressure.", "Контакт легко указать, но давление он не снимает."],
          ["Knowing how results are analysed", "Analysis methods are not one of the four consent elements.", "Метод анализа не входит в четыре элемента согласия."],
        ], "Voluntariness is at risk when the researcher has power over participants (teacher–student, employer–employee). Recruitment by someone else or an anonymous online form reduces the pressure.", "Добровольность под угрозой, когда у исследователя есть власть над участниками (преподаватель — студент, работодатель — сотрудник). Набор через третье лицо или анонимная онлайн-форма снижают давление."),
        qx("Interviewees appear as P01–P12 in the transcripts; the name–code key is kept in a separate locked file. What is the accurate privacy term?", "Confidential, pseudonymised data", [
          ["Anonymous data, since no names appear", "While the key exists, every code can be linked back to a person — that is not anonymity.", "Пока ключ существует, каждый код можно связать с человеком — это не анонимность."],
          ["Public data, since codes are not personal", "Codes linked to a key are still personal data; nothing here is public.", "Коды, связанные с ключом, остаются персональными данными; ничего публичного здесь нет."],
          ["Aggregated data, since only codes remain", "Aggregation means group-level figures; these are individual transcripts.", "Агрегирование — это данные по группе; здесь индивидуальные расшифровки."],
        ], "Pseudonyms reduce exposure but do not create anonymity: the team can still re-identify people through the key.", "Псевдонимы снижают риск, но не создают анонимность: через ключ команда всё ещё может опознать людей."),
        qx("Which design makes survey responses genuinely anonymous?", "A form that never collects names, emails or IP addresses", [
          ["Names replaced by codes, with the key kept by the supervisor", "A key means the responses can be re-linked: that is pseudonymisation.", "Ключ позволяет снова связать ответы с людьми: это псевдонимизация."],
          ["Names stored only on an encrypted university drive", "Encryption protects confidentiality; the identities are still known.", "Шифрование защищает конфиденциальность; личности по-прежнему известны."],
          ["Answers shown only as group averages in the paper", "Reporting averages protects the publication, but the team's dataset still identifies people.", "Средние по группе защищают публикацию, но набор данных команды по-прежнему опознаёт людей."],
        ], "Anonymity means the researcher cannot reasonably link a response to a person — the safest way is never to collect identifiers.", "Анонимность — исследователь не может разумным способом связать ответ с человеком; надёжнее всего вообще не собирать идентификаторы."),
        qx("A survey promises “fully anonymous” answers but collects university emails to send reminders. Which principle is broken?", "Never promise a protection the workflow cannot deliver", [
          ["Store all data only in an institution-approved location", "Storage may be fine; the problem is the false promise of anonymity.", "Хранение может быть в порядке; проблема — ложное обещание анонимности."],
          ["Report changes after approval as an amendment", "No change after approval is described in the case.", "В этом случае нет изменения после одобрения."],
          ["Keep the data only for a justified retention period", "Retention is not the issue; emails make the answers identifiable.", "Дело не в сроке хранения: почта делает ответы опознаваемыми."],
        ], "With emails attached, answers are at best confidential; promising anonymity misleads participants.", "Если к ответам привязана почта, они в лучшем случае конфиденциальны; обещание анонимности вводит участников в заблуждение."),
        qx("A study only needs to know how often a drowsiness alert fires, but the app also stores full camera video. Which principle is violated?", "Data minimisation: collect only what the question needs", [
          ["Retention: keep the recordings only for a justified period", "Retention matters later; the first problem is collecting the video at all.", "Срок хранения важен потом; первая проблема — само собирание видео."],
          ["Access: name the people who may open the data", "Access control is useful but does not justify collecting unnecessary data.", "Контроль доступа полезен, но не оправдывает сбор лишних данных."],
          ["Withdrawal: give participants a clear way out", "Withdrawal is a consent element; it does not limit what is collected.", "Выход из исследования — элемент согласия; он не ограничивает объём сбора."],
        ], "The Collect stage of the lifecycle allows only what the research question needs; alert counts do not require stored video.", "Стадия Collect допускает только то, что нужно исследовательскому вопросу; для числа сигналов хранить видео не нужно."),
        qx("At which data-lifecycle stage do you name the people and roles allowed to open the data?", "Access", [
          ["Store", "Store is about where the data are kept (an encrypted, approved location).", "Store — о том, где хранятся данные (зашифрованное, одобренное место)."],
          ["Retain", "Retain is about how long the data are kept.", "Retain — о том, как долго хранятся данные."],
          ["Collect", "Collect is about which data are gathered at all.", "Collect — о том, какие данные вообще собираются."],
        ], "Collect → Store → Access → Retain → Delete/Share: Access means named people and roles.", "Collect → Store → Access → Retain → Delete/Share: Access — это названные люди и роли."),
        qx("Which retention and deletion plan is acceptable?", "Delete raw audio once transcripts are checked, and record the date", [
          ["Keep all the recordings indefinitely in case they become useful later", "Indefinite storage of identifiable data has no justification.", "Бессрочное хранение опознаваемых данных ничем не обосновано."],
          ["Keep the recordings on a personal phone until graduation day", "A personal phone is not approved storage, and the period is not justified by the research.", "Личный телефон — не одобренное хранилище, а срок не обоснован исследованием."],
          ["Let each team member decide when to delete their own copy", "Uncontrolled copies and no record of deletion break the lifecycle plan.", "Неконтролируемые копии и отсутствие записи об удалении ломают план жизненного цикла."],
        ], "Retain for a justified period, then delete by a defined method and keep a record of when it happened.", "Хранить обоснованный срок, затем удалить определённым способом и записать, когда это сделано."),
        qx("A student quotes public forum posts word for word in a paper, with the usernames removed. Which risk remains?", "A search for the quote can lead back to its author", [
          ["None, because public posts carry no ethical risk", "Public is not ethically simple: expectations and sensitivity still matter.", "Публичное не значит этически простое: ожидания и чувствительность по-прежнему важны."],
          ["The quotes turn into fabricated data without names", "The quotes are real; removing names does not invent anything.", "Цитаты реальны; удаление имён ничего не выдумывает."],
          ["Removing usernames makes the quotes plagiarism", "Plagiarism is about missing attribution of sources, not about protecting participants.", "Плагиат — о неуказанных источниках, а не о защите участников."],
        ], "Verbatim quotes are searchable, so they can re-identify people even without usernames; paraphrasing or combining quotes reduces the risk.", "Дословные цитаты находятся поиском, поэтому могут раскрыть людей и без имён; пересказ или объединение цитат снижает риск."),
        qx("A platform's terms allow automated collection of public profiles. Does this settle the ethics of scraping them for a study?", "No — expectations, sensitivity and presentation still matter", [
          ["Yes — legal permission is the same thing as ethical approval", "Legal access and ethical use are related but different questions.", "Законный доступ и этичное использование — связанные, но разные вопросы."],
          ["Yes, provided the scraped data are kept on an encrypted drive", "Secure storage is one safeguard; it does not answer whether the use is ethical.", "Защищённое хранение — одна из мер; оно не отвечает на вопрос, этично ли использование."],
          ["No — scraping is always forbidden in student research projects", "The lecture asks for checks and safeguards, not a blanket ban.", "Лекция требует проверок и мер защиты, а не полного запрета."],
        ], "Platform terms are only one of four checks: expectations, sensitivity, platform terms and presentation.", "Условия платформы — лишь одна из четырёх проверок: ожидания, чувствительность, условия платформы и подача."),
        qx("After ethics approval, the team decides to add location tracking to the app. What should happen?", "Report the change and get an amendment before collecting", [
          ["Continue, because the study has already been approved", "Approval covers only the study as it was described.", "Одобрение распространяется только на описанное исследование."],
          ["Mention the change in the limitations of the final paper", "Reporting it afterwards does not give permission to collect.", "Сообщение постфактум не даёт разрешения на сбор."],
          ["Collect the data first, then ask whether it is allowed", "That reverses the rule: pause before collecting data.", "Это переворачивает правило: остановиться нужно до сбора данных."],
        ], "Change after approval → report → seek an amendment before proceeding.", "Изменение после одобрения → сообщить → получить поправку до продолжения."),
        qx("Which record best shows that a study was reviewed by an ethics committee?", "An approval letter with a reference number", [
          ["A sentence in the method saying the study is ethical", "A self-declaration is an intention, not evidence of review.", "Самодекларация — это намерение, а не подтверждение экспертизы."],
          ["A supervisor's verbal OK given during a class", "A verbal OK leaves no record and is not the formal route.", "Устное «да» не оставляет записи и не является формальной процедурой."],
          ["A list of all participants with their full names", "This is personal data, not proof of review — and it creates a new risk.", "Это персональные данные, а не подтверждение экспертизы, — и новый риск."],
        ], "The formal route is decided by the local ethics committee; its approval letter (and any amendments) is the evidence.", "Формальный путь определяет местный этический комитет; подтверждение — его письмо об одобрении (и поправки)."),
        qx("On the five-line ethics card, what belongs on the EVIDENCE line?", "The consent, approval or record that proves the safeguard", [
          ["The kinds of data that the study will collect from participants", "That is the DATA line.", "Это строка DATA."],
          ["The people who could be affected by the study", "That is the PEOPLE line.", "Это строка PEOPLE."],
          ["What could go wrong if nothing is done about it", "That is the RISK line.", "Это строка RISK."],
        ], "DATA · PEOPLE · RISK · SAFEGUARD · EVIDENCE — evidence is what proves the safeguard was applied.", "DATA · PEOPLE · RISK · SAFEGUARD · EVIDENCE — подтверждение доказывает, что мера применена."),
        qx("Which safeguard is specific enough to perform and to check?", "Audio on the encrypted university drive, open to two named researchers", [
          ["All the data will be handled responsibly and securely by the team", "Too vague: no mechanism, no place, no people.", "Слишком размыто: нет механизма, места и людей."],
          ["The team will follow good ethical practice throughout the study", "A general intention, not an operational safeguard.", "Общее намерение, а не выполнимая мера."],
          ["Everyone in the project group promises to be careful with the recordings", "A promise is not a mechanism, and it leaves no record.", "Обещание — не механизм и не оставляет записи."],
        ], "A safeguard names the mechanism, the place and the people; then it can produce a record (an access list or log).", "Мера защиты называет механизм, место и людей; тогда она даёт запись (список или журнал доступа)."),
        qx("SafeDrive continuously records video and location unless the driver changes the default setting. What category of risk is this?", "An ethical and data-protection risk", [
          ["A feasibility and computing-resource risk", "Storage costs may grow, but the core problem is intrusion into drivers' privacy.", "Затраты на хранение могут вырасти, но главная проблема — вторжение в приватность водителей."],
          ["A topic-framing and scope risk", "Topic framing concerns the question (“AI for Road Safety”), not the data collected.", "Формулировка темы касается вопроса («AI for Road Safety»), а не собираемых данных."],
          ["A grammar and style risk", "Nothing in the default setting is about writing.", "Настройка по умолчанию никак не связана с текстом."],
        ], "Continuous, identifiable video and location by default collect more than the study needs and intrude on privacy — an ethical and data-protection risk.", "Непрерывные опознаваемые видео и геолокация по умолчанию собирают больше, чем нужно, и вторгаются в приватность — это этический риск и риск защиты данных."),
        qx("Which safeguard directly addresses SafeDrive's default recording?", "Make recording opt-in and store only alert counts and times", [
          ["Mention privacy briefly in the limitations section of the paper", "Writing about a risk is not a safeguard; the recording continues.", "Написать о риске — не мера защиты; запись продолжается."],
          ["Recruit more drivers so that each person's data matter less", "A bigger sample does not reduce what is recorded about each driver.", "Большая выборка не уменьшает того, что записывается о каждом водителе."],
          ["Ask drivers to cover the camera whenever they want privacy", "It shifts the burden to drivers and breaks drowsiness detection — Study C shows this already happens.", "Это перекладывает бремя на водителей и ломает распознавание сонливости — Study C показывает, что так уже бывает."],
        ], "Data minimisation and a privacy-protective default: collect only what the question needs (alert counts and times).", "Минимизация и защитная настройка по умолчанию: собирать только то, что нужно вопросу (число и время сигналов)."),
        qx("Which record would show that SafeDrive's opt-in default was actually applied?", "A settings audit log of default values and each change", [
          ["The promise of privacy written in the proposal text", "A promise states intent; it does not show what the app did.", "Обещание выражает намерение и не показывает, что делало приложение."],
          ["A screenshot of the app's page in the online app store", "Store marketing text is not a record of the study's configuration.", "Рекламный текст магазина — не запись о конфигурации исследования."],
          ["The total number of alerts recorded per driver", "Alert counts are study data; they say nothing about the recording default.", "Число сигналов — данные исследования; о настройке записи они ничего не говорят."],
        ], "Evidence must be a record someone else could inspect: an audit log shows the default and every change.", "Подтверждение — запись, которую может проверить другой человек: журнал аудита показывает значение по умолчанию и каждое изменение."),
        qx("Which answer gives a complete risk → safeguard → evidence chain?", "Drivers unaware of recording → info sheet and consent form → signed consent records", [
          ["Drivers unaware of recording → info sheet and consent form → drivers will understand", "The last link is an expectation, not a record anyone could inspect.", "Последнее звено — ожидание, а не запись, которую можно проверить."],
          ["Video is intrusive → store the data securely → the team follows good practice", "Both the safeguard and the evidence are too vague to perform or check.", "И мера, и подтверждение слишком размыты, чтобы их выполнить или проверить."],
          ["Location is sensitive → discuss it in the paper → a paragraph on limitations", "Discussing a risk does not reduce it, and a paragraph is not evidence of a safeguard.", "Обсуждение риска его не снижает, а абзац — не подтверждение меры."],
        ], "Each link must be concrete: a named risk, an operational safeguard and a record that shows it was applied.", "Каждое звено конкретно: названный риск, выполнимая мера и запись, показывающая, что мера применена."),
        qx("In SafeDrive, who should collect drivers' consent to protect voluntariness?", "The research team, independently of the drivers' employer", [
          ["The drivers' employer, since it knows all of the drivers best", "Consent collected by the boss creates exactly the pressure to avoid.", "Согласие, собранное начальником, создаёт именно то давление, которого нужно избежать."],
          ["The app itself, through a pop-up drivers can skip", "A skippable pop-up does not ensure that drivers understand the video and location use.", "Всплывающее окно, которое можно пропустить, не обеспечивает понимания записи видео и геолокации."],
          ["Nobody, because the app data are anonymous anyway", "Video and location traces are identifiable, so the data are not anonymous.", "Видео и треки геолокации опознаваемы, так что данные не анонимны."],
        ], "Choosing must be free of pressure: researchers take consent, and refusal has no consequences at work.", "Выбор должен быть свободным: согласие берут исследователи, а отказ не влечёт последствий на работе."),
        tfx("Pseudonymised data are no longer personal data, so data-protection rules stop applying.", false,
          "False: while a key can re-link codes to people, pseudonymised data remain personal data and must be protected.",
          "Неверно: пока ключ позволяет связать коды с людьми, псевдонимизированные данные остаются персональными и требуют защиты.",
          "“True” confuses pseudonymisation with anonymisation; only irreversible de-identification takes data out of scope.",
          "Ответ «верно» путает псевдонимизацию с анонимизацией; только необратимое обезличивание выводит данные из-под этих правил."),
      ],
    ),
    part(
      "rm-l3-p3",
      { en: "Verifying sources and using AI responsibly", ru: "Проверка источников и ответственная работа с ИИ" },
      {
        en: `## A reference must exist before it can support a claim
| Check | Question | How |
|---|---|---|
| Identity | Is it the same work? | match title, authors, year and venue across records |
| Traceability | Can others find it? | a DOI, a publisher page or a stable repository record |
| Fitness | Can it support this claim? | read the method and result, not only the title or abstract |
> Verification answers existence. Evaluation answers quality and relevance. A real paper can still be weak or irrelevant; an impressive citation can still be fabricated.
## The verification ladder
@diagram rm3-verify-ladder
- **1 READ** — the title and abstract match the topic.
- **2 MATCH** — find the publisher or trusted repository record (journal site, ACM Digital Library, IEEE Xplore, arXiv), not just a line in someone's reference list.
- **3 RESOLVE** — open the DOI or search Crossref Metadata Search (search.crossref.org) by title, author or DOI; the metadata must match.
- **4 CHECK** — corrections, retractions, expressions of concern and the version (preprint or published).
- **5 OPEN** — the method and result actually support your claim.
= VERIFIED: record link + matched metadata + date checked · UNRESOLVED: do not cite as confirmed evidence
## A DOI is an identifier, not a quality badge
= https://doi.org/10.<prefix>/<suffix>
| A DOI can help | A DOI cannot prove |
|---|---|
| resolve to a stable record | a sound method |
| match metadata | ethical conduct |
| distinguish versions | relevance to your claim |
| support traceability | absence of a later correction |
- A **missing DOI is not a missing source**: books, theses, standards and some conference papers may only have a stable publisher or repository record.
- A DOI that **does not resolve, or resolves to a different paper**, is a red flag: the reference is mixed up or invented.
## Corrections and retractions
- **Correction** (erratum, corrigendum) — the paper stands, but something in it was fixed; read the notice.
- **Expression of concern** — the journal warns that a problem is being investigated.
- **Retraction** — the paper is withdrawn (serious error, fabrication, plagiarism). Do not use it as evidence; mention it only as a retracted study, clearly marked.
- Where to look: the article page (the notice, the Crossmark status button) and the Retraction Watch Database, now openly available through Crossref.
## Predatory journals
They charge publication fees but skip real peer review. Warning signs:
- invitation spam; acceptance promised within days; a scope like "all of engineering and medicine";
- invented metrics; indexing in Scopus, Web of Science or DOAJ that the index's own site does not confirm;
- an editorial board you cannot verify; a title that imitates a well-known journal.
Check the journal on the index's own website and use the Think. Check. Submit. checklist.
> Exam trap: a DOI does not make a journal legitimate — predatory journals register DOIs too.
## AI-suggested references
Generative AI can produce **plausible but non-existent references**: real authors with an invented title, a real title with the wrong year or venue, a DOI that leads nowhere or to another paper.
- SafeDrive: the literature folder holds AI-suggested records, some with no DOI and never opened → the risk of **citing fabricated, unverified sources**.
- Safeguard: run the ladder on every record before it enters the paper. Evidence: a **verification log** — record link, matched metadata, retraction check, date, verified / unresolved.
## Use AI for support, never as invisible evidence
| Defensible support | Unacceptable substitution |
|---|---|
| search-term candidates | inventing or citing unopened sources |
| explaining unfamiliar terminology | fabricating data or results |
| improving grammar after you wrote the text | hiding substantial generated text |
| challenging a draft argument | uploading protected data without permission |
| suggesting checks to perform | bypassing course rules |
## The AI verification contract
- **NO SOURCE** — no generated reference enters the paper until it is opened.
- **NO CLAIM** — no generated factual claim stays without evidence.
- **NO SECRET DATA** — no participant or protected data goes into an unapproved tool.
- **NO HIDDEN ROLE** — required AI use is disclosed according to course rules.
The student stays responsible for every source, claim and sentence. The syllabus allows AI for learning only with the instructor's permission and prohibits it in exams and restricted assessments unless authorised.
?? An AI-suggested DOI opens a paper with a different title and authors. Is the reference verified?
?= No — identity fails. Mark it unresolved, search Crossref by title and authors, and cite only a record whose metadata match.
?? Why is "it has a DOI" not enough to trust a paper?
?= A DOI only identifies a work. It says nothing about method quality, relevance, ethics or a later retraction, and predatory journals have DOIs too.`,
        ru: `## Ссылка должна существовать, прежде чем подкреплять утверждение
| Проверка | Вопрос | Как |
|---|---|---|
| Identity (тождество) | Это та самая работа? | сверить название, авторов, год и издание по разным записям |
| Traceability (прослеживаемость) | Смогут ли другие её найти? | DOI, страница издателя или стабильная запись репозитория |
| Fitness (пригодность) | Может ли она подтвердить именно это утверждение? | прочитать метод и результат, а не только название и аннотацию |
> Верификация отвечает на вопрос о существовании. Оценка — о качестве и релевантности. Настоящая статья может быть слабой или не по теме; впечатляющая ссылка может оказаться выдуманной.
## Лестница проверки
@diagram rm3-verify-ladder
- **1 READ** — название и аннотация соответствуют теме.
- **2 MATCH** — найти запись издателя или надёжного репозитория (сайт журнала, ACM Digital Library, IEEE Xplore, arXiv), а не только строку в чужом списке литературы.
- **3 RESOLVE** — открыть DOI или найти работу в Crossref Metadata Search (search.crossref.org) по названию, автору или DOI; метаданные должны совпасть.
- **4 CHECK** — исправления, отзывы (retractions), выражения обеспокоенности и версия (препринт или опубликованная).
- **5 OPEN** — метод и результат действительно подтверждают ваше утверждение.
= VERIFIED: record link + matched metadata + date checked · UNRESOLVED: do not cite as confirmed evidence
## DOI — идентификатор, а не знак качества
= https://doi.org/10.<prefix>/<suffix>
| DOI помогает | DOI не доказывает |
|---|---|
| привести к стабильной записи | корректность метода |
| сверить метаданные | этичность исследования |
| различить версии | релевантность вашему утверждению |
| обеспечить прослеживаемость | отсутствие более поздних исправлений |
- **Нет DOI — не значит нет источника:** у книг, диссертаций, стандартов и части докладов конференций может быть только стабильная запись издателя или репозитория.
- DOI, который **не открывается или ведёт на другую статью**, — тревожный сигнал: ссылка перепутана или выдумана.
## Исправления и отзывы статей
- **Correction (исправление)** (erratum, corrigendum) — статья остаётся в силе, но что-то в ней исправлено; прочитайте уведомление.
- **Expression of concern (выражение обеспокоенности)** — журнал предупреждает, что проблема расследуется.
- **Retraction (отзыв)** — статья отозвана (серьёзная ошибка, фабрикация, плагиат). Не используйте её как доказательство; упоминать можно только как отозванное исследование, с явной пометкой.
- Где смотреть: страница статьи (уведомление, кнопка статуса Crossmark) и Retraction Watch Database, теперь открытая через Crossref.
## Хищнические журналы (predatory journals)
Они берут плату за публикацию, но пропускают настоящее рецензирование. Тревожные признаки:
- рассылки-приглашения; приём обещают за несколько дней; тематика вроде «вся инженерия и медицина»;
- выдуманные метрики; индексация в Scopus, Web of Science или DOAJ, которую не подтверждает сайт самого индекса;
- редколлегию невозможно проверить; название подражает известному журналу.
Проверяйте журнал на сайте самого индекса и пользуйтесь чек-листом Think. Check. Submit.
> Ловушка экзамена: DOI не делает журнал добросовестным — хищнические журналы тоже регистрируют DOI.
## Ссылки, предложенные ИИ
Генеративный ИИ может выдавать **правдоподобные, но несуществующие ссылки**: настоящие авторы с выдуманным названием, настоящее название с неверным годом или изданием, DOI, который никуда не ведёт или ведёт на другую статью.
- SafeDrive: в папке литературы лежат записи, предложенные ИИ, часть без DOI и ни разу не открытые → риск **сослаться на выдуманные, непроверенные источники**.
- Мера: пройти лестницу по каждой записи до того, как она попадёт в работу. Подтверждение: **журнал проверки (verification log)** — ссылка на запись, совпавшие метаданные, проверка на отзыв, дата, «проверен / не подтверждён».
## ИИ — для помощи, но не как невидимое доказательство
| Допустимая помощь | Недопустимая подмена |
|---|---|
| варианты поисковых слов | выдумывать источники или ссылаться на неоткрытые |
| объяснение незнакомых терминов | фабриковать данные или результаты |
| правка грамматики уже написанного вами текста | скрывать существенный сгенерированный текст |
| критика черновика аргумента | загружать защищённые данные без разрешения |
| подсказки, что проверить | обходить правила курса |
## Контракт проверки ИИ
- **NO SOURCE** — сгенерированная ссылка не попадает в работу, пока её не открыли.
- **NO CLAIM** — сгенерированное фактическое утверждение не остаётся без доказательства.
- **NO SECRET DATA** — данные участников и защищённые данные не попадают в неодобренный инструмент.
- **NO HIDDEN ROLE** — требуемое раскрытие использования ИИ делается по правилам курса.
За каждый источник, утверждение и предложение отвечает студент. Силлабус разрешает ИИ для учёбы только с разрешения преподавателя и запрещает его на экзаменах и в ограниченных заданиях, если это прямо не разрешено.
?? DOI из ссылки, предложенной ИИ, открывает статью с другим названием и авторами. Ссылка проверена?
?= Нет — не прошла проверка тождества. Пометить как неподтверждённую, искать в Crossref по названию и авторам и цитировать только запись с совпадающими метаданными.
?? Почему «у неё есть DOI» недостаточно, чтобы доверять статье?
?= DOI только идентифицирует работу. Он ничего не говорит о качестве метода, релевантности, этике или позднем отзыве, а у хищнических журналов DOI тоже есть.`,
      },
      [
        qx("A real paper with a DOI studied car commuters in 1995; you want it to support a claim about truck drivers using a drowsiness app today. Which check fails?", "Fitness — it cannot support this exact claim", [
          ["Identity — it is not the same work that was cited", "The title, authors and year may all match; the work is real and correctly identified.", "Название, авторы и год могут совпадать; работа настоящая и опознана верно."],
          ["Traceability — others cannot find the work", "It has a DOI, so it is traceable.", "У неё есть DOI, значит, она прослеживаема."],
          ["Existence — the paper was probably invented", "The paper exists; the problem is relevance, not existence.", "Статья существует; проблема в релевантности, а не в существовании."],
        ], "Verification answers existence; fitness asks whether the method and result can support this claim — a different population and context cannot.", "Верификация отвечает на вопрос о существовании; пригодность — могут ли метод и результат подтвердить именно это утверждение; другая популяция и контекст не могут."),
        qx("Which check confirms that the record you found is the same work as the reference in your list?", "Identity: the title, authors, year and venue match", [
          ["Traceability: the work has a DOI or a stable record", "Traceability shows the work can be found, not that it is the one you cited.", "Прослеживаемость показывает, что работу можно найти, а не что это та самая работа."],
          ["Fitness: the method and result support the claim", "Fitness is about relevance and is checked after identity.", "Пригодность — о релевантности; её проверяют после тождества."],
          ["Evaluation: the journal has a high impact factor", "Journal metrics say nothing about whether this record is the cited work.", "Метрики журнала ничего не говорят о том, та ли это работа."],
        ], "Identity means matching the title, authors, year and venue across records.", "Тождество — совпадение названия, авторов, года и издания в разных записях."),
        qx("On the verification ladder, which step comes right after MATCH?", "RESOLVE — open the DOI or the Crossref metadata", [
          ["READ — the title and abstract fit the topic", "READ is the first step, before MATCH.", "READ — первая ступень, до MATCH."],
          ["OPEN — the method and the result support the claim", "OPEN is the last step.", "OPEN — последняя ступень."],
          ["CHECK — corrections, retractions and version", "CHECK comes after RESOLVE.", "CHECK идёт после RESOLVE."],
        ], "READ → MATCH → RESOLVE → CHECK → OPEN.", "READ → MATCH → RESOLVE → CHECK → OPEN."),
        qx("You read version 1 of an arXiv preprint; a peer-reviewed journal version with revised results appeared later. What should the CHECK step lead you to do?", "Read the published version; cite the version you relied on", [
          ["Cite v1, because the first version is always the true original", "The first version may contain results that were later corrected.", "В первой версии могут быть результаты, которые позже исправили."],
          ["Cite both versions as two independent supporting studies", "They are one study in two versions; counting it twice inflates the evidence.", "Это одно исследование в двух версиях; считать его дважды — раздувать доказательства."],
          ["Ignore versions, since all versions share a single DOI", "The journal version has its own DOI; DOIs help distinguish versions.", "У журнальной версии свой DOI; DOI как раз помогает различать версии."],
        ], "CHECK covers corrections, retractions and the version; results can change between preprint and publication.", "CHECK охватывает исправления, отзывы и версию; результаты могут меняться между препринтом и публикацией."),
        qx("A conference paper has no DOI, but a university repository holds a stable record whose metadata match. What follows?", "It can be verified through the stable repository record", [
          ["It must be dropped, because every real paper has a DOI", "Books, theses and some conference papers have no DOI; a missing DOI is not a missing source.", "У книг, диссертаций и части докладов нет DOI; нет DOI — не значит нет источника."],
          ["It counts as verified only if Mendeley imports it cleanly", "Mendeley stores records; it does not verify them.", "Mendeley хранит записи, но не проверяет их."],
          ["It should be cited with a DOI from a similar paper", "Borrowing another paper's DOI fabricates a reference.", "Чужой DOI превращает ссылку в выдуманную."],
        ], "Traceability can come from a DOI, a publisher page or a stable repository record.", "Прослеживаемость обеспечивают DOI, страница издателя или стабильная запись репозитория."),
        qx("An AI-suggested reference has a DOI, but the DOI opens a paper with a different title and authors. What should you do?", "Mark it unresolved; search Crossref by title and authors", [
          ["Cite it anyway, because the DOI resolves to a real paper", "Resolving is not enough: the metadata must match the reference.", "Открыться мало: метаданные должны совпадать со ссылкой."],
          ["Cite the paper the DOI opens, under the AI's title", "That mixes two works into a reference that matches neither.", "Так получается ссылка-гибрид, не совпадающая ни с одной работой."],
          ["Delete the DOI but keep the rest of the reference as it is", "Removing the DOI hides the mismatch; the work may not exist at all.", "Удаление DOI прячет несовпадение; работы может вообще не быть."],
        ], "Identity fails, so the source is unresolved: search by title and authors and cite only a record whose metadata match.", "Тождество не подтверждено, значит, источник не проверен: искать по названию и авторам и цитировать только совпадающую запись."),
        qx("Which of these can a DOI NOT tell you?", "Whether the method of the study is sound", [
          ["Where the stable record of the work is", "Resolving to a stable record is exactly what a DOI does.", "Привести к стабильной записи — именно то, что делает DOI."],
          ["Which version of the work you are citing", "DOIs help distinguish versions.", "DOI помогает различать версии."],
          ["Whether your metadata match the record", "Matching metadata against the DOI record is one of its uses.", "Сверка метаданных с записью DOI — одно из его применений."],
        ], "A DOI is an identifier, not a quality badge: it cannot prove the method, ethics, relevance or the absence of a later correction.", "DOI — идентификатор, а не знак качества: он не доказывает метод, этичность, релевантность и отсутствие поздних исправлений."),
        qx("Which service lets you search registered DOI metadata by title, author or DOI?", "Crossref Metadata Search", [
          ["Mendeley Cite for Word", "Mendeley Cite inserts citations; it is not a DOI registry.", "Mendeley Cite вставляет ссылки; это не реестр DOI."],
          ["A Turnitin similarity report", "Turnitin checks text overlap, not reference metadata.", "Turnitin проверяет совпадения текста, а не метаданные ссылок."],
          ["The Think. Check. Submit. list", "That checklist helps judge journals; it does not resolve DOIs.", "Этот чек-лист помогает оценить журнал, но не открывает DOI."],
        ], "Crossref Metadata Search (search.crossref.org) is used at the RESOLVE step.", "Crossref Metadata Search (search.crossref.org) используется на ступени RESOLVE."),
        qx("The publisher page of a paper you planned to cite shows a retraction notice. How can you use the paper?", "Only as a clearly marked retracted example, not as evidence", [
          ["As evidence, if the paper still has a valid DOI and many citations", "Citations and a DOI do not undo a retraction.", "Цитирования и DOI не отменяют отзыв."],
          ["As evidence, if you cite the preprint version instead", "The preprint carries the same withdrawn findings.", "В препринте те же отозванные результаты."],
          ["As evidence, if the retraction happened years ago", "Time does not restore a withdrawn paper.", "Время не восстанавливает отозванную статью."],
        ], "A retraction withdraws the paper; do not use it to support claims.", "Отзыв означает, что статья снята; опираться на неё в утверждениях нельзя."),
        qx("What is the difference between a correction and a retraction?", "A correction fixes part of a paper; a retraction withdraws it", [
          ["A correction comes from authors; a retraction comes from readers", "Both are issued by the journal or publisher (often with the authors).", "Оба выпускает журнал или издатель (часто вместе с авторами)."],
          ["A correction removes the DOI; a retraction keeps the paper valid", "Neither removes the DOI, and a retraction means the paper is not valid evidence.", "Ни то, ни другое не удаляет DOI, а отзыв означает, что статья не годится как доказательство."],
          ["They are two names for the same kind of publisher notice", "They differ: the corrected paper stands, the retracted one does not.", "Они различаются: исправленная статья остаётся в силе, отозванная — нет."],
        ], "Correction (erratum/corrigendum): the paper stands with a fix. Retraction: the paper is withdrawn.", "Исправление (erratum/corrigendum): статья остаётся с поправкой. Отзыв: статья снята."),
        qx("A journal emails you: “Publication within 72 hours after payment, all topics welcome.” What does this suggest?", "Warning signs of a predatory journal", [
          ["A fast but rigorous peer-review process", "Real peer review cannot be done in 72 hours for any topic.", "Настоящее рецензирование по любой теме за 72 часа невозможно."],
          ["A journal indexed in Scopus and DOAJ", "Nothing in the email shows indexing; claims must be checked on the index's own site.", "Письмо не доказывает индексацию; её проверяют на сайте самого индекса."],
          ["A high-quality open-access journal", "Open access is legitimate, but speed for payment and an unlimited scope are red flags.", "Открытый доступ законен, но скорость за плату и безграничная тематика — тревожные сигналы."],
        ], "Spam invitations, acceptance within days and an unlimited scope are classic predatory signs.", "Рассылки, приём за дни и безграничная тематика — классические признаки хищнического журнала."),
        qx("A journal's homepage displays a Scopus logo. How do you verify the indexing claim?", "Look the journal up on the Scopus source list", [
          ["Trust the logo, as journals cannot use it falsely", "Predatory journals often display logos and metrics they do not have.", "Хищнические журналы часто показывают логотипы и метрики, которых у них нет."],
          ["Check that the journal's articles have DOIs", "Predatory journals can register DOIs too.", "Хищнические журналы тоже могут регистрировать DOI."],
          ["Count how many articles it publishes a year", "Volume says nothing about indexing — a flood of papers is itself a warning sign.", "Объём ничего не говорит об индексации, а поток статей сам по себе тревожный признак."],
        ], "Claimed indexing must be confirmed on the index's own website.", "Заявленную индексацию подтверждают на сайте самого индекса."),
        tfx("A DOI proves that the journal publishing the paper is legitimate.", false,
          "False: a DOI only identifies a work; predatory journals can register DOIs too.",
          "Неверно: DOI лишь идентифицирует работу; хищнические журналы тоже могут регистрировать DOI.",
          "“True” treats an identifier as a quality badge — exactly the confusion the lecture warns about.",
          "Ответ «верно» принимает идентификатор за знак качества — именно об этой путанице предупреждает лекция."),
        qx("The SafeDrive literature folder holds records suggested by a generative AI tool, some with no DOI and never opened. What risk does this create?", "The risk of citing fabricated, unverified sources", [
          ["There is no risk at all if the topics look relevant", "Relevant-looking titles are exactly what invented references look like.", "Правдоподобные названия — именно так и выглядят выдуманные ссылки."],
          ["The risk that the articles will be too recent", "Recency is not the problem; existence and accuracy are.", "Проблема не в новизне, а в существовании и точности."],
          ["The risk that DOIs are unnecessary for papers", "This is not a risk, and a missing DOI is a reason to verify, not to relax.", "Это не риск, а отсутствие DOI — повод проверить, а не расслабиться."],
        ], "Unopened AI-suggested records may be invented or mixed up; citing them risks fabricated references.", "Неоткрытые записи от ИИ могут быть выдуманы или перепутаны; ссылаться на них — риск фабрикации ссылок."),
        qx("Which record shows that the AI-suggested sources in SafeDrive were actually checked?", "A verification log with record links, matched metadata and dates", [
          ["A short note saying that the AI tool is usually quite reliable", "An opinion about the tool is not evidence that each record was checked.", "Мнение об инструменте — не подтверждение проверки каждой записи."],
          ["The total number of records saved in the literature folder", "A count says nothing about whether any record exists.", "Количество ничего не говорит о том, существует ли хоть одна запись."],
          ["An AI-generated summary of every record in the literature folder", "A summary from the same tool can repeat the same invention.", "Сводка от того же инструмента может повторить ту же выдумку."],
        ], "Evidence is a record someone else could inspect: each source with its link, matched metadata, retraction check, date and status.", "Подтверждение — запись, которую можно проверить: каждый источник со ссылкой, совпавшими метаданными, проверкой на отзыв, датой и статусом."),
        qx("Which use of AI is defensible support in a research project?", "Generating candidate search terms for a database", [
          ["Citing a paper the AI summarised without opening it", "That breaks NO SOURCE: the reference must be opened.", "Это нарушает NO SOURCE: ссылку нужно открыть."],
          ["Letting the AI fill in missing survey answers", "That is fabrication of data.", "Это фабрикация данных."],
          ["Pasting interview transcripts into a public chatbot", "That breaks NO SECRET DATA.", "Это нарушает NO SECRET DATA."],
        ], "Support helps your thinking (search terms, terminology, grammar after writing, challenging an argument, suggesting checks); substitution replaces evidence or authorship.", "Помощь поддерживает мышление (поисковые слова, термины, грамматика после написания, критика аргумента, подсказки проверок); подмена заменяет доказательства или авторство."),
        qx("A student pastes interview transcripts with participants' names into a public AI chatbot to get a summary. Which rule of the verification contract is broken?", "NO SECRET DATA", [
          ["NO SOURCE", "NO SOURCE is about unopened generated references.", "NO SOURCE — о неоткрытых сгенерированных ссылках."],
          ["NO CLAIM", "NO CLAIM is about generated facts without evidence.", "NO CLAIM — о сгенерированных фактах без доказательств."],
          ["NO HIDDEN ROLE", "NO HIDDEN ROLE is about disclosing AI use.", "NO HIDDEN ROLE — о раскрытии использования ИИ."],
        ], "No participant or protected data may enter an unapproved tool — it would also break consent and confidentiality.", "Данные участников и защищённые данные не попадают в неодобренный инструмент — иначе нарушаются согласие и конфиденциальность."),
        qx("An AI tool writes “drowsiness causes 20% of truck accidents”, and the student keeps the sentence without a source. What does the verification contract require?", "Find evidence for the claim or remove it", [
          ["Keep it, since AI tools learn from real data", "Generated statistics can be invented; NO CLAIM requires evidence.", "Сгенерированная статистика может быть выдуманной; NO CLAIM требует доказательства."],
          ["Keep it but add “according to AI” after it", "AI is not a source of evidence; a label does not verify the number.", "ИИ — не источник доказательств; пометка не проверяет число."],
          ["Keep it if the number sounds plausible", "Plausibility is exactly how invented facts slip through.", "Правдоподобие — именно то, через что проскальзывают выдуманные факты."],
        ], "NO CLAIM: no generated factual claim remains without evidence.", "NO CLAIM: сгенерированное фактическое утверждение не остаётся без доказательства."),
        qx("Who is responsible when a fabricated reference suggested by an AI tool appears in a submitted assignment?", "The student who submitted the work", [
          ["The company that built the AI tool", "The tool's maker is not the author of the assignment.", "Создатель инструмента не автор задания."],
          ["The instructor who allowed AI use", "Permission to use AI for learning does not transfer responsibility.", "Разрешение пользоваться ИИ для учёбы не переносит ответственность."],
          ["Nobody, as the error came from a tool", "The syllabus states that students are responsible for the accuracy and integrity of their work.", "Силлабус прямо говорит, что студент отвечает за точность и честность своей работы."],
        ], "The student remains responsible for every source, claim and submitted sentence.", "Студент отвечает за каждый источник, утверждение и поданное предложение."),
        tfx("A missing DOI proves that a source was fabricated.", false,
          "False: books, theses, standards and some conference papers have no DOI but do have a stable publisher or repository record.",
          "Неверно: у книг, диссертаций, стандартов и части докладов нет DOI, но есть стабильная запись издателя или репозитория.",
          "“True” confuses a missing DOI with a missing source; the right reaction is to look for another stable record.",
          "Ответ «верно» путает отсутствие DOI с отсутствием источника; правильная реакция — искать другую стабильную запись."),
      ],
    ),
    part(
      "rm-l3-p4",
      { en: "Attribution, Mendeley and the research proposal", ru: "Ссылки на источники, Mendeley и исследовательское предложение" },
      {
        en: `## Plagiarism: changing words is not enough
| Level | What it is | In final work |
|---|---|---|
| Copy | the same words without quotation marks and citation | plagiarism |
| Patchwrite | a few words swapped; the source's structure stays | not acceptable — a learning stage only |
| Paraphrase | new wording and structure, same idea, with a citation | acceptable |
| Synthesise | several sources combined into a new analytical point | the goal |
Plagiarism covers **words, ideas and data** — figures, tables, datasets and code too. A paraphrase still needs a citation, and a translation of someone's text is not your own wording. The syllabus also treats submitting the same work for credit in two courses without both instructors' consent as a violation.
## Quote, paraphrase and synthesis do different work
- **Quote** — exact wording, used rarely, when the wording itself matters; quotation marks and a precise citation.
- **Paraphrase** — one source's idea rebuilt in your own structure and language, with a citation.
- **Synthesis** — a relationship between sources that produces an analytical claim.
= Quote: Study C reports that drivers found "constant video monitoring intrusive".
= Paraphrase: In Study C, long-haul drivers valued audio alerts at night but objected to permanent camera recording.
= Synthesis: Alerts reduced self-reported near-misses in Study A and were valued in Study C, yet A found no significant change in actual accidents, and C suggests that video monitoring may lower acceptance.
> A literature review is organised by ideas, not by a list of papers.
## Mendeley: a traceable library, not a verifier
@diagram rm3-mendeley-flow
- **Import** — drag a PDF into Mendeley Reference Manager, save a page with the **Web Importer** browser extension, or add an entry manually by its **DOI** (or arXiv ID / PMID), which fills in the metadata.
- **Verify** — compare the record with the paper's first page and the publisher page: title, full author names, year, venue, volume/pages, DOI. Open the DOI to confirm.
- **Organise** — the **library** holds every record and syncs with your account; a **collection** groups one project ("Assignment 1 — core papers"); **tags** cut across collections (method · dataset · domain · finding) — one concept, one spelling.
- **Read** — highlight and annotate the PDF; a useful note = claim + evidence + limitation + possible use.
- **Cite** — insert citations and the bibliography in Word with **Mendeley Cite**.
> Reference manager ≠ source verifier: Mendeley stores whatever it is given — an AI-invented reference, a wrong year, an all-caps title.
## Cite while you write: Mendeley Cite in Word
**Mendeley Cite** is the cite-while-you-write add-in for Microsoft Word; it replaced the citation plugin of the old Mendeley Desktop. Citations stay linked to library records, so the bibliography is generated, not typed.
- **1** Place the cursor where the evidence is used.
- **2** Open Mendeley Cite (References tab) and search the verified library.
- **3** Insert the citation — one or several records.
- **4** Choose the **citation style** the assignment or journal requires; switching style reformats every citation and the bibliography.
- **5** Under the References heading, insert the bibliography, then **inspect every entry**.
| | APA (7th edition) | IEEE |
|---|---|---|
| In text | author–date: (Ali & Chen, 2024) | number in brackets: [1] |
| Reference list | alphabetical by the first author's surname | numbered in order of first citation |
| Typical fields | psychology, education, social sciences | engineering and computing |
> Exam trap: if an entry is wrong, fix the record in the library and refresh. Hand-edited citation text loses its link to the record, so later updates and style changes may not apply to it.
## Crafting a research proposal
A proposal argues that a study is worth doing and can be done. Week 3 builds its skeleton; the ethics card and the verified library slot straight in.
| Section | What it must contain |
|---|---|
| Title | specific: population, factor, outcome — not "AI for Road Safety" |
| Background / problem | what is known, what is missing and why it matters — with verified citations |
| Aim and objectives | one aim; 2–4 concrete objectives (steps) that achieve it |
| Research question(s) | one focused, answerable main question (+ one supporting) |
| Literature | key verified studies organised by ideas; the gap they leave |
| Method | evidence needed, participants or data source, collection, procedure, analysis |
| Ethics | the ethics card: risks, safeguards, evidence; consent; approval route |
| Timeline | realistic steps by week, including time for ethics approval |
| References | the bibliography generated in the required style and checked |
= Problem → Aim → RQ → Evidence → Method → Analysis
Every link must follow from the previous one; a broken link is exactly where the proposal needs revision.
?? A student swaps every third word of a paragraph for a synonym and adds a citation. Acceptable?
?= No — that is patchwriting: the source's structure stays. Rebuild the idea in your own structure (paraphrase) or quote it.
?? A draft uses APA, but the assignment asks for IEEE. What changes when the style is switched in Mendeley Cite?
?= In-text citations become numbers in square brackets in order of first citation, and the bibliography is numbered in that order instead of alphabetical author–date entries.`,
        ru: `## Плагиат: поменять слова недостаточно
| Уровень | Что это | В итоговой работе |
|---|---|---|
| Copy (копирование) | те же слова без кавычек и ссылки | плагиат |
| Patchwrite (пэтчрайтинг) | заменено несколько слов; структура источника осталась | недопустимо — только этап обучения |
| Paraphrase (парафраз) | новые слова и структура, та же идея, со ссылкой | допустимо |
| Synthesise (синтез) | несколько источников объединены в новый аналитический вывод | цель |
Плагиат касается **слов, идей и данных** — в том числе рисунков, таблиц, датасетов и кода. Парафраз всё равно требует ссылки, а перевод чужого текста не становится вашими словами. Силлабус также считает нарушением сдачу одной и той же работы в двух курсах без согласия обоих преподавателей.
## Цитата, парафраз и синтез решают разные задачи
- **Quote (цитата)** — точная формулировка; использовать редко, когда важны сами слова; кавычки и точная ссылка.
- **Paraphrase (парафраз)** — идея одного источника, перестроенная вашей структурой и словами, со ссылкой.
- **Synthesis (синтез)** — связь между источниками, дающая аналитический вывод.
= Quote: Study C reports that drivers found "constant video monitoring intrusive".
= Paraphrase: In Study C, long-haul drivers valued audio alerts at night but objected to permanent camera recording.
= Synthesis: Alerts reduced self-reported near-misses in Study A and were valued in Study C, yet A found no significant change in actual accidents, and C suggests that video monitoring may lower acceptance.
> Обзор литературы строится по идеям, а не по списку статей.
## Mendeley: прослеживаемая библиотека, а не проверка источников
@diagram rm3-mendeley-flow
- **Import (импорт)** — перетащить PDF в Mendeley Reference Manager, сохранить страницу расширением браузера **Web Importer** или добавить запись вручную по **DOI** (или arXiv ID / PMID) — метаданные подтянутся сами.
- **Verify (проверка)** — сверить запись с первой страницей статьи и страницей издателя: название, полные имена авторов, год, издание, том/страницы, DOI. Открыть DOI для подтверждения.
- **Organise (организация)** — **библиотека (library)** хранит все записи и синхронизируется с аккаунтом; **коллекция (collection)** объединяет один проект («Assignment 1 — core papers»); **теги (tags)** проходят сквозь коллекции (method · dataset · domain · finding) — одно понятие, одно написание.
- **Read (чтение)** — выделения и аннотации в PDF; полезная заметка = утверждение + доказательство + ограничение + возможное применение.
- **Cite (цитирование)** — ссылки и список литературы в Word через **Mendeley Cite**.
> Менеджер ссылок ≠ проверка источников: Mendeley хранит всё, что ему дали, — выдуманную ИИ ссылку, неверный год, название заглавными буквами.
## Cite while you write: Mendeley Cite в Word
**Mendeley Cite** — надстройка Microsoft Word для цитирования по ходу письма (cite-while-you-write); она заменила плагин цитирования (citation plugin) старого Mendeley Desktop. Ссылки остаются связаны с записями библиотеки, поэтому список литературы генерируется, а не набирается.
- **1** Поставить курсор туда, где используется доказательство.
- **2** Открыть Mendeley Cite (вкладка «Ссылки» / References) и найти запись в проверенной библиотеке.
- **3** Вставить ссылку — на одну или несколько записей.
- **4** Выбрать **стиль цитирования (citation style)**, которого требует задание или журнал; смена стиля переоформляет все ссылки и список литературы.
- **5** Под заголовком References вставить список литературы, затем **проверить каждую запись**.
| | APA (7-е издание) | IEEE |
|---|---|---|
| В тексте | автор — дата: (Ali & Chen, 2024) | номер в скобках: [1] |
| Список литературы | по алфавиту фамилии первого автора | нумерация в порядке первого упоминания |
| Где принят | психология, образование, социальные науки | инженерия и компьютерные науки |
> Ловушка экзамена: если запись неверна, исправьте её в библиотеке и обновите. Вручную исправленный текст ссылки теряет связь с записью, и последующие обновления и смена стиля могут к нему не примениться.
## Как составить исследовательское предложение (research proposal)
Предложение доказывает, что исследование стоит проводить и его можно провести. Неделя 3 строит его каркас; этическая карточка и проверенная библиотека встают в него напрямую.
| Раздел | Что должно быть |
|---|---|
| Title (название) | конкретное: популяция, фактор, результат — не «AI for Road Safety» |
| Background / problem (контекст / проблема) | что известно, чего не хватает и почему это важно — с проверенными ссылками |
| Aim and objectives (цель и задачи) | одна цель; 2–4 конкретные задачи (шаги), которые к ней ведут |
| Research question(s) (вопросы исследования) | один сфокусированный главный вопрос, на который можно ответить (+ один вспомогательный) |
| Literature (литература) | ключевые проверенные исследования, сгруппированные по идеям; пробел, который они оставляют |
| Method (метод) | нужные данные, участники или источник данных, сбор, процедура, анализ |
| Ethics (этика) | этическая карточка: риски, меры, подтверждения; согласие; путь одобрения |
| Timeline (план-график) | реалистичные шаги по неделям, включая время на этическое одобрение |
| References (список литературы) | список, сгенерированный в нужном стиле и проверенный |
= Problem → Aim → RQ → Evidence → Method → Analysis
Каждое звено должно вытекать из предыдущего; разорванное звено — именно то место, где предложение нужно переделать.
?? Студент заменяет каждое третье слово абзаца синонимом и добавляет ссылку. Допустимо?
?= Нет — это пэтчрайтинг: структура источника сохранилась. Нужно перестроить идею своей структурой (парафраз) или процитировать.
?? Черновик оформлен в APA, а задание требует IEEE. Что изменится при смене стиля в Mendeley Cite?
?= Ссылки в тексте станут номерами в квадратных скобках в порядке первого упоминания, а список литературы будет пронумерован в этом порядке вместо алфавитных записей «автор — дата».`,
      },
      [
        qx("A student keeps a paragraph's sentence structure, swaps several words for synonyms and adds a citation. How is this judged?", "Patchwriting — not acceptable in final work", [
          ["Paraphrase — acceptable because it is cited", "A paraphrase needs a new structure as well as new words; here the source's structure stays.", "Парафразу нужна новая структура, а не только новые слова; здесь структура источника сохранена."],
          ["Synthesis — acceptable because it is reworded", "Synthesis combines several sources into a new point; this reworks one paragraph.", "Синтез объединяет несколько источников в новый вывод; здесь переделан один абзац."],
          ["Quotation — acceptable because it is attributed", "A quotation keeps the exact words in quotation marks; these words were altered.", "Цитата сохраняет точные слова в кавычках; здесь слова изменены."],
        ], "Small substitutions that keep the source's structure are patchwriting — a learning stage, not acceptable final prose.", "Мелкие замены при сохранении структуры источника — пэтчрайтинг (patchwriting): этап обучения, но не допустимый итоговый текст."),
        qx("Which statement about paraphrasing is correct?", "It still needs a citation, because the idea is borrowed", [
          ["It needs no citation once the wording is completely new", "Plagiarism covers ideas, not only words.", "Плагиат касается идей, а не только слов."],
          ["It is allowed only for sources that have no DOI", "Paraphrasing is allowed for any source, with a citation.", "Пересказывать можно любой источник — со ссылкой."],
          ["It must keep the sentence structure of the source", "Keeping the structure is patchwriting; a paraphrase rebuilds it.", "Сохранение структуры — это пэтчрайтинг; парафраз её перестраивает."],
        ], "Paraphrase = new wording and structure, the same idea, with a citation.", "Парафраз — новые слова и структура, та же идея и ссылка."),
        qx("Which sentence is a synthesis rather than a quote or a paraphrase?", "Alerts looked useful in Studies A and C, yet only C shows that video monitoring feels intrusive.", [
          ["Study A found that drowsiness alerts reduced self-reported near-miss events among taxi drivers.", "This restates one source's finding — a paraphrase.", "Это пересказ вывода одного источника — парафраз."],
          ["According to Study C, long-haul truck drivers found “constant video monitoring intrusive”.", "Exact words from one source in quotation marks — a quote.", "Точные слова одного источника в кавычках — цитата."],
          ["Study A was a randomised study, and Study C was a set of qualitative interviews.", "Listing designs side by side makes no analytical claim connecting the sources.", "Перечисление дизайнов рядом не даёт аналитического вывода, связывающего источники."],
        ], "Synthesis connects several sources into an analytical claim — here, agreement about alerts and a tension about video monitoring.", "Синтез связывает несколько источников в аналитический вывод — здесь согласие насчёт сигналов и противоречие насчёт видеонаблюдения."),
        qx("A student redraws a results chart from a published paper in new colours and puts it in a report without naming the source. What is this?", "Plagiarism — the data and figure are taken", [
          ["Acceptable, since the chart was fully redrawn", "Redrawing changes the look, not the owner of the data.", "Перерисовка меняет вид, а не владельца данных."],
          ["Fabrication, since the chart itself is new", "The data are real and come from the paper; nothing was invented.", "Данные реальны и взяты из статьи; ничего не выдумано."],
          ["Falsification, since the colours were changed", "Colours do not distort the findings; the problem is missing attribution.", "Цвета не искажают выводы; проблема — нет ссылки."],
        ], "Plagiarism covers data and figures as well as words; a redrawn chart needs “Adapted from …” with a citation.", "Плагиат касается данных и рисунков, а не только слов; перерисованному графику нужна пометка «Adapted from …» и ссылка."),
        qx("Which outline fits the literature review section of a proposal?", "Themes: alert design, driver acceptance, outcome measures", [
          ["One paragraph per paper, ordered by year of publication", "A list of papers is an annotated bibliography, not a review organised by ideas.", "Список статей — аннотированная библиография, а не обзор, построенный по идеям."],
          ["One paragraph per author, ordered alphabetically by surname", "Ordering by author still summarises papers one by one.", "Порядок по авторам — всё тот же пересказ статей по одной."],
          ["One paragraph per database, in search order", "Where a paper was found is not an idea about the topic.", "То, где нашлась статья, — не идея о теме."],
        ], "A literature review is organised by ideas, not by a list of papers.", "Обзор литературы строится по идеям, а не по списку статей."),
        qx("You know a paper's DOI but have no PDF yet. What is the most reliable way to create its Mendeley record?", "Add an entry manually and look it up by its DOI number", [
          ["Type every field by hand from the AI chat's answer", "An AI answer may be wrong; the DOI lookup pulls registered metadata.", "Ответ ИИ может быть неверным; поиск по DOI берёт зарегистрированные метаданные."],
          ["Wait until a PDF is available to drag into the library", "No need to wait: a record can be created from the DOI.", "Ждать не нужно: запись можно создать по DOI."],
          ["Insert the DOI as plain text in the Word document", "Text in Word is not a library record and cannot generate a bibliography.", "Текст в Word — не запись библиотеки, из него не получится список литературы."],
        ], "Mendeley can fill in metadata from an identifier such as a DOI — the record is then still checked against the publisher page.", "Mendeley может заполнить метаданные по идентификатору, например DOI, — после этого запись всё равно сверяют со страницей издателя."),
        qx("Which Mendeley tool saves a reference straight from a journal's web page in the browser?", "The Web Importer browser extension", [
          ["Mendeley Cite in Microsoft Word", "Mendeley Cite inserts citations into documents; it does not capture web pages.", "Mendeley Cite вставляет ссылки в документ, а не сохраняет веб-страницы."],
          ["Crossref Metadata Search", "Crossref is a metadata search service, not part of Mendeley.", "Crossref — сервис поиска метаданных, а не часть Mendeley."],
          ["The collection panel of the library", "Collections organise records that are already imported.", "Коллекции упорядочивают уже импортированные записи."],
        ], "The Web Importer is a browser extension that captures records (and often PDFs) from publisher and database pages.", "Web Importer — расширение браузера, которое сохраняет записи (часто и PDF) со страниц издателей и баз данных."),
        qx("The Web Importer saved a record with an all-caps title, author initials only and the wrong year. What is the next step?", "Correct it against the paper and the publisher page", [
          ["Cite it as it is, since Mendeley Cite fixes errors", "Mendeley Cite formats whatever is in the record, errors included.", "Mendeley Cite оформляет то, что есть в записи, вместе с ошибками."],
          ["Delete the PDF so that only the metadata remain", "The PDF is what the record is checked against; deleting it helps nothing.", "PDF — то, с чем сверяют запись; удаление ничему не поможет."],
          ["Switch citation styles until the entry looks right", "A style changes formatting, not wrong data.", "Стиль меняет оформление, а не неверные данные."],
        ], "Import first, then repair: compare with the first page and the publisher page; correct the title, names, year, venue, pages and DOI.", "Сначала импорт, затем исправление: сверить с первой страницей и страницей издателя, поправить название, имена, год, издание, страницы и DOI."),
        tfx("Mendeley automatically detects and rejects fabricated references when they are imported.", false,
          "False: a reference manager stores whatever it is given; verification is the researcher's job.",
          "Неверно: менеджер ссылок хранит всё, что ему дали; проверка — работа исследователя.",
          "“True” confuses a reference manager with a source verifier.",
          "Ответ «верно» путает менеджер ссылок с проверкой источников."),
        qx("In Mendeley, how does a collection differ from a tag?", "A collection groups a project's records; a tag labels a concept across them", [
          ["A tag groups a project's records; a collection labels a concept across them", "This swaps the two: collections are folder-like groups, tags are cross-cutting labels.", "Здесь они перепутаны: коллекции — группы-папки, теги — сквозные метки."],
          ["A collection is stored online; a tag exists only on one computer", "Both sync with the library; the difference is purpose, not storage.", "Оба синхронизируются с библиотекой; разница в назначении, а не в хранении."],
          ["A collection holds PDFs; a tag holds the notes written about them", "Records in a collection need not have PDFs, and notes are separate from tags.", "У записей в коллекции может не быть PDF, а заметки — не теги."],
        ], "Collection — e.g., “Assignment 1 — core papers”; tags — method · dataset · domain · finding, spelled consistently.", "Коллекция — например, «Assignment 1 — core papers»; теги — method · dataset · domain · finding, с единым написанием."),
        qx("What is Mendeley Cite?", "A cite-while-you-write add-in for documents in Word", [
          ["A browser extension that saves records from web pages", "That is the Web Importer.", "Это Web Importer."],
          ["A service that tells you whether a paper was retracted", "Retraction checks happen on the publisher page or in the Retraction Watch Database.", "Отзыв проверяют на странице издателя или в Retraction Watch Database."],
          ["A similarity checker that detects plagiarism in Word", "Similarity checking is done by tools such as Turnitin.", "Совпадения проверяют инструменты вроде Turnitin."],
        ], "Mendeley Cite inserts citations and the bibliography from your library and applies the chosen style.", "Mendeley Cite вставляет ссылки и список литературы из библиотеки и применяет выбранный стиль."),
        qx("A draft uses APA citations inserted with Mendeley Cite, but the assignment requires IEEE. What is the best fix?", "Switch the style in Mendeley Cite and recheck", [
          ["Retype every citation as a number in square brackets", "Hand-typed citations lose their link to the records and drift out of sync.", "Набранные вручную ссылки теряют связь с записями и расходятся с ними."],
          ["Delete the bibliography and type a new one by hand", "Typing by hand brings back the errors that the library prevents.", "Ручной набор возвращает ошибки, от которых защищает библиотека."],
          ["Re-import every paper in IEEE format first", "Records store data, not a style; the style is applied in Word.", "Записи хранят данные, а не стиль; стиль применяется в Word."],
        ], "Changing the style reformats all citations and the bibliography at once; then the entries are inspected.", "Смена стиля переоформляет сразу все ссылки и список литературы; затем записи проверяют."),
        qx("How are the entries of an IEEE reference list ordered?", "By the order in which sources are first cited", [
          ["Alphabetically by the first author's family name", "That is APA (author–date) ordering.", "Так упорядочен список в APA (автор — дата)."],
          ["By year of publication, newest first", "Neither APA nor IEEE orders references by year.", "Ни APA, ни IEEE не упорядочивают список по году."],
          ["By journal name, then by volume number", "Journal names do not determine the order in either style.", "Название журнала не определяет порядок ни в одном из стилей."],
        ], "IEEE numbers sources [1], [2]… in order of first citation; APA lists them alphabetically with (Author, Year) in the text.", "IEEE нумерует источники [1], [2]… в порядке первого упоминания; APA перечисляет их по алфавиту, а в тексте — (Автор, год)."),
        qx("A bibliography entry generated by Mendeley Cite shows 2025 instead of 2024. Where should this be fixed?", "In the library record, then refresh Word", [
          ["Directly in the bibliography text in Word", "A hand edit is lost or out of sync when the bibliography refreshes.", "Ручная правка теряется или расходится при обновлении списка."],
          ["In the citation style settings of Word", "A style changes formatting; it cannot correct a wrong year.", "Стиль меняет оформление и не исправит неверный год."],
          ["In the PDF file attached to the record", "The PDF is the evidence; the error is in the record's metadata.", "PDF — это доказательство; ошибка в метаданных записи."],
        ], "Fix the source of truth — the record — after checking the publisher page or DOI; the bibliography then regenerates correctly.", "Исправлять нужно источник истины — запись, сверив её со страницей издателя или DOI; тогда список литературы пересоберётся правильно."),
        tfx("Changing the citation style in Mendeley Cite reformats the in-text citations and the bibliography together.", true,
          "True: citations stay linked to library records, so a new style is applied everywhere at once — then the result is inspected.",
          "Верно: ссылки связаны с записями библиотеки, поэтому новый стиль применяется везде сразу — затем результат проверяют.",
          "“False” would mean retyping citations by hand, which is exactly what cite-while-you-write avoids.",
          "Ответ «неверно» означал бы перенабор ссылок вручную — именно этого и позволяет избежать cite-while-you-write."),
        qx("Which is the best title for the SafeDrive research proposal?", "Drowsiness alerts and fatigue events in long-haul truck drivers", [
          ["AI for Road Safety: how new technology is changing driving today", "Too broad: no population, factor or measurable outcome.", "Слишком широко: нет популяции, фактора и измеримого результата."],
          ["Does technology improve road safety for all drivers?", "A broad question with no measurable outcome — the same flaw as the case's question.", "Широкий вопрос без измеримого результата — тот же изъян, что в кейсе."],
          ["SafeDrive: an app that will definitely reduce accidents", "A promotional, unsupported claim, not a research title.", "Рекламное, ничем не подкреплённое утверждение, а не название исследования."],
        ], "A good title names the population, the factor and the outcome.", "Хорошее название называет популяцию, фактор и результат."),
        qx("What role do the objectives play in a research proposal?", "Concrete steps that together achieve the aim", [
          ["A second, broader restatement of the research aim", "Objectives are narrower than the aim, not broader.", "Задачи конкретнее цели, а не шире."],
          ["The list of results that the study will prove", "A proposal cannot promise results; objectives describe what will be done.", "Предложение не может обещать результаты; задачи описывают, что будет сделано."],
          ["The personal learning goals of the student", "Objectives belong to the study, not to the researcher's development.", "Задачи относятся к исследованию, а не к развитию исследователя."],
        ], "One aim states what the study intends to achieve; 2–4 objectives break it into doable steps (collect alert logs, compare the groups, analyse fatigue scores).", "Одна цель говорит, чего исследование хочет достичь; 2–4 задачи (objectives) разбивают её на выполнимые шаги (собрать журналы сигналов, сравнить группы, проанализировать шкалу усталости)."),
        qx("In which section of a proposal do the risks, safeguards, evidence records and approval route belong?", "Ethics", [
          ["Literature", "The literature section reviews prior studies and the gap.", "Раздел литературы — обзор прежних исследований и пробела."],
          ["Timeline", "The timeline schedules steps (including time for approval) but does not hold the safeguards.", "План-график расставляет шаги (в том числе время на одобрение), но мер защиты не содержит."],
          ["References", "References list the cited sources only.", "В списке литературы — только цитируемые источники."],
        ], "The ethics section is where the Week 3 ethics card goes: data, people, risk, safeguard, evidence and the approval route.", "Этический раздел — место для карточки недели 3: данные, люди, риск, мера, подтверждение и путь одобрения."),
        qx("A proposal plans data collection in week 1, but ethics review usually takes three weeks. What is wrong?", "The timeline must leave time for approval first", [
          ["Nothing, as approval can be obtained afterwards", "Approval is needed before collection, not after.", "Одобрение нужно до сбора, а не после."],
          ["The ethics section should simply be removed", "Removing the section does not remove the need for review.", "Удаление раздела не отменяет необходимости экспертизы."],
          ["Data collection should be shortened to one day", "Shortening collection does not solve the missing approval.", "Сокращение сбора не решает проблему отсутствующего одобрения."],
        ], "A realistic timeline includes ethics review before any data collection.", "Реалистичный план-график включает этическую экспертизу до любого сбора данных."),
        qx("Which chain shows a coherent proposal skeleton?", "Problem → Aim → RQ → Evidence → Method → Analysis", [
          ["Method → RQ → Problem → Analysis → Aim → Evidence", "Starting from a method and fitting a question to it reverses the logic.", "Начинать с метода и подгонять под него вопрос — обратная логика."],
          ["Analysis → Evidence → Aim → Problem → Method → RQ", "The analysis cannot be chosen before the question and the evidence are known.", "Анализ нельзя выбрать раньше вопроса и нужных данных."],
          ["RQ → Method → Analysis → Problem → Evidence → Aim", "The problem must come first: it justifies the aim and the question.", "Проблема должна быть первой: она обосновывает цель и вопрос."],
        ], "Each element must follow from the previous one; where a link breaks, the design needs revision.", "Каждый элемент вытекает из предыдущего; где звено рвётся, дизайн нужно пересмотреть."),
      ],
    ),
  ],
};
