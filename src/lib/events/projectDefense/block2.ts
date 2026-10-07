import { part, qx, tfx, type Lecture } from "../types";

export const block2: Lecture = {
  id: "pd-b2",
  title: { en: "Block 2 — Scope and change control", ru: "Блок 2 — Объём работ и управление изменениями" },
  parts: [
    part(
      "pd-b2-p1",
      { en: "Scope: included, excluded, acceptance", ru: "Объём работ: что входит, что не входит, приёмка" },
      {
        en: `## What we wrote
Section 3 fixes the **project scope**: the development, testing and documentation of YeahTrack from **1 September to 4 November 2026**. Two lists draw the boundary, and the same lists are used to assess **every change request** (Sections 6 and 10).
| Included (8 items) | Not included (6 items) |
|---|---|
| Hand detection through the laptop webcam | Mobile and macOS versions |
| Recording and training of user-defined gestures, both static poses and motions | A Windows version at this stage — the decision is pending (risk R-06) |
| Directional swipes: left, right, up and down | The workout assistance mode, removed on 3 October 2026 (CR-01) |
| Linking gestures to commands: system actions, key combinations, websites and programs | Special hardware such as depth cameras, sensors or gloves |
| A settings panel to add, rename, re-record and delete gestures | Two-hand gestures and sign language |
| A desktop version for Linux with GNOME (Wayland) | Voice control and cloud storage |
| A browser version at yeahtrack.site/app | – |
| A project website, a user guide and test results | – |
The lists rest on **Section 1.4**. **Goal:** a working application in which users train their own gestures and link them to computer commands by **4 November 2026**. **Objectives:** at least **90%** accuracy on user-trained gestures, a new gesture in **under one minute**, testing with at least **30 users**. **Deliverables:** a Linux (GNOME) desktop application and a browser version, a short user guide, test results and the final presentation.
![The ‘New gesture’ form (Figure 3, interface in Russian): a name, the type — pose or motion, the recording length (30 s here) and the command, here ‘close tab’; the side panel shows the two modes kept after CR-01 — gesture mode and the gesture trainer](/events/pm/yeahtrack-new-gesture.webp)
## Scope management: four processes
Section 10 splits scope management into four processes (PMI, 2021). **Ayat**, as the owner of the system design, is responsible for scope management; each area owner is responsible for the scope of their own area.
| Process | What YeahTrack does |
|---|---|
| Scope definition (10.1) | Goal, objectives, deliverables (1.4) and the two lists (Section 3) are the reference against which every new request is compared |
| Work breakdown (10.2) | Deliverables are decomposed into WBS packages (Table 3); each has a code, a responsible person, start and end dates and a GitHub task card |
| Scope verification (10.3) | Deliverables are checked against the acceptance criteria (Table 10) at milestone reviews; the sponsor confirms the final acceptance (Section 19) |
| Scope control (10.4) | Every addition or removal goes through the change procedure (Section 6); a major change needs all four members |
- A work package is **complete** when its task card is closed and the related code has been **merged after review**.
- A request from the **excluded list** — two-hand gestures or a mobile version, for example — is **rejected unless it is approved as a major change**.
- At each **weekly meeting** the team checks the open task cards for work not covered by the WBS; such work is **stopped or submitted as a change request**.
- Before the final presentation, all deliverables are checked against the acceptance criteria and the scope lists **once more**.
## Acceptance criteria (Table 10)
| Deliverable | Acceptance criteria | Accepted by |
|---|---|---|
| Desktop application (Linux, GNOME) | Records a new gesture in under one minute; recognises user-trained gestures with at least 90% accuracy in the user test; executes the assigned command; passes all automated tests | Whole team, then the sponsor |
| Browser version | Opens at yeahtrack.site/app on a computer with a camera; records and recognises gestures; explains that it cannot control the system | Ayat, Akbota |
| User guide | A new user can install the application and set up one gesture by following the guide without help | Aizat, then two test users |
| Test results | Contain the accuracy study, the lighting study and the test with 30 users, compared with the quality baseline (Section 18) | Aizat, Ayat |
| Final presentation | Covers the objectives, results and lessons; includes a live or recorded demonstration | Whole team |
Every criterion can be checked with a stopwatch, a percentage or a test run. The browser criterion "explains that it cannot control the system" is the same point as risk **R-11**: users may expect a web page to control the computer.
## Keeping the scope tight
- **CR-01 (3 Oct)** removed the workout assistance mode and other experimental modes; the app keeps **two modes**: gesture mode and the gesture trainer.
- **CR-02 (4 Oct)** added the browser version (WBS 3.4, milestone M6) — through the change procedure, as a major change.
- Development is about **three weeks ahead**, but the gained time goes to the **accuracy and lighting studies (4.1, 4.2)**, not to new features.
- If work is delayed, **minor features are reduced** instead of shortening testing: user testing starts on 20 October in any case, because the test with 30 users is the only way to confirm the objectives.
## The theory behind it
- **Deliverables (L1):** projects exist to produce deliverables — **measurable, tangible outputs**. That is why each deliverable in Table 10 has a measurable criterion and a named person who accepts it.
- **Charter (L2):** Kerzner's minimum charter contains the **project scope (inclusions and exclusions)**; the detailed version adds the scope baseline, the WBS, the change management plan and management approval. Our report is a project management plan, not a separate charter; Section 19 "Sponsor Acceptance" plays the role of the charter signature, and its signature block is still empty — the plan is presented for approval at the midterm.
- **Planning (L2):** one objective of planning is to **completely define all work required**, so that it is readily identifiable to each participant — hence a code, a responsible person and a task card for each WBS package.
- **Success (L1):** a project succeeds within time, within cost, at the desired performance, **accepted by the customer** and **with minimum or mutually agreed upon scope changes**. L1 also names scope changes among the main obstacles of project management.
- **Scope creep:** uncontrolled growth of the scope — work added without checking its effect on time, cost and risk. **Scope verification** = formal acceptance of the deliverables; **scope control** = keeping the work inside the approved lists.
> Scope = two lists plus Table 10: anything outside the lists enters only as an approved major change, and a deliverable is done only when it meets its acceptance criteria.
## How to say it at the defense
- **Say:** “We have two scope lists, included and not included, and we check every change request against them.”
- **Say:** “We manage scope in four processes: definition, work breakdown, verification and control.”
- **Say:** “We gave each deliverable acceptance criteria in Table 10, and the sponsor gives the final acceptance.”
- **Say:** “We removed the workout mode on 3 October through CR-01, so the app has two modes: gesture mode and the trainer.”
- **Say:** “We use the time we gained for the accuracy and lighting studies, not for new features.”
## Weak spots and honest answers
- **“Your website says Windows is in progress, but Windows is out of scope.”** True. This is risk R-06 (score 6, owner Akbota) and the pending CR-05: build a Windows version with Electron or remove the promise from the website. The decision is due at M10 on 20 October.
- **“Does the app already meet the 90% criterion?”** Not proven yet. The 95%, 93% and 85% per frame were measured on synthetic hands; real video comes with M8 (15 Oct) and the user test with M11 (1 Nov). We do not claim accuracy on real users before then.
- **“Isn't the browser version scope creep?”** No. Scope creep is uncontrolled; the browser version entered as CR-02, a major change, with its own work package 3.4 and milestone M6.
## Check yourself
?? Someone asks YeahTrack to support two-hand gestures. What does our plan say?
?= Two-hand gestures are on the excluded list, so the request is rejected unless it is submitted as a change request and approved as a major change by all four members — it adds a feature.
?? When is the browser version accepted, and by whom?
?= When it opens at yeahtrack.site/app on a computer with a camera, records and recognises gestures and explains that it cannot control the system; Ayat and Akbota accept it.`,
        ru: `## Что мы написали
Раздел 3 задаёт **объём работ (project scope)**: разработка, тестирование и документация YeahTrack с **1 сентября по 4 ноября 2026**. Границу проводят два списка, и по этим же спискам проверяется **каждый запрос на изменение (change request)** (разделы 6 и 10).
| Входит (8 пунктов) | Не входит (6 пунктов) |
|---|---|
| Распознавание руки через веб-камеру ноутбука | Версии для телефонов и macOS |
| Запись и обучение своих жестов — и статичных поз, и движений | Версия для Windows на этом этапе — решение не принято (риск R-06) |
| Свайпы по направлениям: влево, вправо, вверх и вниз | Режим помощи на тренировках (workout), убран 3 октября 2026 (CR-01) |
| Привязка жестов к командам: системные действия, сочетания клавиш, сайты и программы | Специальное оборудование: камеры глубины, датчики, перчатки |
| Панель настроек: добавить, переименовать, перезаписать и удалить жест | Жесты двумя руками и язык жестов |
| Настольная версия для Linux с GNOME (Wayland) | Голосовое управление и облачное хранение |
| Браузерная версия на yeahtrack.site/app | – |
| Сайт проекта, руководство пользователя и результаты тестов | – |
Списки опираются на **раздел 1.4**. **Цель (goal):** рабочее приложение, в котором пользователь обучает свои жесты и привязывает их к командам компьютера, к **4 ноября 2026**. **Задачи (objectives):** точность не ниже **90%** на обученных жестах, новый жест **меньше чем за минуту**, тестирование минимум на **30 пользователях**. **Результаты (deliverables):** настольное приложение для Linux (GNOME) и браузерная версия, короткое руководство пользователя, результаты тестов и финальная презентация.
![Форма «Новый жест» (рисунок 3, интерфейс на русском): название, тип — поза или движение, длина записи (здесь 30 с) и команда, здесь «закрыть вкладку»; в боковой панели — два режима, оставшиеся после CR-01: режим жестов и тренер жестов](/events/pm/yeahtrack-new-gesture.webp)
## Управление объёмом: четыре процесса
Раздел 10 делит управление объёмом на четыре процесса (PMI, 2021). За управление объёмом отвечает **Ayat** как владелец архитектуры системы; каждый владелец области отвечает за объём своей области.
| Процесс | Что делает YeahTrack |
|---|---|
| Scope definition — определение объёма (10.1) | Цель, задачи, результаты (1.4) и два списка (раздел 3) — эталон, с которым сравнивается каждый новый запрос |
| Work breakdown — декомпозиция работ (10.2) | Результаты разбиты на пакеты WBS (таблица 3); у каждого есть код, ответственный, даты начала и конца и карточка задачи на GitHub |
| Scope verification — подтверждение объёма (10.3) | Результаты сверяются с критериями приёмки (таблица 10) на разборах вех; окончательную приёмку подтверждает спонсор (раздел 19) |
| Scope control — контроль объёма (10.4) | Любое добавление или удаление идёт через процедуру изменений (раздел 6); крупное изменение требует согласия всех четверых |
- Пакет работ считается **завершённым**, когда его карточка закрыта, а связанный код **влит после ревью**.
- Запрос из **списка исключений** — например, жесты двумя руками или мобильная версия — **отклоняется, если его не одобрили как крупное (major) изменение**.
- На каждой **еженедельной встрече** команда просматривает открытые карточки в поисках работы вне WBS; такую работу **останавливают или оформляют как запрос на изменение**.
- Перед финальной презентацией все результаты **ещё раз** сверяются с критериями приёмки и со списками объёма.
## Критерии приёмки (таблица 10)
| Результат | Критерии приёмки | Кто принимает |
|---|---|---|
| Настольное приложение (Linux, GNOME) | Записывает новый жест меньше чем за минуту; распознаёт обученные жесты с точностью не ниже 90% в пользовательском тесте; выполняет назначенную команду; проходит все автотесты | Вся команда, затем спонсор |
| Браузерная версия | Открывается на yeahtrack.site/app на компьютере с камерой; записывает и распознаёт жесты; объясняет, что не может управлять системой | Ayat, Akbota |
| Руководство пользователя | Новый пользователь может установить приложение и настроить один жест по руководству без посторонней помощи | Aizat, затем два тестовых пользователя |
| Результаты тестов | Содержат исследование точности, исследование освещения и тест на 30 пользователях в сравнении с базовым планом качества (раздел 18) | Aizat, Ayat |
| Финальная презентация | Охватывает задачи, результаты и уроки; включает живую или записанную демонстрацию | Вся команда |
Каждый критерий проверяется секундомером, процентом или прогоном тестов. Критерий браузерной версии «объясняет, что не может управлять системой» — это тот же вопрос, что и риск **R-11**: пользователи могут ждать, что веб-страница управляет компьютером.
## Как мы держим объём
- **CR-01 (3 окт.)** убрал режим помощи на тренировках и другие экспериментальные режимы; в приложении остались **два режима**: режим жестов и тренер жестов.
- **CR-02 (4 окт.)** добавил браузерную версию (WBS 3.4, веха M6) — через процедуру изменений, как крупное изменение.
- Разработка опережает план примерно на **три недели**, но выигранное время идёт на **исследования точности и освещения (4.1, 4.2)**, а не на новые функции.
- Если работа задерживается, **урезают второстепенные функции**, а не тестирование: тест с пользователями начинается 20 октября в любом случае, ведь тест на 30 пользователях — единственный способ подтвердить задачи проекта.
## Теория за этим
- **Deliverables — результаты (L1):** проекты существуют ради результатов — **измеримых, осязаемых выходов (measurable, tangible outputs)**. Поэтому у каждого результата в таблице 10 есть измеримый критерий и названный человек, который его принимает.
- **Устав, charter (L2):** минимальный устав по Kerzner содержит **объём проекта с включениями и исключениями (inclusions and exclusions)**; подробная версия добавляет базовый план объёма, WBS, план управления изменениями и одобрение руководства. Наш отчёт — это план управления проектом, а не отдельный устав; раздел 19 «Sponsor Acceptance» играет роль подписи устава, и блок подписи в нём пока пуст — план представляется на утверждение на мидтерме.
- **Планирование (L2):** одна из целей планирования — **полностью определить всю требуемую работу**, чтобы она была понятна каждому участнику; отсюда код, ответственный и карточка задачи у каждого пакета WBS.
- **Успех (L1):** проект успешен, если он завершён в срок, в рамках бюджета, с нужным качеством, **принят заказчиком** и **с минимальными или взаимно согласованными изменениями объёма (minimum or mutually agreed upon scope changes)**. В L1 изменения объёма названы и среди главных препятствий управления проектами.
- **Scope creep — расползание объёма:** неконтролируемый рост объёма — работа добавляется без оценки её влияния на сроки, стоимость и риски. **Scope verification** — формальная приёмка результатов; **scope control** — удержание работы внутри утверждённых списков.
> Объём = два списка плюс таблица 10: всё, что вне списков, входит только как одобренное крупное изменение, а результат готов, только когда выполнены его критерии приёмки.
## Как сказать на защите
- **Скажи:** «We have two scope lists, included and not included, and we check every change request against them.» — у объёма два списка, и каждый запрос на изменение сверяем с ними.
- **Скажи:** «We manage scope in four processes: definition, work breakdown, verification and control.» — управление объёмом — это четыре процесса.
- **Скажи:** «We gave each deliverable acceptance criteria in Table 10, and the sponsor gives the final acceptance.» — у каждого результата есть критерии приёмки, окончательно принимает спонсор.
- **Скажи:** «We removed the workout mode on 3 October through CR-01, so the app has two modes: gesture mode and the trainer.» — режим тренировок убрали 3 октября через CR-01, осталось два режима.
- **Скажи:** «We use the time we gained for the accuracy and lighting studies, not for new features.» — выигранное время идёт на исследования точности и освещения, а не на новые функции.
## Слабые места и честные ответы
- **«Your website says Windows is in progress, but Windows is out of scope.»** Да, так и есть. Это риск R-06 (оценка 6, владелец Akbota) и открытый CR-05: сделать версию для Windows на Electron или убрать обещание с сайта. Решение — на вехе M10, 20 октября.
- **«Does the app already meet the 90% criterion?»** Пока не доказано. 95%, 93% и 85% по кадрам измерены на синтетических руках; реальное видео — веха M8 (15 окт.), тест с пользователями — веха M11 (1 нояб.). До этого мы не заявляем точность на реальных людях.
- **«Isn't the browser version scope creep?»** Нет. Scope creep — это неконтролируемый рост; браузерная версия вошла как CR-02, крупное изменение, со своим пакетом работ 3.4 и вехой M6.
## Проверь себя
?? Кто-то просит добавить в YeahTrack жесты двумя руками. Что говорит наш план?
?= Жесты двумя руками в списке исключений, поэтому запрос отклоняется, если его не подать как запрос на изменение и не одобрить как крупное изменение всеми четырьмя участниками — он добавляет функцию.
?? Когда браузерная версия считается принятой и кто её принимает?
?= Когда она открывается на yeahtrack.site/app на компьютере с камерой, записывает и распознаёт жесты и объясняет, что не может управлять системой; принимают Ayat и Akbota.`,
      },
      [
        qx("Which item is on YeahTrack's ‘not included’ scope list?", "Two-hand gestures and sign language", [
          ["Swipes left, right, up and down", "Directional swipes in four directions are on the included list.", "Свайпы в четыре стороны — в списке того, что входит."],
          ["A browser version at yeahtrack.site/app", "The browser version is included: it was added through CR-02 on 4 October.", "Браузерная версия входит в объём: её добавили через CR-02 4 октября."],
          ["A panel to rename, re-record and delete gestures", "The settings panel to add, rename, re-record and delete gestures is on the included list.", "Панель настроек, где жесты добавляют, переименовывают, перезаписывают и удаляют, входит в объём."],
        ], "Section 3 excludes six items: mobile and macOS, Windows for now, the workout mode, special hardware, two-hand gestures and sign language, voice control and cloud storage.", "Раздел 3 исключает шесть пунктов: телефоны и macOS, пока что Windows, режим тренировок, спецоборудование, жесты двумя руками и язык жестов, голос и облачное хранение."),
        qx("When was the workout assistance mode removed from the scope, and through which change request?", "3 October 2026, CR-01", [
          ["4 October 2026, CR-02", "CR-02 on 4 October added the browser version; it removed nothing.", "CR-02 от 4 октября добавил браузерную версию и ничего не убирал."],
          ["5 October 2026, CR-03", "CR-03 on 5 October introduced task cards, PR review, the risk register and the time log.", "CR-03 от 5 октября ввёл карточки задач, ревью pull request, реестр рисков и журнал часов."],
          ["20 October 2026, CR-05", "CR-05 is the pending Windows decision, and 20 October is milestone M10, not a removal date.", "CR-05 — это открытое решение по Windows, а 20 октября — веха M10, а не дата удаления."],
        ], "CR-01 (3 Oct, major, approved) removed the workout assistance mode and other experimental modes; the app keeps gesture mode and the gesture trainer.", "CR-01 (3 окт., крупное, одобрено) убрал режим помощи на тренировках и другие экспериментальные режимы; остались режим жестов и тренер жестов."),
        qx("Which four processes make up scope management in Section 10 of our plan?", "Definition, work breakdown, verification, control", [
          ["Initiation, planning, execution, closure", "These are process groups (with Monitoring and Controlling missing), not the scope processes.", "Это группы процессов управления проектом (и без Monitoring and Controlling), а не процессы управления объёмом."],
          ["Identification, assessment, response, monitoring", "These are the four steps of risk management in Section 13.", "Это четыре шага управления рисками из раздела 13."],
          ["Submission, assessment, decision, closure", "These are steps of the change procedure in Section 6, not the scope processes.", "Это шаги процедуры изменений из раздела 6, а не процессы управления объёмом."],
        ], "Section 10: scope definition (10.1), work breakdown (10.2), scope verification (10.3) and scope control (10.4), following PMI (2021).", "Раздел 10: определение объёма (10.1), декомпозиция работ (10.2), подтверждение объёма (10.3) и контроль объёма (10.4) — по PMI (2021)."),
        qx("Who is responsible for scope management in YeahTrack?", "Ayat, as the owner of the system design", [
          ["Aizat, as owner of quality and documentation", "Aizat owns quality and documentation and accepts the test results, but scope management is Ayat's.", "Aizat отвечает за качество и документацию и принимает результаты тестов, но управление объёмом — за Ayat."],
          ["Akbota, as owner of the website and demo", "Akbota owns the website, the demo and the Windows decision, not scope management as a whole.", "Akbota отвечает за сайт, демо и решение по Windows, а не за управление объёмом в целом."],
          ["The sponsor, who signs Section 19", "The sponsor gives the final acceptance of deliverables but does not manage the scope day to day.", "Спонсор даёт окончательную приёмку результатов, но не управляет объёмом изо дня в день."],
        ], "Section 10: Ayat, as the owner of the system design, is responsible for scope management; each area owner is responsible for the scope of their own area.", "Раздел 10: за управление объёмом отвечает Ayat как владелец архитектуры системы; каждый владелец области отвечает за объём своей области."),
        qx("According to Table 10, which deliverable is accepted by Aizat and then by two test users?", "The short user guide", [
          ["The test results", "The test results are accepted by Aizat and Ayat.", "Результаты тестов принимают Aizat и Ayat."],
          ["The browser version", "The browser version is accepted by Ayat and Akbota.", "Браузерную версию принимают Ayat и Akbota."],
          ["The final presentation", "The final presentation is accepted by the whole team.", "Финальную презентацию принимает вся команда."],
        ], "The user guide passes if a new user can install the application and set up one gesture by following it without help; Aizat accepts it, then two test users.", "Руководство принято, если новый пользователь может установить приложение и настроить один жест по нему без помощи; принимает Aizat, затем два тестовых пользователя."),
        qx("Which acceptance criterion in Table 10 belongs to the browser version?", "It explains that it cannot control the system", [
          ["It executes the assigned command in the OS", "Executing the assigned command is a desktop criterion; a web page cannot control the system.", "Выполнение назначенной команды — критерий настольной версии; веб-страница не может управлять системой."],
          ["It reaches at least 90% accuracy in the 30-user test", "The 90% accuracy criterion is written for the desktop application.", "Критерий точности 90% записан для настольного приложения."],
          ["A new user sets it up from the guide unaided", "Setting up a gesture by following the guide without help is the user guide's criterion.", "Настройка жеста по руководству без помощи — критерий руководства пользователя."],
        ], "Browser version: opens at yeahtrack.site/app on a computer with a camera, records and recognises gestures, and explains that it cannot control the system (compare risk R-11).", "Браузерная версия: открывается на yeahtrack.site/app на компьютере с камерой, записывает и распознаёт жесты и объясняет, что не может управлять системой (ср. риск R-11)."),
        qx("What is the status of a Windows version in YeahTrack's scope on 5 October?", "Not included for now; decision pending (R-06)", [
          ["Included, due as a deliverable at M10 on 20 Oct", "M10 on 20 October is when the decision on Windows is made, not a Windows delivery.", "На вехе M10 (20 октября) принимается решение по Windows, а не сдаётся Windows-версия."],
          ["Removed for good by CR-01 on 3 October", "CR-01 removed the workout mode and other experimental modes, not Windows.", "CR-01 убрал режим тренировок и другие экспериментальные режимы, а не Windows."],
          ["Included as part of the browser version, CR-02", "CR-02 added the browser version; it is not a Windows desktop version.", "CR-02 добавил браузерную версию; это не настольная версия для Windows."],
        ], "Section 3 excludes a Windows version at this stage: the decision is pending (risk R-06, owner Akbota; CR-05 — build it with Electron or remove the promise from the website).", "Раздел 3 исключает Windows-версию на этом этапе: решение не принято (риск R-06, владелец Akbota; CR-05 — сделать на Electron или убрать обещание с сайта)."),
        tfx("A work package counts as complete when its GitHub task card is closed and its code has been merged after review.", true, "Section 10.2: a work package is complete when its card is closed and the related code has been merged after review.", "Раздел 10.2: пакет работ завершён, когда его карточка закрыта, а связанный код влит после ревью.", "False would ignore the definition of done in Section 10.2: a closed card plus reviewed, merged code.", "Ответ False игнорирует определение готовности из раздела 10.2: закрытая карточка плюс код, влитый после ревью."),
        tfx("Under our plan, a request for a mobile version is rejected outright, with no way into the scope.", false, "Section 10.1: a request from the excluded list is rejected unless it is approved as a major change, so the way in is the change procedure of Section 6.", "Раздел 10.1: запрос из списка исключений отклоняется, если его не одобрили как крупное изменение, — значит, путь в объём есть: процедура изменений из раздела 6.", "True would mean the scope lists can never change, yet CR-01 and CR-02 changed them through approved major changes.", "Ответ True означал бы, что списки объёма неизменны, но CR-01 и CR-02 изменили их через одобренные крупные изменения."),
        qx("Kerzner (L1) calls deliverables measurable, tangible outputs. Which part of our plan applies this most directly?", "Table 10: acceptance criteria per deliverable", [
          ["Table 1: the tools and their main users", "Table 1 lists tools; it does not make any deliverable measurable.", "Таблица 1 перечисляет инструменты и не делает результаты измеримыми."],
          ["Table 17: the planned weekly hours of each member", "Table 17 is the resource calendar — effort, not deliverable outputs.", "Таблица 17 — календарь ресурсов: это усилия, а не результаты."],
          ["Table 14: the risks that have already occurred", "Table 14 records past problems and their fixes, not how deliverables are judged.", "Таблица 14 фиксирует прошлые проблемы и их решения, а не то, как оценивают результаты."],
        ], "Each deliverable in Table 10 has a measurable acceptance criterion (under one minute, at least 90%, 30 users, all tests pass) and a named acceptor.", "У каждого результата в таблице 10 есть измеримый критерий приёмки (меньше минуты, не ниже 90%, 30 пользователей, все тесты проходят) и тот, кто его принимает."),
        qx("Kerzner's minimum charter (L2) includes the scope with inclusions and exclusions. Where does our report give them?", "Section 3: the included and not included lists", [
          ["Section 19: the sponsor acceptance block", "Section 19 plays the role of the charter signature but lists no inclusions or exclusions.", "Раздел 19 играет роль подписи устава, но включений и исключений не перечисляет."],
          ["Section 14: the open and occurred risk lists", "Risks belong in a charter too, but they are not the scope inclusions and exclusions.", "Риски тоже входят в устав, но это не включения и исключения объёма."],
          ["Section 4: the twelve milestones and their dates", "Milestones are schedule items, not the inclusions and exclusions of the scope.", "Вехи — элементы графика, а не включения и исключения объёма."],
        ], "L2: a charter should at minimum contain the project scope (inclusions and exclusions); our Section 3 lists 8 included and 6 excluded items.", "L2: устав минимум должен содержать объём проекта (включения и исключения); наш раздел 3 перечисляет 8 включённых и 6 исключённых пунктов."),
        qx("Scope creep is uncontrolled growth of the scope. Which routine in our plan is meant to catch it early?", "Weekly check of open task cards against the WBS", [
          ["The progress check-in every one or two days", "Check-ins compare progress with the milestones; the search for work outside the WBS is done weekly.", "Check-in сравнивает ход работ с вехами, а поиск работы вне WBS идёт на еженедельной встрече."],
          ["The report to the instructor at each deliverable", "The instructor report comes only at each deliverable — too late to stop creeping work.", "Отчёт преподавателю бывает только на каждом результате — слишком поздно, чтобы остановить расползание."],
          ["The daily hours entered in docs/HOURS.md", "The time log records how long work took, not whether it belongs to the scope.", "Журнал часов фиксирует, сколько длилась работа, а не входит ли она в объём."],
        ], "Section 10.4: at each weekly meeting the team checks the open task cards for work not covered by the WBS; such work is stopped or submitted as a change request.", "Раздел 10.4: на каждой еженедельной встрече команда проверяет открытые карточки на работу вне WBS; такую работу останавливают или оформляют как запрос на изменение."),
        qx("Kerzner's success criteria (L1) include minimum or mutually agreed upon scope changes. Which of our rules fits this best?", "A major change needs all four members to agree", [
          ["Ayat alone approves every minor change", "Minor changes need the area owner and Ayat, not Ayat alone.", "Мелкие изменения одобряют владелец области и Ayat, а не Ayat в одиночку."],
          ["Each member may change the scope of their own area", "Section 2: no member may change the scope alone; area owners assess impact, they do not decide alone.", "Раздел 2: никто не меняет объём в одиночку; владелец области оценивает влияние, но не решает один."],
          ["The scope lists stay frozen until 4 November", "The lists are not frozen: they changed through approved major changes such as CR-01 and CR-02.", "Списки не заморожены: они менялись через одобренные крупные изменения вроде CR-01 и CR-02."],
        ], "Mutually agreed scope changes = our rule that every major change (adding or removing a feature, moving a milestone) needs the agreement of all four members.", "Взаимно согласованные изменения объёма = наше правило: каждое крупное изменение (добавить или убрать функцию, сдвинуть веху) требует согласия всех четверых."),
        qx("Examiner: ‘You added a browser version in October — isn't that scope creep?’ What is the best answer?", "No, it went through CR-02 as an approved major change", [
          ["Yes, but the instructor asked us to add it", "Blames someone else, and the report says nothing like it: CR-02 was the team's own approved change.", "Перекладывает ответственность, и в отчёте такого нет: CR-02 — собственное одобренное изменение команды."],
          ["No, the browser version was there in the original plan", "Denies a fact: WBS 3.4 and M6 are marked as added; the browser version came through CR-02.", "Отрицает факт: WBS 3.4 и M6 помечены как добавленные; браузерная версия пришла через CR-02."],
          ["It does not matter, it took only two days to build", "Dismisses the question; size does not decide — adding a feature is always a major change.", "Отмахивается от вопроса; размер не решает — добавление функции всегда крупное изменение."],
        ], "Scope creep is uncontrolled change. The browser version entered through the procedure: CR-02 (4 Oct, major, approved), with WBS 3.4 and milestone M6 added to the baseline.", "Scope creep — неконтролируемое изменение. Браузерная версия вошла через процедуру: CR-02 (4 окт., крупное, одобрено), в базовый план добавлены WBS 3.4 и веха M6."),
        qx("Examiner: ‘Does the app already meet the 90% accuracy acceptance criterion?’ What is the honest answer?", "Not proven yet: we have only synthetic-hand results", [
          ["Yes, we measured 95%, so the criterion is already met", "Over-claims: 95% is per frame on synthetic hands with tilt up to ±10°; the criterion is about the user test.", "Преувеличение: 95% — по кадрам на синтетических руках при наклоне до ±10°, а критерий — про тест с пользователями."],
          ["No, recognition fails when the wrist is tilted", "Outdated: the tilted-wrist problem (R-13) was fixed — 93% at ±25° and 85% at ±40° on synthetic hands.", "Устарело: проблему наклона запястья (R-13) решили — 93% при ±25° и 85% при ±40° на синтетических руках."],
          ["We lowered the target to 85% at the midterm", "False: the target is still at least 90%; 85% is the synthetic result at ±40° tilt.", "Неверно: цель по-прежнему не ниже 90%; 85% — синтетический результат при наклоне ±40°."],
        ], "Honest answer: synthetic hands give 95%, 93% and 85% per frame, but real video comes with M8 (15 Oct) and the user test with M11 (1 Nov); we do not claim accuracy on real users before then.", "Честный ответ: на синтетических руках 95%, 93% и 85% по кадрам, но реальное видео будет на вехе M8 (15 окт.), а тест с пользователями — на M11 (1 нояб.); до этого точность на реальных людях не заявляем."),
      ],
    ),
    part(
      "pd-b2-p2",
      { en: "Change control: seven steps and the change log", ru: "Управление изменениями: семь шагов и журнал изменений" },
      {
        en: `## What we wrote
Any team member may request a change to the **scope, the schedule, the budget or the requirements**. Every request follows one procedure based on **integrated change control** (PMBOK Guide). Behind it stands the rule from Section 2: **no member may change the scope alone**.
| Step | What happens |
|---|---|
| 1. Submission | The requester opens a **GitHub issue** labelled ‘change request’: what should change, why, and which deliverable or milestone is affected |
| 2. Impact assessment | **Within two days** the owner of the affected area estimates the effect on scope, schedule, hours, budget, quality and risks and adds it to the issue |
| 3. Classification | Minor or major, by the criteria in Table 4 |
| 4. Decision | Minor: the area owner and Ayat, usually the same day in Telegram. Major: discussed at the next check-in or weekly meeting, all four members must agree; if they cannot, Ayat decides |
| 5. Baseline update | Scope lists (Section 3), WBS and milestones (Sections 4, 5), cost baseline (Section 17), quality baseline (Section 18) and, where relevant, the risk register (Section 14) |
| 6. Implementation | In a separate branch, merged through a reviewed pull request (Section 12) |
| 7. Communication and closure | Decision announced in Telegram, the issue closed with a short summary, the change added to the change log (Table 5) |
@diagram pm-change-flow
## Minor or major (Table 4)
| Class | Criteria | Who decides |
|---|---|---|
| Minor | Does not move a milestone, does not change the objectives or the scope lists, and needs less than 4 hours of work; for example, adjusting a command mapping or an interface detail | The area owner and Ayat, usually the same day in Telegram |
| Major | Moves a milestone, changes an objective, adds or removes a feature, requires a purchase, or needs 4 hours of work or more | All four members at the next check-in or weekly meeting; if they cannot agree, Ayat |
- A change is **minor only if all three conditions hold**. **Any one** major criterion is enough: a two-hour change that adds a feature is still major.
- **Any purchase** makes a change major. Section 8 says it again: a purchase not listed in Table 8 is a major change and needs the agreement of the whole team.
- The **tie-break** belongs to Ayat because Ayat owns the system design; it applies only when the four cannot agree.
## The change log (Table 5)
| ID | Date | Change | Class | Decision |
|---|---|---|---|---|
| CR-01 | 3 Oct | Removal of the workout assistance mode and other experimental modes; the app keeps two modes, gesture mode and the gesture trainer | Major | Approved |
| CR-02 | 4 Oct | Addition of a browser version at yeahtrack.site/app (WBS 3.4) | Major | Approved |
| CR-03 | 5 Oct | Introduction of task cards, pull request review, a risk register and a time log (M7) | Major | Approved |
| CR-04 | 5 Oct | Addition of the accuracy study and the lighting study to the schedule (WBS 4.1, 4.2; M8, M9) | Major | Approved |
| CR-05 | Open | Windows version: build it with Electron or remove the promise from the website (risk R-06) | Major | Pending |
- Why all five are major: CR-01 **removes** features, CR-02 **adds** one, CR-03 adds milestone M7, CR-04 adds packages 4.1, 4.2 and milestones M8, M9, and CR-05 would either add a whole Windows version or withdraw a promise made on the website.
- CR-05 sits in Akbota's area (the decision on a Windows version) and is due at **M10 on 20 October**: all features ready, decision on Windows made.
## Baseline update in practice
- Work packages **3.4, 4.1 and 4.2** and milestones **M6–M9** entered the baseline on **5 October** through this procedure; the Gantt chart shows the added packages as hatched bars.
- After CR-01 the workout mode sits in the **not included** list of Section 3.
- Finishing early is **not** a change: M3–M5 keep their target dates, with the actual dates (12 Sep, 16 Sep) shown next to them. The baseline was kept unchanged to keep the variance visible.
- Other plans use the same door: a delay that would **move a milestone** (Section 11), an overrun of **more than 10%** that may end in a change request (Section 8), and any change of the **quality baseline** (Section 18).
## The theory behind it
- **Integration management (L1):** the project manager integrates the activities needed to develop the plan, to execute it and **to make changes to the plan**. Integrated change control looks at a change's effect on **all** baselines together — that is why step 2 covers six areas and step 5 updates every affected baseline.
- **Monitoring and control (L1):** track progress, compare the actual outcome with the predicted one, analyse variances and impacts, **make adjustments**. At the midterm the project is in Execution plus Monitoring and Controlling (check-ins, weekly meeting, change log, risk register, time log).
- **Policy and procedure (L2):** a **policy** is a general guide for decisions — no member may change the scope alone; a **procedure** is a detailed method for carrying out a policy — our seven steps.
- **Moving milestones (L2):** when milestones are seen as unrealistic, one alternative is to move them, and upper-level management must take part in that choice. In our plan a moved milestone is a major change that needs all four members.
- **Success (L1):** completion **with minimum or mutually agreed upon scope changes**. Every change in Table 5 was agreed by all four or is still pending.
- **Baseline and Agile:** a **baseline** is the approved reference, changed only through an approved change. The team works in short Scrum-like iterations, so small changes stay fast (same day) and only big ones get the formal decision.
> One door for every change: GitHub issue, impact within two days, minor or major, decision, baselines updated, reviewed pull request, change log. Minor = area owner + Ayat; major = all four; tie = Ayat.
## How to say it at the defense
- **Say:** “We start every change as a GitHub issue labelled change request, and it goes through seven steps.”
- **Say:** “We call a change minor only if it moves no milestone, changes no objective or scope list and takes less than four hours.”
- **Say:** “We approve minor changes with the area owner and Ayat; major changes need all four of us, and Ayat breaks a tie.”
- **Say:** “We update every affected baseline after approval and add the change to the change log.”
- **Say:** “We have five change requests: four are approved, and CR-05 on the Windows version is still pending.”
## Weak spots and honest answers
- **“Step 6 says reviewed pull requests, but CR-01 and CR-02 are from 3 and 4 October.”** True. Until 5 October changes were committed directly to the main branch; pull request review came with CR-03 on 5 October. Since then every change goes through a reviewed pull request.
- **“Seven steps is too heavy for four students in an Agile project.”** Minor changes are approved by the area owner and Ayat, usually the same day in Telegram. Only changes that move a milestone, change an objective, add or remove a feature, need a purchase or take 4 hours or more wait for the meeting.
- **“So Ayat simply decides everything?”** No. A major change first needs the agreement of all four; Ayat decides only when the team cannot agree, as the owner of the system design.
## Check yourself
?? A member wants to buy something that is not in Table 8, even something cheap. Minor or major, and who decides?
?= Major: any purchase makes a change major (Table 4), and Section 8 says a purchase outside Table 8 needs the whole team. All four agree at the next check-in or weekly meeting; if they cannot, Ayat decides.
?? What changed in the baselines after CR-04 was approved?
?= The WBS got packages 4.1 and 4.2 and the milestone list got M8 (15 Oct) and M9 (18 Oct), answering risks R-01 and R-02; the Gantt chart shows the new packages as hatched bars.`,
        ru: `## Что мы написали
Любой участник команды может запросить изменение **объёма, сроков, бюджета или требований**. Все запросы идут по одной процедуре, основанной на **интегрированном управлении изменениями (integrated change control)** из PMBOK Guide. За ней стоит правило из раздела 2: **никто не меняет объём в одиночку**.
| Шаг | Что происходит |
|---|---|
| 1. Submission — подача | Автор запроса открывает **GitHub issue** с меткой ‘change request’: что изменить, зачем и какой результат или веху это затрагивает |
| 2. Impact assessment — оценка влияния | **В течение двух дней** владелец затронутой области оценивает влияние на объём, сроки, часы, бюджет, качество и риски и добавляет оценку в issue |
| 3. Classification — классификация | Мелкое (minor) или крупное (major) — по критериям таблицы 4 |
| 4. Decision — решение | Мелкое: владелец области и Ayat, обычно в тот же день в Telegram. Крупное: обсуждается на ближайшем check-in или еженедельной встрече, нужно согласие всех четверых; если согласия нет, решает Ayat |
| 5. Baseline update — обновление базовых планов | Списки объёма (раздел 3), WBS и вехи (разделы 4, 5), базовый план затрат (раздел 17), базовый план качества (раздел 18) и при необходимости реестр рисков (раздел 14) |
| 6. Implementation — реализация | В отдельной ветке, слияние через pull request после ревью (раздел 12) |
| 7. Communication and closure — сообщение и закрытие | Решение объявляют в Telegram, issue закрывают с кратким итогом, изменение вносят в журнал изменений (таблица 5) |
@diagram pm-change-flow
## Мелкое или крупное (таблица 4)
| Класс | Критерии | Кто решает |
|---|---|---|
| Minor — мелкое | Не сдвигает веху, не меняет задачи проекта и списки объёма и требует меньше 4 часов работы; например, поправить привязку команды или деталь интерфейса | Владелец области и Ayat, обычно в тот же день в Telegram |
| Major — крупное | Сдвигает веху, меняет задачу проекта, добавляет или убирает функцию, требует покупки или 4 и более часов работы | Все четверо на ближайшем check-in или еженедельной встрече; если не договорились — Ayat |
- Изменение **мелкое, только если выполнены все три условия**. **Любого одного** признака крупного достаточно: двухчасовая правка, которая добавляет функцию, всё равно крупная.
- **Любая покупка** делает изменение крупным. Раздел 8 повторяет это: покупка не из таблицы 8 — крупное изменение, нужно согласие всей команды.
- **Решающий голос** у Ayat, потому что Ayat владеет архитектурой системы; он нужен, только когда четверо не могут договориться.
## Журнал изменений (таблица 5)
| ID | Дата | Изменение | Класс | Решение |
|---|---|---|---|---|
| CR-01 | 3 окт. | Убраны режим помощи на тренировках и другие экспериментальные режимы; в приложении два режима — режим жестов и тренер жестов | Major | Одобрено |
| CR-02 | 4 окт. | Добавлена браузерная версия на yeahtrack.site/app (WBS 3.4) | Major | Одобрено |
| CR-03 | 5 окт. | Введены карточки задач, ревью pull request, реестр рисков и журнал часов (M7) | Major | Одобрено |
| CR-04 | 5 окт. | В график добавлены исследование точности и исследование освещения (WBS 4.1, 4.2; M8, M9) | Major | Одобрено |
| CR-05 | Открыт | Версия для Windows: сделать на Electron или убрать обещание с сайта (риск R-06) | Major | Ожидает решения |
- Почему все пять крупные: CR-01 **убирает** функции, CR-02 **добавляет** функцию, CR-03 добавляет веху M7, CR-04 — пакеты 4.1, 4.2 и вехи M8, M9, а CR-05 либо добавит целую версию для Windows, либо отзовёт обещание с сайта.
- CR-05 относится к области Akbota (решение о версии для Windows) и должен закрыться на **вехе M10, 20 октября**: все функции готовы, решение по Windows принято.
## Обновление базового плана на практике
- Пакеты **3.4, 4.1 и 4.2** и вехи **M6–M9** вошли в базовый план **5 октября** через эту процедуру; на диаграмме Ганта добавленные пакеты заштрихованы.
- После CR-01 режим тренировок стоит в списке **«не входит»** раздела 3.
- Закончить раньше — **не** изменение: у M3–M5 остались плановые даты, а рядом показаны фактические (12 сен., 16 сен.). Базовый план не трогали, чтобы отклонение было видно.
- Через ту же дверь идут и другие планы: задержка, которая **сдвинула бы веху** (раздел 11), перерасход **больше 10%**, который может закончиться запросом на изменение (раздел 8), и любое изменение **базового плана качества** (раздел 18).
## Теория за этим
- **Integration management — управление интеграцией (L1):** руководитель проекта интегрирует работу по разработке плана, по его выполнению и **по внесению изменений в план**. Интегрированное управление изменениями смотрит на влияние изменения сразу на **все** базовые планы — поэтому шаг 2 охватывает шесть областей, а шаг 5 обновляет каждый затронутый базовый план.
- **Monitoring and control — мониторинг и контроль (L1):** отслеживать ход работ, сравнивать факт с прогнозом, анализировать отклонения и их влияние, **вносить корректировки**. На мидтерме проект находится в Execution плюс Monitoring and Controlling (check-in, еженедельная встреча, журнал изменений, реестр рисков, журнал часов).
- **Policy и procedure (L2):** **политика** — общий ориентир для решений: никто не меняет объём в одиночку; **процедура** — подробный способ выполнять политику: наши семь шагов.
- **Сдвиг вех (L2):** если вехи считаются нереалистичными, одна из альтернатив — сдвинуть их, и в этом выборе должно участвовать вышестоящее руководство. У нас сдвиг вехи — крупное изменение, нужно согласие всех четверых.
- **Успех (L1):** завершение **с минимальными или взаимно согласованными изменениями объёма**. Каждое изменение в таблице 5 согласовано всеми четырьмя или ещё ждёт решения.
- **Базовый план и Agile:** **baseline** — утверждённый эталон, его меняют только через одобренное изменение. Команда работает короткими итерациями в духе Scrum, поэтому мелкие изменения остаются быстрыми (в тот же день), а формальное решение нужно только крупным.
> Одна дверь для любого изменения: GitHub issue, оценка влияния за два дня, мелкое или крупное, решение, обновление базовых планов, pull request после ревью, журнал изменений. Мелкое = владелец области + Ayat; крупное = все четверо; ничья — решает Ayat.
## Как сказать на защите
- **Скажи:** «We start every change as a GitHub issue labelled change request, and it goes through seven steps.» — любое изменение начинается с issue и проходит семь шагов.
- **Скажи:** «We call a change minor only if it moves no milestone, changes no objective or scope list and takes less than four hours.» — мелкое, только если не трогает вехи, задачи и списки и занимает меньше четырёх часов.
- **Скажи:** «We approve minor changes with the area owner and Ayat; major changes need all four of us, and Ayat breaks a tie.» — мелкие одобряют владелец области и Ayat, крупные — все четверо, при ничьей решает Ayat.
- **Скажи:** «We update every affected baseline after approval and add the change to the change log.» — после одобрения обновляем базовые планы и вносим изменение в журнал.
- **Скажи:** «We have five change requests: four are approved, and CR-05 on the Windows version is still pending.» — пять запросов: четыре одобрены, CR-05 по Windows ждёт решения.
## Слабые места и честные ответы
- **«Step 6 says reviewed pull requests, but CR-01 and CR-02 are from 3 and 4 October.»** Да. До 5 октября изменения коммитили прямо в основную ветку, а ревью pull request появилось с CR-03 5 октября. С тех пор каждое изменение проходит через pull request с ревью.
- **«Seven steps is too heavy for four students in an Agile project.»** Мелкие изменения одобряют владелец области и Ayat, обычно в тот же день в Telegram. До встречи ждут только изменения, которые сдвигают веху, меняют задачу, добавляют или убирают функцию, требуют покупки или 4 и более часов.
- **«So Ayat simply decides everything?»** Нет. Крупному изменению сначала нужно согласие всех четверых; Ayat решает, только если команда не может договориться, — как владелец архитектуры системы.
## Проверь себя
?? Участник хочет купить что-то, чего нет в таблице 8, даже недорогое. Мелкое это изменение или крупное, и кто решает?
?= Крупное: любая покупка делает изменение крупным (таблица 4), а раздел 8 требует для покупки вне таблицы 8 согласия всей команды. Все четверо решают на ближайшем check-in или еженедельной встрече; если не договорились — решает Ayat.
?? Что изменилось в базовых планах после одобрения CR-04?
?= В WBS появились пакеты 4.1 и 4.2, а в списке вех — M8 (15 окт.) и M9 (18 окт.), они отвечают на риски R-01 и R-02; на диаграмме Ганта новые пакеты заштрихованы.`,
      },
      [
        qx("How does a team member submit a change request in YeahTrack?", "A GitHub issue labelled ‘change request’", [
          ["A message in the team's Telegram group", "Telegram is where minor changes are approved and decisions announced; the request itself is a GitHub issue.", "В Telegram одобряют мелкие изменения и объявляют решения, а сам запрос — это GitHub issue."],
          ["A new entry in the register docs/RISKS.md", "docs/RISKS.md is the risk register; step 5 may update it, but a request starts as a GitHub issue.", "docs/RISKS.md — реестр рисков; шаг 5 может его обновить, но запрос начинается с GitHub issue."],
          ["An email to the course instructor", "The instructor is contacted only when an urgent issue cannot be resolved inside the team.", "К преподавателю обращаются, только если срочный вопрос не удаётся решить внутри команды."],
        ], "Step 1: the requester opens a GitHub issue labelled ‘change request’ that says what should change, why, and which deliverable or milestone is affected.", "Шаг 1: автор открывает GitHub issue с меткой ‘change request’ — что изменить, зачем и какой результат или веху это затрагивает."),
        tfx("The owner of the affected area must add an impact estimate to the change request within two days.", true, "Step 2: within two days the area owner estimates the effect on scope, schedule, hours, budget, quality and risks and adds it to the issue.", "Шаг 2: в течение двух дней владелец области оценивает влияние на объём, сроки, часы, бюджет, качество и риски и добавляет оценку в issue.", "False would contradict step 2: the two-day limit is written into the procedure.", "Ответ False противоречит шагу 2: срок в два дня прописан в процедуре."),
        qx("Using the criteria in Table 4, which of these changes is minor?", "Changing a command mapping, 1 hour of work", [
          ["Removing an experimental mode, 2 hours of work", "Removing a feature is major whatever the hours, just like CR-01.", "Удаление функции — крупное изменение при любых часах, как CR-01."],
          ["An interface tweak that takes exactly 4 hours", "4 hours or more is major; a minor change needs less than 4 hours.", "4 часа и больше — это крупное; мелкому нужно меньше 4 часов."],
          ["Buying a cable that is not in Table 8", "Any purchase makes a change major, and a purchase outside Table 8 needs the whole team.", "Любая покупка делает изменение крупным, а покупка не из таблицы 8 требует согласия всей команды."],
        ], "Minor = no milestone moved, no objective or scope list changed and under 4 hours; Table 4's own example is adjusting a command mapping.", "Мелкое = веха не сдвигается, задачи и списки объёма не меняются, меньше 4 часов; пример из самой таблицы 4 — поправить привязку команды."),
        qx("Who approves a minor change, and how quickly does it usually happen?", "The area owner and Ayat, usually the same day", [
          ["All four members, at the next weekly meeting", "That is the rule for major changes, not for minor ones.", "Это правило для крупных изменений, а не для мелких."],
          ["Ayat alone, within two days in Telegram", "Ayat does not approve alone, and two days is the limit for the impact assessment.", "Ayat не одобряет в одиночку, а два дня — срок оценки влияния."],
          ["The requester and the area owner, the same day", "The requester does not approve their own change; the area owner and Ayat do.", "Автор не одобряет собственный запрос — это делают владелец области и Ayat."],
        ], "Step 4: a minor change is approved by the area owner and Ayat, usually on the same day in Telegram.", "Шаг 4: мелкое изменение одобряют владелец области и Ayat, обычно в тот же день в Telegram."),
        qx("A major change is discussed, but the four members cannot agree. Who makes the final decision?", "Ayat, as the owner of the system design", [
          ["The course instructor, as the sponsor", "The instructor is the escalation point for urgent issues; for change decisions the plan names Ayat.", "Преподаватель — точка эскалации для срочных вопросов; для решений по изменениям план называет Ayat."],
          ["A vote, three of four members are enough", "The plan has no majority vote: a major change needs all four, otherwise Ayat decides.", "Голосования большинством в плане нет: крупному изменению нужны все четверо, иначе решает Ayat."],
          ["The member who submitted the change request", "The requester only opens the issue; the decision belongs to the team, with Ayat as the tie-break.", "Автор только открывает issue; решает команда, а при ничьей — Ayat."],
        ], "Step 4: a major change needs the agreement of all four; if the team cannot agree, Ayat, as the owner of the system design, makes the final decision.", "Шаг 4: крупному изменению нужно согласие всех четверых; если команда не может договориться, окончательно решает Ayat как владелец архитектуры системы."),
        qx("Which change log entry is matched with its correct date?", "CR-02, browser version added: 4 October", [
          ["CR-01, workout mode removed: 5 October", "CR-01 is dated 3 October, not 5 October.", "CR-01 датирован 3 октября, а не 5-м."],
          ["CR-04, accuracy and lighting studies: 3 October", "CR-04 is dated 5 October, the same day as CR-03.", "CR-04 датирован 5 октября, в один день с CR-03."],
          ["CR-03, PR review and time log: 4 October", "CR-03 is dated 5 October, when the process controls of M7 were put in place.", "CR-03 датирован 5 октября, когда ввели контроль процессов (веха M7)."],
        ], "Table 5: CR-01 on 3 Oct, CR-02 on 4 Oct, CR-03 and CR-04 on 5 Oct, CR-05 still open.", "Таблица 5: CR-01 — 3 окт., CR-02 — 4 окт., CR-03 и CR-04 — 5 окт., CR-05 ещё открыт."),
        qx("What did CR-04 add to the baseline?", "WBS 4.1 and 4.2, milestones M8 and M9", [
          ["WBS 3.4 and milestone M6", "WBS 3.4 and M6 are the browser version, which came with CR-02.", "WBS 3.4 и M6 — это браузерная версия, пришедшая с CR-02."],
          ["Milestone M7 and a time log", "M7 — task cards, code review, risk register, time log — came with CR-03.", "M7 — карточки задач, ревью кода, реестр рисков, журнал часов — пришла с CR-03."],
          ["WBS 4.3 and 4.4, milestones M11 and M12", "4.3, 4.4, M11 and M12 belong to the original plan, not to a change request.", "4.3, 4.4, M11 и M12 — из исходного плана, а не из запроса на изменение."],
        ], "CR-04 (5 Oct) added the accuracy study (4.1) and the lighting study (4.2) with milestones M8 (15 Oct) and M9 (18 Oct), answering risks R-01 and R-02.", "CR-04 (5 окт.) добавил исследование точности (4.1) и освещения (4.2) с вехами M8 (15 окт.) и M9 (18 окт.) — ответ на риски R-01 и R-02."),
        qx("Which change request is still pending at the midterm, and what is it about?", "CR-05: Windows via Electron, or drop the promise", [
          ["CR-04: the accuracy and lighting studies", "CR-04 was approved on 5 October.", "CR-04 одобрен 5 октября."],
          ["CR-02: the browser version at yeahtrack.site/app", "CR-02 was approved, and the browser version was completed on 4–5 October.", "CR-02 одобрен, а браузерная версия готова 4–5 октября."],
          ["CR-03: pull request review and the time log", "CR-03 was approved on 5 October together with CR-04.", "CR-03 одобрен 5 октября вместе с CR-04."],
        ], "CR-05 (open, major, pending): build a Windows version with Electron or remove the promise from the website; it is risk R-06, owned by Akbota, and M10 on 20 Oct includes the decision.", "CR-05 (открыт, крупный, ждёт решения): сделать Windows-версию на Electron или убрать обещание с сайта; это риск R-06, владелец Akbota, решение входит в веху M10 (20 окт.)."),
        qx("Which of these is NOT among the baselines updated in step 5 after a change is approved?", "The table of tools (Table 1)", [
          ["The WBS and milestones (Sections 4, 5)", "The WBS and milestones are updated in step 5, as with CR-04.", "WBS и вехи обновляются на шаге 5 — как при CR-04."],
          ["The scope lists in Section 3", "The scope lists are the first item of step 5, as with CR-01.", "Списки объёма — первый пункт шага 5, как при CR-01."],
          ["The quality baseline (Section 18)", "The quality baseline is in step 5 and can change only through Section 6.", "Базовый план качества входит в шаг 5 и меняется только через раздел 6."],
        ], "Step 5 updates the scope lists (3), WBS and milestones (4, 5), cost baseline (17), quality baseline (18) and, where relevant, the risk register (14). Table 1 is a list of tools, not a baseline.", "Шаг 5 обновляет списки объёма (3), WBS и вехи (4, 5), базовый план затрат (17), качества (18) и при необходимости реестр рисков (14). Таблица 1 — список инструментов, а не базовый план."),
        qx("Why is the change procedure in our plan called integrated change control?", "One procedure weighs a change against all baselines", [
          ["It is built into GitHub through issues and labels", "GitHub is only the tool; ‘integrated’ means scope, time, cost, quality and risk are judged together.", "GitHub — лишь инструмент; ‘интегрированное’ значит, что объём, сроки, стоимость, качество и риски оцениваются вместе."],
          ["It merges every member's code into the main branch", "That is continuous integration of code, a software term, not PM integration.", "Это непрерывная интеграция кода (CI) — термин разработки, а не интеграция в управлении проектом."],
          ["It puts minor and major changes into one class", "The procedure keeps two classes, minor and major (Table 4).", "Процедура сохраняет два класса — мелкие и крупные (таблица 4)."],
        ], "L1 integration management: the PM integrates developing, executing and changing the plan. Step 2 assesses six areas at once and step 5 updates every affected baseline.", "Управление интеграцией (L1): руководитель связывает разработку, выполнение и изменение плана. Шаг 2 оценивает сразу шесть областей, шаг 5 обновляет каждый затронутый базовый план."),
        qx("In Kerzner's planning terms (L2), what are our seven change-control steps?", "A procedure: a detailed method for a policy", [
          ["A policy: a general guide for decisions", "Our policy is the rule that no member may change the scope alone; the steps carry it out.", "Наша политика — правило ‘никто не меняет объём в одиночку’; шаги его выполняют."],
          ["A standard: an acceptable level of performance", "Standards resemble our acceptance criteria and quality targets, not a step-by-step method.", "Стандарты похожи на наши критерии приёмки и цели качества, а не на пошаговый метод."],
          ["A forecast: a projection of what will happen", "A forecast predicts the future; the steps prescribe what to do.", "Прогноз предсказывает будущее, а шаги предписывают действия."],
        ], "L2: a policy is a general guide for decision-making; a procedure is a detailed method for carrying out a policy — our seven steps carry out ‘no member may change the scope alone’.", "L2: политика — общий ориентир для решений; процедура — подробный способ выполнять политику. Наши семь шагов выполняют правило ‘никто не меняет объём в одиночку’."),
        qx("Development finished about three weeks early. Why did the team keep the schedule baseline unchanged?", "So the variance against the plan stays visible", [
          ["Because M3–M5 were deleted from Table 2", "M3–M5 are still in Table 2, marked ‘completed early’ with their actual dates.", "M3–M5 по-прежнему в таблице 2 с пометкой ‘completed early’ и фактическими датами."],
          ["Because the project will now finish on 15 October", "The project does not finish early: user testing starts on 20 October in any case, and the end is 4 November.", "Проект не закончится раньше: тест с пользователями начнётся 20 октября в любом случае, а конец — 4 ноября."],
          ["Because only the sponsor may change any baseline", "Baselines change through the team's Section 6 procedure; the sponsor accepts the plan and the deliverables.", "Базовые планы меняются через процедуру раздела 6 силами команды; спонсор принимает план и результаты."],
        ], "The report: the baseline has been kept unchanged to keep the variance visible; the gained time goes to the accuracy and lighting studies (4.1, 4.2).", "В отчёте: базовый план не меняли, чтобы отклонение было видно; выигранное время идёт на исследования точности и освещения (4.1, 4.2)."),
        qx("A delay in the lighting study would move milestone M9. How does our plan treat this?", "As a change under Section 6, with a new date", [
          ["The owner fixes it alone and the baseline stays", "That rule covers only delays of up to two days that affect no milestone.", "Это правило только для задержек до двух дней, не затрагивающих вехи."],
          ["M9 just moves by itself on the Gantt chart", "Milestones never move silently: moving one is a major criterion in Table 4.", "Вехи не сдвигаются молча: сдвиг вехи — признак крупного изменения в таблице 4."],
          ["The testing phase is cut to win the time back", "The plan does the opposite: minor features are reduced, testing is not shortened.", "План делает наоборот: урезают второстепенные функции, а не тестирование."],
        ], "Section 11: a delay that would move a milestone is a change under Section 6 — the team agrees on a new date, the baseline is updated and the reason goes into the GitHub issue. L2: moving milestones needs higher-level approval.", "Раздел 11: задержка, сдвигающая веху, — это изменение по разделу 6: команда согласует новую дату, базовый план обновляется, причина записывается в GitHub issue. L2: сдвиг вех требует решения уровнем выше."),
        qx("Examiner: ‘CR-01 and CR-02 came before your pull request review existed.’ What is the best answer?", "True; since 5 October all changes are reviewed", [
          ["Not true: every change was always reviewed", "Denies a fact: until 5 October changes were committed directly to the main branch.", "Отрицает факт: до 5 октября изменения коммитили прямо в основную ветку."],
          ["They were small, so they did not need a review", "Both were major changes, removing and adding features; size is not the excuse.", "Оба изменения крупные — убрали и добавили функции; размер тут не оправдание."],
          ["Review is optional for us, so it does not matter", "Undermines the plan: since 5 October every change needs a reviewed pull request.", "Подрывает собственный план: с 5 октября каждое изменение требует pull request с ревью."],
        ], "Honest and exact: PR review came with CR-03 on 5 October; before that, changes went straight to the main branch. Since then step 6 applies to every change.", "Честно и точно: ревью pull request пришло с CR-03 5 октября, до этого изменения шли прямо в основную ветку. С тех пор шаг 6 применяется к каждому изменению."),
        qx("Examiner: ‘Seven steps for four students — isn't that too heavy for an Agile team?’ What is the best answer?", "Minor changes are approved the same day in Telegram", [
          ["Yes, so we skip it when we are short of time", "Admits breaking our own plan; the procedure applies to every change.", "Признаёт нарушение собственного плана; процедура действует для любого изменения."],
          ["The instructor required it, but we do not really use it", "Blames the instructor and contradicts the change log with its five entries.", "Перекладывает вину на преподавателя и противоречит журналу изменений с пятью записями."],
          ["Agile teams never change their plans anyway", "Wrong about Agile: iterative work expects change, which is why a fast minor path exists.", "Неверно про Agile: итеративная работа ожидает изменений — поэтому и есть быстрый путь для мелких."],
        ], "The procedure is light where it can be: minor changes need only the area owner and Ayat, usually the same day; only major changes wait for the meeting and all four members.", "Процедура лёгкая там, где можно: мелким изменениям нужны только владелец области и Ayat, обычно в тот же день; до встречи и согласия всех четверых ждут только крупные."),
      ],
    ),
  ],
};
