import type { Term, Text } from "../types";

const t = (term: string, en: string, ru: string): Term => ({ term, def: { en, ru } });

/**
 * Колода карточек «вопрос комиссии → ответ команды». Вопрос — по-английски,
 * как на защите; ответ — от первого лица («We …») и с цифрами из отчёта.
 * Часть карточек — неудобные вопросы о слабых местах с честными ответами.
 */
export const glossary: Term[] = [
  // Продукт
  t("What is YeahTrack, and what problem does it solve?",
    "We built YeahTrack so that a user can control a computer with hand gestures from an ordinary webcam. Instead of learning a fixed set of gestures, the user records their own and decides what each one does: change the volume, close a tab, open a website. Everything runs on the user's computer and no camera image is sent over the network, so it also works offline.",
    "Мы сделали YeahTrack, чтобы пользователь управлял компьютером жестами руки через обычную веб-камеру. Вместо того чтобы учить фиксированный набор жестов, он записывает свои и сам решает, что делает каждый: громкость, закрыть вкладку, открыть сайт. Всё работает на компьютере пользователя, изображение с камеры по сети не уходит, поэтому приложение работает и offline."),
  t("How does a hand gesture become a computer command?",
    "In our pipeline each frame passes six stages: a 1280 × 720 camera frame, 21 hand landmarks from MediaPipe, features that ignore tilt and distance, a k-nearest-neighbours classifier with k = 5 and a threshold per gesture, a voting window, and the command sent by the local bridge. A gesture fires only if it wins at least 70% of the frames in a 450 ms window. A new gesture is recorded in 20–30 seconds and the samples themselves are the model, so there is no separate training step.",
    "В нашем конвейере каждый кадр проходит шесть этапов: кадр камеры 1280 × 720, 21 точка руки от MediaPipe, признаки, не зависящие от наклона и расстояния, классификатор k-nearest neighbours с k = 5 и своим порогом для каждого жеста, окно голосования и команда, которую отправляет локальный bridge. Жест срабатывает, только если выигрывает не меньше 70% кадров в окне 450 мс. Новый жест записывается за 20–30 секунд, а сами образцы и есть модель, поэтому отдельного шага обучения нет."),
  t("What already works at the midterm, on 5 October?",
    "Our app tracks the hand in real time, recognises swipes in four directions, and lets the user record custom gestures and assign a command to each; several features were finished earlier than planned. The browser version is online at yeahtrack.site/app and acts only inside the web page, while the Linux desktop version controls the system. What remains is verification: accuracy on real users, the lighting study and user testing.",
    "Наше приложение отслеживает руку в реальном времени, распознаёт свайпы в четыре стороны и позволяет записывать свои жесты и назначать каждому команду; часть функций готова раньше плана. Браузерная версия работает на yeahtrack.site/app и действует только внутри веб-страницы, а desktop-версия для Linux управляет системой. Осталась проверка: точность на реальных людях, исследование освещения и тестирование с пользователями."),
  // Цель, подход, процессы
  t("What is your goal, and what are your three objectives?",
    "Our goal is to deliver, by 4 November 2026, a working application in which users train their own gestures and link them to computer commands. The objectives are at least 90% accuracy on user-trained gestures, adding a new gesture in under one minute, and testing with at least 30 users.",
    "Наша цель — к 4 ноября 2026 года выпустить работающее приложение, в котором пользователи обучают свои жесты и привязывают их к командам компьютера. Objectives: точность не ниже 90% на обученных пользователем жестах, добавление нового жеста меньше чем за минуту и тестирование минимум с 30 пользователями."),
  t("What exactly will you deliver on 4 November?",
    "We deliver a working desktop application for Linux (GNOME) and a browser version, a short user guide, and the test results together with the final presentation. Each deliverable has acceptance criteria and an accepting person in Table 10.",
    "Мы сдаём работающее desktop-приложение для Linux (GNOME) и браузерную версию, короткое руководство пользователя, результаты тестирования и финальную презентацию. У каждого deliverable есть acceptance criteria и тот, кто его принимает, — в Table 10."),
  t("Which management approach do you use, and why Agile plus PMBOK?",
    "We work iteratively on the principles of Scrum: we build a working version, review it as a team and plan the next steps from that review, which fits a timeline of about two months. The PMBOK Guide gives the overall structure of planning and control: the knowledge areas that make up our plan.",
    "Мы работаем итеративно по принципам Scrum: делаем работающую версию, разбираем её командой и по итогам планируем следующие шаги — это подходит к сроку примерно в два месяца. PMBOK Guide даёт общую структуру планирования и контроля — knowledge areas, из которых состоит наш план."),
  t("Where is the project now in terms of the five process groups?",
    "Initiation and Planning are done: M1, the project plan, was reached on 5 September. We are in Execution plus Monitoring and Controlling: check-ins, the weekly meeting, the change log, the risk register and the time log. Closing will be the final presentation, sponsor acceptance and the release of the team on 4 November.",
    "Initiation и Planning завершены: M1 (план проекта) достигнут 5 сентября. Сейчас мы в Execution и Monitoring and Controlling: check-in, еженедельная встреча, change log, risk register и time log. Closing — финальная презентация, sponsor acceptance и роспуск команды 4 ноября."),
  t("How will you know at the end that the project succeeded?",
    "We use Kerzner's four criteria: within time, by 4 November; within cost, the cash budget of 57 104 KZT and 300 hours; at the desired performance, meaning at least 90% accuracy, under one minute per gesture and 30 users; and accepted by the customer through sponsor acceptance in Section 19.",
    "Мы берём четыре критерия Kerzner: в срок — к 4 ноября; в бюджет — cash 57 104 KZT и 300 часов; с нужным качеством — точность не ниже 90%, меньше минуты на жест и 30 пользователей; и принято заказчиком — sponsor acceptance в Section 19."),
  t("Where is your project charter?",
    "Our report is a project management plan, not a separate charter. Section 19, Sponsor Acceptance, plays the role of the charter signature: by signing, the sponsor agrees with the scope, schedule, budget and its funding, the baselines and the approach. The signature block is still empty; we present the plan for approval at this midterm.",
    "Наш отчёт — это project management plan, а не отдельный charter. Section 19 «Sponsor Acceptance» играет роль подписи charter: подписывая, sponsor соглашается со scope, графиком, бюджетом и его финансированием, baselines и подходом. Блок подписи пока пуст — план мы представляем на утверждение на этом мидтерме."),
  t("M1 says the plan was approved on 5 Sep, but Section 19 is unsigned. Why?",
    "That is a fair point. M1 marks the end of our planning phase on 5 September, but the formal sponsor signature in Section 19 is still empty. We present the plan for the sponsor's approval at this midterm, and that signature closes the gap.",
    "Справедливо. M1 отмечает конец нашей фазы планирования 5 сентября, но формальная подпись sponsor в Section 19 пока пуста. Мы представляем план на утверждение sponsor на этом мидтерме, и эта подпись закроет разрыв."),
  // Scope
  t("What is in your scope, and what is explicitly out of it?",
    "Our scope includes hand detection through the webcam, user-trained poses and motions, swipes in four directions, commands, a settings panel, the Linux GNOME (Wayland) desktop version, the browser version, the website, user guide and test results. We put out of scope mobile and macOS, Windows for now (R-06), the workout mode removed on 3 October, special hardware, two-hand gestures and sign language, voice control and cloud storage.",
    "В наш scope входят распознавание руки через веб-камеру, обучаемые пользователем позы и движения, свайпы в четыре стороны, команды, панель настроек, desktop-версия для Linux GNOME (Wayland), браузерная версия, сайт, руководство и результаты тестов. Вне scope мы вынесли mobile и macOS, пока что Windows (R-06), режим тренировок, убранный 3 октября, специальное железо, жесты двумя руками и язык жестов, голосовое управление и облачное хранилище."),
  t("How do you protect the project from scope creep?",
    "Our included and excluded lists are the reference: a request from the excluded list, such as two-hand gestures or a mobile version, is rejected unless it is approved as a major change. At every weekly meeting we check the open task cards for work not covered by the WBS, and such work is either stopped or submitted as a change request.",
    "Наши списки included и excluded — эталон: запрос из excluded, например жесты двумя руками или mobile-версия, отклоняется, если его не одобрили как major change. На каждой еженедельной встрече мы проверяем открытые task cards на работу вне WBS, и такую работу либо останавливаем, либо оформляем как change request."),
  t("How will each deliverable be accepted?",
    "Table 10 sets our acceptance criteria and who accepts each deliverable. The desktop app must record a gesture in under one minute, reach at least 90% accuracy in the user test, execute the command and pass all automated tests; the whole team accepts it, then the sponsor. The user guide passes when a new user installs the app and sets up one gesture without help.",
    "Table 10 задаёт наши acceptance criteria и кто принимает каждый deliverable. Desktop-приложение должно записывать жест меньше чем за минуту, давать не меньше 90% точности в тесте с пользователями, выполнять команду и проходить все автотесты; принимает вся команда, затем sponsor. Руководство принято, если новый пользователь без помощи устанавливает приложение и настраивает один жест."),
  // Change control
  t("Walk us through your change control procedure.",
    "We have seven steps based on PMBOK integrated change control: a GitHub issue labelled ‘change request’; impact assessment by the area owner within two days; classification as minor or major; the decision; baseline update; implementation through a reviewed pull request; and closure, with an announcement in Telegram, the issue closed and an entry in the change log.",
    "У нас семь шагов на основе integrated change control из PMBOK: GitHub issue с меткой «change request»; оценка влияния владельцем области в течение двух дней; классификация minor или major; решение; обновление baselines; реализация через pull request с review; закрытие — объявление в Telegram, закрытый issue и запись в change log."),
  t("How do you tell a minor change from a major one, and who decides?",
    "A minor change moves no milestone, changes no objective or scope list and needs under 4 hours; the area owner and Ayat approve it, usually the same day in Telegram. A major change moves a milestone, changes an objective, adds or removes a feature, needs a purchase or 4 hours or more; all four of us must agree, and if we cannot, Ayat as the owner of the system design decides.",
    "Minor не двигает milestone, не меняет objectives и списки scope и требует меньше 4 часов; одобряют владелец области и Ayat, обычно в тот же день в Telegram. Major двигает milestone, меняет objective, добавляет или убирает функцию, требует покупки или 4 часов и больше; нужно согласие всех четверых, а если согласия нет — решает Ayat как владелец system design."),
  t("Which change requests have you had so far?",
    "So far we have five. CR-01 on 3 October removed the workout mode and other experimental modes, leaving gesture mode and the gesture trainer; CR-02 on 4 October added the browser version (WBS 3.4); CR-03 on 5 October introduced task cards, PR review, the risk register and the time log (M7); CR-04 on 5 October added the accuracy and lighting studies (4.1, 4.2; M8, M9). All four were major and approved; CR-05, the Windows version, is still pending.",
    "Пока у нас их пять. CR-01 3 октября убрал режим тренировок и другие экспериментальные режимы, оставив режим жестов и тренер жестов; CR-02 4 октября добавил браузерную версию (WBS 3.4); CR-03 5 октября ввёл task cards, PR review, risk register и time log (M7); CR-04 5 октября добавил исследования точности и освещения (4.1, 4.2; M8, M9). Все четыре — major и одобрены; CR-05 про Windows-версию пока pending."),
  // График
  t("How is your work breakdown structure organised?",
    "Our WBS has four phases, Planning, Design, Development, and Testing and launch, with eleven work packages from 1.1 to 4.4. Each package has a code, an owner, start and end dates and a GitHub task card, and it is complete when the card is closed and the code is merged after review. Packages 3.4, 4.1 and 4.2 were added on 5 October.",
    "В нашей WBS четыре фазы — Planning, Design, Development и Testing and launch — и одиннадцать work packages от 1.1 до 4.4. У каждого пакета есть код, владелец, даты начала и конца и task card на GitHub; пакет готов, когда карточка закрыта, а код смёржен после review. Пакеты 3.4, 4.1 и 4.2 добавлены 5 октября."),
  t("Which milestones have you reached so far?",
    "We have reached seven of twelve: M1 and M2 on time, M3 early on 12 September, M4 and M5 early on 16 September, and the added M6 and M7 on 5 October. Next are M8, accuracy on real video, on 15 October; M9, the lighting study, on 18 October; M10, all features ready and the Windows decision, on 20 October; M11, user testing with 30 participants, on 1 November; and M12, the guide and final presentation, on 4 November.",
    "Мы достигли семи из двенадцати: M1 и M2 в срок, M3 досрочно 12 сентября, M4 и M5 досрочно 16 сентября и добавленные M6 и M7 5 октября. Дальше: M8 — точность на реальном видео, 15 октября; M9 — исследование освещения, 18 октября; M10 — все функции готовы и решение по Windows, 20 октября; M11 — тестирование с 30 участниками, 1 ноября; M12 — руководство и финальная презентация, 4 ноября."),
  t("What is the critical path of your project?",
    "We have no separate network diagram, so we derive it from Table 3: 1.1 → 1.2 → 2.1 → 3.1 → 3.2 → 3.3 → 4.3 → 4.4, from 1 September to 4 November, with 3.3 starting on 3 October, a week before 3.2 ends. 4.1 and 4.2 run in parallel with 3.3 and end before 4.3 starts, so 4.2 has about two days of float, and 3.4 is off the path. Since development finished early, today's critical chain is the fixed start of user testing on 20 October (M10) → 4.3 → 4.4.",
    "Отдельной сетевой диаграммы у нас нет, поэтому мы выводим путь из Table 3: 1.1 → 1.2 → 2.1 → 3.1 → 3.2 → 3.3 → 4.3 → 4.4, с 1 сентября по 4 ноября; 3.3 начинается 3 октября, за неделю до конца 3.2. 4.1 и 4.2 идут параллельно с 3.3 и заканчиваются до начала 4.3, так что у 4.2 около двух дней float, а 3.4 вне критического пути. Раз разработка закончилась раньше, сегодня критическая цепочка — фиксированный старт тестирования 20 октября (M10) → 4.3 → 4.4."),
  t("You are about three weeks ahead. Why won't you finish early?",
    "Only development is ahead: all our measurements so far were made on synthetic hands, and verification with real people is still to come. We spend the gained time on the accuracy and lighting studies (4.1, 4.2), not on new features, and user testing starts on 20 October in any case. We kept the baseline unchanged so that the variance stays visible.",
    "Впереди только разработка: все наши измерения пока сделаны на синтетических руках, а проверка на реальных людях ещё предстоит. Выигранное время мы тратим на исследования точности и освещения (4.1, 4.2), а не на новые функции, и тестирование с пользователями в любом случае начинается 20 октября. Baseline мы не меняли, чтобы отклонение было видно."),
  t("What happens when a task is running late?",
    "If a task is up to two days late and no milestone is affected, the owner solves it with the members who depend on it, and our baseline stays the same. If a delay would move a milestone, it becomes a change under Section 6: we agree on a new date, update the baseline and record the reason in the GitHub issue. If work slips, we cut minor features rather than shorten the 30-user test.",
    "Если задача опаздывает не больше чем на два дня и milestone не затронут, владелец решает это с теми, кто от неё зависит, и наш baseline не меняется. Если задержка сдвинет milestone, это change по Section 6: договариваемся о новой дате, обновляем baseline и записываем причину в GitHub issue. Если работа отстаёт, мы урезаем мелкие функции, а не сокращаем тест с 30 пользователями."),
  t("Gesture training got three weeks but worked on 16 Sep. Was your estimate poor?",
    "In hindsight it was pessimistic. Our durations came from the people responsible, and gesture training got the longest one, three weeks, because it was the area where we had the least experience. It worked on 16 September, but recognition was later reworked to handle a tilted wrist, and its check on real users is still ahead.",
    "Задним числом она оказалась пессимистичной. Длительности у нас давали ответственные за задачи, и обучение жестам получило самую длинную — три недели, потому что в этой области у нас было меньше всего опыта. Оно заработало 16 сентября, но потом распознавание переделали под наклонённое запястье, а проверка на реальных людях ещё впереди."),
  // Бюджет и оценка
  t("What does the project cost, and who pays for it?",
    "We separate two kinds of cost. The cash budget is 51 913 KZT of purchases plus a 10% contingency reserve of 5 191, so 57 104 KZT; there is no external sponsor funding, so the four of us pay equal shares of about 14 276 KZT. Labour is 300 hours valued at 708 240 KZT, and the total economic cost is 765 344 KZT.",
    "Мы разделяем два вида затрат. Cash budget — 51 913 KZT покупок плюс contingency reserve 10% (5 191), итого 57 104 KZT; внешнего финансирования нет, поэтому мы платим вчетвером равными долями примерно по 14 276 KZT. Труд — 300 часов стоимостью 708 240 KZT, а total economic cost — 765 344 KZT."),
  t("Why is labour not counted as a project expense?",
    "We are students and are not paid, so our 300 hours are an in-kind contribution, not money the project spends. We still value them at market salaries for junior specialists in Kazakhstan, 708 240 KZT, for two reasons: to plan and control the team's effort, and to show what the same project would cost if a company did it.",
    "Мы студенты, и нам не платят, поэтому наши 300 часов — вклад натурой (in-kind), а не деньги, которые тратит проект. Но мы всё равно оцениваем их по рыночным зарплатам junior-специалистов в Казахстане — 708 240 KZT — по двум причинам: чтобы планировать и контролировать усилия команды и чтобы показать, сколько этот проект стоил бы компании."),
  t("How did you calculate the hourly rates?",
    "We took median gross monthly salaries for junior specialists in Kazakhstan and divided them by 168 working hours, rounded to tens: 400 000 KZT gives 2 380 KZT per hour for Ayat, Yernar and Aizat, and 385 200 KZT, the junior JavaScript developer median, gives 2 290 for Akbota. Multiplied by the planned 80, 80, 76 and 64 hours, that is 708 240 KZT.",
    "Мы взяли медианные gross-зарплаты junior-специалистов в Казахстане за месяц и разделили на 168 рабочих часов с округлением до десятков: 400 000 KZT дают 2 380 KZT в час для Ayat, Yernar и Aizat, а 385 200 KZT — медиана junior JavaScript developer — дают 2 290 для Akbota. Умножив на плановые 80, 80, 76 и 64 часа, получаем 708 240 KZT."),
  t("Why do your labour rates include no overhead or employer contributions?",
    "The salaries are gross monthly amounts for juniors without employer contributions, so our rates are direct labour only, with no overhead rate added as in Kerzner's pricing. That is enough to value and plan our own effort; a company pricing this project would add overhead, so its price would be higher than 708 240 KZT.",
    "Зарплаты — gross-суммы за месяц для junior без взносов работодателя, поэтому наши ставки — только direct labour, без overhead rate, как в ценообразовании у Kerzner. Для оценки и планирования наших усилий этого достаточно; компания при расчёте цены добавила бы overhead, и цена была бы выше 708 240 KZT."),
  t("What will you buy, and why do you need it?",
    "We buy two Logitech C270 HD webcams for 32 580 KZT, so the studies do not depend on one laptop camera; a 30 cm ring light with tripod for 12 238 to test three lighting levels (R-02); the yeahtrack.site domain for 435; and three months of the Railway Hobby plan for 6 660 in case the free plan limits are reached (R-09). That is 51 913 KZT, with dollar prices converted at 444 KZT per USD from 29 September 2026.",
    "Мы покупаем две веб-камеры Logitech C270 HD за 32 580 KZT, чтобы исследования не зависели от одной камеры ноутбука; кольцевую лампу 30 см со штативом за 12 238 для проверки трёх уровней освещения (R-02); домен yeahtrack.site за 435; и три месяца Railway Hobby plan за 6 660 на случай, если упрёмся в лимиты бесплатного плана (R-09). Итого 51 913 KZT, долларовые цены пересчитаны по 444 KZT за USD на 29 сентября 2026."),
  t("How does procurement work in your project?",
    "The area owner proposes an item with a link to the offer, Ayat and one other member approve it, and we buy from a seller in Kazakhstan that has it in stock, delivers to Astana within a week and offers the lowest price. The receipt is stored in the repository; all purchases are fixed-price retail, so we need no supplier contracts. The webcams and ring light are bought in week 6, before the studies.",
    "Владелец области предлагает позицию со ссылкой на предложение, одобряют Ayat и ещё один участник, и мы покупаем у продавца в Казахстане, у которого товар в наличии, доставка в Астану в течение недели и самая низкая цена. Чек хранится в репозитории; все покупки — розница по фиксированной цене, так что договоры с поставщиками нам не нужны. Веб-камеры и лампу покупаем на 6-й неделе, до начала исследований."),
  t("Purchases need Ayat and one member, yet a purchase is a major change. Which is it?",
    "Both rules hold, for different purchases. Items already in Table 8 are part of our approved plan, so Ayat and one other member approve the actual buying. Any purchase not listed in Table 8 is a major change and needs the agreement of all four members.",
    "Верны оба правила — для разных покупок. Позиции из Table 8 уже входят в наш утверждённый план, поэтому саму покупку одобряют Ayat и ещё один участник. Любая покупка не из Table 8 — major change и требует согласия всех четверых."),
  t("Which class of estimate is your budget?",
    "Our cash estimate is bottom-up, from current price offers for each item, so it is close to a definitive estimate (Class I, ±5%). The effort estimate, hours per WBS package from the owners before the work, is a planning-stage estimate and less precise, which is why we control it with the 10% threshold.",
    "Наша cash-оценка сделана bottom-up по текущим предложениям на каждую позицию, поэтому она близка к definitive estimate (Class I, ±5%). Оценка трудозатрат — часы на каждый пакет WBS от владельцев до начала работы — это оценка стадии планирования, менее точная, поэтому мы контролируем её порогом 10%."),
  // Cost baseline и контроль
  t("What is your cost baseline, and what does the S-curve show?",
    "Our baseline has two parts: the effort baseline, 300 hours worth 708 240 KZT, and the cash baseline of 51 913 KZT; the reserve is not part of it. By phase: Planning 75 440, Design 70 860, Development 350 260 plus all the cash, Testing and launch 211 680. Figure 6 shows the cumulative curves: labour value grows every week, while cash is spent only in weeks 5 and 6.",
    "Наш baseline состоит из двух частей: effort baseline — 300 часов на 708 240 KZT, и cash baseline — 51 913 KZT; резерв в него не входит. По фазам: Planning 75 440, Design 70 860, Development 350 260 плюс все деньги, Testing and launch 211 680. Figure 6 показывает накопительные кривые: стоимость труда растёт каждую неделю, а деньги тратятся только на 5-й и 6-й неделе."),
  t("Why is your contingency reserve outside the cost baseline?",
    "Our 5 191 KZT reserve is not tied to a single risk and is released only with the agreement of all four members, so it behaves like a management reserve, which Kerzner keeps separate from the distributed budget. We know that in strict PMBOK terms a contingency reserve usually sits inside the baseline; we can rename it or move it into the baseline.",
    "Наш резерв 5 191 KZT не привязан к одному риску и выделяется только с согласия всех четверых, поэтому он ведёт себя как management reserve, который у Kerzner отделён от распределённого бюджета. Мы знаем, что строго по PMBOK contingency reserve обычно лежит внутри baseline; можем переименовать его или перенести в baseline."),
  t("How do you control costs and actual hours?",
    "We approve every purchase before it is made and store its receipt. Since 5 October each of us logs hours in docs/HOURS.md on the day of the work, in half-hour steps and including meetings, and at each milestone review Ayat compares actual hours and purchases with the baseline. If hours or a purchase exceed the estimate by more than 10%, we find the cause and simplify a task, use the reserve, or submit a change request.",
    "Каждую покупку мы одобряем до оплаты и храним чек. С 5 октября каждый из нас записывает часы в docs/HOURS.md в день работы, шагами по полчаса и вместе со встречами, а на каждом milestone review Ayat сравнивает фактические часы и покупки с baseline. Если часы или покупка превышают оценку больше чем на 10%, ищем причину и упрощаем задачу, берём резерв или подаём change request."),
  t("What is your planned value at the midterm, and are you ahead or behind?",
    "Our BCWS, or PV, at the end of week 5 (28 September – 4 October) is 349 900 KZT of labour value, plus 435 KZT of planned cash. The development packages finished early, with the main functions of 3.1–3.3 working and 3.4 done, while testing has not started, so EV is above PV: SV is positive and SPI is above 1.",
    "Наш BCWS, или PV, на конец 5-й недели (28 сентября – 4 октября) — 349 900 KZT стоимости труда плюс 435 KZT плановых денег. Пакеты разработки закончены раньше: основные функции 3.1–3.3 работают, 3.4 готов, а тестирование не начато, поэтому EV выше PV: SV положительный, SPI больше 1."),
  t("What are your CV and CPI today?",
    "We cannot state them honestly yet. Our time log was introduced on 5 October and the earlier weeks are being reconstructed, so the actual cost, ACWP, is not known precisely. The first full EVM check is at the next milestone review, with CV = BCWP − ACWP and CPI = BCWP / ACWP.",
    "Честно назвать их мы пока не можем. Time log ввели 5 октября, а прошлые недели восстанавливаются, поэтому фактическая стоимость, ACWP, точно не известна. Первая полная проверка EVM — на следующем milestone review, по формулам CV = BCWP − ACWP и CPI = BCWP / ACWP."),
  // Команда и организация
  t("Who is responsible for what in the team?",
    "Since 5 October Ayat owns the core, meaning recognition, the bridge to the system and the architecture, and is the mandatory reviewer for that code; Yernar owns storage, build, deployment and the automated tests on GitHub; Akbota the website, the demonstration and the Windows decision; Aizat quality and documentation, including the studies, README, guide, risk register and time log. We plan 80, 80, 64 and 76 hours respectively, 8 to 12 hours a week each.",
    "С 5 октября Ayat отвечает за ядро — распознавание, bridge к системе и архитектуру — и обязательно ревьюит этот код; Yernar — за хранилище, сборку, деплой и автотесты на GitHub; Akbota — за сайт, демонстрацию и решение по Windows; Aizat — за качество и документацию: исследования, README, руководство, risk register и time log. По плану это 80, 80, 64 и 76 часов соответственно, по 8–12 часов в неделю на каждого."),
  t("Why is Ayat accountable for six of the eight activities in your RACI?",
    "Ayat is the team lead and the owner of the system design, so the final sign-off sits there, while the R is spread: Yernar, Akbota and Aizat are responsible in seven of the eight activities. We accept that this concentrates load on one person; pull request review and written design decisions are how we spread the knowledge, as for R-03.",
    "Ayat — team lead и владелец system design, поэтому финальное утверждение за Ayat, а R распределено: Yernar, Akbota и Aizat — responsible в семи из восьми активностей. Мы признаём, что это концентрирует нагрузку на одном человеке; PR review и записанные проектные решения — наш способ распределить знания, как и для R-03."),
  t("What organizational structure does your team have?",
    "Inside the course we are a small pure project, or projectized, team: the four of us work only on project tasks, Ayat is the team lead with the final word on system design, and there are no functional managers. The instructor is the sponsor and customer. It is not a matrix, because nobody reports to a second, functional boss.",
    "В рамках курса мы — маленькая pure project (projectized) команда: все четверо работают только над задачами проекта, Ayat — team lead с последним словом по system design, функциональных руководителей нет. Преподаватель — sponsor и заказчик. Это не matrix, потому что никто не подчиняется второму, функциональному начальнику."),
  t("Which stage of Tuckman's model is your team in?",
    "From 1 September to 4 October our work was not formally divided and all code came from one account: forming and storming, with informal roles. On 5 October we introduced areas of responsibility, PR review, the risk register and the time log, which is norming. Our goal now is performing, and adjourning is the team release after 4 November.",
    "С 1 сентября по 4 октября наша работа формально не делилась и весь код шёл с одного аккаунта — forming и storming с неформальными ролями. 5 октября мы ввели зоны ответственности, PR review, risk register и time log — это norming. Сейчас цель — performing, а adjourning — роспуск команды после 4 ноября."),
  t("How does your team communicate, and how are urgent issues handled?",
    "We use Telegram for daily updates, questions and quick decisions, and GitHub for the code, task cards and change records. Ayat owns the check-in every 1–2 days, the weekly meeting since 5 October, milestone reviews and reports to the instructor, and Aizat owns testing feedback. Urgent issues go to Telegram the same day, and if the team cannot solve one, we raise it with the instructor.",
    "Telegram у нас — для ежедневных новостей, вопросов и быстрых решений, GitHub — для кода, task cards и записей об изменениях. Ayat ведёт check-in раз в 1–2 дня, еженедельную встречу с 5 октября, milestone reviews и отчёты преподавателю, а Aizat — обратную связь по тестированию. Срочное пишем в Telegram в тот же день, а если команда не может решить вопрос, поднимаем его перед преподавателем."),
  t("The repository has a single author. Who actually did the work?",
    "Until 5 October our work was not formally divided and all code was committed from one account, and work without commits, such as discussions, manual checks and reports, does not show in the repository at all. We recorded this as risk R-03 with score 9. Since 5 October each member has an area, changes go through pull requests and hours go into the time log, so every contribution is visible.",
    "До 5 октября наша работа формально не делилась и весь код коммитился с одного аккаунта, а работа без коммитов — обсуждения, ручные проверки, отчёты — в репозитории вообще не видна. Мы записали это как риск R-03 с оценкой 9. С 5 октября у каждого своя область, изменения идут через pull requests, а часы — в time log, так что вклад каждого виден."),
  t("Table 3 gives gesture training to Yernar, Table 15 gives recognition to Ayat. Why?",
    "Table 3 is our schedule baseline from the planning phase, and we did not rewrite it. In practice the work was not formally divided before 5 October and all code came from one account; Table 15, from 5 October, is the current split, in which recognition is Ayat's area and Yernar owns storage, build and deployment.",
    "Table 3 — наш schedule baseline из фазы планирования, и мы его не переписывали. На деле до 5 октября работа формально не делилась и весь код шёл с одного аккаунта; Table 15 с 5 октября — текущее разделение, где распознавание — область Ayat, а Yernar отвечает за хранилище, сборку и деплой."),
  // Качество
  t("How do you assure quality during development?",
    "Since 5 October every change is a pull request reviewed by a second member, and Ayat's review is mandatory for the recognition code, the bridge and the tests. Before a pull request the author runs our automated suite for recognition, browser storage, onboarding and the database, and a GitHub Actions workflow is being introduced (R-12). The suite already caught a leftover reference to a deleted function that would have stopped the page from loading.",
    "С 5 октября каждое изменение — pull request с review второго участника, а review от Ayat обязателен для кода распознавания, bridge и тестов. Перед pull request автор запускает наши автотесты — распознавание, браузерное хранилище, onboarding и база данных, — а workflow в GitHub Actions сейчас вводится (R-12). Тесты уже поймали оставшуюся ссылку на удалённую функцию, из-за которой страница не загрузилась бы."),
  t("How will you control quality during testing?",
    "We do it in three steps. Aizat records five people performing five gestures 20 times each and counts correct and false activations; the same recordings are evaluated at three lighting levels with the ring light; then 30 participants each train three gestures and perform each 20 times, with a stopwatch and an ease-of-use questionnaire. Any metric below the baseline becomes a GitHub issue.",
    "Мы делаем это в три шага. Aizat записывает пять человек, каждый делает пять жестов по 20 раз, и считает верные и ложные срабатывания; те же записи проверяются при трёх уровнях освещения с кольцевой лампой; затем 30 участников обучают по три жеста и выполняют каждый по 20 раз — с секундомером и анкетой об удобстве. Любая метрика ниже baseline становится GitHub issue."),
  t("Which quality targets do you check besides accuracy?",
    "Our Table 20 also sets swipe recognition of at least 90%, no more than one false activation in 5 minutes, under 0.5 s from gesture to command, at least 20 FPS, all test suites passing before every merge, no crashes in test sessions and ease of use of at least 4 out of 5. So far, on synthetic data, swipes reach 100% and untrained poses fire in 0% of frames; we get 56 FPS with GPU and about 22 FPS on CPU only.",
    "Наша Table 20 также задаёт распознавание свайпов не ниже 90%, не больше одного ложного срабатывания за 5 минут, меньше 0,5 с от жеста до команды, не меньше 20 FPS, прохождение всех наборов тестов перед каждым merge, отсутствие падений на тестовых сессиях и удобство не ниже 4 из 5. Пока, на синтетике, свайпы дают 100%, а необученные позы срабатывают в 0% кадров; у нас 56 FPS с GPU и около 22 FPS только на CPU."),
  t("Have you actually reached 90% accuracy?",
    "Not on real people yet, and we do not claim it. On synthetic hands from our test code we get 95% per frame up to ±10° tilt, 93% at ±25° and only 85% at ±40°; that confirms the recognition logic, not accuracy on real users. This is risk R-01 with score 9, and M8 on 15 October is the accuracy study on real video.",
    "На реальных людях — ещё нет, и мы этого не утверждаем. На синтетических руках из нашего тестового кода — 95% по кадрам при наклоне до ±10°, 93% при ±25° и только 85% при ±40°; это подтверждает логику распознавания, а не точность на реальных пользователях. Это риск R-01 с оценкой 9, а M8 15 октября — исследование точности на реальном видео."),
  t("Did you measure the one-minute target for adding a gesture?",
    "Only partly. We have a 3-second countdown and 20–30 seconds of recording, and the gesture is usable immediately, but the full time including naming has not been measured. We will measure it with a stopwatch during user testing.",
    "Только частично. У нас есть обратный отсчёт 3 секунды и 20–30 секунд записи, жестом можно пользоваться сразу, но полное время вместе с вводом названия мы не измеряли. Измерим секундомером во время тестирования с пользователями."),
  // Риски
  t("How do you score risks, and which responses do you use?",
    "We rate probability and impact from 1 to 3 each, and their product gives a score from 1 to 9: 6–9 is high, with an owner and a response plan reviewed at every weekly meeting; 3–4 is medium, reviewed at milestone reviews; 1–2 is low. We choose avoidance, mitigation or acceptance; transfer to a third party is not practical in a student project, so we do not use it.",
    "Мы оцениваем вероятность и влияние от 1 до 3, произведение даёт оценку от 1 до 9: 6–9 — high, с владельцем и response plan, разбирается на каждой еженедельной встрече; 3–4 — medium, на milestone reviews; 1–2 — low. Выбираем avoidance, mitigation или acceptance; transfer третьей стороне в студенческом проекте непрактичен, поэтому мы его не используем."),
  t("What are your top three risks?",
    "All three of our top risks score 9, probability 3 times impact 3. R-01, accuracy measured only on synthetic hands, owned by Ayat: a video study of 5 people × 5 gestures × 20; R-02, lighting not studied, owned by Aizat: three lighting levels with the ring light; R-03, code knowledge in one person, owned by Ayat: areas of responsibility, reviewed pull requests and documented decisions.",
    "У всех трёх наших главных рисков оценка 9: вероятность 3 на влияние 3. R-01 — точность измерена только на синтетических руках, владелец Ayat: видеоисследование 5 человек × 5 жестов × 20; R-02 — освещение не изучено, владелец Aizat: три уровня освещения с кольцевой лампой; R-03 — знание кода у одного человека, владелец Ayat: зоны ответственности, pull requests с review и записанные решения."),
  t("Which risks have already happened, and what did you learn from them?",
    "Eight risks, R-13 to R-20, have occurred; we keep them in a separate list with the fix instead of deleting them. A tilted wrist broke recognition until rotation-independent features and rotated copies of samples raised accuracy from 41% to 93% at ±25° and from 26% to 85% at ±40°; a gesture fired zero or two times until we switched to voting over a 450 ms window; and our test suite caught a broken page before release (R-20).",
    "У нас случились восемь рисков, R-13–R-20; мы не удаляем их, а держим в отдельном списке с описанием решения. Наклон запястья ломал распознавание, пока признаки, не зависящие от поворота, и повёрнутые копии образцов не подняли точность с 41% до 93% при ±25° и с 26% до 85% при ±40°; жест срабатывал ноль или два раза, пока мы не перешли на голосование в окне 450 мс; а наши тесты поймали сломанную страницу до релиза (R-20)."),
  t("What if the live demo fails during the defense?",
    "That is our risk R-08, score 6, owned by Akbota: a missing camera, poor lighting or no network. A backup video is ready, we inspect the room in advance, and we keep the website open as a fallback.",
    "Это наш риск R-08, оценка 6, владелец Akbota: нет камеры, плохой свет или нет сети. Резервное видео готово, комнату мы проверяем заранее, а сайт держим открытым как запасной вариант."),
  t("Your website lists a Windows version as in progress. Is that honest?",
    "Not yet, and we track it openly as risk R-06, score 6, owned by Akbota. Our change request CR-05 is pending: either we build a Windows version with Electron or we remove the promise from the website, and the decision is part of M10 on 20 October.",
    "Пока нет, и мы открыто ведём это как риск R-06, оценка 6, владелец Akbota. Наш change request CR-05 в статусе pending: либо делаем Windows-версию на Electron, либо убираем обещание с сайта, и решение входит в M10 20 октября."),
  t("The desktop app runs only on GNOME Wayland. Isn't that too narrow?",
    "It is a real limitation: KDE and X11 do not provide the input interface we need, and so far our desktop version has run only on Fedora Linux with GNOME. It is risk R-05, owned by Ayat: we state the limitation in the README and on the website and evaluate ydotool as an alternative, and the browser version works on a computer with a camera.",
    "Это реальное ограничение: KDE и X11 не дают нужного нам интерфейса ввода, и пока наша desktop-версия запускалась только на Fedora Linux с GNOME. Это риск R-05, владелец Ayat: мы пишем об ограничении в README и на сайте и оцениваем ydotool как альтернативу, а браузерная версия работает на компьютере с камерой."),
  // Итоги
  t("What would you do differently if you started again?",
    "We would divide the work and start PR review, the risk register and the time log on day one, not on 5 October, so that contributions and actual hours were visible from the start. We would test on real video and in different lighting earlier instead of relying on synthetic hands. And we would not list Windows on the website before deciding on it.",
    "Мы бы разделили работу и ввели PR review, risk register и time log с первого дня, а не 5 октября, чтобы вклад и фактические часы были видны с самого начала. Мы раньше проверили бы распознавание на реальном видео и при разном освещении, а не полагались на синтетические руки. И не писали бы про Windows на сайте до решения по нему."),
  t("What did you learn as a team?",
    "We learned that a working feature is not yet a verified one: our synthetic tests look good, but only real users can confirm the objectives. Formal roles, PR review, the risk register and the time log on 5 October moved us from storming to norming, and keeping occurred risks as lessons, like the test that caught a broken page, stops us repeating mistakes.",
    "Мы поняли, что работающая функция — ещё не проверенная: наши синтетические тесты выглядят хорошо, но подтвердить objectives могут только реальные пользователи. Формальные роли, PR review, risk register и time log с 5 октября перевели нас из storming в norming, а случившиеся риски, сохранённые как уроки, — например, тест, поймавший сломанную страницу, — не дают повторять ошибки."),
];

/** Проект на одной странице — цифры, ID и даты, которые надо помнить на защите. */
export const cheatSheet: Text = {
  en: `## The project
- **YeahTrack:** hand gestures from an ordinary webcam control the computer; the user records their own gestures (20–30 s) and links each to a command. 1280 × 720 frame → 21 MediaPipe landmarks → tilt-free features → k-NN, k = 5 → ≥ 70% of a 450 ms window → bridge → command. Runs locally, no frames sent.
- **Goal:** a working app in which users train their own gestures and link them to commands by **4 Nov 2026**. **Objectives:** accuracy **≥ 90%** · new gesture **< 1 min** · **≥ 30** test users.
- **Deliverables:** Linux (GNOME) desktop app + browser version · short user guide · test results and final presentation. **Approach:** Agile iterations on Scrum principles + PMBOK structure, 1 Sep – 4 Nov 2026. **Charter:** Section 19 Sponsor Acceptance, still unsigned.
- **In scope:** webcam hand detection, poses and motions, swipes in 4 directions, commands, settings panel, GNOME (Wayland) desktop version, browser version at yeahtrack.site/app, website, guide, test results.
- **Out of scope:** mobile and macOS, Windows for now (R-06), workout mode (removed 3 Oct, CR-01), special hardware, two-hand gestures and sign language, voice control and cloud storage.
## Milestones — 7 of 12 reached on 5 Oct
| # | Milestone | Target | Status on 5 Oct |
|---|---|---|---|
| M1 | Project plan approved | 5 Sep | Completed |
| M2 | Requirements and design ready | 12 Sep | Completed |
| M3 | First version: hand tracking and swipes | 19 Sep | **Early, 12 Sep** |
| M4 | Prototype: train and recognise one gesture | 3 Oct | **Early, 16 Sep** |
| M5 | Gesture training complete | 10 Oct | **Early, 16 Sep** |
| M6 | Browser version online (added) | 5 Oct | Completed |
| M7 | Process controls in place (added) | 5 Oct | Completed |
| M8 | Accuracy on real video (added, R-01) | 15 Oct | Planned |
| M9 | Lighting study complete (added, R-02) | 18 Oct | Planned |
| M10 | All features ready; Windows decision | 20 Oct | In progress |
| M11 | User testing with 30 participants | 1 Nov | Not started |
| M12 | User guide and final presentation | 4 Nov | Not started |
## Schedule and change control
- **WBS:** 1 Planning 1–5 Sep · 2 Design 5–12 Sep · 3 Development 12 Sep – 20 Oct · 4 Testing and launch 6 Oct – 4 Nov; 11 work packages, 3.4, 4.1, 4.2 added on 5 Oct. Owners: 1.1, 1.2, 4.4 whole team · 2.1, 3.1 Ayat · 3.2 Yernar · 3.3 Aizat · 3.4 Ayat + Yernar · 4.1 Aizat + Ayat · 4.2 Aizat · 4.3 Aizat + Akbota.
- **Critical path:** 1.1 → 1.2 → 2.1 → 3.1 → 3.2 → 3.3 → 4.3 → 4.4, 1 Sep – 4 Nov; 3.3 starts 3 Oct, a week before 3.2 ends; 4.2 has ≈ 2 days of float; 3.4 is off the path. Today: fixed start of user testing 20 Oct (M10) → 4.3 → 4.4.
- **Ahead ≈ 3 weeks**, but no early finish: all measurements are synthetic; gained time → 4.1 and 4.2; user testing starts 20 Oct anyway; baseline unchanged to keep the variance visible. Late ≤ 2 days with no milestone moved → owner fixes it; otherwise → change request.
- **Change classes:** minor = no milestone, objective or scope-list change and < 4 h → area owner + Ayat; major = milestone, objective, feature, purchase or ≥ 4 h → all four agree; tie-break Ayat. 7 steps, impact assessed within 2 days.
- **Change log:** CR-01 3 Oct modes removed · CR-02 4 Oct browser version (3.4) · CR-03 5 Oct task cards, PR review, risk register, time log (M7) · CR-04 5 Oct accuracy and lighting studies (4.1, 4.2; M8, M9) — all major, approved · CR-05 Windows (R-06) — major, pending.
## Budget (KZT)
| Item | Paid by | Amount |
|---|---|---|
| Purchases (Table 8) | Team, equal shares | 51 913 |
| Reserve, 10% of purchases | Team, if needed | 5 191 |
| **Cash budget** | 4 × ≈ 14 276 | **57 104** |
| Labour, 300 h at market rates | In-kind, not paid | 708 240 |
| **Total economic cost** | — | **765 344** |
- **Purchases:** 2 × Logitech C270 HD webcam 32 580 · ring light 30 cm 12 238 · domain yeahtrack.site 435 · Railway Hobby, 3 months 6 660 (R-09); USD at **444 KZT** (29 Sep 2026). Area owner proposes → Ayat + one member approve → seller in Kazakhstan → receipt in the repo; equipment in week 6.
- **Rates:** monthly salary / 168 h — Ayat, Yernar, Aizat 400 000 → 2 380 per hour; Akbota 385 200 → 2 290 per hour; hours 80 / 80 / 76 / 64. Gross junior salaries: no employer contributions, no overhead.
- **Estimate:** bottom-up; cash from current offers ≈ Class I definitive (±5%); effort from the owners is a less precise planning estimate → 10% threshold.
## Cost baseline and earned value
- **By phase:** Planning 32 h, 75 440 · Design 30 h, 70 860 · Development 148 h, 350 260 + all cash 51 913 · Testing and launch 90 h, 211 680. Reserve 5 191 is outside the baseline, like a management reserve.
- **S-curve (Figure 6):** labour value grows every week up to 708 240; cash only in week 5 (435, domain) and week 6 (51 478).
- **At the midterm:** PV (BCWS) at the end of week 5 = **349 900** labour + 435 cash; EV > PV → SV > 0, SPI > 1; AC not known precisely (time log since 5 Oct) → CV and CPI at the next milestone review.
= CV = BCWP − ACWP · SV = BCWP − BCWS · CPI = BCWP / ACWP · SPI = BCWP / BCWS
- **Control:** docs/HOURS.md daily, half-hour steps, meetings included; > 10% over in hours or on a purchase → simplify, use the reserve or a change request; a purchase outside Table 8 = major change.
## Team and communication
| Member | Area since 5 Oct | Hours |
|---|---|---|
| Ayat | Core: recognition, bridge, architecture; team lead, core reviewer | 80 |
| Yernar | Storage, export and import, Docker build, deployment, automated tests | 80 |
| Aizat | Accuracy and lighting studies, README and guide, risk register, time log | 76 |
| Akbota | Website, brand, project video, demo, Windows decision | 64 |
- **RACI:** Ayat is A in 6 of 8 activities; Akbota A/R for website and brand; Aizat A/R for the user guide; user testing R = Akbota and Aizat. No backups → R-03.
- **Structure:** small projectized team, no functional managers, instructor = sponsor. **Tuckman:** forming and storming to 4 Oct → norming from 5 Oct → performing → adjourning after 4 Nov.
- **Communication:** check-in every 1–2 days · weekly meeting from 5 Oct · PR review on every change · milestone review · testing feedback (Aizat) · report to the instructor; urgent issues the same day in Telegram.
## Quality and risks
- **Targets:** accuracy ≥ 90% · new gesture < 1 min · swipes ≥ 90% · ≤ 1 false activation in 5 min · delay < 0.5 s · ≥ 20 FPS · all tests pass · no crashes · ease of use ≥ 4/5.
- **Measured so far, synthetic hands only:** 95% / 93% / 85% per frame at ±10° / ±25° / ±40°; swipes 100%; untrained poses 0%; 56 FPS GPU, ≈ 22 FPS CPU. Real video not yet measured.
- **QA:** PR review, Ayat for core code, tests before every PR, GitHub Actions coming. **QC:** 5 people × 5 gestures × 20 → 3 lighting levels → 30 users × 3 gestures × 20 + questionnaire.
- **Scoring:** P × I, each 1–3; 6–9 high (every weekly meeting), 3–4 medium (milestone reviews), 1–2 low; responses: avoid, mitigate, accept; no transfer.
- **Score 9:** R-01 synthetic-only accuracy (Ayat) · R-02 lighting (Aizat) · R-03 code knowledge in one person (Ayat). **Score 6:** R-04 local storage · R-05 GNOME Wayland only · R-06 Windows promise · R-08 demo, backup video ready.
- **Occurred (R-13 – R-20):** tilt 41% → 93% and 26% → 85% · 450 ms voting window · snap vs swipes · stable IDs · tests caught a broken page.
## 20-minute defense plan: 14 minutes of talk, 6 for questions
| Segment | Slides | Minutes |
|---|---|---|
| Product: title, what it is, how it works | 1–3 | 3 |
| Plan: goal, scope, milestones | 4–6 | 2 |
| Schedule, progress, change control | 7–9 | 3 |
| Budget and procurement | 10–11 | 2 |
| Quality, risks, team, tools, next steps, live site or backup video | 12–17 | 4 |
> Say clearly what is measured and what is not: development is ahead, real-user verification is still to come.`,
  ru: `## Проект
- **YeahTrack:** жесты руки через обычную веб-камеру управляют компьютером; пользователь записывает свои жесты (20–30 с) и привязывает к каждому команду. Кадр 1280 × 720 → 21 точка MediaPipe → признаки без влияния наклона → k-NN, k = 5 → ≥ 70% окна 450 мс → bridge → команда. Всё локально, кадры никуда не уходят.
- **Goal:** работающее приложение, в котором пользователи обучают свои жесты и привязывают их к командам, к **4 ноября 2026**. **Objectives:** точность **≥ 90%** · новый жест **< 1 мин** · **≥ 30** пользователей в тесте.
- **Deliverables:** desktop-приложение для Linux (GNOME) + браузерная версия · короткое руководство · результаты тестов и финальная презентация. **Подход:** итерации Agile по принципам Scrum + структура PMBOK, 1 сентября – 4 ноября 2026. **Charter:** Section 19 Sponsor Acceptance, пока без подписи.
- **В scope:** распознавание руки через веб-камеру, позы и движения, свайпы в 4 стороны, команды, панель настроек, desktop-версия для GNOME (Wayland), браузерная версия на yeahtrack.site/app, сайт, руководство, результаты тестов.
- **Вне scope:** mobile и macOS, пока что Windows (R-06), режим тренировок (убран 3 октября, CR-01), специальное железо, жесты двумя руками и язык жестов, голосовое управление и облачное хранилище.
## Milestones — 7 из 12 достигнуты на 5 октября
| # | Milestone | Срок | Статус на 5 октября |
|---|---|---|---|
| M1 | План проекта утверждён | 5 сен | Выполнен |
| M2 | Требования и дизайн готовы | 12 сен | Выполнен |
| M3 | Первая версия: отслеживание руки и свайпы | 19 сен | **Досрочно, 12 сен** |
| M4 | Прототип: обучить и распознать один жест | 3 окт | **Досрочно, 16 сен** |
| M5 | Обучение жестам готово | 10 окт | **Досрочно, 16 сен** |
| M6 | Браузерная версия онлайн (добавлен) | 5 окт | Выполнен |
| M7 | Процессы контроля введены (добавлен) | 5 окт | Выполнен |
| M8 | Точность на реальном видео (добавлен, R-01) | 15 окт | Запланирован |
| M9 | Исследование освещения (добавлен, R-02) | 18 окт | Запланирован |
| M10 | Все функции готовы; решение по Windows | 20 окт | В работе |
| M11 | Тестирование с 30 участниками | 1 ноя | Не начат |
| M12 | Руководство и финальная презентация | 4 ноя | Не начат |
## График и change control
- **WBS:** 1 Planning 1–5 сен · 2 Design 5–12 сен · 3 Development 12 сен – 20 окт · 4 Testing and launch 6 окт – 4 ноя; 11 work packages, 3.4, 4.1, 4.2 добавлены 5 октября. Владельцы: 1.1, 1.2, 4.4 вся команда · 2.1, 3.1 Ayat · 3.2 Yernar · 3.3 Aizat · 3.4 Ayat + Yernar · 4.1 Aizat + Ayat · 4.2 Aizat · 4.3 Aizat + Akbota.
- **Critical path:** 1.1 → 1.2 → 2.1 → 3.1 → 3.2 → 3.3 → 4.3 → 4.4, 1 сен – 4 ноя; 3.3 начинается 3 окт, за неделю до конца 3.2; у 4.2 ≈ 2 дня float; 3.4 вне пути. Сегодня: фиксированный старт тестирования 20 окт (M10) → 4.3 → 4.4.
- **Опережение ≈ 3 недели**, но раньше не закончим: все измерения на синтетике; выигранное время → 4.1 и 4.2; тестирование начинается 20 окт в любом случае; baseline не меняли, чтобы отклонение было видно. Опоздание ≤ 2 дней без сдвига milestone → владелец решает сам; иначе → change request.
- **Классы изменений:** minor = без сдвига milestone, objectives и списков scope и < 4 ч → владелец области + Ayat; major = milestone, objective, функция, покупка или ≥ 4 ч → согласие всех четверых; решающий голос у Ayat. 7 шагов, оценка влияния за 2 дня.
- **Change log:** CR-01 3 окт режимы убраны · CR-02 4 окт браузерная версия (3.4) · CR-03 5 окт task cards, PR review, risk register, time log (M7) · CR-04 5 окт исследования точности и освещения (4.1, 4.2; M8, M9) — все major, одобрены · CR-05 Windows (R-06) — major, pending.
## Бюджет (KZT)
| Статья | Кто платит | Сумма |
|---|---|---|
| Покупки (Table 8) | Команда, равными долями | 51 913 |
| Резерв, 10% от покупок | Команда, если понадобится | 5 191 |
| **Cash budget** | 4 × ≈ 14 276 | **57 104** |
| Труд, 300 ч по рыночным ставкам | In-kind, не оплачивается | 708 240 |
| **Total economic cost** | — | **765 344** |
- **Покупки:** 2 × веб-камера Logitech C270 HD 32 580 · кольцевая лампа 30 см 12 238 · домен yeahtrack.site 435 · Railway Hobby на 3 месяца 6 660 (R-09); USD по **444 KZT** (29 сентября 2026). Владелец области предлагает → одобряют Ayat + ещё один участник → продавец в Казахстане → чек в репозитории; оборудование на 6-й неделе.
- **Ставки:** месячная зарплата / 168 ч — Ayat, Yernar, Aizat 400 000 → 2 380 в час; Akbota 385 200 → 2 290 в час; часы 80 / 80 / 76 / 64. Gross-зарплаты junior: без взносов работодателя, без overhead.
- **Оценка:** bottom-up; cash по текущим предложениям ≈ Class I definitive (±5%); трудозатраты от владельцев — менее точная оценка стадии планирования → порог 10%.
## Cost baseline и earned value
- **По фазам:** Planning 32 ч, 75 440 · Design 30 ч, 70 860 · Development 148 ч, 350 260 + все деньги 51 913 · Testing and launch 90 ч, 211 680. Резерв 5 191 вне baseline, как management reserve.
- **S-кривая (Figure 6):** стоимость труда растёт каждую неделю до 708 240; деньги только на 5-й неделе (435, домен) и на 6-й (51 478).
- **На мидтерме:** PV (BCWS) на конец 5-й недели = **349 900** труда + 435 денег; EV > PV → SV > 0, SPI > 1; AC точно не известен (time log с 5 октября) → CV и CPI на следующем milestone review.
= CV = BCWP − ACWP · SV = BCWP − BCWS · CPI = BCWP / ACWP · SPI = BCWP / BCWS
- **Контроль:** docs/HOURS.md каждый день, шаг полчаса, встречи тоже; превышение > 10% по часам или покупке → упростить, взять резерв или change request; покупка не из Table 8 = major change.
## Команда и коммуникация
| Участник | Область с 5 октября | Часы |
|---|---|---|
| Ayat | Ядро: распознавание, bridge, архитектура; team lead, ревьюер ядра | 80 |
| Yernar | Хранилище, экспорт и импорт, сборка Docker, деплой, автотесты | 80 |
| Aizat | Исследования точности и освещения, README и руководство, risk register, time log | 76 |
| Akbota | Сайт, бренд, видео проекта, демо, решение по Windows | 64 |
- **RACI:** у Ayat A в 6 из 8 активностей; у Akbota A/R за сайт и бренд; у Aizat A/R за руководство; в тестировании R — Akbota и Aizat. Замен нет → R-03.
- **Структура:** маленькая projectized команда, без функциональных руководителей, преподаватель = sponsor. **Tuckman:** forming и storming до 4 октября → norming с 5 октября → performing → adjourning после 4 ноября.
- **Коммуникация:** check-in раз в 1–2 дня · еженедельная встреча с 5 октября · PR review на каждое изменение · milestone review · обратная связь по тестам (Aizat) · отчёт преподавателю; срочное — в тот же день в Telegram.
## Качество и риски
- **Цели:** точность ≥ 90% · новый жест < 1 мин · свайпы ≥ 90% · ≤ 1 ложного срабатывания за 5 мин · задержка < 0,5 с · ≥ 20 FPS · все тесты проходят · без падений · удобство ≥ 4/5.
- **Измерено пока только на синтетических руках:** 95% / 93% / 85% по кадрам при ±10° / ±25° / ±40°; свайпы 100%; необученные позы 0%; 56 FPS с GPU, ≈ 22 FPS на CPU. Реальное видео ещё не измерено.
- **QA:** PR review, Ayat для кода ядра, тесты перед каждым PR, GitHub Actions на подходе. **QC:** 5 человек × 5 жестов × 20 → 3 уровня освещения → 30 пользователей × 3 жеста × 20 + анкета.
- **Оценка рисков:** P × I, каждое 1–3; 6–9 high (каждая еженедельная встреча), 3–4 medium (milestone reviews), 1–2 low; ответы: avoid, mitigate, accept; transfer не используем.
- **Оценка 9:** R-01 точность только на синтетике (Ayat) · R-02 освещение (Aizat) · R-03 знание кода у одного человека (Ayat). **Оценка 6:** R-04 локальное хранение · R-05 только GNOME Wayland · R-06 обещание Windows · R-08 демо, резервное видео готово.
- **Случились (R-13 – R-20):** наклон 41% → 93% и 26% → 85% · окно голосования 450 мс · щелчок против свайпов · стабильные ID · тесты поймали сломанную страницу.
## План защиты на 20 минут: 14 минут доклад, 6 на вопросы
| Блок | Слайды | Минуты |
|---|---|---|
| Продукт: титул, что это, как работает | 1–3 | 3 |
| План: цель, scope, milestones | 4–6 | 2 |
| График, прогресс, change control | 7–9 | 3 |
| Бюджет и закупки | 10–11 | 2 |
| Качество, риски, команда, инструменты, следующие шаги, живой сайт или резервное видео | 12–17 | 4 |
> Чётко говори, что измерено, а что нет: разработка впереди графика, проверка на реальных людях ещё впереди.`,
};
