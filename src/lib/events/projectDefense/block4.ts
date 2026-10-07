import { part, qx, tfx, type Lecture } from "../types";

export const block4: Lecture = {
  id: "pd-b4",
  title: { en: "Block 4 — Estimating and the budget", ru: "Блок 4 — Оценка затрат и бюджет" },
  parts: [
    part(
      "pd-b4-p1",
      { en: "Cash budget, purchases and estimating", ru: "Денежный бюджет, закупки и оценка затрат" },
      {
        en: `## What we wrote
Section 8 of the report separates **two kinds of cost**, because they are covered in different ways.
- **Cash budget** — the money actually spent on equipment and services: **51 913 KZT** of purchases plus a **10% contingency reserve** of **5 191 KZT**, which gives **57 104 KZT**.
- **Team labour** — **300 hours**; the members are students and are not paid, so labour is an **in-kind contribution**, valued at market salaries at **708 240 KZT** (part 2 of this block).
| Item | Paid by | Amount (KZT) |
|---|---|---|
| Equipment and services (Table 8) | Team members, equal shares | 51 913 |
| Contingency reserve, 10% of purchases | Team members, if needed | 5 191 |
| Cash budget |  | 57 104 |
| Team labour, 300 hours at market rates (Table 9) | Not paid: in-kind contribution of the students | 708 240 |
| Total economic cost of the project |  | 765 344 |
@diagram pm-budget
There is **no external sponsor funding**, so the cash budget is paid by the four members in **equal shares of about 14 276 KZT** each. Each member pays their share **only when a purchase is approved**.
= 51 913 + 5 191 = 57 104 KZT;  57 104 / 4 = 14 276 KZT
= 57 104 + 708 240 = 765 344 KZT
The reserve is **not part of the cost baseline** (Section 17) and is used **only with the agreement of all four members** — Block 5 explains why it behaves like a **management reserve**.
## The four purchases (Table 8)
Most tools are **free and open source** (Table 1), and the members' own **laptops** are the development and test machines — the project does not buy them. Only four items are purchased:
| # | Item | Purpose | Qty | Unit price (KZT) | Total (KZT) |
|---|---|---|---|---|---|
| 1 | Webcam Logitech C270 HD | Second and third camera for the accuracy and lighting studies (720p, 30 fps) | 2 | 16 290 | 32 580 |
| 2 | Ring light 30 cm with tripod | Controlled light source for three lighting levels (risk R-02) | 1 | 12 238 | 12 238 |
| 3 | Domain yeahtrack.site, first year | Address of the website and the browser version | 1 | 435 | 435 |
| 4 | Railway Hobby plan, 3 months | Paid hosting (USD 5 a month) in case the free plan limits are reached (risk R-09) | 3 | 2 220 | 6 660 |
|  | Total purchases |  |  |  | 51 913 |
- The two webcams are there so that the results **do not depend on one laptop camera**.
- Dollar prices are converted at **444 KZT per USD**, the rate in Astana exchange offices on **29 September 2026** (Mybuh.kz).
= USD 5 × 444 = 2 220 KZT;  2 220 × 3 = 6 660 KZT
- The domain costs **435 KZT for the first year**; its **renewal costs USD 31.98 per year**.
- Cash is spent only in **weeks 5 and 6**: the domain in week 5 (435 KZT), everything else in week 6 (51 478 KZT); Block 5 shows the curve.
## How we buy (Section 9)
- The **owner of the related area proposes** the item with a link to the offer.
- The purchase is **approved by Ayat and one other member**.
- It is bought from a **seller in Kazakhstan** that has it **in stock** and can **deliver it to Astana within a week**, at the **lowest available price**.
- The **receipt is stored in the repository**.
- All purchases are **fixed-price retail purchases**, so **no contracts with suppliers** are needed.
- The webcams and the ring light are scheduled for **week 6**, before the accuracy and lighting studies begin.
- Any purchase **not listed in Table 8** is a **major change** and needs the agreement of the whole team; if a purchase exceeds its estimate by more than **10%**, the cause is analysed (simplify a task, use the reserve or submit a change request).
## The theory behind it
**Bottom-up estimating** (Lecture 3, the pricing process): the budget is built from the smallest pieces. Every purchase is priced from a **current offer**, and the hours of every **WBS work package** are multiplied by the market hourly rate of the person who does it — Kerzner calls this **pricing out the work breakdown structure**.
Good estimating needs information collected first: experience, reference material, **market and industry surveys**, knowledge of the work, **interviews with subject matter experts**. Our **supporting data** are the **vendor offers** with links (Table 8) and the salary surveys (Table 9); they are traceable by item number, so the estimate can be **audited**.
Kerzner's **classes of estimates** (Lecture 3, Fig. 3):
| Class | Type | Accuracy |
|---|---|---|
| I | Definitive | ±5% |
| II | Capital cost | ±10–15% |
| III | Appropriation (with some capital cost) | ±15–20% |
| IV | Appropriation | ±20–25% |
| V | Feasibility | ±25–35% |
| VI | Order of magnitude | > ±35% |
- Our **cash estimate** is bottom-up from **current price offers**, so it is **close to a definitive estimate** (Class I).
- Our **effort estimate** (hours per WBS package from the owners, made before the work) is a **planning-stage** estimate — less precise, so it is controlled with the **10% threshold**.
- Two **estimating pitfalls** from the lecture that we guard against: **failure to account for risks** — the 10% reserve, the ring light for R-02, the paid hosting for R-09 — and **cost escalation** — prices from current offers, the dollar fixed at one date.
## How to say it at the defense
- **Say:** “We separate two kinds of cost: a cash budget of 57 104 tenge and the value of our labour, 708 240 tenge.”
- **Say:** “There is no sponsor funding, so the four of us pay equal shares of about 14 276 tenge.”
- **Say:** “We buy only four items, and each one serves a study or a risk.”
- **Say:** “The cash estimate is bottom-up from current offers, so it is close to a definitive estimate.”
- **Say:** “Every purchase is approved by Ayat and one more member, and the receipt is stored in the repository.”
## Weak spots and honest answers
- **“Prices may change before you buy.”** — True. The prices are current offers and the dollar is fixed at 444 KZT on 29 September; the items are bought in week 6 from sellers that deliver within a week. If a purchase goes more than 10% over its estimate, we analyse it and simplify a task, use the reserve or submit a change request.
- **“Your budget ignores the laptops and the room.”** — The laptops belong to the members and the room is at the university; the project does not buy them, so the cash budget covers only what the project itself pays for.
- **“A domain for 435 tenge?”** — It is the first-year offer, and the renewal price, USD 31.98 a year, is written in Table 8. The first year covers the whole project, 1 September – 4 November 2026.
> Two kinds of cost: cash 57 104 KZT (51 913 of purchases + 10% reserve, four equal shares) and unpaid labour valued at 708 240 KZT — together 765 344 KZT.
## Check yourself
?? Why does the project buy two webcams if every laptop already has a camera?
?= To get a second and a third camera for the accuracy and lighting studies, so the results do not depend on one laptop camera.
?? Which class of estimate is the cash budget closest to, and why?
?= Class I, definitive (±5%): it is built bottom-up from current price offers with links, item by item.`,
        ru: `## Что мы написали
Раздел 8 отчёта разделяет **два вида затрат**, потому что они покрываются по-разному.
- **Денежный бюджет (cash budget)** — деньги, которые реально тратятся на оборудование и сервисы: **51 913 KZT** закупок плюс **резерв 10% (contingency reserve)** — **5 191 KZT**, итого **57 104 KZT**.
- **Труд команды** — **300 часов**; участники — студенты и зарплату не получают, поэтому труд — это **вклад в натуральной форме (in-kind contribution)**, оценённый по рыночным зарплатам в **708 240 KZT** (часть 2 этого блока).
| Статья | Кто платит | Сумма (KZT) |
|---|---|---|
| Оборудование и сервисы (Table 8) | Участники, равными долями | 51 913 |
| Резерв, 10% от закупок | Участники, если понадобится | 5 191 |
| Денежный бюджет |  | 57 104 |
| Труд команды, 300 часов по рыночным ставкам (Table 9) | Не оплачивается: вклад студентов в натуральной форме | 708 240 |
| Полная экономическая стоимость проекта |  | 765 344 |
@diagram pm-budget
**Внешнего финансирования от спонсора нет**, поэтому денежный бюджет оплачивают четыре участника **равными долями — примерно по 14 276 KZT**. Каждый вносит свою долю **только когда закупка одобрена**.
= 51 913 + 5 191 = 57 104 KZT;  57 104 / 4 = 14 276 KZT
= 57 104 + 708 240 = 765 344 KZT
Резерв **не входит в базовый план по стоимости (cost baseline)** (раздел 17) и используется **только с согласия всех четырёх участников** — в Блоке 5 разобрано, почему он ведёт себя как **управленческий резерв (management reserve)**.
## Четыре закупки (Table 8)
Большинство инструментов **бесплатные и с открытым кодом** (Table 1), а для разработки и тестов служат **собственные ноутбуки** участников — проект их не покупает. Покупаются только четыре позиции:
| # | Позиция | Зачем | Кол-во | Цена за шт. (KZT) | Итого (KZT) |
|---|---|---|---|---|---|
| 1 | Веб-камера Logitech C270 HD | Вторая и третья камера для исследований точности и освещения (720p, 30 fps) | 2 | 16 290 | 32 580 |
| 2 | Кольцевая лампа 30 см со штативом | Управляемый источник света для трёх уровней освещённости (риск R-02) | 1 | 12 238 | 12 238 |
| 3 | Домен yeahtrack.site, первый год | Адрес сайта и браузерной версии | 1 | 435 | 435 |
| 4 | Тариф Railway Hobby, 3 месяца | Платный хостинг (USD 5 в месяц) на случай, если упрёмся в лимиты бесплатного тарифа (риск R-09) | 3 | 2 220 | 6 660 |
|  | Итого закупок |  |  |  | 51 913 |
- Две веб-камеры нужны, чтобы результаты **не зависели от одной камеры ноутбука**.
- Цены в долларах пересчитаны по курсу **444 KZT за USD** — курс в обменниках Астаны на **29 сентября 2026** (Mybuh.kz).
= USD 5 × 444 = 2 220 KZT;  2 220 × 3 = 6 660 KZT
- Домен стоит **435 KZT за первый год**; **продление — USD 31.98 в год**.
- Деньги тратятся только в **недели 5 и 6**: домен — в неделю 5 (435 KZT), всё остальное — в неделю 6 (51 478 KZT); кривая — в Блоке 5.
## Как мы покупаем (раздел 9)
- **Владелец соответствующей зоны предлагает** позицию со ссылкой на предложение продавца.
- Закупку **одобряют Ayat и ещё один участник**.
- Покупаем у **продавца в Казахстане**, у которого товар **есть в наличии** и который **доставит его в Астану в течение недели**, по **самой низкой доступной цене**.
- **Чек сохраняется в репозитории**.
- Все закупки — **розничные покупки по фиксированной цене**, поэтому **договоры с поставщиками не нужны**.
- Веб-камеры и кольцевая лампа запланированы на **неделю 6** — до начала исследований точности и освещения.
- Любая закупка **вне Table 8** — **крупное изменение (major change)**, на неё нужно согласие всей команды; если закупка дороже своей оценки больше чем на **10%**, причину разбирают (упростить задачу, взять резерв или подать запрос на изменение).
## Теория за этим
**Оценка снизу вверх (bottom-up estimating)** (лекция 3, процесс ценообразования): бюджет собирается из самых мелких кусков. Каждая закупка оценена по **текущему предложению продавца**, а часы каждого **пакета работ WBS** умножены на рыночную почасовую ставку того, кто его делает, — у Кернера это **pricing out the work breakdown structure** (расценка WBS).
Хорошая оценка требует заранее собранной информации: опыт, справочные материалы, **обзоры рынка и отрасли (market and industry surveys)**, знание работы, **интервью с экспертами (subject matter experts)**. Наши **подтверждающие данные (supporting data)** — **предложения продавцов** со ссылками (Table 8) и обзоры зарплат (Table 9); они прослеживаются по номеру позиции, поэтому оценку можно **проверить (audit)**.
**Классы оценок (classes of estimates)** по Кернеру (лекция 3, Fig. 3):
| Класс | Тип | Точность |
|---|---|---|
| I | Definitive (окончательная) | ±5% |
| II | Capital cost (капитальные затраты) | ±10–15% |
| III | Appropriation with some capital cost (ассигнование с частью капзатрат) | ±15–20% |
| IV | Appropriation (ассигнование) | ±20–25% |
| V | Feasibility (технико-экономическое обоснование) | ±25–35% |
| VI | Order of magnitude (порядок величины) | > ±35% |
- Наша **денежная оценка** собрана снизу вверх из **текущих предложений продавцов**, поэтому она **близка к окончательной (definitive) оценке** (класс I).
- Наша **оценка трудозатрат** (часы по пакетам WBS от их владельцев, сделанные до начала работы) — оценка **стадии планирования (planning stage)**: менее точная, поэтому её контролируют **порогом 10%**.
- Две **ловушки оценки (estimating pitfalls)** из лекции, от которых мы защищены: **неучёт рисков (failure to account for risks)** — резерв 10%, кольцевая лампа под R-02, платный хостинг под R-09 — и **рост цен (cost escalation)** — цены из текущих предложений, доллар зафиксирован на одну дату.
## Как сказать на защите
- **Скажи:** «We separate two kinds of cost: a cash budget of 57 104 tenge and the value of our labour, 708 240 tenge.» — разделяем два вида затрат: деньги и стоимость труда.
- **Скажи:** «There is no sponsor funding, so the four of us pay equal shares of about 14 276 tenge.» — спонсора нет, платим вчетвером поровну.
- **Скажи:** «We buy only four items, and each one serves a study or a risk.» — покупаем всего четыре вещи, и каждая нужна для исследования или против риска.
- **Скажи:** «The cash estimate is bottom-up from current offers, so it is close to a definitive estimate.» — денежная оценка снизу вверх по реальным предложениям, поэтому близка к окончательной.
- **Скажи:** «Every purchase is approved by Ayat and one more member, and the receipt is stored in the repository.» — каждую закупку одобряют Ayat и ещё один участник, чек хранится в репозитории.
## Слабые места и честные ответы
- **«Prices may change before you buy.»** — Да, это так. Цены — текущие предложения, доллар зафиксирован по 444 KZT на 29 сентября; покупаем в неделю 6 у продавцов, которые доставляют за неделю. Если закупка выйдет дороже оценки больше чем на 10%, разбираем причину и упрощаем задачу, берём резерв или подаём запрос на изменение.
- **«Your budget ignores the laptops and the room.»** — Ноутбуки принадлежат участникам, комната — университетская; проект их не покупает, поэтому денежный бюджет включает только то, за что платит сам проект.
- **«A domain for 435 tenge?»** — Это предложение на первый год, а цена продления, USD 31.98 в год, указана в Table 8. Первый год покрывает весь проект: 1 сентября – 4 ноября 2026.
> Два вида затрат: деньги 57 104 KZT (51 913 закупок + резерв 10%, четыре равные доли) и неоплачиваемый труд, оценённый в 708 240 KZT, — вместе 765 344 KZT.
## Проверь себя
?? Зачем проекту две веб-камеры, если в каждом ноутбуке уже есть камера?
?= Чтобы была вторая и третья камера для исследований точности и освещения и результаты не зависели от одной камеры ноутбука.
?? К какому классу оценки ближе всего денежный бюджет и почему?
?= К классу I, окончательной (definitive, ±5%): он собран снизу вверх из текущих предложений продавцов со ссылками, позиция за позицией.`,
      },
      [
        qx("What is YeahTrack's cash budget, including the contingency reserve?", "57 104 KZT", [
          ["51 913 KZT", "51 913 KZT is the purchases alone; the 10% reserve of 5 191 KZT is added on top.", "51 913 KZT — это только закупки; сверху добавляется резерв 10% — 5 191 KZT."],
          ["765 344 KZT", "765 344 KZT is the total economic cost: it also contains the value of the unpaid labour.", "765 344 KZT — полная экономическая стоимость: в ней есть ещё и стоимость неоплачиваемого труда."],
          ["708 240 KZT", "708 240 KZT is the market value of the 300 unpaid hours, not money that is spent.", "708 240 KZT — рыночная стоимость 300 неоплачиваемых часов, а не реально потраченные деньги."],
        ], "Cash budget = 51 913 KZT of purchases + 5 191 KZT reserve (10%) = 57 104 KZT (Table 7).", "Денежный бюджет = 51 913 KZT закупок + 5 191 KZT резерва (10%) = 57 104 KZT (Table 7)."),
        qx("How big is the contingency reserve, and what is it calculated from?", "5 191 KZT — 10% of the purchases", [
          ["5 710 KZT — 10% of the cash budget", "The reserve is 10% of the purchases (51 913 KZT), not of a cash budget that already contains it.", "Резерв — это 10% от закупок (51 913 KZT), а не от денежного бюджета, в который он сам уже входит."],
          ["70 824 KZT — 10% of the labour value", "Labour is unpaid and is not cash; the reserve is 10% of the purchases only.", "Труд не оплачивается и деньгами не является; резерв — 10% только от закупок."],
          ["2 596 KZT — 5% of the purchases", "The plan sets the reserve at 10% of the purchases, not 5%.", "В плане резерв — 10% от закупок, а не 5%."],
        ], "Table 7: contingency reserve, 10% of purchases = 5 191 KZT; it is outside the cost baseline and used only with the agreement of all four.", "Table 7: резерв — 10% от закупок = 5 191 KZT; он вне базового плана по стоимости и тратится только с согласия всех четверых."),
        qx("Who pays for the cash budget, and how much does each person pay?", "The four members, about 14 276 KZT each", [
          ["The four members, about 12 978 KZT each", "12 978 KZT is 51 913 / 4: it forgets the 10% reserve, which is also part of the cash budget.", "12 978 KZT — это 51 913 / 4: здесь забыт резерв 10%, который тоже входит в денежный бюджет."],
          ["The instructor as sponsor, 57 104 KZT", "The instructor is the sponsor, but the project has no external sponsor funding.", "Преподаватель — спонсор проекта, но внешнего финансирования от спонсора у проекта нет."],
          ["Ayat alone, as team lead, 57 104 KZT", "The cash budget is split into equal shares, not paid by the team lead alone.", "Денежный бюджет делится на равные доли, а не оплачивается одним тимлидом."],
        ], "No external sponsor funding: 57 104 / 4 = 14 276 KZT per member, contributed only when a purchase is approved.", "Внешнего финансирования нет: 57 104 / 4 = 14 276 KZT на участника, и вносится доля только после одобрения закупки."),
        qx("At what rate are dollar prices converted to tenge in the budget?", "444 KZT per USD, Astana rate of 29 Sep 2026", [
          ["444 KZT per USD, Astana rate of 5 Oct 2026", "5 October is the midterm date; the rate is the one of 29 September 2026.", "5 октября — дата промежуточного отчёта; курс взят на 29 сентября 2026."],
          ["435 KZT per USD, Astana rate of 29 Sep 2026", "435 KZT is the price of the domain for the first year, not the exchange rate.", "435 KZT — цена домена за первый год, а не курс валюты."],
          ["500 KZT per USD, a rounded planning rate", "The report uses the actual rate in Astana exchange offices, not a rounded figure.", "В отчёте взят фактический курс в обменниках Астаны, а не округлённое число."],
        ], "Section 8: amounts in USD are converted at 444 KZT per USD, the rate in Astana exchange offices on 29 September 2026 (Mybuh.kz).", "Раздел 8: суммы в долларах пересчитаны по 444 KZT за USD — курс в обменниках Астаны на 29 сентября 2026 (Mybuh.kz)."),
        qx("Why does the budget include two Logitech C270 HD webcams?", "So results do not depend on one laptop camera", [
          ["To replace laptop cameras that do not work", "The laptop cameras work; the webcams are a second and a third camera for the studies.", "Камеры ноутбуков работают; веб-камеры — это вторая и третья камера для исследований."],
          ["To stream video to a server that runs recognition", "No camera image is sent over the network: recognition runs on the user's computer.", "Изображение с камеры по сети не передаётся: распознавание идёт на компьютере пользователя."],
          ["To give each of the four members a camera", "There are two webcams, not four, and they serve the accuracy and lighting studies.", "Веб-камер две, а не четыре, и они нужны для исследований точности и освещения."],
        ], "Table 8: the webcams are the second and third camera for the accuracy and lighting studies, to avoid results that depend on one laptop camera.", "Table 8: веб-камеры — вторая и третья камера для исследований точности и освещения, чтобы результаты не зависели от одной камеры ноутбука."),
        qx("Which purchase directly answers risk R-02, the unstudied lighting?", "Ring light 30 cm with tripod", [
          ["Railway Hobby plan, 3 months", "The Railway plan answers R-09: the limits of the free hosting plan.", "Тариф Railway отвечает на R-09 — лимиты бесплатного хостинга."],
          ["Domain yeahtrack.site, first year", "The domain is the address of the website and the browser version, not a light source.", "Домен — адрес сайта и браузерной версии, а не источник света."],
          ["Depth camera for hand tracking", "Special hardware such as depth cameras is explicitly excluded from the scope.", "Специальное оборудование вроде камер глубины прямо исключено из объёма работ."],
        ], "The ring light is a controlled light source for testing recognition at three lighting levels (risk R-02).", "Кольцевая лампа — управляемый источник света, чтобы проверить распознавание при трёх уровнях освещённости (риск R-02)."),
        qx("The Railway Hobby plan costs USD 5 a month and is budgeted for 3 months. What is its total in Table 8?", "6 660 KZT", [
          ["2 220 KZT", "2 220 KZT is one month (USD 5 × 444); the plan is budgeted for 3 months.", "2 220 KZT — это один месяц (USD 5 × 444); в бюджете заложено 3 месяца."],
          ["6 525 KZT", "6 525 KZT would use 435 KZT per USD; 435 is the domain price, the rate is 444.", "6 525 KZT получилось бы по 435 KZT за доллар; 435 — цена домена, а курс — 444."],
          ["7 200 KZT", "7 200 KZT would need a rate of 480 KZT per USD; the plan uses 444.", "7 200 KZT было бы при курсе 480 KZT за доллар; в плане курс 444."],
        ], "USD 5 × 444 = 2 220 KZT a month; 2 220 × 3 = 6 660 KZT (Table 8, item 4).", "USD 5 × 444 = 2 220 KZT в месяц; 2 220 × 3 = 6 660 KZT (Table 8, позиция 4)."),
        qx("Who approves a planned purchase from Table 8?", "Ayat and one other member", [
          ["All four members at the weekly meeting", "All four must agree to use the reserve or to buy something outside Table 8, not for a planned purchase.", "Согласие всех четверых нужно для резерва или закупки вне Table 8, а не для запланированной покупки."],
          ["The owner of the related area alone", "The area owner proposes the item with a link; approval needs Ayat and one other member.", "Владелец зоны предлагает позицию со ссылкой, а одобряют Ayat и ещё один участник."],
          ["The instructor, as the project sponsor", "The sponsor accepts the plan (Section 19); single purchases are approved inside the team.", "Спонсор принимает план (раздел 19); отдельные закупки одобряются внутри команды."],
        ], "Section 9: the area owner proposes the item, Ayat and one other member approve it, and the receipt is stored in the repository.", "Раздел 9: владелец зоны предлагает позицию, Ayat и ещё один участник одобряют, чек сохраняется в репозитории."),
        tfx("A purchase that is not listed in Table 8 is a major change and needs the agreement of the whole team.", true, "Section 8: any purchase not listed in Table 8 is a major change; Table 4 also lists ‘requires a purchase’ among the major-change criteria.", "Раздел 8: любая закупка вне Table 8 — крупное изменение; в Table 4 «требует закупки» тоже стоит среди признаков крупного изменения.", "Choosing False would let one member buy an unplanned item alone, which the cost and change rules forbid.", "Ответ False позволил бы одному участнику купить незапланированную вещь в одиночку, а правила стоимости и изменений это запрещают."),
        qx("Using Kerzner's classes of estimates, which class is our cash budget closest to?", "Class I — definitive estimate, ±5%", [
          ["Class VI — order of magnitude, > ±35%", "An order-of-magnitude guess has no item prices; ours prices every item from a current offer.", "Оценка «порядок величины» не опирается на цены позиций, а у нас каждая позиция оценена по текущему предложению."],
          ["Class V — feasibility, ±25–35%", "Feasibility estimates come at the concept stage with little scope; our items and quantities are fixed.", "Оценки feasibility делают на стадии замысла при минимуме данных; у нас позиции и количества известны."],
          ["Class II — capital cost, ±10–15%", "Our estimate is built from current offers for exact items, which is tighter than a capital-cost estimate.", "Наша оценка собрана из текущих предложений на конкретные позиции — это точнее, чем оценка капитальных затрат."],
        ], "The cash estimate is bottom-up from current price offers, so it is close to a definitive estimate (Class I, ±5%).", "Денежная оценка собрана снизу вверх из текущих предложений продавцов, поэтому близка к окончательной (класс I, ±5%)."),
        qx("How did the team estimate the budget, in the terms of Lecture 3?", "Bottom-up: pricing out each item and WBS package", [
          ["Top-down: a share of a similar project's cost", "No analogy with another project was used; each item and package was priced separately.", "Аналогию с другим проектом не использовали; каждая позиция и каждый пакет оценены отдельно."],
          ["Parametric: a cost estimating relationship (CER) model", "CERs come from regression or cost models; we priced real offers and planned hours instead.", "CER получают из регрессии или моделей затрат; мы же взяли реальные предложения и плановые часы."],
          ["By the sponsor's fixed budget limit", "There is no sponsor funding or limit; the budget comes from the items and the hours.", "Финансирования и лимита от спонсора нет; бюджет складывается из позиций и часов."],
        ], "Section 8: each purchase priced from a current offer, and the hours of each WBS package multiplied by the rate of the person doing it — pricing out the WBS.", "Раздел 8: каждая закупка — по текущему предложению, часы каждого пакета WBS — на ставку исполнителя; это и есть расценка WBS."),
        qx("Kerzner says supporting data for prices usually comes from outside vendor quotes. What plays that role in YeahTrack?", "The offer links in Table 8 and the stored receipts", [
          ["The Gantt chart in Figure 5 with the schedule baseline", "The Gantt chart shows dates, not the price evidence behind each purchase.", "Диаграмма Ганта показывает сроки, а не подтверждение цены каждой закупки."],
          ["The risk register in docs/RISKS.md", "The risk register tracks risks; prices are backed by the offers and the receipts.", "Реестр рисков ведёт риски; цены подтверждаются предложениями продавцов и чеками."],
          ["The RACI matrix in Table 16", "The RACI matrix assigns responsibilities; it says nothing about prices.", "Матрица RACI распределяет ответственность и ничего не говорит о ценах."],
        ], "Table 8 links each item to the actual product offer, and receipts are stored in the repository — traceable supporting data that can be audited.", "Table 8 даёт ссылку на реальное предложение по каждой позиции, а чеки хранятся в репозитории — прослеживаемые данные, которые можно проверить."),
        qx("Which estimating pitfall from Lecture 3 do the 10% reserve and the risk-based purchases address?", "Failure to account for risks", [
          ["Misinterpretation of the statement of work", "The reserve does not clarify the scope; it covers cost uncertainty from risks.", "Резерв не уточняет объём работ; он покрывает неопределённость затрат из-за рисков."],
          ["Applying improper skill levels to tasks", "Skill levels concern who does the work, not money set aside for risks.", "Уровень квалификации — про то, кто делает работу, а не про деньги, отложенные на риски."],
          ["A buy-in hoping for later bail-out changes", "A buy-in is a low bid for a contract; YeahTrack does not bid against anyone.", "Buy-in — заниженная ставка ради контракта; YeahTrack ни с кем не соревнуется в тендере."],
        ], "The reserve, the ring light for R-02 and the paid hosting for R-09 put risks into the budget, so the pitfall ‘failure to account for risks’ is avoided.", "Резерв, кольцевая лампа под R-02 и платный хостинг под R-09 закладывают риски в бюджет — так мы избегаем ловушки «неучёт рисков»."),
        qx("Examiner: Your budget is only 57 104 tenge — is that the real cost of the project? Best answer?", "No — with our unpaid labour valued, it is 765 344", [
          ["Yes — software projects cost nothing but equipment", "This ignores the 300 hours that the report itself values at 708 240 KZT.", "Так игнорируются 300 часов, которые сам отчёт оценивает в 708 240 KZT."],
          ["We did not estimate labour because we are students", "This denies Table 9: labour is estimated and valued at market rates.", "Это отрицает Table 9: труд оценён по рыночным ставкам."],
          ["The university covers the rest, so it is not ours", "The report says there is no external sponsor funding; this invents one and shifts the cost.", "В отчёте сказано, что внешнего финансирования нет; такой ответ его выдумывает и перекладывает затраты."],
        ], "The honest answer separates the two kinds of cost: cash 57 104 KZT plus labour valued at 708 240 KZT gives 765 344 KZT.", "Честный ответ разделяет два вида затрат: деньги 57 104 KZT плюс труд, оценённый в 708 240 KZT, дают 765 344 KZT."),
        qx("Examiner: Prices change. How can you trust the 51 913 tenge of purchases? Best answer?", "Current offers, a 10% reserve and a 10% overrun rule", [
          ["Prices are guaranteed by the sellers for a year", "This over-claims: the report has retail offers, not price guarantees.", "Это преувеличение: в отчёте розничные предложения, а не гарантия цены."],
          ["If prices rise, we just buy cheaper items quietly", "That bypasses procurement and change control; an overrun above 10% is analysed openly.", "Так обходятся правила закупок и изменений; перерасход больше 10% разбирают открыто."],
          ["Any overrun would be the sellers' fault, not the team's", "Blaming sellers is no answer; the plan already has a 10% threshold and a reserve.", "Винить продавцов — не ответ; в плане уже есть порог 10% и резерв."],
        ], "Prices come from current offers; a purchase more than 10% over its estimate is analysed (simplify, use the reserve, or a change request).", "Цены — из текущих предложений; закупку дороже оценки больше чем на 10% разбирают (упростить, взять резерв или запрос на изменение)."),
      ],
    ),
    part(
      "pd-b4-p2",
      { en: "Labour value: rates and hours", ru: "Стоимость труда: ставки и часы" },
      {
        en: `## What we wrote
The members are students and **are not paid**, so labour is **not an expense** of the project — it is an **in-kind contribution**. Section 8 still values it at **current market salaries for junior specialists in Kazakhstan**, and Table 9 (Section 9) shows how.
| Member | Role | Market reference (median) | Monthly salary (KZT) |
|---|---|---|---|
| Ayat | Team lead and lead developer | Junior developer, local companies (Techinterview.space) | 400 000 |
| Yernar | Developer (storage, build, deployment) | Junior developer, local companies (Techinterview.space) | 400 000 |
| Aizat | QA engineer and technical writer | QA engineer, Astana (Taylor.kz) | 400 000 |
| Akbota | Front-end developer and designer | Junior JavaScript developer (Taylor.kz) | 385 200 |
The **hourly rate** is the monthly salary divided by **168 working hours**, and the **hours** are the planned hours from the **resource calendar** (Section 16, Table 17).
= hourly rate = monthly salary / 168
= labour cost = hourly rate × planned hours
| Member | Hourly rate (KZT) | Hours | Labour cost (KZT) |
|---|---|---|---|
| Ayat | 2 380 | 80 | 190 400 |
| Yernar | 2 380 | 80 | 190 400 |
| Aizat | 2 380 | 76 | 180 880 |
| Akbota | 2 290 | 64 | 146 560 |
| Total |  | 300 | 708 240 |
= 2 380 × 80 = 190 400;  2 380 × 76 = 180 880;  2 290 × 64 = 146 560
- The salaries are **gross monthly amounts** for junior specialists and **do not include employer contributions**.
- **Nobody pays these amounts**: the members work on the project as part of their course.
- Each member plans about **8 to 12 hours a week**; Aizat and Akbota peak at 12 hours in weeks 8–9, the user testing.
- Akbota's reference, junior JavaScript developer, is lower (385 200 KZT), so the rate for this role is **2 290 KZT** instead of **2 380 KZT**.
## Why value labour that nobody pays?
Section 8 gives **two reasons**:
- **To plan and control the effort** — the value of the planned hours is the **effort baseline** (Section 17). Actual hours go into the **time log** (docs/HOURS.md), and at each milestone review Ayat compares them and their value with the baseline; more than **10%** over → analyse the cause.
- **To show the commercial cost** — what the same project would cost if it were carried out by a **company**.
Together with the cash budget this gives the **total economic cost**:
= 57 104 + 708 240 = 765 344 KZT
The effort baseline by phase (Table 18):
| Phase | Weeks | Hours | Labour value (KZT) |
|---|---|---|---|
| Planning | Week 1 | 32 | 75 440 |
| Design | Week 2 | 30 | 70 860 |
| Development | Weeks 3–7 | 148 | 350 260 |
| Testing and launch | Weeks 8–10 | 90 | 211 680 |
| Baseline |  | 300 | 708 240 |
Each week's value is the hours of each member times that member's rate. Week 1, eight hours each:
= 3 × 8 × 2 380 + 8 × 2 290 = 57 120 + 18 320 = 75 440 KZT
## The theory behind it
- **Pricing out the WBS** (Lecture 3): labour cost = hours of each work package × the rate of the person who does it — the same **bottom-up** method as for the purchases.
- **How labour is priced** (Lecture 3, special problems): work can be priced at the **department average** salary, or at the **actual salary of the people who will do it** — the ideal case **when the people are known** during pricing. Our four people are known, so each member's hours are priced at that member's own rate.
- **Direct labour and overhead** (Lecture 3, overhead rates; Lecture 4 lists direct labor costing and overhead rate costing): a company adds an **overhead rate** for indirect costs such as rent, utilities, fringe benefits and administration. Our rates are **direct labour only** — gross salary, **no employer contributions, no overhead**.
- **Labour estimates** (Lecture 3, labor distributions): those who submit labour hours often **overestimate** them for fear of cuts. Our durations were estimated by **the people responsible for each task**; gesture training got the longest, **three weeks**, because the team had the least experience there.
- **Class of estimate** (Fig. 3): the cash estimate is close to **definitive**, but the effort estimate was made **before the work** from the owners' judgement — a **planning-stage** estimate, less precise, so it is controlled with the **10% threshold**.
> We are not paid, but our 300 hours are valued at junior market rates — 708 240 KZT — to plan and control the effort and to show what a company would spend.
## How to say it at the defense
- **Say:** “Our labour is unpaid, so it is an in-kind contribution, not an expense of the project.”
- **Say:** “We still value it at junior market salaries, because we use that value to plan and control our effort.”
- **Say:** “The hourly rate is the monthly salary divided by 168 working hours.”
- **Say:** “Together with the cash budget, the total economic cost is 765 344 tenge.”
- **Say:** “Our rates are direct labour only: no employer contributions and no overhead.”
## Weak spots and honest answers
- **“A company would charge much more.”** — Yes. Our rates are gross junior salaries without employer contributions or overhead, so 765 344 KZT is not a full commercial price; for planning and controlling our own effort, direct labour is enough.
- **“Why is the team lead valued like a junior developer?”** — All four are valued at **junior** market medians, and Ayat and Yernar share the junior developer reference. No premium for the lead role is added, so the value is conservative rather than inflated.
- **“400 000 / 168 is 2 381, not 2 380.”** — Right: the table rounds the hourly rate to whole tens of tenge (2 380.95 → 2 380; 2 292.86 → 2 290). For the whole team the difference is about 400 KZT, less than 0.1%.
## Check yourself
?? Where do the 80, 80, 76 and 64 hours in Table 9 come from?
?= From the resource calendar (Section 16, Table 17): the planned weekly hours of each member, 300 hours in total.
?? Why does the report call the team's labour an in-kind contribution?
?= Because the members are students and are not paid, so labour is not an expense; it is still valued (708 240 KZT) to plan and control the effort and to show the commercial cost.`,
        ru: `## Что мы написали
Участники — студенты и **зарплату не получают**, поэтому труд — **не расход** проекта, а **вклад в натуральной форме (in-kind contribution)**. Тем не менее раздел 8 оценивает его по **текущим рыночным зарплатам junior-специалистов в Казахстане**, а Table 9 (раздел 9) показывает, как именно.
| Участник | Роль | Рыночный ориентир (медиана) | Зарплата в месяц (KZT) |
|---|---|---|---|
| Ayat | Тимлид и ведущий разработчик | Junior-разработчик, местные компании (Techinterview.space) | 400 000 |
| Yernar | Разработчик (хранение, сборка, деплой) | Junior-разработчик, местные компании (Techinterview.space) | 400 000 |
| Aizat | QA-инженер и технический писатель | QA-инженер, Астана (Taylor.kz) | 400 000 |
| Akbota | Фронтенд-разработчик и дизайнер | Junior JavaScript-разработчик (Taylor.kz) | 385 200 |
**Почасовая ставка** — это месячная зарплата, делённая на **168 рабочих часов**, а **часы** — плановые часы из **календаря ресурсов (resource calendar)** (раздел 16, Table 17).
= hourly rate = monthly salary / 168
= labour cost = hourly rate × planned hours
| Участник | Ставка в час (KZT) | Часы | Стоимость труда (KZT) |
|---|---|---|---|
| Ayat | 2 380 | 80 | 190 400 |
| Yernar | 2 380 | 80 | 190 400 |
| Aizat | 2 380 | 76 | 180 880 |
| Akbota | 2 290 | 64 | 146 560 |
| Итого |  | 300 | 708 240 |
= 2 380 × 80 = 190 400;  2 380 × 76 = 180 880;  2 290 × 64 = 146 560
- Зарплаты — **месячные суммы до вычетов (gross)** для junior-специалистов, **без взносов работодателя (employer contributions)**.
- **Никто эти суммы не платит**: участники работают над проектом в рамках курса.
- Каждый планирует примерно **8–12 часов в неделю**; у Aizat и Akbota пик — 12 часов в недели 8–9, на пользовательском тестировании.
- Ориентир Akbota — junior JavaScript-разработчик — ниже (385 200 KZT), поэтому ставка для этой роли **2 290 KZT**, а не **2 380 KZT**.
## Зачем оценивать труд, за который никто не платит?
Раздел 8 называет **две причины**:
- **Планировать и контролировать трудозатраты** — стоимость плановых часов и есть **базовый план по трудозатратам (effort baseline)** (раздел 17). Фактические часы пишутся в **журнал времени (time log)** (docs/HOURS.md), и на каждом разборе вехи Ayat сравнивает их и их стоимость с базовым планом; перерасход больше **10%** → разбираем причину.
- **Показать коммерческую стоимость** — сколько стоил бы тот же проект, если бы его делала **компания**.
Вместе с денежным бюджетом это даёт **полную экономическую стоимость (total economic cost)**:
= 57 104 + 708 240 = 765 344 KZT
Базовый план трудозатрат по фазам (Table 18):
| Фаза | Недели | Часы | Стоимость труда (KZT) |
|---|---|---|---|
| Планирование | Неделя 1 | 32 | 75 440 |
| Проектирование | Неделя 2 | 30 | 70 860 |
| Разработка | Недели 3–7 | 148 | 350 260 |
| Тестирование и запуск | Недели 8–10 | 90 | 211 680 |
| Базовый план |  | 300 | 708 240 |
Стоимость каждой недели — часы каждого участника, умноженные на его ставку. Неделя 1, по восемь часов у каждого:
= 3 × 8 × 2 380 + 8 × 2 290 = 57 120 + 18 320 = 75 440 KZT
## Теория за этим
- **Расценка WBS (pricing out the WBS)** (лекция 3): стоимость труда = часы каждого пакета работ × ставка того, кто его делает, — тот же метод **снизу вверх (bottom-up)**, что и для закупок.
- **Как оценивают труд** (лекция 3, special problems): работу можно оценить по **средней зарплате отдела (department average)** или по **фактической зарплате тех, кто будет её делать**, — идеальный вариант, **если люди известны** уже при оценке. Наши четыре человека известны, поэтому часы каждого оценены по его собственной ставке.
- **Прямой труд и накладные расходы** (лекция 3, overhead rates; в лекции 4 — direct labor costing и overhead rate costing): компания добавляет **ставку накладных расходов (overhead rate)** на косвенные затраты — аренду, коммунальные услуги, соцпакет (fringe benefits), администрирование. Наши ставки — **только прямой труд (direct labour)**: зарплата до вычетов, **без взносов работодателя и без накладных расходов**.
- **Оценка трудозатрат** (лекция 3, labor distributions): те, кто подаёт часы, часто их **завышают**, боясь сокращения. Наши длительности оценивали **ответственные за каждую задачу**; самую длинную, **три недели**, получило обучение жестам, потому что там у команды было меньше всего опыта.
- **Класс оценки** (Fig. 3): денежная оценка близка к **окончательной (definitive)**, а оценка трудозатрат сделана **до начала работы** по суждению владельцев задач — это оценка **стадии планирования (planning stage)**, менее точная, поэтому её контролируют **порогом 10%**.
> Нам не платят, но наши 300 часов оценены по рыночным ставкам junior — 708 240 KZT, — чтобы планировать и контролировать трудозатраты и показать, сколько потратила бы компания.
## Как сказать на защите
- **Скажи:** «Our labour is unpaid, so it is an in-kind contribution, not an expense of the project.» — труд не оплачивается, поэтому это вклад, а не расход.
- **Скажи:** «We still value it at junior market salaries, because we use that value to plan and control our effort.» — всё равно оцениваем по рыночным зарплатам, чтобы планировать и контролировать усилия.
- **Скажи:** «The hourly rate is the monthly salary divided by 168 working hours.» — ставка в час = месячная зарплата / 168 рабочих часов.
- **Скажи:** «Together with the cash budget, the total economic cost is 765 344 tenge.» — вместе с деньгами полная экономическая стоимость — 765 344 тенге.
- **Скажи:** «Our rates are direct labour only: no employer contributions and no overhead.» — ставки — только прямой труд, без взносов работодателя и накладных.
## Слабые места и честные ответы
- **«A company would charge much more.»** — Да. Наши ставки — зарплаты junior до вычетов, без взносов работодателя и накладных расходов, поэтому 765 344 KZT — не полная коммерческая цена; для планирования и контроля собственных усилий прямого труда достаточно.
- **«Why is the team lead valued like a junior developer?»** — Все четверо оценены по рыночным медианам для **junior**, и у Ayat с Yernar общий ориентир — junior-разработчик. Надбавка за роль лида не добавлена, так что оценка скорее занижена, чем раздута.
- **«400 000 / 168 is 2 381, not 2 380.»** — Верно: в таблице ставка округлена до целых десятков тенге (2 380.95 → 2 380; 2 292.86 → 2 290). На всю команду разница около 400 KZT, меньше 0,1%.
## Проверь себя
?? Откуда в Table 9 взялись 80, 80, 76 и 64 часа?
?= Из календаря ресурсов (раздел 16, Table 17): это плановые часы каждого участника по неделям, всего 300 часов.
?? Почему в отчёте труд команды назван вкладом в натуральной форме?
?= Потому что участники — студенты и зарплату не получают, значит труд — не расход; но его всё равно оценивают (708 240 KZT), чтобы планировать и контролировать трудозатраты и показать коммерческую стоимость.`,
      },
      [
        qx("How is the hourly rate in Table 9 calculated?", "Monthly salary divided by 168 working hours", [
          ["Monthly salary divided by 160 working hours", "The report divides by 168 working hours, not 160.", "В отчёте делят на 168 рабочих часов, а не на 160."],
          ["Monthly salary divided by the 300 project hours", "300 is the team's total planned hours; the rate uses a working month of 168 hours.", "300 — это все плановые часы команды; ставка считается от рабочего месяца в 168 часов."],
          ["Annual salary divided by 2 000 working hours", "The report starts from the gross monthly salary, not from an annual one.", "Отчёт отталкивается от месячной зарплаты, а не от годовой."],
        ], "Section 9: the hourly rate is the monthly salary divided by 168 working hours, e.g. 400 000 / 168 ≈ 2 380 KZT.", "Раздел 9: ставка в час — месячная зарплата, делённая на 168 рабочих часов, например 400 000 / 168 ≈ 2 380 KZT."),
        qx("What is Ayat's planned labour value in Table 9?", "190 400 KZT: 80 h × 2 380", [
          ["180 880 KZT: 76 h × 2 380", "That is Aizat's value: 76 hours at 2 380 KZT.", "Это стоимость труда Aizat: 76 часов по 2 380 KZT."],
          ["183 200 KZT: 80 h × 2 290", "2 290 KZT is Akbota's rate; Ayat's rate is 2 380 KZT.", "2 290 KZT — ставка Akbota; у Ayat ставка 2 380 KZT."],
          ["200 000 KZT: 80 h × 2 500", "The rate is 400 000 / 168 ≈ 2 380 KZT, not 2 500 KZT.", "Ставка — 400 000 / 168 ≈ 2 380 KZT, а не 2 500 KZT."],
        ], "Ayat: 80 planned hours × 2 380 KZT = 190 400 KZT, the same as Yernar.", "Ayat: 80 плановых часов × 2 380 KZT = 190 400 KZT — столько же, сколько у Yernar."),
        qx("What is the total market value of the team's 300 planned hours?", "708 240 KZT", [
          ["714 000 KZT", "714 000 = 300 × 2 380 puts everyone at one rate; Akbota's rate is 2 290 KZT.", "714 000 = 300 × 2 380 — все по одной ставке; а у Akbota ставка 2 290 KZT."],
          ["765 344 KZT", "765 344 KZT also includes the cash budget: it is the total economic cost.", "765 344 KZT включает ещё и денежный бюджет — это полная экономическая стоимость."],
          ["687 000 KZT", "687 000 = 300 × 2 290 uses Akbota's rate for everyone; three members are at 2 380 KZT.", "687 000 = 300 × 2 290 — у всех ставка Akbota; а у троих ставка 2 380 KZT."],
        ], "190 400 + 190 400 + 180 880 + 146 560 = 708 240 KZT for 300 hours (Table 9).", "190 400 + 190 400 + 180 880 + 146 560 = 708 240 KZT за 300 часов (Table 9)."),
        qx("Which sum gives the total economic cost of 765 344 KZT?", "Cash budget 57 104 + labour value 708 240", [
          ["Purchases 51 913 + labour value 708 240", "That gives 760 153 KZT; the 5 191 KZT reserve is also part of the cash budget.", "Так выходит 760 153 KZT; резерв 5 191 KZT тоже входит в денежный бюджет."],
          ["Cash budget 57 104 + 10% overhead on labour", "There is no overhead in the plan: the rates are direct labour only.", "Накладных расходов в плане нет: ставки — только прямой труд."],
          ["Labour value 708 240 + employer contributions", "Employer contributions are explicitly not included in the salaries.", "Взносы работодателя прямо исключены из зарплат."],
        ], "Table 7: cash budget 57 104 KZT (purchases + reserve) + labour 708 240 KZT = 765 344 KZT.", "Table 7: денежный бюджет 57 104 KZT (закупки + резерв) + труд 708 240 KZT = 765 344 KZT."),
        qx("What do the monthly salaries in Table 9 explicitly NOT include?", "The employer's contributions", [
          ["Junior-level market medians", "They ARE junior-level market medians from salary surveys, so this is included.", "Это как раз и есть рыночные медианы для junior из обзоров зарплат — это входит."],
          ["Gross amounts before deductions", "They are gross monthly amounts, so this describes them rather than something left out.", "Это и есть суммы до вычетов (gross), то есть описание зарплат, а не то, что исключено."],
          ["Kazakhstan salary data for 2026", "The references are 2026 salary surveys for Kazakhstan, so this is included.", "Ориентиры — обзоры зарплат по Казахстану за 2026 год, так что это входит."],
        ], "Section 9: the salaries are gross monthly amounts for junior specialists and do not include employer contributions.", "Раздел 9: зарплаты — месячные суммы до вычетов для junior-специалистов, без взносов работодателя."),
        qx("Which market reference is used for Aizat's salary?", "QA engineer, Astana median (Taylor.kz)", [
          ["Junior developer, local companies (Techinterview.space)", "That reference is used for Ayat and Yernar, the developers.", "Этот ориентир взят для Ayat и Yernar — разработчиков."],
          ["Junior JavaScript developer median (Taylor.kz)", "That reference is Akbota's, the front-end developer.", "Это ориентир Akbota — фронтенд-разработчика."],
          ["Team lead median salary (Taylor.kz)", "No team-lead reference is used for anyone; Aizat is valued as a QA engineer.", "Ориентир «тимлид» не использован ни для кого; Aizat оценена как QA-инженер."],
        ], "Table 9: Aizat, QA engineer and technical writer — QA engineer, Astana (median), Taylor.kz, 400 000 KZT a month.", "Table 9: Aizat, QA-инженер и технический писатель — QA engineer, Астана (медиана), Taylor.kz, 400 000 KZT в месяц."),
        qx("Where do the planned hours 80, 80, 76 and 64 in Table 9 come from?", "The resource calendar, Table 17", [
          ["The time log in docs/HOURS.md", "The time log records actual hours since 5 October; Table 9 uses planned hours.", "Журнал времени фиксирует фактические часы с 5 октября; в Table 9 — плановые."],
          ["Commit counts in the GitHub repository", "Until 5 October all code came from one account, and commits do not show meetings.", "До 5 октября весь код шёл с одного аккаунта, а коммиты не показывают встречи."],
          ["An equal split of 300 hours by four", "An equal split would be 75 hours each; the plan gives 80, 80, 76 and 64.", "Поровну вышло бы по 75 часов; в плане — 80, 80, 76 и 64."],
        ], "Section 9: the hours are the planned hours from the resource calendar (Section 16, Table 17), 300 in total.", "Раздел 9: часы — плановые, из календаря ресурсов (раздел 16, Table 17), всего 300."),
        qx("Labour is unpaid. Why does the report still value it at market salaries?", "To plan and control effort, and show the company cost", [
          ["Because the members will be paid after 4 November", "Nobody pays these amounts; the members work as part of their course.", "Никто эти суммы не платит; участники работают в рамках курса."],
          ["Because labour is part of the 57 104 KZT cash budget", "The cash budget covers equipment and services only; labour is in-kind.", "Денежный бюджет — только оборудование и сервисы; труд — вклад в натуральной форме."],
          ["To set the size of each member's equal cash share", "Equal shares (about 14 276 KZT) come from the cash budget, not from labour value.", "Равные доли (около 14 276 KZT) считаются от денежного бюджета, а не от стоимости труда."],
        ], "Section 8 gives two reasons: the value is used to plan and control the team's effort, and it shows what the project would cost if a company did it.", "Раздел 8 называет две причины: стоимость нужна, чтобы планировать и контролировать усилия команды, и показывает, сколько стоил бы проект у компании."),
        tfx("The team members are paid their market salaries out of the cash budget.", false, "Nobody pays these amounts: the members are students, labour is an in-kind contribution, and the cash budget (57 104 KZT) covers only equipment and services.", "Никто эти суммы не платит: участники — студенты, труд — вклад в натуральной форме, а денежный бюджет (57 104 KZT) покрывает только оборудование и сервисы.", "Choosing True would put 708 240 KZT of salaries into a cash budget of only 57 104 KZT.", "Ответ True означал бы, что 708 240 KZT зарплат помещаются в денежный бюджет всего в 57 104 KZT."),
        qx("Kerzner describes ways to price labour. Which one matches how YeahTrack priced its hours?", "At the rate of each person who will do the work", [
          ["At the department average for everyone", "One average rate for all would ignore that Akbota's rate (2 290) differs from the others (2 380).", "Одна средняя ставка на всех не учла бы, что ставка Akbota (2 290) отличается от остальных (2 380)."],
          ["Priced at the average, but billed at actual salaries", "That mixed method is for staff not known in advance; our four people were known.", "Этот смешанный способ — для заранее неизвестных людей; наши четверо известны."],
          ["As a fixed percentage of the purchases", "Labour is priced from hours and rates, not as a share of the 51 913 KZT purchases.", "Труд оценён через часы и ставки, а не как доля от 51 913 KZT закупок."],
        ], "Kerzner: pricing at the actual salary of the people who will do the work is ideal when they are known — we priced each member's hours at that member's rate.", "Кернер: оценка по фактической зарплате исполнителей идеальна, если они известны, — мы оценили часы каждого участника по его ставке."),
        qx("In Lecture 3 terms, what is missing from our hourly rates compared with a company's price?", "An overhead rate for indirect costs", [
          ["Direct labour — the rates exclude salaries", "The rates are exactly direct labour: gross salaries divided by 168.", "Ставки — это и есть прямой труд: зарплата до вычетов, делённая на 168."],
          ["Materials — the webcams and the ring light", "Materials are not missing: they are priced separately in Table 8.", "Материалы не упущены: они оценены отдельно в Table 8."],
          ["Market data — the rates are guesses", "The rates come from 2026 salary surveys (Techinterview.space, Taylor.kz).", "Ставки взяты из обзоров зарплат за 2026 год (Techinterview.space, Taylor.kz)."],
        ], "A company adds overhead (rent, utilities, fringe benefits, administration) to direct labour; our rates are direct labour only, without employer contributions.", "Компания добавляет к прямому труду накладные расходы (аренда, коммунальные услуги, соцпакет, администрирование); наши ставки — только прямой труд, без взносов работодателя."),
        qx("The hours per WBS package were set by the owners before the work started. What kind of estimate is that?", "A planning-stage estimate, controlled by 10%", [
          ["A definitive estimate, ±5%, from price offers", "That describes the cash estimate; hours cannot be taken from price offers.", "Это описание денежной оценки; часы из предложений продавцов не возьмёшь."],
          ["A termination-stage re-estimate after a change", "Termination-stage estimates follow major scope changes; these hours were set at the start.", "Переоценка на завершающей стадии делается после крупных изменений; эти часы заданы в начале."],
          ["An actual cost taken from the time log", "The time log records actual hours after the work; the estimate came before it.", "Журнал времени фиксирует фактические часы после работы, а оценка была до неё."],
        ], "The effort estimate is a planning-stage estimate, less precise than the cash estimate, so actual hours are checked against it with the 10% threshold.", "Оценка трудозатрат — оценка стадии планирования, менее точная, чем денежная, поэтому фактические часы сверяют с ней по порогу 10%."),
        qx("Lecture 3 warns that labour hours are often overestimated by those who submit them. Who estimated YeahTrack's task durations?", "The people responsible for each task", [
          ["Ayat alone, as the team lead", "Ayat leads the team, but Section 11 says each task's responsible people estimated it.", "Ayat руководит командой, но по разделу 11 длительность оценивали ответственные за каждую задачу."],
          ["The instructor, as the sponsor", "The instructor is the sponsor and accepts the plan, but did not estimate the tasks.", "Преподаватель — спонсор и принимает план, но задачи не оценивал."],
          ["An outside expert hired for the estimate", "No outside expert was hired; the project has no paid staff at all.", "Никакого внешнего эксперта не нанимали; в проекте вообще нет оплачиваемых людей."],
        ], "Section 11: task durations were estimated by the people responsible for each task; gesture training got three weeks because the team had the least experience there.", "Раздел 11: длительность оценивали ответственные за каждую задачу; обучению жестам дали три недели, потому что там у команды было меньше всего опыта."),
        qx("Examiner: Why is your team lead valued at a junior developer salary? Best answer?", "We use junior medians for all; no lead premium", [
          ["Ayat is not really the lead; decisions are shared", "This denies the report: Ayat is the team lead with the final word on system design.", "Это отрицает отчёт: Ayat — тимлид, и последнее слово по архитектуре — за Ayat."],
          ["The lead premium is hidden in an overhead rate", "There is no overhead rate in the plan; the rates are direct labour only.", "Ставки накладных расходов в плане нет; ставки — только прямой труд."],
          ["Because Ayat is paid separately by the university", "Nobody is paid at all; this invents a fact that is not in the report.", "Никому ничего не платят; такой ответ выдумывает факт, которого нет в отчёте."],
        ], "All four are valued at junior market medians; Ayat shares the junior developer reference with Yernar, so the value is conservative, not inflated.", "Все четверо оценены по медианам для junior; у Ayat с Yernar общий ориентир — junior-разработчик, поэтому оценка скорее занижена, чем раздута."),
        qx("Examiner: A company would charge far more than 765 344 tenge. Best answer?", "True: our rates are direct labour, without overhead", [
          ["No: 765 344 is exactly what a company would charge", "This over-claims: without employer contributions and overhead it is not a full price.", "Это преувеличение: без взносов работодателя и накладных расходов это не полная цена."],
          ["That does not matter, since our labour is unpaid", "The report values labour exactly to show the commercial cost, so this contradicts the plan.", "Отчёт оценивает труд именно чтобы показать коммерческую стоимость, так что ответ противоречит плану."],
          ["The instructor set the rates, so ask the instructor", "The rates come from market salary surveys; blaming the instructor is not an answer.", "Ставки взяты из обзоров рыночных зарплат; перекладывать на преподавателя — не ответ."],
        ], "Agree honestly: the rates are gross junior salaries without employer contributions or overhead, which is enough to plan and control the team's own effort.", "Честно соглашаемся: ставки — зарплаты junior до вычетов, без взносов работодателя и накладных; для планирования и контроля своих усилий этого достаточно."),
      ],
    ),
  ],
};
