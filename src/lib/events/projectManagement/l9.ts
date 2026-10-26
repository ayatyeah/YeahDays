import { part, qx, tfx, type Lecture } from "../types";

/*
 * Лекция 9 Project Management (UPr 2301): «Value-Driven Delivery», 47 слайдов.
 * Источник — «PM TEST 8 WEEK EVENT/Lecture 9 Value-Driven Delivery.pdf»; слайды почти
 * дословно повторяют главу «Value-Driven Delivery» из Griffiths «PMI-ACP Exam Prep»
 * (2nd ed., RMC, 2018) — она же в списке литературы на последнем слайде.
 * Только картинками на слайдах (в извлечённом тексте их нет), перенесено в конспект:
 * «Incorporating changes into a relative priority list» (с. 18: список A–E, черта отсечения,
 * изменение Δ встаёт после B, E уходит под черту), «Task board» (с. 24: To Do / Doing /
 * зачёркнутое Done, исправленное на ACCEPTED), три доски «WIP Limits (Continued)» (с. 27:
 * задачи Amend order, Create order, Stock search… в колонках), «Sample cumulative flow
 * diagram» и «Little's Law and work in progress» (с. 28–29: Project XYZ — Feature Flow,
 * апрель–сентябрь, 400→500 функций, A = queue duration, B = queue length), «Gulf of
 * evaluation» (с. 39: четыре лодки), «Frequent verification and validation in XP» (с. 40:
 * петли обратной связи от секунд до месяцев).
 * Страницы 11, 21, 31, 41 пустые (только логотип): рисунка EVM, кривых Kano, таблицы
 * graduated fixed-price и схем TDD/ATDD на слайдах нет. Числа graduated fixed-price
 * ($110/$100/$90 в час) и веса формулы Wiegers взяты из учебника — помечены в конспекте.
 * Неточности слайдов, отмеченные строками «Exam trap»: слайд о пользе MVP озаглавлен
 * «Using EVM for Agile Projects: Pros and Cons»; MoSCoW «W = Would like to have, but not
 * this time» (обычно Won't have); шаг 5 теории ограничений «if the constraint has not moved»
 * (у Голдратта — после того как ограничение «сломано»); опечатки «Delivery Value Early»,
 * «keep they low».
 */

const p1 = part(
  "pm-l9-p1",
  { en: "Value: delivering it early and measuring it", ru: "Ценность: как поставлять её рано и как измерять" },
  {
    en: `## What is value-driven delivery?
Value-driven delivery is the idea that runs through the whole agile approach. The slide makes four points:
- It **drives all the activities and decisions on an agile project**.
- Organizations **undertake projects to generate business value** — more revenue, lower costs, new customers, compliance with a law, protection of an existing business.
- **Delivering value is a main theme and core component of agile methods** — Scrum, XP, Kanban and DSDM all organize work around it.
- When making project decisions, ask: **"Which choice would add the most value for the business or customer?"**
> Value-driven delivery in one line: every decision — what to build next, which meeting to keep, which document to write — is judged by the value it adds for the business or the customer.
**IT example.** A team building a food-delivery app must choose what goes into the next sprint: (a) an animated splash screen, (b) card payments, (c) an admin report the finance department asked for. The value question points to (b): without payments there is no revenue at all. The splash screen adds little value; the report may be needed, but it does not have to come first.
## Deliver value early ("Eat your dessert first!")
- Agile teams aim to **deliver the highest-value portions of the project as soon as possible**.
- This involves making decisions that **prioritize value-adding activities and risk-reducing efforts**.
- Early value delivery is important for two reasons:
| Reason on the slide | What it means in practice |
|---|---|
| **Longer project duration increases chances of failure, reduced benefits, erosion of opportunities, etc.** | The longer nothing is delivered, the more can go wrong: the market moves, a competitor launches first, the budget is cut, key people leave. |
| **Early delivery of value demonstrates the team's understanding of stakeholder needs and raises stakeholder confidence** | When the sponsor sees working, useful software after a few weeks, trust grows — and it becomes easier to get decisions, feedback and further funding. |
> Memory hook: "eat your dessert first" — serve the most valuable (tastiest) part of the project first, so that even if the meal is interrupted, the best part has already been enjoyed.
- **Example:** an online-banking team releases balance view and money transfers in month 2 and investment analytics later. If the project is stopped in month 6, customers already use the most valuable features.
> Exam trap: "dessert first" does **not** mean "the easiest tasks first" or "the fun tasks first". It means the **highest-value** parts first — and the slide pairs value with **risk-reducing efforts**, so risky work is pulled early too, not postponed. (The slide title has a typo, "Delivery Value Early" — it means "Deliver value early".)
## Minimize waste
- **Wasteful activities reduce value.** Every hour spent on something that does not help deliver value is an hour not spent on value.
- **Slide example:** while the project is being executed, an agile team can **reduce or postpone activities that are required by the organization but not focused on delivering value**.
- **IT example:** the PMO requires a 40-page monthly status report. The team agrees with the PMO to replace it with a one-page summary plus a link to the task board, and to postpone the full architecture document until the design has stabilized.
- The 7 wastes of lean from Lecture 6 are what "minimize waste" targets — partially done work, extra processes, extra features, task switching, motion, defects and so on.
> Note: the slide says "reduce or postpone", not "ignore". Organizational requirements (audit, security, legal) still exist; the team lowers their cost to value, it does not refuse them.
## Assessing value
- **Business value is usually assessed in financial terms** — money gained, money saved, money not lost.
- **To assess the value of a project, the organization looks at the financial ramifications of not doing the project.**
- **Example:** a bank must support a new national payment standard by 1 January. Not doing the project means fines and lost transactions worth, say, 3 million USD per year — that figure is part of the project's value, even though the project does not "earn" anything new.
- Value can also be non-financial (customer satisfaction, safety, reputation), but the slide says value is **usually** financial — that is why the next slide lists financial metrics.
## Financial assessment metrics
| Metric | Slide definition | How to use it |
|---|---|---|
| **Return on investment (ROI)** | Measures profitability of an investment by calculating the **ratio of benefits received to the money invested, expressed as a percentage** | higher is better |
| **Present value (PV)** | **The value of a future amount in today's terms** | compares money received at different times |
| **Net present value (NPV)** | **The present value of a revenue stream (income minus costs) over a series of time periods** | choose NPV > 0; the higher, the better |
| **Internal rate of return (IRR)** | **The discount rate at which the project inflows (revenues) and project outflows (costs) are equal** | higher is better |
= ROI = (benefits - investment) / investment x 100%
= PV = FV / (1 + r)^n
= NPV = sum of PV(income - costs) over all periods
- FV is the future amount, r is the interest (discount) rate per period, n is the number of periods.
- Money today is worth more than the same amount later: it could be invested, and there is inflation and risk. PV "translates" future money into today's money, so that options can be compared.
**Worked example 1 — ROI.** A company invests 200,000 USD in a self-service portal; over the evaluation period it brings 260,000 USD of benefits (saved call-centre costs).
= ROI = (260,000 - 200,000) / 200,000 x 100% = 30%
> Exam trap: the slide's words "ratio of benefits received to the money invested" read literally give 260,000 / 200,000 = 130%. ROI counts the net gain, so the answer is 30%; choose 130% only if a question explicitly asks for the plain ratio of benefits to investment.
= 260,000 / 200,000 x 100% = 130%  (plain ratio, not ROI)
**Worked example 2 — PV.** A client promises to pay 121,000 USD in 2 years; the discount rate is 10% per year.
= PV = 121,000 / (1 + 0.10)^2 = 121,000 / 1.21 = 100,000
**Worked example 3 — NPV and IRR.** A project costs 100,000 USD now and brings 60,000 USD of net income at the end of year 1 and of year 2; the discount rate is 10%.
= NPV = -100,000 + 60,000 / 1.10 + 60,000 / 1.21
= NPV = -100,000 + 54,545 + 49,587 = 4,132
- NPV is positive, so the project earns more than the 10% the money could earn elsewhere — it is worth doing.
- The IRR of this project is about 13%: at a 13% discount rate the discounted inflows exactly equal the 100,000 outflow (NPV = 0).
**Choosing between projects.**
| Project | NPV | IRR | Duration |
|---|---|---|---|
| A — mobile app | 150,000 | 12% | 5 years |
| B — CRM upgrade | 90,000 | 18% | 2 years |
- **By NPV:** choose **A**, the higher NPV. The number of years is already built into NPV; do not divide NPV by the years.
- **By IRR:** choose **B**, the higher IRR.
> Exam trap: for ROI, NPV and IRR the rule is the same — **the bigger, the better**. Do not "normalize" NPV by duration: time is already accounted for by discounting. And PV is one future amount brought to today, while NPV is a whole stream of income minus costs.
## Earned value management (EVM)
- **EVM assesses the overall health of a project in a single diagram that shows the status of the project schedule and total value delivered to date.**
- It **combines spending and schedule data to produce a set of metrics**, including: **planned value (PV), earned value (EV), schedule variance (SV), cost variance (CV), schedule performance index (SPI), cost performance index (CPI)**.
- The usual diagram (it is not on the slides) shows three cumulative curves over time: PV (the plan), EV (the work actually done, at its budgeted value) and AC (actual cost — needed for CV and CPI, although the slide's list does not name it).
- These are the same metrics as in Lecture 4, where Kerzner uses the older names:
| Lecture 9 (Griffiths, PMI) | Lecture 4 (Kerzner) | Question it answers |
|---|---|---|
| PV — planned value | BCWS — budgeted cost of work scheduled | How much work should be done by now? |
| EV — earned value | BCWP — budgeted cost of work performed | How much work is actually done (at budgeted cost)? |
| AC — actual cost | ACWP — actual cost of work performed | What did the done work actually cost? |
| SV = EV - PV | SV = BCWP - BCWS | ahead (+) or behind (-) schedule? |
| CV = EV - AC | CV = BCWP - ACWP | under (+) or over (-) budget? |
| SPI = EV / PV | SPI = BCWP / BCWS | schedule efficiency (above 1 is good) |
| CPI = EV / AC | CPI = BCWP / ACWP | cost efficiency (above 1 is good) |
= SV = EV - PV
= CV = EV - AC
= SPI = EV / PV
= CPI = EV / AC
**Agile example.** A release of 200 story points has a budget of 500,000 USD, so one point is "worth" 2,500 USD. After 4 sprints the plan was 80 points; the product owner has accepted 70 points; the team has spent 190,000 USD.
= PV = 80 x 2,500 = 200,000
= EV = 70 x 2,500 = 175,000
= SV = 175,000 - 200,000 = -25,000
= CV = 175,000 - 190,000 = -15,000
= SPI = 175,000 / 200,000 = 0.875
= CPI = 175,000 / 190,000 = 0.92
- **Status:** behind schedule (SPI < 1) and over budget (CPI < 1).
## Using EVM for agile projects: pros and cons
| Cons | Pros |
|---|---|
| **Quality of baseline is critical when using EVM** | **EVM metrics are leading indicators that try to predict completion dates and final costs** |
| **Basis for EVM erodes as initial agile plans evolve** | **Use of visual graphs allows for more intuitive understanding and collaboration** |
| **Doesn't indicate if the project is successfully delivering value** | — |
- **Baseline quality:** EVM compares actuals with a plan. On an agile project the early plan (release plan, story-point estimates) is deliberately rough, so the metrics are only as good as that rough baseline.
- **Eroding basis:** the backlog is reprioritized every iteration; features are added, removed and resized. PV calculated from the original plan stops describing what the team is really trying to do.
- **No measure of value:** "earned value" is the *budgeted cost* of completed work. A team can have CPI = 1.0 and SPI = 1.0 while building features nobody uses. EVM measures cost and schedule performance, not business value.
- **Leading indicators:** CPI and SPI let you forecast — for example EAC = BAC / CPI from Lecture 4 — instead of only reporting the past.
- **Visual graphs:** a chart of PV, EV and AC is easy for stakeholders to read and discuss together.
> Exam trap: the word "value" in "earned value" is misleading. The **third con** is exactly that EVM **doesn't indicate whether the project is delivering value**. An option saying "EVM shows that the product delivers business value" is wrong.
## Delivering an MVP as quickly as possible
The next slide (it repeats the title "Using EVM for Agile Projects: Pros and Cons") lists what **delivering a minimal viable product (MVP) as quickly as possible allows for**:
- **Early benefit opportunities**
- **Greater opportunity for incremental funding, which can reduce financial risk**
- **Reduced economic value at stake**
- **De-escalation of the impact of disputes on future work**
- **Use of agile contract models**
- **Incremental funding:** the sponsor funds the first release, sees results, and only then funds the next one — there is no need to commit the whole budget up front.
- **Less value at stake:** when only a small, already useful product is in play, a failure or cancellation loses less money.
- **De-escalated disputes:** when work is delivered in small pieces, a disagreement concerns one small piece, not the whole contract.
- **Agile contracts:** small, valuable deliveries make models such as fixed-price work packages or "money for nothing / change for free" possible (part 4).
> Exam trap: the slide title says "EVM", but the list is about the **benefits of an early MVP**. Remember all five items; typical distractors are "a fixed scope that cannot change" or "no need for customer involvement".
## Key performance indicators (KPIs)
| KPI | Slide definition |
|---|---|
| **Rate of progress** | How many features or user stories are getting **completed and accepted by the product owner** per week or month? |
| **Remaining work** | How much work is left in the backlog? |
| **Likely completion date** | **Divide the remaining work by the current rate of progress** |
| **Likely costs remaining** | **Multiply the salary burn rate for the team by the remaining weeks left** |
= Likely completion (weeks) = remaining work / rate of progress
= Likely costs remaining = burn rate per week x remaining weeks
**Worked example.** In the last 4 weeks the product owner accepted 100 story points. 300 points remain in the backlog. The team costs 15,000 USD per week in salaries.
= Rate of progress = 100 / 4 = 25 points per week
= Remaining weeks = 300 / 25 = 12 weeks
= Likely costs remaining = 15,000 x 12 = 180,000 USD
- If today is 1 March, the likely completion date is about 24 May (12 weeks later).
> Exam trap: rate of progress counts only work **completed and accepted by the product owner** — not stories "in progress" or "done but not accepted". And likely costs remaining multiply the burn rate by the **remaining weeks**, not by the remaining story points.
## Managing risk: risk as "anti-value"
- **Negative project risks (threats) can be seen as "anti-value".**
- **Anti-value:** factors that have the potential to **erode, remove, or reduce value if they occur**.
- **A risk event takes time and resources away from efforts that deliver value.**
- **Agile teams plan to implement risk avoidance and risk mitigation activities early.**
- **Example:** the riskiest part of a payment app is the integration with a bank's legacy API. The team runs a spike (a short technical experiment) in sprint 1 and builds the integration early. If it fails, the team learns it in week 2, not in month 8.
- In practice the team puts risk responses into the backlog next to features and prioritizes both by value — a "risk-adjusted backlog".
## Regulatory compliance
Two approaches for incorporating **regulatory compliance work** into agile projects:
| Approach | What the team does | Example |
|---|---|---|
| **1. Weave it in** | **Weave the work into regular development work as the team progresses** | every story of a health app includes the logging and consent checks required by the data-protection law |
| **2. Do it afterwards** | **Allow time after creating the product to undertake the regulatory work and produce the required evidence and documentation** | after the last sprint, a hardening period to prepare the audit file for the regulator |
## Exam focus
- The key question: "Which choice would add the most value for the business or customer?"
- Two reasons for early delivery: long duration → failure, reduced benefits, erosion of opportunities; early value → shows understanding of needs, raises stakeholder confidence.
- Value is assessed financially, by looking at the ramifications of **not** doing the project.
- ROI, PV, NPV, IRR — the definitions word for word; for ROI, NPV and IRR bigger is better; NPV already includes time.
- EVM metrics on the slide: PV, EV, SV, CV, SPI, CPI; PV / EV / AC = BCWS / BCWP / ACWP.
- EVM for agile: **3 cons** (baseline quality, basis erodes, no indication of value) and **2 pros** (leading indicators, visual graphs).
- Early MVP: **5 benefits** (early benefits, incremental funding, less value at stake, de-escalated disputes, agile contracts).
- KPIs: rate of progress, remaining work, likely completion date (remaining / rate), likely costs remaining (burn rate x remaining weeks).
- Anti-value = threats; avoidance and mitigation come early. Compliance: weave it in, or allow time after.
?? A sponsor says: "Our CPI is 1.05 and SPI is 1.10, so the product is clearly delivering value." What is wrong with this statement?
?= EVM measures cost and schedule performance against a baseline, not value. One of the slide's cons is that EVM doesn't indicate whether the project is successfully delivering value — the team may be efficiently building features nobody needs.
?? 360 story points remain; over the last 3 weeks the product owner accepted 90 points; the burn rate is 20,000 USD per week. What are the likely completion time and costs remaining?
?= Rate = 90 / 3 = 30 points per week; remaining weeks = 360 / 30 = 12; likely costs remaining = 20,000 x 12 = 240,000 USD.
?? Project A has NPV 80,000 over 8 years; project B has NPV 60,000 over 2 years. Which should be chosen by NPV?
?= Project A: the higher NPV wins. The duration is already included through discounting, so NPV is not divided by the number of years.`,
    ru: `## Что такое поставка ценности (value-driven delivery)?
Поставка ценности — идея, которая проходит через весь agile-подход. На слайде четыре тезиса:
- Она **определяет все действия и решения в agile-проекте (drives all the activities and decisions)**.
- Организации **берутся за проекты, чтобы создать ценность для бизнеса (business value)** — больше выручки, меньше затрат, новые клиенты, соответствие закону, защита уже существующего бизнеса.
- **Поставка ценности — главная тема и ключевой элемент agile-методов** — Scrum, XP, Kanban и DSDM строят работу вокруг неё.
- Принимая решения по проекту, спрашивайте: **«Which choice would add the most value for the business or customer?» — какой вариант даст больше всего ценности бизнесу или заказчику?**
> Поставка ценности одной строкой: каждое решение — что делать дальше, какую встречу оставить, какой документ писать — оценивается по ценности, которую оно даёт бизнесу или заказчику.
**Пример из IT.** Команда приложения доставки еды выбирает, что взять в следующий спринт: (a) анимированную заставку, (b) оплату картой, (c) отчёт для админки, который попросил финансовый отдел. Вопрос о ценности указывает на (b): без оплаты выручки нет вообще. Заставка почти не добавляет ценности; отчёт, может, и нужен, но не в первую очередь.
## Поставлять ценность рано («Eat your dessert first!» — «Сначала десерт!»)
- Agile-команды стремятся **поставить самые ценные части проекта (highest-value portions) как можно раньше**.
- Для этого принимают решения, которые **ставят в приоритет действия, добавляющие ценность, и усилия по снижению риска (value-adding activities and risk-reducing efforts)**.
- Ранняя поставка ценности важна по двум причинам:
| Причина на слайде | Что это значит на практике |
|---|---|
| **Чем дольше проект, тем выше шанс провала, меньше выгоды, тем больше упущенных возможностей и т. д. (failure, reduced benefits, erosion of opportunities)** | Чем дольше ничего не поставлено, тем больше может пойти не так: рынок сдвигается, конкурент выходит первым, бюджет режут, ключевые люди уходят. |
| **Ранняя поставка ценности показывает, что команда понимает нужды стейкхолдеров, и повышает их доверие (raises stakeholder confidence)** | Когда спонсор через несколько недель видит работающий полезный продукт, доверие растёт — легче получать решения, обратную связь и дальнейшее финансирование. |
> Запоминалка: «сначала десерт» — подайте самую ценную (вкусную) часть проекта первой, тогда даже если обед прервут, лучшее уже съедено.
- **Пример:** команда онлайн-банка выпускает просмотр баланса и переводы на втором месяце, а аналитику инвестиций — позже. Если проект остановят на шестом месяце, клиенты уже пользуются самыми ценными функциями.
> Ловушка экзамена: «сначала десерт» **не** значит «сначала самые лёгкие задачи» или «сначала интересные». Это значит — сначала **самые ценные** части, и слайд ставит рядом с ценностью **снижение риска**: рискованную работу тоже тянут вперёд, а не откладывают. (В заголовке слайда опечатка «Delivery Value Early» — имеется в виду «Deliver value early».)
## Минимизировать потери (minimize waste)
- **Расточительные действия уменьшают ценность (wasteful activities reduce value).** Каждый час на то, что не помогает поставлять ценность, — час, отнятый у ценности.
- **Пример со слайда:** пока проект выполняется, agile-команда может **сократить или отложить действия, которые требует организация, но которые не направлены на поставку ценности (reduce or postpone)**.
- **Пример из IT:** PMO требует ежемесячный отчёт о статусе на 40 страниц. Команда договаривается с PMO заменить его одностраничной сводкой со ссылкой на доску задач, а полный архитектурный документ отложить, пока дизайн не устоится.
- «Минимизировать потери» — это борьба с 7 потерями бережливого производства (7 wastes of lean) из лекции 6: частично сделанная работа, лишние процессы, лишние функции, переключение между задачами, перемещения, дефекты и т. д.
> Заметьте: слайд говорит «сократить или отложить», а не «игнорировать». Требования организации (аудит, безопасность, юристы) никуда не деваются; команда уменьшает их цену для ценности, но не отказывается от них.
## Оценка ценности (assessing value)
- **Ценность для бизнеса обычно оценивают в финансовых показателях (in financial terms)** — заработанные, сэкономленные, не потерянные деньги.
- **Чтобы оценить ценность проекта, организация смотрит на финансовые последствия того, что проект НЕ будет сделан (financial ramifications of not doing the project).**
- **Пример:** банк обязан поддержать новый национальный платёжный стандарт к 1 января. Не сделать проект — значит получить штрафы и потерять транзакции, скажем, на 3 млн USD в год; эта сумма — часть ценности проекта, хотя ничего «нового» он не зарабатывает.
- Ценность бывает и нефинансовой (удовлетворённость клиентов, безопасность, репутация), но слайд говорит, что **обычно** её оценивают в деньгах, — поэтому следующий слайд перечисляет финансовые метрики.
## Финансовые метрики оценки (financial assessment metrics)
| Метрика | Определение со слайда | Как применять |
|---|---|---|
| **Рентабельность инвестиций (return on investment, ROI)** | Измеряет доходность вложения как **отношение полученных выгод к вложенным деньгам, в процентах (ratio of benefits received to the money invested, expressed as a percentage)** | чем больше, тем лучше |
| **Приведённая стоимость (present value, PV)** | **Стоимость будущей суммы в сегодняшних деньгах (the value of a future amount in today's terms)** | сравнивает деньги, полученные в разное время |
| **Чистая приведённая стоимость (net present value, NPV)** | **Приведённая стоимость потока доходов (доходы минус затраты) за ряд периодов (the present value of a revenue stream over a series of time periods)** | брать NPV > 0; чем больше, тем лучше |
| **Внутренняя норма доходности (internal rate of return, IRR)** | **Ставка дисконтирования, при которой притоки проекта (выручка) и оттоки (затраты) равны (the discount rate at which inflows and outflows are equal)** | чем больше, тем лучше |
= ROI = (benefits - investment) / investment x 100%
= PV = FV / (1 + r)^n
= NPV = sum of PV(income - costs) over all periods
- FV — будущая сумма, r — процентная ставка (ставка дисконтирования) за период, n — число периодов.
- Деньги сегодня дороже той же суммы потом: их можно вложить, а ещё есть инфляция и риск. PV «переводит» будущие деньги в сегодняшние, чтобы варианты можно было сравнить.
**Пример 1 — ROI.** Компания вкладывает 200 000 USD в портал самообслуживания; за период оценки он приносит 260 000 USD выгоды (сэкономленные расходы колл-центра).
= ROI = (260,000 - 200,000) / 200,000 x 100% = 30%
> Ловушка экзамена: слова слайда «ratio of benefits received to the money invested», если понять их буквально, дают 260 000 / 200 000 = 130%. ROI считает чистую выгоду, поэтому ответ — 30%; 130% выбирай, только если вопрос прямо спрашивает простое отношение выгод к вложениям.
= 260,000 / 200,000 x 100% = 130%  (plain ratio, not ROI)
**Пример 2 — PV.** Клиент обещает заплатить 121 000 USD через 2 года; ставка дисконтирования — 10% в год.
= PV = 121,000 / (1 + 0.10)^2 = 121,000 / 1.21 = 100,000
**Пример 3 — NPV и IRR.** Проект стоит 100 000 USD сейчас и приносит 60 000 USD чистого дохода в конце первого и второго года; ставка — 10%.
= NPV = -100,000 + 60,000 / 1.10 + 60,000 / 1.21
= NPV = -100,000 + 54,545 + 49,587 = 4,132
- NPV положительна: проект зарабатывает больше тех 10%, которые деньги принесли бы в другом месте, — его стоит делать.
- IRR этого проекта — около 13%: при ставке 13% дисконтированные притоки ровно равны оттоку в 100 000 (NPV = 0).
**Выбор между проектами.**
| Проект | NPV | IRR | Срок |
|---|---|---|---|
| A — мобильное приложение | 150 000 | 12% | 5 лет |
| B — обновление CRM | 90 000 | 18% | 2 года |
- **По NPV:** выбираем **A** — у него NPV больше. Число лет уже учтено в NPV; делить NPV на годы не нужно.
- **По IRR:** выбираем **B** — у него IRR больше.
> Ловушка экзамена: для ROI, NPV и IRR правило одно — **чем больше, тем лучше**. Не «нормируйте» NPV на срок: время уже учтено дисконтированием. И PV — это одна будущая сумма, приведённая к сегодняшнему дню, а NPV — целый поток доходов минус затраты.
## Управление освоенным объёмом (earned value management, EVM)
- **EVM оценивает общее «здоровье» проекта на одной диаграмме, которая показывает состояние графика и всю ценность, поставленную на сегодня (status of the project schedule and total value delivered to date).**
- Он **объединяет данные о расходах и графике и даёт набор метрик**, в том числе: **плановый объём (planned value, PV), освоенный объём (earned value, EV), отклонение по срокам (schedule variance, SV), отклонение по стоимости (cost variance, CV), индекс выполнения сроков (schedule performance index, SPI), индекс выполнения стоимости (cost performance index, CPI)**.
- Обычная диаграмма (на слайдах её нет) показывает три накопительные кривые во времени: PV (план), EV (реально сделанная работа по её бюджетной стоимости) и AC (фактическая стоимость, actual cost, — она нужна для CV и CPI, хотя в списке слайда её нет).
- Это те же метрики, что в лекции 4, где Kerzner использует старые названия:
| Лекция 9 (Griffiths, PMI) | Лекция 4 (Kerzner) | На какой вопрос отвечает |
|---|---|---|
| PV — плановый объём | BCWS — бюджетная стоимость запланированной работы | Сколько работы должно быть сделано к этому моменту? |
| EV — освоенный объём | BCWP — бюджетная стоимость выполненной работы | Сколько работы реально сделано (по бюджетной стоимости)? |
| AC — фактическая стоимость | ACWP — фактическая стоимость выполненной работы | Сколько на самом деле стоила сделанная работа? |
| SV = EV - PV | SV = BCWP - BCWS | опережаем (+) или отстаём (-) от графика? |
| CV = EV - AC | CV = BCWP - ACWP | в рамках (+) или сверх (-) бюджета? |
| SPI = EV / PV | SPI = BCWP / BCWS | эффективность по срокам (больше 1 — хорошо) |
| CPI = EV / AC | CPI = BCWP / ACWP | эффективность по затратам (больше 1 — хорошо) |
= SV = EV - PV
= CV = EV - AC
= SPI = EV / PV
= CPI = EV / AC
**Agile-пример.** У релиза на 200 стори-поинтов бюджет 500 000 USD, то есть один поинт «стоит» 2 500 USD. После 4 спринтов по плану должно было быть 80 поинтов; владелец продукта принял 70; команда потратила 190 000 USD.
= PV = 80 x 2,500 = 200,000
= EV = 70 x 2,500 = 175,000
= SV = 175,000 - 200,000 = -25,000
= CV = 175,000 - 190,000 = -15,000
= SPI = 175,000 / 200,000 = 0.875
= CPI = 175,000 / 190,000 = 0.92
- **Статус:** отстаём от графика (SPI < 1) и выходим за бюджет (CPI < 1).
## EVM в agile-проектах: плюсы и минусы (pros and cons)
| Минусы (cons) | Плюсы (pros) |
|---|---|
| **Качество базового плана (baseline) критически важно для EVM** | **Метрики EVM — опережающие индикаторы (leading indicators), которые пытаются предсказать сроки завершения и итоговые затраты** |
| **Основа EVM размывается по мере того, как меняются исходные agile-планы (basis for EVM erodes)** | **Наглядные графики (visual graphs) дают более интуитивное понимание и помогают совместной работе** |
| **EVM не показывает, успешно ли проект поставляет ценность (doesn't indicate if the project is successfully delivering value)** | — |
- **Качество базового плана:** EVM сравнивает факт с планом. В agile-проекте ранний план (план релиза, оценки в поинтах) намеренно грубый, и метрики не точнее этого грубого плана.
- **Размывание основы:** бэклог переприоритизируют каждую итерацию; функции добавляют, убирают, переоценивают. PV, посчитанный по исходному плану, перестаёт описывать то, что команда на самом деле делает.
- **Нет меры ценности:** «освоенный объём» — это *бюджетная стоимость* сделанной работы. Команда может иметь CPI = 1,0 и SPI = 1,0 и при этом делать функции, которыми никто не пользуется. EVM измеряет исполнение по затратам и срокам, а не ценность для бизнеса.
- **Опережающие индикаторы:** CPI и SPI позволяют прогнозировать — например, EAC = BAC / CPI из лекции 4, — а не только отчитываться о прошлом.
- **Наглядные графики:** диаграмму PV, EV и AC стейкхолдерам легко читать и обсуждать вместе.
> Ловушка экзамена: слово «value» в «earned value» сбивает с толку. **Третий минус** как раз в том, что EVM **не показывает, поставляет ли проект ценность**. Вариант «EVM показывает, что продукт приносит ценность бизнесу» — неверный.
## Поставить MVP как можно быстрее
Следующий слайд (он повторяет заголовок «Using EVM for Agile Projects: Pros and Cons») перечисляет, что даёт **поставка минимально жизнеспособного продукта (minimal viable product, MVP) как можно быстрее**:
- **Ранние возможности получить выгоду (early benefit opportunities)**
- **Больше возможностей для поэтапного финансирования (incremental funding), что может снизить финансовый риск**
- **Меньше экономической ценности под угрозой (reduced economic value at stake)**
- **Снижение влияния споров на будущую работу (de-escalation of the impact of disputes)**
- **Возможность использовать agile-модели контрактов (agile contract models)**
- **Поэтапное финансирование:** спонсор оплачивает первый релиз, видит результат и только потом финансирует следующий — не нужно обязываться на весь бюджет сразу.
- **Меньше под угрозой:** когда на кону только небольшой, уже полезный продукт, провал или отмена стоят меньше денег.
- **Споры не разрастаются:** когда работу поставляют маленькими частями, разногласие касается одной небольшой части, а не всего контракта.
- **Agile-контракты:** маленькие ценные поставки делают возможными модели вроде fixed-price work packages или «money for nothing / change for free» (часть 4).
> Ловушка экзамена: в заголовке слайда написано «EVM», но список — о **пользе раннего MVP**. Помните все пять пунктов; типичные отвлекающие варианты — «зафиксированный объём, который нельзя менять» или «участие заказчика больше не нужно».
## Ключевые показатели эффективности (key performance indicators, KPIs)
| KPI | Определение со слайда |
|---|---|
| **Темп прогресса (rate of progress)** | Сколько функций или пользовательских историй **завершено и принято владельцем продукта (completed and accepted by the product owner)** в неделю или в месяц? |
| **Оставшаяся работа (remaining work)** | Сколько работы осталось в бэклоге? |
| **Вероятная дата завершения (likely completion date)** | **Разделить оставшуюся работу на текущий темп прогресса** |
| **Вероятные оставшиеся затраты (likely costs remaining)** | **Умножить «скорость сжигания» зарплат команды (salary burn rate) на оставшиеся недели** |
= Likely completion (weeks) = remaining work / rate of progress
= Likely costs remaining = burn rate per week x remaining weeks
**Пример.** За последние 4 недели владелец продукта принял 100 стори-поинтов. В бэклоге осталось 300 поинтов. Зарплаты команды — 15 000 USD в неделю.
= Rate of progress = 100 / 4 = 25 points per week
= Remaining weeks = 300 / 25 = 12 weeks
= Likely costs remaining = 15,000 x 12 = 180,000 USD
- Если сегодня 1 марта, вероятная дата завершения — около 24 мая (через 12 недель).
> Ловушка экзамена: в темп прогресса идёт только работа, **завершённая и принятая владельцем продукта**, — не истории «в работе» и не «готовые, но не принятые». А оставшиеся затраты — это burn rate, умноженный на **оставшиеся недели**, а не на оставшиеся поинты.
## Управление риском: риск как «антиценность» (anti-value)
- **Негативные риски проекта (угрозы, threats) можно рассматривать как «антиценность» (anti-value).**
- **Антиценность:** факторы, которые **могут разрушить, убрать или уменьшить ценность, если произойдут (erode, remove, or reduce value)**.
- **Рисковое событие отнимает время и ресурсы у работы, которая поставляет ценность.**
- **Agile-команды планируют действия по избеганию и снижению риска (risk avoidance and risk mitigation) на ранних этапах.**
- **Пример:** самое рискованное в платёжном приложении — интеграция со старым API банка. Команда делает спайк (spike — короткий технический эксперимент) в первом спринте и строит интеграцию рано. Если не выйдет, команда узнает об этом на второй неделе, а не на восьмом месяце.
- На практике ответы на риски кладут в бэклог рядом с функциями и приоритизируют всё вместе по ценности — «бэклог с учётом риска» (risk-adjusted backlog).
## Соответствие регуляторным требованиям (regulatory compliance)
Два подхода, как включить **работу по регуляторным требованиям** в agile-проект:
| Подход | Что делает команда | Пример |
|---|---|---|
| **1. Вплести в работу (weave it in)** | **Вплетать эту работу в обычную разработку по ходу продвижения команды** | каждая история медицинского приложения включает журналирование и проверки согласия, которых требует закон о персональных данных |
| **2. Сделать после (do it afterwards)** | **Оставить время после создания продукта, чтобы выполнить регуляторную работу и подготовить требуемые доказательства и документацию (evidence and documentation)** | после последнего спринта — период «доводки», чтобы собрать пакет документов для регулятора |
## Что спросят на экзамене
- Ключевой вопрос: «Which choice would add the most value for the business or customer?»
- Две причины ранней поставки: долгий срок → провал, меньше выгоды, упущенные возможности; ранняя ценность → показывает понимание нужд, повышает доверие стейкхолдеров.
- Ценность оценивают в деньгах, глядя на последствия того, что проект **не** будет сделан.
- ROI, PV, NPV, IRR — определения дословно; для ROI, NPV и IRR чем больше, тем лучше; NPV уже учитывает время.
- Метрики EVM на слайде: PV, EV, SV, CV, SPI, CPI; PV / EV / AC = BCWS / BCWP / ACWP.
- EVM в agile: **3 минуса** (качество baseline, основа размывается, не показывает ценность) и **2 плюса** (опережающие индикаторы, наглядные графики).
- Ранний MVP: **5 выгод** (ранняя выгода, поэтапное финансирование, меньше ценности под угрозой, споры не разрастаются, agile-контракты).
- KPI: темп прогресса, оставшаяся работа, вероятная дата завершения (остаток / темп), вероятные оставшиеся затраты (burn rate x оставшиеся недели).
- Антиценность = угрозы; избегание и снижение — рано. Регуляторные требования: вплести в работу или оставить время после.
?? Спонсор говорит: «У нас CPI 1,05 и SPI 1,10 — значит, продукт явно приносит ценность». Что не так?
?= EVM измеряет исполнение по затратам и срокам относительно базового плана, а не ценность. Один из минусов на слайде: EVM не показывает, успешно ли проект поставляет ценность, — команда может эффективно делать функции, которые никому не нужны.
?? Осталось 360 стори-поинтов; за последние 3 недели владелец продукта принял 90; burn rate — 20 000 USD в неделю. Каковы вероятный срок завершения и оставшиеся затраты?
?= Темп = 90 / 3 = 30 поинтов в неделю; осталось недель = 360 / 30 = 12; вероятные оставшиеся затраты = 20 000 x 12 = 240 000 USD.
?? У проекта A NPV 80 000 за 8 лет, у проекта B — 60 000 за 2 года. Какой выбрать по NPV?
?= Проект A: побеждает бо́льшая NPV. Срок уже учтён дисконтированием, поэтому NPV не делят на число лет.`,
  },
  [
    qx("When making project decisions, which question does value-driven delivery tell the team to ask?", "Which choice would add the most value for the business or customer?", [
      ["Which choice would keep the project closest to the baseline plan?", "Staying close to the plan is a plan-driven criterion; value-driven delivery judges every choice by the value it adds.", "Близость к плану — критерий плановых подходов; поставка ценности оценивает каждый выбор по ценности, которую он даёт."],
      ["Which choice would need the least effort from the development team?", "Effort matters for cost, but a low-effort option may add almost no value; the slide's question is about value.", "Трудозатраты важны для стоимости, но лёгкий вариант может почти не давать ценности; вопрос на слайде — о ценности."],
      ["Which choice would best match the requirements signed in the contract?", "Matching a signed specification is the traditional contract view; agile asks what adds the most value to the business or customer.", "Соответствие подписанной спецификации — традиционный контрактный взгляд; agile спрашивает, что даст больше ценности бизнесу или заказчику."],
    ], "Slide: when making project decisions, ask “Which choice would add the most value for the business or customer?” — value drives all activities and decisions on an agile project.", "Слайд: принимая решения, спрашивайте «Какой вариант даст больше всего ценности бизнесу или заказчику?» — ценность определяет все действия и решения agile-проекта."),
    qx("What does the slogan “Eat your dessert first!” mean in value-driven delivery?", "Deliver the highest-value portions of the project as soon as possible", [
      ["Start with the easiest tasks to build team morale before the hard ones", "Easy is not the same as valuable; “dessert” means the most valuable parts, which may be hard.", "Лёгкое — не то же, что ценное; «десерт» — самые ценные части, а они могут быть сложными."],
      ["Leave the risky technical work until all the valuable features are done", "The slide pairs value-adding activities with risk-reducing efforts: risk is reduced early, not postponed.", "Слайд ставит рядом действия, добавляющие ценность, и усилия по снижению риска: риск снижают рано, а не откладывают."],
      ["Reward stakeholders with a demo only after the full release is built", "The opposite: value — and its demonstration — comes early, not after the full release.", "Наоборот: ценность — и её показ — приходят рано, а не после полного релиза."],
    ], "Agile teams aim to deliver the highest-value portions of the project as soon as possible, prioritizing value-adding activities and risk-reducing efforts.", "Agile-команды стремятся поставить самые ценные части проекта как можно раньше, ставя в приоритет действия, добавляющие ценность, и снижение риска."),
    qx("According to the slide, why is early value delivery important?", "Longer duration raises the chance of failure and erodes opportunities", [
      ["Early delivery lets the team skip documentation and compliance work", "Nothing on the slide says that; compliance work is handled by weaving it in or allowing time after the product is built.", "Слайд такого не говорит; регуляторную работу либо вплетают в разработку, либо делают после создания продукта."],
      ["Early delivery fixes the scope so that later changes are not needed", "Agile welcomes change; early delivery produces feedback that often changes the scope.", "Agile приветствует изменения; ранняя поставка даёт обратную связь, которая часто меняет объём."],
      ["Early delivery reduces the need for stakeholder involvement in later sprints", "The slide's second reason is that early value raises stakeholder confidence — involvement continues.", "Вторая причина на слайде — ранняя ценность повышает доверие стейкхолдеров; их участие продолжается."],
    ], "Two reasons on the slide: a longer project duration increases chances of failure, reduced benefits and erosion of opportunities; early value shows the team understands stakeholder needs and raises their confidence.", "Две причины на слайде: чем дольше проект, тем выше шанс провала, меньше выгоды и больше упущенных возможностей; ранняя ценность показывает понимание нужд стейкхолдеров и повышает их доверие."),
    qx("Mid-project, the PMO asks an agile team to keep producing a weekly 30-page status report that nobody reads. What does the “minimize waste” slide suggest?", "Reduce or postpone the report, as it is required but adds no value", [
      ["Ignore the PMO, since agile teams do not follow organizational rules", "The slide says reduce or postpone, not ignore; organizational requirements still exist.", "Слайд говорит «сократить или отложить», а не «игнорировать»; требования организации остаются."],
      ["Write the full report first and start development work only afterwards", "Putting a non-value activity ahead of value delivery is exactly the waste the slide warns about.", "Ставить действие без ценности впереди поставки ценности — именно та потеря, о которой предупреждает слайд."],
      ["Ask the product owner to write the report instead of the team", "Moving the waste to another person does not remove it; the product owner's time is also value time.", "Переложить потерю на другого человека — не значит убрать её; время владельца продукта тоже работает на ценность."],
    ], "Slide example: while the project is being executed, an agile team can reduce or postpone activities that are required by the organization but not focused on delivering value.", "Пример со слайда: во время выполнения проекта agile-команда может сократить или отложить действия, которые требует организация, но которые не направлены на поставку ценности."),
    qx("How does an organization assess the value of a project, according to the slide?", "It looks at the financial ramifications of not doing the project", [
      ["It counts the number of features written in the requirements specification", "Feature count describes size, not value; many features can add little value.", "Число функций описывает размер, а не ценность; много функций может давать мало ценности."],
      ["It compares the team's velocity with the velocity of similar projects", "Velocity measures the delivery rate of a team, not the business value of a project.", "Velocity измеряет темп поставки команды, а не ценность проекта для бизнеса."],
      ["It rates the technical complexity of the planned architecture", "Complexity affects cost and risk; it says nothing about what the business gains.", "Сложность влияет на стоимость и риск, но ничего не говорит о выгоде бизнеса."],
    ], "Business value is usually assessed in financial terms; to assess a project's value, the organization looks at the financial ramifications of not doing it.", "Ценность для бизнеса обычно оценивают в деньгах; чтобы оценить ценность проекта, организация смотрит на финансовые последствия того, что его не сделают."),
    qx("Which metric is defined as “the ratio of benefits received to the money invested, expressed as a percentage”?", "Return on investment (ROI)", [
      ["Net present value (NPV)", "NPV is the present value of a revenue stream (income minus costs) over a series of periods — an amount of money, not a percentage ratio.", "NPV — приведённая стоимость потока доходов (доходы минус затраты) за ряд периодов: это сумма денег, а не процентное отношение."],
      ["Internal rate of return (IRR)", "IRR is the discount rate at which project inflows and outflows are equal.", "IRR — ставка дисконтирования, при которой притоки и оттоки проекта равны."],
      ["Cost performance index (CPI)", "CPI = EV / AC is an EVM efficiency ratio of earned value to actual cost, not benefits to investment.", "CPI = EV / AC — показатель эффективности EVM (освоенный объём к фактической стоимости), а не выгоды к вложениям."],
    ], "Slide: ROI measures profitability of an investment by calculating the ratio of benefits received to the money invested, expressed as a percentage.", "Слайд: ROI измеряет доходность вложения как отношение полученных выгод к вложенным деньгам, выраженное в процентах."),
    qx("A company invests $80,000 in a support chatbot and receives $100,000 in benefits. Using ROI = (benefits − investment) / investment × 100%, what is the ROI?", "25%", [
      ["125%", "That is benefits / investment without subtracting the investment: 100,000 / 80,000.", "Это выгоды / вложения без вычитания вложений: 100 000 / 80 000."],
      ["20%", "That divides the net gain by the benefits (20,000 / 100,000) instead of by the investment.", "Здесь чистую выгоду разделили на выгоды (20 000 / 100 000), а не на вложения."],
      ["80%", "That is investment / benefits (80,000 / 100,000) — not a return at all.", "Это вложения / выгоды (80 000 / 100 000) — вообще не доходность."],
    ], "ROI = (100,000 − 80,000) / 80,000 × 100% = 20,000 / 80,000 = 25%.", "ROI = (100 000 − 80 000) / 80 000 × 100% = 20 000 / 80 000 = 25%."),
    qx("What is the internal rate of return (IRR)?", "The discount rate at which project inflows and outflows are equal", [
      ["The value of a future amount of money expressed in today's terms", "That is the definition of present value (PV).", "Это определение приведённой стоимости (PV)."],
      ["The ratio of benefits to the money invested, shown as a percentage", "That is return on investment (ROI).", "Это рентабельность инвестиций (ROI)."],
      ["The present value of income minus costs over several periods", "That is net present value (NPV).", "Это чистая приведённая стоимость (NPV)."],
    ], "Slide: IRR is the discount rate at which the project inflows (revenues) and project outflows (costs) are equal; when comparing projects, the higher IRR is better.", "Слайд: IRR — ставка дисконтирования, при которой притоки (выручка) и оттоки (затраты) проекта равны; при сравнении проектов чем выше IRR, тем лучше."),
    qx("Project A has an NPV of $150,000 over 5 years; Project B has an NPV of $90,000 over 2 years. Using NPV as the selection criterion, which project should be chosen?", "Project A, because its NPV is the higher one", [
      ["Project B, because its NPV per year is higher", "Dividing NPV by the years is a classic mistake: time is already built into NPV through discounting.", "Делить NPV на годы — классическая ошибка: время уже учтено в NPV через дисконтирование."],
      ["Project B, because it is the shorter project", "Duration is not the NPV criterion; NPV already accounts for when the money arrives.", "Срок — не критерий NPV; NPV уже учитывает, когда приходят деньги."],
      ["Neither, because NPV cannot compare projects", "Comparing options is exactly what NPV is used for: the higher (and positive) NPV wins.", "Сравнивать варианты — как раз то, для чего нужна NPV: побеждает бо́льшая (и положительная) NPV."],
    ], "By NPV, the bigger the better; the number of years is already factored in, so A ($150,000) beats B ($90,000).", "По NPV — чем больше, тем лучше; число лет уже учтено, поэтому A (150 000) лучше B (90 000)."),
    qx("A client will pay $121,000 two years from now. With a discount rate of 10% per year, what is the present value of that payment?", "$100,000", [
      ["$110,000", "That discounts only one year: 121,000 / 1.10.", "Здесь продисконтирован только один год: 121 000 / 1,10."],
      ["$133,100", "That compounds forward (121,000 × 1.10) instead of discounting back to today.", "Здесь сумму наращивают вперёд (121 000 × 1,10), а не дисконтируют к сегодняшнему дню."],
      ["$96,800", "That simply subtracts 20% (121,000 × 0.8); discounting divides by (1 + r)^n.", "Здесь просто вычли 20% (121 000 × 0,8); дисконтирование — деление на (1 + r)^n."],
    ], "PV = FV / (1 + r)^n = 121,000 / 1.10² = 121,000 / 1.21 = $100,000.", "PV = FV / (1 + r)^n = 121 000 / 1,10² = 121 000 / 1,21 = 100 000 USD."),
    qx("Which of the following is NOT one of the metrics listed on the EVM slide?", "Net present value (NPV)", [
      ["Schedule performance index (SPI)", "SPI is on the EVM list (SPI = EV / PV).", "SPI есть в списке EVM (SPI = EV / PV)."],
      ["Cost variance (CV)", "CV is on the EVM list (CV = EV − AC).", "CV есть в списке EVM (CV = EV − AC)."],
      ["Planned value (PV)", "PV is the first metric on the EVM list.", "PV — первая метрика в списке EVM."],
    ], "The EVM slide lists PV, EV, SV, CV, SPI and CPI. NPV is a financial assessment metric for choosing projects, not an EVM metric.", "Слайд EVM перечисляет PV, EV, SV, CV, SPI и CPI. NPV — финансовая метрика для выбора проектов, а не метрика EVM."),
    qx("Which of these is listed on the slide as a con of using EVM on agile projects?", "It doesn't indicate if the project is successfully delivering value", [
      ["Its metrics are leading indicators that predict dates and final costs", "That is one of the two pros on the slide, not a con.", "Это один из двух плюсов на слайде, а не минус."],
      ["Its visual graphs make the status harder for stakeholders to discuss", "The opposite is a pro: visual graphs allow for more intuitive understanding and collaboration.", "Наоборот, это плюс: наглядные графики дают интуитивное понимание и помогают совместной работе."],
      ["It cannot be calculated when the work is estimated in story points", "EVM can be computed with story points (budget per point); this is not on the slide.", "EVM можно считать и в поинтах (бюджет на поинт); такого пункта на слайде нет."],
    ], "Cons: quality of baseline is critical; the basis for EVM erodes as initial agile plans evolve; it doesn't indicate if the project is successfully delivering value.", "Минусы: качество базового плана критично; основа EVM размывается по мере изменения agile-планов; EVM не показывает, успешно ли проект поставляет ценность."),
    qx("An agile release has PV = $200,000, EV = $160,000 and AC = $180,000. What are SPI and CPI?", "SPI = 0.80; CPI = 0.89", [
      ["SPI = 1.25; CPI = 1.13", "These invert the formulas (PV / EV and AC / EV).", "Здесь формулы перевёрнуты (PV / EV и AC / EV)."],
      ["SPI = 0.89; CPI = 0.80", "The two values are swapped: SPI uses PV, CPI uses AC.", "Значения перепутаны местами: SPI считают через PV, CPI — через AC."],
      ["SPI = 0.90; CPI = 0.89", "0.90 is AC / PV, which is not an EVM index.", "0,90 — это AC / PV, такого индекса в EVM нет."],
    ], "SPI = EV / PV = 160 / 200 = 0.80 (behind schedule); CPI = EV / AC = 160 / 180 = 0.89 (over budget).", "SPI = EV / PV = 160 / 200 = 0,80 (отставание); CPI = EV / AC = 160 / 180 = 0,89 (перерасход)."),
    qx("Lecture 4 (Kerzner) used BCWS, BCWP and ACWP. Which match with the Lecture 9 terms is correct?", "EV (earned value) = BCWP", [
      ["PV (planned value) = BCWP", "BCWP is earned value; planned value corresponds to BCWS.", "BCWP — это освоенный объём; плановому объёму соответствует BCWS."],
      ["AC (actual cost) = BCWS", "Actual cost corresponds to ACWP; BCWS is planned value.", "Фактической стоимости соответствует ACWP; BCWS — это плановый объём."],
      ["EV (earned value) = ACWP", "ACWP is the actual cost of work performed, i.e. AC.", "ACWP — фактическая стоимость выполненной работы, то есть AC."],
    ], "PV = BCWS (work scheduled), EV = BCWP (work performed at budgeted cost), AC = ACWP (actual cost of work performed).", "PV = BCWS (запланированная работа), EV = BCWP (выполненная работа по бюджетной стоимости), AC = ACWP (фактическая стоимость выполненной работы)."),
    qx("Which is NOT one of the benefits the slide lists for delivering an MVP as quickly as possible?", "A fixed scope that no longer needs customer feedback", [
      ["Greater opportunity for incremental funding", "On the list: incremental funding, which can reduce financial risk.", "Есть в списке: поэтапное финансирование, которое может снизить финансовый риск."],
      ["De-escalation of the impact of disputes on future work", "On the list word for word.", "Есть в списке дословно."],
      ["Reduced economic value at stake", "On the list word for word.", "Есть в списке дословно."],
    ], "Early MVP allows for: early benefit opportunities; incremental funding; reduced economic value at stake; de-escalation of disputes; use of agile contract models. A frozen scope without feedback contradicts agile.", "Ранний MVP даёт: раннюю выгоду; поэтапное финансирование; меньше ценности под угрозой; снижение влияния споров; agile-модели контрактов. Замороженный объём без обратной связи противоречит agile."),
    qx("Over the last 3 weeks the product owner accepted 90 story points. 270 points remain, and the team's salary burn rate is $12,000 per week. What are the likely completion time and likely costs remaining?", "9 weeks and $108,000", [
      ["3 weeks and $36,000", "This treats 90 points as the weekly rate; the rate is 90 / 3 = 30 points per week.", "Здесь 90 поинтов приняты за недельный темп; на самом деле темп 90 / 3 = 30 поинтов в неделю."],
      ["12 weeks and $144,000", "This adds the 3 weeks already worked; only the remaining weeks count.", "Здесь прибавлены 3 уже отработанные недели; считаются только оставшиеся."],
      ["6 weeks and $72,000", "This subtracts the accepted 90 points from the remaining 270, which are already what is left.", "Здесь из оставшихся 270 вычли принятые 90, хотя 270 — это уже остаток."],
    ], "Rate = 90 / 3 = 30 points per week; remaining weeks = 270 / 30 = 9; likely costs remaining = $12,000 × 9 = $108,000.", "Темп = 90 / 3 = 30 поинтов в неделю; осталось 270 / 30 = 9 недель; вероятные оставшиеся затраты = 12 000 × 9 = 108 000 USD."),
    qx("Which work counts toward the “rate of progress” KPI?", "Stories completed and accepted by the product owner", [
      ["Stories started by developers this week", "Started work is WIP, not progress; it has no value until accepted.", "Начатая работа — это незавершёнка (WIP), а не прогресс; ценности в ней нет, пока её не приняли."],
      ["Stories coded and waiting for the product owner's review", "Not yet accepted, so it does not count.", "Ещё не принято, поэтому не засчитывается."],
      ["Stories estimated in planning and added to the backlog", "That is remaining work, the second KPI, not progress.", "Это оставшаяся работа — второй KPI, а не прогресс."],
    ], "Slide: rate of progress — how many features or user stories are getting completed and accepted by the product owner per week or month.", "Слайд: темп прогресса — сколько функций или историй завершено и принято владельцем продукта в неделю или месяц."),
    qx("A team realizes that integrating with a bank's legacy API is the riskiest part of its payment app. What does value-driven delivery suggest?", "Plan risk avoidance or mitigation work for it early in the project", [
      ["Leave the integration for the last sprint, after the valuable features", "Postponing a threat keeps the anti-value hanging over the project; agile teams address risks early.", "Откладывая угрозу, команда оставляет «антиценность» висеть над проектом; agile-команды занимаются рисками рано."],
      ["Only record the risk in the register, since it adds no new features", "Recording is not responding; a risk event would take time and resources away from value.", "Записать — не значит ответить на риск; рисковое событие отнимет время и ресурсы у ценности."],
      ["Ask the sponsor to accept the risk and remove it from the backlog", "Risk responses belong in the backlog; dropping them leaves the threat unmanaged.", "Ответы на риски — часть бэклога; если их убрать, угроза останется без управления."],
    ], "Threats are anti-value: they can erode, remove or reduce value. Agile teams plan risk avoidance and risk mitigation activities early.", "Угрозы — антиценность: они могут разрушить, убрать или уменьшить ценность. Agile-команды планируют избегание и снижение рисков рано."),
    qx("Which pair describes the two approaches to regulatory compliance work given on the slide?", "Weave it into regular work, or allow time after building the product", [
      ["Outsource it to the regulator, or skip it until an audit is announced", "The regulator does not do the project's compliance work, and skipping it is not an approach on the slide.", "Регулятор не делает работу проекта за команду, а пропускать её — не подход со слайда."],
      ["Do it all before the first sprint, or let the PMO handle it in parallel", "Neither appears on the slide; the two approaches are weaving it in or doing it after the product is created.", "Ни того ни другого на слайде нет; два подхода — вплести в работу или сделать после создания продукта."],
      ["Assign it to the Scrum Master, or move it to a separate follow-up project", "The slide does not assign compliance to a role or a new project.", "Слайд не поручает эту работу какой-то роли или отдельному проекту."],
    ], "Slide: weave the work into regular development work as the team progresses, or allow time after creating the product to undertake the regulatory work and produce the required evidence and documentation.", "Слайд: вплетать работу в обычную разработку по ходу дела или оставить время после создания продукта на регуляторную работу и подготовку доказательств и документации."),
    tfx("Negative project risks (threats) can be seen as “anti-value”: factors that could erode, remove or reduce value if they occur.", true,
      "That is the slide's definition: threats are anti-value, and a risk event takes time and resources away from efforts that deliver value.",
      "Это определение со слайда: угрозы — антиценность, а рисковое событие отнимает время и ресурсы у работы, которая поставляет ценность.",
      "“False” would mean risks are neutral to value; the slide says they erode it, which is why avoidance and mitigation are planned early.",
      "«Неверно» означало бы, что риски не влияют на ценность; слайд говорит, что они её разрушают, — поэтому избегание и снижение рисков планируют рано."),
  ],
);

const p2 = part(
  "pm-l9-p2",
  { en: "Prioritizing value and delivering incrementally", ru: "Приоритизация ценности и поэтапная поставка" },
  {
    en: `## Prioritizing value
- **Prioritization helps ensure the team is progressing toward the desired target.** Without it a team can be busy all the time and still drift away from what the business needs.
- **Iteratively review the backlog with the customer and capture new priorities to be revisited in the next planning session.**
- Priorities are not set once: markets, users and the team's knowledge change, so the order of the backlog changes too.
> Prioritization in one line: at any moment the team should be working on the items that are most valuable *now* — and "now" is re-checked with the customer every iteration.
## Customer-valued prioritization
| Slide statement | What it means |
|---|---|
| **Work on the items that yield the highest value to the customer first** | the customer, not the team's technical preference, defines the order |
| **Uncover customers' top-priority features to reveal their motivations, risks, and acceptance criteria** | asking "why is this your top priority?" shows what success looks like and what could go wrong |
| **Conduct reprioritization sessions at the end of each iteration** | the backlog order is revisited every iteration, not once per project |
- **Example:** a hospital's patient app. The customer ranks "book an appointment" first. Asking why reveals the motivation (phone lines are overloaded), a risk (double bookings with the old scheduling system) and an acceptance criterion (a booking must be confirmed within 5 seconds).
## Prioritization schemes — overview
| Scheme | How it works (slide) | Typical output |
|---|---|---|
| **Simple schemes** | label items Priority 1, Priority 2, etc. | a priority number per item |
| **MoSCoW** | Must have, Should have, Could have, Would like to have, but not this time | four groups |
| **Monopoly money** | distribute Monopoly money **equal to the amount of the project budget** and distribute funds among system features | play-money totals per feature |
| **100-point method** | **each stakeholder is given 100 points** to vote for the most important requirements | point totals per requirement |
| **Dot voting** | each stakeholder distributes **a predetermined number of dots** among the options presented | dot counts per option |
| **Kano analysis** | classify customer preferences into **Delighters/Exciters, Satisfiers, Dissatisfiers, Indifferent** | four categories by effect on satisfaction |
| **Requirements prioritization model** | rate **benefit, penalty, cost, and risk** of every proposed feature on a relative scale of **1 (lowest) to 9 (highest)** and enter them into a **weighted formula** | a relative priority number for every feature |
| **Relative prioritization (ranking)** | one ordered list; adding a new change forces a lower-priority feature below the cutoff point | a single ranked list with a cutoff line |
## Simple schemes
- **Label items Priority 1, Priority 2, etc.** — the simplest possible scheme.
- **Weakness (Griffiths):** stakeholders tend to label almost everything "Priority 1", so the labels stop separating anything. A ranked list avoids this, because only one item can be first.
## MoSCoW
| Letter | Slide wording | Meaning | Food-delivery app example |
|---|---|---|---|
| **M** | **Must have** | without it the release is useless or illegal | place an order, pay by card |
| **S** | **Should have** | important, but the release still works without it | track the courier on a map |
| **C** | **Could have** | a nice extra if time allows | rate the courier |
| **W** | **Would like to have, but not this time** | agreed to be out of this release | voice ordering through a smart speaker |
- The lowercase "o"s are only there to make the word pronounceable.
- MoSCoW comes from DSDM, where the Must-haves form the minimum usable subset of the release.
> Exam trap: on the slide **W = "Would like to have, but not this time"**. Most other sources write **"Won't have (this time)"**. Both mean the item is deliberately left out of the current release, not rejected forever. Use the slide wording on the test.
## Monopoly money
- **Distribute Monopoly money equal to the amount of the project budget** and ask the stakeholders to **distribute the funds among system features**.
- **Example:** the budget is 300,000 USD, so the stakeholders get 300,000 in play money. They put 120,000 on online payment, 90,000 on order tracking, 60,000 on loyalty points and 30,000 on dark mode. The amounts show relative importance.
- Because the play money equals the real budget, stakeholders feel that money spent on one feature cannot be spent on another — the technique forces trade-offs.
- **Limitation (Griffiths):** it works best for business features; it is hard to "buy" infrastructure work such as a database migration, which the business does not see directly.
## 100-point method
- **Each stakeholder is given 100 points to vote for the most important requirements** — they can spread the points or put all of them on one item.
| Requirement | Sales | Support | Finance | Total |
|---|---|---|---|---|
| Online payment | 50 | 20 | 40 | **110** |
| Order history | 20 | 50 | 30 | **100** |
| Push notifications | 30 | 30 | 30 | **90** |
- Online payment ranks first with 110 points, even though Support put most of its points on order history.
## Dot voting
- **Each stakeholder distributes a predetermined number of dots among the options presented** — usually sticky dots or marker dots on a wall of cards.
- **Example:** 15 feature cards hang on the wall and every stakeholder gets 5 dots; the cards with the most dots move to the top of the backlog.
- A common rule of thumb (beyond the slides): give each person about one third as many dots as there are options.
> Exam trap — telling the voting schemes apart: **Monopoly money** = play money **equal to the project budget**; **100-point method** = **100 points per stakeholder**; **dot voting** = **a predetermined number of dots** per stakeholder. All three spread a limited resource; the resource is what distinguishes them.
## Kano analysis
**Kano analysis classifies customer preferences into four categories** according to how a feature affects customer satisfaction:
| Category | Effect on satisfaction | Ride-hailing app example |
|---|---|---|
| **Delighters / Exciters** | unexpected features; their presence greatly raises satisfaction, their absence is not noticed | the app shares your trip with family automatically and suggests a cheaper pickup point |
| **Satisfiers** | "the more, the better" — satisfaction grows in proportion to how well they are done | shorter waiting time, more accurate arrival estimates |
| **Dissatisfiers** | basic expectations; their absence causes strong dissatisfaction, their presence alone does not delight | secure payment, the app does not crash, the driver's name and car number are shown |
| **Indifferent** | customers do not care either way | the colour of the car icon on the map |
@diagram pm9-kano
- **How to use it for prioritization:** dissatisfiers (basics) must be in place first; satisfiers bring proportional value; a few delighters make the product stand out; indifferent items are candidates for removal.
- **Categories shift over time:** yesterday's delighter (live tracking of a courier) becomes today's basic expectation — a dissatisfier if it is missing.
> Exam trap: MoSCoW sorts features by **delivery commitment** in this release (must / should / could / not this time); Kano sorts them by **effect on customer satisfaction**. A Kano "dissatisfier" is not a feature to drop — it is a basic feature whose *absence* dissatisfies.
## Requirements prioritization model
- **Rate the benefit, penalty, cost, and risk of every proposed feature on a relative scale of 1 (lowest) to 9 (highest)** and **enter the numbers into a weighted formula** used to calculate the **relative priority of all the features**.
| Factor | Question | Usually rated by |
|---|---|---|
| **Benefit** | how much value if we **have** the feature? | customer / business |
| **Penalty** | how much harm if we **do not have** it? | customer / business |
| **Cost** | how expensive is it to build? | development team |
| **Risk** | how risky is it to build? | development team |
- High benefit and high penalty **raise** priority; high cost and high risk **lower** it. The weights (illustrative, from Wiegers' model — beyond the slides) are often benefit 2, penalty 1, cost 1, risk 0.5.
= Value = 2 x benefit + 1 x penalty
= Priority = value % / (1 x cost % + 0.5 x risk %)
**Worked example — three features of a food-delivery app:**
| Feature | Benefit | Penalty | Cost | Risk | Value | Priority |
|---|---|---|---|---|---|---|
| Card payment | 9 | 7 | 5 | 3 | 25 | **1.11** |
| Dark mode | 3 | 1 | 2 | 1 | 7 | **0.82** |
| Offline mode | 6 | 4 | 8 | 7 | 16 | **0.39** |
- Each "%" is the feature's share of the column total: value total 48, cost total 15, risk total 11.
= Card payment: 52.1 / (33.3 + 0.5 x 27.3) = 52.1 / 47.0 = 1.11
= Dark mode: 14.6 / (13.3 + 0.5 x 9.1) = 14.6 / 17.9 = 0.82
= Offline mode: 33.3 / (53.3 + 0.5 x 63.6) = 33.3 / 85.1 = 0.39
- The order is card payment → dark mode → offline mode. Offline mode has more value than dark mode, but it is so costly and risky that its relative priority is the lowest.
## Relative prioritization and the cutoff line
The third "Prioritization Schemes" slide shows a figure, **"Incorporating changes into a relative priority list"**:
| Step | Prioritized list (top → bottom) | What happens |
|---|---|---|
| Before | A, B, C, D, E — **cutoff to meet budget/time** under E | a new change Δ is **considered and prioritized**: the customer places it between B and C |
| After | A, B, Δ, C, D — cutoff — E | **change accepted, deferring "E"**: E falls below the cutoff line |
- **Simplifies the view of all remaining work** — one list, one order.
- **Adding a new change forces a lower-priority feature below the cutoff point** — with a fixed budget and time, something has to give.
- **Offers transparency and control over trade-offs** — the customer sees exactly what a change costs (here: E) and decides.
- **Example:** halfway through, a marketing manager asks for a referral program. The product owner shows the ranked list: if the referral program goes above "order history", then "push notifications" drops below the cutoff. The manager decides whether that trade-off is worth it.
## Delivering incrementally
- **The team regularly deploys working increments of the product over the course of the project.**
- **Delivering a "plain-vanilla" version of the product while working on the more complex elements allows the organization to realize the benefits early.**
- **Reduce the amount of rework by finding issues early** — real users find problems in a small increment before the same mistake is copied into many features.
- **Example:** an HR portal goes live first with a plain-vanilla leave-request form (no approval workflow, no calendar sync). Employees already save time, and their feedback shows that half of the requests are sick leave — which changes the design of the approval workflow built next.
## Minimal viable product (MVP)
> **MVP:** a package of functionality that is **complete enough to be useful to the users or market, but small enough that it doesn't represent the entire project**.
- **Allows for early return on investment** — the product starts earning or saving money before the full scope is built.
- **Provides opportunity to field-test functionality** — real users in real conditions show what works.
- Link with part 1: delivering the MVP as quickly as possible gives early benefits, incremental funding, less value at stake, de-escalated disputes and agile contract models.
| | MVP | Prototype | Full product |
|---|---|---|---|
| Useful to real users? | yes | usually not — it is for learning or a demo | yes |
| Size | small, not the entire project | as small as possible | the entire project |
| Purpose | early ROI, field testing | test an idea, a design or a technology | the complete scope |
- **Example:** a ride-hailing MVP in one city: order a car, see the driver, pay by card. No scheduled rides, no ride sharing, no corporate accounts — but it is already useful, already earning and already producing real feedback.
## Exam focus
- Customer-valued prioritization: highest customer value first; uncover top priorities → **motivations, risks, acceptance criteria**; **reprioritize at the end of each iteration**.
- Eight schemes and what tells them apart: Priority 1/2/3; MoSCoW; Monopoly money (= project budget); 100 points per stakeholder; a predetermined number of dots; Kano (4 categories); benefit-penalty-cost-risk on 1–9 with a weighted formula; a ranked list with a cutoff.
- MoSCoW **W** on the slide = "Would like to have, but not this time".
- Kano categories: **Delighters/Exciters, Satisfiers, Dissatisfiers, Indifferent**.
- Relative prioritization: a new change pushes a lower-priority feature **below the cutoff**; **transparency and control over trade-offs**.
- Incremental delivery: working increments, a **plain-vanilla** version → early benefits, less **rework**.
- MVP: complete enough to be **useful**, small enough not to be the **entire project**; **early ROI**, **field-test** functionality.
?? Stakeholders receive play money equal to the 500,000 USD project budget and spend it on features. Which scheme is this, and how is it different from the 100-point method?
?= Monopoly money. The amount equals the project budget, while in the 100-point method each stakeholder gets 100 points regardless of the budget.
?? A banking app always shows the correct account balance. Users never praise it, but they would leave at once if it were wrong. Which Kano category is it?
?= A dissatisfier (a basic expectation): its absence causes strong dissatisfaction, its presence does not delight.
?? The ranked list is A, B, C, D, E with the cutoff under E. A change Δ is accepted and ranked between A and B. What is above the cutoff now?
?= A, Δ, B, C, D. Feature E is deferred below the cutoff — and the trade-off is visible to the customer.`,
    ru: `## Приоритизация ценности (prioritizing value)
- **Приоритизация помогает убедиться, что команда движется к нужной цели (desired target).** Без неё команда может быть всё время занята и всё равно уходить в сторону от того, что нужно бизнесу.
- **Итеративно пересматривайте бэклог вместе с заказчиком и фиксируйте новые приоритеты, чтобы вернуться к ним на следующем планировании (next planning session).**
- Приоритеты не задаются раз и навсегда: рынок, пользователи и знания команды меняются — меняется и порядок бэклога.
> Приоритизация одной строкой: в любой момент команда должна работать над тем, что ценнее всего *сейчас*, а это «сейчас» сверяют с заказчиком каждую итерацию.
## Приоритизация по ценности для заказчика (customer-valued prioritization)
| Утверждение со слайда | Что оно значит |
|---|---|
| **Сначала работайте над элементами, которые дают заказчику наибольшую ценность** | порядок задаёт заказчик, а не технические предпочтения команды |
| **Выясняйте самые приоритетные для заказчика функции, чтобы раскрыть его мотивы, риски и критерии приёмки (motivations, risks, and acceptance criteria)** | вопрос «почему это для вас главное?» показывает, как выглядит успех и что может пойти не так |
| **Проводите сессии переприоритизации (reprioritization sessions) в конце каждой итерации** | порядок бэклога пересматривают каждую итерацию, а не раз за проект |
- **Пример:** приложение больницы для пациентов. Заказчик ставит на первое место «записаться на приём». Вопрос «почему» раскрывает мотив (телефонные линии перегружены), риск (двойные записи из-за старой системы расписания) и критерий приёмки (запись должна подтверждаться за 5 секунд).
## Схемы приоритизации (prioritization schemes) — обзор
| Схема | Как работает (слайд) | Что получается |
|---|---|---|
| **Простые схемы (simple schemes)** | помечать элементы Priority 1, Priority 2 и т. д. | номер приоритета у каждого элемента |
| **MoSCoW** | Must have, Should have, Could have, Would like to have, but not this time | четыре группы |
| **«Деньги Монополии» (Monopoly money)** | раздать игрушечные деньги **в сумме, равной бюджету проекта (equal to the amount of the project budget)**, и распределить их между функциями системы | сумма «денег» на каждой функции |
| **Метод 100 баллов (100-point method)** | **каждому стейкхолдеру дают 100 баллов**, чтобы проголосовать за самые важные требования | сумма баллов у каждого требования |
| **Голосование точками (dot voting)** | каждый стейкхолдер распределяет **заранее заданное число точек (a predetermined number of dots)** между предложенными вариантами | число точек у каждого варианта |
| **Анализ Кано (Kano analysis)** | разложить предпочтения заказчиков по категориям **Delighters/Exciters, Satisfiers, Dissatisfiers, Indifferent** | четыре категории по влиянию на удовлетворённость |
| **Модель приоритизации требований (requirements prioritization model)** | оценить **выгоду, штраф, стоимость и риск (benefit, penalty, cost, and risk)** каждой предложенной функции по относительной шкале **от 1 (низшая) до 9 (высшая)** и подставить в **взвешенную формулу (weighted formula)** | относительный приоритет каждой функции |
| **Относительная приоритизация, ранжирование (relative prioritization)** | один упорядоченный список; новое изменение выталкивает менее приоритетную функцию под черту отсечения | один ранжированный список с чертой отсечения |
## Простые схемы
- **Помечать элементы Priority 1, Priority 2 и т. д.** — самая простая схема.
- **Слабость (Griffiths):** стейкхолдеры склонны помечать почти всё как «Priority 1», и метки перестают что-либо различать. Ранжированный список этого избегает: первым может быть только один элемент.
## MoSCoW
| Буква | Формулировка слайда | Смысл | Пример: приложение доставки еды |
|---|---|---|---|
| **M** | **Must have — обязательно** | без этого релиз бесполезен или незаконен | оформить заказ, оплатить картой |
| **S** | **Should have — следует сделать** | важно, но релиз работает и без этого | следить за курьером на карте |
| **C** | **Could have — можно сделать** | приятное дополнение, если хватит времени | оценить курьера |
| **W** | **Would like to have, but not this time — хотелось бы, но не в этот раз** | договорились, что в этот релиз не входит | голосовой заказ через умную колонку |
- Строчные «o» стоят только для того, чтобы слово можно было произнести.
- MoSCoW пришла из DSDM, где пункты Must have образуют минимальный пригодный к использованию набор релиза.
> Ловушка экзамена: на слайде **W = «Would like to have, but not this time»**. В большинстве других источников пишут **«Won't have (this time)»**. Оба варианта значат, что элемент сознательно не входит в текущий релиз, но не отвергнут навсегда. На тесте используйте формулировку слайда.
## «Деньги Монополии» (Monopoly money)
- **Раздайте игрушечные деньги в сумме, равной бюджету проекта**, и попросите стейкхолдеров **распределить их между функциями системы**.
- **Пример:** бюджет 300 000 USD — стейкхолдеры получают 300 000 игрушечных денег. Они ставят 120 000 на онлайн-оплату, 90 000 на отслеживание заказа, 60 000 на бонусные баллы и 30 000 на тёмную тему. Суммы показывают относительную важность.
- Раз игрушечных денег ровно столько, сколько в реальном бюджете, стейкхолдеры чувствуют: потраченное на одну функцию не достанется другой — техника заставляет идти на компромиссы.
- **Ограничение (Griffiths):** лучше всего работает для бизнес-функций; инфраструктурную работу, например миграцию базы данных, которую бизнес напрямую не видит, «купить» трудно.
## Метод 100 баллов (100-point method)
- **Каждому стейкхолдеру дают 100 баллов, чтобы проголосовать за самые важные требования**, — их можно распределить или отдать все одному пункту.
| Требование | Продажи | Поддержка | Финансы | Итого |
|---|---|---|---|---|
| Онлайн-оплата | 50 | 20 | 40 | **110** |
| История заказов | 20 | 50 | 30 | **100** |
| Push-уведомления | 30 | 30 | 30 | **90** |
- Онлайн-оплата на первом месте со 110 баллами, хотя поддержка отдала большую часть баллов истории заказов.
## Голосование точками (dot voting)
- **Каждый стейкхолдер распределяет заранее заданное число точек между предложенными вариантами** — обычно наклейками-точками или маркером на стене с карточками.
- **Пример:** на стене 15 карточек функций, у каждого стейкхолдера 5 точек; карточки с наибольшим числом точек поднимаются наверх бэклога.
- Распространённое правило (за пределами слайдов): давать каждому примерно треть от числа вариантов.
> Ловушка экзамена — как различать схемы голосования: **Monopoly money** — игрушечные деньги **в сумме бюджета проекта**; **100-point method** — **100 баллов на стейкхолдера**; **dot voting** — **заранее заданное число точек** на стейкхолдера. Все три распределяют ограниченный ресурс; различаются они самим ресурсом.
## Анализ Кано (Kano analysis)
**Анализ Кано раскладывает предпочтения заказчиков по четырём категориям** в зависимости от того, как функция влияет на удовлетворённость:
| Категория | Влияние на удовлетворённость | Пример: приложение такси |
|---|---|---|
| **Delighters / Exciters — «восхищающие»** | неожиданные функции; их наличие сильно повышает удовлетворённость, а отсутствие не замечают | приложение само делится поездкой с семьёй и предлагает более дешёвую точку посадки |
| **Satisfiers — «удовлетворяющие»** | «чем больше, тем лучше» — удовлетворённость растёт пропорционально качеству исполнения | меньше время ожидания, точнее прогноз прибытия |
| **Dissatisfiers — «разочаровывающие» (базовые)** | базовые ожидания; их отсутствие вызывает сильное недовольство, а наличие само по себе не радует | безопасная оплата, приложение не падает, видны имя водителя и номер машины |
| **Indifferent — «безразличные»** | заказчикам всё равно, есть они или нет | цвет значка машины на карте |
@diagram pm9-kano
- **Как применять для приоритизации:** сначала обеспечить dissatisfiers (базу); satisfiers дают пропорциональную ценность; несколько delighters выделяют продукт; безразличные функции — кандидаты на удаление.
- **Категории со временем смещаются:** вчерашний delighter (отслеживание курьера в реальном времени) становится сегодняшним базовым ожиданием — dissatisfier, если его нет.
> Ловушка экзамена: MoSCoW сортирует функции по **обязательству поставки** в этом релизе (must / should / could / not this time), а Кано — по **влиянию на удовлетворённость заказчика**. «Dissatisfier» у Кано — не функция, которую надо выбросить, а базовая функция, *отсутствие* которой вызывает недовольство.
## Модель приоритизации требований (requirements prioritization model)
- **Оцените выгоду, штраф, стоимость и риск каждой предложенной функции по относительной шкале от 1 (низшая) до 9 (высшая)** и **подставьте числа во взвешенную формулу**, по которой считают **относительный приоритет всех функций**.
| Фактор | Вопрос | Обычно оценивает |
|---|---|---|
| **Выгода (benefit)** | сколько ценности, если функция **есть**? | заказчик / бизнес |
| **Штраф (penalty)** | сколько вреда, если функции **нет**? | заказчик / бизнес |
| **Стоимость (cost)** | насколько дорого её сделать? | команда разработки |
| **Риск (risk)** | насколько рискованно её делать? | команда разработки |
- Высокие выгода и штраф **повышают** приоритет; высокие стоимость и риск **понижают**. Веса (для иллюстрации, из модели Wiegers — за пределами слайдов) часто такие: выгода 2, штраф 1, стоимость 1, риск 0,5.
= Value = 2 x benefit + 1 x penalty
= Priority = value % / (1 x cost % + 0.5 x risk %)
**Пример — три функции приложения доставки еды:**
| Функция | Выгода | Штраф | Стоимость | Риск | Ценность | Приоритет |
|---|---|---|---|---|---|---|
| Оплата картой | 9 | 7 | 5 | 3 | 25 | **1,11** |
| Тёмная тема | 3 | 1 | 2 | 1 | 7 | **0,82** |
| Офлайн-режим | 6 | 4 | 8 | 7 | 16 | **0,39** |
- Каждый «%» — доля функции в сумме столбца: сумма ценности 48, стоимости 15, риска 11.
= Card payment: 52.1 / (33.3 + 0.5 x 27.3) = 52.1 / 47.0 = 1.11
= Dark mode: 14.6 / (13.3 + 0.5 x 9.1) = 14.6 / 17.9 = 0.82
= Offline mode: 33.3 / (53.3 + 0.5 x 63.6) = 33.3 / 85.1 = 0.39
- Порядок: оплата картой → тёмная тема → офлайн-режим. Ценности у офлайн-режима больше, чем у тёмной темы, но он настолько дорог и рискован, что его относительный приоритет самый низкий.
## Относительная приоритизация и черта отсечения (cutoff)
На третьем слайде «Prioritization Schemes» есть рисунок **«Incorporating changes into a relative priority list» — включение изменений в относительный список приоритетов**:
| Шаг | Список приоритетов (сверху вниз) | Что происходит |
|---|---|---|
| До | A, B, C, D, E — под E **черта отсечения по бюджету/сроку (cutoff to meet budget/time)** | новое изменение Δ **рассмотрено и приоритизировано**: заказчик ставит его между B и C |
| После | A, B, Δ, C, D — черта — E | **изменение принято, E отложено (deferring "E")**: E опускается под черту |
- **Упрощает обзор всей оставшейся работы (simplifies the view of all remaining work)** — один список, один порядок.
- **Добавление нового изменения выталкивает менее приоритетную функцию под черту отсечения** — при фиксированных бюджете и сроке чем-то приходится жертвовать.
- **Даёт прозрачность и контроль над компромиссами (transparency and control over trade-offs)** — заказчик точно видит, чего стоит изменение (здесь — E), и решает сам.
- **Пример:** на полпути маркетолог просит реферальную программу. Владелец продукта показывает ранжированный список: если программа встанет выше «истории заказов», то «push-уведомления» уйдут под черту. Маркетолог решает, стоит ли этот компромисс того.
## Поэтапная поставка (delivering incrementally)
- **Команда регулярно разворачивает работающие инкременты продукта на протяжении всего проекта.**
- **Поставка «базовой» версии продукта (plain-vanilla version), пока идёт работа над более сложными элементами, позволяет организации получить выгоду рано.**
- **Объём переделок (rework) уменьшается, потому что проблемы находят рано** — реальные пользователи замечают проблему в маленьком инкременте раньше, чем та же ошибка расползётся по многим функциям.
- **Пример:** HR-портал сначала запускают с «базовой» формой заявки на отпуск (без маршрута согласования, без синхронизации с календарём). Сотрудники уже экономят время, а их отзывы показывают, что половина заявок — больничные; это меняет дизайн маршрута согласования, который делают следующим.
## Минимально жизнеспособный продукт (minimal viable product, MVP)
> **MVP:** набор функциональности, **достаточно полный, чтобы быть полезным пользователям или рынку, но достаточно маленький, чтобы не представлять весь проект (complete enough to be useful … small enough that it doesn't represent the entire project)**.
- **Позволяет получить раннюю отдачу от инвестиций (early return on investment)** — продукт начинает зарабатывать или экономить деньги до того, как построен весь объём.
- **Даёт возможность проверить функциональность в реальных условиях (field-test functionality)** — настоящие пользователи в настоящих условиях показывают, что работает.
- Связь с частью 1: поставка MVP как можно быстрее даёт раннюю выгоду, поэтапное финансирование, меньше ценности под угрозой, снижение влияния споров и agile-модели контрактов.
| | MVP | Прототип | Полный продукт |
|---|---|---|---|
| Полезен реальным пользователям? | да | обычно нет — он для обучения или демонстрации | да |
| Размер | небольшой, не весь проект | как можно меньше | весь проект |
| Цель | ранняя отдача, проверка в реальных условиях | проверить идею, дизайн или технологию | весь объём |
- **Пример:** MVP такси в одном городе: заказать машину, увидеть водителя, оплатить картой. Без поездок по расписанию, без попутчиков, без корпоративных аккаунтов — но уже полезно, уже зарабатывает и уже даёт настоящую обратную связь.
## Что спросят на экзамене
- Приоритизация по ценности для заказчика: сначала наибольшая ценность для заказчика; выяснять главные приоритеты → **мотивы, риски, критерии приёмки**; **переприоритизация в конце каждой итерации**.
- Восемь схем и чем они отличаются: Priority 1/2/3; MoSCoW; Monopoly money (= бюджет проекта); 100 баллов на стейкхолдера; заранее заданное число точек; Кано (4 категории); выгода-штраф-стоимость-риск по шкале 1–9 со взвешенной формулой; ранжированный список с чертой отсечения.
- **W** в MoSCoW на слайде = «Would like to have, but not this time».
- Категории Кано: **Delighters/Exciters, Satisfiers, Dissatisfiers, Indifferent**.
- Относительная приоритизация: новое изменение выталкивает менее приоритетную функцию **под черту**; **прозрачность и контроль над компромиссами**.
- Поэтапная поставка: работающие инкременты, **plain-vanilla** версия → ранняя выгода, меньше **переделок**.
- MVP: достаточно полный, чтобы быть **полезным**, достаточно маленький, чтобы не быть **всем проектом**; **ранняя отдача**, **проверка в реальных условиях**.
?? Стейкхолдеры получают игрушечные деньги на сумму бюджета проекта (500 000 USD) и «тратят» их на функции. Что это за схема и чем она отличается от метода 100 баллов?
?= Monopoly money. Сумма равна бюджету проекта, а в методе 100 баллов каждый стейкхолдер получает 100 баллов независимо от бюджета.
?? Банковское приложение всегда показывает правильный баланс. Пользователи его никогда не хвалят, но сразу ушли бы, если бы баланс был неверным. Какая это категория Кано?
?= Dissatisfier (базовое ожидание): отсутствие вызывает сильное недовольство, а наличие не радует.
?? Ранжированный список — A, B, C, D, E, черта отсечения под E. Изменение Δ принято и поставлено между A и B. Что теперь выше черты?
?= A, Δ, B, C, D. Функция E отложена под черту — и компромисс виден заказчику.`,
  },
  [
    qx("In customer-valued prioritization, when should reprioritization sessions be held?", "At the end of each iteration", [
      ["Once, at the project kick-off", "Priorities change as the product and market evolve; a single session at kick-off is a plan-driven habit.", "Приоритеты меняются вместе с продуктом и рынком; одна сессия на старте — привычка плановых подходов."],
      ["Only when the sponsor asks", "The slide makes reprioritization a regular event, not an on-request one.", "Слайд делает переприоритизацию регулярной, а не «по запросу»."],
      ["After each release goes live", "A release can contain many iterations; the slide says at the end of each iteration.", "В релиз может входить много итераций; слайд говорит — в конце каждой итерации."],
    ], "Slide: conduct reprioritization sessions at the end of each iteration — and iteratively review the backlog with the customer before the next planning session.", "Слайд: проводите сессии переприоритизации в конце каждой итерации — и пересматривайте бэклог с заказчиком перед следующим планированием."),
    qx("Uncovering customers' top-priority features helps reveal what, according to the slide?", "Their motivations, risks, and acceptance criteria", [
      ["Their budget limits, deadlines, and contract terms", "These are contract matters; the slide speaks of motivations, risks and acceptance criteria.", "Это вопросы контракта; слайд говорит о мотивах, рисках и критериях приёмки."],
      ["Their team velocity, capacity, and sprint length", "These describe the delivery team, not the customer.", "Это характеристики команды поставки, а не заказчика."],
      ["Their preferred tools, vendors, and technologies", "Tool preferences are not what the slide says top priorities reveal.", "Предпочтения по инструментам — не то, что, по слайду, раскрывают главные приоритеты."],
    ], "Slide: uncover customers' top-priority features to reveal their motivations, risks, and acceptance criteria.", "Слайд: выясняйте самые приоритетные для заказчика функции, чтобы раскрыть его мотивы, риски и критерии приёмки."),
    qx("On the lecture slide, what does the “W” in MoSCoW stand for?", "Would like to have, but not this time", [
      ["Will have in the next sprint for sure", "W items are deliberately left out of this release; nothing promises the next sprint.", "Пункты W сознательно не входят в этот релиз; никто не обещает их в следующем спринте."],
      ["Worth having only if budget remains", "That is closer to “Could have”, which is done if time and money allow.", "Это ближе к «Could have» — делается, если хватит времени и денег."],
      ["Wanted by every stakeholder involved", "MoSCoW categories are about delivery commitment, not about how many people want an item.", "Категории MoSCoW — об обязательстве поставки, а не о том, сколько людей хотят пункт."],
    ], "The slide lists Must have, Should have, Could have, Would like to have, but not this time. Other sources say “Won't have (this time)” — same meaning.", "Слайд: Must have, Should have, Could have, Would like to have, but not this time. В других источниках — «Won't have (this time)», смысл тот же."),
    qx("In the Monopoly money technique, how much play money is handed out?", "An amount equal to the project budget", [
      ["100 points for each stakeholder", "That is the 100-point method.", "Это метод 100 баллов."],
      ["A predetermined number of dots per person", "That is dot voting.", "Это голосование точками."],
      ["The estimated cost of each single feature", "Handing out the cost of each feature would remove the trade-off the technique creates.", "Если выдать стоимость каждой функции, исчезнет компромисс, ради которого техника нужна."],
    ], "Slide: distribute Monopoly money equal to the amount of the project budget and distribute funds among system features.", "Слайд: раздайте игрушечные деньги в сумме, равной бюджету проекта, и распределите их между функциями системы."),
    qx("At a workshop, each of six stakeholders gets 5 sticky dots to place on the feature cards they consider most important. Which prioritization scheme is used?", "Dot voting", [
      ["100-point method", "In the 100-point method each stakeholder distributes 100 points, not a small fixed number of dots.", "В методе 100 баллов каждый распределяет 100 баллов, а не небольшое число точек."],
      ["Monopoly money", "Monopoly money uses play money equal to the project budget.", "В Monopoly money используют игрушечные деньги в сумме бюджета проекта."],
      ["Kano analysis", "Kano classifies features by effect on satisfaction; it is not a voting scheme.", "Кано раскладывает функции по влиянию на удовлетворённость; это не голосование."],
    ], "Dot voting: each stakeholder distributes a predetermined number of dots among the options presented.", "Голосование точками: каждый стейкхолдер распределяет заранее заданное число точек между предложенными вариантами."),
    qx("Three stakeholders each get 100 points. Feature X receives 40, 20 and 50 points; Feature Y receives 30, 50 and 20; Feature Z receives 30, 30 and 30. Which feature ranks first?", "Feature X, with 110 points", [
      ["Feature Y, with 100 points", "Y totals 30 + 50 + 20 = 100, which is second.", "У Y 30 + 50 + 20 = 100 — это второе место."],
      ["Feature Z, with 90 points", "Z has the most even support but the lowest total, 90.", "У Z самая ровная поддержка, но самая маленькая сумма — 90."],
      ["X and Y tie with 110 each", "Y has 100, not 110, so there is no tie.", "У Y 100, а не 110, ничьей нет."],
    ], "100-point method: add each requirement's points. X = 40 + 20 + 50 = 110, Y = 100, Z = 90, so X ranks first.", "Метод 100 баллов: складываем баллы каждого требования. X = 40 + 20 + 50 = 110, Y = 100, Z = 90 — первым идёт X."),
    qx("Users of a banking app never praise its secure login, but they would abandon the app at once if it were missing. In Kano analysis, secure login is a:", "Dissatisfier", [
      ["Delighter", "Delighters are unexpected features whose presence thrills users; nobody is thrilled by a login.", "Delighters — неожиданные функции, которые радуют; вход в систему никого не восхищает."],
      ["Satisfier", "Satisfiers follow “the more, the better”; login is simply expected, not appreciated more as it improves.", "Satisfiers работают по правилу «чем больше, тем лучше»; вход просто ожидается, его не ценят больше по мере улучшения."],
      ["Indifferent feature", "Users clearly care: they would leave without it.", "Пользователям явно не всё равно: без этого они уйдут."],
    ], "A dissatisfier is a basic expectation: its absence causes strong dissatisfaction, while its presence alone does not increase satisfaction.", "Dissatisfier — базовое ожидание: его отсутствие вызывает сильное недовольство, а наличие само по себе удовлетворённость не повышает."),
    qx("A free budgeting app unexpectedly starts sorting expenses into categories automatically. Users did not ask for it and are thrilled. Which Kano category fits best?", "Delighter / exciter", [
      ["Satisfier", "Satisfiers are expected features where more is better (e.g. faster sync); this one was unexpected.", "Satisfiers — ожидаемые функции, где больше — лучше (например, быстрее синхронизация); эта — неожиданная."],
      ["Dissatisfier", "Its absence would not upset anyone, because nobody expected it.", "Её отсутствие никого бы не расстроило — её никто не ждал."],
      ["Indifferent", "Users are thrilled, so they are clearly not indifferent.", "Пользователи в восторге — значит, им явно не всё равно."],
    ], "Delighters/Exciters are unexpected features: their presence strongly increases satisfaction, their absence goes unnoticed.", "Delighters/Exciters — неожиданные функции: их наличие сильно повышает удовлетворённость, а отсутствие не замечают."),
    qx("Which four factors does the requirements prioritization model rate for every proposed feature?", "Benefit, penalty, cost, and risk", [
      ["Value, effort, size, and complexity", "These are general estimation words; the model's four factors are benefit, penalty, cost and risk.", "Это общие слова оценки; четыре фактора модели — выгода, штраф, стоимость и риск."],
      ["Benefit, cost, time, and quality", "Time and quality are project constraints, not the model's factors; penalty and risk are missing.", "Время и качество — ограничения проекта, а не факторы модели; здесь нет штрафа и риска."],
      ["Penalty, risk, velocity, and scope", "Velocity and scope describe delivery, not a feature's rating; benefit and cost are missing.", "Velocity и объём описывают поставку, а не оценку функции; нет выгоды и стоимости."],
    ], "Slide: rate the benefit, penalty, cost, and risk of every proposed feature on a relative scale of 1 to 9 and enter the numbers into a weighted formula.", "Слайд: оцените выгоду, штраф, стоимость и риск каждой предложенной функции по шкале от 1 до 9 и подставьте числа во взвешенную формулу."),
    qx("On what scale are the factors rated in the requirements prioritization model?", "1 (lowest) to 9 (highest)", [
      ["1 (lowest) to 5 (highest)", "A 1–5 scale is common in surveys, but the slide gives 1 to 9.", "Шкала 1–5 часто встречается в опросах, но на слайде — от 1 до 9."],
      ["0 (lowest) to 100 (highest)", "100 belongs to the 100-point method, a different scheme.", "100 — это из метода 100 баллов, другой схемы."],
      ["1 (lowest) to 10 (highest)", "Close, but the slide's relative scale ends at 9.", "Близко, но относительная шкала на слайде заканчивается на 9."],
    ], "Slide: a relative scale of 1 (lowest) to 9 (highest).", "Слайд: относительная шкала от 1 (низшая) до 9 (высшая)."),
    qx("In the requirements prioritization model, which combination gives a feature the HIGHEST relative priority?", "High benefit and penalty, low cost and risk", [
      ["High cost and risk, low benefit and penalty", "This is the worst combination: little value and expensive, risky work.", "Это худшее сочетание: мало ценности и дорогая рискованная работа."],
      ["High benefit and cost, low penalty and risk", "High cost pulls the priority down, and low penalty means little harm if the feature is skipped.", "Высокая стоимость тянет приоритет вниз, а низкий штраф значит, что без функции вреда мало."],
      ["High risk and penalty, low benefit and cost", "High risk lowers priority and low benefit means little value from having the feature.", "Высокий риск понижает приоритет, а низкая выгода — мало ценности от функции."],
    ], "Benefit and penalty form the value (numerator); cost and risk are in the denominator. So high benefit and penalty with low cost and risk give the highest priority.", "Выгода и штраф образуют ценность (числитель), стоимость и риск — в знаменателе. Поэтому высокие выгода и штраф при низких стоимости и риске дают наивысший приоритет."),
    qx("A ranked list is A, B, C, D, E, with the cutoff to meet budget and time just below E. A new change Δ is accepted and ranked between B and C. What happens?", "E falls below the cutoff and is deferred", [
      ["Δ is placed at the bottom of the list, below E", "Δ is prioritized like any item; the customer ranked it between B and C.", "Δ приоритизируют как любой элемент; заказчик поставил его между B и C."],
      ["The cutoff line moves down so that E still fits", "The cutoff is set by fixed budget and time; it does not move because a change arrives.", "Черту задают фиксированные бюджет и срок; она не сдвигается из-за нового изменения."],
      ["C is removed from the list entirely", "C simply moves down one place; only the item that crosses the cutoff (E) is deferred.", "C просто опускается на одно место; откладывается только тот, кто пересёк черту (E)."],
    ], "Slide figure: change accepted, deferring “E”. Adding a new change forces a lower-priority feature below the cutoff point.", "Рисунок слайда: изменение принято, E отложено. Новое изменение выталкивает менее приоритетную функцию под черту отсечения."),
    qx("Which benefit does the slide attribute to incorporating changes into a relative priority list?", "Transparency and control over trade-offs", [
      ["A guarantee that every feature is delivered", "The opposite: some feature falls below the cutoff when a change is added.", "Наоборот: при добавлении изменения какая-то функция уходит под черту."],
      ["No need to involve the customer in changes", "The customer is the one who sees the trade-off and decides.", "Именно заказчик видит компромисс и принимает решение."],
      ["A fixed scope that protects the deadline", "Budget and time are fixed; the scope moves across the cutoff.", "Фиксированы бюджет и срок; объём как раз смещается через черту."],
    ], "Slide: a relative priority list simplifies the view of all remaining work and offers transparency and control over trade-offs.", "Слайд: относительный список приоритетов упрощает обзор оставшейся работы и даёт прозрачность и контроль над компромиссами."),
    qx("Why does the slide recommend delivering a “plain-vanilla” version of the product while the complex elements are still being built?", "It lets the organization realize benefits early", [
      ["It avoids any need for later increments", "The complex elements are still coming; plain-vanilla is the first increment, not the last.", "Сложные элементы ещё впереди; базовая версия — первый инкремент, а не последний."],
      ["It lets the team skip testing of the simple version", "Every increment must be working and tested; nothing on the slide removes testing.", "Каждый инкремент должен работать и быть проверен; слайд не отменяет тестирование."],
      ["It keeps stakeholders from asking for changes", "Early delivery invites feedback and change rather than blocking it.", "Ранняя поставка как раз приглашает к обратной связи и изменениям."],
    ], "Slide: delivering a plain-vanilla version of the product while working on the more complex elements allows the organization to realize the benefits early.", "Слайд: поставка базовой версии продукта, пока делаются сложные элементы, позволяет организации получить выгоду рано."),
    qx("According to the slide, how does delivering incrementally reduce rework?", "Issues are found early, before they spread", [
      ["Requirements are frozen after the first increment", "Agile does not freeze requirements; freezing would block feedback.", "Agile не замораживает требования; это перекрыло бы обратную связь."],
      ["Testing is postponed until the final increment", "Late testing increases rework — the opposite of the slide's point.", "Позднее тестирование увеличивает переделки — противоположно мысли слайда."],
      ["Each increment is built by a different team", "Team assignment has nothing to do with the slide's argument.", "Распределение по командам не имеет отношения к доводу слайда."],
    ], "Slide: reduce the amount of rework by finding issues early — working increments expose problems while they are still small.", "Слайд: переделок меньше, потому что проблемы находят рано, — работающие инкременты показывают проблемы, пока они маленькие."),
    qx("Which statement matches the slide's definition of a minimal viable product (MVP)?", "Useful enough for users or market, but smaller than the entire project", [
      ["A throwaway prototype built only to test an idea, never for real users", "An MVP must be useful to real users or the market; a throwaway prototype is not.", "MVP должен быть полезен реальным пользователям или рынку; одноразовый прототип — нет."],
      ["The complete product with only the cheapest features removed from it", "An MVP is small, not “almost everything”; it is chosen by usefulness, not by cost.", "MVP — маленький продукт, а не «почти всё»; его отбирают по полезности, а не по цене."],
      ["Whatever the first sprint produces, whether useful to users or not", "Usefulness is the core of the definition; an increment that is not useful is not an MVP.", "Полезность — суть определения; бесполезный инкремент — не MVP."],
    ], "Slide: an MVP is a package of functionality that is complete enough to be useful to the users or market, but small enough that it doesn't represent the entire project.", "Слайд: MVP — набор функциональности, достаточно полный, чтобы быть полезным пользователям или рынку, но достаточно маленький, чтобы не быть всем проектом."),
    qx("Besides being useful to users, what two things does an MVP allow for, according to its slide?", "Early return on investment and field-testing functionality", [
      ["A fixed final scope and a complete specification up front", "An MVP is about learning and early value, not fixing the scope.", "MVP — про обучение и раннюю ценность, а не про фиксацию объёма."],
      ["A lower total cost and no need for further releases", "Further releases follow an MVP; it is a start, not the end.", "За MVP следуют новые релизы; это начало, а не конец."],
      ["Full documentation and regulatory approval at once", "Neither is mentioned on the MVP slide.", "Ни того ни другого на слайде про MVP нет."],
    ], "Slide: an MVP allows for early return on investment and provides an opportunity to field-test functionality.", "Слайд: MVP позволяет получить раннюю отдачу от инвестиций и даёт возможность проверить функциональность в реальных условиях."),
    qx("A product owner wants to sort features by how they will affect customer satisfaction, not by whether they go into this release. Which technique fits?", "Kano analysis", [
      ["MoSCoW", "MoSCoW sorts by delivery commitment for the release (must, should, could, not this time).", "MoSCoW сортирует по обязательству поставки в релизе (must, should, could, not this time)."],
      ["Monopoly money", "Monopoly money spreads a budget among features; it does not model satisfaction.", "Monopoly money распределяет бюджет между функциями; удовлетворённость она не моделирует."],
      ["Simple Priority 1, 2, 3 labels", "Simple labels give an order but say nothing about the type of effect on satisfaction.", "Простые метки дают порядок, но ничего не говорят о виде влияния на удовлетворённость."],
    ], "Kano analysis classifies customer preferences into delighters/exciters, satisfiers, dissatisfiers and indifferent — by their effect on satisfaction.", "Анализ Кано раскладывает предпочтения заказчиков на delighters/exciters, satisfiers, dissatisfiers и indifferent — по влиянию на удовлетворённость."),
    tfx("In an agile project, prioritization is done once at the start; afterwards the backlog order is kept fixed so that the team can focus.", false,
      "The slides say to iteratively review the backlog with the customer and conduct reprioritization sessions at the end of each iteration.",
      "Слайды говорят: пересматривайте бэклог с заказчиком итеративно и проводите переприоритизацию в конце каждой итерации.",
      "“True” describes a plan-driven, fixed-scope approach; agile priorities keep changing as value becomes clearer.",
      "«Верно» описывает плановый подход с фиксированным объёмом; в agile приоритеты меняются по мере того, как проясняется ценность."),
    tfx("In Kano analysis, a “dissatisfier” is a feature customers dislike, so it should be removed from the backlog.", false,
      "A dissatisfier is a basic expectation: customers are dissatisfied when it is missing. It must be delivered, not removed.",
      "Dissatisfier — базовое ожидание: заказчики недовольны, когда его нет. Его нужно сделать, а не убрать.",
      "“True” reads the name literally; the category describes the reaction to the feature's absence, not dislike of the feature.",
      "«Верно» понимает название буквально; категория описывает реакцию на отсутствие функции, а не неприязнь к ней."),
  ],
);

const p3 = part(
  "pm-l9-p3",
  { en: "Agile tooling, WIP and flow", ru: "Инструменты agile, незавершённая работа и поток" },
  {
    en: `## Agile tooling: why high-tech tools can hurt
The slide names two problems of high-tech (software) planning tools:
| Problem | Slide wording | What it looks like |
|---|---|---|
| **Data accuracy perception increases** | **High-tech tools can create sophisticated models of the future that imply more credibility than their data base supports** | a 400-line Gantt chart with dates to the day looks precise, although it rests on rough guesses |
| **Barriers for stakeholder interaction are created** | **A low number of stakeholders can easily enhance, improve, and update plans created by high-tech tools** | only the planner who knows the tool can change the plan; everyone else just receives printouts |
- "Data base" here means the underlying data, not a database: the output looks more certain than the input deserves.
- "A low number of stakeholders can easily..." means that **only a few people** can change such plans — the rest are shut out, so the plan stops being a shared one.
> Exam trap: the problem is not that high-tech tools calculate wrongly — it is that they **look** more credible than their data justify, and that they **limit who can change the plan**.
## Low-tech, high-touch tools
- **Agile teams prefer low-tech, high-touch tools such as simple cards and charts like task/Kanban boards.**
- **They are easy for all stakeholders to manipulate and change plans as appropriate for the reality of the project.**
- **Tangible objects promote communication and collaboration, which allows for learning and knowledge transfer.**
| | High-tech tools | Low-tech, high-touch tools |
|---|---|---|
| Examples | scheduling software, complex Gantt models | index cards, sticky notes, whiteboard, flip charts |
| Who can change the plan | a few tool experts | everyone in the room |
| Impression of accuracy | high — often higher than the data justify | honest — rough plans look rough |
| Effect on the team | people report to the tool | people talk, move cards and learn from each other |
- **Example:** in sprint planning the team, the product owner and a business analyst stand at the whiteboard and move story cards between columns. A tester notices that two cards depend on the same API and moves one to the next sprint — a change that would never happen if only the project scheduler could edit the plan.
- Distributed teams often use digital boards (Jira, Trello, Miro); they work best when they keep the simplicity of a physical board (beyond the slides).
## Task/Kanban boards
- **The primary tools for planning and monitoring work progress in Kanban methodology.**
- **Generally a whiteboard with columns that show various stages of work.**
- **The slide's picture ("Task board")** is a hand-drawn whiteboard with three columns: **To Do**, **Doing** and a last column where **"Done" is crossed out and replaced with "ACCEPTED"**. Sticky notes (tasks) sit in every column.
- Crossing out "Done" makes a point: a card leaves the board only when the product owner **accepts** it — the same rule as the "rate of progress" KPI in part 1.
- The board is an **information radiator**: anyone walking past sees what is waiting, what is being worked on and what is finished.
## Work in progress (WIP)
> **WIP:** work that has been started, but not yet completed.
**Excessive levels of WIP can cause problems including:**
| Problem (slide) | Why | IT example |
|---|---|---|
| **No ROI until it is converted into an accepted product** | half-done work earns nothing | 12 features "90% done" bring zero revenue; 3 finished features would already earn |
| **Hidden bottlenecks in processes that slow workflow and mask efficiency issues** | when everyone is busy with many items, nobody sees where work piles up | 20 stories wait for one tester, but developers keep starting new stories, so the queue is not visible |
| **Risk in the form of potential rework** | the longer work stays unfinished, the more requirements and code change under it | a half-built report must be redone after the database schema changes |
- WIP is the "partially done work" waste from Lecture 6.
## WIP limits
- **Agile approaches aim to limit WIP in order to optimize throughput of work.**
- **Apply WIP limits by using Kanban boards that restrict the amount of work in the system at one time** — for example, a number in the column header: "In Progress (2)".
- **Kanban boards with WIP limits can help identify and remove bottlenecks** — when a column is full, work upstream stops and the team swarms to clear it.
- **Without WIP limits, a team may undertake too many pieces of work at once.**
> Memory hook: "stop starting, start finishing".
## Three boards: no limit, too low, just right
The "WIP Limits (Continued)" slide shows the same order-processing project on three task/Kanban boards (each with the same 10 tasks):
| Board | To Do | In Progress | Done |
|---|---|---|---|
| **No WIP limit** | Amend order, Item details, Archive order, Order refund | **4:** Create order, Stock search, Stock update, Process order | DB schema, Login |
| **WIP limit too low — In Progress (1)** | 7: Stock search, Stock update, Item details, Process order, Archive order, Amend order, Order refund | **1:** Create order | DB schema, Login |
| **WIP limit just right — In Progress (2)** | 5: Stock search, Item details, Archive order, Order refund, Amend order | **2:** Process order, Stock update | **DB schema, Login, Create order** |
- **No limit:** four items are started at once and nothing new is finished — work is spread thin, people switch between tasks, and bottlenecks stay hidden.
- **Too low (1):** only one item may be in progress; team members who could work wait idle, so throughput drops and work piles up in To Do.
- **Just right (2):** a small number of items flows through, and Create order has already reached Done. The limit is high enough to keep everyone busy and low enough to keep work flowing.
> Exam trap: a WIP limit is not "the lower, the better". The slide shows that a limit can be **too low** — the goal is to **optimize throughput**, not to minimize WIP at any cost.
## Cumulative flow diagrams (CFDs)
- **Stacked area graphs that depict features that are in progress, remaining and completed over time.**
- **A valuable tool for tracking and forecasting delivery of value.**
- **They help teams gain insight into project issues, cycle times, and likely completion dates.**
**The slide's sample ("Project XYZ — Feature Flow")**, read from the picture:
| Element | What the sample shows |
|---|---|
| Axes | time from April to September; vertical axis "Total Features", 0 to 600 |
| Top line (total) | 400 features in April–May, about 430 in June–July, 500 in August–September — **scope was added** |
| Bands, bottom to top | **Completed** (lined), **In progress** (dotted), the remaining backlog up to the total line (green) |
| By September | about 320 completed, about 70 in progress, about 110 remaining |
@diagram pm9-cfd
**How to read a CFD:**
| What you see | What it means |
|---|---|
| **vertical** width of the in-progress band | how much **WIP** there is right now (queue length, in units) |
| **horizontal** distance across the in-progress band | how long an item stays in progress — **cycle time** (queue duration) |
| the in-progress band **widening** | WIP is growing: work starts faster than it finishes — look for a **bottleneck** |
| the completed line **flattening** | nothing is being delivered |
| the top (total) line **rising** | **scope is being added** to the backlog |
| the slope of the completed line | **throughput** — how fast work is finished |
| the completed line extended until it meets the total line | the **likely completion date** |
- Lead time (beyond the slides) runs from the moment a request enters the backlog until it is delivered; cycle time — from the start of work until it is done. On a CFD, lead time is the horizontal distance from the top of the remaining band to the completed line.
## Little's Law
- The slide: **cycle time — the duration of a queue (how long it will take to complete the work) is proportional to its size (how much work is in progress).**
- The slide's figure ("Little's Law and work in progress") zooms into the in-progress band of the same CFD: **A = queue duration (time)** is the horizontal distance, **B = queue length (units)** is the vertical distance.
= Cycle time = WIP / Throughput
= WIP = Throughput x Cycle time
**Worked example.** A team has 30 stories in progress and finishes 10 stories per week.
= Cycle time = 30 / 10 = 3 weeks
- If the team cuts WIP to 15 stories and still finishes 10 per week, the cycle time becomes 15 / 10 = 1.5 weeks — every story reaches the customer twice as fast.
- **Why WIP limits work:** with a stable throughput, less WIP means a shorter cycle time and earlier value.
> Exam trap: Little's Law links **three** things — WIP, throughput and cycle time. Halving WIP halves cycle time **only if throughput stays the same**. And cycle time is the **horizontal** distance on a CFD, WIP is the **vertical** one.
## Bottlenecks and the Theory of Constraints (ToC)
- **ToC (Eliyahu Goldratt) is a tool used to optimize a production system and look for bottlenecks.** A system can go no faster than its slowest step — the constraint.
- **Address the issue by applying the following steps:**
| Step | Slide wording | IT example: code review by one senior developer is the bottleneck |
|---|---|---|
| **1. Identify** | **Identify the constraint** | the CFD and the board show stories piling up in "Review" |
| **2. Exploit** | **Exploit the constraint** | the senior developer does only reviews, with no meetings or side tasks, so the constraint never stands idle |
| **3. Subordinate** | **Subordinate all other processes to exploit the constraint** | developers stop starting new stories and prepare small, review-ready pull requests; the WIP limit before Review is lowered |
| **4. Elevate** | **If after steps 2 and 3 are done, more capacity is needed to meet demand, elevate the constraint** | train two more reviewers or add automated static analysis |
| **5. Repeat** | **If the constraint has not moved, go back to step 1, but don't let inertia (complacency) become the system's constraint** | the bottleneck moves to testing — start again; do not keep the old review rules just out of habit |
> Memory hook: **I-E-S-E-R** — Identify, Exploit, Subordinate, Elevate, Repeat. Exploit (use the constraint fully) comes **before** elevate (spend money to add capacity).
> Exam trap: elevating — hiring people, buying tools — is step **4**, and only **if, after steps 2 and 3, more capacity is still needed**. In Goldratt's original, step 5 says to go back to step 1 once a constraint has been broken (has moved); the slide phrases it "if the constraint has not moved". Use the slide wording; the point in both is that the cycle repeats and inertia must not become the constraint.
## Exam focus
- Two problems of high-tech tools: **data accuracy perception increases**; **barriers for stakeholder interaction are created**.
- Low-tech, high-touch: cards and task/Kanban boards; easy for **all** stakeholders to change; tangible objects → communication, collaboration, learning, knowledge transfer.
- Task/Kanban board: the primary tool for planning and monitoring work progress in Kanban; a whiteboard with columns for the stages of work.
- WIP = started, not yet completed; three problems: **no ROI** until accepted, **hidden bottlenecks**, **potential rework**.
- WIP limits optimize **throughput**; a limit can be **too low**; three boards: no limit / too low (1) / just right (2).
- CFD: stacked areas of remaining, in progress, completed; vertical = WIP, horizontal = cycle time; widening band = bottleneck; rising top line = scope added.
- Little's Law: cycle time = WIP / throughput.
- ToC steps in order: identify, exploit, subordinate, elevate, repeat — and don't let inertia become the constraint.
?? A team finishes 6 stories a week and has 24 stories in progress. What is the cycle time, and what happens if the WIP limit is set to 12?
?= Cycle time = 24 / 6 = 4 weeks. With 12 stories in progress and the same throughput, cycle time = 12 / 6 = 2 weeks.
?? On a CFD, the in-progress band has been getting wider for three weeks while the completed line is almost flat. What does this suggest?
?= WIP is growing because work is started faster than it is finished — there is a bottleneck somewhere in the process. The team should find it (ToC step 1) and stop starting new work.
?? A tester is the bottleneck. The team has already made sure the tester never waits for work. Which ToC step comes next, and what could it look like?
?= Step 3, subordinate: the other processes adapt to the constraint — developers stop starting new stories, help write automated tests and hand over small, ready-to-test pieces. Only if that is not enough comes step 4, elevate (for example, hire a second tester).`,
    ru: `## Инструменты agile (agile tooling): чем вредят «высокотехнологичные» инструменты
Слайд называет две проблемы сложных программных инструментов планирования (high-tech tools):
| Проблема | Формулировка слайда | Как это выглядит |
|---|---|---|
| **Растёт ощущение точности данных (data accuracy perception increases)** | **Сложные инструменты создают изощрённые модели будущего, которые выглядят достовернее, чем позволяют лежащие в их основе данные (imply more credibility than their data base supports)** | диаграмма Ганта на 400 строк с датами до дня выглядит точной, хотя построена на грубых догадках |
| **Возникают барьеры для взаимодействия стейкхолдеров (barriers for stakeholder interaction)** | **Лишь немногие стейкхолдеры могут легко дополнять, улучшать и обновлять планы, созданные в таких инструментах (a low number of stakeholders can easily…)** | менять план может только планировщик, который знает программу; остальные получают распечатки |
- «Data base» здесь — исходные данные, а не база данных: результат выглядит увереннее, чем того заслуживают входные данные.
- «A low number of stakeholders can easily…» значит, что **только немногие** могут менять такие планы, — остальные отрезаны, и план перестаёт быть общим.
> Ловушка экзамена: проблема не в том, что такие инструменты неправильно считают, а в том, что они **выглядят** достовернее, чем позволяют данные, и **ограничивают круг тех, кто может менять план**.
## Простые «тактильные» инструменты (low-tech, high-touch tools)
- **Agile-команды предпочитают простые «тактильные» инструменты: карточки и диаграммы вроде досок задач / Kanban (task/Kanban boards).**
- **Всем стейкхолдерам легко с ними работать и менять планы так, как требует реальность проекта.**
- **Осязаемые предметы (tangible objects) способствуют общению и сотрудничеству, а это даёт обучение и передачу знаний (learning and knowledge transfer).**
| | Сложные инструменты (high-tech) | Простые «тактильные» (low-tech, high-touch) |
|---|---|---|
| Примеры | программы планирования, сложные модели Ганта | карточки, стикеры, маркерная доска, флипчарты |
| Кто может менять план | несколько экспертов по программе | все, кто в комнате |
| Впечатление точности | высокое — часто выше, чем позволяют данные | честное — грубый план и выглядит грубым |
| Влияние на команду | люди отчитываются перед программой | люди разговаривают, двигают карточки и учатся друг у друга |
- **Пример:** на планировании спринта команда, владелец продукта и бизнес-аналитик стоят у доски и двигают карточки историй между колонками. Тестировщик замечает, что две карточки зависят от одного и того же API, и переносит одну в следующий спринт, — такого изменения не случилось бы, если бы план мог править только планировщик.
- Распределённые команды часто используют цифровые доски (Jira, Trello, Miro); лучше всего они работают, когда сохраняют простоту физической доски (за пределами слайдов).
## Доски задач / Kanban (task/Kanban boards)
- **Главные инструменты планирования и отслеживания хода работы в методологии Kanban.**
- **Обычно это маркерная доска с колонками, которые показывают разные стадии работы.**
- **Рисунок на слайде («Task board»)** — нарисованная от руки доска с тремя колонками: **To Do**, **Doing** и последней, где **«Done» зачёркнуто и заменено на «ACCEPTED»**. В каждой колонке — стикеры (задачи).
- Зачёркнутое «Done» — намёк: карточка покидает доску, только когда владелец продукта её **принял**, — то же правило, что у KPI «темп прогресса» в части 1.
- Доска — **информационный радиатор (information radiator)**: любой проходящий видит, что ждёт, что в работе и что готово.
## Незавершённая работа (work in progress, WIP)
> **WIP:** работа, которая начата, но ещё не завершена (started, but not yet completed).
**Избыточный объём WIP может вызывать проблемы, в том числе:**
| Проблема (слайд) | Почему | Пример из IT |
|---|---|---|
| **Нет отдачи (ROI), пока работа не превратится в принятый продукт (accepted product)** | полуготовая работа ничего не зарабатывает | 12 функций «готовы на 90%» приносят ноль выручки; 3 законченные уже приносили бы |
| **Скрытые узкие места (hidden bottlenecks), которые замедляют поток и маскируют проблемы эффективности** | когда все заняты множеством задач, никто не видит, где копится работа | 20 историй ждут одного тестировщика, но разработчики продолжают начинать новые, и очередь не видна |
| **Риск в виде возможных переделок (potential rework)** | чем дольше работа не закончена, тем больше под ней меняются требования и код | недоделанный отчёт приходится переписывать после изменения схемы базы данных |
- WIP — это потеря «частично сделанная работа» (partially done work) из лекции 6.
## Лимиты WIP (WIP limits)
- **Agile-подходы стремятся ограничить WIP, чтобы оптимизировать пропускную способность (optimize throughput of work).**
- **Лимиты WIP вводят с помощью Kanban-досок, которые ограничивают объём работы в системе в каждый момент** — например, числом в заголовке колонки: «In Progress (2)».
- **Kanban-доски с лимитами WIP помогают находить и устранять узкие места** — когда колонка заполнена, работа до неё останавливается, и команда вместе её разгребает.
- **Без лимитов WIP команда может взяться за слишком много работы сразу.**
> Запоминалка: «хватит начинать — начните заканчивать» (stop starting, start finishing).
## Три доски: без лимита, слишком низкий, в самый раз
Слайд «WIP Limits (Continued)» показывает один и тот же проект обработки заказов на трёх досках (на каждой те же 10 задач):
| Доска | To Do | In Progress | Done |
|---|---|---|---|
| **Без лимита WIP (no WIP limit)** | Amend order, Item details, Archive order, Order refund | **4:** Create order, Stock search, Stock update, Process order | DB schema, Login |
| **Лимит слишком низкий (too low) — In Progress (1)** | 7: Stock search, Stock update, Item details, Process order, Archive order, Amend order, Order refund | **1:** Create order | DB schema, Login |
| **Лимит в самый раз (just right) — In Progress (2)** | 5: Stock search, Item details, Archive order, Order refund, Amend order | **2:** Process order, Stock update | **DB schema, Login, Create order** |
- **Без лимита:** начато сразу четыре задачи, и ничего нового не закончено — силы распылены, люди переключаются между задачами, узкие места скрыты.
- **Слишком низкий (1):** в работе может быть только одна задача; те, кто мог бы работать, простаивают — пропускная способность падает, работа копится в To Do.
- **В самый раз (2):** через систему течёт небольшое число задач, и Create order уже дошла до Done. Лимит достаточно высок, чтобы все были заняты, и достаточно низок, чтобы работа текла.
> Ловушка экзамена: лимит WIP — не «чем ниже, тем лучше». Слайд показывает, что лимит может быть **слишком низким**; цель — **оптимизировать пропускную способность**, а не уменьшить WIP любой ценой.
## Накопительные диаграммы потока (cumulative flow diagrams, CFDs)
- **Диаграммы с накоплением площадей (stacked area graphs), которые показывают функции в работе, оставшиеся и завершённые во времени.**
- **Ценный инструмент для отслеживания и прогнозирования поставки ценности (tracking and forecasting delivery of value).**
- **Помогают командам увидеть проблемы проекта, время цикла (cycle times) и вероятные даты завершения.**
**Пример со слайда («Project XYZ — Feature Flow»)**, прочитанный по рисунку:
| Элемент | Что показывает пример |
|---|---|
| Оси | время с апреля по сентябрь; вертикальная ось «Total Features», от 0 до 600 |
| Верхняя линия (всего) | 400 функций в апреле–мае, около 430 в июне–июле, 500 в августе–сентябре — **объём добавляли** |
| Полосы снизу вверх | **Completed** (штриховка), **In progress** (точки), оставшийся бэклог до верхней линии (зелёный) |
| К сентябрю | около 320 завершено, около 70 в работе, около 110 осталось |
@diagram pm9-cfd
**Как читать CFD:**
| Что видно | Что это значит |
|---|---|
| **вертикальная** ширина полосы «в работе» | сколько сейчас **WIP** (длина очереди, в штуках) |
| **горизонтальное** расстояние через полосу «в работе» | сколько элемент находится в работе — **время цикла (cycle time)** (длительность очереди) |
| полоса «в работе» **расширяется** | WIP растёт: работу начинают быстрее, чем заканчивают, — ищите **узкое место** |
| линия «завершено» **становится плоской** | ничего не поставляется |
| верхняя линия (всего) **растёт** | в бэклог **добавляют объём** |
| наклон линии «завершено» | **пропускная способность (throughput)** — как быстро заканчивают работу |
| линия «завершено», продолженная до встречи с верхней линией | **вероятная дата завершения** |
- Время выполнения заказа (lead time, за пределами слайдов) считают от момента, когда запрос попал в бэклог, до поставки; время цикла — от начала работы до готовности. На CFD lead time — горизонтальное расстояние от верхней границы оставшейся работы до линии «завершено».
## Закон Литтла (Little's Law)
- Слайд: **время цикла — длительность очереди (сколько времени займёт выполнение работы) пропорциональна её размеру (сколько работы в процессе) (the duration of a queue is proportional to its size)**.
- Рисунок слайда («Little's Law and work in progress») увеличивает полосу «в работе» той же CFD: **A = длительность очереди (queue duration, время)** — горизонтальное расстояние, **B = длина очереди (queue length, штуки)** — вертикальное.
= Cycle time = WIP / Throughput
= WIP = Throughput x Cycle time
**Пример.** У команды 30 историй в работе, она заканчивает 10 историй в неделю.
= Cycle time = 30 / 10 = 3 weeks
- Если команда сократит WIP до 15 историй и по-прежнему будет заканчивать 10 в неделю, время цикла станет 15 / 10 = 1,5 недели — каждая история доходит до заказчика вдвое быстрее.
- **Почему лимиты WIP работают:** при стабильной пропускной способности меньше WIP — короче время цикла и раньше ценность.
> Ловушка экзамена: закон Литтла связывает **три** величины — WIP, пропускную способность и время цикла. Уменьшив WIP вдвое, время цикла сокращают вдвое **только при неизменной пропускной способности**. И время цикла — **горизонтальное** расстояние на CFD, а WIP — **вертикальное**.
## Узкие места и теория ограничений (Theory of Constraints, ToC)
- **ToC (Элияху Голдратт) — инструмент для оптимизации производственной системы и поиска узких мест (bottlenecks).** Система не может работать быстрее своего самого медленного звена — ограничения (constraint).
- **Проблему решают такими шагами:**
| Шаг | Формулировка слайда | Пример из IT: узкое место — код-ревью у одного старшего разработчика |
|---|---|---|
| **1. Identify — найти** | **Найдите ограничение (identify the constraint)** | CFD и доска показывают, что истории копятся в колонке «Review» |
| **2. Exploit — использовать** | **Используйте ограничение по максимуму (exploit the constraint)** | старший разработчик занимается только ревью, без встреч и побочных задач, — ограничение никогда не простаивает |
| **3. Subordinate — подчинить** | **Подчините все остальные процессы использованию ограничения (subordinate all other processes)** | разработчики перестают начинать новые истории и готовят небольшие, готовые к ревью pull request'ы; лимит WIP перед Review снижают |
| **4. Elevate — расширить** | **Если после шагов 2 и 3 нужно больше мощности, чтобы удовлетворить спрос, расширьте ограничение (elevate the constraint)** | обучить ещё двух ревьюеров или добавить автоматический статический анализ |
| **5. Repeat — повторить** | **Если ограничение не сдвинулось, вернитесь к шагу 1, но не дайте инерции (самоуспокоенности, complacency) стать ограничением системы** | узкое место переехало в тестирование — начинаем сначала; старые правила ревью не держим просто по привычке |
> Запоминалка: **I-E-S-E-R** — Identify, Exploit, Subordinate, Elevate, Repeat. Использовать ограничение по максимуму (exploit) — **раньше**, чем тратить деньги на рост мощности (elevate).
> Ловушка экзамена: расширение — нанять людей, купить инструменты — это шаг **4**, и только **если после шагов 2 и 3 мощности всё ещё не хватает**. У Голдратта шаг 5 говорит вернуться к шагу 1, когда ограничение «сломано» (сдвинулось); на слайде — «if the constraint has not moved». На тесте используйте формулировку слайда; суть в обоих случаях: цикл повторяется, и инерция не должна стать ограничением.
## Что спросят на экзамене
- Две проблемы сложных инструментов: **растёт ощущение точности данных**; **возникают барьеры для взаимодействия стейкхолдеров**.
- Low-tech, high-touch: карточки и доски задач / Kanban; **всем** стейкхолдерам легко менять план; осязаемые предметы → общение, сотрудничество, обучение, передача знаний.
- Доска задач / Kanban: главный инструмент планирования и отслеживания хода работы в Kanban; маркерная доска с колонками стадий работы.
- WIP = начато, но не завершено; три проблемы: **нет ROI**, пока не принято, **скрытые узкие места**, **возможные переделки**.
- Лимиты WIP оптимизируют **пропускную способность**; лимит бывает **слишком низким**; три доски: без лимита / слишком низкий (1) / в самый раз (2).
- CFD: накопленные площади «осталось», «в работе», «завершено»; по вертикали — WIP, по горизонтали — время цикла; расширяется полоса — узкое место; растёт верхняя линия — добавили объём.
- Закон Литтла: время цикла = WIP / пропускная способность.
- Шаги ToC по порядку: identify, exploit, subordinate, elevate, repeat — и не дать инерции стать ограничением.
?? Команда заканчивает 6 историй в неделю, в работе 24 истории. Каково время цикла и что будет, если поставить лимит WIP 12?
?= Время цикла = 24 / 6 = 4 недели. При 12 историях в работе и той же пропускной способности время цикла = 12 / 6 = 2 недели.
?? На CFD полоса «в работе» три недели подряд расширяется, а линия «завершено» почти плоская. О чём это говорит?
?= WIP растёт, потому что работу начинают быстрее, чем заканчивают, — где-то в процессе узкое место. Команде нужно его найти (шаг 1 ToC) и перестать начинать новую работу.
?? Узкое место — тестировщик. Команда уже добилась, что он никогда не ждёт работы. Какой шаг ToC следующий и как он может выглядеть?
?= Шаг 3, subordinate: остальные процессы подстраиваются под ограничение — разработчики перестают начинать новые истории, помогают писать автотесты и передают небольшие, готовые к тестированию части. Только если этого мало, наступает шаг 4, elevate (например, нанять второго тестировщика).`,
  },
  [
    qx("According to the slide, what does “data accuracy perception increases” mean as a problem of high-tech tools?", "Their sophisticated models imply more credibility than the data supports", [
      ["Their calculations contain more rounding errors than the team's manual estimates", "The slide does not claim the tools compute badly; the issue is that their output looks more credible than its data.", "Слайд не утверждает, что программы плохо считают; проблема в том, что результат выглядит достовернее своих данных."],
      ["Their data is stored in a database that stakeholders cannot access", "“Data base” on the slide means the underlying data, not a database; access is the second problem, about who can update plans.", "«Data base» на слайде — исходные данные, а не база данных; доступ — это вторая проблема, о том, кто может обновлять план."],
      ["Their reports are less accurate than those of low-tech tools", "Low-tech tools are not more accurate; they are honest about being rough and easy for everyone to change.", "Простые инструменты не точнее; они честно выглядят грубыми и их легко менять всем."],
    ], "Slide: high-tech tools can create sophisticated models of the future that imply more credibility than their data base supports.", "Слайд: сложные инструменты создают изощрённые модели будущего, которые выглядят достовернее, чем позволяют их исходные данные."),
    qx("A project plan lives in complex scheduling software that only the project scheduler knows how to edit. Which problem of high-tech tools does this illustrate?", "Barriers for stakeholder interaction are created", [
      ["The perceived accuracy of the data increases too much", "That problem is about plans looking more credible than their data, not about who can edit them.", "Эта проблема — о том, что план выглядит достовернее своих данных, а не о том, кто может его править."],
      ["Hidden bottlenecks mask the team's efficiency issues", "Hidden bottlenecks are a problem of excessive WIP, not of tools.", "Скрытые узкие места — проблема избыточного WIP, а не инструментов."],
      ["Work in progress grows beyond its limits", "WIP limits concern the flow of work on a board, not access to a plan.", "Лимиты WIP касаются потока работы на доске, а не доступа к плану."],
    ], "Slide: barriers for stakeholder interaction are created — only a low number of stakeholders can easily enhance, improve and update plans created by high-tech tools.", "Слайд: возникают барьеры для взаимодействия — лишь немногие стейкхолдеры могут легко дополнять, улучшать и обновлять планы, созданные в сложных инструментах."),
    qx("Which of the following is NOT a reason the slides give for preferring low-tech, high-touch tools?", "They give more precise long-term forecasts", [
      ["They are easy for all stakeholders to change", "On the slide: easy for all stakeholders to manipulate and change plans.", "Есть на слайде: всем стейкхолдерам легко работать с ними и менять планы."],
      ["Tangible objects promote communication", "On the slide: tangible objects promote communication and collaboration.", "Есть на слайде: осязаемые предметы способствуют общению и сотрудничеству."],
      ["They support learning and knowledge transfer", "On the slide: collaboration allows for learning and knowledge transfer.", "Есть на слайде: сотрудничество даёт обучение и передачу знаний."],
    ], "Precise long-range forecasts are what high-tech tools seem to promise; low-tech tools are valued for being easy to change and for promoting communication, collaboration and learning.", "Точные долгосрочные прогнозы как раз «обещают» сложные инструменты; простые ценят за лёгкость изменения и за то, что они развивают общение, сотрудничество и обучение."),
    qx("On the slide's task board, the last column's title “Done” is crossed out and replaced. With what, and why does it matter?", "“Accepted” — work counts only when the product owner accepts it", [
      ["“Deployed” — work counts only once it has been released to production", "The board says ACCEPTED; deployment is not the criterion shown.", "На доске написано ACCEPTED; развёртывание — не тот критерий."],
      ["“Tested” — work counts once QA has run the regression suite", "Testing is part of getting to done, but the board's last column is acceptance by the product owner.", "Тестирование — часть пути к готовности, но последняя колонка доски — приёмка владельцем продукта."],
      ["“Reviewed” — work counts once a peer has approved the code", "Code review is a technical check, not customer acceptance.", "Код-ревью — техническая проверка, а не приёмка заказчиком."],
    ], "The board's columns are To Do, Doing and Done crossed out to ACCEPTED: value is delivered only when work is accepted — the same idea as the rate-of-progress KPI.", "Колонки доски: To Do, Doing и зачёркнутое Done, исправленное на ACCEPTED: ценность поставлена, только когда работу приняли, — та же мысль, что в KPI «темп прогресса»."),
    qx("Which definition of work in progress (WIP) is given on the slide?", "Work that has been started, but not yet completed", [
      ["Work that is in the backlog, but not yet estimated", "Backlog items have not been started; they are remaining work, not WIP.", "Элементы бэклога ещё не начаты: это оставшаяся работа, а не WIP."],
      ["Work that has been accepted, but not yet released", "Accepted work is completed, so it is no longer WIP by the slide's definition.", "Принятая работа завершена, поэтому по определению слайда это уже не WIP."],
      ["Work that the team has promised, but not yet planned", "A promise is not started work; WIP begins when work starts.", "Обещание — не начатая работа; WIP начинается, когда работу начали."],
    ], "Slide: WIP is work that has been started, but not yet completed.", "Слайд: WIP — работа, которая начата, но ещё не завершена."),
    qx("Which is NOT one of the problems of excessive WIP listed on the slide?", "Too many stakeholders can update the plan", [
      ["No ROI until it becomes an accepted product", "On the list: no ROI until WIP is converted into an accepted product.", "Есть в списке: нет отдачи, пока WIP не превратится в принятый продукт."],
      ["Hidden bottlenecks that mask efficiency issues", "On the list: hidden bottlenecks that slow workflow and mask efficiency issues.", "Есть в списке: скрытые узкие места, которые замедляют поток и маскируют проблемы эффективности."],
      ["Risk in the form of potential rework", "On the list word for word.", "Есть в списке дословно."],
    ], "The three problems of excessive WIP: no ROI until accepted, hidden bottlenecks, risk of potential rework. Who can update plans is about tooling — and the slide's tooling problem is that too few can.", "Три проблемы избыточного WIP: нет отдачи до приёмки, скрытые узкие места, риск переделок. Кто может обновлять планы — тема инструментов, и там проблема как раз в том, что таких людей мало."),
    qx("Why do agile approaches limit WIP, according to the slide?", "To optimize the throughput of the team's work", [
      ["To keep every single team member fully busy", "Full utilization is not the goal; a just-right limit accepts some slack to keep work flowing.", "Полная загрузка — не цель; правильный лимит допускает небольшой запас, чтобы работа текла."],
      ["To reduce how many stakeholders are involved", "WIP limits restrict work in the system, not the number of stakeholders.", "Лимиты WIP ограничивают работу в системе, а не число стейкхолдеров."],
      ["To make the long-range Gantt chart more accurate", "Kanban WIP limits work on the board's flow, not on Gantt forecasts.", "Лимиты WIP в Kanban работают с потоком на доске, а не с прогнозами Ганта."],
    ], "Slide: agile approaches aim to limit WIP in order to optimize throughput of work; without limits a team may undertake too many pieces of work at once.", "Слайд: agile-подходы ограничивают WIP, чтобы оптимизировать пропускную способность; без лимитов команда может взяться за слишком много работы сразу."),
    qx("A Kanban board shows “In Progress (1)”. Seven cards wait in To Do, and several developers are idle. What does the slide's picture of such a board suggest?", "The WIP limit is too low and throughput suffers", [
      ["The WIP limit is just right; idle time is normal", "On the slide the just-right board is In Progress (2), where work flows and Create order reaches Done.", "На слайде правильная доска — In Progress (2): работа течёт, Create order доходит до Done."],
      ["There is no WIP limit, so too much work is started", "The board has a limit of 1; the no-limit board has four items in progress.", "У доски лимит 1; на доске без лимита в работе четыре задачи."],
      ["The board needs more columns, not a new limit", "Adding columns does not fix idle people; the limit itself is too restrictive.", "Новые колонки не решат простой людей; слишком жёсткий сам лимит."],
    ], "The “WIP limit too low” board (In Progress (1)) leaves people waiting and work piling up in To Do — throughput suffers.", "Доска «лимит слишком низкий» (In Progress (1)) оставляет людей без дела, а работа копится в To Do — пропускная способность страдает."),
    qx("What is a cumulative flow diagram (CFD)?", "Stacked areas of remaining, in-progress and completed features over time", [
      ["A line chart of planned value, earned value and actual cost for the project", "That describes the EVM diagram, not a CFD.", "Это описание диаграммы EVM, а не CFD."],
      ["A whiteboard with columns that show the stages of work for each task", "That is a task/Kanban board; a CFD summarizes such a board over time.", "Это доска задач / Kanban; CFD обобщает такую доску во времени."],
      ["A bar chart of story points completed in each iteration of the release", "That is a velocity chart; it has no remaining or in-progress areas.", "Это диаграмма velocity; в ней нет площадей «осталось» и «в работе»."],
    ], "Slide: CFDs are stacked area graphs that depict features that are in progress, remaining and completed over time — a tool for tracking and forecasting delivery of value.", "Слайд: CFD — диаграммы с накоплением площадей, показывающие функции в работе, оставшиеся и завершённые во времени, — инструмент отслеживания и прогноза поставки ценности."),
    qx("On a CFD, what does the horizontal distance across the in-progress band represent?", "Cycle time — how long items stay in progress", [
      ["WIP — how many items are in progress now", "WIP is the vertical width of the band (queue length).", "WIP — вертикальная ширина полосы (длина очереди)."],
      ["Throughput — how many items finish per week", "Throughput is the slope of the completed line.", "Пропускная способность — наклон линии «завершено»."],
      ["Scope — how many items were added to the backlog", "Added scope shows as the top (total) line rising.", "Добавленный объём виден по росту верхней линии."],
    ], "In the slide's Little's Law figure, A = queue duration (time) is the horizontal distance and B = queue length (units) is the vertical distance.", "На рисунке слайда к закону Литтла A = длительность очереди (время) — горизонтальное расстояние, B = длина очереди (штуки) — вертикальное."),
    qx("For several weeks the in-progress band of a CFD keeps getting wider while the completed line is nearly flat. What is the most likely explanation?", "Work is piling up behind a bottleneck", [
      ["The customer added new scope to the backlog", "Added scope raises the top line; it does not widen the in-progress band.", "Добавленный объём поднимает верхнюю линию, а не расширяет полосу «в работе»."],
      ["The team's throughput is increasing", "Rising throughput would make the completed line steeper, not flat.", "При росте пропускной способности линия «завершено» стала бы круче, а не плоской."],
      ["The WIP limit is working as intended", "A working WIP limit keeps the band narrow and steady.", "Работающий лимит WIP держит полосу узкой и ровной."],
    ], "A widening in-progress band means work is started faster than it is finished — WIP grows and a bottleneck is hiding somewhere in the process.", "Расширяющаяся полоса «в работе» значит, что работу начинают быстрее, чем заканчивают: WIP растёт, а где-то в процессе прячется узкое место."),
    qx("The top line of a CFD rises from 400 to 500 features between April and August. What does this mean?", "Scope was added to the project", [
      ["100 features were completed", "Completed work is the bottom band; the top line is the total.", "Завершённая работа — нижняя полоса; верхняя линия — общий объём."],
      ["WIP grew by 100 features", "WIP is the width of the in-progress band, not the total line.", "WIP — ширина полосы «в работе», а не верхняя линия."],
      ["The cycle time grew by 100 days", "The vertical axis counts features, not days; cycle time is a horizontal distance.", "Вертикальная ось считает функции, а не дни; время цикла — горизонтальное расстояние."],
    ], "In the slide's sample the total rises from 400 to 500 features: the backlog grew, i.e. scope was added.", "В примере слайда общий объём растёт с 400 до 500 функций: бэклог вырос, то есть добавили объём."),
    qx("A team has 24 stories in progress and completes 8 stories per week. According to Little's Law, what is the average cycle time?", "3 weeks", [
      ["192 weeks", "That multiplies WIP by throughput; cycle time divides WIP by throughput.", "Здесь WIP умножили на пропускную способность; время цикла — WIP, делённый на неё."],
      ["0.33 weeks", "That divides throughput by WIP — the formula is upside down.", "Здесь пропускную способность разделили на WIP — формула перевёрнута."],
      ["16 weeks", "That subtracts throughput from WIP; Little's Law is a ratio.", "Здесь из WIP вычли пропускную способность; закон Литтла — это отношение."],
    ], "Cycle time = WIP / throughput = 24 / 8 = 3 weeks.", "Время цикла = WIP / пропускная способность = 24 / 8 = 3 недели."),
    qx("What does Little's Law, as quoted on the slide, say about a queue?", "Its duration is proportional to its size", [
      ["Its size is proportional to the team's velocity", "Velocity is not in the slide's statement; it links duration and size.", "Velocity в формулировке слайда нет; она связывает длительность и размер."],
      ["Its duration does not depend on the WIP", "The opposite: duration grows with the amount of work in progress.", "Наоборот: длительность растёт с объёмом незавершённой работы."],
      ["Its size should equal the number of team members", "That is a rule of thumb for WIP limits, not Little's Law.", "Это эмпирическое правило для лимитов WIP, а не закон Литтла."],
    ], "Slide: the duration of a queue (how long it will take to complete the work) is proportional to its size (how much work is in progress).", "Слайд: длительность очереди (сколько займёт выполнение работы) пропорциональна её размеру (сколько работы в процессе)."),
    qx("Which sequence gives the Theory of Constraints steps in the order shown on the slide?", "Identify, exploit, subordinate, elevate, repeat", [
      ["Identify, elevate, exploit, subordinate, repeat", "Elevating comes only after exploiting and subordinating fail to give enough capacity.", "Расширять ограничение можно только после того, как использование и подчинение не дали нужной мощности."],
      ["Exploit, identify, elevate, subordinate, repeat", "You cannot exploit a constraint before identifying it.", "Нельзя использовать ограничение, пока его не нашли."],
      ["Identify, subordinate, exploit, elevate, repeat", "Exploit comes before subordinate: other processes are subordinated to exploiting the constraint.", "Exploit идёт раньше subordinate: остальные процессы подчиняют именно использованию ограничения."],
    ], "Slide: 1 identify, 2 exploit, 3 subordinate all other processes, 4 elevate if more capacity is needed, 5 go back to step 1 without letting inertia become the constraint.", "Слайд: 1 найти, 2 использовать, 3 подчинить остальные процессы, 4 расширить, если нужно больше мощности, 5 вернуться к шагу 1, не дав инерции стать ограничением."),
    qx("Code review by one senior developer is the bottleneck. The team has already removed all her other duties so that she never stands idle. Which ToC step should come next?", "Subordinate other processes to the constraint", [
      ["Elevate the constraint by hiring more reviewers", "Elevating is step 4 and only if steps 2 and 3 are not enough; step 3 has not been done yet.", "Расширение — шаг 4 и только если шагов 2 и 3 мало; шаг 3 ещё не сделан."],
      ["Identify the constraint once again from scratch", "The constraint is already known; returning to step 1 comes after the cycle, not now.", "Ограничение уже известно; к шагу 1 возвращаются после цикла, а не сейчас."],
      ["Exploit the constraint by removing her duties", "That is what the team has just done — step 2 is complete.", "Это команда только что сделала — шаг 2 выполнен."],
    ], "Removing her other duties is exploiting (step 2). Next is step 3: subordinate all other processes — e.g. developers stop starting new work and send small, review-ready changes.", "Снять с неё другие обязанности — это использование (шаг 2). Дальше шаг 3: подчинить остальные процессы — например, разработчики перестают начинать новую работу и присылают небольшие, готовые к ревью изменения."),
    qx("According to the slide, when should a team elevate the constraint?", "When steps 2 and 3 are done but more capacity is still needed", [
      ["As soon as the constraint has been identified in step 1", "Elevating is step 4; first the constraint is exploited and other processes are subordinated.", "Расширение — шаг 4; сначала ограничение используют и подчиняют ему остальные процессы."],
      ["Before exploiting it, so that money solves the problem fast", "ToC deliberately tries cheap steps (exploit, subordinate) before spending money.", "ToC намеренно сначала пробует дешёвые шаги (exploit, subordinate), а потом тратит деньги."],
      ["Only after inertia has become the system's constraint", "Inertia is what step 5 warns against, not a trigger for elevating.", "От инерции предостерегает шаг 5; это не сигнал к расширению."],
    ], "Slide step 4: if after steps 2 and 3 are done, more capacity is needed to meet demand, elevate the constraint.", "Шаг 4 на слайде: если после шагов 2 и 3 для удовлетворения спроса нужно больше мощности, расширьте ограничение."),
    qx("What warning does the slide attach to step 5 of the Theory of Constraints?", "Don't let inertia (complacency) become the system's constraint", [
      ["Don't let WIP limits fall below the number of developers", "WIP limits are a Kanban practice; the ToC slide warns about inertia.", "Лимиты WIP — практика Kanban; слайд ToC предостерегает об инерции."],
      ["Don't let the product owner change priorities mid-iteration", "Priority changes are not part of the ToC steps on the slide.", "Изменение приоритетов не входит в шаги ToC на слайде."],
      ["Don't let high-tech tools replace the task board", "That echoes the tooling slides, not the ToC steps.", "Это перекликается со слайдами об инструментах, а не с шагами ToC."],
    ], "Slide step 5: if the constraint has not moved, go back to step 1, but don't let inertia (complacency) become the system's constraint.", "Шаг 5 на слайде: если ограничение не сдвинулось, вернитесь к шагу 1, но не дайте инерции (самоуспокоенности) стать ограничением системы."),
    tfx("A WIP limit should be set as low as possible, ideally one item for the whole team, because lower WIP always means higher throughput.", false,
      "The slide's “WIP limit too low” board (In Progress (1)) shows idle people and work piling up. The goal is to optimize throughput, and a limit can be too low.",
      "Доска «лимит слишком низкий» (In Progress (1)) на слайде показывает простаивающих людей и копящуюся работу. Цель — оптимизировать пропускную способность, а лимит может быть слишком низким.",
      "“True” ignores the too-low board; less WIP shortens cycle time only while throughput stays the same.",
      "«Верно» игнорирует доску со слишком низким лимитом; меньше WIP сокращает время цикла, только пока пропускная способность не падает."),
    tfx("On a cumulative flow diagram, the vertical distance across the in-progress band shows the amount of work in progress.", true,
      "Vertical distance = queue length (units) = WIP; horizontal distance = queue duration = cycle time (B and A in the slide's figure).",
      "Вертикальное расстояние = длина очереди (штуки) = WIP; горизонтальное = длительность очереди = время цикла (B и A на рисунке слайда).",
      "“False” would swap the axes: it is the horizontal distance that shows cycle time.",
      "«Неверно» перепутало бы оси: время цикла показывает как раз горизонтальное расстояние."),
  ],
);

const p4 = part(
  "pm-l9-p4",
  { en: "Agile contracts and verifying value", ru: "Agile-контракты и проверка ценности" },
  {
    en: `## Agile contracting
- **Traditional vendor contracts based on formal specifications are problematic for agile projects.**
- **Use contracting models such as fixed-price work packages and graduated fixed-price contracts that are designed for an agile environment.**
- Why traditional contracts clash with agile: the specification is fixed when the least is known; every change becomes a change request with negotiation; acceptance means "matches the spec", even if the spec turned out to be wrong; supplier and customer become opponents instead of collaborators (the Agile Manifesto values "customer collaboration over contract negotiation").
## Agile constraints and contracts: the inverted triangle
- **The adaptability and scope flexibility of agile projects can create problems when defining acceptance criteria for contracts.** If the scope can change, what exactly does the customer accept?
- **The inverted triangle model attempts to fix time and cost and adjust scope to achieve the highest-priority, best-quality product possible within fixed constraints.**
| | Traditional (plan-driven) triangle | Agile inverted triangle |
|---|---|---|
| Fixed | **scope** (the specification) | **time and cost** (team, iterations, budget) |
| Estimated / variable | time and cost | **scope** — the highest-priority features that fit |
| When things change | change requests, renegotiation, overruns | the lowest-priority items fall below the cutoff |
| What the customer gets | everything specified — late or over budget if the estimates were wrong | the best-quality product with the highest-priority features, on time and on budget |
- This is the same logic as the relative priority list with a cutoff line in part 2.
## DSDM contract
- **Focuses on work being "fit for business purpose" and passing tests, rather than matching a specification.**
- **Example:** a contract for a ticketing system says the delivery is accepted when the agreed acceptance tests pass and the business confirms that it supports selling tickets online — not when every line of a 200-page specification is implemented.
## Money for nothing and change for free
| Clause | Slide definition | Example |
|---|---|---|
| **Change for free** | **Allows the customer to make changes at the end of an iteration if the total amount of contracted work doesn't change and the customer works with the team on every iteration** | after sprint 4 the customer swaps a 20-point "PDF export" story for a 20-point "Excel export" story — no extra charge |
| **Money for nothing** | **Allows the customer to terminate the project early if they feel there is not sufficient ROI in the backlog** | after sprint 7 of 10 the remaining stories bring little value; the customer stops the project and saves the cost of the remaining sprints |
- **Note (slide): these options can only be exercised if the requirements for active business user involvement have been met.** If the customer does not take part in every iteration, the free changes and the early exit are not available.
- Beyond the slides: in Jeff Sutherland's original version, early termination is usually paid with a fee — a share (often 20%) of the remaining contract value — so the supplier is protected too.
> Exam trap: "change for free" does **not** mean "add anything at no cost". The **total amount of contracted work must not change** (swap, don't add), and the customer must **work with the team on every iteration**.
## Graduated fixed-price contract
- **Both parties share some of the risk and reward associated with schedule variance.**
- The slide gives only this sentence. The textbook (Griffiths) illustrates it with a graduated hourly rate (beyond the slides):
| Project completion | Graduated rate | Hours | Total fee |
|---|---|---|---|
| Finish early | 110 USD/hour | 900 | 99,000 USD |
| Finish on time | 100 USD/hour | 1,000 | 100,000 USD |
| Finish late | 90 USD/hour | 1,100 | 99,000 USD |
= Early: 900 x 110 = 99,000
= On time: 1,000 x 100 = 100,000
= Late: 1,100 x 90 = 99,000
- **Finish early:** the supplier earns more per hour (the reward), and the customer gets the product sooner and pays slightly less in total.
- **Finish late:** the supplier gets a lower rate for the extra hours (it shares the risk), and the customer pays about the same total but receives the product later.
- So neither side carries all of the schedule risk, and both are motivated to finish early.
## Fixed-price work packages
- **Mitigate the risks of under- or overestimating work by reducing the scope and costs involved** — the work is split into small packages, each estimated and priced separately.
- **Allows the customer to reprioritize remaining work, based on evolving costs** — after each package the remaining packages can be re-estimated and reordered.
- **Example:** an e-commerce rebuild is split into packages: catalog (40,000), cart (25,000), payments (30,000). After the catalog, the supplier re-estimates payments at 45,000 because of a bank's new API. The customer decides to move the loyalty program ahead and to simplify payments.
- An estimating error now affects one small package, not the whole project.
## Customized contracts
- **Piece together different types of agile contracts to create a customized contract that best matches the needs of the buyer and the seller.**
- **Example:** fixed-price work packages for the well-understood parts + a graduated rate for the risky integration + a "money for nothing" exit clause.
**Contracts at a glance:**
| Contract | Key idea (slide) | Remember it by |
|---|---|---|
| Traditional, spec-based | matching a formal specification | problematic for agile |
| DSDM contract | "fit for business purpose" and passing tests | tests, not the spec |
| Change for free | changes at the end of an iteration, total work unchanged, customer in every iteration | swap, don't add |
| Money for nothing | early termination if there is not enough ROI in the backlog | stop when value runs out |
| Graduated fixed-price | shared risk and reward of schedule variance | higher rate early, lower rate late |
| Fixed-price work packages | small priced packages; reprioritize based on evolving costs | estimating errors stay small |
| Customized | a mix of agile contract types | fits buyer and seller |
## Verifying and validating value
- **The intangible nature of agile projects emphasizes the importance of the sponsor, user, and/or product owner validating what is being built.** Software cannot be touched until it works, so misunderstandings stay invisible until someone sees the product.
- **The slide's picture, "Gulf of evaluation",** has four panels:
| Panel | Picture |
|---|---|
| How the customer explained it | a sailboat with sails |
| How the ScrumMaster understood it | a rowboat with oars |
| How the developers built it | a sailboat crowded with extra fans and propellers |
| What the customer really needed | a simple sailboat with one sail |
- The **gulf of evaluation** is the gap between what was asked, understood, built and actually needed. The only way to close it is to show a working product early and often to the people who know the need.
- Beyond the slides: **verification** = "are we building the product right?" (does it meet the specification and standards?); **validation** = "are we building the right product?" (does it meet the real need?).
## Frequent verification and validation
- **Uses regular testing, checkpoints, and reviews to address problems before they get bigger.**
- **Checks to make sure things are working and progressing as they should.**
- **Looks for mismatches in expectations.**
- **Enables the project to rapidly converge on the real solution.**
**The slide's figure, "Frequent verification and validation in XP",** shows nested feedback loops — the shorter the loop, the sooner a problem is caught:
| XP practice | Feedback loop |
|---|---|
| Pair programming | seconds |
| Unit test | minutes |
| Customer collaboration | hours |
| Stand-up meeting | one day |
| Acceptance test | days |
| Iteration demo | weeks |
| Release | months |
## Testing and verification in software development
- **Automate as many tests as possible to remove the human element from execution and allow tests to be run more frequently and at a lower cost.**
- **Find issues as soon as possible and keep them low on the cost of change curve.** (The slide has a typo: "keep they low".)
- **The cost of change curve:** the later a defect is found, the more it costs to fix. A mistake in a requirement costs minutes to fix during refinement; the same mistake found in production may need a hotfix, a data repair and apologies to customers.
- **Example:** a team runs 1,500 automated tests on every commit in 6 minutes. By hand they would take two testers a week — so manually they would run once per release, automatically they run dozens of times a day.
## Exploratory and usability testing
| | Exploratory testing | Usability testing |
|---|---|---|
| Slide definition | **relies on the tester's autonomy, skill, and creativity in trying to discover issues and unexpected behavior** | **aims to diagnose how easy it is to use the system and help uncover problems and areas for redesign or change** |
| Who | an experienced tester | real or representative users, observed by the team |
| Finds | bugs and unexpected behavior that scripted tests miss | confusing screens, slow paths, places to redesign |
| Example | a tester tries an emoji in a name field, a refund on a cancelled order, two tabs at once | five users try to buy a train ticket while the team watches where they hesitate |
## Continuous integration (CI)
- **A practice used by software developers to frequently incorporate new and changed code into their project code repository.**
- **Components of a continuous integration system include:**
| Component | Role | Example |
|---|---|---|
| **Source code control system** | stores the code and its history | Git (GitHub, GitLab) |
| **Build tools** | compile and package the code | Maven, Gradle, npm |
| **Test tools** | run the automated tests on every build | JUnit, pytest, Jest |
| **Scheduler or trigger** | starts a build on a schedule or on every commit | a trigger on each push, a nightly build |
| **Notifications** | tell the team when a build or a test fails | e-mail, a Slack message, a red light on a screen |
- Integrating often means each merge is small, so conflicts and broken builds are found within minutes, not at the end of the project.
## Test-driven development (TDD)
- **Employs short test and feedback cycles.**
- **Tests should be written before the code is written.**
- **Red, Green, Refactor — the process of:** 1) **writing a test that initially fails** (red); 2) **adding code until the test passes** (green); 3) **refactoring the code** (improving its design while all tests stay green).
@diagram pm9-tdd
| Step | What the developer does | Delivery-fee example |
|---|---|---|
| **Red** | write a test for behaviour that does not exist yet; it fails | test: an order over 10,000 KZT gets free delivery — it fails, because the function always returns 500 |
| **Green** | write the simplest code that makes the test pass | add "if total > 10,000 return 0" — the test passes |
| **Refactor** | clean up the code without changing its behaviour; tests stay green | move 10,000 into a named constant FREE_DELIVERY_FROM; all tests still pass |
> Exam trap: in TDD the test comes **first** and **must fail first** (red). A test written after the code, or a test that passes immediately, does not prove that the new code does anything. Refactoring is the **third** step, not the first.
## Acceptance test-driven development (ATDD)
- **Moves the testing focus from the code to the business requirement.**
- **Four stages:**
| Stage | Slide wording | Example: free delivery |
|---|---|---|
| **1. Discuss** | **Discuss the requirements** | the product owner, a developer and a tester talk through the rule and its edge cases (exactly 10,000? promo codes?) |
| **2. Distill** | **Distill tests in a framework-friendly format** | "Given a cart of 10,001 KZT, when I check out, then delivery costs 0" — written so that a tool (e.g. Cucumber) can run it |
| **3. Develop** | **Develop the code and hook up the tests** | developers write the code (often with TDD inside) and connect the acceptance tests to it |
| **4. Demo** | **Demo** | the team shows the working feature with the passing acceptance tests to the stakeholders |
> Memory hook: the four Ds — **Discuss, Distill, Develop, Demo**.
| | TDD | ATDD |
|---|---|---|
| Focus | the code (unit level) | the business requirement |
| Who writes the tests | developers | the customer or product owner, developers and testers together |
| Process | red, green, refactor | discuss, distill, develop, demo |
## Exam focus
- Traditional spec-based contracts are problematic; use fixed-price work packages and graduated fixed-price contracts.
- Inverted triangle: **fix time and cost, adjust scope**.
- DSDM contract: **"fit for business purpose"** and **passing tests**, not matching a specification.
- Change for free: changes at the end of an iteration, **total contracted work unchanged**, the customer works with the team **every iteration**. Money for nothing: **terminate early** when there is **not sufficient ROI in the backlog**. Both need **active business user involvement**.
- Graduated fixed-price: **shared risk and reward of schedule variance**. Fixed-price work packages: smaller scope and cost per package; **reprioritize based on evolving costs**. Customized: a mix.
- Gulf of evaluation: explained / understood / built / really needed — the sponsor, user or product owner must validate.
- Frequent V&V: regular testing, checkpoints and reviews; mismatches in expectations; converge on the real solution.
- Automate tests; find issues early, low on the **cost of change curve**. Exploratory = the tester's autonomy, skill, creativity; usability = how easy the system is to use.
- CI components (5): source code control system, build tools, test tools, scheduler or trigger, notifications.
- TDD: test before code; **red, green, refactor**. ATDD: focus on the **business requirement**; **discuss, distill, develop, demo**.
?? A customer under a "change for free" clause wants to add three new stories at the end of sprint 5 without removing anything. Is this covered?
?= No. Change for free allows changes only if the total amount of contracted work doesn't change (swap, not add) and the customer works with the team on every iteration. Adding work needs a contract change.
?? In the textbook's graduated fixed-price example, the supplier finishes late, using 1,100 hours. What is the fee, and who carries the risk?
?= 1,100 x 90 = 99,000 USD. The supplier worked more hours for a lower rate, and the customer got the product late — both share the cost of the schedule slip.
?? A developer writes a unit test for a new discount rule, and it passes immediately, before any code is written. What does this mean in TDD terms?
?= The red step did not happen: a new test must fail first. Either the behaviour already exists or the test is wrong (it does not test the new rule), so the test should be fixed before any code is written.`,
    ru: `## Agile-контракты (agile contracting)
- **Традиционные контракты с поставщиком, основанные на формальных спецификациях (formal specifications), проблематичны для agile-проектов.**
- **Используйте модели контрактов, рассчитанные на agile-среду, например пакеты работ с фиксированной ценой (fixed-price work packages) и ступенчатые контракты с фиксированной ценой (graduated fixed-price contracts).**
- Почему традиционные контракты конфликтуют с agile: спецификацию фиксируют, когда известно меньше всего; каждое изменение превращается в запрос на изменение с переговорами; приёмка означает «соответствует спецификации», даже если спецификация оказалась неверной; поставщик и заказчик становятся противниками, а не партнёрами (Agile Manifesto ценит «сотрудничество с заказчиком выше согласования условий контракта»).
## Ограничения agile и контракты: перевёрнутый треугольник (inverted triangle)
- **Гибкость и изменчивость объёма agile-проектов (adaptability and scope flexibility) могут создавать проблемы при определении критериев приёмки в контрактах.** Если объём может меняться, что именно принимает заказчик?
- **Модель перевёрнутого треугольника стремится зафиксировать время и стоимость и подстраивать объём (fix time and cost and adjust scope), чтобы получить продукт наивысшего приоритета и наилучшего качества в рамках фиксированных ограничений.**
| | Традиционный (плановый) треугольник | Перевёрнутый agile-треугольник |
|---|---|---|
| Фиксировано | **объём** (спецификация) | **время и стоимость** (команда, итерации, бюджет) |
| Оценивается / меняется | время и стоимость | **объём** — самые приоритетные функции, которые помещаются |
| Когда что-то меняется | запросы на изменения, пересогласование, перерасход | наименее приоритетные элементы уходят под черту отсечения |
| Что получает заказчик | всё, что записано, — с опозданием или перерасходом, если оценки были неверны | продукт наилучшего качества с самыми приоритетными функциями — в срок и в бюджет |
- Это та же логика, что у относительного списка приоритетов с чертой отсечения из части 2.
## Контракт DSDM (DSDM contract)
- **Сосредоточен на том, чтобы работа была «пригодна для бизнес-цели» (fit for business purpose) и проходила тесты, а не соответствовала спецификации.**
- **Пример:** в контракте на систему продажи билетов сказано, что поставка принята, когда проходят согласованные приёмочные тесты и бизнес подтверждает, что система позволяет продавать билеты онлайн, — а не когда реализована каждая строчка 200-страничной спецификации.
## «Деньги ни за что» и «изменения бесплатно» (money for nothing and change for free)
| Условие | Определение со слайда | Пример |
|---|---|---|
| **Изменения бесплатно (change for free)** | **Позволяет заказчику вносить изменения в конце итерации, если общий объём законтрактованной работы не меняется и заказчик работает с командой в каждой итерации** | после 4-го спринта заказчик меняет историю «экспорт в PDF» на 20 поинтов на историю «экспорт в Excel» на 20 поинтов — без доплаты |
| **Деньги ни за что (money for nothing)** | **Позволяет заказчику досрочно прекратить проект, если он считает, что в бэклоге недостаточно ROI (not sufficient ROI in the backlog)** | после 7-го спринта из 10 оставшиеся истории дают мало ценности; заказчик останавливает проект и экономит на оставшихся спринтах |
- **Примечание (слайд): этими опциями можно воспользоваться, только если выполнены требования к активному участию бизнес-пользователей (active business user involvement).** Если заказчик не участвует в каждой итерации, бесплатные изменения и досрочный выход недоступны.
- За пределами слайдов: в исходной версии Джеффа Сазерленда за досрочное прекращение обычно платят — долю (часто 20%) от оставшейся суммы контракта, так что поставщик тоже защищён.
> Ловушка экзамена: «change for free» **не** значит «добавляй что угодно бесплатно». **Общий объём законтрактованной работы не должен меняться** (заменить, а не добавить), и заказчик должен **работать с командой в каждой итерации**.
## Ступенчатый контракт с фиксированной ценой (graduated fixed-price contract)
- **Обе стороны разделяют часть риска и выгоды, связанных с отклонением по срокам (schedule variance).**
- На слайде только эта фраза. В учебнике (Griffiths) это показано на ступенчатой почасовой ставке (за пределами слайдов):
| Завершение проекта | Ступенчатая ставка | Часы | Итоговая оплата |
|---|---|---|---|
| Раньше срока | 110 USD/час | 900 | 99 000 USD |
| В срок | 100 USD/час | 1 000 | 100 000 USD |
| Позже срока | 90 USD/час | 1 100 | 99 000 USD |
= Early: 900 x 110 = 99,000
= On time: 1,000 x 100 = 100,000
= Late: 1,100 x 90 = 99,000
- **Раньше срока:** поставщик получает больше за час (выгода), а заказчик получает продукт раньше и платит в сумме чуть меньше.
- **Позже срока:** поставщик получает меньшую ставку за лишние часы (разделяет риск), а заказчик платит примерно ту же сумму, но получает продукт позже.
- Так ни одна сторона не несёт весь риск по срокам, и обе заинтересованы закончить раньше.
## Пакеты работ с фиксированной ценой (fixed-price work packages)
- **Снижают риск недооценки или переоценки работы, уменьшая объём и затраты, о которых идёт речь (reducing the scope and costs involved)** — работу делят на небольшие пакеты, каждый оценивают и оценивают в деньгах отдельно.
- **Позволяют заказчику переприоритизировать оставшуюся работу с учётом меняющихся затрат (based on evolving costs)** — после каждого пакета оставшиеся можно переоценить и переупорядочить.
- **Пример:** переделку интернет-магазина делят на пакеты: каталог (40 000), корзина (25 000), платежи (30 000). После каталога поставщик переоценивает платежи в 45 000 из-за нового API банка. Заказчик решает поднять программу лояльности выше, а платежи упростить.
- Ошибка оценки теперь задевает один небольшой пакет, а не весь проект.
## Индивидуальные контракты (customized contracts)
- **Соберите вместе разные типы agile-контрактов, чтобы получить индивидуальный контракт, который лучше всего отвечает нуждам покупателя и продавца.**
- **Пример:** пакеты работ с фиксированной ценой для хорошо понятных частей + ступенчатая ставка для рискованной интеграции + условие досрочного выхода «money for nothing».
**Контракты одним взглядом:**
| Контракт | Главная идея (слайд) | Как запомнить |
|---|---|---|
| Традиционный, по спецификации | соответствие формальной спецификации | проблематичен для agile |
| Контракт DSDM | «fit for business purpose» и прохождение тестов | тесты, а не спецификация |
| Change for free | изменения в конце итерации, объём работы тот же, заказчик в каждой итерации | заменить, а не добавить |
| Money for nothing | досрочное прекращение, если в бэклоге мало ROI | стоп, когда ценность кончилась |
| Graduated fixed-price | общие риск и выгода от отклонения по срокам | раньше — ставка выше, позже — ниже |
| Fixed-price work packages | небольшие пакеты с ценой; переприоритизация по меняющимся затратам | ошибки оценки остаются маленькими |
| Customized | сочетание типов agile-контрактов | подходит и покупателю, и продавцу |
## Проверка ценности: верификация и валидация (verifying and validating value)
- **Нематериальная природа agile-проектов (intangible nature) подчёркивает, как важно, чтобы спонсор, пользователь и/или владелец продукта проверяли то, что создаётся.** Программу нельзя потрогать, пока она не заработает, поэтому недопонимание остаётся невидимым, пока кто-то не увидит продукт.
- **Рисунок слайда «Gulf of evaluation» (разрыв в оценке)** состоит из четырёх картинок:
| Картинка | Что нарисовано |
|---|---|
| Как заказчик объяснил (how the customer explained it) | парусная лодка |
| Как ScrumMaster понял (how the ScrumMaster understood it) | гребная лодка с вёслами |
| Как разработчики сделали (how the developers built it) | парусник, увешанный лишними вентиляторами и пропеллерами |
| Что заказчику было нужно на самом деле (what the customer really needed) | простой парусник с одним парусом |
- **Разрыв в оценке (gulf of evaluation)** — расхождение между тем, что попросили, поняли, сделали и что было нужно на самом деле. Закрыть его можно только одним способом: рано и часто показывать работающий продукт тем, кто знает потребность.
- За пределами слайдов: **верификация (verification)** — «правильно ли мы делаем продукт?» (соответствует ли он спецификации и стандартам); **валидация (validation)** — «тот ли продукт мы делаем?» (отвечает ли он реальной потребности).
## Частая верификация и валидация (frequent verification and validation)
- **Использует регулярное тестирование, контрольные точки и обзоры (testing, checkpoints, and reviews), чтобы решать проблемы, пока они не выросли.**
- **Проверяет, что всё работает и продвигается так, как должно.**
- **Ищет расхождения в ожиданиях (mismatches in expectations).**
- **Позволяет проекту быстро сойтись на настоящем решении (rapidly converge on the real solution).**
**Рисунок слайда «Frequent verification and validation in XP»** показывает вложенные петли обратной связи — чем короче петля, тем раньше ловится проблема:
| Практика XP | Петля обратной связи |
|---|---|
| Парное программирование (pair programming) | секунды |
| Модульный тест (unit test) | минуты |
| Сотрудничество с заказчиком (customer collaboration) | часы |
| Стендап (stand-up meeting) | один день |
| Приёмочный тест (acceptance test) | дни |
| Демонстрация итерации (iteration demo) | недели |
| Релиз (release) | месяцы |
## Тестирование и верификация в разработке ПО
- **Автоматизируйте как можно больше тестов, чтобы убрать человеческий фактор из выполнения (remove the human element from execution) и запускать тесты чаще и дешевле.**
- **Находите проблемы как можно раньше и держите их внизу кривой стоимости изменений (cost of change curve).** (На слайде опечатка: «keep they low».)
- **Кривая стоимости изменений:** чем позже найден дефект, тем дороже его исправить. Ошибку в требовании на уточнении бэклога исправляют за минуты; та же ошибка, найденная в продакшене, может потребовать срочного исправления, починки данных и извинений перед клиентами.
- **Пример:** команда запускает 1 500 автотестов на каждый коммит за 6 минут. Вручную двум тестировщикам на это нужна неделя — значит, вручную тесты прогоняли бы раз за релиз, а автоматически — десятки раз в день.
## Исследовательское и юзабилити-тестирование (exploratory and usability testing)
| | Исследовательское тестирование (exploratory testing) | Юзабилити-тестирование (usability testing) |
|---|---|---|
| Определение со слайда | **опирается на самостоятельность, мастерство и творческий подход тестировщика (autonomy, skill, and creativity), который пытается найти проблемы и неожиданное поведение** | **стремится выяснить, насколько системой легко пользоваться, и помочь найти проблемы и места для переделки или изменения** |
| Кто | опытный тестировщик | реальные или типичные пользователи под наблюдением команды |
| Что находит | ошибки и неожиданное поведение, которые пропускают тесты по сценарию | запутанные экраны, долгие пути, места для редизайна |
| Пример | тестировщик вводит эмодзи в поле имени, оформляет возврат по отменённому заказу, открывает две вкладки сразу | пять пользователей пытаются купить билет на поезд, а команда смотрит, где они запинаются |
## Непрерывная интеграция (continuous integration, CI)
- **Практика, при которой разработчики часто добавляют новый и изменённый код в общий репозиторий проекта (project code repository).**
- **Компоненты системы непрерывной интеграции:**
| Компонент | Роль | Пример |
|---|---|---|
| **Система контроля версий (source code control system)** | хранит код и его историю | Git (GitHub, GitLab) |
| **Инструменты сборки (build tools)** | компилируют и упаковывают код | Maven, Gradle, npm |
| **Инструменты тестирования (test tools)** | запускают автотесты при каждой сборке | JUnit, pytest, Jest |
| **Планировщик или триггер (scheduler or trigger)** | запускает сборку по расписанию или на каждый коммит | триггер на каждый push, ночная сборка |
| **Уведомления (notifications)** | сообщают команде, когда сборка или тест упали | письмо, сообщение в Slack, красная лампа на экране |
- Частая интеграция означает, что каждое слияние небольшое, поэтому конфликты и сломанные сборки находят за минуты, а не в конце проекта.
## Разработка через тестирование (test-driven development, TDD)
- **Использует короткие циклы тестирования и обратной связи.**
- **Тесты нужно писать до того, как написан код.**
- **Red, Green, Refactor — «красный, зелёный, рефакторинг» — это процесс:** 1) **написать тест, который сначала падает** (красный); 2) **добавлять код, пока тест не пройдёт** (зелёный); 3) **провести рефакторинг кода** (улучшить его устройство, сохраняя все тесты зелёными).
@diagram pm9-tdd
| Шаг | Что делает разработчик | Пример: стоимость доставки |
|---|---|---|
| **Red — красный** | пишет тест на поведение, которого ещё нет; тест падает | тест: заказ дороже 10 000 тенге доставляется бесплатно — падает, потому что функция всегда возвращает 500 |
| **Green — зелёный** | пишет самый простой код, при котором тест проходит | добавляет «если сумма > 10 000, вернуть 0» — тест проходит |
| **Refactor — рефакторинг** | приводит код в порядок, не меняя поведения; тесты остаются зелёными | выносит 10 000 в именованную константу FREE_DELIVERY_FROM; все тесты по-прежнему проходят |
> Ловушка экзамена: в TDD тест пишется **первым** и **сначала обязан упасть** (красный). Тест, написанный после кода, или тест, который сразу проходит, не доказывает, что новый код что-то делает. Рефакторинг — **третий** шаг, а не первый.
## Разработка через приёмочное тестирование (acceptance test-driven development, ATDD)
- **Переносит фокус тестирования с кода на бизнес-требование (from the code to the business requirement).**
- **Четыре стадии:**
| Стадия | Формулировка слайда | Пример: бесплатная доставка |
|---|---|---|
| **1. Discuss — обсудить** | **Обсудить требования (discuss the requirements)** | владелец продукта, разработчик и тестировщик проговаривают правило и пограничные случаи (ровно 10 000? промокоды?) |
| **2. Distill — выделить** | **Выделить тесты в формате, удобном для фреймворка (distill tests in a framework-friendly format)** | «Дано: корзина на 10 001 тенге; когда я оформляю заказ, тогда доставка стоит 0» — записано так, чтобы инструмент (например, Cucumber) мог это запустить |
| **3. Develop — разработать** | **Написать код и подключить тесты (develop the code and hook up the tests)** | разработчики пишут код (часто с TDD внутри) и подключают к нему приёмочные тесты |
| **4. Demo — показать** | **Демонстрация (demo)** | команда показывает стейкхолдерам работающую функцию с проходящими приёмочными тестами |
> Запоминалка: четыре D — **Discuss, Distill, Develop, Demo**.
| | TDD | ATDD |
|---|---|---|
| Фокус | код (уровень модулей) | бизнес-требование |
| Кто пишет тесты | разработчики | заказчик или владелец продукта, разработчики и тестировщики вместе |
| Процесс | red, green, refactor | discuss, distill, develop, demo |
## Что спросят на экзамене
- Традиционные контракты по спецификации проблематичны; используйте fixed-price work packages и graduated fixed-price contracts.
- Перевёрнутый треугольник: **зафиксировать время и стоимость, подстраивать объём**.
- Контракт DSDM: **«fit for business purpose»** и **прохождение тестов**, а не соответствие спецификации.
- Change for free: изменения в конце итерации, **общий объём законтрактованной работы не меняется**, заказчик работает с командой **в каждой итерации**. Money for nothing: **досрочно прекратить**, если в бэклоге **недостаточно ROI**. Для обоих нужно **активное участие бизнес-пользователей**.
- Graduated fixed-price: **общие риск и выгода от отклонения по срокам**. Fixed-price work packages: меньше объём и стоимость на пакет; **переприоритизация по меняющимся затратам**. Customized: сочетание.
- Gulf of evaluation: объяснил / понял / сделал / было нужно — спонсор, пользователь или владелец продукта должны проверять.
- Частая верификация и валидация: регулярные тесты, контрольные точки, обзоры; расхождения в ожиданиях; быстро сойтись на настоящем решении.
- Автоматизировать тесты; находить проблемы рано, внизу **кривой стоимости изменений**. Exploratory — самостоятельность, мастерство, творчество тестировщика; usability — насколько системой легко пользоваться.
- Компоненты CI (5): система контроля версий, инструменты сборки, инструменты тестирования, планировщик или триггер, уведомления.
- TDD: тест до кода; **red, green, refactor**. ATDD: фокус на **бизнес-требовании**; **discuss, distill, develop, demo**.
?? Заказчик по условию «change for free» хочет в конце 5-го спринта добавить три новые истории, ничего не убирая. Покрывает ли это условие такой случай?
?= Нет. Change for free разрешает изменения, только если общий объём законтрактованной работы не меняется (заменить, а не добавить) и заказчик работает с командой в каждой итерации. Чтобы добавить работу, нужно менять контракт.
?? В учебном примере graduated fixed-price поставщик заканчивает с опозданием, потратив 1 100 часов. Какова оплата и кто несёт риск?
?= 1 100 x 90 = 99 000 USD. Поставщик отработал больше часов по меньшей ставке, а заказчик получил продукт позже — оба разделяют цену сдвига сроков.
?? Разработчик пишет модульный тест для нового правила скидки, и тест сразу проходит — ещё до того, как написан код. Что это значит с точки зрения TDD?
?= Красного шага не было: новый тест сначала должен упасть. Либо такое поведение уже есть, либо тест неверный (не проверяет новое правило), поэтому тест нужно исправить до того, как писать код.`,
  },
  [
    qx("Why are traditional vendor contracts problematic for agile projects, according to the slide?", "They are based on formal specifications fixed up front", [
      ["They do not allow any payment until the project ends", "Payment terms are not the slide's point; the problem is the formal specification as the basis.", "Условия оплаты — не мысль слайда; проблема в формальной спецификации как основе контракта."],
      ["They require the vendor to use high-tech planning tools", "Tooling is a separate topic; contracts are problematic because of fixed specifications.", "Инструменты — отдельная тема; контракты проблемны из-за фиксированных спецификаций."],
      ["They make the product owner legally responsible for quality", "Nothing on the slide assigns legal responsibility to the product owner.", "Ничего на слайде не возлагает на владельца продукта юридическую ответственность."],
    ], "Slide: traditional vendor contracts based on formal specifications are problematic for agile projects; use models designed for an agile environment, such as fixed-price work packages and graduated fixed-price contracts.", "Слайд: традиционные контракты на основе формальных спецификаций проблематичны для agile; используйте модели для agile-среды — fixed-price work packages и graduated fixed-price contracts."),
    qx("What does the inverted triangle model fix, and what does it adjust?", "It fixes time and cost and adjusts scope", [
      ["It fixes scope and adjusts time and cost", "That is the traditional triangle, the one the agile model turns upside down.", "Это традиционный треугольник — тот, который agile-модель переворачивает."],
      ["It fixes scope and cost and adjusts time", "Scope is the variable in the inverted triangle, not a fixed constraint.", "В перевёрнутом треугольнике объём — переменная, а не фиксированное ограничение."],
      ["It fixes quality and time and adjusts cost", "Cost is fixed together with time; scope is what is adjusted.", "Стоимость фиксируют вместе со временем; подстраивают объём."],
    ], "Slide: the inverted triangle model attempts to fix time and cost and adjust scope to achieve the highest-priority, best-quality product possible within fixed constraints.", "Слайд: перевёрнутый треугольник фиксирует время и стоимость и подстраивает объём, чтобы получить продукт наивысшего приоритета и наилучшего качества в рамках фиксированных ограничений."),
    qx("What does a DSDM contract focus on, rather than matching a specification?", "Work being fit for business purpose and passing tests", [
      ["Work being delivered exactly on the date written in the plan", "Dates matter, but the DSDM contract's acceptance basis is business fitness and tests.", "Сроки важны, но основа приёмки в контракте DSDM — пригодность для бизнеса и тесты."],
      ["Work being done by the hours stated in the estimate", "Hours describe effort, not whether the result is fit for purpose.", "Часы описывают трудозатраты, а не пригодность результата."],
      ["Work being approved by the vendor's own quality team", "Approval by the supplier is not the customer's acceptance; the contract looks at business purpose.", "Одобрение поставщика — не приёмка заказчиком; контракт смотрит на бизнес-цель."],
    ], "Slide: a DSDM contract focuses on work being “fit for business purpose” and passing tests, rather than matching a specification.", "Слайд: контракт DSDM сосредоточен на том, чтобы работа была «пригодна для бизнес-цели» и проходила тесты, а не соответствовала спецификации."),
    qx("Under a “change for free” clause, which condition must hold for the customer to make changes at the end of an iteration?", "The total amount of contracted work does not change", [
      ["The customer pays a fee for every changed story", "The point of the clause is that such changes are free.", "Смысл условия как раз в том, что такие изменения бесплатны."],
      ["The supplier agrees to extend the final deadline", "Change for free swaps work inside the same total; no deadline extension is involved.", "Change for free меняет работу внутри того же объёма; продление срока здесь ни при чём."],
      ["The change request is filed before the iteration starts", "Changes are made at the end of an iteration, not by a formal change request in advance.", "Изменения вносят в конце итерации, а не заранее через формальный запрос на изменение."],
    ], "Slide: change for free allows changes at the end of an iteration if the total amount of contracted work doesn't change and the customer works with the team on every iteration.", "Слайд: change for free разрешает изменения в конце итерации, если общий объём законтрактованной работы не меняется и заказчик работает с командой в каждой итерации."),
    qx("After sprint 7 of 10, a customer sees that the remaining backlog holds too little value. Which contract clause lets them end the project early?", "Money for nothing", [
      ["Change for free", "Change for free swaps work within the same total; it does not end the project.", "Change for free меняет работу внутри того же объёма, а не прекращает проект."],
      ["Graduated fixed-price", "Graduated fixed-price shares schedule-variance risk; it has no early-exit option.", "Graduated fixed-price разделяет риск отклонения по срокам; досрочного выхода в нём нет."],
      ["Fixed-price work packages", "Work packages allow reprioritizing on evolving costs, not terminating for low ROI.", "Пакеты работ позволяют переприоритизировать по меняющимся затратам, а не прекращать проект из-за низкого ROI."],
    ], "Slide: money for nothing allows the customer to terminate the project early if they feel there is not sufficient ROI in the backlog.", "Слайд: money for nothing позволяет заказчику досрочно прекратить проект, если он считает, что в бэклоге недостаточно ROI."),
    qx("What condition does the slide set for exercising the “money for nothing” and “change for free” options?", "Requirements for active business user involvement are met", [
      ["The supplier has reached a CPI of at least 1.0 on the work", "EVM indices are not a condition of these clauses.", "Индексы EVM не являются условием этих опций."],
      ["The project has passed its regulatory compliance audit", "Compliance is a separate topic and not a condition here.", "Регуляторные требования — отдельная тема, здесь это не условие."],
      ["The contract has been converted to a time-and-materials one", "No change of contract type is required; the condition is user involvement.", "Менять тип контракта не нужно; условие — участие пользователей."],
    ], "Slide note: these options can only be exercised if the requirements for active business user involvement have been met.", "Примечание на слайде: этими опциями можно воспользоваться, только если выполнены требования к активному участию бизнес-пользователей."),
    qx("What is the key idea of a graduated fixed-price contract?", "Both parties share some risk and reward of schedule variance", [
      ["The customer may end the project when backlog ROI is too low", "That is money for nothing.", "Это money for nothing."],
      ["Work is split into small packages that are priced separately", "That is fixed-price work packages.", "Это fixed-price work packages."],
      ["Acceptance depends on fitness for business purpose and tests", "That is the DSDM contract.", "Это контракт DSDM."],
    ], "Slide: in a graduated fixed-price contract, both parties share some of the risk and reward associated with schedule variance.", "Слайд: в graduated fixed-price contract обе стороны разделяют часть риска и выгоды, связанных с отклонением по срокам."),
    qx("A graduated fixed-price contract for a planned 1,000 hours pays $110/hour if the supplier finishes early, $100/hour on time and $90/hour if late. The supplier finishes early, using 900 hours. What is the total fee?", "$99,000", [
      ["$90,000", "That uses the on-time rate (900 × 100); finishing early earns the higher rate.", "Здесь взята ставка «в срок» (900 × 100); за досрочное завершение платят по более высокой ставке."],
      ["$81,000", "That uses the late rate (900 × 90).", "Здесь взята ставка «с опозданием» (900 × 90)."],
      ["$100,000", "That is the on-time fee (1,000 × 100), not the early one.", "Это оплата «в срок» (1 000 × 100), а не досрочная."],
    ], "Early completion: 900 hours × $110 = $99,000. The supplier earns more per hour; the customer gets the product early and pays slightly less than the on-time $100,000.", "Досрочно: 900 часов × 110 = 99 000 USD. Поставщик получает больше за час, заказчик — продукт раньше и платит чуть меньше 100 000 «в срок»."),
    qx("Which statement describes fixed-price work packages?", "The customer can reprioritize remaining work based on evolving costs", [
      ["The customer may terminate the project early if the backlog lacks ROI", "That is money for nothing.", "Это money for nothing."],
      ["Rates rise when the supplier finishes ahead of schedule", "That is the graduated fixed-price contract.", "Это graduated fixed-price contract."],
      ["Acceptance is based on business fitness, not on a spec", "That is the DSDM contract.", "Это контракт DSDM."],
    ], "Slide: fixed-price work packages mitigate the risks of under- or overestimating work by reducing the scope and costs involved, and allow the customer to reprioritize remaining work based on evolving costs.", "Слайд: fixed-price work packages снижают риск недооценки или переоценки, уменьшая объём и затраты, и позволяют заказчику переприоритизировать оставшуюся работу по меняющимся затратам."),
    qx("A buyer combines fixed-price work packages for well-known features, a graduated rate for a risky integration and an early-exit clause. What is this called?", "A customized contract", [
      ["A DSDM contract", "A DSDM contract is about fitness for business purpose and tests, not a mix of models.", "Контракт DSDM — о пригодности для бизнеса и тестах, а не о смеси моделей."],
      ["A graduated fixed-price contract", "The graduated rate is only one piece of this mix.", "Ступенчатая ставка — лишь одна часть этой смеси."],
      ["A change-for-free contract", "Change for free is a clause about swapping work, not a combination of models.", "Change for free — условие о замене работы, а не сочетание моделей."],
    ], "Slide: piece together different types of agile contracts to create a customized contract that best matches the needs of the buyer and the seller.", "Слайд: соберите разные типы agile-контрактов в индивидуальный контракт, который лучше всего отвечает нуждам покупателя и продавца."),
    qx("The slide's cartoon shows how the customer explained it, how the ScrumMaster understood it, how the developers built it and what the customer really needed. What lesson does it support?", "The sponsor, user or product owner must validate what is built", [
      ["Developers should follow the written specification more strictly", "The cartoon shows that the explanation itself already differed from the real need; stricter spec-following would not help.", "Картинка показывает, что уже само объяснение расходилось с реальной потребностью; строже следовать спецификации не поможет."],
      ["The ScrumMaster should approve every design before coding", "The slide names the sponsor, user and/or product owner as validators, not the ScrumMaster.", "Слайд называет проверяющими спонсора, пользователя и/или владельца продукта, а не ScrumMaster."],
      ["Customers rarely know what they need, so their input is optional", "The opposite: the gap is closed by more customer validation, not less.", "Наоборот: разрыв закрывают большим участием заказчика в проверке, а не меньшим."],
    ], "Gulf of evaluation: because agile work is intangible, the sponsor, user and/or product owner must validate what is being built — early and often.", "Gulf of evaluation: поскольку результат agile-работы нематериален, спонсор, пользователь и/или владелец продукта должны проверять то, что создаётся, — рано и часто."),
    qx("Which is NOT one of the purposes of frequent verification and validation listed on the slide?", "Freezing requirements after validation", [
      ["Addressing problems before they get bigger", "On the slide: regular testing, checkpoints and reviews address problems before they get bigger.", "Есть на слайде: регулярные тесты, контрольные точки и обзоры решают проблемы, пока они не выросли."],
      ["Looking for mismatches in expectations", "On the slide word for word.", "Есть на слайде дословно."],
      ["Converging rapidly on the real solution", "On the slide: it enables the project to rapidly converge on the real solution.", "Есть на слайде: позволяет проекту быстро сойтись на настоящем решении."],
    ], "Frequent V&V addresses problems early, checks progress, looks for mismatches in expectations and helps converge on the real solution. Freezing requirements contradicts agile adaptation.", "Частая верификация и валидация решает проблемы рано, проверяет ход работы, ищет расхождения в ожиданиях и помогает сойтись на настоящем решении. Заморозка требований противоречит адаптации в agile."),
    qx("What does “keep issues low on the cost of change curve” mean?", "Find defects early, when they are still cheap to fix", [
      ["Spend as little money as possible on automated testing tools", "The slide recommends automating as many tests as possible; it is about when defects are found, not tool budgets.", "Слайд советует автоматизировать как можно больше тестов; речь о том, когда находят дефекты, а не о бюджете на инструменты."],
      ["Accept as few change requests as possible", "The curve is about the cost of fixing issues over time, not about refusing changes.", "Кривая — о стоимости исправления проблем со временем, а не об отказе от изменений."],
      ["Fix only the defects that customers report", "Waiting for customer reports means finding defects late — high on the curve.", "Ждать жалоб клиентов — значит находить дефекты поздно, высоко на кривой."],
    ], "The cost of fixing an issue rises the later it is found. Finding issues as soon as possible keeps them low on the cost of change curve.", "Стоимость исправления растёт, чем позже найдена проблема. Находя проблемы как можно раньше, их держат внизу кривой стоимости изменений."),
    qx("Five representative users try to buy a train ticket in a new app while the team watches where they hesitate. Which type of testing is this?", "Usability testing", [
      ["Exploratory testing", "Exploratory testing relies on a skilled tester's autonomy and creativity to find bugs, not on observing users.", "Исследовательское тестирование опирается на самостоятельность и творчество опытного тестировщика, а не на наблюдение за пользователями."],
      ["Unit testing", "Unit tests check small pieces of code automatically; no users are involved.", "Модульные тесты автоматически проверяют маленькие части кода; пользователей в них нет."],
      ["Acceptance test-driven development", "ATDD turns business requirements into tests before coding; it is not an observation session.", "ATDD превращает бизнес-требования в тесты до написания кода; это не сеанс наблюдения."],
    ], "Usability testing aims to diagnose how easy the system is to use and to uncover problems and areas for redesign or change.", "Юзабилити-тестирование выясняет, насколько системой легко пользоваться, и помогает найти проблемы и места для переделки или изменения."),
    qx("Which is NOT one of the components of a continuous integration system listed on the slide?", "Burndown chart", [
      ["Scheduler or trigger", "On the list: it starts builds on a schedule or on each commit.", "Есть в списке: запускает сборки по расписанию или на каждый коммит."],
      ["Source code control system", "On the list: it is the repository the code is integrated into.", "Есть в списке: это репозиторий, в который интегрируют код."],
      ["Notifications", "On the list: they tell the team when a build or test fails.", "Есть в списке: сообщают команде, когда сборка или тест упали."],
    ], "CI components on the slide: source code control system, build tools, test tools, scheduler or trigger, notifications. A burndown chart is a progress chart, not part of CI.", "Компоненты CI на слайде: система контроля версий, инструменты сборки, инструменты тестирования, планировщик или триггер, уведомления. Burndown chart — диаграмма прогресса, а не часть CI."),
    qx("Which sequence describes the TDD cycle “red, green, refactor”?", "Write a failing test, add code until it passes, refactor", [
      ["Write the code, write a test that passes, then refactor", "In TDD tests are written before the code; a test written after the code skips the red step.", "В TDD тест пишут до кода; тест после кода пропускает красный шаг."],
      ["Refactor old code, write a failing test, add new code", "Refactoring is the third step, done once the test passes.", "Рефакторинг — третий шаг, после того как тест прошёл."],
      ["Write a passing test, break it, then fix the code", "The new test must fail first because the behaviour does not exist yet.", "Новый тест должен сначала падать, потому что поведения ещё нет."],
    ], "Slide: red, green, refactor — 1) writing a test that initially fails, 2) adding code until the test passes, 3) refactoring the code.", "Слайд: red, green, refactor — 1) написать тест, который сначала падает, 2) добавлять код, пока тест не пройдёт, 3) провести рефакторинг кода."),
    qx("Which list gives the four stages of ATDD in order?", "Discuss, distill, develop, demo", [
      ["Design, develop, deploy, demo", "Design and deploy are not ATDD stages; the first stage is discussing the requirements.", "Design и deploy — не стадии ATDD; первая стадия — обсуждение требований."],
      ["Discuss, develop, distill, deploy", "Tests are distilled before development, and the last stage is demo, not deploy.", "Тесты выделяют до разработки, а последняя стадия — demo, а не deploy."],
      ["Distill, discuss, demo, develop", "Requirements are discussed first; demo is the last stage.", "Сначала обсуждают требования; demo — последняя стадия."],
    ], "Slide: ATDD has four stages — discuss the requirements, distill tests in a framework-friendly format, develop the code and hook up the tests, demo.", "Слайд: у ATDD четыре стадии — обсудить требования, выделить тесты в удобном для фреймворка формате, написать код и подключить тесты, показать."),
    qx("In ATDD, what happens in the “distill” stage?", "Tests are written in a framework-friendly format", [
      ["The requirements are discussed with the business", "That is the discuss stage, which comes first.", "Это стадия discuss — она идёт первой."],
      ["Code is written and hooked up to the tests", "That is the develop stage.", "Это стадия develop."],
      ["The working feature is shown to stakeholders", "That is the demo stage.", "Это стадия demo."],
    ], "Slide: distill tests in a framework-friendly format — e.g. Given/When/Then scenarios that a test tool can run.", "Слайд: выделить тесты в формате, удобном для фреймворка, — например, сценарии «Дано / Когда / Тогда», которые может запустить инструмент."),
    qx("What is the main difference in focus between TDD and ATDD?", "ATDD moves the testing focus from the code to the business requirement", [
      ["ATDD writes its tests after the code, while TDD writes them before the code", "Both write tests before the code; ATDD's tests are distilled before development.", "Оба подхода пишут тесты до кода; в ATDD тесты выделяют до разработки."],
      ["ATDD is done only by testers, while TDD is done only by product owners", "TDD is a developer practice; ATDD involves the business, developers and testers together.", "TDD — практика разработчиков; в ATDD участвуют бизнес, разработчики и тестировщики вместе."],
      ["ATDD skips refactoring, while TDD skips demos entirely", "This is not the distinction the slide draws; the difference is code vs business requirement.", "Слайд проводит не это различие; разница — код против бизнес-требования."],
    ], "Slide: ATDD moves the testing focus from the code to the business requirement; TDD works at the code level with red, green, refactor.", "Слайд: ATDD переносит фокус тестирования с кода на бизнес-требование; TDD работает на уровне кода через red, green, refactor."),
    tfx("In TDD, developers write the code first and then add tests to confirm that it works.", false,
      "Slide: tests should be written before the code is written — first a test that initially fails (red), then code until it passes (green), then refactoring.",
      "Слайд: тесты пишут до кода — сначала тест, который падает (красный), потом код, пока он не пройдёт (зелёный), затем рефакторинг.",
      "“True” describes ordinary test-after development, which TDD reverses.",
      "«Верно» описывает обычное тестирование после разработки, а TDD как раз меняет этот порядок."),
  ],
);

export const lecture9: Lecture = {
  id: "pm-l9",
  title: { en: "Lecture 9 — Value-Driven Delivery", ru: "Лекция 9 — Поставка ценности (Value-Driven Delivery)" },
  parts: [p1, p2, p3, p4],
};
