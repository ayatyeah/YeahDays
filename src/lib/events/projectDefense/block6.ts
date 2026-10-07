import { part, qx, tfx, type Lecture } from "../types";

export const block6: Lecture = {
  id: "pd-b6",
  title: { en: "Block 6 — Team and organization", ru: "Блок 6 — Команда и организация" },
  parts: [
    part(
      "pd-b6-p1",
      { en: "Roles, RACI and the resource calendar", ru: "Роли, RACI и календарь ресурсов" },
      {
        en: `## What we wrote
Section 15 (Staffing Management Plan): the team is **four students** and stays the same until the end of the project, so **no hiring or onboarding** is needed. Each member plans about **8 to 12 hours a week**, depending on the phase.
Until **5 October 2026** the work was **not formally divided**, and all code was committed **from one account**. Discussions, manual checks and report writing produce no commits, so they were not visible in the repository. On 5 October the project was split into **areas of responsibility** (Table 15), and from that date each member's contribution is visible on GitHub and in the time log.
| Member | Area | Main responsibilities |
|---|---|---|
| Ayat | Core of the product | gesture recognition (features, classifier, thresholds), the rule that turns recognition into a single command, the bridge to the operating system, the architecture; **mandatory reviewer** for this code |
| Yernar | Storage, build and checks | browser storage, export and import of gestures, Docker build and deployment, automated tests on GitHub |
| Akbota | Website and demonstration | landing page, brand graphics, project video, preparation of the demonstration, **the decision on a Windows version** |
| Aizat | Quality and documentation | accuracy study on real video, lighting study, README and user guide, risk register and time log |
Table 16 is the **responsibility assignment matrix (RACI)**: **R** responsible, **A** accountable, **C** consulted, **I** informed.
| Activity | Ayat | Yernar | Akbota | Aizat |
|---|---|---|---|---|
| Gesture recognition and bridge | A/R | C | I | C |
| Storage, build and deployment | A | R | I | I |
| Website and brand | C | C | A/R | I |
| Accuracy and lighting studies | A | I | C | R |
| User testing (30 users) | A | C | R | R |
| Risk register and time log | A | I | I | R |
| User guide | C | C | C | A/R |
| Final presentation and demo | A | C | R | C |
- Every row has **exactly one A**: Ayat in six rows, Akbota for «Website and brand», Aizat for «User guide».
- **User testing (30 users)** has **two R** — Akbota and Aizat, the owners of WBS 4.3.
- **No backups** are assigned, because the areas are largely independent. The weak point is the core: at present only Ayat knows this code in detail — risk **R-03** (P 3 × I 3 = 9, owner Ayat). Code reviews and written records of design decisions share this knowledge; no formal training is needed — each member studies the documentation of the tools in their own area.
- The team is **released after the final presentation on 4 November 2026**.
## The resource calendar
Table 17 (Section 16) gives the planned hours per week. The team works around the university timetable, mostly **in the evenings and at weekends**, so the figures are a plan, not a fixed timetable. Mind the column order: here Aizat comes before Akbota.
| Week | Dates | Ayat | Yernar | Aizat | Akbota | Main work |
|---|---|---|---|---|---|---|
| 1 | 1–6 Sep | 8 | 8 | 8 | 8 | requirements, gesture and command list |
| 2 | 7–13 Sep | 12 | 6 | 6 | 6 | system design, UI mockups |
| 3 | 14–20 Sep | 12 | 8 | 4 | 4 | hand tracking |
| 4 | 21–27 Sep | 8 | 12 | 4 | 4 | gesture training |
| 5 | 28 Sep–4 Oct | 8 | 12 | 6 | 4 | gesture training, prototype |
| 6 | 5–11 Oct | 8 | 12 | 10 | 4 | command mapping, accuracy study |
| 7 | 12–18 Oct | 6 | 6 | 10 | 6 | command mapping, lighting study |
| 8 | 19–25 Oct | 6 | 6 | 12 | 12 | all features ready, user testing |
| 9 | 26 Oct–1 Nov | 6 | 6 | 12 | 12 | user testing, bug fixing |
| 10 | 2–4 Nov | 6 | 4 | 4 | 4 | user guide, final demonstration |
| **Total** | | **80** | **80** | **76** | **64** | **300 hours** |
= 80 + 80 + 76 + 64 = 300 h
- Each person's peak follows their own work: **Ayat** 12 h in weeks 2–3 (design 2.1, hand tracking 3.1), **Yernar** 12 h in weeks 4–6 (gesture training 3.2, 19 Sep – 10 Oct), **Aizat** and **Akbota** 12 h in weeks 8–9 (user testing 4.3).
- Development ran ahead of the baseline (Section 11), so the hours of **weeks 6 and 7** go mainly to the **accuracy and lighting studies**.
- The weekly team totals (32, 30, 28, 28, 30, 34, 28, 36, 36, 18) are the same hours as in the time-phased cost baseline (Table 19).
- If a member expects less time in a week, for example **before an examination**, they tell the team at the check-in; the hours move to **another week** or, if the work cannot be postponed, to **the member closest to that area**.
- Other resources: **laptops with webcams** owned by the members — the desktop version is developed and tested on **Fedora Linux with GNOME (Wayland)**, the only system it has run on so far; the **webcams and the ring light** from Table 8, **from week 6**; **Railway** hosting and the **yeahtrack.site** domain; **GitHub** and **Telegram**; a **room at the university** for the testing sessions and the demonstration.
## The theory behind it
- **Organization** is one of Kerzner's nine planning components (L2): «design of the number and kinds of positions, along with corresponding duties and responsibilities». Table 15 is our answer to it.
- A detailed **project charter** (L2) also lists a **responsibility assignment matrix** and **resource requirements and man loading** — in our plan, these are Table 16 and Table 17.
- L5 defines **authority** (the power to make final decisions), **responsibility** (the obligation to perform an assignment) and **accountability**:
= Accountability = Authority + Responsibility
- In RACI terms, **R** holds the responsibility (does the work) and **A** holds the accountability (answers for the result). That is why a row may have two R but only one A.
- **Staffing** (L1): the project manager does not staff the project — staffing is a line responsibility. Our team of four is fixed for the whole project, so the staffing plan assigns areas instead of hiring.
- **Resource leveling** (L2) smooths the peaks and valleys of manpower, ideally without moving the end date. Moving hours to another week or member while 4 November stays fixed is leveling on a small scale.
> Four areas since 5 October, one A per activity, 300 planned hours (80 / 80 / 76 / 64) — and no backups, which is exactly why R-03 is open.
## How to say it at the defense
- **Say:** "On 5 October we divided the project into four areas, so each member's work is now visible on GitHub and in the time log."
- **Say:** "Our RACI matrix has exactly one accountable person per activity, while the responsible work is spread across all four of us."
- **Say:** "We planned 300 hours: 80 for Ayat, 80 for Yernar, 76 for Aizat and 64 for Akbota."
- **Say:** "Each person's peak weeks follow their own work package, for example Aizat and Akbota at 12 hours during user testing."
- **Say:** "We have no backups, so the concentrated knowledge of the core is our risk R-03, and we reduce it with reviews and written design decisions."
## Weak spots and honest answers
- **"All commits come from one account."** True until 5 October — do not deny it. Discussions, manual checks and report work leave no commits; since 5 October the areas, pull request review and the time log show each member's work, and the earlier weeks of the time log are being completed by each member.
- **"Ayat is accountable for almost everything — a bottleneck?"** Ayat is A in six of the eight rows as the owner of the system design, but the R work is spread over all four. The dependence on one person is recorded as R-03 (score 9) with a response: areas of responsibility, pull request review, decisions documented in the README.
- **"You say 8–12 hours a week, but Akbota has 4 hours in weeks 3–6."** The 8–12 hours is an approximate figure; the binding plan is Table 17, and it follows the phase — Akbota's work (website, demo, user testing) peaks at 12 hours in weeks 8–9.
## Check yourself
?? Who is R and who is A for the accuracy and lighting studies?
?= Aizat is R (does the studies) and Ayat is A; Akbota is C and Yernar is I.
?? Why do Aizat and Akbota both have 12 hours in weeks 8 and 9?
?= These are the weeks of user testing with 30 users and bug fixing (WBS 4.3, 20 Oct – 1 Nov), where both of them are R.`,
        ru: `## Что мы написали
Раздел 15 (Staffing Management Plan): команда — **четыре студента**, и состав не меняется до конца проекта, поэтому **ни найма, ни ввода новичков** не нужно. Каждый планирует примерно **8–12 часов в неделю** в зависимости от фазы.
До **5 октября 2026** работа **формально не делилась**, и весь код коммитился **с одного аккаунта**. Обсуждения, ручные проверки и подготовка отчётов коммитов не дают, поэтому в репозитории их видно не было. 5 октября проект разделили на **зоны ответственности** (Table 15), и с этой даты вклад каждого виден на GitHub и в журнале часов.
| Участник | Зона | Главные обязанности |
|---|---|---|
| Ayat | Core of the product (ядро продукта) | распознавание жестов (признаки, классификатор, пороги), правило «распознавание → одна команда», мост к операционной системе, архитектура; **обязательный ревьюер** этого кода |
| Yernar | Storage, build and checks (хранение, сборка, проверки) | хранение в браузере, экспорт и импорт жестов, сборка Docker и деплой, автотесты на GitHub |
| Akbota | Website and demonstration (сайт и демонстрация) | лендинг, фирменная графика, видео проекта, подготовка демонстрации, **решение о версии для Windows** |
| Aizat | Quality and documentation (качество и документация) | исследование точности на реальном видео, исследование освещения, README и руководство пользователя, реестр рисков и журнал часов |
Table 16 — **матрица ответственности (RACI)**: **R** — исполняет, **A** — отвечает за результат, **C** — консультирует, **I** — получает информацию.
| Работа | Ayat | Yernar | Akbota | Aizat |
|---|---|---|---|---|
| Gesture recognition and bridge | A/R | C | I | C |
| Storage, build and deployment | A | R | I | I |
| Website and brand | C | C | A/R | I |
| Accuracy and lighting studies | A | I | C | R |
| User testing (30 users) | A | C | R | R |
| Risk register and time log | A | I | I | R |
| User guide | C | C | C | A/R |
| Final presentation and demo | A | C | R | C |
- В каждой строке **ровно один A**: Ayat — в шести строках, Akbota — в «Website and brand», Aizat — в «User guide».
- У **User testing (30 users)** **два R** — Akbota и Aizat, владельцы WBS 4.3.
- **Дублёров нет**: зоны в основном независимы. Слабое место — ядро: сейчас этот код подробно знает только Ayat — это риск **R-03** (P 3 × I 3 = 9, владелец — Ayat). Знания распространяются через код-ревью и записанные решения по дизайну; формального обучения не нужно — каждый изучает документацию инструментов своей зоны.
- Команду **распускают после финальной презентации 4 ноября 2026**.
## Календарь ресурсов
Table 17 (раздел 16) — плановые часы по неделям. Команда работает, подстраиваясь под учебное расписание, в основном **по вечерам и в выходные**, поэтому цифры — план, а не жёсткий график. Обрати внимание на порядок столбцов: здесь Aizat стоит раньше Akbota.
| Неделя | Даты | Ayat | Yernar | Aizat | Akbota | Главная работа |
|---|---|---|---|---|---|---|
| 1 | 1–6 Sep | 8 | 8 | 8 | 8 | требования, список жестов и команд |
| 2 | 7–13 Sep | 12 | 6 | 6 | 6 | дизайн системы, макеты интерфейса |
| 3 | 14–20 Sep | 12 | 8 | 4 | 4 | отслеживание руки |
| 4 | 21–27 Sep | 8 | 12 | 4 | 4 | обучение жестам |
| 5 | 28 Sep–4 Oct | 8 | 12 | 6 | 4 | обучение жестам, прототип |
| 6 | 5–11 Oct | 8 | 12 | 10 | 4 | привязка команд, исследование точности |
| 7 | 12–18 Oct | 6 | 6 | 10 | 6 | привязка команд, исследование освещения |
| 8 | 19–25 Oct | 6 | 6 | 12 | 12 | все функции готовы, пользовательское тестирование |
| 9 | 26 Oct–1 Nov | 6 | 6 | 12 | 12 | пользовательское тестирование, исправление ошибок |
| 10 | 2–4 Nov | 6 | 4 | 4 | 4 | руководство пользователя, финальная демонстрация |
| **Итого** | | **80** | **80** | **76** | **64** | **300 часов** |
= 80 + 80 + 76 + 64 = 300 h
- Пик каждого совпадает с его работой: **Ayat** — 12 ч в неделях 2–3 (дизайн 2.1, отслеживание руки 3.1), **Yernar** — 12 ч в неделях 4–6 (обучение жестам 3.2, 19 Sep – 10 Oct), **Aizat** и **Akbota** — 12 ч в неделях 8–9 (пользовательское тестирование 4.3).
- Разработка опередила базовый план (раздел 11), поэтому часы **недель 6 и 7** идут в основном на **исследования точности и освещения**.
- Недельные суммы команды (32, 30, 28, 28, 30, 34, 28, 36, 36, 18) — те же часы, что в базовом плане затрат по времени (Table 19).
- Если у участника на неделе будет меньше времени, например **перед экзаменом**, он говорит об этом на check-in; часы переносят на **другую неделю**, а если работу нельзя отложить — **участнику, ближайшему к этой зоне**.
- Другие ресурсы: **ноутбуки с веб-камерами** самих участников — десктопная версия разрабатывается и тестируется на **Fedora Linux с GNOME (Wayland)**, единственной системе, где она пока запускалась; **веб-камеры и кольцевая лампа** из Table 8 — **с недели 6**; хостинг **Railway** и домен **yeahtrack.site**; **GitHub** и **Telegram**; **аудитория в университете** для сессий тестирования и демонстрации.
## Теория за этим
- **Organization** (организация) — один из девяти компонентов планирования у Kerzner (L2): «design of the number and kinds of positions, along with corresponding duties and responsibilities» — сколько и каких позиций и какие у них обязанности. Table 15 — наш ответ на это.
- Подробный **project charter** (L2) включает ещё **responsibility assignment matrix** и **resource requirements and man loading** — в нашем плане это Table 16 и Table 17.
- L5 определяет **authority** (право принимать окончательные решения), **responsibility** (обязанность выполнить задание) и **accountability** (подотчётность):
= Accountability = Authority + Responsibility
- В терминах RACI **R** несёт responsibility (делает работу), а **A** — accountability (отвечает за результат). Поэтому в строке может быть два R, но только один A.
- **Staffing** (L1): проектный менеджер не набирает людей сам — это ответственность линейных руководителей. Наша команда из четырёх человек зафиксирована на весь проект, поэтому план по персоналу распределяет зоны, а не нанимает.
- **Resource leveling** (L2) сглаживает пики и провалы загрузки, по возможности не сдвигая дату окончания. Перенос часов на другую неделю или другому участнику при неизменном 4 ноября — это выравнивание в малом масштабе.
> Четыре зоны с 5 октября, один A на каждую работу, 300 плановых часов (80 / 80 / 76 / 64) — и нет дублёров, именно поэтому открыт R-03.
## Как сказать на защите
- **Скажи:** «On 5 October we divided the project into four areas, so each member's work is now visible on GitHub and in the time log.» — 5 октября разделили проект на четыре зоны, теперь работа каждого видна на GitHub и в журнале часов.
- **Скажи:** «Our RACI matrix has exactly one accountable person per activity, while the responsible work is spread across all four of us.» — в RACI у каждой работы один A, а исполнение распределено на всех четверых.
- **Скажи:** «We planned 300 hours: 80 for Ayat, 80 for Yernar, 76 for Aizat and 64 for Akbota.» — запланировали 300 часов: 80, 80, 76 и 64.
- **Скажи:** «Each person's peak weeks follow their own work package, for example Aizat and Akbota at 12 hours during user testing.» — пиковые недели каждого совпадают с его пакетом работ.
- **Скажи:** «We have no backups, so the concentrated knowledge of the core is our risk R-03, and we reduce it with reviews and written design decisions.» — дублёров нет, поэтому знание ядра в одних руках — риск R-03, снижаем его ревью и записанными решениями.
## Слабые места и честные ответы
- **«All commits come from one account.»** (Все коммиты с одного аккаунта.) До 5 октября это правда — не отрицай. Обсуждения, ручные проверки и работа над отчётами коммитов не оставляют; с 5 октября зоны, ревью pull request и журнал часов показывают работу каждого, а записи за прошлые недели участники сейчас дополняют.
- **«Ayat is accountable for almost everything — a bottleneck?»** (Ayat отвечает почти за всё — узкое место?) Ayat — A в шести строках из восьми как владелец дизайна системы, но работа R распределена на всех четверых. Зависимость от одного человека записана как R-03 (score 9) с ответом: зоны ответственности, ревью pull request, решения записаны в README.
- **«You say 8–12 hours a week, but Akbota has 4 hours in weeks 3–6.»** (Говорите 8–12 часов, а у Akbota 4 часа в неделях 3–6.) 8–12 часов — приблизительная цифра; обязательный план — Table 17, и он следует фазам: работа Akbota (сайт, демо, тестирование) доходит до 12 часов в неделях 8–9.
## Проверь себя
?? Кто R и кто A в исследованиях точности и освещения?
?= Aizat — R (проводит исследования), Ayat — A; Akbota — C, Yernar — I.
?? Почему Aizat и Akbota планируют по 12 часов в неделях 8 и 9?
?= Это недели пользовательского тестирования с 30 участниками и исправления ошибок (WBS 4.3, 20 Oct – 1 Nov), где R — и Aizat, и Akbota.`,
      },
      [
        qx("Since which date does each YeahTrack member have a formal area of responsibility?", "5 October 2026", [
          ["1 September 2026", "1 September is the project start; until 5 October the work was not formally divided.", "1 сентября — старт проекта; до 5 октября работа формально не делилась."],
          ["3 October 2026", "3 October is CR-01, the removal of the workout mode, not the assignment of areas.", "3 октября — это CR-01, удаление режима тренировки, а не распределение зон."],
          ["20 October 2026", "20 October is M10 and the start of user testing; the areas were set more than two weeks earlier.", "20 октября — это M10 и начало пользовательского тестирования; зоны назначили больше чем на две недели раньше."],
        ], "Section 15: until 5 October 2026 the work was not formally divided; on that day the project was split into areas, so each member's contribution became visible on GitHub and in the time log.", "Раздел 15: до 5 октября 2026 работа формально не делилась; в этот день проект разделили на зоны, и вклад каждого стал виден на GitHub и в журнале часов."),
        qx("Which area of responsibility does Table 15 give to Yernar?", "Storage, build and checks", [
          ["Core of the product", "This is Ayat's area: recognition, the bridge to the system and the architecture.", "Это зона Ayat: распознавание, мост к системе и архитектура."],
          ["Website and demonstration", "This is Akbota's area: landing page, brand, project video and the demo.", "Это зона Akbota: лендинг, бренд, видео проекта и демонстрация."],
          ["Quality and documentation", "This is Aizat's area: the two studies, README and guide, risk register and time log.", "Эту зону ведёт Aizat: два исследования, README и руководство, реестр рисков и журнал часов."],
        ], "Table 15: Yernar owns storage, build and checks — browser storage, export and import of gestures, the Docker build and deployment, automated tests on GitHub.", "Table 15: у Yernar хранение, сборка и проверки — хранение в браузере, экспорт и импорт жестов, сборка Docker и деплой, автотесты на GitHub."),
        qx("Whose area in Table 15 includes the decision on a Windows version?", "Akbota", [
          ["Ayat", "Ayat owns the core and the architecture; the Windows decision is listed in another area.", "У Ayat ядро и архитектура; решение о Windows записано в другой зоне."],
          ["Yernar", "Yernar owns storage, build and deployment, not the Windows decision.", "У Yernar хранение, сборка и деплой, а не решение о Windows."],
          ["Aizat", "Aizat owns quality and documentation; the Windows decision is not in that area.", "Aizat ведёт качество и документацию; решения о Windows в этой зоне нет."],
        ], "Table 15 lists the decision on a Windows version under Akbota (website and demonstration); Akbota also owns risk R-06, the Windows promise on the website.", "Table 15 относит решение о версии для Windows к зоне Akbota (сайт и демонстрация); Akbota же — владелец риска R-06 про обещание Windows на сайте."),
        qx("In the RACI matrix (Table 16), what is Ayat's letter for ‘Website and brand’?", "C — consulted", [
          ["A — accountable", "The A for the website belongs to Akbota, who holds A/R in this row.", "A по сайту — у Akbota, в этой строке у Akbota A/R."],
          ["R — responsible", "The R for the website is also Akbota; Ayat does not do this work.", "R по сайту — тоже Akbota; Ayat эту работу не выполняет."],
          ["I — informed", "I is Aizat's letter in this row; Ayat is consulted, not just informed.", "I в этой строке получает Aizat; Ayat консультируют, а не просто информируют."],
        ], "Row ‘Website and brand’: Ayat C, Yernar C, Akbota A/R, Aizat I. It is one of only two rows (with the user guide) where Ayat is not A.", "Строка ‘Website and brand’: Ayat C, Yernar C, Akbota A/R, Aizat I. Это одна из двух строк (вторая — руководство пользователя), где Ayat не A."),
        tfx("In Table 16, every activity has exactly one A, and ‘User testing (30 users)’ has two R entries.", true,
          "True: each of the eight rows has one A (Ayat in six, Akbota for the website, Aizat for the user guide), and user testing has R for both Akbota and Aizat.",
          "Верно: в каждой из восьми строк один A (Ayat — в шести, Akbota — по сайту, Aizat — по руководству), а в пользовательском тестировании R — Akbota и Aizat.",
          "Answering ‘False’ misses the rule the matrix follows: several people may share R, but A stays with one person — user testing is A Ayat, R Akbota and Aizat.",
          "Ответ ‘False’ упускает правило матрицы: R могут делить несколько человек, но A — всегда один; в тестировании A — Ayat, R — Akbota и Aizat."),
        qx("How many hours does the resource calendar (Table 17) plan for Aizat in total?", "76 hours", [
          ["80 hours", "80 hours each are planned for Ayat and Yernar.", "По 80 часов запланировано у Ayat и Yernar."],
          ["64 hours", "64 hours is Akbota's total, the smallest of the four.", "64 часа — итог Akbota, самый маленький из четырёх."],
          ["75 hours", "75 would be an equal split of 300 hours; the plan is not split equally.", "75 — это ровное деление 300 часов; план делит часы не поровну."],
        ], "Table 17 totals: Ayat 80, Yernar 80, Aizat 76, Akbota 64 — 300 hours in all; the same hours appear in Table 9.", "Итоги Table 17: Ayat 80, Yernar 80, Aizat 76, Akbota 64 — всего 300 часов; те же часы стоят в Table 9."),
        qx("In which weeks do Aizat and Akbota both reach 12 planned hours?", "Weeks 8–9, user testing and bug fixing", [
          ["Weeks 6–7, accuracy and lighting studies", "In weeks 6–7 Aizat has 10 hours, and Akbota has 4 and then 6.", "В неделях 6–7 Aizat планирует по 10 часов, Akbota — 4 и затем 6."],
          ["Weeks 2–3, design and hand tracking", "Weeks 2–3 are Ayat's 12-hour weeks; Aizat and Akbota have 6 and then 4.", "Недели 2–3 — пиковые для Ayat (12 часов); Aizat и Akbota планируют 6, затем 4."],
          ["Weeks 4–5, gesture training", "Weeks 4–5 are Yernar's 12-hour weeks; Aizat and Akbota have 4 to 6 hours.", "Недели 4–5 — пиковые для Yernar (12 часов); Aizat и Akbota планируют от 4 до 6 часов."],
        ], "Weeks 8 (19–25 Oct) and 9 (26 Oct – 1 Nov) are user testing with 30 users and bug fixing (WBS 4.3), where Aizat and Akbota are both responsible.", "Недели 8 (19–25 Oct) и 9 (26 Oct – 1 Nov) — пользовательское тестирование с 30 участниками и исправление ошибок (WBS 4.3), где R — и Aizat, и Akbota."),
        qx("Yernar has 12 planned hours in weeks 4–6. Which work package explains that peak?", "3.2 Gesture training", [
          ["2.1 System design and UI mockups", "2.1 is Ayat's package and ends on 12 Sep, in week 2.", "2.1 — пакет Ayat, он заканчивается 12 Sep, во второй неделе."],
          ["4.3 User testing and bug fixing", "4.3 starts on 20 Oct (week 8) and belongs to Aizat and Akbota.", "4.3 начинается 20 Oct (неделя 8), его ведут Aizat и Akbota."],
          ["3.1 Hand tracking", "3.1 is Ayat's package in week 3, 12–19 Sep.", "3.1 — пакет Ayat в третьей неделе, 12–19 Sep."],
        ], "Yernar owns WBS 3.2 Gesture training (19 Sep – 10 Oct), which covers weeks 4–6: the calendar loads each person in the weeks of their own package (man loading).", "Yernar — владелец WBS 3.2 Gesture training (19 Sep – 10 Oct), это недели 4–6: календарь загружает каждого в недели его собственного пакета (man loading)."),
        qx("Why does the staffing plan assign no backups to the members?", "The areas are largely independent", [
          ["A fifth member joins in week 6", "The team is four students and stays unchanged until the end; nobody joins.", "Команда — четыре студента, и состав не меняется до конца; никто не присоединяется."],
          ["The instructor backs up the core code", "The instructor is the sponsor; the core-code weakness is handled inside the team as R-03.", "Преподаватель — спонсор; слабость с кодом ядра решается внутри команды как R-03."],
          ["The 10% reserve covers replacements", "The reserve is cash (5 191 KZT) for purchases, not people.", "Резерв — это деньги (5 191 KZT) на покупки, а не люди."],
        ], "Section 15: no backups, because the areas are largely independent; the main weakness is the core — only Ayat knows that code in detail (R-03).", "Раздел 15: дублёров нет, потому что зоны в основном независимы; главная слабость — ядро: этот код подробно знает только Ayat (R-03)."),
        qx("On which system has the desktop version been developed and run so far?", "Fedora Linux with GNOME (Wayland)", [
          ["Ubuntu Linux with KDE Plasma (X11)", "R-05: KDE and X11 do not provide the input interface the desktop version needs.", "R-05: KDE и X11 не дают интерфейса ввода, который нужен десктопной версии."],
          ["Windows 11 through an Electron build", "There is no Windows version; CR-05 (Electron or remove the promise) is still pending.", "Версии для Windows нет; CR-05 (Electron или убрать обещание) ещё не решён."],
          ["macOS on a MacBook", "macOS versions are outside the project scope.", "Версии для macOS вне рамок проекта."],
        ], "Section 16: the desktop version is developed and tested on Fedora Linux with GNOME (Wayland), currently the only system on which it has been run.", "Раздел 16: десктопная версия разрабатывается и тестируется на Fedora Linux с GNOME (Wayland) — пока это единственная система, где её запускали."),
        qx("Table 15 lists positions with their duties. Which of Kerzner's nine planning components (L2) is that?", "Organization: positions with their duties", [
          ["Procedure: a method for carrying out policy", "A procedure is a detailed method, like our seven change-control steps, not a list of positions.", "Procedure — подробный порядок действий, как наши семь шагов управления изменениями, а не список позиций."],
          ["Standard: an acceptable level of performance", "A standard is an acceptable level of performance, like the quality baseline.", "Standard — приемлемый уровень результата, как наш базовый план качества."],
          ["Forecast: what will happen by a set time", "A forecast projects the future; it does not assign duties to people.", "Forecast — прогноз будущего; он не распределяет обязанности между людьми."],
        ], "L2: Organization is the design of the number and kinds of positions, with corresponding duties and responsibilities — exactly what Table 15 records.", "L2: Organization — это состав и виды позиций с их обязанностями и ответственностью — ровно то, что записано в Table 15."),
        qx("Kerzner: accountability = authority + responsibility. Which RACI letter in Table 16 matches it?", "A — answers for the result and decides", [
          ["R — does the work, no final say", "R carries responsibility only: the obligation to perform the work.", "R несёт только responsibility — обязанность выполнить работу."],
          ["C — consulted before the decision", "C gives input; it holds neither the authority nor the accountability.", "C даёт мнение; у него нет ни authority, ни accountability."],
          ["I — informed after the decision is made", "I only receives information about the result.", "I только получает информацию о результате."],
        ], "L5: authority is the power to make final decisions, responsibility is the obligation to perform; together they make accountability — the A in RACI, one per activity.", "L5: authority — право принимать окончательные решения, responsibility — обязанность выполнить; вместе это accountability — буква A в RACI, одна на каждую работу."),
        qx("Before an exam, a member's hours move to another week or member, and 4 Nov stays fixed. Which L2 technique is this closest to?", "Resource leveling", [
          ["Resource allocation", "Resource allocation looks for the shortest critical path with fixed resources; we are not shortening the schedule.", "Resource allocation ищет самый короткий критический путь при фиксированных ресурсах; мы график не сокращаем."],
          ["Crashing", "Crashing adds resources to shorten the project; nobody is added and the end date does not move.", "Crashing добавляет ресурсы, чтобы сократить проект; никого не добавляют, и дата окончания не меняется."],
          ["Management reserve", "A management reserve is a budget (L4), not a way of moving hours between weeks.", "Management reserve — это бюджет (L4), а не способ переносить часы между неделями."],
        ], "Resource leveling smooths the period-to-period peaks and valleys of manpower, ideally without changing the end date — what the Section 16 rule does.", "Resource leveling сглаживает пики и провалы загрузки по периодам, по возможности не сдвигая дату окончания, — это и делает правило из раздела 16."),
        qx("Examiner: ‘All your commits come from one account. Did the others work at all?’ Which answer is best?", "Much work left no commits; since 5 Oct the time log shows it", [
          ["We all committed separately; GitHub just displays it wrongly", "This denies a fact in the report: all code was committed from one account.", "Это отрицание факта из отчёта: весь код коммитился с одного аккаунта."],
          ["Only Ayat worked; the others joined after the midterm", "False and unfair: the team was four from the start; their work was just not visible in commits.", "Неправда и несправедливо: команда с начала из четырёх; их работа просто не была видна в коммитах."],
          ["Commit history does not matter in project management", "This dodges the question; the plan itself treats invisible work as a problem it fixed on 5 Oct.", "Это уход от вопроса; сам план считает невидимую работу проблемой, которую исправили 5 октября."],
        ], "Section 15 admits it: until 5 October all code came from one account and work without commits was not visible; since then areas, PR review and the time log show each member's work.", "Раздел 15 это признаёт: до 5 октября весь код шёл с одного аккаунта, а работа без коммитов не была видна; с тех пор зоны, ревью PR и журнал часов показывают работу каждого."),
        qx("Examiner: ‘Ayat is A for six of eight activities. Isn't that a bottleneck?’ Which answer is best?", "Partly — it is risk R-03, reduced by reviews and README notes", [
          ["No — Ayat is accountable only for the core code, nothing else", "Table 16 shows Ayat as A in six rows, so this answer denies the matrix.", "Table 16 показывает Ayat как A в шести строках — этот ответ отрицает матрицу."],
          ["It does not matter, the project is too small for that", "Dismissing it contradicts the register, which gives R-03 the top score of 9.", "Отмахнуться — значит спорить с реестром, где у R-03 максимальный балл 9."],
          ["We will hire a second team lead right after the midterm defense", "The team stays unchanged until the end; no hiring is planned.", "Состав команды не меняется до конца; найма не планируется."],
        ], "Accountability sits with the lead who owns the system design, while R is spread across all four; the dependence is recorded as R-03 (P 3 × I 3 = 9, owner Ayat) with areas, PR review and README as the response.", "Accountability — у лида, владельца дизайна системы, а R распределены на всех четверых; зависимость записана как R-03 (P 3 × I 3 = 9, владелец — Ayat), ответ — зоны, ревью PR и README."),
      ],
    ),
    part(
      "pd-b6-p2",
      { en: "Structure, communication and group behaviour", ru: "Структура, коммуникации и поведение группы" },
      {
        en: `## What we wrote
Section 2: the project follows an **iterative Agile approach based on Scrum** — a working version is produced, reviewed by the team, and the next steps are planned from that review; the overall planning and control follow the **PMBOK Guide**. Day-to-day communication happens in a **Telegram group**, while the code, the tasks and the change records are kept on **GitHub**. **No member may change the scope alone** — every change follows the procedure of Section 6.
| Channel | What lives there | Rule |
|---|---|---|
| Telegram | daily updates, questions, quick decisions, urgent issues | a minor change is approved by the area owner and Ayat, usually the same day |
| GitHub | code, task cards, change requests (label «change request»), pull request reviews, docs/RISKS.md, docs/HOURS.md | every record tied to a specific piece of work; a closed change gets a summary and a line in the change log (Table 5) |
Section 7 (Communications Management Plan) adds **regular check-ins** that compare progress with the milestones and, **since 5 October**, a **weekly meeting** that reviews the task cards, the risk register and the time log (Table 6).
| Communication | Frequency | Format | Participants | Owner |
|---|---|---|---|---|
| Progress check-in | every 1–2 days | Telegram or call | whole team | Ayat |
| Weekly meeting | weekly (from 5 Oct) | call or meeting | whole team | Ayat |
| Pull request review | every change (from 5 Oct) | GitHub | author and reviewer | Ayat for core code |
| Milestone review | at each milestone | team call | whole team | Ayat |
| Testing feedback | during testing | Telegram and shared document | Aizat, Akbota | Aizat |
| Report to the instructor | at each deliverable | written report and presentation | whole team, instructor | Ayat |
- **Urgent matters** — an issue that affects a deadline or the work of another member — are posted in the Telegram group **the same day**, not postponed until the next check-in.
- If an urgent issue **cannot be resolved within the team**, it is **raised with the course instructor**.
- Decisions on changes (Section 6): minor — the area owner and Ayat; major — all four members, at the next check-in or weekly meeting; no agreement — **Ayat, as the owner of the system design, makes the final decision**.
## From informal to formal roles
- **1 Sep – 4 Oct:** the work was **not formally divided**, and all code was committed **from one account**, directly to the **main branch**.
- **5 Oct** — CR-03 and milestone **M7 «Process controls in place»**: areas of responsibility (Table 15), task cards, **pull request review** by a second member, the **risk register** (docs/RISKS.md) and the **time log** (docs/HOURS.md; meetings included, because commits do not show them).
- **4 Nov:** the final presentation; after it the team is **released**.
## The theory behind it
@diagram pm-org-structures
| Structure (L5) | Who directs the people | YeahTrack |
|---|---|---|
| Functional (traditional) | functional managers; each person has one boss in a department | no — there are no functional managers |
| Line-staff | a project coordinator without line authority | no — the team lead has the final word on design |
| Pure product (projectized) | the program manager has complete line authority over the project | **closest** — four members work only on the project |
| Matrix (strong, weak, balanced) | a project manager **and** a functional manager — two bosses | no — nobody reports to a second boss |
- Inside the course YeahTrack is a small **pure project (projectized) team**: all four work only on project tasks, there are **no functional managers**, **Ayat is the team lead** with the final word on system design (the tie-break in change control), and the **instructor is the sponsor and customer**. The work is iterative and Scrum-like.
- It is **not a matrix**: in a matrix a person reports to a project manager and to a functional manager; here nobody has a second, functional boss.
- **Interface management** (L1): the project manager manages relationships within the team and between the team and the customer. Table 6 covers both — check-ins, meetings and reviews inside, the report to the instructor outside.
- **Formal and informal groups** (L4): in an informal group, roles and norms **emerge from within**; in a formal group they are **established by the managerial process**. Our roles were informal until 5 October and formal from that day.
| Tuckman stage (L4) | What it means | YeahTrack |
|---|---|---|
| Forming / storming | getting acquainted; arguing and experimenting with roles | 1 Sep – 4 Oct: work not formally divided, all code from one account, informal roles |
| Norming | group-driven expectations, the beginning of cohesiveness | 5 Oct: areas, PR review, risk register, time log |
| Performing | structure, hierarchy and norms in place; focus on the goals | the goal now |
| Adjourning | the group prepares to disband | release after 4 Nov |
- **Role conflict** (L4): two roles demand the same time — a student before an examination and a team member. The plan handles it: say so at the check-in and move the hours (Section 16).
- The **punctuated equilibrium model** (L4) tells the same story in three phases with a turning point in the middle, when the group changes how it works; 5 October, the midterm, fits that turning point.
> Projectized team inside the course: Ayat leads, nobody has a second boss; talk in Telegram, record on GitHub, escalate to the instructor; on 5 October informal roles became formal — storming → norming.
## How to say it at the defense
- **Say:** "Inside the course we are a small projectized team: all four of us work only on this project, and there are no functional managers."
- **Say:** "We are not a matrix, because nobody reports to a second, functional boss."
- **Say:** "We discuss in Telegram, but every change to the project is recorded on GitHub and in the change log."
- **Say:** "Urgent issues are posted the same day, and if we cannot solve them inside the team, we raise them with the instructor."
- **Say:** "On 5 October our informal roles became formal, which moved us from storming to norming; our goal now is performing."
## Weak spots and honest answers
- **"Telegram decisions leave no trace."** Quick talk does happen in Telegram, and a minor change is approved there; but each change starts as a GitHub issue, is closed with a summary and is added to the change log (Table 5).
- **"Why were the roles formalised only at the midterm?"** Admit it: for the first month the work was informal and all code came from one account. The team fixed it on 5 October through CR-03 and M7; since then each person's work is visible.
- **"Is a student team really projectized?"** Only inside the course and only as the closest model: project-only work, no functional managers, a team lead with the final word on design, the instructor as sponsor. We do not claim the full line authority of a company program manager.
## Check yourself
?? Why is the YeahTrack team not a matrix organization?
?= Nobody reports to a second, functional boss: all four work only on the project, there are no functional managers, Ayat is the team lead and the instructor is the sponsor.
?? Which Tuckman stage began on 5 October, and what marks it?
?= Norming: areas of responsibility, pull request review, the risk register and the time log (CR-03, M7). The goal now is performing; adjourning comes after 4 November.`,
        ru: `## Что мы написали
Раздел 2: проект идёт по **итеративному Agile-подходу на принципах Scrum** — делаем рабочую версию, команда её смотрит, и по итогам планируются следующие шаги; общая структура планирования и контроля — по **PMBOK Guide**. Повседневное общение — в **группе Telegram**, а код, задачи и записи об изменениях хранятся на **GitHub**. **Никто не может менять рамки проекта в одиночку** — каждое изменение идёт по процедуре раздела 6.
| Канал | Что там живёт | Правило |
|---|---|---|
| Telegram | ежедневные новости, вопросы, быстрые решения, срочные проблемы | мелкое изменение одобряют владелец зоны и Ayat, обычно в тот же день |
| GitHub | код, карточки задач, запросы на изменение (метка «change request»), ревью pull request, docs/RISKS.md, docs/HOURS.md | любая запись, связанная с конкретной работой; закрытое изменение получает итог и строку в журнале изменений (Table 5) |
Раздел 7 (Communications Management Plan) добавляет **регулярные check-in**, где прогресс сверяют с вехами, и **с 5 октября** — **еженедельную встречу**, на которой смотрят карточки задач, реестр рисков и журнал часов (Table 6).
| Коммуникация | Частота | Формат | Участники | Владелец |
|---|---|---|---|---|
| Progress check-in | каждые 1–2 дня | Telegram или звонок | вся команда | Ayat |
| Weekly meeting | раз в неделю (с 5 Oct) | звонок или встреча | вся команда | Ayat |
| Pull request review | каждое изменение (с 5 Oct) | GitHub | автор и ревьюер | Ayat — по коду ядра |
| Milestone review | на каждой вехе | созвон команды | вся команда | Ayat |
| Testing feedback | во время тестирования | Telegram и общий документ | Aizat, Akbota | Aizat |
| Report to the instructor | на каждом результате | письменный отчёт и презентация | вся команда, преподаватель | Ayat |
- **Срочные вопросы** — проблема, которая угрожает сроку или работе другого участника, — публикуются в группе Telegram **в тот же день**, а не откладываются до следующего check-in.
- Если срочную проблему **не удаётся решить внутри команды**, её **поднимают перед преподавателем курса**.
- Решения по изменениям (раздел 6): мелкое — владелец зоны и Ayat; крупное — все четверо, на ближайшем check-in или еженедельной встрече; нет согласия — **окончательно решает Ayat как владелец дизайна системы**.
## От неформальных ролей к формальным
- **1 Sep – 4 Oct:** работа **формально не делилась**, и весь код коммитился **с одного аккаунта**, прямо в **основную ветку**.
- **5 Oct** — CR-03 и веха **M7 «Process controls in place»**: зоны ответственности (Table 15), карточки задач, **ревью pull request** вторым участником, **реестр рисков** (docs/RISKS.md) и **журнал часов** (docs/HOURS.md; встречи тоже записываются, потому что коммиты их не показывают).
- **4 Nov:** финальная презентация; после неё команду **распускают**.
## Теория за этим
@diagram pm-org-structures
| Структура (L5) | Кто руководит людьми | YeahTrack |
|---|---|---|
| Functional (функциональная) | функциональные руководители; у каждого один начальник в отделе | нет — функциональных руководителей нет |
| Line-staff (линейно-штабная) | координатор проекта без линейных полномочий | нет — у лида последнее слово по дизайну |
| Pure product (projectized, проектная) | у руководителя программы полные линейные полномочия по проекту | **ближе всего** — все четверо работают только на проект |
| Matrix (сильная, слабая, сбалансированная) | менеджер проекта **и** функциональный руководитель — два начальника | нет — второго начальника нет ни у кого |
- Внутри курса YeahTrack — небольшая **проектная (projectized) команда**: все четверо работают только над задачами проекта, **функциональных руководителей нет**, **Ayat — лид** с последним словом по дизайну системы (решающий голос в управлении изменениями), а **преподаватель — спонсор и заказчик**. Работа итеративная, в духе Scrum.
- Это **не матрица**: в матрице человек подчиняется и менеджеру проекта, и функциональному руководителю; здесь второго, функционального начальника нет ни у кого.
- **Interface management** (L1): менеджер проекта управляет отношениями внутри команды и между командой и заказчиком. Table 6 покрывает оба — check-in, встречи и ревью внутри, отчёт преподавателю наружу.
- **Формальные и неформальные группы** (L4): в неформальной группе роли и нормы **возникают изнутри**; в формальной их **задаёт управленческое решение**. Наши роли были неформальными до 5 октября и стали формальными в этот день.
| Стадия Tuckman (L4) | Что она значит | YeahTrack |
|---|---|---|
| Forming / storming | знакомство; споры и пробы ролей | 1 Sep – 4 Oct: работа формально не делилась, весь код с одного аккаунта, роли неформальные |
| Norming | общие ожидания группы, начало сплочённости | 5 Oct: зоны, ревью PR, реестр рисков, журнал часов |
| Performing | структура, иерархия и нормы на месте; фокус на целях | цель сейчас |
| Adjourning | группа готовится к роспуску | роспуск после 4 Nov |
- **Ролевой конфликт** (L4): две роли требуют одного и того же времени — студент перед экзаменом и участник команды. План это учитывает: сказать на check-in и перенести часы (раздел 16).
- **Модель прерывистого равновесия** (punctuated equilibrium, L4) рассказывает ту же историю в трёх фазах с поворотной точкой посередине, когда группа меняет способ работы; 5 октября, мидтерм, подходит на роль этой точки.
> Проектная команда внутри курса: ведёт Ayat, второго начальника ни у кого нет; обсуждаем в Telegram, записываем на GitHub, поднимаем к преподавателю; 5 октября неформальные роли стали формальными — storming → norming.
## Как сказать на защите
- **Скажи:** «Inside the course we are a small projectized team: all four of us work only on this project, and there are no functional managers.» — внутри курса мы небольшая проектная команда: все четверо только на проекте, функциональных руководителей нет.
- **Скажи:** «We are not a matrix, because nobody reports to a second, functional boss.» — мы не матрица: второго, функционального начальника нет ни у кого.
- **Скажи:** «We discuss in Telegram, but every change to the project is recorded on GitHub and in the change log.» — обсуждаем в Telegram, но каждое изменение записано на GitHub и в журнале изменений.
- **Скажи:** «Urgent issues are posted the same day, and if we cannot solve them inside the team, we raise them with the instructor.» — срочное публикуем в тот же день, а что не решили сами — поднимаем к преподавателю.
- **Скажи:** «On 5 October our informal roles became formal, which moved us from storming to norming; our goal now is performing.» — 5 октября роли стали формальными: от storming к norming; цель сейчас — performing.
## Слабые места и честные ответы
- **«Telegram decisions leave no trace.»** (Решения в Telegram не оставляют следа.) Быстрые обсуждения действительно идут в Telegram, и мелкое изменение там одобряют; но каждое изменение начинается как issue на GitHub, закрывается с итогом и попадает в журнал изменений (Table 5).
- **«Why were the roles formalised only at the midterm?»** (Почему роли оформили только к мидтерму?) Признай: первый месяц работа шла неформально, и весь код шёл с одного аккаунта. Команда исправила это 5 октября через CR-03 и M7; с тех пор работа каждого видна.
- **«Is a student team really projectized?»** (Студенческая команда — правда проектная структура?) Только внутри курса и только как ближайшая модель: работа только на проект, нет функциональных руководителей, у лида последнее слово по дизайну, преподаватель — спонсор. Полных линейных полномочий руководителя программы в компании мы не заявляем.
## Проверь себя
?? Почему команда YeahTrack — не матричная организация?
?= Второго, функционального начальника нет ни у кого: все четверо работают только на проект, функциональных руководителей нет, Ayat — лид, преподаватель — спонсор.
?? Какая стадия по Tuckman началась 5 октября и что её отмечает?
?= Norming: зоны ответственности, ревью pull request, реестр рисков и журнал часов (CR-03, M7). Цель сейчас — performing; adjourning наступит после 4 ноября.`,
      },
      [
        qx("How often does the progress check-in take place, according to Table 6?", "Every 1–2 days", [
          ["Weekly, from 5 October", "That is the weekly meeting, which reviews the task cards, risks and hours.", "Это еженедельная встреча, где смотрят карточки задач, риски и часы."],
          ["At each milestone", "That is the milestone review, a team call at each milestone.", "Это milestone review — созвон команды на каждой вехе."],
          ["Every 3–4 days", "Table 6 gives a shorter cycle for check-ins: every 1–2 days.", "Table 6 даёт для check-in более короткий цикл — каждые 1–2 дня."],
        ], "Table 6: progress check-in — every 1–2 days, in Telegram or by call, whole team, owner Ayat.", "Table 6: progress check-in — каждые 1–2 дня, в Telegram или звонком, вся команда, владелец — Ayat."),
        qx("Which communication activity in Table 6 is NOT owned by Ayat?", "Testing feedback", [
          ["Weekly meeting", "Ayat owns the weekly meeting held since 5 October.", "Еженедельную встречу с 5 октября ведёт Ayat."],
          ["Milestone review", "Ayat owns the milestone review at each milestone.", "Milestone review на каждой вехе ведёт Ayat."],
          ["Report to the instructor", "Ayat owns the report to the instructor at each deliverable.", "Отчёт преподавателю на каждом результате ведёт Ayat."],
        ], "Testing feedback (during testing, Telegram and a shared document, Aizat and Akbota) is owned by Aizat; Ayat owns the other five activities.", "Testing feedback (во время тестирования, Telegram и общий документ, Aizat и Akbota) ведёт Aizat; остальные пять — Ayat."),
        qx("What does the weekly meeting review since 5 October?", "Task cards, risk register and time log", [
          ["Pull requests, the budget and the receipts", "Pull requests are reviewed on GitHub for every change; receipts are stored in the repository.", "Pull request смотрят на GitHub при каждом изменении; чеки хранятся в репозитории."],
          ["The Gantt chart, milestones and test results", "Progress against milestones is the check-in's job; test results come during testing.", "Сверка с вехами — задача check-in; результаты тестов появляются во время тестирования."],
          ["The website, brand and demo video", "That is Akbota's area of work, not the agenda of the weekly meeting.", "Это зона работы Akbota, а не повестка еженедельной встречи."],
        ], "Section 7: since 5 October a weekly meeting reviews the task cards, the risk register and the time log.", "Раздел 7: с 5 октября еженедельная встреча смотрит карточки задач, реестр рисков и журнал часов."),
        qx("An issue threatens a deadline. What does the communication plan say to do with it?", "Post it in Telegram the same day", [
          ["Wait for the weekly meeting", "Urgent matters are not postponed until the next check-in or meeting.", "Срочное не откладывают до следующего check-in или встречи."],
          ["Write to the instructor straight away", "The instructor is the next step only if the team cannot resolve the issue itself.", "К преподавателю идут только тогда, когда команда не может решить проблему сама."],
          ["Open a change request and wait two days", "Two days is the impact assessment in change control; urgent issues are posted the same day.", "Два дня — это оценка влияния в управлении изменениями; срочное публикуют в тот же день."],
        ], "Section 7: urgent matters — an issue that affects a deadline or another member's work — are posted in the Telegram group on the same day and not postponed until the next check-in.", "Раздел 7: срочное — проблема, которая угрожает сроку или работе другого участника, — публикуется в группе Telegram в тот же день и не откладывается до следующего check-in."),
        qx("If the team cannot resolve an urgent issue itself, who is it raised with?", "The course instructor", [
          ["Ayat, as team lead", "Ayat is inside the team; the plan escalates outside the team.", "Ayat внутри команды; план поднимает вопрос за её пределы."],
          ["All four by majority vote", "Voting stays inside the team, and the plan has no majority rule at all.", "Голосование остаётся внутри команды, и правила большинства в плане вообще нет."],
          ["The owner of the affected area", "The area owner is inside the team and is already involved in the issue.", "Владелец зоны — внутри команды и уже участвует в проблеме."],
        ], "Section 7: if an urgent issue cannot be resolved within the team, it is raised with the course instructor — who is also the sponsor and customer.", "Раздел 7: если срочную проблему не решить внутри команды, её поднимают перед преподавателем курса — он же спонсор и заказчик."),
        qx("Where are YeahTrack's task cards and change requests kept?", "In GitHub issues", [
          ["In the Telegram group", "Telegram is for talk and quick decisions; records tied to a piece of work live on GitHub.", "Telegram — для общения и быстрых решений; записи о конкретной работе живут на GitHub."],
          ["In docs/HOURS.md", "docs/HOURS.md is the time log, not the task cards.", "docs/HOURS.md — журнал часов, а не карточки задач."],
          ["In the shared test spreadsheet", "The shared spreadsheet holds the test results.", "В общей таблице лежат результаты тестов."],
        ], "Sections 2 and 6: code, tasks and change records are kept on GitHub; a change request is a GitHub issue with the label ‘change request’.", "Разделы 2 и 6: код, задачи и записи об изменениях хранятся на GitHub; запрос на изменение — это issue на GitHub с меткой ‘change request’."),
        qx("Which change request introduced task cards, PR review, the risk register and the time log?", "CR-03, approved on 5 Oct", [
          ["CR-01, approved on 3 Oct", "CR-01 removed the workout mode and the other experimental modes.", "CR-01 убрал режим тренировки и другие экспериментальные режимы."],
          ["CR-04, approved on 5 Oct", "CR-04 added the accuracy and lighting studies (4.1, 4.2; M8, M9).", "CR-04 добавил исследования точности и освещения (4.1, 4.2; M8, M9)."],
          ["CR-05, still pending", "CR-05 is the open Windows decision (R-06).", "CR-05 — открытое решение о Windows (R-06)."],
        ], "Table 5: CR-03, 5 Oct — introduction of task cards, pull request review, a risk register and a time log (M7); major, approved.", "Table 5: CR-03, 5 Oct — введение карточек задач, ревью pull request, реестра рисков и журнала часов (M7); крупное, одобрено."),
        qx("The four members cannot agree on a major change. Who makes the final decision?", "Ayat, owner of the system design", [
          ["The instructor, as the sponsor", "Escalation to the instructor is for urgent issues; change control ends with Ayat's tie-break.", "К преподавателю поднимают срочные проблемы; управление изменениями заканчивается решающим голосом Ayat."],
          ["Three of four members by majority", "A major change needs all four; the plan has no majority rule.", "Крупному изменению нужны все четверо; правила большинства в плане нет."],
          ["The owner of the affected area", "The area owner assesses the impact and approves minor changes with Ayat.", "Владелец зоны оценивает влияние и одобряет мелкие изменения вместе с Ayat."],
        ], "Section 6, Step 4: a major change needs all four members; if they cannot agree, Ayat, as the owner of the system design, makes the final decision.", "Раздел 6, шаг 4: крупному изменению нужны все четверо; если согласия нет, окончательно решает Ayat как владелец дизайна системы."),
        tfx("Until 5 October, every change to YeahTrack was merged through a reviewed pull request.", false,
          "False: until 5 October 2026 changes were committed directly to the main branch; review of every pull request by a second member started on 5 October (CR-03, M7).",
          "Неверно: до 5 октября 2026 изменения коммитились прямо в основную ветку; ревью каждого pull request вторым участником началось 5 октября (CR-03, M7).",
          "Answering ‘True’ ignores Section 12.1: pull request review is one of the controls added on 5 October, not something that existed from the start.",
          "Ответ ‘True’ игнорирует раздел 12.1: ревью pull request — одна из мер, добавленных 5 октября, а не то, что было с самого начала."),
        qx("Inside the course, which L5 organizational structure is the YeahTrack team closest to?", "Pure product (projectized)", [
          ["Functional (traditional)", "There are no functional managers or departments; the four work only on the project.", "Функциональных руководителей и отделов нет; четверо работают только на проект."],
          ["Balanced matrix", "A matrix needs a second, functional boss; nobody in the team has one.", "Матрице нужен второй, функциональный начальник; его нет ни у кого в команде."],
          ["Line-staff with a coordinator", "The lead is not just a coordinator: Ayat has the final word on system design.", "Лид — не просто координатор: у Ayat последнее слово по дизайну системы."],
        ], "Four members work only on project tasks, a team lead with the final word on design, no functional managers, the instructor as sponsor and customer — a small pure project team.", "Четверо работают только над задачами проекта, у лида последнее слово по дизайну, функциональных руководителей нет, преподаватель — спонсор и заказчик: небольшая проектная команда."),
        qx("Why is the YeahTrack team NOT a matrix organization?", "Nobody reports to a second, functional boss", [
          ["Ayat has no authority over any decision", "Wrong: Ayat breaks ties in change control and has the final word on design.", "Неверно: у Ayat решающий голос в управлении изменениями и последнее слово по дизайну."],
          ["Scrum teams are not allowed to use a matrix", "Scrum says nothing about the organizational form; the reason is the reporting line.", "Scrum ничего не говорит об организационной форме; причина — в линии подчинения."],
          ["A matrix only works in companies over 100 people", "L5 gives no size limit; it even describes matrices that work best for small companies.", "L5 не ставит порога по размеру; там даже описаны матрицы, которые лучше работают в небольших компаниях."],
        ], "In a matrix a person reports vertically to a line manager and horizontally to a project manager; in YeahTrack nobody has a second, functional boss.", "В матрице человек подчиняется по вертикали линейному руководителю и по горизонтали менеджеру проекта; в YeahTrack второго, функционального начальника нет ни у кого."),
        qx("In Tuckman's model, which stage did the YeahTrack team enter on 5 October?", "Norming", [
          ["Forming", "Forming is the getting-acquainted start; for YeahTrack it is the informal period from 1 Sep.", "Forming — это знакомство; для YeahTrack это неформальный период с 1 Sep."],
          ["Performing", "Performing is the goal now; on 5 October the norms were only being set.", "Performing — цель сейчас; 5 октября нормы только устанавливались."],
          ["Adjourning", "Adjourning is the release of the team after 4 November.", "Adjourning — роспуск команды после 4 ноября."],
        ], "On 5 October areas, PR review, the risk register and the time log were introduced — group-driven expectations, the start of norming; the goal now is performing.", "5 октября ввели зоны, ревью PR, реестр рисков и журнал часов — общие ожидания группы, начало norming; цель сейчас — performing."),
        qx("Until 5 October, YeahTrack's roles emerged from within the team. In L4 terms, what kind of roles were they?", "Informal, emerging from within the group", [
          ["Formal, set by a managerial decision", "That describes the roles from 5 October, when Table 15 set them.", "Так описываются роли с 5 октября, когда их закрепила Table 15."],
          ["Command-group roles set by the instructor", "The instructor is the sponsor; the early roles were not assigned from outside.", "Преподаватель — спонсор; ранние роли не назначались извне."],
          ["Friendship-group roles outside the project", "The roles were about project work toward a stated goal, not about friendship.", "Роли касались работы над проектом с заданной целью, а не дружбы."],
        ], "L4: in an informal group, structure and roles emerge from within; in a formal group they are established by the managerial process. On 5 October the roles became formal (Table 15).", "L4: в неформальной группе структура и роли возникают изнутри; в формальной их задаёт управленческое решение. 5 октября роли стали формальными (Table 15)."),
        qx("Examiner: ‘You decide things in Telegram. How can anyone trace a decision?’ Which answer is best?", "Every change is a GitHub issue, closed and logged in Table 5", [
          ["Our Telegram chat history is the official record of the project", "The plan keeps records on GitHub; Telegram is for talk and quick decisions.", "По плану записи хранятся на GitHub; Telegram — для общения и быстрых решений."],
          ["Decisions are rare, so there is nothing to trace", "Dismissive, and the change log already lists five change requests.", "Это отмахивание, а в журнале изменений уже пять запросов."],
          ["Only Ayat decides, so no written record is needed", "Wrong twice: minor changes need the area owner and Ayat, major ones all four, and every change is logged.", "Дважды неверно: мелкие изменения одобряют владелец зоны и Ayat, крупные — все четверо, и каждое изменение записывается."],
        ], "Section 6: a change starts as a GitHub issue labelled ‘change request’; after the decision it is announced in Telegram, the issue is closed with a summary and the change goes into the change log (Table 5).", "Раздел 6: изменение начинается как issue на GitHub с меткой ‘change request’; после решения его объявляют в Telegram, issue закрывают с итогом, а изменение попадает в журнал (Table 5)."),
        qx("Examiner: ‘Why did your team formalise its roles only at the midterm?’ Which answer is best?", "We admit it and fixed it on 5 Oct with CR-03 and M7", [
          ["Our roles were always formal; the report is simply wrong", "This denies Section 15, which says the work was not formally divided until 5 October.", "Это отрицает раздел 15, где сказано, что до 5 октября работа формально не делилась."],
          ["Formal roles are not needed in a Scrum-like team", "Dodging: the team itself made formal areas a major change (CR-03).", "Уход от ответа: команда сама оформила зоны как крупное изменение (CR-03)."],
          ["It was Ayat's fault for keeping all the code in one account", "Blaming one member; the plan treats it as a team issue and records the risk as R-03.", "Обвинение одного участника; план считает это проблемой команды и записывает риск как R-03."],
        ], "Honest answer: the first month was informal and all code came from one account; on 5 October CR-03 and M7 introduced areas, PR review, the risk register and the time log.", "Честный ответ: первый месяц шёл неформально, и весь код был с одного аккаунта; 5 октября CR-03 и M7 ввели зоны, ревью PR, реестр рисков и журнал часов."),
      ],
    ),
  ],
};
