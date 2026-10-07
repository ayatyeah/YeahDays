import { part, qx, tfx, type Lecture } from "../types";

export const block1: Lecture = {
  id: "pd-b1",
  title: { en: "Block 1 — The project and the plan", ru: "Блок 1 — Проект и план" },
  parts: [
    part(
      "pd-b1-p1",
      { en: "What YeahTrack is and how it works", ru: "Что такое YeahTrack и как он работает" },
      {
        en: `## What we wrote
**YeahTrack** is a software application that lets a user **control a computer with hand gestures** captured by an **ordinary webcam** (Section 1.1).
Existing gesture tools give a **fixed set of gestures** that the user has to learn. YeahTrack takes the **opposite approach**: the user **records their own gestures** and decides **which command each one performs** — change the volume, close a browser tab, open a website.
- It adapts to people with **different habits and physical abilities**.
- It needs **no additional hardware** beyond the camera already built into a laptop.
- The report is the **project management plan at the midterm stage** and follows the structure of the **PMBOK Guide (PMI, 2021)**.
## Privacy: no frame leaves the computer
Recognition runs **entirely on the user's computer**, and **no camera image is sent over the network**.
- Every gesture is stored on the user's machine **as a list of coordinates**; **images are not saved**.
- Because video frames never leave the computer, the application **also works offline** — slide 2 shows it as **0 frames sent to a server**.
## How a gesture becomes a command (Figure 1)
Each video frame passes through **six stages**:
![Figure 1 of the report: six boxes joined by arrows — 1 Camera frame (webcam image, 1280 × 720), 2 Hand landmarks (MediaPipe finds 21 points of the hand), 3 Features (joint angles and fingertip distances, scaled to hand size), 4 Classifier (k-nearest neighbours, k = 5, with a threshold for each gesture), 5 Voting window (the gesture must win at least 70% of a 450 ms window), 6 Command (the bridge sends a key, mouse or media command to the system)](/events/pm/yeahtrack-pipeline.webp)
| # | Stage | What happens |
|---|---|---|
| 1 | Camera frame | the webcam is read at **1280 × 720** pixels |
| 2 | Hand landmarks | **MediaPipe Hand Landmarker** locates **21 points**: the wrist, the finger joints, the fingertips |
| 3 | Features | **joint angles** and **fingertip distances divided by hand size** — they do not change when the hand is tilted or moved closer |
| 4 | Classification | **k-nearest neighbours, k = 5**, compares the features with the user's samples; **each gesture has its own distance threshold** |
| 5 | Voting window | the gesture fires only if it wins **at least 70% of the frames in a 450 ms window** |
| 6 | Command | the local **bridge** sends a key press, a mouse action, a media command or a program launch to the OS |
- Thanks to the per-gesture threshold, an **unfamiliar hand shape is ignored** instead of being matched to the nearest known gesture.
- A single frame is **never enough**: the voting window stops **random hand movements** from triggering commands.
- In the **browser version** a command is **limited to actions inside the web page**; only the desktop bridge controls the system.
## Training a gesture: 20–30 seconds
A new gesture is recorded in **20 to 30 seconds**. The **recorded samples themselves form the model**, so there is **no separate training step** — the gesture works **as soon as the recording ends**.
![Figure 2 of the report: trainer mode while a new gesture is recorded — a large «24» shows 24 seconds left of a 30-second recording, with a hint to tilt the wrist; the empty gesture list is on the left, the view settings on the right, the camera image is hidden and the interface is in Russian](/events/pm/yeahtrack-trainer.webp)
| Key number | What it means |
|---|---|
| 21 | landmarks per hand |
| 1280 × 720 | camera frame in pixels |
| k = 5 | neighbours in the classifier |
| 70% of 450 ms | share of votes a gesture needs to fire |
| 20–30 s | to record a new gesture |
| 56 FPS / ~22 FPS | with GPU / in CPU-only background mode |
| 2 versions | Linux desktop (GNOME, Wayland) and browser |
| 0 | frames sent to a server |
## Progress at the midterm (5 October 2026)
- The **main features work**, several of them **earlier than planned**: real-time hand tracking, **swipes in four directions**, recording custom gestures and assigning a command to each (Figures 2 and 3).
- A **browser version** runs at **yeahtrack.site/app**; the project website **yeahtrack.site** links to it and to the **Linux download** (Figure 4).
- The **remaining work is verification**: accuracy on **real users instead of synthetic test data**, the **effect of lighting**, and the **user testing**.
## The theory behind it
Kerzner (L1): **a project is a temporary endeavor undertaken to create a unique product, service, or result.** YeahTrack meets every point of the lecture's list:
| The lecture says a project… | YeahTrack |
|---|---|
| is **temporary**: defined start and end dates | 1 September – 4 November 2026 |
| creates a **unique** result | an app where users train their own gestures instead of learning a fixed set |
| has a **specific objective** within specifications | at least 90% accuracy, under 1 minute per gesture, 30 test users |
| has **funding limits** | cash budget 57 104 KZT, paid by the team |
| consumes **human and nonhuman resources** | 300 hours of four students; laptops, webcams, a ring light, hosting |
| is **multifunctional** | recognition, storage and deployment, website, quality and documentation |
Ongoing work after the release (for example, renewing the domain every year) would be **operations**; building and verifying YeahTrack by 4 November is the **project**.
## How to say it at the defense
- **Say:** “We built YeahTrack so that you control a computer with your own hand gestures and an ordinary webcam.”
- **Say:** “We record a new gesture in 20 to 30 seconds; the samples are the model, so there is no training step.”
- **Say:** “We never send a frame over the network: gestures are stored as coordinates, so the app works offline.”
- **Say:** “We fire a gesture only if it wins 70% of a 450 ms window, so random movements do not trigger commands.”
- **Say:** “We treat YeahTrack as a project: it ends on 4 November 2026 and creates a unique product.”
## Weak spots and honest answers
- **«Is 95% your real accuracy?»** — No. All measurements so far are on **synthetic hands** from our test code (95% is at a tilt up to ±10°). Real video is risk **R-01** (score 9) and is measured by **M8 on 15 Oct**; we **do not claim accuracy on real users** before then.
- **«Why only Linux?»** — The desktop version runs only on **GNOME Wayland** (R-05). Windows is **not in scope at this stage**: the decision is pending as **CR-05** (risk R-06). The browser version works on any computer with a camera but **cannot control the system** (R-11).
- **«Is 22 FPS enough?»** — The target is **at least 20 FPS**. 56 FPS is with GPU; about 22 FPS is the **CPU-only background mode**, close to the limit, so it is checked with the frame counter during testing.
> YeahTrack in one line: your own gestures, recorded in 20–30 seconds with an ordinary webcam and recognised on your own computer — no frame ever leaves it.
## Check yourself
?? Why is an unfamiliar hand shape not matched to the nearest known gesture?
?= Each gesture has its own distance threshold in the k-NN classifier (k = 5), so a shape that is too far from every sample is ignored.
?? Which two words of Kerzner's definition make YeahTrack a project, and how?
?= Temporary — it runs from 1 September to 4 November 2026; unique — users train their own gestures instead of learning a fixed set.`,
        ru: `## Что мы написали
**YeahTrack** — программа, которая позволяет **управлять компьютером жестами руки**, снятыми **обычной веб-камерой** (раздел 1.1).
Существующие программы дают **фиксированный набор жестов**, который пользователь должен выучить. YeahTrack делает **наоборот**: пользователь **записывает свои жесты** и сам решает, **какую команду выполняет каждый** — изменить громкость, закрыть вкладку браузера, открыть сайт.
- Программа подстраивается под людей с **разными привычками и физическими возможностями**.
- **Дополнительное оборудование не нужно** — хватает камеры, уже встроенной в ноутбук.
- Сам отчёт — это **план управления проектом на этапе мидтерма**, построенный по структуре **PMBOK Guide (PMI, 2021)**.
## Приватность: ни один кадр не покидает компьютер
Распознавание идёт **целиком на компьютере пользователя**, и **ни одно изображение с камеры не отправляется по сети**.
- Каждый жест хранится на машине пользователя **как список координат**; **изображения не сохраняются**.
- Раз кадры видео не покидают компьютер, программа **работает и без интернета (offline)** — на слайде 2 это **0 кадров, отправленных на сервер**.
## Как жест становится командой (рисунок 1)
Каждый кадр видео проходит **шесть этапов**:
![Рисунок 1 из отчёта: шесть блоков, соединённых стрелками — 1 Camera frame (кадр веб-камеры, 1280 × 720), 2 Hand landmarks (MediaPipe находит 21 точку руки), 3 Features (углы в суставах и расстояния между кончиками пальцев, приведённые к размеру руки), 4 Classifier (k ближайших соседей, k = 5, свой порог для каждого жеста), 5 Voting window (жест должен победить минимум в 70% окна 450 мс), 6 Command (мост отправляет в систему клавишу, действие мыши или медиакоманду)](/events/pm/yeahtrack-pipeline.webp)
| № | Этап | Что происходит |
|---|---|---|
| 1 | Camera frame (кадр камеры) | веб-камера читается в разрешении **1280 × 720** пикселей |
| 2 | Hand landmarks (точки руки) | **MediaPipe Hand Landmarker** находит **21 точку**: запястье, суставы пальцев, кончики пальцев |
| 3 | Features (признаки) | **углы в суставах** и **расстояния между кончиками пальцев, делённые на размер руки** — они не меняются, если руку наклонить или приблизить |
| 4 | Classification (классификация) | **k ближайших соседей (k-NN), k = 5**, сравнивает признаки с образцами пользователя; **у каждого жеста свой порог расстояния** |
| 5 | Voting window (окно голосования) | жест срабатывает, только если побеждает **не менее чем в 70% кадров окна 450 мс** |
| 6 | Command (команда) | локальный **мост (bridge)** отправляет в ОС нажатие клавиши, действие мыши, медиакоманду или запуск программы |
- Благодаря порогу для каждого жеста **незнакомая форма руки игнорируется**, а не приписывается ближайшему известному жесту.
- **Одного кадра никогда не хватает**: окно голосования не даёт **случайным движениям руки** запускать команды.
- В **браузерной версии** команда **ограничена действиями внутри веб-страницы**; системой управляет только мост десктопной версии.
## Обучение жесту: 20–30 секунд
Новый жест записывается за **20–30 секунд**. **Модель — это сами записанные образцы**, поэтому **отдельного шага обучения нет** — жест работает **сразу после окончания записи**.
![Рисунок 2 из отчёта: режим тренера во время записи нового жеста — крупное «24» показывает, что из 30 секунд записи осталось 24, и подсказку наклонить кисть; слева пустой список жестов, справа настройки вида, изображение с камеры скрыто, интерфейс на русском](/events/pm/yeahtrack-trainer.webp)
| Ключевое число | Что означает |
|---|---|
| 21 | точка на руке (landmarks) |
| 1280 × 720 | кадр камеры в пикселях |
| k = 5 | соседей в классификаторе |
| 70% от 450 мс | доля голосов, нужная жесту для срабатывания |
| 20–30 с | на запись нового жеста |
| 56 FPS / ~22 FPS | с GPU / в фоновом режиме только на CPU |
| 2 версии | десктоп для Linux (GNOME, Wayland) и браузер |
| 0 | кадров, отправленных на сервер |
## Прогресс на мидтерме (5 октября 2026)
- **Основные функции работают**, часть из них — **раньше плана**: отслеживание руки в реальном времени, **свайпы в четыре стороны**, запись своих жестов и назначение каждому команды (рисунки 2 и 3).
- **Браузерная версия** работает на **yeahtrack.site/app**; сайт проекта **yeahtrack.site** ведёт на неё и на **загрузку для Linux** (рисунок 4).
- **Оставшаяся работа — проверка (verification)**: точность на **реальных пользователях вместо синтетических данных**, **влияние освещения** и **пользовательское тестирование**.
## Теория за этим
Kerzner (L1): **проект — это временное предприятие ради уникального продукта, услуги или результата (a temporary endeavor undertaken to create a unique product, service, or result).** YeahTrack подходит под каждый пункт списка из лекции:
| В лекции проект… | YeahTrack |
|---|---|
| **временный (temporary)**: есть даты начала и конца | 1 сентября – 4 ноября 2026 |
| создаёт **уникальный (unique)** результат | программа, где пользователь учит свои жесты, а не заучивает готовый набор |
| имеет **конкретную цель (specific objective)** в рамках требований | точность не ниже 90%, меньше 1 минуты на жест, 30 тестовых пользователей |
| имеет **ограничение финансирования (funding limits)** | денежный бюджет 57 104 KZT, его оплачивает команда |
| потребляет **человеческие и нечеловеческие ресурсы** | 300 часов четырёх студентов; ноутбуки, веб-камеры, кольцевая лампа, хостинг |
| **многофункциональный (multifunctional)** | распознавание, хранение и развёртывание, сайт, качество и документация |
Текущая работа после релиза (например, ежегодное продление домена) была бы **операционной деятельностью (operations)**; построить и проверить YeahTrack к 4 ноября — это **проект**.
## Как сказать на защите
- **Скажи:** «We built YeahTrack so that you control a computer with your own hand gestures and an ordinary webcam.» — мы сделали YeahTrack, чтобы компьютером управляли своими жестами и обычной веб-камерой.
- **Скажи:** «We record a new gesture in 20 to 30 seconds; the samples are the model, so there is no training step.» — жест записывается за 20–30 секунд; образцы и есть модель, отдельного обучения нет.
- **Скажи:** «We never send a frame over the network: gestures are stored as coordinates, so the app works offline.» — кадры не уходят в сеть, жесты хранятся как координаты, программа работает без интернета.
- **Скажи:** «We fire a gesture only if it wins 70% of a 450 ms window, so random movements do not trigger commands.» — жест срабатывает, только если выиграл 70% окна 450 мс, поэтому случайные движения не запускают команды.
- **Скажи:** «We treat YeahTrack as a project: it ends on 4 November 2026 and creates a unique product.» — YeahTrack — это проект: он заканчивается 4 ноября 2026 и создаёт уникальный продукт.
## Слабые места и честные ответы
- **«Is 95% your real accuracy?»** (95% — это ваша реальная точность?) — Нет. Все измерения пока на **синтетических руках** из нашего тестового кода (95% — при наклоне до ±10°). Реальное видео — риск **R-01** (оценка 9), его измеряют к **M8, 15 октября**; до этого мы **не заявляем точность на реальных пользователях**.
- **«Why only Linux?»** (почему только Linux?) — Десктопная версия работает только в **GNOME Wayland** (R-05). Windows **на этом этапе не входит в рамки проекта**: решение ждёт в **CR-05** (риск R-06). Браузерная версия работает на любом компьютере с камерой, но **не может управлять системой** (R-11).
- **«Is 22 FPS enough?»** (22 FPS хватает?) — Цель — **не меньше 20 FPS**. 56 FPS — с GPU; около 22 FPS — это **фоновый режим только на CPU**, близко к границе, поэтому на тестах это проверяют счётчиком кадров.
> YeahTrack одной строкой: свои жесты, записанные за 20–30 секунд обычной веб-камерой и распознанные на твоём же компьютере, — ни один кадр его не покидает.
## Проверь себя
?? Почему незнакомая форма руки не приписывается ближайшему известному жесту?
?= У каждого жеста свой порог расстояния в классификаторе k-NN (k = 5), поэтому форма, слишком далёкая от всех образцов, игнорируется.
?? Какие два слова из определения Kerzner делают YeahTrack проектом и почему?
?= Temporary (временный) — он идёт с 1 сентября по 4 ноября 2026; unique (уникальный) — пользователи учат свои жесты, а не заучивают готовый набор.`,
      },
      [
        qx("At what resolution does YeahTrack read frames from the webcam?", "1280 × 720 pixels", [
          ["1920 × 1080 pixels", "Full HD is not used: Step 1 of the report reads webcam frames at 1280 × 720.", "Full HD не используется: в шаге 1 отчёта кадры с веб-камеры читаются в 1280 × 720."],
          ["640 × 480 pixels", "640 × 480 is the old VGA size; the report states 1280 × 720 pixels.", "640 × 480 — старый размер VGA; в отчёте указано 1280 × 720 пикселей."],
          ["1280 × 1024 pixels", "The width is right but the height is not: the frame is 1280 × 720.", "Ширина верная, а высота нет: кадр — 1280 × 720."],
        ], "Step 1, Camera frame: the application reads frames from the webcam at a resolution of 1280 × 720 pixels.", "Шаг 1, кадр камеры: приложение читает кадры с веб-камеры в разрешении 1280 × 720 пикселей."),
        qx("How many landmarks does the MediaPipe Hand Landmarker locate on a hand?", "21 points: wrist, finger joints and fingertips", [
          ["20 points: four on each finger", "There are 21 points — the wrist counts too, along with the finger joints and fingertips.", "Точек 21 — считается и запястье, вместе с суставами и кончиками пальцев."],
          ["42 points: 21 on each of the user's two hands at once", "42 would be two hands; YeahTrack reads one hand, and two-hand gestures are out of scope.", "42 — это две руки; YeahTrack читает одну руку, а жесты двумя руками — вне рамок проекта."],
          ["5 points: one on each fingertip", "Fingertips alone could not give joint angles; MediaPipe finds 21 points per hand.", "По одним кончикам пальцев не посчитать углы в суставах; MediaPipe находит 21 точку на руке."],
        ], "Step 2: the MediaPipe Hand Landmarker model locates 21 points on the hand — the wrist, the finger joints and the fingertips.", "Шаг 2: модель MediaPipe Hand Landmarker находит 21 точку на руке — запястье, суставы пальцев и кончики пальцев."),
        qx("Why does YeahTrack use joint angles and fingertip distances divided by hand size?", "They stay the same when the hand tilts or moves closer", [
          ["They help MediaPipe find the hand in a dark room", "Features are computed after MediaPipe has found the landmarks; lighting is a separate risk, R-02.", "Признаки считаются после того, как MediaPipe нашла точки; освещение — отдельный риск R-02."],
          ["They let the app store hand images in less space", "No images are stored at all — only coordinates; the features deal with tilt and distance.", "Изображения вообще не хранятся — только координаты; признаки нужны против наклона и расстояния."],
          ["They allow two hands to be tracked by one webcam at the same time", "Two-hand gestures are excluded from the scope; the features solve tilt and distance.", "Жесты двумя руками исключены из рамок проекта; признаки решают проблему наклона и расстояния."],
        ], "Step 3: the features do not change when the hand is tilted or moved closer to the camera. After risk R-13, these features plus rotated copies of samples raised accuracy on tilted synthetic hands from 41% to 93% at ±25°.", "Шаг 3: признаки не меняются, если руку наклонить или приблизить к камере. После риска R-13 эти признаки вместе с повёрнутыми копиями образцов подняли точность на наклонённых синтетических руках с 41% до 93% при ±25°."),
        qx("Which method compares a frame’s features with the samples the user recorded?", "k-nearest neighbours with k = 5", [
          ["k-nearest neighbours with k = 1", "Step 4 states k = 5, not k = 1: the classifier looks at the five closest samples.", "В шаге 4 указано k = 5, а не k = 1: классификатор смотрит на пять ближайших образцов."],
          ["A neural network trained after recording", "There is no separate training step: the recorded samples themselves form the model.", "Отдельного шага обучения нет: модель — это сами записанные образцы."],
          ["k-means clustering into 5 groups", "k-means groups unlabeled data; YeahTrack classifies with k-nearest neighbours (Cover & Hart, 1967).", "k-means группирует неразмеченные данные; YeahTrack классифицирует методом k ближайших соседей (Cover & Hart, 1967)."],
        ], "Step 4: a k-nearest neighbours classifier with k = 5 selects the closest gesture, and each gesture has its own distance threshold.", "Шаг 4: классификатор k ближайших соседей с k = 5 выбирает ближайший жест, и у каждого жеста свой порог расстояния."),
        qx("When does a recognised gesture actually trigger its command?", "When it wins at least 70% of frames in a 450 ms window", [
          ["When it holds a continuous chain of good frames", "That was the old rule: it lost 6–21% of genuine attempts (R-14) and was replaced by voting.", "Это старое правило: оно теряло 6–21% настоящих попыток (R-14), и его заменило голосование."],
          ["When it wins at least 50% of frames in a 450 ms window", "Step 5 sets the required share at 70%, not 50%.", "В шаге 5 нужная доля — 70%, а не 50%."],
          ["When it is the nearest match in a single frame", "One frame is never enough: the gesture must win the voting window, so random movements are ignored.", "Одного кадра мало: жест должен выиграть окно голосования, поэтому случайные движения игнорируются."],
        ], "Step 5: a gesture fires only if it wins at least 70% of the frames in a 450 ms window, which stops random hand movements from triggering commands.", "Шаг 5: жест срабатывает, только если побеждает минимум в 70% кадров окна 450 мс, — так случайные движения руки не запускают команды."),
        qx("A new gesture is usable right after its 20–30 s recording. Why?", "The recorded samples themselves form the model", [
          ["A model is trained on a cloud server meanwhile", "Nothing is sent over the network and cloud storage is out of scope; the samples are the model.", "Ничего не уходит в сеть, а облачное хранение вне рамок проекта; модель — это сами образцы."],
          ["MediaPipe already knows every possible gesture", "MediaPipe only finds the 21 landmarks; which gestures exist is decided by the user's recordings.", "MediaPipe только находит 21 точку; какие жесты существуют, решают записи пользователя."],
          ["It is picked from a fixed built-in gesture set", "A fixed set is what existing tools offer; YeahTrack takes the opposite approach.", "Фиксированный набор дают существующие программы; YeahTrack делает наоборот."],
        ], "Because the recorded samples themselves form the model, there is no separate training step, and the gesture can be used as soon as the recording ends.", "Модель — это сами записанные образцы, поэтому отдельного шага обучения нет и жестом можно пользоваться сразу после записи."),
        qx("Which frame rates does the report give for YeahTrack?", "56 FPS with GPU, about 22 FPS in CPU-only mode", [
          ["56 FPS in CPU-only mode, about 22 FPS with GPU", "The values are swapped: the GPU gives 56 FPS, the CPU-only background mode about 22.", "Значения перепутаны: с GPU — 56 FPS, в фоновом режиме только на CPU — около 22."],
          ["30 FPS on both, the webcam's own limit", "30 fps is the Logitech C270 specification in Table 8, not the measured frame rate.", "30 fps — характеристика Logitech C270 из таблицы 8, а не измеренная частота кадров."],
          ["20 FPS with GPU, exactly the minimum target", "20 FPS is the target in the quality baseline; with GPU the app reached 56 FPS.", "20 FPS — цель в базовом плане качества; с GPU приложение показало 56 FPS."],
        ], "Table 20: 56 FPS with GPU and about 22 FPS in CPU-only background mode, against a target of at least 20 FPS.", "Таблица 20: 56 FPS с GPU и около 22 FPS в фоновом режиме только на CPU при цели не меньше 20 FPS."),
        qx("What does YeahTrack keep on the user's computer for each trained gesture?", "A list of coordinates, with no images", [
          ["Short video clips of the hand", "Images are not saved: each gesture is stored only as a list of coordinates.", "Изображения не сохраняются: каждый жест хранится только как список координат."],
          ["Coordinates synced to a cloud account", "Cloud storage is explicitly out of scope; gestures stay only on the user's machine (R-04).", "Облачное хранение прямо исключено из рамок; жесты остаются только на машине пользователя (R-04)."],
          ["Screenshots uploaded to yeahtrack.site", "No frame is ever sent to a server; the site only hosts the browser version and the landing page.", "Ни один кадр не отправляется на сервер; сайт только раздаёт браузерную версию и лендинг."],
        ], "Every gesture is stored on the user's machine as a list of coordinates; images are not saved and frames never leave the computer, so the app also works offline.", "Каждый жест хранится на машине пользователя как список координат; изображения не сохраняются, кадры не покидают компьютер, поэтому программа работает и без интернета."),
        qx("On 5 October 2026, what does the remaining work of YeahTrack concentrate on?", "Verification: real users, lighting and user testing", [
          ["New features such as two-hand gestures", "Two-hand gestures are excluded from scope, and the gained time goes to the studies, not to features.", "Жесты двумя руками исключены из рамок, а выигранное время идёт на исследования, а не на функции."],
          ["Building and shipping the Windows version with Electron", "Windows is not in scope at this stage; CR-05 is still pending.", "Windows на этом этапе вне рамок проекта; CR-05 всё ещё ждёт решения."],
          ["Finishing gesture training, which is behind plan", "Gesture training (M5) was completed early, on 16 Sep; development is ahead of plan.", "Обучение жестам (M5) завершено досрочно, 16 сентября; разработка опережает план."],
        ], "Section 1.3: the remaining work is verification — accuracy on real users instead of synthetic data, the effect of lighting, and the user testing.", "Раздел 1.3: оставшаяся работа — проверка: точность на реальных пользователях вместо синтетических данных, влияние освещения и пользовательское тестирование."),
        tfx("In the browser version, a recognised gesture can press keys in other apps on the computer.", false, "In the browser version the command is limited to actions inside the web page; only the desktop bridge sends keys, mouse and media commands to the system.", "В браузерной версии команда ограничена действиями внутри веб-страницы; клавиши, мышь и медиакоманды в систему отправляет только мост десктопной версии.", "Choosing True is exactly the misunderstanding of risk R-11: users may expect a web page to control the system, but it cannot.", "Ответ True — ровно то заблуждение, что описано в риске R-11: пользователи могут ждать, что веб-страница управляет системой, но она не может."),
        qx("Which pair of facts makes YeahTrack a project in Kerzner’s sense?", "Fixed dates 1 Sep – 4 Nov and a unique result", [
          ["A team of four students and a shared Telegram group", "Team size and chat tools do not define a project; temporariness and uniqueness do.", "Размер команды и чат не делают работу проектом; проектом её делают временность и уникальность."],
          ["Open-source tools and an ordinary webcam", "Tools are resources; the definition is about a temporary endeavor and a unique result.", "Инструменты — это ресурсы; определение говорит о временном предприятии и уникальном результате."],
          ["Repeating the same work every semester", "Repeating the same work is operations, the opposite of a temporary, unique project.", "Повторять одну и ту же работу — это операционная деятельность, противоположность временного уникального проекта."],
        ], "L1: a project is a temporary endeavor undertaken to create a unique product, service, or result — YeahTrack runs 1 Sep – 4 Nov 2026 and lets users train their own gestures.", "L1: проект — временное предприятие ради уникального продукта, услуги или результата; YeahTrack идёт с 1 сентября по 4 ноября 2026 и даёт пользователям учить свои жесты."),
        qx("Kerzner says a project is multifunctional. Which YeahTrack fact shows this?", "Work spans recognition, storage, website and QA", [
          ["All code came from a single account", "One author is risk R-03 — knowledge concentrated in one person — not proof of several functions.", "Один автор — это риск R-03, знания у одного человека, а не доказательство нескольких функций."],
          ["It runs on Linux GNOME and also in any web browser", "Two platforms describe the product, not the functional lines the work cuts across.", "Две платформы описывают продукт, а не функциональные линии, через которые идёт работа."],
          ["It has twelve milestones, M1 to M12", "Milestones describe the schedule, not the different functions involved in the work.", "Вехи описывают расписание, а не разные функции, участвующие в работе."],
        ], "Multifunctional = cuts across several functional lines. The four areas — core recognition, storage and build, website, quality and documentation — show it.", "Многофункциональный = проходит через несколько функциональных линий. Это видно по четырём зонам: ядро распознавания, хранение и сборка, сайт, качество и документация."),
        qx("Kerzner lists ‘funding limits’ among project traits. Which YeahTrack figure is that limit?", "Cash budget of 57 104 KZT paid by the team", [
          ["708 240 KZT paid to members as salaries", "Labour is valued at 708 240 KZT but not paid: it is an in-kind contribution of the students.", "Труд оценён в 708 240 KZT, но не оплачивается: это вклад студентов натурой (in-kind)."],
          ["765 344 KZT of cash spent on purchases", "765 344 KZT is the total economic cost including unpaid labour; cash is 57 104 KZT.", "765 344 KZT — полная экономическая стоимость вместе с неоплачиваемым трудом; денег — 57 104 KZT."],
          ["Unlimited, because a sponsor pays the costs", "There is no external sponsor funding; four members pay equal shares of about 14 276 KZT.", "Внешнего финансирования нет; четверо участников платят равными долями примерно по 14 276 KZT."],
        ], "The cash budget is 51 913 KZT of purchases plus a 10% reserve = 57 104 KZT, paid by the four members in equal shares.", "Денежный бюджет — 51 913 KZT покупок плюс резерв 10% = 57 104 KZT, его оплачивают четверо участников равными долями."),
        qx("Examiner: «95% accuracy — so it already works for real users?» What is the best answer?", "Not yet: 95% is on synthetic hands; real video comes next", [
          ["Yes, 95% proves it works for any user", "Over-claiming: real video is not measured yet (R-01), and the plan says not to claim it before then.", "Преувеличение: реальное видео ещё не измерено (R-01), и план прямо запрещает заявлять это раньше времени."],
          ["No, the synthetic tests are unreliable, so just ignore them", "Denies the report: the tests confirm the recognition logic; they just do not replace real people.", "Отрицает отчёт: тесты подтверждают логику распознавания, просто не заменяют реальных людей."],
          ["Ask Aizat: the accuracy study is not my area", "Shifts the answer to a teammate; the whole team defends the plan, and R-01 is owned by Ayat.", "Перекладывает ответ на другого; план защищает вся команда, а риск R-01 закреплён за Ayat."],
        ], "Honest answer: 95% is per frame on synthetic hands (tilt up to ±10°); accuracy on real video is risk R-01 and is measured by M8 on 15 Oct.", "Честный ответ: 95% — по кадрам на синтетических руках (наклон до ±10°); точность на реальном видео — риск R-01, её измерят к M8, 15 октября."),
        qx("Examiner: «Why does it run only on Linux?» What is the most honest answer?", "Windows is pending as CR-05; desktop now needs GNOME Wayland", [
          ["Windows already works, we just haven't tested it", "False: there is no Windows version yet (R-06); the decision is CR-05, still pending.", "Неправда: версии для Windows пока нет (R-06); решение — CR-05, оно ещё не принято."],
          ["Linux is simply better, so Windows users do not matter to us", "Dismissive, and it contradicts the report, which treats Windows as an open decision.", "Пренебрежительно и противоречит отчёту, где Windows — открытое решение."],
          ["Yernar picked Linux alone, so we cannot change it", "Blames a teammate and is wrong: no member may change the scope alone, and changes follow Section 6.", "Сваливает на товарища и неверно: никто не меняет рамки проекта в одиночку, изменения идут по разделу 6."],
        ], "The desktop version runs only on GNOME Wayland (R-05); Windows is not in scope at this stage, and CR-05 decides whether to build it with Electron or remove the promise.", "Десктопная версия работает только в GNOME Wayland (R-05); Windows на этом этапе вне рамок, а CR-05 решает — собрать её на Electron или убрать обещание с сайта."),
      ],
    ),
    part(
      "pd-b1-p2",
      { en: "Goal, objectives, deliverables and approach", ru: "Цель, задачи, результаты и подход" },
      {
        en: `## What we wrote
**Goal** (Section 1.4): to deliver a **working application** in which users can **train their own gestures** and **link them to computer commands** by **4 November 2026**.
| Objective | Target | How it will be confirmed |
|---|---|---|
| Recognise user-trained gestures | **at least 90%** accuracy | 5 people × 5 gestures × 20 attempts on video, then the 30 test users |
| Add a new gesture | **under one minute** | stopwatch during user testing |
| Test the application | **at least 30 users** | each trains 3 gestures and performs each 20 times (WBS 4.3, M11 on 1 Nov) |
The objectives are **measurable**, so at the end the team can say **yes or no** for each one; the first two are copied into the **quality baseline** (Table 20).
## Deliverables and who accepts them
Section 1.4 names three groups of deliverables: a **working desktop application for Linux (GNOME) and a browser version**, a **short user guide**, and **test results and the final presentation**. Table 10 gives each one acceptance criteria:
| Deliverable | Accepted when… | Accepted by |
|---|---|---|
| Desktop application (Linux, GNOME) | records a gesture in under 1 min; at least 90% in the user test; executes the command; passes all automated tests | whole team, then the sponsor |
| Browser version | opens at yeahtrack.site/app; records and recognises gestures; explains that it cannot control the system | Ayat, Akbota |
| User guide | a new user installs the app and sets up one gesture without help | Aizat, then two test users |
| Test results | accuracy study, lighting study and the 30-user test, compared with the quality baseline | Aizat, Ayat |
| Final presentation | objectives, results and lessons; a live or recorded demonstration | whole team |
![Figure 4 of the report: the project website yeahtrack.site — the headline «Teach your computer your own hand signs», a glowing hand logo, and two buttons, «Try it in the browser» and «Download for Linux»](/events/pm/yeahtrack-website.webp)
## Approach: Scrum-like work inside a PMBOK plan
- The project follows an **iterative Agile approach based on Scrum** (Schwaber & Sutherland, 2020). With **about two months**, the team works in **short iterations**: a working version is produced, **reviewed by the team**, and the next steps are planned from that review.
- The **structure of planning and control follows the PMBOK Guide (PMI, 2021)**: the plan covers how the **scope, schedule, cost, quality, risks and team** are planned and controlled.
- **Day-to-day** communication is in a **Telegram group**; the **code, tasks and change records** are on **GitHub**.
- **No member may change the scope alone**: every change follows the seven-step procedure of Section 6.
- On **5 October 2026** each member received an area: **Ayat** — core of the product (recognition, bridge, architecture); **Yernar** — storage, build and deployment; **Akbota** — website and demonstration; **Aizat** — quality control and documentation.
## Sponsor acceptance (Section 19)
By signing, the **project sponsor** confirms that they have **reviewed the plan** and **agree with the scope, schedule, budget and its funding, baselines and management approach**. The **Name, Position, Signature and Date** lines are **still empty**; the plan is prepared by all four members of team «Ayat's soldiers».
## The theory behind it
**Five process groups** (L1, PMBOK): **Initiation, Planning, Execution, Monitoring and control, Closure**. Where YeahTrack stands on 5 October:
@diagram pm-process-groups
| Process group | In the lecture | YeahTrack |
|---|---|---|
| Initiation | select the project, recognise its benefits, prepare documents to sanction it | done |
| Planning | define work requirements, quality, resources, schedule, risks | done: M1, plan approved 5 Sep |
| Execution | direct and manage the work, help the team improve | active: development, the studies from 6 Oct |
| Monitoring and control | track progress, compare actual with predicted, analyse variances, adjust | active: check-ins, weekly meeting, change log, risk register, time log |
| Closure | verify that all work is done; administrative closure | 4 Nov: final presentation, sponsor acceptance, team release |
Kerzner also says **planning is iterative** and goes on through the life of the project — our change requests **CR-01 to CR-05** are exactly this re-planning.
**Success** (L1): the objectives are achieved **within time, within cost, at the desired performance, and accepted by the customer**:
| Criterion | YeahTrack |
|---|---|
| Within time | by 4 November 2026 |
| Within cost | cash 57 104 KZT; 300 hours of effort |
| Desired performance | at least 90% accuracy, under 1 minute per gesture, 30 users |
| Accepted by the customer | sponsor acceptance, Section 19 |
Kerzner's longer list adds **«with minimum or mutually agreed upon scope changes»** — every major change (CR-01 to CR-04) needed the agreement of all four members.
**Project charter** (L2): an internal document that states the project manager's authority and the **customer-approved scope**; in theory the sponsor prepares and signs it, in reality the PM often prepares it for the sponsor's signature. Our report is a **project management plan, not a separate charter**, but it holds the charter's minimum content — description, objectives, **scope inclusions and exclusions** (Section 3), roles, risks — and **Section 19 plays the role of the charter signature**.
**Deliverables** (L1) are measurable, tangible outputs. In Kerzner's terms the user guide and the test results are **software deliverables** (documents, ‘paper products’), and this midterm report is an **interim deliverable** on the way to the final one.
## How to say it at the defense
- **Say:** “Our goal is a working app where users train their own gestures and link them to commands by 4 November.”
- **Say:** “We have three measurable objectives: at least 90% accuracy, under a minute per gesture and 30 test users.”
- **Say:** “We build in short Scrum-like iterations, and we plan and control the project with the PMBOK structure.”
- **Say:** “We have finished initiation and planning; now we are in execution and monitoring and control.”
- **Say:** “We present this plan for the sponsor's approval; Section 19 is our charter signature.”
## Weak spots and honest answers
- **«Section 19 is empty — is the plan approved?»** — Not formally yet. M1 «Project plan approved» (5 Sep) is a milestone of our own schedule; the sponsor's signature is still empty, and we **present the plan for approval at the midterm**. We never claim a signature that is not there.
- **«Agile and PMBOK at once — isn't that a contradiction?»** — No. Scrum-like iterations organise **how we build**; PMBOK gives the **structure of planning and control**. The baselines stay fixed, and changes go through change control.
- **«Are your objectives already met?»** — Not yet. Accuracy so far is on **synthetic hands**, and the **30-user test** runs 20 Oct – 1 Nov; that is why user testing starts on 20 October **in any case**.
> Success for YeahTrack = working by 4 November, within 57 104 KZT and 300 hours, at least 90% accuracy, under a minute per gesture, 30 users — and accepted by the sponsor.
## Check yourself
?? Which process groups are finished at the midterm, and which are active?
?= Initiation and Planning are done (M1, plan approved 5 Sep); Execution and Monitoring and control are active; Closure comes on 4 November.
?? What plays the role of the project charter for YeahTrack?
?= The project management plan itself; Section 19 «Sponsor Acceptance» is the charter signature — still empty, so the plan is presented for approval at the midterm.`,
        ru: `## Что мы написали
**Цель (goal)** (раздел 1.4): к **4 ноября 2026** выпустить **работающее приложение**, в котором пользователи **обучают свои жесты** и **связывают их с командами компьютера**.
| Задача (objective) | Целевое значение | Как подтвердим |
|---|---|---|
| Распознавать жесты, обученные пользователем | точность **не ниже 90%** | 5 человек × 5 жестов × 20 попыток на видео, затем 30 тестовых пользователей |
| Добавлять новый жест | **меньше минуты** | секундомер на пользовательском тестировании |
| Протестировать приложение | **не меньше 30 пользователей** | каждый обучает 3 жеста и выполняет каждый 20 раз (WBS 4.3, M11 — 1 ноября) |
Задачи **измеримые**, поэтому в конце команда может ответить **да или нет** по каждой; первые две перенесены в **базовый план качества (quality baseline)** (таблица 20).
## Результаты и кто их принимает
Раздел 1.4 называет три группы результатов (deliverables): **работающее десктопное приложение для Linux (GNOME) и браузерная версия**, **краткое руководство пользователя** и **результаты тестов и финальная презентация**. В таблице 10 у каждого есть критерии приёмки:
| Результат | Принят, когда… | Кто принимает |
|---|---|---|
| Десктопное приложение (Linux, GNOME) | записывает жест меньше чем за 1 мин; не ниже 90% на пользовательском тесте; выполняет команду; проходит все автотесты | вся команда, затем спонсор |
| Браузерная версия | открывается на yeahtrack.site/app; записывает и распознаёт жесты; объясняет, что не может управлять системой | Ayat, Akbota |
| Руководство пользователя | новый пользователь сам устанавливает программу и настраивает один жест | Aizat, затем два тестовых пользователя |
| Результаты тестов | исследование точности, исследование освещения и тест на 30 пользователях в сравнении с базовым планом качества | Aizat, Ayat |
| Финальная презентация | задачи, результаты и уроки; живая или записанная демонстрация | вся команда |
![Рисунок 4 из отчёта: сайт проекта yeahtrack.site — заголовок «Teach your computer your own hand signs», светящийся логотип-ладонь и две кнопки: «Try it in the browser» и «Download for Linux»](/events/pm/yeahtrack-website.webp)
## Подход: работа как в Scrum внутри плана по PMBOK
- Проект идёт по **итеративному Agile-подходу на принципах Scrum** (Schwaber & Sutherland, 2020). Времени **около двух месяцев**, поэтому команда работает **короткими итерациями**: делает рабочую версию, **команда её разбирает**, и по итогам планируются следующие шаги.
- **Структура планирования и контроля — по PMBOK Guide (PMI, 2021)**: план описывает, как планируются и контролируются **рамки (scope), сроки, стоимость, качество, риски и команда**.
- **Ежедневное** общение — в **группе Telegram**; **код, задачи и записи об изменениях** — на **GitHub**.
- **Никто не может изменить рамки проекта в одиночку**: любое изменение идёт по процедуре из семи шагов (раздел 6).
- **5 октября 2026** каждый получил свою зону: **Ayat** — ядро продукта (распознавание, мост, архитектура); **Yernar** — хранение, сборка и развёртывание; **Akbota** — сайт и демонстрация; **Aizat** — контроль качества и документация.
## Приёмка спонсором (раздел 19)
Подписывая, **спонсор проекта** подтверждает, что **ознакомился с планом** и **согласен с рамками, сроками, бюджетом и его финансированием, базовыми планами и подходом к управлению**. Строки **Name, Position, Signature и Date** **пока пусты**; план подготовили все четверо участников команды «Ayat's soldiers».
## Теория за этим
**Пять групп процессов (process groups)** (L1, PMBOK): **Initiation, Planning, Execution, Monitoring and control, Closure**. Где YeahTrack на 5 октября:
@diagram pm-process-groups
| Группа процессов | В лекции | YeahTrack |
|---|---|---|
| Initiation (инициация) | выбрать проект, увидеть выгоду, подготовить документы для его утверждения | завершена |
| Planning (планирование) | определить требования к работе, качество, ресурсы, расписание, риски | завершено: M1, план утверждён 5 сентября |
| Execution (исполнение) | руководить работой, помогать команде расти | идёт: разработка, исследования с 6 октября |
| Monitoring and control (мониторинг и контроль) | отслеживать прогресс, сравнивать факт с планом, анализировать отклонения, корректировать | идёт: check-in, еженедельная встреча, журнал изменений, реестр рисков, журнал часов |
| Closure (закрытие) | проверить, что вся работа сделана; административное закрытие | 4 ноября: финальная презентация, приёмка спонсором, роспуск команды |
Kerzner также говорит, что **планирование итеративно** и идёт всю жизнь проекта, — наши запросы на изменение **CR-01 – CR-05** и есть такое перепланирование.
**Успех (success)** (L1): цели достигнуты **в срок (within time), в рамках бюджета (within cost), на нужном уровне качества (desired performance) и приняты заказчиком (accepted by the customer)**:
| Критерий | YeahTrack |
|---|---|
| В срок | к 4 ноября 2026 |
| В рамках бюджета | деньги 57 104 KZT; 300 часов работы |
| Нужный уровень | точность не ниже 90%, меньше 1 минуты на жест, 30 пользователей |
| Принят заказчиком | приёмка спонсором, раздел 19 |
Расширенный список Kerzner добавляет **«with minimum or mutually agreed upon scope changes»** (с минимальными или согласованными изменениями рамок) — каждое крупное изменение (CR-01 – CR-04) требовало согласия всех четверых.
**Устав проекта (project charter)** (L2): внутренний документ, где записаны полномочия руководителя проекта и **рамки, одобренные заказчиком**; в теории его готовит и подписывает спонсор, на практике его часто готовит PM на подпись спонсору. Наш отчёт — **план управления проектом, а не отдельный устав**, но в нём есть минимум содержания устава — описание, цели, **что входит и не входит в рамки** (раздел 3), роли, риски, — а **раздел 19 играет роль подписи под уставом**.
**Результаты (deliverables)** (L1) — измеримые, осязаемые итоги работы. В терминах Kerzner руководство пользователя и результаты тестов — **software deliverables** (документы, «бумажные продукты»), а этот мидтерм-отчёт — **промежуточный результат (interim deliverable)** на пути к финальному.
## Как сказать на защите
- **Скажи:** «Our goal is a working app where users train their own gestures and link them to commands by 4 November.» — наша цель — к 4 ноября работающее приложение, где пользователи учат свои жесты и связывают их с командами.
- **Скажи:** «We have three measurable objectives: at least 90% accuracy, under a minute per gesture and 30 test users.» — у нас три измеримые задачи: точность от 90%, меньше минуты на жест и 30 тестовых пользователей.
- **Скажи:** «We build in short Scrum-like iterations, and we plan and control the project with the PMBOK structure.» — строим короткими итерациями как в Scrum, а планируем и контролируем по структуре PMBOK.
- **Скажи:** «We have finished initiation and planning; now we are in execution and monitoring and control.» — инициация и планирование завершены; сейчас исполнение и мониторинг с контролем.
- **Скажи:** «We present this plan for the sponsor's approval; Section 19 is our charter signature.» — мы представляем план на утверждение спонсору; раздел 19 — наша подпись под уставом.
## Слабые места и честные ответы
- **«Section 19 is empty — is the plan approved?»** (раздел 19 пуст — план утверждён?) — Формально ещё нет. M1 «Project plan approved» (5 сентября) — веха нашего собственного расписания; подпись спонсора пока пуста, и мы **представляем план на утверждение на мидтерме**. Мы никогда не заявляем подпись, которой нет.
- **«Agile and PMBOK at once — isn't that a contradiction?»** (Agile и PMBOK вместе — разве это не противоречие?) — Нет. Итерации как в Scrum определяют, **как мы строим**; PMBOK даёт **структуру планирования и контроля**. Базовые планы зафиксированы, изменения идут через управление изменениями.
- **«Are your objectives already met?»** (ваши задачи уже выполнены?) — Пока нет. Точность пока измерена на **синтетических руках**, а **тест на 30 пользователях** идёт 20 октября – 1 ноября; поэтому пользовательское тестирование начинается 20 октября **в любом случае**.
> Успех YeahTrack = работает к 4 ноября, в пределах 57 104 KZT и 300 часов, точность от 90%, меньше минуты на жест, 30 пользователей — и принят спонсором.
## Проверь себя
?? Какие группы процессов на мидтерме завершены, а какие идут?
?= Initiation и Planning завершены (M1, план утверждён 5 сентября); Execution и Monitoring and control идут; Closure — 4 ноября.
?? Что играет роль устава проекта (project charter) для YeahTrack?
?= Сам план управления проектом; раздел 19 «Sponsor Acceptance» — подпись под уставом, она пока пуста, поэтому план представляется на утверждение на мидтерме.`,
      },
      [
        qx("By what date must YeahTrack deliver a working application, according to its goal?", "4 November 2026", [
          ["1 November 2026", "1 November is M11, the end of user testing; the goal date is 4 November.", "1 ноября — это M11, конец пользовательского тестирования; срок цели — 4 ноября."],
          ["20 October 2026", "20 October is M10, all features ready; testing and the user guide still follow.", "20 октября — это M10, все функции готовы; тестирование и руководство ещё впереди."],
          ["5 October 2026", "5 October is the midterm review of the plan, not the end of the project.", "5 октября — мидтерм-обзор плана, а не конец проекта."],
        ], "Goal: to deliver a working application in which users can train their own gestures and link them to computer commands by 4 November 2026.", "Цель: к 4 ноября 2026 выпустить работающее приложение, где пользователи обучают свои жесты и связывают их с командами компьютера."),
        qx("Which set matches the three objectives in Section 1.4?", "≥ 90% accuracy, < 1 min per gesture, ≥ 30 users", [
          ["≥ 95% accuracy, < 1 min per gesture, ≥ 30 users", "95% is a synthetic result at small tilt; the objective is at least 90%.", "95% — синтетический результат при малом наклоне; задача — не ниже 90%."],
          ["≥ 90% accuracy, < 30 s per gesture, ≥ 30 users", "20–30 s is the recording time; the objective is under one minute per gesture.", "20–30 с — это время записи; задача — меньше минуты на жест."],
          ["≥ 90% accuracy, < 1 min per gesture, ≥ 5 users", "5 people take part in the accuracy study; the user test needs at least 30.", "5 человек участвуют в исследовании точности; пользовательский тест — минимум 30."],
        ], "Objectives: recognise user-trained gestures with at least 90% accuracy; add a new gesture in under one minute; test with at least 30 users.", "Задачи: распознавать обученные пользователем жесты с точностью не ниже 90%; добавлять жест меньше чем за минуту; протестировать минимум на 30 пользователях."),
        qx("Which of these is NOT a deliverable listed in Section 1.4?", "A Windows desktop application", [
          ["A short user guide", "The short user guide is the second deliverable in Section 1.4.", "Краткое руководство пользователя — второй результат в разделе 1.4."],
          ["Test results and the final presentation", "Test results and the final presentation are the third deliverable group.", "Результаты тестов и финальная презентация — третья группа результатов."],
          ["A browser version of the application", "The browser version is delivered together with the Linux desktop application.", "Браузерная версия сдаётся вместе с десктопным приложением для Linux."],
        ], "Deliverables: a Linux (GNOME) desktop app and a browser version, a short user guide, test results and the final presentation. Windows is not in scope at this stage (R-06, CR-05).", "Результаты: десктоп для Linux (GNOME) и браузерная версия, краткое руководство, результаты тестов и финальная презентация. Windows на этом этапе вне рамок (R-06, CR-05)."),
        qx("Which management approach does the report describe for YeahTrack?", "Agile iterations based on Scrum, inside a PMBOK plan", [
          ["Pure waterfall, with one single release at the very end", "The team works in short iterations: build a version, review it, plan the next step.", "Команда работает короткими итерациями: версия, разбор, план следующего шага."],
          ["PMBOK only, with no iterations at all", "The report states an iterative Agile approach based on the principles of Scrum.", "В отчёте прямо указан итеративный Agile-подход на принципах Scrum."],
          ["Scrum only, with no written plan or baselines", "The report is a full plan with scope, schedule, cost and quality baselines.", "Отчёт — полноценный план с базовыми планами рамок, сроков, стоимости и качества."],
        ], "Section 2: an iterative Agile approach based on Scrum (Schwaber & Sutherland, 2020); the structure of planning and control follows the PMBOK Guide (PMI, 2021).", "Раздел 2: итеративный Agile-подход на принципах Scrum (Schwaber & Sutherland, 2020); структура планирования и контроля — по PMBOK Guide (PMI, 2021)."),
        qx("Why does the team develop YeahTrack in short iterations?", "The timeline is short, only about two months", [
          ["The sponsor requires a release every week", "The report gives no such requirement; the reason is the short timeline.", "В отчёте такого требования нет; причина — короткий срок."],
          ["The project has no baselines to follow", "It does have baselines — schedule, cost and quality — kept under change control.", "Базовые планы есть — сроки, стоимость, качество — и они под управлением изменениями."],
          ["Iterations remove the need for change control", "Every change still follows the seven-step procedure of Section 6.", "Любое изменение всё равно идёт по процедуре из семи шагов в разделе 6."],
        ], "Given the short timeline of approximately two months, the team develops the product in short iterations: build, review as a team, plan the next steps.", "Из-за короткого срока — около двух месяцев — команда делает продукт короткими итерациями: версия, разбор командой, план следующих шагов."),
        qx("Who may change the scope of YeahTrack on their own?", "No one: every change follows the Section 6 procedure", [
          ["Ayat, because the team lead has the final word on everything", "Ayat decides only when the team cannot agree on a change, and even then the change follows Section 6.", "Ayat решает, только если команда не договорилась об изменении, и даже тогда оно идёт по разделу 6."],
          ["The owner of the affected area", "The owner assesses the impact; even a minor change needs the owner and Ayat.", "Владелец оценивает влияние; даже мелкое изменение утверждают владелец и Ayat."],
          ["Any member, as long as the change needs less than 4 hours", "Under 4 hours makes a change minor, but it is still approved by the area owner and Ayat.", "Меньше 4 часов делает изменение мелким, но его всё равно утверждают владелец зоны и Ayat."],
        ], "Section 2: no member may change the scope alone; every change follows the procedure in Section 6.", "Раздел 2: никто не может изменить рамки проекта в одиночку; любое изменение идёт по процедуре раздела 6."),
        qx("By signing Section 19, what does the project sponsor confirm?", "Agreement with scope, schedule, budget, baselines and approach", [
          ["That the application already reaches 90% accuracy on real users", "Accuracy is confirmed later by testing; the signature approves the plan.", "Точность подтвердят позже тестами; подпись утверждает план."],
          ["That the sponsor will pay for all the purchases in Table 8", "There is no external sponsor funding; the team pays the cash budget.", "Внешнего финансирования нет; денежный бюджет оплачивает команда."],
          ["That the four members will be paid salaries", "The members are students and are not paid; labour is an in-kind contribution.", "Участники — студенты, им не платят; труд — вклад натурой."],
        ], "The sponsor confirms they reviewed the plan and agree with the scope, schedule, budget and its funding, baselines and management approach.", "Спонсор подтверждает, что ознакомился с планом и согласен с рамками, сроками, бюджетом и его финансированием, базовыми планами и подходом к управлению."),
        qx("According to Table 10, who accepts the browser version?", "Ayat and Akbota", [
          ["Aizat and Ayat", "Aizat and Ayat accept the test results, not the browser version.", "Aizat и Ayat принимают результаты тестов, а не браузерную версию."],
          ["Aizat, then two test users", "That is how the user guide is accepted.", "Так принимается руководство пользователя."],
          ["The whole team, then the sponsor", "That is the acceptance path of the desktop application.", "Это порядок приёмки десктопного приложения."],
        ], "Table 10: the browser version is accepted by Ayat and Akbota once it opens at yeahtrack.site/app, records and recognises gestures, and explains it cannot control the system.", "Таблица 10: браузерную версию принимают Ayat и Akbota, когда она открывается на yeahtrack.site/app, записывает и распознаёт жесты и объясняет, что не управляет системой."),
        tfx("The objective of testing with at least 30 users is confirmed by milestone M11 on 1 November 2026.", true, "M11, User testing with 30 participants complete, is dated 1 November 2026; WBS 4.3 runs from 20 Oct to 1 Nov.", "M11, «пользовательское тестирование на 30 участниках завершено», — 1 ноября 2026; WBS 4.3 идёт с 20 октября по 1 ноября.", "Choosing False would mix M11 up with M10 (20 Oct, features ready) or M12 (4 Nov, guide and presentation).", "Ответ False путает M11 с M10 (20 октября, функции готовы) или M12 (4 ноября, руководство и презентация)."),
        qx("On 5 October, which process groups is YeahTrack mainly in?", "Execution plus Monitoring and Controlling", [
          ["Initiation, as the plan is not written yet", "The plan exists and M1 is completed; initiation and planning are done.", "План есть, M1 выполнена; инициация и планирование завершены."],
          ["Planning, as no work has been done yet", "The main features already work, several of them ahead of plan.", "Основные функции уже работают, часть — раньше плана."],
          ["Closing, as development finished early", "Development is ahead, but the studies, user testing and acceptance remain; closing is on 4 Nov.", "Разработка впереди графика, но исследования, тестирование и приёмка ещё впереди; закрытие — 4 ноября."],
        ], "At the midterm, Initiation and Planning are done (M1, 5 Sep); the project is in Execution plus Monitoring and Controlling — check-ins, weekly meeting, change log, risk register, time log.", "На мидтерме Initiation и Planning завершены (M1, 5 сентября); проект в Execution и Monitoring and Controlling — check-in, еженедельная встреча, журнал изменений, реестр рисков, журнал часов."),
        qx("Kerzner’s success needs ‘within cost’. Which limit applies to YeahTrack?", "57 104 KZT of cash and 300 hours of effort", [
          ["765 344 KZT of cash, the total economic cost", "765 344 KZT is the total economic cost, including the unpaid labour.", "765 344 KZT — полная экономическая стоимость вместе с неоплачиваемым трудом."],
          ["51 913 KZT, with no reserve allowed", "The cash budget includes a 10% reserve: 51 913 + 5 191 = 57 104 KZT.", "В денежный бюджет входит резерв 10%: 51 913 + 5 191 = 57 104 KZT."],
          ["708 240 KZT paid out to the members", "708 240 KZT values the labour, but nobody pays it out.", "708 240 KZT — оценка труда, но эти деньги никто не выплачивает."],
        ], "Within cost for YeahTrack means the cash budget of 57 104 KZT and the effort baseline of 300 hours.", "В рамках бюджета для YeahTrack — это денежный бюджет 57 104 KZT и базовый план трудозатрат 300 часов."),
        qx("In L2 terms, what plays the role of the project charter for YeahTrack?", "Our plan, with Section 19 as its signature", [
          ["The risk register in docs/RISKS.md", "The risk register lists risks; it does not authorise the project or carry a signature.", "Реестр рисков перечисляет риски; он не утверждает проект и не несёт подписи."],
          ["The change log, CR-01 to CR-05", "The change log records changes after the baseline; it does not authorise the project.", "Журнал изменений фиксирует изменения после базового плана; он не утверждает проект."],
          ["The README file in the GitHub repository", "The README documents the software; it carries no sponsor approval.", "README описывает программу; одобрения спонсора в нём нет."],
        ], "The report is a project management plan, not a separate charter; Section 19 Sponsor Acceptance plays the role of the charter signature.", "Отчёт — план управления проектом, а не отдельный устав; раздел 19 Sponsor Acceptance играет роль подписи под уставом."),
        qx("In Kerzner’s terms, what kind of deliverable is this midterm report?", "An interim deliverable on the way to the final one", [
          ["A hardware deliverable, like a prototype", "Hardware deliverables are physical items; a report is a paper product.", "Hardware deliverables — физические предметы; отчёт — бумажный продукт."],
          ["The final deliverable, which closes the whole project now", "Closing is on 4 November, with the final presentation and acceptance.", "Закрытие — 4 ноября, с финальной презентацией и приёмкой."],
          ["Not a deliverable, only course paperwork", "Kerzner counts reports and documents as deliverables too.", "Kerzner тоже считает отчёты и документы результатами."],
        ], "L1: interim deliverables progressively evolve as the project proceeds, for example a series of interim reports leading to the final report.", "L1: промежуточные результаты (interim deliverables) развиваются по ходу проекта — например, серия промежуточных отчётов перед финальным."),
        qx("Examiner: «Section 19 has no signature. Is your plan approved?» What is the best answer?", "Not yet formally: we present it for approval today", [
          ["Yes, M1 proves the sponsor signed it on 5 Sep", "Over-claims: the signature block is empty, so no sponsor signature exists.", "Преувеличение: блок подписи пуст, подписи спонсора нет."],
          ["Agile projects do not need any approval", "Wrong: sponsor acceptance is part of the plan and of success.", "Неверно: приёмка спонсором — часть плана и критериев успеха."],
          ["Ayat signed it as team lead, so the plan counts as approved", "Ayat is the team lead, not the sponsor; the signature belongs to the sponsor.", "Ayat — руководитель команды, а не спонсор; подпись ставит спонсор."],
        ], "Honest answer: the plan is presented for approval at the midterm; the Section 19 signature block is still empty.", "Честный ответ: план представляется на утверждение на мидтерме; блок подписи в разделе 19 пока пуст."),
        qx("Examiner: «Agile and PMBOK together — isn’t that a contradiction?» What is the best answer?", "No: Scrum-like iterations build it, PMBOK structures the plan", [
          ["Yes, so we dropped the baselines and change control", "False: the baselines exist and every change goes through Section 6.", "Неправда: базовые планы есть, и каждое изменение идёт по разделу 6."],
          ["We only use PMBOK, and Agile is just a word we put in the report", "Denies the report, which describes build–review–plan iterations.", "Отрицает отчёт, где описаны итерации «сделать — разобрать — спланировать»."],
          ["The instructor chose the approach, not our team", "Shifts the blame; the report gives the team's own reason, the short timeline.", "Перекладывает ответственность; в отчёте указана своя причина команды — короткий срок."],
        ], "The two work at different levels: Scrum-like iterations for building the product, PMBOK for the structure of planning and control.", "Они работают на разных уровнях: итерации как в Scrum — чтобы строить продукт, PMBOK — для структуры планирования и контроля."),
      ],
    ),
  ],
};
