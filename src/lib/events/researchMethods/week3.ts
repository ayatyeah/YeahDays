import { part, q, tf, type Lecture } from "../types";

export const week3: Lecture = {
  id: "rm-w3",
  title: { en: "Week 3 — Research ethics, source verification and Mendeley", ru: "Неделя 3 — Этика исследований, проверка источников и Mendeley" },
  parts: [
    part(
      "rm-w3-p1",
      { en: "Research integrity and misconduct", ru: "Честность в исследованиях и её нарушения" },
      {
        en: `## Would you approve this study?
- A. Scrape public profiles and publish usernames → privacy and re-identification of people.
- B. Remove three low scores because they "look wrong" → falsification.
- C. Use an AI-suggested citation without opening it → a possibly fabricated reference.
- D. Store interview audio in a shared class folder → a confidentiality breach.
## Two responsibilities of research integrity
- **Knowledge** — make claims credible: accurate data, transparent methods, honest limitations, verifiable sources.
- **People** — protect those affected: consent, privacy, fair treatment, secure data, attention to downstream harm.
> A technically correct study can still be unethical.
## Research misconduct: FFP
- **Fabrication — inventing.** Creating data, participants, results or references that never existed: benchmark results for a test never run, fake survey respondents, an invented DOI.
- **Falsification — distorting.** Changing, selecting or hiding data or procedures to misrepresent findings; it includes misleading omission: deleting "bad" runs, editing accuracy values.
- **Plagiarism — taking.** Using another person's words, ideas or data without attribution: copying a paragraph or code from GitHub without citing it.
## Questionable research practices
- **Cherry-picking** — reporting only the metric, run or subgroup that supports the claim.
- **Hidden limits** — presenting a small convenience sample as representative.
- **Duplication** — presenting substantially the same work as new.
- **Gift authorship** — adding a name without a real contribution.
**Disclosure test:** would a reasonable reader make a different decision if this were disclosed? If yes, it must be disclosed.
## Classify the case
"A team tests six models and reports only the best run; the other runs remain saved." This is **falsification**: selective reporting distorts the record. Nothing was invented, nothing was taken. **Repair:** define the reporting rule *before* choosing the result — for example, report the mean and standard deviation over all runs.
## The researcher's role and bias
- Before: state expectations, interests and conflicts.
- During: keep a decision log and apply criteria consistently.
- After: report exceptions, uncertainty and limitations.
Reflexive note: "I may favour ___. I will check this by ___." **Reflexivity** does not mean pretending to be neutral; it means making your decisions visible.`,
        ru: `## Одобрили бы вы такое исследование?
- A. Собрать публичные профили и опубликовать имена пользователей → приватность и риск опознать людей.
- B. Убрать три низких результата, потому что они «выглядят неправильно» → фальсификация.
- C. Использовать ссылку, предложенную ИИ, не открыв её → возможно, выдуманный источник.
- D. Хранить аудио интервью в общей папке группы → нарушение конфиденциальности.
## Две ответственности исследователя
- **Перед знанием** — делать утверждения достоверными: точные данные, прозрачные методы, честные ограничения, проверяемые источники.
- **Перед людьми** — защищать тех, кого затрагивает работа: согласие, приватность, справедливое отношение, защищённые данные, внимание к последствиям.
> Технически корректное исследование всё равно может быть неэтичным.
## Нарушения: FFP
- **Fabrication (фабрикация) — выдумывание.** Создание данных, участников, результатов или ссылок, которых не было: результаты теста, который не запускали, выдуманные респонденты, выдуманный DOI.
- **Falsification (фальсификация) — искажение.** Изменение, отбор или сокрытие данных и процедур, искажающие выводы; сюда входит и умолчание: удалить «плохие» прогоны, поправить значения точности.
- **Plagiarism (плагиат) — присвоение.** Использование чужих слов, идей или данных без указания автора: скопировать абзац или код с GitHub без ссылки.
## Сомнительные практики
- **Cherry-picking** — сообщать только ту метрику, прогон или подгруппу, которые подтверждают утверждение.
- **Скрытые ограничения** — выдавать небольшую удобную выборку за репрезентативную.
- **Дублирование** — подавать по сути ту же работу как новую.
- **Подарочное авторство** — вписать человека без реального вклада.
**Тест на раскрытие:** принял бы разумный читатель другое решение, если бы это было раскрыто? Если да — раскрывать обязательно.
## Определи случай
«Команда тестирует шесть моделей и сообщает только лучший прогон; остальные сохранены». Это **фальсификация**: выборочный отчёт искажает картину. Ничего не выдумано и ничего не присвоено. **Как исправить:** задать правило отчёта *до* выбора результата — например, сообщать среднее и стандартное отклонение по всем прогонам.
## Роль исследователя и предвзятость
- До: назвать ожидания, интересы и конфликты.
- Во время: вести журнал решений и применять критерии одинаково.
- После: сообщить об исключениях, неопределённости и ограничениях.
Рефлексивная заметка: «Я могу отдавать предпочтение ___. Проверю это так: ___». **Рефлексивность** — не притворяться нейтральным, а делать свои решения видимыми.`,
      },
      [
        q("What is fabrication?", "Inventing data, results or references that never existed", ["Changing or hiding real data to misrepresent the findings", "Using another person's words without any attribution", "Adding an author who did not contribute to the work"], "Fabrication is about inventing things that never existed.", "Фабрикация — выдумывание того, чего не было."),
        q("What is falsification?", "Distorting or hiding data to misrepresent findings", ["Creating survey respondents who never existed at all", "Copying code from GitHub without citing its author", "Publishing the same piece of work in two journals"], "Falsification changes, selects or omits real data or procedures.", "Фальсификация изменяет, отбирает или скрывает реальные данные и процедуры."),
        q("What is plagiarism?", "Using someone's words, ideas or data without attribution", ["Reporting results for an experiment that was never actually run", "Deleting unfavourable runs from the results table", "Presenting a convenience sample as representative"], "Plagiarism is taking without credit.", "Плагиат — присвоение без указания автора."),
        q("A student removes three low scores because they \"look wrong\". What is this?", "Falsification", ["Fabrication", "Plagiarism", "No issue at all"], "Data were manipulated without a pre-defined rule.", "Данные изменены без заранее заданного правила."),
        q("A team tests six models and reports only the best run. How is this classified?", "Falsification", ["Fabrication", "Plagiarism", "Acceptable practice"], "Selective reporting distorts the record even though nothing was invented.", "Выборочный отчёт искажает картину, хотя ничего не выдумано."),
        q("How is selective reporting of the best run repaired?", "Define the reporting rule before choosing the result", ["Delete the other runs so that nobody is confused by them", "Mention the best run again in a short footnote", "Run more models until one is clearly the best"], "For example, report the mean and standard deviation over all runs.", "Например, сообщать среднее и стандартное отклонение по всем прогонам."),
        q("Inventing a DOI for a reference is…", "Fabrication", ["Falsification", "Plagiarism", "Patchwriting"], "The reference never existed.", "Такого источника не существовало."),
        q("What is cherry-picking?", "Reporting only the metric or run that supports the claim", ["Citing the most famous paper in the research field", "Choosing a small topic for a one-trimester project", "Selecting keywords before starting a search"], "It is a questionable research practice that hides the full evidence.", "Это сомнительная практика, скрывающая полную картину."),
        q("What is gift authorship?", "Adding a name without a real contribution", ["Thanking a helper in the acknowledgements", "Listing the authors in alphabetical order", "Citing your own previously published paper"], "Authorship must reflect real work.", "Авторство должно отражать реальный вклад."),
        q("What does the disclosure test ask?", "Would a reasonable reader decide differently if this were disclosed?", ["Would the result look more convincing to readers if this stayed hidden?", "Has any other research team disclosed the same information?", "Is the disclosure statement longer than a single sentence?"], "If the answer is yes, it must be disclosed.", "Если ответ «да» — раскрывать обязательно."),
        q("What are the two responsibilities of research integrity?", "Knowledge and people", ["Speed and novelty", "Authors and reviewers", "Funding and publication"], "Make claims credible and protect those affected.", "Делать утверждения достоверными и защищать затронутых людей."),
        q("What does reflexivity mean?", "Making your own biases and decisions visible", ["Pretending to be completely neutral in the study", "Repeating every experiment at least two times", "Letting the participants review the final paper"], "It is not neutrality but transparency about your own role.", "Это не нейтральность, а прозрачность собственной роли."),
        tf("A technically correct study can still be unethical.", true, "Integrity covers both knowledge and the people affected.", "Честность касается и знания, и затронутых людей."),
        q("Presenting a small convenience sample as representative is which questionable practice?", "Hidden limits", ["Duplication", "Gift authorship", "Plagiarism"], "The limitation of the sample is concealed from the reader.", "Ограничение выборки скрыто от читателя."),
      ],
    ),
    part(
      "rm-w3-p2",
      { en: "Protecting people and data", ru: "Защита людей и данных" },
      {
        en: `## Informed consent — a process, not a signature
- **Understand** — purpose, tasks, risks and data use.
- **Choose** — participation is voluntary, without pressure.
- **Withdraw** — a clear route and its practical limits.
- **Ask** — a contact for questions and complaints.
Consent must match what will actually happen to the data. Recording an interview requires explicit disclosure and permission.
## Confidentiality vs anonymity
- **Confidentiality** — the research team **knows** the identity but controls access and disclosure.
- **Anonymity** — the researcher **cannot reasonably link** a response to a person, or identifiers are irreversibly removed.
Pseudonyms reduce exposure but do not automatically create anonymity: if a name–code key exists, that is confidentiality.
## The data lifecycle
**Collect** (only what the question needs) → **Store** (an encrypted or institution-approved location) → **Access** (named people and roles) → **Retain** (a justified period) → **Delete or share** (method, permission, record).
> Never promise a protection your workflow cannot deliver.
## Online research: public ≠ ethically simple
- **Expectations** — did users expect research use or wider publication?
- **Sensitivity** — could quotes, locations or combinations re-identify someone?
- **Platform terms** — is automated collection permitted and responsible?
- **Presentation** — could the results expose or stigmatise a person or group?
Legal access and ethical use are related but **different** questions.
## Approval prompts
- People or identifiable traces involved? → ethics review may be required.
- Sensitive, vulnerable or high-risk context? → stronger review and safeguards.
- Institutional policy or an external partner? → check the applicable process.
- A change after approval? → report it and seek an amendment before proceeding.
> When in doubt, pause before collecting data.
## The five-line ethics card
**DATA** (what will you collect?) · **PEOPLE** (who could be affected?) · **RISK** (what could go wrong?) · **SAFEGUARD** (what reduces the risk?) · **EVIDENCE** (what consent, approval or record proves it?).
Example: a survey of 60 students on AI-tool use; risk — identification by teachers and pressure to take part; safeguard — an anonymous form without emails, voluntary; evidence — a consent paragraph on the first page.`,
        ru: `## Информированное согласие — процесс, а не подпись
- **Understand (понять)** — цель, задания, риски и использование данных.
- **Choose (выбрать)** — участие добровольное, без давления.
- **Withdraw (выйти)** — понятный способ отказаться и его практические пределы.
- **Ask (спросить)** — контакт для вопросов и жалоб.
Согласие должно соответствовать тому, что реально произойдёт с данными. Запись интервью требует явного предупреждения и разрешения.
## Конфиденциальность и анонимность
- **Конфиденциальность** — команда **знает** личность, но контролирует доступ и раскрытие.
- **Анонимность** — исследователь **не может разумным способом связать** ответ с человеком, либо идентификаторы удалены необратимо.
Псевдонимы снижают риск, но не создают анонимность автоматически: если хранится ключ «имя — код», это конфиденциальность.
## Жизненный цикл данных
**Collect / сбор** (только то, что нужно вопросу) → **Store / хранение** (зашифрованное или одобренное вузом место) → **Access / доступ** (названные люди и роли) → **Retain / срок хранения** (обоснованный период) → **Delete or share / удаление или передача** (способ, разрешение, запись).
> Никогда не обещайте защиту, которую ваш процесс не может обеспечить.
## Онлайн-исследования: публичное ≠ этически простое
- **Ожидания** — рассчитывали ли пользователи на исследовательское использование или широкую публикацию?
- **Чувствительность** — можно ли по цитатам, местам или их сочетанию опознать человека?
- **Условия платформы** — разрешён ли автоматический сбор и ответственен ли он?
- **Подача** — могут ли результаты выставить напоказ или заклеймить человека либо группу?
Законный доступ и этичное использование — связанные, но **разные** вопросы.
## Когда нужно одобрение
- Участвуют люди или опознаваемые следы? → может потребоваться этическая экспертиза.
- Чувствительный, уязвимый или рискованный контекст? → усиленная проверка и защита.
- Политика вуза или внешний партнёр? → уточнить применимую процедуру.
- Изменение после одобрения? → сообщить и получить поправку до продолжения.
> Сомневаешься — остановись до сбора данных.
## Этическая карточка из пяти строк
**DATA** (что собираете?) · **PEOPLE** (кого это может затронуть?) · **RISK** (что может пойти не так?) · **SAFEGUARD** (что снижает риск?) · **EVIDENCE** (какое согласие, одобрение или запись это подтверждает?).
Пример: опрос 60 студентов об ИИ-инструментах; риск — опознание преподавателями и давление; защита — анонимная форма без почты, добровольно; подтверждение — абзац о согласии на первой странице.`,
      },
      [
        q("How does the lecture describe informed consent?", "A process, not a signature", ["A form that is signed once at the end", "A rule that applies to medical studies", "An optional step for student projects"], "Consent continues through the study and must match real data use.", "Согласие длится всё исследование и должно соответствовать реальному использованию данных."),
        q("What are the four parts of informed consent?", "Understand, choose, withdraw, ask", ["Collect, store, retain, delete", "Read, match, resolve, check", "Import, verify, organise, cite"], "Participants understand, choose freely, can withdraw and can ask questions.", "Участник понимает, свободно выбирает, может выйти и задать вопросы."),
        q("What is confidentiality?", "The team knows identities but controls access", ["Nobody, including the researcher, can identify people", "Participants' names are published with permission", "All data are deleted right after the collection"], "Identity is known but protected.", "Личность известна, но защищена."),
        q("What is anonymity?", "The researcher cannot reasonably link a response to a person", ["The team stores the names in a password-protected file on a laptop", "Participants are given pseudonyms and a key is kept", "Only the supervisor is allowed to see the real names"], "Identifiers are absent or irreversibly removed.", "Идентификаторов нет или они удалены необратимо."),
        q("Participants get pseudonyms, and the team keeps a name–code key. What does this provide?", "Confidentiality, not anonymity", ["Anonymity", "Neither of the two", "Informed consent"], "As long as the key exists, responses can be linked to people.", "Пока есть ключ, ответы можно связать с людьми."),
        q("What is the order of the data lifecycle?", "Collect → Store → Access → Retain → Delete or share", ["Store → Collect → Share → Access → Retain", "Access → Collect → Retain → Store → Delete", "Collect → Share → Store → Delete → Access"], "The five stages follow the data from collection to deletion or sharing.", "Пять стадий ведут данные от сбора до удаления или передачи."),
        q("What should be collected at the Collect stage?", "Only what the question needs", ["Everything that may be useful later", "As much personal data as allowed", "Only data that are already public"], "Data minimisation is the first safeguard.", "Минимизация данных — первая защита."),
        q("A team scrapes public profiles and publishes usernames. What is the main problem?", "Privacy and re-identification of people", ["Fabrication of the research data", "Plagiarism of other authors' ideas", "Gift authorship in the final paper"], "Public availability does not remove the risk to the people involved.", "Публичность не снимает риск для людей."),
        q("Storing interview audio in a shared class folder is…", "A confidentiality breach", ["A case of fabrication", "A case of plagiarism", "A consent procedure"], "Access to identifiable data is not controlled.", "Доступ к опознаваемым данным не контролируется."),
        tf("Data that are publicly available online are always ethically simple to use in research.", false, "Public does not mean ethically simple: expectations, sensitivity, platform terms and presentation matter.", "Публичное не значит этически простое: важны ожидания, чувствительность, условия платформы и подача."),
        q("How are legal access and ethical use related?", "They are related but different questions", ["They are exactly the same question", "They are both decided by the platform", "They are unrelated to student research"], "Something can be legal to access and still unethical to use.", "Доступ может быть законным, а использование — неэтичным."),
        q("What are the five lines of the ethics card?", "Data, people, risk, safeguard, evidence", ["Title, authors, year, venue, DOI", "Problem, method, data, finding, limitation", "Import, verify, organise, read, cite"], "The card records what is collected, who is affected, what can go wrong, the protection and the proof.", "Карточка фиксирует, что собирают, кого затрагивает, что может пойти не так, защиту и подтверждение."),
        q("The study design changes after ethics approval. What should the team do?", "Report it and seek an amendment before proceeding", ["Continue, because approval was already given", "Mention the change only in the final paper", "Restart the whole project from the very beginning again"], "Approval covers only what was described.", "Одобрение покрывает только описанное."),
        q("What does the lecture advise when you are in doubt about ethics?", "Pause before collecting data", ["Collect first and ask afterwards", "Anonymise the data at the end", "Let participants decide alone"], "Local institutional rules decide the formal route.", "Формальный путь определяют правила учреждения."),
        q("What does recording an interview require?", "Explicit disclosure and permission", ["Only a note in the final report", "Nothing, if the audio is deleted", "Approval from another student"], "Consent must match what will actually happen to the data.", "Согласие должно соответствовать тому, что реально произойдёт с данными."),
      ],
    ),
    part(
      "rm-w3-p3",
      { en: "Source verification and the plagiarism spectrum", ru: "Проверка источников и спектр плагиата" },
      {
        en: `## Source integrity: identity, traceability, fitness
- **Identity** — is it the same work? Match the title, authors, year and venue.
- **Traceability** — can others find it? A DOI, a publisher page, a stable repository.
- **Fitness** — can it support *this* claim? Read the method and the result, not just the title or abstract.
> Verification answers existence. Evaluation answers quality and relevance.
## The verification ladder
- **1. READ** — the title and abstract match the topic.
- **2. MATCH** — the publisher or trusted repository record.
- **3. RESOLVE** — the DOI or Crossref metadata (search.crossref.org: by title, author or DOI).
- **4. CHECK** — corrections, retractions and the version.
- **5. OPEN** — the method and result support the claim.
If a source stays unresolved, do not cite it as confirmed evidence.
## DOI — an identifier, not a quality badge
A DOI can resolve to a stable record, match metadata, distinguish versions and support traceability.
A DOI cannot prove a sound method, ethical conduct, relevance to your claim or the absence of a later correction.
A legitimate work may lack a DOI but still have a stable publisher or repository record: a missing DOI is not a missing source.
## The plagiarism spectrum
- **COPY** — the same words without quotation marks and citation. Not acceptable.
- **PATCHWRITE** — small word substitutions that keep the source's structure. A learning stage, not acceptable final prose.
- **PARAPHRASE** — new wording and structure, the same idea, **with a citation**. Acceptable.
- **SYNTHESISE** — several sources combined to support a new analytical point. Acceptable.
Plagiarism covers **words, ideas and data**. Paraphrasing still needs attribution.
## Quote, paraphrase, synthesis
- **Quote** — exact wording; use it rarely, when the wording itself matters. Smith (2023) states that accuracy "drops 18–34%".
- **Paraphrase** — one source's idea rebuilt in your own structure. Smith (2023) found that LLM accuracy is considerably lower in low-resource languages.
- **Synthesis** — a relationship between several sources. Both Smith (2023) and Lee (2024) report lower accuracy in low-resource languages, yet neither evaluated Kazakh.
> A literature review is organised by ideas, not by a list of papers.`,
        ru: `## Надёжность источника: identity, traceability, fitness
- **Identity (тождество)** — это та самая работа? Сверить название, авторов, год и издание.
- **Traceability (прослеживаемость)** — смогут ли другие её найти? DOI, страница издателя, стабильный репозиторий.
- **Fitness (пригодность)** — может ли она подтвердить *именно это* утверждение? Читать метод и результат, а не только название и аннотацию.
> Верификация отвечает на вопрос о существовании. Оценка — о качестве и релевантности.
## Лестница проверки
- **1. READ** — название и аннотация соответствуют теме.
- **2. MATCH** — найти запись издателя или надёжного репозитория.
- **3. RESOLVE** — проверить DOI или метаданные Crossref (search.crossref.org: по названию, автору или DOI).
- **4. CHECK** — исправления, отзывы статьи (retraction) и версия.
- **5. OPEN** — метод и результат подтверждают утверждение.
Если источник остался непроверенным, не цитируйте его как подтверждённое доказательство.
## DOI — идентификатор, а не знак качества
DOI помогает: привести к стабильной записи, сверить метаданные, различить версии, обеспечить прослеживаемость.
DOI не доказывает: корректность метода, этичность, релевантность вашему утверждению и отсутствие более поздних исправлений.
У настоящей работы может не быть DOI, но быть стабильная запись издателя или репозитория: нет DOI — не значит нет источника.
## Спектр плагиата
- **COPY** — те же слова без кавычек и ссылки. Недопустимо.
- **PATCHWRITE** — мелкие замены слов при сохранении структуры источника. Этап обучения, но не допустимый итоговый текст.
- **PARAPHRASE** — новые слова и структура, та же идея, **со ссылкой**. Допустимо.
- **SYNTHESISE** — несколько источников объединены ради нового аналитического вывода. Допустимо.
Плагиат касается **слов, идей и данных**. Парафраз всё равно требует ссылки.
## Цитата, парафраз, синтез
- **Цитата** — точная формулировка; использовать редко, когда важны сами слова. Smith (2023) пишет, что точность «падает на 18–34%».
- **Парафраз** — идея одного источника в вашей структуре. Smith (2023) обнаружил, что точность LLM заметно ниже в малоресурсных языках.
- **Синтез** — связь между несколькими источниками. И Smith (2023), и Lee (2024) сообщают о более низкой точности в малоресурсных языках, но ни один не оценивал казахский.
> Обзор литературы строится по идеям, а не по списку статей.`,
      },
      [
        q("How does the lecture describe a DOI?", "An identifier, not a quality badge", ["Proof that the method of a paper is sound", "A sign that a paper has been peer-reviewed", "A guarantee that no correction was issued"], "A DOI supports traceability; it says nothing about quality.", "DOI обеспечивает прослеживаемость, но ничего не говорит о качестве."),
        q("What can a DOI help you do?", "Resolve to a stable record and match the metadata", ["Prove that the study was conducted ethically", "Prove that the paper is relevant to your specific claim", "Prove that the reported results are correct"], "It resolves, matches metadata, distinguishes versions and supports traceability.", "DOI ведёт к записи, сверяет метаданные, различает версии и даёт прослеживаемость."),
        q("Which question does the identity check answer?", "Do the title, authors, year and venue match the same work?", ["Can other readers find the work through a stable record?", "Do the method and the result support this specific claim?", "Is the journal ranked highly enough to be trusted?"], "Identity confirms that you are looking at the right work.", "Тождество подтверждает, что перед вами нужная работа."),
        q("Which question does traceability answer?", "Can others find it through a DOI or stable record?", ["Do the title and authors match the same work?", "Does the method support this specific claim?", "Was the paper written by a famous author?"], "Traceability is about a stable, findable record.", "Прослеживаемость — это стабильная запись, которую можно найти."),
        q("Which question does fitness answer?", "Can the source support this specific claim?", ["Does the source have a DOI at all?", "Is the source listed in Mendeley?", "Was the source published recently?"], "You must read the method and result, not only the title.", "Нужно прочитать метод и результат, а не только название."),
        q("What is the difference between verification and evaluation?", "Verification answers existence; evaluation answers quality and relevance", ["Verification answers quality; evaluation answers whether the source exists", "Verification is done by the publisher; evaluation is done by Mendeley", "Verification is needed for books; evaluation is needed for articles"], "A source can exist and still be unsuitable for your claim.", "Источник может существовать и при этом не подходить для вашего утверждения."),
        q("What is the order of the verification ladder?", "Read → Match → Resolve → Check → Open", ["Open → Check → Resolve → Match → Read", "Match → Read → Open → Resolve → Check", "Resolve → Read → Check → Open → Match"], "It climbs from the title and abstract to the method and result.", "Лестница идёт от названия и аннотации к методу и результату."),
        q("A legitimate work has no DOI. What follows?", "It may still be valid if a stable record exists", ["It must never be cited in academic work", "It is automatically a Tier 3 source", "It was certainly fabricated by someone"], "A missing DOI is not a missing source.", "Нет DOI — не значит нет источника."),
        q("A source remains unresolved after your checks. What should you do?", "Do not cite it as confirmed evidence", ["Cite it and add a question mark", "Cite it but without the DOI", "Replace its authors with et al."], "Only verified sources may support your claims.", "Утверждения можно подкреплять только проверенными источниками."),
        q("What is patchwriting?", "Small word substitutions that keep the source's structure", ["New wording and a new structure with a citation added at the end", "Exact words placed in quotation marks with a citation", "Several sources combined into a new analytical point"], "It is a learning stage but not acceptable final prose.", "Это этап обучения, но не допустимый итоговый текст."),
        q("Which of these is acceptable in a final paper?", "A paraphrase with a citation", ["Patchwriting with the citation removed", "Copied text with a few synonyms", "Copied text without quotation marks"], "Paraphrase and synthesis are acceptable when attributed.", "Парафраз и синтез допустимы при указании источника."),
        tf("Paraphrasing an idea in your own words removes the need to cite the source.", false, "Paraphrasing still needs attribution: plagiarism covers ideas too.", "Парафраз всё равно требует ссылки: плагиат касается и идей."),
        q("What does plagiarism cover?", "Words, ideas and data", ["Only copied sentences", "Only copied source code", "Only published books"], "Taking any of the three without attribution is plagiarism.", "Присвоение любого из трёх без ссылки — плагиат."),
        q("What is synthesis?", "A relationship between several sources that supports a claim", ["The exact wording of one source placed inside quotation marks", "One source's idea rewritten in your own structure", "A list of papers ordered by the year of publication"], "Synthesis connects sources into an analytical point.", "Синтез связывает источники в аналитический вывод."),
        q("How is a literature review organised?", "By ideas", ["By publication year", "By author surname", "By database searched"], "It is organised by ideas, not by a list of papers.", "Он строится по идеям, а не по списку статей."),
        q("Which service is named for resolving DOI metadata by title, author or DOI?", "Crossref", ["Litmaps", "Mendeley Cite", "Connected Papers"], "search.crossref.org is used at the RESOLVE step.", "search.crossref.org используется на шаге RESOLVE."),
        q("When should direct quotation be used?", "Rarely, when the exact wording itself matters", ["Always, because it is the safest option", "Never, because quotes are plagiarism", "Whenever paraphrasing takes too long"], "Quotes are marked and cited precisely, and used sparingly.", "Цитаты точно оформляют и используют редко."),
      ],
    ),
    part(
      "rm-w3-p4",
      { en: "Authorship, AI use and the Mendeley workflow", ru: "Авторство, использование ИИ и работа в Mendeley" },
      {
        en: `## Authorship and credit
- **Contribution** — credit reflects real work, not status.
- **Responsibility** — authors can explain and defend the work.
- **Acknowledgement** — support that does not justify authorship is still recognised.
- **Conflict** — funding or relationships that may affect judgement are disclosed.
Honorary authorship misrepresents responsibility.
## AI use: support or substitution
Defensible support: search-term candidates, explaining terminology, improving grammar after you wrote the text, challenging a draft argument, suggesting checks to perform.
Unacceptable substitution: inventing or citing unopened sources, fabricating data or results, hiding substantial generated text, uploading protected data without permission, bypassing course rules.
## The AI verification contract
- **NO SOURCE** — no generated reference enters the paper until it has been opened.
- **NO CLAIM** — no generated factual claim remains without evidence.
- **NO SECRET DATA** — no participant or protected data goes into an unapproved tool.
- **NO HIDDEN ROLE** — required AI use is disclosed according to course rules.
## The Mendeley workflow
**IMPORT** (PDF, Web Importer, manual entry) → **VERIFY** (title, authors, year, venue, DOI) → **ORGANISE** (collection, tags, notes) → **READ** (highlight, annotate) → **CITE** (citations and bibliography in Word).
> Reference manager ≠ source verifier. Check the metadata yourself.
**Import, then repair:** add the record, open its details and compare them with the paper's first page and the publisher page; correct the title case, full author names, year, venue, volume and pages, DOI. A clean library prevents broken citations later.
**Organise for synthesis:** a collection such as "Assignment 1 — core papers"; tags like method, dataset, domain, finding; a note holds claim + evidence + limitation + possible use. Tag consistently: one concept, one spelling.
**Mendeley Cite in Word:** place the cursor, open Mendeley Cite, search the library, insert the citation, choose the style required by the assignment or journal (for example APA), insert the bibliography, and **inspect every entry**.
## Exit ticket
An ethics card, one verified paper, a Mendeley collection with **5 corrected records**, and a Word citation with a bibliography.`,
        ru: `## Авторство и признание вклада
- **Вклад** — авторство отражает реальную работу, а не статус.
- **Ответственность** — авторы могут объяснить и защитить работу.
- **Благодарность** — помощь, не дающая права на авторство, всё равно отмечается.
- **Конфликт интересов** — финансирование или отношения, способные повлиять на суждения, раскрываются.
Почётное авторство искажает представление о том, кто отвечает за работу.
## ИИ: помощь или подмена
Допустимая помощь: варианты поисковых слов, объяснение терминов, правка грамматики уже написанного вами текста, критика черновика аргумента, подсказки, что проверить.
Недопустимая подмена: выдумывать источники или ссылаться на неоткрытые, фабриковать данные и результаты, скрывать существенный сгенерированный текст, загружать защищённые данные без разрешения, обходить правила курса.
## Контракт проверки ИИ
- **NO SOURCE** — сгенерированная ссылка не попадает в работу, пока её не открыли.
- **NO CLAIM** — сгенерированное фактическое утверждение не остаётся без доказательства.
- **NO SECRET DATA** — данные участников и защищённые данные не попадают в неодобренный инструмент.
- **NO HIDDEN ROLE** — использование ИИ раскрывается по правилам курса.
## Процесс работы в Mendeley
**IMPORT** (PDF, Web Importer, вручную) → **VERIFY** (название, авторы, год, издание, DOI) → **ORGANISE** (коллекция, теги, заметки) → **READ** (выделения, аннотации) → **CITE** (ссылки и список литературы в Word).
> Менеджер ссылок ≠ проверка источников. Метаданные проверяете вы сами.
**Импортировал — исправь:** добавить запись, открыть детали и сравнить с первой страницей статьи и страницей издателя; исправить регистр названия, полные имена авторов, год, издание, том и страницы, DOI. Чистая библиотека — меньше сломанных ссылок потом.
**Организация для синтеза:** коллекция вроде «Assignment 1 — core papers»; теги: метод, датасет, область, результат; заметка = утверждение + доказательство + ограничение + возможное применение. Теги единообразны: одно понятие — одно написание.
**Mendeley Cite в Word:** поставить курсор, открыть Mendeley Cite, найти запись, вставить ссылку, выбрать стиль по требованию задания или журнала (например, APA), вставить список литературы и **проверить каждую запись**.
## Что сдать в конце
Этическую карточку, одну проверенную статью, коллекцию Mendeley с **5 исправленными записями** и ссылку со списком литературы в Word.`,
      },
      [
        q("What is the Mendeley workflow?", "Import → Verify → Organise → Read → Cite", ["Cite → Import → Read → Organise → Verify", "Read → Cite → Import → Verify → Organise", "Verify → Import → Cite → Read → Organise"], "Records are imported, checked, organised, read and only then cited.", "Записи импортируют, проверяют, организуют, читают и только потом цитируют."),
        q("What does \"Reference manager ≠ source verifier\" mean?", "You must check the metadata yourself", ["Mendeley rejects fabricated papers automatically", "Imported records never need any correction", "Only verified papers can be imported at all"], "Mendeley stores what it is given, including wrong metadata.", "Mendeley хранит то, что ему дали, включая неверные метаданные."),
        q("What should you do right after importing a record?", "Compare it with the paper's first page and the publisher page", ["Insert it into the Word document straight away without any changes", "Delete the PDF so that the library stays lightweight", "Share the whole library with the rest of the class"], "Import, then repair: correct title, authors, year, venue and DOI.", "Импортировал — исправь: название, авторы, год, издание и DOI."),
        q("What does the rule NO SOURCE of the AI verification contract say?", "No generated reference enters the paper until it has been opened", ["No source that is older than five years may be used anywhere in the paper", "No reference may be added to the paper without a DOI", "No source may be cited more than once in the same paper"], "AI may invent references, so each one must be opened and checked.", "ИИ может выдумать ссылки, поэтому каждую нужно открыть и проверить."),
        q("Which use of AI is unacceptable?", "Citing a source the AI suggested without opening it", ["Asking for candidate search terms", "Asking for an explanation of a term", "Improving the grammar of your own text"], "Unopened generated sources may be fabricated.", "Неоткрытые сгенерированные источники могут быть выдуманы."),
        q("Which use of AI is defensible support?", "Challenging a draft argument", ["Fabricating missing results", "Hiding substantial generated text", "Uploading protected data to any tool"], "Support helps your thinking; substitution replaces evidence or authorship.", "Помощь поддерживает ваше мышление; подмена заменяет доказательства или авторство."),
        q("What does NO SECRET DATA mean?", "No participant or protected data in an unapproved tool", ["No data of any kind may ever be stored on a personal laptop", "No results may be shared before publication", "No dataset may be used without a licence"], "Uploading such data may breach consent and confidentiality.", "Загрузка таких данных может нарушить согласие и конфиденциальность."),
        q("Why is honorary authorship a problem?", "It misrepresents who is responsible for the work", ["It makes the author list too long to print", "It reduces the number of citations of a paper", "It delays the peer review of the manuscript"], "Authors must be able to explain and defend the work.", "Авторы должны уметь объяснить и защитить работу."),
        q("What should authorship credit reflect?", "Real contribution, not status", ["Seniority in the department", "The order of joining the team", "The amount of funding provided"], "Credit follows actual work.", "Авторство следует за реальной работой."),
        q("How is support that does not justify authorship recognised?", "In the acknowledgements", ["By adding the person as last author", "It is not mentioned anywhere", "In the title of the paper"], "Acknowledgement recognises help without claiming authorship.", "Благодарность отмечает помощь без права на авторство."),
        q("What must you do after inserting the bibliography with Mendeley Cite?", "Inspect every entry", ["Submit the document immediately", "Convert the document to PDF", "Remove all in-text citations"], "Automatically generated entries can contain metadata errors.", "В автоматически созданных записях бывают ошибки метаданных."),
        q("What does \"tag consistently\" mean?", "One concept, one spelling", ["One tag for the whole library", "A new tag for every paper", "Tags written in capital letters"], "Inconsistent tags split the same concept into several groups.", "Непоследовательные теги разбивают одно понятие на несколько групп."),
        q("How many corrected records must the Mendeley collection contain for the exit ticket?", "5", ["1", "3", "10"], "The session's output is a collection with five corrected records.", "Итог занятия — коллекция с пятью исправленными записями."),
        q("How is the citation style chosen in Mendeley Cite?", "By the assignment or journal requirement", ["By the personal taste of the student", "By the default style of the first paper", "By the language of the cited source"], "For example, APA if the assignment requires it.", "Например, APA, если этого требует задание."),
        tf("AI use that the course requires you to disclose may stay hidden if you edited the text afterwards.", false, "NO HIDDEN ROLE: required AI use is disclosed according to course rules.", "NO HIDDEN ROLE: использование ИИ раскрывается по правилам курса."),
        q("What does a good Mendeley note contain?", "Claim, evidence, limitation and possible use", ["The full abstract copied from the paper", "Only the page numbers of highlights", "The names of all the co-authors"], "Such notes prepare the material for synthesis.", "Такие заметки готовят материал для синтеза."),
      ],
    ),
  ],
};
