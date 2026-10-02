import type { Term, Text } from "../types";

const t = (term: string, en: string, ru: string): Term => ({ term, def: { en, ru } });

/** Глоссарий курса — он же колода карточек «термин → определение». */
export const glossary: Term[] = [
  t("Research", "A systematic, creative and critical process for finding verifiable answers and building credible, reproducible knowledge.", "Систематический, творческий и критический процесс поиска проверяемых ответов и создания достоверного, воспроизводимого знания."),
  t("Research problem", "The specific issue that needs investigation.", "Конкретная проблема, которую нужно исследовать."),
  t("Research question (RQ)", "A precise, answerable question that guides the study: clear, focused, researchable, feasible and connected to the problem.", "Точный вопрос, на который можно ответить и который ведёт исследование: ясный, сфокусированный, исследуемый, выполнимый и связанный с проблемой."),
  t("Researchable", "Evidence can be collected to answer the question.", "Для ответа на вопрос можно собрать доказательства."),
  t("Feasibility", "Whether the study can realistically be done: data, infrastructure, time, skills, ethics and scope.", "Можно ли реально выполнить исследование: данные, инфраструктура, время, навыки, этика и объём."),
  t("Independent variable", "What is changed or compared in a quantitative study.", "То, что меняют или сравнивают в количественном исследовании."),
  t("Dependent variable", "What is measured in a quantitative study.", "То, что измеряют в количественном исследовании."),
  t("Concepts / phenomena", "The focus of qualitative or exploratory studies, named instead of independent and dependent variables.", "То, на чём сосредоточено качественное или поисковое исследование; называются вместо независимой и зависимой переменных."),
  t("Hypothesis", "A testable prediction — not an invented finding.", "Проверяемое предсказание — а не выдуманный результат."),
  t("Literature review", "An analysis and synthesis of existing research, not a list or a summary.", "Анализ и синтез существующих исследований, а не список и не пересказ."),
  t("Synthesis", "Connecting sources to show patterns, agreements, contradictions and gaps.", "Связывание источников, показывающее закономерности, согласия, противоречия и пробелы."),
  t("Evidence matrix", "A table with the columns paper, problem, method, data, finding, limitation and what is missing.", "Таблица с колонками: статья, проблема, метод, данные, результат, ограничение и чего не хватает."),
  t("Research gap", "Something important that is still unknown, untested, limited or unexplored in a specific context, justified by the literature.", "Нечто важное, что остаётся неизвестным, непроверенным, ограниченным или неизученным в конкретном контексте и обосновано литературой."),
  t("Boolean AND", "Narrows the search: every result must contain both concepts.", "Сужает поиск: каждый результат должен содержать оба понятия."),
  t("Boolean OR", "Broadens the search: a result may contain any of the alternative terms.", "Расширяет поиск: результат может содержать любой из альтернативных терминов."),
  t("Quotation marks \" \"", "Search for an exact phrase.", "Поиск точной фразы."),
  t("Peer-reviewed", "Evaluated by independent experts before publication (Tier 1).", "Оценено независимыми экспертами до публикации (уровень 1)."),
  t("Primary source", "Original research reported by those who did it.", "Оригинальное исследование, описанное теми, кто его провёл."),
  t("Secondary source", "A review or summary of primary research.", "Обзор или обобщение первичных исследований."),
  t("DOI", "Digital Object Identifier — a persistent identifier that supports traceability, not quality.", "Digital Object Identifier — постоянный идентификатор; обеспечивает прослеживаемость, но не говорит о качестве."),
  t("Crossref", "A metadata registry for DOIs (search.crossref.org).", "Реестр метаданных DOI (search.crossref.org)."),
  t("Fabrication", "Inventing data, results or references that never existed.", "Выдумывание данных, результатов или ссылок, которых не было."),
  t("Falsification", "Distorting, selecting or hiding data or procedures to misrepresent findings.", "Искажение, выборочный отбор или сокрытие данных и процедур, меняющие смысл результатов."),
  t("Plagiarism", "Taking another person's words, ideas or data without credit.", "Присвоение чужих слов, идей или данных без указания автора."),
  t("Cherry-picking", "Reporting only the results that support the claim.", "Сообщать только те результаты, которые подтверждают утверждение."),
  t("Patchwriting", "Superficial word swaps in a source's text — not acceptable final prose.", "Поверхностная замена слов в тексте источника — недопустимый итоговый текст."),
  t("Informed consent", "An ongoing process: understand, choose, withdraw, ask.", "Продолжающийся процесс: понять, выбрать, выйти, спросить."),
  t("Confidentiality", "The team knows identities but controls access and disclosure.", "Команда знает личности, но контролирует доступ и раскрытие."),
  t("Anonymity", "A response cannot reasonably be linked to a person.", "Ответ нельзя разумным способом связать с человеком."),
  t("Reflexivity", "Making your own biases and decisions visible.", "Делать собственные предубеждения и решения видимыми."),
  t("Mendeley", "A reference manager: import, verify, organise, annotate, cite.", "Менеджер ссылок: импорт, проверка, организация, аннотации, цитирование."),
  t("Research plan", "A logical plan for turning a research question into evidence.", "Логичный план того, как превратить исследовательский вопрос в доказательства."),
  t("Alignment", "Every element, from the problem to the answer, logically connects to the previous one.", "Каждый элемент — от проблемы до ответа — логически связан с предыдущим."),
];

/** Шпаргалка на одну страницу — то, что стоит перечитать за пять минут до квиза. */
export const cheatSheet: Text = {
  en: `## Research question
- A good RQ is **clear, focused, researchable, feasible and connected** to the problem.
- **Researchability test:** can evidence be collected to answer it?
- **Feasibility:** can the required data realistically be obtained? Then time, computing, skills, ethics and scope.
- Qualitative or exploratory study → **main concepts or phenomena**; quantitative → independent and dependent variables.
- The RQ must follow from the problem or gap. **Never invent expected findings.**
## Literature search
- Problem → concepts → synonyms → query.
- **AND narrows, OR broadens, " " searches an exact phrase.**
- **Google Scholar** — broad, free, the starting point. **IEEE Xplore and ACM Digital Library** — Computer Science and Software Engineering.
## Screening and comparing
- Screen: **Title → Abstract → Keywords → Conclusion → Full read if relevant.**
- Compare: patterns, agreements, contradictions, limitations, what is missing.
- **Limitation / What is missing** — what a study did not or could not address.
## Research gap
- A gap is something important and unknown **in a context**, **justified by the literature**.
- Interest is not a gap. A failed Google search is not a gap. An opinion is not a gap. Future work is not your gap until verified.
- **Gap formula:** We know → However → We still do not know → Therefore, this study will…
## Ethics and sources
- **FFP:** fabrication (inventing), falsification (distorting), plagiarism (taking).
- Consent is a process; confidentiality ≠ anonymity; public ≠ ethically simple.
- Verify identity, traceability, fitness. **A DOI is not a quality badge.** No unopened AI references.
- Copy and patchwriting — not acceptable; paraphrase with a citation and synthesis — acceptable.
## Review and plan
- A literature review is analysis and synthesis, organised by ideas. **The literature comes before the lab.**
- A method is chosen because it answers the RQ, not because it sounds impressive.
- Reality check: green — proceed, yellow — adjust the scope, red — redesign.
- Alignment: Problem → RQ → Literature → Gap → Aim → Evidence → Method → Data → Answer.`,
  ru: `## Исследовательский вопрос
- Хороший вопрос — **ясный, сфокусированный, исследуемый, выполнимый и связанный** с проблемой.
- **Тест на исследуемость:** можно ли собрать доказательства для ответа?
- **Выполнимость:** можно ли реально получить нужные данные? Затем время, вычисления, навыки, этика и объём.
- Качественное или поисковое исследование → **основные понятия или явления**; количественное → независимая и зависимая переменные.
- Вопрос должен следовать из проблемы или пробела. **Никогда не выдумывай ожидаемые результаты.**
## Поиск литературы
- Проблема → понятия → синонимы → запрос.
- **AND сужает, OR расширяет, " " ищет точную фразу.**
- **Google Scholar** — широкий, бесплатный, точка старта. **IEEE Xplore и ACM Digital Library** — Computer Science и Software Engineering.
## Отсев и сравнение
- Отсев: **Title → Abstract → Keywords → Conclusion → полное чтение, если релевантно.**
- Сравнение: закономерности, согласия, противоречия, ограничения, чего не хватает.
- **Limitation / What is missing** — то, чего исследование не сделало или не смогло.
## Исследовательский пробел
- Пробел — нечто важное и неизвестное **в конкретном контексте**, **обоснованное литературой**.
- Интерес — не пробел. Неудачный поиск в Google — не пробел. Мнение — не пробел. Future work — не твой пробел, пока не проверено.
- **Формула пробела:** We know → However → We still do not know → Therefore, this study will…
## Этика и источники
- **FFP:** fabrication (выдумывание), falsification (искажение), plagiarism (присвоение).
- Согласие — это процесс; конфиденциальность ≠ анонимность; публичное ≠ этически простое.
- Проверяй тождество, прослеживаемость, пригодность. **DOI — не знак качества.** Никаких неоткрытых ссылок от ИИ.
- Копирование и patchwriting — недопустимы; парафраз со ссылкой и синтез — допустимы.
## Обзор и план
- Обзор литературы — анализ и синтез, построенный по идеям. **Литература идёт раньше лаборатории.**
- Метод выбирают потому, что он отвечает на вопрос, а не потому, что звучит внушительно.
- Проверка реальностью: зелёный — продолжать, жёлтый — скорректировать объём, красный — переделать.
- Согласованность: Problem → RQ → Literature → Gap → Aim → Evidence → Method → Data → Answer.`,
};
