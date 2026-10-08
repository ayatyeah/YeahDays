import type { FastTrack } from "../types";

/*
 * Фаст-мод RMT: подготовка к Practice Quiz 3 (кейс SafeDrive, 10 баллов) и
 * мидтерму за 2–3 часа. Блоки идут от самых «баллоёмких» к менее важным;
 * формулировки и эталоны — как в l1–l5.ts и practice.ts, чтобы не спорить
 * с полными конспектами.
 */

type Section = FastTrack["sections"][number];

const s1: Section = {
  id: "rm-fast-1",
  title: { en: "How the quiz is scored and a 40-minute plan", ru: "Как оценивается квиз и план на 40 минут" },
  minutes: 10,
  notes: {
    en: `## Two tests, one set of skills
- **Practice Quiz 3 (SafeDrive case)** reviews Lectures 1–4: **10 points**, about 40 minutes, one case plus an evidence table of **Study A–D**. Quizzes 1–3 are worth 10 points each.
- **Midterm** — 30 of the 100 points of Attestation 1, a written or oral exam reviewing the topics covered. It needs the same moves plus the Week 5 methodology (blocks 10–11).
> The first line of the quiz sheet is also the first marking rule: **use only the case and the evidence table.** Outside facts earn nothing, and an invented source is fabrication.
## Where the 10 points are
| Task | Points | What earns the points | Block |
|---|---|---|---|
| A1–A6 multiple choice | 6 × 0.5 | the diagnosis of a planted red flag | 2, 3, 4, 8, 9 |
| B1 outputs | 0.5 | one development output + one research output | 9 |
| B2 problem statement | 1 | situation + cited limitation + need | 2 |
| B3 research question | 1 | population + factor or comparison + outcome | 2 |
| B4 search string | 0.5 | quotation marks, brackets, AND, OR | 7 |
| B5 ethics | 1.5 | 2 × risk + safeguard + record | 3 |
| B6 synthesis | 1.5 | Studies A–D compared by theme | 5 |
| B7 gap | 1 | a gap from the evidence + how the study fills it | 6 |
## The 40-minute plan
| Minutes | Do | Length |
|---|---|---|
| 0–5 | read the case, mark the red flags, rewrite the table as design · sample · finding · limitation | margin notes |
| 5–11 | Part A: six choices | — |
| 11–17 | B1, B3, B4 — the short ones first | 2 lines · 1 sentence · 1 line |
| 17–21 | B2 | 3 labelled sentences |
| 21–27 | B5 | 2 × Risk / Safeguard / Record |
| 27–34 | B6 | 4 sentences |
| 34–38 | B7 | 3–4 sentences |
| 38–40 | the final check (block 12) | — |
About 4 minutes per point. If the quiz is longer or shorter, keep the proportions.
## Six Part A items you can predict
Every case plants the same red flags; each one is a Part A item.
| Red flag in the case | Answer that earns 0.5 | Tempting wrong option |
|---|---|---|
| "Does technology improve road safety?" | too broad, no measurable outcome | "too narrow", "does not mention AI" |
| "The app will definitely reduce accidents." | an unsupported claim, not a problem | "a testable, falsifiable hypothesis" |
| the prototype among comparisons and reviews | the prototype is the development output | a comparison of alert rates |
| which study gives qualitative data? | the interview study (Study C) | a study with self-reported numbers |
| AI-suggested records, no DOI, never opened | risk of citing fabricated or unverified sources | "no DOI means the paper is fake" |
| video and location recorded by default | ethical and data-protection risk | a battery or cost problem |
## Writing Part B so the marker finds the points
- **Label the parts the rubric names:** "Current situation: / Limitation: / Need:", "Risk / Safeguard / Record".
- **Cite by letter:** "Study A found…" is evidence; "research shows…" is not.
- **Hedge:** may, suggests, remains unclear. Delete "definitely", "proves", "always".
- **Keep one thread:** the outcome in B3 (the fatigue score) is the outcome in the B2 need, the last B6 sentence and the B7 gap.
- **Short beats long:** the rubric pays for elements, not for words.
?? Six minutes are left and both B6 and B7 are empty. What is the plan?
?= B6 first (1.5 points) as three sentences — findings, methods, limitations — ending with "…remains unclear"; then turn that last sentence into the B7 gap and add one line on how the study addresses it.
?? Where in the answer does a figure remembered from the news belong?
?= Nowhere. Only the case and Studies A–D count: an outside figure is an unsupported claim, and an invented reference is fabrication.`,
    ru: `## Две проверки, один набор навыков
- **Practice Quiz 3 (кейс SafeDrive)** повторяет лекции 1–4: **10 баллов**, около 40 минут, один кейс и таблица доказательств (evidence table) **Study A–D**. Квизы 1–3 — по 10 баллов.
- **Мидтерм (midterm)** — 30 из 100 баллов первой аттестации, письменный или устный экзамен по пройденным темам. Нужны те же приёмы плюс методология недели 5 (блоки 10–11).
> Первая строка листа квиза — это и первое правило оценки: **use only the case and the evidence table.** Факты со стороны баллов не дают, а выдуманный источник — фабрикация (fabrication).
## Где лежат 10 баллов
| Задание | Баллы | За что баллы | Блок |
|---|---|---|---|
| A1–A6 тест | 6 × 0.5 | диагноз заложенного «красного флага» | 2, 3, 4, 8, 9 |
| B1 выходы | 0.5 | один выход разработки + один выход исследования | 9 |
| B2 постановка проблемы | 1 | ситуация + ограничение со ссылкой + потребность | 2 |
| B3 исследовательский вопрос | 1 | популяция + фактор или сравнение + исход | 2 |
| B4 поисковая строка | 0.5 | кавычки, скобки, AND, OR | 7 |
| B5 этика | 1.5 | 2 × риск + мера защиты + запись | 3 |
| B6 синтез | 1.5 | Studies A–D сравнены по темам | 5 |
| B7 пробел | 1 | пробел из доказательств + как исследование его закрывает | 6 |
## План на 40 минут
| Минуты | Что делать | Объём |
|---|---|---|
| 0–5 | прочитать кейс, отметить «красные флаги», переписать таблицу как дизайн · выборка · результат · ограничение | пометки на полях |
| 5–11 | часть A: шесть выборов | — |
| 11–17 | B1, B3, B4 — сначала короткие | 2 строки · 1 предложение · 1 строка |
| 17–21 | B2 | 3 подписанных предложения |
| 21–27 | B5 | 2 × Risk / Safeguard / Record |
| 27–34 | B6 | 4 предложения |
| 34–38 | B7 | 3–4 предложения |
| 38–40 | финальная проверка (блок 12) | — |
Около 4 минут на балл. Если квиз длиннее или короче, пропорции те же.
## Шесть пунктов части A, которые можно предсказать
В каждом кейсе заложены одни и те же «красные флаги»; каждый — пункт части A.
| Флаг в кейсе | Ответ на 0.5 | Соблазнительный неверный вариант |
|---|---|---|
| «Does technology improve road safety?» | слишком широкий, нет измеримого исхода | «слишком узкий», «не упоминает ИИ» |
| «The app will definitely reduce accidents.» | необоснованное утверждение (unsupported claim), а не проблема | «проверяемая, опровержимая гипотеза» |
| прототип среди сравнений и обзоров | прототип — выход разработки (development output) | сравнение частоты сигналов |
| какое исследование даёт качественные данные? | интервью (Study C) | исследование с числами-самоотчётами |
| записи от ИИ, без DOI, не открывались | риск цитировать выдуманные или непроверенные источники | «нет DOI — значит, статья фальшивая» |
| видео и геолокация пишутся по умолчанию | этический риск и риск для защиты данных | проблема батареи или стоимости |
## Как писать часть B, чтобы проверяющий нашёл баллы
- **Подписывайте части, которые называет критерий:** «Current situation: / Limitation: / Need:», «Risk / Safeguard / Record».
- **Ссылайтесь по буквам:** «Study A found…» — доказательство; «research shows…» — нет.
- **Осторожные формулировки:** may, suggests, remains unclear. Вычеркните «definitely», «proves», «always».
- **Держите одну нить:** исход из B3 (балл усталости) — тот же в потребности B2, в последнем предложении B6 и в пробеле B7.
- **Коротко лучше длинного:** критерии платят за элементы, а не за слова.
?? Осталось шесть минут, а B6 и B7 пустые. Какой план?
?= Сначала B6 (1.5 балла) тремя предложениями — результаты, методы, ограничения — с концовкой «…remains unclear»; затем эта последняя фраза превращается в пробел для B7 плюс одна строка о том, как исследование его закрывает.
?? Куда в ответе вставить цифру, запомненную из новостей?
?= Никуда. Считаются только кейс и Studies A–D: цифра со стороны — необоснованное утверждение, а выдуманная ссылка — фабрикация.`,
  },
};

const s2: Section = {
  id: "rm-fast-2",
  title: { en: "Claim, problem statement, research question (3 points)", ru: "Утверждение, постановка проблемы, исследовательский вопрос (3 балла)" },
  minutes: 20,
  notes: {
    en: `## Five statement types that Part A mixes up
| Type | Its job | SafeDrive example |
|---|---|---|
| Unsupported claim | a result stated as fact, with no evidence | "The app will definitely reduce accidents." |
| Research problem | what is happening, what is not known, why it matters | "Alert apps are proposed for long-haul drivers, but evidence for this group is limited and mixed." |
| Research question | what the data will answer | "Do SafeDrive users have lower fatigue-scale scores than checklist users after six weeks?" |
| Hypothesis | a testable prediction the data could reject | "SafeDrive users will score lower on a validated fatigue scale than checklist users." |
| Aim | one sentence: what the study intends to do | "To compare fatigue levels of SafeDrive and checklist users over six weeks." |
> Exam trap: for "will definitely reduce accidents" the tempting wrong option is "a testable, falsifiable hypothesis". Certainty words — definitely, always, proves, 10x — mark a **claim**; a hypothesis is cautious and could turn out false.
## B2. The three-part problem statement (1 point)
@diagram rmx-rq-builder
= Current situation: [who] [does what] [where], and [what is being considered].
= Limitation: However, [Study X] found [limit], and [Study Y] reports [limit].
= Need: Therefore, evidence is needed on whether [factor] changes [outcome] for [population].
Model answer:
= Current situation: Long-haul truck drivers often work long night shifts, and a university clinic is considering SafeDrive, a phone app that detects drowsiness and sounds an alert.
= Limitation: However, Study A found fewer self-reported near-misses but no significant difference in actual accidents among taxi drivers, and Study D reports few studies on long-haul drivers and inconsistent definitions of a fatigue event.
= Need: Therefore, controlled evidence is needed on whether SafeDrive reduces fatigue among long-haul drivers compared with a simple paper checklist.
- Mnemonic **S-L-N**: Situation → Limitation (cited) → Need. The middle sentence must name a study letter.
- Points are lost for "the problem is that drivers lack SafeDrive" (a missing solution), a limitation without a source, "no research exists" and a need that is a promise ("SafeDrive will save lives").
## B3. One research question (1 point)
= Among [population], does [factor], compared with [comparison], change [measurable outcome] in [context / time]?
= Among long-haul truck drivers, does using SafeDrive for six weeks, compared with a paper fatigue checklist, lower scores on a validated fatigue scale?
| Element | SafeDrive |
|---|---|
| Population | long-haul truck drivers |
| Factor / comparison | SafeDrive vs the paper checklist |
| Outcome | validated fatigue-scale score |
| Context / time | six weeks, clinic study |
Five criteria: **clear, focused, researchable, feasible** and **connected** to the problem.
| Weak RQ | Why it fails |
|---|---|
| Does technology improve road safety? | too broad, no measurable outcome (Part A item 1) |
| Does SafeDrive work? | "work" is undefined; no comparison |
| Does SafeDrive reduce accidents? | not feasible: accidents are rare in 60 drivers over six weeks and are not collected |
| How many alerts do drivers get per night? | only the app group has alert logs — nothing to compare |
| What is drowsiness? | a definition answers it |
| Does it lower fatigue, improve sleep, and do drivers like it? | three questions in one |
> Exam trap: "Does technology improve road safety?" fails because it is **too broad, with no measurable outcome** — not because it is "too narrow", "a yes/no question" or "does not mention AI".
?? Label "The app will definitely reduce accidents" and rewrite it as a hypothesis.
?= An unsupported claim. Hypothesis: "Long-haul drivers using SafeDrive for six weeks will score lower on a validated fatigue scale than drivers using a paper checklist."
?? Why is the validated fatigue scale a better outcome than accidents in this case?
?= It is collected for both groups in the planned data, while accidents are too rare to compare in 60 drivers over six weeks and are not measured at all.
?? Which part of the problem statement must cite the evidence table?
?= The limitation: it shows that the need comes from what Studies A–D leave unsettled, not from opinion.`,
    ru: `## Пять типов высказываний, которые путает часть A
| Тип | Его задача | Пример SafeDrive |
|---|---|---|
| Необоснованное утверждение (unsupported claim) | результат подан как факт, без доказательств | «The app will definitely reduce accidents.» |
| Исследовательская проблема (research problem) | что происходит, что неизвестно, почему это важно | «Приложения-предупреждения предлагают дальнобойщикам, но данных по этой группе мало, и они противоречивы.» |
| Исследовательский вопрос (research question) | на что ответят данные | «Ниже ли баллы по шкале усталости у пользователей SafeDrive, чем у пользователей чек-листа, через шесть недель?» |
| Гипотеза (hypothesis) | проверяемое предсказание, которое данные могут опровергнуть | «У пользователей SafeDrive балл по валидированной шкале усталости будет ниже, чем у пользователей чек-листа.» |
| Цель (aim) | одно предложение: что исследование собирается сделать | «Сравнить уровень усталости пользователей SafeDrive и чек-листа за шесть недель.» |
> Ловушка экзамена: для «will definitely reduce accidents» соблазнительный неверный вариант — «a testable, falsifiable hypothesis». Слова уверенности — definitely, always, proves, 10x — признак **утверждения**; гипотеза осторожна и может оказаться ложной.
## B2. Постановка проблемы из трёх частей (1 балл)
@diagram rmx-rq-builder
= Current situation: [who] [does what] [where], and [what is being considered].
= Limitation: However, [Study X] found [limit], and [Study Y] reports [limit].
= Need: Therefore, evidence is needed on whether [factor] changes [outcome] for [population].
Образцовый ответ:
= Current situation: Long-haul truck drivers often work long night shifts, and a university clinic is considering SafeDrive, a phone app that detects drowsiness and sounds an alert.
= Limitation: However, Study A found fewer self-reported near-misses but no significant difference in actual accidents among taxi drivers, and Study D reports few studies on long-haul drivers and inconsistent definitions of a fatigue event.
= Need: Therefore, controlled evidence is needed on whether SafeDrive reduces fatigue among long-haul drivers compared with a simple paper checklist.
- Мнемоника **S-L-N**: ситуация (Situation) → ограничение со ссылкой (Limitation) → потребность (Need). В среднем предложении обязательна буква исследования.
- Баллы теряют за «проблема в том, что у водителей нет SafeDrive» (отсутствие решения), ограничение без источника, «no research exists» и потребность-обещание («SafeDrive will save lives»).
## B3. Один исследовательский вопрос (1 балл)
= Among [population], does [factor], compared with [comparison], change [measurable outcome] in [context / time]?
= Among long-haul truck drivers, does using SafeDrive for six weeks, compared with a paper fatigue checklist, lower scores on a validated fatigue scale?
| Элемент | SafeDrive |
|---|---|
| Популяция (population) | дальнобойщики |
| Фактор / сравнение (factor / comparison) | SafeDrive против бумажного чек-листа |
| Исход (outcome) | балл по валидированной шкале усталости |
| Контекст / время (context / time) | шесть недель, исследование клиники |
Пять критериев: **ясный, сфокусированный, исследуемый, выполнимый** и **связанный** с проблемой (clear, focused, researchable, feasible, connected).
| Слабый RQ | Почему не проходит |
|---|---|
| Does technology improve road safety? | слишком широкий, нет измеримого исхода (пункт 1 части A) |
| Does SafeDrive work? | «work» не определено; нет сравнения |
| Does SafeDrive reduce accidents? | невыполнимо: у 60 водителей за шесть недель аварии редки, и их не собирают |
| How many alerts do drivers get per night? | журналы сигналов есть только у группы приложения — сравнивать не с чем |
| What is drowsiness? | на него отвечает определение |
| Does it lower fatigue, improve sleep, and do drivers like it? | три вопроса в одном |
> Ловушка экзамена: «Does technology improve road safety?» плох потому, что **слишком широкий и без измеримого исхода**, — а не потому, что «слишком узкий», «вопрос да/нет» или «не упоминает ИИ».
?? Как назвать «The app will definitely reduce accidents» и как переписать это гипотезой?
?= Необоснованное утверждение. Гипотеза: «Long-haul drivers using SafeDrive for six weeks will score lower on a validated fatigue scale than drivers using a paper checklist.»
?? Почему валидированная шкала усталости — лучший исход для этого кейса, чем аварии?
?= Её собирают в обеих группах по плану данных, а аварии слишком редки, чтобы сравнивать 60 водителей за шесть недель, и вообще не измеряются.
?? Какая часть постановки проблемы обязана ссылаться на таблицу доказательств?
?= Ограничение (limitation): оно показывает, что потребность вытекает из того, что Studies A–D оставляют нерешённым, а не из мнения.`,
  },
};

const s3: Section = {
  id: "rm-fast-3",
  title: { en: "Ethics and data protection: risk → safeguard → record (2 points)", ru: "Этика и защита данных: риск → мера → запись (2 балла)" },
  minutes: 15,
  notes: {
    en: `## Part A item: video and location by default
"The app continuously records camera video and location unless the driver changes the default setting." → an **ethical and data-protection risk**: identifiable, sensitive data far beyond what the RQ needs, collected without an active choice. Not a battery, cost or accuracy problem.
## B5. Two risks, each with a safeguard and a record (1.5 points)
Each risk is three linked pieces, 0.25 points each:
@diagram rmx-risk-chain
- **Risk** — specific: what data, whose, what could go wrong.
- **Safeguard** — an action that reduces the risk, not a wish ("be careful", "follow the law").
- **Record** — a document another person could inspect, showing that the safeguard was **applied**.
| Risk in SafeDrive | Safeguard | Evidence / record |
|---|---|---|
| continuous video records faces of drivers and passengers | video off by default (opt-in); detection on the phone, no frames stored | settings export of the defaults; data-management plan listing the stored fields |
| continuous GPS reveals homes, routes and stops | location saved only at alert events and coarsened, or not at all | data dictionary; a sample export with no raw GPS |
| employer pressure to take part and be monitored | recruitment by the clinic; no individual data to employers; withdrawal without penalty | signed, dated consent forms; data-sharing agreement excluding employers |
| sleep and fatigue are health data that could leak | pseudonymous codes, key kept apart; encrypted university storage; named access | access-control list and access log; deletion log |
| the study runs without review | ethics committee review before collection | approval letter with a reference number |
= Risk: [what data, whose, what harm]. Safeguard: [concrete action]. Record: [document that proves it was done].
> Exam trap: "We will obtain consent" is a safeguard, not a record — the record is the signed form. "Store data securely" and "we promise" earn nothing: name the mechanism and the document.
## Terms the marker expects
- **Informed consent** — participants understand (purpose, data, risks), choose freely, can withdraw and can ask. Recording video or location needs explicit disclosure.
- **Data minimisation** — collect only what the RQ needs: the RQ measures fatigue scores, so continuous video is not needed.
- **Confidential ≠ anonymous** — with a name–code key the data are pseudonymised and confidential; anonymous means nobody can re-link them. GPS traces are never anonymous.
- **Data lifecycle** — collect → store → access → retain → delete or share, each with a decision and a record.
- **Integrity (FFP)** — fabrication = inventing, falsification = distorting (hiding runs counts), plagiarism = taking words, ideas or data.
?? "Risk: privacy. Safeguard: we will protect the data. Evidence: we promise." How many of the three pieces earn marks?
?= None: the risk names no data or person, the safeguard is not an action, and a promise is not a record.
?? Give a second risk, different from the video risk, with a safeguard and a record.
?= Employer pressure: drivers may feel they must join. Safeguard: recruitment and consent by the clinic, no individual data to employers, withdrawal without penalty. Record: signed consent forms and a data-sharing agreement that excludes employers.
?? A team keeps pseudonymised data with a separate name–code key and calls them anonymous. Correct?
?= No — the key can re-link each record to a person, so the data are confidential (pseudonymised), not anonymous.`,
    ru: `## Пункт части A: видео и геолокация по умолчанию
«The app continuously records camera video and location unless the driver changes the default setting.» → **этический риск и риск для защиты данных (ethical and data-protection risk)**: идентифицирующие, чувствительные данные далеко сверх нужного вопросу, собранные без активного выбора. Это не проблема батареи, стоимости или точности.
## B5. Два риска, у каждого — мера защиты и запись (1.5 балла)
Каждый риск — три связанных элемента, по 0.25 балла:
@diagram rmx-risk-chain
- **Риск (risk)** — конкретный: какие данные, чьи, что может пойти не так.
- **Мера защиты (safeguard)** — действие, которое снижает риск, а не пожелание («быть аккуратными», «соблюдать закон»).
- **Запись (record)** — документ, который может проверить другой человек и который показывает, что мера **применена**.
| Риск в SafeDrive | Мера защиты | Доказательство / запись |
|---|---|---|
| непрерывное видео снимает лица водителей и пассажиров | видео выключено по умолчанию (opt-in); распознавание на телефоне, кадры не хранятся | экспорт настроек по умолчанию; план управления данными со списком хранимых полей |
| непрерывный GPS раскрывает дома, маршруты и остановки | место сохраняется только в момент сигнала и огрублённо — или не сохраняется | словарь данных; пример выгрузки без сырых GPS |
| давление работодателя: участвовать и быть под наблюдением | набор через клинику; работодатель не получает индивидуальных данных; выход без последствий | подписанные датированные формы согласия; соглашение о передаче данных без работодателя |
| сон и усталость — медицинские данные, которые могут утечь | коды вместо имён, ключ хранится отдельно; шифрованное хранилище университета; поимённый доступ | список доступа и журнал доступа; журнал удаления |
| исследование идёт без рассмотрения | рассмотрение этическим комитетом до сбора данных | письмо об одобрении с номером |
= Risk: [what data, whose, what harm]. Safeguard: [concrete action]. Record: [document that proves it was done].
> Ловушка экзамена: «We will obtain consent» — мера, а не запись; запись — подписанная форма. «Store data securely» и «we promise» баллов не дают: нужно назвать механизм и документ.
## Термины, которых ждёт проверяющий
- **Информированное согласие (informed consent)** — участник понимает (цель, данные, риски), выбирает свободно, может выйти и задать вопрос. Запись видео или геолокации требует явного раскрытия.
- **Минимизация данных (data minimisation)** — собирать только то, что нужно RQ: RQ измеряет баллы усталости, значит, непрерывное видео не нужно.
- **Конфиденциальность ≠ анонимность** — при ключе «имя—код» данные псевдонимизированы и конфиденциальны; анонимные — те, что никто не может связать с человеком. GPS-треки анонимными не бывают.
- **Жизненный цикл данных (data lifecycle)** — сбор → хранение → доступ → срок хранения → удаление или передача, на каждом шаге решение и запись.
- **Честность исследования (FFP)** — фабрикация = выдумать, фальсификация = исказить (сокрытие прогонов тоже), плагиат = взять чужие слова, идеи или данные.
?? «Risk: privacy. Safeguard: we will protect the data. Evidence: we promise.» Сколько из трёх элементов приносят баллы?
?= Ни один: в риске не названы ни данные, ни люди, мера — не действие, а обещание — не запись.
?? Какой второй риск, отличный от видео, можно назвать — с мерой и записью?
?= Давление работодателя: водители могут чувствовать, что обязаны участвовать. Мера: набор и согласие через клинику, работодатель не получает индивидуальных данных, выход без последствий. Запись: подписанные формы согласия и соглашение о передаче данных без работодателя.
?? Команда хранит псевдонимизированные данные с отдельным ключом «имя—код» и называет их анонимными. Верно?
?= Нет — по ключу каждую запись можно связать с человеком, поэтому данные конфиденциальные (псевдонимизированные), а не анонимные.`,
  },
};

const s4: Section = {
  id: "rm-fast-4",
  title: { en: "Reading Study A–D: designs, data types, limitations", ru: "Как читать Study A–D: дизайны, типы данных, ограничения" },
  minutes: 15,
  notes: {
    en: `## Rewrite the table first
Before answering anything, reduce each study to four words: **design · sample · finding · limitation**. Most Part A and B marks depend on what each design **can** and **cannot** show.
| Study | Design and sample | Finding | What it cannot show |
|---|---|---|---|
| A | randomised; 150 taxi drivers aged 35–55; 8 weeks | fewer self-reported near-misses; accident difference small, not significant | recorded behaviour (self-report); long-haul drivers |
| B | observational; 900 users of an alert app | frequent responders had fewer logged fatigue events | cause: drivers chose how often to respond; baseline sleep not controlled |
| C | qualitative interviews; 18 long-haul drivers | audio alerts valued at night; constant video intrusive, some covered the camera | how much alerts help; small sample |
| D | systematic review of 15 studies | mixed results; "fatigue event" defined differently; short follow-up | few long-haul studies; attrition common |
> No study answers the clinic's question directly: A has the wrong population, B cannot show cause, C has no numbers, D is mixed. That is where the B7 gap comes from.
## What each design gives
| Design | Data | Can show | Typical limitation |
|---|---|---|---|
| Randomised controlled trial (RCT) | quantitative, primary | whether X **causes** a change in Y | artificial setting, cost, attrition, narrow sample |
| Observational / log study | quantitative, primary | an **association** in real use | self-selection, confounders |
| Survey with rating scales | quantitative, self-report | what many people report | self-report bias; shows what, not why |
| Interviews / focus groups | **qualitative**, primary | **why** and **how** people act | small sample, no effect size |
| Systematic review | secondary synthesis | the pattern across many studies | only as good and comparable as the included studies |
| System / benchmark evaluation | quantitative | reproducible metrics | may not reflect real users |
> Exam trap: "Which study provides qualitative data?" → the **interview** study (C). Self-reported sleep hours or a fatigue score are still **numbers**, so quantitative; a systematic review is secondary, not qualitative.
## Limitation words to reuse in B6 and B7
- **Self-reported outcome** — memory and the wish to look good distort it; it captures perception, not recorded behaviour.
- **Self-selection** — participants chose their own exposure, so the groups differed from the start.
- **Confounder** — a third factor (baseline sleep, motivation) that could explain the result.
- **Population mismatch** — taxi drivers aged 35–55 are not long-haul truck drivers.
- **Small sample · attrition · short follow-up · inconsistent definitions** — each weakens the claim or the comparison between studies.
- **Correlation ≠ causation** — an observational association does not prove that X causes Y.
?? Study B: frequent responders had fewer logged fatigue events. Can you write that responding to alerts reduces fatigue?
?= No. It is observational: drivers chose how often to respond and baseline sleep was not controlled, so self-selection or a confounder could explain the association.
?? Which of the planned data in the 60-driver study are qualitative?
?= None. Alert logs, sleep hours, fatigue-scale scores, driving experience and comfort scores are all numbers; in the table only Study C gives qualitative data.`,
    ru: `## Сначала переписать таблицу
Прежде чем отвечать, сожмите каждое исследование до четырёх слов: **дизайн · выборка · результат · ограничение**. Большинство баллов частей A и B зависят от того, что дизайн **может** и чего **не может** показать.
| Study | Дизайн и выборка | Результат | Чего не может показать |
|---|---|---|---|
| A | рандомизированное; 150 таксистов 35–55 лет; 8 недель | меньше опасных ситуаций по самоотчёту; разница в авариях мала и незначима | записанное поведение (самоотчёт); дальнобойщиков |
| B | наблюдательное; 900 пользователей приложения-предупреждения | у часто реагирующих меньше записанных эпизодов усталости | причину: водители сами выбирали, как часто реагировать; исходный сон не контролировался |
| C | качественные интервью; 18 дальнобойщиков | звуковые сигналы ценят ночью; постоянное видео навязчиво, некоторые заклеивали камеру | насколько сигналы помогают; маленькая выборка |
| D | систематический обзор 15 исследований | смешанные итоги; «эпизод усталости» определяли по-разному; короткое наблюдение | мало исследований дальнобойщиков; частый отсев |
> Ни одно исследование не отвечает на вопрос клиники напрямую: у A не та популяция, B не показывает причину, у C нет чисел, у D итоги смешанные. Отсюда и пробел для B7.
## Что даёт каждый дизайн
| Дизайн | Данные | Может показать | Типичное ограничение |
|---|---|---|---|
| Рандомизированное контролируемое исследование (RCT) | количественные, первичные | **вызывает** ли X изменение Y | искусственные условия, цена, отсев, узкая выборка |
| Наблюдательное исследование / анализ журналов (observational) | количественные, первичные | **связь (association)** в реальном использовании | самоотбор, вмешивающиеся факторы |
| Опрос со шкалами (survey) | количественные, самоотчёт | что сообщают многие люди | искажения самоотчёта; показывает «что», а не «почему» |
| Интервью / фокус-группы | **качественные**, первичные | **почему** и **как** люди действуют | маленькая выборка, нет величины эффекта |
| Систематический обзор (systematic review) | вторичный синтез | общую картину по многим исследованиям | хорош настолько, насколько хороши и сопоставимы включённые работы |
| Оценка системы / бенчмарк | количественные | воспроизводимые метрики | может не отражать реальных пользователей |
> Ловушка экзамена: «Which study provides qualitative data?» → исследование с **интервью** (C). Часы сна или балл усталости из самоотчёта — всё равно **числа**, то есть количественные данные; систематический обзор — вторичное исследование, а не качественное.
## Слова-ограничения для B6 и B7
- **Самоотчёт (self-reported outcome)** — память и желание выглядеть лучше искажают его; он отражает восприятие, а не записанное поведение.
- **Самоотбор (self-selection)** — участники сами выбирали воздействие, поэтому группы различались с самого начала.
- **Вмешивающийся фактор (confounder)** — третий фактор (исходный сон, мотивация), который может объяснить результат.
- **Несовпадение популяции (population mismatch)** — таксисты 35–55 лет — не дальнобойщики.
- **Маленькая выборка · отсев (attrition) · короткое наблюдение · разные определения** — каждое ослабляет вывод или сравнение исследований.
- **Корреляция ≠ причинность** — связь в наблюдательном исследовании не доказывает, что X вызывает Y.
?? Study B: у часто реагирующих меньше записанных эпизодов усталости. Можно ли написать, что реакция на сигналы снижает усталость?
?= Нет. Исследование наблюдательное: водители сами выбирали, как часто реагировать, а исходный сон не контролировался, поэтому связь может объясняться самоотбором или вмешивающимся фактором.
?? Какие из запланированных данных в исследовании 60 водителей качественные?
?= Никакие. Журналы сигналов, часы сна, баллы шкалы усталости, стаж и балл удобства смартфона — всё числа; в таблице качественные данные даёт только Study C.`,
  },
};

const s5: Section = {
  id: "rm-fast-5",
  title: { en: "The synthesis paragraph (1.5 points)", ru: "Абзац-синтез (1.5 балла)" },
  minutes: 15,
  notes: {
    en: `## Summary vs synthesis
"Study A found X. Study B found Y. Study C found Z. Study D found W." — four mini-summaries: low marks even if every fact is right. A **synthesis** makes the studies talk to each other: compare, connect, critique.
| Summary — loses points | Synthesis — earns points |
|---|---|
| organised by paper: A, then B, then C | organised by theme: findings, methods, limitations |
| each study isolated | "A and B both…", "In contrast, C…", "Only A…" |
| differences listed | differences explained by design |
| ends with the last study | ends with what remains unclear → the gap |
@diagram rmx-synthesis-grid
## The four-sentence template
= Findings: Studies [X] and [Y] both suggest [pattern], yet [Z] found [difference].
= Methods: only [X] [randomised / measured directly]; in [Y] [self-selection / confounder], while [C] explains [why / acceptability] rather than [effect].
= Limitations: [shared limitation] (Studies [..]), and [another one] (Study [..]).
= Overall: [what the studies suggest], but [the RQ outcome for the RQ population] remains unclear.
## Model answer (SafeDrive)
= Findings: Studies A and B both link drowsiness alerts to fewer fatigue-related problems, yet Study A found no significant difference in actual accidents and Study D's review of 15 studies reports mixed results.
= Methods: only Study A randomised drivers; in Study B drivers chose how often to respond, so its association may reflect self-selection and uncontrolled baseline sleep, while Study C's interviews explain acceptability rather than effect.
= Limitations: outcomes are self-reported or defined inconsistently (Studies A and D), long-haul drivers are rarely sampled (A used taxi drivers; D found few long-haul studies), and follow-up is short.
= Overall: alerts may reduce perceived fatigue, but their effect on long-haul drivers' fatigue, measured with one validated scale, remains unclear.
## Rules that earn the marks
- Every sentence names **two or more studies** or a pattern across them, and all four studies appear.
- Use each study for what its design can show: C explains **why** drivers resist video, not **how much** alerts help.
- Hedge: may, suggests, remains unclear — never "proves" for mixed evidence.
- Linking words: both, similarly, in contrast, whereas, only, however, across the studies, none of them.
?? Rewrite "Study C interviewed 18 drivers who liked audio alerts" as a synthesis sentence.
?= For example: "While Studies A and B measure the effect of alerts, only Study C explains acceptability: drivers valued audio alerts at night but found video intrusive — a factor the quantitative studies did not examine."
?? A draft goes "Study A… Study B… Study C… Study D…". What is the first change?
?= Reorganise it by theme: open each sentence with a pattern (a shared finding, a method difference, a common limitation) and cite several studies inside it.`,
    ru: `## Пересказ и синтез
«Study A found X. Study B found Y. Study C found Z. Study D found W.» — четыре мини-пересказа: низкая оценка, даже если каждый факт верен. **Синтез (synthesis)** заставляет исследования «разговаривать»: сравнивать, связывать, критиковать.
| Пересказ — теряет баллы | Синтез — приносит баллы |
|---|---|
| по статьям: A, потом B, потом C | по темам: результаты, методы, ограничения |
| каждое исследование отдельно | «A and B both…», «In contrast, C…», «Only A…» |
| различия перечислены | различия объяснены дизайном |
| заканчивается последним исследованием | заканчивается тем, что остаётся неясным → пробел |
@diagram rmx-synthesis-grid
## Шаблон из четырёх предложений
= Findings: Studies [X] and [Y] both suggest [pattern], yet [Z] found [difference].
= Methods: only [X] [randomised / measured directly]; in [Y] [self-selection / confounder], while [C] explains [why / acceptability] rather than [effect].
= Limitations: [shared limitation] (Studies [..]), and [another one] (Study [..]).
= Overall: [what the studies suggest], but [the RQ outcome for the RQ population] remains unclear.
## Образцовый ответ (SafeDrive)
= Findings: Studies A and B both link drowsiness alerts to fewer fatigue-related problems, yet Study A found no significant difference in actual accidents and Study D's review of 15 studies reports mixed results.
= Methods: only Study A randomised drivers; in Study B drivers chose how often to respond, so its association may reflect self-selection and uncontrolled baseline sleep, while Study C's interviews explain acceptability rather than effect.
= Limitations: outcomes are self-reported or defined inconsistently (Studies A and D), long-haul drivers are rarely sampled (A used taxi drivers; D found few long-haul studies), and follow-up is short.
= Overall: alerts may reduce perceived fatigue, but their effect on long-haul drivers' fatigue, measured with one validated scale, remains unclear.
## Правила, которые приносят баллы
- В каждом предложении **два и больше исследования** или закономерность между ними; встречаются все четыре.
- Каждое исследование — для того, что умеет показать его дизайн: C объясняет, **почему** водители против видео, а не **насколько** помогают сигналы.
- Осторожные формулировки: may, suggests, remains unclear — никогда «proves» при смешанных данных.
- Связки: both, similarly, in contrast, whereas, only, however, across the studies, none of them.
?? Как переписать «Study C interviewed 18 drivers who liked audio alerts» в предложение-синтез?
?= Например: «While Studies A and B measure the effect of alerts, only Study C explains acceptability: drivers valued audio alerts at night but found video intrusive — a factor the quantitative studies did not examine.»
?? Черновик идёт «Study A… Study B… Study C… Study D…». Что поменять первым?
?= Перестроить по темам: каждое предложение открывать закономерностью (общий результат, различие методов, общее ограничение) и внутри ссылаться на несколько исследований.`,
  },
};

const s6: Section = {
  id: "rm-fast-6",
  title: { en: "A genuine research gap (1 point)", ru: "Настоящий исследовательский пробел (1 балл)" },
  minutes: 10,
  notes: {
    en: `## What a gap is — and is not
A **research gap** is something important that previous research has not adequately answered, tested, compared or studied **in a specific context**. It must follow from the studies in front of you, not from a failed search.
| Gap type | Signal in the evidence | SafeDrive |
|---|---|---|
| Population / context | studied in another group or setting | Study A used taxi drivers aged 35–55 |
| Method | few controlled or direct measurements | only A is randomised; B is observational |
| Contradiction | studies disagree, the reason is unexplained | A positive on near-misses, D mixed |
| Evaluation / data | inconsistent measures, short follow-up | D: "fatigue event" defined differently |
| Outdated evidence | old studies, old technology | — |
## The gap formula
= We know… → However… → We still do not know… → Therefore, this study will…
Model answer (1 point):
= We know: Studies A and B suggest that alerts can reduce self-reported near-misses and logged fatigue events.
= However: Study A sampled taxi drivers aged 35–55, and Study D found few long-haul studies and inconsistent definitions of a fatigue event.
= Gap: it remains unclear whether an alert app lowers fatigue among long-haul truck drivers when fatigue is measured with a validated scale.
= Our study: a six-week comparison of SafeDrive with a paper checklist in 60 long-haul drivers, using the same validated scale in both groups, could address this.
## Not a gap
| Wrong | Why |
|---|---|
| No research exists on drowsiness apps. | Studies A–D contradict it, and the task forbids it |
| I could not find SafeDrive in Google Scholar. | a failed search, not a literature gap |
| SafeDrive is new, so nobody has studied it. | a new product is not a new question |
| Study D says more research is needed. | future work must be verified before it becomes your gap |
| Drivers prefer audio alerts. | a finding, not something unknown |
> Exam trap: the gap must lead to **your** RQ. If the gap is about accidents but the RQ measures fatigue scores, the chain is broken and the point for "how the study addresses it" is lost.
?? Turn "There are not many studies about Kazakh LLMs" into a defensible gap.
?= "Existing studies evaluate LLM factual QA in English and Russian; however, Kazakh has been studied mainly for translation, so it remains unclear how accurately LLMs answer factual questions in Kazakh."
?? Which words replace "no research exists" in almost every gap sentence?
?= "Limited" and "remains unclear": they describe the state of the evidence without an absolute claim.`,
    ru: `## Что такое пробел — и что нет
**Исследовательский пробел (research gap)** — что-то важное, на что прежние исследования не ответили, не проверили, не сравнили или не изучили **в конкретном контексте**. Он должен вытекать из исследований перед глазами, а не из неудачного поиска.
| Тип пробела | Сигнал в доказательствах | SafeDrive |
|---|---|---|
| Популяция / контекст | изучали другую группу или обстановку | Study A — таксисты 35–55 лет |
| Метод | мало контролируемых или прямых измерений | рандомизировано только A; B — наблюдательное |
| Противоречие | исследования расходятся, причина не объяснена | A положительно по опасным ситуациям, D — смешанно |
| Оценка / данные | разные меры, короткое наблюдение | D: «эпизод усталости» определяли по-разному |
| Устаревшие данные | старые исследования, старые технологии | — |
## Формула пробела
= We know… → However… → We still do not know… → Therefore, this study will…
Образцовый ответ (1 балл):
= We know: Studies A and B suggest that alerts can reduce self-reported near-misses and logged fatigue events.
= However: Study A sampled taxi drivers aged 35–55, and Study D found few long-haul studies and inconsistent definitions of a fatigue event.
= Gap: it remains unclear whether an alert app lowers fatigue among long-haul truck drivers when fatigue is measured with a validated scale.
= Our study: a six-week comparison of SafeDrive with a paper checklist in 60 long-haul drivers, using the same validated scale in both groups, could address this.
## Не пробел
| Неверно | Почему |
|---|---|
| No research exists on drowsiness apps. | Studies A–D это опровергают, и задание это запрещает |
| I could not find SafeDrive in Google Scholar. | неудачный поиск, а не пробел в литературе |
| SafeDrive is new, so nobody has studied it. | новый продукт — не новый вопрос |
| Study D says more research is needed. | «future work» нужно проверить, прежде чем назвать своим пробелом |
| Drivers prefer audio alerts. | это результат, а не неизвестное |
> Ловушка экзамена: пробел должен вести к **вашему** RQ. Если пробел про аварии, а RQ измеряет баллы усталости, цепочка разорвана, и балл за «как исследование его закрывает» теряется.
?? Как превратить «There are not many studies about Kazakh LLMs» в обоснованный пробел?
?= «Existing studies evaluate LLM factual QA in English and Russian; however, Kazakh has been studied mainly for translation, so it remains unclear how accurately LLMs answer factual questions in Kazakh.»
?? Какие слова почти в каждом пробеле заменяют «no research exists»?
?= «Limited» и «remains unclear»: они описывают состояние доказательств без абсолютного утверждения.`,
  },
};

const s7: Section = {
  id: "rm-fast-7",
  title: { en: "Literature review and the search string", ru: "Обзор литературы и поисковая строка" },
  minutes: 12,
  notes: {
    en: `## The literature review in five lines
- A literature review is **not** a list of papers, a summary or a bibliography: it is an **analysis and synthesis** of existing research — what is known, how it was studied, where studies agree or disagree, their limitations and what remains unknown.
- Why: understand what is known, avoid duplication (three months on an experiment someone already did), find methods, datasets and metrics, spot contradictions, justify the study, find the gap.
- **Primary** source = the original study; **secondary** = a review, systematic review or textbook. Trace important claims back to the primary study.
- Credibility tiers: **Tier 1** peer-reviewed journals and conference papers (IEEE Xplore, ACM DL, Springer, Scopus); **Tier 2** official whitepapers and documentation; **Tier 3** Medium, TechCrunch, YouTube, README files — avoid.
- Where to search: Google Scholar (broad, free) · Scopus, Web of Science · IEEE Xplore, ACM DL (computing) · ScienceDirect, SpringerLink · Litmaps, Connected Papers (visual maps). Google ≠ Google Scholar.
## B4. A balanced search string (0.5 points)
RQ → 2–3 concepts → 2–3 synonyms for each → string. Never paste the whole RQ.
@diagram rm4-search-blocks
= ("driver fatigue" OR drowsiness OR sleepiness) AND (smartphone OR "mobile app" OR "mobile application") AND ("truck drivers" OR "long-haul drivers" OR "commercial drivers")
| Tool | Job |
|---|---|
| " " | keeps a multi-word phrase together |
| OR | joins synonyms **inside** a bracket — broadens |
| AND | joins concept groups **between** brackets — narrows |
| ( ) | groups the synonyms so the order is clear |
Typical errors:
| Error | Example |
|---|---|
| OR between concepts | drowsiness OR truck |
| AND between synonyms | "driver fatigue" AND drowsiness AND sleepiness |
| no brackets | drowsiness OR fatigue AND truck |
| no quotation marks | long-haul truck drivers |
| the RQ pasted in | Does SafeDrive reduce fatigue in drivers? |
> Exam trap: four or five AND-groups look thorough but make the string too narrow; two or three groups balance it.
## Screening and reading
- 2,438 results are the start of filtering, not a success. Screen **title → abstract → keywords → conclusion**, and read in full only what passes.
- Read strategically: title and abstract → conclusion → method → results → full text.
- Five questions for every paper: the problem, the research question, the method, the findings and **what is still missing**.
- An **evidence matrix** (paper · method and data · finding · limitation · what is missing) turns reading into synthesis: a column read top to bottom is a theme.
?? Fix the string: drowsiness OR fatigue AND long-haul truck drivers AND app.
?= (drowsiness OR "driver fatigue") AND ("long-haul drivers" OR "truck drivers") AND ("mobile app" OR smartphone) — OR inside the brackets, AND between them, phrases in quotation marks.
?? Why is a systematic review a secondary source even though it is peer-reviewed?
?= Its authors did not run the studies: they searched, screened and combined primary studies done by others.`,
    ru: `## Обзор литературы в пяти строках
- Обзор литературы (literature review) — **не** список статей, не пересказ и не библиография, а **анализ и синтез** существующих исследований: что известно, как изучали, где исследования сходятся и расходятся, их ограничения и что остаётся неизвестным.
- Зачем: понять, что уже известно, не повторить чужое (три месяца на эксперимент, который уже сделан), найти методы, наборы данных и метрики, заметить противоречия, обосновать исследование, найти пробел.
- **Первичный** источник (primary) — само исследование; **вторичный** (secondary) — обзор, систематический обзор, учебник. Важные утверждения нужно прослеживать до первичного исследования.
- Уровни доверия: **Tier 1** — рецензируемые журналы и конференции (IEEE Xplore, ACM DL, Springer, Scopus); **Tier 2** — официальные whitepaper и документация; **Tier 3** — Medium, TechCrunch, YouTube, README — избегать.
- Где искать: Google Scholar (широко, бесплатно) · Scopus, Web of Science · IEEE Xplore, ACM DL (компьютерные науки) · ScienceDirect, SpringerLink · Litmaps, Connected Papers (визуальные карты). Google ≠ Google Scholar.
## B4. Сбалансированная поисковая строка (0.5 балла)
RQ → 2–3 понятия → по 2–3 синонима → строка. Весь RQ целиком вставлять нельзя.
@diagram rm4-search-blocks
= ("driver fatigue" OR drowsiness OR sleepiness) AND (smartphone OR "mobile app" OR "mobile application") AND ("truck drivers" OR "long-haul drivers" OR "commercial drivers")
| Инструмент | Задача |
|---|---|
| " " | держит фразу из нескольких слов вместе |
| OR | соединяет синонимы **внутри** скобки — расширяет |
| AND | соединяет группы понятий **между** скобками — сужает |
| ( ) | группирует синонимы, чтобы порядок был ясен |
Типичные ошибки:
| Ошибка | Пример |
|---|---|
| OR между понятиями | drowsiness OR truck |
| AND между синонимами | "driver fatigue" AND drowsiness AND sleepiness |
| нет скобок | drowsiness OR fatigue AND truck |
| нет кавычек | long-haul truck drivers |
| вставлен весь RQ | Does SafeDrive reduce fatigue in drivers? |
> Ловушка экзамена: четыре-пять групп через AND выглядят основательно, но делают строку слишком узкой; две-три группы дают баланс.
## Отбор и чтение
- 2 438 результатов — начало отбора, а не успех. Отбирать по схеме **название → аннотация → ключевые слова → выводы**, целиком читать только то, что прошло.
- Читать стратегически: название и аннотация → выводы → метод → результаты → полный текст.
- Пять вопросов к каждой статье: проблема, исследовательский вопрос, метод, результаты и **чего всё ещё не хватает**.
- **Матрица доказательств (evidence matrix)** (статья · метод и данные · результат · ограничение · чего не хватает) превращает чтение в синтез: столбец сверху вниз — это тема.
?? Как исправить строку: drowsiness OR fatigue AND long-haul truck drivers AND app?
?= (drowsiness OR "driver fatigue") AND ("long-haul drivers" OR "truck drivers") AND ("mobile app" OR smartphone) — OR внутри скобок, AND между ними, фразы в кавычках.
?? Почему систематический обзор — вторичный источник, хотя он рецензируемый?
?= Его авторы не проводили исследования: они искали, отбирали и объединяли первичные исследования других людей.`,
  },
};

const s8: Section = {
  id: "rm-fast-8",
  title: { en: "Source verification, AI references, plagiarism and Mendeley", ru: "Проверка источников, ссылки от ИИ, плагиат и Mendeley" },
  minutes: 12,
  notes: {
    en: `## Part A item: AI-suggested records without a DOI
"The literature folder contains records suggested by a generative AI tool; some have no DOI and have never been opened." → the risk of **citing fabricated or unverified sources**. Fix: open and verify every record before citing it.
> Exam trap: "no DOI means the paper is fake" is wrong. A missing DOI is not a missing source — books, theses and some conference papers have only a publisher or repository record. The problem is that nobody **opened** the records.
## The verification ladder
@diagram rm3-verify-ladder
= 1 READ → 2 MATCH → 3 RESOLVE → 4 CHECK → 5 OPEN
| Step | Check |
|---|---|
| READ | the title and abstract fit the topic |
| MATCH | a publisher or repository record exists (journal site, IEEE Xplore, ACM DL, arXiv) |
| RESOLVE | the DOI or Crossref Metadata Search (search.crossref.org) gives the same title, authors, year and venue |
| CHECK | corrections, expressions of concern, **retraction**, version (preprint or published) |
| OPEN | the method and result actually support the claim |
- **Verified** = record link + matched metadata + date checked. **Unresolved** = do not cite it as evidence.
- **DOI** is an identifier, not a quality badge: it resolves and separates versions but proves nothing about method, ethics, relevance or a later retraction. A DOI that opens a different paper is a red flag.
- A **retracted** paper is withdrawn — not evidence. **Predatory journals** take fees without real peer review (spam invitations, acceptance within days, indexing the index itself does not confirm) — and they register DOIs too.
## AI: support, never evidence
- Allowed support: search-term ideas, explaining terms, grammar after writing the text yourself, suggesting checks.
- Not allowed: unopened or invented sources, fabricated data, hidden generated text, protected data in unapproved tools. AI-generated content without citation → 0 points and a report to the disciplinary committee.
- The contract: **NO SOURCE** unopened · **NO CLAIM** without evidence · **NO SECRET DATA** · **NO HIDDEN ROLE**.
## Plagiarism and Mendeley in four lines
- Plagiarism covers **words, ideas and data**. Copying and **patchwriting** (a few words swapped, the structure kept) are not acceptable; a **paraphrase** with a citation is; **synthesis** is the goal.
- **Mendeley:** Import (PDF, Web Importer, DOI) → Verify the metadata → Organise (collection, tags, notes) → Read (highlight, annotate) → Cite (**Mendeley Cite** in Word: insert the citation, choose the style, insert the bibliography, inspect every entry).
- Reference manager ≠ source verifier: Mendeley stores an invented reference as happily as a real one.
- **APA** = author–date (Ali & Chen, 2024), list alphabetical; **IEEE** = numbers [1] in order of first citation.
?? An AI-suggested DOI opens a paper with a different title and authors. Is the reference verified?
?= No — identity fails. Mark it unresolved, search Crossref by title and authors, and cite only a record whose metadata match.
?? A student swaps every third word of a paragraph for a synonym and adds a citation. Acceptable?
?= No — that is patchwriting: the source's structure stays. Rebuild the idea in a new structure (paraphrase) or quote it.`,
    ru: `## Пункт части A: записи от ИИ без DOI
«The literature folder contains records suggested by a generative AI tool; some have no DOI and have never been opened.» → риск **цитировать выдуманные или непроверенные источники**. Решение: открыть и проверить каждую запись до цитирования.
> Ловушка экзамена: «нет DOI — значит, статья фальшивая» — неверно. Нет DOI — ещё не значит, что нет источника: у книг, диссертаций и части докладов есть только запись издателя или репозитория. Проблема в том, что записи никто **не открывал**.
## Лестница проверки
@diagram rm3-verify-ladder
= 1 READ → 2 MATCH → 3 RESOLVE → 4 CHECK → 5 OPEN
| Шаг | Проверка |
|---|---|
| READ | название и аннотация подходят к теме |
| MATCH | есть запись издателя или репозитория (сайт журнала, IEEE Xplore, ACM DL, arXiv) |
| RESOLVE | DOI или Crossref Metadata Search (search.crossref.org) дают те же название, авторов, год и издание |
| CHECK | исправления, выражения обеспокоенности, **отзыв статьи (retraction)**, версия (препринт или опубликованная) |
| OPEN | метод и результат действительно подтверждают утверждение |
- **Проверен** = ссылка на запись + совпавшие метаданные + дата проверки. **Не подтверждён** = не цитировать как доказательство.
- **DOI** — идентификатор, а не знак качества: он открывается и различает версии, но ничего не доказывает о методе, этике, уместности или позднем отзыве. DOI, который открывает другую статью, — тревожный признак.
- **Отозванная** статья снята с публикации — это не доказательство. **Хищнические журналы (predatory journals)** берут плату без настоящего рецензирования (рассылки-приглашения, принятие за несколько дней, индексация, которую сам индекс не подтверждает) — и тоже регистрируют DOI.
## ИИ: помощь, а не доказательство
- Можно: идеи поисковых слов, объяснение терминов, грамматика после того, как текст написан самостоятельно, подсказки, что проверить.
- Нельзя: неоткрытые или выдуманные источники, сфабрикованные данные, скрытый сгенерированный текст, защищённые данные в неодобренных сервисах. Текст от ИИ без указания источника → 0 баллов и рапорт в дисциплинарную комиссию.
- Договор: **NO SOURCE** без открытия · **NO CLAIM** без доказательства · **NO SECRET DATA** · **NO HIDDEN ROLE**.
## Плагиат и Mendeley в четырёх строках
- Плагиат — это чужие **слова, идеи и данные**. Копирование и **patchwriting** (заменено несколько слов, структура осталась) недопустимы; **парафраз** со ссылкой допустим; **синтез** — цель.
- **Mendeley:** Import (PDF, Web Importer, DOI) → Verify, проверка метаданных → Organise (коллекция, теги, заметки) → Read (выделения, аннотации) → Cite (**Mendeley Cite** в Word: вставить ссылку, выбрать стиль, вставить список литературы, проверить каждую запись).
- Менеджер ссылок ≠ проверка источника: Mendeley так же охотно хранит выдуманную ссылку, как и настоящую.
- **APA** — автор и год (Ali & Chen, 2024), список по алфавиту; **IEEE** — номера [1] в порядке первого упоминания.
?? DOI, предложенный ИИ, открывает статью с другим названием и авторами. Ссылка проверена?
?= Нет — не совпадает идентичность. Отметить её как неподтверждённую, искать в Crossref по названию и авторам и цитировать только запись с совпадающими метаданными.
?? Студент заменяет в абзаце каждое третье слово синонимом и добавляет ссылку. Допустимо?
?= Нет — это patchwriting: структура источника осталась. Идею нужно перестроить по-своему (парафраз) или процитировать.`,
  },
};

const s9: Section = {
  id: "rm-fast-9",
  title: { en: "Research vs development; what research is", ru: "Исследование и разработка; что такое исследование" },
  minutes: 8,
  notes: {
    en: `## What research is (O'Leary)
Research is a **systematic, creative and critical** process used to find **verifiable** answers to unsolved questions, solve real, localized computing problems and build **credible, reproducible** knowledge. Reading Wikipedia, TechCrunch or Reddit, or asking ChatGPT for a fact, is looking things up — not research.
= Research = a question + a method + evidence + a conclusion others can check
- Case: "Use Rust — a Medium post says it is fast" is guessing. Research is a controlled benchmark of Java vs Rust at 100,000 requests/sec measuring CPU, RAM and latency (ms).
## Research vs development
@diagram rm1-research-vs-dev
| | Development | Research |
|---|---|---|
| Starts with | requirements | a question |
| Output | an artefact: app, prototype, feature, model, dashboard | knowledge: findings, a comparison, an analysis, a review |
| Success | it works as specified | the answer is backed by evidence, even "no effect" |
| SafeDrive | the prototype with camera detection and alerts | evidence on whether SafeDrive changes fatigue scores vs a checklist |
B1 model answer (0.5 points):
= Development output: the SafeDrive prototype, a phone app that detects drowsiness through the camera and sounds an alert.
= Research output: evidence, presented in a study report, on whether six weeks of SafeDrive use changes validated fatigue scores compared with a paper checklist.
> Exam trap: comparing alert rates, analysing self-reported fatigue and a systematic review are all **research** outputs; only the prototype is development. Data (logs, sleep diaries) are inputs, not outputs at all.
## The researcher's mindset: S-R-O
| Habit | Means | Anti-pattern |
|---|---|---|
| Critical **S**kepticism | ask how a result was obtained: method, hardware, sample size | trusting a GitHub benchmark graph |
| Methodological **R**igor | document every step so others can reproduce it | "it was faster on my laptop" |
| **O**pen-mindedness | accept data that prove your favourite tool wrong | calling the test broken when your framework loses |
- **Narrowing:** Area → Topic → Problem → Research question. Three feasibility filters: **data access, infrastructure, time** — a failing topic is reshaped, not abandoned.
?? A startup gives SafeDrive to 50 friends and says it "works great". Is this a research output?
?= No. Releasing the app is development, and "works great" is an impression. It becomes research with a clear question, a comparison group, a measured outcome and analysed data.
?? A student writes: "Development output — the alert logs; research output — the SafeDrive app." Correct it.
?= Logs are data, not an output. The app is the development output; the research output is evidence on whether SafeDrive changes fatigue scores compared with the checklist.`,
    ru: `## Что такое исследование (O'Leary)
Исследование — **систематический, творческий и критический** процесс поиска **проверяемых** ответов на нерешённые вопросы, решения реальных, привязанных к месту задач в IT и создания **достоверного, воспроизводимого** знания. Почитать Wikipedia, TechCrunch или Reddit либо спросить факт у ChatGPT — это поиск справки, а не исследование.
= Research = a question + a method + evidence + a conclusion others can check
- Кейс: «Берём Rust — в посте на Medium пишут, что он быстрый» — догадка. Исследование — контролируемый бенчмарк Java и Rust при 100 000 запросов/с с замером CPU, RAM и задержки (мс).
## Исследование и разработка
@diagram rm1-research-vs-dev
| | Разработка (development) | Исследование (research) |
|---|---|---|
| Начинается с | требований | вопроса |
| Выход | артефакт: приложение, прототип, функция, модель, дашборд | знание: результаты, сравнение, анализ, обзор |
| Успех | работает по требованиям | ответ подкреплён доказательствами, даже «эффекта нет» |
| SafeDrive | прототип с распознаванием через камеру и сигналами | доказательства, меняет ли SafeDrive баллы усталости по сравнению с чек-листом |
Образцовый ответ B1 (0.5 балла):
= Development output: the SafeDrive prototype, a phone app that detects drowsiness through the camera and sounds an alert.
= Research output: evidence, presented in a study report, on whether six weeks of SafeDrive use changes validated fatigue scores compared with a paper checklist.
> Ловушка экзамена: сравнение частоты сигналов, анализ самоотчётов об усталости и систематический обзор — всё это выходы **исследования**; к разработке относится только прототип. Данные (журналы, дневники сна) — входы, а вовсе не выходы.
## Мышление исследователя: S-R-O
| Привычка | Что значит | Антипример |
|---|---|---|
| Критический **S**кептицизм (critical skepticism) | спрашивать, как получен результат: метод, железо, размер выборки | верить графику бенчмарка из GitHub |
| Методологическая **R**игорозность (methodological rigor) | документировать каждый шаг, чтобы другие могли повторить | «на моём ноутбуке было быстрее» |
| **O**ткрытость (open-mindedness) | принимать данные, которые опровергают любимый инструмент | объявить тест сломанным, когда любимый фреймворк проиграл |
- **Сужение:** область → тема → проблема → исследовательский вопрос (Area → Topic → Problem → RQ). Три фильтра выполнимости: **доступ к данным, инфраструктура, время** — тему, которая не проходит, перестраивают, а не бросают.
?? Стартап раздал SafeDrive 50 друзьям и говорит, что оно «works great». Это выход исследования?
?= Нет. Выпуск приложения — разработка, а «works great» — впечатление. Исследованием это станет при ясном вопросе, группе сравнения, измеренном исходе и проанализированных данных.
?? Студент пишет: «Development output — the alert logs; research output — the SafeDrive app». Как исправить?
?= Журналы — это данные, а не выход. Приложение — выход разработки; выход исследования — доказательства, меняет ли SafeDrive баллы усталости по сравнению с чек-листом.`,
  },
};

const s10: Section = {
  id: "rm-fast-10",
  title: { en: "Research plan, proposal and the alignment check", ru: "План исследования, предложение и проверка согласованности" },
  minutes: 12,
  notes: {
    en: `## A research plan turns the RQ into evidence
Five questions: what **evidence** answers the RQ? **where** is it? **how** can it be collected? how will it be **analysed**? is it **feasible**?
= Problem → Aim → Research question → Evidence → Method → Analysis
@diagram rm4-alignment
At every link ask: does this step follow from the previous one? A "no" marks exactly where to revise.
## The one-page plan (course template)
| # | Section | What to write |
|---|---|---|
| 1 | Topic | specific: population, factor, outcome |
| 2 | Problem | 2–3 sentences: what exists, what is not known, why it matters |
| 3 | Aim | one sentence: "To evaluate whether…" |
| 4 | Research question(s) | one main RQ (+ one supporting) |
| 5 | Evidence needed | survey responses, metrics, test results, interviews, logs |
| 6 | Participants / data source | who or what, approximate size |
| 7 | Data collection | survey, experiment, interview, observation, existing dataset |
| 8 | Procedure | 3–5 steps from collection to results |
| 9 | Analysis | descriptive statistics, group comparison, correlation, thematic analysis |
| 10 | Feasibility and limitation | one real limitation + why the study can still be done |
- **RQ vs aim vs objectives:** the RQ asks what the data will answer; the aim says in one sentence what the study intends to achieve; objectives are 2–4 concrete steps with action verbs.
- A **proposal** adds background with verified citations, literature organised by ideas, the ethics card, a timeline (with time for ethics approval) and references in the required style.
## Typical errors
| Error | Example | Fix |
|---|---|---|
| Methods as a shopping list | "survey, interview, experiment, ML, ChatGPT" | pick the method that produces the evidence the RQ needs |
| Misalignment | RQ "Why do drivers switch alerts off?" + counting accidents | interviews: the RQ asks why, not how many |
| Misalignment | RQ "Does Tool X reduce debugging time?" + 10 interviews | measure task time with and without Tool X |
| Not feasible | training a 70B LLM from scratch on a laptop in 12 weeks | adjust the scope, not the ambition |
Feasibility checks: **time · data access · computing · skills · ethics · scope** — green: proceed, yellow: adjust, red: redesign.
> Oral-exam questions to rehearse: Why this question? Why these data? Why this method? How will the evidence answer the RQ?
?? Name the six feasibility checks.
?= Time, data access, computing, skills, ethics, scope.
?? RQ: "What types of conceptual errors occur in LLM programming explanations?" Method: interviews about whether students enjoy ChatGPT. What is wrong?
?= Misalignment: the interviews give opinions about enjoyment, but the RQ needs the generated explanations themselves — collect them, apply an evaluation procedure and categorise the errors.`,
    ru: `## План исследования превращает RQ в доказательства
Пять вопросов: какие **доказательства** отвечают на RQ? **где** они? **как** их собрать? как их **анализировать**? это **выполнимо**?
= Problem → Aim → Research question → Evidence → Method → Analysis
@diagram rm4-alignment
На каждом звене спрашивать: следует ли этот шаг из предыдущего? «Нет» точно показывает, где переделывать.
## План на одну страницу (шаблон курса)
| № | Раздел | Что писать |
|---|---|---|
| 1 | Тема (topic) | конкретно: популяция, фактор, исход |
| 2 | Проблема (problem) | 2–3 предложения: что есть, что неизвестно, почему это важно |
| 3 | Цель (aim) | одно предложение: «To evaluate whether…» |
| 4 | Исследовательский вопрос(ы) | один главный RQ (+ один вспомогательный) |
| 5 | Нужные доказательства | ответы опроса, метрики, результаты тестов, интервью, журналы |
| 6 | Участники / источник данных | кто или что, примерный объём |
| 7 | Сбор данных | опрос, эксперимент, интервью, наблюдение, готовый набор данных |
| 8 | Процедура | 3–5 шагов от сбора до результатов |
| 9 | Анализ | описательная статистика, сравнение групп, корреляция, тематический анализ |
| 10 | Выполнимость и ограничение | одно реальное ограничение + почему исследование всё равно выполнимо |
- **RQ, цель и задачи:** RQ спрашивает, на что ответят данные; цель (aim) одним предложением говорит, чего исследование хочет достичь; задачи (objectives) — 2–4 конкретных шага с глаголами действия.
- **Исследовательское предложение (proposal)** добавляет контекст с проверенными ссылками, литературу, сгруппированную по идеям, этическую карточку, график (со временем на одобрение этики) и список литературы в нужном стиле.
## Типичные ошибки
| Ошибка | Пример | Исправление |
|---|---|---|
| Методы как список покупок | «survey, interview, experiment, ML, ChatGPT» | выбрать метод, который даёт нужные RQ доказательства |
| Несогласованность | RQ «Why do drivers switch alerts off?» + подсчёт аварий | интервью: RQ спрашивает «почему», а не «сколько» |
| Несогласованность | RQ «Does Tool X reduce debugging time?» + 10 интервью | измерить время задачи с Tool X и без него |
| Невыполнимо | обучить LLM на 70B с нуля на ноутбуке за 12 недель | сузить масштаб, а не амбицию |
Проверки выполнимости: **время · доступ к данным · вычисления · навыки · этика · объём** — зелёный: вперёд, жёлтый: подправить, красный: перепроектировать.
> Вопросы устной проверки, которые стоит отрепетировать: Why this question? Why these data? Why this method? How will the evidence answer the RQ?
?? Какие шесть проверок выполнимости?
?= Время, доступ к данным, вычисления, навыки, этика, объём (time, data access, computing, skills, ethics, scope).
?? RQ: «What types of conceptual errors occur in LLM programming explanations?» Метод: интервью о том, нравится ли студентам ChatGPT. Что не так?
?= Несогласованность: интервью дают мнения об удовольствии, а RQ нужны сами сгенерированные объяснения — собрать их, применить процедуру оценки и классифицировать ошибки.`,
  },
};

const s11: Section = {
  id: "rm-fast-11",
  title: { en: "Methodology for the midterm: quantitative, qualitative, mixed, sampling", ru: "Методология к мидтерму: количественный, качественный, смешанный подходы, выборка" },
  minutes: 15,
  notes: {
    en: `## The cardinal rule
= Research question → Evidence → Data → Methodology → Method → Answer
Do not start with a method: "my method is a survey" means nothing until the RQ is known. **Methodology** is the logic that justifies the approach; a **method** is the concrete technique (survey, interview, experiment, benchmark).
## Quantitative vs qualitative
| | Quantitative | Qualitative |
|---|---|---|
| Purpose | measurement, comparison, relationships | meaning, experience, processes |
| Evidence | numbers, scores, metrics | words, observations, transcripts |
| Analysis | statistical | thematic / interpretive |
| Reasoning | often deductive: theory → hypothesis → data → test | often inductive: data → patterns → categories → interpretation |
| Typical questions | how much? how often? is there a difference or a relationship? | how? why? what is it like? |
| Strength | precision, replication | depth, context, discovery |
- Read the key words: "difference in time between groups" → quantitative; "how do students **describe** / **experience**" → qualitative; "how does AI affect learning?" → **refine the RQ first**, because "learning" is undefined.
- **Operationalization** turns a concept into a measure: accuracy → % correct; speed → task time in minutes.
- **Independent variable** — what is changed or compared (SafeDrive vs checklist); **dependent variable** — what is measured (fatigue score).
- **Correlation ≠ causation.** A **hypothesis** belongs to confirmatory studies; an exploratory RQ ("What types of errors occur?") may not need one.
- Traps: numbers do not make a study quantitative; interviews are not automatically qualitative; experiments are not always stronger; qualitative research needs rigour too (reflexivity, thick description, member checking, audit trail).
## Mixed methods
Both strands are **integrated** to answer one RQ — a survey with one open box is not automatically mixed methods.
@diagram rm5-mixed
| Design | Order | Use |
|---|---|---|
| Convergent | QUAN + QUAL together, then merged | compare scores with interview themes |
| Explanatory sequential | QUAN → qual | explain surprising numbers |
| Exploratory sequential | QUAL → quan | explore first, then build and test a questionnaire |
## Sampling
- **Population** (everyone the findings should apply to) → **sampling frame** (the list drawn from) → **sample** (who takes part).
- **Probability:** simple random, systematic (every k-th), stratified (random within subgroups), cluster (whole groups at random) — supports generalisation.
- **Non-probability:** convenience (high risk of bias), purposive (standard in qualitative work), snowball (hard-to-reach groups), quota (balanced, but not random).
- Quantitative: larger samples give statistical power. Qualitative: small purposive samples until **saturation**. Size does not fix bias.
> Exam trap: **random sampling** (who enters the study → generalisation) is not **random assignment** (who gets which condition → a causal comparison).
?? "How do students describe the difficulties of deciding whether to trust AI-generated code?" Quantitative or qualitative, and which method?
?= Qualitative: "describe" and "experience" ask for words and reasons. Interviews or think-aloud sessions, analysed thematically.
?? A student surveys 40 friends from one group and claims the results for all AITU students. What is wrong?
?= A convenience sample from one group is not representative, so the claim exceeds the evidence; stratified random sampling across years and programmes would support it.`,
    ru: `## Главное правило
= Research question → Evidence → Data → Methodology → Method → Answer
Не начинать с метода: «мой метод — опрос» ничего не значит, пока неизвестен RQ. **Методология (methodology)** — логика, которая обосновывает подход; **метод (method)** — конкретная техника (опрос, интервью, эксперимент, бенчмарк).
## Количественный и качественный подходы
| | Количественный (quantitative) | Качественный (qualitative) |
|---|---|---|
| Цель | измерение, сравнение, связи | смысл, опыт, процессы |
| Доказательства | числа, баллы, метрики | слова, наблюдения, расшифровки |
| Анализ | статистический | тематический / интерпретативный |
| Логика | чаще дедуктивная: теория → гипотеза → данные → проверка | чаще индуктивная: данные → закономерности → категории → интерпретация |
| Типичные вопросы | сколько? как часто? есть ли разница или связь? | как? почему? каково это? |
| Сила | точность, воспроизводимость | глубина, контекст, открытия |
- Читать ключевые слова: «difference in time between groups» → количественный; «how do students **describe** / **experience**» → качественный; «how does AI affect learning?» → **сначала уточнить RQ**, потому что «learning» не определено.
- **Операционализация (operationalization)** превращает понятие в меру: точность → % верных; скорость → время задачи в минутах.
- **Независимая переменная (independent variable)** — то, что меняют или сравнивают (SafeDrive против чек-листа); **зависимая (dependent variable)** — то, что измеряют (балл усталости).
- **Корреляция ≠ причинность.** **Гипотеза** нужна подтверждающим исследованиям; поисковому RQ («What types of errors occur?») она может быть не нужна.
- Ловушки: числа не делают исследование количественным; интервью не всегда качественные; эксперимент не всегда сильнее; качественному исследованию тоже нужна строгость (рефлексивность, плотное описание, проверка участниками, аудиторский след).
## Смешанные методы (mixed methods)
Обе линии **интегрируются**, чтобы ответить на один RQ: опрос с одним открытым полем — ещё не смешанные методы.
@diagram rm5-mixed
| Дизайн | Порядок | Применение |
|---|---|---|
| Конвергентный, параллельный (convergent) | QUAN + QUAL одновременно, затем объединение | сравнить баллы с темами интервью |
| Объяснительный последовательный (explanatory sequential) | QUAN → qual | объяснить неожиданные числа |
| Исследовательский последовательный (exploratory sequential) | QUAL → quan | сначала исследовать, потом построить и проверить анкету |
## Выборка (sampling)
- **Генеральная совокупность (population)** — все, к кому должны относиться выводы → **основа выборки (sampling frame)** — список, из которого выбирают → **выборка (sample)** — кто участвует.
- **Вероятностная:** простая случайная, систематическая (каждый k-й), стратифицированная (случайно внутри подгрупп), кластерная (целые группы наугад) — позволяет обобщать.
- **Невероятностная:** удобная (convenience, высокий риск смещения), целевая (purposive, стандарт в качественных работах), «снежный ком» (snowball, труднодоступные группы), квотная (quota, сбалансирована, но не случайна).
- Количественные: большая выборка даёт статистическую мощность. Качественные: небольшая целевая выборка до **насыщения (saturation)**. Размер не исправляет смещение.
> Ловушка экзамена: **случайный отбор (random sampling)** — кто попадает в исследование → обобщение; это не **случайное распределение (random assignment)** — кто получает какое условие → причинное сравнение.
?? «How do students describe the difficulties of deciding whether to trust AI-generated code?» Количественный или качественный, и какой метод?
?= Качественный: «describe» и «experience» требуют слов и причин. Интервью или think-aloud, тематический анализ.
?? Студент опросил 40 друзей из одной группы и распространил выводы на всех студентов AITU. Что не так?
?= Удобная выборка из одной группы не репрезентативна, поэтому вывод выходит за пределы доказательств; его поддержала бы стратифицированная случайная выборка по курсам и программам.`,
  },
};

const s12: Section = {
  id: "rm-fast-12",
  title: { en: "Final checklist: 15 minutes before the exam", ru: "Финальный чек-лист: за 15 минут до экзамена" },
  minutes: 8,
  notes: {
    en: `## Say these out loud
- Research = systematic, creative, critical; verifiable, reproducible knowledge.
- Development output = the app; research output = evidence that answers the RQ.
- "Will definitely…" = an unsupported claim; a hypothesis is testable and could be false.
- RQ = population + factor or comparison + outcome (+ context): clear, focused, researchable, feasible, connected.
- Problem statement = Situation → cited Limitation → Need.
- Search string = (synonym OR synonym) AND (synonym OR synonym), phrases in quotation marks.
- Synthesis = by theme, two or more studies per sentence, ending with what remains unclear.
- Gap = "limited" or "remains unclear", drawn from the table — never "no research exists".
- Ethics = Risk → Safeguard → Record, twice, for two different risks.
- Interviews = qualitative; RCT = cause; observational = association; systematic review = secondary.
- AI records without DOI, never opened = risk of fabricated sources → READ, MATCH, RESOLVE, CHECK, OPEN.
- Video and location by default = ethical and data-protection risk → data minimisation, opt-in.
## Fill-in templates
= Current situation: … Limitation: However, Study … found … Need: Therefore, evidence is needed on whether … changes … for …
= Among …, does …, compared with …, change … over …?
= Risk: … Safeguard: … Record: …
= Studies … and … both …, yet … In contrast, only … Across the studies, … remains unclear.
= We know… However… It remains unclear whether… This study, by …, could address this.
## Last checks on the sheet
| Check | Done when |
|---|---|
| Part A | six answers chosen, none left blank |
| B1 | two outputs, the app on the development side |
| B2 | three labelled parts, at least one study letter |
| B3 | exactly one question with population, comparison and outcome |
| B4 | quotation marks, brackets, AND, OR; every bracket closed |
| B5 | two different risks, each with a safeguard and a record |
| B6 | all four studies, organised by theme |
| B7 | a gap + how the study addresses it |
| Language | no "definitely", "proves", "no research exists" |
?? In ten seconds: what three things does every B5 risk need?
?= A specific risk, a concrete safeguard and a record that proves the safeguard was applied.
?? What links B3, B6 and B7?
?= The same population and outcome: the fatigue score of long-haul drivers appears in the RQ, in the last synthesis sentence and in the gap.`,
    ru: `## Проговорить вслух
- Исследование = систематическое, творческое, критическое; проверяемое, воспроизводимое знание.
- Выход разработки = приложение; выход исследования = доказательства, отвечающие на RQ.
- «Will definitely…» = необоснованное утверждение; гипотеза проверяема и может оказаться ложной.
- RQ = популяция + фактор или сравнение + исход (+ контекст): ясный, сфокусированный, исследуемый, выполнимый, связанный.
- Постановка проблемы = ситуация → ограничение со ссылкой → потребность.
- Поисковая строка = (синоним OR синоним) AND (синоним OR синоним), фразы в кавычках.
- Синтез = по темам, два и больше исследования в предложении, в конце — что остаётся неясным.
- Пробел = «limited» или «remains unclear», из таблицы — никогда «no research exists».
- Этика = риск → мера → запись, дважды, для двух разных рисков.
- Интервью = качественные; RCT = причина; наблюдательное = связь; систематический обзор = вторичный.
- Записи от ИИ без DOI, не открытые = риск выдуманных источников → READ, MATCH, RESOLVE, CHECK, OPEN.
- Видео и геолокация по умолчанию = этический риск и риск для защиты данных → минимизация данных, opt-in.
## Шаблоны «заполни пропуски»
= Current situation: … Limitation: However, Study … found … Need: Therefore, evidence is needed on whether … changes … for …
= Among …, does …, compared with …, change … over …?
= Risk: … Safeguard: … Record: …
= Studies … and … both …, yet … In contrast, only … Across the studies, … remains unclear.
= We know… However… It remains unclear whether… This study, by …, could address this.
## Последняя проверка листа
| Проверка | Готово, когда |
|---|---|
| Часть A | выбраны шесть ответов, пустых нет |
| B1 | два выхода, приложение — на стороне разработки |
| B2 | три подписанные части, хотя бы одна буква исследования |
| B3 | ровно один вопрос с популяцией, сравнением и исходом |
| B4 | кавычки, скобки, AND, OR; все скобки закрыты |
| B5 | два разных риска, у каждого мера и запись |
| B6 | все четыре исследования, по темам |
| B7 | пробел + как исследование его закрывает |
| Язык | нет «definitely», «proves», «no research exists» |
?? За десять секунд: какие три элемента нужны каждому риску в B5?
?= Конкретный риск, конкретная мера защиты и запись, доказывающая, что мера применена.
?? Что связывает B3, B6 и B7?
?= Одна и та же популяция и исход: балл усталости дальнобойщиков стоит в RQ, в последнем предложении синтеза и в пробеле.`,
  },
};

export const rmFast: FastTrack = {
  hours: 2.5,
  intro: {
    en: "For the last 2–3 hours before Quiz 3 or the midterm: only what earns points, ordered from the most points to the least. Read the blocks in order, answer every self-check question aloud before opening the answer, and copy each template by hand once. Then take a practice quiz case from the mock exams and mark it against the rubric.",
    ru: "Для последних 2–3 часов перед квизом 3 или мидтермом: только то, за что дают баллы, от самого «дорогого» к менее важному. Блоки стоит читать по порядку, на каждый вопрос самопроверки отвечать вслух, прежде чем открыть ответ, а каждый шаблон один раз переписать от руки. Потом — пробный квиз-кейс из пробных вариантов и сверка с критериями.",
  },
  sections: [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12],
};
