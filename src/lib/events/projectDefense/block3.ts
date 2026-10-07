import { part, qx, tfx, type Lecture } from "../types";

export const block3: Lecture = {
  id: "pd-b3",
  title: { en: "Block 3 — Schedule", ru: "Блок 3 — Расписание" },
  parts: [
    part(
      "pd-b3-p1",
      { en: "WBS and milestones", ru: "WBS и вехи" },
      {
        en: `## What we wrote: four phases and the WBS
Sections 4, 5 and 10.2 of the report say **what** is done, **by whom** and **when**. The work is divided into **four phases**:
- **Planning** — collecting the requirements and agreeing on the list of gestures and commands.
- **Design** — the system architecture and the user interface mockups.
- **Development** — the **longest phase**: hand tracking, gesture training and command mapping; **gesture training is the core** of the application.
- **Testing and launch** — the accuracy and lighting studies, user testing with 30 participants, bug fixing, the user guide and the final demonstration.
| WBS code | Work package | Responsible | Start | End |
|---|---|---|---|---|
| **1** | **Planning** |  | 1 Sep | 5 Sep |
| 1.1 | Requirements | Whole team | 1 Sep | 3 Sep |
| 1.2 | Gesture and command list | Whole team | 3 Sep | 5 Sep |
| **2** | **Design** |  | 5 Sep | 12 Sep |
| 2.1 | System design and UI mockups | Ayat | 5 Sep | 12 Sep |
| **3** | **Development** |  | 12 Sep | 20 Oct |
| 3.1 | Hand tracking | Ayat | 12 Sep | 19 Sep |
| 3.2 | Gesture training | Yernar | 19 Sep | 10 Oct |
| 3.3 | Command mapping and settings | Aizat | 3 Oct | 20 Oct |
| 3.4 | Browser version (added) | Ayat, Yernar | 4 Oct | 5 Oct |
| **4** | **Testing and launch** |  | 6 Oct | 4 Nov |
| 4.1 | Accuracy study on real video (added) | Aizat, Ayat | 6 Oct | 15 Oct |
| 4.2 | Lighting study (added) | Aizat | 13 Oct | 18 Oct |
| 4.3 | User testing (30 users) and bug fixing | Aizat, Akbota | 20 Oct | 1 Nov |
| 4.4 | User guide and final demonstration | Whole team | 1 Nov | 4 Nov |
- Every work package has a **code**, a **responsible person** and planned **start and end dates**. Since 5 October each one is a **task card** (a GitHub issue) with an owner; the first eight cards correspond to the open risks.
- A package is **complete** only when its card is **closed** and the related code is **merged after review**.
- **Durations** were estimated by the people responsible for each task. **Gesture training got the longest duration, three weeks**, because it was the area in which the team had the **least experience**.
- Packages **3.4, 4.1 and 4.2 were added on 5 October 2026** and are marked as added both in Table 3 and in the Gantt chart (Figure 5).
## What we wrote: twelve milestones
M1–M5 and M10–M12 belong to the **original plan**; **M6–M9 were added on 5 October 2026** through the change procedure (Section 6). On 5 October **7 of 12 milestones are reached**, and **M3, M4 and M5 were reached early**.
| # | Milestone | Target date | Status on 5 October |
|---|---|---|---|
| M1 | Project plan approved | 5 Sep 2026 | Completed |
| M2 | Requirements and design ready | 12 Sep 2026 | Completed |
| M3 | First working version: hand tracking and swipes | 19 Sep 2026 | **Completed early, 12 Sep** |
| M4 | Prototype: user can train and recognise one gesture | 3 Oct 2026 | **Completed early, 16 Sep** |
| M5 | Gesture training complete | 10 Oct 2026 | **Completed early, 16 Sep** |
| M6 | Browser version online at yeahtrack.site/app (added) | 5 Oct 2026 | Completed |
| M7 | Process controls in place: task cards, code review, risk register, time log (added) | 5 Oct 2026 | Completed |
| M8 | Accuracy measured on real video (risk R-01, added) | 15 Oct 2026 | Planned |
| M9 | Lighting study complete (risk R-02, added) | 18 Oct 2026 | Planned |
| M10 | All features ready; decision on Windows made | 20 Oct 2026 | In progress |
| M11 | User testing with 30 participants complete | 1 Nov 2026 | Not started |
| M12 | User guide and final presentation | 4 Nov 2026 | Not started |
The additions come from the change log (Table 5):
| Change | Date | What it added to the schedule |
|---|---|---|
| CR-02 | 4 Oct | WBS 3.4, the browser version at yeahtrack.site/app |
| CR-03 | 5 Oct | M7: task cards, pull request review, risk register, time log |
| CR-04 | 5 Oct | WBS 4.1 and 4.2, milestones M8 and M9 |
- If a milestone is at risk, the **owner of the related work informs the team as soon as the risk is noticed**, so the schedule is adjusted jointly rather than on the day of the deadline.
- **M8 (15 Oct)** and **M9 (18 Oct)** are the dates by which two score-9 risks are checked: **R-01** (accuracy measured only on synthetic hands) and **R-02** (lighting not studied).
- **M10 (20 Oct)** also contains the **decision on Windows** — the open change request **CR-05** (risk R-06).
## The theory behind it
- **Planning** (L2) is determining **what** needs to be done, **by whom** and **by when**. Table 3 answers all three: the package, the responsible person and the dates.
- Of the nine components of planning in L2, the WBS with its dates is the **schedule** (when activities start and finish), and our goal, “a working application by 4 November 2026”, is what L2 calls an **objective** — a goal to be achieved by a certain time.
- In network terms (L2), a work package is an **activity** — an element of work that must be accomplished — and a milestone is an **event**: a point when an activity starts or finishes.
- **Duration vs effort** (L2): gesture training (3.2) has a **duration** of three weeks on the calendar, but the **effort** inside it is smaller — each member plans about 8–12 hours a week.
- L2: **the project's requirements set the major milestones**. Our M11 (user testing with 30 participants, 1 Nov) comes straight from the objective “test the application with at least 30 users”.
- L2: planning is an **iterative process performed throughout the life of the project** — that is why packages and milestones could be added on 5 October without hiding the original plan.
- The WBS is also the base for cost: the hours of each package were multiplied by the hourly rate of the person doing it — L3 calls this **pricing out the work breakdown structure**.
> The WBS says what and who, the milestones say when — and every addition is marked as added, so the examiner sees both what we promised and what we changed.
## How to say it at the defense
- **Say:** “We split the work into four phases — planning, design, development, and testing and launch — and every work package has a code, an owner and dates.”
- **Say:** “Each work package is a task card on GitHub, and it is complete only when the card is closed and the code is merged after review.”
- **Say:** “Seven of our twelve milestones are reached; M3 was reached on 12 September, and M4 and M5 on 16 September, ahead of the plan.”
- **Say:** “Packages 3.4, 4.1 and 4.2 and milestones M6 to M9 were added on 5 October through our change procedure, and they are marked as added.”
- **Say:** “Milestones M8 and M9 check two of our score-nine risks, R-01 and R-02: accuracy on real video and lighting.”
## Weak spots and honest answers
- **“M6–M9 were added on the day of the midterm — did you write the plan after the fact?”** Do not deny it: they were added on 5 October through the change procedure (change log, Table 5) and are marked as added, while M1–M5 and M10–M12 keep their original dates, so nothing is hidden.
- **“M4 and M5 were planned for 3 and 10 October but done on 16 September — were your estimates bad?”** The owners estimated the durations, and gesture training got three weeks because it was our least familiar area. We kept the baseline unchanged to keep the variance visible — and early code is not early verification: all measurements so far are on synthetic hands.
## Check yourself
?? Which milestones were reached early, and on which dates?
?= M3 (target 19 Sep) on 12 Sep; M4 (target 3 Oct) and M5 (target 10 Oct) on 16 Sep.
?? Which work packages were added on 5 October, and what do the added studies check?
?= 3.4 Browser version, 4.1 Accuracy study on real video and 4.2 Lighting study. 4.1 and 4.2 (with M8 and M9) check accuracy on real people and lighting — risks R-01 and R-02.`,
        ru: `## Что мы написали: четыре фазы и WBS
Разделы 4, 5 и 10.2 отчёта отвечают, **что** делается, **кем** и **когда**. Работа разбита на **четыре фазы**:
- **Planning (планирование)** — сбор требований и согласование списка жестов и команд.
- **Design (проектирование)** — архитектура системы и макеты интерфейса.
- **Development (разработка)** — **самая длинная фаза**: отслеживание руки, обучение жестам и привязка команд; **обучение жестам — ядро** приложения.
- **Testing and launch (тестирование и запуск)** — исследования точности и освещения, тестирование с 30 участниками, исправление ошибок, руководство пользователя и финальная демонстрация.
| Код WBS | Пакет работ | Ответственный | Начало | Конец |
|---|---|---|---|---|
| **1** | **Планирование** |  | 1 сен | 5 сен |
| 1.1 | Требования | Вся команда | 1 сен | 3 сен |
| 1.2 | Список жестов и команд | Вся команда | 3 сен | 5 сен |
| **2** | **Проектирование** |  | 5 сен | 12 сен |
| 2.1 | Архитектура системы и макеты интерфейса | Ayat | 5 сен | 12 сен |
| **3** | **Разработка** |  | 12 сен | 20 окт |
| 3.1 | Отслеживание руки | Ayat | 12 сен | 19 сен |
| 3.2 | Обучение жестам | Yernar | 19 сен | 10 окт |
| 3.3 | Привязка команд и настройки | Aizat | 3 окт | 20 окт |
| 3.4 | Браузерная версия (добавлен) | Ayat, Yernar | 4 окт | 5 окт |
| **4** | **Тестирование и запуск** |  | 6 окт | 4 ноя |
| 4.1 | Исследование точности на реальном видео (добавлен) | Aizat, Ayat | 6 окт | 15 окт |
| 4.2 | Исследование освещения (добавлен) | Aizat | 13 окт | 18 окт |
| 4.3 | Тестирование с пользователями (30 человек) и исправление ошибок | Aizat, Akbota | 20 окт | 1 ноя |
| 4.4 | Руководство пользователя и финальная демонстрация | Вся команда | 1 ноя | 4 ноя |
- У каждого пакета есть **код**, **ответственный** и плановые **даты начала и конца**. С 5 октября каждый пакет — это **карточка задачи** (issue на GitHub) с владельцем; первые восемь карточек соответствуют открытым рискам.
- Пакет считается **завершённым**, только когда его карточка **закрыта**, а код **влит после ревью**.
- **Длительности** оценивали сами ответственные за задачи. **Обучению жестам дали самую большую длительность — три недели**, потому что в этой области у команды было **меньше всего опыта**.
- Пакеты **3.4, 4.1 и 4.2 добавлены 5 октября 2026** и помечены как добавленные и в Table 3, и на диаграмме Ганта (Figure 5).
## Что мы написали: двенадцать вех
M1–M5 и M10–M12 — из **исходного плана**; **M6–M9 добавлены 5 октября 2026** через процедуру изменений (раздел 6). На 5 октября **достигнуто 7 вех из 12**, причём **M3, M4 и M5 — досрочно**.
| # | Веха (milestone) | Плановая дата | Статус на 5 октября |
|---|---|---|---|
| M1 | План проекта утверждён | 5 сен 2026 | Выполнено |
| M2 | Требования и дизайн готовы | 12 сен 2026 | Выполнено |
| M3 | Первая рабочая версия: отслеживание руки и свайпы | 19 сен 2026 | **Досрочно, 12 сен** |
| M4 | Прототип: пользователь обучает и распознаёт один жест | 3 окт 2026 | **Досрочно, 16 сен** |
| M5 | Обучение жестам завершено | 10 окт 2026 | **Досрочно, 16 сен** |
| M6 | Браузерная версия онлайн на yeahtrack.site/app (добавлена) | 5 окт 2026 | Выполнено |
| M7 | Контроль процесса: карточки задач, ревью кода, реестр рисков, журнал часов (добавлена) | 5 окт 2026 | Выполнено |
| M8 | Точность измерена на реальном видео (риск R-01, добавлена) | 15 окт 2026 | Запланировано |
| M9 | Исследование освещения завершено (риск R-02, добавлена) | 18 окт 2026 | Запланировано |
| M10 | Все функции готовы; решение по Windows принято | 20 окт 2026 | В работе |
| M11 | Тестирование с 30 участниками завершено | 1 ноя 2026 | Не начато |
| M12 | Руководство пользователя и финальная презентация | 4 ноя 2026 | Не начато |
Добавления пришли из журнала изменений (Table 5):
| Изменение | Дата | Что добавило в расписание |
|---|---|---|
| CR-02 | 4 окт | WBS 3.4 — браузерную версию на yeahtrack.site/app |
| CR-03 | 5 окт | M7: карточки задач, ревью pull request, реестр рисков, журнал часов |
| CR-04 | 5 окт | WBS 4.1 и 4.2, вехи M8 и M9 |
- Если веха под угрозой, **владелец связанной работы сообщает команде сразу, как заметил риск**, — расписание правят вместе, а не в день дедлайна.
- **M8 (15 окт)** и **M9 (18 окт)** — даты, к которым проверяются два риска с баллом 9: **R-01** (точность мерили только на синтетических руках) и **R-02** (освещение не изучено).
- **M10 (20 окт)** включает и **решение по Windows** — открытый запрос на изменение **CR-05** (риск R-06).
## Теория за этим
- **Планирование** (L2) — это решить, **что** нужно сделать, **кем** и **к какому сроку**. Table 3 отвечает на все три вопроса: пакет, ответственный и даты.
- Из девяти компонентов планирования в L2 WBS с датами — это **schedule (расписание)**: когда работы начинаются и заканчиваются, а наша цель «рабочее приложение к 4 ноября 2026» — то, что L2 называет **objective**: цель, достигаемая к определённому сроку.
- В терминах сетей (L2) пакет работ — это **activity (работа)**, элемент работы, который надо выполнить, а веха — **event (событие)**: момент, когда работа начинается или заканчивается.
- **Duration и effort** (L2): у обучения жестам (3.2) **длительность** — три недели по календарю, а **трудозатраты** внутри неё меньше — каждый участник планирует примерно 8–12 часов в неделю.
- L2: **основные вехи задают требования проекта**. Наша M11 (тестирование с 30 участниками, 1 ноя) прямо следует из задачи «протестировать приложение минимум на 30 пользователях».
- L2: планирование — **итеративный процесс на всём протяжении проекта**, поэтому пакеты и вехи можно было добавить 5 октября, не пряча исходный план.
- WBS — ещё и основа стоимости: часы каждого пакета умножили на часовую ставку исполнителя — в L3 это **pricing out the work breakdown structure (оценка WBS в деньгах)**.
> WBS говорит «что и кто», вехи — «когда»; каждое добавление помечено как добавленное, поэтому экзаменатор видит и то, что мы обещали, и то, что изменили.
## Как сказать на защите
- **Скажи:** «We split the work into four phases — planning, design, development, and testing and launch — and every work package has a code, an owner and dates.» — четыре фазы, у каждого пакета код, владелец и даты.
- **Скажи:** «Each work package is a task card on GitHub, and it is complete only when the card is closed and the code is merged after review.» — пакет готов, только когда карточка закрыта и код влит после ревью.
- **Скажи:** «Seven of our twelve milestones are reached; M3 was reached on 12 September, and M4 and M5 on 16 September, ahead of the plan.» — 7 из 12 вех, M3–M5 досрочно.
- **Скажи:** «Packages 3.4, 4.1 and 4.2 and milestones M6 to M9 were added on 5 October through our change procedure, and they are marked as added.» — добавления прошли через процедуру изменений и помечены.
- **Скажи:** «Milestones M8 and M9 check two of our score-nine risks, R-01 and R-02: accuracy on real video and lighting.» — M8 и M9 проверяют риски R-01 и R-02.
## Слабые места и честные ответы
- **«M6–M9 добавлены в день мидтерма — вы написали план задним числом?»** Не отрицай: их добавили 5 октября через процедуру изменений (журнал изменений, Table 5) и пометили как добавленные, а M1–M5 и M10–M12 остались с исходными датами — ничего не спрятано.
- **«M4 и M5 планировались на 3 и 10 октября, а сделаны 16 сентября — оценки были плохими?»** Длительности оценивали владельцы задач, и обучению жестам дали три недели как самой незнакомой области. Базовый план не меняли, чтобы отклонение было видно, — а ранний код ещё не ранняя проверка: все измерения пока на синтетических руках.
## Проверь себя
?? Какие вехи достигнуты досрочно и когда?
?= M3 (план 19 сен) — 12 сен; M4 (план 3 окт) и M5 (план 10 окт) — 16 сен.
?? Какие пакеты работ добавлены 5 октября и что проверяют добавленные исследования?
?= 3.4 Браузерная версия, 4.1 Исследование точности на реальном видео и 4.2 Исследование освещения. 4.1 и 4.2 (вместе с M8 и M9) проверяют точность на реальных людях и освещение — риски R-01 и R-02.`,
      },
      [
        qx("How many phases does the YeahTrack WBS have, and which one is the longest?", "Four; Development is the longest", [
          ["Three; Testing and launch is the longest", "Table 3 has four phases — Planning, Design, Development, Testing and launch — and the report names Development as the longest.", "В Table 3 четыре фазы — Planning, Design, Development, Testing and launch, и самой длинной отчёт называет Development."],
          ["Four; Testing and launch is the longest", "Testing and launch runs 6 Oct – 4 Nov; the report calls Development (12 Sep – 20 Oct) the longest phase.", "Testing and launch идёт 6 окт – 4 ноя; самой длинной отчёт называет Development (12 сен – 20 окт)."],
          ["Five; Design is the longest", "There is no fifth phase, and Design is one of the shortest: 5–12 Sep.", "Пятой фазы нет, а Design — одна из самых коротких: 5–12 сен."],
        ], "Four phases: Planning, Design, Development, and Testing and launch. Development (12 Sep – 20 Oct) is the longest; gesture training is its core.", "Четыре фазы: Planning, Design, Development и Testing and launch. Самая длинная — Development (12 сен – 20 окт), её ядро — обучение жестам."),
        qx("Who is responsible for WBS 3.2 Gesture training in Table 3?", "Yernar", [
          ["Ayat", "Ayat owns 2.1 System design and 3.1 Hand tracking; 3.2 is Yernar's package.", "За Ayat — 2.1 System design и 3.1 Hand tracking; 3.2 — пакет Yernar."],
          ["Aizat", "Aizat owns 3.3 Command mapping and settings, which overlaps 3.2 from 3 Oct, not 3.2 itself.", "За Aizat — 3.3 Command mapping and settings, который накладывается на 3.2 с 3 окт, а не сам 3.2."],
          ["Akbota", "Akbota shares 4.3 User testing with Aizat; 3.2 has another owner.", "Akbota делит с Aizat пакет 4.3 User testing; у 3.2 другой владелец."],
        ], "Table 3: 3.2 Gesture training — Yernar, 19 Sep – 10 Oct.", "Table 3: 3.2 Gesture training — Yernar, 19 сен – 10 окт."),
        qx("Which of these work packages does Aizat own alone in Table 3?", "4.2 Lighting study", [
          ["3.1 Hand tracking", "3.1 Hand tracking (12–19 Sep) belongs to Ayat.", "3.1 Hand tracking (12–19 сен) — пакет Ayat."],
          ["4.1 Accuracy study on real video", "Aizat owns 4.1 together with Ayat, not alone.", "4.1 Aizat ведёт вместе с Ayat, а не в одиночку."],
          ["4.3 User testing and bug fixing", "4.3 is shared by Aizat and Akbota.", "4.3 Aizat делит с Akbota."],
        ], "Aizat alone owns 3.3 Command mapping and 4.2 Lighting study (13–18 Oct); 4.1 and 4.3 are shared.", "Одна Aizat ведёт 3.3 Command mapping и 4.2 Lighting study (13–18 окт); 4.1 и 4.3 — совместные."),
        qx("Which three work packages were added to the WBS on 5 October 2026?", "3.4, 4.1 and 4.2", [
          ["3.3, 4.1 and 4.2", "3.3 Command mapping is in the original baseline (3–20 Oct); the added one is 3.4 Browser version.", "3.3 Command mapping есть в исходном базовом плане (3–20 окт); добавлен 3.4 Browser version."],
          ["3.4, 4.2 and 4.3", "4.3 User testing was always in the plan; 4.1 Accuracy study is the added one.", "4.3 User testing был в плане с самого начала; добавлен 4.1 Accuracy study."],
          ["4.1, 4.2 and 4.4", "4.4 User guide and final demonstration is original; 3.4 Browser version is the third added package.", "4.4 User guide and final demonstration — исходный пакет; третий добавленный — 3.4 Browser version."],
        ], "Packages 3.4 (browser version), 4.1 (accuracy study) and 4.2 (lighting study) were added on 5 October and are marked as added.", "Пакеты 3.4 (браузерная версия), 4.1 (исследование точности) и 4.2 (исследование освещения) добавлены 5 октября и помечены как added."),
        qx("What were the target date and the actual date of M3, the first working version?", "Target 19 Sep, reached early on 12 Sep", [
          ["Target 12 Sep, reached on time on 12 Sep", "12 Sep is the target of M2 (requirements and design); M3 was due on 19 Sep.", "12 сен — плановая дата M2 (требования и дизайн); M3 планировалась на 19 сен."],
          ["Target 19 Sep, reached early on 16 Sep", "16 Sep is when M4 and M5 were reached; M3 came earlier, on 12 Sep.", "16 сен достигнуты M4 и M5; M3 — раньше, 12 сен."],
          ["Target 3 Oct, reached early on 16 Sep", "That is M4 (prototype: train and recognise one gesture), not M3.", "Это M4 (прототип: обучить и распознать один жест), а не M3."],
        ], "M3 (hand tracking and swipes) was planned for 19 Sep and completed early, on 12 Sep.", "M3 (отслеживание руки и свайпы) планировалась на 19 сен и выполнена досрочно, 12 сен."),
        qx("On 5 October, how many of the 12 milestones had been reached?", "7 — M1 to M7", [
          ["5 — M1 to M5", "M6 and M7 were added and completed on 5 October, so they count as reached too.", "M6 и M7 добавлены и выполнены 5 октября, поэтому тоже считаются достигнутыми."],
          ["8 — M1 to M8", "M8 (accuracy on real video) is planned for 15 October and has not been reached.", "M8 (точность на реальном видео) запланирована на 15 октября и ещё не достигнута."],
          ["6 — M1 to M5 and M10", "M10 is in progress on 5 October, not reached; and M6, M7 are missing.", "M10 на 5 октября в работе, а не достигнута; к тому же пропущены M6 и M7."],
        ], "M1–M7 are completed (M3–M5 early), M8–M9 are planned, M10 is in progress and M11–M12 are not started: 7 of 12.", "M1–M7 выполнены (M3–M5 досрочно), M8–M9 запланированы, M10 в работе, M11–M12 не начаты: 7 из 12."),
        qx("Which milestone has the status ‘In progress’ on 5 October?", "M10 — features ready, Windows decided", [
          ["M8 — accuracy measured on real video", "M8 is Planned for 15 October; the accuracy study 4.1 starts on 6 October.", "M8 в статусе Planned на 15 октября; исследование точности 4.1 начинается 6 октября."],
          ["M11 — user testing with 30 participants complete", "M11 (1 Nov) is Not started; user testing begins on 20 October.", "M11 (1 ноя) в статусе Not started; тестирование начинается 20 октября."],
          ["M5 — gesture training complete", "M5 is already Completed, early, on 16 September.", "M5 уже выполнена — досрочно, 16 сентября."],
        ], "M10, All features ready; decision on Windows made (20 Oct), is the only milestone In progress on 5 October.", "M10, All features ready; decision on Windows made (20 окт), — единственная веха в статусе In progress на 5 октября."),
        tfx("Milestones M1–M5 and M10–M12 belong to the original plan, while M6–M9 were added on 5 October 2026.", true,
          "True: Section 4 says exactly this — M6 to M9 were added on 5 October through the change procedure and are marked as added.",
          "Верно: в разделе 4 сказано именно так — M6–M9 добавлены 5 октября через процедуру изменений и помечены как добавленные.",
          "False would mean all twelve milestones were planned from the start, but the report marks M6–M9 as added on 5 October.",
          "Ответ «неверно» означал бы, что все двенадцать вех были в плане с начала, а отчёт помечает M6–M9 как добавленные 5 октября."),
        qx("Milestones M8 and M9 were added to check which two open risks?", "R-01 and R-02: accuracy and lighting unknown", [
          ["R-03 and R-06: single author, no Windows", "R-03 is answered by areas of responsibility and PR review; R-06 by the Windows decision at M10 (CR-05).", "На R-03 отвечают зоны ответственности и ревью PR; на R-06 — решение по Windows в M10 (CR-05)."],
          ["R-04 and R-05: local storage, GNOME-only build", "R-04 is handled by export and import of gestures, R-05 by stating the limitation — not by a milestone.", "R-04 закрывают экспорт и импорт жестов, R-05 — указанием ограничения, а не вехой."],
          ["R-07 and R-12: slow first load, manual tests", "R-07 and R-12 are score-4 risks owned by Yernar; M8 and M9 are tied to R-01 and R-02.", "R-07 и R-12 — риски с баллом 4 у Yernar; M8 и M9 привязаны к R-01 и R-02."],
        ], "M8 is Accuracy measured on real video (risk R-01) and M9 is Lighting study complete (risk R-02) — both risks score 9.", "M8 — Accuracy measured on real video (риск R-01), M9 — Lighting study complete (риск R-02); у обоих рисков балл 9."),
        qx("When is a YeahTrack work package considered complete?", "Its card is closed and its code is merged after review", [
          ["Its owner says it is done in Telegram at the next check-in", "A report in Telegram is not enough; Section 10.2 requires a closed card and a reviewed merge.", "Сообщения в Telegram мало; раздел 10.2 требует закрытой карточки и влитого после ревью кода."],
          ["Its end date in Table 3 has passed", "Dates show the plan, not completion; 3.2 was working long before its end date.", "Даты — это план, а не готовность; 3.2 заработал задолго до своей даты окончания."],
          ["All 30 test users have tried it", "Testing with 30 users is package 4.3 and milestone M11, not the completion rule for every package.", "Тестирование на 30 пользователях — это пакет 4.3 и веха M11, а не правило готовности каждого пакета."],
        ], "Section 10.2: a work package is complete when its card is closed and the related code has been merged after review.", "Раздел 10.2: пакет готов, когда его карточка закрыта, а связанный код влит после ревью."),
        qx("In L2 network terms, what are the YeahTrack milestones M1–M12?", "Events — points where activities start or finish", [
          ["Activities — elements of work to be accomplished", "Activities are the work packages (1.1–4.4); milestones mark points in time.", "Activities — это пакеты работ (1.1–4.4); вехи отмечают моменты времени."],
          ["Durations — total time needed for each activity", "Duration is the length of an activity, such as three weeks for 3.2, not a milestone.", "Duration — это длина работы, например три недели у 3.2, а не веха."],
          ["Slack — the time an activity can slip without delaying the end", "Slack is spare time on a path (TL − TE), not a milestone.", "Slack — запас времени на пути (TL − TE), а не веха."],
        ], "L2: an event is equivalent to a milestone, indicating when an activity starts or finishes; activities are the elements of work.", "L2: event (событие) равнозначно вехе и отмечает начало или конец работы; activities — это элементы работы."),
        qx("Table 3 gives every package an owner and dates. Which L2 definition of planning does this match?", "Deciding what is done, by whom and by when", [
          ["Pricing each task and deciding who pays", "That is estimating and the budget (L3, Sections 8–9), not the L2 definition of planning.", "Это оценка и бюджет (L3, разделы 8–9), а не определение планирования из L2."],
          ["Listing the risks and the response to each one", "That is risk management (Sections 13–14); the L2 definition is about work, people and dates.", "Это управление рисками (разделы 13–14); определение L2 — о работе, людях и сроках."],
          ["Giving the project manager authority", "Documenting the manager's authority is the purpose of the project charter, not of planning as such.", "Закрепить полномочия руководителя — задача устава проекта (charter), а не планирования как такового."],
        ], "L2: planning is determining what needs to be done, by whom, and by when — exactly the columns of Table 3.", "L2: планирование — решить, что нужно сделать, кем и к какому сроку, — ровно колонки Table 3."),
        qx("Gesture training (3.2) spans three weeks, but members work 8–12 hours a week. Which L2 distinction does this show?", "Duration versus effort of an activity", [
          ["Critical versus non-critical path", "The critical path is about which activities set the end date, not about hours inside one activity.", "Критический путь — о том, какие работы задают дату окончания, а не о часах внутри одной работы."],
          ["Mandatory versus discretionary dependency", "Dependencies link two activities; here we compare calendar time and working time of one activity.", "Зависимости связывают две работы; здесь сравниваются календарное и рабочее время одной работы."],
          ["Early start versus late start", "ES and LS are dates used to compute slack, not the difference between calendar time and work.", "ES и LS — даты для расчёта резерва, а не разница между календарным временем и работой."],
        ], "L2: duration is the total time of an activity; effort is the work actually performed within it, which can be much less.", "L2: duration — полное время работы, effort — реально выполненный труд внутри неё, он может быть гораздо меньше."),
        qx("Examiner: ‘M6–M9 were added on 5 October, the midterm day. Did you write the plan after the fact?’ Best answer?", "Yes, on 5 Oct, through the change procedure, marked as added", [
          ["No, M6–M9 have been in the plan since 1 September", "This denies the report: Section 4 says M6–M9 were added on 5 October.", "Это отрицает отчёт: в разделе 4 сказано, что M6–M9 добавлены 5 октября."],
          ["The instructor asked for them, so it was not our decision", "Blaming the instructor is not in the report; the team added them through its own change procedure.", "Перекладывать на преподавателя нельзя, в отчёте этого нет; команда добавила их своей процедурой изменений."],
          ["It does not matter, because the app already works well on real users", "Over-claiming: accuracy on real users is not measured yet — that is exactly what M8 is for.", "Преувеличение: точность на реальных людях ещё не измерена — для этого и нужна M8."],
        ], "Be honest: they were added on 5 October through the change procedure and marked as added; the original milestones keep their dates.", "Честно: их добавили 5 октября через процедуру изменений и пометили как добавленные; исходные вехи сохранили свои даты."),
        qx("Examiner: ‘M5 was due on 10 October but done on 16 September. Were your estimates wrong?’ Best answer?", "It was our least familiar area; we kept the variance visible", [
          ["No, M5 was moved to 16 September in the baseline", "This contradicts the report: the baseline was kept unchanged to keep the variance visible.", "Это противоречит отчёту: базовый план не меняли, чтобы отклонение было видно."],
          ["Yernar estimated it alone, so ask Yernar", "Blaming one member is a bad answer; the plan belongs to the whole team.", "Сваливать на одного участника — плохой ответ; план принадлежит всей команде."],
          ["Early finish proves it: real-user accuracy is above 90 percent", "Over-claiming: so far accuracy is measured only on synthetic hands (risk R-01).", "Преувеличение: пока точность мерили только на синтетических руках (риск R-01)."],
        ], "Gesture training got three weeks because the team had the least experience there; the baseline stays unchanged so the variance is visible.", "Обучению жестам дали три недели, потому что опыта там было меньше всего; базовый план не меняли, чтобы отклонение было видно."),
      ],
    ),
    part(
      "pd-b3-p2",
      { en: "Gantt, critical path and progress", ru: "Диаграмма Ганта, критический путь и прогресс" },
      {
        en: `## What we wrote: the Gantt chart
The **schedule baseline** is the WBS (Table 3, Figure 5) plus the milestone dates (Section 4). **Figure 5** shows it as a **Gantt chart**: hatched bars are the packages added on 5 October, red stars show the actual completion of M3–M5, and M6 and M7 were reached on 5 October.
![Gantt chart of the YeahTrack schedule baseline from 1 September to 4 November: bars for work packages 1.1 to 4.4, hatched bars for 3.4, 4.1 and 4.2 added on 5 October, diamonds for milestones, a dashed line at the 5 October midterm and red stars for the early completion of M3 to M5](/events/pm/yeahtrack-gantt.webp)
- **Durations** were estimated by the people responsible for each task; gesture training got the longest, **three weeks**, because the team had the least experience there.
- **Command mapping (3.3)** was scheduled to start on **3 October** to **overlap** with the end of gesture training (3.2 ends on 10 October).
- Since 5 October every package is a **task card** with an owner; the owner keeps it up to date and **reports at the check-in** if the task is likely to be late.
## What we wrote: two rules for delays
| Situation | What happens |
|---|---|
| A task is up to **two days late** and **no milestone** is affected | The owner resolves the delay with the members who depend on the task; the **baseline remains unchanged** |
| A delay **would move a milestone** | It is treated as a **change** under Section 6: the team agrees on a new date, the **baseline is updated** and the reason is recorded in the GitHub issue |
## What we wrote: planned vs actual on 5 October (Table 11)
| Work package | Planned | Actual |
|---|---|---|
| 3.1 Hand tracking and swipes | 12–19 Sep | Working on 12 Sep |
| 3.2 Gesture training | 19 Sep – 10 Oct | Working on 16 Sep; recognition later reworked to handle a tilted wrist |
| 3.3 Command mapping and settings | 3–20 Oct | Working on 16 Sep; media control and SQLite storage added on 3 Oct |
| 3.4 Browser version | Added | Completed on 4–5 Oct |
| 4.1–4.2 Accuracy and lighting studies | 6–18 Oct | Not started |
| 4.3 User testing and bug fixing | 20 Oct – 1 Nov | Not started |
| 4.4 User guide and final demonstration | 1–4 Nov | Project video recorded; other parts not started |
- Development is **about three weeks ahead** of the baseline, but the project will **not finish early**: all measurements so far were made on **synthetic hands** generated by the test code.
- The gained time goes to the **accuracy and lighting studies (4.1, 4.2)**, not to new features.
- **User testing starts on 20 October in any case**. If other work is delayed, **minor features are reduced** instead of shortening testing, because the test with 30 users is the only way to confirm the objectives.
- The **baseline was kept unchanged to keep the variance visible**.
## The critical path (derived from Table 3)
The report has **no network diagram**, so the team derives the critical path from the dates in Table 3. It runs from 1 September to 4 November:
= 1.1 → 1.2 → 2.1 → 3.1 → 3.2 → 3.3 → 4.3 → 4.4
@diagram pm-network
- **3.3 starts on 3 October, a week before 3.2 ends** — an overlap (a lead), not a strict finish-to-start link.
- **4.1** (6–15 Oct) and **4.2** (13–18 Oct) run **in parallel with 3.3** and end before 4.3 starts on 20 October, so **4.2 has about two days of float**.
- **3.4** (4–5 Oct) is **off the critical path**.
- Development finished early, so the **critical chain today** is the fixed start of user testing on **20 Oct (M10) → 4.3 → 4.4 → 4 Nov**.
| Package | Dates | On the critical path? |
|---|---|---|
| 1.1 → 1.2 → 2.1 → 3.1 | 1–19 Sep | Yes |
| 3.2 Gesture training | 19 Sep – 10 Oct | Yes |
| 3.3 Command mapping and settings | 3–20 Oct | Yes — overlaps the last week of 3.2 |
| 3.4 Browser version | 4–5 Oct | No |
| 4.1 Accuracy study on real video | 6–15 Oct | No — runs in parallel with 3.3 |
| 4.2 Lighting study | 13–18 Oct | No — about two days of float |
| 4.3 User testing and bug fixing | 20 Oct – 1 Nov | Yes |
| 4.4 User guide and final demonstration | 1–4 Nov | Yes |
## The theory behind it
- L2 lists the scheduling techniques: **Gantt (bar) charts**, **milestone charts**, line of balance, **networks**, **PERT**, **CPM**, PDM and GERT. Figure 5 is a Gantt chart with milestones; a **network** adds the **interdependencies** of the activities.
- To turn a bar chart into a network, L2 asks three questions: what job **immediately precedes** this job, what job **immediately follows** it, and what jobs can **run concurrently**.
- **Critical path** — the **longest path** through the network; it **determines the duration** of the project and is also the shortest time in which the project can be done. It has **no slack**: any slip moves the end date unless it is recovered downstream.
= Slack time = TL − TE
- **Slack (float)**: TL is the latest date an event can take place without extending the project, TE the earliest expected date. About two days of float for 4.2 means it can slip about two days without delaying 4.3.
- **Dependencies** (L2): **mandatory** (hard logic — user testing needs the features to be ready), **discretionary** (soft logic — our choice to start 3.3 before 3.2 ends) and **external** (beyond the project manager's control).
- **Monitoring and control** (L1) means comparing actual outcome to predicted outcome and analysing variances — that is what Table 11 does. In earned-value terms (L4), early development gives **SV > 0** and **SPI > 1** at the midterm.
> Ahead in development does not mean ahead in the project: the critical chain is now 20 Oct → user testing → 4 Nov, and the gained time goes into verification on real people.
## How to say it at the defense
- **Say:** “We derived the critical path from Table 3: 1.1, 1.2, 2.1, 3.1, 3.2, 3.3, 4.3 and 4.4, from 1 September to 4 November.”
- **Say:** “Command mapping was planned to start on 3 October, a week before gesture training ends, so the two packages overlap.”
- **Say:** “The lighting study has about two days of float, and the browser version is off the critical path.”
- **Say:** “Development is about three weeks ahead, but we will not finish early, because all measurements so far are on synthetic hands.”
- **Say:** “We kept the baseline unchanged to keep the variance visible.”
- **Say:** “User testing starts on 20 October in any case; if something slips, we reduce minor features, not the testing.”
## Weak spots and honest answers
- **“There is no network diagram in your report.”** True — our baseline is Table 3 and the Gantt chart. Derive the path from the dates on the spot (1.1 → … → 4.4) and agree that a network diagram would be a useful addition.
- **“If you are three weeks ahead, why not finish early?”** Because development was checked only on synthetic hands: the gained time goes to 4.1 and 4.2, user testing starts on 20 October anyway, and the baseline stays unchanged so the variance is visible.
- **“Is gesture training still critical?”** In the baseline, yes. Today development is done early, and the critical chain is the fixed start of testing on 20 Oct (M10) → 4.3 → 4.4 → 4 Nov.
## Check yourself
?? What are the two rules for delays in the schedule management plan?
?= Up to two days late with no milestone affected — the owner resolves it with the members who depend on the task, and the baseline stays unchanged. A delay that would move a milestone is a change under Section 6: a new date is agreed, the baseline is updated and the reason is recorded in the GitHub issue.
?? Why will YeahTrack not finish early although development is about three weeks ahead?
?= All measurements so far are on synthetic hands; the gained time goes to the accuracy and lighting studies (4.1, 4.2), and user testing starts on 20 October in any case.`,
        ru: `## Что мы написали: диаграмма Ганта
**Базовый план расписания (schedule baseline)** — это WBS (Table 3, Figure 5) плюс даты вех (раздел 4). **Figure 5** показывает его как **диаграмму Ганта**: штрихованные полосы — пакеты, добавленные 5 октября, красные звёзды — фактическое выполнение M3–M5, а M6 и M7 достигнуты 5 октября.
![Диаграмма Ганта базового плана YeahTrack с 1 сентября по 4 ноября: полосы пакетов 1.1–4.4, штрихованные полосы 3.4, 4.1 и 4.2, добавленных 5 октября, ромбы вех, пунктир на дате мидтерма 5 октября и красные звёзды досрочного выполнения M3–M5](/events/pm/yeahtrack-gantt.webp)
- **Длительности** оценивали ответственные за задачи; самую большую — **три недели** — получило обучение жестам, потому что опыта там у команды было меньше всего.
- **Привязку команд (3.3)** поставили с **3 октября**, чтобы она **перекрывалась** с концом обучения жестам (3.2 заканчивается 10 октября).
- С 5 октября каждый пакет — **карточка задачи** с владельцем; владелец держит её в актуальном виде и **говорит на созвоне**, если задача, скорее всего, опоздает.
## Что мы написали: два правила для задержек
| Ситуация | Что происходит |
|---|---|
| Задача опаздывает **не больше чем на два дня** и **ни одна веха** не затронута | Владелец решает вопрос с теми, кто зависит от задачи; **базовый план не меняется** |
| Задержка **сдвинула бы веху** | Это **изменение** по разделу 6: команда согласует новую дату, **базовый план обновляется**, причина записывается в issue на GitHub |
## Что мы написали: план и факт на 5 октября (Table 11)
| Пакет работ | План | Факт |
|---|---|---|
| 3.1 Отслеживание руки и свайпы | 12–19 сен | Работает с 12 сен |
| 3.2 Обучение жестам | 19 сен – 10 окт | Работает с 16 сен; распознавание потом переделали под наклон запястья |
| 3.3 Привязка команд и настройки | 3–20 окт | Работает с 16 сен; управление медиа и хранилище SQLite добавлены 3 окт |
| 3.4 Браузерная версия | Добавлен | Выполнен 4–5 окт |
| 4.1–4.2 Исследования точности и освещения | 6–18 окт | Не начаты |
| 4.3 Тестирование и исправление ошибок | 20 окт – 1 ноя | Не начато |
| 4.4 Руководство и финальная демонстрация | 1–4 ноя | Видео проекта записано; остальное не начато |
- Разработка **примерно на три недели впереди** базового плана, но проект **не закончится раньше**: все измерения пока сделаны на **синтетических руках**, которые генерирует тестовый код.
- Выигранное время идёт на **исследования точности и освещения (4.1, 4.2)**, а не на новые функции.
- **Тестирование с пользователями начинается 20 октября в любом случае**. Если другая работа задерживается, **урезают мелкие функции**, а не тестирование: тест на 30 пользователях — единственный способ подтвердить цели.
- **Базовый план оставили без изменений, чтобы отклонение было видно**.
## Критический путь (выведен из Table 3)
В отчёте **нет сетевого графика**, поэтому команда выводит критический путь из дат Table 3. Он идёт с 1 сентября по 4 ноября:
= 1.1 → 1.2 → 2.1 → 3.1 → 3.2 → 3.3 → 4.3 → 4.4
@diagram pm-network
- **3.3 начинается 3 октября, за неделю до конца 3.2** — это перекрытие (lead, опережение), а не строгая связь «финиш — старт».
- **4.1** (6–15 окт) и **4.2** (13–18 окт) идут **параллельно с 3.3** и заканчиваются до старта 4.3 20 октября, поэтому у **4.2 около двух дней резерва (float)**.
- **3.4** (4–5 окт) **не на критическом пути**.
- Разработка закончилась раньше, поэтому **критическая цепочка сегодня** — фиксированный старт тестирования **20 окт (M10) → 4.3 → 4.4 → 4 ноя**.
| Пакет | Даты | На критическом пути? |
|---|---|---|
| 1.1 → 1.2 → 2.1 → 3.1 | 1–19 сен | Да |
| 3.2 Обучение жестам | 19 сен – 10 окт | Да |
| 3.3 Привязка команд и настройки | 3–20 окт | Да — перекрывает последнюю неделю 3.2 |
| 3.4 Браузерная версия | 4–5 окт | Нет |
| 4.1 Исследование точности на реальном видео | 6–15 окт | Нет — идёт параллельно с 3.3 |
| 4.2 Исследование освещения | 13–18 окт | Нет — около двух дней резерва |
| 4.3 Тестирование и исправление ошибок | 20 окт – 1 ноя | Да |
| 4.4 Руководство и финальная демонстрация | 1–4 ноя | Да |
## Теория за этим
- L2 перечисляет техники расписания: **Gantt (bar) charts (ленточные диаграммы)**, **milestone charts (диаграммы вех)**, line of balance, **networks (сети)**, **PERT**, **CPM**, PDM и GERT. Figure 5 — диаграмма Ганта с вехами; **сеть** добавляет **взаимозависимости** работ.
- Чтобы превратить ленточную диаграмму в сеть, L2 задаёт три вопроса: какая работа **непосредственно предшествует** этой, какая **непосредственно следует** за ней и какие работы могут **идти одновременно**.
- **Критический путь** — **самый длинный путь** через сеть; он **определяет длительность** проекта и одновременно это кратчайшее время, за которое проект можно выполнить. **Резерва на нём нет**: любой сдвиг переносит дату окончания, если его не наверстать дальше по пути.
= Slack time = TL − TE
- **Slack (резерв, float)**: TL — самая поздняя дата события без сдвига окончания проекта, TE — самая ранняя ожидаемая дата. Около двух дней резерва у 4.2 значат, что пакет может сдвинуться примерно на два дня, не задержав 4.3.
- **Зависимости** (L2): **mandatory** (жёсткая логика — тестированию нужны готовые функции), **discretionary** (мягкая логика — наше решение начать 3.3 до конца 3.2) и **external** (вне контроля руководителя проекта).
- **Мониторинг и контроль** (L1) — сравнивать фактический результат с ожидаемым и анализировать отклонения; именно это делает Table 11. В терминах освоенного объёма (L4) ранняя разработка даёт на мидтерме **SV > 0** и **SPI > 1**.
> Впереди в разработке — не значит впереди в проекте: критическая цепочка теперь 20 окт → тестирование → 4 ноя, а выигранное время уходит на проверку на реальных людях.
## Как сказать на защите
- **Скажи:** «We derived the critical path from Table 3: 1.1, 1.2, 2.1, 3.1, 3.2, 3.3, 4.3 and 4.4, from 1 September to 4 November.» — критический путь вывели из Table 3.
- **Скажи:** «Command mapping was planned to start on 3 October, a week before gesture training ends, so the two packages overlap.» — 3.3 по плану перекрывается с концом 3.2.
- **Скажи:** «The lighting study has about two days of float, and the browser version is off the critical path.» — у 4.2 около двух дней резерва, 3.4 не на критическом пути.
- **Скажи:** «Development is about three weeks ahead, but we will not finish early, because all measurements so far are on synthetic hands.» — опережаем на три недели, но раньше не закончим.
- **Скажи:** «We kept the baseline unchanged to keep the variance visible.» — базовый план не трогали, чтобы отклонение было видно.
- **Скажи:** «User testing starts on 20 October in any case; if something slips, we reduce minor features, not the testing.» — тестирование с 20 октября в любом случае, урезаем мелочи, а не тесты.
## Слабые места и честные ответы
- **«В отчёте нет сетевого графика».** Да — наш базовый план это Table 3 и диаграмма Ганта. Выведи путь из дат прямо на защите (1.1 → … → 4.4) и согласись, что сетевой график был бы полезным дополнением.
- **«Если вы на три недели впереди, почему не закончить раньше?»** Потому что разработку проверяли только на синтетических руках: выигранное время идёт на 4.1 и 4.2, тестирование всё равно начинается 20 октября, а базовый план не меняли, чтобы отклонение было видно.
- **«Обучение жестам всё ещё критично?»** В базовом плане — да. Сегодня разработка сделана раньше, и критическая цепочка — фиксированный старт тестирования 20 окт (M10) → 4.3 → 4.4 → 4 ноя.
## Проверь себя
?? Какие два правила для задержек есть в плане управления расписанием?
?= Опоздание до двух дней без влияния на вехи — владелец решает вопрос с теми, кто зависит от задачи, базовый план не меняется. Задержка, которая сдвинула бы веху, — это изменение по разделу 6: согласуют новую дату, обновляют базовый план и записывают причину в issue на GitHub.
?? Почему YeahTrack не закончится раньше, хотя разработка примерно на три недели впереди?
?= Все измерения пока на синтетических руках; выигранное время идёт на исследования точности и освещения (4.1, 4.2), а тестирование с пользователями начинается 20 октября в любом случае.`,
      },
      [
        qx("In Figure 5, the Gantt chart, what do the hatched bars show?", "Work packages added to the plan on 5 October", [
          ["Work packages that were finished ahead of the plan", "Early completion is shown by red stars (M3–M5); hatching marks the packages added on 5 October.", "Досрочное выполнение показывают красные звёзды (M3–M5); штриховка отмечает пакеты, добавленные 5 октября."],
          ["Packages that lie on the critical path", "Figure 5 does not mark the critical path at all; it is derived from Table 3.", "Figure 5 вообще не отмечает критический путь; его выводят из Table 3."],
          ["Packages not yet started on 5 October", "4.3 is not started either but drawn solid, while 3.4 is hatched although it is already done.", "4.3 тоже не начат, но нарисован сплошным, а 3.4 заштрихован, хотя уже выполнен."],
        ], "Figure 5: hatched bars are work packages added on 5 October (3.4, 4.1, 4.2); red stars show the actual completion of M3 to M5.", "Figure 5: штрихованные полосы — пакеты, добавленные 5 октября (3.4, 4.1, 4.2); красные звёзды — фактическое выполнение M3–M5."),
        qx("Which sequence is the critical path of the baseline, derived from the dates in Table 3?", "1.1 → 1.2 → 2.1 → 3.1 → 3.2 → 3.3 → 4.3 → 4.4", [
          ["1.1 → 1.2 → 2.1 → 3.1 → 3.2 → 3.4 → 4.3 → 4.4", "3.4 (4–5 Oct) is a short added package off the critical path; the path runs through 3.3, which ends on 20 Oct.", "3.4 (4–5 окт) — короткий добавленный пакет вне критического пути; путь идёт через 3.3, который кончается 20 окт."],
          ["1.1 → 1.2 → 2.1 → 3.1 → 3.2 → 4.1 → 4.2 → 4.4", "4.1 and 4.2 run in parallel with 3.3 and end before 20 Oct; the path also cannot skip 4.3.", "4.1 и 4.2 идут параллельно с 3.3 и заканчиваются до 20 окт; к тому же путь не может пропустить 4.3."],
          ["1.1 → 1.2 → 2.1 → 3.1 → 3.3 → 4.2 → 4.3 → 4.4", "It skips 3.2, the three-week package that 3.3 follows, and puts 4.2, which has float, on the path.", "Пропущен 3.2 — трёхнедельный пакет, за которым идёт 3.3, а 4.2 с резервом поставлен на путь."],
        ], "From Table 3: 1.1 → 1.2 → 2.1 → 3.1 → 3.2 → 3.3 → 4.3 → 4.4, from 1 Sep to 4 Nov; 3.4, 4.1 and 4.2 are off it.", "Из Table 3: 1.1 → 1.2 → 2.1 → 3.1 → 3.2 → 3.3 → 4.3 → 4.4, с 1 сен по 4 ноя; 3.4, 4.1 и 4.2 — вне пути."),
        qx("In the baseline, when does 3.3 Command mapping start relative to 3.2 Gesture training?", "On 3 Oct, a week before 3.2 ends", [
          ["On 10 Oct, right after 3.2 ends", "3.2 ends on 10 Oct, but 3.3 was scheduled from 3 Oct to overlap with it.", "3.2 заканчивается 10 окт, но 3.3 поставили с 3 окт, чтобы они перекрывались."],
          ["On 20 Oct, after the two studies", "20 Oct is when 3.3 ends and user testing starts, not when 3.3 begins.", "20 окт 3.3 заканчивается и начинается тестирование, а не стартует 3.3."],
          ["On 19 Sep, together with 3.2", "19 Sep is the start of 3.2; 3.3 starts on 3 Oct.", "19 сен — начало 3.2; 3.3 начинается 3 окт."],
        ], "Table 3: 3.2 runs 19 Sep – 10 Oct and 3.3 runs 3–20 Oct, so 3.3 starts a week before 3.2 ends — an overlap.", "Table 3: 3.2 идёт 19 сен – 10 окт, 3.3 — 3–20 окт, то есть 3.3 начинается за неделю до конца 3.2 — перекрытие."),
        qx("Who estimated the durations of the tasks in the YeahTrack schedule?", "The people responsible for each task", [
          ["Ayat alone, as the owner of the system design", "Ayat has the final word on system design, but Section 11 says each task's owner estimated its duration.", "У Ayat последнее слово по архитектуре, но в разделе 11 сказано, что длительность оценивал владелец каждой задачи."],
          ["The instructor, as the sponsor", "The sponsor approves the plan; the durations came from the task owners.", "Спонсор утверждает план; длительности дали владельцы задач."],
          ["Aizat, from the time log", "The time log (since 5 Oct) records actual hours; it cannot give the original estimates.", "Журнал часов (с 5 окт) фиксирует фактические часы; исходных оценок он дать не может."],
        ], "Section 11: task durations were estimated by the people responsible for each task.", "Раздел 11: длительности задач оценивали люди, ответственные за каждую задачу."),
        qx("A task is up to two days late and no milestone is affected. What does the schedule plan say?", "Owner fixes it with the members who depend on it", [
          ["It becomes a change request and the baseline is updated", "That is the rule for a delay that would move a milestone, not for a short delay.", "Это правило для задержки, которая сдвинула бы веху, а не для короткой."],
          ["All four members must agree on a new milestone date", "No milestone is affected, so no new date is needed and the baseline stays as it is.", "Веха не затронута, поэтому новая дата не нужна, а базовый план остаётся прежним."],
          ["The milestone is moved by Ayat", "No milestone moves in this case, and a milestone move is never one person's decision.", "Здесь никакая веха не сдвигается, а сдвиг вехи никогда не решает один человек."],
        ], "Rule 1: up to two days late, no milestone affected — the owner resolves it with the members who depend on the task; the baseline remains unchanged.", "Правило 1: опоздание до двух дней без влияния на вехи — владелец решает с теми, кто зависит от задачи; базовый план не меняется."),
        qx("What happens if a delay would move a milestone?", "Treated as a change: new date agreed, baseline updated", [
          ["The owner absorbs it and the baseline stays unchanged", "That is the rule for delays of up to two days that affect no milestone.", "Это правило для задержек до двух дней, не задевающих вехи."],
          ["User testing (4.3) is shortened so 4 Nov still holds", "The report says the opposite: minor features are reduced instead of shortening testing.", "Отчёт говорит обратное: урезают мелкие функции, а не сокращают тестирование."],
          ["Ayat moves the milestone date alone in the Gantt chart", "A milestone move goes through Section 6: the team agrees, and the reason is recorded in the GitHub issue.", "Сдвиг вехи идёт через раздел 6: команда согласует, а причина записывается в issue на GitHub."],
        ], "Rule 2: a delay that would move a milestone is a change under Section 6 — a new date is agreed, the baseline is updated, the reason is recorded.", "Правило 2: задержка, сдвигающая веху, — изменение по разделу 6: согласуют новую дату, обновляют базовый план, записывают причину."),
        qx("According to Table 11, since when has 3.2 Gesture training been working?", "Since 16 Sep, against a plan of 19 Sep – 10 Oct", [
          ["Since 12 Sep, against a plan of 12–19 Sep", "That is 3.1 Hand tracking and swipes, working on 12 Sep.", "Это 3.1 Hand tracking and swipes, работает с 12 сен."],
          ["Since 4–5 Oct, as a package added later", "That is 3.4 Browser version, completed on 4–5 Oct.", "Это 3.4 Browser version, выполненный 4–5 окт."],
          ["Since 3 Oct, when media control and SQLite storage were added", "3 Oct is when media control and SQLite were added to 3.3, not when 3.2 started working.", "3 окт в 3.3 добавили управление медиа и SQLite; 3.2 заработал раньше."],
        ], "Table 11: 3.2 planned 19 Sep – 10 Oct, working on 16 Sep; recognition was later reworked to handle a tilted wrist.", "Table 11: 3.2 по плану 19 сен – 10 окт, работает с 16 сен; распознавание потом переделали под наклон запястья."),
        tfx("Because development is about three weeks ahead, YeahTrack is expected to finish about three weeks early.", false,
          "False: all measurements so far are on synthetic hands, the gained time goes to 4.1 and 4.2, and user testing starts on 20 October in any case.",
          "Неверно: все измерения пока на синтетических руках, выигранное время идёт на 4.1 и 4.2, а тестирование начинается 20 октября в любом случае.",
          "True would mean the end date moves forward, but the report says the project will not finish early and the 4 Nov end stays.",
          "Ответ «верно» означал бы, что дата окончания сдвигается раньше, но отчёт прямо говорит, что раньше проект не закончится, и 4 ноя остаётся."),
        qx("Development is ahead of schedule. How does the team use the gained time?", "For the accuracy and lighting studies, 4.1 and 4.2", [
          ["For new features such as two-hand gestures", "The report uses the time for the studies rather than for new features, and two-hand gestures are out of scope.", "Отчёт тратит время не на новые функции, а двуручные жесты вообще вне объёма."],
          ["To bring the final presentation forward to the middle of October", "The project will not finish early; 4.4 stays on 1–4 Nov.", "Проект не закончится раньше; 4.4 остаётся на 1–4 ноя."],
          ["To start user testing before 20 October", "User testing starts on 20 October in any case; the date is fixed.", "Тестирование начинается 20 октября в любом случае; дата фиксирована."],
        ], "Section 11: the gained time is used for the accuracy and lighting studies (4.1 and 4.2) rather than for new features.", "Раздел 11: выигранное время идёт на исследования точности и освещения (4.1 и 4.2), а не на новые функции."),
        qx("In the baseline, why would a slip in 3.3 hurt more than a slip in 3.4?", "3.3 is on the critical path, so it has no slack", [
          ["3.3 has more owners than 3.4", "It is the other way round: 3.3 has one owner (Aizat), 3.4 has two (Ayat, Yernar).", "Наоборот: у 3.3 один владелец (Aizat), у 3.4 — два (Ayat, Yernar)."],
          ["3.4 was added on 5 October, so it is optional work", "Added packages are approved baseline work; what matters is their place in the network.", "Добавленные пакеты — утверждённая часть плана; важно их место в сети."],
          ["3.3 needs the webcams from Table 8", "The webcams are for the accuracy and lighting studies, not for command mapping.", "Веб-камеры нужны для исследований точности и освещения, а не для привязки команд."],
        ], "L2: activities on the critical path have no slack, so their slip moves the end date; 3.4 (4–5 Oct) is off the path.", "L2: у работ на критическом пути нет резерва, их сдвиг переносит окончание; 3.4 (4–5 окт) вне пути."),
        qx("4.2 Lighting study has about two days of float. In L2 terms, what does that mean?", "It can slip about two days without delaying 4.3", [
          ["It must finish two days earlier than its planned end date", "Float is spare time, not a requirement to finish early.", "Резерв — это запас времени, а не требование закончить раньше."],
          ["It is already two days behind its planned dates", "4.2 has not started on 5 Oct; float comes from the plan, not from a delay.", "4.2 на 5 окт не начат; резерв берётся из плана, а не из задержки."],
          ["It has negative slack of two days", "Negative slack means the plan runs past the end date; 4.2 ends before 4.3 starts.", "Отрицательный резерв — когда план выходит за дату окончания; 4.2 кончается до старта 4.3."],
        ], "Slack (float) = TL − TE: how long an activity can slip without extending the project; 4.2 ends 18 Oct, 4.3 starts 20 Oct.", "Slack (float) = TL − TE: насколько работа может сдвинуться без задержки проекта; 4.2 кончается 18 окт, 4.3 стартует 20 окт."),
        qx("3.3 was scheduled to start on 3 Oct, before 3.2 ends, by the team’s choice. Which L2 dependency type is this?", "Discretionary (soft logic)", [
          ["Mandatory (hard logic)", "Hard logic cannot change, like walls before a roof; the overlap was the team's own choice.", "Жёсткую логику нельзя изменить, как стены до крыши; перекрытие — собственный выбор команды."],
          ["External dependency", "External dependencies are beyond the project manager's control; this one is the team's decision.", "Внешние зависимости вне контроля руководителя; здесь же решение самой команды."],
          ["Dummy activity with zero time", "A dummy activity is a drawing device in a network, not one of the three dependency types.", "Фиктивная работа — приём рисования сети, а не один из трёх типов зависимостей."],
        ], "L2: discretionary dependencies (soft logic) are at the discretion of the project manager; starting 3.3 early was such a choice.", "L2: discretionary (мягкая логика) — на усмотрение руководителя проекта; ранний старт 3.3 — именно такой выбор."),
        qx("Figure 5 is a Gantt chart. According to L2, what does a network show that a bar chart does not show clearly?", "The interdependencies between activities", [
          ["The planned start and end dates of every work package", "A Gantt chart shows exactly these dates; Figure 5 has them for 1.1–4.4.", "Диаграмма Ганта как раз показывает эти даты; в Figure 5 они есть для 1.1–4.4."],
          ["The owner responsible for each work package", "Owners are in Table 3; scheduling techniques are about time and logic, not people.", "Владельцы — в Table 3; техники расписания — про время и логику, а не про людей."],
          ["The weekly cash spent on each package", "Weekly cash is the time-phased cost baseline (Table 19, Figure 6), not a network.", "Деньги по неделям — это распределённый во времени базовый план стоимости (Table 19, Figure 6), а не сеть."],
        ], "L2: interdependencies are shown through the construction of networks — what precedes, what follows, what runs concurrently.", "L2: взаимозависимости показывает сеть — что предшествует, что следует, что идёт одновременно."),
        qx("Examiner: ‘Your report has no network diagram. What is your critical path today?’ What is the best answer?", "Fixed start of testing on 20 Oct, then 4.3 and 4.4 to 4 Nov", [
          ["We do not need one; a Gantt chart is enough for a small project", "Dismissing the question looks evasive; derive the path from Table 3 and name what is critical now.", "Отмахнуться от вопроса — выглядит как уход от ответа; выведи путь из Table 3 и назови, что критично сейчас."],
          ["Still 3.2 Gesture training, exactly as in the baseline", "That was true in the baseline, but development finished early; today the chain starts on 20 Oct.", "Так было в базовом плане, но разработка закончилась раньше; сегодня цепочка начинается 20 окт."],
          ["Nothing is critical: we are three weeks ahead of the plan", "Over-claiming: testing from 20 Oct to 4 Nov has no slack, whatever development did.", "Преувеличение: у тестирования с 20 окт до 4 ноя нет резерва, как бы ни шла разработка."],
        ], "Today the critical chain is the fixed start of user testing on 20 Oct (M10) → 4.3 → 4.4 → 4 Nov; in the baseline it ran 1.1 → … → 4.4.", "Сегодня критическая цепочка — фиксированный старт тестирования 20 окт (M10) → 4.3 → 4.4 → 4 ноя; в базовом плане путь шёл 1.1 → … → 4.4."),
        qx("Examiner: ‘M3–M5 were reached early. Why did you not update the baseline?’ What is the best answer?", "We kept it unchanged to keep the variance visible", [
          ["We did update it; Table 3 shows the new dates", "This denies the report: Table 3 keeps the original dates and Table 11 shows the actual ones.", "Это отрицает отчёт: Table 3 хранит исходные даты, а фактические показаны в Table 11."],
          ["Nobody on the team was in charge of the schedule", "Blaming and untrue: each task owner keeps the card up to date and reports at check-ins.", "Это и перекладывание, и неправда: владелец каждой задачи ведёт карточку и докладывает на созвонах."],
          ["Dates no longer matter: accuracy on real users is proven", "Over-claiming: accuracy on real users is not measured yet (R-01, M8 on 15 Oct).", "Преувеличение: точность на реальных людях ещё не измерена (R-01, M8 на 15 окт)."],
        ], "Section 5: the baseline has been kept unchanged to keep the variance visible; Table 11 compares planned and actual.", "Раздел 5: базовый план оставили без изменений, чтобы отклонение было видно; Table 11 сравнивает план и факт."),
      ],
    ),
  ],
};
