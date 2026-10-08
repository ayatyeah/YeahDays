import { part, qx, tfx, type Lecture } from "../types";

/**
 * Практика в формате квиза-кейса: «Practice Quiz 3 — SafeDrive Case»
 * (10 баллов, часть A — шесть коротких диагнозов, часть B — семь письменных
 * заданий). В конспектах — разбор кейса SafeDrive, шаблоны и образцовые
 * ответы на каждое задание; вопросы — на новых мини-кейсах той же структуры,
 * чтобы тренировать рассуждение, а не один кейс.
 */

const p1 = part(
  "rm-px-p1",
  { en: "Reading the case and the evidence table; Part A", ru: "Как читать кейс и таблицу доказательств; часть A" },
  {
    en: `## The format: 10 points, two parts
"Practice Quiz 3 — SafeDrive Case" reviews Lectures 1–4 through one scenario. The instruction at the top of the sheet is also the first marking rule: **use only the case and the evidence table**.
| Part | What you do | Points |
|---|---|---|
| A | six short diagnoses of the case, 0.5 each | 3 |
| B1–B4 | outputs, problem statement, research question, search string | 3 |
| B5–B7 | risks with safeguards, synthesis paragraph, gap | 4 |
- Every claim must point to a line of the case or to Study A–D. A figure remembered from the news or an extra paper is an **unsupported claim**; an invented source is **fabrication**.
- Name studies by letter: "Study A found…" is evidence, "research shows…" is not.
## The case in brief
A university clinic is considering **SafeDrive**, a phone app for long-haul truck drivers: the camera detects drowsiness and the app sounds an alert; it logs alert counts and geolocation; drivers self-report sleep hours and fatigue. The planned study: **60 drivers for 6 weeks**, a SafeDrive group vs a **paper fatigue-checklist** group. Data: alert logs, self-reported sleep hours, a **validated fatigue scale**, driving experience, a smartphone-comfort score.
Four red flags are planted in the text — each one becomes a Part A item:
- the title "AI for Road Safety" and the question "Does technology improve road safety?";
- the sentence "The app will definitely reduce accidents";
- literature records suggested by generative AI, some **without a DOI and never opened**;
- the app **records video and geolocation continuously by default**.
## Rewrite the evidence table in four columns
| Study | Design | Sample | Finding | Limitation |
|---|---|---|---|---|
| A | randomised | 150 taxi drivers aged 35–55, 8 weeks | fewer self-reported near-misses; accident difference small, not significant | self-reported outcome; a different population |
| B | observational | 900 users of a commercial alert app | frequent responders had fewer logged fatigue events | drivers chose how often to respond; baseline sleep not controlled |
| C | qualitative interviews | 18 long-haul drivers | audio alerts valued at night; constant video intrusive, some covered the camera | small sample; no effect estimate |
| D | systematic review | 15 driver-monitoring studies | mixed results; "fatigue event" defined differently; short follow-up | few long-haul studies; attrition common |
> No study answers the clinic's question directly: A has the wrong population, B cannot show cause, C has no numbers, D is mixed. That is where the gap in B7 comes from.
## Part A — six item types
| Item | Answer that earns 0.5 | Trap |
|---|---|---|
| "Does technology improve road safety?" | too broad (which technology, which drivers?) and no measurable outcome | only "it is a yes/no question" |
| "The app will definitely reduce accidents" | unsupported claim: a result stated before any data; Study A found no significant accident difference | calling it a hypothesis |
| the SafeDrive prototype | a development output (a built artefact); the research output is evidence that answers the RQ | calling the app the research output |
| which study gives qualitative data? | Study C — interviews, words and experiences | A or B because some data are self-reported |
| AI records without DOI, never opened | risk of citing fabricated or unverified sources; open and verify each one | "no DOI means the paper is fake" |
| video and geolocation by default | ethical and data-protection risk: identifiable, sensitive data beyond what the RQ needs | a battery or cost problem |
One item = **course term + evidence from the case + a fix**, in one or two sentences:
= Issue: too broad, no measurable outcome. Evidence: "technology" and "road safety" are undefined. Better: compare fatigue-scale scores of SafeDrive and checklist users.
## Self-reported is not qualitative
- Sleep hours, a fatigue-scale score, near-miss counts are **numbers**, so they are quantitative even when the driver reports them. Self-report lowers **reliability** (memory, wanting to look good); it does not change the data type.
- Qualitative data are **words and meanings**: interview transcripts, open answers, think-aloud notes. In this table only Study C.
- The design limits the claim: a **randomised** study (A) supports cause more strongly; an **observational** one (B) shows only an association — drivers chose how often to respond (**self-selection**), and baseline sleep is a possible **confounder**.
## Check yourself
?? A case project is called "Smart Campus" and asks "Does IoT make universities better?" Which two problems would you name in Part A?
?= Too broad — no specific technology, population or setting; and no measurable outcome, because "better" is not defined.
?? Study B reports that frequent responders had fewer logged fatigue events. Can you write that responding to alerts reduces fatigue?
?= No. The study is observational: drivers chose how often to respond and baseline sleep was not controlled, so self-selection or sleep could explain the association.
?? Which of the five data types collected in the 60-driver study are qualitative?
?= None. Alert logs, sleep hours, fatigue-scale scores, driving experience and comfort scores are all numbers; in the evidence table only Study C supplies qualitative data.`,
    ru: `## Формат: 10 баллов, две части
«Practice Quiz 3 — SafeDrive Case» повторяет лекции 1–4 на одном сценарии. Инструкция в начале листа — это и первое правило проверки: **use only the case and the evidence table** — пользоваться только кейсом и таблицей доказательств.
| Часть | Что делать | Баллы |
|---|---|---|
| A | шесть коротких диагнозов кейса, по 0.5 | 3 |
| B1–B4 | выходы проекта, постановка проблемы, вопрос, поисковая строка | 3 |
| B5–B7 | риски с мерами защиты, синтез, пробел | 4 |
- Каждое утверждение должно опираться на строку кейса или на Study A–D. Цифра, запомненная из новостей, или лишняя статья — это **необоснованное утверждение (unsupported claim)**; выдуманный источник — **фабрикация (fabrication)**.
- Исследования называют по буквам: «Study A found…» — доказательство, «research shows…» — нет.
## Кейс коротко
Университетская клиника рассматривает **SafeDrive** — приложение для дальнобойщиков: камера телефона распознаёт сонливость, приложение подаёт сигнал; оно записывает число срабатываний и геолокацию; водители сами сообщают часы сна и усталость. Планируемое исследование: **60 водителей, 6 недель**, группа SafeDrive против группы с **бумажным чек-листом усталости**. Данные: журналы сигналов, самоотчёт о сне, **валидированная шкала усталости (validated fatigue scale)**, стаж вождения, балл уверенности со смартфоном.
В текст заложены четыре «красных флажка» — каждый становится пунктом части A:
- название «AI for Road Safety» и вопрос «Does technology improve road safety?»;
- фраза «The app will definitely reduce accidents»;
- записи литературы, предложенные генеративным ИИ, часть — **без DOI и ни разу не открытые**;
- приложение **по умолчанию непрерывно пишет видео и геолокацию**.
## Перепишите таблицу доказательств в четыре колонки
| Study | Дизайн | Выборка | Результат | Ограничение |
|---|---|---|---|---|
| A | рандомизированное | 150 таксистов 35–55 лет, 8 недель | меньше near-miss по самоотчёту; разница в авариях мала и незначима | исход — самоотчёт; другая популяция |
| B | наблюдательное | 900 пользователей коммерческого приложения | у часто реагирующих меньше записанных эпизодов усталости | водители сами решали, как часто реагировать; исходный сон не контролировался |
| C | качественные интервью | 18 дальнобойщиков | звуковые сигналы ночью ценят; постоянное видео мешает, некоторые заклеивали камеру | маленькая выборка; нет оценки эффекта |
| D | систематический обзор | 15 исследований мониторинга водителей | итоги смешанные; «эпизод усталости» определяют по-разному; короткое наблюдение | мало работ о дальнобойщиках; частый отсев |
> Ни одно исследование не отвечает на вопрос клиники напрямую: у A не та популяция, B не доказывает причину, у C нет чисел, у D смешанные итоги. Отсюда и берётся пробел для B7.
## Часть A — шесть типов пунктов
| Пункт | Ответ на 0.5 | Ловушка |
|---|---|---|
| «Does technology improve road safety?» | слишком широкий (какая технология, какие водители?) и без измеримого исхода | только «это вопрос да/нет» |
| «The app will definitely reduce accidents» | необоснованное утверждение: результат объявлен до данных; Study A не нашло значимой разницы в авариях | назвать это гипотезой |
| прототип SafeDrive | development output (созданный артефакт); research output — доказательства, отвечающие на RQ | назвать приложение research output |
| какое исследование даёт качественные данные? | Study C — интервью, слова и опыт | A или B, потому что часть данных — самоотчёт |
| записи от ИИ без DOI, не открытые | риск сослаться на выдуманные или непроверенные источники; открыть и проверить каждую | «нет DOI — значит, статья фальшивая» |
| видео и геолокация по умолчанию | этический риск и риск защиты данных: идентифицирующие чувствительные данные сверх нужного для RQ | проблема батареи или стоимости |
Один пункт = **термин курса + довод из кейса + исправление**, в одном-двух предложениях:
= Issue: too broad, no measurable outcome. Evidence: "technology" and "road safety" are undefined. Better: compare fatigue-scale scores of SafeDrive and checklist users.
## Самоотчёт — ещё не качественные данные
- Часы сна, балл по шкале усталости, число near-miss — это **числа**, то есть количественные данные, даже если их сообщает сам водитель. Самоотчёт снижает **надёжность (reliability)** — память, желание выглядеть лучше, — но не меняет тип данных.
- Качественные данные — это **слова и смыслы**: расшифровки интервью, открытые ответы, заметки think-aloud. В этой таблице — только Study C.
- Дизайн ограничивает вывод: **рандомизированное (randomised)** исследование (A) сильнее поддерживает причинность; **наблюдательное (observational)** (B) показывает лишь связь — водители сами выбирали, как часто реагировать (**самоотбор, self-selection**), а исходный сон — возможный **конфаундер (confounder)**.
## Проверьте себя
?? Проект в кейсе называется «Smart Campus» и спрашивает «Does IoT make universities better?». Какие две проблемы назвать в части A?
?= Слишком широкий — нет конкретной технологии, популяции и места; и нет измеримого исхода, потому что «лучше» не определено.
?? Study B сообщает, что у часто реагирующих меньше записанных эпизодов усталости. Можно ли написать, что реакция на сигналы снижает усталость?
?= Нет. Исследование наблюдательное: водители сами выбирали, как часто реагировать, и исходный сон не контролировался, поэтому связь может объясняться самоотбором или сном.
?? Какие из пяти типов данных в исследовании 60 водителей — качественные?
?= Никакие. Журналы сигналов, часы сна, баллы по шкале усталости, стаж и балл уверенности — всё числа; в таблице доказательств качественные данные даёт только Study C.`,
  },
  [
    qx("The quiz sheet says: 'Use only the case and the evidence table.' Which sentence follows this instruction best?", "Study A found no significant accident difference, so the claim is unsupported.", [
      ["A news article I read says apps cut truck crashes by half, so the claim holds.", "A source from outside the case breaks the instruction, and the marker cannot check it.", "Источник вне кейса нарушает инструкцию, и проверяющий не может его проверить."],
      ["Most experts agree that drowsiness apps reduce accidents on all highways.", "A vague appeal to 'experts' is not in the case; it is an unsupported claim.", "Расплывчатая ссылка на «экспертов» — не из кейса; это необоснованное утверждение."],
      ["From personal experience, phone alerts keep drivers awake during night shifts.", "Personal experience is opinion, not evidence from the case or the table.", "Личный опыт — мнение, а не доказательство из кейса или таблицы."],
    ], "Only the case text and Studies A–D count as evidence. The correct sentence cites Study A by letter and draws a modest conclusion from it.", "Доказательствами считаются только текст кейса и Study A–D. Верное предложение ссылается на Study A по букве и делает из него осторожный вывод."),
    qx("A case project is titled 'Smart Learning' and asks: 'Is AI good for education?' What should a Part A answer say?", "Too broad: no specific tool, population or measurable outcome", [
      ["Too narrow: it covers only AI and leaves out other technologies", "The problem is the opposite: 'AI' and 'education' are huge domains, not a narrow focus.", "Проблема обратная: «AI» и «education» — огромные области, а не узкий фокус."],
      ["Acceptable: a yes/no question can always be answered by a survey", "Asking people whether AI is 'good' measures opinions, not an effect; 'good' is still undefined.", "Опрос «хорош ли ИИ» измеряет мнения, а не эффект; «хорош» по-прежнему не определено."],
      ["Weak only because the title and the question use different words", "Wording mismatch is minor; the real flaw is scope and the missing outcome.", "Несовпадение слов — мелочь; настоящий изъян — охват и отсутствие исхода."],
    ], "Like 'Does technology improve road safety?', it names no tool, no population and no measurable outcome — the two keywords for full marks are 'too broad' and 'no measurable outcome'.", "Как и «Does technology improve road safety?», вопрос не называет ни инструмента, ни популяции, ни измеримого исхода; ключевые слова на полный балл — «too broad» и «no measurable outcome»."),
    qx("Before any data are collected, a team writes: 'The new triage software will definitely cut waiting times by 40%.' How should Part A classify this?", "An unsupported claim: a result stated as certain before evidence", [
      ["A testable hypothesis, so it belongs in the study's methods section", "A hypothesis is a tentative prediction to be tested; 'definitely' presents the result as already known.", "Гипотеза — осторожное предсказание для проверки; «definitely» подаёт результат как уже известный."],
      ["Falsification, because the 40% figure distorts the real data", "Falsification distorts data that exist; here no data have been collected yet.", "Фальсификация искажает существующие данные; здесь данных ещё нет."],
      ["Plagiarism, because the figure has no citation attached to it", "Plagiarism is taking someone else's words, ideas or data; this is an overclaim of the team's own.", "Плагиат — присвоение чужих слов, идей или данных; здесь команда преувеличивает собственное утверждение."],
    ], "A certain-sounding result with no evidence behind it is an unsupported (overclaimed) statement. The fix is hedged wording: 'may reduce… this study will test whether…'.", "Уверенно заявленный результат без доказательств — необоснованное (преувеличенное) утверждение. Исправление — осторожная формулировка: «may reduce… this study will test whether…»."),
    qx("In the SafeDrive case, which item is a development output?", "The SafeDrive prototype that detects drowsiness and sounds alerts", [
      ["Evidence on whether SafeDrive changes validated fatigue scores", "This is new knowledge that answers the RQ — a research output.", "Это новое знание, отвечающее на RQ, — research output."],
      ["The alert logs and sleep hours collected over the six weeks", "Logs and diaries are data — inputs to the analysis, not outputs.", "Журналы и дневники — это данные, вход анализа, а не выход."],
      ["The comparison of fatigue scores between the app and checklist groups", "The group comparison produces findings, so it belongs to the research output.", "Сравнение групп даёт результаты, поэтому относится к research output."],
    ], "A development output is a built artefact that works (the app, a prototype, a model). The research output is the evidence and findings that answer the research question.", "Development output — созданный работающий артефакт (приложение, прототип, модель). Research output — доказательства и результаты, отвечающие на исследовательский вопрос."),
    qx("A team builds a medication-reminder app and runs a four-week study against a paper calendar. Which is a research output?", "Evidence on whether reminders change adherence versus the calendar", [
      ["The reminder app published in the app store with push notifications", "A working, published app is a development output.", "Работающее опубликованное приложение — development output."],
      ["The database of daily adherence logs from both study groups", "Raw logs are data collected for analysis, not an output of it.", "Сырые журналы — данные для анализа, а не его результат."],
      ["The user-interface design and the notification scheduling code", "Design and code are parts of the built artefact — development.", "Дизайн и код — части созданного артефакта, то есть development."],
    ], "The research output is what the study adds to knowledge: whether reminders change adherence compared with the paper calendar, reported with its evidence.", "Research output — то, что исследование добавляет к знанию: меняют ли напоминания приверженность лечению по сравнению с бумажным календарём, с доказательствами."),
    qx("An evidence table lists four studies of a coding chatbot. Which one provides qualitative data?", "Think-aloud sessions in which 12 students explain how they judged answers", [
      ["A survey in which 400 students rate the chatbot's usefulness on a 1–5 scale", "Ratings on a 1–5 scale are numbers analysed statistically — quantitative.", "Оценки по шкале 1–5 — числа для статистики, то есть количественные данные."],
      ["Log analysis of 3,000 chatbot sessions counting accepted suggestions", "Counts from system logs are quantitative.", "Подсчёты из системных журналов — количественные данные."],
      ["A randomised trial comparing exam scores with and without the chatbot", "Exam scores compared between groups are quantitative evidence.", "Сравнение экзаменационных баллов между группами — количественные данные."],
    ], "Think-aloud sessions record participants' reasoning in their own words — words and meanings, analysed for patterns and themes: qualitative data, like Study C's interviews.", "Think-aloud фиксирует рассуждения участников их же словами — слова и смыслы, которые анализируют на закономерности и темы: качественные данные, как интервью в Study C."),
    qx("SafeDrive drivers write down their sleep hours every morning. What kind of data is this?", "Quantitative data that the drivers report themselves", [
      ["Qualitative data, because the drivers report it themselves", "Who reports a number does not change its type; hours of sleep are still a quantity.", "Кто сообщает число, не меняет его тип; часы сна остаются количеством."],
      ["Secondary data, because it was written down by hand", "Secondary data were collected by someone else for another purpose; this is collected for this study.", "Вторичные данные собраны кем-то другим для другой цели; эти собираются для этого исследования."],
      ["Qualitative data, because no sensor or device measures it", "Lack of a device lowers reliability, not the quantitative nature of hours.", "Отсутствие прибора снижает надёжность, а не количественную природу часов."],
    ], "Sleep hours are numbers, so the data are quantitative; being self-reported affects reliability (memory, social desirability), not the data type.", "Часы сна — числа, значит, данные количественные; самоотчёт влияет на надёжность (память, желание выглядеть лучше), а не на тип данных."),
    qx("The literature folder holds AI-suggested records; some have no DOI and none were opened. What is the main risk?", "Citing sources that may be fabricated or say something else", [
      ["Citing sources that are probably too old for the SafeDrive topic", "Nothing in the case says the records are old; the issue is that nobody verified them.", "В кейсе ничего не сказано о возрасте записей; проблема в том, что их никто не проверил."],
      ["Breaking copyright, because AI tools may not share references", "Listing a reference does not breach copyright; the risk is integrity, not law.", "Указание ссылки не нарушает авторское право; риск — в честности исследования, а не в законе."],
      ["Losing marks for format, because the records lack a DOI field", "A legitimate work may lack a DOI; the problem is that the sources were never checked.", "У настоящей работы может не быть DOI; проблема в том, что источники не проверяли."],
    ], "Generative AI can invent plausible authors, titles and DOIs. Citing unopened records risks fabricated or misrepresented sources — an integrity violation. Each one must be opened and verified.", "Генеративный ИИ может выдумать правдоподобных авторов, названия и DOI. Ссылка на неоткрытые записи грозит выдуманными или искажёнными источниками — нарушением академической честности. Каждую нужно открыть и проверить."),
    qx("One AI-suggested record has no DOI. What should the team do before citing it?", "Search the title in Crossref or the publisher site, then read it", [
      ["Delete it at once, because a missing DOI means it is not peer-reviewed", "A missing DOI is not a missing source; some legitimate works have only a publisher or repository record.", "Нет DOI — ещё не значит, что нет источника; у некоторых настоящих работ есть только запись издателя или репозитория."],
      ["Keep it, because the AI tool has already checked that the record exists", "AI tools can fabricate references; the author stays responsible for every citation.", "ИИ может выдумывать ссылки; за каждую цитату отвечает автор."],
      ["Cite it with a note saying [no DOI] so readers can judge it", "A note does not make an unopened, unverified record acceptable evidence.", "Пометка не превращает неоткрытую, непроверенную запись в допустимое доказательство."],
    ], "The verification ladder: match the record with Crossref or the publisher page, check for corrections, then open the paper and check that it supports the claim. Unresolved sources are not cited as evidence.", "Лестница проверки: сверить запись с Crossref или страницей издателя, проверить исправления, затем открыть статью и убедиться, что она подтверждает утверждение. Неподтверждённые источники не цитируют как доказательство."),
    qx("SafeDrive records video and geolocation continuously by default. Which Part A answer earns the mark?", "It collects identifiable data beyond the RQ's needs: a privacy and data-protection risk", [
      ["It drains the phone battery on long trips, so it is mainly a feasibility risk for the study", "Battery use may matter, but the item asks about the ethical and data-protection problem.", "Расход батареи может быть важен, но пункт спрашивает об этике и защите данных."],
      ["It is acceptable, because more data always make the study results more accurate", "More data do not justify collecting sensitive data the RQ does not need.", "Больше данных не оправдывает сбор чувствительных данных, не нужных для RQ."],
      ["It becomes a risk only if the team later publishes the raw video online", "The risk starts at collection and storage, not only at publication.", "Риск возникает уже при сборе и хранении, а не только при публикации."],
    ], "Continuous video and location identify drivers (and passengers), reveal routes and homes, and are not needed to measure fatigue. Name it as an ethical and data-protection risk and suggest off-by-default collection.", "Непрерывное видео и геолокация идентифицируют водителей (и пассажиров), раскрывают маршруты и дома и не нужны для измерения усталости. Это этический риск и риск защиты данных; исправление — сбор выключен по умолчанию."),
    qx("In Study C, some long-haul drivers covered the camera. Besides privacy, what does this signal for the planned study?", "Video monitoring may lower adherence, so detection data could be missing", [
      ["Drivers dislike all alerts, so the audio alerts should be removed as well", "Study C reports that drivers valued audio alerts at night.", "Study C сообщает, что звуковые сигналы ночью водители ценили."],
      ["The interviews prove that SafeDrive cannot reduce fatigue at all", "Study C is qualitative with no effect estimate; it cannot prove an effect or its absence.", "Study C качественное и без оценки эффекта; оно не может доказать ни эффект, ни его отсутствие."],
      ["Covering a camera is misconduct that the study must report", "Research misconduct concerns researchers (FFP), not participants protecting their privacy.", "Научная недобросовестность касается исследователей (FFP), а не участников, защищающих свою приватность."],
    ], "If drivers block the camera, the app cannot detect drowsiness, so data go missing and the comparison weakens. Intrusive design is an ethical problem and a data-quality problem at once.", "Если водители закрывают камеру, приложение не может распознать сонливость — данные пропадают, сравнение слабеет. Навязчивый дизайн — одновременно этическая проблема и проблема качества данных."),
    qx("Study A (randomised, 150 taxi drivers) found fewer self-reported near-misses but no significant accident difference. Which conclusion is justified?", "Alerts may reduce reported near-misses in taxi drivers; the accident effect is unclear", [
      ["SafeDrive will cut accidents among long-haul drivers, since the trial was properly randomised", "Randomisation does not change the population (taxi drivers) or the non-significant accident result.", "Рандомизация не меняет популяцию (таксисты) и незначимый результат по авариям."],
      ["Alerts have no effect at all, because the accident result was not significant", "Not significant is not 'no effect', and near-misses did decrease.", "«Незначимо» — не то же, что «эффекта нет», а near-miss всё же снизились."],
      ["The near-miss result proves fewer accidents, since near-misses come before crashes", "Near-misses were self-reported, and the accident data themselves showed no clear difference.", "Near-miss сообщались самими водителями, а данные об авариях явной разницы не показали."],
    ], "Stay within the evidence: the outcome that improved was self-reported, the population was taxi drivers aged 35–55, and the accident difference was small and not significant.", "Вывод не выходит за доказательства: улучшился исход по самоотчёту, популяция — таксисты 35–55 лет, а разница в авариях мала и незначима."),
    qx("Study B: among 900 app users, frequent responders had fewer logged fatigue events. Why can this not show that responding reduces fatigue?", "Drivers chose how often to respond, and baseline sleep was not controlled", [
      ["900 users is too small a sample to show any pattern at all", "900 is a large sample; the weakness is the design, not the size.", "900 — большая выборка; слабость в дизайне, а не в размере."],
      ["Logged fatigue events are qualitative, so they cannot be counted", "Logged events are counts — quantitative data.", "Записанные эпизоды — подсчёты, то есть количественные данные."],
      ["Commercial apps are Tier 3 sources, so they cannot serve as research evidence", "Study B is a study in the evidence table, not a blog; its problem is self-selection.", "Study B — исследование из таблицы доказательств, а не блог; его проблема — самоотбор."],
    ], "In an observational design, rested or motivated drivers may both respond more often and have fewer fatigue events. Self-selection and uncontrolled sleep make this an association, not a cause.", "В наблюдательном дизайне выспавшиеся или мотивированные водители могут и чаще реагировать, и реже уставать. Самоотбор и неконтролируемый сон делают это связью, а не причиной."),
    qx("Study D, a systematic review of 15 studies, reports mixed results. Which reason in the table helps explain the mix?", "Studies defined 'fatigue event' differently and used different outcomes", [
      ["Systematic reviews always find mixed results, because they pool many studies", "Reviews often reach clear conclusions; mixing here has specific causes in the table.", "Обзоры часто приходят к ясным выводам; смешанность здесь имеет конкретные причины из таблицы."],
      ["The review included only taxi drivers, who differ from long-haul ones", "That describes Study A; Study D says long-haul studies were few, not that all were taxi drivers.", "Это про Study A; Study D говорит, что работ о дальнобойщиках мало, а не что все — о таксистах."],
      ["Reviews are primary sources, so they repeat one study's own bias", "A review is a secondary source that synthesises primary studies.", "Обзор — вторичный источник, обобщающий первичные исследования."],
    ], "When studies define and measure the outcome differently and follow drivers only briefly, their results cannot line up — an evaluation/measurement problem that also signals a gap.", "Когда исследования по-разному определяют и измеряют исход и коротко наблюдают водителей, результаты не сходятся — проблема оценки и измерения, которая заодно указывает на пробел."),
    qx("In the planned 60-driver study, what is the independent variable?", "Group: the SafeDrive app or the paper fatigue checklist", [
      ["Each driver's score on the validated fatigue scale after six weeks", "This is what is measured as the result — the dependent variable.", "Это то, что измеряют как результат, — зависимая переменная."],
      ["The number of drowsiness alerts that the app logs each night", "Alerts exist only in the app group, so they cannot define the comparison.", "Сигналы есть только в группе приложения, поэтому они не задают сравнение."],
      ["The self-reported sleep hours of each driver during the study", "Sleep is an additional factor to describe or control, not what the study changes.", "Сон — дополнительный фактор для описания или контроля, а не то, что исследование меняет."],
    ], "The independent variable is what the researcher changes or groups by: app vs paper checklist. The dependent variable is the measured outcome, the fatigue-scale score.", "Независимая переменная — то, что исследователь меняет или по чему делит группы: приложение или бумажный чек-лист. Зависимая — измеряемый исход, балл по шкале усталости."),
    qx("Drivers in the SafeDrive group turn out to be far more comfortable with smartphones. Why does this matter?", "Comfort may affect both app use and outcomes, so the groups must be compared on it", [
      ["It does not matter, because comfort is not the dependent variable of this study at all", "Factors that are not the outcome can still bias the comparison between groups.", "Фактор, не являющийся исходом, всё равно может исказить сравнение групп."],
      ["It means the checklist group must also be given new smartphones to use", "Handing out phones changes the intervention; the issue is checking and controlling for comfort.", "Раздача телефонов меняет вмешательство; задача — проверить и учесть уверенность."],
      ["It turns the study into a qualitative study of attitudes to technology", "A comfort score is a number; the study stays quantitative.", "Балл уверенности — число; исследование остаётся количественным."],
    ], "An unequal additional factor can act as a confounder: lower fatigue might reflect tech-savvy drivers rather than the app. That is why the case collects a smartphone-comfort score.", "Неравный дополнительный фактор может стать конфаундером: меньшая усталость может объясняться уверенными пользователями, а не приложением. Поэтому кейс и собирает балл уверенности со смартфоном."),
    qx("Why is 'AI for Road Safety' a weak title for the clinic's project?", "It promises far more than a six-week fatigue study of 60 drivers can show", [
      ["It is too narrow, because road safety covers only one kind of vehicle", "Road safety is a huge field; the title is too broad, not too narrow.", "Безопасность дорог — огромная область; название слишком широкое, а не узкое."],
      ["It names AI, and research titles must never mention a technology", "Titles may name a technology; the problem is scope and hype.", "Название может упоминать технологию; проблема — в охвате и хайпе."],
      ["It is fine, since a broad title attracts more participants to the clinic study", "Recruitment is not the purpose of a title; it should describe the actual study.", "Название служит не набору участников; оно должно описывать реальное исследование."],
    ], "A research title names what is actually studied — app, population, outcome. 'AI for Road Safety' is hype: the study measures fatigue in 60 drivers, not road safety in general.", "Название исследования называет то, что реально изучается: приложение, популяцию, исход. «AI for Road Safety» — хайп: изучается усталость 60 водителей, а не безопасность дорог вообще."),
    qx("Which answer to 'What is wrong with Does technology improve road safety?' earns the full 0.5?", "Too broad, with no measurable outcome such as fatigue-scale scores", [
      ["It is a yes/no question, and research questions may never be closed", "Many good RQs start with 'does'; the yes/no form alone is not the main flaw.", "Многие хорошие RQ начинаются с «does»; форма да/нет сама по себе — не главный изъян."],
      ["It should be rewritten as a hypothesis that technology improves safety", "Turning it into a hypothesis keeps the same undefined scope and outcome.", "Превращение в гипотезу оставляет тот же неопределённый охват и исход."],
      ["It is a good question, but it should mention artificial intelligence", "Adding 'AI' makes it more hyped, not more focused or measurable.", "Добавление «AI» делает вопрос более хайповым, но не более точным и измеримым."],
    ], "The marker looks for the two diagnoses — too broad and no measurable outcome — plus a hint of the fix: a defined population, comparison and outcome.", "Проверяющий ищет два диагноза — слишком широкий и без измеримого исхода — и намёк на исправление: определённые популяцию, сравнение и исход."),
    tfx("Because Study B has 900 participants, it gives stronger evidence that alerts cause fewer fatigue events than Study A's randomised design.", false, "A large sample does not remove self-selection or confounding. Randomisation does, so Study A is stronger for causal claims — though it measured near-misses in taxi drivers.", "Большая выборка не устраняет самоотбор и конфаундеры. Это делает рандомизация, поэтому Study A сильнее для причинных выводов — хотя оно измеряло near-miss у таксистов.", "Choosing True confuses sample size with design: 900 self-selected users can give a precise estimate of a biased association.", "Ответ True путает размер выборки с дизайном: 900 самоотобранных пользователей дадут точную оценку искажённой связи."),
    tfx("Under the instruction 'use only the case and the evidence table', adding a statistic from a news article weakens a Part B answer.", true, "The instruction limits evidence to the case and Studies A–D. An outside statistic cannot be checked and counts as an unsupported claim.", "Инструкция ограничивает доказательства кейсом и Study A–D. Внешнюю статистику нельзя проверить, и она считается необоснованным утверждением.", "Choosing False assumes extra facts earn credit; here they break the rule the whole quiz is marked by.", "Ответ False предполагает, что лишние факты приносят баллы; здесь они нарушают правило, по которому проверяется весь квиз."),
  ],
);

const p2 = part(
  "rm-px-p2",
  { en: "Outputs, problem statement and research question (B1–B3)", ru: "Выходы проекта, постановка проблемы и вопрос (B1–B3)" },
  {
    en: `## Part B tasks 1–3: 2.5 points
| Task | Points | What the marker looks for |
|---|---|---|
| B1 | 0.5 | one development output and one research output, correctly labelled |
| B2 | 1 | current situation + literature-supported limitation + need |
| B3 | 1 | one clear, focused, researchable, feasible RQ with population, factor or comparison, outcome |
## B1. Development output vs research output
| | Development output | Research output |
|---|---|---|
| What it is | a built artefact: app, prototype, model, dashboard | new knowledge backed by evidence: findings, an answer to the RQ, a report or paper |
| Question it answers | does it work as specified? | what did we learn, and how sure are we? |
| Judged by | testing against requirements | method, data and analysis |
| SafeDrive | the app prototype with camera detection and alerts | evidence on whether SafeDrive changes fatigue scores compared with a paper checklist |
- **Data are neither.** Alert logs and sleep diaries are inputs to the analysis, not outputs.
- A working app proves nothing about fatigue: "the prototype runs" is a development result; "fatigue scores were lower in the app group" is a research result.
Model answer (0.5):
= Development output: the SafeDrive prototype, a phone app that detects drowsiness through the camera and sounds an alert.
= Research output: evidence, presented in a study report, on whether six weeks of SafeDrive use changes validated fatigue scores compared with a paper checklist.
## B2. A three-part problem statement
Practical Task 2 asks a problem to say what is happening, what is not known, who is affected and why it matters. The quiz packs this into three labelled parts:
@diagram rmx-rq-builder
= Current situation: [who] [does what] [where], and [what is being considered].
= Limitation: However, [Study X] found [limit], and [Study Y] reports [limit].
= Need: Therefore, evidence is needed on whether [factor] changes [outcome] for [population].
Model answer (1 point):
= Current situation: Long-haul truck drivers often work long night shifts, and a university clinic is considering SafeDrive, a phone app that detects drowsiness and sounds an alert.
= Limitation: However, Study A found fewer self-reported near-misses but no significant difference in actual accidents among taxi drivers, and Study D reports few studies on long-haul drivers and inconsistent definitions of a fatigue event.
= Need: Therefore, controlled evidence is needed on whether SafeDrive reduces fatigue among long-haul drivers compared with a simple paper checklist.
Where points are lost:
- **Problem = missing solution:** "the problem is that drivers do not have SafeDrive" assumes the answer.
- **Limitation without a source:** "apps are not tested enough" — which study says so?
- **Absolute claims:** "no research exists" — Studies A–D exist.
- **A need that is a promise:** "SafeDrive will save lives" is an unsupported claim, not a need.
## B3. One research question that passes every test
A good RQ is **clear, focused, researchable, feasible** and **connected** to the problem. Practical Task 2 names its elements: **population**, **factor or comparison**, **outcome**, **context**.
= Among long-haul truck drivers, does using SafeDrive for six weeks, compared with a paper fatigue checklist, lower scores on a validated fatigue scale?
- Population: long-haul truck drivers. Comparison: SafeDrive vs paper checklist. Outcome: validated fatigue-scale score. Context: six weeks, clinic study.
- **Why not accidents?** Accidents are rare: 60 drivers in six weeks cannot show a difference, and accident data are not collected.
- **Why not alert counts?** Only the SafeDrive group produces alert logs, so there is nothing to compare in the checklist group.
- Sleep hours, driving experience and smartphone comfort are **additional factors** to describe the groups or control for, not the outcome.
| Weak RQ | What is wrong | Fix |
|---|---|---|
| Does SafeDrive work? | "work" undefined; no comparison, no population | name the outcome and the comparison |
| How many alerts do drivers get per night? | descriptive, app group only, misses the problem | compare fatigue between groups |
| Does SafeDrive reduce accidents nationwide? | not feasible; the outcome is not measured | fatigue in 60 drivers over six weeks |
| What is driver drowsiness? | answered by a definition | ask about an effect or an experience |
| Does it lower fatigue and improve sleep, and do drivers like it? | three questions in one | keep one; move the others to sub-questions |
> One question, one population, one comparison, one measurable outcome — and the data to answer it are already listed in the case.
## The same moves on other cases
- **AI tutor in an LMS.** Development: the tutor plug-in. Research: evidence on whether it changes quiz scores. RQ: "Among first-year programming students, does four weeks of AI-tutor use, compared with forum support only, change weekly quiz scores?"
- **Code-review bot.** Development: the bot. Research: defect counts with and without it. RQ: "In student team projects, does a code-review bot, compared with peer review alone, change the number of defects found before release?"
## Check yourself
?? A student writes: "Development output — the alert logs; research output — the SafeDrive app." Correct it.
?= Logs are data, not an output. The app is the development output; the research output is evidence on whether SafeDrive changes fatigue scores compared with the checklist.
?? Why is "Does SafeDrive reduce accidents among long-haul drivers?" not feasible in this case?
?= Accidents are too rare to compare in 60 drivers over six weeks, and accident data are not collected; the validated fatigue scale is the measurable outcome.`,
    ru: `## Задания B1–B3: 2.5 балла
| Задание | Баллы | Что ищет проверяющий |
|---|---|---|
| B1 | 0.5 | один development output и один research output, верно подписанные |
| B2 | 1 | текущая ситуация + ограничение с опорой на литературу + потребность |
| B3 | 1 | один ясный, сфокусированный, исследуемый, выполнимый RQ: популяция, фактор или сравнение, исход |
## B1. Development output и research output
| | Development output | Research output |
|---|---|---|
| Что это | созданный артефакт: приложение, прототип, модель, дашборд | новое знание с доказательствами: результаты, ответ на RQ, отчёт или статья |
| На какой вопрос отвечает | работает ли так, как задумано? | что мы узнали и насколько в этом уверены? |
| Чем оценивается | тестированием по требованиям | методом, данными и анализом |
| SafeDrive | прототип приложения с распознаванием по камере и сигналами | доказательства того, меняет ли SafeDrive баллы усталости по сравнению с бумажным чек-листом |
- **Данные — ни то ни другое.** Журналы сигналов и дневники сна — вход анализа, а не его выход.
- Работающее приложение ничего не доказывает об усталости: «прототип запускается» — результат разработки; «в группе приложения баллы усталости ниже» — результат исследования.
Образцовый ответ (0.5):
= Development output: the SafeDrive prototype, a phone app that detects drowsiness through the camera and sounds an alert.
= Research output: evidence, presented in a study report, on whether six weeks of SafeDrive use changes validated fatigue scores compared with a paper checklist.
## B2. Постановка проблемы из трёх частей
Practical Task 2 требует, чтобы проблема говорила, что происходит, что неизвестно, кого это касается и почему это важно. Квиз упаковывает это в три подписанные части:
@diagram rmx-rq-builder
= Current situation: [who] [does what] [where], and [what is being considered].
= Limitation: However, [Study X] found [limit], and [Study Y] reports [limit].
= Need: Therefore, evidence is needed on whether [factor] changes [outcome] for [population].
Образцовый ответ (1 балл):
= Current situation: Long-haul truck drivers often work long night shifts, and a university clinic is considering SafeDrive, a phone app that detects drowsiness and sounds an alert.
= Limitation: However, Study A found fewer self-reported near-misses but no significant difference in actual accidents among taxi drivers, and Study D reports few studies on long-haul drivers and inconsistent definitions of a fatigue event.
= Need: Therefore, controlled evidence is needed on whether SafeDrive reduces fatigue among long-haul drivers compared with a simple paper checklist.
Где теряют баллы:
- **Проблема = отсутствие решения:** «проблема в том, что у водителей нет SafeDrive» заранее предполагает ответ.
- **Ограничение без источника:** «приложения мало тестируют» — какое исследование это говорит?
- **Абсолютные утверждения:** «исследований нет» — а Study A–D существуют.
- **Потребность-обещание:** «SafeDrive спасёт жизни» — необоснованное утверждение, а не потребность.
## B3. Один вопрос, который проходит все проверки
Хороший RQ — **ясный, сфокусированный, исследуемый, выполнимый (clear, focused, researchable, feasible)** и **связанный (connected)** с проблемой. Practical Task 2 называет его элементы: **популяция (population)**, **фактор или сравнение (factor / comparison)**, **исход (outcome)**, **контекст (context)**.
= Among long-haul truck drivers, does using SafeDrive for six weeks, compared with a paper fatigue checklist, lower scores on a validated fatigue scale?
- Популяция: дальнобойщики. Сравнение: SafeDrive против бумажного чек-листа. Исход: балл по валидированной шкале усталости. Контекст: шесть недель, исследование клиники.
- **Почему не аварии?** Аварии редки: у 60 водителей за шесть недель разницу не увидеть, и данные об авариях не собираются.
- **Почему не число сигналов?** Журналы сигналов есть только у группы SafeDrive, в группе чек-листа сравнивать не с чем.
- Часы сна, стаж и уверенность со смартфоном — **дополнительные факторы (additional factors)**: ими описывают группы или их учитывают, но это не исход.
| Слабый RQ | Что не так | Исправление |
|---|---|---|
| Does SafeDrive work? | «work» не определено; нет сравнения и популяции | назвать исход и сравнение |
| How many alerts do drivers get per night? | описательный, только группа приложения, мимо проблемы | сравнить усталость между группами |
| Does SafeDrive reduce accidents nationwide? | невыполним; исход не измеряется | усталость 60 водителей за шесть недель |
| What is driver drowsiness? | отвечается определением | спросить об эффекте или опыте |
| Does it lower fatigue and improve sleep, and do drivers like it? | три вопроса в одном | оставить один, остальные — в подвопросы |
> Один вопрос, одна популяция, одно сравнение, один измеримый исход — и данные для ответа уже перечислены в кейсе.
## Те же ходы на других кейсах
- **ИИ-репетитор в LMS.** Development: плагин-репетитор. Research: доказательства того, меняет ли он баллы квизов. RQ: «Among first-year programming students, does four weeks of AI-tutor use, compared with forum support only, change weekly quiz scores?»
- **Бот для код-ревью.** Development: сам бот. Research: число дефектов с ботом и без него. RQ: «In student team projects, does a code-review bot, compared with peer review alone, change the number of defects found before release?»
## Проверьте себя
?? Студент пишет: «Development output — the alert logs; research output — the SafeDrive app». Исправьте.
?= Журналы — это данные, а не выход. Приложение — development output; research output — доказательства того, меняет ли SafeDrive баллы усталости по сравнению с чек-листом.
?? Почему вопрос «Does SafeDrive reduce accidents among long-haul drivers?» невыполним в этом кейсе?
?= Аварии слишком редки, чтобы сравнить их у 60 водителей за шесть недель, и данные об авариях не собираются; измеримый исход — валидированная шкала усталости.`,
  },
  [
    qx("A team builds an AI-tutor plug-in for the university LMS and compares quiz scores of users and non-users. Which is the development output?", "The working AI-tutor plug-in, integrated into the university LMS", [
      ["Evidence on whether tutor use changes weekly quiz scores", "Knowledge about the tutor's effect is the research output.", "Знание об эффекте репетитора — это research output."],
      ["The weekly quiz scores collected from both groups of first-year students", "Quiz scores are data — the input to the analysis.", "Баллы квизов — данные, то есть вход анализа."],
      ["A report comparing the quiz results of users and non-users", "A report of findings is a research output.", "Отчёт с результатами — это research output."],
    ], "The development output is the artefact that was built and works — here the plug-in. Data and findings belong to the research side.", "Development output — созданный и работающий артефакт, здесь плагин. Данные и результаты относятся к исследовательской стороне."),
    qx("A team builds a code-review bot for student projects and counts defects with and without it. Which is the research output?", "Evidence on whether the bot changes the defects found before release", [
      ["The bot's source code together with its integration into GitHub", "Code and integration are parts of the built artefact — development output.", "Код и интеграция — части созданного артефакта, то есть development output."],
      ["The full list of comments that the bot posted on every pull request", "Bot comments are raw data produced during the study.", "Комментарии бота — сырые данные, полученные во время исследования."],
      ["A deployed bot that automatically reviews every new pull request in CI", "A running, deployed tool is a development output however useful it is.", "Работающий развёрнутый инструмент — development output, насколько бы полезным он ни был."],
    ], "The research output is new, evidence-based knowledge that answers the RQ: does the bot change the number of defects compared with peer review alone?", "Research output — новое знание с доказательствами, отвечающее на RQ: меняет ли бот число дефектов по сравнению с одним только peer review?"),
    qx("A student answers B1: 'Development output: the alert logs. Research output: the SafeDrive app.' What is wrong?", "Logs are only data, and the app is the development output", [
      ["The labels are right; only their order is wrong", "The labels themselves are wrong, not just their order.", "Неверны сами подписи, а не только их порядок."],
      ["Both are research outputs, as both were produced during the study", "Being produced during a study does not make something knowledge; logs are data, the app is an artefact.", "То, что что-то возникло во время исследования, не делает это знанием; журналы — данные, приложение — артефакт."],
      ["Both are development outputs, because the research output is the RQ", "The RQ is the starting question, not an output; the output is the evidence that answers it.", "RQ — исходный вопрос, а не выход; выход — доказательства, которые на него отвечают."],
    ], "Alert logs are inputs to the analysis. The app is the development output; the research output is evidence on whether SafeDrive changes fatigue compared with the checklist.", "Журналы сигналов — вход анализа. Приложение — development output; research output — доказательства того, меняет ли SafeDrive усталость по сравнению с чек-листом."),
    qx("Which sentence works as the literature-supported limitation in a SafeDrive problem statement?", "However, Study D reports few long-haul studies and inconsistent fatigue definitions.", [
      ["However, drowsiness apps have never been tested on real drivers anywhere in the world.", "Studies A and B tested alerts on real drivers; the claim is false and unsupported.", "Study A и B проверяли сигналы на реальных водителях; утверждение ложное и необоснованное."],
      ["However, many drivers feel tired, so an app is clearly the right solution for them.", "This assumes the solution and cites no study from the table.", "Здесь заранее предполагается решение и нет ссылки ни на одно исследование из таблицы."],
      ["However, the project team believes that SafeDrive is better than paper checklists.", "A team's belief is opinion, not a limitation found in the literature.", "Мнение команды — это не ограничение, найденное в литературе."],
    ], "The limitation part must name what existing evidence cannot yet tell us and point to the source — here Study D's own limitations.", "Часть «ограничение» должна назвать, чего существующие доказательства пока не показывают, и указать источник — здесь ограничения самого Study D."),
    qx("Which opening of a problem statement confuses the problem with the solution?", "The problem is that long-haul drivers do not yet use SafeDrive.", [
      ["Long-haul drivers often work long night shifts with little sleep.", "This describes the current situation — a valid first part.", "Это описание текущей ситуации — нормальная первая часть."],
      ["Evidence on alert apps for long-haul drivers is limited (Study D).", "This is a literature-supported limitation — a valid second part.", "Это ограничение с опорой на литературу — нормальная вторая часть."],
      ["It is unclear whether alerts lower long-haul drivers' fatigue.", "This states what is unknown — the basis of the need.", "Это формулировка неизвестного — основа потребности."],
    ], "Defining the problem as 'they lack our app' assumes the app is the answer before any evidence. A research problem describes a situation and an unknown, not a missing product.", "Определить проблему как «у них нет нашего приложения» — значит считать приложение ответом до всяких доказательств. Исследовательская проблема описывает ситуацию и неизвестное, а не отсутствующий продукт."),
    qx("Which 'need' sentence best completes a SafeDrive problem statement?", "Therefore, evidence is needed on whether SafeDrive lowers fatigue versus a paper checklist.", [
      ["Therefore, SafeDrive must be installed for all drivers in the country as soon as possible.", "This is a policy demand, not a statement of missing evidence.", "Это требование к политике, а не формулировка недостающих доказательств."],
      ["Therefore, this study will prove that SafeDrive definitely saves the lives of drivers.", "'Prove' and 'definitely' overclaim; a need names what must be found out.", "«Prove» и «definitely» — преувеличение; потребность называет то, что нужно выяснить."],
      ["Therefore, more research is needed on technology and road safety in general terms.", "Too vague: it does not say which evidence, for whom or on which outcome.", "Слишком расплывчато: не сказано, какие доказательства, для кого и по какому исходу."],
    ], "A good need is specific and modest: what evidence (controlled comparison), on which factor (SafeDrive vs checklist), for which outcome (fatigue) and population.", "Хорошая потребность конкретна и скромна: какие доказательства (контролируемое сравнение), по какому фактору (SafeDrive против чек-листа), для какого исхода (усталость) и популяции."),
    qx("A problem statement ends: 'No research has ever studied driver-fatigue apps.' Why does this lose marks?", "Studies A, B and D in the table show that such research exists", [
      ["It is too short; a limitation must be at least two sentences long", "Length is not the issue; the sentence is contradicted by the evidence.", "Дело не в длине; предложение опровергается доказательствами."],
      ["It should give a DOI to prove that nothing has been published", "A DOI identifies a work; it cannot prove that no work exists.", "DOI идентифицирует работу; он не может доказать, что работ нет."],
      ["It is acceptable, but it belongs in the RQ, not in the problem", "A false absolute claim is not acceptable anywhere in the answer.", "Ложное абсолютное утверждение недопустимо нигде в ответе."],
    ], "The evidence table itself lists studies on alerts and driver monitoring. A limitation should say what remains limited or unclear, not that nothing exists.", "Сама таблица доказательств перечисляет исследования сигналов и мониторинга водителей. Ограничение должно говорить, что остаётся ограниченным или неясным, а не что ничего нет."),
    qx("Which research question is best for the SafeDrive study?", "Among long-haul drivers, does six weeks of SafeDrive, versus a paper checklist, lower validated fatigue scores?", [
      ["Among long-haul drivers, does six weeks of SafeDrive, versus a paper checklist, reduce their road accident rate?", "Accidents are too rare for 60 drivers in six weeks and are not collected — not feasible.", "Аварии слишком редки для 60 водителей за шесть недель и не собираются — невыполнимо."],
      ["Among long-haul drivers using SafeDrive for six weeks, how many drowsiness alerts are logged per night?", "Descriptive and app-only: it has no comparison and does not address fatigue.", "Описательный и только про приложение: нет сравнения, и он не касается усталости."],
      ["Do long-haul and taxi drivers prefer SafeDrive's audio and video alerts to a paper checklist?", "It mixes two populations and asks about preference, not the study's outcome.", "Смешивает две популяции и спрашивает о предпочтениях, а не об исходе исследования."],
    ], "It names the population, the comparison and a measurable outcome that is collected in both groups, and it fits the six-week, 60-driver design.", "Он называет популяцию, сравнение и измеримый исход, который собирается в обеих группах, и укладывается в дизайн «шесть недель, 60 водителей»."),
    qx("Why are alert counts a poor outcome for comparing the two SafeDrive groups?", "Only the app group produces alert logs, so the checklist group has none", [
      ["Alert counts are qualitative data, so they cannot be compared statistically", "Counts are numbers — quantitative; the problem is that one group has none.", "Подсчёты — числа, то есть количественные данные; проблема в том, что у одной группы их нет."],
      ["Alert logs are secondary data and cannot be used in a primary study", "The logs are collected for this study, so they are primary data.", "Журналы собираются для этого исследования, значит, это первичные данные."],
      ["Alerts happen so often that the numbers would be too large to analyse", "Large counts are easy to analyse; size is not the issue.", "Большие числа легко анализировать; дело не в размере."],
    ], "An outcome for a two-group comparison must be measured the same way in both groups. The paper-checklist group never generates alerts, so the validated fatigue scale is the right shared outcome.", "Исход для сравнения двух групп должен измеряться одинаково в обеих. Группа с бумажным чек-листом сигналов не даёт, поэтому общий исход — валидированная шкала усталости."),
    qx("Why is the actual accident rate a poor outcome for the planned study?", "Accidents are too rare to compare in 60 drivers over six weeks", [
      ["Accident data are qualitative, so they cannot answer a quantitative RQ", "Accident counts are quantitative; the issue is rarity and missing data.", "Число аварий — количественные данные; проблема в редкости и отсутствии данных."],
      ["Study A already proved that alerts reduce accidents, so it is not new", "Study A found the accident difference small and not significant.", "Study A нашло разницу в авариях малой и незначимой."],
      ["Accidents are the independent variable, not an outcome of the study", "Accidents would be an outcome; the independent variable is the group.", "Аварии были бы исходом; независимая переменная — группа."],
    ], "With 60 drivers and six weeks there would be almost no accidents to compare, and the case does not collect accident data — a feasibility failure.", "При 60 водителях и шести неделях аварий для сравнения почти не будет, а кейс не собирает данные об авариях — провал по выполнимости."),
    qx("RQ: 'Among second-year SE students, does pair programming, compared with solo work, reduce failed unit tests in lab tasks?' What is the outcome?", "The number of failed unit tests in lab tasks", [
      ["Second-year Software Engineering students", "This is the population — who is studied.", "Это популяция — кого изучают."],
      ["Pair programming compared with solo work", "This is the factor or comparison — what is varied.", "Это фактор или сравнение — то, что меняют."],
      ["The lab tasks of the second-year Software Engineering course", "This is the context — where the study takes place.", "Это контекст — где проходит исследование."],
    ], "The outcome is what is measured to answer the question: failed unit tests. Practical Task 2 asks for population, factor, outcome and context.", "Исход — то, что измеряют, чтобы ответить на вопрос: число проваленных unit-тестов. Practical Task 2 требует назвать популяцию, фактор, исход и контекст."),
    qx("Practical Task 2 warns against one kind of question. Which candidate RQ falls into that trap?", "What is driver drowsiness detection?", [
      ["How do long-haul drivers describe camera-based alerts?", "A valid qualitative RQ about experience.", "Нормальный качественный RQ об опыте."],
      ["Does SafeDrive change fatigue scores versus a checklist?", "A valid comparative RQ with a measurable outcome.", "Нормальный сравнительный RQ с измеримым исходом."],
      ["Is driving experience associated with alert frequency?", "A valid relational RQ, although it describes the app group only.", "Нормальный RQ о связи, хотя он описывает только группу приложения."],
    ], "A question that can be answered with a definition ('What is…?') is not researchable: no evidence needs to be collected to answer it.", "Вопрос, на который можно ответить определением («What is…?»), не является исследуемым: для ответа не нужно собирать доказательства."),
    qx("Which item is a research question rather than a broad topic?", "Which factors influence developers' adoption of testing tools?", [
      ["Adoption of automated testing tools by developers in DevOps teams", "A noun phrase naming an area — a topic, not a question.", "Именная фраза, называющая область, — тема, а не вопрос."],
      ["Cybersecurity of mobile banking applications in Central Asia", "Narrower than 'cybersecurity', but still a topic with no question asked.", "Уже, чем «cybersecurity», но всё ещё тема без вопроса."],
      ["Software quality and code review practices in agile student teams", "Still a topic: it names areas but asks nothing that evidence could answer.", "Всё ещё тема: называет области, но не задаёт вопроса, на который ответят доказательства."],
    ], "A research question asks something that evidence can answer — here, which factors influence adoption. A topic only names an area, however narrowed.", "Исследовательский вопрос спрашивает о том, на что ответят доказательства, — здесь какие факторы влияют на внедрение. Тема лишь называет область, как бы её ни сузили."),
    qx("A team's RQ needs ten years of national police crash records, which are not public. Which feasibility filter does it fail first?", "Data accessibility", [
      ["Infrastructure requirements", "Computing power is not the obstacle; obtaining the records is.", "Препятствие — не вычислительные мощности, а получение записей."],
      ["Time constraints", "Time matters, but even unlimited time would not grant access to closed records.", "Время важно, но даже безграничное время не даст доступа к закрытым записям."],
      ["Statistical analysis skills", "Skills cannot help if the data cannot be obtained at all.", "Навыки не помогут, если данные вообще нельзя получить."],
    ], "Lecture 1's feasibility matrix starts with data accessibility: does the team have the right to access the data it needs? Without it the study cannot start.", "Матрица выполнимости из лекции 1 начинается с доступа к данным: есть ли у команды право получить нужные данные? Без этого исследование не начнётся."),
    qx("The clinic wants to understand why some drivers cover the camera. Which RQ fits that aim?", "How do long-haul drivers describe their experience of camera-based alerts?", [
      ["How many drivers cover the camera during the six-week study period?", "A count shows how often, not why drivers do it.", "Подсчёт показывает, как часто, а не почему водители так делают."],
      ["Does covering the camera lower fatigue scores compared with not covering it?", "This tests an effect on fatigue, not the reasons for covering.", "Это проверка влияния на усталость, а не причин."],
      ["Is smartphone comfort correlated with the number of alerts each driver logs?", "A correlation between two numbers does not reveal drivers' reasons.", "Корреляция двух чисел не раскрывает причин водителей."],
    ], "'Why' and 'how do people experience' questions need descriptions in participants' own words — a qualitative RQ answered through interviews, as in Study C.", "Вопросы «почему» и «как люди это переживают» требуют описаний словами участников — качественный RQ, на который отвечают интервью, как в Study C."),
    qx("Which statement is an acceptable hypothesis for the SafeDrive study?", "H1: Mean fatigue scores will differ between the app and checklist groups.", [
      ["Results: SafeDrive cut fatigue by 30%, to be confirmed by the data later.", "Writing a result before data exist is fabrication, not a hypothesis.", "Записать результат до появления данных — фабрикация, а не гипотеза."],
      ["SafeDrive definitely works, and the study will simply confirm it.", "A hypothesis is tested, not assumed; 'definitely' overclaims.", "Гипотезу проверяют, а не принимают заранее; «definitely» — преувеличение."],
      ["H1: Drivers will describe their feelings about the alerts in interviews.", "This is not a testable relationship or difference; exploratory qualitative work needs no hypothesis.", "Это не проверяемая связь или разница; поисковому качественному исследованию гипотеза не нужна."],
    ], "A hypothesis is a testable expectation about a difference or relationship, stated before the data and checked by them.", "Гипотеза — проверяемое ожидание о разнице или связи, сформулированное до данных и проверяемое ими."),
    tfx("In B3, the research question should name a population, a factor or comparison, and an outcome.", true, "These three elements (plus context) make the RQ focused and researchable, and they are what the B3 criterion lists.", "Эти три элемента (плюс контекст) делают RQ сфокусированным и исследуемым — именно их перечисляет критерий B3.", "Choosing False ignores the task wording: 'population, factor/comparison, outcome' is the marking criterion itself.", "Ответ False игнорирует формулировку задания: «популяция, фактор или сравнение, исход» — это и есть критерий оценки."),
    tfx("Joining two related questions with 'and' earns more in B3 because it covers more ground.", false, "B3 asks for one clear, focused question. A double question loses focus and makes the answer harder to design and mark.", "B3 требует один ясный, сфокусированный вопрос. Двойной вопрос теряет фокус, и его труднее и спланировать, и оценить.", "Choosing True treats coverage as a virtue; the criterion rewards focus, not breadth.", "Ответ True считает охват достоинством; критерий награждает фокус, а не ширину."),
    qx("Which chain narrows a topic properly, as in Practical Task 2?", "Road safety → driver fatigue → fatigue apps for truck drivers → SafeDrive's effect on fatigue", [
      ["SafeDrive's effect on fatigue scores → fatigue apps → driver fatigue → road safety in general", "This goes from narrow to broad — the reverse of narrowing.", "Это движение от узкого к широкому — обратное сужению."],
      ["Road safety → artificial intelligence → smartphone hardware → global transport policy reform", "Each step jumps to a new area instead of focusing the previous one.", "Каждый шаг перескакивает в новую область вместо того, чтобы сузить предыдущую."],
      ["Driver fatigue → road safety → transport systems → technology in modern society", "Every step is broader than the one before.", "Каждый шаг шире предыдущего."],
    ], "Each level keeps the previous idea and adds a constraint — a concept, a population, a tool, an outcome — until a researchable focus remains.", "Каждый уровень сохраняет предыдущую идею и добавляет ограничение — понятие, популяцию, инструмент, исход, — пока не останется исследуемый фокус."),
    qx("An RQ reads: 'How does SafeDrive affect drivers?' Which single change makes it most researchable?", "Name a measurable outcome, such as validated fatigue-scale scores", [
      ["Add 'definitely' to show the team is confident about the effect", "Certainty words make it an overclaim, not a better question.", "Слова уверенности превращают вопрос в преувеличение, а не улучшают его."],
      ["Replace 'drivers' with 'all road users' to make it more useful", "That broadens the population and makes the study less feasible.", "Это расширяет популяцию и делает исследование менее выполнимым."],
      ["Turn it into a catchy title such as 'SafeDrive: An AI Revolution'", "A title is not a question, and the hype adds nothing measurable.", "Название — не вопрос, а хайп не добавляет ничего измеримого."],
    ], "'Affect drivers' says nothing about what will be measured. Naming the outcome is the first step; adding the comparison and population completes the RQ.", "«Affect drivers» ничего не говорит о том, что будут измерять. Назвать исход — первый шаг; сравнение и популяция завершают RQ."),
  ],
);

const p3 = part(
  "rm-px-p3",
  { en: "Search string, synthesis paragraph and gap (B4, B6, B7)", ru: "Поисковая строка, синтез и пробел (B4, B6, B7)" },
  {
    en: `## Part B tasks 4, 6 and 7: 3 points
| Task | Points | What the marker looks for |
|---|---|---|
| B4 | 0.5 | one balanced string with quotation marks, parentheses, AND and OR |
| B6 | 1.5 | Studies A–D compared by findings, methods and limitations, not four mini-summaries |
| B7 | 1 | one genuine gap that follows from the evidence, plus why the proposed study could address it |
## B4. A balanced search string
Build it as Lectures 2 and 4 teach: **RQ → concepts → synonyms → string**. "Balanced" means two or three concept groups (not one word and not the whole RQ), two or three synonyms in each, and every bracket and quotation mark closed.
= ("driver fatigue" OR drowsiness OR sleepiness) AND (smartphone OR "mobile app" OR "mobile application") AND ("truck drivers" OR "long-haul drivers" OR "commercial drivers")
- **Quotation marks** keep a phrase together: "truck drivers" will not match a page that has "truck" in one place and "drivers" in another.
- **OR inside a bracket** joins synonyms of one concept and broadens the search.
- **AND between brackets** requires every concept and narrows it.
| Error | Example | What happens |
|---|---|---|
| OR between concepts | drowsiness OR truck | floods the results with anything about trucks |
| AND between synonyms | "driver fatigue" AND drowsiness AND sleepiness | demands all three words and loses papers |
| no brackets | drowsiness OR fatigue AND truck | the order of operations is unclear |
| no quotation marks | long-haul truck drivers | the words are matched separately |
| the RQ pasted in | Does SafeDrive reduce fatigue in drivers? | few or random results |
> Exam trap: four or five AND-groups look thorough but make the string too narrow; three groups usually balance it.
## B6. A synthesis paragraph, not four summaries
"Study A found X. Study B found Y. Study C found Z. Study D found W." — the marker sees four mini-summaries. Synthesis makes the studies talk to each other: **Both… In contrast… Only… All except…**
@diagram rmx-synthesis-grid
Write across the rows: a sentence on **findings**, one on **methods**, one on **limitations**, and a closing sentence that leads to the gap.
= Findings: Studies A and B both link drowsiness alerts to fewer fatigue-related problems, yet Study A found no significant difference in actual accidents and Study D's review of 15 studies reports mixed results.
= Methods: only Study A randomised drivers; in Study B drivers chose how often to respond, so its association may reflect self-selection and uncontrolled baseline sleep, while Study C's interviews explain acceptability rather than effect.
= Limitations: outcomes are self-reported or defined inconsistently (Studies A and D), long-haul drivers are rarely sampled (A used taxi drivers; D found few long-haul studies), and follow-up is short.
= Overall: alerts may reduce perceived fatigue, but their effect on long-haul drivers' fatigue, measured with one validated scale, remains unclear.
- Every sentence names **two or more studies** or a pattern across them.
- **Hedge:** "may", "suggests", "remains unclear" — never "proves" for mixed evidence.
- Use each study for what it can show: Study C explains *why* drivers may resist video, not *how much* alerts help.
## B7. A genuine gap and why your study fits it
Gap types from the lectures: **population or context** (taxi drivers, not long-haul), **method** (few randomised studies), **contradiction** (A positive on near-misses, D mixed), **evaluation or data** (inconsistent fatigue definitions, short follow-up).
= We know: Studies A and B suggest that alerts can reduce self-reported near-misses and logged fatigue events.
= However: Study A sampled taxi drivers aged 35–55, and Study D found few long-haul studies and inconsistent definitions of a fatigue event.
= Gap: it remains unclear whether an alert app lowers fatigue among long-haul truck drivers when fatigue is measured with a validated scale.
= Our study: a six-week comparison of SafeDrive with a paper checklist in 60 long-haul drivers, using the same validated scale in both groups, could address this.
| Not a gap | Why |
|---|---|
| No research exists on drowsiness apps. | Studies A–D contradict it |
| I could not find SafeDrive in Google Scholar. | a failed search, not a literature gap |
| SafeDrive is new, so nobody has studied it. | a new product is not a new question |
| Study D says more research is needed. | future work must be verified before it becomes your gap |
| Drivers prefer audio alerts. | that is a finding, not something unknown |
> Exam trap: the gap must lead to *your* RQ. If the gap is about accidents but the RQ measures fatigue scores, the chain is broken.
## Check yourself
?? Fix the string: drowsiness OR fatigue AND long-haul truck drivers AND app.
?= (drowsiness OR "driver fatigue") AND ("long-haul drivers" OR "truck drivers") AND ("mobile app" OR smartphone) — brackets group synonyms with OR, quotation marks keep phrases, AND joins the concepts.
?? Rewrite "Study C interviewed 18 drivers who liked audio alerts" as a synthesis sentence.
?= For example: While Studies A and B measure the effects of alerts, only Study C explains acceptability: long-haul drivers valued audio alerts at night but found video intrusive — a factor the quantitative studies did not examine.`,
    ru: `## Задания B4, B6 и B7: 3 балла
| Задание | Баллы | Что ищет проверяющий |
|---|---|---|
| B4 | 0.5 | одна сбалансированная строка с кавычками, скобками, AND и OR |
| B6 | 1.5 | Study A–D сравниваются по результатам, методам и ограничениям, а не четыре мини-пересказа |
| B7 | 1 | один настоящий пробел, вытекающий из доказательств, и почему предлагаемое исследование может его закрыть |
## B4. Сбалансированная поисковая строка
Строка строится так, как учат лекции 2 и 4: **RQ → понятия → синонимы → строка**. «Сбалансированная (balanced)» значит: две-три группы понятий (не одно слово и не весь RQ), по два-три синонима в каждой, и каждая скобка и кавычка закрыта.
= ("driver fatigue" OR drowsiness OR sleepiness) AND (smartphone OR "mobile app" OR "mobile application") AND ("truck drivers" OR "long-haul drivers" OR "commercial drivers")
- **Кавычки** держат фразу целиком: "truck drivers" не совпадёт со страницей, где «truck» стоит в одном месте, а «drivers» — в другом.
- **OR внутри скобок** объединяет синонимы одного понятия и расширяет поиск.
- **AND между скобками** требует каждое понятие и сужает поиск.
| Ошибка | Пример | Что происходит |
|---|---|---|
| OR между понятиями | drowsiness OR truck | выдача тонет во всём, что связано с грузовиками |
| AND между синонимами | "driver fatigue" AND drowsiness AND sleepiness | требует все три слова сразу и теряет статьи |
| нет скобок | drowsiness OR fatigue AND truck | порядок операций неясен |
| нет кавычек | long-haul truck drivers | слова ищутся по отдельности |
| вставлен весь RQ | Does SafeDrive reduce fatigue in drivers? | мало результатов или случайные |
> Ловушка экзамена: четыре-пять групп через AND выглядят основательно, но делают строку слишком узкой; обычно баланс дают три группы.
## B6. Абзац синтеза, а не четыре пересказа
«Study A found X. Study B found Y. Study C found Z. Study D found W.» — проверяющий видит четыре мини-пересказа. Синтез (synthesis) заставляет исследования говорить друг с другом: **Both… In contrast… Only… All except…**
@diagram rmx-synthesis-grid
Пишите по строкам: предложение о **результатах**, одно о **методах**, одно об **ограничениях** и заключительное, которое ведёт к пробелу.
= Findings: Studies A and B both link drowsiness alerts to fewer fatigue-related problems, yet Study A found no significant difference in actual accidents and Study D's review of 15 studies reports mixed results.
= Methods: only Study A randomised drivers; in Study B drivers chose how often to respond, so its association may reflect self-selection and uncontrolled baseline sleep, while Study C's interviews explain acceptability rather than effect.
= Limitations: outcomes are self-reported or defined inconsistently (Studies A and D), long-haul drivers are rarely sampled (A used taxi drivers; D found few long-haul studies), and follow-up is short.
= Overall: alerts may reduce perceived fatigue, but their effect on long-haul drivers' fatigue, measured with one validated scale, remains unclear.
- Каждое предложение называет **два и больше исследования** или закономерность между ними.
- **Осторожные формулировки:** «may», «suggests», «remains unclear» — и никогда «proves» при смешанных доказательствах.
- Каждое исследование используется для того, что оно может показать: Study C объясняет, *почему* водители могут отвергать видео, а не *насколько* помогают сигналы.
## B7. Настоящий пробел и почему ваше исследование ему подходит
Типы пробелов из лекций: **популяция или контекст (population / context)** — таксисты, а не дальнобойщики; **метод (method)** — мало рандомизированных работ; **противоречие (contradiction)** — A положительно по near-miss, D смешанно; **оценка или данные (evaluation / data)** — разные определения усталости, короткое наблюдение.
= We know: Studies A and B suggest that alerts can reduce self-reported near-misses and logged fatigue events.
= However: Study A sampled taxi drivers aged 35–55, and Study D found few long-haul studies and inconsistent definitions of a fatigue event.
= Gap: it remains unclear whether an alert app lowers fatigue among long-haul truck drivers when fatigue is measured with a validated scale.
= Our study: a six-week comparison of SafeDrive with a paper checklist in 60 long-haul drivers, using the same validated scale in both groups, could address this.
| Не пробел | Почему |
|---|---|
| No research exists on drowsiness apps. | Study A–D это опровергают |
| I could not find SafeDrive in Google Scholar. | неудачный поиск, а не пробел в литературе |
| SafeDrive is new, so nobody has studied it. | новый продукт — не новый вопрос |
| Study D says more research is needed. | future work нужно проверить, прежде чем считать своим пробелом |
| Drivers prefer audio alerts. | это результат, а не неизвестное |
> Ловушка экзамена: пробел должен вести к *вашему* RQ. Если пробел про аварии, а RQ измеряет баллы усталости, цепочка разорвана.
## Проверьте себя
?? Исправьте строку: drowsiness OR fatigue AND long-haul truck drivers AND app.
?= (drowsiness OR "driver fatigue") AND ("long-haul drivers" OR "truck drivers") AND ("mobile app" OR smartphone) — скобки объединяют синонимы через OR, кавычки держат фразы, AND соединяет понятия.
?? Перепишите «Study C interviewed 18 drivers who liked audio alerts» как предложение синтеза.
?= Например: While Studies A and B measure the effects of alerts, only Study C explains acceptability: long-haul drivers valued audio alerts at night but found video intrusive — a factor the quantitative studies did not examine.`,
  },
  [
    qx("Which search string for the SafeDrive literature is balanced and correctly built?", `("driver fatigue" OR drowsiness) AND (smartphone OR "mobile app") AND ("truck drivers" OR "long-haul drivers")`, [
      [`("driver fatigue" AND drowsiness) OR (smartphone AND "mobile app") OR ("truck drivers" AND "long-haul drivers")`, "The operators are swapped: AND inside the brackets demands every synonym, OR between them lets any one concept match.", "Операторы перепутаны: AND внутри скобок требует все синонимы сразу, а OR между скобками пропускает любое одно понятие."],
      [`"Does a smartphone drowsiness app reduce fatigue among long-haul truck drivers?"`, "Pasting the whole RQ as a phrase matches almost no paper.", "Весь RQ в кавычках почти не совпадёт ни с одной статьёй."],
      ["(driver fatigue OR drowsiness) AND (smartphone OR mobile app) AND (truck drivers OR long-haul drivers)", "Without quotation marks the multi-word terms are split into separate words.", "Без кавычек многословные термины разбиваются на отдельные слова."],
    ], "Synonyms of one concept are joined with OR inside brackets, concepts are joined with AND, and multi-word terms sit in quotation marks.", "Синонимы одного понятия соединены OR внутри скобок, понятия — через AND, многословные термины стоят в кавычках."),
    qx("A student writes: drowsiness OR fatigue AND long-haul truck drivers. Which two problems are there?", "Synonyms are not bracketed and the phrase is not in quotes", [
      ["OR should be replaced by NOT, and AND should be replaced by OR", "NOT would exclude the synonym; OR between concepts would broaden it wildly.", "NOT исключит синоним, а OR между понятиями безмерно расширит выдачу."],
      ["It has too many concept groups and too many synonyms in each one", "It has only two concepts and two synonyms — the problem is structure, not size.", "Здесь всего два понятия и два синонима — проблема в структуре, а не в объёме."],
      ["Boolean operators must be written in lowercase in academic databases", "Most databases expect uppercase AND/OR; case is not the issue here.", "Большинство баз ожидают AND/OR заглавными; регистр здесь ни при чём."],
    ], "Fix: (drowsiness OR fatigue) AND (\"long-haul drivers\" OR \"truck drivers\"). Brackets fix the order of operations; quotation marks keep the phrase together.", "Исправление: (drowsiness OR fatigue) AND (\"long-haul drivers\" OR \"truck drivers\"). Скобки задают порядок операций, кавычки держат фразу."),
    qx("RQ: 'Does an AI coding assistant change debugging time for novice programmers?' Which string is balanced?", `("AI coding assistant" OR Copilot) AND (novice OR "first-year student") AND (debugging OR "bug fixing")`, [
      [`"AI coding assistant" AND Copilot AND novice AND "first-year student" AND debugging AND "bug fixing"`, "AND between synonyms demands all of them in one paper — far too narrow.", "AND между синонимами требует их все в одной статье — слишком узко."],
      [`("AI coding assistant" OR Copilot OR novice OR "first-year student" OR debugging OR "bug fixing")`, "OR across all concepts returns papers about any one of them — far too broad.", "OR между всеми понятиями возвращает статьи о любом из них — слишком широко."],
      ["(AI OR coding OR assistant) AND (time)", "Single generic words with no phrases miss the concepts and flood the results.", "Отдельные общие слова без фраз теряют понятия и заваливают выдачу."],
    ], "Three concept groups — the tool, the population, the outcome — each with OR-joined synonyms, linked by AND, with phrases in quotation marks.", "Три группы понятий — инструмент, популяция, исход, — внутри каждой синонимы через OR, между группами AND, фразы в кавычках."),
    qx("A string with five AND-groups and long exact phrases returns only 2 results. What is the most likely cause?", "Too many AND-groups and long phrases narrow it too much", [
      ["OR inside the brackets removes most of the results", "OR broadens a search; it cannot be what removes results.", "OR расширяет поиск; он не может быть причиной потери результатов."],
      ["Google Scholar shows only papers published this year", "Google Scholar covers many years; the string is the problem.", "Google Scholar охватывает много лет; проблема в строке."],
      ["Quotation marks broaden the search, so add more of them", "Quotation marks narrow the search to exact phrases.", "Кавычки сужают поиск до точных фраз."],
    ], "Each extra AND-group and each long exact phrase is one more condition every paper must meet. Drop a group or shorten the phrases.", "Каждая лишняя группа через AND и каждая длинная точная фраза — ещё одно условие для каждой статьи. Уберите группу или укоротите фразы."),
    qx("A string returns 48,000 results, mostly about truck engines. Which fix helps most?", `Add a concept joined by AND, e.g. AND ("driver fatigue" OR drowsiness)`, [
      ["Replace every AND in the string with OR so that it covers more synonyms", "More OR broadens the search further — the opposite of what is needed.", "Больше OR ещё сильнее расширяет поиск — обратное тому, что нужно."],
      ["Remove all quotation marks so that single words can also match", "Removing quotes makes matching looser and the results even broader.", "Без кавычек совпадения становятся свободнее, а выдача ещё шире."],
      ["Read the first 500 results to see which of them are relevant", "Screening cannot fix a string that targets the wrong concept.", "Отсев не исправит строку, которая ищет не то понятие."],
    ], "Results about engines mean the fatigue concept is missing. Adding it as an AND-group narrows the search to the right topic.", "Результаты про двигатели значат, что не хватает понятия «усталость». Добавив его группой через AND, поиск сужают до нужной темы."),
    qx("Which sentence is synthesis rather than summary?", "Studies A and B both link alerts to fewer fatigue problems, but only A randomised drivers.", [
      ["Study A was a randomised eight-week study of 150 taxi drivers aged between 35 and 55.", "Describes one study on its own — summary.", "Описывает одно исследование само по себе — пересказ."],
      ["Study B analysed 900 users of a commercial drowsiness-alert app over time.", "Again one study described in isolation.", "Снова одно исследование описано отдельно."],
      ["Study D reviewed 15 studies and found that the results were mixed overall.", "A single-study summary, even of a review, does not compare studies.", "Пересказ одной работы, даже обзора, не сравнивает исследования."],
    ], "Synthesis connects sources: it states what A and B share and how their methods differ — a sentence that only works with two or more studies.", "Синтез связывает источники: говорит, что общего у A и B и чем различаются их методы, — такое предложение возможно только с двумя и более исследованиями."),
    qx("How should the B6 paragraph be organised to earn full marks?", "By findings, methods and limitations, comparing studies within each", [
      ["One block per study, from Study A to Study D in table order", "This produces four mini-summaries — exactly what the criterion excludes.", "Так получатся четыре мини-пересказа — ровно то, что критерий исключает."],
      ["Chronologically, from the oldest study in the table to the most recent one", "Dates are not given, and chronology still lists studies one by one.", "Дат в кейсе нет, а хронология всё равно перечисляет работы по одной."],
      ["From the largest sample to the smallest, summarising each study", "Ordering by size is still a list of summaries, not a comparison.", "Порядок по размеру — всё тот же список пересказов, а не сравнение."],
    ], "The task names the organising themes: findings, methods, limitations. Within each, studies are compared and contrasted.", "Задание само называет темы: findings, methods, limitations. Внутри каждой исследования сравнивают и противопоставляют."),
    qx("A synthesis paragraph says: 'Study D proves that digital monitoring does not work.' What is wrong?", "Mixed results do not show 'no effect'; the sentence overstates D", [
      ["Nothing — a systematic review is the strongest possible proof", "Even a review cannot prove more than its studies show; D reports mixed results.", "Даже обзор не докажет больше, чем показывают его работы; D сообщает о смешанных итогах."],
      ["Study D is qualitative, so it cannot be used in a synthesis", "D is a systematic review, and qualitative studies can be synthesised too.", "D — систематический обзор, а качественные работы тоже включают в синтез."],
      ["Reviews are secondary sources and may never be cited in B6", "Secondary sources can be cited; the problem is the overclaim.", "Вторичные источники цитировать можно; проблема в преувеличении."],
    ], "Mixed findings with inconsistent definitions mean the effect is unclear, not absent. Hedge: 'Study D reports mixed results, partly because outcomes were defined differently.'", "Смешанные результаты при разных определениях значат, что эффект неясен, а не отсутствует. Осторожнее: «Study D reports mixed results, partly because outcomes were defined differently»."),
    qx("Which sentence compares methods rather than findings?", "Only Study A randomised drivers; Study B relied on drivers' own choices.", [
      ["Studies A and B both report fewer fatigue-related problems with alerts.", "This compares results — a findings sentence.", "Это сравнение результатов — предложение о findings."],
      ["Study C's drivers valued audio alerts but found video intrusive.", "This reports what Study C found, not how it was done.", "Это о том, что нашло Study C, а не о том, как оно проведено."],
      ["Across studies, long-haul drivers are rarely sampled, and follow-up is short.", "This is a shared limitation — a limitations sentence.", "Это общее ограничение — предложение о limitations."],
    ], "A methods sentence contrasts designs: randomised vs observational, interviews vs review — and says what that means for the claims each study can support.", "Предложение о методах противопоставляет дизайны: рандомизированное против наблюдательного, интервью против обзора, — и говорит, что из этого следует для выводов каждого."),
    qx("Which limitation theme links Study A and Study D?", "Little evidence on long-haul drivers specifically", [
      ["Both relied only on qualitative interviews with drivers", "A is randomised and D is a review; only C used interviews.", "A — рандомизированное, D — обзор; интервью использовало только C."],
      ["Both had samples of fewer than 20 drivers", "A had 150 drivers and D pooled 15 studies; the small sample is C.", "В A было 150 водителей, D объединил 15 работ; маленькая выборка — у C."],
      ["Both found that alerts increased accidents", "Neither found an increase; A's accident difference was small and not significant.", "Ни одно не нашло роста; разница в авариях у A мала и незначима."],
    ], "A studied taxi drivers aged 35–55; D found few long-haul studies. Together they show the population gap the SafeDrive study can address.", "A изучало таксистов 35–55 лет; D нашёл мало работ о дальнобойщиках. Вместе они показывают популяционный пробел, который может закрыть исследование SafeDrive."),
    qx("What is the best role for Study C in the synthesis paragraph?", "Explaining acceptability — why drivers may resist video monitoring", [
      ["Estimating how much the alerts reduce fatigue among long-haul drivers", "Study C has no effect estimate; it cannot say 'how much'.", "У Study C нет оценки эффекта; оно не может сказать «насколько»."],
      ["Proving that audio alerts are safer than video alerts for all drivers", "18 interviews cannot prove a safety difference for all drivers.", "18 интервью не докажут разницу в безопасности для всех водителей."],
      ["Showing that the results of A and B apply to every group of drivers", "Qualitative work does not generalise statistically to all drivers.", "Качественная работа не обобщается статистически на всех водителей."],
    ], "Qualitative interviews explain experiences and reasons. Study C adds what the numbers miss: drivers' view of audio vs video and why some covered the camera.", "Качественные интервью объясняют опыт и причины. Study C добавляет то, чего не видно в числах: отношение водителей к звуку и видео и почему некоторые закрывали камеру."),
    qx("Which gap statement would earn full marks in B7?", "Evidence comes from taxi drivers and app users with inconsistent fatigue measures, so the effect on long-haul drivers remains unclear.", [
      ["No research exists on drowsiness apps, so this will be the first study of its kind anywhere in the world, and it will fill the whole gap.", "Studies A–D exist; 'no research exists' is false and loses the mark.", "Study A–D существуют; «исследований нет» — ложь, балл теряется."],
      ["A Google Scholar search for SafeDrive returned nothing at all, which shows a clear gap in research.", "A failed search is not a literature gap, and a product name is not a question.", "Неудачный поиск — не пробел в литературе, а название продукта — не вопрос."],
      ["Drivers find video intrusive, so the gap is that SafeDrive should switch to audio alerts only.", "This is a design recommendation drawn from a finding, not an unknown.", "Это рекомендация по дизайну из результата, а не неизвестное."],
    ], "It follows from the table (A: taxi drivers; B: app users; D: inconsistent definitions) and is modest: 'remains unclear', not 'nothing exists'.", "Пробел вытекает из таблицы (A — таксисты; B — пользователи приложения; D — разные определения) и сформулирован скромно: «remains unclear», а не «ничего нет»."),
    qx("Why is 'SafeDrive itself has never been studied' not a valid gap?", "A new product is not a new question; alerts and fatigue are studied", [
      ["It is valid, because the case says SafeDrive is still only a prototype", "The newness of a product does not show that knowledge about the question is missing.", "Новизна продукта не показывает, что знаний по вопросу не хватает."],
      ["Gaps must always come from the Future work section of some paper", "Gaps come from comparing the literature; future work is only a clue.", "Пробелы берутся из сравнения литературы; future work — лишь подсказка."],
      ["Products can count as gaps only when they have a DOI and a publisher", "DOIs identify publications; they have nothing to do with defining gaps.", "DOI идентифицирует публикации и не имеет отношения к определению пробелов."],
    ], "A gap is about knowledge, not products: what is still unknown about alerts and fatigue in long-haul drivers, as shown by Studies A–D.", "Пробел — о знании, а не о продуктах: что ещё неизвестно о сигналах и усталости у дальнобойщиков, как показывают Study A–D."),
    qx("Study A sampled taxi drivers aged 35–55, while SafeDrive targets long-haul truck drivers. Which gap type is this?", "Population/context gap", [
      ["Contradiction gap between studies", "No two studies disagree here; one population is simply missing.", "Здесь нет спорящих исследований; просто не хватает одной популяции."],
      ["Method gap in the study design", "The design (randomised) is strong; the issue is who was studied.", "Дизайн (рандомизация) сильный; проблема в том, кого изучали."],
      ["Outdated evidence gap", "Nothing in the case says the study is old.", "В кейсе ничего не сказано о том, что работа старая."],
    ], "Evidence exists for one group (taxi drivers) but not for the group that matters (long-haul drivers) — the classic population or context gap.", "Доказательства есть для одной группы (таксисты), но не для нужной (дальнобойщики) — классический пробел по популяции или контексту."),
    qx("One study finds that alerts reduce near-misses; a review of similar studies finds mixed effects, and the reasons are unexplained. Which gap type fits?", "Contradiction gap", [
      ["Population gap", "The disagreement between results is the signal here, not a missing group.", "Сигнал здесь — расхождение результатов, а не отсутствующая группа."],
      ["Not a gap: results always differ", "Unexplained disagreement is exactly what Lecture 2 calls a contradiction gap.", "Необъяснённое расхождение — именно то, что лекция 2 называет пробелом-противоречием."],
      ["Context gap: a different country", "No country difference is mentioned; the results simply conflict.", "О разных странах ничего не сказано; результаты просто противоречат друг другу."],
    ], "When studies disagree and nobody has explained why — different measures, samples, settings — the inconsistency itself is worth investigating.", "Когда исследования расходятся и никто не объяснил почему — разные меры, выборки, условия, — само расхождение стоит исследовать."),
    qx("Studies in a review define 'fatigue event' differently and follow drivers only briefly. Which gap type is this?", "Evaluation or data gap", [
      ["Population gap", "The issue is how outcomes are measured, not who is studied.", "Проблема в том, как измеряют исход, а не в том, кого изучают."],
      ["A sign of plagiarism", "Different definitions are a measurement problem, not misconduct.", "Разные определения — проблема измерения, а не недобросовестность."],
      ["Not a gap, only poor writing", "Inconsistent outcome measures limit what the evidence can show — a real gap.", "Несогласованные меры исхода ограничивают то, что могут показать доказательства, — это настоящий пробел."],
    ], "Lecture 2's evaluation/data gap: existing studies use limited or inconsistent measures, metrics or follow-up, so the evidence cannot be compared or generalised.", "Пробел оценки/данных из лекции 2: работы используют ограниченные или несогласованные меры, метрики или сроки наблюдения, поэтому доказательства нельзя сравнить и обобщить."),
    qx("Study D's authors call for long-haul studies in their future-work section. What should be checked before claiming this as the gap?", "Whether later studies did it, whether it fits the RQ, and whether it is feasible", [
      ["Only whether the review was published in a journal that assigns DOIs", "A DOI says nothing about whether the gap is still open or relevant.", "DOI ничего не говорит о том, открыт ли ещё пробел и подходит ли он."],
      ["Nothing — an author's future-work note is already a verified gap for anyone who reads it", "Lecture 2: future work ≠ your gap until it is verified.", "Лекция 2: future work ≠ ваш пробел, пока он не проверен."],
      ["Whether the authors agree to let the team reuse their idea in a new study", "Ideas are cited, not licensed; permission is not the check needed.", "Идеи цитируют, а не лицензируют; разрешение — не та проверка."],
    ], "Lecture 2's three checks: has it already been done since? Is it relevant to your problem? Can you realistically investigate it?", "Три проверки из лекции 2: не сделано ли это уже позже? Относится ли к вашей проблеме? Можно ли реально это исследовать?"),
    qx("Besides the gap itself, what must a full-mark B7 answer include?", "Why the proposed study could address it, e.g. its sample and measure", [
      ["A list of all four studies with their sample sizes and their designs", "Listing studies is summary; B7 needs the link from gap to study.", "Перечисление исследований — пересказ; B7 нужна связь пробела с исследованием."],
      ["A promise that the study will prove the app reduces accidents", "An overclaim — and accidents are not the study's outcome.", "Преувеличение — к тому же аварии не являются исходом исследования."],
      ["A statement that the gap was found by searching Google Scholar", "How you searched does not justify the gap; the evidence does.", "Способ поиска не обосновывает пробел; его обосновывают доказательства."],
    ], "The task asks why the proposed study could address the gap: long-haul drivers, a comparison group and the same validated fatigue scale in both groups.", "Задание спрашивает, почему предлагаемое исследование может закрыть пробел: дальнобойщики, группа сравнения и одна и та же валидированная шкала усталости в обеих группах."),
    tfx("A balanced search string puts the whole research question in quotation marks so that results match it exactly.", false, "Quotation marks are for short multi-word terms. A whole question in quotes matches almost nothing; the RQ must be broken into concepts and synonyms.", "Кавычки нужны для коротких многословных терминов. Весь вопрос в кавычках почти ни с чем не совпадёт; RQ нужно разбить на понятия и синонимы.", "Choosing True repeats the 'searching the wrong way' mistake from Lecture 4.", "Ответ True повторяет ошибку «поиск не тем способом» из лекции 4."),
    tfx("'Evidence remains limited' is a safer way to state a gap than 'no study has ever examined this'.", true, "Hedged wording matches what a literature review can show. An absolute claim is contradicted by any single study — here by Studies A–D.", "Осторожная формулировка соответствует тому, что может показать обзор литературы. Абсолютное утверждение опровергается любым одним исследованием — здесь Study A–D.", "Choosing False ignores Lecture 4: a gap does not mean nobody has studied the topic.", "Ответ False игнорирует лекцию 4: пробел не означает, что тему никто не изучал."),
  ],
);

const p4 = part(
  "rm-px-p4",
  { en: "Ethics risks, safeguards and records (B5); a strategy for 10 points", ru: "Этические риски, меры защиты и записи (B5); стратегия на 10 баллов" },
  {
    en: `## B5. Two risks, each with a safeguard and a record
This task carries **1.5 points** — as much as the synthesis. Each risk needs three linked pieces, as on the Lecture 3 ethics card (DATA · PEOPLE · RISK · SAFEGUARD · EVIDENCE):
@diagram rmx-risk-chain
- **Risk** — specific: what data, whose, what could go wrong.
- **Safeguard** — an action that reduces that risk, not a wish such as "be careful".
- **Evidence / record** — the document or artefact that shows the safeguard was **actually applied**: signed consent forms, an ethics approval letter, a settings export, an access list, a deletion log.
| Risk in SafeDrive | Safeguard | Evidence / record |
|---|---|---|
| continuous video by default records faces of drivers and passengers | video off by default; detection on the phone, no frames stored or uploaded | settings export showing storage disabled; consent form describing camera use |
| continuous geolocation reveals homes, routes and stops | location saved only at alert events and coarsened, or not at all | data dictionary of stored fields; a sample export with no raw GPS traces |
| employer pressure: drivers feel they must join and be monitored | recruitment through the clinic; employers get no individual data; withdrawal without penalty | signed consent forms stating voluntariness; data-sharing agreement excluding employers |
| sleep and fatigue are health data that could leak | encrypted university storage; named access; fixed retention and deletion | access-control list; data management plan; deletion log |
| AI-suggested references never opened | open and verify every record before citing it | verification log: DOI or publisher page checked, with the date |
> Exam trap: "We will obtain consent" is a safeguard, not a record. The record is the signed form — kept, dated and linked to the approval number.
## Confidentiality is not anonymity here
SafeDrive data carry driver IDs and GPS points, so they are **not anonymous**: a route can identify a person. With codes and a separate key the data are **pseudonymised and confidential** — the team knows identities and controls access. Promise only what the workflow can deliver.
## The data lifecycle in one line
= Collect only what the RQ needs → store encrypted → named access → fixed retention → delete or share with a record
- The RQ measures fatigue scores; continuous video is not needed to answer it. That is the core of the data-protection argument — **data minimisation**.
- A change after approval (for example, uploading video to a cloud service) must be reported and approved **before** it is used.
## Strategy for 10 points
Split the time by points. In a 40-minute quiz that is about 4 minutes a point; keep the same proportions for any length.
| Block | Points | Minutes | Length |
|---|---|---|---|
| read the case, rewrite the table | — | 5 | margin notes |
| Part A, six items | 3 | 6 | 1–2 sentences each |
| B1 outputs | 0.5 | 1.5 | 2 lines |
| B2 problem statement | 1 | 4 | 3 labelled sentences |
| B3 research question | 1 | 3 | 1 sentence |
| B4 search string | 0.5 | 2 | 1 line |
| B5 risks | 1.5 | 6 | 2 × risk, safeguard, record |
| B6 synthesis | 1.5 | 7 | 4–5 sentences |
| B7 gap | 1 | 4 | 3–4 sentences |
| final check | — | 1.5 | the checklist below |
- **Label the parts the rubric names** ("Current situation:", "Limitation:", "Need:"; "Risk / Safeguard / Record"), so the marker finds each point at a glance.
- **Cite by letter** (Study A, Study D): the case is the only allowed evidence.
- **Hedge:** may, suggests, remains unclear. Delete "definitely", "prove", "always".
- **Keep one thread:** the outcome in the RQ (fatigue score) is the outcome in the need, the synthesis and the gap — the alignment check from Lecture 4.
## Final checklist
- Part A: six answers, each with a course term and a reason from the case.
- B1: two outputs, with the app on the development side.
- B2: three labelled parts and at least one study letter.
- B3: exactly one question with population, comparison and outcome.
- B4: quotation marks, brackets, AND, OR — every bracket closed.
- B5: two different risks, each with a safeguard and a record.
- B6: organised by findings, methods, limitations.
- B7: "remains unclear" or "limited", never "no research exists"; says how the study addresses the gap.
## Check yourself
?? "Risk: privacy. Safeguard: we will protect the data. Evidence: we promise." Which of the three pieces earn marks?
?= None. The risk is not specific (whose data, what kind), the safeguard is not an action, and a promise is not a record that anything was applied.
?? The team wants to keep continuous video "in case it is useful later". Which principle does this break, and why?
?= Data minimisation: collect only the data the RQ needs. The RQ uses fatigue-scale scores, so stored video adds risk without helping to answer it.`,
    ru: `## B5. Два риска, у каждого — мера защиты и запись
Это задание стоит **1.5 балла** — столько же, сколько синтез. Каждому риску нужны три связанных элемента, как в этической карточке лекции 3 (DATA · PEOPLE · RISK · SAFEGUARD · EVIDENCE):
@diagram rmx-risk-chain
- **Риск (risk)** — конкретный: какие данные, чьи, что может пойти не так.
- **Мера защиты (safeguard)** — действие, которое снижает этот риск, а не пожелание вроде «быть аккуратными».
- **Доказательство / запись (evidence / record)** — документ или артефакт, показывающий, что мера **действительно применена**: подписанные формы согласия, письмо этического комитета об одобрении, экспорт настроек, список доступа, журнал удаления.
| Риск в SafeDrive | Мера защиты | Доказательство / запись |
|---|---|---|
| непрерывное видео по умолчанию снимает лица водителей и пассажиров | видео выключено по умолчанию; распознавание на телефоне, кадры не хранятся и не загружаются | экспорт настроек, где хранение отключено; форма согласия с описанием камеры |
| непрерывная геолокация раскрывает дома, маршруты и остановки | место сохраняется только в момент сигнала и огрублённо — или не сохраняется вовсе | словарь хранимых полей; пример выгрузки без сырых GPS-треков |
| давление работодателя: водители чувствуют, что обязаны участвовать и быть под наблюдением | набор через клинику; работодатель не получает индивидуальных данных; выход без последствий | подписанные формы согласия о добровольности; соглашение о передаче данных без работодателя |
| сон и усталость — медицинские данные, которые могут утечь | шифрованное хранилище университета; поимённый доступ; фиксированный срок хранения и удаление | список доступа; план управления данными; журнал удаления |
| ссылки от ИИ, которые никто не открывал | открыть и проверить каждую запись до цитирования | журнал проверки: DOI или страница издателя проверены, с датой |
> Ловушка экзамена: «We will obtain consent» — это мера, а не запись. Запись — подписанная форма: хранится, датирована и связана с номером одобрения.
## Здесь конфиденциальность — не анонимность
Данные SafeDrive содержат ID водителей и точки GPS, поэтому они **не анонимны**: маршрут может выдать человека. С кодами и отдельным ключом данные **псевдонимизированы и конфиденциальны (pseudonymised, confidential)** — команда знает личности и контролирует доступ. Обещать можно только то, что процесс реально обеспечит.
## Жизненный цикл данных одной строкой
= Collect only what the RQ needs → store encrypted → named access → fixed retention → delete or share with a record
- RQ измеряет баллы усталости; непрерывное видео для ответа не нужно. В этом суть аргумента о защите данных — **минимизация данных (data minimisation)**.
- Изменение после одобрения (например, загрузку видео в облачный сервис) нужно сообщить и согласовать **до** того, как его применять.
## Стратегия на 10 баллов
Время делится по баллам. На квиз в 40 минут это около 4 минут на балл; при другой длительности пропорции те же.
| Блок | Баллы | Минуты | Объём |
|---|---|---|---|
| прочитать кейс, переписать таблицу | — | 5 | пометки на полях |
| часть A, шесть пунктов | 3 | 6 | по 1–2 предложения |
| B1 выходы | 0.5 | 1.5 | 2 строки |
| B2 постановка проблемы | 1 | 4 | 3 подписанных предложения |
| B3 исследовательский вопрос | 1 | 3 | 1 предложение |
| B4 поисковая строка | 0.5 | 2 | 1 строка |
| B5 риски | 1.5 | 6 | 2 × риск, мера, запись |
| B6 синтез | 1.5 | 7 | 4–5 предложений |
| B7 пробел | 1 | 4 | 3–4 предложения |
| финальная проверка | — | 1.5 | чек-лист ниже |
- **Подписывайте части, которые называет критерий** («Current situation:», «Limitation:», «Need:»; «Risk / Safeguard / Record»), — так проверяющий сразу находит каждый балл.
- **Ссылайтесь по буквам** (Study A, Study D): кейс — единственное допустимое доказательство.
- **Осторожные формулировки:** may, suggests, remains unclear. Вычеркните «definitely», «prove», «always».
- **Держите одну нить:** исход в RQ (балл усталости) — тот же, что в потребности, синтезе и пробеле; это проверка согласованности (alignment) из лекции 4.
## Финальный чек-лист
- Часть A: шесть ответов, в каждом — термин курса и довод из кейса.
- B1: два выхода, приложение — на стороне development.
- B2: три подписанные части и хотя бы одна буква исследования.
- B3: ровно один вопрос с популяцией, сравнением и исходом.
- B4: кавычки, скобки, AND, OR — все скобки закрыты.
- B5: два разных риска, у каждого — мера и запись.
- B6: построен по findings, methods, limitations.
- B7: «remains unclear» или «limited», никогда «no research exists»; сказано, как исследование закрывает пробел.
## Проверьте себя
?? «Risk: privacy. Safeguard: we will protect the data. Evidence: we promise.» Какие из трёх элементов принесут баллы?
?= Никакие. Риск не конкретен (чьи данные, какие), мера — не действие, а обещание — не запись о том, что что-то применено.
?? Команда хочет хранить непрерывное видео «на всякий случай». Какой принцип это нарушает и почему?
?= Минимизацию данных: собирают только то, что нужно для RQ. RQ использует баллы шкалы усталости, поэтому хранимое видео добавляет риск и не помогает ответить на вопрос.`,
  },
  [
    qx("Which is a specific safeguard for SafeDrive's continuous video recording?", "Video off by default; detection runs on the phone and no frames are stored", [
      ["The team will be careful with the video and will respect the drivers' privacy", "A good intention is not an action; nothing changes in what is collected or stored.", "Добрые намерения — не действие; в сборе и хранении ничего не меняется."],
      ["Video is kept, but the files are renamed so that no names appear on them", "Faces in the video still identify people; renaming files does not protect them.", "Лица на видео всё равно идентифицируют людей; переименование файлов их не защищает."],
      ["Drivers are told in a newsletter that the app now has a camera feature", "Informing in a newsletter is neither informed consent nor a reduction of the data.", "Сообщение в рассылке — ни информированное согласие, ни сокращение данных."],
    ], "A safeguard is a concrete action that removes or reduces the risk: no recording unless needed, processing on the device and nothing stored.", "Мера защиты — конкретное действие, которое убирает или снижает риск: не записывать без нужды, обрабатывать на устройстве и ничего не хранить."),
    qx("Which item is evidence that the consent safeguard was actually applied?", "Signed consent forms for all 60 drivers, filed with the approval number", [
      ["A sentence in the proposal saying that consent will be obtained later", "A plan shows intention, not that consent was actually obtained.", "План показывает намерение, а не то, что согласие действительно получено."],
      ["The app's privacy policy published on the developer's own website", "A developer's policy is not consent from study participants.", "Политика разработчика — не согласие участников исследования."],
      ["The researchers' impression that the drivers all seemed happy to take part", "An impression is not a record; nothing can be checked.", "Впечатление — не запись; проверить нечего."],
    ], "A record is a document that shows the safeguard happened: dated, signed forms for every participant, linked to the ethics approval.", "Запись — документ, показывающий, что мера применена: датированные подписанные формы от каждого участника, связанные с этическим одобрением."),
    qx("An answer reads: 'Risk: privacy. Safeguard: keep data safe. Evidence: we promise.' What is missing?", "A specific risk, a concrete action and a record that it was done", [
      ["Only a citation to Study C, which already mentions video monitoring", "A citation does not fix a vague risk, a wish-safeguard and a promise.", "Ссылка не исправит размытый риск, меру-пожелание и обещание."],
      ["Nothing; the three labels are present, so it earns full marks", "Labels earn nothing if the content under them is empty.", "Подписи ничего не дают, если под ними пусто."],
      ["A longer explanation of why privacy matters to long-haul drivers", "Length is not the problem; specificity is.", "Проблема не в длине, а в конкретности."],
    ], "Each piece fails: 'privacy' does not say whose data or what kind, 'keep data safe' is not an action, and a promise is not evidence of application.", "Каждый элемент провален: «privacy» не говорит, чьи данные и какие, «keep data safe» — не действие, а обещание — не доказательство применения."),
    qx("Which safeguard best reduces the geolocation risk in SafeDrive?", "Save location only at alert events and coarsen it; keep no continuous trace", [
      ["Keep full GPS traces, but encrypt the drivers' email addresses in the data file", "The traces themselves reveal homes and routes; encrypting emails does not help.", "Сами треки раскрывают дома и маршруты; шифрование адресов почты не помогает."],
      ["Ask drivers to switch their phones off whenever they arrive at home", "This shifts the burden to drivers and breaks the app while driving home.", "Это перекладывает заботу на водителей и ломает работу приложения по пути домой."],
      ["Publish only maps of the routes rather than tables of raw coordinates", "Route maps still identify drivers; the risk is in collecting and keeping the traces.", "Карты маршрутов всё равно выдают водителей; риск — в сборе и хранении треков."],
    ], "Data minimisation: the RQ needs at most where alerts happen, not where drivers live or stop. Collect less and coarsen what remains.", "Минимизация данных: RQ нужно максимум место срабатывания сигнала, а не где водитель живёт или останавливается. Собирать меньше и огрублять остальное."),
    qx("SafeDrive data use driver codes, and a separate file links codes to names. How is this protection described correctly?", "Confidential and pseudonymised, but not anonymous", [
      ["Anonymous, because names are replaced by codes", "While a key exists, identities can be recovered, so this is not anonymity.", "Пока существует ключ, личности можно восстановить, поэтому это не анонимность."],
      ["Public, because the drivers drive on public roads", "Driving on public roads does not make research data public.", "Езда по общественным дорогам не делает исследовательские данные публичными."],
      ["Anonymous, once the key file has a password on it", "A protected key is still a key; the data remain linkable.", "Защищённый ключ всё равно ключ; данные остаются связываемыми."],
    ], "Lecture 3: confidentiality means the team knows identities but controls access; anonymity means a response cannot reasonably be linked to a person. A code key means confidentiality.", "Лекция 3: конфиденциальность — команда знает личности, но контролирует доступ; анонимность — ответ нельзя разумно связать с человеком. Ключ кодов означает конфиденциальность."),
    qx("A trucking company offers to recruit drivers and wants weekly individual alert reports. Which risk is this?", "Pressure on voluntariness and use of the data against drivers", [
      ["A feasibility risk, because the company may recruit too many drivers", "Too many recruits is not the concern; the employer's power over drivers is.", "Дело не в избытке участников, а во власти работодателя над водителями."],
      ["No risk, since the company already employs and monitors these drivers", "Employment makes pressure more likely, and research data must not feed discipline.", "Трудовые отношения делают давление вероятнее, а данные исследования не должны идти на взыскания."],
      ["Plagiarism, because the company did not write the research plan", "Plagiarism is about taking credit for others' work; this is about participants.", "Плагиат — о присвоении чужой работы; здесь речь об участниках."],
    ], "Drivers may feel they cannot refuse, and individual reports could be used to judge them. Safeguards: clinic recruitment, no individual data for employers, withdrawal without penalty.", "Водители могут чувствовать, что отказаться нельзя, а индивидуальные отчёты могут использоваться для оценки их работы. Меры: набор через клинику, работодатель не получает индивидуальных данных, выход без последствий."),
    qx("Which row correctly links risk → safeguard → record?", "Health data leak → encrypted storage with named access → access-control list", [
      ["Health data leak → signed consent forms → an encrypted university server", "Consent does not prevent a leak, and storage is a safeguard, not a record.", "Согласие не предотвращает утечку, а хранилище — мера, а не запись."],
      ["Video by default → ethics approval letter → video stored on a shared class drive", "Approval is a record, not a safeguard, and a shared drive makes the risk worse.", "Одобрение — запись, а не мера, а общий диск только увеличивает риск."],
      ["Unverified sources → anonymised participants → a Mendeley collection", "Anonymising participants does nothing for unverified references.", "Анонимизация участников ничего не даёт для непроверенных ссылок."],
    ], "Each link must fit the one before: the action addresses that very risk, and the record proves that very action was taken.", "Каждое звено должно соответствовать предыдущему: действие направлено именно на этот риск, а запись доказывает именно это действие."),
    qx("A team plans to quote truck drivers' public forum posts with their usernames. What does Lecture 3 suggest?", "Public is not ethically simple: drop usernames and avoid searchable quotes", [
      ["No ethics issue arises at all, because the posts are already public online", "Lecture 3: legal access and ethical use are different questions.", "Лекция 3: законный доступ и этичное использование — разные вопросы."],
      ["Quote freely, but add each post's URL so that readers can check it", "A URL makes re-identification even easier.", "Ссылка на пост делает повторную идентификацию ещё проще."],
      ["Ask the forum for the posts' DOIs before quoting them in the report", "Forum posts do not have DOIs; the issue is privacy, not traceability.", "У постов форума нет DOI; вопрос в приватности, а не в прослеживаемости."],
    ], "The four online checks — expectations, sensitivity, platform terms, presentation. Exact quotes can be found by search and identify the author, so paraphrase and remove usernames.", "Четыре проверки онлайн-данных — ожидания, чувствительность, правила платформы, подача. Точную цитату находят поиском, и она выдаёт автора, поэтому пересказывают и убирают ники."),
    qx("A data plan reads: collect → store encrypted → named access. Which step is missing?", "A retention period and deletion or sharing", [
      ["Choosing the citation style for the report", "Citation style concerns writing, not data management.", "Стиль цитирования относится к тексту, а не к управлению данными."],
      ["Writing up the synthesis of Studies A–D", "The synthesis is a writing task, not a data-lifecycle step.", "Синтез — письменное задание, а не этап жизненного цикла данных."],
      ["Recruiting more drivers to the study", "Recruitment comes before collection and is not part of the data plan's end.", "Набор идёт до сбора и не завершает план данных."],
    ], "Lecture 3's lifecycle: collect → store → access → retain (a justified period) → delete or share, with a record of what was done.", "Жизненный цикл из лекции 3: сбор → хранение → доступ → срок хранения (обоснованный) → удаление или передача, с записью о сделанном."),
    qx("After approval, the team decides to upload video clips to a cloud service. What should happen first?", "Report the change and get an amendment approved before uploading", [
      ["Upload the clips first, then mention the change in the final report", "Reporting after the fact means data were handled outside the approval.", "Сообщение задним числом означает, что с данными работали вне одобрения."],
      ["Nothing, because the cloud provider has its own privacy policy", "A provider's policy does not replace the study's approval and consent.", "Политика провайдера не заменяет одобрение исследования и согласие."],
      ["Ask drivers informally in a group chat whether they mind it", "Informal chat is not consent and leaves no proper record.", "Неформальный чат — не согласие и не оставляет нормальной записи."],
    ], "Lecture 3's approval prompts: a change after approval is reported and an amendment sought before proceeding — and consent may need updating too.", "Подсказки лекции 3 об одобрении: об изменении после одобрения сообщают и получают поправку до продолжения работы — возможно, нужно обновить и согласие."),
    qx("Which of these is a data-protection risk rather than a research-integrity risk?", "Raw driver video uploaded to a third-party server without agreement", [
      ["Citing AI-suggested references that nobody on the team ever opened", "This threatens the credibility of knowledge — an integrity risk.", "Это угрожает достоверности знания — риск честности исследования."],
      ["Reporting only the best of six analysis runs in the results section", "Selective reporting is falsification — integrity, not data protection.", "Выборочная отчётность — фальсификация, то есть честность, а не защита данных."],
      ["Copying Study C's limitation sentence without quotation marks", "Copying without attribution is plagiarism — an integrity risk.", "Копирование без указания источника — плагиат, риск честности."],
    ], "Lecture 3 splits integrity into knowledge (credible claims) and people (privacy, consent, secure data). Uploading identifiable video without agreement endangers people.", "Лекция 3 делит честность на знание (достоверные утверждения) и людей (приватность, согласие, безопасные данные). Загрузка идентифицирующего видео без соглашения угрожает людям."),
    qx("In a 40-minute quiz, which plan matches time to points?", "About 6–7 minutes each on B5 and B6, about 2 on the search string", [
      ["Fifteen minutes on Part A, since it has the most separate items", "Part A is 3 points; 15 minutes starves the 1.5-point tasks.", "Часть A — 3 балла; 15 минут отнимут время у заданий по 1.5 балла."],
      ["Equal time for every task, about four minutes for each of them", "Tasks are worth 0.5 to 1.5 points; equal time ignores the weights.", "Задания стоят от 0.5 до 1.5 балла; равное время игнорирует веса."],
      ["Most time on B1 and B4, because short answers need the most careful work", "B1 and B4 are 0.5 each — the least valuable tasks.", "B1 и B4 стоят по 0.5 — это самые «дешёвые» задания."],
    ], "Time follows points: about 4 minutes per point, so the 1.5-point tasks (B5, B6) get the most and the 0.5-point tasks the least.", "Время следует за баллами: около 4 минут на балл, поэтому больше всего получают задания по 1.5 (B5, B6), меньше всего — по 0.5."),
    qx("What makes a B2 answer easiest to mark?", "Labelling the three parts: Current situation, Limitation, Need", [
      ["Writing one long unlabelled paragraph to show academic fluency", "Without labels the marker must hunt for each part, and missing ones go unnoticed by you.", "Без подписей проверяющему приходится искать каждую часть, а пропуски не заметны и самому автору."],
      ["Adding statistics from outside sources to look well-researched", "Outside facts break the 'use only the case' instruction.", "Внешние факты нарушают инструкцию «use only the case»."],
      ["Copying the case text word for word so that nothing is missed", "Copying shows no analysis and does not state a limitation or need.", "Копирование не показывает анализа и не формулирует ограничение и потребность."],
    ], "The criterion names three parts; labelling them makes each point visible and shows at once if one is missing.", "Критерий называет три части; подписи делают каждый балл видимым и сразу показывают, если чего-то не хватает."),
    qx("The RQ measures fatigue-scale scores, but the gap and the need talk only about accidents. What is the problem?", "The chain is misaligned: the gap must lead to the outcome in the RQ", [
      ["None, because accidents and fatigue are the same outcome in this case", "They are different outcomes, measured differently.", "Это разные исходы, и измеряют их по-разному."],
      ["The RQ should add accidents, so that it covers both outcomes", "Adding accidents makes the RQ unfocused and not feasible.", "Добавление аварий делает RQ несфокусированным и невыполнимым."],
      ["Gaps are always broader than RQs, so this is exactly right", "A gap can be broader, but it must point to what the RQ studies.", "Пробел может быть шире, но должен указывать на то, что изучает RQ."],
    ], "Lecture 4's alignment check: problem → RQ → literature → gap → evidence must connect. A gap about accidents does not justify an RQ about fatigue scores.", "Проверка согласованности из лекции 4: проблема → RQ → литература → пробел → доказательства должны быть связаны. Пробел про аварии не обосновывает RQ про баллы усталости."),
    qx("Which wording fits a claim based on Studies A–D?", "Alerts may reduce perceived fatigue, but the effect remains unclear.", [
      ["Alerts definitely reduce fatigue, as all four studies clearly prove.", "The studies are mixed and partly self-reported; nothing is proven.", "Исследования смешанные и частично на самоотчётах; ничего не доказано."],
      ["Alerts have been proven useless, since the accident results were mixed.", "Mixed or non-significant results do not prove uselessness.", "Смешанные или незначимые результаты не доказывают бесполезность."],
      ["Alerts always work for taxi drivers and therefore for all drivers.", "Study A cannot be generalised to all drivers, and 'always' overclaims.", "Study A нельзя обобщить на всех водителей, а «always» — преувеличение."],
    ], "Hedged wording matches the evidence: some positive findings (A, B), mixed overall (D), so the effect is uncertain.", "Осторожная формулировка соответствует доказательствам: есть положительные результаты (A, B), в целом картина смешанная (D), значит, эффект неопределён."),
    qx("What is the best form for each Part A answer?", "One or two sentences: the course term plus evidence from the case", [
      ["A full paragraph that covers every possible problem in the whole case", "Each item is 0.5 points; a paragraph wastes time needed for Part B.", "Каждый пункт — 0.5 балла; абзац отнимает время, нужное для части B."],
      ["A single keyword such as 'broad' or 'ethics', with no reason", "A bare keyword shows recognition, not understanding; the reason earns the mark.", "Голое ключевое слово показывает узнавание, а не понимание; балл приносит объяснение."],
      ["A quotation from the lecture slides, with the slide number", "The marker wants the term applied to the case, not quoted.", "Проверяющему нужен термин, применённый к кейсу, а не цитата."],
    ], "Short and complete: name the issue in course language and point to the line of the case that shows it — optionally with a one-line fix.", "Коротко и полно: назвать проблему термином курса и указать строку кейса, которая её показывает, — при желании с исправлением в одну строку."),
    tfx("Mentioning the camera in the consent form makes continuous video recording acceptable, whatever the research question is.", false, "Consent does not override data minimisation: data the RQ does not need should not be collected, and consent must match what actually happens to the data.", "Согласие не отменяет минимизацию данных: данные, не нужные для RQ, не собирают, а согласие должно соответствовать тому, что реально происходит с данными.", "Choosing True treats consent as a licence for any collection; Lecture 3 links collection to what the question needs.", "Ответ True считает согласие разрешением на любой сбор; лекция 3 связывает сбор с тем, что нужно вопросу."),
    tfx("An ethics approval letter is a record; 'we will apply for approval' is not evidence that a safeguard was applied.", true, "A record proves something was done. A plan to apply proves nothing yet — B5 asks for evidence that the safeguard was applied.", "Запись доказывает, что что-то сделано. План подать заявку пока ничего не доказывает — а B5 требует доказательства применения меры.", "Choosing False treats intentions as evidence, which is exactly where vague B5 answers lose marks.", "Ответ False считает намерения доказательством — именно на этом размытые ответы в B5 теряют баллы."),
    qx("A study analyses students' chats with a mental-health chatbot. Which B5 entry earns full marks?", "Chats may reveal identities → remove names before analysis → de-identification log", [
      ["Chats are private → be respectful to all students → the students will trust the team", "No concrete action and no record — only attitudes and hopes.", "Нет ни конкретного действия, ни записи — только отношение и надежды."],
      ["Chats may be long → summarise them with an AI tool → the AI's summary file", "Length is not an ethical risk, and uploading chats to an AI tool creates one.", "Длина — не этический риск, а загрузка чатов в ИИ-инструмент как раз его создаёт."],
      ["Chats may be useful later → keep everything forever → the full chat archive", "Keeping sensitive data forever breaks retention rules; it adds risk.", "Бессрочное хранение чувствительных данных нарушает правила хранения и добавляет риск."],
    ], "Specific risk (identifiable mental-health data), a concrete action that reduces it (de-identification) and a record that it was done (the log).", "Конкретный риск (идентифицируемые данные о психическом здоровье), действие, которое его снижает (обезличивание), и запись о выполнении (журнал)."),
    qx("Safeguard: only the principal investigator and one analyst can open the data. Which record shows it was applied?", "The access-control list of the encrypted folder, with two names", [
      ["A consent form signed by each of the 60 drivers taking part in the study", "Consent forms prove consent, not who can access the data.", "Формы согласия доказывают согласие, а не то, у кого есть доступ к данным."],
      ["A paragraph in the report saying the data were kept secure", "A claim in the report is not a record that can be checked.", "Утверждение в отчёте — не запись, которую можно проверить."],
      ["The search string used to find Studies A–D in Scopus", "The search string documents the literature search, not data access.", "Поисковая строка документирует поиск литературы, а не доступ к данным."],
    ], "The record must match the safeguard: an access list (or access log) shows exactly who can open the data.", "Запись должна соответствовать мере: список доступа (или журнал доступа) показывает, кто именно может открыть данные."),
  ],
);

export const practice: Lecture = {
  id: "rm-px",
  title: { en: "Exam practice — the case quiz format", ru: "Практика — формат квиза-кейса" },
  parts: [p1, p2, p3, p4],
};
