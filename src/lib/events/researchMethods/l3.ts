import type { Lecture } from "../types";

/** Конспект и вопросы по темам лекции; учебные примеры заданий выделены отдельно. */
export const lecture3: Lecture = {
  "id": "rm-l3",
  "title": {
    "en": "Lecture 3 — Research ethics, source verification and Mendeley",
    "ru": "Лекция 3 — Этика исследования, проверка источников и Mendeley"
  },
  "parts": [
    {
      "id": "rm-l3-p1",
      "title": {
        "en": "Research integrity: misconduct, questionable practices and credit",
        "ru": "Честность исследования: нарушения, сомнительные практики и авторство"
      },
      "notes": {
        "en": "## Diagnostic: approve, revise or stop?\n| Decision | Who or what could be harmed | Name of the problem |\n|---|---|---|\n| Scrape public profiles and publish usernames | the users: privacy, re-identification | ethical / data-protection risk |\n| Remove three low scores because they \"look wrong\" | the evidence: the data record | falsification |\n| Use an AI-suggested citation without opening it | the evidence: the source base | possibly fabricated reference |\n| Store interview audio in a shared class folder | the participants: confidentiality | data-protection breach |\n## Misconduct: three breaches change the research record (FFP)\n- **Fabrication — inventing.** Creating data, participants, results or references that never existed: accuracy for a test that was never run, invented survey respondents, a made-up DOI.\n- **Falsification — distorting.** Changing, selecting or hiding real data or procedures so that the findings are misrepresented. It includes **misleading omission**: dropping \"bad\" runs, deleting inconvenient responses, silently changing the procedure.\n- **Plagiarism — taking.** Using another person's **words, ideas or data** without clear attribution: a copied paragraph, a translated text, code from GitHub or someone's dataset presented as your own.\n= Fabrication = inventing · Falsification = distorting · Plagiarism = taking\n> Exam trap: falsification does not need an edited number. Hiding runs, subgroups or steps that would change the reader's conclusion is falsification too.\n## Questionable practices often look ordinary\nThey sit below obvious fraud but still leave a misleading record.\n| Practice | What it looks like | Repair |\n|---|---|---|\n| Cherry-picking | only the metric, run or subgroup that supports the claim is reported | fix the reporting rule in advance; report all runs |\n| Hidden limits | a small convenience sample is described as representative | state the sample, the setting and the limits |\n| Duplication | substantially the same work is presented as a new contribution | cite the earlier work and declare the overlap |\n| Gift authorship | a name is added without a defensible contribution | contribution statement; thank helpers in the acknowledgements |\n| HARKing | a hypothesis made up after seeing the results is presented as planned | separate planned and exploratory analysis |\n**Disclosure test:** would a reasonable reader make a different decision if this were disclosed? If yes, disclose it — or change the practice.\n## Classify the case, then repair it\n\"A team tests six models and reports only the best run. The other runs remain saved.\"\n- Not fabrication — nothing was invented. Not plagiarism — no source was taken. Not \"no issue\" — the reader still lacks the full evidence, and saving runs is not disclosing them.\n- It is **falsification**: selective reporting distorts the record. Cherry-picking is the everyday name; when it misrepresents the findings, it is classified as falsification.\n- **Repair:** define the reporting rule **before** choosing the result — for example, report all six models with the mean and standard deviation over runs.\n## The researcher's role: bias is managed by making decisions visible\n- **Before:** state expectations, interests and possible conflicts (\"the tool I am evaluating is my own\").\n- **During:** keep a **decision log** and apply the criteria consistently.\n- **After:** report exceptions, uncertainty and limitations.\n= Reflexive note: I may favour ______. I will check this by ______.\n**Reflexivity** is not pretending to be neutral; it is making a possible bias and its check visible. Example: \"I may favour my own model; I will check this by tuning every baseline with the same time budget.\"\n## Credit: authorship, acknowledgement and conflicts need evidence\n- **Contribution** — credit reflects meaningful work, not status or convenience.\n- **Responsibility** — every author can explain and defend the submitted work.\n- **Acknowledgement** — support that does not justify authorship (proofreading, lending a GPU, arranging access) is still recognised.\n- **Conflict** — funding or relationships that may affect judgement are disclosed (for example, the company whose app is tested pays for the study).\nEvidence: a one-line **contribution statement** for each team member. Gift authorship adds a name that did not earn it; **ghost authorship** leaves out someone who did.\n?? A student drops two survey responses that contradict the hypothesis and does not mention it. Which FFP category, and why?\n?= Falsification: real data were selectively omitted, which distorts the record. Nothing was invented, so it is not fabrication.\n?? A team member only booked the lab room. Author or acknowledgement?\n?= Acknowledgement: the help is real, but it is not a meaningful intellectual contribution that the person could defend as an author.",
        "ru": "## Разминка: одобрить, доработать или остановить?\n| Решение | Кому или чему может быть вред | Как называется проблема |\n|---|---|---|\n| Собрать публичные профили и опубликовать имена пользователей | пользователям: приватность, повторная идентификация | этический риск / риск защиты данных |\n| Убрать три низких результата, потому что они «выглядят неправильно» | доказательствам: запись данных | фальсификация |\n| Сослаться на источник, предложенный ИИ, не открыв его | доказательствам: база источников | возможно, выдуманная ссылка |\n| Хранить аудио интервью в общей папке группы | участникам: конфиденциальность | нарушение защиты данных |\n## Нарушения: три вида, которые искажают научную запись (FFP)\n- **Fabrication (фабрикация) — выдумывание.** Создание данных, участников, результатов или ссылок, которых не было: точность теста, который не запускали, выдуманные респонденты, несуществующий DOI.\n- **Falsification (фальсификация) — искажение.** Изменение, отбор или сокрытие реальных данных или процедур так, что выводы искажаются. Сюда входит и **вводящее в заблуждение умолчание**: выбросить «плохие» прогоны, удалить неудобные ответы, молча поменять процедуру.\n- **Plagiarism (плагиат) — присвоение.** Использование чужих **слов, идей или данных** без явной ссылки: скопированный абзац, переведённый текст, код с GitHub или чужой датасет, выданные за свои.\n= Fabrication = inventing · Falsification = distorting · Plagiarism = taking\n> Ловушка экзамена: для фальсификации не нужно править число. Скрыть прогоны, подгруппы или шаги, которые изменили бы вывод читателя, — тоже фальсификация.\n## Сомнительные практики часто выглядят обычно\nОни ниже явного мошенничества, но всё равно оставляют вводящую в заблуждение запись.\n| Практика | Как выглядит | Как исправить |\n|---|---|---|\n| Cherry-picking (выборочный отчёт) | сообщается только метрика, прогон или подгруппа, которые подтверждают утверждение | заранее задать правило отчёта; сообщать все прогоны |\n| Hidden limits (скрытые ограничения) | небольшая удобная выборка описана как репрезентативная | назвать выборку, условия и ограничения |\n| Duplication (дублирование) | по сути та же работа подаётся как новый вклад | сослаться на прежнюю работу и указать пересечение |\n| Gift authorship (подарочное авторство) | вписан человек без обоснованного вклада | заявление о вкладе; помощников — в благодарности |\n| HARKing | гипотезу придумали после результатов и подают как запланированную | разделять запланированный и разведочный анализ |\n**Тест на раскрытие (disclosure test):** принял бы разумный читатель другое решение, если бы это было раскрыто? Если да — раскрыть или изменить практику.\n## Определить случай, затем исправить\n«Команда тестирует шесть моделей и сообщает только лучший прогон. Остальные прогоны сохранены».\n- Не фабрикация — ничего не выдумано. Не плагиат — ничего не присвоено. Не «всё в порядке» — у читателя нет полной картины, а сохранить прогоны не значит их раскрыть.\n- Это **фальсификация**: выборочный отчёт искажает запись. Cherry-picking — бытовое название; когда он искажает выводы, его относят к фальсификации.\n- **Исправление:** задать правило отчёта **до** выбора результата — например, показать все шесть моделей со средним и стандартным отклонением по прогонам.\n## Роль исследователя: предвзятость контролируют, делая решения видимыми\n- **До:** назвать ожидания, интересы и возможные конфликты («инструмент, который я оцениваю, — моя разработка»).\n- **Во время:** вести **журнал решений (decision log)** и применять критерии одинаково.\n- **После:** сообщить об исключениях, неопределённости и ограничениях.\n= Reflexive note: I may favour ______. I will check this by ______.\n**Рефлексивность (reflexivity)** — не притворство нейтральным, а видимость возможной предвзятости и способа её проверки. Пример: «Я могу отдавать предпочтение своей модели; проверю это, настроив каждую базовую модель с тем же бюджетом времени».\n## Признание вклада: авторство, благодарности и конфликты требуют подтверждения\n- **Contribution (вклад)** — авторство отражает существенную работу, а не статус или удобство.\n- **Responsibility (ответственность)** — каждый автор может объяснить и защитить поданную работу.\n- **Acknowledgement (благодарность)** — помощь, не дающая права на авторство (вычитка, одолженная GPU, организация доступа), всё равно отмечается.\n- **Conflict (конфликт интересов)** — финансирование или отношения, способные повлиять на суждения, раскрываются (например, исследование оплачивает компания, чьё приложение тестируют).\nПодтверждение: однострочное **заявление о вкладе (contribution statement)** для каждого участника команды. Подарочное авторство добавляет имя, которое его не заслужило; **ghost authorship (скрытое авторство)** убирает того, кто заслужил.\n?? Студент убирает два ответа анкеты, противоречащих гипотезе, и не упоминает об этом. Какая категория FFP и почему?\n?= Фальсификация: реальные данные выборочно опущены, и это искажает запись. Ничего не выдумано, поэтому это не фабрикация.\n?? Участник команды только забронировал лабораторию. Автор или благодарность?\n?= Благодарность: помощь реальная, но это не существенный интеллектуальный вклад, который человек мог бы защищать как автор."
      },
      "questions": [
        {
          "q": "A paper reports accuracy for a benchmark run that the team never actually executed. How is this classified?",
          "options": [
            "Fabrication",
            "Falsification",
            "Plagiarism",
            "Hidden limits"
          ],
          "answer": 0,
          "why": {
            "en": "Fabrication means inventing data, results or references that never existed — a benchmark that was never run is exactly that.",
            "ru": "Фабрикация — выдумывание данных, результатов или ссылок, которых не было; результат незапущенного теста — именно это."
          },
          "wrong": [
            {
              "en": "Falsification distorts real data or procedures; here the result never existed at all.",
              "ru": "Фальсификация искажает реальные данные или процедуры, а здесь результата вообще не было."
            },
            {
              "en": "Nothing was taken from another person; the problem is an invented result.",
              "ru": "Ничего не взято у другого человека; проблема — выдуманный результат."
            },
            {
              "en": "Hidden limits conceal weaknesses of real data; inventing a result is a far more serious breach.",
              "ru": "Скрытые ограничения прячут слабости реальных данных; выдуманный результат — гораздо более тяжёлое нарушение."
            }
          ],
          "id": "rm-l3-p1-1"
        },
        {
          "q": "A student removes three low test scores because they “look wrong”, without any rule set in advance. What is this?",
          "options": [
            "Falsification",
            "Fabrication",
            "Data minimisation",
            "Normal data cleaning"
          ],
          "answer": 0,
          "why": {
            "en": "Real data were removed to change the picture — distorting the record is falsification.",
            "ru": "Реальные данные убраны, чтобы изменить картину, — искажение записи и есть фальсификация."
          },
          "wrong": [
            {
              "en": "Fabrication creates data that never existed; these scores were real.",
              "ru": "Фабрикация создаёт несуществующие данные, а эти оценки были реальными."
            },
            {
              "en": "Data minimisation limits which personal data are collected; it never justifies deleting inconvenient results.",
              "ru": "Минимизация данных ограничивает сбор персональных данных и не оправдывает удаление неудобных результатов."
            },
            {
              "en": "Cleaning follows a rule fixed before seeing the outcome and is reported; “looks wrong” is not a rule.",
              "ru": "Очистка следует правилу, заданному до просмотра результата, и описывается в отчёте; «выглядит неправильно» — не правило."
            }
          ],
          "id": "rm-l3-p1-2"
        },
        {
          "q": "A team tests six models, reports only the best run and keeps the other runs saved on a laptop. How does the lecture classify this?",
          "options": [
            "Falsification by selective reporting",
            "Fabrication of the best result",
            "No issue, because all runs are still saved",
            "Plagiarism of the baseline models"
          ],
          "answer": 0,
          "why": {
            "en": "Nothing was invented and nothing was taken, but reporting only the best run distorts the record — falsification.",
            "ru": "Ничего не выдумано и не присвоено, но отчёт только о лучшем прогоне искажает запись — это фальсификация."
          },
          "wrong": [
            {
              "en": "The best run really happened; nothing was invented.",
              "ru": "Лучший прогон действительно был; ничего не выдумано."
            },
            {
              "en": "Keeping runs on a laptop is not disclosure: the reader still lacks the full evidence.",
              "ru": "Хранить прогоны на ноутбуке не значит раскрыть их: у читателя всё равно нет полной картины."
            },
            {
              "en": "No one else's words, ideas or data were taken without credit.",
              "ru": "Чужие слова, идеи или данные не присваивались."
            }
          ],
          "id": "rm-l3-p1-3"
        },
        {
          "q": "Which repair best fixes the “six models, best run only” report?",
          "options": [
            "Set the reporting rule in advance and report every run",
            "Delete the weaker runs so that readers are not confused",
            "Keep the best run but label it as “preliminary”",
            "Rerun the best model until its score is stable"
          ],
          "answer": 0,
          "why": {
            "en": "Define the reporting rule before choosing the result — for example, all six models with the mean and standard deviation over runs.",
            "ru": "Правило отчёта задаётся до выбора результата — например, все шесть моделей со средним и стандартным отклонением."
          },
          "wrong": [
            {
              "en": "Deleting runs hides even more evidence and makes the distortion permanent.",
              "ru": "Удаление прогонов прячет ещё больше данных и делает искажение окончательным."
            },
            {
              "en": "A label does not give the reader the missing runs.",
              "ru": "Пометка не даёт читателю недостающих прогонов."
            },
            {
              "en": "More runs of the winner still hide how the other five performed.",
              "ru": "Новые прогоны победителя всё равно скрывают результаты остальных пяти."
            }
          ],
          "id": "rm-l3-p1-4"
        },
        {
          "q": "A student copies a sorting function from a GitHub repository into the project and describes it as their own implementation. What is this?",
          "options": [
            "Plagiarism of code",
            "Fabrication of code",
            "Falsification of code",
            "Acceptable code reuse"
          ],
          "answer": 0,
          "why": {
            "en": "Plagiarism covers words, ideas and data — and code: using it without attribution is taking.",
            "ru": "Плагиат касается слов, идей и данных — и кода: использование без ссылки — присвоение."
          },
          "wrong": [
            {
              "en": "The code exists and works; nothing was invented.",
              "ru": "Код существует и работает; ничего не выдумано."
            },
            {
              "en": "No data or procedure was distorted; someone else's work was presented as one's own.",
              "ru": "Данные и процедуры не искажались; чужая работа выдана за свою."
            },
            {
              "en": "Reuse is acceptable only with attribution and within the licence; here the author is hidden.",
              "ru": "Повторное использование допустимо только со ссылкой и в рамках лицензии; здесь автор скрыт."
            }
          ],
          "id": "rm-l3-p1-5"
        },
        {
          "q": "A student translates two paragraphs of a Russian-language article into English and submits them without a citation. Which statement is correct?",
          "options": [
            "It is plagiarism: translated words and ideas still need a citation",
            "It is acceptable, because the English wording is entirely the student's own",
            "It is falsification, because meaning can shift in translation",
            "It is fine if the original article has no English version"
          ],
          "answer": 0,
          "why": {
            "en": "Plagiarism covers words and ideas in any language; a translation of someone's text without a citation is taking.",
            "ru": "Плагиат касается слов и идей на любом языке; перевод чужого текста без ссылки — присвоение."
          },
          "wrong": [
            {
              "en": "New wording does not make the ideas yours; a translation keeps another author's text.",
              "ru": "Новые слова не делают идеи вашими; перевод сохраняет чужой текст."
            },
            {
              "en": "The core problem is missing attribution, not a distortion of data.",
              "ru": "Главная проблема — отсутствие ссылки, а не искажение данных."
            },
            {
              "en": "Whether a translation exists does not remove the duty to credit the source.",
              "ru": "Наличие или отсутствие перевода не отменяет обязанности указать источник."
            }
          ],
          "id": "rm-l3-p1-6"
        },
        {
          "q": "What does the disclosure test ask?",
          "options": [
            "Would a reasonable reader decide differently if this were disclosed?",
            "Would the result look more convincing if this stayed undisclosed?",
            "Has another research team already disclosed the same information?",
            "Would the ethics committee object if it found out about this much later?"
          ],
          "answer": 0,
          "why": {
            "en": "If a reasonable reader would make a different decision, the information must be disclosed — or the practice changed.",
            "ru": "Если разумный читатель принял бы другое решение, информацию нужно раскрыть или изменить практику."
          },
          "wrong": [
            {
              "en": "That is the reasoning behind hiding things, not the test against it.",
              "ru": "Это логика сокрытия, а не проверка против него."
            },
            {
              "en": "What others did is irrelevant; the test is about your reader's decision.",
              "ru": "Чужие действия не важны; тест — о решении вашего читателя."
            },
            {
              "en": "The test is about the reader's decision, not about avoiding objections.",
              "ru": "Тест — о решении читателя, а не о том, как избежать претензий."
            }
          ],
          "id": "rm-l3-p1-7"
        },
        {
          "q": "A survey of 25 classmates is reported as showing how “university students in Kazakhstan” use AI tools. Which questionable practice is this?",
          "options": [
            "Hidden limits",
            "Duplication",
            "Gift authorship",
            "Fabrication"
          ],
          "answer": 0,
          "why": {
            "en": "A small convenience sample presented as representative hides the study's limits.",
            "ru": "Небольшая удобная выборка, поданная как репрезентативная, скрывает ограничения исследования."
          },
          "wrong": [
            {
              "en": "Duplication is presenting the same work twice as new.",
              "ru": "Дублирование — подача одной и той же работы дважды как новой."
            },
            {
              "en": "Gift authorship is about an undeserved name on the paper.",
              "ru": "Подарочное авторство — о незаслуженном имени в списке авторов."
            },
            {
              "en": "The 25 responses are real; the problem is the overstated scope.",
              "ru": "25 ответов реальны; проблема — преувеличенный охват."
            }
          ],
          "id": "rm-l3-p1-8"
        },
        {
          "q": "A team submits essentially the same experiment to a second conference under a new title, without mentioning the first paper. What is this?",
          "options": [
            "Duplication",
            "Synthesis",
            "Cherry-picking",
            "Gift authorship"
          ],
          "answer": 0,
          "why": {
            "en": "Presenting substantially the same work as a new contribution is duplication; the repair is to cite the earlier work and declare the overlap.",
            "ru": "Подача по сути той же работы как нового вклада — дублирование; исправление — сослаться на прежнюю работу и указать пересечение."
          },
          "wrong": [
            {
              "en": "Synthesis connects several sources into a new analytical point; this repeats one study.",
              "ru": "Синтез связывает несколько источников в новый вывод; здесь повторяется одно исследование."
            },
            {
              "en": "Cherry-picking selects favourable results; here the whole work is re-presented as new.",
              "ru": "Cherry-picking отбирает удобные результаты; здесь вся работа заново подаётся как новая."
            },
            {
              "en": "Nothing in the case is about who is listed as an author.",
              "ru": "В этом случае речь не о том, кто указан автором."
            }
          ],
          "id": "rm-l3-p1-9"
        },
        {
          "q": "A department head is added as a co-author “to improve the chance of acceptance”, although they did not work on the study. What is this?",
          "options": [
            "Gift authorship",
            "Acknowledgement",
            "Conflict of interest",
            "Ghost authorship"
          ],
          "answer": 0,
          "why": {
            "en": "Authorship must reflect a defensible contribution; adding a name for status is gift (honorary) authorship.",
            "ru": "Авторство должно отражать обоснованный вклад; имя ради статуса — подарочное (почётное) авторство."
          },
          "wrong": [
            {
              "en": "An acknowledgement thanks someone without listing them as an author; here the name is on the author list.",
              "ru": "Благодарность отмечает человека, не делая его автором; здесь имя стоит в списке авторов."
            },
            {
              "en": "A conflict concerns interests that may bias judgement; here the issue is undeserved credit.",
              "ru": "Конфликт интересов — об интересах, способных исказить суждение; здесь проблема в незаслуженном авторстве."
            },
            {
              "en": "Ghost authorship leaves out a real contributor; here an unjustified name is added.",
              "ru": "Скрытое авторство убирает реального участника; здесь, наоборот, добавлено незаслуженное имя."
            }
          ],
          "id": "rm-l3-p1-10"
        },
        {
          "q": "After the results show that the model works better at night, the team writes the introduction as if it had predicted this from the start. What is this practice called?",
          "options": [
            "HARKing",
            "Reflexivity",
            "Duplication",
            "Paraphrasing"
          ],
          "answer": 0,
          "why": {
            "en": "HARKing — Hypothesising After the Results are Known and presenting it as planned. Repair: separate planned and exploratory analysis.",
            "ru": "HARKing — гипотеза, придуманная после результатов и поданная как запланированная. Исправление — разделять запланированный и разведочный анализ."
          },
          "wrong": [
            {
              "en": "Reflexivity makes the researcher's possible bias visible; this hides how the hypothesis appeared.",
              "ru": "Рефлексивность делает предвзятость видимой; здесь, наоборот, скрыто, откуда взялась гипотеза."
            },
            {
              "en": "Duplication re-presents an old work as new; this is about a hypothesis invented after the data.",
              "ru": "Дублирование выдаёт старую работу за новую; здесь гипотеза придумана после данных."
            },
            {
              "en": "Paraphrasing is rewording a source; it has nothing to do with the timing of a hypothesis.",
              "ru": "Парафраз — пересказ источника; он не связан с моментом появления гипотезы."
            }
          ],
          "id": "rm-l3-p1-11"
        },
        {
          "q": "What does reflexivity mean for a researcher?",
          "options": [
            "Making a possible bias and its check visible",
            "Staying completely neutral and hiding opinions",
            "Repeating every experiment at least twice",
            "Letting participants approve the final paper"
          ],
          "answer": 0,
          "why": {
            "en": "Reflexive note: “I may favour ___. I will check this by ___.”",
            "ru": "Рефлексивная заметка: «Я могу отдавать предпочтение ___. Проверю это так: ___»."
          },
          "wrong": [
            {
              "en": "The lecture contrasts reflexivity with pretending to be neutral.",
              "ru": "Лекция противопоставляет рефлексивность притворству нейтральным."
            },
            {
              "en": "That is replication, not reflexivity.",
              "ru": "Это повторение эксперимента, а не рефлексивность."
            },
            {
              "en": "Checking with participants is a different technique, not what reflexivity means.",
              "ru": "Проверка участниками — другая техника, это не рефлексивность."
            }
          ],
          "id": "rm-l3-p1-13"
        },
        {
          "q": "In bias control, which action belongs to the “during” stage?",
          "options": [
            "Keeping a decision log and applying criteria consistently",
            "Stating expectations and possible conflicts of interest",
            "Reporting exceptions, uncertainty and the limitations",
            "Choosing the most impressive run for the paper's abstract"
          ],
          "answer": 0,
          "why": {
            "en": "Before: state expectations; during: a decision log and consistent criteria; after: report exceptions and limits.",
            "ru": "До — назвать ожидания; во время — журнал решений и одинаковые критерии; после — сообщить об исключениях и ограничениях."
          },
          "wrong": [
            {
              "en": "That is the “before” stage.",
              "ru": "Это этап «до»."
            },
            {
              "en": "That is the “after” stage.",
              "ru": "Это этап «после»."
            },
            {
              "en": "That is cherry-picking, not bias control.",
              "ru": "Это cherry-picking, а не контроль предвзятости."
            }
          ],
          "id": "rm-l3-p1-14"
        },
        {
          "q": "Which contribution best justifies authorship of a team paper?",
          "options": [
            "Designing the experiment and being able to defend its results",
            "Lending the team a GPU server for two weeks of model training",
            "Proofreading the grammar of the final manuscript draft",
            "Being the head of the lab where the team usually works"
          ],
          "answer": 0,
          "why": {
            "en": "Authorship requires a meaningful contribution and responsibility: authors can explain and defend the work.",
            "ru": "Авторство требует существенного вклада и ответственности: автор может объяснить и защитить работу."
          },
          "wrong": [
            {
              "en": "Valuable support, but it belongs in the acknowledgements.",
              "ru": "Ценная помощь, но её место — в благодарностях."
            },
            {
              "en": "Language editing is acknowledged, not credited with authorship.",
              "ru": "Языковую правку отмечают в благодарностях, а не авторством."
            },
            {
              "en": "Status is not a contribution; adding a name for status is gift authorship.",
              "ru": "Статус — не вклад; имя ради статуса — подарочное авторство."
            }
          ],
          "id": "rm-l3-p1-15"
        },
        {
          "q": "Falsification requires that at least one value in the dataset was edited.",
          "options": [
            "True",
            "False"
          ],
          "answer": 1,
          "fixed": true,
          "why": {
            "en": "False: selecting or hiding data, runs or procedures so that the findings are misrepresented is falsification even if every number is untouched.",
            "ru": "Неверно: отбор или сокрытие данных, прогонов или процедур, искажающие выводы, — фальсификация, даже если ни одно число не тронуто."
          },
          "wrong": [
            {
              "en": "“True” misses misleading omission, which the lecture explicitly includes in falsification.",
              "ru": "Ответ «верно» упускает вводящее в заблуждение умолчание, которое лекция прямо относит к фальсификации."
            }
          ],
          "id": "rm-l3-p1-17"
        },
        {
          "q": "In the opening diagnostic, what is the main problem with storing interview audio in a shared class folder?",
          "options": [
            "Participants' confidentiality is not protected",
            "The audio may contain plagiarised ideas",
            "The recordings count as fabricated data",
            "The shared folder makes the study less reproducible"
          ],
          "answer": 0,
          "why": {
            "en": "Identifiable recordings must be kept in controlled storage with named access; a shared folder exposes participants.",
            "ru": "Опознаваемые записи хранят в контролируемом месте с доступом по списку; общая папка раскрывает участников."
          },
          "wrong": [
            {
              "en": "The risk is to the people recorded, not to the originality of ideas.",
              "ru": "Риск касается записанных людей, а не оригинальности идей."
            },
            {
              "en": "The recordings are real; nothing was invented.",
              "ru": "Записи реальны; ничего не выдумано."
            },
            {
              "en": "Reproducibility is not the issue; uncontrolled access to identifiable data is.",
              "ru": "Проблема не в воспроизводимости, а в неконтролируемом доступе к опознаваемым данным."
            }
          ],
          "id": "rm-l3-p1-19"
        },
        {
          "q": "A student who wrote all of the data-analysis code is left off the author list and is not thanked anywhere. What is this?",
          "options": [
            "Ghost authorship",
            "Gift authorship",
            "Duplication",
            "Conflict of interest"
          ],
          "answer": 0,
          "why": {
            "en": "Leaving out a real contributor hides credit and responsibility — ghost authorship. A contribution statement prevents it.",
            "ru": "Исключение реального участника скрывает вклад и ответственность — это скрытое авторство. Заявление о вкладе это предотвращает."
          },
          "wrong": [
            {
              "en": "Gift authorship adds an undeserving name; here a deserving one is missing.",
              "ru": "Подарочное авторство добавляет незаслуженное имя; здесь пропало заслуженное."
            },
            {
              "en": "Duplication re-presents the same work as new; nothing is published twice here.",
              "ru": "Дублирование — повторная подача той же работы; здесь ничего не публикуется дважды."
            },
            {
              "en": "No funding or relationship is biasing judgement; the issue is missing credit.",
              "ru": "Финансирование или отношения не искажают суждение; проблема — непризнанный вклад."
            }
          ],
          "id": "rm-l3-p1-20"
        }
      ]
    },
    {
      "id": "rm-l3-p2",
      "title": {
        "en": "Protecting people and data: risk → safeguard → evidence",
        "ru": "Защита людей и данных: риск → мера защиты → подтверждение"
      },
      "notes": {
        "en": "## Informed consent is a process, not a signature\nBefore agreeing, a participant must be able to:\n- **Understand** — the purpose, the tasks, the risks and what happens to the data (who sees it, where it is kept, for how long).\n- **Choose** — take part voluntarily, without pressure. Watch power relations: teacher–student, employer–employee.\n- **Withdraw** — use a clear route out and know its practical limits (an anonymous answer cannot be found and removed later).\n- **Ask** — reach a contact for questions or complaints.\n> Consent must match what will actually happen to the data. Recording audio, video or location needs explicit disclosure and permission.\nEvidence: a dated **participant information sheet** and **signed consent forms** or an e-consent log with timestamps.\n## Plan the data lifecycle before collection\n= Collect → Store → Access → Retain → Delete / Share\n- **Collect** only what the question needs — **data minimisation**.\n- **Store** in an encrypted or institution-approved location, not a shared class folder or a personal chat.\n- **Access** — named people and roles.\n- **Retain** — a justified period.\n- **Delete / share** — the method, the permission and a record of when it happened.\n> Never promise a protection your workflow cannot deliver: \"anonymous\" while collecting emails is a false promise.\n## Online data: publicly accessible is not ethically simple\n- **Expectations** — did users reasonably expect research use or wider publication?\n- **Sensitivity** — could quotes, locations or combinations re-identify someone? A verbatim quote can be searched back to its author.\n- **Platform terms** — is automated collection permitted and technically responsible?\n- **Presentation** — could the result expose or stigmatise a person or group?\nLegal access and ethical use are related but different questions.\n## When in doubt, pause before collecting data\n| Prompt | Action |\n|---|---|\n| People or identifiable traces? | YES → ethics review may be required |\n| Sensitive, vulnerable or high-risk context? | YES → stronger review and safeguards |\n| Institutional policy or external partner? | CHECK → follow the applicable process |\n| Change after approval? | REPORT → seek an amendment before proceeding |\nThe local ethics committee, not the slide, decides the formal route. Evidence: an **approval letter** with a reference number.\n## The ethics card: risk → safeguard → evidence\n= DATA · PEOPLE · RISK · SAFEGUARD · EVIDENCE\nThe safeguard must be **specific enough to perform**; the evidence must be a **record another person could inspect**, not an intention.\n| Risk | Specific safeguard | Evidence / record |\n|---|---|---|\n| participants do not know what is recorded | information sheet + consent form | signed consent records (form version) |\n| more data than the question needs | data minimisation; protective default (off, opt-in) | settings / configuration audit log |\n| identities exposed in the dataset | pseudonymised IDs; key stored apart; raw video deleted | de-identification log; deletion record |\n| unauthorised access | encrypted, approved storage; named access | access-control list and access log |\n| pressure to take part | recruitment and consent away from the boss | recruitment script; consent log |\n| study run without review | ethics committee review before collection | approval letter with reference number |\n> Exam trap: \"store the data securely\" is too vague, and \"we will be careful\" is not evidence. Name the mechanism and the record.",
        "ru": "## Информированное согласие — процесс, а не подпись\nПрежде чем согласиться, участник должен иметь возможность:\n- **Understand (понять)** — цель, задания, риски и что будет с данными (кто их увидит, где они хранятся, как долго).\n- **Choose (выбрать)** — участвовать добровольно, без давления. Важны отношения власти: преподаватель — студент, работодатель — сотрудник.\n- **Withdraw (выйти)** — воспользоваться понятным способом отказаться и знать его практические пределы (анонимный ответ потом нельзя найти и удалить).\n- **Ask (спросить)** — связаться с контактным лицом для вопросов и жалоб.\n> Согласие должно соответствовать тому, что реально произойдёт с данными. Запись аудио, видео или геолокации требует явного предупреждения и разрешения.\nПодтверждение: датированный **информационный лист участника (participant information sheet)** и **подписанные формы согласия** или журнал электронного согласия с отметками времени.\n## Жизненный цикл данных планируют до сбора\n= Collect → Store → Access → Retain → Delete / Share\n- **Collect (сбор)** — только то, что нужно вопросу, — **минимизация данных (data minimisation)**.\n- **Store (хранение)** — в зашифрованном или одобренном вузом месте, а не в общей папке группы или личном чате.\n- **Access (доступ)** — названные люди и роли.\n- **Retain (срок хранения)** — обоснованный период.\n- **Delete / share (удаление или передача)** — способ, разрешение и запись о том, когда это сделано.\n> Никогда не обещайте защиту, которую ваш процесс не может обеспечить: «анонимно» при сборе почты — ложное обещание.\n## Онлайн-данные: публично доступное — не значит этически простое\n- **Ожидания** — могли ли пользователи разумно ожидать исследовательского использования или широкой публикации?\n- **Чувствительность** — можно ли по цитатам, местам или их сочетанию опознать человека? Дословную цитату можно найти поиском и выйти на автора.\n- **Условия платформы** — разрешён ли автоматический сбор и технически ли он ответственен?\n- **Подача** — может ли результат выставить напоказ или заклеймить человека либо группу?\nЗаконный доступ и этичное использование — связанные, но разные вопросы.\n## Сомневаетесь — остановитесь до сбора данных\n| Вопрос | Действие |\n|---|---|\n| Люди или опознаваемые следы? | ДА → может понадобиться этическая экспертиза |\n| Чувствительный, уязвимый или рискованный контекст? | ДА → усиленная проверка и меры защиты |\n| Политика вуза или внешний партнёр? | ПРОВЕРИТЬ → следовать применимой процедуре |\n| Изменение после одобрения? | СООБЩИТЬ → получить поправку (amendment) до продолжения |\nФормальный путь определяет местный этический комитет, а не слайд. Подтверждение: **письмо об одобрении (approval letter)** с номером решения.\n## Этическая карточка: риск → мера защиты → подтверждение\n= DATA · PEOPLE · RISK · SAFEGUARD · EVIDENCE\nМера защиты (safeguard) должна быть **достаточно конкретной, чтобы её выполнить**; подтверждение (evidence) — **записью, которую может проверить другой человек**, а не намерением.\n| Риск | Конкретная мера защиты | Подтверждение / запись |\n|---|---|---|\n| участники не знают, что записывается | информационный лист + форма согласия | подписанные формы согласия (версия формы) |\n| данных больше, чем нужно вопросу | минимизация; защитная настройка по умолчанию (выключено, opt-in) | журнал аудита настроек / конфигурации |\n| личности раскрыты в наборе данных | псевдонимы; ключ хранится отдельно; исходное видео удаляется | журнал обезличивания; запись об удалении |\n| несанкционированный доступ | зашифрованное одобренное хранилище; доступ по списку | список доступа и журнал доступа |\n| давление, чтобы участвовать | набор и согласие без участия начальника | сценарий набора; журнал согласий |\n| исследование без экспертизы | экспертиза этического комитета до сбора | письмо об одобрении с номером |\n> Ловушка экзамена: «хранить данные безопасно» — слишком размыто, а «мы будем осторожны» — не подтверждение. Назовите механизм и запись."
      },
      "questions": [
        {
          "q": "A participant signed a consent form, but the form never said that the interview would be audio-recorded. What is the problem?",
          "options": [
            "Consent does not cover what actually happens to the data",
            "Nothing — the signature alone makes the consent fully valid",
            "The study needed anonymity rather than consent",
            "Recording is fine if the audio is deleted later"
          ],
          "answer": 0,
          "why": {
            "en": "Recording an interview needs explicit disclosure and permission; consent must match what will actually happen to the data.",
            "ru": "Запись интервью требует явного предупреждения и разрешения; согласие должно соответствовать тому, что реально произойдёт с данными."
          },
          "wrong": [
            {
              "en": "Consent is a process, not a signature: it must match the real data use, including the recording.",
              "ru": "Согласие — процесс, а не подпись: оно должно соответствовать реальному использованию данных, включая запись."
            },
            {
              "en": "Anonymity does not replace consent, and a recorded voice is hardly anonymous anyway.",
              "ru": "Анонимность не заменяет согласие, да и записанный голос трудно назвать анонимным."
            },
            {
              "en": "Deleting later does not replace permission before recording.",
              "ru": "Последующее удаление не заменяет разрешения до записи."
            }
          ],
          "id": "rm-l3-p2-1"
        },
        {
          "q": "A lecturer asks her own students to fill in a research survey during class time. Which element of consent is most at risk?",
          "options": [
            "Choosing freely without pressure",
            "Understanding the study's purpose",
            "Having a contact for complaints",
            "Knowing how results are analysed"
          ],
          "answer": 0,
          "why": {
            "en": "Voluntariness is at risk when the researcher has power over participants (teacher–student, employer–employee). Recruitment by someone else or an anonymous online form reduces the pressure.",
            "ru": "Добровольность под угрозой, когда у исследователя есть власть над участниками (преподаватель — студент, работодатель — сотрудник). Набор через третье лицо или анонимная онлайн-форма снижают давление."
          },
          "wrong": [
            {
              "en": "The purpose can be explained well; the issue is the power relation between lecturer and students.",
              "ru": "Цель можно объяснить хорошо; проблема — в отношениях власти между преподавателем и студентами."
            },
            {
              "en": "A contact can be given easily; it does not remove the pressure.",
              "ru": "Контакт легко указать, но давление он не снимает."
            },
            {
              "en": "Analysis methods are not one of the four consent elements.",
              "ru": "Метод анализа не входит в четыре элемента согласия."
            }
          ],
          "id": "rm-l3-p2-2"
        },
        {
          "q": "Interviewees appear as P01–P12 in the transcripts; the name–code key is kept in a separate locked file. What is the accurate privacy term?",
          "options": [
            "Confidential, pseudonymised data",
            "Anonymous data, since no names appear",
            "Public data, since codes are not personal",
            "Aggregated data, since only codes remain"
          ],
          "answer": 0,
          "why": {
            "en": "Pseudonyms reduce exposure but do not create anonymity: the team can still re-identify people through the key.",
            "ru": "Псевдонимы снижают риск, но не создают анонимность: через ключ команда всё ещё может опознать людей."
          },
          "wrong": [
            {
              "en": "While the key exists, every code can be linked back to a person — that is not anonymity.",
              "ru": "Пока ключ существует, каждый код можно связать с человеком — это не анонимность."
            },
            {
              "en": "Codes linked to a key are still personal data; nothing here is public.",
              "ru": "Коды, связанные с ключом, остаются персональными данными; ничего публичного здесь нет."
            },
            {
              "en": "Aggregation means group-level figures; these are individual transcripts.",
              "ru": "Агрегирование — это данные по группе; здесь индивидуальные расшифровки."
            }
          ],
          "id": "rm-l3-p2-3"
        },
        {
          "q": "Which design makes survey responses genuinely anonymous?",
          "options": [
            "A form that never collects names, emails or IP addresses",
            "Names replaced by codes, with the key kept by the supervisor",
            "Names stored only on an encrypted university drive",
            "Answers shown only as group averages in the paper"
          ],
          "answer": 0,
          "why": {
            "en": "Anonymity means the researcher cannot reasonably link a response to a person — the safest way is never to collect identifiers.",
            "ru": "Анонимность — исследователь не может разумным способом связать ответ с человеком; надёжнее всего вообще не собирать идентификаторы."
          },
          "wrong": [
            {
              "en": "A key means the responses can be re-linked: that is pseudonymisation.",
              "ru": "Ключ позволяет снова связать ответы с людьми: это псевдонимизация."
            },
            {
              "en": "Encryption protects confidentiality; the identities are still known.",
              "ru": "Шифрование защищает конфиденциальность; личности по-прежнему известны."
            },
            {
              "en": "Reporting averages protects the publication, but the team's dataset still identifies people.",
              "ru": "Средние по группе защищают публикацию, но набор данных команды по-прежнему опознаёт людей."
            }
          ],
          "id": "rm-l3-p2-4"
        },
        {
          "q": "A survey promises “fully anonymous” answers but collects university emails to send reminders. Which principle is broken?",
          "options": [
            "Never promise a protection the workflow cannot deliver",
            "Store all data only in an institution-approved location",
            "Report changes after approval as an amendment",
            "Keep the data only for a justified retention period"
          ],
          "answer": 0,
          "why": {
            "en": "With emails attached, answers are at best confidential; promising anonymity misleads participants.",
            "ru": "Если к ответам привязана почта, они в лучшем случае конфиденциальны; обещание анонимности вводит участников в заблуждение."
          },
          "wrong": [
            {
              "en": "Storage may be fine; the problem is the false promise of anonymity.",
              "ru": "Хранение может быть в порядке; проблема — ложное обещание анонимности."
            },
            {
              "en": "No change after approval is described in the case.",
              "ru": "В этом случае нет изменения после одобрения."
            },
            {
              "en": "Retention is not the issue; emails make the answers identifiable.",
              "ru": "Дело не в сроке хранения: почта делает ответы опознаваемыми."
            }
          ],
          "id": "rm-l3-p2-5"
        },
        {
          "q": "At which data-lifecycle stage do you name the people and roles allowed to open the data?",
          "options": [
            "Access",
            "Store",
            "Retain",
            "Collect"
          ],
          "answer": 0,
          "why": {
            "en": "Collect → Store → Access → Retain → Delete/Share: Access means named people and roles.",
            "ru": "Collect → Store → Access → Retain → Delete/Share: Access — это названные люди и роли."
          },
          "wrong": [
            {
              "en": "Store is about where the data are kept (an encrypted, approved location).",
              "ru": "Store — о том, где хранятся данные (зашифрованное, одобренное место)."
            },
            {
              "en": "Retain is about how long the data are kept.",
              "ru": "Retain — о том, как долго хранятся данные."
            },
            {
              "en": "Collect is about which data are gathered at all.",
              "ru": "Collect — о том, какие данные вообще собираются."
            }
          ],
          "id": "rm-l3-p2-7"
        },
        {
          "q": "Which retention and deletion plan is acceptable?",
          "options": [
            "Delete raw audio once transcripts are checked, and record the date",
            "Keep all the recordings indefinitely in case they become useful later",
            "Keep the recordings on a personal phone until graduation day",
            "Let each team member decide when to delete their own copy"
          ],
          "answer": 0,
          "why": {
            "en": "Retain for a justified period, then delete by a defined method and keep a record of when it happened.",
            "ru": "Хранить обоснованный срок, затем удалить определённым способом и записать, когда это сделано."
          },
          "wrong": [
            {
              "en": "Indefinite storage of identifiable data has no justification.",
              "ru": "Бессрочное хранение опознаваемых данных ничем не обосновано."
            },
            {
              "en": "A personal phone is not approved storage, and the period is not justified by the research.",
              "ru": "Личный телефон — не одобренное хранилище, а срок не обоснован исследованием."
            },
            {
              "en": "Uncontrolled copies and no record of deletion break the lifecycle plan.",
              "ru": "Неконтролируемые копии и отсутствие записи об удалении ломают план жизненного цикла."
            }
          ],
          "id": "rm-l3-p2-8"
        },
        {
          "q": "A student quotes public forum posts word for word in a paper, with the usernames removed. Which risk remains?",
          "options": [
            "A search for the quote can lead back to its author",
            "None, because public posts carry no ethical risk",
            "The quotes turn into fabricated data without names",
            "Removing usernames makes the quotes plagiarism"
          ],
          "answer": 0,
          "why": {
            "en": "Verbatim quotes are searchable, so they can re-identify people even without usernames; paraphrasing or combining quotes reduces the risk.",
            "ru": "Дословные цитаты находятся поиском, поэтому могут раскрыть людей и без имён; пересказ или объединение цитат снижает риск."
          },
          "wrong": [
            {
              "en": "Public is not ethically simple: expectations and sensitivity still matter.",
              "ru": "Публичное не значит этически простое: ожидания и чувствительность по-прежнему важны."
            },
            {
              "en": "The quotes are real; removing names does not invent anything.",
              "ru": "Цитаты реальны; удаление имён ничего не выдумывает."
            },
            {
              "en": "Plagiarism is about missing attribution of sources, not about protecting participants.",
              "ru": "Плагиат — о неуказанных источниках, а не о защите участников."
            }
          ],
          "id": "rm-l3-p2-9"
        },
        {
          "q": "A platform's terms allow automated collection of public profiles. Does this settle the ethics of scraping them for a study?",
          "options": [
            "No — expectations, sensitivity and presentation still matter",
            "Yes — legal permission is the same thing as ethical approval",
            "Yes, provided the scraped data are kept on an encrypted drive",
            "No — scraping is always forbidden in student research projects"
          ],
          "answer": 0,
          "why": {
            "en": "Platform terms are only one of four checks: expectations, sensitivity, platform terms and presentation.",
            "ru": "Условия платформы — лишь одна из четырёх проверок: ожидания, чувствительность, условия платформы и подача."
          },
          "wrong": [
            {
              "en": "Legal access and ethical use are related but different questions.",
              "ru": "Законный доступ и этичное использование — связанные, но разные вопросы."
            },
            {
              "en": "Secure storage is one safeguard; it does not answer whether the use is ethical.",
              "ru": "Защищённое хранение — одна из мер; оно не отвечает на вопрос, этично ли использование."
            },
            {
              "en": "The lecture asks for checks and safeguards, not a blanket ban.",
              "ru": "Лекция требует проверок и мер защиты, а не полного запрета."
            }
          ],
          "id": "rm-l3-p2-10"
        },
        {
          "q": "Which record best shows that a study was reviewed by an ethics committee?",
          "options": [
            "An approval letter with a reference number",
            "A sentence in the method saying the study is ethical",
            "A supervisor's verbal OK given during a class",
            "A list of all participants with their full names"
          ],
          "answer": 0,
          "why": {
            "en": "The formal route is decided by the local ethics committee; its approval letter (and any amendments) is the evidence.",
            "ru": "Формальный путь определяет местный этический комитет; подтверждение — его письмо об одобрении (и поправки)."
          },
          "wrong": [
            {
              "en": "A self-declaration is an intention, not evidence of review.",
              "ru": "Самодекларация — это намерение, а не подтверждение экспертизы."
            },
            {
              "en": "A verbal OK leaves no record and is not the formal route.",
              "ru": "Устное «да» не оставляет записи и не является формальной процедурой."
            },
            {
              "en": "This is personal data, not proof of review — and it creates a new risk.",
              "ru": "Это персональные данные, а не подтверждение экспертизы, — и новый риск."
            }
          ],
          "id": "rm-l3-p2-12"
        },
        {
          "q": "On the five-line ethics card, what belongs on the EVIDENCE line?",
          "options": [
            "The consent, approval or record that proves the safeguard",
            "The kinds of data that the study will collect from participants",
            "The people who could be affected by the study",
            "What could go wrong if nothing is done about it"
          ],
          "answer": 0,
          "why": {
            "en": "DATA · PEOPLE · RISK · SAFEGUARD · EVIDENCE — evidence is what proves the safeguard was applied.",
            "ru": "DATA · PEOPLE · RISK · SAFEGUARD · EVIDENCE — подтверждение доказывает, что мера применена."
          },
          "wrong": [
            {
              "en": "That is the DATA line.",
              "ru": "Это строка DATA."
            },
            {
              "en": "That is the PEOPLE line.",
              "ru": "Это строка PEOPLE."
            },
            {
              "en": "That is the RISK line.",
              "ru": "Это строка RISK."
            }
          ],
          "id": "rm-l3-p2-13"
        },
        {
          "q": "Which safeguard is specific enough to perform and to check?",
          "options": [
            "Audio on the encrypted university drive, open to two named researchers",
            "All the data will be handled responsibly and securely by the team",
            "The team will follow good ethical practice throughout the study",
            "Everyone in the project group promises to be careful with the recordings"
          ],
          "answer": 0,
          "why": {
            "en": "A safeguard names the mechanism, the place and the people; then it can produce a record (an access list or log).",
            "ru": "Мера защиты называет механизм, место и людей; тогда она даёт запись (список или журнал доступа)."
          },
          "wrong": [
            {
              "en": "Too vague: no mechanism, no place, no people.",
              "ru": "Слишком размыто: нет механизма, места и людей."
            },
            {
              "en": "A general intention, not an operational safeguard.",
              "ru": "Общее намерение, а не выполнимая мера."
            },
            {
              "en": "A promise is not a mechanism, and it leaves no record.",
              "ru": "Обещание — не механизм и не оставляет записи."
            }
          ],
          "id": "rm-l3-p2-14"
        },
        {
          "q": "Pseudonymised data are no longer personal data, so data-protection rules stop applying.",
          "options": [
            "True",
            "False"
          ],
          "answer": 1,
          "fixed": true,
          "why": {
            "en": "False: while a key can re-link codes to people, pseudonymised data remain personal data and must be protected.",
            "ru": "Неверно: пока ключ позволяет связать коды с людьми, псевдонимизированные данные остаются персональными и требуют защиты."
          },
          "wrong": [
            {
              "en": "“True” confuses pseudonymisation with anonymisation; only irreversible de-identification takes data out of scope.",
              "ru": "Ответ «верно» путает псевдонимизацию с анонимизацией; только необратимое обезличивание выводит данные из-под этих правил."
            }
          ],
          "id": "rm-l3-p2-20"
        }
      ]
    },
    {
      "id": "rm-l3-p3",
      "title": {
        "en": "Verifying sources and using AI responsibly",
        "ru": "Проверка источников и ответственная работа с ИИ"
      },
      "notes": {
        "en": "## A reference must exist before it can support a claim\n| Check | Question | How |\n|---|---|---|\n| Identity | Is it the same work? | match title, authors, year and venue across records |\n| Traceability | Can others find it? | a DOI, a publisher page or a stable repository record |\n| Fitness | Can it support this claim? | read the method and result, not only the title or abstract |\n> Verification answers existence. Evaluation answers quality and relevance. A real paper can still be weak or irrelevant; an impressive citation can still be fabricated.\n## The verification ladder\n- **1 READ** — the title and abstract match the topic.\n- **2 MATCH** — find the publisher or trusted repository record (journal site, ACM Digital Library, IEEE Xplore, arXiv), not just a line in someone's reference list.\n- **3 RESOLVE** — open the DOI or search Crossref Metadata Search (search.crossref.org) by title, author or DOI; the metadata must match.\n- **4 CHECK** — corrections, retractions, expressions of concern and the version (preprint or published).\n- **5 OPEN** — the method and result actually support your claim.\n= VERIFIED: record link + matched metadata + date checked · UNRESOLVED: do not cite as confirmed evidence\n## A DOI is an identifier, not a quality badge\n= https://doi.org/10.<prefix>/<suffix>\n| A DOI can help | A DOI cannot prove |\n|---|---|\n| resolve to a stable record | a sound method |\n| match metadata | ethical conduct |\n| distinguish versions | relevance to your claim |\n| support traceability | absence of a later correction |\n- A **missing DOI is not a missing source**: books, theses, standards and some conference papers may only have a stable publisher or repository record.\n- A DOI that **does not resolve, or resolves to a different paper**, is a red flag: the reference is mixed up or invented.\n## Corrections and retractions\n- **Correction** (erratum, corrigendum) — the paper stands, but something in it was fixed; read the notice.\n- **Expression of concern** — the journal warns that a problem is being investigated.\n- **Retraction** — the paper is withdrawn (serious error, fabrication, plagiarism). Do not use it as evidence; mention it only as a retracted study, clearly marked.\n- Where to look: the article page (the notice, the Crossmark status button) and the Retraction Watch Database, now openly available through Crossref.\n## Predatory journals\nThey charge publication fees but skip real peer review. Warning signs:\n- invitation spam; acceptance promised within days; a scope like \"all of engineering and medicine\";\n- invented metrics; indexing in Scopus, Web of Science or DOAJ that the index's own site does not confirm;\n- an editorial board you cannot verify; a title that imitates a well-known journal.\nCheck the journal on the index's own website and use the Think. Check. Submit. checklist.\n> Exam trap: a DOI does not make a journal legitimate — predatory journals register DOIs too.\n## Use AI for support, never as invisible evidence\n| Defensible support | Unacceptable substitution |\n|---|---|\n| search-term candidates | inventing or citing unopened sources |\n| explaining unfamiliar terminology | fabricating data or results |\n| improving grammar after you wrote the text | hiding substantial generated text |\n| challenging a draft argument | uploading protected data without permission |\n| suggesting checks to perform | bypassing course rules |\n## The AI verification contract\n- **NO SOURCE** — no generated reference enters the paper until it is opened.\n- **NO CLAIM** — no generated factual claim stays without evidence.\n- **NO SECRET DATA** — no participant or protected data goes into an unapproved tool.\n- **NO HIDDEN ROLE** — required AI use is disclosed according to course rules.\nThe student stays responsible for every source, claim and sentence. The syllabus allows AI for learning only with the instructor's permission and prohibits it in exams and restricted assessments unless authorised.\n?? An AI-suggested DOI opens a paper with a different title and authors. Is the reference verified?\n?= No — identity fails. Mark it unresolved, search Crossref by title and authors, and cite only a record whose metadata match.\n?? Why is \"it has a DOI\" not enough to trust a paper?\n?= A DOI only identifies a work. It says nothing about method quality, relevance, ethics or a later retraction, and predatory journals have DOIs too.",
        "ru": "## Ссылка должна существовать, прежде чем подкреплять утверждение\n| Проверка | Вопрос | Как |\n|---|---|---|\n| Identity (тождество) | Это та самая работа? | сверить название, авторов, год и издание по разным записям |\n| Traceability (прослеживаемость) | Смогут ли другие её найти? | DOI, страница издателя или стабильная запись репозитория |\n| Fitness (пригодность) | Может ли она подтвердить именно это утверждение? | прочитать метод и результат, а не только название и аннотацию |\n> Верификация отвечает на вопрос о существовании. Оценка — о качестве и релевантности. Настоящая статья может быть слабой или не по теме; впечатляющая ссылка может оказаться выдуманной.\n## Лестница проверки\n- **1 READ** — название и аннотация соответствуют теме.\n- **2 MATCH** — найти запись издателя или надёжного репозитория (сайт журнала, ACM Digital Library, IEEE Xplore, arXiv), а не только строку в чужом списке литературы.\n- **3 RESOLVE** — открыть DOI или найти работу в Crossref Metadata Search (search.crossref.org) по названию, автору или DOI; метаданные должны совпасть.\n- **4 CHECK** — исправления, отзывы (retractions), выражения обеспокоенности и версия (препринт или опубликованная).\n- **5 OPEN** — метод и результат действительно подтверждают ваше утверждение.\n= VERIFIED: record link + matched metadata + date checked · UNRESOLVED: do not cite as confirmed evidence\n## DOI — идентификатор, а не знак качества\n= https://doi.org/10.<prefix>/<suffix>\n| DOI помогает | DOI не доказывает |\n|---|---|\n| привести к стабильной записи | корректность метода |\n| сверить метаданные | этичность исследования |\n| различить версии | релевантность вашему утверждению |\n| обеспечить прослеживаемость | отсутствие более поздних исправлений |\n- **Нет DOI — не значит нет источника:** у книг, диссертаций, стандартов и части докладов конференций может быть только стабильная запись издателя или репозитория.\n- DOI, который **не открывается или ведёт на другую статью**, — тревожный сигнал: ссылка перепутана или выдумана.\n## Исправления и отзывы статей\n- **Correction (исправление)** (erratum, corrigendum) — статья остаётся в силе, но что-то в ней исправлено; прочитайте уведомление.\n- **Expression of concern (выражение обеспокоенности)** — журнал предупреждает, что проблема расследуется.\n- **Retraction (отзыв)** — статья отозвана (серьёзная ошибка, фабрикация, плагиат). Не используйте её как доказательство; упоминать можно только как отозванное исследование, с явной пометкой.\n- Где смотреть: страница статьи (уведомление, кнопка статуса Crossmark) и Retraction Watch Database, теперь открытая через Crossref.\n## Хищнические журналы (predatory journals)\nОни берут плату за публикацию, но пропускают настоящее рецензирование. Тревожные признаки:\n- рассылки-приглашения; приём обещают за несколько дней; тематика вроде «вся инженерия и медицина»;\n- выдуманные метрики; индексация в Scopus, Web of Science или DOAJ, которую не подтверждает сайт самого индекса;\n- редколлегию невозможно проверить; название подражает известному журналу.\nПроверяйте журнал на сайте самого индекса и пользуйтесь чек-листом Think. Check. Submit.\n> Ловушка экзамена: DOI не делает журнал добросовестным — хищнические журналы тоже регистрируют DOI.\n## ИИ — для помощи, но не как невидимое доказательство\n| Допустимая помощь | Недопустимая подмена |\n|---|---|\n| варианты поисковых слов | выдумывать источники или ссылаться на неоткрытые |\n| объяснение незнакомых терминов | фабриковать данные или результаты |\n| правка грамматики уже написанного вами текста | скрывать существенный сгенерированный текст |\n| критика черновика аргумента | загружать защищённые данные без разрешения |\n| подсказки, что проверить | обходить правила курса |\n## Контракт проверки ИИ\n- **NO SOURCE** — сгенерированная ссылка не попадает в работу, пока её не открыли.\n- **NO CLAIM** — сгенерированное фактическое утверждение не остаётся без доказательства.\n- **NO SECRET DATA** — данные участников и защищённые данные не попадают в неодобренный инструмент.\n- **NO HIDDEN ROLE** — требуемое раскрытие использования ИИ делается по правилам курса.\nЗа каждый источник, утверждение и предложение отвечает студент. Силлабус разрешает ИИ для учёбы только с разрешения преподавателя и запрещает его на экзаменах и в ограниченных заданиях, если это прямо не разрешено.\n?? DOI из ссылки, предложенной ИИ, открывает статью с другим названием и авторами. Ссылка проверена?\n?= Нет — не прошла проверка тождества. Пометить как неподтверждённую, искать в Crossref по названию и авторам и цитировать только запись с совпадающими метаданными.\n?? Почему «у неё есть DOI» недостаточно, чтобы доверять статье?\n?= DOI только идентифицирует работу. Он ничего не говорит о качестве метода, релевантности, этике или позднем отзыве, а у хищнических журналов DOI тоже есть."
      },
      "questions": [
        {
          "q": "Which check confirms that the record you found is the same work as the reference in your list?",
          "options": [
            "Identity: the title, authors, year and venue match",
            "Traceability: the work has a DOI or a stable record",
            "Fitness: the method and result support the claim",
            "Evaluation: the journal has a high impact factor"
          ],
          "answer": 0,
          "why": {
            "en": "Identity means matching the title, authors, year and venue across records.",
            "ru": "Тождество — совпадение названия, авторов, года и издания в разных записях."
          },
          "wrong": [
            {
              "en": "Traceability shows the work can be found, not that it is the one you cited.",
              "ru": "Прослеживаемость показывает, что работу можно найти, а не что это та самая работа."
            },
            {
              "en": "Fitness is about relevance and is checked after identity.",
              "ru": "Пригодность — о релевантности; её проверяют после тождества."
            },
            {
              "en": "Journal metrics say nothing about whether this record is the cited work.",
              "ru": "Метрики журнала ничего не говорят о том, та ли это работа."
            }
          ],
          "id": "rm-l3-p3-2"
        },
        {
          "q": "On the verification ladder, which step comes right after MATCH?",
          "options": [
            "RESOLVE — open the DOI or the Crossref metadata",
            "READ — the title and abstract fit the topic",
            "OPEN — the method and the result support the claim",
            "CHECK — corrections, retractions and version"
          ],
          "answer": 0,
          "why": {
            "en": "READ → MATCH → RESOLVE → CHECK → OPEN.",
            "ru": "READ → MATCH → RESOLVE → CHECK → OPEN."
          },
          "wrong": [
            {
              "en": "READ is the first step, before MATCH.",
              "ru": "READ — первая ступень, до MATCH."
            },
            {
              "en": "OPEN is the last step.",
              "ru": "OPEN — последняя ступень."
            },
            {
              "en": "CHECK comes after RESOLVE.",
              "ru": "CHECK идёт после RESOLVE."
            }
          ],
          "id": "rm-l3-p3-3"
        },
        {
          "q": "You read version 1 of an arXiv preprint; a peer-reviewed journal version with revised results appeared later. What should the CHECK step lead you to do?",
          "options": [
            "Read the published version; cite the version you relied on",
            "Cite v1, because the first version is always the true original",
            "Cite both versions as two independent supporting studies",
            "Ignore versions, since all versions share a single DOI"
          ],
          "answer": 0,
          "why": {
            "en": "CHECK covers corrections, retractions and the version; results can change between preprint and publication.",
            "ru": "CHECK охватывает исправления, отзывы и версию; результаты могут меняться между препринтом и публикацией."
          },
          "wrong": [
            {
              "en": "The first version may contain results that were later corrected.",
              "ru": "В первой версии могут быть результаты, которые позже исправили."
            },
            {
              "en": "They are one study in two versions; counting it twice inflates the evidence.",
              "ru": "Это одно исследование в двух версиях; считать его дважды — раздувать доказательства."
            },
            {
              "en": "The journal version has its own DOI; DOIs help distinguish versions.",
              "ru": "У журнальной версии свой DOI; DOI как раз помогает различать версии."
            }
          ],
          "id": "rm-l3-p3-4"
        },
        {
          "q": "A conference paper has no DOI, but a university repository holds a stable record whose metadata match. What follows?",
          "options": [
            "It can be verified through the stable repository record",
            "It must be dropped, because every real paper has a DOI",
            "It counts as verified only if Mendeley imports it cleanly",
            "It should be cited with a DOI from a similar paper"
          ],
          "answer": 0,
          "why": {
            "en": "Traceability can come from a DOI, a publisher page or a stable repository record.",
            "ru": "Прослеживаемость обеспечивают DOI, страница издателя или стабильная запись репозитория."
          },
          "wrong": [
            {
              "en": "Books, theses and some conference papers have no DOI; a missing DOI is not a missing source.",
              "ru": "У книг, диссертаций и части докладов нет DOI; нет DOI — не значит нет источника."
            },
            {
              "en": "Mendeley stores records; it does not verify them.",
              "ru": "Mendeley хранит записи, но не проверяет их."
            },
            {
              "en": "Borrowing another paper's DOI fabricates a reference.",
              "ru": "Чужой DOI превращает ссылку в выдуманную."
            }
          ],
          "id": "rm-l3-p3-5"
        },
        {
          "q": "An AI-suggested reference has a DOI, but the DOI opens a paper with a different title and authors. What should you do?",
          "options": [
            "Mark it unresolved; search Crossref by title and authors",
            "Cite it anyway, because the DOI resolves to a real paper",
            "Cite the paper the DOI opens, under the AI's title",
            "Delete the DOI but keep the rest of the reference as it is"
          ],
          "answer": 0,
          "why": {
            "en": "Identity fails, so the source is unresolved: search by title and authors and cite only a record whose metadata match.",
            "ru": "Тождество не подтверждено, значит, источник не проверен: искать по названию и авторам и цитировать только совпадающую запись."
          },
          "wrong": [
            {
              "en": "Resolving is not enough: the metadata must match the reference.",
              "ru": "Открыться мало: метаданные должны совпадать со ссылкой."
            },
            {
              "en": "That mixes two works into a reference that matches neither.",
              "ru": "Так получается ссылка-гибрид, не совпадающая ни с одной работой."
            },
            {
              "en": "Removing the DOI hides the mismatch; the work may not exist at all.",
              "ru": "Удаление DOI прячет несовпадение; работы может вообще не быть."
            }
          ],
          "id": "rm-l3-p3-6"
        },
        {
          "q": "Which of these can a DOI NOT tell you?",
          "options": [
            "Whether the method of the study is sound",
            "Where the stable record of the work is",
            "Which version of the work you are citing",
            "Whether your metadata match the record"
          ],
          "answer": 0,
          "why": {
            "en": "A DOI is an identifier, not a quality badge: it cannot prove the method, ethics, relevance or the absence of a later correction.",
            "ru": "DOI — идентификатор, а не знак качества: он не доказывает метод, этичность, релевантность и отсутствие поздних исправлений."
          },
          "wrong": [
            {
              "en": "Resolving to a stable record is exactly what a DOI does.",
              "ru": "Привести к стабильной записи — именно то, что делает DOI."
            },
            {
              "en": "DOIs help distinguish versions.",
              "ru": "DOI помогает различать версии."
            },
            {
              "en": "Matching metadata against the DOI record is one of its uses.",
              "ru": "Сверка метаданных с записью DOI — одно из его применений."
            }
          ],
          "id": "rm-l3-p3-7"
        },
        {
          "q": "Which service lets you search registered DOI metadata by title, author or DOI?",
          "options": [
            "Crossref Metadata Search",
            "Mendeley Cite for Word",
            "A Turnitin similarity report",
            "The Think. Check. Submit. list"
          ],
          "answer": 0,
          "why": {
            "en": "Crossref Metadata Search (search.crossref.org) is used at the RESOLVE step.",
            "ru": "Crossref Metadata Search (search.crossref.org) используется на ступени RESOLVE."
          },
          "wrong": [
            {
              "en": "Mendeley Cite inserts citations; it is not a DOI registry.",
              "ru": "Mendeley Cite вставляет ссылки; это не реестр DOI."
            },
            {
              "en": "Turnitin checks text overlap, not reference metadata.",
              "ru": "Turnitin проверяет совпадения текста, а не метаданные ссылок."
            },
            {
              "en": "That checklist helps judge journals; it does not resolve DOIs.",
              "ru": "Этот чек-лист помогает оценить журнал, но не открывает DOI."
            }
          ],
          "id": "rm-l3-p3-8"
        },
        {
          "q": "The publisher page of a paper you planned to cite shows a retraction notice. How can you use the paper?",
          "options": [
            "Only as a clearly marked retracted example, not as evidence",
            "As evidence, if the paper still has a valid DOI and many citations",
            "As evidence, if you cite the preprint version instead",
            "As evidence, if the retraction happened years ago"
          ],
          "answer": 0,
          "why": {
            "en": "A retraction withdraws the paper; do not use it to support claims.",
            "ru": "Отзыв означает, что статья снята; опираться на неё в утверждениях нельзя."
          },
          "wrong": [
            {
              "en": "Citations and a DOI do not undo a retraction.",
              "ru": "Цитирования и DOI не отменяют отзыв."
            },
            {
              "en": "The preprint carries the same withdrawn findings.",
              "ru": "В препринте те же отозванные результаты."
            },
            {
              "en": "Time does not restore a withdrawn paper.",
              "ru": "Время не восстанавливает отозванную статью."
            }
          ],
          "id": "rm-l3-p3-9"
        },
        {
          "q": "What is the difference between a correction and a retraction?",
          "options": [
            "A correction fixes part of a paper; a retraction withdraws it",
            "A correction comes from authors; a retraction comes from readers",
            "A correction removes the DOI; a retraction keeps the paper valid",
            "They are two names for the same kind of publisher notice"
          ],
          "answer": 0,
          "why": {
            "en": "Correction (erratum/corrigendum): the paper stands with a fix. Retraction: the paper is withdrawn.",
            "ru": "Исправление (erratum/corrigendum): статья остаётся с поправкой. Отзыв: статья снята."
          },
          "wrong": [
            {
              "en": "Both are issued by the journal or publisher (often with the authors).",
              "ru": "Оба выпускает журнал или издатель (часто вместе с авторами)."
            },
            {
              "en": "Neither removes the DOI, and a retraction means the paper is not valid evidence.",
              "ru": "Ни то, ни другое не удаляет DOI, а отзыв означает, что статья не годится как доказательство."
            },
            {
              "en": "They differ: the corrected paper stands, the retracted one does not.",
              "ru": "Они различаются: исправленная статья остаётся в силе, отозванная — нет."
            }
          ],
          "id": "rm-l3-p3-10"
        },
        {
          "q": "A journal emails you: “Publication within 72 hours after payment, all topics welcome.” What does this suggest?",
          "options": [
            "Warning signs of a predatory journal",
            "A fast but rigorous peer-review process",
            "A journal indexed in Scopus and DOAJ",
            "A high-quality open-access journal"
          ],
          "answer": 0,
          "why": {
            "en": "Spam invitations, acceptance within days and an unlimited scope are classic predatory signs.",
            "ru": "Рассылки, приём за дни и безграничная тематика — классические признаки хищнического журнала."
          },
          "wrong": [
            {
              "en": "Real peer review cannot be done in 72 hours for any topic.",
              "ru": "Настоящее рецензирование по любой теме за 72 часа невозможно."
            },
            {
              "en": "Nothing in the email shows indexing; claims must be checked on the index's own site.",
              "ru": "Письмо не доказывает индексацию; её проверяют на сайте самого индекса."
            },
            {
              "en": "Open access is legitimate, but speed for payment and an unlimited scope are red flags.",
              "ru": "Открытый доступ законен, но скорость за плату и безграничная тематика — тревожные сигналы."
            }
          ],
          "id": "rm-l3-p3-11"
        },
        {
          "q": "A journal's homepage displays a Scopus logo. How do you verify the indexing claim?",
          "options": [
            "Look the journal up on the Scopus source list",
            "Trust the logo, as journals cannot use it falsely",
            "Check that the journal's articles have DOIs",
            "Count how many articles it publishes a year"
          ],
          "answer": 0,
          "why": {
            "en": "Claimed indexing must be confirmed on the index's own website.",
            "ru": "Заявленную индексацию подтверждают на сайте самого индекса."
          },
          "wrong": [
            {
              "en": "Predatory journals often display logos and metrics they do not have.",
              "ru": "Хищнические журналы часто показывают логотипы и метрики, которых у них нет."
            },
            {
              "en": "Predatory journals can register DOIs too.",
              "ru": "Хищнические журналы тоже могут регистрировать DOI."
            },
            {
              "en": "Volume says nothing about indexing — a flood of papers is itself a warning sign.",
              "ru": "Объём ничего не говорит об индексации, а поток статей сам по себе тревожный признак."
            }
          ],
          "id": "rm-l3-p3-12"
        },
        {
          "q": "A DOI proves that the journal publishing the paper is legitimate.",
          "options": [
            "True",
            "False"
          ],
          "answer": 1,
          "fixed": true,
          "why": {
            "en": "False: a DOI only identifies a work; predatory journals can register DOIs too.",
            "ru": "Неверно: DOI лишь идентифицирует работу; хищнические журналы тоже могут регистрировать DOI."
          },
          "wrong": [
            {
              "en": "“True” treats an identifier as a quality badge — exactly the confusion the lecture warns about.",
              "ru": "Ответ «верно» принимает идентификатор за знак качества — именно об этой путанице предупреждает лекция."
            }
          ],
          "id": "rm-l3-p3-13"
        },
        {
          "q": "Which use of AI is defensible support in a research project?",
          "options": [
            "Generating candidate search terms for a database",
            "Citing a paper the AI summarised without opening it",
            "Letting the AI fill in missing survey answers",
            "Pasting interview transcripts into a public chatbot"
          ],
          "answer": 0,
          "why": {
            "en": "Support helps your thinking (search terms, terminology, grammar after writing, challenging an argument, suggesting checks); substitution replaces evidence or authorship.",
            "ru": "Помощь поддерживает мышление (поисковые слова, термины, грамматика после написания, критика аргумента, подсказки проверок); подмена заменяет доказательства или авторство."
          },
          "wrong": [
            {
              "en": "That breaks NO SOURCE: the reference must be opened.",
              "ru": "Это нарушает NO SOURCE: ссылку нужно открыть."
            },
            {
              "en": "That is fabrication of data.",
              "ru": "Это фабрикация данных."
            },
            {
              "en": "That breaks NO SECRET DATA.",
              "ru": "Это нарушает NO SECRET DATA."
            }
          ],
          "id": "rm-l3-p3-16"
        },
        {
          "q": "A student pastes interview transcripts with participants' names into a public AI chatbot to get a summary. Which rule of the verification contract is broken?",
          "options": [
            "NO SECRET DATA",
            "NO SOURCE",
            "NO CLAIM",
            "NO HIDDEN ROLE"
          ],
          "answer": 0,
          "why": {
            "en": "No participant or protected data may enter an unapproved tool — it would also break consent and confidentiality.",
            "ru": "Данные участников и защищённые данные не попадают в неодобренный инструмент — иначе нарушаются согласие и конфиденциальность."
          },
          "wrong": [
            {
              "en": "NO SOURCE is about unopened generated references.",
              "ru": "NO SOURCE — о неоткрытых сгенерированных ссылках."
            },
            {
              "en": "NO CLAIM is about generated facts without evidence.",
              "ru": "NO CLAIM — о сгенерированных фактах без доказательств."
            },
            {
              "en": "NO HIDDEN ROLE is about disclosing AI use.",
              "ru": "NO HIDDEN ROLE — о раскрытии использования ИИ."
            }
          ],
          "id": "rm-l3-p3-17"
        },
        {
          "q": "Who is responsible when a fabricated reference suggested by an AI tool appears in a submitted assignment?",
          "options": [
            "The student who submitted the work",
            "The company that built the AI tool",
            "The instructor who allowed AI use",
            "Nobody, as the error came from a tool"
          ],
          "answer": 0,
          "why": {
            "en": "The student remains responsible for every source, claim and submitted sentence.",
            "ru": "Студент отвечает за каждый источник, утверждение и поданное предложение."
          },
          "wrong": [
            {
              "en": "The tool's maker is not the author of the assignment.",
              "ru": "Создатель инструмента не автор задания."
            },
            {
              "en": "Permission to use AI for learning does not transfer responsibility.",
              "ru": "Разрешение пользоваться ИИ для учёбы не переносит ответственность."
            },
            {
              "en": "The syllabus states that students are responsible for the accuracy and integrity of their work.",
              "ru": "Силлабус прямо говорит, что студент отвечает за точность и честность своей работы."
            }
          ],
          "id": "rm-l3-p3-19"
        },
        {
          "q": "A missing DOI proves that a source was fabricated.",
          "options": [
            "True",
            "False"
          ],
          "answer": 1,
          "fixed": true,
          "why": {
            "en": "False: books, theses, standards and some conference papers have no DOI but do have a stable publisher or repository record.",
            "ru": "Неверно: у книг, диссертаций, стандартов и части докладов нет DOI, но есть стабильная запись издателя или репозитория."
          },
          "wrong": [
            {
              "en": "“True” confuses a missing DOI with a missing source; the right reaction is to look for another stable record.",
              "ru": "Ответ «верно» путает отсутствие DOI с отсутствием источника; правильная реакция — искать другую стабильную запись."
            }
          ],
          "id": "rm-l3-p3-20"
        }
      ]
    },
    {
      "id": "rm-l3-p4",
      "title": {
        "en": "Attribution, Mendeley and the research proposal",
        "ru": "Ссылки на источники, Mendeley и исследовательское предложение"
      },
      "notes": {
        "en": "## Plagiarism: changing words is not enough\n| Level | What it is | In final work |\n|---|---|---|\n| Copy | the same words without quotation marks and citation | plagiarism |\n| Patchwrite | a few words swapped; the source's structure stays | not acceptable — a learning stage only |\n| Paraphrase | new wording and structure, same idea, with a citation | acceptable |\n| Synthesise | several sources combined into a new analytical point | the goal |\nPlagiarism covers **words, ideas and data** — figures, tables, datasets and code too. A paraphrase still needs a citation, and a translation of someone's text is not your own wording. The syllabus also treats submitting the same work for credit in two courses without both instructors' consent as a violation.\n## Mendeley: a traceable library, not a verifier\n- **Import** — drag a PDF into Mendeley Reference Manager, save a page with the **Web Importer** browser extension, or add an entry manually by its **DOI** (or arXiv ID / PMID), which fills in the metadata.\n- **Verify** — compare the record with the paper's first page and the publisher page: title, full author names, year, venue, volume/pages, DOI. Open the DOI to confirm.\n- **Organise** — the **library** holds every record and syncs with your account; a **collection** groups one project (\"Assignment 1 — core papers\"); **tags** cut across collections (method · dataset · domain · finding) — one concept, one spelling.\n- **Read** — highlight and annotate the PDF; a useful note = claim + evidence + limitation + possible use.\n- **Cite** — insert citations and the bibliography in Word with **Mendeley Cite**.\n> Reference manager ≠ source verifier: Mendeley stores whatever it is given — an AI-invented reference, a wrong year, an all-caps title.\n## Cite while you write: Mendeley Cite in Word\n**Mendeley Cite** is the cite-while-you-write add-in for Microsoft Word; it replaced the citation plugin of the old Mendeley Desktop. Citations stay linked to library records, so the bibliography is generated, not typed.\n- **1** Place the cursor where the evidence is used.\n- **2** Open Mendeley Cite (References tab) and search the verified library.\n- **3** Insert the citation — one or several records.\n- **4** Choose the **citation style** the assignment or journal requires; switching style reformats every citation and the bibliography.\n- **5** Under the References heading, insert the bibliography, then **inspect every entry**.\n| | APA (7th edition) | IEEE |\n|---|---|---|\n| In text | author–date: (Ali & Chen, 2024) | number in brackets: [1] |\n| Reference list | alphabetical by the first author's surname | numbered in order of first citation |\n| Typical fields | psychology, education, social sciences | engineering and computing |\n> Exam trap: if an entry is wrong, fix the record in the library and refresh. Hand-edited citation text loses its link to the record, so later updates and style changes may not apply to it.\n## Crafting a research proposal\nA proposal argues that a study is worth doing and can be done. Week 3 builds its skeleton; the ethics card and the verified library slot straight in.\n| Section | What it must contain |\n|---|---|\n| Title | specific: population, factor, outcome — not \"AI for Road Safety\" |\n| Background / problem | what is known, what is missing and why it matters — with verified citations |\n| Aim and objectives | one aim; 2–4 concrete objectives (steps) that achieve it |\n| Research question(s) | one focused, answerable main question (+ one supporting) |\n| Literature | key verified studies organised by ideas; the gap they leave |\n| Method | evidence needed, participants or data source, collection, procedure, analysis |\n| Ethics | the ethics card: risks, safeguards, evidence; consent; approval route |\n| Timeline | realistic steps by week, including time for ethics approval |\n| References | the bibliography generated in the required style and checked |\n= Problem → Aim → RQ → Evidence → Method → Analysis\nEvery link must follow from the previous one; a broken link is exactly where the proposal needs revision.\n?? A student swaps every third word of a paragraph for a synonym and adds a citation. Acceptable?\n?= No — that is patchwriting: the source's structure stays. Rebuild the idea in your own structure (paraphrase) or quote it.\n?? A draft uses APA, but the assignment asks for IEEE. What changes when the style is switched in Mendeley Cite?\n?= In-text citations become numbers in square brackets in order of first citation, and the bibliography is numbered in that order instead of alphabetical author–date entries.",
        "ru": "## Плагиат: поменять слова недостаточно\n| Уровень | Что это | В итоговой работе |\n|---|---|---|\n| Copy (копирование) | те же слова без кавычек и ссылки | плагиат |\n| Patchwrite (пэтчрайтинг) | заменено несколько слов; структура источника осталась | недопустимо — только этап обучения |\n| Paraphrase (парафраз) | новые слова и структура, та же идея, со ссылкой | допустимо |\n| Synthesise (синтез) | несколько источников объединены в новый аналитический вывод | цель |\nПлагиат касается **слов, идей и данных** — в том числе рисунков, таблиц, датасетов и кода. Парафраз всё равно требует ссылки, а перевод чужого текста не становится вашими словами. Силлабус также считает нарушением сдачу одной и той же работы в двух курсах без согласия обоих преподавателей.\n## Mendeley: прослеживаемая библиотека, а не проверка источников\n- **Import (импорт)** — перетащить PDF в Mendeley Reference Manager, сохранить страницу расширением браузера **Web Importer** или добавить запись вручную по **DOI** (или arXiv ID / PMID) — метаданные подтянутся сами.\n- **Verify (проверка)** — сверить запись с первой страницей статьи и страницей издателя: название, полные имена авторов, год, издание, том/страницы, DOI. Открыть DOI для подтверждения.\n- **Organise (организация)** — **библиотека (library)** хранит все записи и синхронизируется с аккаунтом; **коллекция (collection)** объединяет один проект («Assignment 1 — core papers»); **теги (tags)** проходят сквозь коллекции (method · dataset · domain · finding) — одно понятие, одно написание.\n- **Read (чтение)** — выделения и аннотации в PDF; полезная заметка = утверждение + доказательство + ограничение + возможное применение.\n- **Cite (цитирование)** — ссылки и список литературы в Word через **Mendeley Cite**.\n> Менеджер ссылок ≠ проверка источников: Mendeley хранит всё, что ему дали, — выдуманную ИИ ссылку, неверный год, название заглавными буквами.\n## Cite while you write: Mendeley Cite в Word\n**Mendeley Cite** — надстройка Microsoft Word для цитирования по ходу письма (cite-while-you-write); она заменила плагин цитирования (citation plugin) старого Mendeley Desktop. Ссылки остаются связаны с записями библиотеки, поэтому список литературы генерируется, а не набирается.\n- **1** Поставить курсор туда, где используется доказательство.\n- **2** Открыть Mendeley Cite (вкладка «Ссылки» / References) и найти запись в проверенной библиотеке.\n- **3** Вставить ссылку — на одну или несколько записей.\n- **4** Выбрать **стиль цитирования (citation style)**, которого требует задание или журнал; смена стиля переоформляет все ссылки и список литературы.\n- **5** Под заголовком References вставить список литературы, затем **проверить каждую запись**.\n| | APA (7-е издание) | IEEE |\n|---|---|---|\n| В тексте | автор — дата: (Ali & Chen, 2024) | номер в скобках: [1] |\n| Список литературы | по алфавиту фамилии первого автора | нумерация в порядке первого упоминания |\n| Где принят | психология, образование, социальные науки | инженерия и компьютерные науки |\n> Ловушка экзамена: если запись неверна, исправьте её в библиотеке и обновите. Вручную исправленный текст ссылки теряет связь с записью, и последующие обновления и смена стиля могут к нему не примениться.\n## Как составить исследовательское предложение (research proposal)\nПредложение доказывает, что исследование стоит проводить и его можно провести. Неделя 3 строит его каркас; этическая карточка и проверенная библиотека встают в него напрямую.\n| Раздел | Что должно быть |\n|---|---|\n| Title (название) | конкретное: популяция, фактор, результат — не «AI for Road Safety» |\n| Background / problem (контекст / проблема) | что известно, чего не хватает и почему это важно — с проверенными ссылками |\n| Aim and objectives (цель и задачи) | одна цель; 2–4 конкретные задачи (шаги), которые к ней ведут |\n| Research question(s) (вопросы исследования) | один сфокусированный главный вопрос, на который можно ответить (+ один вспомогательный) |\n| Literature (литература) | ключевые проверенные исследования, сгруппированные по идеям; пробел, который они оставляют |\n| Method (метод) | нужные данные, участники или источник данных, сбор, процедура, анализ |\n| Ethics (этика) | этическая карточка: риски, меры, подтверждения; согласие; путь одобрения |\n| Timeline (план-график) | реалистичные шаги по неделям, включая время на этическое одобрение |\n| References (список литературы) | список, сгенерированный в нужном стиле и проверенный |\n= Problem → Aim → RQ → Evidence → Method → Analysis\nКаждое звено должно вытекать из предыдущего; разорванное звено — именно то место, где предложение нужно переделать.\n?? Студент заменяет каждое третье слово абзаца синонимом и добавляет ссылку. Допустимо?\n?= Нет — это пэтчрайтинг: структура источника сохранилась. Нужно перестроить идею своей структурой (парафраз) или процитировать.\n?? Черновик оформлен в APA, а задание требует IEEE. Что изменится при смене стиля в Mendeley Cite?\n?= Ссылки в тексте станут номерами в квадратных скобках в порядке первого упоминания, а список литературы будет пронумерован в этом порядке вместо алфавитных записей «автор — дата»."
      },
      "questions": [
        {
          "q": "A student keeps a paragraph's sentence structure, swaps several words for synonyms and adds a citation. How is this judged?",
          "options": [
            "Patchwriting — not acceptable in final work",
            "Paraphrase — acceptable because it is cited",
            "Synthesis — acceptable because it is reworded",
            "Quotation — acceptable because it is attributed"
          ],
          "answer": 0,
          "why": {
            "en": "Small substitutions that keep the source's structure are patchwriting — a learning stage, not acceptable final prose.",
            "ru": "Мелкие замены при сохранении структуры источника — пэтчрайтинг (patchwriting): этап обучения, но не допустимый итоговый текст."
          },
          "wrong": [
            {
              "en": "A paraphrase needs a new structure as well as new words; here the source's structure stays.",
              "ru": "Парафразу нужна новая структура, а не только новые слова; здесь структура источника сохранена."
            },
            {
              "en": "Synthesis combines several sources into a new point; this reworks one paragraph.",
              "ru": "Синтез объединяет несколько источников в новый вывод; здесь переделан один абзац."
            },
            {
              "en": "A quotation keeps the exact words in quotation marks; these words were altered.",
              "ru": "Цитата сохраняет точные слова в кавычках; здесь слова изменены."
            }
          ],
          "id": "rm-l3-p4-1"
        },
        {
          "q": "Which statement about paraphrasing is correct?",
          "options": [
            "It still needs a citation, because the idea is borrowed",
            "It needs no citation once the wording is completely new",
            "It is allowed only for sources that have no DOI",
            "It must keep the sentence structure of the source"
          ],
          "answer": 0,
          "why": {
            "en": "Paraphrase = new wording and structure, the same idea, with a citation.",
            "ru": "Парафраз — новые слова и структура, та же идея и ссылка."
          },
          "wrong": [
            {
              "en": "Plagiarism covers ideas, not only words.",
              "ru": "Плагиат касается идей, а не только слов."
            },
            {
              "en": "Paraphrasing is allowed for any source, with a citation.",
              "ru": "Пересказывать можно любой источник — со ссылкой."
            },
            {
              "en": "Keeping the structure is patchwriting; a paraphrase rebuilds it.",
              "ru": "Сохранение структуры — это пэтчрайтинг; парафраз её перестраивает."
            }
          ],
          "id": "rm-l3-p4-2"
        },
        {
          "q": "A student redraws a results chart from a published paper in new colours and puts it in a report without naming the source. What is this?",
          "options": [
            "Plagiarism — the data and figure are taken",
            "Acceptable, since the chart was fully redrawn",
            "Fabrication, since the chart itself is new",
            "Falsification, since the colours were changed"
          ],
          "answer": 0,
          "why": {
            "en": "Plagiarism covers data and figures as well as words; a redrawn chart needs “Adapted from …” with a citation.",
            "ru": "Плагиат касается данных и рисунков, а не только слов; перерисованному графику нужна пометка «Adapted from …» и ссылка."
          },
          "wrong": [
            {
              "en": "Redrawing changes the look, not the owner of the data.",
              "ru": "Перерисовка меняет вид, а не владельца данных."
            },
            {
              "en": "The data are real and come from the paper; nothing was invented.",
              "ru": "Данные реальны и взяты из статьи; ничего не выдумано."
            },
            {
              "en": "Colours do not distort the findings; the problem is missing attribution.",
              "ru": "Цвета не искажают выводы; проблема — нет ссылки."
            }
          ],
          "id": "rm-l3-p4-4"
        },
        {
          "q": "You know a paper's DOI but have no PDF yet. What is the most reliable way to create its Mendeley record?",
          "options": [
            "Add an entry manually and look it up by its DOI number",
            "Type every field by hand from the AI chat's answer",
            "Wait until a PDF is available to drag into the library",
            "Insert the DOI as plain text in the Word document"
          ],
          "answer": 0,
          "why": {
            "en": "Mendeley can fill in metadata from an identifier such as a DOI — the record is then still checked against the publisher page.",
            "ru": "Mendeley может заполнить метаданные по идентификатору, например DOI, — после этого запись всё равно сверяют со страницей издателя."
          },
          "wrong": [
            {
              "en": "An AI answer may be wrong; the DOI lookup pulls registered metadata.",
              "ru": "Ответ ИИ может быть неверным; поиск по DOI берёт зарегистрированные метаданные."
            },
            {
              "en": "No need to wait: a record can be created from the DOI.",
              "ru": "Ждать не нужно: запись можно создать по DOI."
            },
            {
              "en": "Text in Word is not a library record and cannot generate a bibliography.",
              "ru": "Текст в Word — не запись библиотеки, из него не получится список литературы."
            }
          ],
          "id": "rm-l3-p4-6"
        },
        {
          "q": "Which Mendeley tool saves a reference straight from a journal's web page in the browser?",
          "options": [
            "The Web Importer browser extension",
            "Mendeley Cite in Microsoft Word",
            "Crossref Metadata Search",
            "The collection panel of the library"
          ],
          "answer": 0,
          "why": {
            "en": "The Web Importer is a browser extension that captures records (and often PDFs) from publisher and database pages.",
            "ru": "Web Importer — расширение браузера, которое сохраняет записи (часто и PDF) со страниц издателей и баз данных."
          },
          "wrong": [
            {
              "en": "Mendeley Cite inserts citations into documents; it does not capture web pages.",
              "ru": "Mendeley Cite вставляет ссылки в документ, а не сохраняет веб-страницы."
            },
            {
              "en": "Crossref is a metadata search service, not part of Mendeley.",
              "ru": "Crossref — сервис поиска метаданных, а не часть Mendeley."
            },
            {
              "en": "Collections organise records that are already imported.",
              "ru": "Коллекции упорядочивают уже импортированные записи."
            }
          ],
          "id": "rm-l3-p4-7"
        },
        {
          "q": "The Web Importer saved a record with an all-caps title, author initials only and the wrong year. What is the next step?",
          "options": [
            "Correct it against the paper and the publisher page",
            "Cite it as it is, since Mendeley Cite fixes errors",
            "Delete the PDF so that only the metadata remain",
            "Switch citation styles until the entry looks right"
          ],
          "answer": 0,
          "why": {
            "en": "Import first, then repair: compare with the first page and the publisher page; correct the title, names, year, venue, pages and DOI.",
            "ru": "Сначала импорт, затем исправление: сверить с первой страницей и страницей издателя, поправить название, имена, год, издание, страницы и DOI."
          },
          "wrong": [
            {
              "en": "Mendeley Cite formats whatever is in the record, errors included.",
              "ru": "Mendeley Cite оформляет то, что есть в записи, вместе с ошибками."
            },
            {
              "en": "The PDF is what the record is checked against; deleting it helps nothing.",
              "ru": "PDF — то, с чем сверяют запись; удаление ничему не поможет."
            },
            {
              "en": "A style changes formatting, not wrong data.",
              "ru": "Стиль меняет оформление, а не неверные данные."
            }
          ],
          "id": "rm-l3-p4-8"
        },
        {
          "q": "Mendeley automatically detects and rejects fabricated references when they are imported.",
          "options": [
            "True",
            "False"
          ],
          "answer": 1,
          "fixed": true,
          "why": {
            "en": "False: a reference manager stores whatever it is given; verification is the researcher's job.",
            "ru": "Неверно: менеджер ссылок хранит всё, что ему дали; проверка — работа исследователя."
          },
          "wrong": [
            {
              "en": "“True” confuses a reference manager with a source verifier.",
              "ru": "Ответ «верно» путает менеджер ссылок с проверкой источников."
            }
          ],
          "id": "rm-l3-p4-9"
        },
        {
          "q": "In Mendeley, how does a collection differ from a tag?",
          "options": [
            "A collection groups a project's records; a tag labels a concept across them",
            "A tag groups a project's records; a collection labels a concept across them",
            "A collection is stored online; a tag exists only on one computer",
            "A collection holds PDFs; a tag holds the notes written about them"
          ],
          "answer": 0,
          "why": {
            "en": "Collection — e.g., “Assignment 1 — core papers”; tags — method · dataset · domain · finding, spelled consistently.",
            "ru": "Коллекция — например, «Assignment 1 — core papers»; теги — method · dataset · domain · finding, с единым написанием."
          },
          "wrong": [
            {
              "en": "This swaps the two: collections are folder-like groups, tags are cross-cutting labels.",
              "ru": "Здесь они перепутаны: коллекции — группы-папки, теги — сквозные метки."
            },
            {
              "en": "Both sync with the library; the difference is purpose, not storage.",
              "ru": "Оба синхронизируются с библиотекой; разница в назначении, а не в хранении."
            },
            {
              "en": "Records in a collection need not have PDFs, and notes are separate from tags.",
              "ru": "У записей в коллекции может не быть PDF, а заметки — не теги."
            }
          ],
          "id": "rm-l3-p4-10"
        },
        {
          "q": "What is Mendeley Cite?",
          "options": [
            "A cite-while-you-write add-in for documents in Word",
            "A browser extension that saves records from web pages",
            "A service that tells you whether a paper was retracted",
            "A similarity checker that detects plagiarism in Word"
          ],
          "answer": 0,
          "why": {
            "en": "Mendeley Cite inserts citations and the bibliography from your library and applies the chosen style.",
            "ru": "Mendeley Cite вставляет ссылки и список литературы из библиотеки и применяет выбранный стиль."
          },
          "wrong": [
            {
              "en": "That is the Web Importer.",
              "ru": "Это Web Importer."
            },
            {
              "en": "Retraction checks happen on the publisher page or in the Retraction Watch Database.",
              "ru": "Отзыв проверяют на странице издателя или в Retraction Watch Database."
            },
            {
              "en": "Similarity checking is done by tools such as Turnitin.",
              "ru": "Совпадения проверяют инструменты вроде Turnitin."
            }
          ],
          "id": "rm-l3-p4-11"
        },
        {
          "q": "A draft uses APA citations inserted with Mendeley Cite, but the assignment requires IEEE. What is the best fix?",
          "options": [
            "Switch the style in Mendeley Cite and recheck",
            "Retype every citation as a number in square brackets",
            "Delete the bibliography and type a new one by hand",
            "Re-import every paper in IEEE format first"
          ],
          "answer": 0,
          "why": {
            "en": "Changing the style reformats all citations and the bibliography at once; then the entries are inspected.",
            "ru": "Смена стиля переоформляет сразу все ссылки и список литературы; затем записи проверяют."
          },
          "wrong": [
            {
              "en": "Hand-typed citations lose their link to the records and drift out of sync.",
              "ru": "Набранные вручную ссылки теряют связь с записями и расходятся с ними."
            },
            {
              "en": "Typing by hand brings back the errors that the library prevents.",
              "ru": "Ручной набор возвращает ошибки, от которых защищает библиотека."
            },
            {
              "en": "Records store data, not a style; the style is applied in Word.",
              "ru": "Записи хранят данные, а не стиль; стиль применяется в Word."
            }
          ],
          "id": "rm-l3-p4-12"
        },
        {
          "q": "How are the entries of an IEEE reference list ordered?",
          "options": [
            "By the order in which sources are first cited",
            "Alphabetically by the first author's family name",
            "By year of publication, newest first",
            "By journal name, then by volume number"
          ],
          "answer": 0,
          "why": {
            "en": "IEEE numbers sources [1], [2]… in order of first citation; APA lists them alphabetically with (Author, Year) in the text.",
            "ru": "IEEE нумерует источники [1], [2]… в порядке первого упоминания; APA перечисляет их по алфавиту, а в тексте — (Автор, год)."
          },
          "wrong": [
            {
              "en": "That is APA (author–date) ordering.",
              "ru": "Так упорядочен список в APA (автор — дата)."
            },
            {
              "en": "Neither APA nor IEEE orders references by year.",
              "ru": "Ни APA, ни IEEE не упорядочивают список по году."
            },
            {
              "en": "Journal names do not determine the order in either style.",
              "ru": "Название журнала не определяет порядок ни в одном из стилей."
            }
          ],
          "id": "rm-l3-p4-13"
        },
        {
          "q": "A bibliography entry generated by Mendeley Cite shows 2025 instead of 2024. Where should this be fixed?",
          "options": [
            "In the library record, then refresh Word",
            "Directly in the bibliography text in Word",
            "In the citation style settings of Word",
            "In the PDF file attached to the record"
          ],
          "answer": 0,
          "why": {
            "en": "Fix the source of truth — the record — after checking the publisher page or DOI; the bibliography then regenerates correctly.",
            "ru": "Исправлять нужно источник истины — запись, сверив её со страницей издателя или DOI; тогда список литературы пересоберётся правильно."
          },
          "wrong": [
            {
              "en": "A hand edit is lost or out of sync when the bibliography refreshes.",
              "ru": "Ручная правка теряется или расходится при обновлении списка."
            },
            {
              "en": "A style changes formatting; it cannot correct a wrong year.",
              "ru": "Стиль меняет оформление и не исправит неверный год."
            },
            {
              "en": "The PDF is the evidence; the error is in the record's metadata.",
              "ru": "PDF — это доказательство; ошибка в метаданных записи."
            }
          ],
          "id": "rm-l3-p4-14"
        },
        {
          "q": "Changing the citation style in Mendeley Cite reformats the in-text citations and the bibliography together.",
          "options": [
            "True",
            "False"
          ],
          "answer": 0,
          "fixed": true,
          "why": {
            "en": "True: citations stay linked to library records, so a new style is applied everywhere at once — then the result is inspected.",
            "ru": "Верно: ссылки связаны с записями библиотеки, поэтому новый стиль применяется везде сразу — затем результат проверяют."
          },
          "wrong": [
            {
              "en": "“False” would mean retyping citations by hand, which is exactly what cite-while-you-write avoids.",
              "ru": "Ответ «неверно» означал бы перенабор ссылок вручную — именно этого и позволяет избежать cite-while-you-write."
            }
          ],
          "id": "rm-l3-p4-15"
        },
        {
          "q": "A proposal plans data collection in week 1, but ethics review usually takes three weeks. What is wrong?",
          "options": [
            "The timeline must leave time for approval first",
            "Nothing, as approval can be obtained afterwards",
            "The ethics section should simply be removed",
            "Data collection should be shortened to one day"
          ],
          "answer": 0,
          "why": {
            "en": "A realistic timeline includes ethics review before any data collection.",
            "ru": "Реалистичный план-график включает этическую экспертизу до любого сбора данных."
          },
          "wrong": [
            {
              "en": "Approval is needed before collection, not after.",
              "ru": "Одобрение нужно до сбора, а не после."
            },
            {
              "en": "Removing the section does not remove the need for review.",
              "ru": "Удаление раздела не отменяет необходимости экспертизы."
            },
            {
              "en": "Shortening collection does not solve the missing approval.",
              "ru": "Сокращение сбора не решает проблему отсутствующего одобрения."
            }
          ],
          "id": "rm-l3-p4-19"
        },
        {
          "q": "Which chain shows a coherent proposal skeleton?",
          "options": [
            "Problem → Aim → RQ → Evidence → Method → Analysis",
            "Method → RQ → Problem → Analysis → Aim → Evidence",
            "Analysis → Evidence → Aim → Problem → Method → RQ",
            "RQ → Method → Analysis → Problem → Evidence → Aim"
          ],
          "answer": 0,
          "why": {
            "en": "Each element must follow from the previous one; where a link breaks, the design needs revision.",
            "ru": "Каждый элемент вытекает из предыдущего; где звено рвётся, дизайн нужно пересмотреть."
          },
          "wrong": [
            {
              "en": "Starting from a method and fitting a question to it reverses the logic.",
              "ru": "Начинать с метода и подгонять под него вопрос — обратная логика."
            },
            {
              "en": "The analysis cannot be chosen before the question and the evidence are known.",
              "ru": "Анализ нельзя выбрать раньше вопроса и нужных данных."
            },
            {
              "en": "The problem must come first: it justifies the aim and the question.",
              "ru": "Проблема должна быть первой: она обосновывает цель и вопрос."
            }
          ],
          "id": "rm-l3-p4-20"
        }
      ]
    }
  ]
};
