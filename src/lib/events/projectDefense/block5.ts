import { part, qx, tfx, type Lecture } from "../types";

export const block5: Lecture = {
  id: "pd-b5",
  title: { en: "Block 5 — Cost baseline and cost control", ru: "Блок 5 — Базовый план затрат и контроль затрат" },
  parts: [
    part(
      "pd-b5-p1",
      { en: "Cost baseline and the S-curve", ru: "Базовый план затрат и S-кривая" },
      {
        en: `## What we wrote
Section 17 defines the **cost baseline** as the approved, time-phased budget against which actual costs are measured (PMI, 2021).
Following Section 8, it has two parts:
- **Effort baseline** — the planned hours and their market value: 300 hours = 708 240 KZT. Nobody is paid; the value is used to plan and control the effort.
- **Cash baseline** — the planned purchases from Table 8: 51 913 KZT, paid by the team in equal shares.
- The **contingency reserve** of 10% (5 191 KZT) is **not part of the baseline**; Table 18 lists it below the baseline row.
**Table 18 — cost baseline by phase**
| Phase | Weeks | Hours | Labour value (KZT) | Cash (KZT) |
|---|---|---|---|---|
| Planning | Week 1 | 32 | 75 440 | 0 |
| Design | Week 2 | 30 | 70 860 | 0 |
| Development | Weeks 3–7 | 148 | 350 260 | 51 913 |
| Testing and launch | Weeks 8–10 | 90 | 211 680 | 0 |
| **Baseline** | — | **300** | **708 240** | **51 913** |
| Contingency reserve | — | — | — | 5 191 |
Development is the largest phase: 148 of the 300 hours and the whole cash baseline, because all purchases fall in weeks 5 and 6.
**Table 19 — time-phased cost baseline**
| Week | Dates | Hours | Labour value | Cash | Cumulative labour value | Cumulative cash |
|---|---|---|---|---|---|---|
| 1 | 1–6 Sep | 32 | 75 440 | – | 75 440 | 0 |
| 2 | 7–13 Sep | 30 | 70 860 | – | 146 300 | 0 |
| 3 | 14–20 Sep | 28 | 66 280 | – | 212 580 | 0 |
| 4 | 21–27 Sep | 28 | 66 280 | – | 278 860 | 0 |
| 5 | 28 Sep–4 Oct | 30 | 71 040 | 435 | **349 900** | 435 |
| 6 | 5–11 Oct | 34 | 80 560 | 51 478 | 430 460 | 51 913 |
| 7 | 12–18 Oct | 28 | 66 100 | – | 496 560 | 51 913 |
| 8 | 19–25 Oct | 36 | 84 600 | – | 581 160 | 51 913 |
| 9 | 26 Oct–1 Nov | 36 | 84 600 | – | 665 760 | 51 913 |
| 10 | 2–4 Nov | 18 | 42 480 | – | 708 240 | 51 913 |
**Cash is spent only in weeks 5 and 6:** the domain yeahtrack.site in week 5 (435 KZT), then the equipment for the accuracy and lighting studies in week 6, before the studies begin. The week-6 amount is the rest of Table 8:
= 51 478 = 32 580 + 12 238 + 6 660
That is two Logitech C270 webcams, the ring light and three months of the Railway Hobby plan (the paid plan budgeted for risk R-09).
![Figure 6: cumulative labour value rising from 75 to 708 thousand KZT over weeks 1–10; cumulative cash at zero until week 5 and 52 thousand KZT from week 6](/events/pm/yeahtrack-scurve.webp)
**Figure 6** shows both cumulative curves. The labour line climbs almost evenly — 28 to 36 hours a week, only 18 hours in the short week 10 (2–4 Nov) — so it looks more like a straight line than a classic S. The cash line is a step: 0, then 435 in week 5, then 51 913 from week 6 to the end.
At the midterm (5 Oct, the start of week 6) the curve stands at **349 900 KZT** of planned labour value and **435 KZT** of planned cash — the planned value used for control in Part 2.
Two totals are easy to mix up:
- **Cash budget 57 104 KZT** = purchases 51 913 + reserve 5 191; split into four shares of about 14 276 KZT.
- **Total economic cost 765 344 KZT** = cash budget 57 104 + labour 708 240 — it includes the reserve, the baseline does not.
## The theory behind it
Kerzner (Lecture 4): all budgets must be traceable through the **budget log**. Lecture 2 adds that a detailed charter contains a **spending plan (S-curve)** — in our report that is Figure 6.
| Budget in the log (L4) | Meaning | In YeahTrack |
|---|---|---|
| Distributed budget | the normal performance budget, assigned to the planned work | Tables 18 and 19: 300 h (708 240 KZT) and 51 913 KZT, by phase and by week |
| Management reserve | money held back outside the distributed budget | the 10% reserve, 5 191 KZT, released only if all four members agree |
| Undistributed budget | money for changes not yet planned into the performance budget | not used: the added studies 4.1 and 4.2 use the planned hours of weeks 6–7, the total stays 300 h |
| Unallocated budget | tasks not yet identified or authorized | nothing set aside: a Windows build (CR-05, pending) is not in the WBS |
| Contract changes | approved changes that alter the budget | change log CR-01–CR-05; step 5 of change control updates the cost baseline |
- **Why the reserve sits outside the baseline.** Our 10% reserve is not tied to one identified risk and needs the agreement of all four members, so it behaves like a **management reserve**. In strict PMBOK terms a **contingency reserve** for identified risks usually sits **inside** the cost baseline and a management reserve outside: the report's name says "contingency", the treatment says "management".
- **Why time-phasing matters.** A total alone cannot be controlled. Spread by week, the baseline gives a planned value for every date, and that is exactly what earned value compares against (BCWS).
- **Why the curve is not an S.** A classic S-curve starts slowly, rises steeply in the middle and flattens at the end. The team plans a similar load every week (8–12 hours per person), so the labour curve is nearly linear and flattens only in week 10.
## How to say it at the defense
- **Say:** "Our cost baseline has two parts: 300 hours valued at 708 240 tenge, and 51 913 tenge of purchases."
- **Say:** "The 10% reserve of 5 191 tenge is outside the baseline and is used only if all four of us agree."
- **Say:** "All cash is spent in weeks 5 and 6: the domain first, then the equipment before the studies."
- **Say:** "Figure 6 is our spending plan; at the end of week 5 the planned labour value is 349 900 tenge."
- **Say:** "Development is the largest phase, with 148 of the 300 hours and all of the cash."
## Weak spots and honest answers
- **"In PMBOK the contingency reserve is inside the baseline."** — Agree, do not argue: "It is a reserve not tied to a single risk, so we kept it outside the baseline, like a management reserve; we can rename it or move it into the baseline."
- **"Why is equipment for testing in the Development row?"** — Table 18 counts weeks 3–7 as development, and the studies 4.1 and 4.2 (6–18 Oct) already run in weeks 6–7; the webcams and the ring light are bought in week 6, before the studies start.
- **"Why is a just-in-case hosting plan in the baseline?"** — It is the planned response to risk R-09 ("budget for the paid plan"); if the free plan is enough, the money is simply not spent, and the comparison at the milestone review shows it.
> The cost baseline is 300 hours (708 240 KZT) plus 51 913 KZT of cash, phased by week; the 5 191 KZT reserve sits outside it.
## Check yourself
?? What is the cumulative planned labour value at the end of week 5, and why does it matter at the midterm?
?= 349 900 KZT. Week 5 ends on 4 Oct, the day before the midterm, so this is the planned value (BCWS) that progress is compared with.
?? Which purchases make up the 51 478 KZT of cash in week 6?
?= Two Logitech C270 webcams (32 580), the ring light (12 238) and three months of the Railway Hobby plan (6 660); the domain (435) is paid in week 5.`,
        ru: `## Что мы написали
Раздел 17 определяет **базовый план затрат (cost baseline)** как утверждённый бюджет, распределённый по времени, с которым сравнивают фактические затраты (PMI, 2021).
Как и в разделе 8, у него две части:
- **Базовый план трудозатрат (effort baseline)** — плановые часы и их рыночная стоимость: 300 часов = 708 240 KZT. Никому не платят; стоимость нужна, чтобы планировать и контролировать усилия.
- **Денежный базовый план (cash baseline)** — плановые покупки из таблицы 8: 51 913 KZT, команда платит поровну.
- **Резерв на непредвиденное (contingency reserve)** 10% (5 191 KZT) **в базовый план не входит**; таблица 18 пишет его под строкой базового плана.
**Таблица 18 — базовый план затрат по фазам**
| Фаза | Недели | Часы | Стоимость труда (KZT) | Деньги (KZT) |
|---|---|---|---|---|
| Планирование | Неделя 1 | 32 | 75 440 | 0 |
| Проектирование | Неделя 2 | 30 | 70 860 | 0 |
| Разработка | Недели 3–7 | 148 | 350 260 | 51 913 |
| Тестирование и запуск | Недели 8–10 | 90 | 211 680 | 0 |
| **Базовый план** | — | **300** | **708 240** | **51 913** |
| Резерв на непредвиденное | — | — | — | 5 191 |
Самая большая фаза — разработка: 148 из 300 часов и весь денежный план, потому что все покупки приходятся на недели 5 и 6.
**Таблица 19 — базовый план, распределённый по неделям**
| Неделя | Даты | Часы | Стоимость труда | Деньги | Нарастающая стоимость труда | Нарастающие деньги |
|---|---|---|---|---|---|---|
| 1 | 1–6 сен | 32 | 75 440 | – | 75 440 | 0 |
| 2 | 7–13 сен | 30 | 70 860 | – | 146 300 | 0 |
| 3 | 14–20 сен | 28 | 66 280 | – | 212 580 | 0 |
| 4 | 21–27 сен | 28 | 66 280 | – | 278 860 | 0 |
| 5 | 28 сен–4 окт | 30 | 71 040 | 435 | **349 900** | 435 |
| 6 | 5–11 окт | 34 | 80 560 | 51 478 | 430 460 | 51 913 |
| 7 | 12–18 окт | 28 | 66 100 | – | 496 560 | 51 913 |
| 8 | 19–25 окт | 36 | 84 600 | – | 581 160 | 51 913 |
| 9 | 26 окт–1 ноя | 36 | 84 600 | – | 665 760 | 51 913 |
| 10 | 2–4 ноя | 18 | 42 480 | – | 708 240 | 51 913 |
**Деньги тратятся только в неделях 5 и 6:** домен yeahtrack.site в неделе 5 (435 KZT), затем оборудование для исследований точности и освещения в неделе 6, до их начала. Сумма недели 6 — это остаток таблицы 8:
= 51 478 = 32 580 + 12 238 + 6 660
То есть две веб-камеры Logitech C270, кольцевая лампа и три месяца тарифа Railway Hobby (платный тариф, заложенный на риск R-09).
![Рисунок 6: нарастающая стоимость труда растёт с 75 до 708 тыс. KZT за недели 1–10; нарастающие деньги — ноль до недели 5 и 52 тыс. KZT с недели 6](/events/pm/yeahtrack-scurve.webp)
**Рисунок 6** показывает обе нарастающие кривые. Линия труда растёт почти равномерно — от 28 до 36 часов в неделю и лишь 18 часов в короткой неделе 10 (2–4 ноября), — поэтому она больше похожа на прямую, чем на классическую S. Линия денег — ступенька: 0, затем 435 в неделе 5, затем 51 913 с недели 6 до конца.
На мидтерме (5 октября, начало недели 6) кривая стоит на **349 900 KZT** плановой стоимости труда и **435 KZT** плановых денег — это плановый объём, с которым идёт контроль в части 2.
Две суммы легко перепутать:
- **Денежный бюджет 57 104 KZT** = покупки 51 913 + резерв 5 191; делится на четыре доли примерно по 14 276 KZT.
- **Полная экономическая стоимость 765 344 KZT** = денежный бюджет 57 104 + труд 708 240 — в ней резерв есть, а в базовом плане его нет.
## Теория за этим
Керцнер (лекция 4): каждый бюджет должен прослеживаться через **журнал бюджета (budget log)**. Лекция 2 добавляет, что подробный устав содержит **план расходов (spending plan, S-кривую)** — в нашем отчёте это рисунок 6.
| Бюджет в журнале (L4) | Что это | В YeahTrack |
|---|---|---|
| Распределённый бюджет (distributed) | обычный рабочий бюджет, привязанный к плановой работе | таблицы 18 и 19: 300 ч (708 240 KZT) и 51 913 KZT по фазам и неделям |
| Управленческий резерв (management reserve) | деньги, отложенные вне распределённого бюджета | резерв 10%, 5 191 KZT, расходуется только с согласия всех четверых |
| Нераспределённый бюджет (undistributed) | деньги на изменения, ещё не встроенные в рабочий бюджет | не используется: добавленные исследования 4.1 и 4.2 идут в плановые часы недель 6–7, итог остаётся 300 ч |
| Невыделенный бюджет (unallocated) | задачи, ещё не определённые или не разрешённые | ничего не отложено: сборки под Windows (CR-05, на рассмотрении) нет в WBS |
| Изменения контракта (contract changes) | одобренные изменения, меняющие бюджет | журнал изменений CR-01–CR-05; шаг 5 управления изменениями обновляет базовый план затрат |
- **Почему резерв вне базового плана.** Наш резерв 10% не привязан к одному выявленному риску и требует согласия всех четверых, поэтому ведёт себя как **управленческий резерв (management reserve)**. По строгому PMBOK **резерв на непредвиденное (contingency reserve)** под выявленные риски обычно лежит **внутри** базового плана, а управленческий — снаружи: в отчёте название «contingency», а обращение с ним — как с «management».
- **Зачем распределять по времени.** Одну итоговую сумму контролировать нельзя. Разложенный по неделям базовый план даёт плановый объём на каждую дату — именно с ним сравнивает освоенный объём (BCWS).
- **Почему кривая не похожа на S.** Классическая S-кривая медленно стартует, круто растёт в середине и выполаживается в конце. Команда планирует похожую нагрузку каждую неделю (8–12 часов на человека), поэтому линия труда почти прямая и выполаживается только в неделе 10.
## Как сказать на защите
- **Скажи:** «Our cost baseline has two parts: 300 hours valued at 708 240 tenge, and 51 913 tenge of purchases.» — у базового плана две части: 300 часов по рыночной стоимости и 51 913 тенге покупок.
- **Скажи:** «The 10% reserve of 5 191 tenge is outside the baseline and is used only if all four of us agree.» — резерв вне базового плана и тратится только с согласия всех четверых.
- **Скажи:** «All cash is spent in weeks 5 and 6: the domain first, then the equipment before the studies.» — все деньги уходят в неделях 5 и 6: сначала домен, потом оборудование до исследований.
- **Скажи:** «Figure 6 is our spending plan; at the end of week 5 the planned labour value is 349 900 tenge.» — рисунок 6 — наш план расходов; к концу недели 5 плановая стоимость труда 349 900 тенге.
- **Скажи:** «Development is the largest phase, with 148 of the 300 hours and all of the cash.» — разработка — самая большая фаза: 148 из 300 часов и все деньги.
## Слабые места и честные ответы
- **«В PMBOK резерв на непредвиденное входит в базовый план».** — Согласись, не спорь: «It is a reserve not tied to a single risk, so we kept it outside the baseline, like a management reserve; we can rename it or move it into the baseline.» — резерв не привязан к одному риску, поэтому он вне плана, как управленческий; можно переименовать или внести в план.
- **«Почему оборудование для тестирования в строке разработки?»** — Таблица 18 считает недели 3–7 разработкой, а исследования 4.1 и 4.2 (6–18 октября) уже идут в неделях 6–7; веб-камеры и кольцевую лампу покупают в неделе 6, до начала исследований.
- **«Зачем в базовом плане хостинг „на всякий случай“?»** — Это плановый ответ на риск R-09 («заложить деньги на платный тариф»); если бесплатного тарифа хватит, деньги просто не потратят, и сравнение на обзоре вехи это покажет.
> Базовый план затрат — 300 часов (708 240 KZT) плюс 51 913 KZT денег, распределённые по неделям; резерв 5 191 KZT лежит вне его.
## Проверь себя
?? Какова нарастающая плановая стоимость труда к концу недели 5 и почему она важна на мидтерме?
?= 349 900 KZT. Неделя 5 заканчивается 4 октября, за день до мидтерма, поэтому это плановый объём (BCWS), с которым сравнивают прогресс.
?? Из каких покупок складываются 51 478 KZT денег в неделе 6?
?= Две веб-камеры Logitech C270 (32 580), кольцевая лампа (12 238) и три месяца тарифа Railway Hobby (6 660); домен (435) оплачивается в неделе 5.`,
      },
      [
        qx("What is the labour part of YeahTrack's cost baseline (the effort baseline)?", "300 hours valued at 708 240 KZT", [
          ["300 hours valued at 765 344 KZT", "765 344 KZT is the total economic cost: the labour value plus the 57 104 KZT cash budget.", "765 344 KZT — полная экономическая стоимость: труд плюс денежный бюджет 57 104 KZT."],
          ["280 hours valued at 708 240 KZT", "The planned hours are 80 + 80 + 76 + 64 = 300, not 280.", "Плановые часы — 80 + 80 + 76 + 64 = 300, а не 280."],
          ["300 hours valued at 349 900 KZT", "349 900 KZT is only the cumulative planned value at the end of week 5, not the value of all 300 hours.", "349 900 KZT — лишь нарастающий плановый объём к концу недели 5, а не стоимость всех 300 часов."],
        ], "Table 18: the effort baseline is 300 hours with a labour value of 708 240 KZT; the cash baseline (51 913 KZT) is the second part.", "Таблица 18: базовый план трудозатрат — 300 часов стоимостью 708 240 KZT; денежный план (51 913 KZT) — вторая часть."),
        qx("Which item is NOT part of YeahTrack's cost baseline?", "The 10% contingency reserve, 5 191 KZT", [
          ["The 51 913 KZT of planned purchases", "The planned purchases are the cash baseline, the second part of the cost baseline.", "Плановые покупки — это денежный базовый план, вторая часть базового плана затрат."],
          ["The market value of the 300 planned hours", "The valued hours are the effort baseline, the first part of the cost baseline.", "Оценённые часы — базовый план трудозатрат, первая часть базового плана затрат."],
          ["The domain bought in week 5 for 435 KZT", "The domain is in Table 8 and appears as 435 KZT of cash in week 5 of Table 19, so it is inside the baseline.", "Домен есть в таблице 8 и стоит как 435 KZT в неделе 5 таблицы 19, значит, он внутри базового плана."],
        ], "Section 17: the contingency reserve is not part of the baseline; Table 18 lists it below the baseline row.", "Раздел 17: резерв на непредвиденное не входит в базовый план; таблица 18 пишет его под строкой базового плана."),
        qx("In which weeks does the time-phased cost baseline plan any cash spending?", "Only in weeks 5 and 6", [
          ["In every development week, 3 to 7", "Table 18 puts the cash in the development row, but by week (Table 19) only weeks 5 and 6 have cash.", "Таблица 18 ставит деньги в строку разработки, но по неделям (таблица 19) деньги есть только в неделях 5 и 6."],
          ["In weeks 6 and 7, during the studies", "Week 7 has no cash; the equipment is bought in week 6, before the studies, and the domain in week 5.", "В неделе 7 денег нет; оборудование покупают в неделе 6, до исследований, а домен — в неделе 5."],
          ["Evenly over all ten weeks", "The cash line in Figure 6 is a step, not a slope: zero until week 5, flat after week 6.", "Линия денег на рисунке 6 — ступенька, а не наклон: ноль до недели 5, ровно после недели 6."],
        ], "Table 19: 435 KZT in week 5 (the domain) and 51 478 KZT in week 6 (equipment and hosting); every other week shows no cash.", "Таблица 19: 435 KZT в неделе 5 (домен) и 51 478 KZT в неделе 6 (оборудование и хостинг); в остальные недели денег нет."),
        qx("What is the cumulative planned labour value at the end of week 5 (28 Sep – 4 Oct)?", "349 900 KZT", [
          ["278 860 KZT", "278 860 KZT is the cumulative value at the end of week 4.", "278 860 KZT — нарастающий итог к концу недели 4."],
          ["430 460 KZT", "430 460 KZT is the cumulative value at the end of week 6.", "430 460 KZT — нарастающий итог к концу недели 6."],
          ["71 040 KZT", "71 040 KZT is the labour value of week 5 alone, not the cumulative total.", "71 040 KZT — стоимость труда только недели 5, а не нарастающий итог."],
        ], "Table 19: the cumulative labour value after week 5 is 349 900 KZT — the planned value at the midterm.", "Таблица 19: нарастающая стоимость труда после недели 5 — 349 900 KZT, это плановый объём на мидтерме."),
        qx("How much cash does Table 19 plan for week 6 alone?", "51 478 KZT", [
          ["51 913 KZT", "51 913 KZT is the cumulative cash after week 6 (all purchases), not week 6 alone.", "51 913 KZT — нарастающие деньги после недели 6 (все покупки), а не одна неделя 6."],
          ["57 104 KZT", "57 104 KZT is the cash budget including the 10% reserve, which is outside the baseline.", "57 104 KZT — денежный бюджет вместе с резервом 10%, который вне базового плана."],
          ["435 KZT", "435 KZT is the domain, planned in week 5, not week 6.", "435 KZT — домен, он запланирован в неделе 5, а не в неделе 6."],
        ], "Week 6 holds 51 478 KZT: the two webcams (32 580), the ring light (12 238) and the Railway Hobby plan (6 660).", "В неделе 6 — 51 478 KZT: две веб-камеры (32 580), кольцевая лампа (12 238) и тариф Railway Hobby (6 660)."),
        qx("How large is YeahTrack's reserve, and what is it calculated from?", "5 191 KZT, 10% of all purchases", [
          ["5 191 KZT, 10% of the labour value", "10% of the 708 240 KZT labour value would be far more; the reserve is 10% of the 51 913 KZT of purchases.", "10% от 708 240 KZT труда было бы гораздо больше; резерв — 10% от покупок на 51 913 KZT."],
          ["57 104 KZT, the whole cash budget", "57 104 KZT is purchases plus the reserve; the reserve itself is 5 191 KZT.", "57 104 KZT — покупки плюс резерв; сам резерв — 5 191 KZT."],
          ["14 276 KZT, one member's share", "About 14 276 KZT is each member's equal share of the 57 104 KZT cash budget.", "Около 14 276 KZT — равная доля каждого участника в денежном бюджете 57 104 KZT."],
        ], "Table 7: the contingency reserve is 10% of purchases, 5 191 KZT; with 51 913 KZT of purchases the cash budget is 57 104 KZT.", "Таблица 7: резерв на непредвиденное — 10% от покупок, 5 191 KZT; вместе с покупками на 51 913 KZT денежный бюджет — 57 104 KZT."),
        qx("Where does the labour line in Figure 6 end in week 10?", "At 708 240 KZT, the effort baseline", [
          ["At 765 344 KZT, the total economic cost", "The total economic cost adds the cash budget; the labour line shows only the value of planned hours.", "Полная экономическая стоимость добавляет денежный бюджет; линия труда показывает только стоимость плановых часов."],
          ["At 665 760 KZT, after user testing", "665 760 KZT is the cumulative value at the end of week 9; week 10 adds 42 480 KZT.", "665 760 KZT — нарастающий итог к концу недели 9; неделя 10 добавляет ещё 42 480 KZT."],
          ["At 51 913 KZT, the cash baseline", "51 913 KZT is where the other line, cumulative cash, ends.", "На 51 913 KZT заканчивается другая линия — нарастающие деньги."],
        ], "The cumulative labour line reaches 708 240 KZT in week 10 — the full value of the 300 planned hours.", "Нарастающая линия труда доходит до 708 240 KZT в неделе 10 — полная стоимость 300 плановых часов."),
        qx("In Kerzner's budget log, which budget does YeahTrack's 10% reserve behave like?", "Management reserve", [
          ["Distributed budget", "The distributed budget is assigned to planned work (Tables 18–19); the reserve is held back outside it.", "Распределённый бюджет привязан к плановой работе (таблицы 18–19); резерв отложен вне его."],
          ["Undistributed budget", "Undistributed budget covers changes not yet planned into the performance budget, not a held-back reserve.", "Нераспределённый бюджет — для изменений, ещё не встроенных в рабочий бюджет, а не отложенный резерв."],
          ["Unallocated budget", "Unallocated budget groups tasks not yet identified or authorized; the reserve is not a set of tasks.", "Невыделенный бюджет — это задачи, ещё не определённые или не разрешённые; резерв — не набор задач."],
        ], "It sits outside the baseline and is released only if all four members agree — like a management reserve, separate from the distributed budget.", "Он лежит вне базового плана и расходуется только с согласия всех четверых — как управленческий резерв, отдельный от распределённого бюджета."),
        qx("Tables 18 and 19 assign 300 hours and 51 913 KZT to phases and weeks. Which budget from Lecture 4 is this?", "The distributed budget", [
          ["The management reserve", "The management reserve is the money held back, our 5 191 KZT, not the budget assigned to work.", "Управленческий резерв — отложенные деньги, наши 5 191 KZT, а не бюджет, привязанный к работе."],
          ["The undistributed budget", "Undistributed budget is for changes not yet planned in; Tables 18–19 are fully planned by week.", "Нераспределённый бюджет — для изменений, ещё не встроенных в план; таблицы 18–19 полностью расписаны по неделям."],
          ["The unallocated budget", "Unallocated budget is for tasks not yet identified; every hour here belongs to a phase and a week.", "Невыделенный бюджет — для ещё не определённых задач; здесь каждый час привязан к фазе и неделе."],
        ], "The normal performance budget assigned to planned work is the distributed budget — our baseline by phase and by week.", "Обычный рабочий бюджет, привязанный к плановой работе, — это распределённый бюджет, наш базовый план по фазам и неделям."),
        qx("Lecture 2 says a detailed charter can include a spending plan (S-curve). What plays that role in the report?", "Figure 6, the cumulative curves", [
          ["Table 8, the planned purchases", "Table 8 lists items and prices but does not spread them over time.", "Таблица 8 перечисляет покупки и цены, но не раскладывает их по времени."],
          ["Table 9, salaries and labour cost", "Table 9 gives rates and hours per member, not spending by week.", "Таблица 9 даёт ставки и часы по участникам, а не расходы по неделям."],
          ["Figure 5, the Gantt chart", "The Gantt chart is the schedule baseline; it shows dates, not cumulative cost.", "Диаграмма Ганта — базовый план графика; она показывает даты, а не нарастающие затраты."],
        ], "Figure 6 (with Table 19) shows the cumulative planned labour value and cash by week — the spending plan, or S-curve.", "Рисунок 6 (вместе с таблицей 19) показывает нарастающую плановую стоимость труда и деньги по неделям — это план расходов, S-кривая."),
        qx("Why does YeahTrack's labour curve look almost straight rather than like a classic S?", "Planned weekly hours are nearly even", [
          ["Labour is unpaid, so it is not phased", "Labour is unpaid but still valued and phased by week in Table 19.", "Труд не оплачивается, но всё равно оценён и разложен по неделям в таблице 19."],
          ["All cash is spent in weeks 5 and 6", "That explains the step in the cash line, not the shape of the labour line.", "Это объясняет ступеньку на линии денег, а не форму линии труда."],
          ["Most hours are planned in the first weeks", "Weeks 1 and 2 have 32 and 30 hours; the peak, 36 hours, is in weeks 8 and 9.", "В неделях 1 и 2 — 32 и 30 часов; пик, 36 часов, приходится на недели 8 и 9."],
        ], "Table 19 plans 28–36 hours in weeks 1–9 and 18 in the short week 10, so the cumulative line rises at an almost constant rate.", "Таблица 19 планирует 28–36 часов в неделях 1–9 и 18 в короткой неделе 10, поэтому нарастающая линия растёт почти с постоянной скоростью."),
        qx("Examiner: in PMBOK a contingency reserve sits inside the cost baseline. Why is yours outside? Best answer?", "It is not tied to one risk, so it acts as a management reserve", [
          ["Our reserve is inside the baseline, see Table 18", "This denies the report: Section 17 says the reserve is not part of the baseline.", "Это отрицает отчёт: раздел 17 прямо говорит, что резерв не входит в базовый план."],
          ["PMBOK does not separate contingency and management reserves", "Wrong and argumentative: PMBOK does separate contingency and management reserves.", "Неверно и звучит как спор: PMBOK как раз разделяет резерв на непредвиденное и управленческий резерв."],
          ["The instructor told us to keep it outside", "Blames someone else with no basis in the report; the choice was the team's own.", "Перекладывает ответственность без опоры на отчёт; это решение самой команды."],
        ], "Agree with the point and explain: the reserve is not tied to a single risk, so it was kept outside like a management reserve; it can be renamed or moved into the baseline.", "Согласиться и объяснить: резерв не привязан к одному риску, поэтому он вне плана, как управленческий; его можно переименовать или внести в базовый план."),
        qx("Examiner: why is the cash for testing equipment in the Development row of Table 18? Best answer?", "Weeks 3–7 count as development; we buy it in week 6", [
          ["It is a typo; the cash belongs to the testing row", "This denies the report's own tables: Table 19 puts the purchase in week 6, which is one of weeks 3–7.", "Это отрицает собственные таблицы: таблица 19 ставит покупку в неделю 6, а она входит в недели 3–7."],
          ["The webcams are used to build hand tracking", "Table 8 says the webcams are for the accuracy and lighting studies, not for development.", "Таблица 8 говорит, что веб-камеры нужны для исследований точности и освещения, а не для разработки."],
          ["Development is the biggest phase, so it takes all cash", "Cash is placed by the week of purchase in Table 19, not by the size of a phase.", "Деньги стоят по неделе покупки в таблице 19, а не по размеру фазы."],
        ], "Table 18 groups weeks 3–7 as development; studies 4.1 and 4.2 (6–18 Oct) already run in weeks 6–7, and the equipment is bought in week 6, before they start.", "Таблица 18 относит недели 3–7 к разработке; исследования 4.1 и 4.2 (6–18 октября) уже идут в неделях 6–7, а оборудование покупают в неделе 6, до их начала."),
        tfx("The total economic cost of 765 344 KZT includes the 5 191 KZT reserve, although the cost baseline does not.", true,
          "765 344 = cash budget 57 104 (purchases plus reserve) + labour 708 240, while Section 17 keeps the reserve outside the baseline.",
          "765 344 = денежный бюджет 57 104 (покупки плюс резерв) + труд 708 240, а раздел 17 держит резерв вне базового плана.",
          "False would mean the reserve is left out of the total too, but Table 7 adds the whole 57 104 KZT cash budget to the labour value.",
          "«Неверно» означало бы, что резерва нет и в итоге, но таблица 7 прибавляет к труду весь денежный бюджет 57 104 KZT."),
        tfx("In Table 19, cumulative cash reaches 51 913 KZT in week 6 and stays flat until week 10.", true,
          "All purchases fall in week 5 (435) and week 6 (51 478); weeks 7–10 have no cash, so the cash line in Figure 6 is flat after week 6.",
          "Все покупки приходятся на неделю 5 (435) и неделю 6 (51 478); в неделях 7–10 денег нет, поэтому линия денег на рисунке 6 после недели 6 ровная.",
          "False would mean more purchases after week 6, but Table 19 shows a dash in the cash column for weeks 7–10.",
          "«Неверно» означало бы покупки после недели 6, но в таблице 19 в столбце денег для недель 7–10 стоит прочерк."),
      ],
    ),
    part(
      "pd-b5-p2",
      { en: "Controlling cost: time log and earned value", ru: "Контроль затрат: журнал часов и освоенный объём" },
      {
        en: `## What we wrote
Section 8 sets two kinds of cost control — one for cash and one for labour — and Section 17 adds the rules of the time log.
**Cash.** Every purchase is approved before it is made: the area owner proposes the item with a link to the offer, Ayat and one other member approve it, and the receipt is stored in the repository. The reserve is used only with the agreement of all four members, and each member pays their share only when a purchase is approved.
**Labour.** Actual hours go into the time log, **docs/HOURS.md**, introduced on 5 October together with task cards, PR review and the risk register (CR-03, milestone M7). The rules:
- each member enters their hours **on the day** the work is done;
- in steps of **half an hour**;
- **meetings and discussions are included**, because commits do not show them;
- the entries for the earlier weeks are being completed by each member.
| What is controlled | Record | Who decides | Trigger for analysis |
|---|---|---|---|
| Labour hours | docs/HOURS.md, filled daily | each member enters; Ayat compares with the effort baseline at each milestone review | actual hours more than 10% over the baseline |
| Purchases in Table 8 | receipt in the repository | Ayat and one other member, before buying | a purchase more than 10% over its estimate |
| Purchase not in Table 8 | change request (GitHub issue) | all four members — a major change | always |
| Reserve, 5 191 KZT | outside the baseline | all four members | one of the three options after a deviation |
Where the comparison happens (Table 6 and Sections 11, 16, 17):
| Meeting | Frequency | What it checks for cost | Owner |
|---|---|---|---|
| Progress check-in | every 1–2 days | tasks likely to be late, members with less time that week | Ayat |
| Weekly meeting | weekly, from 5 Oct | task cards, risk register, time log | Ayat |
| Milestone review | at each milestone | cumulative actual hours and purchases against the baseline | Ayat |
| Report to the instructor | at each deliverable | written report and presentation | Ayat |
**The 10% rule** (Section 8). If actual hours exceed the baseline by more than 10%, or a purchase exceeds its estimate by more than 10%, the team analyses the cause and decides to:
- **simplify a task**;
- **use the reserve** — only with the agreement of all four members;
- **submit a change request** (Section 6) — the change procedure decides and updates the baselines.
Any purchase not listed in Table 8 is a **major change** and needs the whole team: Table 4 classes every change that requires a purchase as major.
## The theory behind it
Kerzner (Lecture 4) lists what an effective control system needs; the plan covers the key points:
- **Disciplined budget and authorization of expenditures** — purchases approved before buying, the reserve only with all four.
- **Timely accounting of physical progress and cost** — the daily time log and the stored receipts.
- **Frequent, periodic comparison of actual with plan** — the milestone review against Tables 18 and 19.
The **operating cycle** after planning (phase I) maps the same way: work authorization and release (II — task cards with an owner, approved purchases), cost data collection and reporting (III — time log and receipts), cost analysis (IV — milestone review and the 10% rule), reporting to customer and management (V — report to the instructor).
**Earned value (EVMS)** is the early-warning system: it shows variances while they are still small and easy to correct.
@diagram pm-evm
= CV = BCWP − ACWP
= SV = BCWP − BCWS
= CPI = BCWP / ACWP
= SPI = BCWP / BCWS
A negative CV means a cost overrun, a negative SV means behind schedule; CPI or SPI above 1.0 is favourable. The lecture says the units can be money or hours, so EVM works on our effort baseline although nobody is paid.
| EVM term | YeahTrack at the midterm (5 Oct) |
|---|---|
| BCWS (PV), planned value | 349 900 KZT of labour value and 435 KZT of cash — end of week 5 in Table 19 |
| BCWP (EV), earned value | above PV: 3.1, 3.2 and the main functions of 3.3 finished early, 3.4 done; testing not started |
| ACWP (AC), actual cost | not known precisely: the time log started on 5 Oct, earlier weeks are being reconstructed |
| SV and SPI | SV > 0, SPI > 1 — ahead of schedule |
| CV and CPI | cannot be stated honestly yet; the first full EVM check is at the next milestone review |
| BAC, budget at completion | 708 240 KZT of labour value (300 h) and 51 913 KZT of cash |
Kerzner calls BCWP the hard part, because it needs a percent complete. We therefore state only the direction of EV (above PV), not an exact amount.
## How to say it at the defense
- **Say:** "We log actual hours every day in docs/HOURS.md, in half-hour steps, and meetings count too."
- **Say:** "At each milestone review, Ayat compares actual hours and purchases with the cost baseline."
- **Say:** "If we are more than 10% over, we simplify a task, use the reserve, or submit a change request."
- **Say:** "Our planned value at the end of week 5 is 349 900 tenge; earned value is higher, so SPI is above one."
- **Say:** "We do not state a CPI yet, because the time log only started on 5 October."
- **Say:** "Being ahead does not mean finishing early: the extra time goes to the accuracy and lighting studies."
## Weak spots and honest answers
- **"So you do not know your actual cost?"** — Correct for labour before 5 Oct: the earlier weeks are being reconstructed by each member. We do not claim a CV or CPI; the first full EVM check is at the next milestone review.
- **"SPI above 1 — will you finish early?"** — No. All measurements so far are on synthetic hands; the gained time goes to studies 4.1 and 4.2, user testing starts on 20 Oct in any case, and the baseline was kept unchanged to keep the variance visible.
- **"What is your exact earned value?"** — We give the direction, not a number: development packages are finished and testing has not started, so EV is above PV.
> Today we can honestly state SV > 0 and SPI > 1, but not CV or CPI: actual hours are logged only since 5 October.
## Check yourself
?? Which three options does the team choose from when hours or a purchase exceed the plan by more than 10%?
?= Simplify a task, use the reserve, or submit a change request (Section 6).
?? Why can the team state SV and SPI at the midterm, but not CV and CPI?
?= SV and SPI need only EV and PV (349 900 KZT at the end of week 5); CV and CPI need the actual cost, and actual hours are logged only since 5 Oct while the earlier weeks are being reconstructed.`,
        ru: `## Что мы написали
Раздел 8 задаёт два вида контроля затрат — для денег и для труда, а раздел 17 добавляет правила журнала часов.
**Деньги.** Каждую покупку одобряют до того, как её сделать: владелец области предлагает товар со ссылкой на предложение, Ayat и ещё один участник одобряют, а чек хранится в репозитории. Резерв тратится только с согласия всех четверых, и каждый вносит свою долю только после одобрения покупки.
**Труд.** Фактические часы записываются в журнал часов **docs/HOURS.md**, введённый 5 октября вместе с карточками задач, ревью PR и реестром рисков (CR-03, веха M7). Правила:
- каждый вносит свои часы **в тот же день**, когда сделана работа;
- шагами по **полчаса**;
- **встречи и обсуждения учитываются**, потому что коммиты их не показывают;
- записи за прошлые недели каждый участник сейчас дополняет.
| Что контролируем | Запись | Кто решает | Повод для разбора |
|---|---|---|---|
| Часы труда | docs/HOURS.md, заполняется ежедневно | каждый вносит сам; Ayat сравнивает с базовым планом трудозатрат на каждом обзоре вехи | фактические часы больше базового плана более чем на 10% |
| Покупки из таблицы 8 | чек в репозитории | Ayat и ещё один участник, до покупки | покупка дороже оценки более чем на 10% |
| Покупка не из таблицы 8 | запрос на изменение (GitHub issue) | все четверо — это крупное изменение | всегда |
| Резерв, 5 191 KZT | вне базового плана | все четверо | один из трёх вариантов после отклонения |
Где происходит сравнение (таблица 6 и разделы 11, 16, 17):
| Встреча | Частота | Что проверяет по затратам | Ведущий |
|---|---|---|---|
| Короткая сверка прогресса | каждые 1–2 дня | задачи, которые могут опоздать; у кого на неделе меньше времени | Ayat |
| Еженедельная встреча | раз в неделю, с 5 октября | карточки задач, реестр рисков, журнал часов | Ayat |
| Обзор вехи | на каждой вехе | нарастающие фактические часы и покупки против базового плана | Ayat |
| Отчёт преподавателю | на каждом результате | письменный отчёт и презентация | Ayat |
**Правило 10%** (раздел 8). Если фактические часы превышают базовый план более чем на 10% или покупка дороже оценки более чем на 10%, команда разбирает причину и решает:
- **упростить задачу**;
- **использовать резерв** — только с согласия всех четверых;
- **подать запрос на изменение** (раздел 6) — решает процедура изменений, она же обновляет базовые планы.
Любая покупка не из таблицы 8 — **крупное изменение (major change)**, нужна вся команда: таблица 4 относит к крупным любое изменение, требующее покупки.
## Теория за этим
Керцнер (лекция 4) перечисляет, что нужно действенной системе контроля; план закрывает главные пункты:
- **Дисциплина бюджета и разрешение расходов** — покупки одобряются до оплаты, резерв — только с согласия всех четверых.
- **Своевременный учёт физического прогресса и затрат** — ежедневный журнал часов и сохранённые чеки.
- **Частое регулярное сравнение факта с планом** — обзор вехи по таблицам 18 и 19.
**Операционный цикл** после планирования (фаза I) ложится так же: разрешение и выдача работ (II — карточки задач с владельцем, одобренные покупки), сбор и отчётность по затратам (III — журнал часов и чеки), анализ затрат (IV — обзор вехи и правило 10%), отчёт заказчику и руководству (V — отчёт преподавателю).
**Освоенный объём (EVMS)** — система раннего предупреждения: показывает отклонения, пока они малы и их легко исправить.
@diagram pm-evm
= CV = BCWP − ACWP
= SV = BCWP − BCWS
= CPI = BCWP / ACWP
= SPI = BCWP / BCWS
Отрицательный CV — перерасход, отрицательный SV — отставание; CPI или SPI больше 1,0 — хорошо. В лекции сказано, что единицами могут быть деньги или часы, поэтому EVM работает и на нашем плане трудозатрат, хотя никому не платят.
| Термин EVM | YeahTrack на мидтерме (5 октября) |
|---|---|
| BCWS (PV), плановый объём | 349 900 KZT стоимости труда и 435 KZT денег — конец недели 5 в таблице 19 |
| BCWP (EV), освоенный объём | выше PV: 3.1, 3.2 и основные функции 3.3 готовы раньше срока, 3.4 сделан; тестирование не начато |
| ACWP (AC), фактические затраты | точно неизвестны: журнал часов ведётся с 5 октября, прошлые недели восстанавливаются |
| SV и SPI | SV > 0, SPI > 1 — опережение графика |
| CV и CPI | честно назвать пока нельзя; первая полная проверка EVM — на следующем обзоре вехи |
| BAC, бюджет по завершении | 708 240 KZT стоимости труда (300 ч) и 51 913 KZT денег |
Керцнер называет BCWP самой трудной частью, потому что нужен процент выполнения. Поэтому мы называем только направление EV (выше PV), а не точную сумму.
## Как сказать на защите
- **Скажи:** «We log actual hours every day in docs/HOURS.md, in half-hour steps, and meetings count too.» — часы пишем каждый день в журнал, шагами по полчаса, встречи тоже считаются.
- **Скажи:** «At each milestone review, Ayat compares actual hours and purchases with the cost baseline.» — на каждом обзоре вехи Ayat сравнивает фактические часы и покупки с базовым планом.
- **Скажи:** «If we are more than 10% over, we simplify a task, use the reserve, or submit a change request.» — при перерасходе больше 10% упрощаем задачу, берём резерв или подаём запрос на изменение.
- **Скажи:** «Our planned value at the end of week 5 is 349 900 tenge; earned value is higher, so SPI is above one.» — плановый объём к концу недели 5 — 349 900 тенге; освоенный выше, поэтому SPI больше единицы.
- **Скажи:** «We do not state a CPI yet, because the time log only started on 5 October.» — CPI пока не называем: журнал часов ведётся только с 5 октября.
- **Скажи:** «Being ahead does not mean finishing early: the extra time goes to the accuracy and lighting studies.» — опережение не значит раннего финиша: время уходит на исследования точности и освещения.
## Слабые места и честные ответы
- **«Значит, фактических затрат вы не знаете?»** — Для труда до 5 октября — да: прошлые недели каждый участник сейчас восстанавливает. Мы не называем ни CV, ни CPI; первая полная проверка EVM — на следующем обзоре вехи.
- **«SPI больше 1 — закончите раньше?»** — Нет. Все измерения пока на синтетических руках; выигранное время идёт на исследования 4.1 и 4.2, пользовательское тестирование начинается 20 октября в любом случае, а базовый план оставлен без изменений, чтобы отклонение было видно.
- **«Каков точный освоенный объём?»** — Называем направление, а не число: пакеты разработки готовы, тестирование не начато, значит, EV выше PV.
> Сегодня честно можно назвать SV > 0 и SPI > 1, но не CV и CPI: фактические часы пишутся только с 5 октября.
## Проверь себя
?? Из каких трёх вариантов выбирает команда, когда часы или покупка превышают план более чем на 10%?
?= Упростить задачу, использовать резерв или подать запрос на изменение (раздел 6).
?? Почему на мидтерме команда может назвать SV и SPI, но не CV и CPI?
?= Для SV и SPI нужны только EV и PV (349 900 KZT к концу недели 5); для CV и CPI нужны фактические затраты, а фактические часы пишутся только с 5 октября, прошлые недели ещё восстанавливаются.`,
      },
      [
        qx("When was the time log, docs/HOURS.md, introduced?", "On 5 October 2026", [
          ["On 1 September 2026", "1 September is the project start; the log did not exist then, which is why the earlier weeks are being reconstructed.", "1 сентября — старт проекта; журнала тогда не было, поэтому прошлые недели сейчас восстанавливают."],
          ["On 3 October 2026", "3 October is the date of CR-01, the removal of the workout mode.", "3 октября — дата CR-01, удаления режима тренировок."],
          ["On 20 October 2026", "20 October is the start of user testing (4.3), not of the time log.", "20 октября начинается пользовательское тестирование (4.3), а не журнал часов."],
        ], "Section 17: the time log was introduced on 5 October, together with task cards, PR review and the risk register (CR-03, M7).", "Раздел 17: журнал часов ввели 5 октября вместе с карточками задач, ревью PR и реестром рисков (CR-03, M7)."),
        qx("Why are meetings and discussions recorded in the time log?", "Commits do not show this kind of work", [
          ["Meetings are paid at a higher rate", "Nobody in the team is paid; the hours are only valued at market rates.", "Никому в команде не платят; часы лишь оцениваются по рыночным ставкам."],
          ["They are charged to the 10% reserve", "The reserve is cash for purchases, not a store of meeting hours.", "Резерв — это деньги на покупки, а не запас часов на встречи."],
          ["Only meetings are logged, not the coding", "All work is logged; meetings are included in addition to the rest of the work.", "В журнал идёт вся работа; встречи учитываются вдобавок к остальному."],
        ], "Section 17: meetings and discussions are included because commits do not show them — otherwise part of the effort would stay invisible.", "Раздел 17: встречи и обсуждения учитываются, потому что коммиты их не показывают, иначе часть усилий осталась бы невидимой."),
        qx("Who compares the actual hours and their value with the effort baseline at each milestone review?", "Ayat, who owns the milestone review", [
          ["Aizat, who keeps the time log", "Aizat is responsible for the time log, but Section 8 names Ayat for the comparison.", "Aizat отвечает за журнал часов, но раздел 8 называет для сравнения Ayat."],
          ["Yernar, who owns the build and the checks", "Yernar's area is storage, build and automated tests, not the cost comparison.", "Область Yernar — хранилище, сборка и автотесты, а не сравнение затрат."],
          ["The instructor, as the project sponsor", "The instructor receives a report at each deliverable; the milestone comparison is done inside the team.", "Преподаватель получает отчёт на каждом результате; сравнение на обзоре вехи делает сама команда."],
        ], "Section 8: at each milestone review, Ayat compares the actual hours and their value with the effort baseline in Section 17.", "Раздел 8: на каждом обзоре вехи Ayat сравнивает фактические часы и их стоимость с базовым планом трудозатрат из раздела 17."),
        qx("Under Section 8, what deviation makes the team analyse the cause and choose a response?", "Over 10% above plan, in hours or cash", [
          ["A task that is up to two days late", "That is the schedule rule in Section 11, and such a delay is solved without changing the baseline.", "Это правило графика из раздела 11, и такую задержку решают без изменения базового плана."],
          ["Any change that needs 4 hours or more", "4 hours is the line between minor and major changes in Table 4, not the cost trigger.", "4 часа — граница между мелким и крупным изменением в таблице 4, а не повод для разбора затрат."],
          ["Hours over plan by more than 5%", "The threshold in the report is 10%, not 5%.", "Порог в отчёте — 10%, а не 5%."],
        ], "Section 8: actual hours more than 10% above the baseline, or a purchase more than 10% above its estimate, trigger an analysis of the cause.", "Раздел 8: фактические часы больше базового плана более чем на 10% или покупка дороже оценки более чем на 10% — повод разобрать причину."),
        qx("Hours exceed the baseline by more than 10%. Which response is NOT one of the three options in the plan?", "Cut user testing short", [
          ["Simplify a task", "Simplifying a task is one of the three options in Section 8.", "Упростить задачу — один из трёх вариантов раздела 8."],
          ["Use the reserve", "Using the reserve is an option, with the agreement of all four members.", "Использовать резерв можно — с согласия всех четверых."],
          ["Submit a change request", "A change request under Section 6 is the third option.", "Запрос на изменение по разделу 6 — третий вариант."],
        ], "Section 8 lists simplify a task, use the reserve or submit a change request; Section 11 adds that minor features are reduced instead of shortening testing.", "Раздел 8 называет: упростить задачу, взять резерв или подать запрос на изменение; раздел 11 добавляет, что урезают мелкие функции, а не тестирование."),
        qx("A member wants to buy an extra webcam that is not in Table 8. How is the purchase treated?", "As a major change: all four must agree", [
          ["As a minor change: Ayat and the owner", "Table 4 classes any change that requires a purchase as major, so the minor route does not apply.", "Таблица 4 относит к крупным любое изменение с покупкой, поэтому путь мелкого изменения не подходит."],
          ["As a normal purchase: Ayat plus one member", "Ayat plus one member approve only the purchases already listed in Table 8.", "Ayat и ещё один участник одобряют только покупки, уже перечисленные в таблице 8."],
          ["Paid from the reserve without a decision", "The reserve is released only with the agreement of all four members.", "Резерв расходуется только с согласия всех четверых."],
        ], "Section 8: any purchase not listed in Table 8 is a major change and requires the agreement of the whole team.", "Раздел 8: любая покупка не из таблицы 8 — крупное изменение, нужно согласие всей команды."),
        qx("Who approves a purchase that is listed in Table 8 before it is made?", "Ayat and one other member", [
          ["All four members together", "Unanimity is needed for the reserve and for purchases outside Table 8, not for listed items.", "Согласие всех нужно для резерва и для покупок вне таблицы 8, а не для перечисленных."],
          ["The area owner who proposed it", "The area owner proposes the item with a link; the approval comes from Ayat and one other member.", "Владелец области предлагает товар со ссылкой, а одобряют Ayat и ещё один участник."],
          ["The instructor, as the sponsor", "Purchase approval stays inside the team; the instructor is not part of it in Section 9.", "Одобрение покупок остаётся внутри команды; в разделе 9 преподавателя в нём нет."],
        ], "Section 9: the owner of the area proposes the item, the purchase is approved by Ayat and one other member, and the receipt is stored.", "Раздел 9: владелец области предлагает товар, покупку одобряют Ayat и ещё один участник, чек сохраняется."),
        qx("What is the planned cumulative cash, the cash BCWS, at the end of week 5?", "435 KZT", [
          ["0 KZT", "Cash is 0 only until week 4; the domain, 435 KZT, is planned in week 5.", "Деньги равны 0 только до недели 4; домен за 435 KZT запланирован в неделе 5."],
          ["51 913 KZT", "51 913 KZT is reached only after the purchases of week 6.", "51 913 KZT набирается только после покупок недели 6."],
          ["51 478 KZT", "51 478 KZT is the cash of week 6 alone.", "51 478 KZT — деньги одной недели 6."],
        ], "Table 19: cumulative cash at the end of week 5 is 435 KZT — the domain is the only purchase before the midterm.", "Таблица 19: нарастающие деньги к концу недели 5 — 435 KZT; домен — единственная покупка до мидтерма."),
        qx("Which formula from Lecture 4 gives the schedule variance?", "SV = BCWP − BCWS", [
          ["SV = BCWS − BCWP", "The order is reversed; in the lecture a negative SV means behind schedule, which needs BCWP first.", "Порядок перевёрнут; в лекции отрицательный SV значит отставание, для этого BCWP стоит первым."],
          ["SV = BCWP − ACWP", "BCWP − ACWP is the cost variance, CV.", "BCWP − ACWP — это отклонение по стоимости, CV."],
          ["SV = BCWP / BCWS", "A ratio of BCWP to BCWS is the schedule performance index, SPI.", "Отношение BCWP к BCWS — индекс выполнения графика, SPI."],
        ], "SV = BCWP − BCWS: earned value minus planned value; a negative SV means behind schedule.", "SV = BCWP − BCWS: освоенный объём минус плановый; отрицательный SV — отставание."),
        qx("Development packages finished early and testing has not started. What follows for YeahTrack's SV and SPI?", "SV > 0 and SPI > 1", [
          ["SV < 0 and SPI < 1", "A negative SV and SPI below 1 mean behind schedule; YeahTrack is ahead.", "Отрицательный SV и SPI меньше 1 — отставание, а YeahTrack впереди."],
          ["SV > 0 but SPI < 1", "Both come from BCWP and BCWS: if BCWP > BCWS, then SV > 0 and SPI > 1 together.", "Оба считаются из BCWP и BCWS: если BCWP > BCWS, то SV > 0 и SPI > 1 одновременно."],
          ["SV = 0 and SPI = 1", "Exactly on plan would mean EV equals PV, but development is about three weeks ahead.", "Ровно по плану — это EV = PV, а разработка опережает план примерно на три недели."],
        ], "EV is above PV (349 900 KZT at the end of week 5), so SV = EV − PV > 0 and SPI = EV / PV > 1: ahead of schedule.", "EV выше PV (349 900 KZT к концу недели 5), поэтому SV = EV − PV > 0 и SPI = EV / PV > 1: опережение графика."),
        qx("Why can the team not state CV and CPI honestly at the midterm?", "Actual hours (ACWP) are not known yet", [
          ["The planned value (BCWS) is not defined", "BCWS is defined: 349 900 KZT of labour value at the end of week 5.", "BCWS определён: 349 900 KZT стоимости труда к концу недели 5."],
          ["EVM cannot be used for unpaid labour", "Lecture 4 says the units can be hours as well as money, so unpaid hours still work.", "Лекция 4 говорит, что единицами могут быть и часы, поэтому неоплачиваемые часы подходят."],
          ["CV and CPI apply only to cash purchases", "CV and CPI apply to any cost measure, including valued hours.", "CV и CPI применимы к любой мере затрат, включая оценённые часы."],
        ], "CV = BCWP − ACWP and CPI = BCWP / ACWP need actual cost; the time log exists only since 5 Oct and the earlier weeks are being reconstructed.", "CV = BCWP − ACWP и CPI = BCWP / ACWP требуют фактических затрат; журнал часов ведётся только с 5 октября, прошлые недели восстанавливаются."),
        qx("Which YeahTrack practice is phase III of Kerzner's operating cycle, cost data collection and reporting?", "The daily time log and stored receipts", [
          ["The approval of purchases before buying", "Approving spending before it happens is work authorization and release, phase II.", "Одобрение расходов заранее — это разрешение и выдача работ, фаза II."],
          ["The comparison at the milestone review", "Comparing actuals with the baseline is cost analysis, phase IV.", "Сравнение факта с базовым планом — анализ затрат, фаза IV."],
          ["The report to the instructor", "Reporting to the customer and management is phase V.", "Отчёт заказчику и руководству — фаза V."],
        ], "Phase III collects the actual cost data: hours entered daily in docs/HOURS.md and receipts stored in the repository.", "Фаза III собирает фактические данные о затратах: часы, внесённые в docs/HOURS.md в тот же день, и чеки в репозитории."),
        qx("Examiner: your SPI is above 1. Will YeahTrack finish before 4 November? Best answer?", "No: the gained time goes to the accuracy and lighting studies", [
          ["Yes — development is done, so we will present it in mid-October", "Over-claims: all measurements so far are on synthetic hands, and user testing starts on 20 Oct in any case.", "Это преувеличение: все измерения пока на синтетических руках, а тестирование с людьми начинается 20 октября в любом случае."],
          ["Yes, so we can shorten the user testing", "The report cuts minor features instead of testing — the test with 30 users is the only way to confirm the objectives.", "Отчёт урезает мелкие функции, а не тестирование: тест с 30 пользователями — единственный способ подтвердить цели."],
          ["We have no plan dates, so we cannot say", "Denies the report: Tables 2 and 3 give every date up to 4 Nov.", "Отрицает отчёт: таблицы 2 и 3 дают все даты вплоть до 4 ноября."],
        ], "Being ahead does not mean finishing early: the time goes to studies 4.1 and 4.2, user testing starts on 20 Oct anyway, and the baseline was kept unchanged.", "Опережение не значит раннего финиша: время идёт на исследования 4.1 и 4.2, тестирование всё равно с 20 октября, а базовый план оставлен без изменений."),
        qx("Examiner: what is your cost performance index today? Best answer?", "Not yet known: hours are logged only since 5 Oct", [
          ["Exactly 1.0 — we are precisely on budget", "Over-claims: without actual hours (ACWP) there is no basis for any CPI value.", "Преувеличение: без фактических часов (ACWP) нет основания ни для какого значения CPI."],
          ["Above 1, because almost none of the cash budget is spent yet", "Cash is a small part of the baseline, and the labour actuals that dominate the cost are not known yet.", "Деньги — малая часть базового плана, а фактический труд, который составляет основную стоимость, пока неизвестен."],
          ["EVM does not apply, since we are not paid", "Denies the method: EVM works in hours too, and the report values the hours exactly for control.", "Отрицает метод: EVM работает и в часах, а отчёт оценивает часы именно для контроля."],
        ], "Say it honestly: actual hours exist only since 5 Oct and earlier weeks are being reconstructed, so CPI will be stated at the next milestone review.", "Скажи честно: фактические часы есть только с 5 октября, прошлые недели восстанавливаются, поэтому CPI назовём на следующем обзоре вехи."),
        tfx("Members enter hours in the time log in half-hour steps, and meetings are left out.", false,
          "Half-hour steps are right, but meetings and discussions are included, because commits do not show them.",
          "Шаги по полчаса — верно, но встречи и обсуждения учитываются, потому что коммиты их не показывают.",
          "True would require meetings to be excluded, but Section 17 explicitly includes meetings and discussions.",
          "«Верно» требовало бы исключить встречи, но раздел 17 прямо их включает вместе с обсуждениями."),
      ],
    ),
  ],
};
